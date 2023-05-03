// Setup main menu
App.setup_main_menu = () => {
  DOM.ev(DOM.el(`#main_menu_user_profile`), `click`, () => {
    App.msg_main_menu.close()
    App.show_user_profile()
  })

  DOM.ev(DOM.el(`#main_menu_room_config`), `click`, () => {
    App.msg_main_menu.close()
    App.show_room_config()
  })

  DOM.ev(DOM.el(`#main_menu_rooms`), `click`, () => {
    App.msg_main_menu.close()
    App.show_roomlist()
  })

  DOM.ev(DOM.el(`#main_menu_settings`), `click`, () => {
    App.msg_main_menu.close()
    App.show_settings()
  })

  DOM.ev(DOM.el(`#main_menu_commands`), `click`, () => {
    App.msg_main_menu.close()
    App.show_command_book()
  })

  DOM.ev(DOM.el(`#main_menu_chat_search`), `click`, () => {
    App.msg_main_menu.close()
    App.show_chat_search()
  })

  DOM.ev(DOM.el(`#main_menu_media_tweaks`), `click`, () => {
    App.msg_main_menu.close()
    App.show_media_tweaks()
  })
}

// Show the main menu
App.show_main_menu = () => {
  App.msg_main_menu.show()
}

// Configure main menu based on role
App.config_main_menu = () => {
  if (App.is_admin_or_op()) {
    DOM.el(`#main_menu_room_config`).style.display = `block`
  }
  else {
    DOM.el(`#main_menu_room_config`).style.display = `none`
  }

  App.vertical_separator(DOM.el(`#main_menu`))
}