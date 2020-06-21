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
      return handler.get_out(socket)
    }

    if (data.username.length === 0) {
      return handler.get_out(socket)
    }

    if (data.username.length > config.max_username_length) {
      return handler.get_out(socket)
    }

    if (utilz.clean_string4(data.username) !== data.username) {
      return handler.get_out(socket)
    }

    let old_username = socket.hue_username
    let done = await db_manager.change_username(
      socket.hue_user_id,
      data.username
    )

    if (done) {
      handler.modify_socket_properties(
        socket,
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
      return handler.get_out(socket)
    }

    if (
      data.password.length === 0 ||
      data.password.length < config.min_password_length
    ) {
      return handler.get_out(socket)
    }

    if (data.password.length > config.max_password_length) {
      return handler.get_out(socket)
    }

    db_manager.update_user(socket.hue_user_id, {
      password: data.password,
      password_date: Date.now(),
    })

    handler.user_emit(socket, "password_changed", { password: data.password })
  }

  // Changes emails
  handler.public.change_email = async function (socket, data) {
    if (data.email === undefined) {
      return handler.get_out(socket)
    }

    if (!data.email.includes("@") || data.email.includes(" ")) {
      return handler.get_out(socket)
    }

    if (data.email.length > config.max_email_length) {
      return handler.get_out(socket)
    }

    if (utilz.clean_string5(data.email) !== data.email) {
      return handler.get_out(socket)
    }

    let ans = await db_manager.change_email(socket.hue_user_id, data.email)

    if (ans.message === "error") {
      handler.user_emit(socket, "error_occurred", {})
      return
    } else if (ans.message === "duplicate") {
      handler.user_emit(socket, "email_already_exists", { email: data.email })
      return
    } else if (ans.message === "wait") {
      handler.user_emit(socket, "email_change_wait", {})
      return
    } else if (ans.message === "sent_code") {
      handler.user_emit(socket, "email_change_code_sent", {
        email: data.email,
      })
      return
    }
  }

  // Handles email verification codes
  handler.public.verify_email = async function (socket, data) {
    if (utilz.clean_string5(data.code) !== data.code) {
      return handler.get_out(socket)
    }

    if (data.code.length === 0) {
      return handler.get_out(socket)
    }

    if (data.code.length > config.email_change_code_max_length) {
      return handler.get_out(socket)
    }

    let ans = await db_manager.change_email(
      socket.hue_user_id,
      data.email,
      data.code
    )

    if (ans.message === "error") {
      handler.user_emit(socket, "error_occurred", {})
      return
    } else if (ans.message === "duplicate") {
      handler.user_emit(socket, "email_already_exists", { email: data.email })
      return
    } else if (ans.message === "not_sent") {
      handler.user_emit(socket, "email_change_code_not_sent", {
        email: data.email,
      })
      return
    } else if (ans.message === "wrong_code") {
      handler.user_emit(socket, "email_change_wrong_code", {
        email: data.email,
      })
      return
    } else if (ans.message === "expired_code") {
      handler.user_emit(socket, "email_change_expired_code", {
        email: data.email,
      })
      return
    } else if (ans.message === "changed") {
      handler.modify_socket_properties(socket, { hue_email: data.email })
      handler.user_emit(socket, "email_changed", { email: ans.email })
    }
  }

  // Handles bio changes
  handler.public.change_bio = async function (socket, data) {
    if (data.bio.length > config.max_bio_length) {
      return handler.get_out(socket)
    }

    if (data.bio.split("\n").length > config.max_bio_lines) {
      return handler.get_out(socket)
    }

    if (data.bio !== utilz.clean_string12(data.bio)) {
      return handler.get_out(socket)
    }

    if (socket.hue_bio === data.bio) {
      return false
    }

    handler.modify_socket_properties(socket, { hue_bio: data.bio })

    await db_manager.update_user(socket.hue_user_id, {
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
      return handler.get_out(socket)
    }

    let dimensions = vars.image_dimensions(data.image_file)

    if (
      dimensions.width !== config.profile_image_diameter ||
      dimensions.height !== config.profile_image_diameter
    ) {
      return handler.get_out(socket)
    }

    let size = data.image_file.byteLength / 1024

    if (size === 0 || size > config.max_profile_image_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = `profile_${socket.hue_user_id}.png`

    vars.fs.writeFile(
      vars.images_root + "/" + file_name,
      data.image_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.change_profile_image(socket, file_name)
        }
      }
    )
  }

  // Intermidiate step to change profile images
  handler.change_profile_image = function (socket, file_name) {
    if (config.image_storage_s3_or_local === "local") {
      handler.do_change_profile_image(socket, file_name)
    } else if (config.image_storage_s3_or_local === "s3") {
      vars.fs.readFile(`${vars.images_root}/${file_name}`, (err, data) => {
        if (err) {
          vars.fs.unlink(`${vars.images_root}/${file_name}`, function () {})
          return
        }

        vars.s3
          .putObject({
            ACL: "public-read",
            ContentType: handler.get_content_type(file_name),
            Body: data,
            Bucket: sconfig.s3_bucket_name,
            Key: `${sconfig.s3_images_location}${file_name}`,
            CacheControl: `max-age=${sconfig.s3_cache_max_age}`,
          })
          .promise()

          .then((ans) => {
            vars.fs.unlink(`${vars.images_root}/${file_name}`, function () {})
            handler.do_change_profile_image(
              socket,
              sconfig.s3_main_url + sconfig.s3_images_location + file_name
            )
          })

          .catch((err) => {
            vars.fs.unlink(`${vars.images_root}/${file_name}`, function () {})
            logger.log_error(err)
          })
      })
    } else {
      return false
    }
  }

  // Completes profile image changes
  handler.do_change_profile_image = async function (socket, file_name) {
    let userinfo = await db_manager.get_user(
      { _id: socket.hue_user_id },
      { profile_image: 1, profile_image_version: 1 }
    )
    let new_ver = userinfo.profile_image_version + 1
    let fver = `${file_name}?ver=${new_ver}`
    let image_url

    if (config.image_storage_s3_or_local === "local") {
      image_url = config.public_images_location + fver
    } else if (config.image_storage_s3_or_local === "s3") {
      image_url = fver
    }

    if (userinfo.profile_image && userinfo.profile_image !== file_name) {
      if (!file_name.includes(sconfig.s3_main_url)) {
        vars.fs.unlink(
          `${vars.images_root}/${userinfo.profile_image}`,
          function (err) {}
        )
      } else {
        vars.s3
          .deleteObject({
            Bucket: sconfig.s3_bucket_name,
            Key: userinfo.profile_image.replace(sconfig.s3_main_url, ""),
          })
          .promise()

          .catch((err) => {
            logger.log_error(err)
          })
      }
    }

    let ans = await db_manager.update_user(socket.hue_user_id, {
      profile_image: file_name,
      profile_image_version: new_ver,
    })

    handler.modify_socket_properties(
      socket,
      { hue_profile_image: image_url },
      {
        method: "profile_image_changed",
        data: {
          username: socket.hue_username,
          profile_image: image_url,
        },
      }
    )
  }

  // Handles uploaded audio clips
  handler.upload_audio_clip = function (socket, data) {
    if (data.audio_file === undefined) {
      return handler.get_out(socket)
    }

    let size = data.audio_file.byteLength / 1024

    if (size === 0 || size > config.max_audio_clip_size) {
      handler.user_emit(socket, "upload_error", {})
      return false
    }

    let file_name = `audio_clip_${socket.hue_user_id}.${data.extension}`

    vars.fs.writeFile(
      vars.audio_root + "/" + file_name,
      data.audio_file,
      function (err, data) {
        if (err) {
          handler.user_emit(socket, "upload_error", {})
        } else {
          handler.change_audio_clip(socket, file_name)
        }
      }
    )
  }

  // Intermidiate step to change audio clips
  handler.change_audio_clip = function (socket, file_name) {
    if (config.audio_storage_s3_or_local === "local") {
      handler.do_change_audio_clip(socket, file_name)
    } else if (config.audio_storage_s3_or_local === "s3") {
      vars.fs.readFile(`${vars.audio_root}/${file_name}`, (err, data) => {
        if (err) {
          vars.fs.unlink(`${vars.audio_root}/${file_name}`, function () {})
          return
        }

        vars.s3
          .putObject({
            ACL: "public-read",
            ContentType: handler.get_content_type(file_name),
            Body: data,
            Bucket: sconfig.s3_bucket_name,
            Key: `${sconfig.s3_audio_location}${file_name}`,
            CacheControl: `max-age=${sconfig.s3_cache_max_age}`,
          })
          .promise()

          .then((ans) => {
            vars.fs.unlink(`${vars.audio_root}/${file_name}`, function () {})
            handler.do_change_audio_clip(
              socket,
              sconfig.s3_main_url + sconfig.s3_audio_location + file_name
            )
          })

          .catch((err) => {
            vars.fs.unlink(`${vars.audio_root}/${file_name}`, function () {})
            logger.log_error(err)
          })
      })
    } else {
      return false
    }
  }

  // Completes audio clip changes
  handler.do_change_audio_clip = async function (socket, file_name) {
    let userinfo = await db_manager.get_user(
      { _id: socket.hue_user_id },
      { audio_clip: 1, audio_clip_version: 1 }
    )
    let new_ver = userinfo.audio_clip_version + 1
    let fver = `${file_name}?ver=${new_ver}`
    let audio_clip_url

    if (config.audio_storage_s3_or_local === "local") {
      audio_clip_url = config.public_audio_location + fver
    } else if (config.audio_storage_s3_or_local === "s3") {
      audio_clip_url = fver
    }

    if (userinfo.audio_clip && userinfo.audio_clip !== file_name) {
      if (!file_name.includes(sconfig.s3_main_url)) {
        vars.fs.unlink(`${vars.audio_root}/${userinfo.audio_clip}`, function (
          err
        ) {})
      } else {
        vars.s3
          .deleteObject({
            Bucket: sconfig.s3_bucket_name,
            Key: userinfo.audio_clip.replace(sconfig.s3_main_url, ""),
          })
          .promise()

          .catch((err) => {
            logger.log_error(err)
          })
      }
    }

    let ans = await db_manager.update_user(socket.hue_user_id, {
      audio_clip: file_name,
      audio_clip_version: new_ver,
    })

    handler.modify_socket_properties(
      socket,
      { hue_audio_clip: audio_clip_url },
      {
        method: "audio_clip_changed",
        data: {
          username: socket.hue_username,
          audio_clip: audio_clip_url,
        },
      }
    )
  }
}
