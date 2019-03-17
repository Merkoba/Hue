// Builds the permission sections of the main menu through their template
Hue.make_main_menu_permissions_container = function()
{
    let s = ""

    for(let i=1; i<Hue.vtypes.length + 1; i++)
    {
        s += Hue.template_main_menu_permissions_container({number:i})
    }

    return s
}

// Setups change events for the main menu widgets
Hue.setup_main_menu = function()
{
    Hue.setup_togglers("main_menu")

    $(".admin_voice_permissions_checkbox").each(function()
    {
        $(this).change(function()
        {
            let what = $(this).prop("checked")

            Hue.change_voice_permission($(this).data("ptype"), what)
        })
    })

    $('#admin_enable_images').change(function()
    {
        let what = $('#admin_enable_images option:selected').val()

        Hue.change_room_images_mode(what)
    })

    $('#admin_enable_tv').change(function()
    {
        let what = $('#admin_enable_tv option:selected').val()

        Hue.change_room_tv_mode(what)
    })

    $('#admin_enable_radio').change(function()
    {
        let what = $('#admin_enable_radio option:selected').val()

        Hue.change_room_radio_mode(what)
    })

    $('#admin_enable_synth').change(function()
    {
        let what = $('#admin_enable_synth option:selected').val()

        Hue.change_room_synth_mode(what)
    })

    $('#admin_privacy').change(function()
    {
        let what = JSON.parse($('#admin_privacy option:selected').val())

        Hue.change_privacy(what)
    })

    $('#admin_log').change(function()
    {
        let what = JSON.parse($('#admin_log option:selected').val())

        Hue.change_log(what)
    })

    $('#admin_theme_mode_select').change(function()
    {
        let what = $('#admin_theme_mode_select option:selected').val()

        Hue.change_theme_mode(what)
    })

    $("#admin_theme").spectrum(
    {
        preferredFormat: "rgb",
        color: "#B5599A",
        appendTo: "#admin_menu",
        showInput: true,
        clickoutFiresChange: false,
        change: function(color)
        {
            Hue.change_theme(color.toRgbString())
        }
    })

    $('#admin_background_mode_select').change(function()
    {
        let what = $('#admin_background_mode_select option:selected').val()

        Hue.change_background_mode(what)
    })

    $('#admin_background_effect_select').change(function()
    {
        let what = $('#admin_background_effect_select option:selected').val()

        Hue.change_background_effect(what)
    })

    $("#admin_background_tile_dimensions").blur(function()
    {
        let what = Hue.utilz.clean_string2($(this).val())

        if(what === "")
        {
            $("#admin_background_tile_dimensions").val(Hue.background_tile_dimensions)
            return false
        }

        Hue.change_background_tile_dimensions(what)
    })

    $('#admin_text_color_mode_select').change(function()
    {
        let what = $('#admin_text_color_mode_select option:selected').val()

        Hue.change_text_color_mode(what)
    })

    $("#admin_text_color").spectrum(
    {
        preferredFormat: "rgb",
        color: "#B5599A",
        appendTo: "#admin_menu",
        showInput: true,
        clickoutFiresChange: false,
        change: function(color)
        {
            Hue.change_text_color(color.toRgbString())
        }
    })

    $('#admin_room_name').blur(function()
    {
        let name = Hue.utilz.clean_string2($(this).val())

        if(name === "")
        {
            $("#admin_room_name").val(Hue.room_name)
            return false
        }

        if(name !== Hue.room_name)
        {
            Hue.change_room_name(name)
        }
    })

    $('#admin_topic').blur(function()
    {
        let t = Hue.utilz.clean_string2($(this).val())

        if(t === "")
        {
            $("#admin_topic").val(Hue.topic)
            return false
        }

        if(t !== Hue.topic)
        {
            Hue.change_topic(t)
        }
    })

    $('#admin_background_image').on("error", function()
    {
        if($(this).attr("src") !== Hue.config.background_image_loading_url)
        {
            $(this).attr("src", Hue.config.background_image_loading_url)
        }
    })
}

// Shows the main menu
Hue.show_main_menu = function()
{
    Hue.msg_main_menu.show()
}

// Configures the main menu
// Updates all widgets with current state
Hue.config_main_menu = function()
{
    if(Hue.is_admin_or_op())
    {
        Hue.config_admin_permission_checkboxes()
        Hue.config_admin_room_images_mode()
        Hue.config_admin_room_tv_mode()
        Hue.config_admin_room_radio_mode()
        Hue.config_admin_room_synth_mode()
        Hue.config_admin_privacy()
        Hue.config_admin_log_enabled()
        Hue.config_admin_theme_mode()
        Hue.config_admin_theme()
        Hue.config_admin_background_mode()
        Hue.config_admin_background_effect()
        Hue.config_admin_background_tile_dimensions()
        Hue.config_admin_background_image()
        Hue.config_admin_text_color_mode()
        Hue.config_admin_text_color()
        Hue.config_admin_room_name()
        Hue.config_admin_topic()

        $("#admin_menu").css("display", "block")
    }

    else
    {
        $("#admin_menu").css("display", "none")
    }
}

// Checks or unchecks main menu voice permission checkboxes based on current state
Hue.config_admin_permission_checkboxes = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $(".admin_voice_permissions_checkbox").each(function()
    {
        $(this).prop("checked", Hue[$(this).data("ptype")])
    })
}

// Updates the background widgets in the main menu based on current state
Hue.config_admin_background_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_background_mode_select').find('option').each(function()
    {
        if($(this).val() === Hue.background_mode)
        {
            $(this).prop('selected', true)
        }
    })

    $('#admin_background_effect_select').find('option').each(function()
    {
        if($(this).val() === Hue.background_effect)
        {
            $(this).prop('selected', true)
        }
    })

    if(Hue.background_mode === "normal")
    {
        $("#admin_background_tile_dimensions_container").css("display", "none")
        $("#admin_background_image_container").css("display", "block")
        $("#admin_background_effect_container").css("display", "block")
    }

    else if(Hue.background_mode === "tiled")
    {
        $("#admin_background_tile_dimensions_container").css("display", "block")
        $("#admin_background_image_container").css("display", "block")
        $("#admin_background_effect_container").css("display", "block")
    }

    else if(Hue.background_mode === "mirror")
    {
        $("#admin_background_tile_dimensions_container").css("display", "none")
        $("#admin_background_image_container").css("display", "none")
        $("#admin_background_effect_container").css("display", "block")
    }

    else if(Hue.background_mode === "mirror_tiled")
    {
        $("#admin_background_tile_dimensions_container").css("display", "block")
        $("#admin_background_image_container").css("display", "none")
        $("#admin_background_effect_container").css("display", "block")
    }

    else if(Hue.background_mode === "solid")
    {
        $("#admin_background_tile_dimensions_container").css("display", "none")
        $("#admin_background_image_container").css("display", "none")
        $("#admin_background_effect_container").css("display", "none")
    }
}

// Updates background tile dimension widget in the main menu based on current state
Hue.config_admin_background_tile_dimensions = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_background_tile_dimensions').val(Hue.background_tile_dimensions)
}

// Updates the background image widget in the main menu based on current state
Hue.config_admin_background_image = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    if(Hue.background_image !== $("#admin_background_image").attr('src'))
    {
        if(Hue.background_image !== "")
        {
            $("#admin_background_image").attr("src", Hue.background_image)
        }

        else
        {
            $("#admin_background_image").attr("src", Hue.config.default_background_image_url)
        }
    }

    if(Hue.background_image_setter)
    {
        let s = `Setter: ${Hue.background_image_setter}`

        if(Hue.background_image_date)
        {
            s += ` | ${Hue.utilz.nice_date(Hue.background_image_date)}`
        }

        $("#admin_background_image").attr("title", s)
    }
}

// Updates the background effect widget in the main menu based on current state
Hue.config_admin_background_effect = function()
{
    $('#admin_background_effect_select').find('option').each(function()
    {
        if($(this).val() === Hue.background_effect)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the text color mode widget in the main menu based on current state
Hue.config_admin_text_color_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_text_color_mode_select').find('option').each(function()
    {
        if($(this).val() === Hue.text_color_mode)
        {
            $(this).prop('selected', true)
        }
    })

    if(Hue.text_color_mode === "custom")
    {
        $("#admin_text_color_container").css("display", "block")
    }

    else
    {
        $("#admin_text_color_container").css("display", "none")
    }
}

// Updates the text color widget in the main menu based on current state
Hue.config_admin_text_color = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $("#admin_text_color").spectrum("set", Hue.text_color)
}

// Updates the privacy widget in the main menu based on current state
Hue.config_admin_privacy = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_privacy').find('option').each(function()
    {
        if(JSON.parse($(this).val()) === Hue.is_public)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the log enabled widget in the main menu based on current state
Hue.config_admin_log_enabled = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_log').find('option').each(function()
    {
        if(JSON.parse($(this).val()) === Hue.log_enabled)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the room images mode widget in the main menu based on current state
Hue.config_admin_room_images_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_enable_images').find('option').each(function()
    {
        if($(this).val() === Hue.room_images_mode)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the room tv mode widget in the main menu based on current state
Hue.config_admin_room_tv_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_enable_tv').find('option').each(function()
    {
        if($(this).val() === Hue.room_tv_mode)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the room radio mode widget in the main menu based on current state
Hue.config_admin_room_radio_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_enable_radio').find('option').each(function()
    {
        if($(this).val() === Hue.room_radio_mode)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the room synth mode widget in the main menu based on current state
Hue.config_admin_room_synth_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_enable_synth').find('option').each(function()
    {
        if($(this).val() === Hue.room_synth_mode)
        {
            $(this).prop('selected', true)
        }
    })
}

// Updates the theme mode widget in the main menu based on current state
Hue.config_admin_theme_mode = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $('#admin_theme_mode_select').find('option').each(function()
    {
        if($(this).val() === Hue.theme_mode)
        {
            $(this).prop('selected', true)
        }
    })

    if(Hue.theme_mode === "custom")
    {
        $("#admin_theme_mode_container").css("display", "block")
    }

    else
    {
        $("#admin_theme_mode_container").css("display", "none")
    }
}

// Updates the theme widget in the main menu based on current state
Hue.config_admin_theme = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $("#admin_theme").spectrum("set", Hue.theme)
}

// Updates the room name widget in the main menu based on current state
Hue.config_admin_room_name = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $("#admin_room_name").val(Hue.room_name)
}

// Updates the topic widget in the main menu based on current state
Hue.config_admin_topic = function()
{
    if(!Hue.is_admin_or_op())
    {
        return false
    }

    $("#admin_topic").val(Hue.topic)
}

// Toggles between the main menu and user menu when clicking the titlebar
Hue.toggle_menu_windows = function()
{
    let data = {}

    data["main_menu"] = function()
    {
        Hue.show_user_menu()
    }

    data["user_menu"] = function()
    {
        Hue.show_main_menu()
    }

    Hue.process_window_toggle(data)
}