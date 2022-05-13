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

  for (let key in Hue.config) {
    if (key.startsWith("room_state_default_")) {
      let setting = key.replace("room_state_default_", "")
      if (Hue.room_state[setting] === undefined) {
        Hue.room_state[setting] = Hue.config[key]
        changed = true
      }
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

// Show the room name
Hue.show_room_name = function () {
  Hue.checkmsg(`Room: ${Hue.room_name}`)
}

// Change the name of the room
Hue.change_room_name = function (arg) {
  if (!Hue.is_admin_or_op()) {
    return
  }

  arg = Hue.utilz.single_space(
    arg.substring(0, Hue.config.max_room_name_length)
  )

  if (arg === Hue.room_name) {
    Hue.checkmsg("That's already the room name")
    return
  }

  if (arg.length > 0) {
    Hue.socket_emit("change_room_name", { name: arg })
  }
}

// Gets the topic
Hue.get_topic = function () {
  if (Hue.topic) {
    return Hue.topic
  } else {
    return Hue.config.default_topic
  }
}

// Shows the topic
Hue.show_topic = function () {
  Hue.show_info(Hue.template_topic({topic: Hue.get_topic()}))
  Hue.urlize(Hue.el("#topic_container"))
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
}

// Room name setter
Hue.set_room_name = function (name) {
  Hue.room_name = name
  Hue.config_admin_room_name()
}

// Changes the topic
Hue.change_topic = function (dtopic) {
  if (!Hue.is_admin_or_op()) {
    return
  }

  dtopic = Hue.utilz.single_space(
    dtopic.substring(0, Hue.config.max_topic_length)
  )

  if (dtopic.length > 0) {
    if (Hue.topic !== dtopic) {
      Hue.socket_emit("change_topic", { topic: dtopic })
    } else {
      Hue.checkmsg("Topic is already set to that")
    }
  }
}

// Announces topic changes
Hue.announce_topic_change = function (data) {
  if (data.topic !== Hue.topic) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed the topic`
    )

    Hue.set_topic_info(data)
    Hue.update_title()
  }
}

// Sets topic data with received data
Hue.set_topic_info = function (data) {
  if (!data) {
    data = {}
    data.topic = ""
  }

  Hue.topic = data.topic
  Hue.config_admin_topic()
}

// Requests the admin activity list from the server
Hue.request_admin_activity = function (filter = "") {
  if (!Hue.is_admin_or_op()) {
    Hue.not_an_op()
    return
  }

  Hue.admin_activity_filter_string = filter

  Hue.socket_emit("get_admin_activity", {})
}

// Shows the admin activity list
Hue.show_admin_activity = function (messages) {
  Hue.el("#admin_activity_container").innerHTML = ""

  Hue.msg_admin_activity.show(function () {
    for (let message of messages) {
      let nice_date = Hue.utilz.nice_date(message.date)

      let s = `<div class='admin_activity_message'></div><div class='admin_activity_date'></div>`

      let el = Hue.div("modal_item admin_activity_item dynamic_title")
      el.title = nice_date
      el.innerHTML = s

      Hue.el(".admin_activity_message", el).textContent = `${message.data.username} ${message.data.content}`
      Hue.el(".admin_activity_date", el).textContent = nice_date
      Hue.dataset(el, "date", message.date)
      Hue.dataset(el, "otitle", nice_date)
      Hue.el("#admin_activity_container").prepend(el)
    }

    Hue.el("#admin_activity_filter").value = Hue.admin_activity_filter_string
    Hue.do_modal_filter()
  })
}

// Requests the admin list
Hue.request_admin_list = function () {
  if (!Hue.is_admin_or_op()) {
    Hue.not_an_op()
    return
  }

  Hue.socket_emit("get_admin_list", {})
}

// Shows the admin list
Hue.show_admin_list = function (data) {
  let container = Hue.el("#admin_list_container")
  container.innerHTML = ""
  data.list.sort(Hue.compare_userlist)

  for (let user of data.list) {
    let el = Hue.div("admin_list_item action")
    el.innerHTML = Hue.template_admin_list_item()

    Hue.el(".admin_list_username", el).textContent = user.username
    Hue.el(".admin_list_role", el).textContent = `(${Hue.get_pretty_role_name(user.role)})`

    el.addEventListener("click", function () {
      Hue.show_profile(user.username, user.user_id)
    })

    container.append(el)
  }

  Hue.msg_admin_list.show()
}

// Requests the ban list
Hue.request_ban_list = function () {
  if (!Hue.is_admin_or_op()) {
    Hue.not_an_op()
    return
  }

  Hue.socket_emit("get_ban_list", {})
}

// Shows the ban list
Hue.show_ban_list = function (data) {
  let container = Hue.el("#ban_list_container")
  container.innerHTML = ""

  for (let user of data.list) {
    let el = Hue.div("ban_list_item flex_row_center")
    el.innerHTML = Hue.template_ban_list_item()
    
    let username = Hue.el(".ban_list_username", el)
    username.textContent = user.username
    
    username.addEventListener("click", function () {
      Hue.show_profile(user.username, user.user_id)
    })
    
    let unban = Hue.el(".ban_list_unban", el)
    
    unban.addEventListener("click", function () {
      Hue.show_confirm(`Unban ${user.username}`, function () {
        Hue.unban(user.username)
      })     
    })
    
    Hue.horizontal_separator(el)
    container.append(el)
  }

  Hue.msg_ban_list.show()
}