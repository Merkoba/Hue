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

    let media_info = await App.handler.get_last_media(socket.hue_room_id, `image`)

    if (media_info) {
      if (media_info.source === data.src || media_info.query === data.src) {
        App.handler.user_emit(socket, `same_image`, {})
        return
      }

      if (Date.now() - media_info.date < App.sconfig.image_change_cooldown) {
        App.handler.user_emit(socket, `image_cooldown_wait`, {})
        return
      }
    }

    data.src = data.src.replace(/\.gifv/g, `.gif`)

    if (!App.utilz.is_url(data.src) && !data.src.startsWith(`/`)) {
      if (!App.config.imgur_enabled) {
        return
      }

      App.vars.fetch(
        `https://api.imgur.com/3/gallery/search/?q=${encodeURIComponent(
          data.src
        )}`,
        {
          headers: {
            Authorization: `Client-ID ${App.sconfig.imgur_client_id}`,
          },
        }
      )
      .then((res) => {
        return res.json()
      })
      .then(async (response) => {
        if (!response.data || !Array.isArray(response.data)) {
          return
        }

        for (let item of response.data) {
          if (item) {
            if (item.type) {
              if (item.type.startsWith(`image`)) {
                let obj = {}
                obj.query = data.src
                obj.src = item.link
                obj.username = socket.hue_username
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
                  obj.username = socket.hue_username
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

        App.handler.user_emit(socket, `image_not_found`, {})
      })
      .catch((err) => {
        App.logger.log_error(err)
      })
    }
    else {
      let extension = App.utilz.get_extension(data.src).toLowerCase()

      if (!extension || !App.utilz.image_extensions.includes(extension)) {
        return
      }

      let head_res = await App.vars.fetch(data.src, {
        method: `HEAD`,
      })

      if (!head_res.ok) {
        App.logger.log_error(`Failed to fetch image headers: ${head_res.statusText}`)
        return
      }

      let content_length = head_res.headers.get(`Content-Length`)
      let max_size = 1024 * 1024 * App.config.max_linked_image_size

      if (content_length && parseInt(content_length) > max_size) {
        App.logger.log_error(`Image is too large: ${content_length} bytes`)
        return
      }

      if (content_length && parseInt(content_length) > max_size) {
        App.logger.log_error(`Image is too large: ${content_length} bytes`)
        return
      }

      let res = await App.vars.fetch(data.src, {
        method: `GET`,
        size: max_size,
      })

      if (!res.ok) {
        App.logger.log_error(`Failed to fetch image: ${res.statusText}`)
        return
      }

      let full_file = Buffer.from(new Uint8Array(await res.arrayBuffer()))
      let url = new URL(data.src)

      await App.handler.upload_media(socket, {
        file: full_file,
        file_name: `${url.hostname}.${extension}`,
        comment: data.comment,
        extension,
      }, `image`)
    }
  }
}