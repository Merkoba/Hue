module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Handles tv source changes
  handler.public.change_tv_source = async function (socket, data) {
    if (data.src === undefined) {
      return false
    }

    if (data.src.length === 0) {
      return false
    }

    if (data.src.length > config.max_media_source_length) {
      return false
    }

    if (data.query) {
      if (data.query.length > config.safe_limit_1) {
        return false
      }
    }

    if (data.comment) {
      if (data.comment.length > config.max_media_comment_length) {
        return false
      }
    }

    if (data.src !== utilz.clean_string2(data.src)) {
      return false
    }

    data.src = data.src.replace(
      /youtu\.be\/(\w{11})/,
      "www.youtube.com/watch?v=$1"
    )
    data.setter = socket.hue_username

    let info = db_manager.get_room(["id", socket.hue_room_id], { tv_source: 1, tv_query: 1, tv_date: 1})

    if (info.tv_source === data.src || info.tv_query === data.src) {
      handler.user_emit(socket, "same_tv", {})
      return false
    }

    if (Date.now() - info.tv_date < config.tv_change_cooldown) {
      handler.user_emit(socket, "tv_cooldown_wait", {})
      return false
    }

    if (utilz.is_url(data.src)) {
      if (data.src.includes("youtube.com") || data.src.includes("youtu.be")) {
        if (!config.youtube_enabled) {
          return
        }

        let id = utilz.get_youtube_id(data.src)

        if (id) {
          let st
          let pid

          if (id[0] === "video") {
            st = "videos"
            pid = id[1]
          } else if (id[0] === "list") {
            st = "playlists"
            pid = id[1][0]
          } else {
            handler.user_emit(socket, "video_not_found", {})
            return false
          }

          vars
            .fetch_2(
              `https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${sconfig.youtube_api_key}`
            )

            .then(function (res) {
              return res.json()
            })

            .then(function (response) {
              if (response.items !== undefined && response.items.length > 0) {
                data.type = "youtube"
                data.title = response.items[0].snippet.title
                handler.do_change_media(socket, data, "tv")
              } else {
                handler.user_emit(socket, "video_not_found", {})
                return false
              }
            })

            .catch((err) => {
              handler.user_emit(socket, "video_not_found", {})
              logger.log_error(err)
            })
        } else {
          handler.user_emit(socket, "video_not_found", {})
        }
      } 

      else if(data.src.includes("twitch.tv")) {
        let info = utilz.get_twitch_id(data.src)

        if (info && info[0] === "channel") {
          data.type = "twitch"
          data.title = info[1]
          handler.do_change_media(socket, data, "tv")
        } else {
          handler.user_emit(socket, 'video_not_found', {})
          return false
        }
      }
      
      else if (data.src.includes("soundcloud.com")) {
        data.src = data.src.split("#t=")[0]
        data.type = "soundcloud"
        data.title = data.src.replace(/^https?:\/\/soundcloud.com\//, "")

        if (!data.title) {
          data.title = data.src
        }

        handler.do_change_media(socket, data, "tv")
      } else {
        let extension = utilz.get_extension(data.src).toLowerCase()

        if (extension) {
          if (
            utilz.video_extensions.includes(extension) ||
            utilz.audio_extensions.includes(extension)
          ) {
            data.type = "video"
          } else {
            if (!config.iframes_enabled) {
              return
            }

            data.type = "iframe"
          }
        } else {
          if (!config.iframes_enabled) {
            return
          }

          data.type = "iframe"
        }

        data.title = ""

        if (data.type === "iframe") {
          if (sconfig.https_enabled && data.src.includes("http://")) {
            handler.user_emit(socket, "cannot_embed_iframe", {})
            return false
          }

          if ((data.src + "/").includes(sconfig.site_root)) {
            handler.user_emit(socket, "cannot_embed_iframe", {})
            return false
          }

          vars
            .fetch_2(data.src)

            .then((res) => {
              let xframe_options = res.headers.get("x-frame-options") || ""

              xframe_options = xframe_options.toLowerCase()

              if (
                xframe_options === "deny" ||
                xframe_options === "sameorigin"
              ) {
                handler.user_emit(socket, "cannot_embed_iframe", {})
                return false
              } else {
                handler.do_change_media(socket, data, "tv")
              }
            })

            .catch((err) => {
              handler.user_emit(socket, "cannot_embed_iframe", {})
            })
        } else {
          handler.do_change_media(socket, data, "tv")
        }
      }
    } else {
      if (!config.youtube_enabled) {
        return false
      }

      vars
        .fetch_2(
          `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
            data.src
          )}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&videoEmbeddable=true&key=${
            sconfig.youtube_api_key
          }`
        )

        .then(function (res) {
          return res.json()
        })

        .then(function (response) {
          if (response.items !== undefined && response.items.length > 0) {
            for (let item of response.items) {
              if (
                item === undefined ||
                item.id === undefined ||
                item.id.videoId === undefined
              ) {
                continue
              }

              data.type = "youtube"
              data.query = data.src
              data.src = `https://www.youtube.com/watch?v=${item.id.videoId}`
              data.title = response.items[0].snippet.title
              handler.do_change_media(socket, data, "tv")
              return
            }

            handler.user_emit(socket, "video_not_found", {})
            return false
          } else {
            handler.user_emit(socket, "video_not_found", {})
          }
        })

        .catch((err) => {
          logger.log_error(err)
        })
    }
  }

  // Receives a request to ask another user for their tv video progress
  handler.public.sync_tv = function (socket, data) {
    if (!data.username) {
      return false
    }

    let sockets = handler.get_user_sockets_per_room_by_username(
      socket.hue_room_id,
      data.username
    )

    let first_socket

    for (let socc of sockets) {
      if (socc.id === socket.id) {
        continue
      }

      if (socc.hue_login_method === "normal") {
        first_socket = socc
        break
      }
    }

    if (!first_socket) {
      return false
    }

    handler.user_emit(first_socket, "report_tv_progress", {
      requester: socket.id,
      requester_username: socket.hue_username,
      tv_source: data.tv_source
    })
  }

  // If a user responds this sends the progress to another user
  handler.public.report_tv_progress = function (socket, data) {
    if (!data.requester || !data.progress) {
      return false
    }

    let requester_socket = handler.get_room_socket_by_id(
      socket.hue_room_id,
      data.requester
    )

    if (!requester_socket) {
      return false
    }

    handler.user_emit(requester_socket, "receive_tv_progress", {
      progress: data.progress,
      type: data.type,
    })
  }
}