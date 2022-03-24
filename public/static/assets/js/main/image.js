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
  Hue.el("#media_image_spinner").style.display = "block"
  Hue.el("#media_image_error").style.display = "none"
  Hue.el("#media_image_frame").style.display = "none"
  Hue.el("#media_image_info_container").style.visibility = "hidden"

  if (force || Hue.el("#media_image_frame").src !== item.source) {
    Hue.el("#media_image_frame").src = item.source
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

  src = Hue.utilz.single_space(src)

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

    if (!Hue.utilz.is_image(src)) {
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

  if (!Hue.el("#media_image_frame").naturalHeight) {
    return false
  }

  Hue.fix_frame("media_image_frame")
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
  let img = Hue.el("#modal_image")

  img.addEventListener("load", function () {
    Hue.el("#modal_image_spinner").style.display = "none"
    Hue.el("#modal_image").style.display = "block"
  })

  img.addEventListener("error", function () {
    Hue.el("#modal_image_spinner").style.display = "none"
    Hue.el("#modal_image").style.display = "none"
    Hue.el("#modal_image_error").style.display = "block"
  })

  let f = function (e) {
    if (e.ctrlKey || e.shiftKey) {
      return false
    }

    if (Hue.el("#modal_image_container").classList.contains("expanded_modal_image")) {
      return false
    }

    let direction = e.deltaY > 0 ? "down" : "up"

    if (direction === "up") {
      Hue.modal_image_next_wheel_timer()
    } else if (direction === "down") {
      Hue.modal_image_prev_wheel_timer()
    }
  }

  Hue.el("#Msg-window-modal_image").addEventListener("wheel", f)

  Hue.el("#modal_image_container").addEventListener("click", function () {
    if (Hue.el("#modal_image_container").classList.contains("expanded_modal_image")) {
      Hue.restore_modal_image()
    } else {
      Hue.msg_modal_image.close()
    }
  })

  Hue.el("#modal_image_arrow_prev").addEventListener("click", function (e) {
    Hue.modal_image_prev_click()
  })

  Hue.el("#modal_image_arrow_next").addEventListener("click", function (e) {
    Hue.modal_image_next_click()
  })

  Hue.el("#modal_image_toolbar_expand").addEventListener("click", function (e) {
    if (Hue.el("#modal_image_container").classList.contains("expanded_modal_image")) {
      Hue.restore_modal_image()
    } else {
      Hue.expand_modal_image()
    }
  })

  Hue.el("#modal_image_toolbar_menu").addEventListener("click", function (e) {
    Hue.open_url_menu(Hue.loaded_modal_image)
  })

  Hue.el("#modal_image_subheader").addEventListener("click", function () {
    Hue.open_view_text(this.textContent)
  })
}

// Expand modal image to give it full height
Hue.expand_modal_image = function () {
  Hue.el("#modal_image_container").classList.add("expanded_modal_image")
  Hue.el("#modal_image_toolbar_expand").textContent = "Restore"
}

// Restore expanded modal image
Hue.restore_modal_image = function () {
  Hue.el("#modal_image_container").classList.remove("expanded_modal_image")
  Hue.el("#modal_image_toolbar_expand").textContent = "Expand"
}

// Clears image information in the modal image window
Hue.clear_modal_image_info = function () {
  Hue.el("#modal_image_header_info").innerHTML = ""
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
  let img = Hue.el("#modal_image")
  img.style.display = "none"
  Hue.el("#modal_image_spinner").style.display = "block"
  Hue.el("#modal_image_error").style.display = "none"
  img.src = data.source

  Hue.el("#modal_image_header_info").innerHTML = data.info_html
  Hue.el("#modal_image_header_info .modal_image_timeago")
    .textContent = Hue.utilz.timeago(data.date)

  Hue.horizontal_separator(Hue.el("#modal_image_header_info"))

  if (data.comment || data.query) {
    Hue.el("#modal_image_subheader").innerHTML =
      Hue.parse_text(Hue.utilz.make_html_safe(data.comment || data.query))
    Hue.el("#modal_image_subheader").style.display = "block"
  } else {
    Hue.el("#modal_image_subheader").style.display = "none"
  }

  Hue.horizontal_separator(Hue.el("#modal_image_header_info_container"))
  Hue.msg_modal_image.show()
}

// Starts events for the image
Hue.start_image_events = function () {
  Hue.el("#media_image_frame").addEventListener("load", function (e) {
    Hue.after_image_load()
  })

  Hue.el("#media_image_frame").addEventListener("error", function () {
    Hue.el("#media_image_spinner").style.display = "none"
    Hue.el("#media_image_frame").style.display = "none"
    Hue.el("#media_image_error").style.display = "initial"
    Hue.after_image_load()
  })

  Hue.el("#media_image_frame").style.height = 0
  Hue.el("#media_image_frame").style.width = 0
}

// This runs after an image successfully loads
Hue.after_image_load = function (ok = true) {
  Hue.el("#media_image_spinner").style.display = "none"
  Hue.el("#media_image_frame").style.display = "initial"

  Hue.apply_media_info("image")

  if (ok) {
    Hue.fix_image_frame()
  }
}

// Setups image expansions when clicked
// When an image in the chat is clicked the image is shown full sized in a window
Hue.setup_expand_image = function () {
  let img = Hue.el("#expand_image")

  img.addEventListener("load", function () {
    img.style.display = "block"
    Hue.el("#expand_image_spinner").style.display = "none"
  })

  img.addEventListener("error", function () {
    Hue.el("#expand_image_spinner").style.display = "none"
    Hue.el("#expand_image").style.display = "none"
    Hue.el("#expand_image_error").style.display = "block"
  })

  Hue.el("#expand_image_container").addEventListener("click", function () {
    Hue.hide_expand_image()
  })
}

// Shows a window with an image at full size
Hue.expand_image = function (src) {
  Hue.el("#expand_image").style.display = "none"
  Hue.el("#expand_image_spinner").style.display = "block"
  Hue.el("#expand_image_error").style.display = "none"
  Hue.el("#expand_image").src = src
  Hue.msg_expand_image.show()
}

// Hides the expand image window
Hue.hide_expand_image = function () {
  Hue.msg_expand_image.close()
}

// Shows the window to add a comment to an image upload
Hue.show_image_upload_comment = function (file, type) {
  Hue.el("#image_upload_comment_image_feedback").style.display = "none"
  Hue.el("#image_upload_comment_image_preview").style.display = "inline-block"

  let reader = new FileReader()

  reader.onload = function (e) {
    Hue.image_upload_comment_file = file
    Hue.image_upload_comment_type = type

    if (type === "drawing") {
      Hue.el("#image_upload_comment_change").textContent = "Re-Draw"
    } else if (type === "upload") {
      Hue.el("#image_upload_comment_change").textContent = "Re-Choose"
    } else if (type === "random_canvas") {
      Hue.el("#image_upload_comment_change").textContent = "Re-Generate"
    }

    Hue.el("#image_upload_comment_image_preview").src = e.target.result

    Hue.msg_image_upload_comment.set_title(
      `${Hue.utilz.slice_string_end(
        file.name,
        20
      )} (${Hue.utilz.get_size_string(file.size, 2)})`
    )

    Hue.el("#Msg-titlebar-image_upload_comment").title = file.name

    Hue.msg_image_upload_comment.show(function () {
      Hue.el("#image_upload_comment_input").focus()
    })
  }

  reader.readAsDataURL(file)
}

// Setups the upload image comment window
Hue.setup_image_upload_comment = function () {
  let image = Hue.el("#image_upload_comment_image_preview")

  image.addEventListener("error", function () {
    this.style.display = "none"
    Hue.el("#image_upload_comment_image_feedback").style.display = "inline"
  })

  image.addEventListener("load", function () {
    Hue.scroll_modal_to_bottom("image_upload_comment")
  })

  Hue.el("#image_upload_comment_submit").addEventListener("click", function () {
    Hue.process_image_upload_comment()
  })

  Hue.el("#image_upload_comment_change").addEventListener("click", function () {
    if (Hue.image_upload_comment_type === "drawing") {
      Hue.msg_image_upload_comment.close()
      Hue.open_draw_image("image")
    } else if (Hue.image_upload_comment_type === "upload") {
      Hue.msg_image_upload_comment.close()
      Hue.show_upload_image()
    } else if (Hue.image_upload_comment_type === "random_canvas") {
      Hue.make_random_drawing("image")
    }
  })
}

// Submits the upload image comment window
// Uploads the file and the optional comment
Hue.process_image_upload_comment = function () {
  if (!Hue.msg_image_upload_comment.is_open()) {
    return false
  }

  let file = Hue.image_upload_comment_file
  let comment = Hue.utilz.single_space(Hue.el("#image_upload_comment_input").value)

  if (comment.length > Hue.config.max_media_comment_length) {
    return false
  }

  Hue.upload_file({ file: file, action: "image_upload", comment: comment })
  Hue.close_all_modals()
}

// Show link image
Hue.show_link_image = function () {
  Hue.msg_link_image.show()
}

// Submit link image
Hue.link_image_submit = function () {
  let val = Hue.el("#link_image_input").value.trim()

  if (val !== "") {
    Hue.change_image_source(val)
    Hue.close_all_modals()
  }
}

// Use the image wheel to load prev or next images
Hue.image_wheel_action = function (direction) {
  if (direction === "down") {
    Hue.image_wheel_prev()
  } else if (direction === "up") {
    Hue.image_wheel_next()
  }
}

// Previous image to load on wheel
Hue.image_wheel_prev = function () {
  if (Hue.image_changed.length < 2) {
    return
  }

  let index = Hue.image_changed.indexOf(Hue.loaded_image) - 1

  if (index < 0) {
    index = Hue.image_changed.length - 1
  }

  let prev = Hue.image_changed[index]
  Hue.load_media(prev)
}

// Next image to load on wheel
Hue.image_wheel_next = function (e) {
  if (Hue.image_changed.length < 2) {
    return
  }

  let index = Hue.image_changed.indexOf(Hue.loaded_image) + 1

  if (index > Hue.image_changed.length - 1) {
    index = 0
  }

  let next = Hue.image_changed[index]
  Hue.load_media(next)
}

// Trigger upload image picker
Hue.show_upload_image = function () {
  Hue.el("#image_picker_upload").click()
}