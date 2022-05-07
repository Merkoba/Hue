// This handles new users joining the room
Hue.user_join = function (data) {
  Hue.add_to_userlist({
    user_id: data.user_id,
    username: data.username,
    role: data.role,
    profilepic_version: data.profilepic_version,
    date_joined: data.date_joined,
    bio: data.bio,
    audioclip_version: data.audioclip_version
  })

  if(data.user_id !== Hue.user_id) {
    Hue.on_activity("join")
  }

  if (Hue.open_profile_user_id === data.user_id) {
    Hue.show_profile(data.username, data.user_id)
  }

  if (Hue.started) {
    Hue.do_update_activity_bar = true
  }

  if (Hue.get_setting("show_user_join_notifications")) {
    Hue.show_room_notification(
      data.username,
      `${data.username} joined`,
      "user"
    )
  }
}

// Updates the user count in the header and user list
Hue.update_usercount = function () {
  let s = `${Hue.utilz.singular_or_plural(Hue.userlist.length, "Users")} Online`

  Hue.el("#header_users_count").textContent = `(${Hue.userlist.length})`

  if (Hue.userlist_mode === "normal") {
    Hue.msg_userlist.set_title(s)
  }
}

// Adds a user to the user list
Hue.add_to_userlist = function (args = {}) {
  let def_args = {
    user_id: false,
    username: false,
    role: false,
    profilepic_version: false,
    date_joined: false,
    bio: "",
    audioclip_version: false,
    last_activity: 0
  }

  args = Object.assign(def_args, args)

  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].user_id === args.user_id) {
      Hue.userlist[i].user_id = args.user_id
      Hue.userlist[i].username = args.username
      Hue.userlist[i].role = args.role
      Hue.userlist[i].profilepic_version = args.profilepic_version
      Hue.userlist[i].bio = args.bio
      Hue.userlist[i].audioclip_version = args.audioclip_version
      Hue.userlist[i].last_activity = args.last_activity

      Hue.update_userlist()
      return false
    }
  }

  Hue.userlist.push({
    user_id: args.user_id,
    username: args.username,
    role: args.role,
    profilepic_version: args.profilepic_version,
    date_joined: args.date_joined,
    bio: args.bio,
    audioclip_version: args.audioclip_version,
    last_activity: args.last_activity
  })

  Hue.update_userlist()
  return true
}

// Removes a user from the user list
Hue.remove_from_userlist = function (user_id) {
  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].user_id === user_id) {
      Hue.userlist.splice(i, 1)
      Hue.update_userlist()
      break
    }
  }
}

// Replaces a property of a user in the userlist by username
Hue.replace_property_in_userlist_by_username = function (
  username,
  prop,
  new_value,
  update = true
) {
  let item = Hue.get_userlist_item_by_username(username)

  if (item) {
    item[prop] = new_value

    if (update) {
      Hue.update_userlist(prop)
      if (Hue.open_profile_user_id === item.user_id) {
        Hue.show_profile(item.username, item.user_id)
      }
    }
  }
}

// Replaces a property of a user in the userlist by user id
Hue.replace_property_in_userlist_by_id = function (
  user_id,
  prop,
  new_value,
  update = true
) {
  let item = Hue.get_userlist_item_by_user_id(user_id)

  if (item) {
    item[prop] = new_value

    if (update) {
      Hue.update_userlist(prop)
      if (Hue.open_profile_user_id === item.user_id) {
        Hue.show_profile(item.username, item.user_id)
      }
    }
  } 
}

// Gets the role of a user by username
Hue.get_role = function (username) {
  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].username === username) {
      return Hue.userlist[i].role
    }
  }
}

// Gets the short form of a specified role
// These are displayed next to the usernames in the user list
Hue.role_tag = function (p) {
  let s

  if (p === "admin") {
    s = "(A)"
  } else if (p === "op") {
    s = "(Op)"
  } else if (p === "voice") {
    s = "(V)"
  } else {
    s = ""
  }

  return s
}

// Gets the full proper name of a specified role
Hue.get_pretty_role_name = function (p) {
  let s

  if (p === "admin") {
    s = "Admin"
  } else if (p === "op") {
    s = "Op"
  } else if (p === "voice") {
    s = "Voice"
  } else {
    s = ""
  }

  return s
}

// Gets a user from the user list by username
Hue.get_user_by_username = function (username) {
  for (let user of Hue.userlist) {
    if (user.username.toLowerCase() === username.toLowerCase()) {
      return user
    }
  }

  return false
}

// Get userlist item by username
Hue.get_userlist_item_by_username =  function (username) {
  for (let item of Hue.userlist) {
    if (item.username.toLowerCase() === username.toLowerCase()) {
      return item
    }
  }

  return false
}

// Get userlist item by user id
Hue.get_userlist_item_by_user_id =  function (user_id) {
  for (let item of Hue.userlist) {
    if (item.user_id === user_id) {
      return item
    }
  }

  return false
}

// Gets a user from the user list by ID
Hue.get_user_by_user_id = function (id) {
  for (let user of Hue.userlist) {
    if (user.user_id === id) {
      return user
    }
  }

  return false
}

// Handles a user list update
// Rebuilds the HTML of the user list window
Hue.do_update_userlist = function (prop = "") {
  Hue.userlist.sort(Hue.compare_userlist)
  
  if (Hue.msg_userlist.is_open()) {
    let uchange = true

    if (prop) {
      uchange = false

      if (prop === "username" || prop === "profilepic" || prop === "role") {
        uchange = true
      }
    }

    if (uchange) {
      Hue.update_userlist_window()
    }
  }

  Hue.update_usercount()
}

// Some configurations for the userlist window
Hue.setup_userlist_window = function () {
  Hue.el("#userlist").addEventListener("click", function (e) {
    let el = e.target.closest(".userlist_item")

    if (el) {
      let username = Hue.dataset(el, "username")
      let user_id = Hue.dataset(el, "user_id")

      if (Hue.userlist_mode === "normal") {
        Hue.show_profile(username, user_id)
      } else if (Hue.userlist_mode === "whisper") {
        Hue.update_whisper_users(username)
      }
    }
  })
}

// Fills the userlist window with user information
Hue.update_userlist_window = function (filter_out = []) {
  let container = Hue.div()

  for (let i = 0; i < Hue.userlist.length; i++) {
    let user = Hue.userlist[i]

    if (filter_out.includes(user.username)) {
      continue
    }

    let pi = Hue.get_profilepic(user.user_id)
    let el = Hue.div("modal_item userlist_item user_item")
    el.innerHTML = Hue.template_userlist_item({profilepic: pi})

    let image = Hue.el(".userlist_item_profilepic", el)

    image.addEventListener("error", function (e) {
      Hue.fallback_profilepic(this)
    })

    let role_tag = Hue.role_tag(user.role)
    let role_element = Hue.el(".userlist_item_role", el)
    role_element.textContent = role_tag
    let username = Hue.el(".userlist_item_username", el)
    username.textContent = user.username
    Hue.dataset(el, "username", user.username)
    Hue.dataset(el, "user_id", user.user_id)
    container.append(el)
  }

  Hue.el("#userlist").innerHTML = ""
  Hue.el("#userlist").append(container)

  if (Hue.userlist_filtered) {
    Hue.do_modal_filter("userlist")
  }
}

// Used to sort the user list by order of roles
// Admins at the top, voice at the bottom, etc
// It sorts in alphabetical order on equal roles
Hue.compare_userlist = function (a, b) {
  if (a.role === "") {
    a.role = "voice"
  }

  if (b.role === "") {
    b.role = "voice"
  }

  if (a.role === "voice" && b.role === "voice") {
    if (a.role < b.role) {
      return 1
    } else if (a.role > b.role) {
      return -1
    }

    if (a.username > b.username) {
      return -1
    } else if (a.username < b.username) {
      return 1
    } else {
      return 0
    }
  } else {
    if (a.role > b.role) {
      return 1
    } else if (a.role < b.role) {
      return -1
    }

    if (a.username < b.username) {
      return -1
    } else if (a.username > b.username) {
      return 1
    } else {
      return 0
    }
  }
}

// Returns true or false depending if the user is online
Hue.user_is_online_by_username = function (username) {
  let user = Hue.get_user_by_username(username)
  return Boolean(user)
}

// Checks if a user is controllable
// Basically a user's role is below the user's role
// An admin can control other admins
Hue.user_is_controllable = function (user) {
  if (user.user_id === Hue.user_id) {
    return true
  }

  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (
    (user.role === "admin" || user.role === "op") &&
    Hue.role !== "admin"
  ) {
    return false
  }

  return true
}

// Shows the user list window
Hue.show_userlist_window = function (mode = "normal", filter = "") {
  Hue.userlist_mode = mode

  if (mode === "normal") {
    Hue.update_usercount()
    Hue.update_userlist_window()
  } else if (mode === "whisper") {
    Hue.msg_userlist.set_title("Add User")
    Hue.update_userlist_window(Hue.whisper_users)
  }

  Hue.msg_userlist.show(function () {
    if (filter.trim()) {
      Hue.el("#userlist_filter").value = filter
      Hue.do_modal_filter()
    }
  })
}

// Sorts a user list by activity date
Hue.sort_userlist_by_activity = function (a, b) {
  if (a.last_activity > b.last_activity) {
    return -1
  }

  if (a.last_activity < b.last_activity) {
    return 1
  }

  return 0
}


// Sorts a user list by activity username
Hue.sort_userlist_by_username = function (a, b) {
  if (a.username.toLowerCase() < b.username.toLowerCase()) {
    return -1
  }

  if (a.username.toLowerCase() > b.username.toLowerCase()) {
    return 1
  }

  return 0
}

// Updates the profile image of a user in the userlist
Hue.update_user_profilepic = function (id, version) {
  for (let i = 0; i < Hue.userlist.length; i++) {
    let user = Hue.userlist[i]

    if (user.user_id === id) {
      Hue.userlist[i].profilepic_version = version
      return
    }
  }
}

// What to do when a user disconnects
Hue.user_disconnect = function (data) {
  if (Hue.get_setting("show_user_leave_notifications")) {
    Hue.show_room_notification(
      data.username,
      `${data.username} left`,
      "user-disconnect"
    )
  }
  
  Hue.remove_from_userlist(data.user_id)

  let type = data.disconnection_type

  if (type === "banned") {
    if (Hue.msg_ban_list.is_open()) {
      Hue.request_ban_list()
    }
  }

  if (Hue.open_profile_username === data.username) {
    Hue.show_profile(data.username, data.user_id)
  }

  Hue.do_update_activity_bar = true  
}

// Announces that the operation cannot be applied to a certain user
// This is usually because the user's role is not low enough
Hue.forbidden_user = function () {
  Hue.checkmsg("That operation is forbidden on that user")
}

// Announces username changes
Hue.announce_new_username = function (data) {
  Hue.replace_property_in_userlist_by_username(
    data.old_username,
    "username",
    data.username
  )

  if (Hue.username === data.old_username) {
    Hue.set_username(data.username)

    Hue.show_room_notification(
      data.username,
      `You are now known as ${data.username}`
    )

    Hue.update_input_placeholder()
  } else {
    Hue.show_room_notification(
      data.username,
      `${data.old_username} is now known as ${data.username}`
    )
  }

  if (Hue.msg_admin_list.is_open()) {
    Hue.request_admin_list()
  }

  Hue.update_activity_bar()
}

// Returns feedback on wether a user is in the room or not
Hue.user_not_in_room = function (username) {
  if (username) {
    Hue.checkmsg(`${username} is not in the room`)
  } else {
    Hue.checkmsg("User is not in the room")
  }
}

// Returns a list of usernames matched by a string
// It splits and joins the string until a user in the user list matches
// Or returns an empty array
Hue.get_matching_usernames = function (s) {
  let user = Hue.get_user_by_username(s)

  if (user) {
    return [user.username]
  }

  let split = s.split(" ")
  let username = split[0]
  let matches = []

  for (let i = 0; i < split.length; i++) {
    if (i > 0) {
      username = `${username} ${split[i]}`
    }

    let user = Hue.get_userlist_item_by_username(username)

    if (user) {
      matches.push(username)
    }
  }

  return matches
}

// Setups user profile windows
Hue.setup_show_profile = function () {
  Hue.el("#show_profile_whisper").addEventListener("click", function () {
    Hue.write_whisper([Hue.open_profile_username])
    Hue.msg_profile.close()
  })

  Hue.el("#show_profile_sync_tv").addEventListener("click", function () {
    Hue.sync_tv(Hue.open_profile_username)
    Hue.msg_profile.close()
  })

  Hue.el("#show_profile_profilepic").addEventListener("click", function () {
    if (Hue.audioclip) {
      Hue.stop_audioclip()
    } else {
      Hue.play_audioclip()
    }
  })

  Hue.el("#show_profile_profilepic").addEventListener("error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.el("#show_profile_search").addEventListener("click", function () {
    Hue.show_user_messages(Hue.open_profile_username)
    Hue.msg_profile.close()
  })

  Hue.el("#show_profile_posts").addEventListener("click", function () {
    Hue.show_message_board(`$user ${Hue.open_profile_username} `)
    Hue.msg_profile.close()
  })

  Hue.el("#show_profile_edit").addEventListener("click", function () {
    Hue.show_user_profile()
    Hue.msg_profile.close()
  })

  Hue.el("#show_profile_change_role").addEventListener("click", function () {
    Hue.change_role_username = Hue.open_profile_username
    Hue.msg_change_role.show()
  })

  Hue.el("#show_profile_kick").addEventListener("click", function () {
    Hue.show_confirm("Disconnect the user from the room", function () {
      Hue.kick(Hue.open_profile_username)
    })
  })

  Hue.el("#show_profile_ban").addEventListener("click", function () {
    Hue.show_confirm("Ban the user from joining the room", function () {
      Hue.ban(Hue.open_profile_username)
    })
  })
}

// Stars the profile audio
Hue.play_audioclip = function (user_id = Hue.open_profile_user_id) {
  Hue.stop_audioclip()
  Hue.audioclip = document.createElement("audio")

  Hue.audioclip.onended = function () {
    Hue.stop_audioclip()
  }

  Hue.audioclip.addEventListener("error", function (e) {
    if (Hue.audioclip) {
      Hue.show_info("User has no audioclip")
      Hue.stop_audioclip()
    }
  })

  Hue.audioclip.src = Hue.get_audioclip(user_id)
  Hue.audioclip.play()
}

// Stops the profile audio
Hue.stop_audioclip = function () {
  if (Hue.audioclip) {
    Hue.audioclip.pause()
    Hue.audioclip = undefined
  }
}

// Shows a user's profile window
Hue.show_profile = function (username, user_id = false) {
  let id
  let role = "Offline"
  let bio = ""
  let user = false

  if (user_id) {
    user = Hue.get_user_by_user_id(user_id)
  } else if (username) {
    user = Hue.get_user_by_username(username)
  }

  if (user_id) {
    id = user_id
  } else if (user) {
    id = user.user_id
  }

  let same_user = false

  if (user) {
    same_user = user.user_id === Hue.user_id
    Hue.el("#show_profile_details").style.display = "block"
    role = Hue.get_pretty_role_name(user.role)
    bio = user.bio
    username = user.username
    Hue.open_profile_user = user
  } else {
    Hue.el("#show_profile_details").style.display = "none"
  }

  Hue.open_profile_user_id = id
  Hue.open_profile_username = username
  let pi = Hue.get_profilepic(id)
  Hue.el("#show_profile_role").textContent = `Role: ${role}`

  Hue.el("#show_profile_bio").innerHTML =
    Hue.utilz.make_html_safe(bio).replace(/\n+/g, " <br> ")
  Hue.urlize(Hue.el("#show_profile_bio"))

  Hue.el("#show_profile_profilepic").src = pi

  if (user) {
    Hue.el("#show_profile_whisper").style.display = "block"
    Hue.el("#show_profile_sync_tv").style.display = "flex"
  } else {
    Hue.el("#show_profile_whisper").style.display = "none"
    Hue.el("#show_profile_sync_tv").style.display = "none"
  }

  Hue.dataset(Hue.el("#show_profile_change_role"), "username", username)

  if (Hue.is_admin_or_op() && !same_user) {
    Hue.el("#show_profile_op_buttons").classList.remove("nodisplay")
  } else {
    Hue.el("#show_profile_op_buttons").classList.add("nodisplay")
  }

  Hue.el("#show_profile_info").innerHTML = ""
  Hue.el("#show_profile_edit").classList.add("nodisplay")

  if (user) {
    let item = Hue.div()
    let nicedate = Hue.utilz.nice_date(user.date_joined)
    let timeago = Hue.utilz.timeago(user.date_joined)
    item.textContent = `Got Online: ${timeago}`
    item.title = nicedate
    Hue.el("#show_profile_info").append(item)
    
    if (same_user) {
      Hue.el("#show_profile_edit").classList.remove("nodisplay")
    }
  }

  let item = Hue.div()
  item.textContent = `ID: ${id}`
  Hue.el("#show_profile_info").append(item)
  Hue.msg_profile.set_title(username)
  Hue.msg_profile.show()
}

// Announces a user's profile image change
Hue.profilepic_changed = function (data) {
  let user = Hue.get_user_by_user_id(data.user_id)

  if (!user) {
    return false
  }

  Hue.update_user_profilepic(data.user_id, data.profilepic_version)
  let src = Hue.get_profilepic(data.user_id)

  if (data.user_id === Hue.user_id) {
    Hue.el("#user_profile_profilepic").src = src
  }

  Hue.show_room_notification(
    user.username,
    `${user.username} changed their profile image`
  )

  Hue.update_activity_bar_profilepic(data.user_id, src)
}

// When any user changes their bio
Hue.bio_changed = function (data) {
  Hue.replace_property_in_userlist_by_username(data.username, "bio", data.bio)

  if (data.username === Hue.username) {
    Hue.set_bio(data.bio)
  }

  if (data.bio) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed their bio`
    )
  }
}

// Changes a user's role
Hue.change_role = function (username, role) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (username.length > 0 && username.length <= Hue.config.max_max_username_length) {
    if (username === Hue.username) {
      Hue.checkmsg("You can't assign a role to yourself")
      return false
    }

    if ((role === "admin" || role === "op") && Hue.role !== "admin") {
      Hue.forbidden_user()
      return false
    }

    if (!Hue.roles.includes(role)) {
      Hue.checkmsg("Invalid role")
      return false
    }

    Hue.socket_emit("change_role", { username: username, role: role })
  }
}

// Announces a user's role change
Hue.announce_role_change = function (data) {
  if (Hue.username === data.username2) {
    Hue.set_role(data.role)
  }

  Hue.show_room_notification(
    data.username1,
    `${data.username1} gave ${data.role} to ${data.username2}`
  )
  Hue.replace_property_in_userlist_by_username(
    data.username2,
    "role",
    data.role
  )

  if (Hue.msg_admin_list.is_open()) {
    Hue.request_admin_list()
  }
}

// Role setter for user
Hue.set_role = function (rol, config = true) {
  Hue.role = rol
  
  if (config) {
    Hue.config_room_config()
    Hue.config_main_menu()
  }

  Hue.el("#user_profile_role").textContent = `(${Hue.get_pretty_role_name(rol)})`
  Hue.setup_message_board_permissions()
}

// Bans a user
Hue.ban = function (username) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (username.length > 0 && username.length <= Hue.config.max_max_username_length) {
    if (username === Hue.username) {
      Hue.checkmsg("You can't ban yourself")
      return false
    }

    Hue.socket_emit("ban", { username: username })
  }
}

// Unbans a user
Hue.unban = function (username) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (username.length > 0 && username.length <= Hue.config.max_max_username_length) {
    if (username === Hue.username) {
      Hue.checkmsg("You can't unban yourself")
      return false
    }

    Hue.socket_emit("unban", { username: username })
  }
}

// Shows a window with the number of users banned
Hue.receive_ban_count = function (data) {
  let s

  if (data.count === 1) {
    s = `There is ${data.count} user banned`
  } else {
    s = `There are ${data.count} users banned`
  }

  Hue.checkmsg(s)
}

// Kicks a user
Hue.kick = function (username) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (username.length > 0 && username.length <= Hue.config.max_max_username_length) {
    if (username === Hue.username) {
      Hue.checkmsg("You can't kick yourself")
      return false
    }

    if (!Hue.check_user_in_room(username)) {
      return false
    }

    let rol = Hue.get_role(username)

    if ((rol === "admin" || rol === "op") && Hue.role !== "admin") {
      Hue.forbidden_user()
      return false
    }

    Hue.socket_emit("kick", { username: username })
  }
}

// Announces that a user was banned
Hue.announce_ban = function (data) {
  Hue.show_room_notification(
    data.username1,
    `${data.username1} banned ${data.username2}`
  )

  if (Hue.msg_ban_list.is_open()) {
    Hue.request_ban_list()
  }
}

// Announces that a user was unbanned
Hue.announce_unban = function (data) {
  Hue.show_room_notification(
    data.username1,
    `${data.username1} unbanned ${data.username2}`
  )

  if (Hue.msg_ban_list.is_open()) {
    Hue.request_ban_list()
  }
}

// Checks if a user already has a certain role
Hue.is_already = function (who, what) {
  Hue.checkmsg(`${who} already has ${what}`)
}

// Checks if a role is that of an admin or an operator
// Without arguments it checks the user's role
Hue.is_admin_or_op = function (user) {
  let r = user ? user.role : Hue.role
  return r === "admin" || r === "op"
}

// Checks if a role is that of an admin
Hue.is_admin = function (user) {
  let r = user ? user.role : Hue.role
  return r === "admin"
}

// Superuser command to change to any role
Hue.annex = function (rol = "admin") {
  if (!Hue.roles.includes(rol)) {
    Hue.checkmsg("Invalid role")
    return false
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("annex", { username: Hue.username, role: rol })
  })
}

// Superuser command to send a system broadcast
Hue.system_broadcast = function () {
  Hue.show_confirm("Run superuser command", function () {
    Hue.write_whisper([], "system_broadcast")
  })
}

// If username is valid and it is not in all_usernames add it
Hue.push_to_all_usernames = function (username) {
  if (username) {
    if (!Hue.all_usernames.includes(username)) {
      Hue.all_usernames.push(username)

      if (Hue.all_usernames.length > 1000) {
        Hue.all_usernames.shift()
      }
    }
  }
}

// When a user changes the audio audio clip
Hue.audioclip_changed = function (data) {
  let user = Hue.get_user_by_user_id(data.user_id)

  Hue.replace_property_in_userlist_by_id(
    data.user_id,
    "audioclip",
    data.audioclip,
    false
  )

  Hue.replace_property_in_userlist_by_id(
    data.user_id,
    "audioclip_version",
    data.audioclip_version,
    false
  )  

  if (data.user_id === Hue.open_profile_user.user_id) {
    Hue.show_profile(data.username, data.user_id)
  }

  Hue.show_room_notification(
    data.username,
    `${user.username} changed their audio clip`
  )
}

// Superuser command to change a user's username
Hue.modusername = function (arg) {
  let original_username, new_username

  if (arg.includes(" > ")) {
    let split = arg.split(" > ")

    if (split.length !== 2) {
      return false
    }

    original_username = split[0].trim()
    new_username = split[1].trim()
  } else {
    let split = arg.split(" ")

    if (split.length !== 2) {
      return false
    }

    original_username = split[0].trim()
    new_username = split[1].trim()
  }

  if (!original_username || !new_username) {
    return false
  }

  if (original_username === new_username) {
    return false
  }

  if (new_username.length > Hue.config.max_username_length) {
    Hue.checkmsg("Username is too long")
    return false
  }

  if (Hue.utilz.clean_username(new_username) !== new_username) {
    Hue.checkmsg("Username contains invalid characters")
    return false
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("modusername", {original:original_username, new:new_username})
  })
}

// Superuser command to change a user's password
Hue.modpassword = function (arg) {
  let split = arg.split(" ").filter(x => x !== "")

  if (split.length !== 2) {
    return false
  }

  let username = split[0]
  let password = split[1]

  if (password.length < Hue.config.min_password_length) {
    Hue.checkmsg(
      `Password is too short. It must be at least ${Hue.config.min_password_length} characters long`
    )

    return false
  }

  if (password.length > Hue.config.max_password_length) {
    Hue.checkmsg("Password is too long")
    return false
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("modpassword", { username: username, password: password })
  })
}

// Updates user activity to current date
Hue.update_user_activity = function (user_id) {
  let user = Hue.get_user_by_user_id(user_id)
  user.last_activity = Date.now()
  Hue.do_update_activity_bar = true
}

// Get a profilepic path
Hue.get_profilepic = function (user_id) {
  let pi = `${Hue.config.public_media_directory}/user/${user_id}/profilepic.png`
  let user = Hue.get_user_by_user_id(user_id)
  
  if (user) {
    pi += `?ver=${user.profilepic_version}`
  }

  return pi
}

// Get audioclip path
Hue.get_audioclip = function (user_id) {
  let pi = `${Hue.config.public_media_directory}/user/${user_id}/audioclip.mp3`
  let user = Hue.get_user_by_user_id(user_id)
  
  if (user) {
    pi += `?ver=${user.audioclip_version}`
  }

  return pi
}

// Checks if a user is in the room
Hue.check_user_in_room = function (username) {
  let user = Hue.get_user_by_username(username)
  
  if (!user) {
    Hue.user_not_in_room(username)
    return false
  }

  return user.username
}

// Show user posts
Hue.show_user_messages = function (username = Hue.username) {
  Hue.show_chat_search(`$user ${username} `)
}

// Apply fallback profilepic
Hue.fallback_profilepic = function (el) {
  if (el.src !== Hue.config.profilepic_loading_url) {
    el.src = Hue.config.profilepic_loading_url
  }
}

// Setup change role
Hue.setup_change_role = function () {
  Hue.el("#change_role_admin").addEventListener("click", function () {
    Hue.show_confirm("Operator abilities plus can add/remove operators", function () {
      Hue.change_role(Hue.change_role_username, "admin")
    })

    Hue.msg_change_role.close()
  })

  Hue.el("#change_role_op").addEventListener("click", function () {
    Hue.show_confirm("Enable access to operator features and commands", function () {
      Hue.change_role(Hue.change_role_username, "op")
    })

    Hue.msg_change_role.close()
  })

  Hue.el("#change_role_voice").addEventListener("click", function () {
    Hue.show_confirm("Can interact with users and change media but no operator abilities", function () {
      Hue.change_role(Hue.change_role_username, "voice")
    })

    Hue.msg_change_role.close()
  })
}