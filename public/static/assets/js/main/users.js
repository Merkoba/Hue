// This handles new users joining the room
App.user_join = (data) => {
  App.add_to_userlist({
    user_id: data.user_id,
    username: data.username,
    role: data.role,
    profilepic_version: data.profilepic_version,
    date_joined: data.date_joined,
    bio: data.bio,
    audioclip_version: data.audioclip_version,
  })

  if (data.user_id !== App.user_id) {
    App.on_activity(`join`)
  }

  if (App.open_profile_user_id === data.user_id) {
    App.show_profile(data.username, data.user_id)
  }

  if (App.started) {
    App.do_update_activity_bar = true
  }

  if (App.get_setting(`show_user_join_notifications`)) {
    App.show_room_notification(
      data.username,
      `${data.username} joined`,
      `user`,
    )
  }
}

// Updates the user count in the header and user list
App.update_usercount = () => {
  let s = `${App.utilz.singular_or_plural(App.userlist.length, `Users`)} Online`
  DOM.el(`#header_users_count`).textContent = `(${App.userlist.length})`

  if (App.userlist_mode === `normal`) {
    App.msg_userlist.set_title(s)
  }
}

// Adds a user to the user list
App.add_to_userlist = (args = {}) => {
  for (let i = 0; i < App.userlist.length; i++) {
    if (App.userlist[i].user_id === args.user_id) {
      App.userlist[i].user_id = args.user_id
      App.userlist[i].username = args.username
      App.userlist[i].role = args.role
      App.userlist[i].profilepic_version = args.profilepic_version
      App.userlist[i].bio = args.bio
      App.userlist[i].audioclip_version = args.audioclip_version
      App.userlist[i].last_activity = args.last_activity

      App.update_userlist()
      return
    }
  }

  App.userlist.push({
    user_id: args.user_id,
    username: args.username,
    role: args.role,
    profilepic_version: args.profilepic_version,
    date_joined: args.date_joined,
    bio: args.bio,
    audioclip_version: args.audioclip_version,
    last_activity: args.last_activity,
  })

  App.update_userlist()
}

// Removes a user from the user list
App.remove_from_userlist = (user_id) => {
  for (let i = 0; i < App.userlist.length; i++) {
    if (App.userlist[i].user_id === user_id) {
      App.userlist.splice(i, 1)
      App.update_userlist()
      break
    }
  }
}

// Replaces a property of a user in the userlist by username
App.replace_property_in_userlist_by_username = (
  username,
  prop,
  new_value,
  update = true,
) => {
  let item = App.get_userlist_item_by_username(username)

  if (item) {
    item[prop] = new_value

    if (update) {
      App.update_userlist(prop)
      if (App.open_profile_user_id === item.user_id) {
        App.show_profile(item.username, item.user_id)
      }
    }
  }
}

// Replaces a property of a user in the userlist by user id
App.replace_property_in_userlist_by_id = (
  user_id,
  prop,
  new_value,
  update = true,
) => {
  let item = App.get_userlist_item_by_user_id(user_id)

  if (item) {
    item[prop] = new_value

    if (update) {
      App.update_userlist(prop)
      if (App.open_profile_user_id === item.user_id) {
        App.show_profile(item.username, item.user_id)
      }
    }
  }
}

// Gets the role of a user by username
App.get_role = (username) => {
  for (let i = 0; i < App.userlist.length; i++) {
    if (App.userlist[i].username === username) {
      return App.userlist[i].role
    }
  }
}

// Gets the short form of a specified role
// These are displayed next to the usernames in the user list
App.role_tag = (p) => {
  let s

  if (p === `admin`) {
    s = `(A)`
  }
  else if (p === `op`) {
    s = `(Op)`
  }
  else if (p === `voice`) {
    s = `(V)`
  }
  else {
    s = ``
  }

  return s
}

// Gets the full proper name of a specified role
App.get_pretty_role_name = (p) => {
  let s

  if (p === `admin`) {
    s = `Admin`
  }
  else if (p === `op`) {
    s = `Op`
  }
  else if (p === `voice`) {
    s = `Voice`
  }
  else {
    s = ``
  }

  return s
}

// Gets a user from the user list by username
App.get_user_by_username = (username) => {
  for (let user of App.userlist) {
    if (user.username.toLowerCase() === username.toLowerCase()) {
      return user
    }
  }
}

// Get userlist item by username
App.get_userlist_item_by_username = (username) => {
  for (let item of App.userlist) {
    if (item.username.toLowerCase() === username.toLowerCase()) {
      return item
    }
  }
}

// Get userlist item by user id
App.get_userlist_item_by_user_id = (user_id) => {
  for (let item of App.userlist) {
    if (item.user_id === user_id) {
      return item
    }
  }
}

// Gets a user from the user list by ID
App.get_user_by_user_id = (id) => {
  for (let user of App.userlist) {
    if (user.user_id === id) {
      return user
    }
  }
}

// Handles a user list update
// Rebuilds the HTML of the user list window
App.do_update_userlist = (prop = ``) => {
  App.userlist.sort(App.compare_userlist)

  if (App.msg_userlist.is_open()) {
    let uchange = true

    if (prop) {
      uchange = false

      if (prop === `username` || prop === `profilepic` || prop === `role`) {
        uchange = true
      }
    }

    if (uchange) {
      App.update_userlist_window()
    }
  }

  App.update_usercount()
}

// Some configurations for the userlist window
App.setup_userlist_window = () => {
  DOM.ev(DOM.el(`#userlist`), `click`, (e) => {
    let el = e.target.closest(`.userlist_item`)

    if (el) {
      let username = DOM.dataset(el, `username`)
      let user_id = DOM.dataset(el, `user_id`)

      if (App.userlist_mode === `normal`) {
        App.show_profile(username, user_id)
      }
      else if (App.userlist_mode === `whisper`) {
        App.update_whisper_users(username)
      }
    }
  })
}

// Fills the userlist window with user information
App.update_userlist_window = (filter_out = []) => {
  let container = DOM.create(`div`)

  for (let i = 0; i < App.userlist.length; i++) {
    let user = App.userlist[i]

    if (filter_out.includes(user.username)) {
      continue
    }

    let pi = App.get_profilepic(user.user_id)
    let el = DOM.create(`div`, `modal_item userlist_item user_item`)
    el.innerHTML = App.template_userlist_item({profilepic: pi})

    let image = DOM.el(`.userlist_item_profilepic`, el)

    DOM.ev(image, `error`, (e) => {
      App.fallback_profilepic(image)
    })

    let role_tag = App.role_tag(user.role)
    let role_element = DOM.el(`.userlist_item_role`, el)
    role_element.textContent = role_tag
    let username = DOM.el(`.userlist_item_username`, el)
    username.textContent = user.username
    DOM.dataset(el, `username`, user.username)
    DOM.dataset(el, `user_id`, user.user_id)
    container.append(el)
  }

  DOM.el(`#userlist`).innerHTML = ``
  DOM.el(`#userlist`).append(container)

  if (App.userlist_filtered) {
    App.do_modal_filter(`userlist`)
  }
}

// Used to sort the user list by order of roles
// Admins at the top, voice at the bottom, etc
// It sorts in alphabetical order on equal roles
App.compare_userlist = (a, b) => {
  if (a.role === ``) {
    a.role = `voice`
  }

  if (b.role === ``) {
    b.role = `voice`
  }

  if (a.role === `voice` && b.role === `voice`) {
    if (a.role < b.role) {
      return 1
    }
    else if (a.role > b.role) {
      return -1
    }

    if (a.username > b.username) {
      return -1
    }
    else if (a.username < b.username) {
      return 1
    }

    return 0
  }

  if (a.role > b.role) {
    return 1
  }
  else if (a.role < b.role) {
    return -1
  }

  if (a.username < b.username) {
    return -1
  }
  else if (a.username > b.username) {
    return 1
  }

  return 0
}

// Returns true or false depending if the user is online
App.user_is_online_by_username = (username) => {
  let user = App.get_user_by_username(username)
  return Boolean(user)
}

// Checks if a user is controllable
// Basically a user's role is below the user's role
// An admin can control other admins
App.user_is_controllable = (user) => {
  if (user.user_id === App.user_id) {
    return true
  }

  if (!App.is_admin_or_op()) {
    return false
  }

  if (
    (user.role === `admin` || user.role === `op`) &&
    App.role !== `admin`
  ) {
    return false
  }

  return true
}

// Shows the user list window
App.show_userlist_window = (mode = `normal`, filter = ``) => {
  App.userlist_mode = mode

  if (mode === `normal`) {
    App.update_usercount()
    App.update_userlist_window()
  }
  else if (mode === `whisper`) {
    App.msg_userlist.set_title(`Add User`)
    App.update_userlist_window(App.whisper_users)
  }

  App.msg_userlist.show()

  if (filter.trim()) {
    DOM.el(`#userlist_filter`).value = filter
    App.do_modal_filter()
  }
}

// Sorts a user list by activity date
App.sort_userlist_by_activity = (a, b) => {
  if (a.last_activity > b.last_activity) {
    return -1
  }

  if (a.last_activity < b.last_activity) {
    return 1
  }

  return 0
}

// Sorts a user list by activity username
App.sort_userlist_by_username = (a, b) => {
  if (a.username.toLowerCase() < b.username.toLowerCase()) {
    return -1
  }

  if (a.username.toLowerCase() > b.username.toLowerCase()) {
    return 1
  }

  return 0
}

// Updates the profile image of a user in the userlist
App.update_user_profilepic = (id, version) => {
  for (let i = 0; i < App.userlist.length; i++) {
    let user = App.userlist[i]

    if (user.user_id === id) {
      App.userlist[i].profilepic_version = version
      return
    }
  }
}

// What to do when a user disconnects
App.user_disconnect = (data) => {
  if (App.get_setting(`show_user_leave_notifications`)) {
    App.show_room_notification(
      data.username,
      `${data.username} left`,
      `user-disconnect`,
    )
  }

  App.remove_from_userlist(data.user_id)

  let type = data.disconnection_type

  if (type === `banned`) {
    if (App.msg_ban_list.is_open()) {
      App.request_ban_list()
    }
  }

  if (App.open_profile_username === data.username) {
    App.show_profile(data.username, data.user_id)
  }

  App.do_update_activity_bar = true
}

// Announces that the operation cannot be applied to a certain user
// This is usually because the user's role is not low enough
App.forbidden_user = () => {
  App.checkmsg(`That operation is forbidden on that user`)
}

// Announces username changes
App.announce_new_username = (data) => {
  App.replace_property_in_userlist_by_username(
    data.old_username,
    `username`,
    data.username,
  )

  if (App.username === data.old_username) {
    App.set_username(data.username)

    App.show_room_notification(
      data.username,
      `You are now known as ${data.username}`,
    )

    App.update_input_placeholder()
  }
  else {
    App.show_room_notification(
      data.username,
      `${data.old_username} is now known as ${data.username}`,
    )
  }

  if (App.msg_admin_list.is_open()) {
    App.request_admin_list()
  }

  App.update_activity_bar()
}

// Returns feedback on wether a user is in the room or not
App.user_not_in_room = (username) => {
  if (username) {
    App.checkmsg(`${username} is not in the room`)
  }
  else {
    App.checkmsg(`User is not in the room`)
  }
}

// Returns a list of usernames matched by a string
// It splits and joins the string until a user in the user list matches
// Or returns an empty array
App.get_matching_usernames = (s) => {
  let user = App.get_user_by_username(s)

  if (user) {
    return [user.username]
  }

  let split = s.split(` `)
  let username = split[0]
  let matches = []

  for (let i = 0; i < split.length; i++) {
    if (i > 0) {
      username = `${username} ${split[i]}`
    }

    let user = App.get_userlist_item_by_username(username)

    if (user) {
      matches.push(username)
    }
  }

  return matches
}

// Setups user profile windows
App.setup_show_profile = () => {
  DOM.ev(DOM.el(`#show_profile_mention`), `click`, () => {
    App.mention_user(App.open_profile_username)
    App.msg_profile.close()
  })

  DOM.ev(DOM.el(`#show_profile_whisper`), `click`, () => {
    App.write_whisper([App.open_profile_username])
    App.msg_profile.close()
  })

  DOM.ev(DOM.el(`#show_profile_sync_tv`), `click`, () => {
    App.sync_tv(App.open_profile_username)
    App.msg_profile.close()
  })

  DOM.ev(DOM.el(`#show_profile_profilepic`), `click`, () => {
    if (App.audioclip) {
      App.stop_audioclip()
    }
    else {
      App.play_audioclip()
    }
  })

  let pic = DOM.el(`#show_profile_profilepic`)

  DOM.ev(pic, `error`, () => {
    App.fallback_profilepic(pic)
  })

  DOM.ev(DOM.el(`#show_profile_search`), `click`, () => {
    App.show_user_messages(App.open_profile_username)
    App.msg_profile.close()
  })

  DOM.ev(DOM.el(`#show_profile_posts`), `click`, () => {
    App.show_message_board(`$user ${App.open_profile_username} `)
    App.msg_profile.close()
  })

  DOM.ev(DOM.el(`#show_profile_edit`), `click`, () => {
    App.show_user_profile()
    App.msg_profile.close()
  })

  DOM.ev(DOM.el(`#show_profile_change_role`), `click`, () => {
    App.change_role_username = App.open_profile_username
    App.msg_change_role.show()
  })

  DOM.ev(DOM.el(`#show_profile_kick`), `click`, () => {
    App.show_confirm(`Disconnect the user from the room`, () => {
      App.kick(App.open_profile_username)
    })
  })

  DOM.ev(DOM.el(`#show_profile_ban`), `click`, () => {
    App.show_confirm(`Ban the user from joining the room`, () => {
      App.ban(App.open_profile_username)
    })
  })
}

// Stars the profile audio
App.play_audioclip = (user_id = App.open_profile_user_id) => {
  App.stop_audioclip()
  App.audioclip = DOM.create(`audio`)

  App.audioclip.onended = () => {
    App.stop_audioclip()
  }

  DOM.ev(App.audioclip, `error`, (e) => {
    if (App.audioclip) {
      App.show_info(`User has no audioclip`)
      App.stop_audioclip()
    }
  })

  App.audioclip.src = App.get_audioclip(user_id)
  App.audioclip.play()
}

// Stops the profile audio
App.stop_audioclip = () => {
  if (App.audioclip) {
    App.audioclip.pause()
    App.audioclip = undefined
  }
}

// Shows a user's profile window
App.show_profile = (username, user_id = false) => {
  let id
  let role = `Offline`
  let bio = ``
  let user = false

  if (user_id) {
    user = App.get_user_by_user_id(user_id)
  }
  else if (username) {
    user = App.get_user_by_username(username)
  }

  if (user_id) {
    id = user_id
  }
  else if (user) {
    id = user.user_id
  }

  let same_user = false

  if (user) {
    same_user = user.user_id === App.user_id
    DOM.el(`#show_profile_details`).style.display = `block`
    role = App.get_pretty_role_name(user.role)
    bio = user.bio
    username = user.username
    App.open_profile_user = user
  }
  else {
    DOM.hide(`#show_profile_details`)
  }

  App.open_profile_user_id = id
  App.open_profile_username = username
  let pi = App.get_profilepic(id)
  DOM.el(`#show_profile_role`).textContent = `Role: ${role}`

  DOM.el(`#show_profile_bio`).innerHTML =
    App.utilz.make_html_safe(bio).replace(/\n+/g, ` <br> `)
  App.urlize(DOM.el(`#show_profile_bio`))

  DOM.el(`#show_profile_profilepic`).src = pi

  if (username) {
    DOM.show(`#show_profile_buttons`)
  }
  else {
    DOM.hide(`#show_profile_buttons`)
  }

  if (user) {
    DOM.show(`#show_profile_whisper`)
    DOM.show(`#show_profile_sync_tv`)
  }
  else {
    DOM.hide(`#show_profile_whisper`)
    DOM.hide(`#show_profile_sync_tv`)
  }

  DOM.dataset(DOM.el(`#show_profile_change_role`), `username`, username)

  if (username && App.is_admin_or_op() && !same_user) {
    DOM.show(`#show_profile_op_buttons`)
  }
  else {
    DOM.hide(`#show_profile_op_buttons`)
  }

  DOM.el(`#show_profile_info`).innerHTML = ``
  DOM.hide(`#show_profile_edit`)

  if (user) {
    let item = DOM.create(`div`)
    let nicedate = App.nice_date(user.date_joined)
    let timeago = App.utilz.timeago(user.date_joined)
    item.textContent = `Got Online: ${timeago}`
    item.title = nicedate
    DOM.el(`#show_profile_info`).append(item)

    if (same_user) {
      DOM.show(`#show_profile_edit`)
    }
  }

  let item = DOM.create(`div`)
  item.textContent = `ID: ${id}`
  DOM.el(`#show_profile_info`).append(item)
  App.msg_profile.set_title(username || ``)
  App.msg_profile.show()
}

// Announces a user's profile image change
App.profilepic_changed = (data) => {
  let user = App.get_user_by_user_id(data.user_id)

  if (!user) {
    return
  }

  App.update_user_profilepic(data.user_id, data.profilepic_version)
  let src = App.get_profilepic(data.user_id)

  if (data.user_id === App.user_id) {
    DOM.el(`#user_profile_profilepic`).src = src
  }

  App.show_room_notification(
    user.username,
    `${user.username} changed their profile image`,
  )

  App.update_activity_bar_profilepic(data.user_id, src)
}

// When any user changes their bio
App.bio_changed = (data) => {
  App.replace_property_in_userlist_by_username(data.username, `bio`, data.bio)

  if (data.username === App.username) {
    App.set_bio(data.bio)
  }

  if (data.bio) {
    App.show_room_notification(
      data.username,
      `${data.username} changed their bio`,
    )
  }
}

// Changes a user's role
App.change_role = (username, role) => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (username.length > 0 && username.length <= App.config.max_max_username_length) {
    if (username === App.username) {
      App.checkmsg(`You can't assign a role to yourself`)
      return
    }

    if ((role === `admin` || role === `op`) && App.role !== `admin`) {
      App.forbidden_user()
      return
    }

    if (!App.roles.includes(role)) {
      App.checkmsg(`Invalid role`)
      return
    }

    App.socket_emit(`change_role`, {username, role})
  }
}

// Announces a user's role change
App.announce_role_change = (data) => {
  if (App.username === data.username2) {
    App.set_role(data.role)
  }

  App.show_room_notification(
    data.username1,
    `${data.username1} gave ${data.role} to ${data.username2}`,
  )
  App.replace_property_in_userlist_by_username(
    data.username2,
    `role`,
    data.role,
  )

  if (App.msg_admin_list.is_open()) {
    App.request_admin_list()
  }
}

// Role setter for user
App.set_role = (rol, config = true) => {
  App.role = rol

  if (config) {
    App.config_room_config()
    App.config_main_menu()
  }

  DOM.el(`#user_profile_role`).textContent = `(${App.get_pretty_role_name(rol)})`
  App.setup_message_board_permissions()
}

// Bans a user
App.ban = (username) => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (username.length > 0 && username.length <= App.config.max_max_username_length) {
    if (username === App.username) {
      App.checkmsg(`You can't ban yourself`)
      return
    }

    App.socket_emit(`ban`, {username})
  }
}

// Unbans a user
App.unban = (username) => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (username.length > 0 && username.length <= App.config.max_max_username_length) {
    if (username === App.username) {
      App.checkmsg(`You can't unban yourself`)
      return
    }

    App.socket_emit(`unban`, {username})
  }
}

// Shows a window with the number of users banned
App.receive_ban_count = (data) => {
  let s

  if (data.count === 1) {
    s = `There is ${data.count} user banned`
  }
  else {
    s = `There are ${data.count} users banned`
  }

  App.checkmsg(s)
}

// Kicks a user
App.kick = (username) => {
  if (!App.is_admin_or_op()) {
    return
  }

  if (username.length > 0 && username.length <= App.config.max_max_username_length) {
    if (username === App.username) {
      App.checkmsg(`You can't kick yourself`)
      return
    }

    if (!App.check_user_in_room(username)) {
      return
    }

    let rol = App.get_role(username)

    if ((rol === `admin` || rol === `op`) && App.role !== `admin`) {
      App.forbidden_user()
      return
    }

    App.socket_emit(`kick`, {username})
  }
}

// Announces that a user was banned
App.announce_ban = (data) => {
  App.show_room_notification(
    data.username1,
    `${data.username1} banned ${data.username2}`,
  )

  if (App.msg_ban_list.is_open()) {
    App.request_ban_list()
  }
}

// Announces that a user was unbanned
App.announce_unban = (data) => {
  App.show_room_notification(
    data.username1,
    `${data.username1} unbanned ${data.username2}`,
  )

  if (App.msg_ban_list.is_open()) {
    App.request_ban_list()
  }
}

// Checks if a user already has a certain role
App.is_already = (who, what) => {
  App.checkmsg(`${who} already has ${what}`)
}

// Checks if a role is that of an admin or an operator
// Without arguments it checks the user's role
App.is_admin_or_op = (user) => {
  let r = user ? user.role : App.role
  return r === `admin` || r === `op`
}

// Checks if a role is that of an admin
App.is_admin = (user) => {
  let r = user ? user.role : App.role
  return r === `admin`
}

// Superuser command to change to any role
App.annex = (rol = `admin`) => {
  if (!App.roles.includes(rol)) {
    App.checkmsg(`Invalid role`)
    return
  }

  App.show_confirm(`Run superuser command`, () => {
    App.socket_emit(`annex`, {username: App.username, role: rol})
  })
}

// Superuser command to send a system broadcast
App.system_broadcast = () => {
  App.show_confirm(`Run superuser command`, () => {
    App.write_whisper([], `system_broadcast`)
  })
}

// If username is valid and it is not in all_usernames add it
App.push_to_all_usernames = (username) => {
  if (username) {
    if (!App.all_usernames.includes(username)) {
      App.all_usernames.push(username)

      if (App.all_usernames.length > 1000) {
        App.all_usernames.shift()
      }
    }
  }
}

// When a user changes the audio audio clip
App.audioclip_changed = (data) => {
  let user = App.get_user_by_user_id(data.user_id)

  App.replace_property_in_userlist_by_id(
    data.user_id,
    `audioclip`,
    data.audioclip,
    false,
  )

  App.replace_property_in_userlist_by_id(
    data.user_id,
    `audioclip_version`,
    data.audioclip_version,
    false,
  )

  if (data.user_id === App.open_profile_user.user_id) {
    App.show_profile(data.username, data.user_id)
  }

  App.show_room_notification(
    data.username,
    `${user.username} changed their audio clip`,
  )
}

// Superuser command to change a user's username
App.modusername = (arg) => {
  let original_username, new_username

  if (arg.includes(` > `)) {
    let split = arg.split(` > `)

    if (split.length !== 2) {
      return
    }

    original_username = split[0].trim()
    new_username = split[1].trim()
  }
  else {
    let split = arg.split(` `)

    if (split.length !== 2) {
      return
    }

    original_username = split[0].trim()
    new_username = split[1].trim()
  }

  if (!original_username || !new_username) {
    return
  }

  if (original_username === new_username) {
    return
  }

  if (new_username.length > App.config.max_username_length) {
    App.checkmsg(`Username is too long`)
    return
  }

  if (App.utilz.clean_username(new_username) !== new_username) {
    App.checkmsg(`Username contains invalid characters`)
    return
  }

  App.show_confirm(`Run superuser command`, () => {
    App.socket_emit(`modusername`, {original: original_username, new: new_username})
  })
}

// Superuser command to change a user's password
App.modpassword = (arg) => {
  let split = arg.split(` `).filter(x => x !== ``)

  if (split.length !== 2) {
    return
  }

  let username = split[0]
  let password = split[1]

  if (password.length < App.config.min_password_length) {
    App.checkmsg(
      `Password is too short. It must be at least ${App.config.min_password_length} characters long`,
    )

    return
  }

  if (password.length > App.config.max_password_length) {
    App.checkmsg(`Password is too long`)
    return
  }

  App.show_confirm(`Run superuser command`, () => {
    App.socket_emit(`modpassword`, {username, password})
  })
}

// Updates user activity to current date
App.update_user_activity = (user_id) => {
  let user = App.get_user_by_user_id(user_id)
  user.last_activity = Date.now()
  App.do_update_activity_bar = true
}

// Get a profilepic path
App.get_profilepic = (user_id) => {
  let pi = `${App.config.public_media_directory}/user/${user_id}/profilepic.png`
  let user = App.get_user_by_user_id(user_id)

  if (user) {
    pi += `?ver=${user.profilepic_version}`
  }

  return pi
}

// Get audioclip path
App.get_audioclip = (user_id) => {
  let pi = `${App.config.public_media_directory}/user/${user_id}/audioclip.mp3`
  let user = App.get_user_by_user_id(user_id)

  if (user) {
    pi += `?ver=${user.audioclip_version}`
  }

  return pi
}

// Checks if a user is in the room
App.check_user_in_room = (username) => {
  let user = App.get_user_by_username(username)

  if (!user) {
    App.user_not_in_room(username)
    return
  }

  return user.username
}

// Show user posts
App.show_user_messages = (username = App.username) => {
  App.show_chat_search(`$user ${username} `)
}

// Apply fallback profilepic
App.fallback_profilepic = (el) => {
  if (el.src !== App.config.profilepic_loading_url) {
    el.src = App.config.profilepic_loading_url
  }
}

// Setup change role
App.setup_change_role = () => {
  DOM.ev(DOM.el(`#change_role_admin`), `click`, () => {
    App.show_confirm(`Operator abilities plus can add/remove operators`, () => {
      App.change_role(App.change_role_username, `admin`)
    })

    App.msg_change_role.close()
  })

  DOM.ev(DOM.el(`#change_role_op`), `click`, () => {
    App.show_confirm(`Enable access to operator features and commands`, () => {
      App.change_role(App.change_role_username, `op`)
    })

    App.msg_change_role.close()
  })

  DOM.ev(DOM.el(`#change_role_voice`), `click`, () => {
    App.show_confirm(`Can interact with users and change media but no operator abilities`, () => {
      App.change_role(App.change_role_username, `voice`)
    })

    App.msg_change_role.close()
  })
}

App.update_userlist = (prop) => {
  App.update_userlist_debouncer.call(prop)
}

App.mention_user = (username) => {
  let new_input = App.get_input().trim() + ` ${username}`
  App.change_input(new_input.trim())
}