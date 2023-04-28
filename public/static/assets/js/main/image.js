// Pushes a changed image into the image changed array
App.push_image_changed = (data) => {
  App.image_changed.push(data)

  if (App.image_changed.length > App.config.media_changed_crop_limit) {
    App.image_changed = App.image_changed.slice(
      App.image_changed.length - App.config.media_changed_crop_limit
    )
  }
}

// Returns the current room image
// The last image in the image changed array
// This is not necesarily the user's loaded image
App.current_image = () => {
  if (App.image_changed.length > 0) {
    return App.image_changed[App.image_changed.length - 1]
  }
  else {
    return {}
  }
}

// Loads an image with a specified item
App.show_image = (force = false) => {
  let item = App.loaded_image
  App.el(`#media_image_error`).style.display = `none`

  if (force || App.el(`#media_image_frame`).src !== item.source) {
    App.el(`#media_image_frame`).src = item.source
  }
  else {
    App.after_image_load(false)
  }
}

// Attempts to change the image source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
App.change_image_source = (src, just_check = false, comment = ``) => {
  let feedback = true

  if (just_check) {
    feedback = false
  }

  if (!comment) {
    let r = App.get_media_change_inline_comment(`image`, src)
    src = r.source
    comment = r.comment
  }

  if (comment.length > App.config.max_media_comment_length) {
    if (feedback) {
      App.checkmsg(`Comment is too long`)
    }

    return false
  }

  if (src.length === 0) {
    return false
  }

  src = App.utilz.single_space(src)

  if (src.length > App.config.max_media_source_length) {
    return false
  }

  if (src.startsWith(`/`)) {
    return false
  }

  if (src === App.current_image().source || src === App.current_image().query) {
    if (feedback) {
      App.checkmsg(`Image is already set to that`)
    }

    return false
  }
  else if (App.utilz.is_url(src)) {
    src = src.replace(/\.gifv/g, `.gif`)

    if (!App.utilz.is_image(src)) {
      if (feedback) {
        App.checkmsg(`That doesn't seem to be an image`)
      }

      return false
    }
  }
  else {
    if (src.length > App.config.safe_limit_1) {
      if (feedback) {
        App.checkmsg(`Query is too long`)
      }

      return false
    }

    if (!App.config.imgur_enabled) {
      if (feedback) {
        App.checkmsg(`Imgur support is not enabled`)
      }

      return false
    }
  }

  if (just_check) {
    return true
  }

  App.emit_change_image_source(src, comment)
}

// Sends an emit to change the image source
App.emit_change_image_source = (url, comment = ``) => {
  App.socket_emit(`change_image_source`, { src: url, comment: comment })
}

// Updates dimensions of the image
App.fix_image_frame = () => {
  if (!App.image_visible) {
    return
  }

  if (!App.el(`#media_image_frame`).naturalHeight) {
    return
  }

  App.fix_frame(`media_image_frame`)
}

// When clicking the Previous button in the image modal window
App.modal_image_prev_click = () => {
  if (App.image_changed.length < 2) {
    return
  }

  let index = App.image_changed.indexOf(App.loaded_modal_image) - 1

  if (index < 0) {
    index = App.image_changed.length - 1
  }

  let prev = App.image_changed[index]
  App.show_modal_image(prev.id)
}

// When clicking the Next button in the image modal window
App.modal_image_next_click = (e) => {
  if (App.image_changed.length < 2) {
    return
  }

  let index = App.image_changed.indexOf(App.loaded_modal_image) + 1

  if (index > App.image_changed.length - 1) {
    index = 0
  }

  let next = App.image_changed[index]
  App.show_modal_image(next.id)
}

// Setups image modal window events
App.setup_modal_image = () => {
  let img = App.el(`#modal_image`)

  App.ev(img, `load`, () => {
    App.el(`#modal_image`).style.display = `block`
  })

  App.ev(img, `error`, () => {
    App.el(`#modal_image`).style.display = `none`
    App.el(`#modal_image_error`).style.display = `block`
  })

  let f = (e) => {
    if (e.ctrlKey || e.shiftKey) {
      return
    }

    if (App.el(`#modal_image_container`).classList.contains(`expanded_image`)) {
      return
    }

    let direction = e.deltaY > 0 ? `down` : `up`

    if (direction === `up`) {
      App.modal_image_next_wheel_timer()
    }
    else if (direction === `down`) {
      App.modal_image_prev_wheel_timer()
    }
  }

  App.ev(App.el(`#Msg-window-modal_image`), `wheel`, f)

  App.ev(App.el(`#modal_image_container`), `click`, () => {
    if (App.el(`#modal_image_container`).classList.contains(`expanded_image`)) {
      App.restore_modal_image()
    }
    else {
      App.hide_modal_image()
    }
  })

  App.ev(App.el(`#modal_image_arrow_prev`), `click`, (e) => {
    App.modal_image_prev_click()
  })

  App.ev(App.el(`#modal_image_arrow_next`), `click`, (e) => {
    App.modal_image_next_click()
  })

  App.ev(App.el(`#modal_image_toolbar_expand`), `click`, (e) => {
    if (App.el(`#modal_image_container`).classList.contains(`expanded_image`)) {
      App.restore_modal_image()
    }
    else {
      App.expand_modal_image()
    }
  })

  App.ev(App.el(`#modal_image_toolbar_menu`), `click`, (e) => {
    App.open_url_menu(App.loaded_modal_image)
  })

  App.ev(App.el(`#modal_image_toolbar_list`), `click`, (e) => {
    App.show_image_list()
  })

  let subheader = App.el(`#modal_image_subheader`)

  App.ev(subheader, `click`, () => {
    App.open_view_text(subheader.textContent)
  })

  App.ev(App.el(`#modal_image_profilepic`), `click`, (e) => {
    let data = App.loaded_modal_image
    App.show_profile(data.username, data.user_id)
  })

  App.ev(App.el(`#modal_image_username`), `click`, (e) => {
    let data = App.loaded_modal_image
    App.show_profile(data.username, data.user_id)
  })
}

// Expand modal image to give it full height
App.expand_modal_image = () => {
  App.el(`#modal_image_container`).classList.add(`expanded_image`)
  App.el(`#modal_image_toolbar_expand`).textContent = `Restore`
}

// Restore expanded modal image
App.restore_modal_image = () => {
  App.el(`#modal_image_container`).classList.remove(`expanded_image`)
  App.el(`#modal_image_toolbar_expand`).textContent = `Expand`
}

// Expand view image to give it full height
App.expand_view_image = () => {
  App.el(`#view_image_container`).classList.add(`expanded_image`)
  App.el(`#view_image_toolbar_expand`).textContent = `Restore`
}

// Restore expanded view image
App.restore_view_image = () => {
  App.el(`#view_image_container`).classList.remove(`expanded_image`)
  App.el(`#view_image_toolbar_expand`).textContent = `Expand`
}

// Clears image information in the modal image window
App.clear_modal_image_info = () => {
  App.el(`#modal_image_header_info`).innerHTML = ``
  App.el(`#modal_image_subheader`).textContent = ``
}

// Clears information in the view image window
App.clear_view_image_info = () => {
  App.el(`#view_image_subheader`).textContent = ``
}

// Shows the modal image window
App.show_modal_image = (id = 0) => {
  let data

  if (id) {
    data = App.get_media_item(`image`, id)
  }
  else if (App.loaded_image.source) {
    data = App.loaded_image
  }

  if (!data) {
    data = App.image_changed[App.image_changed.length - 1]
  }

  App.loaded_modal_image = data
  let img = App.el(`#modal_image`)
  img.style.display = `none`
  App.el(`#modal_image_error`).style.display = `none`
  img.src = data.source

  App.el(`#modal_image_header_info`).innerHTML = data.info_html
  App.el(`#modal_image_header_info .modal_image_timeago`)
    .textContent = App.utilz.timeago(data.date)

  App.horizontal_separator(App.el(`#modal_image_header_info`))

  if (data.comment || data.query || data.hostname) {
    App.el(`#modal_image_subheader`).textContent = data.comment || data.query || data.hostname
  }
  else {
    App.el(`#modal_image_subheader`).textContent = ``
  }

  let dummy_image = new Image()

  dummy_image.onload = () => {
    App.apply_modal_image_resolution(dummy_image, data.source)
  }

  dummy_image.src = data.source

  let profilepic = App.el(`#modal_image_profilepic`)
  profilepic.src = App.get_profilepic(data.user_id)

  App.ev(profilepic, `error`, () => {
    App.fallback_profilepic(profilepic)
  })

  App.el(`#modal_image_username`).textContent = data.username

  App.horizontal_separator(App.el(`#modal_image_header_info_container`))
  App.msg_modal_image.show()
}

// Hide modal image
App.hide_modal_image = () => {
  App.msg_modal_image.close()
}

// Starts events for the image
App.start_image_events = () => {
  App.ev(App.el(`#media_image_frame`), `load`, (e) => {
    App.after_image_load()
  })

  App.ev(App.el(`#media_image_frame`), `error`, () => {
    App.el(`#media_image_frame`).style.display = `none`
    App.el(`#media_image_error`).style.display = `initial`
    App.apply_media_info(`image`)
  })

  App.el(`#media_image_frame`).style.height = 0
  App.el(`#media_image_frame`).style.width = 0
}

// This runs after an image successfully loads
App.after_image_load = (ok = true) => {
  App.el(`#media_image_frame`).style.display = `initial`
  App.apply_media_info(`image`)

  if (ok) {
    App.fix_image_frame()
  }
}

// Setups image view when clicked
// When an image in the chat is clicked the image is shown full sized in a window
App.setup_view_image = () => {
  let img = App.el(`#view_image`)

  App.ev(img, `load`, () => {
    img.style.display = `block`
  })

  App.ev(img, `error`, () => {
    App.el(`#view_image`).style.display = `none`
    App.el(`#view_image_error`).style.display = `block`
  })

  App.ev(App.el(`#view_image_container`), `click`, () => {
    if (App.el(`#view_image_container`).classList.contains(`expanded_image`)) {
      App.restore_view_image()
    }
    else {
      App.msg_view_image.close()
    }
  })

  App.ev(App.el(`#view_image_toolbar_expand`), `click`, (e) => {
    if (App.el(`#view_image_container`).classList.contains(`expanded_image`)) {
      App.restore_view_image()
    }
    else {
      App.expand_view_image()
    }
  })

  App.ev(App.el(`#view_image_toolbar_url`), `click`, () => {
    App.open_view_text(App.view_image_source)
  })

  App.ev(App.el(`#view_image_toolbar_link`), `click`, () => {
    App.load_media_link(`image`, App.view_image_source, ``)
    App.msg_open_url.close()
  })

  App.ev(App.el(`#view_image_profilepic`), `click`, (e) => {
    App.show_profile(App.view_image_username, App.view_image_user_id)
  })

  App.ev(App.el(`#view_image_username`), `click`, (e) => {
    App.show_profile(App.view_image_username, App.view_image_user_id)
  })

  let subheader = App.el(`#view_image_subheader`)

  App.ev(subheader, `click`, () => {
    App.open_view_text(subheader.textContent)
  })
}

// Shows a window with an image at full size
App.view_image = (src, username, user_id) => {
  src = src.replace(`.gifv`, `.gif`)
  App.el(`#view_image`).style.display = `none`
  App.el(`#view_image_error`).style.display = `none`
  App.el(`#view_image`).src = src

  let hostname = App.utilz.get_hostname(src)
  App.el(`#view_image_subheader`).textContent = hostname

  let dummy_image = new Image()

  dummy_image.onload = () => {
    App.apply_view_image_resolution(dummy_image, src)
  }

  let profilepic = App.el(`#view_image_profilepic`)
  profilepic.src = App.get_profilepic(user_id)
  App.ev(profilepic, `error`, () => {
    App.fallback_profilepic(profilepic)
  })

  App.el(`#view_image_username`).textContent = username

  dummy_image.src = src
  App.view_image_source = src
  App.view_image_username = username
  App.view_image_user_id = user_id
  App.msg_view_image.show()
}

// Shows the window to add a comment to an image upload
App.show_image_upload_comment = (file, type) => {
  App.el(`#image_upload_comment_image_feedback`).style.display = `none`
  App.el(`#image_upload_comment_image_preview`).style.display = `block`

  App.image_upload_comment_file = file
  App.image_upload_comment_type = type

  if (type === `drawing`) {
    App.el(`#image_upload_comment_change`).textContent = `Re-Draw`
  }
  else if (type === `upload`) {
    App.el(`#image_upload_comment_change`).textContent = `Re-Choose`
  }
  else if (type === `screenshot`) {
    App.el(`#image_upload_comment_change`).textContent = `Re-Take`
  }
  else if (type === `random_canvas`) {
    App.el(`#image_upload_comment_change`).textContent = `Re-Generate`
  }

  let name = `${App.utilz.slice_string_end(
      file.name,
      20
    )} (${App.utilz.size_string(file.size, 2)})`

  App.el(`#image_upload_name`).textContent = name
  App.el(`#Msg-titlebar-image_upload_comment`).title = file.name
  App.el(`#image_upload_comment_image_preview`).src = URL.createObjectURL(file)

  App.msg_image_upload_comment.show(() => {
    App.el(`#image_upload_comment_input`).focus()
  })
}

// Setups the upload image comment window
App.setup_image_upload_comment = () => {
  let image = App.el(`#image_upload_comment_image_preview`)

  App.ev(image, `error`, () => {
    image.style.display = `none`
    App.el(`#image_upload_comment_image_feedback`).style.display = `inline`
  })

  App.ev(App.el(`#image_upload_comment_submit`), `click`, () => {
    App.process_image_upload_comment()
  })

  App.ev(App.el(`#image_upload_comment_change`), `click`, () => {
    if (App.image_upload_comment_type === `drawing`) {
      App.msg_image_upload_comment.close()
      App.open_draw_image(`image`)
    }
    else if (App.image_upload_comment_type === `upload`) {
      App.msg_image_upload_comment.close()
      App.show_upload_image()
    }
    else if (App.image_upload_comment_type === `screenshot`) {
      App.msg_image_upload_comment.close()
      App.take_screenshot()
    }
    else if (App.image_upload_comment_type === `random_canvas`) {
      App.make_random_image(`image`)
    }
  })
}

// Submits the upload image comment window
// Uploads the file and the optional comment
App.process_image_upload_comment = () => {
  if (!App.msg_image_upload_comment.is_open()) {
    return
  }

  let file = App.image_upload_comment_file
  let comment = App.utilz.single_space(App.el(`#image_upload_comment_input`).value)

  if (comment.length > App.config.max_media_comment_length) {
    return
  }

  App.upload_file({ file: file, action: `image_upload`, comment: comment })
  App.close_all_modals()
}

// Show link image
App.show_link_image = () => {
  App.msg_link_image.show()
}

// Submit link image
App.link_image_submit = () => {
  let val = App.el(`#link_image_input`).value.trim()

  if (val !== ``) {
    App.change_image_source(val)
    App.close_all_modals()
  }
}

// Trigger upload image picker
App.show_upload_image = () => {
  App.upload_media = `image`
  App.trigger_dropzone()
}

// Apply modal image resolution to modal image
App.apply_modal_image_resolution = (image, src) => {
  if (image.src !== src) {
    return
  }

  let subheader = App.el(`#modal_image_subheader`)
  let text = subheader.textContent
  subheader.textContent = `${text} (${image.width} x ${image.height})`
}

// Apply modal image resolution to view image
App.apply_view_image_resolution = (image, src) => {
  if (image.src !== src) {
    return
  }

  let subheader = App.el(`#view_image_subheader`)
  let text = subheader.textContent
  subheader.textContent = `${text} (${image.width} x ${image.height})`
}

// Take a screenshot
App.take_screenshot = async () => {
  let stream = await navigator.mediaDevices.getDisplayMedia({
    audio: false,
    video: {mediaSource: `screen`}
  })

  let video = App.create(`video`)
  let canvas = App.create(`canvas`)
  let context = canvas.getContext(`2d`)
  video.srcObject = stream

  App.ev(video, `loadeddata`, async () => {
    stream.getTracks().forEach(track => track.stop())
    let { videoWidth, videoHeight } = video
    canvas.width = videoWidth
    canvas.height = videoHeight
    await video.play()
    context.drawImage(video, 0, 0, videoWidth, videoHeight)

    canvas.toBlob(
      (blob) => {
        blob.name = `screenshot.jpg`
        App.show_image_upload_comment(blob, `screenshot`)
      },
      `image/jpeg`,
      App.config.image_blob_quality
    )
  })
}

// Make a random image
App.make_random_image = (target) => {
  let canvas = App.create(`canvas`)

  canvas.width = 1280
  canvas.height = 1280

  jdenticon.update(canvas, App.utilz.random_sequence(9), {
    backColor: App.colorlib.get_random_hex()
  })

  canvas.toBlob(
    (blob) => {
      blob.name = `random.png`

      if (target === `image`) {
        App.show_image_upload_comment(blob, `random_canvas`)
      }
      else if (target === `profilepic`) {
        App.profilepic_selected(blob, `random_canvas`)
      }
      else if (target === `background`) {
        App.background_selected(blob)
      }
    },
    `image/png`,
    App.config.image_blob_quality
  )
}