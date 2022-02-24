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
  // Handles image source changes
  handler.public.change_image_source = async function (socket, data) {
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

    let info = db_manager.get_room(["id", socket.hue_room_id], { image_source: 1, image_query: 1, image_date: 1})

    if (info.image_source === data.src || info.image_query === data.src) {
      handler.user_emit(socket, "same_image", {})
      return false
    }

    if (Date.now() - info.image_date < config.image_change_cooldown) {
      handler.user_emit(socket, "image_cooldown_wait", {})
      return false
    }

    data.src = data.src.replace(/\.gifv/g, ".gif")

    if (!utilz.is_url(data.src) && !data.src.startsWith("/")) {
      if (!config.imgur_enabled) {
        return false
      }

      vars
        .fetch_2(
          `https://api.imgur.com/3/gallery/search/?q=${encodeURIComponent(
            data.src
          )}`,
          {
            headers: {
              Authorization: `Client-ID ${sconfig.imgur_client_id}`,
            },
          }
        )

        .then(function (res) {
          return res.json()
        })

        .then(async function (response) {
          if (!response.data || !Array.isArray(response.data)) {
            return false
          }

          for (let item of response.data) {
            if (item) {
              if (item.type) {
                if (item.type.startsWith("image")) {
                  let obj = {}
                  obj.query = data.src
                  obj.src = item.link
                  obj.setter = socket.hue_username
                  obj.size = 0
                  obj.type = "link"
                  obj.comment = data.comment

                  await handler.do_change_media(socket, obj, "image")

                  return
                }
              } else if (item.images) {
                for (let img of item.images) {
                  if (img.type.startsWith("image")) {
                    let obj = {}
                    obj.query = data.src
                    obj.src = img.link
                    obj.setter = socket.hue_username
                    obj.size = 0
                    obj.type = "link"
                    obj.comment = data.comment

                    await handler.do_change_media(socket, obj, "image")

                    return
                  }
                }
              }
            }
          }

          handler.user_emit(socket, "image_not_found", {})
        })

        .catch((err) => {
          logger.log_error(err)
        })
    } else {
      let extension = utilz.get_extension(data.src).toLowerCase()

      if (!extension || !utilz.image_extensions.includes(extension)) {
        return false
      }

      let obj = {}

      obj.src = data.src
      obj.setter = socket.hue_username
      obj.size = 0
      obj.type = "link"
      obj.comment = data.comment

      await handler.do_change_media(socket, obj, "image")
    }
  }
}