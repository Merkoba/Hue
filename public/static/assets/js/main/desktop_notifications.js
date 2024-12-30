7 // Triggers the browser notifications permission prompt if not yet active
App.request_desktop_notifications_permission = () => {
  if (typeof Notification === `undefined`) {
    return
  }

  if (App.has_desktop_notifications_permission()) {
    App.checkmsg(`Desktop Notifications are already enabled`)
    return
  }

  Notification.requestPermission()
}

// Checks if browser notification permission is already granted
App.has_desktop_notifications_permission = () => {
  if (typeof Notification === `undefined`) {
    return
  }

  return Notification.permission === `granted`
}

// Shows a browser notification
App.show_desktop_notification = (s) => {
  if (typeof Notification === `undefined`) {
    return
  }

  if (!App.has_desktop_notifications_permission()) {
    return
  }

  let n = new Notification(s)

  DOM.ev(n, `click`, (e) => {
    window.focus()
    e.target.close()
  })
}

// Shows a browser notification alerting of a highlight
App.show_highlight_desktop_notification = (username) => {
  if (!App.has_desktop_notifications_permission()) {
    return
  }

  App.show_desktop_notification(
    `New highlight in ${App.room_name.substring(0, 40)} (from ${username})`,
  )
}

// Shows a browser notification alerting an after message
App.show_activity_desktop_notification = (username) => {
  if (!App.has_desktop_notifications_permission()) {
    return
  }

  App.show_desktop_notification(
    `Activity in ${App.room_name.substring(0, 40)} (from ${username})`,
  )
}