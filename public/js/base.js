var is_public
var room
var usernames
var username
var font_color = '#ffffff'
var background_color = '#000000'
var image_url = ''
var image_uploader = ''
var topic = ''
var dropzone
var colorThief
var played = []
var input_history = []
var input_history_index = 1
var usercount
var room_keys
var room_key = ''
var userlist = []
var nicknames = []
var user_passwords
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
var started = false
var connections = 0
var afk_timer
var afk = false
var alert_mode = 0
var alert_timer
var commands = []

function init()
{
	get_username()
	start_image_events()
	colorThief = new ColorThief()
	start_dropzone()
	start_volume_scroll()
	initial_volume()
	activate_window_visibility_listener()
	start_chat()
	get_keys()
	activate_key_detection()
	input_click_events()
	copypaste_events()
	main_menu_events()
	scroll_events()
	resize_events()
	register_commands()
	start_socket()
}

function get_username()
{
	var uname

	if(localStorage["usernames"])
	{
		usernames = JSON.parse(localStorage.getItem("usernames"))
	}

	else
	{
		usernames = []
	}

	if(typeof usernames === "object" && usernames.length > 0)
	{

	}

	else
	{
		usernames = []
	}

	for(var i=0; i<usernames.length; i++)
	{
		if(usernames[i][0] === room)
		{
			uname = usernames[i][1]
			break
		}
	}

	if(uname === undefined)
	{
		for(var i=0; i<usernames.length; i++)
		{
			if(usernames[i][0] === '/default')
			{
				uname = usernames[i][1]
				break
			}
		}
	}

	if(uname === undefined)
	{
		var keep_naming = true

		while(keep_naming)
		{
			uname = clean_string4(prompt('Pick your nickname').substring(0, 14))

			if(uname === null || uname.length < 1 || uname.indexOf('<') !== -1)
			{
				keep_naming = true
			}

			else
			{
				keep_naming = false
			}
		}

		save_username(uname)
		save_default_username(uname)
	}
	
	username = uname
}

function save_username(uname)
{
	if(typeof usernames === "object" && usernames.length > 0)
	{
		for(var i=0; i<usernames.length; i++)
		{
			if(usernames[i][0] === room)
			{
				usernames.splice(i, 1)
				break
			}
		}	
	}

	usernames.push([room, uname])

	localStorage.setItem('usernames', JSON.stringify(usernames))
}

function save_default_username(uname)
{
	if(typeof usernames === "object" && usernames.length > 0)
	{
		for(var i=0; i<usernames.length; i++)
		{
			if(usernames[i][0] === '/default')
			{
				usernames.splice(i, 1)
				break
			}
		}	
	}

	usernames.push(['/default', uname])

	localStorage.setItem('usernames', JSON.stringify(usernames))
}

function show_intro()
{
	chat_announce('', '', 'Welcome to ' + room + ', ' + username, 'big')
}

function show_reconnected()
{
	chat_announce('--', '--', 'Reconnected', 'small')
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
	chat_announce('', '', 'Up arrow scrolls up the chat.', 'small')
	chat_announce('', '', 'Down arrow scrolls down the chat.', 'small')
	chat_announce('', '', 'Shift + up arrow loads your last message in the input.', 'small')
	chat_announce('', '', 'Shift + down arrow goes to the bottom of the chat.', 'small')
	chat_announce('', '', 'Clicking on a nickname sends it to the input.', 'small')
	chat_announce('', '', 'Tab completes usernames and commands.', 'small')
	chat_announce('', '', '/defnick x: Changes your default nickname for rooms you visit for the first time.', 'small')
	chat_announce('', '', '/reserve: Reserves current nickname to be recoverable later.', 'small')
	chat_announce('', '', '/recover x: Recovers reserved nickname in case someone else in the room is using it.', 'small')
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
	show_permissions()
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
		chat_announce('', '', 'Topic: ' + topic, 'big')
	}

	else 
	{
		if(claimed)
		{
			chat_announce('', '', 'Topic: Room claimed. There is no topic set', 'big')
		}

		else
		{
			chat_announce('', '', 'Topic: Use /claim to get admin rights to this room', 'big')
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
			chat_announce('[', ']', 'Topic: Room claimed. There is no topic set', 'small')
		}

		else
		{
			chat_announce('[', ']', 'Topic: Use /claim to get admin rights to this room', 'small')
		}
	}
}

function check_priv(data)
{
	priv = data.priv
	show_priv()
	upload_permission = data.upload_permission
	chat_permission = data.chat_permission
	check_permissions()
	show_permissions()
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

	else if(priv === 'voice')
	{
		chat_announce('[', ']', 'You have voice in this room', 'small')
	}

	else if(priv === 'op')
	{
		chat_announce('[', ']', 'You are an op in this room', 'small')
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
			update_topic(data.topic)
			is_public = data.public
			change()

			if(connections === 1)
			{
				show_intro()
				show_topic()
				check_priv(data)
				show_public()
				check_firstime()
				get_passwords()
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
			window.location = window.location
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
			window.location = window.location
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

		if(item[1] === 'admin')
		{
			var p = '[A]'
		}

		else if(item[1] === 'op')
		{
			var p = '[O]'
		}

		else if(item[1] === 'voice')
		{
			var p = '[V]'
		}

		else
		{
			var p = ''
		}

		$($(h).find('.ui_item_priv').get(0)).text(p)
		$($(h).find('.ui_item_nick').get(0)).text(item[0])

		$(h).click({nickname:item[0]}, function(event)
		{
			add_to_input(event.data.nickname) 
			hide_boxes()
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
						name: "1. Anyone Can Chat",
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
						name: "1. Anyone Can Chat *",
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
						name: "2. Voiced Users And Up Can Chat",
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
						name: "2. Voiced Users And Up Can Chat *",
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
						name: "3. Ops And Up Can Chat",
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
						name: "3. Ops And Up Can Chat *",
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
						name: "1. Anyone Can Upload Images",
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
						name: "1. Anyone Can Upload Images *",
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
						name: "2. Voiced Users And Up Can Upload Images",
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
						name: "2. Voiced Users And Up Can Upload Images *",
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
						name: "3. Ops And Up Can Upload Images",
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
						name: "3. Ops And Up Can Upload Images *",
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
				name: "Search in Google", callback: function(key, opt)
				{
					search_in('google', $(this).data('q'))
				}
			},
			cmenu2: 
			{
				name: "Search in SoundCloud", callback: function(key, opt)
				{
					search_in('soundcloud', $(this).data('q'))
				}         
			},
			cmenu3: 
			{
				name: "Search in YouTube", callback: function(key, opt)
				{
					search_in('youtube', $(this).data('q'))
				}
			}
		}
	})
}

function update_roomlist(roomlist)
{	
	var s = $()

	s = s.add()

	for(var i=0; i<roomlist.length; i++)
	{
		var c = "<span class='roomlist_filler'></span><span class='roomlist_name'></span><span class='roomlist_count'></span><div class='roomlist_topic'></div>"
		var h = $("<div class='roomlist_item'>" + c + "</div><br>")

		$($(h).find('.roomlist_name').get(0)).text(roomlist[i][0])

		if(roomlist[i][0] === room)
		{
			var t = "(" + roomlist[i][2] + ") *"		
		}

		else
		{
			var t = "(" + roomlist[i][2] + ")"
		}

		$($(h).find('.roomlist_count').get(0)).text(t)		
		$($(h).find('.roomlist_filler').get(0)).text(t)

		$(h).click({room:roomlist[i][0]}, function(event)
		{
			goto_room(event.data.room, false)
		})

		if(roomlist[i][1].length > 0)
		{
			var topic = roomlist[i][1]
		}

		else 
		{
			var topic = 'No topic set'
		}

		$($(h).find('.roomlist_topic').get(0)).text(topic)

		s = s.add(h)
	}

	s = s.add('<br>')

	$('#roomlist').html(s)
}

function hide_overlay()
{
	$('#overlay').css('display', 'none')
}

function show_overlay()
{
	$('#overlay').css('display', 'block')
}

function hide_boxes()
{
	hide_userlist()
	hide_played()
	hide_menu()
	hide_roomlist()
	hide_createroom_menu()
}

function hide_userlist()
{
	$('#userlist').css('display', 'none')
	hide_overlay()
}

function hide_roomlist()
{
	$('#roomlist').css('display', 'none')
	hide_overlay()
}

function request_roomlist()
{
	socket.emit("roomlist", {})
}

function show_userlist()
{
	$('#userlist').css('display', 'block')
	$('#userlist').scrollTop(0)
	show_overlay()
}

function show_roomlist()
{
	hide_menu()
	$('#roomlist').css('display', 'block')
	$('#roomlist').scrollTop(0)
	show_overlay()
}

function toggle_userlist()
{
	if($('#userlist').css('display') === 'none')
	{
		show_userlist()
	}

	else 
	{
		hide_userlist()
	}
}

function hide_played()
{
	$('#played').css('display', 'none')
	hide_overlay()
}

function show_played()
{
	$('#played').css('display', 'block')
	$('#played').scrollTop(0)
	show_overlay()
}

function toggle_played()
{
	if($('#played').css('display') === 'none')
	{
		show_played()
	}

	else 
	{
		hide_played()
	}
}

function hide_menu()
{
	$('#menu').css('display', 'none')
	hide_overlay()
}

function show_menu()
{
	$('#menu').css('display', 'block')
	$('#menu').scrollTop(0)
	show_overlay()
}

function toggle_menu()
{
	if($('#menu').css('display') === 'none')
	{
		show_menu()
	}

	else 
	{
		hide_menu()
	}
}

function hide_createroom_menu()
{
	$('#createroom_input').val('')
	$('#createroom_menu').css('display', 'none')
	hide_overlay()
	crm = false
}

function show_createroom_menu()
{
	hide_menu()

	$('#createroom_menu').css('display', 'block').scrollTop(0)

	$('#createroom_input').focus()

	show_overlay()

	crm = true
}

function toggle_createroom_menu()
{
	if($('#createroom_menu').css('display') === 'none')
	{
		show_createroom_menu()
	}

	else 
	{
		hide_createroom_menu()
	}
}

function start_dropzone()
{
	dropzone = new Dropzone("body", 
	{ 
		url: "/",
		maxFiles: 1,
		maxFilesize: 5.5,
		autoProcessQueue: false,
		clickable: '#media_image',
		acceptedFiles: "image/jpeg,image/png,image/gif"
	})

	dropzone.on("addedfile", function(file) 
	{
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

		if(size > 5555)
		{
			dropzone.files = []
			chat_announce('[', ']', "File is too big", 'small')
			return false
		}

		var name = file.name

		var ext = name.split('.').pop()

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif' && ext !== 'JPG' && ext !== 'PNG' && ext !== 'JPEG' && ext !== 'GIF')
		{
			dropzone.files = []
			return false
		}

		var fr = new FileReader()

		fr.addEventListener("loadend", function() 
		{
		  dropzone.files = []
		  socket.emit("uploaded", {image_file:fr.result, name:file.name})
		  chat_announce("[", "]", "uploading...", "small")
		})

		fr.readAsArrayBuffer(file)
	})
}

function base64toBlob(b64Data, contentType, sliceSize) 
{
	contentType = contentType || ''
	sliceSize = sliceSize || 512

	var byteCharacters = atob(b64Data)
	var byteArrays = []

	for(var offset=0; offset<byteCharacters.length; offset+=sliceSize) 
	{
		var slice = byteCharacters.slice(offset, offset + sliceSize)

		var byteNumbers = new Array(slice.length)

		for(var i=0; i<slice.length; i++) 
		{
			byteNumbers[i] = slice.charCodeAt(i)
		}

		var byteArray = new Uint8Array(byteNumbers)

		byteArrays.push(byteArray)
	}

	var blob = new Blob(byteArrays, {type: contentType})

	return blob
}

function copypaste_events()
{
	$(document).bind('copy', function(e) 
	{
		if(window.getSelection().toString() != "")
		{
			pup()

			setTimeout(function()
			{
				window.getSelection().removeAllRanges()
				$('#input').focus()
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
			$('#createroom_input').focus()

			if(e.key === "Enter")
			{
				if(e.shiftKey)
				{
					toggle_radio()
					e.preventDefault()
					return
				}

				var arg = $('#createroom_input').val().substr(0, 35).trim()

				if(arg.length > 0)
				{
					goto_room(arg)
					hide_createroom_menu()
					e.preventDefault()
				}

				return
			}

			else if(e.key === "Escape")
			{
				if($('#createroom_input').val() === '')
				{
					hide_boxes()
					e.preventDefault()
					return
				}

				else
				{
					$('#createroom_input').val('')
					e.preventDefault()
					return
				}
			}			

			return
		}

		if(e.ctrlKey)
		{
			if(window.getSelection().toString() != "")
			{
				return
			}
		}

		$('#input').focus()

		if(e.key === "Enter")
		{
			if(e.shiftKey)
			{
				toggle_radio()
				e.preventDefault()
				return
			}

			var msg = clean_string2($('#input').val()).substring(0, max_input_length)

			send_to_chat(msg)

			e.preventDefault()

			return
		}

		else if(e.key === "ArrowUp")
		{
			if(e.shiftKey)
			{
				input_history_up()
			}

			else
			{
				var $ch = $('#chat_area')
				$ch.scrollTop($ch.scrollTop() - 100)
			}

			e.preventDefault()
			return
		}		

		else if(e.key === "ArrowDown")
		{	
			if(e.shiftKey)
			{
				goto_bottom(true)
			}

			else
			{
				var $ch = $('#chat_area')
				var max = $ch.prop('scrollHeight') - $ch.innerHeight()

				if(max - $ch.scrollTop < 100)
				{
					$ch.scrollTop(max + 10)
				}

				else
				{
					$ch.scrollTop($ch.scrollTop() + 100)
				}
			}

			e.preventDefault()
			return
		}

		else if(e.key === "Escape")
		{
			if(e.shiftKey)
			{
				clear_chat()
				e.preventDefault()
				return
			}

			else if($('#overlay').css('display') === 'block')
			{
				hide_boxes()
				e.preventDefault()
				return 
			}

			else
			{
				clear_input()
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

function input_history_up()
{
	var v = input_history[input_history.length - input_history_index]

	$('#input').val(v)

	input_history_index += 1

	if(input_history_index > input_history.length)
	{
		input_history_index = 1
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
			update_scrollbar()
			goto_bottom(true)
		}, 350)
	}
})()

function update_scrollbar()
{
	$('#chat_area').perfectScrollbar('update')
}

function update_chat(uname, msg)
{
	var date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")

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

	if(msg.startsWith('/me ') || msg.startsWith('/em '))
	{
		var fmsg = $("<div title='" + date + "' class='msg chat_message'>* <span class='chat_uname'></span> <span class='" + contclasses + "'></span> *</div><div class='sep1'>&nbsp</div>")
		$($(fmsg).find('.chat_content').get(0)).text(msg.substr(4)).urlize()
	}
	else
	{
		var fmsg = $("<div title='" + date + "' class='msg chat_message'><b><span class='chat_uname'></span>:</b>&nbsp&nbsp<span class='" + contclasses + "'></span></div><div class='sep1'>&nbsp</div>")
		$($(fmsg).find('.chat_content').get(0)).text(msg).urlize()
	}
	
	$($(fmsg).find('.chat_uname').get(0)).text(uname).click({uname:uname}, function(event)
	{
		add_to_input(event.data.uname)
	})

	add_to_chat(fmsg)

	add_msgcount()

	$('.chat_message').css('color', font_color)
	$('a').css('color', font_color)

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

			$('.dash').css('color', font_color)
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

		msgcount = els.length / 2

		els.slice(0, msgcount).remove()

		update_scrollbar()
	}
}

function self_check_images(msg)
{
	words = msg.split(' ')

	for(var i=0; i<words.length; i++)
	{
		var url = words[i].replace(/\.gifv/g,'.gif')

		if(words[i].indexOf('.jpg') !== -1 || words[i].indexOf('.png') !== -1 || words[i].indexOf('.jpeg') !== -1 || words[i].indexOf('.gif') !== -1 || words[i].indexOf('.JPG') !== -1 || words[i].indexOf('.PNG') !== -1 || words[i].indexOf('.JPEG') !== -1 || words[i].indexOf('.GIF') !== -1)
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
			var rgb = colorThief.getColor(this)

			background_color = rgbToHex(rgb)

			font_color = computeTextColor(rgb)

			$('body').css('background-color', background_color)
			$('#header').css('background-color', background_color)
			$('#chat_area').css('background-color', background_color)
			$('#media').css('background-color', background_color)
			$('#input').css('background-color', background_color)
			$('.ps-scrollbar-y').css('background-color', background_color)
			$('.header_item').css('color', font_color)
			$('.chat_message').css('color', font_color)
			$('.announcement').css('color', font_color)
			$('.dash').css('color', font_color)
			$('a').css('color', font_color)
			$('#input').css('color', font_color)
			$('#image_info').css('color', font_color)
	
			$('body').css('background-image', 'url(' + image_url + ')') 

			if($('body').css('background-repeat') === 'repeat')
			{
				$('body').css('background-size', 'cover')          
				$('body').css('background-repeat', 'no-repeat')
				$('body').css('background-position', 'center center')  
			}
		}

		catch(err){}

		if(image_uploader !== '' && image_url !== default_image_url)
		{
			$('#image_uploader').text('uploaded by ' + image_uploader)
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

function computeTextColor(rgb) 
{
	var r = rgb[0]
	var g = rgb[1]
	var b = rgb[2]
	var uicolors = [r / 255, g / 255, b / 255]

	var c = uicolors.map((c) => 
	{
		if (c <= 0.03928) 
		{
			return c / 12.92
		} 

		else 
		{
			return Math.pow((c + 0.055) / 1.055,2.4)
		}
	})

	var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

	return (L > 0.179) ? '#000000' : '#ffffff'
}

function rgbToHex(rgb) 
{
	return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)
}

function componentToHex(c) 
{
	var hex = c.toString(16)
	return hex.length == 1 ? "0" + hex : hex
}

function chat_announce(brk1, brk2, msg, size, dotted=false)
{
	var date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")

	var contclasses = "announcement_content"

	var regex = new RegExp("\\b" + username + "\\b")

	if(dotted === true)
	{
		contclasses += " dotted"

		alert_title2()
	}
	
	if(typeof dotted === "string")
	{
		var fmsg = $("<div title='" + date + "' class='msg announcement announcement_" + size + "'>" + brk1 + " <span class='" + contclasses + "'></span><span class='dotted'></span> " + brk2 + "</div><div class='sep1'>&nbsp</div>")
		$($(fmsg).find('.dotted').get(0)).text(dotted).urlize()
	}

	else
	{
		var fmsg = $("<div title='" + date + "' class='msg announcement announcement_" + size + "'>" + brk1 + " <span class='" + contclasses + "'></span> " + brk2 + "</div><div class='sep1'>&nbsp</div>")
	}

	$($(fmsg).find('.announcement_content').get(0)).text(msg).urlize()

	add_to_chat(fmsg)

	add_msgcount()

	$('.announcement').css('color', font_color)
	$('a').css('color', font_color)

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
	return s.replace(/\/+/g, '').replace(/\s+/g, ' ').trim()
}

function chat_urlize(msg)
{
	return msg.replace(/[^\s"\\]+\.\w{2,}[^\s"\\]*/g, '<a class="chat" target="_blank" href="$&">$&</a>')
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
	commands.push('/upload_permission')
	commands.push('/chat_permission')
	commands.push('/permissions')
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
	commands.push('/room')
	commands.push('/goto')
	commands.push('/help3')
	commands.push('/help2')
	commands.push('/help')
	commands.push('/stopradio')
	commands.push('/startradio')
	commands.push('/volume')
}

function send_to_chat(msg)
{
	if(msg_is_ok(msg))
	{
		input_history_index = 1

		for(var i=0; i<input_history.length; i++)
		{
			if(input_history[i] === msg)
			{
				input_history.splice(i, 1)
				break
			}
		}

		if(input_history.length > 5)
		{
			input_history.shift()
		}

		input_history.push(msg)

		if(msg[0] === '/' && !msg.startsWith('/me ') && !msg.startsWith('/em ') && !msg.startsWith('//'))
		{
			var a = msg.toLowerCase().split(' ')

			var lmsg = a[0].split('').sort().join('')

			if(a.length > 1)
			{
				lmsg += ' '
			}

			if(oiStartsWith(lmsg, '/nick'))
			{
				var arg = msg.substr(6,14)
				change_nickname(arg)
			}

			else if(oiEquals(lmsg, '/nick'))
			{
				show_nickname()
			}

			else if(oiStartsWith(lmsg, '/defnick'))
			{
				var arg = msg.substr(9,14)
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
				var arg = msg.substr(7,40).trim()
				claim_room(arg)
			}

			else if(oiEquals(lmsg, '/claim'))
			{
				claim_room('')
			}

			else if(oiEquals(lmsg, '/reclaim'))
			{
				reclaim_room()
			}

			else if(oiStartsWith(lmsg, '/upload_permission'))
			{
				var arg = msg.substr(19,2).trim()
				change_upload_permission(arg)
			}

			else if(oiStartsWith(lmsg, '/chat_permission'))
			{
				var arg = msg.substr(17,2).trim()
				change_chat_permission(arg)
			}

			else if(oiEquals(lmsg, '/permissions'))
			{
				show_permissions()
			}

			else if(oiEquals(lmsg, '/priv'))
			{
				show_priv()
			}

			else if(oiStartsWith(lmsg, '/voice'))
			{
				var arg = msg.substr(7,20).trim()
				voice(arg)
			}

			else if(oiStartsWith(lmsg, '/op'))
			{
				var arg = msg.substr(4,20).trim()
				op(arg)
			}

			else if(oiStartsWith(lmsg, '/admin'))
			{
				var arg = msg.substr(7,20).trim()
				admin(arg)
			}

			else if(oiStartsWith(lmsg, '/strip'))
			{
				var arg = msg.substr(7,20).trim()
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
				var arg = msg.substr(5,20).trim()
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
				var arg = msg.substr(6,20).trim()
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
				var arg = msg.substr(7, 200).trim()
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
				var arg = msg.substr(9, 20)
				recover(arg)
			}

			else if(oiEquals(lmsg, '/status'))
			{
				show_status()
			}

			else if(oiStartsWith(lmsg, '/topic'))
			{
				var arg = msg.substr(7, max_topic_length)

				if(arg.length > 0)
				{
					change_topic(arg)
				}
			}

			else if(oiStartsWith(lmsg, '/topicadd'))
			{
				var arg = msg.substr(10, (max_topic_length - 3) - topic.length).trim()
				topicadd(arg)
			}

			else if(oiStartsWith(lmsg, '/topictrim'))
			{
				var arg = msg.substr(11, 11)
				topictrim(arg)
			}

			else if(oiEquals(lmsg, '/topictrim'))
			{
				topictrim(1)
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
				arg = msg.substr(6, 35).trim()
				goto_room(arg, false)
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
				arg = msg.substr(8,5).trim()
				change_volume_command(arg)
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
		if(topic != dtopic)
		{
			socket.emit('topic_change', {topic:dtopic})
		}

		else
		{
			chat_announce('[', ']', "Topic is already set to that", 'small')
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
		if(arg.length > 0 && (topic.length + arg.length + 3) <= 1200)
		{
			change_topic(topic + ' - ' + arg)
		}

		else
		{
			chat_announce('[', ']', "There is no more room to add that to the topic", 'small')
		}
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
		var split = topic.split(' - ')

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
				var t = split.slice(0, -n).join(' - ')

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
			if(data.topic.startsWith(topic + ' - '))
			{
				if(highlight)
				{
					chat_announce('~', '~', 'You added to the topic: ' + data.topic, 'small', highlight)
				}

				else
				{
					chat_announce('~', '~', 'You added to the topic: ' + topic + ' - ', 'small', data.topic.substr(topic.length + 3))
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
			if(data.topic.startsWith(topic + ' - '))
			{
				if(highlight)
				{
					chat_announce('~', '~', data.username + ' added to the topic: ' + data.topic, 'small', highlight)
				}

				else
				{
					chat_announce('~', '~', data.username + ' added to the topic: ' + topic + ' - ', 'small', data.topic.substr(topic.length + 3))
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

		update_topic(data.topic)
	}
}

function change_nickname(nck)
{
	if(can_chat)
	{
		nck = clean_string4(nck)
		
		if(nck.length > 0 && nck.length <= 20)
		{
			if(nck === username)
			{
				chat_announce('[', ']', "That's already your nickname", 'small')
				return false
			}

			save_username(nck)

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
	save_default_username(nck)
	chat_announce('[', ']', "Default nickname changed to " + nck, 'small')
}

function show_default_nickname()
{
	for(var i=0; i<usernames.length; i++)
	{
		if(usernames[i][0] === '/default')
		{
			chat_announce('[', ']', 'Default Nickname: ' + usernames[i][1], 'small')
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

function start_chat()
{
	$('#chat_area').append('<br><br><br><div class="clear">&nbsp</div>')
	$('#input').focus()

	$('#chat_area').perfectScrollbar(
	{
		minScrollbarLength: 50
	})

	goto_bottom(true)
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

					var s = source.title + " - " + source.artist

					var q = '"' + source.title + '" by "' + source.artist + '"'
					
					$('#now_playing').text(s)

					$('#now_playing_area').data('q', q)

					if(played[played.length - 1] !== s)
					{
						var date = dateFormat(Date.now(), "dddd, mmmm dS, yyyy, h:MM:ss TT")
						
						var pi = "<span class='pititle'></span><br><span class='piartist'></span>"
						
						h = $("<div title='" + date + "' class='played_item'>" + pi + "</div><br>")
						
						$($(h).find('.pititle').get(0)).text(source.title)
						$($(h).find('.piartist').get(0)).text("by " + source.artist)

						$(h).data('q', q)

						$(h).click(function()
						{
							search_in('google', $(this).data('q'))
						})
						
						$('#played').prepend(h)

						push_played(s)
					}
						
					show_nowplaying()
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

function push_played(pi)
{
	played.push(pi)

	if(played.length >= 200)
	{
		played.splice(0, 100)

		var els = $('#played').children()

		els.slice(els.length / 2).remove()

		$('#played').append('<br>')

		if(!$($('#played').children().get($('#played').children().length - 2)).is("br"))
		{
			$('#played').append('<br>')
		}
	}
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
		var i = document.title.indexOf(' - ')

		if(i != -1)
		{
			document.title = (document.title.split(' - ')[0] + ' - ' + topic.substr(0,140))
		}

		else
		{
			document.title = document.title + ' - ' + topic.substr(0,140)
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

			update_scrollbar()
		}
	}, false)
}

function random_room()
{
	var id = word_generator('cvcvcv')
	goto_room(id, false)
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
	var textareaEl = document.createElement('textarea')
	document.body.appendChild(textareaEl)
	textareaEl.value = url
	textareaEl.select()
	document.execCommand('copy')
	document.body.removeChild(textareaEl)
	pup()
	hide_boxes()
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

function goto_room(id, sametab)
{
	hide_boxes()

	if(sametab)
	{
		window.location = '/' + id
	}

	else
	{
		window.open('/' + id, '_blank')
	}
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
	$('#chat_area').html('<br><br><br><div class="clear">&nbsp</div>')

	show_intro()
	show_topic()
	show_priv()
	show_permissions()
	show_public()
	scroll_timer()

	msgcount = 0
}

function clear_input()
{
	$('#input').val("")
}

function add_to_input(what)
{
	$('#input').val($('#input').val() + what + ' ').focus()
}

function update_topic(t)
{
	topic = t
	update_topic_title()
}

function claim_room(arg)
{
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

function get_keys()
{
	if(localStorage["room_keys"])
	{
		room_keys = JSON.parse(localStorage.getItem("room_keys"))
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

function save_key(key)
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

function get_passwords()
{
	if(localStorage["user_passwords"])
	{
		user_passwords = JSON.parse(localStorage.getItem("user_passwords"))
	}

	else
	{
		user_passwords = []
	}

	if(typeof user_passwords === "object" && user_passwords.length > 0)
	{

	}

	else
	{
		user_passwords = []
	}
}

function get_user_password(nck)
{
	for(var i=0; i<user_passwords.length; i++)
	{
		if(user_passwords[i][0] === nck)
		{
			return user_passwords[i][1]
		}
	}
}

function save_password(password)
{
	if(typeof user_passwords === "object" && user_passwords.length > 0)
	{
		for(var i=0; i<user_passwords.length; i++)
		{
			if(user_passwords[i][0] === username)
			{
				user_passwords.splice(i, 1)
				break
			}
		}	
	}

	user_passwords.push([username, password])

	localStorage.setItem('user_passwords', JSON.stringify(user_passwords))
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
	save_key(key)

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

function show_permissions()
{
	if(can_chat)
	{
		chat_announce('[', ']', "You have chat permission", 'small')
	}

	if(can_upload)
	{
		chat_announce('[', ']', "You have upload permission", 'small')
	}
}

function voice(nck)
{
	if(priv === 'admin' || priv === 'op')
	{
		if(nck.length > 0 && nck.length <= 20)
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
		if(nck.length > 0 && nck.length <= 20)
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
	if(typeof room_keys === "object" && room_keys.length > 0)
	{
		for(var i=0; i<room_keys.length; i++)
		{
			if(room_keys[i][0] === room)
			{
				room_keys.splice(i, 1)
				localStorage.setItem('room_keys', JSON.stringify(room_keys))
				break
			}
		}
	}

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
		save_key("")
		check_permissions()
		chat_announce('~', '~', data.username + ' has claimed this room', 'small')
	}
	
	replace_claim_userlist(data.username)
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
		if(nck.length > 0 && nck.length <= 20)
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
		if(nck.length > 0 && nck.length <= 20)
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
	save_password(data.password)
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

	var passwd = get_user_password(nck)

	if(passwd === undefined)
	{
		chat_announce('[', ']', "You don't seem to own that nickname", 'small')
		return false
	}

	socket.emit('username_recover', {username:nck, password:passwd})
}

function change_radiosrc(src)
{
	if(priv === 'admin' || priv === 'op')
	{
		src = clean_string2(src)

		if(src.length > 0)
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
		if(nck.length > 0 && nck.length <= 20)
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
		if(nck.length > 0 && nck.length <= 20)
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