// Setups change events for the room menu widgets
Hue.setup_room_menu = function () {
  $("#admin_background_color").on("change", function () {
    Hue.change_background_color($(this).val())
  })

  $("#admin_text_color").on("change", function () {
    Hue.change_text_color($(this).val())
  })

  $("#admin_room_name").on("blur", function () {
    let name = Hue.utilz.clean_string2($(this).val())

    if (name === "") {
      $("#admin_room_name").val(Hue.room_name)
      return false
    }

    if (name !== Hue.room_name) {
      Hue.change_room_name(name)
    }
  })

  $("#admin_topic").on("blur", function () {
    let t = Hue.utilz.clean_string2($(this).val())

    if (t === "") {
      $("#admin_topic").val(Hue.topic)
      return false
    }

    if (t !== Hue.topic) {
      Hue.change_topic(t)
    }
  })

  $("#admin_background").on("error", function () {
    if ($(this).attr("src") !== Hue.config.background_loading_url) {
      $(this).attr("src", Hue.config.background_loading_url)
    }
  })

  $("#room_menu_more_admin_activity").on("click", function () {
    Hue.request_admin_activity()
  })

  $("#room_menu_more_admin_list").on("click", function () {
    Hue.request_admin_list()
  })

  $("#room_menu_more_ban_list").on("click", function () {
    Hue.request_ban_list()
  })

  $("#admin_background").on("click", function () {
    Hue.open_background_select()
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
    Hue.config_admin_background_color()
    Hue.config_admin_background()
    Hue.config_admin_text_color()
    Hue.config_admin_room_name()
    Hue.config_admin_topic()
  }
}

// Updates the background image widget in the room menu based on current state
Hue.config_admin_background = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (Hue.background !== $("#admin_background").attr("src")) {
    if (Hue.background !== "") {
      $("#admin_background").attr("src", Hue.background)
    } else {
      $("#admin_background").attr(
        "src",
        Hue.config.default_background_url
      )
    }
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