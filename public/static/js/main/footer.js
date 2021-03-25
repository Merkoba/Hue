// Setups more footer elements
Hue.setup_footer = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    $(`#footer_${type}_label`).on("click", function () {
      Hue[`show_${type}_picker`]()
    })

    $(`#footer_${type}_toggler`).on("click", function () {
      Hue.toggle_media({type:type, feedback:true})
    })

    $(`#footer_${type}_lock`).on("click", function () {
      Hue.change_media_lock({type:type, feedback:true})
    })
  }

  $("#footer_highlights").on("click", function () {
    Hue.show_highlights()
  })

  $("#footer_search").on("click", function () {
    Hue.show_chat_search()
  })

  $("#footer_items").on("click", function(e) {
    if (e.target === this) {
      $("#input").focus()
    }
  })

  Hue.horizontal_separator_no_margin.separate("footer_media_items")
}

// Enabled footer expand
Hue.enable_footer_expand = function () {
  if (Hue.footer_expanded) {
    return
  }

  $("#footer").addClass("footer_expanded")
  Hue.after_footer_expand_change()
}

// Disable footer expand
Hue.disable_footer_expand = function () {
  if (!Hue.footer_expanded) {
    return
  }

  $("#footer").removeClass("footer_expanded")
  Hue.after_footer_expand_change()
}

// After footer expand change
Hue.after_footer_expand_change = function () {
  Hue.footer_expanded = !Hue.footer_expanded
  Hue.goto_bottom()
  Hue.fix_frames()

  if (!Hue.get_input().trim()) {
    Hue.clear_input()
  }
}

// Checks how to handle the rotate icon
Hue.check_footer_media_rotate = function () {
  if (Hue.num_media_elements_visible() < 2) {
    $("#footer_media_rotate").addClass("faded")
  } else {
    $("#footer_media_rotate").removeClass("faded")
  }
}