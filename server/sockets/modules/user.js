module.exports = (App) => {
  // Changes usernames
  App.handler.public.change_username = async (socket, data) => {
    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > App.config.max_username_length) {
      return
    }

    if (App.utilz.clean_username(data.username) !== data.username) {
      return
    }

    let old_username = socket.hue.username

    if (old_username === data.username) {
      return
    }

    let ans = await App.db_manager.change_username(socket.hue.user_id, old_username, data.username)

    if (!ans) {
      App.handler.user_emit(socket, `username_already_exists`, {
        username: data.username,
      })

      return
    }

    await App.handler.modify_socket_properties(
      socket.hue.user_id,
      {username: data.username},
      {
        method: `new_username`,
        data: {
          user_id: socket.hue.user_id,
          username: data.username,
          old_username,
        },
      },
    )
  }

  // Changes passwords
  App.handler.public.change_password = async (socket, data) => {
    if (data.password === undefined) {
      return
    }

    if (
      (data.password.length === 0) ||
      (data.password.length < App.config.min_password_length)
    ) {
      return
    }

    if (data.password.length > App.config.max_password_length) {
      return
    }

    try {
      await App.db_manager.change_user_password(socket.hue.user_id, data.password)
      App.handler.user_emit(socket, `password_changed`, {})
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }

  // Handles bio changes
  App.handler.public.change_bio = async (socket, data) => {
    if (data.bio.length > App.config.max_bio_length) {
      return
    }

    if (data.bio.split(`\n`).length > App.config.max_bio_lines) {
      return
    }

    if (data.bio !== App.utilz.single_linebreak(data.bio)) {
      return
    }

    if (socket.hue.bio === data.bio) {
      return
    }

    await App.handler.modify_socket_properties(socket.hue.user_id, {bio: data.bio})

    let userinfo = await App.db_manager.get_user([`id`, socket.hue.user_id])
    userinfo.bio = socket.hue.bio

    App.handler.room_emit(socket, `bio_changed`, {
      user_id: socket.hue.user_id,
      username: socket.hue.username,
      bio: socket.hue.bio,
    })
  }

  // Handles uploaded profile images
  App.handler.upload_profilepic = async (socket, data) => {
    if (data.image_file === undefined) {
      return
    }

    let dimensions = App.i.image_dimensions(data.image_file)

    if (
      (dimensions.width !== App.config.profilepic_diameter) ||
      (dimensions.height !== App.config.profilepic_diameter)
    ) {
      return
    }

    let size = data.image_file.byteLength / 1024

    if ((size === 0) || (size > App.config.max_profilepic_size)) {
      App.handler.user_emit(socket, `upload_error`, {})
      return
    }

    let file_name = `profilepic.png`
    let container = App.i.path.join(App.vars.media_root, `user`, socket.hue.user_id)

    if (!App.i.fs.existsSync(container)) {
      App.i.fs.mkdirSync(container, {recursive: true})
    }

    let path = App.i.path.join(container, file_name)

    try {
      await App.i.fsp.writeFile(path, data.image_file)
      await App.strip_metadata(path)
      await App.handler.do_change_profilepic(socket, file_name)
    }
    catch (err) {
      App.logger.log_error(err)
      App.handler.user_emit(socket, `upload_error`, {})
    }
  }

  // Completes profile image changes
  App.handler.do_change_profilepic = async (socket, file_name) => {
    let new_ver = (socket.hue.profilepic_version || 0) + 1
    let userinfo = await App.db_manager.get_user([`id`, socket.hue.user_id])
    userinfo.profilepic_version = new_ver

    await App.handler.modify_socket_properties(
      socket.hue.user_id,
      {profilepic_version: new_ver},
      {
        method: `profilepic_changed`,
        data: {
          user_id: socket.hue.user_id,
          username: socket.hue.username,
          profilepic_version: new_ver,
        },
      },
    )
  }

  // Handles uploaded audio clips
  App.handler.upload_audioclip = async (socket, data) => {
    if (data.audio_file === undefined) {
      return
    }

    let size = data.audio_file.byteLength / 1024

    if ((size === 0) || (size > App.config.max_audioclip_size)) {
      App.handler.user_emit(socket, `upload_error`, {})
      return
    }

    let file_name = `audioclip.mp3`
    let container = App.i.path.join(App.vars.media_root, `user`, socket.hue.user_id)

    if (!App.i.fs.existsSync(container)) {
      App.i.fs.mkdirSync(container, {recursive: true})
    }

    let path = App.i.path.join(container, file_name)

    try {
      await App.i.fsp.writeFile(path, data.audio_file)
      await App.strip_metadata(path)
      await App.handler.do_change_audioclip(socket, file_name)
    }
    catch (err) {
      App.logger.log_error(err)
      App.handler.user_emit(socket, `upload_error`, {})
    }
  }

  // Remove the audio clip
  App.handler.public.remove_audioclip = (socket, data) => {
    let file_name = `audioclip.mp3`
    let container = App.i.path.join(App.vars.media_root, `user`, socket.hue.user_id)
    let path = App.i.path.join(container, file_name)

    if (App.i.fs.existsSync(path)) {
      App.i.fs.unlink(path, (err) => {
        if (err) {
          App.logger.log_error(err)
        }
      })
    }
  }

  // Completes audio clip changes
  App.handler.do_change_audioclip = async (socket, file_name) => {
    let new_ver = (socket.hue.audioclip_version || 0) + 1
    let userinfo = await App.db_manager.get_user([`id`, socket.hue.user_id])
    userinfo.audioclip_version = new_ver

    await App.handler.modify_socket_properties(
      socket.hue.user_id,
      {audioclip_version: new_ver},
      {
        method: `audioclip_changed`,
        data: {
          user_id: socket.hue.user_id,
          username: socket.hue.username,
          audioclip_version: new_ver,
        },
      },
    )
  }
}