// Setups the header
Hue.setup_header = function () {
  $("#header_room_menu").click(function () {
    Hue.show_room_menu()
  })

  $("#header_room_menu").on("auxclick", function (e) {
    if (e.which === 2) {
      let rotated = $("#main_container").data("hue_rotated")
      let degrees = rotated ? 0 : 180

      $("#main_container").css("transform", `rotateY(${degrees}deg)`)
      $("#main_container").data("hue_rotated", !Boolean(rotated))
    }
  })

  $("#header_users").click(function () {
    Hue.show_userlist_window()
  })

  $("#header_users").on("auxclick", function (e) {
    if (e.which === 2) {
      let user =
        Hue.userlist[Hue.utilz.get_random_int(0, Hue.userlist.length - 1)]
      Hue.show_profile(user.username)
    }
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