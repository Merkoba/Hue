// Logs out the user
App.logout = () => {
  App.goto_url(`/logout`, `same`)
}

// Changes the user's username
App.change_username = (username) => {
  if (App.utilz.clean_username(username) !== username) {
    App.checkmsg(`Username contains invalid characters`)
    return false
  }

  if (username.length === 0) {
    App.checkmsg(`Username can't be empty`)
    return false
  }

  if (username.length > App.config.max_username_length) {
    App.checkmsg(`Username is too long`)
    return false
  }

  if (username === App.username) {
    App.checkmsg(`That's already your username`)
    return false
  }

  App.socket_emit(`change_username`, { username: username })
  return true
}

// Changes the user's password
App.change_password = (p1, p2) => {
  if (!p1 || !p2) {
    return false
  }

  if (p1 !== p2) {
    App.checkmsg(`Passwords don't match`)
    return false
  }

  if (p1.length < App.config.min_password_length) {
    App.checkmsg(
      `Password is too short. It must be at least ${App.config.min_password_length} characters long`
    )
    return false
  }

  if (p1.length > App.config.max_password_length) {
    App.checkmsg(`Password is too long`)
    return false
  }

  App.socket_emit(`change_password`, { password: p1 })
  return true
}

// Feedback on password change
App.password_changed = () => {
  App.checkmsg(`Password succesfully changed`)
}

// Changes the user's bio
App.change_bio = (value) => {
  if (value !== App.utilz.single_linebreak(value)) {
    return false
  }

  if (value === App.bio) {
    return false
  }

  if (value.length > App.config.max_bio_length) {
    return false
  }

  if (value.split(`\n`).length > App.config.max_bio_lines) {
    return false
  }

  App.socket_emit(`change_bio`, { bio: value })
  return true
}

// Shows the change username form
App.show_change_username = () => {
  App.msg_change_username.show(() => {
    App.el(`#change_username_input`).value = App.username
    App.el(`#change_username_input`).focus()
  })
}

// Submits the change username form
App.submit_change_username = () => {
  let username = App.el(`#change_username_input`).value.trim()

  if (username === App.username) {
    App.checkmsg(`That's already the username`)
    return
  }

  if (App.change_username(username)) {
    App.msg_change_username.close()
  }
}

// Shows the change password form
App.show_change_password = () => {
  App.msg_change_password.show(() => {
    App.el(`#change_password_input_1`).value = ``
    App.el(`#change_password_input_2`).value = ``
    App.el(`#change_password_input_1`).focus()
  })
}

// Submits the change password form
App.submit_change_password = () => {
  let p1 = App.el(`#change_password_input_1`).value.trim()
  let p2 = App.el(`#change_password_input_2`).value.trim()

  if (App.change_password(p1, p2)) {
    App.msg_change_password.close()
  }
}

// Username setter
App.set_username = (username) => {
  App.username = username
  App.generate_mentions_regex()
  App.el(`#user_profile_username`).textContent = App.username
}

// Bio setter
App.set_bio = (bio) => {
  App.bio = bio
  App.el(`#user_profile_bio_textarea`).value = App.bio
}

// Prepare user profile
App.prepare_user_profile = () => {
  App.el(`#user_profile_reg_date`).textContent = App.utilz.nice_date(App.user_reg_date)
  App.el(`#user_profile_id`).textContent = `ID: ${App.user_id}`

  if (App.get_self_user().profilepic_version === 0) {
    App.show_user_profile()
    App.show_info(`You can select a profile image here`)
  }
}

// Setups the user profile
App.setup_user_profile = () => {
  let pic = App.el(`#user_profile_profilepic`)

  App.ev(pic, `error`, () => {
    App.fallback_profilepic(pic)
  })

  let textarea = App.el(`#user_profile_bio_textarea`)

  App.ev(textarea, `blur`, () => {
    let value = App.utilz.single_linebreak(textarea.value)

    if (value !== App.bio) {
      let result = App.change_bio(value)

      if (!result) {
        textarea.value = App.bio
      }
      else {
        textarea.value = value
      }
    }
    else {
      textarea.value = value
    }
  })

  App.ev(App.el(`#user_profile_profilepic`), `click`, () => {
    App.msg_profilepic_select.show()
  })

  App.ev(App.el(`#user_profile_audioclip`), `click`, () => {
    App.msg_audioclip_select.show()
  })

  App.ev(App.el(`#user_profile_logout`), `click`, () => {
    App.needs_confirm(`logout`)
  })

  App.ev(App.el(`#user_profile_change_username`), `click`, () => {
    App.show_change_username()
  })

  App.ev(App.el(`#user_profile_change_password`), `click`, () => {
    App.show_change_password()
  })

  App.setup_profilepic_select()
  App.setup_audioclip_select()
  App.setup_change_username()
  App.setup_change_password()
}

// Setup change username
App.setup_change_username = () => {
  App.ev(App.el(`#change_username_submit`), `click`, () => {
    App.submit_change_username()
  })
}

// Setup change password
App.setup_change_password = () => {
  App.ev(App.el(`#change_password_submit`), `click`, () => {
    App.submit_change_password()
  })
}

// Updates some user profile elements
App.update_user_profile = () => {
  let src = App.get_profilepic(App.user_id)
  App.el(`#user_profile_profilepic`).src = src
  App.el(`#user_profile_bio_textarea`).value = App.bio
}

// Shows the user profile
App.show_user_profile = () => {
  App.msg_user_profile.show()
}

// Setups the profile image circular cropper
App.setup_profilepic_cropper = () => {
  App.ev(App.el(`#profilepic_cropper_crop`), `click`, () => {
    App.profilepic_cropper.result({
      type: `blob`,
      size: {
        width: App.config.profilepic_diameter,
        height: App.config.profilepic_diameter,
      },
      format: `png`,
      circle: true,
      quality: App.config.image_blob_quality,
    })
    .then((blob) => {
      App.profilepic_preview_blob = blob
      App.el(`#profilepic_preview_image`).src = URL.createObjectURL(blob)
      App.msg_profilepic_preview.show()
    })
  })

  App.ev(App.el(`#profilepic_cropper_change`), `click`, () => {
    if (App.profilepic_cropper_type === `drawing`) {
      App.msg_profilepic_cropper.close()
      App.open_draw_image(`profilepic`)
    }
    else if (App.profilepic_cropper_type === `upload`) {
      App.msg_profilepic_cropper.close()
      App.open_profilepic_picker()
    }
    else if (App.profilepic_cropper_type === `random_canvas`) {
      App.make_random_image(`profilepic`)
    }
  })
}

// Upload profilepic
App.upload_profilepic = () => {
  App.el(`#user_profile_profilepic`).src = App.config.profilepic_loading_url

  App.upload_file({
    file: App.profilepic_preview_blob,
    action: `profilepic_upload`,
    name: `profile.png`,
  })

  App.msg_profilepic_cropper.close()
}

// Setup profilepic select
App.setup_profilepic_select = () => {
  App.ev(App.el(`#profilepic_select_draw`), `click`, () => {
    App.msg_profilepic_select.close()
    App.open_draw_image(`profilepic`)
  })

  App.ev(App.el(`#profilepic_select_random`), `click`, () => {
    App.msg_profilepic_select.close()
    App.make_random_image(`profilepic`)
  })

  App.ev(App.el(`#profilepic_select_upload`), `click`, () => {
    App.msg_profilepic_select.close()
    App.open_profilepic_picker()
  })

  App.ev(App.el(`#profilepic_preview_choose`), `click`, () => {
    App.msg_profilepic_preview.close()
    App.msg_profilepic_select.show()
  })

  App.ev(App.el(`#profilepic_preview_confirm`), `click`, () => {
    App.msg_profilepic_preview.close()
    App.upload_profilepic()
  })
}

// If upload is chosen as the method to change the profilepic
App.open_profilepic_picker = () => {
  App.upload_media = `profilepic`
  App.trigger_dropzone()
}

// This is executed after a profile image has been selected in the file dialog
App.profilepic_selected = (file, type) => {
  if (!file) {
    return
  }

  for (let date in App.files) {
    let f = App.files[date]

    if (f.hue_data.action === `profilepic_upload`) {
      App.cancel_file_upload(date)
    }
  }

  let reader = new FileReader()

  reader.onload = (e) => {
    if (type === `drawing`) {
      App.el(`#profilepic_cropper_change`).textContent = `Re-Draw`
    }
    else if (type === `upload`) {
      App.el(`#profilepic_cropper_change`).textContent = `Re-Choose`
    }
    else if (type === `random_canvas`) {
      App.el(`#profilepic_cropper_change`).textContent = `Re-Generate`
    }

    App.profilepic_cropper_type = type

    App.msg_profilepic_cropper.show(() => {
      if (!App.profilepic_cropper) {
        App.profilepic_cropper = new Croppie(App.el(`#profilepic_cropper`), {
          viewport: {
            width: 200,
            height: 200,
            type: `circle`,
          },
          boundary: { width: 350, height: 350 }
        })
      }

      App.profilepic_cropper.bind({
        url: e.target.result,
        points: [],
      })
      .then(() => {
        App.profilepic_cropper.setZoom(0)
      })
    })
  }

  reader.readAsDataURL(file)
}

// Feedback that the user is not an operator
App.not_an_op = () => {
  App.checkmsg(`You are not a room operator`)
}

// Shows a feedback message upon joining the room
App.show_joined = () => {
  App.make_info_popup_item({
    message: `You joined the room`,
    increase_counter: false
  })
}

// Disconnect other clients of the same account
App.disconnect_others = () => {
  App.socket_emit(`disconnect_others`, {})
}

// Shows how many clients of the same account were disconnected
App.show_others_disconnected = (data) => {
  let s

  if (data.amount === 1) {
    s = `${data.amount} client was disconnected`
  }
  else {
    s = `${data.amount} clients were disconnected`
  }

  App.checkmsg(s)
}

// Setup change audioclip select
App.setup_audioclip_select = () => {
  App.ev(App.el(`#upload_audioclip`), `click`, () => {
    App.select_audioclip()
    App.msg_audioclip_select.close()
  })

  App.ev(App.el(`#remove_audioclip`), `click`, () => {
    App.needs_confirm_2(() => {
      App.socket_emit(`remove_audioclip`, {})
      App.msg_audioclip_select.close()
    })
  })

  App.ev(App.el(`#play_audioclip`), `click`, () => {
    App.play_audioclip(App.user_id)
  })
}

// Opens the file picker to choose an audio clip
App.select_audioclip = () => {
  App.upload_media = `audioclip`
  App.trigger_dropzone()
}

// When an audio clip gets selected from the file picker
App.audioclip_selected = (file) => {
  if (!file) {
    return
  }

  let ext = file.name.split(`.`).pop(-1).toLowerCase()

  if (ext !== `mp3`) {
    App.checkmsg(`Only mp3 format is allowed`)
    return
  }

  let size = file.size / 1024

  if (size > App.config.max_audioclip_size) {
    App.checkmsg(`File is too big`)
    return
  }

  App.upload_file({ file: file, action: `audioclip_upload` })
}

// Get the user profile
App.get_self_user = () => {
  return App.get_user_by_username(App.username)
}