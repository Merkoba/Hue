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

    handler.process_message_links(data.message, function (response) {
      let id, date, edited, username
      let room = vars.rooms[socket.hue_room_id]

      if (data.edit_id) {
        let messages = room.log_messages

        for (let i = 0; i < messages.length; i++) {
          let message = messages[i]

          if (message.type !== "chat") {
            continue
          }

          if (message.id === data.edit_id) {
            if (message.data.user_id === socket.hue_user_id) {
              edited = true
              date = message.date
              username = message.data.username
              message.data.content = data.message
              message.data.edited = true
              message.data.link_title = response.title,
              message.data.link_description = response.description
              message.data.link_image = response.image
              message.data.link_url = response.url        
              room.log_messages_modified = true
              room.activity = true
              break
            } else {
              return false
            }
          }
        }

        if (!edited) {
          return false
        }

        id = data.edit_id
        edited = true
      } else {
        date = Date.now()
        id = handler.generate_message_id()
        username = socket.hue_username
        edited = false
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
          }
        }

        handler.push_log_message(socket, message)
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

    let room = vars.rooms[socket.hue_room_id]
    let messages = room.log_messages
    let message
    let message_id
    let message_user_id
    let message_index
    let message_type
    let message_username
    let deleted = false

    for (let i = 0; i < messages.length; i++) {
      let msg = messages[i]

      if (msg.id && msg.id == data.id) {
        message = msg
        message_index = i
        message_type = msg.type
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

        let info = await db_manager.get_room(
          ["id", socket.hue_room_id],
          { keys: 1 }
        )
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
        room.log_messages_modified = true
        room.activity = true
      }

      if (deleted) {
        handler.room_emit(socket, "message_deleted", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: message_id
        })

        if (
          message_type === "image" ||
          message_type === "tv"
        ) {
          if (room[`current_${message_type}_id`] === message_id) {
            handler[`do_change_${message_type}`](socket, {
              src: "",
              setter: "",
            })
          }
        }

        if (message_user_id !== socket.hue_user_id && message_username) {
          if (message_type === "chat") {
            handler.push_admin_log_message(
              socket,
              `deleted a chat message from "${message_username}"`
            )
          } else if (
            message_type === "image" ||
            message_type === "tv"
          ) {
            let a = "a"

            if (message_type === "image") {
              a = "an"
            }

            let s = `deleted ${a} ${message_type} change from "${message_username}"`
            handler.push_admin_log_message(socket, s)
          }
        }
      }
    }
  }

  // Deletes all messages
  handler.public.clear_log = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    let room = vars.rooms[socket.hue_room_id]
    room.log_messages = []
    room.log_messages_modified = true
    room.activity = true

    handler.room_emit(socket, "log_cleared", {
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })
    
    handler.push_admin_log_message(socket, "cleared the log")    
  }

  // Deletes all messages above a message
  handler.public.delete_messages_above = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (!data.id) {
      return false
    }

    let room = vars.rooms[socket.hue_room_id]

    for (let i=0; i<room.log_messages.length; i++) {
      let message = room.log_messages[i]
      if (message.id === data.id) {
        room.log_messages = room.log_messages.slice(i)
        room.log_messages_modified = true
        room.activity = true

        handler.room_emit(socket, "deleted_messages_above", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: data.id
        })
        
        handler.push_admin_log_message(socket, "deleted messages above")         
        return
      }
    }   
  }
  
  // Deletes all messages above a message
  handler.public.delete_messages_below = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (!data.id) {
      return false
    }

    let room = vars.rooms[socket.hue_room_id]

    for (let i=0; i<room.log_messages.length; i++) {
      let message = room.log_messages[i]
      if (message.id === data.id) {
        room.log_messages = room.log_messages.slice(0, i + 1)
        room.log_messages_modified = true
        room.activity = true

        handler.room_emit(socket, "deleted_messages_below", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: data.id
        })
        
        handler.push_admin_log_message(socket, "deleted messages below")         
        return
      }
    }   
  }  
}