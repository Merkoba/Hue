var socket
var ls_settings = "settings_v14"
var ls_input_history = "input_history_v11"
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
var can_upload
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
var claimed = false
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
var orb_timeout
var modal_open = false
var started = false
var connections = 0
var afk_timer
var afk = false
var alert_mode = 0
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
var msg_menu
var msg_userinfo
var msg_userlist
var msg_roomlist
var msg_played
var msg_image
var msg_profile
var msg_info
var msg_username_picker
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
var first_opacity_checked = false
var profile_image
var change_image_when_focused = false 
var change_tv_when_focused = false
var twitch_video_player
var images_enabled = true
var tv_enabled = true
var radio_enabled = true
var room_images_enabled = true
var room_tv_enabled = true
var room_radio_enabled = true
var radio_started = false
var default_theme
var default_theme_on = false
var image_queue = ["first"]
var image_queue_timeout

function init()
{
	get_volume()
	activate_key_detection()
	set_opacity(general_opacity)	
	compile_templates()
	get_settings()
	start_msg()
	start_settings_state()
	start_settings_listeners()
	start_filters()
	start_image_events()
	set_image_cors()
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
	setup_opacity()
	start_twitch()
	check_image_queue()

	start_socket()
}

function make_main_container_visible()
{
	$("body").css("background-image", "none")
	$("#main_container").css("opacity", 1).css("pointer-events", "initial")
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

function show_intro()
{
	chat_announce('', '', `Welcome to ${room_name}, ${username}`, 'big')
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
	if(claimed)
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
	if(claimed)
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

	else
	{
		return default_topic_unclaimed
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

	upload_permission = data.upload_permission
	chat_permission = data.chat_permission
	radio_permission = data.radio_permission
	tv_permission = data.tv_permission

	check_permissions()
}

function check_permissions()
{
	can_chat = check_chat_permission(role)
	can_upload = room_images_enabled && check_upload_permission(role)
	can_radio =  room_radio_enabled && check_radio_permission(role)
	can_tv = room_tv_enabled && check_tv_permission(role)

	setup_icons()
}

function setup_icons()
{
	if(room_images_enabled)
	{
		$("#toggle_images_container").css("display", "initial")

		if(can_upload)
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
		$("#toggle_images_container").css("display", "none")
	}

	if(room_radio_enabled)
	{
		$("#toggle_radio_container").css("display", "initial")

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
		$("#toggle_radio_container").css("display", "none")
	}

	if(room_tv_enabled)
	{
		$("#toggle_tv_container").css("display", "initial")

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
		$("#toggle_tv_container").css("display", "none")
	}
}

function check_upload_permission(role)
{
	if(upload_permission === 1)
	{
		return true
	}

	else if(upload_permission === 2)
	{
		if(role === "admin" || role === "op" || role === "voice")
		{
			return true
		}

		return false
	}

	else if(upload_permission === 3)
	{
		if(role === "admin" || role === "op")
		{
			return true
		}

		return false	
	}

	else
	{
		return false
	}	
}

function check_chat_permission(role)
{
	if(chat_permission === 1)
	{
		return true
	}

	else if(chat_permission === 2)
	{
		if(role === "admin" || role === "op" || role === "voice")
		{
			return true
		}

		return false
	}

	else if(chat_permission === 3)
	{
		if(role === "admin" || role === "op")
		{
			return true
		}

		return false	
	}

	else
	{
		return false
	}	
}

function check_radio_permission(role)
{
	if(radio_permission === 1)
	{
		return true
	}

	else if(radio_permission === 2)
	{
		if(role === "admin" || role === "op" || role === "voice")
		{
			return true
		}

		return false
	}

	else if(radio_permission === 3)
	{
		if(role === "admin" || role === "op")
		{
			return true
		}

		return false	
	}

	else
	{
		return false
	}	
}

function check_tv_permission(role)
{
	if(tv_permission === 1)
	{
		return true
	}

	else if(tv_permission === 2)
	{
		if(role === "admin" || role === "op" || role === "voice")
		{
			return true
		}

		return false
	}

	else if(tv_permission === 3)
	{
		if(role === "admin" || role === "op")
		{
			return true
		}

		return false	
	}

	else
	{
		return false
	}	
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

	else if(role === 'voice')
	{
		chat_announce('[', ']', 'You have voice', 'small')
	}

	if(role === 'admin' || role === 'op')
	{
		show_chat_permission()
		show_upload_permission()
		show_radio_permission()
		show_tv_permission()
	}

	else
	{
		var ps = 0

		if(can_chat)
		{
			chat_announce('[', ']', "You have chat permission", 'small')

			ps += 1
		}

		if(can_upload)
		{
			chat_announce('[', ']', "You have upload permission", 'small')

			ps += 1
		}

		if(can_radio)
		{
			chat_announce('[', ']', "You have radio permission", 'small')

			ps += 1
		}

		if(can_tv)
		{
			chat_announce('[', ']', "You have tv permission", 'small')

			ps += 1
		}

		if(ps === 0)
		{
			chat_announce('[', ']', "You cannot interact", 'small')
		}
	}
}

function show_username()
{
	chat_announce('[', ']', `Username: ${username}`, 'small')
}

function socket_emit(dest, obj)
{
	console.log(`Emit: ${dest}`)
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
			claimed = data.claimed
			setup_profile_image(data.profile_image)
			userlist = data.userlist
			update_userlist()
			log_enabled = data.log
			log_messages = data.log_messages
			default_theme = data.default_theme
			set_default_theme()			
			check_role(data)
			set_topic_info(data)
			update_title()
			is_public = data.public
			setup_active_media(data)
			setup_userinfo()
			clear_chat()
			check_firstime()
			get_input_history()

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

		else if(data.type === 'upload_permission_change')
		{
			announce_upload_permission_change(data)
		}

		else if(data.type === 'chat_permission_change')
		{
			announce_chat_permission_change(data)
		}

		else if(data.type === 'radio_permission_change')
		{
			announce_radio_permission_change(data)
		}

		else if(data.type === 'tv_permission_change')
		{
			announce_tv_permission_change(data)
		}

		else if(data.type === 'log_changed')
		{
			announce_log_change(data)
		}

		else if(data.type === 'log_cleared')
		{
			announce_log_cleared(data)
		}

		else if(data.type === 'announce_voice')
		{
			announce_voice(data)
		}

		else if(data.type === 'announce_op')
		{
			announce_op(data)
		}

		else if(data.type === 'announce_admin')
		{
			announce_admin(data)
		}

		else if(data.type === 'announce_strip')
		{
			announce_strip(data)
		}

		else if(data.type === 'announce_removedvoices')
		{
			announce_removedvoices(data)
		}

		else if(data.type === 'announce_removedops')
		{
			announce_removedops(data)
		}

		else if(data.type === 'announce_unban_all')
		{
			announce_unban_all(data)
		}

		else if(data.type === 'announce_unban_last')
		{
			announce_unban_last(data)
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

		else if(data.type === 'noopstoremove')
		{
			chat_announce('[', ']', "There were no ops to remove", 'small')
		}

		else if(data.type === 'novoicestoremove')
		{
			chat_announce('[', ']', "There were no voices to remove", 'small')
		}

		else if(data.type === 'isalready')
		{
			isalready(data.who, data.what)
		}

		else if(data.type === 'announce_claim')
		{
			announce_claim(data)
		}

		else if(data.type === 'announce_unclaim')
		{
			announce_unclaim(data)
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

		else if(data.type === 'changed_tv_source')
		{
			announce_tv_source_change(data)
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
		push_played(false, {s1:radio_title, s2:`https://youtube.com/watch?v=${get_youtube_id(radio_source)}`})
		$('#audio').attr('src', '')
	}

	change("radio")	
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

	change("tv")
}

function stop_videos()
{
	if(youtube_video_player !== undefined)
	{
		youtube_video_player.stopVideo()
	}

	if(twitch_video_player !== undefined)
	{
		twitch_video_player.pause()
	}

	$("#media_video")[0].pause()	
}

function show_youtube_video()
{
	stop_videos()

	youtube_video_player.loadVideoById({videoId:get_youtube_id(tv_source), startSeconds:get_youtube_time(tv_source)})
	
	$("#media_video").css("display", "none")
	$("#media_twitch_video_container").css("display", "none")
	$("#media_youtube_video_container").css("display", "flex")

	youtube_video_player.playVideo()

	fix_video_frame("media_youtube_video")

	after_media_show()
}

function show_twitch_video()
{
	stop_videos()

	var id = get_twitch_id(tv_source)

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

	$("#media_video").css("display", "none")
	$("#media_youtube_video_container").css("display", "none")
	$("#media_twitch_video_container").css("display", "flex")

	twitch_video_player.play()

	fix_video_frame("media_twitch_video")

	after_media_show()
}

function show_video()
{
	stop_videos()

	$("#media_video").prop("src", tv_source)

	$("#media_youtube_video_container").css("display", "none")
	$("#media_twitch_video_container").css("display", "none")	
	$("#media_video").css("display", "flex")

	$("#media_video")[0].play()

	after_media_show()
}

function after_media_show()
{
	fix_media_margin()
}

function set_default_theme()
{
	var background_color = default_theme
	var background_color2 = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_3)
	var font_color = colorlib.get_lighter_or_darker(background_color, color_contrast_amount_1)

	change_colors(background_color, background_color2, font_color)

	default_theme_on = true
}

function change_colors(background_color, background_color2, font_color)
{	
	$('.bg1').css('background-color', background_color)
	$('.bg1').css('color', font_color)
	$('.bg2').css('background-color', background_color2)
	$('.bg2').css('color', font_color)	
}

function get_youtube_id(url)
{
	url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)

	var id = undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]

	return id.length === 11 ? id : false
}

function get_twitch_id(url)
{
	var match = url.match(/.*twitch\.tv(?:\/videos)?\/(\w+)/)

	if(match)
	{
		if(match[0].indexOf('twitch.tv/videos/') !== -1)
		{
			return ["video", match[1]]
		}

		else if(match[0].indexOf("clips.twitch.tv") !== -1)
		{
			return false
		}

		else
		{
			return ["channel", match[1]]
		}
	}

	else
	{
		return false
	}
}	

function get_youtube_time(url)
{
	var match = url.match(/[\?|&]t=(\d+)/)

	return match === null ? 0 : match[1]
}

function userjoin(data)
{
	addto_userlist(data.username, data.role, data.profile_image)

	if(announce_joins && check_chat_permission(data.role))
	{		
		chat_announce('--', '--', `${data.username} has joined`, 'small', false, false, false, true)
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
		if(userlist[i][0] === uname)
		{
			userlist[i][0] = uname
			userlist[i][1] = rol
			userlist[i][2] = pi
			update_userlist()
			return
		}
	}

	userlist.push([uname, rol, pi])
	update_userlist()
}

function removefrom_userlist(uname)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][0] === uname)
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
		if(userlist[i][0] === oldu)
		{
			userlist[i][0] = newu
			break
		}
	}

	update_userlist()
}

function replace_role_in_userlist(uname, rol)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][0] === uname)
		{
			userlist[i][1] = rol
			break
		}
	}

	update_userlist()
}

function get_role(uname)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][0] === uname)
		{
			return userlist[i][1]
		}
	}
}

function replace_claim_userlist(uname)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][0] === uname)
		{
			userlist[i][1] = 'admin'
		}

		else
		{
			userlist[i][1] = 'z'
		}
	}

	update_userlist()
}

function remove_roles_in_userlist()
{
	for(var i=0; i<userlist.length; i++)
	{
		userlist[i][1] = 'z'
	}

	update_userlist()
}

function remove_voices_userlist()
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][1] === 'voice')
		{
			userlist[i][1] = 'z'
		}
	}

	update_userlist()
}

function remove_ops_userlist()
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][1] === 'op')
		{
			userlist[i][1] = 'z'
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

	else if(p === 'voice')
	{
		var s = '[V]'
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
		if(user[0] === uname)
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
		show_profile($(this).text(), get_user_by_username($(this).text())[2])
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

		usernames.push(item[0])

		var h = $("<div class='userlist_item'><span class='ui_item_role'></span><span class='ui_item_uname'></span></div>")

		var p = role_tag(item[1])

		var pel = h.find('.ui_item_role').eq(0)

		pel.text(p)

		if(p === "")
		{
			pel.css("padding-right", 0)
		}

		h.find('.ui_item_uname').eq(0).text(item[0])

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
	if(a[1] === '')
	{
		a[1] = 'z'
	}

	if(b[1] === '')
	{
		b[1] = 'z'
	}

	if(a[1] > b[1]) 
	{
		return 1
	} 

	else if(a[1] < b[1]) 
	{ 
		return -1
	}

	if(a[0] < b[0]) 
	{ 
		return -1
	}

	else if(a[0] > b[0]) 
	{
		return 1
	}

	else 
	{ 
		return 0
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
			cmvoice: 
			{
				name: "Voice", callback: function(key, opt)
				{
					var arg = $(this).text()
					voice(arg)
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
				name: "Op", callback: function(key, opt)
				{
					var arg = $(this).text()
					op(arg)
				},
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
				} 
			},
			cmstrip: 
			{
				name: "Strip", callback: function(key, opt)
				{
					var arg = $(this).text()
					strip(arg)
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
			cmkick: 
			{
				name: "Kick", callback: function(key, opt)
				{
					var arg = $(this).text()
					kick(arg)
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
							admin(arg)
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
		var h = $(`<div class='roomlist_item' data-room_id='${roomlist[i][0]}'>${c}</div>`)

		h.find('.roomlist_name').eq(0).text(roomlist[i][1])

		h.find('.roomlist_count').eq(0).text(singular_or_plural(roomlist[i][3], "users"))

		if(roomlist[i][0] === room_id)
		{
			h.find('.roomlist_here').eq(0).text("You are here").css("display", "block")
		}

		if(roomlist[i][2].length > 0)
		{
			var topic = roomlist[i][2]
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
	$('#admin_chat_permission').change(function()
	{
		var what = JSON.parse($('#admin_chat_permission option:selected').val())
		change_chat_permission(what)
	})

	$('#admin_upload_permission').change(function()
	{
		var what = JSON.parse($('#admin_upload_permission option:selected').val())

		change_upload_permission(what)
	})

	$('#admin_tv_permission').change(function()
	{
		var what = JSON.parse($('#admin_tv_permission option:selected').val())

		change_tv_permission(what)
	})

	$('#admin_radio_permission').change(function()
	{
		var what = JSON.parse($('#admin_radio_permission option:selected').val())

		change_radio_permission(what)
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
		appendTo: "#admin_menu"
	})

	$("#admin_default_theme").on('hide.spectrum', function(e, t) 
	{
		change_default_theme(t.toRgbString())
	})
}

function show_main_menu()
{
	msg_menu.show(function()
	{
		if(role === "admin" || role === "op")
		{
			$('#admin_chat_permission').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === chat_permission)
				{
					$(this).prop('selected', true)
				}
			})

			$('#admin_upload_permission').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === upload_permission)
				{
					$(this).prop('selected', true)
				}
			})

			$('#admin_tv_permission').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === tv_permission)
				{
					$(this).prop('selected', true)
				}
			})

			$('#admin_radio_permission').find('option').each(function()
			{
				if(JSON.parse($(this).val()) === radio_permission)
				{
					$(this).prop('selected', true)
				}
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

			$("#admin_menu").css("display", "block")
		}

		else
		{
			$("#admin_menu").css("display", "none")
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
		clickable: '#footer_upload_icon',
		acceptedFiles: "image/jpeg,image/png,image/gif"
	})

	dropzone.on("addedfile", function(file) 
	{
		focus_input()

		if(!can_upload)
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

		var ext = name.split('.').pop().toLowerCase()

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif')
		{
			dropzone.files = []
			return false
		}

		var fr = new FileReader()

		fr.addEventListener("loadend", function() 
		{
			dropzone.files = []

			socket_emit("uploaded", 
			{
				image_file:fr.result, 
				name:file.name
			})

			chat_announce("[", "]", "Uploading", "small")
		})

		fr.readAsArrayBuffer(file)
	})
}

function is_textbox(element) 
{
	var tag_name = element.tagName.toLowerCase()

	if (tag_name === 'textarea') return true
	if (tag_name !== 'input') return false

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
			pup()

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
			if(e.shiftKey)
			{
				toggle_radio_state()
				e.preventDefault()
				return
			}

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

				input_history_index = -1
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

function change_input(s, to_end=true)
{
	$("#input").val(s)

	if(to_end)
	{
		input_to_end()
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

function add_to_history(msg)
{
	input_history_index = -1

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
}

function push_to_input_history(item)
{
	input_history.push(item)
	save_local_storage(ls_input_history, input_history)
}

function get_input_history()
{
	input_history_index = -1

	input_history = get_local_storage(ls_input_history)

	if(input_history === null)
	{
		input_history = []
	}	
}

function input_history_change(direction)
{
	if(input_history.length === 0)
	{
		return false
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
		input_history_index += 1

		if(input_history_index === input_history.length)
		{
			$("#input").val("")
			input_history_index = -1
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
		}, 350)
	}
})()

function check_scroll_notice()
{
	var $ch = $("#chat_area")
	var max = $ch.prop('scrollHeight') - $ch.innerHeight()

	if(max - $ch.scrollTop() > 100)
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
			goto_bottom(true)
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

function update_chat(uname, msg, prof_image, title=false)
{
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

	if(title)
	{
		var t = title
	}

	else
	{
		var t = nice_date()
	}

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
		var fmsg = $(`<div class='msg chat_message'>*&nbsp;<span class='chat_uname'></span>&nbsp;<span title='${t}' class='${contclasses}'></span>&nbsp;*</div>`)
		$(fmsg).find('.chat_content').eq(0).text(msg.substr(4)).urlize()
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
					<span title='${t}' class='${contclasses}'></span>
				</span>
			</span>
		</div>`

		var fmsg = $(s)

		$(fmsg).find('.chat_content').eq(0).text(msg).urlize()
	}
	
	$(fmsg).find('.chat_uname').eq(0).text(uname)

	add_to_chat(fmsg)

	push_to_chat_history(fmsg)

	goto_bottom()

	alert_title()
}

function add_to_chat(msg)
{
	var chat_area = $('#chat_area')

	if(document.hidden)
	{
		if($('.dash').length === 0 && (started || connections > 1))
		{
			chat_area.append("<div class='msg dash_container'><hr class='dash'></div>")
		}
	}

	chat_area.append(msg)

	if($(".msg").length > chat_crop_limit)
	{
		$("#chat_area > .msg").eq(0).remove()
		scroll_timer()
	}	

	update_chat_scrollbar()
}

function push_to_chat_history(msg)
{
	chat_history.push(msg.clone(true, true))

	if(chat_history.length > chat_crop_limit)
	{
		chat_history.shift()
	}	
}

function check_url_media(msg)
{
	var words = msg.split(' ')

	for(var i=0; i<words.length; i++)
	{
		var word = words[i].toLowerCase()

		if(!word.startsWith("https://") && !word.startsWith("http://"))
		{
			continue
		}

		if(can_upload)
		{
			if(word.indexOf('.jpg') !== -1 || word.indexOf('.png') !== -1 || word.indexOf('.jpeg') !== -1 || word.indexOf('.gif') !== -1)
			{
				var url = words[i].replace(/\.gifv/g,'.gif')

				$('#test_image').attr('src', url.split('?')[0])

				return
			}
		}

		if(can_tv)
		{
			if(youtube_enabled && (word.indexOf("youtube.com") !== -1 || word.indexOf("youtu.be") !== -1))
			{
				if(get_youtube_id(words[i]))
				{
					change_tv_source(words[i])
				}

				return
			}	
			
			if(twitch_enabled && (word.indexOf("twitch.tv") !== -1))
			{
				if(get_twitch_id(words[i]))
				{
					change_tv_source(words[i])
				}

				return
			}
		}
	}
}

function change(type)
{	
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

	if(type === "image")
	{
		if(!room_images_enabled || !images_enabled)
		{
			return false
		}

		show_image()
	}

	else if(type === "tv")
	{
		if(!room_tv_enabled || !tv_enabled)
		{
			return false
		}

		if(tv_type === "youtube")
		{
			if(youtube_video_player === undefined)
			{
				return false
			}

			show_youtube_video()
		}

		else if(tv_type === "twitch")
		{
			if(twitch_video_player === undefined)
			{
				return false
			}

			show_twitch_video()
		}
		
		else if(tv_type === "url")
		{
			show_video()
		}

		else
		{
			return false
		}
	}

	else if(type === "radio")
	{
		if(!room_radio_enabled || !radio_enabled || !radio_started)
		{
			return false
		}

		if(youtube_player === undefined)
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
}

function show_image()
{
	$('#media_image').attr('src', image_url)	
}

function show_current_image_modal()
{
	show_modal_image(current_image_url, current_image_title)
}

function start_image_events()
{
	$('#media_image')[0].addEventListener('load', function(img) 
	{
		try 
		{
			var colors = colorlib.get_dominant(this, 1)

			if(colors === null)
			{
				return
			}

			var color1 = colors[0]

			var background_color = color1

			if(settings.background_image)
			{
				var font_color = colorlib.get_lighter_or_darker(color1, color_contrast_amount_2)
				var color2 = colorlib.get_lighter_or_darker(color1, color_contrast_amount_4)
			}

			else
			{
				var font_color = colorlib.get_lighter_or_darker(color1, color_contrast_amount_1)
				var color2 = colorlib.get_lighter_or_darker(color1, color_contrast_amount_3)
			}

			var background_color2 = color2

			if(settings.background_color)
			{
				change_colors(background_color, background_color2, font_color)
				default_theme_on = false
			}

			if(settings.background_image)
			{
				$('#background_image').css('background-image', `url('${image_url}')`) 
			}

			current_image_url = image_url
			current_image_title = image_title			
			
			$(this).prop('title', image_title)
		}

		catch(err)
		{
			console.error(err)
		}
	})	

	$('#test_image')[0].addEventListener('load', function() 
	{
		emit_pasted($('#test_image').attr('src'))
	})
}

function set_image_cors()
{
	$('#media_image')[0].crossOrigin = "Anonymous"	
}

function get_size_string(size)
{
	return `${parseFloat(size / 1024).toFixed(2)} MB`
}

function set_opacity(o)
{
	$("#header").css("opacity", o)
	$("#media").css("opacity", o)
	$("#chat_area").css("opacity", o)
	$("#footer").css("opacity", o)
	$("#input").css("opacity", o)
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
		image_title = `Uploader: ${data.image_uploader} | Size: ${get_size_string(data.image_size)} | ${data.image_date}`
	}

	image_uploader = data.image_uploader
	image_size = data.image_size
	image_date = nice_date(data.image_date)

	change("image")
}

function chat_announce(brk1, brk2, msg, size, dotted=false, title=false, onclick=false, save=false)
{
	var containerclasses = "announcement_content_container"

	if(onclick)
	{
		containerclasses += " pointer"
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
		var fmsg = $(`<div class='msg announcement announcement_${size}'><span class='${containerclasses}' title='${t}'>${hbrk1}<span class='${contclasses}'></span><span class='dotted'></span>${hbrk2}</span></div>`)
		fmsg.find('.dotted').eq(0).text(dotted).urlize()
	}

	else
	{
		var fmsg = $(`<div class='msg announcement announcement_${size}'><span class='${containerclasses}' title='${t}'>${hbrk1}<span class='${contclasses}'></span>${hbrk2}</span></div>`)
	}

	var content = fmsg.find('.announcement_content').eq(0)

	content.text(msg).urlize()

	content.parent().on("click", onclick)

	add_to_chat(fmsg)

	if(save)
	{
		push_to_chat_history(fmsg)
	}

	goto_bottom()
}

jQuery.fn.urlize = function() 
{
	if(this.length > 0) 
	{
		this.each(function(n, obj)
		{
			var x = $(obj).html()

			var list = x.match(/((?:https?(?::\/\/))(?:www\.)?[a-zA-Z0-9-_.]+(?:\.[a-zA-Z0-9]{2,})(?:[-a-zA-Z0-9:%_+.~#?&//=@;]*))/g)

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

function urlize(s, classname="generic")
{
	return s.replace(/((?:https?(?::\/\/))(?:www\.)?[a-zA-Z0-9-_.]+(?:\.[a-zA-Z0-9]{2,})(?:[-a-zA-Z0-9:%_+.~#?&//=@;]*))/g, `<a class='${classname}' target='_blank' href='$1'>$1</a>`)
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
	commands.push('/claim')
	commands.push('/reclaim')
	commands.push('/unclaim')
	commands.push('/uploadpermission')
	commands.push('/chatpermission')
	commands.push('/radiopermission')
	commands.push('/tvpermission')
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
	commands.push('/voice')
	commands.push('/op')
	commands.push('/admin')
	commands.push('/strip')
	commands.push('/removevoices')
	commands.push('/removeops')
	commands.push('/ban')
	commands.push('/unbanall')
	commands.push('/unbanlast')
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

	commands.sort()
}

function send_to_chat(msg)
{
	msg = utilz.clean_string2(msg.substring(0, max_input_length))

	if(msg_is_ok(msg))
	{
		add_to_history(msg)

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

			else if(oiStartsWith(lmsg, '/claim'))
			{
				claim_room(arg)
			}

			else if(oiEquals(lmsg, '/claim'))
			{
				claim_room()
			}

			else if(oiEquals(lmsg, '/reclaim'))
			{
				reclaim_room()
			}

			else if(oiEquals(lmsg, '/unclaim'))
			{
				unclaim_room()
			}

			else if(oiStartsWith(lmsg, '/uploadpermission'))
			{
				change_upload_permission(arg)
			}

			else if(oiEquals(lmsg, '/uploadpermission'))
			{
				show_upload_permission()
			}

			else if(oiStartsWith(lmsg, '/chatpermission'))
			{
				change_chat_permission(arg)
			}

			else if(oiEquals(lmsg, '/chatpermission'))
			{
				show_chat_permission()
			}

			else if(oiStartsWith(lmsg, '/radiopermission'))
			{
				change_radio_permission(arg)
			}

			else if(oiEquals(lmsg, '/radiopermission'))
			{
				show_radio_permission()
			}

			else if(oiStartsWith(lmsg, '/tvpermission'))
			{
				change_tv_permission(arg)
			}

			else if(oiEquals(lmsg, '/tvpermission'))
			{
				show_tv_permission()
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
				return
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

			else if(oiStartsWith(lmsg, '/voice'))
			{
				voice(arg)
			}

			else if(oiStartsWith(lmsg, '/op'))
			{
				op(arg)
			}

			else if(oiStartsWith(lmsg, '/admin'))
			{
				admin(arg)
			}

			else if(oiStartsWith(lmsg, '/strip'))
			{
				strip(arg)
			}

			else if(oiEquals(lmsg, '/removevoices'))
			{
				remove_voices()
			}

			else if(oiEquals(lmsg, '/removeops'))
			{
				remove_ops()
			}

			else if(oiStartsWith(lmsg, '/ban'))
			{
				ban(arg)
			}

			else if(oiEquals(lmsg, '/unbanall'))
			{
				unban_all()
			}

			else if(oiEquals(lmsg, '/unbanlast'))
			{
				unban_last()
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
				return
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
				change("radio")
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

			else
			{
				chat_announce('[', ']', "Invalid command. Use // to start a message with /", 'small')
			}
		}

		else 
		{
			if(msg.startsWith('//'))
			{
				msg = msg.slice(1)
			}

			if(allow_pasted_media)
			{
				check_url_media(msg)
			}

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
	}

	clear_input()
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
		if($('#scroll_notice').css('visibility') == 'hidden')
		{
			$ch.scrollTop(max + 10)
		}
	}
}

function emit_pasted(url)
{
	chat_announce("[", "]", "Uploading", "small")	
	socket_emit('pasted', {image_url:url})
}

function get_radio_metadata()
{	
	if(!radio_enabled || !get_metadata || radio_type !== "radio")
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
			if(!radio_enabled || !get_metadata || radio_type !== "radio")
			{
				return
			}

			try
			{
				if(Array.isArray(data.icestats.source))
				{
					for(var i=0; i<data.icestats.source.length; i++)
					{
						var source = data.icestats.source[i]

						if(source.listenurl.indexOf(radio_source.split('/').pop()) !== -1)
						{
							break
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

				if(source === undefined || source.artist === undefined || source.title === undefined)
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

	update_chat_scrollbar()

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
			youtube_player.loadVideoById({videoId:get_youtube_id(radio_source), startSeconds:get_youtube_time(radio_source)})
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
		if(radio_enabled && radio_type === "radio")
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
	}, 1000)
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
	}, 1000)
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
			$('.dash_container').remove()
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
	close_all_modals()
	socket_emit('create_room', data)
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
			var hcontent = $(this).find('.chat_content').eq(0)

			if(huname.length !== 0 && hcontent.length !== 0)
			{
				var uname = huname.text()
				var content = hcontent.text()

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
					cn.find(".search_result_content").eq(0).html(hcontent.clone())

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

	show_intro()
	show_topic("big")
	show_log_messages()
	goto_bottom(true)
	focus_input()
}

function unclear_chat()
{
	clear_chat()
	
	for(var el of chat_history)
	{
		$("#chat_area").append(el.clone(true, true))
	}

	update_chat_scrollbar()
	goto_bottom(true)
}

function clear_input()
{
	$('#input').val("")
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

function claim_room(arg="")
{
	arg = arg.substring(0, 200)

	if(room_id === main_room_id && arg === '')
	{
		chat_announce('[', ']', "This room can\'t be claimed", 'small')
		return false
	}

	if(claimed && arg === '')
	{
		chat_announce('[', ']', "Room is already claimed", 'small')
		return false
	}

	socket_emit('claim_room', {pass:arg})
}

function reclaim_room()
{
	if(!claimed)
	{
		chat_announce('[', ']', "Room hasn\'t been claimed yet", 'small')
		return false
	}

	if(role !== 'admin')
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
		return false
	}

	socket_emit('claim_room', {pass:''})
}

function unclaim_room()
{
	if(!claimed)
	{
		chat_announce('[', ']', "Room hasn\'t been claimed yet", 'small')
		return false
	}

	if(role !== 'admin')
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
		return false
	}

	socket_emit('unclaim_room', {})
}

function check_firstime()
{
	if(get_local_storage('firstime') === null)
	{
		help()
		save_local_storage('firstime', false)
	}
}

function change_chat_permission(m)
{
	if(role === 'admin' || role === 'op')
	{
		var amodes = [1, 2, 3]

		if(!isNaN(m))
		{
			m = parseInt(m)

			if(m === chat_permission)
			{
				chat_announce('[', ']', `Chat permission is already ${m}`, 'small')
				return false
			}			

			if(amodes.indexOf(m) !== -1)
			{
				socket_emit('change_chat_permission', {chat_permission:m})
			}

			else
			{
				chat_announce('[', ']', "That permission does not exist", 'small')
			}
		}

		else
		{
			chat_announce('[', ']', "Argument must be a number", 'small')
		}
	}

	else
	{
		not_an_op()
	}
}

function change_upload_permission(m)
{
	if(role === 'admin' || role === 'op')
	{
		var amodes = [1, 2, 3]

		if(!isNaN(m))
		{
			m = parseInt(m)

			if(m === upload_permission)
			{
				chat_announce('[', ']', `Upload permission is already ${m}`, 'small')
				return false
			}			

			if(amodes.indexOf(m) !== -1)
			{
				socket_emit('change_upload_permission', {upload_permission:m})
			}

			else
			{
				chat_announce('[', ']', "That permission does not exist", 'small')
			}
		}

		else
		{
			chat_announce('[', ']', "Argument must be a number", 'small')
		}
	}

	else
	{
		not_an_op()
	}
}

function change_radio_permission(m)
{
	if(role === 'admin' || role === 'op')
	{
		var amodes = [1, 2, 3]

		if(!isNaN(m))
		{
			m = parseInt(m)

			if(m === radio_permission)
			{
				chat_announce('[', ']', `Radio permission is already ${m}`, 'small')
				return false
			}			

			if(amodes.indexOf(m) !== -1)
			{
				socket_emit('change_radio_permission', {radio_permission:m})
			}

			else
			{
				chat_announce('[', ']', "That permission does not exist", 'small')
			}
		}

		else
		{
			chat_announce('[', ']', "Argument must be a number", 'small')
		}
	}

	else
	{
		not_an_op()
	}
}

function change_tv_permission(m)
{
	if(role === 'admin' || role === 'op')
	{
		var amodes = [1, 2, 3]

		if(!isNaN(m))
		{
			m = parseInt(m)

			if(m === tv_permission)
			{
				chat_announce('[', ']', `TV permission is already ${m}`, 'small')
				return false
			}			

			if(amodes.indexOf(m) !== -1)
			{
				socket_emit('change_tv_permission', {tv_permission:m})
			}

			else
			{
				chat_announce('[', ']', "That permission does not exist", 'small')
			}
		}

		else
		{
			chat_announce('[', ']', "Argument must be a number", 'small')
		}
	}

	else
	{
		not_an_op()
	}
}

function announce_chat_permission_change(data)
{
	var s = ""

	var d = `${data.username} changed the chat permission to`

	if(data.chat_permission === 1 && chat_permission !== 1)
	{
		s = `${d} 1. Anyone can chat`
	}

	else if(data.chat_permission === 2 && chat_permission !== 2)
	{
		s = `${d} 2. Only voiced users and up can chat`
	}

	else if(data.chat_permission === 3 && chat_permission !== 3)
	{
		s = `${d} 3. Only ops and up can chat`
	}

	if(s.length > 0)
	{
		chat_permission = data.chat_permission
		can_chat = check_chat_permission(role)
		setup_icons()
		chat_announce('~', '~', s, 'small')
	}
}

function announce_upload_permission_change(data)
{
	var s = ""

	var d = `${data.username} changed the upload permission to`

	if(data.upload_permission === 1 && upload_permission !== 1)
	{
		s = `${d} 1. Anyone can upload images`
	}

	else if(data.upload_permission === 2 && upload_permission !== 2)
	{
		s = `${d} 2. Only voiced users and up can upload images`
	}

	else if(data.upload_permission === 3 && upload_permission !== 3)
	{
		s = `${d} 3. Only ops and up can upload images`
	}

	if(s.length > 0)
	{
		upload_permission = data.upload_permission
		can_upload = check_upload_permission(role)
		setup_icons()
		chat_announce('~', '~', s, 'small')
	}
}

function announce_radio_permission_change(data)
{
	var s = ""

	var d = `${data.username} changed the radio permission to`

	if(data.radio_permission === 1 && radio_permission !== 1)
	{
		s = `${d} 1. Anyone can change the radio`
	}

	else if(data.radio_permission === 2 && radio_permission !== 2)
	{
		s = `${d} 2. Only voiced users and up can change the radio`
	}

	else if(data.radio_permission === 3 && radio_permission !== 3)
	{
		s = `${d} 3. Only ops and up can change the radio`
	}

	if(s.length > 0)
	{
		radio_permission = data.radio_permission
		can_radio = check_radio_permission(role)
		setup_icons()
		chat_announce('~', '~', s, 'small')
	}
}

function announce_tv_permission_change(data)
{
	var s = ""

	var d = `${data.username} changed the tv permission to`

	if(data.tv_permission === 1 && tv_permission !== 1)
	{
		s = `${d} 1. Anyone can change the tv`
	}

	else if(data.tv_permission === 2 && tv_permission !== 2)
	{
		s = `${d} 2. Only voiced users and up can change the tv`
	}

	else if(data.tv_permission === 3 && tv_permission !== 3)
	{
		s = `${d} 3. Only ops and up can change the tv`
	}

	if(s.length > 0)
	{
		tv_permission = data.tv_permission
		can_tv = check_tv_permission(role)
		setup_icons()
		chat_announce('~', '~', s, 'small')
	}
}

function show_upload_permission()
{
	chat_announce('[', ']', `Upload permission: ${upload_permission}`, 'small')
}

function show_chat_permission()
{
	chat_announce('[', ']', `Chat permission: ${chat_permission}`, 'small')
}

function show_radio_permission()
{
	chat_announce('[', ']', `Radio permission: ${radio_permission}`, 'small')
}

function show_tv_permission()
{
	chat_announce('[', ']', `TV permission: ${radio_permission}`, 'small')
}

function big_letter(s)
{
	return s.toUpperCase()[0]
}

function voice(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_username_length)
		{
			if(uname === username)
			{
				chat_announce('[', ']', "You can't voice yourself", 'small')
				return false
			}

			if(usernames.indexOf(uname) === -1)
			{
				chat_announce('[', ']', "Nobody is using that username", 'small')
				return false
			}

			var rol = get_role(uname)

			if(rol === 'voice')
			{
				isalready(uname, 'voice')
				return false
			}

			if((rol === 'admin' || rol === 'op') && role !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('voice', {username:uname})
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
		var d = nice_date(date)
	}

	else
	{
		var d = nice_date(data.image_date)
	}

	var title = `Uploader: ${data.image_uploader} | Size: ${get_size_string(data.image_size)} | ${d}`	

	var onclick = function()
	{
		show_modal_image(data.image_url, title)
	}

	chat_announce("<i class='icon2 fa fa-camera'></i>", '', `${data.image_uploader} uploaded an image`, 'small', false, title, onclick, true)
}

function announce_voice(data)
{
	if(username === data.username2)
	{
		set_role("voice")
	}

	chat_announce('~', '~', `${data.username1} gave voice to ${data.username2}`, 'small')

	replace_role_in_userlist(data.username2, 'voice')
}

function announce_op(data)
{
	if(username === data.username2)
	{
		set_role("op")
	}

	chat_announce('~', '~', `${data.username1} gave op to ${data.username2}`, 'small')

	replace_role_in_userlist(data.username2, 'op')
}

function strip(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_username_length)
		{
			if(uname === username)
			{
				chat_announce('[', ']', "You can't strip yourself", 'small')
				return false
			}

			if(usernames.indexOf(uname) === -1)
			{
				chat_announce('[', ']', "Nobody is using that username", 'small')
				return false
			}

			var rol = get_role(uname)

			if(rol === 'z')
			{
				isalready(uname, '')
				return false
			}

			if((rol === 'admin' || rol === 'op') && role !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('strip', {username:uname})
		}
	}

	else
	{
		not_an_op()
	}
}

function announce_strip(data)
{
	if(username === data.username2)
	{
		set_role("")
	}

	chat_announce('~', '~', `${data.username1} removed role from ${data.username2}`, 'small')

	replace_role_in_userlist(data.username2, '')
}

function set_role(p)
{
	role = p

	check_permissions()
}

function announce_claim(data)
{
	claimed = true

	if(data.updated)
	{
		var s = `The room has been reclaimed by ${data.username}. All previous given roles are now invalid`
	}

	else
	{
		var s = `${data.username} has claimed this room`	
	}

	chat_announce('~', '~', s, 'small')

	if(username === data.username)
	{
		set_role("admin")
	}

	else
	{
		set_role("")
	}
	
	replace_claim_userlist(data.username)
}

function announce_unclaim(data)
{
	chat_announce('~', '~', `${data.username} unclaimed the room`, 'small')

	claimed = false

	set_role("")

	upload_permission = 1

	chat_permission = 1

	is_public = true

	set_topic_info(false)

	update_title()

	check_permissions()

	remove_roles_in_userlist()

	if(radio_source !== "")

	if(radio_source !== default_radio_source)
	{
		setup_radio(false)
	}
}

function announce_admin(data)
{
	chat_announce('~', '~', `${data.username1} gave admin to ${data.username2}`, 'small')

	replace_role_in_userlist(data.username2, 'admin')
}

function admin(uname)
{
	if(role === 'admin')
	{
		if(uname.length > 0 && uname.length <= max_username_length)
		{
			if(uname === username)
			{
				chat_announce('[', ']', "You can't admin yourself", 'small')
				return false
			}

			if(usernames.indexOf(uname) === -1)
			{
				chat_announce('[', ']', "Nobody is using that username", 'small')
				return false
			}

			var rol = get_role(uname)

			if(rol === 'admin')
			{
				isalready(uname, 'admin')
				return false
			}

			socket_emit('admin', {username:uname})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
	}
}

function op(uname)
{
	if(role === 'admin')
	{
		if(uname.length > 0 && uname.length <= max_username_length)
		{
			if(uname === username)
			{
				chat_announce('[', ']', "You can't op yourself", 'small')
				return false
			}

			if(usernames.indexOf(uname) === -1)
			{
				chat_announce('[', ']', "Nobody is using that username", 'small')
				return false
			}

			var rol = get_role(uname)

			if(rol === 'op')
			{
				isalready(uname, 'op')
				return false
			}

			socket_emit('op', {username:uname})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
	}
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

		else
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

function announce_radio_source_change(data, date=false)
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
		var d = nice_date(date)
	}

	else
	{
		var d = nice_date(data.radio_date)
	}

	var title = `Setter: ${data.radio_setter} | ${d}`

	var onclick = function()
	{
		goto_url(source, "tab")
	}

	chat_announce("<i class='icon2 fa fa-volume-up'></i>", '', `${data.radio_setter} changed the radio to ${name}`, 'small', false, title, onclick, true)
}

function change_tv_source(src)
{
	if(can_tv)
	{
		if(src.indexOf("http://") !== -1 || src.indexOf("https://") !== -1 || src === "default")
		{
			if(src.indexOf("youtube.com") !== -1 || src.indexOf("youtu.be") !== -1)
			{
				if(get_youtube_id(src) && !youtube_enabled)
				{
					chat_announce('[', ']', "YouTube support is not enabled", 'small')
					return
				}
			}

			else if(src.indexOf("twitch.tv") !== -1)
			{
				if(get_twitch_id(src) && !twitch_enabled)
				{
					chat_announce('[', ']', "Twitch support is not enabled", 'small')
					return
				}
			}
		}

		else
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

function announce_tv_source_change(data, date=false)
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
		var d = nice_date(date)
	}

	else
	{
		var d = nice_date(data.tv_date)
	}

	var title = `Setter: ${data.tv_setter} | ${d}`

	var onclick = function()
	{
		goto_url(data.tv_source, "tab")
	}

	chat_announce("<i class='icon2 fa fa-television'></i>", '', `${data.tv_setter} changed the tv to ${name}`, 'small', false, title, onclick, true)
}

function ban(uname)
{
	if(role === 'admin' || role === 'op')
	{
		if(uname.length > 0 && uname.length <= max_username_length)
		{
			if(uname === username)
			{
				chat_announce('[', ']', "You can't ban yourself", 'small')
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

			socket_emit('ban', {username:uname})
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

function unban_last()
{
	if(role === 'admin' || role === 'op')
	{
		socket_emit('unban_last', {})
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
		if(uname.length > 0 && uname.length <= max_username_length)
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

function announce_unban_last(data)
{
	chat_announce('~', '~', `${data.username} unbanned the latest banned user`, 'small')
}

function isalready(who, what)
{
	if(what === 'voice')
	{
		chat_announce('[', ']', `${who} already has voice`, 'small')
	}

	else if(what === 'op')
	{
		chat_announce('[', ']', `${who} is already an op`, 'small')
	}

	else if(what === 'admin')
	{
		chat_announce('[', ']', `${who} is already an admin`, 'small')
	}

	else if(what === '')
	{
		chat_announce('[', ']', `${who} already has no role`, 'small')
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

function remove_voices()
{
	if(role !== 'admin' && role !== 'op')
	{
		not_an_op()
		return false
	}

	socket_emit('remove_voices', {})
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

function announce_removedvoices(data)
{
	chat_announce('~', '~', `${data.username} removed all voices`, 'small')

	if(role === 'voice')
	{
		set_role("")
	}

	remove_voices_userlist()
}

function announce_removedops(data)
{
	chat_announce('~', '~', `${data.username} removed all ops`, 'small')

	if(role === 'op')
	{
		set_role("")
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
		class: settings.modal_color,
		show_effect: "none",
		close_effect: "none",
		clear_editables: true
	}

	msg_menu = Msg
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

	msg_userinfo = Msg
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

	msg_userlist = Msg
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

	msg_roomlist = Msg
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

	msg_played = Msg
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

	msg_image = Msg
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

	msg_profile = Msg
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
			}
		})
	)

	msg_info = Msg
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

	msg_menu.set(template_menu())
	msg_userinfo.set(template_userinfo())
	msg_userlist.set(template_userlist())
	msg_roomlist.set(template_roomlist())
	msg_played.set(template_played())
	msg_profile.set(template_profile())

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

function change_modal_color(color)
{
	for(var ins of msg_menu.instances())
	{
		ins.change_class(color)
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

	if(settings.background_color === undefined)
	{
		settings.background_color = settings_default_background_color
		changed = true
	}
	
	if(settings.custom_scrollbars === undefined)
	{
		settings.custom_scrollbars = settings_default_custom_scrollbars
		changed = true
	}

	if(settings.modal_color === undefined)
	{
		settings.modal_color = settings_default_modal_color
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

	$("#setting_background_color").prop("checked", settings.background_color)

	$("#setting_custom_scrollbars").prop("checked", settings.custom_scrollbars)

	$('#setting_modal_color').find('option').each(function()
	{
		if($(this).val() === settings.modal_color)
		{
			$(this).prop('selected', true)
		}
	})
}

function start_settings_listeners()
{
	$("#setting_background_image").change(function()
	{
		settings.background_image = $("#setting_background_image").prop("checked")
		setup_opacity()
		change("image")
		save_settings()
	})

	$("#setting_background_color").change(function()
	{
		settings.background_color = $("#setting_background_color").prop("checked")

		if(settings.background_color)
		{
			change("image")
		}

		else
		{
			set_default_theme()
		}

		save_settings()
	})

	$("#setting_custom_scrollbars").change(function()
	{
		settings.custom_scrollbars = $("#setting_custom_scrollbars").prop("checked")
		setup_scrollbars()
		save_settings()
	})

	$("#setting_modal_color").change(function()
	{
		modal_color_changed()
	})
}

function setup_opacity()
{
	if(settings.background_image)
	{
		set_opacity(general_opacity)
	}

	else
	{
		set_opacity(1)
	}
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
			height: 360			
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
	youtube_video_player.mute()

	if(tv_type === "youtube")
	{
		change("tv")
	}
}

function start_twitch()
{
	twitch_video_player = new Twitch.Player("media_twitch_video_container", 
	{
		channel: "AChannelThatDoesntExisttttt",
		width: 640,
		height: 360
	})

	twitch_video_player.addEventListener(Twitch.Player.READY, () => 
	{
		$("#media_twitch_video_container").find("iframe").eq(0).attr("id", "media_twitch_video").addClass("video_frame")

		twitch_video_player.setVolume(0)

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
		info += "<div class='info_item'><div class='info_title'>Topic</div><div class='info_item_content' id='status_topic'>No topic set</div></div>"
	}

	info += "<div class='info_item'><div class='info_title'>Chat Permission</div>"
	info += `<div class='info_item_content'>${permission_tag(chat_permission)}</div></div>`
	info += "<div class='info_item'><div class='info_title'>Upload Permission</div>"
	info += `<div class='info_item_content'>${permission_tag(upload_permission)}</div></div>`
	info += "<div class='info_item'><div class='info_title'>Radio Permission</div>"
	info += `<div class='info_item_content'>${permission_tag(radio_permission)}</div></div>`
	info += "<div class='info_item'><div class='info_title'>TV Permission</div>"
	info += `<div class='info_item_content'>${permission_tag(tv_permission)}</div></div>`
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
		t.text(topic).urlize()
	}

	h.find("#status_radio_source").eq(0).text(radio_source).urlize()

	return h.html()
}

function permission_tag(n)
{
	if(n === 1)
	{
		return "Anyone"
	}

	else if(n === 2)
	{
		return "Voiced and up"
	}

	else if(n === 3)
	{
		return "Ops and up"
	}
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
	chat_announce('[', ']', `Password succesfully changed to ${data.password}`, 'small')
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
					update_chat(data.username, data.content, data.profile_image, nice_date(message.date))
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
		var s = `${data.username} disabled the log`
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

	msg_image.show(`<div id="modal_spinner" class='spinner1'></div><img ${t} id="modal_image" class="modal_image" src="${url}">`, function()
	{
		$('#modal_image').get(0).addEventListener('load', function()
		{
			$("#modal_spinner").css("display", "none")
			this.style.display = "block"
			update_modal_scrollbar("image")
		})

		$('#modal_image').eq(0).on("error", function() 
		{
			msg_image.set("<div class='padding1'>Image no longer available</div>")
		})
	})
}

function not_an_op()
{
	chat_announce('[', ']', "You are not a room operator", 'small')
}

function modal_color_up()
{
	$('#setting_modal_color option:selected').prev().prop('selected', 'selected')
	modal_color_changed()
}

function modal_color_down()
{
	$('#setting_modal_color option:selected').next().prop('selected', 'selected')
	modal_color_changed()
}

function modal_color_changed()
{
	settings.modal_color = $('#setting_modal_color option:selected').val()
	change_modal_color(settings.modal_color)		
	save_settings()	
}

function show_radio_url_picker()
{
	var s = ""

	s += "<i class='fa fa-volume-up'></i>"
	s += "<div class='spacer3'></div>"
	s += "Enter a YouTube search term or URL<br>Or audio file/stream URL"
	s += "<div class='spacer3'></div>"
	s += "<input id='radio_url_picker_input' class='input1'>"

	msg_info.show(s, function()
	{
		rup = true

		$("#radio_url_picker_input").focus()
	})
}

function show_tv_url_picker()
{
	var s = ""

	s += "<i class='fa fa-television'></i>"
	s += "<div class='spacer3'></div>"
	s += "Enter a YouTube search term or URL<br>Or video file/stream URL"
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
	$("#media_video")[0].volume = 0
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
	images_enabled = !images_enabled

	change_images_visibility()
}

function change_images_visibility()
{
	if(room_images_enabled && images_enabled)
	{
		$("#media").css("display", "flex")

		$("#media_image_container").css("display", "flex")

		$("#footer_toggle_images_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_images_icon").addClass("fa-toggle-on")

		$("#toggle_images_text").text("Images On")

		change("image")
	}

	else
	{
		$("#media_image_container").css("display", "none")

		set_default_theme()

		recreate_background_image()

		if(num_media_elements_visible() === 0)
		{
			hide_media()
		}

		$("#footer_toggle_images_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_images_icon").addClass("fa-toggle-off")

		$("#toggle_images_text").text("Images Off")
		
	}

	fix_media_margin()
	fix_visible_video_frame()
	update_chat_scrollbar()
	goto_bottom()
}

function toggle_tv()
{
	tv_enabled = !tv_enabled

	change_tv_visibility()
}

function change_tv_visibility()
{
	if(room_tv_enabled && tv_enabled)
	{
		$("#media").css("display", "flex")

		$("#media_tv").css("display", "flex")/

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-on")

		$("#toggle_tv_text").text("TV On")

		change("tv")
	}

	else
	{
		$("#media_tv").css("display", "none")

		if(num_media_elements_visible() === 0)
		{
			hide_media()
		}

		else
		{
			stop_videos()
		}

		$("#footer_toggle_tv_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_tv_icon").addClass("fa-toggle-off")

		$("#toggle_tv_text").text("TV Off")
		
		fix_media_margin()
	}

	update_chat_scrollbar()
	goto_bottom()	
}

function toggle_radio()
{
	radio_enabled = !radio_enabled

	change_radio_visibility()
}

function change_radio_visibility()
{
	if(room_radio_enabled && radio_enabled)
	{
		$("#radio").css("display", "initial")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-off")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-on")

		$("#toggle_radio_text").text("Radio On")

		$("#header_topic").css("display", "none")
	}

	else
	{
		stop_radio()
		
		$("#radio").css("display", "none")

		$("#footer_toggle_radio_icon").removeClass("fa-toggle-on")
		$("#footer_toggle_radio_icon").addClass("fa-toggle-off")

		$("#toggle_radio_text").text("Radio Off")

		$("#header_topic").css("display", "initial")
	}
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

						socket_emit("upload_profile_image",
						{
							image_file: blob
						})

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

	msg_profile.show(function()
	{
		$("#show_profile_uname").text(uname)
		$("#show_profile_image").attr("src", pi)
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

		if(user[0] === uname)
		{
			userlist[i][2] = pi
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
		if($(this).css("display") !== "none")
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

	var ratio = frame.data("ratio")

	if(ratio === undefined)
	{
		ratio = get_frame_ratio(frame_id)
	}

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

	if(!room_images_enabled)
	{
		change_images_visibility()
	}

	if(!room_tv_enabled)
	{
		change_tv_visibility()
	}

	if(!room_radio_enabled)
	{
		change_radio_visibility()
	}
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
	chat_announce('~', '~', `${data.username} changed the default theme to ${data.color}`, 'small')

	default_theme = data.color

	if(default_theme_on)
	{
		set_default_theme()
	}
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