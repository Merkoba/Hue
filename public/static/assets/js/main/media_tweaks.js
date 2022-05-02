// Additional media tweaks configurations
Hue.setup_media_tweaks = function () {
  Hue.el("#media_tweaks_swap").addEventListener("click", function () {
    Hue.swap_media()
  })

  Hue.el("#media_tweaks_rotate").addEventListener("click", function () {
    Hue.rotate_media()
  })

  Hue.el("#media_tweaks_revolve").addEventListener("click", function () {
    Hue.change_main_layout()
  })   

  Hue.el("#media_tweaks_tv_size").addEventListener("change", function () {
    let size = Hue.el("#media_tweaks_tv_size option:checked").value
    Hue.do_media_tv_size_change(size)
  })

  Hue.el("#media_tweaks_chat_size").addEventListener("change", function () {
    let size = Hue.el("#media_tweaks_chat_size option:checked").value
    Hue.do_chat_size_change(size)
  })

  Hue.el("#media_tweaks_chat_font_size").addEventListener("change", function () {
    let size = Hue.el("#media_tweaks_chat_font_size option:checked").value
    Hue.do_chat_font_size_change(size)
  })

  Hue.el("#media_tweaks_media_info_enabled").addEventListener("change", function () {
    let enabled = Hue.el("#media_tweaks_media_info_enabled option:checked").value === "enabled"
    Hue.set_media_info_enabled(enabled)
  })

  Hue.el("#media_tweaks_chat_enabled").addEventListener("change", function () {
    let enabled = Hue.el("#media_tweaks_chat_enabled option:checked").value === "enabled"
    Hue.set_chat_enabled(enabled)
  })

  Hue.el("#media_tweaks_defaults").addEventListener("click", function () {
    Hue.apply_media_tweaks_defaults()
  })

  Hue.el("#media_tweaks_tv_size_minus").addEventListener("click", function () {
    Hue.decrease_tv_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_tv_size_plus").addEventListener("click", function () {
    Hue.increase_tv_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_chat_size_minus").addEventListener("click", function () {
    Hue.decrease_chat_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_chat_size_plus").addEventListener("click", function () {
    Hue.increase_chat_percentage()
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_chat_font_size_minus").addEventListener("click", function () {
    Hue.decrease_chat_font_size()
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_chat_font_size_plus").addEventListener("click", function () {
    Hue.increase_chat_font_size()
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_media_info_enabled_minus").addEventListener("click", function () {
    Hue.set_media_info_enabled(false)
    Hue.refresh_media_tweaks()
  })
  
  Hue.el("#media_tweaks_media_info_enabled_plus").addEventListener("click", function () {
    Hue.set_media_info_enabled(true)
    Hue.refresh_media_tweaks()
  })

  Hue.el("#media_tweaks_chat_enabled_minus").addEventListener("click", function () {
    Hue.set_chat_enabled(false)
    Hue.refresh_media_tweaks()
  })
  
  Hue.el("#media_tweaks_chat_enabled_plus").addEventListener("click", function () {
    Hue.set_chat_enabled(true)
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

  while(size >= Hue.min_chat_font_size) {
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
  Hue.toggle_media({type: "image", what: true})
  Hue.toggle_media({type: "tv", what: true})
  Hue.set_default_main_layout()
  Hue.set_default_media_layout()
  Hue.set_default_tv_size()
  Hue.set_default_chat_size()
  Hue.save_room_state()
  Hue.change_media_layout()
  Hue.apply_media_positions()
  Hue.refresh_media_tweaks()
}