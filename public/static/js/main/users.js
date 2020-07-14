// Shows the user's role
Hue.show_role = function () {
  if (Hue.role === "admin") {
    Hue.feedback("You are an admin")
  } else if (Hue.role.startsWith("op")) {
    Hue.feedback("You are an op")
  } else if (Hue.role.startsWith("voice")) {
    Hue.feedback(`You have ${Hue.role}`)
  }

  let ps = 0

  if (Hue.can_chat) {
    Hue.feedback("You have chat permission")

    ps += 1
  }

  if (Hue.can_image) {
    Hue.feedback("You have image permission")

    ps += 1
  }

  if (Hue.can_tv) {
    Hue.feedback("You have tv permission")

    ps += 1
  }

  if (Hue.can_radio) {
    Hue.feedback("You have radio permission")

    ps += 1
  }

  if (ps === 0) {
    Hue.feedback("You cannot interact")
  }
}

// Shows the user's username
Hue.show_username = function () {
  Hue.feedback(`Username: ${Hue.username}`)
}

// This handles new users joining the room
Hue.user_join = function (data) {
  Hue.add_to_userlist({
    user_id: data.user_id,
    username: data.username,
    role: data.role,
    profile_image: data.profile_image,
    date_joined: data.date_joined,
    bio: data.bio,
    hearts: data.hearts,
    skulls: data.skulls,
    audio_clip: data.audio_clip,
  })

  let f = function () {
    Hue.show_profile(data.username)
  }

  let item = Hue.make_info_popup_item({
    icon: "fa fa-user-plus",
    message: `${data.username} has joined`,
    on_click: f,
    type: "user_join",
  })

  if (!Hue.user_is_ignored(data.username)) {
    let method = Hue.get_setting("user_join_notifications_method")

    if (method === "popups") {
      Hue.show_popup(Hue.make_info_popup(f), item)
    } else if (method === "chat") {
      Hue.public_feedback(`${data.username} has joined`, {
        brk: "<i class='icon2c fa fa-user-plus'></i>",
        username: data.username,
        open_profile: true,
      })
    }
  }

  // if(data.username !== Hue.username)
  // {
  //     Hue.on_activity("join")
  // }

  Hue.update_user_last_message(data.user_id)

  if (Hue.open_profile_username === data.username) {
    Hue.show_profile(data.username, $("#show_profile_image").attr("src"))
  }
}

// Updates the user data with their last message
Hue.update_user_last_message = function (user_id) {
  let last_chat_message = Hue.get_last_chat_message_by_user_id(user_id)

  if (!last_chat_message) {
    return false
  }

  let text = $(last_chat_message).find(".chat_content").last().text()

  if (!text) {
    return false
  }

  if (last_chat_message) {
    Hue.replace_property_in_userlist_by_user_id(user_id, "last_message", text)
  }
}

// Updates the user count in the header and user list
Hue.update_usercount = function () {
  let s = `${Hue.utilz.singular_or_plural(Hue.usercount, "Users")} Online`

  $("#activity_left_users_count").text(`(${Hue.usercount})`)

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
    profile_image: false,
    date_joined: false,
    bio: "",
    hearts: 0,
    skulls: 0,
    last_message: "",
    audio_clip: false,
  }

  args = Object.assign(def_args, args)

  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].user_id === args.user_id) {
      Hue.userlist[i].user_id = args.user_id
      Hue.userlist[i].username = args.username
      Hue.userlist[i].role = args.role
      Hue.userlist[i].profile_image = args.profile_image
      Hue.userlist[i].bio = args.bio
      Hue.userlist[i].hearts = args.hearts
      Hue.userlist[i].skulls = args.skulls
      Hue.userlist[i].last_message = args.last_message
      Hue.userlist[i].audio_clip = args.audio_clip

      Hue.update_userlist()

      return false
    }
  }

  Hue.userlist.push({
    user_id: args.user_id,
    username: args.username,
    role: args.role,
    profile_image: args.profile_image,
    date_joined: args.date_joined,
    bio: args.bio,
    hearts: args.hearts,
    skulls: args.skulls,
    last_message: args.last_message,
    audio_clip: args.audio_clip,
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

// Replaces a property of a user by user_id
Hue.replace_property_in_userlist_by_user_id = function (
  user_id,
  prop,
  new_value,
  update = true
) {
  let changed = false
  let user

  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].user_id === user_id) {
      Hue.userlist[i][prop] = new_value
      user = Hue.userlist[i]
      changed = true
      break
    }
  }

  if (update && changed) {
    Hue.update_userlist(prop)

    if (Hue.open_profile_username === user.username) {
      Hue.show_profile(user.username)
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

// Sets all voice roles to voice_1
Hue.reset_voices_userlist = function () {
  for (let i = 0; i < Hue.userlist.length; i++) {
    if (
      Hue.userlist[i].role.startsWith("voice") &&
      Hue.userlist[i].role !== "voice_1"
    ) {
      Hue.userlist[i].role = "voice_1"
    }
  }

  Hue.update_userlist()
}

// Sets all op roles to op_1
Hue.reset_ops_userlist = function () {
  for (let i = 0; i < Hue.userlist.length; i++) {
    if (
      Hue.userlist[i].role.startsWith("op") &&
      Hue.userlist[i].role !== "op_1"
    ) {
      Hue.userlist[i].role = "op_1"
    }
  }

  Hue.update_userlist()
}

// Sets all op roles to voice_1
Hue.remove_ops_userlist = function () {
  for (let i = 0; i < Hue.userlist.length; i++) {
    if (Hue.userlist[i].role.startsWith("op")) {
      Hue.userlist[i].role = "voice_1"
    }
  }

  Hue.update_userlist()
}

// Gets the short form of a specified role
// These are displayed next to the usernames in the user list
Hue.role_tag = function (p) {
  let s

  if (p === "admin") {
    s = "[A]"
  } else if (p === "op_1") {
    s = "[Op1]"
  } else if (p === "op_2") {
    s = "[Op2]"
  } else if (p === "op_3") {
    s = "[Op3]"
  } else if (p === "op_4") {
    s = "[Op4]"
  } else if (p === "voice_1") {
    s = "[V1]"
  } else if (p === "voice_2") {
    s = "[V2]"
  } else if (p === "voice_3") {
    s = "[V3]"
  } else if (p === "voice_4") {
    s = "[V4]"
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
  } else if (p === "op_1") {
    s = "Op 1"
  } else if (p === "op_2") {
    s = "Op 2"
  } else if (p === "op_3") {
    s = "Op 3"
  } else if (p === "op_4") {
    s = "Op 4"
  } else if (p === "voice_1") {
    s = "Voice 1"
  } else if (p === "voice_2") {
    s = "Voice 2"
  } else if (p === "voice_3") {
    s = "Voice 3"
  } else if (p === "voice_4") {
    s = "Voice 4"
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
Hue.get_user_by_id = function (id) {
  for (let user of Hue.userlist) {
    if (user.user_id === id) {
      return user
    }
  }

  return false
}

// Handles a user list update
// Rebuilds the HTML of the user list window
Hue.update_userlist = function (prop = "") {
  Hue.userlist.sort(Hue.compare_userlist)
  Hue.usernames = []

  for (let item of Hue.userlist) {
    Hue.usernames.push(item.username)
  }

  if (Hue.msg_userlist.is_open()) {
    let uchange = true

    if (prop) {
      uchange = false

      if (prop === "username" || prop == "bio" || prop === "profile_image") {
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
    let uname = $(this).data("username")

    if (Hue.userlist_mode === "normal") {
      Hue.show_profile(uname)
    } else if (Hue.userlist_mode === "whisper") {
      Hue.update_whisper_users(uname)
    }
  })

  $("#userlist").on("auxclick", ".userlist_item", function (e) {
    if (e.which === 2) {
      Hue.process_write_whisper($(this).data("username"))
    }
  })
}

// Fills the userlist window with user information
Hue.update_userlist_window = function () {
  let s = $()

  s = s.add()

  for (let i = 0; i < Hue.userlist.length; i++) {
    let item = Hue.userlist[i]

    let h = $(`
        <div class='modal_item userlist_item dynamic_title'>
            <div class='userlist_column flex_column_center'>
                <div>
                    <div class='userlist_item_profile_image_container round_image_container action4'>
                        <img class='userlist_item_profile_image profile_image' src='${item.profile_image}' loading='lazy'>
                    </div>
                    <div class='userlist_item_details_container'>
                        <div class='userlist_item_username action'></div>
                        <div class='userlist_item_role action'></div>
                    </div>
                </div>
                <div class='userlist_item_bio action'></div>
            </div>
        </div>`)

    let t = Hue.get_user_info_title(item)

    h.attr("title", t)
    h.data("otitle", t)
    h.data("date", item.date_joined)
    h.data("username", item.username)

    let image = h.find(".userlist_item_profile_image").eq(0)
    image.data("username", item.username)

    image.on("error", function (e) {
      if ($(this).attr("src") !== Hue.config.default_profile_image_url) {
        $(this).attr("src", Hue.config.default_profile_image_url)
      }
    })

    let role_tag = Hue.role_tag(item.role)
    let role_element = h.find(".userlist_item_role").eq(0)
    role_element.text(role_tag)

    let uname = h.find(".userlist_item_username").eq(0)
    uname.text(item.username)

    let bio = h.find(".userlist_item_bio").eq(0)

    if (item.bio) {
      bio.text(item.bio.substring(0, 50))
    } else {
      bio.css("display", "none")
    }

    s = s.add(h)
  }

  $("#userlist").html(s)

  if (Hue.userlist_filtered) {
    Hue.do_modal_filter("userlist")
  }
}

// Used to sort the user list by order of roles
// Admins at the top, voice_1 at the bottom, etc
// It sorts in alphabetical order on equal roles
Hue.compare_userlist = function (a, b) {
  if (a.role === "") {
    a.role = "voice_1"
  }

  if (b.role === "") {
    b.role = "voice_1"
  }

  if (a.role.startsWith("voice") && b.role.startsWith("voice")) {
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
    (user.role === "admin" || user.role.startsWith("op")) &&
    Hue.role !== "admin"
  ) {
    return false
  }

  return true
}

// Shows the user list window
Hue.show_userlist_window = function (mode = "normal", filter = false) {
  Hue.userlist_mode = mode

  if (mode === "normal") {
    Hue.update_usercount()
  } else if (mode === "whisper") {
    Hue.msg_userlist.set_title("Add or Remove a User")
  }

  Hue.update_userlist_window()

  Hue.msg_userlist.show(function () {
    if (filter) {
      $("#userlist_filter").val(filter)
      Hue.do_modal_filter()
    }
  })
}

// Sorts a user list by activity date
Hue.sort_userlist_by_activity_trigger = function (a, b) {
  if (a.last_activity_trigger < b.last_activity_trigger) {
    return -1
  }

  if (a.last_activity_trigger > b.last_activity_trigger) {
    return 1
  }

  return 0
}

// Updates the profile image of a user in the userlist
Hue.update_user_profile_image = function (uname, pi) {
  for (let i = 0; i < Hue.userlist.length; i++) {
    let user = Hue.userlist[i]

    if (user.username === uname) {
      Hue.userlist[i].profile_image = pi
      return
    }
  }
}

// Gets the ignored usernames list
Hue.get_ignored_usernames_list = function () {
  let list = Hue.get_setting("ignored_usernames").split("\n")

  if (list.length === 1 && !list[0]) {
    list = []
  }

  Hue.ignored_usernames_list = list
}

// What to do when a user disconnects
Hue.user_disconnect = function (data) {
  Hue.remove_from_userlist(data.user_id)
  Hue.update_activity_bar()

  let s, mode
  let type = data.disconnection_type

  if (type === "disconnection") {
    s = `${data.username} has left`
    mode = "normal"
  } else if (type === "pinged") {
    s = `${data.username} has left (Ping Timeout)`
    mode = "normal"
  } else if (type === "kicked") {
    s = `${data.username} was kicked by ${data.info1}`
    mode = "action"
  } else if (type === "banned") {
    s = `${data.username} was banned by ${data.info1}`

    if (Hue.ban_list_open) {
      Hue.request_ban_list()
    }

    mode = "action"
  }

  let item = Hue.make_info_popup_item({
    icon: "fas fa-sign-out-alt",
    message: s,
    action: false,
    type: "user_part",
  })

  if (!Hue.user_is_ignored(data.username) || mode === "action") {
    let method = Hue.get_setting("user_part_notifications_method")

    if (method === "popups") {
      Hue.show_popup(Hue.make_info_popup(), item)
    } else if (method === "chat") {
      Hue.public_feedback(s, {
        brk: "<i class='icon2c fas fa-sign-out-alt'></i>",
        username: data.username,
      })
    }
  }

  if (Hue.open_profile_username === data.username) {
    Hue.show_profile(data.username, $("#show_profile_image").attr("src"))
  }
}

// Announces that the operation cannot be applied to a certain user
// This is usually because the user's role is not low enough
Hue.forbidden_user = function () {
  Hue.feedback("That operation is forbidden on that user")
}

// Announces username changes
Hue.announce_new_username = function (data) {
  Hue.replace_property_in_userlist_by_username(
    data.old_username,
    "username",
    data.username
  )

  let show = Hue.check_media_permission(Hue.get_role(data.username), "chat")

  if (Hue.username === data.old_username) {
    Hue.set_username(data.username)

    if (show) {
      Hue.show_room_notification(
        data.username,
        `${data.old_username} is now known as ${Hue.username}`
      )
    } else {
      Hue.show_room_notification(
        data.username,
        `You are now known as ${data.username}`
      )
    }
  } else {
    if (show) {
      Hue.show_room_notification(
        data.username,
        `${data.old_username} is now known as ${data.username}`
      )
    }
  }

  if (Hue.admin_list_open) {
    Hue.request_admin_list()
  }
}

// Check whether a user is ignored by checking the ignored usernames list
Hue.user_is_ignored = function (uname) {
  if (uname === Hue.username) {
    return false
  }

  if (Hue.ignored_usernames_list.includes(uname)) {
    return true
  }

  return false
}

// Returns feedback on wether a user is in the room or not
Hue.user_not_in_room = function (uname) {
  if (uname) {
    Hue.feedback(`${uname} is not in the room`)
  } else {
    Hue.feedback("User is not in the room")
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

// Setups the profile image
Hue.setup_profile_image = function (pi) {
  if (pi === "") {
    Hue.profile_image = Hue.config.default_profile_image_url
  } else {
    Hue.profile_image = pi
  }
}

// Setups user profile windows
Hue.setup_show_profile = function () {
  $("#show_profile_whisper").click(function () {
    Hue.write_popup_message([Hue.open_profile_username])
  })

  $("#show_profile_sync_tv").click(function () {
    Hue.sync_tv(Hue.open_profile_username)
    Hue.msg_profile.close()
  })

  $("#show_profile_edit").click(function () {
    Hue.show_user_menu()
  })

  $("#show_profile_image").on("error", function () {
    if ($(this).attr("src") !== Hue.config.default_profile_image_url) {
      $(this).attr("src", Hue.config.default_profile_image_url)
    }
  })

  $("#show_profile_hearts_icon").click(function () {
    Hue.send_badge(Hue.open_profile_username, "heart")
  })

  $("#show_profile_skulls_icon").click(function () {
    Hue.send_badge(Hue.open_profile_username, "skull")
  })

  $("#show_profile_audio_clip").click(function () {
    if (!Hue.show_profile_audio_clip_started) {
      Hue.show_profile_audio = document.createElement("audio")
      Hue.show_profile_audio.src = Hue.open_profile_user.audio_clip

      Hue.show_profile_audio.onended = function () {
        Hue.stop_show_profile_audio()
      }

      Hue.show_profile_audio.play()

      $("#show_profile_audio_clip_icon").removeClass("fa-play-circle")
      $("#show_profile_audio_clip_icon").addClass("fa-pause-circle")

      Hue.show_profile_audio_clip_started = true
    } else {
      Hue.stop_show_profile_audio()
    }
  })
}

// Stops the profile audio and restores default state
Hue.stop_show_profile_audio = function () {
  if (Hue.show_profile_audio) {
    Hue.show_profile_audio.pause()
    Hue.show_profile_audio_clip_started = false
    $("#show_profile_audio_clip_icon").addClass("fa-play-circle")
    $("#show_profile_audio_clip_icon").removeClass("fa-pause-circle")
  }
}

// Shows a user's profile window
Hue.show_profile = function (uname, prof_image) {
  let pi
  let role = "Offline"
  let bio = ""
  let hearts = 0
  let skulls = 0
  let user = Hue.get_user_by_username(uname)
  let same_user = false

  if (user) {
    role = Hue.get_pretty_role_name(user.role)
    bio = user.bio
    hearts = user.hearts
    skulls = user.skulls

    if (user.username === Hue.username) {
      same_user = true
    }

    Hue.open_profile_user = user
  }

  Hue.open_profile_username = uname

  if (
    prof_image === "" ||
    prof_image === undefined ||
    prof_image === "undefined"
  ) {
    if (user && user.profile_image) {
      pi = user.profile_image
    } else {
      pi = Hue.config.default_profile_image_url
    }
  } else {
    pi = prof_image
  }

  $("#show_profile_uname").text(uname)
  $("#show_profile_role").text(`(${role})`)
  $("#show_profile_bio")
    .html(Hue.utilz.make_html_safe(bio).replace(/\n+/g, " <br> "))
    .urlize()

  $("#show_profile_image").attr("src", pi)
  $("#show_profile_image").data("username", uname)

  if (user) {
    let t = Hue.get_user_info_title(user)
    $("#show_profile_image").attr("title", t)
    $("#show_profile_image").data("otitle", t)
    $("#show_profile_image").data("date", user.date_joined)
    $("#show_profile_image").addClass("dynamic_title")
  } else {
    $("#show_profile_image").attr("title", "")
    $("#show_profile_image").removeClass("dynamic_title")
  }

  if (!Hue.can_chat || !Hue.usernames.includes(uname)) {
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

  if (user && user.audio_clip) {
    $("#show_profile_audio_clip").css("display", "inline-flex")
  } else {
    $("#show_profile_audio_clip").css("display", "none")
  }

  if (same_user) {
    $("#show_profile_edit").css("display", "block")
  } else {
    $("#show_profile_edit").css("display", "none")
  }

  if (uname !== Hue.username && Hue.room_state["tv_enabled"] 
  && Hue.usernames.includes(uname)) {
    $("#show_profile_sync_tv").css("display", "flex")
  } else {
    $("#show_profile_sync_tv").css("display", "none")
  }

  if (
    $(".show_profile_button").filter(function () {
      return $(this).css("display") !== "none"
    }).length
  ) {
    $("#show_profile_buttons").css("display", "flex")
  } else {
    $("#show_profile_buttons").css("display", "none")
  }
  
  Hue.msg_profile.show()
}

// Announces a user's profile image change
Hue.profile_image_changed = function (data) {
  if (data.username === Hue.username) {
    Hue.profile_image = data.profile_image
    $("#user_menu_profile_image").attr("src", Hue.profile_image)
  }

  Hue.update_user_profile_image(data.username, data.profile_image)

  if (!Hue.user_is_ignored(data.username)) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed their profile image`
    )
  }

  Hue.update_activity_bar_image(data.username, data.profile_image)
}

// When any user changes their bio
Hue.bio_changed = function (data) {
  Hue.replace_property_in_userlist_by_username(data.username, "bio", data.bio)

  if (data.username === Hue.username) {
    Hue.set_bio(data.bio)
  }

  if (data.bio && !Hue.user_is_ignored(data.username)) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed their bio`
    )
  }
}

// Resets all voice users to voice_1
Hue.reset_voices = function () {
  if (!Hue.check_op_permission(Hue.role, "voice_roles")) {
    return false
  }

  Hue.socket_emit("reset_voices", {})
}

// Resets all op users to op_1
Hue.reset_ops = function () {
  if (Hue.role !== "admin") {
    return false
  }

  Hue.socket_emit("reset_ops", {})
}

// Resets all op users to voice_1
Hue.remove_ops = function () {
  if (Hue.role !== "admin") {
    return false
  }

  Hue.socket_emit("remove_ops", {})
}

// Announces that voices were resetted
Hue.announce_voices_resetted = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} resetted the voices`
  )

  if (Hue.role.startsWith("voice") && Hue.role !== "voice_1") {
    Hue.set_role("voice_1")
  }

  Hue.reset_voices_userlist()
}

// Announces that ops were resetted
Hue.announce_ops_resetted = function (data) {
  Hue.show_room_notification(data.username, `${data.username} resetted the ops`)

  if (Hue.role.startsWith("op") && Hue.role !== "op_1") {
    Hue.set_role("op_1")
  }

  Hue.reset_ops_userlist()
}

// Announces that ops were resetted
Hue.announce_removed_ops = function (data) {
  Hue.show_room_notification(data.username, `${data.username} removed all ops`)

  if (Hue.role.startsWith("op")) {
    Hue.set_role("voice_1")
  }

  Hue.remove_ops_userlist()

  if (Hue.admin_list_open) {
    Hue.request_admin_list()
  }
}

// Changes a user's role
Hue.change_role = function (uname, rol) {
  if (!Hue.check_op_permission(Hue.role, "voice_roles")) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.feedback("You can't assign a role to yourself")
      return false
    }

    if ((rol === "admin" || rol.startsWith("op")) && Hue.role !== "admin") {
      Hue.forbidden_user()
      return false
    }

    if (!Hue.roles.includes(rol)) {
      Hue.feedback("Invalid role")
      return false
    }

    Hue.socket_emit("change_role", { username: uname, role: rol })
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

  Hue.check_media_permissions()
  Hue.check_message_board_permissions()
  Hue.check_message_board_delay()

  if (config) {
    Hue.config_room_menu()
  }
}

// Bans a user
Hue.ban = function (uname) {
  if (!Hue.check_op_permission(Hue.role, "ban")) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.feedback("You can't ban yourself")
      return false
    }

    Hue.socket_emit("ban", { username: uname })
  }
}

// Unbans a user
Hue.unban = function (uname) {
  if (!Hue.check_op_permission(Hue.role, "unban")) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.feedback("You can't unban yourself")
      return false
    }

    Hue.socket_emit("unban", { username: uname })
  }
}

// Unbans all banned users
Hue.unban_all = function () {
  if (!Hue.check_op_permission(Hue.role, "unban")) {
    return false
  }

  Hue.socket_emit("unban_all", {})
}

// Gets the number of users banned
Hue.get_ban_count = function () {
  if (Hue.is_admin_or_op()) {
    Hue.socket_emit("get_ban_count", {})
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

  Hue.msg_info.show(s)
}

// Kicks a user
Hue.kick = function (uname) {
  if (!Hue.check_op_permission(Hue.role, "kick")) {
    return false
  }

  if (uname.length > 0 && uname.length <= Hue.config.max_max_username_length) {
    if (uname === Hue.username) {
      Hue.feedback("You can't kick yourself")
      return false
    }

    if (!Hue.usernames.includes(uname)) {
      Hue.user_not_in_room()
      return false
    }

    let rol = Hue.get_role(uname)

    if ((rol === "admin" || rol.startsWith("op")) && Hue.role !== "admin") {
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

// Announces that all banned users were unbanned
Hue.announce_unban_all = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} unbanned all banned users`
  )
}

// Checks if a user already has a certain role
Hue.is_already = function (who, what) {
  Hue.feedback(`${who} already has ${what}`)
}

// Starts click events for 'generic usernames'
// Username elements with this class get included
Hue.start_generic_uname_click_events = function () {
  $("body").on("click", ".generic_uname", function () {
    let uname = $(this).text()
    Hue.show_profile(uname)
  })
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

  if (r === "admin" || r.startsWith("op")) {
    return true
  } else {
    return false
  }
}

// Superuser command to change to any role
Hue.annex = function (rol = "admin") {
  if (!Hue.roles.includes(rol)) {
    Hue.feedback("Invalid role")
    return false
  }

  Hue.socket_emit("change_role", { username: Hue.username, role: rol })
}

Hue.setup_badges = function () {
  Hue.start_badge_timeout()
}

// Sends 1 badge to a user
// This has a cooldown
Hue.send_badge = function (username, type) {
  if (Hue.send_badge_disabled) {
    let n = Hue.utilz.round2(Hue.config.send_badge_cooldown / 1000, 1)
    let s = n === 1 ? "1 second" : `${n} seconds`
    Hue.msg_info.show(`You can send a badge every ${s}`)
    return false
  }

  if (username === Hue.username) {
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
      let profile_image_container = $(message)
        .find(".chat_profile_image_container")
        .eq(0)
      Hue.change_profile_image_badge(profile_image_container, data.type)
    }
  }
}

// Changes the profile image of a user receiving a badge
Hue.change_profile_image_badge = function (profile_image_container, type) {
  Hue.remove_badge_icons(profile_image_container)
  profile_image_container.addClass(`${type}_badge`)
  profile_image_container.addClass("profile_image_badge")

  let icon

  if (type === "heart") {
    icon = "fa fa-heart"
  } else if (type === "skull") {
    icon = "fa fa-skull"
  }

  profile_image_container.append(
    `<i class='${icon} profile_image_badge_icon ${type}_badge'>`
  )

  let number = profile_image_container.data("badge_feedback_number")

  if (!number) {
    number = 1
  } else {
    number += 1
  }

  profile_image_container.data("badge_feedback_number", number)

  setTimeout(function () {
    let number_2 = profile_image_container.data("badge_feedback_number")

    if (number !== number_2) {
      return false
    }

    Hue.remove_badge_icons(profile_image_container)
  }, Hue.config.badge_feedback_duration)
}

// Removes badge icons from profile image container
Hue.remove_badge_icons = function (profile_image_container) {
  profile_image_container.removeClass("heart_badge")
  profile_image_container.removeClass("skull_badge")
  profile_image_container.removeClass(`profile_image_badge`)
  profile_image_container.find(".profile_image_badge_icon").each(function () {
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

// Makes the title based on the last message and join date
Hue.get_user_info_title = function (user, include_username = false) {
  let last_message = ""
  let username = ""

  if (include_username) {
    username = `${user.username}\n`
  }

  if (user.last_message) {
    last_message = `Last Message: ${user.last_message.substring(0, 100)}\n`
  }

  let joined = `Joined: ${Hue.utilz.nice_date(user.date_joined)}`

  return `${username}${last_message}${joined}`
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
Hue.audio_clip_changed = function (data) {
  Hue.replace_property_in_userlist_by_username(
    data.username,
    "audio_clip",
    data.audio_clip,
    false
  )

  if (data.username === Hue.open_profile_username) {
    Hue.show_profile(data.username)
  }

  Hue.show_room_notification(
    data.username,
    `${data.username} changed their audio clip`
  )
}

// Add a user to the ignore list
Hue.ignore_user = function (username) {
  let list = $(`#global_settings_ignored_usernames`)
  let lines = list.val().split("\n")

  for (let line of lines) {
    if (line === username) {
      Hue.feedback(`${username} is already ignored`)
      return false
    }
  }

  list.val(`${list.val()}\n${username}`)
  Hue.feedback(`${username} ignored`)
  Hue.user_settings.ignored_usernames.action("global_settings")
}

// Remove a user from the ignore list
Hue.unignore_user = function (username) {
  let list = $(`#global_settings_ignored_usernames`)
  let lines = list.val().split("\n")
  let new_lines = []

  for (let line of lines) {
    if (line !== username) {
      new_lines.push(line)
    }
  }

  if(lines.length == new_lines.length) {
    Hue.feedback(`${username} is already unignored`)
    return false
  }
  
  list.val(new_lines.join("\n"))
  Hue.feedback(`${username} unignored`)
  Hue.user_settings.ignored_usernames.action("global_settings")
}

// Show the ignored list
Hue.show_ignored = function () {
  if (Hue.ignored_usernames_list.length === 0) {
    Hue.feedback("No users are ignored")
    return false
  }

  let s = `Ignored: ${Hue.ignored_usernames_list.join(", ")}`
  Hue.feedback(s)
}