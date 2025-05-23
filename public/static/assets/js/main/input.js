// On input change
App.on_input_change = () => {
  App.check_input_height()
  App.check_footer_expand()
}

// Check the input height to expand the footer
App.check_input_height = () => {
  let input = DOM.el(`#input`)

  if (input.clientHeight < input.scrollHeight) {
    App.enable_footer_expand()
  }
}

// Setups events for the main input
App.setup_input = () => {
  DOM.ev(DOM.el(`#input`), `input`, () => {
    App.on_input_change()
  })

  DOM.ev(DOM.el(`#input`), `paste`, (e) => {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items

    for (let index in items) {
      let item = items[index]

      if (item.kind === `file`) {
        let file = item.getAsFile()
        App.process_file_added_debouncer.call(file)
        e.preventDefault()
        return
      }
    }
  })

  DOM.ev(DOM.el(`#footer_input_menu`), `click`, (e) => {
    App.show_input_menu(e)
  })

  App.get_input_history()
}

// Updates the input's placeholder
App.update_input_placeholder = () => {
  let s = `Hi ${App.username}, welcome to ${App.room_name}`

  if (App.topic) {
    s += `  -  ${App.topic}`
  }

  let np = App.radio_now_playing_string()

  if (np) {
    s += `  -  ${np}`
  }

  App.set_input_placeholder(s)
}

// Set input placeholder
App.set_input_placeholder = (s) => {
  DOM.el(`#input`).placeholder = s
}

// Input has value
App.input_has_value = (trim) => {
  let s = App.get_input()

  if (trim) {
    s = s.trim()
  }

  return s !== ``
}

// Clears the input
App.clear_input = () => {
  if (App.input_has_value(true)) {
    App.room_state.last_input = App.get_input().substring(0, App.config.max_input_length)
    App.save_room_state()
  }

  if (App.input_has_value()) {
    App.change_input(``)
  }
}

// Changes the input
App.change_input = (s, to_end = true, focus = true) => {
  App.disable_footer_expand()
  DOM.el(`#input`).value = s

  if (to_end) {
    App.input_to_end()
  }

  if (focus) {
    App.focus_input()
  }

  App.on_input_change()
}

// Focuses the input
App.focus_input = () => {
  if (App.modal_open) {
    return
  }

  DOM.el(`#input`).focus()
}

// Removes focus on the input
App.blur_input = () => {
  DOM.el(`#input`).blur()
}

// Moves the input's caret to the end
App.input_to_end = () => {
  DOM.el(`#input`).scrollLeft = DOM.el(`#input`).scrollWidth
}

// Does a submit action from the input
App.submit_input = () => {
  if (App.reply_active) {
    App.submit_reply()
  }
  else if (App.edit_active) {
    App.submit_edit()
  }
  else if (App.input_has_value()) {
    if (!App.input_has_value(true)) {
      App.clear_input()
      return
    }

    App.process_input({
      message: App.get_input(),
    })

    App.disable_footer_expand()
  }
}

// Get the input value
App.get_input = () => {
  return DOM.el(`#input`).value
}

// Turns this * into this *
App.input_to_thirdperson = (text) => {
  App.process_input({message: `* ${text} *`})
}

// Process user's input messages
// Checks if it is a command and executes it
// Or sends a chat message to the server
App.process_input = (args = {}) => {
  let def_args = {
    clr_input: true,
    automedia: true,
  }

  App.utilz.def_args(def_args, args)

  if (!args.message.trim()) {
    return
  }

  args.message = App.utilz.remove_pre_empty_lines(args.message)
  args.message = App.utilz.remove_multiple_empty_lines(args.message)
  args.message = App.utilz.untab_string(args.message).trimEnd()

  let message_split = args.message.split(`\n`)
  let num_lines = message_split.length

  if ((num_lines === 1) && App.is_command(args.message) && !args.edit_id) {
    let ans = App.execute_command(args.message, {
      clr_input: args.clr_input,
    })

    args.clr_input = ans.clr_input
  }
  else {
    if (!App.check_limited()) {
      return
    }

    if (args.message.length > App.config.max_input_length) {
      args.message = args.message.substring(0, App.config.max_input_length)
    }

    if (args.automedia && App.get_setting(`automedia`)) {
      if (App.automedia(args)) {
        return
      }
    }

    App.push_to_autocomplete(args.message)

    App.socket_emit(`sendchat`, {
      message: args.message,
      edit_id: args.edit_id,
      quote: args.quote,
      quote_username: args.quote_username,
      quote_user_id: args.quote_user_id,
      quote_id: args.quote_id,
    })
  }

  App.push_to_input_history(args.message)

  if (args.clr_input) {
    App.clear_input()
  }
}

// Add a new line at the end of the input
App.add_input_new_line = () => {
  let value = App.get_input()

  if (value) {
    App.change_input(App.get_input() + `\n`)
  }
}

// Get input history from local storage
App.get_input_history = () => {
  App.input_history = App.get_local_storage(App.ls_input_history)

  if (App.input_history === null) {
    App.input_history = []
  }
}

// Save input history
App.save_input_history = (force = true) => {
  App.save_local_storage(App.ls_input_history, App.input_history, force)
}

// Push to input history
App.push_to_input_history = (message) => {
  App.input_history = App.input_history
    .filter(x => x.message !== message)
    .slice(0, App.config.max_input_history)

  App.input_history.unshift({message, date: Date.now()})
  App.save_input_history()
}

// Show input history
App.show_input_history = (filter = ``) => {
  let container = DOM.el(`#input_history_container`)
  container.innerHTML = ``
  App.selected_modal_item = undefined

  for (let item of App.input_history) {
    let el = DOM.create(`div`, `nice_row modal_item pointer input_history_item`)
    el.title = App.nice_date(item.date)
    let text = DOM.create(`div`)
    text.textContent = item.message
    App.urlize(text, true, true)
    el.append(text)

    DOM.ev(el, `click`, (e) => {
      if (e.target.tagName === `A`) {
        return
      }

      App.input_history_enter_action(el)
    })

    container.append(el)
  }

  App.msg_input_history.show()
  DOM.el(`#input_history_filter`).value = filter
  App.do_modal_filter()
}

// Pick the first input history item
App.first_input_history = () => {
  if (!App.input_history.length) {
    return
  }

  App.change_input(App.input_history[0].message)
}

// Input history enter action
App.input_history_enter_action = (el) => {
  if (!el) {
    el = App.selected_modal_item
  }

  if (!el) {
    el = DOM.el(`.input_history_item`)
  }

  if (!el) {
    return
  }

  App.change_input(el.textContent)
  App.msg_input_history.close()
}