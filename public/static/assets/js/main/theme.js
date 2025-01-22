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

  let font = `${App.get_setting(`font`)}, sans-serif`
  let bgo = App.get_setting(`background_opacity`)
  let bg_opacity

  if (bgo > 0) {
    bg_opacity = bgo
  }
  else {
    bg_opacity = App.config.background_opacity
  }

  let altcolor = App.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = App.colorlib.rgb_to_rgba(altcolor, 0.7)
  let background_color_a = App.colorlib.rgb_to_rgba(background_color, bg_opacity)
  let altbackground = App.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = App.colorlib.rgb_to_rgba(altbackground, 0.7)
  let text_color_a = App.colorlib.rgb_to_rgba(text_color, 0.7)

  document.documentElement.style.setProperty(`--font`, font)
  document.documentElement.style.setProperty(`--text_color`, text_color)
  document.documentElement.style.setProperty(`--text_color_a`, text_color_a)
  document.documentElement.style.setProperty(`--altcolor`, altcolor)
  document.documentElement.style.setProperty(`--altcolor_a`, altcolor_a)
  document.documentElement.style.setProperty(`--bordercolor`, text_color_a)
  document.documentElement.style.setProperty(`--background_color`, background_color)
  document.documentElement.style.setProperty(`--background_color_a`, background_color_a)
  document.documentElement.style.setProperty(`--altbackground`, altbackground)
  document.documentElement.style.setProperty(`--altbackground_a`, altbackground_a)
  document.documentElement.style.setProperty(`--chat_font_size`, App.get_setting(`chat_font_size`) + `em`)
  document.documentElement.style.setProperty(`--chat_size`, App.get_setting(`chat_font_size`) + `em`)

  if (App.get_setting(`hide_scrollbars`)) {
    document.documentElement.classList.add(`no_scrollbars`)
  }
  else {
    document.documentElement.classList.remove(`no_scrollbars`)
  }

  if (App.get_setting(`text_glow`)) {
    document.body.classList.add(`text_glow`)
  }
  else {
    document.body.classList.remove(`text_glow`)
  }
}

// Sets an applies background images from data
App.set_background = (data, apply = true) => {
  if (!data.background) {
    App.background = ``
  }
  else if (data.background_type === `hosted`) {
    let ver = `?ver=${data.background_version}`
    let bg = data.background + ver
    App.background = `${App.config.public_media_directory}/room/${App.room_id}/${bg}`
  }
  else {
    App.background = data.background
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

  App.socket_emit(`change_background_color`, {color})
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
    let obj = App.files[date]

    if (obj.args.action === `background_upload`) {
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
    App.upload_file({file, action: `background_upload`})
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

  App.socket_emit(`change_background_source`, {src})
}

// Announces background image changes
App.announce_background_change = (data) => {
  App.show_room_notification(
    data.username,
    `${data.username} changed the background image`,
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

  App.socket_emit(`change_text_color`, {color})
}

// Announces text color changes
App.announce_text_color_change = (data) => {
  App.show_room_notification(
    data.username,
    `${data.username} changed the text color to ${data.color}`,
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

// Check color pickers
App.check_color_pickers = () => {
  let c1 = App.background_color_picker.color
  let c2 = App.text_color_picker.color

  if (c1 !== App.background_color) {
    App.change_background_color(c1)
  }

  if (c2 !== App.text_color) {
    App.change_text_color(c2)
  }
}

// Get and apply a random theme
App.random_theme = (type) => {
  let background, text

  if (type === `dark`) {
    background = App.colorlib.get_dark_color()
    text = App.colorlib.get_light_color()
  }
  else if (type === `light`) {
    background = App.colorlib.get_light_color()
    text = App.colorlib.get_dark_color()
  }

  App.background_color_picker.setColor(background)
  App.text_color_picker.setColor(text)
}

// Insert CSS into the document
App.insert_css = (name, css) => {
  for (let style of DOM.els(`.${name}`)) {
    style.remove()
  }

  let style = DOM.create(`style`, name)
  style.textContent = css
  document.head.appendChild(style)
}

// Insert custom css
App.insert_custom_css = () => {
  let css = App.get_setting(`custom_css`).trim()
  App.insert_css(`custom_css`, css)
}