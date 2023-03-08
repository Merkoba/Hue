// Prepare theme
Hue.prepare_theme = function (data) {
  Hue.set_background(data, false)
  Hue.background_color = data.background_color
  Hue.text_color = data.text_color
}

// Setups theme and background variables from initial data
Hue.setup_theme = function () {
  Hue.ev(Hue.el("#background"), "load", function () {
    if (Hue.background_preview) {
      Hue.hide_windows_temporarily()
      Hue.show_background_peek_confirm()
    }
  })

  Hue.ev(Hue.el("#background"), "error", function () {
    if (Hue.background_preview) {
      Hue.apply_background()
    }
  })
}

// This sets CSS variables based on the current colors
Hue.apply_theme = function (background_color = "", text_color = "") {
  if (!background_color) {
    background_color = Hue.background_color
  }

  if (!text_color) {
    text_color = Hue.text_color
  }

  background_color = Hue.colorlib.hex_to_rgb(background_color)
  text_color = Hue.colorlib.hex_to_rgb(text_color)

  let altcolor = Hue.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = Hue.colorlib.rgb_to_rgba(altcolor, 0.7)
  let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = Hue.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = Hue.colorlib.rgb_to_rgba(altbackground, 0.7)
  let text_color_a = Hue.colorlib.rgb_to_rgba(text_color, 0.7)

  document.documentElement.style.setProperty("--text_color", text_color)
  document.documentElement.style.setProperty("--text_color_a", text_color_a)
  document.documentElement.style.setProperty("--altcolor", altcolor)
  document.documentElement.style.setProperty("--altcolor_a", altcolor_a)
  document.documentElement.style.setProperty("--background_color", background_color)
  document.documentElement.style.setProperty("--background_color_a", background_color_a)
  document.documentElement.style.setProperty("--altbackground", altbackground)
  document.documentElement.style.setProperty("--altbackground_a", altbackground_a)
}

// Show a window to select random themes
Hue.generate_random_themes = function () {
  let num_col_items = 5

  function create_item (theme) {
    let item = Hue.create("div", "random_theme_item action")

    item.style.backgroundColor = theme.bg_color
    item.style.color = theme.text_color
    item.textContent = "This is a random theme"

    Hue.ev(item, "click", function () {
      Hue.el("#admin_background_color").value = theme.bg_color
      Hue.el("#admin_text_color").value = theme.text_color
      Hue.apply_theme(theme.bg_color, theme.text_color)
    })

    return item
  }

  function fill_column (col) {
    let dark = true

    for (let i=0; i<num_col_items; i++) {
      if (dark) {
        col.append(create_item(Hue.get_dark_theme()))
      } else {
        col.append(create_item(Hue.get_light_theme()))
      }

      dark = !dark
    }
  }

  let container_1 = Hue.el("#random_theme_container_1")
  container_1.innerHTML = ""

  let container_2 = Hue.el("#random_theme_container_2")
  container_2.innerHTML = ""

  fill_column(container_1)
  fill_column(container_2)
}

// Show theme picker
Hue.show_theme_picker = function () {
  Hue.original_background_color = Hue.el("#admin_background_color").value
  Hue.original_text_color = Hue.el("#admin_text_color").value
  Hue.generate_random_themes()
  Hue.msg_theme_picker.show()
}

// Cancel random theme
Hue.cancel_change_theme = function () {
  Hue.el("#admin_background_color").value = Hue.original_background_color
  Hue.el("#admin_text_color").value = Hue.original_text_color
  Hue.apply_theme()
  Hue.msg_theme_picker.close()
}

// Get a random dark theme
Hue.get_dark_theme = function () {
  let bg_color = Hue.colorlib.get_dark_color()
  let text_color = Hue.colorlib.get_random_hex()

  if (Hue.colorlib.is_dark(text_color)) {
    text_color = Hue.colorlib.get_lighter_or_darker(text_color, 0.74)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Get a random light theme
Hue.get_light_theme = function () {
  let bg_color = Hue.colorlib.get_light_color()
  let text_color = Hue.colorlib.get_random_hex()

  if (Hue.colorlib.is_light(text_color)) {
    text_color = Hue.colorlib.get_lighter_or_darker(text_color, 0.74)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Apply the selected theme
Hue.apply_selected_theme = function () {
  let bg_color = Hue.el("#admin_background_color").value
  let text_color = Hue.el("#admin_text_color").value

  if (bg_color === Hue.background_color && text_color === Hue.text_color) {
    return
  }

  Hue.show_confirm("Apply selected theme", function () {
    Hue.change_background_color(bg_color)
    Hue.change_text_color(text_color)
  }, function () {
    Hue.cancel_change_theme()
  })
}

// Setup random theme
Hue.setup_theme_picker = function () {
  Hue.ev(Hue.el("#theme_picker_random"), "click", function () {
    Hue.generate_random_themes()
  })

  Hue.ev(Hue.el("#theme_picker_peek"), "click", function () {
    Hue.hide_windows_temporarily()
  })
}

// Apply theme controls
Hue.apply_theme_controls = function () {
  Hue.apply_theme(Hue.el("#admin_background_color").value, Hue.el("#admin_text_color").value)
}

// Sets an applies background images from data
Hue.set_background = function (data, apply = true) {
  if (!data.background) {
    Hue.background = ""
  } else {
    if (data.background_type === "hosted") {
      let ver = `?ver=${data.background_version}`
      let bg = data.background + ver
      Hue.background = `${Hue.config.public_media_directory}/room/${Hue.room_id}/${bg}`
    } else {
      Hue.background = data.background
    }
  }

  Hue.config_admin_background()

  if (apply) {
    Hue.apply_background()
  }
}

// Applies the background to all background elements
Hue.apply_background = function (background = Hue.background, preview = false) {
  Hue.background_preview = preview

  Hue.els(".background").forEach(it => {
    it.src = background
  })
}

// Background color setter
Hue.set_background_color = function (color) {
  Hue.background_color = color
  Hue.apply_theme()
  Hue.config_admin_background_color()
}

// Changes the background color
Hue.change_background_color = function (color) {
  if (!Hue.is_admin_or_op()) {
    return
  }

  color = Hue.utilz.no_space(color).toLowerCase()

  if (color === undefined) {
    return
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.checkmsg("Not a valid hex color value")
    return
  }

  if (color === Hue.background_color) {
    return
  }

  Hue.socket_emit("change_background_color", { color: color })
}

// Announces background color change
Hue.announce_background_color_change = function (data) {
  Hue.show_room_notification(data.username, `${data.username} changed the background color to ${data.color}`)
  Hue.set_background_color(data.color)
}

// If upload is chosen as the method to change the background image
Hue.open_background_picker = function () {
  Hue.upload_media = "background"
  Hue.trigger_dropzone()
}

// On background image source input change
Hue.link_background_action = function () {
  let src = Hue.el("#link_background_input").value.trim()

  if (!src) {
    return
  }

  Hue.background_peek_url = src

  Hue.background_peek_action = function () {
    Hue.change_background_source(src)
  }

  Hue.msg_link_background.close()
  Hue.do_background_peek()
}

// On background image selected for upload
Hue.background_selected = function (file) {
  if (!file) {
    return
  }

  if (!Hue.is_admin_or_op()) {
    return
  }

  if (!Hue.utilz.is_image(file.name)) {
    return
  }

  for (let date in Hue.files) {
    let f = Hue.files[date]

    if (f.hue_data.action === "background_upload") {
      Hue.cancel_file_upload(date)
    }
  }

  let size = file.size / 1024

  if (size > Hue.config.max_image_size) {
    Hue.checkmsg("File is too big")
    return
  }

  Hue.background_peek_url = URL.createObjectURL(file)

  Hue.background_peek_action = function () {
    Hue.el("#admin_background").src = Hue.config.background_loading_url
    Hue.upload_file({file: file, action: "background_upload"})
  }

  Hue.do_background_peek()
}

// Change the background image with a URL
Hue.change_background_source = function (src) {
  if (!Hue.is_admin_or_op()) {
    return
  }

  if (src === undefined) {
    return
  }

  if (src !== "") {
    if (!Hue.utilz.is_url(src)) {
      return
    }

    src = src.replace(/\.gifv/g, ".gif")

    if (src === Hue.background) {
      Hue.checkmsg("Background image is already set to that")
      return
    }

    if (src.length === 0) {
      return
    }

    if (src.length > Hue.config.max_media_source_length) {
      return
    }

    if (!Hue.utilz.is_image(src)) {
      return
    }
  }

  Hue.socket_emit("change_background_source", { src: src })
}

// Announces background image changes
Hue.announce_background_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background image`
  )

  Hue.set_background(data)
}

// Changes the text color
Hue.change_text_color = function (color) {
  if (!Hue.is_admin_or_op()) {
    return
  }

  color = Hue.utilz.no_space(color).toLowerCase()

  if (color === undefined) {
    return
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.checkmsg("Not a valid hex color value")
    return
  }

  if (color === Hue.text_color) {
    return
  }

  Hue.socket_emit("change_text_color", { color: color })
}

// Announces text color changes
Hue.announce_text_color_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the text color to ${data.color}`
  )

  Hue.set_text_color(data.color)
}

// Text color setter
Hue.set_text_color = function (color) {
  Hue.text_color = color
  Hue.apply_theme()
  Hue.config_admin_text_color()
}

// Do background peek
Hue.do_background_peek = function () {
  Hue.apply_background(Hue.background_peek_url, true)
}

// Show background peek confirm
Hue.show_background_peek_confirm = function () {
  Hue.show_confirm("Apply selected background", function () {
    Hue.background_peek_action()
    Hue.msg_background_select.close()
  }, function () {
    Hue.apply_background()
  })
}