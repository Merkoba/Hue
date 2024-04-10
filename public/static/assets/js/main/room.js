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
App.save_room_state = (force = false) => {
  let room_state_all = App.get_local_storage(App.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  room_state_all[App.room_id] = App.room_state
  App.save_local_storage(App.ls_room_state, room_state_all, force)
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
  App.urlize(DOM.el(`#topic_container`))
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

// Sets limited data with received data
App.set_limited_info = (data) => {
  App.limited = data.limited
  App.config_admin_limited()
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
  DOM.ev(DOM.el(`#admin_activity_clear`), `click`, () => {
    App.clear_admin_activity()
  })
}

// Shows the admin activity list
App.show_admin_activity = (messages) => {
  DOM.el(`#admin_activity_container`).innerHTML = ``
  App.msg_admin_activity.show()

  for (let data of messages) {
    let nd = App.nice_date(data.date)
    let s = `<div class='admin_activity_message'></div><div class='admin_activity_date'></div>`
    let el = DOM.create(`div`, `modal_item admin_activity_item`)
    el.innerHTML = s
    DOM.el(`.admin_activity_message`, el).textContent = `${data.username} ${data.content}`
    DOM.el(`.admin_activity_date`, el).textContent = nd
    DOM.dataset(el, `date`, data.date)
    DOM.el(`#admin_activity_container`).prepend(el)
  }

  DOM.el(`#admin_activity_filter`).value = App.admin_activity_filter_string
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
  DOM.el(`#admin_activity_container`).innerHTML = ``
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
  let container = DOM.el(`#admin_list_container`)
  container.innerHTML = ``
  data.list.sort(App.compare_userlist)

  for (let user of data.list) {
    let el = DOM.create(`div`, `admin_list_item action`)
    el.innerHTML = App.template_admin_list_item()

    DOM.el(`.admin_list_username`, el).textContent = user.username
    DOM.el(`.admin_list_role`, el).textContent = `(${App.get_pretty_role_name(user.role)})`

    DOM.ev(el, `click`, () => {
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
  let container = DOM.el(`#ban_list_container`)
  container.innerHTML = ``

  for (let user of data.list) {
    let el = DOM.create(`div`, `ban_list_item flex_row_center`)
    el.innerHTML = App.template_ban_list_item()

    let username = DOM.el(`.ban_list_username`, el)
    username.textContent = user.username

    DOM.ev(username, `click`, () => {
      App.show_profile(user.username, user.user_id)
    })

    let unban = DOM.el(`.ban_list_unban`, el)

    DOM.ev(unban, `click`, () => {
      App.show_confirm(`Unban ${user.username}`, () => {
        App.unban(user.username)
      })
    })

    App.horizontal_separator(el)
    container.append(el)
  }

  App.msg_ban_list.show()
}

// Changes the limited mode
App.change_limited = (limited) => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (App.limited !== limited) {
    App.socket_emit(`change_limited`, { limited: limited })
  }
  else {
    App.checkmsg(`Limited is already set to that`)
  }
}

// Announces limited changes
App.announce_limited_change = (data) => {
  let s = data.username

  if (data.limited) {
    s += ` enabled limited mode`
  }
  else {
    s += ` disabled limited mode`
  }

  if (data.topic !== App.topic) {
    App.show_room_notification(data.username, s)
    App.set_limited_info(data)
  }
}

// Check if limited
App.check_limited = () => {
  if (App.limited) {
    if (!App.is_admin_or_op()) {
      App.msg_info.show(App.limited_message)
      return false
    }
  }

  return true
}

// Toggle limited
App.toggle_limited = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.change_limited(!App.limited)
}