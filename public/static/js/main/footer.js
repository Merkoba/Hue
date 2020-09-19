// Sets visibility of footer media icons based on media permissions
Hue.setup_footer_icons = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    if (Hue[`room_${type}_mode`] === "disabled") {
      $("#footer_image_controls").css("display", "none")
    } else {
      $("#footer_image_controls").css("display", "flex")
    }

    if (Hue[`can_${type}`]) {
      $(`#footer_${type}_icon_container`).css("display", "flex")
    } else {
      $(`#footer_${type}_icon_container`).css("display", "none")
    }
  }

  if (!Hue.room_state.image_enabled || !Hue.room_state.tv_enabled) {
    $("#footer_media_rotate").css("display", "none")
  } else {
    $("#footer_media_rotate").css("display", "flex")
  }

  Hue.update_footer_separators()
}

// Setups more footer elements
Hue.setup_footer = function () {
  $("#footer_swaprotate").click(function () {
    Hue.show_swaprotate()
  })

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

  $("#footer_chat_react").click(function () {
    Hue.show_reaction_picker("chat")
  })

  $("#footer_media_menu").click(function () {
    Hue.show_media_menu()
  })
}

// Checks how to handle the rotate icon
Hue.check_footer_media_rotate = function () {
  if (Hue.num_media_elements_visible() < 2) {
    $("#footer_media_rotate").addClass("faded")
  } else {
    $("#footer_media_rotate").removeClass("faded")
  }
}

Hue.update_footer_separators = function () {
  Hue.horizontal_separator_no_margin.separate("footer_media_items")
}
