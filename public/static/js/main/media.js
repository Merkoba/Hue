// What to do after pushing a new media changed item
Hue.after_push_media_change = function(type, data)
{
    if(Hue.show_media_history_type)
    {
        Hue.prepend_to_media_history(data.message_id)
    }
}

// Applies percentages changes to the chat and media elements based on current state
Hue.apply_media_percentages = function()
{
    let mode = Hue.get_setting("media_layout")
    let p1 = Hue.get_setting("tv_display_percentage")
    let p2 = (100 - p1)

    if(mode === "column")
    {
        $("#media_tv").css("height", `${p1}%`)
        $("#media_image").css("height", `${p2}%`)
        $("#media_tv").css("width", "100%")
        $("#media_image").css("width", "100%")
    }

    else if(mode === "row")
    {
        $("#media_tv").css("width", `${p1}%`)
        $("#media_image").css("width", `${p2}%`)
        $("#media_tv").css("height", "100%")
        $("#media_image").css("height", "100%")
    }

    let c1 = Hue.get_setting("chat_display_percentage")
    let c2 = (100 - c1)

    $("#chat_main").css("width", `${c1}%`)
    $("#media").css("width", `${c2}%`)

    Hue.on_resize()
}

// Applies the image and tv positions based on current state
Hue.apply_media_positions = function()
{
    let p = Hue.get_setting("tv_display_position")
    let tvp
    let ip

    if(p === "top")
    {
        tvp = 1
        ip = 2
    }

    else if(p === "bottom")
    {
        tvp = 2
        ip = 1
    }

    $("#media_image").css("order", ip)
    $("#media_tv").css("order", tvp)
}

Hue.swap_display_positions = function()
{
    let type = Hue.active_settings("tv_display_position")
    Hue[type].tv_display_position = Hue[type].tv_display_position === "top" ? "bottom" : "top"
    Hue[`save_${type}`]()
    Hue.apply_media_positions()
}

// Overrides the tv display position global setting automatically
// Toggles display positions of image and tv
Hue.swap_display_positions_2 = function()
{
    Hue.enable_setting_override("tv_display_position")
    Hue.swap_display_positions()
}

// Applies the positions of image and tv
Hue.arrange_media_setting_display_positions = function(type)
{
    let p = Hue[type].tv_display_position
    let tvo, imo

    if(p === "top")
    {
        tvo = 1
        imo = 2
    }

    else if(p === "bottom")
    {
        tvo = 2
        imo = 1
    }

    $(`#${type}_display_position_image`).css("order", imo)
    $(`#${type}_display_position_tv`).css("order", tvo)
}

// If the media menu is open the loaded media section is updated
Hue.check_media_menu_loaded_media = function()
{
    if(Hue.media_menu_open)
    {
        Hue.update_media_menu_loaded_media()
    }
}

// Updates the loaded media section of the media menu
Hue.update_media_menu_loaded_media = function()
{
    let obj = Hue.get_loaded_media_messages()

    for(let type of Hue.utilz.media_types)
    {
        if(obj[type])
        {
            $(`#media_menu_loaded_${type}`).html(obj[type])
        }

        else
        {
            $(`#media_menu_loaded_${type}`).html("")
        }
    }

    $("#media_menu_loaded_media").html()
}

// Shows the media menu
Hue.show_media_menu = function()
{
    Hue.update_media_menu_loaded_media()
    Hue.msg_media_menu.show()
}

// Hides the media menu
Hue.hide_media_menu = function()
{
    Hue.msg_media_menu.close()
}

// Stops the tv and radio
Hue.stop_media = function()
{
    Hue.stop_tv()
    Hue.stop_radio()
}

// Stops and locks all media (image, tv, radio)
Hue.stop_and_lock = function(stop=true)
{
    if(stop)
    {
        Hue.stop_media()
    }

    Hue.toggle_lock_image(true, false)
    Hue.toggle_lock_tv(true, false)
    Hue.toggle_lock_radio(true, false)

    Hue.save_room_state()
}

// Sets media locks and visibility to default states
Hue.default_media_state = function(change_visibility=true)
{
    if(Hue.room_state.image_locked !== Hue.config.room_state_default_image_locked)
    {
        Hue.toggle_lock_image(Hue.config.room_state_default_image_locked, false)
    }

    if(Hue.room_state.tv_locked !== Hue.config.room_state_default_tv_locked)
    {
        Hue.toggle_lock_tv(Hue.config.room_state_default_tv_locked, false)
    }

    if(Hue.room_state.radio_locked !== Hue.config.room_state_default_radio_locked)
    {
        Hue.toggle_lock_radio(Hue.config.room_state_default_radio_locked, false)
    }

    if(change_visibility)
    {
        if(Hue.room_state.image_enabled !== Hue.config.room_state_default_image_enabled)
        {
            Hue.toggle_image(Hue.config.room_state_default_image_enabled, false)
        }

        if(Hue.room_state.tv_enabled !== Hue.config.room_state_default_tv_enabled)
        {
            Hue.toggle_tv(Hue.config.room_state_default_tv_enabled, false)
        }

        if(Hue.room_state.radio_enabled !== Hue.config.room_state_default_radio_enabled)
        {
            Hue.toggle_radio(Hue.config.room_state_default_radio_enabled, false)
        }
    }

    Hue.save_room_state()
}

// Initial change for current media
Hue.start_active_media = function()
{
    Hue.change({type:"image"})
    Hue.change({type:"tv"})
    Hue.change({type:"radio"})

    Hue.first_media_change = true
}

// Mouse events for maxers
Hue.maxers_mouse_events = function()
{
    let f = function(e)
    {
        if(e.ctrlKey)
        {
            return false
        }

        if(!e.shiftKey)
        {
            return false
        }

        let maximized = false

        if(Hue.num_media_elements_visible() === 1)
        {
            maximized = true
        }

        let direction = e.deltaY > 0 ? 'down' : 'up'
        let el

        if(e.target.id === "media_image_maxer")
        {
            el = $("#media_image")[0]
        }

        else if(e.target.id === "media_tv_maxer")
        {
            el = $("#media_tv")[0]
        }

        else if(e.target.id === "footer_media_rotate_icon")
        {
            el = $("#media_tv")[0]
        }

        else
        {
            return false
        }

        if(direction === 'up')
        {
            if(maximized)
            {
                if(Hue.tv_is_maximized())
                {
                    let tv_pos = Hue.get_setting("tv_display_position")

                    if(tv_pos === "top")
                    {
                        Hue.do_media_tv_size_change(90)
                        Hue.unmaximize_media()
                    }

                    else
                    {
                        Hue.swap_display_positions_2()
                        Hue.do_media_tv_size_change(90)
                        Hue.unmaximize_media()
                    }
                }

                else if(Hue.image_is_maximized())
                {
                    let tv_pos = Hue.get_setting("tv_display_position")

                    if(tv_pos === "bottom")
                    {
                        Hue.do_media_tv_size_change(10)
                        Hue.unmaximize_media()
                    }

                    else
                    {
                        Hue.swap_display_positions_2()
                        Hue.do_media_tv_size_change(10)
                        Hue.unmaximize_media()
                    }
                }

                return
            }

            if(el.style.order == 1)
            {
                if(el.id === "media_tv")
                {
                    Hue.maxer_wheel_timer(Hue.decrease_tv_percentage)
                }

                else if(el.id === "media_image")
                {
                    Hue.maxer_wheel_timer(Hue.increase_tv_percentage)
                }
            }

            else if(el.style.order == 2)
            {
                if(el.id === "media_image")
                {
                    Hue.maxer_wheel_timer(Hue.decrease_tv_percentage)
                }

                else if(el.id === "media_tv")
                {
                    Hue.maxer_wheel_timer(Hue.increase_tv_percentage)
                }
            }
        }

        else if(direction === 'down')
        {
            if(maximized)
            {
                if(Hue.tv_is_maximized())
                {
                    let tv_pos = Hue.get_setting("tv_display_position")

                    if(tv_pos === "bottom")
                    {
                        Hue.do_media_tv_size_change(90)
                        Hue.unmaximize_media()
                    }

                    else
                    {
                        Hue.swap_display_positions_2()
                        Hue.do_media_tv_size_change(90)
                        Hue.unmaximize_media()
                    }
                }

                else if(Hue.image_is_maximized())
                {
                    let tv_pos = Hue.get_setting("tv_display_position")

                    if(tv_pos === "top")
                    {
                        Hue.do_media_tv_size_change(10)
                        Hue.unmaximize_media()
                    }

                    else
                    {
                        Hue.swap_display_positions_2()
                        Hue.do_media_tv_size_change(10)
                        Hue.unmaximize_media()
                    }
                }

                return
            }

            if(el.style.order == 1)
            {
                if(el.id === "media_tv")
                {
                    Hue.maxer_wheel_timer(Hue.increase_tv_percentage)
                }

                else if(el.id === "media_image")
                {
                    Hue.maxer_wheel_timer(Hue.decrease_tv_percentage)
                }
            }

            else if(el.style.order == 2)
            {
                if(el.id === "media_image")
                {
                    Hue.maxer_wheel_timer(Hue.increase_tv_percentage)
                }

                else if(el.id === "media_tv")
                {
                    Hue.maxer_wheel_timer(Hue.decrease_tv_percentage)
                }
            }
        }
    }

    $("#media_tv_maxer")[0].addEventListener("wheel", f)
    $("#media_image_maxer")[0].addEventListener("wheel", f)
    $("#footer_media_rotate")[0].addEventListener("wheel", f)

    let f2 = function(e)
    {
        if(e.ctrlKey)
        {
            return false
        }

        if(!e.shiftKey)
        {
            return false
        }

        let maximized = false

        if(Hue.num_media_elements_visible() === 0)
        {
            maximized = true
        }

        let direction = e.deltaY > 0 ? 'down' : 'up'

        if(direction === 'up')
        {
            if(maximized)
            {
                return
            }

            Hue.maxer_wheel_timer(Hue.increase_chat_percentage)
        }

        else if(direction === 'down')
        {
            if(maximized)
            {
                Hue.do_chat_size_change(90)
                Hue.show_media_items()
                return
            }

            Hue.maxer_wheel_timer(Hue.decrease_chat_percentage)
        }
    }

    $("#media_image_maxer")[0].addEventListener("mousedown", function(e)
    {
        e.preventDefault()
    })

    $("#media_image_maxer")[0].addEventListener("dblclick", function(e)
    {
        Hue.maximize_image()
    })

    $("#media_tv_maxer")[0].addEventListener("mousedown", function(e)
    {
        e.preventDefault()
    })

    $("#media_tv_maxer")[0].addEventListener("dblclick", function(e)
    {
        Hue.maximize_tv()
    })

    $("#chat_maxer")[0].addEventListener("wheel", f2)

    $("#chat_maxer")[0].addEventListener("mousedown", function(e)
    {
        e.preventDefault()
    })

    $("#chat_maxer")[0].addEventListener("dblclick", function(e)
    {
        Hue.toggle_media()
    })

    $("#media_image_maxer").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            Hue.unmaximize_media()
            Hue.set_default_tv_size()
        }
    })

    $("#media_tv_maxer").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            Hue.unmaximize_media()
            Hue.set_default_tv_size()
        }
    })

    $("#chat_maxer").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            Hue.set_default_chat_size()
            Hue.show_media_items()
        }
    })
}

// Sets the chat display percentage to default
Hue.set_default_chat_size = function()
{
    Hue.do_chat_size_change(Hue.config.global_settings_default_chat_display_percentage)
}

// If the image or tv is maximized it unmaximizes it so both are shown
Hue.unmaximize_media = function()
{
    if(Hue.tv_is_maximized())
    {
        Hue.maximize_tv()
    }

    else if(Hue.image_is_maximized())
    {
        Hue.maximize_image()
    }
}

// Gradually increases the chat display percentage
Hue.increase_chat_percentage = function()
{
    let size = parseInt(Hue.get_setting("chat_display_percentage"))
    size += 10
    size = Hue.utilz.round2(size, 10)
    Hue.enable_setting_override("chat_display_percentage")
    Hue.do_chat_size_change(size)
}

// Gradually decreases the chat display percentage
Hue.decrease_chat_percentage = function()
{
    let size = parseInt(Hue.get_setting("chat_display_percentage"))
    size -= 10
    size = Hue.utilz.round2(size, 10)
    Hue.enable_setting_override("chat_display_percentage")
    Hue.do_chat_size_change(size)
}

// Removes and item from a media changed array
Hue.remove_item_from_media_changed = function(type, id)
{
    Hue[`${type}_changed`] = Hue[`${type}_changed`].filter(x => x.id !== id)
}

// Tabs between media source and comment input on open pickers
// This is done because tab is disabled to avoid focus problems
Hue.do_media_picker_input_cycle = function(type)
{
    if(Hue.just_tabbed)
    {
        return false
    }

    if(document.activeElement === $(`#${type}_source_picker_input`)[0])
    {
        $(`#${type}_source_picker_input_comment`).focus()
    }

    else if(document.activeElement === $("#image_source_picker_input_comment")[0])
    {
        $(`#${type}_source_picker_input`).focus()
    }

    else
    {
        $(`#${type}_source_picker_input`).focus()
    }
}

// Checks how many elements (image, tv) are visible in the media section
Hue.num_media_elements_visible = function()
{
    let num = 0

    $("#media_split").children().each(function()
    {
        if($(this).css("display") !== "none")
        {
            num += 1
        }
    })

    return num
}

// Quickly unlocks and locks a media type
// This is to change to the current media item in some sort of valve fashion
Hue.media_lock_valve = function(type, e)
{
    if(e.which !== 2)
    {
        return false
    }

    if(!Hue.room_state[`${type}_locked`])
    {
        return false
    }

    Hue[`toggle_lock_${type}`]()
    Hue[`toggle_lock_${type}`]()
}

// Locally loads next item of its respective media changed list
Hue.media_load_next = function(type, just_check=false)
{
    if(Hue[`${type}_changed`].length < 2)
    {
        return false
    }

    let index = Hue[`${type}_changed`].indexOf(Hue[`loaded_${type}`])

    if(index < 0)
    {
        return false
    }

    if(index >= Hue[`${type}_changed`].length - 1)
    {
        return false
    }

    if(just_check)
    {
        return true
    }

    let item = Hue[`${type}_changed`][index + 1]
    Hue.change({type:type, item:item, force:true})
    Hue[`toggle_lock_${type}`](true)
}

// Locally loads previous item of its respective media changed list
Hue.media_load_previous = function(type, just_check=false)
{
    if(Hue[`${type}_changed`].length < 2)
    {
        return false
    }

    let index = Hue[`${type}_changed`].indexOf(Hue[`loaded_${type}`])

    if(index <= 0)
    {
        return false
    }

    if(just_check)
    {
        return true
    }

    let item = Hue[`${type}_changed`][index - 1]
    Hue.change({type:type, item:item, force:true})
    Hue[`toggle_lock_${type}`](true)
}

// Updates blinking media history items to reflect which is the current loaded item
Hue.update_media_history_blinks = function()
{
    if(!Hue.started || !Hue.show_media_history_type)
    {
        return false
    }

    let type = Hue.show_media_history_type
    let loaded = Hue[`loaded_${type}`]

    $(`#${type}_history_container`).find(".message").each(function()
    {
        $(this).removeClass("blinking_2")
    })

    if(!loaded)
    {

        $(`#${type}_history_container`).find(".message").first().addClass("blinking_2")
    }

    else
    {
        $(`#${type}_history_container .message_id_${loaded.message_id}`).eq(0).addClass("blinking_2")
    }
}

// Tries to separate a comment from a URL when using change media commands
// The proper way is to use '/image url > comment'
// But if the > is ommitted it will still try to determine what each part is
Hue.get_media_change_inline_comment = function(type, source)
{
    let comment = $(`#${type}_source_picker_input_comment`).val()

    if(comment)
    {
        // OK
    }

    else if(source.includes(">"))
    {
        let split = source.split(">")

        source = split[0].trim()
        comment = split.slice(1).join(">").trim()
    }

    else
    {
        let split = source.split(" ")
        let url = ""
        let cm = []

        for(let sp of split)
        {
            if(Hue.utilz.is_url(sp))
            {
                if(!url)
                {
                    url = sp
                }
            }

            else
            {
                cm.push(sp)
            }
        }

        if(url && cm.length > 0)
        {
            source = url
            comment = cm.join(" ")
        }
    }

    return {source:source, comment:comment}
}

// Creates a media object from initial data
// For instance it gets all the 'tv_*' properties
Hue.get_media_object_from_init_data = function(type)
{
    let obj = {}

    for(let key in Hue.init_data)
    {
        if(key.startsWith(`${type}_`))
        {
            obj[key.replace(`${type}_`, "")] = Hue.init_data[key]
        }
    }

    return obj
}

// Hides the media area (image and tv)
Hue.hide_media = function()
{
    Hue.stop_tv()

    $("#media").css("display", "none")
}

// Makes the media area visible or not visible
Hue.toggle_media = function()
{
    if(Hue.tv_visible || Hue.image_visible)
    {
        Hue.hide_media_items()
    }

    else
    {
        Hue.show_media_items()
    }
}

// Hides media items if visible
Hue.hide_media_items = function()
{
    if(Hue.tv_visible)
    {
        Hue.toggle_tv(false)
    }

    if(Hue.image_visible)
    {
        Hue.toggle_image(false)
    }
}

// If both are not visible it makes them visible
Hue.show_media_items = function()
{
    if(!Hue.tv_visible && !Hue.image_visible)
    {
        Hue.toggle_tv(true)
        Hue.toggle_image(true)
    }
}

// Setups media modes from initial data
Hue.setup_active_media = function(data)
{
    Hue.room_image_mode = data.room_image_mode
    Hue.room_tv_mode = data.room_tv_mode
    Hue.room_radio_mode = data.room_radio_mode
    Hue.room_synth_mode = data.room_synth_mode

    Hue.media_visibility_and_locks()
}

// Changes media visibility and locks based on current state
Hue.media_visibility_and_locks = function()
{
    Hue.change_image_visibility()
    Hue.change_tv_visibility(false)
    Hue.change_radio_visibility()

    Hue.change_lock_image()
    Hue.change_lock_tv()
    Hue.change_lock_radio()
}

// Resets media history filter of a certain type
Hue.reset_media_history_filter = function(type)
{
    $(`#${type}_history_filter`).val("")
    $(`#${type}_history_container`).html("")
    Hue.show_media_history_type = false
}

// Shows and/or filters media history of a certain type
Hue.show_media_history = function(type, filter=false)
{
    if(filter)
    {
        filter = filter.trim()
    }

    let sfilter = filter ? filter : ''

    $(`#${type}_history_container`).html("")
    $(`#${type}_history_filter`).val(sfilter)

    let clone = $($("#chat_area").children().get().reverse()).clone(true, true)

    clone.each(function()
    {
        $(this).removeAttr("id")
    })

    if(filter)
    {
        let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
        let words = lc_value.split(" ").filter(x => x.trim() !== "")

        clone = clone.filter(function()
        {
            let type2 = $(this).data("type")

            if(type2 !== `${type}_change`)
            {
                return false
            }

            let text = $(this).text().toLowerCase()
            return words.some(word => text.includes(word))
        })
    }

    else
    {
        clone = clone.filter(function()
        {
            let type2 = $(this).data("type")

            if(type2 !== `${type}_change`)
            {
                return false
            }

            return true
        })
    }

    clone.appendTo(`#${type}_history_container`)
    Hue.show_media_history_type = type
    Hue.update_media_history_blinks()

    Hue[`msg_${type}_history`].show(function()
    {
        Hue.scroll_modal_to_top(`${type}_history`)
    })
}

// Prepends media history items if the window is open
// This is used to update the windows on media changes
Hue.prepend_to_media_history = function(message_id)
{
    if(!Hue.started || !Hue.show_media_history_type)
    {
        return false
    }

    let type = Hue.show_media_history_type
    let el = $(`#chat_area > .message_id_${message_id}`).eq(0)
    let filter = $(`#${type}_history_filter`).val()

    if(filter)
    {
        let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
        let words = lc_value.split(" ").filter(x => x.trim() !== "")
        let text = el.text().toLowerCase()

        if(words.some(word => text.includes(word)))
        {
            $(`#${type}_history_container`).prepend(el)
        }
    }

    else
    {
        $(`#${type}_history_container`).prepend(el)
    }
}

// Additional media menu configurations
Hue.setup_media_menu = function()
{
    Hue.set_media_menu_radio_volume()
    Hue.set_media_menu_tv_volume()

    $("#media_menu_radio_volume").on("input change", function()
    {
        Hue.set_radio_volume(parseFloat(this.value), true, false)
    })

    $("#media_menu_tv_volume").on("input change", function()
    {
        Hue.set_tv_volume(parseFloat(this.value), true, false)
    })
}

// Format local sources that start with slash
Hue.get_proper_media_url = function(type)
{
    let source = Hue[`current_${type}`]().source

    if(source.startsWith("/"))
    {
        source = window.location.origin + source
    }

    return source
}

// Show the current source of a given media type
Hue.show_media_source = function(what)
{
    let source = Hue.get_proper_media_url(what)
    let current = Hue[`current_${what}`]()
    let setter = current.setter
    let date = current.nice_date
    let s

    if(what === "image")
    {
        s = "Image"
    }

    else if(what === "tv")
    {
        s = "TV"
    }

    else if(what === "radio")
    {
        s = "Radio"
    }

    if(setter !== '')
    {
        Hue.feedback(`${s} Source: ${source}`, {title:`Setter: ${setter} | ${date} | ${Hue.utilz.nice_date()}`})
    }

    else
    {
        Hue.feedback(`${s} Source: ${source}`)
    }
}

// More media picker configurations
Hue.setup_media_pickers = function()
{
    for(let type of Hue.utilz.media_types)
    {
        Hue.horizontal_separator.separate($(`#${type}_picker_options`)[0])
    }
}

// Updates the dimensions of a specified element
// It grows the element as much as it can while maintaining the aspect ratio
// This is done by making calculations with the element and parent's ratios
Hue.fix_frame = function(frame_id, test_parent_height=false)
{
    let id = `#${frame_id}`
    let frame = $(id)
    let frame_ratio

    if(frame_id === "media_image_frame")
    {
        frame_ratio = frame[0].naturalHeight / frame[0].naturalWidth
    }

    else
    {
        frame_ratio = 0.5625
    }
    
    let parent = frame.parent()
    let info_height = 0
    let info = frame.parent().find(".media_info")
    
    if(info.length > 0)
    {
        info_height = info.eq(0).outerHeight(true)
    }

    let parent_width = parent.width()
    let parent_height = test_parent_height ? test_parent_height : parent.height() - info_height
    let parent_ratio = parent_height / parent_width
    let width, height

    if(parent_ratio === frame_ratio)
    {
        width = parent_width
        height = parent_height
    }

    else if(parent_ratio < frame_ratio)
    {
        width = parent_height / frame_ratio
        height = parent_height
    }

    else if(parent_ratio > frame_ratio)
    {
        width = parent_width
        height = parent_width * frame_ratio
    }

    if(!test_parent_height)
    {
        frame.width(width)
        frame.height(height)
    }

    else
    {
        return {width:width, height:height, parent_width:parent_width, parent_height:parent_height}
    }
}

// Updates dimensions of the image and tv
Hue.fix_frames = function()
{
    Hue.fix_visible_video_frame()
    Hue.fix_image_frame()
}

// Handles volume change command for the specified type
Hue.change_volume_command = function(arg, type="radio")
{
    if(isNaN(arg))
    {
        Hue.feedback("Argument must be a number")
        return false
    }

    else
    {
        let nv = arg / 100

        if(type === "radio")
        {
            Hue.set_radio_volume(nv)
        }

        else if(type === "tv")
        {
            Hue.set_tv_volume(nv)
        }
    }
}

// Changes the volume of the radio and the tv
Hue.change_volume_all = function(arg)
{
    Hue.change_volume_command(arg, "radio")
    Hue.change_volume_command(arg, "tv")
}

// Gets a volume number in percentage form
// Like 20 or 100
Hue.get_nice_volume = function(volume)
{
    return parseInt(Math.round((volume * 100)))
}

// This handles all media load
// It will attempt to load and play media taking into account the room state
// It is responsible to initiate the construction of all required media players
Hue.change = function(args={})
{
    let def_args =
    {
        type: "",
        force: false,
        play: true,
        notify: true,
        current_source: false,
        item: false
    }

    args = Object.assign(def_args, args)

    let item

    if(args.item)
    {
        item = args.item
    }

    else if(args.current_source && Hue[`loaded_${args.type}`].source)
    {
        item = Hue[`loaded_${args.type}`]
    }

    else
    {
        item = Hue[`current_${args.type}`]()
    }

    let bypass_lock = false

    if(item.setter === Hue.username)
    {
        bypass_lock = Hue.get_setting("bypass_tv_lock_on_own_change")
    }

    if(args.type === "image")
    {
        if(!args.force && Hue.loaded_image.source === Hue.current_image().source)
        {
            return false
        }
    }

    else if(args.type === "tv")
    {
        if(!args.force && Hue.loaded_tv.source === Hue.current_tv().source)
        {
            return false
        }
    }

    else if(args.type === "radio")
    {
        if(!args.force && Hue.loaded_radio.source === Hue.current_radio().source)
        {
            return false
        }
    }

    else
    {
        return false
    }

    if(Hue.afk)
    {
        if(args.type === "image")
        {
            if(Hue.get_setting("afk_disable_image_change"))
            {
                Hue.change_image_when_focused = true
                return false
            }
        }

        else if(args.type === "tv")
        {
            if(Hue.get_setting("afk_disable_tv_change"))
            {
                Hue.change_tv_when_focused = true
                return false
            }
        }

        else if(args.type === "radio")
        {
            if(Hue.get_setting("afk_disable_radio_change"))
            {
                Hue.change_radio_when_focused = true
                return false
            }
        }
    }

    if(args.type === "image")
    {
        if(!Hue.room_state.image_enabled)
        {
            return false
        }

        let locked = Hue.room_state.image_locked && !bypass_lock

        if(!args.item && locked && Hue.loaded_image.source && !args.current_source)
        {
            return false
        }

        if(Hue.room_image_mode === "disabled")
        {
            return false
        }

        Hue.loaded_image = item

        Hue.show_image(args.force)

        if(!args.item || args.item === Hue.current_image())
        {
            $("#footer_lock_image_icon").removeClass("blinking")
        }

        if(Hue.background_mode === "mirror" || Hue.background_mode === "mirror_tiled")
        {
            Hue.apply_background()
        }
    }

    else if(args.type === "tv")
    {
        if(!Hue.room_state.tv_enabled)
        {
            return false
        }

        let locked = Hue.room_state.tv_locked && !bypass_lock

        if(!args.item && locked && Hue.loaded_tv.source && !args.current_source)
        {
            return false
        }

        if(Hue.room_tv_mode === "disabled")
        {
            return false
        }

        if(!Hue.loaded_tv.source && !args.force)
        {
            args.play = false
        }

        if(item.type !== "video" && item.type !== "iframe")
        {
            if(Hue[`${item.type}_video_player`] === undefined)
            {
                Hue.request_media(`${item.type}_video_player`, args)
                return false
            }
        }
		
        Hue.loaded_tv = item

        Hue[`show_${item.type}_video`](args.play)

        if(!args.item || args.item === Hue.current_tv())
        {
            $("#footer_lock_tv_icon").removeClass("blinking")
        }

    }

    else if(args.type === "radio")
    {
        if(!Hue.room_state.radio_enabled)
        {
            return false
        }

        let locked = Hue.room_state.radio_locked && !bypass_lock

        if(!args.item && locked && Hue.loaded_radio.source && !args.current_source)
        {
            return false
        }

        if(Hue.room_radio_mode === "disabled")
        {
            return false
        }

        if(item.type !== "audio")
        {
            if(Hue[`${item.type}_player`] === undefined)
            {
                Hue.request_media(`${item.type}_player`, args)
                return false
            }
        }

        Hue.loaded_radio = item

        let force = false

        if(args.item || bypass_lock)
        {
            force = true
        }

        Hue.load_radio(force)

        if(!args.item || args.item === item)
        {
            $("#footer_lock_radio_icon").removeClass("blinking")
        }
    }

    else
    {
        return false
    }

    Hue.update_media_history_blinks()
    Hue.check_media_menu_loaded_media()

    if(args.notify && item.setter !== Hue.username)
    {
        Hue.on_activity("media_change")
    }
}

// Check if maxers should be displayed or not
Hue.check_media_maxers = function()
{
    if(Hue.room_tv_mode !== "disabled" && Hue.room_image_mode !== "disabled")
    {
        $(".maxer_container").css("display", "flex")
    }

    else
    {
        $(".maxer_container").css("display", "none")
    }
}

// Function that setups frame info items
Hue.start_media_info_events = function()
{
    $("#media").on("click", ".media_info_username", function()
    {
        let username = $(this).closest(".media_info").data("item").setter
        Hue.show_profile(username)
    })

    $("#media").on("click", ".media_info_details", function()
    {
        z = this
        let media_info = $(this).closest(".media_info")
        let item = media_info.data("item")
        let mode = media_info.data("mode")

        Hue.open_url_menu({source:item.source, data:item, media_type:mode})
    })

    $("#media").on("auxclick", ".media_info_username", function(e)
    {
        if(e.which === 2)
        {
            Hue.process_write_whisper($(this).closest(".media_info").data("item").setter)
        }
    })
}

// Refreshes image and tv media info
Hue.reapply_media_info = function()
{
    Hue.apply_media_info(...Hue.media_info_image_data)
    Hue.apply_media_info(...Hue.media_info_tv_data)
}

// Sets a media info item with proper information and events
Hue.apply_media_info = function(element, item, mode)
{
    let custom_title

    if(mode === "tv")
    {
        Hue.media_info_tv_data = [...arguments]
    }

    else if(mode === "image")
    {
        if(item.type === "upload")
        {
            custom_title = `${Hue.utilz.get_size_string(item.size)} upload`
        }

        Hue.media_info_image_data = [...arguments]
    }

    let hover_title = item.info

    let info = item.comment || custom_title || item.title || item.source || ""
    info = info.substring(0, Hue.get_setting("media_info_max_length")).trim()

    let html = 
    `
        <div class='media_info_username pointer action'>${Hue.utilz.make_html_safe(item.setter)}</div>
        <div class='media_info_details pointer action'>: ${Hue.utilz.make_html_safe(info)}</div>
    `

    $(element).html(html)
    $(element).attr("title", hover_title)
    $(element).data("otitle", hover_title)
    $(element).data("date", item.date)
    $(element).data("item", item)
    $(element).data("mode", mode)
}

// Configures media info
Hue.configure_media_info = function()
{
    let display

    if(Hue.get_setting("media_info") === "custom_enabled")
    {
        display = "flex"
    }
    
    if(Hue.get_setting("media_info") === "custom_disabled")
    {
        display = "none"
    }

    else if(Hue.media_info === "enabled")
    {
        display = "flex"
    }

    else if(Hue.media_info === "disabled")
    {
        display = "none"
    }

    let css = `
    <style class='appended_media_info_style'>
        .media_info
        {
            display: ${display} !important;    
        }
    </style>`

    $(".appended_media_info_style").each(function()
    {
        $(this).remove()
    })

    $("head").append(css)

    Hue.fix_frames()
}

// Enables or disables media info
Hue.change_media_info = function(media_info)
{
    if(!Hue.is_admin_or_op(Hue.role))
    {
        Hue.not_an_op()
        return false
    }

    if(media_info !== "enabled" && media_info !== "disabled")
    {
        Hue.feedback("Valid media info modes: enabled disabled")
        return false
    }

    if(media_info === Hue.media_info)
    {
        Hue.feedback(`Media info is already set to that`)
    }

    Hue.socket_emit("change_media_info", {media_info:media_info})
}

// Announces media info change and configures it
Hue.media_info_changed = function(data)
{
    Hue.set_media_info(data.media_info)
    Hue.show_room_notification(data.username, `${data.username} changed media info to ${data.media_info}`)
}

// Media info setter
Hue.set_media_info = function(what)
{
    Hue.media_info = what
    Hue.configure_media_info()
    Hue.config_admin_media_info()
}

// Toggles media locks for any type
Hue.change_media_lock = function(type)
{
    if(Hue.room_state[`${type}_locked`])
    {
        $(`#footer_lock_${type}_icon`).removeClass("fa-unlock")
        $(`#footer_lock_${type}_icon`).addClass("fa-lock")
        $(`#footer_lock_${type}_icon`).removeClass("footer_icon3")
        $(`#footer_lock_${type}_icon`).addClass("footer_icon2")
        $(`#footer_lock_${type}_label`).css("display", "block")
    
        if(Hue[`loaded_${type}`] !== Hue[`current_${type}`]())
        {
            $(`#footer_lock_${type}_icon`).addClass("blinking")
        }
    }

    else
    {
        $(`#footer_lock_${type}_icon`).removeClass("fa-lock")
        $(`#footer_lock_${type}_icon`).addClass("fa-unlock")
        $(`#footer_lock_${type}_icon`).removeClass("blinking")
        $(`#footer_lock_${type}_icon`).removeClass("footer_icon2")
        $(`#footer_lock_${type}_icon`).addClass("footer_icon3")
        $(`#footer_lock_${type}_label`).css("display", "none")

        Hue.change({type:type})
    }
}

// Changes the media layout between row and column
Hue.change_media_layout = function(mode=false)
{
    if(!mode)
    {
        mode = Hue.get_setting("media_layout")
    }

    if(mode === "column")
    {
        $("#media_split").css("flex-direction", "column")
        $(".media_main_container").css("width", "100%")
        $(".media_main_container").css("height", "50%")
    }

    else if(mode === "row")
    {
        $("#media_split").css("flex-direction", "row")
        $(".media_main_container").css("width", "50%")
        $(".media_main_container").css("height", "100%")
    }

    Hue.apply_media_percentages()
    Hue.fix_frames()
}

// Switches between row and column media layout mode
Hue.swap_media_layout = function()
{
    let type = Hue.active_settings("media_layout")
    Hue[type].media_layout = Hue[type].media_layout === "row" ? "column" : "row"
    Hue[`save_${type}`]()
    Hue.change_media_layout()
}

// Alternative function to swap media and overrides settings
Hue.swap_media_layout_2 = function()
{
    Hue.enable_setting_override("media_layout")
    Hue.swap_media_layout()
}