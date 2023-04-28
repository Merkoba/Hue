module.exports = (Hue) => {
  // Handles image source changes
  Hue.handler.public.change_image_source = async (socket, data) => {
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

    let media_info = await Hue.handler.get_last_media(socket.hue_room_id, `image`)

    if (media_info) {
      if (media_info.source === data.src || media_info.query === data.src) {
        Hue.handler.user_emit(socket, `same_image`, {})
        return
      }

      if (Date.now() - media_info.date < Hue.sconfig.image_change_cooldown) {
        Hue.handler.user_emit(socket, `image_cooldown_wait`, {})
        return
      }
    }

    data.src = data.src.replace(/\.gifv/g, `.gif`)

    if (!Hue.utilz.is_url(data.src) && !data.src.startsWith(`/`)) {
      if (!Hue.config.imgur_enabled) {
        return
      }

      Hue.vars
        .fetch_2(
          `https://api.imgur.com/3/gallery/search/?q=${encodeURIComponent(
            data.src
          )}`,
          {
            headers: {
              Authorization: `Client-ID ${Hue.sconfig.imgur_client_id}`,
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

                  await Hue.handler.do_change_media(socket, obj, `image`)

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

                    await Hue.handler.do_change_media(socket, obj, `image`)

                    return
                  }
                }
              }
            }
          }

          Hue.handler.user_emit(socket, `image_not_found`, {})
        })

        .catch((err) => {
          Hue.logger.log_error(err)
        })
    }
    else {
      let extension = Hue.utilz.get_extension(data.src).toLowerCase()

      if (!extension || !Hue.utilz.image_extensions.includes(extension)) {
        return
      }

      let obj = {}

      obj.src = data.src
      obj.username = socket.hue_username
      obj.size = 0
      obj.type = `link`
      obj.comment = data.comment

      await Hue.handler.do_change_media(socket, obj, `image`)
    }
  }
}