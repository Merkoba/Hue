// Starts Dropzone events for file drag and drop events
// This also handles normal uploads by clicking the Upload button
App.setup_upload = () => {
  DOM.ev(document.body, `dragenter`, (e) => {
    App.upload_media = undefined
  })

  DOM.ev(document.body, `dragover`, (e) => {
    e.preventDefault()
    e.stopPropagation()
  })

  DOM.ev(document.body, `drop`, (e) => {
    e.preventDefault()
    e.stopPropagation()

    let files = e.dataTransfer.files

    if (files && (files.length > 0)) {
      App.process_file_added_debouncer.call(files[0])
    }
  })

  let filepicker = DOM.el(`#filepicker`)

  DOM.ev(filepicker, `change`, (e) => {
    let files = e.target.files

    if (files && (files.length > 0)) {
      App.process_file_added_debouncer.call(files[0])
    }
  })
}

// Show the file picker to pick media
App.trigger_filepicker = (type = ``) => {
  let input = DOM.el(`#filepicker`)
  let types

  if (type === `image`) {
    types = App.utilz.image_types
  }
  else if (type === `tv`) {
    types = [...App.utilz.video_types, ...App.utilz.audio_types]
  }
  else if (type === `audioclip`) {
    types = [`audio/mpeg`]
  }
  else {
    types = [`*`]
  }

  input.accept = types.join(`,`)
  input.click()
}

// Process file upload
App.do_process_file_added = (file) => {
  if (!App.check_limited()) {
    return
  }

  let is_image = App.utilz.is_image(file.name)
  let is_video = App.utilz.is_video(file.name)
  let is_audio = App.utilz.is_audio(file.name)

  if (App.upload_media) {
    if (App.upload_media === `image`) {
      if (is_image) {
        App.upload_image(file)
      }
      else if (is_video || is_audio) {
        App.upload_video(file)
      }
    }
    else if (App.upload_media === `tv`) {
      if (is_video || is_audio) {
        App.upload_video(file)
      }
      else if (is_image) {
        App.upload_image(file)
      }
    }
    else if (App.upload_media === `background`) {
      if (is_image) {
        App.background_selected(file)
      }
    }
    else if (App.upload_media === `profilepic`) {
      if (is_image) {
        App.profilepic_selected(file, `upload`)
      }
    }
    else if (App.upload_media === `audioclip`) {
      if (is_audio) {
        App.audioclip_selected(file)
      }
    }
  }
  else if (is_image) {
    App.upload_image(file)
  }
  else if (is_video || is_audio) {
    App.upload_video(file)
  }
}

// Handle generic image upload
App.upload_image = (file) => {
  if (App.msg_room_config.is_open()) {
    App.background_selected(file)
    return
  }
  else if (App.msg_user_profile.is_open()) {
    App.profilepic_selected(file, `upload`)
    return
  }

  App.focus_input()

  let size = file.size / 1024

  if (size > App.config.max_image_size) {
    App.show_info(`File is too big`)
    return
  }

  if (!App.utilz.is_image(file.name)) {
    return
  }

  App.show_image_upload_comment(file, `upload`)
}

// Handle generic video upload
App.upload_video = (file) => {
  App.focus_input()

  let size = file.size / 1024

  if (size > App.config.max_tv_size) {
    App.show_info(`File is too big`)
    return
  }

  let is_video = App.utilz.is_video(file.name)
  let is_audio = App.utilz.is_audio(file.name)

  if (!is_video && !is_audio) {
    return
  }

  App.show_tv_upload_comment(file, `upload`)
}

// Handles file uploads of different kinds
// Sets all required data
// Starts a sliced upload
App.upload_file = (args = {}) => {
  if (!args.file || !args.action) {
    return
  }

  let now = Date.now()

  let obj = {
    args: {},
  }

  obj.current_slice = 0
  obj.file = new Blob([args.file])
  obj.args.action = args.action

  if (args.name) {
    obj.args.name = args.name
  }
  else {
    obj.args.name = args.file.name
  }

  if (args.comment) {
    obj.args.comment = args.comment
  }

  obj.args.size = obj.file.size
  obj.args.type = args.file.type
  obj.args.date = now

  if (obj.args.name !== undefined) {
    obj.args.name = App.utilz.no_space(obj.args.name).replace(/.gifv/g, `.gif`)
  }
  else {
    obj.args.name = `no_name`
  }

  let slice = App.get_upload_slice(obj, 0, App.config.upload_slice_size)

  App.files[now] = obj
  obj.next = App.get_file_next(obj)

  if (obj.next >= 100) {
    obj.sending_last_slice = true
  }
  else {
    obj.sending_last_slice = false
  }

  obj.percentage = 0
  let icon = ``

  if (args.action === `image_upload`) {
    icon = `image`
  }
  else if (args.action === `tv_upload`) {
    icon = `tv`
  }

  let notif = {
    message: `Uploading ${App.get_file_action_name(obj.args.action)}: 0%`,
    icon,
    id: `uploading_${now}`,
    title: `Size: ${App.utilz.size_string(obj.args.size / 1024)}`,
    on_x_button_click: () => {
      App.cancel_file_upload(now)
    },
  }

  obj.popup = App.show_action_popup(notif)
  App.slice_upload_emit(obj, slice)
}

// Do a slice upload emit
App.slice_upload_emit = (obj, slice) => {
  let args = {...obj.args}
  args.data = slice
  App.socket_emit(`slice_upload`, args)
}

// Cancels a file upload
// Deletes the local file and sends a signal to the server to try to cancel it on time
App.cancel_file_upload = (date) => {
  let obj = App.files[date]

  if (!obj) {
    return
  }

  if (obj.sending_last_slice) {
    return
  }

  App.change_upload_status(obj, `Cancelled`, true)

  if (obj.args.action === `background_upload`) {
    DOM.el(`#admin_background`).src = App.background
    App.apply_background()
  }
  else if (obj.args.action === `profilepic_upload`) {
    DOM.el(`#user_profile_profilepic`).src = App.get_profilepic(App.user_id)
  }

  delete App.files[date]
  App.socket_emit(`cancel_upload`, {date})
}

// Gets the percentage based on the next file slice to be uploaded
// Last slice would be 100
App.get_file_next = (obj) => {
  let next = Math.floor(
    ((obj.current_slice * App.config.upload_slice_size) / obj.args.size) * 100,
  )

  if (next > 100) {
    next = 100
  }

  return next
}

// Updates the upload status announcement based on upload progress
App.change_upload_status = (obj, status, clear = false) => {
  if (!obj.popup || !obj.popup.content) {
    return
  }

  DOM.el(`.action_popup_message`, obj.popup.content).textContent =
    `Uploading ${App.get_file_action_name(obj.args.action)}: ${status}`

  if (clear) {
    obj.popup.close()
  }
}

// Gets proper names for file upload types
App.get_file_action_name = (action) => {
  let s = ``

  if (action === `image_upload`) {
    s = `image`
  }
  else if (action === `profilepic_upload`) {
    s = `profile image`
  }
  else if (action === `background_upload`) {
    s = `background image`
  }
  else if (action === `audioclip_upload`) {
    s = `audio clip`
  }

  return s
}

// This is called whenever the server asks for the next slice of a file upload
App.request_slice_upload = (data) => {
  let obj = App.files[data.date]

  if (!obj) {
    return
  }

  obj.current_slice = data.current_slice
  let slice_size = App.config.upload_slice_size
  let place = obj.current_slice * slice_size
  let slice_end = place + Math.min(slice_size, obj.args.size - place)
  let slice = App.get_upload_slice(obj, place, slice_end)
  obj.next = App.get_file_next(obj)

  if (obj.next >= 100) {
    obj.sending_last_slice = true
  }

  obj.percentage = Math.floor(((slice_size * data.current_slice) / obj.args.size) * 100)
  App.change_upload_status(obj, `${obj.percentage}%`)
  App.slice_upload_emit(obj, slice)
}

// What to do when a file upload finishes
App.upload_ended = (data) => {
  let obj = App.files[data.date]

  if (obj) {
    App.change_upload_status(obj, `100%`, true)
    delete App.files[data.date]
  }
}

// Shows an error message on file upload failure
App.show_upload_error = () => {
  App.checkmsg(`The file could not be uploaded`)
}

// Get the next slice of a file upload
App.get_upload_slice = (obj, start, end) => {
  return obj.file.slice(start, end)
}