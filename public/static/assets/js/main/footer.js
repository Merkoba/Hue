// Setups more footer elements
Hue.setup_footer = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    Hue.ev(Hue.el(`#footer_${type}_icon`), "click", function () {
      Hue.show_media_picker(type)
    })

    Hue.ev(Hue.el(`#footer_${type}_icon`), "auxclick", function (e) {
      if (e.button === 1) {
        if (type === "image") {
          Hue.show_modal_image()
        }
      }
    })

    Hue.ev(Hue.el(`#footer_${type}_toggle`), "click", function () {
      Hue.set_media_enabled({type: type, what: !Hue.room_state[`${type}_enabled`]})
    })

    Hue.ev(Hue.el(`#footer_${type}_lock`), "click", function () {
      Hue.set_media_locked({type: type, what: !Hue[`${type}_locked`]})
    })

    Hue.ev(Hue.el(`#footer_${type}_prev`), "click", function () {
      Hue.load_prev_media(type)
    })

    Hue.ev(Hue.el(`#footer_${type}_next`), "click", function () {
      Hue.load_next_media(type)
    })

    Hue.ev(Hue.el(`#footer_${type}_list`), "click", function () {
      Hue[`msg_${type}_picker`].close()
      Hue[`show_${type}_list`]()
    })

    Hue.update_footer_toggle(type)
  }

  Hue.ev(Hue.el("#footer_radio_container"), "click", function () {
    Hue.show_radio()
  })

  Hue.ev(Hue.el("#footer_radio_container"), "auxclick", function (e) {
    if (e.button === 1) {
      Hue.radio_playstop()
    }
  })

  Hue.ev(Hue.el("#footer_items"), "click", function (e) {
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