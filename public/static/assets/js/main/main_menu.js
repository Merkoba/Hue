// Setup main menu
Hue.setup_main_menu = function () {
  Hue.el("#main_menu_user_profile").addEventListener("click", function () {
    Hue.show_user_profile()
  })

  Hue.el("#main_menu_room_config").addEventListener("click", function () {
    Hue.show_room_config()
  })

  Hue.el("#main_menu_media_tweaks").addEventListener("click", function () {
    Hue.show_media_tweaks()
  })

  Hue.el("#main_menu_rooms").addEventListener("click", function () {
    Hue.show_roomlist()
  })

  Hue.el("#main_menu_settings").addEventListener("click", function () {
    Hue.show_settings()
  })

  Hue.el("#main_menu_commands").addEventListener("click", function () {
    Hue.show_command_book()
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