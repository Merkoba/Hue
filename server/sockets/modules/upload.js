module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Receives sliced files uploads and requests more slices
  // Sends uploaded files to respective functions
  handler.public.slice_upload = async function (socket, data) {
    if (!data || !data.data || data.data.length > config.upload_slice_size) {
      await handler.add_spam(socket)
      return false
    }

    let key = `${socket.hue_user_id}_${data.date}`
    let file = vars.files[key]

    if (!file) {
      let spam_ans = await handler.add_spam(socket)

      if (!spam_ans) {
        return false
      }

      let ext = data.name.split(".").pop(-1).toLowerCase()

      if (data.action.includes("image")) {
        if (data.action === "profilepic_upload") {
          if (ext !== "png") {
            return false
          }
        } else {
          if (!utilz.image_extensions.includes(ext)) {
            return false
          }
        }
      } else if (data.action === "tv_upload") {
        if (!utilz.video_extensions.includes(ext) && !utilz.audio_extensions.includes(ext)) {
          return false
        }
      } else if (data.action === "audioclip_upload") {
        if (ext !== "mp3") {
          return false
        }
      }

      if (data.name.length > config.safe_limit_1) {
        return false
      }

      if (data.comment) {
        if (data.comment.length > config.safe_limit_4) {
          return false
        }
      }

      data.extension = ext
      vars.files[key] = Object.assign({}, vars.files_struct, data)
      file = vars.files[key]
      file.data = []
      file.spam_charge = 0
    }

    if (file.cancelled) {
      delete vars.files[key]
      return false
    }

    data.data = Buffer.from(new Uint8Array(data.data))
    file.data.push(data.data)
    file.slice++
    file.received += data.data.length
    file.spam_charge += data.data.length

    let fsize = file.received / 1024

    if (
      file.action === "image_upload" ||
      file.action === "background_upload"
    ) {
      if (fsize > config.max_image_size) {
        delete vars.files[key]
        return false
      }
    } else if (file.action === "audioclip_upload") {
      if (fsize > config.max_audioclip_size) {
        delete vars.files[key]
        return false
      }
    } else if (file.action === "tv_upload") {
      if (fsize > config.max_tv_size) {
        delete vars.files[key]
        return false
      }
    }

    if (file.spam_charge > sconfig.upload_spam_charge) {
      file.spam_charge = 0
      let spam_ans = await handler.add_spam(socket)

      if (!spam_ans) {
        return false
      }
    }

    file.updated = Date.now()

    if (file.slice * config.upload_slice_size >= file.size) {
      handler.user_emit(socket, "upload_ended", { date: data.date })

      let full_file = Buffer.concat(file.data)

      if (data.action === "image_upload") {
        handler.upload_media(socket, {
          file: full_file,
          file_name: file.name,
          extension: file.extension,
          comment: file.comment,
        }, "image")
      } else if (data.action === "tv_upload") {
        handler.upload_media(socket, {
          file: full_file,
          file_name: file.name,
          extension: file.extension,
          comment: file.comment,
        }, "tv")
      } else if (data.action === "profilepic_upload") {
        handler.upload_profilepic(socket, {
          image_file: full_file,
        })
      } else if (data.action === "background_upload") {
        handler.upload_background(socket, {
          image_file: full_file,
          extension: file.extension,
        })
      } else if (data.action === "audioclip_upload") {
        handler.upload_audioclip(socket, {
          audio_file: full_file,
          extension: file.extension,
        })
      }

      delete vars.files[key]
    } else {
      handler.user_emit(socket, "request_slice_upload", {
        current_slice: file.slice,
        date: data.date,
      })
    }
  }

  // Flags a file as cancelled
  handler.public.cancel_upload = function (socket, data) {
    let key = `${socket.hue_user_id}_${data.date}`
    let file = vars.files[key]

    if (file) {
      file.cancelled = true
    }
  }
}
