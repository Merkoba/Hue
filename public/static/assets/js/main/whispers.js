// Processes whisper commands to determine how to handle the operation
Hue.process_write_whisper = function (arg, show = true) {
  if (!arg) {
    Hue.checkmsg(`Format: ${Hue.config.commands_prefix}whisper [username] [message]`)
    return
  }

  let user = Hue.get_user_by_username(arg)

  if (arg.includes(">")) {
    Hue.send_inline_whisper(arg, show)
  } else if (user) {
    Hue.write_whisper([user.username], "user")
  } else if (arg.includes("&&")) {
    let split = arg.split("&&").map((x) => x.trim())
    Hue.write_whisper(split, "user")
  } else {
    let matches = Hue.get_matching_usernames(arg)
    if (matches.length === 1) {
      let message = arg.replace(matches[0], "")
      let arg2 = `${matches[0]} > ${message}`
      Hue.send_inline_whisper(arg2, show)
    } else if (matches.length > 1) {
      Hue.checkmsg(
        `Multiple usernames matched. Use the proper > syntax. For example ${Hue.config.commands_prefix}whisper bob > hi`
      )
      return false
    } else {
      Hue.user_not_in_room()
      return false
    }
  }
}

// Sends a whisper using the inline format (/whisper user > hello)
Hue.send_inline_whisper = function (arg, show = true) {
  let split = arg.split(">")

  if (split.length < 2) {
    return false
  }

  let username = split[0].trim()
  let usplit = username.split("&&").map(x => x.trim())
  let message = Hue.utilz.single_space(split.slice(1).join(">"))

  if (!message) {
    return false
  }

  let message_split = message.split("\n")
  let num_lines = message_split.length

  if (num_lines > Hue.config.max_num_newlines) {
    return false
  }

  let c_usernames = []

  for (let u of usplit) {
    let cu = Hue.check_user_in_room(u)
    
    if (!cu) {
      continue
    }

    c_usernames.push(cu)
  }

  if (c_usernames.length === 0) {
    return false
  }

  Hue.do_send_whisper({message: message, usernames: c_usernames, type: "user"}, show)
}

// Shows the window to write whispers
Hue.write_whisper = function (usernames = [], type = "user") {
  let c_usernames = []

  if (usernames.length === 0) {
    if (type === "user") {
      return false
    }
  } else {
    for (let u of usernames) {
      let cu = Hue.check_user_in_room(u)
      
      if (cu) {
        c_usernames.push(cu)
      } else {
        return false
      }
    }
  }

  let title 

  if (type === "user") {
    title = `Whisper to ${Hue.utilz.nice_list(c_usernames)}`
  } else {
    title = `Whisper (${type})`
  }

  if (type === "user") {
    Hue.el("#write_whisper_add_user").style.display = "block"
  } else {
    Hue.el("#write_whisper_add_user").style.display = "none"
  }

  Hue.msg_write_whisper.set_title(Hue.utilz.make_html_safe(title))
  Hue.message_type = type
  Hue.whisper_users = []

  for (let username of c_usernames) {
    Hue.update_whisper_users(username)
  }

  Hue.msg_write_whisper.show(function () {
    Hue.el("#write_whisper_area").focus()
    Hue.sending_whisper = false
  })
}

// Updates the user receivers in the whisper window after picking a username in the user list
Hue.update_whisper_users = function (username) {
  if (!Hue.whisper_users.includes(username)) {
    Hue.whisper_users.push(username)
  } else {
    if (Hue.whisper_users.length === 1) {
      return false
    }

    for (let i = 0; i < Hue.whisper_users.length; i++) {
      let u = Hue.whisper_users[i]

      if (u === username) {
        Hue.whisper_users.splice(i, 1)
        break
      }
    }
  }

  let profilepics = Hue.el("#write_whisper_user_profilepics")
  
  profilepics.innerHTML = ""

  if (Hue.whisper_users.length > 1) {
    for (let username of Hue.whisper_users) {
      let user = Hue.get_user_by_username(username)
      let img = document.createElement("img")
      img.classList.add("profilepic")
      img.classList.add("actionbox")
      img.title = username
      Hue.dataset(img, "username", username)
      img.src = Hue.get_profilepic(user.user_id)
      profilepics.append(img)
    }
  }

  let title

  if (Hue.whisper_users.length === 1) {
    title = `Whisper to ${Hue.whisper_users}`
  } else {
    title = "Whisper to..."
  }

  Hue.msg_write_whisper.set_title(Hue.utilz.make_html_safe(title))
  Hue.msg_userlist.close()
}

// Submits the whisper window form
// Handles different types of whispers
Hue.submit_write_whisper = function () {
  if (Hue.sending_whisper) {
    return false
  }

  Hue.sending_whisper = true

  let message = Hue.utilz.remove_multiple_empty_lines(Hue.el("#write_whisper_area").value).trim()
  let diff = Hue.config.max_whispers_post_length - message.length

  if (diff === Hue.config.max_whispers_post_length) {
    Hue.sending_whisper = false
    return false
  } else if (diff < 0) {
    Hue.checkmsg(`Character limit exceeded by ${Math.abs(diff)}`)
    Hue.sending_whisper = false
    return false
  }

  let message_split = message.split("\n")
  let num_lines = message_split.length

  if (num_lines > Hue.config.max_num_newlines) {
    Hue.checkmsg("Too many linebreaks")
    Hue.sending_whisper = false
    return false
  }

  let ans = Hue.send_whisper(message)

  if (ans) {
    Hue.msg_write_whisper.close(function () {
      Hue.sending_whisper = false
    })

    Hue.el("#write_whisper_area").value = ""
  } else {
    Hue.sending_whisper = false
  }
}

// On whisper received
Hue.whisper_received = function (data) {
  let message = `Whisper from ${data.username}`
  let func = function () { Hue.show_whisper(data) }
  let item = Hue.make_info_popup_item({icon: "envelope", message: message, push: false})
  data.notification = Hue.push_whisper(message, func, false, data)
  Hue.show_popup(Hue.make_info_popup(func), item)
  Hue.on_activity("whisper")
  
  if (Hue.get_setting("open_whispers_automatically")) {
    if (!Hue.msg_whispers.is_open()) {
      Hue.show_whispers()
    }
  }
}

// Shows a whisper message
Hue.show_whisper = function (data) {
  let button_func = function () {}
  let title, button_html
  let usr

  if (data.usernames === undefined) {
    title = `Whisper from ${data.username}`
    usr = [data.username]
  } else {
    title = `Whisper sent to ${Hue.utilz.nice_list(data.usernames)}`
    usr = data.usernames
  }
  
  let modal = Hue.create_modal({window_class: "!whisper_width"}, "whisper")
  modal.set(Hue.template_sent_whisper())
  modal.set_title(Hue.utilz.make_html_safe(title))

  button_html = Hue.utilz.nonbreak("Send Whisper")

  button_func = function () {
    modal.close()
    Hue.write_whisper(usr)
  }
  
  let message_html = Hue.utilz.make_html_safe(data.message)
  message_html = Hue.parse_text(message_html)

  modal.show(function () {
    let container = modal.content
    let text_el = Hue.el(".sent_whisper_text", container)
    text_el.classList.add("user_details")
    Hue.dataset(text_el, "username", data.username)
    text_el.innerHTML = message_html
    Hue.urlize(text_el)
    let button_el = Hue.el(".sent_whisper_button", container)

    let profilepic = Hue.el(".sent_whisper_profilepic", container)

    if (data.user_id) {
      profilepic.src = Hue.get_profilepic(data.user_id)
      
      profilepic.addEventListener("click", function () {
        Hue.show_profile(data.username, data.user_id)
      })

      profilepic.addEventListener("error", function () {
        if (this.src !== Hue.config.default_profilepic_url) {
          this.src = Hue.config.default_profilepic_url
        }
      })      
    } else {
      profilepic.style.display = "none"
    }

    if (data.type === "user") {
      button_el.innerHTML = button_html
      button_el.addEventListener("click", button_func)
    } else {
      button_el.style.display = "none"
    }
  })

  if (!Hue.dataset(data.notification, "read")) {
    let text = data.notification.textContent.replace(/\s\(unread\)$/, "")
    data.notification.textContent = text
    Hue.dataset(data.notification, "read", true)
    Hue.update_whispers_unread_count()
  }
}

// Sends a whisper to user(s)
Hue.send_whisper = function (message) {
  if (Hue.message_type === "system_broadcast") {
    Hue.do_send_whisper({message: message, usernames: [], type: Hue.message_type})
    return true
  }

  let usernames = Hue.whisper_users

  if (!usernames) {
    return false
  }

  let discarded = []
  let approved = []

  
  for (let u of usernames) {
    let user = Hue.get_userlist_item_by_username(u)
    
    if (!user) {
      discarded.push(user.username)
    } else {
      approved.push(user.username)
    }
  }

  if (approved.length === 0) {
    return false
  }

  Hue.do_send_whisper({message: message, usernames: approved, type: Hue.message_type})

  return true
}

// Does the whisper emit
Hue.do_send_whisper = function (data, show = true) {
  Hue.socket_emit("whisper", data)

  if (show) {
    let func = function () {
      Hue.show_whisper(data)
    }

    let msg = ""
    
    if (data.type === "user") {
      msg = `Whisper sent to ${Hue.utilz.nice_list(data.usernames)}`
    } else if (data.type === "system_broadcast") {
      msg = "System Broadcast Sent"
    }

    let item = Hue.make_info_popup_item({icon: "envelope", message: msg, push: false})
    Hue.show_popup(Hue.make_info_popup(func), item)
    data.notification = Hue.push_whisper(msg, func, true)
  }
}

// Setups the write whisper window
Hue.setup_write_whisper = function () {
  Hue.el("#write_whisper_send_button").addEventListener("click", function () {
    Hue.submit_write_whisper()
  })

  Hue.el("#write_whisper_add_user").addEventListener("click", function () {
    if (Hue.whisper_users.length >= Hue.config.max_whisper_users) {
      Hue.showmsg("Max whisper users reached")
      return
    }

    Hue.show_userlist_window("whisper")
  })

  Hue.el("#write_whisper_user_profilepics").addEventListener("click", function (e) {
    let el = e.target.closest(".profilepic")

    if (el) {
      Hue.update_whisper_users(Hue.dataset(el, "username"))
    }
  })
}

// Pushes a new whisper to the whispers window
Hue.push_whisper = function (message, on_click, read, data = false) {
  let date = Date.now()
  let title = Hue.utilz.nice_date(date)
  let item = Hue.div("whispers_item modal_item nice_row")

  if (data && data.user_id) {
    item.innerHTML = `<img class='whispers_item_profilepic profilepic' loading='lazy' src='${Hue.get_profilepic(data.user_id)}'>`
  }

  let message_el = Hue.div("whispers_item_content action dynamic_title")
  message_el.textContent = message
  item.appendChild(message_el)
  
  let content = Hue.el(".whispers_item_content", item)
  content.title = title

  Hue.dataset(content, "otitle", title)
  Hue.dataset(content, "date", date)
  Hue.dataset(content, "read", read)

  if (read) {
    content.textContent = message
  } else {
    content.textContent = `${message} (unread)`
  }

  content.addEventListener("click", function () {
    on_click()
  })

  Hue.el("#whispers_container").prepend(item)
  
  let items = Hue.els(".whispers_item")

  if (items.length > Hue.config.whispers_crop_limit) {
    Hue.els("#whispers_container .whispers_item").slice(-1)[0].remove()
  }

  Hue.update_whispers_unread_count()

  let empty = Hue.el("#whispers_container .empty_window_message")

  if (empty) {
    empty.remove()
  }

  return content
}

// Shows information about the recent whispers
Hue.show_whispers = function (filter = "") {
  Hue.msg_whispers.show(function () {
    if (filter.trim()) {
      Hue.el("#whispers_filter").value = filter
      Hue.do_modal_filter()
    }
  })
}

// Updates the whispers unread count
Hue.update_whispers_unread_count = function () {
  Hue.el("#header_whispers_count").textContent = `(${Hue.get_unread_whispers()})`
}

// Get a list of unread whispers
Hue.get_unread_whispers = function () {
  let num_unread = 0

  Hue.els(".whispers_item_content").forEach(it => {
    if (!Hue.dataset(it, "read")) {
      num_unread += 1
    }
  })

  return num_unread
}