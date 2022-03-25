// Setups change events for the room config widgets
Hue.setup_room_config = function () {
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
    Hue.open_background_select()
  })

  Hue.el("#admin_random_theme").addEventListener("click", function () {
    Hue.select_random_theme()
  })

  Hue.el("#random_theme_regenerate").addEventListener("click", function () {
    Hue.select_random_theme()
  })
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

  if (Hue.background !== Hue.el("#admin_background").src) {
    if (Hue.background !== "") {
      Hue.el("#admin_background").src = Hue.background
    }
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

// Show a window to select random themes
Hue.select_random_theme = function () {
  function create_item (theme) {
    let item = Hue.div("random_theme_item action")

    item.style.backgroundColor = theme.bg_color
    item.style.color = theme.text_color
    item.textContent = "This is some sample text"

    item.addEventListener("click", function () {
      console.log(theme)
      Hue.change_background_color(theme.bg_color)
      Hue.change_text_color(theme.text_color)
      Hue.msg_random_theme.close()
    })

    return item
  }

  let dark_container = Hue.el("#random_theme_dark_container")
  dark_container.innerHTML = ""

  let light_container = Hue.el("#random_theme_light_container")
  light_container.innerHTML = ""

  let dark_themes = Hue.get_random_themes(10, "dark")
  let light_themes = Hue.get_random_themes(10, "light")

  for (let theme of dark_themes) {
    dark_container.append(create_item(theme))
  }

  for (let theme of light_themes) {
    light_container.append(create_item(theme))
  }

  Hue.msg_random_theme.show()
}

// Get random dark or light themes 
Hue.get_random_themes = function (n, mode = "dark") {
  let themes = []
  let colors = Hue.colorlib.get_palette(n)

  for (let bg_color of colors) {
    if (mode === "dark") {
      if (Hue.colorlib.is_light(bg_color)) {
        bg_color = Hue.colorlib.get_lighter_or_darker(bg_color, 0.6)
      }
    } else {
      if (Hue.colorlib.is_dark(bg_color)) {
        bg_color = Hue.colorlib.get_lighter_or_darker(bg_color, 0.6)
      }
    }
  
    let text_color = Hue.colorlib.get_lighter_or_darker(bg_color, 0.66)
    themes.push({bg_color: bg_color, text_color: text_color})
  }

  return themes
}