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
    let room = vars.rooms[socket.hue_room_id]
    let item = {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      message: message,
      date: Date.now(),
      id: handler.generate_message_board_post_id(),
    }

    room.message_board_posts.push(item)

    if (room.message_board_posts.length > config.max_message_board_posts) {
      room.message_board_posts = room.message_board_posts.slice(
        room.message_board_posts.length - config.max_message_board_posts
      )
    }

    db_manager.update_room(socket.hue_room_id, {
      message_board_posts: room.message_board_posts,
    })

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

    let room = vars.rooms[socket.hue_room_id]

    for (let i = 0; i < room.message_board_posts.length; i++) {
      let item = room.message_board_posts[i]

      if (item.id === data.id) {
        let info = await db_manager.get_room(
          { _id: socket.hue_room_id },
          { keys: 1 }
        )
        
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

        room.message_board_posts.splice(i, 1)

        db_manager.update_room(socket.hue_room_id, {
          message_board_posts: room.message_board_posts,
        })

        handler.room_emit(socket, "message_board_post_deleted", {
          id: data.id,
        })

        break
      }
    }
  }
}
