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

  Hue.el("#profilepic_input").addEventListener("change", function () {
    Hue.profilepic_selected(this.files[0])
  })

  Hue.el("#background_input").addEventListener("change", function () {
    Hue.background_selected(this.files[0])
  })

  Hue.el("#audioclip_input").addEventListener("change", function () {
    Hue.audioclip_selected(this.files[0])
  })
}

// Check window width and do changes accordingly
Hue.responsive_check = function () {
  let w = Hue.el("#main_container").offsetWidth
  let h = Hue.el("#main_container").offsetHeight
  let ratio = w / h

  if (Hue.room_state.auto_tweaks) {
    if (ratio <= 1.2) {
      Hue.change_main_layout("column")
    } else {
      Hue.change_main_layout("row")
    }
  }
}