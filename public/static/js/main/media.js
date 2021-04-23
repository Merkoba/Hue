// Setups media
Hue.setup_media = function () {
  $("#media_image_frame").on("click", function () {
    Hue.show_modal_image()
  })

  $("#media_image_error").on("click", function () {
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
    $("#media_tv").css("height", `${p1}%`)
    $("#media_image").css("height", `${p2}%`)
    $("#media_tv").css("width", "100%")
    $("#media_image").css("width", "100%")
  } else if (mode === "row") {
    $("#media_tv").css("width", `${p1}%`)
    $("#media_image").css("width", `${p2}%`)
    $("#media_tv").css("height", "100%")
    $("#media_image").css("height", "100%")
  }

  let c1 = Hue.limit_media_percentage(Hue.room_state.chat_display_percentage)
  let c2 = 100 - c1

  $("#chat_main").css("width", `${c1}%`)
  $("#media").css("width", `${c2}%`)
  Hue.fix_frames()
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

  $("#media_image").css("order", ip)
  $("#media_tv").css("order", tvp)
}

Hue.swap_display_positions = function () {
  Hue.room_state.tv_display_position =
    Hue.room_state.tv_display_position === "top" ? "bottom" : "top"
  Hue.save_room_state()
  Hue.apply_media_positions()
}

// Refresh media menu widgets
Hue.refresh_media_menu = function () {
  $("#media_menu_tv_size").find("option").each(function () {
    if ($(this).val() == Hue.room_state.tv_display_percentage) {
      $(this).prop("selected", true)
    }
  })

  $("#media_menu_chat_size").find("option").each(function () {
    if ($(this).val() == Hue.room_state.chat_display_percentage) {
      $(this).prop("selected", true)
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

// Tabs between media source and comment input on open pickers
// This is done because tab is disabled to avoid focus problems
Hue.do_media_picker_input_cycle = function (type) {
  if (Hue.just_tabbed) {
    return false
  }

  if (document.activeElement === $(`#${type}_source_picker_input`)[0]) {
    $(`#${type}_source_picker_input_comment`).focus()
  } else if (
    document.activeElement === $("#image_source_picker_input_comment")[0]
  ) {
    $(`#${type}_source_picker_input`).focus()
  } else {
    $(`#${type}_source_picker_input`).focus()
  }
}

// Checks how many elements (image, tv) are visible in the media section
Hue.num_media_elements_visible = function () {
  let num = 0

  $("#media_split .media_main_container").each(function () {
    if ($(this).css("display") !== "none") {
      num += 1
    }
  })

  return num
}

// Tries to separate a comment from a URL when using change media commands
// The proper way is to use '/image url > comment'
// But if the > is ommitted it will still try to determine what each part is
Hue.get_media_change_inline_comment = function (type, source) {
  let comment = $(`#${type}_source_picker_input_comment`).val()

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
  $("#media").css("display", "none")
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
  $(`#${type}_history_filter`).val("")
  $(`#${type}_history_container`).html("")
}

// Shows and/or filters media history of a certain type
Hue.show_media_history = function (type, filter = false) {
  $(`#${type}_history_container`).html("")
  $(`#${type}_history_filter`).val(filter ? filter : "")

  let clone = $($("#chat_area").children().get().reverse()).clone(true, true)

  clone.each(function () {
    $(this).removeAttr("id")
  })

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()

    clone = clone.filter(function () {
      let type2 = $(this).data("type")

      if (type2 !== `${type}_change`) {
        return false
      }

      let text = $(this).text().toLowerCase()
      return text.includes(lc_value)
    })
  } else {
    clone = clone.filter(function () {
      let type2 = $(this).data("type")

      if (type2 !== `${type}_change`) {
        return false
      }

      return true
    })
  }

  clone.appendTo(`#${type}_history_container`)
}

// Additional media menu configurations
Hue.setup_media_menu = function () {
  $("#media_menu_swap").on("click", function () {
    Hue.swap_media()
  })

  $("#media_menu_rotate").on("click", function () {
    Hue.rotate_media()
  })

  $("#media_menu_tv_size").on("change", function () {
    let size = $("#media_menu_tv_size option:selected").val()
    Hue.do_media_tv_size_change(size)
  })

  $("#media_menu_chat_size").on("change", function () {
    let size = $("#media_menu_chat_size option:selected").val()
    Hue.do_chat_size_change(size)
  })

  $("#media_menu_defaults").on("click", function () {
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
  let current = Hue[`current_${what}`]()
  let setter = current.setter
  let date = current.nice_date
  let s = Hue.media_string(what)

  if (setter !== "") {
    Hue.feedback(`${s} Source: ${source}`, {
      title: `Setter: ${setter} | ${date} | ${Hue.utilz.nice_date()}`,
    })
  } else {
    Hue.feedback(`${s} Source: ${source}`)
  }
}

// More media picker configurations
Hue.setup_media_pickers = function () {
  for (let type of Hue.utilz.media_types) {
    Hue.horizontal_separator.separate($(`#${type}_picker_options`)[0])
  }

  $("#image_picker_upload").on("click", function () {
    Hue.msg_image_picker.close()
  })
  
  $("#image_picker_draw").on("click", function () {
    Hue.msg_image_picker.close()
    Hue.msg_draw_image.show()
  })
  
  $("#image_picker_submit").on("click", function () {
    Hue.image_picker_submit()
  })

  $("#tv_picker_reload").on("click", function () {
    if (Hue.loaded_tv) {
      Hue.load_media("tv", Hue.loaded_tv)
    }

    Hue.close_all_modals()
  })

  $("#tv_picker_submit").on("click", function () {
    Hue.tv_picker_submit()
  })
}

// Updates the dimensions of a specified element
// It grows the element as much as it can while maintaining the aspect ratio
// This is done by making calculations with the element and parent's ratios
Hue.fix_frame = function (frame_id, test_parent_height = false) {
  let id = `#${frame_id}`
  let frame = $(id)
  let frame_ratio

  if (frame_id === "media_image_frame") {
    frame_ratio = frame[0].naturalHeight / frame[0].naturalWidth
  } else {
    frame_ratio = 0.5625
  }

  let parent = frame.parent()
  let info_height = 0
  let info = frame.parent().find(".media_info")

  if (info.length > 0) {
    info_height = info.eq(0).outerHeight(true)
  }

  let parent_width = parent.width()
  let parent_height = test_parent_height ?
    test_parent_height :
    parent.height() - info_height
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
    frame.width(width)
    frame.height(height)
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
      $("#footer_lock_image_icon").removeClass("blinking")
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
      $("#footer_lock_tv_icon").removeClass("blinking")
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
  
  let container = $(`#media_${type}_info_container`)
  let custom_title

  if (type === "tv") {
    Hue.media_info_tv_data = [...arguments]
  } else if (type === "image") {
    if (item.type === "upload") {
      custom_title = `${Hue.utilz.get_size_string(item.size)} upload`
    }

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
    if (item.source) {
      info = item.source
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

  $(container).find(".media_info").eq(0).html(html)
  $(container).find(".media_info_timeago").eq(0).text(Hue.utilz.timeago(item.date))
  $(container).attr("title", hover_title)
  $(container).data("otitle", hover_title)
  $(container).data("date", item.date)
  $(container).data("item", item)
  $(container).data("type", type)
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
    $(`#footer_lock_${type}_icon`).find("use").eq(0).attr("href", "#icon_locked")
    $(`#footer_lock_${type}_label`).css("display", "flex")

    if (Hue[`loaded_${type}`] !== Hue[`current_${type}`]()) {
      $(`#footer_lock_${type}_icon`).addClass("blinking")
    }
  } else {
    $(`#footer_lock_${type}_icon`).find("use").eq(0).attr("href", "#icon_unlocked")
    $(`#footer_lock_${type}_icon`).removeClass("blinking")
    $(`#footer_lock_${type}_label`).css("display", "none")

    Hue.change({ type: type })
  }
}

// Changes the media layout between row and column
Hue.change_media_layout = function (mode = false) {
  if (!mode) {
    mode = Hue.room_state.media_layout
  }

  if (mode === "column") {
    $("#media_split").css("flex-direction", "column")
    $(".media_main_container").css("width", "100%")
    $(".media_main_container").css("height", "50%")
  } else if (mode === "row") {
    $("#media_split").css("flex-direction", "row")
    $(".media_main_container").css("width", "50%")
    $(".media_main_container").css("height", "100%")
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

// Some initial media info setups
Hue.start_media_info = function () {
  $("#media_image_container").append(Hue.get_media_info_html("image"))

  $("#media").on("click", ".media_info_username", function () {
    let username = $(this).closest(".media_info").data("item").setter
    Hue.show_profile(username)
  })

  $("#media").on("click", ".media_info_details", function () {
    z = this
    let media_info = $(this).closest(".media_info_container")
    let item = media_info.data("item")
    let type = media_info.data("type")

    Hue.open_url_menu({
      source: item.source,
      data: item,
      media_type: type
    })
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
  Hue.set_default_chat_size()
  Hue.set_default_tv_size()
  Hue.set_default_media_layout()
  Hue.set_default_tv_position()
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