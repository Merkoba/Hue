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
  Hue.checkmsg(`Password succesfully changed`)
}

// Changes the user's bio
Hue.change_bio = function (value) {
  if (value !== Hue.utilz.clean_string12(value)) {
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

// Setups the user details window
Hue.build_details = function () {
  Hue.el("#details_username").textContent = Hue.username

  let s = `<div>${Hue.utilz.nice_date(Hue.user_reg_date)}</div>
    </div>(${Hue.utilz.timeago(Hue.user_reg_date)})</div>`

  Hue.el("#details_reg_date").innerHTML = s

  s = `<div>${Hue.utilz.nice_date(Hue.date_joined)}</div>
    </div>(${Hue.utilz.timeago(Hue.date_joined)})</div>`

  Hue.el("#details_joined_room").innerHTML = s
  Hue.el("#details_id").innerHTML = `ID: ${Hue.user_id}`
}

// Shows the user's details window
Hue.show_details = function (data) {
  Hue.build_details()
  Hue.msg_details.show()
}

// Shows the change username form
Hue.show_change_username = function () {
  let s = `
    <input type='text' placeholder='New Username' id='change_username_input' class='nice_input_2'>
    <div class='flex_row_center'>
        <div class='action bigger details_change_submit' id='change_username_submit'>Change</div>
    </div>`

  Hue.msg_info2.show(["Change Username", s], function () {
    Hue.el("#change_username_input").value = Hue.username
    Hue.el("#change_username_input").focus()

    Hue.el("#change_username_submit").addEventListener("click", function () {
      Hue.submit_change_username()
    })

    Hue.change_user_username_open = true
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
    Hue.msg_info2.close()
  }
}

// Shows the change password form
Hue.show_change_password = function () {
  let s = `
    <div class="details_inputbox">
      <input type='password' placeholder='New Password' id='change_password_input_1' class='nice_input_2'>
      <input type='password' placeholder='Password Again' id='change_password_input_2' class='nice_input_2'>
    </div>
    <div class='flex_row_center'>
        <div class='action bigger details_change_submit' id='change_password_submit'>Change</div>
    </div>`

  Hue.msg_info2.show(["Change Password", s], function () {
    Hue.el("#change_password_input_1").focus()

    Hue.el("#change_password_submit").addEventListener("click", function () {
      Hue.submit_change_password()
    })

    Hue.change_user_password_open = true
  })
}

// Submits the change password form
Hue.submit_change_password = function () {
  let p1 = Hue.el("#change_password_input_1").value.trim()
  let p2 = Hue.el("#change_password_input_2").value.trim()

  if (Hue.change_password(p1, p2)) {
    Hue.msg_info2.close()
  }
}

// Username setter
Hue.set_username = function (username) {
  Hue.username = username
  Hue.generate_mentions_regex()
  Hue.el("#user_menu_username").textContent = Hue.username
}

// Bio setter
Hue.set_bio = function (bio) {
  Hue.bio = bio
  Hue.el("#user_menu_bio_textarea").value = Hue.bio
}

// Setups the user menu
Hue.setup_user_menu = function () {
  Hue.el("#user_menu_profilepic").addEventListener("error", function () {
    if (this.src !== Hue.config.default_profilepic_url) {
      this.src = Hue.config.default_profilepic_url
    }
  })

  Hue.el("#user_menu_bio_textarea").addEventListener("blur", function () {
    let value = Hue.utilz.clean_string12(this.value)

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

  Hue.el("#user_menu_profilepic").addEventListener("click", function () {
    Hue.open_profilepic_select()
  })

  Hue.el("#user_menu_audioclip").addEventListener("click", function () {
    Hue.show_audioclip_menu()
  })

  Hue.el("#user_menu_details").addEventListener("click", function () {
    Hue.show_details()
  })

  Hue.el("#user_menu_logout").addEventListener("click", function () {
    Hue.needs_confirm("logout")
  })

  Hue.el("#user_menu_settings").addEventListener("click", function () {
    Hue.show_settings()
  })

  Hue.el("#user_menu_change_username").addEventListener("click", function () {
    Hue.show_change_username()    
  })

  Hue.el("#user_menu_change_password").addEventListener("click", function () {
    Hue.show_change_password()    
  })
}

// Updates some user menu elements
Hue.update_user_menu = function () {
  let src = Hue.get_profilepic(Hue.user_id)
  Hue.el("#user_menu_profilepic").src = src
  Hue.el("#user_menu_bio_textarea").value = Hue.bio
}

// Shows the user menu
Hue.show_user_menu = function () {
  Hue.msg_user_menu.show()
}

// Setups the profile image circular cropper
Hue.setup_profilepic_cropper = function () {
  Hue.el("#profilepic_cropper_upload").addEventListener("click", function () {
    Hue.profilepic_cropper.result({
        type: "blob",
        size: {
          width: Hue.config.profilepic_diameter,
          height: Hue.config.profilepic_diameter,
        },
        format: "png",
        circle: true,
        quality: 0.95,
      })

      .then(function (blob) {
        Hue.el("#user_menu_profilepic").src = Hue.config.profilepic_loading_url

        Hue.upload_file({
          file: blob,
          action: "profilepic_upload",
          name: "profile.png",
        })
        Hue.msg_profilepic_cropper.close()
      })
  })

  Hue.el("#profilepic_cropper_change").addEventListener("click", function () {
    Hue.open_profilepic_picker()
  })

  Hue.horizontal_separator(Hue.el("#profilepic_cropper_buttons"))
}

// Picker window to select how to change the profilepic
Hue.open_profilepic_select = function () {
  Hue.msg_info2.show([
    "Change Profile Image",
    Hue.template_profilepic_select(),
  ], function () {
    Hue.el("#profilepic_select_draw").addEventListener("click", function () {
      Hue.msg_info2.close()
      Hue.open_draw_image("profilepic")
    })

    Hue.el("#profilepic_select_upload").addEventListener("click", function () {
      Hue.msg_info2.close()
      Hue.open_profilepic_picker()
    })
  })
  Hue.horizontal_separator(Hue.el("#profilepic_select_container"))
}

// If upload is chosen as the method to change the profilepic
Hue.open_profilepic_picker = function () {
  Hue.el("#profilepic_input").click()
}

// This is executed after a profile image has been selected in the file dialog
Hue.profilepic_selected = function (file) {
  if (!file) {
    return false
  }

  let reader = new FileReader()

  reader.onload = function (e) {
    Hue.msg_profilepic_cropper.show(function () {
      Hue.el("#profilepic_input").closest("form").reset()

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

// Checks if the user is joining for the first time
// This is site wide, not room wide
Hue.check_firstime = function () {
  if (Hue.get_local_storage(Hue.ls_first_time) === null) {
    Hue.first_time = true
    Hue.request_desktop_notifications_permission()
    Hue.save_local_storage(Hue.ls_first_time, false)
  } else {
    Hue.first_time = false
  }
}

// Shows a feedback message upon joining the room
Hue.show_joined = function () {
  Hue.checkmsg(`You joined ${Hue.room_name}`)
  Hue.show_topic()
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

// Shows some options for the audio clip
Hue.show_audioclip_menu = function () {
  Hue.msg_info2.show(["Audio Clip", Hue.template_audioclip_menu()], function () {
    Hue.el("#upload_audioclip").addEventListener("click", function () {
      Hue.select_audioclip()
      Hue.msg_info2.close()
    })

    Hue.el("#remove_audioclip").addEventListener("click", function () {
      Hue.needs_confirm_2(function () {
        Hue.socket_emit("remove_audioclip", {})
        Hue.msg_info2.close()
      })
    })

    Hue.el("#play_audioclip").addEventListener("click", function () {
      Hue.user_menu_audio = document.createElement("audio")
      let user = Hue.get_user_profile().audioclip
      let src = Hue.get_audioclip(user.user_id)
      Hue.user_menu_audio.src = src
      Hue.user_menu_audio.play()
    })

    Hue.horizontal_separator(Hue.el("#audioclip_select_container"))
  })
}

// Opens the file picker to choose an audio clip
Hue.select_audioclip = function () {
  Hue.el("#audioclip_input").click()
}

// When an audio clip gets selected from the file picker
Hue.audioclip_selected = function (file) {
  if (!file) {
    return false
  }

  let ext = file.name.split(".").pop(-1).toLowerCase()

  if (ext !== "mp3") {
    Hue.checkmsg("Only mp3 format is allowed")
    return false
  }

  let size = file.size / 1024

  if (size > Hue.config.max_audioclip_size) {
    Hue.checkmsg("File is too big")
    return false
  }

  Hue.upload_file({ file: file, action: "audioclip_upload" })
}

// Get the user profile
Hue.get_user_profile = function () {
  return Hue.get_user_by_username(Hue.username)
}