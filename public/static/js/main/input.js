// Setups most keyboard events
Hue.activate_key_detection = function()
{
    document.addEventListener('keydown', (e) =>
    {
        if(!Hue.started)
        {
            return
        }

        if(e.key === "Tab")
        {
            e.preventDefault()
        }

        if(!(Hue.utilz.is_textbox(document.activeElement)
        && document.activeElement.value.trim())
        && Hue.keys_pressed[e.keyCode] === undefined
        && !e.repeat)
        {
            Hue.keys_pressed[e.keyCode] = true

            if(Object.keys(Hue.keys_pressed).length === 1)
            {
                if(e.key === Hue.config.double_tap_key)
                {
                    Hue.double_tap_key_pressed += 1

                    if(Hue.double_tap_key_pressed === 2)
                    {
                        Hue.on_double_tap()
                    }

                    else
                    {
                        Hue.double_tap_timer()
                    }
                }

                else if(e.key === Hue.config.double_tap_key_2)
                {
                    Hue.double_tap_key_2_pressed += 1

                    if(Hue.double_tap_key_2_pressed === 2)
                    {
                        Hue.on_double_tap_2()
                    }

                    else
                    {
                        Hue.double_tap_2_timer()
                    }
                }

                else if(e.key === Hue.config.double_tap_key_3)
                {
                    Hue.double_tap_key_3_pressed += 1

                    if(Hue.double_tap_key_3_pressed === 2)
                    {
                        Hue.on_double_tap_3()
                    }

                    else
                    {
                        Hue.double_tap_3_timer()
                    }
                }

                else
                {
                    Hue.reset_double_tap_keys_pressed()
                }
            }

            else
            {
                Hue.reset_double_tap_keys_pressed()
            }
        }

        else
        {
            Hue.reset_double_tap_keys_pressed()
        }

        if(Hue.modal_open)
        {
            if(e.key === "Escape")
            {
                if(e.shiftKey)
                {
                    Hue.close_all_modals()
                    e.preventDefault()
                    return
                }
            }

            if(Hue.image_picker_open)
            {
                if(Hue.msg_image_picker.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        let val = $("#image_source_picker_input").val().trim()

                        if(val !== "")
                        {
                            Hue.change_image_source(val)
                            Hue.msg_image_picker.close()
                        }

                        e.preventDefault()
                    }

                    else if(e.key === "Tab")
                    {
                        Hue.do_media_picker_input_cycle("image")
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.tv_picker_open)
            {
                if(Hue.msg_tv_picker.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        let val = $("#tv_source_picker_input").val().trim()

                        if(val !== "")
                        {
                            Hue.change_tv_source(val)
                            Hue.msg_tv_picker.close()
                        }

                        e.preventDefault()
                    }

                    else if(e.key === "Tab")
                    {
                        Hue.do_media_picker_input_cycle("tv")
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.radio_picker_open)
            {
                if(Hue.msg_radio_picker.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        let val = $("#radio_source_picker_input").val().trim()

                        if(val !== "")
                        {
                            Hue.change_radio_source(val)
                            Hue.msg_radio_picker.close()
                        }

                        e.preventDefault()
                    }

                    else if(e.key === "Tab")
                    {
                        Hue.do_media_picker_input_cycle("radio")
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.upload_comment_open)
            {
                if(Hue.msg_upload_comment.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        Hue.process_upload_comment()
                        e.preventDefault()
                    }
                }
            }

            if(Hue.open_room_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        if(e.shiftKey)
                        {
                            $("#open_room_here").trigger("click")
                        }

                        else
                        {
                            $("#open_room_new_tab").trigger("click")
                        }

                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.background_image_input_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        Hue.background_image_input_action()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.create_room_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        Hue.create_room_submit()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.import_settings_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        Hue.process_imported_settings()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.goto_room_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter")
                    {
                        Hue.goto_room_action()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.writing_message)
            {
                if(Hue.msg_message.is_highest())
                {
                    if(e.key === "Enter" && !e.shiftKey)
                    {
                        Hue.send_popup_message()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.modal_image_open)
            {
                if(Hue.msg_modal_image.is_highest())
                {
                    if(e.key === "ArrowLeft")
                    {
                        Hue.modal_image_prev_click()
                        e.preventDefault()
                    }

                    else if(e.key === "ArrowRight")
                    {
                        Hue.modal_image_next_click()
                        e.preventDefault()
                    }

                    else if(e.key === "ArrowUp")
                    {
                        Hue.modal_image_next_click()
                        e.preventDefault()
                    }

                    else if(e.key === "ArrowDown")
                    {
                        Hue.modal_image_prev_click()
                        e.preventDefault()
                    }

                    if(e.key === "Enter")
                    {
                        Hue.show_media_history("image")
                        e.preventDefault()
                    }

                    if(e.key === " ")
                    {
                        Hue.show_modal_image_number()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.draw_image_open)
            {
                if(e.key === " ")
                {
                    Hue.draw_image_change_mode()
                }

                if(e.key === "z")
                {
                    if(e.ctrlKey)
                    {
                        Hue.draw_image_undo()
                    }
                }

                if(e.key === "y")
                {
                    if(e.ctrlKey)
                    {
                        Hue.draw_image_redo()
                    }
                }
            }

            if(Hue.modal_image_number_open)
            {
                if(e.key === "Enter")
                {
                    Hue.modal_image_number_go()
                }
            }

            if(Hue.writing_reply)
            {
                if(Hue.msg_reply.is_highest())
                {
                    if(e.key === "Enter" && !e.shiftKey)
                    {
                        Hue.submit_reply()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.change_user_username_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter" && !e.shiftKey)
                    {
                        Hue.submit_change_username()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.change_user_password_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter" && !e.shiftKey)
                    {
                        Hue.submit_change_password()
                        e.preventDefault()
                    }

                    return
                }
            }

            if(Hue.change_user_email_open)
            {
                if(Hue.msg_info2.is_highest())
                {
                    if(e.key === "Enter" && !e.shiftKey)
                    {
                        Hue.submit_change_email()
                        e.preventDefault()
                    }

                    return
                }
            }

            return
        }

        if(Hue.editing_message)
        {
            Hue.focus_edit_area()

            if(e.key === "Enter" && !e.shiftKey)
            {
                Hue.send_edit_messsage()
                e.preventDefault()
            }

            else if(e.key === "Escape")
            {
                Hue.stop_edit_message()
                e.preventDefault()
            }

            else if(e.key === "ArrowUp")
            {
                let res = Hue.handle_edit_direction()

                if(res)
                {
                    e.preventDefault()
                }
            }

            else if(e.key === "ArrowDown")
            {
                let res = Hue.handle_edit_direction(true)

                if(res)
                {
                    e.preventDefault()
                }
            }

            return false
        }

        if(Hue.synth_open)
        {
            if(Hue.synth_voice_input_focused)
            {
                if(e.key === "Enter")
                {
                    Hue.send_synth_voice()
                }

                if(e.key === "Escape")
                {
                    if($("#synth_voice_input").val())
                    {
                        Hue.clear_synth_voice()
                    }

                    else
                    {
                        Hue.hide_synth(true)
                    }
                }

                return false
            }
        }

        if(!(e.ctrlKey && window.getSelection().toString() !== ""))
        {
            Hue.focus_input()
        }

        if(e.key === "Enter")
        {
            if(e.shiftKey)
            {
                Hue.add_linebreak_to_input()
            }

            else
            {
                if($("#input").val().length === 0)
                {
                    Hue.goto_bottom(true)
                }

                else
                {
                    Hue.process_message({message:$('#input').val()})
                }
            }

            e.preventDefault()
            return
        }

        else if(e.key === "ArrowUp")
        {
            if(Hue.input_oversized_active() && !e.shiftKey)
            {
                return
            }

            if(e.shiftKey)
            {
                Hue.input_history_change("up")
                e.preventDefault()
            }

            else if(e.ctrlKey)
            {
                Hue.scroll_up(Hue.config.small_keyboard_scroll)
                e.preventDefault()
            }

            else
            {
                Hue.edit_last_message()
            }

            return
        }

        else if(e.key === "ArrowDown")
        {
            if(Hue.input_oversized_active() && !e.shiftKey)
            {
                return
            }

            if(e.shiftKey)
            {
                Hue.input_history_change("down")
                e.preventDefault()
            }

            else if(e.ctrlKey)
            {
                Hue.scroll_down(Hue.config.small_keyboard_scroll)
                e.preventDefault()
            }

            else
            {
                Hue.goto_bottom(true, true)
            }

            return
        }

        else if(e.key === "PageUp")
        {
            if(e.shiftKey)
            {
                Hue.goto_top()
            }

            else
            {
                Hue.scroll_up(Hue.config.big_keyboard_scroll)
            }

            e.preventDefault()
            return
        }

        else if(e.key === "PageDown")
        {
            if(e.shiftKey)
            {
                Hue.goto_bottom(true)
            }

            else
            {
                Hue.scroll_down(Hue.config.big_keyboard_scroll)
            }

            e.preventDefault()
            return
        }

        else if(e.key === "Escape")
        {
            if(!e.shiftKey)
            {
                if($("#input").val().length > 0)
                {
                    Hue.clear_input()
                    Hue.reset_input_history_index()
                }

                else
                {
                    Hue.goto_bottom(true, true)
                }

                Hue.hide_reactions_box()
                e.preventDefault()
                return
            }
        }
    })

    document.addEventListener('keyup', (e) =>
    {
        if(!Hue.started)
        {
            return
        }

        delete Hue.keys_pressed[e.keyCode]
    })

    document.addEventListener('input', (e) =>
    {
        if(Hue.modal_open && Hue.active_modal)
        {
            if($(e.target).data("mode") === "manual")
            {
                return false
            }

            Hue.do_modal_filter_timer()
        }
    })
}

// Setups some body mouse events
Hue.setup_mouse_events = function()
{
    $("body").mousedown(function()
    {
        Hue.mouse_is_down = true
    })

    $("body").mouseup(function(e)
    {
        Hue.mouse_is_down = false
    })

    $("body").mouseleave(function()
    {
        Hue.mouse_is_down = false
    })
}

// Resets 'tabbed' state generated after autocompleting words
Hue.clear_tabbed = function(element)
{
    if(!element.id)
    {
        return false
    }

    Hue.tab_info[element.id] =
    {
        tabbed_list: [],
        tabbed_word: "",
        tabbed_start: 0,
        tabbed_end: 0
    }
}

// Resets double tap key press state
Hue.reset_double_tap_keys_pressed = function()
{
    Hue.double_tap_key_pressed = 0
    Hue.double_tap_key_2_pressed = 0
    Hue.double_tap_key_3_pressed = 0
}

// On double tap 1 action
Hue.on_double_tap = function()
{
    Hue.execute_commands("double_tap")
}

// On double tap 2 action
Hue.on_double_tap_2 = function()
{
    Hue.execute_commands("double_tap_2")
}

// On double tap 3 action
Hue.on_double_tap_3 = function()
{
    Hue.execute_commands("double_tap_3")
}

// Generates an array of autocompletable words on demand
Hue.generate_words_to_autocomplete = function()
{
    let susernames = []

    for(let uname of Hue.usernames)
    {
        susernames.push(`${uname}'s`)
    }

    let words = Hue.commands_list
    .concat(Hue.usernames)
    .concat(susernames)
    .concat(["@everyone"])
    .concat(Object.keys(Hue.command_aliases))

    let autocomplete = Hue.get_setting("other_words_to_autocomplete")

    if(autocomplete)
    {
        words = words.concat(autocomplete.split('\n'))
    }

    words.sort()

    return words
}

// Tries to find the closest item to autocomplate after a tab action
Hue.get_closest_autocomplete = function(element, w)
{
    let info = Hue.tab_info[element.id]
    let l = Hue.generate_words_to_autocomplete()
    let wl = w.toLowerCase()
    let has = false

    for(let i=0; i<l.length; i++)
    {
        let pw = l[i]

        if(pw.startsWith(w))
        {
            has = true

            if(!info.tabbed_list.includes(pw))
            {
                info.tabbed_list.push(pw)
                return l[i]
            }
        }
    }

    for(let i=0; i<l.length; i++)
    {
        let pw = l[i]
        let pwl = pw.toLowerCase()

        if(pwl.startsWith(wl))
        {
            has = true

            if(!info.tabbed_list.includes(pw))
            {
                info.tabbed_list.push(pw)
                return l[i]
            }
        }
    }

    if(has)
    {
        info.tabbed_list = []
        return Hue.get_closest_autocomplete(element, w)
    }

    return ""
}

// Attemps to autocomplete a word after a user presses tab on a textbox
Hue.tabbed = function(element)
{
    if(!element.id)
    {
        return false
    }

    let info = Hue.tab_info[element.id]

    if(info === undefined)
    {
        Hue.clear_tabbed(element)
        info = Hue.tab_info[element.id]
    }

    if(info.tabbed_word !== "")
    {
        Hue.replace_tabbed(element, info.tabbed_word)
        return
    }

    let split = element.selectionStart
    let value = element.value.replace(/\n/g, ' ')
    let a = value.substring(0, split).match(/[^ ]*$/)[0]
    let b = value.substring(split).match(/^[^ ]*/)[0]
    let word = a + b

    info.tabbed_start = split - a.length
    info.tabbed_end = split + b.length

    if(word !== "")
    {
        info.tabbed_word = word
        Hue.replace_tabbed(element, word)
    }
}

// Replaces current word next to the caret with the selected autocomplete item
Hue.replace_tabbed = function(element, word)
{
    let info = Hue.tab_info[element.id]
    let result = Hue.get_closest_autocomplete(element, word)

    if(result)
    {
        if(element.value[info.tabbed_end] === ' ')
        {
            element.value = Hue.utilz.replace_between(element.value, info.tabbed_start, info.tabbed_end, result)
        }

        else
        {
            element.value = Hue.utilz.replace_between(element.value, info.tabbed_start, info.tabbed_end, `${result} `)
        }

        let pos = info.tabbed_start + result.length

        element.setSelectionRange(pos + 1, pos + 1)

        info.tabbed_start = pos - result.length
        info.tabbed_end = pos

        Hue.just_tabbed = true
    }
}

// Setups autocomplete functionality
// This allows to have tab autocomplete on all allowed textboxes
Hue.setup_autocomplete = function()
{
    $("body").on("keydown", "textarea, input[type='text'], input[type='search']", function(e)
    {
        Hue.just_tabbed = false

        if(e.key === "Tab")
        {
            let value = $(this).val()

            if(value.length > 0)
            {
                Hue.tabbed(this)
                return
            }
        }

        Hue.clear_tabbed(this)
    })

    $("body").on("click", "textarea, input[type='text'], input[type='search']", function(e)
    {
        Hue.clear_tabbed(this)
    })
}

// Starts body events
Hue.start_body_events = function()
{
    $("body").on("click", ".spoiler", function()
    {
        $(this).removeClass("spoiler")
        $(this).removeAttr("title")
    })

    $("body").on("mouseenter", ".dynamic_title", function()
    {
        let new_title = `${$(this).data("otitle")} (${Hue.get_timeago($(this).data("date"))})`
        $(this).attr("title", new_title)
    })

    $("body").on("auxclick", ".Msg-window-inner-x", function(e)
    {
        if(e.which === 2)
        {
            Hue.process_msg_close_button(this)
        }
    })
}

// Handles actions after a copy event
Hue.copypaste_events = function()
{
    $(document).bind('copy', function(e)
    {
        if(window.getSelection().toString() !== "")
        {
            setTimeout(function()
            {
                if(Hue.utilz.is_textbox(document.activeElement))
                {
                    let se = document.activeElement.selectionEnd
                    document.activeElement.setSelectionRange(se, se)
                }

                else
                {
                    window.getSelection().removeAllRanges()
                    Hue.focus_input()
                }
            }, 200)
        }
    })
}