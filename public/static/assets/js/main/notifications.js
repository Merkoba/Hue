// Makes popups used for events like join and part
Hue.make_info_popup = function (on_click = function () {}) {
  let autoclose_delay = Hue.config.notifications_close_delay

  let popup = Hue.create_popup({
    position: "topright",
    autoclose: true,
    autoclose_delay: autoclose_delay,
    enable_titlebar: false,
    window_x: "none",
    content_class: "!info_popup",
    window_width: "auto",
    on_click: on_click,
    close_on_escape: false,
  }, "info")

  popup.hue_date = Date.now()
  return popup
}

// Makes standard info popup items
Hue.make_info_popup_item = function (args = {}) {
  let def_args = {
    icon: "info",
    action: true,
    push: true,
    increase_counter: true
  }

  args = Object.assign(def_args, args)

  let classes = ""

  if (args.action) {
    classes = "action"
  }

  if (args.push) {
    Hue.push_notification({
      icon: args.icon,
      message: args.message,
      on_click: args.on_click,
      increase_counter: args.increase_counter
    })
  }

  return Hue.template_popup_item({
    icon: args.icon,
    message: args.message,
    classes: classes
  })
}

// Pushes a new notification to the notifications window
Hue.push_notification = function (args) {
  let def_args = {
    icon: "info",
    increase_counter: true
  }

  args = Object.assign(def_args, args)

  let d = Date.now()
  let t = Hue.utilz.nice_date(d)

  let content_classes = ""

  if (args.on_click) {
    content_classes = "pointer"
  }

  let item = Hue.create("div", "notification_item modal_item dynamic_title")

  item.innerHTML = Hue.template_notification({
    content_classes: content_classes,
    icon: args.icon,
    message: args.message,
    date: t
  })

  item.title = t
  
  Hue.dataset(item, "otitle", t)
  Hue.dataset(item, "date", d)

  if (args.on_click) {
    Hue.ev(item, "click", function () {
      args.on_click()
    })
  }
  
  Hue.el("#notifications_container").prepend(item)
  
  let items = Hue.els(".notification_item")

  if (items.length > Hue.config.notifications_crop_limit) {
    items.slice(-1)[0].remove()
  }

  if (args.increase_counter && !Hue.msg_notifications.is_open() && !Hue.has_focus) {
    if (Hue.notifications_count < 100) {
      Hue.notifications_count += 1
      Hue.el("#header_notifications_count").textContent = `(${Hue.notifications_count})`
    }
  }

  let empty = Hue.el("#notifications_container .empty_window_message")

  if (empty) {
    empty.remove()
  }
}

// Shows information about the recent info popups
Hue.show_notifications = function (filter = "") {
  Hue.msg_notifications.show(function () {
    if (filter.trim()) {
      Hue.el("#notifications_filter").value = filter
      Hue.do_modal_filter()
    }

    Hue.notifications_count = 0
    Hue.el("#header_notifications_count").textContent = "(0)"
  })
}

// Centralized function for room changes
Hue.show_room_notification = function (username, message, icon = "info") {
  let user = Hue.get_user_by_username(username)

  let f = function () {
    if (user) {
      Hue.show_profile(user.username, user.user_id)
    } else {
      Hue.show_profile(username)
    }
  }

  let item = Hue.make_info_popup_item({
    message: message,
    on_click: f,
    icon: icon
  })

  Hue.show_popup(Hue.make_info_popup(f), item)
}

// Another centralized function for room changes
Hue.show_action_notification = function (message, icon, f) {
  let item = Hue.make_info_popup_item({
    message: message,
    on_click: f,
    icon: icon
  })

  Hue.show_popup(Hue.make_info_popup(f), item)
}

// Centralized function to show a popup
Hue.show_popup = function (popup, html="") {
  if (!Hue.room_state.notifications_enabled) {
    return
  }

  if (html) {
    popup.set(html)
  }

  if (Hue.num_open_info_popups() >= Hue.config.max_info_popups) {
    return
  }

  if (popup.hue_date) {
    popup.set_title(Hue.utilz.timeago(popup.hue_date))
  }

  popup.show()
}

// Get the number of visible info popups
Hue.num_open_info_popups = function () {
  let popups = Hue.get_popup_instances()
  let num = 0

  for (let popup of popups) {
    if (popup.hue_type === "info" && popup.is_open()) {
      num += 1
    }
  }

  return num
}