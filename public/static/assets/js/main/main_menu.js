// Setup main menu
Hue.setup_main_menu = function () {
  Hue.el("#main_menu_user_menu").addEventListener("click", function () {
    Hue.show_user_menu()
  })

  Hue.el("#main_menu_room_menu").addEventListener("click", function () {
    Hue.show_room_menu()
  })

  Hue.el("#main_menu_media_menu").addEventListener("click", function () {
    Hue.show_media_menu()
  })

  Hue.el("#main_menu_rooms").addEventListener("click", function () {
    Hue.show_rooms()
  })

  Hue.el("#main_menu_settings").addEventListener("click", function () {
    Hue.show_settings()
  })

  Hue.el("#main_menu_commands").addEventListener("click", function () {
    Hue.show_commands()
  })
}

// Show the main menu
Hue.show_main_menu = function () {
  Hue.msg_main_menu.show()
}

// Configure main menu based on role
Hue.config_main_menu = function () {
  if (Hue.is_admin_or_op()) {
    Hue.el("#main_menu_room_menu").style.display = "block"
  } else {
    Hue.el("#main_menu_room_menu").style.display = "none"
  }

  Hue.vertical_separator(Hue.el("#main_menu"))
}