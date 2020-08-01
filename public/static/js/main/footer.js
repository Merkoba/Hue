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

  if (Hue.room_image_mode === "disabled" || Hue.room_tv_mode === "disabled") {
    $("#footer_media_rotate").css("display", "none")
  } else {
    $("#footer_media_rotate").css("display", "flex")
  }

  Hue.update_footer_separators()
}

// Setups more footer elements
Hue.setup_footer = function () {
  $("#footer_image_icon").on("auxclick", function (e) {
    if (e.which === 2) {
      $("#image_picker_upload").click()
    }
  })

  $("#footer_swaprotate").click(function () {
    Hue.show_swaprotate()
  })

  $("#footer_swaprotate").on("auxclick", function (e) {
    if (e.which === 2) {
      Hue.rotate_media()
    }
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

  $("#footer_reactions").click(function () {
    if (Hue.reactions_box_open) {
      Hue.hide_reactions_box()
    } else {
      Hue.show_reactions_box()
      Hue.start_hide_reactions()
    }
  })

  $("#footer_reactions").on("auxclick", function (e) {
    if (e.which === 2) {
      Hue.send_reaction("like")
    }
  })

  $("#footer_media_menu").click(function () {
    Hue.show_media_menu()
  })

  $("#footer_media_menu").on("auxclick", function (e) {
    if (e.which === 2) {
      Hue.stop_media()
    }
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
