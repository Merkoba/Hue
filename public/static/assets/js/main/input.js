// On input change
Hue.on_input_change = () => {
  let input = Hue.el(`#input`)

  if (input.clientHeight < input.scrollHeight) {
    Hue.enable_footer_expand()
  }

  Hue.check_footer_expand()
}

// Setups events for the main input
Hue.setup_input = () => {
  Hue.ev(Hue.el(`#input`), `input`, () => {
    Hue.on_input_change()
  })

  Hue.ev(Hue.el(`#input`), `paste`, (e) => {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items

    for (let index in items) {
      let item = items[index]

      if (item.kind === `file`) {
        Hue.dropzone.addFile(item.getAsFile())
        e.preventDefault()
        return
      }
    }
  })

  Hue.ev(Hue.el(`#footer_input_menu`), `click`, (e) => {
    Hue.show_input_menu(e)
  })

  Hue.get_input_history()
}

// Updates the input's placeholder
Hue.update_input_placeholder = () => {
  let s = `Hi ${Hue.username}, welcome to ${Hue.room_name}`

  if (Hue.topic) {
    s += `  -  ${Hue.topic}`
  }

  let np = Hue.radio_now_playing_string()

  if (np) {
    s += `  -  ${np}`
  }

  Hue.set_input_placeholder(s)
}

// Set input placeholder
Hue.set_input_placeholder = (s) => {
  Hue.el(`#input`).placeholder = s
}

// Input has value
Hue.input_has_value = (trim) => {
  let s = Hue.get_input()

  if (trim) {
    s = s.trim()
  }

  return s !== ``
}

// Clears the input
Hue.clear_input = () => {
  if (Hue.input_has_value(true)) {
    Hue.room_state.last_input = Hue.get_input().substring(0, Hue.config.max_input_length)
    Hue.save_room_state()
  }

  if (Hue.input_has_value()) {
    Hue.change_input(``)
  }
}

// Changes the input
Hue.change_input = (s, to_end = true, focus = true) => {
  Hue.disable_footer_expand()
  Hue.el(`#input`).value = s

  if (to_end) {
    Hue.input_to_end()
  }

  if (focus) {
    Hue.focus_input()
  }

  Hue.on_input_change()
}

// Focuses the input
Hue.focus_input = () => {
  if (Hue.modal_open) {
    return
  }

  Hue.el(`#input`).focus()
}

// Removes focus on the input
Hue.blur_input = () => {
  Hue.el(`#input`).blur()
}

// Moves the input's caret to the end
Hue.input_to_end = () => {
  Hue.el(`#input`).scrollLeft = Hue.el(`#input`).scrollWidth
}

// Does a submit action from the input
Hue.submit_input = () => {
  if (Hue.reply_active) {
    Hue.submit_reply()
  }
  else if (Hue.edit_active) {
    Hue.submit_edit()
  }
  else {
    if (Hue.input_has_value()) {
      if (!Hue.input_has_value(true)) {
        Hue.clear_input()
        return
      }

      Hue.process_input({
        message: Hue.get_input()
      })

      Hue.disable_footer_expand()
    }
  }
}

// Get the input value
Hue.get_input = () => {
  return Hue.el(`#input`).value
}

// Turns this * into this *
Hue.input_to_thirdperson = (text) => {
  Hue.process_input({message: `* ${text} *`})
}

// Process user's input messages
// Checks if it is a command and executes it
// Or sends a chat message to the server
Hue.process_input = (args = {}) => {
  let def_args = {
    clr_input: true
  }

  args = Object.assign(def_args, args)

  if (!args.message.trim()) {
    return
  }

  args.message = Hue.utilz.remove_pre_empty_lines(args.message)
  args.message = Hue.utilz.remove_multiple_empty_lines(args.message)
  args.message = Hue.utilz.untab_string(args.message).trimEnd()

  let message_split = args.message.split(`\n`)
  let num_lines = message_split.length

  if (num_lines === 1 && Hue.is_command(args.message) && !args.edit_id) {
    let ans = Hue.execute_command(args.message, {
      clr_input: args.clr_input,
    })

    args.clr_input = ans.clr_input
  }
  else {
    if (args.message.length > Hue.config.max_input_length) {
      args.message = args.message.substring(0, Hue.config.max_input_length)
    }

    Hue.socket_emit(`sendchat`, {
      message: args.message,
      edit_id: args.edit_id,
      quote: args.quote,
      quote_username: args.quote_username,
      quote_user_id: args.quote_user_id,
      quote_id: args.quote_id
    })
  }

  Hue.push_to_input_history(args.message)

  if (args.clr_input) {
    Hue.clear_input()
  }
}

// Check input expand
Hue.check_footer_expand = () => {
  if (!Hue.input_has_value()) {
    Hue.disable_footer_expand()
  }
}

// Add a new line at the end of the input
Hue.add_input_new_line = () => {
  Hue.change_input(Hue.get_input() + `\n`)
}

// Get input history from local storage
Hue.get_input_history = () => {
  Hue.input_history = Hue.get_local_storage(Hue.ls_input_history)

  if (Hue.input_history === null) {
    Hue.input_history = []
  }
}

// Save input history
Hue.save_input_history = (force = true) => {
  Hue.save_local_storage(Hue.ls_input_history, Hue.input_history, force)
}

// Push to input history
Hue.push_to_input_history = (message) => {
  Hue.input_history = Hue.input_history
    .filter(x => x !== message)
    .slice(0, Hue.config.max_input_history)

  Hue.input_history.unshift({message: message, date: Date.now()})
  Hue.save_input_history()
}

// Show input history
Hue.show_input_history = (filter = ``) => {
  let container = Hue.el(`#input_history_container`)
  container.innerHTML = ``

  for (let item of Hue.input_history) {
    let el = Hue.create(`div`, `nice_row modal_item pointer`)
    el.textContent = item.message
    el.title = Hue.utilz.nice_date(item.date)

    Hue.ev(el, `click`, () => {
      Hue.change_input(item.message)
      Hue.msg_input_history.close()
    })

    container.append(el)
  }

  Hue.msg_input_history.show(() => {
    if (filter.trim()) {
      Hue.el(`#input_history_filter`).value = filter
      Hue.do_modal_filter()
    }
  })
}