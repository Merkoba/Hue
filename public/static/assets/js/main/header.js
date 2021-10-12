// Setups the header
Hue.setup_header = function () {
  $("#header_main_menu").on("click", function () {
    Hue.show_main_menu()
  })

  $("#header_users").on("click", function () {
    Hue.show_userlist_window()
  })

  $("#header_message_board").on("click", function () {
    Hue.show_message_board()
  })

  $("#header_notifications").on("click", function () {
    Hue.show_notifications()
  })

  $("#header_whispers").on("click", function () {
    Hue.show_whispers()
  })

  $("#header_lock_screen").on("click", function () {
    Hue.lock_screen()
  })
}