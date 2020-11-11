// Setups more footer elements
Hue.setup_footer = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    $(`#footer_${type}_label`).click(function () {
      Hue[`show_${type}_picker`]()
    })

    $(`#footer_${type}_toggler`).click(function () {
      Hue.toggle_media({type:type, feedback:true})
    })

    $(`#footer_${type}_lock`).click(function () {
      Hue.change_media_lock({type:type, feedback:true})
    })
  }

  $("#footer_user_menu").click(function () {
    Hue.show_user_menu()
  })

  $("#footer_media_menu").click(function () {
    Hue.show_media_menu()
  })

  Hue.horizontal_separator_no_margin.separate("footer_media_items")
}

// Checks how to handle the rotate icon
Hue.check_footer_media_rotate = function () {
  if (Hue.num_media_elements_visible() < 2) {
    $("#footer_media_rotate").addClass("faded")
  } else {
    $("#footer_media_rotate").removeClass("faded")
  }
}