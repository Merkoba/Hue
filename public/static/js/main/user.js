// Logs out the user
Hue.logout = function()
{
    Hue.goto_url('/logout')
}

// Changes the user's username
Hue.change_username = function(uname, show_feedback=true)
{
    if(Hue.utilz.clean_string4(uname) !== uname)
    {
        if(show_feedback)
        {
            Hue.feedback("Username contains invalid characters")
        }

        return false
    }

    if(uname.length === 0)
    {
        if(show_feedback)
        {
            Hue.feedback("Username can't be empty")
        }

        return false
    }

    if(uname.length > Hue.config.max_username_length)
    {
        if(show_feedback)
        {
            Hue.feedback("Username is too long")
        }

        return false
    }

    if(uname === Hue.username)
    {
        if(show_feedback)
        {
            Hue.feedback("That's already your username")
        }

        return false
    }

    Hue.socket_emit("change_username", {username:uname})

    return true
}

// Changes the user's password
Hue.change_password = function(passwd, show_feedback=true)
{
    if(passwd.length < Hue.config.min_password_length)
    {
        if(show_feedback)
        {
            Hue.feedback(`Password is too short. It must be at least ${Hue.config.min_password_length} characters long`)
        }

        return false
    }

    if(passwd.length > Hue.config.max_password_length)
    {
        if(show_feedback)
        {
            Hue.feedback("Password is too long")
        }

        return false
    }

    Hue.socket_emit("change_password", {password:passwd})

    return true
}

// Feedback on password change
Hue.password_changed = function(data)
{
    Hue.feedback(`Password succesfully changed to ${data.password}. To force other clients connected to your account to disconnect you can use /disconnectothers`)
}

// Changes the user's email
Hue.change_email = function(email, show_feedback=true)
{
    if(Hue.utilz.clean_string5(email) !== email)
    {
        if(show_feedback)
        {
            Hue.feedback("Invalid email address")
        }

        return false
    }

    if(email.length === 0)
    {
        if(show_feedback)
        {
            Hue.feedback("Username can't be empty")
        }

        return false
    }

    if(!email.includes('@'))
    {
        if(show_feedback)
        {
            Hue.feedback("Invalid email address")
        }

        return false
    }

    if(email.length > Hue.config.max_email_length)
    {
        if(show_feedback)
        {
            Hue.feedback("Email is too long")
        }

        return false
    }

    Hue.socket_emit("change_email", {email:email})

    return true
}

// Feedback on email change
Hue.email_changed = function(data)
{
    Hue.set_email(data.email)
    Hue.feedback(`Email succesfully changed to ${data.email}`)
}

// Changes the user's bio
Hue.change_bio = function(value)
{
    if(value !== Hue.utilz.clean_string12(value))
    {
        return false
    }

    if(value === Hue.bio)
    {
        return false
    }

    if(value.length > Hue.config.max_bio_length)
    {
        return false
    }

    if(value.split("\n").length > Hue.config.max_bio_lines)
    {
        return false
    }

    Hue.socket_emit("change_bio", {bio:value})

    return true
}

// Setups the user details window
Hue.build_details = function()
{
    $("#details_username").text(Hue.username)
    $("#details_email").text(Hue.user_email)

    let s = `<div>${Hue.utilz.nice_date(Hue.user_reg_date)}</div>
    </div>(${Hue.get_timeago(Hue.user_reg_date)})</div>`

    $("#details_reg_date").html(s)

    s = `<div>${Hue.utilz.nice_date(Hue.date_joined)}</div>
    </div>(${Hue.get_timeago(Hue.date_joined)})</div>`

    $("#details_joined_room").html(s)
}

// Shows the user's details window
Hue.show_details = function(data)
{
    Hue.build_details()
    Hue.msg_details.show()
}

// Shows the change username form
Hue.show_change_username = function()
{
    let s = `
    <input type='text' placeholder='New Username' id='change_username_input' class='nice_input_2'>
    <div class='flex_row_center'>
        <div class='action pointer bigger unselectable details_change_submit' id='change_username_submit'>Change</div>
    </div>`

    Hue.msg_info2.show(["Change Username", s], function()
    {
        $("#change_username_input").val(Hue.username)
        $("#change_username_input").focus()

        $("#change_username_submit").click(function()
        {
            Hue.submit_change_username()
        })

        Hue.change_user_username_open = true
    })
}

// Submits the change username form
Hue.submit_change_username = function()
{
    let uname = $("#change_username_input").val().trim()

    if(Hue.change_username(uname, false))
    {
        Hue.msg_info2.close()
    }

    else
    {
        alert("Invalid username format")
    }
}

// Shows the change password form
Hue.show_change_password = function()
{
    let s = `
    <input type='password' placeholder='New Password' id='change_password_input' class='nice_input_2'>
    <div class='flex_row_center'>
        <div class='action pointer bigger unselectable details_change_submit' id='change_password_submit'>Change</div>
    </div>`

    Hue.msg_info2.show(["Change Password", s], function()
    {
        $("#change_password_input").focus()

        $("#change_password_submit").click(function()
        {
            Hue.submit_change_password()
        })

        Hue.change_user_password_open = true
    })
}

// Submits the change password form
Hue.submit_change_password = function()
{
    let uname = $("#change_password_input").val().trim()

    if(Hue.change_password(uname, false))
    {
        Hue.msg_info2.close()
    }

    else
    {
        alert("Invalid password format")
    }
}

// Shows the change email form
Hue.show_change_email = function()
{
    let s = `
    <input type='text' placeholder='New Email' id='change_email_input' class='nice_input_2'>
    <div class='flex_row_center'>
        <div class='action pointer bigger unselectable details_change_submit' id='change_email_submit'>Change</div>
    </div>`

    Hue.msg_info2.show(["Change Email", s], function()
    {
        $("#change_email_input").focus()

        $("#change_email_submit").click(function()
        {
            Hue.submit_change_email()
        })

        Hue.change_user_email_open = true
    })
}

// Submits the change email form
Hue.submit_change_email = function()
{
    let uname = $("#change_email_input").val().trim()

    if(Hue.change_email(uname, false))
    {
        Hue.msg_info2.close()
    }

    else
    {
        alert("Invalid email format")
    }
}

// Username setter
Hue.set_username = function(uname)
{
    Hue.username = uname
    Hue.generate_mentions_regex()
    $("#user_menu_username").text(Hue.username)
}

// Email setter
Hue.set_email = function(email)
{
    Hue.user_email = email
}

// Bio setter
Hue.set_bio = function(bio)
{
    Hue.bio = bio
    $("#user_menu_bio_textarea").val(Hue.bio)
}

// Setups the user menu
Hue.setup_user_menu = function()
{
    $("#user_menu_profile_image").on("error", function()
    {
        if($(this).attr("src") !== Hue.config.default_profile_image_url)
        {
            $(this).attr("src", Hue.config.default_profile_image_url)
        }
    })

    $("#user_menu_profile_image").attr("src", Hue.profile_image)

    $("#user_menu_bio_textarea").val(Hue.bio)

    $("#user_menu_bio_textarea").blur(function()
    {
        let value = Hue.utilz.clean_string12($(this).val())
        
        if(value !== Hue.bio)
        {
            let result = Hue.change_bio(value)

            if(!result)
            {
                $(this).val(Hue.bio)
            }

            else
            {
                $(this).val(value)
            }
        }

        else
        {
            $(this).val(value)
        }
    })

    Hue.setup_togglers("user_menu")
}

// Shows the user menu
Hue.show_user_menu = function()
{
    clearTimeout(Hue.show_reactions_timeout)
    Hue.hide_reactions_box()
    Hue.msg_user_menu.show()
}

// Send the code to verify email change
Hue.verify_email = function(code)
{
    if(Hue.utilz.clean_string5(code) !== code)
    {
        Hue.feedback("Invalid code")
        return
    }

    if(code.length === 0)
    {
        Hue.feedback("Empty code")
        return
    }

    if(code.length > Hue.config.email_change_code_max_length)
    {
        Hue.feedback("Invalid code")
        return
    }

    Hue.socket_emit("verify_email", {code:code})
}

// Opens the profile image picker to change the profile image
Hue.open_profile_image_picker = function()
{
    $("#profile_image_picker").click()
}

// This is executed after a profile image has been selected in the file dialog
Hue.profile_image_selected = function(input)
{
    if(input.files && input.files[0])
    {
        let reader = new FileReader()

        reader.onload = function(e)
        {
            let s = "<img id='profile_image_canvas_image'><div><div id='profile_image_canvas_button' class='action pointer unselectable'>Crop and Upload</div></div>"

            Hue.msg_info.show(s, function()
            {
                $('#profile_image_canvas_image').attr('src', e.target.result)

                $("#profile_image_picker").closest('form').get(0).reset()

                let image = $('#profile_image_canvas_image')[0]
                let button = $('#profile_image_canvas_button')[0]
                let croppable = false

                let cropper = new Cropper(image,
                {
                    aspectRatio: 1,
                    viewMode: 1,
                    ready: function()
                    {
                        let container_data = cropper.getContainerData()

                        cropper.setCropBoxData({width:container_data.width, height:container_data.height})

                        let cropbox_data = cropper.getCropBoxData()
                        let left = (container_data.width - cropbox_data.width) / 2
                        let top = (container_data.height - cropbox_data.height) / 2

                        cropper.setCropBoxData({left:left, right:top})

                        croppable = true
                    }
                })

                button.onclick = function()
                {
                    let cropped_canvas
                    let rounded_canvas

                    if(!croppable)
                    {
                        return
                    }

                    cropped_canvas = cropper.getCroppedCanvas()
                    rounded_canvas = Hue.get_rounded_canvas(cropped_canvas)

                    rounded_canvas.toBlob(function(file)
                    {
                        $("#user_menu_profile_image").attr("src", Hue.config.profile_image_loading_url)
                        Hue.upload_file({file:file, action:"profile_image_upload", name:"profile.png"})
                        Hue.msg_info.close()
                    }, 'image/png', 0.95)
                }
            })
        }

        reader.readAsDataURL(input.files[0])
    }
}

// Creates a rounded canvas for the profile image picker
Hue.get_rounded_canvas = function(sourceCanvas)
{
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')
    let width = Hue.config.profile_image_diameter
    let height = Hue.config.profile_image_diameter
    canvas.width = width
    canvas.height = height
    context.imageSmoothingEnabled = true
    context.drawImage(sourceCanvas, 0, 0, width, height)
    context.globalCompositeOperation = 'destination-in'
    context.beginPath()
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
    context.fill()
    return canvas
}

// Feedback that the user is not an operator
Hue.not_an_op = function()
{
    Hue.feedback("You are not a room operator")
}

// Checks if the user is joining for the first time
// This is site wide, not room wide
Hue.check_firstime = function()
{
    if(Hue.get_local_storage(Hue.ls_first_time) === null)
    {
        Hue.first_time = true
        Hue.show_intro()
        Hue.request_notifications_permission()
        Hue.save_local_storage(Hue.ls_first_time, false)
    }

    else
    {
        Hue.first_time = false
    }
}

// Shows a feedback message upon joining the room
Hue.show_joined = function()
{
    Hue.feedback(`You joined ${Hue.room_name}`, {save:true})
    Hue.show_topic()
}

// Disconnect other clients of the same account
Hue.disconnect_others = function()
{
    Hue.socket_emit("disconnect_others", {})
}

// Shows how many clients of the same account were disconnected
Hue.show_others_disconnected = function(data)
{
    let s

    if(data.amount === 1)
    {
        s = `${data.amount} client was disconnected`
    }

    else
    {
        s = `${data.amount} clients were disconnected`
    }

    Hue.feedback(s)
}

// Show an intro with popups when a user first joins the site
Hue.show_intro = function()
{
    let s = `
    You can chat in this area. The icon on the left opens the user menu where you can change your profile image and other settings.
    When someone is typing a message the user menu icon turns into a pencil. Hovering this icon shows additional actions.`

    Hue.create_popup({position:"bottomleft"}).show(["Chat and User Menu", s])

    s = `
    This area has media controls. You can use these to change the room's media or control what is displayed to you.`

    Hue.create_popup({position:"bottomright"}).show(["Media Controls", s])

    s = `
    This area contains the room menu, user list, voice chat, and radio controls. Above that there's the Activty Bar which shows users that have shown activity recently.`

    Hue.create_popup({position:"top"}).show(["Top Panel", s])

    s = `
    You can lock the screen in this corner.`

    Hue.create_popup({position:"topright"}).show(["Lock Screen", s])

    s = `
    Close this to close all the popups.`

    let f = () =>
    {
        Hue.close_all_popups()
    }

    Hue.create_popup({position:"topleft", after_close:f}).show(["Close Popups", s])

    s = `
    Please read all the popups.`

    Hue.create_popup({position:"center"}).show(["Welcome", s])
}