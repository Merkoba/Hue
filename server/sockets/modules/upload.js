module.exports = (App) => {
  // Receives sliced files uploads and requests more slices
  // Sends uploaded files to respective functions
  App.handler.public.slice_upload = async (socket, data) => {
    if (!App.handler.check_limited(socket)) {
      await App.handler.add_spam(socket, App.vars.limited_spam)
      return
    }

    if (!data || !data.data || (data.data.length > App.config.upload_slice_size)) {
      await App.handler.add_spam(socket)
      return
    }

    if (!data.name || !data.action || !data.date) {
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
        else if (!App.utilz.is_image(data.name)) {
          return
        }
      }
      else if (data.action === `tv_upload`) {
        if (!App.utilz.is_video(data.name) && !App.utilz.is_audio(data.name)) {
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
      App.vars.files[key] = {...App.vars.files_struct, ...data}
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
      App.handler.user_emit(socket, `upload_ended`, {date: data.date})
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

  // Download media
  App.handler.download_media = async (socket, args = {}) => {
    let max_size = 1024 * 1024 * args.max_size

    let head_res = await App.vars.fetch(args.src, {
      method: `HEAD`,
      size: max_size,
    })

    if (!head_res.ok) {
      App.logger.log_error(`Failed to fetch media headers: ${head_res.statusText}`)
      return
    }

    let content_length = head_res.headers.get(`Content-Length`)

    if (content_length && parseInt(content_length) > max_size) {
      App.logger.log_error(`Media is too large: ${content_length} bytes`)
      return
    }

    if (content_length && parseInt(content_length) > max_size) {
      App.logger.log_error(`Media is too large: ${content_length} bytes`)
      return
    }

    let res = await App.vars.fetch(args.src, {
      method: `GET`,
      size: max_size,
    })

    if (!res.ok) {
      App.logger.log_error(`Failed to fetch media: ${res.statusText}`)
      return
    }

    let full_file = Buffer.from(new Uint8Array(await res.arrayBuffer()))
    return full_file
  }

  // Remove all metadata from a file
  App.strip_metadata = async (path) => {
    try {
      return await App.i.exiftool.write(path, {
        all: null,
      })
    }
    catch (err) {
      App.logger.log_error(err)
      return path
    }
  }
}