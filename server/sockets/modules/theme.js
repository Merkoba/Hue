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

  // Handles background mode changes
  handler.public.change_background_mode = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (
      data.mode !== "normal" &&
      data.mode !== "tiled" &&
      data.mode !== "solid"
    ) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      background_mode: data.mode,
    })

    handler.room_emit(socket, "background_mode_changed", {
      mode: data.mode,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the background mode to "${data.mode}"`
    )
  }

  // Handles background effect changes
  handler.public.change_background_effect = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (
      data.effect !== "none" &&
      data.effect !== "blur" &&
      data.effect !== "grayscale" &&
      data.effect !== "saturate" &&
      data.effect !== "brightness" &&
      data.effect !== "invert" &&
      data.effect !== "zoom"
    ) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      background_effect: data.effect,
    })

    handler.room_emit(socket, "background_effect_changed", {
      effect: data.effect,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the background effect to "${data.effect}"`
    )
  }

  // Handles background tile dimension changes
  handler.public.change_background_tile_dimensions = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.dimensions.length > config.safe_limit_1) {
      return false
    }

    if (data.dimensions !== utilz.clean_string2(data.dimensions)) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      background_tile_dimensions: data.dimensions,
    })

    handler.room_emit(socket, "background_tile_dimensions_changed", {
      dimensions: data.dimensions,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the background tile dimensions to "${data.dimensions}"`
    )
  }

  // Handles text color mode changes
  handler.public.change_text_color_mode = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.mode !== "automatic" && data.mode !== "custom") {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      text_color_mode: data.mode,
    })

    handler.room_emit(socket, "text_color_mode_changed", {
      mode: data.mode,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the text color mode to "${data.mode}"`
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

    let fname = `bg_${socket.hue_room_id}_${Date.now()}_${utilz.get_random_int(
      0,
      1000
    )}.${data.extension}`

    vars.fs.writeFile(
      vars.images_root + "/" + fname,
      data.image_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.do_change_background_image(socket, fname, "hosted")
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
  handler.do_change_background_image = async function (socket, fname, type) {
    let info = await db_manager.get_room(
      { _id: socket.hue_room_id },
      { background_image: 1, background_image_type: 1 }
    )
    let image_url

    if (type === "hosted") {
      image_url = config.public_images_location + fname
    } else {
      image_url = fname
    }

    let to_delete = false

    if (info.background_image !== "") {
      if (info.background_image_type === "hosted") {
        to_delete = info.background_image
      }
    }

    if (fname === "default") {
      fname = ""
      image_url = ""
      type = "hosted"
    }

    let date = Date.now()

    await db_manager.update_room(socket.hue_room_id, {
      background_image: fname,
      background_image_type: type,
      background_image_setter: socket.hue_username,
      background_image_date: date,
    })

    handler.room_emit(socket, "background_image_changed", {
      username: socket.hue_username,
      background_image: image_url,
      background_image_setter: socket.hue_username,
      background_image_date: date,
    })

    if (to_delete) {
      vars.fs.unlink(`${vars.images_root}/${to_delete}`, function (err) {})
    }

    handler.push_admin_log_message(socket, "changed the background image")
  }
}
