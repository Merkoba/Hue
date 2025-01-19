// Remove & add vertical or horizontal separators
App.apply_separator = (el, cls) => {
  for (let sep of DOM.els(`:scope > .separator`, el)) {
    sep.remove()
  }

  let elems = Array.from(el.children).filter(it => {
    return it.style.display !== `none` && !it.classList.contains(`nodisplay`)
  })

  for (let i = 0; i < elems.length; i++) {
    if (i === elems.length - 1) {
      break
    }

    let sep = DOM.create(`div`, `separator`)
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
  for (let el of DOM.els(`.generic_horizontal_separator`)) {
    App.horizontal_separator(el)
  }

  for (let el of DOM.els(`.generic_vertical_separator`)) {
    App.vertical_separator(el)
  }
}

// This hides the loading animation and makes the main container visible
App.make_main_container_visible = () => {
  DOM.el(`#main_container`).classList.remove(`loading`)
}

// Setups the confirm window
App.setup_confirm = () => {
  DOM.ev(DOM.el(`#confirm_button_confirm`), `click`, () => {
    App.on_confirm()
  })
}

// Shows the confirm window
App.show_confirm = (message, action, action_cancel) => {
  DOM.el(`#confirm_message`).textContent = message
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

// Show a message for a small time and close
App.flash_info = (title, text) => {
  let el = DOM.el(`#flash_info`)
  let text_el = DOM.el(`#flash_info_text`)
  text_el.textContent = text
  let title_el = DOM.el(`#flash_info_title_text`)
  title_el.textContent = title
  let icon_el = DOM.el(`#flash_info_title_icon`)
  jdenticon.update(icon_el, title)
  el.style.display = `flex`
  App.flash_info_debouncer.call()
}

// Hide the flash info window
App.hide_flash_info = () => {
  DOM.hide(`#flash_info`)
}

// Get some element measurements
App.get_element_sizes = () => {
  App.panel_height = DOM.el(`#footer`).offsetHeight
}

// Setup item picker
App.setup_item_picker = () => {
  let container = DOM.el(`#item_picker_container`)

  DOM.ev(container, `click`, (e) => {
    let el = e.target.closest(`.item_picker_item`)

    if (el) {
      let item = DOM.dataset(el, `item`)
      App.item_picker_callback(item)
      App.msg_item_picker.close()
    }
  })
}

// Select an item from a list
App.show_item_picker = (title, items, callback) => {
  let container = DOM.el(`#item_picker_container`)
  container.innerHTML = ``

  for (let item of items) {
    let el = DOM.create(`div`, `item_picker_item nice_row pointer justify_center`)
    el.textContent = item
    DOM.dataset(el, `item`, item)
    container.append(el)
  }

  App.item_picker_callback = callback
  App.msg_item_picker.set_title(title)
  App.msg_item_picker.show()
}