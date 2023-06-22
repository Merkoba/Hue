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
    clickable: `#dropzone_element`
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
  else {
    if (is_image) {
      App.upload_image(file)
    }
    else if (is_video || is_audio) {
      App.upload_video(file)
    }
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

// Creates a file reader for files
App.create_file_reader = (file) => {
  let reader = new FileReader()

  DOM.ev(reader, `loadend`, (e) => {
    App.socket_emit(`slice_upload`, {
      data: reader.result,
      action: file.hue_data.action,
      name: file.hue_data.name,
      type: file.hue_data.type,
      size: file.hue_data.size,
      date: file.hue_data.date,
      comment: file.hue_data.comment,
    })
  })

  return reader
}

// Handles file uploads of different kinds
// Sets all required data
// Creates a file reader
// Starts a sliced upload
App.upload_file = (args = {}) => {
  if (!args.file || !args.action) {
    return
  }

  if (args.file.hue_data === undefined) {
    args.file.hue_data = {}
  }

  args.file.hue_data.action = args.action

  if (args.name) {
    args.file.hue_data.name = args.name
  }
  else {
    args.file.hue_data.name = args.file.name
  }

  if (args.comment) {
    args.file.hue_data.comment = args.comment
  }

  args.file.hue_data.size = args.file.size
  args.file.hue_data.type = args.file.type
  let date = Date.now()
  args.file.hue_data.date = date

  if (args.file.hue_data.name !== undefined) {
    args.file.hue_data.name = App.utilz
      .no_space(args.file.hue_data.name)
      .replace(/.gifv/g, `.gif`)
  }
  else {
    args.file.hue_data.name = `no_name`
  }

  args.file.hue_data.reader = App.create_file_reader(args.file)
  let slice = args.file.slice(0, App.config.upload_slice_size)

  App.files[date] = args.file
  args.file.hue_data.next = App.get_file_next(args.file)

  if (args.file.hue_data.next >= 100) {
    args.file.hue_data.sending_last_slice = true
  }
  else {
    args.file.hue_data.sending_last_slice = false
  }

  args.file.hue_data.percentage = 0
  let icon = ``

  if (args.action === `image_upload`) {
    icon = `image`
  }
  else if (args.action === `tv_upload`) {
    icon = `tv`
  }

  let obj = {
    message: `Uploading ${App.get_file_action_name(
      args.file.hue_data.action
    )}: 0%`,
    icon: icon,
    id: `uploading_${date}`,
    title: `Size: ${App.utilz.size_string(args.file.hue_data.size / 1024)}`,
    on_x_button_click: () => {
      App.cancel_file_upload(date)
    }
  }

  args.file.hue_popup = App.show_action_popup(obj)
  args.file.hue_data.reader.readAsArrayBuffer(slice)
}

// Cancels a file upload
// Deletes the local file and sends a signal to the server to try to cancel it on time
App.cancel_file_upload = (date) => {
  let file = App.files[date]

  if (!file) {
    return
  }

  if (file.hue_data.sending_last_slice) {
    return
  }

  App.change_upload_status(file, `Cancelled`, true)

  if (file.hue_data.action === `background_upload`) {
    DOM.el(`#admin_background`).src = App.background
    App.apply_background()
  }
  else if (file.hue_data.action === `profilepic_upload`) {
    DOM.el(`#user_profile_profilepic`).src = App.get_profilepic(App.user_id)
  }

  delete App.files[date]
  App.socket_emit(`cancel_upload`, { date: date })
}

// Gets the percentage based on the next file slice to be uploaded
// Last slice would be 100
App.get_file_next = (file) => {
  let next = Math.floor(
    ((App.config.upload_slice_size * 1) / file.hue_data.size) * 100
  )

  if (next > 100) {
    next = 100
  }

  return next
}

// Updates the upload status announcement based on upload progress
App.change_upload_status = (file, status, clear = false) => {
  if (!file.hue_popup || !file.hue_popup.content) {
    return
  }

  DOM.el(`.action_popup_message`, file.hue_popup.content).textContent =
    `Uploading ${App.get_file_action_name(file.hue_data.action)}: ${status}`

  if (clear) {
    file.hue_popup.close()
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
  let file = App.files[data.date]

  if (!file) {
    return
  }

  let place = data.current_slice * App.config.upload_slice_size
  let slice = file.slice(
    place,
    place + Math.min(App.config.upload_slice_size, file.hue_data.size - place)
  )

  file.hue_data.next = App.get_file_next(file)

  if (file.hue_data.next >= 100) {
    file.hue_data.sending_last_slice = true
  }

  file.hue_data.percentage = Math.floor(
    ((App.config.upload_slice_size * data.current_slice) / file.hue_data.size) *
      100
  )

  file.hue_data.reader.readAsArrayBuffer(slice)
  App.change_upload_status(file, `${file.hue_data.percentage}%`)
}

// What to do when a file upload finishes
App.upload_ended = (data) => {
  let file = App.files[data.date]

  if (file) {
    App.change_upload_status(file, `100%`, true)
    delete App.files[data.date]
  }
}

// Shows an error message on file upload failure
App.show_upload_error = () => {
  App.checkmsg(`The file could not be uploaded`)
}