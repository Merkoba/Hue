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

// Filter action for normal filter windows
Hue.do_modal_filter = function (id = false) {
  if (!id) {
    if (!Hue.active_modal) {
      return
    }

    id = Hue.active_modal.options.id
  }

  if (id === "chat_search") {
    Hue.show_chat_search(Hue.el("#chat_search_filter").value)
    return
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
}