// This is used to declare actions for server responses
Hue.server_update_events = {
  joined: (data) => {
    Hue.on_join(data)
  },
  typing: (data) => {
    Hue.show_typing(data)
  },
  chat_message: (data) => {
    Hue.on_chat_message(data)
  },
  request_slice_upload: (data) => {
    Hue.request_slice_upload(data)
  },
  upload_ended: (data) => {
    Hue.upload_ended(data)
  },
  image_source_changed: (data) => {
    Hue.setup_media_object("image", "change", data)
  },
  tv_source_changed: (data) => {
    Hue.setup_media_object("tv", "change", data)
  },
  profilepic_changed: (data) => {
    Hue.profilepic_changed(data)
  },
  user_joined: (data) => {
    Hue.user_join(data)
  },
  upload_error: (data) => {
    Hue.show_upload_error()
  },
  topic_changed: (data) => {
    Hue.announce_topic_change(data)
  },
  room_name_changed: (data) => {
    Hue.announce_room_name_change(data)
  },
  log_cleared: (data) => {
    Hue.announce_log_cleared(data)
  },
  deleted_messages_above: (data) => {
    Hue.deleted_messages_above(data)
  },
  deleted_messages_below: (data) => {
    Hue.deleted_messages_below(data)
  },
  user_role_changed: (data) => {
    Hue.announce_role_change(data)
  },
  user_banned: (data) => {
    Hue.announce_ban(data)
  },
  user_unbanned: (data) => {
    Hue.announce_unban(data)
  },
  receive_ban_count: (data) => {
    Hue.receive_ban_count(data)
  },
  nothing_to_unban: (data) => {
    Hue.checkmsg("There was nothing to unban")
  },
  nothing_to_clear: (data) => {
    Hue.checkmsg("There was nothing to clear")
  },
  forbidden_user: (data) => {
    Hue.forbidden_user()
  },
  nothing_was_found: (data) => {
    Hue.checkmsg("Nothing was found")
  },
  user_not_found: (data) => {
    Hue.checkmsg("User doesn't exist")
  },
  user_not_in_room: (data) => {
    Hue.user_not_in_room()
  },
  no_ops_to_remove: (data) => {
    Hue.checkmsg("There were no ops to remove")
  },
  no_voices_to_reset: (data) => {
    Hue.checkmsg("There were no voices to reset")
  },
  no_ops_to_reset: (data) => {
    Hue.checkmsg("There were no ops to reset")
  },
  is_already: (data) => {
    Hue.is_already(data.who, data.what)
  },
  user_already_banned: (data) => {
    Hue.checkmsg("User is already banned")
  },
  user_already_unbanned: (data) => {
    Hue.checkmsg("User is already unbanned")
  },
  image_not_found: (data) => {
    Hue.checkmsg("The image couldn't be found")
  },
  song_not_found: (data) => {
    Hue.checkmsg("The song couldn't be found")
  },
  video_not_found: (data) => {
    Hue.checkmsg("The video couldn't be found")
  },
  image_cooldown_wait: (data) => {
    Hue.checkmsg(
      "The image was changed recently. You must wait a while before changing it again"
    )
  },
  tv_cooldown_wait: (data) => {
    Hue.checkmsg(
      "The tv was changed recently. You must wait a while before changing it again"
    )
  },
  room_created: (data) => {
    Hue.on_room_created(data)
  },
  redirect: (data) => {
    Hue.goto_url(data.location, "same")
  },
  username_already_exists: (data) => {
    Hue.checkmsg(`${data.username} already exists`)
  },
  new_username: (data) => {
    Hue.announce_new_username(data)
  },
  password_changed: (data) => {
    Hue.password_changed()
  },
  background_color_changed: (data) => {
    Hue.announce_background_color_change(data)
  },
  background_changed: (data) => {
    Hue.announce_background_change(data)
  },
  text_color_changed: (data) => {
    Hue.announce_text_color_change(data)
  },
  user_disconnected: (data) => {
    Hue.user_disconnect(data)
  },
  others_disconnected: (data) => {
    Hue.show_others_disconnected(data)
  },
  whisper: (data) => {
    Hue.whisper_received(data)
  },
  system_broadcast: (data) => {
    Hue.whisper_received(data)
  },
  system_restart_signal: (data) => {
    Hue.system_restart_signal()
  },
  error_occurred: (data) => {
    Hue.error_occurred()
  },
  pong_received: (data) => {
    Hue.pong_received(data)
  },
  cannot_embed_iframe: (data) => {
    Hue.checkmsg("That website cannot be embedded")
  },
  same_image: (data) => {
    Hue.checkmsg("Image is already set to that")
  },
  same_tv: (data) => {
    Hue.checkmsg("TV is already set to that")
  },
  receive_admin_activity: (data) => {
    Hue.show_admin_activity(data.messages)
  },
  receive_admin_list: (data) => {
    Hue.show_admin_list(data)
  },
  receive_ban_list: (data) => {
    Hue.show_ban_list(data)
  },
  message_deleted: (data) => {
    Hue.remove_message_from_chat(data)
  },
  bio_changed: (data) => {
    Hue.bio_changed(data)
  },
  report_tv_progress: (data) => {
    Hue.report_tv_progress(data)
  },
  receive_tv_progress: (data) => {
    Hue.receive_tv_progress(data)
  },
  new_message_board_post: (data) => {
    Hue.on_message_board_received(data)
  },
  edited_message_board_post: (data) => {
    Hue.on_message_board_received(data, true)
  },
  message_board_post_deleted: (data) => {
    Hue.deleted_message_board_post(data)
  },
  message_board_cleared: (data) => {
    Hue.message_board_cleared(data)
  },  
  audioclip_changed: (data) => {
    Hue.audioclip_changed(data)
  },
  done: (data) => {
    Hue.checkmsg("Done")
  },
  edited_media_comment: (data) => {
    Hue.edited_media_comment(data)
  },
  announce_radio: (data) => {
    Hue.show_announce_radio(data)
  },
  receive_roomlist: (data) => {
    Hue.on_roomlist_received(data)
  },
  item_already_included: (data) => {
    Hue.item_already_included()
  },
  item_included: (data) => {
    Hue.item_included()
  },
  item_not_included: (data) => {
    Hue.item_not_included()
  },
  item_removed: (data) => {
    Hue.item_removed()
  },
  user_id_received: (data) => {
    Hue.user_id_received(data)
  },
  ip_address_received: (data) => {
    Hue.ip_address_received(data)
  },
  data_not_found: (data) => {
    Hue.checkmsg("Data couldn't be found")
  }
}

// Centralized function to initiate a socket emit to the server
Hue.socket_emit = function (destination, data = {}, force = false) {
  if (!force) {
    if (!Hue.connected && !Hue.room_locked) {
      return
    }
  }

  let obj = {
    destination: destination,
    data: data,
  }

  Hue.emit_queue.push(obj)

  if (Hue.emit_queue_timeout === undefined) {
    Hue.check_emit_queue()
  }

  Hue.num_socket_out += 1
}

// Checks the socket emit queue to send the next emit
// A throttled queue is used to control the rate in which emits are sent
Hue.check_emit_queue = function () {
  if (Hue.emit_queue.length > 0) {
    let obj = Hue.emit_queue[0]

    if (obj !== "first") {
      Hue.do_socket_emit(obj)
    }

    Hue.emit_queue.shift()

    Hue.emit_queue_timeout = setTimeout(function () {
      Hue.check_emit_queue()
    }, Hue.config.socket_emit_throttle)
  } else {
    clearTimeout(Hue.emit_queue_timeout)
    Hue.emit_queue_timeout = undefined
  }
}

// Actually do the socket emit
Hue.do_socket_emit = function (obj) {
  if (Hue.debug_socket) {
    Hue.loginfo(
      `Emit: ${obj.destination} | Data: ${JSON.stringify(obj.data).substring(
        0,
        250
      )}`
    )
  }

  obj.data.server_method_name = obj.destination
  Hue.socket.emit("server_method", obj.data)
}

// Starts and setups the client's socket
Hue.start_socket = function () {
  Hue.socket = io("/", {
    reconnection: false,
  })

  Hue.socket.on("connect", () => {
    Hue.loginfo("Socket Connected", "color:green")
    Hue.connecting = false

    Hue.socket_emit("join_room", {
      room_id: Hue.room_id,
      user_id: Hue.user_id,
      token: Hue.jwt_token
    }, true)
  })

  Hue.socket.on("connect_error", () => {
    if (Hue.connecting) {
      if (Hue.started) {
        setTimeout(function () {
          Hue.connecting = false
          Hue.on_disconnect()
        }, 3000)
      }
    }
  })

  Hue.socket.on("disconnect", (reason) => {
    Hue.loginfo(`Socket Disconnected - Reason: ${reason}`, "color:red")
    Hue.connected = false

    if (Hue.started) {
      Hue.on_disconnect()
    }
  })

  Hue.socket.on("update", (obj) => {
    let type = obj.type
    let data = obj.data

    if (Hue.server_update_events[type]) {
      Hue.server_update_events[type](data)
    }

    Hue.num_socket_in += 1
  })
}

// Actions on disconnect
Hue.on_disconnect = function () {
  if (Hue.user_leaving) {
    return
  }

  Hue.userlist = []
  Hue.activity_list = []
  Hue.alert_mode = 0
  Hue.update_userlist()
  Hue.update_activity_bar()

  if (Hue.favicon_mode !== -1) {
    Hue.last_favicon_mode = Hue.favicon_mode
  }

  Hue.last_message_date = Hue.get_last_message_date()
  Hue.generate_favicon(-1)

  if (!Hue.el("#reconnecting_feedback")) {
    Hue.feedback("Reconnecting...", { container_id: "reconnecting_feedback" })
  }

  setTimeout(function () {
    Hue.refresh_client()
  }, 5000)
}

// Some stats in socket i/o
Hue.start_socket_stats = function () {
  setInterval(() => {
    Hue.loginfo(`Socket Messsages IN/OUT (last 10 minutes): ${Hue.num_socket_in}/${Hue.num_socket_out}`)
    Hue.num_socket_in = 0
    Hue.num_socket_out = 0
  }, 10 * 60 * 1000);
}