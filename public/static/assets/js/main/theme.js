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
  
  document.documentElement.style.setProperty('--text_color', text_color)
  document.documentElement.style.setProperty('--text_color_a', text_color_a)
  document.documentElement.style.setProperty('--altcolor', altcolor)
  document.documentElement.style.setProperty('--altcolor_a', altcolor_a)
  document.documentElement.style.setProperty('--background_color', background_color)
  document.documentElement.style.setProperty('--background_color_a', background_color_a)
  document.documentElement.style.setProperty('--altbackground', altbackground)
  document.documentElement.style.setProperty('--altbackground_a', altbackground_a)
}

// Show a window to select random themes
Hue.select_random_theme = function () {
  let num_col_items = 10

  function create_item (theme) {
    let item = Hue.div("action text_button nowrap")

    item.style.backgroundColor = theme.bg_color
    item.style.color = theme.text_color
    item.textContent = "This is some sample text"

    item.addEventListener("click", function () {
      Hue.apply_theme(theme.bg_color, theme.text_color)
      Hue.random_theme_to_apply = theme
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

  Hue.msg_random_theme.show()
}

// Get a random dark theme
Hue.get_dark_theme = function () {
  bg_color = Hue.colorlib.get_dark_color()
  text_color = Hue.colorlib.get_random_hex()
  
  if (Hue.colorlib.is_dark(text_color)) {
    text_color = Hue.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Get a random light theme
Hue.get_light_theme = function () {
  bg_color = Hue.colorlib.get_light_color()
  text_color = Hue.colorlib.get_random_hex()
  
  if (Hue.colorlib.is_light(text_color)) {
    text_color = Hue.colorlib.get_lighter_or_darker(text_color, 0.66)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Apply the selected random theme
Hue.apply_random_theme = function () {
  if (Hue.random_theme_to_apply) {
    let theme = Hue.random_theme_to_apply
    Hue.change_background_color(theme.bg_color)
    Hue.change_text_color(theme.text_color)
    Hue.random_theme_to_apply = undefined
  }
}