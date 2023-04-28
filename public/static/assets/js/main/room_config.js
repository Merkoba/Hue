// Setups change events for the room config widgets
Hue.setup_room_config = () => {
  Hue.ev(Hue.el(`#admin_background_color`), `change`, () => {
    Hue.apply_theme_controls()
  })

  Hue.ev(Hue.el(`#admin_text_color`), `change`, () => {
    Hue.apply_theme_controls()
  })

  let room_name = Hue.el(`#admin_room_name`)

  Hue.ev(room_name, `blur`, () => {
    let name = Hue.utilz.single_space(room_name.value)

    if (name === ``) {
      room_name.value = Hue.room_name
      return
    }

    if (name !== Hue.room_name) {
      Hue.change_room_name(name)
    }
  })

  let topic = Hue.el(`#admin_topic`)

  Hue.ev(topic, `blur`, () => {
    let t = Hue.utilz.single_space(topic.value)

    if (t === ``) {
      topic.value = Hue.topic
      return
    }

    if (t !== Hue.topic) {
      Hue.change_topic(t)
    }
  })

  let background = Hue.el(`#admin_background`)

  Hue.ev(background, `error`, () => {
    if (background.src !== Hue.config.background_loading_url) {
      background.src = Hue.config.background_loading_url
    }
  })

  Hue.ev(Hue.el(`#room_config_more_admin_activity`), `click`, () => {
    Hue.request_admin_activity()
  })

  Hue.ev(Hue.el(`#room_config_more_admin_list`), `click`, () => {
    Hue.request_admin_list()
  })

  Hue.ev(Hue.el(`#room_config_more_ban_list`), `click`, () => {
    Hue.request_ban_list()
  })

  Hue.ev(Hue.el(`#admin_background`), `click`, () => {
    Hue.msg_background_select.show()
  })

  Hue.ev(Hue.el(`#admin_theme_picker`), `click`, () => {
    Hue.show_theme_picker()
  })

  Hue.setup_background_select()
  Hue.setup_link_background()
  Hue.setup_theme_picker()
}

// Shows the room config
Hue.show_room_config = () => {
  Hue.msg_room_config.show()
}

// Configures the room config
// Updates all widgets with current state
Hue.config_room_config = () => {
  if (Hue.is_admin_or_op()) {
    Hue.config_admin_background_color()
    Hue.config_admin_background()
    Hue.config_admin_text_color()
    Hue.config_admin_room_name()
    Hue.config_admin_topic()
  }
}

// Updates the background image widget in the room config based on current state
Hue.config_admin_background = () => {
  if (!Hue.is_admin_or_op()) {
    return
  }

  if (Hue.background) {
    Hue.el(`#admin_background`).src = Hue.background
  }
  else {
    Hue.el(`#admin_background`).src = Hue.config.background_loading_url
  }
}

// Updates the text color widget in the room config based on current state
Hue.config_admin_text_color = () => {
  if (!Hue.is_admin_or_op()) {
    return
  }

  Hue.el(`#admin_text_color`).value = Hue.text_color
}

// Updates the background color widget in the room config based on current state
Hue.config_admin_background_color = () => {
  if (!Hue.is_admin_or_op()) {
    return
  }

  Hue.el(`#admin_background_color`).value = Hue.background_color
}

// Updates the room name widget in the room config based on current state
Hue.config_admin_room_name = () => {
  if (!Hue.is_admin_or_op()) {
    return
  }

  Hue.el(`#admin_room_name`).value = Hue.room_name
}

// Updates the topic widget in the room config based on current state
Hue.config_admin_topic = () => {
  if (!Hue.is_admin_or_op()) {
    return
  }

  Hue.el(`#admin_topic`).value = Hue.topic
}

// Setup background select
Hue.setup_background_select = () => {
  Hue.ev(Hue.el(`#background_select_draw`), `click`, () => {
    Hue.open_draw_image(`background`)
  })

  Hue.ev(Hue.el(`#background_select_random`), `click`, () => {
    Hue.make_random_image(`background`)
  })

  Hue.ev(Hue.el(`#background_select_link`), `click`, () => {
    Hue.open_link_background()
  })

  Hue.ev(Hue.el(`#background_select_remove`), `click`, () => {
    Hue.show_confirm(`Remove the current background`, () => {
      Hue.change_background_source(``)
    })
  })

  Hue.ev(Hue.el(`#background_select_upload`), `click`, () => {
    Hue.open_background_picker()
  })
}

// Setup background input
Hue.setup_link_background = () => {
  Hue.ev(Hue.el(`#link_background_submit`), `click`, () => {
    Hue.link_background_action()
  })
}

// Setup background input
Hue.open_link_background = () => {
  Hue.el(`#link_background_input`).value = ``
  Hue.msg_link_background.show(() => {
    Hue.el(`#link_background_input`).focus()
  })
}