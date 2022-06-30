// Setups more footer elements
Hue.setup_footer = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    Hue.el(`#footer_${type}_icon`).addEventListener("click", function () {
      Hue.show_media_picker(type)
    })

    Hue.el(`#footer_${type}_toggle`).addEventListener("click", function () {
      Hue.set_media_enabled({type: type, what: !Hue.room_state[`${type}_enabled`]})
    })

    Hue.el(`#footer_${type}_lock`).addEventListener("click", function () {
      Hue.set_media_locked({type: type, what: !Hue[`${type}_locked`]})
    })

    Hue.el(`#footer_${type}_prev`).addEventListener("click", function () {
      Hue.load_prev_media(type)
    })

    Hue.el(`#footer_${type}_next`).addEventListener("click", function () {
      Hue.load_next_media(type)
    })

    Hue.el(`#footer_${type}_list`).addEventListener("click", function () {
      Hue[`msg_${type}_picker`].close()
      Hue[`show_${type}_list`]()
    })

    Hue.update_footer_toggle(type)
  }

  if (Hue.config.radios.length > 0) {
    Hue.el("#footer_radio_icon_container").addEventListener("click", function () {
      Hue.toggle_radio()
    })

    Hue.el("#footer_radio_icon_container").addEventListener("auxclick", function (e) {
      if (e.which === 2) {
        Hue.radio_playstop()
      }
    })
  } else {
    Hue.el("#footer_radio_icon_container").remove()
  }

  Hue.el("#footer_items").addEventListener("click", function (e) {
    if (e.target === this) {
      Hue.el("#input").focus()
    }
  })
}

// Enabled footer expand
Hue.enable_footer_expand = function () {
  if (Hue.footer_expanded) {
    return
  }

  Hue.el("#footer").classList.add("footer_expanded")
  Hue.after_footer_expand_change()
}

// Disable footer expand
Hue.disable_footer_expand = function () {
  if (!Hue.footer_expanded) {
    return
  }

  Hue.el("#footer").classList.remove("footer_expanded")
  Hue.after_footer_expand_change()
}

// After footer expand change
Hue.after_footer_expand_change = function () {
  Hue.footer_expanded = !Hue.footer_expanded
  Hue.fix_frames()

  if (!Hue.get_input().trim()) {
    Hue.clear_input()
  }
}

// Update footer toggle
Hue.update_footer_toggle = function (type) {
  let val = Hue.room_state[`${type}_enabled`]
  
  if (val) {
    Hue.el(`#footer_${type}_toggle use`).href.baseVal = "#icon_toggle-on"
  } else {
    Hue.el(`#footer_${type}_toggle use`).href.baseVal = "#icon_toggle-off"
  }
}