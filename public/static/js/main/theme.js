// Setups theme and background variables from initial data
Hue.setup_theme_and_background = function(data)
{
    Hue.get_css_variables()
    Hue.set_background_image(data)

    Hue.theme_mode = data.theme_mode
    Hue.theme = data.theme
    Hue.background_mode = data.background_mode
    Hue.background_effect = data.background_effect
    Hue.background_tile_dimensions = data.background_tile_dimensions
    Hue.text_color_mode = data.text_color_mode
    Hue.text_color = data.text_color
}

// Sets an applies background images from data
Hue.set_background_image = function(data)
{
    if(data.background_image !== "")
    {
        Hue.background_image = data.background_image
    }

    else
    {
        Hue.background_image = Hue.config.default_background_image_url
    }

    Hue.background_image_setter = data.background_image_setter
    Hue.background_image_date = data.background_image_date
    Hue.apply_background()
    Hue.config_admin_background_image()
}

// Applies the background to all background elements
Hue.apply_background = function()
{
    let bg_image, bg_mode, bg_tile_dimensions
    let background_mode = Hue.get_setting("background_mode")
    let background_url = Hue.get_setting("background_url")
    let tile_dimensions = Hue.get_setting("background_tile_dimensions")

    if(background_mode === "room")
    {
        if(Hue.loaded_image.source && (Hue.background_mode === "mirror" || Hue.background_mode === "mirror_tiled"))
        {
            bg_image = Hue.loaded_image.source
        }
    
        else
        {
            bg_image = Hue.background_image
        }

        bg_mode = Hue.background_mode
        bg_tile_dimensions = Hue.background_tile_dimensions
    }

    else if(background_mode.startsWith("custom"))
    {
        if(!background_url)
        {
            $('.background_image').css('background-image', "none")
            return false
        }

        bg_image = background_url
        bg_mode = background_mode.replace("custom_", "")
        bg_tile_dimensions = tile_dimensions
    }

    if(Hue.background_image_enabled())
    {
        $('.background_image').css('background-image', `url('${bg_image}')`)
    }

    else
    {
        $('.background_image').css('background-image', "none")
    }

    if(bg_mode === "normal" || bg_mode === "mirror")
    {
        $('.background_image').each(function()
        {
            $(this).removeClass("background_image_tiled")
        })
    }

    else if(bg_mode === "tiled" || bg_mode === "mirror_tiled")
    {
        $('.background_image').each(function()
        {
            $(this).addClass("background_image_tiled")
        })
    }

    $('.background_image').each(function()
    {
        $(this).removeClass("background_image_blur")
        $(this).removeClass("background_image_grayscale")
        $(this).removeClass("background_image_saturate")
        $(this).removeClass("background_image_brightness")
    })

    if(Hue.background_effect === "blur" && bg_mode !== "solid")
    {
        $('.background_image').each(function()
        {
            $(this).addClass("background_image_blur")
        })
    }

    else if(Hue.background_effect === "grayscale" && bg_mode !== "solid")
    {
        $('.background_image').each(function()
        {
            $(this).addClass("background_image_grayscale")
        })
    }

    else if(Hue.background_effect === "saturate" && bg_mode !== "solid")
    {
        $('.background_image').each(function()
        {
            $(this).addClass("background_image_saturate")
        })
    }

    else if(Hue.background_effect === "brightness" && bg_mode !== "solid")
    {
        $('.background_image').each(function()
        {
            $(this).addClass("background_image_brightness")
        })
    }

    let css = `
    <style class='appended_background_style'>

    .background_image_tiled
    {
        background-size: ${bg_tile_dimensions} !important;
        background-repeat: repeat !important;
    }

    </style>
    `

    $(".appended_background_style").each(function()
    {
        $(this).remove()
    })

    $("head").append(css)
}

// Theme Mode setter
Hue.set_theme_mode = function(mode)
{
    Hue.theme_mode = mode
    Hue.config_admin_theme_mode()
}

// Theme setter
Hue.set_theme = function(color)
{
    Hue.theme = color
    Hue.apply_theme()
    Hue.config_admin_theme()
}

// This is where the color theme gets built and applied
// This builds CSS declarations based on the current theme color
// The CSS declarations are inserted into the DOM
// Older declarations get removed
Hue.apply_theme = function()
{
    let theme
    let theme_mode = Hue.get_setting("theme_mode")

    if(theme_mode === "room")
    {
        if(Hue.theme_mode === "automatic" && Hue.dominant_theme)
        {
            theme = Hue.dominant_theme
        }
    
        else
        {
            theme = Hue.theme
        }
    }

    else if(theme_mode === "custom")
    {
        theme = Hue.get_setting("theme_color")
    }

    if(theme.startsWith("#"))
    {
        theme = Hue.colorlib.array_to_rgb(Hue.colorlib.hex_to_rgb(theme))
    }

    let background_color = theme
    let background_color_2 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_1)

    let font_color

    if(theme_mode === "room")
    {
        if(Hue.text_color_mode === "custom")
        {
            font_color = Hue.text_color
        }
    
        else
        {
            font_color = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_2)
        }
    }

    else if(theme_mode === "custom")
    {
        font_color = Hue.get_setting("text_color")
    }
    
    let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, Hue.config.opacity_amount_1)
    let background_color_2_alpha = Hue.colorlib.rgb_to_rgba(background_color_2, Hue.config.opacity_amount_1)
    let background_color_a_2 = Hue.colorlib.rgb_to_rgba(background_color_2, Hue.config.opacity_amount_3)
    let color_3 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_3)
    let color_4 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_4)
    let color_4_a = Hue.colorlib.rgb_to_rgba(color_4, Hue.config.opacity_amount_3)
    let color_4_alpha = Hue.colorlib.rgb_to_rgba(color_4, Hue.config.opacity_amount_1)
    let overlay_color = Hue.colorlib.rgb_to_rgba(color_3, Hue.config.opacity_amount_3)
    let slight_background = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_5)
    let cfsize = Hue.get_setting("chat_font_size")

    $('.bg0').css('background-color', background_color)
    $('.bg1').css('background-color', background_color_a)
    $('.bg1').css('color', font_color)

    let panel_bg_color, activity_bar_background

    if(Hue.get_setting("transparent_panels"))
    {
        panel_bg_color = background_color_2_alpha
        activity_bar_background = color_4_alpha
    }

    else
    {
        panel_bg_color = background_color_2
        activity_bar_background = color_4
    }

    $('.panel').css('background-color', panel_bg_color)
    $('.panel').css('color', font_color)

    let topbox_background

    if(Hue.get_setting("activity_bar"))
    {
        topbox_background = color_4
    }

    else
    {
        topbox_background = background_color_2
    }

    if(cfsize === "very_small")
    {
        cfsize_factor = 0.5
    }

    else if(cfsize === "small")
    {
        cfsize_factor = 0.8
    }

    else if(cfsize === "normal")
    {
        cfsize_factor = 1
    }

    else if(cfsize === "big")
    {
        cfsize_factor = 1.2
    }

    else if(cfsize === "very_big")
    {
        cfsize_factor = 1.5
    }

    else
    {
        cfsize_factor = 1
    }

    let chat_font_size = `${cfsize_factor}rem`;
    let profile_image_size = `${parseInt(Hue.css_var_chat_profile_image_size) * cfsize_factor}px`

    let css = `
    <style class='appended_theme_style'>

    .Msg-overlay
    {
        background-color: ${overlay_color} !important;
        color: ${background_color} !important;
    }

    .Msg-window, .overlay_same_color
    {
        background-color: ${background_color} !important;
        color: ${font_color} !important;
    }

    .Msg-window-inner-x:hover
    {
        background-color: ${background_color_2} !important;
    }

    .custom_titlebar
    {
        background-color: ${background_color_2} !important;
        color: ${font_color} !important;
    }

    .titlebar_inner_x
    {
        background-color: ${background_color_2} !important;
    }

    .titlebar_inner_x:hover
    {
        background-color: ${background_color} !important;
    }

    .custom_popup
    {
        border: 1px solid ${font_color} !important;
    }

    #reactions_box_container
    {
        background-color: ${color_4} !important;
        color: ${font_color} !important;
    }

    .highlighted, .highlighted2, .highlighted3, .highlighted4
    {
        background-color: ${background_color_2} !important;
        color: ${font_color} !important;
    }

    .squaro
    {
        background-color: ${background_color_2} !important;
        color: ${font_color} !important;
    }

    .scroller
    {
        background-color: ${background_color_a_2} !important;
        color: ${font_color} !important;
    }

    .left_scroller
    {
        border-right: 1px ${color_4_a} solid !important;
    }

    .center_scroller
    {
        border-right: 1px ${color_4_a} solid !important;
    }

    .topbox_container
    {
        color: ${font_color} !important;
    }

    .draw_canvas
    {
        background-color: ${background_color_a_2} !important;
        color: ${font_color} !important;
    }

    .modal_icon_selected
    {
        background-color: ${background_color_a_2} !important;
        color: ${font_color} !important;
    }

    .settings_window_left
    {
        background-color: ${background_color_2} !important;
        color: ${font_color} !important;
    }

    .maxer
    {
        background-color: ${font_color} !important;
        color: ${font_color} !important;
    }

    .message
    {
        font-size: ${chat_font_size} !important;
    }

    .chat_profile_image_container
    {
        min-width: ${profile_image_size} !important;
        max-width: ${profile_image_size} !important;
        min-height: ${profile_image_size} !important;
        max-height: ${profile_image_size} !important;
    }

    .brk
    {
        min-width: ${profile_image_size} !important;
        max-width: ${profile_image_size} !important;
    }

    .chat_menu_button
    {
        background-color: ${background_color_2} !important;
    }

    .chat_menu_button
    {
        border-left: 1px solid ${slight_background} !important;
    }

    .chat_menu_button:hover
    {
        background-color: ${color_4} !important;
    }

    .chat_menu_button_main:hover, .chat_menu_button_main_selected
    {
        background-color: ${slight_background} !important;
    }

    #activity_bar_container
    {
        background-color: ${activity_bar_background} !important;
        color: ${font_color} !important;
    }

    .link_preview
    {
        background-color: ${color_4_a} !important;
        color: ${font_color} !important;
    }

    .message_edit_area
    {
        background-color: ${color_4_a} !important;
        color: ${font_color} !important;
    }

    .synth_key
    {
        background-color: ${color_4} !important;
        color: ${font_color} !important;
    }

    .synth_key_pressed
    {
        background-color: ${color_3} !important;
        color: ${font_color} !important;
    }

    .synth_key_button
    {
        background-color: ${color_3} !important;
        color: ${font_color} !important;
    }

    .synth_key_divider
    {
        background-color: ${slight_background} !important;
    }

    .spoiler
    {
        background-color: ${font_color} !important;
    }

    #input::placeholder
    {
        color: ${color_3} !important;
    }

    ::-webkit-scrollbar-thumb
    {
        background-color: ${slight_background} !important;
    }

    .Msg-container ::-webkit-scrollbar-thumb
    {
        background-color: ${color_4} !important;
    }

    body, html
    {
        scrollbar-color: ${slight_background} transparent !important;
    }

    .Msg-container
    {
        scrollbar-color: ${color_4} transparent !important;
    }

    .modal_subheader
    {
        background-color: ${color_4} !important;
    }

    #reply_text
    {
        background-color: ${slight_background} !important;
    }

    .slight_background
    {
        background-color: ${slight_background} !important;
    }

    .slight_color
    {
        color: ${slight_background} !important;
    }

    .color_3
    {
        color: ${color_3} !important;
    }

    #user_menu_bio_textarea
    {
        background-color: ${slight_background} !important;
        color: ${font_color} !important;
    }

    #user_menu_bio_textarea::placeholder
    {
        color: ${color_3} !important;
    }

    .vertical_separator
    {
        color: ${color_4} !important;
    }

    .room_menu_toggle_container 
    {
        background-color: ${slight_background} !important;
    }

    .topbox
    {
        background-color: ${topbox_background} !important;
        color: ${font_color} !important;
    }

    </style>
    `

    $(".appended_theme_style").each(function()
    {
        $(this).remove()
    })

    $("head").append(css)
}

// Changes the theme mode
Hue.change_theme_mode = function(mode)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(
        mode !== "automatic" &&
        mode !== "custom")
    {
        Hue.feedback("Invalid theme mode")
        return false
    }

    if(mode === Hue.theme_mode)
    {
        Hue.feedback(`Theme mode is already ${Hue.theme_mode}`)
        return false
    }

    Hue.socket_emit("change_theme_mode", {mode:mode})
}

// Changes the theme
Hue.change_theme = function(color)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    color = Hue.utilz.clean_string5(color).toLowerCase()

    if(color === undefined)
    {
        return false
    }

    if(!Hue.utilz.validate_hex(color))
    {
        Hue.feedback("Not a valid hex color value")
        return false
    }

    if(color === Hue.theme)
    {
        Hue.feedback("Theme is already set to that")
        return false
    }

    Hue.socket_emit("change_theme", {color:color})
}

// Announces theme mode change
Hue.announce_theme_mode_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the theme mode to ${data.mode}`)
    Hue.set_theme_mode(data.mode)
    Hue.apply_theme()
}

// Announces theme change
Hue.announce_theme_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the theme to ${data.color}`)
    Hue.set_theme(data.color)
}

// Picker window to select how to change the background image
Hue.open_background_image_select = function()
{
    Hue.msg_info2.show(["Change Background Image", Hue.template_background_image_select()])
    Hue.horizontal_separator.separate("background_image_select_container")
}

// If upload is chosen as the method to change the background image
// the file dialog is opened
Hue.open_background_image_picker = function()
{
    Hue.msg_info2.close()

    $("#background_image_input").click()
}

// If a URL source is chosen as the method to change the background image
// this window is opened
Hue.open_background_image_input = function()
{
    Hue.msg_info2.show(["Change Background Image", Hue.template_background_image_input()], function()
    {
        $("#background_image_input_text").focus()
        Hue.background_image_input_open = true
    })
}

// On background image source input change
Hue.background_image_input_action = function()
{
    let src = $("#background_image_input_text").val().trim()

    if(Hue.change_background_image_source(src))
    {
        Hue.msg_info2.close()
    }
}

// On background image selected for upload
Hue.background_image_selected = function(input)
{
    let file = input.files[0]
    let size = file.size / 1024

    $("#background_image_input").closest('form').get(0).reset()

    if(size > Hue.config.max_image_size)
    {
        Hue.msg_info.show("File is too big")
        return false
    }

    $("#admin_background_image").attr("src", Hue.config.background_image_loading_url)

    Hue.upload_file({file:file, action:"background_image_upload"})
}

// Change the background image with a URL
Hue.change_background_image_source = function(src)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(src === undefined)
    {
        return false
    }

    if(src !== "default")
    {
        if(!Hue.utilz.is_url(src))
        {
            return false
        }

        src = src.replace(/\.gifv/g, '.gif')

        if(src === Hue.background_image)
        {
            Hue.feedback("Background image is already set to that")
            return false
        }

        if(src.length === 0)
        {
            return false
        }

        if(src.length > Hue.config.max_image_source_length)
        {
            return false
        }

        let extension = Hue.utilz.get_extension(src).toLowerCase()

        if(!extension || !Hue.utilz.image_extensions.includes(extension))
        {
            return false
        }
    }

    else
    {
        if(Hue.background_image === Hue.config.default_background_image_url)
        {
            Hue.feedback("Background image is already set to that")
            return false
        }
    }

    Hue.socket_emit("change_background_image_source", {src:src})

    return true
}

// Announces background image changes
Hue.announce_background_image_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the background image`)
    Hue.set_background_image(data)
}

// Changes the background mode
Hue.change_background_mode = function(mode)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(
        mode !== "normal" &&
        mode !== "tiled" &&
        mode !== "mirror" &&
        mode !== "mirror_tiled" &&
        mode !== "solid")
    {
        Hue.feedback("Invalid background mode")
        return false
    }

    if(mode === Hue.background_mode)
    {
        Hue.feedback(`Background mode is already ${Hue.background_mode}`)
        return false
    }

    Hue.socket_emit("change_background_mode", {mode:mode})
}

// Announces background mode changes
Hue.announce_background_mode_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the background mode to ${data.mode}`)
    Hue.set_background_mode(data.mode)
}

// Changes background tile dimensions
Hue.change_background_tile_dimensions = function(dimensions)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(dimensions.length > Hue.config.safe_limit_1)
    {
        return false
    }

    dimensions = Hue.utilz.clean_string2(dimensions)

    if(dimensions.length === 0)
    {
        return false
    }

    if(dimensions === Hue.background_tile_dimensions)
    {
        return false
    }

    Hue.socket_emit("change_background_tile_dimensions", {dimensions:dimensions})
}

// Announces background tile dimensions changes
Hue.announce_background_tile_dimensions_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the background tile dimensions to ${data.dimensions}`)
    Hue.set_background_tile_dimensions(data.dimensions)
    Hue.apply_background()
}

// Check whether a background image should be enabled,
// depending on the background mode and settings
Hue.background_image_enabled = function()
{
    let background_mode = Hue.get_setting("background_mode")

    if(background_mode === "room")
    {
        if(Hue.background_mode === "solid")
        {
            return false
        }
    
        if(Hue.background_mode === "mirror" || Hue.background_mode === "mirror_tiled")
        {
            if(Hue.room_images_mode === "disabled")
            {
                return false
            }
        }
    }

    else
    {
        if(background_mode === "custom_solid")
        {
            return false
        }
    }

    return true
}

// Changes the background effect
Hue.change_background_effect = function(effect)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if
    (
        effect !== "none" &&
        effect !== "blur" &&
        effect !== "grayscale" &&
        effect !== "saturate" &&
        effect !== "brightness"
    )
    {
        Hue.feedback("Invalid background effect")
        return false
    }

    if(effect === Hue.background_effect)
    {
        Hue.feedback(`Background effect is already ${Hue.background_effect}`)
        return false
    }

    Hue.socket_emit("change_background_effect", {effect:effect})
}

// Announces background effect changes
Hue.announce_background_effect_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the background effect to ${data.effect}`)
    Hue.set_background_effect(data.effect)
}

// Background mode setter
Hue.set_background_mode = function(what)
{
    Hue.background_mode = what
    Hue.config_admin_background_mode()
    Hue.apply_background()
}

// Background effect setter
Hue.set_background_effect = function(what)
{
    Hue.background_effect = what
    Hue.config_admin_background_effect()
    Hue.apply_background()
}

// Background tile dimensions setter
Hue.set_background_tile_dimensions = function(dimensions)
{
    Hue.background_tile_dimensions = dimensions
    Hue.config_admin_background_tile_dimensions()
}

// Changes the text color mode
Hue.change_text_color_mode = function(mode)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(mode !== "automatic" && mode !== "custom")
    {
        Hue.feedback("Invalid text color mode")
        return false
    }

    if(mode === Hue.text_color_mode)
    {
        Hue.feedback(`Text color mode is already ${Hue.text_color_mode}`)
        return false
    }

    Hue.socket_emit("change_text_color_mode", {mode:mode})
}

// Announces text color mode changes
Hue.announce_text_color_mode_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the text color mode to ${data.mode}`)
    Hue.set_text_color_mode(data.mode)
    Hue.apply_theme()
}

// Text color mode setter
Hue.set_text_color_mode = function(mode)
{
    Hue.text_color_mode = mode
    Hue.config_admin_text_color_mode()
}

// Changes the text color
Hue.change_text_color = function(color)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    color = Hue.utilz.clean_string5(color).toLowerCase()

    if(color === undefined)
    {
        return false
    }

    if(!Hue.utilz.validate_hex(color))
    {
        Hue.feedback("Not a valid hex color value")
        return false
    }

    if(color === Hue.text_color)
    {
        Hue.feedback("Text color is already set to that")
        return false
    }

    Hue.socket_emit("change_text_color", {color:color})
}

// Announces text color changes
Hue.announce_text_color_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the text color to ${data.color}`)
    Hue.set_text_color(data.color)
    Hue.apply_theme()
}

// Text color setter
Hue.set_text_color = function(color)
{
    Hue.text_color = color
    Hue.config_admin_text_color()
}

// Get declared CSS variables
Hue.get_css_variables = function()
{
    let style = getComputedStyle(document.body)
    Hue.css_var_panel_height = style.getPropertyValue("--panel-height")
    Hue.css_var_panel_height_double = style.getPropertyValue("--panel-height-double")
    Hue.css_var_chat_profile_image_size = style.getPropertyValue("--chat-profile-image-size")
}