var socket
var ls_room_nicknames = "room_nicknames_v2"
var ls_room_keys = "room_keys_v2"
var ls_user_keys = "user_keys_v2"
var ls_settings = "settings_v4"
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
var usercount
var userlist = []
var nicknames = []
var priv = ''
var upload_permission
var chat_permission
var radio_permission
var can_upload
var can_chat
var can_radio
var change_when_focused = false
var radio_type = ''
var radio_source = ''
var radio_title = ''
var radio_metadata = ''
var radio_setter = ''
var radio_date = ''
var claimed = false
var msgcount = 0
var get_metadata
var no_meta_count
var tabbed_list = []
var tabbed_word = ""
var tabbed_start = 0
var tabbed_end = 0
var crm = false
var crm2 = false
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
var template_open_room_buttons
var template_userlist
var template_roomlist
var template_played
var storageui_interval
var msg_menu
var msg_settings
var msg_userlist
var msg_roomlist
var msg_played
var msg_info
var msg_storageui
var msg_nickname_picker
var played_filtered = false
var userlist_filtered = false
var roomlist_filter_string = ""
var picking_nickname = true
var yt_player
var youtube_player
var fetched_room_id

function init()
{
	get_volume()
	activate_key_detection()
	get_nickname()
}

function init2()
{
	picking_nickname = false
	start_loading_image()
	compile_templates()
	get_settings()
	start_msg()
	start_settings_state()
	start_settings_listeners()
	start_storageui()
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
	start_socket()
}

function make_main_container_visible()
{
	$("#main_container").css("visibility", "initial")	
}

function start_loading_image()
{
	$("#background_image").css("background-image", `url('${loading_image_url}')`)
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

function get_room_nicknames()
{
	var obj = get_local_storage(ls_room_nicknames)

	if(obj === null)
	{
		obj = {}
	}

	return obj
}

function save_room_nicknames(room_nicknames)
{
	save_local_storage(ls_room_nicknames, room_nicknames)
}

function get_nickname()
{
	var room_nicknames = get_room_nicknames()

	var uname = room_nicknames[room_id]

	if(uname === undefined)
	{
		uname = room_nicknames['/default']
	}

	if(uname === undefined)
	{
		start_nickname_picker()
	}

	else
	{
		username = uname

		init2()
	}
}

function start_nickname_picker()
{
	msg_nickname_picker = Msg(
	{
		id: "nickname-picker",
		class: "black",
		show_effect: "fade",
		close_effect: "fade",
		show_effect_duration: [800, 800],
		close_effect_duration: [800, 800],
		window_x: "none",
		close_on_escape: false,
		close_on_overlay_click: false
	})

	var s = "<div id='pick_nickname_welcome'>Welcome</div><div id='pick_nickname_info'>Pick a nickname to begin</div><input type='text' id='pick_nickname_input'>"

	msg_nickname_picker.show(s, function()
	{
		$("#pick_nickname_input").focus()
	})	
}

function check_nickname()
{
	var uname = clean_string4($("#pick_nickname_input").val().substring(0, max_username_length))
	
	if(uname.length !== 0)
	{
		username = uname
		save_room_nickname(uname)
		save_default_nickname(uname)
		msg_nickname_picker.close()
		init2()
	}
}

function save_room_nickname(uname)
{
	var room_nicknames = get_room_nicknames()

	room_nicknames[room_id] = uname

	save_room_nicknames(room_nicknames)
}

function save_default_nickname(uname)
{
	var room_nicknames = get_room_nicknames()

	room_nicknames['/default'] = uname

	save_room_nicknames(room_nicknames)
}

function show_intro()
{
	chat_announce('', '', `Welcome to ${room_name}, ${username}`, 'big')
}

function show_reconnected()
{
	chat_announce('--', '--', 'Reconnected', 'small')

}
function compile_templates()
{
	template_menu = Handlebars.compile($('#template_menu').html())
	template_create_room = Handlebars.compile($('#template_create_room').html())
	template_open_room_buttons = Handlebars.compile($('#template_open_room_buttons').html())
	template_settings = Handlebars.compile($('#template_settings').html())
	template_userlist = Handlebars.compile($('#template_userlist').html())
	template_roomlist = Handlebars.compile($('#template_roomlist').html())
	template_played = Handlebars.compile($('#template_played').html())
}

function help()
{
	chat_announce('', '', 'Basic Features:', 'big')
	chat_announce('', '', 'Chat by typing anything.', 'small')
	chat_announce('', '', 'All elements in the top bar are clickable.', 'small')
	chat_announce('', '', 'Change the image on the right by pasting an image url.', 'small')
	chat_announce('', '', 'Change it by clicking on the current image.', 'small')
	chat_announce('', '', 'Change it by dropping an image file anywhere on the page.', 'small')
	chat_announce('', '', '/nick x: Used to change your nickname in the current room.', 'small')
	chat_announce('', '', '/radio x: Changes the radio source. This can be an internet radio url, a file url, a youtube url or a search term to find a video on youtube. If x is \'default\' it changes to the default radio.', 'small')
	chat_announce('', '', '/me x: Makes a message in third person.', 'small')
	chat_announce('', '', '/help: Shows this message.', 'small')
	chat_announce('', '', '/help2: Shows additional features.', 'small')
	chat_announce('', '', '/help3: Shows administration features.', 'small')
	chat_announce('', '', 'Note: Chat, upload, and radio features have permission settings per room. So you might not be able to do certain actions depending on what settings the ops/admins have set. To check what you can do use /priv.', 'small')
}

function help2()
{
	chat_announce('', '', 'Additional Features:', 'big')
	chat_announce('', '', 'Escape clears the input or closes popups.', 'small')
	chat_announce('', '', 'Shift + Escape or /clear clears all messages from the chat.', 'small')
	chat_announce('', '', 'Shift + Tab or /status shows information about you and the room.', 'small')
	chat_announce('', '', 'Up and Down Arrows cycle through the input history.', 'small')
	chat_announce('', '', 'Shift + Up Arrow and Shift + Down Arrow or Page Up and Page down make the chat scroll.', 'small')
	chat_announce('', '', 'Enter without text in the input scrolls to the bottom of the chat.', 'small')
	chat_announce('', '', 'Clicking on a nickname sends it to the input.', 'small')
	chat_announce('', '', 'Tab completes nicknames and commands.', 'small')
	chat_announce('', '', 'Shift + Enter toggles the radio.', 'small')
	chat_announce('', '', '/nickedit: Puts the nickname in the input, ready to be edited.', 'small')	
	chat_announce('', '', '/defnick x: Changes your default nickname for rooms you visit for the first time.', 'small')
	chat_announce('', '', '/reserve: Reserves current nickname to be recoverable later. If called again it changes the key with a new one.', 'small')
	chat_announce('', '', '/unreserve: Makes a nickname available again.', 'small')
	chat_announce('', '', '/recover x: Recovers reserved nickname in case someone else in the room is using it.', 'small')
	chat_announce('', '', '/priv: Shows information regarding privileges and permissions.', 'small')
	chat_announce('', '', '/users: Shows the user list. Accepts a filter as an argument.', 'small')
	chat_announce('', '', '/rooms: Shows the room list. Accepts a filter as an argument.', 'small')
	chat_announce('', '', '/played: Shows the list of songs played. Accepts a filter as an argument.', 'small')
	chat_announce('', '', '/history: Shows the input history. Accepts a filter as an argument.', 'small')
	chat_announce('', '', '/search: Opens the search window. Accepts a query as an argument.', 'small')
	chat_announce('', '', '/create x: A shortcut for creating a room.', 'small')
	chat_announce('', '', '/startradio: Starts the radio.', 'small')
	chat_announce('', '', '/stopradio: Stops the radio.', 'small')
	chat_announce('', '', '/volume x: Changes the volume of the radio.', 'small')
	chat_announce('', '', `Note: Dates shown when hovering some items show the time when the item was placed on the screen, except when a nickname is displayed beside it meaning it's that date an action was performed.`, 'small')
}

function help3()
{
	chat_announce('', '', 'Administration Features:', 'big')
	chat_announce('', '', '/claim: Requests administration of the room. If it hasn\'t been claimed, user gets the ownership.', 'small')
	chat_announce('', '', '/reclaim: Reclaims the room if you\'re already an admin. Removes all given privileges to other users.', 'small')
	chat_announce('', '', '/unclaim: Removes all ownership on the room and resets it to a default state.', 'small')
	chat_announce('', '', '/uploadpermission 1: Anyone can upload images.', 'small')
	chat_announce('', '', '/uploadpermission 2: Only voiced users and up can upload images.', 'small')
	chat_announce('', '', '/uploadpermission 3: Only ops and up can upload images.', 'small')
	chat_announce('', '', '/chatpermission 1: Anyone can chat.', 'small')
	chat_announce('', '', '/chatpermission 2: Only voiced users and up can chat.', 'small')
	chat_announce('', '', '/chatpermission 3: Only ops and up can chat.', 'small')
	chat_announce('', '', '/radiopermission 1: Anyone can change the radio.', 'small')
	chat_announce('', '', '/radiopermission 2: Only voiced users and up can change the radio.', 'small')
	chat_announce('', '', '/radiopermission 3: Only ops and up can change the radio.', 'small')
	chat_announce('', '', '/voice x: Gives voice to a user.', 'small')
	chat_announce('', '', '/op x: Gives op to a user. Ops can do anything an admin can do except more high level commands.', 'small')
	chat_announce('', '', '/admin x: Gives admin to a user. This gives a user the same rights as the original admin.', 'small')
	chat_announce('', '', '/strip x: Removes all privileges from a user.', 'small')
	chat_announce('', '', '/removevoices: Removes all privileges from voiced users.', 'small')
	chat_announce('', '', '/removeops: Removes all privileges from op\'d users.', 'small')
	chat_announce('', '', '/removeboth: Removes all privileges from voiced and op\'d users.', 'small')
	chat_announce('', '', '/private: Room doesn\'t appear in the public room list.', 'small')
	chat_announce('', '', '/public: Room appears in the public room list.', 'small')
	chat_announce('', '', '/topic x: Changes the topic of the room.', 'small')
	chat_announce('', '', '/topicadd x: Adds a section at the end of the topic.', 'small')
	chat_announce('', '', '/topictrim x: Removes a section from the end of the topic, where the optional x is the number of trims you want to do.', 'small')
	chat_announce('', '', '/topicaddstart x: Adds a section at the start of the topic.', 'small')
	chat_announce('', '', '/topictrimstart x: Removes a section from the start of the topic, where the optional x is the number of trims you want to do.', 'small')
	chat_announce('', '', '/topicedit: Puts the topic in the input, ready to be edited.', 'small')
	chat_announce('', '', '/roomname x: Chages the name of the room.', 'small')
	chat_announce('', '', '/roomnameedit x: Puts the room name in the input, ready to be edited.', 'small')
	chat_announce('', '', '/ban x: Bans a user from the room.', 'small')
	chat_announce('', '', '/unbanlast: Unbans the latest banned user.', 'small')
	chat_announce('', '', '/unbanall: Removes all bans.', 'small')
	chat_announce('', '', '/bannedcount: Displays the number of banned users in the room.', 'small')
	chat_announce('', '', '/kick x: Kicks a user out of the room.', 'small')
	chat_announce('', '', 'Note: Nicknames and main menu have a context menu with some operations.', 'small')
	chat_announce('', '', 'Note: Currently automatic fetching of song metadata from internet radios are only supported for icecast2 servers. The metadada url is gathered automatically. To work, the server needs to allow cross-domain requests and be https enabled if this system is being served through https.', 'small')
}

function show_status()
{
	show_room()
	show_nickname()
	show_topic()
	show_radio_source()
	show_priv()
	show_public()
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
	if(priv !== 'admin' && priv !== 'op')
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')		
	}

	arg = clean_string2(arg.substring(0, max_room_name_length))

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
		if(claimed)
		{
			chat_announce(brk1, brk2, `Topic: ${default_topic_claimed}`, size)
		}

		else
		{
			chat_announce(brk1, brk2, `Topic: ${default_topic}`, size)
		}
	}
}

function check_priv(data)
{
	priv = data.priv
	upload_permission = data.upload_permission
	chat_permission = data.chat_permission
	radio_permission = data.radio_permission
	check_permissions()
}

function check_permissions()
{
	can_upload = check_upload_permission(priv)
	can_chat = check_chat_permission(priv)
	can_radio = check_radio_permission(priv)
}

function check_upload_permission(priv)
{
	if(upload_permission === 1)
	{
		return true
	}

	else if(upload_permission === 2)
	{
		if(priv === "admin" || priv === "op" || priv === "voice")
		{
			return true
		}
	}

	else if(upload_permission === 3)
	{
		if(priv === "admin" || priv === "op")
		{
			return true
		}	
	}

	else
	{
		return false
	}	
}

function check_chat_permission(priv)
{
	if(chat_permission === 1)
	{
		return true
	}

	else if(chat_permission === 2)
	{
		if(priv === "admin" || priv === "op" || priv === "voice")
		{
			return true
		}
	}

	else if(chat_permission === 3)
	{
		if(priv === "admin" || priv === "op")
		{
			return true
		}	
	}

	else
	{
		return false
	}	
}

function check_radio_permission(priv)
{
	if(radio_permission === 1)
	{
		return true
	}

	else if(radio_permission === 2)
	{
		if(priv === "admin" || priv === "op" || priv === "voice")
		{
			return true
		}
	}

	else if(radio_permission === 3)
	{
		if(priv === "admin" || priv === "op")
		{
			return true
		}	
	}

	else
	{
		return false
	}	
}

function show_priv(data)
{
	if(priv === 'admin')
	{
		chat_announce('[', ']', 'You are an admin in this room', 'small')
	}

	else if(priv === 'op')
	{
		chat_announce('[', ']', 'You are an op in this room', 'small')
	}

	else if(priv === 'voice')
	{
		chat_announce('[', ']', 'You have voice in this room', 'small')
	}

	if(priv === 'admin' || priv === 'op')
	{
		show_chat_permission()
		show_upload_permission()
		show_radio_permission()
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

		if(ps === 0)
		{
			chat_announce('[', ']', "You cannot interact", 'small')
		}
	}
}

function show_nickname()
{
	chat_announce('[', ']', `Nickname: ${username}`, 'small')
}

function socket_emit(dest, obj)
{
	socket.emit(dest, obj)	
}

function start_socket()
{
	socket = io('/')

	socket.on('connect', function() 
	{
		socket_emit('join_room', {room_id:room_id, username:username, key:get_room_key()})
	})

	socket.on('update', function(data) 
	{
		if(data.type === 'chat_msg')
		{
			update_chat(data.username, data.msg)
		}

		if(data.type === 'username')
		{
			started = false
			connections += 1
			room_name = data.room_name
			username = data.username
			set_image_info(data)
			claimed = data.claimed
			setup_radio(data)
			userlist = data.userlist
			update_userlist()
			set_topic_info(data)
			update_title()
			is_public = data.public
			
			if(data.key)
			{
				save_room_key(data.key)
			}

			check_priv(data)
			change()

			if(connections === 1)
			{
				setup_opacity()
				clear_chat()
				check_firstime()
				start_nickname_context_menu()
				start_main_menu_context_menu()
				start_played_context_menu()
				start_volume_context_menu()
				start_metadata_loop()
				make_main_container_visible()				
				start_heartbeat()
			}

			else
			{
				show_reconnected()
			}
			
			started = true
		}

		if(data.type === 'new_username')
		{
			new_username(data)
		}

		else if(data.type === 'chat_announcement')
		{
			chat_announce('', '', data.msg, 'small')
		}

		else if(data.type === 'connection_lost')
		{
			refresh()
		}

		else if(data.type === 'image_change')
		{
			set_image_info(data)
			announce_uploaded_image(data)
			change()
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

		else if(data.type === 'get_key')
		{
			change_priv(data.key)
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

		else if(data.type === 'announce_unbanall')
		{
			announce_unbanall(data)
		}

		else if(data.type === 'announce_unbanlast')
		{
			announce_unbanlast(data)
		}

		else if(data.type === 'get_bannedcount')
		{
			get_bannedcount(data)
		}

		else if(data.type === 'nothingtounban')
		{
			chat_announce('[', ']', "There was nothing to unban", 'small')
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

		else if(data.type === 'made_private')
		{
			made_private(data)
		}

		else if(data.type === 'made_public')
		{
			made_public(data)
		}

		else if(data.type === 'changed_radio_source')
		{
			changed_radio_source(data)
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
			chat_announce('[', ']', "You don't seem to own that nickname", 'small')
		}

		else if(data.type === 'songnotfound')
		{
			chat_announce('[', ']', "The song couldn't be found", 'small')
		}

		else if(data.type === 'roomcreated')
		{
			save_room_key(data.key, data.id)
			show_open_room_buttons(data.id)
		}

		else if(data.type === 'redirect')
		{
			goto_url(data.location, "same", false)
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

	if($('#toggle_radio_text').html() === 'Stop Radio')
	{
		start_radio()
	}		
}

function get_youtube_id(url)
{
	url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)

	var id = undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]

	return id.length === 11 ? id : false
}

function get_youtube_time(url)
{
	var match = url.match(/[\?|&]t=(\d+)/)

	return match === null ? 0 : match[1]
}

function userjoin(data)
{
	addto_userlist(data.username, data.priv)

	if(check_chat_permission(data.priv))
	{
		chat_announce('--', '--', `${data.username} has joined`, 'small')
	}	
}

function update_usercount(usercount)
{
	$('#usercount').html(`${singular_or_plural(usercount, "Users")} Online`)
}

function addto_userlist(uname, prv)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][0] === uname)
		{
			userlist[i][0] = uname
			userlist[i][1] = prv
			update_userlist()
			return
		}
	}

	userlist.push([uname, prv])
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

function replace_nick_in_userlist(oldu, newu)
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

function replace_priv_in_userlist(uname, prv)
{
	for(var i=0; i<userlist.length; i++)
	{
		if(userlist[i][0] === uname)
		{
			userlist[i][1] = prv
			break
		}
	}

	update_userlist()
}

function get_priv(uname)
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

function remove_privs_userlist()
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

function priv_tag(p)
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

function update_userlist()
{	
	var s = $()

	s = s.add()

	userlist.sort(compare_userlist)

	nicknames = []

	for(var i=0; i<userlist.length; i++)
	{
		var item = userlist[i]

		nicknames.push(item[0])

		var h = $("<div class='userlist_item'><span class='ui_item_priv'></span><span class='ui_item_nick'></span></div>")

		var p = priv_tag(item[1])

		var pel = h.find('.ui_item_priv').eq(0)

		pel.text(p)

		if(p === "")
		{
			pel.css("padding-right", 0)
		}

		h.find('.ui_item_nick').eq(0).text(item[0])

		h.click({nickname:item[0]}, function(event)
		{
			add_to_input(event.data.nickname) 
			close_all_modals()
		})

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

function start_nickname_context_menu()
{
	$.contextMenu(
	{
		selector: ".ui_item_nick, .chat_uname",
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
					if(priv !== 'admin' && priv !== 'op')
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
					if(priv !== 'admin')
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
					if(priv !== 'admin' && priv !== 'op')
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
					if(priv !== 'admin' && priv !== 'op')
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
					if(priv !== 'admin' && priv !== 'op')
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
					if(priv !== 'admin')
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

function start_main_menu_context_menu()
{
	$.contextMenu(
	{
		selector: "#main_menu",
		animation: {duration: 250, hide: 'fadeOut'},
		zIndex: 9000000000,		
		items: 
		{
			ctpmodes: 
			{
				name: "Chat Permission", 
				visible: function(key, opt)
				{ 
					if(priv !== 'admin' && priv !== 'op')
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
					ctpmode1: 
					{
						name: "1. Anyone",
						visible: function(key, opt)
						{ 
							if(chat_permission === 1)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_chat_permission(1)
						}
					},
					ctpmode1b: 
					{
						name: "1. Anyone *",
						visible: function(key, opt)
						{ 
							if(chat_permission !== 1)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_chat_permission(1)
						}
					},
					ctpmode2: 
					{
						name: "2. Voiced Users And Up",
						visible: function(key, opt)
						{ 
							if(chat_permission === 2)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_chat_permission(2)
						}
					},
					ctpmode2b: 
					{
						name: "2. Voiced Users And Up *",
						visible: function(key, opt)
						{ 
							if(chat_permission !== 2)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_chat_permission(2)
						} 
					},
					ctpmode3: 
					{
						name: "3. Ops And Up",
						visible: function(key, opt)
						{ 
							if(chat_permission === 3)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_chat_permission(3)
						}						
					},
					ctpmode3b: 
					{
						name: "3. Ops And Up *",
						visible: function(key, opt)
						{ 
							if(chat_permission !== 3)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_chat_permission(3)
						}						
					}
				}
			},
			uppmodes: 
			{
				name: "Upload Permission", 
				visible: function(key, opt)
				{ 
					if(priv !== 'admin' && priv !== 'op')
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
					uppmode1: 
					{
						name: "1. Anyone",
						visible: function(key, opt)
						{ 
							if(upload_permission === 1)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_upload_permission(1)
						}
					},
					uppmode1b: 
					{
						name: "1. Anyone *",
						visible: function(key, opt)
						{ 
							if(upload_permission !== 1)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_upload_permission(1)
						}
					},
					uppmode2: 
					{
						name: "2. Voiced Users And Up",
						visible: function(key, opt)
						{ 
							if(upload_permission === 2)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_upload_permission(2)
						}
					},
					uppmode2b: 
					{
						name: "2. Voiced Users And Up *",
						visible: function(key, opt)
						{ 
							if(upload_permission !== 2)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_upload_permission(2)
						} 
					},
					uppmode3: 
					{
						name: "3. Ops And Up",
						visible: function(key, opt)
						{ 
							if(upload_permission === 3)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_upload_permission(3)
						}						
					},
					uppmode3b: 
					{
						name: "3. Ops And Up *",
						visible: function(key, opt)
						{ 
							if(upload_permission !== 3)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_upload_permission(3)
						}						
					}
				}
			},
			radpmodes: 
			{
				name: "Radio Permission", 
				visible: function(key, opt)
				{ 
					if(priv !== 'admin' && priv !== 'op')
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
					radpmode1: 
					{
						name: "1. Anyone",
						visible: function(key, opt)
						{ 
							if(radio_permission === 1)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_radio_permission(1)
						}
					},
					radpmode1b: 
					{
						name: "1. Anyone *",
						visible: function(key, opt)
						{ 
							if(radio_permission !== 1)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_radio_permission(1)
						}
					},
					radpmode2: 
					{
						name: "2. Voiced Users And Up",
						visible: function(key, opt)
						{ 
							if(radio_permission === 2)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_radio_permission(2)
						}
					},
					radpmode2b: 
					{
						name: "2. Voiced Users And Up *",
						visible: function(key, opt)
						{ 
							if(radio_permission !== 2)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_radio_permission(2)
						} 
					},
					radpmode3: 
					{
						name: "3. Ops And Up",
						visible: function(key, opt)
						{ 
							if(radio_permission === 3)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_radio_permission(3)
						}						
					},
					radpmode3b: 
					{
						name: "3. Ops And Up *",
						visible: function(key, opt)
						{ 
							if(radio_permission !== 3)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							change_radio_permission(3)
						}						
					}
				}
			},			
			cmprivacy: 
			{
				name: "Privacy", 
				visible: function(key, opt)
				{ 
					if(priv !== 'admin' && priv !== 'op')
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
					cpub: 
					{
						name: "Public",
						visible: function(key, opt)
						{ 
							if(is_public)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							make_public()
						}						
					},
					cpubb: 
					{
						name: "Public *",
						visible: function(key, opt)
						{ 
							if(!is_public)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							make_public()
						}							
					},
					cpriv: 
					{
						name: "Private",
						visible: function(key, opt)
						{ 
							if(!is_public)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							make_private()
						}							
					},
					cprivb: 
					{
						name: "Private *",
						visible: function(key, opt)
						{ 
							if(is_public)
							{
								return false
							}

							else
							{
								return true
							}
						},
						callback: function(key, opt)
						{
							make_private()
						}							
					}
				}
			},
			cmprivs: 
			{
				name: "Privs",
				visible: function(key, opt)
				{ 
					if(priv !== 'admin' && priv !== 'op')
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
					cp1: 
					{
						name: "Remove All Voices",
						items: 
						{
							rmvoicessure: 
							{
								name: "I'm Sure", callback: function(key, opt)
								{
									remove_voices()
								}					
							}
						}											
					},
					cp2: 
					{
						name: "Remove All Ops",
						visible: function(key, opt)
						{ 
							if(priv !== 'admin')
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
							rmopssure: 
							{
								name: "I'm Sure", callback: function(key, opt)
								{
									remove_ops()
								}					
							}
						}												
					},
					cp3: 
					{
						name: "Remove Both",
						visible: function(key, opt)
						{ 
							if(priv !== 'admin')
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
							rmopssure: 
							{
								name: "I'm Sure", callback: function(key, opt)
								{
									remove_both()
								}					
							}
						}												
					}
				}
			},
			cmbans: 
			{
				name: "Bans",
				visible: function(key, opt)
				{ 
					if(priv !== 'admin' && priv !== 'op')
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
					cb1: 
					{
						name: "Banned Count",
						callback: function(key, opt)
						{
							bannedcount()
						}						
					},
					cb2: 
					{
						name: "Unban Last",
						items: 
						{
							unbanlastsure: 
							{
								name: "I'm Sure", callback: function(key, opt)
								{
									unbanlast()
								}					
							}
						}											
					},
					cb3: 
					{
						name: "Unban All",
						items: 
						{
							unbanallsure: 
							{
								name: "I'm Sure", callback: function(key, opt)
								{
									unbanall()
								}					
							}
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

	socket_emit("roomlist", {})
}

function update_roomlist(roomlist)
{	
	$("#roomlist_filter").val(roomlist_filter_string)

	var s = $()

	s = s.add()

	for(var i=0; i<roomlist.length; i++)
	{
		var c = "<div class='roomlist_name'></div><div class='roomlist_topic'></div><div class='roomlist_here'></div><div class='roomlist_count'></div>"
		var h = $(`<div class='roomlist_item'>${c}</div>`)

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

		h.click({room_id:roomlist[i][0]}, function(event)
		{
			show_open_room_buttons(event.data.room_id)
		})

		s = s.add(h)
	}

	$('#roomlist').html(s)

	if(roomlist_filter_string !== "")
	{
		do_roomlist_filter()
	}

	update_modal_scrollbar("roomlist")
}

function show_menu()
{
	msg_menu.show()
}

function show_create_room()
{
	msg_info.show(template_create_room(), function()
	{
		$("#create_room_input").val('').focus()
		crm = true
	})
}

function show_open_room_buttons(id)
{
	msg_info.show(template_open_room_buttons({id:id}), function()
	{
		crm2 = true
	})
}

function show_settings()
{
	msg_settings.show()
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
		maxFilesize: max_image_size / 1000,
		autoProcessQueue: false,
		clickable: '#media_image',
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
		if(picking_nickname)
		{
			$('#pick_nickname_input').focus()

			if(e.key === "Enter")
			{
				check_nickname()
				e.preventDefault()
			}

			return
		}

		if(crm)
		{
			$('#create_room_input').focus()

			if(e.key === "Enter")
			{
				if(e.shiftKey)
				{
					toggle_radio()
					e.preventDefault()
					return
				}

				var arg = $('#create_room_input').val().trim()

				if(arg.length > 0)
				{
					create_room(arg)
					e.preventDefault()
				}

				return
			}			

			return
		}

		if(crm2)
		{
			if(e.key === "Enter")
			{
				$("#open_room_new_tab").trigger("click")
			}

			e.preventDefault()
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
				toggle_radio()
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
			if(!msg_menu.any_open())
			{
				if(e.shiftKey)
				{
					clear_chat()
				}

				else
				{
					clear_input()
				}

				e.preventDefault()
				return
			}
		}

		else if(e.key === "Tab")
		{
			if(e.shiftKey)
			{
				show_status()
				e.preventDefault()
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

	if(input_history.length >= history_crop_limit)
	{
		input_history.shift()
	}

	input_history.push([msg, nice_date()])	
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

		var s2 = $("<div></div>")

		for(var item of input_history.slice().reverse())
		{
			var h = $(`<div title='${item[1]}' class='show_history_item'></div>`)

			h.text(item[0]).urlize()

			h.click({text:item[0]}, function(event)
			{
				if($(this).find('a').length === 0)
				{
					change_input(event.data.text)
					close_all_modals()
				}
			})

			s2.append(h)
		}

		s = s.add(s2)
		c.append(s)
		c = c[0]

		show_info(c, function()
		{
			$("#history_filter").on("input", function()
			{
				history_filter_timer()
			})

			if(filter)
			{
				do_history_filter()
			}
		})
	}

	else
	{
		show_info("Messages or commands you type will appear here")
	}
}

function input_click_events()
{
	$('#input').click(function()
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

	for(var i=0; i<nicknames.length; i++)
	{
		var pw = nicknames[i].toLowerCase()

		if(pw.startsWith(word))
		{
			has = true

			if(tabbed_list.indexOf(pw) === -1)
			{
				tabbed_list.push(pw)
				return nicknames[i]
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
		scrollingThreshold: 2000
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

function update_chat(uname, msg)
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

	var date = nice_date()

	if(msg.startsWith('/me ') || msg.startsWith('/em '))
	{
		var fmsg = $(`<div title='${date}' class='msg chat_message'>* <span class='chat_uname'></span> <span class='${contclasses}'></span> *</div><div class='sep1'>&nbsp</div>`)
		$(fmsg).find('.chat_content').eq(0).text(msg.substr(4)).urlize()
	}

	else
	{
		var fmsg = $(`<div title='${date}' class='msg chat_message'><b><span class='chat_uname'></span>:</b>&nbsp<span class='${contclasses}'></span></div><div class='sep1'>&nbsp</div>`)
		$(fmsg).find('.chat_content').eq(0).text(msg).urlize()
	}
	
	$(fmsg).find('.chat_uname').eq(0).text(uname).click({uname:uname}, function(event)
	{
		add_to_input(event.data.uname)
	})

	add_to_chat(fmsg)

	add_msgcount()

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
			chat_area.append("<div class='dash_container'><hr class='dash'><div class='sep1'>&nbsp</div></div>")
		}
	}

	chat_area.append(msg)

	update_chat_scrollbar()
}

function add_msgcount()
{
	msgcount += 1

	if(msgcount > chat_crop_limit)
	{	
		var els = $('#chat_area').children()	
		els.slice(0, 2).remove()
		update_chat_scrollbar()
	}
}

function self_check_images(msg)
{
	words = msg.split(' ')

	for(var i=0; i<words.length; i++)
	{
		var url = words[i].replace(/\.gifv/g,'.gif')

		var word = words[i].toLowerCase()

		if(word.indexOf('.jpg') !== -1 || word.indexOf('.png') !== -1 || word.indexOf('.jpeg') !== -1 || word.indexOf('.gif') !== -1)
		{
			$('#test_image').attr('src', url.split('?')[0])
			return
		}
	}
}

function start_image_events()
{
	$('#media_image')[0].addEventListener('load', function() 
	{
		try 
		{
			var colors = colorlib.get_dominant(this, 1)

			if(colors === null)
			{
				image_url = default_image_url
				change()
				return
			}

			var color1 = colors[0]

			var background_color = color1
			var font_color = colorlib.get_proper_font(color1)

			var color2 = colorlib.get_lighter_or_darker(color1, color_contrast_amount)
			
			var background_color2 = color2
			var font_color2 = colorlib.get_proper_font(color2)

			if(settings.header_contrast)
			{
				var header_bg_color = background_color2
				var header_font_color = font_color2
			}

			else
			{
				var header_bg_color = background_color
				var header_font_color = font_color
			}

			if(settings.input_contrast)
			{
				var input_bg_color = background_color2
				var input_font_color = font_color2
			}

			else
			{
				var input_bg_color = background_color
				var input_font_color = font_color
			}

			$('body').css('background-color', background_color)
			$('#header').css('background-color', header_bg_color)
			$('#header').css('color', header_font_color)
			$('#chat_area').css('background-color', background_color)
			$('#chat_area').css('color', font_color)
			$('#input_container').css('background-color', background_color)
			$('#input').css('background-color', input_bg_color)
			$('#input').css('color', input_font_color)
			$('#media').css('background-color', background_color)

			if(settings.background_image)
			{
				$('#background_image').css('background-image', `url('${image_url}')`) 

				if($('#background_image').css('background-repeat') === 'repeat')
				{
					$('#background_image').css('background-size', 'cover')          
					$('#background_image').css('background-repeat', 'no-repeat')
					$('#background_image').css('background-position', 'center center')  
				}
			}
		}

		catch(err)
		{
			console.error(err)
		}

		if(image_url !== default_image_url)
		{
			var title = `Uploader: ${image_uploader} | Size: ${get_size_string(image_size)} | ${image_date}`

			$(this).prop('title', title)
		}
	})

	$("#media_image").error(function() 
	{
		if(image_url !== default_image_url)
		{
			image_url = default_image_url
			change()
		}
	})

	$('#test_image')[0].addEventListener('load', function() 
	{
		emit_pasted($('#test_image').attr('src'))
	})
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
	$("#input_container").css("opacity", o)
	$("#input").css("opacity", o)
}

function set_image_info(data)
{
	if(data.image_url === '' || data.image_url === undefined)
	{
		image_url = default_image_url
	}

	else
	{
		image_url = data.image_url
	}

	image_uploader = data.image_uploader
	image_size = data.image_size
	image_date = nice_date(data.image_date)
}

function change()
{
	if(started)
	{
		alert_title()
	}

	if(afk)
	{
		change_when_focused = true
		return false
	}
	
	$('#media_image').attr('src', image_url)
}

function chat_announce(brk1, brk2, msg, size, dotted=false, title=false)
{
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
		brk1 = `${brk1}&nbsp;`
	}

	if(brk2 !== "")
	{
		brk2 = `&nbsp;${brk2}`
	}
	
	if(typeof dotted === "string")
	{
		var fmsg = $(`<div title='${t}' class='msg announcement announcement_${size}'>${brk1}<span class='${contclasses}'></span><span class='dotted'></span>${brk2}</div><div class='sep1'>&nbsp</div>`)
		$(fmsg).find('.dotted').eq(0).text(dotted).urlize()
	}

	else
	{
		var fmsg = $(`<div title='${t}' class='msg announcement announcement_${size}'>${brk1}<span class='${contclasses}'></span>${brk2}</div><div class='sep1'>&nbsp</div>`)
	}

	$(fmsg).find('.announcement_content').eq(0).text(msg).urlize()

	add_to_chat(fmsg)

	add_msgcount()

	goto_bottom()
}

function clean_string(s)
{
	return s.replace(/</g, '').replace(/\s+/g, ' ').trim()
}

function clean_string2(s)
{
	return s.replace(/\s+/g, ' ').trim()
}

function clean_string3(s)
{
	return s.replace(/[\\"']/g, '')
}

function clean_string4(s)
{
	return s.replace(/[^a-z0-9\-\_\s\@\!\?\&\#\%\<\>\^\$\(\)\[\]\*\"\'\,\.\:\;\|\{\}\=\+\~]+/gi, "").replace(/\s+/g, " ").trim()
}

jQuery.fn.urlize = function() 
{
	if(this.length > 0) 
	{
		this.each(function(n, obj)
		{
			var x = $(obj).html()

			var list = x.match(/\b(https?:\/\/|www\.|https?:\/\/www\.)[^ <]{2,1200}\b/g)

			if(list) 
			{
				for(var i=0; i<list.length; i++) 
				{
					var prot = list[i].indexOf('http://') === 0 || list[i].indexOf('https://') === 0 ? '' : 'http://'
					x = x.replace(list[i], `<a class='chat' target='_blank' href='${prot}${list[i]}'>${list[i]}</a>`)
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
	commands.push('/nick')
	commands.push('/defnick')
	commands.push('/nickedit')
	commands.push('/clear')
	commands.push('/claim')
	commands.push('/reclaim')
	commands.push('/unclaim')
	commands.push('/uploadpermission')
	commands.push('/chatpermission')
	commands.push('/radiopermission')
	commands.push('/users')
	commands.push('/room')
	commands.push('/rooms')
	commands.push('/roomname')
	commands.push('/roomnameedit')
	commands.push('/played')
	commands.push('/search')
	commands.push('/priv')
	commands.push('/voice')
	commands.push('/op')
	commands.push('/admin')
	commands.push('/strip')
	commands.push('/removevoices')
	commands.push('/removeops')
	commands.push('/removeboth')
	commands.push('/ban')
	commands.push('/unbanall')
	commands.push('/unbanlast')
	commands.push('/bannedcount')
	commands.push('/kick')
	commands.push('/private')
	commands.push('/public')
	commands.push('/radio')
	commands.push('/privacy')
	commands.push('/reserve')
	commands.push('/unreserve')
	commands.push('/recover')
	commands.push('/status')
	commands.push('/topic')
	commands.push('/topicadd')
	commands.push('/topictrim')
	commands.push('/topicaddstart')
	commands.push('/topictrimstart')
	commands.push('/topicedit')
	commands.push('/create')
	commands.push('/help3')
	commands.push('/help2')
	commands.push('/help')
	commands.push('/stopradio')
	commands.push('/startradio')
	commands.push('/volume')
	commands.push('/history')

	commands.sort()
}

function send_to_chat(msg)
{
	msg = clean_string2(msg.substring(0, max_input_length))

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

			if(oiStartsWith(lmsg, '/nick'))
			{
				change_nickname(arg)
			}

			else if(oiEquals(lmsg, '/nick'))
			{
				show_nickname()
			}

			else if(oiEquals(lmsg, '/nickedit'))
			{
				nickedit()
				return
			}

			else if(oiStartsWith(lmsg, '/defnick'))
			{
				change_default_nickname(arg)
			}

			else if(oiEquals(lmsg, '/defnick'))
			{
				show_default_nickname()
			}

			else if(oiEquals(lmsg, '/clear'))
			{
				clear_chat()
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

			else if(oiEquals(lmsg, '/priv'))
			{
				show_priv()
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

			else if(oiEquals(lmsg, '/removeboth'))
			{
				remove_both()
			}

			else if(oiStartsWith(lmsg, '/ban'))
			{
				ban(arg)
			}

			else if(oiEquals(lmsg, '/unbanall'))
			{
				unbanall()
			}

			else if(oiEquals(lmsg, '/unbanlast'))
			{
				unbanlast()
			}

			else if(oiEquals(lmsg, '/bannedcount'))
			{
				bannedcount()
			}

			else if(oiStartsWith(lmsg, '/kick'))
			{
				kick(arg)
			}

			else if(oiEquals(lmsg, '/private'))
			{
				make_private()
			}

			else if(oiEquals(lmsg, '/public'))
			{
				make_public()
			}

			else if(oiStartsWith(lmsg, '/radio'))
			{
				change_radio_source(arg)
			}

			else if(oiEquals(lmsg, '/radio'))
			{
				show_radio_source()
			}

			else if(oiEquals(lmsg, '/public'))
			{
				make_public()
			}

			else if(oiEquals(lmsg, '/privacy'))
			{
				show_public()
			}

			else if(oiStartsWith(lmsg, '/reserve'))
			{
				reserve(arg)
			}

			else if(oiEquals(lmsg, '/reserve'))
			{
				reserve()
			}

			else if(oiEquals(lmsg, '/unreserve'))
			{
				unreserve()
			}

			else if(oiStartsWith(lmsg, '/recover'))
			{	
				recover(arg)
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

			else if(oiStartsWith(lmsg, '/create'))
			{
				create_room(arg)
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

			if(can_upload)
			{
				self_check_images(msg)
			}

			if(can_chat)
			{
				update_chat(username, msg)	
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
	if(priv === 'admin' || priv === 'op')
	{
		dtopic = clean_string2(dtopic.substring(0, max_topic_length))

		if(dtopic.length > 0)
		{
			if(topic !== dtopic)
			{
				socket_emit('topic_change', {topic:dtopic})
			}

			else
			{
				chat_announce('[', ']', "Topic is already set to that", 'small')
			}
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function topicadd(arg)
{
	if(priv === 'admin' || priv === 'op')
	{
		arg = clean_string2(arg)

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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function topictrim(n)
{
	if(priv === 'admin' || priv === 'op')
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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function topicstart(arg)
{
	if(priv === 'admin' || priv === 'op')
	{
		arg = clean_string2(arg)

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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function topictrimstart(n)
{
	if(priv === 'admin' || priv === 'op')
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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
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
			
		if(data.topic_setter === username)
		{
			chat_announce('~', '~', `You changed the topic to: ${data.topic}`, 'small', highlight)
		}

		else
		{
			chat_announce('~', '~', `${data.topic_setter} changed the topic to: ${data.topic}`, 'small', highlight)
		}

		set_topic_info(data)

		update_title()
	}
}

function announce_room_name_change(data)
{
	if(data.name !== room_name)
	{		
		if(data.username === username)
		{
			chat_announce('~', '~', `You changed the room name to: ${data.name}`, 'small')
		}

		else
		{
			chat_announce('~', '~', `${username} changed the room name to: ${data.name}`, 'small')
		}

		room_name = data.name

		update_title()
	}
}

function change_nickname(nck)
{
	if(can_chat)
	{
		nck = clean_string4(nck.substring(0, max_username_length))
		
		if(nck.length > 0)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "That's already your nickname", 'small')
				return false
			}

			save_room_nickname(nck)

			socket_emit('username_change', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You don't have permission to do that", 'small')
	}
}

function nickedit()
{
	change_input(`/nick ${username}`)
}

function change_default_nickname(nck)
{
	nck = clean_string4(nck.substring(0, max_username_length))
	
	if(nck.length > 0)
	{
		save_default_nickname(nck)
		chat_announce('[', ']', `Default nickname changed to ${nck}`, 'small')
	}
}

function show_default_nickname()
{
	var room_nicknames = get_room_nicknames()

	chat_announce('[', ']', `Default Nickname: ${room_nicknames['/default']}`, 'small')
}

function new_username(data)
{
	if(username === data.old_username)
	{
		username = data.username
		chat_announce('~', '~', `You are now known as ${username}`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.old_username} is now known as ${data.username}`, 'small')
	}

	replace_nick_in_userlist(data.old_username, data.username)
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
	if(!get_metadata || radio_type !== "radio")
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
			if(!get_metadata || radio_type !== "radio")
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
		var p = s.pop()

		$('#now_playing').text(p)
		$('#now_playing_controls').data('q', p)

		show_nowplaying()
	}

	else
	{
		hide_nowplaying()
	}
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
		var date = nice_date()
		
		var pi = "<div class='pititle'></div><div class='piartist'></div>"
		
		h = $(`<div title='${date}' class='played_item'>${pi}</div>`)

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

		h.click(function()
		{
			if($(this).data('q2') !== '')
			{
				goto_url(q2, "tab")
			}

			else
			{
				search_on('google', $(this).data('q'))
			}
		})
		
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
		
	show_nowplaying()					
}

function hide_nowplaying()
{
	$('#now_playing_area').css('display', 'none')
}

function show_nowplaying()
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
	}

	$('#playing_icon').css('display', 'inline-block')
	$('#volume_area').css('display', 'inline-block')
	$('#toggle_radio_text').html('Stop Radio')
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
	$('#toggle_radio_text').html('Start Radio')
}

function toggle_radio()
{
	if($('#toggle_radio_text').html() === 'Stop Radio')
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
		if(radio_type === "radio")
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

	$('#pup')[0].volume = nv

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
				change_when_focused = false
				change()
			}
		}

		else
		{
			afk_timer = setTimeout(function(){afk = true}, afk_timeout_duration)
			$('.dash_container').remove()
			update_chat_scrollbar()
		}
	}, false)
}

function random_room()
{
	create_room(word_generator('cvcvcv'))
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

function goto_url(u, mode="same", encode=true)
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

function create_room(name, sametab=false)
{
	close_all_modals()

	name = clean_string2(name.substring(0, max_room_name_length))

	socket_emit('create_room', {name:name})
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

	show_info(c, function()
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

	if($(".chat_message").length > 0)
	{
		$(".chat_message").each(function()
		{
			var huname = $(this).find('.chat_uname').eq(0)
			var hcontent = $(this).find('.chat_content').eq(0)

			var uname = huname.text()
			var content = hcontent.text()

			var show = false

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

				cn.find(".search_result_uname").eq(0).append(huname.clone())
				cn.find(".search_result_content").eq(0).append(hcontent.clone())

				cn.prop("title", $(this).prop("title")).click(function()
				{
					if($(this).find('a').length === 0)
					{
						var ss = ""

						ss += $(this).find(".chat_uname").eq(0).text()
						ss += " said: "
						ss += `"${$(this).find(".chat_content").eq(0).text()}"`

						change_input(ss)
						close_all_modals()
					}
				})

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
	$('#chat_area').html('<div class="clear"><br><br><br><br></div>')

	msgcount = 0

	show_intro()
	show_topic("big")
	show_priv()
	show_public()
	goto_bottom(true)
	focus_input()
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

	if(priv !== 'admin')
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

	if(priv !== 'admin')
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
		return false
	}

	socket_emit('unclaim_room', {})
}

function get_room_keys()
{
	var obj = get_local_storage(ls_room_keys)

	if(obj === null)
	{
		obj = {}
	}

	return obj	
}

function save_room_keys(room_keys)
{
	save_local_storage(ls_room_keys, room_keys)
}

function get_room_key()
{
	var key = get_room_keys()[room_id]

	if(key === undefined)
	{
		key = ""
	}

	return key
}

function save_room_key(key, id=false)
{
	var room_keys = get_room_keys()

	if(id)
	{
		room_keys[id] = key
	}

	else
	{
		room_keys[room_id] = key
	}

	save_room_keys(room_keys)
}

function get_user_keys()
{
	var obj = get_local_storage(ls_user_keys)

	if(obj === null)
	{
		obj = {}
	}

	return obj	
}

function save_user_keys(user_keys)
{
	save_local_storage(ls_user_keys, user_keys)
}

function get_user_key(nck)
{
	var key = get_user_keys()[nck]

	if(key === undefined)
	{
		key = ""
	}

	return key
}

function save_user_key(key)
{
	var user_keys = get_user_keys()

	user_keys[username] = key

	save_user_keys(user_keys)
}

function remove_user_key()
{
	var user_keys = get_user_keys()

	delete user_keys[username]

	save_user_keys(user_keys)
}

function check_firstime()
{
	if(get_local_storage('firstime') === null)
	{
		help()
		save_local_storage('firstime', false)
	}
}

function change_priv(key)
{
	save_room_key(key)

	if(key.startsWith('_key_'))
	{
		priv = 'admin'
	}

	else if(key.startsWith('_okey_'))
	{
		priv = 'op'
	}

	else if(key.startsWith('_vkey_'))
	{
		priv = 'voice'
	}

	check_permissions()
}

function change_upload_permission(m)
{
	if(priv === 'admin' || priv === 'op')
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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function change_chat_permission(m)
{
	if(priv === 'admin' || priv === 'op')
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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function change_radio_permission(m)
{
	if(priv === 'admin' || priv === 'op')
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
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function announce_upload_permission_change(data)
{
	var s = ""

	if(username === data.username)
	{
		var d = "You changed the upload permission to"
	}

	else
	{
		var d = `${data.username} changed the upload permission to`
	}

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
		can_upload = check_upload_permission(priv)
		chat_announce('~', '~', s, 'small')
	}
}

function announce_chat_permission_change(data)
{
	var s = ""

	if(username === data.username)
	{
		var d = "You changed the chat permission to"
	}

	else
	{
		var d = `${data.username} changed the chat permission to`
	}

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
		can_chat = check_chat_permission(priv)
		chat_announce('~', '~', s, 'small')
	}
}

function announce_radio_permission_change(data)
{
	var s = ""

	if(username === data.username)
	{
		var d = "You changed the radio permission to"
	}

	else
	{
		var d = `${data.username} changed the radio permission to`
	}

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
		can_radio = check_radio_permission(priv)
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

function big_letter(s)
{
	return s.toUpperCase()[0]
}

function voice(nck)
{
	if(priv === 'admin' || priv === 'op')
	{
		if(nck.length > 0 && nck.length <= max_username_length)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "You can't voice yourself", 'small')
				return false
			}

			if(nicknames.indexOf(nck) === -1)
			{
				chat_announce('[', ']', "Nobody is using that nickname", 'small')
				return false
			}

			var prv = get_priv(nck)

			if(prv === 'voice')
			{
				isalready(nck, 'voice')
				return false
			}

			if((prv === 'admin' || prv === 'op') && priv !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('voice', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function show_upload_error()
{
	chat_announce('[', ']', "The image could not be uploaded", 'small')	
}

function announce_uploaded_image(data)
{
	if(username === data.image_uploader)
	{
		chat_announce('<<', '>>', 'You uploaded an image', 'small')		
	}

	else
	{
		chat_announce('<<', '>>', `${data.image_uploader} uploaded an image`, 'small')		
	}
}

function announce_voice(data)
{
	if(username === data.username2)
	{
		chat_announce('~', '~', `${data.username1} gave you voice`, 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', `You gave voice to ${data.username2}`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username1} gave voice to ${data.username2}`, 'small')
	}

	replace_priv_in_userlist(data.username2, 'voice')
}

function announce_op(data)
{
	if(username === data.username2)
	{
		chat_announce('~', '~', `${data.username1} gave you op`, 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', `You gave op to ${data.username2}`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username1} gave op to ${data.username2}`, 'small')
	}

	replace_priv_in_userlist(data.username2, 'op')
}

function strip(nck)
{
	if(priv === 'admin' || priv === 'op')
	{
		if(nck.length > 0 && nck.length <= max_username_length)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "You can't strip yourself", 'small')
				return false
			}

			if(nicknames.indexOf(nck) === -1)
			{
				chat_announce('[', ']', "Nobody is using that nickname", 'small')
				return false
			}

			var prv = get_priv(nck)

			if(prv === 'z')
			{
				isalready(nck, '')
				return false
			}

			if((prv === 'admin' || prv === 'op') && priv !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('strip', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function announce_strip(data)
{
	if(username === data.username2)
	{
		stripped()
		chat_announce('~', '~', `${data.username1} removed all privileges from you`, 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', `You removed all privileges from ${data.username2}`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username1} removed all privileges from ${data.username2}`, 'small')
	}

	replace_priv_in_userlist(data.username2, '')
}

function stripped()
{
	priv = ''
	check_permissions()
}

function announce_claim(data)
{
	claimed = true

	if(username === data.username)
	{
		var who = "you"
	}

	else
	{
		var who = data.username
	}

	if(data.updated)
	{
		var s = `The room has been reclaimed by ${who}. All previous associated keys are now invalid`
	}

	else
	{
		if(username === data.username)
		{
			var s = 'You have claimed this room. Check /help3 to learn about admin commands'
		}

		else
		{
			var s = `${data.username} has claimed this room`
		}		
	}

	chat_announce('~', '~', s, 'small')

	if(username !== data.username)
	{
		priv = ""
		check_permissions()
	}
	
	replace_claim_userlist(data.username)
}

function announce_unclaim(data)
{
	if(username === data.username)
	{
		chat_announce('~', '~', 'You unclaimed the room', 'small')
	}

	else
	{
		priv = ""
		chat_announce('~', '~', `${data.username} unclaimed the room`, 'small')
	}

	claimed = false
	priv = ""
	upload_permission = 1
	chat_permission = 1
	is_public = true

	set_topic_info(false)

	update_title()

	check_permissions()

	remove_privs_userlist()

	if(radio_source !== "")

	if(radio_source !== default_radio_source)
	{
		setup_radio(false)
	}
}

function announce_admin(data)
{
	if(username === data.username2)
	{
		chat_announce('~', '~', `${data.username1} gave you admin`, 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', `You gave admin to ${data.username2}`, 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username1} gave admin to ${data.username2}`, 'small')
	}

	replace_priv_in_userlist(data.username2, 'admin')
}

function admin(nck)
{
	if(priv === 'admin')
	{
		if(nck.length > 0 && nck.length <= max_username_length)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "You can't admin yourself", 'small')
				return false
			}

			if(nicknames.indexOf(nck) === -1)
			{
				chat_announce('[', ']', "Nobody is using that nickname", 'small')
				return false
			}

			var prv = get_priv(nck)

			if(prv === 'admin')
			{
				isalready(nck, 'admin')
				return false
			}

			socket_emit('admin', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
	}
}

function op(nck)
{
	if(priv === 'admin')
	{
		if(nck.length > 0 && nck.length <= max_username_length)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "You can't op yourself", 'small')
				return false
			}

			if(nicknames.indexOf(nck) === -1)
			{
				chat_announce('[', ']', "Nobody is using that nickname", 'small')
				return false
			}

			var prv = get_priv(nck)

			if(prv === 'op')
			{
				isalready(nck, 'op')
				return false
			}

			socket_emit('op', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
	}
}

function make_private()
{
	if(priv === 'admin' || priv === 'op')
	{
		if(!is_public)
		{
			chat_announce('[', ']', "Room is already private", 'small')
			return false
		}

		socket_emit('make_private', {})
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function make_public()
{
	if(priv === 'admin' || priv === 'op')
	{
		if(is_public)
		{
			chat_announce('[', ']', "Room is already public", 'small')
			return false
		}

		socket_emit('make_public', {})
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function made_private(data)
{
	is_public = false

	if(data.username === username)
	{
		var s = 'You made the room private'	
	}

	else
	{
		var s = `${data.username} made the room private`
	}

	s += ". The room won't appear in the public room list"
	
	chat_announce('~', '~', s, 'small')
}

function made_public(data)
{
	is_public = true 

	if(data.username === username)
	{
		var s = 'You made the room public'	
	}

	else
	{
		var s = `${data.username} made the room public`
	}

	s += ". The room will appear in the public room list"
	
	chat_announce('~', '~', s, 'small')
}

function reserve(pass="")
{
	socket_emit('username_reserve', {pass:pass, key:get_user_key(username)})
}

function reserved(data)
{
	if(data.updated)
	{
		chat_announce('[', ']', 'You already had this nickname reserved. The key was updated with a new one', 'small')
	}

	else
	{
		chat_announce('[', ']', `You have reserved ${data.username}`, 'small')
	}

	save_user_key(data.key)
}

function unreserve()
{
	var key = get_user_key(username)

	if(key === '')
	{
		chat_announce('[', ']', "You don't seem to own that nickname", 'small')
		return false
	}

	socket_emit('username_unreserve', {key:get_user_key(username)})
}

function unreserved(data)
{
	chat_announce('[', ']', `You have unreserved ${data.username}`, 'small')
	remove_user_key()
}

function recover(nck)
{
	if(!can_chat)
	{
		chat_announce('[', ']', "You don't have permission to do that", 'small')
		return false
	}

	if(username === nck)
	{
		chat_announce('[', ']', "That's already your nickname", 'small')
		return false
	}

	nck = clean_string4(nck.substring(0, max_username_length))

	var key = get_user_key(nck)

	if(key === '')
	{
		chat_announce('[', ']', "You don't seem to own that nickname", 'small')
		return false
	}

	save_room_nickname(nck)	

	socket_emit('username_recover', {username:nck, key:key})
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

		src = clean_string2(src)

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

function changed_radio_source(data)
{
	setup_radio(data)

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

	if(data.radio_setter === username)
	{
		chat_announce('~', '~', `You changed the radio to ${name}`, 'small')		
	}

	else
	{
		chat_announce('~', '~', `${data.radio_setter} changed the radio to ${name}`, 'small')
	}
}

function ban(nck)
{
	if(priv === 'admin' || priv === 'op')
	{
		if(nck.length > 0 && nck.length <= max_username_length)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "You can't ban yourself", 'small')
				return false
			}

			if(nicknames.indexOf(nck) === -1)
			{
				chat_announce('[', ']', "Nobody is using that nickname", 'small')
				return false
			}

			var prv = get_priv(nck)

			if((prv === 'admin' || prv === 'op') && priv !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('ban', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function unbanall()
{
	if(priv === 'admin' || priv === 'op')
	{
		socket_emit('unbanall', {})
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function unbanlast()
{
	if(priv === 'admin' || priv === 'op')
	{
		socket_emit('unbanlast', {})
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function bannedcount()
{
	if(priv === 'admin' || priv === 'op')
	{
		socket_emit('bannedcount', {})
	}
}

function get_bannedcount(data)
{
	if(data.count == 1)
	{
		chat_announce('[', ']', `There is ${data.count} user banned`, 'small')
	}

	else
	{
		chat_announce('[', ']', `There are ${data.count} users banned`, 'small')
	}	
}

function kick(nck)
{
	if(priv === 'admin' || priv === 'op')
	{
		if(nck.length > 0 && nck.length <= max_username_length)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "You can't kick yourself", 'small')
				return false
			}

			if(nicknames.indexOf(nck) === -1)
			{
				chat_announce('[', ']', "Nobody is using that nickname", 'small')
				return false
			}

			var prv = get_priv(nck)

			if((prv === 'admin' || prv === 'op') && priv !== 'admin')
			{
				forbiddenuser()
				return false
			}

			socket_emit('kick', {username:nck})
		}
	}

	else 
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function announce_unbanall(data)
{
	if(data.username === username)
	{
		chat_announce('~', '~', 'You unbanned all banned users', 'small')		
	}

	else
	{
		chat_announce('~', '~', `${data.username} unbanned all banned users`, 'small')
	}
}

function announce_unbanlast(data)
{
	if(data.username === username)
	{
		chat_announce('~', '~', 'You unbanned the latest banned user', 'small')		
	}

	else
	{
		chat_announce('~', '~', `${data.username} unbanned the latest banned user`, 'small')
	}
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
		chat_announce('[', ']', `${who} already has no privileges`, 'small')
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
		goto_url(`https://www.google.com/search?q=${q}`, "tab", false)
	}

	else if(site === 'soundcloud')
	{
		goto_url(`https://soundcloud.com/search?q=${q}`, "tab", false)
	}

	else if(site === 'youtube')
	{
		goto_url(`https://www.youtube.com/results?search_query=${q}`, "tab", false)
	}
}

function remove_voices()
{
	if(priv !== 'admin' && priv !== 'op')
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
		return false
	}

	socket_emit('remove_voices', {})
}

function remove_ops()
{
	if(priv !== 'admin')
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
		return false
	}

	socket_emit('remove_ops', {})
}

function remove_both()
{
	remove_voices()
	remove_ops()
}

function announce_removedvoices(data)
{
	if(username === data.username)
	{
		chat_announce('~', '~', 'You removed all voices', 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} removed all voices`, 'small')
	}

	if(priv === 'voice')
	{
		stripped()
	}

	remove_voices_userlist()
}

function announce_removedops(data)
{
	if(username === data.username)
	{
		chat_announce('~', '~', 'You removed all ops', 'small')
	}

	else
	{
		chat_announce('~', '~', `${data.username} removed all ops`, 'small')
	}

	if(priv === 'op')
	{
		stripped()
	}

	remove_ops_userlist()
}

function disconnected(data)
{
	removefrom_userlist(data.username)

	if(check_chat_permission(data.priv))
	{
		chat_announce('--', '--', `${data.username} has left`, 'small')
	}
}

function pinged(data)
{
	removefrom_userlist(data.username)

	if(check_chat_permission(data.priv))
	{
		chat_announce('--', '--', `${data.username} has left (Ping Timeout)`, 'small')
	}
}

function kicked(data)
{
	removefrom_userlist(data.username)

	if(username === data.info1)
	{
		chat_announce('--', '--', `${data.username} was kicked by you`, 'small')
	}

	else
	{
		chat_announce('--', '--', `${data.username} was kicked by ${data.info1}`, 'small')
	}
}

function banned(data)
{
	removefrom_userlist(data.username)

	if(username === data.info1)
	{
		chat_announce('--', '--', `${data.username} was banned by you`, 'small')
	}

	else
	{
		chat_announce('--', '--', `${data.username} was banned by ${data.info1}`, 'small')
	}
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

	msg_settings = Msg
	(
		Object.assign({}, common,
		{		
			id: "settings",
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

	msg_info = Msg
	(
		Object.assign({}, common,
		{
			id: "info",
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
				crm = false
				crm2 = false
			}
		})
	)

	msg_storageui = Msg
	(
		Object.assign({}, common,
		{
			id: "storageui",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				storageui_interval = setInterval(function()
				{
					if(settings.custom_scrollbars)
					{
						update_modal_scrollbar("storageui")
					}
				}, 1000)

				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				clearInterval(storageui_interval)
				after_modal_close(instance)
			}
		})
	)

	msg_menu.set(template_menu())
	msg_settings.set(template_settings())
	msg_userlist.set(template_userlist())
	msg_roomlist.set(template_roomlist())
	msg_played.set(template_played())
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
		settings.background_image = true
		changed = true
	}
	
	if(settings.header_contrast === undefined)
	{
		settings.header_contrast = false
		changed = true
	}

	if(settings.input_contrast === undefined)
	{
		settings.input_contrast = false
		changed = true
	}

	if(settings.modal_color === undefined)
	{
		settings.modal_color = default_modal_color
		changed = true
	}

	if(settings.custom_scrollbars === undefined)
	{
		settings.custom_scrollbars = true
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

	$("#setting_header_contrast").prop("checked", settings.header_contrast)
	
	$("#setting_input_contrast").prop("checked", settings.input_contrast)
	input_contrast_fix()

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
		change()
		setup_opacity()
		save_settings()
	})

	$("#setting_header_contrast").change(function()
	{
		settings.header_contrast = $("#setting_header_contrast").prop("checked")
		change()
		save_settings()
	})

	$("#setting_input_contrast").change(function()
	{
		settings.input_contrast = $("#setting_input_contrast").prop("checked")
		input_contrast_fix()
		change()
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
		settings.modal_color = $('#setting_modal_color option:selected').val()
		change_modal_color(settings.modal_color)		
		save_settings()
	})
}

function input_contrast_fix()
{
	if(settings.input_contrast)
	{
		$("#input").css("padding-left", "10px")
		$("#input").css("padding-right", "10px")
	}

	else
	{
		$("#input").css("padding-left", 0)
		$("#input").css("padding-right", 0)
	}
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

function start_storageui()
{
	storageui = StorageUI(
	{
		items:
		[
			{
				name: "Room Nicknames",
				ls_name: ls_room_nicknames,
				on_save: function(item)
				{
					on_storageui_save(item)
				},
				on_reset: function(item)
				{
					on_storageui_save(item, true)				
				},
				on_copied: function(item)
				{
					pup()
				}
			},
			{
				name: "Room Keys",
				ls_name: ls_room_keys,
				on_save: function(item)
				{
					on_storageui_save(item)
				},
				on_reset: function(item)
				{
					on_storageui_save(item, true)					
				},
				on_copied: function(item)
				{
					pup()
				}
			},
			{
				name: "User Keys",
				ls_name: ls_user_keys,
				on_save: function(item)
				{
					on_storageui_save(item)
				},
				on_reset: function(item)
				{
					on_storageui_save(item, true)
				},
				on_copied: function(item)
				{
					pup()
				}
			},
			{
				name: "Settings",
				ls_name: ls_settings,
				on_save: function(item)
				{
					on_storageui_save(item)
				},
				on_reset: function(item)
				{
					on_storageui_save(item, true)					
				},
				on_copied: function(item)
				{
					pup()
				}
			}
		],
		after_reset: function()
		{
			pup()
		},
		msg: msg_storageui
	})
}

function on_storageui_save(item, reset=false)
{
	if(reset)
	{
		remove_local_storage(item.ls_name)
	}

	else
	{
		save_local_storage(item.ls_name, item.value)
	}

	if(item.ls_name === ls_settings)
	{
		reload_settings()
		storageui.view()
	}

	if(!reset)
	{
		pup()
	}
}

function show_data()
{
	storageui.menu()
}

function reload_settings()
{
	get_settings()
	start_settings_state()
	change_modal_color(settings.modal_color)
	setup_scrollbars()
	change()
	setup_opacity()
}

function show_info(s, callback=false)
{
	if(callback)
	{
		msg_info.set_or_show(s, function()
		{
			callback()
		})
	}

	else
	{
		msg_info.set_or_show(s)
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

			var nick = $(this).find(".ui_item_nick").eq(0).text()

			var include = false

			if(nick.toLowerCase().indexOf(filter) !== -1)
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
		$(".show_history_item").each(function()
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
		$(".show_history_item").each(function()
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
			'onReady': onYouTubePlayerReady
		}		
	})
}

function onYouTubePlayerReady()
{
	youtube_player = yt_player
}