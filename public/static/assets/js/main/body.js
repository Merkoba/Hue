// Starts body events
Hue.start_body_events = function () {
  Hue.ev(Hue.el("body"), "mouseover", function (e) {
    if (e.target.closest(".dynamic_title")) {
      let el = e.target.closest(".dynamic_title")
      let otitle = Hue.dataset(el, "otitle")
      let timeago = Hue.utilz.timeago(Hue.dataset(el, "date"))
      let new_title = `${otitle} (${timeago})`
      el.title = new_title
    }
  })

  Hue.ev(Hue.el("body"), "mousedown", function () {
    Hue.mouse_is_down = true
  })

  Hue.ev(Hue.el("body"), "mouseup", function (e) {
    Hue.mouse_is_down = false
  })

  Hue.ev(Hue.el("body"), "mouseleave", function () {
    Hue.mouse_is_down = false
  })
}