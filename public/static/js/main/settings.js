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
  case_insensitive_words_highlights: {
    widget_type: "checkbox",
    description: `Whether 'other words' highlight checks are case insensitive or not`,
    action: (save = true) => {
      Hue.settings.case_insensitive_words_highlights = $(
        `#settings_case_insensitive_words_highlights`
      ).prop("checked")

      Hue.generate_highlight_words_regex()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  case_insensitive_ignored_words: {
    widget_type: "checkbox",
    description: `Whether 'ignored words' highlight checks are case insensitive or not`,
    action: (save = true) => {
      Hue.settings.case_insensitive_ignored_words = $(
        `#settings_case_insensitive_ignored_words`
      ).prop("checked")

      Hue.generate_ignored_words_regex()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  ignored_words_exclude_same_user: {
    widget_type: "checkbox",
    description: `Whether messages containing 'ignored words' should be ignored if coming from the user itself`,
    action: (save = true) => {
      Hue.settings.ignored_words_exclude_same_user = $(
        `#settings_ignored_words_exclude_same_user`
      ).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  other_words_to_highlight: {
    widget_type: "textarea",
    description: `Words on messages to trigger highlights`,
    action: (save = true) => {
      let words = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#settings_other_words_to_highlight`).val())
      )

      $(`#settings_other_words_to_highlight`).val(words)
      Hue.settings.other_words_to_highlight = words
      Hue.generate_highlight_words_regex()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  ignored_usernames: {
    widget_type: "textarea",
    description: `Ignore messages and actions from these users`,
    action: (save = true) => {
      let unames = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#settings_ignored_usernames`).val())
      )

      $(`#settings_ignored_usernames`).val(unames)

      Hue.settings.ignored_usernames = unames
      Hue.get_ignored_usernames_list()
      Hue.check_activity_bar()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  ignored_words: {
    widget_type: "textarea",
    description: `Ignore messages that contain these words`,
    action: (save = true) => {
      let unames = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#settings_ignored_words`).val())
      )

      $(`#settings_ignored_words`).val(unames)
      Hue.settings.ignored_words = unames
      Hue.generate_ignored_words_regex()

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
  other_words_to_autocomplete: {
    widget_type: "textarea",
    description: `Other words to be considered on Tab autocompletion`,
    action: (save = true) => {
      let words = Hue.utilz.make_unique_lines(
        Hue.utilz.remove_multiple_empty_lines($(`#settings_other_words_to_autocomplete`).val())
      )

      $(`#settings_other_words_to_autocomplete`).val(words)

      Hue.settings.other_words_to_autocomplete = words

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
  show_input_placeholder: {
    widget_type: "checkbox",
    description: `Whether information inside the input should be shown`,
    action: (save = true) => {
      Hue.settings.show_input_placeholder = $(
        `#settings_show_input_placeholder`
      ).prop("checked")

      Hue.update_input_placeholder()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  autoreveal_spoilers: {
    widget_type: "checkbox",
    description: `Whether spoiler messages should be autorevealed`,
    action: (save = true) => {
      Hue.settings.autoreveal_spoilers = $(`#settings_autoreveal_spoilers`).prop(
        "checked"
      )

      if (save) {
        Hue.save_settings()
      }
    },
  },
  theme_mode: {
    widget_type: "select",
    description: `It either uses the room's theme color or a custom theme color`,
    action: (save = true) => {
      Hue.settings.theme_mode = $(`#settings_theme_mode option:selected`).val()
      Hue.apply_theme()
      Hue.check_hideable_settings()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  theme_color: {
    widget_type: "color",
    description: `The theme color to use if the user is using a custom theme mode`,
    action: (save = true) => {
      Hue.settings.theme_color = $(`#settings_theme_color`).val()
      Hue.apply_theme()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  text_color: {
    widget_type: "color",
    description: `The text color to use if the user is using a custom theme mode`,
    action: (save = true) => {
      Hue.settings.text_color = $(`#settings_text_color`).val()
      Hue.apply_theme()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  background_mode: {
    widget_type: "select",
    description: `It either uses the room's background, a custom background, or no background`,
    action: (save = true) => {
      Hue.settings.background_mode = $(
        `#settings_background_mode option:selected`
      ).val()

      Hue.apply_background()
      Hue.check_hideable_settings()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  background_url: {
    widget_type: "text",
    description: `The background url to use if the user is using a custom background`,
    action: (save = true) => {
      let src = Hue.utilz.clean_string5(
        $(`#settings_background_url`).val().replace(".gifv", ".gif")
      )
      $(`#settings_background_url`).val(src)
      Hue.settings.background_url = src
      Hue.apply_background()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  background_tile_dimensions: {
    widget_type: "text",
    description: `The background url to use if the user is using a custom background`,
    action: (save = true) => {
      let dimensions = Hue.utilz.clean_string2(
        $(`#settings_background_tile_dimensions`).val()
      )
      $(`#settings_background_tile_dimensions`).val(dimensions)
      Hue.settings.background_tile_dimensions = dimensions
      Hue.apply_background()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  message_log: {
    widget_type: "checkbox",
    description: `Whether the user requests the message log on load`,
    action: (save = true) => {
      Hue.settings.message_log = $(`#settings_message_log`).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  chat_crop_limit: {
    widget_type: "number",
    description: `Crop the chat area after this many messages`,
    action: (save = true) => {
      let val = parseInt(
        Hue.utilz.clean_string2($(`#settings_chat_crop_limit`).val())
      )

      if (!val) {
        val = Hue.config.settings_default_chat_crop_limit
      }

      $(`#settings_chat_crop_limit`).val(val)

      Hue.settings.chat_crop_limit = val

      if (save) {
        Hue.save_settings()
      }
    },
  },
  autoconnect: {
    widget_type: "checkbox",
    description: `Whether a user should autoconnect automatically after a socket disconnect`,
    action: (save = true) => {
      Hue.settings.autoconnect = $(`#settings_autoconnect`).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  popup_notifications_close_delay: {
    widget_type: "number",
    description: `How much time (ms) needs to pass before the notification popups close automatically`,
    action: (save = true) => {
      let delay = parseInt($(`#settings_popup_notifications_close_delay`).val())

      if (isNaN(delay)) {
        delay =
          Hue.config.settings_default_popup_notifications_close_delay
      }

      $(`#settings_popup_notifications_close_delay`).val(delay)
      Hue.settings.popup_notifications_close_delay = delay

      if (save) {
        Hue.save_settings()
      }
    },
  },
  transparent_panels: {
    widget_type: "checkbox",
    description: `Whether panels get a slight transparency`,
    action: (save = true) => {
      Hue.settings.transparent_panels = $(`#settings_transparent_panels`).prop(
        "checked"
      )

      Hue.apply_theme()

      if (save) {
        Hue.save_settings()
      }
    },
  },
  confirm_chat: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when sending a chat message`,
    action: (save = true) => {
      Hue.settings.confirm_chat = $(`#settings_confirm_chat`).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  confirm_image: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when changing the image`,
    action: (save = true) => {
      Hue.settings.confirm_image = $(`#settings_confirm_image`).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  confirm_tv: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when changing the tv`,
    action: (save = true) => {
      Hue.settings.confirm_tv = $(`#settings_confirm_tv`).prop("checked")

      if (save) {
        Hue.save_settings()
      }
    },
  },
  confirm_message_board: {
    widget_type: "checkbox",
    description: `Whether to show a confirmation dialog when sending a board message`,
    action: (save = true) => {
      Hue.settings.confirm_message_board = $(
        `#settings_confirm_message_board`
      ).prop("checked")

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

// Scrolls a settings window to the top
Hue.scroll_settings_window_to_top = function () {
  $("#settings_window_right").scrollTop(0)
}

// Show the settings window
Hue.show_settings = function (filter = false) {
  Hue.do_settings_filter(filter)
  Hue.msg_settings.show()
}

// Setup the settings windows
Hue.setup_settings_windows = function () {
  Hue.setup_setting_elements()
  Hue.set_user_settings_titles()
  Hue.check_hideable_settings()

  $(".settings_main_window").on("click", ".settings_window_category", function (
    e
  ) {
    let category = $(this).data("category")
    Hue.change_settings_window_category(category)
  })

  let first_category = $("#settings_window .settings_window_category")
    .eq(0)
    .data("category")

  Hue.change_settings_window_category(first_category)
}

// Sets up more settings elements
Hue.setup_setting_elements = function (type) {
  $("#settings_reset").click(function () {
    Hue.confirm_reset_settings()
  })

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
    $(`#settings_${key}`).closest(".settings_top_level_item").attr("title", title)
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

  if (Hue.settings[setting] === value) {
    if (show_feedback) {
      Hue.feedback(`Setting "${setting}" is already set to that`)
    }

    return false
  }

  let setting_obj = Hue.user_settings[setting]

  Hue.settings[setting] = value
  Hue.modify_setting_widget(setting)
  setting_obj.action(false)
  Hue.save_settings(force)

  if (show_feedback) {
    Hue.feedback(`Setting "${setting}" succesfully modified`)
  }
}

// Apply media percentages and positions
Hue.prepare_media_settings = function () {
  Hue.apply_media_percentages()
  Hue.apply_media_positions()
}

// Opens a settings window and goes to a specific category
Hue.open_user_settings_category = function (category) {
  Hue.show_settings()
  Hue.change_settings_window_category(category)
}

// Gets the selected settings window category
Hue.get_selected_user_settings_category = function () {
  let category = false

  $(`#settings_window_left .settings_window_category`).each(
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
Hue.change_settings_window_category = function (category) {
  let element = $(`#settings_window_category_${category}`)[0]
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

// Filter a settings window
Hue.do_settings_filter = function (filter = false) {
  if (filter) {
    filter = filter.trim()
  }

  let words
  let sfilter = filter ? filter : ""
  $("#settings_filter").val(sfilter)

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    words = lc_value.split(" ").filter((x) => x.trim() !== "")
  }

  $(`#settings_window .settings_top_level_item`).each(function () {
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

  let current_category = Hue.get_selected_user_settings_category()
  let current_category_visible = true
  let active_category = false

  $(`#settings_window .settings_category`).each(function () {
    let category = $(this).data("category")
    let count = $(this).find(
      ".settings_top_level_item:not([style*='display: none'])"
    ).length

    if (count === 0) {
      if (category === current_category) {
        current_category_visible = false
      }

      $(`#settings_window_category_${category}`).css("display", "none")
    } else {
      if (!active_category) {
        active_category = category
      }

      $(`#settings_window_category_${category}`).css("display", "flex")
    }
  })

  let new_category = current_category_visible ?
    current_category :
    active_category

  if (new_category) {
    Hue.change_settings_window_category(new_category)
  }

  if (!filter) {
    Hue.check_hideable_settings()
  }

  Hue.scroll_settings_window_to_top()
}

// Makes a setting invisible
Hue.hide_setting = function (name) {
  $(`#settings_${name}`)
    .closest(".settings_top_level_item")
    .css("display", "none").addClass("hidden_setting")
}

// Makes a setting visible
Hue.unhide_setting = function (name) {
  $(`#settings_${name}`)
    .closest(".settings_top_level_item")
    .css("display", "block").removeClass("hidden_setting")
}

// Checks to see what settings should be invisible in the settings window
// This depends on the state of other certain settings
Hue.check_hideable_settings = function () {
  if (Hue.get_setting("theme_mode") === "room") {
    Hue.hide_setting("theme_color")
    Hue.hide_setting("text_color")
  } else {
    Hue.unhide_setting("theme_color")
    Hue.unhide_setting("text_color")
  }

  let background_mode = Hue.get_setting("background_mode")

  if (background_mode === "room" || background_mode === "custom_solid") {
    Hue.hide_setting("background_url")
    Hue.hide_setting("background_tile_dimensions")
  } else {
    Hue.unhide_setting("background_url")

    if (background_mode === "custom_tiled") {
      Hue.unhide_setting("background_tile_dimensions")
    } else {
      Hue.hide_setting("background_tile_dimensions")
    }
  }
}