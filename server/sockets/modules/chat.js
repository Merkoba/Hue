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
  // Handles chat messages
  handler.public.sendchat = function (socket, data) {
    if (data.message === undefined) {
      return false
    }

    if (data.message.length === 0) {
      return false
    }

    if (data.message.length > config.max_input_length) {
      return false
    }

    if (data.message.split("\n").length > config.max_num_newlines) {
      return false
    }

    let quote = data.quote || ""
    let quote_username = data.quote_username || ""
    let quote_user_id = data.quote_user_id || ""
    let quote_id = data.quote_id || ""

    if (quote.length > config.quote_max_length + 10) {
      return false
    }

    if (quote.split("\n").length >= 2) {
      return false
    }

    if (quote_username.length > config.max_username_length) {
      return false
    }

    if (quote_user_id.length > sconfig.max_user_id_length) {
      return false
    }

    if (quote_id.length > sconfig.max_message_id_length) {
      return false
    }

    handler.process_message_links(data.message, async function (response) {
      try {
        let id, date, edited, username
        
        if (data.edit_id) {      
          let info = await db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })
  
          if (!info) {
            return false
          }
  
          for (let i=0; i<info.log_messages.length; i++) {
            if (info.log_messages[i].id === data.edit_id) {
              if (info.log_messages[i].data.user_id !== socket.hue_user_id) {
                return
              }
  
              info.log_messages[i].data.edited = true
              info.log_messages[i].data.content = data.message
              info.log_messages[i].data.link_title = response.title,
              info.log_messages[i].data.link_description = response.description
              info.log_messages[i].data.link_image = response.image
              info.log_messages[i].data.link_url = response.url
              
              edited = true
              id = data.edit_id
              date = info.log_messages[i].date
              quote = info.log_messages[i].data.quote
              quote_username = info.log_messages[i].data.quote_username
              quote_user_id = info.log_messages[i].data.quote_user_id
              quote_id = info.log_messages[i].data.quote_id
              username = info.log_messages[i].data.username        
  
              await db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })
              break
            }
          }
  
          if (!edited) {
            return false
          }
        } else {
          date = Date.now()
          id = handler.generate_message_id()
          username = socket.hue_username
          edited = false
          quote = data.quote
          quote_username = data.quote_username
          quote_user_id = data.quote_user_id
          quote_id = data.quote_id
        }
  
        handler.room_emit(socket, "chat_message", {
          id: id,
          user_id: socket.hue_user_id,
          username: username,
          message: data.message,
          date: date,
          link_title: response.title,
          link_description: response.description,
          link_image: response.image,
          link_url: response.url,
          edited: edited,
          just_edited: edited,
          quote: quote,
          quote_username: quote_username,
          quote_user_id: quote_user_id,
          quote_id: quote_id
        })
  
        if (!data.edit_id) {
          let message = {
            id: id,
            type: "chat",
            date: date,
            data: {
              user_id: socket.hue_user_id,
              username: username,
              content: data.message,
              link_title: response.title,
              link_description: response.description,
              link_image: response.image,
              link_url: response.url,
              edited: edited,
              quote: quote,
              quote_username: quote_username,
              quote_user_id: quote_user_id,
              quote_id: quote_id
            }
          }
  
          db_manager.push_room_item(socket.hue_room_id, "log_messages", message)
        }
      } catch (err) {
        logger.log_error(err)
        return
      }
    })
  }

  // Handles typing signals
  handler.public.typing = async function (socket, data) {
    socket.hue_typing_counter += 1

    if (socket.hue_typing_counter >= 50) {
      let spam_ans = await handler.add_spam(socket)

      if (!spam_ans) {
        return false
      }

      socket.hue_typing_counter = 0
    }

    handler.broadcast_emit(socket, "typing", { user_id: socket.hue_user_id, username: socket.hue_username })
  }

  // Generates IDs for messages
  handler.generate_message_id = function () {
    return `${Date.now()}_${utilz.random_sequence(3)}`
  }

  // Deletes a message
  handler.public.delete_message = async function (socket, data) {
    if (!data.id) {
      return false
    }

    if (data.id.length > sconfig.max_message_id_length) {
      return false
    }

    let info = await db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1, keys: 1 })

    if (!info) {
      return false
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

      if (msg.id && msg.id == data.id) {
        message = msg
        message_index = i
        message_id = msg.id
        message_user_id = msg.data.user_id
        break
      }
    }

    if (message) {
      if (!message.data.user_id) {
        if (!handler.is_admin_or_op(socket)) {
          return false
        }

        deleted = true
        messages.splice(message_index, 1)
      } else if (message.data.user_id !== socket.hue_user_id) {
        if (!handler.is_admin_or_op(socket)) {
          return false
        }
        
        let userinfo = await db_manager.get_user(
          ["id", message.data.user_id],
          { username: 1 }
        )

        if (!userinfo) {
          handler.user_emit(socket, "user_not_found", {})
          return false
        }

        let id = userinfo.id
        let current_role = info.keys[id] || vars.default_role
        message_username = userinfo.username

        if (!socket.hue_superuser) {
          if (
            (current_role === "admin" || current_role === "op") &&
            socket.hue_role !== "admin"
          ) {
            handler.user_emit(socket, "forbidden_user", {})
            return false
          }
        }

        for (let i = 0; i < messages.length; i++) {
          let msg = messages[i]

          if (msg.id && msg.id == data.id) {
            deleted = true
            messages.splice(i, 1)
            break
          }
        }
      } else {
        deleted = true
        messages.splice(message_index, 1)
      }

      if (deleted) {
        handler.room_emit(socket, "message_deleted", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: message_id
        })

        if (message_user_id !== socket.hue_user_id && message_username) {
          handler.push_admin_log_message(socket, `deleted a message from "${message_username}"`)
        }

        db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })
      }
    }
  }

  // Deletes all messages and remove media
  handler.public.clear_log = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      handler.anti_spam_ban(socket)
      return false
    }

    db_manager.update_room(socket.hue_room_id, {log_messages: []})

    handler.room_emit(socket, "log_cleared", {
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })
    
    handler.delete_media_files(socket.hue_room_id, "image")
    handler.delete_media_files(socket.hue_room_id, "tv")
    handler.push_admin_log_message(socket, "cleared the log")
  }

  // Deletes all messages above a message
  handler.public.delete_messages_above = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (!data.id) {
      return false
    }

    if (data.id.length > sconfig.max_message_id_length) {
      return false
    }

    let info = await db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })

    if (!info) {
      return false
    }    

    for (let i=0; i<info.log_messages.length; i++) {
      let message = info.log_messages[i]
      if (message.id === data.id) {
        info.log_messages = info.log_messages.slice(i)

        handler.room_emit(socket, "deleted_messages_above", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: data.id
        })
        
        handler.push_admin_log_message(socket, "deleted messages above")
        db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })        
        return
      }
    }   
  }
  
  // Deletes all messages above a message
  handler.public.delete_messages_below = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (!data.id) {
      return false
    }

    if (data.id.length > sconfig.max_message_id_length) {
      return false
    }    

    let info = await db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })

    if (!info) {
      return false
    }    

    for (let i=0; i<info.log_messages.length; i++) {
      let message = info.log_messages[i]
      if (message.id === data.id) {
        info.log_messages = info.log_messages.slice(0, i + 1)

        handler.room_emit(socket, "deleted_messages_below", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: data.id
        })
        
        handler.push_admin_log_message(socket, "deleted messages below")
        db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })                
        return
      }
    }   
  }  
}