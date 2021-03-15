// Setups change events for the room menu widgets
Hue.setup_room_menu = function () {
  $("#admin_background_color").change(function () {
    Hue.change_background_color($(this).val())
  })

  $("#admin_background_mode_select").change(function () {
    let what = $("#admin_background_mode_select option:selected").val()
    Hue.change_background_mode(what)
  })

  $("#admin_background_effect_select").change(function () {
    let what = $("#admin_background_effect_select option:selected").val()
    Hue.change_background_effect(what)
  })

  $("#admin_background_tile_dimensions").blur(function () {
    let what = Hue.utilz.clean_string2($(this).val())

    if (what === "") {
      $("#admin_background_tile_dimensions").val(Hue.background_tile_dimensions)
      return false
    }

    Hue.change_background_tile_dimensions(what)
  })

  $("#admin_text_color_mode_select").change(function () {
    let what = $("#admin_text_color_mode_select option:selected").val()
    Hue.change_text_color_mode(what)
  })

  $("#admin_text_color").change(function () {
    Hue.change_text_color($(this).val())
  })

  $("#admin_room_name").blur(function () {
    let name = Hue.utilz.clean_string2($(this).val())

    if (name === "") {
      $("#admin_room_name").val(Hue.room_name)
      return false
    }

    if (name !== Hue.room_name) {
      Hue.change_room_name(name)
    }
  })

  $("#admin_topic").blur(function () {
    let t = Hue.utilz.clean_string2($(this).val())

    if (t === "") {
      $("#admin_topic").val(Hue.topic)
      return false
    }

    if (t !== Hue.topic) {
      Hue.change_topic(t)
    }
  })

  $("#admin_background_image").on("error", function () {
    if ($(this).attr("src") !== Hue.config.background_image_loading_url) {
      $(this).attr("src", Hue.config.background_image_loading_url)
    }
  })

  $("#room_menu_more_unban_all").click(function () {
    Hue.show_confirm("Unban All", `This will unban all the users that are banned from this room`, function () {
      Hue.unban_all()
    })
  })

  $("#room_menu_more_admin_activity").click(function () {
    Hue.request_admin_activity()
  })

  $("#room_menu_more_admin_list").click(function () {
    Hue.request_admin_list()
  })

  $("#room_menu_more_ban_list").click(function () {
    Hue.request_ban_list()
  })

  $("#room_menu_more_clear_log").click(function () {
    Hue.show_confirm("Clear Log", `The log are recent messages that are stored for context. 
      The log is limited to ${Hue.config.max_log_messages} messages. This will empty the log`, function () {
      Hue.clear_log()
    })
  })

  $("#room_menu_more_clear_message_board").click(function () {
    Hue.show_confirm("Clear Message Board", `The message board is limited to ${Hue.config.max_message_board_posts} posts. 
    This will remove all message board posts`, function () {
      Hue.clear_message_board()
    })
  })

  $("#admin_background_image").click(function () {
    Hue.open_background_image_select()
  })
}

// Update room menu info
Hue.update_room_menu_info = function () {
  $("#room_menu_info_name").text(Hue.room_name)
  $("#room_menu_info_topic").text(Hue.topic || "No Topic Set")
}

// Shows the room menu
Hue.show_room_menu = function () {
  Hue.update_room_menu_info()
  Hue.msg_room_menu.show()
}

// Configures the room menu
// Updates all widgets with current state
Hue.config_room_menu = function () {
  if (Hue.is_admin_or_op()) {
    Hue.config_admin_background_color()
    Hue.config_admin_background_mode()
    Hue.config_admin_background_effect()
    Hue.config_admin_background_tile_dimensions()
    Hue.config_admin_background_image()
    Hue.config_admin_text_color_mode()
    Hue.config_admin_text_color()
    Hue.config_admin_room_name()
    Hue.config_admin_topic()

    $("#room_menu").css("display", "block")
    $("#main_menu_room_menu").removeClass("inactive")
  } else {
    $("#room_menu").css("display", "none")
    $("#main_menu_room_menu").addClass("inactive")
  }
}

// Updates the background widgets in the room menu based on current state
Hue.config_admin_background_mode = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_background_mode_select")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.background_mode) {
        $(this).prop("selected", true)
      }
    })

  $("#admin_background_effect_select")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.background_effect) {
        $(this).prop("selected", true)
      }
    })

  if (Hue.background_mode === "normal") {
    $("#admin_background_tile_dimensions_container").css("display", "none")
    $("#admin_background_image_container").css("display", "block")
    $("#admin_background_effect_container").css("display", "block")
  } else if (Hue.background_mode === "tiled") {
    $("#admin_background_tile_dimensions_container").css("display", "block")
    $("#admin_background_image_container").css("display", "block")
    $("#admin_background_effect_container").css("display", "block")
  } else if (Hue.background_mode === "solid") {
    $("#admin_background_tile_dimensions_container").css("display", "none")
    $("#admin_background_image_container").css("display", "none")
    $("#admin_background_effect_container").css("display", "none")
  }
}

// Updates background tile dimension widget in the room menu based on current state
Hue.config_admin_background_tile_dimensions = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_background_tile_dimensions").val(Hue.background_tile_dimensions)
}

// Updates the background image widget in the room menu based on current state
Hue.config_admin_background_image = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (Hue.background_image !== $("#admin_background_image").attr("src")) {
    if (Hue.background_image !== "") {
      $("#admin_background_image").attr("src", Hue.background_image)
    } else {
      $("#admin_background_image").attr(
        "src",
        Hue.config.default_background_image_url
      )
    }
  }
}

// Updates the background effect widget in the room menu based on current state
Hue.config_admin_background_effect = function () {
  $("#admin_background_effect_select")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.background_effect) {
        $(this).prop("selected", true)
      }
    })
}

// Updates the text color mode widget in the room menu based on current state
Hue.config_admin_text_color_mode = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_text_color_mode_select")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.text_color_mode) {
        $(this).prop("selected", true)
      }
    })

  if (Hue.text_color_mode === "custom") {
    $("#admin_text_color_container").css("display", "block")
  } else {
    $("#admin_text_color_container").css("display", "none")
  }
}

// Updates the text color widget in the room menu based on current state
Hue.config_admin_text_color = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_text_color").val(Hue.text_color)
}

// Updates the background color widget in the room menu based on current state
Hue.config_admin_background_color = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_background_color").val(Hue.background_color)
}

// Updates the room name widget in the room menu based on current state
Hue.config_admin_room_name = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_room_name").val(Hue.room_name)
}

// Updates the topic widget in the room menu based on current state
Hue.config_admin_topic = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_topic").val(Hue.topic)
}