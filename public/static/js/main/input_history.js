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

// Saves the input history localStorage object
Hue.save_input_history = function () {
  Hue.save_local_storage(Hue.ls_input_history, Hue.input_history)
}

// Gets the input history localStorage object
Hue.get_input_history = function () {
  Hue.input_history = Hue.get_local_storage(Hue.ls_input_history)

  if (Hue.input_history === null) {
    Hue.input_history = []
  }

  Hue.reset_input_history_index()
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
    return false
  }

  if (Hue.input_changed) {
    Hue.input_changed = false

    let input_val = $("#input").val().trim()

    if (input_val !== "") {
      Hue.add_to_input_history(input_val, false)

      if (direction === "up") {
        Hue.input_history_index = Hue.input_history.length - 1
      } else {
        Hue.input_history_index = Hue.input_history.length
      }
    }
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
  } else {
    if (Hue.input_history_index < 0) {
      Hue.change_input("")
      return
    }

    Hue.input_history_index += 1

    if (Hue.input_history_index > Hue.input_history.length - 1) {
      Hue.change_input("")
      Hue.reset_input_history_index()
      return false
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

// Setups input history window events
Hue.setup_input_history = function () {
  $("#input_history_container").on("click", ".input_history_item", function () {
    if ($(this).find("a").length === 0) {
      Hue.change_input($(this).text())
      Hue.close_all_modals()
    }
  })

  $("#input_history_clear_icon").click(function () {
    if (confirm("Are you sure you want to clear the input history?")) {
      Hue.clear_input_history()
      Hue.show_input_history()
    }
  })
}

// Empties the input history localStorage object
Hue.clear_input_history = function () {
  Hue.input_history = []
  Hue.save_input_history()
}

// Shows the input history window
Hue.show_input_history = function (filter = false) {
  if (filter) {
    filter = filter.trim()
  }

  let sfilter = filter ? filter : ""

  $("#input_history_container").html("")
  $("#input_history_filter").val(sfilter)
  $("#input_history_container").html("")

  let words

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    words = lc_value.split(" ").filter((x) => x.trim() !== "")
  }

  let items

  if (filter) {
    items = Hue.input_history.filter(function (item) {
      let text = item.message.toLowerCase()
      return words.some((word) => text.includes(word))
    })
  } else {
    items = Hue.input_history
  }

  for (let item of items) {
    let c = $(
      `<div class='modal_item input_history_item dynamic_title action pointer'></div>`
    )
    let nd = Hue.utilz.nice_date(item.date)

    c.attr("title", nd)
    c.data("otitle", nd)
    c.data("date", item.date)
    c.text(item.message)

    $("#input_history_container").prepend(c)
  }

  if (Hue.input_history.length > 0) {
    $("#input_history_clear_icon").removeClass("inactive")
  } else {
    $("#input_history_clear_icon").addClass("inactive")
  }

  Hue.msg_input_history.show(function () {
    Hue.scroll_modal_to_top("input_history")
  })
}
