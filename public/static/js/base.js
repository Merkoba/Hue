const Hue = {}

Hue.debug_socket = true
Hue.debug_functions = false

Hue.ls_global_settings = "global_settings_v1"
Hue.ls_room_settings = "room_settings_v1"
Hue.ls_room_state = "room_state_v1"
Hue.ls_input_history = "input_history_v16"
Hue.ls_first_time = "first_time_v2"
Hue.vtypes = ["voice1", "voice2", "voice3", "voice4"]
Hue.roles = ["admin", "op"].concat(Hue.vtypes)
Hue.topic = ''
Hue.topic_setter = ''
Hue.topic_date = ''
Hue.colorlib = ColorLib()
Hue.played = []
Hue.input_history = []
Hue.input_history_index = 0
Hue.chat_history = []
Hue.userlist = []
Hue.usernames = []
Hue.role = ''
Hue.can_chat = false
Hue.can_images = false
Hue.can_radio = false
Hue.can_tv = false
Hue.loaded_radio_source = ""
Hue.loaded_radio_type = "radio"
Hue.loaded_radio_metadata = ""
Hue.tab_info = {}
Hue.crm = false
Hue.orb = false
Hue.rup = false
Hue.tup = false
Hue.iup = false
Hue.gtr = false
Hue.imp = false
Hue.biu = false
Hue.alo = false
Hue.minpo = false
Hue.modal_open = false
Hue.started = false
Hue.started_safe = false
Hue.afk = false
Hue.alert_mode = 0
Hue.commands_sorted = {}
Hue.utilz = Utilz()
Hue.change_image_when_focused = false
Hue.change_tv_when_focused = false
Hue.change_radio_when_focused = false
Hue.room_images_mode = "enabled"
Hue.room_tv_mode = "enabled"
Hue.room_radio_mode = "enabled"
Hue.radio_started = false
Hue.background_image_setter = ""
Hue.background_image_date = ""
Hue.last_image_source = false
Hue.last_tv_source = false
Hue.last_tv_type = false
Hue.last_radio_source = false
Hue.last_radio_type = false
Hue.files = {}
Hue.input_changed = false
Hue.youtube_video_play_on_queue = false
Hue.message_id = 0
Hue.popup_message_id = 0
Hue.writing_message = false
Hue.double_tap_key_pressed = 0
Hue.double_tap_key_2_pressed = 0
Hue.double_tap_key_3_pressed = 0
Hue.images_visible = true
Hue.tv_visible = true
Hue.radio_visible = true
Hue.images_changed = []
Hue.tv_changed = [] 
Hue.radio_changed = []
Hue.modal_image_open = false
Hue.current_modal_image_index
Hue.current_image_source = ""
Hue.current_image_info = ""
Hue.current_image_date = 0
Hue.filter_delay = 350
Hue.resize_delay = 350
Hue.double_tap_delay = 250
Hue.wheel_delay = 100
Hue.wheel_delay_2 = 25
Hue.check_scrollers_delay = 100
Hue.requesting_roomlist = false
Hue.emit_queue = []
Hue.app_focused = true
Hue.message_uname = ""
Hue.message_type = ""
Hue.users_to_disconnect = []
Hue.stop_radio_delay = 0
Hue.aura_timeouts = {}
Hue.reaction_types = ["like", "love", "happy", "meh", "sad", "dislike"]
Hue.mouse_over_reactions = false
Hue.reactions_hover_delay = 800
Hue.user_functions = [1, 2, 3, 4]
Hue.mouse_is_down = false
Hue.draw_message_just_entered = false
Hue.draw_image_just_entered = false
Hue.draw_image_mode = "pencil"
Hue.draw_image_scale = 2.4
Hue.draw_image_num_strokes_save = 500
Hue.draw_image_max_levels = 200
Hue.draw_image_open = false
Hue.highlight_same_posts_timeouts = {}
Hue.highlight_same_posts_delay = 800
Hue.radio_get_metadata_ongoing = false
Hue.radio_get_metadata = false
Hue.log_messages_processed = false
Hue.command_aliases = {}
Hue.play_video_on_load = false
Hue.commands_queue = {}
Hue.user_leaving = false
Hue.admin_activity_filter_string = ""
Hue.access_log_filter_string = ""
Hue.keys_pressed = {}
Hue.hide_infotip_delay = 2000
Hue.active_modal = false
Hue.activity_list = []
Hue.HOUR = 3600000
Hue.DAY = 86400000
Hue.YEAR = 31536000000
Hue.editing_message = false
Hue.editing_message_container = false
Hue.editing_message_area = false
Hue.footer_oversized = false
Hue.input_clone_created = false
Hue.synth_timeout_delay = 800
Hue.synth_recent_users = []
Hue.synth_open = false
Hue.synth_voice_speeches = []

Hue.commands = 
[
	'/me', '/clear', '/clearinput', '/unclear',
	'/users', '/room', '/publicrooms', '/visitedrooms',
	'/roomname', '/roomnameedit', '/played', '/search',
	'/role', '/voice1', '/voice2', '/voice3',
	'/voice4', '/op', '/admin', '/resetvoices',
	'/removeops', '/ban', '/unban', '/unbanall',
	'/bannedcount', '/kick', '/public', '/private',
	'/log', '/enablelog', '/disablelog', '/clearlog',
	'/radio', '/tv', '/image', '/images',
	'/privacy', '/status', '/topic', '/topicadd',
	'/topictrim', '/topicaddstart', '/topictrimstart', '/topicedit',
	'/help3', '/help2', '/help', '/stopradio',
	'/startradio', '/radiovolume', '/tvvolume', '/volume',
	'/history', '/logout', '/details', '/changeusername',
	'/changepassword', '/changeemail', '/verifyemail', '/fill',
	'/shrug', '/afk', '/disconnectothers', '/whisper',
	'/whisper2', '/endwhisper', '/whisperops', '/annex',
	'/highlights', '/lock', '/unlock', '/stopandlock',
	'/stop', '/default', '/menu', '/media',
	'/user', '/imagehistory', '/tvhistory', '/radiohistory',
	'/lockimages', '/locktv', '/lockradio', '/unlockimages',
	'/unlocktv', '/unlockradio', '/togglelockimages', '/togglelocktv',
	'/togglelockradio', '/showimages', '/showtv', '/showradio',
	'/hideimages', '/hidetv', '/hideradio', '/toggleimages',
	'/toggletv', '/toggleradio', '/test', '/maximizeimages',
	'/maximizetv', '/starttv', '/stoptv', '/openimage',
	'/openlastimage', '/date', '/js', '/js2',
	'/changeimage', '/changetv', '/chenlastimage', '/date',
	'/js', '/js2', '/endjs', '/changeimage',
	'/changetv', '/changeradio', '/closeall', '/closeallmodals',
	'/closeallpopups', '/closeandwait', '/activityabove', '/activityabove2',
	'/activitybelow', '/activitybelow2', '/globalsettings', '/roomsettings',
	'/goto', '/broadcast', '/systembroadcast', '/systemrestart',
	'/toggleplayradio', '/refreshimage', '/refreshtv', '/refreshradio',
	'/stopradioin', '/ping', '/reactlike', '/reactlove',
	'/reacthappy', '/reactmeh', '/reactsad', '/reactdislike',
	'/f1', '/f2', '/f3', '/f4',
	'/lockscreen', '/unlockscreen', '/togglelockscreen', '/drawimage',
	'/joinvoicechat', '/leavevoicechat', '/say', '/sleep',
	'/input', '/endinput', '/inputenter', '/top',
	'/top2', '/bottom', '/bottom2', '/background',
	'/whatis', '/refresh', '/modifysetting', '/modifysetting2',
	'/feedback', '/imagesmode', '/tvmode', '/radiomode',
	'/voicechatmode', '/voicepermission', '/theme', '/textcolormode',
	'/textcolor', '/backgroundmode', '/tiledimensions', '/adminactivity',
	'/clearlog2', '/togglefontsize', '/backgroundeffect', '/adminlist',
	'/accesslog', '/toggleactivtybar', '/thememode', '/synthkey',
	'/togglemutesynth', '/speak', '/synthkeylocal', '/speaklocal',
	'/unmaximize'
]

Hue.user_settings =
{
	background_image: {widget_type:"checkbox"},
	custom_scrollbars: {widget_type:"checkbox"},
	beep_on_messages: {widget_type:"checkbox"},
	beep_on_highlights: {widget_type:"checkbox"},
	beep_on_media_change: {widget_type:"checkbox"},
	beep_on_user_joins: {widget_type:"checkbox"},
	modal_effects: {widget_type:"checkbox"},
	highlight_current_username: {widget_type:"checkbox"},
	case_insensitive_username_highlights: {widget_type:"checkbox"},
	case_insensitive_words_highlights: {widget_type:"checkbox"},
	case_insensitive_ignored_words: {widget_type:"checkbox"},
	ignored_words_exclude_same_user: {widget_type:"checkbox"},
	other_words_to_highlight: {widget_type:"textarea"},
	double_tap: {widget_type:"textarea"},
	double_tap_2: {widget_type:"textarea"},
	double_tap_3: {widget_type:"textarea"},
	at_startup: {widget_type:"textarea"},
	afk_delay: {widget_type:"select"},
	ignored_usernames: {widget_type:"textarea"},
	ignored_words: {widget_type:"textarea"},
	show_joins: {widget_type:"checkbox"},
	show_parts: {widget_type:"checkbox"},
	animate_scroll: {widget_type:"checkbox"},
	new_messages_separator: {widget_type:"checkbox"},
	afk_disable_messages_beep: {widget_type:"checkbox"},
	afk_disable_highlights_beep: {widget_type:"checkbox"},
	afk_disable_media_change_beep: {widget_type:"checkbox"},
	afk_disable_joins_beep: {widget_type:"checkbox"},
	afk_disable_image_change: {widget_type:"checkbox"},
	afk_disable_tv_change: {widget_type:"checkbox"},
	afk_disable_radio_change: {widget_type:"checkbox"},
	afk_disable_synth: {widget_type:"checkbox"},
	open_popup_messages: {widget_type:"checkbox"},
	user_function_1: {widget_type:"textarea"},
	user_function_2: {widget_type:"textarea"},
	user_function_3: {widget_type:"textarea"},
	user_function_4: {widget_type:"textarea"},
	user_function_1_name: {widget_type:"text"},
	user_function_2_name: {widget_type:"text"},
	user_function_3_name: {widget_type:"text"},
	user_function_4_name: {widget_type:"text"},
	on_lockscreen: {widget_type:"textarea"},
	on_unlockscreen: {widget_type:"textarea"},
	afk_on_lockscreen: {widget_type:"checkbox"},
	chat_layout: {widget_type:"select"},
	aliases: {widget_type:"textarea"},
	other_words_to_autocomplete: {widget_type:"textarea"},
	chat_font_size: {widget_type:"select"},
	warn_before_closing: {widget_type:"checkbox"},
	activity_bar: {widget_type:"checkbox"},
	show_image_previews: {widget_type:"checkbox"},
	show_link_previews: {widget_type:"checkbox"},
	stop_radio_on_tv_play: {widget_type:"checkbox"},
	stop_tv_on_radio_play: {widget_type:"checkbox"},
	synth_enabled: {widget_type:"checkbox"},
	chat_display_percentage: {widget_type:"custom"},
	tv_display_percentage: {widget_type:"custom"},
	tv_display_position: {widget_type:"custom"}
}

Hue.synth_key_names =
{
	1: "one", 2:"two", 3:"three", 4:"four", 5:"five",
	6: "six", 7:"seven", 8:"eight", 9:"nine", 10:"zero"
}

Hue.init = function()
{
	Hue.activate_key_detection()
	Hue.setup_templates()
	Hue.get_global_settings()
	Hue.get_room_settings()
	Hue.get_room_state()
	Hue.set_loaded_settings_state()
	Hue.set_radio_volume()
	Hue.start_msg()
	Hue.start_settings_widgets("global_settings")
	Hue.start_settings_widgets_listeners("global_settings")
	Hue.start_settings_widgets("room_settings")
	Hue.start_settings_widgets_listeners("room_settings")
	Hue.setup_settings_windows()
	Hue.start_filters()
	Hue.start_image_events()
	Hue.start_dropzone()
	Hue.start_volume_scroll()
	Hue.generate_highlight_words_regex()
	Hue.generate_ignored_words_regex()
	Hue.activate_visibility_listener()
	Hue.copypaste_events()
	Hue.scroll_events()
	Hue.resize_events()
	Hue.setup_commands()
	Hue.setup_chat()
	Hue.start_chat_mouse_events()
	Hue.start_chat_hover_events()
	Hue.start_played_click_events()
	Hue.start_userlist_click_events()
	Hue.start_roomlist_click_events()
	Hue.start_generic_uname_click_events()
	Hue.start_username_context_menu()
	Hue.start_played_context_menu()
	Hue.start_volume_context_menu()
	Hue.start_toggle_radio_context_menu()
	Hue.start_main_menu_context_menu()
	Hue.start_tv_maxer_context_menu()
	Hue.start_chat_maxer_context_menu()
	Hue.start_titles()
	Hue.setup_show_profile()
	Hue.setup_main_menu()
	Hue.start_twitch()
	Hue.start_soundcloud()
	Hue.setup_input()
	Hue.setup_input_history()
	Hue.setup_modal_image()
	Hue.setup_footer()
	Hue.setup_reactions_box()
	Hue.prepare_media_settings()
	Hue.setup_message_area()
	Hue.setup_mouse_events()
	Hue.setup_draw_image()
	Hue.setup_autocomplete()
	Hue.start_other_scrollbars()
	Hue.setup_user_function_titles()
	Hue.setup_modal_image_number()
	Hue.setup_command_aliases()
	Hue.setup_fonts()
	Hue.setup_before_unload()
	Hue.setup_jumpers()
	Hue.start_reply_events()
	Hue.set_user_settings_titles()
	Hue.maxers_mouse_events()
	Hue.check_screen_lock()
	Hue.setup_iframe_video()
	Hue.setup_synth()
	Hue.show_console_message()

	if(Hue.debug_functions)
	{
		Hue.wrap_functions()
	}

	Hue.start_socket()
}

Hue.make_main_container_visible = function()
{
	$("#loading").css("opacity", 0)
	$("#main_container").css("opacity", 1).css("pointer-events", "initial")

	setTimeout(function()
	{
		$("#loading").css("display", "none")
	}, 1600)
}

Hue.get_local_storage = function(ls_name)
{
	let obj

	if(localStorage[ls_name])
	{
		try
		{
			obj = JSON.parse(localStorage.getItem(ls_name))
		}

		catch(err)
		{
			localStorage.removeItem(ls_name)
			obj = null
		}
	}

	else
	{
		obj = null
	}

	return obj
}

Hue.save_local_storage = function(ls_name, obj)
{
	if(typeof obj !== "string")
	{
		obj = JSON.stringify(obj)
	}

	localStorage.setItem(ls_name, obj)
}

Hue.remove_local_storage = function(ls_name)
{
	localStorage.removeItem(ls_name)
}

Hue.setup_templates = function()
{
	Hue.template_main_menu = Handlebars.compile($('#template_main_menu').html())
	Hue.template_create_room = Handlebars.compile($('#template_create_room').html())
	Hue.template_open_room = Handlebars.compile($('#template_open_room').html())
	Hue.template_userlist = Handlebars.compile($('#template_userlist').html())
	Hue.template_roomlist = Handlebars.compile($('#template_roomlist').html())
	Hue.template_played = Handlebars.compile($('#template_played').html())
	Hue.template_status = Handlebars.compile($('#template_status').html())
	Hue.template_help = Handlebars.compile($('#template_help').html())
	Hue.template_help1 = Handlebars.compile($('#template_help1').html())
	Hue.template_help2 = Handlebars.compile($('#template_help2').html())
	Hue.template_help3 = Handlebars.compile($('#template_help3').html())
	Hue.template_user_menu = Handlebars.compile($('#template_user_menu').html())
	Hue.template_profile = Handlebars.compile($('#template_profile').html())
	Hue.template_image_picker = Handlebars.compile($('#template_image_picker').html())
	Hue.template_tv_picker = Handlebars.compile($('#template_tv_picker').html())
	Hue.template_radio_picker = Handlebars.compile($('#template_radio_picker').html())
	Hue.template_media_menu = Handlebars.compile($('#template_media_menu').html())
	Hue.template_message = Handlebars.compile($('#template_message').html())
	Hue.template_highlights = Handlebars.compile($('#template_highlights').html())
	Hue.template_image_history = Handlebars.compile($('#template_image_history').html())
	Hue.template_tv_history = Handlebars.compile($('#template_tv_history').html())
	Hue.template_radio_history = Handlebars.compile($('#template_radio_history').html())
	Hue.template_input_history = Handlebars.compile($('#template_input_history').html())
	Hue.template_chat_search = Handlebars.compile($('#template_chat_search').html())
	Hue.template_modal_image = Handlebars.compile($('#template_modal_image').html())
	Hue.template_modal_image_number = Handlebars.compile($('#template_modal_image_number').html())
	Hue.template_locked_menu = Handlebars.compile($('#template_locked_menu').html())
	Hue.template_settings = Handlebars.compile($('#template_settings').html())
	Hue.template_global_settings = Handlebars.compile($('#template_global_settings').html())
	Hue.template_room_settings = Handlebars.compile($('#template_room_settings').html())
	Hue.template_lockscreen = Handlebars.compile($('#template_lockscreen').html())
	Hue.template_draw_image = Handlebars.compile($('#template_draw_image').html())
	Hue.template_credits = Handlebars.compile($('#template_credits').html())
	Hue.template_open_url = Handlebars.compile($('#template_open_url').html())
	Hue.template_background_image_select = Handlebars.compile($('#template_background_image_select').html())
	Hue.template_background_image_input = Handlebars.compile($('#template_background_image_input').html())
	Hue.template_goto_room = Handlebars.compile($('#template_goto_room').html())
	Hue.template_admin_activity = Handlebars.compile($('#template_admin_activity').html())
	Hue.template_access_log = Handlebars.compile($('#template_access_log').html())
	Hue.template_expand_image = Handlebars.compile($('#template_expand_image').html())
}

Hue.show_help = function(number=1, filter="")
{	
	let template = Hue[`template_help${number}`]

	if(template)
	{
		let title

		if(number == 1)
		{
			title = "Basic Features"
		}

		else if(number == 2)
		{
			title = "Additional Features"
		}

		else if(number == 3)
		{
			title = "Administration Features"
		}

		$("#help_content").html(template())

		Hue.msg_help.show(function()
		{
			$("#help_filter").val(filter)
			
			Hue.do_modal_filter_timer()
		})

		Hue.msg_help.set_title(title)
	}
}

Hue.show_public = function()
{
	if(Hue.is_public)
	{
		Hue.feedback('This room is public')
	}

	else
	{
		Hue.feedback('This room is private')
	}
}

Hue.show_room = function()
{
	Hue.feedback(`Room: ${Hue.room_name}`)
}

Hue.change_room_name = function(arg)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	arg = Hue.utilz.clean_string2(arg.substring(0, Hue.max_room_name_length))

	if(arg === Hue.room_name)
	{
		Hue.feedback("That's already the room name")
		return
	}

	if(arg.length > 0)
	{
		Hue.socket_emit("change_room_name", {name:arg})
	}
}

Hue.room_name_edit = function()
{
	Hue.change_input(`/roomname ${Hue.room_name}`)
}

Hue.get_proper_media_url = function(type)
{
	let source = Hue[`current_${type}`]().source

	if(source.startsWith("/"))
	{
		source = window.location.origin + source
	}

	return source
}

Hue.show_media_source = function(what)
{
	let source = Hue.get_proper_media_url(what)
	let setter = Hue[`${what}_setter`]
	let date = Hue[`${what}_date`]

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
		Hue.feedback(`${s} Source: ${source}`, {title:`Setter: ${setter} | ${date}`})
	}

	else
	{
		Hue.feedback(`${s} Source: ${source}`)
	}
}

Hue.get_unset_topic = function()
{
	if(Hue.is_admin_or_op())
	{
		return Hue.default_topic_admin
	}

	else
	{
		return Hue.default_topic
	}
}

Hue.get_topic = function()
{
	if(Hue.topic)
	{
		return Hue.topic
	}

	else
	{
		return Hue.get_unset_topic()
	}
}

Hue.show_topic = function()
{
	if(Hue.topic)
	{
		if(Hue.topic_setter !== "")
		{
			Hue.feedback(`Topic: ${Hue.topic}`, {title:`Setter: ${Hue.topic_setter} | ${Hue.topic_date}`})
		}

		else
		{
			Hue.feedback(`Topic: ${Hue.topic}`)
		}
	}

	else
	{
		Hue.feedback(`Topic: ${Hue.get_unset_topic()}`)
	}
}

Hue.start_permissions = function(data)
{
	Hue.voice1_chat_permission = data.voice1_chat_permission
	Hue.voice1_images_permission = data.voice1_images_permission
	Hue.voice1_tv_permission = data.voice1_tv_permission
	Hue.voice1_radio_permission = data.voice1_radio_permission
	Hue.voice1_synth_permission = data.voice1_synth_permission

	Hue.voice2_chat_permission = data.voice2_chat_permission
	Hue.voice2_images_permission = data.voice2_images_permission
	Hue.voice2_tv_permission = data.voice2_tv_permission
	Hue.voice2_radio_permission = data.voice2_radio_permission
	Hue.voice2_synth_permission = data.voice2_synth_permission

	Hue.voice3_chat_permission = data.voice3_chat_permission
	Hue.voice3_images_permission = data.voice3_images_permission
	Hue.voice3_tv_permission = data.voice3_tv_permission
	Hue.voice3_radio_permission = data.voice3_radio_permission
	Hue.voice3_synth_permission = data.voice3_synth_permission

	Hue.voice4_chat_permission = data.voice4_chat_permission
	Hue.voice4_images_permission = data.voice4_images_permission
	Hue.voice4_tv_permission = data.voice4_tv_permission
	Hue.voice4_radio_permission = data.voice4_radio_permission
	Hue.voice4_synth_permission = data.voice4_synth_permission
}

Hue.check_permissions = function()
{
	Hue.can_chat = Hue.check_permission(Hue.role, "chat")
	Hue.can_images = Hue.room_images_mode === "enabled" && Hue.check_permission(Hue.role, "images")
	Hue.can_tv = Hue.room_tv_mode === "enabled" && Hue.check_permission(Hue.role, "tv")
	Hue.can_radio = Hue.room_radio_mode === "enabled" && Hue.check_permission(Hue.role, "radio")
	Hue.can_synth = Hue.room_synth_mode === "enabled" && Hue.check_permission(Hue.role, "synth")

	Hue.setup_icons()
}

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

Hue.setup_icons = function()
{
	if(Hue.room_images_mode === "disabled")
	{
		$("#footer_images_controls").css("display", "none")
	}

	else
	{
		$("#footer_images_controls").css("display", "flex")
	}

	if(Hue.can_images)
	{
		$("#footer_images_icon_container").css("display", "flex")
	}

	else
	{
		$("#footer_images_icon_container").css("display", "none")
	}

	if(Hue.room_tv_mode === "disabled")
	{
		$("#footer_tv_controls").css("display", "none")
	}

	else
	{
		$("#footer_tv_controls").css("display", "flex")
	}

	if(Hue.can_tv)
	{
		$("#footer_tv_icon_container").css("display", "flex")
	}

	else
	{
		$("#footer_tv_icon_container").css("display", "none")
	}

	if(Hue.room_radio_mode === "disabled")
	{
		$("#footer_radio_controls").css("display", "none")
	}

	else
	{
		$("#footer_radio_controls").css("display", "flex")
	}

	if(Hue.can_radio)
	{
		$("#footer_radio_icon_container").css("display", "flex")
	}

	else
	{
		$("#footer_radio_icon_container").css("display", "none")
	}
}

Hue.show_role = function(data)
{
	if(Hue.role === 'admin')
	{
		Hue.feedback('You are an admin')
	}

	else if(Hue.role === 'op')
	{
		Hue.feedback('You are an op')
	}

	else if(Hue.role.startsWith('voice'))
	{
		Hue.feedback(`You have ${Hue.role}`)
	}

	let ps = 0

	if(Hue.can_chat)
	{
		Hue.feedback("You have chat permission")

		ps += 1
	}

	if(Hue.can_images)
	{
		Hue.feedback("You have images permission")

		ps += 1
	}

	if(Hue.can_tv)
	{
		Hue.feedback("You have tv permission")

		ps += 1
	}

	if(Hue.can_radio)
	{
		Hue.feedback("You have radio permission")

		ps += 1
	}

	if(ps === 0)
	{
		Hue.feedback("You cannot interact")
	}
}

Hue.show_username = function()
{
	Hue.feedback(`Username: ${Hue.username}`)
}

Hue.socket_emit = function(destination, data)
{
	let obj =
	{
		destination: destination,
		data: data
	}

	Hue.emit_queue.push(obj)

	if(Hue.emit_queue_timeout === undefined)
	{
		Hue.check_emit_queue()
	}
}

Hue.check_emit_queue = function()
{
	if(Hue.emit_queue.length > 0)
	{
		let obj = Hue.emit_queue[0]

		if(obj !== "first")
		{
			Hue.do_socket_emit(obj)
		}

		Hue.emit_queue.shift()

		Hue.emit_queue_timeout = setTimeout(function()
		{
			Hue.check_emit_queue()
		}, Hue.socket_emit_throttle)
	}

	else
	{
		clearTimeout(Hue.emit_queue_timeout)
		Hue.emit_queue_timeout = undefined
	}
}

Hue.do_socket_emit = function(obj)
{
	if(Hue.debug_socket)
	{
		console.info(`Emit: ${obj.destination}`)
	}

	obj.data.server_method_name = obj.destination
	Hue.socket.emit("server_method", obj.data)
}

Hue.start_socket = function()
{
	Hue.socket = io('/',
	{
		reconnection: false
	})

	Hue.socket.on('connect', () =>
	{
		Hue.socket_emit('join_room', {room_id:Hue.room_id, user_id:Hue.user_id, token:Hue.jwt_token})
	})

	Hue.socket.on('disconnect', (reason) =>
	{
		if(Hue.started)
		{
			setTimeout(function()
			{
				Hue.restart_client()
			}, 2000)
		}
	})

	Hue.socket.on('update', (data) =>
	{
		if(data.type === 'joined')
		{
			Hue.init_data = data

			Hue.room_locked = data.room_locked

			if(Hue.room_locked)
			{
				Hue.start_locked_mode()
				return false
			}

			Hue.room_name = data.room_name
			Hue.set_username(data.username)
			Hue.set_email(data.email)
			Hue.user_reg_date = data.reg_date
			Hue.setup_profile_image(data.profile_image)
			Hue.userlist = data.userlist
			Hue.update_userlist()
			Hue.log_enabled = data.log
			Hue.log_messages = data.log_messages
			Hue.setup_theme_and_background(data)
			Hue.apply_background()
			Hue.apply_theme()
			Hue.setup_active_media(data)
			Hue.start_permissions(data)
			Hue.is_public = data.public
			Hue.set_role(data.role, false)
			Hue.set_topic_info(data)
			Hue.update_title()
			Hue.setup_user_menu()
			Hue.clear_chat()
			Hue.check_firstime()
			Hue.get_input_history()
			Hue.show_joined()
			Hue.start_active_media()
			Hue.check_maxers()
			Hue.config_main_menu()
			Hue.start_metadata_loop()
			Hue.chat_scroll_bottom()
			Hue.make_main_container_visible()
			Hue.setup_activity_bar()

			Hue.at_startup()
		}

		else if(data.type === 'typing')
		{
			Hue.show_typing(data)
		}

		else if(data.type === 'chat_message')
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

		else if(data.type === 'request_slice_upload')
		{
			Hue.request_slice_upload(data)
		}

		else if(data.type === 'upload_ended')
		{
			Hue.upload_ended(data)
		}

		else if(data.type === 'changed_image_source')
		{
			Hue.setup_image("change", data)
		}

		else if(data.type === 'changed_tv_source')
		{
			Hue.setup_tv("change", data)
		}

		else if(data.type === 'restarted_tv_source')
		{
			Hue.setup_tv("restart")
		}

		else if(data.type === 'changed_radio_source')
		{
			Hue.setup_radio("change", data)
		}

		else if(data.type === 'restarted_radio_source')
		{
			Hue.setup_radio("restart")
		}

		else if(data.type === 'profile_image_changed')
		{
			Hue.profile_image_changed(data)
		}

		else if(data.type === 'userjoin')
		{
			Hue.userjoin(data)
		}

		else if(data.type === 'roomlist')
		{
			Hue.update_roomlist(data.rtype, data.roomlist)

			if(data.rtype === "public_roomlist")
			{
				Hue.show_public_roomlist()
			}

			else if(data.rtype === "visited_roomlist")
			{
				Hue.show_visited_roomlist()
			}
		}

		else if(data.type === 'upload_error')
		{
			Hue.show_upload_error()
		}

		else if(data.type === 'topic_change')
		{
			Hue.announce_topic_change(data)
		}

		else if(data.type === 'room_name_changed')
		{
			Hue.announce_room_name_change(data)
		}

		else if(data.type === 'log_changed')
		{
			Hue.announce_log_change(data)
		}

		else if(data.type === 'log_cleared')
		{
			Hue.announce_log_cleared(data)
		}

		else if(data.type === 'announce_role_change')
		{
			Hue.announce_role_change(data)
		}

		else if(data.type === 'voices_resetted')
		{
			Hue.announce_voices_resetted(data)
		}

		else if(data.type === 'announce_removedops')
		{
			Hue.announce_removedops(data)
		}

		else if(data.type === 'announce_ban')
		{
			Hue.public_feedback(`${data.username1} banned ${data.username2}`,
			{
				username: data.username1,
				open_profile: true
			})
		}

		else if(data.type === 'announce_unban')
		{
			Hue.public_feedback(`${data.username1} unbanned ${data.username2}`,
			{
				username: data.username1,
				open_profile: true
			})
		}

		else if(data.type === 'announce_unban_all')
		{
			Hue.announce_unban_all(data)
		}

		else if(data.type === 'receive_banned_count')
		{
			Hue.receive_banned_count(data)
		}

		else if(data.type === 'nothingtounban')
		{
			Hue.feedback("There was nothing to unban")
		}

		else if(data.type === 'nothingtoclear')
		{
			Hue.feedback("There was nothing to clear")
		}

		else if(data.type === 'listbans')
		{
			Hue.show_listbans(data)
		}

		else if(data.type === 'forbiddenuser')
		{
			Hue.forbiddenuser()
		}

		else if(data.type === 'nothing_was_found')
		{
			Hue.feedback("Nothing was found")
		}

		else if(data.type === 'user_not_found')
		{
			Hue.feedback("User doesn't exist")
		}

		else if(data.type === 'user_not_in_room')
		{
			Hue.user_not_in_room()
		}

		else if(data.type === 'noopstoremove')
		{
			Hue.feedback("There were no ops to remove")
		}

		else if(data.type === 'novoicestoreset')
		{
			Hue.feedback("There were no voices to reset")
		}

		else if(data.type === 'isalready')
		{
			Hue.isalready(data.who, data.what)
		}

		else if(data.type === 'user_already_banned')
		{
			Hue.feedback("User is already banned")
		}

		else if(data.type === 'user_already_unbanned')
		{
			Hue.feedback("User is already unbanned")
		}

		else if(data.type === 'privacy_change')
		{
			Hue.announce_privacy_change(data)
		}

		else if(data.type === 'imagenotfound')
		{
			Hue.feedback("The image couldn't be found")
		}

		else if(data.type === 'songnotfound')
		{
			Hue.feedback("The song couldn't be found")
		}

		else if(data.type === 'videonotfound')
		{
			Hue.feedback("The video couldn't be found")
		}

		else if(data.type === 'image_cooldown_wait')
		{
			Hue.feedback("The image was changed recently. You must wait a while before changing it again")
		}

		else if(data.type === 'tv_cooldown_wait')
		{
			Hue.feedback("The tv was changed recently. You must wait a while before changing it again")
		}

		else if(data.type === 'radio_cooldown_wait')
		{
			Hue.feedback("The radio was changed recently. You must wait a while before changing it again")
		}

		else if(data.type === 'room_created')
		{
			Hue.on_room_created(data)
		}

		else if(data.type === 'redirect')
		{
			Hue.goto_url(data.location)
		}

		else if(data.type === 'username_already_exists')
		{
			Hue.feedback(`${data.username} already exists`)
		}

		else if(data.type === 'email_already_exists')
		{
			Hue.feedback(`${data.email} already exists`)
		}

		else if(data.type === 'new_username')
		{
			Hue.announce_new_username(data)
		}

		else if(data.type === 'password_changed')
		{
			Hue.password_changed(data)
		}

		else if(data.type === 'email_changed')
		{
			Hue.email_changed(data)
		}

		else if(data.type === 'room_images_mode_change')
		{
			Hue.announce_room_images_mode_change(data)
		}

		else if(data.type === 'room_tv_mode_change')
		{
			Hue.announce_room_tv_mode_change(data)
		}

		else if(data.type === 'room_radio_mode_change')
		{
			Hue.announce_room_radio_mode_change(data)
		}

		else if(data.type === 'room_synth_mode_change')
		{
			Hue.announce_room_synth_mode_change(data)
		}

		else if(data.type === 'theme_mode_changed')
		{
			Hue.announce_theme_mode_change(data)
		}

		else if(data.type === 'theme_change')
		{
			Hue.announce_theme_change(data)
		}

		else if(data.type === 'background_image_change')
		{
			Hue.announce_background_image_change(data)
		}

		else if(data.type === 'background_mode_changed')
		{
			Hue.announce_background_mode_change(data)
		}

		else if(data.type === 'background_effect_changed')
		{
			Hue.announce_background_effect_change(data)
		}

		else if(data.type === 'background_tile_dimensions_changed')
		{
			Hue.announce_background_tile_dimensions_change(data)
		}

		else if(data.type === 'text_color_mode_changed')
		{
			Hue.announce_text_color_mode_change(data)
		}

		else if(data.type === 'text_color_changed')
		{
			Hue.announce_text_color_change(data)
		}

		else if(data.type === 'voice_permission_change')
		{
			Hue.announce_voice_permission_change(data)
		}

		else if(data.type === 'userdisconnect')
		{
			Hue.userdisconnect(data)
		}

		else if(data.type === 'othersdisconnected')
		{
			Hue.show_others_disconnected(data)
		}

		else if(data.type === 'whisper')
		{
			Hue.popup_message_received(data)
		}

		else if(data.type === 'whisper_ops')
		{
			Hue.popup_message_received(data, "ops")
		}

		else if(data.type === 'room_broadcast')
		{
			Hue.popup_message_received(data, "room")
		}

		else if(data.type === 'system_broadcast')
		{
			Hue.popup_message_received(data, "system")
		}

		else if(data.type === 'system_restart_signal')
		{
			Hue.restart_client()
		}

		else if(data.type === 'error_occurred')
		{
			Hue.error_occurred()
		}

		else if(data.type === 'email_change_code_sent')
		{
			Hue.feedback(`Verification code sent. Use the command sent to ${data.email}. Email might take a couple of minutes to arrive`)
		}

		else if(data.type === 'email_change_code_not_sent')
		{
			Hue.feedback(`Verification code not sent yet. Use /changeemail [new_email] to get a verification code`)
		}

		else if(data.type === 'email_change_wait')
		{
			Hue.feedback(`You must wait a while before changing the email again`)
		}

		else if(data.type === 'email_change_wrong_code')
		{
			Hue.feedback(`Code supplied didn't match`)
		}

		else if(data.type === 'email_change_expired_code')
		{
			Hue.feedback(`Code supplied has expired`)
		}

		else if(data.type === 'create_room_wait')
		{
			Hue.msg_info.show("You must wait a while before creating another room")
		}

		else if(data.type === 'pong_received')
		{
			Hue.pong_received(data)
		}

		else if(data.type === 'reaction_received')
		{
			Hue.show_reaction(data)
		}

		else if(data.type === 'cannot_embed_iframe')
		{
			Hue.feedback("That website cannot be embedded")
		}

		else if(data.type === 'same_image')
		{
			Hue.feedback("Image is already set to that")
		}

		else if(data.type === 'same_tv')
		{
			Hue.feedback("TV is already set to that")
		}

		else if(data.type === 'same_radio')
		{
			Hue.feedback("Radio is already set to that")
		}

		else if(data.type === 'receive_admin_activity')
		{
			Hue.show_admin_activity(data.messages)
		}

		else if(data.type === 'receive_access_log')
		{
			Hue.show_access_log(data.messages)
		}

		else if(data.type === 'receive_admin_list')
		{
			Hue.show_admin_list(data)
		}

		else if(data.type === 'activity_trigger')
		{
			Hue.push_to_activity_bar(data.username, Date.now())
		}

		else if(data.type === 'message_removed')
		{
			Hue.remove_message_from_chat(data)
		}

		else if(data.type === 'receive_synth_key')
		{
			Hue.receive_synth_key(data)
		}

		else if(data.type === 'receive_synth_voice')
		{
			Hue.receive_synth_voice(data)
		}
	})
}

Hue.setup_image = function(mode, odata={})
{	
	let data = {}

	data.type = odata.image_type
	data.source = odata.image_source
	data.setter = odata.image_setter
	data.size = odata.image_size
	data.date = odata.image_date
	data.query = odata.image_query

	data.nice_date = data.date ? Hue.nice_date(data.date) : Hue.nice_date()

	if(!data.setter)
	{
		data.setter = "The system"
	}

	if(!data.source)
	{
		data.source = Hue.default_image_source
	}

	data.info = `Setter: ${data.setter} | ${data.nice_date}`

	if(data.type === "upload")
	{
		data.info += ` | Size: ${Hue.get_size_string(data.size)}`
	}
	
	if(data.query)
	{
		data.info += ` | Search Term: "${data.query}"`
	}

	data.message = `${data.setter} changed the image`

	data.onclick = function()
	{
		Hue.show_modal_image(data.source, data.info, data.nice_date)
	}

	if(data.message)
	{
		Hue.announce_image(data)
	}

	if(mode === "change" || mode === "show")
	{
		Hue.push_images_changed(data)
		Hue.set_modal_image_number()
	}

	if(mode === "change")
	{
		Hue.change({type:"image"})
	}
}

Hue.announce_image = function(data)
{
	Hue.public_feedback(data.message,
	{
		save: true,
		brk: "<i class='icon2c fa fa-camera'></i>",
		type: "image_change",
		date: data.date,
		username: data.setter,
		title: data.info,
		onclick: data.onclick
	})
}

Hue.push_images_changed = function(data)
{
	if(!data.setter)
	{
		data.info = "Default Image"
	}

	for(let i=0; i<Hue.images_changed.length; i++)
	{
		let img = Hue.images_changed[i]

		if(img.source === data.source)
		{
			Hue.images_changed.splice(i, 1)
			$("#image_history_container").children().eq(i).remove()
			break
		}
	}

	Hue.images_changed.push(data)

	let el = $("<div class='modal_item media_history_item'><div class='media_history_item_inner pointer inline'></div></div>")
	let inner = el.find('.media_history_item_inner').eq(0)
	
	inner.text(data.message).urlize()
	inner.attr("title", data.info)

	inner.click(data.onclick)
	
	$("#image_history_container").prepend(el)

	if(Hue.images_changed.length > Hue.media_changed_crop_limit)
	{
		Hue.images_changed = Hue.images_changed.slice(Hue.images_changed.length - Hue.media_changed_crop_limit)
		$("#image_history_container").children().last().remove()
	}

	if(Hue.image_history_filtered)
	{
		Hue.do_modal_filter()
	}
}

Hue.current_image = function()
{
	if(Hue.images_changed.length > 0)
	{
		return Hue.images_changed[Hue.images_changed.length - 1]
	}

	else
	{
		return {}
	}
}

Hue.setup_tv = function(mode, odata={})
{
	let data

	if(mode === "restart")
	{
		data = Hue.current_tv()
		data.message = `${data.setter} restarted the tv`
	}

	else
	{
		data = {}

		data.type = odata.tv_type
		data.source = odata.tv_source
		data.title = odata.tv_title
		data.setter = odata.tv_setter
		data.date = odata.tv_date
		data.query = odata.tv_query

		data.nice_date = data.date ? Hue.nice_date(data.date) : Hue.nice_date()

		if(!data.setter)
		{
			data.setter = "The system"
		}

		if(!data.source)
		{
			data.source = Hue.default_tv_source
			data.type = Hue.default_tv_type
			data.title = Hue.default_tv_title
		}

		if(!data.title)
		{
			data.title = data.source
		}

		data.message = `${data.setter} changed the tv to: ${Hue.conditional_quotes(data.title)}`

		if(data.type === "youtube")
		{
			let time = Hue.utilz.get_youtube_time(data.source)

			if(time !== 0)
			{
				data.message += ` (At ${Hue.utilz.humanize_seconds(time)})`
			}
		}

		data.info = `Setter: ${data.setter} | ${data.nice_date}`
		
		if(data.query)
		{
			data.info += ` | Search Term: "${data.query}"`
		}

		data.onclick = function()
		{
			Hue.open_url_menu(data.source)
		}
	}

	if(data.message)
	{
		Hue.announce_tv(data)
	}

	if(mode === "change" || mode === "show")
	{
		Hue.push_tv_changed(data)
	}

	if(mode === "change")
	{
		Hue.change({type:"tv", force:true})
	}

	else if(mode === "restart")
	{
		Hue.change({type:"tv", force:true, play:true})
	}
}

Hue.announce_tv = function(data)
{
	Hue.public_feedback(data.message,
	{
		save: true,
		brk: "<i class='icon2c fa fa-television'></i>",
		title: data.info,
		onclick: data.onclick,
		date: data.date,
		type: data.type,
		username: data.setter
	})
}

Hue.current_tv = function()
{
	if(Hue.tv_changed.length > 0)
	{
		return Hue.tv_changed[Hue.tv_changed.length - 1]
	}

	else
	{
		return {}
	}
}

Hue.push_tv_changed = function(data)
{
	for(let i=0; i<Hue.tv_changed.length; i++)
	{
		let tv = Hue.tv_changed[i]

		if(tv.source === data.source)
		{
			Hue.tv_changed.splice(i, 1)
			$("#tv_history_container").children().eq(i).remove()
			break
		}
	}

	Hue.tv_changed.push(data)

	let el = $("<div class='modal_item media_history_item'><div class='media_history_item_inner pointer inline'></div></div>")
	let inner = el.find('.media_history_item_inner').eq(0)
	
	inner.text(data.message).urlize()
	inner.attr("title", data.info)

	inner.click(data.onclick)
	
	$("#tv_history_container").prepend(el)

	if(Hue.tv_changed.length > Hue.media_changed_crop_limit)
	{
		Hue.tv_changed = Hue.tv_changed.slice(Hue.tv_changed.length - Hue.media_changed_crop_limit)
		$("#tv_history_container").children().last().remove()
	}	

	if(Hue.tv_history_filtered)
	{
		Hue.do_modal_filter()
	}
}

Hue.setup_radio = function(mode, odata={})
{
	let data

	if(mode === "restart")
	{
		data = Hue.current_radio()
		data.message = `${data.setter} restarted the radio`
	}

	else
	{
		data = {}

		data.type = odata.radio_type
		data.source = odata.radio_source
		data.title = odata.radio_title
		data.setter = odata.radio_setter
		data.date = odata.radio_date
		data.query = odata.radio_query

		data.nice_date = data.date ? Hue.nice_date(data.date) : Hue.nice_date()

		if(!data.setter)
		{
			data.setter = "The system"
		}

		if(!data.source)
		{
			data.source = Hue.default_radio_source
			data.type = Hue.default_radio_type
			data.title = Hue.default_radio_title
		}

		if(!data.title)
		{
			data.title = data.source
		}

		data.message = `${data.setter} changed the radio to: ${Hue.conditional_quotes(data.title)}`

		if(data.type === "youtube")
		{
			let time = Hue.utilz.get_youtube_time(data.source)

			if(time !== 0)
			{
				data.message += ` (At ${Hue.utilz.humanize_seconds(time)})`
			}
		}

		data.info = `Setter: ${data.setter} | ${data.nice_date}`
		
		if(data.query)
		{
			data.info += ` | Search Term: "${data.query}"`
		}

		data.onclick = function()
		{
			Hue.open_url_menu(data.source)
		}
	}

	if(data.message)
	{
		Hue.announce_radio(data)
	}

	if(mode === "change" || mode === "show")
	{
		Hue.push_radio_changed(data)
	}

	if(mode === "change")
	{
		Hue.change({type:"radio", force:true})
	}

	else if(mode === "restart")
	{
		Hue.change({type:"radio", force:true, play:true})
	}
}

Hue.announce_radio = function(data)
{
	Hue.public_feedback(data.message,
	{
		save: true,
		brk: "<i class='icon2c fa fa-volume-up'></i>",
		title: data.info,
		onclick: data.onclick,
		date: data.date,
		type: data.type,
		username: data.setter
	})
}

Hue.push_radio_changed = function(data)
{
	for(let i=0; i<Hue.radio_changed.length; i++)
	{
		let radio = Hue.radio_changed[i]

		if(radio.source === data.source)
		{
			Hue.radio_changed.splice(i, 1)
			$("#tv_history_container").children().eq(i).remove()
			break
		}
	}

	Hue.radio_changed.push(data)

	let el = $("<div class='modal_item media_history_item'><div class='media_history_item_inner pointer inline'></div></div>")
	let inner = el.find('.media_history_item_inner').eq(0)
	
	inner.text(data.message).urlize()
	inner.attr("title", data.info)

	inner.click(data.onclick)
	
	$("#radio_history_container").prepend(el)

	if(Hue.radio_changed.length > Hue.media_changed_crop_limit)
	{
		Hue.radio_changed = Hue.radio_changed.slice(Hue.radio_changed.length - Hue.media_changed_crop_limit)
		$("#radio_history_container").children().last().remove()
	}

	if(Hue.radio_history_filtered)
	{
		Hue.do_modal_filter()
	}
}

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

Hue.load_radio = function(src, type)
{
	let radio_metadata = ""
	
	Hue.radio_get_metadata = false
	
	clearTimeout(Hue.radio_metadata_fail_timeout)

	if(type === "radio")
	{
		if(src.slice(-1) === '/')
		{
			radio_metadata = `${src.slice(0, -1).split('/').slice(0, -1).join('/')}/status-json.xsl`
		}

		else
		{
			radio_metadata = `${src.split('/').slice(0, -1).join('/')}/status-json.xsl`
		}

		Hue.radio_get_metadata = true

		$('#audio').attr('src', src)

		if(Hue.radio_started)
		{
			$('#audio')[0].play()
		}

		if(Hue.youtube_player !== undefined)
		{
			Hue.youtube_player.pauseVideo()
		}

		if(Hue.soundcloud_player !== undefined)
		{
			Hue.soundcloud_player.pause()
		}
	}

	else if(type === "youtube")
	{
		if(Hue.youtube_player !== undefined)
		{
			let id = Hue.utilz.get_youtube_id(src)

			if(id[0] === "video")
			{
				if(Hue.radio_started)
				{
					Hue.youtube_player.loadVideoById({videoId:id[1], startSeconds:Hue.utilz.get_youtube_time(src)})
				}

				else
				{
					Hue.youtube_player.cueVideoById({videoId:id[1], startSeconds:Hue.utilz.get_youtube_time(src)})
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

		if(!Hue.room_state.radio_locked || !Hue.last_radio_source)
		{
			Hue.push_played(false, {s1:Hue.current_radio().title, s2:src})
		}

		if(Hue.soundcloud_player !== undefined)
		{
			Hue.soundcloud_player.pause()
		}

		$('#audio').attr('src', '')
	}

	else if(type === "soundcloud")
	{
		if(Hue.soundcloud_player !== undefined)
		{
			Hue.soundcloud_player.load(src,
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

		if(!Hue.room_state.radio_locked || !Hue.last_radio_source)
		{
			Hue.push_played(false, {s1:Hue.current_radio().title, s2:src})
		}

		if(Hue.youtube_player !== undefined)
		{
			Hue.youtube_player.pauseVideo()
		}

		$('#audio').attr('src', '')
	}

	Hue.loaded_radio_source = src
	Hue.loaded_radio_type = type
	Hue.loaded_radio_metadata = radio_metadata

	if(Hue.loaded_radio_type === "radio")
	{
		Hue.get_radio_metadata()
	}
}

Hue.stop_videos = function(clear_iframe=true)
{
	if(Hue.youtube_video_player !== undefined)
	{
		Hue.youtube_video_player.pauseVideo()
	}

	if(Hue.twitch_video_player !== undefined)
	{
		Hue.twitch_video_player.pause()
	}

	if(Hue.soundcloud_video_player !== undefined)
	{
		Hue.soundcloud_video_player.pause()
	}

	$("#media_video")[0].pause()

	if(clear_iframe)
	{
		$("#media_iframe_video").attr("src", "")
		$("#media_iframe_poster").css("display", "block")
	}
}

Hue.play_video = function()
{
	if(!Hue.tv_visible)
	{
		return false
	}

	let played = true

	if(Hue.current_tv().type === "youtube")
	{
		if(Hue.youtube_video_player !== undefined)
		{
			Hue.youtube_video_player.playVideo()
		}

		else
		{
			Hue.play_video_on_load = true
		}
	}

	else if(Hue.current_tv().type === "twitch")
	{
		if(Hue.twitch_video_player !== undefined)
		{
			Hue.twitch_video_player.play()
		}

		else
		{
			Hue.play_video_on_load = true
		}
	}

	else if(Hue.current_tv().type === "soundcloud")
	{
		if(Hue.soundcloud_video_player !== undefined)
		{
			Hue.soundcloud_video_player.play()
		}

		else
		{
			Hue.play_video_on_load = true
		}
	}

	else if(Hue.current_tv().type === "url")
	{
		$("#media_video")[0].play()
	}

	else if(Hue.current_tv().type === "iframe")
	{
		$("#media_iframe_video").attr("src", Hue.current_tv().source)
		$("#media_iframe_poster").css("display", "none")
	}

	else
	{
		played = false
	}

	if(played)
	{
		if(Hue.get_setting("stop_radio_on_tv_play"))
		{
			Hue.stop_radio()
		}
	}
}

Hue.hide_videos = function(show)
{
	$("#media_tv .media_container").each(function()
	{
		if($(this).attr("id") === show)
		{
			$(this).css("display", "flex")
		}

		else
		{
			$(this).css("display", "none")
		}
	})
}

Hue.show_youtube_video = function(src, play=true)
{
	Hue.before_show_video()
	
	Hue.hide_videos("media_youtube_video_container")

	let id = Hue.utilz.get_youtube_id(src)

	Hue.youtube_video_play_on_queue = play

	if(id[0] === "video")
	{
		Hue.youtube_video_player.cueVideoById({videoId:id[1], startSeconds:Hue.utilz.get_youtube_time(src)})
	}

	else if(id[0] === "list")
	{
		Hue.youtube_video_player.cuePlaylist({list:id[1][0], index:id[1][1]})
	}

	else
	{
		return false
	}

	Hue.after_show_video(play)
}

Hue.show_twitch_video = function(src, play=true)
{
	Hue.before_show_video()

	Hue.hide_videos("media_twitch_video_container")

	let id = Hue.utilz.get_twitch_id(src)

	if(id[0] === "video")
	{
		Hue.twitch_video_player.setVideoSource(src)
	}

	else if(id[0] === "channel")
	{
		Hue.twitch_video_player.setChannel(id[1])
	}

	else
	{
		return false
	}

	if(play)
	{
		Hue.twitch_video_player.play()
	}

	else
	{
		Hue.twitch_video_player.pause()
	}

	Hue.after_show_video(play)
}

Hue.show_soundcloud_video = function(src, play=true)
{
	Hue.before_show_video()

	Hue.hide_videos("media_soundcloud_video_container")

	Hue.soundcloud_video_player.load(src,
	{
		auto_play: false,
		single_active: false,
		show_artwork: true,
		callback: function()
		{
			if(play)
			{
				Hue.soundcloud_video_player.play()
			}
		}
	})

	Hue.after_show_video(play)
}

Hue.show_video = function(src, play=true)
{
	Hue.before_show_video()

	Hue.hide_videos("media_video_container")

	let split = src.split('.')

	if(split[split.length - 1] === "m3u8")
	{
		Hue.start_hls()
		Hue.hls.loadSource(src)
		Hue.hls.attachMedia($("#media_video")[0])
	}

	else
	{
		$("#media_video").prop("src", src)
	}

	if(play)
	{
		$("#media_video")[0].play()
	}

	Hue.after_show_video(play)
}

Hue.show_iframe_video = function(src, play=true)
{
	Hue.before_show_video()

	Hue.hide_videos("media_iframe_video_container")

	if(play)
	{
		$("#media_iframe_video").attr("src", src)
		$("#media_iframe_poster").css("display", "none")
	}

	else
	{
		$("#media_iframe_poster").css("display", "block")
	}

	Hue.after_show_video(play)
}

Hue.before_show_video = function()
{
	Hue.stop_videos()
	Hue.hls = undefined
}

Hue.after_show_video = function(play)
{
	Hue.fix_visible_video_frame()
	Hue.focus_input()

	if(play)
	{
		if(Hue.get_setting("stop_radio_on_tv_play"))
		{
			Hue.stop_radio()
		}
	}
}

Hue.setup_theme_and_background = function(data)
{
	Hue.set_background_image(data)

	Hue.theme_mode = data.theme_mode
	Hue.theme = data.theme
	Hue.background_mode = data.background_mode
	Hue.background_effect = data.background_effect
	Hue.background_tile_dimensions = data.background_tile_dimensions
	Hue.text_color_mode = data.text_color_mode
	Hue.text_color = data.text_color
}

Hue.set_background_image = function(data)
{
	if(data.background_image !== "")
	{
		Hue.background_image = data.background_image
	}

	else
	{
		Hue.background_image = Hue.default_background_image_url
	}

	Hue.background_image_setter = data.background_image_setter
	Hue.background_image_date = data.background_image_date
	Hue.apply_background()
	Hue.config_admin_background_image()
}

Hue.apply_background = function()
{
	let bg_image

	if(Hue.background_mode === "mirror" || Hue.background_mode === "mirror_tiled")
	{
		bg_image = Hue.current_image().source
	}

	else
	{
		bg_image = Hue.background_image
	}

	if(Hue.background_image_enabled())
	{
		$('.background_image').css('background-image', `url('${bg_image}')`)
	}

	else
	{
		$('.background_image').css('background-image', "none")
	}

	if(Hue.background_mode === "normal" || Hue.background_mode === "mirror")
	{
		$('.background_image').each(function()
		{
			$(this).removeClass("background_image_tiled")
		})
	}

	else if(Hue.background_mode === "tiled" || Hue.background_mode === "mirror_tiled")
	{
		$('.background_image').each(function()
		{
			$(this).addClass("background_image_tiled")
		})
	}

	if(Hue.background_effect === "blur" && Hue.background_mode !== "solid")
	{
		$('.background_image').each(function()
		{
			$(this).addClass("background_image_blur")
		})
	}

	else
	{
		$('.background_image').each(function()
		{
			$(this).removeClass("background_image_blur")
		})
	}

	let css = `
	<style class='appended_background_style'>

	.background_image_tiled
	{
		background-size: ${Hue.background_tile_dimensions} !important;
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

Hue.set_theme_mode = function(mode)
{
	Hue.theme_mode = mode
	Hue.config_admin_theme_mode()
}

Hue.set_theme = function(color)
{
	Hue.theme = color
	Hue.apply_theme()
	Hue.config_admin_theme()
}

Hue.apply_theme = function()
{
	let theme

	if(Hue.theme_mode === "automatic" && Hue.dominant_theme)
	{
		theme = Hue.dominant_theme
	}

	else
	{
		theme = Hue.theme
	}

	let background_color = theme
	let background_color_2 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.color_contrast_amount_1)
	
	let font_color

	if(Hue.text_color_mode === "custom")
	{
		font_color = Hue.text_color
	}

	else
	{
		font_color = Hue.colorlib.get_lighter_or_darker(background_color, Hue.color_contrast_amount_2)
	}

	let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, Hue.opacity_amount_1)
	let background_color_a_2 = Hue.colorlib.rgb_to_rgba(background_color_2, Hue.opacity_amount_3)

	$('.bg0').css('background-color', background_color)
	$('.bg1').css('background-color', background_color_a)
	$('.bg1').css('color', font_color)
	$('.bg2').css('background-color', background_color_2)
	$('.bg2').css('color', font_color)

	let color_3 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.color_contrast_amount_3)
	let color_4 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.color_contrast_amount_4)
	let color_4_a = Hue.colorlib.rgb_to_rgba(color_4, Hue.opacity_amount_3)
	let overlay_color = Hue.colorlib.rgb_to_rgba(color_3, Hue.opacity_amount_2)
	let slight_background = Hue.colorlib.get_lighter_or_darker(background_color, Hue.color_contrast_amount_5)
	let cfsize = Hue.get_setting("chat_font_size")

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

	let profile_image_size = `${45 * cfsize_factor}px`

	let background_color_topbox = background_color_2

	if(Hue.get_setting("activity_bar"))
	{
		background_color_topbox = color_4
	}

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

	.nicescroll-cursors
	{
		background-color: ${font_color} !important;
	}

	.modal_select
	{
		color: ${background_color} !important;
		background-color: ${font_color} !important;
		border: 1px solid ${background_color_2} !important;
	}

	#reactions_box
	{
		background-color: ${background_color_2} !important;
		color: ${font_color} !important;
	}

	.highlighted
	{
		background-color: ${background_color_2} !important;
		color: ${font_color} !important;
	}

	.highlighted2
	{
		background-color: ${background_color_2} !important;
		color: ${font_color} !important;
	}

	.nstSlider
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

	.topbox_container
	{
		color: ${font_color} !important;
	}

	.topbox
	{
		background-color: ${background_color_topbox} !important;
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

	.normal_layout .brk
	{
		min-width: ${profile_image_size} !important;
		max-width: ${profile_image_size} !important;
	}

	.jump_button, .chat_menu_button
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

	.chat_menu_button_main:hover
	{
		background-color: ${slight_background} !important;
	}

	#activity_bar_container
	{
		background-color: ${color_4} !important;
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

	</style>
	`

	$(".appended_theme_style").each(function()
	{
		$(this).remove()
	})

	$("head").append(css)
}

Hue.userjoin = function(data)
{
	Hue.clear_from_users_to_disconnect(data)

	let added = Hue.addto_userlist(data.user_id, data.username, data.role, data.profile_image)

	if(added)
	{
		if(Hue.get_setting("show_joins") && Hue.check_permission(data.role, "chat"))
		{
			Hue.public_feedback(`${data.username} has joined`,
			{
				brk: "<i class='icon2c fa fa-user-plus'></i>",
				save: true,
				username: data.username,
				open_profile: true
			})

			if(data.username !== Hue.username)
			{
				Hue.alert_title()
				Hue.sound_notify("join")
			}
		}
	}
}

Hue.update_usercount = function(usercount)
{
	let s = `${Hue.singular_or_plural(usercount, "Users")} Online`

	$('#usercount').html(s)

	Hue.msg_userlist.set_title(s)
}

Hue.addto_userlist = function(id, uname, rol, pi)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].username === uname)
		{
			Hue.userlist[i].user_id = id
			Hue.userlist[i].username = uname
			Hue.userlist[i].role = rol
			Hue.userlist[i].profile_image = pi

			Hue.update_userlist()

			return false
		}
	}

	Hue.userlist.push({user_id: id, username:uname, role:rol, profile_image:pi})

	Hue.update_userlist()

	return true
}

Hue.removefrom_userlist = function(uname)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].username === uname)
		{
			Hue.userlist.splice(i, 1)
			Hue.update_userlist()
			break
		}
	}
}

Hue.replace_uname_in_userlist = function(oldu, newu)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].username === oldu)
		{
			Hue.userlist[i].username = newu
			break
		}
	}

	Hue.update_userlist()
}

Hue.replace_role_in_userlist = function(uname, rol)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].username === uname)
		{
			Hue.userlist[i].role = rol
			break
		}
	}

	Hue.update_userlist()
}

Hue.get_role = function(uname)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].username === uname)
		{
			return Hue.userlist[i].role
		}
	}
}

Hue.reset_voices_userlist = function()
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].role.startsWith('voice') && Hue.userlist[i].role !== 'voice1')
		{
			Hue.userlist[i].role = 'voice1'
		}
	}

	Hue.update_userlist()
}

Hue.remove_ops_userlist = function()
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].role === 'op')
		{
			Hue.userlist[i].role = 'voice1'
		}
	}

	Hue.update_userlist()
}

Hue.role_tag = function(p)
{
	let s

	if(p === 'admin')
	{
		s = '[A]'
	}

	else if(p === 'op')
	{
		s = '[O]'
	}

	else if(p === 'voice1')
	{
		s = '[V1]'
	}

	else if(p === 'voice2')
	{
		s = '[V2]'
	}

	else if(p === 'voice3')
	{
		s = '[V3]'
	}

	else if(p === 'voice4')
	{
		s = '[V4]'
	}

	else
	{
		s = ''
	}

	return s
}

Hue.get_pretty_role_name = function(p)
{
	let s

	if(p === 'admin')
	{
		s = 'Admin'
	}

	else if(p === 'op')
	{
		s = 'Operator'
	}

	else if(p === 'voice1')
	{
		s = 'Voice 1'
	}

	else if(p === 'voice2')
	{
		s = 'Voice 2'
	}

	else if(p === 'voice3')
	{
		s = 'Voice 3'
	}

	else if(p === 'voice4')
	{
		s = 'Voice 4'
	}

	else
	{
		s = ''
	}

	return s
}

Hue.get_user_by_username = function(uname)
{
	for(let user of Hue.userlist)
	{
		if(user.username === uname)
		{
			return user
		}
	}

	return false
}

Hue.get_user_by_id = function(id)
{
	for(let user of Hue.userlist)
	{
		if(user.user_id === id)
		{
			return user
		}
	}

	return false
}

Hue.start_userlist_click_events = function()
{
	$("#userlist").on("click", ".ui_item_uname", function()
	{
		let uname = $(this).text()
		Hue.show_profile(uname)
	})
}

Hue.update_userlist = function()
{
	let s = $()

	s = s.add()

	Hue.userlist.sort(Hue.compare_userlist)

	Hue.usernames = []

	for(let i=0; i<Hue.userlist.length; i++)
	{
		let item = Hue.userlist[i]

		Hue.usernames.push(item.username)

		let h = $("<div class='modal_item userlist_item'><span class='ui_item_role'></span><span class='ui_item_uname action'></span></div>")

		let p = Hue.role_tag(item.role)

		let pel = h.find('.ui_item_role').eq(0)

		pel.text(p)

		if(p === "")
		{
			pel.css("padding-right", 0)
		}

		h.find('.ui_item_uname').eq(0).text(item.username)

		s = s.add(h)
	}

	Hue.update_usercount(Hue.userlist.length)

	$('#userlist').html(s)

	if(Hue.userlist_filtered)
	{
		Hue.do_modal_filter()
	}

	Hue.update_modal_scrollbar("userlist")
}

Hue.compare_userlist = function(a, b)
{
	if(a.role === '')
	{
		a.role = 'voice1'
	}

	if(b.role === '')
	{
		b.role = 'voice1'
	}

	if(a.role.startsWith('voice') && b.role.startsWith('voice'))
	{
		if(a.role < b.role)
		{
			return 1
		}

		else if(a.role > b.role)
		{
			return -1
		}

		if(a.username > b.username)
		{
			return -1
		}

		else if(a.username < b.username)
		{
			return 1
		}

		else
		{
			return 0
		}
	}

	else
	{
		if(a.role > b.role)
		{
			return 1
		}

		else if(a.role < b.role)
		{
			return -1
		}

		if(a.username < b.username)
		{
			return -1
		}

		else if(a.username > b.username)
		{
			return 1
		}

		else
		{
			return 0
		}
	}
}

Hue.start_username_context_menu = function()
{
	$.contextMenu(
	{
		selector: ".ui_item_uname, .chat_uname, #show_profile_uname, .generic_uname, .admin_list_username",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		items:
		{
			cmvoice1:
			{
				name: "Voice 1", callback: function(key, opt)
				{
					let arg = $(this).text()
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
					let arg = $(this).text()
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
					let arg = $(this).text()
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
					let arg = $(this).text()
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
							let arg = $(this).text()
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
							let arg = $(this).text()
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
						return true
					}
				},
				items:
				{
					kicksure:
					{
						name: "I'm Sure", callback: function(key, opt)
						{
							let arg = $(this).text()
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
							let arg = $(this).text()
							Hue.ban(arg)
						}
					}
				}
			}
		}
	})
}

Hue.start_played_context_menu = function()
{
	$.contextMenu(
	{
		selector: ".played_item_inner, #header_now_playing_controls",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
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

Hue.start_volume_context_menu = function()
{
	$.contextMenu(
	{
		selector: "#header_radio_volume_controls",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		className: 'volume_context',
		items: Hue.generate_volume_context_items()
	})
}

Hue.start_toggle_radio_context_menu = function()
{
	$.contextMenu(
	{
		selector: "#toggle_radio_state",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
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
					return Hue.radio_started && Hue.stop_radio_delay !== 1
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
					return Hue.radio_started && Hue.stop_radio_delay === 1
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
					return Hue.radio_started && Hue.stop_radio_delay !== 5
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
					return Hue.radio_started && Hue.stop_radio_delay === 5
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
					return Hue.radio_started && Hue.stop_radio_delay !== 10
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
					return Hue.radio_started && Hue.stop_radio_delay === 10
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
					return Hue.radio_started && Hue.stop_radio_delay !== 30
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
					return Hue.radio_started && Hue.stop_radio_delay === 30
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
					return Hue.radio_started && Hue.stop_radio_delay !== 60
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
					return Hue.radio_started && Hue.stop_radio_delay === 60
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
		}
	})
}

Hue.start_main_menu_context_menu = function()
{
	$.contextMenu(
	{
		selector: "#main_menu_icon",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
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

	let obj = Object.assign(items,
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

Hue.start_tv_maxer_context_menu = function()
{
	$.contextMenu(
	{
		selector: "#media_tv_maxer, #media_image_maxer",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		className: "maxer_context",
		items: Hue.generate_tv_maxer_context_items()
	})
}

Hue.generate_chat_maxer_context_items = function()
{
	let items = {}

	for(let i=9; i>0; i--)
	{
		let n = i * 10

		items[`per${n}`] =
		{
			name: `Chat ${n}%`, callback: function(key, opt)
			{
				Hue.do_chat_size_change(n)
			}
		}
	}

	let obj = Object.assign(
	{
		normal:
		{
			name: "Normal Font", callback: function(key, opt)
			{
				Hue.toggle_chat_font_size("normal")
			}
		},
		big:
		{
			name: "Big Font", callback: function(key, opt)
			{
				Hue.toggle_chat_font_size("big")
			}
		},
		very_big:
		{
			name: "Very Big Font", callback: function(key, opt)
			{
				Hue.toggle_chat_font_size("very_big")
			}
		},
	}, items,
	{
		def:
		{
			name: "Default", callback: function(key, opt)
			{
				Hue.set_default_media_size()
			}
		}
	})

	return obj
}

Hue.start_chat_maxer_context_menu = function()
{
	$.contextMenu(
	{
		selector: "#chat_maxer",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		className: "maxer_context",
		items: Hue.generate_chat_maxer_context_items()
	})
}

Hue.singular_or_plural = function(n, s)
{
	let ss

	if(n === 1)
	{
		ss = `${n} ${s.substring(0, s.length - 1)}`
	}

	else
	{
		ss = `${n} ${s}`
	}

	return ss
}

Hue.request_roomlist = function(filter="", type="public_roomlist")
{
	if(Hue.requesting_roomlist)
	{
		return false
	}

	Hue.requesting_roomlist = true

	Hue[`${type}_filter_string`] = filter

	Hue.socket_emit("roomlist", {type:type})

	setTimeout(function()
	{
		Hue.requesting_roomlist = false
	}, 1000)
}

Hue.start_roomlist_click_events = function()
{
	$("#public_roomlist_container").on("click", ".roomlist_item_inner", function()
	{
		Hue.show_open_room($(this).data("room_id"))
	})

	$("#visited_roomlist_container").on("click", ".roomlist_item_inner", function()
	{
		Hue.show_open_room($(this).data("room_id"))
	})
}

Hue.update_roomlist = function(type, roomlist)
{
	$(`#${type}_filter`).val(Hue[`${type}_filter_string`])

	let s = $()

	s = s.add()

	for(let i=0; i<roomlist.length; i++)
	{
		let c =
		`<div class='roomlist_item_inner pointer inline action' data-room_id='${roomlist[i].id}'>
			<div class='roomlist_name'></div><div class='roomlist_topic'></div>
			<div class='roomlist_here'></div><div class='roomlist_count'></div>
		</div>`

		let h = $(`<div class='modal_item roomlist_item'>${c}</div>`)

		h.find('.roomlist_name').eq(0).text(roomlist[i].name)

		h.find('.roomlist_count').eq(0).text(Hue.singular_or_plural(roomlist[i].usercount, "users"))

		if(roomlist[i].id === Hue.room_id)
		{
			h.find('.roomlist_here').eq(0).text("You are here").css("display", "block")
		}

		let topic

		if(roomlist[i].topic.length > 0)
		{
			topic = roomlist[i].topic
		}

		else
		{
			topic = 'No topic set'
		}

		h.find('.roomlist_topic').eq(0).text(topic)

		s = s.add(h)
	}

	$(`#${type}_container`).html(s)

	if(Hue[`${type}_filter_string`] !== "")
	{
		Hue.do_modal_filter(type)
	}

	Hue.update_modal_scrollbar(type)
}

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
		if($(this).attr("src") !== Hue.background_image_loading_url)
		{
			$(this).attr("src", Hue.background_image_loading_url)
		}
	})
}

Hue.show_main_menu = function()
{
	Hue.msg_main_menu.show()
}

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

	Hue.update_modal_scrollbar("main_menu")
}

Hue.config_admin_background_tile_dimensions = function()
{
	if(!Hue.is_admin_or_op())
	{
		return false
	}

	$('#admin_background_tile_dimensions').val(Hue.background_tile_dimensions)
}

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
			$("#admin_background_image").attr("src", Hue.default_background_image_url)
		}
	}

	if(Hue.background_image_setter)
	{
		let s = `Setter: ${Hue.background_image_setter}`

		if(Hue.background_image_date)
		{
			s += ` | ${Hue.nice_date(Hue.background_image_date)}`
		}

		$("#admin_background_image").attr("title", s)
	}
}

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

	Hue.update_modal_scrollbar("main_menu")
}

Hue.config_admin_text_color = function()
{
	if(!Hue.is_admin_or_op())
	{
		return false
	}

	$("#admin_text_color").spectrum("set", Hue.text_color)
}

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

	Hue.update_modal_scrollbar("main_menu")
}

Hue.config_admin_theme = function()
{
	if(!Hue.is_admin_or_op())
	{
		return false
	}

	$("#admin_theme").spectrum("set", Hue.theme)
}

Hue.config_admin_room_name = function()
{
	if(!Hue.is_admin_or_op())
	{
		return false
	}

	$("#admin_room_name").val(Hue.room_name)
}

Hue.config_admin_topic = function()
{
	if(!Hue.is_admin_or_op())
	{
		return false
	}

	$("#admin_topic").val(Hue.topic)
}

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

	Hue.update_modal_scrollbar("main_menu")
}

Hue.show_create_room = function()
{
	Hue.msg_info2.show(["Create Room", Hue.template_create_room()], function()
	{
		$("#create_room_name").focus()

		$('#create_room_done').on("click", function()
		{
			Hue.create_room_submit()
		})

		Hue.crm = true
	})
}

Hue.create_room_submit = function()
{
	let data = {}

	data.name = Hue.utilz.clean_string2($('#create_room_name').val().substring(0, Hue.max_room_name_length))

	if(data.name === "")
	{
		return false
	}

	data.public = JSON.parse($('#create_room_public option:selected').val())

	Hue.create_room(data)
}

Hue.show_open_room = function(id)
{
	if(id === Hue.main_room_id)
	{
		id = "/"
	}

	Hue.msg_info2.show(["Open Room", Hue.template_open_room({id:id})], function()
	{
		Hue.orb = true
	})
}

Hue.show_userlist = function(filter=false)
{
	Hue.msg_userlist.show(function()
	{
		if(filter)
		{
			$("#userlist_filter").val(filter)
			Hue.do_modal_filter()
		}
	})
}

Hue.show_public_roomlist = function()
{
	Hue.msg_public_roomlist.show()
}

Hue.show_visited_roomlist = function()
{
	Hue.msg_visited_roomlist.show()
}

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

Hue.start_dropzone = function()
{
	Hue.dropzone = new Dropzone("body",
	{
		url: "/",
		maxFiles: 1,
		maxFilesize: Hue.max_image_size / 1024,
		autoProcessQueue: false,
		clickable: '#image_file_picker',
		acceptedFiles: "image/jpeg,image/png,image/gif"
	})

	Hue.dropzone.on("addedfile", function(file)
	{
		Hue.focus_input()

		if(!Hue.can_images)
		{
			Hue.feedback("You don't have permission to change images")
			Hue.dropzone.files = []
			return false
		}

		if(Hue.dropzone.files.length > 1)
		{
			Hue.dropzone.files = []
			return false
		}

		let size = file.size / 1024

		if(size > Hue.max_image_size)
		{
			Hue.dropzone.files = []
			Hue.feedback("File is too big")
			return false
		}

		let name = file.name

		let ext = name.split('.').pop(-1).toLowerCase()

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif')
		{
			Hue.dropzone.files = []
			return false
		}

		Hue.dropzone.files = []

		Hue.upload_file(file, "image_upload")
	})
}

Hue.create_file_reader = function(file)
{
	let reader = new FileReader()

	reader.addEventListener("loadend", function(e)
	{
		Hue.socket_emit('slice_upload',
		{
			action: file.action,
			name: file.name,
			type: file.type,
			size: file.size,
			data: reader.result,
			date: file.date
		})
	})

	return reader
}

Hue.upload_file = function(file, action)
{
	if(action === "background_image_upload")
	{
		for(let d in Hue.files)
		{
			let f = Hue.files[d]

			if(f.action === "background_image_upload")
			{
				Hue.cancel_file_upload(d, false)
			}
		}
	}

	let date = Date.now()

	file.date = date

	file.action = action

	if(file.name !== undefined)
	{
		file.name = Hue.utilz.clean_string5(file.name).replace(/.gifv/g, ".gif")
	}

	else
	{
		file.name = "no_name"
	}

	file.reader = Hue.create_file_reader(file)

	let slice = file.slice(0, Hue.upload_slice_size)

	Hue.files[date] = file

	file.next = Hue.get_file_next(file)

	if(file.next >= 100)
	{
		file.sending_last_slice = true
	}

	else
	{
		file.sending_last_slice = false
	}

	file.percentage = 0

	let message = `Uploading ${Hue.get_file_action_name(file.action)}: 0%`

	let obj =
	{
		brk: "<i class='icon2c fa fa-info-circle'></i>",
		id: `uploading_${date}`,
		title: `Size: ${Hue.get_size_string(file.size / 1024)} | ${Hue.nice_date()}`
	}

	if(!file.sending_last_slice)
	{
		obj.onclick = function()
		{
			Hue.cancel_file_upload(date)
		}
	}

	Hue.feedback(message, obj)

	file.reader.readAsArrayBuffer(slice)
}

Hue.cancel_file_upload = function(date, check=true)
{
	let file = Hue.files[date]

	if(!file)
	{
		return false
	}

	if(file.sending_last_slice)
	{
		return false
	}

	Hue.change_upload_status(file, "Cancelled", true)

	if(check)
	{
		if(file.action === "background_image_upload")
		{
			Hue.config_admin_background_image()
		}
	}

	delete Hue.files[date]

	Hue.socket_emit("cancel_upload", {date:date})
}

Hue.get_file_next = function(file)
{
	let next = Math.floor(((Hue.upload_slice_size * 1) / file.size) * 100)

	if(next > 100)
	{
		next = 100
	}

	return next
}

Hue.change_upload_status = function(file, status, clear=false)
{
	$(`#uploading_${file.date}`)
	.find(".announcement_content")
	.eq(0).text(`Uploading ${Hue.get_file_action_name(file.action)}: ${status}`)

	if(clear)
	{
		$(`#uploading_${file.date}`)
		.find(".announcement_content_container").eq(0)
		.off("click")
		.removeClass("pointer")
		.removeClass("action")
	}
}

Hue.get_file_action_name = function(action)
{
	let s = ""

	if(action === "image_upload")
	{
		s = "image"
	}

	else if(action === "profile_image_upload")
	{
		s = "profile image"
	}

	else if(action === "background_image_upload")
	{
		s = "background image"
	}

	return s
}

Hue.is_textbox = function(element)
{
	let tag_name = element.tagName.toLowerCase()

	if(tag_name === 'textarea') return true
	if(tag_name !== 'input') return false

	let type = element.getAttribute('type')

	if(!type)
	{
		return false
	}

	type = type.toLowerCase(),

	input_types =
	[
		'text',
		'password',
		'number',
		'email',
		'tel',
		'url',
		'search',
		'date',
		'datetime',
		'datetime-local',
		'time',
		'month',
		'week'
	]

	return input_types.includes(type)
}

Hue.copypaste_events = function()
{
	$(document).bind('copy', function(e)
	{
		if(window.getSelection().toString() !== "")
		{
			setTimeout(function()
			{
				if(Hue.is_textbox(document.activeElement))
				{
					se = document.activeElement.selectionEnd
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

Hue.double_tap_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.double_tap_key_pressed = 0
		}, Hue.double_tap_delay)
	}
})()

Hue.double_tap_2_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.double_tap_key_2_pressed = 0
		}, Hue.double_tap_delay)
	}
})()

Hue.double_tap_3_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.double_tap_key_3_pressed = 0
		}, Hue.double_tap_delay)
	}
})()

Hue.reset_double_tap_keys_pressed = function()
{
	Hue.double_tap_key_pressed = 0
	Hue.double_tap_key_2_pressed = 0
	Hue.double_tap_key_3_pressed = 0
}

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

		if(!(Hue.is_textbox(document.activeElement) 
		&& document.activeElement.value.trim()) 
		&& Hue.keys_pressed[e.keyCode] === undefined 
		&& !e.repeat)
		{
			Hue.keys_pressed[e.keyCode] = true

			if(Object.keys(Hue.keys_pressed).length === 1)
			{
				if(e.key === Hue.double_tap_key)
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

				else if(e.key === Hue.double_tap_key_2)
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

				else if(e.key === Hue.double_tap_key_3)
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

				if(e.key === "F1")
				{
					Hue.run_user_function(1)
				}

				else if(e.key === "F2")
				{
					Hue.run_user_function(2)
				}

				else if(e.key === "F3")
				{
					Hue.run_user_function(3)
				}

				else if(e.key === "F4")
				{
					Hue.run_user_function(4)
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
		
		Hue.check_prevent_default(e)

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

			if(Hue.iup)
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

					return
				}
			}

			if(Hue.tup)
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

					return
				}
			}

			if(Hue.rup)
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

					return
				}
			}

			if(Hue.orb)
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

			if(Hue.biu)
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

			if(Hue.crm)
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

			if(Hue.imp)
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

			if(Hue.gtr)
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
					if(e.key === "Enter")
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
						Hue.show_image_history()
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

			if(Hue.minpo)
			{
				if(e.key === "Enter")
				{
					Hue.modal_image_number_go()
				}
			}

			return
		}

		if(e.ctrlKey)
		{
			if(window.getSelection().toString() !== "")
			{
				return
			}
		}

		if(Hue.editing_message)
		{
			Hue.focus_edit_area()

			if(e.key === "Enter")
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
					Hue.clear_synth_voice()
				}

				return false
			}
		}

		Hue.focus_input()

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
			if(Hue.footer_oversized_active() && !e.shiftKey)
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
				Hue.activity_above()
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
			if(Hue.footer_oversized_active() && !e.shiftKey)
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
				Hue.activity_below()
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
				Hue.scroll_up(Hue.big_keyboard_scroll)
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
				Hue.scroll_down(Hue.big_keyboard_scroll)
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

				Hue.hide_reactions()
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

		if(Hue.modal_open && Hue.active_modal)
		{
			if(Hue.active_modal.options.id !== "chat_search")
			{
				Hue.do_modal_filter_timer()
			}
		}

		delete Hue.keys_pressed[e.keyCode]
	})
}

Hue.scroll_up = function(n)
{
	Hue.scroll_chat_to($('#chat_area').scrollTop() - n, false)
}

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

Hue.change_input = function(s, to_end=true, focus=true)
{
	$("#input").val(s)

	Hue.check_input_clone_overflow(s)

	if(to_end)
	{
		Hue.input_to_end()
	}

	if(focus)
	{
		Hue.focus_input()
	}
}

Hue.focus_input = function()
{
	$("#input").focus()
}

Hue.blur_input = function()
{
	$("#input").blur()
}

Hue.input_to_end = function()
{
	$('#input')[0].scrollLeft = $('#input')[0].scrollWidth
}

Hue.add_to_input_history = function(message, change_index=true)
{
	for(let i=0; i<Hue.input_history.length; i++)
	{
		if(Hue.input_history[i][0] === message)
		{
			Hue.input_history.splice(i, 1)
			break
		}
	}

	let item = [message, Hue.nice_date()]

	Hue.input_history.push(item)

	Hue.push_to_input_history_window(item)

	if(Hue.input_history.length > Hue.input_history_crop_limit)
	{
		Hue.input_history = Hue.input_history.slice(Hue.input_history.length - Hue.input_history_crop_limit)
		$(".input_history_item").last().remove()
	}

	if(change_index)
	{
		Hue.reset_input_history_index()
	}

	Hue.save_input_history()
}

Hue.save_input_history = function()
{
	Hue.save_local_storage(Hue.ls_input_history, Hue.input_history)
}

Hue.push_to_input_history_window = function(item, update_scrollbar=true)
{
	let c = $(`<div class='modal_item input_history_item'></div>`)

	c.attr("title", item[1])

	c.text(item[0])

	$("#input_history_container").prepend(c)

	if(update_scrollbar)
	{
		Hue.update_modal_scrollbar("input_history")
	}
}

Hue.get_input_history = function()
{
	Hue.input_history = Hue.get_local_storage(Hue.ls_input_history)

	if(Hue.input_history === null)
	{
		Hue.input_history = []
	}

	Hue.reset_input_history_index()

	for(let item of Hue.input_history)
	{
		Hue.push_to_input_history_window(item, false)
	}

	Hue.update_modal_scrollbar("input_history")
}

Hue.reset_input_history_index = function()
{
	Hue.input_history_index = Hue.input_history.length
}

Hue.input_history_change = function(direction)
{
	if(Hue.input_history.length === 0)
	{
		return false
	}

	if(Hue.input_changed)
	{
		Hue.input_changed = false

		let input_val = $("#input").val().trim()

		if(input_val !== "")
		{
			Hue.add_to_input_history(input_val, false)

			if(direction === "up")
			{
				Hue.input_history_index = Hue.input_history.length - 1
			}

			else
			{
				Hue.input_history_index = Hue.input_history.length
			}
		}
	}

	let v

	if(direction === "up")
	{
		Hue.input_history_index -= 1

		if(Hue.input_history_index === -2)
		{
			Hue.input_history_index = Hue.input_history.length - 1
		}

		else if(Hue.input_history_index === -1)
		{
			Hue.change_input("")
			return
		}

		v = Hue.input_history[Hue.input_history_index][0]
	}

	else
	{
		if(Hue.input_history_index < 0)
		{
			Hue.change_input("")
			return
		}

		Hue.input_history_index += 1

		if(Hue.input_history_index > Hue.input_history.length - 1)
		{
			Hue.change_input("")
			Hue.reset_input_history_index()
			return false
		}

		if(Hue.input_history_index >= Hue.input_history.length)
		{
			Hue.change_input("")
			Hue.reset_input_history_index()
			return
		}

		v = Hue.input_history[Hue.input_history_index][0]
	}

	Hue.change_input(v)
}

Hue.setup_input_history = function()
{
	$("#input_history_container").on("click", ".input_history_item", function()
	{
		if($(this).find('a').length === 0)
		{
			Hue.change_input($(this).text())
			Hue.msg_input_history.close()
		}
	})
}

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

Hue.replace_between = function(str, start, end, what)
{
	return str.substring(0, start) + what + str.substring(end)
}

Hue.oi_equals = function(str, what)
{
	return str === Hue.commands_sorted[what]
}

Hue.oi_startswith = function(str, what)
{
	return str.startsWith(`${Hue.commands_sorted[what]} `)
}

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

Hue.replace_tabbed = function(element, word)
{
	let info = Hue.tab_info[element.id]

	let result = Hue.get_closest_autocomplete(element, word)

	if(result)
	{
		if(element.value[info.tabbed_end] === ' ')
		{
			element.value = Hue.replace_between(element.value, info.tabbed_start, info.tabbed_end, result)
		}

		else
		{
			element.value = Hue.replace_between(element.value, info.tabbed_start, info.tabbed_end, `${result} `)
		}

		let pos = info.tabbed_start + result.length

		element.setSelectionRange(pos + 1, pos + 1)

		info.tabbed_start = pos - result.length
		info.tabbed_end = pos
	}
}

Hue.scroll_events = function()
{
	$('#chat_area')[0].addEventListener("wheel", function(e)
	{
		$("#chat_area").stop()
	})

	$('#chat_area').scroll(function()
	{
		Hue.scroll_timer()
	})
}

Hue.scroll_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.check_scrollers()
		}, Hue.check_scrollers_delay)
	}
})()

Hue.check_scrollers = function()
{
	if($("#chat_area").is(":animated"))
	{
		return false
	}

	let $ch = $("#chat_area")
	let max = $ch.prop('scrollHeight') - $ch.innerHeight()

	let scrolltop = $ch.scrollTop()

	if(max - scrolltop > 10)
	{
		if(scrolltop > 0)
		{
			Hue.show_top_scroller()
		}

		else
		{
			Hue.hide_top_scroller()
		}

		Hue.show_bottom_scroller()
	}

	else
	{
		Hue.hide_top_scroller()
		Hue.hide_bottom_scroller()
	}
}

Hue.resize_events = function()
{
	$(window).resize(function()
	{
		Hue.resize_timer()
	})
}

Hue.resize_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.on_resize()
		}, Hue.resize_delay)
	}
})()

Hue.on_resize = function()
{
	Hue.fix_frames()
	Hue.update_chat_scrollbar()
	Hue.goto_bottom(false, false)
	Hue.check_scrollers()
	Hue.fix_input_clone()
}

Hue.setup_scrollbars = function()
{
	Hue.remove_chat_scrollbar()
	Hue.remove_modal_scrollbars()
	Hue.remove_other_scrollbars()

	if(Hue.get_setting("custom_scrollbars"))
	{
		Hue.start_chat_scrollbar()
		Hue.start_modal_scrollbars()
		Hue.start_other_scrollbars()
	}

	Hue.chat_scroll_bottom(false, false)
}

Hue.start_chat_scrollbar = function()
{
	Hue.chat_scrollbar = new PerfectScrollbar("#chat_area",
	{
		minScrollbarLength: 50,
		suppressScrollX: true,
		scrollingThreshold: 3000,
		wheelSpeed: 0.8,
		handlers: ['drag-thumb', 'wheel', 'touch']
	})
}

Hue.remove_chat_scrollbar = function()
{
	if(Hue.chat_scrollbar !== undefined)
	{
		if(Hue.chat_scrollbar.element !== null)
		{
			Hue.chat_scrollbar.destroy()
		}
	}
}

Hue.update_chat_scrollbar = function()
{
	if(Hue.chat_scrollbar !== undefined)
	{
		if(Hue.chat_scrollbar.element !== null)
		{
			Hue.chat_scrollbar.update()
		}
	}
}

Hue.start_modal_scrollbars = function()
{
	for(let instance of Hue.get_modal_instances())
	{
		if(instance.options.preset !== "popup")
		{
			Hue.start_modal_scrollbar(instance.options.id)
		}
	}
}

Hue.start_other_scrollbars = function()
{
	$(".settings_category").each(function()
	{
		Hue.start_scrollbar(this)
	})

	$(".settings_window_left_content").each(function()
	{
		Hue.start_scrollbar(this)
	})
}

Hue.remove_other_scrollbars = function()
{
	$(".settings_category").each(function()
	{
		$(this).getNiceScroll().remove()
	})

	$(".settings_window_left_content").each(function()
	{
		$(this).getNiceScroll().remove()
	})
}

Hue.remove_modal_scrollbars = function()
{
	for(let instance of Hue.get_modal_instances())
	{
		if(instance.options.preset !== "popup")
		{
			Hue.remove_modal_scrollbar(instance.options.id)
		}
	}
}

Hue.start_modal_scrollbar = function(s)
{
	let ignore = ["global_settings", "room_settings"]
	
	if(ignore.includes(s))
	{
		return false
	}

	Hue.start_scrollbar($(`#Msg-content-container-${s}`))
}

Hue.start_scrollbar = function(element, visible=true)
{
	let cursorwidth

	if(visible)
	{
		cursorwidth = "7px"
	}

	else
	{
		cursorwidth = "0px"
	}

	$(element).niceScroll
	({
		zindex: 9999999,
		autohidemode: false,
		cursorcolor: "#AFAFAF",
		cursorborder: "0px solid white",
		cursorwidth: cursorwidth,
		horizrailenabled: false
	})
}

Hue.remove_modal_scrollbar = function(s)
{
	$(`#Msg-content-container-${s}`).getNiceScroll().remove()
}

Hue.update_all_modal_scrollbars = function()
{
	for(let instance of Hue.msg_main_menu.instances())
	{
		Hue.update_modal_scrollbar(instance.options.id)
	}	
}

Hue.update_modal_scrollbar = function(s)
{
	if(s === "global_settings" || s === "room_settings")
	{
		Hue.update_scrollbar($(`#settings_window_${s} .settings_window_category_container_selected`).eq(0))
		Hue.update_scrollbar($(`#settings_window_left_content_${s}`))
	}

	else
	{
		Hue.update_scrollbar($(`#Msg-content-container-${s}`))
	}
}

Hue.update_scrollbar = function(element)
{
	$(element).getNiceScroll().resize()
}

Hue.nice_date = function(date=Date.now())
{
	return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT")
}

Hue.escape_special_characters = function(s)
{
	return s.replace(/[^A-Za-z0-9]/g, '\\$&');
}

Hue.start_chat_mouse_events = function()
{
	$("#chat_area").on("click", ".chat_uname", function()
	{
		Hue.show_profile($(this).text(), $(this).data("prof_image"))
	})

	$("#chat_area").on("click", ".chat_profile_image", function()
	{
		Hue.show_profile($(this).closest(".chat_message").find(".chat_uname").eq(0).text(), $(this).attr("src"))
	})

	$("#chat_area").on("dblclick", ".chat_menu_button_edit", function()
	{
		let container = $(this).closest(".chat_content_container").get(0)
		Hue.edit_message(container)
	})

	$("#chat_area").on("dblclick", ".chat_menu_button_remove", function()
	{
		let id = $(this).closest(".chat_content_container").data("id")
		Hue.remove_message(id)
	})

	$("#chat_area").on("click", ".message_edit_submit", function()
	{
		Hue.send_edit_messsage()
	})

	$("#chat_area").on("click", ".message_edit_cancel", function()
	{
		Hue.stop_edit_message()
	})
}

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

Hue.highlight_same_posts = function(uname, add=true)
{
	$(".message").each(function()
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

	Hue.fill_defaults(args, def_args)

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

	let contclasses = "chat_content"

	let highlighted = false

	if(args.username !== Hue.username)
	{
		if(Hue.check_highlights(args.message))
		{
			contclasses += " highlighted"
			highlighted = true
		}
	}

	let d

	if(args.date)
	{
		d = args.date
	}

	else
	{
		d = Date.now()
	}

	let nd = Hue.nice_date(d)

	let pi

	if(args.prof_image === "" || args.prof_image === undefined)
	{
		pi = Hue.default_profile_image_url
	}

	else
	{
		pi = args.prof_image
	}

	let messageclasses

	if(Hue.get_setting("chat_layout") === "normal")
	{
		messageclasses = "normal_layout"
	}

	else if(Hue.get_setting("chat_layout") === "compact")
	{
		messageclasses = "compact_layout"
	}

	let split = args.message.split(" ")

	let image_preview = false
	let image_preview_src = false
	let image_preview_src_original = false

	let starts_me = args.message.startsWith('/me ') || args.message.startsWith('/em ')

	if(!starts_me && Hue.get_setting("show_image_previews"))
	{
		let num_links = 0
		
		let link = false

		for(let sp of split)
		{
			if((sp.startsWith("https://") || sp.startsWith("http://")))
			{
				num_links += 1
				link = sp
			}
		}

		if(num_links === 1 && link.includes("imgur.com"))
		{
			let code = Hue.utilz.get_imgur_image_code(link)

			if(code)
			{
				let extension = Hue.utilz.get_extension(link)

				image_preview_src_original = `https://i.imgur.com/${code}.${extension}`
				image_preview_src = `https://i.imgur.com/${code}l.jpg`
				image_preview_array = []

				for(let sp of split)
				{
					if(sp === link)
					{
						image_preview_array.push(`<div class='image_preview action'><div class='image_preview_url'>${link}</div><img draggable="false" class="image_preview_image" src="${image_preview_src}"></div>`)
					}

					else
					{
						image_preview_array.push(Hue.make_html_safe(sp))
					}
				}

				image_preview = image_preview_array.join(" ")
			}
		}
	}

	let link_preview = false

	if(!starts_me && !image_preview && args.link_url && Hue.get_setting("show_link_previews"))
	{
		let link_preview_s = false

		if(args.link_title && args.link_image)
		{
			link_preview_s = 
			`<div class='link_preview action'>
				<div class='link_preview_url'>${Hue.make_html_safe(args.link_url)}</div>
				<div class='spacer3'></div>
				<div class='link_preview_title'>${Hue.make_html_safe(args.link_title)}</div>
				<div class='spacer3'></div>
				<div><img class='link_preview_image' src='${args.link_image}'></div>
			</div>`
		}

		else if(args.link_title)
		{
			link_preview_s = 
			`<div class='link_preview action'>
				<div class='link_preview_url'>${Hue.make_html_safe(args.link_url)}</div>
				<div class='spacer3'></div>
				<div class='link_preview_title'>${Hue.make_html_safe(args.link_title)}</div>
			</div>`
		}

		else if(args.link_image)
		{
			link_preview_s = 
			`<div class='link_preview action'>
				<div class='link_preview_url'>${args.link_url.substring(0, 100)}</div>
				<div class='spacer3'></div>
				<img class='link_preview_image' src='${args.link_image}'>
			</div>`
		}

		if(link_preview_s)
		{
			let link_preview_array = []

			for(let sp of split)
			{
				if(sp === args.link_url)
				{
					link_preview_array.push(link_preview_s)
				}

				else
				{
					link_preview_array.push(Hue.make_html_safe(sp))
				}
			}

			link_preview = link_preview_array.join(" ")
		}
	}

	let fmessage

	let chat_menu_button_main_class = ""

	if(args.id && args.user_id === Hue.user_id)
	{
		chat_menu_button_main_class = "chat_menu_button_main"
	}
	
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

		let s = `
		<div class='message chat_message thirdperson ${messageclasses}'>
			<div class='chat_third_container'>
				<div class='brk chat_third_brk'>${args.brk}</div>
				<div class='chat_content_container chat_content_container_third ${chat_menu_button_main_class}'>
					<div class='chat_menu_button_container unselectable'>
						<div class='chat_menu_button action chat_menu_button_edit' title='Double Click To Activate'>Edit</div>
						<div class='chat_menu_button action chat_menu_button_remove' title='Double Click To Activate'>Remove</div>
					</div>

					<div class='chat_third_container'>
						<div class='chat_third_content'>
							<span class='chat_uname action'></span><span class='${contclasses}' title='${nd}' data-date='${d}'></span>
						</div>
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
		let s

		if(Hue.get_setting("chat_layout") === "normal")
		{
			s = `
			<div class='message chat_message normal_layout'>
				<div class='chat_left_side'>
					<div class='chat_profile_image_container unselectable action4'>
						<img class='chat_profile_image' src='${pi}'>
					</div>
				</div>
				<div class='chat_right_side'>
					<div class='chat_uname_container'>
						<div class='chat_uname action'></div>
					</div>
					<div class='chat_container'>
						<div class='chat_content_container ${chat_menu_button_main_class}'>

							<div class='chat_menu_button_container unselectable'>
								<div class='chat_menu_button action chat_menu_button_edit' title='Double Click To Activate'>Edit</div>
								<div class='chat_menu_button action chat_menu_button_remove' title='Double Click To Activate'>Remove</div>
							</div>

							<div class='${contclasses}' title='${nd}' data-date='${d}'></div>
							
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
		}

		else if(Hue.get_setting("chat_layout") === "compact")
		{
			s = `
			<div class='message chat_message compact_layout'>
				<div class='chat_uname_container'>
					<div class='chat_uname action'></div><div>:</div>
				</div>
				<div class='chat_container'>
					<div class='chat_content_container ${chat_menu_button_main_class}'>
						<div class='chat_menu_button_container unselectable'>
							<div class='chat_menu_button action chat_menu_button_edit' title='Double Click To Activate'>Edit</div>
							<div class='chat_menu_button action chat_menu_button_remove' title='Double Click To Activate'>Remove</div>
						</div>

						<div class='${contclasses}' title='${nd}' data-date='${d}'></div>

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
		}

		fmessage = $(s)

		fmessage.find(".chat_content_container").eq(0).data("original_message", args.message)

		if(image_preview)
		{
			fmessage.find('.chat_content').eq(0).html(image_preview)
		}

		else if(link_preview)
		{
			fmessage.find('.chat_content').eq(0).html(link_preview)
		}

		else
		{
			fmessage.find('.chat_content').eq(0).text(args.message)
		}
	}

	let huname = fmessage.find('.chat_uname').eq(0)
	
	huname.text(args.username)

	huname.data("prof_image", pi)

	fmessage.find('.chat_profile_image').eq(0).on("error", function()
	{
		if($(this).attr("src") !== Hue.default_profile_image_url)
		{
			$(this).attr("src", Hue.default_profile_image_url)
		}
	})

	fmessage.data("user_id", args.user_id)
	fmessage.data("public", args.public)
	fmessage.data("date", d)
	fmessage.data("highlighted", highlighted)
	fmessage.data("uname", args.username)
	fmessage.data("mode", "chat")

	fmessage = Hue.replace_markdown(fmessage)

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
		let image_preview_el = fmessage.find(".image_preview").eq(0)

		image_preview_el.click(function()
		{
			Hue.open_url_menu(image_preview_src_original)
		})

		let image_preview_image = image_preview_el.find(".image_preview_image").eq(0)

		image_preview_image[0].addEventListener("load", function()
		{
			if(args.user_id === Hue.user_id || !started)
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
			Hue.expand_image(image_preview_src_original)
		})
	}

	let started = Hue.started

	if(link_preview)
	{
		let link_preview_el = fmessage.find(".link_preview").eq(0)

		link_preview_el.click(function()
		{
			Hue.open_url_menu(args.link_url)
		})
		
		let link_preview_image = link_preview_el.find(".link_preview_image").eq(0)

		if(link_preview_image.length > 0)
		{
			link_preview_image[0].addEventListener("load", function()
			{
				if(args.user_id === Hue.user_id || !started)
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
			Hue.expand_image($(this).attr("src"))
		})
	}

	fmessage.find(".whisper_link").each(function()
	{
		$(this).click(function()
		{
			Hue.process_write_whisper(`${args.username} > ${$(this).data("whisper")}`, false)
		})
	})

	Hue.add_to_chat(
	{
		message: fmessage, 
		save: true, 
		id: args.id, 
		just_edited: args.just_edited
	})

	if(args.username !== Hue.username)
	{
		if(highlighted)
		{
			Hue.alert_title2()
			Hue.sound_notify("highlight")
		}

		else
		{
			Hue.alert_title()
			Hue.sound_notify("message")
		}
	}
}

Hue.add_to_chat = function(args={})
{
	let def_args =
	{
		message: false,
		save: false,
		notify: true,
		id: false,
		just_edited: false,
		fader: true
	}

	Hue.fill_defaults(args, def_args)

	if(!args.message)
	{
		return false
	}

	if(Hue.started && !Hue.app_focused)
	{
		Hue.add_separator(false)
	}

	let chat_area = $('#chat_area')
	let last_message = $(".message").last()
	let appended = false
	let mode = args.message.data("mode")
	let uname = args.message.data("uname")
	let date = args.message.data("date")
	let is_public = args.message.data("public")

	let content_container

	if(mode === "chat")
	{
		content_container = args.message.find(".chat_content_container").eq(0)
		
		if(args.just_edited && args.id)
		{
			$(".chat_content_container").each(function()
			{
				if($(this).data("id") === args.id)
				{
					$(this).html(content_container.html())
					$(this).data(content_container.data())
					$(this).find(".message_edited_label").css("display", "inline-block")
					Hue.replace_in_chat_history($(this).closest(".message"))
					Hue.chat_scroll_bottom(false, false)
					return false
				}
			})

			return false
		}
	}

	if((args.message.hasClass("chat_message") && !args.message.hasClass("thirdperson")) && (last_message.hasClass("chat_message") && !last_message.hasClass("thirdperson")))
	{
		if(args.message.find(".chat_uname").eq(0).text() === last_message.find(".chat_uname").eq(0).text())
		{
			if(last_message.find(".chat_content").length < Hue.max_same_post_messages)
			{
				let date_diff = args.message.find('.chat_content').last().data("date") - last_message.find('.chat_content').last().data("date")

				if(date_diff < Hue.max_same_post_diff)
				{
					if(Hue.started && Hue.app_focused && args.fader)
					{
						content_container.addClass("fader")
					}

					last_message.find(".chat_container").eq(0).append(content_container)

					Hue.replace_in_chat_history(last_message)

					if(!last_message.data("highlighted"))
					{
						last_message.data("highlighted", args.message.data("highlighted"))
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

		let last = $(".message").last()

		let last_date = last.data("date")

		if(date && last_date)
		{
			if(date - last_date > Hue.old_activity_min)
			{
				chat_area.append(Hue.generate_vseparator(Hue.get_old_activity_message(last_date, date)))
			}
		}

		chat_area.append(args.message)

		if($(".message").length > Hue.chat_crop_limit)
		{
			$("#chat_area > .message").eq(0).remove()
		}
		
		if(args.save)
		{
			Hue.message_id += 1
			args.message.data("message_id", Hue.message_id)
			Hue.push_to_chat_history(args.message)
		}
	}

	if(Hue.started)
	{
		Hue.update_chat_scrollbar()
		Hue.goto_bottom(false, false)
	}

	Hue.scroll_timer()

	if(is_public && uname && date)
	{
		Hue.push_to_activity_bar(uname, date)
	}

	if(args.notify && Hue.started && args.message.data("highlighted"))
	{
		Hue.electron_signal("highlighted")
	}
}

Hue.push_to_chat_history = function(message)
{
	Hue.chat_history.push(message.clone(true, true))

	if(Hue.chat_history.length > Hue.chat_crop_limit)
	{
		Hue.chat_history = Hue.chat_history.slice(Hue.chat_history.length - Hue.chat_crop_limit)
	}
}

Hue.replace_in_chat_history = function(message)
{
	for(let i=0; i<Hue.chat_history.length; i++)
	{
		let message2 = Hue.chat_history[i]

		if(message.data("message_id") === message2.data("message_id"))
		{
			Hue.chat_history[i] = message
			return
		}
	}
}

Hue.remove_from_chat_history = function(message)
{
	for(let i=0; i<Hue.chat_history.length; i++)
	{
		let message2 = Hue.chat_history[i]

		if(message.data("message_id") === message2.data("message_id"))
		{
			Hue.chat_history.splice(i, 1)
			return
		}
	}
}

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

Hue.generate_vseparator = function(message="", classes="")
{
	let layout = `${Hue.get_setting("chat_layout")}_layout`
	
	let s =
	`
		<div class='message vseparator_container ${layout} ${classes}'>
			<div class='vseparator_line'></div>
			<div class='vseparator_text'>${message}</div>
			<div class='vseparator_line'></div>
		</div>
	`

	return s
}

Hue.change = function(args={})
{
	let def_args =
	{
		type: "",
		force: false,
		play: true,
		notify: true,
		current_source: false
	}

	Hue.fill_defaults(args, def_args)

	if(args.type === "image")
	{
		if(!args.force && Hue.last_image_source === Hue.current_image().source)
		{
			return false
		}
	}

	else if(args.type === "tv")
	{
		if(!args.force && Hue.last_tv_source === Hue.current_tv().source)
		{
			return false
		}
	}

	else if(args.type === "radio")
	{
		if(!args.force && Hue.last_radio_source === Hue.current_radio().source)
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

	if(args.type === "tv")
	{
		if(!Hue.last_tv_source && !args.force)
		{
			args.play = false
		}
	}

	let setter = ""

	if(args.type === "image")
	{
		if(!Hue.room_state.images_enabled || (Hue.room_state.images_locked && Hue.last_image_source && !args.current_source))
		{
			return false
		}

		if(Hue.room_images_mode === "disabled")
		{
			return false
		}

		if(Hue.background_mode === "mirror" || Hue.background_mode === "mirror_tiled")
		{
			Hue.apply_background()
		}

		let src
		let source_changed

		if(args.current_source && Hue.last_image_source)
		{
			src = Hue.last_image_source
			source_changed = false
		}

		else
		{
			src = Hue.current_image().source
			source_changed = true
		}		

		Hue.show_image(src, args.force)

		if(source_changed)
		{
			Hue.last_image_source = Hue.current_image().source
		}

		setter = Hue.current_image().setter
	}

	else if(args.type === "tv")
	{
		if(!Hue.room_state.tv_enabled || (Hue.room_state.tv_locked && Hue.last_tv_source && !args.current_source))
		{
			return false
		}

		if(Hue.room_tv_mode === "disabled")
		{
			return false
		}

		let src
		let source_changed

		if(args.current_source && Hue.last_tv_source)
		{
			src = Hue.last_tv_source
			source_changed = false
		}

		else
		{
			src = Hue.current_tv().source
			source_changed = true
		}

		if(Hue.current_tv().type === "youtube")
		{
			if(Hue.youtube_video_player === undefined)
			{
				return false
			}

			Hue.show_youtube_video(src, args.play)
		}

		else if(Hue.current_tv().type === "twitch")
		{
			if(Hue.twitch_video_player === undefined)
			{
				return false
			}

			Hue.show_twitch_video(src, args.play)
		}

		else if(Hue.current_tv().type === "soundcloud")
		{
			if(Hue.soundcloud_video_player === undefined)
			{
				return false
			}

			Hue.show_soundcloud_video(src, args.play)
		}

		else if(Hue.current_tv().type === "url")
		{
			Hue.show_video(src, args.play)
		}

		else if(Hue.current_tv().type === "iframe")
		{
			Hue.show_iframe_video(src, args.play)
		}

		else
		{
			return false
		}

		if(source_changed)
		{
			Hue.last_tv_source = Hue.current_tv().source
			Hue.last_tv_type = Hue.current_tv().type
		}

		setter = Hue.current_tv().setter

		Hue.play_video_on_load = false
	}

	else if(args.type === "radio")
	{
		if(!Hue.room_state.radio_enabled || (Hue.room_state.radio_locked && Hue.last_radio_source && !args.current_source))
		{
			return false
		}

		if(Hue.room_radio_mode === "disabled")
		{
			return false
		}

		if(Hue.current_radio().type === "youtube")
		{
			if(Hue.youtube_player === undefined)
			{
				return false
			}
		}

		else if(Hue.current_radio().type === "soundcloud")
		{
			if(Hue.soundcloud_player === undefined)
			{
				return false
			}
		}

		let src
		let type
		let source_changed

		if(args.current_source && Hue.last_radio_source)
		{
			src = Hue.last_radio_source
			type = Hue.last_radio_type
			source_changed = false
		}

		else
		{
			src = Hue.current_radio().source
			type = Hue.current_radio().type
			source_changed = true
		}		

		Hue.load_radio(src, type)

		if(source_changed)
		{
			Hue.last_radio_source = Hue.current_radio().source
			Hue.last_radio_type = Hue.current_radio().type
		}

		setter = Hue.current_radio().setter
	}

	else
	{
		return false
	}

	if(args.notify && setter !== Hue.username)
	{
		Hue.alert_title()
		Hue.sound_notify("media_change")
	}
}

Hue.show_image = function(src, force=false)
{
	$("#media_image_frame").attr("crossOrigin", "anonymous")

	$("#media_image_error").css("display", "none")

	$("#media_image_frame").css("display", "initial")

	if(force || $("#media_image_frame").attr("src") !== src)
	{
		$("#media_image_frame").attr("src", src)
	}

	else
	{
		Hue.after_image_load()
	}
}

Hue.show_current_image_modal = function(current=true)
{
	if(current)
	{
		Hue.show_modal_image(Hue.current_image_source, Hue.current_image_info, Hue.current_image_date)
	}

	else
	{
		if(Hue.images_changed.length > 0)
		{
			let data = Hue.images_changed[Hue.images_changed.length - 1]
			Hue.show_modal_image(data.source, data.info, data.date)
		}
	}
}

Hue.start_image_events = function()
{
	$('#media_image_frame')[0].addEventListener('load', function(e)
	{
		Hue.after_image_load()
	})

	$('#media_image_frame').on("error", function()
	{
		if($("#media_image_frame")[0].hasAttribute("crossOrigin"))
		{
			$("#media_image_frame").removeAttr("crossOrigin")
			$("#media_image_frame").attr("src", $("#media_image_frame").attr("src"))
		}

		else
		{
			$("#media_image_frame").css("display", "none")
			$("#media_image_error").css("display", "initial")
		}
	})

	$("#admin_background_image")[0].addEventListener('load', function()
	{
		Hue.update_modal_scrollbar("main_menu")
	})

	$("#media_image_frame").height(0)
	$("#media_image_frame").width(0)
}

Hue.after_image_load = function()
{
	Hue.current_image_source = Hue.current_image().source
	Hue.current_image_info = Hue.current_image().info
	Hue.current_image_date = Hue.current_image().date

	Hue.get_dominant_theme()
	Hue.fix_image_frame()
}

Hue.get_dominant_theme = function()
{
	try
	{
		let color = Hue.colorlib.get_dominant($("#media_image_frame")[0], 1, true)[0]

		if(color)
		{
			Hue.dominant_theme = color

			if(Hue.theme_mode === "automatic")
			{
				Hue.apply_theme()
			}
		}

		else
		{
			Hue.dominant_theme = false
		}
	}

	catch(err)
	{
		Hue.dominant_theme = false
	}
}

Hue.get_size_string = function(size)
{
	return `${parseFloat(size / 1024).toFixed(2)} MB`
}

Hue.fill_defaults = function(args, def_args)
{
	for(let key in def_args)
	{
		let d = def_args[key]

		if(args[key] === undefined)
		{
			args[key] = d
		}
	}
}

Hue.chat_announce = function(args={})
{
	let def_args =
	{
		brk: "",
		message: "",
		highlight: false,
		title: false,
		onclick: false,
		save: false,
		id: false,
		date: false,
		type: "normal",
		info1: "",
		info2: "",
		username: false,
		open_profile: false,
		public: false
	}

	Hue.fill_defaults(args, def_args)

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

	let messageclasses = "message announcement"
	let containerclasses = "announcement_content_container"
	let contclasses = "announcement_content"

	let clickable = false

	if(args.onclick || (args.username && args.open_profile))
	{
		containerclasses += " pointer action"
		clickable = true
	}

	let containerid = " "

	if(args.id)
	{
		containerid = ` id='${args.id}' `
	}

	if(args.highlight === true)
	{
		contclasses += " highlighted"
	}

	let d
	let t

	if(args.date)
	{
		d = args.date
	}

	else
	{
		d = Date.now()
	}

	if(args.title)
	{
		t = `${args.title}`

	}

	else
	{
		t = Hue.nice_date(d)
	}

	if(Hue.get_setting("chat_layout") === "normal")
	{
		messageclasses += " normal_layout"
	}

	else if(Hue.get_setting("chat_layout") === "compact")
	{
		messageclasses += " compact_layout"
	}

	let s = `
	<div${containerid}class='${messageclasses}'>
		<div class='${containerclasses}'>
			<div class='brk announcement_brk'>${args.brk}</div>
			<div class='${contclasses}' title='${t}'></div>
		</div>
	</div>`

	let fmessage = $(s)

	let content = fmessage.find('.announcement_content').eq(0)

	if(clickable)
	{
		content.text(args.message).urlize()
	}

	else
	{
		content.text(args.message).urlize()
	}

	if(args.onclick)
	{
		content.parent().on("click", args.onclick)
	}

	else if(args.username && args.open_profile)
	{
		let pif = function()
		{
			Hue.show_profile(args.username)
		}

		content.parent().on("click", pif)
	}
	
	fmessage.data("public", args.public)
	fmessage.data("date", d)
	fmessage.data("highlighted", args.highlight)
	fmessage.data("type", args.type)
	fmessage.data("info1", args.info1)
	fmessage.data("info2", args.info2)
	fmessage.data("uname", args.username)
	fmessage.data("mode", "announcement")

	if(!ignore)
	{
		Hue.add_to_chat({message:fmessage, save:args.save})
		
		if(args.highlight)
		{
			Hue.alert_title2()
			Hue.sound_notify("highlight")
		}
	}
}

jQuery.fn.urlize = function(force=false, stop_propagation=true)
{
	let cls = "generic action"

	if(stop_propagation)
	{
		cls += " stop_propagation"
	}

	if(this.length > 0)
	{
		this.each(function(n, obj)
		{
			let x = $(obj).html()

			if(force)
			{
				x = `<a class='${cls}' target='_blank' href='${x}'>${x}</a>`
			}

			else
			{
				let list = x.match(/\bhttps?:\/\/\S+/g)

				if(list)
				{
					let listed = []

					for(let i=0; i<list.length; i++)
					{
						if(listed.includes(list[i]))
						{
							continue
						}

						let rep = new RegExp(Hue.escape_special_characters(list[i]), "g")

						x = x.replace(rep, `<a class='${cls}' target='_blank' href='${list[i]}'>${list[i]}</a>`)

						listed.push(list[i])
					}
				}
			}

			$(obj).html(x)

			$(obj).find(".stop_propagation").each(function()
			{
				$(this).click(function(e)
				{
					e.stopPropagation()
				})
			})
		})
	}
}

Hue.setup_commands = function()
{
	Hue.commands.sort()

	for(let command of Hue.commands)
	{
		Hue.commands_sorted[command] = command.split('').sort().join('')
	}

	for(let key in Hue.commands_sorted)
	{
		let scmd1 = Hue.commands_sorted[key]

		for(let key2 in Hue.commands_sorted)
		{
			let scmd2 = Hue.commands_sorted[key2]

			if(key !== key2)
			{
				if(scmd1 === scmd2)
				{
					console.error(`Command anagrams detected. ${key} and ${key2}`)
				}
			}
		}
	}
}

Hue.is_command = function(message)
{
	if(message.length >= 2
	&& message[0] === '/'
	&& message[1] !== '/'
	&& !message.startsWith('/me ')
	&& !message.startsWith('/em '))
	{
		return true
	}

	return false
}

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

	Hue.fill_defaults(args, def_args)

	let message_split = args.message.split("\n")

	let num_lines = message_split.length

	if(num_lines === 1)
	{
		 args.message = args.message.trim()
	}

	else
	{
		let new_lines = []

		for(let line of message_split)
		{
			if(line.trim().length > 0)
			{
				new_lines.push(line)
			}
		}

		args.message = new_lines.join("\n")
	}

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
						return args.callback()
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
				return args.callback()
			}

			else
			{
				return false
			}
		}

		let msplit = args.message.split(" ")
		let alias_cmd = msplit[0].trim()
		let alias = Hue.command_aliases[alias_cmd]

		if(alias !== undefined)
		{
			let alias_arg = msplit.slice(1).join(" ").trim()

			let full_alias = `${alias} ${alias_arg}`.trim()

			if(alias_cmd.startsWith("/X"))
			{
				args.to_history = false
			}

			if(args.to_history)
			{
				Hue.add_to_input_history(args.message)
			}

			Hue.process_message(
			{
				message: full_alias,
				to_history: false,
				clr_input: args.clr_input
			})
			
			if(args.callback)
			{
				return args.callback()
			}

			else
			{
				return false
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
			args.message = Hue.utilz.clean_string10(args.message)

			if(args.message.length === 0)
			{
				Hue.clear_input()

				if(args.callback)
				{
					return args.callback()
				}

				else
				{
					return false
				}
			}

			if(num_lines > Hue.max_num_newlines)
			{
				if(args.callback)
				{
					return args.callback()
				}

				else
				{
					return false
				}
			}

			if(args.message.length > Hue.max_input_length)
			{
				args.message = args.message.substring(0, Hue.max_input_length)
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
		return args.callback()
	}
}

Hue.execute_command = function(message, ans)
{
	let split = message.toLowerCase().split(' ')
	
	let cmd = split[0]

	if(cmd.length < 2)
	{
		Hue.feedback("Invalid empty command")
		return ans
	}

	let cmd2 = cmd.split('').sort().join('')

	let arg

	if(split.length > 1)
	{
		cmd2 += ' '

		arg = message.substring(cmd2.length)
	}

	if(Hue.oi_equals(cmd2, '/clear'))
	{
		Hue.clear_chat()
	}

	else if(Hue.oi_equals(cmd2, '/clearinput'))
	{
		Hue.clear_input()
	}

	else if(Hue.oi_equals(cmd2, '/unclear'))
	{
		Hue.unclear_chat()
	}

	else if(Hue.oi_equals(cmd2, '/users'))
	{
		Hue.show_userlist()
	}

	else if(Hue.oi_startswith(cmd2, '/users'))
	{
		Hue.show_userlist(arg)
	}

	else if(Hue.oi_equals(cmd2, '/publicrooms'))
	{
		Hue.request_roomlist("", "public_roomlist")
	}

	else if(Hue.oi_startswith(cmd2, '/publicrooms'))
	{
		Hue.request_roomlist(arg, "public_roomlist")
	}

	else if(Hue.oi_equals(cmd2, '/visitedrooms'))
	{
		Hue.request_roomlist("", "visited_roomlist")
	}

	else if(Hue.oi_startswith(cmd2, '/visitedrooms'))
	{
		Hue.request_roomlist(arg, "visited_roomlist")
	}

	else if(Hue.oi_equals(cmd2, '/roomname'))
	{
		Hue.show_room()
	}

	else if(Hue.oi_startswith(cmd2, '/roomname'))
	{
		Hue.change_room_name(arg)
	}

	else if(Hue.oi_equals(cmd2, '/roomnameedit'))
	{
		Hue.room_name_edit()
		ans.to_history = false
		ans.clr_input = false
	}

	else if(Hue.oi_equals(cmd2, '/played'))
	{
		Hue.show_played()
	}

	else if(Hue.oi_startswith(cmd2, '/played'))
	{
		Hue.show_played(arg)
	}

	else if(Hue.oi_equals(cmd2, '/search'))
	{
		Hue.show_chat_search()
	}

	else if(Hue.oi_startswith(cmd2, '/search'))
	{
		Hue.show_chat_search(arg)
	}

	else if(Hue.oi_equals(cmd2, '/role'))
	{
		Hue.show_role()
	}

	else if(Hue.oi_startswith(cmd2, '/voice1'))
	{
		Hue.change_role(arg, "voice1")
	}

	else if(Hue.oi_startswith(cmd2, '/voice2'))
	{
		Hue.change_role(arg, "voice2")
	}

	else if(Hue.oi_startswith(cmd2, '/voice3'))
	{
		Hue.change_role(arg, "voice3")
	}

	else if(Hue.oi_startswith(cmd2, '/voice4'))
	{
		Hue.change_role(arg, "voice4")
	}

	else if(Hue.oi_startswith(cmd2, '/op'))
	{
		Hue.change_role(arg, "op")
	}

	else if(Hue.oi_startswith(cmd2, '/admin'))
	{
		Hue.change_role(arg, "admin")
	}

	else if(Hue.oi_equals(cmd2, '/resetvoices'))
	{
		Hue.reset_voices()
	}

	else if(Hue.oi_equals(cmd2, '/removeops'))
	{
		Hue.remove_ops()
	}

	else if(Hue.oi_startswith(cmd2, '/ban'))
	{
		Hue.ban(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/unban'))
	{
		Hue.unban(arg)
	}

	else if(Hue.oi_equals(cmd2, '/unbanall'))
	{
		Hue.unban_all()
	}

	else if(Hue.oi_equals(cmd2, '/bannedcount'))
	{
		Hue.get_banned_count()
	}

	else if(Hue.oi_startswith(cmd2, '/kick'))
	{
		Hue.kick(arg)
	}

	else if(Hue.oi_equals(cmd2, '/public'))
	{
		Hue.change_privacy(true)
	}

	else if(Hue.oi_equals(cmd2, '/private'))
	{
		Hue.change_privacy(false)
	}

	else if(Hue.oi_equals(cmd2, '/privacy'))
	{
		Hue.show_public()
	}

	else if(Hue.oi_equals(cmd2, '/log'))
	{
		Hue.show_log()
	}

	else if(Hue.oi_equals(cmd2, '/enablelog'))
	{
		Hue.change_log(true)
	}

	else if(Hue.oi_equals(cmd2, '/disablelog'))
	{
		Hue.change_log(false)
	}

	else if(Hue.oi_equals(cmd2, '/clearlog'))
	{
		Hue.clear_log()
	}

	else if(Hue.oi_equals(cmd2, '/clearlog2'))
	{
		Hue.clear_log(true)
	}

	else if(Hue.oi_startswith(cmd2, '/radio'))
	{
		Hue.change_radio_source(arg)
	}

	else if(Hue.oi_equals(cmd2, '/radio'))
	{
		Hue.show_media_source("radio")
	}

	else if(Hue.oi_startswith(cmd2, '/tv'))
	{
		Hue.change_tv_source(arg)
	}

	else if(Hue.oi_equals(cmd2, '/tv'))
	{
		Hue.show_media_source("tv")
	}

	else if(Hue.oi_startswith(cmd2, '/image') || Hue.oi_startswith(cmd2, '/images'))
	{
		Hue.change_image_source(arg)
	}

	else if(Hue.oi_equals(cmd2, '/image'))
	{
		Hue.show_media_source("image")
	}

	else if(Hue.oi_equals(cmd2, '/status'))
	{
		Hue.show_status()
	}

	else if(Hue.oi_startswith(cmd2, '/topic'))
	{
		Hue.change_topic(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/topicadd'))
	{
		Hue.topicadd(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/topictrim'))
	{
		Hue.topictrim(arg)
	}

	else if(Hue.oi_equals(cmd2, '/topictrim'))
	{
		Hue.topictrim(1)
	}

	else if(Hue.oi_startswith(cmd2, '/topicaddstart'))
	{
		Hue.topicstart(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/topictrimstart'))
	{
		Hue.topictrimstart(arg)
	}

	else if(Hue.oi_equals(cmd2, '/topictrimstart'))
	{
		Hue.topictrimstart(1)
	}

	else if(Hue.oi_equals(cmd2, '/topicedit'))
	{
		Hue.topicedit()
		ans.to_history = false
		ans.clr_input = false
	}

	else if(Hue.oi_equals(cmd2, '/topic'))
	{
		Hue.show_topic()
	}

	else if(Hue.oi_equals(cmd2, '/room'))
	{
		Hue.show_room()
	}

	else if(Hue.oi_equals(cmd2, '/help') || Hue.oi_equals(cmd2, '/help1'))
	{
		Hue.show_help(1)
	}

	else if(Hue.oi_startswith(cmd2, '/help') || Hue.oi_startswith(cmd2, '/help1'))
	{
		Hue.show_help(1, arg)
	}

	else if(Hue.oi_equals(cmd2, '/help2'))
	{
		Hue.show_help(2)
	}

	else if(Hue.oi_startswith(cmd2, '/help2'))
	{
		Hue.show_help(2, arg)
	}

	else if(Hue.oi_equals(cmd2, '/help3'))
	{
		Hue.show_help(3)
	}

	else if(Hue.oi_startswith(cmd2, '/help3'))
	{
		Hue.show_help(3, arg)
	}

	else if(Hue.oi_equals(cmd2, '/stopradio'))
	{
		Hue.stop_radio()
	}

	else if(Hue.oi_equals(cmd2, '/startradio'))
	{
		Hue.start_radio()
	}

	else if(Hue.oi_startswith(cmd2, '/radiovolume'))
	{
		Hue.change_volume_command(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/tvvolume'))
	{
		Hue.change_volume_command(arg, "tv")
	}

	else if(Hue.oi_startswith(cmd2, '/volume'))
	{
		Hue.change_volume_command(arg)
		Hue.change_volume_command(arg, "tv")
	}

	else if(Hue.oi_equals(cmd2, '/history'))
	{
		Hue.show_input_history()
	}

	else if(Hue.oi_startswith(cmd2, '/history'))
	{
		Hue.show_input_history(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/changeusername'))
	{
		Hue.change_username(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/changepassword'))
	{
		Hue.change_password(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/changeemail'))
	{
		Hue.change_email(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/verifyemail'))
	{
		Hue.verify_email(arg)
	}

	else if(Hue.oi_equals(cmd2, '/details'))
	{
		Hue.show_details()
	}

	else if(Hue.oi_equals(cmd2, '/logout'))
	{
		Hue.logout()
	}

	else if(Hue.oi_equals(cmd2, '/fill'))
	{
		Hue.fill()
	}

	else if(Hue.oi_equals(cmd2, '/shrug'))
	{
		Hue.shrug()
	}

	else if(Hue.oi_equals(cmd2, '/afk'))
	{
		Hue.show_afk()
	}

	else if(Hue.oi_equals(cmd2, '/disconnectothers'))
	{
		Hue.disconnect_others()
	}

	else if(Hue.oi_startswith(cmd2, '/whisper'))
	{
		Hue.process_write_whisper(arg, true)
	}

	else if(Hue.oi_startswith(cmd2, '/whisper2'))
	{
		Hue.process_write_whisper(arg, false)
	}

	else if(Hue.oi_equals(cmd2, '/whisperops'))
	{
		Hue.write_popup_message(false, "ops")
	}

	else if(Hue.oi_equals(cmd2, '/broadcast'))
	{
		Hue.write_popup_message(false, "room")
	}

	else if(Hue.oi_equals(cmd2, '/systembroadcast'))
	{
		Hue.write_popup_message(false, "system")
		ans.to_history = false
	}

	else if(Hue.oi_equals(cmd2, '/systemrestart'))
	{
		Hue.send_system_restart_signal()
		ans.to_history = false
	}

	else if(Hue.oi_equals(cmd2, '/annex'))
	{
		Hue.annex()
		ans.to_history = false
	}

	else if(Hue.oi_startswith(cmd2, '/annex'))
	{
		Hue.annex(arg)
	}

	else if(Hue.oi_equals(cmd2, '/highlights'))
	{
		Hue.show_highlights()
	}

	else if(Hue.oi_startswith(cmd2, '/highlights'))
	{
		Hue.show_highlights(arg)
	}

	else if(Hue.oi_equals(cmd2, '/lock'))
	{
		Hue.stop_and_lock(false)
	}

	else if(Hue.oi_equals(cmd2, '/unlock'))
	{
		Hue.default_media_state(false)
	}

	else if(Hue.oi_equals(cmd2, '/stopandlock'))
	{
		Hue.stop_and_lock()
	}

	else if(Hue.oi_equals(cmd2, '/stop'))
	{
		Hue.stop_media()
	}

	else if(Hue.oi_equals(cmd2, '/default'))
	{
		Hue.default_media_state()
	}

	else if(Hue.oi_equals(cmd2, '/menu'))
	{
		Hue.show_main_menu()
	}

	else if(Hue.oi_equals(cmd2, '/media'))
	{
		Hue.show_media_menu()
	}

	else if(Hue.oi_equals(cmd2, '/user'))
	{
		Hue.show_user_menu()
	}

	else if(Hue.oi_equals(cmd2, '/imagehistory'))
	{
		Hue.show_image_history()
	}

	else if(Hue.oi_startswith(cmd2, '/imagehistory'))
	{
		Hue.show_image_history(arg)
	}

	else if(Hue.oi_equals(cmd2, '/tvhistory'))
	{
		Hue.show_tv_history()
	}

	else if(Hue.oi_startswith(cmd2, '/tvhistory'))
	{
		Hue.show_tv_history(arg)
	}

	else if(Hue.oi_equals(cmd2, '/radiohistory'))
	{
		Hue.show_radio_history()
	}

	else if(Hue.oi_startswith(cmd2, '/radiohistory'))
	{
		Hue.show_radio_history(arg)
	}

	else if(Hue.oi_equals(cmd2, '/lockimages'))
	{
		Hue.toggle_lock_images(true)
	}

	else if(Hue.oi_equals(cmd2, '/locktv'))
	{
		Hue.toggle_lock_tv(true)
	}

	else if(Hue.oi_equals(cmd2, '/lockradio'))
	{
		Hue.toggle_lock_radio(true)
	}

	else if(Hue.oi_equals(cmd2, '/unlockimages'))
	{
		Hue.toggle_lock_images(false)
	}

	else if(Hue.oi_equals(cmd2, '/unlocktv'))
	{
		Hue.toggle_lock_tv(false)
	}

	else if(Hue.oi_equals(cmd2, '/unlockradio'))
	{
		Hue.toggle_lock_radio(false)
	}

	else if(Hue.oi_equals(cmd2, '/togglelockimages'))
	{
		Hue.toggle_lock_images()
	}

	else if(Hue.oi_equals(cmd2, '/togglelocktv'))
	{
		Hue.toggle_lock_tv()
	}

	else if(Hue.oi_equals(cmd2, '/togglelockradio'))
	{
		Hue.toggle_lock_radio()
	}

	else if(Hue.oi_equals(cmd2, '/showimages'))
	{
		Hue.toggle_images(true)
	}

	else if(Hue.oi_equals(cmd2, '/showtv'))
	{
		Hue.toggle_tv(true)
	}

	else if(Hue.oi_equals(cmd2, '/showradio'))
	{
		Hue.toggle_radio(true)
	}

	else if(Hue.oi_equals(cmd2, '/hideimages'))
	{
		Hue.toggle_images(false)
	}

	else if(Hue.oi_equals(cmd2, '/hidetv'))
	{
		Hue.toggle_tv(false)
	}

	else if(Hue.oi_equals(cmd2, '/hideradio'))
	{
		Hue.toggle_radio(false)
	}

	else if(Hue.oi_equals(cmd2, '/toggleimages'))
	{
		Hue.toggle_images()
	}

	else if(Hue.oi_equals(cmd2, '/toggletv'))
	{
		Hue.toggle_tv()
	}

	else if(Hue.oi_equals(cmd2, '/toggleradio'))
	{
		Hue.toggle_radio()
	}

	else if(Hue.oi_equals(cmd2, '/test'))
	{
		Hue.do_test()
	}

	else if(Hue.oi_equals(cmd2, '/maximizeimages'))
	{
		Hue.maximize_images()
	}

	else if(Hue.oi_equals(cmd2, '/maximizetv'))
	{
		Hue.maximize_tv()
	}

	else if(Hue.oi_equals(cmd2, '/starttv'))
	{
		Hue.play_video()
	}

	else if(Hue.oi_equals(cmd2, '/stoptv'))
	{
		Hue.stop_videos()
	}

	else if(Hue.oi_equals(cmd2, '/openimage'))
	{
		Hue.show_current_image_modal()
	}

	else if(Hue.oi_equals(cmd2, '/openlastimage'))
	{
		Hue.show_current_image_modal(false)
	}

	else if(Hue.oi_equals(cmd2, '/date'))
	{
		Hue.show_current_date()
	}

	else if(Hue.oi_startswith(cmd2, '/js'))
	{
		arg = arg.replace(/\s\/endjs/gi, "")
		Hue.execute_javascript(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/js2'))
	{
		arg = arg.replace(/\s\/endjs/gi, "")
		Hue.execute_javascript(arg, false)
	}

	else if(Hue.oi_equals(cmd2, '/changeimage'))
	{
		Hue.show_image_picker()
	}

	else if(Hue.oi_equals(cmd2, '/changetv'))
	{
		Hue.show_tv_picker()
	}

	else if(Hue.oi_equals(cmd2, '/changeradio'))
	{
		Hue.show_radio_picker()
	}

	else if(Hue.oi_equals(cmd2, '/closeall'))
	{
		Hue.close_all_message()
	}

	else if(Hue.oi_equals(cmd2, '/closeallmodals'))
	{
		Hue.close_all_modals()
	}

	else if(Hue.oi_equals(cmd2, '/closeallpopups'))
	{
		Hue.close_all_popups()
	}

	else if(Hue.oi_equals(cmd2, '/activityabove'))
	{
		Hue.activity_above(true)
	}

	else if(Hue.oi_equals(cmd2, '/activityabove2'))
	{
		Hue.activity_above(false)
	}

	else if(Hue.oi_equals(cmd2, '/activitybelow'))
	{
		Hue.activity_below(true)
	}

	else if(Hue.oi_equals(cmd2, '/activitybelow2'))
	{
		Hue.activity_below(false)
	}

	else if(Hue.oi_equals(cmd2, '/globalsettings'))
	{
		Hue.show_global_settings()
	}

	else if(Hue.oi_equals(cmd2, '/roomsettings'))
	{
		Hue.show_room_settings()
	}

	else if(Hue.oi_startswith(cmd2, '/goto'))
	{
		Hue.goto_url(arg, "tab")
	}

	else if(Hue.oi_equals(cmd2, '/toggleplayradio'))
	{
		Hue.toggle_play_radio()
	}

	else if(Hue.oi_equals(cmd2, '/refreshimage'))
	{
		Hue.refresh_image()
	}

	else if(Hue.oi_equals(cmd2, '/refreshtv'))
	{
		Hue.refresh_tv()
	}

	else if(Hue.oi_equals(cmd2, '/refreshradio'))
	{
		Hue.refresh_radio()
	}

	else if(Hue.oi_startswith(cmd2, '/stopradioin'))
	{
		Hue.stop_radio_in(arg)
	}

	else if(Hue.oi_equals(cmd2, '/ping'))
	{
		Hue.ping_server()
	}

	else if(Hue.oi_equals(cmd2, '/reactlike'))
	{
		Hue.send_reaction("like")
	}

	else if(Hue.oi_equals(cmd2, '/reactlove'))
	{
		Hue.send_reaction("love")
	}

	else if(Hue.oi_equals(cmd2, '/reacthappy'))
	{
		Hue.send_reaction("happy")
	}

	else if(Hue.oi_equals(cmd2, '/reactmeh'))
	{
		Hue.send_reaction("meh")
	}

	else if(Hue.oi_equals(cmd2, '/reactsad'))
	{
		Hue.send_reaction("sad")
	}

	else if(Hue.oi_equals(cmd2, '/reactdislike'))
	{
		Hue.send_reaction("dislike")
	}

	else if(Hue.oi_equals(cmd2, '/f1'))
	{
		Hue.run_user_function(1)
		ans.to_history = false
	}

	else if(Hue.oi_equals(cmd2, '/f2'))
	{
		Hue.run_user_function(2)
		ans.to_history = false
	}

	else if(Hue.oi_equals(cmd2, '/f3'))
	{
		Hue.run_user_function(3)
		ans.to_history = false
	}

	else if(Hue.oi_equals(cmd2, '/f4'))
	{
		Hue.run_user_function(4)
		ans.to_history = false
	}

	else if(Hue.oi_equals(cmd2, '/lockscreen'))
	{
		Hue.lock_screen()
	}

	else if(Hue.oi_equals(cmd2, '/unlockscreen'))
	{
		Hue.unlock_screen()
	}

	else if(Hue.oi_equals(cmd2, '/togglelockscreen'))
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

	else if(Hue.oi_equals(cmd2, '/drawimage'))
	{
		Hue.open_draw_image()
	}

	else if(Hue.oi_startswith(cmd2, '/say'))
	{
		Hue.process_message(
		{
			message: arg,
			to_history: ans.to_history,
			clr_input: ans.clr_input
		})
	}

	else if(Hue.oi_startswith(cmd2, '/input'))
	{
		arg = arg.replace(/\s\/endinput/gi, "")
		Hue.change_input(arg)
		ans.to_history = false
		ans.clr_input = false
	}

	else if(Hue.oi_equals(cmd2, '/top'))
	{
		Hue.goto_top(true)
	}
	else if(Hue.oi_equals(cmd2, '/top2'))
	{
		Hue.goto_top(false)
	}

	else if(Hue.oi_equals(cmd2, '/bottom'))
	{
		Hue.goto_bottom(true, true)
	}

	else if(Hue.oi_equals(cmd2, '/bottom2'))
	{
		Hue.goto_bottom(true, false)
	}

	else if(Hue.oi_startswith(cmd2, '/background'))
	{
		Hue.change_background_image_source(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/whatis'))
	{
		Hue.inspect_command(arg)
	}

	else if(Hue.oi_equals(cmd2, '/refresh'))
	{
		Hue.restart_client()
	}

	else if(Hue.oi_startswith(cmd2, '/modifysetting'))
	{
		Hue.modify_setting(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/modifysetting2'))
	{
		Hue.modify_setting(arg, false)
	}

	else if(Hue.oi_startswith(cmd2, '/feedback'))
	{
		Hue.feedback(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/imagesmode'))
	{
		Hue.change_room_images_mode(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/tvmode'))
	{
		Hue.change_room_tv_mode(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/radiomode'))
	{
		Hue.change_room_radio_mode(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/theme'))
	{
		Hue.change_theme(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/thememode'))
	{
		Hue.change_theme_mode(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/textcolormode'))
	{
		Hue.change_text_color_mode(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/textcolor'))
	{
		Hue.change_text_color(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/backgroundmode'))
	{
		Hue.change_background_mode(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/backgroundeffect'))
	{
		Hue.change_background_effect(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/tiledimensions'))
	{
		Hue.change_background_tile_dimensions(arg)
	}

	else if(Hue.oi_equals(cmd2, '/adminactivity'))
	{
		Hue.request_admin_activity()
	}

	else if(Hue.oi_startswith(cmd2, '/adminactivity'))
	{
		Hue.request_admin_activity(arg)
	}

	else if(Hue.oi_equals(cmd2, '/accesslog'))
	{
		Hue.request_access_log()
	}

	else if(Hue.oi_startswith(cmd2, '/accesslog'))
	{
		Hue.request_access_log(arg)
	}

	else if(Hue.oi_equals(cmd2, '/togglefontsize'))
	{
		Hue.toggle_chat_font_size()
	}

	else if(Hue.oi_equals(cmd2, '/adminlist'))
	{
		Hue.request_admin_list()
	}

	else if(Hue.oi_equals(cmd2, '/toggleactivtybar'))
	{
		Hue.toggle_activity_bar()
	}

	else if(Hue.oi_startswith(cmd2, '/synthkey'))
	{
		Hue.send_synth_key(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/synthkeylocal'))
	{
		Hue.play_synth_key(arg)
	}

	else if(Hue.oi_equals(cmd2, '/togglemutesynth'))
	{
		Hue.set_synth_muted()
	}

	else if(Hue.oi_startswith(cmd2, '/speak'))
	{
		Hue.send_synth_voice(arg)
	}

	else if(Hue.oi_startswith(cmd2, '/speaklocal'))
	{
		Hue.play_synth_voice(arg, Hue.username, true)
	}

	else if(Hue.oi_equals(cmd2, '/unmaximize'))
	{
		Hue.unmaximize_media()
	}	

	else
	{
		Hue.feedback(`Invalid command "${cmd.slice(1)}". Maybe it is missing an argument. To start a message with / use //`)
	}

	return ans
}

Hue.change_topic = function(dtopic)
{
	if(Hue.is_admin_or_op())
	{
		dtopic = Hue.utilz.clean_string2(dtopic.substring(0, Hue.max_topic_length))

		if(dtopic.length > 0)
		{
			if(Hue.topic !== dtopic)
			{
				Hue.socket_emit('change_topic', {topic:dtopic})
			}

			else
			{
				Hue.feedback("Topic is already set to that")
			}
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.topicadd = function(arg)
{
	if(Hue.is_admin_or_op())
	{
		arg = Hue.utilz.clean_string2(arg)

		if(arg.length === 0)
		{
			return
		}

		let ntopic = Hue.topic + Hue.topic_separator + arg

		if(ntopic.length > Hue.max_topic_length)
		{
			Hue.feedback("There is no more room to add that to the topic")
			return
		}

		Hue.change_topic(ntopic)
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.topictrim = function(n)
{
	if(Hue.is_admin_or_op())
	{
		let split = Hue.topic.split(Hue.topic_separator)

		if(split.length > 1)
		{
			if(!isNaN(n))
			{
				if(n < 1)
				{
					return false
				}

				if(n > split.length - 1)
				{
					n = split.length - 1
				}
			}

			else
			{
				Hue.feedback("Argument must be a number")
				return false
			}

			if(split.length > 1)
			{
				let t = split.slice(0, -n).join(Hue.topic_separator)

				if(t.length > 0)
				{
					Hue.change_topic(t)
				}
			}
		}

		else
		{
			Hue.feedback("Nothing to trim")
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.topicstart = function(arg)
{
	if(Hue.is_admin_or_op())
	{
		arg = Hue.utilz.clean_string2(arg)

		if(arg.length === 0)
		{
			return
		}

		let ntopic = arg + Hue.topic_separator + Hue.topic

		if(ntopic.length > Hue.max_topic_length)
		{
			Hue.feedback("There is no more room to add that to the topic")
			return
		}

		Hue.change_topic(ntopic)
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.topictrimstart = function(n)
{
	if(Hue.is_admin_or_op())
	{
		let split = Hue.topic.split(Hue.topic_separator)

		if(split.length > 1)
		{
			if(!isNaN(n))
			{
				if(n < 1)
				{
					return false
				}

				if(n > split.length - 1)
				{
					n = split.length - 1
				}
			}

			else
			{
				Hue.feedback("Argument must be a number")
				return false
			}

			if(split.length > 1)
			{
				let t = split.slice(n, split.length).join(Hue.topic_separator)

				if(t.length > 0)
				{
					Hue.change_topic(t)
				}
			}
		}

		else
		{
			Hue.feedback("Nothing to trim")
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.topicedit = function()
{
	Hue.change_input(`/topic ${Hue.topic}`)
}

Hue.announce_topic_change = function(data)
{
	if(data.topic !== Hue.topic)
	{
		let highlight = false

		if(data.topic_setter !== Hue.username)
		{
			if(Hue.check_highlights(data.topic))
			{
				highlight = true
			}
		}

		Hue.public_feedback(`${data.topic_setter} changed the topic to: "${data.topic}"`, 
		{
			highlight: highlight,
			username: data.topic_setter,
			open_profile: true
		})

		Hue.set_topic_info(data)
		Hue.update_title()
	}
}

Hue.announce_room_name_change = function(data)
{
	if(data.name !== Hue.room_name)
	{
		Hue.public_feedback(`${data.username} changed the room name to: "${data.name}"`,
		{
			username: data.username,
			open_profile: true
		})

		Hue.set_room_name(data.name)
		Hue.update_title()
	}
}

Hue.announce_new_username = function(data)
{
	Hue.replace_uname_in_userlist(data.old_username, data.username)

	let show = Hue.check_permission(Hue.get_role(data.username), "chat")

	if(Hue.username === data.old_username)
	{
		Hue.set_username(data.username)

		if(show)
		{
			Hue.public_feedback(`${data.old_username} is now known as ${Hue.username}`,
			{
				username: data.username,
				open_profile: true
			})
		}

		else
		{
			Hue.feedback(`You are now known as ${Hue.username}`,
			{
				username: data.username,
				open_profile: true
			})
		}
	}

	else
	{
		if(show)
		{
			Hue.public_feedback(`${data.old_username} is now known as ${data.username}`,
			{
				username: data.username,
				open_profile: true
			})
		}
	}

	if(Hue.alo)
	{
		Hue.request_admin_list()
	}
}

Hue.goto_top = function(animate=true)
{
	Hue.scroll_chat_to(0, animate)
	Hue.hide_top_scroller()
}

Hue.goto_bottom = function(force=false, animate=true)
{
	let $ch = $("#chat_area")

	let max = $ch.prop('scrollHeight') - $ch.innerHeight()

	if(force)
	{
		Hue.scroll_chat_to(max + 10, animate)
		Hue.hide_top_scroller()
		Hue.hide_bottom_scroller()
	}

	else
	{
		if($('#bottom_scroller_container').css('visibility') === 'hidden')
		{
			Hue.scroll_chat_to(max + 10, animate)
		}
	}
}

Hue.emit_change_image_source = function(url)
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have permission to change images")
		return false
	}

	Hue.socket_emit('change_image_source', {src:url})
}

Hue.get_radio_metadata_enabled = function()
{
	return Hue.loaded_radio_type === "radio" &&
	Hue.radio_get_metadata &&
	Hue.loaded_radio_metadata &&
	Hue.room_radio_mode !== "disabled" &&
	Hue.room_state.radio_enabled
}

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

		$.get(Hue.loaded_radio_metadata, {},

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

						if(source.listenurl.includes(Hue.loaded_radio_source.split('/').pop()))
						{
							if(source.artist !== undefined && source.title !== undefined)
							{
								break
							}
						}
					}
				}

				else if(data.icestats.source.listenurl.includes(Hue.loaded_radio_source.split('/').pop()))
				{
					source = data.icestats.source
				}

				else
				{
					Hue.on_radio_get_metadata_error()
					return false
				}

				if(!source || source.artist === undefined || source.title === undefined)
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

Hue.on_radio_get_metadata_error = function(show_file=true, retry=true)
{
	Hue.radio_get_metadata = false

	if(retry)
	{
		clearTimeout(Hue.radio_metadata_fail_timeout)

		Hue.radio_metadata_fail_timeout = setTimeout(function()
		{
			Hue.radio_get_metadata = true
		}, Hue.radio_retry_metadata_delay)
	}

	if(show_file)
	{
		let s = Hue.loaded_radio_source.split('/')

		if(s.length > 1)
		{
			Hue.push_played(false, {s1: s.pop(), s2:Hue.loaded_radio_source})
		}

		else
		{
			Hue.hide_now_playing()
		}
	}
}

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

Hue.push_played = function(info, info2=false)
{
	let s
	let q
	let q2

	if(info)
	{
		s = `${info.title} - ${info.artist}`
		q = `"${info.title}" by "${info.artist}"`
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
		let title = Hue.nice_date()

		let pi = `
		<div class='played_item_inner pointer inline action' title='${title}'>
			<div class='pititle'></div><div class='piartist'></div>
		</div>`

		let h = $(`<div class='modal_item played_item'>${pi}</div>`)

		if(info)
		{
			h.find('.pititle').eq(0).text(info.title)
			h.find('.piartist').eq(0).text(`by ${info.artist}`)
		}

		else
		{
			h.find('.pititle').eq(0).text(info2.s1)
			h.find('.piartist').eq(0).text(`${info2.s2}`)
		}

		let inner = h.find(".played_item_inner").eq(0)

		inner.data('q', q)
		inner.data('q2', q2)

		$('#played').prepend(h)

		Hue.played.push(s)

		if(Hue.played.length > Hue.played_crop_limit)
		{
			let els = $('#played').children()
			els.slice(els.length - 1, els.length).remove()
			Hue.played.splice(0, 1)
		}

		if(Hue.played_filtered)
		{
			Hue.do_modal_filter()
		}

		Hue.update_modal_scrollbar("played")
	}

	Hue.show_now_playing()
}

Hue.hide_now_playing = function()
{
	$('#header_now_playing_area').css('display', 'none')
}

Hue.show_now_playing = function()
{
	$('#header_now_playing_area').css('display', 'flex')
}

Hue.start_radio = function()
{
	if(Hue.loaded_radio_type === "radio")
	{
		$('#audio').attr("src", Hue.loaded_radio_source)
		$('#audio')[0].play()
	}

	else if(Hue.loaded_radio_type === "youtube")
	{
		if(Hue.youtube_player !== undefined)
		{
			Hue.youtube_player.playVideo()
		}

		else
		{
			return false
		}
	}

	else if(Hue.loaded_radio_type === "soundcloud")
	{
		if(Hue.soundcloud_player !== undefined)
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

	Hue.radio_started = true

	if(Hue.stop_radio_timeout)
	{
		Hue.clear_automatic_stop_radio()
	}

	if(Hue.get_setting("stop_tv_on_radio_play"))
	{
		Hue.stop_videos(false)
	}
}

Hue.stop_radio = function()
{
	$('#audio').attr("src", "")

	if(Hue.youtube_player !== undefined)
	{
		Hue.youtube_player.pauseVideo()
	}

	if(Hue.soundcloud_player !== undefined)
	{
		Hue.soundcloud_player.pause()
	}

	$('#header_radio_playing_icon').css('display', 'none')
	$('#header_radio_volume_area').css('display', 'none')
	$('#toggle_now_playing_text').html('Start Radio')

	Hue.radio_started = false

	if(Hue.stop_radio_timeout)
	{
		Hue.clear_automatic_stop_radio()
	}
}

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

Hue.toggle_radio_state = function()
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

Hue.start_metadata_loop = function()
{
	setInterval(function()
	{
		if(Hue.get_radio_metadata_enabled())
		{
			Hue.get_radio_metadata()
		}
	}, Hue.radio_metadata_interval_duration)
}

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
			Hue.volume_increase()
		}

		else if(direction === 'down')
		{
			Hue.volume_decrease()
		}
	})
}

Hue.set_radio_volume = function(nv=false, changed=true)
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

	let vt = parseInt(Math.round((nv * 100)))

	$('#audio')[0].volume = Hue.room_state.radio_volume

	if(Hue.youtube_player !== undefined)
	{
		Hue.youtube_player.setVolume(vt)
		Hue.youtube_player.unMute()
	}

	if(Hue.soundcloud_player !== undefined)
	{
		Hue.soundcloud_player.setVolume(vt)
	}

	if(changed)
	{
		$('#volume').text(`${vt} %`)
		Hue.save_room_state()
	}
}

Hue.set_tv_volume = function(nv=false)
{
	nv = Hue.utilz.round(nv, 1)

	if(nv > 1)
	{
		nv = 1
	}

	else if(nv < 0)
	{
		nv = 0
	}

	let vt = parseInt(Math.round((nv * 100)))

	$('#media_video')[0].volume = nv

	if(Hue.youtube_video_player !== undefined)
	{
		Hue.youtube_video_player.setVolume(vt)
	}

	if(Hue.twitch_video_player !== undefined)
	{
		Hue.twitch_video_player.setVolume(nv)
	}
}

Hue.volume_increase = function()
{
	if(Hue.room_state.radio_volume === 1)
	{
		return false
	}

	let nv = Hue.room_state.radio_volume + 0.1

	Hue.set_radio_volume(nv)
}

Hue.volume_decrease = function()
{
	if(Hue.room_state.radio_volume === 0)
	{
		return false
	}

	let nv = Hue.room_state.radio_volume - 0.1

	Hue.set_radio_volume(nv)
}

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

Hue.sound_notify = function(type)
{
	if(!Hue.started)
	{
		return false
	}

	let sound

	if(!Hue.app_focused)
	{

		if(type === "message")
		{
			if(!Hue.get_setting("beep_on_messages"))
			{
				return false
			}

			if(Hue.afk)
			{
				if(Hue.get_setting("afk_disable_messages_beep"))
				{
					return false
				}
			}

			sound = "pup"
		}

		else if(type === "media_change")
		{
			if(!Hue.get_setting("beep_on_media_change"))
			{
				return false
			}

			if(Hue.afk)
			{
				if(Hue.get_setting("afk_disable_media_change_beep"))
				{
					return false
				}
			}

			sound = "pup"
		}

		else if(type === "highlight")
		{
			if(!Hue.get_setting("beep_on_highlights"))
			{
				return false
			}

			if(Hue.afk)
			{
				if(Hue.get_setting("afk_disable_highlights_beep"))
				{
					return false
				}
			}

			sound = "highlight"
		}

		else if(type === "join")
		{
			if(!Hue.get_setting("beep_on_user_joins"))
			{
				return false
			}

			if(Hue.afk)
			{
				if(Hue.get_setting("afk_disable_joins_beep"))
				{
					return false
				}
			}

			sound = "join"
		}

		else
		{
			return false
		}
	}

	else
	{
		return false
	}

	Hue.play_audio(sound)
}

Hue.alert_title = function()
{
	if(!Hue.started)
	{
		return false
	}

	if(!Hue.app_focused)
	{
		if(Hue.alert_mode === 0)
		{
			Hue.alert_mode = 1
			Hue.update_title()
		}
	}
}

Hue.alert_title2 = function()
{
	if(!Hue.started)
	{
		return false
	}

	if(!Hue.app_focused)
	{
		if(Hue.alert_mode !== 2)
		{
			Hue.alert_mode = 2
			Hue.update_title()
		}
	}
}

Hue.remove_alert_title = function()
{
	if(Hue.alert_mode > 0)
	{
		Hue.alert_mode = 0
		Hue.update_title()
	}
}

Hue.set_title = function(s)
{
	document.title = s.substring(0, Hue.max_title_length)
}

Hue.update_title = function()
{
	let t = ""

	if(Hue.alert_mode === 1)
	{
		t += "(*) "
	}

	else if(Hue.alert_mode === 2)
	{
		t += "(!) "
	}

	t += Hue.room_name

	if(Hue.topic !== '')
	{
		t += ` ${Hue.title_separator} ${Hue.topic}`
	}

	Hue.set_title(t)
}

Hue.activate_visibility_listener = function()
{
	document.addEventListener("visibilitychange", function()
	{
		Hue.process_visibility()

	}, false)

	window.onblur = function()
	{
		Hue.keys_pressed = {}
	}
}

Hue.process_visibility = function()
{
	if(Hue.room_state.screen_locked && Hue.get_setting("afk_on_lockscreen"))
	{
		return false
	}

	Hue.app_focused = !document.hidden

	if(Hue.app_focused)
	{
		Hue.on_app_focused()
	}

	else
	{
		Hue.on_app_unfocused()
	}	
}

Hue.on_app_focused = function()
{
	if(Hue.afk_timer !== undefined)
	{
		clearTimeout(Hue.afk_timer)
	}

	Hue.afk = false

	Hue.remove_alert_title()

	if(Hue.change_image_when_focused)
	{
		Hue.change({type:"image"})
		Hue.change_image_when_focused = false
	}

	if(Hue.change_tv_when_focused)
	{
		Hue.change({type:"tv"})
		Hue.change_tv_when_focused = false
	}

	if(Hue.change_radio_when_focused)
	{
		Hue.change({type:"radio"})
		Hue.change_radio_when_focused = false
	}

	Hue.trigger_activity()
}

Hue.on_app_unfocused = function()
{
	if(Hue.get_setting("afk_delay") !== "never")
	{
		Hue.afk_timer = setTimeout(function()
		{
			Hue.afk = true
		}, Hue.get_setting("afk_delay"))
	}

	Hue.remove_separator(false)
	Hue.update_chat_scrollbar()
	Hue.check_scrollers()
}

Hue.copy_room_url = function()
{
	let r

	if(Hue.room_id === Hue.main_room_id)
	{
		r = ''
	}

	else
	{
		r = '/' + Hue.room_id
	}

	let url = window.location.origin + r

	Hue.copy_string(url)
}

Hue.copy_string = function(s, sound=true)
{
	let textareaEl = document.createElement('textarea')

	document.body.appendChild(textareaEl)

	textareaEl.value = s
	textareaEl.select()

	document.execCommand('copy')
	document.body.removeChild(textareaEl)
	
	if(sound)
	{
		Hue.play_audio("pup2")	
	}
}

Hue.play_audio = function(what)
{
	$(`#audio_${what}`)[0].play()
}

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

Hue.create_room = function(data)
{
	Hue.msg_info2.close(function()
	{
		Hue.socket_emit('create_room', data)
	})
}

Hue.restart_client = function()
{
	Hue.user_leaving = true
	window.location = window.location
}

Hue.get_nice_volume = function(volume)
{
	return parseInt(Math.round((volume * 100)))
}

Hue.chat_search_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.chat_search($("#chat_search_filter").val())
		}, Hue.filter_delay)
	}
})()

Hue.show_chat_search = function(filter=false)
{
	Hue.msg_chat_search.show(function()
	{
		if(filter)
		{
			Hue.chat_search(filter)
		}
	})
}

Hue.reset_chat_search_filter = function()
{
	$("#chat_search_filter").val("")
	Hue.chat_search()
}

Hue.chat_search = function(filter=false)
{
	if(filter)
	{
		sfilter = filter
	}

	else
	{
		sfilter = ''
	}

	$("#chat_search_filter").val(sfilter)
	$("#chat_search_filter").focus()

	if(!filter)
	{
		$("#chat_search_container").html("Search for chat messages")
		Hue.update_modal_scrollbar("chat_search")
		return
	}

	let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()

	let words = lc_value.split(" ")

	let c = $("<div></div>")

	if(Hue.chat_history.length > 0)
	{
		for(let message of Hue.chat_history.slice(0).reverse())
		{
			let show = true
			let huname = message.find('.chat_uname').eq(0)
			let hcontent = message.find('.chat_content')
			let text = message.text().toLowerCase()

			for(let word of words)
			{
				if(!text.includes(word))
				{
					show = false
					break
				}
			}

			if(!show)
			{
				continue
			}

			if(huname.length !== 0 && hcontent.length !== 0)
			{
				let cn = $(`
				<div class='chat_search_result_item jump_button_container'>
					<div class='chat_search_result_uname generic_uname inline action'></div>
					<div class='chat_search_result_content'></div>
					<div class='jump_button action unselectable'>Jump</div>
				</div>`)

				cn.find(".chat_search_result_uname").eq(0).text(huname.text())
				cn.find(".chat_search_result_content").eq(0).html(hcontent.clone(true, true))
				cn.data("message_id", message.data("message_id"))
				c.append(cn)
			}

			else
			{
				let hcontent = message.find(".announcement_content").eq(0)

				if(hcontent.length === 0)
				{
					continue
				}

				let content = hcontent.text()

				let cn = $(`
				<div class='chat_search_result_item jump_button_container'>
					<div class='chat_search_result_content'></div>
					<div class='jump_button action unselectable'>Jump</div>
				</div>`)

				cn.find(".chat_search_result_content").eq(0).html(hcontent.parent().clone(true, true))
				cn.data("message_id", message.data("message_id"))
				c.append(cn)
			}
		}
	}

	if(c.find(".chat_search_result_item").length === 0)
	{
		c = "No results"
	}

	else
	{
		c = c[0]
	}

	$("#chat_search_container").html(c)

	Hue.update_modal_scrollbar("chat_search")

	$('#Msg-content-container-search').scrollTop(0)
}

Hue.fix_chat_scroll = function()
{
	$("#chat_area").find(".ps__rail-x").eq(0).prependTo("#chat_area")
	$("#chat_area").find(".ps__rail-y").eq(0).prependTo("#chat_area")
}

Hue.chat_scroll_bottom = function(force=true, animate=true)
{
	Hue.update_chat_scrollbar()
	Hue.fix_chat_scroll()
	Hue.goto_bottom(force, animate)
}

Hue.clear_chat = function()
{
	$('#chat_area').html('<div><br><br><br><br></div>')

	Hue.show_log_messages()
	Hue.update_chat_scrollbar()
	Hue.goto_bottom(true)
	Hue.focus_input()
}

Hue.unclear_chat = function()
{
	Hue.clear_chat()

	if(Hue.chat_history.length === 0)
	{
		return false
	}

	for(let el of Hue.chat_history)
	{
		Hue.add_to_chat({message:el.clone(true, true), save:false, notify:false, fader:false})
	}

	Hue.chat_scroll_bottom()
}

Hue.clear_input = function()
{
	Hue.change_input("")
	Hue.old_input_val = ""
}

Hue.add_to_input = function(what)
{
	Hue.change_input(`${$('#input').val() + what}`)
}

Hue.set_topic_info = function(data)
{
	if(!data)
	{
		data = {}

		data.topic = ""
		data.topic_setter = ""
		data.topic_date = ""
	}

	Hue.topic = data.topic
	Hue.topic_setter = data.topic_setter
	Hue.topic_date = Hue.nice_date(data.topic_date)

	if(Hue.topic)
	{
		$("#header_topic_text").text(Hue.topic)
	}

	else
	{
		let t = Hue.get_unset_topic()

		$("#header_topic_text").text(t)
	}

	Hue.config_admin_topic()
}

Hue.check_firstime = function()
{
	if(Hue.get_local_storage(Hue.ls_first_time) === null)
	{
		Hue.first_time = true

		Hue.show_intro()

		Hue.save_local_storage(Hue.ls_first_time, false)
	}

	else
	{
		Hue.first_time = false
	}
}

Hue.big_letter = function(s)
{
	return s.toUpperCase()[0]
}

Hue.change_role = function(uname, rol)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.max_max_username_length)
		{
			if(uname === Hue.username)
			{
				Hue.feedback("You can't assign a role to yourself")
				return false
			}

			if((rol === 'admin' || rol === 'op') && Hue.role !== 'admin')
			{
				Hue.forbiddenuser()
				return false
			}

			if(!Hue.roles.includes(rol))
			{
				Hue.feedback("Invalid role")
				return false
			}

			Hue.socket_emit('change_role', {username:uname, role:rol})
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.show_upload_error = function()
{
	Hue.feedback("The image could not be uploaded")
}

Hue.announce_role_change = function(data)
{
	if(Hue.username === data.username2)
	{
		Hue.set_role(data.role)
	}

	Hue.public_feedback(`${data.username1} gave ${data.role} to ${data.username2}`,
	{
		username: data.username1,
		open_profile: true
	})

	Hue.replace_role_in_userlist(data.username2, data.role)

	if(Hue.alo)
	{
		Hue.request_admin_list()
	}
}

Hue.set_role = function(rol, config=true)
{
	Hue.role = rol

	Hue.check_permissions()

	if(config)
	{
		Hue.config_main_menu()
	}
}

Hue.change_privacy = function(what)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	if(Hue.is_public === what)
	{
		if(what)
		{
			Hue.feedback("Room is already public")
		}

		else
		{
			Hue.feedback("Room is already private")
		}

		return false
	}

	Hue.socket_emit('change_privacy', {what:what})
}

Hue.announce_privacy_change = function(data)
{
	Hue.set_privacy(data.what)

	let s

	if(Hue.is_public)
	{
		s = `${data.username} made the room public`
		s += ". The room will appear in the public room list"
	}

	else
	{
		s = `${data.username} made the room private`
		s += ". The room won't appear in the public room list"
	}

	Hue.public_feedback(s,
	{
		username: data.username,
		open_profile: true
	})
}

Hue.change_radio_source = function(src)
{
	if(!Hue.can_radio)
	{
		Hue.feedback("You don't have permission to change the radio")
		return false
	}

	if(src.length === 0)
	{
		return false
	}

	src = Hue.utilz.clean_string2(src)

	if(src.length > Hue.max_radio_source_length)
	{
		return false
	}

	if(src.startsWith("/"))
	{
		return false
	}

	if(src === Hue.current_radio().source || src === Hue.current_radio().query)
	{
		Hue.feedback("Radio is already set to that")
		return false
	}

	else if(src === "default")
	{
		Hue.socket_emit('change_radio_source', {src:"default"})
		return
	}

	else if(src === "prev" || src === "previous")
	{
		if(Hue.radio_changed.length > 1)
		{
			src = Hue.radio_changed[Hue.radio_changed.length - 2].source
		}

		else
		{
			Hue.feedback("No radio source before current one")
			return false
		}
	}

	if(src.startsWith("http://") || src.startsWith("https://"))
	{
		if(Hue.check_domain_list("radio", src))
		{
			Hue.feedback("Radio sources from that domain are not allowed")
			return false
		}

		if(src.includes("youtube.com") || src.includes("youtu.be"))
		{
			if(!Hue.youtube_enabled)
			{
				Hue.feedback("YouTube support is not enabled")
				return
			}
		}

		else if(src.includes("soundcloud.com"))
		{
			if(!Hue.soundcloud_enabled)
			{
				Hue.feedback("Soundcloud support is not enabled")
				return
			}
		}

		else
		{
			let extension = Hue.utilz.get_extension(src).toLowerCase()

			if(extension)
			{
				if(!Hue.utilz.audio_extensions.includes(extension))
				{
					Hue.feedback("That doesn't seem to be an audio")
					return false
				}
			}
		}
	}

	else if(src !== "restart" && src !== "reset")
	{
		if(!Hue.youtube_enabled)
		{
			Hue.feedback("Invalid radio source")
			return
		}
	}

	Hue.socket_emit('change_radio_source', {src:src})
}

Hue.change_tv_source = function(src)
{
	if(!Hue.can_tv)
	{
		Hue.feedback("You don't have permission to change the tv")
		return false
	}

	if(src.length === 0)
	{
		return false
	}

	src = Hue.utilz.clean_string2(src)

	if(src.length > Hue.max_tv_source_length)
	{
		return false
	}

	if(src.startsWith("/"))
	{
		return false
	}

	if(src === Hue.current_tv().source || src === Hue.current_tv().query)
	{
		Hue.feedback("TV is already set to that")
		return false
	}

	else if(src === "default")
	{
		Hue.socket_emit('change_tv_source', {src:"default"})
		return
	}

	else if(src === "prev" || src === "previous")
	{
		if(Hue.tv_changed.length > 1)
		{
			src = Hue.tv_changed[Hue.tv_changed.length - 2].source
		}

		else
		{
			Hue.feedback("No tv source before current one")
			return false
		}
	}

	if(src.startsWith("http://") || src.startsWith("https://"))
	{
		if(Hue.check_domain_list("tv", src))
		{
			Hue.feedback("TV sources from that domain are not allowed")
			return false
		}

		if(src.includes("youtube.com") || src.includes("youtu.be"))
		{
			if(Hue.utilz.get_youtube_id(src) && !Hue.youtube_enabled)
			{
				Hue.feedback("YouTube support is not enabled")
				return
			}
		}

		else if(src.includes("twitch.tv"))
		{
			if(Hue.utilz.get_twitch_id(src) && !Hue.twitch_enabled)
			{
				Hue.feedback("Twitch support is not enabled")
				return
			}
		}

		else if(src.includes("soundcloud.com"))
		{
			if(!Hue.soundcloud_enabled)
			{
				Hue.feedback("Soundcloud support is not enabled")
				return
			}
		}

		else
		{
			let extension = Hue.utilz.get_extension(src).toLowerCase()

			if(extension)
			{
				if(Hue.utilz.image_extensions.includes(extension))
				{
					Hue.feedback("That doesn't seem to be a video")
					return false
				}
			}
		}
	}

	else if(src !== "restart" && src !== "reset")
	{
		if(!Hue.youtube_enabled)
		{
			Hue.feedback("YouTube support is not enabled")
			return
		}
	}

	Hue.socket_emit('change_tv_source', {src:src})
}

Hue.ban = function(uname)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.max_max_username_length)
		{
			if(uname === Hue.username)
			{
				Hue.feedback("You can't ban yourself")
				return false
			}

			Hue.socket_emit('ban', {username:uname})
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.unban = function(uname)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.max_max_username_length)
		{
			if(uname === Hue.username)
			{
				Hue.feedback("You can't unban yourself")
				return false
			}

			Hue.socket_emit('unban', {username:uname})
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.unban_all = function()
{
	if(Hue.is_admin_or_op())
	{
		Hue.socket_emit('unban_all', {})
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.get_banned_count = function()
{
	if(Hue.is_admin_or_op())
	{
		Hue.socket_emit('get_banned_count', {})
	}
}

Hue.receive_banned_count = function(data)
{
	let s

	if(data.count === 1)
	{
		s = `There is ${data.count} user banned`
	}

	else
	{
		s = `There are ${data.count} users banned`
	}

	Hue.msg_info.show(s)
}

Hue.kick = function(uname)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.max_max_username_length)
		{
			if(uname === Hue.username)
			{
				Hue.feedback("You can't kick yourself")
				return false
			}

			if(!Hue.usernames.includes(uname))
			{
				Hue.user_not_in_room()
				return false
			}

			let rol = Hue.get_role(uname)

			if((rol === 'admin' || rol === 'op') && Hue.role !== 'admin')
			{
				Hue.forbiddenuser()
				return false
			}

			Hue.socket_emit('kick', {username:uname})
		}
	}

	else
	{
		Hue.not_an_op()
	}
}

Hue.announce_unban_all = function(data)
{
	Hue.public_feedback(`${data.username} unbanned all banned users`,
	{
		username: data.username,
		open_profile: true
	})
}

Hue.isalready = function(who, what)
{
	if(what === 'voice1')
	{
		Hue.feedback(`${who} already has voice 1`)
	}

	else if(what === 'voice2')
	{
		Hue.feedback(`${who} already has voice 2`)
	}

	else if(what === 'voice3')
	{
		Hue.feedback(`${who} already has voice 3`)
	}

	else if(what === 'voice4')
	{
		Hue.feedback(`${who} already has voice 4`)
	}

	else if(what === 'op')
	{
		Hue.feedback(`${who} is already an op`)
	}

	else if(what === 'admin')
	{
		Hue.feedback(`${who} is already an admin`)
	}
}

Hue.forbiddenuser = function()
{
	Hue.feedback("That operation is forbidden on that user")
}

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

Hue.reset_voices = function()
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit('reset_voices', {})
}

Hue.remove_ops = function()
{
	if(Hue.role !== 'admin')
	{
		Hue.feedback("You are not a room admin")
		return false
	}

	Hue.socket_emit('remove_ops', {})
}

Hue.announce_voices_resetted = function(data)
{
	Hue.public_feedback(`${data.username} resetted the voices`,
	{
		username: data.username,
		open_profile: true
	})

	if(Hue.role.startsWith('voice') && Hue.role !== "voice1")
	{
		Hue.set_role("voice1")
	}

	Hue.reset_voices_userlist()
}

Hue.announce_removedops = function(data)
{
	Hue.public_feedback(`${data.username} removed all ops`,
	{
		username: data.username,
		open_profile: true
	})

	if(Hue.role === 'op')
	{
		Hue.set_role("voice1")
	}

	Hue.remove_ops_userlist()

	if(Hue.alo)
	{
		Hue.request_admin_list()
	}
}

Hue.userdisconnect = function(data)
{
	let type = data.disconnection_type

	if(type === "disconnection")
	{
		Hue.start_user_disconnect_timeout(data)
	}

	else
	{
		Hue.do_userdisconnect(data)
	}
}

Hue.clear_from_users_to_disconnect = function(data)
{
	for(let i=0; i<Hue.users_to_disconnect.length; i++)
	{
		let u = Hue.users_to_disconnect[i]

		if(u.username === data.username)
		{
			clearTimeout(u.timeout)
			Hue.users_to_disconnect.splice(i, 1)
			break
		}
	}
}

Hue.start_user_disconnect_timeout = function(data)
{
	Hue.clear_from_users_to_disconnect(data)

	data.timeout = setTimeout(function()
	{
		Hue.do_userdisconnect(data)
	}, Hue.disconnect_timeout_delay)

	Hue.users_to_disconnect.push(data)
}

Hue.do_userdisconnect = function(data)
{
	Hue.clear_from_users_to_disconnect(data)
	Hue.removefrom_userlist(data.username)
	Hue.update_activity_bar()

	if(Hue.get_setting("show_parts") && Hue.check_permission(data.role, "chat"))
	{
		let type = data.disconnection_type

		let s

		if(type === "disconnection")
		{
			s = `${data.username} has left`
		}

		else if(type === "pinged")
		{
			s = `${data.username} has left (Ping Timeout)`
		}

		else if(type === "kicked")
		{
			s = `${data.username} was kicked by ${data.info1}`
		}

		else if(type === "banned")
		{
			s = `${data.username} was banned by ${data.info1}`
		}

		Hue.public_feedback(s,
		{
			brk: "<i class='icon2c fa fa-sign-out'></i>",
			save: true,
			username: data.username
		})
	}
}

Hue.start_msg = function()
{
	let common =
	{
		show_effect_duration: [200, 200],
		close_effect_duration: [200, 200],
		clear_editables: true,
		before_show: function(instance)
		{
			if(Hue.room_state.screen_locked)
			{
				if(instance.options.id !== "lockscreen")
				return false
			}
		}
	}

	if(Hue.get_setting("modal_effects"))
	{
		common.show_effect = "fade"
		common.close_effect = "fade"
	}

	else
	{
		common.show_effect = "none"
		common.close_effect = "none"
	}

	let titlebar =
	{
		enable_titlebar: true,
		center_titlebar: true,
		titlebar_class: "!custom_titlebar !unselectable",
		window_inner_x_class: "!titlebar_inner_x"
	}

	Hue.msg_main_menu = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "main_menu",
			window_width: "22em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.close_togglers("main_menu")
			}
		})
	)

	Hue.msg_user_menu = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "user_menu",
			clear_editables: false,
			window_width: "22em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.close_togglers("user_menu")
			}
		})
	)

	Hue.msg_userlist = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "userlist",
			window_width: "22em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_public_roomlist = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "public_roomlist",
			window_width: "26em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_visited_roomlist = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "visited_roomlist",
			window_width: "26em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_played = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "played",
			window_width: "26em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_modal_image = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "modal_image",
			preset: "window",
			overlay_class: "!overlay_same_color",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.modal_image_open = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.clear_modal_image_info()
				Hue.msg_modal_image_number.close()
				Hue.modal_image_open = false
			}
		})
	)

	Hue.msg_modal_image_number = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "modal_image_number",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.minpo = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.minpo = false
			}
		})
	)

	Hue.msg_lockscreen = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "lockscreen",
			preset: "window",
			overlay_class: "!overlay_same_color",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_profile = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "profile",
			window_width: "22em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)

				$("#show_profile_uname").text("Loading")
				$("#show_profile_image").attr("src", Hue.profile_image_loading_url)
			}
		})
	)

	Hue.msg_info = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "info",
			window_height: "auto",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			before_show: function(instance)
			{
				Hue.info_vars_to_false()
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				instance.content.innerHTML = ""
				Hue.info_vars_to_false()
			}
		})
	)

	Hue.msg_info2 = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "info2",
			window_height: "auto",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			before_show: function(instance)
			{
				Hue.info2_vars_to_false()
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				instance.content.innerHTML = ""
				instance.titlebar.innerHTML = ""
				Hue.info2_vars_to_false()
			}
		})
	)

	Hue.msg_image_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "image_picker",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.iup = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				$("#image_source_picker_input").val("")
				Hue.iup = false
			}
		})
	)

	Hue.msg_tv_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "tv_picker",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.tup = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				$("#tv_source_picker_input").val("")
				Hue.tup = false
			}
		})
	)

	Hue.msg_radio_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "radio_picker",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.rup = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				$("#radio_source_picker_input").val("")
				Hue.rup = false
			}
		})
	)

	Hue.msg_media_menu = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "media_menu",
			window_width: "22em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_message = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "message",
			close_on_overlay_click: false,
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.writing_message = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				$("#write_message_area").val("")
				$("#write_message_feedback").text("")
				$("#write_message_feedback").css("display", "none")
				Hue.after_modal_close(instance)
				Hue.writing_message = false
				Hue.clear_draw_message_state()
			}
		})
	)

	Hue.msg_highlights = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "highlights",
			window_width: "24em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				$("#highlights_filter").val("")
			}
		})
	)

	Hue.msg_image_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "image_history",
			window_width: "24em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_tv_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "tv_history",
			window_width: "24em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_radio_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "radio_history",
			window_width: "24em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_input_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "input_history",
			window_width: "24em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_chat_search = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "chat_search",
			window_width: "24em",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.reset_chat_search_filter()
			}
		})
	)

	Hue.msg_locked = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "locked",
			closeable: false,
			window_x: "none",
			show_effect: "none",
			close_effect: "none",
			enable_overlay: true,
			window_class: "!no_effects",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_global_settings = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "global_settings",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.close_togglers("global_settings")
			}
		})
	)

	Hue.msg_room_settings = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "room_settings",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.close_togglers("room_settings")
			}
		})
	)

	Hue.msg_draw_image = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "draw_image",
			close_on_overlay_click: false,
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
				Hue.draw_image_open = true
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.draw_image_open = false
			}
		})
	)

	Hue.msg_credits = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "credits",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				if(Hue.credits_audio)
				{
					Hue.credits_audio.pause()
				}
			}
		})
	)

	Hue.msg_help = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "help",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_admin_activity = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "admin_activity",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_access_log = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "access_log",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
			}
		})
	)

	Hue.msg_expand_image = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "expand_image",
			preset: "window",
			overlay_class: "!overlay_same_color",
			after_create: function(instance)
			{
				Hue.after_modal_create(instance)
			},
			after_show: function(instance)
			{
				Hue.after_modal_show(instance)
				Hue.after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				Hue.after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				Hue.after_modal_close(instance)
				Hue.clear_modal_image_info()
			}
		})
	)

	Hue.msg_main_menu.set(Hue.template_main_menu())
	Hue.msg_user_menu.set(Hue.template_user_menu())
	Hue.msg_userlist.set(Hue.template_userlist())
	Hue.msg_public_roomlist.set(Hue.template_roomlist({type:"public_roomlist"}))
	Hue.msg_visited_roomlist.set(Hue.template_roomlist({type:"visited_roomlist"}))
	Hue.msg_played.set(Hue.template_played())
	Hue.msg_profile.set(Hue.template_profile({profile_image: Hue.profile_image_loading_url}))
	Hue.msg_image_picker.set(Hue.template_image_picker())
	Hue.msg_tv_picker.set(Hue.template_tv_picker())
	Hue.msg_radio_picker.set(Hue.template_radio_picker())
	Hue.msg_media_menu.set(Hue.template_media_menu())
	Hue.msg_message.set(Hue.template_message())
	Hue.msg_highlights.set(Hue.template_highlights())
	Hue.msg_image_history.set(Hue.template_image_history())
	Hue.msg_tv_history.set(Hue.template_tv_history())
	Hue.msg_radio_history.set(Hue.template_radio_history())
	Hue.msg_input_history.set(Hue.template_input_history())
	Hue.msg_chat_search.set(Hue.template_chat_search())
	Hue.msg_modal_image.set(Hue.template_modal_image())
	Hue.msg_modal_image_number.set(Hue.template_modal_image_number())
	Hue.msg_lockscreen.set(Hue.template_lockscreen())
	Hue.msg_locked.set(Hue.template_locked_menu())
	Hue.msg_global_settings.set(Hue.template_global_settings({settings:Hue.template_settings({type:"global_settings"})}))
	Hue.msg_room_settings.set(Hue.template_room_settings({settings:Hue.template_settings({type:"room_settings"})}))
	Hue.msg_draw_image.set(Hue.template_draw_image())
	Hue.msg_credits.set(Hue.template_credits({background_url:Hue.credits_background_url}))
	Hue.msg_help.set(Hue.template_help())
	Hue.msg_admin_activity.set(Hue.template_admin_activity())
	Hue.msg_access_log.set(Hue.template_access_log())
	Hue.msg_expand_image.set(Hue.template_expand_image())

	Hue.msg_info.create()
	Hue.msg_info2.create()

	Hue.msg_input_history.set_title("Input History")
	Hue.msg_highlights.set_title("Highlights")
	Hue.msg_chat_search.set_title("Search")
	Hue.msg_image_history.set_title("<span id='image_history_window_title' class='pointer'>Image History</span>")
	Hue.msg_tv_history.set_title("<span id='tv_history_window_title' class='pointer'>TV History</span>")
	Hue.msg_radio_history.set_title("<span id='radio_history_window_title' class='pointer'>Radio History</span>")
	Hue.msg_global_settings.set_title("<span id='global_settings_window_title' class='pointer'>Global Settings</span>")
	Hue.msg_room_settings.set_title("<span id='room_settings_window_title' class='pointer'>Room Settings</span>")
	Hue.msg_public_roomlist.set_title("<span id='public_rooms_window_title' class='pointer'>Public Rooms</span>")
	Hue.msg_visited_roomlist.set_title("<span id='visited_rooms_window_title' class='pointer'>Visited Rooms</span>")
	Hue.msg_played.set_title("Recently Played")
	Hue.msg_main_menu.set_title("<span id='main_menu_window_title' class='pointer'>Main Menu</span>")
	Hue.msg_user_menu.set_title("<span id='user_menu_window_title' class='pointer'>User Menu</span>")
	Hue.msg_media_menu.set_title("Media Menu")
	Hue.msg_draw_image.set_title("Draw an Image")
	Hue.msg_credits.set_title(Hue.credits_title)
	Hue.msg_admin_activity.set_title("Admin Activity")
	Hue.msg_access_log.set_title("Access Log")

	$("#global_settings_window_title").click(function()
	{
		Hue.toggle_settings_windows("room_settings")
	})

	$("#room_settings_window_title").click(function()
	{
		Hue.toggle_settings_windows("global_settings")
	})

	$("#public_rooms_window_title").click(function()
	{
		Hue.toggle_rooms_windows("visited_roomlist")
	})

	$("#visited_rooms_window_title").click(function()
	{
		Hue.toggle_rooms_windows("public_roomlist")
	})

	$("#image_history_window_title").click(function()
	{
		Hue.toggle_media_history_windows("tv_history")
	})

	$("#tv_history_window_title").click(function()
	{
		Hue.toggle_media_history_windows("radio_history")
	})

	$("#radio_history_window_title").click(function()
	{
		Hue.toggle_media_history_windows("image_history")
	})

	$("#main_menu_window_title").click(function()
	{
		Hue.toggle_menu_windows("user_menu")
	})

	$("#user_menu_window_title").click(function()
	{
		Hue.toggle_menu_windows("main_menu")
	})
}

Hue.info_vars_to_false = function()
{

}

Hue.info2_vars_to_false = function()
{
	Hue.crm = false
	Hue.imp = false
	Hue.gtr = false
	Hue.orb = false
	Hue.biu = false
	Hue.alo = false
}

Hue.after_modal_create = function(instance)
{
	if(Hue.get_setting("custom_scrollbars"))
	{
		Hue.start_modal_scrollbar(instance.options.id)
	}
}

Hue.after_modal_show = function(instance)
{
	Hue.active_modal = instance
	Hue.modal_open = true
	Hue.blur_input()
	Hue.focus_modal_filter(instance)
}

Hue.focus_modal_filter = function(instance)
{
	let filter = $(`#Msg-content-${instance.options.id} .filter_input`).eq(0)

	if(filter.length)
	{
		filter.focus()
	}
}

Hue.reset_modal_filter = function(instance)
{
	let id = instance.options.id

	if(id === "info" || id === "info2" || id === "chat_search")
	{
		return false
	}

	let filter = $(`#Msg-content-${id} .filter_input`).eq(0)

	if(filter.length)
	{
		if(filter.val())
		{
			filter.val("")
			Hue.do_modal_filter(id)
		}
	}
}

Hue.after_modal_set_or_show = function(instance)
{
	Hue.update_modal_scrollbar(instance.options.id)

	setTimeout(function()
	{
		if(instance.options.id === "global_settings" || instance.options.id === "room_settings")
		{
			$(`#settings_window_${instance.options.id} .settings_window_category_container_selected`).get(0).scrollTop = 0
			$(`#settings_window_left_content_${instance.options.id}`).get(0).scrollTop = 0
		}

		else
		{
			instance.content_container.scrollTop = 0
		}
	}, 100)
}

Hue.after_modal_close = function(instance)
{
	if(!Hue.any_modal_open())
	{
		Hue.active_modal = false
		Hue.modal_open = false
		Hue.focus_input()
	}

	Hue.reset_modal_filter(instance)
}

Hue.get_modal_instances = function()
{
	return Hue.msg_main_menu.higher_instances()
}

Hue.get_popup_instances = function()
{
	return Hue.msg_main_menu.lower_instances()
}

Hue.get_all_msg_instances = function()
{
	return Hue.msg_main_menu.instances()
}

Hue.any_msg_open = function()
{
	return Hue.msg_main_menu.any_open()
}

Hue.any_modal_open = function()
{
	return Hue.msg_main_menu.any_higher_open()
}

Hue.any_popup_open = function()
{
	return Hue.msg_main_menu.any_lower_open()
}

Hue.close_all_msg = function(callback=false)
{
	if(callback)
	{
		Hue.msg_main_menu.close_all(callback)
	}

	else
	{
		Hue.msg_main_menu.close_all()
	}
}

Hue.close_all_modals = function(callback=false)
{
	if(callback)
	{
		Hue.msg_main_menu.close_all_higher(callback)
	}

	else
	{
		Hue.msg_main_menu.close_all_higher()
	}
}

Hue.close_all_popups = function(callback=false)
{
	if(callback)
	{
		Hue.msg_main_menu.close_all_lower(callback)
	}

	else
	{
		Hue.msg_main_menu.close_all_lower()
	}
}

Hue.empty_global_settings = function()
{
	Hue.global_settings = {}
	Hue.save_global_settings()
}

Hue.get_global_settings = function()
{
	Hue.global_settings = Hue.get_local_storage(Hue.ls_global_settings)

	if(Hue.global_settings === null)
	{
		Hue.global_settings = {}
	}

	let changed = false

	for(let setting in Hue.user_settings)
	{
		if(Hue.global_settings[setting] === undefined)
		{
			Hue.global_settings[setting] = Hue[`global_settings_default_${setting}`]
			changed = true
		}
	}

	if(changed)
	{
		Hue.save_global_settings()
	}
}

Hue.save_global_settings = function()
{
	Hue.save_local_storage(Hue.ls_global_settings, Hue.global_settings)
}

Hue.start_settings_widgets = function(type)
{
	for(let setting in Hue.user_settings)
	{
		Hue.modify_setting_widget(type, setting)
	}
	
	Hue.arrange_media_setting_display_positions(type)
}

Hue.modify_setting_widget = function(type, setting_name)
{
	let widget_type = Hue.user_settings[setting_name].widget_type

	let item = $(`#${type}_${setting_name}`)

	if(widget_type === "checkbox")
	{
		item.prop("checked", Hue[type][setting_name])
	}

	else if(widget_type === "textarea" || widget_type === "text")
	{
		item.val(Hue[type][setting_name])
	}

	else if(widget_type === "select")
	{
		item.find('option').each(function()
		{
			if($(this).val() == Hue[type][setting_name])
			{
				$(this).prop('selected', true)
			}
		})
	}
}

Hue.start_settings_widgets_listeners = function(type)
{
	for(let setting in Hue.user_settings)
	{
		let widget_type = Hue.user_settings[setting].widget_type

		let item = $(`#${type}_${setting}`)

		if(widget_type === "checkbox" || widget_type === "select")
		{
			item.change(() => {Hue[`setting_${setting}_action`](type)})
		}

		else if(widget_type === "textarea" || widget_type === "text")
		{
			item.blur(() => {Hue[`setting_${setting}_action`](type)})
		}
	}

	$(`#${type}_tv_display_percentage`).nstSlider(
	{
		"left_grip_selector": ".leftGrip",
		"value_changed_callback": function(cause, val) 
		{
			if(cause === "init")
			{
				return false
			}

			if(Hue[type].tv_display_percentage !== val)
			{
				Hue[type].tv_display_percentage = val
				Hue[`save_${type}`]()
				Hue.apply_media_percentages()
			}
		}
	})

	$(`#${type}_chat_display_percentage`).nstSlider(
	{
		"left_grip_selector": ".leftGrip",
		"value_changed_callback": function(cause, val) 
		{
			if(cause === "init")
			{
				return false
			}

			if(Hue[type].chat_display_percentage !== val)
			{
				Hue[type].chat_display_percentage = val
				Hue[`save_${type}`]()	
				Hue.apply_media_percentages()
			}
		}
	})

	Hue.set_media_sliders(type)
}

Hue.call_setting_actions = function(type, save=true)
{
	for(let setting in Hue.global_settings)
	{
		let action = Hue[`setting_${setting}_action`]

		if(action !== undefined)
		{
			action(type, save)
		}
	}
}

Hue.setting_background_image_action = function(type, save=true)
{
	Hue[type].background_image = $(`#${type}_background_image`).prop("checked")

	if(Hue.active_settings("background_image") === type)
	{
		Hue.apply_background()
		Hue.apply_theme()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_custom_scrollbars_action = function(type, save=true)
{
	Hue[type].custom_scrollbars = $(`#${type}_custom_scrollbars`).prop("checked")

	if(Hue.active_settings("custom_scrollbars") === type)
	{
		Hue.setup_scrollbars()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_beep_on_messages_action = function(type, save=true)
{
	Hue[type].beep_on_messages = $(`#${type}_beep_on_messages`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_beep_on_highlights_action = function(type, save=true)
{
	Hue[type].beep_on_highlights = $(`#${type}_beep_on_highlights`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_beep_on_media_change_action = function(type, save=true)
{
	Hue[type].beep_on_media_change = $(`#${type}_beep_on_media_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_beep_on_user_joins_action = function(type, save=true)
{
	Hue[type].beep_on_user_joins = $(`#${type}_beep_on_user_joins`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_modal_effects_action = function(type, save=true)
{
	Hue[type].modal_effects = $(`#${type}_modal_effects`).prop("checked")

	if(Hue.active_settings("modal_effects") === type)
	{
		for(let instance of Hue.get_all_msg_instances())
		{
			if($(instance.window).hasClass("no_effects"))
			{
				continue
			}

			if(Hue[type].modal_effects)
			{
				instance.options.show_effect = "fade"
				instance.options.close_effect = "fade"
			}

			else
			{
				instance.options.show_effect = "none"
				instance.options.close_effect = "none"
			}
		}
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_highlight_current_username_action = function(type, save=true)
{
	Hue[type].highlight_current_username = $(`#${type}_highlight_current_username`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_case_insensitive_username_highlights_action = function(type, save=true)
{
	Hue[type].case_insensitive_username_highlights = $(`#${type}_case_insensitive_username_highlights`).prop("checked")

	if(Hue.active_settings("case_insensitive_username_highlights") === type)
	{
		Hue.generate_mentions_regex()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_case_insensitive_words_highlights_action = function(type, save=true)
{
	Hue[type].case_insensitive_words_highlights = $(`#${type}_case_insensitive_words_highlights`).prop("checked")

	if(Hue.active_settings("case_insensitive_words_highlights") === type)
	{
		Hue.generate_highlight_words_regex()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_case_insensitive_ignored_words_action = function(type, save=true)
{
	Hue[type].case_insensitive_ignored_words = $(`#${type}_case_insensitive_ignored_words`).prop("checked")

	if(Hue.active_settings("case_insensitive_ignored_words") === type)
	{
		Hue.generate_ignored_words_regex()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_other_words_to_highlight_action = function(type, save=true)
{
	let words = Hue.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_other_words_to_highlight`).val()))

	$(`#${type}_other_words_to_highlight`).val(words)

	Hue[type].other_words_to_highlight = words

	if(Hue.active_settings("other_words_to_highlight") === type)
	{
		Hue.generate_highlight_words_regex()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_double_tap_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_double_tap`).val())

	$(`#${type}_double_tap`).val(cmds)

	Hue[type].double_tap = cmds

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_double_tap_2_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_double_tap_2`).val())

	$(`#${type}_double_tap_2`).val(cmds)

	Hue[type].double_tap_2 = cmds

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_double_tap_3_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_double_tap_3`).val())

	$(`#${type}_double_tap_3`).val(cmds)

	Hue[type].double_tap_3 = cmds

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_delay_action = function(type, save=true)
{
	let delay = $(`#${type}_afk_delay option:selected`).val()

	if(delay !== "never")
	{
		delay = parseInt(delay)
	}

	Hue[type].afk_delay = delay

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_at_startup_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_at_startup`).val())

	$(`#${type}_at_startup`).val(cmds)

	Hue[type].at_startup = cmds

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_ignored_usernames_action = function(type, save=true)
{
	let unames = Hue.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_ignored_usernames`).val()))

	$(`#${type}_ignored_usernames`).val(unames)

	Hue[type].ignored_usernames = unames

	if(Hue.active_settings("ignored_usernames") === type)
	{
		Hue.generate_ignored_words_regex()
		Hue.check_activity_bar()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_ignored_words_action = function(type, save=true)
{
	let unames = Hue.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_ignored_words`).val()))

	$(`#${type}_ignored_words`).val(unames)

	Hue[type].ignored_words = unames

	if(Hue.active_settings("ignored_words") === type)
	{
		Hue.generate_ignored_words_regex()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_ignored_words_exclude_same_user_action = function(type, save=true)
{
	Hue[type].ignored_words_exclude_same_user = $(`#${type}_ignored_words_exclude_same_user`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_show_joins_action = function(type, save=true)
{
	Hue[type].show_joins = $(`#${type}_show_joins`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_show_parts_action = function(type, save=true)
{
	Hue[type].show_parts = $(`#${type}_show_parts`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_animate_scroll_action = function(type, save=true)
{
	Hue[type].animate_scroll = $(`#${type}_animate_scroll`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_new_messages_separator_action = function(type, save=true)
{
	Hue[type].new_messages_separator = $(`#${type}_new_messages_separator`).prop("checked")

	if(Hue.active_settings("new_messages_separator") === type)
	{
		if(!Hue[type].new_messages_separator)
		{
			Hue.remove_separator()
		}
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_messages_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_messages_beep = $(`#${type}_afk_disable_messages_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_highlights_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_highlights_beep = $(`#${type}_afk_disable_highlights_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_media_change_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_media_change_beep = $(`#${type}_afk_disable_media_change_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_joins_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_joins_beep = $(`#${type}_afk_disable_joins_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_image_change_action = function(type, save=true)
{
	Hue[type].afk_disable_image_change = $(`#${type}_afk_disable_image_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_tv_change_action = function(type, save=true)
{
	Hue[type].afk_disable_tv_change = $(`#${type}_afk_disable_tv_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_radio_change_action = function(type, save=true)
{
	Hue[type].afk_disable_radio_change = $(`#${type}_afk_disable_radio_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_open_popup_messages_action = function(type, save=true)
{
	Hue[type].open_popup_messages = $(`#${type}_open_popup_messages`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_1_name_action = function(type, save=true)
{
	let val = Hue.utilz.clean_string2($(`#${type}_user_function_1_name`).val())

	if(!val)
	{
		val = Hue.global_settings_default_user_function_1_name
	}

	$(`#${type}_user_function_1_name`).val(val)

	Hue[type].user_function_1_name = val

	if(Hue.active_settings("user_function_1_name") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_1_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_user_function_1`).val())

	$(`#${type}_user_function_1`).val(cmds)

	Hue[type].user_function_1 = cmds

	if(Hue.active_settings("user_function_1") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_2_name_action = function(type, save=true)
{
	let val = Hue.utilz.clean_string2($(`#${type}_user_function_2_name`).val())

	if(!val)
	{
		val = Hue.global_settings_default_user_function_2_name
	}

	$(`#${type}_user_function_2_name`).val(val)

	Hue[type].user_function_2_name = val

	if(Hue.active_settings("user_function_2_name") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_2_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_user_function_2`).val())

	$(`#${type}_user_function_2`).val(cmds)

	Hue[type].user_function_2 = cmds

	if(Hue.active_settings("user_function_2") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_3_name_action = function(type, save=true)
{
	let val = Hue.utilz.clean_string2($(`#${type}_user_function_3_name`).val())

	if(!val)
	{
		val = Hue.global_settings_default_user_function_3_name
	}

	$(`#${type}_user_function_3_name`).val(val)

	Hue[type].user_function_3_name = val

	if(Hue.active_settings("user_function_3_name") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_3_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_user_function_3`).val())

	$(`#${type}_user_function_3`).val(cmds)

	Hue[type].user_function_3 = cmds

	if(Hue.active_settings("user_function_3") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_4_name_action = function(type, save=true)
{
	let val = Hue.utilz.clean_string2($(`#${type}_user_function_4_name`).val())

	if(!val)
	{
		val = Hue.global_settings_default_user_function_4_name
	}

	$(`#${type}_user_function_4_name`).val(val)

	Hue[type].user_function_4_name = val

	if(Hue.active_settings("user_function_4_name") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_user_function_4_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_user_function_4`).val())

	$(`#${type}_user_function_4`).val(cmds)

	Hue[type].user_function_4 = cmds

	if(Hue.active_settings("user_function_4") === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_on_lockscreen_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_on_lockscreen`).val())

	$(`#${type}_on_lockscreen`).val(cmds)

	Hue[type].on_lockscreen = cmds

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_on_unlockscreen_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_on_unlockscreen`).val())

	$(`#${type}_on_unlockscreen`).val(cmds)

	Hue[type].on_unlockscreen = cmds

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_on_lockscreen_action = function(type, save=true)
{
	Hue[type].afk_on_lockscreen = $(`#${type}_afk_on_lockscreen`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_chat_layout_action = function(type, save=true)
{
	let mode = $(`#${type}_chat_layout option:selected`).val()

	Hue[type].chat_layout = mode

	if(save)
	{
		Hue[`save_${type}`]()
	}

	if(Hue.get_setting("chat_layout") !== loaded_chat_layout)
	{
		if(Hue.active_settings("chat_layout") === type)
		{
			let r = confirm("To apply this setting a restart is required. Do you want to restart now?")

			if(r)
			{
				Hue.restart_client()
			}
		}
	}
}

Hue.setting_aliases_action = function(type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_aliases`).val())

	cmds = Hue.format_command_aliases(cmds)

	$(`#${type}_aliases`).val(cmds)

	Hue[type].aliases = cmds

	if(Hue.active_settings("aliases") === type)
	{
		Hue.setup_command_aliases()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_other_words_to_autocomplete_action = function(type, save=true)
{
	let words = Hue.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_other_words_to_autocomplete`).val()))

	$(`#${type}_other_words_to_autocomplete`).val(words)

	Hue[type].other_words_to_autocomplete = words

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_chat_font_size_action = function(type, save=true)
{
	let fsize = $(`#${type}_chat_font_size option:selected`).val()

	Hue[type].chat_font_size = fsize

	if(save)
	{
		Hue[`save_${type}`]()
	}

	if(Hue.active_settings("chat_font_size") === type)
	{
		Hue.apply_theme()
		Hue.update_chat_scrollbar()
		Hue.goto_bottom(true, false)
	}
}

Hue.setting_warn_before_closing_action = function(type, save=true)
{
	Hue[type].warn_before_closing = $(`#${type}_warn_before_closing`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_activity_bar_action = function(type, save=true)
{
	Hue[type].activity_bar = $(`#${type}_activity_bar`).prop("checked")

	if(Hue.active_settings("activity_bar") === type)
	{
		if(Hue[type].activity_bar)
		{
			Hue.show_activity_bar()
		}

		else
		{
			Hue.hide_activity_bar()
		}
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_show_image_previews_action = function(type, save=true)
{
	Hue[type].show_image_previews = $(`#${type}_show_image_previews`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_show_link_previews_action = function(type, save=true)
{
	Hue[type].show_link_previews = $(`#${type}_show_link_previews`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_stop_radio_on_tv_play_action = function(type, save=true)
{
	Hue[type].stop_radio_on_tv_play = $(`#${type}_stop_radio_on_tv_play`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_stop_tv_on_radio_play_action = function(type, save=true)
{
	Hue[type].stop_tv_on_radio_play = $(`#${type}_stop_tv_on_radio_play`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_synth_enabled_action = function(type, save=true)
{
	Hue[type].synth_enabled = $(`#${type}_synth_enabled`).prop("checked")

	if(Hue.active_settings("synth_enabled") === type)
	{
		if(!Hue[type].synth_enabled)
		{
			Hue.hide_synth()
		}
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.setting_afk_disable_synth_action = function(type, save=true)
{
	Hue[type].afk_disable_synth = $(`#${type}_afk_disable_synth`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

Hue.empty_room_settings = function()
{
	Hue.room_settings = {}
	Hue.save_room_settings()
}

Hue.get_room_settings = function()
{
	let room_settings_all = Hue.get_local_storage(Hue.ls_room_settings)

	if(room_settings_all === null)
	{
		room_settings_all = {}
	}

	Hue.room_settings = room_settings_all[Hue.room_id]

	if(Hue.room_settings === undefined)
	{
		Hue.room_settings = {}
	}

	let changed = false

	for(let key in Hue.global_settings)
	{
		if(Hue.room_settings[key] === undefined)
		{
			Hue.room_settings[key] = Hue.global_settings[key]
			changed = true
		}

		if(Hue.room_settings[`${key}_override`] === undefined)
		{
			Hue.room_settings[`${key}_override`] = false
			changed = true
		}
	}

	if(changed)
	{
		Hue.save_room_settings()
	}
}

Hue.save_room_settings = function()
{
	let room_settings_all = Hue.get_local_storage(Hue.ls_room_settings)

	if(room_settings_all === null)
	{
		room_settings_all = {}
	}

	room_settings_all[Hue.room_id] = Hue.room_settings

	Hue.save_local_storage(Hue.ls_room_settings, room_settings_all)
}

Hue.get_room_state = function()
{
	let room_state_all = Hue.get_local_storage(Hue.ls_room_state)

	if(room_state_all === null)
	{
		room_state_all = {}
	}

	Hue.room_state = room_state_all[Hue.room_id]

	if(Hue.room_state === undefined)
	{
		Hue.room_state = {}
	}

	let changed = false

	let settings = 
	[
		"images_enabled",
		"tv_enabled",
		"radio_enabled",
		"images_locked",
		"tv_locked",
		"radio_locked",
		"radio_volume",
		"screen_locked",
		"synth_muted",
		"lockscreen_lights_off"
	]

	for(let setting of settings)
	{
		if(Hue.room_state[setting] === undefined)
		{
			Hue.room_state[setting] = Hue[`room_state_default_${setting}`]
			changed = true
		}
	}

	if(changed)
	{
		Hue.save_room_state()
	}
}

Hue.save_room_state = function()
{
	let room_state_all = Hue.get_local_storage(Hue.ls_room_state)

	if(room_state_all === null)
	{
		room_state_all = {}
	}

	room_state_all[Hue.room_id] = Hue.room_state

	Hue.save_local_storage(Hue.ls_room_state, room_state_all)
}

Hue.start_filters = function()
{
	$("#chat_search_filter").on("keyup", function()
	{
		Hue.chat_search_timer()
	})
}

Hue.do_modal_filter_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.do_modal_filter()
		}, Hue.filter_delay)
	}
})()

Hue.do_modal_filter = function(id=false)
{
	if(!id)
	{
		if(!Hue.active_modal)
		{
			return false
		}

		id = Hue.active_modal.options.id
	}

	let filter = $(`#Msg-content-${id} .filter_input`).eq(0)

	if(!filter.length)
	{
		return false
	}

	let value = filter.val()

	let lc_value = Hue.utilz.clean_string2(value).toLowerCase()

	let items = $(`#Msg-content-${id} .modal_item`)

	let display = "block"

	if(lc_value)
	{
		let words = lc_value.split(" ")

		items.each(function()
		{
			let item_value = $(this).text().toLowerCase()

			let found = true

			for(let word of words)
			{
				if(!item_value.includes(word))
				{
					found = false
					break
				}
			}

			if(found)
			{
				$(this).css("display", display)
			}

			else
			{
				$(this).css("display", "none")
			}
		})

		Hue[`${id}_filtered`] = true
	}

	else
	{
		items.each(function()
		{
			$(this).css("display", display)
		})

		Hue[`${id}_filtered`] = false
	}

	Hue.update_modal_scrollbar(id)

	$(`#Msg-content-container-${id}`).scrollTop(0)
}

Hue.show_input_history = function(filter=false)
{
	Hue.msg_input_history.show(function()
	{
		if(filter)
		{
			$("#input_history_filter").val(filter)
			Hue.do_modal_filter()
		}
	})
}

onYouTubeIframeAPIReady = function()
{
	Hue.yt_player = new YT.Player('youtube_player',
	{
		events:
		{
			onReady: Hue.onYouTubePlayerReady
		},
		playerVars:
		{
			iv_load_policy: 3,
			rel: 0,
			width: 640,
			height: 360
		}
	})

	Hue.yt_video_player = new YT.Player('media_youtube_video',
	{
		events:
		{
			onReady: Hue.onYouTubePlayerReady2
		},
		playerVars:
		{
			iv_load_policy: 3,
			rel: 0,
			width: 640,
			height: 360,
			autoplay: 0
		}
	})
}

Hue.onYouTubePlayerReady = function()
{
	Hue.youtube_player = Hue.yt_player

	if((Hue.last_radio_type && Hue.last_radio_type === "youtube") || Hue.current_radio().type === "youtube")
	{
		Hue.change({type:"radio", notify:false})
	}

	Hue.set_radio_volume(false, false)
}

Hue.onYouTubePlayerReady2 = function()
{
	Hue.youtube_video_player = Hue.yt_video_player

	Hue.youtube_video_player.addEventListener("onStateChange", function(e)
	{
		if(e.data === 5)
		{
			if(Hue.youtube_video_play_on_queue)
			{
				Hue.youtube_video_player.playVideo()
			}
		}
	})

	if((Hue.last_tv_type && Hue.last_tv_type === "youtube") || Hue.current_tv().type === "youtube")
	{
		if(Hue.play_video_on_load)
		{
			Hue.change({type:"tv", notify:false, force:true, play:true})
		}

		else
		{
			Hue.change({type:"tv", notify:false})
		}
	}
}

Hue.start_twitch = function()
{
	try
	{
		let twch_video_player = new Twitch.Player("media_twitch_video_container",
		{
			width: 640,
			height: 360,
			autoplay: false
		})

		twch_video_player.addEventListener(Twitch.Player.READY, () =>
		{
			Hue.twitch_video_player = twch_video_player

			$("#media_twitch_video_container").find("iframe").eq(0).attr("id", "media_twitch_video").addClass("video_frame")

			if((Hue.last_tv_type && Hue.last_tv_type === "twitch") || Hue.current_tv().type === "twitch")
			{
				if(Hue.play_video_on_load)
				{
					Hue.change({type:"tv", notify:false, force:true, play:true})
				}

				else
				{
					Hue.change({type:"tv", notify:false})
				}
			}
		})
	}

	catch(err)
	{
		console.error("Twitch failed to load")
	}
}

Hue.setup_user_menu = function()
{
	$("#user_menu_profile_image").on("error", function()
	{
		if($(this).attr("src") !== Hue.default_profile_image_url)
		{
			$(this).attr("src", Hue.default_profile_image_url)
		}
	})

	$("#user_menu_profile_image").attr("src", Hue.profile_image)
	Hue.setup_togglers("user_menu")
}

Hue.show_user_menu = function()
{
	clearTimeout(Hue.show_reactions_timeout)
	Hue.hide_reactions()
	Hue.msg_user_menu.show()
}

Hue.show_status = function()
{
	Hue.msg_info2.show(["Room Status", Hue.template_status({info:Hue.get_status_html()})])
}

Hue.get_status_html = function()
{
	let h = $("<div></div>")

	let info = ""

	info += "<div class='info_item'><div class='info_title'>Room Name</div><div class='info_item_content' id='status_room_name'></div></div>"

	if(Hue.topic_setter)
	{
		info += `<div class='info_item' title='Setter: ${Hue.topic_setter} | ${Hue.topic_date}'><div class='info_title'>Topic</div><div class='info_item_content' id='status_topic'></div></div>`
	}

	else
	{
		info += `<div class='info_item'><div class='info_title'>Topic</div><div class='info_item_content' id='status_topic'></div></div>`
	}

	info += "<div class='info_item'><div class='info_title'>Privacy</div>"

	if(Hue.is_public)
	{
		info += "<div class='info_item_content'>Public</div></div>"
	}

	else
	{
		info += "<div class='info_item_content'>Private</div></div>"
	}

	info += "<div class='info_item'><div class='info_title'>Log</div>"

	if(Hue.log_enabled)
	{
		info += "<div class='info_item_content'>Enabled</div></div>"
	}

	else
	{
		info += "<div class='info_item_content'>Disabled</div></div>"
	}

	if(Hue.current_image().setter)
	{
		info += "<div class='info_item'><div class='info_title'>Image Setter</div>"
		info += `<div class='info_item_content' id='status_image_setter'></div></div>`
	}

	if(Hue.current_image().source)
	{
		info += "<div class='info_item'><div class='info_title'>Image Source</div>"
		info += `<div class='info_item_content' id='status_image_source'></div></div>`
	}

	if(Hue.current_image().nice_date)
	{
		info += "<div class='info_item'><div class='info_title'>Image Date</div>"
		info += `<div class='info_item_content' id='status_image_date'></div></div>`
	}

	if(Hue.current_tv().setter)
	{
		info += "<div class='info_item'><div class='info_title'>TV Setter</div>"
		info += `<div class='info_item_content' id='status_tv_setter'></div></div>`
	}

	if(Hue.current_tv().title)
	{
		info += "<div class='info_item'><div class='info_title'>TV Title</div>"
		info += `<div class='info_item_content' id='status_tv_title'></div></div>`
	}

	if(Hue.current_tv().source)
	{
		info += "<div class='info_item'><div class='info_title'>TV Source</div>"
		info += `<div class='info_item_content' id='status_tv_source'></div></div>`
	}

	if(Hue.current_tv().nice_date)
	{
		info += "<div class='info_item'><div class='info_title'>TV Date</div>"
		info += `<div class='info_item_content' id='status_tv_date'></div></div>`
	}

	if(Hue.current_radio().setter)
	{
		info += "<div class='info_item'><div class='info_title'>Radio Setter</div>"
		info += `<div class='info_item_content' id='status_radio_setter'></div></div>`
	}

	if(Hue.current_radio().title)
	{
		info += "<div class='info_item'><div class='info_title'>Radio Title</div>"
		info += `<div class='info_item_content' id='status_radio_title'></div></div>`
	}

	if(Hue.current_radio().source)
	{
		info += "<div class='info_item'><div class='info_title'>Radio Source</div>"
		info += `<div class='info_item_content' id='status_radio_source'></div></div>`
	}

	if(Hue.current_radio().nice_date)
	{
		info += "<div class='info_item'><div class='info_title'>Radio Date</div>"
		info += `<div class='info_item_content' id='status_radio_date'></div></div>`
	}

	h.append(info)

	h.find("#status_room_name").eq(0).text(Hue.room_name).urlize()

	let t = h.find("#status_topic").eq(0)
	
	t.text(Hue.get_topic()).urlize()

	if(Hue.current_image().setter)
	{
		t = h.find("#status_image_setter").eq(0)
		t.text(Hue.current_image().setter)
	}

	if(Hue.current_image().source)
	{
		t = h.find("#status_image_source").eq(0)
		t.text(Hue.get_proper_media_url("image")).urlize()
	}

	if(Hue.current_image().nice_date)
	{
		t = h.find("#status_image_date").eq(0)
		t.text(Hue.current_image().nice_date)
	}

	if(Hue.current_tv().setter)
	{
		t = h.find("#status_tv_setter").eq(0)
		t.text(Hue.current_tv().setter)
	}

	if(Hue.current_tv().title)
	{
		t = h.find("#status_tv_title").eq(0)
		t.text(Hue.current_tv().title).urlize()
	}

	if(Hue.current_tv().source)
	{
		t = h.find("#status_tv_source").eq(0)
		t.text(Hue.get_proper_media_url("tv")).urlize()
	}

	if(Hue.current_tv().nice_date)
	{
		t = h.find("#status_tv_date").eq(0)
		t.text(Hue.current_tv().nice_date)
	}

	if(Hue.current_radio().setter)
	{
		t = h.find("#status_radio_setter").eq(0)
		t.text(Hue.current_radio().setter)
	}

	if(Hue.current_radio().title)
	{
		t = h.find("#status_radio_title").eq(0)
		t.text(Hue.current_radio().title).urlize()
	}

	if(Hue.current_radio().source)
	{
		t = h.find("#status_radio_source").eq(0)
		t.text(Hue.get_proper_media_url("radio")).urlize()
	}

	if(Hue.current_radio().nice_date)
	{
		t = h.find("#status_radio_date").eq(0)
		t.text(Hue.current_radio().nice_date)
	}

	return h.html()
}

Hue.fill = function()
{
	let s = `abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§
$%& /() =?* '<> #|; ²³~ @ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC
DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @ ©«» ¤¼× {} abc
def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /()
=?* '<> #|; ²³~ @ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI
JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`\´ ©«» ¤¼× {} abc def
ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?*
'<> #|; ²³~ @\`´ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL
MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`´ ©«» ¤¼× {} abc def ghi jkl
mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~
@\`´ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV
WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`´ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv
wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`´ ©«» ¤¼×
{} abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /()
=?* '<> #|; ²³~ @\`´ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL
MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`´ ©«» ¤¼× {} abc def ghi jkl mno
pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`´
©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§
$%& /() =?* '<> #|; ²³~ @\`´ ©«» ¤¼× {} abc def ghi jkl mno pqrs tuv wxyz ABC DEF
GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|; ²³~ @\`´ ©«» ¤¼× {}abc def ghi
jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ $%& /() =?* '<> #|;`

	Hue.update_chat({username:Hue.username, message:s, prof_image:Hue.profile_image})
}

Hue.logout = function()
{
	Hue.goto_url('/logout')
}

Hue.change_username = function(uname)
{
	if(Hue.utilz.clean_string4(uname) !== uname)
	{
		Hue.feedback("Username contains invalid characters")
		return
	}

	if(uname.length === 0)
	{
		Hue.feedback("Username can't be empty")
		return
	}

	if(uname.length > Hue.max_username_length)
	{
		Hue.feedback("Username is too long")
		return
	}

	if(uname === Hue.username)
	{
		Hue.feedback("That's already your username")
		return
	}

	Hue.socket_emit("change_username", {username:uname})
}

Hue.change_password = function(passwd)
{
	if(passwd.length < Hue.min_password_length)
	{
		Hue.feedback(`Password is too short. It must be at least ${Hue.min_password_length} characters long`)
		return
	}

	if(passwd.length > Hue.max_password_length)
	{
		Hue.feedback("Password is too long")
		return
	}

	Hue.socket_emit("change_password", {password:passwd})
}

Hue.password_changed = function(data)
{
	Hue.feedback(`Password succesfully changed to ${data.password}. To force other clients connected to your account to disconnect you can use /disconnectothers`)
}

Hue.change_email = function(email)
{
	if(Hue.utilz.clean_string5(email) !== email)
	{
		Hue.feedback("Invalid email address")
		return
	}

	if(email.length === 0)
	{
		Hue.feedback("Username can't be empty")
		return
	}

	if(!email.includes('@'))
	{
		Hue.feedback("Invalid email address")
		return
	}

	if(email.length > Hue.max_email_length)
	{
		Hue.feedback("Email is too long")
		return
	}

	Hue.socket_emit("change_email", {email:email})
}

Hue.email_changed = function(data)
{
	Hue.set_email(data.email)
	Hue.feedback(`Email succesfully changed to ${data.email}`)
}

Hue.show_details = function(data)
{
	let h = $("<div></div>")

	let info = ""

	info += "<div class='info_item'><div class='info_title'>Username</div><div class='info_item_content' id='details_username'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Email</div><div class='info_item_content' id='details_email'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Account Created On</div><div class='info_item_content' id='details_reg_date'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Joined Room On</div><div class='info_item_content' id='details_joined_room'></div></div>"

	h.append(info)

	h.find("#details_username").eq(0).text(Hue.username)
	h.find("#details_email").eq(0).text(Hue.user_email)
	h.find("#details_reg_date").eq(0).text(Hue.nice_date(Hue.user_reg_date))
	h.find("#details_joined_room").eq(0).text(Hue.nice_date(Hue.date_joined))

	Hue.msg_info2.show(["User Details", h.html()])
}

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

	if(num_images === 0)
	{
		Hue.setup_image("show", Hue.init_data)
	}

	if(num_tv === 0)
	{
		Hue.setup_tv("show", Hue.init_data)
	}

	if(num_radio === 0)
	{
		Hue.setup_radio("show", Hue.init_data)
	}

	if(Hue.log_messages && Hue.log_messages.length > 0)
	{
		for(let message of Hue.log_messages)
		{
			let type = message.type
			let data = message.data
			let date = message.date

			if(data)
			{
				if(type === "chat")
				{
					Hue.update_chat(
					{
						id: data.id,
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
					data.image_date = date
					Hue.setup_image("show", data)
				}

				else if(type === "tv")
				{
					data.tv_date = date
					Hue.setup_tv("show", data)
				}

				else if(type === "radio")
				{
					data.radio_date = date
					Hue.setup_radio("show", data)
				}

				else if(type === "reaction")
				{
					Hue.show_reaction(data, date)
				}
			}
		}
	}

	Hue.log_messages_processed = true
}

Hue.change_log = function(log)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	if(log === Hue.log_enabled)
	{
		if(log)
		{
			Hue.feedback("Log is already enabled")
		}

		else
		{
			Hue.feedback("Log is already disabled")
		}
	}

	Hue.socket_emit("change_log", {log:log})
}

Hue.clear_log = function(clr_room=false)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("clear_log", {clear_room:clr_room})
}

Hue.clear_log_and_room = function(clr_room=false)
{
	Hue.clear_log(true)
}

Hue.announce_log_change = function(data)
{
	let s

	if(data.log)
	{
		s = `${data.username} enabled the log`
	}

	else
	{
		s = `${data.username} cleared and disabled the log`
	}

	Hue.public_feedback(s,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_log_enabled(data.log)
}

Hue.announce_log_cleared = function(data)
{
	if(data.clear_room)
	{
		Hue.clear_room()
	}

	Hue.public_feedback(`${data.username} cleared the log`,
	{
		username: data.username,
		open_profile: true
	})
}

Hue.show_log = function()
{
	if(Hue.log_enabled)
	{
		Hue.feedback("Log is enabled")
	}

	else
	{
		Hue.feedback("Log is disabled")
	}
}

Hue.show_modal_image = function(url, title, date)
{
	if(!url)
	{
		if(Hue.images_changed.length > 0)
		{
			Hue.show_current_image_modal(false)
			return
		}

		else
		{
			Hue.msg_info.show("No image loaded yet")
			return
		}
	}

	let t

	if(title)
	{
		t = title
	}

	else
	{
		t = ""
	}

	let img = $("#modal_image")

	img.css("display", "none")

	$("#modal_image_spinner").css("display", "block")
	$("#modal_image_error").css("display", "none")

	img.attr("src", url)

	$("#modal_image_header_info").text(t)

	Hue.update_modal_scrollbar("image")

	Hue.msg_modal_image.show(function()
	{
		Hue.set_modal_image_number()
	})
}

Hue.set_modal_image_number = function()
{
	if(!Hue.modal_image_open)
	{
		return false
	}

	let url = $("#modal_image").attr("src")

	let number = 0

	for(let i=0; i<Hue.images_changed.length; i++)
	{
		let ic = Hue.images_changed[i]

		if(ic.source === url)
		{
			number = i + 1
			break
		}
	}

	let footer_text = `${number} of ${Hue.images_changed.length}`
	$("#modal_image_footer_info").text(footer_text)
	
	if(number > 0)
	{
		$("#modal_image_number_input").val(number)
		Hue.current_modal_image_index = number - 1
	}

	else
	{
		$("#modal_image_number_input").val(1)
		Hue.current_modal_image_index = 0
	}
}

Hue.setup_modal_image_number = function()
{
	$("#modal_image_number_button").click(function()
	{
		Hue.modal_image_number_go()
	})

	$("#modal_image_number_input").on("input", function()
	{
		let val = parseInt($("#modal_image_number_input").val())

		if(val < 1)
		{
			$("#modal_image_number_input").val(Hue.images_changed.length)
		}

		else if(val === Hue.images_changed.length + 1)
		{
			$("#modal_image_number_input").val(1)
		}

		else if(val > Hue.images_changed.length)
		{
			$("#modal_image_number_input").val(Hue.images_changed.length)
		}
	})
}

Hue.show_modal_image_number = function()
{
	Hue.msg_modal_image_number.show(function()
	{
		$("#modal_image_number_input").focus()
		$("#modal_image_number_input").select()
	})
}

Hue.modal_image_number_go = function()
{
	let val = parseInt($("#modal_image_number_input").val())
	
	let ic = Hue.images_changed[val - 1]

	if(ic)
	{
		Hue.show_modal_image(ic.source, ic.info, ic.date)
		Hue.msg_modal_image_number.close()
	}
}

Hue.show_modal_image_resolution = function()
{
	let img = $("#modal_image")[0]

	let w = img.naturalWidth
	let h = img.naturalHeight

	$("#modal_image_header_info").text($("#modal_image_header_info").text() + ` | Resolution: ${w}x${h}`)
}

Hue.clear_modal_image_info = function()
{
	$("#modal_image_header_info").text("")
	$("#modal_image_footer_info").text("")
}

Hue.not_an_op = function()
{
	Hue.feedback("You are not a room operator")
}

Hue.show_image_picker = function()
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have images permission")
		return false
	}

	Hue.msg_image_picker.show(function()
	{
		$("#image_source_picker_input").focus()
	})
}

Hue.show_tv_picker = function()
{
	if(!Hue.can_tv)
	{
		Hue.feedback("You don't have tv permission")
		return false
	}

	Hue.msg_tv_picker.show(function()
	{
		$("#tv_source_picker_input").focus()
	})
}

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
	})
}

Hue.start_titles = function()
{
	$(".nicetitle").each(function()
	{
		tippy(this,
		{
			delay: [1000, 100],
			animation: 'scale',
			hideOnClick: true,
			duration: 100,
			arrow: true,
			performance: true,
			size: 'regular',
			arrowSize: 'small',
			zIndex: 99999999999
		})
	})
}

Hue.start_hls = function()
{
	Hue.hls = new Hls(
	{
		maxBufferSize: 5*1000*1000,
		maxBufferLength: 10
	})
}

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

Hue.fix_media_margin = function()
{
	if(Hue.num_media_elements_visible() === 2)
	{
		let p = Hue.get_setting("tv_display_position")

		let m1
		let m2

		if(p === "top")
		{
			m1 = "margin-bottom"
			m2 = "margin-top"
		}

		else if(p === "bottom")
		{
			m1 = "margin-top"
			m2 = "margin-bottom"
		}

		$("#media_tv").css(m1, "-1rem")
		$("#media_tv").css(m2, "0")
		$("#media_image").css(m2, "-1rem")
		$("#media_image").css(m1, "0")
	}

	else
	{
		$("#media_image").css("margin-top", "0")
		$("#media_image").css("margin-bottom", "0")
		$("#media_tv").css("margin-top", "0")
		$("#media_tv").css("margin-bottom", "0")
	}
}

Hue.toggle_images = function(what=undefined, save=true)
{
	if(what !== undefined)
	{
		if(Hue.room_state.images_enabled !== what)
		{
			Hue.room_state.images_enabled = what
		}

		else
		{
			save = false
		}
	}

	else
	{
		Hue.room_state.images_enabled = !Hue.room_state.images_enabled
	}

	if(Hue.images_visible !== what)
	{
		Hue.change_images_visibility()
	}

	if(save)
	{
		Hue.save_room_state()
	}
}

Hue.change_images_visibility = function()
{
	if(Hue.room_images_mode !== "disabled" && Hue.room_state.images_enabled)
	{
		$("#media").css("display", "flex")

		$("#media_image").css("display", "flex")

		Hue.fix_media_margin()
		
		$("#footer_toggle_images_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_images_icon").addClass("fa-toggle-on")	

		Hue.change({type:"image"})

		Hue.images_visible = true
		
		Hue.fix_image_frame()
	}

	else
	{
		$("#media_image").css("display", "none")

		Hue.fix_media_margin()

		let num_visible = Hue.num_media_elements_visible()

		if(num_visible === 0)
		{
			Hue.hide_media()
		}	

		$("#footer_toggle_images_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_images_icon").addClass("fa-toggle-off")

		Hue.images_visible = false
	}

	if(Hue.tv_visible)
	{
		Hue.fix_visible_video_frame()
	}

	Hue.update_chat_scrollbar()
	Hue.goto_bottom(false, false)
}

Hue.toggle_tv = function(what=undefined, save=true)
{
	if(what !== undefined)
	{
		if(Hue.room_state.tv_enabled !== what)
		{
			Hue.room_state.tv_enabled = what
		}

		else
		{
			save = false
		}
	}

	else
	{
		Hue.room_state.tv_enabled = !Hue.room_state.tv_enabled
	}

	if(Hue.tv_visible !== what)
	{
		Hue.change_tv_visibility(false)
	}

	if(save)
	{
		Hue.save_room_state()
	}
}

Hue.change_tv_visibility = function(play=true)
{
	if(Hue.room_tv_mode !== "disabled" && Hue.room_state.tv_enabled)
	{
		clearTimeout(Hue.stop_videos_timeout)

		$("#media").css("display", "flex")

		$("#media_tv").css("display", "flex")/

		Hue.fix_media_margin()

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-on")

		Hue.change({type:"tv", force:false, play:false})

		Hue.tv_visible = true
		
		if(play)
		{
			Hue.play_video()
		}
		
		Hue.fix_visible_video_frame()
	}

	else
	{
		$("#media_tv").css("display", "none")

		Hue.fix_media_margin()

		let num_visible = Hue.num_media_elements_visible()

		if(num_visible === 0)
		{
			Hue.hide_media()
		}

		else if(num_visible === 1)
		{
			Hue.stop_videos_timeout = setTimeout(function()
			{
				Hue.stop_videos()
			}, 500)
		}

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-off")

		Hue.tv_visible = false
	}

	if(Hue.images_visible)
	{
		Hue.fix_image_frame()
	}

	Hue.update_chat_scrollbar()
	Hue.goto_bottom(false, false)
}

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

Hue.change_radio_visibility = function()
{
	if(Hue.room_radio_mode !== "disabled" && Hue.room_state.radio_enabled)
	{
		$("#header_radio").css("display", "flex")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-on")

		$("#header_topic").css("display", "none")

		Hue.radio_visible = true

		let original_radio_source = Hue.loaded_radio_source

		Hue.change({type:"radio", force:false, play:false})

		if(Hue.loaded_radio_type === "radio")
		{
			if(original_radio_source === Hue.loaded_radio_source)
			{
				Hue.get_radio_metadata()
			}
		}
	}

	else
	{
		Hue.stop_radio()

		$("#header_radio").css("display", "none")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-off")

		$("#header_topic").css("display", "flex")

		Hue.radio_visible = false
	}
}

Hue.open_profile_image_picker = function()
{
	$("#profile_image_picker").click()
}

Hue.profile_image_selected = function(input)
{
	if(input.files && input.files[0])
	{
		let reader = new FileReader()

		reader.onload = function(e)
		{
			let s = "<img id='profile_image_canvas_image'><div id='profile_image_canvas_button' class='unselectable'>Crop and Upload</div>"

			Hue.msg_info.show(s, function()
			{
				$('#profile_image_canvas_image').attr('src', e.target.result)

				$("#profile_image_picker").closest('form').get(0).reset()

				let image = $('#profile_image_canvas_image')[0]
				let button = $('#profile_image_canvas_button')[0]
				let croppable = false

				let cropper = new Cropper(image,
				{
					aspectRatio: 1,
					viewMode: 2,
					ready: function()
					{
						let container_data = cropper.getContainerData()

						cropper.setCropBoxData({width:container_data.width, height:container_data.height})

						let cropbox_data = cropper.getCropBoxData()

						let left = (container_data.width - cropbox_data.width) / 2
						let top = (container_data.height - cropbox_data.height) / 2

						cropper.setCropBoxData({left:left, right:top})

						croppable = true

						Hue.update_modal_scrollbar("info")
					}
				})

				button.onclick = function()
				{
					let cropped_canvas
					let rounded_canvas

					if(!croppable)
					{
						return
					}

					cropped_canvas = cropper.getCroppedCanvas()
					
					rounded_canvas = Hue.get_rounded_canvas(cropped_canvas)

					rounded_canvas.toBlob(function(blob)
					{
						$("#user_menu_profile_image").attr("src", Hue.profile_image_loading_url)
						blob.name = "profile.png"
						Hue.upload_file(blob, "profile_image_upload")
						Hue.msg_info.close()
					}, 'image/png', 0.95)
				}
			})
		}

		reader.readAsDataURL(input.files[0])
	}
}

Hue.get_rounded_canvas = function(sourceCanvas)
{
	let canvas = document.createElement('canvas')
	let context = canvas.getContext('2d')
	let width = Hue.profile_image_diameter
	let height = Hue.profile_image_diameter
	canvas.width = width
	canvas.height = height
	context.imageSmoothingEnabled = true
	context.drawImage(sourceCanvas, 0, 0, width, height)
	context.globalCompositeOperation = 'destination-in'
	context.beginPath()
	context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true)
	context.fill()
	return canvas
}

Hue.setup_profile_image = function(pi)
{
	if(pi === "")
	{
		Hue.profile_image = Hue.default_profile_image_url
	}

	else
	{
		Hue.profile_image = pi
	}
}

Hue.setup_show_profile = function()
{
	$('#show_profile_image').get(0).addEventListener('load', function()
	{
		Hue.update_modal_scrollbar("profile")
	})
}

Hue.show_profile = function(uname, prof_image)
{
	let pi

	let role = "Offline"

	let user = Hue.get_user_by_username(uname)

	if(user)
	{
		role = Hue.get_pretty_role_name(user.role)
	}

	if(prof_image === "" || prof_image === undefined || prof_image === "undefined")
	{
		if(user && user.profile_image)
		{
			pi = user.profile_image
		}

		else
		{
			pi = Hue.default_profile_image_url
		}
	}

	else
	{
		pi = prof_image
	}

	$("#show_profile_uname").text(uname)
	$("#show_profile_role").text(`(${role})`)

	$("#show_profile_image").on("error", function()
	{
		if($(this).attr("src") !== Hue.default_profile_image_url)
		{
			$(this).attr("src", Hue.default_profile_image_url)
		}
	})

	$("#show_profile_image").attr("src", pi)

	if(!Hue.can_chat || uname === Hue.username || !Hue.usernames.includes(uname))
	{
		$("#show_profile_whisper").css("display", "none")
	}

	else
	{
		$("#show_profile_whisper").css("display", "initial")
	}

	if($('.show_profile_button').filter(function() {return $(this).css('display') !== 'none'}).length)
	{
		$("#show_profile_buttons").css("display", "initial")
	}

	else
	{
		$("#show_profile_buttons").css("display", "none")
	}

	Hue.msg_profile.show(function()
	{
		Hue.update_modal_scrollbar("profile")
	})
}

Hue.profile_image_changed = function(data)
{
	if(data.username === Hue.username)
	{
		Hue.profile_image = data.profile_image
		$("#user_menu_profile_image").attr("src", Hue.profile_image)
	}

	Hue.update_user_profile_image(data.username, data.profile_image)

	if(!Hue.user_is_ignored(data.username))
	{
		Hue.public_feedback(`${data.username} changed the profile image`,
		{
			username: data.username,
			open_profile: true
		})
	}
}

Hue.update_user_profile_image = function(uname, pi)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		let user = Hue.userlist[i]

		if(user.username === uname)
		{
			Hue.userlist[i].profile_image = pi
			return
		}
	}
}

Hue.fix_visible_video_frame = function()
{
	$(".video_frame").each(function()
	{
		if($(this).parent().css("display") !== "none")
		{
			Hue.fix_frame(this.id)
		}
	})
}

Hue.fix_image_frame = function()
{
	if(!Hue.images_visible)
	{
		return false
	}
	
	if(!$("#media_image_frame")[0].naturalHeight)
	{
		return false
	}

	Hue.fix_frame("media_image_frame")
}

Hue.fix_frames = function()
{
	Hue.fix_visible_video_frame()
	Hue.fix_image_frame()
}

Hue.fix_frame = function(frame_id)
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
	let parent_width = parent.width()
	let parent_height = parent.height()
	let parent_ratio = parent_height / parent_width

	let frame_width = frame.width()
	let frame_height = frame.height()

	if(parent_ratio === frame_ratio)
	{
		frame.width(parent_width)
		frame.height(parent_height)
	}

	else if(parent_ratio < frame_ratio)
	{
		frame.width(parent_height / frame_ratio)
		frame.height(parent_height)
	}

	else if(parent_ratio > frame_ratio)
	{
		frame.width(parent_width)
		frame.height(parent_width * frame_ratio)
	}
}

Hue.change_room_images_mode = function(what)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	let modes = ["enabled", "disabled", "locked"]

	if(!modes.includes(what))
	{
		Hue.feedback(`Valid images modes: ${modes.join(" ")}`)
		return false
	}

	if(what === Hue.room_images_mode)
	{
		Hue.feedback(`Images mode is already set to that`)
		return false
	}

	Hue.socket_emit("change_images_mode", {what:what})
}

Hue.change_room_tv_mode = function(what)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	let modes = ["enabled", "disabled", "locked"]

	if(!modes.includes(what))
	{
		Hue.feedback(`Valid tv modes: ${modes.join(" ")}`)
		return false
	}

	if(what === Hue.room_tv_mode)
	{
		Hue.feedback(`TV mode is already set to that`)
		return false
	}

	Hue.socket_emit("change_tv_mode", {what:what})
}

Hue.change_room_radio_mode = function(what)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
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

Hue.change_room_synth_mode = function(what)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	let modes = ["enabled", "disabled"]

	if(!modes.includes(what))
	{
		Hue.feedback(`Valid synth modes: ${modes.join(" ")}`)
		return false
	}

	if(what === Hue.room_synth_mode)
	{
		Hue.feedback(`Synth mode is already set to that`)
		return false
	}

	Hue.socket_emit("change_synth_mode", {what:what})
}

Hue.announce_room_images_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the images mode to ${data.what}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_room_images_mode(data.what)
	Hue.change_images_visibility()
	Hue.check_permissions()
	Hue.check_maxers()
}

Hue.announce_room_tv_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the tv mode to ${data.what}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_room_tv_mode(data.what)
	Hue.change_tv_visibility(false)
	Hue.check_permissions()
	Hue.check_maxers()
}

Hue.announce_room_radio_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the radio mode to ${data.what}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_room_radio_mode(data.what)
	Hue.change_radio_visibility()
	Hue.check_permissions()
}

Hue.announce_room_synth_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the synth mode to ${data.what}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_room_synth_mode(data.what)
	Hue.check_permissions()
}

Hue.hide_media = function()
{
	Hue.stop_videos()

	$("#media").css("display", "none")
}

Hue.setup_active_media = function(data)
{
	Hue.room_images_mode = data.room_images_mode
	Hue.room_tv_mode = data.room_tv_mode
	Hue.room_radio_mode = data.room_radio_mode
	Hue.room_synth_mode = data.room_synth_mode

	Hue.media_visibility_and_locks()
}

Hue.media_visibility_and_locks = function()
{
	Hue.change_images_visibility()
	Hue.change_tv_visibility(false)
	Hue.change_radio_visibility()

	Hue.change_lock_images()
	Hue.change_lock_tv()
	Hue.change_lock_radio()
}

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

Hue.change_theme = function(color)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	color = Hue.utilz.clean_string5(color)

	if(color === undefined)
	{
		return false
	}

	if(color.startsWith("rgba("))
	{
		color = Hue.utilz.clean_string5(Hue.colorlib.rgba_to_rgb(color))
	}

	if(!Hue.utilz.validate_rgb(color))
	{
		Hue.feedback("Not a valid rgb value")
		return false
	}

	if(color === Hue.theme)
	{
		Hue.feedback("Theme is already set to that")
		return false
	}

	Hue.socket_emit("change_theme", {color:color})
}

Hue.announce_theme_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the theme mode to ${data.mode}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_theme_mode(data.mode)
	Hue.apply_theme()
}

Hue.announce_theme_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the theme to ${data.color}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_theme(data.color)
}

Hue.open_background_image_select = function()
{
	Hue.msg_info2.show(["Change Background Image", Hue.template_background_image_select()])
}

Hue.open_background_image_picker = function()
{
	Hue.msg_info2.close()

	$("#background_image_input").click()
}

Hue.open_background_image_input = function()
{
	Hue.msg_info2.show(["Change Background Image", Hue.template_background_image_input()], function()
	{
		$("#background_image_input_text").focus()
		Hue.biu = true
	})
}

Hue.background_image_input_action = function()
{
	let src = $("#background_image_input_text").val().trim()

	if(Hue.change_background_image_source(src))
	{
		Hue.msg_info2.close()
	}
}

Hue.background_image_selected = function(input)
{
	let file = input.files[0]

	let size = file.size / 1024

	$("#background_image_input").closest('form').get(0).reset()

	if(size > Hue.max_image_size)
	{
		Hue.msg_info.show("File is too big")
		return false
	}

	$("#admin_background_image").attr("src", Hue.background_image_loading_url)

	Hue.upload_file(file, "background_image_upload")
}

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
		if(!src.startsWith("http://") && !src.startsWith("https://"))
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

		if(src.length > Hue.max_image_source_length)
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
		if(Hue.background_image === Hue.default_background_image_url)
		{
			Hue.feedback("Background image is already set to that")
			return false
		}
	}

	Hue.socket_emit("change_background_image_source", {src:src})

	return true
}

Hue.announce_background_image_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the background image`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_background_image(data)
}

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

Hue.announce_background_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the background mode to ${data.mode}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_background_mode(data.mode)
}

Hue.change_background_tile_dimensions = function(dimensions)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	if(dimensions.length > Hue.safe_limit_1)
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

Hue.announce_background_tile_dimensions_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the background tile dimensions to ${data.dimensions}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_background_tile_dimensions(data.dimensions)
	Hue.apply_background()
}

Hue.change_image_source = function(src)
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have permission to change images")
		return false
	}

	if(src.length === 0)
	{
		return false
	}

	src = Hue.utilz.clean_string2(src)

	if(src.length > Hue.max_image_source_length)
	{
		return false
	}

	if(src.startsWith("/"))
	{
		return false
	}

	if(src === Hue.current_image().source || src === Hue.current_image().query)
	{
		Hue.feedback("Image is already set to that")
		return false
	}

	else if(src === "default")
	{
		Hue.emit_change_image_source("default")
		return
	}

	else if(src === "prev" || src === "previous")
	{
		if(Hue.images_changed.length > 1)
		{
			src = Hue.images_changed[Hue.images_changed.length - 2].source
		}

		else
		{
			Hue.feedback("No image source before current one")
			return false
		}
	}

	else if(src.startsWith("http://") || src.startsWith("https://"))
	{
		src = src.replace(/\.gifv/g, '.gif')

		if(Hue.check_domain_list("images", src))
		{
			Hue.feedback("Image sources from that domain are not allowed")
			return false
		}

		let extension = Hue.utilz.get_extension(src).toLowerCase()

		if(!extension || !Hue.utilz.image_extensions.includes(extension))
		{
			Hue.feedback("That doesn't seem to be an image")
			return false
		}
	}

	else
	{
		if(!Hue.imgur_enabled)
		{
			Hue.feedback("Imgur support is not enabled")
			return false
		}

	}

	Hue.emit_change_image_source(src)
}

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

Hue.announce_voice_permission_change = function(data)
{
	if(data.what)
	{
		Hue.public_feedback(`${data.username} set ${data.ptype} to true`,
		{
			username: data.username,
			open_profile: true
		})
	}

	else
	{
		Hue.public_feedback(`${data.username} set ${data.ptype} to false`,
		{
			username: data.username,
			open_profile: true
		})
	}

	Hue[data.ptype] = data.what

	Hue.check_permissions()
	Hue.config_admin_permission_checkboxes()
}

Hue.setup_input = function()
{
	$("#input").on("input", function()
	{
		let value = $("#input").val()

		value = Hue.utilz.clean_string9(value)

		if(value.length > Hue.max_input_length)
		{
			value = value.substring(0, Hue.max_input_length)
			Hue.change_input(value)
		}

		if(Hue.old_input_val !== value)
		{
			Hue.input_changed = true
			Hue.check_typing()
			Hue.old_input_val = value
		}

		Hue.check_input_clone_overflow(value)
	})

	$("#input").on("click", function()
	{
		if(Hue.editing_message)
		{
			Hue.stop_edit_message()
		}
	})

	Hue.old_input_val = $("#input").val()
}

Hue.check_input_overflow = function()
{	
	let input = $("#input")[0]

	return input.clientHeight < input.scrollHeight
}

Hue.create_input_clone = function()
{
	let clone = document.createElement("div")

	clone.id = "input_clone"
	clone.style.height = `${$("#input").height()}px`
	clone.style.width = `${$("#input").width()}px`
	clone.style.fontSize = $("#input").css("font-size")
	clone.style.visibility = "hidden"
	clone.style.position = "fixed"
	clone.style.top = "0"
	clone.style.left = "0"
	clone.style.zIndex = "-1"
	clone.style.overflowX = "hidden"
	clone.style.overflowY = "hidden"
	clone.style.overflowWrap = "break-word"
	clone.style.wordBreak = "break-word"
	clone.style.paddingRight = $("#input").css("padding-right")
	clone.style.color = "red"
	clone.style.backgroundColor = "black"
	clone.style.textAlign = "left"
	clone.style.whiteSpace = "pre-wrap"

	document.body.appendChild(clone)

	Hue.initial_input_scroll_height = $("#input_clone")[0].scrollHeight
	Hue.initial_footer_height = $(".panel").css("height")
	Hue.input_clone_created = true
}

Hue.fix_input_clone = function()
{
	if(Hue.input_clone_created)
	{
		$("#input_clone").css("width", `${$("#input").width()}px`) 	
	}
}

Hue.check_input_clone_overflow = function(val)
{
	if(!Hue.input_clone_created)
	{
		return false
	}

	$("#input_clone").text(val)

	let overflowed

	if(Hue.check_input_overflow())
	{
		$("#input_clone").css("overflow-y", "scroll")
		overflowed = true
	}

	else
	{
		$("#input_clone").css("overflow-y", "hidden")
		overflowed = false
	}

	let scroll_height = $("#input_clone")[0].scrollHeight

	if(overflowed || (scroll_height > Hue.initial_input_scroll_height + 10))
	{
		if(!Hue.footer_oversized)
		{
			$("#footer").css("height", "6rem")
			Hue.footer_oversized = true
			Hue.on_resize()
		}
	}

	else
	{
		if(Hue.footer_oversized)
		{
			$("#footer").css("height", Hue.initial_footer_height)
			Hue.footer_oversized = false
			Hue.on_resize()
		}
	}
}

Hue.footer_oversized_active = function()
{
	return Hue.footer_oversized && document.activeElement === $("#input")[0]
}

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

Hue.typing_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.socket_emit("typing", {})
		}, 100)
	}
})()

Hue.typing_remove_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.hide_pencil()
		}, Hue.max_typing_inactivity)
	}
})()

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

Hue.show_pencil = function()
{
	$("#footer_user_menu").addClass("fa-pencil")
	$("#footer_user_menu").removeClass("fa-user-circle")
}

Hue.hide_pencil = function()
{
	$("#footer_user_menu").removeClass("fa-pencil")
	$("#footer_user_menu").addClass("fa-user-circle")
}

Hue.get_last_chat_message_by_username = function(ouname)
{
	let found_message = false

	$($(".message.chat_message").get().reverse()).each(function()
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

Hue.add_aura = function(uname)
{
	let mode = Hue.get_setting("chat_layout")

	if(mode === "normal")
	{
		let message = Hue.get_last_chat_message_by_username(uname)
		$(message).find(".chat_profile_image_container").eq(0).addClass("aura")
	}

	else if(mode === "compact")
	{
		let message = Hue.get_last_chat_message_by_username(uname)
		$(message).find(".chat_uname").eq(0).addClass("aura3")
	}
}

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
	}, Hue.max_typing_inactivity)
}

Hue.remove_aura = function(uname)
{
	clearTimeout(Hue.aura_timeouts[uname])

	let mode = Hue.get_setting("chat_layout")

	let cls = ".chat_profile_image_container.aura"
	let aura = "aura"

	if(mode === "compact")
	{
		cls = ".chat_uname.aura3"
		aura = "aura3"
	}

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

	Hue.aura_timeouts[uname] = undefined
}

Hue.shrug = function()
{
	Hue.process_message(
	{
		message: "¯\\_(ツ)_/¯",
		to_history: false
	})
}

Hue.show_afk = function()
{
	Hue.process_message(
	{
		message: "/me is now AFK",
		to_history: false
	})
}

Hue.toggle_lock_images = function(what=undefined, save=true)
{
	if(what !== undefined)
	{
		Hue.room_state.images_locked = what
	}

	else
	{
		Hue.room_state.images_locked = !Hue.room_state.images_locked
	}

	Hue.change_lock_images()

	if(save)
	{
		Hue.save_room_state()
	}
}

Hue.change_lock_images = function()
{
	if(Hue.room_state.images_locked)
	{
		$("#footer_lock_images_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_images_icon").addClass("fa-lock")
		$("#footer_lock_images_icon").addClass("border_bottom")
	}

	else
	{
		$("#footer_lock_images_icon").removeClass("fa-lock")
		$("#footer_lock_images_icon").addClass("fa-unlock-alt")
		$("#footer_lock_images_icon").removeClass("border_bottom")

		Hue.change({type:"image"})
	}
}

Hue.toggle_lock_tv = function(what=undefined, save=true)
{
	if(what !== undefined)
	{
		Hue.room_state.tv_locked = what
	}

	else
	{
		Hue.room_state.tv_locked = !Hue.room_state.tv_locked
	}

	Hue.change_lock_tv()

	if(save)
	{
		Hue.save_room_state()
	}
}

Hue.change_lock_tv = function()
{
	if(Hue.room_state.tv_locked)
	{
		$("#footer_lock_tv_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_tv_icon").addClass("fa-lock")
		$("#footer_lock_tv_icon").addClass("border_bottom")
	}

	else
	{
		$("#footer_lock_tv_icon").removeClass("fa-lock")
		$("#footer_lock_tv_icon").addClass("fa-unlock-alt")
		$("#footer_lock_tv_icon").removeClass("border_bottom")

		Hue.change({type:"tv"})
	}
}

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

Hue.change_lock_radio = function()
{
	if(Hue.room_state.radio_locked)
	{
		$("#footer_lock_radio_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_radio_icon").addClass("fa-lock")
		$("#footer_lock_radio_icon").addClass("border_bottom")
	}

	else
	{
		$("#footer_lock_radio_icon").removeClass("fa-lock")
		$("#footer_lock_radio_icon").addClass("fa-unlock-alt")
		$("#footer_lock_radio_icon").removeClass("border_bottom")

		Hue.change({type:"radio"})
	}
}

Hue.show_joined = function()
{
	Hue.show_topic()
	Hue.feedback(`You joined ${Hue.room_name}`, {save:true})
}

Hue.show_media_menu = function()
{
	Hue.msg_media_menu.show()
}

Hue.hide_media_menu = function()
{
	Hue.msg_media_menu.close()
}

Hue.stop_media = function()
{
	Hue.stop_videos()
	Hue.stop_radio()
}

Hue.stop_and_lock = function(stop=true)
{
	if(stop)
	{
		Hue.stop_media()
	}

	Hue.toggle_lock_images(true, false)
	Hue.toggle_lock_tv(true, false)
	Hue.toggle_lock_radio(true, false)

	Hue.save_room_state()
}

Hue.refresh_image = function()
{
	Hue.change({type:"image", force:true, play:true, current_source:true})
}

Hue.refresh_tv = function()
{
	Hue.change({type:"tv", force:true, play:true, current_source:true})
}

Hue.refresh_radio = function()
{
	Hue.change({type:"radio", force:true, play:true, current_source:true})
}

Hue.default_media_state = function(change_visibility=true)
{
	if(Hue.room_state.images_locked !== Hue.room_state_default_images_locked)
	{
		Hue.toggle_lock_images(Hue.room_state_default_images_locked, false)
	}

	if(Hue.room_state.tv_locked !== Hue.room_state_default_tv_locked)
	{
		Hue.toggle_lock_tv(Hue.room_state_default_tv_locked, false)
	}

	if(Hue.room_state.radio_locked !== Hue.room_state_default_radio_locked)
	{
		Hue.toggle_lock_radio(Hue.room_state_default_radio_locked, false)
	}

	if(change_visibility)
	{
		if(Hue.room_state.images_enabled !== Hue.room_state_default_images_enabled)
		{
			Hue.toggle_images(Hue.room_state_default_images_enabled, false)
		}

		if(Hue.room_state.tv_enabled !== Hue.room_state_default_tv_enabled)
		{
			Hue.toggle_tv(Hue.room_state_default_tv_enabled, false)
		}

		if(Hue.room_state.radio_enabled !== Hue.room_state_default_radio_enabled)
		{
			Hue.toggle_radio(Hue.room_state_default_radio_enabled, false)
		}
	}

	Hue.save_room_state()
}

Hue.disconnect_others = function()
{
	Hue.socket_emit("disconnect_others", {})
}

Hue.show_others_disconnected = function(data)
{
	let s

	if(data.amount === 1)
	{
		s = `${data.amount} client was disconnected`
	}

	else
	{
		s = `${data.amount} clients were disconnected`
	}

	Hue.feedback(s)
}

Hue.set_username = function(uname)
{
	Hue.username = uname
	Hue.generate_mentions_regex()
	$("#user_menu_username").text(Hue.username)
}

Hue.set_email = function(email)
{
	Hue.user_email = email
}

Hue.generate_mentions_regex = function()
{
	let regexp = `(?:^|\\s+)(?:\\@)?(?:${Hue.escape_special_characters(Hue.username)})(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.|\\:)`

	if(Hue.get_setting("case_insensitive_username_highlights"))
	{
		Hue.mentions_regex = new RegExp(regexp, "i")
	}

	else
	{
		Hue.mentions_regex = new RegExp(regexp)
	}
}

Hue.generate_highlight_words_regex = function()
{
	let words = ""

	let lines = Hue.get_setting("other_words_to_highlight").split('\n')

	for(let i=0; i<lines.length; i++)
	{
		let line = lines[i]

		words += Hue.escape_special_characters(line)

		if(i < lines.length - 1)
		{
			words += "|"
		}
	}

	if(words.length > 0)
	{
		let regexp = `(?:^|\\s+)(?:\\@)?(?:${words})(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.|\\:)`

		if(Hue.get_setting("case_insensitive_words_highlights"))
		{
			Hue.highlight_words_regex = new RegExp(regexp, "i")
		}

		else
		{
			Hue.highlight_words_regex = new RegExp(regexp)
		}
	}

	else
	{
		Hue.highlight_words_regex = false
	}
}

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

Hue.generate_ignored_words_regex = function()
{
	let words = ""

	let lines = Hue.get_setting("ignored_words").split('\n')

	for(let i=0; i<lines.length; i++)
	{
		let line = lines[i]

		words += Hue.escape_special_characters(line)

		if(i < lines.length - 1)
		{
			words += "|"
		}
	}

	if(words.length > 0)
	{
		let regexp = `(?:^|\\s+)(?:\\@)?(?:${words})(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.|\\:)`

		if(Hue.get_setting("case_insensitive_ignored_words"))
		{
			Hue.ignored_words_regex = new RegExp(regexp, "i")
		}

		else
		{
			Hue.ignored_words_regex = new RegExp(regexp)
		}
	}

	else
	{
		Hue.ignored_words_regex = false
	}
}

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

Hue.create_popup = function(position, id=false, after_close=false)
{
	let common =
	{
		show_effect_duration: [0, 400],
		close_effect_duration: [400, 0],
		clear_editables: true,
	}

	if(id)
	{
		common.id = id
	}

	if(after_close)
	{
		common.after_close = after_close
	}

	if(Hue.get_setting("modal_effects"))
	{
		common.show_effect = "fade"
		common.close_effect = "fade"
	}

	else
	{
		common.show_effect = "none"
		common.close_effect = "none"
	}

	let edges_height = $("#footer").height()

	let pop = Msg.factory
	(
		Object.assign({}, common,
		{
			preset: "popup",
			edge_padding_y: edges_height + 20,
			position: position,
			window_class: "!custom_popup",
			enable_titlebar: true,
			center_titlebar: true,
			titlebar_class: "!custom_titlebar !unselectable",
			window_inner_x_class: "!titlebar_inner_x"
		})
	)

	return pop
}

Hue.show_intro = function()
{
	let s = `
	You can chat in this area. The icon on the left opens the user menu where you can change your profile image and other settings.
	When someone is typing a message the user menu icon turns into a pencil. Hovering this icon shows additional actions.`

	Hue.create_popup("bottomleft").show(["Chat and User Menu", s])

	s = `
	This area has media controls. You can use these to change the room's media or control what is displayed to you.`

	Hue.create_popup("bottomright").show(["Media Controls", s])

	s = `
	This area contains the main menu, user list, voice chat, and radio controls. Above that there's the Activty Bar which shows users that have shown activity recently.`

	Hue.create_popup("top").show(["Top Panel", s])

	s = `
	You can lock the screen in this corner.`

	Hue.create_popup("topright").show(["Lock Screen", s])

	s = `
	Close this to close all the popups.`
	
	let f = () => 
	{
		Hue.close_all_popups()
	}

	Hue.create_popup("topleft", false, f).show(["Close Popups", s])

	s = `
	Please read all the popups.`

	Hue.create_popup("center").show(["Welcome", s])
}

Hue.cant_chat = function()
{
	Hue.feedback("You don't have permission to chat")
}

Hue.check_whisper_user = function(uname)
{
	if(!Hue.can_chat)
	{
		Hue.cant_chat()
		return false
	}

	if(uname === Hue.username)
	{
		Hue.feedback("You can't whisper to yourself")
		return false
	}

	if(!Hue.usernames.includes(uname))
	{
		Hue.user_not_in_room()
		return false
	}

	return true
}

Hue.process_write_whisper = function(arg, show=true)
{
	if(arg.includes(">"))
	{
		Hue.send_inline_whisper(arg, show)
	}

	else
	{
		Hue.write_popup_message(arg, "user")
	}
}

Hue.send_inline_whisper = function(arg, show=true)
{
	let split = arg.split(">")

	let uname = split[0].trim()

	if(!Hue.check_whisper_user(uname))
	{
		return false
	}

	if(split.length > 1)
	{
		let message = Hue.utilz.clean_string2(split.slice(1).join(">"))

		if(!message)
		{
			return false
		}

		Hue.do_send_whisper_user(uname, message, false, show)

		return false
	}
}

Hue.write_popup_message = function(uname, type="user")
{
	let title 

	if(type === "user")
	{
		if(!Hue.check_whisper_user(uname))
		{
			return false
		}

		let f = function()
		{
			Hue.show_profile(uname)
		}

		title = {text:`Whisper To ${uname}`, onclick:f}
	}

	else if(type === "ops")
	{
		if(!Hue.is_admin_or_op(Hue.role))
		{
			Hue.not_an_op()
			return false
		}

		title = {text:"* Whisper To Operators *"}
	}

	else if(type === "room")
	{
		if(!Hue.is_admin_or_op(Hue.role))
		{
			Hue.not_an_op()
			return false
		}

		title = {text:"* Message To Room *"}
	}

	else if(type === "system")
	{
		title = {text:"* Message To System *"}
	}

	Hue.message_uname = uname

	Hue.message_type = type

	Hue.msg_message.set_title(Hue.make_safe(title))

	Hue.msg_message.show(function()
	{
		$("#write_message_area").focus()
	})
}

Hue.send_popup_message = function()
{
	let message = Hue.utilz.clean_string2($("#write_message_area").val())

	let diff = Hue.max_input_length - message.length

	let draw_coords

	if(Hue.draw_message_click_x.length > 0)
	{
		draw_coords = [Hue.draw_message_click_x, Hue.draw_message_click_y, Hue.draw_message_drag]
	}

	else
	{
		draw_coords = false
	}

	if(diff === Hue.max_input_length)
	{
		if(!draw_coords)
		{
			return false
		}
	}

	else if(diff < 0)
	{
		$("#write_message_feedback").text(`Character limit exceeded by ${Math.abs(diff)}`)
		$("#write_message_feedback").css("display", "block")
		return false
	}

	let ans

	if(Hue.message_type === "user")
	{
		ans = Hue.send_whisper_user(message, draw_coords)
	}

	else if(Hue.message_type === "ops")
	{
		ans = Hue.send_whisper_ops(message, draw_coords)
	}

	else if(Hue.message_type === "room")
	{
		ans = Hue.send_room_broadcast(message, draw_coords)
	}

	else if(Hue.message_type === "system")
	{
		ans = Hue.send_system_broadcast(message, draw_coords)
	}

	if(ans)
	{
		Hue.msg_message.close()
	}
}

Hue.sent_popup_message_function = function(mode, message, draw_coords, data1=false)
{
	let cf = function(){}
	let ff = function(){}

	let s1
	let s2

	if(mode === "whisper")
	{
		s1 = Hue.utilz.nonbreak("Send Another Whisper")
		s2 = `Whisper sent to ${data1}`

		cf = function()
		{
			Hue.write_popup_message(data1)
		}
		
		ff = function()
		{
			Hue.show_profile(data1)
		}
	}

	else
	{
		return false
	}

	let sp = "<div class='spacer3'></div>"

	let h = `<div class='small_button action' id='modal_popup_feedback_send'>${s1}</div>`

	let ch

	if(draw_coords)
	{
		ch = "<canvas id='modal_popup_feedback_draw' class='draw_canvas' width='400px' height='300px' tabindex=1></canvas>"
	}

	else
	{
		ch = ""
	}

	if(ch)
	{
		h = ch + sp + h
	}

	let s = Hue.make_safe(
	{
		text: message,
		html: h,
		remove_text_if_empty: true
	})

	let f = function()
	{
		Hue.msg_info2.show([Hue.make_safe({text:s2, onclick:ff}), s], function()
		{
			$("#modal_popup_feedback_send").click(cf)

			if(draw_coords)
			{
				let context = $("#modal_popup_feedback_draw")[0].getContext("2d")
				
				Hue.canvas_redraw
				({
					context: context, 
					click_x: draw_coords[0], 
					click_y: draw_coords[1], 
					drag: draw_coords[2]
				})
			}
		})
	}

	return f
}

Hue.send_whisper_user = function(message, draw_coords)
{
	let uname = Hue.message_uname

	if(!uname)
	{
		return false
	}

	if(!Hue.can_chat)
	{
		$("#write_message_feedback").text("You don't have chat permission")
		$("#write_message_feedback").css("display", "block")
		return false
	}

	if(uname === Hue.username)
	{
		$("#write_message_feedback").text("You can't whisper to yourself")
		$("#write_message_feedback").css("display", "block")
		return false
	}

	if(!Hue.usernames.includes(uname))
	{
		$("#write_message_feedback").text("(User is not in the room)")
		$("#write_message_feedback").css("display", "block")
		return false
	}

	Hue.do_send_whisper_user(uname, message, draw_coords)

	return true
}

Hue.do_send_whisper_user = function(uname, message, draw_coords, show=true)
{
	Hue.socket_emit('whisper', 
	{
		username: uname, 
		message: message, 
		draw_coords: draw_coords
	})

	if(show)
	{
		let f = Hue.sent_popup_message_function("whisper", message, draw_coords, uname)
		Hue.feedback(`Whisper sent to ${uname}`, {onclick:f, save:true})
	}
}

Hue.send_whisper_ops = function(message, draw_coords)
{
	Hue.socket_emit('whisper_ops', {message:message, draw_coords:draw_coords})

	return true
}

Hue.send_room_broadcast = function(message, draw_coords)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("room_broadcast", {message:message, draw_coords:draw_coords})

	return true
}

Hue.send_system_broadcast = function(message, draw_coords)
{
	Hue.socket_emit("system_broadcast", {message:message, draw_coords:draw_coords})

	return true
}

Hue.popup_message_received = function(data, type="user", announce=true)
{
	if(!data.id)
	{
		Hue.popup_message_id += 1
		data.id = Hue.popup_message_id
	}

	if(!data.date)
	{
		data.date = Date.now()
	}

	let f

	if(data.username)
	{
		if(Hue.user_is_ignored(data.username))
		{
			return false
		}

		f = function()
		{
			Hue.show_profile(data.username)
		}
	}

	let ch

	if(data.draw_coords)
	{
		ch = `<canvas id='draw_popup_area_${data.id}' class='draw_canvas' width='400px' height='300px' tabindex=1></canvas>`
	}

	else
	{
		ch = false
	}

	let t
	let title
	let h

	if(type === "user")
	{
		t = `Whisper from ${data.username}`
		title = {text:t, onclick:f}
		h = `<div class='small_button action inline show_message_reply'>${Hue.utilz.nonbreak("Send Whisper")}</div>`
	}

	else if(type === "ops")
	{
		t = `Whisper (To Operators) from ${data.username}`
		title = {text:t, onclick:f}

		let h0

		if(data.username !== Hue.username)
		{
			h0 = `<div class='small_button action inline show_message_reply'>${Hue.utilz.nonbreak("Send Whisper")}</div><div class='spacer2'></div>`
		}

		else
		{
			h0 = ""
		}

		h = h0 + `<div class='small_button action inline show_message_reply_ops'>${Hue.utilz.nonbreak("Send Whisper To Operators")}</div>`
	}

	else if(type === "room")
	{
		t = `Room Message from ${data.username}`
		title = {text:t, onclick:f}
		h = false
	}

	else if(type === "system")
	{
		t = "System Message"
		title = {text:t}
		h = false
	}

	let sp = "<div class='spacer3'></div>"

	if(ch)
	{
		if(h)
		{
			h = ch + sp + h
		}
		
		else
		{
			h = ch
		}
	}

	data.content = Hue.make_safe(
	{
		text: data.message,
		html: h,
		title: Hue.nice_date(data.date),
		remove_text_if_empty: true
	})

	data.content = Hue.replace_markdown(data.content, "whisper")

	$(data.content).find(".whisper_link").each(function()
	{
		$(this).click(function()
		{
			Hue.process_write_whisper(`${data.username} > ${$(this).data("whisper")}`, false)
		})
	})

	data.title = Hue.make_safe(title)

	if(!announce || Hue.get_setting("open_popup_messages"))
	{
		let closing_popups = false

		for(let p of Hue.get_popup_instances())
		{
			if(p.window.id === `Msg-window-popup_message_${data.id}`)
			{
				p.close(function()
				{
					Hue.show_popup_message(data)
				})

				closing_popups = true

				break
			}
		}

		if(!closing_popups)
		{
			Hue.show_popup_message(data)
		}
	}

	if(announce)
	{
		let af = function()
		{
			Hue.popup_message_received(data, type, false)
		}

		Hue.feedback(`${t} received`,
		{
			brk: "<i class='icon2c fa fa-envelope'></i>",
			save: true,
			onclick: af
		})
	}

	Hue.alert_title2()
	Hue.sound_notify("highlight")
}

Hue.show_popup_message = function(data)
{
	let pop = Hue.create_popup("top", `popup_message_${data.id}`)

	pop.show([data.title, data.content], function()
	{
		$(pop.content).find(".show_message_reply").eq(0).click(function()
		{
			Hue.write_popup_message(data.username)
		})

		$(pop.content).find(".show_message_reply_ops").eq(0).click(function()
		{
			Hue.write_popup_message(false, "ops")
		})

		if(data.draw_coords)
		{
			let context = $(`#draw_popup_area_${data.id}`)[0].getContext("2d")

			Hue.canvas_redraw
			({
				context: context, 
				click_x: data.draw_coords[0], 
				click_y: data.draw_coords[1], 
				drag: data.draw_coords[2]
			})
		}
	})
}

Hue.add_to_ignored_usernames = function(uname)
{
	let r = confirm("Are you sure?")

	if(r)
	{
		let active = Hue.active_settings("ignored_usernames")

		$(`#${active}_ignored_usernames`).val($(`#${active}_ignored_usernames`).val() + `\n${uname}`)

		Hue.setting_ignored_usernames_action(active)

		return true
	}

	return false
}

Hue.user_not_in_room = function()
{
	Hue.feedback("User is not in the room")
}

Hue.annex = function(rol="admin")
{
	if(!Hue.roles.includes(rol))
	{
		Hue.feedback("Invalid role")
		return false
	}

	Hue.socket_emit('change_role', {username:Hue.username, role:rol})
}

Hue.show_highlights = function(filter=false)
{
	Hue.msg_highlights.show(function()
	{
		$("#highlights_filter").focus()

		$("#highlights_container").html("")

		for(let message of Hue.chat_history.slice(0).reverse())
		{
			if(message.data("highlighted"))
			{
				let cn

				if(message.hasClass("chat_message"))
				{
					let huname = message.find('.chat_uname').eq(0)
					let hcontent = message.find('.chat_content')

					cn = $(`
					<div class='modal_item highlights_item jump_button_container'>
						<div class='highlights_uname generic_uname inline action'></div>
						<div class='highlights_content'></div>
						<div class='jump_button action unselectable'>Jump</div>
					</div>`)

					cn.data("message_id", message.data("message_id"))

					cn.find(".highlights_uname").eq(0).text(huname.text())
					cn.find(".highlights_content").eq(0).html(hcontent.clone(true, true))
				}

				else if(message.hasClass("announcement"))
				{
					cn = $(`
					<div class='highlights_item jump_button_container'>
						<div class='highlights_content'></div>
						<div class='jump_button action unselectable'>Jump</div>
					</div>`)

					cn.data("message_id", message.data("message_id"))

					let content = cn.find(".highlights_content").eq(0)
					let announcement_content = message.find(".announcement_content").eq(0)

					content.append(announcement_content.parent().clone(true, true))
				}

				$("#highlights_container").append(cn)
			}
		}

		if(filter)
		{
			$("#highlights_filter").val(filter)
			Hue.do_modal_filter()
		}

		Hue.update_modal_scrollbar("highlights")
	})
}

Hue.execute_commands = function(setting)
{
	if(Hue.get_setting(setting))
	{
		let cmds = Hue.get_setting(setting).split('\n')

		for(let cmd of cmds)
		{
			Hue.process_message(
			{
				message: cmd,
				to_history: false,
				clr_input: false
			})
		}
	}
}

Hue.on_double_tap = function()
{
	Hue.execute_commands("double_tap")
}

Hue.on_double_tap_2 = function()
{
	Hue.execute_commands("double_tap_2")
}

Hue.on_double_tap_3 = function()
{
	Hue.execute_commands("double_tap_3")
}

Hue.at_startup = function()
{
	Hue.date_joined = Date.now()
	
	Hue.started = true

	if(Hue.first_time)
	{
		return false
	}

	Hue.execute_commands("at_startup")

	setTimeout(function()
	{
		Hue.started_safe = true
	}, 2000)
}

Hue.show_image_history = function(filter=false)
{
	Hue.msg_image_history.show(function()
	{
		if(filter)
		{
			$("#image_history_filter").val(filter)
			Hue.do_modal_filter()
		}
	})
}

Hue.show_tv_history = function(filter=false)
{
	Hue.msg_tv_history.show(function()
	{
		if(filter)
		{
			$("#tv_history_filter").val(filter)
			Hue.do_modal_filter()
		}
	})
}

Hue.show_radio_history = function(filter=false)
{
	Hue.msg_radio_history.show(function()
	{
		if(filter)
		{
			$("#radio_history_filter").val(filter)
			Hue.do_modal_filter()
		}
	})
}

Hue.maximize_images = function()
{
	if(Hue.images_visible)
	{
		if(Hue.tv_visible)
		{
			Hue.toggle_tv(false, false)
		}

		else
		{
			Hue.toggle_tv(true, false)
		}
	}

	else
	{
		Hue.toggle_images(true, false)

		if(Hue.tv_visible)
		{
			Hue.toggle_tv(false, false)
		}
	}

	Hue.save_room_state()
}

Hue.maximize_tv = function()
{
	if(Hue.tv_visible)
	{
		if(Hue.images_visible)
		{
			Hue.toggle_images(false, false)
		}

		else
		{
			Hue.toggle_images(true, false)
		}
	}

	else
	{
		Hue.toggle_tv(true, false)

		if(Hue.images_visible)
		{
			Hue.toggle_images(false, false)
		}
	}

	Hue.save_room_state()
}

Hue.tv_is_maximized = function()
{
	return Hue.tv_visible && !Hue.images_visible
}

Hue.images_is_maximized = function()
{
	return Hue.images_visible && !Hue.tv_visible
}

Hue.setup_fonts = function()
{
	document.fonts.ready.then(function() 
	{
		Hue.on_fonts_loaded()
	})
}

Hue.on_fonts_loaded = function()
{
	Hue.update_chat_scrollbar()
	Hue.goto_bottom(true, false)
	Hue.update_all_modal_scrollbars()
	Hue.create_input_clone()
}

Hue.start_generic_uname_click_events = function()
{
	$("body").on("click", ".generic_uname", function()
	{
		let uname = $(this).text()
		Hue.show_profile(uname)
	})
}

Hue.electron_signal = function(func, data={})
{
	if(Hue["electron_api"] === undefined)
	{
		return false
	}

	if(Hue["electron_api"][func] !== undefined)
	{
		Hue["electron_api"][func](data)
	}
}

Hue.modal_image_prev_click = function()
{
	let index = Hue.current_modal_image_index - 1

	if(index < 0)
	{
		index = Hue.images_changed.length - 1
	}

	let url = $("#modal_image").attr("src")

	let prev = Hue.images_changed[index]

	if(prev.source !== url)
	{
		Hue.show_modal_image(prev.source, prev.info, prev.date)
	}
}

Hue.modal_image_next_click = function(e)
{
	let index = Hue.current_modal_image_index + 1

	if(index > Hue.images_changed.length - 1)
	{
		index = 0
	}

	let url = $("#modal_image").attr("src")

	let next = Hue.images_changed[index]

	if(next.source !== url)
	{
		Hue.show_modal_image(next.source, next.info, next.date)
	}
}

Hue.setup_modal_image = function()
{
	let img = $("#modal_image")

	img[0].addEventListener('load', function()
	{
		$("#modal_image_spinner").css("display", "none")
		$("#modal_image").css("display", "block")
		Hue.show_modal_image_resolution()
		Hue.update_modal_scrollbar("image")
	})

	img.on("error", function()
	{
		$("#modal_image_spinner").css("display", "none")
		$("#modal_image").css("display", "none")
		$("#modal_image_error").css("display", "block")
		Hue.update_modal_scrollbar("image")
	})

	let f = function(e)
	{
		if(e.ctrlKey || e.shiftKey)
		{
			return false
		}

		let direction = e.deltaY > 0 ? 'down' : 'up'

		if(direction === 'up')
		{
			Hue.modal_image_next_wheel_timer()
		}

		else if(direction === 'down')
		{
			Hue.modal_image_prev_wheel_timer()
		}
	}

	$("#Msg-window-modal_image")[0].addEventListener("wheel", f)

	$("#modal_image_container").click(function()
	{
		Hue.msg_modal_image.close()
	})

	$("#modal_image_header_info").click(function()
	{
		Hue.show_image_history()
	})

	$("#modal_image_footer_info").click(function()
	{
		Hue.show_modal_image_number()
	})

	$("#modal_image_footer_prev").click(function(e)
	{
		Hue.modal_image_prev_click()
	})

	$("#modal_image_footer_next").click(function(e)
	{
		Hue.modal_image_next_click()
	})
}

Hue.modal_image_prev_wheel_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.modal_image_prev_click()
		}, Hue.wheel_delay)
	}
})()

Hue.modal_image_next_wheel_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.modal_image_next_click()
		}, Hue.wheel_delay)
	}
})()

Hue.maxer_wheel_timer = (function(f)
{
	let timer

	return function(f)
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			f()
		}, Hue.wheel_delay_2)
	}
})()

Hue.show_current_date = function()
{
	Hue.feedback(Hue.nice_date())
}

Hue.request_slice_upload = function(data)
{
	let file = Hue.files[data.date]

	if(!file)
	{
		return false
	}

	let place = data.current_slice * Hue.upload_slice_size

	let slice = file.slice(place, place + Math.min(Hue.upload_slice_size, file.size - place))

	file.next = Hue.get_file_next(file)

	if(file.next >= 100)
	{
		file.sending_last_slice = true
	}

	file.percentage = Math.floor(((Hue.upload_slice_size * data.current_slice) / file.size) * 100)

	file.reader.readAsArrayBuffer(slice)

	Hue.change_upload_status(file, `${file.percentage}%`)
}

Hue.upload_ended = function(data)
{
	let file = Hue.files[data.date]

	if(file)
	{
		Hue.change_upload_status(file, "100%", true)
		delete Hue.files[data.date]
	}
}

Hue.error_occurred = function()
{
	Hue.feedback("An error occurred")
}

Hue.verify_email = function(code)
{
	if(Hue.utilz.clean_string5(code) !== code)
	{
		Hue.feedback("Invalid code")
		return
	}

	if(code.length === 0)
	{
		Hue.feedback("Empty code")
		return
	}

	if(code.length > Hue.email_change_code_max_length)
	{
		Hue.feedback("Invalid code")
		return
	}

	Hue.socket_emit("verify_email", {code:code})
}

Hue.start_locked_mode = function()
{
	$("#header").css("display", "none")
	$("#footer").css("display", "none")

	Hue.show_locked_menu()
	Hue.make_main_container_visible()
}

Hue.show_locked_menu = function()
{
	Hue.msg_locked.show()
}

Hue.show_goto_room = function()
{
	Hue.msg_info2.show(["Go To Room", Hue.template_goto_room()], function()
	{
		$("#goto_room_input").focus()

		Hue.gtr = true
	})
}

Hue.goto_room_action = function()
{
	let id = $("#goto_room_input").val().trim()

	if(id.length === 0)
	{
		return false
	}

	Hue.show_open_room(id)
}

Hue.confirm_reset_settings = function(type)
{
	let s

	if(type === "global_settings")
	{
		s = "Global Settings"
	}

	else
	{
		s = "Room Settings"
	}

	let r = confirm(`Are you sure you want to reset the ${s} to their initial state?`)

	if(r)
	{
		Hue.reset_settings(type)
	}
}

Hue.reset_settings = function(type)
{
	Hue[`empty_${type}`]()
	Hue[`get_${type}`]()
	Hue.start_settings_widgets(type)
	Hue.call_setting_actions("global_settings", false)
	Hue.call_setting_actions("room_settings", false)
	Hue.set_media_sliders(type)
	Hue.prepare_media_settings()

	if(type === "room_settings")
	{
		Hue.set_room_settings_overriders()
		Hue.check_room_settings_override()
	}
}

Hue.setup_chat = function()
{
	if(Hue.get_setting("custom_scrollbars"))
	{
		Hue.start_chat_scrollbar()
	}
}

Hue.execute_javascript = function(arg, show_result=true)
{
	let r

	try
	{
		r = eval(arg)

		if(typeof r === "number")
		{
			try
			{
				r = Hue.utilz.round(r, 2)
			}

			catch(err){}
		}

		try
		{
			r = JSON.stringify(r)
		}

		catch(err)
		{
			r = "Done"
		}
	}

	catch(err)
	{
		r = "Error"
	}

	if(show_result)
	{
		let s = Hue.make_safe({text:arg})

		let f = function()
		{
			Hue.msg_info2.show(["Executed Javascript", s])
		}

		Hue.feedback(`js: ${r}`, {onclick:f, save:true})
	}
}

Hue.make_safe = function(args={})
{
	let def_args =
	{
		text: "",
		html: false,
		urlize: true,
		onclick: false,
		html_unselectable: true,
		title: false,
		remove_text_if_empty: false
	}

	Hue.fill_defaults(args, def_args)

	let c = $("<div></div>")

	if(args.text || !args.remove_text_if_empty)
	{
		let c_text_classes = "message_info_text inline"

		if(args.onclick)
		{
			c_text_classes += " pointer action"
		}

		c.append(`<div class='${c_text_classes}'></div>`)

		let c_text = c.find(".message_info_text").eq(0)

		if(args.urlize)
		{
			c_text.text(args.text).urlize()
		}

		else
		{
			c_text.text(args.text)
		}

		if(args.onclick)
		{
			c_text.on("click", args.onclick)
		}

		if(args.title)
		{
			c_text.attr("title", args.title)
		}
	}

	if(args.html)
	{
		let sp

		if(args.text || !args.remove_text_if_empty)
		{
			sp = "<div class='spacer3'></div>"
		}

		else
		{
			sp = ""
		}

		c.append(`${sp}<div class='message_info_html'>${args.html}</div>`)

		if(args.html_unselectable)
		{
			c.find(".message_info_html").eq(0).addClass("unselectable")
		}
	}

	return c[0]
}

Hue.make_html_safe = function(s)
{
	let replaced = s.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
	return replaced
}

Hue.activity_above = function(animate=true)
{
	let step = false
	let up_scroller_height = $("#up_scroller").outerHeight()
	let scrolltop = $("#chat_area").scrollTop()

	$($(".message").get().reverse()).each(function()
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

Hue.activity_below = function(animate=true)
{
	let step = false
	let up_scroller_height = $("#up_scroller").outerHeight()
	let down_scroller_height = $("#down_scroller").outerHeight()
	let chat_area_height = $("#chat_area").innerHeight()
	let scrolltop = $("#chat_area").scrollTop()

	$(".message").each(function()
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

Hue.user_is_ignored = function(uname)
{
	if(uname === Hue.username)
	{
		return false
	}

	if(Hue.get_setting("ignored_usernames").includes(uname))
	{
		return true
	}

	return false
}

Hue.show_global_settings = function()
{
	Hue.msg_global_settings.show()
}

Hue.show_room_settings = function()
{
	Hue.msg_room_settings.show()
}

Hue.setup_settings_windows = function()
{
	Hue.setup_setting_elements("global_settings")
	Hue.setup_setting_elements("room_settings")
	Hue.create_room_settings_overriders()
	Hue.set_room_settings_overriders()
	Hue.start_room_settings_overriders()
	Hue.check_room_settings_override()
	Hue.setup_settings_window()
	Hue.setup_user_function_switch_selects()
}

Hue.create_room_settings_overriders = function()
{
	$("#room_settings_container").find(".settings_item").each(function()
	{
		let setting = $(this).data("setting")

		let s = `
		<div class='room_settings_overrider_container'>
			<input type='checkbox' class='room_settings_overrider' id='room_settings_${setting}_overrider'>
			Override
		</div>`

		$(this).prepend(s)
	})
}

Hue.set_room_settings_overriders = function()
{
	$(".room_settings_overrider").each(function()
	{
		let item = $(this).closest(".settings_item")
		let setting = item.data("setting")
		let override = Hue.room_settings[`${setting}_override`]

		if(override === undefined)
		{
			override = false
		}

		$(this).prop("checked", override)

		Hue.room_item_fade(override, item)
	})
}

Hue.start_room_settings_overriders = function()
{
	$(".room_settings_overrider").change(function()
	{
		let item = $(this).closest(".settings_item")
		let setting = item.data("setting")
		let override = $(this).prop("checked")

		if(override === undefined)
		{
			override = false
		}

		Hue.room_item_fade(override, item)

		Hue.room_settings[`${setting}_override`] = override

		if(Hue[`setting_${setting}_action`] !== undefined)
		{
			if(override)
			{
				Hue[`setting_${setting}_action`]("room_settings", false)
			}

			else
			{
				Hue[`setting_${setting}_action`]("global_settings", false)
			}
		}

		if(setting === "chat_display_percentage" 
		|| setting === "tv_display_percentage"
		|| setting === "tv_display_position")
		{
			Hue.prepare_media_settings()
		}

		Hue.check_room_settings_override()
		Hue.save_room_settings()

		let togglers = item.find(".toggler")

		if(togglers.length > 0)
		{
			let toggler = togglers.eq(0)

			if(override)
			{
				Hue.set_toggler("room_settings", toggler, "open")
			}

			else
			{
				Hue.set_toggler("room_settings", toggler, "close")
			}
		}
	})
}

Hue.room_item_fade = function(override, item)
{
	if(override)
	{
		item.removeClass("faded")
	}

	else
	{
		item.addClass("faded")
	}

	$("#settings_window_right_global_settings .settings_item").each(function()
	{
		if(item.data("setting") === $(this).data("setting"))
		{
			if(override)
			{
				$(this).addClass("faded")
			}

			else
			{
				$(this).removeClass("faded")
			}

			return false
		}
	})
}

Hue.setup_setting_elements = function(type)
{
	$(`#${type}_double_tap_key`).text(Hue.double_tap_key)
	$(`#${type}_double_tap_2_key`).text(Hue.double_tap_key_2)
	$(`#${type}_double_tap_3_key`).text(Hue.double_tap_key_3)

	Hue.setup_togglers(type)
}

Hue.check_room_settings_override = function()
{
	let override = false

	$("#settings_window_left_room_settings .settings_window_category").each(function()
	{
		$(this).find(".settings_window_category_status").eq(0).html("")
		$(this).find(".settings_window_category_status_filler").eq(0).html("")
	})

	for(let key in Hue.global_settings)
	{
		if(Hue.room_settings[`${key}_override`])
		{
			override = true

			let el = $(`#room_settings_${key}`)

			if(el.length > 0)
			{
				let container = el.closest(".settings_category")

				if(container.length > 0)
				{
					let category = container.data("category")

					$("#settings_window_left_room_settings .settings_window_category").each(function()
					{
						if($(this).data("category") === category)
						{
							$(this).find(".settings_window_category_status").eq(0).html("&nbsp;*")
							$(this).find(".settings_window_category_status_filler").eq(0).html("&nbsp;*")
							return false
						}
					})
				}
			}
		}
	}

	if(override)
	{
		$("#user_menu_room_settings_status").html("&nbsp;*")
		$("#user_menu_room_settings_status_filler").html("&nbsp;*")
	}

	else
	{
		$("#user_menu_room_settings_status").html("")
	}
}

Hue.get_setting = function(name)
{
	try
	{
		if(Hue.room_settings[`${name}_override`])
		{
			return Hue.room_settings[name]
		}

		else
		{
			return Hue.global_settings[name]
		}
	}

	catch(err)
	{
		return undefined
	}
}

Hue.active_settings = function(name)
{
	if(Hue.room_settings[`${name}_override`])
	{
		return "room_settings"
	}

	else
	{
		return "global_settings"
	}
}

Hue.set_toggler = function(type, el, action=false, update=true)
{
	let container = $(el).next(`.${type}_toggle_container`)
	
	let display = container.css('display')

	if(display === "none")
	{
		if(action && action !== "open")
		{
			return false
		}

		Hue.close_togglers(type)

		container.css("display", "block")
		
		$(el).html(`- ${$(el).html().substring(2)}`)

		container.closest(".toggler_main_container")[0].scrollIntoView({block:"center"})
	}

	else
	{
		if(action && action !== "close")
		{
			return false
		}

		container.css("display", "none")
		
		$(el).html(`+ ${$(el).html().substring(2)}`)
	}

	if(update)
	{
		Hue.update_modal_scrollbar(type)
	}
}

Hue.setup_togglers = function(type)
{
	$(`.${type}_toggle`).each(function()
	{
		$(this).click(function()
		{
			Hue.set_toggler(type, this)
		})
	})
}

Hue.open_togglers = function(type)
{
	$(`.${type}_toggle`).each(function()
	{
		Hue.set_toggler(type, this, "open", false)
	})

	Hue.update_modal_scrollbar(type)
}

Hue.close_togglers = function(type)
{
	$(`.${type}_toggle`).each(function()
	{
		Hue.set_toggler(type, this, "close", false)
	})

	Hue.update_modal_scrollbar(type)
}

Hue.show_top_scroller = function()
{
	$('#top_scroller_container').css('visibility', 'visible')
}

Hue.hide_top_scroller = function()
{
	$('#top_scroller_container').css('visibility', 'hidden')
}

Hue.show_bottom_scroller = function()
{
	$('#bottom_scroller_container').css('visibility', 'visible')
}

Hue.hide_bottom_scroller = function()
{
	$('#bottom_scroller_container').css('visibility', 'hidden')
}

Hue.scroll_chat_to = function(y, animate=true, d=500)
{
	$("#chat_area").stop()

	if(Hue.started && Hue.app_focused && animate && Hue.get_setting("animate_scroll"))
	{
		$("#chat_area").animate({scrollTop:y}, d, function()
		{
			Hue.check_scrollers()
		})
	}

	else
	{
		$("#chat_area").scrollTop(y)
	}
}

Hue.set_room_name = function(name)
{
	Hue.room_name = name
	Hue.config_admin_room_name()
}

Hue.set_room_images_mode = function(what)
{
	Hue.room_images_mode = what
	Hue.config_admin_room_images_mode()
}

Hue.set_room_tv_mode = function(what)
{
	Hue.room_tv_mode = what
	Hue.config_admin_room_tv_mode()
}

Hue.set_room_radio_mode = function(what)
{
	Hue.room_radio_mode = what
	Hue.config_admin_room_radio_mode()
}

Hue.set_room_synth_mode = function(what)
{
	Hue.room_synth_mode = what
	Hue.config_admin_room_synth_mode()
}

Hue.set_background_mode = function(what)
{
	Hue.background_mode = what
	Hue.config_admin_background_mode()
	Hue.apply_background()
	Hue.apply_theme()
}

Hue.set_background_effect = function(what)
{
	Hue.background_effect = what
	Hue.config_admin_background_effect()
	Hue.apply_background()
}

Hue.set_background_tile_dimensions = function(dimensions)
{
	Hue.background_tile_dimensions = dimensions
	Hue.config_admin_background_tile_dimensions()
}

Hue.set_privacy = function(what)
{
	Hue.is_public = what
	Hue.config_admin_privacy()
}

Hue.set_log_enabled = function(what)
{
	Hue.log_enabled = what
	Hue.config_admin_log_enabled()
}

Hue.needs_confirm = function(func, s=false)
{
	if(!s)
	{
		s = "Are you sure?"
	}

	let r = confirm(s)

	if(r)
	{
		Hue[func]()
	}
}

Hue.is_admin_or_op = function(rol=false)
{
	let r

	if(rol)
	{
		r = rol
	}

	else
	{
		r = Hue.role
	}

	if(r === "admin" || r === "op")
	{
		return true
	}

	else
	{
		return false
	}
}

Hue.show_import_settings = function()
{
	let s = `
	<div class='container_22'>
		Paste code generated by Export Settings
		<div class='spacer3'></div>
		<textarea id='import_settings_textarea' rows=5 class='setting_textarea'></textarea>
		<div class='spacer3'></div>
		<div class='menu_item inline action pointer' id='import_settings_apply'>Apply</div>
	</div>
	`

	Hue.msg_info2.show(["Import Settings", s], function()
	{
		$("#import_settings_textarea").focus()
		$("#import_settings_apply").click(function()
		{
			Hue.process_imported_settings()
		})

		Hue.imp = true
	})
}

Hue.process_imported_settings = function()
{
	let code = $("#import_settings_textarea").val().trim()

	if(code === "")
	{
		return false
	}

	try
	{
		eval(code)
	}

	catch(err)
	{
		alert("Code provided is invalid")
	}
}

Hue.show_export_settings = function()
{
	let gsettings = localStorage.getItem(Hue.ls_global_settings)
	let rsettings = localStorage.getItem(Hue.ls_room_settings)

	let code = `let gsettings = ${gsettings}; Hue.save_local_storage(Hue.ls_global_settings, gsettings); let rsettings = ${rsettings}; Hue.save_local_storage(Hue.ls_room_settings, rsettings); Hue.restart_client()`
	let code2 = `let gsettings = ${gsettings}; Hue.save_local_storage(Hue.ls_global_settings, gsettings); Hue.restart_client()`
	let code3 = `let rsettings = ${rsettings}; Hue.save_local_storage(Hue.ls_room_settings, rsettings); Hue.restart_client()`

	let s = `
	<div class='container_22'>
		In case you want to export your settings from one browser to another.
		<div class='spacer3'></div>
		You can import either Global Settings, Room Settings, or both.
		<div class='spacer3'></div>
		Room Settings copies every room's settings, not just the current one.
		<div class='spacer3'></div>
		To do this, copy one of the codes below, and paste it in Import Settings in the other browser.
		<div class='spacer3'></div>
		<div class='spacer3'></div>
		(a) Use this code if you want to import <span class='bold'>Global</span> and <span class='bold'>Room</span> Settings
		<div class='spacer3'></div>
		<textarea rows=5 class='setting_textarea'>${code}</textarea>
		<div class='spacer3'></div>
		<div class='spacer3'></div>
		(b) Use this code if you only want to import <span class='bold'>Global</span> Settings
		<div class='spacer3'></div>
		<textarea rows=5 class='setting_textarea'>${code2}</textarea>
		<div class='spacer3'></div>
		<div class='spacer3'></div>
		(c) Use this code if you only want to import <span class='bold'>Room</span> Settings
		<div class='spacer3'></div>
		<textarea rows=5 class='setting_textarea'>${code3}</textarea>
	</div>
	`

	Hue.msg_info2.show(["Export Settings", s])
}

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

	Hue.chat_announce(obj)
}

Hue.public_feedback = function(message, data=false)
{
	let obj =
	{
		brk: "<i class='icon2c fa fa-info-circle'></i>",
		message: message,
		save: true,
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

	Hue.chat_announce(obj)
}

Hue.make_unique_lines = function(s)
{
	let split = s.split('\n')
	split = split.filter((v,i) => split.indexOf(v) === i)
	s = split.join('\n')
	return s
}

Hue.add_separator = function(update_scroll=true)
{
	if(!Hue.get_setting("new_messages_separator"))
	{
		return false
	}

	if($(".new_messages_separator").length > 0)
	{
		return false
	}

	let messageclasses

	if(Hue.get_setting("chat_layout") === "normal")
	{
		messageclasses = "normal_layout"
	}

	else if(Hue.get_setting("chat_layout") === "compact")
	{
		messageclasses = "compact_layout"
	}

	let s = Hue.generate_vseparator("New Messages", "new_messages_separator")

	let sep = $(s)

	$("#chat_area").append(sep)

	if(update_scroll)
	{
		Hue.update_chat_scrollbar()
		Hue.goto_bottom()
	}
}

Hue.remove_separator = function(update_scroll=true)
{
	$(".new_messages_separator").each(function()
	{
		$(this).remove()
	})

	if(update_scroll)
	{
		Hue.update_chat_scrollbar()
		Hue.goto_bottom()
	}
}

Hue.start_soundcloud = function()
{
	try
	{
		let _soundcloud_player = SC.Widget("soundcloud_player")
		let _soundcloud_video_player = SC.Widget("media_soundcloud_video")
		
		_soundcloud_player.bind(SC.Widget.Events.READY, function()
		{
			Hue.soundcloud_player = _soundcloud_player

			if((Hue.last_radio_type && Hue.last_radio_type === "soundcloud") || Hue.current_radio().type === "soundcloud")
			{
				Hue.change({type:"radio", notify:false})
			}

			Hue.set_radio_volume(false, false)
		})

		_soundcloud_video_player.bind(SC.Widget.Events.READY, function()
		{
			Hue.soundcloud_video_player = _soundcloud_video_player

			if((Hue.last_tv_type && Hue.last_tv_type === "soundcloud") || Hue.current_tv().type === "soundcloud")
			{
				if(Hue.play_video_on_load)
				{
					Hue.change({type:"tv", notify:false, force:true, play:true})
				}

				else
				{
					Hue.change({type:"tv", notify:false})
				}
			}
		})
	}

	catch(err)
	{
		console.error("Soundcloud failed to load")
	}
}

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

Hue.announce_text_color_mode_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the text color mode to ${data.mode}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_text_color_mode(data.mode)
	Hue.apply_theme()
}

Hue.set_text_color_mode = function(mode)
{
	Hue.text_color_mode = mode
	Hue.config_admin_text_color_mode()
}

Hue.change_text_color = function(color)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	color = Hue.utilz.clean_string5(color)

	if(color === undefined)
	{
		return false
	}

	if(color.startsWith("rgba("))
	{
		color = Hue.utilz.clean_string5(Hue.colorlib.rgba_to_rgb(color))
	}

	if(!Hue.utilz.validate_rgb(color))
	{
		Hue.feedback("Not a valid rgb value")
		return false
	}

	if(color === Hue.text_color)
	{
		Hue.feedback("Text color is already set to that")
		return false
	}

	Hue.socket_emit("change_text_color", {color:color})
}

Hue.announce_text_color_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the text color to ${data.color}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_text_color(data.color)
	Hue.apply_theme()
}

Hue.set_text_color = function(color)
{
	Hue.text_color = color
	Hue.config_admin_text_color()
}

Hue.conditional_quotes = function(s)
{
	if(!s.includes(" ") && (s.startsWith("https://") || s.startsWith("http://")))
	{
		return s
	}

	else
	{
		return `"${s}"`
	}
}

Hue.restart_tv = function()
{
	Hue.change_tv_source("restart")
	Hue.msg_tv_picker.close()
}

Hue.restart_radio = function()
{
	Hue.change_radio_source("restart")
	Hue.msg_radio_picker.close()
}

Hue.background_image_enabled = function()
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

	if(!Hue.get_setting("background_image"))
	{
		return false
	}

	return true
}

Hue.setup_footer = function()
{
	$("#footer_images_icon").on("auxclick", function(e)
	{
		if(e.which === 2)
		{
			$("#image_file_picker").click()
		}
	})
}

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

Hue.ping_server = function()
{
	Hue.socket_emit("ping_server", {date:Date.now()})
}

Hue.pong_received = function(data)
{
	let d = (Date.now() - data.date)

	let ds

	if(d === 1)
	{
		ds = `${d} ms`
	}

	else
	{
		ds = `${d} ms`
	}

	Hue.feedback(`Pong: ${ds}`)
}

Hue.send_reaction = function(reaction_type)
{
	if(!Hue.can_chat)
	{
		Hue.feedback("You don't have permission to chat")
		return false
	}

	if(!Hue.reaction_types.includes(reaction_type))
	{
		return false
	}

	Hue.socket_emit("send_reaction", {reaction_type:reaction_type})

	Hue.hide_reactions()
}

Hue.show_reaction = function(data, date=false)
{
	let d

	if(date)
	{
		d = date
	}

	else
	{
		d = Date.now()
	}

	let icon
	let message

	if(data.reaction_type === "like")
	{
		icon = "<i class='icon2c fa fa-thumbs-o-up'></i>"
		message = `likes this`
	}

	else if(data.reaction_type === "love")
	{
		icon = "<i class='icon2c fa fa-heart-o'></i>"
		message = `loves this`
	}

	else if(data.reaction_type === "happy")
	{
		icon = "<i class='icon2c fa fa-smile-o'></i>"
		message = `is feeling happy`
	}

	else if(data.reaction_type === "meh")
	{	
		icon = "<i class='icon2c fa fa-meh-o'></i>"
		message = `is feeling meh`
	}

	else if(data.reaction_type === "sad")
	{
		icon = "<i class='icon2c fa fa-frown-o'></i>"
		message = `is feeling sad`
	}

	else if(data.reaction_type === "dislike")
	{
		icon = "<i class='icon2c fa fa-thumbs-o-down'></i>"
		message = `dislikes this`
	}

	else
	{
		return false
	}

	let f = function()
	{
		Hue.show_profile(data.username, data.profile_image)
	}
	
	Hue.update_chat(
	{
		brk: icon,
		message: message,
		username: data.username,
		prof_image: data.profile_image,
		third_person: true,
		date: d
	})
}

Hue.setup_reactions_box = function()
{
	$("#footer_user_menu_container").hover(

	function()
	{
		clearTimeout(Hue.hide_reactions_timeout)
	
		Hue.show_reactions_timeout = setTimeout(function()
		{
			Hue.show_reactions()
		}, Hue.reactions_hover_delay)
	},
	
	function()
	{
		Hue.start_hide_reactions()
	})

	$("#reactions_box_container").hover(
	
	function()
	{
		Hue.mouse_over_reactions = true
		clearTimeout(Hue.hide_reactions_timeout)
	},
	
	function()
	{
		Hue.mouse_over_reactions = false
		Hue.start_hide_reactions()
	})
}

Hue.start_hide_reactions = function()
{
	clearTimeout(Hue.show_reactions_timeout)

	Hue.hide_reactions_timeout = setTimeout(function()
	{
		if(Hue.mouse_over_reactions)
		{
			return false
		}

		Hue.hide_reactions()
	}, Hue.reactions_hover_delay)
}

Hue.show_reactions = function()
{
	$("#reactions_box_container").css("display", "flex")
}

Hue.hide_reactions = function()
{
	$("#reactions_box_container").css("display", "none")
}

Hue.run_user_function = function(n)
{
	if(!Hue.user_functions.includes(n))
	{
		return false
	}

	if(Hue.get_setting(`user_function_${n}`))
	{
		Hue.execute_commands(`user_function_${n}`)
	}

	else
	{
		Hue.feedback(`User Function ${n} doesn't do anything yet. You can set what it does in the User Settings`)
	}
	
	Hue.hide_reactions()
}

Hue.set_tv_display_percentage = function(v, type)
{
	if(v === undefined || type === undefined)
	{
		return false
	}

	if(v === "default")
	{
		v = Hue.global_settings_default_tv_display_percentage
	}

	v = parseInt(v)

	if(!Number.isInteger(v))
	{
		return false
	}

	if(v < 10)
	{
		v = 10
	}

	else if(v > 90)
	{
		v = 90
	}

	$(`#${type}_tv_display_percentage`).nstSlider('set_position', v)
}

Hue.set_chat_display_percentage = function(v, type)
{
	if(v === undefined || type === undefined)
	{
		return false
	}

	if(v === "default")
	{
		v = Hue.global_settings_default_chat_display_percentage
	}

	v = parseInt(v)

	if(!Number.isInteger(v))
	{
		return false
	}

	if(v < 10)
	{
		v = 10
	}

	else if(v > 90)
	{
		v = 90
	}

	$(`#${type}_chat_display_percentage`).nstSlider('set_position', v)
}

Hue.apply_media_percentages = function()
{
	let p1 = Hue.get_setting("tv_display_percentage")
	let p2 = (100 - p1)

	$("#media_tv").css("height", `${p1}%`)
	$("#media_image").css("height", `${p2}%`)

	let c1 = Hue.get_setting("chat_display_percentage")
	let c2 = (100 - c1)

	$("#chat_main").css("width", `${c1}%`)
	$("#media").css("width", `${c2}%`)

	Hue.on_resize()
}

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

	Hue.fix_media_margin()
}

Hue.swap_display_positions_2 = function()
{
	let p = Hue.get_setting("tv_display_position")

	let np

	if(p === "top")
	{
		np = "bottom"
	}

	else if(p === "bottom")
	{
		np = "top"
	}

	if(Hue.active_settings("tv_display_position") !== "room_settings")
	{
		Hue.enable_setting_override("tv_display_position")
	}

	Hue.swap_display_positions("room_settings", np)
}

Hue.swap_display_positions = function(type, np=false)
{	
	if(!np)
	{
		let p = Hue[type].tv_display_position

		if(p === "top")
		{
			np = "bottom"
		}

		else if(p === "bottom")
		{
			np = "top"
		}
	}

	Hue[type].tv_display_position = np
	Hue[`save_${type}`]()
	
	Hue.arrange_media_setting_display_positions(type)
	Hue.apply_media_positions()
}

Hue.arrange_media_setting_display_positions = function(type)
{
	let p = Hue[type].tv_display_position

	let tvo
	let imo

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

Hue.lock_screen = function(save=true)
{
	Hue.process_lockscreen_lights_off()
	Hue.msg_lockscreen.show()

	if(Hue.get_setting("afk_on_lockscreen"))
	{
		Hue.afk = true
		Hue.app_focused = false
	}

	Hue.execute_commands("on_lockscreen")

	if(save)
	{
		Hue.room_state.screen_locked = true
		Hue.save_room_state()
	}
}

Hue.unlock_screen = function(save=true)
{
	Hue.msg_lockscreen.close()

	if(Hue.get_setting("afk_on_lockscreen"))
	{
		Hue.afk = false 
		Hue.app_focused = true
		Hue.on_app_focused()
	}

	Hue.execute_commands("on_unlockscreen")

	if(save)
	{
		Hue.room_state.screen_locked = false
		Hue.save_room_state()
	}
}

Hue.setup_message_area = function()
{
	Hue.draw_message_context = $("#draw_message_area")[0].getContext("2d")
	
	Hue.clear_draw_message_state()

	$('#draw_message_area').mousedown(function(e)
	{
		Hue.draw_message_just_entered = false
		Hue.draw_message_add_click(e.offsetX, e.offsetY, false)
		Hue.redraw_draw_message()
	})

	$('#draw_message_area').mousemove(function(e)
	{
		if(Hue.mouse_is_down)
		{
			Hue.draw_message_add_click(e.offsetX, e.offsetY, !Hue.draw_message_just_entered)
			Hue.redraw_draw_message()
		}

		Hue.draw_message_just_entered = false
	})

	$('#draw_message_area').mouseenter(function(e)
	{
		Hue.draw_message_just_entered = true
	})
}

Hue.redraw_draw_message = function()
{
	Hue.canvas_redraw
	({
		context: Hue.draw_message_context, 
		click_x: Hue.draw_message_click_x, 
		click_y: Hue.draw_message_click_y, 
		drag: Hue.draw_message_drag
	})
}

Hue.clear_draw_message_state = function()
{
	Hue.draw_message_click_x = []
	Hue.draw_message_click_y = []
	Hue.draw_message_drag = []

	Hue.draw_message_context.clearRect(0, 0, Hue.draw_message_context.canvas.width, Hue.draw_message_context.canvas.height)
}

Hue.draw_message_add_click = function(x, y, dragging)
{
	Hue.draw_message_click_x.push(x)
	Hue.draw_message_click_y.push(y)
	Hue.draw_message_drag.push(dragging)

	if(Hue.draw_message_click_x.length > Hue.draw_coords_max_array_length)
	{
		Hue.draw_message_click_x.shift()
		Hue.draw_message_click_y.shift()
		Hue.draw_message_drag.shift()
	}
}

Hue.canvas_redraw = function(args={})
{
	let def_args =
	{
		context: false,
		click_x: false,
		click_y: false,
		drag: false,
		bg_color: false,
		colors: false,
		sizes: false,
		sector_index: false,
		type: false
	}

	Hue.fill_defaults(args, def_args)

	if(args.sector_index === false)
	{
		args.sector_index = args.click_x.length
	}

	args.context.clearRect(0, 0, args.context.canvas.width, args.context.canvas.height)
	
	args.context.lineJoin = "round"

	let draw_bg = true

	if(args.type === "draw_image")
	{
		Hue.draw_image_context.putImageData(Hue.draw_image_current_snapshot.data, 0, 0)
	}

	if(args.bg_color && draw_bg)
	{
		args.context.fillStyle = args.bg_color;
		
		args.context.fillRect(0, 0, args.context.canvas.width, args.context.canvas.height)
	}

	for(let i=0; i<args.sector_index; i++) 
	{
		args.context.beginPath()

		if(args.drag[i] && i)
		{
			args.context.moveTo(args.click_x[i - 1], args.click_y[i - 1])
		}

		else
		{
			args.context.moveTo(args.click_x[i] -1, args.click_y[i])
		}

		args.context.lineTo(args.click_x[i], args.click_y[i])
		
		args.context.closePath()

		if(args.colors)
		{
			args.context.strokeStyle = args.colors[i]
		}

		else
		{
			args.context.strokeStyle = $("#draw_message_area").css("color")
		}

		if(args.sizes)
		{
			args.context.lineWidth = args.sizes[i]
		}

		else
		{
			args.context.lineWidth = 2
		}

		args.context.stroke()
	}
}

Hue.open_draw_image = function()
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have permission to draw images")
		return false
	}

	Hue.msg_draw_image.show()
}

Hue.draw_image_scale_fix = function(n)
{
	return parseInt(Math.round(n * Hue.draw_image_scale))
}

Hue.draw_image_add_sector = function()
{
	Hue.draw_image_current_snapshot.sectors.push(Hue.draw_image_current_snapshot.click_x.length)
}

Hue.setup_draw_image = function()
{
	Hue.draw_image_context = $("#draw_image_area")[0].getContext("2d")

	Hue.draw_image_context.scale(Hue.draw_image_scale, Hue.draw_image_scale)
	
	Hue.clear_draw_image_state()

	$('#draw_image_area').mousedown(function(e)
	{
		if(Hue.draw_image_mode === "bucket")
		{
			return false
		}

		Hue.draw_image_just_entered = false

		Hue.draw_image_check_increase_snapshot()
		Hue.draw_image_add_sector()
		Hue.draw_image_add_click(e.offsetX, e.offsetY, false)
		Hue.redraw_draw_image()
	})

	$('#draw_image_area').mousemove(function(e)
	{
		if(Hue.mouse_is_down)
		{
			Hue.draw_image_add_click(e.offsetX, e.offsetY, !Hue.draw_image_just_entered)
			Hue.redraw_draw_image()
		}

		Hue.draw_image_just_entered = false
	})

	$('#draw_image_area').mouseenter(function(e)
	{
		Hue.draw_image_just_entered = true
	})

	$("#draw_image_area").click(function(e)
	{
		if(Hue.draw_image_mode === "bucket")
		{
			let result = Hue.draw_image_bucket_fill(Hue.draw_image_scale_fix(e.offsetX), Hue.draw_image_scale_fix(e.offsetY))

			if(result)
			{
				Hue.draw_image_check_redo()
				Hue.increase_draw_image_snapshot(result)
			}
		}
	})

	Hue.draw_image_prepare_settings()
}

Hue.draw_image_prepare_settings = function()
{
	Hue.draw_image_pencil_color = "rgb(51, 51, 51)"
	Hue.draw_image_bucket_color = "rgb(72, 152, 183)"
	Hue.draw_image_pencil_size = 4

	Hue.set_draw_image_mode_input("pencil")

	$("#draw_image_pencil_color").spectrum(
	{
		preferredFormat: "rgb",
		color: Hue.draw_image_pencil_color,
		appendTo: "#draw_image_main",
		showInput: true,
		showPalette: true,
		palette: 
		[
			["rgba(0, 0, 0, 0)"]
		],
		showSelectionPalette: true,
		maxSelectionSize: 15,
		show: function()
		{
			Hue.set_draw_image_mode_input("pencil")
		},	
		clickoutFiresChange: false,
		change: function(color)
		{
			Hue.draw_image_pencil_color = color.toRgbString()
		}
	})

	$("#draw_image_bucket_color").spectrum(
	{
		preferredFormat: "rgb",
		color: Hue.draw_image_bucket_color,
		appendTo: "#draw_image_main",
		showInput: true,
		showPalette: true,
		palette: 
		[
			["rgba(0, 0, 0, 0)"]
		],
		showSelectionPalette: true,
		maxSelectionSize: 15,
		show: function()
		{
			Hue.set_draw_image_mode_input("bucket")
		},
		clickoutFiresChange: false,
		change: function(color)
		{
			Hue.draw_image_bucket_color = color.toRgbString()
		}
	})

	$("#draw_image_pencil_size").find('option').each(function()
	{
		if($(this).val() == Hue.draw_image_pencil_size)
		{
			$(this).prop('selected', true)
		}
	})

	$("#draw_image_pencil_size").change(function()
	{
		Hue.draw_image_pencil_size = $(this).val()
	})
}

Hue.set_draw_image_mode_input = function(m)
{
	if(m === "pencil")
	{
		$("#draw_image_mode_select_pencil").addClass("modal_icon_selected")
		$("#draw_image_mode_select_bucket").removeClass("modal_icon_selected")
	}

	else if(m === "bucket")
	{
		$("#draw_image_mode_select_bucket").addClass("modal_icon_selected")
		$("#draw_image_mode_select_pencil").removeClass("modal_icon_selected")
	}

	Hue.draw_image_mode = m
}

Hue.increase_draw_image_snapshot = function(data)
{
	let level = Hue.draw_image_current_snapshot.level + 1

	Hue.draw_image_snapshots[`level_${level}`] = 
	{
		level: level,
		data: data,
		click_x: [],
		click_y: [],
		drag: [],
		color_array: [],
		size_array: [],
		sectors: [],
		sector_index: 0
	}

	Hue.draw_image_current_snapshot = Hue.draw_image_snapshots[`level_${level}`]

	let keys = Object.keys(Hue.draw_image_snapshots)

	if(keys.length > Hue.draw_image_max_levels)
	{
		let lowest_key = keys.length

		for(let key in Hue.draw_image_snapshots)
		{
			let snapshot = Hue.draw_image_snapshots[key]

			if(snapshot.level < lowest_key)
			{
				lowest_key = snapshot.level
			}
		}

		delete Hue.draw_image_snapshots[`level_${lowest_key}`]
	}
}

Hue.clear_draw_image_state = function()
{
	let context = Hue.draw_image_context

	context.fillStyle = "rgb(255, 255, 255)";
	 		
	context.fillRect(0, 0, context.canvas.width, context.canvas.height)

	Hue.draw_image_snapshots =
	{
		level_0:
		{
			level: 0,
			data: Hue.draw_image_get_image_data(),
			click_x: [],
			click_y: [],
			drag: [],
			color_array: [],
			size_array: [],
			sectors: [],
			sector_index: 0
		}
	} 

	Hue.draw_image_current_snapshot = Hue.draw_image_snapshots["level_0"]
}

Hue.redraw_draw_image = function()
{
	Hue.canvas_redraw
	({
		context: Hue.draw_image_context, 
		click_x: Hue.draw_image_current_snapshot.click_x, 
		click_y: Hue.draw_image_current_snapshot.click_y, 
		drag: Hue.draw_image_current_snapshot.drag, 
		colors: Hue.draw_image_current_snapshot.color_array,
		sizes: Hue.draw_image_current_snapshot.size_array,
		sector_index: Hue.draw_image_current_snapshot.sector_index,
		type: "draw_image"
	})
}

Hue.draw_image_clean_redo = function(i)
{
	Hue.draw_image_current_snapshot.click_x = Hue.draw_image_current_snapshot.click_x.slice(0, i)
	Hue.draw_image_current_snapshot.click_y = Hue.draw_image_current_snapshot.click_y.slice(0, i)
	Hue.draw_image_current_snapshot.color_array = Hue.draw_image_current_snapshot.color_array.slice(0, i)
	Hue.draw_image_current_snapshot.size_array = Hue.draw_image_current_snapshot.size_array.slice(0, i)
	Hue.draw_image_current_snapshot.drag = Hue.draw_image_current_snapshot.drag.slice(0, i)

	let new_sectors = []

	for(let sector of Hue.draw_image_current_snapshot.sectors)
	{
		if(sector <= i)
		{
			new_sectors.push(sector)
		}
	}

	Hue.draw_image_current_snapshot.sectors = new_sectors

	for(let level in Hue.draw_image_snapshots)
	{
		if(Hue.draw_image_snapshots[level].level > Hue.draw_image_current_snapshot.level)
		{
			delete Hue.draw_image_snapshots[level]
		}
	}
}

Hue.draw_image_has_levels_above = function()
{
	let level = Hue.draw_image_current_snapshot.level

	for(let key in Hue.draw_image_snapshots)
	{
		if(Hue.draw_image_snapshots[key].level > level)
		{
			return true
		}
	}

	return false
}

Hue.draw_image_check_redo = function()
{
	if(Hue.draw_image_current_snapshot.click_x.length !== Hue.draw_image_current_snapshot.sector_index || Hue.draw_image_has_levels_above())
	{
		Hue.draw_image_clean_redo(Hue.draw_image_current_snapshot.sector_index)
	}
}

Hue.draw_image_get_image_data = function()
{
	let context = Hue.draw_image_context
	let w = context.canvas.width
	let h = context.canvas.height
	let data = Hue.draw_image_context.getImageData(0, 0, w, h)

	return data
}

Hue.draw_image_check_increase_snapshot = function()
{
	if(Hue.draw_image_current_snapshot.click_x.length === Hue.draw_image_current_snapshot.sector_index && !Hue.draw_image_has_levels_above())
	{
		if(Hue.draw_image_current_snapshot.click_x.length >= Hue.draw_image_num_strokes_save)
		{
			let sector = Hue.draw_image_current_snapshot.sectors[Hue.draw_image_current_snapshot.sectors.length - 1]
			Hue.draw_image_clean_redo(sector)
			Hue.increase_draw_image_snapshot(Hue.draw_image_get_image_data())
		}
	}
}

Hue.draw_image_add_click = function(x, y, dragging)
{
	Hue.draw_image_check_redo()

	Hue.draw_image_current_snapshot.click_x.push(x)
	Hue.draw_image_current_snapshot.click_y.push(y)
	Hue.draw_image_current_snapshot.color_array.push(Hue.draw_image_pencil_color)
	Hue.draw_image_current_snapshot.size_array.push(Hue.draw_image_pencil_size)
	Hue.draw_image_current_snapshot.drag.push(dragging)

	Hue.draw_image_current_snapshot.sector_index = Hue.draw_image_current_snapshot.click_x.length
}

Hue.upload_draw_image = function()
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have permission to change images")
		return false
	}

	if(Hue.draw_image_current_snapshot.level === 0 && Hue.draw_image_current_snapshot.click_x.length === 0)
	{
		return false
	}

	$("#draw_image_area")[0].toBlob(function(blob)
	{
		blob.name = "draw_image.png"
		Hue.upload_file(blob, "image_upload")
		Hue.msg_draw_image.close()
	}, 'image/png', 0.95)
}

Hue.clear_draw_image_func = function()
{
	Hue.clear_draw_image_state()
}

Hue.draw_image_undo = function()
{
	if(Hue.draw_image_current_snapshot.sector_index > 0)
	{
		for(let sector of Hue.draw_image_current_snapshot.sectors.slice(0).reverse())
		{
			if(sector < Hue.draw_image_current_snapshot.sector_index)
			{
				Hue.draw_image_current_snapshot.sector_index = sector
				Hue.redraw_draw_image()
				break
			}
		}
	}

	else
	{
		let level = Hue.draw_image_current_snapshot.level - 1

		if(Hue.draw_image_snapshots[`level_${level}`] !== undefined)
		{	
			Hue.draw_image_current_snapshot.sector_index = 0
			Hue.draw_image_current_snapshot = Hue.draw_image_snapshots[`level_${level}`]
			Hue.draw_image_current_snapshot.sector_index = Hue.draw_image_current_snapshot.click_x.length

			Hue.redraw_draw_image()
		}
	}
}

Hue.draw_image_redo = function()
{
	if(Hue.draw_image_current_snapshot.sector_index < Hue.draw_image_current_snapshot.click_x.length)
	{
		let found = false

		for(let sector of Hue.draw_image_current_snapshot.sectors)
		{
			if(sector > Hue.draw_image_current_snapshot.sector_index)
			{
				Hue.draw_image_current_snapshot.sector_index = sector
				Hue.redraw_draw_image()
				found = true
				break
			}
		}

		if(!found)
		{
			if(Hue.draw_image_current_snapshot.sector_index !== Hue.draw_image_current_snapshot.click_x.length)
			{
				Hue.draw_image_current_snapshot.sector_index = Hue.draw_image_current_snapshot.click_x.length
				Hue.redraw_draw_image()
			}
		}
	}

	else
	{
		let level = Hue.draw_image_current_snapshot.level + 1

		if(Hue.draw_image_snapshots[`level_${level}`] !== undefined)
		{
			Hue.draw_image_current_snapshot.sector_index = Hue.draw_image_current_snapshot.click_x.length
			Hue.draw_image_current_snapshot = Hue.draw_image_snapshots[`level_${level}`]
			Hue.draw_image_current_snapshot.sector_index = 0
			
			Hue.redraw_draw_image()
		}
	}
}

Hue.clone_image_data_object = function(image_data)
{
	let copy = new ImageData
	(
		new Uint8ClampedArray(image_data.data),
		image_data.width,
		image_data.height
	)

	return copy	
}

Hue.draw_image_bucket_fill = function(x, y)
{
	let context = Hue.draw_image_context
	
	let w = context.canvas.width 
	
	let h = context.canvas.height 

	let image_data = Hue.draw_image_get_image_data()

	let data = image_data.data

	let node = [y, x]

	let target_color = Hue.get_canvas_node_color(data, node, w)

	let replacement_color = Hue.colorlib.rgb_to_array(Hue.draw_image_bucket_color)

	replacement_color.push(255)

	if(Hue.canvas_node_color_is_equal(target_color, replacement_color))
	{
		return false
	}

	let q = []

	data = Hue.set_canvas_node_color(data, node, replacement_color, w)

	q.push(node)

	while(q.length)
	{
		let n = q.shift()

		if(n[1] > 0)
		{
			let nn = [n[0], n[1] - 1]

			let nn_color = Hue.get_canvas_node_color(data, nn, w)

			if(Hue.canvas_node_color_is_equal(nn_color, target_color))
			{
				data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
				q.push(nn)
			}
		}

		if(n[1] < w - 1)
		{
			let nn = [n[0], n[1] + 1]
			
			let nn_color = Hue.get_canvas_node_color(data, nn, w)

			if(Hue.canvas_node_color_is_equal(nn_color, target_color))
			{
				data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
				q.push(nn)
			}
		}

		if(n[0] > 0)
		{
			let nn = [n[0] - 1, n[1]]
			
			let nn_color = Hue.get_canvas_node_color(data, nn, w)

			if(Hue.canvas_node_color_is_equal(nn_color, target_color))
			{
				data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
				q.push(nn)
			}
		}

		if(n[0] < h - 1)
		{
			let nn = [n[0] + 1, n[1]]
			
			let nn_color = Hue.get_canvas_node_color(data, nn, w)

			if(Hue.canvas_node_color_is_equal(nn_color, target_color))
			{
				data = Hue.set_canvas_node_color(data, nn, replacement_color, w)
				q.push(nn)
			}
		}
	}

	image_data.data = data

	context.putImageData(image_data, 0, 0)

	return image_data
}

Hue.get_canvas_node_index = function(data, node, w)
{
	return ((node[0] * w) + node[1]) * 4
}

Hue.get_canvas_node_color = function(data, node, w)
{
	let index = Hue.get_canvas_node_index(data, node, w)

	return [data[index], data[index + 1], data[index + 2], data[index + 3]]
}

Hue.set_canvas_node_color = function(data, node, values, w)
{
	let index = Hue.get_canvas_node_index(data, node, w)

	data[index] = values[0]
	data[index + 1] = values[1]
	data[index + 2] = values[2]
	data[index + 3] = values[3]

	return data
}

Hue.canvas_node_color_is_equal = function(a1, a2)
{
	let diff = 10

	let c1 = Math.abs(a1[0] - a2[0]) <= diff
	let c2 = Math.abs(a1[1] - a2[1]) <= diff
	let c3 = Math.abs(a1[2] - a2[2]) <= diff

	let alpha = Math.abs(a1[3] - a2[3]) <= diff

	return (c1 && c2 && c3 && alpha)
}

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

Hue.draw_image_change_mode = function()
{
	if(Hue.draw_image_mode === "pencil")
	{
		Hue.set_draw_image_mode_input("bucket")
	}

	else if(Hue.draw_image_mode === "bucket")
	{
		Hue.set_draw_image_mode_input("pencil")
	}
}

Hue.setup_autocomplete = function()
{
	$("body").on("keydown", "textarea, input[type='text']", function(e)
	{
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

	$("body").on("click", "textarea, input[type='text']", function(e)
	{
		Hue.clear_tabbed(this)
	})
}

Hue.setup_settings_window = function()
{
	$(".settings_main_window").on("click", ".settings_window_category", function(e)
	{
		Hue.change_settings_window_category(this)
	})
}

Hue.change_settings_window_category = function(element)
{
	let main = $(element).closest(".settings_main_window")

	main.find(".settings_window_category").each(function()
	{
		$(this).find(".settings_window_category_text").eq(0).removeClass("border_bottom")
		$(this).data("selected_category", false)
	})

	$(element).find(".settings_window_category_text").eq(0).addClass("border_bottom")
	$(element).data("selected_category", true)

	main.find(".settings_window_category_container_selected").each(function()
	{
		$(this).removeClass("settings_window_category_container_selected")
		$(this).addClass("settings_window_category_container")
	})

	let container = $(`#${$(element).data("category_container")}`)

	container.removeClass("settings_window_category_container")
	container.addClass("settings_window_category_container_selected")
}

Hue.set_loaded_settings_state = function()
{
	loaded_chat_layout = Hue.get_setting("chat_layout")
}

Hue.check_maxers = function()
{
	if(Hue.room_tv_mode !== "disabled" && Hue.room_images_mode !== "disabled")
	{
		$(".maxer_container").css("display", "flex")
	}

	else
	{
		$(".maxer_container").css("display", "none")
	}
}

Hue.show_credits = function()
{
	Hue.msg_credits.show(function()
	{
		if(!Hue.credits_audio)
		{
			Hue.credits_audio = new Audio()
			Hue.credits_audio.src = Hue.credits_audio_url
			Hue.credits_audio.setAttribute("loop", true)
			Hue.credits_audio.play()
		}

		else
		{
			Hue.credits_audio.currentTime = 0
			Hue.credits_audio.play()
		}
	})
}

Hue.prepare_media_settings = function()
{
	Hue.apply_media_percentages()
	Hue.apply_media_positions()
}

Hue.set_media_sliders = function(type)
{
	Hue.set_tv_display_percentage(Hue[type].tv_display_percentage, type)
	Hue.set_chat_display_percentage(Hue[type].chat_display_percentage, type)
}

Hue.image_prev = function()
{
	Hue.change_image_source("prev")
	Hue.msg_image_picker.close()
}

Hue.tv_prev = function()
{
	Hue.change_tv_source("prev")
	Hue.msg_tv_picker.close()
}

Hue.radio_prev = function()
{
	Hue.change_radio_source("prev")
	Hue.msg_radio_picker.close()
}

Hue.setup_user_function_titles = function()
{	
	let n = $(".user_function_button").length

	if(n === 0)
	{
		return false
	}

	for(let i=1; i<n+1; i++)
	{
		let t = Hue.utilz.clean_string2(Hue.get_setting(`user_function_${i}`)).substring(0, 100)
		
		if(!t)
		{
			t = "Empty User Function. Set what it does in the User Settings"
		}

		let name = Hue.get_setting(`user_function_${i}_name`)
		
		$(`#user_function_button_${i}`).text(name)
		$(`#user_function_button_${i}`).attr("title", t)
	}
}

Hue.on_room_created = function(data)
{
	let onclick = function()
	{
		Hue.show_open_room(data.id)
	}

	Hue.feedback("Room Created",
	{
		brk: "<i class='icon2c fa fa-key'></i>",
		onclick: onclick,
		save: true
	})

	Hue.show_open_room(data.id)
}

Hue.toggle_settings_windows = function(type)
{
	let type2

	if(type === "global_settings")
	{
		type2 = "room_settings"
	}

	else if(type === "room_settings")
	{
		type2 = "global_settings"
	}

	else
	{
		return false
	}

	Hue[`msg_${type2}`].close(function()
	{
		$(`#settings_window_left_${type2} .settings_window_category`).each(function()
		{
			let el = this

			if($(el).data("selected_category"))
			{
				$(`#settings_window_left_${type} .settings_window_category`).each(function()
				{
					if($(el).data("category") === $(this).data("category"))
					{
						if(!$(this).data("selected_category"))
						{
							$(this).click()
							
							return false
						}
					}
				})

				return false
			}
		})

		Hue[`show_${type}`]()
	})
}

Hue.toggle_rooms_windows = function(type)
{
	let type2

	if(type === "public_roomlist")
	{
		type2 = "visited_roomlist"
	}

	else if(type === "visited_roomlist")
	{
		type2 = "public_roomlist"
	}

	else
	{
		return false
	}

	Hue[`msg_${type2}`].close(function()
	{
		Hue.request_roomlist('', type)
	})
}

Hue.toggle_media_history_windows = function(type)
{
	let type2

	if(type === "image_history")
	{
		type2 = "radio_history"
	}

	else if(type === "tv_history")
	{
		type2 = "image_history"
	}

	else if(type === "radio_history")
	{
		type2 = "tv_history"
	}

	else
	{
		return false
	}

	Hue[`msg_${type2}`].close(function()
	{
		Hue[`show_${type}`]()
	})
}

Hue.toggle_menu_windows = function(type)
{
	let type2

	if(type === "main_menu")
	{
		type2 = "user_menu"
	}

	else if(type === "user_menu")
	{
		type2 = "main_menu"
	}

	else
	{
		return false
	}

	Hue[`msg_${type2}`].close(function()
	{
		Hue[`show_${type}`]()
	})
}

Hue.send_system_restart_signal = function()
{
	Hue.socket_emit("system_restart_signal", {})
}

Hue.setup_command_aliases = function()
{
	let aliases = Hue.get_setting("aliases").split("\n")

	Hue.command_aliases = {}

	for(let alias of aliases)
	{
		let pieces = alias.split("=")

		if(pieces.length < 2)
		{
			continue
		}

		let name = pieces[0].trim()

		if(name.length < 2)
		{
			continue
		}

		if(name[0] === "/" && name[1] !== "/")
		{
			let body = pieces.slice(1).join("=").trim()

			Hue.command_aliases[name] = body
		}
	}
}

Hue.format_command_aliases = function(cmds)
{
	let aliases = cmds.split("\n")

	let s = ""

	for(let alias of aliases)
	{
		let pieces = alias.split("=")

		if(pieces.length < 2)
		{
			continue
		}

		let name = `/${Hue.utilz.clean_string5(pieces[0]).replace(/\//g, "")}`

		if(name[0] !== "/")
		{
			name = "/" + name
		}
		
		let body = pieces.slice(1).join("=").trim()

		s += `${name} = ${body}\n`
	}

	return s.slice(0, -1)
}

Hue.open_url_menu = function(src)
{
	let n = 50

	let s

	if(src.length > n)
	{
		s = `${src.substring(0, n)}...`
	}

	else
	{
		s = src
	}

	Hue.msg_info2.show([s, Hue.template_open_url()], function()
	{
		$("#open_url_menu_open").click(function()
		{
			Hue.goto_url(src, "tab")
			Hue.msg_info2.close()
		})

		$("#open_url_menu_copy").click(function()
		{
			Hue.copy_string(src)
			Hue.msg_info2.close()
		})
	})
}

Hue.sdeb = function(s, show_date=false)
{
	if(show_date)
	{
		console.info(Hue.nice_date())
	}

	for(let line of `${s}`.split("\n"))
	{
		console.info(`>${line}<`)
	}

	console.info("-------------")
}

Hue.run_commands_queue = function(id)
{
	let cmds = Hue.commands_queue[id]

	if(!cmds || cmds.length === 0)
	{
		delete Hue.commands_queue[id]
		return false
	}

	let cmd = cmds.shift()

	let lc_cmd = cmd.toLowerCase()

	let obj = 	
	{
		message: cmd,
		to_history: false,
		clr_input: false,
		callback: function()
		{
			Hue.run_commands_queue(id)
		}
	}

	if(lc_cmd.startsWith("/sleep") || lc_cmd === "/sleep")
	{
		let n = parseInt(lc_cmd.replace("/sleep ", ""))

		if(isNaN(n))
		{
			n = 1000
		}

		setTimeout(function()
		{
			Hue.run_commands_queue(id)
		}, n)
	}

	else if(lc_cmd === "/closeandwait")
	{
		Hue.close_all_modals(function()
		{
			Hue.run_commands_queue(id)
		})
	}

	else if(lc_cmd === "/inputenter")
	{
		let val = $('#input').val()

		if(val.length > 0)
		{
			obj.message = val
			obj.clr_input = true
			Hue.process_message(obj)
		}

		else
		{
			Hue.run_commands_queue(id)
		}
	}

	else
	{
		Hue.process_message(obj)
	}
}

Hue.setup_user_function_switch_selects = function()
{
	$(".user_function_switch_select").each(function()
	{
		$(this).change(function()
		{
			let num2 = $(this).find("option:selected").val()

			if(num2 == "0")
			{
				return false
			}

			let num = $(this).data("number")
			let type = $(this).data("type")

			let o_user_function = Hue[type][`user_function_${num}`]
			let o_user_function_name = Hue[type][`user_function_${num}_name`]

			let n_user_function = Hue[type][`user_function_${num2}`]
			let n_user_function_name = Hue[type][`user_function_${num2}_name`]

			if(o_user_function_name === Hue[`global_settings_default_user_function_${num}_name`])
			{
				o_user_function_name = Hue[`global_settings_default_user_function_${num2}_name`]
			}

			if(n_user_function_name === Hue[`global_settings_default_user_function_${num2}_name`])
			{
				n_user_function_name = Hue[`global_settings_default_user_function_${num}_name`]
			}

			Hue[type][`user_function_${num}`] = n_user_function
			Hue[type][`user_function_${num}_name`] = n_user_function_name

			Hue[type][`user_function_${num2}`] = o_user_function
			Hue[type][`user_function_${num2}_name`] = o_user_function_name

			$(`#${type}_user_function_${num}`).val(Hue[type][`user_function_${num}`])
			$(`#${type}_user_function_${num}_name`).val(Hue[type][`user_function_${num}_name`])

			$(`#${type}_user_function_${num2}`).val(Hue[type][`user_function_${num2}`])
			$(`#${type}_user_function_${num2}_name`).val(Hue[type][`user_function_${num2}_name`])

			$(this).find('option').each(function()
			{
				if($(this).val() == "0")
				{
					$(this).prop('selected', true)
				}
			})

			if(Hue.active_settings(`user_function_${num}`) === type 
			|| Hue.active_settings(`user_function_${num2}`) === type
			|| Hue.active_settings(`user_function_${num}_name`) === type
			|| Hue.active_settings(`user_function_${num2}_name`) === type)
			{
				Hue.setup_user_function_titles()
			}

			Hue[`save_${type}`]()
		})
	})
}

Hue.generate_words_to_autocomplete = function()
{
	let susernames = []

	for(let uname of Hue.usernames)
	{
		susernames.push(`${uname}'s`)
	}

	let words = Hue.commands
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

Hue.inspect_command = function(cmd)
{
	if(!cmd.startsWith("/"))
	{
		cmd = `/${cmd}`
	}
	
	let s = `${cmd} `

	if(Hue.command_aliases[cmd] !== undefined)
	{
		s += `is an alias to: "${Hue.command_aliases[cmd]}"`
	}

	else if(Hue.commands.includes(cmd))
	{
		s += `is a normal command`
	}

	else
	{
		s += ` is not a valid command`
	}

	Hue.feedback(s)
}

Hue.setup_before_unload = function()
{
	window.onbeforeunload = function(e) 
	{
		if(!Hue.user_leaving && Hue.get_setting("warn_before_closing"))
		{
			return "Are you sure?"
		}
	}
}

Hue.modify_setting = function(arg, show_feedback=true)
{
	let split = arg.split(" ")

	if(split.length < 2)
	{
		return false
	}

	let setting = split[0]

	if(Hue.user_settings[setting] === undefined)
	{
		return false
	}
	
	let value = split.slice(1).join(" ")

	if(value === "true")
	{
		value = true
	}

	else if(value === "false")
	{
		value = false
	}

	else if(!isNaN(value))
	{
		value = Number(value)
	}

	let type = Hue.active_settings(setting)

	if(Hue[type][setting] === value)
	{
		if(show_feedback)
		{
			Hue.feedback(`Setting "${setting}" is already set to that`)
		}
		
		return false
	}

	Hue[type][setting] = value

	if(Hue.user_settings[setting].widget_type === "custom")
	{
		if(setting === "tv_display_position")
		{
			Hue.arrange_media_setting_display_positions(type)
			Hue.apply_media_positions()
		}

		else if(setting === "tv_display_percentage" || "chat_display_percentage")
		{
			Hue.set_media_sliders(type)
			Hue.apply_media_percentages()
		}
	}

	else
	{	
		Hue.modify_setting_widget(type, setting)

		Hue[`setting_${setting}_action`](type, false)
	}

	Hue[`save_${type}`]()

	if(show_feedback)
	{
		Hue.feedback(`Setting "${setting}" succesfully modified`)
	}
}

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

Hue.request_admin_activity = function(filter="")
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.admin_activity_filter_string = filter

	Hue.socket_emit("get_admin_activity", {})
}

Hue.show_admin_activity = function(messages)
{
	$("#admin_activity_container").html("")
	
	Hue.msg_admin_activity.show(function()
	{
		for(let message of messages)
		{
			let el = $(`
			<div class='modal_item admin_activity_item'>
				<div class='admin_activity_message'></div>
				<div class='admin_activity_date'></div>
			</div>`)

			el.find(".admin_activity_message").eq(0).text(`${message.data.username} ${message.data.content}`)
			el.find(".admin_activity_date").eq(0).text(Hue.nice_date(message.date))

			$("#admin_activity_container").prepend(el)
		}

		$("#admin_activity_filter").val(Hue.admin_activity_filter_string)

		Hue.do_modal_filter()
	})
}

Hue.start_jump_events = function(container_id, msg_instance)
{
	$(`#${container_id}`).on("click", ".jump_button", function()
	{
		let id = $(this).closest(".jump_button_container").data("message_id")

		$(".message").each(function()
		{
			if($(this).data("message_id") === id)
			{
				let el = this

				el.scrollIntoView({block:"center"})

				$(el).addClass("highlighted2")

				setTimeout(function()
				{
					$(el).removeClass("highlighted2")
				}, 2000)

				Hue.close_all_modals()

				return false
			}
		})
	})
}

Hue.setup_jumpers = function()
{
	Hue.start_jump_events("chat_search_container", Hue.msg_chat_search)
	Hue.start_jump_events("highlights_container", Hue.msg_highlights)
}

Hue.clear_room = function(data)
{
	Hue.clear_chat()

	Hue.chat_history = []

	Hue.images_changed = Hue.images_changed.slice(-1)
	Hue.tv_changed = Hue.tv_changed.slice(-1)
	Hue.radio_changed = Hue.radio_changed.slice(-1)

	$("#image_history_container").children().slice(1).remove()
	$("#tv_history_container").children().slice(1).remove()
	$("#radio_history_container").children().slice(1).remove()

	Hue.announce_image(Hue.current_image())
	Hue.announce_tv(Hue.current_tv())
	Hue.announce_radio(Hue.current_radio())

	Hue.show_topic()
}

Hue.fillet = function(n)
{
	for(let i=0; i<n; i++)
	{
		Hue.feedback("Some feedback")
	}
}

Hue.start_active_media = function()
{
	Hue.change({type:"image"})
	Hue.change({type:"tv"})
	Hue.change({type:"radio"})
}

Hue.input_is_scrolled = function()
{
	let el = $("#input")[0]
	return el.clientHeight < el.scrollHeight
}

Hue.check_prevent_default = function(e)
{
	let keys = 
	[
		"F1", "F2",
		"F3", "F4"
	]

	if(keys.includes(e.key))
	{
		e.preventDefault()
	}
}

Hue.start_reply_events = function(container_id, msg_instance)
{
	$("#chat_area").on("mouseup", ".chat_content", function(e)
	{
		if(e.button === 1)
		{
			if($(e.target).is("a"))
			{
				return false
			}

			let max = 100

			let uname = $(this).closest(".chat_message").data("uname")

			let text = $(this).text()

			let add_dots = text.length > max

			text = text.substring(0, max)

			if(add_dots)
			{
				text += "..."
			}

			text = `*"${Hue.utilz.clean_string2(text)}"*`

			if(uname)
			{
				text = `${uname} said: ${text}`
			}

			if(Hue.is_command(text))
			{
				text = `/${text}`
			}

			Hue.goto_bottom(true, false)

			Hue.process_message({message:text, to_history:false})

			e.preventDefault()
		}
	})
}

Hue.replace_markdown = function(message, type="chat")
{
	let text
	let chat_content

	if(type === "chat")
	{
		chat_content = $(message).find(".chat_content").eq(0)
		text = chat_content.html()
	}

	else if(type === "whisper")
	{
		chat_content = $(message).find(".message_info_text").eq(0)
		text = chat_content.html()
	}

	let changed = false

	text = text.replace(/\[whisper\s+(.*?)\](.*?)\[\/whisper\]/gm, function(g1, g2, g3)
	{
		changed = true
		return `<span class="whisper_link" data-whisper="${g2}" title="[Whisper] ${g2}">${g3.replace(/\s+/, "&nbsp;")}</span>`
	})

	text = text.replace(/(^|\s)(\*+)(?!\s)([^*]*[^*\s])\2(?!\S)/gm, function(g1, g2, g3, g4)
	{
		let n = g3.length

		if(n === 1)
		{
			changed = true
			return `${g2}<span class='italic'>${g4}</span>`
		}

		else if(n === 2)
		{
			changed = true
			return `${g2}<span class='bold'>${g4}</span>`
		}

		else if(n === 3)
		{
			changed = true
			return `${g2}<span class='italic bold'>${g4}</span>`
		}
	})

	text = text.replace(/(^|\s)(\_+)(?!\s)([^_]*[^_\s])\2(?!\S)/gm, function(g1, g2, g3, g4)
	{
		let n = g3.length

		if(n === 1)
		{
			changed = true
			return `${g2}<span class='underlined'>${g4}</span>`
		}
	})

	if(changed)
	{
		chat_content.html(text)
	}

	return message
}

Hue.set_user_settings_titles = function()
{
	for(let setting in Hue.user_settings)
	{
		$(`#global_settings_${setting}`).attr("title", setting)
		$(`#room_settings_${setting}`).attr("title", setting)
	}
}

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

Hue.maxers_mouse_events = function()
{
	let f = function(e)
	{
		if(e.ctrlKey || e.shiftKey)
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

				else if(Hue.images_is_maximized())
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

				else if(Hue.images_is_maximized())
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

	let f2 = function(e)
	{
		if(e.ctrlKey || e.shiftKey)
		{
			return false
		}

		if(Hue.num_media_elements_visible() < 1)
		{
			return false
		}

		let direction = e.deltaY > 0 ? 'down' : 'up'

		if(direction === 'up')
		{
			Hue.maxer_wheel_timer(Hue.increase_media_percentage)
		}

		else if(direction === 'down')
		{
			Hue.maxer_wheel_timer(Hue.decrease_media_percentage)
		}
	}

	$("#chat_maxer")[0].addEventListener("wheel", f2)

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
			Hue.set_default_media_size()
		}
	})
}

Hue.set_default_tv_size = function()
{
	Hue.do_media_tv_size_change(Hue.global_settings_default_tv_display_percentage)	
}

Hue.set_default_media_size = function()
{
	Hue.do_chat_size_change(Hue.global_settings_default_chat_display_percentage)
}

Hue.increase_tv_percentage = function()
{
	let size = Hue.get_setting("tv_display_percentage")
	
	size += 10
	size = Hue.utilz.round2(size, 10)

	Hue.do_media_tv_size_change(size)
}

Hue.decrease_tv_percentage = function()
{
	let size = Hue.get_setting("tv_display_percentage")
	
	size -= 10
	size = Hue.utilz.round2(size, 10)

	Hue.do_media_tv_size_change(size)
}

Hue.unmaximize_media = function()
{
	if(Hue.tv_is_maximized())
	{
		Hue.maximize_tv()
	}

	else if(Hue.images_is_maximized())
	{
		Hue.maximize_images()
	}
}

Hue.do_media_tv_size_change = function(size)
{
	if(size < 0 || size > 100)
	{
		return false
	}

	if(size === 0)
	{
		if(!Hue.images_is_maximized())
		{
			Hue.maximize_images()
			Hue.show_infotip("Image Maximized")
		}

		return
	}

	if(size === 100)
	{
		if(!Hue.tv_is_maximized())
		{
			Hue.maximize_tv()
			Hue.show_infotip("TV Maximized")
		}

		return
	}

	if(size !== Hue.get_setting("tv_display_percentage"))
	{
		if(Hue.active_settings("tv_display_percentage") !== "room_settings")
		{
			Hue.enable_setting_override("tv_display_percentage")
		}

		Hue.modify_setting(`tv_display_percentage ${size}`, false)
	}
	
	Hue.notify_media_tv_size_change(size)
}

Hue.notify_media_tv_size_change = function(size)
{
	let info

	if(size === Hue.global_settings_default_tv_display_percentage)
	{
		info = " (Default)"
	}

	else
	{
		info = ""
	}

	Hue.show_infotip(`TV Size: ${size}%${info}`)
}

Hue.increase_media_percentage = function()
{
	let size = Hue.get_setting("chat_display_percentage")
	size += 10
	size = Hue.utilz.round2(size, 10)
	Hue.do_chat_size_change(size)
}

Hue.decrease_media_percentage = function()
{
	let size = Hue.get_setting("chat_display_percentage")
	size -= 10
	size = Hue.utilz.round2(size, 10)
	Hue.do_chat_size_change(size)
}

Hue.do_chat_size_change = function(size)
{
	if(size < 10 || size > 90)
	{
		return false
	}

	if(size !== Hue.get_setting("chat_display_percentage"))
	{
		Hue.enable_setting_override("chat_display_percentage")
		Hue.modify_setting(`chat_display_percentage ${size}`, false)
	}

	Hue.notify_chat_size_change(size)
}

Hue.notify_chat_size_change = function(size)
{
	let info

	if(size === Hue.global_settings_default_chat_display_percentage)
	{
		info = " (Default)"
	}

	else
	{
		info = ""
	}

	Hue.show_infotip(`Chat Size: ${size}%${info}`)
}

Hue.show_infotip = function(s)
{
	$("#infotip").text(s)
	$("#infotip_container").css("display", "block")
	Hue.infotip_timer()
}

Hue.hide_infotip = function()
{
	$("#infotip_container").css("display", "none")
}

Hue.infotip_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.hide_infotip()
		}, Hue.hide_infotip_delay)
	}
})()

Hue.change_background_effect = function(effect)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	if(
		effect !== "none" && 
		effect !== "blur")
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

Hue.announce_background_effect_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the background effect to ${data.effect}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_background_effect(data.effect)
}

Hue.enable_setting_override = function(setting)
{
	if(Hue.room_settings[`${setting}_override`])
	{
		return false
	}

	$(`#room_settings_${setting}_overrider`).click()
}

Hue.wrap_function = function(func, name)
{
	let wrapped = function()
	{
		let date = dateFormat(Date.now(), "h:MM:ss:l")
		console.info(`${date} | Running: ${name}`)
		return func(...arguments)
	}

	return wrapped
}

Hue.wrap_functions = function()
{
	for(let i in Hue)
	{
		if(i === "wrap_functions" || i === "wrap_function")
		{
			continue
		}

		let p = Hue[i]
		
		if(typeof p === "function")
		{
			Hue[i] = Hue.wrap_function(p, i)
		}
	}
}

Hue.check_domain_list = function(media_type, src)
{
	let list_type = Hue[`${media_type}_domain_white_or_black_list`]

	if(list_type !== "white" && list_type !== "black")
	{
		return false
	}

	let list = Hue[`${media_type}_domain_list`]

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

Hue.request_admin_list = function()
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("get_admin_list", {})
}

Hue.show_admin_list = function(data)
{
	let s = $("<div id='admin_list_container'></div>")

	let i = 0

	data.list.sort(Hue.compare_userlist)

	for(let user of data.list)
	{
		i += 1

		let hs = "<span class='admin_list_username'></span>&nbsp;&nbsp;<span class='admin_list_role'></span>"

		let h = $(`<div class='admin_list_item'>${hs}</div>`)

		h.find(".admin_list_username").eq(0).text(user.username)
		h.find(".admin_list_role").eq(0).text(`(${Hue.get_pretty_role_name(user.role)})`)

		h.click(function()
		{
			Hue.show_profile(user.username)
		})

		if(i < data.list.length)
		{
			h = h.add("<div class='spacer3'></div>")
		}

		s.append(h)
	}

	Hue.msg_info2.show(["Admin List", s[0]], function()
	{
		Hue.alo = true
	})
}

Hue.request_access_log = function(filter="")
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.access_log_filter_string = filter

	Hue.socket_emit("get_access_log", {})
}

Hue.show_access_log = function(messages)
{
	$("#access_log_container").html("")
	
	Hue.msg_access_log.show(function()
	{
		for(let message of messages)
		{
			let el = $(`
			<div class='modal_item access_log_item'>
				<div class='access_log_message'></div>
				<div class='access_log_date'></div>
			</div>`)

			el.find(".access_log_message").eq(0).text(`${message.data.username} ${message.data.content}`)
			el.find(".access_log_date").eq(0).text(Hue.nice_date(message.date))

			$("#access_log_container").prepend(el)
		}

		$("#access_log_filter").val(Hue.access_log_filter_string)

		Hue.do_modal_filter()
	})
}

Hue.check_screen_lock = function()
{
	if(Hue.room_state.screen_locked)
	{
		Hue.lock_screen(false)
	}
}

Hue.trigger_activity = function()
{
	Hue.socket_emit("activity_trigger", {})
}

Hue.sort_userlist_by_activity_trigger = function(a, b)
{
	if(a.last_activity_trigger < b.last_activity_trigger)
	{
		return -1
	}

	if(a.last_activity_trigger > b.last_activity_trigger)
	{
		return 1
	}

	return 0
}

Hue.setup_activity_bar = function()
{
	let sorted_userlist = Hue.userlist.slice(0)

	sorted_userlist.sort(Hue.sort_userlist_by_activity_trigger)

	for(let user of sorted_userlist)
	{
		Hue.push_to_activity_bar(user.username, user.last_activity_trigger)
	}

	setInterval(function()
	{
		Hue.check_activity_bar()
	}, Hue.activity_bar_interval)

	setInterval(function()
	{
		if(Hue.app_focused)
		{
			Hue.trigger_activity()
		}
	}, Hue.activity_bar_trigger_interval)

	if(Hue.get_setting("activity_bar"))
	{
		Hue.show_activity_bar()
	}

	else
	{
		Hue.hide_activity_bar()
	}

	$("#activity_bar_container").on("click", ".activity_bar_item", function()
	{
		Hue.show_profile($(this).data("username"))
	})
}

Hue.check_activity_bar = function(update=true)
{
	if(Hue.activity_list.length === 0)
	{
		return false
	}

	let d = Date.now() - Hue.max_activity_bar_delay

	let new_top = []

	let changed = false

	for(let item of Hue.activity_list)
	{
		let user = Hue.get_user_by_username(item.username)

		if
		(
			item.date > d &&
			user && 
			!Hue.user_is_ignored(item.username)
		)
		{
			new_top.push(item)
		}

		else
		{
			changed = true
		}
	}

	if(changed)
	{
		Hue.activity_list = new_top
		
		if(update)
		{
			Hue.update_activity_bar()
		}
	}

	return changed
}

Hue.toggle_activity_bar = function()
{
	let new_setting

	if(Hue.get_setting("activity_bar"))
	{
		Hue.hide_activity_bar()
		new_setting = false
	}

	else
	{
		Hue.show_activity_bar()
		new_setting = true
	}

	Hue.enable_setting_override("activity_bar")
	Hue.modify_setting(`activity_bar ${new_setting}`, false)
}

Hue.show_activity_bar = function()
{
	$("#activity_bar_container").css("display", "block")
	$("#topbox_left_icon").removeClass("fa-caret-up")
	$("#topbox_left_icon").addClass("fa-caret-down")

	$("#synth_container").css("top", "4rem")
	$("#recent_voice_box").css("top", "4rem")
	$("#infotip_container").css("top", "4rem")

	Hue.apply_theme()
	Hue.update_activity_bar()
	Hue.on_resize()
}

Hue.hide_activity_bar = function()
{
	$("#activity_bar_container").css("display", "none")
	$("#topbox_left_icon").removeClass("fa-caret-down")
	$("#topbox_left_icon").addClass("fa-caret-up")

	$("#synth_container").css("top", "2rem")
	$("#recent_voice_box").css("top", "2rem")
	$("#infotip_container").css("top", "2rem")

	Hue.apply_theme()
	Hue.on_resize()
}

Hue.compare_activity_list = function(a, b)
{
	if(a.username < b.username)
	{
		return -1
	}

	if(a.username > b.username)
	{
		return 1
	}

	return 0
}

Hue.update_activity_bar = function()
{
	if(!Hue.get_setting("activity_bar"))
	{
		return false
	}

	let c = $("#activity_bar_content")

	c.html("")

	if(Hue.activity_list.length)
	{
		let sorted_list = Hue.activity_list.slice(0).sort(Hue.compare_activity_list)

		for(let item of sorted_list)
		{
			let user = Hue.get_user_by_username(item.username)

			if(user)
			{
				let pi = user.profile_image || Hue.default_profile_image_url

				let h = $(`
				<div class='activity_bar_item action'>
					<div class='activity_bar_image_container'>
						<img class='activity_bar_image' src='${pi}'>
					</div>
					<div class='activity_bar_text'></div>
				</div>`)

				let text_el = h.find(".activity_bar_text").eq(0)
				let img_el = h.find(".activity_bar_image").eq(0)

				img_el.on("error", function()
				{
					if($(this).attr("src") !== Hue.default_profile_image_url)
					{
						$(this).attr("src", Hue.default_profile_image_url)
					}
				})

				text_el.text(user.username)

				h.data("username", user.username)

				h.attr("title", item.username)

				c.append(h)
			}
		}
	}

	else
	{
		c.text("No Recent Activity")
	}
}

Hue.push_to_activity_bar = function(uname, date)
{
	let user = Hue.get_user_by_username(uname)

	if(!user || !Hue.check_permission(user.role, "chat"))
	{
		return false
	}

	let d = Date.now() - Hue.max_activity_bar_delay

	if(date < d)
	{
		return false
	}

	if(Hue.user_is_ignored(uname))
	{
		return false
	}

	for(let i=0; i<Hue.activity_list.length; i++)
	{
		if(Hue.activity_list[i].username === uname)
		{
			Hue.activity_list.splice(i, 1)
			break
		}
	}

	Hue.activity_list.unshift({username:uname, date:date})

	if(Hue.activity_list.length > Hue.max_activity_bar_items)
	{
		Hue.activity_list.pop()
	}

	Hue.check_activity_bar(false)

	if(Hue.started)
	{
		Hue.update_activity_bar()
	}
}

Hue.focus_edit_area = function()
{
	if(Hue.editing_message_area !== document.activeElement)
	{
		Hue.editing_message_area.focus()
	}
}

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

Hue.edit_last_message = function(reverse=false)
{
	let found = false
	let edit_found = true
	let last_container = false

	if(Hue.editing_message)
	{
		edit_found = false
	}

	$($(".message").get().reverse()).each(function()
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

	Hue.update_chat_scrollbar()
	Hue.check_scrollers()
}

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
	
	Hue.editing_message = false
	Hue.editing_message_container = false
	Hue.editing_message_area = false

	Hue.chat_scroll_bottom(false, false)
}

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
		Hue.remove_message(edit_id)
		return false
	}

	if(third_person)
	{
		new_message = `/me ${new_message}`
	}

	Hue.process_message({message:new_message, edit_id:edit_id})
}

Hue.remove_message = function(id)
{
	if(!Hue.started_safe)
	{
		return false
	}

	let r = confirm("Are you sure you want to remove this message?")

	if(r)
	{
		Hue.send_remove_message(id)
	}
}

Hue.send_remove_message = function(id)
{
	Hue.socket_emit("remove_message", {id:id})
}

Hue.remove_message_from_chat = function(data)
{
	$(".chat_content_container").each(function()
	{
		if($(this).data("id") == data.id)
		{
			let message = $(this).closest(".message")

			if(message.hasClass("thirdperson"))
			{
				Hue.remove_from_chat_history(message)
				message.remove()
			}

			else
			{
				if($(this).closest(".chat_container").find(".chat_content_container").length === 1)
				{
					Hue.remove_from_chat_history(message)
					message.remove()
				}

				else
				{
					$(this).remove()
					Hue.replace_in_chat_history(message)
				}
			}

			return false
		}
	})

	Hue.chat_scroll_bottom(false, false)
}

Hue.setup_iframe_video = function()
{
	$("#media_iframe_poster").click(function()
	{
		Hue.play_video()
	})
}

Hue.setup_synth = function()
{
	Hue.synth = new Tone.Synth(
	{
		oscillator:
		{
		  	type : 'triangle8'
		},
			envelope : {
			attack : 2,
			decay : 1,
			sustain: 0.4,
			release: 4
		}
	}).toMaster()

	Hue.synth_voice = window.speechSynthesis

	$("#synth_container").on("mouseenter", function()
	{
		Hue.show_synth()
	})

	$("#synth_container").on("mouseleave", function()
	{
		Hue.hide_synth()
	})

	$("#synth_content").on("mousedown", ".synth_key", function()
	{
		$(this).addClass("synth_key_pressed")
	})

	$("#synth_content").on("mouseup mouseleave", ".synth_key", function()
	{
		$(this).removeClass("synth_key_pressed")
	})

	$("#synth_content").on("click", ".synth_key", function()
	{
		let key = $(this).attr("id").replace("synth_key_", "")
		Hue.send_synth_key(key)
	})

	$("#synth_content").on("auxclick", ".synth_key", function(e)
	{
		if(e.which === 2)
		{
			let key = $(this).attr("id").replace("synth_key_", "")

			let name = Hue.synth_key_names[key]

			if(name)
			{
				Hue.send_synth_voice(name)
			}
		}
	})

	$("#synth_key_button_volume").click(function()
	{
		Hue.set_synth_muted()
	})

	$("#synth_voice_input").on("focus", function()
	{
		Hue.synth_voice_input_focused = true
	})

	$("#synth_voice_input").on("blur", function()
	{
		Hue.synth_voice_input_focused = false

		if(!Hue.mouse_on_synth)
		{
			Hue.hide_synth()
		}
	})

	Hue.set_synth_muted(Hue.room_state.synth_muted)
}

Hue.set_synth_muted = function(what=undefined)
{
	let what2

	if(what === undefined)
	{
		Hue.room_state.synth_muted = !Hue.room_state.synth_muted
		what2 = Hue.room_state.synth_muted
	}

	else
	{
		what2 = what
	}

	if(what2)
	{
		$("#synth_volume_icon").removeClass("fa-volume-up")
		$("#synth_volume_icon").addClass("fa-volume-off")
		Hue.clear_synth_voice_queue()
	}

	else
	{
		$("#synth_volume_icon").removeClass("fa-volume-off")
		$("#synth_volume_icon").addClass("fa-volume-up")
	}

	Hue.save_room_state()
}

Hue.show_synth = function()
{
	if(Hue.can_synth && Hue.get_setting("synth_enabled"))
	{
		Hue.mouse_on_synth = true

		clearTimeout(Hue.synth_timeout_2)

		Hue.synth_timeout = setTimeout(function()
		{
			$("#synth_content_container").css("display", "flex")

			Hue.synth_open = true
		}, Hue.synth_timeout_delay)
	}
}

Hue.hide_synth = function()
{
	Hue.mouse_on_synth = false

	if(Hue.synth_voice_input_focused)
	{
		return false
	}
	
	clearTimeout(Hue.synth_timeout)

	Hue.synth_timeout_2 = setTimeout(function()
	{
		$("#synth_content_container").css("display", "none")
		
		Hue.clear_synth_voice()
		Hue.synth_open = false
	}, Hue.synth_timeout_delay)
}

Hue.send_synth_key = function(key)
{
	if(!Hue.can_synth || Hue.room_state.synth_muted)
	{
		return false
	}

	key = parseInt(key)

	if(key < 1 || key > Hue.utilz.synth_notes.length)
	{
		return false
	}

	Hue.play_synth_key(key)
	Hue.socket_emit("send_synth_key", {key:key})
}

Hue.play_synth_key = function(n)
{
	let key = Hue.utilz.synth_notes[n - 1]

	if(key)
	{
		Hue.synth.triggerAttackRelease(key, 0.1)
	}
}

Hue.receive_synth_key = function(data)
{
	if(!Hue.room_state.synth_muted && Hue.get_setting("synth_enabled"))
	{
		if(Hue.afk && Hue.get_setting("afk_disable_synth"))
		{
			return false
		}

		if(Hue.user_is_ignored(data.username))
		{
			return false
		}

		if(data.user_id !== Hue.user_id)
		{
			Hue.play_synth_key(data.key)
		}
		
		Hue.push_to_synth_recent_users(data, "key")
	}
}

Hue.push_to_synth_recent_users = function(data, type)
{
	let changed = false

	let usernames = Hue.synth_recent_users.map(x => x.username)

	let obj = {username:data.username, type:type, date:Date.now()}

	if(!usernames.includes(data.username))
	{
		Hue.synth_recent_users.unshift(obj)
		changed = true
	}

	else
	{
		for(let i=0; i<usernames.length; i++)
		{
			let username = usernames[i]
			
			if(username === data.username)
			{
				Hue.synth_recent_users.splice(i, 1)
				break
			}
		}

		Hue.synth_recent_users.unshift(obj)
		changed = true
	}

	if(Hue.synth_recent_users.length > Hue.synth_max_recent_users)
	{
		Hue.synth_recent_users = Hue.synth_recent_users.slice(0, Hue.synth_max_recent_users)
		changed = true
	}

	if(changed)
	{
		let s = Hue.synth_recent_users.map(x => x.username).join(", ")
		$("#synth_key_button_volume").attr("title", s)
	}
}

Hue.send_synth_voice = function(text=false)
{
	if(!Hue.can_synth || Hue.room_state.synth_muted)
	{
		return false
	}

	if(!text)
	{
		text = Hue.utilz.clean_string2($("#synth_voice_input").val())
	}

	if(text.length === 0 || text.length > Hue.synth_max_voice_text)
	{
		return false
	}

	Hue.clear_synth_voice()
	Hue.socket_emit("send_synth_voice", {text:text})
}

Hue.receive_synth_voice = function(data)
{
	if(!Hue.room_state.synth_muted && Hue.get_setting("synth_enabled"))
	{
		if(Hue.afk && Hue.get_setting("afk_disable_synth"))
		{
			return false
		}

		if(Hue.user_is_ignored(data.username))
		{
			return false
		}

		Hue.play_synth_voice(data.text, data.username)
		Hue.push_to_synth_recent_users(data, "voice")
	}
}

Hue.play_synth_voice = function(text, username, local=false)
{
	let speech = new SpeechSynthesisUtterance(text)

	if(!local)
	{
		speech.onstart = function()
		{
			Hue.show_voice_box(username)
		}

		speech.onend = function()
		{
			if(!Hue.synth_voice.pending && !Hue.synth_voice.speaking)
			{
				Hue.hide_voice_box()
				Hue.synth_voice_speeches = []
			}
		}
	}

	Hue.synth_voice.speak(speech)

	if(!local)
	{
		Hue.synth_voice_speeches.push(speech)
	}
}

Hue.clear_synth_voice = function()
{
	$("#synth_voice_input").val("")
}

Hue.clear_synth_voice_queue = function()
{
	Hue.synth_voice.cancel()
}

Hue.show_console_message = function()
{
	let s = "🤔 Want to work with us? It's pretty much 99.99% risks, some negligible fraction AI, a couple bureaucracies to keep people minimally pissed off, and a whole lot of creativity."
	let style = "font-size:1.4rem"
	
	console.info(`%c${s}`, style)
}

Hue.show_voice_box = function(username)
{
	let s = `
	<div class='recent_voice_box_item'>
		<i class='fa fa-volume-up'></i>&nbsp;&nbsp;${Hue.make_html_safe(username)}
	</div>`

	$("#recent_voice_box_content").html(s)
	$("#recent_voice_box").css("display", "flex")
}

Hue.hide_voice_box = function()
{
	$("#recent_voice_box").css("display", "none")
}

Hue.add_linebreak_to_input = function()
{
	Hue.add_to_input("\n")
	Hue.scroll_input_to_bottom()
}

Hue.scroll_input_to_bottom = function()
{
	let input = $("#input")[0]
	input.scrollTop = input.scrollHeight
}

Hue.toggle_lockscreen_lights_off = function()
{
	Hue.room_state.lockscreen_lights_off = !Hue.room_state.lockscreen_lights_off
	Hue.process_lockscreen_lights_off()
	Hue.save_room_state()
}

Hue.process_lockscreen_lights_off = function()
{
	if(Hue.room_state.lockscreen_lights_off)
	{
		Hue.lockscreen_turn_lights_off()
	}

	else
	{
		Hue.lockscreen_turn_lights_on()
	}
}

Hue.lockscreen_turn_lights_off = function()
{
	$("#lockscreen_body").addClass("black_background_color")
	$("#lockscreen_titulo_menu").addClass("black_background_color")
	$("#lockscreen_principal").addClass("grey_font_color")
	$("#lockscreen_lights_off_button").addClass("grey_font_color")
	$("#lockscreen_icon_menu").addClass("grey_background_color_parent")
	$("#lockscreen_lights_off_button").text("Turn Lights On")
}

Hue.lockscreen_turn_lights_on = function()
{
	$("#lockscreen_body").removeClass("black_background_color")
	$("#lockscreen_titulo_menu").removeClass("black_background_color")	
	$("#lockscreen_lights_off_button").text("Turn Lights Off")
	$("#lockscreen_principal").removeClass("grey_font_color")
	$("#lockscreen_lights_off_button").removeClass("grey_font_color")
	$("#lockscreen_icon_menu").removeClass("grey_background_color_parent")
}

Hue.expand_image = function(src)
{
	Hue.msg_expand_image.show()
	$("#expand_image").attr("src", src)
}

Hue.hide_expand_image = function()
{
	Hue.msg_expand_image.close()
}