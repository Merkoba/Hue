// Setups an radio object
// This handles radio objects received live from the server or from logged messages
// This is the entry function for radio objects to get registered, announced, and be ready for use
Hue.setup_radio = function(mode, odata={})
{
    let data
    
    if(mode === "restart")
    {
        data = Hue.current_radio()
        data.date = odata.date
        data.info += ` | ${Hue.utilz.nice_date(data.date)}`
        data.message = `${odata.setter} restarted the radio`
        data.comment = odata.comment
        data.in_log = odata.in_log === undefined ? true : odata.in_log
    }
    
    else
    {
        data = {}
        
        data.id = odata.id
        data.user_id = odata.user_id
        data.type = odata.type
        data.source = odata.source
        data.title = odata.title
        data.setter = odata.setter
        data.date = odata.date
        data.query = odata.query
        data.comment = odata.comment
        data.nice_date = data.date ? Hue.utilz.nice_date(data.date) : Hue.utilz.nice_date()
        data.in_log = odata.in_log === undefined ? true : odata.in_log
        
        if(!data.setter)
        {
            data.setter = Hue.config.system_username
        }

        if(!data.source)
        {
            data.source = Hue.config.default_radio_source
            data.type = Hue.config.default_radio_type
            data.title = Hue.config.default_radio_title
        }

        if(!data.title)
        {
            data.title = data.source
        }

        data.message = `${data.setter} changed the radio to: ${Hue.utilz.conditional_quotes(data.title)}`

        if(data.type === "audio")
        {
            if(data.source.slice(-1) === '/')
            {
                data.metadata_url = `${data.source.slice(0, -1).split('/').slice(0, -1).join('/')}/status-json.xsl`
            }

            else
            {
                data.metadata_url = `${data.source.split('/').slice(0, -1).join('/')}/status-json.xsl`
            }
        }

        if(data.type === "youtube")
        {
            let time = Hue.utilz.get_youtube_time(data.source)

            if(time !== 0)
            {
                data.message += ` (At ${Hue.utilz.humanize_seconds(time)})`
            }
        }

        let gets = data.id ? `${data.id.slice(-3)} | ` : ""

        data.info = `${gets}Setter: ${data.setter} | ${data.nice_date}`

        if(data.query)
        {
            data.info += ` | Search Term: "${data.query}"`
        }

        data.onclick = function()
        {
            Hue.open_url_menu({source:data.source, data:data, media_type:"radio"})
        }
    }

    if(!data.date)
    {
        data.date = Date.now()
    }

    if(data.message)
    {
        data.message_id = Hue.announce_radio(data).message_id
    }

    if(mode === "change" || mode === "show")
    {
        Hue.push_radio_changed(data)
    }

    if(mode === "change" || mode === "restart")
    {
        if(mode === "change")
        {
            if(Hue.room_state.radio_locked)
            {
                $("#footer_lock_radio_icon").addClass("blinking")
            }

            console.log(333333)

            Hue.change({type:"radio", force:true})
        }

        else if(mode === "restart")
        {
            Hue.change({type:"radio", force:true, play:true})
        }
    }
}

// Announces a radio change to the chat
Hue.announce_radio = function(data)
{
    return Hue.public_feedback(data.message,
    {
        id: data.id,
        save: true,
        brk: "<i class='icon2c fa fa-volume-up'></i>",
        title: data.info,
        onclick: data.onclick,
        date: data.date,
        type: data.type,
        username: data.setter,
        comment: data.comment,
        type: "radio_change",
        user_id: data.user_id,
        in_log: data.in_log
    })
}

// Pushes a changed radio into the radio changed array
Hue.push_radio_changed = function(data)
{
    Hue.radio_changed.push(data)

    if(Hue.radio_changed.length > Hue.config.media_changed_crop_limit)
    {
        Hue.radio_changed = Hue.radio_changed.slice(Hue.radio_changed.length - Hue.config.media_changed_crop_limit)
    }

    Hue.after_push_media_change("radio", data)
}

// Returns the current room radio
// The last radio in the radio changed array
// This is not necesarily the user's loaded radio
Hue.current_radio = function()
{
    if(Hue.radio_changed.length > 0)
    {
        return Hue.radio_changed[Hue.radio_changed.length - 1]
    }

    else
    {
        return {}
    }
}

// Loads the radio with the specified item
// It only autplays it if the radio is started
Hue.load_radio = function(force=false)
{
    let item = Hue.loaded_radio

    Hue.radio_get_metadata = false
    clearTimeout(Hue.radio_metadata_fail_timeout)
    Hue.stop_radio(false)
    Hue.hide_radio(item)

    if(item.type === "audio")
    {
        if($("#audio_player").length === 0)
        {
            $("#media_audio_audio_container").html(`<audio id='audio_player' preload="none"></audio>`)
        }

        Hue.radio_get_metadata = true

        if(Hue.radio_started)
        {
            $('#audio_player')[0].play()
        }
    }

    else if(item.type === "youtube")
    {
        if(Hue.youtube_player)
        {
            let id = Hue.utilz.get_youtube_id(item.source)

            if(id[0] === "video")
            {
                if(Hue.radio_started)
                {
                    Hue.youtube_player.loadVideoById({videoId:id[1], startSeconds:Hue.utilz.get_youtube_time(item.source)})
                }

                else
                {
                    Hue.youtube_player.cueVideoById({videoId:id[1], startSeconds:Hue.utilz.get_youtube_time(item.source)})
                }
            }

            else if(id[0] === "list")
            {
                Hue.youtube_player.loadPlaylist({list:id[1][0], index:id[1][1]})
            }

            else
            {
                return false
            }

            Hue.youtube_player.setVolume(Hue.get_nice_volume(Hue.room_state.radio_volume))
        }

        if(force || (!Hue.room_state.radio_locked || !Hue.loaded_radio.source))
        {
            Hue.push_played(false, {s1:item.title, s2:item.source})
        }
    }

    else if(item.type === "soundcloud")
    {
        if(Hue.soundcloud_player)
        {
            Hue.soundcloud_player.load(item.source,
            {
                auto_play: false,
                single_active: false,
                show_artwork: true,
                callback: function()
                {
                    if(Hue.radio_started)
                    {
                        Hue.soundcloud_player.play()
                    }

                    Hue.soundcloud_player.setVolume(Hue.get_nice_volume(Hue.room_state.radio_volume))
                }
            })
        }

        if(force || (!Hue.room_state.radio_locked || !Hue.loaded_radio.source))
        {
            Hue.push_played(false, {s1:item.title, s2:item.source})
        }
    }

    if(item.type === "audio")
    {
        Hue.get_radio_metadata()
    }

    Hue.set_radio_volume(false, false)
}

// Attempts to change the radio source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
Hue.change_radio_source = function(src, just_check=false, comment="")
{
    let feedback = true

    if(just_check)
    {
        feedback = false
    }

    if(!Hue.can_radio)
    {
        if(feedback)
        {
            Hue.feedback("You don't have permission to change the radio")
        }

        return false
    }

    if(!comment)
    {
        let r = Hue.get_media_change_inline_comment("radio", src)
        src = r.source
        comment = r.comment
    }

    if(comment.length > Hue.config.max_media_comment_length)
    {
        if(feedback)
        {
            Hue.feedback("Comment is too long")
        }

        return false
    }

    if(src.length === 0)
    {
        return false
    }

    src = Hue.utilz.clean_string2(src)

    if(src.length > Hue.config.max_media_source_length)
    {
        return false
    }

    if(src.startsWith("/"))
    {
        return false
    }

    if(src === Hue.current_radio().source || src === Hue.current_radio().query)
    {
        if(feedback)
        {
            Hue.feedback("Radio is already set to that")
        }

        return false
    }

    else if(src === "default")
    {
        // OK
    }

    else if(src === "prev" || src === "previous")
    {
        if(Hue.radio_changed.length > 1)
        {
            src = Hue.radio_changed[Hue.radio_changed.length - 2].source
        }

        else
        {
            if(feedback)
            {
                Hue.feedback("No radio source before current one")
            }

            return false
        }
    }

    if(Hue.utilz.is_url(src))
    {
        if(Hue.check_domain_list("radio", src))
        {
            if(feedback)
            {
                Hue.feedback("Radio sources from that domain are not allowed")
            }

            return false
        }

        if(src.includes("youtube.com") || src.includes("youtu.be"))
        {
            if(!Hue.config.youtube_enabled)
            {
                if(feedback)
                {
                    Hue.feedback("YouTube support is not enabled")
                }

                return false
            }
        }

        else if(src.includes("soundcloud.com"))
        {
            if(!Hue.config.soundcloud_enabled)
            {
                if(feedback)
                {
                    Hue.feedback("Soundcloud support is not enabled")
                }

                return false
            }
        }

        else
        {
            let extension = Hue.utilz.get_extension(src).toLowerCase()

            if(extension)
            {
                if(!Hue.utilz.audio_extensions.includes(extension))
                {
                    if(feedback)
                    {
                        Hue.feedback("That doesn't seem to be an audio")
                    }

                    return false
                }
            }
        }
    }

    else if(src !== "restart" && src !== "reset")
    {
        if(src.length > Hue.config.safe_limit_1)
        {
            if(feedback)
            {
                Hue.feedback("Query is too long")
            }

            return false
        }

        if(!Hue.config.youtube_enabled)
        {
            if(feedback)
            {
                Hue.feedback("Invalid radio source")
            }

            return false
        }
    }

    if(just_check)
    {
        return true
    }

    Hue.socket_emit('change_radio_source', {src:src, comment:comment})
}

// Enables or disables the radio lock
Hue.toggle_lock_radio = function(what=undefined, save=true)
{
    if(what !== undefined)
    {
        Hue.room_state.radio_locked = what
    }

    else
    {
        Hue.room_state.radio_locked = !Hue.room_state.radio_locked
    }

    Hue.change_lock_radio()

    if(save)
    {
        Hue.save_room_state()
    }
}

// Applies changes to the radio footer lock icon
Hue.change_lock_radio = function()
{
    Hue.change_media_lock("radio")
}

// Makes the radio visible or not visible
Hue.toggle_radio = function(what=undefined, save=true)
{
    if(what !== undefined)
    {
        if(Hue.room_state.radio_enabled !== what)
        {
            Hue.room_state.radio_enabled = what
        }

        else
        {
            save = false
        }
    }

    else
    {
        Hue.room_state.radio_enabled = !Hue.room_state.radio_enabled
    }

    if(Hue.radio_visible !== what)
    {
        Hue.change_radio_visibility()
    }

    if(save)
    {
        Hue.save_room_state()
    }
}

// Changes the visibility of the radio based on current state
Hue.change_radio_visibility = function()
{
    if(Hue.room_radio_mode !== "disabled" && Hue.room_state.radio_enabled)
    {
        $("#header_radio").css("display", "flex")
        $("#footer_toggle_radio_icon").removeClass("fa-toggle-off")
        $("#footer_toggle_radio_icon").addClass("fa-toggle-on")

        Hue.radio_visible = true

        let original_radio_source = false

        if(Hue.loaded_radio.source)
        {
            original_radio_source = Hue.loaded_radio.source
        }

        if(Hue.first_media_change)
        {
            Hue.change({type:"radio", force:true, play:false, current_source:Hue.room_state.radio_locked})
        }

        if(Hue.loaded_radio.type && Hue.loaded_radio.type === "radio")
        {
            if(original_radio_source && (original_radio_source === Hue.loaded_radio.source))
            {
                Hue.get_radio_metadata()
            }
        }
    }

    else
    {
        Hue.stop_radio()
        Hue.hide_radio()

        $("#header_radio").css("display", "none")
        $("#footer_toggle_radio_icon").removeClass("fa-toggle-on")
        $("#footer_toggle_radio_icon").addClass("fa-toggle-off")

        Hue.radio_visible = false
    }

    Hue.update_header_separators()
}

// Sends an emit to change the radio to the previous one
Hue.radio_prev = function()
{
    Hue.change_radio_source("prev")
    Hue.msg_radio_picker.close()
}

// Reloads the radio with the same source
Hue.refresh_radio = function()
{
    Hue.change({type:"radio", force:true, play:true, current_source:true})
}

// Checks if Icecast radio metadata should be fetched
Hue.get_radio_metadata_enabled = function()
{
    return Hue.loaded_radio &&
    Hue.loaded_radio.type === "audio" &&
    Hue.loaded_radio.metadata_url &&
    Hue.radio_get_metadata &&
    Hue.room_radio_mode !== "disabled" &&
    Hue.room_state.radio_enabled
}

// Fetches Icecast radio metadata
Hue.get_radio_metadata = function()
{
    if(!Hue.get_radio_metadata_enabled())
    {
        return false
    }

    if(Hue.radio_get_metadata_ongoing)
    {
        return false
    }

    try
    {
        Hue.radio_get_metadata_ongoing = true

        $.get(Hue.loaded_radio.metadata_url, {},

        function(data)
        {
            Hue.radio_get_metadata_ongoing = false

            if(!Hue.get_radio_metadata_enabled())
            {
                return false
            }

            try
            {
                let source = false

                if(Array.isArray(data.icestats.source))
                {
                    for(let i=0; i<data.icestats.source.length; i++)
                    {
                        source = data.icestats.source[i]

                        if(source.listenurl.includes(Hue.loaded_radio.source.split('/').pop()))
                        {
                            if(source.artist !== undefined || source.title !== undefined)
                            {
                                break
                            }
                        }
                    }
                }

                else if(data.icestats.source.listenurl.includes(Hue.loaded_radio.source.split('/').pop()))
                {
                    source = data.icestats.source
                }

                else
                {
                    Hue.on_radio_get_metadata_error()
                    return false
                }

                if(!source || (source.artist === undefined && source.title === undefined))
                {
                    Hue.on_radio_get_metadata_error()
                    return false
                }

                Hue.push_played({title:source.title, artist:source.artist})
            }

            catch(err)
            {
                Hue.on_radio_get_metadata_error()
                return false
            }

        }).fail(function(err, status)
        {
            Hue.radio_get_metadata_ongoing = false

            if(err.status === 404)
            {
                Hue.on_radio_get_metadata_error(true, false)
            }

            else
            {
                Hue.on_radio_get_metadata_error()
            }
        })
    }

    catch(err)
    {
        Hue.radio_get_metadata_ongoing = false
        Hue.on_radio_get_metadata_error()
    }
}

// What to do on Icecast metadata fetch error
Hue.on_radio_get_metadata_error = function(show_file=true, retry=true)
{
    Hue.radio_get_metadata = false

    if(retry)
    {
        clearTimeout(Hue.radio_metadata_fail_timeout)

        Hue.radio_metadata_fail_timeout = setTimeout(function()
        {
            Hue.radio_get_metadata = true
        }, Hue.config.radio_retry_metadata_delay)
    }

    if(show_file)
    {
        let s = Hue.loaded_radio.source.split('/')

        if(s.length > 1)
        {
            Hue.push_played(false, {s1: s.pop(), s2:Hue.loaded_radio.source})
        }

        else
        {
            Hue.hide_now_playing()
        }
    }
}

// Click events for Recently Played items
Hue.start_played_click_events = function()
{
    $("#played").on("click", ".played_item_inner", function()
    {
        if($(this).data('q2') !== '')
        {
            Hue.goto_url($(this).data('q2'), "tab")
        }

        else
        {
            Hue.search_on('google', $(this).data('q'))
        }
    })
}

// Pushes a Recently Play item to the window and array
Hue.push_played = function(info, info2=false)
{
    let s
    let q
    let q2

    if(info)
    {
        if(!info.title && !info.artist)
        {
            return false
        }

        if(info.title && info.artist)
        {
            s = `${info.title} - ${info.artist}`
            q = `"${info.title}" by "${info.artist}"`
        }
        
        else if(info.title)
        {
            s = info.title
            q = `"${info.title}"`
        }
        
        else if(info.artist)
        {
            s = info.artist
            q = `"${info.artist}"`
        }

        q2 = ""
    }

    else
    {
        s = info2.s1
        q = info2.s1
        q2 = info2.s2
    }

    if($("#now_playing").text() === s)
    {
        return
    }

    $('#now_playing').text(s)

    $('#header_now_playing_controls').data('q', q)

    if(Hue.played[Hue.played.length - 1] !== s)
    {
        let date = Date.now()
        let nd = Hue.utilz.nice_date(date)

        let pi = `
        <div class='played_item_inner pointer inline action dynamic_title' title='${nd}' data-otitle='${nd}' data-date='${date}'>
            <div class='played_item_title'></div><div class='played_item_artist'></div>
        </div>`

        let h = $(`<div class='modal_item played_item'>${pi}</div>`)

        if(info)
        {
            if(info.title)
            {
                h.find('.played_item_title').eq(0).text(info.title)
            }

            if(info.artist)
            {
                h.find('.played_item_artist').eq(0).text(`by ${info.artist}`)
            }
        }

        else
        {
            h.find('.played_item_title').eq(0).text(info2.s1)
            h.find('.played_item_artist').eq(0).text(`${info2.s2}`)
        }

        let inner = h.find(".played_item_inner").eq(0)

        inner.data('q', q)
        inner.data('q2', q2)

        $('#played').prepend(h)

        Hue.played.push(s)

        if(Hue.played.length > Hue.config.played_crop_limit)
        {
            let els = $('#played').children()
            els.slice(els.length - 1, els.length).remove()
            Hue.played.splice(0, 1)
        }

        if(Hue.played_filtered)
        {
            Hue.do_modal_filter("played")
        }
    }

    Hue.show_now_playing()
}

// Hides the Now Playing section in the header
Hue.hide_now_playing = function()
{
    $('#header_now_playing_area').css('display', 'none')
    Hue.horizontal_separator.separate("header_radio")
}

// Shows the Now Playing section in the header
Hue.show_now_playing = function()
{
    $('#header_now_playing_area').css('display', 'flex')
    Hue.horizontal_separator.separate("header_radio")
}

// Starts the loaded radio
Hue.start_radio = function()
{
    if(!Hue.loaded_radio)
    {
        return false
    }

    if(Hue.loaded_radio.type === "audio")
    {
        $('#audio_player').attr("src", Hue.loaded_radio.source)
        $('#audio_player')[0].play()
    }

    else if(Hue.loaded_radio.type === "youtube")
    {
        if(Hue.youtube_player)
        {
            Hue.youtube_player.playVideo()
        }

        else
        {
            return false
        }
    }

    else if(Hue.loaded_radio.type === "soundcloud")
    {
        if(Hue.soundcloud_player)
        {
            Hue.soundcloud_player.play()
        }

        else
        {
            return false
        }
    }

    $('#header_radio_playing_icon').css('display', 'flex')
    $('#header_radio_volume_area').css('display', 'flex')
    $('#toggle_now_playing_text').html('Stop Radio')

    Hue.horizontal_separator.separate("header_radio")

    Hue.radio_started = true

    if(Hue.stop_radio_timeout)
    {
        Hue.clear_automatic_stop_radio()
    }

    if(Hue.get_setting("stop_tv_on_radio_play"))
    {
        Hue.stop_tv(false)
    }

    Hue.radio_started_date = Date.now()
}

// Destroys all unused radio players
Hue.hide_radio = function(item=false)
{
    $("#media_radio .media_radio_item").each(function()
    {
        let id = $(this).attr("id")
        let type = id.replace("media_", "").replace("_audio_container", "")

        if(!item || item.type !== type)
        {
            let new_el = $(`<div id='${id}' class='media_radio_item'></div>`)
            $(this).replaceWith(new_el)
            Hue[`${type}_player`] = undefined
            Hue[`${type}_player_requested`] = false
            Hue[`${type}_player_request`] = false
        }
    })
}

// Stops all defined radio players
Hue.stop_radio = function(complete_stop=true)
{
    if($("#audio_player").length > 0)
    {
        $("#audio_player")[0].pause()
        $("#audio_player")[0].src = ""
    }

    if(Hue.youtube_player)
    {
        Hue.youtube_player.stopVideo()
    }

    if(Hue.soundcloud_player)
    {
        Hue.soundcloud_player.pause()
    }

    if(complete_stop)
    {
        $('#header_radio_playing_icon').css('display', 'none')
        $('#header_radio_volume_area').css('display', 'none')
        $('#toggle_now_playing_text').html('Start Radio')

        Hue.horizontal_separator.separate("header_radio")

        Hue.radio_started = false

        if(Hue.stop_radio_timeout)
        {
            Hue.clear_automatic_stop_radio()
        }
    }

    Hue.radio_started_date = 0
}

// Toggles the radio on or off
Hue.toggle_play_radio = function()
{
    if(Hue.radio_started)
    {
        Hue.stop_radio()
    }

    else
    {
        Hue.start_radio()
    }
}

// Starts the Icecast metadata fetch loop
Hue.start_metadata_loop = function()
{
    setInterval(function()
    {
        if(Hue.get_radio_metadata_enabled())
        {
            Hue.get_radio_metadata()
        }
    }, Hue.config.radio_metadata_interval_duration)
}

// Starts scroll events on the header radio volume control
Hue.start_volume_scroll = function()
{
    $('#header')[0].addEventListener("wheel", function(e)
    {
        if(!Hue.radio_started)
        {
            return false
        }

        let direction = e.deltaY > 0 ? 'down' : 'up'

        if(direction === 'up')
        {
            Hue.radio_volume_increase()
        }

        else if(direction === 'down')
        {
            Hue.radio_volume_decrease()
        }
    })
}

// Updates the header radio volume widget
Hue.set_radio_volume_widget = function(n=false)
{
    if(n === false)
    {
        n = Hue.room_state.radio_volume
    }

    $('#volume').text(`${Hue.utilz.to_hundred(n)} %`)
}

// Sets the radio volume
Hue.set_radio_volume = function(nv=false, changed=true, update_slider=true)
{
    if(typeof nv !== "number")
    {
        nv = Hue.room_state.radio_volume
    }

    nv = Hue.utilz.round(nv, 1)

    if(nv > 1)
    {
        nv = 1
    }

    else if(nv < 0)
    {
        nv = 0
    }

    Hue.room_state.radio_volume = nv

    let vt = Hue.utilz.to_hundred(nv)

    if($("#audio_player").length > 0)
    {
        $('#audio_player')[0].volume = Hue.room_state.radio_volume
    }

    if(Hue.youtube_player)
    {
        if(vt > 0)
        {
            Hue.youtube_player.unMute()
        }

        Hue.youtube_player.setVolume(vt)
    }

    if(Hue.soundcloud_player)
    {
        Hue.soundcloud_player.setVolume(vt)
    }

    if(changed)
    {
        Hue.set_radio_volume_widget(nv)

        if(update_slider)
        {
            Hue.set_media_menu_radio_volume(nv)
        }

        Hue.save_room_state()
    }
}

// Increases the radio volume
Hue.radio_volume_increase = function(step=0.1)
{
    if(Hue.room_state.radio_volume === 1)
    {
        return false
    }

    let nv = Hue.room_state.radio_volume + step

    Hue.set_radio_volume(nv)
}

// Decreases the radio volume
Hue.radio_volume_decrease = function(step=0.1)
{
    if(Hue.room_state.radio_volume === 0)
    {
        return false
    }

    let nv = Hue.room_state.radio_volume - step

    Hue.set_radio_volume(nv)
}

// Shows the Recently Played list
Hue.show_played = function(filter=false)
{
    Hue.msg_played.show(function()
    {
        if(filter)
        {
            $("#played_filter").val(filter)
            Hue.do_modal_filter()
        }
    })
}

// Announces room radio mode changes
Hue.announce_room_radio_mode_change = function(data)
{
    Hue.show_room_notification(data.username, `${data.username} changed the radio mode to ${data.what}`)
    Hue.set_room_radio_mode(data.what)
    Hue.change_radio_visibility()
    Hue.check_media_permissions()
    Hue.update_footer_separators()
}

// Changes the room radio mode
Hue.change_room_radio_mode = function(what)
{
    if(!Hue.check_op_permission(Hue.role, "media"))
    {
        return false
    }

    let modes = ["enabled", "disabled", "locked"]

    if(!modes.includes(what))
    {
        Hue.feedback(`Valid radio modes: ${modes.join(" ")}`)
        return false
    }

    if(what === Hue.room_radio_mode)
    {
        Hue.feedback(`Radio mode is already set to that`)
        return false
    }

    Hue.socket_emit("change_radio_mode", {what:what})
}

// Clears the timeout to automatically stop the radio
Hue.clear_automatic_stop_radio = function(announce=true)
{
    clearTimeout(Hue.stop_radio_timeout)

    Hue.stop_radio_timeout = undefined
    Hue.stop_radio_delay = 0

    if(announce)
    {
        Hue.feedback("Radio won't stop automatically anymore")
    }
}

// Sends a restart signal to reload the radio for everyone
Hue.restart_radio = function()
{
    Hue.change_radio_source("restart")
    Hue.msg_radio_picker.close()
}

// Used to change the radio
// Shows the radio picker window to input a URL
Hue.show_radio_picker = function()
{
    if(!Hue.can_radio)
    {
        Hue.feedback("You don't have radio permission")
        return false
    }

    Hue.msg_radio_picker.show(function()
    {
        $("#radio_source_picker_input").focus()
        Hue.scroll_modal_to_bottom("radio_picker")
    })
}

// Room radio mode setter
Hue.set_room_radio_mode = function(what)
{
    Hue.room_radio_mode = what
    Hue.config_admin_room_radio_mode()
}

// This programs the radio to stop automatically after a specified time
Hue.stop_radio_in = function(minutes)
{
    if(!Hue.radio_started)
    {
        Hue.feedback("Radio is not started")
        return false
    }

    Hue.clear_automatic_stop_radio(false)

    let d = 1000 * 60 * minutes

    Hue.stop_radio_delay = minutes

    Hue.stop_radio_timeout = setTimeout(function()
    {
        if(Hue.radio_started)
        {
            Hue.stop_radio()
        }
    }, d)

    let s

    if(minutes === 1)
    {
        s = "1 minute"
    }

    else
    {
        s = `${minutes} minutes`
    }

    Hue.feedback(`Radio will stop automatically in ${s}`)
}

// Sets the media menu radio slider
Hue.set_media_menu_radio_volume = function(n=false)
{
    if(n === false)
    {
        n = Hue.room_state.radio_volume
    }

    else if(n === "increase")
    {
        n = Hue.room_state.radio_volume + 0.2

        if(n > 1)
        {
            n = 1
        }
    }

    else if(n === "decrease")
    {
        n = Hue.room_state.radio_volume - 0.2

        if(n < 0)
        {
            n = 0
        }
    }

    else if(n === "max")
    {
        n = 1
    }
    
    else if(n === "min")
    {
        n = 0
    }

    else if(n === "default")
    {
        n = Hue.config.room_state_default_radio_volume
    }

    $("#media_menu_radio_volume").val(n)

    Hue.set_radio_volume(n, true, false)
}

Hue.radio_picker_submit = function()
{
    let val = $("#radio_source_picker_input").val().trim()

    if(val !== "")
    {
        Hue.change_radio_source(val)
        Hue.msg_radio_picker.close()
    }
}

// Some configurations for the header radio widget
Hue.setup_radio_widget = function()
{
    $("#toggle_radio_state").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            if(Hue.radio_started)
            {
                Hue.stop_radio()
                Hue.start_radio()
            }
        }
    })
    
    $("#toggle_radio_state").on("mouseenter", function(e)
    {
        let title 

        if(Hue.radio_started_date)
        {
            title = `Started: ${Hue.utilz.capitalize_words(timeago.format(Hue.radio_started_date))}`
        }

        else
        {
            title = ""
        }

        $(this).attr("title", title)
    })
    
    $("#header_now_playing_controls").on("auxclick", function(e)
    {
        if(e.which === 2)
        {
            Hue.search_on('youtube', $(this).data('q'))
        }
    })

    Hue.set_radio_volume_widget()
}