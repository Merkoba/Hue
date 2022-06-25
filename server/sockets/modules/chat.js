module.exports = function (Hue) {
  // Handles chat messages
  Hue.handler.public.sendchat = async function (socket, data) {
    if (data.message === undefined) {
      return
    }

    if (data.message.length === 0) {
      return
    }

    if (data.message.length > Hue.config.max_input_length) {
      return
    }

    if (data.message.split("\n").length > Hue.config.max_num_newlines) {
      return
    }

    let quote = data.quote || ""
    let quote_username = data.quote_username || ""
    let quote_user_id = data.quote_user_id || ""
    let quote_id = data.quote_id || ""

    if (quote.length > Hue.config.quote_max_length + 10) {
      return
    }

    if (quote.split("\n").length >= 2) {
      return
    }

    if (quote_username.length > Hue.config.max_username_length) {
      return
    }

    if (quote_user_id.length > Hue.sconfig.max_user_id_length) {
      return
    }

    if (quote_id.length > Hue.sconfig.max_message_id_length) {
      return
    }

    let id, date, edited, username, linkdata
    
    if (data.edit_id) {      
      let info = await Hue.db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })

      if (!info) {
        return
      }

      for (let i=0; i<info.log_messages.length; i++) {
        if (info.log_messages[i].data.id === data.edit_id) {
          if (info.log_messages[i].data.user_id !== socket.hue_user_id) {
            return
          }

          if (!linkdata) {
            linkdata = await Hue.handler.process_message_links(data.message)
          }

          info.log_messages[i].data.edited = true
          info.log_messages[i].data.message = data.message
          info.log_messages[i].data.link_title = linkdata.title,
          info.log_messages[i].data.link_description = linkdata.description
          info.log_messages[i].data.link_image = linkdata.image
          info.log_messages[i].data.link_url = linkdata.url
          
          edited = true
          id = data.edit_id
          date = info.log_messages[i].date
          quote = info.log_messages[i].data.quote
          quote_username = info.log_messages[i].data.quote_username
          quote_user_id = info.log_messages[i].data.quote_user_id
          quote_id = info.log_messages[i].data.quote_id
          username = info.log_messages[i].data.username

          await Hue.db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })
          break
        }
      }

      if (!edited) {
        return
      }
    } else {
      date = Date.now()
      id = Hue.handler.generate_message_id()
      username = socket.hue_username
      edited = false
      quote = data.quote
      quote_username = data.quote_username
      quote_user_id = data.quote_user_id
      quote_id = data.quote_id
      likes = []
    }

    if (!linkdata) {
      linkdata = await Hue.handler.process_message_links(data.message)
    }

    Hue.handler.room_emit(socket, "chat_message", {
      id: id,
      user_id: socket.hue_user_id,
      username: username,
      message: data.message,
      date: date,
      link_title: linkdata.title,
      link_description: linkdata.description,
      link_image: linkdata.image,
      link_url: linkdata.url,
      edited: edited,
      just_edited: edited,
      quote: quote,
      quote_username: quote_username,
      quote_user_id: quote_user_id,
      quote_id: quote_id,
      likes: likes
    })

    if (!data.edit_id) {
      let message = {
        type: "chat",
        data: {
          id: id,
          date: date,
          user_id: socket.hue_user_id,
          username: username,
          message: data.message,
          link_title: linkdata.title,
          link_description: linkdata.description,
          link_image: linkdata.image,
          link_url: linkdata.url,
          edited: edited,
          quote: quote,
          quote_username: quote_username,
          quote_user_id: quote_user_id,
          quote_id: quote_id,
          likes: likes
        }
      }

      Hue.db_manager.push_room_item(socket.hue_room_id, "log_messages", message)
    }
  }

  // Handles typing signals
  Hue.handler.public.typing = async function (socket, data) {
    socket.hue_typing_counter += 1

    if (socket.hue_typing_counter >= 50) {
      let spam_ans = await Hue.handler.add_spam(socket)

      if (!spam_ans) {
        return
      }

      socket.hue_typing_counter = 0
    }

    Hue.handler.broadcast_emit(socket, "typing", { user_id: socket.hue_user_id, username: socket.hue_username })
  }

  // Generates IDs for messages
  Hue.handler.generate_message_id = function () {
    return `${Date.now()}_${Hue.utilz.random_sequence(3)}`
  }

  // Deletes a message
  Hue.handler.public.delete_message = async function (socket, data) {
    if (!data.id) {
      return
    }

    if (data.id.length > Hue.sconfig.max_message_id_length) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1, keys: 1 })

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

      if (msg.data.id && msg.data.id == data.id) {
        message = msg
        message_index = i
        message_id = msg.data.id
        message_user_id = msg.data.user_id
        break
      }
    }

    if (message) {
      if (!message.data.user_id) {
        if (!Hue.handler.is_admin_or_op(socket)) {
          return
        }

        deleted = true
        messages.splice(message_index, 1)
      } else if (message.data.user_id !== socket.hue_user_id) {
        if (!Hue.handler.is_admin_or_op(socket)) {
          return
        }
        
        let userinfo = await Hue.db_manager.get_user(
          ["id", message.data.user_id],
          { username: 1 }
        )

        if (!userinfo) {
          Hue.handler.user_emit(socket, "user_not_found", {})
          return
        }

        let id = userinfo.id
        let current_role = info.keys[id] || Hue.vars.default_role
        message_username = userinfo.username

        if (!socket.hue_superuser) {
          if (current_role === "admin") {
            Hue.handler.user_emit(socket, "forbidden_user", {})
            return
          } else if (current_role === "op") {
            if (socket.hue_role !== "admin") {
              Hue.handler.user_emit(socket, "forbidden_user", {})
              return
            }
          } else {
            if (!Hue.handler.is_admin_or_op(socket)) {
              Hue.handler.user_emit(socket, "forbidden_user", {})
              return
            }
          }
        }

        for (let i = 0; i < messages.length; i++) {
          let msg = messages[i]

          if (msg.data.id && msg.data.id == data.id) {
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
        Hue.handler.room_emit(socket, "message_deleted", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: message_id
        })

        if (message_user_id !== socket.hue_user_id && message_username) {
          Hue.handler.push_admin_log_message(socket, `deleted a message from "${message_username}"`)
        }

        Hue.db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })
      }
    }
  }

  // Deletes all messages and remove media
  Hue.handler.public.clear_log = async function (socket, data) {
    if (!Hue.handler.is_admin(socket)) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    Hue.db_manager.update_room(socket.hue_room_id, {log_messages: []})

    Hue.handler.room_emit(socket, "log_cleared", {
      user_id: socket.hue_user_id,
      username: socket.hue_username
    })
    
    await Hue.handler.delete_media_files(socket.hue_room_id, "image")
    await Hue.handler.delete_media_files(socket.hue_room_id, "tv")
    await Hue.handler.push_admin_log_message(socket, "cleared the log")
  }

  // Deletes all messages above a message
  Hue.handler.public.delete_messages_above = async function (socket, data) {
    if (!Hue.handler.is_admin(socket)) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    if (!data.id) {
      return
    }

    if (data.id.length > Hue.sconfig.max_message_id_length) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })

    if (!info) {
      return
    }    

    for (let i=0; i<info.log_messages.length; i++) {
      let message = info.log_messages[i]
      if (message.id === data.id) {
        info.log_messages = info.log_messages.slice(i)

        Hue.handler.room_emit(socket, "deleted_messages_above", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: data.id
        })
        
        Hue.handler.push_admin_log_message(socket, "deleted messages above")
        Hue.db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })        
        return
      }
    }   
  }
  
  // Deletes all messages above a message
  Hue.handler.public.delete_messages_below = async function (socket, data) {
    if (!Hue.handler.is_admin(socket)) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    if (!data.id) {
      return
    }

    if (data.id.length > Hue.sconfig.max_message_id_length) {
      return
    }    

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })

    if (!info) {
      return
    }    

    for (let i=0; i<info.log_messages.length; i++) {
      let message = info.log_messages[i]
      if (message.id === data.id) {
        info.log_messages = info.log_messages.slice(0, i + 1)

        Hue.handler.room_emit(socket, "deleted_messages_below", {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          id: data.id
        })
        
        Hue.handler.push_admin_log_message(socket, "deleted messages below")
        Hue.db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })                
        return
      }
    }   
  }  

  // Like a message
  Hue.handler.public.like_message = async function (socket, data) {
    if (!data.id) {
      return
    }

    if (data.type !== "like" && data.type !== "unlike") {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id], { log_messages: 1 })

    for (let i=0; i<info.log_messages.length; i++) {
      if (info.log_messages[i].id === data.id) {
        if (info.log_messages[i].data.likes) {
          let included = info.log_messages[i].data.likes.some(x => x.user_id === socket.hue_user_id)
          let type

          let obj = {
            date: Date.now(),
            user_id: socket.hue_user_id,
            username: socket.hue_username
          }

          if (!included) {
            if (data.type === "unlike") {
              return
            }

            if (info.log_messages[i].data.likes.length >= Hue.config.max_likes) {
              return
            }

            type = "like"

            info.log_messages[i].data.likes.push(obj)
          } else {
            if (data.type === "like") {
              return
            }

            type = "unlike"

            info.log_messages[i].data.likes = info.log_messages[i].data.likes.filter(x => x.user_id !== socket.hue_user_id)
          }

          await Hue.db_manager.update_room(socket.hue_room_id, { log_messages: info.log_messages })
          Hue.handler.room_emit(socket, "liked_message", {id: data.id, obj: obj, type: type})
        }

        return
      }
    }
  }
}