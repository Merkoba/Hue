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
      `www.youtube.com/watch?v=$1`,
    )

    data.username = socket.hue.username
    let media_info = await App.handler.get_last_media(socket.hue.room_id, `tv`)

    function not_found() {
      App.handler.user_emit(socket, `video_not_found`, {})
    }

    if (media_info) {
      if ((media_info.source === data.src) || (media_info.query === data.src)) {
        App.handler.user_emit(socket, `same_tv`, {})
        return
      }

      if (Date.now() - media_info.date < App.sconfig.tv_change_cooldown) {
        App.handler.user_emit(socket, `tv_cooldown_wait`, {})
        return
      }
    }

    if (App.utilz.is_url(data.src)) {
      if (App.utilz.is_youtube(data.src)) {
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
            not_found()
            return
          }

          try {
            let k = App.sconfig.youtube_api_key
            let s = `https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${k}`
            let res = await App.vars.fetch(s)
            let json = await res.json()

            if ((json.items !== undefined) && (json.items.length > 0)) {
              data.type = `youtube`
              data.title = json.items[0].snippet.title
              await App.handler.do_change_media(socket, data, `tv`)
              return
            }

            not_found()
            return
          }
          catch (err) {
            not_found()
            App.logger.log_error(err)
            return
          }
        }

        not_found()
        return
      }
      else if (App.utilz.is_twitch(data.src)) {
        if (!App.config.twitch_enabled) {
          return
        }

        let info = App.utilz.get_twitch_id(data.src)

        if (info && (info[0] === `channel`)) {
          data.type = `twitch`
          data.title = info[1]
          await App.handler.do_change_media(socket, data, `tv`)
          return
        }

        not_found()
        return
      }
      else if (App.utilz.is_harambe(data.src)) {
        if (!App.config.harambe_enabled) {
          return
        }

        let [url, name] = App.utilz.get_harambe_url(data.src)

        if (!url || !name) {
          not_found()
          return
        }

        try {
          let data_url = `https://harambe.merkoba.com/data/${name}`
          let res = await App.vars.fetch(data_url)
          let json = await res.json()

          if (json) {
            data.type = `video`
            data.title = json.title || json.filename
            data.src = `https://harambe.merkoba.com/file/${name}`
            data.comment = data.comment || ``
            await App.handler.do_change_media(socket, data, `tv`)
            return
          }
        }
        catch (err) {
          App.logger.log_error(err)
        }
      }

      let extension = App.utilz.get_extension(data.src).toLowerCase()

      if (!extension) {
        return
      }

      let is_media = App.utilz.is_video(data.src) || App.utilz.is_audo(data.src)

      if (!is_media) {
        return
      }

      try {
        if (!App.sconfig.download_tv) {
          let obj = {}

          obj.src = data.src
          obj.username = socket.hue_username
          obj.size = 0
          obj.type = `video`
          obj.title = ``
          obj.comment = data.comment

          await App.handler.do_change_media(socket, obj, `tv`)
          return
        }

        let full_file = await App.handler.download_media(socket, {
          src: data.src,
          max_size: App.sconfig.max_tv_download,
        })

        if (!full_file) {
          return
        }

        let url = new URL(data.src)

        await App.handler.upload_media(socket, {
          file: full_file,
          file_name: `${url.hostname}.${extension}`,
          comment: data.comment,
          extension,
        }, `tv`)
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }
    else {
      if (!App.config.youtube_enabled) {
        return
      }

      try {
        let u = encodeURIComponent(data.src)
        let k = App.sconfig.youtube_api_key
        let s = `https://www.googleapis.com/youtube/v3/search?q=${u}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&videoEmbeddable=true&key=${k}`
        let res = await App.vars.fetch(s)
        let json = await res.json()

        if ((json.items !== undefined) && (json.items.length > 0)) {
          for (let item of json.items) {
            if (
              (item === undefined) ||
              (item.id === undefined) ||
              (item.id.videoId === undefined)
            ) {
              continue
            }

            data.type = `youtube`
            data.query = data.src
            data.src = `https://www.youtube.com/watch?v=${item.id.videoId}`
            data.title = json.items[0].snippet.title
            await App.handler.do_change_media(socket, data, `tv`)
            return
          }

          not_found()
          return
        }
      }
      catch (err) {
        App.logger.log_error(err)
      }

      not_found()
    }
  }

  // Receives a request to ask another user for their tv video progress
  App.handler.public.sync_tv = async (socket, data) => {
    if (!data.username) {
      return
    }

    let sockets = await App.handler.get_user_sockets_per_room_by_username(
      socket.hue.room_id,
      data.username,
    )

    let first_socket

    for (let socc of sockets) {
      if (socc.id === socket.id) {
        continue
      }

      if (socc.hue.login_method === `normal`) {
        first_socket = socc
        break
      }
    }

    if (!first_socket) {
      return
    }

    App.handler.user_emit(first_socket, `report_tv_progress`, {
      requester: socket.id,
      requester_username: socket.hue.username,
      tv_source: data.tv_source,
    })
  }

  // If a user responds this sends the progress to another user
  App.handler.public.report_tv_progress = async (socket, data) => {
    if (!data.requester || !data.progress) {
      return
    }

    let requester_socket = await App.handler.get_room_socket_by_id(
      socket.hue.room_id,
      data.requester,
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