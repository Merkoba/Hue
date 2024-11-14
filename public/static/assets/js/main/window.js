// Changes the tab title to reflect activity
// The character used depends on the activity type
// Either general activity, or highlighted activity
App.alert_title = (mode) => {
  let modes = [1, 2]

  if (!modes.includes(mode)) {
    return
  }

  if (mode === 1 && App.alert_mode !== 0) {
    return
  }

  if (mode === 2 && App.alert_mode === 2) {
    return
  }

  App.alert_mode = mode
  App.generate_favicon(mode)
}

// Removes the activity favicon
App.remove_alert_title = () => {
  if (App.alert_mode > 0) {
    App.alert_mode = 0
  }

  if (App.favicon_mode > 0) {
    App.generate_favicon(0)
  }
}

// Sets the tab title
App.set_title = (s) => {
  document.title = s.substring(0, App.config.max_title_length)
}

// Updates the tab title
// Taking into account the room name and topic
App.update_title = () => {
  if (App.get_setting(`unread_count`) && App.unread_count > 0) {
    App.set_title(`(${App.unread_count}) ${App.room_name}`)
  }
  else {
    App.set_title(App.room_name)
  }
}

// Increase unread counter and update title
App.increase_unread = () => {
  if (App.started) {
    if (App.unread_count < 999) {
      App.unread_count += 1
      App.update_title()
    }
  }
}

// Starts the listener to check when the client is visible or not
// A function is executed on visibility change
// Blur event is also included to handle some cases
App.activate_visibility_listener = () => {
  DOM.ev(document, `visibilitychange`, () => {
    App.process_visibility()
  }, false)
}

// This runs after a visibility change
// Does things depending if the client is visible or not
App.process_visibility = () => {
  App.has_focus = !document.hidden

  if (App.has_focus) {
    App.on_focus()
  }
  else {
    App.on_unfocus()
  }
}

// This runs when the client regains visibility
App.on_focus = () => {
  App.change_media({type: `image`, force: false, play: false})
  App.change_media({type: `tv`, force: false, play: false})
  App.remove_alert_title()
  App.show_fresh_messages()
  App.focus_input()
  App.check_latest_highlight()
  App.unread_count = 0
  App.update_title()

  if (!App.chat_scrolled_on_unfocus) {
    App.goto_bottom(true)
  }
}

// This runs when the client loses visibility
App.on_unfocus = () => {
  App.chat_scrolled_on_unfocus = App.chat_scrolled
}

// Starts window resize events
App.resize_events = () => {
  DOM.ev(window, `resize`, () => {
    App.resize_debouncer.call()
  })
}

// What to do after a window resize
App.on_resize = () => {
  App.fix_frames()
  App.scroll_to_radio_station()
}