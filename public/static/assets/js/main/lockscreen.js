// Setups lockscreen events
Hue.setup_lockscreen = function () {
  Hue.el("#lockscreen_title_menu").addEventListener("mouseenter", function () {
    Hue.lockscreen_peek_timeout = setTimeout(function () {
      Hue.el("#Msg-container-lockscreen").style.opacity = 0.2
      Hue.lockscreen_peek_active = true
    }, Hue.lockscreen_peek_delay)
  })

  Hue.el("#lockscreen_title_menu").addEventListener("mouseleave", function () {
    clearTimeout(Hue.lockscreen_peek_timeout)

    if (Hue.lockscreen_peek_active) {
      Hue.el("#Msg-container-lockscreen").style.opacity = 1
      Hue.remove_alert_title()
    }

    Hue.lockscreen_peek_active = false
  })

  Hue.el("#lockscreen_principal").addEventListener("click", function () {
    Hue.unlock_screen()
  })
}

// Enables the lockscreen
// The lockscreen is a special mode where the display is covered
// The user is considered unfocused
Hue.lock_screen = function () {
  if (Hue.screen_locked) {
    return false
  }

  Hue.stop_tv()
  Hue.stop_radio()
  Hue.close_all_modals()
  Hue.screen_locked = true
  Hue.msg_lockscreen.show()
}

// Disables the lockscreen
Hue.unlock_screen = function () {
  if (!Hue.screen_locked) {
    return false
  }

  clearTimeout(Hue.lockscreen_peek_timeout)

  Hue.msg_lockscreen.close()
  Hue.after_unlock()
}

// What to do after unlock screen
Hue.after_unlock = function () {
  Hue.screen_locked = false
  Hue.process_visibility()
  Hue.change({ type: "image", force: false, play: false})
  Hue.change({ type: "tv", force: false, play: false})  
}