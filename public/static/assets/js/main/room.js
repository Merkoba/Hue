// Gets the room state localStorage object
Hue.get_room_state = function () {
  let room_state_all = Hue.get_local_storage(Hue.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  Hue.room_state = room_state_all[Hue.room_id]

  if (Hue.room_state === undefined) {
    Hue.room_state = {}
  }

  let changed = false

  for (let key in Hue.config) {
    if (key.startsWith("room_state_default_")) {
      let setting = key.replace("room_state_default_", "")
      if (Hue.room_state[setting] === undefined) {
        Hue.room_state[setting] = Hue.config[key]
        changed = true
      }
    }
  }

  if (changed) {
    Hue.save_room_state()
  }
}

// Saves the room state localStorage object
Hue.save_room_state = function () {
  let room_state_all = Hue.get_local_storage(Hue.ls_room_state)

  if (room_state_all === null) {
    room_state_all = {}
  }

  room_state_all[Hue.room_id] = Hue.room_state
  Hue.save_local_storage(Hue.ls_room_state, room_state_all)
}

// Show the room name
Hue.show_room_name = function () {
  Hue.checkmsg(`Room: ${Hue.room_name}`)
}

// Change the name of the room
Hue.change_room_name = function (arg) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  arg = Hue.utilz.single_space(
    arg.substring(0, Hue.config.max_room_name_length)
  )

  if (arg === Hue.room_name) {
    Hue.checkmsg("That's already the room name")
    return
  }

  if (arg.length > 0) {
    Hue.socket_emit("change_room_name", { name: arg })
  }
}

// Gets the topic
Hue.get_topic = function () {
  if (Hue.topic) {
    return Hue.topic
  } else {
    return Hue.config.default_topic
  }
}

// Shows the topic
Hue.show_topic = function () {
  Hue.show_info(Hue.get_topic(), "Topic")
}

// Announces room name changes
Hue.announce_room_name_change = function (data) {
  if (data.name !== Hue.room_name) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed the room name`
    )

    Hue.set_room_name(data.name)
    Hue.update_title()
    Hue.update_input_placeholder()
  }
}

// Room name setter
Hue.set_room_name = function (name) {
  Hue.room_name = name
  Hue.config_admin_room_name()
}

// Changes the topic
Hue.change_topic = function (dtopic) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  dtopic = Hue.utilz.single_space(
    dtopic.substring(0, Hue.config.max_topic_length)
  )

  if (dtopic.length > 0) {
    if (Hue.topic !== dtopic) {
      Hue.socket_emit("change_topic", { topic: dtopic })
    } else {
      Hue.checkmsg("Topic is already set to that")
    }
  }
}

// Announces topic changes
Hue.announce_topic_change = function (data) {
  if (data.topic !== Hue.topic) {
    Hue.show_room_notification(
      data.username,
      `${data.username} changed the topic`
    )

    Hue.set_topic_info(data)
    Hue.update_title()
  }
}

// Sets topic data with received data
Hue.set_topic_info = function (data) {
  if (!data) {
    data = {}
    data.topic = ""
  }

  Hue.topic = data.topic
  Hue.config_admin_topic()
}

// Requests the admin activity list from the server
Hue.request_admin_activity = function (filter = "") {
  if (!Hue.is_admin_or_op()) {
    Hue.not_an_op()
    return false
  }

  Hue.admin_activity_filter_string = filter

  Hue.socket_emit("get_admin_activity", {})
}

// Shows the admin activity list
Hue.show_admin_activity = function (messages) {
  Hue.el("#admin_activity_container").innerHTML = ""

  Hue.msg_admin_activity.show(function () {
    for (let message of messages) {
      let nice_date = Hue.utilz.nice_date(message.date)

      let s = `<div class='admin_activity_message'></div><div class='admin_activity_date'></div>`

      let el = Hue.div("modal_item admin_activity_item dynamic_title")
      el.title = nice_date
      el.innerHTML = s

      Hue.el(".admin_activity_message", el).textContent = `${message.data.username} ${message.data.content}`
      Hue.el(".admin_activity_date", el).textContent = nice_date
      Hue.dataset(el, "date", message.date)
      Hue.dataset(el, "otitle", nice_date)
      Hue.el("#admin_activity_container").prepend(el)
    }

    Hue.el("#admin_activity_filter").value = Hue.admin_activity_filter_string
    Hue.do_modal_filter()
  })
}

// Requests the admin list
Hue.request_admin_list = function () {
  if (!Hue.is_admin_or_op()) {
    Hue.not_an_op()
    return false
  }

  Hue.socket_emit("get_admin_list", {})
}

// Shows the admin list
Hue.show_admin_list = function (data) {
  data.list.sort(Hue.compare_userlist)

  let container = Hue.div("grid_column_center")
  container.id = "admin_list_container"

  for (let user of data.list) {
    let el = Hue.div("admin_list_item action")
    el.innerHTML = Hue.template_admin_list_item()

    Hue.el(".admin_list_username", el).textContent = user.username
    Hue.el(".admin_list_role", el).textContent = `(${Hue.get_pretty_role_name(user.role)})`

    el.addEventListener("click", function () {
      Hue.show_profile(user.username, user.user_id)
    })

    container.append(el)
  }

  Hue.msg_info.show([`Admin List (${data.list.length})`, container], function () {
    Hue.admin_list_open = true
  })
}

// Requests the ban list
Hue.request_ban_list = function () {
  if (!Hue.is_admin_or_op()) {
    Hue.not_an_op()
    return false
  }

  Hue.socket_emit("get_ban_list", {})
}

// Shows the ban list
Hue.show_ban_list = function (data) {
  let container = Hue.div("grid_column_center")
  container.id = "ban_list_container"

  for (let user of data.list) {
    let el = Hue.div("ban_list_item")
    el.innerHTML = Hue.template_ban_list_item()

    let username = Hue.el(".ban_list_username", el)
    username.textContent = user.username

    username.addEventListener("click", function () {
      Hue.show_profile(user.username, user.user_id)
    })

    let unban = Hue.el(".ban_list_unban", el)

    unban.addEventListener("click", function () {
      Hue.show_confirm(`Unban ${user.username}`, "", function () {
        Hue.unban(user.username)
      })     
    })

    container.append(el)
  }

  Hue.msg_info.show([`Ban List (${data.list.length})`, container], function () {
    Hue.ban_list_open = true
  })
}

// Setups theme and background variables from initial data
Hue.setup_theme = function (data) {
  Hue.set_background(data, false)
  Hue.background_color = data.background_color
  Hue.text_color = data.text_color
}

// Sets an applies background images from data
Hue.set_background = function (data, apply = true) {
  if (!data.background) {
    return
  }

  if (data.background_type === "hosted") {
    let ver = `?ver=${data.background_version}`
    let bg = data.background + ver
    Hue.background = `${Hue.config.public_media_directory}/room/${Hue.room_id}/${bg}`
  } else {
    Hue.background = data.background
  }

  Hue.config_admin_background()

  if (apply) {
    Hue.apply_background()
  }
}

// Applies the background to all background elements
Hue.apply_background = function () {
  if (Hue.background) {
    Hue.els(".background").forEach(it => {
      it.src = Hue.background
    })
  }
}

// Background color setter
Hue.set_background_color = function (color) {
  Hue.background_color = color
  Hue.apply_theme()
  Hue.config_admin_background_color()
}

// This is where the color theme gets built and applied
// This builds CSS declarations based on the current background color
// The CSS declarations are inserted into the DOM
// Older declarations get removed
Hue.apply_theme = function () {
  let theme = Hue.background_color

  if (theme.startsWith("#")) {
    theme = Hue.colorlib.hex_to_rgb(theme)
  }

  let background_color = theme
  let font_color = Hue.colorlib.hex_to_rgb(Hue.text_color)

  let altcolor = Hue.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = Hue.colorlib.rgb_to_rgba(altcolor,  0.7)
  let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = Hue.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = Hue.colorlib.rgb_to_rgba(altbackground, 0.7)
  let font_color_a = Hue.colorlib.rgb_to_rgba(font_color,  0.7)
  
  document.documentElement.style.setProperty('--font_color', font_color)
  document.documentElement.style.setProperty('--font_color_a', font_color_a)
  document.documentElement.style.setProperty('--altcolor', altcolor)
  document.documentElement.style.setProperty('--altcolor_a', altcolor_a)
  document.documentElement.style.setProperty('--background_color', background_color)
  document.documentElement.style.setProperty('--background_color_a', background_color_a)
  document.documentElement.style.setProperty('--altbackground', altbackground)
  document.documentElement.style.setProperty('--altbackground_a', altbackground_a)
}

// Changes the background color
Hue.change_background_color = function (color) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  color = Hue.utilz.no_space(color).toLowerCase()

  if (color === undefined) {
    return false
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.checkmsg("Not a valid hex color value")
    return false
  }

  if (color === Hue.background_color) {
    return false
  }

  Hue.socket_emit("change_background_color", { color: color })
}

// Announces background color change
Hue.announce_background_color_change = function (data) {
  Hue.show_room_notification(data.username, `${data.username} changed the background color to ${data.color}`)
  Hue.set_background_color(data.color)
}

// Picker window to select how to change the background image
Hue.open_background_select = function () {
  Hue.msg_info.show([
    "Background Image",
    Hue.template_background_select(),
  ], function () {
    Hue.el("#background_select_draw").addEventListener("click", function () {
      Hue.msg_info.close()
      Hue.open_draw_image("background")
    })

    Hue.el("#background_select_url").addEventListener("click", function () {
      Hue.open_background_input()
    })

    Hue.el("#background_select_upload").addEventListener("click", function () {
      Hue.msg_info.close()
      Hue.open_background_picker()
    })
  })
  
  Hue.horizontal_separator(Hue.el("#background_select_container"))
}

// If upload is chosen as the method to change the background image
Hue.open_background_picker = function () {
  Hue.el("#background_input").click()
}

// If a URL source is chosen as the method to change the background image
// this window is opened
Hue.open_background_input = function () {
  Hue.msg_info.show(
    ["Change Background", Hue.template_background_input()],
    function () {
      Hue.el("#background_input_submit").addEventListener("click", function () {
        Hue.background_input_action()
      })

      Hue.el("#background_input_text").focus()
      Hue.background_input_open = true
    }
  )
}

// On background image source input change
Hue.background_input_action = function () {
  let src = Hue.el("#background_input_text").value.trim()

  if (Hue.change_background_source(src)) {
    Hue.msg_info.close()
  }
}

// On background image selected for upload
Hue.background_selected = function (file) {
  if (!file) {
    return false
  }

  if (!Hue.is_admin_or_op()) {
    return false
  }

  for (let date in Hue.files) {
    let f = Hue.files[date]

    if (f.hue_data.action === "background_upload") {
      Hue.cancel_file_upload(date)
    }
  }

  let size = file.size / 1024

  Hue.el("#background_input").closest("form").reset()

  if (size > Hue.config.max_image_size) {
    Hue.checkmsg("File is too big")
    return false
  }

  Hue.el("#admin_background").src = Hue.config.background_loading_url
  Hue.upload_file({ file: file, action: "background_upload" })
}

// Change the background image with a URL
Hue.change_background_source = function (src) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  if (src === undefined) {
    return false
  }

  if (src !== "default") {
    if (!Hue.utilz.is_url(src)) {
      return false
    }

    src = src.replace(/\.gifv/g, ".gif")

    if (src === Hue.background) {
      Hue.checkmsg("Background image is already set to that")
      return false
    }

    if (src.length === 0) {
      return false
    }

    if (src.length > Hue.config.max_media_source_length) {
      return false
    }

    if (!Hue.utilz.is_image(src)) {
      return false
    }
  }

  Hue.socket_emit("change_background_source", { src: src })

  return true
}

// Announces background image changes
Hue.announce_background_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background image`
  )

  Hue.set_background(data)
}

// Changes the text color
Hue.change_text_color = function (color) {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  color = Hue.utilz.no_space(color).toLowerCase()

  if (color === undefined) {
    return false
  }

  if (!Hue.utilz.validate_hex(color)) {
    Hue.checkmsg("Not a valid hex color value")
    return false
  }

  if (color === Hue.text_color) {
    return false
  }

  Hue.socket_emit("change_text_color", { color: color })
}

// Announces text color changes
Hue.announce_text_color_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the text color to ${data.color}`
  )

  Hue.set_text_color(data.color)
}

// Text color setter
Hue.set_text_color = function (color) {
  Hue.text_color = color
  Hue.apply_theme()
  Hue.config_admin_text_color()
}