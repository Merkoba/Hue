// Additional media tweaks configurations
App.setup_media_tweaks = () => {
  App.ev(App.el(`#media_tweaks_swap`), `click`, () => {
    App.swap_media()
  })

  App.ev(App.el(`#media_tweaks_rotate`), `click`, () => {
    App.swap_media_layout()
  })

  App.ev(App.el(`#media_tweaks_revolve`), `click`, () => {
    App.change_main_layout()
  })

  App.ev(App.el(`#media_tweaks_tv_size`), `change`, () => {
    let size = App.el(`#media_tweaks_tv_size option:checked`).value
    App.do_media_tv_size_change(size)
  })

  App.ev(App.el(`#media_tweaks_chat_size`), `change`, () => {
    let size = App.el(`#media_tweaks_chat_size option:checked`).value
    App.do_chat_size_change(size)
  })

  App.ev(App.el(`#media_tweaks_chat_font_size`), `change`, () => {
    let size = App.el(`#media_tweaks_chat_font_size option:checked`).value
    App.do_chat_font_size_change(size)
  })

  App.ev(App.el(`#media_tweaks_media_info_enabled`), `change`, () => {
    let enabled = App.el(`#media_tweaks_media_info_enabled option:checked`).value === `enabled`
    App.set_media_info_enabled(enabled)
  })

  App.ev(App.el(`#media_tweaks_chat_enabled`), `change`, () => {
    let enabled = App.el(`#media_tweaks_chat_enabled option:checked`).value === `enabled`
    App.set_chat_enabled(enabled)
  })

  App.ev(App.el(`#media_tweaks_defaults`), `click`, () => {
    App.show_confirm(`Restore media tweak defaults`, () => {
      App.apply_media_tweaks_defaults()
    })
  })

  App.ev(App.el(`#media_tweaks_tv_size_minus`), `click`, () => {
    App.decrease_tv_percentage()
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_tv_size_plus`), `click`, () => {
    App.increase_tv_percentage()
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_chat_size_minus`), `click`, () => {
    App.decrease_chat_percentage()
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_chat_size_plus`), `click`, () => {
    App.increase_chat_percentage()
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_chat_font_size_minus`), `click`, () => {
    App.decrease_chat_font_size()
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_chat_font_size_plus`), `click`, () => {
    App.increase_chat_font_size()
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_media_info_enabled_minus`), `click`, () => {
    App.set_media_info_enabled(false)
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_media_info_enabled_plus`), `click`, () => {
    App.set_media_info_enabled(true)
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_chat_enabled_minus`), `click`, () => {
    App.set_chat_enabled(false)
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_chat_enabled_plus`), `click`, () => {
    App.set_chat_enabled(true)
    App.refresh_media_tweaks()
  })

  App.ev(App.el(`#media_tweaks_vertical_preset`), `click`, () => {
    App.show_confirm(`Apply vertical preset`, () => {
      App.change_media_layout(`row`)
      App.change_main_layout(`column`)
      App.do_chat_size_change(60)
      App.set_media_enabled({type: `image`, what: false})
      App.set_media_enabled({type: `tv`, what: true})
      App.refresh_media_tweaks()
    })
  })

  App.apply_media_percentages()
  App.apply_media_positions()
  App.change_media_layout()
}

// Percentages for media tweaks
App.create_tweaks_percentages = () => {
  let html = ``

  for (let p = App.media_max_percentage; p >= App.media_min_percentage; p -= 5) {
    html += `<option value='${p}'>${p}%</option>`
  }

  return html
}

// Chat sizes for media tweaks
App.create_tweaks_chat_font_sizes = () => {
  let html = ``
  let size = App.max_chat_font_size

  while (size >= App.min_chat_font_size) {
    let n = App.utilz.round(size, 1)
    html += `<option value='${n}'>${n}x</option>`
    size = App.utilz.round(size - 0.1, 1)
  }

  return html
}

// Shows the media tweaks
App.show_media_tweaks = () => {
  App.refresh_media_tweaks()
  App.msg_media_tweaks.show()
}

// Refresh media tweaks widgets
App.refresh_media_tweaks = () => {
  for (let el of App.els(`#media_tweaks_tv_size option`)) {
    if (el.value == App.room_state.tv_display_percentage) {
      el.selected = true
    }
  }

  for (let el of App.els(`#media_tweaks_chat_size option`)) {
    if (el.value == App.room_state.chat_display_percentage) {
      el.selected = true
    }
  }

  for (let el of App.els(`#media_tweaks_chat_font_size option`)) {
    if (el.value == App.room_state.chat_font_size) {
      el.selected = true
    }
  }

  for (let el of App.els(`#media_tweaks_media_info_enabled option`)) {
    if (App.room_state.media_info_enabled) {
      if (el.value === `enabled`) {
        el.selected = true
      }
    }
    else {
      if (el.value === `disabled`) {
        el.selected = true
      }
    }
  }

  for (let el of App.els(`#media_tweaks_chat_enabled option`)) {
    if (App.room_state.chat_enabled) {
      if (el.value === `enabled`) {
        el.selected = true
      }
    }
    else {
      if (el.value === `disabled`) {
        el.selected = true
      }
    }
  }
}

// Apply media defaults
App.apply_media_tweaks_defaults = () => {
  App.set_default_chat_font_size()
  App.set_default_tv_position()
  App.set_default_chat_enabled()
  App.set_default_media_info_enabled()
  App.set_media_enabled({type: `image`, what: true})
  App.set_media_enabled({type: `tv`, what: true})
  App.set_default_main_layout()
  App.set_default_media_layout()
  App.set_default_tv_size()
  App.set_default_chat_size()
  App.save_room_state()
  App.change_media_layout()
  App.apply_media_positions()
  App.refresh_media_tweaks()
}