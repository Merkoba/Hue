// Get input history
Hue.get_input_history = function () {
  Hue.input_history = Hue.get_local_storage(Hue.ls_input_history)

  if (Hue.input_history === null) {
    Hue.input_history = []
  }

  Hue.reset_input_history_index()
}

// Saves the input history localStorage object
Hue.save_input_history = function (force = false) {
  Hue.save_local_storage(Hue.ls_input_history, Hue.input_history, force)
}

// Adds an item to the input history
Hue.add_to_input_history = function (message, change_index = true) {
  for (let i = 0; i < Hue.input_history.length; i++) {
    if (Hue.input_history[i].message === message) {
      Hue.input_history.splice(i, 1)
      break
    }
  }

  let date = Date.now()
  let item = { message: message, date: date }

  Hue.input_history.push(item)

  if (Hue.input_history.length > Hue.config.input_history_crop_limit) {
    Hue.input_history = Hue.input_history.slice(
      Hue.input_history.length - Hue.config.input_history_crop_limit
    )
  }

  if (change_index) {
    Hue.reset_input_history_index()
  }

  Hue.save_input_history()
}

// Resets the input history item index
// This index is used to determine what to show on 'up' or 'down' actions in the input
Hue.reset_input_history_index = function () {
  Hue.input_history_index = Hue.input_history.length
}

// This handles 'up' or 'down' actions for the input
// Shows the next input history item based on current history item index
Hue.input_history_change = function (direction) {
  if (Hue.input_history.length === 0) {
    return
  }

  let v

  if (direction === "up") {
    Hue.input_history_index -= 1

    if (Hue.input_history_index === -2) {
      Hue.input_history_index = Hue.input_history.length - 1
    } else if (Hue.input_history_index === -1) {
      Hue.change_input("")
      return
    }

    v = Hue.input_history[Hue.input_history_index].message
  } else if (direction === "down") {
    if (Hue.input_history_index < 0) {
      Hue.change_input("")
      return
    }

    Hue.input_history_index += 1

    if (Hue.input_history_index > Hue.input_history.length - 1) {
      Hue.change_input("")
      Hue.reset_input_history_index()
      return
    }

    if (Hue.input_history_index >= Hue.input_history.length) {
      Hue.change_input("")
      Hue.reset_input_history_index()
      return
    }

    v = Hue.input_history[Hue.input_history_index].message
  }

  Hue.change_input(v)
}

// Replaces an item in input history
Hue.replace_in_input_history = function (original, replacement) {
  for (let i=0; i<Hue.input_history.length; i++) {
    let item = Hue.input_history[i]

    if (item.message === original) {
      Hue.input_history[i].message = replacement
      break
    }
  }
}