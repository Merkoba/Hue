// Logs out the user
Hue.logout = function () {
  Hue.goto_url("/logout", "same")
}

// Changes the user's username
Hue.change_username = function (username) {
  if (Hue.utilz.clean_username(username) !== username) {
    Hue.checkmsg("Username contains invalid characters")
    return false
  }

  if (username.length === 0) {
    Hue.checkmsg("Username can't be empty")
    return false
  }

  if (username.length > Hue.config.max_username_length) {
    Hue.checkmsg("Username is too long")
    return false
  }

  if (username === Hue.username) {
    Hue.checkmsg("That's already your username")
    return false
  }

  Hue.socket_emit("change_username", { username: username })
  return true
}

// Changes the user's password
Hue.change_password = function (p1, p2) {
  if (!p1 || !p2) {
    return false
  }

  if (p1 !== p2) {
    Hue.checkmsg("Passwords don't match")    
    return false
  }

  if (p1.length < Hue.config.min_password_length) {
    Hue.checkmsg(
      `Password is too short. It must be at least ${Hue.config.min_password_length} characters long`
    )
    return false
  }

  if (p1.length > Hue.config.max_password_length) {
    Hue.checkmsg("Password is too long")
    return false
  }

  Hue.socket_emit("change_password", { password: p1 })
  return true
}

// Feedback on password change
Hue.password_changed = function () {
  Hue.checkmsg("Password succesfully changed")
}

// Changes the user's bio
Hue.change_bio = function (value) {
  if (value !== Hue.utilz.single_linebreak(value)) {
    return false
  }

  if (value === Hue.bio) {
    return false
  }

  if (value.length > Hue.config.max_bio_length) {
    return false
  }

  if (value.split("\n").length > Hue.config.max_bio_lines) {
    return false
  }

  Hue.socket_emit("change_bio", { bio: value })
  return true
}

// Shows the change username form
Hue.show_change_username = function () {
  Hue.msg_change_username.show(function () {
    Hue.el("#change_username_input").value = Hue.username
    Hue.el("#change_username_input").focus()
  })
}

// Submits the change username form
Hue.submit_change_username = function () {
  let username = Hue.el("#change_username_input").value.trim()

  if (username === Hue.username) {
    Hue.checkmsg("That's already the username")
    return
  }

  if (Hue.change_username(username)) {
    Hue.msg_change_username.close()
  }
}

// Shows the change password form
Hue.show_change_password = function () {
  Hue.msg_change_password.show(function () {
    Hue.el("#change_password_input_1").value = ""
    Hue.el("#change_password_input_2").value = ""
    Hue.el("#change_password_input_1").focus()
  })
}

// Submits the change password form
Hue.submit_change_password = function () {
  let p1 = Hue.el("#change_password_input_1").value.trim()
  let p2 = Hue.el("#change_password_input_2").value.trim()

  if (Hue.change_password(p1, p2)) {
    Hue.msg_change_password.close()
  }
}

// Username setter
Hue.set_username = function (username) {
  Hue.username = username
  Hue.generate_mentions_regex()
  Hue.el("#user_profile_username").textContent = Hue.username
}

// Bio setter
Hue.set_bio = function (bio) {
  Hue.bio = bio
  Hue.el("#user_profile_bio_textarea").value = Hue.bio
}

// Setups the user profile
Hue.setup_user_profile = function () {
  Hue.ev(Hue.el("#user_profile_profilepic"), "error", function () {
    Hue.fallback_profilepic(this)
  })

  Hue.ev(Hue.el("#user_profile_bio_textarea"), "blur", function () {
    let value = Hue.utilz.single_linebreak(this.value)

    if (value !== Hue.bio) {
      let result = Hue.change_bio(value)

      if (!result) {
        this.value = Hue.bio
      } else {
        this.value = value
      }
    } else {
      this.value = value
    }
  })

  Hue.el("#user_profile_reg_date").textContent = Hue.utilz.nice_date(Hue.user_reg_date)
  Hue.el("#user_profile_id").textContent = `ID: ${Hue.user_id}`

  Hue.ev(Hue.el("#user_profile_profilepic"), "click", function () {
    Hue.msg_profilepic_select.show()
  })

  Hue.ev(Hue.el("#user_profile_audioclip"), "click", function () {
    Hue.msg_audioclip_select.show()
  })

  Hue.ev(Hue.el("#user_profile_logout"), "click", function () {
    Hue.needs_confirm("logout")
  })

  Hue.ev(Hue.el("#user_profile_change_username"), "click", function () {
    Hue.show_change_username()    
  })

  Hue.ev(Hue.el("#user_profile_change_password"), "click", function () {
    Hue.show_change_password()    
  })

  if (Hue.get_self_user().profilepic_version === 0) {
    Hue.show_user_profile()
    Hue.show_info("You can select a profile image here")
  }

  Hue.setup_profilepic_select()
  Hue.setup_audioclip_select()
  Hue.setup_change_username()
  Hue.setup_change_password()
}

// Setup change username
Hue.setup_change_username = function () {
  Hue.ev(Hue.el("#change_username_submit"), "click", function () {
    Hue.submit_change_username()
  })
}

// Setup change password
Hue.setup_change_password = function () {
  Hue.ev(Hue.el("#change_password_submit"), "click", function () {
    Hue.submit_change_password()
  })
}

// Updates some user profile elements
Hue.update_user_profile = function () {
  let src = Hue.get_profilepic(Hue.user_id)
  Hue.el("#user_profile_profilepic").src = src
  Hue.el("#user_profile_bio_textarea").value = Hue.bio
}

// Shows the user profile
Hue.show_user_profile = function () {
  Hue.msg_user_profile.show()
}

// Setups the profile image circular cropper
Hue.setup_profilepic_cropper = function () {
  Hue.ev(Hue.el("#profilepic_cropper_crop"), "click", function () {
    Hue.profilepic_cropper.result({
      type: "blob",
      size: {
        width: Hue.config.profilepic_diameter,
        height: Hue.config.profilepic_diameter,
      },
      format: "png",
      circle: true,
      quality: Hue.config.image_blob_quality,
    })

    .then(function (blob) {
      Hue.profilepic_preview_blob = blob
      Hue.el("#profilepic_preview_image").src = URL.createObjectURL(blob)
      Hue.msg_profilepic_preview.show()
    })
  })

  Hue.ev(Hue.el("#profilepic_cropper_change"), "click", function () {
    if (Hue.profilepic_cropper_type === "drawing") {
      Hue.msg_profilepic_cropper.close()
      Hue.open_draw_image("profilepic")
    } else if (Hue.profilepic_cropper_type === "upload") {
      Hue.msg_profilepic_cropper.close()
      Hue.open_profilepic_picker()
    } else if (Hue.profilepic_cropper_type === "random_canvas") {
      Hue.make_random_image("profilepic")
    }
  })
}

// Upload profilepic
Hue.upload_profilepic = function () {
  Hue.el("#user_profile_profilepic").src = Hue.config.profilepic_loading_url

  Hue.upload_file({
    file: Hue.profilepic_preview_blob,
    action: "profilepic_upload",
    name: "profile.png",
  })
  
  Hue.msg_profilepic_cropper.close()
}

// Setup profilepic select
Hue.setup_profilepic_select = function () {
  Hue.ev(Hue.el("#profilepic_select_draw"), "click", function () {
    Hue.msg_profilepic_select.close()
    Hue.open_draw_image("profilepic")
  })

  Hue.ev(Hue.el("#profilepic_select_random"), "click", function () {
    Hue.msg_profilepic_select.close()
    Hue.make_random_image("profilepic")
  })

  Hue.ev(Hue.el("#profilepic_select_upload"), "click", function () {
    Hue.msg_profilepic_select.close()
    Hue.open_profilepic_picker()
  })

  Hue.ev(Hue.el("#profilepic_preview_choose"), "click", function () {
    Hue.msg_profilepic_preview.close()
    Hue.msg_profilepic_select.show()
  })

  Hue.ev(Hue.el("#profilepic_preview_confirm"), "click", function () {
    Hue.msg_profilepic_preview.close()
    Hue.upload_profilepic()
  })
}

// If upload is chosen as the method to change the profilepic
Hue.open_profilepic_picker = function () {
  Hue.upload_media = "profilepic"
  Hue.trigger_dropzone()
}

// This is executed after a profile image has been selected in the file dialog
Hue.profilepic_selected = function (file, type) {
  if (!file) {
    return
  }

  for (let date in Hue.files) {
    let f = Hue.files[date]

    if (f.hue_data.action === "profilepic_upload") {
      Hue.cancel_file_upload(date)
    }
  }

  let reader = new FileReader()
  
  reader.onload = function (e) {
    if (type === "drawing") {
      Hue.el("#profilepic_cropper_change").textContent = "Re-Draw"
    } else if (type === "upload") {
      Hue.el("#profilepic_cropper_change").textContent = "Re-Choose"
    } else if (type === "random_canvas") {
      Hue.el("#profilepic_cropper_change").textContent = "Re-Generate"
    }

    Hue.profilepic_cropper_type = type

    Hue.msg_profilepic_cropper.show(function () {
      if (!Hue.profilepic_cropper) {
        Hue.profilepic_cropper = new Croppie(Hue.el("#profilepic_cropper"), {
          viewport: {
            width: 200,
            height: 200,
            type: "circle",
          },
          boundary: { width: 350, height: 350 }
        })
      }

      Hue.profilepic_cropper.bind({
        url: e.target.result,
        points: [],
      })

      .then(function () {
        Hue.profilepic_cropper.setZoom(0)
      })
    })
  }

  reader.readAsDataURL(file)
}

// Feedback that the user is not an operator
Hue.not_an_op = function () {
  Hue.checkmsg("You are not a room operator")
}

// Shows a feedback message upon joining the room
Hue.show_joined = function () {
  Hue.make_info_popup_item({
    message: "You joined the room",
    increase_counter: false
  })
}

// Disconnect other clients of the same account
Hue.disconnect_others = function () {
  Hue.socket_emit("disconnect_others", {})
}

// Shows how many clients of the same account were disconnected
Hue.show_others_disconnected = function (data) {
  let s

  if (data.amount === 1) {
    s = `${data.amount} client was disconnected`
  } else {
    s = `${data.amount} clients were disconnected`
  }

  Hue.checkmsg(s)
}

// Setup change audioclip select
Hue.setup_audioclip_select = function () {
  Hue.ev(Hue.el("#upload_audioclip"), "click", function () {
    Hue.select_audioclip()
    Hue.msg_audioclip_select.close()
  })

  Hue.ev(Hue.el("#remove_audioclip"), "click", function () {
    Hue.needs_confirm_2(function () {
      Hue.socket_emit("remove_audioclip", {})
      Hue.msg_audioclip_select.close()
    })
  })

  Hue.ev(Hue.el("#play_audioclip"), "click", function () {
    Hue.play_audioclip(Hue.user_id)
  })
}

// Opens the file picker to choose an audio clip
Hue.select_audioclip = function () {
  Hue.upload_media = "audioclip"
  Hue.trigger_dropzone()
}

// When an audio clip gets selected from the file picker
Hue.audioclip_selected = function (file) {
  if (!file) {
    return
  }

  let ext = file.name.split(".").pop(-1).toLowerCase()

  if (ext !== "mp3") {
    Hue.checkmsg("Only mp3 format is allowed")
    return
  }

  let size = file.size / 1024

  if (size > Hue.config.max_audioclip_size) {
    Hue.checkmsg("File is too big")
    return
  }

  Hue.upload_file({ file: file, action: "audioclip_upload" })
}

// Get the user profile
Hue.get_self_user = function () {
  return Hue.get_user_by_username(Hue.username)
}