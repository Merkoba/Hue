// Starts body events
App.start_body_events = () => {
  DOM.ev(DOM.el(`body`), `mousedown`, () => {
    App.mouse_is_down = true
  })

  DOM.ev(DOM.el(`body`), `mouseup`, (e) => {
    App.mouse_is_down = false
  })

  DOM.ev(DOM.el(`body`), `mouseleave`, () => {
    App.mouse_is_down = false
  })
}