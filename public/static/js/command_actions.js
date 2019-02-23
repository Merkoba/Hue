Hue.command_actions = {}

Hue.command_actions['/clear'] = (arg, ans) =>
{
    Hue.clear_chat()
}

Hue.command_actions['/clearinput'] = (arg, ans) =>
{
    Hue.clear_input()
}

Hue.command_actions['/users'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_userlist("normal", arg)
    }

    else
    {
        Hue.show_userlist()
    }
}

Hue.command_actions['/publicrooms'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.request_roomlist(arg, "public_roomlist")
    }

    else
    {
        Hue.request_roomlist("", "public_roomlist")
    }
}

Hue.command_actions['/visitedrooms'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.request_roomlist(arg, "visited_roomlist")
    }

    else
    {
        Hue.request_roomlist("", "visited_roomlist")
    }
    
}

Hue.command_actions['/roomname'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.change_room_name(arg)
    }

    else
    {
        Hue.show_room()
    }
}

Hue.command_actions['/roomnameedit'] = (arg, ans) =>
{
    Hue.room_name_edit()
    ans.to_history = false
    ans.clr_input = false
}

Hue.command_actions['/played'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_played(arg)
    }

    else
    {
        Hue.show_played()
    }
}

Hue.command_actions['/search'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_chat_search(arg)
    }

    else
    {
        Hue.show_chat_search()
    }
}

Hue.command_actions['/role'] = (arg, ans) =>
{
    Hue.show_role()
}

Hue.command_actions['/voice1'] = (arg, ans) =>
{
    Hue.change_role(arg, "voice1")
}

Hue.command_actions['/voice2'] = (arg, ans) =>
{
    Hue.change_role(arg, "voice2")
}

Hue.command_actions['/voice3'] = (arg, ans) =>
{
    Hue.change_role(arg, "voice3")
}

Hue.command_actions['/voice4'] = (arg, ans) =>
{
    Hue.change_role(arg, "voice4")
}

Hue.command_actions['/op'] = (arg, ans) =>
{
    Hue.change_role(arg, "op")
}

Hue.command_actions['/admin'] = (arg, ans) =>
{
    Hue.change_role(arg, "admin")
}

Hue.command_actions['/resetvoices'] = (arg, ans) =>
{
    Hue.reset_voices()
}

Hue.command_actions['/removeops'] = (arg, ans) =>
{
    Hue.remove_ops()
}

Hue.command_actions['/ban'] = (arg, ans) =>
{
    Hue.ban(arg)
}

Hue.command_actions['/unban'] = (arg, ans) =>
{
    Hue.unban(arg)
}

Hue.command_actions['/unbanall'] = (arg, ans) =>
{
    Hue.unban_all()
}

Hue.command_actions['/bannedcount'] = (arg, ans) =>
{
    Hue.get_banned_count()
}

Hue.command_actions['/kick'] = (arg, ans) =>
{
    Hue.kick(arg)
}

Hue.command_actions['/public'] = (arg, ans) =>
{
    Hue.change_privacy(true)
}

Hue.command_actions['/private'] = (arg, ans) =>
{
    Hue.change_privacy(false)
}

Hue.command_actions['/privacy'] = (arg, ans) =>
{
    Hue.show_public()
}

Hue.command_actions['/log'] = (arg, ans) =>
{
    Hue.show_log()
}

Hue.command_actions['/enablelog'] = (arg, ans) =>
{
    Hue.change_log(true)
}

Hue.command_actions['/disablelog'] = (arg, ans) =>
{
    Hue.change_log(false)
}

Hue.command_actions['/clearlog'] = (arg, ans) =>
{
    Hue.clear_log()
}

Hue.command_actions['/clearlog2'] = (arg, ans) =>
{
    Hue.clear_log(true)
}

Hue.command_actions['/radio'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.change_radio_source(arg)
    }

    else
    {  
        Hue.show_media_source("radio")
    }
}

Hue.command_actions['/tv'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.change_tv_source(arg)
    }

    else
    {  
        Hue.show_media_source("tv")
    }
}

Hue.command_actions['/image'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.change_image_source(arg)
    }

    else
    {  
        Hue.show_media_source("image")
    }
}

Hue.command_actions['/status'] = (arg, ans) =>
{
    Hue.show_status()
}

Hue.command_actions['/topic'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.change_topic(arg)
    }

    else
    {
        Hue.show_topic()
    }
}

Hue.command_actions['/topicadd'] = (arg, ans) =>
{
    Hue.topicadd(arg)
}

Hue.command_actions['/topictrim'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.topictrim(arg)
    }

    else
    {  
        Hue.topictrim(1)
    }
}

Hue.command_actions['/topicaddstart'] = (arg, ans) =>
{
    Hue.topicstart(arg)
}

Hue.command_actions['/topictrimstart'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.topictrimstart(arg)
    }

    else
    {  
        Hue.topictrimstart(1)
    }
}

Hue.command_actions['/topicedit'] = (arg, ans) =>
{
    Hue.topicedit()
    ans.to_history = false
    ans.clr_input = false
}

Hue.command_actions['/room'] = (arg, ans) =>
{
    Hue.show_room()
}

Hue.command_actions['/help'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_help(1, arg)
    }

    else
    {  
        Hue.show_help(1)
    }
}

Hue.command_actions['/help2'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_help(2, arg)
    }

    else
    {  
        Hue.show_help(2)
    }
}

Hue.command_actions['/help3'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_help(3, arg)
    }

    else
    {  
        Hue.show_help(3)
    }
}

Hue.command_actions['/stopradio'] = (arg, ans) =>
{
    Hue.stop_radio()
}

Hue.command_actions['/startradio'] = (arg, ans) =>
{
    Hue.start_radio()
}

Hue.command_actions['/radiovolume'] = (arg, ans) =>
{
    Hue.change_volume_command(arg)
}

Hue.command_actions['/tvvolume'] = (arg, ans) =>
{
    Hue.change_volume_command(arg, "tv")
}

Hue.command_actions['/volume'] = (arg, ans) =>
{
    Hue.change_volume_command(arg)
    Hue.change_volume_command(arg, "tv")
}

Hue.command_actions['/history'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_input_history(arg)
    }

    else
    {  
        Hue.show_input_history()
    }
}

Hue.command_actions['/changeusername'] = (arg, ans) =>
{
    Hue.change_username(arg)
}

Hue.command_actions['/changepassword'] = (arg, ans) =>
{
    Hue.change_password(arg)
}

Hue.command_actions['/changeemail'] = (arg, ans) =>
{
    Hue.change_email(arg)
}

Hue.command_actions['/verifyemail'] = (arg, ans) =>
{
    Hue.verify_email(arg)
}

Hue.command_actions['/details'] = (arg, ans) =>
{
    Hue.show_details()
}

Hue.command_actions['/logout'] = (arg, ans) =>
{
    Hue.logout()
}

Hue.command_actions['/fill'] = (arg, ans) =>
{
    Hue.fill()
}

Hue.command_actions['/shrug'] = (arg, ans) =>
{
    Hue.shrug()
}

Hue.command_actions['/afk'] = (arg, ans) =>
{
    Hue.show_afk()
}

Hue.command_actions['/disconnectothers'] = (arg, ans) =>
{
    Hue.disconnect_others()
}

Hue.command_actions['/whisper'] = (arg, ans) =>
{
    Hue.process_write_whisper(arg, true)
}

Hue.command_actions['/whisper2'] = (arg, ans) =>
{
    Hue.process_write_whisper(arg, false)
}

Hue.command_actions['/whisperops'] = (arg, ans) =>
{
    Hue.write_popup_message(false, "ops")
}

Hue.command_actions['/broadcast'] = (arg, ans) =>
{
    Hue.write_popup_message(false, "room")
}

Hue.command_actions['/systembroadcast'] = (arg, ans) =>
{
    Hue.write_popup_message(false, "system")
    ans.to_history = false
}

Hue.command_actions['/systemrestart'] = (arg, ans) =>
{
    Hue.send_system_restart_signal()
    ans.to_history = false
}

Hue.command_actions['/annex'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.annex(arg)
    }

    else
    {  
        Hue.annex()
        ans.to_history = false
    }
}

Hue.command_actions['/highlights'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_highlights(arg)
    }

    else
    {  
        Hue.show_highlights()
    }
}

Hue.command_actions['/lock'] = (arg, ans) =>
{
    Hue.stop_and_lock(false)
}

Hue.command_actions['/unlock'] = (arg, ans) =>
{
    Hue.default_media_state(false)
}

Hue.command_actions['/stopandlock'] = (arg, ans) =>
{
    Hue.stop_and_lock()
}

Hue.command_actions['/stop'] = (arg, ans) =>
{
    Hue.stop_media()
}

Hue.command_actions['/default'] = (arg, ans) =>
{
    Hue.default_media_state()
}

Hue.command_actions['/menu'] = (arg, ans) =>
{
    Hue.show_main_menu()
}

Hue.command_actions['/media'] = (arg, ans) =>
{
    Hue.show_media_menu()
}

Hue.command_actions['/user'] = (arg, ans) =>
{
    Hue.show_user_menu()
}

Hue.command_actions['/imagehistory'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_media_history("image", arg)
    }

    else
    {  
        Hue.show_media_history("image")
    }
}

Hue.command_actions['/tvhistory'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_media_history("tv", arg)
    }

    else
    {  
        Hue.show_media_history("tv")
    }
}

Hue.command_actions['/radiohistory'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_media_history("radio", arg)
    }

    else
    {  
        Hue.show_media_history("radio")
    }
}

Hue.command_actions['/lockimages'] = (arg, ans) =>
{
    Hue.toggle_lock_images(true)
}

Hue.command_actions['/locktv'] = (arg, ans) =>
{
    Hue.toggle_lock_tv(true)
}

Hue.command_actions['/lockradio'] = (arg, ans) =>
{
    Hue.toggle_lock_radio(true)
}

Hue.command_actions['/unlockimages'] = (arg, ans) =>
{
    Hue.toggle_lock_images(false)
}

Hue.command_actions['/unlocktv'] = (arg, ans) =>
{
    Hue.toggle_lock_tv(false)
}

Hue.command_actions['/unlockradio'] = (arg, ans) =>
{
    Hue.toggle_lock_radio(false)
}

Hue.command_actions['/togglelockimages'] = (arg, ans) =>
{
    Hue.toggle_lock_images()
}

Hue.command_actions['/togglelocktv'] = (arg, ans) =>
{
    Hue.toggle_lock_tv()
}

Hue.command_actions['/togglelockradio'] = (arg, ans) =>
{
    Hue.toggle_lock_radio()
}

Hue.command_actions['/showimages'] = (arg, ans) =>
{
    Hue.toggle_images(true)
}

Hue.command_actions['/showtv'] = (arg, ans) =>
{
    Hue.toggle_tv(true)
}

Hue.command_actions['/showradio'] = (arg, ans) =>
{
    Hue.toggle_radio(true)
}

Hue.command_actions['/hideimages'] = (arg, ans) =>
{
    Hue.toggle_images(false)
}

Hue.command_actions['/hidetv'] = (arg, ans) =>
{
    Hue.toggle_tv(false)
}

Hue.command_actions['/hideradio'] = (arg, ans) =>
{
    Hue.toggle_radio(false)
}

Hue.command_actions['/toggleimages'] = (arg, ans) =>
{
    Hue.toggle_images()
}

Hue.command_actions['/toggletv'] = (arg, ans) =>
{
    Hue.toggle_tv()
}

Hue.command_actions['/toggleradio'] = (arg, ans) =>
{
    Hue.toggle_radio()
}

Hue.command_actions['/test'] = (arg, ans) =>
{
    Hue.do_test()
}

Hue.command_actions['/maximizeimages'] = (arg, ans) =>
{
    Hue.maximize_images()
}

Hue.command_actions['/maximizetv'] = (arg, ans) =>
{
    Hue.maximize_tv()
}

Hue.command_actions['/starttv'] = (arg, ans) =>
{
    Hue.play_video()
}

Hue.command_actions['/stoptv'] = (arg, ans) =>
{
    Hue.stop_tv()
}

Hue.command_actions['/openimage'] = (arg, ans) =>
{
    Hue.show_current_image_modal()
}

Hue.command_actions['/openlastimage'] = (arg, ans) =>
{
    Hue.show_current_image_modal(false)
}

Hue.command_actions['/date'] = (arg, ans) =>
{
    Hue.show_current_date()
}

Hue.command_actions['/js'] = (arg, ans) =>
{
    arg = arg.replace(/\s\/endjs/gi, "")
    Hue.execute_javascript(arg)
}

Hue.command_actions['/js2'] = (arg, ans) =>
{
    arg = arg.replace(/\s\/endjs/gi, "")
    Hue.execute_javascript(arg, false)
}

Hue.command_actions['/changeimage'] = (arg, ans) =>
{
    Hue.show_image_picker()
}

Hue.command_actions['/changetv'] = (arg, ans) =>
{
    Hue.show_tv_picker()
}

Hue.command_actions['/changeradio'] = (arg, ans) =>
{
    Hue.show_radio_picker()
}

Hue.command_actions['/closeall'] = (arg, ans) =>
{
    Hue.close_all_message()
}

Hue.command_actions['/closeallmodals'] = (arg, ans) =>
{
    Hue.close_all_modals()
}

Hue.command_actions['/closeallpopups'] = (arg, ans) =>
{
    Hue.close_all_popups()
}

Hue.command_actions['/activityabove'] = (arg, ans) =>
{
    Hue.activity_above(true)
}

Hue.command_actions['/activityabove2'] = (arg, ans) =>
{
    Hue.activity_above(false)
}

Hue.command_actions['/activitybelow'] = (arg, ans) =>
{
    Hue.activity_below(true)
}

Hue.command_actions['/activitybelow2'] = (arg, ans) =>
{
    Hue.activity_below(false)
}

Hue.command_actions['/globalsettings'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_global_settings(arg)
    }

    else
    {
        Hue.show_global_settings()
    }
}

Hue.command_actions['/roomsettings'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.show_room_settings(arg)
    }

    else
    {
        Hue.show_room_settings()
    }
}

Hue.command_actions['/goto'] = (arg, ans) =>
{
    Hue.goto_url(arg, "tab")
}

Hue.command_actions['/toggleplayradio'] = (arg, ans) =>
{
    Hue.toggle_play_radio()
}

Hue.command_actions['/refreshimage'] = (arg, ans) =>
{
    Hue.refresh_image()
}

Hue.command_actions['/refreshtv'] = (arg, ans) =>
{
    Hue.refresh_tv()
}

Hue.command_actions['/refreshradio'] = (arg, ans) =>
{
    Hue.refresh_radio()
}

Hue.command_actions['/stopradioin'] = (arg, ans) =>
{
    Hue.stop_radio_in(arg)
}

Hue.command_actions['/ping'] = (arg, ans) =>
{
    Hue.ping_server()
}

Hue.command_actions['/reactlike'] = (arg, ans) =>
{
    Hue.send_reaction("like")
}

Hue.command_actions['/reactlove'] = (arg, ans) =>
{
    Hue.send_reaction("love")
}

Hue.command_actions['/reacthappy'] = (arg, ans) =>
{
    Hue.send_reaction("happy")
}

Hue.command_actions['/reactmeh'] = (arg, ans) =>
{
    Hue.send_reaction("meh")
}

Hue.command_actions['/reactsad'] = (arg, ans) =>
{
    Hue.send_reaction("sad")
}

Hue.command_actions['/reactdislike'] = (arg, ans) =>
{
    Hue.send_reaction("dislike")
}

Hue.command_actions['/f1'] = (arg, ans) =>
{
    Hue.run_user_function(1)
    ans.to_history = false
}

Hue.command_actions['/f2'] = (arg, ans) =>
{
    Hue.run_user_function(2)
    ans.to_history = false
}

Hue.command_actions['/f3'] = (arg, ans) =>
{
    Hue.run_user_function(3)
    ans.to_history = false
}

Hue.command_actions['/f4'] = (arg, ans) =>
{
    Hue.run_user_function(4)
    ans.to_history = false
}

Hue.command_actions['/lockscreen'] = (arg, ans) =>
{
    Hue.lock_screen()
}

Hue.command_actions['/unlockscreen'] = (arg, ans) =>
{
    Hue.unlock_screen()
}

Hue.command_actions['/togglelockscreen'] = (arg, ans) =>
{
    if(Hue.room_state.screen_locked)
    {
        Hue.unlock_screen()
    }

    else
    {
        Hue.lock_screen()
    }
}

Hue.command_actions['/drawimage'] = (arg, ans) =>
{
    Hue.open_draw_image()
}

Hue.command_actions['/say'] = (arg, ans) =>
{
    Hue.process_message(
    {
        message: arg,
        to_history: ans.to_history,
        clr_input: ans.clr_input
    })
}

Hue.command_actions['/input'] = (arg, ans) =>
{
    arg = arg.replace(/\s\/endinput/gi, "")
    Hue.change_input(arg)
    ans.to_history = false
    ans.clr_input = false
}

Hue.command_actions['/top'] = (arg, ans) =>
{
    Hue.goto_top(true)
}
Hue.command_actions['/top2'] = (arg, ans) =>
{
    Hue.goto_top(false)
}

Hue.command_actions['/bottom'] = (arg, ans) =>
{
    Hue.goto_bottom(true, true)
}

Hue.command_actions['/bottom2'] = (arg, ans) =>
{
    Hue.goto_bottom(true, false)
}

Hue.command_actions['/background'] = (arg, ans) =>
{
    Hue.change_background_image_source(arg)
}

Hue.command_actions['/whatis'] = (arg, ans) =>
{
    Hue.inspect_command(arg)
}

Hue.command_actions['/refresh'] = (arg, ans) =>
{
    Hue.restart_client()
}

Hue.command_actions['/modifysetting'] = (arg, ans) =>
{
    Hue.modify_setting(arg)
}

Hue.command_actions['/modifysetting2'] = (arg, ans) =>
{
    Hue.modify_setting(arg, false)
}

Hue.command_actions['/feedback'] = (arg, ans) =>
{
    Hue.feedback(arg)
}

Hue.command_actions['/imagesmode'] = (arg, ans) =>
{
    Hue.change_room_images_mode(arg)
}

Hue.command_actions['/tvmode'] = (arg, ans) =>
{
    Hue.change_room_tv_mode(arg)
}

Hue.command_actions['/radiomode'] = (arg, ans) =>
{
    Hue.change_room_radio_mode(arg)
}

Hue.command_actions['/theme'] = (arg, ans) =>
{
    Hue.change_theme(arg)
}

Hue.command_actions['/thememode'] = (arg, ans) =>
{
    Hue.change_theme_mode(arg)
}

Hue.command_actions['/textcolormode'] = (arg, ans) =>
{
    Hue.change_text_color_mode(arg)
}

Hue.command_actions['/textcolor'] = (arg, ans) =>
{
    Hue.change_text_color(arg)
}

Hue.command_actions['/backgroundmode'] = (arg, ans) =>
{
    Hue.change_background_mode(arg)
}

Hue.command_actions['/backgroundeffect'] = (arg, ans) =>
{
    Hue.change_background_effect(arg)
}

Hue.command_actions['/tiledimensions'] = (arg, ans) =>
{
    Hue.change_background_tile_dimensions(arg)
}

Hue.command_actions['/adminactivity'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.request_admin_activity(arg)
    }

    else
    {  
        Hue.request_admin_activity()
    }
}

Hue.command_actions['/accesslog'] = (arg, ans) =>
{
    if(arg)
    {
        Hue.request_access_log(arg)
    }

    else
    {  
        Hue.request_access_log()
    }
}

Hue.command_actions['/togglefontsize'] = (arg, ans) =>
{
    Hue.toggle_chat_font_size()
}

Hue.command_actions['/adminlist'] = (arg, ans) =>
{
    Hue.request_admin_list()
}

Hue.command_actions['/toggleactivtybar'] = (arg, ans) =>
{
    Hue.toggle_activity_bar()
}

Hue.command_actions['/synthkey'] = (arg, ans) =>
{
    Hue.send_synth_key(arg)
}

Hue.command_actions['/synthkeylocal'] = (arg, ans) =>
{
    Hue.play_synth_key(arg)
}

Hue.command_actions['/togglemutesynth'] = (arg, ans) =>
{
    Hue.set_synth_muted()
}

Hue.command_actions['/speak'] = (arg, ans) =>
{
    Hue.send_synth_voice(arg)
}

Hue.command_actions['/speaklocal'] = (arg, ans) =>
{
    Hue.play_synth_voice(arg, Hue.username, true)
}

Hue.command_actions['/speech'] = (arg, ans) =>
{
    Hue.play_speech(arg)
}

Hue.command_actions['/unmaximize'] = (arg, ans) =>
{
    Hue.unmaximize_media()
}

Hue.command_actions['/maximizechat'] = (arg, ans) =>
{
    Hue.toggle_media()
}

Hue.command_actions['/autoscrollup'] = (arg, ans) =>
{
    Hue.autoscroll_up()
}

Hue.command_actions['/autoscrolldown'] = (arg, ans) =>
{
    Hue.autoscroll_down()
}

Hue.command_actions['/loadnextimage'] = (arg, ans) =>
{
    Hue.media_load_next("images")
}

Hue.command_actions['/loadprevimage'] = (arg, ans) =>
{
    Hue.media_load_previous("images")
}

Hue.command_actions['/loadnexttv'] = (arg, ans) =>
{
    Hue.media_load_next("tv")
}

Hue.command_actions['/loadprevtv'] = (arg, ans) =>
{
    Hue.media_load_previous("tv")
}

Hue.command_actions['/loadnextradio'] = (arg, ans) =>
{
    Hue.media_load_next("radio")
}

Hue.command_actions['/loadprevradio'] = (arg, ans) =>
{
    Hue.media_load_previous("radio")
}