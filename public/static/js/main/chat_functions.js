// Setup chat functions
Hue.setup_chat_functions = function () {
  $("#chat_functions_box_container").hover(
    function () {
      Hue.mouse_over_chat_functions = true
      clearTimeout(Hue.hide_chat_functions_timeout)
    },

    function () {
      Hue.mouse_over_chat_functions = false
      Hue.start_hide_chat_functions()
    }
  )

  $("#chat_area").click(function () {
    if (Hue.chat_functions_box_open) {
      Hue.hide_chat_functions_box()
    }
  })

  $("#input").click(function () {
    if (Hue.chat_functions_box_open) {
      Hue.hide_chat_functions_box()
    }
  })

  $("#chat_functions_react").click(function () {
    Hue.show_reaction_picker("chat")
    Hue.hide_chat_functions_box()
  })

  Hue.horizontal_separator.separate("chat_functions_box")
}

// Starts a timeout to hide the chat functions box when the mouse leaves the box
Hue.start_hide_chat_functions = function () {
  clearTimeout(Hue.show_chat_functions_timeout)

  Hue.hide_chat_functions_timeout = setTimeout(function () {
    if (Hue.mouse_over_chat_functions) {
      return false
    }

    Hue.hide_chat_functions_box()
  }, Hue.chat_functions_hover_delay)
}

// Shows the chat functions box
Hue.show_chat_functions_box = function () {
  if (!Hue.chat_functions_box_open) {
    $("#recent_input_box").html("")

    let max = Hue.get_setting("max_recent_input_items")

    if (max > 0) {
      let n = 0

      for (let item of Hue.input_history.slice(0).reverse()) {
        let m = item.message.trim()

        if (m.length > 100 || m.includes("\n")) {
          continue
        }

        let message = Hue.utilz.make_html_safe(m)
        let el = `<div class='recent_input_item action pointer'>${message}</div>`
        $("#recent_input_box").prepend(el)

        n += 1

        if (n >= max) {
          break
        }
      }
    }

    $("#chat_functions_box_container").css("display", "flex")
    Hue.chat_functions_box_open = true
  }
}

// Hides the chat functions box
Hue.hide_chat_functions_box = function () {
  if (Hue.chat_functions_box_open) {
    clearTimeout(Hue.hide_chat_functions_timeout)
    $("#chat_functions_box_container").css("display", "none")
    Hue.chat_functions_box_open = false
  }
}
