// Changes the tab title to reflect activity
// The character used depends on the activity type
// Either general activity, or highlighted activity
Hue.alert_title = function (mode) {
  let modes = [1, 2]

  if (!modes.includes(mode)) {
    return false
  }

  if (mode === 1 && Hue.alert_mode !== 0) {
    return false
  }

  if (mode === 2 && Hue.alert_mode === 2) {
    return false
  }

  Hue.alert_mode = mode
  Hue.update_title()
  Hue.generate_favicon(mode)
}

// Removes the activity indicator in the tab title
Hue.remove_alert_title = function () {
  if (Hue.alert_mode > 0) {
    Hue.alert_mode = 0
    Hue.update_title()
  }

  if (Hue.favicon_mode > 0) {
    Hue.generate_favicon(0)
  }
}

// Sets the tab title
Hue.set_title = function (s) {
  document.title = s.substring(0, Hue.config.max_title_length)
}

// Updates the tab title
// Taking into account the alert mode, room name, and topic
Hue.update_title = function () {
  let t = ""

  if (Hue.alert_mode === 1) {
    t += "(*) "
  } else if (Hue.alert_mode === 2) {
    t += "(!) "
  }

  t += Hue.room_name

  if (Hue.topic !== "") {
    t += ` ${Hue.config.title_separator} ${Hue.topic}`
  }

  Hue.set_title(t)
}

// Starts the listener to check when the client is visible or not
// A function is executed on visibility change
// Blur event is also included to handle some cases
Hue.activate_visibility_listener = function () {
  document.addEventListener(
    "visibilitychange",
    function () {
      Hue.process_visibility()
    },
    false
  )

  window.onblur = function () {
    Hue.keys_pressed = {}
  }
}

// This runs after a visibility change
// Does things depending if the client is visible or not
Hue.process_visibility = function () {
  if (Hue.room_state.screen_locked) {
    return false
  }

  Hue.app_focused = !document.hidden

  if (Hue.app_focused) {
    Hue.on_app_focused()
  } else {
    Hue.on_app_unfocused()
  }
}

// This runs when the client regains visibility
Hue.on_app_focused = function () {
  Hue.remove_alert_title()
  Hue.show_info_popups()
  Hue.show_fresh_messages()
  Hue.trigger_activity()
}

// This runs when the client loses visibility
Hue.on_app_unfocused = function () {
  Hue.check_scrollers()
}

// Starts window resize events
Hue.resize_events = function () {
  $(window).resize(function () {
    Hue.resize_timer()
  })
}

// What to do after a window resize
Hue.on_resize = function () {
  Hue.fix_frames()
  Hue.goto_bottom(false, false)
  Hue.check_scrollers()
}

// Setup events for application close or refresh
Hue.setup_before_unload = function () {
  window.onbeforeunload = function (e) {
    if (
      Hue.connected &&
      !Hue.user_leaving &&
      Hue.get_setting("warn_before_closing")
    ) {
      return "Are you sure?"
    }
  }
}
