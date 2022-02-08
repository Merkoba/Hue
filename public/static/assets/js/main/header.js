// Setups the header
Hue.setup_header = function () {
  Hue.el("#header_main_menu").addEventListener("click", function () {
    Hue.show_main_menu()
  })

  Hue.el("#header_main_menu").addEventListener("auxclick", function (e) {
    if (e.which === 2) {
      Hue.flip()
    }
  })

  Hue.el("#header_users").addEventListener("click", function () {
    Hue.show_userlist_window()
  })

  Hue.el("#header_message_board").addEventListener("click", function () {
    Hue.show_message_board()
  })

  Hue.el("#header_notifications").addEventListener("click", function () {
    Hue.show_notifications()
  })

  Hue.el("#header_whispers").addEventListener("click", function () {
    Hue.show_whispers()
  })

  Hue.el("#header_lock_screen").addEventListener("click", function () {
    Hue.lock_screen()
  })

  Hue.setup_header_menu()
}

// Setup the header menu
Hue.setup_header_menu = function () {
  Hue.vertical_separator(Hue.el("#header_menu"))

  Hue.el("#header_menu_main_menu").addEventListener("click", function () {
    Hue.show_main_menu()
  })

  Hue.el("#header_menu_users").addEventListener("click", function () {
    Hue.show_userlist_window()
  })

  Hue.el("#header_menu_message_board").addEventListener("click", function () {
    Hue.show_message_board()
  })

  Hue.el("#header_menu_whispers").addEventListener("click", function () {
    Hue.show_whispers()
  })

  Hue.el("#header_menu_notifications").addEventListener("click", function () {
    Hue.show_notifications()
  })

  Hue.el("#header_menu_lock").addEventListener("click", function () {
    Hue.lock_screen()
  })  
}

// Show a menu of header items
Hue.show_header_menu = function () {
  Hue.msg_header_menu.show()
}