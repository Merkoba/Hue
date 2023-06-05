// Show chat context menu
App.show_chat_context_menu = (button, x, y) => {
  let is_main = button.closest(`#chat_area`)
  let unit = button.closest(`.message_unit`)

  if (!unit) {
    return
  }

  let items = []
  let message = button.closest(`.message`)
  let text = DOM.el(`.unit_text`, unit)
  let mode = DOM.dataset(message, `mode`)
  let type = DOM.dataset(message, `type`)
  let user_id = DOM.dataset(message, `user_id`)
  let id = DOM.dataset(unit, `id`)
  let likes = DOM.dataset(unit, `likes`)
  let message_id = DOM.dataset(message, `message_id`)
  let url = ``

  if (mode === `chat`) {
    let container = button.closest(`.chat_content_container`)
    url = DOM.dataset(container, `first_url`)
  }

  let has_reply = false
  let has_edit = false

  if (mode === `chat` || type === `image_change` || type === `tv_change`) {
    items.push({
      text: `Reply`,
      action: () => {
        let el = DOM.el(`.unit_text`, button.closest(`.message_unit`))
        App.start_reply(el)
      }
    })

    has_reply = true
  }

  if (user_id === App.user_id && (mode === `chat` || type === `image_change` || type === `tv_change`)) {
    items.push({
      text: `Edit`,
      action: () => {
        let el = DOM.el(`.unit_text`, button.closest(`.message_unit`))
        App.start_edit(el)
      }
    })

    has_edit = true
  }

  if (has_reply && has_edit) {
    if (user_id === App.user_id) {
      App.utilz.move_in_array(items, items.length - 1, items.length - 2)
    }
  }

  if (mode === `chat` || type === `image_change` || type === `tv_change`) {
    let text = `Like`
    let type = `like`
    let included = DOM.dataset(unit, `likes`).some(x => x.user_id === App.user_id)

    // Check if the user already like the post
    if (included) {
      text = `Unlike`
      type = `unlike`
    }

    if (type === `unlike` || (type === `like` && likes.length < App.config.max_likes)) {
      items.push({
        text: text,
        action: () => {
          let el = DOM.el(`.unit_text`, button.closest(`.message_unit`))
          App.like_message(el, type)
        }
      })
    }
  }

  items.push({
    text: `Copy`,
    action: () => {
      let str = App.utilz.single_space(text.textContent)
      App.copy_string(str, false)
    }
  })

  items.push({
    text: `Hide`,
    action: () => {
      App.show_confirm(`Hide message. This won't delete it`, () => {
        App.remove_message_from_context_menu(button)
      })
    }
  })

  if ((user_id === App.user_id || App.is_admin_or_op()) &&
    (mode === `chat` || type === `image_change` || type === `tv_change`)) {
    items.push({
      text: `Delete`,
      action: () => {
        App.handle_delete_messages(id, user_id)
      }
    })
  }

  if (url) {
    items.push({
      text: `Handle`,
      action: () => {
        App.handle_url(url)
      }
    })
  }

  if (!is_main) {
    items.push({
      text: `Jump`,
      action: () => {
        App.jump_to_chat_message(message_id, true)
      }
    })
  }

  if (x !== undefined && y !== undefined) {
    NeedContext.show(x, y, items)
  }
  else {
    NeedContext.show_on_element(button, items)
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
      }
    })

    items.push({
      text: `Clear`,
      action: () => {
        App.clear_input()
      }
    })
  }

  if (App.room_state.last_input && !App.get_input(true)) {
    items.push({
      text: `Repeat`,
      action: () => {
        App.show_input_history()
      }
    })
  }

  items.push({
    text: `Lock`,
    action: () => {
      App.lock_chat()
    }
  })

  items.push({
    text: `@ Img`,
    action: () => {
      App.reply_to_media(`image`)
    }
  })

  items.push({
    text: `@ TV`,
    action: () => {
      App.reply_to_media(`tv`)
    }
  })

  items.push({
    text: `@ Link`,
    action: () => {
      App.reply_to_link()
    }
  })

  let el = DOM.el(`#footer_input_menu`)
  NeedContext.show_on_element(el, items)
}

App.show_linksbar_context = (x, y) => {
  let items = []

  if (App.linksbar_item.url) {
    items.push({
      text: `Copy URL`,
      action: () => {
        App.linksbar_copy_url()
      }
    })
  }

  if (App.linksbar_item.title) {
    items.push({
      text: `Copy Title`,
      action: () => {
        App.linksbar_copy_title()
      }
    })
  }

  NeedContext.show(x, y, items)
}