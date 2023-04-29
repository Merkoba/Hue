// Prepare theme
App.prepare_theme = (data) => {
  App.set_background(data, false)
  App.background_color = data.background_color
  App.text_color = data.text_color
}

// Setups theme and background variables from initial data
App.setup_theme = () => {
  App.ev(App.el(`#background`), `load`, () => {
    if (App.background_preview) {
      App.hide_windows_temporarily()
      App.show_background_peek_confirm()
    }
  })

  App.ev(App.el(`#background`), `error`, () => {
    if (App.background_preview) {
      App.apply_background()
    }
  })
}

// This sets CSS variables based on the current colors
App.apply_theme = (background_color = ``, text_color = ``) => {
  if (!background_color) {
    background_color = App.background_color
  }

  if (!text_color) {
    text_color = App.text_color
  }

  background_color = App.colorlib.hex_to_rgb(background_color)
  text_color = App.colorlib.hex_to_rgb(text_color)

  let altcolor = App.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = App.colorlib.rgb_to_rgba(altcolor, 0.7)
  let background_color_a = App.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = App.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = App.colorlib.rgb_to_rgba(altbackground, 0.7)
  let text_color_a = App.colorlib.rgb_to_rgba(text_color, 0.7)

  document.documentElement.style.setProperty(`--text_color`, text_color)
  document.documentElement.style.setProperty(`--text_color_a`, text_color_a)
  document.documentElement.style.setProperty(`--altcolor`, altcolor)
  document.documentElement.style.setProperty(`--altcolor_a`, altcolor_a)
  document.documentElement.style.setProperty(`--background_color`, background_color)
  document.documentElement.style.setProperty(`--background_color_a`, background_color_a)
  document.documentElement.style.setProperty(`--altbackground`, altbackground)
  document.documentElement.style.setProperty(`--altbackground_a`, altbackground_a)
}

// Show a window to select random themes
App.generate_random_themes = () => {
  let num_col_items = 5

  function create_item (theme) {
    let item = App.create(`div`, `random_theme_item action`)

    item.style.backgroundColor = theme.bg_color
    item.style.color = theme.text_color
    item.textContent = `This is a random theme`

    App.ev(item, `click`, () => {
      App.el(`#admin_background_color`).value = theme.bg_color
      App.el(`#admin_text_color`).value = theme.text_color
      App.apply_theme(theme.bg_color, theme.text_color)
    })

    return item
  }

  function fill_column (col) {
    let dark = true

    for (let i=0; i<num_col_items; i++) {
      if (dark) {
        col.append(create_item(App.get_dark_theme()))
      }
      else {
        col.append(create_item(App.get_light_theme()))
      }

      dark = !dark
    }
  }

  let container_1 = App.el(`#random_theme_container_1`)
  container_1.innerHTML = ``

  let container_2 = App.el(`#random_theme_container_2`)
  container_2.innerHTML = ``

  fill_column(container_1)
  fill_column(container_2)
}

// Show theme picker
App.show_theme_picker = () => {
  App.original_background_color = App.el(`#admin_background_color`).value
  App.original_text_color = App.el(`#admin_text_color`).value
  App.generate_random_themes()
  App.msg_theme_picker.show()
}

// Cancel random theme
App.cancel_change_theme = () => {
  App.el(`#admin_background_color`).value = App.original_background_color
  App.el(`#admin_text_color`).value = App.original_text_color
  App.apply_theme()
  App.msg_theme_picker.close()
}

// Get a random dark theme
App.get_dark_theme = () => {
  let bg_color = App.colorlib.get_dark_color()
  let text_color = App.colorlib.get_random_hex()

  if (App.colorlib.is_dark(text_color)) {
    text_color = App.colorlib.get_lighter_or_darker(text_color, 0.74)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Get a random light theme
App.get_light_theme = () => {
  let bg_color = App.colorlib.get_light_color()
  let text_color = App.colorlib.get_random_hex()

  if (App.colorlib.is_light(text_color)) {
    text_color = App.colorlib.get_lighter_or_darker(text_color, 0.74)
  }

  return {bg_color: bg_color, text_color: text_color}
}

// Apply the selected theme
App.apply_selected_theme = () => {
  let bg_color = App.el(`#admin_background_color`).value
  let text_color = App.el(`#admin_text_color`).value

  if (bg_color === App.background_color && text_color === App.text_color) {
    return
  }

  App.show_confirm(`Apply selected theme`, () => {
    App.change_background_color(bg_color)
    App.change_text_color(text_color)
  }, () => {
    App.cancel_change_theme()
  })
}

// Setup random theme
App.setup_theme_picker = () => {
  App.ev(App.el(`#theme_picker_random`), `click`, () => {
    App.generate_random_themes()
  })

  App.ev(App.el(`#theme_picker_peek`), `click`, () => {
    App.hide_windows_temporarily()
  })
}

// Apply theme controls
App.apply_theme_controls = () => {
  App.apply_theme(App.el(`#admin_background_color`).value, App.el(`#admin_text_color`).value)
}

// Sets an applies background images from data
App.set_background = (data, apply = true) => {
  if (!data.background) {
    App.background = ``
  }
  else {
    if (data.background_type === `hosted`) {
      let ver = `?ver=${data.background_version}`
      let bg = data.background + ver
      App.background = `${App.config.public_media_directory}/room/${App.room_id}/${bg}`
    }
    else {
      App.background = data.background
    }
  }

  App.config_admin_background()

  if (apply) {
    App.apply_background()
  }
}

// Applies the background to all background elements
App.apply_background = (background = App.background, preview = false) => {
  App.background_preview = preview

  if (App.get_setting(`show_background`)) {
    for (let el of App.els(`.background`)) {
      el.src = background
    }
  }
  else {
    for (let el of App.els(`.background`)) {
      el.src = ``
    }
  }
}

// Background color setter
App.set_background_color = (color) => {
  App.background_color = color
  App.apply_theme()
  App.config_admin_background_color()
}

// Changes the background color
App.change_background_color = (color) => {
  if (!App.is_admin_or_op()) {
    return
  }

  color = App.utilz.no_space(color).toLowerCase()

  if (color === undefined) {
    return
  }

  if (!App.utilz.validate_hex(color)) {
    App.checkmsg(`Not a valid hex color value`)
    return
  }

  if (color === App.background_color) {
    return
  }

  App.socket_emit(`change_background_color`, { color: color })
}

// Announces background color change
App.announce_background_color_change = (data) => {
  App.show_room_notification(data.username, `${data.username} changed the background color to ${data.color}`)
  App.set_background_color(data.color)
}

// If upload is chosen as the method to change the background image
App.open_background_picker = () => {
  App.upload_media = `background`
  App.trigger_dropzone()
}

// On background image source input change
App.link_background_action = () => {
  let src = App.el(`#link_background_input`).value.trim()

  if (!src) {
    return
  }

  App.background_peek_url = src

  App.background_peek_action = () => {
    App.change_background_source(src)
  }

  App.msg_link_background.close()
  App.do_background_peek()
}

// On background image selected for upload
App.background_selected = (file) => {
  if (!file) {
    return
  }

  if (!App.is_admin_or_op()) {
    return
  }

  if (!App.utilz.is_image(file.name)) {
    return
  }

  for (let date in App.files) {
    let f = App.files[date]

    if (f.hue_data.action === `background_upload`) {
      App.cancel_file_upload(date)
    }
  }

  let size = file.size / 1024

  if (size > App.config.max_image_size) {
    App.checkmsg(`File is too big`)
    return
  }

  App.background_peek_url = URL.createObjectURL(file)

  App.background_peek_action = () => {
    App.el(`#admin_background`).src = App.config.background_loading_url
    App.upload_file({file: file, action: `background_upload`})
  }

  App.do_background_peek()
}

// Change the background image with a URL
App.change_background_source = (src) => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (src === undefined) {
    return
  }

  if (src !== ``) {
    if (!App.utilz.is_url(src)) {
      return
    }

    src = src.replace(/\.gifv/g, `.gif`)

    if (src === App.background) {
      App.checkmsg(`Background image is already set to that`)
      return
    }

    if (src.length === 0) {
      return
    }

    if (src.length > App.config.max_media_source_length) {
      return
    }

    if (!App.utilz.is_image(src)) {
      return
    }
  }

  App.socket_emit(`change_background_source`, { src: src })
}

// Announces background image changes
App.announce_background_change = (data) => {
  App.show_room_notification(
    data.username,
    `${data.username} changed the background image`
  )

  App.set_background(data)
}

// Changes the text color
App.change_text_color = (color) => {
  if (!App.is_admin_or_op()) {
    return
  }

  color = App.utilz.no_space(color).toLowerCase()

  if (color === undefined) {
    return
  }

  if (!App.utilz.validate_hex(color)) {
    App.checkmsg(`Not a valid hex color value`)
    return
  }

  if (color === App.text_color) {
    return
  }

  App.socket_emit(`change_text_color`, { color: color })
}

// Announces text color changes
App.announce_text_color_change = (data) => {
  App.show_room_notification(
    data.username,
    `${data.username} changed the text color to ${data.color}`
  )

  App.set_text_color(data.color)
}

// Text color setter
App.set_text_color = (color) => {
  App.text_color = color
  App.apply_theme()
  App.config_admin_text_color()
}

// Do background peek
App.do_background_peek = () => {
  App.apply_background(App.background_peek_url, true)
}

// Show background peek confirm
App.show_background_peek_confirm = () => {
  App.show_confirm(`Apply selected background`, () => {
    App.background_peek_action()
    App.msg_background_select.close()
  }, () => {
    App.apply_background()
  })
}