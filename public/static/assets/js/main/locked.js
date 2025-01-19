// If the user is banned the client enters locked mode
// This only shows a simple menu with a few navigation options
App.start_locked_mode = () => {
  DOM.hide(`#header`)
  DOM.hide(`#footer`)
  App.show_locked_mode()
  App.make_main_container_visible()
}

// Show the locked menu
App.show_locked_mode = () => {
  App.msg_locked.show()
}