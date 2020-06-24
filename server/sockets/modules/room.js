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
    if (!handler.check_op_permission(socket, "topic")) {
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
    if (!handler.check_op_permission(socket, "name")) {
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

  // Handles log state changes
  handler.public.change_log = async function (socket, data) {
    if (!handler.check_op_permission(socket, "log")) {
      return handler.get_out(socket)
    }

    if (data.log !== true && data.log !== false) {
      return handler.get_out(socket)
    }

    let info = await db_manager.get_room(
      { _id: socket.hue_room_id },
      { log: 1 }
    )

    if (info.log !== data.log) {
      let room = vars.rooms[socket.hue_room_id]

      if (!data.log) {
        room.log_messages = []
        db_manager.update_room(socket.hue_room_id, {
          log: data.log,
          log_messages: room.log_messages,
        })
        room.log_messages_modified = false
      } else {
        db_manager.update_room(socket.hue_room_id, { log: data.log })
      }

      room.log = data.log

      handler.room_emit(socket, "log_changed", {
        username: socket.hue_username,
        log: data.log,
      })

      let als

      if (data.log) {
        als = "enabled the log"
      } else {
        als = "disabled the log"
      }

      handler.push_admin_log_message(socket, als)
    }
  }

  // Clears log messages
  handler.public.clear_log = async function (socket, data) {
    if (!handler.check_op_permission(socket, "log")) {
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

  // Changes privacy status
  handler.public.change_privacy = function (socket, data) {
    if (!handler.check_op_permission(socket, "privacy")) {
      return handler.get_out(socket)
    }

    if (data.what !== true && data.what !== false) {
      return handler.get_out(socket)
    }

    db_manager.update_room(socket.hue_room_id, { public: data.what })

    handler.room_emit(socket, "privacy_change", {
      username: socket.hue_username,
      what: data.what,
    })

    let als

    if (data.what) {
      als = "made the room public"
    } else {
      als = "made the room private"
    }

    vars.rooms[socket.hue_room_id].public = data.what

    handler.push_admin_log_message(socket, als)
  }

  // Handles media info changes
  handler.public.change_media_info = async function (socket, data) {
    if (!handler.check_op_permission(socket, "media")) {
      return handler.get_out(socket)
    }

    if (data.media_info !== "enabled" && data.media_info !== "disabled") {
      return handler.get_out(socket)
    }

    let info = await db_manager.get_room(
      { _id: socket.hue_room_id },
      { media_info: 1 }
    )

    if (info.media_info === data.media_info) {
      return false
    }

    db_manager.update_room(socket.hue_room_id, {
      media_info: data.media_info,
    })

    handler.room_emit(socket, "media_info_changed", {
      username: socket.hue_username,
      media_info: data.media_info,
    })
  }

  // Fills voice and op permissions objects
  handler.fill_room_permissions = function (info) {
    let voice_changed = false

    let voice_properties = ["chat", "image", "tv", "radio", "synth"]

    let voice_properties_false = []

    for (let i = 1; i <= vars.vtypes.length; i++) {
      let p = info[`voice_${i}_permissions`]

      for (let property of voice_properties) {
        if (p[property] === undefined) {
          p[property] = !voice_properties_false.includes(property)
          voice_changed = true
        }
      }

      for (let key in p) {
        if (!voice_properties.includes(key)) {
          delete p[key]
          voice_changed = true
        }
      }
    }

    let op_changed = false

    let op_properties = [
      "theme",
      "background",
      "voice_roles",
      "voice_permissions",
      "privacy",
      "log",
      "topic",
      "kick",
      "ban",
      "unban",
      "delete_messages",
      "media",
      "name",
      "whisper_ops",
      "broadcast",
      "message_board_no_restriction",
      "message_board_delete",
    ]

    let op_properties_false = [
      "message_board_no_restriction",
      "message_board_delete",
    ]

    for (let i = 1; i <= vars.optypes.length; i++) {
      let p = info[`op_${i}_permissions`]

      for (let property of op_properties) {
        if (p[property] === undefined) {
          p[property] = !op_properties_false.includes(property)
          op_changed = true
        }
      }

      for (let key in p) {
        if (!op_properties.includes(key)) {
          delete p[key]
          op_changed = true
        }
      }
    }

    if (voice_changed || op_changed) {
      let obj = {}

      if (voice_changed) {
        ;(obj.voice_1_permissions = info.voice_1_permissions),
          (obj.voice_2_permissions = info.voice_2_permissions),
          (obj.voice_3_permissions = info.voice_3_permissions),
          (obj.voice_4_permissions = info.voice_4_permissions)
      }

      if (op_changed) {
        ;(obj.op_1_permissions = info.op_1_permissions),
          (obj.op_2_permissions = info.op_2_permissions),
          (obj.op_3_permissions = info.op_3_permissions),
          (obj.op_4_permissions = info.op_4_permissions)
      }

      db_manager.update_room(info._id.toString(), obj)
    }
  }

  // Creates initial room objects
  handler.create_room_object = function (info) {
    handler.fill_room_permissions(info)

    let obj = {
      _id: info._id.toString(),
      activity: false,
      log: info.log,
      log_messages: info.log_messages,
      admin_log_messages: info.admin_log_messages,
      access_log_messages: info.access_log_messages,
      log_messages_modified: false,
      admin_log_messages_modified: false,
      access_log_messages_modified: false,
      userlist: {},
      image_mode: info.image_mode,
      stored_images: info.stored_images,
      tv_mode: info.tv_mode,
      radio_mode: info.radio_mode,
      synth_mode: info.synth_mode,
      current_image_id: info.image_id,
      current_image_user_id: info.image_user_id,
      current_image_source: info.image_source,
      current_image_query: info.image_query,
      current_tv_id: info.tv_id,
      current_tv_user_id: info.tv_user_id,
      current_tv_source: info.tv_source,
      current_tv_query: info.tv_query,
      current_radio_id: info.radio_id,
      current_radio_user_id: info.radio_user_id,
      current_radio_source: info.radio_source,
      current_radio_query: info.radio_query,
      topic: info.topic,
      name: info.name,
      public: info.public,
      modified: Date.now(),
      last_image_change: 0,
      last_tv_change: 0,
      last_radio_change: 0,
      image_ad_charge: 0,
      text_ad_charge: 0,
      attempting_image_ad: false,
      attempting_text_ad: false,
      message_board_posts: info.message_board_posts,
      voice_1_permissions: info.voice_1_permissions,
      voice_2_permissions: info.voice_2_permissions,
      voice_3_permissions: info.voice_3_permissions,
      voice_4_permissions: info.voice_4_permissions,
      op_1_permissions: info.op_1_permissions,
      op_2_permissions: info.op_2_permissions,
      op_3_permissions: info.op_3_permissions,
      op_4_permissions: info.op_4_permissions,
    }

    return obj
  }
}
