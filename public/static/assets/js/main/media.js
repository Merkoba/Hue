// Setups media
Hue.setup_media = function () {
  Hue.el("#media_image_frame").addEventListener("click", function () {
    Hue.show_modal_image()
  })

  Hue.el("#media_image_error").addEventListener("click", function () {
    Hue.show_modal_image()
  })

  Hue.el(".media_picker_content", Hue.msg_image_picker.window).addEventListener("click", function (e) {
    Hue.media_picker_item_click(e.target)
  })

  Hue.el(".media_picker_content", Hue.msg_tv_picker.window).addEventListener("click", function (e) {
    Hue.media_picker_item_click(e.target)
  })
}

// On media picker item click
Hue.media_picker_item_click = function (el) {
  let container = el.closest(".announcement_content_container")

  if (container) {
    if (el.closest(".chat_username")) {
      return
    }

    if (el.closest(".chat_menu_button")) {
      return
    }

    if (el.closest(".announcement_content")) {
      return
    }

    Hue.el(".announcement_content", container).click()
  }
}

// Get min or max media percentage
Hue.limit_media_percentage = function (size) {
  if (size < Hue.media_min_percentage) {
    size = Hue.media_min_percentage
  } else if (size > Hue.media_max_percentage) {
    size = Hue.media_max_percentage
  }

  return size
}

// Applies percentages changes to the chat and media elements based on current state
Hue.apply_media_percentages = function () {
  let mode = Hue.room_state.media_layout
  let p1 = Hue.limit_media_percentage(Hue.room_state.tv_display_percentage)
  let p2 = 100 - p1

  if (mode === "column") {
    Hue.el("#media_tv").style.height = `${p1}%`
    Hue.el("#media_image").style.height = `${p2}%`
    Hue.el("#media_tv").style.width = "100%"
    Hue.el("#media_image").style.width = "100%"
  } else if (mode === "row") {
    Hue.el("#media_tv").style.width = `${p1}%`
    Hue.el("#media_image").style.width = `${p2}%`
    Hue.el("#media_tv").style.height = "100%"
    Hue.el("#media_image").style.height = "100%"
  }

  let c1 = Hue.limit_media_percentage(Hue.room_state.chat_display_percentage)
  let c2 = 100 - c1

  if (Hue.room_state.main_layout === "column") {
    Hue.el("#main_rows_container").style.flexDirection = "column-reverse"
    Hue.el("#chat_main").style.height = `${c1}%`
    Hue.el("#media").style.height = `${c2}%`
    Hue.el("#chat_main").style.width = "100%"
    Hue.el("#media").style.width = "100%"
  } else {
    Hue.el("#main_rows_container").style.flexDirection = "row"
    Hue.el("#chat_main").style.width = `${c1}%`
    Hue.el("#media").style.width = `${c2}%`
    Hue.el("#chat_main").style.height = "100%"
    Hue.el("#media").style.height = "100%"
  }

  Hue.fix_frames()
  Hue.goto_bottom()
}

// Applies the image and tv positions based on current state
Hue.apply_media_positions = function () {
  let p = Hue.room_state.tv_display_position
  let tvp
  let ip

  if (p === "top") {
    tvp = 1
    ip = 2
  } else if (p === "bottom") {
    tvp = 2
    ip = 1
  }

  Hue.el("#media_image").style.order = ip
  Hue.el("#media_tv").style.order = tvp
}

Hue.swap_display_positions = function () {
  Hue.room_state.tv_display_position =
    Hue.room_state.tv_display_position === "top" ? "bottom" : "top"
  Hue.save_room_state()
  Hue.apply_media_positions()
}

// Initial change for current media
Hue.start_active_media = function () {
  Hue.change_media({
    type: "image",
    play: false
  })

  Hue.change_media({
    type: "tv",
    play: false
  })

  Hue.first_media_change = true
}

// Removes and item from a media changed array
Hue.remove_item_from_media_changed = function (type, id) {
  Hue[`${type}_changed`] = Hue[`${type}_changed`].filter((x) => x.id !== id)
}

// Checks how many elements (image, tv) are visible in the media section
Hue.num_media_elements_visible = function () {
  let num = 0

  Hue.els("#media_split .media_main_container").forEach(it => {
    if (it.style.display !== "none") {
      num += 1
    }
  })

  return num
}

// Tries to separate a comment from a URL when using change media commands
// The proper way is to use '/image url > comment'
// But if the > is ommitted it will still try to determine what each part is
Hue.get_media_change_inline_comment = function (type, source) {
  let comment = Hue.el(`#link_${type}_comment`).value

  if (comment) {
    // OK
  } else if (source.includes(">")) {
    let split = source.split(">")

    source = split[0].trim()
    comment = split.slice(1).join(">").trim()
  } else {
    let split = source.split(" ")
    let url = ""
    let cm = []

    for (let sp of split) {
      if (Hue.utilz.is_url(sp)) {
        if (!url) {
          url = sp
        }
      } else {
        cm.push(sp)
      }
    }

    if (url && cm.length > 0) {
      source = url
      comment = cm.join(" ")
    }
  }

  return {
    source: source,
    comment: comment
  }
}

// Creates a media object from initial data
// For instance it gets all the 'tv_*' properties
Hue.get_media_object_from_init_data = function (type) {
  let obj = {}

  for (let key in Hue.init_data) {
    if (key.startsWith(`${type}_`)) {
      obj[key.replace(`${type}_`, "")] = Hue.init_data[key]
    }
  }

  return obj
}

// Hides the media area (image and tv)
Hue.hide_media = function () {
  Hue.el("#media").style.display = "none"
}

// Setups media modes from initial data
Hue.setup_active_media = function () {
  Hue.media_visibility_and_locks()
}

// Changes media visibility and locks based on current state
Hue.media_visibility_and_locks = function () {
  Hue.change_media_visibility("image")
  Hue.change_media_visibility("tv")

  if (Hue.connections === 1) {
    Hue.change_media_lock_text("image")
    Hue.change_media_lock_text("tv")
  }
}

// More media picker configurations
Hue.setup_media_pickers = function () {
  Hue.el("#image_picker_link").addEventListener("click", function () {
    Hue.msg_image_picker.close()
    Hue.show_link_image()
  })

  Hue.el("#image_picker_upload").addEventListener("click", function () {
    Hue.msg_image_picker.close()
  })
  
  Hue.el("#image_picker_draw").addEventListener("click", function () {
    Hue.msg_image_picker.close()
    Hue.open_draw_image("image")
  })

  Hue.el("#image_picker_random").addEventListener("click", function () {
    Hue.msg_image_picker.close()
    Hue.make_random_image("image")
  })

  Hue.el("#image_picker_screenshot").addEventListener("click", function () {
    Hue.msg_image_picker.close()
    Hue.take_screenshot()
  })
  
  Hue.el("#tv_picker_link").addEventListener("click", function () {
    Hue.msg_tv_picker.close()
    Hue.show_link_tv()
  }) 
  
  Hue.el("#tv_picker_upload").addEventListener("click", function () {
    Hue.msg_tv_picker.close()
  })

  Hue.el("#tv_picker_capture").addEventListener("click", function () {
    Hue.msg_tv_picker.close()
    Hue.screen_capture()
  })

  Hue.el("#image_picker_upload").addEventListener("click", function () {
    Hue.msg_tv_picker.close()
    Hue.show_upload_image()
  })

  Hue.el("#tv_picker_upload").addEventListener("click", function () {
    Hue.msg_tv_picker.close()
    Hue.show_upload_tv()
  })
}

// Setup tv link window
Hue.setup_media_link = function () {
  Hue.el("#link_image_submit").addEventListener("click", function () {
    Hue.link_image_submit()
  })

  Hue.el("#link_tv_submit").addEventListener("click", function () {
    Hue.link_tv_submit()
  })
}

// Updates the dimensions of a specified element
// It grows the element as much as it can while maintaining the aspect ratio
// This is done by making calculations with the element and parent's ratios
Hue.fix_frame = function (frame_id, test_parent_height = false) {
  let frame = Hue.el(`#${frame_id}`)
  let frame_ratio

  if (frame_id === "media_image_frame") {
    frame_ratio = frame.naturalHeight / frame.naturalWidth
  } else {
    frame_ratio = 0.5625
  }

  let parent = frame.parentElement
  let info_height = 0
  let info = Hue.els(".media_info", frame.parentElement)

  if (info.length > 0) {
    info_height = info[0].offsetHeight
  }

  let parent_width = parent.offsetWidth

  let parent_height = test_parent_height ?
    test_parent_height :
    parent.offsetHeight - info_height
  let parent_ratio = parent_height / parent_width
  let width, height

  if (parent_ratio === frame_ratio) {
    width = parent_width
    height = parent_height
  } else if (parent_ratio < frame_ratio) {
    width = parent_height / frame_ratio
    height = parent_height
  } else if (parent_ratio > frame_ratio) {
    width = parent_width
    height = parent_width * frame_ratio
  }

  if (!test_parent_height) {
    frame.style.width = `${width}px`
    frame.style.height = `${height}px`
  } else {
    return {
      width: width,
      height: height,
      parent_width: parent_width,
      parent_height: parent_height,
    }
  }
}

// Updates dimensions of the image and tv
Hue.fix_frames = function () {
  if (!Hue.started) {
    return
  }

  Hue.fix_tv_frame()
  Hue.fix_image_frame()
}

// This handles all media load
// It will attempt to load and play media taking into account the room state
// It is responsible to initiate the construction of all required media players
Hue.change_media = function (args = {}) {
  let def_args = {
    type: "",
    force: false,
    play: true,
    notify: true,
    current_source: false,
    item: false
  }

  args = Object.assign(def_args, args)

  let item

  if (args.item) {
    item = args.item
  } else if (args.current_source && Hue[`loaded_${args.type}`].source) {
    item = Hue[`loaded_${args.type}`]
  } else {
    item = Hue[`current_${args.type}`]()
  }

  if (!Hue.has_focus) {
    if (args.notify && item.username !== Hue.username) {
      Hue.on_activity("media_change")
    }
    
    return
  }

  if (args.type === "image") {
    if (!args.force && Hue.loaded_image.source === Hue.current_image().source) {
      Hue.loaded_image = item
      return false
    }
  } else if (args.type === "tv") {
    if (!args.force && Hue.loaded_tv.source === Hue.current_tv().source) {
      Hue.loaded_tv = item
      return false
    }
  } else {
    return false
  }

  if (args.type === "image") {
    if (!Hue.room_state.image_enabled) {
      return false
    }

    if (
      !args.item &&
      Hue.image_locked &&
      Hue.loaded_image.source &&
      !args.current_source
    ) {
      return false
    }

    if (!Hue.room_state.image_enabled) {
      return false
    }

    Hue.loaded_image = item
    Hue.show_image(args.force)
  } else if (args.type === "tv") {
    if (!Hue.room_state.tv_enabled) {
      return false
    }

    if (!args.item && 
      Hue.tv_locked && 
      Hue.loaded_tv.source && 
      !args.current_source
    ) {
      return false
    }

    if (!Hue.room_state.tv_enabled) {
      return false
    }

    if (!Hue.loaded_tv.source && !args.force) {
      args.play = false
    }

    if (item.type !== "video" && item.type !== "iframe") {
      if (Hue[`${item.type}_tv_player`] === undefined) {
        Hue.request_media(`${item.type}_tv_player`, args)
        return false
      }
    }

    Hue.loaded_tv = item

    Hue[`show_${item.type}_tv`](args.play)

    if (args.play) {
      Hue.after_tv_play()
    }
  } else {
    return false
  }
}

// Sets a media info item with proper information and events
Hue.apply_media_info = function (type) {
  if (!Hue[`${type}_visible`]) {
    return false
  }

  let item = Hue[`loaded_${type}`]

  if (!item.type) {
    return false
  }

  let message = item.message.substring(0, Hue.config.max_media_info_length).trim()
  let container = Hue.el(`#media_${type}_info_container`)
  container.style.visibility = "initial"
  
  Hue.el(".media_info", container).innerHTML = Hue.template_media_info_inner({
    username: item.username, 
    message: message,
    profilepic: Hue.get_profilepic(item.user_id)
  })
  
  Hue.el(".media_info_timeago", container).textContent = Hue.utilz.timeago(item.date)
  container.title = item.info

  Hue.el(".media_info_profilepic", container).addEventListener("error", function () {
    Hue.fallback_profilepic(this)
  })
    
  Hue.dataset(container, "otitle", item.info)
  Hue.dataset(container, "date", item.date)
  Hue.dataset(container, "type", type)
  Hue.dataset(container, "id", item.id)
  Hue.dataset(container, "username", item.username)
  Hue.dataset(container, "user_id", item.user_id)
}

// Some fixes on reconneciton
Hue.fix_media_info = function () {
  Hue.apply_media_info("image")
  Hue.apply_media_info("tv")
}

// Toggles media visibility
Hue.toggle_media = function (args) {
  let def_args = {
    type: "",
    what: undefined, 
    save: true,
    feedback: false
  }

  args = Object.assign(def_args, args)

  let new_val

  if (args.what !== undefined) {
    if (Hue.room_state[`${args.type}_enabled`] !== args.what) {
      new_val = args.what
    } else {
      new_val = Hue.room_state[`${args.type}_enabled`]
      save = false
    }
  } else {
    new_val = !Hue.room_state[`${args.type}_enabled`]
  }

  if (new_val === Hue.room_state[`${args.type}_enabled`]) {
    return
  }
  
  Hue.room_state[`${args.type}_enabled`] = new_val
  
  if (Hue[`${args.type}_visible`] !== args.what) {
    Hue.change_media_visibility(args.type)
  }
  
  let p = Hue.room_state.tv_display_percentage
  
  if (p === 0 || p === 100) {
    Hue.set_default_tv_size()
  } else if (args.save) {
    Hue.save_room_state()
  }
  
  Hue.update_footer_toggle(args.type)

  if (args.feedback) {
    let ctype = Hue.media_string(args.type)

    if (new_val) {
      Hue.flash_info("Info", `${ctype} is now visible`)
    } else {
      Hue.flash_info("Info", `${ctype} is now invisible`)
    }
  }
}

// Change the lock of some media
Hue.change_media_lock = function(args) {
  let def_args = {
    type: "",
    what: undefined,  
    feedback: false,
    change: true
  }

  args = Object.assign(def_args, args)
  
  let new_val
  
  if (args.what !== undefined) {
    new_val = args.what
  } else {
    new_val = !Hue[`${args.type}_locked`]
  }

  if (new_val === Hue[`${args.type}_locked`]) {
    return
  }

  Hue[`${args.type}_locked`] = new_val
  Hue.change_media_lock_text(args.type)

  if (!new_val && args.change) {
    Hue.change_media({type: args.type})
  }

  if (args.feedback) {
    let ctype = Hue.media_string(args.type)

    if (new_val) {
      Hue.flash_info("Info", `${ctype} is now locked`)
    } else {
      Hue.flash_info("Info", `${ctype} is now unlocked`)
    }
  }
}

// Toggles media locks for any type
Hue.change_media_lock_text = function (type) {
  if (Hue[`${type}_locked`]) {
    Hue.el(`#footer_${type}_lock`).textContent = "Unlock"
    Hue.el(`#footer_${type}_lock`).textContent = "Unlock"
    Hue.el(`#footer_${type}_lock`).classList.add("underlined")
  } else {
    Hue.el(`#footer_${type}_lock`).textContent = "Lock"
    Hue.el(`#footer_${type}_lock`).classList.remove("underlined")
  }
}

// Changes the media layout between row and column
Hue.change_media_layout = function (mode = false) {
  if (!mode) {
    mode = Hue.room_state.media_layout
  }

  if (mode === "column") {
    Hue.el("#media_split").style.flexDirection = "column"

    Hue.els(".media_main_container").forEach(it => {
      it.style.width = "100%"
      it.style.height = "50%"
    })
  } else if (mode === "row") {
    Hue.el("#media_split").style.flexDirection = "row"

    Hue.els(".media_main_container").forEach(it => {
      it.style.width = "50%"
      it.style.height = "100%"
    })
  }

  Hue.apply_media_percentages()
  Hue.fix_frames()
}

// Apply default media layout
Hue.set_default_media_layout = function () {
  Hue.room_state.media_layout = Hue.config.room_state_default_media_layout
  Hue.save_room_state()
  Hue.change_media_layout()
}

// Switches between row and column media layout mode
Hue.swap_media_layout = function () {
  Hue.room_state.media_layout = Hue.room_state.media_layout === "row" ? "column" : "row"
  Hue.save_room_state()
  Hue.change_media_layout()
}

// Swaps media
Hue.swap_media = function () {
  if (Hue.num_media_elements_visible() < 2) {
    return false
  }
  
  Hue.swap_display_positions()
}

// Default image and tv position
Hue.set_default_tv_position = function () {
  Hue.room_state.tv_display_position = Hue.config.room_state_default_tv_display_position
  Hue.save_room_state()
  Hue.apply_media_positions()
}

// Rotates media
Hue.rotate_media = function () {
  if (Hue.num_media_elements_visible() < 2) {
    return false
  }

  Hue.swap_media_layout()
}

// Get html for media info items
Hue.get_media_info_html = function (type) {
  return Hue.template_media_info({type: type})
}

// Append media inf
Hue.append_media_info = function (container, type) {
  let el = Hue.div()
  el.innerHTML = Hue.get_media_info_html(type)
  Hue.el(container).append(el)
}

// Some initial media info setups
Hue.start_media_info = function () {
  Hue.append_media_info("#media_image_container", "image")
  
  Hue.el("#media").addEventListener("click", function (e) {
    let el = e.target.closest(".media_info_user")

    if (el) {
      let username = Hue.dataset(el.closest(".media_info_container"), "username")
      let user_id = Hue.dataset(el.closest(".media_info_container"), "user_id")
      Hue.show_profile(username, user_id)
    }
  })

  Hue.el("#media").addEventListener("click", function (e) {
    let el = e.target.closest(".media_info_details")

    if (el) {
      let media_info = el.closest(".media_info_container")
      let type = Hue.dataset(media_info, "type")
      let id = Hue.dataset(media_info, "id")
      Hue.open_url_menu_by_media_id(type, id)
    }
  })
}

// Get proper media string
Hue.media_string = function (what) {
  if (what === "chat") {
    return "Chat"
  } else if (what === "image") {
    return "Image"
  } else if (what === "tv") {
    return "TV"
  }
}

// Load or restart media
Hue.load_media = function (data) {
  Hue.toggle_media({type: data.media_type, what: true, feedback: true})
  Hue.change_media_lock({type: data.media_type, what: true, feedback: true})
  
  Hue.change_media({
    type: data.media_type,
    item: data,
    force: true
  })

  Hue.close_all_modals()
}

// Get media item by id
Hue.get_media_item = function (type, id) {
  for (let item of Hue[`${type}_changed`]) {
    if (item.id === id) {
      return item
    }
  }

  return {}
}

// Change the main layout row|column
Hue.change_main_layout = function (what = "") {
  if (what) {
    if (Hue.room_state.main_layout === what) {
      return
    }
    
    Hue.room_state.main_layout = what
  } else {
    if (Hue.room_state.main_layout === "row") {
      Hue.room_state.main_layout = "column"   
    } else {
      Hue.room_state.main_layout = "row" 
    }    
  }

  Hue.apply_media_percentages()
  Hue.goto_bottom(true)
  Hue.save_room_state()
}

// Set default main layout row|column
Hue.set_default_main_layout = function () {
  Hue.room_state.main_layout = Hue.config.room_state_default_main_layout
  Hue.save_room_state()
  Hue.apply_media_percentages()
}

// Show the open url menu with data
Hue.open_url_menu_by_media_id = function (type, id) {
  let data = Hue.get_media_item(type, id)
  Hue.open_url_menu(data)
}

// Send a media edit comment emit to the server
Hue.do_edit_media_comment = function (type, id, comment) {
  Hue.socket_emit("edit_media_comment", {
    type: type,
    id: id,
    comment: comment
  })
}

// After response from the server after editing media comment
Hue.edited_media_comment = function (data) {
  let oitem = undefined

  for (let item of Hue[`${data.type}_changed`]) {
    if (item.id === data.id) {
      item.comment = data.comment
      item.message = Hue.get_media_message(item)
      oitem = item
      break
    }
  }

  let messages = Hue.els(".media_announcement")

  for (let message of messages) {
    if (Hue.dataset(message, "id") === data.id) {
      if (Hue.dataset(message, "type") === `${data.type}_change`) {
        let content = Hue.el(".announcement_content", message)
        content.textContent = oitem.message
        let content_container = Hue.el(".announcement_content_container", message)
        Hue.dataset(content_container, "original_message", data.comment)
      }
    }
  }

  Hue.apply_media_info(data.type)

  if (Hue.msg_modal_image.is_open()) {
    if (Hue.loaded_modal_image.id === data.id) {
      Hue.show_modal_image(Hue.loaded_modal_image.id)
    }
  }
}

// Shows the media picker window
Hue.show_media_picker = function (type) {
  Hue[`msg_${type}_picker`].show()
}

// Load media picker
Hue.load_media_link = function (type, source, comment) {
  Hue.el(`#link_${type}_comment`).value = comment
  Hue.el(`#link_${type}_input`).value = source
  Hue[`msg_link_${type}`].show()
}

// Generate Image or TV item messages
Hue.get_media_message = function (data) {
  let message = ""

  if (data.title) {
    message = data.title
    if (data.comment) {
      message += ` (${data.comment})`
    }    
  } else if (data.comment) {
    message = data.comment
  }

  if (!message) {
    if (data.query) {
      message = data.query
    } 
  }

  if (!message) {
    if (data.size) {
      message = "Upload"
    } else {
      message = `Link (${data.hostname})`
    }
  }

  if (data.type === "youtube") {
    let time = Hue.utilz.get_youtube_time(data.source)

    if (time !== 0) {
      message += ` (At ${Hue.utilz.humanize_seconds(time)})`
    }
  }

  return message
}

// Setups a media object
// This handles media objects received live from the server or from logged messages
// This is the entry function for media objects to get registered, announced, and be ready for use
Hue.setup_media_object = function (type, mode, odata = {}) {
  let data = {}

  data.id = odata.id
  data.user_id = odata.user_id
  data.type = odata.type
  data.source = odata.source
  data.title = odata.title
  data.username = odata.username
  data.size = odata.size
  data.date = odata.date
  data.query = odata.query
  data.comment = odata.comment
  data.in_log = odata.in_log === undefined ? true : odata.in_log
  data.media_type = type

  if (!data.source) {
    return
  }

  if (data.type === "upload") {
    data.source = `${Hue.config.public_media_directory}/room/${Hue.room_id}/${type}/${data.source}`
  }

  data.nice_date = data.date
    ? Hue.utilz.nice_date(data.date)
    : Hue.utilz.nice_date()

  if (data.source.startsWith("/")) {
    data.source = window.location.origin + data.source
  } else if (data.source.startsWith(window.location.origin)) {
    if (!data.size) {
      for (let obj of Hue[`${type}_changed`]) {
        if (obj.source === data.source) {
          data.type = obj.type
          data.size = obj.size
          break
        }
      }
    }
  }

  if (!data.date) {
    data.date = Date.now()
  }

  data.info = data.id ? `${Hue.getcode(data.id)}` : ""
  data.info_html = ""

  if (data.size) {
    data.info += ` | Size: ${Hue.utilz.get_size_string(data.size)}`
    data.info_html += `<div>Size: ${Hue.utilz.get_size_string(data.size)}</div>`
  }

  if (data.query) {
    data.info += ` | Search Term: "${data.query}"`
  }

  data.info += ` | ${data.nice_date}`
  data.info_html += `<div title='${data.nice_date}' class='modal_${type}_timeago'></div>`
  data.hostname = Hue.utilz.get_hostname(data.source)
  data.message = Hue.get_media_message(data)

  if (data.message) {
    data.message_id = Hue.announce_media(type, data).message_id
  }

  if (type === "tv") {
    if (data.type === "upload") {
      data.type = "video"
    }
  }

  if (!data.username) {
    data.info = `Default ${Hue.utilz.capitalize_words(type)}`
  }

  if (mode === "change" || mode === "show") {
    Hue[`push_${type}_changed`](data)
  }

  if (mode === "change") {
    if (data.user_id === Hue.user_id) {
      Hue.change_media_lock({
        type: type,
        what: false,
        feedback: true,
        change: false
      })
    }
    
    Hue.change_media({type: type})
  }
}

// Announce a media change to the chat
Hue.announce_media = function (type, data) {
  return Hue.public_feedback(data.message, {
    id: data.id,
    save: true,
    brk: Hue.get_chat_icon(type),
    title: data.info,
    date: data.date,
    type: data.type,
    username: data.username,
    type: `${type}_change`,
    user_id: data.user_id,
    in_log: data.in_log,
    media_source: data.source,
    comment: data.comment
  })
}

// Changes the media visibility based on current state
Hue.change_media_visibility = function (type, play = false) {
  if (Hue.room_state[`${type}_enabled`]) {
    Hue.el("#media").style.display = "flex"
    Hue.el(`#media_${type}`).style.display = "flex"

    if (Hue.first_media_change && Hue.started) {
      Hue.change_media({type: type, force: true, current_source: Hue[`${type}_locked`], play: play})
    }

    Hue[`${type}_visible`] = true
    Hue[`fix_${type}_frame`]()
  } else {
    Hue.el(`#media_${type}`).style.display = "none"

    if (Hue.num_media_elements_visible() === 0) {
      Hue.hide_media()
    }

    Hue[`${type}_visible`] = false
  }

  if (type === "image") {
    if (Hue.tv_visible) {
      Hue.fix_tv_frame()
    }
  } else if (type == "tv") {
    if (Hue.image_visible) {
      Hue.fix_image_frame()
    }

    if (!Hue.tv_visible) {
      Hue.stop_tv()
    }
  }

  Hue.goto_bottom()
}

// Set media info enabled
Hue.set_media_info_enabled = function (what) {
  Hue.room_state.media_info_enabled = what
  Hue.check_media_info()
  Hue.save_room_state()
}

// Set default media info enabled
Hue.set_default_media_info_enabled = function () {
  Hue.room_state.media_info_enabled = Hue.config.room_state_default_media_info_enabled
  Hue.check_media_info()
  Hue.save_room_state()
}

// Check media info
Hue.check_media_info = function () {
  let display = Hue.room_state.media_info_enabled ? "flex" : "none"
  document.documentElement.style.setProperty('--media_info_display', display)
  Hue.fix_frames()
}

// Previous media to load
Hue.load_prev_media = function (type) {
  if (Hue[`${type}_changed`].length < 2) {
    return
  }

  let index = Hue[`${type}_changed`].indexOf(Hue[`loaded_${type}`]) - 1

  if (index < 0) {
    index = Hue[`${type}_changed`].length - 1
  }

  let prev = Hue[`${type}_changed`][index]
  Hue.load_media(prev)
}

// Next media to load
Hue.load_next_media = function (type) {
  if (Hue[`${type}_changed`].length < 2) {
    return
  }

  let index = Hue[`${type}_changed`].indexOf(Hue[`loaded_${type}`]) + 1

  if (index > Hue[`${type}_changed`].length - 1) {
    index = 0
  }

  let next = Hue[`${type}_changed`][index]
  Hue.load_media(next)
}