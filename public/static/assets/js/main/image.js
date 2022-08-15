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
  Hue.el("#media_image_error").style.display = "none"
  
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
    return
  }

  if (!Hue.el("#media_image_frame").naturalHeight) {
    return
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

  Hue.ev(img, "load", function () {
    Hue.el("#modal_image").style.display = "block"
  })

  Hue.ev(img, "error", function () {
    Hue.el("#modal_image").style.display = "none"
    Hue.el("#modal_image_error").style.display = "block"
  })

  let f = function (e) {
    if (e.ctrlKey || e.shiftKey) {
      return
    }

    if (Hue.el("#modal_image_container").classList.contains("expanded_image")) {
      return
    }

    let direction = e.deltaY > 0 ? "down" : "up"

    if (direction === "up") {
      Hue.modal_image_next_wheel_timer()
    } else if (direction === "down") {
      Hue.modal_image_prev_wheel_timer()
    }
  }

  Hue.ev(Hue.el("#Msg-window-modal_image"), "wheel", f)

  Hue.ev(Hue.el("#modal_image_container"), "click", function () {
    if (Hue.el("#modal_image_container").classList.contains("expanded_image")) {
      Hue.restore_modal_image()
    } else {
      Hue.hide_modal_image()
    }
  })

  Hue.ev(Hue.el("#modal_image_arrow_prev"), "click", function (e) {
    Hue.modal_image_prev_click()
  })

  Hue.ev(Hue.el("#modal_image_arrow_next"), "click", function (e) {
    Hue.modal_image_next_click()
  })

  Hue.ev(Hue.el("#modal_image_toolbar_expand"), "click", function (e) {
    if (Hue.el("#modal_image_container").classList.contains("expanded_image")) {
      Hue.restore_modal_image()
    } else {
      Hue.expand_modal_image()
    }
  })

  Hue.ev(Hue.el("#modal_image_toolbar_menu"), "click", function (e) {
    Hue.open_url_menu(Hue.loaded_modal_image)
  })

  Hue.ev(Hue.el("#modal_image_toolbar_list"), "click", function (e) {
    Hue.show_image_list()
  })

  Hue.ev(Hue.el("#modal_image_subheader"), "click", function () {
    Hue.open_view_text(this.textContent)
  })

  Hue.ev(Hue.el("#modal_image_profilepic"), "click", function (e) {
    let data = Hue.loaded_modal_image
    Hue.show_profile(data.username, data.user_id)
  })

  Hue.ev(Hue.el("#modal_image_username"), "click", function (e) {
    let data = Hue.loaded_modal_image
    Hue.show_profile(data.username, data.user_id)
  })
}

// Expand modal image to give it full height
Hue.expand_modal_image = function () {
  Hue.el("#modal_image_container").classList.add("expanded_image")
  Hue.el("#modal_image_toolbar_expand").textContent = "Restore"
}

// Restore expanded modal image
Hue.restore_modal_image = function () {
  Hue.el("#modal_image_container").classList.remove("expanded_image")
  Hue.el("#modal_image_toolbar_expand").textContent = "Expand"
}

// Expand view image to give it full height
Hue.expand_view_image = function () {
  Hue.el("#view_image_container").classList.add("expanded_image")
  Hue.el("#view_image_toolbar_expand").textContent = "Restore"
}

// Restore expanded view image
Hue.restore_view_image = function () {
  Hue.el("#view_image_container").classList.remove("expanded_image")
  Hue.el("#view_image_toolbar_expand").textContent = "Expand"
}

// Clears image information in the modal image window
Hue.clear_modal_image_info = function () {
  Hue.el("#modal_image_header_info").innerHTML = ""
  Hue.el("#modal_image_subheader").textContent = ""
}

// Clears information in the view image window
Hue.clear_view_image_info = function () {
  Hue.el("#view_image_subheader").textContent = ""
}

// Shows the modal image window
Hue.show_modal_image = function (id = 0) {  
  let data

  if (id) {
    data = Hue.get_media_item("image", id)
  } else if (Hue.loaded_image.source) {
    data = Hue.loaded_image
  }

  if (!data) {
    data = Hue.image_changed[Hue.image_changed.length - 1]
  }

  Hue.loaded_modal_image = data
  let img = Hue.el("#modal_image")
  img.style.display = "none"
  Hue.el("#modal_image_error").style.display = "none"
  img.src = data.source

  Hue.el("#modal_image_header_info").innerHTML = data.info_html
  Hue.el("#modal_image_header_info .modal_image_timeago")
    .textContent = Hue.utilz.timeago(data.date)

  Hue.horizontal_separator(Hue.el("#modal_image_header_info"))

  if (data.comment || data.query || data.hostname) {
    Hue.el("#modal_image_subheader").textContent = data.comment || data.query || data.hostname
  } else {
    Hue.el("#modal_image_subheader").textContent = ""
  }

  let dummy_image = new Image()

  dummy_image.onload = function () {
    Hue.apply_modal_image_resolution(dummy_image, data.source)
  }

  dummy_image.src = data.source

  let profilepic = Hue.el("#modal_image_profilepic")
  profilepic.src = Hue.get_profilepic(data.user_id)
  Hue.ev(profilepic, "error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.el("#modal_image_username").textContent = data.username

  Hue.horizontal_separator(Hue.el("#modal_image_header_info_container"))
  Hue.msg_modal_image.show()
}

// Hide modal image
Hue.hide_modal_image = function () {
  Hue.msg_modal_image.close()
}

// Starts events for the image
Hue.start_image_events = function () {
  Hue.ev(Hue.el("#media_image_frame"), "load", function (e) {
    Hue.after_image_load()
  })

  Hue.ev(Hue.el("#media_image_frame"), "error", function () {
    Hue.el("#media_image_frame").style.display = "none"
    Hue.el("#media_image_error").style.display = "initial"
    Hue.apply_media_info("image")
  })

  Hue.el("#media_image_frame").style.height = 0
  Hue.el("#media_image_frame").style.width = 0
}

// This runs after an image successfully loads
Hue.after_image_load = function (ok = true) {
  Hue.el("#media_image_frame").style.display = "initial"
  Hue.apply_media_info("image")

  if (ok) {
    Hue.fix_image_frame()
  }
}

// Setups image view when clicked
// When an image in the chat is clicked the image is shown full sized in a window
Hue.setup_view_image = function () {
  let img = Hue.el("#view_image")

  Hue.ev(img, "load", function () {
    img.style.display = "block"
  })

  Hue.ev(img, "error", function () {
    Hue.el("#view_image").style.display = "none"
    Hue.el("#view_image_error").style.display = "block"
  })

  Hue.ev(Hue.el("#view_image_container"), "click", function () {
    if (Hue.el("#view_image_container").classList.contains("expanded_image")) {
      Hue.restore_view_image()
    } else {
      Hue.msg_view_image.close()
    }
  })

  Hue.ev(Hue.el("#view_image_toolbar_expand"), "click", function (e) {
    if (Hue.el("#view_image_container").classList.contains("expanded_image")) {
      Hue.restore_view_image()
    } else {
      Hue.expand_view_image()
    }
  })

  Hue.ev(Hue.el("#view_image_toolbar_url"), "click", function () {
    Hue.open_view_text(Hue.view_image_source)
  })

  Hue.ev(Hue.el("#view_image_toolbar_link"), "click", function () {
    Hue.load_media_link("image", Hue.view_image_source, "")
    Hue.msg_open_url.close()
  })

  Hue.ev(Hue.el("#view_image_profilepic"), "click", function (e) {
    Hue.show_profile(Hue.view_image_username, Hue.view_image_user_id)
  })

  Hue.ev(Hue.el("#view_image_username"), "click", function (e) {
    Hue.show_profile(Hue.view_image_username, Hue.view_image_user_id)
  })

  Hue.ev(Hue.el("#view_image_subheader"), "click", function () {
    Hue.open_view_text(this.textContent)
  })
}

// Shows a window with an image at full size
Hue.view_image = function (src, username, user_id) {
  src = src.replace(".gifv", ".gif")
  Hue.el("#view_image").style.display = "none"
  Hue.el("#view_image_error").style.display = "none"
  Hue.el("#view_image").src = src

  let hostname = Hue.utilz.get_hostname(src)
  Hue.el("#view_image_subheader").textContent = hostname

  let dummy_image = new Image()

  dummy_image.onload = function () {
    Hue.apply_view_image_resolution(dummy_image, src)
  }

  let profilepic = Hue.el("#view_image_profilepic")
  profilepic.src = Hue.get_profilepic(user_id)
  Hue.ev(profilepic, "error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.el("#view_image_username").textContent = username

  dummy_image.src = src
  Hue.view_image_source = src
  Hue.view_image_username = username
  Hue.view_image_user_id = user_id
  Hue.msg_view_image.show()
}

// Shows the window to add a comment to an image upload
Hue.show_image_upload_comment = function (file, type) {
  Hue.el("#image_upload_comment_image_feedback").style.display = "none"
  Hue.el("#image_upload_comment_image_preview").style.display = "block"

  Hue.image_upload_comment_file = file
  Hue.image_upload_comment_type = type

  if (type === "drawing") {
    Hue.el("#image_upload_comment_change").textContent = "Re-Draw"
  } else if (type === "upload") {
    Hue.el("#image_upload_comment_change").textContent = "Re-Choose"
  } else if (type === "screenshot") {
    Hue.el("#image_upload_comment_change").textContent = "Re-Take"
  } else if (type === "random_canvas") {
    Hue.el("#image_upload_comment_change").textContent = "Re-Generate"
  }

  let name = `${Hue.utilz.slice_string_end(
      file.name,
      20
    )} (${Hue.utilz.size_string(file.size, 2)})`
  
  Hue.el("#image_upload_name").textContent = name
  Hue.el("#Msg-titlebar-image_upload_comment").title = file.name

  let reader = new FileReader()

  reader.onload = function (e) {
    Hue.el("#image_upload_comment_image_preview").src = e.target.result
  }

  reader.readAsDataURL(file)

  Hue.msg_image_upload_comment.show(function () {
    Hue.el("#image_upload_comment_input").focus()
  })
}

// Setups the upload image comment window
Hue.setup_image_upload_comment = function () {
  let image = Hue.el("#image_upload_comment_image_preview")

  Hue.ev(image, "error", function () {
    this.style.display = "none"
    Hue.el("#image_upload_comment_image_feedback").style.display = "inline"
  })

  Hue.ev(Hue.el("#image_upload_comment_submit"), "click", function () {
    Hue.process_image_upload_comment()
  })

  Hue.ev(Hue.el("#image_upload_comment_change"), "click", function () {
    if (Hue.image_upload_comment_type === "drawing") {
      Hue.msg_image_upload_comment.close()
      Hue.open_draw_image("image")
    } else if (Hue.image_upload_comment_type === "upload") {
      Hue.msg_image_upload_comment.close()
      Hue.show_upload_image()
    } else if (Hue.image_upload_comment_type === "screenshot") {
      Hue.msg_image_upload_comment.close()
      Hue.take_screenshot()
    } else if (Hue.image_upload_comment_type === "random_canvas") {
      Hue.make_random_image("image")
    }
  })
}

// Submits the upload image comment window
// Uploads the file and the optional comment
Hue.process_image_upload_comment = function () {
  if (!Hue.msg_image_upload_comment.is_open()) {
    return
  }

  let file = Hue.image_upload_comment_file
  let comment = Hue.utilz.single_space(Hue.el("#image_upload_comment_input").value)

  if (comment.length > Hue.config.max_media_comment_length) {
    return
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

// Trigger upload image picker
Hue.show_upload_image = function () {
  Hue.upload_media = "image"
  Hue.trigger_dropzone()
}

// Apply modal image resolution to modal image
Hue.apply_modal_image_resolution = function (image, src) {
  if (image.src !== src) {
    return
  }

  let subheader = Hue.el("#modal_image_subheader")
  let text = subheader.textContent
  subheader.textContent = `${text} (${image.width} x ${image.height})`
}

// Apply modal image resolution to view image
Hue.apply_view_image_resolution = function (image, src) {
  if (image.src !== src) {
    return
  }

  let subheader = Hue.el("#view_image_subheader")
  let text = subheader.textContent
  subheader.textContent = `${text} (${image.width} x ${image.height})`
}

// Take a screenshot
Hue.take_screenshot = async function () {
  let stream = await navigator.mediaDevices.getDisplayMedia({
    audio: false, 
    video: {mediaSource: "screen"}
  })

  let video = Hue.create("video")
  let canvas = Hue.create("canvas")
  let context = canvas.getContext("2d")
  video.srcObject = stream

  Hue.ev(video, "loadeddata", async () => {
    stream.getTracks().forEach(track => track.stop())
    let { videoWidth, videoHeight } = video
    canvas.width = videoWidth
    canvas.height = videoHeight
    await video.play()
    context.drawImage(video, 0, 0, videoWidth, videoHeight)

    canvas.toBlob(
      function (blob) {
        blob.name = "screenshot.jpg"
        Hue.show_image_upload_comment(blob, "screenshot")
      },
      "image/jpeg",
      Hue.config.image_blob_quality
    )
  })
}

// Make a random image
Hue.make_random_image = function (target) {
  let canvas = Hue.create("canvas")

  canvas.width = 1280
  canvas.height = 1280

  jdenticon.update(canvas, Hue.utilz.random_sequence(9), {
    backColor: Hue.colorlib.get_random_hex()
  })
  
  canvas.toBlob(
    function (blob) {
      blob.name = "random.png"

      if (target === "image") {
        Hue.show_image_upload_comment(blob, "random_canvas")
      } else if (target === "profilepic") {
        Hue.profilepic_selected(blob, "random_canvas")
      } else if (target === "background") {
        Hue.background_selected(blob)
      }
    },
    "image/png",
    Hue.config.image_blob_quality
  )
}

// Toggle modal image
Hue.toggle_modal_image = function () {
  if (Hue.msg_modal_image.is_open()) {
    Hue.hide_modal_image()
  } else {
    Hue.show_modal_image()
  }
}