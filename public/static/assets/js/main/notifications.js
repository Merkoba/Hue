// Makes popups used for events like join and part
Hue.make_info_popup = function (on_click = function () {}) {
  let autoclose_delay = Hue.config.notifications_close_delay

  let popup = Hue.create_popup({
    position: "topright",
    autoclose: true,
    autoclose_delay: autoclose_delay,
    enable_titlebar: true,
    window_x: "inner_right",
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
    icon: "",
    message: "",
    action: true,
    push: true,
    on_click: false
  }

  args = Object.assign(def_args, args)

  let classes = ""

  if (args.action) {
    classes = "action"
  }

  if (args.push) {
    Hue.push_notification(args.icon, args.message, args.on_click)
  }

  if (args.icon) {
    icon = `<svg class='other_icon info_popup_icon'><use href='#icon_${args.icon}'></svg>`
  }

  return `<div class='info_popup_item ${classes}'>
  ${icon}
  <div>${Hue.utilz.make_html_safe(
    args.message
  )}</div></div>`
}

// Pushes a new notification to the notifications window
Hue.push_notification = function (icon, message, on_click = false) {
  let d = Date.now()
  let t = Hue.utilz.nice_date(d)

  let icon_html = ""

  if (icon) {
    icon_html = `<svg class='other_icon notifications_icon'><use href='#icon_${icon}'></svg>`
  }

  let message_html = `<div class='notifications_message'>${Hue.utilz.make_html_safe(
    message
  )}</div>`
  let content_classes = ""

  if (on_click) {
    content_classes = "action"
  }

  let s = 
    `<div class='notifications_item modal_item'>
      <div class='notifications_item_content ${content_classes} dynamic_title'>${icon_html}${message_html}</div>
    </div>`

  let item = document.createElement("div")
  item.innerHTML = s
  let content = item.querySelector(".notifications_item_content")

  content.title = t
  Hue.dataset(content, "otitle", t)
  Hue.dataset(content, "date", d)

  if (on_click) {
    content.addEventListener("click", function () {
      on_click()
    })
  }

  let items = Hue.els("#notifications_container .notifications_item")

  if (items.length === 0) {
    Hue.el("#notifications_container").innerHTML = item
  } else {
    Hue.el("#notifications_container").prepend(item)
  }

  if (items.length > Hue.config.notifications_crop_limit) {
    items.slice(-1)[0].remove()
  }

  if (Hue.notifications_count < 100) {
    Hue.notifications_count += 1
    Hue.el("#header_notifications_count").textContent = `(${Hue.notifications_count})`
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
Hue.show_room_notification = function (username, message) {
  let f = function () {
    Hue.show_profile(username)
  }

  let item = Hue.make_info_popup_item({
    message: message,
    on_click: f,
    icon: "info"
  })

  Hue.show_popup(Hue.make_info_popup(f), item)
}

// Centralized function to show a popup
Hue.show_popup = function (popup, html="") {
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