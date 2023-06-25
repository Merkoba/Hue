// User settings object
// Used to generate settings
// And to declare what widget is used in the settings windows
App.user_settings = {
  show_background: {
    widget_type: `checkbox`,
    description: `Whether to show the room's background image`,
    actions: () => {
      App.apply_background()
    },
    version: 1,
  },
  highlight_current_username: {
    widget_type: `checkbox`,
    description: `Whether messages containing the user's username must be highlighted`,
    actions: () => {},
    version: 1,
  },
  case_insensitive_username_highlights: {
    widget_type: `checkbox`,
    description: `Whether username highlight checks are case insensitive or not`,
    actions: () => {
      App.generate_mentions_regex()
    },
    version: 1,
  },
  open_whispers_automatically: {
    widget_type: `checkbox`,
    description: `Whether messages received should open in a window automatically`,
    actions: () => {},
    version: 1,
  },
  embed_images: {
    widget_type: `checkbox`,
    description: `Whether to embed other images automatically`,
    actions: () => {},
    version: 1,
  },
  show_link_previews: {
    widget_type: `checkbox`,
    description: `Whether to show related information of chat links when available`,
    actions: () => {},
    version: 1,
  },
  show_highlight_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show desktop notifications on highlights`,
    actions: () => {},
    version: 1,
  },
  show_activity_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show desktop notifications on activity after your last message`,
    actions: () => {},
    version: 1,
  },
  show_user_join_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show notifications when users join`,
    actions: () => {},
    version: 1,
  },
  show_user_leave_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show notifications when users leave`,
    actions: () => {},
    version: 1,
  },
  show_linksbar: {
    widget_type: `checkbox`,
    description: `Whether to show the Links Bar or not`,
    actions: () => {
      App.check_linksbar()
      App.fix_frames()
    },
    version: 1,
  },
  autoplay: {
    widget_type: `checkbox`,
    description: `Whether to autoplay media after changing it`,
    actions: () => {},
    version: 1,
  },
  font: {
    widget_type: `select`,
    description: `Which font to use`,
    actions: () => {
      App.apply_theme()
    },
    version: 1,
  },
  chat_font_size: {
    widget_type: `select`,
    description: `The size of the chat font`,
    actions: () => {
      App.apply_theme()
    },
    version: 1,
  },
  chat_size: {
    widget_type: `select`,
    description: `The size of the chat relative to media`,
    actions: () => {
      App.apply_media_percentages()
      App.fix_frames()
    },
    version: 1,
  },
  main_layout: {
    widget_type: `select`,
    description: `The type of main layout`,
    actions: () => {
      App.apply_media_percentages()
      App.fix_frames()
    },
    version: 1,
  },
  media_layout: {
    widget_type: `select`,
    description: `The type of media layout`,
    actions: () => {
      App.change_media_layout()
      App.apply_media_percentages()
      App.fix_frames()
    },
    version: 1,
  },
  tv_size: {
    widget_type: `select`,
    description: `The size of the tv relative to the image`,
    actions: () => {
      App.apply_media_percentages()
      App.fix_frames()
    },
    version: 1,
  },
  tv_position: {
    widget_type: `select`,
    description: `The position of the tv relative to the image`,
    actions: () => {
      App.apply_media_positions()
      App.fix_frames()
    },
    version: 1,
  },
  show_chat: {
    widget_type: `checkbox`,
    description: `Whether to show the chat at all`,
    actions: () => {
      App.check_show_chat()
      App.fix_frames()
    },
    version: 1,
  },
  show_media_info: {
    widget_type: `checkbox`,
    description: `Whether to show info under media`,
    actions: () => {
      App.check_media_info()
      App.fix_frames()
    },
    version: 1,
  },
  date_format: {
    widget_type: `select`,
    description: `What date format to use in chat messages`,
    actions: () => {
      App.update_date()
    },
    version: 1,
  },
  radio_auto_minutes: {
    widget_type: `select`,
    force_int: true,
    description: `Change the radio after these minutes`,
    actions: () => {},
    version: 1,
  },
}

// Gets the settings localStorage object
App.get_settings = () => {
  let settings_all = App.get_local_storage(App.ls_settings)

  if (settings_all === null) {
    settings_all = {}
  }

  App.settings = settings_all[App.room_id]

  if (!App.settings) {
    App.settings = {}
  }

  let changed = false

  function set_default (setting) {
    App.settings[setting].value = App.default_setting_string
    App.settings[setting].version = App.user_settings[setting].version
  }

  for (let setting in App.user_settings) {
    // Fill defaults
    if (App.settings[setting] === undefined ||
      App.settings[setting].value === undefined)
    {
      App.loginfo(`Stor: Adding setting: ${setting}`)
      App.settings[setting] = {}
      set_default(setting)
      changed = true
    }
  }

  for (let setting in App.settings) {
    // Remove unused settings
    if (App.user_settings[setting] === undefined) {
      App.loginfo(`Stor: Deleting setting: ${setting}`)
      delete App.settings[setting]
      changed = true
    }
    // Check new version
    else if (App.settings[setting].version !== App.user_settings[setting].version) {
      App.loginfo(`Stor: Upgrading setting: ${setting}`)
      set_default(setting)
      changed = true
    }
  }

  if (changed) {
    App.save_settings()
  }
}

// Saves the settings localStorage object
App.save_settings = (force = false) => {
  let settings_all = App.get_local_storage(App.ls_settings)

  if (settings_all === null) {
    settings_all = {}
  }

  settings_all[App.room_id] = App.settings
  App.save_local_storage(App.ls_settings, settings_all, force)
}

// Starts the settings windows widgets with current state
App.start_settings_widgets = () => {
  for (let setting in App.user_settings) {
    App.modify_setting_widget(setting)
  }
}

// Updates a setting widget based on the setting state
App.modify_setting_widget = (setting_name) => {
  let widget_type = App.user_settings[setting_name].widget_type
  let item = DOM.el(`#settings_${setting_name}`)

  if (widget_type === `checkbox`) {
    item.checked = App.get_setting(setting_name)
  }
  else if (widget_type === `select`) {
    App.set_select(item, App.get_setting(setting_name))
  }
}

App.set_select = (select, option) => {
  for (let el of DOM.els(`option`, select)) {
    if (el.value == option) {
      el.selected = true
    }
  }
}

// Starts listeners for settings windows widgets's change
App.start_settings_widgets_listeners = () => {
  for (let setting in App.user_settings) {
    let user_setting = App.user_settings[setting]
    let item = DOM.el(`#settings_${setting}`)

    if (
      user_setting.widget_type === `checkbox` ||
      user_setting.widget_type === `select`
    ) {
      DOM.ev(item, `change`, () => {
        App.on_setting_change(setting)
      })
    }
    else if (
      user_setting.widget_type === `textarea` ||
      user_setting.widget_type === `text`
    ) {
      DOM.ev(item, `blur`, () => {
        App.on_setting_change(setting)
      })
    }
    else if (
      user_setting.widget_type === `number` ||
      user_setting.widget_type === `color`
    ) {
      DOM.ev(item, `change`, () => {
        App.on_setting_change(setting)
      })
    }
    else if (user_setting.widget_type === `range`) {
      DOM.ev(item, `input change`, () => {
        App.on_setting_change(setting)
      })
    }
  }
}

App.on_setting_change = (setting) => {
  let user_setting = App.user_settings[setting]
  let el = DOM.el(`#settings_${setting}`)

  if (user_setting.widget_type === `checkbox`) {
    value = el.checked
  }
  else if (user_setting.widget_type === `select`) {
    value = el.value
  }

  if (user_setting.force_int) {
    value = parseInt(value)
  }

  App.set_setting(setting, value)
  App.save_settings()
  user_setting.actions()
}

// Reset the settings of a certain type
App.reset_settings = (empty = true) => {
  if (empty) {
    App.settings = {}
    App.save_settings(true)
  }

  App.get_settings()
  App.start_settings_widgets()

  // Run all actions
  App.apply_background()
  App.generate_mentions_regex()
  App.check_linksbar()
  App.check_show_chat()
  App.change_media_layout()
  App.apply_media_positions()
  App.apply_media_percentages()
  App.check_media_info()
  App.update_date()
  App.fix_frames()
  App.apply_theme()
}

// Show the settings window
App.show_settings = (filter = ``) => {
  App.msg_settings.show()

  if (filter.trim()) {
    DOM.el(`#settings_filter`).value = filter
    App.do_modal_filter()
  }
}

// Setup the settings windows
App.setup_settings_windows = () => {
  App.set_user_settings_titles()

  DOM.ev(DOM.el(`#settings_notifications`), `click`, () => {
    App.request_desktop_notifications_permission()
  })

  DOM.ev(DOM.el(`#settings_defaults`), `click`, () => {
    App.show_confirm(`Restore default settings`, () => {
      App.reset_settings()
    })
  })

  DOM.ev(DOM.el(`#settings_container`), `contextmenu`, (e) => {
    let item = e.target.closest(`.settings_item`)

    if (item) {
      App.reset_single_setting(item)
    }

    e.preventDefault()
  })
}

App.reset_single_setting = (item) => {
  let setting = item.dataset.setting
  let user_setting = App.user_settings[setting]
  let control = DOM.el(`.settings_item_control`, item)

  if (user_setting.widget_type === `select`) {
    App.set_select(control, App.get_default_setting(setting))
  }
  else if (user_setting.widget_type === `checkbox`) {
    control.checked = App.get_default_setting(setting)
  }

  App.set_setting(setting, App.default_setting_string)
  user_setting.actions()
}

// Get default setting
App.get_default_setting = (setting) => {
  return App.config[`settings_default_${setting}`]
}

// Setting getter
App.get_setting = (setting) => {
  let value = App.settings[setting].value

  if (value === App.default_setting_string) {
    value = App.get_default_setting(setting)
  }

  return value
}

// Set a setting
App.set_setting = (setting, value) => {
  App.settings[setting].value = value
  App.save_settings()
}

// Sets the hover titles for the setttings widgets
App.set_user_settings_titles = () => {
  for (let setting in App.user_settings) {
    let user_setting = App.user_settings[setting]
    let value = App.get_default_setting(setting)

    if (typeof value === `string`) {
      value = `"${value}"`
    }

    let title = `${user_setting.description} (${setting}) (Default: ${value})`
    DOM.el(`#settings_${setting}`).closest(`.settings_item`).title = title
  }
}

App.create_settings_percentages = () => {
  let html = ``

  for (let p = App.media_max_percentage; p >= App.media_min_percentage; p -= 5) {
    html += `<option value='${p}'>${p}%</option>`
  }

  return html
}

App.create_settings_font_sizes = () => {
  let html = ``
  let size = App.max_chat_font_size

  while (size >= App.min_chat_font_size) {
    let n = App.utilz.round(size, 1)
    html += `<option value='${n}'>${n}x</option>`
    size = App.utilz.round(size - 0.1, 1)
  }

  return html
}