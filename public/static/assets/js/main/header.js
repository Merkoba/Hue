// Setups the header
App.setup_header = () => {
  DOM.ev(DOM.el(`#header_main_menu`), `click`, () => {
    App.show_main_menu()
  })

  DOM.ev(DOM.el(`#header_main_menu`), `auxclick`, (e) => {
    if (e.which === 2) {
      App.flip()
    }
  })

  DOM.ev(DOM.el(`#header_users`), `click`, () => {
    App.show_userlist_window()
  })

  DOM.ev(DOM.el(`#header_message_board`), `click`, () => {
    App.show_message_board()
  })

  DOM.ev(DOM.el(`#header_notifications`), `click`, () => {
    App.show_notifications()
  })

  DOM.ev(DOM.el(`#header_whispers`), `click`, () => {
    App.show_whispers()
  })

  DOM.ev(DOM.el(`#header_notifications_enabled`), `click`, () => {
    App.toggle_notifications_enabled()
  })

  App.set_notifications_enabled_icon()
}

// Apply notifications enabled icon
App.set_notifications_enabled_icon = () => {
  if (App.room_state.notifications_enabled) {
    DOM.el(`#header_notifications_enabled use`).href.baseVal = `#icon_unlocked`
  }
  else {
    DOM.el(`#header_notifications_enabled use`).href.baseVal = `#icon_locked`
  }
}

// Toggle notifications enabled
App.toggle_notifications_enabled = () => {
  App.room_state.notifications_enabled = !App.room_state.notifications_enabled
  App.set_notifications_enabled_icon()
  let what = App.room_state.notifications_enabled ? `enabled` : `disabled`
  App.flash_info(`Info`, `Notification popups are now ${what}`)
  App.save_room_state()
}