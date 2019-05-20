// Sets events for all context menus
Hue.context_menu_events =
{
    show: function()
    {
        Hue.context_menu_on_show()
    },
    hide: function()
    {
        Hue.context_menu_on_hide()
    }
}

// What happens after opening a context menu
Hue.context_menu_on_show = function()
{
    Hue.context_menu_open = true
}

// What happens after hiding a context menu
Hue.context_menu_on_hide = function()
{
    Hue.context_menu_open = false
}

// Starts the context menu for chat items
// This is triggered by a normal click
Hue.start_chat_menu_context_menu = function()
{
    $.contextMenu(
    {
        selector: ".chat_menu_button_menu",
        trigger: "left",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        events: 
        {
            show: function(options)
            {
                Hue.context_menu_on_show()
                $(this).closest(".chat_menu_button_main").addClass("chat_menu_button_main_selected")
            },
            hide: function(options)
            {
                Hue.context_menu_on_hide()
                $(this).closest(".chat_menu_button_main").removeClass("chat_menu_button_main_selected")
            }
        },
        items:
        {
            item0:
            {
                name: "Jump", callback: function(key, opt)
                {
                    let message_id = $(this).closest(".message").data("message_id")
                    Hue.jump_to_chat_message(message_id)
                },
                visible: function(key, opt)
                {
                    return $(this).closest("#chat_area").length === 0
                }
            },
            item1:
            {
                name: "Reply", callback: function(key, opt)
                {
                    let el = $(this).closest(".chat_content_container").eq(0).find(".chat_content").get(0)
                    Hue.start_reply(el)
                },
                visible: function(key, opt)
                {
                    let message = $(this).closest(".message")

                    if(message.data("mode") === "chat")
                    {
                        return true
                    }

                    return false
                }
            },
            item2:
            {
                name: "Edit", callback: function(key, opt)
                {
                    let el = $(this).closest(".chat_content_container").get(0)
                    Hue.edit_message(el)
                },
                visible: function(key, opt)
                {
                    let message = $(this).closest(".message")

                    if(message.data("mode") === "chat")
                    {
                        if($(this).closest(".message").data("user_id") === Hue.user_id)
                        {
                            return true
                        }
                    }

                    return false
                }
            },
            item4:
            {
                name: "Change Image", callback: function(key, opt)
                {

                },
                visible: function(key, opt)
                {
                    let url = $(this).closest(".chat_content_container").data("first_url")

                    if(url)
                    {
                        let ok = Hue.change_image_source(url, true)

                        if(ok)
                        {
                            return true
                        }
                    }

                    return false
                },
                items:
                {
                    opsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let first_url = $(this).closest(".chat_content_container").data("first_url")
                            Hue.change_image_source(first_url)
                        }
                    }
                }
            },
            item5:
            {
                name: "Change TV", callback: function(key, opt)
                {

                },
                visible: function(key, opt)
                {
                    let url = $(this).closest(".chat_content_container").data("first_url")

                    if(url)
                    {
                        let ok = Hue.change_tv_source(url, true)

                        if(ok)
                        {
                            return true
                        }
                    }

                    return false
                },
                items:
                {
                    opsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let first_url = $(this).closest(".chat_content_container").data("first_url")
                            Hue.change_tv_source(first_url)
                        }
                    }
                }
            },
            item6:
            {
                name: "Change Radio", callback: function(key, opt)
                {

                },
                visible: function(key, opt)
                {
                    let url = $(this).closest(".chat_content_container").data("first_url")

                    if(url)
                    {
                        let ok = Hue.change_radio_source(url, true)

                        if(ok)
                        {
                            return true
                        }
                    }

                    return false
                },
                items:
                {
                    opsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let first_url = $(this).closest(".chat_content_container").data("first_url")
                            Hue.change_radio_source(first_url)
                        }
                    }
                }
            },
            item7:
            {
                name: "Hide", callback: function(key, opt)
                {

                },
                items:
                {
                    opsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            Hue.remove_message_from_context_menu(this)
                        }
                    }
                }
            },
            itemdel:
            {
                name: "Delete", callback: function(key, opt)
                {

                },
                visible: function(key, opt)
                {
                    if(!Hue.log_enabled)
                    {
                        return false
                    }
                    
                    let message = $(this).closest(".message")
                    let mode = message.data("mode")

                    if(mode === "chat")
                    {
                        let user_id = $(this).closest(".message").data("user_id")

                        if(user_id)
                        {
                            let user = Hue.get_user_by_id(user_id)
    
                            if(user)
                            {
                                if(!Hue.user_is_controllable(user))
                                {
                                    return false
                                }
                            }
                        }

                        if((user_id && user_id === Hue.user_id) || Hue.is_admin_or_op())
                        {
                            return true
                        }
                    }

                    else if(mode === "announcement")
                    {
                        let id = message.data("id")

                        if(id)
                        {
                            let user_id = message.data("user_id")

                            if(user_id)
                            {
                                let user = Hue.get_user_by_id(user_id)
    
                                if(user)
                                {
                                    if(!Hue.user_is_controllable(user))
                                    {
                                        return false
                                    }
                                }
                            }

                            if((user_id && user_id === Hue.user_id) || Hue.is_admin_or_op())
                            {
                                return true
                            }
                        }
                    }

                    return false
                },
                items:
                {
                    opsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let id = false
                            let message = $(this).closest(".message")
                            let mode = message.data("mode")

                            if(mode === "chat")
                            {
                                id = $(this).closest(".chat_content_container").eq(0).data("id")
                            }

                            else if(mode === "announcement")
                            {
                                id = message.data("id")
                            }
                            
                            if(id)
                            {
                                Hue.delete_message(id, true)
                            }
                        }
                    }
                }
            },
            item8:
            {
                name: "Clear Log", callback: function(key, opt)
                {

                },
                items:
                {
                    above:
                    {
                        name: "Above This Point", callback: function(key, opt)
                        {

                        },
                        items:
                        {
                            opsure:
                            {
                                name: "I'm Sure", callback: function(key, opt)
                                {
                                    let id
                                    let message = $(this).closest(".message")
                                    let mode = message.data("mode")

                                    if(mode === "chat")
                                    {
                                        id = $(this).closest(".chat_content_container").data("id")
                                    }

                                    else if(mode === "announcement")
                                    {
                                        id = message.data("id")
                                    }

                                    Hue.clear_log("above", id)
                                }
                            }
                        }
                    },
                    below:
                    {
                        name: "Below This Point", callback: function(key, opt)
                        {

                        },
                        items:
                        {
                            opsure:
                            {
                                name: "I'm Sure", callback: function(key, opt)
                                {
                                    let id
                                    let message = $(this).closest(".message")
                                    let mode = message.data("mode")

                                    if(mode === "chat")
                                    {
                                        id = $(this).closest(".chat_content_container").data("id")
                                    }

                                    else if(mode === "announcement")
                                    {
                                        id = message.data("id")
                                    }

                                    Hue.clear_log("below", id)
                                }
                            }
                        }
                    }
                },
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op())
                    {
                        return false
                    }
                    
                    if(!Hue.log_enabled)
                    {
                        return false
                    }

                    let message = $(this).closest(".message")
                    let mode = message.data("mode")

                    if(mode === "chat")
                    {
                        if($(this).closest(".chat_content_container").data("id"))
                        {
                            return true
                        }
                    }

                    else if(mode === "announcement")
                    {
                        if(!message.data("in_log"))
                        {
                            return false
                        }

                        if(message.data("id"))
                        {
                            return true
                        }
                    }

                    return false
                }
            }
        }
    })
}

// Generate the items for the chat maxer context menu
Hue.generate_chat_maxer_context_items = function()
{
    let items = {}

    for(let i=10; i>0; i--)
    {
        let n = i * 10

        items[`per${n}`] =
        {
            name: `Chat ${n}%`, callback: function(key, opt)
            {
                Hue.do_chat_size_change(n)

                if(n !== 100)
                {
                    Hue.show_media_items()
                }
            }
        }
    }

    let obj = Object.assign(
    {
        very_big:
        {
            name: "Very Big", callback: function(key, opt)
            {
                Hue.toggle_chat_font_size("very_big")
            }
        },
        big:
        {
            name: "Big", callback: function(key, opt)
            {
                Hue.toggle_chat_font_size("big")
            }
        },
        normal:
        {
            name: "Normal", callback: function(key, opt)
            {
                Hue.toggle_chat_font_size("normal")
            }
        },
        small:
        {
            name: "Small", callback: function(key, opt)
            {
                Hue.toggle_chat_font_size("small")
            }
        },
        very_small:
        {
            name: "Very Small", callback: function(key, opt)
            {
                Hue.toggle_chat_font_size("very_small")
            }
        }
    }, items,
    {
        def:
        {
            name: "Default", callback: function(key, opt)
            {
                Hue.set_default_chat_size()
                Hue.show_media_items()
            }
        }
    })

    return obj
}

// Starts the chat maxer context menu
Hue.start_chat_maxer_context_menu = function()
{
    $.contextMenu(
    {
        selector: "#chat_maxer",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        className: "maxer_context",
        items: Hue.generate_chat_maxer_context_items()
    })
}

// Generates the items for the tv maxer context menu
Hue.generate_tv_maxer_context_items = function()
{
    let items = {}

    for(let i=10; i>=0; i--)
    {
        let n = i * 10

        items[`per${n}`] =
        {
            name: `TV ${n}%`, callback: function(key, opt)
            {
                Hue.unmaximize_media()
                Hue.do_media_tv_size_change(n)
            }
        }
    }

    let obj = Object.assign(
    {
        swap:
        {
            name: "Swap", callback: function(key, opt)
            {
                Hue.swap_display_positions_2()
            }
        },
        rotate:
        {
            name: "Rotate", callback: function(key, opt)
            {
                Hue.swap_media_layout_2()
            }
        }
    },
    items,
    {
        def:
        {
            name: "Default", callback: function(key, opt)
            {
                Hue.unmaximize_media()
                Hue.set_default_tv_size()
            }
        }
    })

    return obj
}

// Starts the tv maxer context menu
Hue.start_tv_maxer_context_menu = function()
{
    $.contextMenu(
    {
        selector: "#media_tv_maxer, #media_image_maxer, #footer_media_rotate",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        className: "maxer_context",
        items: Hue.generate_tv_maxer_context_items()
    })
}

// Starts the room menu context menu
Hue.start_room_menu_context_menu = function()
{
    $.contextMenu(
    {
        selector: "#activity_left_room_menu_icon",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        items:
        {
            mm0:
            {
                name: "About", callback: function(key, opt)
                {
                    Hue.show_credits()
                }
            }
        }
    })
}

// Starts the context menu for the footer media labels
Hue.start_footer_media_label_context_menu = function()
{
    $.contextMenu(
    {
        selector: ".footer_media_label ",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        items:
        {
            mm1:
            {
                name: "Load Next", callback: function(key, opt)
                {
                    Hue.media_load_next($(this).data("type"))
                },
                disabled: function(key, opt)
                {
                    return !Hue.media_load_next($(this).data("type"), true)
                }
            },
            mm2:
            {
                name: "Load Previous", callback: function(key, opt)
                {
                    Hue.media_load_previous($(this).data("type"))
                },
                disabled: function(key, opt)
                {
                    return !Hue.media_load_previous($(this).data("type"), true)
                }
            }
        }
    })
}

// Starts the context menu in Recently Played items
Hue.start_played_context_menu = function()
{
    $.contextMenu(
    {
        selector: ".played_item_inner, #header_now_playing_controls",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        items:
        {
            cmenu1:
            {
                name: "Search on Google", callback: function(key, opt)
                {
                    Hue.search_on('google', this.data('q'))
                }
            },
            cmenu2:
            {
                name: "Search on SoundCloud", callback: function(key, opt)
                {
                    Hue.search_on('soundcloud', this.data('q'))
                }
            },
            cmenu3:
            {
                name: "Search on YouTube", callback: function(key, opt)
                {
                    Hue.search_on('youtube', this.data('q'))
                }
            }
        }
    })
}

// Generates the items for the volume context menu
Hue.generate_volume_context_items = function()
{
    let items = {}

    for(let i=10; i>=0; i--)
    {
        let n = i * 10
        let n2 = i / 10

        items[`vcm${n}`] =
        {
            name: `${n}%`, callback: function(key, opt)
            {
                Hue.set_radio_volume(n2)
            },
            disabled: function(key, opt)
            {
                if(n2 === Hue.room_state.radio_volume)
                {
                    return true
                }

                else
                {
                    return false
                }
            }
        }
    }

    return items
}

// Starts the volume context menu
Hue.start_volume_context_menu = function()
{
    $.contextMenu(
    {
        selector: "#header_radio_volume_controls",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        className: 'volume_context',
        items: Hue.generate_volume_context_items()
    })
}

// Starts the radio toggle context menu
Hue.start_toggle_radio_context_menu = function()
{
    $.contextMenu(
    {
        selector: "#toggle_radio_state",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        className: 'toggle_radio_context',
        items:
        {
            trs0:
            {
                name: "Don't Stop Automatically", callback: function(key, opt)
                {
                    Hue.clear_automatic_stop_radio()
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay > 0
                }
            },
            trs1:
            {
                name: "Stop in 1 Minute", callback: function(key, opt)
                {
                    Hue.stop_radio_in(1)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay !== 1
                }
            },
            trs1b:
            {
                name: "Stop in 1 Minute (*)", callback: function(key, opt)
                {
                    Hue.stop_radio_in(1)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay === 1
                }
            },
            trs2:
            {
                name: "Stop in 5 Minutes", callback: function(key, opt)
                {
                    Hue.stop_radio_in(5)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay !== 5
                }
            },
            trs2b:
            {
                name: "Stop in 5 Minutes (*)", callback: function(key, opt)
                {
                    Hue.stop_radio_in(5)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay === 5
                }
            },
            trs3:
            {
                name: "Stop in 10 Minutes", callback: function(key, opt)
                {
                    Hue.stop_radio_in(10)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay !== 10
                }
            },
            trs3b:
            {
                name: "Stop in 10 Minutes (*)", callback: function(key, opt)
                {
                    Hue.stop_radio_in(10)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay === 10
                }
            },
            trs4:
            {
                name: "Stop in 30 Minutes", callback: function(key, opt)
                {
                    Hue.stop_radio_in(30)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay !== 30
                }
            },
            trs4b:
            {
                name: "Stop in 30 Minutes (*)", callback: function(key, opt)
                {
                    Hue.stop_radio_in(30)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay === 30
                }
            },
            trs5:
            {
                name: "Stop in 60 Minutes", callback: function(key, opt)
                {
                    Hue.stop_radio_in(60)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay !== 60
                }
            },
            trs5b:
            {
                name: "Stop in 60 Minutes (*)", callback: function(key, opt)
                {
                    Hue.stop_radio_in(60)
                },
                visible: function(key, opt)
                {
                    return Hue.stop_radio_delay === 60
                }
            },
            trrestart:
            {
                name: "Restart", callback: function(key, opt)
                {
                    Hue.refresh_radio()
                },
                visible: function(key, opt)
                {
                    return Hue.radio_started
                }
            },
        },
        events:
        {
            show: function()
            {
                return Hue.radio_started
            }
        }
    })
}

// Gets the username depending on source element to use in the username context menu
Hue.get_user_context_menu_username = function(el)
{
    let username 

    if($(el).hasClass("profile_image"))
    {
        username = $(el).data("username")
    }

    else
    {
        username = $(el).text()
    }

    return username
}

// Starts the context menu on user elements
Hue.start_user_context_menu = function()
{
    $.contextMenu(
    {
        selector: ".userlist_item_username, .chat_uname, #show_profile_uname, .generic_uname, .admin_list_username, .activity_bar_text, .profile_image, .media_info_username",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        items:
        {
            cmwhisper:
            {
                name: "Whisper", callback = function(key, opt)
                {
                    let username = Hue.get_user_context_menu_username(this)
                    Hue.process_write_whisper(username)
                },
                visible: function(key, opt)
                {
                    let username = Hue.get_user_context_menu_username(this)
                    return Hue.user_is_online_by_username(username)
                }
            },
            cmbadge:
            {
                name: "Badge",
                items:
                {
                    bheart:
                    {
                        name: "Heart", icon:"far fa-heart", callback = function(key, opt)
                        {
                            let username = Hue.get_user_context_menu_username(this)
                            Hue.send_badge(username, "heart")
                        }
                    },
                    bskull:
                    {
                        name: "Skull", icon:"fas fa-skull", callback = function(key, opt)
                        {
                            let username = Hue.get_user_context_menu_username(this)
                            Hue.send_badge(username, "skull")
                        }
                    }
                },
                visible: function(key, opt)
                {
                    let username = Hue.get_user_context_menu_username(this)
                    return username !== Hue.username && Hue.user_is_online_by_username(username)
                }
            },
            cmvoice1:
            {
                name: "Voice 1", callback: function(key, opt)
                {
                    let arg = Hue.get_user_context_menu_username(this)
                    Hue.change_role(arg, "voice1")
                },
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op(Hue.role))
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                }
            },
            cmvoice2:
            {
                name: "Voice 2", callback: function(key, opt)
                {
                    let arg = Hue.get_user_context_menu_username(this)
                    Hue.change_role(arg, "voice2")
                },
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op(Hue.role))
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                }
            },
            cmvoice3:
            {
                name: "Voice 3", callback: function(key, opt)
                {
                    let arg = Hue.get_user_context_menu_username(this)
                    Hue.change_role(arg, "voice3")
                },
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op(Hue.role))
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                }
            },
            cmvoice4:
            {
                name: "Voice 4", callback: function(key, opt)
                {
                    let arg = Hue.get_user_context_menu_username(this)
                    Hue.change_role(arg, "voice4")
                },
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op(Hue.role))
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                }
            },
            cmop:
            {
                name: "Op",
                visible: function(key, opt)
                {
                    if(Hue.role !== 'admin')
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                },
                items:
                {
                    opsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let arg = Hue.get_user_context_menu_username(this)
                            Hue.change_role(arg, "op")
                        }
                    }
                }
            },
            cmadmin:
            {
                name: "Admin",
                visible: function(key, opt)
                {
                    if(Hue.role !== 'admin')
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                },
                items:
                {
                    adminsure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let arg = Hue.get_user_context_menu_username(this)
                            Hue.change_role(arg, "admin")
                        }
                    }
                }
            },
            cmkick:
            {
                name: "Kick",
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op(Hue.role))
                    {
                        return false
                    }

                    else
                    {
                        let username = Hue.get_user_context_menu_username(this)
                        return Hue.user_is_online_by_username(username)
                    }
                },
                items:
                {
                    kicksure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let arg = Hue.get_user_context_menu_username(this)
                            Hue.kick(arg)
                        }
                    }
                }
            },
            cmban:
            {
                name: "Ban",
                visible: function(key, opt)
                {
                    if(!Hue.is_admin_or_op(Hue.role))
                    {
                        return false
                    }

                    else
                    {
                        return true
                    }
                },
                items:
                {
                    bansure:
                    {
                        name: "I'm Sure", callback: function(key, opt)
                        {
                            let arg = Hue.get_user_context_menu_username(this)
                            Hue.ban(arg)
                        }
                    }
                }
            }
        }
    })
}

// Starts the context menu for modal and popup windows's close buttons
Hue.start_msg_close_buttons_context_menu = function()
{
    $.contextMenu(
    {
        selector: ".Msg-window-inner-x",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        items:
        {
            mm0:
            {
                name: "Close All", callback: function(key, opt)
                {
                    Hue.process_msg_close_button(this)
                }
            }
        }
    })
}

// Generate the items for the chat search context menu
Hue.generate_chat_search_context_items = function()
{
    let items = {}

    if(Hue.room_state.chat_searches.length === 0)
    {
        items.item0 =
        {
            name: "No searches yet",
            disabled: true
        }
    }

    else
    {
        let n = 0

        for(let search of Hue.room_state.chat_searches)
        {
            items[`item_${n}`] =
            {
                name: search, callback: function(key, opt)
                {
                    Hue.show_chat_search(search)
                }
            }

            n += 1
        }

        items['clear'] =
        {
            name: "Clear", icon:"far fa-trash-alt", callback: function(key, opt)
            {
                Hue.clear_chat_searches()
            }
        }
    }

    return items
}

// Starts the chat search context menus
// One for the Search menu option
// One on the Search window which is triggered by a normal click
Hue.start_search_context_menus = function()
{
    $.contextMenu(
    {
        selector: "#room_menu_search_button",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        build: function($trigger, e)
        {
            return {items:Hue.generate_chat_search_context_items()}
        }
    })

    $.contextMenu(
    {
        selector: "#chat_search_history_icon",
        animation: {duration: 250, hide: 'fadeOut'},
        zIndex: 9000000000,
        events: Hue.context_menu_events,
        trigger: "left",
        build: function($trigger, e)
        {
            return {items:Hue.generate_chat_search_context_items()}
        }
    })
}