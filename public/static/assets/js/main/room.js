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

  let settings = [
    "image_enabled",
    "tv_enabled",
    "last_highlight_date",
    "chat_display_percentage",
    "tv_display_percentage",
    "tv_display_position",
    "media_layout",
    "last_message_board_post",
    "main_layout"
  ]

  for (let setting of settings) {
    if (Hue.room_state[setting] === undefined) {
      Hue.room_state[setting] = Hue.config[`room_state_default_${setting}`]
      changed = true
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
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  arg = Hue.utilz.clean_string2(
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
  let topic = `Topic: ${Hue.get_topic()}`
  Hue.checkmsg(topic)
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
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  dtopic = Hue.utilz.clean_string2(
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
  if (!Hue.is_admin_or_op(Hue.role)) {
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

      let s = `
        <div class='modal_item admin_activity_item dynamic_title' title='${nice_date}'>
            <div class='admin_activity_message'></div>
            <div class='admin_activity_date'></div>
        </div>`

      let el0 = document.createElement("div")
      el0.innerHTML = s
      let el = el0.firstElementChild
      el.querySelector(".admin_activity_message").textContent = `${message.data.username} ${message.data.content}`
      el.querySelector(".admin_activity_date").textContent = nice_date
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
  if (!Hue.is_admin_or_op(Hue.role)) {
    Hue.not_an_op()
    return false
  }

  Hue.socket_emit("get_admin_list", {})
}

// Shows the admin list
Hue.show_admin_list = function (data) {
  data.list.sort(Hue.compare_userlist)

  let el = document.createElement("div")
  el.id = "admin_list_container"
  el.classList.add("grid_column_center")

  for (let user of data.list) {
    let hs = `
      <div class='flex_row_center'><div class='admin_list_username'>
      </div>&nbsp;&nbsp;<div class='admin_list_role'></div></div>`

    let h = `<div class='admin_list_item action'>${hs}</div>`
    let hel0 = document.createElement("div")
    hel0.innerHTML = h
    let hel = hel0.firstElementChild

    hel.querySelector(".admin_list_username").textContent = user.username
    hel.querySelector(".admin_list_role").textContent = `(${Hue.get_pretty_role_name(user.role)})`

    hel.addEventListener("click", function () {
      Hue.show_profile(user.username)
    })

    el.append(hel)
  }

  Hue.msg_info2.show([`Admin List (${data.list.length})`, el], function () {
    Hue.admin_list_open = true
  })
}

// Requests the ban list
Hue.request_ban_list = function () {
  if (!Hue.is_admin_or_op(Hue.role)) {
    Hue.not_an_op()
    return false
  }

  Hue.socket_emit("get_ban_list", {})
}

// Shows the ban list
Hue.show_ban_list = function (data) {
  let el = document.createElement("div")
  el.id = "ban_list_container"
  el.classList.add("grid_column_center")

  for (let user of data.list) {
    let hs = `<div class='flex_row_center'><div class='ban_list_username' title='Click To Unban'></div></div>`
    let h = `<div class='ban_list_item action'>${hs}</div>`
    let hel0 = document.createElement("div")
    hel0.innerHTML = h
    let hel = hel0.firstElementChild

    hel.querySelector(".ban_list_username").textContent = user.username

    hel.addEventListener("click", function () {
      Hue.show_confirm(`Unban ${user.username}`, "", function () {
        Hue.unban(user.username)
      })
    })

    el.append(hel)
  }

  Hue.msg_info2.show([`Ban List (${data.list.length})`, el], function () {
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
  if (data.background !== "") {
    if (data.background_type === "hosted") {
      let ver = `?ver=${data.background_version}`
      let bg = data.background + ver
      Hue.background = `${Hue.config.public_media_directory}/room/${Hue.room_id}/${bg}`
    } else {
      Hue.background = data.background
    }
  } else {
    Hue.background = Hue.config.default_background_url
  }

  Hue.config_admin_background()

  if (apply) {
    Hue.apply_background()
  }
}

// Setups background
Hue.setup_background = function () {
  Hue.els(".background").forEach(it => {
    it.addEventListener("error", function () {
      if (this.src !== Hue.config.default_background_url) {
        this.src = Hue.config.default_background_url
      }    
    })
  })
}

// Applies the background to all background elements
Hue.apply_background = function () {
  Hue.els(".background").forEach(it => {
    it.src = Hue.background
  })
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
  let font_color = Hue.text_color

  let altcolor = Hue.colorlib.get_lighter_or_darker(background_color, 0.2)
  let altcolor_a = Hue.colorlib.rgb_to_rgba(altcolor,  0.7)
  let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, 0.95)
  let altbackground = Hue.colorlib.get_lighter_or_darker(background_color, 0.09)
  let altbackground_a = Hue.colorlib.rgb_to_rgba(altbackground, 0.7)

  document.documentElement.style.setProperty('--font_color', font_color)
  document.documentElement.style.setProperty('--altcolor', altcolor)
  document.documentElement.style.setProperty('--altcolor_a', altcolor_a)
  document.documentElement.style.setProperty('--background_color', background_color)
  document.documentElement.style.setProperty('--background_color_a', background_color_a)
  document.documentElement.style.setProperty('--altbackground', altbackground)
  document.documentElement.style.setProperty('--altbackground_a', altbackground_a)
}

// Changes the background color
Hue.change_background_color = function (color) {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  color = Hue.utilz.clean_string5(color).toLowerCase()

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
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the background color to ${data.color}`
  )
  Hue.set_background_color(data.color)
}

// Picker window to select how to change the background image
Hue.open_background_select = function () {
  Hue.msg_info2.show([
    "Change Background",
    Hue.template_background_select(),
  ], function () {
    Hue.el("#background_select_draw").addEventListener("click", function () {
      Hue.msg_info2.close()
      Hue.open_draw_image("background")
    })

    Hue.el("#background_select_url").addEventListener("click", function () {
      Hue.open_background_input()
    })

    Hue.el("#background_select_upload").addEventListener("click", function () {
      Hue.msg_info2.close()
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
  Hue.msg_info2.show(
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
    Hue.msg_info2.close()
  }
}

// On background image selected for upload
Hue.background_selected = function (file) {
  if (!file) {
    return false
  }

  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
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
  if (!Hue.is_admin_or_op(Hue.role)) {
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

    let extension = Hue.utilz.get_extension(src).toLowerCase()

    if (!extension || !Hue.utilz.image_extensions.includes(extension)) {
      return false
    }
  } else {
    if (Hue.background === Hue.config.default_background_url) {
      Hue.checkmsg("Background image is already set to that")
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
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  color = Hue.utilz.clean_string5(color).toLowerCase()

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
  Hue.apply_theme()
}

// Text color setter
Hue.set_text_color = function (color) {
  Hue.text_color = color
  Hue.config_admin_text_color()
}