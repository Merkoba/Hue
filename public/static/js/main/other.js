// Show the Help window
Hue.show_help = function () {
  let help = Hue.template_help()
  Hue.msg_info2.show(["Help", help], function () {
    $('#help_commands').click(function () {
      Hue.show_commands()
    })
  })
}

// Copies a string to the clipboard
Hue.copy_string = function (s) {
  let textareaEl = document.createElement("textarea")

  document.body.appendChild(textareaEl)

  textareaEl.value = s
  textareaEl.select()

  document.execCommand("copy")
  document.body.removeChild(textareaEl)
}

// Feedback that an error occurred
Hue.error_occurred = function () {
  Hue.feedback("An error occurred")
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

  let canvas = document.createElement("canvas")

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

  let link = document.querySelector("link[rel*='icon']") || document.createElement('link')

  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = canvas.toDataURL()

  document.getElementsByTagName('head')[0].appendChild(link)
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

// Setups maxers
Hue.setup_maxers = function () {
  $(".maxer").attr("title", "Click or Shift+Wheel")
}