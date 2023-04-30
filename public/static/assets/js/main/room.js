// Gets the room state localStorage object
App.get_room_state = () => {
  let room_state_all = App.get_local_storage(App.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  App.room_state = room_state_all[App.room_id]

  if (App.room_state === undefined) {
    App.room_state = {}
  }

  let changed = false

  for (let key in App.config) {
    if (key.startsWith(`room_state_default_`)) {
      let setting = key.replace(`room_state_default_`, ``)
      if (App.room_state[setting] === undefined) {
        App.room_state[setting] = App.config[key]
        changed = true
      }
    }
  }

  if (changed) {
    App.save_room_state()
  }
}

// Saves the room state localStorage object
App.save_room_state = () => {
  let room_state_all = App.get_local_storage(App.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  room_state_all[App.room_id] = App.room_state
  App.save_local_storage(App.ls_room_state, room_state_all)
}

// Show the room name
App.show_room_name = () => {
  App.checkmsg(`Room: ${App.room_name}`)
}

// Change the name of the room
App.change_room_name = (arg) => {
  if (!App.is_admin_or_op()) {
    return
  }

  arg = App.utilz.single_space(
    arg.substring(0, App.config.max_room_name_length)
  )

  if (arg === App.room_name) {
    App.checkmsg(`That's already the room name`)
    return
  }

  if (arg.length > 0) {
    App.socket_emit(`change_room_name`, { name: arg })
  }
}

// Gets the topic
App.get_topic = () => {
  if (App.topic) {
    return App.topic
  }
  else {
    return App.config.default_topic
  }
}

// Shows the topic
App.show_topic = () => {
  App.show_info(App.template_topic({topic: App.get_topic()}))
  App.urlize(App.el(`#topic_container`))
}

// Announces room name changes
App.announce_room_name_change = (data) => {
  if (data.name !== App.room_name) {
    App.show_room_notification(
      data.username,
      `${data.username} changed the room name`
    )

    App.set_room_name(data.name)
    App.update_title()
    App.update_input_placeholder()
  }
}

// Room name setter
App.set_room_name = (name) => {
  App.room_name = name
  App.config_admin_room_name()
}

// Changes the topic
App.change_topic = (dtopic) => {
  if (!App.is_admin_or_op()) {
    return
  }

  dtopic = App.utilz.single_space(
    dtopic.substring(0, App.config.max_topic_length)
  )

  if (dtopic.length > 0) {
    if (App.topic !== dtopic) {
      App.socket_emit(`change_topic`, { topic: dtopic })
    }
    else {
      App.checkmsg(`Topic is already set to that`)
    }
  }
}

// Announces topic changes
App.announce_topic_change = (data) => {
  if (data.topic !== App.topic) {
    App.show_room_notification(
      data.username,
      `${data.username} changed the topic`
    )

    App.set_topic_info(data)
    App.update_title()
  }
}

// Sets topic data with received data
App.set_topic_info = (data) => {
  if (!data) {
    data = {}
    data.topic = ``
  }

  App.topic = data.topic
  App.config_admin_topic()
}

// Requests the admin activity list from the server
App.request_admin_activity = (filter = ``) => {
  if (!App.is_admin_or_op()) {
    App.not_an_op()
    return
  }

  App.admin_activity_filter_string = filter

  App.socket_emit(`get_admin_activity`, {})
}

// Setup admin activity
App.setup_admin_activity = () => {
  App.ev(App.el(`#admin_activity_clear`), `click`, () => {
    App.clear_admin_activity()
  })
}

// Shows the admin activity list
App.show_admin_activity = (messages) => {
  App.el(`#admin_activity_container`).innerHTML = ``
  App.msg_admin_activity.show()

  for (let data of messages) {
    let nice_date = App.utilz.nice_date(data.date)
    let s = `<div class='admin_activity_message'></div><div class='admin_activity_date'></div>`

    let el = App.create(`div`, `modal_item admin_activity_item dynamic_title`)
    el.title = nice_date
    el.innerHTML = s

    App.el(`.admin_activity_message`, el).textContent = `${data.username} ${data.content}`
    App.el(`.admin_activity_date`, el).textContent = nice_date
    App.dataset(el, `date`, data.date)
    App.dataset(el, `otitle`, nice_date)
    App.el(`#admin_activity_container`).prepend(el)
  }

  App.el(`#admin_activity_filter`).value = App.admin_activity_filter_string
  App.do_modal_filter()
}

// Clear admin activity
App.clear_admin_activity = () => {
  if (!App.is_admin()) {
    App.not_allowed()
    return
  }

  App.show_confirm(`Delete all admin activity logs`, () => {
    App.socket_emit(`clear_admin_activity`, {})
  })
}

// On admin activity clear
App.admin_activity_cleared = () => {
  App.el(`#admin_activity_container`).innerHTML = ``
}

// Requests the admin list
App.request_admin_list = () => {
  if (!App.is_admin_or_op()) {
    App.not_an_op()
    return
  }

  App.socket_emit(`get_admin_list`, {})
}

// Shows the admin list
App.show_admin_list = (data) => {
  let container = App.el(`#admin_list_container`)
  container.innerHTML = ``
  data.list.sort(App.compare_userlist)

  for (let user of data.list) {
    let el = App.create(`div`, `admin_list_item action`)
    el.innerHTML = App.template_admin_list_item()

    App.el(`.admin_list_username`, el).textContent = user.username
    App.el(`.admin_list_role`, el).textContent = `(${App.get_pretty_role_name(user.role)})`

    App.ev(el, `click`, () => {
      App.show_profile(user.username, user.user_id)
    })

    container.append(el)
  }

  App.msg_admin_list.show()
}

// Requests the ban list
App.request_ban_list = () => {
  if (!App.is_admin_or_op()) {
    App.not_an_op()
    return
  }

  App.socket_emit(`get_ban_list`, {})
}

// Shows the ban list
App.show_ban_list = (data) => {
  let container = App.el(`#ban_list_container`)
  container.innerHTML = ``

  for (let user of data.list) {
    let el = App.create(`div`, `ban_list_item flex_row_center`)
    el.innerHTML = App.template_ban_list_item()

    let username = App.el(`.ban_list_username`, el)
    username.textContent = user.username

    App.ev(username, `click`, () => {
      App.show_profile(user.username, user.user_id)
    })

    let unban = App.el(`.ban_list_unban`, el)

    App.ev(unban, `click`, () => {
      App.show_confirm(`Unban ${user.username}`, () => {
        App.unban(user.username)
      })
    })

    App.horizontal_separator(el)
    container.append(el)
  }

  App.msg_ban_list.show()
}