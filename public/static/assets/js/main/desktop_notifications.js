7 // Triggers the browser notifications permission prompt if not yet active
Hue.request_desktop_notifications_permission = () => {
  if (typeof Notification === `undefined`) {
    return
  }

  if (Hue.has_desktop_notifications_permission()) {
    Hue.checkmsg(`Desktop Notifications are already enabled`)
    return
  }

  Notification.requestPermission()
}

// Checks if browser notification permission is already granted
Hue.has_desktop_notifications_permission = () => {
  if (typeof Notification === `undefined`) {
    return
  }

  return Notification.permission === `granted`
}

// Shows a browser notification
Hue.show_desktop_notification = (s) => {
  if (typeof Notification === `undefined`) {
    return
  }

  if (!Hue.has_desktop_notifications_permission()) {
    return
  }

  let n = new Notification(s)

  Hue.ev(n, `click`, (e) => {
    window.focus()
    e.target.close()
  })
}

// Shows a browser notification alerting of a highlight
Hue.show_highlight_desktop_notification = (username) => {
  if (!Hue.has_desktop_notifications_permission()) {
    return
  }

  Hue.show_desktop_notification(
    `New highlight in ${Hue.room_name.substring(0, 40)} (from ${username})`
  )
}

// Shows a browser notification alerting an after message
Hue.show_activity_desktop_notification = (username) => {
  if (!Hue.has_desktop_notifications_permission()) {
    return
  }

  Hue.show_desktop_notification(
    `Activity in ${Hue.room_name.substring(0, 40)} (from ${username})`
  )
}