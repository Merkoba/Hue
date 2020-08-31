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
    if (!data.message) {
      return handler.get_out(socket)
    }

    if (data.message.length > config.max_message_board_post_length) {
      return handler.get_out(socket)
    }

    if (data.message.split("\n").length > config.max_num_newlines) {
      return handler.get_out(socket)
    }

    if (!handler.check_media_permission(socket, "messageboard")) {
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
        if (item.user_id !== socket.hue_user_id) {
          if (
            !handler.check_op_permission(socket, "message_board_delete") &&
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

  // Deletes all message board posts
  handler.public.clear_message_board = async function (socket, data) {
    if (
      !handler.check_op_permission(socket, "message_board_delete") &&
      !socket.hue_superuser
    ) {
      return handler.get_out(socket)
    }

    let room = vars.rooms[socket.hue_room_id]

    room.message_board_posts = []
    db_manager.update_room(socket.hue_room_id, {
      message_board_posts: room.message_board_posts,
    })
    handler.room_emit(socket, "message_board_cleared", {
      username: socket.hue_username,
    })
  }
}
