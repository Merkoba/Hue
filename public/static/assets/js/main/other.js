// Copies a string to the clipboard
App.copy_string = (text, feedback = true) => {
  navigator.clipboard.writeText(text)

  if (feedback) {
    App.msg_info.show(`Copied to clipboard`)
  }
}

// Feedback that an error occurred
App.error_occurred = () => {
  App.checkmsg(`An error occurred`)
}

// Wrapper to show a confirmation dialog before running a function
App.needs_confirm = (func, s = false) => {
  if (!s) {
    s = `Are you sure?`
  }

  if (confirm(s)) {
    App[func]()
  }
}

// Wrapper to show a confirmation dialog before running a function
// This one takes a full function and not just the name
App.needs_confirm_2 = (func, s = false) => {
  if (!s) {
    s = `Are you sure?`
  }

  if (confirm(s)) {
    func()
  }
}

// Prints an informational console message
App.show_console_message = () => {
  let s = `🤔 Want to work with us? It's pretty much 99.99% risks, some negligible fraction AI, a couple bureaucracies to keep people minimally pissed off, and a whole lot of creativity.`
  let style = `font-size:1.4rem`
  App.utilz.loginfo(`%c${s}`, style)
}

// Dynamically generate a favicon
App.generate_favicon = (mode) => {
  let color

  if (mode === -1) {
    color = `#808080`
  }
  else if (mode === 0 || mode === 1) {
    color = `#C06DCF`
  }
  else if (mode === 2) {
    color = `#DD4A66`
  }
  else {
    return
  }

  let canvas = DOM.create(`canvas`)

  canvas.height = 256
  canvas.width = 256

  let context = canvas.getContext(`2d`)
  let center = canvas.height / 2
  let side, side2

  if (mode === -1 || mode === 0) {
    side = 112
    side2 = 114
  }
  else {
    side = 192
    side2 = 194
  }

  context.fillStyle = `rgb(16,16,16)`
  context.fillRect(center - (side2 / 2), center - (side2 / 2), side2, side2)
  context.fillStyle = color
  context.fillRect(center - (side / 2), center - (side / 2), side, side)

  let link = DOM.el(`link[rel*='icon']`) || DOM.create(`link`)

  link.type = `image/x-icon`
  link.rel = `shortcut icon`
  link.href = canvas.toDataURL()

  DOM.el(`head`).appendChild(link)
  App.favicon_mode = mode
}

// Centralized console info printer
App.loginfo = (message, style = ``) => {
  App.utilz.loginfo(`🤡 %c(${App.utilz.nice_date(Date.now())}) %c${message}`, `color:blue`, style)
}

// Centralized function to return a chat icon svg
App.get_chat_icon = (name) => {
  return `<svg class='chat_icon'><use href='#icon_${name}'></svg>`
}

// Centralized function to return an icon
App.get_icon = (name, cls = ``) => {
  return `<svg class='other_icon ${cls}'><use href='#icon_${name}'></svg>`
}

// Open view text
App.open_view_text = (text) => {
  App.msg_view_text.show()
  let text_el = DOM.el(`#view_text_text`)
  text_el.textContent = text
  App.urlize(text_el, false)
}

// Setup view text window
App.setup_view_text = () => {
  DOM.ev(DOM.el(`#view_text_copy`), `click`, () => {
    App.copy_string(DOM.el(`#view_text_text`).textContent)
    App.msg_view_text.close()
  })
}

// Rotate screen
App.flip = () => {
  if (App.flipped) {
    DOM.el(`#main_container`).classList.remove(`flipped`)
    App.flash_info(`Secret`, `You discovered the mirror`)
  }
  else {
    DOM.el(`#main_container`).classList.add(`flipped`)
  }

  App.flipped = !App.flipped
}

// Rotate media
App.flop = () => {
  if (App.flopped) {
    DOM.el(`#main_rows_container`).classList.remove(`flopped_column`)
    DOM.el(`#main_rows_container`).classList.remove(`flopped_row`)
    App.flash_info(`Secret`, `You discovered the other side`)
  }
  else if (App.get_setting(`main_layout`) === `column`) {
    DOM.el(`#main_rows_container`).classList.add(`flopped_column`)
  }
  else {
    DOM.el(`#main_rows_container`).classList.add(`flopped_row`)
  }

  App.flopped = !App.flopped
}

// Get the last 3 digits of a message id
// Mainly used to turn things goldtext
App.getcode = (s = ``) => {
  return s.slice(-3)
}

// Show that a command is not allowed
App.not_allowed = () => {
  App.checkmsg(`You don't have permission to run that command`)
}

// Item already included
App.item_already_included = () => {
  App.checkmsg(`Item already included`)
}

// Item included just now
App.item_included = () => {
  App.checkmsg(`Item included successfully`)
}

// Item is not included
App.item_not_included = () => {
  App.checkmsg(`Item is not included`)
}

// Item removed just now
App.item_removed = () => {
  App.checkmsg(`Item removed successfully`)
}

// Get first time
App.get_first_time = () => {
  App.first_time = App.get_local_storage(App.ls_first_time)

  if (App.first_time === null) {
    App.is_first_time = true
    App.first_time = {}
    App.first_time.date = Date.now()
    App.save_local_storage(App.ls_first_time, App.first_time)
  }
  else {
    App.is_first_time = false
  }
}