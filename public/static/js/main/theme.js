// Setups theme and background variables from initial data
Hue.setup_theme_and_background = function (data) {
  Hue.set_background_image(data)
  Hue.theme = data.theme
  Hue.background_mode = data.background_mode
  Hue.background_effect = data.background_effect
  Hue.background_tile_dimensions = data.background_tile_dimensions
  Hue.text_color_mode = data.text_color_mode
  Hue.text_color = data.text_color
}

// Sets an applies background images from data
Hue.set_background_image = function (data) {
  if (data.background_image !== "") {
    Hue.background_image = data.background_image
  } else {
    Hue.background_image = Hue.config.default_background_image_url
  }

  Hue.background_image_setter = data.background_image_setter
  Hue.background_image_date = data.background_image_date
  Hue.apply_background()
  Hue.config_admin_background_image()
}

// Applies the background to all background elements
Hue.apply_background = function () {
  let bg_image = Hue.background_image
  let bg_mode = Hue.background_mode
  let bg_tile_dimensions = Hue.background_tile_dimensions

  if (Hue.background_image_enabled()) {
    $(".background_image").css("background-image", `url('${bg_image}')`)
  } else {
    $(".background_image").css("background-image", "none")
  }

  if (bg_mode === "normal") {
    $(".background_image").each(function () {
      $(this).removeClass("background_image_tiled")
    })
  } else if (bg_mode === "tiled") {
    $(".background_image").each(function () {
      $(this).addClass("background_image_tiled")
    })
  }

  $(".background_image").each(function () {
    $(this).removeClass("background_image_blur")
    $(this).removeClass("background_image_grayscale")
    $(this).removeClass("background_image_saturate")
    $(this).removeClass("background_image_brightness")
    $(this).removeClass("background_image_invert")
  })

  if (bg_mode !== "solid") {
    if (Hue.background_effect === "blur") {
      $(".background_image").each(function () {
        $(this).addClass("background_image_blur")
      })
    } else if (Hue.background_effect === "grayscale") {
      $(".background_image").each(function () {
        $(this).addClass("background_image_grayscale")
      })
    } else if (Hue.background_effect === "saturate") {
      $(".background_image").each(function () {
        $(this).addClass("background_image_saturate")
      })
    } else if (Hue.background_effect === "brightness") {
      $(".background_image").each(function () {
        $(this).addClass("background_image_brightness")
      })
    } else if (Hue.background_effect === "invert") {
      $(".background_image").each(function () {
        $(this).addClass("background_image_invert")
      })
    }
  }

  document.documentElement.style.setProperty('--bg_tile_dimensions', bg_tile_dimensions)
}

// Theme setter
Hue.set_theme = function (color) {
  Hue.theme = color
  Hue.apply_theme()
  Hue.config_admin_theme()
}

// This is where the color theme gets built and applied
// This builds CSS declarations based on the current theme color
// The CSS declarations are inserted into the DOM
// Older declarations get removed
Hue.apply_theme = function () {
  let theme = Hue.theme

  if (theme.startsWith("#")) {
    theme = Hue.colorlib.array_to_rgb(Hue.colorlib.hex_to_rgb(theme))
  }

  let background_color = theme
  let font_color

  if (Hue.text_color_mode === "custom") {
    font_color = Hue.text_color
  } else {
    font_color = Hue.colorlib.get_lighter_or_darker(background_color, 0.8)
  }

  let altcolor = Hue.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = Hue.colorlib.rgb_to_rgba(altcolor,  0.7)
  let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = Hue.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = Hue.colorlib.rgb_to_rgba(altbackground, 0.7)

  document.documentElement.style.setProperty('--font_color', font_color)
  document.documentElement.style.setProperty('--altcolor', altcolor)
  document.documentElement.style.setProperty('--altcolor_a', altcolor_a)
  document.documentElement.style.setProperty('--background_color', background_color)
  document.documentElement.style.setProperty('--background_color_a', background_color_a)
  document.documentElement.style.setProperty('--altbackground', altbackground)
  document.documentElement.style.setProperty('--altbackground_a', altbackground_a)
}

// Changes the theme
Hue.change_theme = function (color) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  color = Hue.utilz.clean_string5(color).toLowerCase()

  if (color === undefined) {
    return false
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.feedback("Not a valid hex color value")
    return false
  }

  if (color === Hue.theme) {
    Hue.feedback("Theme is already set to that")
    return false
  }

  Hue.socket_emit("change_theme", { color: color })
}

// Announces theme change
Hue.announce_theme_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the theme to ${data.color}`
  )
  Hue.set_theme(data.color)
}

// Picker window to select how to change the background image
Hue.open_background_image_select = function () {
  Hue.msg_info2.show([
    "Change Background Image",
    Hue.template_background_image_select(),
  ], function () {
    $("#background_image_select_url").click(function () {
      Hue.open_background_image_input()
    })

    $("#background_image_select_upload").click(function () {
      Hue.open_background_image_picker()
    })
  })
  Hue.horizontal_separator.separate("background_image_select_container")
}

// If upload is chosen as the method to change the background image
// the file dialog is opened
Hue.open_background_image_picker = function () {
  Hue.msg_info2.close()

  $("#background_image_input").click()
}

// If a URL source is chosen as the method to change the background image
// this window is opened
Hue.open_background_image_input = function () {
  Hue.msg_info2.show(
    ["Change Background Image", Hue.template_background_image_input()],
    function () {
      $("#background_image_input_submit").click(function () {
        Hue.background_image_input_action()
      })

      $("#background_image_input_text").focus()
      Hue.background_image_input_open = true
    }
  )
}

// On background image source input change
Hue.background_image_input_action = function () {
  let src = $("#background_image_input_text").val().trim()

  if (Hue.change_background_image_source(src)) {
    Hue.msg_info2.close()
  }
}

// On background image selected for upload
Hue.background_image_selected = function (input) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  let file = input.files[0]
  let size = file.size / 1024

  $("#background_image_input").closest("form").get(0).reset()

  if (size > Hue.config.max_image_size) {
    Hue.showmsg("File is too big")
    return false
  }

  $("#admin_background_image").attr(
    "src",
    Hue.config.background_image_loading_url
  )

  Hue.upload_file({ file: file, action: "background_image_upload" })
}

// Change the background image with a URL
Hue.change_background_image_source = function (src) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (src === undefined) {
    return false
  }

  if (src !== "default") {
    if (!Hue.utilz.is_url(src)) {
      return false
    }

    src = src.replace(/\.gifv/g, ".gif")

    if (src === Hue.background_image) {
      Hue.feedback("Background image is already set to that")
      return false
    }

    if (src.length === 0) {
      return false
    }

    if (src.length > Hue.config.max_media_source_length) {
      return false
    }

    let extension = Hue.utilz.get_extension(src).toLowerCase()

    if (!extension || !Hue.utilz.image_extensions.includes(extension)) {
      return false
    }
  } else {
    if (Hue.background_image === Hue.config.default_background_image_url) {
      Hue.feedback("Background image is already set to that")
      return false
    }
  }

  Hue.socket_emit("change_background_image_source", { src: src })

  return true
}

// Announces background image changes
Hue.announce_background_image_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background image`
  )
  Hue.set_background_image(data)
}

// Changes the background mode
Hue.change_background_mode = function (mode) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (
    mode !== "normal" &&
    mode !== "tiled" &&
    mode !== "solid"
  ) {
    Hue.feedback("Invalid background mode")
    return false
  }

  if (mode === Hue.background_mode) {
    Hue.feedback(`Background mode is already ${Hue.background_mode}`)
    return false
  }

  Hue.socket_emit("change_background_mode", { mode: mode })
}

// Announces background mode changes
Hue.announce_background_mode_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background mode to ${data.mode}`
  )
  Hue.set_background_mode(data.mode)
}

// Changes background tile dimensions
Hue.change_background_tile_dimensions = function (dimensions) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (dimensions.length > Hue.config.safe_limit_1) {
    return false
  }

  dimensions = Hue.utilz.clean_string2(dimensions)

  if (dimensions.length === 0) {
    return false
  }

  if (dimensions === Hue.background_tile_dimensions) {
    return false
  }

  Hue.socket_emit("change_background_tile_dimensions", {
    dimensions: dimensions,
  })
}

// Announces background tile dimensions changes
Hue.announce_background_tile_dimensions_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background tile dimensions to ${data.dimensions}`
  )
  Hue.set_background_tile_dimensions(data.dimensions)
  Hue.apply_background()
}

// Check whether a background image should be enabled,
// depending on the background mode and settings
Hue.background_image_enabled = function () {
  if (Hue.background_mode === "solid") {
    return false
  }

  return true
}

// Changes the background effect
Hue.change_background_effect = function (effect) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (
    effect !== "none" &&
    effect !== "blur" &&
    effect !== "grayscale" &&
    effect !== "saturate" &&
    effect !== "brightness" && 
    effect !== "invert"
  ) {
    Hue.feedback("Invalid background effect")
    return false
  }

  if (effect === Hue.background_effect) {
    Hue.feedback(`Background effect is already ${Hue.background_effect}`)
    return false
  }

  Hue.socket_emit("change_background_effect", { effect: effect })
}

// Announces background effect changes
Hue.announce_background_effect_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background effect to ${data.effect}`
  )
  Hue.set_background_effect(data.effect)
}

// Background mode setter
Hue.set_background_mode = function (what) {
  Hue.background_mode = what
  Hue.config_admin_background_mode()
  Hue.apply_background()
}

// Background effect setter
Hue.set_background_effect = function (what) {
  Hue.background_effect = what
  Hue.config_admin_background_effect()
  Hue.apply_background()
}

// Background tile dimensions setter
Hue.set_background_tile_dimensions = function (dimensions) {
  Hue.background_tile_dimensions = dimensions
  Hue.config_admin_background_tile_dimensions()
}

// Changes the text color mode
Hue.change_text_color_mode = function (mode) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (mode !== "automatic" && mode !== "custom") {
    Hue.feedback("Invalid text color mode")
    return false
  }

  if (mode === Hue.text_color_mode) {
    Hue.feedback(`Text color mode is already ${Hue.text_color_mode}`)
    return false
  }

  Hue.socket_emit("change_text_color_mode", { mode: mode })
}

// Announces text color mode changes
Hue.announce_text_color_mode_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the text color mode to ${data.mode}`
  )
  Hue.set_text_color_mode(data.mode)
  Hue.apply_theme()
}

// Text color mode setter
Hue.set_text_color_mode = function (mode) {
  Hue.text_color_mode = mode
  Hue.config_admin_text_color_mode()
}

// Changes the text color
Hue.change_text_color = function (color) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  color = Hue.utilz.clean_string5(color).toLowerCase()

  if (color === undefined) {
    return false
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.feedback("Not a valid hex color value")
    return false
  }

  if (color === Hue.text_color) {
    Hue.feedback("Text color is already set to that")
    return false
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
  Hue.apply_theme()
}

// Text color setter
Hue.set_text_color = function (color) {
  Hue.text_color = color
  Hue.config_admin_text_color()
}

// Change CSS variables
Hue.change_css_variable = function (name, value) {
  document.documentElement.style.setProperty(`--${name}`, value)
}
