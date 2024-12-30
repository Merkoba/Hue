module.exports = (App) => {
  // Handles tv source changes
  App.handler.public.change_tv_source = async (socket, data) => {
    if (data.src === undefined) {
      return
    }

    if (data.src.length === 0) {
      return
    }

    if (data.src.length > App.config.max_media_source_length) {
      return
    }

    if (data.query) {
      if (data.query.length > App.config.safe_limit_1) {
        return
      }
    }

    if (data.comment) {
      if (data.comment.length > App.config.max_media_comment_length) {
        return
      }
    }

    if (data.src !== App.utilz.single_space(data.src)) {
      return
    }

    data.src = data.src.replace(
      /youtu\.be\/(\w{11})/,
      `www.youtube.com/watch?v=$1`
    )

    data.username = socket.hue_username

    let media_info = await App.handler.get_last_media(socket.hue_room_id, `tv`)

    if (media_info) {
      if (media_info.source === data.src || media_info.query === data.src) {
        App.handler.user_emit(socket, `same_tv`, {})
        return
      }

      if (Date.now() - media_info.date < App.sconfig.tv_change_cooldown) {
        App.handler.user_emit(socket, `tv_cooldown_wait`, {})
        return
      }
    }

    if (App.utilz.is_url(data.src)) {
      if (data.src.includes(`youtube.com`) || data.src.includes(`youtu.be`)) {
        if (!App.config.youtube_enabled) {
          return
        }

        let id = App.utilz.get_youtube_id(data.src)

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
            App.handler.user_emit(socket, `video_not_found`, {})
            return
          }

          App.vars.fetch(
            `https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${App.sconfig.youtube_api_key}`
          )
          .then((res) => {
            return res.json()
          })
          .then(async (response) => {
            if (response.items !== undefined && response.items.length > 0) {
              data.type = `youtube`
              data.title = response.items[0].snippet.title
              await App.handler.do_change_media(socket, data, `tv`)
            }
            else {
              App.handler.user_emit(socket, `video_not_found`, {})
              return
            }
          })
          .catch((err) => {
            App.handler.user_emit(socket, `video_not_found`, {})
            App.logger.log_error(err)
          })
        }
        else {
          App.handler.user_emit(socket, `video_not_found`, {})
        }
      }
      else if (data.src.includes(`twitch.tv`)) {
        let info = App.utilz.get_twitch_id(data.src)

        if (info && info[0] === `channel`) {
          data.type = `twitch`
          data.title = info[1]
          await App.handler.do_change_media(socket, data, `tv`)
        }
        else {
          App.handler.user_emit(socket, `video_not_found`, {})
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

        await App.handler.do_change_media(socket, data, `tv`)
      }
      else {
        let extension = App.utilz.get_extension(data.src).toLowerCase()

        if (extension) {
          if (
            App.utilz.video_extensions.includes(extension) ||
            App.utilz.audio_extensions.includes(extension)
          ) {
            data.type = `video`
          }
          else {
            return
          }
        }
        else {
          return
        }

        let head_res = await App.vars.fetch(data.src, {
          method: `HEAD`,
        })

        if (!head_res.ok) {
          App.logger.log_error(`Failed to fetch video headers: ${head_res.statusText}`)
          return
        }

        let content_length = head_res.headers.get(`Content-Length`)
        let max_size = 1024 * 1024 * App.config.max_linked_video_size

        if (content_length && parseInt(content_length) > max_size) {
          App.logger.log_error(`Video is too large: ${content_length} bytes`)
          return
        }

        if (content_length && parseInt(content_length) > max_size) {
          App.logger.log_error(`Video is too large: ${content_length} bytes`)
          return
        }

        let res = await App.vars.fetch(data.src, {
          method: `GET`,
          size: max_size,
        })

        if (!res.ok) {
          App.logger.log_error(`Failed to fetch video: ${res.statusText}`)
          return
        }

        let full_file = Buffer.from(new Uint8Array(await res.arrayBuffer()))
        let url = new URL(data.src)

        await App.handler.upload_media(socket, {
          file: full_file,
          file_name: `${url.hostname}.${extension}`,
          comment: data.comment,
          extension,
        }, `tv`)
      }
    }
    else {
      if (!App.config.youtube_enabled) {
        return
      }

      App.vars.fetch(
        `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
          data.src
        )}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&videoEmbeddable=true&key=${
          App.sconfig.youtube_api_key
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
            await App.handler.do_change_media(socket, data, `tv`)
            return
          }

          App.handler.user_emit(socket, `video_not_found`, {})
          return
        }
        else {
          App.handler.user_emit(socket, `video_not_found`, {})
        }
      })
      .catch((err) => {
        App.logger.log_error(err)
      })
    }
  }

  // Receives a request to ask another user for their tv video progress
  App.handler.public.sync_tv = async (socket, data) => {
    if (!data.username) {
      return
    }

    let sockets = await App.handler.get_user_sockets_per_room_by_username(
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

    App.handler.user_emit(first_socket, `report_tv_progress`, {
      requester: socket.id,
      requester_username: socket.hue_username,
      tv_source: data.tv_source
    })
  }

  // If a user responds this sends the progress to another user
  App.handler.public.report_tv_progress = async (socket, data) => {
    if (!data.requester || !data.progress) {
      return
    }

    let requester_socket = await App.handler.get_room_socket_by_id(
      socket.hue_room_id,
      data.requester
    )

    if (!requester_socket) {
      return
    }

    App.handler.user_emit(requester_socket, `receive_tv_progress`, {
      progress: data.progress,
      type: data.type,
    })
  }
}