// Setups an image object
// This handles image objects received live from the server or from logged messages
// This is the entry function for image objects to get registered, announced, and be ready for use
Hue.setup_image = function (mode, odata = {}) {
  let data = {}

  data.id = odata.id
  data.user_id = odata.user_id
  data.type = odata.type
  data.source = odata.source
  data.setter = odata.setter
  data.size = odata.size
  data.date = odata.date
  data.query = odata.query
  data.comment = odata.comment
  data.in_log = odata.in_log === undefined ? true : odata.in_log

  data.nice_date = data.date
    ? Hue.utilz.nice_date(data.date)
    : Hue.utilz.nice_date()

  if (!data.setter) {
    data.setter = Hue.config.system_username
  }

  if (!data.source) {
    data.source = Hue.config.default_image_source
  }

  if (data.source.startsWith("/")) {
    data.source = window.location.origin + data.source
  } else if (data.source.startsWith(window.location.origin)) {
    if (!data.size) {
      for (let img of Hue.image_changed) {
        if (img.source === data.source) {
          data.type = img.type
          data.size = img.size
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

  if (data.type === "upload") {
    data.info += ` | Size: ${Hue.utilz.get_size_string(data.size)}`
    data.info_html += `<div>Size: ${Hue.utilz.get_size_string(data.size)}</div>`
  }

  if (data.query) {
    data.info += ` | Search Term: "${data.query}"`
  }

  data.info += ` | ${data.nice_date}`
  data.info_html += `<div>${data.nice_date}</div>`
  data.info_html += `<div class='modal_image_timeago'></div>`

  if (data.comment) {
    data.message = data.comment
  }

  if (!data.message) {
    if (data.size) {
      data.message = "Uploaded image"
    } else {
      data.message = "Linked image"
    }
  }

  data.onclick = function () {
    Hue.show_modal_image(data.id)
  }

  if (data.message) {
    data.message_id = Hue.announce_image(data).message_id
  }

  if (!data.setter) {
    data.info = "Default Image"
  }

  if (mode === "change" || mode === "show") {
    Hue.push_image_changed(data)
  }

  if (mode === "change") {
    if (Hue.image_locked) {
      $("#footer_lock_image_icon").addClass("blinking")
    }

    Hue.change({type: "image"})
  }
}

// Announces an image change to the chat
Hue.announce_image = function (data) {
  return Hue.public_feedback(data.message, {
    id: data.id,
    save: true,
    brk: Hue.get_chat_icon("image"),
    date: data.date,
    username: data.setter,
    title: data.info,
    onclick: data.onclick,
    type: "image_change",
    user_id: data.user_id,
    in_log: data.in_log,
    media_source: data.source
  })
}

// Pushes a changed image into the image changed array
Hue.push_image_changed = function (data) {
  Hue.image_changed.push(data)

  if (Hue.image_changed.length > Hue.config.media_changed_crop_limit) {
    Hue.image_changed = Hue.image_changed.slice(
      Hue.image_changed.length - Hue.config.media_changed_crop_limit
    )
  }
}

// Returns the current room image
// The last image in the image changed array
// This is not necesarily the user's loaded image
Hue.current_image = function () {
  if (Hue.image_changed.length > 0) {
    return Hue.image_changed[Hue.image_changed.length - 1]
  } else {
    return {}
  }
}

// Loads an image with a specified item
Hue.show_image = function (force = false) {
  let item = Hue.loaded_image
  $("#media_image_error").css("display", "none")
  $("#media_image_frame").css("display", "initial")

  if (force || $("#media_image_frame").attr("src") !== item.source) {
    $("#media_image_frame").attr("src", item.source)
  } else {
    Hue.after_image_load(false)
  }
}

// Attempts to change the image source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
Hue.change_image_source = function (src, just_check = false, comment = "") {
  let feedback = true

  if (just_check) {
    feedback = false
  }

  if (!comment) {
    let r = Hue.get_media_change_inline_comment("image", src)
    src = r.source
    comment = r.comment
  }

  if (comment.length > Hue.config.max_media_comment_length) {
    if (feedback) {
      Hue.checkmsg("Comment is too long")
    }

    return false
  }

  if (src.length === 0) {
    return false
  }

  src = Hue.utilz.clean_string2(src)

  if (src.length > Hue.config.max_media_source_length) {
    return false
  }

  if (src.startsWith("/")) {
    return false
  }

  if (src === Hue.current_image().source || src === Hue.current_image().query) {
    if (feedback) {
      Hue.checkmsg("Image is already set to that")
    }

    return false
  } else if (Hue.utilz.is_url(src)) {
    src = src.replace(/\.gifv/g, ".gif")
    let extension = Hue.utilz.get_extension(src).toLowerCase()

    if (!extension || !Hue.utilz.image_extensions.includes(extension)) {
      if (feedback) {
        Hue.checkmsg("That doesn't seem to be an image")
      }

      return false
    }
  } else {
    if (src.length > Hue.config.safe_limit_1) {
      if (feedback) {
        Hue.checkmsg("Query is too long")
      }

      return false
    }

    if (!Hue.config.imgur_enabled) {
      if (feedback) {
        Hue.checkmsg("Imgur support is not enabled")
      }

      return false
    }
  }

  if (just_check) {
    return true
  }

  Hue.emit_change_image_source(src, comment)
}

// Sends an emit to change the image source
Hue.emit_change_image_source = function (url, comment = "") {
  Hue.socket_emit("change_image_source", { src: url, comment: comment })
}

// Updates dimensions of the image
Hue.fix_image_frame = function () {
  if (!Hue.image_visible) {
    return false
  }

  if (!$("#media_image_frame")[0].naturalHeight) {
    return false
  }

  Hue.fix_frame("media_image_frame")
}

// Changes the image visibility based on current state
Hue.change_image_visibility = function () {
  if (Hue.room_state.image_enabled) {
    $("#media").css("display", "flex")
    $("#media_image").css("display", "flex")
    $("#footer_toggle_image_icon").find("use").eq(0).attr("href", "#icon_toggle-on")

    if (Hue.first_media_change && Hue.started) {
      Hue.change({ type: "image" })
    }

    Hue.image_visible = true
    Hue.fix_image_frame()
  } else {
    $("#media_image").css("display", "none")

    let num_visible = Hue.num_media_elements_visible()

    if (num_visible === 0) {
      Hue.hide_media()
    }

    $("#footer_toggle_image_icon").find("use").eq(0).attr("href", "#icon_toggle-off")

    Hue.image_visible = false
  }

  if (Hue.tv_visible) {
    Hue.fix_visible_video_frame()
  }

  Hue.check_footer_media_rotate()
  Hue.goto_bottom()
}

// When clicking the Previous button in the image modal window
Hue.modal_image_prev_click = function () {
  if (Hue.image_changed.length < 2) {
    return
  }

  let index = Hue.image_changed.indexOf(Hue.loaded_modal_image) - 1

  if (index < 0) {
    index = Hue.image_changed.length - 1
  }

  let prev = Hue.image_changed[index]
  Hue.show_modal_image(prev.id)
}

// When clicking the Next button in the image modal window
Hue.modal_image_next_click = function (e) {
  if (Hue.image_changed.length < 2) {
    return
  }

  let index = Hue.image_changed.indexOf(Hue.loaded_modal_image) + 1

  if (index > Hue.image_changed.length - 1) {
    index = 0
  }

  let next = Hue.image_changed[index]
  Hue.show_modal_image(next.id)
}

// Setups image modal window events
Hue.setup_modal_image = function () {
  let img = $("#modal_image")

  img[0].addEventListener("load", function () {
    $("#modal_image_spinner").css("display", "none")
    $("#modal_image").css("display", "block")
  })

  img.on("error", function () {
    $("#modal_image_spinner").css("display", "none")
    $("#modal_image").css("display", "none")
    $("#modal_image_error").css("display", "block")
  })

  let f = function (e) {
    if (e.ctrlKey || e.shiftKey) {
      return false
    }

    if ($("#modal_image_container").hasClass("expanded_modal_image")) {
      return false
    }

    let direction = e.deltaY > 0 ? "down" : "up"

    if (direction === "up") {
      Hue.modal_image_next_wheel_timer()
    } else if (direction === "down") {
      Hue.modal_image_prev_wheel_timer()
    }
  }

  $("#Msg-window-modal_image")[0].addEventListener("wheel", f)

  $("#modal_image_container").on("click", function () {
    if ($("#modal_image_container").hasClass("expanded_modal_image")) {
      Hue.restore_modal_image()
    } else {
      Hue.msg_modal_image.close()
    }
  })

  $("#modal_image_arrow_prev").on("click", function (e) {
    Hue.modal_image_prev_click()
  })

  $("#modal_image_arrow_next").on("click", function (e) {
    Hue.modal_image_next_click()
  })

  $("#modal_image_toolbar_load").on("click", function (e) {
    let item = Hue.loaded_modal_image
    Hue.toggle_media({type:"image", what:true})
    Hue.change({ type: "image", item: item, force: true })
    Hue.close_all_modals()
  })

  $("#modal_image_toolbar_change").on("click", function (e) {
    Hue.show_confirm("Change Image", "This will change it for everyone", function () {
      let item = Hue.loaded_modal_image
      Hue.change_image_source(item.source)
      Hue.close_all_modals()
    })
  })

  $("#modal_image_toolbar_expand").on("click", function (e) {
    if ($("#modal_image_container").hasClass("expanded_modal_image")) {
      Hue.restore_modal_image()
    } else {
      Hue.expand_modal_image()
    }
  })
}

// Expand modal image to give it full height
Hue.expand_modal_image = function () {
  $("#modal_image_container").addClass("expanded_modal_image")
  $("#modal_image_toolbar_expand").text("Restore")
}

// Restore expanded modal image
Hue.restore_modal_image = function () {
  $("#modal_image_container").removeClass("expanded_modal_image")
  $("#modal_image_toolbar_expand").text("Expand")
}

// Clears image information in the modal image window
Hue.clear_modal_image_info = function () {
  $("#modal_image_header_info").html("")
}

// Shows the modal image window
Hue.show_modal_image = function (id = 0) {
  let data

  if (id) {
    data = Hue.get_media_item("image", id)
  } else {
    if (Hue.loaded_image.source) {
      data = Hue.loaded_image
    } else {
      return
    }
  }

  Hue.loaded_modal_image = data
  let img = $("#modal_image")
  img.css("display", "none")
  $("#modal_image_spinner").css("display", "block")
  $("#modal_image_error").css("display", "none")
  img.attr("src", data.source)

  $("#modal_image_header_info").html(data.info_html)
  $("#modal_image_header_info").find(".modal_image_timeago")
    .eq(0).text(Hue.utilz.timeago(data.date))

  Hue.horizontal_separator($("#modal_image_header_info")[0])

  if (data.comment || data.query) {
    $("#modal_image_subheader").html(
      Hue.parse_text(Hue.utilz.make_html_safe(data.comment || data.query))
    )
    $("#modal_image_subheader").css("display", "block")
    Hue.setup_whispers_click($("#modal_image_subheader"), data.setter)
  } else {
    $("#modal_image_subheader").css("display", "none")
  }

  if (data !== Hue.loaded_image) {
    $("#modal_image_toolbar_load").css("display", "block")
  } else {
    $("#modal_image_toolbar_load").css("display", "none")
  }

  if (Hue.change_image_source(data.source, true)) {
    $("#modal_image_toolbar_change").css("display", "flex")
  } else {
    $("#modal_image_toolbar_change").css("display", "none")
  }

  Hue.horizontal_separator($("#modal_image_header_info_container")[0])
  Hue.msg_modal_image.show()
}

// Starts events for the image
Hue.start_image_events = function () {
  $("#media_image_frame")[0].addEventListener("load", function (e) {
    Hue.after_image_load()
  })

  $("#media_image_frame").on("error", function () {
    $("#media_image_frame").css("display", "none")
    $("#media_image_error").css("display", "initial")
    Hue.after_image_load()
  })

  $("#media_image_frame").height(0)
  $("#media_image_frame").width(0)
}

// This runs after an image successfully loads
Hue.after_image_load = function (ok = true) {
  Hue.apply_media_info("image")

  if (ok) {
    Hue.fix_image_frame()
  }
}

// Setups image expansions when clicked
// When an image in the chat is clicked the image is shown full sized in a window
Hue.setup_expand_image = function () {
  let img = $("#expand_image")

  img[0].addEventListener("load", function () {
    img.css("display", "block")
    $("#expand_image_spinner").css("display", "none")
  })

  img.on("error", function () {
    $("#expand_image_spinner").css("display", "none")
    $("#expand_image").css("display", "none")
    $("#expand_image_error").css("display", "block")
  })

  $("#expand_image_container").on("click", function () {
    Hue.hide_expand_image()
  })
}

// Shows a window with an image at full size
Hue.expand_image = function (src) {
  $("#expand_image").css("display", "none")
  $("#expand_image_spinner").css("display", "block")
  $("#expand_image_error").css("display", "none")
  $("#expand_image").attr("src", src)
  Hue.msg_expand_image.show()
}

// Hides the expand image window
Hue.hide_expand_image = function () {
  Hue.msg_expand_image.close()
}

// Used to change the image
// Shows the image picker window to input a URL, or upload a file
Hue.show_image_picker = function () {
  Hue.msg_image_picker.show(function () {
    $("#image_source_picker_input").focus()
    Hue.show_media_history("image")
    Hue.scroll_modal_to_top("image_picker")
  })
}

// Shows the window to add a comment to an image upload
Hue.show_image_upload_comment = function (file, type) {
  $("#image_upload_comment_image_feedback").css("display", "none")
  $("#image_upload_comment_image_preview").css("display", "inline-block")

  let reader = new FileReader()

  reader.onload = function (e) {
    Hue.image_upload_comment_file = file
    Hue.image_upload_comment_type = type

    $("#image_upload_comment_image_preview").attr("src", e.target.result)

    Hue.msg_image_upload_comment.set_title(
      `${Hue.utilz.slice_string_end(
        file.name,
        20
      )} (${Hue.utilz.get_size_string(file.size, 2)})`
    )

    $("#Msg-titlebar-image_upload_comment").attr("title", file.name)

    Hue.msg_image_upload_comment.show(function () {
      $("#image_upload_comment_submit").on("click", function () {
        Hue.process_image_upload_comment()
      })

      $("#image_upload_comment_input").focus()
      Hue.scroll_modal_to_bottom("image_upload_comment")
    })
  }

  reader.readAsDataURL(file)
}

// Setups the upload image comment window
Hue.setup_image_upload_comment = function () {
  let img = $("#image_upload_comment_image_preview")

  img.on("error", function () {
    $(this).css("display", "none")
    $("#image_upload_comment_image_feedback").css("display", "inline")
  })
}

// Submits the upload image comment window
// Uploads the file and the optional comment
Hue.process_image_upload_comment = function () {
  if (!Hue.msg_image_upload_comment.is_open()) {
    return false
  }

  let file = Hue.image_upload_comment_file
  let type = Hue.image_upload_comment_type
  let comment = Hue.utilz.clean_string2($("#image_upload_comment_input").val())

  if (comment.length > Hue.config.max_media_comment_length) {
    return false
  }

  Hue.upload_file({ file: file, action: type, comment: comment })
  Hue.msg_image_upload_comment.close()
}

Hue.image_picker_submit = function () {
  let val = $("#image_source_picker_input").val().trim()

  if (val !== "") {
    Hue.change_image_source(val)
    Hue.close_all_modals()
  }
}