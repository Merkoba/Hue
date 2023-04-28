module.exports = (Hue) => {
  // Changes usernames
  Hue.handler.public.change_username = async (socket, data) => {
    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > Hue.config.max_username_length) {
      return
    }

    if (Hue.utilz.clean_username(data.username) !== data.username) {
      return
    }

    let old_username = socket.hue_username

    if (old_username === data.username) {
      return
    }

    let ans = await Hue.db_manager.change_username(socket.hue_user_id, old_username, data.username)

    if (!ans) {
      Hue.handler.user_emit(socket, `username_already_exists`, {
        username: data.username
      })

      return
    }

    await Hue.handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_username: data.username },
      {
        method: `new_username`,
        data: {
          user_id: socket.hue_user_id,
          username: data.username,
          old_username: old_username
        }
      }
    )
  }

  // Changes passwords
  Hue.handler.public.change_password = (socket, data) => {
    if (data.password === undefined) {
      return
    }

    if (
      data.password.length === 0 ||
      data.password.length < Hue.config.min_password_length
    ) {
      return
    }

    if (data.password.length > Hue.config.max_password_length) {
      return
    }

    Hue.db_manager.change_user_password(socket.hue_user_id, data.password)

    .then(ans => {
      Hue.handler.user_emit(socket, `password_changed`, {})
    })

    .catch(err => {
      Hue.logger.log_error(err)
    })
  }

  // Handles bio changes
  Hue.handler.public.change_bio = async (socket, data) => {
    if (data.bio.length > Hue.config.max_bio_length) {
      return
    }

    if (data.bio.split(`\n`).length > Hue.config.max_bio_lines) {
      return
    }

    if (data.bio !== Hue.utilz.single_linebreak(data.bio)) {
      return
    }

    if (socket.hue_bio === data.bio) {
      return
    }

    await Hue.handler.modify_socket_properties(socket.hue_user_id, { hue_bio: data.bio })

    let userinfo = await Hue.db_manager.get_user([`id`, socket.hue_user_id])
    userinfo.bio = socket.hue_bio

    Hue.handler.room_emit(socket, `bio_changed`, {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      bio: socket.hue_bio
    })
  }

  // Handles uploaded profile images
  Hue.handler.upload_profilepic = async (socket, data) => {
    if (data.image_file === undefined) {
      return
    }

    let dimensions = Hue.vars.image_dimensions(data.image_file)

    if (
      dimensions.width !== Hue.config.profilepic_diameter ||
      dimensions.height !== Hue.config.profilepic_diameter
    ) {
      return
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > Hue.config.max_profilepic_size) {
      Hue.handler.user_emit(socket, `upload_error`, {})
      return
    }

    let file_name = `profilepic.png`
    let container = Hue.vars.path.join(Hue.vars.media_root, `user`, socket.hue_user_id)

    if (!Hue.vars.fs.existsSync(container)) {
      Hue.vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = Hue.vars.path.join(container, file_name)

    try {
      await Hue.vars.fsp.writeFile(path, data.image_file)
      await Hue.handler.do_change_profilepic(socket, file_name)
    }
    catch (err) {
      Hue.logger.log_error(err)
      Hue.handler.user_emit(socket, `upload_error`, {})
    }
  }

  // Completes profile image changes
  Hue.handler.do_change_profilepic = async (socket, file_name) => {
    let new_ver = (socket.hue_profilepic_version || 0) + 1
    let userinfo = await Hue.db_manager.get_user([`id`, socket.hue_user_id])
    userinfo.profilepic_version = new_ver

    await Hue.handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_profilepic_version: new_ver },
      {
        method: `profilepic_changed`,
        data: {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          profilepic_version: new_ver
        }
      }
    )
  }

  // Handles uploaded audio clips
  Hue.handler.upload_audioclip = async (socket, data) => {
    if (data.audio_file === undefined) {
      return
    }

    let size = data.audio_file.byteLength / 1024

    if (size === 0 || size > Hue.config.max_audioclip_size) {
      Hue.handler.user_emit(socket, `upload_error`, {})
      return
    }

    let file_name = `audioclip.mp3`
    let container = Hue.vars.path.join(Hue.vars.media_root, `user`, socket.hue_user_id)

    if (!Hue.vars.fs.existsSync(container)) {
      Hue.vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = Hue.vars.path.join(container, file_name)

    try {
      await Hue.vars.fsp.writeFile(path, data.audio_file)
      await Hue.handler.do_change_audioclip(socket, file_name)
    }
    catch (err) {
      Hue.logger.log_error(err)
      Hue.handler.user_emit(socket, `upload_error`, {})
    }
  }

  // Remove the audio clip
  Hue.handler.public.remove_audioclip = (socket, data) => {
    let file_name = `audioclip.mp3`
    let container = Hue.vars.path.join(Hue.vars.media_root, `user`, socket.hue_user_id)
    let path = Hue.vars.path.join(container, file_name)

    if (Hue.vars.fs.existsSync(path)) {
      Hue.vars.fs.unlink(path, (err) => {
        if (err) {
          Hue.logger.log_error(err)
        }
      })
    }
  }

  // Completes audio clip changes
  Hue.handler.do_change_audioclip = async (socket, file_name) => {
    let new_ver = (socket.hue_audioclip_version || 0) + 1
    let userinfo = await Hue.db_manager.get_user([`id`, socket.hue_user_id])
    userinfo.audioclip_version = new_ver

    await Hue.handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_audioclip_version: new_ver },
      {
        method: `audioclip_changed`,
        data: {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          audioclip_version: new_ver
        }
      }
    )
  }
}