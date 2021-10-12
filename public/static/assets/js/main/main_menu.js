// Setup main menu
Hue.setup_main_menu = function () {
  $("#main_menu_user_menu").on("click", function () {
    Hue.show_user_menu()
  })

  $("#main_menu_room_menu").on("click", function () {
    Hue.show_room_menu()
  })

  $("#main_menu_media_menu").on("click", function () {
    Hue.show_media_menu()
  })

  $("#main_menu_commands").on("click", function () {
    Hue.show_commands()
  })

  $("#main_menu_create_room").on("click", function () {
    Hue.show_create_room()
  })
}

// Show the main menu
Hue.show_main_menu = function () {
  Hue.msg_main_menu.show()
}

// Configure main menu based on role
Hue.config_main_menu = function () {
  if (Hue.is_admin_or_op()) {
    $("#main_menu_room_menu").css("display", "block")
  } else {
    $("#main_menu_room_menu").css("display", "none")
  }

  Hue.vertical_separator($("#main_menu")[0])
}