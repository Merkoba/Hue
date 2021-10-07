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
  handler.upload_background_image = function (socket, data) {
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

    let file_name = `${socket.hue_room_id}_${Date.now()}_${utilz.get_random_int(
      0,
      1000
    )}.${data.extension}`
    
    let container = vars.path.join(vars.images_root, "backgrounds")

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container)
    }

    let path = vars.path.join(container, file_name) 

    vars.fs.writeFile(
      path,
      data.image_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.do_change_background_image(socket, file_name, "hosted")
        }
      }
    )
  }

  // Handles background image source changes
  handler.public.change_background_image_source = function (socket, data) {
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

    handler.do_change_background_image(socket, data.src, "external")
  }

  // Completes background image changes
  handler.do_change_background_image = async function (socket, file_name, type) {
    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { background_image: 1, background_image_type: 1 }
    )

    let to_delete = false

    if (info.background_image !== "") {
      if (info.background_image_type === "hosted") {
        to_delete = info.background_image
      }
    }

    if (file_name === "default") {
      file_name = ""
      type = "hosted"
    }

    db_manager.update_room(socket.hue_room_id, {
      background_image: file_name,
      background_image_type: type,
    })
    

    handler.room_emit(socket, "background_image_changed", {
      username: socket.hue_username,
      background_image: file_name
    })

    if (to_delete) {
      vars.fs.unlink(`${vars.images_root}/${to_delete}`, function (err) {})
    }

    handler.push_admin_log_message(socket, "changed the background image")
  }
}
