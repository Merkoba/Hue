// User settings object
// Used to generate settings
// And to declare what widget is used in the settings windows
Hue.user_settings = {
  highlight_current_username: {
    widget_type: "checkbox",
    description: "Whether messages containing the user's username must be highlighted",
    action: (save = true) => {
      Hue.settings.highlight_current_username = Hue.el(
        "#settings_highlight_current_username"
      ).checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  case_insensitive_username_highlights: {
    widget_type: "checkbox",
    description: "Whether username highlight checks are case insensitive or not",
    action: (save = true) => {
      Hue.settings.case_insensitive_username_highlights = Hue.el(
        "#settings_case_insensitive_username_highlights"
      ).checked

      Hue.generate_mentions_regex()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  open_whispers_automatically: {
    widget_type: "checkbox",
    description: "Whether messages received should open in a window automatically",
    action: (save = true) => {
      Hue.settings.open_whispers_automatically = Hue.el("#settings_open_whispers_automatically").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  embed_images: {
    widget_type: "checkbox",
    description: "Whether to embed other images automatically",
    action: (save = true) => {
      Hue.settings.embed_images = Hue.el("#settings_embed_images").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_link_previews: {
    widget_type: "checkbox",
    description: "Whether to show related information of chat links when available",
    action: (save = true) => {
      Hue.settings.show_link_previews = Hue.el("#settings_show_link_previews").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_highlight_notifications: {
    widget_type: "checkbox",
    description: "Whether to show desktop notifications on highlights",
    action: (save = true) => {
      Hue.settings.show_highlight_notifications = Hue.el("#settings_show_highlight_notifications").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_activity_notifications: {
    widget_type: "checkbox",
    description: "Whether to show desktop notifications on activity after your last message",
    action: (save = true) => {
      Hue.settings.show_activity_notifications = Hue.el("#settings_show_activity_notifications").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_user_join_notifications: {
    widget_type: "checkbox",
    description: "Whether to show notifications when users join",
    action: (save = true) => {
      Hue.settings.show_user_join_notifications = Hue.el("#settings_show_user_join_notifications").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_user_leave_notifications: {
    widget_type: "checkbox",
    description: "Whether to show notifications when users leave",
    action: (save = true) => {
      Hue.settings.show_user_leave_notifications = Hue.el("#settings_show_user_leave_notifications").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  stop_radio_on_tv_play: {
    widget_type: "checkbox",
    description: "Whether to stop the radio when the tv starts playing",
    action: (save = true) => {
      Hue.settings.stop_radio_on_tv_play = Hue.el("#settings_stop_radio_on_tv_play").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  stop_tv_on_radio_play: {
    widget_type: "checkbox",
    description: "Whether to stop the tv when the radio starts playing",
    action: (save = true) => {
      Hue.settings.stop_tv_on_radio_play = Hue.el("#settings_stop_tv_on_radio_play").checked

      if (save) {
        Hue.save_settings()
      }
    },
  },
  confirm_on_close: {
    widget_type: "checkbox",
    description: "Whether to show a confirm message when closing the application",
    action: (save = true) => {
      Hue.settings.confirm_on_close = Hue.el("#settings_confirm_on_close").checked

      if (save) {
        Hue.save_settings()
      }
    },
  }
}

// Gets the settings localStorage object
Hue.get_settings = function () {
  Hue.settings = Hue.get_local_storage(Hue.ls_settings)

  if (Hue.settings === null) {
    Hue.settings = {}
  }

  let changed = false

  for (let setting in Hue.user_settings) {
    if (Hue.settings[setting] === undefined) {
      Hue.settings[setting] =
        Hue.config[`settings_default_${setting}`]
      changed = true
    }
  }

  if (changed) {
    Hue.save_settings()
  }
}

// Saves the settings localStorage object
Hue.save_settings = function (force = false) {
  Hue.save_local_storage(Hue.ls_settings, Hue.settings, force)
}

// Starts the settings windows widgets with current state
Hue.start_settings_widgets = function () {
  for (let setting in Hue.user_settings) {
    Hue.modify_setting_widget(setting)
  }
}

// Updates a setting widget based on the setting state
Hue.modify_setting_widget = function (setting_name) {
  let widget_type = Hue.user_settings[setting_name].widget_type
  let item = Hue.el(`#settings_${setting_name}`)

  if (widget_type === "checkbox") {
    item.checked = Hue.settings[setting_name]
  } else if (
    widget_type === "textarea" ||
    widget_type === "text" ||
    widget_type === "number" ||
    widget_type === "range" ||
    widget_type === "color"
  ) {
    item.value = Hue.settings[setting_name]
  } else if (widget_type === "select") {
    Hue.els("option", item).forEach(it => {
      if (it.value == Hue.settings[setting_name]) {
        it.selected = true
      }
    })
  }
}

// Starts listeners for settings windows widgets's change
Hue.start_settings_widgets_listeners = function () {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    let item = Hue.el(`#settings_${key}`)

    if (
      setting.widget_type === "checkbox" ||
      setting.widget_type === "select"
    ) {
      Hue.ev(item, "change", () => setting.action())
    } else if (
      setting.widget_type === "textarea" ||
      setting.widget_type === "text"
    ) {
      Hue.ev(item, "blur", () => setting.action())
    } else if (
      setting.widget_type === "number" ||
      setting.widget_type === "color"
    ) {
      Hue.ev(item, "change", () => setting.action())
    } else if (setting.widget_type === "range") {
      Hue.ev(item, "input change", function () {
        setting.action()
      })
    }
  }
}

// Executes all settings action functions
Hue.call_setting_actions = function (save = true) {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    setting.action(save)
  }
}

// Reset the settings of a certain type
Hue.reset_settings = function (empty = true) {
  if (empty) {
    Hue.settings = {}
    Hue.save_settings(true)
  }
  
  Hue.get_settings()
  Hue.start_settings_widgets()
  Hue.call_setting_actions(false)
  Hue.call_setting_actions(false)
}

// Show the settings window
Hue.show_settings = function (filter = "") {
  Hue.msg_settings.show(function () {
    if (filter.trim()) {
      Hue.el("#settings_filter").value = filter
      Hue.do_modal_filter()
    }
  })
}

// Setup the settings windows
Hue.setup_settings_windows = function () {
  Hue.set_user_settings_titles()

  Hue.ev(Hue.el("#settings_request_notifications"), "click", function () {
    Hue.request_desktop_notifications_permission()
  })
}

// Setting getter
Hue.get_setting = function (name) {
  return Hue.settings[name]
}

// Sets the hover titles for the setttings widgets
Hue.set_user_settings_titles = function () {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    let value = Hue.config[`settings_default_${key}`]

    if (typeof value === "string") {
      value = `"${value}"`
    }

    let title = `${setting.description} (${key}) (Default: ${value})`
    Hue.el(`#settings_${key}`).closest(".settings_item").title = title
  }
}