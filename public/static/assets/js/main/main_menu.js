// Setup main menu
App.setup_main_menu = () => {
  App.ev(App.el(`#main_menu_user_profile`), `click`, () => {
    App.msg_main_menu.close()
    App.show_user_profile()
  })

  App.ev(App.el(`#main_menu_room_config`), `click`, () => {
    App.msg_main_menu.close()
    App.show_room_config()
  })

  App.ev(App.el(`#main_menu_rooms`), `click`, () => {
    App.msg_main_menu.close()
    App.show_roomlist()
  })

  App.ev(App.el(`#main_menu_settings`), `click`, () => {
    App.msg_main_menu.close()
    App.show_settings()
  })

  App.ev(App.el(`#main_menu_commands`), `click`, () => {
    App.msg_main_menu.close()
    App.show_command_book()
  })

  App.ev(App.el(`#main_menu_chat_search`), `click`, () => {
    App.msg_main_menu.close()
    App.show_chat_search()
  })

  App.ev(App.el(`#main_menu_media_tweaks`), `click`, () => {
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
    App.el(`#main_menu_room_config`).style.display = `block`
  }
  else {
    App.el(`#main_menu_room_config`).style.display = `none`
  }

  App.vertical_separator(App.el(`#main_menu`))
}