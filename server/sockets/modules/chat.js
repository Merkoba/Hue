module.exports = (App) => {
  // Handles chat messages
  App.handler.public.sendchat = async (socket, data) => {
    if (!App.handler.check_limited(socket)) {
      App.handler.add_spam(socket, App.vars.limited_spam)
      return
    }

    if (data.message === undefined) {
      return
    }

    if (data.message.length === 0) {
      return
    }

    if (data.message.length > App.config.max_input_length) {
      return
    }

    // Return if too spammy
    let spam_level = App.handler.get_spam_level(socket)

    if (spam_level >= App.sconfig.anti_spam_chat_limit) {
      return
    }

    let lines = data.message.split(`\n`)

    if (lines.length > App.config.max_num_newlines) {
      return
    }

    // Add spam every other line
    if (lines.length > 1) {
      let n = parseInt(lines.length / 2)
      App.handler.add_spam(socket, n)
    }

    // Add chunk spam
    if (data.message.length >= App.sconfig.anti_spam_chat_chunks) {
      let n = parseInt(data.message.length / App.sconfig.anti_spam_chat_chunks)
      App.handler.add_spam(socket, n)
    }

    // Check last message date spam
    if (Date.now() - socket.hue.last_chat_message <= App.sconfig.anti_spam_chat_delay) {
      App.handler.add_spam(socket)
    }

    let quote = data.quote || ``
    let quote_username = data.quote_username || ``
    let quote_user_id = data.quote_user_id || ``
    let quote_id = data.quote_id || ``

    if (quote.length > App.config.quote_max_length + 10) {
      return
    }

    if (quote.split(`\n`).length >= 2) {
      return
    }

    if (quote_username.length > App.config.max_username_length) {
      return
    }

    if (quote_user_id.length > App.sconfig.max_user_id_length) {
      return
    }

    if (quote_id.length > App.sconfig.max_message_id_length) {
      return
    }

    let id, date, edited, username, linkdata, likes

    if (data.edit_id) {
      let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

      if (!info) {
        return
      }

      for (let i = 0; i < info.log_messages.length; i++) {
        if (info.log_messages[i].data.id === data.edit_id) {
          if (info.log_messages[i].data.user_id !== socket.hue.user_id) {
            return
          }

          if (!linkdata) {
            linkdata = await App.handler.process_message_links(data.message)
          }

          info.log_messages[i].data.edited = true
          info.log_messages[i].data.message = data.message
          info.log_messages[i].data.link_title = linkdata.title,
          info.log_messages[i].data.link_description = linkdata.description
          info.log_messages[i].data.link_image = linkdata.image
          info.log_messages[i].data.link_url = linkdata.url
          info.modified = Date.now()

          date = info.log_messages[i].data.date
          id = data.edit_id
          username = info.log_messages[i].data.username
          edited = true
          quote = info.log_messages[i].data.quote
          quote_username = info.log_messages[i].data.quote_username
          quote_user_id = info.log_messages[i].data.quote_user_id
          quote_id = info.log_messages[i].data.quote_id
          likes = info.log_messages[i].data.likes

          break
        }
      }

      if (!edited) {
        return
      }
    }
    else {
      date = Date.now()
      id = App.handler.generate_message_id()
      username = socket.hue.username
      edited = false
      quote = data.quote
      quote_username = data.quote_username
      quote_user_id = data.quote_user_id
      quote_id = data.quote_id
      likes = []
    }

    if (!linkdata) {
      linkdata = await App.handler.process_message_links(data.message)
    }

    App.handler.room_emit(socket, `chat_message`, {
      id,
      user_id: socket.hue.user_id,
      username,
      message: data.message,
      date,
      link_title: linkdata.title,
      link_description: linkdata.description,
      link_image: linkdata.image,
      link_url: linkdata.url,
      edited,
      just_edited: edited,
      quote,
      quote_username,
      quote_user_id,
      quote_id,
      likes,
    })

    if (!data.edit_id) {
      let message = {
        type: `chat`,
        data: {
          id,
          date,
          user_id: socket.hue.user_id,
          username,
          message: data.message,
          link_title: linkdata.title,
          link_description: linkdata.description,
          link_image: linkdata.image,
          link_url: linkdata.url,
          edited,
          quote,
          quote_username,
          quote_user_id,
          quote_id,
          likes,
        },
      }

      App.db_manager.push_item(`rooms`, socket.hue.room_id, `log_messages`, message)
    }

    // Update last message date
    App.handler.modify_socket_properties(socket.hue.user_id, {last_chat_message: Date.now()})
  }

  // Generates IDs for messages
  App.handler.generate_message_id = () => {
    return `${Date.now()}_${App.utilz.random_sequence(3)}`
  }

  // Deletes a message
  App.handler.public.delete_message = async (socket, data) => {
    if (!data.id) {
      return
    }

    if (data.id.length > App.sconfig.max_message_id_length) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    if (!info) {
      return
    }

    let messages = info.log_messages

    let message
    let message_id
    let message_user_id
    let message_index
    let message_username
    let deleted = false

    for (let i = 0; i < messages.length; i++) {
      let msg = messages[i]

      if (msg.data.id && (msg.data.id === data.id)) {
        message = msg
        message_index = i
        message_id = msg.data.id
        message_user_id = msg.data.user_id
        break
      }
    }

    if (message) {
      if (!message.data.user_id) {
        if (!App.handler.is_admin_or_op(socket)) {
          return
        }

        deleted = true
        messages.splice(message_index, 1)
      }
      else if (message.data.user_id !== socket.hue.user_id) {
        if (!App.handler.is_admin_or_op(socket)) {
          return
        }

        let userinfo = await App.db_manager.get_user([`id`, message.data.user_id])

        if (!userinfo) {
          App.handler.user_emit(socket, `user_not_found`, {})
          return
        }

        let id = userinfo.id
        let current_role = info.keys[id] || App.vars.default_role
        message_username = userinfo.username

        if (!socket.hue.superuser) {
          if (current_role === `admin`) {
            App.handler.user_emit(socket, `forbidden_user`, {})
            return
          }
          else if (current_role === `op`) {
            if (socket.hue.role !== `admin`) {
              App.handler.user_emit(socket, `forbidden_user`, {})
              return
            }
          }
          else if (!App.handler.is_admin_or_op(socket)) {
            App.handler.user_emit(socket, `forbidden_user`, {})
            return
          }
        }

        for (let i = 0; i < messages.length; i++) {
          let msg = messages[i]

          if (msg.data.id && (msg.data.id === data.id)) {
            deleted = true
            messages.splice(i, 1)
            break
          }
        }
      }
      else {
        deleted = true
        messages.splice(message_index, 1)
      }

      if (deleted) {
        info.modified = Date.now()

        App.handler.room_emit(socket, `message_deleted`, {
          user_id: socket.hue.user_id,
          username: socket.hue.username,
          id: message_id,
        })

        if ((message_user_id !== socket.hue.user_id) && message_username) {
          App.handler.push_admin_log_message(socket, `deleted a message from "${message_username}"`)
        }
      }
    }
  }

  // Deletes all messages and remove media
  App.handler.public.clear_log = async (socket, data) => {
    if (!App.handler.is_admin(socket)) {
      App.handler.anti_spam_ban(socket)
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])
    info.log_messages = []

    App.handler.room_emit(socket, `log_cleared`, {
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })

    await App.handler.delete_media_files(socket.hue.room_id, `image`)
    await App.handler.delete_media_files(socket.hue.room_id, `tv`)
    await App.handler.push_admin_log_message(socket, `cleared the log`)
  }

  // Deletes all messages above a message
  App.handler.public.delete_messages_above = async (socket, data) => {
    if (!App.handler.is_admin(socket)) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (!data.id) {
      return
    }

    if (data.id.length > App.sconfig.max_message_id_length) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    if (!info) {
      return
    }

    for (let i = 0; i < info.log_messages.length; i++) {
      let message = info.log_messages[i]
      if (message.data.id === data.id) {
        info.log_messages = info.log_messages.slice(i)

        App.handler.room_emit(socket, `deleted_messages_above`, {
          user_id: socket.hue.user_id,
          username: socket.hue.username,
          id: data.id,
        })

        App.handler.push_admin_log_message(socket, `deleted messages above`)
        return
      }
    }
  }

  // Deletes all messages above a message
  App.handler.public.delete_messages_below = async (socket, data) => {
    if (!App.handler.is_admin(socket)) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (!data.id) {
      return
    }

    if (data.id.length > App.sconfig.max_message_id_length) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    if (!info) {
      return
    }

    for (let i = 0; i < info.log_messages.length; i++) {
      let message = info.log_messages[i]
      if (message.data.id === data.id) {
        info.log_messages = info.log_messages.slice(0, i + 1)

        App.handler.room_emit(socket, `deleted_messages_below`, {
          user_id: socket.hue.user_id,
          username: socket.hue.username,
          id: data.id,
        })

        App.handler.push_admin_log_message(socket, `deleted messages below`)
        return
      }
    }
  }

  // Like or Unlike a message
  App.handler.public.like_message = async (socket, data) => {
    if (!data.id) {
      return
    }

    if ((data.type !== `like`) && (data.type !== `unlike`)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    for (let i = 0; i < info.log_messages.length; i++) {
      if (info.log_messages[i].data.id === data.id) {
        if (info.log_messages[i].data.likes) {
          let included = info.log_messages[i].data.likes.some(x => x.user_id === socket.hue.user_id)
          let type

          let obj = {
            date: Date.now(),
            user_id: socket.hue.user_id,
            username: socket.hue.username,
          }

          if (!included) {
            if (data.type === `unlike`) {
              return
            }

            if (info.log_messages[i].data.likes.length >= App.config.max_likes) {
              return
            }

            type = `like`

            info.log_messages[i].data.likes.push(obj)
          }
          else {
            if (data.type === `like`) {
              return
            }

            type = `unlike`

            info.log_messages[i].data.likes = info.log_messages[i].data.likes.filter(x => x.user_id !== socket.hue.user_id)
          }

          info.modified = Date.now()
          App.handler.room_emit(socket, `liked_message`, {id: data.id, obj, type})
        }

        return
      }
    }
  }
}