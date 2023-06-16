// Setups change events for the room config widgets
App.setup_room_config = () => {
  let room_name = DOM.el(`#admin_room_name`)

  DOM.ev(room_name, `blur`, () => {
    let name = App.utilz.single_space(room_name.value)

    if (name === ``) {
      room_name.value = App.room_name
      return
    }

    if (name !== App.room_name) {
      App.change_room_name(name)
    }
  })

  let topic = DOM.el(`#admin_topic`)

  DOM.ev(topic, `blur`, () => {
    let t = App.utilz.single_space(topic.value)

    if (t === ``) {
      topic.value = App.topic
      return
    }

    if (t !== App.topic) {
      App.change_topic(t)
    }
  })

  let background = DOM.el(`#admin_background`)

  DOM.ev(background, `error`, () => {
    if (background.src !== App.config.background_loading_url) {
      background.src = App.config.background_loading_url
    }
  })

  DOM.ev(DOM.el(`#room_config_more_admin_activity`), `click`, () => {
    App.request_admin_activity()
  })

  DOM.ev(DOM.el(`#room_config_more_admin_list`), `click`, () => {
    App.request_admin_list()
  })

  DOM.ev(DOM.el(`#room_config_more_ban_list`), `click`, () => {
    App.request_ban_list()
  })

  DOM.ev(DOM.el(`#admin_background`), `click`, () => {
    App.msg_background_select.show()
  })

  App.setup_background_select()
  App.setup_link_background()

  function apply_color_pickers () {
    let c1 = App.background_color_picker.color
    let c2 = App.text_color_picker.color
    App.apply_theme(c1, c2)
  }

  function start_color_picker (what) {
    let el = DOM.el(`#admin_${what}_color`)

    App[`${what}_color_picker`] = AColorPicker.createPicker(el, {
      showAlpha: false,
      showHSL: false,
      showHEX: true,
      showRGB: false,
      color: App[`${what}_color`]
    })

    App[`${what}_color_picker`].on(`change`, (picker, color) => {
      apply_color_pickers()
    })
  }

  start_color_picker(`background`)
  start_color_picker(`text`)
}

// Shows the room config
App.show_room_config = () => {
  App.msg_room_config.show()
}

// Configures the room config
// Updates all widgets with current state
App.config_room_config = () => {
  if (App.is_admin_or_op()) {
    App.config_admin_background_color()
    App.config_admin_background()
    App.config_admin_text_color()
    App.config_admin_room_name()
    App.config_admin_topic()
  }
}

// Updates the background color widget in the room config based on current state
App.config_admin_background_color = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.background_color_picker.setColor(App.background_color)
}

// Updates the text color widget in the room config based on current state
App.config_admin_text_color = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.text_color_picker.setColor(App.text_color)
}

// Updates the background image widget in the room config based on current state
App.config_admin_background = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (App.background) {
    DOM.el(`#admin_background`).src = App.background
  }
  else {
    DOM.el(`#admin_background`).src = App.config.background_loading_url
  }
}

// Updates the room name widget in the room config based on current state
App.config_admin_room_name = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  DOM.el(`#admin_room_name`).value = App.room_name
}

// Updates the topic widget in the room config based on current state
App.config_admin_topic = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  DOM.el(`#admin_topic`).value = App.topic
}

// Setup background select
App.setup_background_select = () => {
  DOM.ev(DOM.el(`#background_select_draw`), `click`, () => {
    App.open_draw_image(`background`)
  })

  DOM.ev(DOM.el(`#background_select_random`), `click`, () => {
    App.make_random_image(`background`)
  })

  DOM.ev(DOM.el(`#background_select_link`), `click`, () => {
    App.open_link_background()
  })

  DOM.ev(DOM.el(`#background_select_remove`), `click`, () => {
    App.show_confirm(`Remove the current background`, () => {
      App.change_background_source(``)
    })
  })

  DOM.ev(DOM.el(`#background_select_upload`), `click`, () => {
    App.open_background_picker()
  })
}

// Setup background input
App.setup_link_background = () => {
  DOM.ev(DOM.el(`#link_background_submit`), `click`, () => {
    App.link_background_action()
  })
}

// Setup background input
App.open_link_background = () => {
  DOM.el(`#link_background_input`).value = ``
  App.msg_link_background.show()
  DOM.el(`#link_background_input`).focus()
}