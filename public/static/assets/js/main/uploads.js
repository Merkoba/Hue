// Starts Dropzone events for file drag and drop events
// This also handles normal uploads by clicking the Upload button
Hue.start_dropzone = function () {
  let types = []
  types = types.concat(Hue.utilz.image_types)
  types = types.concat(Hue.utilz.video_types)
  types = types.concat(Hue.utilz.audio_types)
  
  Hue.dropzone = new Dropzone("body", {
    url: "/",
    maxFiles: 1,
    maxFilesize: Hue.config.max_image_size / 1024,
    autoProcessQueue: false,
    clickable: "#image_picker_upload, #image_upload_comment_change, #tv_picker_upload, #tv_upload_comment_change",
    acceptedFiles: types.join(",")
  })
  
  Hue.dropzone.on("addedfile", function (file) {
    let is_image = Hue.utilz.is_image(file.name)
    let is_video = Hue.utilz.is_video(file.name)
    let is_audio = Hue.utilz.is_audio(file.name)
    
    if (is_image) {
      Hue.upload_image(file)
    } else if (is_video || is_audio) {
      Hue.upload_video(file)
    } else {
      Hue.checkmsg("Invalid format")
      Hue.dropzone.files = []
    }
  })

  Hue.dropzone.on("maxfilesexceeded", function(file) {
    Hue.dropzone.removeFile(file)
  })  
}

// Handle generic image upload
Hue.upload_image = function (file) {
  if (Hue.msg_room_menu.is_open()) {
    Hue.background_selected(file)
    return
  } else if (Hue.msg_user_menu.is_open()) {
    Hue.profilepic_selected(file)
    return
  }

  Hue.focus_input()

  if (Hue.dropzone.files.length > 1) {
    Hue.dropzone.files = []
    return false
  }

  let size = file.size / 1024

  if (size > Hue.config.max_image_size) {
    Hue.dropzone.files = []
    Hue.checkmsg("File is too big")
    return false
  }

  if (!Hue.utilz.is_image(file.name)) {
    Hue.dropzone.files = []
    return false
  }

  Hue.dropzone.files = []
  Hue.show_image_upload_comment(file, "image_upload")
}

// Handle generic video upload
Hue.upload_video = function (file) {
  Hue.focus_input()

  if (Hue.dropzone.files.length > 1) {
    Hue.dropzone.files = []
    return false
  }

  let size = file.size / 1024

  if (size > Hue.config.max_tv_size) {
    Hue.dropzone.files = []
    Hue.checkmsg("File is too big")
    return false
  }

  let is_video = Hue.utilz.is_video(file.name)
  let is_audio = Hue.utilz.is_audio(file.name)

  if (!is_video && !is_audio) {
    Hue.dropzone.files = []
    return false
  }

  Hue.dropzone.files = []
  Hue.show_tv_upload_comment(file, "tv_upload")
}

// Creates a file reader for files
Hue.create_file_reader = function (file) {
  let reader = new FileReader()

  reader.addEventListener("loadend", function (e) {
    Hue.socket_emit("slice_upload", {
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
Hue.upload_file = function (args = {}) {
  let def_args = {
    file: false,
    action: false,
    name: false,
    comment: false,
  }

  args = Object.assign(def_args, args)

  if (!args.file || !args.action) {
    return false
  }

  if (args.file.hue_data === undefined) {
    args.file.hue_data = {}
  }

  args.file.hue_data.action = args.action

  if (args.name) {
    args.file.hue_data.name = args.name
  } else {
    args.file.hue_data.name = args.file.name
  }

  if (args.comment) {
    args.file.hue_data.comment = args.comment
  }

  if (args.file.hue_data.action === "background_upload") {
    for (let d in Hue.files) {
      let f = Hue.files[d]

      if (f.hue_data.action === "background_upload") {
        Hue.cancel_file_upload(d, false)
      }
    }
  }

  args.file.hue_data.size = args.file.size
  args.file.hue_data.type = args.file.type

  let date = Date.now()

  args.file.hue_data.date = date

  if (args.file.hue_data.name !== undefined) {
    args.file.hue_data.name = Hue.utilz
      .no_space(args.file.hue_data.name)
      .replace(/.gifv/g, ".gif")
  } else {
    args.file.hue_data.name = "no_name"
  }

  args.file.hue_data.reader = Hue.create_file_reader(args.file)

  let slice = args.file.slice(0, Hue.config.upload_slice_size)

  Hue.files[date] = args.file
  args.file.hue_data.next = Hue.get_file_next(args.file)

  if (args.file.hue_data.next >= 100) {
    args.file.hue_data.sending_last_slice = true
  } else {
    args.file.hue_data.sending_last_slice = false
  }

  args.file.hue_data.percentage = 0

  let obj = {
    message: `Uploading ${Hue.get_file_action_name(
      args.file.hue_data.action
    )}: 0%`,
    icon: "image",
    id: `uploading_${date}`,
    title: `Size: ${Hue.utilz.get_size_string(args.file.hue_data.size / 1024)}`,
    autoclose: false
  }

  if (!args.file.hue_data.sending_last_slice) {
    obj.after_close = function () {
      Hue.cancel_file_upload(date)
    }
  }

  args.file.hue_popup = Hue.show_action_popup(obj)
  args.file.hue_data.reader.readAsArrayBuffer(slice)
}

// Cancels a file upload
// Deletes the local file and sends a signal to the server to try to cancel it on time
Hue.cancel_file_upload = function (date, check = true) {
  let file = Hue.files[date]

  if (!file) {
    return false
  }

  if (file.hue_data.sending_last_slice) {
    return false
  }

  Hue.change_upload_status(file, "Cancelled", true)

  if (check) {
    if (file.hue_data.action === "background_upload") {
      Hue.config_admin_background()
    }
  }

  delete Hue.files[date]

  Hue.socket_emit("cancel_upload", { date: date })
}

// Gets the percentage based on the next file slice to be uploaded
// Last slice would be 100
Hue.get_file_next = function (file) {
  let next = Math.floor(
    ((Hue.config.upload_slice_size * 1) / file.hue_data.size) * 100
  )

  if (next > 100) {
    next = 100
  }

  return next
}

// Updates the upload status announcement based on upload progress
Hue.change_upload_status = function (file, status, clear = false) {
  if (!file.hue_popup || !file.hue_popup.content) {
    return false
  }

  Hue.el(".action_popup_message", file.hue_popup.content).textContent =
    `Uploading ${Hue.get_file_action_name(file.hue_data.action)}: ${status}`

  if (clear) {
    file.hue_popup.close()
  }
}

// Gets proper names for file upload types
Hue.get_file_action_name = function (action) {
  let s = ""

  if (action === "image_upload") {
    s = "image"
  } else if (action === "profilepic_upload") {
    s = "profile image"
  } else if (action === "background_upload") {
    s = "background image"
  } else if (action === "audioclip_upload") {
    s = "audio clip"
  }

  return s
}

// This is called whenever the server asks for the next slice of a file upload
Hue.request_slice_upload = function (data) {
  let file = Hue.files[data.date]

  if (!file) {
    return false
  }

  let place = data.current_slice * Hue.config.upload_slice_size
  let slice = file.slice(
    place,
    place + Math.min(Hue.config.upload_slice_size, file.hue_data.size - place)
  )

  file.hue_data.next = Hue.get_file_next(file)

  if (file.hue_data.next >= 100) {
    file.hue_data.sending_last_slice = true
  }

  file.hue_data.percentage = Math.floor(
    ((Hue.config.upload_slice_size * data.current_slice) / file.hue_data.size) *
      100
  )
  file.hue_data.reader.readAsArrayBuffer(slice)

  Hue.change_upload_status(file, `${file.hue_data.percentage}%`)
}

// What to do when a file upload finishes
Hue.upload_ended = function (data) {
  let file = Hue.files[data.date]

  if (file) {
    Hue.change_upload_status(file, "100%", true)
    delete Hue.files[data.date]
  }
}

// Shows an error message on file upload failure
Hue.show_upload_error = function () {
  Hue.checkmsg("The file could not be uploaded")
}
