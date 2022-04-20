// Starts body events
Hue.start_body_events = function () {
  Hue.el("body").addEventListener("mouseover", function (e) {
    if (e.target.closest(".dynamic_title")) {
      let el = e.target.closest(".dynamic_title")
      let otitle = Hue.dataset(el, "otitle")
      let timeago = Hue.utilz.timeago(Hue.dataset(el, "date"))
      let new_title = `${otitle} (${timeago})`
      el.title = new_title
    }
  })

  Hue.el("body").addEventListener("mousedown", function () {
    Hue.mouse_is_down = true
  })

  Hue.el("body").addEventListener("mouseup", function (e) {
    Hue.mouse_is_down = false
  })

  Hue.el("body").addEventListener("mouseleave", function () {
    Hue.mouse_is_down = false
  })
}