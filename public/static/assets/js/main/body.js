// Starts body events
Hue.start_body_events = function () {
  $("body").on("mouseenter", ".dynamic_title", function () {
    let new_title = `${$(this).data("otitle")} (${Hue.utilz.timeago(
      $(this).data("date")
    )})`

    $(this).attr("title", new_title)
  })

  $("body").on("mousedown", function () {
    Hue.mouse_is_down = true
  })

  $("body").on("mouseup", function (e) {
    Hue.mouse_is_down = false
  })

  $("body").on("mouseleave", function () {
    Hue.mouse_is_down = false
  })

  $("#profilepic_input").on("change", function () {
    Hue.profilepic_selected(this.files[0])
  })

  $("#background_input").on("change", function () {
    Hue.background_selected(this.files[0])
  })

  $("#audioclip_input").on("change", function () {
    Hue.audioclip_selected(this.files[0])
  })
}
