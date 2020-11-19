// Logs out the user
Hue.logout = function () {
  Hue.goto_url("/logout")
}

// Changes the user's username
Hue.change_username = function (uname, show_feedback = true) {
  if (Hue.utilz.clean_username(uname) !== uname) {
    if (show_feedback) {
      Hue.feedback("Username contains invalid characters")
    }

    return false
  }

  if (uname.length === 0) {
    if (show_feedback) {
      Hue.feedback("Username can't be empty")
    }

    return false
  }

  if (uname.length > Hue.config.max_username_length) {
    if (show_feedback) {
      Hue.feedback("Username is too long")
    }

    return false
  }

  if (uname === Hue.username) {
    if (show_feedback) {
      Hue.feedback("That's already your username")
    }

    return false
  }

  Hue.socket_emit("change_username", { username: uname })

  return true
}

// Changes the user's password
Hue.change_password = function (passwd, show_feedback = true) {
  if (passwd.length < Hue.config.min_password_length) {
    if (show_feedback) {
      Hue.feedback(
        `Password is too short. It must be at least ${Hue.config.min_password_length} characters long`
      )
    }

    return false
  }

  if (passwd.length > Hue.config.max_password_length) {
    if (show_feedback) {
      Hue.feedback("Password is too long")
    }

    return false
  }

  Hue.socket_emit("change_password", { password: passwd })

  return true
}

// Feedback on password change
Hue.password_changed = function (data) {
  Hue.feedback(
    `Password succesfully changed. To force other clients connected to your account to disconnect you can use ${Hue.config.commands_prefix}disconnectothers`
  )
}

// Changes the user's email
Hue.change_email = function (email, show_feedback = true) {
  if (Hue.utilz.clean_string5(email) !== email) {
    if (show_feedback) {
      Hue.feedback("Invalid email address")
    }

    return false
  }

  if (email.length === 0) {
    if (show_feedback) {
      Hue.feedback("Username can't be empty")
    }

    return false
  }

  if (!email.includes("@")) {
    if (show_feedback) {
      Hue.feedback("Invalid email address")
    }

    return false
  }

  if (email.length > Hue.config.max_email_length) {
    if (show_feedback) {
      Hue.feedback("Email is too long")
    }

    return false
  }

  Hue.socket_emit("change_email", { email: email })

  return true
}

// Feedback on email change
Hue.email_changed = function (data) {
  Hue.set_email(data.email)
  Hue.feedback(`Email succesfully changed to ${data.email}`)
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
  $("#details_username").text(Hue.username)
  $("#details_email").text(Hue.user_email)

  let s = `<div>${Hue.utilz.nice_date(Hue.user_reg_date)}</div>
    </div>(${Hue.get_timeago(Hue.user_reg_date)})</div>`

  $("#details_reg_date").html(s)

  s = `<div>${Hue.utilz.nice_date(Hue.date_joined)}</div>
    </div>(${Hue.get_timeago(Hue.date_joined)})</div>`

  $("#details_joined_room").html(s)
  $("#details_id").html(`ID: ${Hue.user_id}`)
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
        <div class='action pointer bigger details_change_submit' id='change_username_submit'>Change</div>
    </div>`

  Hue.msg_info2.show(["Change Username", s], function () {
    $("#change_username_input").val(Hue.username)
    $("#change_username_input").focus()

    $("#change_username_submit").click(function () {
      Hue.submit_change_username()
    })

    Hue.change_user_username_open = true
  })
}

// Submits the change username form
Hue.submit_change_username = function () {
  let uname = $("#change_username_input").val().trim()

  if (Hue.change_username(uname, false)) {
    Hue.msg_info2.close()
  } else {
    alert("Invalid username format")
  }
}

// Shows the change password form
Hue.show_change_password = function () {
  let s = `
    <input type='password' placeholder='New Password' id='change_password_input' class='nice_input_2'>
    <div class='flex_row_center'>
        <div class='action pointer bigger details_change_submit' id='change_password_submit'>Change</div>
    </div>`

  Hue.msg_info2.show(["Change Password", s], function () {
    $("#change_password_input").focus()

    $("#change_password_submit").click(function () {
      Hue.submit_change_password()
    })

    Hue.change_user_password_open = true
  })
}

// Submits the change password form
Hue.submit_change_password = function () {
  let uname = $("#change_password_input").val().trim()

  if (Hue.change_password(uname, false)) {
    Hue.msg_info2.close()
  } else {
    alert("Invalid password format")
  }
}

// Shows the change email form
Hue.show_change_email = function () {
  let s = `
    <input type='text' placeholder='New Email' id='change_email_input' class='nice_input_2'>
    <div class='flex_row_center'>
        <div class='action pointer bigger details_change_submit' id='change_email_submit'>Change</div>
    </div>`

  Hue.msg_info2.show(["Change Email", s], function () {
    $("#change_email_input").focus()

    $("#change_email_submit").click(function () {
      Hue.submit_change_email()
    })

    Hue.change_user_email_open = true
  })
}

// Submits the change email form
Hue.submit_change_email = function () {
  let uname = $("#change_email_input").val().trim()

  if (Hue.change_email(uname, false)) {
    Hue.msg_info2.close()
  } else {
    alert("Invalid email format")
  }
}

// Username setter
Hue.set_username = function (uname) {
  Hue.username = uname
  Hue.generate_mentions_regex()
  $("#user_menu_username").text(Hue.username)
}

// Email setter
Hue.set_email = function (email) {
  Hue.user_email = email
}

// Bio setter
Hue.set_bio = function (bio) {
  Hue.bio = bio
  $("#user_menu_bio_textarea").val(Hue.bio)
}

// Setups the user menu
Hue.setup_user_menu = function () {
  $("#user_menu_profile_image").on("error", function () {
    if ($(this).attr("src") !== Hue.config.default_profile_image_url) {
      $(this).attr("src", Hue.config.default_profile_image_url)
    }
  })

  $("#user_menu_bio_textarea").blur(function () {
    let value = Hue.utilz.clean_string12($(this).val())

    if (value !== Hue.bio) {
      let result = Hue.change_bio(value)

      if (!result) {
        $(this).val(Hue.bio)
      } else {
        $(this).val(value)
      }
    } else {
      $(this).val(value)
    }
  })

  Hue.setup_togglers("user_menu")

  $("#user_menu_username").click(function () {
    Hue.show_change_username()
  })

  $("#user_menu_profile_image").click(function () {
    Hue.open_profile_image_picker()
  })

  $("#user_menu_audio_clip").click(function () {
    if (Hue.get_user_by_username("mad").audio_clip) {
      Hue.show_audio_clip_menu()
    } else {
      Hue.select_audio_clip()
    }
  })

  $("#user_menu_details").click(function () {
    Hue.show_details()
  })

  $("#user_menu_logout").click(function () {
    Hue.needs_confirm("logout")
  })

  $("#user_menu_highlights").click(function () {
    Hue.show_highlights()
  })

  $("#user_menu_settings").click(function () {
    Hue.show_settings()
  })

  $("#user_menu_change_username").click(function () {
    Hue.show_change_username()    
  })

  $("#user_menu_change_password").click(function () {
    Hue.show_change_password()    
  })

  $("#user_menu_change_email").click(function () {
    Hue.show_change_email()    
  })

  $("#user_menu_request_notifications").click(function () {
    Hue.request_desktop_notifications_permission()
  })
}

// Updates some user menu elements
Hue.update_user_menu = function () {
  $("#user_menu_profile_image").attr("src", Hue.profile_image)
  $("#user_menu_bio_textarea").val(Hue.bio)
}

// Shows the user menu
Hue.show_user_menu = function () {
  Hue.msg_user_menu.show()
}

// Send the code to verify email change
Hue.verify_email = function (code) {
  if (Hue.utilz.clean_string5(code) !== code) {
    Hue.feedback("Invalid code")
    return
  }

  if (code.length === 0) {
    Hue.feedback("Empty code")
    return
  }

  if (code.length > Hue.config.email_change_code_max_length) {
    Hue.feedback("Invalid code")
    return
  }

  Hue.socket_emit("verify_email", { code: code })
}

// Opens the profile image picker to change the profile image
Hue.open_profile_image_picker = function () {
  $("#profile_image_picker").click()
}

// Setups the profile image circular cropper
Hue.setup_profile_image_cropper = function () {
  $("#profile_image_cropper_upload").click(function () {
    Hue.profile_image_cropper
      .croppie("result", {
        type: "blob",
        size: {
          width: Hue.config.profile_image_diameter,
          height: Hue.config.profile_image_diameter,
        },
        format: "png",
        circle: true,
        quality: 0.95,
      })

      .then(function (blob) {
        $("#user_menu_profile_image").attr(
          "src",
          Hue.config.profile_image_loading_url
        )
        Hue.upload_file({
          file: blob,
          action: "profile_image_upload",
          name: "profile.png",
        })
        Hue.msg_profile_image_cropper.close()
      })
  })

  $("#profile_image_cropper_change").click(function () {
    Hue.open_profile_image_picker()
  })

  Hue.horizontal_separator.separate("profile_image_cropper_buttons")
}

// Resets the profile image cropper to default state
Hue.reset_profile_image_cropper = function () {
  if (Hue.profile_image_cropper && Hue.profile_image_cropper.croppie) {
    Hue.profile_image_cropper.croppie("destroy")
  }
}

// This is executed after a profile image has been selected in the file dialog
Hue.profile_image_selected = function (input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader()

    reader.onload = function (e) {
      Hue.reset_profile_image_cropper()

      Hue.msg_profile_image_cropper.show(function () {
        $("#profile_image_picker").closest("form").get(0).reset()

        Hue.profile_image_cropper = $("#profile_image_cropper").croppie({
          viewport: {
            width: 200,
            height: 200,
            type: "circle",
          },
          boundary: { width: 350, height: 350 },
        })

        Hue.profile_image_cropper
          .croppie("bind", {
            url: e.target.result,
            points: [],
          })

          .then(function () {
            Hue.profile_image_cropper.croppie("setZoom", 0)
          })
      })
    }

    reader.readAsDataURL(input.files[0])
  }
}

// Feedback that the user is not an operator
Hue.not_an_op = function () {
  Hue.feedback("You are not a room operator")
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
  Hue.feedback(`You joined ${Hue.room_name}`, {})
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

  Hue.feedback(s)
}

// Shows some options for the audio clip
Hue.show_audio_clip_menu = function () {
  Hue.msg_info2.show(["Audio Clip", Hue.template_audio_clip_menu()], function () {
    $("#upload_audio_clip").click(function () {
      Hue.select_audio_clip()
      Hue.msg_info2.close()
    })

    $("#remove_audio_clip").click(function () {
      Hue.needs_confirm_2(function () {
        Hue.socket_emit("remove_audio_clip", {})
        Hue.msg_info2.close()
      })
    })

    Hue.horizontal_separator.separate("background_image_select_container")
  })
}

// Opens the file picker to choose an audio clip
Hue.select_audio_clip = function () {
  $("#audio_clip_picker").click()
}

// When an audio clip gets selected from the file picker
Hue.audio_clip_selected = function (input) {
  let file = input.files[0]
  let size = file.size / 1024

  if (size > Hue.config.max_audio_clip_size) {
    Hue.msg_info.show("File is too big")
    return false
  }

  Hue.upload_file({ file: file, action: "audio_clip_upload" })
}
