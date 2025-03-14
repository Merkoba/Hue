// Processes whisper commands to determine how to handle the operation
App.process_write_whisper = (arg) => {
  if (!arg) {
    App.checkmsg(`Format: ${App.cmd_prefix()}whisper [username] [message]`)
    return
  }

  let user = App.get_user_by_username(arg)

  if (arg.includes(`>`)) {
    App.send_inline_whisper(arg)
  }
  else if (user) {
    App.write_whisper([user.username], `user`)
  }
  else if (arg.includes(`&&`)) {
    let split = arg.split(`&&`).map((x) => x.trim())
    App.write_whisper(split, `user`)
  }
  else {
    let matches = App.get_matching_usernames(arg)
    if (matches.length === 1) {
      let message = arg.replace(matches[0], ``)
      let arg2 = `${matches[0]} > ${message}`
      App.send_inline_whisper(arg2)
    }
    else if (matches.length > 1) {
      App.checkmsg(
        `Multiple usernames matched. Use the proper > syntax. For example ${App.cmd_prefix()}whisper bob > hi`,
      )

      return
    }
    else {
      App.user_not_in_room()
      return
    }
  }
}

// Sends a whisper using the inline format (/whisper user > hello)
App.send_inline_whisper = (arg) => {
  let split = arg.split(`>`)

  if (split.length < 2) {
    return
  }

  let username = split[0].trim()
  let usplit = username.split(`&&`).map(x => x.trim())
  let message = App.utilz.single_space(split.slice(1).join(`>`))

  if (!message) {
    return
  }

  let message_split = message.split(`\n`)
  let num_lines = message_split.length

  if (num_lines > App.config.max_num_newlines) {
    return
  }

  let c_usernames = []

  for (let u of usplit) {
    let cu = App.check_user_in_room(u)

    if (!cu) {
      continue
    }

    c_usernames.push(cu)
  }

  if (c_usernames.length === 0) {
    return
  }

  App.do_send_whisper({message, usernames: c_usernames, type: `user`})
}

// Shows the window to write whispers
App.write_whisper = (usernames = [], type = `user`) => {
  let c_usernames = []

  for (let u of usernames) {
    let cu = App.check_user_in_room(u)

    if (cu) {
      c_usernames.push(cu)
    }
    else {
      return
    }
  }

  if (type === `user`) {
    DOM.show(`#write_whisper_add_user`)
  }
  else {
    DOM.hide(`#write_whisper_add_user`)
  }

  App.horizontal_separator(DOM.el(`#write_whisper_titlebar`))

  App.message_type = type
  App.whisper_users = []

  for (let username of c_usernames) {
    App.update_whisper_users(username)
  }

  App.msg_write_whisper.show()
  App.focus_write_whisper()

  if (usernames.length === 0) {
    if (type !== `system_broadcast`) {
      App.show_userlist_window(`whisper`)
    }
  }
}

// Updates the user receivers in the whisper window after picking a username in the user list
App.update_whisper_users = (username) => {
  if (!App.whisper_users.includes(username)) {
    App.whisper_users.push(username)
  }
  else {
    for (let i = 0; i < App.whisper_users.length; i++) {
      let u = App.whisper_users[i]

      if (u === username) {
        App.whisper_users.splice(i, 1)
        break
      }
    }
  }

  let users_el = DOM.el(`#write_whisper_users`)
  users_el.innerHTML = ``

  for (let username of App.whisper_users) {
    let user = App.get_user_by_username(username)
    users_el.append(App.make_whisper_user(user, `sent`, () => {
      App.update_whisper_users(username)
    }))
  }

  App.msg_userlist.close()
  App.focus_write_whisper()
}

// Submits the whisper window form
// Handles different types of whispers
App.submit_write_whisper = () => {
  let message = App.utilz.remove_multiple_empty_lines(DOM.el(`#write_whisper_area`).value).trim()
  let diff = App.config.max_whispers_post_length - message.length

  if (diff === App.config.max_whispers_post_length) {
    return
  }
  else if (diff < 0) {
    App.checkmsg(`Character limit exceeded by ${Math.abs(diff)}`)
    return
  }

  let message_split = message.split(`\n`)
  let num_lines = message_split.length

  if (num_lines > App.config.max_num_newlines) {
    App.checkmsg(`Too many linebreaks`)
    return
  }

  let ans = App.send_whisper(message)

  if (ans) {
    DOM.el(`#write_whisper_area`).value = ``
    App.msg_write_whisper.close()
  }
}

// On whisper received
App.whisper_received = (data) => {
  data.mode = `received`
  let message = `Whisper from ${data.username}`

  let func = () => {
    App.show_whisper(data, `received`)
  }

  let item = App.make_info_popup_item({icon: `envelope`, message, push: false})
  data.notification = App.push_whisper(message, func, false, data)
  App.on_activity(`whisper`)

  if (App.get_setting(`open_whispers_automatically`)) {
    if (!App.msg_whispers.is_open()) {
      App.show_whispers()
    }
  }
  else {
    App.show_popup(App.make_info_popup(func), item)
  }
}

// On whisper sent
App.whisper_sent = (data) => {
  data.mode = `sent`
  let usernames = Array.from(data.users, x => x.username)
  let message = `Whisper sent to ${App.utilz.nice_list(usernames)}`

  let func = () => {
    App.show_whisper(data, `sent`)
  }

  let item = App.make_info_popup_item({icon: `envelope`, message, push: false})
  data.notification = App.push_whisper(message, func, true, data)
  App.show_popup(App.make_info_popup(func), item)
}

// Shows a whisper message
App.show_whisper = (data, mode) => {
  let container = DOM.el(`#show_whisper_container`)
  let write_button = DOM.el(`#show_whisper_write`)
  let users

  if (mode === `received`) {
    users = [{username: data.username, user_id: data.user_id}]
    DOM.dataset(container, `username`, data.username)
    DOM.dataset(container, `user_id`, data.user_id)
    write_button.textContent = `Reply`
  }
  else if (mode === `sent`) {
    users = data.users
    DOM.dataset(container, `username`, App.username)
    DOM.dataset(container, `user_id`, App.user_id)
    write_button.textContent = `Write Again`
  }

  let users_el = DOM.el(`#show_whisper_users`)
  users_el.innerHTML = ``

  for (let user of users) {
    users_el.append(App.make_whisper_user(user, mode, () => {
      App.show_profile(user.username, user.user_id)
    }))
  }

  App.show_whisper_data = data
  let message_html = App.utilz.make_html_safe(data.message)
  message_html = App.parse_text(message_html)

  if (mode === `sent`) {
    message_html = `<div class="show_whisper_detail">You said:</div>${message_html}`
  }

  let text_el = DOM.el(`#show_whisper_text`)
  text_el.innerHTML = message_html
  App.urlize(text_el)

  if (!DOM.dataset(data.notification, `read`)) {
    let message_el = DOM.el(`.whisper_item_message`, data.notification)
    let text = message_el.textContent.replace(/\s\(unread\)$/, ``)
    message_el.textContent = text
    DOM.dataset(data.notification, `read`, true)
    App.update_whispers_unread_count()
  }

  App.msg_show_whisper.show()
}

// Sends a whisper to user(s)
App.send_whisper = (message) => {
  if (App.message_type === `system_broadcast`) {
    App.do_send_whisper({message, usernames: [], type: App.message_type})
    return true
  }

  let usernames = App.whisper_users

  if (!usernames) {
    return false
  }

  let discarded = []
  let approved = []

  for (let u of usernames) {
    let user = App.get_userlist_item_by_username(u)

    if (!user) {
      discarded.push(user.username)
    }
    else {
      approved.push(user.username)
    }
  }

  if (approved.length === 0) {
    return false
  }

  App.do_send_whisper({message, usernames: approved, type: App.message_type})
  return true
}

// Does the whisper emit
App.do_send_whisper = (data) => {
  App.socket_emit(`whisper`, data)
}

// Setups whispers
App.setup_whispers = () => {
  DOM.ev(DOM.el(`#write_whisper_send`), `click`, () => {
    App.submit_write_whisper()
  })

  DOM.ev(DOM.el(`#write_whisper_add_user`), `click`, () => {
    if (App.whisper_users.length >= App.config.max_whisper_users) {
      App.show_info(`Max whisper users reached`)
      return
    }

    App.show_userlist_window(`whisper`)
  })

  DOM.ev(DOM.el(`#show_whisper_write`), `click`, () => {
    App.msg_show_whisper.close()

    if (App.show_whisper_data.users) {
      let usernames = Array.from(App.show_whisper_data.users, x => x.username)
      App.write_whisper(usernames, `user`)
    }
    else {
      App.write_whisper([App.show_whisper_data.username], `user`)
    }
  })

  DOM.ev(DOM.el(`#start_write_whisper`), `click`, () => {
    App.write_whisper([], `user`)
  })

  DOM.ev(DOM.el(`#whispers_clear`), `click`, () => {
    App.show_confirm(`Remove all whispers from the window`, () => {
      App.clear_whispers()
    })
  })

  App.set_whispers_info()
}

// Pushes a new whisper to the whispers window
App.push_whisper = (message, on_click, read, data) => {
  let d = Date.now()
  let date = App.format_date(d)
  let item = DOM.create(`div`, `whisper_item modal_item`)
  item.title = App.nice_date(d)

  if (data.mode === `received`) {
    item.innerHTML = App.template_whisper_received({
      date,
      profilepic: App.get_profilepic(data.user_id),
      message,
    })

    if (data.user_id) {
      let pic = DOM.el(`.profilepic`, item)

      DOM.ev(pic, `error`, () => {
        App.fallback_profilepic(pic)
      })
    }
    else {
      let pic = DOM.el(`.profilepic`, item)
      DOM.hide(pic)
    }
  }
  else {
    item.innerHTML = App.template_whisper_sent({
      date,
      message,
    })
  }

  DOM.dataset(item, `date`, d)
  DOM.dataset(item, `read`, read)
  let content = DOM.el(`.whisper_item_content`, item)

  DOM.ev(content, `click`, () => {
    on_click()
  })

  let message_el = DOM.el(`.whisper_item_message`, item)

  if (read) {
    message_el.textContent = message
  }
  else {
    message_el.textContent = `${message} (unread)`
  }

  DOM.el(`#whispers_container`).prepend(item)
  let items = DOM.els(`.whisper_item`)

  if (items.length > App.config.whispers_crop_limit) {
    DOM.els(`#whispers_container .whisper_item`).at(-1).remove()
  }

  App.update_whispers_unread_count()
  let empty = DOM.el(`#whispers_container .empty_window_message`)

  if (empty) {
    empty.remove()
  }

  return item
}

// Shows information about the recent whispers
App.show_whispers = (filter = ``) => {
  App.msg_whispers.show()
  App.update_date_whispers()
  DOM.el(`#whispers_filter`).value = filter
  App.do_modal_filter()
}

// Updates the whispers unread count
App.update_whispers_unread_count = () => {
  let num = Math.min(100, App.get_unread_whispers())
  DOM.el(`#header_whispers_count`).textContent = `(${num})`
}

// Get a list of unread whispers
App.get_unread_whispers = () => {
  let num_unread = 0

  for (let el of DOM.els(`.whisper_item`)) {
    if (!DOM.dataset(el, `read`)) {
      num_unread += 1
    }
  }

  return num_unread
}

// Make whisper user
App.make_whisper_user = (user, mode, onclick) => {
  let user_el = DOM.create(`div`, `user_item`)
  user_el.innerHTML = App.template_whisper_user()
  let profilepic = DOM.el(`.show_whisper_profilepic`, user_el)

  if (user.user_id) {
    profilepic.src = App.get_profilepic(user.user_id)

    DOM.ev(profilepic, `error`, () => {
      App.fallback_profilepic(profilepic)
    })
  }
  else {
    DOM.hide(profilepic)
  }

  let username_el = DOM.el(`.show_whisper_username`, user_el)
  username_el.textContent = user.username

  if (mode === `received`) {
    username_el.textContent += ` says:`
  }

  DOM.ev(user_el, `click`, onclick)
  return user_el
}

// Clear whispers
App.clear_whispers = () => {
  App.set_whispers_info()
  App.update_whispers_unread_count()
}

// Set whispers info
App.set_whispers_info = () => {
  DOM.el(`#whispers_container`).innerHTML = App.template_whispers_info()
}

// Focus write whisper
App.focus_write_whisper = () => {
  DOM.el(`#write_whisper_area`).focus()
}