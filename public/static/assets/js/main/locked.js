// If the user is banned the client enters locked mode
// This only shows a simple menu with a few navigation options
Hue.start_locked_mode = function () {
  Hue.el("#header").style.display = "none"
  Hue.el("#footer").style.display = "none"
  Hue.show_locked_mode()
  Hue.make_main_container_visible()
}

// Show the locked menu
Hue.show_locked_mode = function () {
  Hue.msg_locked.show()
}