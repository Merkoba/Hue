// Starts Dropzone events for file drag and drop events
// This also handles normal uploads by clicking the Upload button
App.start_dropzone = () => {
  let types = []
  types = types.concat(App.utilz.image_types)
  types = types.concat(App.utilz.video_types)
  types = types.concat(App.utilz.audio_types)

  App.dropzone = new Dropzone(`body`, {
    url: `/`,
    maxFiles: 1,
    autoProcessQueue: false,
    acceptedFiles: types.join(`,`),
    clickable: `#dropzone_element`,
  })

  App.dropzone.on(`addedfile`, (file) => {
    App.process_file_added_debouncer.call(file)
  })

  App.dropzone.on(`dragenter`, () => {
    App.upload_media = undefined
  })

  App.dropzone.on(`maxfilesexceeded`, (file) => {
    App.dropzone.removeFile(file)
  })
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

  App.dropzone.files = []
}

// Trigger dropzone click
App.trigger_dropzone = () => {
  DOM.el(`#dropzone_element`).click()
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

  let obj = {}
  obj.file = args.file
  obj.args = {}
  obj.args.action = args.action

  if (args.name) {
    obj.args.name = args.name
  }
  else {
    obj.args.name = obj.file.name
  }

  if (args.comment) {
    obj.args.comment = args.comment
  }

  obj.args.size = obj.file.size
  obj.args.type = obj.file.type
  obj.args.date = now

  if (obj.args.name !== undefined) {
    obj.args.name = App.utilz.no_space(obj.args.name).replace(/.gifv/g, `.gif`)
  }
  else {
    obj.args.name = `no_name`
  }

  let slice = App.get_upload_slice(obj.file, 0, App.config.upload_slice_size)

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

  let emit_args = {...obj.args}
  emit_args.data = slice
  App.socket_emit(`slice_upload`, emit_args)
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
    ((App.config.upload_slice_size * 1) / obj.args.size) * 100,
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

  let slice_size = App.config.upload_slice_size
  let place = data.current_slice * slice_size
  let slice_end = place + Math.min(slice_size, obj.args.size - place)
  let slice = App.get_upload_slice(obj.file, place, slice_end)
  obj.next = App.get_file_next(obj)

  if (obj.next >= 100) {
    obj.sending_last_slice = true
  }

  obj.percentage = Math.floor(((slice_size * data.current_slice) / obj.args.size) * 100)
  App.change_upload_status(obj, `${obj.percentage}%`)

  let emit_args = {...obj.args}
  emit_args.data = slice
  App.socket_emit(`slice_upload`, emit_args)
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
App.get_upload_slice = (file, start, end) => {
  let slice = file.slice(start, end)
  return new Blob([slice])
}