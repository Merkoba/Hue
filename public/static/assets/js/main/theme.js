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
  let altcolor_a = Hue.colorlib.rgb_to_rgba(altcolor,  0.7)
  let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = Hue.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = Hue.colorlib.rgb_to_rgba(altbackground, 0.7)
  let text_color_a = Hue.colorlib.rgb_to_rgba(text_color,  0.7)
  
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
  let num_col_items = 6

  function create_item (theme) {
    let item = Hue.div("random_theme_item action")

    item.style.backgroundColor = theme.bg_color
    item.style.color = theme.text_color
    item.textContent = "This is a random theme"

    item.addEventListener("click", function () {
      Hue.el("#admin_background_color").value = theme.bg_color
      Hue.el("#admin_text_color").value = theme.text_color
      Hue.apply_theme(theme.bg_color, theme.text_color)
    })

    return item
  }

  function fill_column(col) {
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
    text_color = Hue.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Get a random light theme
Hue.get_light_theme = function () {
  let bg_color = Hue.colorlib.get_light_color()
  let text_color = Hue.colorlib.get_random_hex()
  
  if (Hue.colorlib.is_light(text_color)) {
    text_color = Hue.colorlib.get_lighter_or_darker(text_color, 0.66)
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

  Hue.show_confirm("Change Theme", "Apply selected theme", function () {
    Hue.change_background_color(bg_color)
    Hue.change_text_color(text_color)    
  }, function () {
    Hue.cancel_change_theme()
  })
}

// Setup random theme
Hue.setup_theme_picker = function () {
  Hue.el("#theme_picker_regenerate").addEventListener("click", function () {
    Hue.generate_random_themes()
  })

  Hue.el("#theme_picker_peek").addEventListener("click", function () {
    Hue.hide_windows_temporarily(2000)
  })
}

// Apply theme controls
Hue.apply_theme_controls = function () {
  Hue.apply_theme(Hue.el("#admin_background_color").value, Hue.el("#admin_text_color").value)
}