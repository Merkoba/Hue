// JQuery function to turn url text into actual links
jQuery.fn.urlize = function(stop_propagation=true)
{
    try
    {
        let html = this.html()
    
        if(!html || !Hue.utilz.includes_url(html))
        {
            return false
        }

        let split = html.split(" ")
        let matches = []
        let reg = /(?:^|\s)\"?(https?:\/\/(?:[^"|\s]*)+)/

        for(let s of split)
        {
            let result = reg.exec(s)

            if(result)
            {
                matches.push(result[1])
            }
        }

        if(matches.length > 0)
        {
            on_matches(matches, html, this)
        }

        function on_matches(matches, html, obj)
        {
            let cls = "generic action"

            if(stop_propagation)
            {
                cls += " stop_propagation"
            }

            let used_urls = []

            for(let i=0; i<matches.length; i++)
            {
                let url = matches[i]

                if(used_urls.includes(url))
                {
                    continue
                }

                used_urls.push(url)
            
                let rep = new RegExp(Hue.utilz.escape_special_characters(matches[i]), "g")

                let u = matches[i]

                if(u.length > Hue.config.max_displayed_url)
                {
                    u = `${u.substring(0, Hue.config.max_displayed_url)}...`
                }

                html = html.replace(rep, `<a class='${cls}' target='_blank' href='${url}'>${u}</a>`)
            }

            $(obj).html(html)

            $(obj).find(".stop_propagation").each(function()
            {
                $(this).click(function(e)
                {
                    e.stopPropagation()
                })
            })
        }
    }

    catch(err) {}
}

// Goes to a url
Hue.goto_url = function(u, mode="same", encode=false)
{
    if(encode)
    {
        u = encodeURIComponent(u)
    }

    if(mode === "tab")
    {
        window.open(u, "_blank")
    }

    else
    {
        Hue.user_leaving = true
        window.location = u
    }
}

// Opens a new tab with a search query on a specified search engine
Hue.search_on = function(site, q)
{
    q = encodeURIComponent(q)

    if(site === 'google')
    {
        Hue.goto_url(`https://www.google.com/search?q=${q}`, "tab")
    }

    else if(site === 'soundcloud')
    {
        Hue.goto_url(`https://soundcloud.com/search?q=${q}`, "tab")
    }

    else if(site === 'youtube')
    {
        Hue.goto_url(`https://www.youtube.com/results?search_query=${q}`, "tab")
    }
}

// Setups drop listeners
// This is used to display actions when dropping a URL
// Like changing the tv when dropping a YouTube URL
Hue.setup_drag_events = function()
{
    $("#main_container")[0].addEventListener("drop", function(e)
    {
        let text = e.dataTransfer.getData('text/plain').trim()

        if(text)
        {
            Hue.check_handle_url_options(text)
            $("#handle_url_input").val(text)
            Hue.handled_url = text
            Hue.msg_handle_url.show()
        }
    })

    $("#handle_url_chat").click(function()
    {
        Hue.process_message({message:Hue.handled_url})
        Hue.close_all_modals()
    })

    $("#handle_url_image").click(function()
    {
        Hue.change_image_source(Hue.handled_url)
        Hue.close_all_modals()
    })

    $("#handle_url_tv").click(function()
    {
        Hue.change_tv_source(Hue.handled_url)
        Hue.close_all_modals()
    })

    $("#handle_url_radio").click(function()
    {
        Hue.change_radio_source(Hue.handled_url)
        Hue.close_all_modals()
    })

    $("#handle_url_input").on("input blur", function()
    {
        Hue.handled_url = $(this).val().trim()
        Hue.check_handle_url_options(Hue.handled_url)
    })
}

// Changes button visibility based on url
Hue.check_handle_url_options = function(text)
{
    if(text && text.length < Hue.config.max_input_length)
    {
        $("#handle_url_chat").css("display", "inline-block")
    }

    else
    {
        $("#handle_url_chat").css("display", "none")
    }

    if(Hue.change_image_source(text, true))
    {
        $("#handle_url_image").css("display", "inline-block")
    }

    else
    {
        $("#handle_url_image").css("display", "none")
    }

    if(Hue.change_tv_source(text, true))
    {
        $("#handle_url_tv").css("display", "inline-block")
    }

    else
    {
        $("#handle_url_tv").css("display", "none")
    }

    if(Hue.change_radio_source(text, true))
    {
        $("#handle_url_radio").css("display", "inline-block")
    }

    else
    {
        $("#handle_url_radio").css("display", "none")
    }

    Hue.horizontal_separator.separate("handle_url_container")
}

// Setups the Open URL picker window
Hue.setup_open_url = function()
{
    $("#open_url_menu_open").click(function()
    {
        Hue.goto_url(Hue.open_url_source, "tab")
        Hue.close_all_modals()
    })

    $("#open_url_menu_copy").click(function()
    {
        Hue.copy_string(Hue.open_url_source)
        Hue.close_all_modals()
    })

    $("#open_url_menu_copy_title").click(function()
    {
        Hue.copy_string(Hue.open_url_title)
        Hue.close_all_modals()
    })

    $("#open_url_menu_load").click(function()
    {
        Hue[`toggle_${Hue.open_url_media_type}`](true)
        Hue.change({type:Hue.open_url_media_type, item:Hue.open_url_data, force:true})
        Hue[`toggle_lock_${Hue.open_url_media_type}`](true)
        Hue.close_all_modals()
    })

    $("#open_url_menu_change").click(function()
    {
        if(confirm("This will change it for everyone. Are you sure?"))
        {
            Hue[`change_${Hue.open_url_media_type}_source`](Hue.open_url_data.source)
            Hue.close_all_modals()
        }
    })
}

// Shows the Open URL menu
// This is used to show actions for links and media
Hue.open_url_menu = function(args={})
{
    let def_args =
    {
        source: false,
        type: 1,
        data: {},
        media_type: false,
        title: false
    }

    args = Object.assign(def_args, args)

    Hue.open_url_title = args.title || args.data.title

    if(Hue.open_url_title && Hue.open_url_title !== args.source)
    {
        $("#open_url_menu_copy_title").css("display", "inline-block")
    }

    else
    {
        $("#open_url_menu_copy_title").css("display", "none")
    }

    if(args.media_type && args.data)
    {
        let mtype = Hue.fix_images_string(args.media_type)
        let mode = Hue[`room_${mtype}_mode`]

        if((mode === "enabled" || mode === "locked") && args.data !== Hue[`loaded_${args.media_type}`])
        {
            $("#open_url_menu_load").css("display", "inline-block")
        }

        else
        {
            $("#open_url_menu_load").css("display", "none")
        }

        if(Hue[`change_${args.media_type}_source`](args.source, true))
        {
            $("#open_url_menu_change").css("display", "inline-block")
        }

        else
        {
            $("#open_url_menu_change").css("display", "none")
        }
    }

    else
    {
        $("#open_url_menu_load").css("display", "none")
        $("#open_url_menu_change").css("display", "none")
    }

    Hue.horizontal_separator.separate("open_url_container")

    Hue.open_url_source = args.source
    Hue.open_url_data = args.data
    Hue.open_url_media_type = args.media_type

    let title = Hue.utilz.get_limited_string(args.source, Hue.config.url_title_max_length)

    Hue.msg_open_url.set_title(title)
    Hue.msg_open_url.show()
}

// Checks if a URL of a media type is from a blacklisted or whitelisted domain
Hue.check_domain_list = function(media_type, src)
{
    let list_type = Hue.config[`${media_type}_domain_white_or_black_list`]

    if(list_type !== "white" && list_type !== "black")
    {
        return false
    }

    let list = Hue.config[`${media_type}_domain_list`]

    if(list.length === 0)
    {
        return false
    }

    let domain = Hue.utilz.get_root(src)
    let includes = list.includes(domain) || list.includes(`${domain}/`)

    if(list_type === "white")
    {
        if(!includes)
        {
            return true
        }
    }

    else if(list_type === "black")
    {
        if(includes)
        {
            return true
        }
    }

    return false
}

// Custom chat search to show links
Hue.show_links = function()
{
    Hue.show_chat_search("http:// https://")
}