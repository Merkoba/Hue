// Setups the header
Hue.setup_header = function () {
  $("#header_left_room_menu_icon").on("auxclick", function (e) {
    if (e.which === 2) {
      let rotated = $("#main_container").data("hue_rotated")
      let degrees = rotated ? 0 : 180

      $("#main_container").css("transform", `rotateY(${degrees}deg)`)
      $("#main_container").data("hue_rotated", !Boolean(rotated))
    }
  })

  $("#header_left_users_container").on("auxclick", function (e) {
    if (e.which === 2) {
      let user =
        Hue.userlist[Hue.utilz.get_random_int(0, Hue.userlist.length - 1)]
      Hue.show_profile(user.username)
    }
  })

  $("#header_left_room_menu_icon").click(function () {
    Hue.show_room_menu()
  })

  $("#header_left_users_container").click(function () {
    Hue.show_userlist_window()
  })

  $("#header_left_messageboard_container").click(function () {
    Hue.show_message_board()
  })

  $("#header_right_icon_lock").click(function () {
    Hue.lock_screen()
  })

  $("#header_right_icon_envelope").click(function () {
    Hue.show_whispers()
  })

  $("#header_right_icon_bell").click(function () {
    Hue.show_notifications()
  })
}