// Setup window controls
Hue.setup_window_controls = function () {
  Hue.els(".window_controls").forEach(it => {
    let container = it.closest(".Msg-content-container")
    let filter = Hue.el(".filter_input", it)
    let bottom = Hue.el(".window_to_bottom", it)
    let top = Hue.el(".window_to_top", it)
    let clear = Hue.el(".window_filter_clear", it)
    let history = Hue.el(".window_filter_history", it)

    if (filter.dataset.mode !== "manual") {
      filter.addEventListener("input", function () {
        Hue.do_modal_filter_timer()
      })
    }

    bottom.addEventListener("click", function () {
      container.scrollTop = container.scrollHeight
      filter.focus()
    })
    
    top.addEventListener("click", function () {
      container.scrollTop = 0
      filter.focus()
    })

    clear.addEventListener("click", function () {
      filter.value = ""
      Hue.trigger_filter(filter)
      filter.focus()
    })

    history.addEventListener("click", function () {
      Hue.show_filter_history(filter)
    })      
  })
}

// Trigger change on an input
Hue.trigger_filter = function (filter) {
  let event = new Event("input")
  filter.dispatchEvent(event)
}

// Focuses the filter widget of a modal
Hue.focus_modal_filter = function (instance) {
  let filter = Hue.el(`#Msg-content-${instance.options.id} .filter_input`)

  if (filter) {
    filter.focus()
  }
}

// Empties the filter of a modal and updates it
Hue.reset_modal_filter = function (instance) {
  let id = instance.options.id
  let filter = Hue.el(`#Msg-content-${id} .filter_input`)

  if (filter) {
    if (id === "info" || filter.dataset.mode === "manual") {
      return
    }

    if (filter.value) {
      filter.value = ""
      Hue.do_modal_filter(id)
    }
  }
}

// Starts custom filters events
Hue.start_filters = function () {
  Hue.el("#chat_search_filter").addEventListener("input", function () {
    Hue.chat_search_timer()
  })
}

// Filter action for normal filter windows
Hue.do_modal_filter = function (id = false) {
  if (!id) {
    if (!Hue.active_modal) {
      return
    }

    id = Hue.active_modal.options.id
  }

  let finished = false

  function filtercheck (it) {
    if (finished) {
      return
    }

    if (filter.startsWith("$user")) {
      let username = Hue.dataset(it, "username")
      let match = username && first_arg === username.toLowerCase()
      
      if (match) {
        if (tail) {
          match = it.textContent.toLowerCase().includes(tail)
        }
      }

      return match
    } else if (filter.startsWith("$fresh")) {
      let match = Hue.dataset(it, "fresh")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      } else {
        finished = true
      }

      return match
    } else if (filter.startsWith("$links")) {
      let s = it.textContent.toLowerCase()
      let match = s.includes("http://") || s.includes("https://")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    } else {
      return it.textContent.toLowerCase().includes(filter)
    }
  }  

  let win = Hue.el(`#Msg-content-${id}`)
  let filter_el = Hue.el(".filter_input", win)
  let filter0 = Hue.utilz.single_space(filter_el.value).trim()
  let filter = filter0.toLowerCase()
  let items = Hue.els(".modal_item", win)
  let args, first_arg, tail

  if (filter && items.length) {
    if (filter.startsWith("$")) {
      let split = filter.split(" ").filter(x => x !== "")
      first_arg = split[1]
      args = split.slice(1).join(" ")
      tail = split.slice(2).join(" ")

      if (first_arg) {
        first_arg = first_arg.toLowerCase()
      }

      if (args) {
        args = args.toLowerCase()
      }

      if (tail) {
        tail = tail.toLowerCase()
      }
    }
    
    if (filter.startsWith("$user")) {
      if (!first_arg) {
        return
      }
    }

    items.forEach(it => {
      if (filtercheck(it)) {
        it.classList.remove("nodisplay")
      } else {
        it.classList.add("nodisplay")
      }
    })

    Hue[`${id}_filtered`] = true
  } else {
    items.forEach(it => {
      it.classList.remove("nodisplay")
    })

    Hue[`${id}_filtered`] = false
  }

  Hue.scroll_modal_to_top(id)

  if (Hue[`after_${id}_filtered`]) {
    Hue[`after_${id}_filtered`]()
  }

  if (id !== "filter_history") {
    Hue.after_filter_search(filter0)
  }
}

// Setup filter history
Hue.setup_filter_history = function () {
  Hue.get_filter_history()

  Hue.el("#filter_history_container").addEventListener("click", function (e) {
    if (e.target.closest(".filter_history_item")) {
      Hue.filter_history_target.value = e.target.textContent
      Hue.trigger_filter(Hue.filter_history_target)
      Hue.msg_filter_history.close()
    }
  })
}

// Get filter history
Hue.get_filter_history = function () {
  Hue.filter_history = Hue.get_local_storage(Hue.ls_filter_history)

  if (Hue.filter_history === null) {
    Hue.filter_history = []
  }
}

// Saves the filter history localStorage object
Hue.save_filter_history = function (force = false) {
  Hue.save_local_storage(Hue.ls_filter_history, Hue.filter_history, force)
}

// Adds an item to the filter history
Hue.add_to_filter_history = function (message) {
  for (let i = 0; i < Hue.filter_history.length; i++) {
    if (Hue.filter_history[i].message === message) {
      Hue.filter_history.splice(i, 1)
      break
    }
  }

  let date = Date.now()
  let item = { message: message, date: date }

  Hue.filter_history.unshift(item)

  if (Hue.filter_history.length > Hue.config.filter_history_crop_limit) {
    Hue.filter_history = Hue.filter_history.slice(
      Hue.filter_history.length - Hue.config.filter_history_crop_limit
    )
  }

  Hue.save_filter_history()
}

// Show the filter history
Hue.show_filter_history = function (target) {
  let container = Hue.el("#filter_history_container")
  container.innerHTML = ""

  for (let item of Hue.filter_history) {
    let el = Hue.div("filter_history_item modal_item nice_row action dynamic_title")

    el.innerHTML = Hue.template_filter_history_item({
      message: item.message
    })

    let nice_date = Hue.utilz.nice_date(item.date)
    el.title = nice_date
    Hue.dataset(el, "date", item.date)
    Hue.dataset(el, "otitle", nice_date)

    container.append(el)
  }

  Hue.filter_history_target = target
  Hue.msg_filter_history.show()
}

// After a filter search is done
Hue.after_filter_search = function (filter) {
  if (!filter || filter.length > 100 || filter.startsWith("$")) {
    return
  }

  Hue.add_to_filter_history(filter)
}