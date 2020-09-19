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
  // Handles topic changes
  handler.public.change_topic = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return handler.get_out(socket)
    }

    if (data.topic === undefined) {
      return handler.get_out(socket)
    }

    if (data.topic.length === 0) {
      return handler.get_out(socket)
    }

    if (data.topic.length > config.max_topic_length) {
      return handler.get_out(socket)
    }

    if (data.topic !== utilz.clean_string2(data.topic)) {
      return handler.get_out(socket)
    }

    let room = vars.rooms[socket.hue_room_id]

    if (data.topic === room.topic) {
      return false
    }

    let info = {}

    info.topic = data.topic
    info.topic_setter = socket.hue_username
    info.topic_date = Date.now()

    db_manager.update_room(socket.hue_room_id, {
      topic: info.topic,
      topic_setter: info.topic_setter,
      topic_date: info.topic_date,
    })

    handler.room_emit(socket, "topic_change", {
      topic: info.topic,
      topic_setter: info.topic_setter,
      topic_date: info.topic_date,
    })

    room.topic = info.topic

    handler.push_admin_log_message(
      socket,
      `changed the topic to "${info.topic}"`
    )
  }

  // Handles room name changes
  handler.public.change_room_name = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return handler.get_out(socket)
    }

    if (
      data.name.length === 0 ||
      data.name.length > config.max_room_name_length
    ) {
      return handler.get_out(socket)
    }

    if (data.name !== utilz.clean_string2(data.name)) {
      return handler.get_out(socket)
    }

    let info = await db_manager.get_room(
      { _id: socket.hue_room_id },
      { name: 1 }
    )

    if (info.name !== data.name) {
      info.name = data.name

      handler.room_emit(socket, "room_name_changed", {
        name: info.name,
        username: socket.hue_username,
      })

      db_manager.update_room(info._id, {
        name: info.name,
      })

      vars.rooms[socket.hue_room_id].name = info.name

      handler.push_admin_log_message(
        socket,
        `changed the room name to "${info.name}"`
      )
    }
  }

  // Clears log messages
  handler.public.clear_log = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return handler.get_out(socket)
    }

    if (data.type === undefined || data.id === undefined) {
      return handler.get_out(socket)
    }

    if (!utilz.clear_log_types.includes(data.type)) {
      return handler.get_out(socket)
    }

    if (data.type === "above" || data.type === "below") {
      if (!data.id) {
        return handler.get_out(socket)
      }
    }

    let room = vars.rooms[socket.hue_room_id]

    if (room.log_messages.length === 0) {
      handler.user_emit(socket, "nothing_to_clear", {})
      return false
    }

    if (data.type === "all") {
      room.log_messages = []
    } else if (data.type === "above" || data.type === "below") {
      let index = false

      for (let message of room.log_messages) {
        if (message.id === data.id) {
          index = room.log_messages.indexOf(message)
          break
        }
      }

      if (index === false) {
        handler.user_emit(socket, "nothing_to_clear", {})
        return false
      }

      if (data.type === "above") {
        if (index === 0) {
          handler.user_emit(socket, "nothing_to_clear", {})
          return false
        }

        room.log_messages = room.log_messages.slice(index)
      } else if (data.type === "below") {
        if (index === room.log_messages.length - 1) {
          handler.user_emit(socket, "nothing_to_clear", {})
          return false
        }

        room.log_messages = room.log_messages.slice(0, index + 1)
      }
    }

    db_manager.push_log_messages(socket.hue_room_id, room.log_messages)
    vars.rooms[socket.hue_room_id].log_messages_modified = false
    handler.room_emit(socket, "log_cleared", {
      type: data.type,
      id: data.id,
      username: socket.hue_username,
    })
    handler.push_admin_log_message(socket, "cleared the log")
  }

  // Creates initial room objects
  handler.create_room_object = function (info) {
    let obj = {
      _id: info._id.toString(),
      activity: false,
      log_messages: info.log_messages,
      admin_log_messages: info.admin_log_messages,
      log_messages_modified: false,
      admin_log_messages_modified: false,
      userlist: {},
      stored_images: info.stored_images,
      current_image_id: info.image_id,
      current_image_user_id: info.image_user_id,
      current_image_source: info.image_source,
      current_image_query: info.image_query,
      current_tv_id: info.tv_id,
      current_tv_user_id: info.tv_user_id,
      current_tv_source: info.tv_source,
      current_tv_query: info.tv_query,
      topic: info.topic,
      name: info.name,
      public: info.public,
      modified: Date.now(),
      last_image_change: 0,
      last_tv_change: 0,
      text_ad_charge: 0,
      attempting_text_ad: false,
      message_board_posts: info.message_board_posts
    }

    return obj
  }
}
