// Copies a string to the clipboard
Hue.copy_string = function (text) {
  navigator.clipboard.writeText(text)
}

// Feedback that an error occurred
Hue.error_occurred = function () {
  Hue.checkmsg("An error occurred")
}

// Wrapper to show a confirmation dialog before running a function
Hue.needs_confirm = function (func, s = false) {
  if (!s) {
    s = "Are you sure?"
  }

  if (confirm(s)) {
    Hue[func]()
  }
}

// Wrapper to show a confirmation dialog before running a function
// This one takes a full function and not just the name
Hue.needs_confirm_2 = function (func, s = false) {
  if (!s) {
    s = "Are you sure?"
  }

  if (confirm(s)) {
    func()
  }
}

// Prints an informational console message
Hue.show_console_message = function () {
  let s =
    "🤔 Want to work with us? It's pretty much 99.99% risks, some negligible fraction AI, a couple bureaucracies to keep people minimally pissed off, and a whole lot of creativity."
  let style = "font-size:1.4rem"

  console.info(`%c${s}`, style)
}

// Dynamically generate a favicon
Hue.generate_favicon = function (mode) {
  let color
  
  if (mode === -1) {
    color = "#808080"
  } else if (mode === 0 || mode === 1) {
    color = "#C06DCF"
  } else if (mode === 2) {
    color = "#DD4A66"
  } else {
    return
  }

  let canvas = Hue.create("canvas")

  canvas.height = 256
  canvas.width = 256

  let context = canvas.getContext("2d")
  let center = canvas.height / 2
  let side, side2

  if (mode === -1 || mode === 0) {
    side = 112
    side2 = 114
  } else {
    side = 192
    side2 = 194
  }

  context.fillStyle = "rgb(16,16,16)"
  context.fillRect(center - (side2 / 2), center - (side2 / 2), side2, side2)
  context.fillStyle = color
  context.fillRect(center - (side / 2), center - (side / 2), side, side)

  let link = Hue.el("link[rel*='icon']") || Hue.create("link")

  link.type = "image/x-icon"
  link.rel = "shortcut icon"
  link.href = canvas.toDataURL()

  Hue.el("head").appendChild(link)
  Hue.favicon_mode = mode
}

// Centralized console info printer
Hue.loginfo = function (message, style="") {
  console.info(`🤡 %c(${Hue.utilz.nice_date(Date.now())}) %c${message}`, "color:blue", style)
}

// Centralized function to return a chat icon svg
Hue.get_chat_icon = function (name) {
  return `<svg class='chat_icon'><use href='#icon_${name}'></svg>`
}

// Centralized function to return an icon
Hue.get_icon = function (name, cls="") {
  return `<svg class='other_icon ${cls}'><use href='#icon_${name}'></svg>`
}

// Open view text
Hue.open_view_text = function (text) {
  Hue.msg_view_text.show(function () {
    let text_el = Hue.el("#view_text_text")
    text_el.textContent = text
    Hue.urlize(text_el, false)
  })  
}

// Setup view text window
Hue.setup_view_text = function () {
  Hue.ev(Hue.el("#view_text_copy"), "click", function () {
    Hue.copy_string(Hue.el("#view_text_text").textContent)
    Hue.msg_view_text.close()
  })
}

// Rotate screen
Hue.flip = function () {
  if (Hue.flipped) {
    Hue.el("#main_container").classList.remove("flipped")
    Hue.flash_info("Secret", "You discovered the mirror")
  } else {
    Hue.el("#main_container").classList.add("flipped")
  }

  Hue.flipped = !Hue.flipped
}

// Rotate media
Hue.flop = function () {
  if (Hue.flopped) {
    Hue.el("#main_rows_container").classList.remove("flopped_column")
    Hue.el("#main_rows_container").classList.remove("flopped_row")
    Hue.flash_info("Secret", "You discovered the other side")
  } else {
    if (Hue.room_state.main_layout === "column") {
      Hue.el("#main_rows_container").classList.add("flopped_column")
    } else {
      Hue.el("#main_rows_container").classList.add("flopped_row")
    }
  }

  Hue.flopped = !Hue.flopped
}

// Get the last 3 digits of a message id
// Mainly used to turn things goldtext
Hue.getcode = function (s = "") {
  return s.slice(-3) 
}

// Show that a command is not allowed
Hue.not_allowed = function () {
  Hue.checkmsg("You don't have permission to run that command")
}

// Item already included
Hue.item_already_included = function () {
  Hue.checkmsg("Item already included")
}

// Item included just now
Hue.item_included = function () {
  Hue.checkmsg("Item included successfully")
}

// Item is not included
Hue.item_not_included = function () {
  Hue.checkmsg("Item is not included")
}

// Item removed just now
Hue.item_removed = function () {
  Hue.checkmsg("Item removed successfully")
}