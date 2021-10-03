// Logs out the user
Hue.logout = function () {
  Hue.goto_url("/logout")
}

// Changes the user's username
Hue.change_username = function (uname) {
  if (Hue.utilz.clean_username(uname) !== uname) {
    Hue.checkmsg("Username contains invalid characters")
    return false
  }

  if (uname.length === 0) {
    Hue.checkmsg("Username can't be empty")
    return false
  }

  if (uname.length > Hue.config.max_username_length) {
    Hue.checkmsg("Username is too long")
    return false
  }

  if (uname === Hue.username) {
    Hue.checkmsg("That's already your username")
    return false
  }

  Hue.socket_emit("change_username", { username: uname })
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
Hue.password_changed = function (data) {
  Hue.checkmsg(
    `Password succesfully changed. To force other clients connected to your account to disconnect you can use ${Hue.config.commands_prefix}disconnectothers`
  )
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

  let s = `<div>${Hue.utilz.nice_date(Hue.user_reg_date)}</div>
    </div>(${Hue.utilz.timeago(Hue.user_reg_date)})</div>`

  $("#details_reg_date").html(s)

  s = `<div>${Hue.utilz.nice_date(Hue.date_joined)}</div>
    </div>(${Hue.utilz.timeago(Hue.date_joined)})</div>`

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
        <div class='action bigger details_change_submit' id='change_username_submit'>Change</div>
    </div>`

  Hue.msg_info2.show(["Change Username", s], function () {
    $("#change_username_input").val(Hue.username)
    $("#change_username_input").trigger("focus")

    $("#change_username_submit").on("click", function () {
      Hue.submit_change_username()
    })

    Hue.change_user_username_open = true
  })
}

// Submits the change username form
Hue.submit_change_username = function () {
  let uname = $("#change_username_input").val().trim()

  if (uname === Hue.username) {
    Hue.checkmsg("That's already the username")
    return
  }

  if (Hue.change_username(uname)) {
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
    $("#change_password_input_1").trigger("focus")

    $("#change_password_submit").on("click", function () {
      Hue.submit_change_password()
    })

    Hue.change_user_password_open = true
  })
}

// Submits the change password form
Hue.submit_change_password = function () {
  let p1 = $("#change_password_input_1").val().trim()
  let p2 = $("#change_password_input_2").val().trim()

  if (Hue.change_password(p1, p2)) {
    Hue.msg_info2.close()
  }
}

// Username setter
Hue.set_username = function (uname) {
  Hue.username = uname
  Hue.generate_mentions_regex()
  $("#user_menu_username").text(Hue.username)
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

  $("#user_menu_profile_image").on("click", function () {
    Hue.open_profile_image_picker()
  })

  $("#user_menu_audio_clip").on("click", function () {
    if (Hue.get_user_profile().audio_clip) {
      Hue.show_audio_clip_menu()
    } else {
      Hue.select_audio_clip()
    }
  })

  $("#user_menu_details").on("click", function () {
    Hue.show_details()
  })

  $("#user_menu_logout").on("click", function () {
    Hue.needs_confirm("logout")
  })

  $("#user_menu_settings").on("click", function () {
    Hue.show_settings()
  })

  $("#user_menu_change_username").on("click", function () {
    Hue.show_change_username()    
  })

  $("#user_menu_change_password").on("click", function () {
    Hue.show_change_password()    
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

// Opens the profile image picker to change the profile image
Hue.open_profile_image_picker = function () {
  $("#profile_image_picker").trigger("click")
}

// Setups the profile image circular cropper
Hue.setup_profile_image_cropper = function () {
  $("#profile_image_cropper_upload").on("click", function () {
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

  $("#profile_image_cropper_change").on("click", function () {
    Hue.open_profile_image_picker()
  })

  Hue.horizontal_separator($("#profile_image_cropper_buttons")[0])
}

// Resets the profile image cropper to default state
Hue.reset_profile_image_cropper = function () {
  if (Hue.profile_image_cropper && Hue.profile_image_cropper.croppie) {
    Hue.profile_image_cropper.croppie("destroy")
  }
}

// This is executed after a profile image has been selected in the file dialog
Hue.profile_image_selected = function (file) {
  if (!file) {
    return false
  }

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
Hue.show_audio_clip_menu = function () {
  Hue.msg_info2.show(["Audio Clip", Hue.template_audio_clip_menu()], function () {
    $("#upload_audio_clip").on("click", function () {
      Hue.select_audio_clip()
      Hue.msg_info2.close()
    })

    $("#remove_audio_clip").on("click", function () {
      Hue.needs_confirm_2(function () {
        Hue.socket_emit("remove_audio_clip", {})
        Hue.msg_info2.close()
      })
    })

    $("#play_audio_clip").on("click", function () {
      Hue.user_menu_audio = document.createElement("audio")
      Hue.user_menu_audio.src = Hue.get_user_profile().audio_clip
      Hue.user_menu_audio.play()
    })

    Hue.horizontal_separator($("#background_image_select_container")[0])
  })
}

// Opens the file picker to choose an audio clip
Hue.select_audio_clip = function () {
  $("#audio_clip_picker").trigger("click")
}

// When an audio clip gets selected from the file picker
Hue.audio_clip_selected = function (file) {
  if (!file) {
    return false
  }

  let size = file.size / 1024

  if (size > Hue.config.max_audio_clip_size) {
    Hue.checkmsg("File is too big")
    return false
  }

  Hue.upload_file({ file: file, action: "audio_clip_upload" })
}

// Get the user profile
Hue.get_user_profile = function () {
  return Hue.get_user_by_username(Hue.username)
}