// This generates all user chat messages inserted into the chat
App.make_chat_message = (args = {}) => {
  let def_args = {
    edited: false,
    just_edited: false
  }

  args = Object.assign(def_args, args)
  let num_lines = args.message.split(`\n`).length

  if (num_lines === 1) {
    if (args.message.startsWith(App.config.commands_prefix + App.config.commands_prefix)) {
      args.message = args.message.slice(1)
    }
  }

  args.message = App.replace_message_vars(args.id, args.message)
  let content_classes = `chat_content unit_text`
  let d = args.date ? args.date : Date.now()
  let nd = App.utilz.nice_date(d)
  let pi = App.get_profilepic(args.user_id)
  let image_preview = false
  let image_preview_src_original = false
  let image_preview_text = false

  if (App.get_setting(`embed_images`)) {
    let ans = App.make_image_preview(args.message)
    image_preview = ans.image_preview
    image_preview_src_original = ans.image_preview_src_original
    image_preview_text = ans.image_preview_text
  }

  let link_preview = false
  let link_preview_text = false

  if (
    !image_preview &&
    (args.link_title || args.link_description) &&
    App.get_setting(`show_link_previews`)
  ) {
    let ans = App.make_link_preview({
      message: args.message,
      image: args.link_image,
      title: args.link_title,
      description: args.link_description,
    })

    link_preview = ans.link_preview
    link_preview_text = ans.link_preview_text
  }

  if (args.link_url) {
    let o = {
      url: args.link_url,
      title: args.link_title,
      username: args.username,
      user_id: args.user_id,
      date: args.date,
    }

    App.set_linksbar_item(o)
  }

  let highlighted = false
  let preview_text_class = ``

  if (args.username !== App.username) {
    if (image_preview && image_preview_text) {
      if (App.check_highlights(image_preview_text)) {
        preview_text_class = `highlighted_message`
        highlighted = true
      }
    }
    else if (link_preview && link_preview_text) {
      if (App.check_highlights(link_preview_text)) {
        preview_text_class = `highlighted_message`
        highlighted = true
      }
    }
    else {
      if (App.check_highlights(args.message)) {
        content_classes += ` highlighted_message`
        highlighted = true
      }
    }
  }

  if (args.quote_user_id === App.user_id) {
    highlighted = true
  }

  let fmessage
  let title = ``

  if (args.edited) {
    title += `Edited | `
  }

  title = title + nd

  let gets = App.getcode(args.id)

  if (App.utilz.bingo(gets)) {
    content_classes += ` colortext goldtext`
  }

  title = `${gets} | ${title}`

  fmessage = DOM.create(`div`, `message chat_message user_details`)

  fmessage.innerHTML = App.template_chat_message({
    content_classes: content_classes,
    profilepic: pi,
    title: title,
    date: d
  })

  let content = DOM.el(`.chat_content`, fmessage)

  if (image_preview) {
    content.innerHTML = image_preview

    if (preview_text_class) {
      DOM.el(`.image_preview_text`, fmessage).classList.add(preview_text_class)
    }
  }
  else if (link_preview) {
    content.innerHTML = link_preview

    if (preview_text_class) {
      DOM.el(`.link_preview_text`, fmessage).classList.add(preview_text_class)
    }
  }
  else {
    content.innerHTML = App.parse_text(App.utilz.make_html_safe(args.message))
  }

  let quote = DOM.el(`.chat_quote`, fmessage)

  if (args.quote) {
    quote.innerHTML = App.template_chat_quote({
      username: args.quote_username,
      quote: args.quote,
      profilepic: App.get_profilepic(args.quote_user_id)
    })

    DOM.dataset(quote, `quote_username`, args.quote_username)
    DOM.dataset(quote, `quote_user_id`, args.quote_user_id)
    DOM.dataset(quote, `quote_id`, args.quote_id)

    let quote_profilepic = DOM.el(`.chat_quote_profilepic`, quote)

    DOM.ev(quote_profilepic, `error`, () => {
      App.fallback_profilepic(quote_profilepic)
    })
  }
  else {
    quote.style.display = `none`
  }

  let chat_username = DOM.el(`.chat_username`, fmessage)
  chat_username.textContent = args.username

  let htimeago = DOM.el(`.chat_timeago`, fmessage)
  htimeago.textContent = App.utilz.timeago(d)
  let pic = DOM.el(`.profilepic`, fmessage)

  DOM.ev(pic, `error`, () => {
    App.fallback_profilepic(pic)
  })

  let rightside = DOM.el(`.chat_right_side`, fmessage)
  DOM.dataset(rightside, `date`, d)
  DOM.dataset(rightside, `otitle`, nd)

  let first_url = false

  if (image_preview) {
    first_url = image_preview_src_original
  }
  else if (link_preview) {
    first_url = args.link_url
  }
  else {
    first_url = App.utilz.get_first_url(args.message)
  }

  DOM.dataset(fmessage, `username`, args.username)
  DOM.dataset(fmessage, `user_id`, args.user_id)
  DOM.dataset(fmessage, `date`, d)
  DOM.dataset(fmessage, `highlighted`, highlighted)
  DOM.dataset(fmessage, `mode`, `chat`)

  let content_container = DOM.el(`.chat_content_container`, fmessage)
  DOM.dataset(content_container, `id`, args.id)
  DOM.dataset(content_container, `edited`, args.edited)
  DOM.dataset(content_container, `highlighted`, highlighted)
  DOM.dataset(content_container, `date`, d)
  DOM.dataset(content_container, `first_url`, first_url)
  DOM.dataset(content_container, `original_message`, args.message)
  DOM.dataset(content_container, `otitle`, title)
  DOM.dataset(content_container, `username`, args.username)
  DOM.dataset(content_container, `user_id`, args.user_id)

  args.likes = args.likes || []
  DOM.dataset(content_container, `likes`, args.likes)
  App.update_likes(content_container, args.likes)

  if (!image_preview && !link_preview) {
    App.urlize(content)
  }

  if (image_preview) {
    App.setup_image_preview(fmessage, image_preview_src_original, args.user_id)
  }

  if (link_preview) {
    App.setup_link_preview(fmessage)
  }

  let ans = App.insert_message({
    id: args.id,
    message: fmessage,
    just_edited: args.just_edited,
  })

  if (!args.edited) {
    if (args.username !== App.username) {
      if (highlighted) {
        App.on_highlight(args.username)
      }
      else {
        App.on_activity(`message`)
      }
    }
  }

  App.push_to_all_usernames(args.username)
  App.observe_message(ans.message_unit)

  return {
    message_id: ans.message_id
  }
}

// This generates all announcements inserted into the chat
App.make_announcement_message = (args = {}) => {
  let def_args = {
    highlight: false,
    type: `normal`
  }

  args = Object.assign(def_args, args)

  let is_media = args.type === `image_change` || args.type === `tv_change`
  let content_classes = `announcement_content unit_text`
  let brk_classes = `brk announcement_brk`
  let highlighted = false

  if (args.highlight) {
    content_classes += ` highlighted_message`
    highlighted = true
  }

  let d = args.date ? args.date : Date.now()
  let t = args.title ? args.title : App.utilz.nice_date(d)

  if (is_media) {
    content_classes += ` action`
    brk_classes += ` action`
  }

  if (args.user_id) {
    brk_classes += ` pos_absolute`
  }

  if (is_media) {
    if (App.utilz.bingo(App.getcode(args.id))) {
      content_classes += ` colortext goldtext`
    }
  }

  let top_clasees = `chat_message_top announcement_top`

  if (!is_media) {
    top_clasees += ` nodisplay`
  }

  let fmessage = DOM.create(`div`, `message announcement message_unit unit_data_container`)

  fmessage.innerHTML = App.template_announcement_message({
    content_classes: content_classes,
    brk_classes: brk_classes,
    top_classes: top_clasees,
    brk: args.brk
  })

  if (args.container_id) {
    fmessage.id = args.container_id
  }

  if (is_media) {
    fmessage.classList.add(`media_announcement`)
  }

  let content_container = DOM.el(`.announcement_content_container`, fmessage)
  DOM.dataset(content_container, `original_message`, args.comment)
  let content = DOM.el(`.announcement_content`, fmessage)

  if (is_media) {
    let username = DOM.el(`.chat_username`, fmessage)
    let date = DOM.el(`.chat_timeago`, fmessage)
    username.textContent = args.username
    date.textContent = App.utilz.timeago(args.date)
  }

  let right_side = DOM.el(`.announcement_right_side`, fmessage)
  DOM.dataset(right_side, `otitle`, t)
  DOM.dataset(right_side, `date`, d)

  content.textContent = args.message
  App.urlize(content)

  let brk_profilepic = DOM.el(`.brk_profilepic`, fmessage)

  if (args.user_id) {
    brk_profilepic.src = App.get_profilepic(args.user_id)
  }
  else {
    brk_profilepic.style.display = `none`
  }

  let pic = DOM.el(`.profilepic`, fmessage)

  DOM.ev(pic, `error`, () => {
    App.fallback_profilepic(pic)
  })

  DOM.dataset(fmessage, `id`, args.id)
  DOM.dataset(fmessage, `date`, d)
  DOM.dataset(fmessage, `highlighted`, highlighted)
  DOM.dataset(fmessage, `type`, args.type)
  DOM.dataset(fmessage, `username`, args.username)
  DOM.dataset(fmessage, `mode`, `announcement`)
  DOM.dataset(fmessage, `user_id`, args.user_id)
  DOM.dataset(fmessage, `media_source`, args.media_source)
  DOM.dataset(fmessage, `original_message`, args.message)

  args.likes = args.likes || []
  DOM.dataset(fmessage, `likes`, args.likes)
  App.update_likes(fmessage, args.likes)

  let ans = App.insert_message({
    message: fmessage
  })

  if (highlighted) {
    App.on_highlight(args.username)
  }

  App.push_to_all_usernames(args.username)
  App.observe_message(ans.message_unit)

  return {
    message_id: ans.message_id
  }
}

// This is a centralized function to insert all chat messages or announcements into the chat
App.insert_message = (args = {}) => {
  let def_args = {
    just_edited: false
  }

  args = Object.assign(def_args, args)

  let messages = App.get_all_messages()
  let last_message = messages.slice(-1)[0]
  let appended = false
  let mode = DOM.dataset(args.message, `mode`)
  let user_id = DOM.dataset(args.message, `user_id`)
  let username = DOM.dataset(args.message, `username`)
  let date = DOM.dataset(args.message, `date`)
  let highlighted = DOM.dataset(args.message, `highlighted`)
  let content_container, message_id, message_unit

  if (mode === `chat`) {
    content_container = DOM.el(`.chat_content_container`, args.message)
    App.chat_content_container_id += 1
    DOM.dataset(content_container, `chat_content_container_id`, App.chat_content_container_id)
    content_container.classList.add(`chat_content_container_${App.chat_content_container_id}`)

    if (args.just_edited && args.id) {
      for (let item of DOM.els(`#chat_area .message_unit`)) {
        if (args.id === DOM.dataset(item, `id`)) {
          let clone = DOM.clone(content_container)
          item.replaceWith(clone)
          message_unit = DOM.el_or_self(`.message_unit`, clone)

          if (App.last_selected_message) {
            if (args.id === DOM.dataset(App.last_selected_message, `id`)) {
              App.last_selected_message = message_unit
            }
          }

          break
        }
      }

      if (App.msg_chat_search.is_open()) {
        for (let item of DOM.els(`#chat_search_container .message_unit`)) {
          if (args.id === DOM.dataset(item, `id`)) {
            let clone = DOM.clone(content_container)
            item.replaceWith(clone)
            break
          }
        }
      }

      return {
        message_id: DOM.dataset(last_message, `message_id`),
        message_unit: message_unit
      }
    }
  }
  else if (mode === `announcement`) {
    message_unit = DOM.el_or_self(`.message_unit`, args.message)
  }

  if (last_message) {
    if (mode === `chat` && DOM.dataset(last_message, `mode`) === `chat`) {
      if (
        DOM.el(`.chat_username`, args.message).textContent ===
        DOM.el(`.chat_username`, last_message).textContent
      ) {
        if (
          DOM.els(`.chat_content`, last_message).length <
          App.config.max_same_post_messages
        ) {
          let c1 = DOM.els(`.chat_content_container`, args.message).slice(-1)[0]
          let c2 = DOM.els(`.chat_content_container`, last_message).slice(-1)[0]
          let date_diff = DOM.dataset(c1, `date`) - DOM.dataset(c2, `date`)

          if (date_diff < App.config.max_same_post_diff) {
            DOM.dataset(content_container, `date`, date)
            DOM.dataset(content_container, `highlighted`, highlighted)

            DOM.el(`.chat_container`, last_message).append(content_container)
            message_id = DOM.dataset(last_message, `message_id`)

            if (!DOM.dataset(last_message, `highlighted`)) {
              DOM.dataset(last_message, `highlighted`, highlighted)
            }

            appended = true
          }
        }
      }
    }
  }

  if (mode === `chat`) {
    message_unit = DOM.el_or_self(`.message_unit`, content_container)
  }

  if (!appended) {
    DOM.el(`#chat_area`).append(args.message)
    App.message_id += 1
    message_id = App.message_id
    DOM.dataset(args.message, `message_id`, message_id)
    args.message.classList.add(`message_id_${message_id}`)
  }

  if (App.started) {
    if (App.chat_scrolled) {
      App.update_scroll_percentage()
    }

    if (highlighted) {
      if (App.room_state.last_highlight_date < date) {
        if (App.has_focus) {
          App.room_state.last_highlight_date = date
          App.save_room_state()
        }
      }
    }
    else if (user_id) {
      if (user_id !== App.user_id) {
        if (App.last_chat_user_id === App.user_id) {
          App.activity_notification(username)
        }
      }
    }
  }

  if (user_id) {
    App.last_chat_user_id = user_id

    if (App.started) {
      App.update_user_activity(user_id)
    }
  }

  if (App.started && !App.has_focus) {
    if (content_container) {
      App.add_fresh_message(content_container)
    }
    else {
      let container = DOM.el(`.announcement_content_container`, args.message)
      App.add_fresh_message(container)
    }
  }

  return {
    message_id: message_id,
    message_unit: message_unit
  }
}

// Get reply text
App.get_quote_text = () => {
  let ans = App.get_message_by_id(App.reply_id)

  if (!ans || !ans[0]) {
    return ``
  }

  let container = DOM.el_or_self(`.unit_data_container`, ans[0])
  let quote = DOM.dataset(container, `original_message`)
  quote = App.utilz.single_space(quote)

  let link_preview = DOM.el(`.link_preview_title`, container)
  let link_text

  if (link_preview) {
    link_text = link_preview.textContent
  }

  if (link_text) {
    quote = App.remove_urls(quote, false)
    quote += ` ` + App.utilz.single_space(link_text)
  }
  else {
    quote = App.remove_urls(quote)
  }

  let length = quote.length
  quote = quote.substring(0, App.config.quote_max_length).trim()

  if (length > quote.length) {
    quote += `...`
  }

  return quote
}

// Setup reply
App.setup_reply = () => {
  DOM.ev(DOM.el(`#input_reply_cancel`), `click`, () => {
    App.hide_reply()
  })

  DOM.ev(DOM.el(`#input_reply_container`), `mouseenter`, (e) => {
    e.target.title = `${App.reply_username}: ${App.get_quote_text()}`
  })

  let pf = DOM.el(`#input_reply_profilepic`)

  DOM.ev(pf, `error`, () => {
    App.fallback_profilepic(pf)
  })

  DOM.ev(pf, `click`, () => {
    App.show_profile(App.reply_username, App.reply_user_id)
  })
}

// Prepare data to show the reply window
App.start_reply = (target) => {
  if (target.tagName === `A`) {
    return
  }

  if (App.modal_open) {
    App.close_all_modals()
  }

  let message = target.closest(`.message`)
  let unit = target.closest(`.message_unit`)
  let username = DOM.dataset(message, `username`)
  let user_id = DOM.dataset(message, `user_id`)
  let id = DOM.dataset(unit, `id`)

  if (!username) {
    return
  }

  App.reply_username = username
  App.reply_id = id
  App.reply_user_id = user_id

  App.show_reply()
  App.set_input_placeholder(`Replying to: ${username}`)
}

// Show the reply info
App.show_reply = () => {
  App.hide_edit()
  DOM.el(`#input_reply_profilepic`).src = App.get_profilepic(App.reply_user_id)
  DOM.el(`#input_reply_container`).classList.remove(`nodisplay`)
  App.reply_active = true
  App.focus_input()
}

// Cancel reply
App.cancel_reply = () => {
  App.hide_reply()
  App.clear_input()
}

// Hide the reply info
App.hide_reply = () => {
  DOM.el(`#input_reply_container`).classList.add(`nodisplay`)
  App.reply_active = false
  App.check_footer_expand()
  App.update_input_placeholder()
}

// Submit the reply window
App.submit_reply = () => {
  App.hide_reply()

  let reply = App.get_input()

  if (!reply) {
    return
  }

  let quote = App.get_quote_text()

  if (!quote) {
    return
  }

  App.process_input({
    message: reply,
    quote: quote,
    quote_username: App.reply_username,
    quote_user_id: App.reply_user_id,
    quote_id: App.reply_id
  })
}

// Adds a message to the fresh message list
// This is a list of messages to temporarily highlight when a user refocus the client
// This is to give an indicator of fresh changes
App.add_fresh_message = (container) => {
  App.fresh_messages_list.push(container)

  if (App.fresh_messages_list.length > App.max_fresh_messages) {
    App.fresh_messages_list.shift()
  }
}

// Temporarily highlights recent messages since last focus
App.show_fresh_messages = () => {
  if (App.fresh_messages_list.length === 0) {
    return
  }

  for (let container of App.fresh_messages_list) {
    container.classList.add(`fresh_message`)

    setTimeout(() => {
      container.classList.remove(`fresh_message`)
    }, App.fresh_messages_duration)
  }

  App.fresh_messages_list = []
}

// Setup edit message
App.setup_edit = () => {
  DOM.ev(DOM.el(`#input_edit_cancel`), `click`, () => {
    App.cancel_edit()
  })
}

// Starts chat message editing
App.start_edit = (unit) => {
  if (App.modal_open) {
    App.close_all_modals()
  }

  App.edit_container = unit.closest(`.message`)
  App.edit_unit = unit
  App.edit_original_message = DOM.dataset(unit.closest(`.unit_data_container`), `original_message`)
  App.change_input(App.edit_original_message)
  App.hide_reply()
  App.show_edit()
}

// Show edit
App.show_edit = () => {
  App.hide_reply()
  DOM.el(`#input_edit_container`).classList.remove(`nodisplay`)
  App.edit_active = true
}

// Hide edit
App.hide_edit = () => {
  DOM.el(`#input_edit_container`).classList.add(`nodisplay`)
  App.check_footer_expand()
  App.edit_active = false
}

// Submit edit
App.submit_edit = () => {
  let mode = DOM.dataset(App.edit_container, `mode`)
  let edit_id

  if (mode === `chat`) {
    edit_id = DOM.dataset(App.edit_unit.closest(`.chat_content_container`), `id`)
  }
  else {
    edit_id = DOM.dataset(App.edit_container, `id`)
  }

  if (!edit_id) {
    return
  }

  let type = DOM.dataset(App.edit_container, `type`)
  let new_message = App.get_input()

  App.hide_edit()

  if (new_message === App.edit_original_message) {
    App.clear_input()
    return
  }

  if (mode === `chat`) {
    if (new_message.length === 0) {
      App.delete_message(edit_id)
      return
    }

    App.process_input({
      message: new_message,
      edit_id: edit_id,
    })
  }
  else if (mode === `announcement`) {
    App.do_edit_media_comment(type.split(`_`)[0], edit_id, new_message)
    App.clear_input()
  }
}

// Cancel edit
App.cancel_edit = () => {
  App.hide_edit()
  App.clear_input()
}

// Deletes a message
App.delete_message = (id) => {
  if (!id) {
    return
  }

  App.show_confirm(`Delete message from the chat log`, () => {
    App.socket_emit(`delete_message`, {
      id: id
    })
  })
}

// Delete message group
App.delete_message_group = (id) => {
  if (!id) {
    return
  }

  let msg = App.get_message_by_id(id)
  let unit = msg[0]
  let message = unit.closest(`.message`)
  let num = App.get_num_message_units(unit)
  let s = App.utilz.singular_or_plural(num, `messages`)

  App.show_confirm(`Delete message group (${s})`, () => {

    for (let unit of DOM.els(`.message_unit`, message)) {
      let id = DOM.dataset(unit, `id`)

      if (id) {
        App.socket_emit(`delete_message`, {
          id: id
        })
      }
    }
  })
}

// Deletes messages above
App.delete_messages_above = (id) => {
  if (!id) {
    return
  }

  let msg = App.get_message_by_id(id)
  let index = msg[1]
  let s = App.utilz.singular_or_plural(index, `messages`)

  App.show_confirm(`Delete messages above (${s})`, () => {
    App.socket_emit(`delete_messages_above`, {
      id: id
    })
  })
}

// Deletes messages above
App.delete_messages_below = (id) => {
  if (!id) {
    return
  }

  let msg = App.get_message_by_id(id)
  let index = msg[1]
  let num = App.get_all_units().length - index - 1
  let s = App.utilz.singular_or_plural(num, `messages`)

  App.show_confirm(`Delete messages below (${s})`, () => {
    App.socket_emit(`delete_messages_below`, {
      id: id
    })
  })
}

// Get message by id
App.get_message_by_id = (id, container = `#chat_area`) => {
  if (!id) {
    return
  }

  let units = DOM.els(`${container} .message_unit`)

  for (let i=0; i<units.length; i++) {
    let uid = DOM.dataset(units[i], `id`)

    if (uid && uid === id) {
      return [units[i], i, id]
    }
  }
}

// Get message
App.get_message = (message_id, container = `#chat_area`) => {
  return DOM.el(`${container} > .message_id_${message_id}`)
}

// Get message container by id
App.get_message_container_by_id = (id) => {
  let unit = App.get_message_by_id(id)
  let message

  if (unit) {
    message = unit[0].closest(`.message`)
  }

  return message
}

// Remove a message from the chat
App.remove_message_from_chat = (data) => {
  let ans = App.get_message_by_id(data.id)

  if (!ans) {
    return
  }

  let message = ans[0]
  let mode = DOM.dataset(message.closest(`.message`), `mode`)

  if (mode === `chat`) {
    App.process_remove_chat_message(message)
  }
  else if (mode == `announcement`) {
    App.process_remove_announcement(message)
  }
}

// Removes a chat message from the chat, when triggered through the context menu
App.remove_message_from_context_menu = (menu) => {
  let message = menu.closest(`.message`)
  let mode = DOM.dataset(message, `mode`)

  if (mode === `chat`) {
    App.process_remove_chat_message(menu.closest(`.chat_content_container`))
  }
  else if (mode === `announcement`) {
    App.process_remove_announcement(message)
  }
}

// Determines how to remove a chat message
App.process_remove_chat_message = (chat_content_container) => {
  let chat_content_container_id = DOM.dataset(chat_content_container, `chat_content_container_id`)

  for (let el of DOM.els(`.chat_content_container`)) {
    if (
      DOM.dataset(el, `chat_content_container_id`) === chat_content_container_id
    ) {
      if (
        DOM.els(`.chat_content_container`, el.closest(`.chat_container`)).length === 1
      ) {
        el.closest(`.message`).remove()
      }
      else {
        el.remove()
      }
    }
  }
}

// Determines how to remove an announcement
App.process_remove_announcement = (message) => {
  let type = DOM.dataset(message, `type`)
  let message_id = DOM.dataset(message, `message_id`)

  if (
    type === `image_change` ||
    type === `tv_change`
  ) {
    let id = DOM.dataset(message, `id`)
    App.remove_item_from_media_changed(type.replace(`_change`, ``), id)
  }

  for (let el of DOM.els(`.message_id_${message_id}`)) {
    el.remove()
  }
}

// Gets the most recent message by user_id
App.get_last_message_by_user_id = (ouser_id) => {
  let items = App.get_all_messages()

  for (let item of items.reverse()) {
    let user_id = DOM.dataset(item, `user_id`)

    if (user_id) {
      if (user_id === ouser_id) {
        return item
      }
    }
  }
}

// Jumps to a chat message in the chat area
// This is used when clicking the Jump button in
// windows showing chat message clones
App.jump_to_chat_message = (message_id, highlight, container = `#chat_area`) => {
  if (!message_id) {
    return
  }

  let el = App.get_message(message_id, container)

  if (!el) {
    return
  }

  el.scrollIntoView({
    block: `center`
  })

  App.check_scrollers()

  if (highlight) {
    el.classList.add(`fresh_message`)

    setTimeout(() => {
      el.classList.remove(`fresh_message`)
    }, App.fresh_messages_duration)
  }

  if (container === `#chat_area`) {
    App.close_all_modals()
  }
}

// What to do after receiving a chat message from the server
App.on_chat_message = (data) => {
  App.make_chat_message(data)
}

// Find the next chat message above that involves the user
// This is a message made by the user or one that is highlighted
App.activity_above = () => {
  let messages = App.get_all_messages()

  for (let message of messages.reverse()) {
    let same_username = false
    let username = DOM.dataset(message, `username`)

    if (username && username === App.username) {
      same_username = true
    }

    if (same_username || DOM.dataset(message, `highlighted`)) {
      if (message.classList.contains(`fresh_message`)) {
        continue
      }

      let rect = message.getBoundingClientRect()

      if (rect.top <= 0) {
        App.jump_to_chat_message(DOM.dataset(message, `message_id`), true)
        return
      }
    }
  }

  App.goto_top()
}

// Find the next chat message below that involves the user
// This is a message made by the user or one that is highlighted
App.activity_below = () => {
  let messages = App.get_all_messages()
  let area = DOM.el(`#chat_area_parent`)

  for (let message of messages) {
    let same_username = false
    let username = DOM.dataset(message, `username`)

    if (username && username === App.username) {
      same_username = true
    }

    if (same_username || DOM.dataset(message, `highlighted`)) {
      if (message.classList.contains(`fresh_message`)) {
        continue
      }

      if (message.offsetTop >= (area.scrollTop + area.offsetHeight)) {
        App.jump_to_chat_message(DOM.dataset(message, `message_id`), true)
        return
      }
    }
  }

  App.goto_bottom(true)
}

// Clears the chat area
App.clear_chat = () => {
  DOM.el(`#chat_area`).innerHTML = ``
}

// Changes the chat display size
App.do_chat_size_change = (size) => {
  if (size === `max`) {
    size = App.media_max_percentage
  }
  else if (size === `min`) {
    size = App.media_min_percentage
  }
  else if (size === `default`) {
    size = App.config.room_state_default_chat_display_percentage
  }

  size = App.limit_media_percentage(App.utilz.round2(size, 5))

  App.room_state.chat_display_percentage = size
  App.save_room_state()
  App.apply_media_percentages()
}

// Scrolls the chat to a certain vertical position
App.scroll_chat_to = (scrolltop) => {
  DOM.el(`#chat_area_parent`).scrollTop = scrolltop
}

// Scrolls the chat up
App.scroll_up = () => {
  DOM.el(`#chat_area_parent`).scrollTop -= App.chat_scroll_amount
}

// Scrolls the chat up (more)
App.scroll_up_2 = () => {
  DOM.el(`#chat_area_parent`).scrollTop -= App.chat_scroll_amount_2
}

// Scrolls the chat down
App.scroll_down = () => {
  DOM.el(`#chat_area_parent`).scrollTop += App.chat_scroll_amount
}

// Scrolls the chat down (more)
App.scroll_down_2 = () => {
  DOM.el(`#chat_area_parent`).scrollTop += App.chat_scroll_amount_2
}

// Generates the username mention regex using the highlights regex
App.generate_mentions_regex = () => {
  if (App.get_setting(`case_insensitive_username_highlights`)) {
    App.mentions_regex = App.generate_highlights_regex(App.username, true, true)
  }
  else {
    App.mentions_regex = App.generate_highlights_regex(
      App.username,
      false,
      true
    )
  }
}

// What to do after general activity
App.on_activity = (type) => {
  if (!App.started) {
    return
  }

  if (!App.has_focus) {
    if (type === `message` || type === `media_change`) {
      App.alert_title(1)
    }
    else if (type === `highlight` || type === `whisper`) {
      App.alert_title(2)
    }
  }
}

// Make link preview elements
App.make_link_preview = (args = {}) => {
  if (!App.get_setting(`embed_images`)) {
    args.image = ``
  }

  args.message = args.message ? args.message : ``
  args.image = args.image ? args.image : ``
  args.title = args.title ? args.title : ``
  args.description = args.description ? args.description : ``

  let ans = {}
  ans.link_preview = false

  let classes = `link_preview`
  let image_classes = args.image ?
    `link_preview_image` :
    `nodisplay`
  let title_classes = args.title ?
    `link_preview_title` :
    `nodisplay`
  let description_classes = args.description ?
    `link_preview_description` :
    `nodisplay`

  let text_content_classes = `link_preview_text_content`

  if (args.title && args.description) {
    text_content_classes += ` link_preview_text_content_full`
  }

  if (!args.title && !args.description) {
    text_content_classes = `nodisplay`
  }

  ans.link_preview = App.template_link_preview({
    classes: classes,
    text_content_classes: text_content_classes,
    title_classes: title_classes,
    title: args.title,
    description_classes: description_classes,
    description: args.description,
    image_classes: image_classes,
    image: args.image
  }).trim()

  let text = App.parse_text(App.utilz.make_html_safe(args.message))
  let stext = `<div class='link_preview_text'>${text}</div>`
  ans.link_preview_text = text
  ans.link_preview = stext + ans.link_preview

  return ans
}

// Setups link preview elements
App.setup_link_preview = (fmessage) => {
  let link_preview_el = DOM.el(`.link_preview`, fmessage)
  let link_preview_image = DOM.el(`.link_preview_image`, link_preview_el)

  if (link_preview_image) {
    DOM.ev(link_preview_image, `error`, () => {
      link_preview_image.style.display = `none`
    })
  }

  App.urlize(DOM.el(`.link_preview_text`, link_preview_el.parentElement))
}

// Makes image preview elements
App.make_image_preview = (message) => {
  let ans = {}

  if (message.startsWith(`>`)) {
    return ans
  }

  ans.image_preview = false
  ans.image_preview_src = false
  ans.image_preview_src_original = false
  ans.image_preview_text = false

  let link = App.utilz.get_first_url(message)

  if (!link) {
    return ans
  }

  if (link.includes(`imgur.com`)) {
    let code = App.utilz.get_imgur_image_code(link)

    if (code) {
      let extension = App.utilz.get_extension(link)
      ans.image_preview_text = message
      ans.image_preview_src_original = `https://i.imgur.com/${code}.${extension}`
      ans.image_preview_src = `https://i.imgur.com/${code}l.jpg`
      ans.image_preview = App.template_image_preview({
        text: message,
        source: ans.image_preview_src
      })
    }
  }

  return ans
}

// Setups image preview elements
App.setup_image_preview = (fmessage, image_preview_src_original) => {
  let image_preview_el = DOM.el(`.image_preview`, fmessage)
  let image_preview_image = DOM.el(`.image_preview_image`, image_preview_el)

  DOM.ev(image_preview_image, `error`, () => {
    image_preview_image.style.display = `none`
  })

  App.urlize(DOM.el(`.image_preview_text`, image_preview_el.parentElement))
  DOM.dataset(image_preview_image, `image_preview_src_original`, image_preview_src_original)
}

// Starts chat area scroll events
App.scroll_events = () => {
  let chat = DOM.el(`#chat_area_parent`)

  DOM.ev(chat, `scroll`, (e) => {
    App.scroll_timer()
    App.update_scroll_percentage()
  })
}

// Update the scroll percentange on the chat scrollers
App.update_scroll_percentage = () => {
  let area = DOM.el(`#chat_area_parent`)
  let container = DOM.el(`#chat_main`)
  let p = (area.scrollTop || container.scrollTop) / ((area.scrollHeight || container.scrollHeight) - area.clientHeight)
  let percentage = Math.round(p * 100)
  DOM.el(`#top_percentage_scroller`).textContent = `${percentage}%`
  DOM.el(`#bottom_percentage_scroller`).textContent = `${percentage}%`
}

// Shows the top scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
App.show_top_scroller = () => {
  if (App.top_scroller_visible) {
    return
  }

  DOM.el(`#top_scroller_container`).style.visibility = `visible`
  App.top_scroller_visible = true
}

// Hides the top scroller
App.hide_top_scroller = () => {
  if (!App.top_scroller_visible) {
    return
  }

  DOM.el(`#top_scroller_container`).style.visibility = `hidden`
  App.top_scroller_visible = false
}

// Shows the bottom scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
App.show_bottom_scroller = () => {
  if (App.bottom_scroller_visible) {
    return
  }

  DOM.el(`#bottom_scroller_container`).style.visibility = `visible`
  App.chat_scrolled = true
  App.bottom_scroller_visible = true
}

// Hides the bottom scroller
App.hide_bottom_scroller = () => {
  if (!App.bottom_scroller_visible) {
    return
  }

  DOM.el(`#bottom_scroller_container`).style.visibility = `hidden`
  App.chat_scrolled = false
  App.bottom_scroller_visible = false
}

// Updates scrollers state based on scroll position
App.check_scrollers = () => {
  if (!App.started || !App.has_focus) {
    return
  }

  let threshold = 100
  let area = DOM.el(`#chat_area_parent`)
  let max = area.scrollHeight - area.clientHeight
  let diff = max - area.scrollTop

  if (diff < threshold) {
    App.hide_top_scroller()
    App.hide_bottom_scroller()
  }
  else {
    if (area.scrollTop < threshold) {
      App.hide_top_scroller()
    }
    else {
      App.show_top_scroller()
    }

    App.show_bottom_scroller()
  }
}

// Scrolls the chat to the top
App.goto_top = () => {
  App.scroll_chat_to(0)
  App.hide_top_scroller()
}

// Scrolls the chat to the bottom
App.goto_bottom = (force = false) => {
  if (!App.started || !App.has_focus) {
    return
  }

  let chat = DOM.el(`#chat_area_parent`)
  let max = chat.scrollHeight - chat.clientHeight

  if (force || !App.chat_scrolled) {
    App.hide_top_scroller()
    App.hide_bottom_scroller()
    App.scroll_chat_to(max)
  }
}

// Fills the chat and media changes with log messages from initial data
App.show_log_messages = (log_messages) => {
  let num_image = 0
  let num_tv = 0

  if (log_messages && log_messages.length > 0) {
    for (let message of log_messages) {
      let type = message.type

      if (type === `image`) {
        num_image += 1
      }
      else if (type === `tv`) {
        num_tv += 1
      }
    }
  }

  // If there are no media items in the log, show the current room media

  if (num_image === 0) {
    App.setup_media_object(
      `image`,
      `show`,
      Object.assign(App.get_media_object_from_init_data(`image`))
    )
  }

  if (num_tv === 0) {
    App.setup_media_object(
      `tv`,
      `show`,
      Object.assign(App.get_media_object_from_init_data(`tv`))
    )
  }

  if (log_messages && log_messages.length > 0) {
    for (let message of log_messages) {
      let type = message.type
      let data = message.data

      if (data) {
        if (type === `chat`) {
          App.make_chat_message(data)
        }
        else if (type === `image`) {
          App.setup_media_object(`image`, `show`, data)
        }
        else if (type === `tv`) {
          App.setup_media_object(`tv`, `show`, data)
        }
      }
    }
  }
}

// Sends a simple shrug chat message
App.shrug = () => {
  App.process_input({
    message: `¯\\_(ツ)_/¯`
  })
}

// Centralized function to show local feedback messages
App.feedback = (message, data = false) => {
  let obj = {
    brk: App.get_chat_icon(`info`),
    message: message
  }

  if (data) {
    Object.assign(obj, data)
  }

  if (!obj.brk.startsWith(`<`) && !obj.brk.endsWith(`>`)) {
    obj.brk = `<div class='inline'>${obj.brk}</div>`
  }

  return App.make_announcement_message(obj)
}

// Centralized function to show public announcement messages
App.public_feedback = (message, data = false) => {
  let obj = {
    brk: App.get_chat_icon(`info`),
    message: message
  }

  if (data) {
    Object.assign(obj, data)
  }

  if (!obj.brk.startsWith(`<`) && !obj.brk.endsWith(`>`)) {
    obj.brk = `<div class='inline'>${obj.brk}</div>`
  }

  if (App.check_highlights(message)) {
    obj.highlight = true
  }

  return App.make_announcement_message(obj)
}

// Setups some chat configs
App.setup_chat = () => {
  DOM.ev(DOM.el(`#top_scroller`), `click`, () => {
    App.goto_top()
  })

  DOM.ev(DOM.el(`#activity_up_scroller`), `click`, () => {
    App.activity_above()
  })

  DOM.ev(DOM.el(`#bottom_scroller`), `click`, () => {
    App.goto_bottom(true)
    App.unselect_message()
  })

  DOM.ev(DOM.el(`#activity_down_scroller`), `click`, () => {
    App.activity_below()
  })

  DOM.ev(DOM.el(`#top_percentage_scroller`), `click`, () => {
    App.scroll_up_2()
  })

  DOM.ev(DOM.el(`#bottom_percentage_scroller`), `click`, () => {
    App.scroll_down_2()
  })

  App.chat_resize_observer = new ResizeObserver(() => {
    App.check_max_chat_messages()
    App.goto_bottom()
  })

  App.chat_resize_observer.observe(DOM.el(`#chat_area`))
  App.chat_resize_observer.observe(DOM.el(`#chat_area_parent`))

  App.check_chat_enabled()
  App.do_chat_font_size_change()

  let options = {
    root: DOM.el(`#chat_area_parent`),
    rootMargin: `0px`,
    threshold: 1,
  }

  App.chat_intersection_observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      DOM.dataset(entry.target, `visible`, entry.isIntersecting)
    }
  }, options)
}

// Replace things like $id$ with the message id
App.replace_message_vars = (id, message) => {
  if (id) {
    message = message.replace(/\$id\$/g, id)
  }

  return message
}

// Sets the chat display percentage to default
App.set_default_chat_size = () => {
  App.do_chat_size_change(`default`)
}

// Set the default chat font size
App.set_default_chat_font_size = (size) => {
  App.do_chat_font_size_change(`default`)
}

// Shows an alert when a message follows a user's message
App.activity_notification = (username) => {
  if (!App.started) {
    return
  }

  if (!App.get_setting(`show_activity_notifications`)) {
    return
  }

  if (!App.has_focus) {
    App.show_activity_desktop_notification(username)
  }
}

// Get last chat message or announcement date
App.get_last_message_date = () => {
  let a = DOM.dataset(DOM.els(`#chat_area .chat_content_container`).slice(-1)[0], `date`) || 0
  let b = DOM.dataset(DOM.els(`#chat_area .media_announcement`).slice(-1)[0], `date`) || 0
  return Math.max(a, b)
}

// Clear the chat by adding a spacer
App.add_chat_spacer = () => {
  for (let el of DOM.els(`.clear_spacer`)) {
    el.remove()
  }

  let spacer = DOM.create(`div`, `message clear_spacer`)
  DOM.el(`#chat_area`).append(spacer)
  App.goto_bottom(true)
}

// Deletes all chat messages
App.clear_log = () => {
  if (!App.is_admin()) {
    App.not_allowed()
    return
  }

  App.show_confirm(`Delete all messages from the log`, () => {
    App.socket_emit(`clear_log`, {})
  })
}

// When chat log is cleared
App.announce_log_cleared = (data) => {
  let areas = DOM.els(`.chat_area`)

  for (let area of areas) {
    area.innerHTML = ``
  }

  App.feedback(`Log cleared by ${data.username}`)

  App.image_changed = []
  App.tv_changed = []
  App.loaded_image = {}
  App.loaded_tv = {}
}

// Setup delete messages
App.setup_delete_messages = () => {
  DOM.ev(DOM.el(`#delete_messages_one`), `click`, () => {
    App.delete_message_action()
  })

  DOM.ev(DOM.el(`#delete_messages_group`), `click`, () => {
    App.msg_delete_messages.close()
    App.delete_message_group(App.delete_messages_id)
  })

  DOM.ev(DOM.el(`#delete_messages_above`), `click`, () => {
    App.msg_delete_messages.close()
    App.delete_messages_above(App.delete_messages_id)
  })

  DOM.ev(DOM.el(`#delete_messages_below`), `click`, () => {
    App.msg_delete_messages.close()
    App.delete_messages_below(App.delete_messages_id)
  })
}

// Delete message action
App.delete_message_action = () => {
  App.msg_delete_messages.close()
  App.delete_message(App.delete_messages_id)
}

// Handles delete message
App.handle_delete_messages = (id, user_id) => {
  let user = App.get_user_by_user_id(user_id)

  if (App.user_id !== user_id && !App.superuser) {
    if (user && App.is_admin(user)) {
      App.forbidden_user()
      return
    }
  }

  App.delete_messages_id = id

  let msg = App.get_message_by_id(id)
  let unit = msg[0]
  let index = msg[1]
  let num = App.get_num_message_units(unit)
  let num_messages = App.get_all_units().length
  let shown = 1

  DOM.el(`#delete_messages_group`).style.display = `none`
  DOM.el(`#delete_messages_above`).style.display = `none`
  DOM.el(`#delete_messages_below`).style.display = `none`

  if (num > 1) {
    DOM.el(`#delete_messages_group`).style.display = `flex`
    shown += 1
  }

  if (App.is_admin() && index !== 0) {
    DOM.el(`#delete_messages_above`).style.display = `flex`
    shown += 1
  }

  if (App.is_admin() && index < num_messages - 1) {
    DOM.el(`#delete_messages_below`).style.display = `flex`
    shown += 1
  }

  if (shown === 1) {
    App.delete_message(App.delete_messages_id)
    return
  }

  App.horizontal_separator(DOM.el(`#delete_messages_titlebar`))
  App.msg_delete_messages.show()
}

// When messages above were deleted
App.deleted_messages_above = (data) => {
  if (!App.is_admin()) {
    App.not_allowed()
    return
  }

  let ans = App.get_message_by_id(data.id)

  if (!ans) {
    return
  }

  let units = App.get_all_units()

  for (let i=0; i<ans[1]; i++) {
    let unit = units[i]
    let mode = DOM.dataset(unit.closest(`.message`), `mode`)

    if (mode === `chat`) {
      App.process_remove_chat_message(unit)
    }
    else if (mode == `announcement`) {
      App.process_remove_announcement(unit)
    }
  }
}

// When messages below were deleted
App.deleted_messages_below = (data) => {
  if (!App.is_admin()) {
    App.not_allowed()
    return
  }

  let ans = App.get_message_by_id(data.id)

  if (!ans) {
    return
  }

  let units = App.get_all_units()

  for (let i=ans[1]+1; i<units.length; i++) {
    let unit = units[i]
    let mode = DOM.dataset(unit.closest(`.message`), `mode`)

    if (mode === `chat`) {
      App.process_remove_chat_message(unit)
    }
    else if (mode == `announcement`) {
      App.process_remove_announcement(unit)
    }
  }
}

// Check chat enabled
App.check_chat_enabled = () => {
  if (App.room_state.chat_enabled) {
    DOM.el(`#chat_main`).classList.remove(`nodisplay`)
  }
  else {
    DOM.el(`#chat_main`).classList.add(`nodisplay`)
  }
}

// Set chat enabled
App.set_chat_enabled = (what) => {
  App.room_state.chat_enabled = what
  App.save_room_state()
  App.check_chat_enabled()
  App.fix_frames()
  App.goto_bottom(true)
}

// Set default chat enabled
App.set_default_chat_enabled = () => {
  App.set_chat_enabled(App.config.room_state_default_chat_enabled)
}

// Increases the chat display percentage
App.increase_chat_percentage = () => {
  let size = App.room_state.chat_display_percentage
  size += 5
  size = App.utilz.round2(size, 5)
  App.do_chat_size_change(size)
}

// Decreases the chat display percentage
App.decrease_chat_percentage = () => {
  let size = App.room_state.chat_display_percentage
  size -= 5
  size = App.utilz.round2(size, 5)
  App.do_chat_size_change(size)
}

// Increase chat font size
App.increase_chat_font_size = () => {
  App.do_chat_font_size_change(App.room_state.chat_font_size + 0.1)
}

// Decrease chat font size
App.decrease_chat_font_size = () => {
  App.do_chat_font_size_change(App.room_state.chat_font_size - 0.1)
}

// Do chat font size change
App.do_chat_font_size_change = (size = App.room_state.chat_font_size) => {
  if (size === `max`) {
    size = App.max_chat_font_size
  }
  else if (size === `min`) {
    size = App.min_chat_font_size
  }
  else if (size === `default`) {
    size = App.config.room_state_default_chat_font_size
  }

  size = App.utilz.round(size, 1)

  if (size < App.min_chat_font_size || size > App.max_chat_font_size) {
    return
  }

  App.room_state.chat_font_size = size
  document.documentElement.style.setProperty(`--chat_font_size`, `${size}em`)
  App.goto_bottom(true)
  App.save_room_state()
}

// Check if chat messages need pruning
App.check_max_chat_messages = () => {
  if (!App.started) {
    return
  }

  let messages = App.get_all_messages()

  if (messages.length > App.config.chat_crop_limit) {
    let diff = messages.length - App.config.chat_crop_limit

    for (let message of messages.slice(0, diff)) {
      message.remove()
    }
  }
}

// Like a message
App.like_message = (target, type) => {
  let unit = target.closest(`.message_unit`)

  if (type === `like` && DOM.dataset(unit, `likes`).length >= App.config.max_likes) {
    return
  }

  let id = DOM.dataset(unit, `id`)

  App.socket_emit(`like_message`, {
    id: id,
    type: type
  })
}

// Liked message
App.liked_message = (data) => {
  let ans = App.get_message_by_id(data.id)

  if (ans) {
    let el = ans[0]
    let likes = DOM.dataset(el, `likes`)

    if (data.type === `like`) {
      likes.push(data.obj)
    }
    else if (data.type === `unlike`) {
      likes = likes.filter(x => x.user_id !== data.obj.user_id)
    }

    DOM.dataset(el, `likes`, likes)
    App.update_likes(el, likes)

    if (App.msg_chat_search.is_open()) {
      let id = DOM.dataset(el, `id`)

      for (let item of DOM.els(`#chat_search_container .message_unit`)) {
        if (id === DOM.dataset(item, `id`)) {
          App.update_likes(item, likes)
          break
        }
      }
    }
  }
}

// Update likes container
App.update_likes = (el, likes) => {
  let c = DOM.el(`.likes_container`, el)

  if (likes.length > 0) {
    c.innerHTML = `<div class='likes_label'>^ Likes:</div><div class='likes_items'></div>`
    for (let obj of likes) {
      let pi = App.get_profilepic(obj.user_id)
      let el = DOM.create(`div`, `like_container dynamic_title`)
      el.innerHTML = App.template_like({profilepic: pi})

      let nd = App.utilz.nice_date(obj.date)
      let title = `${obj.username} | ${nd}`
      el.title = title

      DOM.dataset(el, `user_id`, obj.user_id)
      DOM.dataset(el, `username`, obj.username)
      DOM.dataset(el, `date`, obj.date)
      DOM.dataset(el, `otitle`, title)

      let profilepic = DOM.el(`.like_profilepic`, el)
      DOM.ev(profilepic, `error`, () => {
        App.fallback_profilepic(profilepic)
      })

      DOM.el(`.likes_items`, c).append(el)
    }
    c.style.display = `flex`
  }
  else {
    c.style.display = `none`
  }
}

// Get number of units in a message
App.get_num_message_units = (unit) => {
  let message = unit.closest(`.message`)
  return DOM.els_or_self(`.message_unit`, message).length
}

// Select message unit
App.select_unit = (unit) => {
  unit.classList.add(`selected_message`)
  unit.scrollIntoView({block: `center`})
  App.selected_message = unit
  App.last_selected_message = unit
}

// Select middle message
App.select_middle_message = () => {
  let visible = App.get_visible_units()
  let unit = App.utilz.get_middle_item(visible)
  App.select_unit(unit)
}

// Remove selected classes
App.remove_selected_classes = () => {
  for (let unit of DOM.els(`.selected_message`)) {
    unit.classList.remove(`selected_message`)
  }
}

// Check last selected message action
App.check_last_selected_message = () => {
  let last_u = DOM.el_or_self(`.message_unit`, App.last_selected_message)

  if (DOM.dataset(last_u, `visible`)) {
    App.select_unit(App.last_selected_message)
  }
  else {
    App.select_middle_message()
  }
}

// Select next message in a direction
App.select_message = (direction = `up`) => {
  if (App.chat_scrolled) {
    if (App.selected_message) {
      let u = DOM.el_or_self(`.message_unit`, App.selected_message)

      if (!DOM.dataset(u, `visible`)) {
        App.remove_selected_classes()

        if (App.last_selected_message) {
          App.check_last_selected_message()
        }
        else {
          App.select_middle_message()
        }

        return
      }
    }
    else if (App.last_selected_message) {
      App.remove_selected_classes()
      App.check_last_selected_message()
      return
    }
  }

  let units = App.get_all_units()

  if (App.selected_message) {
    if (direction === `up`) {
      if (App.selected_message === units[0]) {
        return
      }
    }
    else if (direction === `down`) {
      if (App.selected_message === units[units.length - 1]) {
        return
      }
    }

    let found = false

    if (direction === `up`) {
      units.reverse()
    }

    for (let unit of units) {
      if (found) {
        App.select_unit(unit)
        return
      }

      if (unit.classList.contains(`selected_message`)) {
        unit.classList.remove(`selected_message`)
        found = true
      }
    }
  }
  else {
    if (!App.chat_scrolled) {
      units.reverse()
      let unit = units[0]
      App.select_unit(unit)
    }
    else {
      App.select_middle_message()
    }
  }
}

// Unselect message
App.unselect_message = () => {
  let units = DOM.els(`#chat_area .selected_message`)

  for (let unit of units) {
    unit.classList.remove(`selected_message`)
  }

  App.selected_message = undefined
}

// Selected message action
App.selected_message_action = () => {
  let el = DOM.el_or_self(`.unit_text`, App.selected_message)
  App.show_chat_context_menu(el)
  App.unselect_message()
}

// Get all messages
App.get_all_messages = () => {
  return DOM.els(`#chat_area > .message`)
}

// Get all announcements
App.get_all_announcements = () => {
  return DOM.els(`#chat_area > .message.announcement`)
}

// Get all units
App.get_all_units = () => {
  return DOM.els(`#chat_area .message_unit`)
}

// Get visible messages
App.get_visible_units = () => {
  let visible = []

  for (let unit of App.get_all_units()) {
    if (DOM.dataset(unit, `visible`)) {
      visible.push(unit)
    }
  }

  return visible
}

// Observe message
App.observe_message = (unit) => {
  if (unit) {
    App.chat_intersection_observer.observe(unit)
  }
}

// Lock the chat by showing scrollers
App.lock_chat = () => {
  App.show_top_scroller()
  App.show_bottom_scroller()
}