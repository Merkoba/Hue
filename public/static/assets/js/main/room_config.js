// Setups change events for the room config widgets
Hue.setup_room_config = function () {
  Hue.el("#admin_background_color").addEventListener("change", function () {
    Hue.apply_theme_controls()
  })

  Hue.el("#admin_text_color").addEventListener("change", function () {
    Hue.apply_theme_controls()
  })

  Hue.el("#admin_room_name").addEventListener("blur", function () {
    let name = Hue.utilz.single_space(this.value)

    if (name === "") {
      Hue.el("#admin_room_name").value = Hue.room_name
      return false
    }

    if (name !== Hue.room_name) {
      Hue.change_room_name(name)
    }
  })

  Hue.el("#admin_topic").addEventListener("blur", function () {
    let t = Hue.utilz.single_space(this.value)

    if (t === "") {
      Hue.el("#admin_topic").value = Hue.topic
      return false
    }

    if (t !== Hue.topic) {
      Hue.change_topic(t)
    }
  })

  Hue.el("#admin_background").addEventListener("error", function () {
    if (this.src !== Hue.config.background_loading_url) {
      this.src = Hue.config.background_loading_url
    }
  })

  Hue.el("#room_config_more_admin_activity").addEventListener("click", function () {
    Hue.request_admin_activity()
  })

  Hue.el("#room_config_more_admin_list").addEventListener("click", function () {
    Hue.request_admin_list()
  })

  Hue.el("#room_config_more_ban_list").addEventListener("click", function () {
    Hue.request_ban_list()
  }) 

  Hue.el("#admin_background").addEventListener("click", function () {
    Hue.msg_background_select.show()
  })

  Hue.el("#admin_theme_picker").addEventListener("click", function () {
    Hue.show_theme_picker()
  })

  Hue.setup_background_select()
  Hue.setup_link_background()
  Hue.setup_theme_picker()
}

// Shows the room config
Hue.show_room_config = function () {
  Hue.msg_room_config.show()
}

// Configures the room config
// Updates all widgets with current state
Hue.config_room_config = function () {
  if (Hue.is_admin_or_op()) {
    Hue.config_admin_background_color()
    Hue.config_admin_background()
    Hue.config_admin_text_color()
    Hue.config_admin_room_name()
    Hue.config_admin_topic()
  }
}

// Updates the background image widget in the room config based on current state
Hue.config_admin_background = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (Hue.background) {
    Hue.el("#admin_background").src = Hue.background
  } else {
    Hue.el("#admin_background").src = Hue.config.background_loading_url
  }
}

// Updates the text color widget in the room config based on current state
Hue.config_admin_text_color = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_text_color").value = Hue.text_color
}

// Updates the background color widget in the room config based on current state
Hue.config_admin_background_color = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_background_color").value = Hue.background_color
}

// Updates the room name widget in the room config based on current state
Hue.config_admin_room_name = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_room_name").value = Hue.room_name
}

// Updates the topic widget in the room config based on current state
Hue.config_admin_topic = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_topic").value = Hue.topic
}

// Setup background select
Hue.setup_background_select = function () {  
  Hue.el("#background_select_draw").addEventListener("click", function () {
    Hue.msg_background_select.close()
    Hue.open_draw_image("background")
  })

  Hue.el("#background_select_random").addEventListener("click", function () {
    Hue.msg_background_select.close()
    Hue.make_random_drawing("background")
  })
  
  Hue.el("#background_select_link").addEventListener("click", function () {
    Hue.msg_background_select.close()
    Hue.open_link_background()
  })

  Hue.el("#background_select_remove").addEventListener("click", function () {
    Hue.msg_background_select.close()
    Hue.change_background_source("")
  })

  Hue.el("#background_select_upload").addEventListener("click", function () {
    Hue.msg_background_select.close()
    Hue.open_background_picker()
  })
}

// Setup background input
Hue.setup_link_background = function () {
  Hue.el("#link_background_submit").addEventListener("click", function () {
    Hue.link_background_action()
  })
}

// Setup background input
Hue.open_link_background = function () {
  Hue.el("#link_background_input").value = ""
  Hue.msg_link_background.show(function () {
    Hue.el("#link_background_input").focus()
  })
}