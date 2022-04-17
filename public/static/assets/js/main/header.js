// Setups the header
Hue.setup_header = function () {
  Hue.el("#header_main_menu").addEventListener("click", function () {
    Hue.show_main_menu()
  })

  Hue.el("#header_main_menu").addEventListener("auxclick", function (e) {
    if (e.which === 2) {
      Hue.flip()
    }
  })

  Hue.el("#header_users").addEventListener("click", function () {
    Hue.show_userlist_window()
  })

  Hue.el("#header_message_board").addEventListener("click", function () {
    Hue.show_message_board()
  })

  Hue.el("#header_notifications").addEventListener("click", function () {
    Hue.show_notifications()
  })

  Hue.el("#header_whispers").addEventListener("click", function () {
    Hue.show_whispers()
  })

  Hue.el("#header_notifications_enabled").addEventListener("click", function () {
    Hue.toggle_notifications_enabled()
  })

  Hue.set_notifications_enabled_icon()
}

// Apply notifications enabled icon
Hue.set_notifications_enabled_icon = function () {
  if (Hue.room_state.notifications_enabled) {
    Hue.el("#header_notifications_enabled use").href.baseVal = "#icon_unlocked"
  } else {
    Hue.el("#header_notifications_enabled use").href.baseVal = "#icon_locked"
  }
}

// Toggle notifications enabled
Hue.toggle_notifications_enabled = function () {
  Hue.room_state.notifications_enabled = !Hue.room_state.notifications_enabled
  Hue.set_notifications_enabled_icon()
  let what = Hue.room_state.notifications_enabled ? "enabled" : "disabled"
  Hue.flash_info("Info", `Notification popups are now ${what}`)
  Hue.save_room_state()
}