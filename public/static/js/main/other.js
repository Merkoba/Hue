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
Hue.copy_string = function (s, sound = true) {
  let textareaEl = document.createElement("textarea")

  document.body.appendChild(textareaEl)

  textareaEl.value = s
  textareaEl.select()

  document.execCommand("copy")
  document.body.removeChild(textareaEl)

  if (sound) {
    Hue.play_audio("pup2")
  }
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

// Show the credits
Hue.show_credits = function () {
  Hue.msg_credits.show(function () {
    if (!Hue.credits_audio) {
      Hue.credits_audio = new Audio()
      Hue.credits_audio.src = Hue.config.credits_audio_url
      Hue.credits_audio.setAttribute("loop", true)
      Hue.credits_audio.play()
    } else {
      Hue.credits_audio.currentTime = 0
      Hue.credits_audio.play()
    }
  })
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

  if (mode === 0) {
    color = "#C06DCF"
  } else if (mode === 1) {
    color = "#4AB3DD"
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
  let side = 192
  let side2 = 194

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

// Apply favicon mode if necesssary
Hue.check_favicon = function (mode=undefined) {
  if (mode !== undefined) {
    if (mode > Hue.favicon_mode) {
      Hue.generate_favicon(mode)
    }
  } else {
    if (Hue.alert_mode !== Hue.favicon_mode) {
      Hue.generate_favicon(Hue.alert_mode)
    }
  }
}