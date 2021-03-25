// Starts body events
Hue.start_body_events = function () {
  $("body").on("mouseenter", ".dynamic_title", function () {
    let new_title = `${$(this).data("otitle")} (${Hue.utilz.timeago(
      $(this).data("date")
    )})`

    $(this).attr("title", new_title)
  })

  $("body").mousedown(function () {
    Hue.mouse_is_down = true
  })

  $("body").mouseup(function (e) {
    Hue.mouse_is_down = false
  })

  $("body").mouseleave(function () {
    Hue.mouse_is_down = false
  })

  $("#profile_image_picker").on("change", function () {
    Hue.profile_image_selected(this)
  })

  $("#background_image_input").on("change", function () {
    Hue.background_image_selected(this)
  })

  $("#audio_clip_picker").on("change", function () {
    Hue.audio_clip_selected(this)
  })
}
