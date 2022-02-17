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
  // Handles message board posting
  handler.public.message_board_post = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }
    
    if (!data.message) {
      return false
    }

    if (data.message.length > config.max_message_board_post_length) {
      return false
    }

    if (data.message.split("\n").length > config.max_num_newlines) {
      return false
    }

    let item = handler.push_message_board_post(socket, data.message)
    handler.room_emit(socket, "new_message_board_post", item)
  }

  // Pushes pushing room message board posts
  handler.push_message_board_post = function (socket, message) {
    let item = {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      message: message,
      date: Date.now(),
      id: handler.generate_message_board_post_id(),
    }

    db_manager.push_room_item(socket.hue_room_id, "message_board_posts", item)
    return item
  }

  // Generates IDs for message board posts
  handler.generate_message_board_post_id = function () {
    return `${Date.now()}_${utilz.random_sequence(3)}`
  }

  // Deletes a message board post
  handler.public.delete_message_board_post = async function (socket, data) {
    if (!data.id) {
      return false
    }

    let info = await db_manager.get_room(["id", socket.hue_room_id], { message_board_posts: 1, keys: 1 })

    for (let i = 0; i < info.message_board_posts.length; i++) {
      let item = info.message_board_posts[i]

      if (item.id === data.id) {
        let current_role = info.keys[item.user_id] || vars.default_role

        if (item.user_id !== socket.hue_user_id) {
          if (!socket.hue_superuser) {
            if (
              (current_role === "admin" || current_role === "op") &&
              socket.hue_role !== "admin"
            ) {
              handler.user_emit(socket, "forbidden_user", {})
              return false
            }
          }

          if (
            !handler.is_admin_or_op(socket) &&
            !socket.hue_superuser
          ) {
            return false
          }
        }

        info.message_board_posts.splice(i, 1)

        db_manager.update_room(socket.hue_room_id, {
          message_board_posts: info.message_board_posts,
        })

        handler.room_emit(socket, "message_board_post_deleted", {
          id: data.id,
        })

        handler.push_admin_log_message(socket, "deleted a message from the message board")         
        return
      }
    }
  }

  // Remove all message board posts
  handler.public.clear_message_board = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      handler.anti_spam_ban(socket)
      return false
    }
    
    db_manager.update_room(socket.hue_room_id, {message_board_posts: []})

    handler.room_emit(socket, "message_board_cleared", {
      username: socket.hue_username, user_id: socket.hue_user_id
    })

    handler.push_admin_log_message(socket, "cleared the message board")
  }
}
