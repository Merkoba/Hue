module.exports = function (Hue) {
  // Receives sliced files uploads and requests more slices
  // Sends uploaded files to respective functions
  Hue.handler.public.slice_upload = async function (socket, data) {
    if (!data || !data.data || data.data.length > Hue.config.upload_slice_size) {
      await Hue.handler.add_spam(socket)
      return
    }

    let key = `${socket.hue_user_id}_${data.date}`
    let file = Hue.vars.files[key]

    if (!file) {
      let spam_ans = await Hue.handler.add_spam(socket)

      if (!spam_ans) {
        return
      }

      let ext = data.name.split(".").pop(-1).toLowerCase()

      if (data.action.includes("image")) {
        if (data.action === "profilepic_upload") {
          if (ext !== "png") {
            return
          }
        } else {
          if (!Hue.utilz.image_extensions.includes(ext)) {
            return
          }
        }
      } else if (data.action === "tv_upload") {
        if (!Hue.utilz.video_extensions.includes(ext) && !Hue.utilz.audio_extensions.includes(ext)) {
          return
        }
      } else if (data.action === "audioclip_upload") {
        if (ext !== "mp3") {
          return
        }
      }

      if (data.name.length > Hue.config.safe_limit_1) {
        return
      }

      if (data.comment) {
        if (data.comment.length > Hue.config.safe_limit_4) {
          return
        }
      }

      data.extension = ext
      Hue.vars.files[key] = Object.assign({}, Hue.vars.files_struct, data)
      file = Hue.vars.files[key]
      file.data = []
      file.spam_charge = 0
    }

    if (file.cancelled) {
      delete Hue.vars.files[key]
      return
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
      if (fsize > Hue.config.max_image_size) {
        delete Hue.vars.files[key]
        return
      }
    } else if (file.action === "audioclip_upload") {
      if (fsize > Hue.config.max_audioclip_size) {
        delete Hue.vars.files[key]
        return
      }
    } else if (file.action === "tv_upload") {
      if (fsize > Hue.config.max_tv_size) {
        delete Hue.vars.files[key]
        return
      }
    }

    if (file.spam_charge > Hue.sconfig.upload_spam_charge) {
      let rounds = parseInt(file.spam_charge / Hue.sconfig.upload_spam_charge)
      let spam_ans = await Hue.handler.add_spam(socket, rounds)

      if (!spam_ans) {
        return
      }

      file.spam_charge = 0
    }

    file.updated = Date.now()

    if (file.slice * Hue.config.upload_slice_size >= file.size) {
      Hue.handler.user_emit(socket, "upload_ended", { date: data.date })

      let full_file = Buffer.concat(file.data)

      try {
        if (data.action === "image_upload") {
          await Hue.handler.upload_media(socket, {
            file: full_file,
            file_name: file.name,
            extension: file.extension,
            comment: file.comment,
          }, "image")
        } else if (data.action === "tv_upload") {
          await Hue.handler.upload_media(socket, {
            file: full_file,
            file_name: file.name,
            extension: file.extension,
            comment: file.comment,
          }, "tv")
        } else if (data.action === "profilepic_upload") {
          await Hue.handler.upload_profilepic(socket, {
            image_file: full_file,
          })
        } else if (data.action === "background_upload") {
          await Hue.handler.upload_background(socket, {
            image_file: full_file,
            extension: file.extension,
          })
        } else if (data.action === "audioclip_upload") {
          await Hue.handler.upload_audioclip(socket, {
            audio_file: full_file,
            extension: file.extension,
          })
        }
      } catch (err) {
        delete Hue.vars.files[key]
        Hue.logger.log_error(err)
        return
      }

      delete Hue.vars.files[key]
    } else {
      Hue.handler.user_emit(socket, "request_slice_upload", {
        current_slice: file.slice,
        date: data.date,
      })
    }
  }

  // Flags a file as cancelled
  Hue.handler.public.cancel_upload = function (socket, data) {
    let key = `${socket.hue_user_id}_${data.date}`
    let file = Hue.vars.files[key]

    if (file) {
      file.cancelled = true
    }
  }
}