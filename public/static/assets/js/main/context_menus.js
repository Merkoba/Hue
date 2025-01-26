// Show chat context menu
App.show_chat_context_menu = (button, x, y) => {
  let is_main = button.closest(`#chat_area`)
  let unit = button.closest(`.message_unit`)

  if (!unit) {
    return
  }

  let items = []
  let message = button.closest(`.message`)
  let text_el = DOM.el(`.unit_text`, unit)
  let mode = DOM.dataset(message, `mode`)
  let type = DOM.dataset(message, `type`)
  let user_id = DOM.dataset(message, `user_id`)
  let id = DOM.dataset(unit, `id`)
  let likes = DOM.dataset(unit, `likes`)
  let message_id = DOM.dataset(message, `message_id`)
  let is_chat = mode === `chat`
  let is_media = (type === `image_change`) || (type === `tv_change`)
  let url = ``

  if (is_chat) {
    let container = button.closest(`.chat_content_container`)
    url = DOM.dataset(container, `first_url`)
  }
  else if (is_media) {
    url = DOM.dataset(message, `media_source`)
  }

  let has_reply = false
  let has_edit = false

  if (is_chat || is_media) {
    items.push({
      text: `Reply`,
      action: () => {
        App.start_reply(text_el)
      },
    })

    has_reply = true
  }

  if ((user_id === App.user_id) && (is_chat || is_media)) {
    items.push({
      text: `Edit`,
      action: () => {
        App.start_edit(text_el)
      },
    })

    has_edit = true
  }

  if (has_reply && has_edit) {
    if (user_id === App.user_id) {
      App.utilz.move_in_array(items, items.length - 1, items.length - 2)
    }
  }

  if (is_chat || is_media) {
    let text = `Like`
    let type = `like`

    // Check if the user already liked the post
    if (App.message_is_liked(unit)) {
      text = `Unlike`
      type = `unlike`
    }

    if ((type === `unlike`) || ((type === `like`) && (likes.length < App.config.max_likes))) {
      items.push({
        text,
        action: () => {
          App.like_message(text_el, type)
        },
      })
    }
  }

  if (is_chat) {
    items.push({
      text: `Copy`,
      action: () => {
        let str = App.utilz.single_space(text_el.textContent)
        App.copy_string(str, false)
      },
    })
  }
  else if (is_media) {
    items.push({
      text: `Copy`,
      items: [
        {
          text: `Copy URL`,
          action: () => {
            App.copy_string(url, false)
          },
        },
        {
          text: `Copy Text`,
          action: () => {
            let str = App.utilz.single_space(text_el.textContent)
            App.copy_string(str, false)
          },
        },
      ],
    })
  }

  items.push({
    text: `Hide`,
    action: () => {
      App.show_confirm(`Hide message. This won't delete it`, () => {
        App.remove_message_from_context_menu(button)
      })
    },
  })

  if (((user_id === App.user_id) || App.is_admin_or_op()) && (is_chat || is_media)) {
    items.push({
      text: `Delete`,
      action: () => {
        App.handle_delete_messages(id, user_id)
      },
    })
  }

  if (url) {
    items.push({
      text: `Handle`,
      action: () => {
        App.handle_url(url)
      },
    })
  }

  if (!is_main) {
    items.push({
      text: `Jump`,
      action: () => {
        App.jump_to_chat_message(message_id, true)
      },
    })
  }

  if ((x !== undefined) && (y !== undefined)) {
    NeedContext.show({x, y, items})
  }
  else {
    NeedContext.show({element: button, items})
  }
}

// Hide the context menu
App.hide_context_menu = () => {
  NeedContext.hide()
}

// Show input menu
App.show_input_menu = () => {
  let items = []

  if (App.get_input(true)) {
    items.push({
      text: `Send`,
      action: () => {
        App.submit_input()
      },
    })

    items.push({
      text: `Clear`,
      action: () => {
        App.clear_input()
      },
    })
  }

  items.push({
    text: `React`,
    action: () => {
      App.show_reactions()
    },
  })

  if (App.room_state.last_input && !App.get_input(true)) {
    items.push({
      text: `Repeat`,
      action: () => {
        App.show_input_history()
      },
    })
  }

  items.push({
    separator: true,
  })

  items.push({
    text: `@ Link`,
    items: App.at_media_items(`link`),
  })

  items.push({
    text: `@ Img`,
    items: App.at_media_items(`image`),
  })

  items.push({
    text: `@ TV`,
    items: App.at_media_items(`tv`),
  })

  let el = DOM.el(`#footer_input_menu`)
  NeedContext.show({element: el, items})
}

App.show_linksbar_context = (x, y) => {
  let items = []

  if (App.linksbar_item.url) {
    items.push({
      text: `Copy URL`,
      action: () => {
        App.linksbar_copy_url()
      },
    })
  }

  if (App.linksbar_item.title) {
    items.push({
      text: `Copy Title`,
      action: () => {
        App.linksbar_copy_title()
      },
    })
  }

  NeedContext.show({x, y, items})
}

App.at_media_items = (type) => {
  let items = []
  let item = App.get_current_media(type)
  let liked = false

  if (item && item.id) {
    let ans = App.get_message_by_id(item.id)

    if (ans) {
      liked = App.message_is_liked(ans[0])
    }
  }

  items.push({
    text: `Reply`,
    action: () => {
      App.reply_to_media(type)
    },
  })

  if (liked) {
    items.push({
      text: `Unlike`,
      action: () => {
        App.like_to_media(type)
      },
    })
  }
  else {
    items.push({
      text: `Like`,
      action: () => {
        App.like_to_media(type)
      },
    })
  }

  items.push({
    text: `Context`,
    action: () => {
      App.context_to_media(type)
    },
  })

  items.push({
    text: `Jump`,
    action: () => {
      App.jump_to_media(type)
    },
  })

  return items
}

App.show_radio_context = (radio, x, y) => {
  let items = []

  items.push({
    text: `Copy URL`,
    action: () => {
      App.copy_string(radio.url, false)
    },
  })

  items.push({
    text: `Copy Name`,
    action: () => {
      App.copy_string(radio.name, false)
    },
  })

  NeedContext.show({x, y, items})
}