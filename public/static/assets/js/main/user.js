// Logs out the user
Hue.logout = () => {
  Hue.goto_url(`/logout`, `same`)
}

// Changes the user's username
Hue.change_username = (username) => {
  if (Hue.utilz.clean_username(username) !== username) {
    Hue.checkmsg(`Username contains invalid characters`)
    return false
  }

  if (username.length === 0) {
    Hue.checkmsg(`Username can't be empty`)
    return false
  }

  if (username.length > Hue.config.max_username_length) {
    Hue.checkmsg(`Username is too long`)
    return false
  }

  if (username === Hue.username) {
    Hue.checkmsg(`That's already your username`)
    return false
  }

  Hue.socket_emit(`change_username`, { username: username })
  return true
}

// Changes the user's password
Hue.change_password = (p1, p2) => {
  if (!p1 || !p2) {
    return false
  }

  if (p1 !== p2) {
    Hue.checkmsg(`Passwords don't match`)
    return false
  }

  if (p1.length < Hue.config.min_password_length) {
    Hue.checkmsg(
      `Password is too short. It must be at least ${Hue.config.min_password_length} characters long`
    )
    return false
  }

  if (p1.length > Hue.config.max_password_length) {
    Hue.checkmsg(`Password is too long`)
    return false
  }

  Hue.socket_emit(`change_password`, { password: p1 })
  return true
}

// Feedback on password change
Hue.password_changed = () => {
  Hue.checkmsg(`Password succesfully changed`)
}

// Changes the user's bio
Hue.change_bio = (value) => {
  if (value !== Hue.utilz.single_linebreak(value)) {
    return false
  }

  if (value === Hue.bio) {
    return false
  }

  if (value.length > Hue.config.max_bio_length) {
    return false
  }

  if (value.split(`\n`).length > Hue.config.max_bio_lines) {
    return false
  }

  Hue.socket_emit(`change_bio`, { bio: value })
  return true
}

// Shows the change username form
Hue.show_change_username = () => {
  Hue.msg_change_username.show(() => {
    Hue.el(`#change_username_input`).value = Hue.username
    Hue.el(`#change_username_input`).focus()
  })
}

// Submits the change username form
Hue.submit_change_username = () => {
  let username = Hue.el(`#change_username_input`).value.trim()

  if (username === Hue.username) {
    Hue.checkmsg(`That's already the username`)
    return
  }

  if (Hue.change_username(username)) {
    Hue.msg_change_username.close()
  }
}

// Shows the change password form
Hue.show_change_password = () => {
  Hue.msg_change_password.show(() => {
    Hue.el(`#change_password_input_1`).value = ``
    Hue.el(`#change_password_input_2`).value = ``
    Hue.el(`#change_password_input_1`).focus()
  })
}

// Submits the change password form
Hue.submit_change_password = () => {
  let p1 = Hue.el(`#change_password_input_1`).value.trim()
  let p2 = Hue.el(`#change_password_input_2`).value.trim()

  if (Hue.change_password(p1, p2)) {
    Hue.msg_change_password.close()
  }
}

// Username setter
Hue.set_username = (username) => {
  Hue.username = username
  Hue.generate_mentions_regex()
  Hue.el(`#user_profile_username`).textContent = Hue.username
}

// Bio setter
Hue.set_bio = (bio) => {
  Hue.bio = bio
  Hue.el(`#user_profile_bio_textarea`).value = Hue.bio
}

// Prepare user profile
Hue.prepare_user_profile = () => {
  Hue.el(`#user_profile_reg_date`).textContent = Hue.utilz.nice_date(Hue.user_reg_date)
  Hue.el(`#user_profile_id`).textContent = `ID: ${Hue.user_id}`

  if (Hue.get_self_user().profilepic_version === 0) {
    Hue.show_user_profile()
    Hue.show_info(`You can select a profile image here`)
  }
}

// Setups the user profile
Hue.setup_user_profile = () => {
  let pic = Hue.el(`#user_profile_profilepic`)

  Hue.ev(pic, `error`, () => {
    Hue.fallback_profilepic(pic)
  })

  let textarea = Hue.el(`#user_profile_bio_textarea`)

  Hue.ev(textarea, `blur`, () => {
    let value = Hue.utilz.single_linebreak(textarea.value)

    if (value !== Hue.bio) {
      let result = Hue.change_bio(value)

      if (!result) {
        textarea.value = Hue.bio
      }
      else {
        textarea.value = value
      }
    }
    else {
      textarea.value = value
    }
  })

  Hue.ev(Hue.el(`#user_profile_profilepic`), `click`, () => {
    Hue.msg_profilepic_select.show()
  })

  Hue.ev(Hue.el(`#user_profile_audioclip`), `click`, () => {
    Hue.msg_audioclip_select.show()
  })

  Hue.ev(Hue.el(`#user_profile_logout`), `click`, () => {
    Hue.needs_confirm(`logout`)
  })

  Hue.ev(Hue.el(`#user_profile_change_username`), `click`, () => {
    Hue.show_change_username()
  })

  Hue.ev(Hue.el(`#user_profile_change_password`), `click`, () => {
    Hue.show_change_password()
  })

  Hue.setup_profilepic_select()
  Hue.setup_audioclip_select()
  Hue.setup_change_username()
  Hue.setup_change_password()
}

// Setup change username
Hue.setup_change_username = () => {
  Hue.ev(Hue.el(`#change_username_submit`), `click`, () => {
    Hue.submit_change_username()
  })
}

// Setup change password
Hue.setup_change_password = () => {
  Hue.ev(Hue.el(`#change_password_submit`), `click`, () => {
    Hue.submit_change_password()
  })
}

// Updates some user profile elements
Hue.update_user_profile = () => {
  let src = Hue.get_profilepic(Hue.user_id)
  Hue.el(`#user_profile_profilepic`).src = src
  Hue.el(`#user_profile_bio_textarea`).value = Hue.bio
}

// Shows the user profile
Hue.show_user_profile = () => {
  Hue.msg_user_profile.show()
}

// Setups the profile image circular cropper
Hue.setup_profilepic_cropper = () => {
  Hue.ev(Hue.el(`#profilepic_cropper_crop`), `click`, () => {
    Hue.profilepic_cropper.result({
      type: `blob`,
      size: {
        width: Hue.config.profilepic_diameter,
        height: Hue.config.profilepic_diameter,
      },
      format: `png`,
      circle: true,
      quality: Hue.config.image_blob_quality,
    })

    .then((blob) => {
      Hue.profilepic_preview_blob = blob
      Hue.el(`#profilepic_preview_image`).src = URL.createObjectURL(blob)
      Hue.msg_profilepic_preview.show()
    })
  })

  Hue.ev(Hue.el(`#profilepic_cropper_change`), `click`, () => {
    if (Hue.profilepic_cropper_type === `drawing`) {
      Hue.msg_profilepic_cropper.close()
      Hue.open_draw_image(`profilepic`)
    }
    else if (Hue.profilepic_cropper_type === `upload`) {
      Hue.msg_profilepic_cropper.close()
      Hue.open_profilepic_picker()
    }
    else if (Hue.profilepic_cropper_type === `random_canvas`) {
      Hue.make_random_image(`profilepic`)
    }
  })
}

// Upload profilepic
Hue.upload_profilepic = () => {
  Hue.el(`#user_profile_profilepic`).src = Hue.config.profilepic_loading_url

  Hue.upload_file({
    file: Hue.profilepic_preview_blob,
    action: `profilepic_upload`,
    name: `profile.png`,
  })

  Hue.msg_profilepic_cropper.close()
}

// Setup profilepic select
Hue.setup_profilepic_select = () => {
  Hue.ev(Hue.el(`#profilepic_select_draw`), `click`, () => {
    Hue.msg_profilepic_select.close()
    Hue.open_draw_image(`profilepic`)
  })

  Hue.ev(Hue.el(`#profilepic_select_random`), `click`, () => {
    Hue.msg_profilepic_select.close()
    Hue.make_random_image(`profilepic`)
  })

  Hue.ev(Hue.el(`#profilepic_select_upload`), `click`, () => {
    Hue.msg_profilepic_select.close()
    Hue.open_profilepic_picker()
  })

  Hue.ev(Hue.el(`#profilepic_preview_choose`), `click`, () => {
    Hue.msg_profilepic_preview.close()
    Hue.msg_profilepic_select.show()
  })

  Hue.ev(Hue.el(`#profilepic_preview_confirm`), `click`, () => {
    Hue.msg_profilepic_preview.close()
    Hue.upload_profilepic()
  })
}

// If upload is chosen as the method to change the profilepic
Hue.open_profilepic_picker = () => {
  Hue.upload_media = `profilepic`
  Hue.trigger_dropzone()
}

// This is executed after a profile image has been selected in the file dialog
Hue.profilepic_selected = (file, type) => {
  if (!file) {
    return
  }

  for (let date in Hue.files) {
    let f = Hue.files[date]

    if (f.hue_data.action === `profilepic_upload`) {
      Hue.cancel_file_upload(date)
    }
  }

  let reader = new FileReader()

  reader.onload = (e) => {
    if (type === `drawing`) {
      Hue.el(`#profilepic_cropper_change`).textContent = `Re-Draw`
    }
    else if (type === `upload`) {
      Hue.el(`#profilepic_cropper_change`).textContent = `Re-Choose`
    }
    else if (type === `random_canvas`) {
      Hue.el(`#profilepic_cropper_change`).textContent = `Re-Generate`
    }

    Hue.profilepic_cropper_type = type

    Hue.msg_profilepic_cropper.show(() => {
      if (!Hue.profilepic_cropper) {
        Hue.profilepic_cropper = new Croppie(Hue.el(`#profilepic_cropper`), {
          viewport: {
            width: 200,
            height: 200,
            type: `circle`,
          },
          boundary: { width: 350, height: 350 }
        })
      }

      Hue.profilepic_cropper.bind({
        url: e.target.result,
        points: [],
      })

      .then(() => {
        Hue.profilepic_cropper.setZoom(0)
      })
    })
  }

  reader.readAsDataURL(file)
}

// Feedback that the user is not an operator
Hue.not_an_op = () => {
  Hue.checkmsg(`You are not a room operator`)
}

// Shows a feedback message upon joining the room
Hue.show_joined = () => {
  Hue.make_info_popup_item({
    message: `You joined the room`,
    increase_counter: false
  })
}

// Disconnect other clients of the same account
Hue.disconnect_others = () => {
  Hue.socket_emit(`disconnect_others`, {})
}

// Shows how many clients of the same account were disconnected
Hue.show_others_disconnected = (data) => {
  let s

  if (data.amount === 1) {
    s = `${data.amount} client was disconnected`
  }
  else {
    s = `${data.amount} clients were disconnected`
  }

  Hue.checkmsg(s)
}

// Setup change audioclip select
Hue.setup_audioclip_select = () => {
  Hue.ev(Hue.el(`#upload_audioclip`), `click`, () => {
    Hue.select_audioclip()
    Hue.msg_audioclip_select.close()
  })

  Hue.ev(Hue.el(`#remove_audioclip`), `click`, () => {
    Hue.needs_confirm_2(() => {
      Hue.socket_emit(`remove_audioclip`, {})
      Hue.msg_audioclip_select.close()
    })
  })

  Hue.ev(Hue.el(`#play_audioclip`), `click`, () => {
    Hue.play_audioclip(Hue.user_id)
  })
}

// Opens the file picker to choose an audio clip
Hue.select_audioclip = () => {
  Hue.upload_media = `audioclip`
  Hue.trigger_dropzone()
}

// When an audio clip gets selected from the file picker
Hue.audioclip_selected = (file) => {
  if (!file) {
    return
  }

  let ext = file.name.split(`.`).pop(-1).toLowerCase()

  if (ext !== `mp3`) {
    Hue.checkmsg(`Only mp3 format is allowed`)
    return
  }

  let size = file.size / 1024

  if (size > Hue.config.max_audioclip_size) {
    Hue.checkmsg(`File is too big`)
    return
  }

  Hue.upload_file({ file: file, action: `audioclip_upload` })
}

// Get the user profile
Hue.get_self_user = () => {
  return Hue.get_user_by_username(Hue.username)
}