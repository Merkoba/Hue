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
      $("#lockscreen_title_info").text("")
    }

    Hue.lockscreen_peek_active = false
  })

  $("#lockscreen_principal").click(function () {
    Hue.unlock_screen()
  })

  $("#lockscreen_lights_off_button").click(function () {
    Hue.toggle_lockscreen_lights_off()
  })

  Hue.setup_lockscreen_clock()
}

// Setups the optional clock that appears in the lockscreen
Hue.setup_lockscreen_clock = function () {
  if (Hue.get_setting("show_clock_in_lockscreen")) {
    $("#lockscreen_clock").css("display", "block")
  } else {
    $("#lockscreen_clock").css("display", "none")
  }
}

// Enables the lockscreen
// The lockscreen is a special mode where the display is covered
// The user is considered unfocused
Hue.lock_screen = function (save = true, force = false) {
  if (!force && Hue.screen_locked) {
    return false
  }

  Hue.stop_and_lock(true)
  Hue.screen_locked = true
  Hue.process_lockscreen_lights_off()
  Hue.msg_lockscreen.show()

  Hue.execute_commands("on_lockscreen")

  if (save) {
    Hue.save_room_state()
  }

  $("#lockscreen_clock").text(Hue.utilz.clock_time())

  if (Hue.get_setting("show_clock_in_lockscreen")) {
    Hue.lockscreen_clock_interval = setInterval(function () {
      $("#lockscreen_clock").text(Hue.utilz.clock_time())
    }, Hue.update_lockscreen_clock_delay)
  }
}

// Disables the lockscreen
Hue.unlock_screen = function (save = true) {
  if (!Hue.screen_locked) {
    return false
  }

  clearTimeout(Hue.lockscreen_peek_timeout)
  clearInterval(Hue.lockscreen_clock_interval)

  Hue.screen_locked = false
  Hue.msg_lockscreen.close()
  Hue.process_visibility()
  Hue.unlock()
  Hue.execute_commands("on_unlockscreen")

  $("#lockscreen_title_info").text("")

  if (save) {
    Hue.save_room_state()
  }
}

// Enables dark lockscreen mode
Hue.lockscreen_turn_lights_off = function () {
  $("#lockscreen_body").addClass("black_background_color")
  $("#lockscreen_title_menu").addClass("black_background_color")
  $("#lockscreen_principal").addClass("grey_font_color")
  $("#lockscreen_lights_off_button").addClass("grey_font_color")
  $("#lockscreen_icon_menu").addClass("grey_background_color_parent")
  $("#lockscreen_lights_off_button").text("Turn Lights On")
  $("#lockscreen_clock").addClass("grey_font_color")
}

// Enables light lockscreen mode
Hue.lockscreen_turn_lights_on = function () {
  $("#lockscreen_body").removeClass("black_background_color")
  $("#lockscreen_title_menu").removeClass("black_background_color")
  $("#lockscreen_lights_off_button").text("Turn Lights Off")
  $("#lockscreen_principal").removeClass("grey_font_color")
  $("#lockscreen_clock").removeClass("grey_font_color")
  $("#lockscreen_lights_off_button").removeClass("grey_font_color")
  $("#lockscreen_icon_menu").removeClass("grey_background_color_parent")
}

// Adds an indicator in the lockscreen if it's enabled and there's activity
Hue.check_lockscreen_activity = function () {
  if (Hue.screen_locked) {
    if (!$("#lockscreen_title_info").text()) {
      $("#lockscreen_title_info").text("(New Activity)")
    }
  }
}

// Toggles between the light and dark lockscreen mode
Hue.toggle_lockscreen_lights_off = function () {
  Hue.room_state.lockscreen_lights_off = !Hue.room_state.lockscreen_lights_off
  Hue.process_lockscreen_lights_off()
  Hue.save_room_state()
}

// Sets lockscreen mode based on current state
Hue.process_lockscreen_lights_off = function () {
  if (Hue.room_state.lockscreen_lights_off) {
    Hue.lockscreen_turn_lights_off()
  } else {
    Hue.lockscreen_turn_lights_on()
  }
}