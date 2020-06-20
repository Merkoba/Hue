// Loads the Tone library and starts the synth
Hue.start_synth = async function(n)
{
    if(Hue.tone_loading)
    {
        return false
    }

    Hue.tone_loading = true

    await Hue.load_script("/static/js/libs2/Tone.js")

    Hue.synth = new Tone.Synth(
    {
        oscillator:
        {
            type : 'triangle8'
        },
            envelope : {
            attack : 2,
            decay : 1,
            sustain: 0.4,
            release: 4
        }
    }).toMaster()

    Hue.play_synth_key(n)
}

// Setups synth events
Hue.setup_synth = function()
{
    Hue.synth_voice = window.speechSynthesis

    $("#synth_container").on("mouseenter", function()
    {
        Hue.show_synth()
    })

    $("#synth_container").on("mouseleave", function()
    {
        Hue.hide_synth()
    })

    $("#synth_content").on("mousedown", ".synth_key", function()
    {
        $(this).addClass("synth_key_pressed")
    })

    $("#synth_content").on("mouseup mouseleave", ".synth_key", function()
    {
        $(this).removeClass("synth_key_pressed")
    })

    $("#synth_content").on("click", ".synth_key", function()
    {
        let key = $(this).attr("id").replace("synth_key_", "")
        Hue.send_synth_key(key)
    })

    $("#synth_content").on("auxclick", ".synth_key", function(e)
    {
        if(e.which === 2)
        {
            let key = $(this).attr("id").replace("synth_key_", "")
            Hue.play_speech(key)
        }
    })

    $("#synth_key_button_volume").click(function()
    {
        Hue.set_synth_muted()
    })

    $("#synth_key_button_volume").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            Hue.open_user_settings_category("synth")
        }
    })

    $("#synth_voice_input").on("focus", function()
    {
        Hue.synth_voice_input_focused = true
    })

    $("#synth_voice_input").on("blur", function()
    {
        Hue.synth_voice_input_focused = false

        if(!Hue.mouse_on_synth)
        {
            Hue.hide_synth(true)
        }
    })

    $(".synth_key").each(function()
    {
        let key = $(this).attr("id").replace("synth_key_", "")
        Hue.set_synth_key_title(key)
    })

    Hue.set_synth_muted(Hue.room_state.synth_muted)
}

// Sets the synth to muted or unmuted
// Updates the volume icon to reflect changes
Hue.set_synth_muted = function(what=undefined)
{
    let what2

    if(what === undefined)
    {
        Hue.room_state.synth_muted = !Hue.room_state.synth_muted
        what2 = Hue.room_state.synth_muted
    }

    else
    {
        what2 = what
    }

    if(what2)
    {
        $("#synth_volume_icon").removeClass("fa-volume-up")
        $("#synth_volume_icon").addClass("fa-volume-off")
        Hue.clear_synth_voice_queue()
    }

    else
    {
        $("#synth_volume_icon").removeClass("fa-volume-off")
        $("#synth_volume_icon").addClass("fa-volume-up")
    }

    Hue.save_room_state()
}

// Shows the synth
Hue.show_synth = function()
{
    if(Hue.can_synth && Hue.get_setting("synth_enabled"))
    {
        Hue.mouse_on_synth = true

        clearTimeout(Hue.synth_timeout_2)

        Hue.synth_timeout = setTimeout(function()
        {
            $("#synth_content_container").css("display", "flex")

            Hue.synth_open = true
        }, Hue.synth_timeout_delay)
    }
}

// Hides the synth
Hue.hide_synth = function(force=false)
{
    Hue.mouse_on_synth = false

    if(!force && Hue.synth_voice_input_focused)
    {
        return false
    }

    clearTimeout(Hue.synth_timeout)

    let delay = Hue.synth_timeout_delay

    if(force)
    {
        delay = 0
    }

    Hue.synth_timeout_2 = setTimeout(function()
    {
        $("#synth_content_container").css("display", "none")

        Hue.clear_synth_voice()
        Hue.synth_open = false
    }, delay)
}

// Sends a synth key to others
Hue.send_synth_key = function(key)
{
    if(!Hue.can_synth || Hue.room_state.synth_muted)
    {
        return false
    }

    key = parseInt(key)

    if(isNaN(key)) {
        return false
    }

    if(key < 1 || key > Hue.utilz.synth_notes.length)
    {
        return false
    }

    Hue.play_synth_key(key)
    Hue.socket_emit("send_synth_key", {key:key})
}

// Plays a synth key
Hue.play_synth_key = function(n)
{
    let key = Hue.utilz.synth_notes[n - 1]

    if(key)
    {
        if(Hue.synth === undefined)
        {
            Hue.start_synth(n)
            return false
        }

        Hue.synth.triggerAttackRelease(key, 0.1)
    }
}

// Plays a received synth key
Hue.receive_synth_key = function(data)
{
    if(!Hue.room_state.synth_muted && Hue.get_setting("synth_enabled"))
    {
        if(Hue.afk && Hue.get_setting("afk_disable_synth"))
        {
            return false
        }

        if(Hue.user_is_ignored(data.username))
        {
            return false
        }

        if(data.user_id !== Hue.user_id)
        {
            Hue.play_synth_key(data.key)
        }

        Hue.push_to_synth_recent_users(data, "key")
    }
}

// Adds a user to the synth recent users list
// This list is used to show a list of recent synth users,
// when hovering the volume icon
Hue.push_to_synth_recent_users = function(data, type)
{
    let changed = false
    let usernames = Hue.synth_recent_users.map(x => x.username)
    let obj = {username:data.username, type:type, date:Date.now()}

    if(!usernames.includes(data.username))
    {
        Hue.synth_recent_users.unshift(obj)
        changed = true
    }

    else
    {
        for(let i=0; i<usernames.length; i++)
        {
            let username = usernames[i]

            if(username === data.username)
            {
                Hue.synth_recent_users.splice(i, 1)
                break
            }
        }

        Hue.synth_recent_users.unshift(obj)
        changed = true
    }

    if(Hue.synth_recent_users.length > Hue.config.synth_max_recent_users)
    {
        Hue.synth_recent_users = Hue.synth_recent_users.slice(0, Hue.config.synth_max_recent_users)
        changed = true
    }

    if(changed)
    {
        let s = Hue.synth_recent_users.map(x => x.username).join(", ")
        $("#synth_key_button_volume").attr("title", s)
    }
}

// Sends a synth voice string to others
Hue.send_synth_voice = function(text=false)
{
    if(!Hue.can_synth || Hue.room_state.synth_muted)
    {
        return false
    }

    if(!text)
    {
        text = Hue.utilz.clean_string2($("#synth_voice_input").val())
    }

    if(text.length === 0 || text.length > Hue.config.synth_max_voice_text)
    {
        return false
    }

    Hue.clear_synth_voice()
    Hue.socket_emit("send_synth_voice", {text:text})
}

// Plays a received synth voice string
Hue.receive_synth_voice = function(data)
{
    if(!Hue.room_state.synth_muted && Hue.get_setting("synth_enabled"))
    {
        if(Hue.afk && Hue.get_setting("afk_disable_synth"))
        {
            return false
        }

        if(Hue.user_is_ignored(data.username))
        {
            return false
        }

        Hue.play_synth_voice(data.text, data.username)
        Hue.push_to_synth_recent_users(data, "voice")
    }
}

// Speaks a string message through speech synthesis
Hue.play_synth_voice = function(text, username, local=false)
{
    let speech = new SpeechSynthesisUtterance(text)

    if(!local)
    {
        speech.onstart = function()
        {
            Hue.show_voice_box(username, text)
        }

        speech.onend = function()
        {
            if(!Hue.synth_voice.pending && !Hue.synth_voice.speaking)
            {
                Hue.hide_voice_box()
                Hue.synth_voice_speeches = []
            }
        }
    }

    Hue.synth_voice.speak(speech)

    if(!local)
    {
        Hue.synth_voice_speeches.push(speech)
    }
}

// Empties the synth voice input
Hue.clear_synth_voice = function()
{
    $("#synth_voice_input").val("")
}

// Empties the speech synthesis queue
Hue.clear_synth_voice_queue = function()
{
    Hue.synth_voice.cancel()
}

// Updates hover title of synth keys using speech settings
Hue.set_synth_key_title = function(key)
{
    $(`#synth_key_${key}`).attr("title", Hue.get_setting(`speech_${key}`))
}

// Changes the room synth mode
Hue.change_room_synth_mode = function(what)
{
    if(!Hue.check_op_permission(Hue.role, "media"))
    {
        return false
    }

    let modes = ["enabled", "disabled"]

    if(!modes.includes(what))
    {
        Hue.feedback(`Valid synth modes: ${modes.join(" ")}`)
        return false
    }

    if(what === Hue.room_synth_mode)
    {
        Hue.feedback(`Synth mode is already set to that`)
        return false
    }

    Hue.socket_emit("change_synth_mode", {what:what})
}

// Announces room synth mode changes
Hue.announce_room_synth_mode_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the synth mode to ${data.what}`)
    Hue.set_room_synth_mode(data.what)
    Hue.check_media_permissions()
}

// Room synth mode setter
Hue.set_room_synth_mode = function(what)
{
    Hue.room_synth_mode = what
    Hue.config_admin_room_synth_mode()
}

// Plays saved speech
Hue.play_speech = function(key)
{
    if(isNaN(key))
    {
        return false
    }

    key = parseInt(key)

    if(key < 0 || key > Hue.utilz.synth_notes.length)
    {
        return false
    }

    let speech = Hue.get_setting(`speech_${key}`)

    Hue.send_synth_voice(speech)
}

// Shows a box with the username and message of the  current speech playing
Hue.show_voice_box = function(username, text)
{
    let h = $(`
    <div class='recent_voice_box_item'>
        <i class='fa fa-volume-up'></i>&nbsp;&nbsp;
        <div class='voice_box_username'></div>&nbsp;&nbsp;
        <div class='voice_box_message'></div>
    </div>`)

    let uname = h.find(".voice_box_username").eq(0)
    uname.text(`${username}:`)

    let message = h.find(".voice_box_message").eq(0)
    message.text(text)

    $("#recent_voice_box_content").html(h)
    $("#recent_voice_box").css("display", "flex")
}

// Hides the box with the username and message of the  current speech playing
Hue.hide_voice_box = function()
{
    $("#recent_voice_box").css("display", "none")
}

// Special function used for all Speech actions
Hue.setting_speech_do_action = function(number, type, save=true)
{
    let speech = Hue.utilz.clean_string2($(`#${type}_speech_${number}`).val())

    if(!speech)
    {
        speech = Hue.config[`global_settings_default_speech_${number}`]
    }

    $(`#${type}_speech_${number}`).val(speech)

    Hue[type][`speech_${number}`] = speech

    if(Hue.active_settings(`speech_${number}`) === type)
    {
        Hue.set_synth_key_title(number)
    }

    if(save)
    {
        Hue[`save_${type}`]()
    }
}