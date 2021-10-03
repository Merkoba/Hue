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
  handler.public.change_image_source = function (socket, data) {
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

    if (
      vars.rooms[socket.hue_room_id].current_image_source === data.src ||
      vars.rooms[socket.hue_room_id].current_image_query === data.src
    ) {
      handler.user_emit(socket, "same_image", {})
      return false
    }

    if (
      Date.now() - vars.rooms[socket.hue_room_id].last_image_change <
      config.image_change_cooldown
    ) {
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

        .then(function (response) {
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

                  handler.do_change_image(socket, obj)

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

                    handler.do_change_image(socket, obj)

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

      handler.do_change_image(socket, obj)
    }
  }

  // Handles sliced image uploads
  handler.upload_image = function (socket, data) {
    if (data.image_file === undefined) {
      return false
    }

    if (data.extension === undefined) {
      return false
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > config.max_image_size) {
      return false
    }

    let file_name = `${socket.hue_room_id}_${Date.now()}_${utilz.get_random_int(
      0,
      1000
    )}.${data.extension}`

    vars.fs.writeFile(
      vars.images_root + "/" + file_name,
      data.image_file,
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
            handler.do_change_image(socket, obj)
          } catch (err) {
            logger.log_error(err)
            handler.user_emit(socket, "upload_error", {})
          }
        }
      }
    )
  }

  // Completes image source changes
  handler.do_change_image = function (socket, data) {
    let room_id, user_id

    if (typeof socket === "object") {
      room_id = socket.hue_room_id
      user_id = socket.hue_user_id
    } else {
      room_id = socket
      user_id = "none"
    }

    let image_source
    let date = Date.now()
    let comment = data.comment || ""
    let size = data.size || 0

    if (data.query === undefined) {
      data.query = ""
    }

    if (!data.type) {
      data.type = "link"
    }

    if (!data.setter) {
      user_id = ""
    }

    let image_id = handler.generate_message_id()
    let room = vars.rooms[room_id]

    if (data.type === "link") {
      image_source = data.src

      db_manager.update_room(room_id, {
        image_id: image_id,
        image_user_id: user_id,
        image_source: image_source,
        image_setter: data.setter,
        image_size: size,
        image_date: date,
        image_type: data.type,
        image_query: data.query,
        image_comment: comment,
      })
    } else if (data.type === "upload") {
      image_source = config.public_images_location + data.src
      room.stored_images.unshift(data.src)

      let spliced = false

      if (room.stored_images.length > config.max_stored_images) {
        spliced = room.stored_images.splice(
          config.max_stored_images,
          room.stored_images.length
        )
      }

      db_manager.update_room(room_id, {
        image_id: image_id,
        image_user_id: user_id,
        image_source: image_source,
        image_setter: data.setter,
        image_size: size,
        image_date: date,
        stored_images: room.stored_images,
        image_type: data.type,
        image_query: data.query,
        image_comment: comment,
      })

      if (spliced) {
        for (let file_name of spliced) {
          vars.fs.unlink(`${vars.images_root}/${file_name}`, function (
            err
          ) {})
        }
      }
    } else {
      return false
    }

    if (image_source === undefined) {
      return false
    }

    handler.room_emit(room_id, "image_source_changed", {
      id: image_id,
      user_id: user_id,
      source: image_source,
      setter: data.setter,
      size: size,
      date: date,
      type: data.type,
      query: data.query,
      comment: comment,
    })

    let message = {
      id: image_id,
      type: "image",
      date: date,
      data: {
        user_id: user_id,
        comment: comment,
        source: image_source,
        setter: data.setter,
        size: size,
        type: data.type,
        query: data.query,
      }
    }

    handler.push_log_message(socket, message)

    room.current_image_id = image_id
    room.current_image_user_id = user_id
    room.current_image_source = image_source
    room.current_image_query = data.query
    room.last_image_change = Date.now()
    room.modified = Date.now()
  }

  // Returns an image mime type by checking the extension
  handler.get_content_type = function (file_name) {
    if (typeof file_name !== "string") {
      return "image/jpeg"
    }

    if (file_name.length === 0) {
      return "image/jpeg"
    }

    let split = file_name.split(".")
    let ext = split[split.length - 1]
    let type = utilz.get_image_type(ext)

    if (!type) {
      return "image/jpeg"
    }

    return type
  }
}
