// Starts body events
App.start_body_events = () => {
  DOM.ev(DOM.el(`body`), `mouseover`, (e) => {
    if (e.target.closest(`.dynamic_title`)) {
      let el = e.target.closest(`.dynamic_title`)
      let otitle = DOM.dataset(el, `otitle`)
      let timeago = App.utilz.timeago(DOM.dataset(el, `date`))
      let new_title = `${otitle} (${timeago})`
      el.title = new_title
    }
  })

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