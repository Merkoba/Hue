// Starts body events
App.start_body_events = () => {
  App.ev(App.el(`body`), `mouseover`, (e) => {
    if (e.target.closest(`.dynamic_title`)) {
      let el = e.target.closest(`.dynamic_title`)
      let otitle = App.dataset(el, `otitle`)
      let timeago = App.utilz.timeago(App.dataset(el, `date`))
      let new_title = `${otitle} (${timeago})`
      el.title = new_title
    }
  })

  App.ev(App.el(`body`), `mousedown`, () => {
    App.mouse_is_down = true
  })

  App.ev(App.el(`body`), `mouseup`, (e) => {
    App.mouse_is_down = false
  })

  App.ev(App.el(`body`), `mouseleave`, () => {
    App.mouse_is_down = false
  })
}