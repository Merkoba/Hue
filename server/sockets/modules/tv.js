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

  // Handles sliced video uploads
  handler.upload_tv_video = function (socket, data) {
    if (data.video_file === undefined) {
      return false
    }

    if (data.extension === undefined) {
      return false
    }

    let size = data.video_file.byteLength / 1024

    if (size === 0 || size > config.max_tv_video_size) {
      return false
    }

    let file_name = `${Date.now()}_${utilz.get_random_int(
      0,
      1000
    )}.${data.extension}`

    let container = vars.path.join(vars.videos_root, socket.hue_room_id)

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container)
    }    

    let path = vars.path.join(container, file_name)

    vars.fs.writeFile(
      path,
      data.video_file,
      function (err) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          let obj = {}

          obj.src = file_name
          obj.setter = socket.hue_username
          obj.size = size
          obj.type = "upload"
          obj.comment = data.comment
          try {
            handler.do_change_tv(socket, obj)
          } catch (err) {
            logger.log_error(err)
            handler.user_emit(socket, "upload_error", {})
          }
        }
      }
    )
  }

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

    if (
      vars.rooms[socket.hue_room_id].current_tv_source === data.src ||
      vars.rooms[socket.hue_room_id].current_tv_query === data.src
    ) {
      handler.user_emit(socket, "same_tv", {})
      return false
    }

    if (
      Date.now() - vars.rooms[socket.hue_room_id].last_tv_change <
      config.tv_change_cooldown
    ) {
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
                handler.do_change_tv(socket, data)
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
        if(!config.twitch_enabled) {
            return false
        }

        let info = utilz.get_twitch_id(data.src)

        if (info && info[0] === "channel") {
          data.type = "twitch"
          data.title = info[1]
          handler.do_change_tv(socket, data)
        } else {
          handler.user_emit(socket, 'video_not_found', {})
          return false
        }
      }
      
      else if (data.src.includes("soundcloud.com")) {
        data.src = data.src.split("#t=")[0]

        if (!config.soundcloud_enabled) {
          return false
        }

        data.type = "soundcloud"
        data.title = data.src.replace(/^https?:\/\/soundcloud.com\//, "")

        if (!data.title) {
          data.title = data.src
        }

        handler.do_change_tv(socket, data)
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
          if (config.https_enabled && data.src.includes("http://")) {
            handler.user_emit(socket, "cannot_embed_iframe", {})
            return false
          }

          if ((data.src + "/").includes(config.site_root)) {
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
                handler.do_change_tv(socket, data)
              }
            })

            .catch((err) => {
              handler.user_emit(socket, "cannot_embed_iframe", {})
            })
        } else {
          handler.do_change_tv(socket, data)
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
              handler.do_change_tv(socket, data)
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

  // Completes tv source changes
  handler.do_change_tv = function (socket, data) {
    let room_id, user_id

    if (typeof socket === "object") {
      room_id = socket.hue_room_id
      user_id = socket.hue_user_id
    } else {
      room_id = socket
      user_id = "none"
    }

    let date = Date.now()
    let comment = data.comment || ""
    let size = data.size || 0
    let tv_title = ""

    if (data.title) {
      tv_title = vars.he.decode(data.title)
    }

    if (data.query === undefined) {
      data.query = ""
    }

    if (!data.setter) {
      user_id = ""
    }

    let tv_id = handler.generate_message_id()
    let room = vars.rooms[room_id]

    if (vars.tv_link_types.includes(data.type)) {
      db_manager.update_room(room_id, {
        tv_id: tv_id,
        tv_user_id: user_id,
        tv_source: data.src,
        tv_setter: data.setter,
        tv_title: tv_title,
        tv_size: size,
        tv_date: date,
        tv_type: data.type,
        tv_query: data.query,
        tv_comment: comment,
      })
    } else if (data.type === "upload") {
      room.stored_videos.unshift(data.src)
      let spliced = false

      if (room.stored_videos.length > config.max_stored_videos) {
        spliced = room.stored_videos.splice(
          config.max_stored_videos,
          room.stored_videos.length
        )
      }

      db_manager.update_room(room_id, {
        tv_id: tv_id,
        tv_user_id: user_id,
        tv_source: data.src,
        tv_setter: data.setter,
        tv_title: tv_title,
        tv_size: size,
        tv_date: date,
        stored_videos: room.stored_videos,
        tv_type: data.type,
        tv_query: data.query,
        tv_comment: comment,
      })

      if (spliced) {
        for (let file_name of spliced) {
          vars.fs.unlink(`${vars.videos_root}/${file_name}`, function (
            err
          ) {})
        }
      }
    } else {
      return false
    }

    handler.room_emit(room_id, "tv_source_changed", {
      id: tv_id,
      user_id: user_id,
      source: data.src,
      setter: data.setter,
      title: tv_title,
      size: size,
      date: date,
      type: data.type,
      query: data.query,
      comment: comment,
    })

    let message = {
      id: tv_id,
      type: "tv",
      date: date,
      data: {
        user_id: user_id,
        comment: comment,
        source: data.src,
        setter: data.setter,
        title: tv_title,        
        size: size,
        type: data.type,
        query: data.query,
      }
    }

    handler.push_log_message(socket, message)

    room.current_tv_id = tv_id
    room.current_tv_user_id = user_id
    room.current_tv_source = data.src
    room.current_tv_query = data.query
    room.last_tv_change = Date.now()
    room.modified = Date.now()    
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
