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
      handler.modify_socket_properties(
        socket.hue_user_id,
        { hue_username: data.username },
        {
          method: "new_username",
          data: {
            username: data.username,
            old_username: old_username,
          },
        }
      )
    } else {
      handler.user_emit(socket, "username_already_exists", {
        username: data.username,
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

    handler.modify_socket_properties(socket.hue_user_id, { hue_bio: data.bio })

    db_manager.update_user(socket.hue_user_id, {
      bio: socket.hue_bio,
    })

    handler.room_emit(socket, "bio_changed", {
      username: socket.hue_username,
      bio: socket.hue_bio,
    })
  }

  // Handles uploaded profile images
  handler.upload_profile_image = function (socket, data) {
    if (data.image_file === undefined) {
      return false
    }

    let dimensions = vars.image_dimensions(data.image_file)

    if (
      dimensions.width !== config.profile_image_diameter ||
      dimensions.height !== config.profile_image_diameter
    ) {
      return false
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > config.max_profile_image_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = `${socket.hue_user_id}.png`
    let container = vars.path.join(vars.images_root, "profiles")

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container)
    }    

    let path = vars.path.join(container, file_name)    

    vars.fs.writeFile(
      path,
      data.image_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.do_change_profile_image(socket, file_name)
        }
      }
    )
  }

  // Completes profile image changes
  handler.do_change_profile_image = async function (socket, file_name) {
    let userinfo = await db_manager.get_user(
      ["id", socket.hue_user_id],
      { profile_image: 1, profile_image_version: 1 }
    )
    let new_ver = userinfo.profile_image_version + 1
    let imagever = `${file_name}?ver=${new_ver}`

    if (userinfo.profile_image && userinfo.profile_image !== file_name) {
      vars.fs.unlink(
        `${vars.images_root}/${userinfo.profile_image}`,
        function (err) {}
      )
    }

    db_manager.update_user(socket.hue_user_id, {
      profile_image: file_name,
      profile_image_version: new_ver,
    })

    handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_profile_image: file_name },
      {
        method: "profile_image_changed",
        data: {
          user_id: socket.hue_user_id,
          profile_image: imagever,
        },
      }
    )
  }

  // Handles uploaded audio clips
  handler.upload_audio_clip = function (socket, data) {
    if (data.audio_file === undefined) {
      return false
    }

    let size = data.audio_file.byteLength / 1024

    if (size === 0 || size > config.max_audio_clip_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = `${socket.hue_user_id}.${data.extension}`
    let container = vars.audio_root

    if (!vars.fs.existsSync(container)) {
      vars.fs.mkdirSync(container)
    }    

    let path = vars.path.join(container, file_name)     

    vars.fs.writeFile(
      path,
      data.audio_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.do_change_audio_clip(socket, file_name)
        }
      }
    )
  }

  // Remove the audio clip
  handler.public.remove_audio_clip = function (socket, data) {
    handler.do_change_audio_clip(socket, "")
  }

  // Completes audio clip changes
  handler.do_change_audio_clip = async function (socket, file_name) {
    let userinfo = await db_manager.get_user(
      ["id", socket.hue_user_id],
      { audio_clip: 1, audio_clip_version: 1 }
    )
    let new_ver = userinfo.audio_clip_version + 1

    if (userinfo.audio_clip && userinfo.audio_clip !== file_name) {
      vars.fs.unlink(`${vars.audio_root}/${userinfo.audio_clip}`, function (
        err
      ) {})
    } else {
      if (!file_name) {
        return false
      }
    }

    let audio_clip_url = ""
    let audiover = `${file_name}?ver=${new_ver}`

    db_manager.update_user(socket.hue_user_id, {
      audio_clip: file_name,
      audio_clip_version: new_ver,
    })

    handler.modify_socket_properties(
      socket.hue_user_id,
      { hue_audio_clip: file_name },
      {
        method: "audio_clip_changed",
        data: {
          username: socket.hue_username,
          audio_clip: audiover
        },
      }
    )
  }
}
