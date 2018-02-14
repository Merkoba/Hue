var socket
var ls_settings = "settings_v15"
var ls_input_history = "input_history_v11"
var ls_room_settings = "room_settings_v1"
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
var can_images
var can_chat
var can_radio
var can_tv
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
var orb_timeout
var modal_open = false
var started = false
var connections = 0
var afk_timer
var afk = false
var alert_mode = 0
var sound_notify_timer
var alert_timer
var commands = []
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
var template_media_menu
var msg_menu
var msg_userinfo
var msg_userlist
var msg_roomlist
var msg_played
var msg_image
var msg_profile
var msg_info
var msg_image_picker
var played_filtered = false
var userlist_filtered = false
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
	activate_window_visibility_listener()
	input_click_events()
	copypaste_events()
	main_menu_events()
	scroll_events()
	resize_events()
	register_commands()
	start_chat_scrollbar()
	start_chat_click_events()
	start_played_click_events()
	start_userlist_click_events()
	start_roomlist_click_events()
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
	template_media_menu = Handlebars.compile($('#template_media_menu').html())
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
		chat_announce('[', ']', 'This room is public', 'small')
	}

	else
	{
		chat_announce('[', ']', 'This room is private', 'small')
	}
}

function show_room()
{
	chat_announce('[', ']', `Room: ${room_name}`, 'small')
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
		chat_announce('[', ']', "That's already the room name", 'small')
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
		chat_announce('[', ']', `Radio: ${radio_source}`, 'small', false, `Setter: ${radio_setter} | ${radio_date}`)
	}

	else
	{
		chat_announce('[', ']', `Radio: ${radio_source}`, 'small')
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
			chat_announce(brk1, brk2, `Topic: ${topic}`, size, false, `Setter: ${topic_setter} | ${topic_date}`)
		}

		else
		{
			chat_announce(brk1, brk2, `Topic: ${topic}`, size)
		}
	}

	else 
	{
		chat_announce(brk1, brk2, `Topic: ${get_unset_topic()}`, size)
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
	can_chat = check_chat_permission(role)
	can_images = room_images_enabled && check_images_permission(role)
	can_radio =  room_radio_enabled && check_radio_permission(role)
	can_tv = room_tv_enabled && check_tv_permission(role)

	setup_icons()
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

function check_chat_permission(role)
{
	if(role === "admin" || role === "op")
	{
		return true
	}

	if(role === "voice1")
	{
		if(v1_chat_permission)
		{
			return true
		}
	}

	else if(role === "voice2")
	{
		if(v2_chat_permission)
		{
			return true
		}
	}

	else if(role === "voice3")
	{
		if(v3_chat_permission)
		{
			return true
		}
	}

	else if(role === 'voice4')
	{
		if(v4_chat_permission)
		{
			return true
		}
	}

	return false
}

function check_images_permission(role)
{
	if(role === "admin" || role === "op")
	{
		return true
	}

	if(role === "voice1")
	{
		if(v1_images_permission)
		{
			return true
		}
	}

	else if(role === "voice2")
	{
		if(v2_images_permission)
		{
			return true
		}
	}

	else if(role === "voice3")
	{
		if(v3_images_permission)
		{
			return true
		}
	}

	else if(role === 'voice4')
	{
		if(v4_images_permission)
		{
			return true
		}
	}

	return false
}

function check_tv_permission(role)
{
	if(role === "admin" || role === "op")
	{
		return true
	}

	if(role === "voice1")
	{
		if(v1_tv_permission)
		{
			return true
		}
	}

	else if(role === "voice2")
	{
		if(v2_tv_permission)
		{
			return true
		}
	}

	else if(role === "voice3")
	{
		if(v3_tv_permission)
		{
			return true
		}
	}

	else if(role === 'voice4')
	{
		if(v4_tv_permission)
		{
			return true
		}
	}

	return false
}

function check_radio_permission(role)
{
	if(role === "admin" || role === "op")
	{
		return true
	}

	if(role === "voice1")
	{
		if(v1_radio_permission)
		{
			return true
		}
	}

	else if(role === "voice2")
	{
		if(v2_radio_permission)
		{
			return true
		}
	}

	else if(role === "voice3")
	{
		if(v3_radio_permission)
		{
			return true
		}
	}

	else if(role === 'voice4')
	{
		if(v4_radio_permission)
		{
			return true
		}
	}

	return false
}

function show_role(data)
{
	if(role === 'admin')
	{
		chat_announce('[', ']', 'You are an admin', 'small')
	}

	else if(role === 'op')
	{
		chat_announce('[', ']', 'You are an op', 'small')
	}

	else if(role.startsWith('voice'))
	{
		chat_announce('[', ']', `You have ${role}`, 'small')
	}

	var ps = 0

	if(can_chat)
	{
		chat_announce('[', ']', "You have chat permission", 'small')

		ps += 1
	}

	if(can_images)
	{
		chat_announce('[', ']', "You have images permission", 'small')

		ps += 1
	}

	if(can_tv)
	{
		chat_announce('[', ']', "You have tv permission", 'small')

		ps += 1
	}

	if(can_radio)
	{
		chat_announce('[', ']', "You have radio permission", 'small')

		ps += 1
	}

	if(ps === 0)
	{
		chat_announce('[', ']', "You cannot interact", 'small')
	}
}

function show_username()
{
	chat_announce('[', ']', `Username: ${username}`, 'small')
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
		if(data.type === 'chat_msg')
		{
			update_chat(data.username, data.msg, data.profile_image)
		}

		if(data.type === 'joined')
		{
			connections += 1
			room_name = data.room_name
			username = data.username
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
			
			make_main_container_visible()
			
			start_heartbeat()

			started = true
		}

		if(data.type === 'new_username')
		{
			announce_new_username(data)
		}

		else if(data.type === 'chat_announcement')
		{
			chat_announce('###', '###', data.msg, 'small')
		}

		else if(data.type === 'connection_lost')
		{
			refresh()
		}

		else if(data.type === 'image_change')
		{
			queue_image(data)
			announce_uploaded_image(data)			
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
			chat_announce('~', '~', `${data.username1} banned ${data.username2}`, 'small')
		}

		else if(data.type === 'announce_unban')
		{
			chat_announce('~', '~', `${data.username1} unbanned ${data.username2}`, 'small')
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
			chat_announce('[', ']', "There was nothing to unban", 'small')
		}

		else if(data.type === 'nothingtoclear')
		{
			chat_announce('[', ']', "There was nothing to clear", 'small')
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
			chat_announce('[', ']', "User doesn't exist", 'small')
		}

		else if(data.type === 'user_not_in_room')
		{
			chat_announce('[', ']', "User is not in the room", 'small')
		}

		else if(data.type === 'noopstoremove')
		{
			chat_announce('[', ']', "There were no ops to remove", 'small')
		}

		else if(data.type === 'novoicestoreset')
		{
			chat_announce('[', ']', "There were no voices to reset", 'small')
		}

		else if(data.type === 'isalready')
		{
			isalready(data.who, data.what)
		}

		else if(data.type === 'user_already_banned')
		{
			chat_announce('[', ']', "User is already banned", 'small')
		}

		else if(data.type === 'user_already_unbanned')
		{
			chat_announce('[', ']', "User is already unbanned", 'small')
		}

		else if(data.type === 'privacy_change')
		{
			announce_privacy_change(data)
		}

		else if(data.type === 'changed_radio_source')
		{
			announce_radio_source_change(data)
			setup_radio(data)			
		}

		else if(data.type === 'restarted_radio_source')
		{
			announce_radio_source_change(data, false, "restart")
			setup_radio(data)			
		}

		else if(data.type === 'changed_tv_source')
		{
			announce_tv_source_change(data)
			setup_tv(data)			
		}

		else if(data.type === 'restarted_tv_source')
		{
			announce_tv_source_change(data, false, "restart")
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
			chat_announce('[', ']', `${username} is already reserved`, 'small')
		}

		else if(data.type === 'couldnotrecover')
		{
			chat_announce('[', ']', "You don't seem to own that username", 'small')
		}

		else if(data.type === 'songnotfound')
		{
			chat_announce('[', ']', "The song couldn't be found", 'small')
		}

		else if(data.type === 'videonotfound')
		{
			chat_announce('[', ']', "The video couldn't be found", 'small')
		}

		else if(data.type === 'room_created')
		{
			show_open_room(data.id)
		}

		else if(data.type === 'redirect')
		{
			goto_url(data.location)
		}

		else if(data.type === 'username_changed')
		{
			username_changed(data)
		}

		else if(data.type === 'username_already_exists')
		{
			chat_announce('[', ']', "Username already exists", 'small')
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

		else if(data.type === 'typing')
		{
			show_typing()
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
	})

	socket.on('request_slice_upload', (data) => 
	{ 
		var place = data.current_slice * upload_slice_size

		var file = files[data.date]

		var slice = file.slice(place, place + Math.min(upload_slice_size, file.size - place))

		file.reader.readAsArrayBuffer(slice)
		
		var percentage = Math.floor(((upload_slice_size * data.current_slice) / file.size) * 100)

		$(`#uploading_${file.date}`).find(".announcement_content").eq(0).text(`Uploading: ${percentage}%`)
	})

	socket.on('upload_ended', (data) => 
	{ 
		$(`#uploading_${data.date}`).find(".announcement_content").eq(0).text("Uploading: 100%")

		delete files[data.date]
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

	change("radio", true)	
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

	change("tv", true)
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

	if(announce_joins && check_chat_permission(data.role))
	{		
		chat_announce('--', '--', `${data.username} has joined`, 'small', false, false, false, true)
		alert_title()
		sound_notify()
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

	return []
}

function start_userlist_click_events()
{
	$("#userlist").on("click", ".ui_item_uname", function()
	{
		show_profile($(this).text(), get_user_by_username($(this).text()).profile_image)
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
		selector: ".ui_item_uname, .chat_uname",
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
	})
}

function show_roomlist()
{
	msg_roomlist.show()
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
			chat_announce('[', ']', "You don't have permission to upload images", 'small')
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
			chat_announce('[', ']', "File is too big", 'small')
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

	chat_announce('[', ']', `Uploading: 0%`, 'small', false, false, false, false, `uploading_${date}`)	
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

function activate_key_detection()
{
	$(document).keydown(function(e)
	{
		if(iup)
		{
			if(e.key === "Enter")
			{
				var val = $("#image_url_picker_input").val().trim()

				if(val !== "")
				{
					upload_image_by_url(val)
					close_all_modals()
					e.preventDefault()
				}
			}

			return			
		}

		if(rup)
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

		if(tup)
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

		if(crm)
		{
			if(e.key === "Enter")
			{
				create_room_submit()
				e.preventDefault()
			}

			return
		}

		if(orb)
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

		if(stu)
		{
			if(e.key === "Tab" && e.shiftKey)
			{
				close_all_modals()
				e.preventDefault()
			}

			return
		}			

		if(modal_open)
		{
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

function add_to_history(msg, change_index=true)
{
	for(var i=0; i<input_history.length; i++)
	{
		if(input_history[i][0] === msg)
		{
			input_history.splice(i, 1)
			break
		}
	}

	if(input_history.length >= input_history_crop_limit)
	{
		input_history.splice(0, input_history.length - input_history_crop_limit + 1)
	}

	push_to_input_history([msg, nice_date()])

	if(change_index)
	{
		reset_input_history_index()
	}
}

function push_to_input_history(item)
{
	input_history.push(item)
	save_local_storage(ls_input_history, input_history)
}

function get_input_history()
{
	input_history = get_local_storage(ls_input_history)

	if(input_history === null)
	{
		input_history = []
	}

	reset_input_history_index()
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
			add_to_history(input_val, false)

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

function show_history(filter=false)
{
	if(input_history.length > 0)
	{
		if(filter)
		{
			sfilter = `value='${filter}'`
		}

		else
		{
			sfilter = ''
		}

		var c = $("<div></div>")

		var s = $(`<input type='text' id='history_filter' class='filter_input' placeholder='Filter' ${sfilter}><div class='spacer3'></div>`)

		var s2 = $("<div id='history_items'></div>")

		for(var item of input_history.slice().reverse())
		{
			var h = $(`<div title='${item[1]}' class='history_item'></div>`)

			h.text(item[0]).urlize()

			s2.append(h)
		}

		s = s.add(s2)

		c.append(s)

		c = c[0]

		msg_info.show(c, function()
		{
			$("#history_filter").on("input", function()
			{
				history_filter_timer()
			})

			if(filter)
			{
				do_history_filter()
			}

			$("#history_items").on("click", ".history_item", function()
			{
				if($(this).find('a').length === 0)
				{
					change_input($(this).text())
					close_all_modals()
				}
			})
		})
	}

	else
	{
		msg_info.show("Messages or commands you type will appear here")
	}
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
	return str.valueOf() === what.split('').sort().join('')
}

function oiStartsWith(str, what) 
{
	return str.valueOf().startsWith(`${what.split('').sort().join('')} `)
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
		change_input(`>${$(this).closest('.chat_message').find('.chat_content').eq(0).text()}`)
	})

	$("#chat_area").on("click", ".chat_profile_image", function() 
	{
		show_profile($(this).closest(".chat_message").find(".chat_uname").eq(0).text(), $(this).attr('src'))
	})	
}

function update_chat(uname, msg, prof_image, date=false)
{
	if(msg.startsWith('//'))
	{
		msg = msg.slice(1)
	}

	var contclasses = "chat_content"

	if(uname !== username)
	{
		var regex = new RegExp("(^|\\s+)" + escape_special_characters(username) + "($|\\s+|\\!|\\?|\\,|\\.)")

		if(msg.search(regex) !== -1)
		{
			contclasses += " dotted"

			alert_title2()
		}
	}

	if(date)
	{
		d = date
	}

	else
	{
		d = Date.now()
	}

	var nd = nice_date(d)

	if(prof_image === "" || prof_image === undefined)
	{
		var pi = default_profile_image_url
	}

	else
	{
		var pi = prof_image
	}

	if(msg.startsWith('/me ') || msg.startsWith('/em '))
	{
		var s = `
		<div class='msg chat_message thirdperson'>
		*&nbsp;<span class='chat_uname'></span>
		&nbsp;<span class='${contclasses}' title='${nd}' data-date='${d}'></span>&nbsp;*</div>`

		var fmsg = $(s)

		fmsg.find('.chat_content').eq(0).text(msg.substr(4)).urlize()
	}

	else
	{
		var s = `
		<div class='msg chat_message'>
			<span chat_profile_image_container'>
				<img class='chat_profile_image' src='${pi}'>
			</span>
			<span class='chat_right_side'>
				<span class='chat_uname_container'>
					<span class='chat_uname'></span>
				</span>
				<span class='chat_content_container'>
					<span class='${contclasses}' title='${nd}' data-date='${d}'></span>
				</span>
			</span>
		</div>`

		var fmsg = $(s)

		fmsg.find('.chat_content').eq(0).text(msg).urlize()
	}
	
	fmsg.find('.chat_uname').eq(0).text(uname)

	fmsg.find('.chat_profile_image').eq(0).on("error", function() 
	{
		if($(this).attr("src") !== default_profile_image_url)
		{
			$(this).attr("src", default_profile_image_url)
		}		
	})	

	add_to_chat(fmsg, true)

	goto_bottom()

	alert_title()

	sound_notify()

	if(uname !== username)
	{
		hide_pencil()
	}
}

function add_to_chat(msg, save=false, update_scrollbar=true)
{
	var chat_area = $('#chat_area')
	var last_msg = $(".msg").last()
	var appended = false

	if((msg.hasClass("chat_message") && !msg.hasClass("thirdperson")) && (last_msg.hasClass("chat_message") && !last_msg.hasClass("thirdperson")))
	{
		if(msg.find(".chat_uname").eq(0).text() === last_msg.find(".chat_uname").eq(0).text())
		{
			if(last_msg.find(".chat_content").length < max_same_post_messages)
			{
				var date_diff = msg.find('.chat_content').last().data("date") - last_msg.find('.chat_content').last().data("date")

				if(date_diff < max_same_post_diff)
				{
					last_msg.find(".chat_content_container").eq(0).append("<br>").append(msg.find(".chat_content").eq(0))
					replace_in_chat_history(last_msg)
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
			scroll_timer()
		}
		
		if(save)
		{
			msg_id += 1
			msg.data("msg_id", msg_id)
			push_to_chat_history(msg)
		}
	}

	if(update_scrollbar)
	{
		update_chat_scrollbar()
	}
}

function push_to_chat_history(msg)
{
	chat_history.push(msg.clone(true, true))

	if(chat_history.length > chat_crop_limit)
	{
		chat_history.shift()
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

function change(type, force=false, play=true)
{	
	if(type === "image")
	{
		if(!force && last_image_change === image_url)
		{
			return false
		}
	}

	else if(type === "tv")
	{
		if(!force && last_tv_change === tv_source)
		{
			return false
		}
	}

	else if(type === "radio")
	{
		if(!force && last_radio_change === radio_source)
		{
			return false
		}
	}

	if(afk && type !== "radio")
	{
		change_when_focused = true

		if(type === "image")
		{
			change_image_when_focused = true
		}

		if(type === "tv")
		{
			change_tv_when_focused = true
		}

		return false
	}

	if(!first_tv_played)
	{
		play = false
	}

	if(type === "image")
	{
		if(!room_images_enabled || !room_settings.images_enabled || images_locked)
		{
			return false
		}

		show_image()

		last_image_change = image_url
	}

	else if(type === "tv")
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

			show_youtube_video(play)
		}

		else if(tv_type === "twitch")
		{
			if(twitch_video_player === undefined)
			{
				return false
			}

			show_twitch_video(play)
		}
		
		else if(tv_type === "url")
		{
			show_video(play)
		}

		else
		{
			return false
		}

		first_tv_played = true

		last_tv_change = tv_source
	}

	else if(type === "radio")
	{
		if(!room_radio_enabled || !room_settings.radio_enabled || !radio_started || radio_locked)
		{
			return false
		}

		start_radio()
	}

	else
	{
		return false
	}

	alert_title()
	sound_notify()
}

function show_image()
{
	if($("#media_image").attr('src') !== image_url)
	{
		$('#media_image').attr('src', image_url)
	}

	else
	{
		after_image_load($('#media_image')[0])
	}
}

function show_current_image_modal()
{
	show_modal_image(current_image_url, current_image_title)
}

function start_image_events()
{
	$('#media_image')[0].addEventListener('load', function(e)
	{
		after_image_load(e.target)
	})	

	$('#test_image')[0].addEventListener('load', function() 
	{
		emit_pasted($('#test_image').attr('src'))
	})

	$('#test_image').on("error", function() 
	{
		chat_announce('[', ']', "The provided image URL failed to load", 'small')		
	})	
}

function after_image_load(img)
{
	current_image_url = image_url
	current_image_title = image_title
	
	$(img).prop('title', image_title)
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
	image_type = data.image_type

	change("image")
}

function chat_announce(brk1, brk2, msg, size, dotted=false, title=false, onclick=false, save=false, id=false, date=false)
{
	var containerclasses = "announcement_content_container"

	if(onclick)
	{
		containerclasses += " pointer"
	}

	var containerid = " "

	if(id)
	{
		containerid = ` id='${id}' `
	}

	var contclasses = "announcement_content"

	if(dotted === true)
	{
		contclasses += " dotted"

		alert_title2()
	}

	if(title)
	{
		var t = `${title}`
	}

	else
	{
		var t = nice_date()
	}

	if(date)
	{
		d = date
	}

	else
	{
		d = Date.now()
	}	

	if(brk1 !== "")
	{
		var hbrk1 = `${brk1}&nbsp;`
	}

	else
	{
		hbrk1 = ""
	}

	if(brk2 !== "")
	{
		var hbrk2 = `&nbsp;${brk2}`
	}

	else
	{
		var hbrk2 = ""
	}
	
	if(typeof dotted === "string")
	{
		var s = `

		<div${containerid}class='msg announcement announcement_${size}'>
			<span class='${containerclasses}' title='${t}'>${hbrk1}<span class='${contclasses}'></span>${hbrk2}</span>
		</div>`

		var fmsg = $(s)
		fmsg.find('.dotted').eq(0).text(dotted).urlize()
	}

	else
	{
		var s = `
		<div${containerid}class='msg announcement announcement_${size}'>
			<span class='${containerclasses}' title='${t}'>${hbrk1}<span class='${contclasses}'></span>${hbrk2}</span>
		</div>`

		var fmsg = $(s)
	}

	var content = fmsg.find('.announcement_content').eq(0)

	content.text(msg).urlize()

	if(onclick)
	{
		content.parent().on("click", onclick)
	}

	add_to_chat(fmsg, save)

	goto_bottom()
}

jQuery.fn.urlize = function() 
{
	if(this.length > 0) 
	{
		this.each(function(n, obj)
		{
			var x = $(obj).html()

			var list = x.match(/\bhttps?:\/\/\S+/g)

			if(list) 
			{
				for(var i=0; i<list.length; i++) 
				{
					x = x.replace(list[i], `<a class='generic' target='_blank' href='${list[i]}'>${list[i]}</a>`)
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
	commands.push('/userinfo')
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
	commands.push('/fill')
	commands.push('/shrug')
	commands.push('/afk')
	commands.push('/disconnectothers')

	commands.sort()
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
				chat_search()
			}			

			else if(oiStartsWith(lmsg, '/search'))
			{
				chat_search(arg)
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
				upload_image_by_url(arg)
			}

			else if(oiEquals(lmsg, '/status'))
			{
				show_status()
			}

			else if(oiEquals(lmsg, '/userinfo'))
			{
				show_userinfo()
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
				show_history()
			}

			else if(oiStartsWith(lmsg, '/history'))
			{
				show_history(arg)
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

			else if(oiEquals(lmsg, '/details'))
			{
				request_details(arg)
			}

			else if(oiEquals(lmsg, '/logout'))
			{
				logout(arg)
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

			else
			{
				chat_announce('[', ']', "Invalid command. Use // to start a message with /", 'small')
			}
		}

		else 
		{
			if(can_chat)
			{
				update_chat(username, msg, profile_image)	
				socket_emit('sendchat', {msg:msg})
			}

			else
			{
				chat_announce('[', ']', "You don't have permission to chat", 'small')
			}
		}

		if(to_history)
		{
			add_to_history(msg)
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
				chat_announce('[', ']', "Topic is already set to that", 'small')
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
			chat_announce('[', ']', "There is no more room to add that to the topic", 'small')
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
				chat_announce('[', ']', "Argument must be a number", 'small')
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
			chat_announce('[', ']', "Nothing to trim", 'small')
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
			chat_announce('[', ']', "There is no more room to add that to the topic", 'small')
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
				chat_announce('[', ']', "Argument must be a number", 'small')
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
			chat_announce('[', ']', "Nothing to trim", 'small')
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
			var regex = new RegExp("(^|\\s+)" + escape_special_characters(username) + "($|\\s+|\\!|\\?|\\,|\\.)")

			if(data.topic.search(regex) !== -1)
			{
				highlight = true
			}
		}

		chat_announce('~', '~', `${data.topic_setter} changed the topic to: ${data.topic}`, 'small', highlight)

		set_topic_info(data)

		update_title()
	}
}

function announce_room_name_change(data)
{
	if(data.name !== room_name)
	{		
		chat_announce('~', '~', `${data.username} changed the room name to: ${data.name}`, 'small')

		room_name = data.name

		update_title()
	}
}

function announce_new_username(data)
{
	replace_uname_in_userlist(data.old_username, data.username)

	var show = check_chat_permission(get_role(data.username))

	if(username === data.old_username)
	{
		username = data.username

		if(show)
		{
			chat_announce('~', '~', `${data.old_username} is now known as ${username}`, 'small')
		}

		else
		{
			chat_announce('[', ']', `You are now known as ${username}`, 'small')
		}
	}

	else
	{
		if(show)
		{
			chat_announce('~', '~', `${data.old_username} is now known as ${data.username}`, 'small')
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

function emit_pasted(url)
{	
	if(!can_images)
	{
		chat_announce('[', ']', "You don't have permission to link images", 'small')
		return false
	}
	
	socket_emit('pasted', {image_url:url})
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

				if(!source)
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
	document.getElementById('header').addEventListener("wheel", function(e)
	{
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
		chat_announce('[', ']', "Argument must be a number", 'small')
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
		sound_notify_timer = setTimeout(function()
		{ 
			if(document.hidden)
			{
				pup()
			}
		}, unfocus_delay)
	}
}

function alert_title()
{
	if(!started)
	{
		return false
	}

	alert_timer = setTimeout(function()
	{ 
		if(document.hidden)
		{
			if(alert_mode === 0)
			{
				alert_mode = 1
				update_title()
			}
		}
	}, unfocus_delay)
}

function alert_title2()
{
	if(!started)
	{
		return false
	}

	alert_timer = setTimeout(function()
	{
		if(document.hidden)
		{
			if(alert_mode !== 2)
			{
				alert_mode = 2
				update_title()
			}
		}
	}, unfocus_delay)
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

			if(alert_timer !== undefined)
			{
				clearTimeout(alert_timer)
			}

			afk = false

			remove_alert_title()

			if(change_when_focused)
			{
				if(change_image_when_focused)
				{
					change("image")
				}
				
				if(change_tv_when_focused)
				{
					change("tv")
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

	pup()

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

var search_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			chat_search($("#search_filter").val())
		}, 350)
	}
})()

function create_search_container()
{
	var c = $("<div></div>")

	var s = $(`<input type='text' id='search_filter' class='filter_input' placeholder='Search'><div class='spacer3'></div>`)
	
	var s2 = $("<div id='search_container'></div>")

	s = s.add(s2)

	c.append(s)

	c = c[0]

	msg_info.show(c, function()
	{
		$("#search_filter").on("input", function()
		{
			search_timer()
		})
	})	
}

function chat_search(filter=false)
{
	if($("#search_container").length === 0)
	{
		create_search_container()
	}

	if(filter !== "" && !msg_info.is_open())
	{
		msg_info.show()
	}

	$("#search_filter").focus()

	if(filter)
	{
		sfilter = filter
	}

	else
	{
		sfilter = ''
	}

	$("#search_filter").val(sfilter)

	if(!filter)
	{
		$("#search_container").html("Search for chat messages")
		update_modal_scrollbar("info")		
		return
	}

	filter = filter.trim().toLowerCase()

	var c = $("<div></div>")

	if(chat_history.length > 0)
	{
		$(chat_history.slice(0).reverse()).each(function()
		{
			var show = false
			
			var huname = $(this).find('.chat_uname').eq(0)
			var hcontent_container = $(this).find('.chat_content_container').eq(0)
			var hcontent = $(this).find('.chat_content')

			if(huname.length !== 0 && hcontent.length !== 0)
			{
				var uname = huname.text()

				var content = ""

				hcontent.each(function()
				{
					content += `${$(this).text()} `	
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
					var cn = $("<div class='search_result_item'><div class='search_result_uname'></div><div class='search_result_content'></div>")

					cn.find(".search_result_uname").eq(0).html(huname.clone())

					for(var i=0; i < hcontent.length; i++)
					{
						var hc = hcontent.get(i)

						if(i < hcontent.length - 1)
						{
							cn.find(".search_result_content").eq(0).append($(hc).clone()).append("<br>")
						}

						else
						{
							cn.find(".search_result_content").eq(0).append($(hc).clone())
						}
					}

					c.append(cn)
				}
			}

			else
			{
				var hcontent = $(this).find(".announcement_content").eq(0)

				if(hcontent.length === 0)
				{
					return true
				}

				var content = hcontent.text()
				
				if(content.toLowerCase().indexOf(filter) === -1)
				{
					return true
				}

				var cn = $("<div class='search_result_item'><div class='search_result_content'></div>")

				cn.find(".search_result_content").eq(0).html(hcontent.parent().clone(true, true))

				c.append(cn)				
			}
		})
	}

	if(c.find(".search_result_item").length === 0)
	{
		c = "No results"
	}

	else
	{
		c = c[0]
	}
	
	$("#search_container").html(c)

	update_modal_scrollbar("info")

	$('#Msg-content-container-info').scrollTop(0)	
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
	
	for(var el of chat_history)
	{
		add_to_chat(el.clone(true, true), false, false)
	}

	update_chat_scrollbar()

	$("#chat_area").find(".ps__rail-x").eq(0).prependTo("#chat_area")
	$("#chat_area").find(".ps__rail-y").eq(0).prependTo("#chat_area")

	goto_bottom(true)
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
	if(get_local_storage('firstime') === null)
	{
		help()
		save_local_storage('firstime', false)
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
				chat_announce('[', ']', "You can't assign a role to yourself", 'small')
				return false
			}

			if((rol === 'admin' || rol === 'op') && role !== 'admin')
			{
				forbiddenuser()
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
	chat_announce('[', ']', "The image could not be uploaded", 'small')	
}

function announce_uploaded_image(data, date=false)
{
	if(date)
	{
		var d = date
	}

	else
	{
		var d = Date.now()
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
		show_modal_image(data.image_url, title)
	}

	chat_announce("<i class='icon2 fa fa-camera'></i>", '', msg, 'small', false, title, onclick, true, false, d)
}

function announce_role_change(data)
{
	if(username === data.username2)
	{
		set_role(data.role)
	}

	chat_announce('~', '~', `${data.username1} gave ${data.role} to ${data.username2}`, 'small')

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
			chat_announce('[', ']', "Room is already public", 'small')
		}

		else
		{
			chat_announce('[', ']', "Room is already private", 'small')
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
	
	chat_announce('~', '~', s, 'small')
}

function change_radio_source(src)
{
	if(can_radio)
	{
		if(src.indexOf("http://") !== -1 || src.indexOf("https://") !== -1 || src === "default")
		{
			if(src.indexOf("youtube.com") !== -1 || src.indexOf("youtu.be") !== -1)
			{
				if(!youtube_enabled)
				{
					chat_announce('[', ']', "Invalid radio source", 'small')
					return
				}
			}
		}

		else if(src !== "restart" && src !== "reset")
		{
			if(!youtube_enabled)
			{
				chat_announce('[', ']', "Invalid radio source", 'small')
				return
			}
		}

		src = utilz.clean_string2(src)

		if(src.length > 0 && src.length <= max_radio_source_length)
		{
			socket_emit('change_radio_source', {src:src})
		}
	}

	else
	{
		chat_announce('[', ']', "You don't have permission to change the radio", 'small')
	}
}

function announce_radio_source_change(data, date=false, action="change")
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
		var d = Date.now()
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

	chat_announce("<i class='icon2 fa fa-volume-up'></i>", '', action, 'small', false, title, onclick, true, false, d)
}

function change_tv_source(src)
{
	if(can_tv)
	{
		if(src.indexOf("http://") !== -1 || src.indexOf("https://") !== -1 || src === "default")
		{
			if(src.indexOf("youtube.com") !== -1 || src.indexOf("youtu.be") !== -1)
			{
				if(utilz.get_youtube_id(src) && !youtube_enabled)
				{
					chat_announce('[', ']', "YouTube support is not enabled", 'small')
					return
				}
			}

			else if(src.indexOf("twitch.tv") !== -1)
			{
				if(utilz.get_twitch_id(src) && !twitch_enabled)
				{
					chat_announce('[', ']', "Twitch support is not enabled", 'small')
					return
				}
			}
		}

		else if(src !== "restart" && src !== "reset")
		{
			if(!youtube_enabled)
			{
				chat_announce('[', ']', "YouTube support is not enabled", 'small')
				return
			}
		}

		src = utilz.clean_string2(src)

		if(src.length > 0 && src.length <= max_tv_source_length)
		{
			socket_emit('change_tv_source', {src:src})
		}
	}

	else
	{
		chat_announce('[', ']', "You don't have permission to change the tv", 'small')
	}
}

function announce_tv_source_change(data, date=false, action="change")
{
	if(data.tv_title !== "")
	{
		var name = data.tv_title
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
		var d = Date.now()
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

	chat_announce("<i class='icon2 fa fa-television'></i>", '', action, 'small', false, title, onclick, true, false, d)
}

function ban(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_max_username_length)
		{
			if(uname === username)
			{
				chat_announce('[', ']', "You can't ban yourself", 'small')
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
				chat_announce('[', ']', "You can't unban yourself", 'small')
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
				chat_announce('[', ']', "You can't kick yourself", 'small')
				return false
			}

			if(usernames.indexOf(uname) === -1)
			{
				chat_announce('[', ']', "Nobody is using that username", 'small')
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
	chat_announce('~', '~', `${data.username} unbanned all banned users`, 'small')
}

function isalready(who, what)
{
	if(what === 'voice1')
	{
		chat_announce('[', ']', `${who} already has voice 1`, 'small')
	}

	else if(what === 'voice2')
	{
		chat_announce('[', ']', `${who} already has voice 2`, 'small')
	}

	else if(what === 'voice3')
	{
		chat_announce('[', ']', `${who} already has voice 3`, 'small')
	}

	else if(what === 'voice4')
	{
		chat_announce('[', ']', `${who} already has voice 4`, 'small')
	}

	else if(what === 'op')
	{
		chat_announce('[', ']', `${who} is already an op`, 'small')
	}

	else if(what === 'admin')
	{
		chat_announce('[', ']', `${who} is already an admin`, 'small')
	}
}

function forbiddenuser()
{
	chat_announce('[', ']', "That operation is forbidden on that user", 'small')
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
		chat_announce('[', ']', "You are not a room admin", 'small')
		return false
	}

	socket_emit('remove_ops', {})
}

function announce_voices_resetted(data)
{
	chat_announce('~', '~', `${data.username} resetted the voices`, 'small')

	if(role.startsWith('voice') && role !== "voice1")
	{
		set_role("voice1")
	}

	reset_voices_userlist()
}

function announce_removedops(data)
{
	chat_announce('~', '~', `${data.username} removed all ops`, 'small')

	if(role === 'op')
	{
		set_role("voice1")
	}

	remove_ops_userlist()
}

function disconnected(data)
{
	removefrom_userlist(data.username)

	if(announce_parts && check_chat_permission(data.role))
	{
		chat_announce('--', '--', `${data.username} has left`, 'small', false, false, false, true)
	}
}

function pinged(data)
{
	removefrom_userlist(data.username)

	if(announce_parts && check_chat_permission(data.role))
	{
		chat_announce('--', '--', `${data.username} has left (Ping Timeout)`, 'small', false, false, false, true)
	}
}

function kicked(data)
{
	removefrom_userlist(data.username)

	chat_announce('--', '--', `${data.username} was kicked by ${data.info1}`, 'small', false, false, false, true)
}

function banned(data)
{
	removefrom_userlist(data.username)

	chat_announce('--', '--', `${data.username} was banned by ${data.info1}`, 'small', false, false, false, true)
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

	msg_menu.set(template_menu())
	msg_userinfo.set(template_userinfo())
	msg_userlist.set(template_userlist())
	msg_roomlist.set(template_roomlist())
	msg_played.set(template_played())
	msg_profile.set(template_profile({profile_image: default_profile_image_url}))
	msg_image_picker.set(template_image_picker())
	msg_media_menu.set(template_media_menu())

	msg_image.create()
	msg_info.create()
}

function info_vars_to_false()
{
	crm = false
	orb = false
	stu = false	
	rup = false
	tup = false
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
}

function start_settings_listeners()
{
	$("#setting_background_image").change(function()
	{
		settings.background_image = $("#setting_background_image").prop("checked")
		set_default_theme()
		save_settings()
	})

	$("#setting_custom_scrollbars").change(function()
	{
		settings.custom_scrollbars = $("#setting_custom_scrollbars").prop("checked")
		setup_scrollbars()
		save_settings()
	})

	$("#setting_sound_notifications").change(function()
	{
		settings.sound_notifications = $("#setting_sound_notifications").prop("checked")
		save_settings()
	})

	$("#setting_modal_effects").change(function()
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

		save_settings()
	})
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

var history_filter_timer = (function() 
{
	var timer 

	return function() 
	{
		clearTimeout(timer)

		timer = setTimeout(function() 
		{
			do_history_filter()
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

function reset_userlist_filter()
{
	$("#userlist_filter").val("")
	do_userlist_filter()
}

function do_history_filter()
{
	var filter = $("#history_filter").val().trim().toLowerCase()

	if(filter !== "")
	{
		$(".history_item").each(function()
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
		$(".history_item").each(function()
		{
			$(this).css("display", "block")
		})
	}

	update_modal_scrollbar("info")

	$('#Msg-content-container-info').scrollTop(0)
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
		change("radio")
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
		change("tv")
	}
}

function start_twitch()
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
			change("tv")
		}
	})
}

function setup_userinfo()
{
	$('#userinfo_profile_image').get(0).addEventListener('load', function()
	{
		update_modal_scrollbar("userinfo")
	})

	$("#userinfo_profile_image").attr("src", profile_image)
}

function show_userinfo()
{
	msg_userinfo.show(function()
	{
		$("#userinfo_username").text(username)
		update_modal_scrollbar("userinfo")
	})
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

	h.append(info)

	h.find("#status_room_name").eq(0).text(room_name).urlize()

	var t = h.find("#status_topic").eq(0)

	if(t.text() === "")
	{
		t.text(get_topic()).urlize()
	}

	h.find("#status_radio_source").eq(0).text(radio_source).urlize()

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

	update_chat(username, s, profile_image)
}

function confirm_logout()
{
	var r = confirm("Are you sure? Make sure you know your current username and password to avoid getting locked out later.")

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
		chat_announce('[', ']', "Username contains invalid characters", 'small')
		return
	}

	if(uname.length === 0)
	{
		chat_announce('[', ']', "Username can't be empty", 'small')
		return
	}

	if(uname.length > max_username_length)
	{
		chat_announce('[', ']', "Username is too long", 'small')
		return
	}

	if(uname === username)
	{
		chat_announce('[', ']', "That's already your username", 'small')
		return
	}

	socket_emit("change_username", {username:uname})
}

function username_changed(data)
{
	user_username = data.username

	chat_announce('[', ']', `Username succesfully changed to ${data.username}`, 'small')
}

function change_password(passwd)
{
	if(passwd.length < min_password_length)
	{
		chat_announce('[', ']', `Password is too short. It must be at least ${min_password_length} characters long`, 'small')
		return
	}

	if(passwd.length > max_password_length)
	{
		chat_announce('[', ']', "Password is too long", 'small')
		return
	}

	socket_emit("change_password", {password:passwd})
}

function password_changed(data)
{
	chat_announce('[', ']', `Password succesfully changed to ${data.password}. To force other clients connected to your account to disconnect you can use /disconnectothers`, 'small')
}

function change_email(email)
{
	if(email.length === 0)
	{
		chat_announce('[', ']', "Username can't be empty", 'small')
		return
	}

	if(email.indexOf('@') === -1 || email.indexOf(' ') !== -1)
	{
		chat_announce('[', ']', "Invalid email address", 'small')
		return
	}	

	if(email.length > max_email_length)
	{
		chat_announce('[', ']', "Email is too long", 'small')
		return
	}

	socket_emit("change_email", {email:email})
}

function email_changed(data)
{
	chat_announce('[', ']', `Email succesfully changed to ${data.email}`, 'small')
}

function request_details()
{
	socket_emit("get_details", {})
}

function show_details(data)
{
	if(data.email === "")
	{
		data.email = "No Email"
	}

	var h = $("<div></div>")	

	var info = ""

	info += "<div class='info_item'><div class='info_title'>Username</div><div class='info_item_content' id='details_username'></div></div>"
	info += "<div class='info_item'><div class='info_title'>Email</div><div class='info_item_content' id='details_email'></div></div>"

	h.append(info)

	h.find("#details_username").eq(0).text(data.username)
	h.find("#details_email").eq(0).text(data.email)

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
					update_chat(data.username, data.content, data.profile_image, message.date)
				}

				else if(message.type === "image")
				{
					announce_uploaded_image(data, message.date)
				}

				else if(message.type === "radio")
				{
					announce_radio_source_change(data, message.date)
				}

				else if(message.type === "tv")
				{
					announce_tv_source_change(data, message.date)
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
			chat_announce('[', ']', "Log is already enabled", 'small')
		}

		else
		{
			chat_announce('[', ']', "Log is already disabled", 'small')
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

	chat_announce('~', '~', s, 'small')

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

	chat_announce('~', '~', s, 'small')
}

function show_log()
{
	if(log_enabled)
	{
		chat_announce('[', ']', "Log is enabled", 'small')
	}

	else
	{
		chat_announce('[', ']', "Log is disabled", 'small')
	}
}

function show_modal_image(url, title=false)
{
	if(title)
	{
		var t = `title="${title}"`
	}

	else
	{
		var t = ""
	}

	var c = $("<div class='modal_image_container'></div>")

	c.append($(`<div id="modal_spinner" class='spinner1'></div><img ${t} id="modal_image" class="modal_image" src="${url}">`))

	var img = c.find("#modal_image").eq(0)

	img[0].addEventListener('load', function()
	{
		$("#modal_spinner").css("display", "none")
		this.style.display = "block"
		update_modal_scrollbar("image")
	})

	img.on("error", function() 
	{
		msg_image.set("<div class='padding1'>Image no longer available</div>")
	})

	msg_image.show(c[0])
}

function not_an_op()
{
	chat_announce('[', ']', "You are not a room operator", 'small')
}

function show_radio_url_picker()
{
	var s = ""

	s += "<i class='fa fa-volume-up'></i>"
	s += "<div class='spacer3'></div>"
	s += "Enter a YouTube search term or URL"
	s += "<br>Or an audio file/stream URL"
	s += "<div class='spacer3'></div>"
	s += "<input id='radio_url_picker_input' class='input1'>"

	msg_info.show(s, function()
	{
		rup = true

		$("#radio_url_picker_input").focus()
	})
}

function show_image_picker()
{
	msg_image_picker.show(function()
	{
		iup = true

		$("#image_url_picker_input").focus()
	})
}

function show_tv_url_picker()
{
	var s = ""

	s += "<i class='fa fa-television'></i>"
	s += "<div class='spacer3'></div>"
	s += "Enter a YouTube search term or URL"
	s += "<br>Or a Twitch channel/video URL"
	s += "<br>Or a video file/stream URL"
	s += "<div class='spacer3'></div>"
	s += "<input id='tv_url_picker_input' class='input1'>"

	msg_info.show(s, function()
	{
		tup = true

		$("#tv_url_picker_input").focus()
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

function toggle_images()
{
	room_settings.images_enabled = !room_settings.images_enabled

	change_images_visibility()

	save_room_settings()
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

		change("image")
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
	}

	fix_visible_video_frame()
	update_chat_scrollbar()
	goto_bottom()
}

function toggle_tv()
{
	room_settings.tv_enabled = !room_settings.tv_enabled

	change_tv_visibility()

	save_room_settings()	
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

		change("tv", false, false)
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
	}

	update_chat_scrollbar()
	goto_bottom()	
}

function toggle_radio()
{
	room_settings.radio_enabled = !room_settings.radio_enabled

	change_radio_visibility()

	save_room_settings()	
}

function change_radio_visibility()
{
	if(room_radio_enabled && room_settings.radio_enabled)
	{
		$("#radio").css("display", "initial")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-on")

		$("#header_topic").css("display", "none")
	}

	else
	{
		stop_radio()
		
		$("#radio").css("display", "none")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-off")

		$("#header_topic").css("display", "initial")
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
			var s = "<img id='profile_image_canvas_image'><div id='profile_image_canvas_button'>Crop and Upload</div>"

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
					viewMode: 1,
					ready: function () 
					{
						croppable = true;
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
			chat_announce('[', ']', `Room images are already enabled`, 'small')
			return false			
		}
	}
	
	else
	{
		if(!room_images_enabled)
		{
			chat_announce('[', ']', `Room images are already disabled`, 'small')
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
			chat_announce('[', ']', `Room tv is already enabled`, 'small')
			return false			
		}
	}
	
	else
	{
		if(!room_tv_enabled)
		{
			chat_announce('[', ']', `Room tv is already disabled`, 'small')
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
			chat_announce('[', ']', `Room radio is already enabled`, 'small')
			return false			
		}
	}
	
	else
	{
		if(!room_radio_enabled)
		{
			chat_announce('[', ']', `Room radio is already disabled`, 'small')
			return false
		}
	}

	socket_emit("change_radio_enabled", {what:what})	
}

function announce_room_images_enabled_change(data)
{
	if(data.what)
	{
		chat_announce('~', '~', `${data.username} enabled room images`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} disabled room images`, 'small')
	}

	room_images_enabled = data.what

	change_images_visibility()
	check_permissions()
}

function announce_room_tv_enabled_change(data)
{
	if(data.what)
	{
		chat_announce('~', '~', `${data.username} enabled room tv`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} disabled room tv`, 'small')
	}

	room_tv_enabled = data.what

	change_tv_visibility(data.what)
	check_permissions()
}

function announce_room_radio_enabled_change(data)
{
	if(data.what)
	{
		chat_announce('~', '~', `${data.username} enabled room radio`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} disabled room radio`, 'small')
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
	chat_announce('~', '~', `${data.username} changed the theme to ${data.color}`, 'small')

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

	chat_announce('~', '~', `${data.username} changed the background image`, 'small')	
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
			chat_announce('[', ']', `Background image is already enabled`, 'small')
			return false			
		}
	}
	
	else
	{
		if(!default_background_image_enabled)
		{
			chat_announce('[', ']', `Background image is already disabled`, 'small')
			return false
		}
	}

	socket_emit("change_default_background_image_enabled", {what:what})	
}

function announce_default_background_image_enabled_change(data)
{
	if(data.what)
	{
		chat_announce('~', '~', `${data.username} enabled the background image`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} disabled the background image`, 'small')
	}

	default_background_image_enabled = data.what

	set_default_theme()
}

function upload_image_by_url(url)
{
	if(!can_images)
	{
		chat_announce('[', ']', "You don't have permission to link images", 'small')
		return false
	}

	url = url.replace(/\.gifv/g,'.gif')

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
		chat_announce('[', ']', `That permission is already set to that`, 'small')
		return false
	}

	socket_emit("change_voice_permission", {ptype:ptype, what:what})		
}

function announce_voice_permission_change(data)
{
	if(data.what)
	{
		chat_announce('~', '~', `${data.username} set ${data.ptype} to true`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} set ${data.ptype} to false`, 'small')
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

		change("image")
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

		change("tv")
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

		change("radio")
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
	chat_announce('[', ']', `You joined ${room_name}`, 'small', false, false, false, true)
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

function stop_and_lock()
{
	stop_videos()
	stop_radio()

	toggle_lock_images(true)
	toggle_lock_tv(true)
	toggle_lock_radio(true)
}

function refresh_image()
{
	change("image", true, true)
}

function refresh_tv()
{
	change("tv", true, true)
}

function refresh_radio()
{
	change("radio", true, true)
}

function default_media_state()
{
	toggle_lock_images(false)
	toggle_lock_tv(false)
	toggle_lock_radio(false)

	var save_settings = false

	room_settings.images_enabled = true

	if(room_images_enabled)
	{
		change_images_visibility()
	}

	room_settings.tv_enabled = true

	if(room_tv_enabled)
	{
		change_tv_visibility()
	}
	
	room_settings.radio_enabled = true

	if(room_radio_enabled)
	{
		change_radio_visibility()
	}

	save_room_settings()
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

	chat_announce('[', ']', s, 'small')
}