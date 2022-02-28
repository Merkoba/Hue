module.exports = function (Hue) {
  // Changes usernames
  Hue.handler.public.change_username = async function (socket, data) {
    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (data.username.length > Hue.config.max_username_length) {
      return false
    }

    if (Hue.utilz.clean_username(data.username) !== data.username) {
      return false
    }

    let old_username = socket.hue_username
    
    let done = await Hue.db_manager.change_username(
      socket.hue_user_id,
      data.username
    )

    if (done) {
      await Hue.handler.modify_socket_properties(
        socket.hue_user_id,
        { hue_username: data.username },
        {
          method: "new_username",
          data: {
            user_id: socket.hue_user_id,
            username: data.username,
            old_username: old_username
          }
        }
      )
    } else {
      Hue.handler.user_emit(socket, "username_already_exists", {
        username: data.username
      })
    }
  }

  // Changes passwords
  Hue.handler.public.change_password = function (socket, data) {
    if (data.password === undefined) {
      return false
    }

    if (
      data.password.length === 0 ||
      data.password.length < Hue.config.min_password_length
    ) {
      return false
    }

    if (data.password.length > Hue.config.max_password_length) {
      return false
    }

    Hue.db_manager.change_user_password(socket.hue_user_id, data.password)

    .then(ans => {
      Hue.handler.user_emit(socket, "password_changed", {})
    })

    .catch(err => {
      Hue.logger.log_error(err)
    })
  }

  // Handles bio changes
  Hue.handler.public.change_bio = async function (socket, data) {
    if (data.bio.length > Hue.config.max_bio_length) {
      return false
    }

    if (data.bio.split("\n").length > Hue.config.max_bio_lines) {
      return false
    }

    if (data.bio !== Hue.utilz.single_linebreak(data.bio)) {
      return false
    }

    if (socket.hue_bio === data.bio) {
      return false
    }

    await Hue.handler.modify_socket_properties(socket.hue_user_id, { hue_bio: data.bio })

    Hue.db_manager.update_user(socket.hue_user_id, {
      bio: socket.hue_bio,
    })

    Hue.handler.room_emit(socket, "bio_changed", {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      bio: socket.hue_bio
    })
  }

  // Handles uploaded profile images
  Hue.handler.upload_profilepic = async function (socket, data) {
    if (data.image_file === undefined) {
      return false
    }

    let dimensions = Hue.vars.image_dimensions(data.image_file)

    if (
      dimensions.width !== Hue.config.profilepic_diameter ||
      dimensions.height !== Hue.config.profilepic_diameter
    ) {
      return false
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > Hue.config.max_profilepic_size) {
      Hue.handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = "profilepic.png"
    let container = Hue.vars.path.join(Hue.vars.media_root, "user", socket.hue_user_id)

    if (!Hue.vars.fs.existsSync(container)) {
      Hue.vars.fs.mkdirSync(container, { recursive: true })
    }    

    let path = Hue.vars.path.join(container, file_name) 
    
    try {
      await Hue.vars.fsp.writeFile(path, data.image_file)
      Hue.handler.do_change_profilepic(socket, file_name)
    } catch (err) {
      Hue.logger.log_error(err)
      Hue.handler.user_emit(socket, "upload_error", {})
    }
  }

  // Completes profile image changes
  Hue.handler.do_change_profilepic = async function (socket, file_name) {
    let new_ver = (socket.hue_profilepic_version || 0) + 1

    Hue.db_manager.update_user(socket.hue_user_id, {
      profilepic_version: new_ver
    })

    await Hue.handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_profilepic_version: new_ver },
      {
        method: "profilepic_changed",
        data: {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          profilepic_version: new_ver
        }
      }
    )
  }

  // Handles uploaded audio clips
  Hue.handler.upload_audioclip = async function (socket, data) {
    if (data.audio_file === undefined) {
      return false
    }

    let size = data.audio_file.byteLength / 1024

    if (size === 0 || size > Hue.config.max_audioclip_size) {
      Hue.handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = "audioclip.mp3"
    let container = Hue.vars.path.join(Hue.vars.media_root, "user", socket.hue_user_id)

    if (!Hue.vars.fs.existsSync(container)) {
      Hue.vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = Hue.vars.path.join(container, file_name) 
    
    try {
      await Hue.vars.fsp.writeFile(path, data.audio_file)
      Hue.handler.do_change_audioclip(socket, file_name)
    } catch (err) {
      Hue.logger.log_error(err)
      Hue.handler.user_emit(socket, "upload_error", {})
    }
  }

  // Remove the audio clip
  Hue.handler.public.remove_audioclip = function (socket, data) {
    let file_name = "audioclip.mp3"
    let container = Hue.vars.path.join(Hue.vars.media_root, "user", socket.hue_user_id)
    let path = Hue.vars.path.join(container, file_name)
    
    if (Hue.vars.fs.existsSync(path)) {
      Hue.vars.fs.unlink(path, function (err) {
        if (err) {
          Hue.logger.log_error(err)
        }
      })
    }
  }

  // Completes audio clip changes
  Hue.handler.do_change_audioclip = async function (socket, file_name) {
    let new_ver = (socket.hue_audioclip_version || 0) + 1

    Hue.db_manager.update_user(socket.hue_user_id, {
      audioclip_version: new_ver
    })

    await Hue.handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_audioclip_version: new_ver },
      {
        method: "audioclip_changed",
        data: {
          user_id: socket.hue_user_id,
          username: socket.hue_username,
          audioclip_version: new_ver
        }
      }
    )
  }
}
