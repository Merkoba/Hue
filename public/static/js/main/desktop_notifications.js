7 // Triggers the browser notifications permission prompt if not yet active
Hue.request_desktop_notifications_permission = function () {
  if (typeof Notification === "undefined") {
    return false
  }

  if (Hue.has_desktop_notifications_permission()) {
    Hue.msg_info.show("Desktop Notifications are already enabled")
    return false
  }

  Notification.requestPermission()
}

// Checks if browser notification permission is already granted
Hue.has_desktop_notifications_permission = function () {
  if (typeof Notification === "undefined") {
    return false
  }

  return Notification.permission === "granted"
}

// Shows a browser notification
Hue.show_desktop_notification = function (s) {
  if (typeof Notification === "undefined") {
    return false
  }

  if (!Hue.has_desktop_notifications_permission()) {
    return false
  }

  let n = new Notification(s)

  n.addEventListener("click", function (e) {
    window.focus()
    e.target.close()
  })
}

// Shows a browser notification alerting of a highlight
Hue.show_highlight_desktop_notification = function () {
  if (!Hue.has_desktop_notifications_permission()) {
    return false
  }

  if (Hue.afk) {
    if (Hue.get_setting("afk_disable_desktop_notifications")) {
      return false
    }
  }

  Hue.show_desktop_notification(
    `New highlight in ${Hue.room_name.substring(0, 40)}`
  )
}
