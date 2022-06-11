// Processes whisper commands to determine how to handle the operation
Hue.process_write_whisper = function (arg) {
  if (!arg) {
    Hue.checkmsg(`Format: ${Hue.config.commands_prefix}whisper [username] [message]`)
    return
  }

  let user = Hue.get_user_by_username(arg)

  if (arg.includes(">")) {
    Hue.send_inline_whisper(arg)
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
      Hue.send_inline_whisper(arg2)
    } else if (matches.length > 1) {
      Hue.checkmsg(
        `Multiple usernames matched. Use the proper > syntax. For example ${Hue.config.commands_prefix}whisper bob > hi`
      )
      return
    } else {
      Hue.user_not_in_room()
      return
    }
  }
}

// Sends a whisper using the inline format (/whisper user > hello)
Hue.send_inline_whisper = function (arg) {
  let split = arg.split(">")

  if (split.length < 2) {
    return
  }

  let username = split[0].trim()
  let usplit = username.split("&&").map(x => x.trim())
  let message = Hue.utilz.single_space(split.slice(1).join(">"))

  if (!message) {
    return
  }

  let message_split = message.split("\n")
  let num_lines = message_split.length

  if (num_lines > Hue.config.max_num_newlines) {
    return
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
    return
  }

  Hue.do_send_whisper({message: message, usernames: c_usernames, type: "user"})
}

// Shows the window to write whispers
Hue.write_whisper = function (usernames = [], type = "user") {
  let c_usernames = []

  for (let u of usernames) {
    let cu = Hue.check_user_in_room(u)
    
    if (cu) {
      c_usernames.push(cu)
    } else {
      return
    }
  }

  if (type === "user") {
    Hue.el("#write_whisper_add_user").style.display = "block"
  } else {
    Hue.el("#write_whisper_add_user").style.display = "none"
  }

  Hue.message_type = type
  Hue.whisper_users = []

  for (let username of c_usernames) {
    Hue.update_whisper_users(username)
  }

  Hue.msg_write_whisper.show(function () {
    Hue.focus_write_whisper()
  })

  if (usernames.length === 0) {
    Hue.show_userlist_window("whisper")
  }
}

// Updates the user receivers in the whisper window after picking a username in the user list
Hue.update_whisper_users = function (username) {
  if (!Hue.whisper_users.includes(username)) {
    Hue.whisper_users.push(username)
  } else {
    for (let i = 0; i < Hue.whisper_users.length; i++) {
      let u = Hue.whisper_users[i]

      if (u === username) {
        Hue.whisper_users.splice(i, 1)
        break
      }
    }
  }

  let users_el = Hue.el("#write_whisper_users")
  users_el.innerHTML = ""

  for (let username of Hue.whisper_users) {
    let user = Hue.get_user_by_username(username)
    users_el.append(Hue.make_whisper_user(user, "sent", function () {
      Hue.update_whisper_users(username)
    }))
  }
  
  Hue.msg_userlist.close()
  Hue.focus_write_whisper()
}

// Submits the whisper window form
// Handles different types of whispers
Hue.submit_write_whisper = function () {
  let message = Hue.utilz.remove_multiple_empty_lines(Hue.el("#write_whisper_area").value).trim()
  let diff = Hue.config.max_whispers_post_length - message.length

  if (diff === Hue.config.max_whispers_post_length) {
    return
  } else if (diff < 0) {
    Hue.checkmsg(`Character limit exceeded by ${Math.abs(diff)}`)
    return
  }

  let message_split = message.split("\n")
  let num_lines = message_split.length

  if (num_lines > Hue.config.max_num_newlines) {
    Hue.checkmsg("Too many linebreaks")
    return
  }

  let ans = Hue.send_whisper(message)

  if (ans) {
    Hue.el("#write_whisper_area").value = ""
    Hue.msg_write_whisper.close()
  }
}

// On whisper received
Hue.whisper_received = function (data) {
  data.mode = "received"
  let message = `Whisper from ${data.username}`
  let func = function () { Hue.show_whisper(data, "received") }
  let item = Hue.make_info_popup_item({icon: "envelope", message: message, push: false})
  data.notification = Hue.push_whisper(message, func, false, data)
  Hue.on_activity("whisper")
  
  if (Hue.get_setting("open_whispers_automatically")) {
    if (!Hue.msg_whispers.is_open()) {
      Hue.show_whispers()
    }
  } else {
    Hue.show_popup(Hue.make_info_popup(func), item)
  }
}

// On whisper sent
Hue.whisper_sent = function (data) {
  data.mode = "sent"
  let usernames = Array.from(data.users, x => x.username)
  let message = `Whisper sent to ${Hue.utilz.nice_list(usernames)}`
  let func = function () { Hue.show_whisper(data, "sent") }
  let item = Hue.make_info_popup_item({icon: "envelope", message: message, push: false})
  data.notification = Hue.push_whisper(message, func, true, data)
  Hue.show_popup(Hue.make_info_popup(func), item)
}

// Shows a whisper message
Hue.show_whisper = function (data, mode) {
  let container = Hue.el("#show_whisper_container")
  let write_button = Hue.el("#show_whisper_write")
  let users

  if (mode === "received") {
    users = [{username: data.username, user_id: data.user_id}]
    Hue.dataset(container, "username", data.username)
    Hue.dataset(container, "user_id", data.user_id)
    write_button.textContent = "Reply"
  } else if (mode === "sent") {
    users = data.users
    Hue.dataset(container, "username", Hue.username)
    Hue.dataset(container, "user_id", Hue.user_id)
    write_button.textContent = "Write Again"
  }

  let users_el = Hue.el("#show_whisper_users")
  users_el.innerHTML = ""

  for (let user of users) {
    users_el.append(Hue.make_whisper_user(user, mode, function () {
      Hue.show_profile(user.username, user.user_id)
    }))
  }

  Hue.show_whisper_data = data

  let message_html = Hue.utilz.make_html_safe(data.message)
  message_html = Hue.parse_text(message_html)

  if (mode === "sent") {
    message_html = `<div class="show_whisper_detail">You said:</div>${message_html}`
  }

  let text_el = Hue.el("#show_whisper_text")
  text_el.innerHTML = message_html
  Hue.urlize(text_el)

  if (!Hue.dataset(data.notification, "read")) {
    let message_el = Hue.el(".whisper_item_message", data.notification)
    let text = message_el.textContent.replace(/\s\(unread\)$/, "")
    message_el.textContent = text
    Hue.dataset(data.notification, "read", true)
    Hue.update_whispers_unread_count()
  }

  Hue.msg_show_whisper.show()
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
Hue.do_send_whisper = function (data) {
  Hue.socket_emit("whisper", data)
}

// Setups whispers
Hue.setup_whispers = function () {
  Hue.el("#write_whisper_send").addEventListener("click", function () {
    Hue.submit_write_whisper()
  })

  Hue.el("#write_whisper_add_user").addEventListener("click", function () {
    if (Hue.whisper_users.length >= Hue.config.max_whisper_users) {
      Hue.show_info("Max whisper users reached")
      return
    }

    Hue.show_userlist_window("whisper")
  })

  Hue.el("#show_whisper_write").addEventListener("click", function () {
    Hue.msg_show_whisper.close()

    if (Hue.show_whisper_data.users) {
      let usernames = Array.from(Hue.show_whisper_data.users, x => x.username)
      Hue.write_whisper(usernames, "user")
    } else {
      Hue.write_whisper([Hue.show_whisper_data.username], "user")
    }
  })

  Hue.el("#start_write_whisper").addEventListener("click", function () {
    Hue.write_whisper([], "user")
  })

  Hue.el("#whispers_clear").addEventListener("click", function () {
    Hue.show_confirm("Remove all items from the window", function () {
      Hue.clear_whispers()
    })
  })

  Hue.set_whispers_info()
}

// Pushes a new whisper to the whispers window
Hue.push_whisper = function (message, on_click, read, data) {
  let date = Date.now()
  let title = Hue.utilz.nice_date(date)
  let item = Hue.div("whisper_item modal_item dynamic_title")

  if (data.mode === "received") {
    item.innerHTML = Hue.template_whisper_received({
      date: title,
      profilepic: Hue.get_profilepic(data.user_id),
      message: message
    })

    Hue.el(".profilepic", item).addEventListener("error", function () {
      Hue.fallback_profilepic(this)
    })
  } else {
    item.innerHTML = Hue.template_whisper_sent({
      date: title,
      message: message
    })
  }
  
  item.title = title

  Hue.dataset(item, "otitle", title)
  Hue.dataset(item, "date", date)
  Hue.dataset(item, "read", read)

  item.addEventListener("click", function () {
    on_click()
  })

  let message_el = Hue.el(".whisper_item_message", item)

  if (read) {
    message_el.textContent = message
  } else {
    message_el.textContent = `${message} (unread)`
  }

  Hue.el("#whispers_container").prepend(item)
  
  let items = Hue.els(".whisper_item")

  if (items.length > Hue.config.whispers_crop_limit) {
    Hue.els("#whispers_container .whisper_item").slice(-1)[0].remove()
  }

  Hue.update_whispers_unread_count()

  let empty = Hue.el("#whispers_container .empty_window_message")

  if (empty) {
    empty.remove()
  }

  return item
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

  Hue.els(".whisper_item_content").forEach(it => {
    if (!Hue.dataset(it, "read")) {
      num_unread += 1
    }
  })

  return num_unread
}

// Make whisper user
Hue.make_whisper_user = function (user, mode, onclick) {
  let user_el = Hue.div("user_item")
  user_el.innerHTML = Hue.template_whisper_user()
  let profilepic = Hue.el(".show_whisper_profilepic", user_el)
  profilepic.src = Hue.get_profilepic(user.user_id)

  profilepic.addEventListener("error", function () {
    Hue.fallback_profilepic(this)
  })

  let username_el = Hue.el(".show_whisper_username", user_el)
  username_el.textContent = user.username

  if (mode === "received") {
    username_el.textContent += " says:"
  }

  user_el.addEventListener("click", onclick)

  return user_el
}

// Clear whispers
Hue.clear_whispers = function () {
  Hue.set_whispers_info()
  Hue.update_whispers_unread_count()
}

// Set whispers info
Hue.set_whispers_info = function () {
  Hue.el("#whispers_container").innerHTML = Hue.template_whispers_info()
}

// Focus write whisper
Hue.focus_write_whisper = function () {
  Hue.el("#write_whisper_area").focus()
}