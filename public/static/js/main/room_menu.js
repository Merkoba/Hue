// Builds the permission sections of the room menu through their template
Hue.make_room_menu_voice_permissions_container = function () {
  let s = ""

  for (let i = 1; i <= Hue.vtypes.length; i++) {
    s += Hue.template_room_menu_voice_permissions_container({ number: i })
  }

  return s
}

// Builds the op permission sections of the room menu through their template
Hue.make_room_menu_op_permissions_container = function () {
  let s = ""

  for (let i = 1; i <= Hue.optypes.length; i++) {
    s += Hue.template_room_menu_op_permissions_container({ number: i })
  }

  return s
}

// Setups change events for the room menu widgets
Hue.setup_room_menu = function () {
  Hue.setup_togglers("room_menu")
  Hue.setup_togglers("room_menu_voice_permissions")
  Hue.setup_togglers("room_menu_op_permissions")

  $(".admin_voice_permissions_checkbox").each(function () {
    $(this).change(function () {
      let what = $(this).prop("checked")

      Hue.change_voice_permission(
        $(this).data("vtype"),
        $(this).data("ptype"),
        what
      )
    })
  })

  $(".admin_op_permissions_checkbox").each(function () {
    $(this).change(function () {
      let what = $(this).prop("checked")

      Hue.change_op_permission(
        $(this).data("optype"),
        $(this).data("ptype"),
        what
      )
    })
  })

  $("#admin_enable_image").change(function () {
    let what = $("#admin_enable_image option:selected").val()

    Hue.change_room_image_mode(what)
  })

  $("#admin_enable_tv").change(function () {
    let what = $("#admin_enable_tv option:selected").val()

    Hue.change_room_tv_mode(what)
  })

  $("#admin_privacy").change(function () {
    let what = JSON.parse($("#admin_privacy option:selected").val())

    Hue.change_privacy(what)
  })

  $("#admin_log").change(function () {
    let what = JSON.parse($("#admin_log option:selected").val())

    Hue.change_log(what)
  })

  $("#admin_theme_mode_select").change(function () {
    let what = $("#admin_theme_mode_select option:selected").val()

    Hue.change_theme_mode(what)
  })

  $("#admin_theme").change(function () {
    Hue.change_theme($(this).val())
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

  $("#admin_media_info").change(function () {
    let what = $("#admin_media_info option:selected").val()

    Hue.change_media_info(what)
  })
}

// Shows the room menu
Hue.show_room_menu = function () {
  Hue.msg_room_menu.show()
}

// Configures the room menu
// Updates all widgets with current state
Hue.config_room_menu = function () {
  if (Hue.is_admin_or_op()) {
    Hue.config_admin_permission_checkboxes()
    Hue.config_admin_room_image_mode()
    Hue.config_admin_room_tv_mode()
    Hue.config_admin_privacy()
    Hue.config_admin_log_enabled()
    Hue.config_admin_theme_mode()
    Hue.config_admin_theme()
    Hue.config_admin_background_mode()
    Hue.config_admin_background_effect()
    Hue.config_admin_background_tile_dimensions()
    Hue.config_admin_background_image()
    Hue.config_admin_text_color_mode()
    Hue.config_admin_text_color()
    Hue.config_admin_room_name()
    Hue.config_admin_topic()
    Hue.config_admin_media_info()
    Hue.config_admin_display()

    $("#admin_menu").css("display", "block")
  } else {
    $("#admin_menu").css("display", "none")
  }
}

// Checks or unchecks room menu voice permission checkboxes based on current state
Hue.config_admin_permission_checkboxes = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $(".admin_voice_permissions_checkbox").each(function () {
    let what =
      Hue[`${$(this).data("vtype")}_permissions`][$(this).data("ptype")]
    $(this).prop("checked", what)
  })

  $(".admin_op_permissions_checkbox").each(function () {
    let what =
      Hue[`${$(this).data("optype")}_permissions`][$(this).data("ptype")]
    $(this).prop("checked", what)
  })
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
  } else if (Hue.background_mode === "mirror") {
    $("#admin_background_tile_dimensions_container").css("display", "none")
    $("#admin_background_image_container").css("display", "none")
    $("#admin_background_effect_container").css("display", "block")
  } else if (Hue.background_mode === "mirror_tiled") {
    $("#admin_background_tile_dimensions_container").css("display", "block")
    $("#admin_background_image_container").css("display", "none")
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

  if (Hue.background_image_setter) {
    let s = `Setter: ${Hue.background_image_setter}`

    if (Hue.background_image_date) {
      s += ` | ${Hue.utilz.nice_date(Hue.background_image_date)}`
    }

    $("#admin_background_image").attr("title", s)
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

// Updates the privacy widget in the room menu based on current state
Hue.config_admin_privacy = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_privacy")
    .find("option")
    .each(function () {
      if (JSON.parse($(this).val()) === Hue.is_public) {
        $(this).prop("selected", true)
      }
    })
}

// Updates the log enabled widget in the room menu based on current state
Hue.config_admin_log_enabled = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_log")
    .find("option")
    .each(function () {
      if (JSON.parse($(this).val()) === Hue.log_enabled) {
        $(this).prop("selected", true)
      }
    })
}

// Updates the media info widget in the room menu based on current state
Hue.config_admin_media_info = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_media_info").val(Hue.media_info)
}

// Updates the room image mode widget in the room menu based on current state
Hue.config_admin_room_image_mode = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_enable_image")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.room_image_mode) {
        $(this).prop("selected", true)
      }
    })
}

// Updates the room tv mode widget in the room menu based on current state
Hue.config_admin_room_tv_mode = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_enable_tv")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.room_tv_mode) {
        $(this).prop("selected", true)
      }
    })
}

// Updates the theme mode widget in the room menu based on current state
Hue.config_admin_theme_mode = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_theme_mode_select")
    .find("option")
    .each(function () {
      if ($(this).val() === Hue.theme_mode) {
        $(this).prop("selected", true)
      }
    })

  if (Hue.theme_mode === "custom") {
    $("#admin_theme_mode_container").css("display", "block")
  } else {
    $("#admin_theme_mode_container").css("display", "none")
  }
}

// Updates the theme widget in the room menu based on current state
Hue.config_admin_theme = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  $("#admin_theme").val(Hue.theme)
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

// Configures what should be visible in the room menu according to role
Hue.config_admin_display = function () {
  if (Hue.role === "admin") {
    $("#room_menu_main_container_op_permissions").css("display", "block")
    $("#room_menu_more_remove_ops").css("display", "block")
  } else {
    $("#room_menu_main_container_op_permissions").css("display", "none")
    $("#room_menu_more_remove_ops").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "media")) {
    $("#room_menu_main_container_media").css("display", "block")
  } else {
    $("#room_menu_main_container_media").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "theme")) {
    $("#room_menu_main_container_theme").css("display", "block")
  } else {
    $("#room_menu_main_container_theme").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "background")) {
    $("#room_menu_main_container_background").css("display", "block")
  } else {
    $("#room_menu_main_container_background").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "voice_permissions")) {
    $("#room_menu_main_container_voice_permissions").css("display", "block")
  } else {
    $("#room_menu_main_container_voice_permissions").css("display", "none")
  }

  let some_room_config = false

  if (Hue.check_op_permission(Hue.role, "privacy")) {
    $("#room_menu_privacy_container").css("display", "block")
    some_room_config = true
  } else {
    $("#room_menu_privacy_container").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "log")) {
    $("#room_menu_log_container").css("display", "block")
    some_room_config = true
  } else {
    $("#room_menu_log_container").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "name")) {
    $("#room_menu_room_name_container").css("display", "block")
    some_room_config = true
  } else {
    $("#room_menu_room_name_container").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "topic")) {
    $("#room_menu_topic_container").css("display", "block")
    some_room_config = true
  } else {
    $("#room_menu_topic_container").css("display", "none")
  }

  if (some_room_config) {
    $("#room_menu_main_container_room_config").css("display", "block")
  } else {
    $("#room_menu_main_container_room_config").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "broadcast")) {
    $("#room_menu_more_broadcast").css("display", "block")
  } else {
    $("#room_menu_more_broadcast").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "whisper_ops")) {
    $("#room_menu_more_whisper_ops").css("display", "block")
  } else {
    $("#room_menu_more_whisper_ops").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "voice_roles")) {
    $("#room_menu_more_reset_voices").css("display", "block")
  } else {
    $("#room_menu_more_reset_voices").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "voice_roles")) {
    $("#room_menu_more_reset_voices").css("display", "block")
  } else {
    $("#room_menu_more_reset_voices").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "unban")) {
    $("#room_menu_more_unban_all").css("display", "block")
  } else {
    $("#room_menu_more_unban_all").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "log")) {
    $("#room_menu_more_clear_log").css("display", "block")
  } else {
    $("#room_menu_more_clear_log").css("display", "none")
  }

  if (Hue.check_op_permission(Hue.role, "message_board_delete")) {
    $("#room_menu_more_clear_message_board").css("display", "block")
  } else {
    $("#room_menu_more_clear_message_board").css("display", "none")
  }
}
