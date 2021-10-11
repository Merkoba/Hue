// This handles new users joining the room
Hue.user_join = function (data) {
  Hue.add_to_userlist({
    user_id: data.user_id,
    username: data.username,
    role: data.role,
    profilepic_version: data.profilepic_version,
    date_joined: data.date_joined,
    bio: data.bio,
    hearts: data.hearts,
    skulls: data.skulls,
    audioclip_version: data.audioclip_version
  })

  if(data.username !== Hue.username) {
      Hue.on_activity("join")
  }

  if (Hue.open_profile_username === data.username) {
    Hue.show_profile(data.username)
  }

  if (Hue.started) {
    Hue.do_update_activity_bar = true
  }

  Hue.remove_offline_profilepics(data.user_id)
}

// Removes the online effect to a user's profile images
Hue.remove_offline_profilepics = function (user_id) {
  $("#chat_area .message").each(function () {
    if ($(this).data("user_id") === user_id) {
      $(this).find(".chat_profilepic_container").each(function () {
        $(this).removeClass("profilepic_offline")
      })
    }
  })
}

// Add the online effect to a user's profile images
Hue.add_offline_profilepics = function (user_id) {
  $("#chat_area .message").each(function () {
    if ($(this).data("user_id") === user_id) {
      $(this).find(".chat_profilepic_container").each(function () {
        $(this).addClass("profilepic_offline")
      })
    }
  })
}

// Updates the user count in the header and user list
Hue.update_usercount = function () {
  let s = `${Hue.utilz.singular_or_plural(Hue.usercount, "Users")} Online`

  $("#header_users_count").text(`(${Hue.usercount})`)

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
    hearts: 0,
    skulls: 0,
    audioclip_version: false,
    last_activity: 0
  }

  args = Object.assign(def_args, args)

  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].user_id === args.user_id) {
      Hue.userlist[i].user_id = args.user_id
      Hue.userlist[i].username = args.username
      Hue.userlist[i].role = args.role
      Hue.userlist[i].profilepic = args.profilepic
      Hue.userlist[i].profilepic_version = args.profilepic_version
      Hue.userlist[i].bio = args.bio
      Hue.userlist[i].hearts = args.hearts
      Hue.userlist[i].skulls = args.skulls
      Hue.userlist[i].audioclip = args.audioclip
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
    hearts: args.hearts,
    skulls: args.skulls,
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
  let changed = false

  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].username === username) {
      Hue.userlist[i][prop] = new_value
      changed = true
      break
    }
  }

  if (update && changed) {
    Hue.update_userlist(prop)

    if (Hue.open_profile_username === username) {
      Hue.show_profile(username)
    }
  }
}

// Gets the role of a user by username
Hue.get_role = function (uname) {
  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].username === uname) {
      return Hue.userlist[i].role
    }
  }
}

// Gets the short form of a specified role
// These are displayed next to the usernames in the user list
Hue.role_tag = function (p) {
  let s

  if (p === "admin") {
    s = "[A]"
  } else if (p === "op") {
    s = "[Op]"
  } else if (p === "voice") {
    s = "[V]"
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
Hue.get_user_by_username = function (uname) {
  for (let user of Hue.userlist) {
    if (user.username === uname) {
      return user
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
  Hue.usernames = []

  for (let item of Hue.userlist) {
    Hue.usernames.push(item.username)
  }

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

  Hue.usercount = Hue.userlist.length
  Hue.update_usercount()
}

// Some configurations for the userlist window
Hue.setup_userlist_window = function () {
  $("#userlist").on("click", ".userlist_item", function () {
    let username = $(this).data("username")

    if (Hue.userlist_mode === "normal") {
      Hue.show_profile(username)
    } else if (Hue.userlist_mode === "whisper") {
      Hue.update_whisper_users(username)
    }
  })
}

// Fills the userlist window with user information
Hue.update_userlist_window = function () {
  let s = $()

  s = s.add()

  for (let i = 0; i < Hue.userlist.length; i++) {
    let item = Hue.userlist[i]
    let pi = Hue.get_profilepic(item.user_id)

    let h = $(`
        <div class='modal_item userlist_item action'>
            <div class='userlist_column flex_column_center'>
                <div>
                    <div class='userlist_item_profilepic_container round_image_container actionbox'>
                        <img class='userlist_item_profilepic profilepic' src='${pi}' loading='lazy'>
                    </div>
                    <div class='userlist_item_details_container'>
                        <div class='userlist_item_username'></div>
                        <div class='userlist_item_role'></div>
                    </div>
                </div>
            </div>
        </div>`)

    let image = h.find(".userlist_item_profilepic").eq(0)

    image.on("error", function (e) {
      if ($(this).attr("src") !== Hue.config.default_profilepic_url) {
        $(this).attr("src", Hue.config.default_profilepic_url)
      }
    })

    let role_tag = Hue.role_tag(item.role)
    let role_element = h.find(".userlist_item_role").eq(0)
    role_element.text(role_tag)
    let uname = h.find(".userlist_item_username").eq(0)
    uname.text(item.username)
    h.data("username", item.username)
    s = s.add(h)
  }

  $("#userlist").html(s)

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

// Returns true or false depending if the user is online
Hue.user_is_online_by_user_id = function (user_id) {
  let user = Hue.get_user_by_user_id(user_id)
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
  } else if (mode === "whisper") {
    Hue.msg_userlist.set_title("Add or Remove a User")
  }

  Hue.update_userlist_window()

  Hue.msg_userlist.show(function () {
    if (filter.trim()) {
      $("#userlist_filter").val(filter)
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
  Hue.remove_from_userlist(data.user_id)

  let type = data.disconnection_type

  if (type === "banned") {
    if (Hue.ban_list_open) {
      Hue.request_ban_list()
    }
  }

  if (Hue.open_profile_username === data.username) {
    Hue.show_profile(data.username, $("#show_profilepic").attr("src"))
  }

  Hue.do_update_activity_bar = true
  Hue.add_offline_profilepics(data.user_id)
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

    if (Hue.msg_details.is_open()) {
      Hue.show_details()
    }
  } else {
    Hue.show_room_notification(
      data.username,
      `${data.old_username} is now known as ${data.username}`
    )
  }

  if (Hue.admin_list_open) {
    Hue.request_admin_list()
  }

  Hue.update_activity_bar()
}

// Returns feedback on wether a user is in the room or not
Hue.user_not_in_room = function (uname) {
  if (uname) {
    Hue.checkmsg(`${uname} is not in the room`)
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
  let uname = split[0]
  let matches = []

  for (let i = 0; i < split.length; i++) {
    if (i > 0) {
      uname = `${uname} ${split[i]}`
    }

    if (Hue.usernames.includes(uname)) {
      matches.push(uname)
    }
  }

  return matches
}

// Setups user profile windows
Hue.setup_show_profile = function () {
  $("#show_profile_whisper").on("click", function () {
    Hue.write_popup_message([Hue.open_profile_username])
  })

  $("#show_profile_sync_tv").on("click", function () {
    Hue.sync_tv(Hue.open_profile_username)
    Hue.msg_profile.close()
  })

  $("#show_profilepic").on("error", function () {
    if ($(this).attr("src") !== Hue.config.default_profilepic_url) {
      $(this).attr("src", Hue.config.default_profilepic_url)
    }
  })

  $("#show_profile_search").on("click", function () {
    Hue.show_chat_search(Hue.open_profile_username)
  })

  $("#show_profile_hearts_icon").on("click", function () {
    Hue.send_badge(Hue.open_profile_username, "heart")
  })

  $("#show_profile_skulls_icon").on("click", function () {
    Hue.send_badge(Hue.open_profile_username, "skull")
  })

  $("#show_profilepic").on("click", function () {
    if (Hue.profile_audio) {
      Hue.stop_profile_audio()
    } else {
      Hue.play_profile_audio()
    }
  })
}

// Stars the profile audio
Hue.play_profile_audio = function () {
  let clip = Hue.get_audioclip(Hue.open_profile_user.user_id)

  if (Hue.profile_audio) {
    Hue.stop_profile_audio()
  }

  Hue.profile_audio = document.createElement("audio")

  Hue.profile_audio.onended = function () {
    Hue.stop_profile_audio()
  }

  Hue.profile_audio.src = clip
  Hue.profile_audio.play()
}

// Stops the profile audio
Hue.stop_profile_audio = function () {
  if (Hue.profile_audio) {
    Hue.profile_audio.src = ""
    Hue.profile_audio = undefined
  }
}

// Shows a user's profile window
Hue.show_profile = function (username, profilepic = false, user_id = false) {
  let id
  let role = "Offline"
  let bio = ""
  let hearts = 0
  let skulls = 0
  let user = false

  if (user_id) {
    id = user_id
  } else if (user) {
    id = user.user_id
  }  

  if (username) {
    user = Hue.get_user_by_username(username)
  } else if(user_id) {
    user = Hue.get_user_by_user_id(user_id)
  }

  if (user) {
    $("#show_profile_details").css("display", "block")

    role = Hue.get_pretty_role_name(user.role)
    bio = user.bio
    hearts = user.hearts
    skulls = user.skulls

    if (user.username === Hue.username) {
      same_user = true
    }

    username = user.username
    Hue.open_profile_user = user
  } else {
    $("#show_profile_details").css("display", "none")
  }
  
  Hue.open_profile_username = username
  let pi = Hue.get_profilepic(id)

  $("#show_profile_username").text(username)
  $("#show_profile_role").text(`(${role})`)
  $("#show_profile_bio")
    .html(Hue.utilz.make_html_safe(bio).replace(/\n+/g, " <br> "))
    .urlize()

  $("#show_profilepic").attr("src", pi)

  if (!Hue.usernames.includes(username)) {
    $("#show_profile_whisper").css("display", "none")
    $("#show_profile_hearts").css("display", "none")
    $("#show_profile_skulls").css("display", "none")
  } else {
    $("#show_profile_whisper").css("display", "block")
    $("#show_profile_hearts").css("display", "flex")
    $("#show_profile_skulls").css("display", "flex")

    Hue.set_hearts_counter(hearts)
    Hue.set_skulls_counter(skulls)
  }

  if (user && user.audioclip_version > 0) {
    $("#show_profilepic_container").addClass("action4")
  } else {
    $("#show_profilepic_container").removeClass("action4")
  }

  if (Hue.room_state["tv_enabled"] 
  && Hue.usernames.includes(username)) {
    $("#show_profile_sync_tv").css("display", "flex")
  } else {
    $("#show_profile_sync_tv").css("display", "none")
  }

  if (
    $(".show_profile_button").filter(function () {
      return $(this).css("display") !== "none"
    }).length
  ) {
    $("#show_profile_buttons").css("display", "grid")
  } else {
    $("#show_profile_buttons").css("display", "none")
  }

  $("#show_profile_user").data("username", username)

  $("#show_profile_info").html("")

  if (user) {
    let item = document.createElement("div")
    let nicedate = Hue.utilz.nice_date(user.date_joined)
    let timeago = Hue.utilz.timeago(user.date_joined)
    item.textContent = `Got Online: ${timeago}`
    item.title = nicedate
    $("#show_profile_info").append(item)
  }

  let item = document.createElement("div")
  item.textContent = `ID: ${id}`
  $("#show_profile_info").append(item)
  
  Hue.horizontal_separator($("#show_profile_badges")[0])
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
    $("#user_menu_profilepic").attr("src", src)
  }

  Hue.show_room_notification(
    user.username,
    `${user.username} changed their profile image`
  )

  Hue.update_activity_bar_image(data.user_id, src)
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
  if (!Hue.is_admin_or_op(Hue.role)) {
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

  if (Hue.admin_list_open) {
    Hue.request_admin_list()
  }
}

// Role setter for user
Hue.set_role = function (rol, config = true) {
  Hue.role = rol
  Hue.check_message_board_permissions()
  
  if (config) {
    Hue.config_room_menu()
    Hue.config_main_menu()
  }

  $("#user_menu_role").text(`(${Hue.get_pretty_role_name(rol)})`)
}

// Bans a user
Hue.ban = function (uname) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.checkmsg("You can't ban yourself")
      return false
    }

    Hue.socket_emit("ban", { username: uname })
  }
}

// Unbans a user
Hue.unban = function (uname) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.checkmsg("You can't unban yourself")
      return false
    }

    Hue.socket_emit("unban", { username: uname })
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
Hue.kick = function (uname) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.checkmsg("You can't kick yourself")
      return false
    }

    if (!Hue.usernames.includes(uname)) {
      Hue.user_not_in_room()
      return false
    }

    let rol = Hue.get_role(uname)

    if ((rol === "admin" || rol === "op") && Hue.role !== "admin") {
      Hue.forbidden_user()
      return false
    }

    Hue.socket_emit("kick", { username: uname })
  }
}

// Announces that a user was banned
Hue.announce_ban = function (data) {
  Hue.show_room_notification(
    data.username1,
    `${data.username1} banned ${data.username2}`
  )

  if (Hue.ban_list_open) {
    Hue.request_ban_list()
  }
}

// Announces that a user was unbanned
Hue.announce_unban = function (data) {
  Hue.show_room_notification(
    data.username1,
    `${data.username1} unbanned ${data.username2}`
  )

  if (Hue.ban_list_open) {
    Hue.request_ban_list()
  }
}

// Checks if a user already has a certain role
Hue.is_already = function (who, what) {
  Hue.checkmsg(`${who} already has ${what}`)
}

// Checks if a role is that of an admin or an operator
// Without arguments it checks the user's role
Hue.is_admin_or_op = function (rol = false) {
  let r

  if (rol) {
    r = rol
  } else {
    r = Hue.role
  }

  if (r === "admin" || r === "op") {
    return true
  } else {
    return false
  }
}

// Superuser command to change to any role
Hue.annex = function (rol = "admin") {
  if (!Hue.roles.includes(rol)) {
    Hue.checkmsg("Invalid role")
    return false
  }

  Hue.socket_emit("annex", { username: Hue.username, role: rol })
}

// Superuser command to send a system broadcast
Hue.system_broadcast = function () {
  Hue.write_popup_message([], "system_broadcast")
}

Hue.setup_badges = function () {
  Hue.start_badge_timeout()
}

// Sends 1 badge to a user
// This has a cooldown
Hue.send_badge = function (username, type) {
  if (username === Hue.username) {
    Hue.checkmsg("You can't give a badge to yourself")
    return false
  }
  
  if (Hue.send_badge_disabled) {
    let n = Hue.utilz.round2(Hue.config.send_badge_cooldown / 1000, 1)
    let s = n === 1 ? "1 second" : `${n} seconds`
    Hue.checkmsg(`You can send a badge every ${s}`)
    return false
  }

  let user = Hue.get_user_by_username(username)

  if (!user) {
    return false
  }

  if (type !== "heart" && type !== "skull") {
    return false
  }

  Hue.socket_emit("send_badge", { username: username, type: type })

  Hue.send_badge_disabled = true

  Hue.start_badge_timeout()
}

// Starts a timeout to enable badge sending
Hue.start_badge_timeout = function () {
  setTimeout(function () {
    Hue.send_badge_disabled = false
  }, Hue.config.send_badge_cooldown + 100)
}

// What happens when a user receives a badge
Hue.on_badge_received = function (data) {
  if (data.username === Hue.open_profile_username) {
    if (data.type === "heart") {
      Hue.set_hearts_counter(data.badges)
    } else if (data.type === "skull") {
      Hue.set_skulls_counter(data.badges)
    }
  }

  let prop, prop_value
  let user = Hue.get_user_by_username(data.username)

  if (data.type === "heart") {
    prop = "hearts"
    prop_value = user.hearts + 1
  }

  if (data.type === "skull") {
    prop = "skulls"
    prop_value = user.skulls + 1
  }

  Hue.replace_property_in_userlist_by_username(data.username, prop, prop_value)

  if (Hue.app_focused) {
    let message = Hue.get_last_chat_message_by_username(data.username)

    if (message) {
      let profilepic_container = $(message)
        .find(".chat_profilepic_container")
        .eq(0)
      Hue.change_profilepic_badge(profilepic_container, data.type)
    }
  }
}

// Changes the profile image of a user receiving a badge
Hue.change_profilepic_badge = function (profilepic_container, type) {
  Hue.remove_badge_icons(profilepic_container)
  profilepic_container.addClass(`${type}_badge`)
  profilepic_container.addClass("profilepic_badge")

  let icon

  if (type === "heart") {
    icon = "heart-solid"
  } else if (type === "skull") {
    icon = "skull"
  }

  profilepic_container.append(
    `<svg class='other_icon profilepic_badge_icon ${type}_badge'>
      <use href='#icon_${icon}'>
    </svg>`
  )

  let number = profilepic_container.data("badge_feedback_number")

  if (!number) {
    number = 1
  } else {
    number += 1
  }

  profilepic_container.data("badge_feedback_number", number)

  setTimeout(function () {
    let number_2 = profilepic_container.data("badge_feedback_number")

    if (number !== number_2) {
      return false
    }

    Hue.remove_badge_icons(profilepic_container)
  }, Hue.config.badge_feedback_duration)
}

// Removes badge icons from profile image container
Hue.remove_badge_icons = function (profilepic_container) {
  profilepic_container.removeClass("heart_badge")
  profilepic_container.removeClass("skull_badge")
  profilepic_container.removeClass(`profilepic_badge`)
  profilepic_container.find(".profilepic_badge_icon").each(function () {
    $(this).remove()
  })
}

// Sets the hearts counter in the profile window
Hue.set_hearts_counter = function (hearts) {
  $("#show_profile_hearts_counter").text(Hue.utilz.format_number(hearts))
}

// Sets the skulls counter in the profile window
Hue.set_skulls_counter = function (skulls) {
  $("#show_profile_skulls_counter").text(Hue.utilz.format_number(skulls))
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
    Hue.show_profile(data.username)
  }

  if (data.audioclip) {
    Hue.show_room_notification(
      data.username,
      `${user.username} changed their audio clip`
    )
  }
}

// Superuser command to change a user's username
Hue.modusername = function (arg) {
  let original_uname, new_uname

  if (arg.includes(" > ")) {
    let split = arg.split(" > ")

    if (split.length !== 2) {
      return false
    }

    original_uname = split[0].trim()
    new_uname = split[1].trim()
  } else {
    let split = arg.split(" ")

    if (split.length !== 2) {
      return false
    }

    original_uname = split[0].trim()
    new_uname = split[1].trim()
  }

  if (!original_uname || !new_uname) {
    return false
  }

  if (original_uname === new_uname) {
    return false
  }

  if (new_uname.length > Hue.config.max_username_length) {
    Hue.checkmsg("Username is too long")
    return false
  }

  if (Hue.utilz.clean_username(new_uname) !== new_uname) {
    Hue.checkmsg("Username contains invalid characters")
    return false
  }

  Hue.socket_emit("modusername", {original:original_uname, new:new_uname})
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

  Hue.socket_emit("modpassword", { username: username, password: password })
  return true
}

// Updates user activity to current date
Hue.update_user_activity = function (user_id) {
  let user = Hue.get_user_by_user_id(user_id)
  user.last_activity = Date.now()
  Hue.do_update_activity_bar = true
}

// Get a profilepic path
Hue.get_profilepic = function (user_id) {
  let pi = Hue.config.public_profilepic_location + user_id + ".png"
  let user = Hue.get_user_by_user_id(user_id)
  
  if (user) {
    pi += `?ver=${user.profilepic_version}`
  }

  return pi
}

// Get audioclip path
Hue.get_audioclip = function (user_id) {
  let pi = Hue.config.public_audioclip_location + user_id + ".mp3"
  let user = Hue.get_user_by_user_id(user_id)
  
  if (user) {
    pi += `?ver=${user.audioclip_version}`
  }

  return pi
}