// On input change
Hue.on_input_change = function () {
  let input = Hue.el("#input")

  if (Hue.old_input_val !== input.value) {
    Hue.check_typing()
    Hue.old_input_val = input.value

    if (input.clientHeight < input.scrollHeight) {
      Hue.enable_footer_expand()
    }

    if (!input.value) {
      Hue.disable_footer_expand()
    }
  }
}

// Setups events for the main input
Hue.setup_input = function () {
  Hue.el("#input").addEventListener("input", function () {
    Hue.on_input_change()
  })

  Hue.el("#input").addEventListener("click", function () {
    if (Hue.editing_message) {
      Hue.stop_edit_message()
      Hue.check_scrollers()
    }
  })

  Hue.el("#input").addEventListener("paste", function (e) {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items

    for (let index in items) {
      let item = items[index]

      if (item.kind === "file") {
        Hue.dropzone.addFile(item.getAsFile())
        return
      }
    }
  })

  Hue.old_input_val = Hue.get_input()
}

// Updates the input's placeholder
Hue.update_input_placeholder = function () {
  let s = `Hi ${Hue.username}, write something to ${Hue.room_name}`
  Hue.el("#input").placeholder = s
}

// Clears the input
Hue.clear_input = function () {
  let val = Hue.get_input()

  if (val) {
    Hue.last_input_text = val
  }

  Hue.change_input("")
  Hue.old_input_val = ""
}

// Changes the input
Hue.change_input = function (s, to_end = true, focus = true) {
  Hue.el("#input").value = s

  if (to_end) {
    Hue.input_to_end()
  }

  if (focus) {
    Hue.focus_input()
  }

  Hue.on_input_change()
}

// Focuses the input
Hue.focus_input = function () {
  if (Hue.modal_open && !Hue.app_open) {
    return false
  }

  Hue.el("#input").focus()
}

// Removes focus on the input
Hue.blur_input = function () {
  Hue.el("#input").blur()
}

// Moves the input's caret to the end
Hue.input_to_end = function () {
  Hue.el("#input").scrollLeft = Hue.el("#input").scrollWidth
}

// Does a submit action from the input
Hue.submit_input = function () {
  let val = Hue.get_input()

  if (val) {
    Hue.process_message({
      message: Hue.get_input()
    })
  
    Hue.disable_footer_expand()
  }

  Hue.last_input_text = ""
}

// Get the input value
Hue.get_input = function () {
  return Hue.el("#input").value
}

// Turns this * into this *
Hue.input_to_thirdperson = function (text) {
  Hue.process_message({message:`* ${text} *`})
}