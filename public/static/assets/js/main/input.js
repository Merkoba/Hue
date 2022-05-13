// On input change
Hue.on_input_change = function () {
  let input = Hue.el("#input")

  if (Hue.old_input_val !== input.value) {
    Hue.check_typing()
    Hue.old_input_val = input.value

    if (input.clientHeight < input.scrollHeight) {
      Hue.enable_footer_expand()
    }

    Hue.check_input_expand()
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
    }
  })

  Hue.el("#input").addEventListener("paste", function (e) {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items

    for (let index in items) {
      let item = items[index]

      if (item.kind === "file") {
        Hue.dropzone.addFile(item.getAsFile())
        e.preventDefault()
        return
      }
    }
  })

  Hue.old_input_val = Hue.get_input()
}

// Updates the input's placeholder
Hue.update_input_placeholder = function () {
  let s = `Hi ${Hue.username}, welcome to ${Hue.room_name}`

  if (Hue.topic) {
    s += `  -  ${Hue.topic}`
  }

  let np = Hue.radio_now_playing_string()
  
  if (np) {
    s += `  -  ${np}`
  }

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
  Hue.reset_input_history_index()
}

// Changes the input
Hue.change_input = function (s, to_end = true, focus = true) {
  Hue.disable_footer_expand()
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
  if (Hue.modal_open) {
    return
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
    Hue.process_input({
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
  Hue.process_input({message:`* ${text} *`})
}

// Process user's input messages
// Checks if it is a command and executes it
// Or sends a chat message to the server
Hue.process_input = function (args = {}) {
  let def_args = {
    message: "",
    to_history: true,
    clr_input: true,
    edit_id: false,
    handle_url: true,
    quote: "",
    quote_username: "",
    quote_user_id: "",
    quote_id: ""
  }

  args = Object.assign(def_args, args)

  if (!args.message.trim()) {
    return
  }

  args.message = Hue.utilz.remove_pre_empty_lines(args.message)
  args.message = Hue.utilz.remove_multiple_empty_lines(args.message)
  args.message = Hue.utilz.untab_string(args.message).trimEnd()

  let message_split = args.message.split("\n")
  let num_lines = message_split.length
  
  if (num_lines === 1 && Hue.is_command(args.message) && !args.edit_id) {
    let ans = Hue.execute_command(args.message, {
      to_history: args.to_history,
      clr_input: args.clr_input,
    })

    args.to_history = ans.to_history
    args.clr_input = ans.clr_input
  } else {
    if (args.message.length > Hue.config.max_input_length) {
      args.message = args.message.substring(0, Hue.config.max_input_length)
    }

    Hue.socket_emit("sendchat", {
      message: args.message,
      edit_id: args.edit_id,
      quote: args.quote,
      quote_username: args.quote_username,
      quote_user_id: args.quote_user_id,
      quote_id: args.quote_id
    })
  }

  if (args.to_history) {
    Hue.add_to_input_history(args.message)
  }

  if (args.clr_input) {
    Hue.clear_input()
  }
}

// Remove last input word
Hue.remove_last_input_word = function () {
  let input = Hue.el("#input")
  let split = input.value.trimEnd().split(" ")
  let new_value = split.slice(0, -1).join(" ") + " "
  
  if (new_value.trim() === "") {
    new_value = ""
  }

  input.value = new_value
  Hue.check_input_expand()
}

// Check input expand
Hue.check_input_expand = function () {
  if (!Hue.el("#input").value) {
    Hue.disable_footer_expand()
  }
}