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
  // Get a file name using the date and random numbers
  handler.generate_media_file_name = function (extension) {
    return `${Date.now()}_${utilz.random_sequence(3)}.${extension}`
  }

  // Handles sliced media uploads
  handler.upload_media = async function (socket, data, type) {
    if (data.file === undefined) {
      return false
    }

    if (data.extension === undefined) {
      return false
    }

    let size = data.file.byteLength / 1024

    if (size === 0 || size > config[`max_${type}_size`]) {
      return false
    }

    let file_name = handler.generate_media_file_name(data.extension)
    let container = vars.path.join(vars.media_root, "room", socket.hue_room_id, type)

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = vars.path.join(container, file_name)
    
    try {
      await vars.fsp.writeFile(path, data.file)
  
      let obj = {}
  
      obj.src = file_name
      obj.setter = socket.hue_username
      obj.size = size
      obj.type = "upload"
      obj.comment = data.comment
      obj.file_name = data.file_name
  
      await handler.do_change_media(socket, obj, type)
    } catch (err) {
      logger.log_error(err)
      handler.user_emit(socket, "upload_error", {})
    }
  }

  // Completes media source changes
  handler.do_change_media = async function (socket, data, type) {
    let room_id, user_id

    if (typeof socket === "object") {
      room_id = socket.hue_room_id
      user_id = socket.hue_user_id
    } else {
      room_id = socket
      user_id = "none"
    }

    let date = Date.now()
    let comment = data.comment || data.file_name || ""
    let size = data.size || 0
    let title = ""

    if (data.title) {
      title = vars.he.decode(data.title)
    }

    if (data.query === undefined) {
      data.query = ""
    }

    if (!data.setter) {
      user_id = ""
    }

    let id = handler.generate_message_id()

    let obj = {}

    obj[`${type}_id`] = id,
    obj[`${type}_user_id`] = user_id,
    obj[`${type}_source`] = data.src,
    obj[`${type}_setter`] = data.setter,
    obj[`${type}_title`] = title,
    obj[`${type}_size`] = size,
    obj[`${type}_date`] = date,
    obj[`${type}_type`] = data.type,
    obj[`${type}_query`] = data.query,
    obj[`${type}_comment`] = comment,

    db_manager.update_room(room_id, obj)

    handler.room_emit(room_id, `${type}_source_changed`, {
      id: id,
      user_id: user_id,
      source: data.src,
      setter: data.setter,
      title: title,
      size: size,
      date: date,
      type: data.type,
      query: data.query,
      comment: comment,
    })

    let message = {
      id: id,
      type: type,
      date: date,
      data: {
        user_id: user_id,
        source: data.src,
        setter: data.setter,
        title: title,
        size: size,
        type: data.type,
        query: data.query,
        comment: comment,
      }
    }

    db_manager.push_room_item(socket.hue_room_id, "log_messages", message)

    // Remove left over files
    if (data.type === "upload") {
      let container = vars.path.join(vars.media_root, "room", socket.hue_room_id, type)

      try {
        let files = await vars.fsp.readdir(container)

        files.sort().reverse()
  
        for (let file of files.slice(config[`max_stored_${type}`])) {
          let path = vars.path.join(container, file)
  
          vars.fs.unlink(path, function (err) {
            if (err) {
              logger.log_error(err)
            }
          })
        }
      } catch (err) {
        logger.log_error(err)
      }
    }
  }

  // Edit the comment of a media change
  handler.public.edit_media_comment = async function (socket, data) {
    let edited = false
    let info = await db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1, [`${data.type}_id`]: 1})
    let messages = info.log_messages

    for (let i = 0; i < messages.length; i++) {
      let message = messages[i]

      if (message.type !== data.type) {
        continue
      }

      if (message.id === data.id) {
        if (message.data.user_id === socket.hue_user_id) {
          message.data.comment = data.comment
          edited = true
          break
        } else {
          return false
        }
      }
    }

    if (info[`${data.type}_id`] === data.id) {
      let obj = {}
      obj[`${data.type}_comment`] = data.comment      
      db_manager.update_room(socket.hue_room_id, obj)
      edited = true
    }
    
    if (edited) {
      handler.room_emit(socket, "edited_media_comment", {
        type: data.type,
        id: data.id,
        comment: data.comment
      })

      db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })
    }
  }

  // Delete all media files of a certain type from a room
  handler.delete_media_files = async function (room_id, type) {
    let container = vars.path.join(vars.media_root, "room", room_id, type)

    try {
      let files = await vars.fsp.readdir(container)

      for (let file of files) {
        let path = vars.path.join(container, file)
  
        vars.fs.unlink(path, function (err) {
          if (err) {
            logger.log_error(err)
          }
        })
      }
    } catch (err) {
      logger.log_error(err)
    }
  }
}