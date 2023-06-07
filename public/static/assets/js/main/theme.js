// Prepare theme
App.prepare_theme = (data) => {
  App.set_background(data, false)
  App.background_color = data.background_color
  App.text_color = data.text_color
}

// Setups theme and background variables from initial data
App.setup_theme = () => {
  DOM.ev(DOM.el(`#background`), `load`, () => {
    if (App.background_preview) {
      App.hide_windows_temporarily()
      App.show_background_peek_confirm()
    }
  })

  DOM.ev(DOM.el(`#background`), `error`, () => {
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

  let font = `${App.settings.font}, sans-serif`
  let altcolor = App.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = App.colorlib.rgb_to_rgba(altcolor, 0.7)
  let background_color_a = App.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = App.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = App.colorlib.rgb_to_rgba(altbackground, 0.7)
  let text_color_a = App.colorlib.rgb_to_rgba(text_color, 0.7)

  document.documentElement.style.setProperty(`--font`, font)
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
    let item = DOM.create(`div`, `random_theme_item action`)
    item.style.backgroundColor = theme.background
    item.style.color = theme.color
    item.textContent = `This is a random theme`

    DOM.ev(item, `click`, () => {
      DOM.el(`#admin_background_color`).value = theme.background
      DOM.el(`#admin_text_color`).value = theme.color
      App.apply_theme(theme.background, theme.color)
    })

    return item
  }

  function fill_column (col) {
    for (let i=0; i<num_col_items; i++) {
      col.append(create_item(ThemeList.random_theme()))
    }
  }

  let container_1 = DOM.el(`#random_theme_container_1`)
  container_1.innerHTML = ``

  let container_2 = DOM.el(`#random_theme_container_2`)
  container_2.innerHTML = ``

  fill_column(container_1)
  fill_column(container_2)
}

// Show theme picker
App.show_theme_picker = () => {
  App.original_background_color = DOM.el(`#admin_background_color`).value
  App.original_text_color = DOM.el(`#admin_text_color`).value
  App.generate_random_themes()
  App.msg_theme_picker.show()
}

// Cancel random theme
App.cancel_change_theme = () => {
  DOM.el(`#admin_background_color`).value = App.original_background_color
  DOM.el(`#admin_text_color`).value = App.original_text_color
  App.apply_theme()
  App.msg_theme_picker.close()
}

// Apply the selected theme
App.apply_selected_theme = () => {
  let bg_color = DOM.el(`#admin_background_color`).value
  let text_color = DOM.el(`#admin_text_color`).value

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
  DOM.ev(DOM.el(`#theme_picker_random`), `click`, () => {
    App.generate_random_themes()
  })

  DOM.ev(DOM.el(`#theme_picker_peek`), `click`, () => {
    App.hide_windows_temporarily()
  })
}

// Apply theme controls
App.apply_theme_controls = () => {
  App.apply_theme(DOM.el(`#admin_background_color`).value, DOM.el(`#admin_text_color`).value)
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
    for (let el of DOM.els(`.background`)) {
      el.src = background
    }
  }
  else {
    for (let el of DOM.els(`.background`)) {
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
  let src = DOM.el(`#link_background_input`).value.trim()

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
    DOM.el(`#admin_background`).src = App.config.background_loading_url
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