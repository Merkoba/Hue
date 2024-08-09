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
        {value: `absolute_12`, text: `Absolute`},
        {value: `absolute_24`, text: `Absolute`},
      ],
      version: 1,
    },
    radio_auto_minutes: {
      title: `Radio Auto Minutes`,
      type: `select`,
      force_int: true,
      description: `Change the radio after these minutes`,
      actions: () => {},
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
    arrowtext: {
      title: `Arrow Text`,
      type: `checkbox`,
      description: `Whether to style arrowtext`,
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
    text_glow: {
      title: `Text Glow`,
      type: `checkbox`,
      description: `Show a glow effect on all text`,
      actions: () => {
        App.apply_theme()
      },
      version: 1,
    },
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
App.modify_setting_widget = (setting) => {
  let type = App.user_settings[setting].type
  let item = DOM.el(`#settings_${setting}`)

  if (type === `checkbox`) {
    item.checked = App.get_setting(setting)
  }
  else if (type === `select`) {
    App.set_select(item, App.get_setting(setting))
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
      user_setting.type === `checkbox` ||
      user_setting.type === `select`
    ) {
      DOM.ev(item, `change`, () => {
        App.on_setting_change(setting)
      })
    }
    else if (
      user_setting.type === `textarea` ||
      user_setting.type === `text`
    ) {
      DOM.ev(item, `blur`, () => {
        App.on_setting_change(setting)
      })
    }
    else if (
      user_setting.type === `number` ||
      user_setting.type === `color`
    ) {
      DOM.ev(item, `change`, () => {
        App.on_setting_change(setting)
      })
    }
    else if (user_setting.type === `range`) {
      DOM.ev(item, `input change`, () => {
        App.on_setting_change(setting)
      })
    }
  }
}

App.on_setting_change = (setting) => {
  let user_setting = App.user_settings[setting]
  let el = DOM.el(`#settings_${setting}`)

  if (user_setting.type === `checkbox`) {
    value = el.checked
  }
  else if (user_setting.type === `select`) {
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

  if (user_setting.type === `select`) {
    App.set_select(control, App.get_default_setting(setting))
  }
  else if (user_setting.type === `checkbox`) {
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

// Set default setting
App.set_default_setting = (setting) => {
  App.settings[setting].value = App.config[`settings_default_${setting}`]
  App.save_settings()
}

App.create_settings_percentages = () => {
  let opts = []

  for (let p=App.media_max_percentage; p>=App.media_min_percentage; p-=5) {
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
    c.dataset.setting = key
    let title = DOM.create(`div`, `setting_title action`)
    title.title = setting.description
    title.textContent = setting.title

    DOM.ev(title, `click`, (e) => {
      App.show_confirm(`Restore default setting`, () => {
        App.set_default_setting(key)
        App.modify_setting_widget(key)

        if (setting.actions) {
          setting.actions()
        }
      })
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

    c.append(el)
    container.append(c)
  }
}