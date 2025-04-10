// Makes popups used for events like join and part
App.make_info_popup = (on_click = () => {}) => {
  let autoclose_delay = App.config.notifications_close_delay

  let popup = App.create_popup({
    position: `topright`,
    autoclose: true,
    autoclose_delay,
    enable_titlebar: false,
    window_x: `none`,
    content_class: `!info_popup`,
    window_width: `auto`,
    on_click,
    close_on_escape: false,
  }, `info`)

  popup.hue_date = Date.now()
  return popup
}

// Makes standard info popup items
App.make_info_popup_item = (args = {}) => {
  let def_args = {
    icon: `info`,
    action: true,
    push: true,
    increase_counter: true,
    on_click: () => {},
  }

  App.utilz.def_args(def_args, args)
  let classes = ``

  if (args.action) {
    classes = `action`
  }

  if (args.push) {
    App.push_notification({
      icon: args.icon,
      profilepic: args.profilepic,
      message: args.message,
      on_click: args.on_click,
      increase_counter: args.increase_counter,
    })
  }

  if (args.profilepic) {
    return App.template_popup_item_2({
      profilepic: args.profilepic,
      message: args.message,
      classes,
    })
  }

  return App.template_popup_item({
    icon: args.icon,
    message: args.message,
    classes,
  })
}

// Pushes a new notification to the notifications window
App.push_notification = (args) => {
  let def_args = {
    icon: `info`,
    increase_counter: true,
  }

  App.utilz.def_args(def_args, args)
  let d = Date.now()
  let t = App.format_date(d)
  let content_classes = ``

  if (args.on_click) {
    content_classes = `pointer`
  }

  let item = DOM.create(`div`, `notification_item modal_item`)
  item.title = App.nice_date(d)

  if (args.profilepic) {
    let html = App.template_notification_2({
      content_classes,
      profilepic: args.profilepic,
      message: args.message,
      date: t,
    })

    html = App.urlize_html(html)
    item.innerHTML = html
  }
  else {
    let html = App.template_notification({
      content_classes,
      icon: args.icon,
      message: args.message,
      date: t,
    })

    html = App.urlize_html(html)
    item.innerHTML = html
  }

  let pic = DOM.el(`.profilepic`, item)

  if (pic) {
    DOM.ev(pic, `error`, () => {
      App.fallback_profilepic(pic)
    })
  }

  DOM.dataset(item, `date`, d)
  let content = DOM.el(`.notification_content`, item)

  if (args.on_click) {
    DOM.ev(content, `click`, (e) => {
      args.on_click(e)
    })
  }

  DOM.el(`#notifications_container`).prepend(item)
  let items = DOM.els(`.notification_item`)

  if (items.length > App.config.notifications_crop_limit) {
    items.at(-1).remove()
  }

  if (args.increase_counter && !App.msg_notifications.is_open() && !App.has_focus) {
    if (App.notifications_count < 100) {
      App.notifications_count += 1
      DOM.el(`#header_notifications_count`).textContent = `(${App.notifications_count})`
    }
  }

  let empty = DOM.el(`#notifications_container .empty_window_message`)

  if (empty) {
    empty.remove()
  }
}

// Shows information about the recent info popups
App.show_notifications = (filter = ``) => {
  App.msg_notifications.show()
  App.update_date_notifications()
  DOM.el(`#notifications_filter`).value = filter
  App.do_modal_filter()
  App.notifications_count = 0
  DOM.el(`#header_notifications_count`).textContent = `(0)`
}

// Centralized function for room changes
App.show_room_notification = (username, message, icon = `info`) => {
  let user = App.get_user_by_username(username)

  let f_popup = (win, e) => {
    if (e.target.tagName === `A`) {
      return
    }

    if (user) {
      App.show_profile(user.username, user.user_id)
    }
    else {
      App.show_profile(username)
    }
  }

  let f_item = (e) => {
    if (e.target.tagName === `A`) {
      return
    }

    if (user) {
      App.show_profile(user.username, user.user_id)
    }
    else {
      App.show_profile(username)
    }
  }

  let profilepic

  if (user) {
    profilepic = App.get_profilepic(user.user_id)
  }

  let html = App.make_info_popup_item({
    message,
    on_click: f_item,
    icon,
    profilepic,
  })

  App.show_popup(App.make_info_popup(f_popup), html)
}

// Another centralized function for room changes
App.show_action_notification = (message, icon, f) => {
  let item = App.make_info_popup_item({
    message,
    on_click: f,
    icon,
  })

  App.show_popup(App.make_info_popup(f), item)
}

// Centralized function to show a popup
App.show_popup = (popup, html = ``) => {
  if (!App.room_state.notifications_enabled) {
    return
  }

  if (html) {
    html = App.urlize_html(html)
    popup.set(html)
  }

  if (App.num_open_info_popups() >= App.config.max_info_popups) {
    return
  }

  if (popup.hue_date) {
    popup.set_title(App.utilz.timeago(popup.hue_date))
  }

  let pic = DOM.el(`.profilepic`, popup.content)

  if (pic) {
    DOM.ev(pic, `error`, () => {
      App.fallback_profilepic(pic)
    })
  }

  popup.show()
}

// Get the number of visible info popups
App.num_open_info_popups = () => {
  let popups = App.get_popup_instances()
  let num = 0

  for (let popup of popups) {
    if ((popup.hue_type === `info`) && popup.is_open()) {
      num += 1
    }
  }

  return num
}

// Send a notification to all users
App.send_notification = (message) => {
  if (!App.is_admin_or_op()) {
    return
  }

  let max_length = App.config.max_notification_length
  message = message.slice(0, max_length).trim()
  App.socket_emit(`send_notification`, {message})
}

// Show a notification made by an OP
App.notification_received = (data) => {
  App.show_room_notification(
    data.username, data.message,
  )
}