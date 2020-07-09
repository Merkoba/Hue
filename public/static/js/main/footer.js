// Sets visibility of footer media icons based on media permissions
Hue.setup_footer_icons = function () {
  let media = ["image", "tv", "radio"]

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

    $(`#${type}_lock_area`).click(function () {
      Hue.change_media_lock({type:type, feedback:true})
    })
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
      $("#image_file_picker").click()
    }
  })

  $("#footer_user_menu_container").on("auxclick", function (e) {
    if (e.which === 2) {
      Hue.clear_show_reactions_box()
      Hue.show_global_settings()
    }
  })

  $("#footer_media_menu_container").on("auxclick", function (e) {
    if (e.which === 2) {
      Hue.stop_media()
    }
  })

  $("#footer_media_rotate").click(function () {
    if (Hue.num_media_elements_visible() < 2) {
      return false
    }

    Hue.swap_media_layout()
  })

  $("#footer_media_rotate").on("auxclick", function (e) {
    if (Hue.num_media_elements_visible() < 2) {
      return false
    }

    if (e.which === 2) {
      Hue.swap_display_positions_2()
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
  Hue.horizontal_separator.separate("footer_media_items")
}
