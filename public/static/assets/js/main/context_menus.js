// Show chat context menu
Hue.show_chat_context_menu = (button, x, y) => {
  let is_main = button.closest(`#chat_area`)
  let unit = button.closest(`.message_unit`)

  if (!unit) {
    return
  }

  let items = []
  let message = button.closest(`.message`)
  let mode = Hue.dataset(message, `mode`)
  let type = Hue.dataset(message, `type`)
  let user_id = Hue.dataset(message, `user_id`)
  let id = Hue.dataset(unit, `id`)
  let likes = Hue.dataset(unit, `likes`)
  let message_id = Hue.dataset(message, `message_id`)
  let url = ``

  if (mode === `chat`) {
    let container = button.closest(`.chat_content_container`)
    url = Hue.dataset(container, `first_url`)
  }

  let has_reply = false
  let has_edit = false

  if (mode === `chat` || type === `image_change` || type === `tv_change`) {
    items.push({
      text: `Reply`,
      action: () => {
        let el = Hue.el(`.unit_text`, button.closest(`.message_unit`))
        Hue.start_reply(el)
      }
    })

    has_reply = true
  }

  if (user_id === Hue.user_id && (mode === `chat` || type === `image_change` || type === `tv_change`)) {
    items.push({
      text: `Edit`,
      action: () => {
        let el = Hue.el(`.unit_text`, button.closest(`.message_unit`))
        Hue.start_edit(el)
      }
    })

    has_edit = true
  }

  if (has_reply && has_edit) {
    if (user_id === Hue.user_id) {
      Hue.utilz.move_in_array(items, items.length - 1, items.length - 2)
    }
  }

  if (mode === `chat` || type === `image_change` || type === `tv_change`) {
    let text = `Like`
    let type = `like`
    let included = Hue.dataset(unit, `likes`).some(x => x.user_id === Hue.user_id)

    // Check if the user already like the post
    if (included) {
      text = `Unlike`
      type = `unlike`
    }

    if (type === `unlike` || (type === `like` && likes.length < Hue.config.max_likes)) {
      items.push({
        text: text,
        action: () => {
          let el = Hue.el(`.unit_text`, button.closest(`.message_unit`))
          Hue.like_message(el, type)
        }
      })
    }
  }

  items.push({
    text: `Hide`,
    action: () => {
      Hue.show_confirm(`Hide message. This won't delete it`, () => {
        Hue.remove_message_from_context_menu(button)
      })
    }
  })

  if ((user_id === Hue.user_id || Hue.is_admin_or_op()) &&
    (mode === `chat` || type === `image_change` || type === `tv_change`)) {
    items.push({
      text: `Delete`,
      action: () => {
        Hue.handle_delete_messages(id, user_id)
      }
    })
  }

  if (url) {
    items.push({
      text: `Handle`,
      action: () => {
        Hue.handle_url(url)
      }
    })
  }

  if (!is_main) {
    items.push({
      text: `Jump`,
      action: () => {
        Hue.jump_to_chat_message(message_id, true)
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
Hue.hide_context_menu = () => {
  NeedContext.hide()
}

// Show input menu
Hue.show_input_menu = () => {
  let items = []

  if (Hue.get_input(true)) {
    items.push({
      text: `Send`,
      action: () => {
        Hue.submit_input()
      }
    })

    items.push({
      text: `Clear`,
      action: () => {
        Hue.clear_input()
      }
    })
  }

  if (Hue.room_state.last_input && !Hue.get_input(true)) {
    items.push({
      text: `Repeat`,
      action: () => {
        Hue.show_input_history()
      }
    })
  }

  items.push({
    text: `Lock`,
    action: () => {
      Hue.lock_chat()
    }
  })

  items.push({
    text: `@ Img`,
    action: () => {
      Hue.reply_to_media(`image`)
    }
  })

  items.push({
    text: `@ TV`,
    action: () => {
      Hue.reply_to_media(`tv`)
    }
  })

  let el = Hue.el(`#footer_input_menu`)
  NeedContext.show_on_element(el, items)
}