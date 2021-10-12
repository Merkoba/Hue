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
  // Handles background color changes
  handler.public.change_background_color = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.color === undefined) {
      return false
    }

    if (data.color !== utilz.clean_string5(data.color)) {
      return false
    }

    if (!utilz.validate_hex(data.color)) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      background_color: data.color,
    })

    handler.room_emit(socket, "background_color_changed", {
      color: data.color,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the background color to "${data.color}"`
    )
  }

  // Handles text color changes
  handler.public.change_text_color = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.color === undefined) {
      return false
    }

    if (data.color !== utilz.clean_string5(data.color)) {
      return false
    }

    if (!utilz.validate_hex(data.color)) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      text_color: data.color,
    })

    handler.room_emit(socket, "text_color_changed", {
      color: data.color,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the text color to "${data.color}"`
    )
  }

  // Handles uploaded background images
  handler.upload_background = function (socket, data) {
    if (data.image_file === undefined) {
      return false
    }

    if (data.extension === undefined) {
      return false
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > config.max_image_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = `${socket.hue_room_id}.${data.extension}`
    let container = vars.background_root

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = vars.path.join(container, file_name)

    vars.fs.writeFile(
      path,
      data.image_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.do_change_background(socket, file_name, "hosted")
        }
      }
    )
  }

  // Handles background image source changes
  handler.public.change_background_source = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.src === undefined) {
      return false
    }

    if (data.src.length === 0) {
      return false
    }

    if (data.src.length > config.max_media_source_length) {
      return false
    }

    if (data.src !== "default") {
      if (!utilz.is_url(data.src)) {
        return false
      }

      data.src = data.src.replace(/\s/g, "").replace(/\.gifv/g, ".gif")

      let extension = utilz.get_extension(data.src).toLowerCase()

      if (!extension || !utilz.image_extensions.includes(extension)) {
        return false
      }
    }

    handler.do_change_background(socket, data.src, "external")
  }

  // Completes background image changes
  handler.do_change_background = async function (socket, file_name, type) {
    let obj = {
      background: file_name,
      background_type: type,
    }

    let new_ver = 0

    if (type === "hosted") {
      let info = await db_manager.get_room(
        ["id", socket.hue_room_id],
        { background_version: 1 }
      )

      new_ver = (info.background_version || 0) + 1
      obj.background_version = new_ver
    }
    
    db_manager.update_room(socket.hue_room_id, obj)

    handler.room_emit(socket, "background_changed", {
      username: socket.hue_username,
      background: file_name,
      background_type: type,
      background_version: new_ver
    })

    handler.push_admin_log_message(socket, "changed the background image")

    // Remove left over files
    if (type === "hosted") {
      vars.fs.readdir(vars.background_root, function (err, files) {
        try {
          if (err) {
            logger.log_error(err)
            return false
          }

          let s = socket.hue_room_id + "."

          for (let file of files) {
            if (file.startsWith(s) && file !== file_name) {
              let path = vars.path.join(vars.background_root, file)

              vars.fs.unlink(path, function (err) {
                if (err) {
                  logger.log_error(err)
                }
              })            
            }
          }
        } catch (err) {
          logger.log_error(err)
        }
      })
    }
  }
}
