// Gets the room state localStorage object
Hue.get_room_state = function () {
  let room_state_all = Hue.get_local_storage(Hue.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  Hue.room_state = room_state_all[Hue.room_id]

  if (Hue.room_state === undefined) {
    Hue.room_state = {}
  }

  let changed = false

  let settings = [
    "image_enabled",
    "tv_enabled",
    "tv_volume",
    "chat_searches",
    "last_highlight_date",
    "chat_display_percentage",
    "tv_display_percentage",
    "tv_display_position",
    "media_layout",
    "last_message_board_post"
  ]

  for (let setting of settings) {
    if (Hue.room_state[setting] === undefined) {
      Hue.room_state[setting] = Hue.config[`room_state_default_${setting}`]
      changed = true
    }
  }

  if (changed) {
    Hue.save_room_state()
  }
}

// Saves the room state localStorage object
Hue.save_room_state = function () {
  let room_state_all = Hue.get_local_storage(Hue.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  room_state_all[Hue.room_id] = Hue.room_state
  Hue.save_local_storage(Hue.ls_room_state, room_state_all)
}

// Shows a window with room details
Hue.show_room_status = function () {
  let name = Hue.room_name
  let topic = Hue.topic
  let privacy = Hue.is_public ? "Public" : "Private"
  let log = Hue.log_enabled ? "Enabled" : "Disabled"

  Hue.msg_room_status.show(function () {
    $("#room_status_name").text(name)
    $("#room_status_topic").text(topic)
    $("#room_status_privacy").text(privacy)
    $("#room_status_log").text(log)
  })
}

// Show whether a room is public or private
Hue.show_public = function () {
  if (Hue.is_public) {
    Hue.feedback("This room is public")
  } else {
    Hue.feedback("This room is private")
  }
}

// Show the room name
Hue.show_room = function () {
  Hue.feedback(`Room: ${Hue.room_name}`)
}

// Change the name of the room
Hue.change_room_name = function (arg) {
  if (!Hue.check_op_permission(Hue.role, "name")) {
    return false
  }

  arg = Hue.utilz.clean_string2(
    arg.substring(0, Hue.config.max_room_name_length)
  )

  if (arg === Hue.room_name) {
    Hue.feedback("That's already the room name")
    return
  }

  if (arg.length > 0) {
    Hue.socket_emit("change_room_name", { name: arg })
  }
}

// Put the room name in the input to be edited
Hue.room_name_edit = function () {
  Hue.change_input(`/roomname ${Hue.room_name}`)
}

// Returns proper default topic
Hue.get_unset_topic = function () {
  if (Hue.is_admin_or_op()) {
    return Hue.config.default_topic_admin
  } else {
    return Hue.config.default_topic
  }
}

// Gets the topic
Hue.get_topic = function () {
  if (Hue.topic) {
    return Hue.topic
  } else {
    return Hue.get_unset_topic()
  }
}

// Shows the topic
Hue.show_topic = function () {
  if (Hue.topic) {
    if (Hue.topic_setter !== "") {
      Hue.feedback(`Topic: ${Hue.topic}`, {
        title: `Setter: ${Hue.topic_setter} | ${
          Hue.topic_date
        } | ${Hue.utilz.nice_date()}`,
      })
    } else {
      Hue.feedback(`Topic: ${Hue.topic}`)
    }
  } else {
    Hue.feedback(`Topic: ${Hue.get_unset_topic()}`)
  }
}

// Clears the chat and resets media change state
// Re-makes initial media setups for current media
Hue.clear_room = function () {
  Hue.clear_chat()

  let first_image = (Hue.image_changed = Hue.image_changed.slice(-1)[0])
  let first_tv = (Hue.tv_changed = Hue.tv_changed.slice(-1)[0])

  Hue.loaded_image = {}
  Hue.loaded_tv = {}

  Hue.image_changed = []
  Hue.tv_changed = []

  Hue.setup_image("show", first_image)
  Hue.setup_tv("show", first_tv)

  Hue.change({ type: "image" })
  Hue.change({ type: "tv" })
}

// Announces room name changes
Hue.announce_room_name_change = function (data) {
  if (data.name !== Hue.room_name) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed the room name`
    )
    Hue.set_room_name(data.name)
    Hue.update_title()
    Hue.update_input_placeholder()
  }

  if (Hue.room_status_open) {
    Hue.show_room_status()
  }
}

// Room name setter
Hue.set_room_name = function (name) {
  Hue.room_name = name
  Hue.config_admin_room_name()
}

// Changes the topic
Hue.change_topic = function (dtopic) {
  if (!Hue.check_op_permission(Hue.role, "topic")) {
    return false
  }

  dtopic = Hue.utilz.clean_string2(
    dtopic.substring(0, Hue.config.max_topic_length)
  )

  if (dtopic.length > 0) {
    if (Hue.topic !== dtopic) {
      Hue.socket_emit("change_topic", { topic: dtopic })
    } else {
      Hue.feedback("Topic is already set to that")
    }
  }
}

// Appends the topic with new text
Hue.topicadd = function (arg) {
  if (!Hue.check_op_permission(Hue.role, "topic")) {
    return false
  }

  arg = Hue.utilz.clean_string2(arg)

  if (arg.length === 0) {
    return
  }

  let ntopic = Hue.topic + Hue.config.topic_separator + arg

  if (ntopic.length > Hue.config.max_topic_length) {
    Hue.feedback("There is no more room to add that to the topic")
    return
  }

  Hue.change_topic(ntopic)
}

// Removes topic sections
Hue.topictrim = function (n) {
  if (!Hue.check_op_permission(Hue.role, "topic")) {
    return false
  }

  let split = Hue.topic.split(Hue.config.topic_separator)

  if (split.length > 1) {
    if (!isNaN(n)) {
      if (n < 1) {
        return false
      }

      if (n > split.length - 1) {
        n = split.length - 1
      }
    } else {
      Hue.feedback("Argument must be a number")
      return false
    }

    if (split.length > 1) {
      let t = split.slice(0, -n).join(Hue.config.topic_separator)

      if (t.length > 0) {
        Hue.change_topic(t)
      }
    }
  } else {
    Hue.feedback("Nothing to trim")
  }
}

// Prepends the topic with new text
Hue.topicstart = function (arg) {
  if (!Hue.check_op_permission(Hue.role, "topic")) {
    return false
  }

  arg = Hue.utilz.clean_string2(arg)

  if (arg.length === 0) {
    return
  }

  let ntopic = arg + Hue.config.topic_separator + Hue.topic

  if (ntopic.length > Hue.config.max_topic_length) {
    Hue.feedback("There is no more room to add that to the topic")
    return
  }

  Hue.change_topic(ntopic)
}

// Removes topic sections from the start
Hue.topictrimstart = function (n) {
  if (!Hue.check_op_permission(Hue.role, "topic")) {
    return false
  }

  let split = Hue.topic.split(Hue.config.topic_separator)

  if (split.length > 1) {
    if (!isNaN(n)) {
      if (n < 1) {
        return false
      }

      if (n > split.length - 1) {
        n = split.length - 1
      }
    } else {
      Hue.feedback("Argument must be a number")
      return false
    }

    if (split.length > 1) {
      let t = split.slice(n, split.length).join(Hue.config.topic_separator)

      if (t.length > 0) {
        Hue.change_topic(t)
      }
    }
  } else {
    Hue.feedback("Nothing to trim")
  }
}

// Changes the input with the topic to be edited
Hue.topicedit = function () {
  Hue.change_input(`/topic ${Hue.topic}`)
}

// Announces topic changes
Hue.announce_topic_change = function (data) {
  if (data.topic !== Hue.topic) {
    Hue.show_room_notification(
      data.topic_setter,
      `${data.topic_setter} changed the topic`
    )
    Hue.set_topic_info(data)
    Hue.update_title()
  }

  if (Hue.room_status_open) {
    Hue.show_room_status()
  }
}

// Sets topic data with received data
Hue.set_topic_info = function (data) {
  if (!data) {
    data = {}

    data.topic = ""
    data.topic_setter = ""
    data.topic_date = ""
  }

  Hue.topic = data.topic
  Hue.topic_setter = data.topic_setter
  Hue.topic_date = Hue.utilz.nice_date(data.topic_date)
  Hue.config_admin_topic()
}

// Changes the room privacy to public or private
Hue.change_privacy = function (what) {
  if (!Hue.check_op_permission(Hue.role, "privacy")) {
    return false
  }

  if (Hue.is_public === what) {
    if (what) {
      Hue.feedback("Room is already public")
    } else {
      Hue.feedback("Room is already private")
    }

    return false
  }

  Hue.socket_emit("change_privacy", { what: what })
}

// Announces a privacy change
Hue.announce_privacy_change = function (data) {
  Hue.set_privacy(data.what)

  let s

  if (Hue.is_public) {
    s = `${data.username} made the room public`
    s += ". The room will appear in the public room list"
  } else {
    s = `${data.username} made the room private`
    s += ". The room won't appear in the public room list"
  }

  Hue.show_room_notification(data.username, s)

  if (Hue.room_status_open) {
    Hue.show_room_status()
  }
}

// Privacy setter
Hue.set_privacy = function (what) {
  Hue.is_public = what
  Hue.config_admin_privacy()
}

// Log enabled setter
Hue.set_log_enabled = function (what) {
  Hue.log_enabled = what
  Hue.config_admin_log_enabled()
}

// Enables or disables the log
Hue.change_log = function (log) {
  if (!Hue.check_op_permission(Hue.role, "log")) {
    return false
  }

  if (log === Hue.log_enabled) {
    if (log) {
      Hue.feedback("Log is already enabled")
    } else {
      Hue.feedback("Log is already disabled")
    }
  }

  Hue.socket_emit("change_log", { log: log })
}

// Clears the log
Hue.clear_log = function (type = "all", id = false) {
  if (!Hue.check_op_permission(Hue.role, "log")) {
    return false
  }

  if (!Hue.utilz.clear_log_types.includes(type)) {
    Hue.feedback(
      `Invalid type. Available types are: ${Hue.utilz.clear_log_types.join(
        ", "
      )}`
    )
    return false
  }

  if (type === "above" || type === "below") {
    if (!id) {
      Hue.feedback("A message ID needs to be provided for this operation")
      return false
    }
  }

  Hue.socket_emit("clear_log", { type: type, id: id })
}

// Announces log changes
Hue.announce_log_change = function (data) {
  if (!data.log) {
    Hue.clear_room()
  }

  let s

  if (data.log) {
    s = `${data.username} enabled the log`
  } else {
    s = `${data.username} cleared and disabled the log`
  }

  Hue.set_log_enabled(data.log)
  Hue.show_room_notification(data.username, s)

  if (Hue.room_status_open) {
    Hue.show_room_status()
  }
}

// Announces that the log was cleared
Hue.announce_log_cleared = function (data) {
  if (data.type === "all") {
    Hue.clear_room()
  } else if (data.type === "above" || data.type === "below") {
    Hue.remove_messages_after_id(data.id, data.type)
  }

  Hue.show_room_notification(data.username, `${data.username} cleared the log`)
}

// Shows the log status
Hue.show_log = function () {
  if (Hue.log_enabled) {
    Hue.feedback("Log is enabled")
  } else {
    Hue.feedback("Log is disabled")
  }
}

// Requests the admin activity list from the server
Hue.request_admin_activity = function (filter = "") {
  if (!Hue.is_admin_or_op(Hue.role)) {
    Hue.not_an_op()
    return false
  }

  Hue.admin_activity_filter_string = filter

  Hue.socket_emit("get_admin_activity", {})
}

// Shows the admin activity list
Hue.show_admin_activity = function (messages) {
  $("#admin_activity_container").html("")

  Hue.msg_admin_activity.show(function () {
    for (let message of messages) {
      let nice_date = Hue.utilz.nice_date(message.date)

      let el = $(`
            <div class='modal_item admin_activity_item dynamic_title' title='${nice_date}'>
                <div class='admin_activity_message'></div>
                <div class='admin_activity_date'></div>
            </div>`)

      el.find(".admin_activity_message")
        .eq(0)
        .text(`${message.data.username} ${message.data.content}`)
      el.find(".admin_activity_date").eq(0).text(nice_date)

      el.data("date", message.date)
      el.data("otitle", nice_date)

      $("#admin_activity_container").prepend(el)
    }

    $("#admin_activity_filter").val(Hue.admin_activity_filter_string)

    Hue.do_modal_filter()
  })
}

// Requests the admin list
Hue.request_admin_list = function () {
  if (!Hue.is_admin_or_op(Hue.role)) {
    Hue.not_an_op()
    return false
  }

  Hue.socket_emit("get_admin_list", {})
}

// Shows the admin list
Hue.show_admin_list = function (data) {
  let s = $("<div id='admin_list_container' class='grid_column_center'></div>")

  data.list.sort(Hue.compare_userlist)

  for (let user of data.list) {
    let hs =
      "<div class='flex_row_center'><div class='admin_list_username'></div>&nbsp;&nbsp;<div class='admin_list_role'></div></div>"
    let h = $(`<div class='admin_list_item pointer action'>${hs}</div>`)

    h.find(".admin_list_username").eq(0).text(user.username)
    h.find(".admin_list_role")
      .eq(0)
      .text(`(${Hue.get_pretty_role_name(user.role)})`)

    h.click(function () {
      Hue.show_profile(user.username)
    })

    s.append(h)
  }

  Hue.msg_info2.show([`Admin List (${data.list.length})`, s[0]], function () {
    Hue.admin_list_open = true
  })
}

// Requests the ban list
Hue.request_ban_list = function () {
  if (!Hue.is_admin_or_op(Hue.role)) {
    Hue.not_an_op()
    return false
  }

  Hue.socket_emit("get_ban_list", {})
}

// Shows the ban list
Hue.show_ban_list = function (data) {
  let s = $("<div id='ban_list_container' class='grid_column_center'></div>")

  for (let user of data.list) {
    let hs =
      "<div class='flex_row_center'><div class='ban_list_username' title='Click To Unban'></div></div>"
    let h = $(`<div class='ban_list_item pointer action'>${hs}</div>`)

    h.find(".ban_list_username").eq(0).text(user.username)

    h.click(function () {
      if (confirm(`Are you sure you want to unban ${user.username}`)) {
        Hue.unban(user.username)
      }
    })

    s.append(h)
  }

  Hue.msg_info2.show([`Ban List (${data.list.length})`, s[0]], function () {
    Hue.ban_list_open = true
  })
}

// Requests the access log
Hue.request_access_log = function (filter = "") {
  if (!Hue.is_admin_or_op(Hue.role)) {
    Hue.not_an_op()
    return false
  }

  Hue.access_log_filter_string = filter

  Hue.socket_emit("get_access_log", {})
}

// Shows the access log
Hue.show_access_log = function (messages) {
  $("#access_log_container").html("")

  Hue.msg_access_log.show(function () {
    for (let message of messages) {
      let nice_date = Hue.utilz.nice_date(message.date)

      let el = $(`
            <div class='modal_item access_log_item dynamic_title' title='${nice_date}'>
                <div class='access_log_message'></div>
                <div class='access_log_date'></div>
            </div>`)

      el.find(".access_log_message")
        .eq(0)
        .text(`${message.data.username} ${message.data.content}`)
      el.find(".access_log_date").eq(0).text(nice_date)

      el.data("date", message.date)
      el.data("otitle", nice_date)

      $("#access_log_container").prepend(el)
    }

    $("#access_log_filter").val(Hue.access_log_filter_string)

    Hue.do_modal_filter()
  })
}

// Shows a window with the topic
Hue.show_topic_window = function () {
  let edit_html = ""

  if (Hue.check_op_permission(Hue.role, "topic")) {
    edit_html =
      "<div><div id='topic_window_edit' class='pointer action inline'>Edit</div></div>"
  }

  let h = $(`
    <div id='topic_window'>
        <div id='topic_window_text'></div>
        ${edit_html}
    </div>`)

  let text = h.find("#topic_window_text").eq(0)
  text.text(Hue.topic || "No topic yet")

  if (edit_html) {
    let edit = h.find("#topic_window_edit").eq(0)

    edit.click(function () {
      Hue.open_room_menu_section("room_config")
    })
  }

  Hue.msg_info2.show(["Topic", h[0]])
}

// Opens the room menu and opens a specific section
Hue.open_room_menu_section = function (name) {
  Hue.msg_room_menu.show(function () {
    setTimeout(function () {
      $(`#room_menu_toggle_${name}`).click()
    }, 200)
  })
}