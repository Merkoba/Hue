module.exports = (App) => {
  // Get a file name using the date and random numbers
  App.handler.generate_media_file_name = (extension) => {
    return `${Date.now()}_${App.utilz.random_sequence(3)}.${extension}`
  }

  // Handles sliced media uploads
  App.handler.upload_media = async (socket, data, type) => {
    if (data.file === undefined) {
      return
    }

    if (data.extension === undefined) {
      return
    }

    let size = data.file.byteLength / 1024

    if (size === 0 || size > App.config[`max_${type}_size`]) {
      return
    }

    let file_name = App.handler.generate_media_file_name(data.extension)
    let container = App.i.path.join(App.vars.media_root, `room`, socket.hue_room_id, type)

    if (!App.i.fs.existsSync(container)) {
      App.i.fs.mkdirSync(container, { recursive: true })
    }

    let path = App.i.path.join(container, file_name)

    try {
      await App.i.fsp.writeFile(path, data.file)

      let obj = {}

      obj.src = file_name
      obj.username = socket.hue_username
      obj.size = size
      obj.type = `upload`
      obj.comment = data.comment
      obj.file_name = data.file_name

      await App.handler.do_change_media(socket, obj, type)
    }
    catch (err) {
      App.logger.log_error(err)
      App.handler.user_emit(socket, `upload_error`, {})
    }
  }

  // Completes media source changes
  App.handler.do_change_media = async (socket, data, type) => {
    let room_id, user_id

    if (typeof socket === `object`) {
      room_id = socket.hue_room_id
      user_id = socket.hue_user_id
    }
    else {
      room_id = socket
      user_id = `none`
    }

    let id = App.handler.generate_message_id()
    let date = Date.now()
    let comment = data.comment || data.file_name || ``
    let size = data.size || 0
    let title = ``
    let likes = []

    if (data.title) {
      title = App.i.he.decode(data.title)
    }

    if (data.query === undefined) {
      data.query = ``
    }

    if (!data.username) {
      user_id = ``
    }

    App.handler.room_emit(room_id, `${type}_source_changed`, {
      id: id,
      user_id: user_id,
      source: data.src,
      username: data.username,
      title: title,
      size: size,
      date: date,
      type: data.type,
      query: data.query,
      comment: comment,
      likes: likes
    })

    let message = {
      type: type,
      data: {
        id: id,
        date: date,
        user_id: user_id,
        source: data.src,
        username: data.username,
        title: title,
        size: size,
        type: data.type,
        query: data.query,
        comment: comment,
        likes: likes
      }
    }

    App.db_manager.push_item(`rooms`, socket.hue_room_id, `log_messages`, message)

    // Remove left over files
    if (data.type === `upload`) {
      let container = App.i.path.join(App.vars.media_root, `room`, socket.hue_room_id, type)

      if (!App.i.fs.existsSync(container)) {
        return
      }

      try {
        let files = await App.i.fsp.readdir(container)

        files.sort().reverse()

        for (let file of files.slice(App.sconfig[`max_stored_${type}`])) {
          let path = App.i.path.join(container, file)

          App.i.fs.unlink(path, (err) => {
            if (err) {
              App.logger.log_error(err)
            }
          })
        }
      }
      catch (err) {
        App.logger.log_error(err)
      }
    }
  }

  // Edit the comment of a media change
  App.handler.public.edit_media_comment = async (socket, data) => {
    let edited = false
    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])

    for (let i = 0; i < info.log_messages.length; i++) {
      let message = info.log_messages[i]

      if (message.type !== data.type) {
        continue
      }

      if (message.data.id === data.id) {
        if (message.data.user_id === socket.hue_user_id) {
          message.data.comment = data.comment
          edited = true
          break
        }
        else {
          return
        }
      }
    }

    if (edited) {
      info.modified = Date.now()

      App.handler.room_emit(socket, `edited_media_comment`, {
        type: data.type,
        id: data.id,
        comment: data.comment
      })
    }
  }

  // Delete all media files of a certain type from a room
  App.handler.delete_media_files = async (room_id, type) => {
    let container = App.i.path.join(App.vars.media_root, `room`, room_id, type)

    if (!App.i.fs.existsSync(container)) {
      return
    }

    try {
      let files = await App.i.fsp.readdir(container)

      for (let file of files) {
        let path = App.i.path.join(container, file)

        App.i.fs.unlink(path, (err) => {
          if (err) {
            App.logger.log_error(err)
          }
        })
      }
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }

  // Get the last media object from the message log
  App.handler.get_last_media = async (room_id, type) => {
    let info = await App.db_manager.get_room([`id`, room_id])

    for (let item of info.log_messages.slice(0).reverse()) {
      if (item.type === type) {
        return item.data
      }
    }
  }
}