// On input change
Hue.on_input_change = function () {
  let input = $("#input")[0]
  let value = $(input).val()
  if (Hue.old_input_val !== value) {
    Hue.check_typing()
    Hue.old_input_val = value

    if (input.clientHeight < input.scrollHeight) {
      Hue.enable_footer_expand()
    }

    if (!value) {
      Hue.disable_footer_expand()
    }
  }
}

// Setups events for the main input
Hue.setup_input = function () {
  $("#input").on("input", function () {
    Hue.on_input_change()
  })

  $("#input").on("click", function () {
    if (Hue.editing_message) {
      Hue.stop_edit_message()
    }
  })

  $("#input").on("focus", function () {
    if (Hue.context_menu_open) {
      $(".context-menu-list").trigger("contextmenu:hide")
    }
  })

  $("#input").on("paste", function (e) {
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
  $("#input").attr("placeholder", s)
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
  $("#input").val(s)

  if (to_end) {
    Hue.input_to_end()
  }

  if (focus) {
    Hue.focus_input()
  }
}

// Focuses the input
Hue.focus_input = function () {
  if (Hue.modal_open) {
    return false
  }

  $("#input").trigger("focus")
}

// Removes focus on the input
Hue.blur_input = function () {
  $("#input").trigger("blur")
}

// Moves the input's caret to the end
Hue.input_to_end = function () {
  $("#input")[0].scrollLeft = $("#input")[0].scrollWidth
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
  return $("#input").val()
}

// Turns this * into this *
Hue.input_to_thirdperson = function (text) {
  Hue.process_message({message:`* ${text} *`})
}