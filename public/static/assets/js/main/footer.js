// Setups more footer elements
Hue.setup_footer = () => {
  let media = [`image`, `tv`]

  for (let type of media) {
    Hue.ev(Hue.el(`#footer_${type}_icon`), `click`, () => {
      Hue.show_media_picker(type)
    })

    Hue.ev(Hue.el(`#footer_${type}_icon`), `auxclick`, (e) => {
      if (e.button === 1) {
        if (type === `image`) {
          Hue.show_modal_image()
        }
      }
    })

    Hue.ev(Hue.el(`#footer_${type}_toggle`), `click`, () => {
      Hue.set_media_enabled({type: type, what: !Hue.room_state[`${type}_enabled`]})
    })

    Hue.ev(Hue.el(`#footer_${type}_lock`), `click`, () => {
      Hue.set_media_locked({type: type, what: !Hue[`${type}_locked`]})
    })

    Hue.ev(Hue.el(`#footer_${type}_list`), `click`, () => {
      Hue[`msg_${type}_picker`].close()
      Hue[`show_${type}_list`]()
    })

    Hue.update_footer_toggle(type)
  }

  Hue.ev(Hue.el(`#footer_radio_container`), `click`, () => {
    Hue.show_radio()
  })

  Hue.ev(Hue.el(`#footer_radio_container`), `auxclick`, (e) => {
    if (e.button === 1) {
      Hue.radio_playstop()
    }
  })

  let footer_items = Hue.el(`#footer_items`)

  Hue.ev(footer_items, `click`, (e) => {
    if (e.target === footer_items) {
      Hue.el(`#input`).focus()
    }
  })

  Hue.ev(Hue.el(`#footer_input_menu`), `auxclick`, (e) => {
    if (e.which === 2) {
      Hue.flop()
    }
  })
}

// Enabled footer expand
Hue.enable_footer_expand = () => {
  if (Hue.footer_expanded) {
    return
  }

  Hue.el(`#footer`).classList.add(`footer_expanded`)
  Hue.after_footer_expand_change()
}

// Disable footer expand
Hue.disable_footer_expand = () => {
  if (!Hue.footer_expanded) {
    return
  }

  Hue.el(`#footer`).classList.remove(`footer_expanded`)
  Hue.after_footer_expand_change()
}

// After footer expand change
Hue.after_footer_expand_change = () => {
  Hue.footer_expanded = !Hue.footer_expanded
  Hue.fix_frames()
}

// Update footer toggle
Hue.update_footer_toggle = (type) => {
  let val = Hue.room_state[`${type}_enabled`]

  if (val) {
    Hue.el(`#footer_${type}_toggle use`).href.baseVal = `#icon_toggle-on`
  }
  else {
    Hue.el(`#footer_${type}_toggle use`).href.baseVal = `#icon_toggle-off`
  }
}

// Highlight the footer
// Highlight input
Hue.highlight_footer = () => {
  clearTimeout(Hue.highlight_footer_timeout)
  Hue.el(`#footer`).classList.add(`flash_highlight`)

  Hue.highlight_footer_timeout = setTimeout(() => {
    Hue.el(`#footer`).classList.remove(`flash_highlight`)
  }, Hue.highlight_footer_delay)
}