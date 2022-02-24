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
  // Handles topic changes
  handler.public.change_topic = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.topic === undefined) {
      return false
    }

    if (data.topic.length === 0) {
      return false
    }

    if (data.topic.length > config.max_topic_length) {
      return false
    }

    if (data.topic !== utilz.clean_string2(data.topic)) {
      return false
    }

    let info = await db_manager.get_room(["id", socket.hue_room_id], { topic: 1 })

    if (info.topic === data.topic) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      topic: data.topic
    })

    handler.room_emit(socket, "topic_changed", {
      topic: data.topic,
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })

    handler.push_admin_log_message(socket, `changed the topic to "${info.topic}"`)
  }

  // Handles room name changes
  handler.public.change_room_name = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (
      data.name.length === 0 ||
      data.name.length > config.max_room_name_length
    ) {
      return false
    }

    if (data.name !== utilz.clean_string2(data.name)) {
      return false
    }

    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { name: 1 }
    )

    if (info.name !== data.name) {
      info.name = data.name

      handler.room_emit(socket, "room_name_changed", {
        name: info.name,
        user_id: socket.hue_user_id,
        username: socket.hue_username
      })

      db_manager.update_room(info.id, {
        name: info.name,
      })

      handler.push_admin_log_message(socket, `changed the room name to "${info.name}"`)
    }
  }

  // Creates initial room objects
  handler.create_room_object = function (info) {
    let obj = {
      id: info.id,
      userlist: {}
    }

    return obj
  }

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
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })

    handler.push_admin_log_message(socket, `changed the background color to "${data.color}"`)
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
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })

    handler.push_admin_log_message(socket, `changed the text color to "${data.color}"`)
  }

  // Handles uploaded background images
  handler.upload_background = async function (socket, data) {
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

    let file_name = `background.${data.extension}`
    let container = vars.path.join(vars.media_root, "room", socket.hue_room_id)

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = vars.path.join(container, file_name)

    try {
      await vars.fsp.writeFile(path, data.image_file)
      await handler.do_change_background(socket, file_name, "hosted")
    } catch (err) {
      logger.log_error(err)
      handler.user_emit(socket, "upload_error", {})
    }
  }

  // Handles background image source changes
  handler.public.change_background_source = async function (socket, data) {
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

    await handler.do_change_background(socket, data.src, "external")
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
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      background: file_name,
      background_type: type,
      background_version: new_ver
    })

    handler.push_admin_log_message(socket, "changed the background image")

    // Remove left over files
    if (type === "hosted") {
      let container = vars.path.join(vars.media_root, "room", socket.hue_room_id)

      try {
        let files = await vars.fsp.readdir(container)

        for (let file of files) {
          if (file.startsWith("background") && file !== file_name) {
            let container = vars.path.join(vars.media_root, "room", socket.hue_room_id)
            let path = vars.path.join(container, file)

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
    }
  }  
}