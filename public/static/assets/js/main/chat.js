// This generates all user chat messages inserted into the chat
Hue.make_chat_message = function (args = {}) {
  let def_args = {
    id: false,
    user_id: false,
    username: "",
    message: "",
    date: false,
    brk: false,
    public: true,
    link_title: false,
    link_description: false,
    link_image: false,
    link_url: false,
    edited: false,
    just_edited: false,
    quote: "",
    quote_username: "",
    quote_user_id: "",
    quote_id: ""
  }

  args = Object.assign(def_args, args)

  let num_lines = args.message.split("\n").length

  if (num_lines === 1) {
    if (args.message.startsWith(Hue.config.commands_prefix + Hue.config.commands_prefix)) {
      args.message = args.message.slice(1)
    }
  }

  args.message = Hue.replace_message_vars(args.id, args.message)
  let content_classes = "chat_content reply_message edit_message"
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

  fmessage = Hue.div("message chat_message user_details")

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
    
    quote_profilepic.addEventListener("error", function () {
      Hue.fallback_profilepic(this)
    })
  } else {
    quote.style.display = "none"
  }

  let chat_username = Hue.el(".chat_username", fmessage)
  chat_username.textContent = args.username

  let htimeago = Hue.el(".chat_timeago", fmessage)
  htimeago.textContent = Hue.utilz.timeago(d)

  Hue.el(".profilepic", fmessage).addEventListener("error", function () {
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
  Hue.dataset(fmessage, "public", args.public)
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

  if (!image_preview && !link_preview) {
    Hue.urlize(content)
  }

  if (image_preview) {
    Hue.setup_image_preview(fmessage, image_preview_src_original, args.user_id)
  }

  if (link_preview) {
    Hue.setup_link_preview(fmessage)
  }

  let message_id = Hue.insert_message({
    id: args.id,
    message: fmessage,
    just_edited: args.just_edited,
  }).message_id

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

  return {
    message_id: message_id
  }
}

// This generates all announcements inserted into the chat
Hue.make_announcement_message = function (args = {}) {
  let def_args = {
    id: false,
    brk: "",
    message: "",
    highlight: false,
    title: false,
    container_id: false,
    date: false,
    type: "normal",
    username: false,
    public: false,
    user_id: false,
    parse_text: false,
    in_log: true,
    media_source: "",
    comment: ""
  }

  args = Object.assign(def_args, args)
  let is_media = args.type === "image_change" || args.type === "tv_change"
  let content_classes = "announcement_content reply_message edit_message"
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

  let  top_clasees = "chat_message_top announcement_top"

  if (!is_media) {
    top_clasees += " nodisplay"
  }

  let fmessage = Hue.div("message announcement message_unit")
  
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

  Hue.el(".profilepic", fmessage).addEventListener("error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.dataset(fmessage, "id", args.id)
  Hue.dataset(fmessage, "public", args.public)
  Hue.dataset(fmessage, "date", d)
  Hue.dataset(fmessage, "highlighted", highlighted)
  Hue.dataset(fmessage, "type", args.type)
  Hue.dataset(fmessage, "username", args.username)
  Hue.dataset(fmessage, "mode", "announcement")
  Hue.dataset(fmessage, "user_id", args.user_id)
  Hue.dataset(fmessage, "in_log", args.in_log)
  Hue.dataset(fmessage, "media_source", args.media_source)

  let message_id = Hue.insert_message({
    message: fmessage
  }).message_id

  if (highlighted) {
    Hue.on_highlight(args.username)
  }

  Hue.push_to_all_usernames(args.username)

  return {
    message_id: message_id
  }
}

// This is a centralized function to insert all chat messages or announcements into the chat
Hue.insert_message = function (args = {}) {
  let def_args = {
    id: false,
    message: false,
    just_edited: false
  }

  args = Object.assign(def_args, args)

  if (!args.message) {
    return false
  }

  let chat_area = Hue.el("#chat_area")
  let last_message = Hue.els("#chat_area > .message").slice(-1)[0]
  let appended = false
  let mode = Hue.dataset(args.message, "mode")
  let user_id = Hue.dataset(args.message, "user_id")
  let username = Hue.dataset(args.message, "username")
  let date = Hue.dataset(args.message, "date")
  let is_public = Hue.dataset(args.message, "public")
  let highlighted = Hue.dataset(args.message, "highlighted")
  let content_container, message_id

  if (mode === "chat") {
    content_container = Hue.el(".chat_content_container", args.message)
    Hue.chat_content_container_id += 1
    Hue.dataset(content_container, "chat_content_container_id", Hue.chat_content_container_id)
    content_container.classList.add(`chat_content_container_${Hue.chat_content_container_id}`)

    if (args.just_edited && args.id) {
      for (let item of Hue.els(".chat_content_container")) {
        if (Hue.dataset(item, "id") === args.id) {
          item.replaceWith(Hue.clone(content_container))
          break
        }
      }

      return false
    }
  }

  if (last_message) {
    if (
      args.message.classList.contains("chat_message") &&
      last_message.classList.contains("chat_message")
    ) {
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

  if (!appended) {
    chat_area.append(args.message)
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

  if (is_public && user_id) {
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
    message_id: message_id
  }
}

// Starts chat mouse events
Hue.start_chat_mouse_events = function () {
  document.addEventListener("click", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.tagName === "A") {
      return
    }    

    if (e.target.closest(".chat_menu_button")) {
      return
    }

    if (!e.target.closest) {
      return
    }
    
    if (e.target.closest(".chat_area")) {
      let message = e.target.closest(".message")

      if (message) {
        let id = Hue.dataset(message, "id")
        let username = Hue.dataset(message, "username")
        let user_id = Hue.dataset(message, "user_id")
        let type = Hue.dataset(message, "type")

        if (e.target.closest(".chat_menu_button")) {
          return
        } else if (e.target.classList.contains("chat_username")) {
          Hue.show_profile(username, user_id)
        } else if (e.target.classList.contains("chat_profilepic")) {
          Hue.show_profile(username, user_id)
        } else if (e.target.classList.contains("message_edit_submit")) {
          Hue.send_edit_messsage()
        } else if (e.target.classList.contains("message_edit_cancel")) {
          Hue.stop_edit_message()
        } else if (e.target.classList.contains("chat_quote_text")) {
          let quote = e.target.closest(".chat_quote")
          let id = Hue.dataset(quote, "quote_id")
          Hue.jump_to_chat_message_by_id(id)
        } else if (e.target.classList.contains("chat_quote_username") ||
          e.target.classList.contains("chat_quote_profilepic")) {
          let quote = e.target.closest(".chat_quote")
          let username = Hue.dataset(quote, "quote_username")
          let user_id = Hue.dataset(quote, "quote_user_id")
          Hue.show_profile(username, user_id)
        } else if (e.target.classList.contains("link_preview_image")) {
          e.stopPropagation()
          Hue.view_image(e.target.src, username, user_id)
        } else if (e.target.classList.contains("image_preview_image")) {
          e.stopPropagation()
          let src = Hue.dataset(e.target, "image_preview_src_original")
          Hue.view_image(src, username, user_id)
        } else if (e.target.classList.contains("announcement_content") ||
          e.target.closest(".brk")) {
          if (type === "image_change") {
            Hue.show_modal_image(id)
          } else if (type === "tv_change") {
            Hue.open_url_menu_by_media_id("tv", id)
          }
        } else if (e.target.closest(".brk_profilepic")) {
          Hue.show_profile(username, user_id)
        }
      }
    }

    if (e.target.classList.contains("whisper_link")) {
      let container = e.target.closest(".user_details")
      let username = Hue.dataset(container, "username")
      Hue.process_write_whisper(`${username} > ${e.target.dataset.whisper}`)
    }
  })

  document.addEventListener("mouseup", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.tagName === "A") {
      return
    }

    if (!e.target.closest) {
      return
    }
    
    if (e.target.closest(".chat_area")) {
      if (e.target.closest(".chat_content_container")) {
        if (e.button === 1) {
          let container = e.target.closest(".chat_content_container")
          if (Hue.start_reply(Hue.el(".chat_content", container))) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      } else if (e.target.closest(".announcement_content_container")) {
        if (e.button === 1) {
          let container = e.target.closest(".announcement_content_container")
          if (Hue.start_reply(Hue.el(".announcement_content", container))) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }
    }
  })
}

// Setup reply
Hue.setup_reply = function () {
  Hue.el("#reply_submit").addEventListener("click", function () {
    Hue.submit_reply()
  })

  Hue.el("#reply_input").addEventListener("input", function () {
    if (Hue.old_reply_input_val !== this.value) {
      Hue.check_typing("reply")
      Hue.old_reply_input_val = this.value
    }
  })

  Hue.el("#reply_profilepic").addEventListener("click", function () {
    Hue.show_profile(Hue.quote_username, Hue.quote_user_id)
  })
  
  Hue.el("#reply_profilepic").addEventListener("error", function (e) {
    Hue.fallback_profilepic(this)
  })
  
  Hue.el("#reply_username").addEventListener("click", function () {
    Hue.show_profile(Hue.quote_username, Hue.quote_user_id)
  })
}

// Prepare data to show the reply window
Hue.start_reply = function (target) {
  if (target.tagName === "A") {
    return false
  }

  let message = target.closest(".message")
  let unit = target.closest(".message_unit")
  let text = Hue.remove_urls(Hue.utilz.single_space(target.textContent))
  let username = Hue.dataset(message, "username")
  let user_id = Hue.dataset(message, "user_id")
  let id = Hue.dataset(unit, "id")

  if (!text || !username) {
    return false
  }

  Hue.show_reply(id, username, user_id, text)
  return true
}

// Show the reply window
Hue.show_reply = function (id, username, user_id, text) {
  Hue.el("#reply_text").value = text
  let input = Hue.get_input().trim()

  if (input) {
    Hue.clear_input()
    Hue.el("#reply_input").value = input
  }

  Hue.old_reply_input_val = ""

  Hue.el("#reply_profilepic").src = Hue.get_profilepic(user_id)
  Hue.el("#reply_username").textContent = `${username} said:`

  Hue.msg_reply.show(function () {
    Hue.el("#reply_input").focus()
  })

  Hue.quote_id = id
  Hue.quote_username = username
  Hue.quote_user_id = user_id
}

// Submit the reply window
Hue.submit_reply = function () {
  let reply = Hue.el("#reply_input").value.trim()

  if (!reply) {
    return
  }

  if (Hue.is_command(reply)) {
    reply = `/${reply}`
  }

  Hue.msg_reply.close()
  let otext = Hue.utilz.single_space(Hue.el("#reply_text").value)
  let quote = otext.substring(0, Hue.config.quote_max_length).trim()

  if (otext.length > quote.length) {
    quote += "..."
  }

  Hue.process_input({
    message: reply,
    quote: quote,
    quote_username: Hue.quote_username,
    quote_user_id: Hue.quote_user_id,
    quote_id: Hue.quote_id
  })

  Hue.el("#reply_input").value = ""
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
    return false
  }

  for (let container of Hue.fresh_messages_list) {
    container.classList.add("fresh_message")

    setTimeout(function () {
      container.classList.remove("fresh_message")
    }, Hue.fresh_messages_duration)
  }

  Hue.fresh_messages_list = []
}

// Focuses the message edit textbox
Hue.focus_edit_area = function () {
  if (Hue.editing_message_area !== document.activeElement) {
    Hue.editing_message_area.focus()
  }
}

// Handles direction on Up and Down keys
// Determines whether a message has to be edited
Hue.handle_edit_direction = function (reverse = false) {
  let area = Hue.editing_message_area

  if (
    (reverse && area.selectionStart === area.value.length) ||
    (!reverse && area.selectionStart === 0)
  ) {
    Hue.edit_last_message(reverse)
    return true
  }

  return false
}

// Edits the next latest chat message
// Either in normal or reverse order
Hue.edit_last_message = function (reverse = false) {
  let edit_found = true
  let last_container = false

  if (Hue.editing_message) {
    edit_found = false
  }

  let messages = Hue.els("#chat_area > .message")

  for (let message of messages.reverse()) {
    if (Hue.dataset(message, "user_id") === Hue.user_id) {
      let items = Hue.els(".edit_message_container", message)

      for (let item of items.reverse()) {
        if (Hue.editing_message) {
          if (item === Hue.editing_message_container) {
            edit_found = true
            continue
          }
        }
  
        let cnt = item
  
        if (!edit_found) {
          last_container = item
          continue
        } else {
          if (reverse) {
            cnt = last_container
          }
        }
  
        if (!cnt) {
          Hue.stop_edit_message()
        } else {
          Hue.edit_message(cnt)
        }

        return
      }
    }
  }
}

// Starts chat message editing
Hue.edit_message = function (container) {
  if (Hue.editing_message) {
    Hue.stop_edit_message()
  }

  let edit_container = Hue.el(".message_edit_container", container)
  let area = Hue.el(".message_edit_area", container)
  let edit_message = Hue.el(".edit_message", container)
  let edit_message_container = container.closest(".edit_message_container")

  edit_container.style.display = "block"
  edit_message_container.classList.add("editing_chat_message")
  edit_message.style.display = "none"
  container.classList.remove("chat_menu_button_main")
  container.style.display = "block"

  Hue.editing_message = true
  Hue.editing_message_container = container
  Hue.editing_message_area = area
  Hue.editing_original_message = Hue.dataset(container, "original_message")

  area.value = Hue.editing_original_message
  area.focus()

  setTimeout(function () {
    area.setSelectionRange(area.value.length, area.value.length)
  }, 40)

  area.scrollIntoView({
    block: "center"
  })
}

// Stops chat message editing
Hue.stop_edit_message = function () {
  if (!Hue.editing_message || !Hue.editing_message_container) {
    return false
  }

  let edit_container = Hue.el(".message_edit_container", Hue.editing_message_container)
  let edit_message = Hue.el(".edit_message", Hue.editing_message_container)
  let edit_message_container = Hue.editing_message_container.closest(".edit_message_container")

  edit_container.style.display = "none"
  edit_message_container.classList.remove("editing_chat_message")
  Hue.editing_message_area.value = ""
  edit_message.style.display = "block"
  Hue.editing_message_container.classList.add("chat_menu_button_main")
  Hue.editing_message_container.style.display = "block"
  Hue.editing_message = false
  Hue.editing_message_container = false
  Hue.editing_message_area = Hue.div()
}

// Submits a chat message edit
Hue.send_edit_messsage = function (id) {
  if (!Hue.editing_message_container) {
    return false
  }

  let message = Hue.editing_message_container.closest(".message")
  let edit_mode = Hue.dataset(message, "mode")
  let edit_message = Hue.el(".edit_message", Hue.editing_message_container)
  let new_message = Hue.editing_message_area.value
  let edit_id = Hue.dataset(Hue.editing_message_container, "id") || Hue.dataset(message, "id")
  new_message = Hue.utilz.remove_multiple_empty_lines(new_message)
  new_message = Hue.utilz.untab_string(new_message).trimEnd()
  Hue.stop_edit_message()

  if (edit_message.textContent === new_message) {
    return false
  }

  if (edit_mode === "chat") {
    if (!edit_id) {
      return false
    }
  
    if (new_message.length === 0) {
      Hue.delete_message(edit_id)
      return false
    }

    Hue.process_input({
      message: new_message,
      edit_id: edit_id,
      to_history: false
    })
  } else if (edit_mode === "announcement") {
    let media_type = Hue.dataset(message, "type").split("_")[0]
    Hue.do_edit_media_comment(media_type, edit_id, new_message)
  }

  Hue.replace_in_input_history(Hue.editing_original_message, new_message)
}

// Deletes a message
Hue.delete_message = function (id) {
  if (!id) {
    return false
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
    return false
  }

  Hue.show_confirm("Delete message group", function () {
    let message = Hue.get_message_by_id(id)[0].closest(".message")
  
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
    return false
  }

  Hue.show_confirm("Delete all messages above this message", function () {
    Hue.socket_emit("delete_messages_above", {
      id: id
    })
  })
}

// Deletes messages above
Hue.delete_messages_below = function (id) {
  if (!id) {
    return false
  }

  Hue.show_confirm("Delete all messages below this message", function () {
    Hue.socket_emit("delete_messages_below", {
      id: id
    })
  })
}

// Get message by id
Hue.get_message_by_id = function (id) {
  if (!id) {
    return false
  }

  let units = Hue.els("#chat_area .message_unit")

  for (let i=0; i<units.length; i++) {
    let uid = Hue.dataset(units[i], "id")

    if (uid && uid === id) {
      return [units[i], i, id]
    }
  }

  return false
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

// Checks if the user is typing a chat message to send a typing emit
// If the message appears to be a command it is ignored
Hue.check_typing = function (mode = "input") {
  let tval

  if (mode === "input") {
    let val = Hue.get_input()

    if (val.length < Hue.old_input_val.length) {
      return false
    }

    tval = val.trim()
  } else if (mode === "reply") {
    let val = Hue.el("#reply_input").value

    if (val.length < Hue.old_reply_input_val.length) {
      return false
    }

    tval = val.trim()
  }

  if (tval !== "") {
    if (tval[0] === Hue.config.commands_prefix && tval[1] !== Hue.config.commands_prefix) {
      return false
    }

    if ((Date.now() - Hue.last_typing_emit) >= Hue.config.typing_delay) {
      Hue.socket_emit("typing", {})
      Hue.last_typing_emit = Date.now()
    }
  }
}

// When a typing signal is received
// And animates profile images
Hue.show_typing = function (data) {
  let user = Hue.get_user_by_user_id(data.user_id)

  if (!user) {
    return false
  }

  Hue.typing_remove_timer()
  Hue.show_aura(user.user_id)
  Hue.typing = true
}

// Stops the typing actions
Hue.hide_typing = function () {
  if (!Hue.typing) {
    return
  }

  Hue.typing = false
}

// Gets the most recent message by user_id
Hue.get_last_message_by_user_id = function (ouser_id) {
  let items = Hue.els("#chat_area > .message")

  for (let item of items.reverse()) {
    let user_id = Hue.dataset(item, "user_id")
  
    if (user_id) {
      if (user_id === ouser_id) {
        return item
      }
    }
  }

  return false
}

// Gives or maintains aura classes
// Starts timeout to remove them
Hue.show_aura = function (id) {
  if (!Hue.has_focus) {
    return false
  }

  if (Hue.aura_timeouts[id] === undefined) {
    Hue.add_aura(id)
  } else {
    clearTimeout(Hue.aura_timeouts[id])
  }

  Hue.aura_timeouts[id] = setTimeout(function () {
    Hue.remove_aura(id)
  }, Hue.config.max_typing_inactivity)
}

// Adds the aura class to the profile image of the latest chat message of a user
// This class makes the profile image glow and rotate
Hue.add_aura = function (id) {
  let message = Hue.get_last_message_by_user_id(id)

  if (message) {
    Hue.el(".chat_image", message).classList.add("aura")
  }

  let activity_bar_item = Hue.get_activity_bar_item_by_user_id(id)

  if (activity_bar_item) {
    Hue.el(".activity_bar_profilepic", activity_bar_item).classList.add("aura")
  }
}

// Removes the aura class from messages from a user
Hue.remove_aura = function (id) {
  clearTimeout(Hue.aura_timeouts[id])
  
  Hue.els(".chat_image.aura").forEach(it => {
    let message = it.closest(".message")

    if (message) {
      if (Hue.dataset(message, "user_id") === id) {
        it.classList.remove("aura")
      }
    }
  })

  Hue.els(".activity_bar_profilepic.aura").forEach(it => {
    let activity_bar_item = it.closest(".activity_bar_item")

    if (activity_bar_item) {
      if (Hue.dataset(activity_bar_item, "user_id") === id) {
        it.classList.remove("aura")
      }
    }
  })

  Hue.aura_timeouts[id] = undefined
}

// Jumps to a chat message in the chat area
// This is used when clicking the Jump button in
// windows showing chat message clones
Hue.jump_to_chat_message = function (message_id, highlight = true) {
  if (!message_id) {
    return
  }

  let el = Hue.el(`#chat_area > .message_id_${message_id}`)

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

  Hue.close_all_modals()
}

// Jumps to the message by id (not message_id)
Hue.jump_to_chat_message_by_id = function (id) {
  let ans = Hue.get_message_by_id(id)

  if (ans) {
    let message = ans[0].closest(".message")
    let message_id = Hue.dataset(message, "message_id")
    Hue.jump_to_chat_message(message_id)
  } else {
    Hue.show_info("Message no longer in chat")
  }
}

// What to do after receiving a chat message from the server
Hue.on_chat_message = function (data) {
  Hue.make_chat_message({
    id: data.id,
    user_id: data.user_id,
    username: data.username,
    message: data.message,
    date: data.date,
    link_title: data.link_title,
    link_description: data.link_description,
    link_image: data.link_image,
    link_url: data.link_url,
    edited: data.edited,
    just_edited: data.just_edited,
    quote: data.quote,
    quote_username: data.quote_username,
    quote_user_id: data.quote_user_id,
    quote_id: data.quote_id
  })

  Hue.hide_typing()
  Hue.remove_aura(data.user_id)
}

// Find the next chat message above that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_above = function () {
  let messages = Hue.els("#chat_area > .message")

  for (let message of messages.reverse()) {
    let same_username = false
    let username = Hue.dataset(message, "username")

    if (username && username === Hue.username) {
      same_username = true
    }

    if (same_username || Hue.dataset(message, "highlighted")) {
      let rect = message.getBoundingClientRect()

      if (rect.top <= 0) {
        Hue.jump_to_chat_message(Hue.dataset(message, "message_id"), false)
        return
      }
    }
  }

  Hue.goto_top()
}

// Find the next chat message below that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_below = function () {
  let messages = Hue.els("#chat_area > .message")

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
          Hue.jump_to_chat_message(Hue.dataset(message, "message_id"), false)
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

// Scrolls the chat down
Hue.scroll_down = function () {
  Hue.el("#chat_area_parent").scrollTop += Hue.chat_scroll_amount
}

// Scrolls the chat up (more)
Hue.scroll_up_2 = function () {
  Hue.el("#chat_area_parent").scrollTop -= Hue.chat_scroll_amount_2
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
    return false
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
    link_preview_image.addEventListener("error", function () {
      link_preview_image.style.display = "none"
      link_preview_el.classList.remove("link_preview_with_image")
    })
  }

  Hue.urlize(Hue.el(".link_preview_text", link_preview_el.parentElement))
}

// Makes image preview elements
Hue.make_image_preview = function (message) {
  let ans = {}

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

  image_preview_image.addEventListener("error", function () {
    image_preview_image.style.display = "none"
  })

  Hue.urlize(Hue.el(".image_preview_text", image_preview_el.parentElement))
  Hue.dataset(image_preview_image, "image_preview_src_original", image_preview_src_original)
}

// Starts chat area scroll events
Hue.scroll_events = function () {
  Hue.el("#chat_area_parent").addEventListener("scroll", function (e) {
    Hue.scroll_timer()
    Hue.update_scroll_percentage()
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
      Object.assign(Hue.get_media_object_from_init_data("image"), {
        in_log: false,
      })
    )
  }

  if (num_tv === 0) {
    Hue.setup_media_object(
      "tv",
      "show",
      Object.assign(Hue.get_media_object_from_init_data("tv"), {
        in_log: false,
      })
    )
  }

  if (log_messages && log_messages.length > 0) {
    for (let message of log_messages) {
      let id = message.id
      let type = message.type
      let data = message.data
      let date = message.date

      if (data) {
        if (type === "chat") {
          Hue.make_chat_message({
            id: id,
            user_id: data.user_id,
            username: data.username,
            message: data.content,
            link_title: data.link_title,
            link_description: data.link_description,
            link_image: data.link_image,
            link_url: data.link_url,
            date: date,
            scroll: false,
            edited: data.edited,
            quote: data.quote,
            quote_username: data.quote_username,
            quote_user_id: data.quote_user_id,
            quote_id: data.quote_id
          })
        } else if (type === "image") {
          data.id = id
          data.date = date
          Hue.setup_media_object("image", "show", data)
        } else if (type === "tv") {
          data.id = id
          data.date = date
          Hue.setup_media_object("tv", "show", data)
        }
      }
    }
  }
}

// Sends a simple shrug chat message
Hue.shrug = function () {
  Hue.process_input({
    message: "¯\\_(ツ)_/¯",
    to_history: false,
  })
}

// Centralized function to show local feedback messages
Hue.feedback = function (message, data = false) {
  let obj = {
    brk: Hue.get_chat_icon("info"),
    message: message,
    public: false,
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
    message: message,
    public: true,
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
  Hue.el("#top_scroller").addEventListener("click", function () {
    Hue.goto_top()
  })

  Hue.el("#activity_up_scroller").addEventListener("click", function () {
    Hue.activity_above()
  })

  Hue.el("#bottom_scroller").addEventListener("click", function () {
    Hue.stop_edit_message()
    Hue.goto_bottom(true)
  })

  Hue.el("#activity_down_scroller").addEventListener("click", function () {
    Hue.activity_below()
  })

  Hue.el("#top_percentage_scroller").addEventListener("click", function () {
    Hue.scroll_up_2()
  })

  Hue.el("#bottom_percentage_scroller").addEventListener("click", function () {
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
    return false
  }
  if (!Hue.get_setting("show_activity_notifications")) {
    return false
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

  let spacer = Hue.div("message clear_spacer")
  Hue.el("#chat_area").append(spacer)
  Hue.goto_bottom(true)
}

// Deletes all chat messages
Hue.clear_log = function () {
  if (!Hue.is_admin()) {
    Hue.not_allowed()
    return false
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
  Hue.el("#delete_messages_one").addEventListener("click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_message(Hue.delete_messages_id)
  })

  Hue.el("#delete_messages_group").addEventListener("click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_message_group(Hue.delete_messages_id)
  })

  Hue.el("#delete_messages_above").addEventListener("click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_messages_above(Hue.delete_messages_id)
  })

  Hue.el("#delete_messages_below").addEventListener("click", function () {
    Hue.msg_delete_messages.close()
    Hue.delete_messages_below(Hue.delete_messages_id)
  })
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

  if (Hue.is_admin()) {
    Hue.el("#delete_messages_above").style.display = "flex"
    Hue.el("#delete_messages_below").style.display = "flex"
  } else if (Hue.is_admin_or_op() || user_id === Hue.user_id) {
    Hue.el("#delete_messages_above").style.display = "none"
    Hue.el("#delete_messages_below").style.display = "none"
  } else {
    return
  }

  Hue.horizontal_separator(Hue.el("#delete_messages_container"))
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

  let units = Hue.els("#chat_area .message_unit")

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

  let units = Hue.els("#chat_area .message_unit")

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
  document.documentElement.style.setProperty('--chat_font_size', `${size}em`)
  Hue.goto_bottom(true)
  Hue.save_room_state()
}

// Check if chat messages need pruning
Hue.check_max_chat_messages = function () {
  let messages = Hue.els("#chat_area > .message")

  if (messages.length > Hue.config.chat_crop_limit) {
    let diff = messages.length - Hue.config.chat_crop_limit

    for (let message of messages.slice(0, diff)) {
      message.remove()
    }
  }
}