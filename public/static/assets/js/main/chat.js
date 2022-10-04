// This generates all user chat messages inserted into the chat
Hue.make_chat_message = function (args = {}) {
  let def_args = {
    edited: false,
    just_edited: false
  }

  args = Object.assign(def_args, args)

  // Temporary fix
  args.message = args.message || args.content

  let num_lines = args.message.split("\n").length

  if (num_lines === 1) {
    if (args.message.startsWith(Hue.config.commands_prefix + Hue.config.commands_prefix)) {
      args.message = args.message.slice(1)
    }
  }

  args.message = Hue.replace_message_vars(args.id, args.message)
  let content_classes = "chat_content unit_text"
  let d = args.date ? args.date : Date.now()
  let nd = Hue.utilz.nice_date(d)
  let pi = Hue.get_profilepic(args.user_id)
  let image_preview = false
  let image_preview_src_original = false
  let image_preview_text = false

  if (Hue.get_setting("embed_images")) {
    let ans = Hue.make_image_preview(args.message)

    image_preview = ans.image_preview
    image_preview_src_original = ans.image_preview_src_original
    image_preview_text = ans.image_preview_text
  }

  let link_preview = false
  let link_preview_text = false

  if (
    !image_preview &&
    (args.link_title || args.link_description) &&
    Hue.get_setting("show_link_previews")
  ) {
    let ans = Hue.make_link_preview({
      message: args.message,
      image: args.link_image,
      title: args.link_title,
      description: args.link_description,
    })

    link_preview = ans.link_preview
    link_preview_text = ans.link_preview_text
  }

  let highlighted = false
  let preview_text_class = ""

  if (args.username !== Hue.username) {
    if (image_preview && image_preview_text) {
      if (Hue.check_highlights(image_preview_text)) {
        preview_text_class = "highlighted_message"
        highlighted = true
      }
    } else if (link_preview && link_preview_text) {
      if (Hue.check_highlights(link_preview_text)) {
        preview_text_class = "highlighted_message"
        highlighted = true
      }
    } else {
      if (Hue.check_highlights(args.message)) {
        content_classes += " highlighted_message"
        highlighted = true
      }
    }
  }

  if (args.quote_user_id === Hue.user_id) {
    highlighted = true
  }

  let fmessage
  let title = ""

  if (args.edited) {
    title += "Edited | "
  }

  title = title + nd

  let gets = Hue.getcode(args.id)

  if (Hue.utilz.bingo(gets)) {
    content_classes += " colortext goldtext"
  }

  title = `${gets} | ${title}`

  fmessage = Hue.create("div", "message chat_message user_details")

  fmessage.innerHTML = Hue.template_chat_message({
    content_classes: content_classes,
    profilepic: pi,
    title: title,
    date: d
  })

  let content = Hue.el(".chat_content", fmessage)

  if (image_preview) {
    content.innerHTML = image_preview

    if (preview_text_class) {
      Hue.el(".image_preview_text", fmessage).classList.add(preview_text_class)
    }
  } else if (link_preview) {
    content.innerHTML = link_preview

    if (preview_text_class) {
      Hue.el(".link_preview_text", fmessage).classList.add(preview_text_class)
    }
  } else {
    content.innerHTML = Hue.parse_text(Hue.utilz.make_html_safe(args.message))
  }

  let quote = Hue.el(".chat_quote", fmessage)

  if (args.quote) {
    quote.innerHTML = Hue.template_chat_quote({
      username: args.quote_username,
      quote: args.quote,
      profilepic: Hue.get_profilepic(args.quote_user_id)
    })

    Hue.dataset(quote, "quote_username", args.quote_username)
    Hue.dataset(quote, "quote_user_id", args.quote_user_id)
    Hue.dataset(quote, "quote_id", args.quote_id)

    let quote_profilepic = Hue.el(".chat_quote_profilepic", quote)

    Hue.ev(quote_profilepic, "error", function () {
      Hue.fallback_profilepic(this)
    })
  } else {
    quote.style.display = "none"
  }

  let chat_username = Hue.el(".chat_username", fmessage)
  chat_username.textContent = args.username

  let htimeago = Hue.el(".chat_timeago", fmessage)
  htimeago.textContent = Hue.utilz.timeago(d)

  Hue.ev(Hue.el(".profilepic", fmessage), "error", function () {
    Hue.fallback_profilepic(this)
  })

  let rightside = Hue.el(".chat_right_side", fmessage)
  Hue.dataset(rightside, "date", d)
  Hue.dataset(rightside, "otitle", nd)

  let first_url = false

  if (image_preview) {
    first_url = image_preview_src_original
  } else if (link_preview) {
    first_url = args.link_url
  } else {
    first_url = Hue.utilz.get_first_url(args.message)
  }

  Hue.dataset(fmessage, "username", args.username)
  Hue.dataset(fmessage, "user_id", args.user_id)
  Hue.dataset(fmessage, "date", d)
  Hue.dataset(fmessage, "highlighted", highlighted)
  Hue.dataset(fmessage, "mode", "chat")
  
  let content_container = Hue.el(".chat_content_container", fmessage)
  Hue.dataset(content_container, "id", args.id)
  Hue.dataset(content_container, "edited", args.edited)
  Hue.dataset(content_container, "highlighted", highlighted)
  Hue.dataset(content_container, "date", d)
  Hue.dataset(content_container, "first_url", first_url)
  Hue.dataset(content_container, "original_message", args.message)
  Hue.dataset(content_container, "otitle", title)
  Hue.dataset(content_container, "username", args.username)
  Hue.dataset(content_container, "user_id", args.user_id)

  args.likes = args.likes || []
  Hue.dataset(content_container, "likes", args.likes)
  Hue.update_likes(content_container, args.likes)

  if (!image_preview && !link_preview) {
    Hue.urlize(content)
  }

  if (image_preview) {
    Hue.setup_image_preview(fmessage, image_preview_src_original, args.user_id)
  }

  if (link_preview) {
    Hue.setup_link_preview(fmessage)
  }

  let ans = Hue.insert_message({
    id: args.id,
    message: fmessage,
    just_edited: args.just_edited,
  })

  if (!args.edited) {
    if (args.username !== Hue.username) {
      if (highlighted) {
        Hue.on_highlight(args.username)
      } else {
        Hue.on_activity("message")
      }
    }
  }

  Hue.push_to_all_usernames(args.username)
  Hue.observe_message(ans.message_unit)

  return {
    message_id: ans.message_id
  }
}

// This generates all announcements inserted into the chat
Hue.make_announcement_message = function (args = {}) {
  let def_args = {
    highlight: false,
    type: "normal"
  }

  args = Object.assign(def_args, args)

  let is_media = args.type === "image_change" || args.type === "tv_change"
  let content_classes = "announcement_content unit_text"
  let brk_classes = "brk announcement_brk"
  let highlighted = false

  if (args.highlight) {
    content_classes += " highlighted_message"
    highlighted = true
  }

  let d = args.date ? args.date : Date.now()
  let t = args.title ? args.title : Hue.utilz.nice_date(d)

  if (is_media) {
    content_classes += " action"
    brk_classes += " action"
  }

  if (args.user_id) {
    brk_classes += " pos_absolute"
  }

  if (is_media) {
    if (Hue.utilz.bingo(Hue.getcode(args.id))) {
      content_classes += " colortext goldtext"
    }
  }

  let top_clasees = "chat_message_top announcement_top"

  if (!is_media) {
    top_clasees += " nodisplay"
  }

  let fmessage = Hue.create("div", "message announcement message_unit unit_data_container")

  fmessage.innerHTML = Hue.template_announcement_message({
    content_classes: content_classes,
    brk_classes: brk_classes,
    top_classes: top_clasees,
    brk: args.brk
  })

  if (args.container_id) {
    fmessage.id = args.container_id
  }

  if (is_media) {
    fmessage.classList.add("media_announcement")
  }

  let content_container = Hue.el(".announcement_content_container", fmessage)
  Hue.dataset(content_container, "original_message", args.comment)
  let content = Hue.el(".announcement_content", fmessage)

  if (is_media) {
    let username = Hue.el(".chat_username", fmessage)
    let date = Hue.el(".chat_timeago", fmessage)
    username.textContent = args.username
    date.textContent = Hue.utilz.timeago(args.date)
  }

  let right_side = Hue.el(".announcement_right_side", fmessage)
  Hue.dataset(right_side, "otitle", t)
  Hue.dataset(right_side, "date", d)

  content.textContent = args.message
  Hue.urlize(content)

  let brk_profilepic = Hue.el(".brk_profilepic", fmessage)

  if (args.user_id) {
    brk_profilepic.src = Hue.get_profilepic(args.user_id)
  } else {
    brk_profilepic.style.display = "none"
  }

  Hue.ev(Hue.el(".profilepic", fmessage), "error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.dataset(fmessage, "id", args.id)
  Hue.dataset(fmessage, "date", d)
  Hue.dataset(fmessage, "highlighted", highlighted)
  Hue.dataset(fmessage, "type", args.type)
  Hue.dataset(fmessage, "username", args.username)
  Hue.dataset(fmessage, "mode", "announcement")
  Hue.dataset(fmessage, "user_id", args.user_id)
  Hue.dataset(fmessage, "media_source", args.media_source)
  Hue.dataset(fmessage, "original_message", args.message)

  args.likes = args.likes || []
  Hue.dataset(fmessage, "likes", args.likes)
  Hue.update_likes(fmessage, args.likes)

  let ans = Hue.insert_message({
    message: fmessage
  })

  if (highlighted) {
    Hue.on_highlight(args.username)
  }

  Hue.push_to_all_usernames(args.username)
  Hue.observe_message(ans.message_unit)

  return {
    message_id: ans.message_id
  }
}

// This is a centralized function to insert all chat messages or announcements into the chat
Hue.insert_message = function (args = {}) {
  let def_args = {
    just_edited: false
  }

  args = Object.assign(def_args, args)

  let messages = Hue.get_all_messages()
  let last_message = messages.slice(-1)[0]
  let appended = false
  let mode = Hue.dataset(args.message, "mode")
  let user_id = Hue.dataset(args.message, "user_id")
  let username = Hue.dataset(args.message, "username")
  let date = Hue.dataset(args.message, "date")
  let highlighted = Hue.dataset(args.message, "highlighted")
  let content_container, message_id, message_unit

  if (mode === "chat") {
    content_container = Hue.el(".chat_content_container", args.message)
    Hue.chat_content_container_id += 1
    Hue.dataset(content_container, "chat_content_container_id", Hue.chat_content_container_id)
    content_container.classList.add(`chat_content_container_${Hue.chat_content_container_id}`)

    if (args.just_edited && args.id) {
      for (let item of Hue.els("#chat_area .message_unit")) {
        if (args.id === Hue.dataset(item, "id")) {
          let clone = Hue.clone(content_container)
          item.replaceWith(clone)
          message_unit = Hue.el_or_self(".message_unit", clone)
          
          if (Hue.last_selected_message) {
            if (args.id === Hue.dataset(Hue.last_selected_message, "id")) {
              Hue.last_selected_message = message_unit
            }
          }

          break
        }
      }

      if (Hue.msg_chat_search.is_open()) {
        for (let item of Hue.els("#chat_search_container .message_unit")) {
          if (args.id === Hue.dataset(item, "id")) {
            let clone = Hue.clone(content_container)
            item.replaceWith(clone)
            break
          }
        }
      }

      return {
        message_id: Hue.dataset(last_message, "message_id"),
        message_unit: message_unit
      }
    }
  } else if (mode === "announcement") {
    message_unit = Hue.el_or_self(".message_unit", args.message)
  }

  if (last_message) {
    if (mode === "chat" && Hue.dataset(last_message, "mode") === "chat") {
      if (
        Hue.el(".chat_username", args.message).textContent ===
        Hue.el(".chat_username", last_message).textContent
      ) {
        if (
          Hue.els(".chat_content", last_message).length <
          Hue.config.max_same_post_messages
        ) {
          let c1 = Hue.els(".chat_content_container", args.message).slice(-1)[0]
          let c2 = Hue.els(".chat_content_container", last_message).slice(-1)[0]
          let date_diff = Hue.dataset(c1, "date") - Hue.dataset(c2, "date")

          if (date_diff < Hue.config.max_same_post_diff) {
            Hue.dataset(content_container, "date", date)
            Hue.dataset(content_container, "highlighted", highlighted)

            Hue.el(".chat_container", last_message).append(content_container)
            message_id = Hue.dataset(last_message, "message_id")

            if (!Hue.dataset(last_message, "highlighted")) {
              Hue.dataset(last_message, "highlighted", highlighted)
            }

            appended = true
          }
        }
      }
    }
  }

  if (mode === "chat") {
    message_unit = Hue.el_or_self(".message_unit", content_container)
  }

  if (!appended) {
    Hue.el("#chat_area").append(args.message)
    Hue.message_id += 1
    message_id = Hue.message_id
    Hue.dataset(args.message, "message_id", message_id)
    args.message.classList.add(`message_id_${message_id}`)
  }

  if (Hue.started) {
    if (Hue.chat_scrolled) {
      Hue.update_scroll_percentage()
    }

    if (highlighted) {
      if (Hue.room_state.last_highlight_date < date) {
        if (Hue.has_focus) {
          Hue.room_state.last_highlight_date = date
          Hue.save_room_state()
        }
      }
    } else if (user_id) {
      if (user_id !== Hue.user_id) {
        if (Hue.last_chat_user_id === Hue.user_id) {
          Hue.activity_notification(username)
        }
      }
    }
  }

  if (user_id) {
    Hue.last_chat_user_id = user_id

    if (Hue.started) {
      Hue.update_user_activity(user_id)
    }
  }

  if (Hue.started && !Hue.has_focus) {
    if (content_container) {
      Hue.add_fresh_message(content_container)
    } else {
      let container = Hue.el(".announcement_content_container", args.message)
      Hue.add_fresh_message(container)
    }
  }

  return {
    message_id: message_id,
    message_unit: message_unit
  }
}

// Get reply text
Hue.get_reply_text = function () {
  let ans = Hue.get_message_by_id(Hue.reply_id)

  if (!ans || !ans[0]) {
    return ""
  }

  let text = Hue.dataset(Hue.el_or_self(".unit_data_container", ans[0]), "original_message")
  return Hue.remove_urls(Hue.utilz.single_space(text))
}

// Setup reply
Hue.setup_reply = function () {
  Hue.ev(Hue.el("#input_reply_cancel"), "click", function () {
    Hue.hide_reply()
  })

  Hue.ev(Hue.el("#input_reply_container"), "mouseenter", function (e) {
    e.target.title = `${Hue.reply_username}: ${Hue.get_reply_text()}`
  })

  let pf = Hue.el("#input_reply_profilepic")

  Hue.ev(pf, "error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.ev(pf, "click", function () {
    Hue.show_profile(Hue.reply_username, Hue.reply_user_id)
  })
}

// Prepare data to show the reply window
Hue.start_reply = function (target) {
  if (target.tagName === "A") {
    return
  }

  if (Hue.modal_open) {
    Hue.close_all_modals()
  }

  let message = target.closest(".message")
  let unit = target.closest(".message_unit")
  let username = Hue.dataset(message, "username")
  let user_id = Hue.dataset(message, "user_id")
  let id = Hue.dataset(unit, "id")

  if (!username) {
    return
  }

  Hue.reply_username = username
  Hue.reply_id = id
  Hue.reply_user_id = user_id

  Hue.show_reply()
  Hue.set_input_placeholder(`Replying to: ${username}`)
  Hue.highlight_footer()
}

// Show the reply info
Hue.show_reply = function () {
  Hue.hide_edit()
  Hue.el("#input_reply_profilepic").src = Hue.get_profilepic(Hue.reply_user_id)
  Hue.el("#input_reply_container").classList.remove("nodisplay")
  Hue.reply_active = true
  Hue.focus_input()
}

// Cancel reply
Hue.cancel_reply = function () {
  Hue.hide_reply()
  Hue.clear_input()
}

// Hide the reply info
Hue.hide_reply = function () {
  Hue.el("#input_reply_container").classList.add("nodisplay")
  Hue.reply_active = false
  Hue.check_footer_expand()
  Hue.update_input_placeholder()
}

// Submit the reply window
Hue.submit_reply = function () {
  Hue.hide_reply()

  let reply = Hue.get_input()

  if (!reply) {
    return
  }

  let otext = Hue.get_reply_text()

  if (!otext) {
    return
  }

  let quote = otext.substring(0, Hue.config.quote_max_length).trim()

  if (otext.length > quote.length) {
    quote += "..."
  }

  Hue.process_input({
    message: reply,
    quote: quote,
    quote_username: Hue.reply_username,
    quote_user_id: Hue.reply_user_id,
    quote_id: Hue.reply_id
  })
}

// Adds a message to the fresh message list
// This is a list of messages to temporarily highlight when a user refocus the client
// This is to give an indicator of fresh changes
Hue.add_fresh_message = function (container) {
  Hue.fresh_messages_list.push(container)

  if (Hue.fresh_messages_list.length > Hue.max_fresh_messages) {
    Hue.fresh_messages_list.shift()
  }
}

// Temporarily highlights recent messages since last focus
Hue.show_fresh_messages = function () {
  if (Hue.fresh_messages_list.length === 0) {
    return
  }

  for (let container of Hue.fresh_messages_list) {
    container.classList.add("fresh_message")

    setTimeout(function () {
      container.classList.remove("fresh_message")
    }, Hue.fresh_messages_duration)
  }

  Hue.fresh_messages_list = []
}

// Setup edit message
Hue.setup_edit = function () {
  Hue.ev(Hue.el("#input_edit_cancel"), "click", function () {
    Hue.cancel_edit()
  })
}

// Starts chat message editing
Hue.start_edit = function (unit) {
  if (Hue.modal_open) {
    Hue.close_all_modals()
  }
    
  Hue.edit_container = unit.closest(".message")
  Hue.edit_unit = unit
  Hue.edit_original_message = Hue.dataset(unit.closest(".unit_data_container"), "original_message")
  Hue.change_input(Hue.edit_original_message)
  Hue.hide_reply()
  Hue.show_edit()
  Hue.highlight_footer()
}

// Show edit
Hue.show_edit = function () {
  Hue.hide_reply()
  Hue.el("#input_edit_container").classList.remove("nodisplay")
  Hue.edit_active = true
}

// Hide edit
Hue.hide_edit = function () {
  Hue.el("#input_edit_container").classList.add("nodisplay")
  Hue.check_footer_expand()
  Hue.edit_active = false
}

// Submit edit
Hue.submit_edit = function () {
  let mode = Hue.dataset(Hue.edit_container, "mode")
  let edit_id
  
  if (mode === "chat") {
    edit_id = Hue.dataset(Hue.edit_unit.closest(".chat_content_container"), "id")
  } else {
    edit_id = Hue.dataset(Hue.edit_container, "id")
  }

  if (!edit_id) {
    return
  }

  let type = Hue.dataset(Hue.edit_container, "type")
  let new_message = Hue.get_input()

  Hue.hide_edit()

  if (new_message === Hue.edit_original_message) {
    Hue.clear_input()
    return
  }  

  if (mode === "chat") {
    if (new_message.length === 0) {
      Hue.delete_message(edit_id)
      return
    }

    Hue.process_input({
      message: new_message,
      edit_id: edit_id,
    })
  } else if (mode === "announcement") {
    Hue.do_edit_media_comment(type.split("_")[0], edit_id, new_message)
    Hue.clear_input()
  }
}

// Cancel edit
Hue.cancel_edit = function () {
  Hue.hide_edit()
  Hue.clear_input()
}

// Deletes a message
Hue.delete_message = function (id) {
  if (!id) {
    return
  }

  Hue.show_confirm("Delete message from the chat log", function () {
    Hue.socket_emit("delete_message", {
      id: id
    })
  })
}

// Delete message group
Hue.delete_message_group = function (id) {
  if (!id) {
    return
  }

  let msg = Hue.get_message_by_id(id)
  let unit = msg[0]
  let message = unit.closest(".message")
  let num = Hue.get_num_message_units(unit)
  let s = Hue.utilz.singular_or_plural(num, "messages")

  Hue.show_confirm(`Delete message group (${s})`, function () {

    for (let unit of Hue.els(".message_unit", message)) {
      let id = Hue.dataset(unit, "id")

      if (id) {
        Hue.socket_emit("delete_message", {
          id: id
        })
      }
    }
  })
}

// Deletes messages above
Hue.delete_messages_above = function (id) {
  if (!id) {
    return
  }

  let msg = Hue.get_message_by_id(id)
  let index = msg[1]
  let s = Hue.utilz.singular_or_plural(index, "messages")

  Hue.show_confirm(`Delete messages above (${s})`, function () {
    Hue.socket_emit("delete_messages_above", {
      id: id
    })
  })
}

// Deletes messages above
Hue.delete_messages_below = function (id) {
  if (!id) {
    return
  }

  let msg = Hue.get_message_by_id(id)
  let index = msg[1]
  let num = Hue.get_all_units().length - index - 1
  let s = Hue.utilz.singular_or_plural(num, "messages")

  Hue.show_confirm(`Delete messages below (${s})`, function () {
    Hue.socket_emit("delete_messages_below", {
      id: id
    })
  })
}

// Get message by id
Hue.get_message_by_id = function (id, container = "#chat_area") {
  if (!id) {
    return
  }

  let units = Hue.els(`${container} .message_unit`)

  for (let i=0; i<units.length; i++) {
    let uid = Hue.dataset(units[i], "id")

    if (uid && uid === id) {
      return [units[i], i, id]
    }
  }
}

// Get message
Hue.get_message = function (message_id, container = "#chat_area") {
  return Hue.el(`${container} > .message_id_${message_id}`)
}

// Get message container by id
Hue.get_message_container_by_id = function (id) {
  let unit = Hue.get_message_by_id(id)
  let message

  if (unit) {
    message = unit[0].closest(".message")
  }

  return message
}

// Remove a message from the chat
Hue.remove_message_from_chat = function (data) {
  let ans = Hue.get_message_by_id(data.id)

  if (!ans) {
    return
  }

  let message = ans[0]
  let mode = Hue.dataset(message.closest(".message"), "mode")

  if (mode === "chat") {
    Hue.process_remove_chat_message(message)
  } else if (mode == "announcement") {
    Hue.process_remove_announcement(message)
  }
}

// Removes a chat message from the chat, when triggered through the context menu
Hue.remove_message_from_context_menu = function (menu) {
  let message = menu.closest(".message")
  let mode = Hue.dataset(message, "mode")

  if (mode === "chat") {
    Hue.process_remove_chat_message(menu.closest(".chat_content_container"))
  } else if (mode === "announcement") {
    Hue.process_remove_announcement(message)
  }
}

// Determines how to remove a chat message
Hue.process_remove_chat_message = function (chat_content_container) {
  let chat_content_container_id = Hue.dataset(chat_content_container, "chat_content_container_id")

  Hue.els(".chat_content_container").forEach(it => {
    if (
      Hue.dataset(it, "chat_content_container_id") === chat_content_container_id
    ) {
      if (
        Hue.els(".chat_content_container", it.closest(".chat_container")).length === 1
      ) {
        it.closest(".message").remove()
      } else {
        it.remove()
      }
    }
  })
}

// Determines how to remove an announcement
Hue.process_remove_announcement = function (message) {
  let type = Hue.dataset(message, "type")
  let message_id = Hue.dataset(message, "message_id")

  if (
    type === "image_change" ||
    type === "tv_change"
  ) {
    let id = Hue.dataset(message, "id")
    Hue.remove_item_from_media_changed(type.replace("_change", ""), id)
  }

  Hue.els(`.message_id_${message_id}`).forEach(it => {
    it.remove()
  })
}

// Gets the most recent message by user_id
Hue.get_last_message_by_user_id = function (ouser_id) {
  let items = Hue.get_all_messages()

  for (let item of items.reverse()) {
    let user_id = Hue.dataset(item, "user_id")

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
Hue.jump_to_chat_message = function (message_id, highlight, container = "#chat_area") {
  if (!message_id) {
    return
  }

  let el = Hue.get_message(message_id, container)

  if (!el) {
    return
  }

  el.scrollIntoView({
    block: "center"
  })

  if (highlight) {
    el.classList.add("fresh_message")

    setTimeout(function () {
      el.classList.remove("fresh_message")
    }, Hue.fresh_messages_duration)
  }

  if (container === "#chat_area") {
    Hue.close_all_modals()
  }
}

// What to do after receiving a chat message from the server
Hue.on_chat_message = function (data) {
  Hue.make_chat_message(data)
}

// Find the next chat message above that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_above = function () {
  let messages = Hue.get_all_messages()

  for (let message of messages.reverse()) {
    let same_username = false
    let username = Hue.dataset(message, "username")

    if (username && username === Hue.username) {
      same_username = true
    }

    if (same_username || Hue.dataset(message, "highlighted")) {
      let rect = message.getBoundingClientRect()

      if (rect.top <= 0) {
        Hue.jump_to_chat_message(Hue.dataset(message, "message_id"), true)
        return
      }
    }
  }

  Hue.goto_top()
}

// Find the next chat message below that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_below = function () {
  let messages = Hue.get_all_messages()

  for (let message of messages) {
    let same_username = false
    let username = Hue.dataset(message, "username")

    if (username && username === Hue.username) {
      same_username = true
    }

    let area = Hue.el("#chat_area")
    let area_height = area.offsetHeight
    let area_rect = area.getBoundingClientRect()

    if (same_username || Hue.dataset(message, "highlighted")) {
      if (same_username || Hue.dataset(message, "highlighted")) {
        let rect = message.getBoundingClientRect()

        if (rect.top >= area_rect.top + area_height) {
          Hue.jump_to_chat_message(Hue.dataset(message, "message_id"), true)
          return
        }
      }
    }
  }

  Hue.goto_bottom(true)
}

// Clears the chat area
Hue.clear_chat = function () {
  Hue.el("#chat_area").innerHTML = ""
}

// Changes the chat display size
Hue.do_chat_size_change = function (size) {
  if (size === "max") {
    size = Hue.media_max_percentage
  } else if (size === "min") {
    size = Hue.media_min_percentage
  } else if (size === "default") {
    size = Hue.config.room_state_default_chat_display_percentage
  }

  size = Hue.limit_media_percentage(Hue.utilz.round2(size, 5))

  Hue.room_state.chat_display_percentage = size
  Hue.save_room_state()
  Hue.apply_media_percentages()
}

// Scrolls the chat to a certain vertical position
Hue.scroll_chat_to = function (scrolltop) {
  Hue.el("#chat_area_parent").scrollTop = scrolltop
}

// Scrolls the chat up
Hue.scroll_up = function () {
  Hue.el("#chat_area_parent").scrollTop -= Hue.chat_scroll_amount
}

// Scrolls the chat up (more)
Hue.scroll_up_2 = function () {
  Hue.el("#chat_area_parent").scrollTop -= Hue.chat_scroll_amount_2
}

// Scrolls the chat down
Hue.scroll_down = function () {
  Hue.el("#chat_area_parent").scrollTop += Hue.chat_scroll_amount
}

// Scrolls the chat down (more)
Hue.scroll_down_2 = function () {
  Hue.el("#chat_area_parent").scrollTop += Hue.chat_scroll_amount_2
}

// Generates the username mention regex using the highlights regex
Hue.generate_mentions_regex = function () {
  if (Hue.get_setting("case_insensitive_username_highlights")) {
    Hue.mentions_regex = Hue.generate_highlights_regex(Hue.username, true, true)
  } else {
    Hue.mentions_regex = Hue.generate_highlights_regex(
      Hue.username,
      false,
      true
    )
  }
}

// What to do after general activity
Hue.on_activity = function (type) {
  if (!Hue.started) {
    return
  }

  if (!Hue.has_focus) {
    if (type === "message" || type === "media_change") {
      Hue.alert_title(1)
    } else if (type === "highlight" || type === "whisper") {
      Hue.alert_title(2)
    }
  }
}

// Make link preview elements
Hue.make_link_preview = function (args = {}) {
  if (!Hue.get_setting("embed_images")) {
    args.image = ""
  }

  args.message = args.message ? args.message : ""
  args.image = args.image ? args.image : ""
  args.title = args.title ? args.title : ""
  args.description = args.description ? args.description : ""

  let ans = {}
  ans.link_preview = false

  let classes = args.image ?
    "link_preview link_preview_with_image" :
    "link_preview link_preview_no_image"
  let image_classes = args.image ?
    "link_preview_image" :
    "nodisplay"
  let title_classes = args.title ?
    "link_preview_title" :
    "nodisplay"
  let description_classes = args.description ?
    "link_preview_description" :
    "nodisplay"

  let text_content_classes = "link_preview_text_content"

  if (args.title && args.description) {
    text_content_classes += " link_preview_text_content_full"
  }

  if (!args.title && !args.description) {
    text_content_classes = "nodisplay"
  }

  ans.link_preview = Hue.template_link_preview({
    classes: classes,
    text_content_classes: text_content_classes,
    title_classes: title_classes,
    title: args.title,
    description_classes: description_classes,
    description: args.description,
    image_classes: image_classes,
    image: args.image
  }).trim()

  let text = Hue.parse_text(Hue.utilz.make_html_safe(args.message))
  let stext = `<div class='link_preview_text'>${text}</div>`
  ans.link_preview_text = text
  ans.link_preview = stext + ans.link_preview

  return ans
}

// Setups link preview elements
Hue.setup_link_preview = function (fmessage) {
  let link_preview_el = Hue.el(".link_preview", fmessage)
  let link_preview_image = Hue.el(".link_preview_image", link_preview_el)

  if (link_preview_image) {
    Hue.ev(link_preview_image, "error", function () {
      link_preview_image.style.display = "none"
      link_preview_el.classList.remove("link_preview_with_image")
    })
  }

  Hue.urlize(Hue.el(".link_preview_text", link_preview_el.parentElement))
}

// Makes image preview elements
Hue.make_image_preview = function (message) {
  let ans = {}

  if (message.startsWith(">")) {
    return ans
  }

  ans.image_preview = false
  ans.image_preview_src = false
  ans.image_preview_src_original = false
  ans.image_preview_text = false

  let link = Hue.utilz.get_first_url(message)

  if (!link) {
    return ans
  }

  if (link.includes("imgur.com")) {
    let code = Hue.utilz.get_imgur_image_code(link)

    if (code) {
      let extension = Hue.utilz.get_extension(link)
      ans.image_preview_text = message
      ans.image_preview_src_original = `https://i.imgur.com/${code}.${extension}`
      ans.image_preview_src = `https://i.imgur.com/${code}l.jpg`
      ans.image_preview = Hue.template_image_preview({
        text: message,
        source: ans.image_preview_src
      })
    }
  }

  return ans
}

// Setups image preview elements
Hue.setup_image_preview = function (fmessage, image_preview_src_original) {
  let image_preview_el = Hue.el(".image_preview", fmessage)
  let image_preview_image = Hue.el(".image_preview_image", image_preview_el)

  Hue.ev(image_preview_image, "error", function () {
    image_preview_image.style.display = "none"
  })

  Hue.urlize(Hue.el(".image_preview_text", image_preview_el.parentElement))
  Hue.dataset(image_preview_image, "image_preview_src_original", image_preview_src_original)
}

// Starts chat area scroll events
Hue.scroll_events = function () {
  let chat = Hue.el("#chat_area_parent")

  Hue.ev(chat, "scroll", function (e) {
    Hue.scroll_timer()
    Hue.update_scroll_percentage()

    if (chat.scrollTop < Hue.last_chat_scrolltop) {
      if (!Hue.chat_scrolled) {
        Hue.check_scrollers()
      }
    }

    Hue.last_chat_scrolltop = chat.scrollTop
  })
}

// Update the scroll percentange on the chat scrollers
Hue.update_scroll_percentage = function () {
  let area = Hue.el("#chat_area_parent")
  let container = Hue.el("#chat_main")
  let p = (area.scrollTop || container.scrollTop) / ((area.scrollHeight || container.scrollHeight) - area.clientHeight)
  let percentage = Math.round(p * 100)
  Hue.el("#top_percentage_scroller").textContent = `${percentage}%`
  Hue.el("#bottom_percentage_scroller").textContent = `${percentage}%`
}

// Shows the top scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
Hue.show_top_scroller = function () {
  if (Hue.top_scroller_visible) {
    return
  }

  Hue.el("#top_scroller_container").style.visibility = "visible"
  Hue.top_scroller_visible = true
}

// Hides the top scroller
Hue.hide_top_scroller = function () {
  if (!Hue.top_scroller_visible) {
    return
  }

  Hue.el("#top_scroller_container").style.visibility = "hidden"
  Hue.top_scroller_visible = false
}

// Shows the bottom scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
Hue.show_bottom_scroller = function () {
  if (Hue.bottom_scroller_visible) {
    return
  }

  Hue.el("#bottom_scroller_container").style.visibility = "visible"
  Hue.chat_scrolled = true
  Hue.bottom_scroller_visible = true
}

// Hides the bottom scroller
Hue.hide_bottom_scroller = function () {
  if (!Hue.bottom_scroller_visible) {
    return
  }

  Hue.el("#bottom_scroller_container").style.visibility = "hidden"
  Hue.chat_scrolled = false
  Hue.bottom_scroller_visible = false
}

// Updates scrollers state based on scroll position
Hue.check_scrollers = function () {
  if (!Hue.started || !Hue.has_focus) {
    return
  }

  let threshold = 5
  let area = Hue.el("#chat_area_parent")
  let max = area.scrollHeight - area.clientHeight
  let diff = max - area.scrollTop

  if (diff < threshold) {
    Hue.hide_top_scroller()
    Hue.hide_bottom_scroller()
  } else {
    if (area.scrollTop < threshold) {
      Hue.hide_top_scroller()
    } else {
      Hue.show_top_scroller()
    }

    Hue.show_bottom_scroller()
  }
}

// Scrolls the chat to the top
Hue.goto_top = function () {
  Hue.scroll_chat_to(0)
  Hue.hide_top_scroller()
}

// Scrolls the chat to the bottom
Hue.goto_bottom = function (force = false) {
  if (!Hue.started || !Hue.has_focus) {
    return
  }

  let chat = Hue.el("#chat_area_parent")
  let max = chat.scrollHeight - chat.clientHeight

  if (force || !Hue.chat_scrolled) {
    Hue.hide_top_scroller()
    Hue.hide_bottom_scroller()
    Hue.scroll_chat_to(max)
  }
}

// Fills the chat and media changes with log messages from initial data
Hue.show_log_messages = function (log_messages) {
  let num_image = 0
  let num_tv = 0

  if (log_messages && log_messages.length > 0) {
    for (let message of log_messages) {
      let type = message.type

      if (type === "image") {
        num_image += 1
      } else if (type === "tv") {
        num_tv += 1
      }
    }
  }

  // If there are no media items in the log, show the current room media

  if (num_image === 0) {
    Hue.setup_media_object(
      "image",
      "show",
      Object.assign(Hue.get_media_object_from_init_data("image"))
    )
  }

  if (num_tv === 0) {
    Hue.setup_media_object(
      "tv",
      "show",
      Object.assign(Hue.get_media_object_from_init_data("tv"))
    )
  }

  if (log_messages && log_messages.length > 0) {
    for (let message of log_messages) {
      let type = message.type
      let data = message.data

      if (data) {
        if (type === "chat") {
          Hue.make_chat_message(data)
        } else if (type === "image") {
          Hue.setup_media_object("image", "show", data)
        } else if (type === "tv") {
          Hue.setup_media_object("tv", "show", data)
        }
      }
    }
  }
}

// Sends a simple shrug chat message
Hue.shrug = function () {
  Hue.process_input({
    message: "¯\\_(ツ)_/¯"
  })
}

// Centralized function to show local feedback messages
Hue.feedback = function (message, data = false) {
  let obj = {
    brk: Hue.get_chat_icon("info"),
    message: message
  }

  if (data) {
    Object.assign(obj, data)
  }

  if (!obj.brk.startsWith("<") && !obj.brk.endsWith(">")) {
    obj.brk = `<div class='inline'>${obj.brk}</div>`
  }

  return Hue.make_announcement_message(obj)
}

// Centralized function to show public announcement messages
Hue.public_feedback = function (message, data = false) {
  let obj = {
    brk: Hue.get_chat_icon("info"),
    message: message
  }

  if (data) {
    Object.assign(obj, data)
  }

  if (!obj.brk.startsWith("<") && !obj.brk.endsWith(">")) {
    obj.brk = `<div class='inline'>${obj.brk}</div>`
  }

  if (Hue.check_highlights(message)) {
    obj.highlight = true
  }

  return Hue.make_announcement_message(obj)
}

// Setups some chat configs
Hue.setup_chat = function () {
  Hue.ev(Hue.el("#top_scroller"), "click", function () {
    Hue.goto_top()
  })

  Hue.ev(Hue.el("#activity_up_scroller"), "click", function () {
    Hue.activity_above()
  })

  Hue.ev(Hue.el("#bottom_scroller"), "click", function () {
    Hue.goto_bottom(true)
    Hue.unselect_message()
  })

  Hue.ev(Hue.el("#activity_down_scroller"), "click", function () {
    Hue.activity_below()
  })

  Hue.ev(Hue.el("#top_percentage_scroller"), "click", function () {
    Hue.scroll_up_2()
  })

  Hue.ev(Hue.el("#bottom_percentage_scroller"), "click", function () {
    Hue.scroll_down_2()
  })

  Hue.chat_resize_observer = new ResizeObserver(function () {
    Hue.check_max_chat_messages()
    Hue.goto_bottom()
  })

  Hue.chat_resize_observer.observe(Hue.el("#chat_area"))
  Hue.chat_resize_observer.observe(Hue.el("#chat_area_parent"))

  Hue.check_chat_enabled()
  Hue.do_chat_font_size_change()

  let options = {
    root: Hue.el("#chat_area_parent"),
    rootMargin: "0px",
    threshold: 1,
  }

  Hue.chat_intersection_observer = new IntersectionObserver(function (entries) {
    for (let entry of entries) {
      Hue.dataset(entry.target, "visible", entry.isIntersecting)
    }
  }, options)
}

// Replace things like $id$ with the message id
Hue.replace_message_vars = function (id, message) {
  if (id) {
    message = message.replace(/\$id\$/g, id)
  }

  return message
}

// Sets the chat display percentage to default
Hue.set_default_chat_size = function () {
  Hue.do_chat_size_change("default")
}

// Set the default chat font size
Hue.set_default_chat_font_size = function (size) {
  Hue.do_chat_font_size_change("default")
}

// Shows an alert when a message follows a user's message
Hue.activity_notification = function (username) {
  if (!Hue.started) {
    return
  }
  if (!Hue.get_setting("show_activity_notifications")) {
    return
  }

  if (!Hue.has_focus) {
    Hue.show_activity_desktop_notification(username)
  }
}

// Get last chat message or announcement date
Hue.get_last_message_date = function () {
  let a = Hue.dataset(Hue.els("#chat_area .chat_content_container").slice(-1)[0], "date") || 0
  let b = Hue.dataset(Hue.els("#chat_area .media_announcement").slice(-1)[0], "date") || 0
  return Math.max(a, b)
}

// Clear the chat by adding a spacer
Hue.add_chat_spacer = function () {
  Hue.els(".clear_spacer").forEach(it => {
    it.remove()
  })

  let spacer = Hue.create("div", "message clear_spacer")
  Hue.el("#chat_area").append(spacer)
  Hue.goto_bottom(true)
}

// Deletes all chat messages
Hue.clear_log = function () {
  if (!Hue.is_admin()) {
    Hue.not_allowed()
    return
  }

  Hue.show_confirm("Delete all messages from the log", function () {
    Hue.socket_emit("clear_log", {})
  })
}

// When chat log is cleared
Hue.announce_log_cleared = function (data) {
  let areas = Hue.els(".chat_area")

  for (let area of areas) {
    area.innerHTML = ""
  }

  Hue.feedback(`Log cleared by ${data.username}`)

  Hue.image_changed = []
  Hue.tv_changed = []
  Hue.loaded_image = {}
  Hue.loaded_tv = {}
}

// Setup delete messages
Hue.setup_delete_messages = function () {
  Hue.ev(Hue.el("#delete_messages_one"), "click", function () {
    Hue.delete_message_action()
  })

  Hue.ev(Hue.el("#delete_messages_group"), "click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_message_group(Hue.delete_messages_id)
  })

  Hue.ev(Hue.el("#delete_messages_above"), "click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_messages_above(Hue.delete_messages_id)
  })

  Hue.ev(Hue.el("#delete_messages_below"), "click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_messages_below(Hue.delete_messages_id)
  })
}

// Delete message action
Hue.delete_message_action = function () {
  Hue.msg_delete_messages.close()
  Hue.delete_message(Hue.delete_messages_id)
}

// Handles delete message
Hue.handle_delete_messages = function (id, user_id) {
  let user = Hue.get_user_by_user_id(user_id)

  if (Hue.user_id !== user_id && !Hue.superuser) {
    if (user && Hue.is_admin(user)) {
      Hue.forbidden_user()
      return
    }
  }

  Hue.delete_messages_id = id

  let msg = Hue.get_message_by_id(id)
  let unit = msg[0]
  let index = msg[1]
  let num = Hue.get_num_message_units(unit)
  let num_messages = Hue.get_all_units().length
  let shown = 1

  Hue.el("#delete_messages_group").style.display = "none"
  Hue.el("#delete_messages_above").style.display = "none"
  Hue.el("#delete_messages_below").style.display = "none"

  if (num > 1) {
    Hue.el("#delete_messages_group").style.display = "flex"
    shown += 1
  }

  if (Hue.is_admin() && index !== 0) {
    Hue.el("#delete_messages_above").style.display = "flex"
    shown += 1
  }

  if (Hue.is_admin() && index < num_messages - 1) {
    Hue.el("#delete_messages_below").style.display = "flex"
    shown += 1
  }

  if (shown === 1) {
    Hue.delete_message(Hue.delete_messages_id)
    return
  }

  Hue.horizontal_separator(Hue.el("#delete_messages_titlebar"))
  Hue.msg_delete_messages.show()
}

// When messages above were deleted
Hue.deleted_messages_above = function (data) {
  if (!Hue.is_admin()) {
    Hue.not_allowed()
    return
  }

  let ans = Hue.get_message_by_id(data.id)

  if (!ans) {
    return
  }

  let units = Hue.get_all_units()

  for (let i=0; i<ans[1]; i++) {
    let unit = units[i]
    let mode = Hue.dataset(unit.closest(".message"), "mode")

    if (mode === "chat") {
      Hue.process_remove_chat_message(unit)
    } else if (mode == "announcement") {
      Hue.process_remove_announcement(unit)
    }
  }
}

// When messages below were deleted
Hue.deleted_messages_below = function (data) {
  if (!Hue.is_admin()) {
    Hue.not_allowed()
    return
  }

  let ans = Hue.get_message_by_id(data.id)

  if (!ans) {
    return
  }

  let units = Hue.get_all_units()

  for (let i=ans[1]+1; i<units.length; i++) {
    let unit = units[i]
    let mode = Hue.dataset(unit.closest(".message"), "mode")

    if (mode === "chat") {
      Hue.process_remove_chat_message(unit)
    } else if (mode == "announcement") {
      Hue.process_remove_announcement(unit)
    }
  }
}

// Check chat enabled
Hue.check_chat_enabled = function () {
  if (Hue.room_state.chat_enabled) {
    Hue.el("#chat_main").classList.remove("nodisplay")
  } else {
    Hue.el("#chat_main").classList.add("nodisplay")
  }
}

// Set chat enabled
Hue.set_chat_enabled = function (what) {
  Hue.room_state.chat_enabled = what
  Hue.save_room_state()
  Hue.check_chat_enabled()
  Hue.fix_frames()
  Hue.goto_bottom(true)
}

// Set default chat enabled
Hue.set_default_chat_enabled = function () {
  Hue.set_chat_enabled(Hue.config.room_state_default_chat_enabled)
}


// Increases the chat display percentage
Hue.increase_chat_percentage = function () {
  let size = Hue.room_state.chat_display_percentage
  size += 5
  size = Hue.utilz.round2(size, 5)
  Hue.do_chat_size_change(size)
}

// Decreases the chat display percentage
Hue.decrease_chat_percentage = function () {
  let size = Hue.room_state.chat_display_percentage
  size -= 5
  size = Hue.utilz.round2(size, 5)
  Hue.do_chat_size_change(size)
}

// Increase chat font size
Hue.increase_chat_font_size = function () {
  Hue.do_chat_font_size_change(Hue.room_state.chat_font_size + 0.1)
}

// Decrease chat font size
Hue.decrease_chat_font_size = function () {
  Hue.do_chat_font_size_change(Hue.room_state.chat_font_size - 0.1)
}

// Do chat font size change
Hue.do_chat_font_size_change = function (size = Hue.room_state.chat_font_size) {
  if (size === "max") {
    size = Hue.max_chat_font_size
  } else if (size === "min") {
    size = Hue.min_chat_font_size
  } else if (size === "default") {
    size = Hue.config.room_state_default_chat_font_size
  }

  size = Hue.utilz.round(size, 1)

  if (size < Hue.min_chat_font_size || size > Hue.max_chat_font_size) {
    return
  }

  Hue.room_state.chat_font_size = size
  document.documentElement.style.setProperty("--chat_font_size", `${size}em`)
  Hue.goto_bottom(true)
  Hue.save_room_state()
}

// Check if chat messages need pruning
Hue.check_max_chat_messages = function () {
  if (!Hue.started) {
    return
  }

  let messages = Hue.get_all_messages()

  if (messages.length > Hue.config.chat_crop_limit) {
    let diff = messages.length - Hue.config.chat_crop_limit

    for (let message of messages.slice(0, diff)) {
      message.remove()
    }
  }
}

// Like a message
Hue.like_message = function (target, type) {
  let unit = target.closest(".message_unit")

  if (type === "like" && Hue.dataset(unit, "likes").length >= Hue.config.max_likes) {
    return
  }

  let id = Hue.dataset(unit, "id")

  Hue.socket_emit("like_message", {
    id: id,
    type: type
  })
}

// Liked message
Hue.liked_message = function (data) {
  let ans = Hue.get_message_by_id(data.id)

  if (ans) {
    let el = ans[0]
    let likes = Hue.dataset(el, "likes")

    if (data.type === "like") {
      likes.push(data.obj)
    } else if (data.type === "unlike") {
      likes = likes.filter(x => x.user_id !== data.obj.user_id)
    }

    Hue.dataset(el, "likes", likes)
    Hue.update_likes(el, likes)

    if (Hue.msg_chat_search.is_open()) {
      let id = Hue.dataset(el, "id")

      for (let item of Hue.els("#chat_search_container .message_unit")) {
        if (id === Hue.dataset(item, "id")) {
          Hue.update_likes(item, likes)
          break
        }
      }
    }
  }
}

// Update likes container
Hue.update_likes = function (el, likes) {
  let c = Hue.el(".likes_container", el)

  if (likes.length > 0) {
    c.innerHTML = "<div class='likes_label'>^ Likes:</div><div class='likes_items'></div>"
    for (let obj of likes) {
      let pi = Hue.get_profilepic(obj.user_id)
      let el = Hue.create("div", "like_container dynamic_title")
      el.innerHTML = Hue.template_like({profilepic: pi})

      let nd = Hue.utilz.nice_date(obj.date)
      let title = `${obj.username} | ${nd}`
      el.title = title

      Hue.dataset(el, "user_id", obj.user_id)
      Hue.dataset(el, "username", obj.username)
      Hue.dataset(el, "date", obj.date)
      Hue.dataset(el, "otitle", title)

      let profilepic = Hue.el(".like_profilepic", el)
      Hue.ev(profilepic, "error", function () {
        Hue.fallback_profilepic(this)
      })

      Hue.el(".likes_items", c).append(el)
    }
    c.style.display = "flex"
  } else {
    c.style.display = "none"
  }
}

// Get number of units in a message
Hue.get_num_message_units = function (unit) {
  let message = unit.closest(".message")
  return Hue.els_or_self(".message_unit", message).length
}

// Select message unit
Hue.select_unit = function (unit) {
  unit.classList.add("selected_message")
  unit.scrollIntoView({block: "center"})
  Hue.selected_message = unit
  Hue.last_selected_message = unit
}

// Select middle message
Hue.select_middle_message = function () {
  let visible = Hue.get_visible_units()
  let unit = Hue.utilz.get_middle_item(visible)
  Hue.select_unit(unit)
}

// Remove selected classes
Hue.remove_selected_classes = function () {
  for (let unit of Hue.els(".selected_message")) {
    unit.classList.remove("selected_message")
  }
}

// Check last selected message action
Hue.check_last_selected_message = function () {
  let last_u = Hue.el_or_self(".message_unit", Hue.last_selected_message)
          
  if (Hue.dataset(last_u, "visible")) {
    Hue.select_unit(Hue.last_selected_message)
  } else {
    Hue.select_middle_message()
  } 
}

// Select next message in a direction
Hue.select_message = function (direction = "up") { 
  if (Hue.chat_scrolled) {
    if (Hue.selected_message) {
      let u = Hue.el_or_self(".message_unit", Hue.selected_message)
  
      if (!Hue.dataset(u, "visible")) {
        Hue.remove_selected_classes()
  
        if (Hue.last_selected_message) {
          Hue.check_last_selected_message()
        } else {
          Hue.select_middle_message()
        }
        
        return
      }
    } else if (Hue.last_selected_message) {
      Hue.remove_selected_classes()
      Hue.check_last_selected_message()
      return
    }
  }

  let units = Hue.get_all_units()

  if (Hue.selected_message) {
    if (direction === "up") {
      if (Hue.selected_message === units[0]) {
        return
      }
    } else if (direction === "down") {
      if (Hue.selected_message === units[units.length - 1]) {
        return
      }
    }

    let found = false
  
    if (direction === "up") {
      units.reverse()
    }
  
    for (let unit of units) {
      if (found) {
        Hue.select_unit(unit)
        return
      }
  
      if (unit.classList.contains("selected_message")) {
        unit.classList.remove("selected_message")
        found = true
      }
    }
  } else {
    if (!Hue.chat_scrolled) {
      units.reverse()
      let unit = units[0]
      Hue.select_unit(unit)
    } else {
      Hue.select_middle_message()
    }
  }
}

// Unselect message
Hue.unselect_message = function () {
  let units = Hue.els("#chat_area .selected_message")

  for (let unit of units) {
    unit.classList.remove("selected_message")
  }

  Hue.selected_message = undefined
}

// Selected message action
Hue.selected_message_action = function () {
  Hue.show_chat_context_menu(Hue.selected_message)
  Hue.unselect_message()
}

// Get all messages
Hue.get_all_messages = function () {
  return Hue.els("#chat_area > .message")
}

// Get all announcements
Hue.get_all_announcements = function () {
  return Hue.els("#chat_area > .message.announcement")
}

// Get all units
Hue.get_all_units = function () {
  return Hue.els("#chat_area .message_unit")
}

// Get visible messages
Hue.get_visible_units = function () {
  let visible = []

  for (let unit of Hue.get_all_units()) {
    if (Hue.dataset(unit, "visible")) {
      visible.push(unit)
    }
  }

  return visible
}

// Observe message
Hue.observe_message = function (unit) {
  if (unit) {
    Hue.chat_intersection_observer.observe(unit)
  }
}