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
  // Changes usernames
  handler.public.change_username = async function (socket, data) {
    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (data.username.length > config.max_username_length) {
      return false
    }

    if (utilz.clean_username(data.username) !== data.username) {
      return false
    }

    let old_username = socket.hue_username
    
    let done = await db_manager.change_username(
      socket.hue_user_id,
      data.username
    )

    if (done) {
      await handler.modify_socket_properties(
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
      handler.user_emit(socket, "username_already_exists", {
        username: data.username
      })
    }
  }

  // Changes passwords
  handler.public.change_password = function (socket, data) {
    if (data.password === undefined) {
      return false
    }

    if (
      data.password.length === 0 ||
      data.password.length < config.min_password_length
    ) {
      return false
    }

    if (data.password.length > config.max_password_length) {
      return false
    }

    db_manager.change_user_password(socket.hue_user_id, data.password)

    .then(ans => {
      handler.user_emit(socket, "password_changed", {})
    })

    .catch(err => {
      logger.log_error(err)
    })
  }

  // Handles bio changes
  handler.public.change_bio = async function (socket, data) {
    if (data.bio.length > config.max_bio_length) {
      return false
    }

    if (data.bio.split("\n").length > config.max_bio_lines) {
      return false
    }

    if (data.bio !== utilz.clean_string12(data.bio)) {
      return false
    }

    if (socket.hue_bio === data.bio) {
      return false
    }

    await handler.modify_socket_properties(socket.hue_user_id, { hue_bio: data.bio })

    db_manager.update_user(socket.hue_user_id, {
      bio: socket.hue_bio,
    })

    handler.room_emit(socket, "bio_changed", {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      bio: socket.hue_bio
    })
  }

  // Handles uploaded profile images
  handler.upload_profilepic = async function (socket, data) {
    if (data.image_file === undefined) {
      return false
    }

    let dimensions = vars.image_dimensions(data.image_file)

    if (
      dimensions.width !== config.profilepic_diameter ||
      dimensions.height !== config.profilepic_diameter
    ) {
      return false
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > config.max_profilepic_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = "profilepic.png"
    let container = vars.path.join(vars.media_root, "user", socket.hue_user_id)

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container, { recursive: true })
    }    

    let path = vars.path.join(container, file_name) 
    
    try {
      await vars.fsp.writeFile(path, data.image_file)
      handler.do_change_profilepic(socket, file_name)
    } catch (err) {
      logger.log_error(err)
      handler.user_emit(socket, "upload_error", {})
    }
  }

  // Completes profile image changes
  handler.do_change_profilepic = async function (socket, file_name) {
    let new_ver = (socket.hue_profilepic_version || 0) + 1

    db_manager.update_user(socket.hue_user_id, {
      profilepic_version: new_ver
    })

    await handler.modify_socket_properties(
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
  handler.upload_audioclip = async function (socket, data) {
    if (data.audio_file === undefined) {
      return false
    }

    let size = data.audio_file.byteLength / 1024

    if (size === 0 || size > config.max_audioclip_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = "audioclip.mp3"
    let container = vars.path.join(vars.media_root, "user", socket.hue_user_id)

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container, { recursive: true })
    }

    let path = vars.path.join(container, file_name) 
    
    try {
      await vars.fsp.writeFile(path, data.audio_file)
      handler.do_change_audioclip(socket, file_name)
    } catch (err) {
      logger.log_error(err)
      handler.user_emit(socket, "upload_error", {})
    }
  }

  // Remove the audio clip
  handler.public.remove_audioclip = function (socket, data) {
    let file_name = "audioclip.mp3"
    let container = vars.path.join(vars.media_root, "user", socket.hue_user_id)
    let path = vars.path.join(container, file_name)
    
    if (vars.fs.existsSync(path)) {
      vars.fs.unlink(path, function (err) {
        if (err) {
          logger.log_error(err)
        }
      })
    }
  }

  // Completes audio clip changes
  handler.do_change_audioclip = async function (socket, file_name) {
    let new_ver = (socket.hue_audioclip_version || 0) + 1

    db_manager.update_user(socket.hue_user_id, {
      audioclip_version: new_ver
    })

    await handler.modify_socket_properties(
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
