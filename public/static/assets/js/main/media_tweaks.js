// Additional media tweaks configurations
Hue.setup_media_tweaks = function () {
  Hue.ev(Hue.el("#media_tweaks_swap"), "click", function () {
    Hue.swap_media()
  })

  Hue.ev(Hue.el("#media_tweaks_rotate"), "click", function () {
    Hue.swap_media_layout()
  })

  Hue.ev(Hue.el("#media_tweaks_revolve"), "click", function () {
    Hue.change_main_layout()
  })   

  Hue.ev(Hue.el("#media_tweaks_tv_size"), "change", function () {
    let size = Hue.el("#media_tweaks_tv_size option:checked").value
    Hue.do_media_tv_size_change(size)
  })

  Hue.ev(Hue.el("#media_tweaks_chat_size"), "change", function () {
    let size = Hue.el("#media_tweaks_chat_size option:checked").value
    Hue.do_chat_size_change(size)
  })

  Hue.ev(Hue.el("#media_tweaks_chat_font_size"), "change", function () {
    let size = Hue.el("#media_tweaks_chat_font_size option:checked").value
    Hue.do_chat_font_size_change(size)
  })

  Hue.ev(Hue.el("#media_tweaks_media_info_enabled"), "change", function () {
    let enabled = Hue.el("#media_tweaks_media_info_enabled option:checked").value === "enabled"
    Hue.set_media_info_enabled(enabled)
  })

  Hue.ev(Hue.el("#media_tweaks_chat_enabled"), "change", function () {
    let enabled = Hue.el("#media_tweaks_chat_enabled option:checked").value === "enabled"
    Hue.set_chat_enabled(enabled)
  })

  Hue.ev(Hue.el("#media_tweaks_defaults"), "click", function () {
    Hue.apply_media_tweaks_defaults()
  })

  Hue.ev(Hue.el("#media_tweaks_tv_size_minus"), "click", function () {
    Hue.decrease_tv_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_tv_size_plus"), "click", function () {
    Hue.increase_tv_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_chat_size_minus"), "click", function () {
    Hue.decrease_chat_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_chat_size_plus"), "click", function () {
    Hue.increase_chat_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_chat_font_size_minus"), "click", function () {
    Hue.decrease_chat_font_size()
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_chat_font_size_plus"), "click", function () {
    Hue.increase_chat_font_size()
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_media_info_enabled_minus"), "click", function () {
    Hue.set_media_info_enabled(false)
    Hue.refresh_media_tweaks()
  })
  
  Hue.ev(Hue.el("#media_tweaks_media_info_enabled_plus"), "click", function () {
    Hue.set_media_info_enabled(true)
    Hue.refresh_media_tweaks()
  })

  Hue.ev(Hue.el("#media_tweaks_chat_enabled_minus"), "click", function () {
    Hue.set_chat_enabled(false)
    Hue.refresh_media_tweaks()
  })
  
  Hue.ev(Hue.el("#media_tweaks_chat_enabled_plus"), "click", function () {
    Hue.set_chat_enabled(true)
    Hue.refresh_media_tweaks()
  })
  
  Hue.ev(Hue.el("#media_tweaks_vertical_preset"), "click", function () {
    Hue.change_media_layout("row")
    Hue.change_main_layout("column")
    Hue.do_chat_size_change(60)
    Hue.set_media_enabled({type: "image", what: false})
    Hue.set_media_enabled({type: "tv", what: true})
    Hue.refresh_media_tweaks()
  })

  Hue.apply_media_percentages()
  Hue.apply_media_positions()
  Hue.change_media_layout()
}

// Percentages for media tweaks
Hue.create_tweaks_percentages = function () {
  let html = ""

  for (let p = Hue.media_max_percentage; p >= Hue.media_min_percentage; p -= 5) {
    html += `<option value='${p}'>${p}%</option>`
  }

  return html
}

// Chat sizes for media tweaks
Hue.create_tweaks_chat_font_sizes = function () {
  let html = ""
  let size = Hue.max_chat_font_size

  while (size >= Hue.min_chat_font_size) {
    let n = Hue.utilz.round(size, 1)
    html += `<option value='${n}'>${n}x</option>`
    size = Hue.utilz.round(size - 0.1, 1)
  }

  return html
}

// Shows the media tweaks
Hue.show_media_tweaks = function () {
  Hue.refresh_media_tweaks()  
  Hue.msg_media_tweaks.show()
}

// Refresh media tweaks widgets
Hue.refresh_media_tweaks = function () {
  Hue.els("#media_tweaks_tv_size option").forEach(it => {
    if (it.value == Hue.room_state.tv_display_percentage) {
      it.selected = true
    }
  })

  Hue.els("#media_tweaks_chat_size option").forEach(it => {
    if (it.value == Hue.room_state.chat_display_percentage) {
      it.selected = true
    }
  })

  Hue.els("#media_tweaks_chat_font_size option").forEach(it => {
    if (it.value == Hue.room_state.chat_font_size) {
      it.selected = true
    }
  })

  Hue.els("#media_tweaks_media_info_enabled option").forEach(it => {
    if (Hue.room_state.media_info_enabled) {
      if (it.value === "enabled") {
        it.selected = true
      }
    } else {
      if (it.value === "disabled") {
        it.selected = true
      }
    }
  })

  Hue.els("#media_tweaks_chat_enabled option").forEach(it => {
    if (Hue.room_state.chat_enabled) {
      if (it.value === "enabled") {
        it.selected = true
      }
    } else {
      if (it.value === "disabled") {
        it.selected = true
      }
    }
  })
}

// Apply media defaults
Hue.apply_media_tweaks_defaults = function () {
  Hue.set_default_chat_font_size()
  Hue.set_default_tv_position()
  Hue.set_default_chat_enabled()
  Hue.set_default_media_info_enabled()
  Hue.set_media_enabled({type: "image", what: true})
  Hue.set_media_enabled({type: "tv", what: true})
  Hue.set_default_main_layout()
  Hue.set_default_media_layout()
  Hue.set_default_tv_size()
  Hue.set_default_chat_size()
  Hue.save_room_state()
  Hue.change_media_layout()
  Hue.apply_media_positions()
  Hue.refresh_media_tweaks()
}