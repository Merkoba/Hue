// User settings object
// Used to generate global and room settings
// And to declare what widget is used in the settings windows
Hue.user_settings = {
  highlight_current_username: {
    widget_type: "checkbox",
    description: `Whether messages containing the user's username must be highlighted`,
    action: (type, save = true) => {
      Hue[type].highlight_current_username = $(
        `#${type}_highlight_current_username`
      ).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  case_insensitive_username_highlights: {
    widget_type: "checkbox",
    description: `Whether username highlight checks are case insensitive or not`,
    action: (type, save = true) => {
      Hue[type].case_insensitive_username_highlights = $(
        `#${type}_case_insensitive_username_highlights`
      ).prop("checked")

      if (
        Hue.active_settings("case_insensitive_username_highlights") === type
      ) {
        Hue.generate_mentions_regex()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  case_insensitive_words_highlights: {
    widget_type: "checkbox",
    description: `Whether 'other words' highlight checks are case insensitive or not`,
    action: (type, save = true) => {
      Hue[type].case_insensitive_words_highlights = $(
        `#${type}_case_insensitive_words_highlights`
      ).prop("checked")

      if (Hue.active_settings("case_insensitive_words_highlights") === type) {
        Hue.generate_highlight_words_regex()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  case_insensitive_ignored_words: {
    widget_type: "checkbox",
    description: `Whether 'ignored words' highlight checks are case insensitive or not`,
    action: (type, save = true) => {
      Hue[type].case_insensitive_ignored_words = $(
        `#${type}_case_insensitive_ignored_words`
      ).prop("checked")

      if (Hue.active_settings("case_insensitive_ignored_words") === type) {
        Hue.generate_ignored_words_regex()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  ignored_words_exclude_same_user: {
    widget_type: "checkbox",
    description: `Whether messages containing 'ignored words' should be ignored if coming from the user itself`,
    action: (type, save = true) => {
      Hue[type].ignored_words_exclude_same_user = $(
        `#${type}_ignored_words_exclude_same_user`
      ).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  other_words_to_highlight: {
    widget_type: "textarea",
    description: `Words on messages to trigger highlights`,
    action: (type, save = true) => {
      let words = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#${type}_other_words_to_highlight`).val())
      )

      $(`#${type}_other_words_to_highlight`).val(words)

      Hue[type].other_words_to_highlight = words

      if (Hue.active_settings("other_words_to_highlight") === type) {
        Hue.generate_highlight_words_regex()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  ignored_usernames: {
    widget_type: "textarea",
    description: `Ignore messages and actions from these users`,
    action: (type, save = true) => {
      let unames = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#${type}_ignored_usernames`).val())
      )

      $(`#${type}_ignored_usernames`).val(unames)

      Hue[type].ignored_usernames = unames

      if (Hue.active_settings("ignored_usernames") === type) {
        Hue.get_ignored_usernames_list()
        Hue.check_activity_bar()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  accept_commands_from: {
    widget_type: "textarea",
    description: `Accept remote command executions from these users`,
    action: (type, save = true) => {
      let unames = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#${type}_accept_commands_from`).val())
      )

      $(`#${type}_accept_commands_from`).val(unames)

      Hue[type].accept_commands_from = unames

      if (Hue.active_settings("ignored_usernames") === type) {
        Hue.get_accept_commands_from_list()
      }

      if (save) {
        Hue[`save_${type}`]()
      }

      if (unames) {
        Hue.feedback("Your list of users to accept commands from was modified. This is dangerous and might not have been intended.")
      }
    },
  },
  ignored_words: {
    widget_type: "textarea",
    description: `Ignore messages that contain these words`,
    action: (type, save = true) => {
      let unames = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#${type}_ignored_words`).val())
      )

      $(`#${type}_ignored_words`).val(unames)

      Hue[type].ignored_words = unames

      if (Hue.active_settings("ignored_words") === type) {
        Hue.generate_ignored_words_regex()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  open_whispers_automatically: {
    widget_type: "checkbox",
    description: `Whether messages received should open in a window automatically`,
    action: (type, save = true) => {
      Hue[type].open_whispers_automatically = $(`#${type}_open_whispers_automatically`).prop(
        "checked"
      )

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  other_words_to_autocomplete: {
    widget_type: "textarea",
    description: `Other words to be considered on Tab autocompletion`,
    action: (type, save = true) => {
      let words = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#${type}_other_words_to_autocomplete`).val())
      )

      $(`#${type}_other_words_to_autocomplete`).val(words)

      Hue[type].other_words_to_autocomplete = words

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  warn_before_closing: {
    widget_type: "checkbox",
    description: `Show a confirmation message in some cases when the client is going to be closed or refreshed`,
    action: (type, save = true) => {
      Hue[type].warn_before_closing = $(`#${type}_warn_before_closing`).prop(
        "checked"
      )

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  show_image_previews: {
    widget_type: "checkbox",
    description: `Whether to show image previews on certain chat image links`,
    action: (type, save = true) => {
      Hue[type].show_image_previews = $(`#${type}_show_image_previews`).prop(
        "checked"
      )

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  show_link_previews: {
    widget_type: "checkbox",
    description: `Whether to show related information of chat links when available`,
    action: (type, save = true) => {
      Hue[type].show_link_previews = $(`#${type}_show_link_previews`).prop(
        "checked"
      )

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  show_input_placeholder: {
    widget_type: "checkbox",
    description: `Whether information inside the input should be shown`,
    action: (type, save = true) => {
      Hue[type].show_input_placeholder = $(
        `#${type}_show_input_placeholder`
      ).prop("checked")

      Hue.update_input_placeholder()

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  autoreveal_spoilers: {
    widget_type: "checkbox",
    description: `Whether spoiler messages should be autorevealed`,
    action: (type, save = true) => {
      Hue[type].autoreveal_spoilers = $(`#${type}_autoreveal_spoilers`).prop(
        "checked"
      )

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  autoscroll_amount: {
    widget_type: "number",
    description: `Pixel amount to scroll up or down on each tick on autoscroll`,
    action: (type, save = true) => {
      let val = parseInt(
        Hue.utilz.clean_string2($(`#${type}_autoscroll_amount`).val())
      )

      if (!val) {
        val = Hue.config.global_settings_default_autoscroll_amount
      }

      $(`#${type}_autoscroll_amount`).val(val)

      Hue[type].autoscroll_amount = val

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  autoscroll_delay: {
    widget_type: "number",
    description: `Perform an autoscroll tick after these milliseconds`,
    action: (type, save = true) => {
      let val = parseInt(
        Hue.utilz.clean_string2($(`#${type}_autoscroll_delay`).val())
      )

      if (!val) {
        val = Hue.config.global_settings_default_autoscroll_delay
      }

      $(`#${type}_autoscroll_delay`).val(val)

      Hue[type].autoscroll_delay = val

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  theme_mode: {
    widget_type: "select",
    description: `It either uses the room's theme color or a custom theme color`,
    action: (type, save = true) => {
      Hue[type].theme_mode = $(`#${type}_theme_mode option:selected`).val()

      if (Hue.active_settings("theme_mode") === type) {
        Hue.apply_theme()
      }

      Hue.check_hideable_settings()

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  theme_color: {
    widget_type: "color",
    description: `The theme color to use if the user is using a custom theme mode`,
    action: (type, save = true) => {
      Hue[type].theme_color = $(`#${type}_theme_color`).val()

      if (Hue.active_settings("theme_color") === type) {
        Hue.apply_theme()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  text_color: {
    widget_type: "color",
    description: `The text color to use if the user is using a custom theme mode`,
    action: (type, save = true) => {
      Hue[type].text_color = $(`#${type}_text_color`).val()

      if (Hue.active_settings("text_color") === type) {
        Hue.apply_theme()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  background_mode: {
    widget_type: "select",
    description: `It either uses the room's background, a custom background, or no background`,
    action: (type, save = true) => {
      Hue[type].background_mode = $(
        `#${type}_background_mode option:selected`
      ).val()

      if (Hue.active_settings("background_mode") === type) {
        Hue.apply_background()
      }

      Hue.check_hideable_settings()

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  background_url: {
    widget_type: "text",
    description: `The background url to use if the user is using a custom background`,
    action: (type, save = true) => {
      let src = Hue.utilz.clean_string5(
        $(`#${type}_background_url`).val().replace(".gifv", ".gif")
      )
      $(`#${type}_background_url`).val(src)
      Hue[type].background_url = src

      if (Hue.active_settings("background_url") === type) {
        Hue.apply_background()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  background_tile_dimensions: {
    widget_type: "text",
    description: `The background url to use if the user is using a custom background`,
    action: (type, save = true) => {
      let dimensions = Hue.utilz.clean_string2(
        $(`#${type}_background_tile_dimensions`).val()
      )
      $(`#${type}_background_tile_dimensions`).val(dimensions)
      Hue[type].background_tile_dimensions = dimensions

      if (Hue.active_settings("background_tile_dimensions") === type) {
        Hue.apply_background()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  message_log: {
    widget_type: "checkbox",
    description: `Whether the user requests the message log on load`,
    action: (type, save = true) => {
      Hue[type].message_log = $(`#${type}_message_log`).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  chat_crop_limit: {
    widget_type: "number",
    description: `Crop the chat area after this many messages`,
    action: (type, save = true) => {
      let val = parseInt(
        Hue.utilz.clean_string2($(`#${type}_chat_crop_limit`).val())
      )

      if (!val) {
        val = Hue.config.global_settings_default_chat_crop_limit
      }

      $(`#${type}_chat_crop_limit`).val(val)

      Hue[type].chat_crop_limit = val

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  autoconnect: {
    widget_type: "checkbox",
    description: `Whether a user should autoconnect automatically after a socket disconnect`,
    action: (type, save = true) => {
      Hue[type].autoconnect = $(`#${type}_autoconnect`).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  popup_notifications_close_delay: {
    widget_type: "number",
    description: `How much time (ms) needs to pass before the notification popups close automatically`,
    action: (type, save = true) => {
      let delay = parseInt($(`#${type}_popup_notifications_close_delay`).val())

      if (isNaN(delay)) {
        delay =
          Hue.config.global_settings_default_popup_notifications_close_delay
      }

      $(`#${type}_popup_notifications_close_delay`).val(delay)
      Hue[type].popup_notifications_close_delay = delay

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  transparent_panels: {
    widget_type: "checkbox",
    description: `Whether panels get a slight transparency`,
    action: (type, save = true) => {
      Hue[type].transparent_panels = $(`#${type}_transparent_panels`).prop(
        "checked"
      )

      if (Hue.active_settings("transparent_panels") === type) {
        Hue.apply_theme()
      }

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  confirm_chat: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when sending a chat message`,
    action: (type, save = true) => {
      Hue[type].confirm_chat = $(`#${type}_confirm_chat`).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  confirm_image: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when changing the image`,
    action: (type, save = true) => {
      Hue[type].confirm_image = $(`#${type}_confirm_image`).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  confirm_tv: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when changing the tv`,
    action: (type, save = true) => {
      Hue[type].confirm_tv = $(`#${type}_confirm_tv`).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  },
  confirm_message_board: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when sending a board message`,
    action: (type, save = true) => {
      Hue[type].confirm_message_board = $(
        `#${type}_confirm_message_board`
      ).prop("checked")

      if (save) {
        Hue[`save_${type}`]()
      }
    },
  }
}

// Empties the global settings localStorage object
Hue.empty_global_settings = function () {
  Hue.global_settings = {}
  Hue.save_global_settings(true)
}

// Gets the global settings localStorage object
Hue.get_global_settings = function () {
  Hue.global_settings = Hue.get_local_storage(Hue.ls_global_settings)

  if (Hue.global_settings === null) {
    Hue.global_settings = {}
  }

  let changed = false

  for (let setting in Hue.user_settings) {
    if (Hue.global_settings[setting] === undefined) {
      Hue.global_settings[setting] =
        Hue.config[`global_settings_default_${setting}`]
      changed = true
    }
  }

  if (changed) {
    Hue.save_global_settings()
  }
}

// Saves the global settings localStorage object
Hue.save_global_settings = function (force = false) {
  Hue.save_local_storage(Hue.ls_global_settings, Hue.global_settings, force)
}

// Starts the settings windows widgets with current state
Hue.start_settings_widgets = function (type) {
  for (let setting in Hue.user_settings) {
    Hue.modify_setting_widget(type, setting)
  }
}

// Updates a setting widget based on the setting state
Hue.modify_setting_widget = function (type, setting_name) {
  let widget_type = Hue.user_settings[setting_name].widget_type
  let item = $(`#${type}_${setting_name}`)

  if (widget_type === "checkbox") {
    item.prop("checked", Hue[type][setting_name])
  } else if (
    widget_type === "textarea" ||
    widget_type === "text" ||
    widget_type === "number" ||
    widget_type === "range" ||
    widget_type === "color"
  ) {
    item.val(Hue[type][setting_name])
  } else if (widget_type === "select") {
    item.find("option").each(function () {
      if ($(this).val() == Hue[type][setting_name]) {
        $(this).prop("selected", true)
      }
    })
  }
}

// Starts listeners for settings windows widgets's change
Hue.start_settings_widgets_listeners = function (type) {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    let item = $(`#${type}_${key}`)

    if (
      setting.widget_type === "checkbox" ||
      setting.widget_type === "select"
    ) {
      item.change(() => setting.action(type))
    } else if (
      setting.widget_type === "textarea" ||
      setting.widget_type === "text"
    ) {
      item.blur(() => setting.action(type))
    } else if (
      setting.widget_type === "number" ||
      setting.widget_type === "color"
    ) {
      item.change(() => setting.action(type))
    } else if (setting.widget_type === "range") {
      item.on("input change", function () {
        setting.action(type)
      })
    }
  }
}

// Executes all settings action functions
Hue.call_setting_actions = function (type, save = true) {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    setting.action(type, save)
  }
}

// Empties the room settings localStorage object
Hue.empty_room_settings = function () {
  Hue.room_settings = {}
  Hue.save_room_settings(true)
}

// Gets the room settings localStorage object
// Defaults are filled with global settings
Hue.get_room_settings = function () {
  let room_settings_all = Hue.get_local_storage(Hue.ls_room_settings)

  if (room_settings_all === null) {
    room_settings_all = {}
  }

  Hue.room_settings = room_settings_all[Hue.room_id]

  if (Hue.room_settings === undefined) {
    Hue.room_settings = {}
  }

  let changed = false

  for (let key in Hue.global_settings) {
    if (Hue.room_settings[key] === undefined) {
      Hue.room_settings[key] = Hue.global_settings[key]
      changed = true
    }

    if (Hue.room_settings[`${key}_override`] === undefined) {
      Hue.room_settings[`${key}_override`] = false
      changed = true
    }
  }

  if (changed) {
    Hue.save_room_settings()
  }
}

// Saves the room settings localStorage object
Hue.save_room_settings = function (force = false) {
  let room_settings_all = Hue.get_local_storage(Hue.ls_room_settings)

  if (room_settings_all === null) {
    room_settings_all = {}
  }

  room_settings_all[Hue.room_id] = Hue.room_settings

  Hue.save_local_storage(Hue.ls_room_settings, room_settings_all, force)
}

// Confirm if the user wants to reset the settings
Hue.confirm_reset_settings = function (type) {
  let s

  if (type === "global_settings") {
    s = "Global Settings"
  } else {
    s = "Room Settings"
  }

  if (
    confirm(`Are you sure you want to reset the ${s} to their initial state?`)
  ) {
    Hue.reset_settings(type)
  }
}

// Reset the settings of a certain type
Hue.reset_settings = function (type, empty = true) {
  if (empty) {
    Hue[`empty_${type}`]()
  }

  Hue[`get_${type}`]()

  Hue.start_settings_widgets(type)
  Hue.call_setting_actions("global_settings", false)
  Hue.call_setting_actions("room_settings", false)
  Hue.prepare_media_settings()

  if (type === "room_settings") {
    Hue.set_room_settings_overriders()
    Hue.check_room_settings_override()
  }
}

// Scrolls a settings window to the top
Hue.scroll_settings_window_to_top = function (type) {
  $(`#settings_window_right_${type}`).scrollTop(0)
}

// Show the global settings window
Hue.show_global_settings = function (filter = false) {
  Hue.do_settings_filter("global_settings", filter)
  Hue.msg_global_settings.show()
}

// Show the rooms settings window
Hue.show_room_settings = function (filter = false) {
  Hue.do_settings_filter("room_settings", filter)
  Hue.msg_room_settings.show()
}

// Setup the settings windows
Hue.setup_settings_windows = function () {
  Hue.setup_setting_elements("global_settings")
  Hue.setup_setting_elements("room_settings")
  Hue.create_room_settings_overriders()
  Hue.set_room_settings_overriders()
  Hue.start_room_settings_overriders()
  Hue.check_room_settings_override()
  Hue.set_user_settings_titles()
  Hue.check_hideable_settings()

  $(".settings_main_window").on("click", ".settings_window_category", function (
    e
  ) {
    let category = $(this).data("category")
    Hue.change_settings_window_category(category)
  })

  let first_category = $("#global_settings_container .settings_window_category")
    .eq(0)
    .data("category")
  Hue.change_settings_window_category(first_category, "global_settings")
  Hue.change_settings_window_category(first_category, "room_settings")
}

// Creates the overrider widgets for the room settings window
Hue.create_room_settings_overriders = function () {
  $("#room_settings_container")
    .find(".settings_item")
    .each(function () {
      let setting = $(this).data("setting")

      let s = `
        <div class='room_settings_overrider_container'>
            <input type='checkbox' class='room_settings_overrider' id='room_settings_${setting}_overrider'>
            Override
        </div>`

      $(this).prepend(s)
    })
}

// Sets the room settings window's overriders based on current state
Hue.set_room_settings_overriders = function () {
  $(".room_settings_overrider").each(function () {
    let item = $(this).closest(".settings_item")
    let setting = item.data("setting")
    let override = Hue.room_settings[`${setting}_override`]

    if (override === undefined) {
      override = false
    }

    $(this).prop("checked", override)

    Hue.settings_window_item_fade(override, item)
  })
}

// Starts the room settings window's overrider's events
Hue.start_room_settings_overriders = function () {
  $(".room_settings_overrider").change(function () {
    let item = $(this).closest(".settings_item")
    let setting = item.data("setting")
    let override = $(this).prop("checked")

    if (override === undefined) {
      override = false
    }

    Hue.settings_window_item_fade(override, item)
    Hue.room_settings[`${setting}_override`] = override

    let setting_obj = Hue.user_settings[setting]

    if (override) {
      setting_obj.action("room_settings", false)
    } else {
      setting_obj.action("global_settings", false)
    }

    Hue.check_room_settings_override()
    Hue.save_room_settings()

    let togglers = item.find(".toggler")

    if (togglers.length > 0) {
      let toggler = togglers.eq(0)

      if (override) {
        Hue.set_toggler("room_settings", toggler, "open")
      } else {
        Hue.set_toggler("room_settings", toggler, "close")
      }
    }
  })
}

// If a global settings item is overriden in room settings,
// it becomes faded. This function sets this
Hue.settings_window_item_fade = function (override, item) {
  if (override) {
    item.removeClass("faded")
  } else {
    item.addClass("faded")
  }

  $("#settings_window_right_global_settings .settings_item").each(function () {
    if (item.data("setting") === $(this).data("setting")) {
      if (override) {
        $(this).addClass("faded")
      } else {
        $(this).removeClass("faded")
      }

      return false
    }
  })
}

// Sets up more settings elements
Hue.setup_setting_elements = function (type) {
  $(`#${type}_reset`).click(function () {
    Hue.confirm_reset_settings(type)
  })

  $(`#${type}_switch`).click(function () {
    Hue.settings_window_switch(type)
  })

  Hue.setup_togglers(type)
}

// Switch between global and room settings
Hue.settings_window_switch = function (from) {
  Hue[`msg_${from}`].close(function () {
    let dest = "global_settings"

    if (from === "global_settings") {
      dest = "room_settings"
    }

    let category = Hue.get_selected_user_settings_category(from)
    Hue.open_user_settings_category(category, dest)

    let filter = $(`#${from}_filter`).val()

    if (filter) {
      Hue.do_settings_filter(dest, filter)
    }
  })
}

// Checks for room settings overrides to show or not indicators of change,
// in each category and in the user menu
Hue.check_room_settings_override = function () {
  $("#settings_window_left_room_settings .settings_window_category").each(
    function () {
      $(this).find(".settings_window_category_status").eq(0).html("")
      $(this).find(".settings_window_category_status_filler").eq(0).html("")
    }
  )

  for (let key in Hue.global_settings) {
    if (Hue.room_settings[`${key}_override`]) {
      override = true

      let el = $(`#room_settings_${key}`)

      if (el.length > 0) {
        let container = el.closest(".settings_category")

        if (container.length > 0) {
          let category = container.data("category")

          $(
            "#settings_window_left_room_settings .settings_window_category"
          ).each(function () {
            if ($(this).data("category") === category) {
              $(this)
                .find(".settings_window_category_status")
                .eq(0)
                .html("&nbsp;*")
              $(this)
                .find(".settings_window_category_status_filler")
                .eq(0)
                .html("&nbsp;*")
              return false
            }
          })
        }
      }
    }
  }
}

// Gets the active version of a setting
// Either from global settings or room settings
// A room setting version is active when the setting is overriden
Hue.get_setting = function (name) {
  try {
    if (Hue.room_settings[`${name}_override`]) {
      return Hue.room_settings[name]
    } else {
      return Hue.global_settings[name]
    }
  } catch (err) {
    return undefined
  }
}

// Checks whether a setting is active as a global or as a room setting
Hue.active_settings = function (name) {
  if (Hue.room_settings[`${name}_override`]) {
    return "room_settings"
  } else {
    return "global_settings"
  }
}

// Sets the hover titles for the setttings widgets
Hue.set_user_settings_titles = function () {
  for (let key in Hue.user_settings) {
    let setting = Hue.user_settings[key]
    let value = Hue.config[`global_settings_default_${key}`]

    if (typeof value === "string") {
      value = `"${value}"`
    }

    let title = `${setting.description} (${key}) (Default: ${value})`

    $(`#global_settings_${key}`).closest(".settings_top_level_item").attr("title", title)
    $(`#room_settings_${key}`).closest(".settings_top_level_item").attr("title", title)
  }
}

// Modifies a setting manually instead of using the settings windows
Hue.modify_setting = function (arg, show_feedback = true, force = false) {
  let split = arg.split(" ")
  let setting = split[0]

  if (Hue.user_settings[setting] === undefined) {
    Hue.feedback("Invalid setting")
    return false
  }

  let value = ""

  if (split.length > 1) {
    value = split.slice(1).join(" ")
  }

  if (value) {
    if (value === "true") {
      value = true
    } else if (value === "false") {
      value = false
    } else if (!isNaN(value)) {
      value = Number(value)
    } else {
      value = value.split("\\n").join("\n")
    }
  }

  let type = Hue.active_settings(setting)

  if (Hue[type][setting] === value) {
    if (show_feedback) {
      Hue.feedback(`Setting "${setting}" is already set to that`)
    }

    return false
  }

  let setting_obj = Hue.user_settings[setting]

  Hue[type][setting] = value
  Hue.modify_setting_widget(type, setting)
  setting_obj.action(type, false)
  Hue[`save_${type}`](force)

  if (show_feedback) {
    Hue.feedback(`Setting "${setting}" succesfully modified`)
  }
}

// Shows a window with a form to enter a string received by Export Settings
// Used to import settings from one client to another
Hue.show_import_settings = function () {
  let s = `
    <div class='container_22'>
        Paste code generated by Export Settings
        <textarea id='import_settings_textarea' rows=5 class='setting_textarea'></textarea>
        <div class='menu_item inline action pointer' id='import_settings_apply'>Apply</div>
    </div>
    `

  Hue.msg_info2.show(["Import Settings", s], function () {
    $("#import_settings_textarea").focus()
    $("#import_settings_apply").click(function () {
      Hue.process_imported_settings()
    })

    Hue.import_settings_open = true
  })
}

// Processes the string entered in the import settings window
Hue.process_imported_settings = function () {
  let code = $("#import_settings_textarea").val().trim()

  if (code === "") {
    return false
  }

  try {
    eval(code)
  } catch (err) {
    alert("Code provided is invalid")
  }
}

// Shows a window that displays strings to export settings to another client
// It shows different kinds of export methods
// A string is then entered in Import Settings in another client and executed
Hue.show_export_settings = function () {
  let gsettings = localStorage.getItem(Hue.ls_global_settings)
  let rsettings = localStorage.getItem(Hue.ls_room_settings)
  let delay = Hue.local_storage_save_delay * 2
  let code = `let gsettings = ${gsettings}; Hue.save_local_storage(Hue.ls_global_settings, gsettings); let rsettings = ${rsettings}; Hue.save_local_storage(Hue.ls_room_settings, rsettings); Hue.delay_reload_client(${delay})`
  let code2 = `let gsettings = ${gsettings}; Hue.save_local_storage(Hue.ls_global_settings, gsettings); Hue.delay_reload_client(${delay})`
  let code3 = `let rsettings = ${rsettings}; Hue.save_local_storage(Hue.ls_room_settings, rsettings); Hue.delay_reload_client(${delay})`

  let s = `
    <div class='container_22'>

        <div id='export_settings_info'  class='grid_column_center'>
            <div>In case you want to export your settings from one browser to another.</div>
            <div>You can import either Global Settings, Room Settings, or both.</div>
            <div>Room Settings copies every room's settings, not just the current one.</div>
            <div>To do this, copy one of the codes below, and paste it in Import Settings in the other browser.</div>
        </div>

        <div class='export_settings_textarea_label'>(a) Use this code if you want to import <span class='bold'>Global</span> and <span class='bold'>Room</span> Settings</div>
        <textarea rows=5 class='setting_textarea export_settings_textarea'>${code}</textarea>

        <div class='export_settings_textarea_label'>(b) Use this code if you only want to import <span class='bold'>Global</span> Settings</div>
        <textarea rows=5 class='setting_textarea export_settings_textarea'>${code2}</textarea>

        <div class='export_settings_textarea_label'>(c) Use this code if you only want to import <span class='bold'>Room</span> Settings</div>
        <textarea rows=5 class='setting_textarea'>${code3}</textarea>
    </div>
    `

  Hue.msg_info2.show(["Export Settings", s])
}

// Apply media percentages and positions
Hue.prepare_media_settings = function () {
  Hue.apply_media_percentages()
  Hue.apply_media_positions()
}

// Opens a settings window and goes to a specific category
Hue.open_user_settings_category = function (
  category,
  type = "global_settings"
) {
  Hue[`show_${type}`]()
  Hue.change_settings_window_category(category)
}

// Goes to a specific item in a settings window
// Opens the toggler if it has one
Hue.go_to_user_settings_item = function (setting) {
  let type = Hue.which_user_settings_window_is_open()

  $(`#${type}_container .settings_item`).each(function () {
    if ($(this).data("setting") === setting) {
      let toggler_container = $(this).closest(".toggler_main_container")
      let toggler = toggler_container.find(".toggler").eq(0)

      if (toggler.length === 0) {
        toggler_container = $(this).find(".toggler_main_container").eq(0)
        toggler = toggler_container.find(".toggler").eq(0)
      }

      if (toggler.length > 0) {
        Hue.set_toggler(type, toggler, "open")
        toggler_container[0].scrollIntoView({ block: "center" })
      } else {
        this.scrollIntoView({ block: "center" })
      }

      return false
    }
  })
}

// Checks which type of settings window is open
Hue.which_user_settings_window_is_open = function () {
  let type = false

  if (Hue.msg_global_settings.is_highest()) {
    type = "global_settings"
  } else if (Hue.msg_room_settings.is_highest()) {
    type = "room_settings"
  }

  return type
}

// Gets the selected settings window category
Hue.get_selected_user_settings_category = function (type) {
  let category = false

  $(`#settings_window_left_${type} .settings_window_category`).each(
    function () {
      let selected = $(this).data("selected_category")

      if (selected) {
        category = $(this).data("category")
        return false
      }
    }
  )

  return category
}

// Change the active category in a settings window
Hue.change_settings_window_category = function (category, type = false) {
  type = type ? type : Hue.which_user_settings_window_is_open()

  if (!type) {
    return false
  }

  let element = $(`#settings_window_category_${category}_${type}`)[0]
  let main = $(element).closest(".settings_main_window")

  main.find(".settings_window_category").each(function () {
    $(this)
      .find(".settings_window_category_text")
      .eq(0)
      .removeClass("border_bottom")
    $(this).data("selected_category", false)
  })

  $(element)
    .find(".settings_window_category_text")
    .eq(0)
    .addClass("border_bottom")
  $(element).data("selected_category", true)

  main.find(".settings_window_category_container_selected").each(function () {
    $(this).removeClass("settings_window_category_container_selected")
    $(this).addClass("settings_window_category_container")
  })

  let container = $(`#${$(element).data("category_container")}`)

  container.removeClass("settings_window_category_container")
  container.addClass("settings_window_category_container_selected")
}

// Overrides a global setting by triggering a click on the room setting overrider
Hue.enable_setting_override = function (setting) {
  if (Hue.room_settings[`${setting}_override`]) {
    return false
  }

  $(`#room_settings_${setting}_overrider`).click()
}

// Filter a settings window
Hue.do_settings_filter = function (type, filter = false) {
  if (filter) {
    filter = filter.trim()
  }

  let sfilter = filter ? filter : ""

  $(`#${type}_filter`).val(sfilter)

  let words

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    words = lc_value.split(" ").filter((x) => x.trim() !== "")
  }

  $(`#${type}_container .settings_top_level_item`).each(function () {
    if (filter) {
      let text = Hue.utilz.clean_string2($(this).text()).toLowerCase()

      if (words.some((word) => text.includes(word))) {
        $(this).css("display", "block")
      } else {
        $(this).css("display", "none")
      }
    } else {
      $(this).css("display", "block")
    }
  })

  let current_category = Hue.get_selected_user_settings_category(type)
  let current_category_visible = true
  let active_category = false

  $(`#${type}_container .settings_category`).each(function () {
    let category = $(this).data("category")
    let count = $(this).find(
      ".settings_top_level_item:not([style*='display: none'])"
    ).length

    if (count === 0) {
      if (category === current_category) {
        current_category_visible = false
      }

      $(`#settings_window_category_${category}_${type}`).css("display", "none")
    } else {
      if (!active_category) {
        active_category = category
      }

      $(`#settings_window_category_${category}_${type}`).css("display", "flex")
    }
  })

  let new_category = current_category_visible
    ? current_category
    : active_category

  if (new_category) {
    Hue.change_settings_window_category(new_category, type)
  }

  if (!filter) {
    Hue.check_hideable_settings()
  }

  Hue.scroll_settings_window_to_top(type)
}

// Makes a setting invisible
Hue.hide_setting = function (type, name) {
  $(`#${type}_${name}`)
    .closest(".settings_top_level_item")
    .css("display", "none")
  $(`#${type}_${name}`)
    .closest(".settings_top_level_item")
    .addClass("hidden_setting")
}

// Makes a setting visible
Hue.unhide_setting = function (type, name) {
  $(`#${type}_${name}`)
    .closest(".settings_top_level_item")
    .css("display", "block")
  $(`#${type}_${name}`)
    .closest(".settings_top_level_item")
    .removeClass("hidden_setting")
}

// Checks to see what settings should be invisible in the settings window
// This depends on the state of other certain settings
Hue.check_hideable_settings = function () {
  if (Hue.get_setting("theme_mode") === "room") {
    Hue.hide_setting("global_settings", "theme_color")
    Hue.hide_setting("global_settings", "text_color")
    Hue.hide_setting("room_settings", "theme_color")
    Hue.hide_setting("room_settings", "text_color")
  } else {
    Hue.unhide_setting("global_settings", "theme_color")
    Hue.unhide_setting("global_settings", "text_color")
    Hue.unhide_setting("room_settings", "theme_color")
    Hue.unhide_setting("room_settings", "text_color")
  }

  let background_mode = Hue.get_setting("background_mode")

  if (background_mode === "room" || background_mode === "custom_solid") {
    Hue.hide_setting("global_settings", "background_url")
    Hue.hide_setting("global_settings", "background_tile_dimensions")
    Hue.hide_setting("room_settings", "background_url")
    Hue.hide_setting("room_settings", "background_tile_dimensions")
  } else {
    Hue.unhide_setting("global_settings", "background_url")
    Hue.unhide_setting("room_settings", "background_url")

    if (background_mode === "custom_tiled") {
      Hue.unhide_setting("global_settings", "background_tile_dimensions")
      Hue.unhide_setting("room_settings", "background_tile_dimensions")
    } else {
      Hue.hide_setting("global_settings", "background_tile_dimensions")
      Hue.hide_setting("room_settings", "background_tile_dimensions")
    }
  }
}