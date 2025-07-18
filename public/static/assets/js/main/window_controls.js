// Focuses the filter widget of a modal
App.focus_modal_filter = (instance) => {
  let filter = DOM.el(`#Msg-content-${instance.options.id} .filter_input`)

  if (filter) {
    filter.focus()
  }
}

// Empties the filter of a modal and updates it
App.reset_modal_filter = (instance) => {
  let id = instance.options.id
  let filter = DOM.el(`#Msg-content-${id} .filter_input`)

  if (filter) {
    if ((id === `info`) || (filter.dataset.mode === `manual`)) {
      return
    }

    if (filter.value) {
      filter.value = ``
      App.do_modal_filter(id)
    }
  }
}

// Get modal id if not provided
App.fill_modal_id = (id) => {
  if (!id && App.active_modal) {
    id = App.active_modal.options.id
  }

  return id
}

// Filter action for normal filter windows
App.do_modal_filter = (id = false) => {
  id = App.fill_modal_id(id)

  if (id === `chat_search`) {
    App.show_chat_search(DOM.el(`#chat_search_filter`).value)
    return
  }

  let finished = false

  function filtercheck(it) {
    if (finished) {
      return
    }

    if (filter.startsWith(`$user`)) {
      let username = DOM.dataset(it, `username`)
      let match = username && (first_arg === username.toLowerCase())

      if (match) {
        if (tail) {
          match = it.textContent.toLowerCase().includes(tail)
        }
      }

      return match
    }
    else if (filter.startsWith(`$fresh`)) {
      let match = DOM.dataset(it, `fresh`)

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }
      else {
        finished = true
      }

      return match
    }
    else if (filter.startsWith(`$links`)) {
      if (!DOM.el(`a`, it)) {
        return false
      }

      let match = true

      if (args) {
        match = it.textContent.toLowerCase().includes(args)
      }

      return match
    }

    let texts
    let modal_texts = DOM.els(`.modal_text`, it)

    if (modal_texts && modal_texts.length) {
      texts = modal_texts.map(x => x.textContent)
    }
    else {
      texts = [it.textContent]
    }

    let text = texts.map(x => x.trim()).join(` `).trim().toLowerCase()
    return text.includes(filter)
  }

  let win = DOM.el(`#Msg-content-${id}`)

  if (!win) {
    return
  }

  let filter_el = DOM.el(`.filter_input`, win)

  if (!filter_el) {
    return
  }

  let filter0 = App.utilz.single_space(filter_el.value).trim()
  let filter = filter0.toLowerCase()
  let items = DOM.els(`.modal_item`, win)
  let args, first_arg, tail

  if (filter && items.length) {
    if (filter.startsWith(`$`)) {
      let split = filter.split(` `).filter(x => x !== ``)
      first_arg = split[1]
      args = split.slice(1).join(` `)
      tail = split.slice(2).join(` `)

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

    if (filter.startsWith(`$user`)) {
      if (!first_arg) {
        return
      }
    }

    for (let item of items) {
      if (filtercheck(item)) {
        DOM.show(item)
      }
      else {
        DOM.hide(item)
      }
    }

    App[`${id}_filtered`] = true
  }
  else {
    for (let item of items) {
      DOM.show(item)
    }

    App[`${id}_filtered`] = false
  }

  App.scroll_modal_to_top(id)

  if (App[`after_${id}_filtered`]) {
    App[`after_${id}_filtered`]()
  }

  App.selected_modal_item = undefined

  if (App.modal_selectable) {
    App.selected_next()
  }
}

// On selectable next
App.selected_next = (reverse = false) => {
  let new_el = App.selected_next_el(reverse)
  App.select_next(new_el)
}

// Get the next selected element
App.selected_next_el = (reverse = false) => {
  let id = App.active_modal.options.id
  let container = DOM.el(`#Msg-content-${id}`)
  let els = DOM.els(`.modal_item`, container)

  if (!els.length) {
    return
  }

  let waypoint = false

  if (reverse) {
    els.reverse()
  }

  if (!els.length) {
    return
  }

  for (let el of els) {
    if (waypoint || !App.selected_modal_item) {
      if (!DOM.is_hidden(el)) {
        return el
      }
    }

    if (el === App.selected_modal_item) {
      waypoint = true
    }
  }

  return els[0]
}

// Select next
App.select_next = (new_el) => {
  if (!new_el) {
    return
  }

  let id = App.active_modal.options.id
  let container = DOM.el(`#Msg-content-${id}`)
  let els = DOM.els(`.modal_item`, container)

  for (let el of els) {
    if (el === new_el) {
      el.classList.add(`selected`)
    }
    else {
      el.classList.remove(`selected`)
    }
  }

  App.selected_modal_item = new_el

  new_el.scrollIntoView({
    block: `center`,
  })
}

// On selectable Enter
App.selectable_enter = () => {
  let id = App.active_modal.options.id
  App[`${id}_enter_action`]()
}