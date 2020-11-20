// Setup main menu
Hue.setup_main_menu = function () {
  $("#main_menu_user_menu").click(function () {
    Hue.show_user_menu()
  })

  $("#main_menu_room_menu").click(function () {
    Hue.show_room_menu()
  })

  $("#main_menu_media_menu").click(function () {
    Hue.show_media_menu()
  })

  $("#main_menu_commands").click(function () {
    Hue.show_commands()
  })
}

// Show the main menu
Hue.show_main_menu = function () {
  Hue.msg_main_menu.show()
}