// Setups change events for the room config widgets
App.setup_room_config = () => {
  App.ev(App.el(`#admin_background_color`), `change`, () => {
    App.apply_theme_controls()
  })

  App.ev(App.el(`#admin_text_color`), `change`, () => {
    App.apply_theme_controls()
  })

  let room_name = App.el(`#admin_room_name`)

  App.ev(room_name, `blur`, () => {
    let name = App.utilz.single_space(room_name.value)

    if (name === ``) {
      room_name.value = App.room_name
      return
    }

    if (name !== App.room_name) {
      App.change_room_name(name)
    }
  })

  let topic = App.el(`#admin_topic`)

  App.ev(topic, `blur`, () => {
    let t = App.utilz.single_space(topic.value)

    if (t === ``) {
      topic.value = App.topic
      return
    }

    if (t !== App.topic) {
      App.change_topic(t)
    }
  })

  let background = App.el(`#admin_background`)

  App.ev(background, `error`, () => {
    if (background.src !== App.config.background_loading_url) {
      background.src = App.config.background_loading_url
    }
  })

  App.ev(App.el(`#room_config_more_admin_activity`), `click`, () => {
    App.request_admin_activity()
  })

  App.ev(App.el(`#room_config_more_admin_list`), `click`, () => {
    App.request_admin_list()
  })

  App.ev(App.el(`#room_config_more_ban_list`), `click`, () => {
    App.request_ban_list()
  })

  App.ev(App.el(`#admin_background`), `click`, () => {
    App.msg_background_select.show()
  })

  App.ev(App.el(`#admin_theme_picker`), `click`, () => {
    App.show_theme_picker()
  })

  App.setup_background_select()
  App.setup_link_background()
  App.setup_theme_picker()
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

// Updates the background image widget in the room config based on current state
App.config_admin_background = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (App.background) {
    App.el(`#admin_background`).src = App.background
  }
  else {
    App.el(`#admin_background`).src = App.config.background_loading_url
  }
}

// Updates the text color widget in the room config based on current state
App.config_admin_text_color = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.el(`#admin_text_color`).value = App.text_color
}

// Updates the background color widget in the room config based on current state
App.config_admin_background_color = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.el(`#admin_background_color`).value = App.background_color
}

// Updates the room name widget in the room config based on current state
App.config_admin_room_name = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.el(`#admin_room_name`).value = App.room_name
}

// Updates the topic widget in the room config based on current state
App.config_admin_topic = () => {
  if (!App.is_admin_or_op()) {
    return
  }

  App.el(`#admin_topic`).value = App.topic
}

// Setup background select
App.setup_background_select = () => {
  App.ev(App.el(`#background_select_draw`), `click`, () => {
    App.open_draw_image(`background`)
  })

  App.ev(App.el(`#background_select_random`), `click`, () => {
    App.make_random_image(`background`)
  })

  App.ev(App.el(`#background_select_link`), `click`, () => {
    App.open_link_background()
  })

  App.ev(App.el(`#background_select_remove`), `click`, () => {
    App.show_confirm(`Remove the current background`, () => {
      App.change_background_source(``)
    })
  })

  App.ev(App.el(`#background_select_upload`), `click`, () => {
    App.open_background_picker()
  })
}

// Setup background input
App.setup_link_background = () => {
  App.ev(App.el(`#link_background_submit`), `click`, () => {
    App.link_background_action()
  })
}

// Setup background input
App.open_link_background = () => {
  App.el(`#link_background_input`).value = ``
  App.msg_link_background.show(() => {
    App.el(`#link_background_input`).focus()
  })
}