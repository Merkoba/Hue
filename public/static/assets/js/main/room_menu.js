// Setups change events for the room menu widgets
Hue.setup_room_menu = function () {
  Hue.el("#admin_background_color").addEventListener("change", function () {
    Hue.change_background_color(this.value)
  })

  Hue.el("#admin_text_color").addEventListener("change", function () {
    Hue.change_text_color(this.value)
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

  Hue.el("#room_menu_more_admin_activity").addEventListener("click", function () {
    Hue.request_admin_activity()
  })

  Hue.el("#room_menu_more_admin_list").addEventListener("click", function () {
    Hue.request_admin_list()
  })

  Hue.el("#room_menu_more_ban_list").addEventListener("click", function () {
    Hue.request_ban_list()
  }) 

  Hue.el("#admin_background").addEventListener("click", function () {
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

  if (Hue.background !== Hue.el("#admin_background").src) {
    if (Hue.background !== "") {
      Hue.el("#admin_background").src = Hue.background
    }
  }
}

// Updates the text color widget in the room menu based on current state
Hue.config_admin_text_color = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_text_color").value = Hue.text_color
}

// Updates the background color widget in the room menu based on current state
Hue.config_admin_background_color = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_background_color").value = Hue.background_color
}

// Updates the room name widget in the room menu based on current state
Hue.config_admin_room_name = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_room_name").value = Hue.room_name
}

// Updates the topic widget in the room menu based on current state
Hue.config_admin_topic = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.el("#admin_topic").value = Hue.topic
}