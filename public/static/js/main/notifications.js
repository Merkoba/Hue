// Some notification configurations
Hue.configure_notifications = function () {
  $("#notifications_configure_icon").click(function () {
    Hue.open_user_settings_category("notifications")
  })
}

// Makes popups used for events like join and part
Hue.make_info_popup = function (on_click = function () {}) {
  let autoclose_delay = Hue.get_setting("popup_notifications_close_delay")

  let popup = Hue.create_popup({
    position: "topright",
    autoclose: true,
    autoclose_delay = autoclose_delay,
    enable_titlebar: true,
    window_x: "inner_right",
    content_class: "!info_popup",
    window_width: "auto",
    on_click: on_click,
    close_on_escape: false,
  })

  popup.hue_date = Date.now()
  return popup
}

// Makes standard info popup items
Hue.make_info_popup_item = function (args = {}) {
  let def_args = {
    icon: "",
    messgage: "",
    action: true,
    push: true,
    on_click: false,
    type: "",
  }

  args = Object.assign(def_args, args)

  let classes = ""

  if (args.action) {
    classes = "pointer action"
  }

  if (args.push) {
    let push = true

    if (
      (args.type === "user_join" &&
        !Hue.get_setting("save_user_join_notifications")) ||
      (args.type === "user_part" &&
        !Hue.get_setting("save_user_part_notifications")) ||
      (args.type === "room" && !Hue.get_setting("save_room_notifications"))
    ) {
      push = false
    }

    if (push) {
      Hue.push_notification(args.icon, args.message, args.on_click)
    }
  }

  return `<div class='info_popup_item ${classes}'><i class='${
    args.icon
  } info_popup_icon'></i><div>${Hue.utilz.make_html_safe(
    args.message
  )}</div></div>`
}

// Pushes a new notification to the notifications window
Hue.push_notification = function (icon, message, on_click = false) {
  let d = Date.now()
  let t = Hue.utilz.nice_date(d)

  let icon_html = ""

  if (icon) {
    icon_html = `<i class='${icon} notifications_icon'></i>`
  }

  let message_html = `<div class='notifications_messasge'>${Hue.utilz.make_html_safe(
    message
  )}</div>`
  let content_classes = ""

  if (on_click) {
    content_classes = "pointer action"
  }

  let item = $(
    `<div class='notifications_item modal_item'><div class='notifications_item_content ${content_classes} dynamic_title'>${icon_html}${message_html}</div>`
  )
  let content = item.find(".notifications_item_content").eq(0)

  content.attr("title", t)
  content.data("otitle", t)
  content.data("date", d)

  if (on_click) {
    content.click(function () {
      on_click()
    })
  }

  let items = $("#notifications_container .notifications_item")
  let num_items = items.length

  if (num_items === 0) {
    $("#notifications_container").html(item)
  } else {
    $("#notifications_container").prepend(item)
  }

  if (num_items > Hue.config.notifications_crop_limit) {
    $("#notifications_container .notifications_item").last().remove()
  }
}

// Shows information about the recent info popups
Hue.show_notifications = function (filter = false) {
  Hue.msg_notifications.show(function () {
    if (filter) {
      $("#notifications_filter").val(filter)
      Hue.do_modal_filter()
    }
  })
}

// Centralized function for room changes
Hue.show_room_notification = function (username, message) {
  let f = function () {
    Hue.show_profile(username)
  }

  let item = Hue.make_info_popup_item({
    message: message,
    on_click: f,
    type: "room",
  })
  let method = Hue.get_setting("room_notifications_method")

  if (method === "popups") {
    Hue.show_popup(Hue.make_info_popup(f), item)
  } else if (method === "chat") {
    Hue.public_feedback(message, {
      username: username,
      open_profile: true,
    })
  }
}

// Centralized function to show a popup
Hue.show_popup = function (popup, html="") {
  if (html) {
    popup.set(html)
  }

  if (Hue.app_focused) {
    if (Hue.get_popup_instances().length > Hue.config.max_info_popups) {
      popup.destroy()
      return
    }

    if (popup.hue_date) {
      popup.set_title(Hue.get_timeago(popup.hue_date))
    }

    popup.show()
  } else {
    Hue.add_to_info_popups(popup)
  }
}

// Trigger stored notification popups
Hue.show_info_popups = function () {
  for (popup of Hue.info_popups) {
    Hue.show_popup(popup)
  }

  Hue.info_popups = []
}

// Add popup to info popups list
Hue.add_to_info_popups = function (popup) {
  Hue.info_popups.push(popup)

  if (Hue.info_popups.length > Hue.config.max_info_popups) {
    let remainder = Hue.info_popups.slice(0, Hue.info_popups.length - Hue.config.max_info_popups)
    
    for (let popup of remainder) {
      popup.destroy()
    }

    Hue.info_popups = Hue.info_popups.slice(-Hue.config.max_info_popups)
  }
}