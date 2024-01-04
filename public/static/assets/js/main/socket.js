// This is used to declare actions for server responses
App.server_update_events = {
  joined: (data) => {
    App.on_join(data)
  },
  chat_message: (data) => {
    App.on_chat_message(data)
  },
  request_slice_upload: (data) => {
    App.request_slice_upload(data)
  },
  upload_ended: (data) => {
    App.upload_ended(data)
  },
  image_source_changed: (data) => {
    App.setup_media_object(`image`, `change`, data)
  },
  tv_source_changed: (data) => {
    App.setup_media_object(`tv`, `change`, data)
  },
  profilepic_changed: (data) => {
    App.profilepic_changed(data)
  },
  user_joined: (data) => {
    App.user_join(data)
  },
  upload_error: (data) => {
    App.show_upload_error()
  },
  topic_changed: (data) => {
    App.announce_topic_change(data)
  },
  limited_changed: (data) => {
    App.announce_limited_change(data)
  },
  room_name_changed: (data) => {
    App.announce_room_name_change(data)
  },
  log_cleared: (data) => {
    App.announce_log_cleared(data)
  },
  deleted_messages_above: (data) => {
    App.deleted_messages_above(data)
  },
  deleted_messages_below: (data) => {
    App.deleted_messages_below(data)
  },
  user_role_changed: (data) => {
    App.announce_role_change(data)
  },
  user_banned: (data) => {
    App.announce_ban(data)
  },
  user_unbanned: (data) => {
    App.announce_unban(data)
  },
  receive_ban_count: (data) => {
    App.receive_ban_count(data)
  },
  nothing_to_unban: (data) => {
    App.checkmsg(`There was nothing to unban`)
  },
  nothing_to_clear: (data) => {
    App.checkmsg(`There was nothing to clear`)
  },
  forbidden_user: (data) => {
    App.forbidden_user()
  },
  nothing_was_found: (data) => {
    App.checkmsg(`Nothing was found`)
  },
  user_not_found: (data) => {
    App.checkmsg(`User doesn't exist`)
  },
  user_not_in_room: (data) => {
    App.user_not_in_room()
  },
  no_ops_to_remove: (data) => {
    App.checkmsg(`There were no ops to remove`)
  },
  no_voices_to_reset: (data) => {
    App.checkmsg(`There were no voices to reset`)
  },
  no_ops_to_reset: (data) => {
    App.checkmsg(`There were no ops to reset`)
  },
  is_already: (data) => {
    App.is_already(data.who, data.what)
  },
  user_already_banned: (data) => {
    App.checkmsg(`User is already banned`)
  },
  user_already_unbanned: (data) => {
    App.checkmsg(`User is already unbanned`)
  },
  image_not_found: (data) => {
    App.checkmsg(`The image couldn't be found`)
  },
  song_not_found: (data) => {
    App.checkmsg(`The song couldn't be found`)
  },
  video_not_found: (data) => {
    App.checkmsg(`The video couldn't be found`)
  },
  image_cooldown_wait: (data) => {
    App.checkmsg(
      `The image was changed recently. You must wait a while before changing it again`
    )
  },
  tv_cooldown_wait: (data) => {
    App.checkmsg(
      `The tv was changed recently. You must wait a while before changing it again`
    )
  },
  room_created: (data) => {
    App.on_room_created(data)
  },
  redirect: (data) => {
    App.goto_url(data.location, `same`)
  },
  username_already_exists: (data) => {
    App.checkmsg(`${data.username} already exists`)
  },
  new_username: (data) => {
    App.announce_new_username(data)
  },
  password_changed: (data) => {
    App.password_changed()
  },
  background_color_changed: (data) => {
    App.announce_background_color_change(data)
  },
  background_changed: (data) => {
    App.announce_background_change(data)
  },
  text_color_changed: (data) => {
    App.announce_text_color_change(data)
  },
  user_disconnected: (data) => {
    App.user_disconnect(data)
  },
  others_disconnected: (data) => {
    App.show_others_disconnected(data)
  },
  whisper: (data) => {
    App.whisper_received(data)
  },
  whisper_sent: (data) => {
    App.whisper_sent(data)
  },
  system_broadcast: (data) => {
    App.whisper_received(data)
  },
  system_restart_signal: (data) => {
    App.system_restart_signal()
  },
  error_occurred: (data) => {
    App.error_occurred()
  },
  pong_received: (data) => {
    App.pong_received(data)
  },
  cannot_embed_iframe: (data) => {
    App.checkmsg(`That website cannot be embedded`)
  },
  same_image: (data) => {
    App.checkmsg(`Image is already set to that`)
  },
  same_tv: (data) => {
    App.checkmsg(`TV is already set to that`)
  },
  receive_admin_activity: (data) => {
    App.show_admin_activity(data.messages)
  },
  receive_admin_list: (data) => {
    App.show_admin_list(data)
  },
  receive_ban_list: (data) => {
    App.show_ban_list(data)
  },
  message_deleted: (data) => {
    App.remove_message_from_chat(data)
  },
  bio_changed: (data) => {
    App.bio_changed(data)
  },
  report_tv_progress: (data) => {
    App.report_tv_progress(data)
  },
  receive_tv_progress: (data) => {
    App.receive_tv_progress(data)
  },
  new_message_board_post: (data) => {
    App.on_message_board_received(data)
  },
  edited_message_board_post: (data) => {
    App.on_message_board_received(data, true)
  },
  message_board_post_deleted: (data) => {
    App.deleted_message_board_post(data)
  },
  message_board_cleared: (data) => {
    App.message_board_cleared(data)
  },
  audioclip_changed: (data) => {
    App.audioclip_changed(data)
  },
  done: (data) => {
    App.checkmsg(`Done`)
  },
  edited_media_comment: (data) => {
    App.edited_media_comment(data)
  },
  receive_roomlist: (data) => {
    App.on_roomlist_received(data)
  },
  item_already_included: (data) => {
    App.item_already_included()
  },
  item_included: (data) => {
    App.item_included()
  },
  item_not_included: (data) => {
    App.item_not_included()
  },
  item_removed: (data) => {
    App.item_removed()
  },
  user_id_received: (data) => {
    App.user_id_received(data)
  },
  username_received: (data) => {
    App.username_received(data)
  },
  ip_address_received: (data) => {
    App.ip_address_received(data)
  },
  data_not_found: (data) => {
    App.checkmsg(`Data couldn't be found`)
  },
  message_board_wait: (data) => {
    App.show_message_board_wait_message(data.remaining)
  },
  liked_message: (data) => {
    App.liked_message(data)
  },
  admin_activity_cleared: (data) => {
    App.admin_activity_cleared()
  }
}

// Centralized function to initiate a socket emit to the server
App.socket_emit = (destination, data = {}, force = false) => {
  if (!force) {
    if (!App.connected && !App.room_locked) {
      return
    }
  }

  let obj = {
    destination: destination,
    data: data,
  }

  App.emit_queue.push(obj)

  if (App.emit_queue_timeout === undefined) {
    App.check_emit_queue()
  }

  App.num_socket_out += 1
}

// Checks the socket emit queue to send the next emit
// A throttled queue is used to control the rate in which emits are sent
App.check_emit_queue = () => {
  if (App.emit_queue.length > 0) {
    let obj = App.emit_queue[0]

    if (obj !== `first`) {
      App.do_socket_emit(obj)
    }

    App.emit_queue.shift()

    App.emit_queue_timeout = setTimeout(() => {
      App.check_emit_queue()
    }, App.config.socket_emit_throttle)
  }
  else {
    clearTimeout(App.emit_queue_timeout)
    App.emit_queue_timeout = undefined
  }
}

// Actually do the socket emit
App.do_socket_emit = (obj) => {
  if (App.debug_socket) {
    App.loginfo(
      `Emit: ${obj.destination} | Data: ${JSON.stringify(obj.data).substring(
        0,
        250
      )}`
    )
  }

  obj.data.server_method_name = obj.destination
  App.socket.emit(`server_method`, obj.data)
}

// Starts and setups the client's socket
App.start_socket = () => {
  App.socket = io(`/`, {
    reconnection: false,
  })

  App.socket.on(`connect`, () => {
    App.loginfo(`Socket Connected`, `color:green`)
    App.connecting = false

    App.socket_emit(`join_room`, {
      room_id: App.room_id,
      user_id: App.user_id,
      token: App.jwt_token
    }, true)
  })

  App.socket.on(`connect_error`, () => {
    if (App.connecting) {
      if (App.started) {
        setTimeout(() => {
          App.connecting = false
          App.on_disconnect()
        }, 3000)
      }
    }
  })

  App.socket.on(`disconnect`, (reason) => {
    App.loginfo(`Socket Disconnected - Reason: ${reason}`, `color:red`)
    App.connected = false

    if (App.started) {
      App.on_disconnect()
    }
  })

  App.socket.on(`update`, (obj) => {
    let type = obj.type
    let data = obj.data

    if (App.debug_socket) {
      App.loginfo(
        `Received: ${type} | Data: ${JSON.stringify(data).substring(
          0,
          250
        )}`
      )
    }

    if (App.server_update_events[type]) {
      App.server_update_events[type](data)
    }

    App.num_socket_in += 1
  })
}

// Actions on disconnect
App.on_disconnect = () => {
  if (App.user_leaving) {
    return
  }

  App.userlist = []
  App.activity_list = []
  App.alert_mode = 0
  App.update_userlist()
  App.update_activity_bar()

  if (App.favicon_mode !== -1) {
    App.last_favicon_mode = App.favicon_mode
  }

  App.last_message_date = App.get_last_message_date()
  App.generate_favicon(-1)

  if (!DOM.el(`#reconnecting_feedback`)) {
    App.feedback(`Reconnecting...`, { container_id: `reconnecting_feedback` })
  }

  setTimeout(() => {
    App.refresh_client()
  }, 5000)
}

// Some stats in socket i/o
App.start_socket_stats = () => {
  setInterval(() => {
    App.loginfo(`Socket Messsages IN/OUT (last 10 minutes): ${App.num_socket_in}/${App.num_socket_out}`)
    App.num_socket_in = 0
    App.num_socket_out = 0
  }, 10 * 60 * 1000)
}