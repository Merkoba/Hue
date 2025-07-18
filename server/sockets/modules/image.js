module.exports = (App) => {
  // Handles image source changes
  App.handler.public.change_image_source = async (socket, data) => {
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

    function not_found() {
      App.handler.user_emit(socket, `image_not_found`, {})
    }

    let media_info = await App.handler.get_last_media(socket.hue.room_id, `image`)

    if (media_info) {
      if ((media_info.source === data.src) || (media_info.query === data.src)) {
        App.handler.user_emit(socket, `same_image`, {})
        return
      }

      if (Date.now() - media_info.date < App.sconfig.image_change_cooldown) {
        App.handler.user_emit(socket, `image_cooldown_wait`, {})
        return
      }
    }

    data.src = data.src.replace(/\.gifv/g, `.gif`)

    if (App.utilz.is_harambe(data.src)) {
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
          data.type = `link`
          data.title = json.title || json.filename
          data.src = `https://harambe.merkoba.com/file/${name}`
          data.comment = data.comment || ``
          data.username = socket.hue.username
          data.size = 0
          await App.handler.do_change_media(socket, data, `image`)
          return
        }
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }

    if (!App.utilz.is_url(data.src) && !data.src.startsWith(`/`)) {
      if (!App.config.imgur_enabled) {
        return
      }

      try {
        let u = encodeURIComponent(data.src)
        let s = `https://api.imgur.com/3/gallery/search/?q=${u}`

        let h = {
          headers: {
            Authorization: `Client-ID ${App.sconfig.imgur_client_id}`,
          },
        }

        let res = await App.vars.fetch(s, h)
        let json = await res.json()

        if (!json.data || !Array.isArray(json.data)) {
          return
        }

        for (let item of json.data) {
          if (item) {
            if (item.type) {
              if (item.type.startsWith(`image`)) {
                let obj = {}
                obj.query = data.src
                obj.src = item.link
                obj.username = socket.hue.username
                obj.size = 0
                obj.type = `link`
                obj.comment = data.comment

                await App.handler.do_change_media(socket, obj, `image`)
                return
              }
            }
            else if (item.images) {
              for (let img of item.images) {
                if (img.type.startsWith(`image`)) {
                  let obj = {}
                  obj.query = data.src
                  obj.src = img.link
                  obj.username = socket.hue.username
                  obj.size = 0
                  obj.type = `link`
                  obj.comment = data.comment
                  await App.handler.do_change_media(socket, obj, `image`)
                  return
                }
              }
            }
          }
        }

        not_found()
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }
    else {
      let extension = App.utilz.get_extension(data.src).toLowerCase()

      if (!extension || !App.utilz.is_image(data.src)) {
        return
      }

      try {
        if (!App.sconfig.download_image) {
          let obj = {}

          obj.src = data.src
          obj.username = socket.hue_username
          obj.size = 0
          obj.type = `link`
          obj.comment = data.comment

          await App.handler.do_change_media(socket, obj, `image`)
          return
        }

        let full_file = await App.handler.download_media(socket, {
          src: data.src,
          max_size: App.sconfig.max_image_download,
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
        }, `image`)
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }
  }
}