module.exports = (App) => {
  // Receives sliced files uploads and requests more slices
  // Sends uploaded files to respective functions
  App.handler.public.slice_upload = async (socket, data) => {
    if (!data || !data.data || data.data.length > App.config.upload_slice_size) {
      await App.handler.add_spam(socket)
      return
    }

    let key = `${socket.hue_user_id}_${data.date}`
    let file = App.vars.files[key]

    if (!file) {
      let spam_ans = await App.handler.add_spam(socket)

      if (!spam_ans) {
        return
      }

      let ext = data.name.split(`.`).pop(-1).toLowerCase()

      if (data.action.includes(`image`)) {
        if (data.action === `profilepic_upload`) {
          if (ext !== `png`) {
            return
          }
        }
        else {
          if (!App.utilz.image_extensions.includes(ext)) {
            return
          }
        }
      }
      else if (data.action === `tv_upload`) {
        if (!App.utilz.video_extensions.includes(ext) && !App.utilz.audio_extensions.includes(ext)) {
          return
        }
      }
      else if (data.action === `audioclip_upload`) {
        if (ext !== `mp3`) {
          return
        }
      }

      if (data.name.length > App.config.safe_limit_1) {
        return
      }

      if (data.comment) {
        if (data.comment.length > App.config.safe_limit_4) {
          return
        }
      }

      data.extension = ext
      App.vars.files[key] = Object.assign({}, App.vars.files_struct, data)
      file = App.vars.files[key]
      file.data = []
      file.spam_charge = 0
    }

    if (file.cancelled) {
      delete App.vars.files[key]
      return
    }

    data.data = Buffer.from(new Uint8Array(data.data))
    file.data.push(data.data)
    file.slice++
    file.received += data.data.length
    file.spam_charge += data.data.length

    let fsize = file.received / 1024

    if (
      file.action === `image_upload` ||
      file.action === `background_upload`
    ) {
      if (fsize > App.config.max_image_size) {
        delete App.vars.files[key]
        return
      }
    }
    else if (file.action === `audioclip_upload`) {
      if (fsize > App.config.max_audioclip_size) {
        delete App.vars.files[key]
        return
      }
    }
    else if (file.action === `tv_upload`) {
      if (fsize > App.config.max_tv_size) {
        delete App.vars.files[key]
        return
      }
    }

    if (file.spam_charge > App.sconfig.upload_spam_charge) {
      let rounds = parseInt(file.spam_charge / App.sconfig.upload_spam_charge)
      let spam_ans = await App.handler.add_spam(socket, rounds)

      if (!spam_ans) {
        return
      }

      file.spam_charge = 0
    }

    file.updated = Date.now()

    if (file.slice * App.config.upload_slice_size >= file.size) {
      App.handler.user_emit(socket, `upload_ended`, { date: data.date })

      let full_file = Buffer.concat(file.data)

      try {
        if (data.action === `image_upload`) {
          await App.handler.upload_media(socket, {
            file: full_file,
            file_name: file.name,
            extension: file.extension,
            comment: file.comment,
          }, `image`)
        }
        else if (data.action === `tv_upload`) {
          await App.handler.upload_media(socket, {
            file: full_file,
            file_name: file.name,
            extension: file.extension,
            comment: file.comment,
          }, `tv`)
        }
        else if (data.action === `profilepic_upload`) {
          await App.handler.upload_profilepic(socket, {
            image_file: full_file,
          })
        }
        else if (data.action === `background_upload`) {
          await App.handler.upload_background(socket, {
            image_file: full_file,
            extension: file.extension,
          })
        }
        else if (data.action === `audioclip_upload`) {
          await App.handler.upload_audioclip(socket, {
            audio_file: full_file,
            extension: file.extension,
          })
        }
      }
      catch (err) {
        delete App.vars.files[key]
        App.logger.log_error(err)
        return
      }

      delete App.vars.files[key]
    }
    else {
      App.handler.user_emit(socket, `request_slice_upload`, {
        current_slice: file.slice,
        date: data.date,
      })
    }
  }

  // Flags a file as cancelled
  App.handler.public.cancel_upload = (socket, data) => {
    let key = `${socket.hue_user_id}_${data.date}`
    let file = App.vars.files[key]

    if (file) {
      file.cancelled = true
    }
  }
}