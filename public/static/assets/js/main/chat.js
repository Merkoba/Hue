// This generates all user chat messages inserted into the chat
Hue.add_chat_message = function (args = {}) {
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
    just_edited: false
  }

  args = Object.assign(def_args, args)

  let num_lines = args.message.split("\n").length

  if (num_lines === 1) {
    if (args.message.startsWith(Hue.config.commands_prefix + Hue.config.commands_prefix)) {
      args.message = args.message.slice(1)
    }
  }

  args.message = Hue.replace_message_vars(args.id, args.message)

  let container_classes = "chat_content_container chat_menu_button_main reply_message_container"
  let content_classes = "chat_content dynamic_title reply_message"
  let d = args.date ? args.date : Date.now()
  let nd = Hue.utilz.nice_date(d)
  let pi = Hue.get_profilepic(args.user_id)
  let image_preview = false
  let image_preview_src_original = false
  let image_preview_text = false

  if (Hue.get_setting("show_image_previews")) {
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

  if (/^\w+ said\:/.test(args.message)) {
    content_classes += " quote"
  }

  let fmessage
  let title = ""

  if (args.edited) {
    title += "Edited | "
  }

  title = title + nd

  if (args.id) {
    title = `${args.id.slice(-3)} | ${title}`
  }

  let profilepic_classes = "chat_profilepic_container round_image_container action4 profilepic"

  if (!Hue.user_is_online_by_user_id(args.user_id)) {
    profilepic_classes += " profilepic_offline"
  }

  let s = `
    <div class='chat_left_side'>
        <div class='${profilepic_classes}'>
            <img class='chat_profilepic profilepic' src='${pi}' loading='lazy'>
        </div>
    </div>
    <div class='chat_right_side'>
        <div class='chat_message_top'>
            <div class='chat_uname action'></div>
            <div class='chat_timeago'></div>
        </div>
        <div class='chat_container'>
            <div class='${container_classes}'>

                <div class='chat_menu_button_container'>
                    <svg class='other_icon chat_menu_button chat_menu_button_menu'>
                      <use href='#icon_ellipsis'>
                    </svg>
                </div>

                <div class='${content_classes}' title='${title}' data-otitle='${title}' data-date='${d}'></div>

                <div class='message_edit_container'>
                    <textarea class='message_edit_area'></textarea>
                    <div class='message_edit_buttons'>
                        <div class='message_edit_button action message_edit_cancel'>Cancel</div>
                        <div class='message_edit_button action message_edit_submit'>Submit</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`

  fmessage = document.createElement("div")
  fmessage.classList.add("message")
  fmessage.classList.add("chat_message")
  fmessage.innerHTML = s

  if (image_preview) {
    fmessage.querySelector(".chat_content").innerHTML = image_preview

    if (preview_text_class) {
      fmessage.querySelector(".image_preview_text").classList.add(preview_text_class)
    }
  } else if (link_preview) {
    fmessage.querySelector(".chat_content").innerHTML = link_preview

    if (preview_text_class) {
      fmessage.querySelector(".link_preview_text").classList.add(preview_text_class)
    }
  } else {
    fmessage.querySelector(".chat_content").innerHTML = Hue.parse_text(Hue.utilz.make_html_safe(args.message))
  }

  let huname = fmessage.querySelector(".chat_uname")
  huname.textContent = args.username

  let htimeago = fmessage.querySelector(".chat_timeago")
  htimeago.textContent = Hue.utilz.timeago(d)

  fmessage.querySelector(".chat_profilepic").addEventListener("error", function () {
    if (this.src !== Hue.config.default_profilepic_url) {
      this.src = Hue.config.default_profilepic_url
    }
  })

  let first_url = false

  if (image_preview) {
    first_url = image_preview_src_original
  } else if (link_preview) {
    first_url = args.link_url
  } else {
    first_url = Hue.utilz.get_first_url(args.message)
  }

  Hue.dataset(fmessage, "user_id", args.user_id)
  Hue.dataset(fmessage, "public", args.public)
  Hue.dataset(fmessage, "date", d)
  Hue.dataset(fmessage, "highlighted", highlighted)
  Hue.dataset(fmessage, "uname", args.username)
  Hue.dataset(fmessage, "mode", "chat")

  let chat_content_container = fmessage.querySelector(".chat_content_container")
  Hue.dataset(chat_content_container, "id", args.id)
  Hue.dataset(chat_content_container, "edited", args.edited)
  Hue.dataset(chat_content_container, "highlighted", highlighted)
  Hue.dataset(chat_content_container, "date", d)
  Hue.dataset(chat_content_container, "first_url", first_url)
  Hue.dataset(chat_content_container, "original_message", args.message)

  let chat_content = fmessage.querySelector(".chat_content")
  Hue.dataset(chat_content, "date", d)

  if (!image_preview && !link_preview) {
    Hue.urlize(chat_content)
  }

  if (image_preview) {
    Hue.setup_image_preview(fmessage, image_preview_src_original, args.user_id)
  }

  if (link_preview) {
    Hue.setup_link_preview(fmessage)
  }

  Hue.setup_whispers_click(fmessage, args.username)

  let message_id = Hue.add_to_chat({
    id: args.id,
    message: fmessage,
    just_edited: args.just_edited,
  }).message_id

  if (!args.edited) {
    if (args.username !== Hue.username) {
      if (highlighted) {
        Hue.on_highlight()
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
Hue.add_chat_announcement = function (args = {}) {
  let def_args = {
    id: false,
    brk: "",
    message: "",
    highlight: false,
    title: false,
    container_id: false,
    date: false,
    type: "normal",
    info1: "",
    info2: "",
    username: false,
    public: false,
    user_id: false,
    parse_text: false,
    in_log: true,
    media_source: ""
  }

  args = Object.assign(def_args, args)
  let is_media = args.type === "image_change" || args.type === "tv_change"
  let container_classes = "announcement_content_container chat_menu_button_main reply_message_container"
  let split_classes = "announcement_content_split dynamic_title"
  let content_classes = "announcement_content reply_message"
  let brk_classes = "brk announcement_brk"

  let container_id = " "

  if (args.container_id) {
    container_id = ` id='${args.container_id}' `
  }

  let highlighted = false

  if (args.highlight) {
    content_classes += " highlighted_message"
    highlighted = true
  }

  let d = args.date ? args.date : Date.now()
  let t = args.title ? args.title : Hue.utilz.nice_date(d)

  if (is_media) {
    content_classes += " action"
  }

  if (args.username) {
    brk_classes += " action"
  }

  let announcement_top = ""

  if (is_media) {
    announcement_top = `
    <div class='chat_message_top announcement_top'>
      <div class='chat_uname action'></div>
      <div class='chat_timeago'></div>
    </div>`
  }

  let s = `
    <div class='${brk_classes}'>${args.brk}</div>
    <div class='${container_classes}'>
        <div class='chat_menu_button_container'>
            <svg class='other_icon chat_menu_button chat_menu_button_menu'>
              <use href='#icon_ellipsis'>
            </svg>
        </div>
        <div class='${split_classes}'>
            ${announcement_top}
            <div class='${content_classes}'></div>
        </div>
    </div>`

  let fmessage = document.createElement("div")
  fmessage.innerHTML = s
  fmessage.id = container_id
  fmessage.classList.add("message")
  fmessage.classList.add("announcement")
  
  if (is_media) {
    fmessage.classList.add("media_announcement")
  }

  let content = fmessage.querySelector(".announcement_content")
  let split = fmessage.querySelector(".announcement_content_split")
  let brk = fmessage.querySelector(".brk")

  if (is_media) {
    let username = fmessage.querySelector(".chat_uname")
    let date = fmessage.querySelector(".chat_timeago")
    username.textContent = args.username
    date.textContent = Hue.utilz.timeago(args.date)
  }

  split.title = t
  Hue.dataset(split, "otitle", t)
  Hue.dataset(split, "date", d)

  content.textContent = args.message
  Hue.urlize(content)

  Hue.dataset(fmessage, "id", args.id)
  Hue.dataset(fmessage, "public", args.public)
  Hue.dataset(fmessage, "date", d)
  Hue.dataset(fmessage, "highlighted", highlighted)
  Hue.dataset(fmessage, "type", args.type)
  Hue.dataset(fmessage, "info1", args.info1)
  Hue.dataset(fmessage, "info2", args.info2)
  Hue.dataset(fmessage, "uname", args.username)
  Hue.dataset(fmessage, "mode", "announcement")
  Hue.dataset(fmessage, "user_id", args.user_id)
  Hue.dataset(fmessage, "in_log", args.in_log)
  Hue.dataset(fmessage, "media_source", args.media_source)

  let message_id = Hue.add_to_chat({
    message: fmessage
  }).message_id

  if (highlighted) {
    Hue.on_highlight()
  }

  Hue.push_to_all_usernames(args.username)

  return {
    message_id: message_id
  }
}

// This is a centralized function to insert all messages or announcements into the chat
Hue.add_to_chat = function (args = {}) {
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
  let date = Hue.dataset(args.message, "date")
  let is_public = Hue.dataset(args.message, "public")
  let highlighted = Hue.dataset(args.message, "highlighted")
  let content_container, message_id

  if (mode === "chat") {
    content_container = args.message.querySelector(".chat_content_container")
    Hue.chat_content_container_id += 1
    Hue.dataset(content_container, "chat_content_container_id", Hue.chat_content_container_id)
    content_container.classList.add(`chat_content_container_${Hue.chat_content_container_id}`)

    if (args.just_edited && args.id) {
      Hue.els(".chat_content_container").forEach(it => {
        if (Hue.dataset(it, "id") === args.id) {
          it.replaceWith(Hue.clone(content_container))
          Hue.goto_bottom()
          return false
        }
      })

      return false
    }
  }

  if (last_message) {
    if (
      args.message.classList.contains("chat_message") &&
      last_message.classList.contains("chat_message")
    ) {
      if (
        args.message.querySelector(".chat_uname").textContent ===
        last_message.querySelector(".chat_uname").textContent
      ) {
        if (
          last_message.querySelectorAll(".chat_content").length <
          Hue.config.max_same_post_messages
        ) {
          let c1 = Array.from(args.message.querySelectorAll(".chat_content")).slice(-1)[0]
          let c2 = Array.from(last_message.querySelectorAll(".chat_content")).slice(-1)[0]
          let date_diff = Hue.dataset(c1, "date") - Hue.dataset(c2, "date")
          
          if (date_diff < Hue.config.max_same_post_diff) {
            Hue.dataset(content_container, "date", date)
            Hue.dataset(content_container, "highlighted", highlighted)
  
            last_message.querySelector(".chat_container").append(content_container)
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
    let messages = Hue.els("#chat_area > .message")

    if (messages.length > Hue.chat_crop_limit) {
      let diff = messages.length - Hue.chat_crop_limit
      for (let message of messages.slice(diff)) {
        message.remove()
      }
    }

    Hue.message_id += 1
    message_id = Hue.message_id
    Hue.dataset(args.message, "message_id", message_id)
    args.message.classList.add(`message_id_${message_id}`)
  }

  if (Hue.started) {
    Hue.goto_bottom()

    if (Hue.chat_scrolled) {
      Hue.check_scrollers()
    }

    if (highlighted) {
      if (Hue.room_state.last_highlight_date < date) {
        Hue.room_state.last_highlight_date = date
        Hue.save_room_state()
      }
    } else if (user_id) {
      if (user_id !== Hue.user_id) {
        if (Hue.last_chat_user_id === Hue.user_id) {
          Hue.activity_notification()
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

  if (Hue.started && !Hue.app_focused) {
    if (content_container) {
      Hue.add_fresh_message(content_container)
    } else {
      let container = args.message.querySelector(".announcement_content_container")
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
    if (e.target.closest(".chat_area")) {
      if (e.target.classList.contains("chat_uname")) {
        let m = e.target.closest(".message")
        Hue.show_profile(
          Hue.dataset(m, "uname"),
          Hue.dataset(m, "user_id")
        )
      }

      if (e.target.classList.contains("chat_profilepic")) {
        let m = e.target.closest(".message")
        Hue.show_profile(
          Hue.dataset(m, "uname"),
          Hue.dataset(m, "user_id")
        )
      }

      if (e.target.classList.contains("message_edit_submit")) {
        Hue.send_edit_messsage()
      }

      if (e.target.classList.contains("message_edit_cancel")) {
        Hue.stop_edit_message()
      }
      
      if (e.target.classList.contains("chat_reply_username")) {
        Hue.show_profile(e.target.textContent)
      }

      let media = e.target.closest(".media_announcement")

      if (media) {
        let id = Hue.dataset(media, "id")
        let type = Hue.dataset(media, "type")
        if (type === "image_change") {
          Hue.show_modal_image(id)
        } else if (type === "tv_change") {
          Hue.open_url_menu_by_media_id("tv", id)
        }
      }
    }
  })

  document.addEventListener("mouseup", function (e) {
    if (e.target.closest(".chat_area")) {
      if (e.target.classList.contains("chat_content")) {
        if (e.button === 1) {
          if (Hue.start_reply(e.target)) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
      }

      if (e.target.classList.contains("announcement_content")) {
        if (e.button === 1) {
          if (Hue.start_reply(e.target)) {
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
}

// Prepare data to show the reply window
Hue.start_reply = function (target) {
  if (target.tagName === "A") {
    return false
  }

  let message = target.closest(".message")
  let text = Hue.remove_urls(Hue.utilz.clean_string2(target.textContent))
  let uname = Hue.dataset(message, "uname")

  if (!text || !uname) {
    return false
  }

  Hue.show_reply(uname, text)
  return true
}

// Show the reply window
Hue.show_reply = function (username, text) {
  Hue.el("#reply_text").value = text
  let input = Hue.get_input().trim()

  if (input) {
    Hue.clear_input()
    Hue.el("#reply_input").value = input
  }

  Hue.old_reply_input_val = ""
  Hue.msg_reply.set_title(`Re: ${username}`)

  Hue.msg_reply.show(function () {
    Hue.el("#reply_input").focus()
  })

  Hue.reply_username = username
}

// Submit the reply window
Hue.submit_reply = function () {
  let reply = Hue.el("#reply_input").value.trim()

  if (Hue.is_command(reply)) {
    reply = `/${reply}`
  }

  Hue.msg_reply.close()
  Hue.goto_bottom(true)

  let otext = Hue.utilz.clean_string2(Hue.el("#reply_text").value)
  let text = otext.substring(0, Hue.config.quote_max_length).trim()

  if (otext.length > text.length) {
    text += "..."
  }

  Hue.process_message({
    message: `${Hue.reply_username} said: ${text}`,
    to_history: false
  })

  if (reply) {
    Hue.process_message({
      message: reply
    })
  }

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
      let items = Array.from(message.querySelectorAll(".chat_content_container"))

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

  let edit_container = container.querySelector(".message_edit_container")
  let area = container.querySelector(".message_edit_area")
  let chat_content = container.querySelector(".chat_content")

  edit_container.style.display = "block"
  chat_content.style.display = "none"
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

  Hue.check_scrollers()
}

// Stops chat message editing
Hue.stop_edit_message = function () {
  if (!Hue.editing_message || !Hue.editing_message_container) {
    return false
  }

  let edit_container = Hue.editing_message_container.querySelector(".message_edit_container")
  let chat_content = Hue.editing_message_container.querySelector(".chat_content")

  edit_container.style.display = "none"
  Hue.editing_message_area.value = ""
  chat_content.style.display = "inline-block"
  Hue.editing_message_container.classList.add("chat_menu_button_main")
  Hue.editing_message_container.style.display = "flex"
  Hue.editing_message = false
  Hue.editing_message_container = false
  Hue.editing_message_area = document.createElement("div")
}

// Submits a chat message edit
Hue.send_edit_messsage = function (id) {
  if (!Hue.editing_message_container) {
    return false
  }

  let chat_content = Hue.editing_message_container.querySelector(".chat_content")
  let new_message = Hue.editing_message_area.value
  new_message = Hue.utilz.remove_multiple_empty_lines(new_message)
  new_message = Hue.utilz.untab_string(new_message).trimEnd()
  let edit_id = Hue.dataset(Hue.editing_message_container, "id")
  Hue.stop_edit_message()

  if (chat_content.textContent === new_message) {
    return false
  }

  if (!edit_id) {
    return false
  }

  if (new_message.length === 0) {
    Hue.delete_message(edit_id)
    return false
  }

  Hue.process_message({
    message: new_message,
    edit_id: edit_id,
    to_history: false
  })

  Hue.replace_in_input_history(Hue.editing_original_message, new_message)
}

// Deletes a message
Hue.delete_message = function (id, force = false) {
  if (!id) {
    return false
  }

  if (force) {
    Hue.send_delete_message(id)
  } else {
    if (!Hue.started_safe) {
      return false
    }

    Hue.show_confirm("Delete Message", "", function () {
      Hue.send_delete_message(id)
    })
  }
}

// Makes the delete message emit
Hue.send_delete_message = function (id) {
  Hue.socket_emit("delete_message", {
    id: id
  })
}

// Remove a message from the chat
Hue.remove_message_from_chat = function (data) {
  if (data.type === "chat") {
    Hue.els(".chat_content_container").forEach(it => {
      if (Hue.dataset(it, "id") == data.id) {
        Hue.process_remove_chat_message(it)
        return false
      }
    })
  } else if (
    data.type === "announcement" ||
    data.type === "image" ||
    data.type === "tv"
  ) {
    Hue.els(".message.announcement").forEach(it => {
      if (Hue.dataset(it, "id") == data.id) {
        Hue.process_remove_announcement(it)
        return false
      }
    })
  }

  Hue.goto_bottom()
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
        it.closest(".chat_container").querySelectorAll(".chat_content_container").length === 1
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

    Hue.typing_timer()
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

// Gets the most recent chat message by username
Hue.get_last_chat_message_by_username = function (ouname) {
  let found_message = false
  let items = Hue.els("#chat_area > .message.chat_message")
  
  items.reverse().forEach(it => {
    let uname = Hue.dataset(it, "uname")

    if (uname) {
      if (uname === ouname) {
        found_message = it
        return false
      }
    }
  })

  return found_message
}

// Gets the most recent chat message by user_id
Hue.get_last_chat_message_by_user_id = function (ouser_id) {
  let items = Hue.els("#chat_area > .message.chat_message")

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
  if (!Hue.app_focused) {
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
  let message = Hue.get_last_chat_message_by_user_id(id)

  if (message) {
    message.querySelector(".chat_profilepic_container").classList.add("aura")
  }

  let activity_bar_item = Hue.get_activity_bar_item_by_user_id(id)

  if (activity_bar_item) {
    activity_bar_item.querySelector(".activity_bar_image_container").classList.add("aura")
  }
}

// Removes the aura class from messages from a user
Hue.remove_aura = function (id) {
  clearTimeout(Hue.aura_timeouts[id])
  
  Hue.els(".chat_profilepic_container.aura").forEach(it => {
    let message = it.closest(".chat_message")

    if (message) {
      if (Hue.dataset(message, "user_id") === id) {
        it.classList.remove("aura")
      }
    }
  })

  Hue.els(".activity_bar_image_container.aura").forEach(it => {
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
Hue.jump_to_chat_message = function (message_id) {
  let el = Hue.el(`#chat_area > .message_id_${message_id}`)

  if (el.length === 0) {
    return false
  }

  el.scrollIntoView({
    block: "center"
  })

  Hue.close_all_modals()
}

// What to do after receiving a chat message from the server
Hue.on_chat_message = function (data) {
  Hue.add_chat_message({
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
  })

  Hue.hide_typing()
  Hue.remove_aura(data.user_id)
}

// Find the next chat message above that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_above = function () {
  let step = false
  let activity_up_scroller_height = Hue.el("#activity_up_scroller").offsetHeight
  let scrolltop = Hue.el("#chat_area").scrollTop
  let messages = Hue.els("#chat_area > .message")

  messages.reverse().forEach(it => {
    let same_uname = false
    let uname = Hue.dataset(it, "uname")

    if (uname && uname === Hue.username) {
      same_uname = true
    }

    if (same_uname || Hue.dataset(it, "highlighted")) {
      if (it.offsetTop < activity_up_scroller_height) {
        let diff = scrolltop + it.offsetTop - activity_up_scroller_height - 10

        if (scrolltop - diff < 50) {
          return true
        }

        Hue.scroll_chat_to(diff)
        step = true
        return false
      }
    }
  })

  if (!step) {
    Hue.goto_top()
  }
}

// Find the next chat message below that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_below = function () {
  let step = false
  let activity_up_scroller_height = Hue.el("#activity_up_scroller").offsetHeight
  let activity_down_scroller_height = Hue.el("#activity_down_scroller").offsetHeight
  let chat_area_height = Hue.el("#chat_area").clientHeight
  let scrolltop = Hue.el("#chat_area").scrollTop

  docuemnt.querySelectorAll("#chat_area > .message").forEach(it => {
    let same_uname = false
    let uname = Hue.dataset(it, "uname")

    if (uname && uname === Hue.username) {
      same_uname = true
    }

    if (same_uname || Hue.dataset(it, "highlighted")) {
      let h = it.offsetHeight

      if (it.offsetTop + h + activity_down_scroller_height > chat_area_height) {
        let diff = scrolltop + it.offsetTop - activity_up_scroller_height - 10

        if (diff - scrolltop < 50) {
          return true
        }

        Hue.scroll_chat_to(diff)
        step = true
        return false
      }
    }
  })

  if (!step) {
    Hue.goto_bottom(true)
  }
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
  Hue.el("#chat_area").scrollTop = scrolltop
}

// Scrolls the chat up
Hue.scroll_up = function (n) {
  Hue.el("#chat_area").scrollTop -= n
}

// Scrolls the chat down
Hue.scroll_down = function (n) {
  Hue.el("#chat_area").scrollTop += n
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

  if (!Hue.app_focused || Hue.screen_locked) {
    if (type === "message" || type === "media_change") {
      Hue.alert_title(1)
    } else if (type === "highlight" || type === "whisper") {
      Hue.alert_title(2)
    }
  }
}

// Make link preview elements
Hue.make_link_preview = function (args = {}) {
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

  let link_preview_s = `<div class='${classes}'>
    <img class='${image_classes}' src='${args.image}' loading='lazy'>
    <div class='${text_content_classes}'>
      <div class='${title_classes}'>${Hue.utilz.make_html_safe(args.title)}</div>
      <div class='${description_classes}'>${Hue.utilz.make_html_safe(args.description)}</div>
    </div>
  </div>`

  ans.link_preview = link_preview_s
  let text = Hue.parse_text(Hue.utilz.make_html_safe(args.message))
  let stext = `<div class='link_preview_text'>${text}</div>`
  ans.link_preview_text = text
  ans.link_preview = stext + ans.link_preview

  return ans
}

// Setups link preview elements
Hue.setup_link_preview = function (fmessage) {
  let link_preview_el = fmessage.querySelector(".link_preview")
  let link_preview_image = link_preview_el.querySelector(".link_preview_image")

  if (link_preview_image.length) {
    link_preview_image.addEventListener("click", function (e) {
      e.stopPropagation()
      Hue.expand_image(this.src.replace(".gifv", ".gif"))
    })

    link_preview_image.addEventListener("load", function () {
      Hue.goto_bottom()
    })

    link_preview_image.addEventListener("error", function () {
      link_preview_image.style.display = "none"
      link_preview_el.classList.remove("link_preview_with_image")
      Hue.goto_bottom()
    })
  }

  Hue.urlize(link_preview_el.parentElement.querySelector(".link_preview_text"))
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

      ans.image_preview_src_original = `https://i.imgur.com/${code}.${extension}`
      ans.image_preview_src = `https://i.imgur.com/${code}l.jpg`

      // This is in a single line on purpose
      ans.image_preview = `<div class='image_preview action'><img draggable="false" class="image_preview_image" src="${ans.image_preview_src}" loading="lazy"></div>`

      let text = Hue.parse_text(Hue.utilz.make_html_safe(message))
      let stext = `<div class='image_preview_text'>${text}</div>`

      ans.image_preview_text = message
      ans.image_preview = stext + ans.image_preview
    }
  }

  return ans
}

// Setups image preview elements
Hue.setup_image_preview = function (fmessage, image_preview_src_original) {
  let image_preview_el = fmessage.querySelector(".image_preview")

  image_preview_el.addEventListener("click", function () {
    Hue.open_url_menu({
      source: image_preview_src_original
    })
  })

  let image_preview_image = image_preview_el.querySelector(".image_preview_image")

  image_preview_image.addEventListener("load", function () {
    Hue.goto_bottom()
  })

  image_preview_image.addEventListener("error", function () {
    Hue.goto_bottom()
  })

  image_preview_image.addEventListener("click", function (e) {
    e.stopPropagation()
    Hue.expand_image(image_preview_src_original.replace(".gifv", ".gif"))
  })

  Hue.urlize(image_preview_el.parentElement.querySelector(".image_preview_text"))
}

// Starts chat area scroll events
Hue.scroll_events = function () {
  Hue.el("#chat_area").addEventListener("scroll", function (e) {
    if (!Hue.chat_scrolled) {
      Hue.check_scrollers()
    } else {
      Hue.scroll_timer()
    }
  })
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
Hue.check_scrollers = function (threshold = 5) {
  let area = Hue.el("#chat_area")
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
}

// Scrolls the chat to the bottom
Hue.goto_bottom = function (force = false) {
  if (!Hue.started) {
    return
  }

  let chat = Hue.el("#chat_area")
  let max = chat.scrollHeight - chat.clientHeight

  if (force || !Hue.chat_scrolled) {
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
    Hue.setup_image(
      "show",
      Object.assign(Hue.get_media_object_from_init_data("image"), {
        in_log: false,
      })
    )
  }

  if (num_tv === 0) {
    Hue.setup_tv(
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
          Hue.add_chat_message({
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
          })
        } else if (type === "image") {
          data.id = id
          data.date = date
          Hue.setup_image("show", data)
        } else if (type === "tv") {
          data.id = id
          data.date = date
          Hue.setup_tv("show", data)
        }
      }
    }
  }
}

// Sends a simple shrug chat message
Hue.shrug = function () {
  Hue.process_message({
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

  return Hue.add_chat_announcement(obj)
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

  return Hue.add_chat_announcement(obj)
}

// Setups some chat configs
Hue.setup_chat = function () {
  Hue.el("#top_scroller").addEventListener("click", function () {
    Hue.goto_top()
    Hue.check_scrollers()
  })

  Hue.el("#activity_up_scroller").addEventListener("click", function () {
    Hue.activity_above()
  })

  Hue.el("#bottom_scroller").addEventListener("click", function () {
    Hue.stop_edit_message()
    Hue.goto_bottom(true)
    Hue.check_scrollers()
  })

  Hue.el("#activity_down_scroller").addEventListener("click", function () {
    Hue.activity_below()
  })
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

// Shows an alert when a message follows a user's message
Hue.activity_notification = function () {
  if (!Hue.started) {
    return false
  }

  if (!Hue.settings.show_activity_notifications) {
    return false
  }

  if (!Hue.app_focused) {
    Hue.show_activity_desktop_notification()
  }
}

// Get last chat message or announcement date
Hue.get_last_message_date = function () {
  let a = Hue.dataset(Hue.els("#chat_area .chat_content").slice(-1)[0], "date") || 0
  let b = Hue.dataset(Hue.els("#chat_area .media_announcement").slice(-1)[0], "date") || 0
  return Math.max(a, b)
}

// Clear the chat by adding a spacer
Hue.add_chat_spacer = function () {
  Hue.els(".clear_spacer").forEach(it => {
    it.remove()
  })

  let spacer = document.createElement("div")
  spacer.classList.add("message")
  spacer.classList.add("clear_spacer")

  Hue.el("#chat_area").append(spacer)
  Hue.goto_bottom(true)
}