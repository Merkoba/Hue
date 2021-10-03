// Setups theme and background variables from initial data
Hue.setup_theme = function (data) {
  Hue.set_background_image(data, false)
  Hue.background_color = data.background_color
  Hue.text_color = data.text_color
}

// Sets an applies background images from data
Hue.set_background_image = function (data, apply = true) {
  if (data.background_image !== "") {
    Hue.background_image = data.background_image
  } else {
    Hue.background_image = Hue.config.default_background_image_url
  }

  Hue.config_admin_background_image()

  if (apply) {
    Hue.apply_background()
  }
}

// Applies the background to all background elements
Hue.apply_background = function () {
  $(".background_image").css("background-image", `url('${Hue.background_image}')`)
}

// Background color setter
Hue.set_background_color = function (color) {
  Hue.background_color = color
  Hue.apply_theme()
  Hue.config_admin_background_color()
}

// This is where the color theme gets built and applied
// This builds CSS declarations based on the current background color
// The CSS declarations are inserted into the DOM
// Older declarations get removed
Hue.apply_theme = function () {
  let theme = Hue.background_color

  if (theme.startsWith("#")) {
    theme = Hue.colorlib.array_to_rgb(Hue.colorlib.hex_to_rgb(theme))
  }

  let background_color = theme
  let font_color = Hue.text_color

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

// Changes the background color
Hue.change_background_color = function (color) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  color = Hue.utilz.clean_string5(color).toLowerCase()

  if (color === undefined) {
    return false
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.checkmsg("Not a valid hex color value")
    return false
  }

  if (color === Hue.background_color) {
    return false
  }

  Hue.socket_emit("change_background_color", { color: color })
}

// Announces background color change
Hue.announce_background_color_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background color to ${data.color}`
  )
  Hue.set_background_color(data.color)
}

// Picker window to select how to change the background image
Hue.open_background_image_select = function () {
  Hue.msg_info2.show([
    "Change Background Image",
    Hue.template_background_image_select(),
  ], function () {
    $("#background_image_select_url").on("click", function () {
      Hue.open_background_image_input()
    })

    $("#background_image_select_upload").on("click", function () {
      Hue.open_background_image_picker()
    })
  })
  Hue.horizontal_separator($("#background_image_select_container")[0])
}

// If upload is chosen as the method to change the background image
// the file dialog is opened
Hue.open_background_image_picker = function () {
  Hue.msg_info2.close()

  $("#background_image_input").trigger("click")
}

// If a URL source is chosen as the method to change the background image
// this window is opened
Hue.open_background_image_input = function () {
  Hue.msg_info2.show(
    ["Change Background Image", Hue.template_background_image_input()],
    function () {
      $("#background_image_input_submit").on("click", function () {
        Hue.background_image_input_action()
      })

      $("#background_image_input_text").trigger("focus")
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
Hue.background_image_selected = function (file) {
  if (!file) {
    return false
  }

  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  let size = file.size / 1024

  $("#background_image_input").closest("form").get(0).reset()

  if (size > Hue.config.max_image_size) {
    Hue.checkmsg("File is too big")
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
      Hue.checkmsg("Background image is already set to that")
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
      Hue.checkmsg("Background image is already set to that")
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
    Hue.checkmsg("Not a valid hex color value")
    return false
  }

  if (color === Hue.text_color) {
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