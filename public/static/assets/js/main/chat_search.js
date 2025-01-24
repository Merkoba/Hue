// Setup chat search
App.setup_chat_search = () => {
  DOM.ev(DOM.el(`#chat_search_highlights`), `click`, () => {
    App.show_highlights()
  })

  DOM.ev(DOM.el(`#chat_search_links`), `click`, () => {
    App.show_links()
  })

  DOM.ev(DOM.el(`#chat_search_user`), `click`, () => {
    App.show_user_messages()
  })

  DOM.ev(DOM.el(`#chat_search_image`), `click`, () => {
    App.show_image_list()
  })

  DOM.ev(DOM.el(`#chat_search_tv`), `click`, () => {
    App.show_tv_list()
  })
}

// Resets chat search filter state
App.reset_chat_search_filter = () => {
  DOM.el(`#chat_search_filter`).value = ``
  DOM.el(`#chat_search_container`).innerHTML = ``
}

// Shows the chat search window
App.show_chat_search = (filter = ``) => {
  let finished = false
  let highlight_id

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
    else if (filter.startsWith(`$highlights`)) {
      let match = DOM.dataset(it, `highlighted`)

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    }
    else if (filter.startsWith(`$fresh_highlights`)) {
      if (!App.latest_highlight) {
        finished = true
        return
      }

      let match = DOM.dataset(it, `highlighted`)

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      if (match) {
        let id1 = DOM.dataset(it, `id`)
        let id2 = DOM.dataset(App.latest_highlight, `id`)
        if (id1 === id2) {
          finished = true
        }
      }

      return match
    }
    else if (filter.startsWith(`$links`)) {
      if (!DOM.el(`a`, it)) {
        return false
      }

      let match = true

      if (args) {
        match = it.textContent.trim().toLowerCase().includes(args)
      }

      return match
    }
    else if (filter.startsWith(`$image`)) {
      let match = (DOM.dataset(it, `mode`) === `announcement`) &&
                  (DOM.dataset(it, `type`) === `image_change`)

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    }
    else if (filter.startsWith(`$tv`)) {
      let match = (DOM.dataset(it, `mode`) === `announcement`) &&
                  (DOM.dataset(it, `type`) === `tv_change`)

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    }

    let text = DOM.el_or_self(`.unit_text`, it)
    return text.textContent.toLowerCase().includes(filter)
  }

  function on_messages(messages) {
    if (messages.length) {
      for (let message of messages) {
        let profilepics = DOM.els(`.profilepic`, message)

        for (let pic of profilepics) {
          DOM.ev(pic, `error`, () => {
            App.fallback_profilepic(pic)
          })
        }

        let link_img = DOM.el(`.link_preview_image`, message)

        if (link_img) {
          DOM.ev(link_img, `error`, () => {
            DOM.hide(link_img)
          })
        }

        DOM.el(`#chat_search_container`).append(message)
      }
    }
    else {
      DOM.el(`#chat_search_container`).innerHTML = `<div class='center'>Nothing found</div>`
    }
  }

  DOM.el(`#chat_search_container`).innerHTML = ``
  DOM.el(`#chat_search_filter`).value = filter
  let filter0 = App.utilz.single_space(filter).trim()
  filter = filter0.toLowerCase()
  let args, first_arg, tail

  if (filter) {
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

    if (filter.startsWith(`$id`)) {
      let item = App.get_message_container_by_id(first_arg)

      if (item) {
        highlight_id = DOM.dataset(item, `message_id`)
        on_messages([DOM.clone(item)])
      }
    }
    else {
      let messages = DOM.clone_children(`#chat_area`).reverse()

      for (let m of messages) {
        m.removeAttribute(`id`)
      }

      messages = messages.filter(it => {
        let mode = DOM.dataset(it, `mode`)
        let message_matched = false

        if (mode === `chat`) {
          let containers = DOM.els(`.chat_content_container`, it)

          for (let container of containers) {
            if (filtercheck(container)) {
              message_matched = true
              container.x_search_matched = true
            }
          }

          if (message_matched) {
            for (let container of containers) {
              if (!container.x_search_matched) {
                container.remove()
              }
            }
          }
        }
        else if (mode === `announcement`) {
          if (filtercheck(it)) {
            message_matched = true
          }
        }

        return message_matched
      })

      on_messages(messages)
    }
  }
  else {
    DOM.el(`#chat_search_container`).innerHTML = `<div class='center'>Search recent messages</div>`
  }

  App.msg_chat_search.show()

  if (highlight_id) {
    App.jump_to_chat_message(highlight_id, true, `#chat_search_container`)
  }
  else {
    App.scroll_modal_to_top(`chat_search`)
  }
}

// Show links in chat search
App.show_links = () => {
  App.show_chat_search(`$links `)
}

// Show image messages
App.show_image_list = () => {
  App.show_chat_search(`$image `)
}

// Show tv messages
App.show_tv_list = () => {
  App.show_chat_search(`$tv `)
}

// Do a chat search by id
App.chat_search_by_id = (id) => {
  App.show_chat_search(`$id ${id}`)
}