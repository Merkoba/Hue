// Shows the infotip
// This is a black box in the corner meant for quick temporary feedback
Hue.show_infotip = function (s) {
  $("#infotip").text(s)
  $("#infotip_container").css("display", "flex")
  $("#activity_bar_inner").css("display", "none")
  Hue.infotip_timer()
}

// Hides the infotip
Hue.hide_infotip = function () {
  $("#infotip_container").css("display", "none")
  $("#activity_bar_inner").css("display", "grid")
}