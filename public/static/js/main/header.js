// Setups the header
Hue.setup_header = function () {
  $("#header_main_menu").click(function () {
    Hue.show_main_menu()
  })

  $("#header_users").click(function () {
    Hue.show_userlist_window()
  })

  $("#header_message_board").click(function () {
    Hue.show_message_board()
  })

  $("#header_notifications").click(function () {
    Hue.show_notifications()
  })

  $("#header_whispers").click(function () {
    Hue.show_whispers()
  })

  $("#header_lock_screen").click(function () {
    Hue.lock_screen()
  })
}