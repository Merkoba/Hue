// User settings object
// Used to generate settings
// And to declare what widget is used in the settings windows
App.user_settings = {
  show_background: {
    widget_type: `checkbox`,
    description: `Whether to show the room's background image`,
    action: (save = true) => {
      App.settings.show_background = App.el(
        `#settings_show_background`
      ).checked

      if (save) {
        App.save_settings()
      }

      App.apply_background()
    },
  },
  highlight_current_username: {
    widget_type: `checkbox`,
    description: `Whether messages containing the user's username must be highlighted`,
    action: (save = true) => {
      App.settings.highlight_current_username = App.el(
        `#settings_highlight_current_username`
      ).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  case_insensitive_username_highlights: {
    widget_type: `checkbox`,
    description: `Whether username highlight checks are case insensitive or not`,
    action: (save = true) => {
      App.settings.case_insensitive_username_highlights = App.el(
        `#settings_case_insensitive_username_highlights`
      ).checked

      App.generate_mentions_regex()

      if (save) {
        App.save_settings()
      }
    },
  },
  open_whispers_automatically: {
    widget_type: `checkbox`,
    description: `Whether messages received should open in a window automatically`,
    action: (save = true) => {
      App.settings.open_whispers_automatically = App.el(`#settings_open_whispers_automatically`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  embed_images: {
    widget_type: `checkbox`,
    description: `Whether to embed other images automatically`,
    action: (save = true) => {
      App.settings.embed_images = App.el(`#settings_embed_images`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  show_link_previews: {
    widget_type: `checkbox`,
    description: `Whether to show related information of chat links when available`,
    action: (save = true) => {
      App.settings.show_link_previews = App.el(`#settings_show_link_previews`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  show_highlight_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show desktop notifications on highlights`,
    action: (save = true) => {
      App.settings.show_highlight_notifications = App.el(`#settings_show_highlight_notifications`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  show_activity_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show desktop notifications on activity after your last message`,
    action: (save = true) => {
      App.settings.show_activity_notifications = App.el(`#settings_show_activity_notifications`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  show_user_join_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show notifications when users join`,
    action: (save = true) => {
      App.settings.show_user_join_notifications = App.el(`#settings_show_user_join_notifications`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  show_user_leave_notifications: {
    widget_type: `checkbox`,
    description: `Whether to show notifications when users leave`,
    action: (save = true) => {
      App.settings.show_user_leave_notifications = App.el(`#settings_show_user_leave_notifications`).checked

      if (save) {
        App.save_settings()
      }
    },
  },
  show_linksbar: {
    widget_type: `checkbox`,
    description: `Whether to show the Links Bar or not`,
    action: (save = true) => {
      App.settings.show_linksbar = App.el(`#settings_show_linksbar`).checked
      App.check_linksbar()

      if (save) {
        App.save_settings()
      }
    },
  }
}

// Gets the settings localStorage object
App.get_settings = () => {
  App.settings = App.get_local_storage(App.ls_settings)

  if (App.settings === null) {
    App.settings = {}
  }

  let changed = false

  for (let setting in App.user_settings) {
    if (App.settings[setting] === undefined) {
      App.settings[setting] =
        App.config[`settings_default_${setting}`]
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
  let item = App.el(`#settings_${setting_name}`)

  if (widget_type === `checkbox`) {
    item.checked = App.settings[setting_name]
  }
  else if (
    widget_type === `textarea` ||
    widget_type === `text` ||
    widget_type === `number` ||
    widget_type === `range` ||
    widget_type === `color`
  ) {
    item.value = App.settings[setting_name]
  }
  else if (widget_type === `select`) {
    for (let el of App.els(`option`, item)) {
      if (el.value == App.settings[setting_name]) {
        el.selected = true
      }
    }
  }
}

// Starts listeners for settings windows widgets's change
App.start_settings_widgets_listeners = () => {
  for (let key in App.user_settings) {
    let setting = App.user_settings[key]
    let item = App.el(`#settings_${key}`)

    if (
      setting.widget_type === `checkbox` ||
      setting.widget_type === `select`
    ) {
      App.ev(item, `change`, () => setting.action())
    }
    else if (
      setting.widget_type === `textarea` ||
      setting.widget_type === `text`
    ) {
      App.ev(item, `blur`, () => setting.action())
    }
    else if (
      setting.widget_type === `number` ||
      setting.widget_type === `color`
    ) {
      App.ev(item, `change`, () => setting.action())
    }
    else if (setting.widget_type === `range`) {
      App.ev(item, `input change`, () => {
        setting.action()
      })
    }
  }
}

// Executes all settings action functions
App.call_setting_actions = (save = true) => {
  for (let key in App.user_settings) {
    let setting = App.user_settings[key]
    setting.action(save)
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
  App.call_setting_actions(false)
  App.call_setting_actions(false)
}

// Show the settings window
App.show_settings = (filter = ``) => {
  App.msg_settings.show(() => {
    if (filter.trim()) {
      App.el(`#settings_filter`).value = filter
      App.do_modal_filter()
    }
  })
}

// Setup the settings windows
App.setup_settings_windows = () => {
  App.set_user_settings_titles()

  App.ev(App.el(`#settings_notifications`), `click`, () => {
    App.request_desktop_notifications_permission()
  })

  App.ev(App.el(`#settings_defaults`), `click`, () => {
    App.show_confirm(`Restore default settings`, () => {
      App.reset_settings()
    })
  })
}

// Setting getter
App.get_setting = (name) => {
  return App.settings[name]
}

// Sets the hover titles for the setttings widgets
App.set_user_settings_titles = () => {
  for (let key in App.user_settings) {
    let setting = App.user_settings[key]
    let value = App.config[`settings_default_${key}`]

    if (typeof value === `string`) {
      value = `"${value}"`
    }

    let title = `${setting.description} (${key}) (Default: ${value})`
    App.el(`#settings_${key}`).closest(`.settings_item`).title = title
  }
}