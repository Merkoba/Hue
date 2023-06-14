// User settings object
// Used to generate settings
// And to declare what widget is used in the settings windows
App.user_settings = {
  show_background: {
    widget_type: `checkbox`,
    description: `Whether to show the room's background image`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_background`, DOM.el(`#settings_show_background`).checked)
        App.save_settings()
      }

      App.apply_background()
    },
    version: 1,
  },
  highlight_current_username: {
    widget_type: `checkbox`,
    description: `Whether messages containing the user's username must be highlighted`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`highlight_current_username`, DOM.el(`#settings_highlight_current_username`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  case_insensitive_username_highlights: {
    widget_type: `checkbox`,
    description: `Whether username highlight checks are case insensitive or not`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`case_insensitive_username_highlights`, DOM.el(`#settings_case_insensitive_username_highlights`).checked)
        App.save_settings()
      }

      App.generate_mentions_regex()
    },
    version: 1,
  },
  open_whispers_automatically: {
    widget_type: `checkbox`,
    description: `Whether messages received should open in a window automatically`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`open_whispers_automatically`, DOM.el(`#settings_open_whispers_automatically`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  embed_images: {
    widget_type: `checkbox`,
    description: `Whether to embed other images automatically`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`embed_images`, DOM.el(`#settings_embed_images`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  show_link_previews: {
    widget_type: `checkbox`,
    description: `Whether to show related information of chat links when available`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_link_previews`, DOM.el(`#settings_show_link_previews`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  show_highlight_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show desktop notifications on highlights`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_highlight_notifications`, DOM.el(`#settings_show_highlight_notifications`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  show_activity_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show desktop notifications on activity after your last message`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_activity_notifications`, DOM.el(`#settings_show_activity_notifications`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  show_user_join_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show notifications when users join`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_user_join_notifications`, DOM.el(`#settings_show_user_join_notifications`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  show_user_leave_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show notifications when users leave`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_user_leave_notifications`, DOM.el(`#settings_show_user_leave_notifications`).checked)
        App.save_settings()
      }
    },
    version: 1,
  },
  show_linksbar: {
    widget_type: `checkbox`,
    description: `Whether to show the Links Bar or not`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`show_linksbar`, DOM.el(`#settings_show_linksbar`).checked)
        App.save_settings()
      }

      App.check_linksbar()
    },
    version: 1,
  },
  font: {
    widget_type: `select`,
    description: `Which font to use`,
    action: (save = true) => {
      if (save) {
        App.set_setting(`font`, DOM.el(`#settings_font`).value)
        App.save_settings()
      }

      App.apply_theme()
    },
    version: 1,
  },
}

// Gets the settings localStorage object
App.get_settings = () => {
  let changed = false
  App.settings = App.get_local_storage(App.ls_settings)

  if (!App.settings) {
    App.settings = {}
    changed = true
  }

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
  App.save_local_storage(App.ls_settings, App.settings, force)
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
  else if (
    widget_type === `textarea` ||
    widget_type === `text` ||
    widget_type === `number` ||
    widget_type === `range` ||
    widget_type === `color`
  ) {
    item.value = App.get_setting(setting_name)
  }
  else if (widget_type === `select`) {
    for (let el of DOM.els(`option`, item)) {
      if (el.value == App.get_setting(setting_name)) {
        el.selected = true
      }
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
      DOM.ev(item, `change`, () => user_setting.action())
    }
    else if (
      user_setting.widget_type === `textarea` ||
      user_setting.widget_type === `text`
    ) {
      DOM.ev(item, `blur`, () => user_setting.action())
    }
    else if (
      user_setting.widget_type === `number` ||
      user_setting.widget_type === `color`
    ) {
      DOM.ev(item, `change`, () => user_setting.action())
    }
    else if (user_setting.widget_type === `range`) {
      DOM.ev(item, `input change`, () => {
        user_setting.action()
      })
    }
  }
}

// Executes all settings action functions
App.call_setting_actions = (save = false) => {
  for (let setting in App.user_settings) {
    let user_setting = App.user_settings[setting]
    user_setting.action(save)
  }
}

// Reset the settings of a certain type
App.reset_settings = (empty = true) => {
  if (empty) {
    App.settings = {}
    App.save_settings(true)
  }

  App.get_settings()
  App.start_settings_widgets()
  App.call_setting_actions()
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