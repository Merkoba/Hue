module.exports = (Hue) => {
  // Handles tv source changes
  Hue.handler.public.change_tv_source = async (socket, data) => {
    if (data.src === undefined) {
      return
    }

    if (data.src.length === 0) {
      return
    }

    if (data.src.length > Hue.config.max_media_source_length) {
      return
    }

    if (data.query) {
      if (data.query.length > Hue.config.safe_limit_1) {
        return
      }
    }

    if (data.comment) {
      if (data.comment.length > Hue.config.max_media_comment_length) {
        return
      }
    }

    if (data.src !== Hue.utilz.single_space(data.src)) {
      return
    }

    data.src = data.src.replace(
      /youtu\.be\/(\w{11})/,
      `www.youtube.com/watch?v=$1`
    )

    data.username = socket.hue_username

    let media_info = await Hue.handler.get_last_media(socket.hue_room_id, `tv`)

    if (media_info) {
      if (media_info.source === data.src || media_info.query === data.src) {
        Hue.handler.user_emit(socket, `same_tv`, {})
        return
      }

      if (Date.now() - media_info.date < Hue.sconfig.tv_change_cooldown) {
        Hue.handler.user_emit(socket, `tv_cooldown_wait`, {})
        return
      }
    }

    if (Hue.utilz.is_url(data.src)) {
      if (data.src.includes(`youtube.com`) || data.src.includes(`youtu.be`)) {
        if (!Hue.config.youtube_enabled) {
          return
        }

        let id = Hue.utilz.get_youtube_id(data.src)

        if (id) {
          let st
          let pid

          if (id[0] === `video`) {
            st = `videos`
            pid = id[1]
          }
          else if (id[0] === `list`) {
            st = `playlists`
            pid = id[1][0]
          }
          else {
            Hue.handler.user_emit(socket, `video_not_found`, {})
            return
          }

          Hue.vars
            .fetch_2(
              `https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${Hue.sconfig.youtube_api_key}`
            )
            .then((res) => {
              return res.json()
            })
            .then(async (response) => {
              if (response.items !== undefined && response.items.length > 0) {
                data.type = `youtube`
                data.title = response.items[0].snippet.title
                await Hue.handler.do_change_media(socket, data, `tv`)
              }
              else {
                Hue.handler.user_emit(socket, `video_not_found`, {})
                return
              }
            })
            .catch((err) => {
              Hue.handler.user_emit(socket, `video_not_found`, {})
              Hue.logger.log_error(err)
            })
        }
        else {
          Hue.handler.user_emit(socket, `video_not_found`, {})
        }
      }
      else if (data.src.includes(`twitch.tv`)) {
        let info = Hue.utilz.get_twitch_id(data.src)

        if (info && info[0] === `channel`) {
          data.type = `twitch`
          data.title = info[1]
          await Hue.handler.do_change_media(socket, data, `tv`)
        }
        else {
          Hue.handler.user_emit(socket, `video_not_found`, {})
          return
        }
      }
      else if (data.src.includes(`soundcloud.com`)) {
        data.src = data.src.split(`#t=`)[0]
        data.type = `soundcloud`
        data.title = data.src.replace(/^https?:\/\/soundcloud.com\//, ``)

        if (!data.title) {
          data.title = data.src
        }

        await Hue.handler.do_change_media(socket, data, `tv`)
      }
      else {
        let extension = Hue.utilz.get_extension(data.src).toLowerCase()

        if (extension) {
          if (
            Hue.utilz.video_extensions.includes(extension) ||
            Hue.utilz.audio_extensions.includes(extension)
          ) {
            data.type = `video`
          }
          else {
            if (!Hue.config.iframes_enabled) {
              return
            }

            data.type = `iframe`
          }
        }
        else {
          if (!Hue.config.iframes_enabled) {
            return
          }

          data.type = `iframe`
        }

        data.title = ``

        if (data.type === `iframe`) {
          if (Hue.sconfig.https_enabled && data.src.includes(`http://`)) {
            Hue.handler.user_emit(socket, `cannot_embed_iframe`, {})
            return
          }

          if ((data.src + `/`).includes(Hue.sconfig.site_root)) {
            Hue.handler.user_emit(socket, `cannot_embed_iframe`, {})
            return
          }

          Hue.vars
            .fetch_2(data.src)
            .then(async (res) => {
              let xframe_options = res.headers.get(`x-frame-options`) || ``

              xframe_options = xframe_options.toLowerCase()

              if (
                xframe_options === `deny` ||
                xframe_options === `sameorigin`
              ) {
                Hue.handler.user_emit(socket, `cannot_embed_iframe`, {})
                return
              }
              else {
                await Hue.handler.do_change_media(socket, data, `tv`)
              }
            })
            .catch((err) => {
              Hue.handler.user_emit(socket, `cannot_embed_iframe`, {})
            })
        }
        else {
          await Hue.handler.do_change_media(socket, data, `tv`)
        }
      }
    }
    else {
      if (!Hue.config.youtube_enabled) {
        return
      }

      Hue.vars
        .fetch_2(
          `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
            data.src
          )}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&videoEmbeddable=true&key=${
            Hue.sconfig.youtube_api_key
          }`
        )
        .then((res) => {
          return res.json()
        })
        .then(async (response) => {
          if (response.items !== undefined && response.items.length > 0) {
            for (let item of response.items) {
              if (
                item === undefined ||
                item.id === undefined ||
                item.id.videoId === undefined
              ) {
                continue
              }

              data.type = `youtube`
              data.query = data.src
              data.src = `https://www.youtube.com/watch?v=${item.id.videoId}`
              data.title = response.items[0].snippet.title
              await Hue.handler.do_change_media(socket, data, `tv`)
              return
            }

            Hue.handler.user_emit(socket, `video_not_found`, {})
            return
          }
          else {
            Hue.handler.user_emit(socket, `video_not_found`, {})
          }
        })
        .catch((err) => {
          Hue.logger.log_error(err)
        })
    }
  }

  // Receives a request to ask another user for their tv video progress
  Hue.handler.public.sync_tv = async (socket, data) => {
    if (!data.username) {
      return
    }

    let sockets = await Hue.handler.get_user_sockets_per_room_by_username(
      socket.hue_room_id,
      data.username
    )

    let first_socket

    for (let socc of sockets) {
      if (socc.id === socket.id) {
        continue
      }

      if (socc.hue_login_method === `normal`) {
        first_socket = socc
        break
      }
    }

    if (!first_socket) {
      return
    }

    Hue.handler.user_emit(first_socket, `report_tv_progress`, {
      requester: socket.id,
      requester_username: socket.hue_username,
      tv_source: data.tv_source
    })
  }

  // If a user responds this sends the progress to another user
  Hue.handler.public.report_tv_progress = async (socket, data) => {
    if (!data.requester || !data.progress) {
      return
    }

    let requester_socket = await Hue.handler.get_room_socket_by_id(
      socket.hue_room_id,
      data.requester
    )

    if (!requester_socket) {
      return
    }

    Hue.handler.user_emit(requester_socket, `receive_tv_progress`, {
      progress: data.progress,
      type: data.type,
    })
  }
}