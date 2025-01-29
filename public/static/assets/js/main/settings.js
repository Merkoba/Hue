App.setup_settings = () => {
  App.fill_settings()
  App.start_settings_widgets()
  App.start_settings_widgets_listeners()
  App.setup_settings_windows()
}

// User settings object
// Used to generate settings
// And to declare what widget is used in the settings window
App.build_user_settings = () => {
  let font_sizes = App.create_settings_font_sizes()
  let percentages = App.create_settings_percentages()

  App.user_settings = {
    font: {
      title: `Font`,
      type: `select`,
      description: `Which font to use`,
      actions: () => {
        App.apply_theme()
      },
      options: [
        {value: `sans-serif`, text: `Sans`},
        {value: `serif`, text: `Serif`},
        {value: `monospace`, text: `Mono`},
      ],
      version: 1,
    },
    chat_font_size: {
      title: `Chat Font Size`,
      type: `select`,
      description: `The size of the chat font`,
      actions: () => {
        App.apply_theme()
      },
      options: font_sizes,
      version: 1,
    },
    chat_size: {
      title: `Chat Size`,
      type: `select`,
      description: `The size of the chat relative to media`,
      actions: () => {
        App.apply_media_percentages()
        App.fix_frames()
      },
      options: percentages,
      version: 1,
    },
    main_layout: {
      title: `Main Layout`,
      type: `select`,
      description: `The type of main layout`,
      actions: () => {
        App.apply_media_percentages()
        App.fix_frames()
      },
      options: [
        {value: `column`, text: `Column`},
        {value: `row`, text: `Row`},
      ],
      version: 1,
    },
    media_layout: {
      title: `Media Layout`,
      type: `select`,
      description: `The type of media layout`,
      actions: () => {
        App.change_media_layout()
        App.apply_media_percentages()
        App.fix_frames()
      },
      options: [
        {value: `column`, text: `Column`},
        {value: `row`, text: `Row`},
      ],
      version: 1,
    },
    media_info: {
      title: `Media Info`,
      type: `select`,
      description: `How to show the media info`,
      actions: () => {
        App.check_media_info()
        App.fix_frames()
      },
      options: [
        {value: `normal`, text: `Normal`},
        {value: `columns`, text: `Columns`},
        {value: `only_user`, text: `Only User`},
        {value: `only_title`, text: `Only Title`},
        {value: `hidden`, text: `Hidden`},
      ],
      version: 1,
    },
    tv_position: {
      title: `TV Position`,
      type: `select`,
      description: `The position of the tv relative to the image`,
      actions: () => {
        App.apply_media_positions()
        App.fix_frames()
      },
      options: [
        {value: `top`, text: `Top`},
        {value: `bottom`, text: `Bottom`},
      ],
      version: 1,
    },
    tv_size: {
      title: `TV Size`,
      type: `select`,
      description: `The size of the tv relative to the image`,
      actions: () => {
        App.apply_media_percentages()
        App.fix_frames()
      },
      options: percentages,
      version: 1,
    },
    date_format: {
      title: `Date Format`,
      type: `select`,
      description: `What date format to use in chat messages`,
      actions: () => {
        App.update_date()
      },
      options: [
        {value: `relative`, text: `Relative`},
        {value: `absolute_12`, text: `12 Hours`},
        {value: `absolute_24`, text: `24 Hours`},
      ],
      version: 1,
    },
    radio_auto_minutes: {
      title: `Radio Auto Minutes`,
      type: `select`,
      force_int: true,
      description: `Change the radio after these minutes`,
      actions: () => {
        App.start_radio_auto_timeout()
      },
      options: [
        {value: `5`, text: `5 Mins`},
        {value: `10`, text: `10 Mins`},
        {value: `15`, text: `15 Mins`},
        {value: `20`, text: `20 Mins`},
        {value: `25`, text: `25 Mins`},
        {value: `30`, text: `30 Mins`},
      ],
      version: 1,
    },
    command_prefix: {
      title: `Command Prefix`,
      type: `select`,
      description: `What to use as the command prefix`,
      actions: () => {
        App.prepare_commands()
      },
      options: [
        {value: `/`, text: `/`},
        {value: `\\`, text: `\\`},
        {value: `!`, text: `!`},
        {value: `?`, text: `?`},
        {value: `~`, text: `~`},
        {value: `;`, text: `;`},
        {value: `,`, text: `,`},
        {value: `.`, text: `.`},
      ],
      version: 1,
    },
    background_opacity: {
      title: `Background Opacity`,
      type: `select`,
      description: `The opacity for the background`,
      actions: () => {
        App.apply_theme()
      },
      options: App.opacity_options(),
      version: 1,
    },
    show_chat: {
      title: `Show Chat`,
      type: `checkbox`,
      description: `Whether to show the chat at all`,
      actions: () => {
        App.check_show_chat()
        App.fix_frames()
      },
      version: 1,
    },
    show_linksbar: {
      title: `Show Links Bar`,
      type: `checkbox`,
      description: `Whether to show the Links Bar or not`,
      actions: () => {
        App.check_linksbar()
        App.fix_frames()
      },
      version: 1,
    },
    show_background: {
      title: `Show Background`,
      type: `checkbox`,
      description: `Whether to show the room's background image`,
      actions: () => {
        App.apply_background()
      },
      version: 1,
    },
    show_highlight_notifications: {
      title: `Show Highlight Notifications`,
      type: `checkbox`,
      description: `Whether to show desktop notifications on highlights`,
      actions: () => {},
      version: 1,
    },
    show_activity_notifications: {
      title: `Show Activity Notifications`,
      type: `checkbox`,
      description: `Whether to show desktop notifications on activity after your last message`,
      actions: () => {},
      version: 1,
    },
    show_user_join_notifications: {
      title: `Show User Join Notifications`,
      type: `checkbox`,
      description: `Whether to show notifications when users join`,
      actions: () => {},
      version: 1,
    },
    show_user_leave_notifications: {
      title: `Show User Leave Notifications`,
      type: `checkbox`,
      description: `Whether to show notifications when users leave`,
      actions: () => {},
      version: 1,
    },
    hide_scrollbars: {
      title: `Hide Scrollbars`,
      type: `checkbox`,
      description: `Whether to make scrollbars invisible`,
      actions: () => {
        App.apply_theme()
      },
      version: 1,
    },
    autoplay: {
      title: `Autoplay`,
      type: `checkbox`,
      description: `Whether to autoplay media after changing it`,
      actions: () => {},
      version: 1,
    },
    automedia: {
      title: `Automedia`,
      type: `checkbox`,
      description: `Ask if media URLs pasted in the chat input should be used`,
      actions: () => {},
      version: 1,
    },
    embed_images: {
      title: `Embed Images`,
      type: `checkbox`,
      description: `Whether to embed other images automatically`,
      actions: () => {},
      version: 1,
    },
    show_link_previews: {
      title: `Link Previews`,
      type: `checkbox`,
      description: `Whether to show related information of chat links when available`,
      actions: () => {},
      version: 1,
    },
    highlight_current_username: {
      title: `Username Highlights`,
      type: `checkbox`,
      description: `Whether messages containing the user's username must be highlighted`,
      actions: () => {},
      version: 1,
    },
    case_insensitive_highlights: {
      title: `Case Insensitive Highlights`,
      type: `checkbox`,
      description: `Whether highlight checks are case insensitive or not`,
      actions: () => {
        App.setup_highlights()
      },
      version: 1,
    },
    case_insensitive_username_highlights: {
      title: `Case Insensitive Username Highlights`,
      type: `checkbox`,
      description: `Whether username highlight checks are case insensitive or not`,
      actions: () => {
        App.generate_mentions_regex()
      },
      version: 1,
    },
    open_whispers_automatically: {
      title: `Open Whispers Automatically`,
      type: `checkbox`,
      description: `Whether messages received should open in a window automatically`,
      actions: () => {},
      version: 1,
    },
    open_message_board_automatically: {
      title: `Open Message Board Automatically`,
      type: `checkbox`,
      description: `Whether to open the Message Board automatically when joining a room and there are new messages`,
      actions: () => {},
      version: 1,
    },
    radio_enabled: {
      title: `Radio Enabled`,
      type: `checkbox`,
      description: `Enable radio controls`,
      actions: () => {
        App.check_radio_enabled()
      },
      version: 1,
    },
    text_effects: {
      title: `Text Effects`,
      type: `checkbox`,
      description: `Add effects like bold to certain syntax`,
      actions: () => {},
      version: 1,
    },
    unread_count: {
      title: `Unread Count`,
      type: `checkbox`,
      description: `Whether to show the unread count in the title`,
      actions: () => {
        App.update_title()
      },
      version: 1,
    },
    show_loaded: {
      title: `Show Loaded`,
      type: `checkbox`,
      description: `Show the loaded label on loaded media messages`,
      actions: () => {},
      version: 1,
    },
    show_clicked: {
      title: `Show Clicked`,
      type: `checkbox`,
      description: `Show the clicked label on clicked links`,
      actions: () => {},
      version: 1,
    },
    short_urls: {
      title: `Short URLs`,
      type: `checkbox`,
      description: `Remove the protocol like https:// from displayed URLs`,
      actions: () => {},
      version: 1,
    },
    text_glow: {
      title: `Text Glow`,
      type: `checkbox`,
      description: `Show a glow effect on all text`,
      actions: () => {
        App.apply_theme()
      },
      version: 1,
    },
    auto_blur: {
      title: `Auto Blur`,
      type: `checkbox`,
      description: `Auto-blur the chat when not focused`,
      actions: () => {},
      version: 1,
    },
    grey_background: {
      title: `Grey Background`,
      type: `checkbox`,
      description: `Apply a greyscale filter to the background image`,
      actions: () => {
        App.apply_theme()
      },
      version: 1,
    },
    custom_css: {
      title: `Custom CSS`,
      type: `textarea`,
      description: `Custom changes to the default CSS styling`,
      placeholder: `Paste code here`,
      actions: () => {
        App.insert_custom_css()
      },
      version: 1,
    },
    highlights: {
      title: `Highlights`,
      type: `textarea`,
      description: `Words or phrases to highlight in chat messages`,
      placeholder: `One per line`,
      no_empty_lines: true,
      actions: () => {
        App.setup_highlights()
      },
      version: 1,
    },
  }

  if (!App.config.radio_enabled) {
    delete App.user_settings.radio_enabled
    delete App.user_settings.radio_auto_minutes
  }
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

  function set_default(key) {
    App.settings[key].value = App.default_setting_string
    App.settings[key].version = App.user_settings[key].version
  }

  for (let key in App.user_settings) {
    // Fill defaults
    if ((App.settings[key] === undefined) ||
      (App.settings[key].value === undefined)) {
      App.loginfo(`Stor: Adding setting: ${key}`)
      App.settings[key] = {}
      set_default(key)
      changed = true
    }
  }

  for (let key in App.settings) {
    // Remove unused settings
    if (App.user_settings[key] === undefined) {
      App.loginfo(`Stor: Deleting setting: ${key}`)
      delete App.settings[key]
      changed = true
    }
    // Check new version
    else if (App.settings[key].version !== App.user_settings[key].version) {
      App.loginfo(`Stor: Upgrading setting: ${key}`)
      set_default(key)
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
  for (let key in App.user_settings) {
    App.modify_setting_widget(key)
  }
}

// Updates a setting widget based on the setting state
App.modify_setting_widget = (key) => {
  let type = App.user_settings[key].type
  let item = DOM.el(`#settings_${key}`)

  if (type === `checkbox`) {
    item.checked = App.get_setting(key)
  }
  else if (type === `select`) {
    App.set_select(item, App.get_setting(key))
  }
  else if ([`text`, `textarea`].includes(type)) {
    item.value = App.get_setting(key)
  }
}

App.set_select = (select, option) => {
  for (let el of DOM.els(`option`, select)) {
    // eslint-disable-next-line eqeqeq
    if (el.value == option) {
      el.selected = true
    }
  }
}

// Starts listeners for settings windows widgets's change
App.start_settings_widgets_listeners = () => {
  for (let key in App.user_settings) {
    let setting = App.user_settings[key]
    let item = DOM.el(`#settings_${key}`)

    if ([`checkbox`, `select`].includes(setting.type)) {
      DOM.ev(item, `change`, () => {
        App.on_setting_change(key)
      })
    }
    else if ([`text`, `textarea`].includes(setting.type)) {
      DOM.ev(item, `blur`, () => {
        App.on_setting_change(key)
      })
    }
    else if ([`number`, `color`].includes(setting.type)) {
      DOM.ev(item, `change`, () => {
        App.on_setting_change(key)
      })
    }
    else if (setting.type === `range`) {
      DOM.ev(item, `input change`, () => {
        App.on_setting_change(key)
      })
    }
  }
}

App.on_setting_change = (key) => {
  let setting = App.user_settings[key]
  let el = DOM.el(`#settings_${key}`)
  let value

  if (setting.type === `checkbox`) {
    value = el.checked
  }
  else if (setting.type === `select`) {
    value = el.value
  }
  else if ([`text`, `textarea`].includes(setting.type)) {
    value = el.value.trim()

    if (setting.no_empty_lines) {
      value = value.split(`\n`).filter((x) => x.trim()).join(`\n`)
      el.value = value
    }
  }

  if (setting.force_int) {
    value = parseInt(value)
  }

  App.set_setting(key, value)
  App.save_settings()
  setting.actions()
}

// Restore one setting
App.reset_setting = (key) => {
  App.show_confirm(`Reset setting`, () => {
    let setting = App.user_settings[key]
    App.set_setting(key, App.default_setting_string)
    App.modify_setting_widget(key)

    if (setting.actions) {
      setting.actions()
    }
  })
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
  DOM.el(`#settings_filter`).value = filter
  App.do_modal_filter()
}

// Setup the settings windows
App.setup_settings_windows = () => {
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
App.get_default_setting = (key) => {
  return App.config[`settings_default_${key}`]
}

// Setting getter
App.get_setting = (key) => {
  let value = App.settings[key].value

  if (value === App.default_setting_string) {
    value = App.get_default_setting(key)
  }

  return value
}

// Set a setting
App.set_setting = (key, value) => {
  App.settings[key].value = value
  App.save_settings()
}

App.create_settings_percentages = () => {
  let opts = []

  for (let p = App.media_max_percentage; p >= App.media_min_percentage; p -= 5) {
    opts.push({value: p, text: `${p}%`})
  }

  return opts
}

App.create_settings_font_sizes = () => {
  let opts = []
  let size = App.max_chat_font_size

  while (size >= App.min_chat_font_size) {
    let n = App.utilz.round(size, 1)
    opts.push({value: n, text: `${n}x`})
    size = App.utilz.round(size - 0.1, 1)
  }

  return opts
}

App.fill_settings = () => {
  let container = DOM.el(`#settings_container`)

  for (let key in App.user_settings) {
    let setting = App.user_settings[key]
    let c = DOM.create(`div`, `settings_item modal_item flex_column_center`)
    let title = DOM.create(`div`, `setting_title action`)
    c.dataset.setting = key
    c.title = setting.description
    title.textContent = setting.title

    DOM.ev(title, `click`, (e) => {
      App.reset_setting(key)
    })

    let ctx

    if (App.is_text_setting(key)) {
      ctx = title
    }
    else {
      ctx = c
    }

    DOM.ev(ctx, `contextmenu`, (e) => {
      e.preventDefault()
      App.reset_setting(key)
    })

    DOM.ev(ctx, `auxclick`, (e) => {
      if (e.button === 1) {
        App.reset_setting(key)
      }
    })

    c.append(title)
    let el

    if (setting.type === `select`) {
      el = DOM.create(`select`, `settings_item_control modal_select`, `settings_${key}`)

      for (let option of setting.options) {
        let o = DOM.create(`option`)
        o.value = option.value
        o.textContent = option.text
        el.append(o)
      }
    }
    else if (setting.type === `checkbox`) {
      el = DOM.create(`input`, `settings_item_control`, `settings_${key}`)
      el.type = `checkbox`
    }
    else if (setting.type === `text`) {
      el = DOM.create(`input`, `settings_item_control`, `settings_${key}`)
      el.placeholder = setting.placeholder
      el.type = `text`
    }
    else if (setting.type === `textarea`) {
      el = DOM.create(`textarea`, `settings_item_control`, `settings_${key}`)
      el.rows = 4
      el.placeholder = setting.placeholder
    }

    c.append(el)
    container.append(c)
  }
}

// Check if it's a text setting
App.is_text_setting = (key) => {
  let type = App.user_settings[key].type
  return [`text`, `textarea`].includes(type)
}

// Make background opacity options
App.opacity_options = () => {
  let opts = [
    {value: 0, text: `Auto`},
  ]

  let max = 95
  let min = 60
  let steps = 5

  for (let p = max; p >= min; p -= steps) {
    let o = App.utilz.round(p / 100, 1)
    opts.push({value: o, text: `${p}%`})
  }

  return opts
}