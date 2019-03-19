// Process user's input messages
// Checks if it's a command and executes it
// Or sends a chat message to the server
Hue.process_message = function(args={})
{
    let def_args =
    {
        message: "",
        to_history: true,
        clr_input: true,
        callback: false,
        edit_id: false
    }

    args = Object.assign(def_args, args)

    let message_split = args.message.split("\n")
    let num_lines = message_split.length

    args.message = Hue.utilz.clean_multiline(args.message)

    if(num_lines === 1 && Hue.is_command(args.message) && !args.edit_id)
    {
        args.message = Hue.utilz.clean_string2(args.message)

        let and_split = args.message.split(" && ")
        let lc_message = args.message.toLowerCase()
        let more_stuff

        if(lc_message.startsWith("/js ") || lc_message.startsWith("/js2 "))
        {
            more_stuff = lc_message.includes("/endjs")
        }

        else if(lc_message.startsWith("/input "))
        {
            more_stuff = args.message.includes("/endinput")
        }

        else if(lc_message.startsWith("/whisper ") || lc_message.startsWith("/whisper2 "))
        {
            more_stuff = args.message.includes("/endwhisper")
        }

        else
        {
            more_stuff = true
        }

        if(and_split.length > 1 && more_stuff)
        {
            if(args.to_history)
            {
                Hue.add_to_input_history(args.message)
            }

            Hue.clear_input()

            let ssplit = args.message.split(" ")
            let cmds = []
            let cmd = ""
            let cmd_mode = "normal"

            for(let p=0; p<ssplit.length; p++)
            {
                let sp = ssplit[p]
                let lc_sp = sp.toLowerCase()

                if(cmd_mode === "js")
                {
                    if(lc_sp === "/endjs")
                    {
                        cmds.push(cmd)
                        cmd = ""
                        cmd_mode = "normal"
                    }

                    else
                    {
                        cmd += ` ${sp}`
                    }
                }

                else if(cmd_mode === "input")
                {
                    if(lc_sp === "/endinput")
                    {
                        cmds.push(cmd)
                        cmd = ""
                        cmd_mode = "normal"
                    }

                    else
                    {
                        cmd += ` ${sp}`
                    }
                }

                else if(cmd_mode === "whisper")
                {
                    if(lc_sp === "/endwhisper")
                    {
                        cmds.push(cmd)
                        cmd = ""
                        cmd_mode = "normal"
                    }

                    else
                    {
                        cmd += ` ${sp}`
                    }
                }

                else
                {
                    if(Hue.command_aliases[sp] !== undefined)
                    {
                        ssplit.splice(p, 1, ...Hue.command_aliases[sp].split(" "))
                        p -= 1
                        continue
                    }

                    if(cmd === "")
                    {
                        if(sp !== "&&")
                        {
                            cmd = sp

                            if(lc_sp === "/js" || lc_sp === "/js2")
                            {
                                cmd_mode = "js"
                            }

                            else if(lc_sp === "/input")
                            {
                                cmd_mode = "input"
                            }

                            else if(lc_sp === "/whisper" || lc_sp === "/whisper2")
                            {
                                cmd_mode = "whisper"
                            }
                        }
                    }

                    else
                    {
                        if(sp === "&&")
                        {
                            cmds.push(cmd)
                            cmd = ""
                        }

                        else
                        {
                            cmd += ` ${sp}`
                        }
                    }
                }
            }

            if(cmd)
            {
                cmds.push(cmd)
            }

            let qcmax = 0
            let cqid

            while(true)
            {
                cqid = Hue.utilz.get_random_string(5) + Date.now()

                if(Hue.commands_queue[cqid] === undefined)
                {
                    break
                }

                qcmax += 1

                if(qcmax >= 100)
                {
                    if(args.callback)
                    {
                        return args.callback(false)
                    }

                    else
                    {
                        return false
                    }
                }
            }

            Hue.commands_queue[cqid] = cmds
            Hue.run_commands_queue(cqid)

            if(args.callback)
            {
                return args.callback(true)
            }

            else
            {
                return true
            }
        }

        let msplit = args.message.split(" ")
        let alias_cmd = msplit[0].trim()
        let alias_cmd_2, needs_confirm

        if(alias_cmd.endsWith("?"))
        {
            alias_cmd_2 = alias_cmd.slice(0, -1)
            needs_confirm = true
        }

        else
        {
            alias_cmd_2 = alias_cmd
            needs_confirm = false
        }

        let alias = Hue.command_aliases[alias_cmd_2]

        if(alias !== undefined)
        {
            let alias_arg = msplit.slice(1).join(" ").trim()
            let full_alias = `${alias} ${alias_arg}`.trim()

            if(alias_cmd_2.startsWith("/X"))
            {
                args.to_history = false
            }

            if(args.to_history)
            {
                Hue.add_to_input_history(args.message)
            }

            if(needs_confirm)
            {
                if(confirm(`Are you sure you want to execute ${alias_cmd_2}?`))
                {
                    Hue.process_message(
                    {
                        message: full_alias,
                        to_history: false,
                        clr_input: args.clr_input
                    })
                }

                else
                {
                    if(args.callback)
                    {
                        return args.callback(false)
                    }

                    else
                    {
                        return false
                    }
                }
            }

            else
            {
                Hue.process_message(
                {
                    message: full_alias,
                    to_history: false,
                    clr_input: args.clr_input
                })
            }
        }

        else
        {
            let ans = Hue.execute_command(args.message, {to_history:args.to_history, clr_input:args.clr_input})

            args.to_history = ans.to_history
            args.clr_input = ans.clr_input
        }
    }

    else
    {
        if(Hue.can_chat)
        {
            args.message = Hue.utilz.clean_string10(Hue.utilz.clean_multiline(args.message))

            if(args.message.length === 0)
            {
                Hue.clear_input()

                if(args.callback)
                {
                    return args.callback(false)
                }

                else
                {
                    return false
                }
            }

            if(num_lines > Hue.config.max_num_newlines)
            {
                if(args.callback)
                {
                    return args.callback(false)
                }

                else
                {
                    return false
                }
            }

            if(args.message.length > Hue.config.max_input_length)
            {
                args.message = args.message.substring(0, Hue.config.max_input_length)
            }

            Hue.socket_emit('sendchat', {message:args.message, edit_id:args.edit_id})
        }

        else
        {
            Hue.cant_chat()
        }
    }

    if(args.to_history)
    {
        Hue.add_to_input_history(args.message)
    }

    if(args.clr_input)
    {
        Hue.clear_input()
    }

    if(args.callback)
    {
        return args.callback(true)
    }

    else
    {
        return true
    }
}

// This generates all user chat messages inserted into the chat
Hue.update_chat = function(args={})
{
    let def_args =
    {
        id: false,
        user_id: false,
        username: "",
        message: "",
        prof_image: "",
        date: false,
        third_person: false,
        brk: false,
        public: true,
        link_title: false,
        link_image: false,
        link_url: false,
        edited: false,
        just_edited: false
    }

    args = Object.assign(def_args, args)

    if(Hue.check_ignored_words(args.message, args.username))
    {
        return false
    }

    if(args.username)
    {
        if(Hue.user_is_ignored(args.username))
        {
            return false
        }
    }

    if(args.message.startsWith('//'))
    {
        args.message = args.message.slice(1)
    }

    let message_classes = "message chat_message"
    let container_classes = "chat_content_container chat_menu_button_main"
    let content_classes = "chat_content dynamic_title"
    let d = args.date ? args.date : Date.now()
    let nd = Hue.utilz.nice_date(d)
    let pi

    if(args.prof_image === "" || args.prof_image === undefined)
    {
        pi = Hue.config.default_profile_image_url
    }

    else
    {
        pi = args.prof_image
    }

    let image_preview = false
    let image_preview_src_original = false
    let image_preview_text = false
    let starts_me = args.message.startsWith('/me ') || args.message.startsWith('/em ')

    if(!starts_me && Hue.get_setting("show_image_previews"))
    {
        let ans = Hue.make_image_preview(args.message)

        image_preview = ans.image_preview
        image_preview_src_original = ans.image_preview_src_original
        image_preview_text = ans.image_preview_text
    }

    let link_preview = false
    let link_preview_text = false

    if(!starts_me && !image_preview && args.link_url && Hue.get_setting("show_link_previews"))
    {
        let ans = Hue.make_link_preview(args.message, args.link_url, args.link_title, args.link_image)
        link_preview = ans.link_preview
        link_preview_text = ans.link_preview_text
    }

    let highlighted = false
    let preview_text_classes = ""

    if(args.username !== Hue.username)
    {
        if(image_preview && image_preview_text)
        {
            if(Hue.check_highlights(image_preview_text))
            {
                preview_text_classes += " highlighted4"
                highlighted = true
            }
        }

        else if(link_preview && link_preview_text)
        {
            if(Hue.check_highlights(link_preview_text))
            {
                preview_text_classes += " highlighted4"
                highlighted = true
            }
        }

        else
        {
            if(Hue.check_highlights(args.message))
            {
                content_classes += " highlighted4"
                highlighted = true
            }
        }
    }

    let fmessage

    if(starts_me || args.third_person)
    {
        let tpt

        if(starts_me)
        {
            tpt = args.message.substr(4)
        }

        else
        {
            tpt = args.message
        }

        if(!args.brk)
        {
            args.brk = "<i class='icon2c fa fa-user-circle'></i>"
        }

        message_classes += " thirdperson"
        container_classes += " chat_content_container_third"

        let s = `
        <div class='${message_classes}'>
            <div class='chat_third_container'>
                <div class='brk chat_third_brk'>${args.brk}</div>
                <div class='${container_classes}'>
                    <div class='chat_menu_button_container unselectable'>
                        <i class='icon5 fa fa-ellipsis-h chat_menu_button action chat_menu_button_menu'></i>
                    </div>

                    <div class='chat_third_content'>
                        <span class='chat_uname action'></span><span class='${content_classes}' title='${nd}' data-otitle='${nd}' data-date='${d}'></span>
                    </div>

                    <div class='message_edited_label'>(Edited)</div>

                    <div class='message_edit_container'>
                        <textarea class='message_edit_area'></textarea>
                        <div class='message_edit_buttons unselectable'>
                            <div class='message_edit_button action message_edit_cancel'>Cancel</div>
                            <div class='message_edit_button action message_edit_submit'>Submit</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

        fmessage = $(s)
        fmessage.find('.chat_content').eq(0).text(tpt)
        fmessage.find(".chat_content_container").eq(0).data("original_message", tpt)
    }

    else
    {
        let s = `
        <div class='${message_classes}'>
            <div class='chat_left_side'>
                <div class='chat_profile_image_container round_image_container unselectable action4'>
                    <img class='chat_profile_image' src='${pi}'>
                </div>
            </div>
            <div class='chat_right_side'>
                <div class='chat_uname_container'>
                    <div class='chat_uname action'></div>
                </div>
                <div class='chat_container'>
                    <div class='${container_classes}'>

                        <div class='chat_menu_button_container unselectable'>
                            <i class='icon5 fa fa-ellipsis-h chat_menu_button action chat_menu_button_menu'></i>
                        </div>

                        <div class='${content_classes}' title='${nd}' data-otitle='${nd}' data-date='${d}'></div>

                        <div class='message_edited_label'>(Edited)</div>

                        <div class='message_edit_container'>
                            <textarea class='message_edit_area'></textarea>
                            <div class='message_edit_buttons unselectable'>
                                <div class='message_edit_button action message_edit_cancel'>Cancel</div>
                                <div class='message_edit_button action message_edit_submit'>Submit</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

        fmessage = $(s)
        fmessage.find(".chat_content_container").eq(0).data("original_message", args.message)
        fmessage.find(".chat_profile_image_container").eq(0).attr("title", args.username)

        if(image_preview)
        {
            fmessage.find('.chat_content').eq(0).html(image_preview)
            fmessage.find('.image_preview_text').eq(0).addClass(preview_text_classes)
        }

        else if(link_preview)
        {
            fmessage.find('.chat_content').eq(0).html(link_preview)
            fmessage.find('.link_preview_text').eq(0).addClass(preview_text_classes)
        }

        else
        {
            fmessage.find('.chat_content').eq(0).html(Hue.replace_markdown(Hue.make_html_safe(args.message)))
        }
    }

    let huname = fmessage.find('.chat_uname').eq(0)

    huname.text(args.username)
    huname.data("prof_image", pi)

    fmessage.find('.chat_profile_image').eq(0).on("error", function()
    {
        if($(this).attr("src") !== Hue.config.default_profile_image_url)
        {
            $(this).attr("src", Hue.config.default_profile_image_url)
        }
    })

    let has_embed = false

    if(image_preview || link_preview)
    {
        has_embed = true
    }

    let first_url = false

    if(image_preview)
    {
        first_url = image_preview_src_original
    }

    else if(link_preview)
    {
        first_url = args.link_url
    }

    else
    {
        first_url = Hue.utilz.get_first_url(args.message)
    }

    fmessage.data("user_id", args.user_id)
    fmessage.data("public", args.public)
    fmessage.data("date", d)
    fmessage.data("highlighted", highlighted)
    fmessage.data("uname", args.username)
    fmessage.data("mode", "chat")
    fmessage.data("has_embed", has_embed)
    fmessage.data("first_url", first_url)

    let chat_content_container = fmessage.find(".chat_content_container").eq(0)
    let chat_content = fmessage.find(".chat_content").eq(0)
    let edited_label = fmessage.find(".message_edited_label").eq(0)

    if(args.edited)
    {
        edited_label.css("display", "block")
    }

    chat_content_container.data("id", args.id)
    chat_content_container.data("edited", args.edited)

    if(!image_preview && !link_preview)
    {
        chat_content.urlize()
    }

    if(image_preview)
    {
        Hue.setup_image_preview(fmessage, image_preview_src_original, args.user_id)
    }

    if(link_preview)
    {
        Hue.setup_link_preview(fmessage, args.link_url, args.user_id)
    }

    Hue.setup_whispers_click(fmessage, args.username)

    let message_id = Hue.add_to_chat(
    {
        id: args.id,
        message: fmessage,
        save: true,
        just_edited: args.just_edited
    }).message_id

    if(!args.edited)
    {
        if(args.username !== Hue.username)
        {
            if(highlighted)
            {
                Hue.on_highlight()
            }

            else
            {
                Hue.on_activity("message")
            }
        }
    }

    return {message_id:message_id}
}

// This generates all announcements inserted into the chat
Hue.chat_announce = function(args={})
{
    let def_args =
    {
        id: false,
        brk: "",
        message: "",
        highlight: false,
        title: false,
        onclick: false,
        container_id: false,
        date: false,
        type: "normal",
        info1: "",
        info2: "",
        username: false,
        open_profile: false,
        public: false,
        link_title: false,
        link_image: false,
        link_url: false,
        preview_image: false,
        comment: "",
        comment_icon: true,
        comment_onclick: false,
        user_id: false,
        replace_markdown: false,
        in_log: true
    }

    args = Object.assign(def_args, args)

    let ignore = false

    if(Hue.check_ignored_words(args.message, args.username))
    {
        ignore = true
    }

    if(args.username)
    {
        if(Hue.user_is_ignored(args.username))
        {
            ignore = true
        }
    }

    let message_classes = "message announcement"
    let container_classes = "announcement_content_container chat_menu_button_main"
    let split_classes = "announcement_content_split dynamic_title"
    let content_classes = "announcement_content"
    let brk_classes = "brk announcement_brk"

    let container_id = " "

    if(args.container_id)
    {
        container_id = ` id='${args.container_id}' `
    }

    let highlighted = false

    if(args.highlight)
    {
        content_classes += " highlighted4"
        highlighted = true
    }

    let d = args.date ? args.date : Date.now()
    let t = args.title ? args.title : Hue.utilz.nice_date(d)
    let image_preview = false
    let image_preview_src_original = false
    let image_preview_text = false

    if(args.preview_image && Hue.get_setting("show_image_previews"))
    {
        let ans = Hue.make_image_preview(args.message)
        image_preview = ans.image_preview
        image_preview_src_original = ans.image_preview_src_original
        image_preview_text = ans.image_preview_text
    }

    let comment = ""

    if(args.comment)
    {
        let cls = "announcement_comment"

        if(args.username && args.username !== Hue.username)
        {
            if(!highlighted && Hue.check_highlights(args.comment))
            {
                cls += " highlighted4"
                highlighted = true
            }
        }

        let c = Hue.replace_markdown(Hue.make_html_safe(args.comment))

        if(args.comment_icon)
        {
            comment = `<div class='${cls}'><div class='announcement_comment_inner flex_row_center'><i class='fa fa-comment-o icon2'></i>&nbsp;&nbsp;${c}</div></div>`
        }

        else
        {
            comment = `<div class='${cls}'><div class='announcement_comment_inner flex_row_center'>${c}</div></div>`
        }
    }

    else
    {
        comment = `<div class='announcement_comment'></div>`
    }

    let link_preview = false
    let link_preview_text = false

    if(!image_preview && args.link_url && Hue.get_setting("show_link_previews"))
    {
        let ans = Hue.make_link_preview(args.message, args.link_url, args.link_title, args.link_image)
        link_preview = ans.link_preview
        link_preview_text = ans.link_preview_text
    }

    if((args.onclick || (args.username && args.open_profile)) && !link_preview && !image_preview)
    {
        content_classes += " pointer action"
        brk_classes += " pointer action"
    }

    let first_url = false

    if(image_preview)
    {
        first_url = image_preview_src_original
    }

    else if(link_preview)
    {
        first_url = args.link_url
    }

    let preview_text_classes = ""

    if(args.username !== Hue.username)
    {
        if(image_preview && image_preview_text)
        {
            if(Hue.check_highlights(image_preview_text))
            {
                preview_text_classes += " highlighted4"
                highlighted = true
            }
        }

        else if(link_preview && link_preview_text)
        {
            if(Hue.check_highlights(link_preview_text))
            {
                preview_text_classes += " highlighted4"
                highlighted = true
            }
        }
    }

    let s = `
    <div${container_id}class='${message_classes}'>
        <div class='${brk_classes}'>${args.brk}</div>
        <div class='${container_classes}'>
            <div class='chat_menu_button_container unselectable'>
                <i class='icon5 fa fa-ellipsis-h chat_menu_button action chat_menu_button_menu'></i>
            </div>
            <div class='${split_classes}'>
                <div class='${content_classes}'></div>
                ${comment}
            </div>
        </div>
    </div>`

    let fmessage = $(s)
    let content = fmessage.find('.announcement_content').eq(0)
    let comment_el = fmessage.find('.announcement_comment_inner').eq(0)
    let split = fmessage.find('.announcement_content_split').eq(0)
    let brk = fmessage.find('.brk').eq(0)

    split.attr("title", t)
    split.data("otitle", t)
    split.data("date", d)

    if(image_preview)
    {
        content.html(image_preview)
        content.find(".image_preview_text").eq(0).addClass(preview_text_classes)
        Hue.setup_image_preview(fmessage, image_preview_src_original, "none")
    }

    else if(link_preview)
    {
        content.html(link_preview)
        content.find(".link_preview_text").eq(0).addClass(preview_text_classes)
        Hue.setup_link_preview(fmessage, args.link_url, "none")
    }

    else
    {
        if(args.replace_markdown)
        {
            content.html(Hue.replace_markdown(Hue.make_html_safe(args.message))).urlize()
        }

        else
        {
            content.text(args.message).urlize()
        }
    }

    if(args.comment)
    {
        comment_el.urlize()

        if(args.username)
        {
            Hue.setup_whispers_click(comment_el, args.username)
        }

        if(args.comment_onclick)
        {
            comment_el.click(args.comment_onclick)
            comment_el.addClass("special_link")
        }
    }

    if(args.onclick && !link_preview && !image_preview)
    {
        content.on("click", args.onclick)
        brk.on("click", args.onclick)
    }

    else if(args.username && args.open_profile)
    {
        let pif = function()
        {
            Hue.show_profile(args.username)
        }

        content.on("click", pif)
        brk.on("click", pif)
    }

    fmessage.data("id", args.id)
    fmessage.data("public", args.public)
    fmessage.data("date", d)
    fmessage.data("highlighted", highlighted)
    fmessage.data("type", args.type)
    fmessage.data("info1", args.info1)
    fmessage.data("info2", args.info2)
    fmessage.data("uname", args.username)
    fmessage.data("mode", "announcement")
    fmessage.data("first_url", first_url)
    fmessage.data("user_id", args.user_id)
    fmessage.data("in_log", args.in_log)

    let message_id

    if(!ignore)
    {
        message_id = Hue.add_to_chat({message:fmessage}).message_id

        if(highlighted)
        {
            Hue.on_highlight()
        }
    }

    return {message_id:message_id}
}

// This is a centralized function to insert all chat or announcement messages into the chat
Hue.add_to_chat = function(args={})
{
    let def_args =
    {
        id: false,
        message: false,
        notify: true,
        just_edited: false,
        fader: true
    }

    args = Object.assign(def_args, args)

    if(!args.message)
    {
        return false
    }

    let chat_area = $('#chat_area')
    let last_message = $("#chat_area > .message").last()
    let appended = false
    let mode = args.message.data("mode")
    let uname = args.message.data("uname")
    let date = args.message.data("date")
    let is_public = args.message.data("public")
    let highlighted = args.message.data("highlighted")
    let content_container, message_id

    if(mode === "chat")
    {
        content_container = args.message.find(".chat_content_container").eq(0)

        Hue.chat_content_container_id += 1
        content_container.data("chat_content_container_id", Hue.chat_content_container_id)

        if(args.just_edited && args.id)
        {
            $(".chat_content_container").each(function()
            {
                if($(this).data("id") === args.id)
                {
                    $(this).html(content_container.html())
                    $(this).data(content_container.data())
                    $(this).find(".message_edited_label").css("display", "inline-block")
                    Hue.goto_bottom(false, false)
                    return false
                }
            })

            return false
        }
    }

    if((args.message.hasClass("chat_message") && !args.message.hasClass("thirdperson")) &&
    (last_message.hasClass("chat_message") && !last_message.hasClass("thirdperson")))
    {
        if(args.message.find(".chat_uname").eq(0).text() === last_message.find(".chat_uname").eq(0).text())
        {
            if(last_message.find(".chat_content").length < Hue.config.max_same_post_messages)
            {
                let date_diff = args.message.find('.chat_content').last().data("date") - last_message.find('.chat_content').last().data("date")

                if(date_diff < Hue.config.max_same_post_diff)
                {
                    if(Hue.started && Hue.app_focused && args.fader)
                    {
                        content_container.addClass("fader")
                    }

                    content_container.data("date", date)
                    content_container.data("highlighted", highlighted)

                    last_message.find(".chat_container").eq(0).append(content_container)
                    message_id = last_message.data("message_id")

                    if(!last_message.data("highlighted"))
                    {
                        last_message.data("highlighted", highlighted)
                    }

                    appended = true
                }
            }
        }
    }

    if(!appended)
    {
        if(Hue.started && Hue.app_focused && args.fader)
        {
            args.message.addClass("fader")
        }

        let last = $("#chat_area > .message").last()
        let last_date = last.data("date")

        if(date && last_date)
        {
            if(date - last_date > Hue.config.old_activity_min)
            {
                chat_area.append(Hue.generate_vseparator(Hue.get_old_activity_message(last_date, date)))
            }
        }

        chat_area.append(args.message)

        if($("#chat_area > .message").length > Hue.config.chat_crop_limit)
        {
            $("#chat_area > .message").eq(0).remove()
        }

        Hue.message_id += 1
        args.message.data("message_id", Hue.message_id)
        args.message.addClass(`message_id_${Hue.message_id}`)
        message_id = Hue.message_id
    }

    if(Hue.started)
    {
        Hue.goto_bottom(false, false)

        if(highlighted)
        {
            if(Hue.room_state.last_highlight_date < date)
            {
                Hue.room_state.last_highlight_date = date
                Hue.save_room_state()
            }
        }
    }

    if(Hue.started && !Hue.app_focused)
    {
        if(content_container)
        {
            Hue.add_fresh_message(content_container)
        }

        else
        {
            Hue.add_fresh_message(args.message)
        }
    }

    Hue.scroll_timer()

    if(is_public && uname && date)
    {
        Hue.push_to_activity_bar(uname, date)
    }

    if(args.notify && Hue.started && highlighted)
    {
        Hue.electron_signal("highlighted")
    }

    return {message_id:message_id}
}

// Generates a string to indicate how much time has passed between one date and another
Hue.get_old_activity_message = function(last_date, date)
{
    let diff = date - last_date
    let s

    if(diff < Hue.HOUR)
    {
        let n = Math.floor(diff / 60 / 1000)

        if(n === 1)
        {
            s = `Over ${n} Minute Passed`
        }

        else
        {
            s = `Over ${n} Minutes Passed`
        }
    }

    else if(diff >= Hue.HOUR && diff < Hue.DAY)
    {
        let n = Math.floor(diff / 60 / 60 / 1000)

        if(n === 1)
        {
            s = `Over ${n} Hour Passed`
        }

        else
        {
            s = `Over ${n} Hours Passed`
        }
    }

    else if(diff >= Hue.DAY && diff < Hue.YEAR)
    {
        let n = Math.floor(diff / 24 / 60 / 60 / 1000)

        if(n === 1)
        {
            s = `Over ${n} Day Passed`
        }

        else
        {
            s = `Over ${n} Days Passed`
        }
    }

    else if(diff >= Hue.YEAR)
    {
        let n = Math.floor(diff / 365 / 24 / 60 / 60 / 1000)

        if(n === 1)
        {
            s = `Over ${n} Year Passed`
        }

        else
        {
            s = `Over ${n} Years Passed`
        }
    }

    return s
}

// Generates a horizontal line with text in the middle
// To separate chat messages and convey information
Hue.generate_vseparator = function(message="", classes="")
{
    let s =
    `
        <div class='message vseparator_container ${classes}'>
            <div class='vseparator_line'></div>
            <div class='vseparator_text'>${message}</div>
            <div class='vseparator_line'></div>
        </div>
    `

    return s
}

// Starts chat mouse events
Hue.start_chat_mouse_events = function()
{
    $(".chat_area").on("click", ".chat_uname", function()
    {
        Hue.show_profile($(this).text(), $(this).data("prof_image"))
    })

    $(".chat_area").on("click", ".chat_profile_image", function()
    {
        Hue.show_profile($(this).closest(".chat_message").find(".chat_uname").eq(0).text(), $(this).attr("src"))
    })

    $(".chat_area").on("click", ".message_edit_submit", function()
    {
        Hue.send_edit_messsage()
    })

    $(".chat_area").on("click", ".message_edit_cancel", function()
    {
        Hue.stop_edit_message()
    })
}

// Starts chat hover events
Hue.start_chat_hover_events = function()
{
    $("#chat_area").on("mouseenter", ".chat_uname, .chat_profile_image, .brk", function()
    {
        let uname = $(this).closest(".message").data("uname")

        if(!uname)
        {
            return false
        }

        clearTimeout(Hue.highlight_same_posts_timeouts[uname])

        Hue.highlight_same_posts_timeouts[uname] = setTimeout(function()
        {
            Hue.highlight_same_posts(uname, true)
        }, Hue.highlight_same_posts_delay)
    })

    $("#chat_area").on("mouseleave", ".chat_uname, .chat_profile_image, .brk", function()
    {
        let uname = $(this).closest(".message").data("uname")

        if(!uname)
        {
            return false
        }

        clearTimeout(Hue.highlight_same_posts_timeouts[uname])

        if($(this).closest(".message").hasClass("highlighted"))
        {
            Hue.highlight_same_posts(uname, false)
        }
    })
}

// Highlights posts related to the same user
Hue.highlight_same_posts = function(uname, add=true)
{
    $("#chat_area > .message").each(function()
    {
        if($(this).data("uname") === uname)
        {
            if(add)
            {
                $(this).addClass("highlighted")
            }

            else
            {
                $(this).removeClass("highlighted")
            }
        }
    })
}

// Regex generator for character based markdown
// For example **this** or _this_
Hue.make_markdown_char_regex = function(char)
{
    // Raw regex if "="" was the char
    // (^|\s|\[dummy\-space\])(\=+)(?!\s)(.*[^\=\s])\2($|\s|\[dummy\-space\])
    let regex = `(^|\\s|\\[dummy\\-space\\])(${Hue.utilz.escape_special_characters(char)}+)(?!\\s)(.*[^${Hue.utilz.escape_special_characters(char)}\\s])\\2($|\\s|\\[dummy\\-space\\])`
    return new RegExp(regex, "gm")
}

// Makes and prepares the markdown regexes
Hue.setup_markdown_regexes = function()
{
    Hue.markdown_regexes["*"] = {}
    Hue.markdown_regexes["*"].regex = Hue.make_markdown_char_regex("*")
    Hue.markdown_regexes["*"].replace_function = function(g1, g2, g3, g4, g5)
    {
        let n = g3.length

        if(n === 1)
        {
            return `${g2}<span class='italic'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        else if(n === 2)
        {
            return `${g2}<span class='bold'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        else if(n === 3)
        {
            return `${g2}<span class='italic bold'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        return g1
    }

    Hue.markdown_regexes["_"] = {}
    Hue.markdown_regexes["_"].regex = Hue.make_markdown_char_regex("_")
    Hue.markdown_regexes["_"].replace_function = function(g1, g2, g3, g4, g5)
    {
        let n = g3.length

        if(n === 1)
        {
            return `${g2}<span class='italic'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        else if(n === 2)
        {
            return `${g2}<span class='underlined'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        return g1
    }

    Hue.markdown_regexes["="] = {}
    Hue.markdown_regexes["="].regex = Hue.make_markdown_char_regex("=")
    Hue.markdown_regexes["="].replace_function = function(g1, g2, g3, g4, g5)
    {
        let n = g3.length

        if(n === 1)
        {
            return `${g2}<span class='slight_background'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        return g1
    }

    Hue.markdown_regexes["|"] = {}
    Hue.markdown_regexes["|"].regex = Hue.make_markdown_char_regex("|")
    Hue.markdown_regexes["|"].replace_function = function(g1, g2, g3, g4, g5)
    {
        let n = g3.length

        if(n === 2)
        {
            return `${g2}<span class='spoiler' title='Click To Reveal'>[dummy-space]${g4}[dummy-space]</span>${g5}`
        }

        return g1
    }

    Hue.markdown_regexes["whisper_link"] = {}
    Hue.markdown_regexes["whisper_link"].regex = new RegExp(`\\[whisper\\s+(.*?)\\](.*?)\\[\/whisper\\]`, "gm")
    Hue.markdown_regexes["whisper_link"].replace_function = function(g1, g2, g3)
    {
        return `<span class="whisper_link special_link" data-whisper="${g2}" title="[Whisper] ${g2}">[dummy-space]${g3.replace(/\s+/, "&nbsp;")}[dummy-space]</span>`
    }

    Hue.markdown_regexes["anchor_link"] = {}
    Hue.markdown_regexes["anchor_link"].regex = new RegExp(`\\[anchor\\s+(.*?)\\](.*?)\\[\/anchor\\]`, "gm")
    Hue.markdown_regexes["anchor_link"].replace_function = function(g1, g2, g3)
    {
        return `<a href="${g2}" class="stop_propagation anchor_link special_link" target="_blank">[dummy-space]${g3.trim().replace(/\s+/, "&nbsp;")}[dummy-space]</a>`
    }

    Hue.markdown_regexes["dummy_space"] = {}
    Hue.markdown_regexes["dummy_space"].regex = new RegExp(`\\[dummy\\-space\\]`, "gm")
    Hue.markdown_regexes["dummy_space"].replace_function = function()
    {
        return ""
    }
}

// Passes text through all markdown regexes doing the appropiate replacements
// It runs in recursion until no more replacements are found
// This is to allow replacements in any order
Hue.replace_markdown = function(text)
{
    let original_length = text.length

    text = text.replace(Hue.markdown_regexes["whisper_link"].regex, Hue.markdown_regexes["whisper_link"].replace_function)
    text = text.replace(Hue.markdown_regexes["anchor_link"].regex, Hue.markdown_regexes["anchor_link"].replace_function)
    text = text.replace(Hue.markdown_regexes["*"].regex, Hue.markdown_regexes["*"].replace_function)
    text = text.replace(Hue.markdown_regexes["_"].regex, Hue.markdown_regexes["_"].replace_function)
    text = text.replace(Hue.markdown_regexes["="].regex, Hue.markdown_regexes["="].replace_function)

    if(!Hue.get_setting("autoreveal_spoilers"))
    {
        text = text.replace(Hue.markdown_regexes["|"].regex, Hue.markdown_regexes["|"].replace_function)
    }

    if(text.length !== original_length)
    {
        return Hue.replace_markdown(text)
    }

    text = text.replace(Hue.markdown_regexes["dummy_space"].regex, Hue.markdown_regexes["dummy_space"].replace_function)

    return text
}

// Start events related to chat reply
Hue.start_chat_reply_events = function()
{
    $("#chat_area").on("mouseup", ".chat_content", function(e)
    {
        if(e.button === 1)
        {
            Hue.start_reply(e.target)
            e.preventDefault()
        }
    })
}

// Prepare data to show the reply window
Hue.start_reply = function(target)
{
    if($(target).is("a"))
    {
        return false
    }

    let uname = $(target).closest(".chat_message").data("uname")
    let text = $(target).closest(".chat_content_container").data("original_message")

    if(!uname || !text)
    {
        return false
    }

    text = text.substring(0, Hue.quote_max_length)
    let add_dots = text.length > Hue.quote_max_length

    if(add_dots)
    {
        text += "..."
    }

    let text_html = `${Hue.replace_markdown(Hue.make_html_safe(`${text}`))}`
    let html = `${uname} said: "${text_html}"`
    Hue.reply_text_raw = `=[dummy-space]${uname} said: "[dummy-space]${text}[dummy-space]"[dummy-space]=`

    Hue.show_reply(html)
}

// Show the reply window
Hue.show_reply = function(html)
{
    $("#reply_text").html(html)
    $("#reply_input").val("")

    Hue.msg_reply.show(function()
    {
        $("#reply_input").focus()
    })
}

// Submit the reply window
Hue.submit_reply = function()
{
    let reply = $("#reply_input").val().trim()

    if(Hue.is_command(reply))
    {
        reply = `/${reply}`
    }

    Hue.msg_reply.close()
    Hue.goto_bottom(true, false)
    Hue.process_message({message:Hue.reply_text_raw, to_history:false})

    if(reply)
    {
        Hue.process_message({message:reply})
    }
}

// Gradually changes the chat font size or changes to a specified size
Hue.toggle_chat_font_size = function(osize=false)
{
    let size = Hue.get_setting("chat_font_size")
    let new_size = "normal"

    if(osize)
    {
        new_size = osize
    }

    else
    {
        if(size === "normal" || size === "big" || size === "very_big")
        {
            if(size === "normal")
            {
                new_size = "big"
            }

            else if(size === "big")
            {
                new_size = "very_big"
            }

            else if(size === "very_big")
            {
                new_size = "normal"
            }
        }
    }

    if(size === new_size)
    {
        return false
    }

    Hue.enable_setting_override("chat_font_size")
    Hue.modify_setting(`chat_font_size ${new_size}`, false)
    Hue.show_infotip(`Font Size: ${new_size}`)
}

// Adds a message to the fresh message list
// This is a list of messages to temporarily highlight when a user refocus the client
// This is to give an indicator of fresh changes
Hue.add_fresh_message = function(container)
{
    Hue.fresh_messages_list.push(container)

    if(Hue.fresh_messages_list.length > Hue.max_fresh_messages)
    {
        Hue.fresh_messages_list.shift()
    }
}

// Temporarily highlights recent messages since last focus
Hue.show_fresh_messages = function()
{
    if(Hue.fresh_messages_list.length === 0)
    {
        return false
    }

    for(let container of Hue.fresh_messages_list)
    {
        container.addClass("highlighted3")

        setTimeout(function()
        {
            container.removeClass("highlighted3")
        }, Hue.fresh_messages_duration)
    }

    Hue.fresh_messages_list = []
}

// Focuses the message edit textbox
Hue.focus_edit_area = function()
{
    if(Hue.editing_message_area !== document.activeElement)
    {
        Hue.editing_message_area.focus()
    }
}

// Handles direction on Up and Down keys
// Determines whether a message has to be edited
Hue.handle_edit_direction = function(reverse=false)
{
    let area = Hue.editing_message_area

    if((reverse && area.selectionStart === area.value.length)
    || !reverse && area.selectionStart === 0)
    {
        Hue.edit_last_message(reverse)
        return true
    }

    return false
}

// Edits the next latest chat message
// Either in normal or reverse order
Hue.edit_last_message = function(reverse=false)
{
    let found = false
    let edit_found = true
    let last_container = false

    if(Hue.editing_message)
    {
        edit_found = false
    }

    $($("#chat_area > .message").get().reverse()).each(function()
    {
        if(found)
        {
            return false
        }

        if($(this).data("user_id") === Hue.user_id)
        {
            $($(this).find(".chat_content_container").get().reverse()).each(function()
            {
                if(Hue.editing_message)
                {
                    if(this === Hue.editing_message_container)
                    {
                        edit_found = true
                        return true
                    }
                }

                let cnt = this

                if(!edit_found)
                {
                    last_container = this
                    return true
                }

                else
                {
                    if(reverse)
                    {
                        cnt = last_container
                    }
                }

                if(!cnt)
                {
                    Hue.stop_edit_message()
                }

                else
                {
                    Hue.edit_message(cnt)
                }

                found = true
                return false
            })

        }
    })
}

// Starts chat message editing
Hue.edit_message = function(container)
{
    if(Hue.editing_message)
    {
        Hue.stop_edit_message()
    }

    let edit_container = $(container).find(".message_edit_container").get(0)
    let area = $(container).find(".message_edit_area").get(0)
    let chat_content = $(container).find(".chat_content").get(0)
    let edit_label = $(container).find(".message_edited_label").get(0)

    if($(container).hasClass("chat_content_container_third"))
    {
        let uname = $(container).find(".chat_uname").get(0)
        $(uname).css("display", "none")
    }

    $(edit_container).css("display", "block")
    $(chat_content).css("display", "none")
    $(container).removeClass("chat_menu_button_main")
    $(container).css("display", "block")
    $(edit_label).css("display", "none")

    Hue.editing_message = true
    Hue.editing_message_container = container
    Hue.editing_message_area = area

    $(area).val($(container).data("original_message")).focus()

    setTimeout(function()
    {
        area.setSelectionRange(area.value.length, area.value.length)
    }, 40)

    area.scrollIntoView({block:"center"})
    Hue.check_scrollers()
}

// Stops chat message editing
Hue.stop_edit_message = function()
{
    if(!Hue.editing_message || !Hue.editing_message_container)
    {
        return false
    }

    let edit_container = $(Hue.editing_message_container).find(".message_edit_container").get(0)
    let chat_content = $(Hue.editing_message_container).find(".chat_content").get(0)
    let edit_label = $(Hue.editing_message_container).find(".message_edited_label").get(0)

    $(edit_container).css("display", "none")

    if($(Hue.editing_message_container).data("edited"))
    {
        $(edit_label).css("display", "block")
    }

    if($(Hue.editing_message_container).hasClass("chat_content_container_third"))
    {
        let uname = $(Hue.editing_message_container).find(".chat_uname").get(0)
        $(uname).css("display", "inline-block")
    }

    $(Hue.editing_message_area).val("")

    $(chat_content).css("display", "inline-block")

    $(Hue.editing_message_container).addClass("chat_menu_button_main")
    $(Hue.editing_message_container).css("display", "flex")

    Hue.editing_message = false
    Hue.editing_message_container = false
    Hue.editing_message_area = false

    Hue.goto_bottom(false, false)
}

// Submits a chat message edit
Hue.send_edit_messsage = function(id)
{
    if(!Hue.editing_message_container)
    {
        return false
    }

    let chat_content = $(Hue.editing_message_container).find(".chat_content").get(0)
    let new_message = Hue.editing_message_area.value.trim()
    let edit_id = $(Hue.editing_message_container).data("id")
    let third_person = false

    if($(Hue.editing_message_container).hasClass("chat_content_container_third"))
    {
        third_person = true
    }

    Hue.stop_edit_message()

    if($(chat_content).text() === new_message)
    {
        return false
    }

    if(!edit_id)
    {
        return false
    }

    if(new_message.length === 0)
    {
        Hue.delete_message(edit_id)
        return false
    }

    if(third_person)
    {
        new_message = `/me ${new_message}`
    }

    Hue.process_message({message:new_message, edit_id:edit_id})
}

// Deletes a message
Hue.delete_message = function(id, force=false)
{
    if(!id)
    {
        return false
    }

    if(force)
    {
        Hue.send_delete_message(id)
    }

    else
    {
        if(!Hue.started_safe)
        {
            return false
        }

        if(confirm("Are you sure you want to delete this message?"))
        {
            Hue.send_delete_message(id)
        }
    }
}

// Makes the delete message emit
Hue.send_delete_message = function(id)
{
    Hue.socket_emit("delete_message", {id:id})
}

// Remove a message from the chat
Hue.remove_message_from_chat = function(data)
{
    if(data.type === "chat" || data.type === "reaction")
    {
        $(".chat_content_container").each(function()
        {
            if($(this).data("id") == data.id)
            {
                Hue.process_remove_chat_message(this)
                return false
            }
        })
    }

    else if
    (
        data.type === "announcement" ||
        data.type === "reaction" ||
        data.type === "image" || 
        data.type === "tv" || 
        data.type === "radio"
    )
    {
        $(".message.announcement").each(function()
        {
            if($(this).data("id") == data.id)
            {
                Hue.process_remove_announcement(this)
                return false
            }
        })
    }

    Hue.goto_bottom(false, false)
}

// Removes a chat message from the chat, when triggered through the context menu
Hue.remove_message_from_context_menu = function(menu)
{
    let message = $(menu).closest(".message")
    let mode = message.data("mode")

    if(mode === "chat")
    {
        Hue.process_remove_chat_message($(menu).closest(".chat_content_container"))
    }

    else if(mode === "announcement")
    {
        Hue.process_remove_announcement(message)
    }
}

// Determines how to remove a chat message
Hue.process_remove_chat_message = function(chat_content_container)
{
    let chat_content_container_id = $(chat_content_container).data("chat_content_container_id")

    $(".chat_content_container").each(function()
    {
        if($(this).data("chat_content_container_id") === chat_content_container_id)
        {
            let message2 = $(this).closest(".message")

            if(message2.hasClass("thirdperson"))
            {
                message2.remove()
            }

            else
            {
                if($(this).closest(".chat_container").find(".chat_content_container").length === 1)
                {
                    message2.remove()
                }

                else
                {
                    $(this).remove()
                }
            }
        }
    })
}

// Determines how to remove an announcement
Hue.process_remove_announcement = function(message)
{
    let type = $(message).data("type")
    let message_id = $(message).data("message_id")

    if(type === "image_change" || type === "tv_change" || type === "radio_change")
    {
        let id = $(message).data("id")
        Hue.remove_item_from_media_changed(type.replace("_change", ""), id)
    }

    $(`.message_id_${message_id}`).each(function()
    {
        $(this).remove()
    })

    Hue.check_media_menu_loaded_media()
}

// Checks if the user is typing a chat message to send a typing emit
// If the message appears to be a command it is ignored
Hue.check_typing = function()
{
    let val = $("#input").val()

    if(val.length < Hue.old_input_val.length)
    {
        return false
    }

    let tval = val.trim()

    if(Hue.can_chat && tval !== "")
    {
        if(tval[0] === "/")
        {
            if(tval[1] !== "/" && !tval.startsWith('/me '))
            {
                return false
            }
        }

        Hue.typing_timer()
    }
}

// When a typing signal is received
// It shows the typing pencil
// And animates profile images
Hue.show_typing = function(data)
{
    if(Hue.user_is_ignored(data.username))
    {
        return false
    }

    Hue.show_pencil()
    Hue.typing_remove_timer()
    Hue.show_aura(data.username)
}

// Shows the typing pencil
Hue.show_pencil = function()
{
    $("#footer_user_menu").addClass("fa-pencil")
    $("#footer_user_menu").removeClass("fa-user-circle")
}

// Hides the typing pencil
Hue.hide_pencil = function()
{
    $("#footer_user_menu").removeClass("fa-pencil")
    $("#footer_user_menu").addClass("fa-user-circle")
}

// Gets the most recent chat message by username
Hue.get_last_chat_message_by_username = function(ouname)
{
    let found_message = false

    $($("#chat_area > .message.chat_message").get().reverse()).each(function()
    {
        let uname = $(this).data("uname")

        if(uname)
        {
            if(uname === ouname)
            {
                found_message = this
                return false
            }
        }
    })

    return found_message
}

// Gives or maintains aura classes
// Starts timeout to remove them
Hue.show_aura = function(uname)
{
    if(Hue.aura_timeouts[uname] === undefined)
    {
        Hue.add_aura(uname)
    }

    else
    {
        clearTimeout(Hue.aura_timeouts[uname])
    }

    Hue.aura_timeouts[uname] = setTimeout(function()
    {
        Hue.remove_aura(uname)
    }, Hue.config.max_typing_inactivity)
}

// Adds the aura class to the profile image of the latest chat message of a user
// This class makes the profile image glow and rotate
Hue.add_aura = function(uname)
{
    let message = Hue.get_last_chat_message_by_username(uname)

    if(message)
    {
        $(message).find(".chat_profile_image_container").eq(0).addClass("aura")
    }

    let activity_bar_item = Hue.get_activity_bar_item_by_username(uname)

    if(activity_bar_item)
    {
        $(activity_bar_item).find(".activity_bar_image_container").eq(0).addClass("aura")
    }
}

// Removes the aura class from messages from a user
Hue.remove_aura = function(uname)
{
    clearTimeout(Hue.aura_timeouts[uname])

    let aura = "aura"
    let cls = ".chat_profile_image_container.aura"

    $(cls).each(function()
    {
        let message = $(this).closest(".chat_message")

        if(message.length > 0)
        {
            if(message.data("uname") === uname)
            {
                $(this).removeClass(aura)
            }
        }
    })

    cls = ".activity_bar_image_container.aura"

    $(cls).each(function()
    {
        let activity_bar_item = $(this).closest(".activity_bar_item")

        if(activity_bar_item.length > 0)
        {
            if(activity_bar_item.data("username") === uname)
            {
                $(this).removeClass(aura)
            }
        }
    })

    Hue.aura_timeouts[uname] = undefined
}

// Jumps to a chat message in the chat area
// This is used when clicking the Jump button in
// windows showing chat message clones
Hue.jump_to_chat_message = function(message_id)
{
    let el = $(`#chat_area > .message_id_${message_id}`).eq(0)

    if(el.length === 0)
    {
        return false
    }

    el[0].scrollIntoView({block:"center"})
    el.addClass("highlighted2")

    setTimeout(function()
    {
        el.removeClass("highlighted2")
    }, 2000)

    Hue.close_all_modals()
}

// Returns an object with clones of the announcement messages of every loaded media
Hue.get_loaded_media_messages = function()
{
    let obj = {}

    for(let type of Hue.utilz.media_types)
    {
        obj[type] = false

        let loaded_type = Hue[`loaded_${type}`]

        if(loaded_type)
        {
            let message_id = loaded_type.message_id
            let message = $(`#chat_area > .message_id_${message_id}`).eq(0)

            if(message.length > 0)
            {
                obj[type] = message.clone(true, true)
            }
        }

        else
        {
            obj[type] = "Not Loaded Yet"
        }
    }

    return obj
}

// What to do after receiving a chat message from the server
Hue.on_chat_message = function(data)
{
    Hue.update_chat(
    {
        id: data.id,
        user_id: data.user_id,
        username: data.username,
        message: data.message,
        prof_image: data.profile_image,
        date: data.date,
        link_title: data.link_title,
        link_image: data.link_image,
        link_url: data.link_url,
        edited: data.edited,
        just_edited: data.just_edited
    })

    Hue.hide_pencil()
    Hue.remove_aura(data.username)
}

// Shows feedback if user doesn't have chat permission
Hue.cant_chat = function()
{
    Hue.feedback("You don't have permission to chat")
}

// Find the next chat message above that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_above = function(animate=true)
{
    let step = false
    let up_scroller_height = $("#up_scroller").outerHeight()
    let scrolltop = $("#chat_area").scrollTop()

    $($("#chat_area > .message").get().reverse()).each(function()
    {
        let same_uname = false
        let uname = $(this).data("uname")

        if(uname && uname === Hue.username)
        {
            same_uname = true
        }

        if(same_uname || $(this).data("highlighted"))
        {
            let p = $(this).position()

            if(p.top < up_scroller_height)
            {
                let diff = scrolltop + p.top - up_scroller_height
                Hue.scroll_chat_to(diff, animate)
                step = true
                return false
            }
        }
    })

    if(!step)
    {
        Hue.goto_top(animate)
    }
}

// Find the next chat message below that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_below = function(animate=true)
{
    let step = false
    let up_scroller_height = $("#up_scroller").outerHeight()
    let down_scroller_height = $("#down_scroller").outerHeight()
    let chat_area_height = $("#chat_area").innerHeight()
    let scrolltop = $("#chat_area").scrollTop()

    $("#chat_area > .message").each(function()
    {
        let same_uname = false
        let uname = $(this).data("uname")

        if(uname && uname === Hue.username)
        {
            same_uname = true
        }

        if(same_uname || $(this).data("highlighted"))
        {
            let p = $(this).position()
            let h = $(this).outerHeight()

            if(p.top + h + down_scroller_height > chat_area_height)
            {
                let diff = scrolltop + p.top - up_scroller_height
                Hue.scroll_chat_to(diff, animate)
                step = true
                return false
            }
        }
    })

    if(!step)
    {
        Hue.goto_bottom(true, animate)
    }
}

// Clears the chat area
Hue.clear_chat = function()
{
    $('#chat_area').html("")

    Hue.show_log_messages()
    Hue.goto_bottom(true)
    Hue.focus_input()
}

// Changes that chat font size
Hue.do_chat_size_change = function(size)
{
    size = parseInt(size)

    if(size < 10 || size > 100)
    {
        return false
    }

    if(size === 100)
    {
        Hue.toggle_media()
        Hue.show_infotip("Chat Maximized")
        return
    }

    if(size !== Hue.get_setting("chat_display_percentage"))
    {
        Hue.enable_setting_override("chat_display_percentage")
        Hue.modify_setting(`chat_display_percentage ${size}`, false)
    }

    Hue.notify_chat_size_change(size)
}

// Shows the chat display percentage in the infotip
Hue.notify_chat_size_change = function(size)
{
    let info

    if(size === Hue.config.global_settings_default_chat_display_percentage)
    {
        info = " (Default)"
    }

    else
    {
        info = ""
    }

    Hue.show_infotip(`Chat Size: ${size}%${info}`)
}

// Scrolls the chat to a certain vertical position
Hue.scroll_chat_to = function(scroll_top, animate=true, delay=500)
{
    $("#chat_area").stop()

    if(Hue.started && Hue.app_focused && animate && Hue.get_setting("animate_scroll"))
    {
        $("#chat_area").animate({scrollTop:scroll_top}, delay, function()
        {
            Hue.check_scrollers()
        })
    }

    else
    {
        $("#chat_area").scrollTop(scroll_top)
    }
}

// Scrolls the chat up
Hue.scroll_up = function(n)
{
    Hue.scroll_chat_to($('#chat_area').scrollTop() - n, false)
}

// Scrolls the chat down
Hue.scroll_down = function(n)
{
    let $ch = $('#chat_area')
    let max = $ch.prop('scrollHeight') - $ch.innerHeight()

    if(max - $ch.scrollTop < n)
    {
        Hue.scroll_chat_to(max + 10)
    }

    else
    {
        Hue.scroll_chat_to($ch.scrollTop() + n, false)
    }
}

// Generates a regex with a specified string to check for highlights
// It handles various scenarious like "word," "@word" "word..."
Hue.generate_highlights_regex = function(word, case_insensitive=false, escape=true)
{
    let flags = "gm"

    if(case_insensitive)
    {
        flags += "i"
    }

    if(escape)
    {
        word = Hue.utilz.escape_special_characters(word)
    }

    // Raw regex if using the word "mad"
    //(?:^|\s|\"|\[dummy\-space\])(?:\@)?(?:mad)(?:\'s)?(?:$|\s|\"|\[dummy\-space\]|\!|\?|\,|\.|\:)
    let regex = new RegExp(`(?:^|\\s|\\"|\\[dummy\\-space\\])(?:\\@)?(?:${word})(?:\\'s)?(?:$|\\s|\\"|\\[dummy\\-space\\]|\\!|\\?|\\,|\\.|\\:)`, flags)

    return regex
}

// Generates the username mention regex using the highlights regex
Hue.generate_mentions_regex = function()
{
    if(Hue.get_setting("case_insensitive_username_highlights"))
    {
        Hue.mentions_regex = Hue.generate_highlights_regex(Hue.username, true, true)
    }

    else
    {
        Hue.mentions_regex = Hue.generate_highlights_regex(Hue.username, false, true)
    }
}

// Generates highlight words regex using the highlights regex
Hue.generate_highlight_words_regex = function()
{
    let words = ""
    let lines = Hue.get_setting("other_words_to_highlight").split('\n')

    for(let i=0; i<lines.length; i++)
    {
        let line = lines[i]

        words += Hue.utilz.escape_special_characters(line)

        if(i < lines.length - 1)
        {
            words += "|"
        }
    }

    if(words.length > 0)
    {
        if(Hue.get_setting("case_insensitive_words_highlights"))
        {
            Hue.highlight_words_regex = Hue.generate_highlights_regex(words, true, false)
        }

        else
        {
            Hue.highlight_words_regex = Hue.generate_highlights_regex(words, false, false)
        }
    }

    else
    {
        Hue.highlight_words_regex = false
    }
}

// Checks for highlights using the mentions regex and the highlight words regex
Hue.check_highlights = function(message)
{
    if(Hue.get_setting("highlight_current_username"))
    {
        if(message.search(Hue.mentions_regex) !== -1)
        {
            return true
        }
    }

    if(Hue.highlight_words_regex)
    {
        if(message.search(Hue.highlight_words_regex) !== -1)
        {
            return true
        }
    }

    return false
}

// Generates the ignored words regex using highlights regex
Hue.generate_ignored_words_regex = function()
{
    let words = ""
    let lines = Hue.get_setting("ignored_words").split('\n')

    for(let i=0; i<lines.length; i++)
    {
        let line = lines[i]

        words += Hue.utilz.escape_special_characters(line)

        if(i < lines.length - 1)
        {
            words += "|"
        }
    }

    if(words.length > 0)
    {
        if(Hue.get_setting("case_insensitive_ignored_words"))
        {
            Hue.ignored_words_regex = Hue.generate_highlights_regex(words, true, false)
        }

        else
        {
            Hue.ignored_words_regex = Hue.generate_highlights_regex(words, false, false)
        }
    }

    else
    {
        Hue.ignored_words_regex = false
    }
}

// Checks for ignored words on chat messages and announcements
// Using ignored words regex
Hue.check_ignored_words = function(message="", uname="")
{
    if(Hue.ignored_words_regex)
    {
        if(message.search(Hue.ignored_words_regex) !== -1)
        {
            if(uname && uname === Hue.username && Hue.get_setting("ignored_words_exclude_same_user"))
            {
                return false
            }

            else
            {
                return true
            }
        }
    }

    return false
}

// Checks if there are new highlights since the last load
// If so, a clickable announcement appears which opens Highlights
Hue.check_latest_highlight = function()
{
    let latest_highlight = Hue.get_latest_highlight()

    if(latest_highlight)
    {
        let date = $(latest_highlight).data("date")

        if(date > Hue.room_state.last_highlight_date)
        {
            Hue.feedback(`Click here to see new highlights`,
            {
                onclick: function()
                {
                    Hue.show_highlights()
                }
            })

            Hue.room_state.last_highlight_date = date
            Hue.save_room_state()
        }
    }
}

// Gets the last highlighted message
// Either a chat content container or an announcement
Hue.get_latest_highlight = function()
{
    let latest_highlight = false

    $($("#chat_area .chat_content_container").get().reverse()).each(function()
    {
        if($(this).data("highlighted"))
        {
            latest_highlight = this
            return false
        }
    })

    $($("#chat_area > .message.announcement").get().reverse()).each(function()
    {
        if($(this).data("highlighted"))
        {
            if($(this).data("date") > $(latest_highlight).data("date"))
            {
                latest_highlight = this
            }

            return false
        }
    })

    return latest_highlight
}

// What to do when a message gets highlighted
Hue.on_highlight = function()
{
    if(!Hue.started)
    {
        return false
    }

    if(!Hue.app_focused || Hue.room_state.screen_locked)
    {
        Hue.alert_title(2)
        Hue.check_lockscreen_activity()
        Hue.show_highlight_notification()
        Hue.sound_notify("highlight")
    }
}

// What to do after general activity
Hue.on_activity = function(sound=false)
{
    if(!Hue.started)
    {
        return false
    }

    if(!Hue.app_focused || Hue.room_state.screen_locked)
    {
        Hue.alert_title(1)
        Hue.check_lockscreen_activity()

        if(sound)
        {
            Hue.sound_notify(sound)
        }
    }
}

// Resets highlights filter data
Hue.reset_highlights_filter = function()
{
    $("#highlights_filter").val("")
    $("#highlights_container").html("")
    $("#highlights_no_results").css("display", "none")
}

// Show and/or filters highlights window
Hue.show_highlights = function(filter=false)
{
    if(filter)
    {
        filter = filter.trim()
    }

    let sfilter = filter ? filter : ''

    $("#highlights_container").html("")
    $("#highlights_filter").val(sfilter)
    $("#highlights_no_results").css("display", "none")

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
            if(!$(this).data("highlighted"))
            {
                return false
            }

            if($(this).hasClass("vseparator_container"))
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
            if(!$(this).data("highlighted"))
            {
                return false
            }

            if($(this).hasClass("vseparator_container"))
            {
                return false
            }

            return true
        })
    }

    if(clone.children().length === 0 && !filter)
    {
        $("#highlights_no_results").css("display", "block")
    }

    else
    {
        clone.appendTo("#highlights_container")
    }

    Hue.msg_highlights.show(function()
    {
        Hue.scroll_modal_to_top("highlights")
    })
}

// Makes image preview elements
Hue.make_image_preview = function(message)
{
    let ans = {}

    ans.image_preview = false
    ans.image_preview_src = false
    ans.image_preview_src_original = false
    ans.image_preview_text = false

    let link = Hue.utilz.get_first_url(message)

    if(!link)
    {
        return ans
    }

    if(link.includes("imgur.com"))
    {
        let code = Hue.utilz.get_imgur_image_code(link)

        if(code)
        {
            let extension = Hue.utilz.get_extension(link)

            ans.image_preview_src_original = `https://i.imgur.com/${code}.${extension}`
            ans.image_preview_src = `https://i.imgur.com/${code}l.jpg`

            // This is in a single line on purpose
            ans.image_preview = `<div class='image_preview action'><img draggable="false" class="image_preview_image" src="${ans.image_preview_src}"></div>`

            let text = Hue.replace_markdown(Hue.make_html_safe(message))
            let stext = `<div class='image_preview_text'>${text}</div>`

            ans.image_preview_text = message
            ans.image_preview = stext + ans.image_preview
        }
    }

    return ans
}

// Make link preview elements
Hue.make_link_preview = function(message, link_url, link_title, link_image)
{
    let ans = {}
    ans.link_preview = false
    let link_preview_s = false

    if(link_title && link_image)
    {
        link_preview_s =
        `<div class='link_preview action'>
            <div class='link_preview_title'>${Hue.make_html_safe(link_title)}</div>
            <div class='link_preview_image_with_title'><img class='link_preview_image' src='${link_image}'></div>
        </div>`
    }

    else if(link_title)
    {
        link_preview_s =
        `<div class='link_preview action'>
            <div class='link_preview_title'>${Hue.make_html_safe(link_title)}</div>
        </div>`
    }

    else if(link_image)
    {
        link_preview_s =
        `<div class='link_preview action'>
            <img class='link_preview_image' src='${link_image}'>
        </div>`
    }

    if(link_preview_s)
    {
        ans.link_preview = link_preview_s

        let text = Hue.replace_markdown(Hue.make_html_safe(message))
        let stext = `<div class='link_preview_text'>${text}</div>`

        ans.link_preview_text = text
        ans.link_preview = stext + ans.link_preview
    }

    return ans
}

// Setups image preview elements
Hue.setup_image_preview = function(fmessage, image_preview_src_original, user_id)
{
    let started = Hue.started
    let image_preview_el = fmessage.find(".image_preview").eq(0)

    image_preview_el.click(function()
    {
        Hue.open_url_menu({source:image_preview_src_original})
    })

    let image_preview_image = image_preview_el.find(".image_preview_image").eq(0)

    image_preview_image[0].addEventListener("load", function()
    {
        if(user_id === Hue.user_id || !started)
        {
            Hue.goto_bottom(true, false)
        }

        else
        {
            Hue.goto_bottom(false, false)
        }
    })

    image_preview_image.click(function(e)
    {
        e.stopPropagation()
        Hue.expand_image(image_preview_src_original.replace(".gifv", ".gif"))
    })

    image_preview_el.parent().find(".image_preview_text").eq(0).urlize()
}

// Setups link preview elements
Hue.setup_link_preview = function(fmessage, link_url, user_id)
{
    let started = Hue.started
    let link_preview_el = fmessage.find(".link_preview").eq(0)
    let link_preview_title = link_preview_el.find(".link_preview_title").eq(0)

    link_preview_el.click(function()
    {
        Hue.open_url_menu({source:link_url, title:link_preview_title.text()})
    })

    let link_preview_image = link_preview_el.find(".link_preview_image").eq(0)

    if(link_preview_image.length > 0)
    {
        link_preview_image[0].addEventListener("load", function()
        {
            if(user_id === Hue.user_id || !started)
            {
                Hue.goto_bottom(true, false)
            }

            else
            {
                Hue.goto_bottom(false, false)
            }
        })
    }

    link_preview_image.click(function(e)
    {
        e.stopPropagation()
        Hue.expand_image($(this).attr("src").replace(".gifv", ".gif"))
    })

    link_preview_el.parent().find(".link_preview_text").eq(0).urlize()
}

// Sends a chat message through the say command
Hue.say_command = function(arg, ans)
{
    Hue.process_message(
    {
        message: arg,
        to_history: ans.to_history,
        clr_input: ans.clr_input
    })
}

// Starts chat area scroll events
Hue.scroll_events = function()
{
    $('#chat_area')[0].addEventListener("wheel", function(e)
    {
        $("#chat_area").stop()
        Hue.clear_autoscroll()
    })

    $('#chat_area').scroll(function()
    {
        Hue.scroll_timer()
    })
}

// Shows the top scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
Hue.show_top_scroller = function()
{
    $('#top_scroller_container').css('visibility', 'visible')
}

// Hides the top scroller
Hue.hide_top_scroller = function()
{
    $('#top_scroller_container').css('visibility', 'hidden')
}

// Shows the bottom scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
Hue.show_bottom_scroller = function()
{
    $('#bottom_scroller_container').css('visibility', 'visible')
    Hue.chat_scrolled = true
}

// Hides the bottom scroller
Hue.hide_bottom_scroller = function()
{
    $('#bottom_scroller_container').css('visibility', 'hidden')
    Hue.chat_scrolled = false
}

// Updates scrollers state based on scroll position
Hue.check_scrollers = function()
{
    if($("#chat_area").is(":animated"))
    {
        return false
    }

    let $ch = $("#chat_area")
    let max = $ch.prop('scrollHeight') - $ch.innerHeight()
    let scrolltop = $ch.scrollTop()
    let diff = max - scrolltop

    if(diff > Hue.small_scroll_amount)
    {
        if(scrolltop > 0)
        {
            Hue.show_top_scroller()
        }

        else
        {
            Hue.hide_top_scroller()
            Hue.clear_autoscroll()
        }

        Hue.show_bottom_scroller()
    }

    else
    {
        Hue.hide_top_scroller()
        Hue.hide_bottom_scroller()

        if(diff <= 0)
        {
            Hue.clear_autoscroll()
        }
    }
}

// Starts chat autoscrolling upwards
Hue.autoscroll_up = function()
{
    if(Hue.autoscrolling)
    {
        Hue.clear_autoscroll()
        return false
    }

    Hue.clear_autoscroll()

    Hue.autoscroll_up_interval = setInterval(function()
    {
        Hue.scroll_up(Hue.get_setting("autoscroll_amount"))
    }, Hue.get_setting("autoscroll_delay"))

    Hue.autoscrolling = true
}

// Starts chat autoscrolling downwards
Hue.autoscroll_down = function()
{
    if(Hue.autoscrolling)
    {
        Hue.clear_autoscroll()
        return false
    }

    Hue.clear_autoscroll()

    Hue.autoscroll_up_interval = setInterval(function()
    {
        Hue.scroll_down(Hue.get_setting("autoscroll_amount"))
    }, Hue.get_setting("autoscroll_delay"))

    Hue.autoscrolling = true
}

// Clears autoscrolling intervals
Hue.clear_autoscroll = function()
{
    clearInterval(Hue.autoscroll_up_interval)
    clearInterval(Hue.autoscroll_down_interval)

    Hue.autoscrolling = false
}

// Shows a system announcement
// Used for ads
Hue.show_announcement = function(data, date=Date.now())
{
    Hue.public_feedback(data.message,
    {
        id: data.id,
        brk: "<i class='icon2c fa fa-star'></i>",
        date: date,
        preview_image: true,
        link_title: data.link_title,
        link_image: data.link_image,
        link_url: data.link_url
    })
}

// Scrolls the chat to the top
Hue.goto_top = function(animate=true)
{
    Hue.clear_autoscroll()
    Hue.scroll_chat_to(0, animate)
    Hue.hide_top_scroller()
}

// Scrolls the chat to the bottom
Hue.goto_bottom = function(force=false, animate=true)
{
    let $ch = $("#chat_area")
    let max = $ch.prop('scrollHeight') - $ch.innerHeight()

    if(force)
    {
        Hue.clear_autoscroll()
        Hue.scroll_chat_to(max + 10, animate)
        Hue.hide_top_scroller()
        Hue.hide_bottom_scroller()
    }

    else
    {
        if(!Hue.chat_scrolled)
        {
            Hue.clear_autoscroll()
            Hue.scroll_chat_to(max + 10, animate)
        }
    }
}

// Fills the chat and media changes with log messages from initial data
Hue.show_log_messages = function()
{
    if(Hue.log_messages_processed)
    {
        return false
    }

    let num_images = 0
    let num_tv = 0
    let num_radio = 0

    if(Hue.log_messages && Hue.log_messages.length > 0)
    {
        for(let message of Hue.log_messages)
        {
            let type = message.type

            if(type === "image")
            {
                num_images += 1
            }

            else if(type === "tv")
            {
                num_tv += 1
            }

            else if(type === "radio")
            {
                num_radio += 1
            }
        }
    }

    // If there are no media items in the log, show the current room media

    if(num_images === 0)
    {
        Hue.setup_image("show", Object.assign(Hue.get_media_object_from_init_data("image"), {in_log: false}))
    }

    if(num_tv === 0)
    {
        Hue.setup_tv("show", Object.assign(Hue.get_media_object_from_init_data("tv"), {in_log: false}))
    }

    if(num_radio === 0)
    {
        Hue.setup_radio("show", Object.assign(Hue.get_media_object_from_init_data("radio"), {in_log: false}))
    }

    if(Hue.log_messages && Hue.log_messages.length > 0)
    {
        for(let message of Hue.log_messages)
        {
            let id = message.id
            let type = message.type
            let data = message.data
            let date = message.date

            if(data)
            {
                if(type === "chat")
                {
                    Hue.update_chat(
                    {
                        id: id,
                        user_id: data.user_id,
                        username: data.username,
                        message: data.content,
                        prof_image: data.profile_image,
                        link_title: data.link_title,
                        link_image: data.link_image,
                        link_url: data.link_url,
                        date: date,
                        scroll: false,
                        edited: data.edited
                    })
                }

                else if(type === "image")
                {
                    data.id = id
                    data.date = date
                    Hue.setup_image("show", data)
                }

                else if(type === "tv")
                {
                    data.id = id
                    data.date = date
                    Hue.setup_tv("show", data)
                }

                else if(type === "radio")
                {
                    data.id = id
                    data.date = date
                    Hue.setup_radio("show", data)
                }

                else if(type === "reaction")
                {
                    data.id = id
                    Hue.show_reaction(data, date)
                }

                else if(type === "announcement")
                {
                    data.id = id
                    Hue.show_announcement(data, date)
                }
            }
        }
    }

    Hue.log_messages_processed = true
}

// Sends a simple shrug chat message
Hue.shrug = function()
{
    Hue.process_message(
    {
        message: "¯\\_(ツ)_/¯",
        to_history: false
    })
}

// Sends a simple afk chat message
Hue.show_afk = function()
{
    Hue.process_message(
    {
        message: "/me is now AFK",
        to_history: false
    })
}

// Centralized function to show local feedback messages
Hue.feedback = function(message, data=false)
{
    let obj =
    {
        brk: "<i class='icon2c fa fa-info-circle'></i>",
        message: message,
        public: false
    }

    if(data)
    {
        Object.assign(obj, data)
    }

    if(!obj.brk.startsWith("<") && !obj.brk.endsWith(">"))
    {
        obj.brk = `<div class='inline'>${obj.brk}</div>`
    }

    return Hue.chat_announce(obj)
}

// Centralized function to show public announcement messages
Hue.public_feedback = function(message, data=false)
{
    let obj =
    {
        brk: "<i class='icon2c fa fa-info-circle'></i>",
        message: message,
        public: true
    }

    if(data)
    {
        Object.assign(obj, data)
    }

    if(!obj.brk.startsWith("<") && !obj.brk.endsWith(">"))
    {
        obj.brk = `<div class='inline'>${obj.brk}</div>`
    }

    return Hue.chat_announce(obj)
}

// Removes a message above or below a message with a certain ID
Hue.remove_messages_after_id = function(id, direction)
{
    let index = false

    $($("#chat_area .chat_content_container").get().reverse()).each(function()
    {
        if($(this).data("id") === id)
        {
            let container_index = $(this).index()
            let message = $(this).closest(".message")

            if($(this).closest(".chat_container").find(".chat_content_container").length > 1)
            {
                if(direction === "above")
                {
                    message.find(".chat_content_container").slice(0, container_index).remove()
                }
                
                else if(direction === "below")
                {
                    message.find(".chat_content_container").slice(container_index + 1).remove()
                }
            }

            index = message.index()
            return false
        }
    })

    if(index === false)
    {
        $($("#chat_area > .announcement").get().reverse()).each(function()
        {
            if($(this).data("id") === id)
            {
                index = $(this).index()
                return false
            }
        })
    }

    if(index === false)
    {
        return false
    }

    if(direction === "above")
    {
        $("#chat_area > .message").slice(0, index).remove()
    }
    
    else if(direction === "below")
    {
        $("#chat_area > .message").slice(index + 1).remove()
    }

    Hue.goto_bottom(true, false)
}