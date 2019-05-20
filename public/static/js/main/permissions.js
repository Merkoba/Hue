// Changes a specified media permission to a specified voice
Hue.change_voice_permission = function(ptype, what)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(Hue[ptype] === undefined)
    {
        return false
    }

    if(what !== true && what !== false)
    {
        return false
    }

    if(Hue[ptype] === what)
    {
        Hue.feedback(`That permission is already set to that`)
        return false
    }

    Hue.socket_emit("change_voice_permission", {ptype:ptype, what:what})
}

// Announces voice permission changes
Hue.announce_voice_permission_change = function(data)
{
    let s 

    if(data.what)
    {
        s = `${data.username} set ${data.ptype} to true`
    }

    else
    {
        s = `${data.username} set ${data.ptype} to false`
    }

    Hue[data.ptype] = data.what
    Hue.show_room_notification(data.username, s)
    Hue.check_permissions()
    Hue.config_admin_permission_checkboxes()
}

// Handle the voice permission command
Hue.change_voice_permission_command = function(arg)
{
    let split = arg.split(" ")

    if(split.length !== 3)
    {
        return false
    }

    let num = split[0]
    let type = split[1]
    let value = split[2]
    let ptype = `voice${num}_${type}_permission`

    if(Hue[ptype] === undefined)
    {
        Hue.feedback("Invalid format")
        return false
    }

    if(value === "true" || value === "false")
    {
        value = JSON.parse(value)
    }

    else
    {
        Hue.feedback("Invalid value")
        return false
    }

    Hue.change_voice_permission(ptype, value)
}

// Setups permissions from initial data
Hue.start_permissions = function(data)
{
    Hue.voice1_chat_permission = data.voice1_chat_permission
    Hue.voice1_image_permission = data.voice1_image_permission
    Hue.voice1_tv_permission = data.voice1_tv_permission
    Hue.voice1_radio_permission = data.voice1_radio_permission
    Hue.voice1_synth_permission = data.voice1_synth_permission

    Hue.voice2_chat_permission = data.voice2_chat_permission
    Hue.voice2_image_permission = data.voice2_image_permission
    Hue.voice2_tv_permission = data.voice2_tv_permission
    Hue.voice2_radio_permission = data.voice2_radio_permission
    Hue.voice2_synth_permission = data.voice2_synth_permission

    Hue.voice3_chat_permission = data.voice3_chat_permission
    Hue.voice3_image_permission = data.voice3_image_permission
    Hue.voice3_tv_permission = data.voice3_tv_permission
    Hue.voice3_radio_permission = data.voice3_radio_permission
    Hue.voice3_synth_permission = data.voice3_synth_permission

    Hue.voice4_chat_permission = data.voice4_chat_permission
    Hue.voice4_image_permission = data.voice4_image_permission
    Hue.voice4_tv_permission = data.voice4_tv_permission
    Hue.voice4_radio_permission = data.voice4_radio_permission
    Hue.voice4_synth_permission = data.voice4_synth_permission
}

// Setups variables that determine if a user has permission to use certain media
Hue.check_permissions = function()
{
    Hue.can_chat = Hue.check_permission(Hue.role, "chat")
    Hue.can_image = Hue.room_image_mode === "enabled" && Hue.check_permission(Hue.role, "image")
    Hue.can_tv = Hue.room_tv_mode === "enabled" && Hue.check_permission(Hue.role, "tv")
    Hue.can_radio = Hue.room_radio_mode === "enabled" && Hue.check_permission(Hue.role, "radio")
    Hue.can_synth = Hue.room_synth_mode === "enabled" && Hue.check_permission(Hue.role, "synth")

    Hue.setup_footer_icons()
}

// Checks whether a user can use a specified media
Hue.check_permission = function(role=false, type=false)
{
    if(Hue.is_admin_or_op(role))
    {
        return true
    }

    if(role && type)
    {
        if(Hue[`${role}_${type}_permission`])
        {
            return true
        }
    }

    return false
}