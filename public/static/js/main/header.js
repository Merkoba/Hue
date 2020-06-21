// Updates header separators
Hue.update_header_separators = function () {
  Hue.horizontal_separator.separate("header_items_inner")
}

// More header configurations
Hue.setup_header = function () {
  Hue.horizontal_separator.separate("header_radio")

  $("#header_radio_volume_area").on("auxclick", function (e) {
    if (e.which === 2) {
      if (Hue.room_state.radio_volume !== 0) {
        Hue.set_radio_volume(0)
      } else {
        Hue.set_radio_volume(1)
      }
    }
  })
}
