// Checks if a user is in the room to receive a whisper
Hue.check_whisper_user = function (uname) {
  if (!Hue.usernames.includes(uname)) {
    Hue.user_not_in_room(uname)
    return false
  }

  return true
}

// Processes whisper commands to determine how to handle the operation
Hue.process_write_whisper = function (arg, show = true) {
  let user = Hue.get_user_by_username(arg)

  if (arg.includes(">")) {
    Hue.send_inline_whisper(arg, show)
  } else if (user) {
    Hue.write_popup_message([arg], "user")
  } else if (arg.includes("&&")) {
    let split = arg.split("&&").map((x) => x.trim())
    Hue.write_popup_message(split, "user")
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

  let uname = split[0].trim()
  let usplit = uname.split("&&")
  let message = Hue.utilz.clean_string2(split.slice(1).join(">"))

  if (!message) {
    return false
  }

  let message_split = message.split("\n")
  let num_lines = message_split.length

  if (num_lines > Hue.config.max_num_newlines) {
    return false
  }

  let approved = []

  for (let u of usplit) {
    u = u.trim()

    if (!Hue.check_whisper_user(u)) {
      continue
    }

    approved.push(u)
  }

  if (approved.length === 0) {
    return false
  }

  Hue.do_send_whisper({message: message, usernames: approved, type: "user"}, show)
}

// Shows the window to write whispers
Hue.write_popup_message = function (unames = [], type = "user") {
  if (unames.length === 0) {
    if (type === "user") {
      return false
    }
  } else {
    for (let u of unames) {
      if (!Hue.check_whisper_user(u)) {
        return false
      }
    }
  }

  let f = function () {
    Hue.show_userlist_window("whisper")
  }

  let title 

  if (type === "user") {
    title = { text: `Whisper to ${Hue.utilz.nice_list(unames)}`, onclick: f }
  } else {
    title = { text: `Whisper (${type})`}
  }

  Hue.message_unames = unames
  Hue.msg_message.set_title(Hue.make_safe(title))
  Hue.message_type = type

  Hue.msg_message.show(function () {
    Hue.el("#write_message_area").focus()

    if (type === "user") {
      Hue.show_message_feedback("Click titlebar to add more users")
    } else if (type === "system_broadcast") {
      Hue.show_message_feedback("This will send a whisper to every user")
    }

    Hue.sending_whisper = false
  })
}

// Updates the user receivers in the whisper window after picking a username in the user list
Hue.update_whisper_users = function (uname) {
  if (!Hue.message_unames.includes(uname)) {
    Hue.message_unames.push(uname)
  } else {
    if (Hue.message_unames.length === 1) {
      return false
    }

    for (let i = 0; i < Hue.message_unames.length; i++) {
      let u = Hue.message_unames[i]

      if (u === uname) {
        Hue.message_unames.splice(i, 1)
        break
      }
    }
  }

  let f = function () {
    Hue.show_userlist_window("whisper")
  }

  let title = {
    text: `Whisper to ${Hue.utilz.nice_list(Hue.message_unames)}`,
    onclick: f,
  }

  Hue.msg_message.set_title(Hue.make_safe(title))
  Hue.msg_userlist.close()
}

// Submits the whisper window form
// Handles different types of whispers
Hue.send_popup_message = function (force = false) {
  if (Hue.sending_whisper) {
    return false
  }

  Hue.sending_whisper = true

  let message = Hue.utilz.remove_multiple_empty_lines(Hue.el("#write_message_area").value).trim()
  let diff = Hue.config.max_whispers_post_length - message.length

  if (diff === Hue.config.max_whispers_post_length) {
    Hue.sending_whisper = false
    return false
  } else if (diff < 0) {
    Hue.show_message_feedback(`Character limit exceeded by ${Math.abs(diff)}`)
    Hue.sending_whisper = false
    return false
  }

  let message_split = message.split("\n")
  let num_lines = message_split.length

  if (num_lines > Hue.config.max_num_newlines) {
    Hue.show_message_feedback("Too many linebreaks")
    Hue.sending_whisper = false
    return false
  }

  let ans = Hue.send_whisper(message, force)

  if (ans) {
    Hue.msg_message.close(function () {
      Hue.sending_whisper = false
    })
  } else {
    Hue.sending_whisper = false
  }

  Hue.el("#write_message_area").value = ""
}

// On whisper received
Hue.whisper_received = function (data) {
  let message = `Whisper from ${data.username}`
  let func = function () { Hue.show_whisper(data) }
  let item = Hue.make_info_popup_item({icon: "envelope", message: message, push: false})

  let open = Hue.get_setting("open_whispers_automatically") && !Hue.screen_locked
  data.notification = Hue.push_whisper(message, func, open)
  
  if (open) {
    Hue.show_whisper(data)
    Hue.on_activity("whisper")
  } else {
    Hue.show_popup(Hue.make_info_popup(func), item)
  }
}

// Shows a whisper message
Hue.show_whisper = function (data) {
  let title_func = function () {}
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

  button_html = Hue.utilz.nonbreak("Send Whisper")

  button_func = function () {
    Hue.write_popup_message(usr)
  }

  title_func = function () {
    Hue.show_profile(usr[0])
  }
  
  let modal = Hue.create_modal({window_class: "!whisper_width"}, "whisper")
  modal.set(Hue.template_sent_message())
  modal.set_title(Hue.make_safe({text: title, onclick: title_func }))
  let message_html = Hue.utilz.make_html_safe(data.message)
  message_html = Hue.parse_text(message_html)

  modal.show(function () {
    let container = modal.content
    let text_el = container.querySelector(".sent_message_text")
    text_el.html(message_html)
    text_el.urlize()
    let button_el = container.querySelector(".sent_message_button")

    if (data.type === "user") {
      button_el.html(button_html)
      button_el.addEventListener("click", button_func)
    } else {
      button_el.style.display = "none"
    }
    
    Hue.setup_whispers_click(text_el, usr[0])
  })

  if (!Hue.dataset(data.notification, "read")) {
    let text = data.notification.textContent.replace(/\s\(unread\)$/, "")
    data.notification.textContent = text
    Hue.dataset(data.notification, "read", true)
    Hue.update_whispers_unread_count()
  }
}

// Sends a whisper to user(s)
Hue.send_whisper = function (message, force = false) {
  if (Hue.message_type === "system_broadcast") {
    Hue.do_send_whisper({message: message, usernames: [], type: Hue.message_type})
    return true
  }

  let unames = Hue.message_unames

  if (!unames) {
    return false
  }

  let discarded = []
  let approved = []

  for (let u of unames) {
    if (!Hue.usernames.includes(u)) {
      discarded.push(u)
    } else {
      approved.push(u)
    }
  }

  if (!force) {
    if (discarded.length > 0) {
      let us = Hue.utilz.nice_list(discarded)
      let w = discarded.length === 1 ? "is" : "are"
      let dd = ""

      if (unames.length > discarded.length) {
        dd = " Double click Send to send anyway"
      }

      Hue.show_message_feedback(`(${us} ${w} not in the room)${dd}`)
      return false
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

// Setups whispers click events
Hue.setup_whispers_click = function (content, username) {
  content.querySelectorAll(".whisper_link").forEach(it => {
    it.addEventListener("click", function () {
      Hue.process_write_whisper(`${username} > ${Hue.dataset(it, "whisper")}`, false)
    })
  })
}

// Setups the message window
Hue.setup_message_window = function () {
  Hue.el("#write_message_send_button").addEventListener("click", function () {
    Hue.send_popup_message()
  })

  Hue.el("#write_message_send_button").addEventListener("dblclick", function () {
    Hue.send_popup_message(true)
  })
}

// Pushes a new whisper to the whispers window
Hue.push_whisper = function (message, on_click, read) {
  let d = Date.now()
  let t = Hue.utilz.nice_date(d)

  let message_html = `<div class='whispers_message'>${Hue.utilz.make_html_safe(
    message
  )}</div>`
  let item = $(
    `<div class='whispers_item modal_item'><div class='whispers_item_content action dynamic_title'>${message_html}</div>`
  )
  let content = item.querySelector(".whispers_item_content")

  content.title = t
  Hue.dataset(content, "otitle", t)
  Hue.dataset(content, "date", d)
  Hue.dataset(content, "read", read)

  if (read) {
    content.textContent = message
  } else {
    content.textContent = `${message} (unread)`
  }

  content.addEventListener("click", function () {
    on_click()
  })

  let items = Hue.el("#whispers_container .whispers_item")
  let num_items = items.length

  if (num_items === 0) {
    Hue.el("#whispers_container").html(item)
  } else {
    Hue.el("#whispers_container").prepend(item)
  }

  if (num_items > Hue.config.whispers_crop_limit) {
    Hue.el("#whispers_container .whispers_item").last().remove()
  }

  Hue.update_whispers_unread_count()

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

// Shows the message feedback
Hue.show_message_feedback = function (s) {
  Hue.el("#write_message_feedback").textContent = s
  Hue.el("#write_message_feedback").style.display = "block"
}