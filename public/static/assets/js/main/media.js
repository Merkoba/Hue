// Setups media
Hue.setup_media = function () {
  Hue.el("#media_image_frame").addEventListener("click", function () {
    Hue.show_modal_image()
  })

  Hue.el("#media_image_error").addEventListener("click", function () {
    Hue.show_modal_image()
  })

  Hue.el("#media_image").addEventListener("wheel", function (e) {
    Hue.image_resize_wheel_timer(e.deltaY > 0 ? "down" : "up")
  })
}

// Use the media image wheel to resize TV/Image percentages
Hue.image_resize_wheel = function (direction) {
  if (Hue.room_state.tv_display_position === "bottom") {
    if (direction === "down") {
      Hue.decrease_tv_percentage()
    } else if (direction === "up") {
      Hue.increase_tv_percentage()
    }
  } else if (Hue.room_state.tv_display_position === "top") {
    if (direction === "up") {
      Hue.decrease_tv_percentage()
    } else if (direction === "down") {
      Hue.increase_tv_percentage()
    }    
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

// Refresh media menu widgets
Hue.refresh_media_menu = function () {
  Hue.els("#media_menu_tv_size option").forEach(it => {
    if (it.value == Hue.room_state.tv_display_percentage) {
      it.selected = true
    }
  })

  Hue.els("#media_menu_chat_size option").forEach(it => {
    if (it.value == Hue.room_state.chat_display_percentage) {
      it.selected = true
    }
  })
}

// Shows the media menu
Hue.show_media_menu = function () {
  Hue.refresh_media_menu()  
  Hue.msg_media_menu.show()
}

// Initial change for current media
Hue.start_active_media = function () {
  Hue.change({
    type: "image",
    play: false
  })

  Hue.change({
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
  let comment = Hue.el(`#${type}_source_picker_input_comment`).value

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
  Hue.stop_tv()
  Hue.el("#media").style.display = "none"
}

// Setups media modes from initial data
Hue.setup_active_media = function () {
  Hue.media_visibility_and_locks()
}

// Changes media visibility and locks based on current state
Hue.media_visibility_and_locks = function () {
  Hue.change_image_visibility()
  Hue.change_tv_visibility(false)

  if (Hue.connections === 1) {
    Hue.change_media_lock_icon("image")
    Hue.change_media_lock_icon("tv")
  }
}

// Resets media history filter of a certain type
Hue.reset_media_history_filter = function (type) {
  Hue.el(`#${type}_history_filter`).value = ""
  Hue.el(`#${type}_history_container`).innerHTML = ""
}

// Shows and/or filters media history of a certain type
Hue.show_media_history = function (type, filter = "") {
  Hue.el(`#${type}_history_container`).innerHTML = ""
  Hue.el(`#${type}_history_filter`).value = filter ? filter : ""

  let clone = Hue.clone_children("#chat_area").reverse()

  clone.forEach(it => {
    it.removeAttribute("id")
  })

  if (filter.trim()) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()

    clone = clone.filter(it => {
      let type2 = Hue.dataset(it, "type")

      if (type2 !== `${type}_change`) {
        return false
      }

      let text = it.textContent.toLowerCase()

      if (!text) {
        return false
      }

      return text.includes(lc_value)
    })
  } else {
    clone = clone.filter(it => {
      let type2 = Hue.dataset(it, "type")

      if (type2 !== `${type}_change`) {
        return false
      }

      return true
    })
  }

  for (let el of clone) {
    Hue.el(`#${type}_history_container`).append(el)
  }

  Hue.vertical_separator(Hue.el(`#${type}_history_container`))
}

// Additional media menu configurations
Hue.setup_media_menu = function () {
  Hue.el("#media_menu_swap").addEventListener("click", function () {
    Hue.swap_media()
  })

  Hue.el("#media_menu_rotate").addEventListener("click", function () {
    Hue.rotate_media()
  })

  Hue.el("#media_menu_revolve").addEventListener("click", function () {
    Hue.change_main_layout()
  })   

  Hue.el("#media_menu_tv_size").addEventListener("change", function () {
    let size = Hue.el("#media_menu_tv_size option:checked").value
    Hue.do_media_tv_size_change(size)
  })

  Hue.el("#media_menu_chat_size").addEventListener("change", function () {
    let size = Hue.el("#media_menu_chat_size option:checked").value
    Hue.do_chat_size_change(size)
  })

  Hue.el("#media_menu_defaults").addEventListener("click", function () {
    Hue.apply_media_defaults()
  })

  Hue.el("#media_menu_toggle_chat").addEventListener("click", function () {
    Hue.toggle_chat()
  })
}

// More media picker configurations
Hue.setup_media_pickers = function () {
  Hue.el("#image_picker_upload").addEventListener("click", function () {
    Hue.msg_image_picker.close()
  })
  
  Hue.el("#image_picker_draw").addEventListener("click", function () {
    Hue.msg_image_picker.close()
    Hue.open_draw_image("image")
  })
  
  Hue.el("#image_picker_submit").addEventListener("click", function () {
    Hue.image_picker_submit()
  })

  Hue.el("#tv_picker_reload").addEventListener("click", function () {
    if (Hue.loaded_tv) {
      Hue.load_media(Hue.loaded_tv)
    }
  })

  Hue.el("#tv_picker_submit").addEventListener("click", function () {
    Hue.tv_picker_submit()
  })

  Hue.el("#tv_picker_upload").addEventListener("click", function () {
    Hue.msg_tv_picker.close()
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
  Hue.fix_visible_tv_frame()
  Hue.fix_image_frame()
}

// This handles all media load
// It will attempt to load and play media taking into account the room state
// It is responsible to initiate the construction of all required media players
Hue.change = function (args = {}) {
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

  if (!Hue.has_focus || Hue.screen_locked) {
    if (args.notify && item.setter !== Hue.username) {
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

    if (!args.item || args.item === Hue.current_image()) {
      Hue.el("#footer_lock_image_icon").classList.remove("blinking")
    }
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

    if (!args.item || args.item === Hue.current_tv()) {
      Hue.el("#footer_lock_tv_icon").classList.remove("blinking")
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

  let message = Hue.utilz.make_html_safe(item.message.substring(0, Hue.media_info_message_max_length).trim())

  let html = `
    <div class='media_info_username action'>${Hue.utilz.make_html_safe(item.setter)}</div>
    <div class='media_info_details action'>: ${message}</div>`

  let container = Hue.el(`#media_${type}_info_container`)
  Hue.el(".media_info", container).innerHTML = html
  Hue.el(".media_info_timeago", container).textContent = Hue.utilz.timeago(item.date)
  container.title = item.info
    
  Hue.dataset(container, "otitle", item.info)
  Hue.dataset(container, "date", item.date)
  Hue.dataset(container, "type", type)
  Hue.dataset(container, "id", item.id)
  Hue.dataset(container, "setter", item.setter)
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
    feedback: false,
    mode: ""
  }

  args = Object.assign(def_args, args)

  if (args.what !== undefined) {
    if (Hue.room_state[`${args.type}_enabled`] !== args.what) {
      Hue.room_state[`${args.type}_enabled`] = args.what
    } else {
      save = false
    }
  } else {
    Hue.room_state[`${args.type}_enabled`] = !Hue.room_state[`${args.type}_enabled`]
  }

  if (Hue[`${args.type}_visible`] !== args.what) {
    Hue[`change_${args.type}_visibility`]()
  }

  let p = Hue.room_state.tv_display_percentage

  if (p === 0 || p === 100) {
    Hue.set_default_tv_size()
  } else if (args.save) {
    Hue.save_room_state()
  }
}

// Change the lock of some media
Hue.change_media_lock = function(args) {
  let def_args = {
    type: "",
    what: undefined,  
    feedback: false
  }

  args = Object.assign(def_args, args)
  
  if (args.what !== undefined) {
    Hue[`${args.type}_locked`] = args.what
  } else {
    Hue[`${args.type}_locked`] = !Hue[`${args.type}_locked`]
  }

  Hue.change_media_lock_icon(args.type)
}

// Toggles media locks for any type
Hue.change_media_lock_icon = function (type) {
  if (Hue[`${type}_locked`]) {
    Hue.el(`#footer_lock_${type}_icon use`).href.baseVal = "#icon_locked"
    Hue.el(`#footer_lock_${type}_label`).style.display = "flex"

    if (Hue[`loaded_${type}`] !== Hue[`current_${type}`]()) {
      Hue.el(`#footer_lock_${type}_icon`).classList.add("blinking")
    }
  } else {
    Hue.el(`#footer_lock_${type}_icon use`).href.baseVal = "#icon_unlocked"
    Hue.el(`#footer_lock_${type}_icon`).classList.remove("blinking")
    Hue.el(`#footer_lock_${type}_label`).style.display = "none"

    Hue.change({ type: type })
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
  return `<div id='media_${type}_info_container' class='media_info_container grid_row_center dynamic_title'>
    <div id='media_${type}_info' class='media_info'></div>
    <div class='media_info_timeago'></div>
  </div>`
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
    let el = e.target.closest(".media_info_username")

    if (el) {
      let username = Hue.dataset(el.closest(".media_info_container"), "setter")
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
  Hue.toggle_media({type:data.media_type, what:true})
  Hue.change_media_lock({type:data.media_type, what:true})
  
  Hue.change({
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

// Apply media defaults
Hue.apply_media_defaults = function () {
  Hue.set_default_chat_size()
  Hue.set_default_tv_size()
  Hue.set_default_media_layout()
  Hue.set_default_tv_position()
  Hue.set_default_main_layout()
  Hue.set_default_chat_enabled()

  Hue.save_room_state()
  Hue.change_media_layout()
  Hue.apply_media_positions()
  Hue.refresh_media_menu()
}

// Media percentages for media menu
Hue.create_media_percentages = function () {
  let html = ""

  for (let p=Hue.media_max_percentage; p>=Hue.media_min_percentage; p-=5) {
    html += `<option value='${p}'>${p}%</option>`
  }

  return html
}

// Change the main layout row|column
Hue.change_main_layout = function () {
  if (Hue.room_state.main_layout === "row") {
    Hue.room_state.main_layout = "column"   
  } else {
    Hue.room_state.main_layout = "row" 
  }

  Hue.save_room_state()
  Hue.apply_media_percentages()
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

// Used to change the image
// Shows the image picker window to input a URL, or upload a file
Hue.show_media_picker = function (type) {
  Hue[`msg_${type}_picker`].show(function () {
    Hue.el(`#${type}_source_picker_input`).focus()
    Hue.show_media_history(type)
    Hue.scroll_modal_to_top(`${type}_picker`)
  })
}

// Load media picker
Hue.load_media_picker = function (type, source, comment) {
  Hue.show_media_picker(type)
  Hue.el(`#${type}_source_picker_input`).value = source
  Hue.el(`#${type}_source_picker_input_comment`).value = comment
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
      message = `Link (${new URL(data.source).hostname})`
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
  data.setter = odata.setter
  data.size = odata.size
  data.date = odata.date
  data.query = odata.query
  data.comment = odata.comment
  data.in_log = odata.in_log === undefined ? true : odata.in_log
  data.media_type = type

  if (data.type === "upload") {
    data.source = `${Hue.config.public_media_directory}/room/${Hue.room_id}/${type}/${data.source}`
  }

  data.nice_date = data.date
    ? Hue.utilz.nice_date(data.date)
    : Hue.utilz.nice_date()

  if (!data.setter) {
    data.setter = Hue.config.system_username
  }

  if (!data.source) {
    data.source = Hue.config[`default_${type}_source`]
  }

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

  let gets = data.id ? `${data.id.slice(-3)} | ` : ""

  data.info = `${gets}Setter: ${data.setter}`
  data.info_html = `<div>Setter: ${Hue.utilz.make_html_safe(
    data.setter
  )}</div>`

  if (data.size) {
    data.info += ` | Size: ${Hue.utilz.get_size_string(data.size)}`
    data.info_html += `<div>Size: ${Hue.utilz.get_size_string(data.size)}</div>`
  }

  if (data.query) {
    data.info += ` | Search Term: "${data.query}"`
  }

  data.info += ` | ${data.nice_date}`
  data.info_html += `<div>${data.nice_date}</div>`
  data.info_html += `<div class='modal_${type}_timeago'></div>`

  data.message = Hue.get_media_message(data)

  if (data.message) {
    data.message_id = Hue.announce_media(type, data).message_id
  }

  if (type === "tv") {
    if (data.type === "upload") {
      data.type = "video"
    }
  }

  if (!data.setter) {
    data.info = `Default ${Hue.utilz.capitalize_words(type)}`
  }

  if (mode === "change" || mode === "show") {
    Hue[`push_${type}_changed`](data)
  }

  if (mode === "change") {
    if (Hue[`${type}_locked`]) {
      Hue.el(`#footer_lock_${type}_icon`).classList.add("blinking")
    }

    Hue.change({type: type})
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
    username: data.setter,
    type: `${type}_change`,
    user_id: data.user_id,
    in_log: data.in_log,
    media_source: data.source,
    comment: data.comment
  })
}