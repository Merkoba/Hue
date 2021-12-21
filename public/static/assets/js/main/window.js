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
  Hue.generate_favicon(mode)
}

// Removes the activity favicon
Hue.remove_alert_title = function () {
  if (Hue.alert_mode > 0) {
    Hue.alert_mode = 0
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
// Taking into account the room name and topic
Hue.update_title = function () {
  let t = Hue.room_name

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
}

// This runs after a visibility change
// Does things depending if the client is visible or not
Hue.process_visibility = function () {
  if (Hue.screen_locked) {
    return false
  }

  Hue.app_focused = !document.hidden

  if (Hue.app_focused) {
    Hue.on_app_focused()
  }
}

// This runs when the client regains visibility
Hue.on_app_focused = function () {
  Hue.change({type: "image", force: false, play: false})
  Hue.change({type: "tv", force: false, play: false})
  Hue.remove_alert_title()
  Hue.show_fresh_messages()
  Hue.focus_input()
  Hue.focused_once = true

  if (Hue.highlight_date_on_focus) {
    Hue.room_state.last_highlight_date = Hue.highlight_date_on_focus
    Hue.highlight_date_on_focus = 0
    Hue.save_room_state()
  }
}

// Starts window resize events
Hue.resize_events = function () {
  window.addEventListener("resize", function () {
    Hue.resize_timer()
  })
}

// What to do after a window resize
Hue.on_resize = function () {
  Hue.fix_frames()
  Hue.resize_activity_bar()
  Hue.check_scrollers(250)
  Hue.goto_bottom()
}