// Setups the header
Hue.setup_header = () => {
  Hue.ev(Hue.el(`#header_main_menu`), `click`, () => {
    Hue.show_main_menu()
  })

  Hue.ev(Hue.el(`#header_main_menu`), `auxclick`, (e) => {
    if (e.which === 2) {
      Hue.flip()
    }
  })

  Hue.ev(Hue.el(`#header_users`), `click`, () => {
    Hue.show_userlist_window()
  })

  Hue.ev(Hue.el(`#header_message_board`), `click`, () => {
    Hue.show_message_board()
  })

  Hue.ev(Hue.el(`#header_notifications`), `click`, () => {
    Hue.show_notifications()
  })

  Hue.ev(Hue.el(`#header_whispers`), `click`, () => {
    Hue.show_whispers()
  })

  Hue.ev(Hue.el(`#header_notifications_enabled`), `click`, () => {
    Hue.toggle_notifications_enabled()
  })

  Hue.set_notifications_enabled_icon()
}

// Apply notifications enabled icon
Hue.set_notifications_enabled_icon = () => {
  if (Hue.room_state.notifications_enabled) {
    Hue.el(`#header_notifications_enabled use`).href.baseVal = `#icon_unlocked`
  }
  else {
    Hue.el(`#header_notifications_enabled use`).href.baseVal = `#icon_locked`
  }
}

// Toggle notifications enabled
Hue.toggle_notifications_enabled = () => {
  Hue.room_state.notifications_enabled = !Hue.room_state.notifications_enabled
  Hue.set_notifications_enabled_icon()
  let what = Hue.room_state.notifications_enabled ? `enabled` : `disabled`
  Hue.flash_info(`Info`, `Notification popups are now ${what}`)
  Hue.save_room_state()
}