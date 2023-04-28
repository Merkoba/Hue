// Remove & add vertical or horizontal separators
App.apply_separator = (el, cls) => {
  App.els(`:scope > .separator`, el).forEach(it => {
    it.remove()
  })

  let elems = Array.from(el.children).filter(it => {
    return it.style.display !== `none` && !it.classList.contains(`nodisplay`)
  })

  for (let i=0; i<elems.length; i++) {
    if (i === elems.length - 1) {
      break
    }

    let sep = App.create(`div`, `separator`)
    sep.classList.add(cls)
    elems[i].insertAdjacentElement(`afterend`, sep)
  }
}

// Add horizontal separators
App.horizontal_separator = (el) => {
  App.apply_separator(el, `horizontal_separator`)
}

// Add vertical separators
App.vertical_separator = (el) => {
  App.apply_separator(el, `vertical_separator`)
}

// Applies separation to generic horizontal separator classes
App.setup_generic_separators = () => {
  App.els(`.generic_horizontal_separator`).forEach(it => {
    App.horizontal_separator(it)
  })

  App.els(`.generic_vertical_separator`).forEach(it => {
    App.vertical_separator(it)
  })
}

// This hides the loading animation and makes the main container visible
App.make_main_container_visible = () => {
  App.el(`#main_container`).style.opacity = 1
  App.el(`#main_container`).style.pointerEvents = `initial`
}

// Setups the confirm window
App.setup_confirm = () => {
  App.ev(App.el(`#confirm_button_confirm`), `click`, () => {
    App.on_confirm()
  })
}

// Shows the confirm window
App.show_confirm = (message, action, action_cancel) => {
  App.el(`#confirm_message`).textContent = message
  App.confirm_action = action
  App.confirm_action_cancel = action_cancel
  App.msg_confirm.show()
}

// On confirm action
App.on_confirm = () => {
  if (App.confirm_action) {
    App.confirm_action()
    App.confirm_action = undefined
    App.confirm_action_cancel = undefined
  }

  App.msg_confirm.close()
}

// On confirm cancel action
App.on_confirm_cancel = () => {
  if (App.confirm_action_cancel) {
    App.confirm_action_cancel()
    App.confirm_action_cancel = undefined
  }
}

// Simple window to display information
App.show_info = (info) => {
  App.msg_info.show(info)
}

// Show info window or show in chat
App.checkmsg = (s) => {
  if (App.modal_open) {
    App.show_info(s)
  }
  else {
    App.feedback(s)
  }
}

// Shows feedback with the current date in the nice date format
App.show_current_date = () => {
  App.checkmsg(App.utilz.nice_date())
}

// Start timeago checks
App.start_timeago = () => {
  setInterval(() => {
    App.timeago_action()
  }, App.timeago_delay)
}

// The timeago action
App.timeago_action = () => {
  App.els(`.chat_area`).forEach(it => {
    App.els(`.chat_timeago`, it).forEach(it2 => {
      let message = it2.closest(`.message`)
      it2.textContent = App.utilz.timeago(App.dataset(message, `date`))
    })
  })

  App.els(`#media .media_info_container`).forEach(it => {
    App.el(`.media_info_timeago`, it).textContent = App.utilz.timeago(App.dataset(it, `date`))
  })

  if (App.msg_modal_image.is_open()) {
    App.el(`#modal_image_header_info .modal_image_timeago`)
      .textContent = App.utilz.timeago(App.loaded_modal_image.date)
  }
}

// Show a message for a small time and close
App.flash_info = (title, text) => {
  let el = App.el(`#flash_info`)
  let text_el = App.el(`#flash_info_text`)
  text_el.textContent = text
  let title_el = App.el(`#flash_info_title_text`)
  title_el.textContent = title
  let icon_el = App.el(`#flash_info_title_icon`)
  jdenticon.update(icon_el, title)
  el.style.display = `flex`
  App.flash_info_timer()
}

// Hide the flash info window
App.hide_flash_info = () => {
  let el = App.el(`#flash_info`)
  el.style.display = `none`
}

// Get some element measurements
App.get_element_sizes = () => {
  App.panel_height = App.el(`#footer`).offsetHeight
}

// Setup item picker
App.setup_item_picker = () => {
  let container = App.el(`#item_picker_container`)

  App.ev(container, `click`, (e) => {
    let el = e.target.closest(`.item_picker_item`)

    if (el) {
      let item = App.dataset(el, `item`)
      App.item_picker_callback(item)
      App.msg_item_picker.close()
    }
  })
}

// Select an item from a list
App.show_item_picker = (title, items, callback) => {
  let container = App.el(`#item_picker_container`)
  container.innerHTML = ``

  for (let item of items) {
    let el = App.create(`div`, `item_picker_item nice_row pointer justify_center`)
    el.textContent = item
    App.dataset(el, `item`, item)
    container.append(el)
  }

  App.item_picker_callback = callback
  App.msg_item_picker.set_title(title)
  App.msg_item_picker.show()
}