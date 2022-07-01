module.exports = function (Hue) {
  // Handles topic changes
  Hue.handler.public.change_topic = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.topic === undefined) {
      return
    }

    if (data.topic.length === 0) {
      return
    }

    if (data.topic.length > Hue.config.max_topic_length) {
      return
    }

    if (data.topic !== Hue.utilz.single_space(data.topic)) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id])

    if (info.topic === data.topic) {
      return
    }

    info.topic = data.topic

    Hue.handler.room_emit(socket, "topic_changed", {
      topic: data.topic,
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })

    Hue.handler.push_admin_log_message(socket, `changed the topic to "${data.topic}"`)
  }

  // Handles room name changes
  Hue.handler.public.change_room_name = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (
      data.name.length === 0 ||
      data.name.length > Hue.config.max_room_name_length
    ) {
      return
    }

    if (data.name !== Hue.utilz.single_space(data.name)) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id])

    if (info.name !== data.name) {
      info.name = data.name

      Hue.handler.room_emit(socket, "room_name_changed", {
        name: info.name,
        user_id: socket.hue_user_id,
        username: socket.hue_username
      })

      Hue.handler.push_admin_log_message(socket, `changed the room name to "${info.name}"`)
    }
  }

  // Creates initial room objects
  Hue.handler.create_room_object = function (info) {
    let obj = {
      id: info.id,
      userlist: {}
    }

    return obj
  }

  // Handles background color changes
  Hue.handler.public.change_background_color = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.color === undefined) {
      return
    }

    if (data.color !== Hue.utilz.no_space(data.color)) {
      return
    }

    if (!Hue.utilz.validate_hex(data.color)) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id])
    info.background_color = data.color

    Hue.handler.room_emit(socket, "background_color_changed", {
      color: data.color,
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })
  }

  // Handles text color changes
  Hue.handler.public.change_text_color = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.color === undefined) {
      return
    }

    if (data.color !== Hue.utilz.no_space(data.color)) {
      return
    }

    if (!Hue.utilz.validate_hex(data.color)) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id])
    info.text_color = data.color

    Hue.handler.room_emit(socket, "text_color_changed", {
      color: data.color,
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })
  }

  // Handles uploaded background images
  Hue.handler.upload_background = async function (socket, data) {
    if (data.image_file === undefined) {
      return
    }

    if (data.extension === undefined) {
      return
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > Hue.config.max_image_size) {
      Hue.handler.user_emit(socket, "upload_error", {})
      return
    }

    let file_name = `background.${data.extension}`
    let container = Hue.vars.path.join(Hue.vars.media_root, "room", socket.hue_room_id)

    if (!Hue.vars.fs.existsSync(container)) {
      Hue.vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = Hue.vars.path.join(container, file_name)

    try {
      await Hue.vars.fsp.writeFile(path, data.image_file)
      await Hue.handler.do_change_background(socket, file_name, "hosted")
    } catch (err) {
      Hue.logger.log_error(err)
      Hue.handler.user_emit(socket, "upload_error", {})
    }
  }

  // Handles background image source changes
  Hue.handler.public.change_background_source = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.src === undefined) {
      return
    }

    if (data.src.length > Hue.config.max_media_source_length) {
      return
    }

    if (data.src === "") {
      await Hue.handler.do_change_background(socket, "", "hosted")
    } else {
      if (!Hue.utilz.is_url(data.src)) {
        return
      }
  
      data.src = data.src.replace(/\s/g, "").replace(/\.gifv/g, ".gif")
  
      let extension = Hue.utilz.get_extension(data.src).toLowerCase()
  
      if (!extension || !Hue.utilz.image_extensions.includes(extension)) {
        return
      }
  
      await Hue.handler.do_change_background(socket, data.src, "external")
    }
  }

  // Completes background image changes
  Hue.handler.do_change_background = async function (socket, file_name, type) {
    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id])
    info.background = file_name
    info.background_type = type

    let new_ver = 0

    if (type === "hosted") {
      let info = await Hue.db_manager.get_room(["id", socket.hue_room_id])
      new_ver = (info.background_version || 0) + 1
      info.background_version = new_ver
    }

    Hue.handler.room_emit(socket, "background_changed", {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      background: file_name,
      background_type: type,
      background_version: new_ver
    })

    // Remove left over files
    if (type === "hosted") {
      let container = Hue.vars.path.join(Hue.vars.media_root, "room", socket.hue_room_id)

      try {
        let files = await Hue.vars.fsp.readdir(container)

        for (let file of files) {
          if (file.startsWith("background") && file !== file_name) {
            let container = Hue.vars.path.join(Hue.vars.media_root, "room", socket.hue_room_id)
            let path = Hue.vars.path.join(container, file)

            Hue.vars.fs.unlink(path, function (err) {
              if (err) {
                Hue.logger.log_error(err)
              }
            })            
          }
        }
      } catch (err) {
        Hue.logger.log_error(err)
      }
    }
  }  
}