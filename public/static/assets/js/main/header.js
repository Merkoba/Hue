// Setups the header
Hue.setup_header = function () {
  Hue.ev(Hue.el("#header_main_menu"), "click", function () {
    Hue.show_main_menu()
  })

  Hue.ev(Hue.el("#header_main_menu"), "auxclick", function (e) {
    if (e.which === 2) {
      Hue.flip()
    }
  })

  Hue.ev(Hue.el("#header_users"), "click", function () {
    Hue.show_userlist_window()
  })

  Hue.ev(Hue.el("#header_message_board"), "click", function () {
    Hue.show_message_board()
  })

  Hue.ev(Hue.el("#header_notifications"), "click", function () {
    Hue.show_notifications()
  })

  Hue.ev(Hue.el("#header_whispers"), "click", function () {
    Hue.show_whispers()
  })

  Hue.ev(Hue.el("#header_notifications_enabled"), "click", function () {
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