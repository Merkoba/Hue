// Main Hue Object
// All client variables and functions go here
const Hue = {}

// This enables information about socket calls to the server in the console
// Setting it to true is recommended
Hue.debug_socket = true

// This wraps all functions with a function
// It shows every triggered function name
// This is mainly to check for loops
// Should be false unless debugging
Hue.debug_functions = false

// This enables or disables script loading
// This should be always true unless developing without an internet connection
Hue.load_scripts = true

// Initial variables declarations
Hue.config = {}
Hue.ls_global_settings = "global_settings_v1"
Hue.ls_room_settings = "room_settings_v1"
Hue.ls_room_state = "room_state_v1"
Hue.ls_input_history = "input_history_v17"
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
Hue.userlist = []
Hue.usernames = []
Hue.role = ''
Hue.can_chat = false
Hue.can_images = false
Hue.can_radio = false
Hue.can_tv = false
Hue.tab_info = {}
Hue.create_room_open = false
Hue.open_room_open = false
Hue.radio_picker_open = false
Hue.tv_picker_open = false
Hue.image_picker_open = false
Hue.goto_room_open = false
Hue.import_settings_open = false
Hue.background_image_input_open = false
Hue.admin_list_open = false
Hue.ban_list_open = false
Hue.upload_comment_open = false
Hue.modal_image_number_open = false
Hue.change_user_username_open = false
Hue.change_user_password_open = false
Hue.change_user_email_open = false
Hue.media_menu_open = false
Hue.writing_reply = false
Hue.modal_open = false
Hue.started = false
Hue.started_safe = false
Hue.afk = false
Hue.alert_mode = 0
Hue.commands_sorted = {}
Hue.commands_sorted_2 = {}
Hue.utilz = Utilz()
Hue.wordz = Wordz()
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
Hue.chat_content_container_id = 0
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
Hue.current_image_data = {}
Hue.filter_delay = 350
Hue.resize_delay = 350
Hue.double_tap_delay = 250
Hue.wheel_delay = 100
Hue.wheel_delay_2 = 25
Hue.check_scrollers_delay = 100
Hue.requesting_roomlist = false
Hue.emit_queue = []
Hue.app_focused = true
Hue.message_unames = ""
Hue.message_type = ""
Hue.users_to_disconnect = []
Hue.stop_radio_delay = 0
Hue.aura_timeouts = {}
Hue.reaction_types = ["like", "love", "happy", "meh", "sad", "dislike"]
Hue.mouse_over_reactions = false
Hue.reactions_hover_delay = 500
Hue.reactions_hover_delay_2 = 1000
Hue.user_functions = [1, 2, 3, 4, 5, 6, 7, 8]
Hue.speeches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
Hue.local_storage_to_save = {}
Hue.local_storage_save_delay = 250
Hue.sending_whisper = false
Hue.small_scroll_amount = 250
Hue.fresh_messages_list = []
Hue.max_fresh_messages = 100
Hue.fresh_messages_duration = 2000
Hue.autoscrolling = false
Hue.chat_scrolled = false
Hue.lockscreen_peek_delay = 1000
Hue.lockscreen_peek_active = false
Hue.context_menu_open = false
Hue.upload_comment_file = false
Hue.upload_comment_type = false
Hue.just_tabbed = false
Hue.update_input_placeholder_delay = 10000
Hue.update_lockscreen_clock_delay = 10000
Hue.screen_locked = false
Hue.userlist_mode = "normal"
Hue.usercount = 0
Hue.quote_max_length = 200
Hue.markdown_regexes = {}
Hue.url_title_max_length = 50
Hue.show_media_history_type = ""
Hue.add_to_chat_searches_delay = 2000
Hue.reactions_box_open = false
Hue.first_media_change = false
Hue.calc_round_places = 10
Hue.media_icons = {image: "fa-camera", tv: "fa-television", radio: "fa-volume-up"}

// Initial media-loading variables declarations
Hue.youtube_loading = false
Hue.youtube_loaded = false
Hue.youtube_player_requested = false
Hue.youtube_player_request = false
Hue.youtube_video_player_requested = false
Hue.youtube_video_player_request = false
Hue.twitch_loading = false
Hue.twitch_loaded = false
Hue.twitch_video_player_requested = false
Hue.twitch_video_player_request = false
Hue.soundcloud_loading = false
Hue.soundcloud_loaded = false
Hue.soundcloud_player_requested = false
Hue.soundcloud_video_player_requested = false
Hue.soundcloud_video_player_request = false
Hue.vimeo_loading = false
Hue.vimeo_loaded = false
Hue.vimeo_video_player_requested = false
Hue.vimeo_video_player_request = false
Hue.hls_loading = false
Hue.tone_loading = false
Hue.math_loading = false

// User settings object
// Used to generate global and room settings
// And to declare what widget is used in the settings windows
Hue.user_settings =
{
	background_image: {widget_type:"checkbox"},
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
	accept_commands_from: {widget_type:"textarea"},
	ignored_words: {widget_type:"textarea"},
	show_joins: {widget_type:"checkbox"},
	show_parts: {widget_type:"checkbox"},
	animate_scroll: {widget_type:"checkbox"},
	afk_disable_messages_beep: {widget_type:"checkbox"},
	afk_disable_highlights_beep: {widget_type:"checkbox"},
	afk_disable_media_change_beep: {widget_type:"checkbox"},
	afk_disable_joins_beep: {widget_type:"checkbox"},
	afk_disable_image_change: {widget_type:"checkbox"},
	afk_disable_tv_change: {widget_type:"checkbox"},
	afk_disable_radio_change: {widget_type:"checkbox"},
	afk_disable_synth: {widget_type:"checkbox"},
	afk_disable_notifications: {widget_type:"checkbox"},
	open_popup_messages: {widget_type:"checkbox"},
	user_function_1: {widget_type:"textarea"},
	user_function_2: {widget_type:"textarea"},
	user_function_3: {widget_type:"textarea"},
	user_function_4: {widget_type:"textarea"},
	user_function_5: {widget_type:"textarea"},
	user_function_6: {widget_type:"textarea"},
	user_function_7: {widget_type:"textarea"},
	user_function_8: {widget_type:"textarea"},
	user_function_1_name: {widget_type:"text"},
	user_function_2_name: {widget_type:"text"},
	user_function_3_name: {widget_type:"text"},
	user_function_4_name: {widget_type:"text"},
	user_function_5_name: {widget_type:"text"},
	user_function_6_name: {widget_type:"text"},
	user_function_7_name: {widget_type:"text"},
	user_function_8_name: {widget_type:"text"},
	on_lockscreen: {widget_type:"textarea"},
	on_unlockscreen: {widget_type:"textarea"},
	afk_on_lockscreen: {widget_type:"checkbox"},
	aliases: {widget_type:"textarea"},
	other_words_to_autocomplete: {widget_type:"textarea"},
	chat_font_size: {widget_type:"select"},
	warn_before_closing: {widget_type:"checkbox"},
	activity_bar: {widget_type:"checkbox"},
	show_image_previews: {widget_type:"checkbox"},
	show_link_previews: {widget_type:"checkbox"},
	stop_radio_on_tv_play: {widget_type:"checkbox"},
	stop_tv_on_radio_play: {widget_type:"checkbox"},
	show_input_placeholder: {widget_type:"checkbox"},
	show_clock_in_input_placeholder: {widget_type:"checkbox"},
	show_clock_in_lockscreen: {widget_type:"checkbox"},
	bypass_images_lock_on_own_change: {widget_type:"checkbox"},
	bypass_tv_lock_on_own_change: {widget_type:"checkbox"},
	bypass_radio_lock_on_own_change: {widget_type:"checkbox"},
	autoreveal_spoilers: {widget_type:"checkbox"},
	synth_enabled: {widget_type:"checkbox"},
	autoscroll_amount: {widget_type:"number"},
	autoscroll_delay: {widget_type:"number"},
	speech_1: {widget_type:"textarea"},
	speech_2: {widget_type:"textarea"},
	speech_3: {widget_type:"textarea"},
	speech_4: {widget_type:"textarea"},
	speech_5: {widget_type:"textarea"},
	speech_6: {widget_type:"textarea"},
	speech_7: {widget_type:"textarea"},
	speech_8: {widget_type:"textarea"},
	speech_9: {widget_type:"textarea"},
	speech_10: {widget_type:"textarea"},
	chat_display_percentage: {widget_type:"custom"},
	tv_display_percentage: {widget_type:"custom"},
	tv_display_position: {widget_type:"custom"}
}

// Commands object
// Used to populate the commands list
// Actions for each command are declared here
Hue.command_actions = 
{
	"/clear": (arg, ans) =>
	{
		Hue.clear_chat()
	},
	"/clearinput": (arg, ans) =>
	{
		Hue.clear_input()
	},
	"/users": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_userlist("normal", arg)
		}

		else
		{
			Hue.show_userlist()
		}
	},
	"/publicrooms": (arg, ans) =>
	{
		if(arg)
		{
			Hue.request_roomlist(arg, "public_roomlist")
		}

		else
		{
			Hue.request_roomlist("", "public_roomlist")
		}
	},
	"/visitedrooms": (arg, ans) =>
	{
		if(arg)
		{
			Hue.request_roomlist(arg, "visited_roomlist")
		}

		else
		{
			Hue.request_roomlist("", "visited_roomlist")
		}
	},
	"/roomname": (arg, ans) =>
	{
		if(arg)
		{
			Hue.change_room_name(arg)
		}

		else
		{
			Hue.show_room()
		}
	},
	"/roomnameedit": (arg, ans) =>
	{
		Hue.room_name_edit()
		ans.to_history = false
		ans.clr_input = false
	},
	"/played": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_played(arg)
		}

		else
		{
			Hue.show_played()
		}
	},
	"/search": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_chat_search(arg)
		}

		else
		{
			Hue.show_chat_search()
		}
	},
	"/clearsearches": (arg, ans) =>
	{
		Hue.clear_chat_searches()
	},
	"/role": (arg, ans) =>
	{
		Hue.show_role()
	},
	"/voice1": (arg, ans) =>
	{
		Hue.change_role(arg, "voice1")
	},
	"/voice2": (arg, ans) =>
	{
		Hue.change_role(arg, "voice2")
	},
	"/voice3": (arg, ans) =>
	{
		Hue.change_role(arg, "voice3")
	},
	"/voice4": (arg, ans) =>
	{
		Hue.change_role(arg, "voice4")
	},
	"/op": (arg, ans) =>
	{
		Hue.change_role(arg, "op")
	},
	"/admin": (arg, ans) =>
	{
		Hue.change_role(arg, "admin")
	},
	"/resetvoices": (arg, ans) =>
	{
		Hue.reset_voices()
	},
	"/removeops": (arg, ans) =>
	{
		Hue.remove_ops()
	},
	"/ban": (arg, ans) =>
	{
		Hue.ban(arg)
	},
	"/unban": (arg, ans) =>
	{
		Hue.unban(arg)
	},
	"/unbanall": (arg, ans) =>
	{
		Hue.unban_all()
	},
	"/bancount": (arg, ans) =>
	{
		Hue.get_ban_count()
	},
	"/kick": (arg, ans) =>
	{
		Hue.kick(arg)
	},
	"/public": (arg, ans) =>
	{
		Hue.change_privacy(true)
	},
	"/private": (arg, ans) =>
	{
		Hue.change_privacy(false)
	},
	"/privacy": (arg, ans) =>
	{
		Hue.show_public()
	},
	"/log": (arg, ans) =>
	{
		Hue.show_log()
	},
	"/enablelog": (arg, ans) =>
	{
		Hue.change_log(true)
	},
	"/disablelog": (arg, ans) =>
	{
		Hue.change_log(false)
	},
	"/clearlog": (arg, ans) =>
	{
		Hue.clear_log()
	},
	"/radio": (arg, ans) =>
	{
		if(arg)
		{
			Hue.change_radio_source(arg)
		}

		else
		{  
			Hue.show_media_source("radio")
		}
	},
	"/tv": (arg, ans) =>
	{
		if(arg)
		{
			Hue.change_tv_source(arg)
		}

		else
		{  
			Hue.show_media_source("tv")
		}
	},
	"/image": (arg, ans) =>
	{
		if(arg)
		{
			Hue.change_image_source(arg)
		}

		else
		{  
			Hue.show_media_source("image")
		}
	},
	"/status": (arg, ans) =>
	{
		Hue.show_status()
	},
	"/topic": (arg, ans) =>
	{
		if(arg)
		{
			Hue.change_topic(arg)
		}

		else
		{
			Hue.show_topic()
		}
	},
	"/topicadd": (arg, ans) =>
	{
		Hue.topicadd(arg)
	},
	"/topictrim": (arg, ans) =>
	{
		if(arg)
		{
			Hue.topictrim(arg)
		}

		else
		{  
			Hue.topictrim(1)
		}
	},
	"/topicaddstart": (arg, ans) =>
	{
		Hue.topicstart(arg)
	},
	"/topictrimstart": (arg, ans) =>
	{
		if(arg)
		{
			Hue.topictrimstart(arg)
		}

		else
		{  
			Hue.topictrimstart(1)
		}
	},
	"/topicedit": (arg, ans) =>
	{
		Hue.topicedit()
		ans.to_history = false
		ans.clr_input = false
	},
	"/room": (arg, ans) =>
	{
		Hue.show_room()
	},
	"/help": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_help(1, arg)
		}

		else
		{  
			Hue.show_help(1)
		}
	},
	"/help2": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_help(2, arg)
		}

		else
		{  
			Hue.show_help(2)
		}
	},
	"/help3": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_help(3, arg)
		}

		else
		{  
			Hue.show_help(3)
		}
	},
	"/stopradio": (arg, ans) =>
	{
		Hue.stop_radio()
	},
	"/startradio": (arg, ans) =>
	{
		Hue.start_radio()
	},
	"/radiovolume": (arg, ans) =>
	{
		Hue.change_volume_command(arg, "radio")
	},
	"/tvvolume": (arg, ans) =>
	{
		Hue.change_volume_command(arg, "tv")
	},
	"/volume": (arg, ans) =>
	{
		Hue.change_volume_all(arg)
	},
	"/inputhistory": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_input_history(arg)
		}

		else
		{  
			Hue.show_input_history()
		}
	},
	"/clearinputhistory": (arg, ans) =>
	{
		Hue.clear_input_history()
	},
	"/changeusername": (arg, ans) =>
	{
		Hue.change_username(arg)
	},
	"/changepassword": (arg, ans) =>
	{
		Hue.change_password(arg)
	},
	"/changeemail": (arg, ans) =>
	{
		Hue.change_email(arg)
	},
	"/verifyemail": (arg, ans) =>
	{
		Hue.verify_email(arg)
	},
	"/details": (arg, ans) =>
	{
		Hue.show_details()
	},
	"/logout": (arg, ans) =>
	{
		Hue.logout()
	},
	"/fill": (arg, ans) =>
	{
		Hue.fill()
	},
	"/shrug": (arg, ans) =>
	{
		Hue.shrug()
	},
	"/afk": (arg, ans) =>
	{
		Hue.show_afk()
	},
	"/disconnectothers": (arg, ans) =>
	{
		Hue.disconnect_others()
	},
	"/whisper": (arg, ans) =>
	{
		Hue.process_write_whisper(arg, true)
	},
	"/whisper2": (arg, ans) =>
	{
		Hue.process_write_whisper(arg, false)
	},
	"/whisperops": (arg, ans) =>
	{
		Hue.write_popup_message(false, "ops")
	},
	"/broadcast": (arg, ans) =>
	{
		Hue.write_popup_message(false, "room")
	},
	"/systembroadcast": (arg, ans) =>
	{
		Hue.write_popup_message(false, "system")
		ans.to_history = false
	},
	"/systemrestart": (arg, ans) =>
	{
		Hue.send_system_restart_signal()
		ans.to_history = false
	},
	"/annex": (arg, ans) =>
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
	},
	"/highlights": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_highlights(arg)
		}

		else
		{  
			Hue.show_highlights()
		}
	},
	"/lock": (arg, ans) =>
	{
		Hue.stop_and_lock(false)
	},
	"/unlock": (arg, ans) =>
	{
		Hue.default_media_state(false)
	},
	"/stopandlock": (arg, ans) =>
	{
		Hue.stop_and_lock()
	},
	"/stop": (arg, ans) =>
	{
		Hue.stop_media()
	},
	"/default": (arg, ans) =>
	{
		Hue.default_media_state()
	},
	"/menu": (arg, ans) =>
	{
		Hue.show_main_menu()
	},
	"/media": (arg, ans) =>
	{
		Hue.show_media_menu()
	},
	"/user": (arg, ans) =>
	{
		Hue.show_user_menu()
	},
	"/imagehistory": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_media_history("image", arg)
		}

		else
		{  
			Hue.show_media_history("image")
		}
	},
	"/tvhistory": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_media_history("tv", arg)
		}

		else
		{  
			Hue.show_media_history("tv")
		}
	},
	"/radiohistory": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_media_history("radio", arg)
		}

		else
		{  
			Hue.show_media_history("radio")
		}
	},
	"/lockimages": (arg, ans) =>
	{
		Hue.toggle_lock_images(true)
	},
	"/locktv": (arg, ans) =>
	{
		Hue.toggle_lock_tv(true)
	},
	"/lockradio": (arg, ans) =>
	{
		Hue.toggle_lock_radio(true)
	},
	"/unlockimages": (arg, ans) =>
	{
		Hue.toggle_lock_images(false)
	},
	"/unlocktv": (arg, ans) =>
	{
		Hue.toggle_lock_tv(false)
	},
	"/unlockradio": (arg, ans) =>
	{
		Hue.toggle_lock_radio(false)
	},
	"/togglelockimages": (arg, ans) =>
	{
		Hue.toggle_lock_images()
	},
	"/togglelocktv": (arg, ans) =>
	{
		Hue.toggle_lock_tv()
	},
	"/togglelockradio": (arg, ans) =>
	{
		Hue.toggle_lock_radio()
	},
	"/showimages": (arg, ans) =>
	{
		Hue.toggle_images(true)
	},
	"/showtv": (arg, ans) =>
	{
		Hue.toggle_tv(true)
	},
	"/showradio": (arg, ans) =>
	{
		Hue.toggle_radio(true)
	},
	"/hideimages": (arg, ans) =>
	{
		Hue.toggle_images(false)
	},
	"/hidetv": (arg, ans) =>
	{
		Hue.toggle_tv(false)
	},
	"/hideradio": (arg, ans) =>
	{
		Hue.toggle_radio(false)
	},
	"/toggleimages": (arg, ans) =>
	{
		Hue.toggle_images()
	},
	"/toggletv": (arg, ans) =>
	{
		Hue.toggle_tv()
	},
	"/toggleradio": (arg, ans) =>
	{
		Hue.toggle_radio()
	},
	"/test": (arg, ans) =>
	{
		Hue.do_test()
	},
	"/maximizeimages": (arg, ans) =>
	{
		Hue.maximize_images()
	},
	"/maximizetv": (arg, ans) =>
	{
		Hue.maximize_tv()
	},
	"/starttv": (arg, ans) =>
	{
		Hue.play_tv()
	},
	"/stoptv": (arg, ans) =>
	{
		Hue.stop_tv()
	},
	"/openimage": (arg, ans) =>
	{
		Hue.show_current_image_modal()
	},
	"/openlastimage": (arg, ans) =>
	{
		Hue.show_current_image_modal(false)
	},
	"/date": (arg, ans) =>
	{
		Hue.show_current_date()
	},
	"/js": (arg, ans) =>
	{
		Hue.execute_javascript(arg)
	},
	"/js2": (arg, ans) =>
	{
		Hue.execute_javascript(arg, false)
	},
	"/changeimage": (arg, ans) =>
	{
		Hue.show_image_picker()
	},
	"/changetv": (arg, ans) =>
	{
		Hue.show_tv_picker()
	},
	"/changeradio": (arg, ans) =>
	{
		Hue.show_radio_picker()
	},
	"/closeall": (arg, ans) =>
	{
		Hue.close_all_message()
	},
	"/closeallmodals": (arg, ans) =>
	{
		Hue.close_all_modals()
	},
	"/closeallpopups": (arg, ans) =>
	{
		Hue.close_all_popups()
	},
	"/activityabove": (arg, ans) =>
	{
		Hue.activity_above(true)
	},
	"/activityabove2": (arg, ans) =>
	{
		Hue.activity_above(false)
	},
	"/activitybelow": (arg, ans) =>
	{
		Hue.activity_below(true)
	},
	"/activitybelow2": (arg, ans) =>
	{
		Hue.activity_below(false)
	},
	"/globalsettings": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_global_settings(arg)
		}

		else
		{
			Hue.show_global_settings()
		}
	},
	"/roomsettings": (arg, ans) =>
	{
		if(arg)
		{
			Hue.show_room_settings(arg)
		}

		else
		{
			Hue.show_room_settings()
		}
	},
	"/goto": (arg, ans) =>
	{
		Hue.goto_url(arg, "tab")
	},
	"/toggleplayradio": (arg, ans) =>
	{
		Hue.toggle_play_radio()
	},
	"/refreshimage": (arg, ans) =>
	{
		Hue.refresh_image()
	},
	"/refreshtv": (arg, ans) =>
	{
		Hue.refresh_tv()
	},
	"/refreshradio": (arg, ans) =>
	{
		Hue.refresh_radio()
	},
	"/stopradioin": (arg, ans) =>
	{
		Hue.stop_radio_in(arg)
	},
	"/ping": (arg, ans) =>
	{
		Hue.ping_server()
	},
	"/reactlike": (arg, ans) =>
	{
		Hue.send_reaction("like")
	},
	"/reactlove": (arg, ans) =>
	{
		Hue.send_reaction("love")
	},
	"/reacthappy": (arg, ans) =>
	{
		Hue.send_reaction("happy")
	},
	"/reactmeh": (arg, ans) =>
	{
		Hue.send_reaction("meh")
	},
	"/reactsad": (arg, ans) =>
	{
		Hue.send_reaction("sad")
	},
	"/reactdislike": (arg, ans) =>
	{
		Hue.send_reaction("dislike")
	},
	"/f1": (arg, ans) =>
	{
		Hue.run_user_function(1)
		ans.to_history = false
	},
	"/f2": (arg, ans) =>
	{
		Hue.run_user_function(2)
		ans.to_history = false
	},
	"/f3": (arg, ans) =>
	{
		Hue.run_user_function(3)
		ans.to_history = false
	},
	"/f4": (arg, ans) =>
	{
		Hue.run_user_function(4)
		ans.to_history = false
	},
	"/lockscreen": (arg, ans) =>
	{
		Hue.lock_screen()
	},
	"/unlockscreen": (arg, ans) =>
	{
		Hue.unlock_screen()
	},
	"/togglelockscreen": (arg, ans) =>
	{
		if(Hue.room_state.screen_locked)
		{
			Hue.unlock_screen()
		}

		else
		{
			Hue.lock_screen()
		}
	},
	"/drawimage": (arg, ans) =>
	{
		Hue.open_draw_image()
	},
	"/say": (arg, ans) =>
	{
		Hue.say_command(arg, ans)
	},
	"/input": (arg, ans) =>
	{
		Hue.input_command(arg)
		ans.to_history = false
		ans.clr_input = false
	},
	"/top": (arg, ans) =>
	{
		Hue.goto_top(true)
	},
	"top2": (arg, ans) =>
	{
		Hue.goto_top(false)
	},
	"/bottom": (arg, ans) =>
	{
		Hue.goto_bottom(true, true)
	},
	"/bottom2": (arg, ans) =>
	{
		Hue.goto_bottom(true, false)
	},
	"/background": (arg, ans) =>
	{
		Hue.change_background_image_source(arg)
	},
	"/whatis": (arg, ans) =>
	{
		Hue.inspect_command(arg)
	},
	"/refresh": (arg, ans) =>
	{
		Hue.restart_client()
	},
	"/modifysetting": (arg, ans) =>
	{
		Hue.modify_setting(arg)
	},
	"/modifysetting2": (arg, ans) =>
	{
		Hue.modify_setting(arg, false)
	},
	"/feedback": (arg, ans) =>
	{
		Hue.feedback(arg)
	},
	"/imagesmode": (arg, ans) =>
	{
		Hue.change_room_images_mode(arg)
	},
	"/tvmode": (arg, ans) =>
	{
		Hue.change_room_tv_mode(arg)
	},
	"/radiomode": (arg, ans) =>
	{
		Hue.change_room_radio_mode(arg)
	},
	"/theme": (arg, ans) =>
	{
		Hue.change_theme(arg)
	},
	"/thememode": (arg, ans) =>
	{
		Hue.change_theme_mode(arg)
	},
	"/textcolormode": (arg, ans) =>
	{
		Hue.change_text_color_mode(arg)
	},
	"/textcolor": (arg, ans) =>
	{
		Hue.change_text_color(arg)
	},
	"/backgroundmode": (arg, ans) =>
	{
		Hue.change_background_mode(arg)
	},
	"/backgroundeffect": (arg, ans) =>
	{
		Hue.change_background_effect(arg)
	},
	"/tiledimensions": (arg, ans) =>
	{
		Hue.change_background_tile_dimensions(arg)
	},
	"/adminactivity": (arg, ans) =>
	{
		if(arg)
		{
			Hue.request_admin_activity(arg)
		}

		else
		{  
			Hue.request_admin_activity()
		}
	},
	"/accesslog": (arg, ans) =>
	{
		if(arg)
		{
			Hue.request_access_log(arg)
		}

		else
		{  
			Hue.request_access_log()
		}
	},
	"/togglefontsize": (arg, ans) =>
	{
		Hue.toggle_chat_font_size()
	},
	"/adminlist": (arg, ans) =>
	{
		Hue.request_admin_list()
	},
	"/banlist": (arg, ans) =>
	{
		Hue.request_ban_list()
	},
	"/toggleactivtybar": (arg, ans) =>
	{
		Hue.toggle_activity_bar()
	},
	"/synthkey": (arg, ans) =>
	{
		Hue.send_synth_key(arg)
	},
	"/synthkeylocal": (arg, ans) =>
	{
		Hue.play_synth_key(arg)
	},
	"/togglemutesynth": (arg, ans) =>
	{
		Hue.set_synth_muted()
	},
	"/speak": (arg, ans) =>
	{
		Hue.send_synth_voice(arg)
	},
	"/speaklocal": (arg, ans) =>
	{
		Hue.play_synth_voice(arg, Hue.username, true)
	},
	"/speech": (arg, ans) =>
	{
		Hue.play_speech(arg)
	},
	"/unmaximize": (arg, ans) =>
	{
		Hue.unmaximize_media()
	},
	"/maximizechat": (arg, ans) =>
	{
		Hue.toggle_media()
	},
	"/autoscrollup": (arg, ans) =>
	{
		Hue.autoscroll_up()
	},
	"/autoscrolldown": (arg, ans) =>
	{
		Hue.autoscroll_down()
	},
	"/loadnextimage": (arg, ans) =>
	{
		Hue.media_load_next("images")
	},
	"/loadprevimage": (arg, ans) =>
	{
		Hue.media_load_previous("images")
	},
	"/loadnexttv": (arg, ans) =>
	{
		Hue.media_load_next("tv")
	},
	"/loadprevtv": (arg, ans) =>
	{
		Hue.media_load_previous("tv")
	},
	"/loadnextradio": (arg, ans) =>
	{
		Hue.media_load_next("radio")
	},
	"/loadprevradio": (arg, ans) =>
	{
		Hue.media_load_previous("radio")
	},
	"/calc": (arg, ans) =>
	{
		Hue.do_math_calculation(arg)
	}
}

// This is used to declare actions for server responses
Hue.server_update_events =
{
	'joined': (data) =>
	{
		Hue.on_join(data)
	},
	'typing': (data) =>
	{
		Hue.show_typing(data)
	},
	'chat_message': (data) =>
	{
		Hue.on_chat_message(data)
	},
	'request_slice_upload': (data) =>
	{
		Hue.request_slice_upload(data)
	},
	'upload_ended': (data) =>
	{
		Hue.upload_ended(data)
	},
	'changed_image_source': (data) =>
	{
		Hue.setup_image("change", data)
	},
	'changed_tv_source': (data) =>
	{
		Hue.setup_tv("change", data)
	},
	'restarted_tv_source': (data) =>
	{
		Hue.setup_tv("restart", data)
	},
	'changed_radio_source': (data) =>
	{
		Hue.setup_radio("change", data)
	},
	'restarted_radio_source': (data) =>
	{
		Hue.setup_radio("restart", data)
	},
	'profile_image_changed': (data) =>
	{
		Hue.profile_image_changed(data)
	},
	'user_join': (data) =>
	{
		Hue.userjoin(data)
	},
	'receive_roomlist': (data) =>
	{
		Hue.on_roomlist_received(data)
	},
	'upload_error': (data) =>
	{
		Hue.show_upload_error()
	},
	'topic_change': (data) =>
	{
		Hue.announce_topic_change(data)
	},
	'room_name_changed': (data) =>
	{
		Hue.announce_room_name_change(data)
	},
	'log_changed': (data) =>
	{
		Hue.announce_log_change(data)
	},
	'log_cleared': (data) =>
	{
		Hue.announce_log_cleared(data)
	},
	'announce_role_change': (data) =>
	{
		Hue.announce_role_change(data)
	},
	'voices_resetted': (data) =>
	{
		Hue.announce_voices_resetted(data)
	},
	'announce_removedops': (data) =>
	{
		Hue.announce_removedops(data)
	},
	'announce_ban': (data) =>
	{
		Hue.announce_ban(data)
	},
	'announce_unban': (data) =>
	{
		Hue.announce_unban(data)
	},
	'announce_unban_all': (data) =>
	{
		Hue.announce_unban_all(data)
	},
	'receive_ban_count': (data) =>
	{
		Hue.receive_ban_count(data)
	},
	'nothing_to_unban': (data) =>
	{
		Hue.feedback("There was nothing to unban")
	},
	'nothing_to_clear': (data) =>
	{
		Hue.feedback("There was nothing to clear")
	},
	'forbidden_user': (data) =>
	{
		Hue.forbiddenuser()
	},
	'nothing_was_found': (data) =>
	{
		Hue.feedback("Nothing was found")
	},
	'user_not_found': (data) =>
	{
		Hue.feedback("User doesn't exist")
	},
	'user_not_in_room': (data) =>
	{
		Hue.user_not_in_room()
	},
	'no_ops_to_remove': (data) =>
	{
		Hue.feedback("There were no ops to remove")
	},
	'no_voices_to_reset': (data) =>
	{
		Hue.feedback("There were no voices to reset")
	},
	'is_already': (data) =>
	{
		Hue.is_already(data.who, data.what)
	},
	'user_already_banned': (data) =>
	{
		Hue.feedback("User is already banned")
	},
	'user_already_unbanned': (data) =>
	{
		Hue.feedback("User is already unbanned")
	},
	'privacy_change': (data) =>
	{
		Hue.announce_privacy_change(data)
	},
	'image_not_found': (data) =>
	{
		Hue.feedback("The image couldn't be found")
	},
	'song_not_found': (data) =>
	{
		Hue.feedback("The song couldn't be found")
	},
	'video_not_found': (data) =>
	{
		Hue.feedback("The video couldn't be found")
	},
	'image_cooldown_wait': (data) =>
	{
		Hue.feedback("The image was changed recently. You must wait a while before changing it again")
	},
	'tv_cooldown_wait': (data) =>
	{
		Hue.feedback("The tv was changed recently. You must wait a while before changing it again")
	},
	'radio_cooldown_wait': (data) =>
	{
		Hue.feedback("The radio was changed recently. You must wait a while before changing it again")
	},
	'room_created': (data) =>
	{
		Hue.on_room_created(data)
	},
	'redirect': (data) =>
	{
		Hue.goto_url(data.location)
	},
	'username_already_exists': (data) =>
	{
		Hue.feedback(`${data.username} already exists`)
	},
	'email_already_exists': (data) =>
	{
		Hue.feedback(`${data.email} already exists`)
	},
	'new_username': (data) =>
	{
		Hue.announce_new_username(data)
	},
	'password_changed': (data) =>
	{
		Hue.password_changed(data)
	},
	'email_changed': (data) =>
	{
		Hue.email_changed(data)
	},
	'room_images_mode_change': (data) =>
	{
		Hue.announce_room_images_mode_change(data)
	},
	'room_tv_mode_change': (data) =>
	{
		Hue.announce_room_tv_mode_change(data)
	},
	'room_radio_mode_change': (data) =>
	{
		Hue.announce_room_radio_mode_change(data)
	},
	'room_synth_mode_change': (data) =>
	{
		Hue.announce_room_synth_mode_change(data)
	},
	'theme_mode_changed': (data) =>
	{
		Hue.announce_theme_mode_change(data)
	},
	'theme_change': (data) =>
	{
		Hue.announce_theme_change(data)
	},
	'background_image_change': (data) =>
	{
		Hue.announce_background_image_change(data)
	},
	'background_mode_changed': (data) =>
	{
		Hue.announce_background_mode_change(data)
	},
	'background_effect_changed': (data) =>
	{
		Hue.announce_background_effect_change(data)
	},
	'background_tile_dimensions_changed': (data) =>
	{
		Hue.announce_background_tile_dimensions_change(data)
	},
	'text_color_mode_changed': (data) =>
	{
		Hue.announce_text_color_mode_change(data)
	},
	'text_color_changed': (data) =>
	{
		Hue.announce_text_color_change(data)
	},
	'voice_permission_change': (data) =>
	{
		Hue.announce_voice_permission_change(data)
	},
	'user_disconnect': (data) =>
	{
		Hue.userdisconnect(data)
	},
	'others_disconnected': (data) =>
	{
		Hue.show_others_disconnected(data)
	},
	'whisper': (data) =>
	{
		Hue.popup_message_received(data)
	},
	'whisper_ops': (data) =>
	{
		Hue.popup_message_received(data, "ops")
	},
	'room_broadcast': (data) =>
	{
		Hue.popup_message_received(data, "room")
	},
	'system_broadcast': (data) =>
	{
		Hue.popup_message_received(data, "system")
	},
	'system_restart_signal': (data) =>
	{
		Hue.restart_client()
	},
	'error_occurred': (data) =>
	{
		Hue.error_occurred()
	},
	'email_change_code_sent': (data) =>
	{
		Hue.feedback(`Verification code sent. Use the command sent to ${data.email}. Email might take a couple of minutes to arrive`)
	},
	'email_change_code_not_sent': (data) =>
	{
		Hue.feedback(`Verification code not sent yet. Use /changeemail [new_email] to get a verification code`)
	},
	'email_change_wait': (data) =>
	{
		Hue.feedback(`You must wait a while before changing the email again`)
	},
	'email_change_wrong_code': (data) =>
	{
		Hue.feedback(`Code supplied didn't match`)
	},
	'email_change_expired_code': (data) =>
	{
		Hue.feedback(`Code supplied has expired`)
	},
	'create_room_wait': (data) =>
	{
		Hue.msg_info.show("You must wait a while before creating another room")
	},
	'pong_received': (data) =>
	{
		Hue.pong_received(data)
	},
	'reaction_received': (data) =>
	{
		Hue.show_reaction(data)
	},
	'cannot_embed_iframe': (data) =>
	{
		Hue.feedback("That website cannot be embedded")
	},
	'same_image': (data) =>
	{
		Hue.feedback("Image is already set to that")
	},
	'same_tv': (data) =>
	{
		Hue.feedback("TV is already set to that")
	},
	'same_radio': (data) =>
	{
		Hue.feedback("Radio is already set to that")
	},
	'receive_admin_activity': (data) =>
	{
		Hue.show_admin_activity(data.messages)
	},
	'receive_access_log': (data) =>
	{
		Hue.show_access_log(data.messages)
	},
	'receive_admin_list': (data) =>
	{
		Hue.show_admin_list(data)
	},
	'receive_ban_list': (data) =>
	{
		Hue.show_ban_list(data)
	},
	'activity_trigger': (data) =>
	{
		Hue.push_to_activity_bar(data.username, Date.now())
	},
	'message_deleted': (data) =>
	{
		Hue.remove_message_from_chat(data)
	},
	'receive_synth_key': (data) =>
	{
		Hue.receive_synth_key(data)
	},
	'receive_synth_voice': (data) =>
	{
		Hue.receive_synth_voice(data)
	},
	'announcement': (data) =>
	{
		Hue.show_announcement(data)
	}
}

// This runs after the application's load event
// This is the first function that gets executed
Hue.init = function()
{
	Hue.setup_markdown_regexes()
	Hue.activate_key_detection()
	Hue.setup_templates()
	Hue.create_setting_user_function_actions()
	Hue.create_setting_speech_actions()
	Hue.get_global_settings()
	Hue.get_room_settings()
	Hue.get_room_state()
	Hue.start_msg()
	Hue.start_settings_widgets("global_settings")
	Hue.start_settings_widgets_listeners("global_settings")
	Hue.start_settings_widgets("room_settings")
	Hue.start_settings_widgets_listeners("room_settings")
	Hue.setup_settings_windows()
	Hue.set_radio_volume_widget()
	Hue.start_media_menu_sliders()
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
	Hue.start_chat_mouse_events()
	Hue.start_chat_hover_events()
	Hue.start_body_events()
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
	Hue.start_footer_media_label_context_menu()
	Hue.start_chat_menu_context_menu()
	Hue.start_msg_close_buttons_context_menu()
	Hue.start_search_context_menus()
	Hue.start_titles()
	Hue.setup_show_profile()
	Hue.setup_main_menu()
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
	Hue.setup_modal_image_number()
	Hue.setup_command_aliases()
	Hue.setup_fonts()
	Hue.setup_before_unload()
	Hue.start_chat_reply_events()
	Hue.maxers_mouse_events()
	Hue.check_screen_lock()
	Hue.setup_iframe_video()
	Hue.setup_synth()
	Hue.show_console_message()
	Hue.setup_expand_image()
	Hue.setup_local_storage()
	Hue.get_ignored_usernames_list()
	Hue.get_accept_commands_from_list()
	Hue.setup_lockscreen()
	Hue.setup_upload_comment()
	Hue.setup_drag_events()
	Hue.setup_open_url()
	Hue.setup_user_functions()

	if(Hue.debug_functions)
	{
		Hue.wrap_functions()
	}

	Hue.start_socket()
}

// What to do after the user's socket joins the room
// This handles the first signal received after a successful connection
Hue.on_join = function(data)
{
	console.info("Joined Room")

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
	Hue.check_maxers()
	Hue.config_main_menu()
	Hue.start_metadata_loop()
	Hue.goto_bottom()
	Hue.make_main_container_visible()
	Hue.setup_activity_bar()
	Hue.setup_input_placeholder()
	Hue.setup_details()
	Hue.start_active_media()

	Hue.at_startup()
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

// This hides the loading animation and makes the main container visible
Hue.make_main_container_visible = function()
{
	$("#loading").css("opacity", 0)
	$("#main_container").css("opacity", 1).css("pointer-events", "initial")

	setTimeout(function()
	{
		$("#loading").css("display", "none")
	}, 1600)
}

// Centralized function to get localStorage objects
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

// This is used to save a localStorage object after x milliseconds
// The x milliseconds delay gets resetted on each call
// This was done to avoid saving loops
Hue.save_local_storage_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.do_save_local_storage()
		}, Hue.local_storage_save_delay)
	}
})()

// Centralized function to save localStorage objects
Hue.save_local_storage = function(ls_name, obj, force=false)
{
	Hue.local_storage_to_save[ls_name] = obj

	if(force)
	{
		Hue.do_save_local_storage()
	}

	else
	{
		Hue.save_local_storage_timer()
	}
}

// Do the actual localStorage save
Hue.do_save_local_storage = function()
{
	for(let ls_name in Hue.local_storage_to_save)
	{
		let obj = Hue.local_storage_to_save[ls_name]

		if(typeof obj !== "string")
		{
			obj = JSON.stringify(obj)
		}

		localStorage.setItem(ls_name, obj)
	}

	Hue.local_storage_to_save = {}
}

// Remove a localStorage object
Hue.remove_local_storage = function(ls_name)
{
	localStorage.removeItem(ls_name)
}

// Create all the Handlebars templates
Hue.setup_templates = function()
{
	$(".template").each(function()
	{
		let id = $(this).attr("id")
		Hue[id] = Handlebars.compile($(`#${id}`).html())
	})
}

// Show the Help window
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

// Show whether a room is public or private
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

// Show the room name
Hue.show_room = function()
{
	Hue.feedback(`Room: ${Hue.room_name}`)
}

// Change the name of the room
Hue.change_room_name = function(arg)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	arg = Hue.utilz.clean_string2(arg.substring(0, Hue.config.max_room_name_length))

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

// Put the room name in the input to be edited
Hue.room_name_edit = function()
{
	Hue.change_input(`/roomname ${Hue.room_name}`)
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

// Returns proper default topic
Hue.get_unset_topic = function()
{
	if(Hue.is_admin_or_op())
	{
		return Hue.config.default_topic_admin
	}

	else
	{
		return Hue.config.default_topic
	}
}

// Gets the topic
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

// Shows the topic
Hue.show_topic = function()
{
	if(Hue.topic)
	{
		if(Hue.topic_setter !== "")
		{
			Hue.feedback(`Topic: ${Hue.topic}`, {title:`Setter: ${Hue.topic_setter} | ${Hue.topic_date} | ${Hue.utilz.nice_date()}`})
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

// Setups permissions from initial data
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

// Setups variables that determine if a user has permission to use certain media
Hue.check_permissions = function()
{
	Hue.can_chat = Hue.check_permission(Hue.role, "chat")
	Hue.can_images = Hue.room_images_mode === "enabled" && Hue.check_permission(Hue.role, "images")
	Hue.can_tv = Hue.room_tv_mode === "enabled" && Hue.check_permission(Hue.role, "tv")
	Hue.can_radio = Hue.room_radio_mode === "enabled" && Hue.check_permission(Hue.role, "radio")
	Hue.can_synth = Hue.room_synth_mode === "enabled" && Hue.check_permission(Hue.role, "synth")

	Hue.setup_icons()
}

// Checks whether a user can use a specified media
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

// Sets visibility of footer media icons based on media permissions
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

// Shows the user's role
Hue.show_role = function()
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

// Shows the user's username
Hue.show_username = function()
{
	Hue.feedback(`Username: ${Hue.username}`)
}

// Centralized function to initiate a socket emit to the server
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

// Checks the socket emit queue to send the next emit
// A throttled queue is used to control the rate in which emits are sent
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
		}, Hue.config.socket_emit_throttle)
	}

	else
	{
		clearTimeout(Hue.emit_queue_timeout)
		Hue.emit_queue_timeout = undefined
	}
}

// Actually do the socket emit
Hue.do_socket_emit = function(obj)
{
	if(Hue.debug_socket)
	{
		console.info(`Emit: ${obj.destination}`)
		console.info(`${JSON.stringify(obj.data)}`)
	}

	obj.data.server_method_name = obj.destination
	Hue.socket.emit("server_method", obj.data)
}

// Starts and setups the client's socket
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

	Hue.socket.on('update', (obj) =>
	{
		let type = obj.type
		let data = obj.data

		if(Hue.server_update_events[type])
		{
			Hue.server_update_events[type](data)
		}
	})
}

// Setups an image object
// This handles image objects received live from the server or from logged messages
// This is the entry function for image objects to get registered, announced, and be ready for use
Hue.setup_image = function(mode, odata={})
{
	let data = {}
	
	data.id = odata.id
	data.user_id = odata.user_id
	data.type = odata.type
	data.source = odata.source
	data.setter = odata.setter
	data.size = odata.size
	data.date = odata.date
	data.query = odata.query
	data.comment = odata.comment

	data.nice_date = data.date ? Hue.utilz.nice_date(data.date) : Hue.utilz.nice_date()

	if(!data.setter)
	{
		data.setter = "The system"
	}

	if(!data.source)
	{
		data.source = Hue.config.default_image_source
	}

	if(data.source.startsWith("/"))
	{
		data.source = window.location.origin + data.source
	}

	else if(data.source.startsWith(window.location.origin))
	{
		if(!data.size)
		{
			for(let img of Hue.images_changed)
			{
				if(img.source === data.source)
				{
					data.type = img.type
					data.size = img.size
					break
				}
			}
		}
	}

	if(!data.date)
	{
		data.date = Date.now()
	}

	data.info = `Setter: ${data.setter} | ${data.nice_date}`
	data.info_html = `Setter: ${Hue.make_html_safe(data.setter)} <span class='header_separator color_3'>|</span> ${data.nice_date}`

	if(data.type === "upload")
	{
		data.info += ` | Size: ${Hue.utilz.get_size_string(data.size)}`
		data.info_html += ` <span class='header_separator color_3'>|</span> Size: ${Hue.utilz.get_size_string(data.size)}`
	}
	
	if(data.query)
	{
		data.info += ` | Search Term: "${data.query}"`
		data.info_html += ` <span class='header_separator color_3'>|</span> Search Term: "${Hue.make_html_safe(data.query)}"`
	}

	data.message = `${data.setter} changed the image`

	data.onclick = function()
	{
		Hue.show_modal_image(data)
	}

	if(data.message)
	{
		data.message_id = Hue.announce_image(data).message_id
	}

	if(!data.setter)
	{
		data.info = "Default Image"
	}

	if(mode === "change" || mode === "show")
	{
		Hue.push_images_changed(data)
		Hue.set_modal_image_number()
	}

	if(mode === "change")
	{
		if(Hue.room_state.images_locked)
		{
			$("#footer_lock_images_icon").addClass("blinking")
		}

		Hue.change({type:"image"})
	}
}

// Announces an image change to the chat
Hue.announce_image = function(data)
{
	return Hue.public_feedback(data.message,
	{
		save: true,
		brk: "<i class='icon2c fa fa-camera'></i>",
		date: data.date,
		username: data.setter,
		title: data.info,
		onclick: data.onclick,
		comment: data.comment,
		type: "image_change",
		item_id: data.id,
		user_id: data.user_id
	})
}

// Pushes a changed image into the images changed array
Hue.push_images_changed = function(data)
{
	Hue.images_changed.push(data)

	if(Hue.images_changed.length > Hue.config.media_changed_crop_limit)
	{
		Hue.images_changed = Hue.images_changed.slice(Hue.images_changed.length - Hue.config.media_changed_crop_limit)
	}

	Hue.after_push_media_change("image", data)
}

// Returns the current room image
// The last image in the images changed array
// This is not necesarily the user's loaded image
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

// Setups an tv object
// This handles tv objects received live from the server or from logged messages
// This is the entry function for tv objects to get registered, announced, and be ready for use
Hue.setup_tv = function(mode, odata={})
{
	let data

	if(mode === "restart")
	{
		data = Hue.current_tv()
		data.date = odata.date
		data.info += ` | ${Hue.utilz.nice_date(data.date)}`
		data.message = `${odata.setter} restarted the tv`
		data.comment = odata.comment
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

		if(!data.setter)
		{
			data.setter = "The system"
		}

		if(!data.source)
		{
			data.source = Hue.config.default_tv_source
			data.type = Hue.config.default_tv_type
			data.title = Hue.config.default_tv_title
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
			Hue.open_url_menu({source:data.source, data:data, media_type:"tv"})
		}
	}

	if(!data.date)
	{
		data.date = Date.now()
	}

	if(data.message)
	{
		data.message_id = Hue.announce_tv(data).message_id
	}

	if(mode === "change" || mode === "show")
	{
		Hue.push_tv_changed(data)
	}

	if(mode === "change" || mode === "restart")
	{
		if(mode === "change")
		{
			if(Hue.room_state.tv_locked)
			{
				$("#footer_lock_tv_icon").addClass("blinking")
			}

			Hue.change({type:"tv", force:true})
		}

		else if(mode === "restart")
		{
			Hue.change({type:"tv", force:true, play:true})
		}
	}
}

// Announced a tv change to the chat
Hue.announce_tv = function(data)
{
	return Hue.public_feedback(data.message,
	{
		save: true,
		brk: "<i class='icon2c fa fa-television'></i>",
		title: data.info,
		onclick: data.onclick,
		date: data.date,
		type: data.type,
		username: data.setter,
		comment: data.comment,
		type: "tv_change",
		item_id: data.id,
		user_id: data.user_id
	})
}

// Returns the current room tv
// The last tv in the tv changed array
// This is not necesarily the user's loaded tv
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

// Pushes a changed tv into the tv changed array
Hue.push_tv_changed = function(data)
{
	Hue.tv_changed.push(data)

	if(Hue.tv_changed.length > Hue.config.media_changed_crop_limit)
	{
		Hue.tv_changed = Hue.tv_changed.slice(Hue.tv_changed.length - Hue.config.media_changed_crop_limit)
	}

	Hue.after_push_media_change("tv", data)
}

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

		if(!data.setter)
		{
			data.setter = "The system"
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

		data.message = `${data.setter} changed the radio to: ${Hue.conditional_quotes(data.title)}`

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

		data.info = `Setter: ${data.setter} | ${data.nice_date}`
		
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
		save: true,
		brk: "<i class='icon2c fa fa-volume-up'></i>",
		title: data.info,
		onclick: data.onclick,
		date: data.date,
		type: data.type,
		username: data.setter,
		comment: data.comment,
		type: "radio_change",
		item_id: data.id,
		user_id: data.user_id
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
Hue.load_radio = function(item, force=false)
{
	Hue.radio_get_metadata = false
	clearTimeout(Hue.radio_metadata_fail_timeout)
	Hue.stop_radio(false)
	Hue.hide_radio(item)

	if(item.type === "audio")
	{
		if($("#audio_player").length === 0)
		{
			$("#media_audio_audio_container").html(`<audio id='audio_player' preload="metadata"></audio>`)
		}

		Hue.radio_get_metadata = true

		$('#audio_player').attr('src', item.source)

		if(Hue.radio_started)
		{
			$('#audio_player')[0].play()
		}
	}

	else if(item.type === "youtube")
	{
		if(Hue.youtube_player !== undefined)
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

		if(force || (!Hue.room_state.radio_locked || !Hue.last_radio_source))
		{
			Hue.push_played(false, {s1:item.title, s2:item.source})
		}
	}

	else if(item.type === "soundcloud")
	{
		if(Hue.soundcloud_player !== undefined)
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

		if(force || (!Hue.room_state.radio_locked || !Hue.last_radio_source))
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

// Stops all defined tv players
Hue.stop_tv = function(clear_iframe=true)
{
	if(Hue.youtube_video_player !== undefined)
	{
		Hue.youtube_video_player.pauseVideo()
	}

	if(Hue.twitch_video_player !== undefined)
	{
		clearTimeout(Hue.play_twitch_video_player_timeout)
		Hue.twitch_video_player.pause()
	}

	if(Hue.soundcloud_video_player !== undefined)
	{
		Hue.soundcloud_video_player.pause()
	}

	if(Hue.vimeo_video_player !== undefined)
	{
		Hue.vimeo_video_player.pause()
	}

	if($("#media_video").length > 0)
	{
		$("#media_video")[0].pause()
	}

	if(clear_iframe)
	{
		$("#media_iframe_video").attr("src", "")
		$("#media_iframe_poster").css("display", "block")
	}
}

// Plays the active loaded tv
Hue.play_tv = function()
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
	}

	else if(Hue.current_tv().type === "twitch")
	{
		if(Hue.twitch_video_player !== undefined)
		{
			Hue.twitch_video_player.play()
		}
	}

	else if(Hue.current_tv().type === "soundcloud")
	{
		if(Hue.soundcloud_video_player !== undefined)
		{
			Hue.soundcloud_video_player.play()
		}
	}

	else if(Hue.current_tv().type === "vimeo")
	{
		if(Hue.vimeo_video_player !== undefined)
		{
			Hue.vimeo_video_player.play()
		}
	}

	else if(Hue.current_tv().type === "video")
	{
		if($("#media_video").length > 0)
		{
			$("#media_video")[0].play()
		}
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

// Destroys all tv players that don't match the item's type
// Make's the item's type visible
Hue.hide_tv = function(item) 
{
	$("#media_tv .media_container").each(function()
	{
		let id = $(this).attr("id")
		let type = id.replace("media_", "").replace("_video_container", "")

		if(item.type !== type)
		{
			let new_el = $(`<div id='${id}' class='media_container'></div>`)
			new_el.css("display", "none")
			$(this).replaceWith(new_el)
			Hue[`${type}_video_player`] = undefined
			Hue[`${type}_video_player_requested`] = false
			Hue[`${type}_video_player_request`] = false
		}

		else
		{
			$(this).css("display", "flex")
		}
	})
}

// Loads a YouTube video
Hue.show_youtube_video = function(item, play=true)
{
	Hue.before_show_tv(item)

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

	Hue.after_show_tv(play)
}

// Loads a Twitch video
Hue.show_twitch_video = function(item, play=true)
{
	Hue.before_show_tv(item)

	let id = Hue.utilz.get_twitch_id(item.source)

	if(id[0] === "video")
	{
		Hue.twitch_video_player.setVideoSource(item.source)
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
		// This is a temporary workaround to ensure play is triggered
		Hue.play_twitch_video_player_timeout = setTimeout(function()
		{
			Hue.twitch_video_player.play()
		}, 1000)
	}

	else
	{
		clearTimeout(Hue.play_twitch_video_player_timeout)
		Hue.twitch_video_player.pause()
	}

	Hue.after_show_tv(play)
}

// Loads a Soundcloud video
Hue.show_soundcloud_video = function(item, play=true)
{
	Hue.before_show_tv(item)

	Hue.soundcloud_video_player.load(item.source,
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

	Hue.after_show_tv(play)
}

// Loads a <video> video
Hue.show_video_video = async function(item, play=true)
{
	if($("#media_video").length === 0)
	{
		let s = `<video id='media_video' 
		class='video_frame' width="640px" height="360px" 
		preload="metadata" poster="${Hue.config.default_video_url}" controls></video>`

		$("#media_video_video_container").html(s)
	}

	Hue.before_show_tv(item)

	let split = item.source.split('.')

	if(split[split.length - 1] === "m3u8")
	{
		await Hue.start_hls()
		Hue.hls.loadSource(item.source)
		Hue.hls.attachMedia($("#media_video")[0])
	}

	else
	{
		$("#media_video").prop("src", item.source)
	}

	if(play)
	{
		$("#media_video")[0].play()
	}

	Hue.after_show_tv(play)
}

// Loads an iframe as the tv
Hue.show_iframe_video = function(item, play=true)
{
	if($("#media_iframe_video").length === 0)
	{
		let s = `<div id='media_iframe_poster' class='pointer unselectable action'>Click Here To Load</div>
		<iframe width="640px" height="360px" id='media_iframe_video' class='video_frame'></iframe>`

		$("#media_iframe_video_container").html(s)

		Hue.setup_iframe_video()
	}
	
	Hue.before_show_tv(item)

	if(play)
	{
		$("#media_iframe_video").attr("src", item.source)
		$("#media_iframe_poster").css("display", "none")
	}

	else
	{
		$("#media_iframe_poster").css("display", "block")
	}

	Hue.after_show_tv(play)
}

// Loads a Vimeo video
Hue.show_vimeo_video = function(item, play=true)
{
	Hue.before_show_tv(item)

	let id = Hue.utilz.get_vimeo_id(item.source)

	Hue.vimeo_video_player.loadVideo(id)

	.then(() =>
	{
		if(play)
		{
			Hue.vimeo_video_player.play()
		}
	})

	Hue.after_show_tv(play)
}

// This gets called before any tv video is loaded
Hue.before_show_tv = function(item)
{
	Hue.stop_tv()
	Hue.hide_tv(item)
	Hue.hls = undefined
}

// This gets called after any tv video is loaded
Hue.after_show_tv = function(play)
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

	Hue.set_tv_volume(false, false)
}

// Setups theme and background variables from initial data
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
	let bg_image

	if(Hue.loaded_image && (Hue.background_mode === "mirror" || Hue.background_mode === "mirror_tiled"))
	{
		bg_image = Hue.loaded_image.source
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

	if(Hue.theme_mode === "automatic" && Hue.dominant_theme)
	{
		theme = Hue.dominant_theme
	}

	else
	{
		theme = Hue.theme
	}

	let background_color = theme
	let background_color_2 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_1)
	
	let font_color

	if(Hue.text_color_mode === "custom")
	{
		font_color = Hue.text_color
	}

	else
	{
		font_color = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_2)
	}

	let background_color_a = Hue.colorlib.rgb_to_rgba(background_color, Hue.config.opacity_amount_1)
	let background_color_a_2 = Hue.colorlib.rgb_to_rgba(background_color_2, Hue.config.opacity_amount_3)

	$('.bg0').css('background-color', background_color)
	$('.bg1').css('background-color', background_color_a)
	$('.bg1').css('color', font_color)
	$('.bg2').css('background-color', background_color_2)
	$('.bg2').css('color', font_color)

	let color_3 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_3)
	let color_4 = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_4)
	let color_4_a = Hue.colorlib.rgb_to_rgba(color_4, Hue.config.opacity_amount_3)
	let overlay_color = Hue.colorlib.rgb_to_rgba(color_3, Hue.config.opacity_amount_2)
	let slight_background = Hue.colorlib.get_lighter_or_darker(background_color, Hue.config.color_contrast_amount_5)
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

	.highlighted, .highlighted2, .highlighted3, .highlighted4
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

	.left_scroller
	{
		border-right: 1px ${color_4_a} solid;
	}

	.center_scroller
	{
		border-right: 1px ${color_4_a} solid;
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

	</style>
	`

	$(".appended_theme_style").each(function()
	{
		$(this).remove()
	})

	$("head").append(css)
}

// This handles new users joining the room
Hue.userjoin = function(data)
{
	Hue.clear_from_users_to_disconnect(data)

	let added = Hue.add_to_userlist(
	{
		user_id: data.user_id,
		username: data.username,
		role: data.role,
		profile_image: data.profile_image,
		date_joined: data.date_joined
	})

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
				Hue.on_activity("join")
			}
		}
	}
}

// Updates the user count in the header and user list
Hue.update_usercount = function()
{
	let s = `${Hue.singular_or_plural(Hue.usercount, "Users")} Online`
	
	$('#usercount').text(s)
	
	if(Hue.userlist_mode === "normal")
	{
		Hue.msg_userlist.set_title(s)
	}
}

// Adds a user to the user list
Hue.add_to_userlist = function(args={})
{
	let def_args =
	{
		user_id: false, 
		username: false, 
		role: false, 
		profile_image: false,
		date_joined: false
	}

	args = Object.assign(def_args, args)

	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].user_id === args.user_id)
		{
			Hue.userlist[i].user_id = args.user_id
			Hue.userlist[i].username = args.username
			Hue.userlist[i].role = args.role
			Hue.userlist[i].profile_image = args.profile_image

			Hue.update_userlist()

			return false
		}
	}

	Hue.userlist.push(
	{
		user_id: args.user_id, 
		username: args.username, 
		role: args.role, 
		profile_image: args.profile_image,
		date_joined: args.date_joined
	})

	Hue.update_userlist()

	return true
}

// Removes a user from the user list
Hue.remove_from_userlist = function(user_id)
{
	for(let i=0; i<Hue.userlist.length; i++)
	{
		if(Hue.userlist[i].user_id === user_id)
		{
			Hue.userlist.splice(i, 1)
			Hue.update_userlist()
			break
		}
	}
}

// Replaces the username of a user in the user list with a new username
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

// Replaces the role of a user in the user list with a new role
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

// Gets the role of a user by username
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

// Sets all voice roles to voice1
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

// Sets all op roles to voice1
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

// Gets the short form of a specified role
// These are displayed next to the usernames in the user list
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

// Gets the full proper name of a specified role
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

// Gets a user from the user list by username
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

// Gets a user from the user list by ID
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

// Starts click events for usernames in the user list
Hue.start_userlist_click_events = function()
{
	$("#userlist").on("click", ".ui_item_uname", function()
	{
		let uname = $(this).text()

		if(Hue.userlist_mode === "normal")
		{
			Hue.show_profile(uname)
		}

		else if(Hue.userlist_mode === "whisper")
		{
			Hue.update_whisper_users(uname)
		}
	})
}

// Handles a user list update
// Rebuilds the HTML of the user list window
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

		let h = $("<div class='modal_item userlist_item'><span class='ui_item_role'></span><span class='ui_item_uname action dynamic_title'></span></div>")
		let p = Hue.role_tag(item.role)
		let pel = h.find('.ui_item_role').eq(0)

		pel.text(p)

		if(p === "")
		{
			pel.css("padding-right", 0)
		}

		let uname = h.find('.ui_item_uname')

		uname.eq(0).text(item.username)

		let t = `Joined: ${Hue.utilz.nice_date(item.date_joined)}`

		uname.attr("title", t)
		uname.data("otitle", t)
		uname.data("date", item.date_joined)

		s = s.add(h)
	}

	Hue.usercount = Hue.userlist.length
	Hue.update_usercount()

	$('#userlist').html(s)

	if(Hue.userlist_filtered)
	{
		Hue.do_modal_filter()
	}
}

// Used to sort the user list by order of roles
// Admins at the top, voice1 at the bottom, etc
// It sorts in alphabetical order on equal roles
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

// Sets a variable on context menu show or hide events
// This is to know whether a context menu is open
Hue.context_menu_events = 
{
	show: function()
	{
		Hue.context_menu_open = true
	},
	hide: function()
	{
		Hue.context_menu_open = false
	}
}

// Starts the context menu on username elements
Hue.start_username_context_menu = function()
{
	$.contextMenu(
	{
		selector: ".ui_item_uname, .chat_uname, #show_profile_uname, .generic_uname, .admin_list_username",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		events: Hue.context_menu_events,
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

// Starts the main menu context menu
Hue.start_main_menu_context_menu = function()
{
	$.contextMenu(
	{
		selector: "#main_menu_icon",
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
		selector: "#media_tv_maxer, #media_image_maxer",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		events: Hue.context_menu_events,
		className: "maxer_context",
		items: Hue.generate_tv_maxer_context_items()
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
				Hue.set_default_media_size()
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
			item3:
			{
				name: "Delete", callback: function(key, opt)
				{

				},
				visible: function(key, opt)
				{
					let message = $(this).closest(".message")
					let mode = message.data("mode")

					if(mode === "chat")
					{
						let user_id = $(this).closest(".message").data("user_id")

						if(!user_id)
						{
							return false
						}

						let user = Hue.get_user_by_id(user_id)

						if(user)
						{
							if(!Hue.user_is_controllable(user))
							{
								return false
							}
						}
						
						if(Hue.is_admin_or_op() || user_id === Hue.user_id)
						{
							return true
						}
					}

					else if(mode === "announcement")
					{
						let type = message.data("type")
						let id = message.data("item_id")
						
						if(id)
						{
							if(type === "image_change" || type === "tv_change" || type === "radio_change")
							{
								let user_id = message.data("user_id")

								if(!user_id)
								{
									return false
								}

								let user = Hue.get_user_by_id(user_id)

								if(user)
								{
									if(!Hue.user_is_controllable(user))
									{
										return false
									}
								}

								if(user_id === Hue.user_id || Hue.is_admin_or_op())
								{
									return true
								}
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
							let message = $(this).closest(".message")
							let mode = message.data("mode")

							if(mode === "chat")
							{
								let id = $(this).closest(".chat_content_container").eq(0).data("id")
								Hue.delete_message(id, true)
							}

							else if(mode === "announcement")
							{
								let type = message.data("type")
								let id = message.data("item_id")

								if(id)
								{
									if(type === "image_change" || type === "tv_change" || type === "radio_change")
									{
										Hue.delete_message(id, true)
									}
								}
							}
						}
					}
				}
			},
			item4:
			{
				name: "Change Image", callback: function(key, opt)
				{

				},
				visible: function(key, opt)
				{
					let url = $(this).closest(".message").data("first_url")	

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
							let first_url = $(this).closest(".message").data("first_url")
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
					let url = $(this).closest(".message").data("first_url")	

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
							let first_url = $(this).closest(".message").data("first_url")
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
					let url = $(this).closest(".message").data("first_url")	

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
							let first_url = $(this).closest(".message").data("first_url")
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
			name: "Clear", icon:"fa-trash-o", callback: function(key, opt)
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
		selector: "#main_menu_search_button",
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

// Returns a string with or without an 's' at the end depending on the amount of items
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

// Request a room list to the server
// Either a public or a visited room list
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

// Handles a received room list
// Either a public or a visited room list
Hue.on_roomlist_received = function(data)
{
	Hue.update_roomlist(data.type, data.roomlist)

	if(data.type === "public_roomlist")
	{
		Hue.show_public_roomlist()
	}

	else if(data.type === "visited_roomlist")
	{
		Hue.show_visited_roomlist()
	}
}

// Starts click events on room list items
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

// Builds the room list window items with received data
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

		h.find('.roomlist_topic').eq(0).text(topic).urlize()

		s = s.add(h)
	}

	$(`#${type}_container`).html(s)

	if(Hue[`${type}_filter_string`] !== "")
	{
		Hue.do_modal_filter(type)
	}
}

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

// Shows the Create Room window
Hue.show_create_room = function()
{
	Hue.msg_info2.show(["Create Room", Hue.template_create_room()], function()
	{
		$("#create_room_name").focus()
		Hue.create_room_open = true
	})
}

// Submit action of Create Room window
Hue.create_room_submit = function()
{
	let data = {}

	data.name = Hue.utilz.clean_string2($('#create_room_name').val().substring(0, Hue.config.max_room_name_length))

	if(data.name === "")
	{
		return false
	}

	data.public = JSON.parse($('#create_room_public option:selected').val())

	Hue.create_room(data)
}

// Puts a random room name in the Create Room window's input
Hue.create_room_suggest_name = function()
{
	let sentence = Hue.wordz.make_random_sentence(2, true)
	$("#create_room_name").val(sentence)
}

// Shows the Open Room window where the user selects how to open a room
Hue.show_open_room = function(id)
{
	if(id === Hue.config.main_room_id)
	{
		id = "/"
	}

	Hue.msg_info2.show(["Open Room", Hue.template_open_room({id:id})], function()
	{
		Hue.open_room_open = true
	})
}

// Shows the user list
Hue.show_userlist = function(mode="normal", filter=false)
{
	Hue.userlist_mode = mode

	if(mode === "normal")
	{
		Hue.update_usercount()
	}

	else if(mode === "whisper")
	{
		Hue.msg_userlist.set_title("Add or Remove a User")
	}
	
	Hue.msg_userlist.show(function()
	{
		if(filter)
		{
			$("#userlist_filter").val(filter)
			Hue.do_modal_filter()
		}
	})
}

// Shows the public room list
Hue.show_public_roomlist = function()
{
	Hue.msg_public_roomlist.show()
}

// Shows the visited room list
Hue.show_visited_roomlist = function()
{
	Hue.msg_visited_roomlist.show()
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

// Starts Dropzone events for file drag and drop events
// This also handles normal uploads by clicking the Upload button
Hue.start_dropzone = function()
{
	Hue.dropzone = new Dropzone("body",
	{
		url: "/",
		maxFiles: 1,
		maxFilesize: Hue.config.max_image_size / 1024,
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

		if(size > Hue.config.max_image_size)
		{
			Hue.dropzone.files = []
			Hue.feedback("File is too big")
			return false
		}

		let ext = file.name.split('.').pop(-1).toLowerCase()

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif')
		{
			Hue.dropzone.files = []
			return false
		}

		Hue.dropzone.files = []

		Hue.show_upload_comment(file, "image_upload")
	})
}

// Creates a file reader for files
Hue.create_file_reader = function(file)
{
	let reader = new FileReader()

	reader.addEventListener("loadend", function(e)
	{
		Hue.socket_emit('slice_upload',
		{
			data: reader.result,
			action: file.hue_data.action,
			name: file.hue_data.name,
			type: file.hue_data.type,
			size: file.hue_data.size,
			date: file.hue_data.date,
			comment: file.hue_data.comment
		})
	})

	return reader
}

// Handles file uploads of different kinds
// Sets all required data
// Creates a file reader
// Starts a sliced upload
Hue.upload_file = function(args={})
{
	let def_args =
	{
		file: false,
		action: false,
		name: false,
		comment: false
	}

	args = Object.assign(def_args, args)

	if(!args.file || !args.action)
	{
		return false
	}

	if(args.file.hue_data === undefined)
	{
		args.file.hue_data = {}
	}

	args.file.hue_data.action = args.action

	if(args.name)
	{
		args.file.hue_data.name = args.name
	}

	else
	{
		args.file.hue_data.name = args.file.name
	}

	if(args.comment)
	{
		args.file.hue_data.comment = args.comment
	}

	if(args.file.hue_data.action === "background_image_upload")
	{
		for(let d in Hue.files)
		{
			let f = Hue.files[d]

			if(f.hue_data.action === "background_image_upload")
			{
				Hue.cancel_file_upload(d, false)
			}
		}
	}

	args.file.hue_data.size = args.file.size
	args.file.hue_data.type = args.file.type

	let date = Date.now()

	args.file.hue_data.date = date

	if(args.file.hue_data.name !== undefined)
	{
		args.file.hue_data.name = Hue.utilz.clean_string5(args.file.hue_data.name).replace(/.gifv/g, ".gif")
	}

	else
	{
		args.file.hue_data.name = "no_name"
	}

	args.file.hue_data.reader = Hue.create_file_reader(args.file)

	let slice = args.file.slice(0, Hue.config.upload_slice_size)

	Hue.files[date] = args.file
	args.file.hue_data.next = Hue.get_file_next(args.file)

	if(args.file.hue_data.next >= 100)
	{
		args.file.hue_data.sending_last_slice = true
	}

	else
	{
		args.file.hue_data.sending_last_slice = false
	}

	args.file.hue_data.percentage = 0

	let message = `Uploading ${Hue.get_file_action_name(args.file.hue_data.action)}: 0%`

	let obj =
	{
		brk: "<i class='icon2c fa fa-info-circle'></i>",
		id: `uploading_${date}`,
		title: `Size: ${Hue.utilz.get_size_string(args.file.hue_data.size / 1024)} | ${Hue.utilz.nice_date()}`
	}

	if(!args.file.hue_data.sending_last_slice)
	{
		obj.onclick = function()
		{
			Hue.cancel_file_upload(date)
		}
	}

	Hue.feedback(message, obj)

	args.file.hue_data.reader.readAsArrayBuffer(slice)
}

// Cancels a file upload
// Deletes the local file and sends a signal to the server to try to cancel it on time
Hue.cancel_file_upload = function(date, check=true)
{
	let file = Hue.files[date]

	if(!file)
	{
		return false
	}

	if(file.hue_data.sending_last_slice)
	{
		return false
	}

	Hue.change_upload_status(file, "Cancelled", true)

	if(check)
	{
		if(file.hue_data.action === "background_image_upload")
		{
			Hue.config_admin_background_image()
		}
	}

	delete Hue.files[date]

	Hue.socket_emit("cancel_upload", {date:date})
}

// Gets the percentage based on the next file slice to be uploaded
// Last slice would be 100
Hue.get_file_next = function(file)
{
	let next = Math.floor(((Hue.config.upload_slice_size * 1) / file.hue_data.size) * 100)

	if(next > 100)
	{
		next = 100
	}

	return next
}

// Updates the upload status announcement based on upload progress
Hue.change_upload_status = function(file, status, clear=false)
{
	$(`#uploading_${file.hue_data.date}`)
	.find(".announcement_content")
	.eq(0).text(`Uploading ${Hue.get_file_action_name(file.hue_data.action)}: ${status}`)

	if(clear)
	{
		$(`#uploading_${file.hue_data.date}`).remove()
		Hue.goto_bottom(false, false)
	}
}

// Gets proper names for file upload types
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

// Checks whether an HTML element is a text editable widget
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

// Handles actions after a copy event
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

// Debounce timer for double tap 1
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

// Debounce timer for double tap 2
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

// Debounce time for double tap 3
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

// Resets double tap key press state
Hue.reset_double_tap_keys_pressed = function()
{
	Hue.double_tap_key_pressed = 0
	Hue.double_tap_key_2_pressed = 0
	Hue.double_tap_key_3_pressed = 0
}

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

		if(!(Hue.is_textbox(document.activeElement) 
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

// Changes the input
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

// Focuses the input
Hue.focus_input = function()
{
	if(Hue.modal_open)
	{
		return false
	}

	$("#input").focus()
}

// Removes focus on the input
Hue.blur_input = function()
{
	$("#input").blur()
}

// Moves the input's caret to the end
Hue.input_to_end = function()
{
	$('#input')[0].scrollLeft = $('#input')[0].scrollWidth
}

// Adds an item to the input history
Hue.add_to_input_history = function(message, change_index=true)
{
	for(let i=0; i<Hue.input_history.length; i++)
	{
		if(Hue.input_history[i].message === message)
		{
			Hue.input_history.splice(i, 1)
			break
		}
	}

	let date = Date.now()
	let item = {message:message, date:date}

	Hue.input_history.push(item)

	if(Hue.input_history.length > Hue.config.input_history_crop_limit)
	{
		Hue.input_history = Hue.input_history.slice(Hue.input_history.length - Hue.config.input_history_crop_limit)
	}

	if(change_index)
	{
		Hue.reset_input_history_index()
	}

	Hue.save_input_history()
}

// Saves the input history localStorage object
Hue.save_input_history = function()
{
	Hue.save_local_storage(Hue.ls_input_history, Hue.input_history)
}

// Gets the input history localStorage object
Hue.get_input_history = function()
{
	Hue.input_history = Hue.get_local_storage(Hue.ls_input_history)

	if(Hue.input_history === null)
	{
		Hue.input_history = []
	}

	Hue.reset_input_history_index()
}

// Resets the input history item index
// This index is used to determine what to show on 'up' or 'down' actions in the input
Hue.reset_input_history_index = function()
{
	Hue.input_history_index = Hue.input_history.length
}

// This handles 'up' or 'down' actions for the input
// Shows the next input history item based on current history item index
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

		v = Hue.input_history[Hue.input_history_index].message
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

		v = Hue.input_history[Hue.input_history_index].message
	}

	Hue.change_input(v)
}

// Setups input history window events
Hue.setup_input_history = function()
{
	$("#input_history_container").on("click", ".input_history_item", function()
	{
		if($(this).find('a').length === 0)
		{
			Hue.change_input($(this).text())
			Hue.close_all_modals()
		}
	})

	$("#input_history_clear_icon").click(function()
	{
		if(confirm("Are you sure you want to clear the input history?"))
		{
			Hue.clear_input_history()
			Hue.show_input_history()
		}
	})
}

// Empties the input history localStorage object
Hue.clear_input_history = function()
{
	Hue.input_history = []
	Hue.save_input_history()
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

// Checks if a string, in any alphabetical order, matches a command
Hue.oi_equals = function(str, what)
{
	return str === Hue.commands_sorted[what]
}

// Checks if a string, in any alphabetical order, starts with a command
Hue.oi_startswith = function(str, what)
{
	return str.startsWith(`${Hue.commands_sorted[what]} `)
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

// Debounce timer for scroll events
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

// Starts window resize events
Hue.resize_events = function()
{
	$(window).resize(function()
	{
		Hue.resize_timer()
	})
}

// Debounce window resize timer
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

// What to do after a window resize
Hue.on_resize = function(check_clone=true)
{
	Hue.fix_frames()
	Hue.goto_bottom(false, false)
	Hue.check_scrollers()
	Hue.fix_input_clone()

	if(check_clone)
	{
		Hue.check_input_clone_overflow($("#input").val())
	}
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
		message: fmessage, 
		save: true, 
		id: args.id, 
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

// This is a centralized function to insert all chat or announcement messages into the chat
Hue.add_to_chat = function(args={})
{
	let def_args =
	{
		message: false,
		notify: true,
		id: false,
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

					last_message.find(".chat_container").eq(0).append(content_container)
					message_id = last_message.data("message_id")

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

	if(args.notify && Hue.started && args.message.data("highlighted"))
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

	let item = args.item ? args.item : Hue[`current_${args.type}`]()
	let bypass_lock = false
	
	if(item.setter === Hue.username)
	{
		bypass_lock = Hue.get_setting("bypass_tv_lock_on_own_change")
	}

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
		if(!Hue.room_state.images_enabled)
		{
			return false
		}

		let locked = Hue.room_state.images_locked && !bypass_lock

		if(!args.item && locked && Hue.last_image_source && !args.current_source)
		{
			return false
		}

		if(Hue.room_images_mode === "disabled")
		{
			return false
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
			src = item.source
			source_changed = true
		}		

		Hue.show_image(item, args.force)

		if(source_changed)
		{
			Hue.last_image_source = item.source
		}

		setter = item.setter

		if(!args.item || args.item === Hue.current_image())
		{
			$("#footer_lock_images_icon").removeClass("blinking")
		}

		Hue.loaded_image = item

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

		if(!args.item && locked && Hue.last_tv_source && !args.current_source)
		{
			return false
		}

		if(Hue.room_tv_mode === "disabled")
		{
			return false
		}

		let source_changed

		if(args.current_source && Hue.last_tv_source)
		{
			src = Hue.last_tv_source
			source_changed = false
		}

		else
		{
			src = item.source
			source_changed = true
		}

		if(item.type === "youtube")
		{
			if(Hue.youtube_video_player === undefined)
			{
				Hue.request_media("youtube_video_player", args)
				return false
			}

			Hue.show_youtube_video(item, args.play)
		}

		else if(item.type === "twitch")
		{
			if(Hue.twitch_video_player === undefined)
			{
				Hue.request_media("twitch_video_player", args)
				return false
			}

			Hue.show_twitch_video(item, args.play)
		}

		else if(item.type === "soundcloud")
		{
			if(Hue.soundcloud_video_player === undefined)
			{
				Hue.request_media("soundcloud_video_player", args)
				return false
			}

			Hue.show_soundcloud_video(item, args.play)
		}

		else if(item.type === "vimeo")
		{
			if(Hue.vimeo_video_player === undefined)
			{
				Hue.request_media("vimeo_video_player", args)
				return false
			}

			Hue.show_vimeo_video(item, args.play)
		}

		else if(item.type === "video")
		{
			Hue.show_video_video(item, args.play)
		}

		else if(item.type === "iframe")
		{
			Hue.show_iframe_video(item, args.play)
		}

		else
		{
			return false
		}

		if(source_changed)
		{
			Hue.last_tv_source = item.source
			Hue.last_tv_type = item.type
		}

		setter = item.setter

		if(!args.item || args.item === Hue.current_tv())
		{
			$("#footer_lock_tv_icon").removeClass("blinking")
		}

		Hue.loaded_tv = item
	}

	else if(args.type === "radio")
	{
		if(!Hue.room_state.radio_enabled)
		{
			return false
		}

		let locked = Hue.room_state.radio_locked && !bypass_lock

		if(!args.item && locked && Hue.last_radio_source && !args.current_source)
		{
			return false
		}

		if(Hue.room_radio_mode === "disabled")
		{
			return false
		}

		let source_changed

		if(args.current_source && Hue.last_radio_source)
		{
			src = Hue.last_radio_source
			type = Hue.last_radio_type
			source_changed = false
		}

		else
		{
			src = item.source
			type = item.type
			source_changed = true
		}

		if(item.type === "youtube")
		{
			if(Hue.youtube_player === undefined)
			{
				Hue.request_media("youtube_player", args)
				return false
			}
		}

		else if(item.type === "soundcloud")
		{
			if(Hue.soundcloud_player === undefined)
			{
				Hue.request_media("soundcloud_player", args)
				return false
			}
		}

		let force = false

		if(args.item || bypass_lock)
		{
			force = true
		}

		Hue.load_radio(item, force)

		if(source_changed)
		{
			Hue.last_radio_source = item.source
			Hue.last_radio_type = item.type
		}

		setter = item.setter

		if(!args.item || args.item === item)
		{
			$("#footer_lock_radio_icon").removeClass("blinking")
		}

		Hue.loaded_radio = item
	}

	else
	{
		return false
	}

	Hue.update_media_history_blinks()
	Hue.check_media_menu_loaded_media()

	if(args.notify && setter !== Hue.username)
	{
		Hue.on_activity("media_change")
	}
}

// Loads an image with a specified item
Hue.show_image = function(item, force=false)
{
	$("#media_image_frame").attr("crossOrigin", "anonymous")
	$("#media_image_error").css("display", "none")
	$("#media_image_frame").css("display", "initial")

	if(force || $("#media_image_frame").attr("src") !== item.source)
	{
		$("#media_image_frame").attr("src", item.source)
	}

	else
	{
		Hue.after_image_load()
	}
}

// Opens the image modal with the current image
Hue.show_current_image_modal = function(current=true)
{
	if(current)
	{
		Hue.show_modal_image(Hue.current_image_data)
	}

	else
	{
		if(Hue.images_changed.length > 0)
		{
			let data = Hue.images_changed[Hue.images_changed.length - 1]
			Hue.show_modal_image(data)
		}
	}
}

// Starts events for the image
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

	$("#media_image_frame").height(0)
	$("#media_image_frame").width(0)
}

// This runs after an image successfully loads
Hue.after_image_load = function()
{
	Hue.current_image_data = Hue.loaded_image
	Hue.get_dominant_theme()
	Hue.fix_image_frame()
}

// Tries to get the dominant color of the image
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

// This generates all announcements inserted into the chat
Hue.chat_announce = function(args={})
{
	let def_args =
	{
		brk: "",
		message: "",
		highlight: false,
		title: false,
		onclick: false,
		id: false,
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
		item_id: false,
		user_id: false,
		replace_markdown: false
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

	if(args.id)
	{
		container_id = ` id='${args.id}' `
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
	
	fmessage.data("public", args.public)
	fmessage.data("date", d)
	fmessage.data("highlighted", highlighted)
	fmessage.data("type", args.type)
	fmessage.data("info1", args.info1)
	fmessage.data("info2", args.info2)
	fmessage.data("uname", args.username)
	fmessage.data("mode", "announcement")
	fmessage.data("first_url", first_url)
	fmessage.data("item_id", args.item_id)
	fmessage.data("user_id", args.user_id)

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

// JQuery function to turn url text into actual links
jQuery.fn.urlize = function(stop_propagation=true)
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
		
		for(let i=0; i<matches.length; i++)
		{
			let url = matches[i]
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

// Setups commands based on the commands object
// Makes sorted variations
// Checks if anagrams collide
Hue.setup_commands = function()
{
	Hue.commands = []

	for(let key in Hue.command_actions)
	{
		Hue.commands.push(key)
	}

	Hue.commands.sort()

	for(let command of Hue.commands)
	{
		let sorted = command.split('').sort().join('')
		Hue.commands_sorted[command] = sorted
		Hue.commands_sorted_2[sorted] = command
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

// Checks whether some string is a command
Hue.is_command = function(message)
{
	if(message.length >= 2
	&& message[0] === "/"
	&& message[1] !== "/"
	&& message[1] !== " "
	&& !message.startsWith("/me ")
	&& !message.startsWith("/em "))
	{
		return true
	}

	return false
}

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

	args.message = Hue.clean_multiline(args.message)

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
			args.message = Hue.utilz.clean_string10(Hue.clean_multiline(args.message))

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

// Responsible of executing a command
// It will check the commands object to see if a command matches
// Executes the declared action
Hue.execute_command = function(message, ans)
{
	let split = message.split(' ')
	let cmd = split[0].toLowerCase()
	let arg = split.slice(1).join(" ")
	let needs_confirm = false

	if(cmd.endsWith("?"))
	{
		cmd = cmd.slice(0, -1)
		needs_confirm = true
	}

	if(cmd.length < 2)
	{
		Hue.feedback("Invalid empty command")
		return ans
	}

	let cmd_sorted = cmd.split('').sort().join('')
	let command = Hue.commands_sorted_2[cmd_sorted]

	if(!command)
	{
		Hue.feedback(`Invalid command "${cmd.slice(1)}". Maybe it is missing an argument. To start a message with / use //`)
		return ans
	}

	if(needs_confirm)
	{
		if(confirm(`Are you sure you want to execute ${command}?`))
		{
			Hue.command_actions[command](arg, ans)
		}

		else
		{
			return ans
		}
	}
	
	else
	{
		Hue.command_actions[command](arg, ans)
	}
	
	return ans
}

// Changes the topic
Hue.change_topic = function(dtopic)
{
	if(Hue.is_admin_or_op())
	{
		dtopic = Hue.utilz.clean_string2(dtopic.substring(0, Hue.config.max_topic_length))

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

// Appends the topic with new text
Hue.topicadd = function(arg)
{
	if(Hue.is_admin_or_op())
	{
		arg = Hue.utilz.clean_string2(arg)

		if(arg.length === 0)
		{
			return
		}

		let ntopic = Hue.topic + Hue.config.topic_separator + arg

		if(ntopic.length > Hue.config.max_topic_length)
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

// Removes topic sections
Hue.topictrim = function(n)
{
	if(Hue.is_admin_or_op())
	{
		let split = Hue.topic.split(Hue.config.topic_separator)

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
				let t = split.slice(0, -n).join(Hue.config.topic_separator)

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

// Prepends the topic with new text
Hue.topicstart = function(arg)
{
	if(Hue.is_admin_or_op())
	{
		arg = Hue.utilz.clean_string2(arg)

		if(arg.length === 0)
		{
			return
		}

		let ntopic = arg + Hue.config.topic_separator + Hue.topic

		if(ntopic.length > Hue.config.max_topic_length)
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

// Removes topic sections from the start
Hue.topictrimstart = function(n)
{
	if(Hue.is_admin_or_op())
	{
		let split = Hue.topic.split(Hue.config.topic_separator)

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
				let t = split.slice(n, split.length).join(Hue.config.topic_separator)

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

// Changes the input with the topic to be edited
Hue.topicedit = function()
{
	Hue.change_input(`/topic ${Hue.topic}`)
}

// Announces topic changes
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

// Announces room name changes
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
		Hue.update_input_placeholder()
	}
}

// Announces username changes
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

	if(Hue.admin_list_open)
	{
		Hue.request_admin_list()
	}
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

// Sends an emit to change the image source
Hue.emit_change_image_source = function(url, comment="")
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have permission to change images")
		return false
	}

	Hue.socket_emit('change_image_source', {src:url, comment:comment})
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
							if(source.artist !== undefined && source.title !== undefined)
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
		let date = Date.now()
		let nd = Hue.utilz.nice_date(date)

		let pi = `
		<div class='played_item_inner pointer inline action dynamic_title' title='${nd}' data-otitle='${nd}' data-date='${date}'>
			<div class='played_item_title'></div><div class='played_item_artist'></div>
		</div>`

		let h = $(`<div class='modal_item played_item'>${pi}</div>`)

		if(info)
		{
			h.find('.played_item_title').eq(0).text(info.title)
			h.find('.played_item_artist').eq(0).text(`by ${info.artist}`)
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
			Hue.do_modal_filter()
		}
	}

	Hue.show_now_playing()
}

// Hides the Now Playing section in the header
Hue.hide_now_playing = function()
{
	$('#header_now_playing_area').css('display', 'none')
}

// Shows the Now Playing section in the header
Hue.show_now_playing = function()
{
	$('#header_now_playing_area').css('display', 'flex')
}

// Starts the loaded radio
Hue.start_radio = function()
{
	if(Hue.loaded_radio.type === "audio")
	{
		$('#audio_player').attr("src", Hue.loaded_radio.source)
		$('#audio_player')[0].play()
	}

	else if(Hue.loaded_radio.type === "youtube")
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

	else if(Hue.loaded_radio.type === "soundcloud")
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
		Hue.stop_tv(false)
	}
}

// Destroys all unused radio players
Hue.hide_radio = function(item)
{
	$("#media_radio .media_radio_item").each(function()
	{
		let id = $(this).attr("id")
		let type = id.replace("media_", "").replace("_audio_container", "")

		if(item.type !== type)
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

		Hue.radio_started = false

		if(Hue.stop_radio_timeout)
		{
			Hue.clear_automatic_stop_radio()
		}
	}
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
	}, Hue.config.setterradio_metadata_interval_duration)
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

	if(Hue.youtube_player !== undefined)
	{
		if(vt > 0)
		{
			Hue.youtube_player.unMute()
		}

		Hue.youtube_player.setVolume(vt)
	}

	if(Hue.soundcloud_player !== undefined)
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

// Sets the tv volume
Hue.set_tv_volume = function(nv=false, changed=true, update_slider=true)
{
	if(typeof nv !== "number")
	{
		nv = Hue.room_state.tv_volume
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

	Hue.room_state.tv_volume = nv

	let vt = Hue.utilz.to_hundred(nv)

	if($("#media_video").length > 0)
	{
		$('#media_video')[0].volume = nv
	}

	if(Hue.youtube_video_player !== undefined)
	{
		Hue.youtube_video_player.setVolume(vt)
	}

	if(Hue.twitch_video_player !== undefined)
	{
		Hue.twitch_video_player.setVolume(nv)
	}

	if(Hue.soundcloud_video_player !== undefined)
	{
		Hue.soundcloud_video_player.setVolume(vt)
	}

	if(Hue.vimeo_video_player !== undefined)
	{
		Hue.vimeo_video_player.setVolume(nv)
	}

	if(changed)
	{
		if(update_slider)
		{
			Hue.set_media_menu_tv_volume(nv)
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

// Increases the tv volume
Hue.tv_volume_increase = function(step=0.1)
{
	if(Hue.room_state.tv_volume === 1)
	{
		return false
	}

	let nv = Hue.room_state.tv_volume + step

	Hue.set_tv_volume(nv)
}

// Decreases the tv volume
Hue.tv_volume_decrease = function(step=0.1)
{
	if(Hue.room_state.tv_volume === 0)
	{
		return false
	}

	let nv = Hue.room_state.tv_volume - step

	Hue.set_tv_volume(nv)
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

// Plays a sound notification depending on the type
Hue.sound_notify = function(type)
{
	let sound

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

	Hue.play_audio(sound)
}

// Changes the tab title to reflect activity
// The character used depends on the activity type
// Either general activity, or highlighted activity
Hue.alert_title = function(mode)
{
	let modes = [1, 2]

	if(!modes.includes(mode))
	{
		return false
	}

	if(mode === 1 && Hue.alert_mode !== 0)
	{
		return false
	}

	if(mode === 2 && Hue.alert_mode === 2)
	{
		return false
	}
	
	Hue.alert_mode = mode
	Hue.update_title()
}

// Removes the activity indicator in the tab title
Hue.remove_alert_title = function()
{
	if(Hue.alert_mode > 0)
	{
		Hue.alert_mode = 0
		Hue.update_title()
	}
}

// Sets the tab title
Hue.set_title = function(s)
{
	document.title = s.substring(0, Hue.config.max_title_length)
}

// Updates the tab title
// Taking into account the alert mode, room name, and topic
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
		t += ` ${Hue.config.title_separator} ${Hue.topic}`
	}

	Hue.set_title(t)
}

// Starts the listener to check when the client is visible or not
// A function is executed on visibility change
// Blur event is also included to handle some cases
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

// This runs after a visibility change
// Does things depending if the client is visible or not
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

// This runs when the client regains visibility
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

	Hue.show_fresh_messages()
	Hue.trigger_activity()
}

// This runs when the client loses visibility
Hue.on_app_unfocused = function()
{
	if(Hue.get_setting("afk_delay") !== "never")
	{
		Hue.afk_timer = setTimeout(function()
		{
			Hue.afk = true
		}, Hue.get_setting("afk_delay"))
	}

	Hue.check_scrollers()
}

// Copies the room url to the clipboard
Hue.copy_room_url = function()
{
	let r

	if(Hue.room_id === Hue.config.main_room_id)
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

// Copies a string to the clipboard
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

// Plays the <audio> radio player
Hue.play_audio = function(what)
{
	$(`#audio_${what}`)[0].play()
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

// Creates a room
Hue.create_room = function(data)
{
	Hue.msg_info2.close(function()
	{
		Hue.socket_emit('create_room', data)
	})
}

// Restarts the client
Hue.restart_client = function()
{
	Hue.user_leaving = true
	window.location = window.location
}

// Gets a volume number in percentage form
// Like 20 or 100
Hue.get_nice_volume = function(volume)
{
	return parseInt(Math.round((volume * 100)))
}

// Debounce timer for chat search filter
Hue.chat_search_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.show_chat_search($("#chat_search_filter").val())
		}, Hue.filter_delay)
	}
})()

// Resets chat search filter state
Hue.reset_chat_search_filter = function()
{
	$("#chat_search_filter").val("")
	$("#chat_search_container").html("")
	$("#chat_search_no_results").css("display", "none")
}

// Shows the chat search window
Hue.show_chat_search = function(filter=false)
{
	if(filter)
	{
		filter = filter.trim()
	}

	let sfilter = filter ? filter : ''

	$("#chat_search_container").html("")
	$("#chat_search_no_results").css("display", "none")
	$("#chat_search_filter").val(sfilter)

	if(filter)
	{
		let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
		let words = lc_value.split(" ").filter(x => x.trim() !== "")
		let clone = $($("#chat_area").children().get().reverse()).clone(true, true)
	
		clone.each(function()
		{
			$(this).removeAttr("id")
		})
	
		clone = clone.filter(function()
		{
			if($(this).hasClass("vseparator_container"))
			{
				return false
			}

			let text = $(this).text().toLowerCase()
			return words.some(word => text.includes(word))
		})

		if(clone.children().length === 0)
		{
			$("#chat_search_no_results").css("display", "block")
		}

		else
		{
			clone.appendTo("#chat_search_container")
		}
		
		Hue.add_to_chat_searches(filter)
	}

	Hue.msg_chat_search.show(function()
	{
		Hue.scroll_modal_to_top("chat_search")
	})
}

// Adds an item to the recently searched list for chat searches
Hue.add_to_chat_searches = function(filter)
{
	clearTimeout(Hue.add_to_chat_searches_timeout)

	Hue.add_to_chat_searches_timeout = setTimeout(function()
	{
		Hue.do_add_to_chat_searches(filter)
	}, Hue.add_to_chat_searches_delay)
}

// Does the actual addition to the chat searches list
Hue.do_add_to_chat_searches = function(filter)
{
	for(let i=0; i<Hue.room_state.chat_searches.length; i++)
	{
		if(Hue.room_state.chat_searches[i] === filter)
		{
			Hue.room_state.chat_searches.splice(i, 1)
			break
		}
	}

	Hue.room_state.chat_searches.unshift(filter)
		
	if(Hue.room_state.chat_searches.length > Hue.config.max_chat_searches)
	{
		Hue.room_state.chat_searches = Hue.room_state.chat_searches.slice(0, Hue.config.max_chat_searches)
	}

	Hue.save_room_state()
}

// Clears the chat searches list
Hue.clear_chat_searches = function()
{
	Hue.room_state.chat_searches = []
	Hue.save_room_state()
}

// Clears the chat area
Hue.clear_chat = function()
{
	$('#chat_area').html("")

	Hue.show_log_messages()
	Hue.goto_bottom(true)
	Hue.focus_input()
}

// Clears the input
Hue.clear_input = function()
{
	Hue.change_input("")
	Hue.old_input_val = ""
}

// Appends to the input
Hue.add_to_input = function(what)
{
	Hue.change_input(`${$('#input').val() + what}`)
}

// Sets topic data with received data
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
	Hue.topic_date = Hue.utilz.nice_date(data.topic_date)

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

// Checks if the user is joining for the first time
// This is site wide, not room wide
Hue.check_firstime = function()
{
	if(Hue.get_local_storage(Hue.ls_first_time) === null)
	{
		Hue.first_time = true
		Hue.show_intro()
		Hue.request_notifications_permission()
		Hue.save_local_storage(Hue.ls_first_time, false)
	}

	else
	{
		Hue.first_time = false
	}
}

// Changes a user's role
Hue.change_role = function(uname, rol)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.config.max_max_username_length)
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

// Shows an error message on file upload failure
Hue.show_upload_error = function()
{
	Hue.feedback("The image could not be uploaded")
}

// Announces a user's role change
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

	if(Hue.admin_list_open)
	{
		Hue.request_admin_list()
	}
}

// Role setter for user
Hue.set_role = function(rol, config=true)
{
	Hue.role = rol

	Hue.check_permissions()

	if(config)
	{
		Hue.config_main_menu()
	}
}

// Changes the room privacy to public or private
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

// Announces a privacy change
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

// Attempts to change the radio source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
Hue.change_radio_source = function(src, just_check=false)
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

	let r = Hue.get_media_change_inline_comment("radio", src)

	src = r.source
	
	let comment = r.comment

	if(comment.length > Hue.config.safe_limit_4)
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

	if(src.length > Hue.config.max_radio_source_length)
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

// Attempts to change the tv source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
Hue.change_tv_source = function(src, just_check=false)
{
	let feedback = true

	if(just_check)
	{
		feedback = false
	}

	if(!Hue.can_tv)
	{
		if(feedback)
		{
			Hue.feedback("You don't have permission to change the tv")
		}

		return false
	}

	let r = Hue.get_media_change_inline_comment("tv", src)

	src = r.source

	let comment = r.comment

	if(comment.length > Hue.config.safe_limit_4)
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

	if(src.length > Hue.config.max_tv_source_length)
	{
		return false
	}

	if(src.startsWith("/"))
	{
		return false
	}

	if(src === Hue.current_tv().source || src === Hue.current_tv().query)
	{
		if(feedback)
		{
			Hue.feedback("TV is already set to that")
		}

		return false
	}

	else if(src === "default")
	{
		// OK
	}

	else if(src === "prev" || src === "previous")
	{
		if(Hue.tv_changed.length > 1)
		{
			src = Hue.tv_changed[Hue.tv_changed.length - 2].source
		}

		else
		{
			if(feedback)
			{
				Hue.feedback("No tv source before current one")
			}
			
			return false
		}
	}

	if(Hue.utilz.is_url(src))
	{
		if(Hue.check_domain_list("tv", src))
		{
			if(feedback)
			{
				Hue.feedback("TV sources from that domain are not allowed")
			}

			return false
		}

		if(src.includes("youtube.com") || src.includes("youtu.be"))
		{
			if(Hue.utilz.get_youtube_id(src) && !Hue.config.youtube_enabled)
			{
				if(feedback)
				{
					Hue.feedback("YouTube support is not enabled")
				}

				return false
			}
		}

		else if(src.includes("twitch.tv"))
		{
			if(Hue.utilz.get_twitch_id(src) && !Hue.config.twitch_enabled)
			{
				if(feedback)
				{
					Hue.feedback("Twitch support is not enabled")
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

		else if(src.includes("vimeo.com"))
		{
			if(!Hue.config.vimeo_enabled)
			{
				if(feedback)
				{
					Hue.feedback("Vimeo support is not enabled")
				}

				return false
			}
		}

		else
		{
			let extension = Hue.utilz.get_extension(src).toLowerCase()

			if(extension)
			{
				if(Hue.utilz.video_extensions.includes(extension) || Hue.utilz.audio_extensions.includes(extension))
				{
					// OK
				}

				else if(Hue.utilz.image_extensions.includes(extension))
				{
					if(feedback)
					{
						Hue.feedback("That doesn't seem to be a video")
					}

					return false
				}

				else if(!Hue.config.iframes_enabled)
				{
					if(feedback)
					{
						Hue.feedback("IFrame support is not enabled")
					}

					return false
				}
			}

			else
			{
				if(!Hue.config.iframes_enabled)
				{
					if(feedback)
					{
						Hue.feedback("IFrame support is not enabled")
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
				Hue.feedback("YouTube support is not enabled")
			}

			return false
		}
	}

	if(just_check)
	{
		return true
	}

	Hue.socket_emit('change_tv_source', {src:src, comment:comment})
}

// Bans a user
Hue.ban = function(uname)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.config.max_max_username_length)
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

// Unbans a user
Hue.unban = function(uname)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.config.max_max_username_length)
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

// Unbans all banned users
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

// Gets the number of users banned
Hue.get_ban_count = function()
{
	if(Hue.is_admin_or_op())
	{
		Hue.socket_emit('get_ban_count', {})
	}
}

// Shows a window with the number of users banned
Hue.receive_ban_count = function(data)
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

// Kicks a user
Hue.kick = function(uname)
{
	if(Hue.is_admin_or_op())
	{
		if(uname.length > 0 && uname.length <= Hue.config.max_max_username_length)
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

// Announces that a user was banned
Hue.announce_ban = function(data)
{
	Hue.public_feedback(`${data.username1} banned ${data.username2}`,
	{
		username: data.username1,
		open_profile: true
	})

	if(Hue.ban_list_open)
	{
		Hue.request_ban_list()
	}
}

// Announces that a user was unbanned
Hue.announce_unban = function(data)
{
	Hue.public_feedback(`${data.username1} unbanned ${data.username2}`,
	{
		username: data.username1,
		open_profile: true
	})

	if(Hue.ban_list_open)
	{
		Hue.request_ban_list()
	}
}

// Announces that all banned users were unbanned
Hue.announce_unban_all = function(data)
{
	Hue.public_feedback(`${data.username} unbanned all banned users`,
	{
		username: data.username,
		open_profile: true
	})
}

// Checks if a user already has a certain role
Hue.is_already = function(who, what)
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

// Announces that the operation cannot be applied to a certain user
// This is usually because the user's role is not low enough
Hue.forbiddenuser = function()
{
	Hue.feedback("That operation is forbidden on that user")
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

// Resets all voiced users to voice1
Hue.reset_voices = function()
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit('reset_voices', {})
}

// Resets all op users to voice1
Hue.remove_ops = function()
{
	if(Hue.role !== 'admin')
	{
		Hue.feedback("You are not a room admin")
		return false
	}

	Hue.socket_emit('remove_ops', {})
}

// Announces that voices were resetted
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

// Announces that ops were resetted
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

	if(Hue.admin_list_open)
	{
		Hue.request_admin_list()
	}
}

// What to do when a user disconnects
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

// Clears the disconnect timeout for a certain user
Hue.clear_from_users_to_disconnect = function(data)
{
	for(let i=0; i<Hue.users_to_disconnect.length; i++)
	{
		let u = Hue.users_to_disconnect[i]

		if(u.user_id === data.user_id)
		{
			clearTimeout(u.timeout)
			Hue.users_to_disconnect.splice(i, 1)
			break
		}
	}
}

// Starts a disconnect timeout for a certain user
Hue.start_user_disconnect_timeout = function(data)
{
	Hue.clear_from_users_to_disconnect(data)

	data.timeout = setTimeout(function()
	{
		Hue.do_userdisconnect(data)
	}, Hue.config.disconnect_timeout_delay)

	Hue.users_to_disconnect.push(data)
}

// After a disconnect timeout triggers this function is called
Hue.do_userdisconnect = function(data)
{
	Hue.clear_from_users_to_disconnect(data)
	Hue.remove_from_userlist(data.user_id)
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

			if(Hue.ban_list_open)
			{
				Hue.request_ban_list()
			}
		}

		Hue.public_feedback(s,
		{
			brk: "<i class='icon2c fa fa-sign-out'></i>",
			save: true,
			username: data.username
		})
	}
}

// Starts and configures all Msg modal instances
Hue.start_msg = function()
{
	let common =
	{
		show_effect_duration: [200, 200],
		close_effect_duration: [200, 200],
		clear_editables: true,
		class: "modal",
		after_create: function(instance)
		{
			Hue.after_modal_create(instance)
		},
		before_show: function(instance)
		{
			if(Hue.room_state.screen_locked)
			{
				if(instance.options.id !== "lockscreen")
				return false
			}
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
			after_close: function(instance)
			{
				common.after_close(instance)
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
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.close_togglers("user_menu")
			}
		})
	)

	Hue.msg_userlist = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "userlist",
			window_width: "22em"
		})
	)

	Hue.msg_public_roomlist = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "public_roomlist",
			window_width: "26em"
		})
	)

	Hue.msg_visited_roomlist = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "visited_roomlist",
			window_width: "26em"
		})
	)

	Hue.msg_played = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "played",
			window_width: "26em"
		})
	)

	Hue.msg_modal_image = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "modal_image",
			preset: "window",
			overlay_class: "!overlay_same_color",
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.modal_image_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
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
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.modal_image_number_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.modal_image_number_open = false
			}
		})
	)

	Hue.msg_lockscreen = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "lockscreen",
			preset: "window",
			overlay_class: "!overlay_same_color"
		})
	)

	Hue.msg_profile = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "profile",
			window_width: "22em",
			after_close: function(instance)
			{
				common.after_close(instance)
				$("#show_profile_uname").text("Loading")
				$("#show_profile_image").attr("src", Hue.config.profile_image_loading_url)
			}
		})
	)

	Hue.msg_info = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "info",
			window_height: "auto",
			before_show: function(instance)
			{
				common.before_show(instance)
				Hue.info_vars_to_false()
			},
			after_close: function(instance)
			{
				common.after_close(instance)
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
			before_show: function(instance)
			{
				common.before_show(instance)
				Hue.info2_vars_to_false()
			},
			after_close: function(instance)
			{
				common.after_close(instance)
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
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.image_picker_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				$("#image_source_picker_input").val("")
				$("#image_source_picker_input_comment").val("")
				Hue.image_picker_open = false
			}
		})
	)

	Hue.msg_tv_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "tv_picker",
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.tv_picker_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				$("#tv_source_picker_input").val("")
				$("#tv_source_picker_input_comment").val("")
				Hue.tv_picker_open = false
			}
		})
	)

	Hue.msg_radio_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "radio_picker",
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.radio_picker_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				$("#radio_source_picker_input").val("")
				$("#radio_source_picker_input_comment").val("")
				Hue.radio_picker_open = false
			}
		})
	)

	Hue.msg_media_menu = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "media_menu",
			window_width: "22em",
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.media_menu_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.media_menu_open = false
			}
		})
	)

	Hue.msg_message = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "message",
			window_width: "26em",
			close_on_overlay_click: false,
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.writing_message = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				$("#write_message_area").val("")
				$("#write_message_feedback").text("")
				$("#write_message_feedback").css("display", "none")
				Hue.writing_message = false
				Hue.clear_draw_message_state()
			}
		})
	)

	Hue.msg_input_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "input_history",
			window_width: "24em"
		})
	)

	Hue.msg_chat_search = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "chat_search",
			window_width: "30em",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.reset_chat_search_filter()
			}
		})
	)

	Hue.msg_highlights = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "highlights",
			window_width: "30em",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.reset_highlights_filter()
			}
		})
	)

	Hue.msg_image_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "image_history",
			window_width: "24em",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.reset_media_history_filter("image")
			}
		})
	)

	Hue.msg_tv_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "tv_history",
			window_width: "24em",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.reset_media_history_filter("tv")
			}
		})
	)

	Hue.msg_radio_history = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "radio_history",
			window_width: "24em",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.reset_media_history_filter("radio")
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
			window_class: "!no_effects"
		})
	)

	Hue.msg_global_settings = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "global_settings",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.close_togglers("global_settings")
			}
		})
	)

	Hue.msg_room_settings = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "room_settings",
			after_close: function(instance)
			{
				common.after_close(instance)
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
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.draw_image_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.draw_image_open = false
			}
		})
	)

	Hue.msg_credits = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "credits",
			after_close: function(instance)
			{
				common.after_close(instance)
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
			id: "help"
		})
	)

	Hue.msg_admin_activity = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "admin_activity"
		})
	)

	Hue.msg_access_log = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "access_log"
		})
	)

	Hue.msg_expand_image = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "expand_image",
			preset: "window",
			overlay_class: "!overlay_same_color",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.clear_modal_image_info()
			}
		})
	)

	Hue.msg_upload_comment = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "upload_comment",
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.upload_comment_open = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.clear_modal_image_info()
				$("#upload_comment_input").val("")
				Hue.upload_comment_file = false
				Hue.upload_comment_type = false
				Hue.upload_comment_open = false
			}
		})
	)

	Hue.msg_reply = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "reply",
			window_width: "22em",
			after_show: function(instance)
			{
				common.after_show(instance)
				Hue.writing_reply = true
			},
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.clear_modal_image_info()
				Hue.writing_reply = false
			}
		})
	)

	Hue.msg_handle_url = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "handle_url",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.clear_modal_image_info()
			}
		})
	)

	Hue.msg_open_url = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "open_url",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.clear_modal_image_info()
			}
		})
	)

	Hue.msg_details = Msg.factory
	(
		Object.assign({}, common, titlebar,
		{
			id: "details",
			after_close: function(instance)
			{
				common.after_close(instance)
				Hue.clear_modal_image_info()
			}
		})
	)

	Hue.msg_main_menu.set(Hue.template_main_menu(
	{
		permissions_containers: Hue.make_main_menu_permissions_container()
	}))

	Hue.msg_user_menu.set(Hue.template_user_menu())
	Hue.msg_userlist.set(Hue.template_userlist())
	Hue.msg_public_roomlist.set(Hue.template_roomlist({type:"public_roomlist"}))
	Hue.msg_visited_roomlist.set(Hue.template_roomlist({type:"visited_roomlist"}))
	Hue.msg_played.set(Hue.template_played())
	Hue.msg_profile.set(Hue.template_profile({profile_image:Hue.config.profile_image_loading_url}))
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
	
	Hue.msg_global_settings.set(Hue.template_global_settings(
	{
		settings: Hue.template_settings(
		{
			type: "global_settings", 
			user_functions: Hue.make_settings_user_functions("global_settings")
		})
	}))

	Hue.msg_room_settings.set(Hue.template_room_settings(
	{
		settings: Hue.template_settings(
		{
			type: "room_settings",
			user_functions: Hue.make_settings_user_functions("room_settings")
		})
	}))

	Hue.msg_draw_image.set(Hue.template_draw_image())
	Hue.msg_credits.set(Hue.template_credits({background_url:Hue.config.credits_background_url}))
	Hue.msg_help.set(Hue.template_help())
	Hue.msg_admin_activity.set(Hue.template_admin_activity())
	Hue.msg_access_log.set(Hue.template_access_log())
	Hue.msg_expand_image.set(Hue.template_expand_image())
	Hue.msg_upload_comment.set(Hue.template_upload_comment())
	Hue.msg_reply.set(Hue.template_reply())
	Hue.msg_handle_url.set(Hue.template_handle_url())
	Hue.msg_open_url.set(Hue.template_open_url())
	Hue.msg_details.set(Hue.template_details())

	Hue.msg_info.create()
	Hue.msg_info2.create()

	Hue.msg_input_history.set_title("Input History")
	Hue.msg_highlights.set_title("<span id='highlights_window_title' class='pointer'>Highlights</span>")
	Hue.msg_chat_search.set_title("<span id='chat_search_window_title' class='pointer'>Chat Search</span>")
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
	Hue.msg_credits.set_title(Hue.config.credits_title)
	Hue.msg_admin_activity.set_title("Admin Activity")
	Hue.msg_access_log.set_title("Access Log")
	Hue.msg_upload_comment.set_title("Add a Comment")
	Hue.msg_reply.set_title("Write a Reply")
	Hue.msg_details.set_title("User Details")

	$("#global_settings_window_title").click(function()
	{
		Hue.toggle_settings_windows()
	})

	$("#room_settings_window_title").click(function()
	{
		Hue.toggle_settings_windows()
	})

	$("#public_rooms_window_title").click(function()
	{
		Hue.toggle_rooms_windows()
	})

	$("#visited_rooms_window_title").click(function()
	{
		Hue.toggle_rooms_windows()
	})

	$("#image_history_window_title").click(function()
	{
		Hue.toggle_media_history_windows()
	})

	$("#tv_history_window_title").click(function()
	{
		Hue.toggle_media_history_windows()
	})

	$("#radio_history_window_title").click(function()
	{
		Hue.toggle_media_history_windows()
	})

	$("#main_menu_window_title").click(function()
	{
		Hue.toggle_menu_windows()
	})

	$("#user_menu_window_title").click(function()
	{
		Hue.toggle_menu_windows()
	})

	$("#chat_search_window_title").click(function()
	{
		Hue.toggle_search_windows()
	})

	$("#highlights_window_title").click(function()
	{
		Hue.toggle_search_windows()
	})
}

// Sets all info window variables to false
Hue.info_vars_to_false = function()
{

}

// Sets all info window 2 variables to false
Hue.info2_vars_to_false = function()
{
	Hue.create_room_open = false
	Hue.import_settings_open = false
	Hue.goto_room_open = false
	Hue.open_room_open = false
	Hue.background_image_input_open = false
	Hue.admin_list_open = false
	Hue.ban_list_open = false
	Hue.change_user_username_open = false
	Hue.change_user_password_open = false
	Hue.change_user_email_open = false
}

// This is called after a modal is created
Hue.after_modal_create = function(instance)
{

}

// This is called after a modal is shown
Hue.after_modal_show = function(instance)
{
	Hue.active_modal = instance
	Hue.modal_open = true
	Hue.blur_input()
	Hue.focus_modal_filter(instance)
}

// Focuses the filter widget of a modal
Hue.focus_modal_filter = function(instance)
{
	let filter = $(`#Msg-content-${instance.options.id} .filter_input`).eq(0)

	if(filter.length)
	{
		filter.focus()
	}
}

// Empties the filter of a modal and updates it
Hue.reset_modal_filter = function(instance)
{
	let id = instance.options.id
	let filter = $(`#Msg-content-${id} .filter_input`).eq(0)

	if(id === "info" || id === "info2" || filter.data("mode") === "manual")
	{
		return false
	}

	if(filter.length)
	{
		if(filter.val())
		{
			filter.val("")
			Hue.do_modal_filter(id)
		}
	}
}

// This is called after a modal is set or shown
Hue.after_modal_set_or_show = function(instance)
{
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

// This is called after a modal is closed
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

// Gets all Msg modal instances
Hue.get_modal_instances = function()
{
	return Hue.msg_main_menu.higher_instances()
}

// Gets all Msg popup instances
Hue.get_popup_instances = function()
{
	return Hue.msg_main_menu.lower_instances()
}

// Gets all Msg instances
Hue.get_all_msg_instances = function()
{
	return Hue.msg_main_menu.instances()
}

// Checks if any Msg instance is open
Hue.any_msg_open = function()
{
	return Hue.msg_main_menu.any_open()
}

// Checks if any Msg modal instance is open
Hue.any_modal_open = function()
{
	return Hue.msg_main_menu.any_higher_open()
}

// Checks if any Msg popup instance is open
Hue.any_popup_open = function()
{
	return Hue.msg_main_menu.any_lower_open()
}

// Closes all Msg instances
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

// Closes all Msg modal instances
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

// Closes all Msg popup instances
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

// Empties the global settings localStorage object
Hue.empty_global_settings = function()
{
	Hue.global_settings = {}
	Hue.save_global_settings(true)
}

// Gets the global settings localStorage object
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
			Hue.global_settings[setting] = Hue.config[`global_settings_default_${setting}`]
			changed = true
		}
	}

	if(changed)
	{
		Hue.save_global_settings()
	}
}

// Saves the global settings localStorage object
Hue.save_global_settings = function(force=false)
{
	Hue.save_local_storage(Hue.ls_global_settings, Hue.global_settings, force)
}

// Starts the settings windows widgets with current state
Hue.start_settings_widgets = function(type)
{
	for(let setting in Hue.user_settings)
	{
		Hue.modify_setting_widget(type, setting)
	}
	
	Hue.arrange_media_setting_display_positions(type)
}

// Updates a setting widget based on the setting state
Hue.modify_setting_widget = function(type, setting_name)
{
	let widget_type = Hue.user_settings[setting_name].widget_type
	let item = $(`#${type}_${setting_name}`)

	if(widget_type === "checkbox")
	{
		item.prop("checked", Hue[type][setting_name])
	}

	else if(widget_type === "textarea" || widget_type === "text" || widget_type === "number")
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

// Starts listeners for settings windows widgets's change
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

		else if(widget_type === "textarea" || widget_type === "text" || widget_type === "number")
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

// Executes all settings action functions
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

// Setting action for background image change
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

// Setting action for beep on messages change
Hue.setting_beep_on_messages_action = function(type, save=true)
{
	Hue[type].beep_on_messages = $(`#${type}_beep_on_messages`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for beep on highlights change
Hue.setting_beep_on_highlights_action = function(type, save=true)
{
	Hue[type].beep_on_highlights = $(`#${type}_beep_on_highlights`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for beep on media change change
Hue.setting_beep_on_media_change_action = function(type, save=true)
{
	Hue[type].beep_on_media_change = $(`#${type}_beep_on_media_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for beep on user joins change
Hue.setting_beep_on_user_joins_action = function(type, save=true)
{
	Hue[type].beep_on_user_joins = $(`#${type}_beep_on_user_joins`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for modal effects change
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

// Setting action for highlight current username change
Hue.setting_highlight_current_username_action = function(type, save=true)
{
	Hue[type].highlight_current_username = $(`#${type}_highlight_current_username`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for case insensitive username highlights change
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

// Setting action for case insensitive words highlights change
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

// Setting action for case insensitive ignored words change
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

// Setting action for other words to highlight change
Hue.setting_other_words_to_highlight_action = function(type, save=true)
{
	let words = Hue.utilz.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_other_words_to_highlight`).val()))

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

// Setting action for double tap change
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

// Setting action for double tap 2 change
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

// Setting action for double tap 3 change
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

// Setting action for afk delay change
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

// Setting action for at startup change
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

// Setting action for ignored usernames change
Hue.setting_ignored_usernames_action = function(type, save=true)
{
	let unames = Hue.utilz.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_ignored_usernames`).val()))

	$(`#${type}_ignored_usernames`).val(unames)

	Hue[type].ignored_usernames = unames

	if(Hue.active_settings("ignored_usernames") === type)
	{
		Hue.get_ignored_usernames_list()
		Hue.check_activity_bar()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for ignored words change
Hue.setting_ignored_words_action = function(type, save=true)
{
	let unames = Hue.utilz.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_ignored_words`).val()))

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

// Setting action for ignored words exclude same user change
Hue.setting_ignored_words_exclude_same_user_action = function(type, save=true)
{
	Hue[type].ignored_words_exclude_same_user = $(`#${type}_ignored_words_exclude_same_user`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for show joins change
Hue.setting_show_joins_action = function(type, save=true)
{
	Hue[type].show_joins = $(`#${type}_show_joins`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for show parts change
Hue.setting_show_parts_action = function(type, save=true)
{
	Hue[type].show_parts = $(`#${type}_show_parts`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for animate scroll change
Hue.setting_animate_scroll_action = function(type, save=true)
{
	Hue[type].animate_scroll = $(`#${type}_animate_scroll`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable messages beep change
Hue.setting_afk_disable_messages_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_messages_beep = $(`#${type}_afk_disable_messages_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action afk disable highlights beep change
Hue.setting_afk_disable_highlights_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_highlights_beep = $(`#${type}_afk_disable_highlights_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable media change beep change
Hue.setting_afk_disable_media_change_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_media_change_beep = $(`#${type}_afk_disable_media_change_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable joins beep change
Hue.setting_afk_disable_joins_beep_action = function(type, save=true)
{
	Hue[type].afk_disable_joins_beep = $(`#${type}_afk_disable_joins_beep`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable image change change
Hue.setting_afk_disable_image_change_action = function(type, save=true)
{
	Hue[type].afk_disable_image_change = $(`#${type}_afk_disable_image_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable tv change change
Hue.setting_afk_disable_tv_change_action = function(type, save=true)
{
	Hue[type].afk_disable_tv_change = $(`#${type}_afk_disable_tv_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable radio change change
Hue.setting_afk_disable_radio_change_action = function(type, save=true)
{
	Hue[type].afk_disable_radio_change = $(`#${type}_afk_disable_radio_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for open popup messages change
Hue.setting_open_popup_messages_action = function(type, save=true)
{
	Hue[type].open_popup_messages = $(`#${type}_open_popup_messages`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Special function used for all User Function name actions
Hue.setting_function_name_do_action = function(number, type, save=true)
{
	let val = Hue.utilz.clean_string2($(`#${type}_user_function_${number}_name`).val())

	if(!val)
	{
		val = Hue.config[`global_settings_default_user_function_${number}_name`]
	}

	$(`#${type}_user_function_${number}_name`).val(val)

	Hue[type][`user_function_${number}_name`] = val

	if(Hue.active_settings(`user_function_${number}_name`) === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Special function used for all User Function actions
Hue.setting_function_do_action = function(number, type, save=true)
{
	let cmds = Hue.utilz.clean_string7($(`#${type}_user_function_${number}`).val())

	$(`#${type}_user_function_${number}`).val(cmds)

	Hue[type][`user_function_${number}`] = cmds

	if(Hue.active_settings(`user_function_${number}`) === type)
	{
		Hue.setup_user_function_titles()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Special function to create User Function actions
Hue.create_setting_user_function_actions = function()
{
	for(let i=1; i<Hue.user_functions.length+1; i++)
	{
		Hue[`setting_user_function_${i}_action`] = function(type, save=true)
		{
			Hue.setting_function_do_action(i, type, save)
		}
	
		Hue[`setting_user_function_${i}_name_action`] = function(type, save=true)
		{
			Hue.setting_function_name_do_action(i, type, save)
		}
	}
}

// Setting action for on lockscreen change
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

// Setting action for on unlockscreen change
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

// Setting action for on lockscreen change
Hue.setting_afk_on_lockscreen_action = function(type, save=true)
{
	Hue[type].afk_on_lockscreen = $(`#${type}_afk_on_lockscreen`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for aliases change
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

// Setting action for other words to autocomplete change
Hue.setting_other_words_to_autocomplete_action = function(type, save=true)
{
	let words = Hue.utilz.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_other_words_to_autocomplete`).val()))

	$(`#${type}_other_words_to_autocomplete`).val(words)

	Hue[type].other_words_to_autocomplete = words

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for chat font size change
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
		Hue.goto_bottom(true, false)
	}
}

// Setting action for warn before closing change
Hue.setting_warn_before_closing_action = function(type, save=true)
{
	Hue[type].warn_before_closing = $(`#${type}_warn_before_closing`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for activity bar change
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

// Setting action for show image previews change
Hue.setting_show_image_previews_action = function(type, save=true)
{
	Hue[type].show_image_previews = $(`#${type}_show_image_previews`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for show link previews change
Hue.setting_show_link_previews_action = function(type, save=true)
{
	Hue[type].show_link_previews = $(`#${type}_show_link_previews`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for stop radio on tv play change
Hue.setting_stop_radio_on_tv_play_action = function(type, save=true)
{
	Hue[type].stop_radio_on_tv_play = $(`#${type}_stop_radio_on_tv_play`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for stop tv on radio play change
Hue.setting_stop_tv_on_radio_play_action = function(type, save=true)
{
	Hue[type].stop_tv_on_radio_play = $(`#${type}_stop_tv_on_radio_play`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for bypass images lock on own change change
Hue.setting_bypass_images_lock_on_own_change_action = function(type, save=true)
{
	Hue[type].bypass_images_lock_on_own_change = $(`#${type}_bypass_images_lock_on_own_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for bypass tv lock on own change change
Hue.setting_bypass_tv_lock_on_own_change_action = function(type, save=true)
{
	Hue[type].bypass_tv_lock_on_own_change = $(`#${type}_bypass_tv_lock_on_own_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for bypass radio lock on own change change
Hue.setting_bypass_radio_lock_on_own_change_action = function(type, save=true)
{
	Hue[type].bypass_radio_lock_on_own_change = $(`#${type}_bypass_radio_lock_on_own_change`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for synth enabled change
Hue.setting_synth_enabled_action = function(type, save=true)
{
	Hue[type].synth_enabled = $(`#${type}_synth_enabled`).prop("checked")

	if(Hue.active_settings("synth_enabled") === type)
	{
		if(!Hue[type].synth_enabled)
		{
			Hue.hide_synth(true)
		}
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable synth change
Hue.setting_afk_disable_synth_action = function(type, save=true)
{
	Hue[type].afk_disable_synth = $(`#${type}_afk_disable_synth`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for afk disable notifications change
Hue.setting_afk_disable_notifications_action = function(type, save=true)
{
	Hue[type].afk_disable_notifications = $(`#${type}_afk_disable_notifications`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for accept commands from change
Hue.setting_accept_commands_from_action = function(type, save=true)
{
	let unames = Hue.utilz.make_unique_lines(Hue.utilz.clean_string7($(`#${type}_accept_commands_from`).val()))

	$(`#${type}_accept_commands_from`).val(unames)

	Hue[type].accept_commands_from = unames

	if(Hue.active_settings("ignored_usernames") === type)
	{
		Hue.get_accept_commands_from_list()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for autoscroll amount change
Hue.setting_autoscroll_amount_action = function(type, save=true)
{
	let val = parseInt(Hue.utilz.clean_string2($(`#${type}_autoscroll_amount`).val()))

	if(!val)
	{
		val = Hue.config.global_settings_default_autoscroll_amount
	}

	$(`#${type}_autoscroll_amount`).val(val)

	Hue[type].autoscroll_amount = val

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for autoscroll delay change
Hue.setting_autoscroll_delay_action = function(type, save=true)
{
	let val = parseInt(Hue.utilz.clean_string2($(`#${type}_autoscroll_delay`).val()))

	if(!val)
	{
		val = Hue.config.global_settings_default_autoscroll_delay
	}

	$(`#${type}_autoscroll_delay`).val(val)

	Hue[type].autoscroll_delay = val

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Special function used for all Speech actions
Hue.setting_speech_do_action = function(number, type, save=true)
{
	let speech = Hue.utilz.clean_string2($(`#${type}_speech_${number}`).val())

	if(!speech)
	{
		speech = Hue.config[`global_settings_default_speech_${number}`]
	}

	$(`#${type}_speech_${number}`).val(speech)

	Hue[type][`speech_${number}`] = speech

	if(Hue.active_settings(`speech_${number}`) === type)
	{
		Hue.set_synth_key_title(number)
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Special function to create Speech actions
Hue.create_setting_speech_actions = function()
{
	for(let i=1; i<Hue.speeches.length+1; i++)
	{
		Hue[`setting_speech_${i}_action`] = function(type, save=true)
		{
			Hue.setting_speech_do_action(i, type, save)
		}
	}
}

// Setting action for show input placeholder change
Hue.setting_show_input_placeholder_action = function(type, save=true)
{
	Hue[type].show_input_placeholder = $(`#${type}_show_input_placeholder`).prop("checked")

	if(Hue.active_settings("show_input_placeholder") === type)
	{
		Hue.setup_input_placeholder()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for show clock in input placeholder change
Hue.setting_show_clock_in_input_placeholder_action = function(type, save=true)
{
	Hue[type].show_clock_in_input_placeholder = $(`#${type}_show_clock_in_input_placeholder`).prop("checked")

	if(Hue.active_settings("show_clock_in_input_placeholder") === type)
	{
		Hue.setup_input_placeholder()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for show clock in lockscreen change
Hue.setting_show_clock_in_lockscreen_action = function(type, save=true)
{
	Hue[type].show_clock_in_lockscreen = $(`#${type}_show_clock_in_lockscreen`).prop("checked")

	if(Hue.active_settings("show_clock_in_lockscreen") === type)
	{
		Hue.setup_lockscreen_clock()
	}

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Setting action for autoreveal spoilers change
Hue.setting_autoreveal_spoilers_action = function(type, save=true)
{
	Hue[type].autoreveal_spoilers = $(`#${type}_autoreveal_spoilers`).prop("checked")

	if(save)
	{
		Hue[`save_${type}`]()
	}
}

// Empties the room settings localStorage object
Hue.empty_room_settings = function()
{
	Hue.room_settings = {}
	Hue.save_room_settings(true)
}

// Gets the room settings localStorage object
// Defaults are filled with global settings
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

// Saves the room settings localStorage object
Hue.save_room_settings = function(force=false)
{
	let room_settings_all = Hue.get_local_storage(Hue.ls_room_settings)

	if(room_settings_all === null)
	{
		room_settings_all = {}
	}

	room_settings_all[Hue.room_id] = Hue.room_settings

	Hue.save_local_storage(Hue.ls_room_settings, room_settings_all, force)
}

// Gets the room state localStorage object
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
		"tv_volume",
		"screen_locked",
		"synth_muted",
		"lockscreen_lights_off",
		"chat_searches"
	]

	for(let setting of settings)
	{
		if(Hue.room_state[setting] === undefined)
		{
			Hue.room_state[setting] = Hue.config[`room_state_default_${setting}`]
			changed = true
		}
	}

	if(changed)
	{
		Hue.save_room_state()
	}
}

// Saves the room state localStorage object
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

// Starts custom filters events
Hue.start_filters = function()
{
	$("#chat_search_filter").on("input", function()
	{
		Hue.chat_search_timer()
	})

	$("#highlights_filter").on("input", function()
	{
		Hue.highlights_filter_timer()
	})

	$("#image_history_filter").on("input", function()
	{
		Hue.media_history_filter_timer("image")
	})

	$("#tv_history_filter").on("input", function()
	{
		Hue.media_history_filter_timer("tv")
	})

	$("#radio_history_filter").on("input", function()
	{
		Hue.media_history_filter_timer("radio")
	})

	$("#global_settings_filter").on("input", function()
	{
		Hue.settings_filter_timer("global_settings")
	})

	$("#room_settings_filter").on("input", function()
	{
		Hue.settings_filter_timer("room_settings")
	})

	$("#input_history_filter").on("input", function()
	{
		Hue.input_history_filter_timer()
	})
}

// Debounce timer for normal window filters
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

// Filter action for normal filter windows
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

	let value = filter.val().trim()
	filter.val(value)
	
	let lc_value = Hue.utilz.clean_string2(value).toLowerCase()
	let items = $(`#Msg-content-${id} .modal_item`)
	let display = "block"

	if(lc_value)
	{
		let words = lc_value.split(" ")

		items.each(function()
		{
			let item_value = $(this).text().toLowerCase()
			
			if(words.some(word => item_value.includes(word)))
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

	Hue.scroll_modal_to_top(id)
}

// Debounce timer for input history filter
Hue.input_history_filter_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.show_input_history($("#input_history_filter").val())
		}, Hue.filter_delay)
	}
})()

// Shows the input history window
Hue.show_input_history = function(filter=false)
{
	if(filter)
	{
		filter = filter.trim()
	}

	let sfilter = filter ? filter : ''

	$("#input_history_container").html("")
	$("#input_history_filter").val(sfilter)
	$("#input_history_container").html("")

	let words

	if(filter)
	{
		let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
		words = lc_value.split(" ").filter(x => x.trim() !== "")
	}
	
	for(let item of Hue.input_history)
	{
		if(filter)
		{
			let text = item.message.toLowerCase()
	
			if(words.some(word => text.includes(word)))
			{
				let c = $(`<div class='modal_item input_history_item dynamic_title'></div>`)
				let nd = Hue.utilz.nice_date(item.date)
	
				c.attr("title", nd)
				c.data("otitle", nd)
				c.data("date", item.date)
				c.text(item.message)
	
				$("#input_history_container").prepend(c)
			}
		}

		else
		{
			let c = $(`<div class='modal_item input_history_item dynamic_title'></div>`)
			let nd = Hue.utilz.nice_date(item.date)
	
			c.attr("title", nd)
			c.data("otitle", nd)
			c.data("date", item.date)
			c.text(item.message)

			$("#input_history_container").prepend(c)
		}
	}

	if(Hue.input_history.length > 0)
	{
		$("#input_history_clear_icon").removeClass("inactive")
	}
	
	else
	{
		$("#input_history_clear_icon").addClass("inactive")
	}

	Hue.msg_input_history.show(function()
	{
		Hue.scroll_modal_to_top("input_history")
	})
}

// Loads YouTube script or creates players
Hue.load_youtube = async function(what="")
{
	if(Hue.youtube_loaded)
	{
		if(Hue.youtube_player_requested && Hue.youtube_player === undefined)
		{
			Hue.create_youtube_player()
		}

		if(Hue.youtube_video_player_requested && Hue.youtube_video_player === undefined)
		{
			Hue.create_youtube_video_player()
		}

		return false
	}

	if(Hue.youtube_loading)
	{
		return false
	}

	Hue.youtube_loading = true
	
	await Hue.load_script("https://www.youtube.com/iframe_api")

	Hue.youtube_loaded = true
}

// Create radio YouTube player
Hue.create_youtube_player = function()
{
	Hue.youtube_player_requested = false

	let el = $("<div id='youtube_player'></div>")
	$("#media_youtube_audio_container").html(el)

	Hue.yt_player = new YT.Player('youtube_player',
	{
		events:
		{
			onReady: Hue.on_youtube_player_ready
		},
		playerVars:
		{
			iv_load_policy: 3,
			rel: 0,
			width: 640,
			height: 360
		}
	})
}

// Create tv YouTube player
Hue.create_youtube_video_player = function()
{
	Hue.youtube_video_player_requested = false

	let el = $("<div id='media_youtube_video' class='video_frame'></div>")
	$("#media_youtube_video_container").html(el)
	
	Hue.yt_video_player = new YT.Player('media_youtube_video',
	{
		events:
		{
			onReady: Hue.on_youtube_video_player_ready
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

// This gets executed when the YouTube iframe API is ready
onYouTubeIframeAPIReady = function()
{
	if(Hue.youtube_player_requested)
	{
		Hue.create_youtube_player()
	}

	if(Hue.youtube_video_player_requested)
	{
		Hue.create_youtube_video_player()
	}
}

// This gets executed when the radio YouTube player is ready
Hue.on_youtube_player_ready = function()
{
	Hue.youtube_player = Hue.yt_player

	if(Hue.youtube_player_request)
	{
		Hue.change(Hue.youtube_player_request)
		Hue.youtube_player_request = false
	}
}

// This gets executed when the tv YouTube player is ready
Hue.on_youtube_video_player_ready = function()
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

	if(Hue.youtube_video_player_request)
	{
		Hue.change(Hue.youtube_video_player_request)
		Hue.youtube_video_player_request = false
	}
}

// Loads Twitch script and creates player
Hue.start_twitch = async function()
{
	if(Hue.twitch_loaded)
	{
		if(Hue.twitch_video_player_requested && Hue.twitch_video_player === undefined)
		{
			Hue.create_twitch_video_player()
		}

		return false
	}

	if(Hue.twitch_loading)
	{
		return false
	}

	Hue.twitch_loading = true

	await Hue.load_script("https://player.twitch.tv/js/embed/v1.js")

	Hue.twitch_loaded = true

	if(Hue.twitch_video_player_requested)
	{
		Hue.create_twitch_video_player()
	}
}

// Creates the tv Twitch player
Hue.create_twitch_video_player = function()
{
	Hue.twitch_video_player_requested = false

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

			if(Hue.twitch_video_player_request)
			{
				Hue.change(Hue.twitch_video_player_request)
				Hue.twitch_video_player_request = false
			}
		})
	}

	catch(err)
	{
		console.error("Twitch failed to load")
	}
}

// Setups the user menu
Hue.setup_user_menu = function()
{
	$("#user_menu_profile_image").on("error", function()
	{
		if($(this).attr("src") !== Hue.config.default_profile_image_url)
		{
			$(this).attr("src", Hue.config.default_profile_image_url)
		}
	})

	$("#user_menu_profile_image").attr("src", Hue.profile_image)
	Hue.setup_togglers("user_menu")
}

// Shows the user menu
Hue.show_user_menu = function()
{
	clearTimeout(Hue.show_reactions_timeout)
	Hue.hide_reactions_box()
	Hue.msg_user_menu.show()
}

// Shows a window with room details
Hue.show_status = function()
{
	Hue.msg_info2.show(["Room Status", Hue.template_status({info:Hue.get_status_html()})])
}

// Generates the HTML for the room details window
Hue.get_status_html = function()
{
	let h = $("<div></div>")
	
	let info = ""

	info += "<div class='info_item'><div class='info_title'>Room Name</div><div class='info_item_content' id='status_room_name'></div></div>"

	if(Hue.topic_setter)
	{
		info += `<div class='info_item' id='status_topic_item'><div class='info_title'>Topic</div><div class='info_item_content' id='status_topic'></div></div>`
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

	let topic_item = h.find("#status_topic_item").eq(0)
	topic_item.attr("title", `Setter: ${Hue.topic_setter} | ${Hue.topic_date}`)

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

// Used for debugging purposes
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

// Logs out the user
Hue.logout = function()
{
	Hue.goto_url('/logout')
}

// Changes the user's username
Hue.change_username = function(uname, show_feedback=true)
{
	if(Hue.utilz.clean_string4(uname) !== uname)
	{
		if(show_feedback)
		{
			Hue.feedback("Username contains invalid characters")
		}

		return false
	}

	if(uname.length === 0)
	{
		if(show_feedback)
		{
			Hue.feedback("Username can't be empty")
		}

		return false
	}

	if(uname.length > Hue.config.max_username_length)
	{
		if(show_feedback)
		{
			Hue.feedback("Username is too long")
		}

		return false
	}

	if(uname === Hue.username)
	{
		if(show_feedback)
		{
			Hue.feedback("That's already your username")
		}

		return false
	}

	Hue.socket_emit("change_username", {username:uname})

	return true
}

// Changes the user's password
Hue.change_password = function(passwd, show_feedback=true)
{
	if(passwd.length < Hue.config.min_password_length)
	{
		if(show_feedback)
		{
			Hue.feedback(`Password is too short. It must be at least ${Hue.config.min_password_length} characters long`)
		}

		return false
	}

	if(passwd.length > Hue.config.max_password_length)
	{
		if(show_feedback)
		{
			Hue.feedback("Password is too long")
		}

		return false
	}

	Hue.socket_emit("change_password", {password:passwd})

	return true
}

// Feedback on password change
Hue.password_changed = function(data)
{
	Hue.feedback(`Password succesfully changed to ${data.password}. To force other clients connected to your account to disconnect you can use /disconnectothers`)
}

// Changes the user's email
Hue.change_email = function(email, show_feedback=true)
{
	if(Hue.utilz.clean_string5(email) !== email)
	{
		if(show_feedback)
		{
			Hue.feedback("Invalid email address")
		}

		return false
	}

	if(email.length === 0)
	{
		if(show_feedback)
		{
			Hue.feedback("Username can't be empty")
		}

		return false
	}

	if(!email.includes('@'))
	{
		if(show_feedback)
		{
			Hue.feedback("Invalid email address")
		}

		return false
	}

	if(email.length > Hue.config.max_email_length)
	{
		if(show_feedback)
		{
			Hue.feedback("Email is too long")
		}

		return false
	}

	Hue.socket_emit("change_email", {email:email})

	return true
}

// Feedback on email change
Hue.email_changed = function(data)
{
	Hue.set_email(data.email)
	Hue.feedback(`Email succesfully changed to ${data.email}`)
}

// Setups the user details window
Hue.setup_details = function()
{
	$("#details_username").text(Hue.username)
	$("#details_email").text(Hue.user_email)

	let s = `<div>${Hue.utilz.nice_date(Hue.user_reg_date)}</div>
	</div>(${Hue.get_timeago(Hue.user_reg_date)})</div>`

	$("#details_reg_date").html(s)

	s = `<div>${Hue.utilz.nice_date(Hue.date_joined)}</div>
	</div>(${Hue.get_timeago(Hue.date_joined)})</div>`

	$("#details_joined_room").html(s)

	$("#details_change_username").click(function()
	{
		Hue.show_change_username()
	})
	
	$("#details_change_password").click(function()
	{
		Hue.show_change_password()
	})
	
	$("#details_change_email").click(function()
	{
		Hue.show_change_email()
	})
}

// Shows the user's details window
Hue.show_details = function(data)
{
	Hue.msg_details.show()
}

// Shows the change username form
Hue.show_change_username = function()
{
	let s = `
	<input type='text' placeholder='New Username' id='change_username_input' class='nice_input_2'>
	<div class='flex_row_center'>
		<div class='action pointer bigger unselectable details_change_submit' id='change_username_submit'>Change</div>
	</div>`

	Hue.msg_info2.show(["Change Username", s], function()
	{
		$("#change_username_input").focus()

		$("#change_username_submit").click(function()
		{
			Hue.submit_change_username()
		})

		Hue.change_user_username_open = true
	})
}

// Submits the change username form
Hue.submit_change_username = function()
{
	let uname = $("#change_username_input").val().trim()
			
	if(Hue.change_username(uname, false))
	{
		Hue.close_all_modals()
	}

	else
	{
		alert("Invalid username format")
	}
}

// Shows the change password form
Hue.show_change_password = function()
{
	let s = `
	<input type='password' placeholder='New Password' id='change_password_input' class='nice_input_2'>
	<div class='flex_row_center'>
		<div class='action pointer bigger unselectable details_change_submit' id='change_password_submit'>Change</div>
	</div>`

	Hue.msg_info2.show(["Change Password", s], function()
	{
		$("#change_password_input").focus()

		$("#change_password_submit").click(function()
		{
			Hue.submit_change_password()
		})

		Hue.change_user_password_open = true
	})
}

// Submits the change password form
Hue.submit_change_password = function()
{
	let uname = $("#change_password_input").val().trim()
		
	if(Hue.change_password(uname, false))
	{
		Hue.close_all_modals()
	}

	else
	{
		alert("Invalid password format")
	}
}

// Shows the change email form
Hue.show_change_email = function()
{
	let s = `
	<input type='text' placeholder='New Email' id='change_email_input' class='nice_input_2'>
	<div class='flex_row_center'>
		<div class='action pointer bigger unselectable details_change_submit' id='change_email_submit'>Change</div>
	</div>`

	Hue.msg_info2.show(["Change Email", s], function()
	{
		$("#change_email_input").focus()

		$("#change_email_submit").click(function()
		{
			Hue.submit_change_email()
		})

		Hue.change_user_email_open = true
	})
}

// Submits the change email form
Hue.submit_change_email = function()
{
	let uname = $("#change_email_input").val().trim()
			
	if(Hue.change_email(uname, false))
	{
		Hue.close_all_modals()
	}

	else
	{
		alert("Invalid email format")
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

	if(num_images === 0)
	{
		Hue.setup_image("show", Hue.get_media_object_from_init_data("image"))
	}

	if(num_tv === 0)
	{
		Hue.setup_tv("show", Hue.get_media_object_from_init_data("tv"))
	}

	if(num_radio === 0)
	{
		Hue.setup_radio("show", Hue.get_media_object_from_init_data("radio"))
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
					data.date = date
					Hue.setup_image("show", data)
				}

				else if(type === "tv")
				{
					data.date = date
					Hue.setup_tv("show", data)
				}

				else if(type === "radio")
				{
					data.date = date
					Hue.setup_radio("show", data)
				}

				else if(type === "reaction")
				{
					Hue.show_reaction(data, date)
				}

				else if(type === "announcement")
				{
					Hue.show_announcement(data, date)
				}
			}
		}
	}

	Hue.log_messages_processed = true
}

// Enables or disables the log
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

// Clears the log
Hue.clear_log = function()
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("clear_log", {})
}

// Announces log changes
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

// Announces that the log was cleared
Hue.announce_log_cleared = function(data)
{
	Hue.clear_room()

	Hue.public_feedback(`${data.username} cleared the log`,
	{
		username: data.username,
		open_profile: true
	})
}

// Shows the log status
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

// Shows the modal image window
Hue.show_modal_image = function(data)
{
	if(!data.source)
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

	let img = $("#modal_image")

	img.css("display", "none")

	$("#modal_image_spinner").css("display", "block")
	$("#modal_image_error").css("display", "none")

	img.attr("src", data.source)

	$("#modal_image_header_info").html(data.info_html)

	if(data.comment)
	{
		$("#modal_image_subheader").html(Hue.replace_markdown(Hue.make_html_safe(data.comment)))
		$("#modal_image_subheader").css("display", "block")
		Hue.setup_whispers_click($("#modal_image_subheader"), data.setter)
	}
	
	else
	{
		$("#modal_image_subheader").css("display", "none")
	}

	Hue.loaded_modal_image = data

	if((Hue.room_images_mode === "enabled" || Hue.room_images_mode === "locked") && data !== Hue.loaded_image)
	{
		$("#modal_image_toolbar_load").css("display", "block")
	}
	
	else
	{
		$("#modal_image_toolbar_load").css("display", "none")
	}

	if(Hue.change_image_source(data.source, true))
	{
		$("#modal_image_toolbar_change").css("display", "flex")
	}
	
	else
	{
		$("#modal_image_toolbar_change").css("display", "none")
	}

	Hue.fix_horizontal_separators("modal_image_header_info_container")

	Hue.msg_modal_image.show(function()
	{
		Hue.set_modal_image_number()
	})
}

// Sets the image number in the modal image window
Hue.set_modal_image_number = function(id)
{
	if(!Hue.modal_image_open)
	{
		return false
	}

	let index = Hue.images_changed.indexOf(Hue.loaded_modal_image)
	let number = index + 1
	let footer_text = `${number} of ${Hue.images_changed.length}`
	$("#modal_image_footer_info").text(footer_text)
	
	if(number > 0)
	{
		$("#modal_image_number_input").val(number)
	}

	else
	{
		$("#modal_image_number_input").val(1)
	}
}

// Setups the image number widget in the modal image window
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

// Shows the modal image widget
Hue.show_modal_image_number = function()
{
	Hue.msg_modal_image_number.show(function()
	{
		$("#modal_image_number_input").focus()
		$("#modal_image_number_input").select()
	})
}

// Goes to a specified image number in the modal image window
Hue.modal_image_number_go = function()
{
	let val = parseInt($("#modal_image_number_input").val())
	
	let ic = Hue.images_changed[val - 1]

	if(ic)
	{
		Hue.show_modal_image(ic)
		Hue.msg_modal_image_number.close()
	}
}

// Adds image resolution information to the image's information
// This is disaplayed in the modal image window
Hue.show_modal_image_resolution = function()
{
	let img = $("#modal_image")[0]
	let w = img.naturalWidth
	let h = img.naturalHeight

	$("#modal_image_header_info").html($("#modal_image_header_info").html() + ` <span class='header_separator color_3'>|</span> Resolution: ${w}x${h}`)
}

// Clears image information in the modal image window
Hue.clear_modal_image_info = function()
{
	$("#modal_image_header_info").html("")
	$("#modal_image_footer_info").html("")
}

// Feedback that the user is not an operator
Hue.not_an_op = function()
{
	Hue.feedback("You are not a room operator")
}

// Used to change the image
// Shows the image picker window to input a URL, draw, or upload a file
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
		Hue.scroll_modal_to_bottom("image_picker")
	})
}

// Used to change the tv
// Shows the tv picker window to input a URL
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
		Hue.scroll_modal_to_bottom("tv_picker")
	})
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

// Starts custom 'nice titles' using Tippy
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

// Loads the HLS player for the <video> player
Hue.load_hls = async function()
{
	if(Hue.hls_loading)
	{
		return false
	}

	Hue.hls_loading = true

	return new Promise(async (resolve, reject) => 
	{
		await Hue.load_script("/static/js/hls.js")
		resolve()
	})
}

// Starts the HLS player for the <video> player
Hue.start_hls = async function()
{
	if(!Hue.hls_loading)
	{
		await Hue.load_hls()
	}

	Hue.hls = new Hls(
	{
		maxBufferSize: 5*1000*1000,
		maxBufferLength: 10
	})
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

// Adds and removes margins in an attempt to make the image and tv positions look better
// This takes into account the position of each element (top or bottom)
Hue.fix_media_margin = function()
{
	if(Hue.num_media_elements_visible() === 2)
	{
		let p = Hue.get_setting("tv_display_position")
		let m1, m2

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

// Changes the images to visible or not visible
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

// Changes the image visibility based on current state
Hue.change_images_visibility = function()
{
	if(Hue.room_images_mode !== "disabled" && Hue.room_state.images_enabled)
	{
		$("#media").css("display", "flex")
		$("#media_image").css("display", "flex")

		Hue.fix_media_margin()
		
		$("#footer_toggle_images_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_images_icon").addClass("fa-toggle-on")	

		if(Hue.first_media_change)
		{
			Hue.change({type:"image"})
		}

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

	Hue.goto_bottom(false, false)
}

// Toggles the tv visible or not visible
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

// Changes the tv visibility based on current state
Hue.change_tv_visibility = function(play=true)
{
	if(Hue.room_tv_mode !== "disabled" && Hue.room_state.tv_enabled)
	{
		clearTimeout(Hue.stop_tv_timeout)

		$("#media").css("display", "flex")
		$("#media_tv").css("display", "flex")

		Hue.fix_media_margin()

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-on")

		Hue.tv_visible = true
		
		if(Hue.first_media_change)
		{
			Hue.change({type:"tv", force:false, play:false})
		}
		
		if(play)
		{
			Hue.play_tv()
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
			Hue.stop_tv_timeout = setTimeout(function()
			{
				Hue.stop_tv()
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

	Hue.goto_bottom(false, false)
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
		$("#header_topic").css("display", "none")

		Hue.radio_visible = true

		let original_radio_source = false

		if(Hue.loaded_radio)
		{
			original_radio_source = Hue.loaded_radio.source
		}

		if(Hue.first_media_change)
		{
			Hue.change({type:"radio", force:false, play:false})
		}

		if(Hue.loaded_radio && Hue.loaded_radio.type === "radio")
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

		$("#header_radio").css("display", "none")
		$("#footer_toggle_radio_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-off")
		$("#header_topic").css("display", "flex")

		Hue.radio_visible = false
	}
}

// Opens the profile image picker to change the profile image
Hue.open_profile_image_picker = function()
{
	$("#profile_image_picker").click()
}

// This is executed after a profile image has been selected in the file dialog
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

					rounded_canvas.toBlob(function(file)
					{
						$("#user_menu_profile_image").attr("src", Hue.config.profile_image_loading_url)
						Hue.upload_file({file:file, action:"profile_image_upload", name:"profile.png"})
						Hue.msg_info.close()
					}, 'image/png', 0.95)
				}
			})
		}

		reader.readAsDataURL(input.files[0])
	}
}

// Creates a rounded canvas for the profile image picker
Hue.get_rounded_canvas = function(sourceCanvas)
{
	let canvas = document.createElement('canvas')
	let context = canvas.getContext('2d')
	let width = Hue.config.profile_image_diameter
	let height = Hue.config.profile_image_diameter
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

// Setups the profile image
Hue.setup_profile_image = function(pi)
{
	if(pi === "")
	{
		Hue.profile_image = Hue.config.default_profile_image_url
	}

	else
	{
		Hue.profile_image = pi
	}
}

// Setups user profile windows
Hue.setup_show_profile = function()
{
	$("#show_profile_whisper").click(function()
	{
		Hue.write_popup_message([$("#show_profile_uname").text()])
	})
}

// Shows a user's profile window
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
			pi = Hue.config.default_profile_image_url
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
		if($(this).attr("src") !== Hue.config.default_profile_image_url)
		{
			$(this).attr("src", Hue.config.default_profile_image_url)
		}
	})

	$("#show_profile_image").attr("src", pi)

	if(!Hue.can_chat || !Hue.usernames.includes(uname))
	{
		$("#show_profile_whisper").css("display", "none")
	}

	else
	{
		$("#show_profile_whisper").css("display", "block")
	}

	if($('.show_profile_button').filter(function() {return $(this).css('display') !== 'none'}).length)
	{
		$("#show_profile_buttons").css("display", "flex")
	}

	else
	{
		$("#show_profile_buttons").css("display", "none")
	}

	Hue.msg_profile.show()
}

// Announces a user's profile image change
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

// Updates the profile image of a user in the userlist
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

// Updates dimensions of the visible tv frame
Hue.fix_visible_video_frame = function()
{
	let id = Hue.get_visible_video_frame_id()

	if(id)
	{
		Hue.fix_frame(id)
	}
}

// Gets the id of the visible tv frame
Hue.get_visible_video_frame_id = function()
{
	let id = false

	$(".video_frame").each(function()
	{
		if($(this).parent().css("display") !== "none")
		{
			id = this.id
			return false
		}
	})

	return id
}

// Updates dimensions of the image
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

// Updates dimensions of the image and tv
Hue.fix_frames = function()
{
	Hue.fix_visible_video_frame()
	Hue.fix_image_frame()
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
	let parent_width = parent.width()
	let parent_height = test_parent_height ? test_parent_height : parent.height()
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

// Changes the room images mode
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

// Changes the room tv mode
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

// Changes the room radio mode
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

// Changes the room synth mode
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

// Announces room images mode changes
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

// Announces room tv mode changes
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

// Announces room radio mode changes
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

// Announces room synth mode changes
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

// Hides the media area (image and tv)
Hue.hide_media = function()
{
	Hue.stop_tv()

	$("#media").css("display", "none")
}

// Makes the media area visible or not visible
Hue.toggle_media = function()
{
	if(Hue.tv_visible || Hue.images_visible)
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

	if(Hue.images_visible)
	{
		Hue.toggle_images(false)
	}
}

// If both are not visible it makes them visible
Hue.show_media_items = function()
{
	if(!Hue.tv_visible && !Hue.images_visible)
	{
		Hue.toggle_tv(true)
		Hue.toggle_images(true)
	}
}

// Setups media modes from initial data
Hue.setup_active_media = function(data)
{
	Hue.room_images_mode = data.room_images_mode
	Hue.room_tv_mode = data.room_tv_mode
	Hue.room_radio_mode = data.room_radio_mode
	Hue.room_synth_mode = data.room_synth_mode

	Hue.media_visibility_and_locks()
}

// Changes media visibility and locks based on current state
Hue.media_visibility_and_locks = function()
{
	Hue.change_images_visibility()
	Hue.change_tv_visibility(false)
	Hue.change_radio_visibility()

	Hue.change_lock_images()
	Hue.change_lock_tv()
	Hue.change_lock_radio()
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

// Announces theme mode change
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

// Announces theme change
Hue.announce_theme_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the theme to ${data.color}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_theme(data.color)
}

// Picker window to select how to change the background image
Hue.open_background_image_select = function()
{
	Hue.msg_info2.show(["Change Background Image", Hue.template_background_image_select()])
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
	Hue.public_feedback(`${data.username} changed the background image`,
	{
		username: data.username,
		open_profile: true
	})

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
	Hue.public_feedback(`${data.username} changed the background mode to ${data.mode}`,
	{
		username: data.username,
		open_profile: true
	})

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
	Hue.public_feedback(`${data.username} changed the background tile dimensions to ${data.dimensions}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_background_tile_dimensions(data.dimensions)
	Hue.apply_background()
}

// Attempts to change the image source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
Hue.change_image_source = function(src, just_check=false)
{
	let feedback = true

	if(just_check)
	{
		feedback = false
	}

	if(!Hue.can_images)
	{
		if(feedback)
		{
			Hue.feedback("You don't have permission to change images")
		}

		return false
	}

	let r = Hue.get_media_change_inline_comment("image", src)

	src = r.source
	
	let comment = r.comment

	if(comment.length > Hue.config.safe_limit_4)
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

	if(src.length > Hue.config.max_image_source_length)
	{
		return false
	}

	if(src.startsWith("/"))
	{
		return false
	}

	if(src === Hue.current_image().source || src === Hue.current_image().query)
	{
		if(feedback)
		{
			Hue.feedback("Image is already set to that")
		}

		return false
	}

	else if(src === "default")
	{
		// OK
	}

	else if(src === "prev" || src === "previous")
	{
		if(Hue.images_changed.length > 1)
		{
			src = Hue.images_changed[Hue.images_changed.length - 2].source
		}

		else
		{
			if(feedback)
			{
				Hue.feedback("No image source before current one")
			}

			return false
		}
	}

	else if(Hue.utilz.is_url(src))
	{
		src = src.replace(/\.gifv/g, '.gif')

		if(Hue.check_domain_list("images", src))
		{
			if(feedback)
			{
				Hue.feedback("Image sources from that domain are not allowed")
			}

			return false
		}

		let extension = Hue.utilz.get_extension(src).toLowerCase()

		if(!extension || !Hue.utilz.image_extensions.includes(extension))
		{
			if(feedback)
			{
				Hue.feedback("That doesn't seem to be an image")
			}

			return false
		}
	}

	else
	{
		if(src.length > Hue.config.safe_limit_1)
		{
			if(feedback)
			{
				Hue.feedback("Query is too long")
			}

			return false
		}

		if(!Hue.config.imgur_enabled)
		{
			if(feedback)
			{
				Hue.feedback("Imgur support is not enabled")
			}
			
			return false
		}
	}

	if(just_check)
	{
		return true
	}

	Hue.emit_change_image_source(src, comment)
}

// Changes a specified media permission to a specified voice
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

// Announces voice permission changes
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

// Setups events for the main input
Hue.setup_input = function()
{
	$("#input").on("input", function()
	{
		let value = $("#input").val()

		value = Hue.utilz.clean_string9(value)

		if(value.length > Hue.config.max_input_length)
		{
			value = value.substring(0, Hue.config.max_input_length)
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

	$("#input").on("focus", function()
	{
		if(Hue.context_menu_open)
		{
			$('.context-menu-list').trigger('contextmenu:hide')
		}
	})

	Hue.old_input_val = $("#input").val()
}

// Setups the input's placeholder
Hue.setup_input_placeholder = function()
{
	if(Hue.get_setting("show_input_placeholder"))
	{
		clearInterval(Hue.update_input_placeholder_interval)
		Hue.update_input_placeholder()

		if(Hue.get_setting("show_clock_in_input_placeholder"))
		{
			Hue.update_input_placeholder_interval = setInterval(function()
			{
				Hue.update_input_placeholder()
			}, Hue.update_input_placeholder_delay)
		}
	}

	else
	{
		clearInterval(Hue.update_input_placeholder_interval)
		$("#input").attr("placeholder", "")
	}
}

// Updates the input's placeholder
Hue.update_input_placeholder = function()
{
	let s
	let info = `Hi ${Hue.username}, write something to ${Hue.room_name}`

	if(Hue.get_setting("show_clock_in_input_placeholder"))
	{
		s = `(${Hue.utilz.clock_time()})  ${info}`
	}

	else
	{
		s = info
	}

	$("#input").attr("placeholder", s)
}

// Checks if the input is overflowed
Hue.check_input_overflow = function()
{	
	let input = $("#input")[0]

	return input.clientHeight < input.scrollHeight
}

// Creates the input clone
// This is an invisible div that mirrors the input's state
// This is used to check if the input should grow or not
// by checking the clone's overflow
// This is necessary because the clone is not bound to input size mode,
// so it can be known if there's an overflow in any mode, 
// unlike with using the input alone
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

// Sets the clone width to the input's width
Hue.fix_input_clone = function()
{
	if(Hue.input_clone_created)
	{
		$("#input_clone").css("width", `${$("#input").width()}px`) 	
	}
}

// Checks if the input clone is overflowed
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
			Hue.on_resize(false)
		}
	}

	else
	{
		if(Hue.footer_oversized)
		{
			$("#footer").css("height", Hue.initial_footer_height)
			Hue.footer_oversized = false
			Hue.on_resize(false)
		}
	}
}

// Checks if the footer is in 'oversized' mode the input is focused
Hue.footer_oversized_active = function()
{
	return Hue.footer_oversized && document.activeElement === $("#input")[0]
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

// Debounce typing timer to send a typing emit
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

// Debounce timer to hide the typing pencil
Hue.typing_remove_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.hide_pencil()
		}, Hue.config.max_typing_inactivity)
	}
})()

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

// Enables or disables the images lock
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

// Applies changes to the image footer lock icon
Hue.change_lock_images = function()
{
	if(Hue.room_state.images_locked)
	{
		$("#footer_lock_images_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_images_icon").addClass("fa-lock")
		$("#footer_lock_images_icon").addClass("border_bottom")

		if(Hue.loaded_image !== Hue.current_image())
		{
			$("#footer_lock_images_icon").addClass("blinking")
		}
	}

	else
	{
		$("#footer_lock_images_icon").removeClass("fa-lock")
		$("#footer_lock_images_icon").addClass("fa-unlock-alt")
		$("#footer_lock_images_icon").removeClass("border_bottom")
		$("#footer_lock_images_icon").removeClass("blinking")

		Hue.change({type:"image"})
	}
}

// Enables or disables the tv lock
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

// Applies changes to the tv footer lock icon
Hue.change_lock_tv = function()
{
	if(Hue.room_state.tv_locked)
	{
		$("#footer_lock_tv_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_tv_icon").addClass("fa-lock")
		$("#footer_lock_tv_icon").addClass("border_bottom")

		if(Hue.loaded_tv !== Hue.current_tv())
		{
			$("#footer_lock_tv_icon").addClass("blinking")
		}
	}

	else
	{
		$("#footer_lock_tv_icon").removeClass("fa-lock")
		$("#footer_lock_tv_icon").addClass("fa-unlock-alt")
		$("#footer_lock_tv_icon").removeClass("border_bottom")
		$("#footer_lock_tv_icon").removeClass("blinking")

		Hue.change({type:"tv"})
	}
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
	if(Hue.room_state.radio_locked)
	{
		$("#footer_lock_radio_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_radio_icon").addClass("fa-lock")
		$("#footer_lock_radio_icon").addClass("border_bottom")

		if(Hue.loaded_radio !== Hue.current_radio())
		{
			$("#footer_lock_radio_icon").addClass("blinking")
		}
	}

	else
	{
		$("#footer_lock_radio_icon").removeClass("fa-lock")
		$("#footer_lock_radio_icon").addClass("fa-unlock-alt")
		$("#footer_lock_radio_icon").removeClass("border_bottom")
		$("#footer_lock_radio_icon").removeClass("blinking")

		if(Hue.first_media_change)
		{
			Hue.change({type:"radio"})
		}
	}
}

// Shows a feedback message upon joining the room
Hue.show_joined = function()
{
	Hue.feedback(`You joined ${Hue.room_name}`, {save:true})
	Hue.show_topic()
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
	}

	return obj
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

	Hue.toggle_lock_images(true, false)
	Hue.toggle_lock_tv(true, false)
	Hue.toggle_lock_radio(true, false)

	Hue.save_room_state()
}

// Reloads the image with the same source
Hue.refresh_image = function()
{
	Hue.change({type:"image", force:true, play:true, current_source:true})
}

// Reloads the tv with the same source
Hue.refresh_tv = function()
{
	Hue.change({type:"tv", force:true, play:true, current_source:true})
}

// Reloads the radio with the same source
Hue.refresh_radio = function()
{
	Hue.change({type:"radio", force:true, play:true, current_source:true})
}

// Sets media locks and visibility to default states
Hue.default_media_state = function(change_visibility=true)
{
	if(Hue.room_state.images_locked !== Hue.config.room_state_default_images_locked)
	{
		Hue.toggle_lock_images(Hue.config.room_state_default_images_locked, false)
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
		if(Hue.room_state.images_enabled !== Hue.config.room_state_default_images_enabled)
		{
			Hue.toggle_images(Hue.config.room_state_default_images_enabled, false)
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

// Disconnect other clients of the same account
Hue.disconnect_others = function()
{
	Hue.socket_emit("disconnect_others", {})
}

// Shows how many clients of the same account were disconnected
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

// Username setter
Hue.set_username = function(uname)
{
	Hue.username = uname
	Hue.generate_mentions_regex()
	$("#user_menu_username").text(Hue.username)
}

// Email setter
Hue.set_email = function(email)
{
	Hue.user_email = email
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

// Creates a Msg popup
Hue.create_popup = function(position, id=false, after_close=false)
{
	let common =
	{
		show_effect_duration: [0, 400],
		close_effect_duration: [400, 0],
		clear_editables: true,
		class: "popup"
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

	z = pop

	return pop
}

// Show an intro with popups when a user first joins the site
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

// Shows feedback if user doesn't have chat permission
Hue.cant_chat = function()
{
	Hue.feedback("You don't have permission to chat")
}

// Checks if a user is in the room to receive a whisper
Hue.check_whisper_user = function(uname)
{
	if(!Hue.can_chat)
	{
		Hue.cant_chat()
		return false
	}

	if(!Hue.usernames.includes(uname))
	{
		Hue.user_not_in_room(uname)
		return false
	}

	return true
}

// Processes whisper commands to determine how to handle the operation
Hue.process_write_whisper = function(arg, show=true)
{
	let user = Hue.get_user_by_username(arg)

	if(arg.includes(">"))
	{
		Hue.send_inline_whisper(arg, show)
	}

	else if(user)
	{
		Hue.write_popup_message([arg], "user")
	}

	else if(arg.includes("&&"))
	{
		let split = arg.split("&&").map(x => x.trim())
		Hue.write_popup_message(split, "user")
	}

	else
	{
		let matches = Hue.get_matching_usernames(arg)

		if(matches.length === 1)
		{
			let message = arg.replace(matches[0], "")
			let arg2 = `${matches[0]} > ${message}`

			Hue.send_inline_whisper(arg2, show)
		}

		else if(matches.length > 1)
		{
			Hue.feedback("Multiple usernames matched. Use the proper > syntax. For example /whisper bob > hi")
			return false
		}

		else
		{
			Hue.user_not_in_room()
			return false
		}
	}
}

// Sends a whisper using the inline format (/whisper user > hello)
Hue.send_inline_whisper = function(arg, show=true)
{
	let split = arg.split(">")

	if(split.length < 2)
	{
		return false
	}

	let uname = split[0].trim()
	let usplit = uname.split("&&")
	let message = Hue.utilz.clean_string10(Hue.clean_multiline(split.slice(1).join(">")))

	if(!message)
	{
		return false
	}

	let message_split = message.split("\n")
	let num_lines = message_split.length

	if(num_lines > Hue.config.max_num_newlines)
	{
		return false
	}

	let approved = []

	for(let u of usplit)
	{
		u = u.trim()

		if(!Hue.check_whisper_user(u))
		{
			continue
		}

		approved.push(u)
	}

	if(approved.length === 0)
	{
		return false
	}
	
	Hue.do_send_whisper_user(approved, message, false, show)
}

// Shows the window to write whispers
// Handles different whisper types
Hue.write_popup_message = function(unames=[], type="user")
{
	let title

	if(type === "user")
	{
		for(let u of unames)
		{
			if(!Hue.check_whisper_user(u))
			{
				return false
			}
		}

		let f = function()
		{
			Hue.show_userlist("whisper")
		}

		title = {text:`Whisper to ${Hue.utilz.nice_list(unames)}`, onclick:f}
	}

	else if(type === "ops")
	{
		if(!Hue.is_admin_or_op(Hue.role))
		{
			Hue.not_an_op()
			return false
		}

		title = {text:"* Whisper to Operators *"}
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

	Hue.message_unames = unames
	Hue.message_type = type
	Hue.msg_message.set_title(Hue.make_safe(title))

	Hue.msg_message.show(function()
	{
		$("#write_message_area").focus()
		Hue.sending_whisper = false
	})
}

// Updates the user receivers in the whisper window after picking a username in the user list
Hue.update_whisper_users = function(uname)
{
	if(!Hue.message_unames.includes(uname))
	{
		Hue.message_unames.push(uname)
	}

	else
	{
		if(Hue.message_unames.length === 1)
		{
			return false
		}
		
		for(let i=0; i<Hue.message_unames.length; i++)
		{
			let u = Hue.message_unames[i]

			if(u === uname)
			{
				Hue.message_unames.splice(i, 1)
				break
			}
		}
	}

	let f = function()
	{
		Hue.show_userlist("whisper")
	}

	let title = {text:`Whisper to ${Hue.utilz.nice_list(Hue.message_unames)}`, onclick:f}

	Hue.msg_message.set_title(Hue.make_safe(title))
	Hue.msg_userlist.close()
}

// Submits the whisper window form
// Handles different types of whispers
// Includes text and drawings
Hue.send_popup_message = function(force=false)
{
	if(Hue.sending_whisper)
	{
		return false
	}

	Hue.sending_whisper = true

	let message = Hue.utilz.clean_string10($("#write_message_area").val())
	let diff = Hue.config.max_input_length - message.length
	let draw_coords

	if(Hue.draw_message_click_x.length > 0)
	{
		draw_coords = [Hue.draw_message_click_x, Hue.draw_message_click_y, Hue.draw_message_drag]
	}

	else
	{
		draw_coords = false
	}

	if(diff === Hue.config.max_input_length)
	{
		if(!draw_coords)
		{
			Hue.sending_whisper = false
			return false
		}
	}

	else if(diff < 0)
	{
		$("#write_message_feedback").text(`Character limit exceeded by ${Math.abs(diff)}`)
		$("#write_message_feedback").css("display", "block")
		Hue.sending_whisper = false
		return false
	}

	let message_split = message.split("\n")
	let num_lines = message_split.length

	if(num_lines > Hue.config.max_num_newlines)
	{
		$("#write_message_feedback").text(`Too many linebreaks`)
		$("#write_message_feedback").css("display", "block")
		Hue.sending_whisper = false
		return false
	}

	let ans

	if(Hue.message_type === "user")
	{
		ans = Hue.send_whisper_user(message, draw_coords, force)
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
		Hue.msg_message.close(function()
		{
			Hue.sending_whisper = false
		})
	}

	else
	{
		Hue.sending_whisper = false
	}
}

// Confirmation when a whisper was sent
// Configured to recreate the whisper when clicked
Hue.sent_popup_message_function = function(mode, message, draw_coords, data1=[])
{
	let cf = function(){}
	let ff = function(){}
	let s1, s2

	if(mode === "whisper")
	{
		s1 = Hue.utilz.nonbreak("Send Another Whisper")
		s2 = `Whisper sent to ${Hue.utilz.nice_list(data1)}`

		cf = function()
		{
			Hue.write_popup_message(data1)
		}
		
		ff = function()
		{
			Hue.show_profile(data1[0])
		}
	}

	else
	{
		return false
	}

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
		remove_text_if_empty: true,
		date: Date.now()
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

// Sends a whisper to user(s)
Hue.send_whisper_user = function(message, draw_coords, force=false)
{
	let unames = Hue.message_unames

	if(!unames)
	{
		return false
	}

	if(!Hue.can_chat)
	{
		$("#write_message_feedback").text("You don't have chat permission")
		$("#write_message_feedback").css("display", "block")

		return false
	}

	let discarded = []
	let approved = []

	for(let u of unames)
	{
		if(!Hue.usernames.includes(u))
		{
			discarded.push(u)
		}

		else
		{
			approved.push(u)
		}
	}

	if(!force)
	{
		if(discarded.length > 0)
		{
			let us = Hue.utilz.nice_list(discarded)
			let w = discarded.length === 1 ? "is" : "are"
			let dd = ""

			if(unames.length > discarded.length)
			{
				dd = " Double click Send to send anyway"
			}

			$("#write_message_feedback").text(`(${us} ${w} not in the room)${dd}`)
			$("#write_message_feedback").css("display", "block")

			return false
		}
	}

	if(approved.length === 0)
	{
		return false
	}

	Hue.do_send_whisper_user(approved, message, draw_coords)

	return true
}

// Does the whisper of type user emit
Hue.do_send_whisper_user = function(unames, message, draw_coords, show=true)
{
	for(let u of unames)
	{
		Hue.socket_emit('whisper', 
		{
			type: "user",
			username: u, 
			message: message, 
			draw_coords: draw_coords
		})
	}
	
	if(show)
	{
		let f = Hue.sent_popup_message_function("whisper", message, draw_coords, unames)
		let m = `Whisper sent to ${Hue.utilz.nice_list(unames)}`

		Hue.feedback(m, {onclick:f, save:true})
	}
}

// Does the whisper of type operators emit
Hue.send_whisper_ops = function(message, draw_coords)
{
	Hue.socket_emit('whisper', {type:"ops", message:message, draw_coords:draw_coords})
	return true
}

// Does the whisper of type room broadcast emit
Hue.send_room_broadcast = function(message, draw_coords)
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("whisper", {type:"broadcast", message:message, draw_coords:draw_coords})
	return true
}

// Does the whisper of type system broadcast emit
Hue.send_system_broadcast = function(message, draw_coords)
{
	Hue.socket_emit("whisper", {type:"system_broadcast", message:message, draw_coords:draw_coords})
	return true
}

// When receiving a whisper
// A popup automatically appears unless configured not to
// Shows a chat announcement that when click shows the whisper with text and drawings
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

	let nd = Hue.utilz.nice_date(data.date)
	let f

	if(data.username)
	{
		if(Hue.user_is_ignored(data.username))
		{
			return false
		}

		if(Hue.accept_commands_from_list.includes(data.username))
		{
			if(data.message && Hue.is_command(data.message))
			{
				Hue.execute_whisper_command(data.username, data.message)
				return
			}
		}

		f = function()
		{
			Hue.show_profile(data.username)
		}
	}

	let ch

	if(data.draw_coords)
	{
		ch = `<canvas 
		id='draw_popup_area_${data.id}' 
		class='draw_canvas dynamic_title draw_canvas_received' 
		title='${nd}' data-otitle='${nd}' 
		data-date='${data.date}' 
		width='400px' height='300px' 
		tabindex=1></canvas>`
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
			h0 = `<div class='small_button_2 action show_message_reply show_message_reply_with_spacing'>${Hue.utilz.nonbreak("Send Whisper")}</div>`
		}

		else
		{
			h0 = ""
		}

		h = `<div class='flex_column_center'>${h0}<div class='small_button_2 action show_message_reply_ops'>${Hue.utilz.nonbreak("Send Whisper to Operators")}</div></div>`
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

	if(ch)
	{
		if(h)
		{
			h = ch + h
		}
		
		else
		{
			h = ch
		}
	}

	data.content = Hue.make_safe(
	{
		text: data.message,
		text_as_html: true,
		text_classes: "popup_message_text",
		html: h,
		remove_text_if_empty: true,
		date: data.date
	})

	Hue.setup_whispers_click(data.content, data.username)

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

	Hue.on_highlight()
}

// Shows and configures the whisper popup
Hue.show_popup_message = function(data)
{
	let pop = Hue.create_popup("top", `popup_message_${data.id}`)

	pop.show([data.title, data.content], function()
	{
		$(pop.content).find(".show_message_reply").eq(0).click(function()
		{
			Hue.write_popup_message([data.username])
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

// Returns feedback on wether a user is in the room or not
Hue.user_not_in_room = function(uname)
{
	if(uname)
	{
		Hue.feedback(`${uname} is not in the room`)
	}

	else
	{
		Hue.feedback("User is not in the room")
	}
}

// Superuser command to change to any role
Hue.annex = function(rol="admin")
{
	if(!Hue.roles.includes(rol))
	{
		Hue.feedback("Invalid role")
		return false
	}

	Hue.socket_emit('change_role', {username:Hue.username, role:rol})
}

// Debounce timer for highlights filter
Hue.highlights_filter_timer = (function()
{
	let timer

	return function()
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.show_highlights($("#highlights_filter").val())
		}, Hue.filter_delay)
	}
})()

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

// Executes commands from a setting
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

// This executes at the end of the join function
// When the client is ready for use
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

	Hue.process_visibility()
}

// Debounce timer for media history filters
Hue.media_history_filter_timer = (function()
{
	let timer

	return function(type)
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			let filter = $(`#${type}_history_filter`).val()
			Hue.show_media_history(type, filter)
		}, Hue.filter_delay)
	}
})()

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

// Maximizes the image, hiding the tv
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

// Maximizes the tv, hiding the image
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

// Checks if tv is maximized
Hue.tv_is_maximized = function()
{
	return Hue.tv_visible && !Hue.images_visible
}

// Checks if the image is maximized
Hue.images_is_maximized = function()
{
	return Hue.images_visible && !Hue.tv_visible
}

// Setup font loading events
Hue.setup_fonts = function()
{
	document.fonts.ready.then(function() 
	{
		Hue.on_fonts_loaded()
	})
}

// After the font finished loading
Hue.on_fonts_loaded = function()
{
	Hue.goto_bottom(true, false)
	Hue.create_input_clone()
}

// Starts click events for 'generic usernames'
// Username elements with this class get included
Hue.start_generic_uname_click_events = function()
{
	$("body").on("click", ".generic_uname", function()
	{
		let uname = $(this).text()
		Hue.show_profile(uname)
	})
}

// Send a signal to an Electron client
Hue.electron_signal = function(func, data={})
{
	if(window["electron_api"] === undefined)
	{
		return false
	}

	if(window["electron_api"][func] !== undefined)
	{
		window["electron_api"][func](data)
	}
}

// When clicking the Previous button in the image modal window
Hue.modal_image_prev_click = function()
{
	let index = Hue.images_changed.indexOf(Hue.loaded_modal_image) - 1

	if(index < 0)
	{
		index = Hue.images_changed.length - 1
	}

	let prev = Hue.images_changed[index]

	Hue.show_modal_image(prev)
}

// When clicking the Next button in the image modal window
Hue.modal_image_next_click = function(e)
{
	let index = Hue.images_changed.indexOf(Hue.loaded_modal_image) + 1

	if(index > Hue.images_changed.length - 1)
	{
		index = 0
	}

	let next = Hue.images_changed[index]

	Hue.show_modal_image(next)
}

// Setups image modal window events
Hue.setup_modal_image = function()
{
	let img = $("#modal_image")

	img[0].addEventListener('load', function()
	{
		$("#modal_image_spinner").css("display", "none")
		$("#modal_image").css("display", "block")
		Hue.show_modal_image_resolution()
	})

	img.on("error", function()
	{
		$("#modal_image_spinner").css("display", "none")
		$("#modal_image").css("display", "none")
		$("#modal_image_error").css("display", "block")
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
		Hue.show_media_history("image")
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

	$("#modal_image_toolbar_load").click(function(e)
	{
		let item = Hue.loaded_modal_image
		Hue.toggle_images(true)
		Hue.change({type:"image", item:item, force:true})
		Hue.toggle_lock_images(true)
		Hue.close_all_modals()
	})

	$("#modal_image_toolbar_change").click(function(e)
	{
		if(confirm("This will change it for everyone. Are you sure?"))
		{
			let item = Hue.loaded_modal_image
			Hue.change_image_source(item.source)
			Hue.close_all_modals()
		}
	})
}

// Debounce timer for image modal scrollwheel in the 'previous' direction
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

// Debounce timer for image modal scrollwheel in the 'next direction
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

// Debounce timer for maxers, like chat and media maxers
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

// Shows feedback with the current date in the nice date format
Hue.show_current_date = function()
{
	Hue.feedback(Hue.utilz.nice_date())
}

// Thsi is called whenever the server ask for the next slice of a file upload
Hue.request_slice_upload = function(data)
{
	let file = Hue.files[data.date]

	if(!file)
	{
		return false
	}

	let place = data.current_slice * Hue.config.upload_slice_size
	let slice = file.slice(place, place + Math.min(Hue.config.upload_slice_size, file.hue_data.size - place))

	file.hue_data.next = Hue.get_file_next(file)

	if(file.hue_data.next >= 100)
	{
		file.hue_data.sending_last_slice = true
	}

	file.hue_data.percentage = Math.floor(((Hue.config.upload_slice_size * data.current_slice) / file.hue_data.size) * 100)
	file.hue_data.reader.readAsArrayBuffer(slice)

	Hue.change_upload_status(file, `${file.hue_data.percentage}%`)
}

// What to do when a file upload finishes
Hue.upload_ended = function(data)
{
	let file = Hue.files[data.date]

	if(file)
	{
		Hue.change_upload_status(file, "100%", true)
		delete Hue.files[data.date]
	}
}

// Feedback that an error occurred
Hue.error_occurred = function()
{
	Hue.feedback("An error occurred")
}

// Send the code to verify email change
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

	if(code.length > Hue.config.email_change_code_max_length)
	{
		Hue.feedback("Invalid code")
		return
	}

	Hue.socket_emit("verify_email", {code:code})
}

// If the user is banned the client enters locked mode
// This only shows a simple menu with a few navigation options
Hue.start_locked_mode = function()
{
	$("#header").css("display", "none")
	$("#footer").css("display", "none")

	Hue.show_locked_menu()
	Hue.make_main_container_visible()
}

// Show the locked menu
Hue.show_locked_menu = function()
{
	Hue.msg_locked.show()
}

// Show the go to room window
Hue.show_goto_room = function()
{
	Hue.msg_info2.show(["Go To Room", Hue.template_goto_room()], function()
	{
		$("#goto_room_input").focus()
		Hue.goto_room_open = true
	})
}

// On go to room window submit
Hue.goto_room_action = function()
{
	let id = $("#goto_room_input").val().trim()

	if(id.length === 0)
	{
		return false
	}

	Hue.show_open_room(id)
}

// Confirm if the user wants to reset the settings
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

	if(confirm(`Are you sure you want to reset the ${s} to their initial state?`))
	{
		Hue.reset_settings(type)
	}
}

// Reset the settings of a certain type
Hue.reset_settings = function(type, empty=true)
{
	if(empty)
	{
		Hue[`empty_${type}`]()
	}

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

// Execute javascript locally
Hue.execute_javascript = function(arg, show_result=true)
{
	arg = arg.replace(/\s\/endjs/gi, "")

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

// Utility function to create safe html elements with certain options
Hue.make_safe = function(args={})
{
	let def_args =
	{
		text: "",
		text_as_html: false,
		text_classes: false,
		html: false,
		urlize: true,
		onclick: false,
		html_unselectable: true,
		title: false,
		remove_text_if_empty: false,
		date: false
	}

	args = Object.assign(def_args, args)

	let c = $("<div></div>")

	if(args.text || !args.remove_text_if_empty)
	{
		let c_text_classes = "message_info_text inline"

		if(args.onclick)
		{
			c_text_classes += " pointer action"
		}

		if(args.text_classes)
		{
			c_text_classes += ` ${args.text_classes}`
		}

		c.append(`<div class='${c_text_classes}'></div>`)

		let c_text = c.find(".message_info_text").eq(0)

		if(args.text_as_html)
		{
			let h = Hue.replace_markdown(Hue.make_html_safe(args.text))

			if(args.urlize)
			{
				c_text.html(h).urlize()
			}

			else
			{
				c_text.html(h)
			}
		}

		else
		{
			if(args.urlize)
			{
				c_text.text(args.text).urlize()
			}

			else
			{
				c_text.text(args.text)
			}
		}

		if(args.onclick)
		{
			c_text.on("click", args.onclick)
		}

		if(args.date)
		{
			let nd = Hue.utilz.nice_date(args.date)

			c_text.data("date", args.date)
			c_text.data("otitle", nd)
			c_text.attr("title", nd)
			c_text.addClass("dynamic_title")
		}

		else
		{
			if(args.title)
			{
				c_text.attr("title", args.title)
			}
		}
	}

	if(args.html)
	{
		let sp

		if(args.text || !args.remove_text_if_empty)
		{
			sp = "message_info_html_spaced"
		}

		else
		{
			sp = ""
		}

		c.append(`<div class='message_info_html ${sp}'>${args.html}</div>`)

		if(args.html_unselectable)
		{
			c.find(".message_info_html").eq(0).addClass("unselectable")
		}
	}

	return c[0]
}

// Turn a string into safe HTML by replacing < and > to safe versions
Hue.make_html_safe = function(s)
{
	let replaced = s.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
	return replaced
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

// Check whether a user is ignored by checking the ignored usernames list
Hue.user_is_ignored = function(uname)
{
	if(uname === Hue.username)
	{
		return false
	}

	if(Hue.ignored_usernames_list.includes(uname))
	{
		return true
	}

	return false
}

// Show the global settings window
Hue.show_global_settings = function(filter=false)
{
	Hue.do_settings_filter("global_settings", filter)
	Hue.msg_global_settings.show()
}

// Show the rooms settings window
Hue.show_room_settings = function(filter=false)
{
	Hue.do_settings_filter("room_settings", filter)
	Hue.msg_room_settings.show()
}

// Setup the settings windows
Hue.setup_settings_windows = function()
{
	Hue.setup_setting_elements("global_settings")
	Hue.setup_setting_elements("room_settings")
	Hue.create_room_settings_overriders()
	Hue.set_room_settings_overriders()
	Hue.start_room_settings_overriders()
	Hue.check_room_settings_override()
	Hue.setup_user_function_switch_selects()
	Hue.set_user_settings_titles()

	$(".settings_main_window").on("click", ".settings_window_category", function(e)
	{
		let category = $(this).data("category")
		Hue.change_settings_window_category(category)
	})
	
	let first_category = $("#global_settings_container .settings_window_category").eq(0).data("category")
	Hue.change_settings_window_category(first_category, "global_settings")
	Hue.change_settings_window_category(first_category, "room_settings")
}

// Creates the overrider widgets for the room settings window
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

// Sets the room settings window's overriders based on current state
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

// Starts the room settings window's overrider's events
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

// If a global settings item is overriden in room settings,
// it becomes faded. This function sets this
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

// Sets up more settings elements
Hue.setup_setting_elements = function(type)
{
	$(`#${type}_double_tap_key`).text(Hue.config.double_tap_key)
	$(`#${type}_double_tap_2_key`).text(Hue.config.double_tap_key_2)
	$(`#${type}_double_tap_3_key`).text(Hue.config.double_tap_key_3)

	Hue.setup_togglers(type)
}

// Checks for room settings overrides to show or not indicators of change,
// in each category and in the user menu
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

// Gets the active version of a setting
// Either from global settings or room settings
// A room setting version is active when the setting is overriden
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

// Checks whether a setting is active as a global or as a room setting
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

// Changes the state of a toggler
// If enabled, it will show the container and show a -
// If disabled it will hide the container and show a +
Hue.set_toggler = function(type, el, action=false)
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
		$(el).html(`- ${$(el).html().trim().substring(2)}`)
		container.closest(".toggler_main_container")[0].scrollIntoView({block:"center"})
	}

	else
	{
		if(action && action !== "close")
		{
			return false
		}

		container.css("display", "none")
		$(el).html(`+ ${$(el).html().trim().substring(2)}`)
	}
}

// Setups toggler events
// Togglers are elements that when clicked reveal more elements
// They can be toggled
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

// Opens a toggler
Hue.open_togglers = function(type)
{
	$(`.${type}_toggle`).each(function()
	{
		Hue.set_toggler(type, this, "open")
	})
}

// Closes a toggler
Hue.close_togglers = function(type)
{
	$(`.${type}_toggle`).each(function()
	{
		Hue.set_toggler(type, this, "close")
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

// Room name setter
Hue.set_room_name = function(name)
{
	Hue.room_name = name
	Hue.config_admin_room_name()
}

// Room images mode setter
Hue.set_room_images_mode = function(what)
{
	Hue.room_images_mode = what
	Hue.config_admin_room_images_mode()
}

// Room tv mode setter
Hue.set_room_tv_mode = function(what)
{
	Hue.room_tv_mode = what
	Hue.config_admin_room_tv_mode()
}

// Room radio mode setter
Hue.set_room_radio_mode = function(what)
{
	Hue.room_radio_mode = what
	Hue.config_admin_room_radio_mode()
}

// Room synth mode setter
Hue.set_room_synth_mode = function(what)
{
	Hue.room_synth_mode = what
	Hue.config_admin_room_synth_mode()
}

// Background mode setter
Hue.set_background_mode = function(what)
{
	Hue.background_mode = what
	Hue.config_admin_background_mode()
	Hue.apply_background()
	Hue.apply_theme()
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

// Privacy setter
Hue.set_privacy = function(what)
{
	Hue.is_public = what
	Hue.config_admin_privacy()
}

// Log enabled setter
Hue.set_log_enabled = function(what)
{
	Hue.log_enabled = what
	Hue.config_admin_log_enabled()
}

// Wrapper to show a confirmation dialog before running a function
Hue.needs_confirm = function(func, s=false)
{
	if(!s)
	{
		s = "Are you sure?"
	}

	if(confirm(s))
	{
		Hue[func]()
	}
}

// Checks if a role is that of an admin or an operator
// Without arguments it checks the user's role
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

// Shows a window with a form to enter a string received by Export Settings
// Used to import settings from one client to another
Hue.show_import_settings = function()
{
	let s = `
	<div class='container_22'>
		Paste code generated by Export Settings
		<textarea id='import_settings_textarea' rows=5 class='setting_textarea'></textarea>
		<div class='menu_item inline action pointer unselectable' id='import_settings_apply'>Apply</div>
	</div>
	`

	Hue.msg_info2.show(["Import Settings", s], function()
	{
		$("#import_settings_textarea").focus()
		$("#import_settings_apply").click(function()
		{
			Hue.process_imported_settings()
		})

		Hue.import_settings_open = true
	})
}

// Processes the string entered in the import settings window
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

// Shows a window that displays strings to export settings to another client
// It shows different kinds of export methods
// A string is then entered in Import Settings in another client and executed
Hue.show_export_settings = function()
{
	let gsettings = localStorage.getItem(Hue.ls_global_settings)
	let rsettings = localStorage.getItem(Hue.ls_room_settings)
	let code = `let gsettings = ${gsettings}; Hue.save_local_storage(Hue.ls_global_settings, gsettings); let rsettings = ${rsettings}; Hue.save_local_storage(Hue.ls_room_settings, rsettings); Hue.restart_client()`
	let code2 = `let gsettings = ${gsettings}; Hue.save_local_storage(Hue.ls_global_settings, gsettings); Hue.restart_client()`
	let code3 = `let rsettings = ${rsettings}; Hue.save_local_storage(Hue.ls_room_settings, rsettings); Hue.restart_client()`

	let s = `
	<div class='container_22'>

		<div id='export_settings_info'  class='grid_column_center'>
			<div>In case you want to export your settings from one browser to another.</div>
			<div>You can import either Global Settings, Room Settings, or both.</div>
			<div>Room Settings copies every room's settings, not just the current one.</div>
			<div>To do this, copy one of the codes below, and paste it in Import Settings in the other browser.</div>
		</div>

		<div class='export_settings_textarea_label'>(a) Use this code if you want to import <span class='bold'>Global</span> and <span class='bold'>Room</span> Settings</div>
		<textarea rows=5 class='setting_textarea export_settings_textarea'>${code}</textarea>
		
		<div class='export_settings_textarea_label'>(b) Use this code if you only want to import <span class='bold'>Global</span> Settings</div>
		<textarea rows=5 class='setting_textarea export_settings_textarea'>${code2}</textarea>

		<div class='export_settings_textarea_label'>(c) Use this code if you only want to import <span class='bold'>Room</span> Settings</div>
		<textarea rows=5 class='setting_textarea'>${code3}</textarea>
	</div>
	`

	Hue.msg_info2.show(["Export Settings", s])
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

// Loads the Soundcloud script and creates players
Hue.start_soundcloud = async function()
{
	if(Hue.soundcloud_loaded)
	{
		if(Hue.soundcloud_player_requested && Hue.soundcloud_player === undefined)
		{
			Hue.create_soundcloud_player()
		}
		
		if(Hue.soundcloud_video_player_requested && Hue.soundcloud_video_player === undefined)
		{
			Hue.create_soundcloud_video_player()
		}
	}

	if(Hue.soundcloud_loading)
	{
		return false
	}

	Hue.soundcloud_loading = true
	
	await Hue.load_script("https://w.soundcloud.com/player/api.js")

	Hue.soundcloud_loaded = true

	if(Hue.soundcloud_player_requested)
	{
		Hue.create_soundcloud_player()
	}

	if(Hue.soundcloud_video_player_requested)
	{
		Hue.create_soundcloud_video_player()
	}
}

// Creates the radio Soundcloud player
Hue.create_soundcloud_player = function()
{
	Hue.soundcloud_player_requested = false

	try
	{
		let src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/301986536'

		$("#media_soundcloud_audio_container").html(`<iframe id='soundcloud_player' src='${src}'></iframe>`)

		let _soundcloud_player = SC.Widget("soundcloud_player")
		
		_soundcloud_player.bind(SC.Widget.Events.READY, function()
		{
			Hue.soundcloud_player = _soundcloud_player

			if(Hue.soundcloud_player_request)
			{
				Hue.change(Hue.soundcloud_player_request)
				Hue.soundcloud_player_request = false
			}
		})
	}

	catch(err)
	{
		console.error("Soundcloud failed to load")
	}
}

// Creates the tv Soundcloud player
Hue.create_soundcloud_video_player = function()
{
	Hue.soundcloud_video_player_requested = false

	try
	{
		let src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/301986536'

		$("#media_soundcloud_video_container").html(`<iframe width="640px" height="360px"
		id='media_soundcloud_video' class='video_frame' src='${src}'></iframe>`)

		let _soundcloud_video_player = SC.Widget("media_soundcloud_video")

		_soundcloud_video_player.bind(SC.Widget.Events.READY, function()
		{
			Hue.soundcloud_video_player = _soundcloud_video_player

			if(Hue.soundcloud_video_player_request)
			{
				Hue.change(Hue.soundcloud_video_player_request)
				Hue.soundcloud_video_player_request = false
			}
		})
	}

	catch(err)
	{
		console.error("Soundcloud failed to load")
	}
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
	Hue.public_feedback(`${data.username} changed the text color mode to ${data.mode}`,
	{
		username: data.username,
		open_profile: true
	})

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

// Announces text color changes
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

// Text color setter
Hue.set_text_color = function(color)
{
	Hue.text_color = color
	Hue.config_admin_text_color()
}

// Returns a string surrounded by quote if it's a single word and not a URL
Hue.conditional_quotes = function(s)
{
	if(!s.includes(" ") && Hue.utilz.is_url(s))
	{
		return s
	}

	else
	{
		return `"${s}"`
	}
}

// Sends a restart signal to reload the tv for everyone
Hue.restart_tv = function()
{
	Hue.change_tv_source("restart")
	Hue.msg_tv_picker.close()
}

// Sends a restart signal to reload the radio for everyone
Hue.restart_radio = function()
{
	Hue.change_radio_source("restart")
	Hue.msg_radio_picker.close()
}

// Check whether a background image should be enabled,
// depending on the background mode and settings
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

// Setups more footer elements
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

// Simple emit to check server response
Hue.ping_server = function()
{
	Hue.socket_emit("ping_server", {date:Date.now()})
}

// Calculates how much time the pong response took to arrive
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

// Sends a reaction to the chat
// Like 'happy
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

	Hue.hide_reactions_box()
}

// Shows a message depending on the reaction type
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

// Setups the reaction box's events
// This is the box that appears on user menu hover
// It includes reactions as well as user functions
Hue.setup_reactions_box = function()
{
	$("#footer_user_menu_container").hover(

	function()
	{
		clearTimeout(Hue.hide_reactions_timeout)
	
		Hue.show_reactions_timeout = setTimeout(function()
		{
			Hue.show_reactions_box()
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

	$("#chat_area").click(function()
	{
		if(Hue.reactions_box_open)
		{
			Hue.hide_reactions_box()
		}
	})

	$("#input").click(function()
	{
		if(Hue.reactions_box_open)
		{
			Hue.hide_reactions_box()
		}
	})
}

// Starts a timeout to hide the reactions box when the mouse leaves the box
Hue.start_hide_reactions = function()
{
	clearTimeout(Hue.show_reactions_timeout)

	Hue.hide_reactions_timeout = setTimeout(function()
	{
		if(Hue.mouse_over_reactions)
		{
			return false
		}

		Hue.hide_reactions_box()
	}, Hue.reactions_hover_delay_2)
}

// Shows the reactions box
Hue.show_reactions_box = function()
{
	if(!Hue.reactions_box_open)
	{
		$("#reactions_box_container").css("display", "flex")
		Hue.reactions_box_open = true
	}
}

// Hides the reactions box
Hue.hide_reactions_box = function()
{
	if(Hue.reactions_box_open)
	{
		$("#reactions_box_container").css("display", "none")
		Hue.reactions_box_open = false
	}
}

// Setups user function buttons in the reaction box
Hue.setup_user_functions = function()
{
	for(let i=1; i<Hue.user_functions.length+1; i++)
	{
		$(`#user_function_button_${i}`).click(function()
		{
			Hue.run_user_function(i)
		})
	
		$(`#user_function_button_${i}`).on("auxclick", function(e)
		{
			if(e.which === 2)
			{
				Hue.open_user_function_in_settings(i)
			}
		})
	}

	Hue.setup_user_function_titles()
}

// Opens the settings in the category where the user functions are and opens the toggler
Hue.open_user_function_in_settings = function(n)
{
	Hue.open_user_settings_category("functions")
	Hue.go_to_user_settings_item(`user_function_${n}`)
}

// Executes the user function of a given number
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
		Hue.open_user_function_in_settings(n)
	}
	
	Hue.hide_reactions_box()
}

// Changes the tv display slider to a given value from 10 to 90
Hue.set_tv_display_percentage = function(v, type)
{
	if(v === undefined || type === undefined)
	{
		return false
	}

	if(v === "default")
	{
		v = Hue.config.global_settings_default_tv_display_percentage
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

// Changes the chat display slider to a given value from 10 to 90
Hue.set_chat_display_percentage = function(v, type)
{
	if(v === undefined || type === undefined)
	{
		return false
	}

	if(v === "default")
	{
		v = Hue.config.global_settings_default_chat_display_percentage
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

// Applies percentages changes to the chat and media elements based on current state
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

	Hue.fix_media_margin()
}

// Overrides the tv display position global setting automatically
// Toggles display positions of image and tv
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

	Hue.enable_setting_override("tv_display_position")
	Hue.swap_display_positions("room_settings", np)
}

// Swaps and applies display position of images and tv
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

// Setups lockscreen events
Hue.setup_lockscreen = function()
{
	$("#lockscreen_title_menu").on("mouseenter", function()
	{
		Hue.lockscreen_peek_timeout = setTimeout(function()
		{
			$("#Msg-container-lockscreen").css("opacity", 0.2)
			Hue.lockscreen_peek_active = true
		}, Hue.lockscreen_peek_delay)
	})

	$("#lockscreen_title_menu").on("mouseleave", function()
	{
		clearTimeout(Hue.lockscreen_peek_timeout)

		if(Hue.lockscreen_peek_active)
		{
			$("#Msg-container-lockscreen").css("opacity", 1)
			$("#lockscreen_title_info").text("")
		}

		Hue.lockscreen_peek_active = false
	})

	Hue.setup_lockscreen_clock()
}

// Setups the optional clock that appears in the lockscreen
Hue.setup_lockscreen_clock = function()
{
	if(Hue.get_setting("show_clock_in_lockscreen"))
	{
		$("#lockscreen_clock").css("display", "block")
	}
	
	else
	{
		$("#lockscreen_clock").css("display", "none")
	}
}

// Enables the lockscreen
// The lockscreen is a special mode where the display is covered
// The user is considered unfocused and optionally afk automatically
Hue.lock_screen = function(save=true)
{
	if(Hue.screen_locked)
	{
		return false
	}

	Hue.room_state.screen_locked = true
	Hue.screen_locked = true
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
		Hue.save_room_state()
	}

	$("#lockscreen_clock").text(Hue.utilz.clock_time())

	if(Hue.get_setting("show_clock_in_lockscreen"))
	{
		Hue.lockscreen_clock_interval = setInterval(function()
		{
			$("#lockscreen_clock").text(Hue.utilz.clock_time())
		}, Hue.update_lockscreen_clock_delay)
	}
}

// Disables the lockscreen
Hue.unlock_screen = function(save=true)
{
	if(!Hue.screen_locked)
	{
		return false
	}

	clearTimeout(Hue.lockscreen_peek_timeout)
	clearInterval(Hue.lockscreen_clock_interval)

	Hue.room_state.screen_locked = false
	Hue.screen_locked = false
	Hue.msg_lockscreen.close()
	Hue.process_visibility()
	Hue.execute_commands("on_unlockscreen")

	$("#lockscreen_title_info").text("")

	if(save)
	{
		Hue.save_room_state()
	}
}

// Setups the drawing area of write whisper windows
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

// Redraws the drawing area of a write whisper window
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

// Clears the drawing area of a write whisper window
Hue.clear_draw_message_state = function()
{
	Hue.draw_message_click_x = []
	Hue.draw_message_click_y = []
	Hue.draw_message_drag = []

	Hue.draw_message_context.clearRect(0, 0, Hue.draw_message_context.canvas.width, Hue.draw_message_context.canvas.height)
}

// Registers a click to the drawing area of a write whisper window
Hue.draw_message_add_click = function(x, y, dragging)
{
	Hue.draw_message_click_x.push(x)
	Hue.draw_message_click_y.push(y)
	Hue.draw_message_drag.push(dragging)

	if(Hue.draw_message_click_x.length > Hue.config.draw_coords_max_array_length)
	{
		Hue.draw_message_click_x.shift()
		Hue.draw_message_click_y.shift()
		Hue.draw_message_drag.shift()
	}
}

// Redraws a drawing canvas
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

	args = Object.assign(def_args, args)

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

// Opens the draw image window
Hue.open_draw_image = function()
{
	if(!Hue.can_images)
	{
		Hue.feedback("You don't have permission to draw images")
		return false
	}

	Hue.msg_draw_image.show()
}

// Returns a number used in draw image scaling
// It can have a different scale than 1:1 to produce higher resolution images
Hue.draw_image_scale_fix = function(n)
{
	return parseInt(Math.round(n * Hue.draw_image_scale))
}

// Starts a new draw image sector on mousedown
// Sectors are used to determine actions so undo and redo can be applied
Hue.draw_image_add_sector = function()
{
	Hue.draw_image_current_snapshot.sectors.push(Hue.draw_image_current_snapshot.click_x.length)
}

// Setups the draw image window
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

// Prepares initial settings for the draw image window
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

// Sets the input mode (pencil or bucket)
// Changes the appearance of the widgets to reflect this
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

// Creates a new snapshot level
// Snapshots are saved drawing states
// These are used as points to go back or forward,
// and do canvas drawing operations on top of them
// Instead of having a huge single set of drawing operations
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

// Clears the draw image
// Resets the snapshot level to 0
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

// Redraws the draw image
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

// Removes any redo levels above
// Makes current state the latest state
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

// Checks if the current snapshot levels has other snapshots above
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

// Checks if the current state has redo levels above
Hue.draw_image_check_redo = function()
{
	if(Hue.draw_image_current_snapshot.click_x.length !== Hue.draw_image_current_snapshot.sector_index || Hue.draw_image_has_levels_above())
	{
		Hue.draw_image_clean_redo(Hue.draw_image_current_snapshot.sector_index)
	}
}

// Gets image data from the canvas
Hue.draw_image_get_image_data = function()
{
	let context = Hue.draw_image_context
	let w = context.canvas.width
	let h = context.canvas.height
	let data = Hue.draw_image_context.getImageData(0, 0, w, h)

	return data
}

// Checks if a new snapshot should be created
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

// Register a new click to the current snapshot
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

// Turns the canvas drawing into a Blob and sends it to the server as an image upload
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
		Hue.show_upload_comment(blob, "image_upload")
		Hue.msg_draw_image.close()
	}, 'image/png', 0.95)
}

// Function wrapped in a confirm to be called from the GUI
Hue.clear_draw_image_func = function()
{
	Hue.clear_draw_image_state()
}

// Performs an undo in the draw image
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

// Performs a redo in the draw image
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

// Performs the draw image bucket fill algorithm
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

// Gets the index of a certain node in the canvas
Hue.get_canvas_node_index = function(data, node, w)
{
	return ((node[0] * w) + node[1]) * 4
}

// Gets the color of a certain node in the canvas
Hue.get_canvas_node_color = function(data, node, w)
{
	let index = Hue.get_canvas_node_index(data, node, w)

	return [data[index], data[index + 1], data[index + 2], data[index + 3]]
}

// Sets the color of a certain node in the canvas
Hue.set_canvas_node_color = function(data, node, values, w)
{
	let index = Hue.get_canvas_node_index(data, node, w)

	data[index] = values[0]
	data[index + 1] = values[1]
	data[index + 2] = values[2]
	data[index + 3] = values[3]

	return data
}

// Determines if two node colors should be considered equal
Hue.canvas_node_color_is_equal = function(a1, a2)
{
	let diff = 10
	let c1 = Math.abs(a1[0] - a2[0]) <= diff
	let c2 = Math.abs(a1[1] - a2[1]) <= diff
	let c3 = Math.abs(a1[2] - a2[2]) <= diff
	let alpha = Math.abs(a1[3] - a2[3]) <= diff

	return (c1 && c2 && c3 && alpha)
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

// Toggles between pencil and bucket mode
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

// Debounce timer for settings filter
Hue.settings_filter_timer = (function()
{
	let timer

	return function(type)
	{
		clearTimeout(timer)

		timer = setTimeout(function()
		{
			Hue.do_settings_filter(type, $(`#${type}_filter`).val())
		}, Hue.filter_delay)
	}
})()

// Filter a settings window
Hue.do_settings_filter = function(type, filter=false)
{
	if(filter)
	{
		filter = filter.trim()
	}

	let sfilter = filter ? filter : ''

	$(`#${type}_filter`).val(sfilter)

	let words

	if(filter)
	{
		let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
		words = lc_value.split(" ").filter(x => x.trim() !== "")
	}

	$(`#${type}_container .settings_top_level_item`).each(function()
	{
		if(filter)
		{
			let text = Hue.utilz.clean_string2($(this).text()).toLowerCase()
			
			if(words.some(word => text.includes(word)))
			{
				$(this).css("display", "block")
			}
			
			else
			{
				$(this).css("display", "none")
			}
		}
		
		else
		{
			$(this).css("display", "block")
		}
	})

	let current_category = Hue.get_selected_user_settings_category(type)
	let current_category_visible = true
	let active_category = false

	$(`#${type}_container .settings_category`).each(function()
	{
		let category = $(this).data("category")
		let count = $(this).find(".settings_top_level_item:not([style*='display: none'])").length

		if(count === 0)
		{
			if(category === current_category)
			{
				current_category_visible = false
			}

			$(`#settings_window_category_${category}_${type}`).css("display", "none")
		}
		
		else
		{
			if(!active_category)
			{
				active_category = category
			}

			$(`#settings_window_category_${category}_${type}`).css("display", "flex")
		}
	})

	let new_category = current_category_visible ? current_category : active_category

	if(new_category)
	{
		Hue.change_settings_window_category(new_category, type)
	}

	Hue.scroll_settings_window_to_top(type)
}

// Change the active category in a settings window
Hue.change_settings_window_category = function(category, type=false)
{
	type = type ? type : Hue.which_user_settings_window_is_open()

	if(!type)
	{
		return false
	}

	let element = $(`#settings_window_category_${category}_${type}`)[0]
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

// Check if maxers should be displayed or not
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

// Show the credits
Hue.show_credits = function()
{
	Hue.msg_credits.show(function()
	{
		if(!Hue.credits_audio)
		{
			Hue.credits_audio = new Audio()
			Hue.credits_audio.src = Hue.config.credits_audio_url
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

// Apply media percentages and positions
Hue.prepare_media_settings = function()
{
	Hue.apply_media_percentages()
	Hue.apply_media_positions()
}

// Sets tv and chat sliders to current state
Hue.set_media_sliders = function(type)
{
	Hue.set_tv_display_percentage(Hue[type].tv_display_percentage, type)
	Hue.set_chat_display_percentage(Hue[type].chat_display_percentage, type)
}

// Sends an emit to change the image to the previous one
Hue.image_prev = function()
{
	Hue.change_image_source("prev")
	Hue.msg_image_picker.close()
}

// Sends an emit to change the tv to the previous one
Hue.tv_prev = function()
{
	Hue.change_tv_source("prev")
	Hue.msg_tv_picker.close()
}

// Sends an emit to change the radio to the previous one
Hue.radio_prev = function()
{
	Hue.change_radio_source("prev")
	Hue.msg_radio_picker.close()
}

// Setups the user function names in the reactions box
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

// Show feedback to the user after creating a room
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

// Toggles between global and room settings windows when clicking the titlebar
Hue.toggle_settings_windows = function()
{
	let data = {}
	
	data["global_settings"] = function()
	{
		let category = Hue.get_selected_user_settings_category("global_settings")
		Hue.open_user_settings_category(category, "room_settings")

		let filter = $("#global_settings_filter").val()

		if(filter)
		{
			Hue.do_settings_filter("room_settings", filter)
		}
	}
	
	data["room_settings"] = function()
	{
		let category = Hue.get_selected_user_settings_category("room_settings")
		Hue.open_user_settings_category(category, "global_settings")

		let filter = $("#room_settings_filter").val()

		if(filter)
		{
			Hue.do_settings_filter("global_settings", filter)
		}
	}

	Hue.process_window_toggle(data)
}

// Toggles between public and visited room lists when clicking the titlebar
Hue.toggle_rooms_windows = function()
{
	let data = {}
	
	data["public_roomlist"] = function()
	{
		Hue.request_roomlist("", "visited_roomlist")
	}

	data["visited_roomlist"] = function()
	{
		Hue.request_roomlist("", "public_roomlist")
	}

	Hue.process_window_toggle(data)
}

// Toggles between media history windows when clicking the titlebar
Hue.toggle_media_history_windows = function()
{
	let data = {}
	
	data["image_history"] = function()
	{
		Hue.show_media_history("tv")
	}

	data["tv_history"] = function()
	{
		Hue.show_media_history("radio")
	}

	data["radio_history"] = function()
	{
		Hue.show_media_history("image")
	}

	Hue.process_window_toggle(data)
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

// Toggles between the chat search and highlights windows when clicking the titlebar
Hue.toggle_search_windows = function()
{
	let data = {}
	
	data["chat_search"] = function()
	{
		Hue.show_highlights()
	}

	data["highlights"] = function()
	{
		Hue.show_chat_search()
	}

	Hue.process_window_toggle(data)
}

// Function to apply the defined toggles between windows
Hue.process_window_toggle = function(data)
{
	let highest = Hue.msg_main_menu.highest_instance()
	let current = highest.options.id
	let next_func = data[current]

	if(!current || !next_func)
	{
		return false
	}

	Hue[`msg_${current}`].close(function()
	{
		next_func()
	})
}

// Only for superusers
// Sends a system restart signal that tells all clients to refresh
Hue.send_system_restart_signal = function()
{
	Hue.socket_emit("system_restart_signal", {})
}

// Creates the command aliases object
// Used in autocomplete and command execution
// Command aliases are custom commands based on normal commands
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

// Formats command alias to proper format upon save
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

	if(Hue.open_url_title)
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

	Hue.fix_horizontal_separators("open_url_container")
	
	Hue.open_url_source = args.source
	Hue.open_url_data = args.data
	Hue.open_url_media_type = args.media_type

	let title = Hue.get_limited_title(args.source)

	Hue.msg_open_url.set_title(title)
	Hue.msg_open_url.show()
}

// Returns 'images' if string is 'image'
Hue.fix_images_string = function(s)
{
	let r = s === "image" ? "images" : s
	return r
}

// Special console.info for debugging purposes
Hue.sdeb = function(s, show_date=false)
{
	if(show_date)
	{
		console.info(Hue.utilz.nice_date())
	}

	for(let line of `${s}`.split("\n"))
	{
		console.info(`>${line}<`)
	}

	console.info("-------------")
}

// Starts the execution of a chain of commands
// Used with chained commands like '/a && /b && /c'
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

// Setups the user function switch feature
// This allows user functions to change positions between each other
// For instance user function 2 can change position with user function 4
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

			if(o_user_function_name === Hue.config[`global_settings_default_user_function_${num}_name`])
			{
				o_user_function_name = Hue.config[`global_settings_default_user_function_${num2}_name`]
			}

			if(n_user_function_name === Hue.config[`global_settings_default_user_function_${num2}_name`])
			{
				n_user_function_name = Hue.config[`global_settings_default_user_function_${num}_name`]
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

// Generates an array of autocompletable words on demand
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

// Gives feedback on what type of command a command is
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

// Setup events for application close or refresh
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

// Modifies a setting manually instead of using the settings windows
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

// Handle the voice permission command
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

// Requests the admin activity list from the server
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

// Shows the admin activity list
Hue.show_admin_activity = function(messages)
{
	$("#admin_activity_container").html("")
	
	Hue.msg_admin_activity.show(function()
	{
		for(let message of messages)
		{
			let nice_date = Hue.utilz.nice_date(message.date)

			let el = $(`
			<div class='modal_item admin_activity_item dynamic_title' title='${nice_date}'>
				<div class='admin_activity_message'></div>
				<div class='admin_activity_date'></div>
			</div>`)

			el.find(".admin_activity_message").eq(0).text(`${message.data.username} ${message.data.content}`)
			el.find(".admin_activity_date").eq(0).text(nice_date)

			el.data("date", message.date)
			el.data("otitle", nice_date)

			$("#admin_activity_container").prepend(el)
		}

		$("#admin_activity_filter").val(Hue.admin_activity_filter_string)

		Hue.do_modal_filter()
	})
}

// Clears the chat and resets media change state
// Re-makes initial media setups for current media
Hue.clear_room = function(data)
{
	Hue.clear_chat()

	let first_image = Hue.images_changed = Hue.images_changed.slice(-1)
	let first_tv = Hue.tv_changed = Hue.tv_changed.slice(-1)
	let first_radio = Hue.radio_changed = Hue.radio_changed.slice(-1)

	Hue.loaded_image = undefined
	Hue.loaded_tv = undefined
	Hue.loaded_radio = undefined

	Hue.images_changed = []
	Hue.tv_changed = []
	Hue.radio_changed = []

	Hue.clear_change_state()

	Hue.setup_image("change", first_image)
	Hue.setup_tv("change", first_tv)
	Hue.setup_radio("change", first_radio)
}

// Resets media change related variables
Hue.clear_change_state = function()
{
	Hue.last_image_source = false
	Hue.last_tv_source = false
	Hue.last_tv_type = false
	Hue.last_radio_source = false
	Hue.last_radio_type = false
}

// A debugging function
Hue.fillet = function(n)
{
	for(let i=0; i<n; i++)
	{
		Hue.feedback("Some feedback")
	}
}

// Initial change for current media
Hue.start_active_media = function()
{
	Hue.change({type:"image"})
	Hue.change({type:"tv"})
	Hue.change({type:"radio"})

	Hue.first_media_change = true
}

// Determines if the input is scrolled or not
Hue.input_is_scrolled = function()
{
	let el = $("#input")[0]
	return el.clientHeight < el.scrollHeight
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

// Sets the hover titles for the setttings widgets
Hue.set_user_settings_titles = function()
{
	for(let setting in Hue.user_settings)
	{
		$(`#global_settings_${setting}`).attr("title", setting)
		$(`#room_settings_${setting}`).attr("title", setting)
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

			Hue.maxer_wheel_timer(Hue.increase_media_percentage)
		}

		else if(direction === 'down')
		{
			if(maximized)
			{
				Hue.do_chat_size_change(90)	
				Hue.show_media_items()
				return
			}

			Hue.maxer_wheel_timer(Hue.decrease_media_percentage)
		}
	}

	$("#media_image_maxer")[0].addEventListener("mousedown", function(e)
	{
		e.preventDefault()
	})

	$("#media_image_maxer")[0].addEventListener("dblclick", function(e)
	{
		Hue.maximize_images()
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
			Hue.set_default_media_size()
			Hue.show_media_items()
		}
	})
}

// Sets the tv display percentage to default
Hue.set_default_tv_size = function()
{
	Hue.do_media_tv_size_change(Hue.config.global_settings_default_tv_display_percentage)	
}

// Sets the chat display percentage to default
Hue.set_default_media_size = function()
{
	Hue.do_chat_size_change(Hue.config.global_settings_default_chat_display_percentage)
}

// Increases the tv display percentage
Hue.increase_tv_percentage = function()
{
	let size = Hue.get_setting("tv_display_percentage")
	
	size += 10
	size = Hue.utilz.round2(size, 10)

	Hue.do_media_tv_size_change(size)
}

// Decreases the tv display percentage
Hue.decrease_tv_percentage = function()
{
	let size = Hue.get_setting("tv_display_percentage")
	
	size -= 10
	size = Hue.utilz.round2(size, 10)

	Hue.do_media_tv_size_change(size)
}

// If the image or tv is maximized it unmaximizes it so both are shown
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

// Does the change of tv display percentage
Hue.do_media_tv_size_change = function(size, notify=true)
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
		Hue.enable_setting_override("tv_display_percentage")
		Hue.modify_setting(`tv_display_percentage ${size}`, false)
	}

	if(notify)
	{
		Hue.notify_media_tv_size_change(size)
	}
}

// Shows the new tv display percentage in the infotip
Hue.notify_media_tv_size_change = function(size)
{
	let info

	if(size === Hue.config.global_settings_default_tv_display_percentage)
	{
		info = " (Default)"
	}

	else
	{
		info = ""
	}

	Hue.show_infotip(`TV Size: ${size}%${info}`)
}

// Gradually increases the chat display percentage
Hue.increase_media_percentage = function()
{
	let size = Hue.get_setting("chat_display_percentage")
	size += 10
	size = Hue.utilz.round2(size, 10)
	Hue.do_chat_size_change(size)
}

// Gradually decreases the chat display percentage
Hue.decrease_media_percentage = function()
{
	let size = Hue.get_setting("chat_display_percentage")
	size -= 10
	size = Hue.utilz.round2(size, 10)
	Hue.do_chat_size_change(size)
}

// Changes that chat font size
Hue.do_chat_size_change = function(size)
{
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

// Shows the infotip
// This is a black box in the corner meant for quick temporary feedback
Hue.show_infotip = function(s)
{
	$("#infotip").text(s)
	$("#infotip_container").css("display", "block")
	Hue.infotip_timer()
}

// Hides the infotip
Hue.hide_infotip = function()
{
	$("#infotip_container").css("display", "none")
}

// Debounce timer to hide the infotip
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

// Changes the background effect
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

// Announces background effect changes
Hue.announce_background_effect_change = function(data)
{
	Hue.public_feedback(`${data.username} changed the background effect to ${data.effect}`,
	{
		username: data.username,
		open_profile: true
	})

	Hue.set_background_effect(data.effect)
}

// Overrides a global setting by triggering a click on the room setting overrider
Hue.enable_setting_override = function(setting)
{
	if(Hue.room_settings[`${setting}_override`])
	{
		return false
	}

	$(`#room_settings_${setting}_overrider`).click()
}

// Wraps a function to be debugged
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

// Wraps all Hue functions for debugging purposes
// This only happens if Hue.debug_functions is true
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

// Requests the admin list
Hue.request_admin_list = function()
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("get_admin_list", {})
}

// Shows the admin list
Hue.show_admin_list = function(data)
{
	let s = $("<div id='admin_list_container' class='grid_column_center'></div>")

	data.list.sort(Hue.compare_userlist)

	for(let user of data.list)
	{
		let hs = "<div class='flex_row_center'><div class='admin_list_username'></div>&nbsp;&nbsp;<div class='admin_list_role'></div></div>"
		let h = $(`<div class='admin_list_item pointer action'>${hs}</div>`)

		h.find(".admin_list_username").eq(0).text(user.username)
		h.find(".admin_list_role").eq(0).text(`(${Hue.get_pretty_role_name(user.role)})`)

		h.click(function()
		{
			Hue.show_profile(user.username)
		})

		s.append(h)
	}

	Hue.msg_info2.show([`Admin List (${data.list.length})`, s[0]], function()
	{
		Hue.admin_list_open = true
	})
}

// Requests the ban list
Hue.request_ban_list = function()
{
	if(!Hue.is_admin_or_op(Hue.role))
	{
		Hue.not_an_op()
		return false
	}

	Hue.socket_emit("get_ban_list", {})
}

// Shows the ban list
Hue.show_ban_list = function(data)
{
	let s = $("<div id='ban_list_container' class='grid_column_center'></div>")

	for(let user of data.list)
	{
		let hs = "<div class='flex_row_center'><div class='ban_list_username' title='Click To Unban'></div></div>"
		let h = $(`<div class='ban_list_item pointer action'>${hs}</div>`)

		h.find(".ban_list_username").eq(0).text(user.username)

		h.click(function()
		{
			if(confirm(`Are you sure you want to unban ${user.username}`))
			{
				Hue.unban(user.username)
			}
		})

		s.append(h)
	}

	Hue.msg_info2.show([`Ban List (${data.list.length})`, s[0]], function()
	{
		Hue.ban_list_open = true
	})
}

// Requests the access log
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

// Shows the access log
Hue.show_access_log = function(messages)
{
	$("#access_log_container").html("")
	
	Hue.msg_access_log.show(function()
	{
		for(let message of messages)
		{
			let nice_date = Hue.utilz.nice_date(message.date)

			let el = $(`
			<div class='modal_item access_log_item dynamic_title' title='${nice_date}'>
				<div class='access_log_message'></div>
				<div class='access_log_date'></div>
			</div>`)

			el.find(".access_log_message").eq(0).text(`${message.data.username} ${message.data.content}`)
			el.find(".access_log_date").eq(0).text(nice_date)

			el.data("date", message.date)
			el.data("otitle", nice_date)

			$("#access_log_container").prepend(el)
		}

		$("#access_log_filter").val(Hue.access_log_filter_string)

		Hue.do_modal_filter()
	})
}

// Enables the lockscreen if the screen is locked in room state
Hue.check_screen_lock = function()
{
	if(Hue.room_state.screen_locked)
	{
		Hue.lock_screen(false)
	}
}

// Sends an activity signal to the server
// This is used to know which users might be active
// This is used to display users in the activity bar
Hue.trigger_activity = function()
{
	Hue.socket_emit("activity_trigger", {})
}

// Sorts a user list by activity date
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

// Sets the initial state of the activity bar
// Setups events for the activity bar
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
	}, Hue.config.activity_bar_interval)

	setInterval(function()
	{
		if(Hue.app_focused)
		{
			Hue.trigger_activity()
		}
	}, Hue.config.activity_bar_trigger_interval)

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

// Checks if the activity list has changed and the activity bar must be updated
Hue.check_activity_bar = function(update=true)
{
	if(Hue.activity_list.length === 0)
	{
		return false
	}

	let d = Date.now() - Hue.config.max_activity_bar_delay
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

// Toggles the visibility of the activity bar
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

// Shows the activity bar
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

// Hides the activity bar
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

// Updates the activity bar
// If items are still in the list they are not removed
// This is to keep states like profile image rotation from being interrupted
Hue.update_activity_bar = function()
{
	if(!Hue.get_setting("activity_bar"))
	{
		return false
	}

	let c = $("#activity_bar_content")

	if(Hue.activity_list.length === 0)
	{
		$("#activity_bar_no_activity").css("display", "block")
		return false
	}

	$("#activity_bar_no_activity").css("display", "none")

	let usernames_included = []
	
	$(".activity_bar_item").each(function()
	{
		let username = $(this).data("username")
		let user = Hue.get_user_by_username(username)
		
		if(user && Hue.activity_list.some(item => item.username === username))
		{
			usernames_included.push(username)
		}
		
		else
		{
			$(this).remove()
		}
	})

	if(Hue.activity_list.length > usernames_included.length)
	{
		for(let item of Hue.activity_list)
		{
			if(usernames_included.includes(item.username))
			{
				continue
			}

			let user = Hue.get_user_by_username(item.username)

			if(user)
			{
				let pi = user.profile_image || Hue.config.default_profile_image_url

				let h = $(`
				<div class='activity_bar_item'>
					<div class='activity_bar_image_container round_image_container action4'>
						<img class='activity_bar_image' src='${pi}'>
					</div>
					<div class='activity_bar_text'></div>
				</div>`)

				let text_el = h.find(".activity_bar_text").eq(0)
				let img_el = h.find(".activity_bar_image").eq(0)

				img_el.on("error", function()
				{
					if($(this).attr("src") !== Hue.config.default_profile_image_url)
					{
						$(this).attr("src", Hue.config.default_profile_image_url)
					}
				})

				text_el.text(user.username)

				h.data("username", user.username)
				h.attr("title", item.username)

				c.append(h)
			}
		}
	}
}

// Pushes a user to the activity list and updates the activity bar
Hue.push_to_activity_bar = function(uname, date)
{
	let user = Hue.get_user_by_username(uname)

	if(!user || !Hue.check_permission(user.role, "chat"))
	{
		return false
	}

	let d = Date.now() - Hue.config.max_activity_bar_delay

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

	if(Hue.activity_list.length > Hue.config.max_activity_bar_items)
	{
		Hue.activity_list.pop()
	}

	Hue.check_activity_bar(false)

	if(Hue.started)
	{
		Hue.update_activity_bar()
	}
}

// Gets an activity bar item by username
Hue.get_activity_bar_item_by_username = function(username)
{
	let item = false

	$(".activity_bar_item").each(function()
	{
		if($(this).data("username") === username)
		{
			item = this
			return false
		}
	})

	return item
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
	if(data.type === "chat")
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

	else if(data.type === "image" || data.type === "tv" || data.type === "radio")
	{
		$(".message.announcement").each(function()
		{
			if($(this).data("item_id") == data.id)
			{
				Hue.process_remove_announcement(this)
				return false
			}
		})
	}

	Hue.goto_bottom(false, false)
}

// Removes a chat message from the chat, when trigger through the context menu
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
		let id = $(message).data("item_id")
		Hue.remove_item_from_media_changed(type.replace("_change", ""), id)
	}

	$(`.message_id_${message_id}`).each(function()
	{
		$(this).remove()
	})

	Hue.check_media_menu_loaded_media()
}

// Setup for the tv iframe
Hue.setup_iframe_video = function()
{
	$("#media_iframe_poster").click(function()
	{
		Hue.play_tv()
	})
}

// Loads the Tone library and starts the synth
Hue.start_synth = async function(n)
{
	if(Hue.tone_loading)
	{
		return false
	}

	Hue.tone_loading = true
	
	await Hue.load_script("/static/js/Tone.js")
	
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

	Hue.play_synth_key(n)
}

// Setups synth events
Hue.setup_synth = function()
{
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
			Hue.play_speech(key)
		}
	})

	$("#synth_key_button_volume").click(function()
	{
		Hue.set_synth_muted()
	})

	$("#synth_key_button_volume").on("auxclick", function(e)
	{
		if(e.which === 2)
		{
			Hue.open_user_settings_category("synth")
		}
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
			Hue.hide_synth(true)
		}
	})

	$(".synth_key").each(function()
	{
		let key = $(this).attr("id").replace("synth_key_", "")
		Hue.set_synth_key_title(key)
	})

	Hue.set_synth_muted(Hue.room_state.synth_muted)
}

// Sets the synth to muted or unmuted
// Updates the volume icon to reflect changes
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

// Shows the synth 
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

// Hides the synth
Hue.hide_synth = function(force=false)
{
	Hue.mouse_on_synth = false

	if(!force && Hue.synth_voice_input_focused)
	{
		return false
	}
	
	clearTimeout(Hue.synth_timeout)

	let delay = Hue.synth_timeout_delay

	if(force)
	{
		delay = 0
	}

	Hue.synth_timeout_2 = setTimeout(function()
	{
		$("#synth_content_container").css("display", "none")
		
		Hue.clear_synth_voice()
		Hue.synth_open = false
	}, delay)
}

// Sends a synth key to others
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

// Plays a synth key
Hue.play_synth_key = function(n)
{
	let key = Hue.utilz.synth_notes[n - 1]
	
	if(key)
	{
		if(Hue.synth === undefined)
		{
			Hue.start_synth(n)
			return false
		}

		Hue.synth.triggerAttackRelease(key, 0.1)
	}
}

// Plays a received synth key
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

// Adds a user to the synth recent users list
// This list is used to show a list of recent synth users, 
// when hovering the volume icon
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

	if(Hue.synth_recent_users.length > Hue.config.synth_max_recent_users)
	{
		Hue.synth_recent_users = Hue.synth_recent_users.slice(0, Hue.config.synth_max_recent_users)
		changed = true
	}

	if(changed)
	{
		let s = Hue.synth_recent_users.map(x => x.username).join(", ")
		$("#synth_key_button_volume").attr("title", s)
	}
}

// Sends a synth voice string to others
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

	if(text.length === 0 || text.length > Hue.config.synth_max_voice_text)
	{
		return false
	}

	Hue.clear_synth_voice()
	Hue.socket_emit("send_synth_voice", {text:text})
}

// Plays a received synth voice string
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

// Speaks a string message through speech synthesis
Hue.play_synth_voice = function(text, username, local=false)
{
	let speech = new SpeechSynthesisUtterance(text)

	if(!local)
	{
		speech.onstart = function()
		{
			Hue.show_voice_box(username, text)
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

// Empties the synth voice input
Hue.clear_synth_voice = function()
{
	$("#synth_voice_input").val("")
}

// Empties the speech synthesis queue
Hue.clear_synth_voice_queue = function()
{
	Hue.synth_voice.cancel()
}

// Prints an informational console message
Hue.show_console_message = function()
{
	let s = "🤔 Want to work with us? It's pretty much 99.99% risks, some negligible fraction AI, a couple bureaucracies to keep people minimally pissed off, and a whole lot of creativity."
	let style = "font-size:1.4rem"
	
	console.info(`%c${s}`, style)
}

// Shows a box with the username and message of the  current speech playing
Hue.show_voice_box = function(username, text)
{
	let h = $(`
	<div class='recent_voice_box_item'>
		<i class='fa fa-volume-up'></i>&nbsp;&nbsp;
		<div class='voice_box_username'></div>&nbsp;&nbsp;
		<div class='voice_box_message'></div>
	</div>`)

	let uname = h.find(".voice_box_username").eq(0)
	uname.text(`${username}:`)

	let message = h.find(".voice_box_message").eq(0)
	message.text(text)

	$("#recent_voice_box_content").html(h)
	$("#recent_voice_box").css("display", "flex")
}

// Hides the box with the username and message of the  current speech playing
Hue.hide_voice_box = function()
{
	$("#recent_voice_box").css("display", "none")
}

// Appends a linebreak to the input
Hue.add_linebreak_to_input = function()
{
	Hue.add_to_input("\n")
	Hue.scroll_input_to_bottom()
}

// Scrolls input to bottom when it's overflowed
Hue.scroll_input_to_bottom = function()
{
	let input = $("#input")[0]
	input.scrollTop = input.scrollHeight
}

// Toggles between the light and dark lockscreen mode
Hue.toggle_lockscreen_lights_off = function()
{
	Hue.room_state.lockscreen_lights_off = !Hue.room_state.lockscreen_lights_off
	Hue.process_lockscreen_lights_off()
	Hue.save_room_state()
}

// Sets lockscreen mode based on current state
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

// Enables dark lockscreen mode
Hue.lockscreen_turn_lights_off = function()
{
	$("#lockscreen_body").addClass("black_background_color")
	$("#lockscreen_title_menu").addClass("black_background_color")
	$("#lockscreen_principal").addClass("grey_font_color")
	$("#lockscreen_lights_off_button").addClass("grey_font_color")
	$("#lockscreen_icon_menu").addClass("grey_background_color_parent")
	$("#lockscreen_lights_off_button").text("Turn Lights On")
	$("#lockscreen_clock").addClass("grey_font_color")
}

// Enables light lockscreen mode
Hue.lockscreen_turn_lights_on = function()
{
	$("#lockscreen_body").removeClass("black_background_color")
	$("#lockscreen_title_menu").removeClass("black_background_color")	
	$("#lockscreen_lights_off_button").text("Turn Lights Off")
	$("#lockscreen_principal").removeClass("grey_font_color")
	$("#lockscreen_clock").removeClass("grey_font_color")
	$("#lockscreen_lights_off_button").removeClass("grey_font_color")
	$("#lockscreen_icon_menu").removeClass("grey_background_color_parent")
}

// Setups image expansions when clicked
// When an image in the chat is clicked the image is shown full sized in a window
Hue.setup_expand_image = function()
{
	let img = $("#expand_image")

	img[0].addEventListener("load", function()
	{
		img.css("display", "block")
		$("#expand_image_spinner").css("display", "none")
	})

	img.on("error", function()
	{
		$("#expand_image_spinner").css("display", "none")
		$("#expand_image").css("display", "none")
		$("#expand_image_error").css("display", "block")
	})
}

// Shows a window with an image at full size
Hue.expand_image = function(src)
{
	$("#expand_image").css("display", "none")
	$("#expand_image_spinner").css("display", "block")
	$("#expand_image_error").css("display", "none")
	$("#expand_image").attr("src", src)
	Hue.msg_expand_image.show()
}

// Hides the expand image window
Hue.hide_expand_image = function()
{
	Hue.msg_expand_image.close()
}

// Setups localStorage events
Hue.setup_local_storage = function()
{
	window.addEventListener("storage", function(e)
	{
		if(e.key !== Hue.ls_global_settings && e.key !== Hue.ls_room_settings)
		{
			return false
		}

		let obj

		try
		{
			obj = JSON.parse(e.newValue)
		}

		catch(err)
		{
			return false
		}

		if(Hue.utilz.is_empty_object(obj))
		{
			return false
		}

		if(e.key === Hue.ls_global_settings)
		{
			Hue.reset_settings("global_settings", false)
		}

		else if(e.key === Hue.ls_room_settings)
		{
			if(e.url === document.location.href)
			{
				Hue.reset_settings("room_settings", false)
			}
		}
	}, false)
}

// Loads Vimeo script and creates player
Hue.start_vimeo = async function()
{
	if(Hue.vimeo_loaded)
	{
		if(Hue.vimeo_video_player_requested && Hue.vimeo_video_player === undefined)
		{
			Hue.create_vimeo_video_player()
		}

		return false
	}
	if(Hue.vimeo_loading)
	{
		return false
	}

	Hue.vimeo_loading = true

	await Hue.load_script("/static/js/vimeo.player.min.js")

	Hue.vimeo_loaded = true

	if(Hue.vimeo_video_player_requested)
	{
		Hue.create_vimeo_video_player()
	}
}

// Create tv Vimeo player
Hue.create_vimeo_video_player = function()
{
	Hue.vimeo_video_player_requested = false

	let options = 
	{
		id: 59777392,
		width: 640,
		loop: false
	}

	let video_player = new Vimeo.Player("media_vimeo_video_container", options)

	video_player.ready()

	.then(()=>
	{
		Hue.vimeo_video_player = video_player

		$("#media_vimeo_video_container").find("iframe").eq(0).attr("id", "media_vimeo_video").addClass("video_frame")

		if(Hue.vimeo_video_player_request)
		{
			Hue.change(Hue.vimeo_video_player_request)
			Hue.vimeo_video_player_request = false
		}
	})
}

// Gets the ignored usernames list
Hue.get_ignored_usernames_list = function()
{
	let list = Hue.get_setting("ignored_usernames").split("\n")

	if(list.length === 1 && !list[0])
	{
		list = []
	}

	Hue.ignored_usernames_list =  list
}

// Gets the list of users from whom the user accepts remote command execution
// This allows a user to whitelist other users so they can execute commands for them through whispers
// This is dangerous and care should be taken to ensure this list is not exploited
Hue.get_accept_commands_from_list = function()
{
	let list = Hue.get_setting("accept_commands_from").split("\n")

	if(list.length === 1 && !list[0])
	{
		list = []
	}

	Hue.accept_commands_from_list = list
}

// Checks if a remote command includes a forbidden critical command
Hue.includes_critical_command = function(username, message, announce=true)
{
	let commands = 
	[
		"/js",
		"/js2",
		"/changeusername",
		"/changepassword",
		"/changeemail",
		"/systembroadcast",
		"/systemrestart",
		"/annex"
	]

	let split = message.split(" ")

	for(let cmd of split)
	{
		let cmd2

		if(Hue.is_command(cmd))
		{
			cmd2 = cmd.toLowerCase().split('').sort().join('')
		}

		else
		{
			continue
		}

		for(let command of commands)
		{
			if(Hue.oi_equals(cmd2, command))
			{
				if(announce)
				{
					Hue.feedback(`${username} attempted to run "${command}" in your client`)
				}

				return true
			}
		}
	}

	return false
}

// Executes a remote command received through a whisper
// This only gets executed if the sender is whitelisted,
// for remote command execution
Hue.execute_whisper_command = function(username, message)
{
	if(Hue.includes_critical_command(username, message))
	{
		return false
	}

	Hue.feedback(`${username} executed "${message}" in your client`)

	Hue.process_message(
	{
		message: message,
		to_history: false,
		clr_input: false
	})
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

// Locally loads next item of its respective media changed list
Hue.media_load_next = function(type, just_check=false)
{
	let type2 = type

	if(type === "images")
	{
		type2 = "image"
	}

	if(Hue[`${type}_changed`].length < 2)
	{
		return false
	}

	let index = Hue[`${type}_changed`].indexOf(Hue[`loaded_${type2}`])

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
	Hue.change({type:type2, item:item, force:true})
	Hue[`toggle_lock_${type}`](true)
}

// Locally loads previous item of its respective media changed list
Hue.media_load_previous = function(type, just_check=false)
{
	let type2 = type

	if(type === "images")
	{
		type2 = "image"
	}

	if(Hue[`${type}_changed`].length < 2)
	{
		return false
	}

	let index = Hue[`${type}_changed`].indexOf(Hue[`loaded_${type2}`])

	if(index <= 0)
	{
		return false
	}

	if(just_check)
	{
		return true
	}

	let item = Hue[`${type}_changed`][index - 1]
	Hue.change({type:type2, item:item, force:true})
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

// Shows a system announcement
// Used for ads
Hue.show_announcement = function(data, date=Date.now())
{
	Hue.public_feedback(data.message, 
	{
		brk: "<i class='icon2c fa fa-star'></i>",
		date: date,
		preview_image: true,
		link_title: data.link_title,
		link_image: data.link_image,
		link_url: data.link_url
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

// Gets a 'time ago' string from a given date
Hue.get_timeago = function(date)
{
	return Hue.utilz.capitalize_words(timeago.format(date))
}

// Updates hover title of synth keys using speech settings
Hue.set_synth_key_title = function(key)
{
	$(`#synth_key_${key}`).attr("title", Hue.get_setting(`speech_${key}`))
}

// Plays saved speech
Hue.play_speech = function(key)
{
	if(isNaN(key))
	{
		return false
	}

	key = parseInt(key)

	if(key < 0 || key > Hue.utilz.synth_notes.length)
	{
		return false
	}

	let speech = Hue.get_setting(`speech_${key}`)

	Hue.send_synth_voice(speech)
}

// Opens a settings window and goes to a specific category
Hue.open_user_settings_category = function(category, type="global_settings")
{
	Hue[`show_${type}`]()
	Hue.change_settings_window_category(category)
}

// Goes to a specific item in a settings window
// Opens the toggler if it has one
Hue.go_to_user_settings_item = function(setting)
{
	let type = Hue.which_user_settings_window_is_open()

	$(`#${type}_container .settings_item`).each(function()
	{
		if($(this).data("setting") === setting)
		{
			let toggler_container = $(this).closest(".toggler_main_container")
			let toggler = toggler_container.find(".toggler").eq(0)

			if(toggler.length === 0)
			{
				toggler_container = $(this).find(".toggler_main_container").eq(0)
				toggler = toggler_container.find(".toggler").eq(0)
			}

			if(toggler.length > 0)
			{
				Hue.set_toggler(type, toggler, "open")
				toggler_container[0].scrollIntoView({block:"center"})
			}

			else
			{
				this.scrollIntoView({block:"center"})
			}

			return false
		}
	})
}

// Checks which type of settings window is open
Hue.which_user_settings_window_is_open = function()
{
	let type = false

	if(Hue.msg_global_settings.is_highest())
	{
		type = "global_settings"
	}

	else if(Hue.msg_room_settings.is_highest())
	{
		type = "room_settings"
	}

	return type
}

// Gets the selected settings window category
Hue.get_selected_user_settings_category = function(type)
{
	let category = false

	$(`#settings_window_left_${type} .settings_window_category`).each(function()
	{
		let selected = $(this).data("selected_category")

		if(selected)
		{
			category = $(this).data("category")
			return false
		}
	})

	return category
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

// Shows the window to add a comment to an image upload
Hue.show_upload_comment = function(file, type)
{
	$("#upload_comment_image_feedback").css("display", "none")
	$("#upload_comment_image_preview").css("display", "inline-block")
	
	let reader = new FileReader()

	reader.onload = function(e) 
	{
		Hue.upload_comment_file = file
		Hue.upload_comment_type = type

		$("#upload_comment_image_preview").attr("src", e.target.result)

		Hue.msg_upload_comment.set_title(`${Hue.utilz.slice_string_end(file.name, 20)} (${Hue.utilz.get_size_string(file.size, 2)})`)

		$("#Msg-titlebar-upload_comment").attr("title", file.name)
		
		Hue.msg_upload_comment.show(function()
		{
			$("#upload_comment_submit").click(function()
			{
				Hue.process_upload_comment()
			})

			$("#upload_comment_input").focus()
			Hue.scroll_modal_to_bottom("upload_comment")
		})
	}

	reader.readAsDataURL(file)
}

// Setups the upload image comment window
Hue.setup_upload_comment = function()
{
	let img = $("#upload_comment_image_preview")

	img.on("error", function()
	{
		$(this).css("display", "none")
		$("#upload_comment_image_feedback").css("display", "inline")
	})
}

// Submits the upload image comment window
// Uploads the file and the optional comment
Hue.process_upload_comment = function()
{
	if(!Hue.upload_comment_open)
	{
		return false
	}

	Hue.upload_comment_open = false
	Hue.msg_upload_comment.close()

	let file = Hue.upload_comment_file
	let type = Hue.upload_comment_type
	let comment = Hue.utilz.clean_string2($("#upload_comment_input").val())

	if(comment.length > Hue.config.safe_limit_4)
	{
		return false
	}

	Hue.upload_file({file:file, action:type, comment:comment})
}

// Hides the image upload comment window
Hue.cancel_upload_comment = function()
{
	Hue.upload_comment_open = false
	Hue.msg_upload_comment.close()
}

// Removes and item from a media changed array
Hue.remove_item_from_media_changed = function(type, id)
{
	let type2 = type

	if(type === "image")
	{
		type2 = "images"
	}

	Hue[`${type2}_changed`] = Hue[`${type2}_changed`].filter(x => x.id !== id)
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

// Scrolls a modal window to the top
Hue.scroll_modal_to_top = function(id)
{
	$(`#Msg-content-container-${id}`).scrollTop(0)
}

// Scrolls a modal window to the bottom
Hue.scroll_modal_to_bottom = function(id)
{
	let container = $(`#Msg-content-container-${id}`)[0]
	container.scrollTop = container.scrollHeight
}

// Scrolls a settings window to the top
Hue.scroll_settings_window_to_top = function(type)
{
	$(`#settings_window_right_${type}`).scrollTop(0)
}

// Returns a list of usernames matched by a string
// It splits and joins the string until a user in the user list matches
// Or returns an empty array
Hue.get_matching_usernames = function(s)
{
	let user = Hue.get_user_by_username(s)

	if(user)
	{
		return [user.username]
	}
	
	let split = s.split(" ")
	let uname = split[0]
	let matches = []

	for(let i=0; i<split.length; i++)
	{
		if(i > 0)
		{
			uname = `${uname} ${split[i]}`
		}

		if(Hue.usernames.includes(uname))
		{
			matches.push(uname)
		}
	}

	return matches
}

// Removes empty lines
// Trims the string if it only has 1 line
Hue.clean_multiline = function(message)
{
	let message_split = message.split("\n")
	let num_lines = message_split.length

	if(num_lines === 1)
	{
		message = message.trim()
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

		message = new_lines.join("\n")
	}

	return message
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
			if(Hue.utilz.is_url(text))
			{
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

				Hue.fix_horizontal_separators("handle_url_container")

				let title = Hue.get_limited_title(text)

				Hue.handled_url = text
				Hue.msg_handle_url.set_title(title)
				Hue.msg_handle_url.show()
			}
		}
	})

	$("#handle_url_link").click(function()
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
}

// Shows the necessary horizontal separators between items
// Hides unneeded separators
// This is to ensure proper separations like 'a | b | c' 
// And not 'a || b | c |'
Hue.fix_horizontal_separators = function(container_id)
{
	let n = 0
	let ok = false
	let container = $(`#${container_id}`)
	let num_visible = container.find(".horizontal_item:not([style*='display: none'])").length

	container.find("div").each(function()
	{
		if($(this).hasClass("horizontal_separator"))
		{
			if(ok)
			{
				$(this).css("display", "inline-block")
				ok = false
			}
			
			else
			{
				$(this).css("display", "none")
			}
		}

		else
		{
			if($(this).css("display") !== "none")
			{
				n += 1

				if(n < num_visible)
				{
					ok = true
				}

				else
				{
					ok = false
				}
			}
		}
	})
}

// Determines what to do after a 'close all modals' trigger 
// If it comes from a modal it closes all modals
// If it comes from a popup it closes all popups
Hue.process_msg_close_button = function(button)
{
	let container = $(button).closest(".Msg-container")

	if(container.hasClass("Msg-container-modal"))
	{
		Hue.close_all_modals()
	}

	else if(container.hasClass("Msg-container-popup"))
	{
		Hue.close_all_popups()
	}
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

// What to do after pushing a new media changed item
Hue.after_push_media_change = function(type, data)
{
	if(Hue.show_media_history_type)
	{
		Hue.prepend_to_media_history(data.message_id)
	}
}

// Gets a limited version of a title
// If it exceeds the limit it crops it and adds a '...'
Hue.get_limited_title = function(src)
{
	let title

	if(src.length > Hue.url_title_max_length)
	{
		title = `${src.substring(0, Hue.url_title_max_length)}...`
	}

	else
	{
		title = src
	}

	return title
}

// Makes the user functions controls for the settings windows
Hue.make_settings_user_functions = function(type)
{
	let s = ""

	for(let i=1; i<Hue.user_functions.length+1; i++)
	{
		let o = "<option value='0' selected>----</option>"

		for(let j=1; j<Hue.user_functions.length+1; j++)
		{
			if(i !== j)
			{
				o += `<option value='${j}'>Switch With ${j}</option>`
			}
		}

		s += Hue.template_settings_user_function({number:i, type:type, options:o})
	}

	return s
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

// Handles the /input command
Hue.input_command = function(arg)
{
	arg = arg.replace(/\s\/endinput/gi, "")
	Hue.change_input(arg)
}

// Setups whispers click events
Hue.setup_whispers_click = function(content, username)
{
	$(content).find(".whisper_link").each(function()
	{
		$(this).click(function()
		{
			Hue.process_write_whisper(`${username} > ${$(this).data("whisper")}`, false)
		})
	})
}

// Triggers the browser notifications permission prompt if not yet active
Hue.request_notifications_permission = function()
{
	if(Hue.has_notifications_permission())
	{
		Hue.msg_info.show("Notifications are already enabled")
		return false
	}

	Notification.requestPermission()
}

// Checks if browser notification permission is already granted
Hue.has_notifications_permission = function()
{
	return Notification.permission === "granted"
}

// Shows a browser notification
Hue.show_notification = function(s)
{
	if(!Hue.has_notifications_permission())
	{
		return false
	}

	let n = new Notification(s)

	n.addEventListener("click", function(e)
	{
		window.focus()
		e.target.close()
	})
}

// Adds an indicator in the lockscreen if it's enabled and there's activity
Hue.check_lockscreen_activity = function()
{
	if(Hue.room_state.screen_locked)
	{
		if(!$("#lockscreen_title_info").text())
		{
			$("#lockscreen_title_info").text("(New Activity)")
		}
	}
}

// Shows a browser notification alerting of a highlight
Hue.show_highlight_notification = function()
{
	if(!Hue.has_notifications_permission())
	{
		return false
	}
	
	if(Hue.afk)
	{
		if(Hue.get_setting("afk_disable_notifications"))
		{
			return false
		}
	}

	Hue.show_notification(`New highlight in ${Hue.room_name.substring(0, 40)}`)
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

// Loads a Javascript file from a specified URL
// Resolves the promise when the <script> is loaded
Hue.load_script = function(source)
{
	if(!Hue.load_scripts)
	{
		return false
	}

	console.info(`Loading script: ${source}`)

	return new Promise((resolve, reject) => 
	{
		const script = document.createElement('script')
		document.body.appendChild(script)
		script.onload = resolve
		script.onerror = reject
		script.async = true
		script.src = source
	})
}

// Centralized function to request media player creation
// For instance, if there's a YouTube tv change,
// if the YouTube player is not created, this function gets triggered
// Then the respective script gets loaded if it's not loaded yet, 
// and the player gets created
// A change event is called after player creation
Hue.request_media = function(player, args)
{
	Hue[`${player}_requested`] = true
	Hue[`${player}_request`] = args

	if(player === "youtube_player" || player === "youtube_video_player")
	{
		Hue.load_youtube()
	}

	if(player === "soundcloud_player" || player === "soundcloud_video_player")
	{
		Hue.start_soundcloud()
	}

	if(player === "twitch_video_player")
	{
		Hue.start_twitch()
	}

	if(player === "vimeo_video_player")
	{
		Hue.start_vimeo()
	}
}

// Does a math calculation using math.js
// Includes controls to make a calculation public
Hue.do_math_calculation = async function(arg)
{
	if(Hue.math === undefined)
	{
		if(Hue.math_loading)
		{
			return false
		}

		Hue.math_loading = true

		await Hue.load_script("/static/js/math.min.js")

		Hue.math = math.create(
		{
			number: 'BigNumber',
			precision: 64
		})
	}

	let r

	try
	{
		r = Hue.math.round(Hue.math.eval(arg), Hue.calc_round_places).toString()
	}

	catch(err)
	{
		Hue.feedback("Error")
		return false
	}

	let s = `${arg} = **${r}**`
	let id = `calc_${Date.now()}`

	let f = function()
	{
		Hue.process_message({message:s, to_history:false, callback:function(success)
		{
			if(success)
			{
				$(`#${id}`).remove()
				Hue.goto_bottom(false, false)
			}
		}})
	}

	Hue.feedback(s, 
	{
		comment: "Make Public", 
		comment_icon: false, 
		comment_onclick: f, 
		replace_markdown: true,
		id: id
	})
}

// Starts and setups radio and tv sliders in the media menu
Hue.start_media_menu_sliders = function()
{
	$("#media_menu_radio_volume").nstSlider(
	{
		"left_grip_selector": ".leftGrip",
		"value_changed_callback": function(cause, val) 
		{
			if(cause === "init")
			{
				return false
			}

			let n = Hue.utilz.round(val / 100, 1)

			if(Hue.room_state.radio_volume !== n)
			{
				Hue.set_radio_volume(n, true, false)
			}
		}
	})

	Hue.set_media_menu_radio_volume()
	
	$("#media_menu_tv_volume").nstSlider(
	{
		"left_grip_selector": ".leftGrip",
		"value_changed_callback": function(cause, val) 
		{
			if(cause === "init")
			{
				return false
			}

			let n = Hue.utilz.round(val / 100, 1)
			
			if(Hue.room_state.tv_volume !== n)
			{
				Hue.set_tv_volume(n, true, false)
			}
		}
	})

	Hue.set_media_menu_tv_volume()
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

	else if(n === "default")
	{
		n = Hue.config.room_state_default_radio_volume
	}

	$("#media_menu_radio_volume").nstSlider('set_position', Hue.utilz.to_hundred(n))
}

// Sets the media menu tv slider
Hue.set_media_menu_tv_volume = function(n=false)
{
	if(n === false)
	{
		n = Hue.room_state.tv_volume
	}

	else if(n === "increase")
	{
		n = Hue.room_state.tv_volume + 0.2

		if(n > 1)
		{
			n = 1
		}
	}

	else if(n === "decrease")
	{
		n = Hue.room_state.tv_volume - 0.2

		if(n < 0)
		{
			n = 0
		}
	}

	else if(n === "default")
	{
		n = Hue.config.room_state_default_tv_volume
	}

	$("#media_menu_tv_volume").nstSlider('set_position', Hue.utilz.to_hundred(n))
}

// Checks if a user is controllable
// Basically a user's role is below the user's role
// An admin can control other admins
Hue.user_is_controllable = function(user)
{
	if(!Hue.is_admin_or_op())
	{
		return false
	}

	if((user.role === 'admin' || user.role === 'op') && Hue.role !== 'admin')
	{
		return false
	}

	return true
}