var socket
var ls_settings = "settings_v15"
var ls_input_history = "input_history_v16"
var ls_room_settings = "room_settings_v1"
var ls_first_time = "first_time_v2"
var vtypes = ["voice1", "voice2", "voice3", "voice4"]
var roles = ["admin", "op"].concat(vtypes)
var settings
var is_public
var room_name
var username
var image_url = ''
var image_uploader = ''
var image_size = 0
var image_date = ''
var topic = ''
var topic_setter = ''
var topic_date = ''
var dropzone
var colorlib = ColorLib()
var played = []
var input_history = []
var input_history_index = 0
var chat_history = []
var userlist = []
var usernames = []
var role = ''
var chat_permission
var upload_permission
var radio_permission
var tv_permission
var can_chat = false
var can_images = false
var can_radio = false
var can_tv = false
var change_when_focused = false
var radio_type = ''
var radio_source = ''
var radio_title = ''
var radio_metadata = ''
var radio_setter = ''
var radio_date = ''
var tv_type = ''
var tv_source = ''
var tv_title = ''
var tv_metadata = ''
var tv_setter = ''
var tv_date = ''
var get_metadata
var no_meta_count
var tabbed_list = []
var tabbed_word = ""
var tabbed_start = 0
var tabbed_end = 0
var crm = false
var orb = false
var stu = false
var rup = false
var tup = false
var iup = false
var gtr = false
var orb_timeout
var modal_open = false
var started = false
var connections = 0
var afk_timer
var afk = false
var alert_mode = 0
var commands = []
var commands_sorted = {}
var chat_scrollbar
var template_menu
var template_create_room
var template_userlist
var template_roomlist
var template_played
var template_open_room
var template_status
var template_help
var template_help2
var template_help3
var template_userinfo
var template_profile
var template_image_picker
var template_tv_picker
var template_radio_picker
var template_media_menu
var template_whisper
var template_highlights
var template_image_history
var template_tv_history
var template_radio_history
var template_input_history
var template_chat_search
var template_image
var template_locked_menu
var msg_menu
var msg_userinfo
var msg_userlist
var msg_roomlist
var msg_played
var msg_image
var msg_profile
var msg_info
var msg_whisper
var msg_image_picker
var msg_tv_picker
var msg_radio_picker
var msg_highlights
var msg_media_menu
var msg_image_history
var msg_tv_history
var msg_radio_history
var msg_input_history
var msg_chat_search
var played_filtered = false
var userlist_filtered = false
var image_history_filtered = false
var tv_history_filtered = false
var radio_history_filtered = false
var roomlist_filter_string = ""
var yt_player
var yt_video_player
var youtube_player
var youtube_video_player
var fetched_room_id
var utilz = Utilz()
var log_messages
var profile_image
var change_image_when_focused = false 
var change_tv_when_focused = false
var twitch_video_player
var room_images_enabled = true
var room_tv_enabled = true
var room_radio_enabled = true
var radio_started = false
var default_theme
var default_background_image
var default_background_image_enabled
var image_queue = ["first"]
var image_queue_timeout
var layout_mode = "normal"
var last_image_change
var last_tv_change
var last_radio_change
var files = {}
var time_ago
var input_changed = false
var hls
var first_tv_played = false
var youtube_video_play_on_queue = false
var images_locked = false
var tv_locked = false 
var radio_locked = false
var old_input_val
var separator_title
var msg_id = 0
var mentions_regex
var highlight_words_regex
var writing_whisper = false
var double_tap_key_pressed = 0
var double_tap_key_2_pressed = 0
var double_tap_key_3_pressed = 0
var images_visible
var tv_visible
var radio_visible
var images_changed = []
var modal_image_open = false
var current_image_url = ""
var current_image_title = ""
var current_image_date_raw = 0
var date_joined
var user_email
var user_reg_date

function init()
{
	get_volume()
	activate_key_detection()
	compile_templates()
	get_settings()
	get_room_settings()
	start_msg()
	start_settings_state()
	start_settings_listeners()
	start_filters()
	start_image_events()
	start_dropzone()
	start_volume_scroll()
	generate_highlight_words_regex()
	activate_window_visibility_listener()
	input_click_events()
	copypaste_events()
	main_menu_events()
	header_topic_events()
	scroll_events()
	resize_events()
	register_commands()
	setup_chat()
	start_chat_click_events()
	start_played_click_events()
	start_userlist_click_events()
	start_roomlist_click_events()
	start_generic_uname_click_events()
	setup_media_video()
	start_username_context_menu()
	start_played_context_menu()
	start_volume_context_menu()
	start_metadata_loop()
	start_titles()
	setup_show_profile()
	setup_main_menu()
	start_twitch()
	check_image_queue()
	setup_input()
	font_check()
	setup_input_history()
	setup_modal_image()

	start_socket()
}

function make_main_container_visible()
{
	$("#loading").css("opacity", 0)
	$("#main_container").css("opacity", 1).css("pointer-events", "initial")

	setTimeout(function()
	{
		$("#loading").css("display", "none")
	}, 1600)
}

function get_local_storage(ls_name)
{
	if(localStorage[ls_name])
	{
		try
		{
			var obj = JSON.parse(localStorage.getItem(ls_name))
		}

		catch(err)
		{
			localStorage.removeItem(ls_name)
			var obj = null
		}
	}

	else
	{
		var obj = null
	}

	return obj	
}

function save_local_storage(ls_name, obj)
{
	if(typeof obj !== "string")
	{
		obj = JSON.stringify(obj)
	}

	localStorage.setItem(ls_name, obj)
}

function remove_local_storage(ls_name)
{
	localStorage.removeItem(ls_name)	
}

function compile_templates()
{
	template_menu = Handlebars.compile($('#template_menu').html())
	template_create_room = Handlebars.compile($('#template_create_room').html())
	template_open_room = Handlebars.compile($('#template_open_room').html())
	template_userlist = Handlebars.compile($('#template_userlist').html())
	template_roomlist = Handlebars.compile($('#template_roomlist').html())
	template_played = Handlebars.compile($('#template_played').html())
	template_status = Handlebars.compile($('#template_status').html())
	template_help = Handlebars.compile($('#template_help').html())
	template_help2 = Handlebars.compile($('#template_help2').html())
	template_help3 = Handlebars.compile($('#template_help3').html())
	template_userinfo = Handlebars.compile($('#template_userinfo').html())
	template_profile = Handlebars.compile($('#template_profile').html())
	template_image_picker = Handlebars.compile($('#template_image_picker').html())
	template_tv_picker = Handlebars.compile($('#template_tv_picker').html())
	template_radio_picker = Handlebars.compile($('#template_radio_picker').html())
	template_media_menu = Handlebars.compile($('#template_media_menu').html())
	template_whisper = Handlebars.compile($('#template_whisper').html())
	template_highlights = Handlebars.compile($('#template_highlights').html())
	template_image_history = Handlebars.compile($('#template_image_history').html())
	template_tv_history = Handlebars.compile($('#template_tv_history').html())
	template_radio_history = Handlebars.compile($('#template_radio_history').html())
	template_input_history = Handlebars.compile($('#template_input_history').html())
	template_chat_search = Handlebars.compile($('#template_chat_search').html())
	template_image = Handlebars.compile($('#template_image').html())
	template_locked_menu = Handlebars.compile($('#template_locked_menu').html())
}

function help()
{
	msg_info.show(template_help())
}

function help2()
{
	msg_info.show(template_help2())
}

function help3()
{
	msg_info.show(template_help3())
}

function show_public()
{
	if(is_public)
	{
		chat_announce({brk1:'[', brk2:']', msg:'This room is public'})
	}

	else
	{
		chat_announce({brk1:'[', brk2:']', msg:'This room is private'})
	}
}

function show_room()
{
	chat_announce({brk1:'[', brk2:']', msg:`Room: ${room_name}`})
}

function change_room_name(arg)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()		
	}

	arg = utilz.clean_string2(arg.substring(0, max_room_name_length))

	if(arg === room_name)
	{
		chat_announce({brk1:'[', brk2:']', msg:"That's already the room name"})
		return
	}

	socket_emit("change_room_name", {name:arg})
}

function room_name_edit()
{
	change_input(`/roomname ${room_name}`)
}

function show_radio_source()
{
	if(radio_setter !== '')
	{
		chat_announce({brk1:'[', brk2:']', msg:`Radio: ${radio_source}`, title:`Setter: ${radio_setter} | ${radio_date}`})
	}

	else
	{
		chat_announce({brk1:'[', brk2:']', msg:`Radio: ${radio_source}`})
	}
}

function get_unset_topic()
{
	if(role === "admin" || role === "op")
	{
		return default_topic_admin
	}

	else
	{
		return default_topic
	}
}

function get_topic()
{
	if(topic)
	{
		return topic
	}

	else 
	{
		return get_unset_topic()
	}	
}

function show_topic(size="small")
{
	if(size === "small")
	{
		var brk1 = "["
		var brk2 = "]"
	}

	else
	{
		var brk1 = ""
		var brk2 = ""
	}

	if(topic)
	{
		if(topic_setter !== "")
		{
			chat_announce({brk1:brk1, brk2:brk2, msg:`Topic: ${topic}`, size:size, title:`Setter: ${topic_setter} | ${topic_date}`})
		}

		else
		{
			chat_announce({brk1:brk1, brk2:brk2, msg:`Topic: ${topic}`, size:size})
		}
	}

	else 
	{
		chat_announce({brk1:brk1, brk2:brk2, msg:`Topic: ${get_unset_topic()}`, size:size})
	}
}

function check_role(data)
{
	role = data.role

	v1_chat_permission = data.v1_chat_permission
	v1_images_permission = data.v1_images_permission
	v1_tv_permission = data.v1_tv_permission
	v1_radio_permission = data.v1_radio_permission
	v2_chat_permission = data.v2_chat_permission
	v2_images_permission = data.v2_images_permission
	v2_tv_permission = data.v2_tv_permission
	v2_radio_permission = data.v2_radio_permission
	v3_chat_permission = data.v3_chat_permission
	v3_images_permission = data.v3_images_permission
	v3_tv_permission = data.v3_tv_permission
	v3_radio_permission = data.v3_radio_permission
	v4_chat_permission = data.v4_chat_permission
	v4_images_permission = data.v4_images_permission
	v4_tv_permission = data.v4_tv_permission
	v4_radio_permission = data.v4_radio_permission

	check_permissions()
}

function check_permissions()
{
	can_chat = check_permission(role, "chat")
	can_images = room_images_enabled && check_permission(role, "images")
	can_tv = room_tv_enabled && check_permission(role, "tv")
	can_radio =  room_radio_enabled && check_permission(role, "radio")

	setup_icons()
}

function check_permission(role, type)
{
	if(role === "admin" || role === "op")
	{
		return true
	}

	if(role === "voice1")
	{
		if(window[`v1_${type}_permission`])
		{
			return true
		}
	}

	else if(role === "voice2")
	{
		if(window[`v2_${type}_permission`])
		{
			return true
		}
	}

	else if(role === "voice3")
	{
		if(window[`v3_${type}_permission`])
		{
			return true
		}
	}

	else if(role === 'voice4')
	{
		if(window[`v4_${type}_permission`])
		{
			return true
		}
	}

	return false	
}

function setup_icons()
{
	if(room_images_enabled)
	{
		$("#footer_images_controls").css("display", "initial")

		if(can_images)
		{
			$("#footer_upload_icon").css("display", "inline-block")
		}

		else
		{
			$("#footer_upload_icon").css("display", "none")
		}
	}

	else
	{
		$("#footer_upload_icon").css("display", "none")
		$("#footer_images_controls").css("display", "none")
	}

	if(room_radio_enabled)
	{
		$("#footer_radio_controls").css("display", "initial")

		if(can_radio)
		{
			$("#footer_radio_icon").css("display", "inline-block")
		}
		
		else
		{
			$("#footer_radio_icon").css("display", "none")
		}
	}

	else
	{
		$("#footer_radio_icon").css("display", "none")
		$("#footer_radio_controls").css("display", "none")
	}

	if(room_tv_enabled)
	{
		$("#footer_tv_controls").css("display", "initial")

		if(can_tv)
		{
			$("#footer_tv_icon").css("display", "inline-block")
		}

		else
		{
			$("#footer_tv_icon").css("display", "none")
		}
	}

	else
	{
		$("#footer_tv_icon").css("display", "none")
		$("#footer_tv_controls").css("display", "none")
	}
}

function show_role(data)
{
	if(role === 'admin')
	{
		chat_announce({brk1:'[', brk2:']', msg:'You are an admin'})
	}

	else if(role === 'op')
	{
		chat_announce({brk1:'[', brk2:']', msg:'You are an op'})
	}

	else if(role.startsWith('voice'))
	{
		chat_announce({brk1:'[', brk2:']', msg:`You have ${role}`})
	}

	var ps = 0

	if(can_chat)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You have chat permission"})

		ps += 1
	}

	if(can_images)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You have images permission"})

		ps += 1
	}

	if(can_tv)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You have tv permission"})

		ps += 1
	}

	if(can_radio)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You have radio permission"})

		ps += 1
	}

	if(ps === 0)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You cannot interact"})
	}
}

function show_username()
{
	chat_announce({brk1:'[', brk2:']', msg:`Username: ${username}`})
}

function socket_emit(dest, obj)
{
	console.info(`Emit: ${dest}`)
	socket.emit(dest, obj)
}

function start_socket()
{
	socket = io('/')

	socket.on('connect', function() 
	{
		if(connections > 0)
		{
			refresh()
			return
		}

		socket_emit('join_room', {room_id:room_id, user_id:user_id, token:jwt_token})
	})

	socket.on('update', function(data) 
	{
		if(data.type === 'joined')
		{
			if(data.room_locked)
			{
				start_locked_mode()
				return
			}

			connections += 1
			room_name = data.room_name
			set_username(data.username)
			set_email(data.email)
			user_reg_date = data.reg_date
			setup_profile_image(data.profile_image)
			userlist = data.userlist
			update_userlist()
			log_enabled = data.log
			log_messages = data.log_messages
			setup_default_theme(data)
			set_default_theme()
			set_background_image()		
			setup_modal_colors()
			setup_active_media(data)
			check_role(data)
			set_topic_info(data)
			update_title()
			is_public = data.public
			setup_userinfo()
			clear_chat()
			check_firstime()
			get_input_history()
			show_joined()

			setup_image(data)
			setup_tv(data)
			setup_radio(data)

			chat_scroll_bottom()
			make_main_container_visible()
			start_heartbeat()

			date_joined = Date.now()

			started = true
		}

		else if(data.type === 'typing')
		{
			show_typing()
		}		

		else if(data.type === 'chat_msg')
		{
			update_chat({uname:data.username, msg:data.msg, prof_image:data.profile_image})
			hide_pencil()
		}		

		else if(data.type === 'request_slice_upload')
		{
			request_slice_upload(data)
		}

		else if(data.type === 'upload_ended') 
		{
			upload_ended(data)
		}	

		else if(data.type === 'chat_announcement')
		{
			chat_announce({brk1:'###', brk2:'###', msg:data.msg})
		}

		else if(data.type === 'connection_lost')
		{
			refresh()
		}

		else if(data.type === 'image_change')
		{
			queue_image(data)
			announce_image_change(data)			
		}

		else if(data.type === 'profile_image_changed')
		{
			profile_image_changed(data)
		}

		else if(data.type === 'userjoin')
		{
			userjoin(data)
		}

		else if(data.type === 'roomlist')
		{
			update_roomlist(data.roomlist)
			show_roomlist()
		}

		else if(data.type === 'upload_error')
		{
			show_upload_error()
		}

		else if(data.type === 'topic_change')
		{
			announce_topic_change(data)
		}

		else if(data.type === 'room_name_changed')
		{
			announce_room_name_change(data)
		}

		else if(data.type === 'log_changed')
		{
			announce_log_change(data)
		}

		else if(data.type === 'log_cleared')
		{
			announce_log_cleared(data)
		}

		else if(data.type === 'announce_role_change')
		{
			announce_role_change(data)
		}

		else if(data.type === 'voices_resetted')
		{
			announce_voices_resetted(data)
		}

		else if(data.type === 'announce_removedops')
		{
			announce_removedops(data)
		}

		else if(data.type === 'announce_ban')
		{
			chat_announce({brk1:'~', brk2:'~', msg:`${data.username1} banned ${data.username2}`})
		}

		else if(data.type === 'announce_unban')
		{
			chat_announce({brk1:'~', brk2:'~', msg:`${data.username1} unbanned ${data.username2}`})
		}		

		else if(data.type === 'announce_unban_all')
		{
			announce_unban_all(data)
		}

		else if(data.type === 'receive_banned_count')
		{
			receive_banned_count(data)
		}

		else if(data.type === 'nothingtounban')
		{
			chat_announce({brk1:'[', brk2:']', msg:"There was nothing to unban"})
		}

		else if(data.type === 'nothingtoclear')
		{
			chat_announce({brk1:'[', brk2:']', msg:"There was nothing to clear"})
		}

		else if(data.type === 'listbans')
		{
			show_listbans(data)
		}

		else if(data.type === 'forbiddenuser')
		{
			forbiddenuser()
		}

		else if(data.type === 'user_not_found')
		{
			chat_announce({brk1:'[', brk2:']', msg:"User doesn't exist"})
		}

		else if(data.type === 'user_not_in_room')
		{
			user_not_in_room()
		}

		else if(data.type === 'noopstoremove')
		{
			chat_announce({brk1:'[', brk2:']', msg:"There were no ops to remove"})
		}

		else if(data.type === 'novoicestoreset')
		{
			chat_announce({brk1:'[', brk2:']', msg:"There were no voices to reset"})
		}

		else if(data.type === 'isalready')
		{
			isalready(data.who, data.what)
		}

		else if(data.type === 'user_already_banned')
		{
			chat_announce({brk1:'[', brk2:']', msg:"User is already banned"})
		}

		else if(data.type === 'user_already_unbanned')
		{
			chat_announce({brk1:'[', brk2:']', msg:"User is already unbanned"})
		}

		else if(data.type === 'privacy_change')
		{
			announce_privacy_change(data)
		}

		else if(data.type === 'changed_radio_source')
		{
			announce_radio_change(data)
			setup_radio(data)			
		}

		else if(data.type === 'restarted_radio_source')
		{
			announce_radio_change(data, false, "restart")
			setup_radio(data)			
		}

		else if(data.type === 'changed_tv_source')
		{
			announce_tv_change(data)
			setup_tv(data)			
		}

		else if(data.type === 'restarted_tv_source')
		{
			announce_tv_change(data, false, "restart")
			setup_tv(data)			
		}

		else if(data.type === 'reserved')
		{
			reserved(data)
		}

		else if(data.type === 'unreserved')
		{
			unreserved(data)
		}

		else if(data.type === 'alreadyreserved')
		{
			chat_announce({brk1:'[', brk2:']', msg:`${username} is already reserved`})
		}

		else if(data.type === 'couldnotrecover')
		{
			chat_announce({brk1:'[', brk2:']', msg:"You don't seem to own that username"})
		}

		else if(data.type === 'songnotfound')
		{
			chat_announce({brk1:'[', brk2:']', msg:"The song couldn't be found"})
		}

		else if(data.type === 'videonotfound')
		{
			chat_announce({brk1:'[', brk2:']', msg:"The video couldn't be found"})
		}

		else if(data.type === 'room_created')
		{
			show_open_room(data.id)
		}

		else if(data.type === 'redirect')
		{
			goto_url(data.location)
		}

		else if(data.type === 'username_already_exists')
		{
			chat_announce({brk1:'[', brk2:']', msg:`${data.username} already exists`})
		}

		else if(data.type === 'email_already_exists')
		{
			chat_announce({brk1:'[', brk2:']', msg:`${data.email} already exists`})
		}

		else if(data.type === 'new_username')
		{
			announce_new_username(data)
		}		

		else if(data.type === 'password_changed')
		{
			password_changed(data)
		}

		else if(data.type === 'email_changed')
		{
			email_changed(data)
		}

		else if(data.type === 'show_details')
		{
			show_details(data)
		}

		else if(data.type === 'room_images_enabled_change')
		{
			announce_room_images_enabled_change(data)
		}

		else if(data.type === 'room_tv_enabled_change')
		{
			announce_room_tv_enabled_change(data)
		}

		else if(data.type === 'room_radio_enabled_change')
		{
			announce_room_radio_enabled_change(data)
		}	

		else if(data.type === 'default_theme_change')
		{
			announce_default_theme_change(data)
		}

		else if(data.type === 'default_background_image_change')
		{
			announce_default_background_image_change(data)
		}

		else if(data.type === 'default_background_image_enabled_change')
		{
			announce_default_background_image_enabled_change(data)
		}

		else if(data.type === 'voice_permission_change')
		{
			announce_voice_permission_change(data)
		}				

		else if(data.type === 'disconnection')
		{
			disconnected(data)
		}

		else if(data.type === 'pinged')
		{
			pinged(data)
		}

		else if(data.type === 'kicked')
		{
			kicked(data)
		}

		else if(data.type === 'banned')
		{
			banned(data)
		}

		else if(data.type === 'othersdisconnected')
		{
			show_others_disconnected(data)
		}

		else if(data.type === 'whisper')
		{
			whisper_received(data)
		}

		else if(data.type === 'error_occurred')
		{
			error_occurred()
		}

		else if(data.type === 'email_change_code_sent')
		{
			chat_announce({brk1:'[', brk2:']', msg:`Verification code sent. Use the command sent to ${data.email}`})
		}

		else if(data.type === 'email_change_code_not_sent')
		{
			chat_announce({brk1:'[', brk2:']', msg:`Verification code not sent yet. Use /changeemail [new_email] to get a verification code`})
		}

		else if(data.type === 'email_change_wait')
		{
			chat_announce({brk1:'[', brk2:']', msg:`You must wait a while before changing the email again`})
		}

		else if(data.type === 'email_change_wrong_code')
		{
			chat_announce({brk1:'[', brk2:']', msg:`Code supplied didn't match`})
		}

		else if(data.type === 'email_change_expired_code')
		{
			chat_announce({brk1:'[', brk2:']', msg:`Code supplied has expired`})
		}

		else if(data.type === 'create_room_wait')
		{
			msg_info.show("You must wait a while before creating another room")
		}
	})
}

function start_heartbeat()
{
	setInterval(function()
	{
		if(!socket.connected)
		{
			refresh()
		}

		socket_emit('heartbeat', {})
	}, heartbeat_interval)
}

function setup_radio(data)
{
	if(!data)
	{
		data = {}

		data.radio_source = ''
		data.radio_setter = ''
		data.radio_date = 0
	}

	if(data.radio_source === '')
	{
		radio_source = default_radio_source
	}

	else
	{
		radio_source = data.radio_source
	}

	radio_type = data.radio_type
	radio_title = data.radio_title
	radio_setter = data.radio_setter
	radio_date = nice_date(data.radio_date)

	if(radio_type === "radio")
	{
		if(radio_source.slice(-1) === '/')
		{
			radio_metadata = `${radio_source.slice(0, -1).split('/').slice(0, -1).join('/')}/status-json.xsl`
		}

		else
		{
			radio_metadata = `${radio_source.split('/').slice(0, -1).join('/')}/status-json.xsl`
		}
		
		get_metadata = true
		no_meta_count = 0

		get_radio_metadata()
		
		if(youtube_player !== undefined)
		{
			youtube_player.stopVideo()
		}
	}

	else if(data.radio_type === "youtube")
	{
		get_metadata = false
		push_played(false, {s1:radio_title, s2:radio_source})
		$('#audio').attr('src', '')
	}

	change({type:"radio", force:true})	
}

function setup_tv(data)
{
	if(!data)
	{
		data = {}

		data.tv_source = ''
		data.tv_setter = ''
		data.tv_date = 0
	}

	if(data.tv_source === '')
	{
		tv_source = default_tv_source
		tv_type = default_tv_type
	}

	else
	{
		tv_source = data.tv_source
		tv_type = data.tv_type
	}

	tv_title = data.tv_title
	tv_setter = data.tv_setter
	tv_date = nice_date(data.tv_date)

	change({type:"tv", force:true})
}

function stop_videos()
{
	if(youtube_video_player !== undefined)
	{
		youtube_video_player.pauseVideo()
	}

	if(twitch_video_player !== undefined)
	{
		twitch_video_player.pause()
	}

	$("#media_video")[0].pause()

	hls.stopLoad()
}

function play_video()
{
	if(!tv_visible)
	{
		return false
	}

	if(tv_type === "youtube")
	{
		if(youtube_video_player !== undefined)
		{
			youtube_video_player.playVideo()
		}
	}

	else if(tv_type === "twitch")
	{
		if(twitch_video_player !== undefined)
		{
			twitch_video_player.play()
		}
	}

	else if(tv_type === "url")
	{
		$("#media_video")[0].play()
	}
}

function show_youtube_video(play=true)
{
	stop_videos()

	var id = utilz.get_youtube_id(tv_source)

	youtube_video_play_on_queue = play

	if(id[0] === "video")
	{
		youtube_video_player.cueVideoById({videoId:id[1], startSeconds:utilz.get_youtube_time(tv_source)})
	}

	else if(id[0] === "list")
	{
		youtube_video_player.cuePlaylist({list:id[1][0], index:id[1][1]})
	}

	else
	{
		return false
	}
	
	$("#media_video_container").css("display", "none")
	$("#media_twitch_video_container").css("display", "none")
	$("#media_youtube_video_container").css("display", "flex")

	fix_video_frame("media_youtube_video")
}

function show_twitch_video(play=true)
{
	stop_videos()

	var id = utilz.get_twitch_id(tv_source)

	if(id[0] === "video")
	{
		twitch_video_player.setVideoSource(tv_source)
	}

	else if(id[0] === "channel")
	{
		twitch_video_player.setChannel(id[1])
	}

	else
	{
		return false
	}

	$("#media_video_container").css("display", "none")
	$("#media_youtube_video_container").css("display", "none")
	$("#media_twitch_video_container").css("display", "flex")

	if(play)
	{
		twitch_video_player.play()
	}

	else
	{
		twitch_video_player.pause()
	}

	fix_video_frame("media_twitch_video")
}

function show_video(play=true)
{
	stop_videos()

	var split = tv_source.split('.')

	if(split[split.length - 1] === "m3u8")
	{
		hls.loadSource(tv_source)
		hls.attachMedia($("#media_video")[0])
	}

	else
	{
		$("#media_video").prop("src", tv_source)
	}

	$("#media_youtube_video_container").css("display", "none")
	$("#media_twitch_video_container").css("display", "none")	
	$("#media_video_container").css("display", "flex")

	if(play)
	{
		$("#media_video")[0].play()
	}

	fix_video_frame("media_video")
}

function setup_default_theme(data)
{
	default_theme = data.default_theme

	if(data.default_background_image !== "")
	{
		default_background_image = data.default_background_image
	}

	else
	{
		default_background_image = default_default_background_image_url
	}

	default_background_image_enabled = data.default_background_image_enabled	
}

function set_default_theme()
{
	var background_color = default_theme
	var background_color2 = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_1)
	var font_color = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_2)

	if(default_background_image_enabled && settings.background_image)
	{
		background_color = colorlib.rgb_to_rgba(background_color, general_opacity)
		background_color2 = colorlib.rgb_to_rgba(background_color2, general_opacity)
	}

	change_colors(background_color, background_color2, font_color)
}

function change_colors(background_color, background_color2, font_color)
{	
	$('.bg1').css('background-color', background_color)
	$('.bg1').css('color', font_color)
	$('.bg2').css('background-color', background_color2)
	$('.bg2').css('color', font_color)	
}

function set_background_image()
{
	$('#background_image').css('background-image', `url('${default_background_image}')`) 	
}

function userjoin(data)
{
	addto_userlist(data.username, data.role, data.profile_image)

	if(announce_joins && check_permission(data.role, "chat"))
	{
		var f = function()
		{
			show_profile(`${data.username}`, `${get_user_by_username(data.username).profile_image}`)
		}

		chat_announce({brk1:'--', brk2:'--', msg:`${data.username} has joined`, save:true, onclick:f})
		
		if(data.username !== username)
		{
			alert_title()
			sound_notify()
		}
	}

}

function update_usercount(usercount)
{
	$('#usercount').html(`${singular_or_plural(usercount, "Users")} Online`)
}

function addto_userlist(uname, rol, pi)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].username === uname)
		{
			userlist[i].username = uname
			userlist[i].role = rol
			userlist[i].profile_image = pi
			update_userlist()
			return
		}
	}

	userlist.push({username:uname, role:rol, profile_image:pi})
	update_userlist()
}

function removefrom_userlist(uname)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].username === uname)
		{
			userlist.splice(i, 1)
			break
		}
	}

	update_userlist()
}

function replace_uname_in_userlist(oldu, newu)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].username === oldu)
		{
			userlist[i].username = newu
			break
		}
	}

	update_userlist()
}

function replace_role_in_userlist(uname, rol)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].username === uname)
		{
			userlist[i].role = rol
			break
		}
	}

	update_userlist()
}

function get_role(uname)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].username === uname)
		{
			return userlist[i].role
		}
	}
}

function remove_roles_in_userlist()
{
	for(var i=0; i<userlist.length; i++)
	{
		userlist[i].role = 'z'
	}

	update_userlist()
}

function reset_voices_userlist()
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].role.startsWith('voice') && userlist[i].role !== 'voice1')
		{
			userlist[i].role = 'voice1'
		}
	}

	update_userlist()
}

function remove_ops_userlist()
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i].role === 'op')
		{
			userlist[i].role = 'z'
		}
	}

	update_userlist()
}

function role_tag(p)
{
	if(p === 'admin')
	{
		var s = '[A]'
	}

	else if(p === 'op')
	{
		var s = '[O]'
	}

	else if(p === 'voice1')
	{
		var s = '[V1]'
	}

	else if(p === 'voice2')
	{
		var s = '[V2]'
	}

	else if(p === 'voice3')
	{
		var s = '[V3]'
	}

	else if(p === 'voice4')
	{
		var s = '[V4]'
	}

	else
	{
		var s = ''
	}

	return s
}

function get_user_by_username(uname)
{
	for(var user of userlist)
	{
		if(user.username === uname)
		{
			return user
		}
	}

	return false
}

function start_userlist_click_events()
{
	$("#userlist").on("click", ".ui_item_uname", function()
	{
		var uname = $(this).text()
		show_profile(uname, get_user_by_username(uname).profile_image)
	})	
}

function update_userlist()
{	
	var s = $()

	s = s.add()

	userlist.sort(compare_userlist)

	usernames = []

	for(var i=0; i<userlist.length; i++)
	{
		var item = userlist[i]

		usernames.push(item.username)

		var h = $("<div class='userlist_item'><span class='ui_item_role'></span><span class='ui_item_uname'></span></div>")

		var p = role_tag(item.role)

		var pel = h.find('.ui_item_role').eq(0)

		pel.text(p)

		if(p === "")
		{
			pel.css("padding-right", 0)
		}

		h.find('.ui_item_uname').eq(0).text(item.username)

		s = s.add(h)
	}

	update_usercount(userlist.length)

	$('#userlist').html(s)

	if(userlist_filtered)
	{
		do_userlist_filter()
	}

	update_modal_scrollbar("userlist")
}

function compare_userlist(a, b) 
{
	if(a.role === '')
	{
		a.role = 'z'
	}

	if(b.role === '')
	{
		b.role = 'z'
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

function start_username_context_menu()
{
	$.contextMenu(
	{
		selector: ".ui_item_uname, .chat_uname, #show_profile_uname, .generic_uname",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		items: 
		{
			cmvoice1: 
			{
				name: "Voice 1", callback: function(key, opt)
				{
					var arg = $(this).text()
					change_role(arg, "voice1")
				},
				visible: function(key, opt)
				{ 
					if(role !== 'admin' && role !== 'op')
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
					var arg = $(this).text()
					change_role(arg, "voice2")
				},
				visible: function(key, opt)
				{ 
					if(role !== 'admin' && role !== 'op')
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
					var arg = $(this).text()
					change_role(arg, "voice3")
				},
				visible: function(key, opt)
				{ 
					if(role !== 'admin' && role !== 'op')
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
					var arg = $(this).text()
					change_role(arg, "voice4")
				},
				visible: function(key, opt)
				{ 
					if(role !== 'admin' && role !== 'op')
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
					if(role !== 'admin')
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
							var arg = $(this).text()
							change_role(arg, "op")
						}
					}
				}				
			},
			cmadmin: 
			{
				name: "Admin",
				visible: function(key, opt)
				{ 
					if(role !== 'admin')
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
							var arg = $(this).text()
							change_role(arg, "admin")
						}					
					}
				}
			},			
			cmkick: 
			{
				name: "Kick",
				visible: function(key, opt)
				{ 
					if(role !== 'admin' && role !== 'op')
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
							var arg = $(this).text()
							kick(arg)
						}
					}
				}				
			},
			cmban: 
			{
				name: "Ban",
				visible: function(key, opt)
				{ 
					if(role !== 'admin' && role !== 'op')
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
							var arg = $(this).text()
							ban(arg)
						}
					}
				}				
			}			
		}
	})
}

function start_played_context_menu()
{
	$.contextMenu(
	{
		selector: ".played_item, #now_playing_controls",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,		
		items: 
		{
			cmenu1: 
			{
				name: "Search on Google", callback: function(key, opt)
				{
					search_on('google', this.data('q'))
				}
			},
			cmenu2: 
			{
				name: "Search on SoundCloud", callback: function(key, opt)
				{
					search_on('soundcloud', this.data('q'))
				}         
			},
			cmenu3: 
			{
				name: "Search on YouTube", callback: function(key, opt)
				{
					search_on('youtube', this.data('q'))
				}
			}
		}
	})
}

function start_volume_context_menu()
{
	$.contextMenu(
	{
		selector: "#volume_controls",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,
		className: 'volume_context',
		items: 
		{
			vcm100: 
			{
				name: "100%", callback: function(key, opt)
				{
					set_volume(1)
				}
			},
			vcm90: 
			{
				name: "90%", callback: function(key, opt)
				{
					set_volume(0.9)
				}         
			},
			vcm80: 
			{
				name: "80%", callback: function(key, opt)
				{
					set_volume(0.8)
				}
			},
			vcm70: 
			{
				name: "70%", callback: function(key, opt)
				{
					set_volume(0.7)
				}
			},
			vcm60: 
			{
				name: "60%", callback: function(key, opt)
				{
					set_volume(0.6)
				}
			},
			vcm50: 
			{
				name: "50%", callback: function(key, opt)
				{
					set_volume(0.5)
				}
			},
			vcm40: 
			{
				name: "40%", callback: function(key, opt)
				{
					set_volume(0.4)
				}
			},
			vcm30: 
			{
				name: "30%", callback: function(key, opt)
				{
					set_volume(0.3)
				}
			},
			vcm20: 
			{
				name: "20%", callback: function(key, opt)
				{
					set_volume(0.2)
				}
			},
			vcm10: 
			{
				name: "10%", callback: function(key, opt)
				{
					set_volume(0.1)
				}
			},
			vcm0: 
			{
				name: "0%", callback: function(key, opt)
				{
					set_volume(0)
				}
			}
		}
	})
}

function singular_or_plural(n, s)
{
	if(n === 1)
	{
		var ss = `${n} ${s.substring(0, s.length - 1)}`
	}

	else
	{
		var ss = `${n} ${s}`
	}

	return ss
}

function request_roomlist(filter="")
{
	roomlist_filter_string = filter

	socket_emit("roomlist", {type:"public"})
}

function request_visited_roomlist(filter="")
{
	roomlist_filter_string = filter
	socket_emit("roomlist", {type:"visited"})
}

function start_roomlist_click_events()
{
	$("#roomlist").on("click", ".roomlist_item", function() 
	{
		show_open_room($(this).data("room_id"))
	})
}

function update_roomlist(roomlist)
{	
	$("#roomlist_filter").val(roomlist_filter_string)

	var s = $()

	s = s.add()

	for(var i=0; i<roomlist.length; i++)
	{
		var c = "<div class='roomlist_name'></div><div class='roomlist_topic'></div><div class='roomlist_here'></div><div class='roomlist_count'></div>"
		var h = $(`<div class='roomlist_item' data-room_id='${roomlist[i].id}'>${c}</div>`)

		h.find('.roomlist_name').eq(0).text(roomlist[i].name)

		h.find('.roomlist_count').eq(0).text(singular_or_plural(roomlist[i].usercount, "users"))

		if(roomlist[i].id === room_id)
		{
			h.find('.roomlist_here').eq(0).text("You are here").css("display", "block")
		}

		if(roomlist[i].topic.length > 0)
		{
			var topic = roomlist[i].topic
		}

		else 
		{
			var topic = 'No topic set'
		}

		h.find('.roomlist_topic').eq(0).text(topic)

		s = s.add(h)
	}

	$('#roomlist').html(s)

	if(roomlist_filter_string !== "")
	{
		do_roomlist_filter()
	}

	update_modal_scrollbar("roomlist")
}

function setup_main_menu()
{
	$(".admin_v_toggle").each(function()
	{
		$(this).click(function()
		{
			var container = $(this).next('.admin_v_container')
			var display = container.css('display')

			if(display === "none")
			{
				container.css("display", "initial")

				$(this).text(`- ${$(this).text().substring(2)}`)
			}

			else
			{
				container.css("display", "none")

				$(this).text(`+ ${$(this).text().substring(2)}`)
			}

			update_modal_scrollbar("menu")
		})	
	})

	$(".admin_voice_permissions_checkbox").each(function()
	{
		$(this).change(function()
		{
			var what = $(this).prop("checked")

			change_voice_permission($(this).data("ptype"), what)
		})	
	})

	$('#admin_enable_images').change(function()
	{
		var what = JSON.parse($('#admin_enable_images option:selected').val())

		change_room_images_enabled(what)
	})

	$('#admin_enable_tv').change(function()
	{
		var what = JSON.parse($('#admin_enable_tv option:selected').val())

		change_room_tv_enabled(what)
	})

	$('#admin_enable_radio').change(function()
	{
		var what = JSON.parse($('#admin_enable_radio option:selected').val())

		change_room_radio_enabled(what)
	})

	$('#admin_privacy').change(function()
	{
		var what = JSON.parse($('#admin_privacy option:selected').val())

		change_privacy(what)
	})	

	$('#admin_log').change(function()
	{
		var what = JSON.parse($('#admin_log option:selected').val())

		change_log(what)
	})

	$("#admin_default_theme").spectrum(
	{
		color: "#B5599A",
		appendTo: "#admin_menu",
		showInput: true,
	})

	$("#admin_default_theme").on('hide.spectrum', function(e, t) 
	{
		change_default_theme(t.toRgbString())
	})

	$('#admin_default_background_image_select').change(function()
	{
		var what = JSON.parse($('#admin_default_background_image_select option:selected').val())

		change_default_background_image_enabled(what)
	})	

	$("#admin_default_background_image")[0].addEventListener('load', function()
	{
		update_modal_scrollbar("menu")
	})
}

function show_main_menu()
{
	$("#admin_menu").css("display", "none")
	$("#menu_smaller_container").css("display", "block")

	msg_menu.show(function()
	{
		if(role === "admin" || role === "op")
		{
			$(".admin_voice_permissions_checkbox").each(function()
			{
				$(this).prop("checked", window[$(this).data("ptype")])
			})

			$('#admin_enable_images').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === room_images_enabled)
				{
					$(this).prop('selected', true)
				}
			})

			$('#admin_enable_tv').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === room_tv_enabled)
				{
					$(this).prop('selected', true)
				}
			})

			$('#admin_enable_radio').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === room_radio_enabled)
				{
					$(this).prop('selected', true)
				}
			})

			$('#admin_privacy').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === is_public)
				{
					$(this).prop('selected', true)
				}
			})	

			$('#admin_log').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === log_enabled)
				{
					$(this).prop('selected', true)
				}
			})

			$("#admin_default_theme").spectrum("set", default_theme)

			$('#admin_default_background_image_select').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === default_background_image_enabled)
				{
					$(this).prop('selected', true)
				}
			})			

			if(default_background_image !== $("#admin_default_background_image").attr('src'))
			{
				if(default_background_image !== "")
				{
					$("#admin_default_background_image").attr("src", default_background_image)
				}

				else
				{
					$("#admin_default_background_image").attr("src", default_default_background_image_url)
				}
			}			

			$("#admin_menu").css("display", "block")
		}

		update_modal_scrollbar("menu")
	})
}

function show_create_room()
{
	msg_info.show(template_create_room(), function()
	{
		$("#create_room_name").focus()
		
		$('#create_room_done').on("click", function()
		{
			create_room_submit()
		})

		crm = true
	})
}

function create_room_submit(oname=false)
{
	var data = {}

	data.name = utilz.clean_string2($('#create_room_name').val().substring(0, max_room_name_length))

	if(data.name === "")
	{
		return
	}

	data.public = JSON.parse($('#create_room_public option:selected').val())

	create_room(data)	
}

function show_open_room(id)
{
	msg_info.show(template_open_room({id:id}), function()
	{
		orb = true
	})
}

function show_userlist(filter=false)
{
	msg_userlist.show(function()
	{
		if(filter)
		{
			$("#userlist_filter").val(filter)
			do_userlist_filter()
		}

		$("#userlist_filter").focus()
	})
}

function reset_userlist_filter()
{
	$("#userlist_filter").val("")
	do_userlist_filter()
}

function show_roomlist()
{
	msg_roomlist.show(function()
	{
		$("#roomlist_filter").focus()
	})
}

function show_played(filter=false)
{
	msg_played.show(function()
	{
		if(filter)
		{
			$("#played_filter").val(filter)
			do_played_filter()
		}
		
		$("#played_filter").focus()
	})
}

function start_dropzone()
{
	dropzone = new Dropzone("body", 
	{ 
		url: "/",
		maxFiles: 1,
		maxFilesize: max_image_size / 1024,
		autoProcessQueue: false,
		clickable: '#image_file_picker',
		acceptedFiles: "image/jpeg,image/png,image/gif"
	})

	dropzone.on("addedfile", function(file) 
	{
		focus_input()

		if(!can_images)
		{
			chat_announce({brk1:'[', brk2:']', msg:"You don't have permission to upload images"})
			dropzone.files = []
			return false
		}

		if(dropzone.files.length > 1)
		{
			dropzone.files = []
			return false
		}

		var size = file.size / 1024

		if(size > max_image_size)
		{
			dropzone.files = []
			chat_announce({brk1:'[', brk2:']', msg:"File is too big"})
			return false
		}

		var name = file.name

		var ext = name.split('.').pop(-1).toLowerCase()

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif')
		{
			dropzone.files = []
			return false
		}

		dropzone.files = []

		upload_file(file, "image_upload")
	})
}

function create_file_reader(file)
{
	var reader = new FileReader()

	reader.addEventListener("loadend", function(e) 
	{
		socket_emit('slice_upload',
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

function upload_file(file, action)
{
	var date = Date.now()
						
	file.date = date

	file.action = action

	if(file.name !== undefined)
	{
		file.name = utilz.clean_string5(file.name).replace(/.gifv/g, ".gif")
	}

	else
	{
		file.name = "no_name"
	}

	file.reader = create_file_reader(file)

	var slice = file.slice(0, upload_slice_size)

	files[date] = file

	file.reader.readAsArrayBuffer(slice)

	chat_announce({brk1:'[', brk2:']', msg:`Uploading: 0%`, id:`uploading_${date}`})	
}

function is_textbox(element) 
{
	var tag_name = element.tagName.toLowerCase()

	if(tag_name === 'textarea') return true
	if(tag_name !== 'input') return false

	var type = element.getAttribute('type').toLowerCase(),

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

	return input_types.indexOf(type) !== -1
}

function copypaste_events()
{
	$(document).bind('copy', function(e) 
	{
		if(window.getSelection().toString() !== "")
		{
			setTimeout(function()
			{
				if(is_textbox(document.activeElement))
				{
					se = document.activeElement.selectionEnd
					document.activeElement.setSelectionRange(se, se)
				}

				else
				{
					window.getSelection().removeAllRanges()
					focus_input()
				}

			}, 200)
		}
	}) 
}

var double_tap_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			double_tap_key_pressed = 0
		}, 200)
	}
})()

var double_tap_2_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			double_tap_key_2_pressed = 0
		}, 200)
	}
})()

var double_tap_3_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			double_tap_key_3_pressed = 0
		}, 200)
	}
})()

function activate_key_detection()
{
	$(document).keydown(function(e)
	{
		if(!started)
		{
			return
		}

		if(e.key === double_tap_key)
		{
			double_tap_timer()
		}

		else if(e.key === double_tap_key_2)
		{
			double_tap_2_timer()
		}

		else if(e.key === double_tap_key_3)
		{
			double_tap_3_timer()
		}

		if(modal_open)
		{
			if(iup)
			{
				if(msg_image_picker.is_highest())
				{
					if(e.key === "Enter")
					{
						var val = $("#image_url_picker_input").val().trim()

						if(val !== "")
						{
							link_image(val)
							close_all_modals()
							e.preventDefault()
						}
					}
					
					return			
				}
			}

			if(tup)
			{
				if(msg_tv_picker.is_highest())
				{
					if(e.key === "Enter")
					{
						var val = $("#tv_url_picker_input").val().trim()

						if(val !== "")
						{
							change_tv_source(val)
							close_all_modals()
							e.preventDefault()
						}
					}
					
					return			
				}
			}		

			if(rup)
			{
				if(msg_radio_picker.is_highest())
				{
					if(e.key === "Enter")
					{
						var val = $("#radio_url_picker_input").val().trim()

						if(val !== "")
						{
							change_radio_source(val)
							close_all_modals()
							e.preventDefault()
						}
					}
					
					return			
				}
			}

			if(crm)
			{
				if(msg_info.is_highest())
				{
					if(e.key === "Enter")
					{
						create_room_submit()
						e.preventDefault()
					}
					
					return
				}
			}

			if(orb)
			{
				if(msg_info.is_highest())
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
					}
					
					e.preventDefault()
					return
				}
			}

			if(stu)
			{
				if(msg_info.is_highest())
				{
					if(e.key === "Tab" && e.shiftKey)
					{
						close_all_modals()
						e.preventDefault()
					}

					return
				}
			}

			if(gtr)
			{
				if(msg_info.is_highest())
				{
					if(e.key === "Enter")
					{
						goto_room_action()
						e.preventDefault()
					}

					return
				}
			}

			if(writing_whisper)
			{
				if(msg_whisper.is_highest())
				{
					if(e.key === "Enter")
					{
						send_whisper()
					}
					
					return
				}
			}

			if(modal_image_open)
			{
				if(msg_image.is_highest())
				{
					if(e.key === "ArrowLeft")
					{
						image_prev_click()
					}
					
					else if(e.key === "ArrowRight")
					{
						image_next_click()
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

		focus_input()

		if(e.key === "Enter")
		{
			if($("#input").val().length === 0)
			{
				goto_bottom(true)
			}

			else
			{
				send_to_chat($('#input').val())
			}

			e.preventDefault()
			return
		}

		else if(e.key === "ArrowUp")
		{
			if(e.shiftKey)
			{
				scroll_up(small_keyboard_scroll)
			}

			else
			{
				input_history_change("up")
			}

			e.preventDefault()
			return
		}		

		else if(e.key === "ArrowDown")
		{	
			if(e.shiftKey)
			{
				scroll_down(small_keyboard_scroll)
			}

			else
			{
				input_history_change("down")
			}

			e.preventDefault()
			return
		}

		else if(e.key === "PageUp")
		{
			scroll_up(big_keyboard_scroll)
			e.preventDefault()
			return			
		}

		else if(e.key === "PageDown")
		{
			scroll_down(big_keyboard_scroll)
			e.preventDefault()
			return			
		}

		else if(e.key === "Escape")
		{
			if(e.shiftKey)
			{
				clear_chat()
			}

			else
			{
				clear_input()

				reset_input_history_index()
			}

			e.preventDefault()
			return
		}

		else if(e.key === "Tab")
		{
			if(e.shiftKey)
			{
				show_status()
			}

			if(input.value.length > 0)
			{
				tabbed()
			}

			e.preventDefault()
			return
		}

		clear_tabbed()
	})

	$(document).keyup(function(e)
	{
		if(!started)
		{
			return
		}

		if(e.key === double_tap_key)
		{
			double_tap_key_pressed += 1

			if(double_tap_key_pressed === 2)
			{
				double_tap_key_pressed = 0
				on_double_tap()
			}
		}

		else
		{
			double_tap_key_pressed = 0
		}

		if(e.key === double_tap_key_2)
		{
			double_tap_key_2_pressed += 1

			if(double_tap_key_2_pressed === 2)
			{
				double_tap_key_2_pressed = 0
				on_double_tap_2()
			}
		}

		else
		{
			double_tap_key_2_pressed = 0
		}

		if(e.key === double_tap_key_3)
		{
			double_tap_key_3_pressed += 1

			if(double_tap_key_3_pressed === 2)
			{
				double_tap_key_3_pressed = 0
				on_double_tap_3()
			}
		}

		else
		{
			double_tap_key_3_pressed = 0
		}
	})	
}

function scroll_up(n)
{
	var $ch = $('#chat_area')
	$ch.scrollTop($ch.scrollTop() - n)
}

function scroll_down(n)
{
	var $ch = $('#chat_area')
	var max = $ch.prop('scrollHeight') - $ch.innerHeight()

	if(max - $ch.scrollTop < n)
	{
		$ch.scrollTop(max + 10)
	}

	else
	{
		$ch.scrollTop($ch.scrollTop() + n)
	}
}

function change_input(s, to_end=true, focus=true)
{
	$("#input").val(s)

	if(to_end)
	{
		input_to_end()
	}

	if(focus)
	{
		focus_input()
	}
}

function focus_input()
{
	$("#input").focus()
}

function blur_input()
{
	$("#input").blur()
}

function input_to_end()
{
	$('#input')[0].scrollLeft = $('#input')[0].scrollWidth
}

function add_to_input_history(msg, change_index=true)
{
	for(var i=0; i<input_history.length; i++)
	{
		if(input_history[i][0] === msg)
		{
			input_history.splice(i, 1)
			break
		}
	}

	var item = [msg, nice_date()]

	input_history.push(item)

	push_to_input_history_window(item)

	if(input_history.length > input_history_crop_limit)
	{
		input_history = input_history.slice(input_history.length - input_history_crop_limit)
		$(".input_history_item").last().remove()
	}

	if(change_index)
	{
		reset_input_history_index()
	}

	save_input_history()
}

function save_input_history()
{
	save_local_storage(ls_input_history, input_history)
}

function push_to_input_history_window(item, update_scrollbar=true)
{
	var c = `<div class='input_history_item' title='${item[1]}'>${item[0]}</div>`

	$("#input_history_container").prepend(c)
	
	if(update_scrollbar)
	{
		update_modal_scrollbar("input_history")	
	}
}

function get_input_history()
{
	input_history = get_local_storage(ls_input_history)

	if(input_history === null)
	{
		input_history = []
	}

	reset_input_history_index()

	for(var item of input_history)
	{
		push_to_input_history_window(item, false)
	}

	update_modal_scrollbar("input_history")
}

function reset_input_history_index()
{
	input_history_index = input_history.length
}

function input_history_change(direction)
{
	if(input_history.length === 0)
	{
		return false
	}

	if(input_changed)
	{
		input_changed = false

		var input_val = $("#input").val().trim()

		if(input_val !== "")
		{
			add_to_input_history(input_val, false)

			if(direction === "up")
			{
				input_history_index = input_history.length - 1
			}

			else
			{
				input_history_index = input_history.length
			}
		}
	}

	if(direction === "up")
	{
		input_history_index -= 1

		if(input_history_index === -2)
		{
			input_history_index = input_history.length - 1
		}

		else if(input_history_index === -1)
		{
			$("#input").val("")
			return
		}

		var v = input_history[input_history_index][0]
	}

	else
	{
		if(input_history_index < 0)
		{
			$("#input").val("")
			return
		}

		input_history_index += 1

		if(input_history_index > input_history.length - 1)
		{
			$("#input").val("")
			reset_input_history_index()
			return false
		}

		if(input_history_index >= input_history.length)
		{
			$("#input").val("")
			reset_input_history_index()
			return
		}

		var v = input_history[input_history_index][0]
	}

	change_input(v)
}

function setup_input_history()
{
	$("#input_history_container").on("click", ".input_history_item", function()
	{
		if($(this).find('a').length === 0)
		{
			change_input($(this).text())
			close_all_modals()
		}
	})	
}

function input_click_events()
{
	$('#input').on("click", function()
	{
		clear_tabbed()
	})
}

function clear_tabbed()
{
	tabbed_list = []
	tabbed_word = ""
	tabbed_start = 0
	tabbed_end = 0
}

function replaceBetween(str, start, end, what) 
{
	return str.substring(0, start) + what + str.substring(end)
}

function oiEquals(str, what) 
{
	return str === commands_sorted[what]
}

function oiStartsWith(str, what) 
{
	return str.startsWith(`${commands_sorted[what]} `)
}

function get_closest_username(word)
{
	word = word.toLowerCase()

	var has = false

	for(var i=0; i<usernames.length; i++)
	{
		var pw = usernames[i].toLowerCase()

		if(pw.startsWith(word))
		{
			has = true

			if(tabbed_list.indexOf(pw) === -1)
			{
				tabbed_list.push(pw)
				return usernames[i]
			}
		}
	}

	if(has)
	{
		tabbed_list = []
		return get_closest_username(word)
	}

	return ""
}

function get_closest_command(word)
{
	word = word.toLowerCase()

	var has = false

	for(var i=0; i<commands.length; i++)
	{
		var pw = commands[i]

		if(pw.startsWith(word))
		{
			has = true

			if(tabbed_list.indexOf(pw) === -1)
			{
				tabbed_list.push(pw)
				return commands[i]
			}
		}
	}

	if(has)
	{
		tabbed_list = []
		return get_closest_command(word)
	}

	return ""
}

function tabbed() 
{	
	if(tabbed_word !== "")
	{
		replace_tabbed(tabbed_word)
		return
	}

	var split = input.selectionStart
	var a = input.value.substring(0, split).match(/[^ ]*$/)[0]
	var b = input.value.substring(split).match(/^[^ ]*/)[0]
	var word = a + b

	tabbed_start = split - a.length
	tabbed_end = split + b.length

	if(word !== "")
	{
		tabbed_word = word
		replace_tabbed(word)
	}
}

function replace_tabbed(word)
{
	if(word[0] === '/')
	{
		var uname = get_closest_command(word)
	}

	else
	{
		var uname = get_closest_username(word)
	}
	
	if(uname !== "")
	{
		if(input.value[tabbed_end] === ' ')
		{
			input.value = replaceBetween(input.value, tabbed_start, tabbed_end, uname)
		}

		else
		{
			input.value = replaceBetween(input.value, tabbed_start, tabbed_end, `${uname} `)
		}

		var pos = tabbed_start + uname.length

		input.setSelectionRange(pos + 1, pos + 1)

		tabbed_start = pos - uname.length
		tabbed_end = pos
	}
}

function scroll_events()
{
	$('#chat_area').scroll(function()
	{
		scroll_timer()
	})
}

var scroll_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			check_scroll_notice()
		}, 200)
	}
})()

function check_scroll_notice()
{
	var $ch = $("#chat_area")
	var max = $ch.prop('scrollHeight') - $ch.innerHeight()

	if(max - $ch.scrollTop() > 10)
	{
		$('#scroll_notice').css('visibility', 'visible')
	}

	else
	{
		$('#scroll_notice').css('visibility', 'hidden')
	}
}

function resize_events()
{
	$(window).resize(function()
	{
		resize_timer()
	})
}

var resize_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			fix_visible_video_frame()
			update_chat_scrollbar()		
			goto_bottom()
		}, 350)
	}
})()

function setup_scrollbars()
{
	remove_chat_scrollbar()
	remove_modal_scrollbars()

	if(settings.custom_scrollbars)
	{
		start_chat_scrollbar()
		start_modal_scrollbars()
	}
	
	chat_scroll_bottom(false)
}

function start_chat_scrollbar()
{
	chat_scrollbar = new PerfectScrollbar("#chat_area",
	{
		minScrollbarLength: 50,
		suppressScrollX: true,
		scrollingThreshold: 3000
	})
}

function remove_chat_scrollbar()
{
	if(chat_scrollbar !== undefined)
	{
		if(chat_scrollbar.element !== null)
		{
			chat_scrollbar.destroy()
		}
	}
}

function update_chat_scrollbar()
{
	if(chat_scrollbar !== undefined)
	{
		if(chat_scrollbar.element !== null)
		{
			chat_scrollbar.update()
		}
	}
}

function start_modal_scrollbars()
{
	for(var instance of msg_menu.instances())
	{
		start_modal_scrollbar(instance.options.id)
	}
}

function remove_modal_scrollbars()
{
	for(var instance of msg_menu.instances())
	{
		remove_modal_scrollbar(instance.options.id)
	}
}

function start_modal_scrollbar(s)
{
	$(`#Msg-content-container-${s}`).niceScroll
	({
		zindex: 9999999,
		autohidemode: false,
		cursorcolor: "#AFAFAF",
		cursorborder: "0px solid white",
		cursorwidth: "7px"	
	})
}

function remove_modal_scrollbar(s)
{
	$(`#Msg-content-container-${s}`).getNiceScroll().remove()
}

function update_modal_scrollbar(s)
{
	$(`#Msg-content-container-${s}`).getNiceScroll().resize()	
}

function nice_date(date=Date.now())
{
	return dateFormat(date, "dddd, mmmm dS, yyyy, h:MM:ss TT")
}

function escape_special_characters(s)
{
	return s.replace(/[^A-Za-z0-9]/g, '\\$&');
}

function start_chat_click_events()
{
	$("#chat_area").on("click", ".chat_uname", function() 
	{
		show_profile($(this).text(), $(this).closest(".chat_message").find(".chat_profile_image").eq(0).attr("src"))
	})

	$("#chat_area").on("click", ".chat_profile_image", function() 
	{
		show_profile($(this).closest(".chat_message").find(".chat_uname").eq(0).text(), $(this).attr("src"))
	})	
}

function update_chat(args={})
{
	var def_args = 
	{
		uname: "",
		msg: "",
		prof_image: "",
		date: false
	}

	fill_defaults(args, def_args)

	if(args.msg.startsWith('//'))
	{
		args.msg = args.msg.slice(1)
	}

	var contclasses = "chat_content"

	var highlighted = false

	if(args.uname !== username)
	{
		if(check_highlights(args.msg))
		{
			contclasses += " dotted"
			alert_title2()
			highlighted = true		
		}
	}

	if(args.date)
	{
		d = args.date
	}

	else
	{
		d = Date.now()
	}

	var nd = nice_date(d)

	if(args.prof_image === "" || args.prof_image === undefined)
	{
		var pi = default_profile_image_url
	}

	else
	{
		var pi = args.prof_image
	}

	if(args.msg.startsWith('/me ') || args.msg.startsWith('/em '))
	{
		var s = `
		<div class='msg chat_message thirdperson'>
		*&nbsp;<span class='chat_uname'></span>
		&nbsp;<span class='${contclasses}' title='${nd}' data-date='${d}'></span>&nbsp;*</div>`

		var fmsg = $(s)

		fmsg.find('.chat_content').eq(0).text(args.msg.substr(4)).urlize()
	}

	else
	{
		var s = `
		<div class='msg chat_message'>
			<div class='chat_left_side'>
				<div class='chat_profile_image_container'>
					<img class='chat_profile_image' src='${pi}'>
				</div>
			</div>
			<div class='chat_right_side'>
				<span class='chat_uname_container'>
					<span class='chat_uname'></span>
				</span>
				<span class='chat_content_container'>
					<span class='${contclasses}' title='${nd}' data-date='${d}'></span>
				</span>
			</div>
		</div>`

		var fmsg = $(s)

		fmsg.find('.chat_content').eq(0).text(args.msg).urlize()
	}
	
	fmsg.find('.chat_uname').eq(0).text(args.uname)

	fmsg.find('.chat_profile_image').eq(0).on("error", function() 
	{
		if($(this).attr("src") !== default_profile_image_url)
		{
			$(this).attr("src", default_profile_image_url)
		}		
	})

	fmsg.data("highlighted", highlighted)
	fmsg.data("mode", "chat")

	add_to_chat(fmsg, true)

	if(args.uname !== username)
	{
		alert_title()
		sound_notify()
	}
}

function add_to_chat(msg, save=false)
{
	var chat_area = $('#chat_area')
	var last_msg = $(".msg").last()
	var appended = false
	var mode = msg.data("mode")

	if(mode === "chat")
	{
		var content = msg.find(".chat_content").eq(0)

		if(started)
		{
			content.addClass("fader")
		}
	}

	else
	{
		if(started)
		{
			msg.addClass("fader")
		}
	} 

	if((msg.hasClass("chat_message") && !msg.hasClass("thirdperson")) && (last_msg.hasClass("chat_message") && !last_msg.hasClass("thirdperson")))
	{
		if(msg.find(".chat_uname").eq(0).text() === last_msg.find(".chat_uname").eq(0).text())
		{
			if(last_msg.find(".chat_content").length < max_same_post_messages)
			{
				var date_diff = msg.find('.chat_content').last().data("date") - last_msg.find('.chat_content').last().data("date")

				if(date_diff < max_same_post_diff)
				{
					last_msg.find(".chat_content_container").eq(0).append("<br>").append(content)

					replace_in_chat_history(last_msg)

					if(!last_msg.data("highlighted"))
					{
						last_msg.data("highlighted", msg.data("highlighted"))
					}
					
					appended = true
				}
			}
		}
	}

	if(!appended)
	{
		chat_area.append(msg)
		
		if($(".msg").length > chat_crop_limit)
		{
			$("#chat_area > .msg").eq(0).remove()
		}
		
		if(save)
		{
			msg_id += 1
			msg.data("msg_id", msg_id)
			push_to_chat_history(msg)
		}
	}

	if(started)
	{
		update_chat_scrollbar()
		goto_bottom()
	}

	scroll_timer()

	if(started && msg.data("highlighted"))
	{
		electron_signal("highlighted")
	}
}

function push_to_chat_history(msg)
{
	chat_history.push(msg.clone(true, true))

	if(chat_history.length > chat_history_crop_limit)
	{
		chat_history = chat_history.slice(chat_history.length - chat_history_crop_limit)
	}
}

function replace_in_chat_history(msg)
{
	for(var i=0; i<chat_history.length; i++)
	{
		var msg2 = chat_history[i]

		if(msg.data("msg_id") === msg2.data("msg_id"))
		{
			chat_history[i] = msg
			return
		}
	}	
}

function change(args={})
{	
	var def_args = 
	{
		type: "",
		force: false,
		play: true,
		notify: true
	}

	fill_defaults(args, def_args)

	if(args.type === "image")
	{
		if(!args.force && last_image_change === image_url)
		{
			return false
		}
	}

	else if(args.type === "tv")
	{
		if(!args.force && last_tv_change === tv_source)
		{
			return false
		}
	}

	else if(args.type === "radio")
	{
		if(!args.force && last_radio_change === radio_source)
		{
			return false
		}
	}

	if(afk && args.type !== "radio")
	{
		change_when_focused = true

		if(args.type === "image")
		{
			change_image_when_focused = true
		}

		if(args.type === "tv")
		{
			change_tv_when_focused = true
		}

		return false
	}

	if(!first_tv_played)
	{
		args.play = false
	}

	var setter = ""

	if(args.type === "image")
	{
		if(!room_images_enabled || !room_settings.images_enabled || images_locked)
		{
			return false
		}

		show_image(args.force)

		last_image_change = image_url

		setter = image_uploader
	}

	else if(args.type === "tv")
	{
		if(!room_tv_enabled || !room_settings.tv_enabled || tv_locked)
		{
			return false
		}

		if(tv_type === "youtube")
		{
			if(youtube_video_player === undefined)
			{
				return false
			}

			show_youtube_video(args.play)
		}

		else if(tv_type === "twitch")
		{
			if(twitch_video_player === undefined)
			{
				return false
			}

			show_twitch_video(args.play)
		}
		
		else if(tv_type === "url")
		{
			show_video(args.play)
		}

		else
		{
			return false
		}

		first_tv_played = true
		last_tv_change = tv_source
		setter = tv_setter
	}

	else if(args.type === "radio")
	{
		if(!room_radio_enabled || !room_settings.radio_enabled || !radio_started || radio_locked)
		{
			return false
		}

		start_radio()

		setter = radio_setter
	}

	else
	{
		return false
	}

	if(args.notify && setter !== username)
	{
		alert_title()
		sound_notify()
	}
}

function show_image(force=false)
{
	$("#media_image_error").css("display", "none")

	$("#media_image").css("display", "initial")

	if(force || $("#media_image").attr("src") !== image_url)
	{
		$("#media_image").attr("src", image_url)
	}

	else
	{
		after_image_load($("#media_image")[0])
	}
}

function show_current_image_modal(current=true)
{
	if(current)
	{
		show_modal_image(current_image_url, current_image_title, current_image_date_raw)
	}

	else
	{
		var data = images_changed[images_changed.length - 1]
		show_modal_image(data.image_url, data.title, data.date_raw)
	}
}

function start_image_events()
{
	$('#media_image')[0].addEventListener('load', function(e)
	{
		after_image_load(e.target)
	})

	$('#media_image').on("error", function() 
	{
		$("#media_image").css("display", "none")
		$("#media_image_error").css("display", "initial")
	})	

	$('#test_image')[0].addEventListener('load', function() 
	{
		emit_linked_image($('#test_image').attr('src'))
	})

	$('#test_image').on("error", function() 
	{
		chat_announce({brk1:'[', brk2:']', msg:"The provided image URL failed to load"})	
	})
}

function after_image_load(img)
{
	current_image_url = image_url
	current_image_title = image_title
	current_image_date_raw = image_date_raw
}

function get_size_string(size)
{
	return `${parseFloat(size / 1024).toFixed(2)} MB`
}

function setup_image(data)
{
	if(data.image_url === '' || data.image_url === undefined)
	{
		image_url = default_image_url
		image_title = ""
	}

	else
	{
		image_url = data.image_url

		if(data.image_type === "link")
		{
			image_title = `Linker: ${data.image_uploader} | ${nice_date(data.image_date)}`
		}

		else
		{
			image_title = `Uploader: ${data.image_uploader} | Size: ${get_size_string(data.image_size)} | ${nice_date(data.image_date)}`
		}
	}

	image_uploader = data.image_uploader
	image_size = data.image_size
	image_date = nice_date(data.image_date)
	image_date_raw = data.image_date
	image_type = data.image_type

	change({type:"image"})
}

function fill_defaults(args, def_args)
{
	for(var key in def_args)
	{
		var d = def_args[key]

		if(args[key] === undefined)
		{
			args[key] = d
		}
	}
}

function chat_announce(args={})
{
	var def_args = 
	{
		brk1: "",
		brk2: "",
		msg: "",
		size: "small",
		highlight: false,
		title: false,
		onclick: false,
		save: false,
		id: false,
		date: false,
		type: "normal",
		info1: "",
		info2: ""
	}

	fill_defaults(args, def_args)

	var containerclasses = "announcement_content_container"

	if(args.onclick)
	{
		containerclasses += " pointer"
	}

	var containerid = " "

	if(args.id)
	{
		containerid = ` id='${args.id}' `
	}

	var contclasses = "announcement_content"

	if(args.highlight === true)
	{
		contclasses += " dotted"
		alert_title2()
		sound_notify()
	}

	if(args.title)
	{
		var t = `${args.title}`
	}

	else
	{
		var t = nice_date()
	}

	if(args.date)
	{
		d = args.date
	}

	else
	{
		d = Date.now()
	}	

	if(args.brk1 !== "")
	{
		var hbrk1 = `${args.brk1}&nbsp;`
	}

	else
	{
		hbrk1 = ""
	}

	if(args.brk2 !== "")
	{
		var hbrk2 = `&nbsp;${args.brk2}`
	}

	else
	{
		var hbrk2 = ""
	}

	var s = `
	<div${containerid}class='msg announcement announcement_${args.size}'>
		<span class='${containerclasses}' title='${t}'>${hbrk1}<span class='${contclasses}'></span>${hbrk2}</span>
	</div>`

	var fmsg = $(s)

	var content = fmsg.find('.announcement_content').eq(0)

	content.text(args.msg).urlize()

	if(args.onclick)
	{
		content.parent().on("click", args.onclick)
	}

	fmsg.data("highlighted", args.highlight)
	fmsg.data("type", args.type)
	fmsg.data("info1", args.info1)
	fmsg.data("info2", args.info2)
	fmsg.data("mode", "announcement")	

	add_to_chat(fmsg, args.save)

	if(args.type !== "normal")
	{
		handle_chat_announce_types(fmsg, args.type)
	}
}

function handle_chat_announce_types(msg, type)
{
	var media_history_types = ["image_change", "tv_change", "radio_change"]

	if(media_history_types.indexOf(type) !== -1)
	{
		var s = $("<div class='media_history_item'></div>")

		var item = s.html(msg.find(".announcement_content_container").eq(0).clone(true, true))

		if(type === "image_change")
		{
			$("#image_history_container").prepend(item)
			var els = $("#image_history_container").children()
			var t = "image"
		}

		else if(type === "tv_change")
		{
			$("#tv_history_container").prepend(item)
			var els = $("#tv_history_container").children()
			var t = "tv"
		}

		else if(type === "radio_change")
		{
			$("#radio_history_container").prepend(item)
			var els = $("#radio_history_container").children()
			var t = "radio"
		}

		else
		{
			return false
		}
	
		if(els.length > media_history_max_items)
		{
			els.last().remove()
		}

		if(type === "image")
		{
			if(image_history_filtered)
			{
				do_image_history_filter()			
			}
		}

		else if(type === "tv")
		{
			if(tv_history_filtered)	
			{
				do_tv_history_filter()
			}
		}

		else if(type === "radio")
		{
			if(radio_history_filtered)
			{
				do_radio_history_filter()
			}
		}	

		update_modal_scrollbar(`${t}_change`)	
	}
}

jQuery.fn.urlize = function(force=false) 
{
	if(this.length > 0) 
	{
		this.each(function(n, obj)
		{
			var x = $(obj).html()

			if(force)
			{
				x = `<a class='generic' target='_blank' href='${x}'>${x}</a>`
			}

			else
			{
				var list = x.match(/\bhttps?:\/\/\S+/g)

				if(list) 
				{
					for(var i=0; i<list.length; i++) 
					{
						x = x.replace(list[i], `<a class='generic' target='_blank' href='${list[i]}'>${list[i]}</a>`)
					}
				}
			}

			$(obj).html(x)
		})
	}
}

function msg_is_ok(msg)
{
	if(msg.length > 0 && msg.length <= max_input_length)
	{
		return true
	}

	else
	{
		return false
	}
}

function register_commands()
{
	commands.push('/me')
	commands.push('/clear')
	commands.push('/unclear')
	commands.push('/enableimages')
	commands.push('/disableimages')
	commands.push('/enabletv')
	commands.push('/disabletv')
	commands.push('/enableradio')
	commands.push('/disableradio')
	commands.push('/users')
	commands.push('/room')
	commands.push('/rooms')
	commands.push('/visited')
	commands.push('/roomname')
	commands.push('/roomnameedit')
	commands.push('/played')
	commands.push('/search')
	commands.push('/role')
	commands.push('/voice1')
	commands.push('/voice2')
	commands.push('/voice3')
	commands.push('/voice4')
	commands.push('/op')
	commands.push('/admin')
	commands.push('/resetvoices')
	commands.push('/removeops')
	commands.push('/ban')
	commands.push('/unban')
	commands.push('/unbanall')
	commands.push('/bannedcount')
	commands.push('/kick')
	commands.push('/public')
	commands.push('/private')
	commands.push('/log')
	commands.push('/enablelog')
	commands.push('/disablelog')
	commands.push('/clearlog')
	commands.push('/radio')
	commands.push('/tv')
	commands.push('/image')
	commands.push('/privacy')
	commands.push('/status')
	commands.push('/topic')
	commands.push('/topicadd')
	commands.push('/topictrim')
	commands.push('/topicaddstart')
	commands.push('/topictrimstart')
	commands.push('/topicedit')
	commands.push('/help3')
	commands.push('/help2')
	commands.push('/help')
	commands.push('/stopradio')
	commands.push('/startradio')
	commands.push('/volume')
	commands.push('/history')
	commands.push('/logout')
	commands.push('/details')
	commands.push('/changeusername')
	commands.push('/changepassword')
	commands.push('/changeemail')
	commands.push('/verifyemail')
	commands.push('/fill')
	commands.push('/shrug')
	commands.push('/afk')
	commands.push('/disconnectothers')
	commands.push('/whisper')
	commands.push('/annex')
	commands.push('/highlights')
	commands.push('/lock')
	commands.push('/unlock')
	commands.push('/stopandlock')
	commands.push('/default')
	commands.push('/menu')
	commands.push('/media')
	commands.push('/user')
	commands.push('/imagehistory')
	commands.push('/tvhistory')
	commands.push('/radiohistory')
	commands.push('/lockimages')
	commands.push('/locktv')
	commands.push('/lockradio')
	commands.push('/unlockimages')
	commands.push('/unlocktv')
	commands.push('/unlockradio')
	commands.push('/togglelockimages')
	commands.push('/togglelocktv')
	commands.push('/togglelockradio')
	commands.push('/showimages')
	commands.push('/showtv')
	commands.push('/showradio')
	commands.push('/hideimages')
	commands.push('/hidetv')
	commands.push('/hideradio')
	commands.push('/toggleimages')
	commands.push('/toggletv')
	commands.push('/toggleradio')
	commands.push('/test')
	commands.push('/maximizeimages')
	commands.push('/maximizetv')
	commands.push('/starttv')
	commands.push('/stoptv')
	commands.push('/openimage')
	commands.push('/openlastimage')
	commands.push('/date')
	commands.push('/js')

	commands.sort()

	for(var command of commands)
	{
		commands_sorted[command] = command.split('').sort().join('')
	}

	for(var key in commands_sorted)
	{
		var scmd1 = commands_sorted[key]

		for(var key2 in commands_sorted)
		{
			var scmd2 = commands_sorted[key2]

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

function send_to_chat(msg, to_history=true)
{
	msg = utilz.clean_string2(msg.substring(0, max_input_length))

	var clr_input = true

	if(msg_is_ok(msg))
	{
		if(msg[0] === '/' && !msg.startsWith('/me ') && !msg.startsWith('/em ') && !msg.startsWith('//'))
		{
			var a = msg.toLowerCase().split(' ')

			var lmsg = a[0].split('').sort().join('')

			if(a.length > 1)
			{
				lmsg += ' '

				var arg = msg.substring(lmsg.length)
			}

			if(oiEquals(lmsg, '/clear'))
			{
				clear_chat()
			}

			else if(oiEquals(lmsg, '/unclear'))
			{
				unclear_chat()
			}			

			else if(oiEquals(lmsg, '/enableimages'))
			{
				change_room_images_enabled(true)
			}

			else if(oiEquals(lmsg, '/disableimages'))
			{
				change_room_images_enabled(false)
			}

			else if(oiEquals(lmsg, '/enableradio'))
			{
				change_room_radio_enabled(true)
			}

			else if(oiEquals(lmsg, '/disableradio'))
			{
				change_room_radio_enabled(false)
			}

			else if(oiEquals(lmsg, '/enabletv'))
			{
				change_room_tv_enabled(true)
			}

			else if(oiEquals(lmsg, '/disabletv'))
			{
				change_room_tv_enabled(false)
			}								

			else if(oiEquals(lmsg, '/users'))
			{
				show_userlist()
			}

			else if(oiStartsWith(lmsg, '/users'))
			{
				show_userlist(arg)
			}

			else if(oiEquals(lmsg, '/rooms'))
			{
				request_roomlist()
			}

			else if(oiStartsWith(lmsg, '/rooms'))
			{
				request_roomlist(arg)
			}

			else if(oiEquals(lmsg, '/visited'))
			{
				request_visited_roomlist()
			}

			else if(oiStartsWith(lmsg, '/visited'))
			{
				request_visited_roomlist(arg)
			}

			else if(oiEquals(lmsg, '/roomname'))
			{
				show_room()
			}

			else if(oiStartsWith(lmsg, '/roomname'))
			{
				change_room_name(arg)
			}

			else if(oiEquals(lmsg, '/roomnameedit'))
			{
				room_name_edit()
				to_history = false
				clr_input = false
			}

			else if(oiEquals(lmsg, '/played'))
			{
				show_played()
			}

			else if(oiStartsWith(lmsg, '/played'))
			{
				show_played(arg)
			}

			else if(oiEquals(lmsg, '/search'))
			{
				show_chat_search()
			}			

			else if(oiStartsWith(lmsg, '/search'))
			{
				show_chat_search(arg)
			}

			else if(oiEquals(lmsg, '/role'))
			{
				show_role()
			}

			else if(oiStartsWith(lmsg, '/voice1'))
			{
				change_role(arg, "voice1")
			}

			else if(oiStartsWith(lmsg, '/voice2'))
			{
				change_role(arg, "voice2")
			}

			else if(oiStartsWith(lmsg, '/voice3'))
			{
				change_role(arg, "voice3")
			}

			else if(oiStartsWith(lmsg, '/voice4'))
			{
				change_role(arg, "voice4")
			}

			else if(oiStartsWith(lmsg, '/op'))
			{
				change_role(arg, "op")
			}

			else if(oiStartsWith(lmsg, '/admin'))
			{
				change_role(arg, "admin")
			}

			else if(oiEquals(lmsg, '/resetvoices'))
			{
				reset_voices()
			}

			else if(oiEquals(lmsg, '/removeops'))
			{
				remove_ops()
			}

			else if(oiStartsWith(lmsg, '/ban'))
			{
				ban(arg)
			}

			else if(oiStartsWith(lmsg, '/unban'))
			{
				unban(arg)
			}

			else if(oiEquals(lmsg, '/unbanall'))
			{
				unban_all()
			}

			else if(oiEquals(lmsg, '/bannedcount'))
			{
				get_banned_count()
			}

			else if(oiStartsWith(lmsg, '/kick'))
			{
				kick(arg)
			}

			else if(oiEquals(lmsg, '/public'))
			{
				change_privacy(true)
			}

			else if(oiEquals(lmsg, '/private'))
			{
				change_privacy(false)
			}

			else if(oiEquals(lmsg, '/log'))
			{
				show_log()
			}

			else if(oiEquals(lmsg, '/enablelog'))
			{
				change_log(true)
			}

			else if(oiEquals(lmsg, '/disablelog'))
			{
				change_log(false)
			}

			else if(oiEquals(lmsg, '/clearlog'))
			{
				clear_log()
			}

			else if(oiStartsWith(lmsg, '/radio'))
			{
				change_radio_source(arg)
			}

			else if(oiEquals(lmsg, '/radio'))
			{
				show_radio_source()
			}

			else if(oiStartsWith(lmsg, '/tv'))
			{
				change_tv_source(arg)
			}

			else if(oiStartsWith(lmsg, '/image'))
			{
				link_image(arg)
			}

			else if(oiEquals(lmsg, '/status'))
			{
				show_status()
			}

			else if(oiStartsWith(lmsg, '/topic'))
			{
				change_topic(arg)
			}

			else if(oiStartsWith(lmsg, '/topicadd'))
			{
				topicadd(arg)
			}

			else if(oiStartsWith(lmsg, '/topictrim'))
			{
				topictrim(arg)
			}

			else if(oiEquals(lmsg, '/topictrim'))
			{
				topictrim(1)
			}

			else if(oiStartsWith(lmsg, '/topicaddstart'))
			{
				topicstart(arg)
			}

			else if(oiStartsWith(lmsg, '/topictrimstart'))
			{
				topictrimstart(arg)
			}

			else if(oiEquals(lmsg, '/topictrimstart'))
			{
				topictrimstart(1)
			}			

			else if(oiEquals(lmsg, '/topicedit'))
			{
				topicedit()
				to_history = false
				clr_input = false
			}

			else if(oiEquals(lmsg, '/topic'))
			{
				show_topic()
			}

			else if(oiEquals(lmsg, '/room'))
			{
				show_room()
			}

			else if(oiEquals(lmsg, '/help3'))
			{
				help3()
			}

			else if(oiEquals(lmsg, '/help2'))
			{
				help2()
			}

			else if(oiEquals(lmsg, '/help') || oiEquals(lmsg, '/help1'))
			{
				help()
			}

			else if(oiEquals(lmsg, '/stopradio'))
			{
				stop_radio()
			}

			else if(oiEquals(lmsg, '/startradio'))
			{
				start_radio()
			}

			else if(oiStartsWith(lmsg, '/volume'))
			{
				change_volume_command(arg)
			}

			else if(oiEquals(lmsg, '/history'))
			{
				show_input_history()
			}

			else if(oiStartsWith(lmsg, '/history'))
			{
				show_input_history(arg)
			}

			else if(oiStartsWith(lmsg, '/changeusername'))
			{
				change_username(arg)
			}

			else if(oiStartsWith(lmsg, '/changepassword'))
			{
				change_password(arg)
			}

			else if(oiStartsWith(lmsg, '/changeemail'))
			{
				change_email(arg)
			}

			else if(oiStartsWith(lmsg, '/verifyemail'))
			{
				verify_email(arg)
			}

			else if(oiEquals(lmsg, '/details'))
			{
				show_details()
			}

			else if(oiEquals(lmsg, '/logout'))
			{
				logout()
			}

			else if(oiEquals(lmsg, '/fill'))
			{
				fill()
			}

			else if(oiEquals(lmsg, '/shrug'))
			{
				shrug()
			}

			else if(oiEquals(lmsg, '/afk'))
			{
				show_afk()
			}

			else if(oiEquals(lmsg, '/disconnectothers'))
			{
				disconnect_others()
			}

			else if(oiStartsWith(lmsg, '/whisper'))
			{
				write_whisper(arg)
			}

			else if(oiEquals(lmsg, '/annex'))
			{
				annex()
			}

			else if(oiStartsWith(lmsg, '/annex'))
			{
				annex(arg)
			}

			else if(oiEquals(lmsg, '/highlights'))
			{
				show_highlights()
			}

			else if(oiStartsWith(lmsg, '/highlights'))
			{
				show_highlights(arg)
			}

			else if(oiEquals(lmsg, '/lock'))
			{
				stop_and_lock(false)
			}

			else if(oiEquals(lmsg, '/unlock'))
			{
				default_media_state(false)
			}

			else if(oiEquals(lmsg, '/stopandlock'))
			{
				stop_and_lock()
			}

			else if(oiEquals(lmsg, '/default'))
			{
				default_media_state()
			}

			else if(oiEquals(lmsg, '/menu'))
			{
				show_main_menu()
			}

			else if(oiEquals(lmsg, '/media'))
			{
				show_media_menu()
			}

			else if(oiEquals(lmsg, '/user'))
			{
				show_userinfo()
			}

			else if(oiEquals(lmsg, '/imagehistory'))
			{
				show_image_history()
			}

			else if(oiStartsWith(lmsg, '/imagehistory'))
			{
				show_image_history(arg)
			}

			else if(oiEquals(lmsg, '/tvhistory'))
			{
				show_tv_history()
			}

			else if(oiStartsWith(lmsg, '/tvhistory'))
			{
				show_tv_history(arg)
			}

			else if(oiEquals(lmsg, '/radiohistory'))
			{
				show_radio_history()
			}

			else if(oiStartsWith(lmsg, '/radiohistory'))
			{
				show_radio_history(arg)
			}

			else if(oiEquals(lmsg, '/lockimages'))
			{
				toggle_lock_images(true)
			}

			else if(oiEquals(lmsg, '/locktv'))
			{
				toggle_lock_tv(true)
			}

			else if(oiEquals(lmsg, '/lockradio'))
			{
				toggle_lock_radio(true)
			}
			
			else if(oiEquals(lmsg, '/unlockimages'))
			{
				toggle_lock_images(false)
			}

			else if(oiEquals(lmsg, '/unlocktv'))
			{
				toggle_lock_tv(false)
			}

			else if(oiEquals(lmsg, '/unlockradio'))
			{
				toggle_lock_radio(false)
			}

			else if(oiEquals(lmsg, '/togglelockimages'))
			{
				toggle_lock_images()
			}

			else if(oiEquals(lmsg, '/togglelocktv'))
			{
				toggle_lock_tv()
			}

			else if(oiEquals(lmsg, '/togglelockradio'))
			{
				toggle_lock_radio()
			}

			else if(oiEquals(lmsg, '/showimages'))
			{
				toggle_images(true)
			}

			else if(oiEquals(lmsg, '/showtv'))
			{
				toggle_tv(true)
			}

			else if(oiEquals(lmsg, '/showradio'))
			{
				toggle_radio(true)
			}

			else if(oiEquals(lmsg, '/hideimages'))
			{
				toggle_images(false)
			}

			else if(oiEquals(lmsg, '/hidetv'))
			{
				toggle_tv(false)
			}

			else if(oiEquals(lmsg, '/hideradio'))
			{
				toggle_radio(false)
			}	

			else if(oiEquals(lmsg, '/toggleimages'))
			{
				toggle_images()
			}

			else if(oiEquals(lmsg, '/toggletv'))
			{
				toggle_tv()
			}

			else if(oiEquals(lmsg, '/toggleradio'))
			{
				toggle_radio()
			}

			else if(oiEquals(lmsg, '/test'))
			{
				do_test()
			}

			else if(oiEquals(lmsg, '/maximizeimages'))
			{
				maximize_images()
			}

			else if(oiEquals(lmsg, '/maximizetv'))
			{
				maximize_tv()
			}

			else if(oiEquals(lmsg, '/starttv'))
			{
				play_video()
			}

			else if(oiEquals(lmsg, '/stoptv'))
			{
				stop_videos()
			}

			else if(oiEquals(lmsg, '/openimage'))
			{
				show_current_image_modal()
			}

			else if(oiEquals(lmsg, '/openlastimage'))
			{
				show_current_image_modal(false)
			}

			else if(oiEquals(lmsg, '/date'))
			{
				show_current_date()
			}

			else if(oiStartsWith(lmsg, '/js'))
			{
				execute_javascript(arg)
			}

			else
			{
				chat_announce({brk1:'[', brk2:']', msg:"Invalid command. Use // to start a message with /"})
			}
		}

		else 
		{
			if(can_chat)
			{
				update_chat({uname:username, msg:msg, prof_image:profile_image})	
				socket_emit('sendchat', {msg:msg})
			}

			else
			{
				cant_chat()
			}
		}

		if(to_history)
		{
			add_to_input_history(msg)
		}
	}

	if(clr_input)
	{
		clear_input()
	}
}

function change_topic(dtopic)
{
	if(role === 'admin' || role === 'op')
	{
		dtopic = utilz.clean_string2(dtopic.substring(0, max_topic_length))

		if(dtopic.length > 0)
		{
			if(topic !== dtopic)
			{
				socket_emit('change_topic', {topic:dtopic})
			}

			else
			{
				chat_announce({brk1:'[', brk2:']', msg:"Topic is already set to that"})
			}
		}
	}

	else
	{
		not_an_op()
	}
}

function topicadd(arg)
{
	if(role === 'admin' || role === 'op')
	{
		arg = utilz.clean_string2(arg)

		if(arg.length === 0)
		{
			return
		}

		var ntopic = topic + topic_separator + arg

		if(ntopic.length > max_topic_length)
		{
			chat_announce({brk1:'[', brk2:']', msg:"There is no more room to add that to the topic"})
			return
		}

		change_topic(ntopic)
	}

	else
	{
		not_an_op()
	}
}

function topictrim(n)
{
	if(role === 'admin' || role === 'op')
	{
		var split = topic.split(topic_separator)

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
				chat_announce({brk1:'[', brk2:']', msg:"Argument must be a number"})
				return false
			}

			if(split.length > 1)
			{
				var t = split.slice(0, -n).join(topic_separator)

				if(t.length > 0)
				{
					change_topic(t)
				}
			}	
		}

		else
		{
			chat_announce({brk1:'[', brk2:']', msg:"Nothing to trim"})
		}
	}

	else
	{
		not_an_op()
	}
}

function topicstart(arg)
{
	if(role === 'admin' || role === 'op')
	{
		arg = utilz.clean_string2(arg)

		if(arg.length === 0)
		{
			return
		}

		var ntopic = arg + topic_separator + topic

		if(ntopic.length > max_topic_length)
		{
			chat_announce({brk1:'[', brk2:']', msg:"There is no more room to add that to the topic"})
			return
		}

		change_topic(ntopic)
	}

	else
	{
		not_an_op()
	}
}

function topictrimstart(n)
{
	if(role === 'admin' || role === 'op')
	{
		var split = topic.split(topic_separator)

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
				chat_announce({brk1:'[', brk2:']', msg:"Argument must be a number"})
				return false
			}

			if(split.length > 1)
			{
				var t = split.slice(n, split.length).join(topic_separator)

				if(t.length > 0)
				{
					change_topic(t)
				}
			}	
		}

		else
		{
			chat_announce({brk1:'[', brk2:']', msg:"Nothing to trim"})
		}
	}

	else
	{
		not_an_op()
	}
}

function topicedit()
{
	change_input(`/topic ${topic}`)
}

function announce_topic_change(data)
{
	if(data.topic !== topic)
	{
		var highlight = false

		if(data.topic_setter !== username)
		{
			if(check_highlights(data.topic))
			{
				highlight = true
			}
		}

		chat_announce({brk1:'~', brk2:'~', msg:`${data.topic_setter} changed the topic to: ${data.topic}`, highlight:highlight})

		set_topic_info(data)

		update_title()
	}
}

function announce_room_name_change(data)
{
	if(data.name !== room_name)
	{		
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} changed the room name to: ${data.name}`})

		room_name = data.name

		update_title()
	}
}

function announce_new_username(data)
{
	replace_uname_in_userlist(data.old_username, data.username)

	var show = check_permission(get_role(data.username), "chat")

	if(username === data.old_username)
	{
		set_username(data.username)

		if(show)
		{
			chat_announce({brk1:'~', brk2:'~', msg:`${data.old_username} is now known as ${username}`})
		}

		else
		{
			chat_announce({brk1:'[', brk2:']', msg:`You are now known as ${username}`})
		}
	}

	else
	{
		if(show)
		{
			chat_announce({brk1:'~', brk2:'~', msg:`${data.old_username} is now known as ${data.username}`})
		}
	}
}

function goto_bottom(force=false)
{
	var $ch = $("#chat_area")

	var max = $ch.prop('scrollHeight') - $ch.innerHeight()

	if(force)
	{
		$ch.scrollTop(max + 10)
		$('#scroll_notice').css('visibility', 'hidden')
	}

	else
	{
		if($('#scroll_notice').css('visibility') === 'hidden')
		{
			$ch.scrollTop(max + 10)
		}
	}
}

function emit_linked_image(url)
{	
	if(!can_images)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You don't have permission to link images"})
		return false
	}
	
	socket_emit('linked_image', {image_url:url})
}

function get_radio_metadata()
{	
	if(!room_settings.radio_enabled || !get_metadata || radio_type !== "radio")
	{
		return
	}

	try
	{
		$.get(radio_metadata,
		{

		},
		function(data)
		{
			if(!room_settings.radio_enabled || !get_metadata || radio_type !== "radio")
			{
				return
			}

			try
			{
				var source = false

				if(Array.isArray(data.icestats.source))
				{
					for(var i=0; i<data.icestats.source.length; i++)
					{
						var source = data.icestats.source[i]

						if(source.listenurl.indexOf(radio_source.split('/').pop()) !== -1)
						{
							if(source.artist !== undefined && source.title !== undefined)
							{
								break
							}
						}
					}
				}

				else if(data.icestats.source.listenurl.indexOf(radio_source.split('/').pop()) !== -1)
				{
					var source = data.icestats.source
				}

				else
				{
					show_playing_file()
					return false
				}

				if(!source || source.artist === undefined || source.title === undefined)
				{
					show_playing_file()
					return false
				}

				push_played({title:source.title, artist:source.artist})
			}

			catch(err)
			{
				show_playing_file()
				return false
			}

		}).fail(function(err, status) 
		{
			show_playing_file()
		})
	}

	catch(err)
	{
		show_playing_file()
	}
}

function show_playing_file()
{
	get_metadata = false
	
	var s = radio_source.split('/')

	if(s.length > 1)
	{
		push_played(false, {s1: s.pop(), s2:radio_source})
	}

	else
	{
		hide_now_playing()
	}
}

function start_played_click_events()
{
	$("#played").on("click", ".played_item", function() 
	{
		if($(this).data('q2') !== '')
		{
			goto_url($(this).data('q2'), "tab")
		}

		else
		{
			search_on('google', $(this).data('q'))
		}
	})
}

function push_played(info, info2=false)
{
	if(info)
	{
		var s = `${info.title} - ${info.artist}`
		var q = `"${info.title}" by "${info.artist}"`
		var q2 = ""
	}

	else
	{
		var s = info2.s1
		var q = info2.s1
		var q2 = info2.s2
	}

	if($("#now_playing").text() === s)
	{
		return
	}

	$('#now_playing').text(s)
	$('#now_playing_controls').data('q', q)

	if(played[played.length - 1] !== s)
	{
		var title = nice_date()
		
		var pi = "<div class='pititle'></div><div class='piartist'></div>"
		
		h = $(`<div title='${title}' class='played_item'>${pi}</div>`)

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

		h.data('q', q)
		h.data('q2', q2)
		
		$('#played').prepend(h)

		played.push(s)

		if(played.length > played_crop_limit)
		{
			var els = $('#played').children()
			els.slice(els.length - 1, els.length).remove()
			played.splice(0, 1)
		}

		if(played_filtered)
		{
			do_played_filter()
		}
		
		update_modal_scrollbar("played")
	}
		
	show_now_playing()					
}

function hide_now_playing()
{
	$('#now_playing_area').css('display', 'none')
}

function show_now_playing()
{
	$('#now_playing_area').css('display', 'inline-block')
}

function start_radio()
{
	if(radio_type === "radio")
	{
		if(radio_source)
		{
			$('#audio').attr('src', radio_source)
		}

		else
		{
			$('#audio').attr('src', default_radio_source)
		}
	}

	else if(radio_type === "youtube")
	{
		if(youtube_player !== undefined)
		{
			var id = utilz.get_youtube_id(radio_source)

			if(id[0] === "video")
			{
				youtube_player.loadVideoById({videoId:id[1], startSeconds:utilz.get_youtube_time(radio_source)})
			}

			else if(id[0] === "list")
			{
				youtube_player.loadPlaylist({list:id[1][0], index:id[1][1]})
			}

			else
			{
				return false
			}

			youtube_player.setVolume(get_nice_volume($("#audio")[0].volume))
		}

		else
		{
			return false
		}
	}

	$('#playing_icon').css('display', 'inline-block')
	$('#volume_area').css('display', 'inline-block')
	$('#toggle_now_playing_text').html('Stop Radio')

	radio_started = true

	last_radio_change = radio_source
}

function stop_radio()
{
	$('#audio').attr('src', '')
	
	if(youtube_player !== undefined)
	{
		youtube_player.stopVideo()
	}

	$('#playing_icon').css('display', 'none')
	$('#volume_area').css('display', 'none')
	$('#toggle_now_playing_text').html('Start Radio')

	radio_started = false
}

function toggle_radio_state()
{
	if(radio_started)
	{
		stop_radio()
	}

	else
	{
		start_radio()
	}
}

function start_metadata_loop()
{
	setInterval(function()
	{
		if(room_settings.radio_enabled && radio_type === "radio")
		{
			if(get_metadata)
			{
				get_radio_metadata()
			}

			else
			{
				no_meta_count += 1

				if(no_meta_count > max_no_meta_count)
				{
					get_metadata = true
					no_meta_count = 0
				}
			}
		}
	}, check_metadata_interval_duration)
}

function start_volume_scroll()
{
	$('#header')[0].addEventListener("wheel", function(e)
	{
		if(!radio_started)
		{
			return false
		}

		var direction = e.deltaY > 0 ? 'down' : 'up'

		if(direction === 'up')
		{
			volume_increase()
		}

		else if(direction === 'down')
		{
			volume_decrease()
		}
	})
}

function set_volume(nv, save=true)
{
	var vt = parseInt(Math.round((nv * 100)))

	$('#audio')[0].volume = nv

	if(youtube_player !== undefined)
	{
		youtube_player.setVolume(vt)
	}

	$('#volume').text(`${vt} %`)

	if(save)
	{
		save_local_storage('volume', nv)
	}
}

function volume_increase()
{
	var audio = $('#audio')[0]

	var nv = audio.volume + 0.1

	if(nv > 1)
	{
		nv = 1
	}

	set_volume(nv)
}

function volume_decrease()
{
	var audio = $('#audio')[0]

	var nv = audio.volume - 0.1

	if(nv < 0)
	{
		nv = 0
	}

	set_volume(nv)
}

function change_volume_command(arg)
{
	if(isNaN(arg))
	{
		chat_announce({brk1:'[', brk2:']', msg:"Argument must be a number"})
		return false
	}

	else
	{
		var nv = Math.round(arg / 10) * 10

		if(nv > 100)
		{
			nv = 100
		}

		if(nv < 0)
		{
			nv = 0
		}

		nv = nv / 100

		set_volume(nv)
	}
}

function sound_notify()
{
	if(!started)
	{
		return false
	}

	if(settings.sound_notifications)
	{
		if(document.hidden)
		{
			pup()
		}
	}
}

function alert_title()
{
	if(!started)
	{
		return false
	}

	if(document.hidden)
	{
		if(alert_mode === 0)
		{
			alert_mode = 1
			update_title()
		}
	}
}

function alert_title2()
{
	if(!started)
	{
		return false
	}

	if(document.hidden)
	{
		if(alert_mode !== 2)
		{
			alert_mode = 2
			update_title()
		}
	}
}

function remove_alert_title()
{
	if(alert_mode > 0)
	{
		alert_mode = 0
		update_title()
	}
}

function set_title(s)
{
	document.title = s.substring(0, max_title_length)
}

function update_title()
{
	var t = ""

	if(alert_mode === 1)
	{
		t += "(*) "
	}

	else if(alert_mode === 2)
	{
		t += "(!) "
	}

	t += room_name

	if(topic !== '')
	{
		t += ` ${title_separator} ${topic}`
	}

	set_title(t)
}

function activate_window_visibility_listener()
{
	document.addEventListener("visibilitychange", function()
	{
		if(!document.hidden)
		{
			if(afk_timer !== undefined)
			{
				clearTimeout(afk_timer)
			}

			afk = false

			remove_alert_title()

			if(change_when_focused)
			{
				if(change_image_when_focused)
				{
					change({type:"image"})
				}
				
				if(change_tv_when_focused)
				{
					change({type:"tv"})
				}

				change_image_when_focused = false
				change_tv_when_focused = false
			}
		}

		else
		{
			afk_timer = setTimeout(function(){afk = true}, afk_timeout_duration)
			update_chat_scrollbar()
			check_scroll_notice()
		}
	}, false)
}

function copy_room_url()
{
	if(room_id === main_room_id)
	{
		var r = ''
	}

	else
	{
		var r = room_name
	}

	var url = site_root + r

	url = url.replace(/\s+/g, "%20")

	copy_string(url)

	close_all_modals()
}

function copy_string(s)
{
	var textareaEl = document.createElement('textarea')

	document.body.appendChild(textareaEl)

	textareaEl.value = s
	textareaEl.select()

	document.execCommand('copy')
	document.body.removeChild(textareaEl)	
}

function pup()
{
	$('#pup')[0].play()
}

function main_menu_events()
{
	$('#main_menu').mousedown(function(e) 
	{
		if(e.which == 2) 
		{
			copy_room_url()
		}
	})
}

function word_generator(pattern) 
{
	var possibleC = "BCDFGHJKLMNPQRSTVWXZ"
	var possibleV = "AEIOUY"

	var pIndex = pattern.length
	var res = new Array(pIndex)

	while (pIndex--) 
	{
		res[pIndex] = pattern[pIndex]
		.replace(/v/,randomCharacter(possibleV))
		.replace(/c/,randomCharacter(possibleC))
	}

	function randomCharacter(bucket) 
	{
		var res = bucket.charAt(Math.floor(Math.random() * bucket.length))
		return res
	}

	return res.join("").toLowerCase()
}

function goto_url(u, mode="same", encode=false)
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
		window.location = u
	}	
}

function create_room(data)
{
	msg_info.close(function()
	{
		socket_emit('create_room', data)
	})
}

function refresh()
{
	window.location = window.location
}

function get_volume()
{
	var volume = get_local_storage('volume')

	if(volume == null)
	{
		set_volume(0.8)
		save_local_storage('volume', 0.8)
	}

	else
	{
		set_volume(volume, false)
	}

	return [volume, get_nice_volume(volume)]	
}

function get_nice_volume(volume)
{
	return parseInt(Math.round((volume * 100)))	
}

var chat_search_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			chat_search($("#chat_search_filter").val())
		}, 350)
	}
})()

function show_chat_search(filter=false)
{
	msg_chat_search.show(function()
	{
		if(filter)
		{
			chat_search(filter)
		}
		
		$("#chat_search_filter").focus()
	})
}

function reset_chat_search_filter()
{
	$("#chat_search_filter").val("")
	chat_search()
}

function chat_search(filter=false)
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

	if(!filter)
	{
		$("#chat_search_container").html("Search for chat messages")
		update_modal_scrollbar("info")		
		return
	}

	filter = filter.trim().toLowerCase()

	var c = $("<div></div>")

	if(chat_history.length > 0)
	{
		for(var msg of chat_history.slice(0).reverse())
		{
			var show = false
			
			var huname = msg.find('.chat_uname').eq(0)
			var hcontent_container = msg.find('.chat_content_container').eq(0)
			var hcontent = msg.find('.chat_content')

			if(huname.length !== 0 && hcontent.length !== 0)
			{
				var uname = huname.text()

				var content = ""

				hcontent.each(function()
				{
					content += `${msg.text()} `	
				})

				if(uname.toLowerCase().indexOf(filter) !== -1)
				{
					show = true
				}

				else if(content.toLowerCase().indexOf(filter) !== -1)
				{
					show = true
				}

				if(show)
				{
					var cn = $("<div class='chat_search_result_item'><div class='chat_search_result_uname generic_uname'></div><div class='chat_search_result_content'></div>")

					cn.find(".chat_search_result_uname").eq(0).text(huname.text())

					for(var i=0; i < hcontent.length; i++)
					{
						var hc = hcontent.get(i)

						if(i < hcontent.length - 1)
						{
							cn.find(".chat_search_result_content").eq(0).append($(hc).clone()).append("<br>")
						}

						else
						{
							cn.find(".chat_search_result_content").eq(0).append($(hc).clone())
						}
					}

					c.append(cn)
				}
			}

			else
			{
				var hcontent = msg.find(".announcement_content").eq(0)

				if(hcontent.length === 0)
				{
					continue
				}

				var content = hcontent.text()
				
				if(content.toLowerCase().indexOf(filter) === -1)
				{
					continue
				}

				var cn = $("<div class='chat_search_result_item'><div class='chat_search_result_content'></div>")

				cn.find(".chat_search_result_content").eq(0).html(hcontent.parent().clone(true, true))

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

	update_modal_scrollbar("chat_search")

	$('#Msg-content-container-search').scrollTop(0)	
}

function fix_chat_scroll()
{
	$("#chat_area").find(".ps__rail-x").eq(0).prependTo("#chat_area")
	$("#chat_area").find(".ps__rail-y").eq(0).prependTo("#chat_area")
}

function chat_scroll_bottom(force=true)
{
	update_chat_scrollbar()
	fix_chat_scroll()
	goto_bottom(force)
}

function clear_chat()
{
	$('#chat_area').html('<div><br><br><br><br></div>')

	show_log_messages()
	goto_bottom(true)
	focus_input()
}

function unclear_chat()
{
	clear_chat()

	if(chat_history.length === 0)
	{
		return false
	}
	
	for(var el of chat_history)
	{
		add_to_chat(el.clone(true, true), false, false)
	}

	chat_scroll_bottom()
}

function clear_input()
{
	$('#input').val("")
	old_input_val = ""
}

function add_to_input(what)
{
	$('#input').val(`${$('#input').val() + what} `).focus()
}

function set_topic_info(data)
{
	if(!data)
	{
		data = {}

		data.topic = ""
		data.topic_setter = ""
		data.topic_date = ""
	}

	topic = data.topic
	topic_setter = data.topic_setter
	topic_date = nice_date(data.topic_date)


	if(topic)
	{
		$("#header_topic_text").text(topic)
		$("#header_topic").attr('title', topic)
	}

	else
	{
		var t = get_unset_topic()

		$("#header_topic_text").text(t)
		$("#header_topic").attr('title', t)
	}
}

function check_firstime()
{
	if(get_local_storage(ls_first_time) === null)
	{
		show_intro()
		save_local_storage(ls_first_time, false)
	}
}

function big_letter(s)
{
	return s.toUpperCase()[0]
}

function change_role(uname, rol)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_max_username_length)
		{
			if(uname === username)
			{
				chat_announce({brk1:'[', brk2:']', msg:"You can't assign a role to yourself"})
				return false
			}

			if((rol === 'admin' || rol === 'op') && role !== 'admin')
			{
				forbiddenuser()
				return false
			}

			if(roles.indexOf(rol) === -1)
			{
				chat_announce({brk1:'[', brk2:']', msg:"Invalid role"})
				return false				
			}

			socket_emit('change_role', {username:uname, role:rol})
		}
	}

	else
	{
		not_an_op()
	}
}

function show_upload_error()
{
	chat_announce({brk1:'[', brk2:']', msg:"The image could not be uploaded"})
}

function announce_image_change(data, date=false)
{
	if(date)
	{
		var d = date
	}

	else
	{
		if(data.image_date !== undefined)
		{
			var d = data.image_date
		}

		else
		{
			var d = Date.now()
		}
	}
	
	var nd = nice_date(d)

	if(data.image_type === "link")
	{
		var title = `Linker: ${data.image_uploader} | ${nd}`
		var msg = `${data.image_uploader} linked an image`	
	}

	else
	{
		var title = `Uploader: ${data.image_uploader} | Size: ${get_size_string(data.image_size)} | ${nd}`
		var msg = `${data.image_uploader} uploaded an image`
	}

	var onclick = function()
	{
		show_modal_image(data.image_url, title, d)
	}

	chat_announce(
	{
		brk1: "<i class='icon2 fa fa-camera'></i>", 
		msg: msg, 
		title: title, 
		onclick: onclick, 
		save: true, 
		date: d, 
		type: "image_change"
	})

	data.title = title
	data.date_raw = d

	push_images_changed(data)
}

function push_images_changed(data)
{
	images_changed.push(data)

	if(images_changed.length > images_changed_crop_limit)
	{
		images_changed = images_changed.slice(images_changed.length - images_changed_crop_limit)
	}
}

function announce_role_change(data)
{
	if(username === data.username2)
	{
		set_role(data.role)
	}

	chat_announce({brk1:'~', brk2:'~', msg:`${data.username1} gave ${data.role} to ${data.username2}`})

	replace_role_in_userlist(data.username2, data.role)	
}

function set_role(p)
{
	role = p

	check_permissions()
}

function change_privacy(what)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(is_public === what)
	{
		if(what)
		{
			chat_announce({brk1:'[', brk2:']', msg:"Room is already public"})
		}

		else
		{
			chat_announce({brk1:'[', brk2:']', msg:"Room is already private"})
		}
	}

	socket_emit('change_privacy', {what:what})
}

function announce_privacy_change(data)
{
	is_public = data.what

	if(is_public)
	{
		var s = `${data.username} made the room public`
		s += ". The room won't appear in the public room list"
	}

	else
	{
		var s = `${data.username} made the room private`
		s += ". The room will appear in the public room list"
	}
	
	chat_announce({brk1:'~', brk2:'~', msg:s})
}

function change_radio_source(src)
{
	if(can_radio)
	{
		if(src.startsWith("http://") || src.startsWith("https://") || src === "default")
		{
			if(src.indexOf("youtube.com") !== -1 || src.indexOf("youtu.be") !== -1)
			{
				if(!youtube_enabled)
				{
					chat_announce({brk1:'[', brk2:']', msg:"Invalid radio source"})
					return
				}
			}
		}

		else if(src !== "restart" && src !== "reset")
		{
			if(!youtube_enabled)
			{
				chat_announce({brk1:'[', brk2:']', msg:"Invalid radio source"})
				return
			}
		}

		if(src.length > 0 && src.length <= max_radio_source_length)
		{
			socket_emit('change_radio_source', {src:src})
		}
	}

	else
	{
		chat_announce({brk1:'[', brk2:']', msg:"You don't have permission to change the radio"})
	}
}

function announce_radio_change(data, date=false, action="change")
{
	if(data.radio_title !== "")
	{
		var name = data.radio_title
	}

	else if(data.radio_source == '')
	{
		var name = 'default'
	}

	else
	{
		var name = data.radio_source
	}

	if(data.radio_source === '')
	{
		var source = default_radio_source
	}

	else
	{
		var source = data.radio_source
	}

	if(date)
	{
		var d = date
	}

	else
	{
		if(data.radio_date !== undefined)
		{
			var d = data.radio_date
		}

		else
		{
			var d = Date.now()
		}
	}

	if(action === "restart")
	{
		var action = `${data.username} restarted the radio`
	}

	else
	{
		var action = `${data.radio_setter} changed the radio to ${name}`
	}	
	
	var nd = nice_date(d)

	var title = `Setter: ${data.radio_setter} | ${nd}`

	var onclick = function()
	{
		goto_url(source, "tab")
	}

	chat_announce(
	{
		brk1: "<i class='icon2 fa fa-volume-up'></i>", 
		msg: action, 
		title: title, 
		onclick: onclick, 
		save: true, 
		date: d, 
		type: "radio_change"
	})
}

function change_tv_source(src)
{
	if(can_tv)
	{
		if(src.startsWith("http://") || src.startsWith("https://") || src === "default")
		{
			if(src.indexOf("youtube.com") !== -1 || src.indexOf("youtu.be") !== -1)
			{
				if(utilz.get_youtube_id(src) && !youtube_enabled)
				{
					chat_announce({brk1:'[', brk2:']', msg:"YouTube support is not enabled"})
					return
				}
			}

			else if(src.indexOf("twitch.tv") !== -1)
			{
				if(utilz.get_twitch_id(src) && !twitch_enabled)
				{
					chat_announce({brk1:'[', brk2:']', msg:"Twitch support is not enabled"})
					return
				}
			}
		}

		else if(src !== "restart" && src !== "reset")
		{
			if(!youtube_enabled)
			{
				chat_announce({brk1:'[', brk2:']', msg:"YouTube support is not enabled"})
				return
			}
		}

		if(src.length > 0 && src.length <= max_tv_source_length)
		{
			socket_emit('change_tv_source', {src:src})
		}
	}

	else
	{
		chat_announce({brk1:'[', brk2:']', msg:"You don't have permission to change the tv"})
	}
}

function announce_tv_change(data, date=false, action="change")
{
	if(data.tv_title !== "")
	{
		var name = data.tv_title
	}

	else if(data.tv_source == '')
	{
		var name = 'default'
	}	

	else
	{
		var name = data.tv_source
	}

	if(date)
	{
		var d = date
	}

	else
	{
		if(data.tv_date !== undefined)
		{
			var d = data.tv_date
		}

		else
		{
			var d = Date.now()
		}
	}
	
	var nd = nice_date(d)

	var title = `Setter: ${data.tv_setter} | ${nd}`

	var onclick = function()
	{
		goto_url(data.tv_source, "tab")
	}

	if(action === "restart")
	{
		var action = `${data.username} restarted the tv`
	}

	else
	{
		var action = `${data.tv_setter} changed the tv to ${name}`
	}

	chat_announce(
	{
		brk1: "<i class='icon2 fa fa-television'></i>", 
		msg: action, 
		title: title, 
		onclick: onclick, 
		save: true, 
		date: d, 
		type: "tv_change"
	})
}

function ban(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_max_username_length)
		{
			if(uname === username)
			{
				chat_announce({brk1:'[', brk2:']', msg:"You can't ban yourself"})
				return false
			}

			socket_emit('ban', {username:uname})
		}
	}

	else
	{
		not_an_op()
	}
}

function unban(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_max_username_length)
		{
			if(uname === username)
			{
				chat_announce({brk1:'[', brk2:']', msg:"You can't unban yourself"})
				return false
			}

			socket_emit('unban', {username:uname})
		}
	}

	else
	{
		not_an_op()
	}
}

function unban_all()
{
	if(role === 'admin' || role === 'op')
	{
		socket_emit('unban_all', {})
	}

	else
	{
		not_an_op()
	}
}

function get_banned_count()
{
	if(role === 'admin' || role === 'op')
	{
		socket_emit('get_banned_count', {})
	}
}

function receive_banned_count(data)
{
	if(data.count === 1)
	{
		var s = `There is ${data.count} user banned`
	}

	else
	{
		var s = `There are ${data.count} users banned`
	}

	msg_info.show(s)
}

function kick(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_max_username_length)
		{
			if(uname === username)
			{
				chat_announce({brk1:'[', brk2:']', msg:"You can't kick yourself"})
				return false
			}

			if(usernames.indexOf(uname) === -1)
			{
				user_not_in_room()
				return false
			}

			var rol = get_role(uname)

			if((rol === 'admin' || rol === 'op') && role !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('kick', {username:uname})
		}
	}

	else 
	{
		not_an_op()
	}
}

function announce_unban_all(data)
{
	chat_announce({brk1:'~', brk2:'~', msg:`${data.username} unbanned all banned users`})
}

function isalready(who, what)
{
	if(what === 'voice1')
	{
		chat_announce({brk1:'[', brk2:']', msg:`${who} already has voice 1`})
	}

	else if(what === 'voice2')
	{
		chat_announce({brk1:'[', brk2:']', msg:`${who} already has voice 2`})
	}

	else if(what === 'voice3')
	{
		chat_announce({brk1:'[', brk2:']', msg:`${who} already has voice 3`})
	}

	else if(what === 'voice4')
	{
		chat_announce({brk1:'[', brk2:']', msg:`${who} already has voice 4`})
	}

	else if(what === 'op')
	{
		chat_announce({brk1:'[', brk2:']', msg:`${who} is already an op`})
	}

	else if(what === 'admin')
	{
		chat_announce({brk1:'[', brk2:']', msg:`${who} is already an admin`})
	}
}

function forbiddenuser()
{
	chat_announce({brk1:'[', brk2:']', msg:"That operation is forbidden on that user"})
}

function search_on(site, q)
{
	q = encodeURIComponent(q)

	if(site === 'google')
	{
		goto_url(`https://www.google.com/search?q=${q}`, "tab")
	}

	else if(site === 'soundcloud')
	{
		goto_url(`https://soundcloud.com/search?q=${q}`, "tab")
	}

	else if(site === 'youtube')
	{
		goto_url(`https://www.youtube.com/results?search_query=${q}`, "tab")
	}
}

function reset_voices()
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return false
	}

	socket_emit('reset_voices', {})
}

function remove_ops()
{
	if(role !== 'admin')
	{
		chat_announce({brk1:'[', brk2:']', msg:"You are not a room admin"})
		return false
	}

	socket_emit('remove_ops', {})
}

function announce_voices_resetted(data)
{
	chat_announce({brk1:'~', brk2:'~', msg:`${data.username} resetted the voices`})

	if(role.startsWith('voice') && role !== "voice1")
	{
		set_role("voice1")
	}

	reset_voices_userlist()
}

function announce_removedops(data)
{
	chat_announce({brk1:'~', brk2:'~', msg:`${data.username} removed all ops`})

	if(role === 'op')
	{
		set_role("voice1")
	}

	remove_ops_userlist()
}

function disconnected(data)
{
	removefrom_userlist(data.username)

	if(announce_parts && check_permission(data.role, "chat"))
	{
		chat_announce({brk1:'--', brk2:'--', msg:`${data.username} has left`, save:true})
	}
}

function pinged(data)
{
	removefrom_userlist(data.username)

	if(announce_parts && check_permission(data.role, "chat"))
	{
		chat_announce({brk1:'--', brk2:'--', msg:`${data.username} has left (Ping Timeout)`, save:true})
	}
}

function kicked(data)
{
	removefrom_userlist(data.username)

	chat_announce({brk1:'--', brk2:'--', msg:`${data.username} was kicked by ${data.info1}`, save:true})
}

function banned(data)
{
	removefrom_userlist(data.username)

	chat_announce({brk1:'--', brk2:'--', msg:`${data.username} was banned by ${data.info1}`, save:true})
}

function start_msg()
{
	var common = 
	{
		show_effect_duration: [200, 200],
		close_effect_duration: [200, 200],
		clear_editables: true
	}

	if(settings.modal_effects)
	{
		common.show_effect = "fade"
		common.close_effect = "fade"
	}

	else
	{
		common.show_effect = "none"
		common.close_effect = "none"
	}

	msg_menu = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "menu",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
			}
		})
	)

	msg_userinfo = Msg.factory
	(
		Object.assign({}, common,
		{		
			id: "userinfo",
			clear_editables: false,
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
			}
		})
	)

	msg_userlist = Msg.factory
	(
		Object.assign({}, common,
		{		
			id: "userlist",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_userlist_filter()
			}
		})
	)

	msg_roomlist = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "roomlist",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
			}
		})
	)

	msg_played = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "played",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_played_filter()
			}
		})
	)

	msg_image = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "image",
			window_x: "floating_right",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
				modal_image_open = true
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				modal_image_open = false
			}
		})
	)

	msg_profile = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "profile",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)

				$("#show_profile_uname").text("Loading")
				$("#show_profile_image").attr("src", default_profile_image_url)
			}
		})
	)

	msg_info = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "info",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			before_show: function(instance)
			{
				info_vars_to_false()
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				instance.content.innerHTML = ""
				info_vars_to_false()
			}
		})
	)

	msg_image_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "image_picker",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
				iup = true
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				$("#image_url_picker_input").val("")
				iup = false
			}
		})
	)

	msg_tv_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "tv_picker",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
				tup = true
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				$("#tv_url_picker_input").val("")
				tup = false
			}
		})
	)

	msg_radio_picker = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "radio_picker",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
				rup = true
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				$("#radio_url_picker_input").val("")
				rup = false
			}
		})
	)

	msg_media_menu = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "media_menu",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
			}
		})
	)

	msg_whisper = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "whisper",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
				writing_whisper = true
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				$("#write_whisper_area").val("")
				$("#write_whisper_feedback").text("")
				after_modal_close(instance)
				writing_whisper = false
			}
		})
	)

	msg_highlights = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "highlights",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				$("#highlights_filter").val("")
			}
		})
	)

	msg_image_history = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "image_history",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_image_history_filter()				
			}
		})
	)

	msg_tv_history = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "tv_history",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_tv_history_filter()				
			}
		})
	)

	msg_radio_history = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "radio_history",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_radio_history_filter()				
			}
		})
	)

	msg_input_history = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "input_history",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_input_history_filter()
			}
		})
	)

	msg_chat_search = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "chat_search",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_chat_search_filter()
			}
		})
	)

	msg_locked = Msg.factory
	(
		Object.assign({}, common,
		{
			id: "locked",
			closeable: false,
			window_x: "none",
			show_effect: "none",
			close_effect: "none",
			enable_overlay: false,
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				after_modal_close(instance)
				reset_chat_search_filter()
			}
		})
	)

	msg_menu.set(template_menu())
	msg_userinfo.set(template_userinfo())
	msg_userlist.set(template_userlist())
	msg_roomlist.set(template_roomlist())
	msg_played.set(template_played())
	msg_profile.set(template_profile({profile_image: default_profile_image_url}))
	msg_image_picker.set(template_image_picker())
	msg_tv_picker.set(template_tv_picker())
	msg_radio_picker.set(template_radio_picker())
	msg_media_menu.set(template_media_menu())
	msg_whisper.set(template_whisper())
	msg_highlights.set(template_highlights())
	msg_image_history.set(template_image_history())
	msg_tv_history.set(template_tv_history())
	msg_radio_history.set(template_radio_history())
	msg_input_history.set(template_input_history())
	msg_chat_search.set(template_chat_search())
	msg_image.set(template_image())
	msg_locked.set(template_locked_menu())

	msg_info.create()

	setup_image_overlay()
}

function info_vars_to_false()
{
	crm = false
	orb = false
	stu = false
	gtr = false
}

function after_modal_create(instance)
{
	if(settings.custom_scrollbars)
	{
		start_modal_scrollbar(instance.options.id)
	}	
}

function after_modal_show(instance)
{
	modal_open = true
	blur_input()
}

function after_modal_set_or_show(instance)
{
	update_modal_scrollbar(instance.options.id)

	setTimeout(function()
	{
		instance.content_container.scrollTop = 0
	}, 100)
}

function after_modal_close(instance)
{
	if(!msg_menu.any_open())
	{
		modal_open = false
		focus_input()
	}
}

function close_all_modals()
{
	msg_menu.close_all()
}

function get_settings()
{
	var changed = false

	settings = get_local_storage(ls_settings)

	if(settings === null)
	{
		settings = {}
	}

	if(settings.background_image === undefined)
	{
		settings.background_image = settings_default_background_image
		changed = true
	}
	
	if(settings.custom_scrollbars === undefined)
	{
		settings.custom_scrollbars = settings_default_custom_scrollbars
		changed = true
	}

	if(settings.sound_notifications === undefined)
	{
		settings.sound_notifications = settings_default_sound_notifications
		changed = true
	}

	if(settings.modal_effects === undefined)
	{
		settings.modal_effects = settings_default_modal_effects
		changed = true
	}

	if(settings.highlight_current_username === undefined)
	{
		settings.highlight_current_username = settings_default_highlight_current_username
		changed = true
	}

	if(settings.case_insensitive_highlights === undefined)
	{
		settings.case_insensitive_highlights = settings_default_case_insensitive_highlights
		changed = true
	}

	if(settings.other_words_to_highlight === undefined)
	{
		settings.other_words_to_highlight = settings_default_other_words_to_highlight
		changed = true
	}

	if(settings.double_tap === undefined)
	{
		settings.double_tap = settings_default_double_tap
		changed = true
	}

	if(settings.double_tap_2 === undefined)
	{
		settings.double_tap_2 = settings_default_double_tap_2
		changed = true
	}

	if(settings.double_tap_3 === undefined)
	{
		settings.double_tap_3 = settings_default_double_tap_3
		changed = true
	}

	if(changed)
	{
		save_settings()
	}
}

function save_settings()
{
	save_local_storage(ls_settings, settings)
}

function start_settings_state()
{
	$("#setting_background_image").prop("checked", settings.background_image)
	$("#setting_custom_scrollbars").prop("checked", settings.custom_scrollbars)
	$("#setting_sound_notifications").prop("checked", settings.sound_notifications)
	$("#setting_modal_effects").prop("checked", settings.modal_effects)
	$("#setting_highlight_current_username").prop("checked", settings.highlight_current_username)
	$("#setting_case_insensitive_highlights").prop("checked", settings.case_insensitive_highlights)
	$("#setting_other_words_to_highlight").val(settings.other_words_to_highlight)
	$("#setting_double_tap").val(settings.double_tap)
	$("#setting_double_tap_2").val(settings.double_tap_2)
	$("#setting_double_tap_3").val(settings.double_tap_3)
}

function start_settings_listeners()
{
	$("#setting_background_image").change(setting_background_image_action)
	$("#setting_custom_scrollbars").change(setting_custom_scrollbars_action)
	$("#setting_sound_notifications").change(setting_sound_notifications_action)
	$("#setting_modal_effects").change(setting_modal_effects_action)
	$("#setting_highlight_current_username").change(setting_highlight_current_username_action)
	$("#setting_case_insensitive_highlights").change(setting_case_insensitive_highlights_action)
	$("#setting_other_words_to_highlight").blur(setting_other_words_to_highlight_action)
	$("#setting_double_tap").blur(setting_double_tap_action)
	$("#setting_double_tap_2").blur(setting_double_tap_2_action)
	$("#setting_double_tap_3").blur(setting_double_tap_3_action)
}

function call_setting_actions(save=true)
{
	setting_background_image_action(save)
	setting_custom_scrollbars_action(save)
	setting_sound_notifications_action(save)
	setting_modal_effects_action(save)
	setting_highlight_current_username_action(save)
	setting_case_insensitive_highlights_action(save)
	setting_other_words_to_highlight_action(save)
	setting_double_tap_action(save)
	setting_double_tap_2_action(save)
	setting_double_tap_3_action(save)	
}

function setting_background_image_action(save=true)
{
	settings.background_image = $("#setting_background_image").prop("checked")
	set_default_theme()
	
	if(save)
	{
		save_settings()
	}
}

function setting_custom_scrollbars_action(save=true)
{
	settings.custom_scrollbars = $("#setting_custom_scrollbars").prop("checked")
	setup_scrollbars()
	
	if(save)
	{
		save_settings()	
	}
}

function setting_sound_notifications_action(save=true)
{
	settings.sound_notifications = $("#setting_sound_notifications").prop("checked")
	
	if(save)
	{
		save_settings()	
	}
}

function setting_modal_effects_action(save=true)
{
	settings.modal_effects = $("#setting_modal_effects").prop("checked")

	for(var instance of msg_menu.instances())
	{
		if(settings.modal_effects)
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
	
	if(save)
	{
		save_settings()	
	}
}

function setting_highlight_current_username_action(save=true)
{
	settings.highlight_current_username = $("#setting_highlight_current_username").prop("checked")
	
	if(save)
	{
		save_settings()	
	}
}

function setting_case_insensitive_highlights_action(save=true)
{
	settings.case_insensitive_highlights = $("#setting_case_insensitive_highlights").prop("checked")
	generate_mentions_regex()
	generate_highlight_words_regex()
	
	if(save)
	{
		save_settings()	
	}
}

function setting_other_words_to_highlight_action(save=true)
{
	var words = utilz.clean_string7($("#setting_other_words_to_highlight").val())

	$("#setting_other_words_to_highlight").val(words)

	if(settings.other_words_to_highlight !== words)
	{
		settings.other_words_to_highlight = words
		generate_highlight_words_regex()
		
		if(save)
		{
			save_settings()
		}
	}	
}

function setting_double_tap_action(save=true)
{
	var cmd = utilz.clean_string2($("#setting_double_tap").val())

	$("#setting_double_tap").val(cmd)

	if(settings.double_tap !== cmd)
	{
		settings.double_tap = cmd
		
		if(save)
		{
			save_settings()
		}
	}	
}

function setting_double_tap_2_action(save=true)
{
	var cmd = utilz.clean_string2($("#setting_double_tap_2").val())

	$("#setting_double_tap_2").val(cmd)

	if(settings.double_tap_2 !== cmd)
	{
		settings.double_tap_2 = cmd
		
		if(save)
		{
			save_settings()
		}
	}	
}

function setting_double_tap_3_action(save=true)
{
	var cmd = utilz.clean_string2($("#setting_double_tap_3").val())

	$("#setting_double_tap_3").val(cmd)

	if(settings.double_tap_3 !== cmd)
	{
		settings.double_tap_3 = cmd
		
		if(save)
		{
			save_settings()
		}
	}	
}

function get_room_settings()
{
	var room_settings_all = get_local_storage(ls_room_settings)

	if(room_settings_all === null)
	{
		room_settings_all = {}
	}

	room_settings = room_settings_all[room_id]

	if(room_settings === undefined)
	{
		room_settings = {}
	}

	var changed = false

	if(room_settings.images_enabled === undefined)
	{
		room_settings.images_enabled = room_settings_default_images_enabled
		changed = true
	}

	if(room_settings.tv_enabled === undefined)
	{
		room_settings.tv_enabled = room_settings_default_tv_enabled
		changed = true
	}

	if(room_settings.radio_enabled === undefined)
	{
		room_settings.radio_enabled = room_settings_default_radio_enabled
		changed = true
	}

	if(changed)
	{
		save_room_settings()
	}
}

function save_room_settings()
{
	var room_settings_all = get_local_storage(ls_room_settings)

	if(room_settings_all === null)
	{
		room_settings_all = {}
	}

	room_settings_all[room_id] = room_settings

	save_local_storage(ls_room_settings, room_settings_all)
}

var played_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_played_filter()
		}, 350)
	}
})()

var userlist_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_userlist_filter()
		}, 350)
	}
})()

var roomlist_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_roomlist_filter()
		}, 350)
	}
})()

function start_filters()
{
	$("#played_filter").on("input", function()
	{
		played_filter_timer()
	})

	$("#userlist_filter").on("input", function()
	{
		userlist_filter_timer()
	})

	$("#roomlist_filter").on("input", function()
	{
		roomlist_filter_timer()
	})

	$("#highlights_filter").on("input", function()
	{
		highlights_filter_timer()
	})

	$("#image_history_filter").on("input", function()
	{
		image_history_filter_timer()
	})

	$("#tv_history_filter").on("input", function()
	{
		tv_history_filter_timer()
	})

	$("#radio_history_filter").on("input", function()
	{
		radio_history_filter_timer()
	})	

	$("#input_history_filter").on("input", function()
	{
		input_history_filter_timer()
	})

	$("#chat_search_filter").on("input", function()
	{
		chat_search_timer()
	})
}

function do_played_filter()
{
	var filter = $("#played_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		played_filtered = true

		$(".played_item").each(function()
		{
			$(this).css("display", "block")

			var title = $(this).find(".pititle").eq(0).text()
			var artist = $(this).find(".piartist").eq(0).text()

			var include = false

			if(title.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			else if(artist.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		played_filtered = false

		$(".played_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("played")

	$('#Msg-content-container-played').scrollTop(0)
}

function reset_played_filter()
{
	$("#played_filter").val("")
	do_played_filter()
}

function do_userlist_filter()
{
	var filter = $("#userlist_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		userlist_filtered = true

		$(".userlist_item").each(function()
		{
			$(this).css("display", "block")

			var uname = $(this).find(".ui_item_uname").eq(0).text()

			var include = false

			if(uname.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		userlist_filtered = false

		$(".userlist_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("userlist")

	$('#Msg-content-container-userlist').scrollTop(0)
}

function do_roomlist_filter()
{
	var filter = $("#roomlist_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		roomlist_filtered = true

		$(".roomlist_item").each(function()
		{
			$(this).css("display", "block")

			var name = $(this).find(".roomlist_name").eq(0).text()
			var topic = $(this).find(".roomlist_topic").eq(0).text()

			var include = false

			if(name.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			else if(topic.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		roomlist_filtered = false

		$(".roomlist_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("roomlist")

	$('#Msg-content-container-roomlist').scrollTop(0)	
}

function show_input_history(filter=false)
{
	msg_input_history.show(function()
	{
		if(filter)
		{
			$("#input_history_filter").val(filter)
			do_input_history_filter()
		}
		
		$("#input_history_filter").focus()
	})
}

function do_input_history_filter()
{
	var filter = $("#input_history_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		$(".input_history_item").each(function()
		{
			$(this).css("display", "block")

			var text = $(this).text()

			var include = false

			if(text.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		$(".input_history_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("input_history")

	$('#Msg-content-container-input_history').scrollTop(0)
}

function reset_input_history_filter()
{
	$("#input_history_filter").val("")
	do_input_history_filter()
}

var input_history_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_input_history_filter()
		}, 350)
	}
})()

function do_highlights_filter()
{
	var filter = $("#input_history_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		$(".input_history_item").each(function()
		{
			$(this).css("display", "block")

			var uname = $(this).find(".input_history_uname").eq(0).text()
			var hcontent = $(this).find(".input_history_content").eq(0)

			var content = ""

			hcontent.each(function()
			{
				content += `${$(this).text()} `	
			})			

			var include = false

			if(uname.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			else if(content.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		$(".input_history_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("input_history")

	$('#Msg-content-container-input_history').scrollTop(0)
}

function onYouTubeIframeAPIReady() 
{
	yt_player = new YT.Player('youtube_player',
	{
		events:
		{
			onReady: onYouTubePlayerReady
		},
		playerVars:
		{
			iv_load_policy: 3,
			rel: 0,
			width: 640,
			height: 360
		}		
	})

	yt_video_player = new YT.Player('media_youtube_video',
	{
		events: 
		{
			onReady: onYouTubePlayerReady2
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

function onYouTubePlayerReady()
{
	youtube_player = yt_player

	if(radio_type === "youtube")
	{
		change({type:"radio", notify:false})
	}
}

function onYouTubePlayerReady2()
{
	youtube_video_player = yt_video_player

	youtube_video_player.addEventListener("onStateChange", function(e)
	{
		if(e.data === 5)
		{
			if(youtube_video_play_on_queue)
			{
				youtube_video_player.playVideo()
			}
		}
	})

	if(tv_type === "youtube")
	{
		change({type:"tv", notify:false})
	}
}

function start_twitch()
{
	try
	{
		var twch_video_player = new Twitch.Player("media_twitch_video_container", 
		{
			channel: "AChannelThatDoesntExisttttt",
			width: 640,
			height: 360,
			autoplay: false
		})

		twch_video_player.addEventListener(Twitch.Player.READY, () => 
		{
			twitch_video_player = twch_video_player

			$("#media_twitch_video_container").find("iframe").eq(0).attr("id", "media_twitch_video").addClass("video_frame")

			if(tv_type === "twitch")
			{
				change({type:"tv", notify:false})
			}
		})
	}

	catch(err)
	{
		console.error("Twitch failed to load")
	}
}

function setup_userinfo()
{
	$("#userinfo_profile_image").attr("src", profile_image)

	$("#setting_double_tap_key").text(double_tap_key)
	$("#setting_double_tap_2_key").text(double_tap_key_2)
	$("#setting_double_tap_3_key").text(double_tap_key_3)
}

function show_userinfo()
{
	msg_userinfo.show()
}

function show_status()
{
	msg_info.show(template_status({info:get_status_html()}), function()
	{
		stu = true
	})
}

function get_status_html()
{
	var h = $("<div></div>")

	var info = ""

	info += "<div class='info_item'><div class='info_title'>Room Name</div><div class='info_item_content' id='status_room_name'></div></div>"

	if(topic_setter)
	{
		info += `<div class='info_item' title='Setter: ${topic_setter} | ${topic_date}'><div class='info_title'>Topic</div><div class='info_item_content' id='status_topic'></div></div>`
	}

	else
	{
		info += `<div class='info_item'><div class='info_title'>Topic</div><div class='info_item_content' id='status_topic'></div></div>`
	}

	info += "<div class='info_item'><div class='info_title'>Privacy</div>"	

	if(is_public)
	{
		info += "<div class='info_item_content'>Public</div></div>"
	}

	else
	{
		info += "<div class='info_item_content'>Private</div></div>"
	}

	info += "<div class='info_item'><div class='info_title'>Log</div>"

	if(log_enabled)
	{
		info += "<div class='info_item_content'>Enabled</div></div>"
	}

	else
	{
		info += "<div class='info_item_content'>Disabled</div></div>"
	}

	if(image_uploader)
	{
		info += "<div class='info_item'><div class='info_title'>Image Setter</div>"
		info += `<div class='info_item_content' id='status_image_setter'></div></div>`

		info += "<div class='info_item'><div class='info_title'>Image Source</div>"
		info += `<div class='info_item_content' id='status_image_source'></div></div>`

		info += "<div class='info_item'><div class='info_title'>Image Date</div>"
		info += `<div class='info_item_content' id='status_image_date'></div></div>`
	}

	if(tv_setter)
	{
		info += "<div class='info_item'><div class='info_title'>TV Setter</div>"
		info += `<div class='info_item_content' id='status_tv_setter'></div></div>`

		info += "<div class='info_item'><div class='info_title'>TV Source</div>"
		info += `<div class='info_item_content' id='status_tv_source'></div></div>`	

		info += "<div class='info_item'><div class='info_title'>TV Date</div>"
		info += `<div class='info_item_content' id='status_tv_date'></div></div>`		
	}

	if(radio_setter)
	{
		info += "<div class='info_item'><div class='info_title'>Radio Setter</div>"
		info += `<div class='info_item_content' id='status_radio_setter'></div></div>`

		info += "<div class='info_item'><div class='info_title'>Radio Source</div>"
		info += `<div class='info_item_content' id='status_radio_source'></div></div>`

		info += "<div class='info_item'><div class='info_title'>Radio Date</div>"
		info += `<div class='info_item_content' id='status_radio_date'></div></div>`		
	}

	h.append(info)

	h.find("#status_room_name").eq(0).text(room_name).urlize()

	var t = h.find("#status_topic").eq(0)
	t.text(get_topic()).urlize()

	var t = h.find("#status_image_setter").eq(0)
	t.text(image_uploader).urlize()

	var t = h.find("#status_image_source").eq(0)
	t.text(image_url).urlize(true)

	var t = h.find("#status_image_date").eq(0)
	t.text(image_date).urlize(true)

	var t = h.find("#status_tv_setter").eq(0)
	t.text(tv_setter).urlize()

	var t = h.find("#status_tv_source").eq(0)
	t.text(tv_source).urlize()

	var t = h.find("#status_tv_date").eq(0)
	t.text(tv_date).urlize()

	var t = h.find("#status_radio_setter").eq(0)
	t.text(radio_setter).urlize()

	var t = h.find("#status_radio_source").eq(0)
	t.text(radio_source).urlize()

	var t = h.find("#status_radio_date").eq(0)
	t.text(radio_date).urlize()

	return h.html()
}

function fill()
{
	var s = `abc def ghi jkl mno pqrs tuv wxyz ABC DEF GHI JKL MNO PQRS TUV WXYZ !"§ 
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

	update_chat({uname:username, msg:s, prof_image:profile_image})
}

function confirm_logout()
{
	var r = confirm("Are you sure? Make sure you know your current email and password to avoid getting locked out later.")

	if(r)
	{
		logout()
	}
}

function logout()
{
	goto_url('/logout')
}

function change_username(uname)
{
	if(utilz.clean_string4(uname).length !== uname.length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Username contains invalid characters"})
		return
	}

	if(uname.length === 0)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Username can't be empty"})
		return
	}

	if(uname.length > max_username_length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Username is too long"})
		return
	}

	if(uname === username)
	{
		chat_announce({brk1:'[', brk2:']', msg:"That's already your username"})
		return
	}

	socket_emit("change_username", {username:uname})
}

function change_password(passwd)
{
	if(passwd.length < min_password_length)
	{
		chat_announce({brk1:'[', brk2:']', msg:`Password is too short. It must be at least ${min_password_length} characters long`})
		return
	}

	if(passwd.length > max_password_length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Password is too long"})
		return
	}

	socket_emit("change_password", {password:passwd})
}

function password_changed(data)
{
	chat_announce({brk1:'[', brk2:']', msg:`Password succesfully changed to ${data.password}. To force other clients connected to your account to disconnect you can use /disconnectothers`})
}

function change_email(email)
{
	if(utilz.clean_string5(email).length !== email.length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Invalid email address"})
		return
	}

	if(email.length === 0)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Username can't be empty"})
		return
	}

	if(email.indexOf('@') === -1)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Invalid email address"})
		return
	}	

	if(email.length > max_email_length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Email is too long"})
		return
	}

	socket_emit("change_email", {email:email})
}

function email_changed(data)
{
	set_email(data.email)
	chat_announce({brk1:'[', brk2:']', msg:`Email succesfully changed to ${data.email}`})
}

function show_details(data)
{
	var h = $("<div></div>")	

	var info = ""

	info += "<div class='info_item'><div class='info_title'>Username</div><div class='info_item_content' id='details_username'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Email</div><div class='info_item_content' id='details_email'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Account Created On</div><div class='info_item_content' id='details_reg_date'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Joined Room On</div><div class='info_item_content' id='details_joined_room'></div></div>"

	h.append(info)

	h.find("#details_username").eq(0).text(username)
	h.find("#details_email").eq(0).text(user_email)
	h.find("#details_reg_date").eq(0).text(nice_date(user_reg_date))
	h.find("#details_joined_room").eq(0).text(nice_date(date_joined))

	msg_info.show(h.html())
}

function show_log_messages()
{
	if(log_messages && log_messages.length > 0)
	{
		for(var message of log_messages)
		{
			var data = message.data

			if(data)
			{
				if(message.type === "chat")
				{
					update_chat(
					{
						uname: data.username, 
						msg: data.content, 
						prof_image: data.profile_image, 
						date: message.date, 
						scroll: false
					})
				}

				else if(message.type === "image")
				{
					announce_image_change(data, message.date)
				}

				else if(message.type === "radio")
				{
					announce_radio_change(data, message.date)
				}

				else if(message.type === "tv")
				{
					announce_tv_change(data, message.date)
				}
			}
		}

		log_messages = false
	}
}

function change_log(log)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()	
		return false
	}

	if(log === log_enabled)
	{
		if(log)
		{
			chat_announce({brk1:'[', brk2:']', msg:"Log is already enabled"})
		}

		else
		{
			chat_announce({brk1:'[', brk2:']', msg:"Log is already disabled"})
		}
	}

	socket_emit("change_log", {log:log})
}

function clear_log()
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()	
		return false
	}

	socket_emit("clear_log", {})
}

function announce_log_change(data)
{
	if(data.log)
	{
		var s = `${data.username} enabled the log`
	}

	else
	{
		var s = `${data.username} cleared and disabled the log`
	}

	chat_announce({brk1:'~', brk2:'~', msg:s})

	log_enabled = data.log
}

function announce_log_cleared(data)
{
	var s = ""

	if(username === data.username)
	{
		var uname = "You"
	}

	else
	{
		var uname = data.username
	}

	s += `${uname} cleared the log`

	chat_announce({brk1:'~', brk2:'~', msg:s})
}

function show_log()
{
	if(log_enabled)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Log is enabled"})
	}

	else
	{
		chat_announce({brk1:'[', brk2:']', msg:"Log is disabled"})
	}
}

function show_modal_image(url, title=false, date)
{
	if(!url)
	{
		msg_info.show("No image loaded yet")
		return
	}

	if(title)
	{
		var t = title
	}

	else
	{
		var t = ""
	}

	var img = $("#modal_image")

	img.css("display", "none")

	$("#modal_image_spinner").css("display", "block")
	$("#modal_image_error").css("display", "none")	

	img.attr("src", url)
	img.data("image_title", t)
	img.data("image_date", date)

	update_modal_scrollbar("image")

	msg_image.show()
}

function not_an_op()
{
	chat_announce({brk1:'[', brk2:']', msg:"You are not a room operator"})
}

function show_image_picker()
{
	msg_image_picker.show(function()
	{
		$("#image_url_picker_input").focus()
	})
}

function show_tv_picker()
{
	msg_tv_picker.show(function()
	{
		$("#tv_url_picker_input").focus()
	})
}

function show_radio_picker()
{
	msg_radio_picker.show(function()
	{
		$("#radio_url_picker_input").focus()
	})
}

function start_titles()
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
			arrowSize: 'small'
		})
	})
}

function setup_media_video()
{
	hls = new Hls(
	{
		maxBufferSize: 5*1000*1000,
		maxBufferLength: 10
	})
}

function num_media_elements_visible()
{
	var num = 0

	$("#media_split").children().each(function()
	{
		if($(this).css("display") !== "none")
		{
			num += 1
		}
	})

	return num
}

function fix_media_margin()
{
	if(num_media_elements_visible() === 2)
	{
		$("#media_image_container").css("margin-bottom", "-1em")
		$("#media_tv").css("margin-top", "-1em")
	}

	else
	{
		$("#media_image_container").css("margin-bottom", "0")
		$("#media_tv").css("margin-top", "0")		
	}
}

function toggle_images(what=undefined, save=true)
{
	if(what !== undefined)
	{
		room_settings.images_enabled = what
	}

	else
	{
		room_settings.images_enabled = !room_settings.images_enabled
	}

	change_images_visibility()

	if(save)
	{
		save_room_settings()
	}
}

function change_images_visibility()
{
	if(room_images_enabled && room_settings.images_enabled)
	{
		$("#media").css("display", "flex")

		$("#media_image_container").css("display", "flex")

		fix_media_margin()

		$("#footer_toggle_images_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_images_icon").addClass("fa-toggle-on")

		var num_visible = num_media_elements_visible()

		if(num_visible > 1)
		{
			enable_normal_mode()	
		}

		change({type:"image"})

		images_visible = true
	}

	else
	{
		$("#media_image_container").css("display", "none")

		fix_media_margin()

		var num_visible = num_media_elements_visible()

		if(num_visible === 0)
		{
			hide_media()
		}

		else if(num_visible === 1)
		{
			enable_wide_mode()
		}

		$("#footer_toggle_images_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_images_icon").addClass("fa-toggle-off")

		images_visible = false
	}

	fix_visible_video_frame()
	update_chat_scrollbar()
	goto_bottom()
}

function toggle_tv(what=undefined, save=true)
{
	if(what !== undefined)
	{
		room_settings.tv_enabled = what
	}

	else
	{
		room_settings.tv_enabled = !room_settings.tv_enabled
	}

	change_tv_visibility()

	if(save)
	{
		save_room_settings()
	}
}

function change_tv_visibility()
{
	if(room_tv_enabled && room_settings.tv_enabled)
	{
		$("#media").css("display", "flex")

		$("#media_tv").css("display", "flex")/

		fix_media_margin()
		fix_visible_video_frame()

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-on")

		var num_visible = num_media_elements_visible()

		if(num_visible > 1)
		{
			enable_normal_mode()	
		}	

		change({type:"tv", force:false, play:false})

		tv_visible = true
	}

	else
	{
		$("#media_tv").css("display", "none")

		fix_media_margin()

		var num_visible = num_media_elements_visible()

		if(num_visible === 0)
		{
			hide_media()
		}

		else if(num_visible === 1)
		{
			stop_videos()
			enable_wide_mode()
		}

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-off")

		tv_visible = false
	}

	update_chat_scrollbar()
	goto_bottom()	
}

function toggle_radio(what=undefined, save=true)
{
	if(what !== undefined)
	{
		room_settings.radio_enabled = what
	}

	else
	{
		room_settings.radio_enabled = !room_settings.radio_enabled
	}

	change_radio_visibility()

	if(save)
	{
		save_room_settings()
	}
}

function change_radio_visibility()
{
	if(room_radio_enabled && room_settings.radio_enabled)
	{
		$("#radio").css("display", "initial")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-on")

		$("#header_topic").css("display", "none")

		radio_visible = true
	}

	else
	{
		stop_radio()
		
		$("#radio").css("display", "none")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-off")

		$("#header_topic").css("display", "initial")

		radio_visible = false
	}

	update_chat_scrollbar()
	goto_bottom()
}

function open_profile_image_picker()
{
	$("#profile_image_picker").click()
}

function profile_image_selected(input)
{
	if(input.files && input.files[0]) 
	{
		var reader = new FileReader()

		reader.onload = function(e) 
		{
			var s = "<img id='profile_image_canvas_image'><div id='profile_image_canvas_button' class='unselectable'>Crop and Upload</div>"

			msg_info.show(s, function()
			{
				$('#profile_image_canvas_image').attr('src', e.target.result)

				$("#profile_image_picker").wrap('<form>').closest('form').get(0).reset()

				var image = $('#profile_image_canvas_image')[0]

				var button = $('#profile_image_canvas_button')[0]

				var croppable = false

				var cropper = new Cropper(image, 
				{
					aspectRatio: 1,
					viewMode: 2,
					ready: function () 
					{
						var container_data = cropper.getContainerData()

						cropper.setCropBoxData({width:container_data.width, height:container_data.height})

						var cropbox_data = cropper.getCropBoxData()

						var left = (container_data.width - cropbox_data.width) / 2
						var top = (container_data.height - cropbox_data.height) / 2

						cropper.setCropBoxData({left:left, right:top})

						croppable = true

						update_modal_scrollbar("info")
					}
				})


				button.onclick = function () 
				{
					var cropped_canvas
					var rounded_canvas
					var roundedImage

					if(!croppable) 
					{
						return
					}

					cropped_canvas = cropper.getCroppedCanvas()
					
					rounded_canvas = get_rounded_canvas(cropped_canvas)

					rounded_canvas.toBlob(function(blob)
					{
						$("#userinfo_profile_image").attr("src", profile_image_loading_url)

						blob.name = "profile.png"

						upload_file(blob, "profile_image_upload")

						msg_info.close()
					}, 'image/png', 0.95)
				}			
			})
		}

		reader.readAsDataURL(input.files[0])
	}	
}

function get_rounded_canvas(sourceCanvas) 
{
	var canvas = document.createElement('canvas')
	var context = canvas.getContext('2d')
	var width = 300
	var height = 300
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

function setup_profile_image(pi)
{
	if(pi === "")
	{
		profile_image = default_profile_image_url
	}

	else
	{
		profile_image = pi
	}
}

function setup_show_profile()
{
	$('#show_profile_image').get(0).addEventListener('load', function()
	{
		update_modal_scrollbar("profile")
	})
}

function show_profile(uname, prof_image)
{
	if(prof_image === "" || prof_image === undefined)
	{
		var pi = default_profile_image_url
	}

	else
	{
		var pi = prof_image
	}

	$("#show_profile_uname").text(uname)
	$("#show_profile_image").attr("src", pi)

	if(!can_chat || uname === username || usernames.indexOf(uname) === -1)
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

	msg_profile.show(function()
	{
		update_modal_scrollbar("profile")
	})
}

function profile_image_changed(data)
{
	if(data.username === username)
	{
		profile_image = data.profile_image
		$("#userinfo_profile_image").attr("src", profile_image)	
	}

	update_user_profile_image(data.username, data.profile_image)
}

function update_user_profile_image(uname, pi)
{
	for(var i=0; i<userlist.length; i++)
	{
		var user = userlist[i]

		if(user.username === uname)
		{
			userlist[i].profile_image = pi
			return
		}
	}	
}

function get_frame_ratio(frame_id)
{
	var id = `#${frame_id}`

	$(id).data('ratio', $(id).height() / $(id).width()).removeAttr('height').removeAttr('width')
	
	return $(id).data('ratio')
}

function fix_visible_video_frame()
{
	$(".video_frame").each(function()
	{
		if($(this).parent().css("display") !== "none")
		{
			if($(this).data("ratio") !== undefined)
			{
				fix_video_frame(this.id)
			}
		}
	})
}

function fix_video_frame(frame_id)
{
	var id = `#${frame_id}`

	var frame = $(id)

	var pratio = frame.data("ratio")

	if(pratio === undefined)
	{
		pratio = get_frame_ratio(frame_id)
	}

	var ratio = 0.5625

	var parent = frame.parent()

	var parent_width = parent.width()
	var parent_height = parent.height()

	var frame_width = frame.width()
	var frame_height = frame.height()

	frame_height = frame_width * ratio

	if(frame_width === parent_width && frame_height === parent_height)
	{
		return
	}

	var n = 0

	var max = 200000

	if(frame_height < parent_height && frame_width < parent_width)
	{
		while(n < max)
		{
			if(frame_height < parent_height && frame_width < parent_width)
			{
				frame_width = frame_width + 1
				frame_height = frame_width * ratio			
			}

			else
			{
				frame.width(frame_width)
				frame.height(frame_height)
				return
			}

			max += 1
		}

		frame.width(frame_width)
		frame.height(frame_height)		
	}

	else
	{
		while(n < max)
		{
			if(frame_height > parent_height || frame_width > parent_width)
			{
				frame_width = frame_width - 1
				frame_height = frame_width * ratio			
			}

			else
			{
				frame.width(frame_width)
				frame.height(frame_height)				
				return
			}

			max += 1
		}

		frame.width(frame_width)
		frame.height(frame_height)		
	}
}

function change_room_images_enabled(what)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(what)
	{
		if(room_images_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Room images are already enabled`})
			return false			
		}
	}
	
	else
	{
		if(!room_images_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Room images are already disabled`})
			return false
		}
	}

	socket_emit("change_images_enabled", {what:what})	
}

function change_room_tv_enabled(what)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(what)
	{
		if(room_tv_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Room tv is already enabled`})
			return false			
		}
	}
	
	else
	{
		if(!room_tv_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Room tv is already disabled`})
			return false
		}
	}

	socket_emit("change_tv_enabled", {what:what})	
}

function change_room_radio_enabled(what)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(what)
	{
		if(room_radio_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Room radio is already enabled`})
			return false			
		}
	}
	
	else
	{
		if(!room_radio_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Room radio is already disabled`})
			return false
		}
	}

	socket_emit("change_radio_enabled", {what:what})	
}

function announce_room_images_enabled_change(data)
{
	if(data.what)
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} enabled room images`})
	}

	else
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} disabled room images`})
	}

	room_images_enabled = data.what

	change_images_visibility()
	check_permissions()
}

function announce_room_tv_enabled_change(data)
{
	if(data.what)
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} enabled room tv`})
	}

	else
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} disabled room tv`})
	}

	room_tv_enabled = data.what

	change_tv_visibility(data.what)
	check_permissions()
}

function announce_room_radio_enabled_change(data)
{
	if(data.what)
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} enabled room radio`})
	}

	else
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} disabled room radio`})
	}

	room_radio_enabled = data.what
	
	change_radio_visibility(data.what)
	check_permissions()
}

function hide_media()
{
	stop_videos()

	$("#media").css("display", "none")	
}

function setup_active_media(data)
{
	room_images_enabled = data.room_images_enabled
	room_tv_enabled = data.room_tv_enabled
	room_radio_enabled = data.room_radio_enabled

	change_images_visibility()
	change_tv_visibility()
	change_radio_visibility()
}

function recreate_background_image()
{
	$("#background_image").remove()

	$("#main_container").prepend("<div id='background_image'></div>")
}

function change_default_theme(color)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(color === undefined)
	{
		return false
	}

	if(color === default_theme)
	{
		return false
	}

	socket_emit("change_default_theme", {color:color})	
}

function announce_default_theme_change(data)
{
	chat_announce({brk1:'~', brk2:'~', msg:`${data.username} changed the theme to ${data.color}`})

	default_theme = data.color

	set_default_theme()

	setup_modal_colors()
}

function queue_image(data)
{
	image_queue.push(data)

	if(image_queue_timeout === undefined)
	{
		check_image_queue()
	}
}

function check_image_queue()
{
	if(image_queue.length > 0)
	{
		var data = image_queue[0]

		if(data !== "first")
		{
			setup_image(image_queue[0])
		}

		image_queue.shift()
		
		image_queue_timeout = setTimeout(function()
		{
			check_image_queue()
		}, image_queue_interval)
	}

	else
	{
		clearTimeout(image_queue_timeout)
		image_queue_timeout = undefined
	}
}

function open_default_background_image_picker()
{
	$("#default_background_image_input").click()
}

function default_background_image_selected(input)
{
	var file = input.files[0]

	var size = file.size / 1024

	if(size > max_image_size)
	{
		msg_info.show("Image is too big")
		return false
	}

	$("#admin_default_background_image").attr("src", background_image_loading_url)

	upload_file(file, "background_image_upload")
}

function announce_default_background_image_change(data)
{
	default_background_image = data.default_background_image

	if(role === "admin" || role === "op")
	{
		$("#admin_default_background_image").attr("src", default_background_image)
	}

	set_background_image()

	chat_announce({brk1:'~', brk2:'~', msg:`${data.username} changed the background image`})	
}

function change_default_background_image_enabled(what)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(what)
	{
		if(default_background_image_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Background image is already enabled`})
			return false			
		}
	}
	
	else
	{
		if(!default_background_image_enabled)
		{
			chat_announce({brk1:'[', brk2:']', msg:`Background image is already disabled`})
			return false
		}
	}

	socket_emit("change_default_background_image_enabled", {what:what})	
}

function announce_default_background_image_enabled_change(data)
{
	if(data.what)
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} enabled the background image`})
	}

	else
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} disabled the background image`})
	}

	default_background_image_enabled = data.what

	set_default_theme()
}

function link_image(url)
{
	if(!can_images)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You don't have permission to link images"})
		return false
	}

	url = url.replace(/\.gifv/g, '.gif')

	if(url.length > 0 && url.length <= max_image_source_length)
	{
		$('#test_image').attr('src', url)
	}
}

function change_voice_permission(ptype, what)
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return
	}

	if(window[ptype] === undefined)
	{
		return false
	}

	if(window[ptype] === what)
	{
		chat_announce({brk1:'[', brk2:']', msg:`That permission is already set to that`})
		return false
	}

	socket_emit("change_voice_permission", {ptype:ptype, what:what})		
}

function announce_voice_permission_change(data)
{
	if(data.what)
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} set ${data.ptype} to true`})
	}

	else
	{
		chat_announce({brk1:'~', brk2:'~', msg:`${data.username} set ${data.ptype} to false`})
	}

	window[data.ptype] = data.what

	check_permissions()
}

function enable_wide_mode()
{
	$("#chat_main").css("min-width", "30%")
	$("#media").css("min-width", "70%")

	layout_mode = "wide"
}

function enable_normal_mode()
{
	$("#chat_main").css("min-width", "50%")
	$("#media").css("min-width", "50%")

	layout_mode = "normal"
}

function setup_timeago()
{
	var locale = function(number, index, total_sec) 
	{
		return [
			['just now', 'right now'],
			['just now', 'right now'],
			['1 minute ago', 'in 1 minute'],
			['%s minutes ago', 'in %s minutes'],
			['1 hour ago', 'in 1 hour'],
			['%s hours ago', 'in %s hours'],
			['1 day ago', 'in 1 day'],
			['%s days ago', 'in %s days'],
			['1 week ago', 'in 1 week'],
			['%s weeks ago', 'in %s weeks'],
			['1 month ago', 'in 1 month'],
			['%s months ago', 'in %s months'],
			['1 year ago', 'in 1 year'],
			['%s years ago', 'in %s years']
		][index]
	}

	timeago.register('default', locale)
	time_ago = timeago()
}

function setup_input()
{
	$("#input").on("input", function()
	{
		var value = $("#input").val()

		value = utilz.clean_string6(value)

		if(value.length > max_input_length)
		{
			value = value.substring(0, max_input_length)
			$("#input").val(value)
		}

		if(old_input_val !== value)
		{
			input_changed = true
			check_typing()
			old_input_val = value
		}
	})

	old_input_val = $("#input").val()
}

function check_typing()
{
	var val = $("#input").val()

	if(val.length < old_input_val.length)
	{
		return false
	}

	var tval = val.trim()

	if(can_chat && tval !== "")
	{
		if(tval[0] === "/")
		{
			if(tval[1] !== "/")
			{
				return false
			}
		}

		typing_timer()
	}	
}

var typing_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			socket_emit("typing", {})
		}, 100)
	}
})()

var typing_remove_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			hide_pencil()
		}, max_typing_inactivity)
	}
})()

function show_typing()
{
	show_pencil()
	typing_remove_timer()
}

function show_pencil()
{
	$("#footer_userinfo").addClass("fa-pencil")
	$("#footer_userinfo").removeClass("fa-user-circle")
}

function hide_pencil()
{
	$("#footer_userinfo").removeClass("fa-pencil")
	$("#footer_userinfo").addClass("fa-user-circle")
}

function shrug()
{
	send_to_chat("¯\\_(ツ)_/¯", false)
}

function show_afk()
{
	send_to_chat("/me is now AFK", false)
}

function toggle_lock_images(what=undefined)
{
	if(what !== undefined)
	{
		images_locked = what
	}

	else
	{
		images_locked = !images_locked
	}

	if(images_locked)
	{
		$("#footer_lock_images_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_images_icon").addClass("fa-lock")		
	}

	else
	{
		$("#footer_lock_images_icon").removeClass("fa-lock")
		$("#footer_lock_images_icon").addClass("fa-unlock-alt")

		change({type:"image"})
	}
}

function toggle_lock_tv(what=undefined)
{
	if(what !== undefined)
	{
		tv_locked = what
	}

	else
	{
		tv_locked = !tv_locked
	}

	if(tv_locked)
	{
		$("#footer_lock_tv_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_tv_icon").addClass("fa-lock")		
	}

	else
	{
		$("#footer_lock_tv_icon").removeClass("fa-lock")
		$("#footer_lock_tv_icon").addClass("fa-unlock-alt")

		change({type:"tv"})
	}
}

function toggle_lock_radio(what=undefined)
{
	if(what !== undefined)
	{
		radio_locked = what
	}

	else
	{
		radio_locked = !radio_locked
	}

	if(radio_locked)
	{
		$("#footer_lock_radio_icon").removeClass("fa-unlock-alt")
		$("#footer_lock_radio_icon").addClass("fa-lock")		
	}

	else
	{
		$("#footer_lock_radio_icon").removeClass("fa-lock")
		$("#footer_lock_radio_icon").addClass("fa-unlock-alt")

		change({type:"radio"})
	}
}

function setup_modal_colors()
{
	var background_color = default_theme
	var font_color = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_2)
	var inner_x_hover_color = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_1)
	var overlay_color = colorlib.rgb_to_rgba(font_color, modal_overlay_opacity)
	var scrollbar_color = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_3)

	var css = `
	<style class='appended_style'>

	.Msg-overlay
	{
		background-color: ${overlay_color} !important;
		color: ${background_color} !important;
	}

	.Msg-window
	{
		background-color: ${background_color} !important;
		color: ${font_color} !important;
	}

	.Msg-window-inner-x:hover
	{
		background-color: ${inner_x_hover_color} !important;
	}

	.nicescroll-cursors
	{
		background-color: ${scrollbar_color} !important;
	}

	</style>
	`

	$(".appended_style").each(function()
	{
		$(this).remove()
	})

	$("head").append(css)
}

function show_joined()
{
	chat_announce({brk1:'[', brk2:']', msg:`You joined ${room_name}`, save:true})
	show_topic()
}

function show_media_menu()
{
	msg_media_menu.show()
}

function hide_media_menu()
{
	msg_media_menu.close()
}

function stop_and_lock(stop=true)
{
	if(stop)
	{
		stop_videos()
		stop_radio()
	}

	toggle_lock_images(true)
	toggle_lock_tv(true)
	toggle_lock_radio(true)
}

function refresh_image()
{
	change({type:"image", force:true, play:true})
}

function refresh_tv()
{
	change({type:"tv", force:true, play:true})
}

function refresh_radio()
{
	change({type:"radio", force:true, play:true})
}

function default_media_state(change_visibility=true)
{
	toggle_lock_images(false)
	toggle_lock_tv(false)
	toggle_lock_radio(false)

	if(change_visibility)
	{
		toggle_images(true, false)
		toggle_tv(true, false)
		toggle_radio(true, false)

		save_room_settings()
	}
}

function disconnect_others()
{
	socket_emit("disconnect_others", {})
}

function show_others_disconnected(data)
{
	if(data.amount === 1)
	{
		var s = `${data.amount} client was disconnected`
	}

	else
	{
		var s = `${data.amount} clients were disconnected`
	}

	chat_announce({brk1:'[', brk2:']', msg:s})
}

function set_username(uname)
{
	username = uname
	generate_mentions_regex()
	$("#userinfo_username").text(username)
}

function set_email(email)
{
	user_email = email
}

function generate_mentions_regex()
{
	if(settings.case_insensitive_highlights)
	{
		mentions_regex = new RegExp(`(?:^|\\s+)${escape_special_characters(username)}(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.)`, "i")
	}

	else
	{
		mentions_regex = new RegExp(`(?:^|\\s+)${escape_special_characters(username)}(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.)`)
	}
}

function generate_highlight_words_regex()
{
	var words = ""

	var lines = settings.other_words_to_highlight.split('\n')

	for(var i=0; i<lines.length; i++)
	{
		var line = lines[i].trim()

		words += escape_special_characters(line)

		if(i < lines.length - 1)
		{
			words += "|"
		}
	}

	if(words.length > 0)
	{
		if(settings.case_insensitive_highlights)
		{
			highlight_words_regex = new RegExp(`(?:^|\\s+)(?:${words})(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.)`, "i")
		}

		else
		{
			highlight_words_regex = new RegExp(`(?:^|\\s+)(?:${words})(?:\\'s)?(?:$|\\s+|\\!|\\?|\\,|\\.)`)
		}
	}

	else
	{
		highlight_words_regex = false
	}
}

function check_highlights(msg)
{
	if(settings.highlight_current_username)
	{
		if(msg.search(mentions_regex) !== -1)
		{
			return true
		}
	}

	if(highlight_words_regex)
	{
		if(msg.search(highlight_words_regex) !== -1)
		{
			return true
		}
	}

	return false
}

function show_intro()
{
	var edges_height = $("#footer").height()

	var pop = Msg.factory(
	{
		preset: "popup",
		edge_padding_y: edges_height,
		position: "bottomleft"
	})

	var s = `
	You can chat in this area. The icon on the left opens the user menu where you can change your profile image and other settings. 
	When someone is typing a message the user menu icon turns into a pencil.`

	pop.show(s)

	var pop = Msg.factory(
	{
		preset: "popup",
		edge_padding_y: edges_height,
		position: "bottomright"
	})

	var s = `
	This area has media controls. You can use these to change the room's media or control what is displayed to you.`

	pop.show(s)

	var pop = Msg.factory(
	{
		preset: "popup",
		edge_padding_y: edges_height,
		position: "top"
	})

	var s = `
	This area contains the main menu, user list, and radio controls. If you disable the radio the topic will be shown instead.`

	pop.show(s)
}

function header_topic_events()
{
	$("#header_topic").click(function()
	{
		var s = $("<div id='header_topic_content'></div>")
		
		s.text(get_topic()).urlize()
		
		msg_info.show(s[0])
	})
}

function cant_chat()
{
	chat_announce({brk1:'[', brk2:']', msg:"You don't have permission to chat"})
}

function write_whisper(uname)
{
	if(!can_chat)
	{
		cant_chat()
		return false
	}

	if(uname === username)
	{
		chat_announce({brk1:'[', brk2:']', msg:"You can't whisper to yourself"})
		return false
	}

	if(usernames.indexOf(uname) === -1)
	{
		user_not_in_room()
		return false
	}

	$("#write_whisper_uname").text(uname)
	
	msg_whisper.show(function()
	{
		$("#write_whisper_area").focus()
	})
}

function send_whisper()
{
	var uname = $("#write_whisper_uname").text()

	if(!can_chat)
	{
		$("#write_whisper_feedback").text("You don't have chat permission")
		return false
	}	

	if(uname === username)
	{
		$("#write_whisper_feedback").text("You can't whisper to yourself")
		return false
	}

	if(usernames.indexOf(uname) === -1)
	{
		$("#write_whisper_feedback").text("User is not in the room")
		return false
	}	

	var whisper = utilz.clean_string2($("#write_whisper_area").val())

	var diff = max_input_length - whisper.length

	if(diff === max_input_length)
	{
		return false
	}
	
	else if(diff < 0)
	{
		$("#write_whisper_feedback").text(`Character limit exceeded by ${Math.abs(diff)}`)
		return false
	}

	socket_emit('whisper', {username:uname, message:whisper})

	close_all_modals()

	var f = function()
	{
		var s = make_safe(whisper, `<div class='spacer3'></div><div class='small_button' id='modal_send_whisper'>Send whisper to ${uname}</div>`)

		msg_info.show(s, function()
		{
			$("#modal_send_whisper").click(function()
			{
				write_whisper(uname)
			})
		})
	}

	chat_announce({brk1:'[', brk2:']', msg:`Whisper sent to ${uname}`, onclick:f})
}

function whisper_received(data)
{
	var f = function()
	{
		write_whisper(data.username)
	}

	chat_announce(
	{
		brk1: '<', 
		brk2: '>', 
		msg: `Whisper from ${data.username}: ${data.message}`, 
		highlight: true, 
		onclick: f, 
		save: true,
		type: "whisper",
		info1: data.username,
		info2: data.message
	})
}

function user_not_in_room()
{
	chat_announce({brk1:'[', brk2:']', msg:"User is not in the room"})
}

function on_write_whisper_uname_click()
{
	var uname = $("#write_whisper_uname").text()

	show_profile(uname, get_user_by_username(uname).profile_image)
}

function annex(rol="admin")
{
	if(roles.indexOf(rol) === -1)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Invalid role"})
		return false				
	}
		
	socket_emit('change_role', {username:username, role:rol})	
}

function show_highlights(filter=false)
{
	msg_highlights.show(function()
	{
		$("#highlights_filter").focus()

		$("#highlights_container").html("")

		for(var msg of chat_history.slice(0).reverse())
		{
			if(msg.data("highlighted"))
			{
				if(msg.hasClass("chat_message"))
				{
					var huname = msg.find('.chat_uname').eq(0)
					var hcontent = msg.find('.chat_content')

					var cn = $("<div class='highlights_item'><div class='highlights_uname generic_uname'></div><div class='highlights_content'></div>")

					cn.find(".highlights_uname").eq(0).text(huname.text())

					for(var i=0; i < hcontent.length; i++)
					{
						var hc = hcontent.get(i)

						if(i < hcontent.length - 1)
						{
							cn.find(".highlights_content").eq(0).append($(hc).clone()).append("<br>")
						}

						else
						{
							cn.find(".highlights_content").eq(0).append($(hc).clone())
						}
						
					}
				}

				else if(msg.hasClass("announcement"))
				{
					if(msg.data("type") === "whisper")
					{
						var cn = $("<div class='highlights_item'><div class='highlights_uname'></div><div class='highlights_content'></div>")
						cn.find(".highlights_uname").eq(0).html(`Whisper from&nbsp;<span class='generic_uname'>${msg.data("info1")}</span>`)
						var content = cn.find(".highlights_content").eq(0)
						content.text(msg.data("info2")).urlize()
						content.attr("title", msg.find(".announcement_content_container").eq(0).attr("title"))
					}
				}

				$("#highlights_container").append(cn)
			}
		}

		if(filter)
		{
			$("#highlights_filter").val(filter)
			do_highlights_filter()
		}

		update_modal_scrollbar("highlights")
	})
}

var highlights_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_highlights_filter()
		}, 350)
	}
})()

function do_highlights_filter()
{
	var filter = $("#highlights_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		$(".highlights_item").each(function()
		{
			$(this).css("display", "block")

			var uname = $(this).find(".highlights_uname").eq(0).text()
			var hcontent = $(this).find(".highlights_content").eq(0)

			var content = ""

			hcontent.each(function()
			{
				content += `${$(this).text()} `	
			})			

			var include = false

			if(uname.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			else if(content.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		$(".highlights_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("highlights")

	$('#Msg-content-container-highlights').scrollTop(0)
}

function on_double_tap()
{
	if(settings.double_tap)
	{
		send_to_chat(settings.double_tap)
	}
}

function on_double_tap_2()
{
	if(settings.double_tap_2)
	{
		send_to_chat(settings.double_tap_2)
	}
}

function on_double_tap_3()
{
	if(settings.double_tap_3)
	{
		send_to_chat(settings.double_tap_3)
	}
}

function show_image_history(filter=false)
{
	msg_image_history.show(function()
	{
		if(filter)
		{
			$("#image_history_filter").val(filter)
			do_image_history_filter()
		}
		
		$("#image_history_filter").focus()
	})
}

function show_tv_history(filter=false)
{
	msg_tv_history.show(function()
	{
		if(filter)
		{
			$("#tv_history_filter").val(filter)
			do_tv_history_filter()
		}
		
		$("#tv_history_filter").focus()
	})
}

function show_radio_history(filter=false)
{
	msg_radio_history.show(function()
	{
		if(filter)
		{
			$("#radio_history_filter").val(filter)
			do_radio_history_filter()
		}
		
		$("#radio_history_filter").focus()
	})
}

function do_media_history_filter(type, container, filter="")
{
	var filter = filter.trim().toLowerCase()

	if(filter !== "")
	{
		if(type === "image")
		{
			image_history_filtered = true
		}

		else if(type === "tv")
		{
			tv_history_filtered = true	
		}

		else if(type === "radio")
		{
			radio_history_filtered = true
		}

		container.children().each(function()
		{
			$(this).css("display", "block")

			var content = $(this).find(".announcement_content").eq(0).text()

			var include = false

			if(content.toLowerCase().indexOf(filter) !== -1)
			{
				include = true
			}

			if(!include)
			{
				$(this).css("display", "none")
			}
		})
	}

	else
	{
		if(type === "image")
		{
			image_history_filtered = false
		}

		else if(type === "tv")
		{
			tv_history_filtered = false	
		}

		else if(type === "radio")
		{
			radio_history_filtered = false
		}

		container.children().each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar(`${type}_change`)

	$('#Msg-content-container-played').scrollTop(0)
}

var image_history_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_image_history_filter()
		}, 350)
	}
})()

var tv_history_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_tv_history_filter()
		}, 350)
	}
})()

var radio_history_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_radio_history_filter()
		}, 350)
	}
})()

function reset_image_history_filter()
{
	$("#image_history_filter").val("")
	do_image_history_filter()
}

function reset_tv_history_filter()
{
	$("#tv_history_filter").val("")
	do_tv_history_filter()
}

function reset_radio_history_filter()
{
	$("#radio_history_filter").val("")
	do_radio_history_filter()
}

function do_image_history_filter()
{
	do_media_history_filter("image", $("#image_history_container"), $("#image_history_filter").val())	
}

function do_tv_history_filter()
{
	do_media_history_filter("tv", $("#tv_history_container"), $("#tv_history_filter").val())	
}

function do_radio_history_filter()
{
	do_media_history_filter("radio", $("#radio_history_container"), $("#radio_history_filter").val())	
}

function do_test()
{
	send_to_chat("Test: 3")
}

function maximize_images()
{
	if(images_visible)
	{
		if(tv_visible)
		{
			toggle_tv(false, false)
		}

		else
		{
			toggle_tv(true, false)
		}
	}

	else
	{
		toggle_images(true, false)

		if(tv_visible)
		{
			toggle_tv(false, false)
		}
	}

	save_room_settings()
}

function maximize_tv()
{
	if(tv_visible)
	{
		if(images_visible)
		{
			toggle_images(false, false)
		}

		else
		{
			toggle_images(true, false)
		}
	}

	else
	{
		toggle_tv(true, false)

		if(images_visible)
		{
			toggle_images(false, false)
		}
	}

	save_room_settings()
}

function font_check()
{
	document.fonts.ready.then(function () 
	{
		update_chat_scrollbar()
		goto_bottom(true)
	})	
}

function start_generic_uname_click_events()
{
	$("body").on("click", ".generic_uname", function() 
	{
		var uname = $(this).text()
		show_profile(uname, get_user_by_username(uname).profile_image)
	})
}

function electron_signal(func, data={})
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

function setup_image_overlay()
{
	var s = ""
	
	s +="<div id='modal_image_overlay_prev' class='unselectable modal_image_overlay_button'>&lt; Prev</div>"
	s +="<div id='modal_image_overlay_next' class='unselectable modal_image_overlay_button'>Next &gt;</div>"

	$("#Msg-overlay-image").html(s)

	$("#modal_image_overlay_prev").click(function(e)
	{
		image_prev_click()
		e.preventDefault()
		e.stopPropagation()
	})

	$("#modal_image_overlay_next").click(function(e)
	{
		image_next_click()
		e.preventDefault()
		e.stopPropagation()
	})
}

function image_prev_click()
{
	if(images_changed.length < 2)
	{
		return false
	}

	var date = $("#modal_image").data("image_date")
	var url = $("#modal_image").attr("src")

	for(var data of images_changed.slice(0).reverse())
	{
		if(data.date_raw < date)
		{
			show_modal_image(data.image_url, data.title, data.date_raw)
			return
		}
	}

	var last = images_changed[images_changed.length - 1]

	show_modal_image(last.image_url, last.title, last.date_raw)
}

function image_next_click(e)
{
	if(images_changed.length < 2)
	{
		return false
	}

	var date = $("#modal_image").data("image_date")
	var url = $("#modal_image").attr("src")

	for(var data of images_changed)
	{
		if(data.date_raw > date)
		{
			show_modal_image(data.image_url, data.title, data.date_raw)
			return
		}
	}

	var first = images_changed[0]

	show_modal_image(first.image_url, first.title, first.date_raw)
}

function setup_modal_image()
{
	var img = $("#modal_image")

	img[0].addEventListener('load', function()
	{
		$("#modal_image_spinner").css("display", "none")
		$("#modal_image").css("display", "block")
		update_modal_scrollbar("image")
	})

	img.on("error", function() 
	{		
		$("#modal_image_spinner").css("display", "none")
		$("#modal_image").css("display", "none")
		$("#modal_image_error").css("display", "block")
		update_modal_scrollbar("image")
	})

	var f = function(e)
	{
		var direction = e.deltaY > 0 ? 'down' : 'up'

		if(direction === 'up')
		{
			modal_image_prev_wheel_timer()
		}

		else if(direction === 'down')
		{
			modal_image_next_wheel_timer()
		}
	}	

	$("#Msg-window-image")[0].addEventListener("wheel", f)
	$("#Msg-overlay-image")[0].addEventListener("wheel", f)

	$("#modal_image").click(function()
	{
		var s = make_safe($("#modal_image").data("image_title"))
		msg_info.show(s)
	})
}

var modal_image_prev_wheel_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			image_prev_click()
		}, 200)
	}
})()

var modal_image_next_wheel_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			image_next_click()
		}, 200)
	}
})()

function show_current_date()
{
	chat_announce({brk1:'[', brk2:']', msg:nice_date()})	
}

function request_slice_upload(data)
{
	var place = data.current_slice * upload_slice_size

	var file = files[data.date]

	var slice = file.slice(place, place + Math.min(upload_slice_size, file.size - place))

	file.reader.readAsArrayBuffer(slice)

	var percentage = Math.floor(((upload_slice_size * data.current_slice) / file.size) * 100)

	$(`#uploading_${file.date}`).find(".announcement_content").eq(0).text(`Uploading: ${percentage}%`)	
}

function upload_ended(data)
{
	$(`#uploading_${data.date}`).find(".announcement_content").eq(0).text("Uploading: 100%")
	delete files[data.date]	
}

function error_occurred()
{
	chat_announce({brk1:'[', brk2:']', msg:"An error occurred"})
}

function verify_email(code)
{
	if(utilz.clean_string5(code).length !== code.length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Invalid code"})
		return
	}

	if(code.length === 0)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Empty code"})
		return
	}
	
	if(code.length > email_change_code_max_length)
	{
		chat_announce({brk1:'[', brk2:']', msg:"Invalid code"})
		return
	}

	socket_emit("verify_email", {code:code})
}

function start_locked_mode()
{
	$("#header").css("display", "none")
	$("#footer").css("display", "none")

	show_locked_menu()
	make_main_container_visible()	
}

function show_locked_menu()
{
	msg_locked.show()
}

function show_goto_room()
{
	var s = `
	<input id='goto_room_input' type='text' placeholder='Room ID or URL'>
	<div class='spacer3'></div>
	<div class='menu_item' id='goto_room_button'>Go To Room</div>`

	msg_info.show(s, function()
	{
		$("#goto_room_input").focus()

		$("#goto_room_button").click(function()
		{
			goto_room_action()
		})

		gtr = true
	})
}

function goto_room_action()
{
	var id = $("#goto_room_input").val().trim()

	if(id.length === 0)
	{
		return false
	}

	goto_url(id, "tab")

	msg_info.close()
}

function confirm_reset_settings()
{
	var r = confirm("Are you sure you want to reset the settings to their initial state?")

	if(r)
	{
		reset_settings()
	}
}

function reset_settings()
{
	localStorage.removeItem(ls_settings)
	get_settings()
	start_settings_state()
	call_setting_actions(false)
	save_settings()	
}

function setup_chat()
{
	if(settings.custom_scrollbars)
	{
		start_chat_scrollbar()
	}	
}

function execute_javascript(arg)
{
	try
	{
		var r = eval(arg)

		if(typeof r === "number")
		{
			try
			{
				r = utilz.round(r, 2)
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
		
		if(r === undefined || typeof r === "object")
		{
			r = "Done"
		}
	}
	
	catch(err)
	{
		var r = "Error"
	}

	var s = make_safe(arg)

	var f = function()
	{
		msg_info.show(s)
	}

	chat_announce({brk1:'[', brk2:']', msg:`js: ${r}`, onclick:f})
}

function make_safe(text, html=false)
{
	var c = $("<div></div>")

	c.append("<div id='msg_info_text'></div>")

	var c_text = c.find("#msg_info_text").eq(0)

	c_text.text(text)

	if(html)
	{
		c.append(`<div id='msg_info_html'>${html}</div>`)
	}

	return c[0]
}