module.exports = (App) => {
  // Handles topic changes
  App.handler.public.change_topic = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.topic === undefined) {
      return
    }

    if (data.topic.length === 0) {
      return
    }

    if (data.topic.length > App.config.max_topic_length) {
      return
    }

    if (data.topic !== App.utilz.single_space(data.topic)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    if (info.topic === data.topic) {
      return
    }

    info.topic = data.topic

    App.handler.room_emit(socket, `topic_changed`, {
      topic: data.topic,
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })

    App.handler.push_admin_log_message(socket, `changed the topic to "${data.topic}"`)
  }

  // Handles room name changes
  App.handler.public.change_room_name = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (
      (data.name.length === 0) ||
      (data.name.length > App.config.max_room_name_length)
    ) {
      return
    }

    if (data.name !== App.utilz.single_space(data.name)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    if (info.name !== data.name) {
      info.name = data.name

      App.handler.room_emit(socket, `room_name_changed`, {
        name: info.name,
        user_id: socket.hue.user_id,
        username: socket.hue.username,
      })

      App.handler.push_admin_log_message(socket, `changed the room name to "${info.name}"`)
    }
  }

  // Creates initial room objects
  App.handler.create_room_object = (info) => {
    let obj = {
      id: info.id,
      limited: info.limited,
      userlist: {},
    }

    return obj
  }

  // Handles background color changes
  App.handler.public.change_background_color = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.color === undefined) {
      return
    }

    if (data.color !== App.utilz.no_space(data.color)) {
      return
    }

    if (!App.utilz.validate_hex(data.color)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])
    info.background_color = data.color

    App.handler.room_emit(socket, `background_color_changed`, {
      color: data.color,
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })
  }

  // Handles text color changes
  App.handler.public.change_text_color = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.color === undefined) {
      return
    }

    if (data.color !== App.utilz.no_space(data.color)) {
      return
    }

    if (!App.utilz.validate_hex(data.color)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])
    info.text_color = data.color

    App.handler.room_emit(socket, `text_color_changed`, {
      color: data.color,
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })
  }

  // Handles uploaded background images
  App.handler.upload_background = async (socket, data) => {
    if (data.image_file === undefined) {
      return
    }

    if (data.extension === undefined) {
      return
    }

    let size = data.image_file.byteLength / 1024

    if ((size === 0) || (size > App.config.max_image_size)) {
      App.handler.user_emit(socket, `upload_error`, {})
      return
    }

    let file_name = `background.${data.extension}`
    let container = App.i.path.join(App.vars.media_root, `room`, socket.hue.room_id)

    if (!App.i.fs.existsSync(container)) {
      App.i.fs.mkdirSync(container, {recursive: true})
    }

    let path = App.i.path.join(container, file_name)

    try {
      await App.i.fsp.writeFile(path, data.image_file)
      await App.strip_metadata(path)
      await App.handler.do_change_background(socket, file_name, `hosted`)
    }
    catch (err) {
      App.logger.log_error(err)
      App.handler.user_emit(socket, `upload_error`, {})
    }
  }

  // Handles background image source changes
  App.handler.public.change_background_source = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.src === undefined) {
      return
    }

    if (data.src.length > App.config.max_media_source_length) {
      return
    }

    if (data.src === ``) {
      await App.handler.do_change_background(socket, ``, `hosted`)
    }
    else {
      if (!App.utilz.is_url(data.src)) {
        return
      }

      data.src = data.src.replace(/\s/g, ``).replace(/\.gifv/g, `.gif`)
      let extension = App.utilz.get_extension(data.src).toLowerCase()

      if (!extension || !App.utilz.is_image(data.src)) {
        return
      }

      try {
        let full_file = await App.handler.download_media(socket, {
          src: data.src,
          max_size: App.sconfig.max_linked_background_size,
        })

        if (!full_file) {
          return
        }

        await App.handler.upload_background(socket, {
          image_file: full_file,
          extension,
        })
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }
  }

  // Handles limited changes
  App.handler.public.change_limited = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if ((data.limited !== true) && (data.limited !== false)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    if (info.limited === data.limited) {
      return
    }

    info.limited = data.limited
    App.vars.rooms[socket.hue.room_id].limited = info.limited

    App.handler.room_emit(socket, `limited_changed`, {
      limited: data.limited,
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })

    App.handler.push_admin_log_message(socket, `changed limited to "${data.limited}"`)
  }

  // Completes background image changes
  App.handler.do_change_background = async (socket, file_name, type) => {
    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])
    info.background = file_name
    info.background_type = type

    let new_ver = 0

    if (type === `hosted`) {
      let info = await App.db_manager.get_room([`id`, socket.hue.room_id])
      new_ver = (info.background_version || 0) + 1
      info.background_version = new_ver
    }

    App.handler.room_emit(socket, `background_changed`, {
      background: file_name,
      background_type: type,
      background_version: new_ver,
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })

    // Remove left over files
    if (type === `hosted`) {
      let container = App.i.path.join(App.vars.media_root, `room`, socket.hue.room_id)

      try {
        let files = await App.i.fsp.readdir(container)

        for (let file of files) {
          if (file.startsWith(`background`) && (file !== file_name)) {
            let container = App.i.path.join(App.vars.media_root, `room`, socket.hue.room_id)
            let path = App.i.path.join(container, file)

            App.i.fs.unlink(path, (err) => {
              if (err) {
                App.logger.log_error(err)
              }
            })
          }
        }
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }
  }

  App.handler.check_limited = (socket) => {
    let room = App.vars.rooms[socket.hue.room_id]

    if (room.limited) {
      if (!App.handler.is_admin_or_op(socket)) {
        return false
      }
    }

    return true
  }
}