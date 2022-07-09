// Setup main menu
Hue.setup_main_menu = function () {
  Hue.ev(Hue.el("#main_menu_user_profile"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_user_profile()
  })

  Hue.ev(Hue.el("#main_menu_room_config"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_room_config()
  })

  Hue.ev(Hue.el("#main_menu_rooms"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_roomlist()
  })

  Hue.ev(Hue.el("#main_menu_settings"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_settings()
  })

  Hue.ev(Hue.el("#main_menu_commands"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_command_book()
  })

  Hue.ev(Hue.el("#main_menu_chat_search"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_chat_search()
  })

  Hue.ev(Hue.el("#main_menu_media_tweaks"), "click", function () {
    Hue.msg_main_menu.close()
    Hue.show_media_tweaks()
  })
}

// Show the main menu
Hue.show_main_menu = function () {
  Hue.msg_main_menu.show()
}

// Configure main menu based on role
Hue.config_main_menu = function () {
  if (Hue.is_admin_or_op()) {
    Hue.el("#main_menu_room_config").style.display = "block"
  } else {
    Hue.el("#main_menu_room_config").style.display = "none"
  }

  Hue.vertical_separator(Hue.el("#main_menu"))
}