// Setups lockscreen events
Hue.setup_lockscreen = function () {
  $("#lockscreen_title_menu").on("mouseenter", function () {
    Hue.lockscreen_peek_timeout = setTimeout(function () {
      $("#Msg-container-lockscreen").css("opacity", 0.2)
      Hue.lockscreen_peek_active = true
    }, Hue.lockscreen_peek_delay)
  })

  $("#lockscreen_title_menu").on("mouseleave", function () {
    clearTimeout(Hue.lockscreen_peek_timeout)

    if (Hue.lockscreen_peek_active) {
      $("#Msg-container-lockscreen").css("opacity", 1)
      Hue.remove_alert_title()
    }

    Hue.lockscreen_peek_active = false
  })

  $("#lockscreen_principal").click(function () {
    Hue.unlock_screen()
  })
}

// Enables the lockscreen
// The lockscreen is a special mode where the display is covered
// The user is considered unfocused
Hue.lock_screen = function (save = true, force = false) {
  if (!force && Hue.screen_locked) {
    return false
  }

  Hue.stop_tv()
  Hue.screen_locked = true
  Hue.msg_lockscreen.show()

  Hue.execute_commands("on_lockscreen")

  if (save) {
    Hue.save_room_state()
  }
}

// Disables the lockscreen
Hue.unlock_screen = function (save = true) {
  if (!Hue.screen_locked) {
    return false
  }

  clearTimeout(Hue.lockscreen_peek_timeout)

  Hue.screen_locked = false
  Hue.msg_lockscreen.close()
  Hue.process_visibility()
  Hue.change({ type: "image" })
  Hue.change({ type: "tv" })
  Hue.execute_commands("on_unlockscreen")

  if (save) {
    Hue.save_room_state()
  }
}