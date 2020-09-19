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
  changed_image_source: (data) => {
    Hue.setup_image("change", data)
  },
  changed_tv_source: (data) => {
    Hue.setup_tv("change", data)
  },
  profile_image_changed: (data) => {
    Hue.profile_image_changed(data)
  },
  user_join: (data) => {
    Hue.user_join(data)
  },
  receive_roomlist: (data) => {
    Hue.on_roomlist_received(data)
  },
  upload_error: (data) => {
    Hue.show_upload_error()
  },
  topic_change: (data) => {
    Hue.announce_topic_change(data)
  },
  room_name_changed: (data) => {
    Hue.announce_room_name_change(data)
  },
  log_changed: (data) => {
    Hue.announce_log_change(data)
  },
  log_cleared: (data) => {
    Hue.announce_log_cleared(data)
  },
  announce_role_change: (data) => {
    Hue.announce_role_change(data)
  },
  announce_ban: (data) => {
    Hue.announce_ban(data)
  },
  announce_unban: (data) => {
    Hue.announce_unban(data)
  },
  announce_unban_all: (data) => {
    Hue.announce_unban_all(data)
  },
  receive_ban_count: (data) => {
    Hue.receive_ban_count(data)
  },
  nothing_to_unban: (data) => {
    Hue.feedback("There was nothing to unban")
  },
  nothing_to_clear: (data) => {
    Hue.feedback("There was nothing to clear")
  },
  forbidden_user: (data) => {
    Hue.forbidden_user()
  },
  nothing_was_found: (data) => {
    Hue.feedback("Nothing was found")
  },
  user_not_found: (data) => {
    Hue.feedback("User doesn't exist")
  },
  user_not_in_room: (data) => {
    Hue.user_not_in_room()
  },
  no_ops_to_remove: (data) => {
    Hue.feedback("There were no ops to remove")
  },
  no_voices_to_reset: (data) => {
    Hue.feedback("There were no voices to reset")
  },
  no_ops_to_reset: (data) => {
    Hue.feedback("There were no ops to reset")
  },
  is_already: (data) => {
    Hue.is_already(data.who, data.what)
  },
  user_already_banned: (data) => {
    Hue.feedback("User is already banned")
  },
  user_already_unbanned: (data) => {
    Hue.feedback("User is already unbanned")
  },
  privacy_change: (data) => {
    Hue.announce_privacy_change(data)
  },
  image_not_found: (data) => {
    Hue.feedback("The image couldn't be found")
  },
  song_not_found: (data) => {
    Hue.feedback("The song couldn't be found")
  },
  video_not_found: (data) => {
    Hue.feedback("The video couldn't be found")
  },
  image_cooldown_wait: (data) => {
    Hue.feedback(
      "The image was changed recently. You must wait a while before changing it again"
    )
  },
  tv_cooldown_wait: (data) => {
    Hue.feedback(
      "The tv was changed recently. You must wait a while before changing it again"
    )
  },
  room_created: (data) => {
    Hue.on_room_created(data)
  },
  redirect: (data) => {
    Hue.goto_url(data.location)
  },
  username_already_exists: (data) => {
    Hue.feedback(`${data.username} already exists`)
  },
  email_already_exists: (data) => {
    Hue.feedback(`${data.email} already exists`)
  },
  new_username: (data) => {
    Hue.announce_new_username(data)
  },
  password_changed: (data) => {
    Hue.password_changed(data)
  },
  email_changed: (data) => {
    Hue.email_changed(data)
  },
  room_image_mode_change: (data) => {
    Hue.announce_room_image_mode_change(data)
  },
  room_tv_mode_change: (data) => {
    Hue.announce_room_tv_mode_change(data)
  },
  theme_mode_changed: (data) => {
    Hue.announce_theme_mode_change(data)
  },
  theme_change: (data) => {
    Hue.announce_theme_change(data)
  },
  background_image_change: (data) => {
    Hue.announce_background_image_change(data)
  },
  background_mode_changed: (data) => {
    Hue.announce_background_mode_change(data)
  },
  background_effect_changed: (data) => {
    Hue.announce_background_effect_change(data)
  },
  background_tile_dimensions_changed: (data) => {
    Hue.announce_background_tile_dimensions_change(data)
  },
  text_color_mode_changed: (data) => {
    Hue.announce_text_color_mode_change(data)
  },
  text_color_changed: (data) => {
    Hue.announce_text_color_change(data)
  },
  user_disconnect: (data) => {
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
  email_change_code_sent: (data) => {
    Hue.feedback(
      `Verification code sent. Use the command sent to ${data.email}. Email might take a couple of minutes to arrive`
    )
  },
  email_change_code_not_sent: (data) => {
    Hue.feedback(
      `Verification code not sent yet. Use ${Hue.config.commands_prefix}changeemail [new_email] to get a verification code`
    )
  },
  email_change_wait: (data) => {
    Hue.feedback(`You must wait a while before changing the email again`)
  },
  email_change_wrong_code: (data) => {
    Hue.feedback(`Code supplied didn't match`)
  },
  email_change_expired_code: (data) => {
    Hue.feedback(`Code supplied has expired`)
  },
  create_room_wait: (data) => {
    Hue.create_room_cooldown_message()
  },
  pong_received: (data) => {
    Hue.pong_received(data)
  },
  reaction_received: (data) => {
    Hue.show_reaction(data)
  },
  cannot_embed_iframe: (data) => {
    Hue.feedback("That website cannot be embedded")
  },
  same_image: (data) => {
    Hue.feedback("Image is already set to that")
  },
  same_tv: (data) => {
    Hue.feedback("TV is already set to that")
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
  activity_trigger: (data) => {
    Hue.push_to_activity_bar(data.user_id, Date.now())
  },
  message_deleted: (data) => {
    Hue.remove_message_from_chat(data)
  },
  announcement: (data) => {
    Hue.show_announcement(data)
  },
  bio_changed: (data) => {
    Hue.bio_changed(data)
  },
  badge_received: (data) => {
    Hue.on_badge_received(data)
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
  message_board_post_deleted: (data) => {
    Hue.remove_message_board_post(data)
  },
  message_board_cleared: (data) => {
    Hue.on_message_board_cleared(data)
  },
  audio_clip_changed: (data) => {
    Hue.audio_clip_changed(data)
  },
  done: (data) => {
    Hue.feedback("Done")
  },
}

// Centralized function to initiate a socket emit to the server
Hue.socket_emit = function (destination, data, force = false) {
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
    Hue.loginfo("Socket Disconnected", "color:red")
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
  Hue.update_userlist()
  Hue.update_activity_bar()

  if (Hue.open_profile_username) {
    Hue.show_profile(Hue.open_profile_username)
  }

  if (Hue.get_setting("autoconnect")) {
    if ($("#reconnecting_feedback").length === 0) {
      Hue.feedback("Reconnecting...", { container_id: "reconnecting_feedback" })
    }

    setTimeout(function () {
      Hue.refresh_client()
    }, 3000)
  } else {
    Hue.show_reload_button()
  }

  Hue.generate_favicon(-1)
}

// Disconnects the user's socket
Hue.disconnect_socket = function () {
  Hue.socket.close()
}

// Some stats in socket i/o
Hue.start_socket_stats = function () {
  setInterval(() => {
    Hue.loginfo(`Socket Messsages IN (last minute): ${Hue.num_socket_in}`)
    Hue.loginfo(`Socket Messsages OUT (last minute): ${Hue.num_socket_out}`)
    Hue.num_socket_in = 0
    Hue.num_socket_out = 0
  }, 60 * 1000);
}