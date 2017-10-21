var ls_settings = "settings_v1"
var settings
var is_public
var room
var username
var image_url = ''
var image_uploader = ''
var topic = ''
var topic_setter = ''
var dropzone
var colorlib = ColorLib()
var played = []
var input_history = []
var input_history_index = 0
var usercount
var room_keys
var room_key = ''
var userlist = []
var user_keys
var nicknames = []
var room_nicknames
var priv = ''
var upload_permission
var chat_permission
var can_upload
var can_chat
var change_when_focused = false
var radiosrc = ''
var radioinfo = ''
var claimed = false
var msgcount = 0
var get_metadata
var no_meta_count
var tabbed_list = []
var tabbed_word = ""
var tabbed_start = 0
var tabbed_end = 0
var crm = false
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
var template_info
var storageui_interval
var msg_menu
var msg_create_room
var msg_settings
var msg_userlist
var msg_roomlist
var msg_played
var msg_info
var msg_storageui

function init()
{
	get_nickname()
	compile_templates()
	get_settings()
	start_msg()
	start_settings_state()
	start_settings_listeners()
	start_storageui()
	start_image_events()
	start_dropzone()
	start_volume_scroll()
	initial_volume()
	activate_window_visibility_listener()
	get_room_keys()
	activate_key_detection()
	input_click_events()
	copypaste_events()
	main_menu_events()
	scroll_events()
	resize_events()
	register_commands()
	start_chat_scrollbar()
	start_socket()
}

function get_room_nicknames()
{
	if(localStorage["room_nicknames"])
	{
		try
		{
			room_nicknames = JSON.parse(localStorage.getItem("room_nicknames"))
		}

		catch(err)
		{
			localStorage.removeItem("room_nicknames")
			room_nicknames = []
		}
	}

	else
	{
		room_nicknames = []
	}	
}

function get_nickname()
{
	get_room_nicknames()

	var uname

	for(var i=0; i<room_nicknames.length; i++)
	{
		if(room_nicknames[i][0] === room)
		{
			uname = room_nicknames[i][1]
			break
		}
	}

	if(uname === undefined)
	{
		for(var i=0; i<room_nicknames.length; i++)
		{
			if(room_nicknames[i][0] === '/default')
			{
				uname = room_nicknames[i][1]
				break
			}
		}
	}

	if(uname === undefined)
	{
		var keep_naming = true

		while(keep_naming)
		{
			uname = clean_string4(prompt('Pick your nickname').substring(0, max_username_length))

			if(uname === null || uname.length < 1 || uname.indexOf('<') !== -1)
			{
				keep_naming = true
			}

			else
			{
				keep_naming = false
			}
		}

		save_room_nickname(uname)
		save_default_nickname(uname)
	}
	
	username = uname
}

function save_room_nickname(uname)
{
	if(typeof room_nicknames === "object" && room_nicknames.length > 0)
	{
		for(var i=0; i<room_nicknames.length; i++)
		{
			if(room_nicknames[i][0] === room)
			{
				room_nicknames.splice(i, 1)
				break
			}
		}	
	}

	room_nicknames.push([room, uname])

	localStorage.setItem('room_nicknames', JSON.stringify(room_nicknames))
}

function save_default_nickname(uname)
{
	if(typeof room_nicknames === "object" && room_nicknames.length > 0)
	{
		for(var i=0; i<room_nicknames.length; i++)
		{
			if(room_nicknames[i][0] === '/default')
			{
				room_nicknames.splice(i, 1)
				break
			}
		}	
	}

	room_nicknames.push(['/default', uname])

	localStorage.setItem('room_nicknames', JSON.stringify(room_nicknames))
}

function show_intro()
{
	chat_announce('', '', 'Welcome to ' + room + ', ' + username, 'big')
}

function show_reconnected()
{
	chat_announce('--', '--', 'Reconnected', 'small')
}

function compile_templates()
{
	template_menu = Handlebars.compile($('#template_menu').html())
	template_create_room = Handlebars.compile($('#template_create_room').html())
	template_settings = Handlebars.compile($('#template_settings').html())
	template_userlist = Handlebars.compile($('#template_userlist').html())
	template_roomlist = Handlebars.compile($('#template_roomlist').html())
	template_played = Handlebars.compile($('#template_played').html())
	template_info = Handlebars.compile($('#template_info').html())
}

function help()
{
	chat_announce('', '', 'Basic Features:', 'small')
	chat_announce('', '', 'Chat by typing anything.', 'small')
	chat_announce('', '', 'All elements in the top bar are clickable.', 'small')
	chat_announce('', '', 'Change the image on the right by pasting an image url.', 'small')
	chat_announce('', '', 'Change it by clicking on the current image.', 'small')
	chat_announce('', '', 'Change it by dropping an image file anywhere on the page.', 'small')
	chat_announce('', '', '/nick x: Used to change your nickname in the current room.', 'small')
	chat_announce('', '', '/goto x: Goes to a certain room.', 'small')
	chat_announce('', '', '/me x: Makes a message in third person.', 'small')
	chat_announce('', '', '/help: Shows this message.', 'small')
	chat_announce('', '', '/help2: Shows additional features.', 'small')
	chat_announce('', '', '/help3: Shows administration features.', 'small')
}

function help2()
{
	chat_announce('', '', 'Additional Features:', 'small')
	chat_announce('', '', 'Escape clears the input or closes popups.', 'small')
	chat_announce('', '', 'Shift + Escape or /clear clears all messages from the chat.', 'small')
	chat_announce('', '', 'Shift + Tab or /status shows information about you and the room.', 'small')
	chat_announce('', '', 'Up and Down Arrows cycle through the input history.', 'small')
	chat_announce('', '', 'Shift + Up Arrow and Shift + Down Arrow or Page Up and Page down make the chat scroll.', 'small')
	chat_announce('', '', 'Enter without text in the input scrolls to the bottom of the chat.', 'small')
	chat_announce('', '', 'Clicking on a nickname sends it to the input.', 'small')
	chat_announce('', '', 'Tab completes nicknames and commands.', 'small')
	chat_announce('', '', '/defnick x: Changes your default nickname for rooms you visit for the first time.', 'small')
	chat_announce('', '', '/reserve: Reserves current nickname to be recoverable later.', 'small')
	chat_announce('', '', '/recover x: Recovers reserved nickname in case someone else in the room is using it.', 'small')
	chat_announce('', '', '/priv: Shows information regarding privileges and permissions.', 'small')
	chat_announce('', '', '/users: Shows the user list. An alternative to the user list window.', 'small')
	chat_announce('', '', '/crew: Shows a list of users that have either admin or op privileges.', 'small')
	chat_announce('', '', '/history: Shows the input history.', 'small')
	chat_announce('', '', '/startradio: Starts the radio.', 'small')
	chat_announce('', '', '/stopradio: Stops the radio.', 'small')
	chat_announce('', '', '/volume x: Changes the volume of the radio.', 'small')
	chat_announce('', '', 'Shift + Enter toggles the radio.', 'small')
}

function help3()
{
	chat_announce('', '', 'Administration Features:', 'small')
	chat_announce('', '', '/claim: Requests administration of the room. If it hasn\'t been claimed, user gets the ownership.', 'small')
	chat_announce('', '', '/reclaim: Reclaims the room if you\'re already an admin. Removes all given privileges to other users.', 'small')
	chat_announce('', '', '/unclaim: Removes all ownership on the room and resets it to a default state.', 'small')
	chat_announce('', '', '/upload_permission 1: Anyone can upload images.', 'small')
	chat_announce('', '', '/upload_permission 2: Only voiced users and up can upload images.', 'small')
	chat_announce('', '', '/upload_permission 3: Only ops and up can upload images.', 'small')
	chat_announce('', '', '/chat_permission 1: Anyone can chat.', 'small')
	chat_announce('', '', '/chat_permission 2: Only voiced users and up can chat.', 'small')
	chat_announce('', '', '/chat_permission 3: Only ops and up can chat.', 'small')
	chat_announce('', '', '/voice x: Gives voice to a user.', 'small')
	chat_announce('', '', '/op x: Gives op to a user. Ops can do anything an admin can do except more high level commands.', 'small')
	chat_announce('', '', '/admin x: Gives admin to a user. This gives a user the same rights as the original admin.', 'small')
	chat_announce('', '', '/strip x: Removes all privileges from a user.', 'small')
	chat_announce('', '', '/removevoices: Removes all privileges from voiced users.', 'small')
	chat_announce('', '', '/removeops: Removes all privileges from op\'d users.', 'small')
	chat_announce('', '', '/private: Room doesn\'t appear in the public room list.', 'small')
	chat_announce('', '', '/public: Room appears in the public room list.', 'small')
	chat_announce('', '', '/radio x: Changes the radio source. It will try to automatically fetch metadata from Icecast2 servers. If x is \'default\' it changes to the default radio.', 'small')
	chat_announce('', '', '/topic x: Changes the topic of the room.', 'small')
	chat_announce('', '', '/topicadd x: Adds text to the current topic.', 'small')
	chat_announce('', '', '/topictrim x: Removes added text to topic, where the optional x is the number of trims you want to do.', 'small')
	chat_announce('', '', '/topicedit: Puts the topic in the input, ready to be edited.', 'small')
	chat_announce('', '', '/ban x: Bans a user from the room.', 'small')
	chat_announce('', '', '/unbanlast: Unbans the latest banned user.', 'small')
	chat_announce('', '', '/unbanall: Removes all bans.', 'small')
	chat_announce('', '', '/bannedcount: Displays the number of banned users in the room.', 'small')
	chat_announce('', '', '/kick x: Kicks a user out of the room.', 'small')
	chat_announce('', '', 'Note: Nicknames and main menu have a context menu with some operations.', 'small')
}

function show_status()
{
	show_room()
	show_nickname()
	show_topic2()
	show_radiosrc()
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
	chat_announce('[', ']', 'Room: ' + room, 'small')
}

function show_radiosrc()
{
	chat_announce('[', ']', 'Radio: ' + radiosrc, 'small')
}

function show_topic()
{
	if(topic)
	{
		if(topic_setter !== "")
		{
			chat_announce('', '', 'Topic: ' + topic, 'big', false, "Set by " + topic_setter)
		}

		else
		{
			chat_announce('', '', 'Topic: ' + topic, 'big')
		}
	}

	else 
	{
		if(claimed)
		{
			chat_announce('', '', 'Topic: ' + default_topic_claimed, 'big')
		}

		else
		{
			chat_announce('', '', 'Topic: ' + default_topic, 'big')
		}
	}
}

function show_topic2()
{
	if(topic)
	{
		chat_announce('[', ']', 'Topic: ' + topic, 'small')
	}

	else
	{
		if(claimed)
		{
			chat_announce('[', ']', 'Topic: ' + default_topic_claimed, 'small')
		}

		else
		{
			chat_announce('[', ']', 'Topic: ' + default_topic, 'small')
		}
	}
}

function check_priv(data)
{
	priv = data.priv
	upload_permission = data.upload_permission
	chat_permission = data.chat_permission
	check_permissions()
}

function check_permissions()
{
	can_upload = check_upload_permission(priv)
	can_chat = check_chat_permission(priv)
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

		if(ps === 0)
		{
			chat_announce('[', ']', "You cannot interact", 'small')
		}
	}
}

function show_nickname()
{
	chat_announce('[', ']', 'Nickname: ' + username, 'small')
}

function start_socket()
{
	socket = io('/')

	socket.on('connect', function() 
	{
		socket.emit('join_room', {room:room, username:username, key:room_key})
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

			username = data.username

			if(data.image_url === '' || data.image_url === undefined)
			{
				image_url = default_image_url
			}

			else
			{
				image_url = data.image_url
			}

			if(data.image_uploader !== undefined)
			{
				image_uploader = data.image_uploader
			}

			claimed = data.claimed
			setup_radio(data.radiosrc)
			userlist = data.userlist
			update_userlist()
			update_topic(data.topic, data.topic_setter)
			is_public = data.public
			check_priv(data)
			change()

			if(connections === 1)
			{
				setup_opacity()
				clear_chat()
				check_firstime()
				get_user_keys()
				start_nickname_context_menu()
				start_main_menu_context_menu()
				start_played_context_menu()
				start_metadata_loop()
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
			image_url = data.image_url
			image_uploader = data.image_uploader
			announce_uploaded_image(data)			
			change()
		}

		else if(data.type === 'userjoin')
		{
			addto_userlist(data.username, data.priv)

			if(check_chat_permission(data.priv))
			{
				chat_announce('--', '--', data.username + ' has joined', 'small')
			}
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

		else if(data.type === 'upload_permission_change')
		{
			announce_upload_permission_change(data)
		}

		else if(data.type === 'chat_permission_change')
		{
			announce_chat_permission_change(data)
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
			if(data.count == 1)
			{
				chat_announce('[', ']', "There is " + data.count + " user banned", 'small')
			}

			else
			{
				chat_announce('[', ']', "There are " + data.count + " users banned", 'small')
			}
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

		else if(data.type === 'nothingtoremove')
		{
			chat_announce('[', ']', "There was nothing to remove", 'small')
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

		else if(data.type === 'changed_radiosrc')
		{
			changed_radiosrc(data)
		}

		else if(data.type === 'reserved')
		{
			reserved(data)
		}

		else if(data.type === 'alreadyreserved')
		{
			chat_announce('[', ']', username + " is already reserved", 'small')
		}

		else if(data.type === 'couldnotrecover')
		{
			chat_announce('[', ']', "You don't seem to own that nickname", 'small')
		}

		else if(data.type === 'redirect')
		{
			window.location = data.location
		}

		else if(data.type === 'disconnection')
		{		
			removefrom_userlist(data.username)

			if(check_chat_permission(data.priv))
			{
				chat_announce('--', '--', data.username + ' has left', 'small')
			}
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

		socket.emit('heartbeat', {})
	}, heartbeat_interval)
}

function setup_radio(src)
{
	get_metadata = true
	no_meta_count = 0

	if(src == '')
	{
		radiosrc = default_radiosrc
		radioinfo = default_radioinfo
	}

	else
	{
		radiosrc = src
		
		if(radiosrc.slice(-1) == '/')
		{
			radioinfo = src.slice(0, -1).split('/').slice(0, -1).join('/') + '/status-json.xsl'
		}

		else
		{
			radioinfo = src.split('/').slice(0, -1).join('/') + '/status-json.xsl'
		}

	}

	get_radio_metadata()
}

function update_usercount(usercount)
{
	if(usercount == 1)
	{
		var s = usercount + ' User Online'
	}

	else 
	{
		var s = usercount + ' Users Online'
	}

	$('#usercount').html(s)
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

		var h = $("<div class='userlist_item'><span class='ui_item_priv'></span><span class='ui_item_nick'></span></div><br>")

		var p = priv_tag(item[1])

		h.find('.ui_item_priv').eq(0).text(p)
		h.find('.ui_item_nick').eq(0).text(item[0])

		h.click({nickname:item[0]}, function(event)
		{
			add_to_input(event.data.nickname) 
			close_all_modals()
		})

		s = s.add(h)
	}

	s = s.add('<br>')

	update_usercount(userlist.length)

	$('#userlist').html(s)
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
	$.contextMenu({
		selector: ".ui_item_nick, .chat_uname",
		animation: {duration: 250, hide: 'fadeOut'},
		items: {
			cmvoice: {
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
			cmop: {
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
			cmstrip: {
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
			cmkick: {
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
			cmban: {
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
				items: {
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
			cmadmin: {
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
				items: {
					adminsure: 
					{
						name: "I'm Sure", callback: function(key, opt)
						{
							var arg = $(this).text()
							admin(arg)
						}					
					}
				}
			},			
		}
	})
}

function start_main_menu_context_menu()
{
	$.contextMenu(
	{
		selector: "#main_menu",
		animation: {duration: 250, hide: 'fadeOut'},
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
						items: {
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
						items: {
							rmopssure: 
							{
								name: "I'm Sure", callback: function(key, opt)
								{
									remove_ops()
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
						items: {
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
						items: {
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
		selector: ".played_item, #now_playing_area",
		animation: {duration: 250, hide: 'fadeOut'},
		items: 
		{
			cmenu1: 
			{
				name: "Search on Google", callback: function(key, opt)
				{
					search_in('google', $(this).data('q'))
				}
			},
			cmenu2: 
			{
				name: "Search on SoundCloud", callback: function(key, opt)
				{
					search_in('soundcloud', $(this).data('q'))
				}         
			},
			cmenu3: 
			{
				name: "Search on YouTube", callback: function(key, opt)
				{
					search_in('youtube', $(this).data('q'))
				}
			}
		}
	})
}

function request_roomlist()
{
	socket.emit("roomlist", {})
}

function update_roomlist(roomlist)
{	
	var s = $()

	s = s.add()

	for(var i=0; i<roomlist.length; i++)
	{
		var c = "<span class='roomlist_filler'></span><span class='roomlist_name'></span><span class='roomlist_count'></span><div class='roomlist_topic'></div>"
		var h = $("<div class='roomlist_item'>" + c + "</div><br>")

		h.find('.roomlist_name').eq(0).text(roomlist[i][0])

		if(roomlist[i][0] === room)
		{
			var t = "(" + roomlist[i][2] + ") *"		
		}

		else
		{
			var t = "(" + roomlist[i][2] + ")"
		}

		h.find('.roomlist_count').eq(0).text(t)		
		h.find('.roomlist_filler').eq(0).text(t)

		h.click({room:roomlist[i][0]}, function(event)
		{
			goto_room(event.data.room)
		})

		if(roomlist[i][1].length > 0)
		{
			var topic = roomlist[i][1]
		}

		else 
		{
			var topic = 'No topic set'
		}

		h.find('.roomlist_topic').eq(0).text(topic)

		s = s.add(h)
	}

	s = s.add('<br>')

	$('#roomlist').html(s)
}

function show_menu()
{
	msg_menu.show()
}

function show_create_room()
{
	msg_create_room.show()
}

function show_settings()
{
	msg_settings.show()
}

function show_userlist()
{
	msg_userlist.show()
}

function show_roomlist()
{
	msg_roomlist.show()
}

function show_played()
{
	msg_played.show()
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

			socket.emit("uploaded", 
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

				var arg = $('#create_room_input').val().substr(0, max_roomname_length).trim()

				if(arg.length > 0)
				{
					goto_room(arg)
					e.preventDefault()
				}

				return
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

function input_to_end()
{
	$('#input')[0].scrollLeft = $('#input')[0].scrollWidth
}

function add_to_history(msg)
{
	input_history_index = -1

	for(var i=0; i<input_history.length; i++)
	{
		if(input_history[i] === msg)
		{
			input_history.splice(i, 1)
			break
		}
	}

	if(input_history.length >= history_crop_limit)
	{
		input_history.shift()
	}

	input_history.push([msg, get_date()])	
}

function input_history_change(direction)
{
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

function show_history()
{
	if(input_history.length > 0)
	{
		var s = $("<div></div>")

		for(var item of input_history.slice().reverse())
		{
			var h = $(`<div title='${item[1]}' class='show_history_item'></div>`)

			h.text(item[0])

			h.click({text:item[0]}, function(event)
			{
				change_input(event.data.text)
				close_all_modals()
			})

			s.append(h)
		}

		s = s[0]
	}

	else
	{
		var s = "[ Messages or commands you type will appear here ]"		
	}

	show_info(s)
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
	return str.valueOf().startsWith(what.split('').sort().join('') + ' ')
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
			input.value = replaceBetween(input.value, tabbed_start, tabbed_end, uname + ' ')
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
		suppressScrollX: true
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
		autohidemode: false,
		cursorcolor: "#AFAFAF",
		cursorborder: "0px solid white",
		enablekeyboard: false
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

function get_date()
{
	return dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")
}

function update_chat(uname, msg)
{
	var contclasses = "chat_content"

	if(uname !== username)
	{
		var regex = new RegExp("\\b" + username + "\\b")

		if(msg.search(regex) != -1)
		{
			contclasses += " dotted"

			alert_title2()
		}
	}

	var date = get_date()

	if(msg.startsWith('/me ') || msg.startsWith('/em '))
	{
		var fmsg = $("<div title='" + date + "' class='msg chat_message'>* <span class='chat_uname'></span> <span class='" + contclasses + "'></span> *</div><div class='sep1'>&nbsp</div>")
		$(fmsg).find('.chat_content').eq(0).text(msg.substr(4)).urlize()
	}

	else
	{
		var fmsg = $("<div title='" + date + "' class='msg chat_message'><b><span class='chat_uname'></span>:</b>&nbsp<span class='" + contclasses + "'></span></div><div class='sep1'>&nbsp</div>")
		$(fmsg).find('.chat_content').eq(0).text(msg).urlize()
	}
	
	$(fmsg).find('.chat_uname').eq(0).text(uname).click({uname:uname}, function(event)
	{
		add_to_input(event.data.uname)
	})

	add_to_chat(fmsg)

	add_msgcount()

	goto_bottom(false)

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
				$('#background_image').css('background-image', 'url(' + image_url + ')') 

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

		if(image_uploader !== '' && image_url !== default_image_url)
		{
			var title = 'Uploaded by ' + image_uploader

			$(this).prop('title', title)
		}

		else
		{
			$('#image_uploader').text('')
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

	$('#image_uploader').click(function()
	{
		add_to_input(image_uploader)
	})
}

function set_opacity(o)
{
	$("#header").css("opacity", o)
	$("#media").css("opacity", o)
	$("#chat_area").css("opacity", o)
	$("#input_container").css("opacity", o)
	$("#input").css("opacity", o)
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
	var date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")

	var contclasses = "announcement_content"

	var regex = new RegExp("\\b" + username + "\\b")

	if(dotted === true)
	{
		contclasses += " dotted"

		alert_title2()
	}

	if(title)
	{
		var t = title + " | " + date
	}

	else
	{
		var t = date
	}
	
	if(typeof dotted === "string")
	{
		var fmsg = $("<div title='" + t + "' class='msg announcement announcement_" + size + "'>" + brk1 + " <span class='" + contclasses + "'></span><span class='dotted'></span> " + brk2 + "</div><div class='sep1'>&nbsp</div>")
		$(fmsg).find('.dotted').eq(0).text(dotted).urlize()
	}

	else
	{
		var fmsg = $("<div title='" + t + "' class='msg announcement announcement_" + size + "'>" + brk1 + " <span class='" + contclasses + "'></span> " + brk2 + "</div><div class='sep1'>&nbsp</div>")
	}

	$(fmsg).find('.announcement_content').eq(0).text(msg).urlize()

	add_to_chat(fmsg)

	add_msgcount()

	goto_bottom(false)
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
	return s.replace(/[^a-z0-9\-_\s]+/gi, "").replace(/\s+/g, " ").trim()
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
					x = x.replace(list[i], "<a class='chat' target='_blank' href='" + prot + list[i] + "'>"+ list[i] + "</a>")
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
	commands.push('/clear')
	commands.push('/claim')
	commands.push('/reclaim')
	commands.push('/unclaim')
	commands.push('/upload_permission')
	commands.push('/chat_permission')
	commands.push('/crew')
	commands.push('/users')
	commands.push('/priv')
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
	commands.push('/private')
	commands.push('/public')
	commands.push('/radio')
	commands.push('/privacy')
	commands.push('/reserve')
	commands.push('/recover')
	commands.push('/status')
	commands.push('/topic')
	commands.push('/topicadd')
	commands.push('/topictrim')
	commands.push('/topicedit')
	commands.push('/room')
	commands.push('/goto')
	commands.push('/help3')
	commands.push('/help2')
	commands.push('/help')
	commands.push('/stopradio')
	commands.push('/startradio')
	commands.push('/volume')
	commands.push('/history')
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

			else if(oiStartsWith(lmsg, '/upload_permission'))
			{
				change_upload_permission(arg)
			}

			else if(oiEquals(lmsg, '/upload_permission'))
			{
				show_upload_permission(arg)
			}

			else if(oiStartsWith(lmsg, '/chat_permission'))
			{
				change_chat_permission(arg)
			}

			else if(oiEquals(lmsg, '/chat_permission'))
			{
				show_chat_permission(arg)
			}

			else if(oiEquals(lmsg, '/crew'))
			{
				show_crew()
			}

			else if(oiEquals(lmsg, '/users'))
			{
				show_users()
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
				change_radiosrc(arg)
			}

			else if(oiEquals(lmsg, '/radio'))
			{
				show_radiosrc()
			}

			else if(oiEquals(lmsg, '/public'))
			{
				make_public()
			}

			else if(oiEquals(lmsg, '/privacy'))
			{
				show_public()
			}

			else if(oiEquals(lmsg, '/reserve'))
			{
				reserve()
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

			else if(oiEquals(lmsg, '/topicedit'))
			{
				topicedit()
				return
			}

			else if(oiEquals(lmsg, '/topic'))
			{
				show_topic2()
			}

			else if(oiEquals(lmsg, '/room'))
			{
				show_room()
			}

			else if(oiStartsWith(lmsg, '/goto'))
			{
				goto_room(arg)
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

			else
			{
				chat_announce('[', ']', "Invalid command", 'small')
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
				socket.emit('sendchat', {msg:msg})
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
			if(topic != dtopic)
			{
				socket.emit('topic_change', {topic:dtopic})
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
		if(arg.length === 0)
		{
			return
		}

		var ntopic = topic + topic_separator

		if(ntopic.length < max_topic_length)
		{
			ntopic += arg
		}

		else
		{
			chat_announce('[', ']', "There is no more room to add that to the topic", 'small')
			return
		}

		ntopic = ntopic.substring(0, max_topic_length)

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

function topicedit()
{
	change_input("/topic " + topic)
}

function announce_topic_change(data)
{
	if(data.topic !== topic)
	{
		var highlight = false

		if(data.username !== username)
		{
			var regex = new RegExp("\\b" + username + "\\b")

			if(data.topic.search(regex) !== -1)
			{
				highlight = true
			}
		}	
			
		if(data.username === username)
		{
			if(data.topic.startsWith(topic + topic_separator))
			{
				if(highlight)
				{
					chat_announce('~', '~', 'You added to the topic: ' + data.topic, 'small', highlight)
				}

				else
				{
					chat_announce('~', '~', 'You added to the topic: ' + topic + topic_separator, 'small', data.topic.substr(topic.length + 3))
				}
			}

			else
			{
				if(topic.startsWith(data.topic))
				{
					chat_announce('~', '~', 'You trimmed the topic to: ' + data.topic, 'small', highlight)				
				}

				else
				{
					chat_announce('~', '~', 'You changed the topic to: ' + data.topic, 'small', highlight)				
				}
			}
		}

		else
		{
			if(data.topic.startsWith(topic + topic_separator))
			{
				if(highlight)
				{
					chat_announce('~', '~', data.username + ' added to the topic: ' + data.topic, 'small', highlight)
				}

				else
				{
					chat_announce('~', '~', data.username + ' added to the topic: ' + topic + topic_separator, 'small', data.topic.substr(topic.length + 3))
				}
			}

			else
			{
				if(topic.startsWith(data.topic))
				{
					chat_announce('~', '~', data.username + ' trimmed the topic to: ' + data.topic, 'small', highlight)				
				}

				else
				{
					chat_announce('~', '~', data.username + ' changed the topic to: ' + data.topic, 'small', highlight)
				}
			}
		}

		update_topic(data.topic, data.topic_setter)
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

			socket.emit('username_change', {username:nck})
		}
	}

	else
	{
		chat_announce('[', ']', "You don't have permission to do that", 'small')
	}
}

function change_default_nickname(nck)
{
	nck = clean_string4(nck.substring(0, max_username_length))
	
	if(nck.length > 0)
	{
		save_default_nickname(nck)
		chat_announce('[', ']', "Default nickname changed to " + nck, 'small')
	}
}

function show_default_nickname()
{
	for(var i=0; i<room_nicknames.length; i++)
	{
		if(room_nicknames[i][0] === '/default')
		{
			chat_announce('[', ']', 'Default Nickname: ' + room_nicknames[i][1], 'small')
			break
		}
	}
}

function new_username(data)
{
	if(username === data.old_username)
	{
		username = data.username
		chat_announce('~', '~', 'You are now known as ' + username, 'small')
	}

	else
	{
		chat_announce('~', '~', data.old_username + ' is now known as ' + data.username, 'small')
	}

	replace_nick_in_userlist(data.old_username, data.username)
}

function goto_bottom(force)
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
	socket.emit('pasted', {image_url:url})
}

function get_radio_metadata()
{
	if(get_metadata)
	{
		try
		{
			$.get(radioinfo,
			{

			},
			function(data)
			{
				try
				{
					if(Array.isArray(data.icestats.source))
					{
						for(var i=0; i<data.icestats.source.length; i++)
						{
							var source = data.icestats.source[i]

							if(source.listenurl.indexOf(radiosrc.split('/').pop()) !== -1)
							{
								break
							}
						}
					}

					else if(data.icestats.source.listenurl.indexOf(radiosrc.split('/').pop()) !== -1)
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

					push_played(source.title, source.artist)
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
}

function show_playing_file()
{
	get_metadata = false
	
	var s = radiosrc.split('/')

	if(s.length > 1)
	{
		var p = s.pop()

		$('#now_playing').text(p)
		$('#now_playing_area').data('q', p)

		show_nowplaying()
	}

	else
	{
		hide_nowplaying()
	}
}

function push_played(title, artist)
{
	var s = title + " - " + artist

	var q = '"' + title + '" by "' + artist + '"'
	
	$('#now_playing').text(s)

	$('#now_playing_area').data('q', q)

	if(played[played.length - 1] !== s)
	{
		var date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")
		
		var pi = "<div class='pititle'></div><div class='piartist'></div>"
		
		h = $("<div title='" + date + "' class='played_item'>" + pi + "</div><br>")
		
		$(h).find('.pititle').eq(0).text(title)
		$(h).find('.piartist').eq(0).text("by " + artist)

		$(h).data('q', q)

		$(h).click(function()
		{
			search_in('google', $(this).data('q'))
		})
		
		$('#played').prepend(h)

		played.push(s)

		if(played.length > played_crop_limit)
		{
			var els = $('#played').children()
			els.slice(els.length - 3, els.length - 1).remove()
			played.splice(0, 1)
		}
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
	if(radiosrc)
	{
		$('#audio').attr('src', radiosrc)
	}

	else
	{
		$('#audio').attr('src', default_radiosrc)
	}

	$('#playing_icon').css('display', 'inline-block')

	$('#toggle_radio_text').html('Stop Radio')
}

function stop_radio()
{
	$('#audio').attr('src', '')
	$('#playing_icon').css('display', 'none')
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
		if(get_metadata)
		{
			get_radio_metadata()
		}

		else
		{
			no_meta_count += 1

			if(no_meta_count > 20)
			{
				get_metadata = true
				no_meta_count = 0
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
	var audio = $('#audio')[0]

	audio.volume = nv

	$('#pup')[0].volume = nv

	$('#volume').text(parseInt(Math.round((nv * 100))) + '%')

	if(save)
	{
		localStorage.setItem('volume', nv)
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

	if(nv < 0.1)
	{
		nv = 0.1
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

		if(nv < 10)
		{
			nv = 10
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
				document.title = '(*) ' + document.title
				alert_mode = 1
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
			if(alert_mode === 1)
			{
				document.title = document.title.substring(4)
			}

			if(alert_mode !== 2)
			{
				document.title = '(!) ' + document.title
			}

			alert_mode = 2
		}
	}, 1000)
}

function remove_alert_title()
{
	if(alert_mode > 0)
	{
		document.title = document.title.substring(4)
		alert_mode = 0
	}
}

function update_topic_title()
{
	if(topic != '')
	{
		var i = document.title.indexOf(title_topic_separator)

		if(i !== -1)
		{
			document.title = (document.title.split(title_topic_separator)[0] + title_topic_separator + topic.substr(0, max_title_topic_length))
		}

		else
		{
			document.title = document.title + title_topic_separator + topic.substr(0, max_title_topic_length)
		}
	}
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
	var id = word_generator('cvcvcv')
	goto_room(id)
}

function copy_room_url()
{
	if(room === main_room)
	{
		var r = ''
	}

	else
	{
		var r = room
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

function goto_room(id, sametab=false)
{
	close_all_modals()

	id = clean_string4(id.substring(0, max_roomname_length))

	if(id !== main_room)
	{
		var nroom = '/' + id
	}

	else
	{
		var nroom = '/'
	}

	if(sametab)
	{
		window.location = nroom
	}

	else
	{
		window.open(nroom, '_blank')
	}
}

function refresh()
{
	window.location = window.location
}

function initial_volume()
{
	var volume = localStorage.getItem('volume')

	if(volume == null)
	{
		set_volume(0.8)
		localStorage.setItem('volume', 0.8)
	}

	else
	{
		set_volume(volume, false)
	}
}

function clear_chat()
{
	$('#chat_area').html('<div class="clear">&nbsp<br><br><br><br></div>')

	msgcount = 0

	show_intro()
	show_topic()
	show_priv()
	show_public()
	scroll_timer()
	focus_input()
}

function clear_input()
{
	$('#input').val("")
}

function add_to_input(what)
{
	$('#input').val($('#input').val() + what + ' ').focus()
}

function update_topic(t, setter)
{
	topic = t
	topic_setter = setter
	update_topic_title()
}

function claim_room(arg="")
{
	arg = arg.substring(0, 200)

	if(room === main_room && arg === '')
	{
		chat_announce('[', ']', "This room can\'t be claimed", 'small')
		return false
	}

	if(claimed && arg === '')
	{
		chat_announce('[', ']', "Room is already claimed", 'small')
		return false
	}

	socket.emit('claim_room', {pass:arg})
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

	socket.emit('claim_room', {pass:''})
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

	socket.emit('unclaim_room', {})
}

function get_room_keys()
{
	if(localStorage["room_keys"])
	{
		try
		{
			room_keys = JSON.parse(localStorage.getItem("room_keys"))
		}

		catch(err)
		{
			localStorage.removeItem("room_keys")
			room_keys = []
		}
	}

	else
	{
		room_keys = []
	}

	if(typeof room_keys === "object" && room_keys.length > 0)
	{
		for(var i=0; i<room_keys.length; i++)
		{
			if(room_keys[i][0] == room)
			{
				room_key = room_keys[i][1]
				return
			}
		}
	}

	else
	{
		room_keys = []
	}
}

function save_room_key(key)
{
	room_key = key

	if(typeof room_keys === "object" && room_keys.length > 0)
	{
		for(var i=0; i<room_keys.length; i++)
		{
			if(room_keys[i][0] == room)
			{
				room_keys.splice(i, 1)
				break
			}
		}	
	}

	room_keys.push([room, key])

	localStorage.setItem('room_keys', JSON.stringify(room_keys))
}

function get_user_keys()
{
	if(localStorage["user_keys"])
	{
		try
		{
			user_keys = JSON.parse(localStorage.getItem("user_keys"))
		}

		catch(err)
		{
			localStorage.removeItem("user_keys")
			user_keys = []
		}		
	}

	else
	{
		user_keys = []
	}

	if(typeof user_keys === "object" && user_keys.length > 0)
	{

	}

	else
	{
		user_keys = []
	}
}

function get_user_key(nck)
{
	for(var i=0; i<user_keys.length; i++)
	{
		if(user_keys[i][0] === nck)
		{
			return user_keys[i][1]
		}
	}
}

function save_user_key(key)
{
	if(typeof user_keys === "object" && user_keys.length > 0)
	{
		for(var i=0; i<user_keys.length; i++)
		{
			if(user_keys[i][0] === username)
			{
				user_keys.splice(i, 1)
				break
			}
		}	
	}

	user_keys.push([username, key])

	localStorage.setItem('user_keys', JSON.stringify(user_keys))
}

function check_firstime()
{
	if(!localStorage["firstime"])
	{
		help()
		localStorage.setItem('firstime', false)
	}
}

function change_priv(key)
{
	save_room_key(key)

	room_key = key

	if(room_key.startsWith('_key_'))
	{
		priv = 'admin'
	}

	else if(room_key.startsWith('_okey_'))
	{
		priv = 'op'
	}

	else if(room_key.startsWith('_vkey_'))
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
				chat_announce('[', ']', "Upload permission is already " + m, 'small')
				return false
			}			

			if(amodes.indexOf(m) !== -1)
			{
				socket.emit('change_upload_permission', {upload_permission:m})
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
				chat_announce('[', ']', "Chat permission is already " + m, 'small')
				return false
			}			

			if(amodes.indexOf(m) !== -1)
			{
				socket.emit('change_chat_permission', {chat_permission:m})
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
		var d = "You changed the upload permission to "
	}

	else
	{
		var d = data.username + " changed the upload permission to "
	}

	if(data.upload_permission === 1 && upload_permission !== 1)
	{
		s = d + "1. Anyone can upload images"
	}

	else if(data.upload_permission === 2 && upload_permission !== 2)
	{
		s = d + "2. Only voiced users and up can upload images"
	}

	else if(data.upload_permission === 3 && upload_permission !== 3)
	{
		s = d + "3. Only ops and up can upload images"
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
		var d = "You changed the chat permission to "
	}

	else
	{
		var d = data.username + " changed the chat permission to "
	}

	if(data.chat_permission === 1 && chat_permission !== 1)
	{
		s = d + "1. Anyone can chat"
	}

	else if(data.chat_permission === 2 && chat_permission !== 2)
	{
		s = d + "2. Only voiced users and up can chat"
	}

	else if(data.chat_permission === 3 && chat_permission !== 3)
	{
		s = d + "3. Only ops and up can chat"
	}

	if(s.length > 0)
	{
		chat_permission = data.chat_permission
		can_chat = check_chat_permission(priv)
		chat_announce('~', '~', s, 'small')
	}
}

function show_upload_permission()
{
	chat_announce('[', ']', "Upload permission: " + upload_permission, 'small')
}

function show_chat_permission()
{
	chat_announce('[', ']', "Chat permission: " + chat_permission, 'small')
}

function big_letter(s)
{
	return s.toUpperCase()[0]
}

function show_crew()
{
	var s = ""

	for(var user of userlist)
	{
		var nick = user[0]
		var priv = user[1]

		if(priv === "admin" || priv === "op")
		{
			s += `${priv_tag(priv)} ${nick}, `
		}

		else
		{
			break
		}
	}

	if(s.length > 0)
	{
		s = s.slice(0, -2)

		chat_announce('[', ']', `Crew: ${s}`, 'small')
	}
}

function show_users()
{
	var s = ""

	for(var user of userlist)
	{	
		var nick = user[0]
		var priv = user[1]

		s += `${priv_tag(priv)} ${nick}, `
	}

	if(s.length > 0)
	{
		s = s.slice(0, -2)

		chat_announce('[', ']', `Users: ${s}`, 'small')
	}
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

			socket.emit('voice', {username:nck})
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
		chat_announce('<<', '>>', data.image_uploader + ' uploaded an image', 'small')		
	}
}

function announce_voice(data)
{
	if(username === data.username2)
	{
		chat_announce('~', '~', data.username1 + ' gave you voice', 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', 'You gave voice to ' + data.username2, 'small')
	}

	else
	{
		chat_announce('~', '~', data.username1 + ' gave voice to ' + data.username2, 'small')
	}

	replace_priv_in_userlist(data.username2, 'voice')
}

function announce_op(data)
{
	if(username === data.username2)
	{
		chat_announce('~', '~', data.username1 + ' gave you op', 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', 'You gave op to ' + data.username2, 'small')
	}

	else
	{
		chat_announce('~', '~', data.username1 + ' gave op to ' + data.username2, 'small')
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

			socket.emit('strip', {username:nck})
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
		chat_announce('~', '~', data.username1 + ' removed all privileges from you', 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', 'You removed all privileges from ' + data.username2, 'small')
	}

	else
	{
		chat_announce('~', '~', data.username1 + ' removed all privileges from ' + data.username2, 'small')
	}

	replace_priv_in_userlist(data.username2, '')
}

function stripped()
{
	room_key = ''
	priv = ''
	check_permissions()
}

function announce_claim(data)
{
	claimed = true

	if(username === data.username)
	{
		chat_announce('~', '~', 'You have claimed this room. Check /help3 to learn about admin commands', 'small')
	}

	else
	{
		priv = ""
		check_permissions()
		chat_announce('~', '~', data.username + ' has claimed this room', 'small')
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
		chat_announce('~', '~', data.username + ' unclaimed the room', 'small')
	}

	claimed = false
	priv = ""
	upload_permission = 1
	chat_permission = 1
	is_public = true

	update_topic("", "")

	check_permissions()

	remove_privs_userlist()

	if(radiosrc !== "")

	if(radiosrc !== default_radiosrc)
	{
		setup_radio("")

		if($('#toggle_radio_text').html() === 'Stop Radio')
		{
			start_radio()
		}
	}
}

function announce_admin(data)
{
	if(username === data.username2)
	{
		chat_announce('~', '~', data.username1 + ' gave you admin', 'small', true)
	}

	else if(username === data.username1)
	{
		chat_announce('~', '~', 'You gave admin to ' + data.username2, 'small')
	}

	else
	{
		chat_announce('~', '~', data.username1 + ' gave admin to ' + data.username2, 'small')
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

			socket.emit('admin', {username:nck})
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

			socket.emit('op', {username:nck})
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

		socket.emit('make_private', {})
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

		socket.emit('make_public', {})
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
		var s = data.username + ' made the room private'
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
		var s = data.username + ' made the room public'
	}

	s += ". The room will appear in the public room list"
	
	chat_announce('~', '~', s, 'small')
}

function reserve()
{
	socket.emit('username_reserve', {})
}

function reserved(data)
{
	chat_announce('[', ']', 'You have reserved ' + username, 'small')
	save_user_key(data.key)
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

	if(key === undefined)
	{
		chat_announce('[', ']', "You don't seem to own that nickname", 'small')
		return false
	}

	socket.emit('username_recover', {username:nck, key:key})
}

function change_radiosrc(src)
{
	if(priv === 'admin' || priv === 'op')
	{
		src = clean_string2(src)

		if(src.length > 0 && src.length <= max_radiosrc_length)
		{
			socket.emit('change_radiosrc', {src:src})
		}
	}

	else
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
	}
}

function changed_radiosrc(data)
{
	setup_radio(data.src)

	if($('#toggle_radio_text').html() === 'Stop Radio')
	{
		start_radio()
	}

	if(data.src == '')
	{
		var name = 'default'
	}

	else
	{
		var name = data.src
	}

	if(data.username === username)
	{
		chat_announce('~', '~', 'You changed the radio to ' + name, 'small')		
	}

	else
	{
		chat_announce('~', '~', data.username + ' changed the radio to ' + name, 'small')
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

			socket.emit('ban', {username:nck})
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
		socket.emit('unbanall', {})
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
		socket.emit('unbanlast', {})
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
		socket.emit('bannedcount', {})
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

			socket.emit('kick', {username:nck})
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
		chat_announce('~', '~', data.username + ' unbanned all banned users', 'small')
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
		chat_announce('~', '~', data.username + ' unbanned the latest banned user', 'small')
	}
}

function isalready(who, what)
{
	if(what === 'voice')
	{
		chat_announce('[', ']', who + " already has voice", 'small')
	}

	else if(what === 'op')
	{
		chat_announce('[', ']', who + " is already an op", 'small')
	}

	else if(what === 'admin')
	{
		chat_announce('[', ']', who + " is already an admin", 'small')
	}

	else if(what === '')
	{
		chat_announce('[', ']', who + " already has no privileges", 'small')
	}
}

function forbiddenuser()
{
	chat_announce('[', ']', "That operation is forbidden on that user", 'small')
}

function search_in(site, q)
{
	var q = encodeURIComponent(q)

	if(site === 'google')
	{
		window.open('https://www.google.com/search?q=' + q, '_blank')
	}

	else if(site === 'soundcloud')
	{
		window.open('https://soundcloud.com/search?q=' + q, '_blank')
	}

	else if(site === 'youtube')
	{
		window.open('https://www.youtube.com/results?search_query=' + q, '_blank')
	}
}

function remove_voices()
{
	if(priv !== 'admin' && priv !== 'op')
	{
		chat_announce('[', ']', "You are not a room operator or admin", 'small')
		return false
	}

	socket.emit('remove_voices', {})
}

function remove_ops()
{
	if(priv !== 'admin')
	{
		chat_announce('[', ']', "You are not a room admin", 'small')
		return false
	}

	socket.emit('remove_ops', {})
}

function announce_removedvoices(data)
{
	if(username === data.username)
	{
		chat_announce('~', '~', 'You removed all voices', 'small')
	}

	else
	{
		chat_announce('~', '~', data.username + ' removed all voices', 'small')
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
		chat_announce('~', '~', data.username + ' removed all ops', 'small')
	}

	if(priv === 'op')
	{
		stripped()
	}

	remove_ops_userlist()
}

function kicked(data)
{
	removefrom_userlist(data.username)

	if(username === data.info1)
	{
		chat_announce('--', '--', data.username + ' was kicked by you', 'small')
	}

	else
	{
		chat_announce('--', '--', data.username + ' was kicked by ' + data.info1, 'small')
	}
}

function banned(data)
{
	removefrom_userlist(data.username)

	if(username === data.info1)
	{
		chat_announce('--', '--', data.username + ' was banned by you', 'small')
	}

	else
	{
		chat_announce('--', '--', data.username + ' was banned by ' + data.info1, 'small')
	}
}

function start_msg()
{
	if(settings.modal_color)
	{
		var msg_class = settings.modal_color
	}

	else
	{
		var msg_class = default_modal_color
	}

	var common = 
	{
		class: msg_class,
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

	msg_create_room = Msg
	(
		Object.assign({}, common,
		{	
			id: "create-room",
			after_create: function(instance)
			{
				after_modal_create(instance)
			},
			after_show: function(instance)
			{
				crm = true
				after_modal_show(instance)
				after_modal_set_or_show(instance)
			},
			after_set: function(instance)
			{
				after_modal_set_or_show(instance)
			},
			after_close: function(instance)
			{
				crm = false
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
	msg_create_room.set(template_create_room())
	msg_settings.set(template_settings())
	msg_userlist.set(template_userlist())
	msg_roomlist.set(template_roomlist())
	msg_played.set(template_played())
	msg_info.set(template_info())
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

	if(localStorage[ls_settings])
	{
		try
		{
			settings = JSON.parse(localStorage.getItem(ls_settings))
		}

		catch(err)
		{
			localStorage.removeItem(ls_settings)
			settings = {}
		}			
	}

	else
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
		settings.modal_color = "default"
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

function save_settings(key)
{
	localStorage.setItem(ls_settings, JSON.stringify(settings))
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
				ls_name: "room_nicknames",
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
				ls_name: "room_keys",
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
				ls_name: "user_keys",
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
		localStorage.removeItem(item.ls_name)
	}

	else
	{
		localStorage.setItem(item.ls_name, item.value)
	}

	if(item.ls_name === "room_nicknames")
	{
		reload_room_nicknames()
	}

	else if(item.ls_name === 'room_keys')
	{
		reload_room_keys()
	}

	else if(item.ls_name === "user_keys")
	{
		reload_user_keys()
	}

	else if(item.ls_name === ls_settings)
	{
		reload_settings()
	}

	if(!reset)
	{
		storageui.view()
		pup()
	}
}


function show_data()
{
	storageui.menu()
}

function reload_room_nicknames()
{
	get_room_nicknames()
}

function reload_room_keys()
{
	get_room_keys()
}

function reload_user_keys()
{
	get_user_keys()
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

function show_info(s)
{
	msg_info.set_or_show(s)
}