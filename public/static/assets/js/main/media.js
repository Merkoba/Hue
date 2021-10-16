// Setups media
Hue.setup_media = function () {
  Hue.el("#media_image_frame").addEventListener("click", function () {
    Hue.show_modal_image()
  })

  Hue.el("#media_image_error").addEventListener("click", function () {
    Hue.show_modal_image()
  })
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
  Hue.goto_bottom(true)
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
  Hue.el("#media_menu_tv_size").querySelectorAll("option").forEach(function (it) {
    if (it.value == Hue.room_state.tv_display_percentage) {
      it.selected = true
    }
  })

  Hue.el("#media_menu_chat_size").querySelectorAll("option").forEach(function (it) {
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

  Hue.els("#media_split .media_main_container").forEach(function (it) {
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

  clone.forEach(function (it) {
    it.removeAttribute("id")
  })

  if (filter.trim()) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()

    clone = clone.filter(function () {
      let type2 = Hue.dataset[this].type

      if (type2 !== `${type}_change`) {
        return false
      }

      let text = this.textContent.toLowerCase()

      if (!text) {
        return false
      }

      return text.includes(lc_value)
    })
  } else {
    clone = clone.filter(function () {
      let type2 = Hue.dataset[this].type

      if (type2 !== `${type}_change`) {
        return false
      }

      return true
    })
  }

  Hue.el(`#${type}_history_container`).append(clone)
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
    let size = Hue.el("#media_menu_tv_size option:selected").value
    Hue.do_media_tv_size_change(size)
  })

  Hue.el("#media_menu_chat_size").addEventListener("change", function () {
    let size = Hue.el("#media_menu_chat_size option:selected").value
    Hue.do_chat_size_change(size)
  })

  Hue.el("#media_menu_defaults").addEventListener("click", function () {
    Hue.apply_media_defaults()
  }) 
}

// Format local sources that start with slash
Hue.get_proper_media_url = function (type) {
  let source = Hue[`current_${type}`]().source

  if (source.startsWith("/")) {
    source = window.location.origin + source
  }

  return source
}

// Show the current source of a given media type
Hue.show_media_source = function (what) {
  let source = Hue.get_proper_media_url(what)
  let s = Hue.media_string(what)
  Hue.checkmsg(`${s} Source: ${source}`)
}

// More media picker configurations
Hue.setup_media_pickers = function () {
  for (let type of Hue.utilz.media_types) {
    Hue.horizontal_separator(Hue.el(`#${type}_picker_options`))
  }

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
      Hue.load_media("tv", Hue.loaded_tv)
    }

    Hue.close_all_modals()
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
  let info = frame.parentElement.querySelectorAll(".media_info")

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
  Hue.fix_visible_video_frame()
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

  if (!Hue.app_focused || Hue.screen_locked) {
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
      if (Hue[`${item.type}_video_player`] === undefined) {
        Hue.request_media(`${item.type}_video_player`, args)
        return false
      }
    }

    Hue.loaded_tv = item

    Hue[`show_${item.type}_video`](args.play)

    if (!args.item || args.item === Hue.current_tv()) {
      Hue.el("#footer_lock_tv_icon").classList.remove("blinking")
    }
  } else {
    return false
  }
}

// Sets a media info item with proper information and events
Hue.apply_media_info = function (type) {
  let item = Hue[`loaded_${type}`]

  if (!item.type) {
    return false
  }
  
  let custom_title
  let media_type

  if (type === "tv") {
    if (item.size) {
      custom_title = `${Hue.utilz.get_size_string(item.size)} upload`
    }

    media_type = "video"
    Hue.media_info_tv_data = [...arguments]
  } else if (type === "image") {
    if (item.size) {
      custom_title = `${Hue.utilz.get_size_string(item.size)} upload`
    }

    media_type = "image"
    Hue.media_info_image_data = [...arguments]
  }

  let info = ""

  if (item.comment) {
    info = item.comment
  }

  let title = custom_title || item.title || ""

  if (title) {
    if (info) {
      info += " | "
    }

    info += title
  }

  if (!info) {
    if (item.query) {
      info = item.query
    } else if (item.source) {
      info = `Linked ${media_type}`
    }
  }

  info = info.substring(0, Hue.media_info_max_length).trim()
  let hover_title = item.info

  let html = `
    <div class='media_info_username action'>${Hue.utilz.make_html_safe(
      item.setter
    )}</div>
    <div class='media_info_details action'>: ${Hue.utilz.make_html_safe(
      info
    )}</div>
  `

  let container = Hue.el(`#media_${type}_info_container`)
  container.querySelector(".media_info").innerHTML = html
  container.querySelector(".media_info_timeago").textContent = Hue.utilz.timeago(item.date)
  container.title = hover_title
    
  if (Hue.dataset[container] === undefined) {
    Hue.dataset[container] = {}
  }

  Hue.dataset[container].otitle = hover_title
  Hue.dataset[container].date = item.date
  Hue.dataset[container].item = item
  Hue.dataset[container].type = type
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
    Hue.el(`#footer_lock_${type}_icon`).querySelector("use").href = "#icon_locked"
    Hue.el(`#footer_lock_${type}_label`).style.display = "flex"

    if (Hue[`loaded_${type}`] !== Hue[`current_${type}`]()) {
      Hue.el(`#footer_lock_${type}_icon`).classList.add("blinking")
    }
  } else {
    Hue.el(`#footer_lock_${type}_icon`).querySelector("use").href = "#icon_unlocked"
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

    Hue.els(".media_main_container").forEach(function (it) {
      it.style.width = "100%"
      it.style.height = "50%"
    })
  } else if (mode === "row") {
    Hue.el("#media_split").style.flexDirection = "row"

    Hue.els(".media_main_container").forEach(it, function (it) {
      it.style.width = "50%"
      it.style.height = "100%"
    })
  }

  Hue.apply_media_percentages()
  Hue.fix_frames()
}

// Apply default media layout
Hue.set_default_media_layout = function (apply = true) {
  Hue.room_state.media_layout = Hue.config.room_state_default_media_layout

  if (apply) {
    Hue.save_room_state()
    Hue.change_media_layout()
  }
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
Hue.set_default_tv_position = function (apply = true) {
  Hue.room_state.tv_display_position = Hue.config.room_state_default_tv_display_position
  
  if (apply) {
    Hue.save_room_state()
    Hue.apply_media_positions()
  }
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
  let el = document.createElement("div")
  el.innerHTML = Hue.get_media_info_html(type)
  Hue.el(container).append(el)
}

// Some initial media info setups
Hue.start_media_info = function () {
  Hue.append_media_info("#media_image_container", "image")
  
  Hue.el("#media").addEventListener("click", function (e) {
    let el = e.target.closest(".media_info_username")

    if (el) {
      let username = Hue.dataset[el.closest(".media_info_container")].item = setter
      Hue.show_profile(username)
    }
  })

  Hue.el("#media").addEventListener("click", function (e) {
    let el = e.target.closest(".media_info_details")

    if (el) {
      let media_info = el.closest(".media_info_container")
      let item = Hue.dataset[media_info].item
      let type = Hue.dataset[media_info].type
  
      Hue.open_url_menu({
        source: item.source,
        data: item,
        media_type: type
      })
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
Hue.load_media = function (type, data) {
  Hue.toggle_media({type:type, what:true})
  Hue.change_media_lock({type:"tv", what:true})
  
  Hue.change({
    type: type,
    item: data,
    force: true
  })
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
  Hue.set_default_chat_size(false)
  Hue.set_default_tv_size(false)
  Hue.set_default_media_layout(false)
  Hue.set_default_tv_position(false)
  Hue.set_default_main_layout(false)

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
Hue.set_default_main_layout = function (apply = true) {
  Hue.room_state.main_layout = Hue.config.room_state_default_main_layout

  if (apply) {
    Hue.save_room_state()
    Hue.apply_media_percentages()
  }
}