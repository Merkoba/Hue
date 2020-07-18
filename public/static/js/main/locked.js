// If the user is banned the client enters locked mode
// This only shows a simple menu with a few navigation options
Hue.start_locked_mode = function () {
  $("#header").css("display", "none")
  $("#footer").css("display", "none")

  $("#locked_menu_visited_rooms").click(function () {
    Hue.request_roomlist('', 'visited_roomlist')
  })

  $("#locked_menu_public_rooms").click(function () {
    Hue.request_roomlist('', 'public_roomlist')
  })

  $("#locked_menu_goto_room").click(function () {
    Hue.show_goto_room()
  })

  $("#locked_menu_logout").click(function () {
    Hue.needs_confirm("logout")
  })

  Hue.show_locked_menu()
  Hue.make_main_container_visible()
}

// Show the locked menu
Hue.show_locked_menu = function () {
  Hue.msg_locked.show()
}
