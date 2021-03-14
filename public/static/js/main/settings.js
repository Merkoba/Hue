// User settings object
// Used to generate settings
// And to declare what widget is used in the settings windows
Hue.user_settings = {
  highlight_current_username: {
    widget_type: "checkbox",
    description: `Whether messages containing the user's username must be highlighted`,
    action: (save = true) => {
      Hue.settings.highlight_current_username = $(
        `#settings_highlight_current_username`
      ).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  case_insensitive_username_highlights: {
    widget_type: "checkbox",
    description: `Whether username highlight checks are case insensitive or not`,
    action: (save = true) => {
      Hue.settings.case_insensitive_username_highlights = $(
        `#settings_case_insensitive_username_highlights`
      ).prop("checked")

      Hue.generate_mentions_regex()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  open_whispers_automatically: {
    widget_type: "checkbox",
    description: `Whether messages received should open in a window automatically`,
    action: (save = true) => {
      Hue.settings.open_whispers_automatically = $(`#settings_open_whispers_automatically`).prop(
        "checked"
      )

      if (save) {
        Hue.save_settings()
      }
    },
  },
  warn_before_closing: {
    widget_type: "checkbox",
    description: `Show a confirmation message in some cases when the client is going to be closed or refreshed`,
    action: (save = true) => {
      Hue.settings.warn_before_closing = $(`#settings_warn_before_closing`).prop(
        "checked"
      )

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_image_previews: {
    widget_type: "checkbox",
    description: `Whether to show image previews on certain chat image links`,
    action: (save = true) => {
      Hue.settings.show_image_previews = $(`#settings_show_image_previews`).prop(
        "checked"
      )

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_link_previews: {
    widget_type: "checkbox",
    description: `Whether to show related information of chat links when available`,
    action: (save = true) => {
      Hue.settings.show_link_previews = $(`#settings_show_link_previews`).prop(
        "checked"
      )

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_highlight_notifications: {
    widget_type: "checkbox",
    description: `Whether to show desktop notifications on highlights`,
    action: (save = true) => {
      Hue.settings.show_highlight_notifications = $(`#settings_show_highlight_notifications`).prop(
        "checked"
      )

      if (save) {
        Hue.save_settings()
      }
    },
  },
  show_activity_notifications: {
    widget_type: "checkbox",
    description: `Whether to show desktop notifications on activity after your last message`,
    action: (save = true) => {
      Hue.settings.show_activity_notifications = $(`#settings_show_activity_notifications`).prop(
        "checked"
      )

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
  let item = $(`#settings_${setting_name}`)

  if (widget_type === "checkbox") {
    item.prop("checked", Hue.settings[setting_name])
  } else if (
    widget_type === "textarea" ||
    widget_type === "text" ||
    widget_type === "number" ||
    widget_type === "range" ||
    widget_type === "color"
  ) {
    item.val(Hue.settings[setting_name])
  } else if (widget_type === "select") {
    item.find("option").each(function () {
      if ($(this).val() == Hue.settings[setting_name]) {
        $(this).prop("selected", true)
      }
    })
  }
}

// Starts listeners for settings windows widgets's change
Hue.start_settings_widgets_listeners = function () {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    let item = $(`#settings_${key}`)

    if (
      setting.widget_type === "checkbox" ||
      setting.widget_type === "select"
    ) {
      item.change(() => setting.action())
    } else if (
      setting.widget_type === "textarea" ||
      setting.widget_type === "text"
    ) {
      item.blur(() => setting.action())
    } else if (
      setting.widget_type === "number" ||
      setting.widget_type === "color"
    ) {
      item.change(() => setting.action())
    } else if (setting.widget_type === "range") {
      item.on("input change", function () {
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

// Confirm if the user wants to reset the settings
Hue.confirm_reset_settings = function () {
  if (
    confirm("Are you sure you want to reset the settings to their initial state?")
  ) {
    Hue.reset_settings()
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
  Hue.prepare_media_settings()
}

// Show the settings window
Hue.show_settings = function (filter = false) {
  Hue.msg_settings.show(function () {
    if (filter) {
      $("#settings_filter").val(filter)
      Hue.do_modal_filter()
    }
  })
}

// Setup the settings windows
Hue.setup_settings_windows = function () {
  Hue.setup_setting_elements()
  Hue.set_user_settings_titles()
}

// Sets up more settings elements
Hue.setup_setting_elements = function () {
  Hue.setup_togglers("settings")
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
    $(`#settings_${key}`).closest(".settings_item").attr("title", title)
  }
}

// Apply media percentages and positions
Hue.prepare_media_settings = function () {
  Hue.apply_media_percentages()
  Hue.apply_media_positions()
}

// Makes a setting invisible
Hue.hide_setting = function (name) {
  $(`#settings_${name}`)
    .closest(".settings_item")
    .css("display", "none").addClass("hidden_setting")
}

// Makes a setting visible
Hue.unhide_setting = function (name) {
  $(`#settings_${name}`)
    .closest(".settings_item")
    .css("display", "block").removeClass("hidden_setting")
}