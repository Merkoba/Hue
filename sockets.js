const fs = require('fs')
const path = require('path')
const {exec} = require('child_process')
const shell = require('shelljs/global')
const antiSpam  = require('socket-anti-spam')
const mongo = require('mongodb')
const fetch = require('node-fetch')
const config = require('./config.json')
const sconfig = require('./config.secret.json')
const images_root = path.join(__dirname, config.images_directory)

var db
var last_roomlist
var roomlist_lastget = 0

mongo.connect(config.mongodb_path, function(err, database) 
{
	if(err)
	{
		console.error(err) 
	}

	else
	{
		db = database
	}
})

module.exports = function(io)
{
	antiSpam.init(
	{
		banTime: config.antispam_banTime, // Ban time in minutes 
		kickThreshold: config.antispam_kickThreshold, // User gets kicked after this many spam score 
		kickTimesBeforeBan: config.antispam_kickTimesBeforeBan, // User gets banned after this many kicks 
		banning: config.antispam_banning, // Uses temp IP banning after kickTimesBeforeBan 
		heartBeatStale: config.antispam_heartBeatStale, // Removes a heartbeat after this many seconds 
		heartBeatCheck: config.antispam_heartBeatCheck, // Checks a heartbeat per this many seconds 
		io: io // Bind the socket.io variable 
	})

	antiSpam.event.on('ban', function(socket, data)
	{
		socket.kickd = true
		socket.info1 = "the anti-spam system"
		socket.disconnect()
	})

	io.on("connection", function(socket)
	{
		try
		{
			connection(socket)
		}

		catch(err)
		{
			console.error(err)
		}

		socket.on('join_room', function(data) 
		{
			try
			{
				join_room(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('sendchat', function(data) 
		{
			try
			{
				sendchat(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('pasted', function(data) 
		{
			try
			{
				pasted(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('uploaded', function(data) 
		{
			try
			{
				uploaded(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('username_change', function(data) 
		{
			try
			{
				username_change(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('username_reserve', function(data) 
		{
			try
			{
				username_reserve(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('username_unreserve', function(data) 
		{
			try
			{
				username_unreserve(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('username_recover', function(data) 
		{
			try
			{
				username_recover(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('topic_change', function(data) 
		{
			try
			{
				topic_change(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('roomlist', function(data) 
		{
			try
			{
				roomlist(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('heartbeat', function(data) 
		{
			try
			{
				heartbeat(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('claim_room', function(data) 
		{
			try
			{
				claim_room(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('unclaim_room', function(data) 
		{
			try
			{
				unclaim_room(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('voice', function(data) 
		{
			try
			{
				voice(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('op', function(data) 
		{
			try
			{
				op(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('admin', function(data) 
		{
			try
			{
				admin(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('strip', function(data) 
		{
			try
			{
				strip(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('remove_voices', function(data) 
		{
			try
			{
				remove_voices(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('remove_ops', function(data) 
		{
			try
			{
				remove_ops(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('ban', function(data) 
		{
			try
			{
				ban(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('unbanall', function(data) 
		{
			try
			{
				unbanall(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('unbanlast', function(data) 
		{
			try
			{
				unbanlast(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('bannedcount', function(data) 
		{
			try
			{
				bannedcount(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('kick', function(data) 
		{
			try
			{
				kick(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_upload_permission', function(data) 
		{
			try
			{
				change_upload_permission(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_chat_permission', function(data) 
		{
			try
			{
				change_chat_permission(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_radio_permission', function(data) 
		{
			try
			{
				change_radio_permission(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('make_private', function(data) 
		{
			try
			{
				make_private(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('make_public', function(data) 
		{
			try
			{
				make_public(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_radio_source', function(data) 
		{
			try
			{
				change_radio_source(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('disconnect', function(reason)
		{
			reason = reason.toLowerCase()

			if(reason.indexOf('timeout') !== -1)
			{
				socket.pingd = true
			}

			try
			{
				disconnect(socket)
			}

			catch(err)
			{
				console.error(err)
			}
		})
	})

	// Socket Functions

	function connection(socket)
	{
		if(db === undefined)
		{
			socket.disconnect()
			return false
		}

		socket.kickd = false
		socket.bannd = false		
	}

	function join_room(socket, data)
	{
		if(data.username === undefined || data.room === undefined || data.key === undefined)
		{
			socket.disconnect()
			return false
		}

		if(data.username.length === 0 || data.room.length === 0)
		{
			socket.disconnect()
			return false
		}

		if(data.username.length > config.max_username_length)
		{
			socket.disconnect()
			return false
		}

		if(data.room.length > config.max_roomname_length)
		{
			socket.disconnect()
			return false
		}

		if(data.room.length !== clean_string4(data.room).length)
		{
			socket.disconnect()
			return false
		}

		get_roominfo(data.room, {}, function(info)
		{
			var bans = info.bans.split(';')

			socket.ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress

			for(var i=0; i<bans.length; i++)
			{
				if(bans[i] === socket.ip)
				{
					socket.disconnect()
					return false
				}
			}

			socket.room = data.room
			socket.join(socket.room)

			socket.priv = ''
			socket.key = ''

			if(info.keys !== '' && data.key !== '')
			{
				var skeys = info.keys.split(';')

				if(skeys.indexOf(data.key) !== -1)
				{
					socket.key = data.key

					if(data.key.startsWith('_key_'))
					{
						socket.priv = 'admin'
					}

					else if(data.key.startsWith('_okey_'))
					{
						socket.priv = 'op'
					}

					else if(data.key.startsWith('_vkey_'))
					{
						socket.priv = 'voice'
					}
				}
			}

			socket.username = make_username_unique(data.username, get_usernames(socket.room))
			
			socket.emit('update', 
			{
				type: 'username', 
				room: socket.room, 
				username: socket.username, 
				image_url: info.image_url, 
				image_uploader: info.image_uploader, 
				image_size: info.image_size, 
				image_date: info.image_date, 
				topic: info.topic, 
				topic_setter: info.topic_setter,
				topic_date: info.topic_date,
				userlist: get_userlist(socket.room), 
				priv: socket.priv, 
				upload_permission: info.upload_permission, 
				chat_permission: info.chat_permission, 
				radio_permission: info.radio_permission, 
				public: info.public,
				radio_type: info.radio_type,
				radio_source: info.radio_source,
				radio_title: info.radio_title,
				radio_setter: info.radio_setter, 
				radio_date: info.radio_date, 
				claimed: info.claimed
			})

			socket.broadcast.in(socket.room).emit('update',
			{
				type: 'userjoin',
				usercount: get_usercount(socket.room),
				username: socket.username,
				priv: socket.priv
			})
		})
	}

	function sendchat(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.msg === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.msg.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(data.msg.length > config.max_input_length)
			{
				socket.disconnect()
				return
			}

			if(data.msg.length !== clean_string2(data.msg).length)
			{
				socket.disconnect()
				return
			}

			get_roominfo(socket.room, {chat_permission:true}, function(info)
			{
				if(!check_permission(info.chat_permission, socket.priv))
				{
					return false
				}

				socket.broadcast.in(socket.room).emit('update', {type:'chat_msg', username:socket.username, msg:data.msg})

				db.collection('rooms').update({_id:info._id}, {$set:{modified:Date.now()}})
			})
		}
	}

	function pasted(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.image_url === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.image_url.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(data.image_url.length > config.max_input_length)
			{
				socket.disconnect()
				return false
			}		    

			get_roominfo(socket.room, {upload_permission:true}, function(info)
			{
				if(!check_permission(info.upload_permission, socket.priv))
				{
					return false
				}	

				data.image_url = data.image_url.replace(/\s/g,'').replace(/\.gifv/g,'.gif')

				var clean = check_image_url(data.image_url)

				if(clean)
				{
					var fname = `${info._id}_${Date.now()}_${get_random_int(0, 1000)}.${data.image_url.split('.').pop(-1)}`
					
					exec(`wget -O ${images_root}/${fname} -q "${data.image_url}"`, function(status, output)
					{
						exec(`stat -c '%s' ${images_root}/${fname}`, function(status, output) 
						{
							output = parseInt(output) / 1024

							if(output > 0 && (output <= config.max_image_size))
							{
								change_image(socket.room, fname, socket.username, output)
							}

							else
							{
								exec(`rm -f ${images_root}/${fname}`)

								socket.emit('update', {room:socket.room, type:'upload_error'})								
							}
						})
					})
				}
			})
		}
	}

	function uploaded(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.image_file === undefined)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {upload_permission:true}, function(info)
			{
				if(!check_permission(info.upload_permission, socket.priv))
				{
					return false
				}

				var size = data.image_file.toString('ascii').length / 1024

				if(size === 0 || (size > config.max_image_size))
				{
					socket.emit('update', {room:socket.room, type:'upload_error'})													
					return false
				}

				data.name = data.name.replace(/\s/g, '')

				var clean = check_image_url(data.name)

				if(clean)
				{
					var fname = `${info._id}_${Date.now()}_${get_random_int(0, 1000)}.${data.name.split('.').pop(-1)}`

					fs.writeFile(images_root + '/' + fname, data.image_file, function (err,data) 
					{
						if(err) 
						{
							socket.emit('update', {room:socket.room, type:'upload_error'})
						}

						else 
						{
							change_image(socket.room, fname, socket.username, size)
						}
					})
				}
			})
		}
	}

	function username_change(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length > config.max_username_length)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length !== clean_string4(data.username).length)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {chat_permission:true}, function(info)
			{
				if(!check_permission(info.chat_permission, socket.priv))
				{
					return false
				}

				var usernames = get_usernames(socket.room)

				for(var i=0; i<usernames.length; i++)
				{
					if(usernames[i] == socket.username)
					{
						var old_username = usernames[i]
						socket.username = make_username_unique(data.username, usernames)
						io.sockets.in(socket.room).emit('update', {type:'new_username', username:socket.username, old_username:old_username})
						return
					}
				}
			})
		}
	}

	function username_reserve(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.key === undefined)
			{
				socket.disconnect()
				return false
			}

			get_userinfo(socket.username, function(userinfo)
			{
				if(userinfo.key === '' || userinfo.key === data.key || data.pass === sconfig.secretpass)
				{
					if(userinfo.key !== '' && userinfo.key === data.key)
					{
						var updated = true
					}

					else
					{
						var updated = false
					}

					userinfo.key = get_random_ukey()

					socket.emit('update', {room:socket.room, type:'reserved', username:userinfo.username, key:userinfo.key, updated:updated})

					db.collection('users').update({_id:userinfo._id}, {$set:{key:userinfo.key}})
				}

				else
				{
					socket.emit('update', {room:socket.room, type:'alreadyreserved'})
				}
			})
		}
	}

	function username_unreserve(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.key === undefined)
			{
				socket.disconnect()
				return false
			}

			get_userinfo(socket.username, function(userinfo)
			{
				if(userinfo.key !== '' && userinfo.key === data.key)
				{
					userinfo.key = ''

					socket.emit('update', {room:socket.room, type:'unreserved', username:userinfo.username})

					db.collection('users').update({_id:userinfo._id}, {$set:{key:userinfo.key}})
				}

				else
				{
					socket.emit('update', {room:socket.room, type:'couldnotrecover'})
				}
			})
		}
	}

	function username_recover(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined || data.key === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0 || data.key.length === 0)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {chat_permission:true}, function(info)
			{
				if(!check_permission(info.chat_permission, socket.priv))
				{
					return false
				}

				if(socket.username === data.username)
				{
					return false
				}

				get_userinfo(data.username, function(userinfo)
				{
					if(userinfo.key !== '' && userinfo.key === data.key)
					{
						var sockets = io.sockets.adapter.rooms[socket.room].sockets

						var keys = Object.keys(sockets)

						for(var i=0; i<keys.length; i++)
						{
							var sckt = io.sockets.connected[keys[i]]

							if(sckt.username === data.username)
							{
								sckt.username = make_username_unique('user', get_usernames(socket.room))
								io.sockets.in(socket.room).emit('update', {type:'new_username', username:sckt.username, old_username:data.username})
								break
							}
						}

						var old_username = socket.username
						socket.username = data.username

						io.sockets.in(socket.room).emit('update', {type:'new_username', username:socket.username, old_username:old_username})
					}

					else
					{
						socket.emit('update', {room:socket.room, type:'couldnotrecover'})
					}	
				})
			})
		}
	}

	function topic_change(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.topic === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.topic.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(data.topic.length > config.max_topic_length)
			{
				socket.disconnect()
				return false
			}

			if(data.topic.length !== clean_string2(data.topic).length)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {topic:true}, function(info)
			{
				var new_topic = data.topic

				if(new_topic !== info.topic)
				{
					info.topic = new_topic
					info.topic_setter = socket.username
					info.topic_date = Date.now()

					io.sockets.in(socket.room).emit('update', 
					{
						type: 'topic_change',
						topic: info.topic,
						topic_setter: info.topic_setter,
						topic_date: info.topic_date
					})
					
					db.collection('rooms').update({_id:info._id}, {$set:
					{
						topic: info.topic,
						topic_setter: info.topic_setter,
						topic_date: info.topic_date,
						modified: Date.now()
					}})
				}
			})
		}
	}

	function roomlist(socket, data)
	{
		if(socket.username !== undefined)
		{
			get_roomlist(function(rooms)
			{
				socket.emit('update', {room:socket.room, type:'roomlist', roomlist:rooms})
			})
		}		
	}

	function heartbeat(socket, data)
	{
		if(socket.username === undefined)
		{
			socket.emit('update', {room:socket.room, type:'connection_lost'})
		}		
	}

	function claim_room(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.room === config.main_room && data.pass !== sconfig.secretpass)
			{
				return false
			}

			get_roominfo(socket.room, {claimed:true}, function(info)
			{
				if(!info.claimed || socket.priv === 'admin' || data.pass === sconfig.secretpass)
				{
					socket.key = get_random_key()

					if(socket.priv === 'admin')
					{
						var updated = true
					}

					else
					{
						var updated = false
					}	

					var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

					for(var i=0; i<ids.length; i++)
					{
						var socc = io.sockets.connected[ids[i]]
						socc.priv = ''
					}

					socket.priv = 'admin'
					
					socket.emit('update', {room:socket.room, type:'get_key', key:socket.key})

					io.sockets.in(socket.room).emit('update', {type:'announce_claim', username:socket.username, updated:updated})

					db.collection('rooms').update({_id:info._id}, {$set:{keys:socket.key, claimed:true, modified:Date.now()}})
				}
			})
		}		
	}

	function unclaim_room(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return false
			}

			get_roominfo(socket.room, {claimed:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]
					socc.priv = ''
				}

				io.sockets.in(socket.room).emit('update', {type:'announce_unclaim', username:socket.username})

				db.collection('rooms').update({_id:info._id}, {$set:
				{
					keys: '', 
					claimed: false, 
					topic:'',
					topic_setter: '',
					topic_date: 0,
					upload_permission: 1,
					chat_permission: 1,
					radio_source: '',
					radio_setter: '',
					radio_date: '',
					bans: '',
					public: true,
					modified: Date.now()
				}})
			})
		}		
	}

	function voice(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(socket.username === data.username)
			{
				return false
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === 'voice')
						{
							socket.emit('update', {room:socket.room, type:'isalready', what:'voice', who:data.username})
							return false
						}

						socc.priv = 'voice'

						var repkey = replace_key(socc.priv, socc.key, info.keys)

						socc.key = repkey.key
						info.keys = repkey.keys

						io.to(ids[i]).emit('update', {type:'get_key', key:socc.key})
						io.sockets.in(socket.room).emit('update', {type:'announce_voice', username1:socket.username, username2:data.username})

						db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}})

						break
					}
				}
			})
		}		
	}

	function op(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return false
			}

			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if(socc.priv === 'op')
						{
							socket.emit('update', {room:socket.room, type:'isalready', what:'op', who:data.username})
							return false
						}

						socc.priv = 'op'

						var repkey = replace_key(socc.priv, socc.key, info.keys)

						socc.key = repkey.key
						info.keys = repkey.keys

						io.to(ids[i]).emit('update', {type:'get_key', key:socc.key})
						io.sockets.in(socket.room).emit('update', {type:'announce_op', username1:socket.username, username2:data.username})

						db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}})								

						break
					}
				}
			})
		}		
	}

	function admin(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return false
			}

			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if(socc.priv === 'admin')
						{
							socket.emit('update', {room:socket.room, type:'isalready', what:'admin', who:data.username})
							return false
						}

						socc.priv = 'admin'

						var repkey = replace_key(socc.priv, socc.key, info.keys)

						socc.key = repkey.key
						info.keys = repkey.keys

						io.to(ids[i]).emit('update', {type:'get_key', key:socc.key})
						io.sockets.in(socket.room).emit('update', {type:'announce_admin', username1:socket.username, username2:data.username})

						db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}})																

						break
					}
				}
			})
		}		
	}

	function strip(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}
					
			if(socket.username === data.username)
			{
				return false
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === '')
						{
							socket.emit('update', {room:socket.room, type:'isalready', what:'', who:data.username})
							return false
						}

						socc.priv = ''

						if(socc.key !== '')
						{
							info.keys = remove_key(socc.key, info.keys)
							socc.key = ''
						}

						io.sockets.in(socket.room).emit('update', {type:'announce_strip', username1:socket.username, username2:data.username})

						db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}})																

						break
					}
				}
			})
		}		
	}

	function remove_voices(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				var key_array = info.keys.split(';')

				var filtered_array = key_array.filter(function(item) 
				{
					return item.indexOf('_vkey_') !== 0
				})

				if(key_array.length === filtered_array.length)
				{
					socket.emit('update', {room:socket.room, type:'nothingtoremove'})
					return false
				}

				info.keys = filtered_array.join(';')

				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.priv === 'voice')
					{
						socc.priv = ''
					}
				}
				
				io.sockets.in(socket.room).emit('update', {type:'announce_removedvoices', username:socket.username})

				db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}})
			})
		}		
	}

	function remove_ops(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return false
			}

			get_roominfo(socket.room, {keys:true}, function(info)
			{
				var key_array = info.keys.split(';')

				var filtered_array = key_array.filter(function(item) 
				{
					return item.indexOf('_okey_') !== 0
				})

				if(key_array.length === filtered_array.length)
				{
					socket.emit('update', {room:socket.room, type:'nothingtoremove'})
					return false
				}

				info.keys = filtered_array.join(';')

				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.priv === 'op')
					{
						socc.priv = ''
					}
				}
				
				io.sockets.in(socket.room).emit('update', {type:'announce_removedops', username:socket.username})

				db.collection('rooms').update({_id:info._id}, {$set:{keys:info.keys}})
			})
		}
	}

	function ban(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {bans:true, keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room, type:'forbiddenuser'})
							return false
						}

						if(socc.ip === undefined)
						{
							return false
						}

						if(socc.ip.indexOf('127.0.0.1') !== -1)
						{
							return false
						}

						var bans = info.bans.split(';')

						for(var i=0; i<bans.length; i++)
						{
							if(bans[i] === socc.ip)
							{
								return false
							}
						}

						if(bans === "")
						{
							info.bans = socc.ip
						}

						else
						{
							info.bans += ";" + socc.ip
						}

						for(var j=0; j<ids.length; j++)
						{
							var sokk = io.sockets.connected[ids[j]]

							if(socc.ip === sokk.ip)
							{
								if((sokk.priv === 'admin' || sokk.priv === 'op') && socket.priv !== 'admin')
								{
									continue
								}

								if(sokk.username === socket.username)
								{
									continue
								}

								sokk.priv = ''

								if(sokk.key !== '')
								{
									info.keys = remove_key(sokk.key, info.keys)
									sokk.key = ''
								}

								sokk.bannd = true
								sokk.info1 = socket.username

								io.to(ids[j]).emit('update', {type:'redirect', location:'the street'})

								setTimeout(do_disconnect, 2000, sokk)
							}
						}

						db.collection('rooms').update({_id:info._id}, {$set:{bans:info.bans, keys:info.keys}})

						break
					}
				}
			})
		}		
	}

	function unbanall(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			get_roominfo(socket.room, {bans:true}, function(info)
			{
				if(info.bans !== '')
				{
					info.bans = ''

					io.sockets.in(socket.room).emit('update', {type:'announce_unbanall', username:socket.username})
					
					db.collection('rooms').update({_id:info._id}, {$set:{bans:info.bans}})
				}

				else
				{
					socket.emit('update', {room:socket.room, type:'nothingtounban'})
				}
			})
		}		
	}

	function unbanlast(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			get_roominfo(socket.room, {bans:true}, function(info)
			{
				if(info.bans !== '')
				{
					info.bans = info.bans.split(';').slice(0,-1).join(';')

					io.sockets.in(socket.room).emit('update', {type:'announce_unbanlast', username:socket.username})
					
					db.collection('rooms').update({_id:info._id}, {$set:{bans:info.bans}})
				}

				else
				{
					socket.emit('update', {room:socket.room, type:'nothingtounban'})
				}
			})
		}		
	}

	function bannedcount(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			get_roominfo(socket.room, {bans:true}, function(info)
			{
				if(info.bans === '')
				{
					var count = 0
				}

				else
				{
					var count = info.bans.split(';').length
				}

				socket.emit('update', {room:socket.room, type:'get_bannedcount', count:count})
			})
		}		
	}

	function kick(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.username === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.username.length === 0)
			{
				socket.disconnect()
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.username === data.username)
				{
					if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
					{
						socket.emit('update', {room:socket.room, type:'forbiddenuser'})
						return false
					}

					socc.priv = ''
					socc.key = ''
					socc.kickd = true
					socc.info1 = socket.username
					
					io.to(ids[i]).emit('update', {type:'redirect', location:'the street'})

					setTimeout(do_disconnect, 2000, socc)

					break
				}
			}
		}		
	}

	function change_upload_permission(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.upload_permission === undefined)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {upload_permission:true}, function(info)
			{
				var amodes = [1, 2, 3]

				if(!isNaN(data.upload_permission))
				{
					var m = parseInt(data.upload_permission)

					if(m === info.upload_permission)
					{
						return false
					}

					if(amodes.indexOf(m) !== -1)
					{
						io.sockets.in(socket.room).emit('update', {type:'upload_permission_change', username:socket.username, upload_permission:m})
						
						info.upload_permission = m
						
						db.collection('rooms').update({_id:info._id}, {$set:{upload_permission:info.upload_permission}})
					}
				}
			})
		}
	}

	function change_chat_permission(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.chat_permission === undefined)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {chat_permission:true}, function(info)
			{
				var amodes = [1, 2, 3]

				if(!isNaN(data.chat_permission))
				{
					var m = parseInt(data.chat_permission)

					if(m === info.chat_permission)
					{
						return false
					}				

					if(amodes.indexOf(m) !== -1)
					{
						io.sockets.in(socket.room).emit('update', {type:'chat_permission_change', username:socket.username, chat_permission:m})
						
						info.chat_permission = m
						
						db.collection('rooms').update({_id:info._id}, {$set:{chat_permission:info.chat_permission}})
					}
				}
			})
		}
	}

	function change_radio_permission(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.radio_permission === undefined)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {radio_permission:true}, function(info)
			{
				var amodes = [1, 2, 3]

				if(!isNaN(data.radio_permission))
				{
					var m = parseInt(data.radio_permission)

					if(m === info.radio_permission)
					{
						return false
					}				

					if(amodes.indexOf(m) !== -1)
					{
						io.sockets.in(socket.room).emit('update', {type:'radio_permission_change', username:socket.username, radio_permission:m})
						
						info.radio_permission = m
						
						db.collection('rooms').update({_id:info._id}, {$set:{radio_permission:info.radio_permission}})
					}
				}
			})
		}
	}

	function make_private(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			get_roominfo(socket.room, {public:true}, function(info)
			{
				if(info.public)
				{
					io.sockets.in(socket.room).emit('update', {type:'made_private', username:socket.username})
					info.public = false

					db.collection('rooms').update({_id:info._id}, {$set:{public:info.public}})
				}
			})
		}
	}

	function make_public(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {public:true}, function(info)
			{
				if(!info.public)
				{
					io.sockets.in(socket.room).emit('update', {type:'made_public', username:socket.username})
					info.public = true

					db.collection('rooms').update({_id:info._id}, {$set:{public:info.public}})
				}
			})
		}
	}

	function change_radio_source(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.src === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.src.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(data.src.length > config.max_radio_source_length)
			{
				socket.disconnect()
				return false
			}

			get_roominfo(socket.room, {radio_permission:true}, function(info)
			{
				if(!check_permission(info.radio_permission, socket.priv))
				{
					return false
				}

				if(data.src.indexOf("http://") !== -1 || data.src.indexOf("https://") !== -1 || data.src === "default")
				{
					if(data.src.indexOf("youtube.com") !== -1 || data.src.indexOf("youtu.be") !== -1)
					{
						if(!config.youtube_enabled)
						{
							return
						}

						var id = get_youtube_id(data.src)

						if(id)
						{
							fetch(`https://www.googleapis.com/youtube/v3/videos?id=${id}&fields=items(snippet(title))&part=snippet&key=${sconfig.youtube_api_key}`).then(function(res)
							{
								return res.json()
							}).then(function(response)
							{
								if(response.items.length > 0)
								{
									data.type = "youtube"
									data.title = response.items[0].snippet.title
									do_change_radio_source(socket, info, data)
								}

								else
								{
									socket.emit('update', {room:socket.room, type:'songnotfound'})
								}
							})
						}
					}

					else
					{
						data.type = "radio"
						data.title = ""
						do_change_radio_source(socket, info, data)
					}
				}

				else
				{
					if(!config.youtube_enabled)
					{
						return
					}

					fetch(`https://www.googleapis.com/youtube/v3/search?q=${data.src}&fields=items(id,snippet(title))&part=snippet&maxResults=1&key=${sconfig.youtube_api_key}`).then(function(res)
					{
						return res.json()
					}).then(function(response)
					{
						if(response.items.length > 0)
						{
							data.type = "youtube"
							data.src = `https://youtube.com/watch?v=${response.items[0].id.videoId}`
							data.title = response.items[0].snippet.title
							do_change_radio_source(socket, info, data)
						}

						else
						{
							socket.emit('update', {room:socket.room, type:'songnotfound'})
						}						
					})						
				}
			})
		}
	}

	function do_change_radio_source(socket, info, data)
	{	
		if(data.src === 'default')
		{
			info.radio_type = "radio"
			info.radio_source = ''
			info.radio_title = ''
		}

		else
		{
			info.radio_type = data.type
			info.radio_source = data.src
			info.radio_title = data.title
		}

		info.radio_setter = socket.username
		info.radio_date = Date.now()

		io.sockets.in(socket.room).emit('update', 
		{
			type: 'changed_radio_source', 
			radio_type: info.radio_type,
			radio_source: info.radio_source,
			radio_title: info.radio_title,
			radio_setter: info.radio_setter,
			radio_date: info.radio_date
		})

		db.collection('rooms').update({_id:info._id}, {$set:
		{
			radio_type: info.radio_type,
			radio_source: info.radio_source,
			radio_title: info.radio_title,
			radio_setter: info.radio_setter,
			radio_date: info.radio_date,
			modified: Date.now()
		}})
	}

	function do_disconnect(socc)
	{
		socc.disconnect()
	}

	function disconnect(socket)
	{
		if(socket.username !== undefined)
		{
			if(socket.pingd)
			{
				var type = 'pinged'
			}

			else if(socket.kickd)
			{
				var type = 'kicked'
			}

			else if(socket.bannd)
			{
				var type = 'banned'
			}

			else
			{
				var type = 'disconnection'
			}

			io.sockets.in(socket.room).emit('update', 
			{
				type: type,
				username: socket.username, 
				usercount: get_usercount(socket.room), 
				info1: socket.info1, 
				priv: socket.priv
			})	
		}
	}

	// Helper Functions

	function compare_roomlist(a, b)
	{
		if(a[2] < b[2])
		{
			return 1
		}

		if(a[2] > b[2])
		{
			return -1
		}

		return 0
	}

	function get_roominfo(room, fields, callback)
	{
		var version = 10

		if(Object.keys(fields).length > 0)
		{
			fields.version = true
		}

		db.collection('rooms').findOne({name:room}, fields, function(err, roominfo)
		{
			if(!roominfo)
			{
				roominfo = 
				{
					version: version,
					name: room,
					image_url: '',
					image_uploader: '',
					image_size: 0,
					image_date: 0,
					topic: '',
					topic_setter: '',
					topic_date: 0,
					claimed: false,
					keys: '',
					upload_permission: 1,
					chat_permission: 1,
					radio_permission: 1,
					radio_type: 'radio',
					radio_source: '',
					radio_title: '',
					radio_setter: '',
					radio_date: 0,
					bans: '',
					modified: 0,
					public: true
				}

				db.collection('rooms').insertOne(roominfo)
			}

			else
			{
				if(roominfo.version !== version)
				{
					if(roominfo.name === undefined || typeof roominfo.name !== "string")
					{
						roominfo.name = room
					}
					
					if(roominfo.image_url === undefined || typeof roominfo.image_url !== "string")
					{
						roominfo.image_url = ""
					}
					
					if(roominfo.image_uploader === undefined || typeof roominfo.image_uploader !== "string")
					{
						roominfo.image_uploader = ""
					}
					
					if(roominfo.image_size === undefined || typeof roominfo.image_size !== "number")
					{
						roominfo.image_size = 0
					}
					
					if(roominfo.image_date === undefined || typeof roominfo.image_date !== "number")
					{
						roominfo.image_date = 0
					}
					
					if(roominfo.topic === undefined || typeof roominfo.topic !== "string")
					{
						roominfo.topic = ""
					}
					
					if(roominfo.topic_setter === undefined || typeof roominfo.topic_setter !== "string")
					{
						roominfo.topic_setter = ""
					}
					
					if(roominfo.topic_date === undefined || typeof roominfo.topic_date !== "number")
					{
						roominfo.topic_date = 0
					}
					
					if(roominfo.claimed === undefined || typeof roominfo.claimed !== "boolean")
					{
						roominfo.claimed = false
					}
					
					if(roominfo.keys === undefined || typeof roominfo.keys !== "string")
					{
						roominfo.keys = ""
					}
					
					if(roominfo.upload_permission === undefined || typeof roominfo.upload_permission !== "number")
					{
						roominfo.upload_permission = 1
					}
					
					if(roominfo.chat_permission === undefined || typeof roominfo.chat_permission !== "number")
					{
						roominfo.chat_permission = 1
					}
					
					if(roominfo.radio_permission === undefined || typeof roominfo.radio_permission !== "number")
					{
						roominfo.radio_permission = 1
					}

					if(roominfo.radio_type === undefined || typeof roominfo.radio_type !== "string")
					{
						roominfo.radio_type = "radio"
					}					
					
					if(roominfo.radio_source === undefined || typeof roominfo.radio_source !== "string")
					{
						roominfo.radio_source = ""
					}

					if(roominfo.radio_title === undefined || typeof roominfo.radio_title !== "string")
					{
						roominfo.radio_title = ""
					}
					
					if(roominfo.radio_setter === undefined || typeof roominfo.radio_setter !== "string")
					{
						roominfo.radio_setter = ""
					}
					
					if(roominfo.radio_date === undefined || typeof roominfo.radio_date !== "number")
					{
						roominfo.radio_date = 0
					}
					
					if(roominfo.bans === undefined || typeof roominfo.bans !== "string")
					{
						roominfo.bans = ""
					}
					
					if(roominfo.modified === undefined || typeof roominfo.modified !== "number")
					{
						roominfo.modified = 0
					}
					
					if(roominfo.public === undefined || typeof roominfo.public !== "boolean")
					{
						roominfo.public = true
					}

					roominfo.version = version

					db.collection('rooms').update({_id:roominfo._id}, {$set:roominfo})
				}
				
			}

			callback(roominfo)
		})
	}

	function get_userinfo(username, callback)
	{
		var version = 2

		db.collection('users').findOne({username:username}, function(err, userinfo)
		{
			if(!userinfo)
			{
				userinfo = 
				{
					version: version,
					username: username,
					key: ''
				}

				db.collection('users').insertOne(userinfo)
			}

			else
			{
				if(userinfo.version !== version)
				{
					if(userinfo.username === undefined || typeof userinfo.username !== "string")
					{
						userinfo.username = username
					}

					if(userinfo.key === undefined || typeof userinfo.key !== "string")
					{
						userinfo.key = ""
					}

					userinfo.version = version

					db.collection('users').update({_id:userinfo._id}, {$set:userinfo})
				}
			}

			callback(userinfo)
		})
	}

	function get_usernames(room)
	{
		try
		{
			var sockets = io.sockets.adapter.rooms[room].sockets

			var usernames = []

			var keys = Object.keys(sockets)

			for(var i=0; i<keys.length; i++)
			{
				usernames.push(io.sockets.connected[keys[i]].username)
			}

			return usernames
		}

		catch(err)
		{
			return []
		}
	}

	function get_userlist(room)
	{
		try
		{
			var sockets = io.sockets.adapter.rooms[room].sockets

			var userlist = []

			var keys = Object.keys(sockets)

			for(var i=0; i<keys.length; i++)
			{
				var socc = io.sockets.connected[keys[i]]
				userlist.push([socc.username, socc.priv])
			}

			return userlist
		}

		catch(err)
		{
			return []
		}
	}

	function get_roomlist(callback)
	{
		if(last_roomlist === undefined || (Date.now() - roomlist_lastget > config.roomlist_cache))
		{
			var rooms = []

			var md = Date.now() - config.roomlist_max_inactivity

			db.collection('rooms').find({claimed:true, public:true, modified:{$gt:md}}).toArray(function(err, results)
			{
				for(var i=0; i<results.length; i++)
				{
					var room = results[i]

					rooms.push([room.name, room.topic.substring(0, config.max_roomlist_topic_length), get_usercount(room.name)])
				}

				rooms.sort(compare_roomlist).splice(config.max_roomlist_items)

				last_roomlist = rooms
				roomlist_lastget = Date.now()

				callback(last_roomlist)
			})
		}

		else
		{
			callback(last_roomlist)
		}
	}

	function get_usercount(room)
	{
		try 
		{
			return Object.keys(io.sockets.adapter.rooms[room].sockets).length
		}

		catch(err) 
		{
			return 0
		}
	}

	function change_image(room, fname, uploader, size)
	{
		get_roominfo(room, {image_url:true}, function(info)
		{
			if(info.image_url !== "")
			{
				var rname = info.image_url.split('_')[0].split('/').pop()

				exec(`find ${images_root} -maxdepth 1 -type f -name "${rname}_*" -not -name "${fname}" -delete`)
			}

			var pth = config.public_images_location + fname

			info.image_url = pth
			info.image_uploader = uploader
			info.image_size = size
			info.image_date = Date.now()	

			io.sockets.in(room).emit('update',
			{
				type: 'image_change',
				image_url: info.image_url,
				image_uploader: info.image_uploader,
				image_size: info.image_size,
				image_date: info.image_date
			})
				
			db.collection('rooms').update({_id:info._id}, {$set:
			{
				image_url: info.image_url, 
				image_uploader: info.image_uploader, 
				image_size: info.image_size, 
				image_date: info.image_date,
				modified: Date.now()
			}})
		})
	}

	function check_image_url(uri)
	{
		if(uri.split(' ').length > 1)
		{
			return false
		}

		var ext = uri.split('.').pop().toLowerCase()

		if(ext !== 'jpg' && ext !== 'png' && ext !== 'jpeg' && ext !== 'gif')
		{
			return false
		}

		return true
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
		return s.replace(/[^a-z0-9\-\_\s\@\!\?\&\%\<\>\^\$\(\)\[\]\*\"\'\,\.\:\;\|\{\}\=\+\~]+/gi, "").replace(/\s+/g, " ").trim()
	}

	function get_random_int(min, max)
	{
		return Math.floor(Math.random() * (max-min+1) + min)
	}

	function get_random_key()
	{
		var text = ""
		var possible = "ABCDEFGHIJKLMnopqrstuvwxyz012345"

		for(var i=0; i < 12; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}

		return "_key_" + Date.now() + text
	}

	function get_random_vkey()
	{
		var text = ""
		var possible = "NOPQRSTUVWXYZabcdefghijklm6789"

		for(var i=0; i<12; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}

		return "_vkey_" + Date.now() + text
	}

	function get_random_okey()
	{
		var text = ""
		var possible = "NOPQRSTUVWXYZabcdefghijklm6789"

		for(var i=0; i<6; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}

		possible = "ABCDEFGHIJKLMnopqrstuvwxyz012345"

		for(var i=0; i<6; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}

		return "_okey_" + Date.now() + text
	}

	function get_random_ukey()
	{
		var text = ""
		var possible = "ABCDEFGHIJKLMnopqrstuvwxyz012345"

		for(var i=0; i<12; i++)
		{
			text += possible.charAt(Math.floor(Math.random() * possible.length))
		}

		return "_ukey_" + Date.now() + text
	}

	function replace_key(priv, okey, keys)
	{
		if(okey !== '')
		{
			keys = remove_key(okey, keys)
		}

		if(priv === 'admin')
		{
			var key = get_random_key()
		}

		else if(priv === 'op')
		{
			var key = get_random_okey()
		}

		else if(priv === 'voice')
		{
			var key = get_random_vkey()
		}

		if(keys === '')
		{
			keys = key
		}

		else
		{
			keys += ";" + key
		}

		return {key:key, keys:keys}
	}

	function remove_key(key, keys)
	{
		var skeys = keys.split(';')

		for(var i=0; i<skeys.length; i++)
		{
			if(skeys[i] === key)
			{
				skeys.splice(i, 1)
				break
			}
		}

		return skeys.join(';')
	}

	function check_permission(permission, priv)
	{
		if(permission === 1)
		{
			return true
		}

		else if(permission === 2)
		{
			if(priv === "admin" || priv === "op" || priv === "voice")
			{
				return true
			}
		}

		else if(permission === 3)
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

	function make_username_unique(username, usernames)
	{
		for(var i=0; i<5; i++)
		{
			var matched = false

			for(var j=0; j<usernames.length; j++)
			{
				if(usernames[j] === username)
				{
					matched = true
					break
				}
			}

			if(matched)
			{
				if(i === 4)
				{
					return make_username_unique(word_generator('cvcvcv'), usernames)
				}

				username = username + get_random_int(2, 9)

				if(username.length > config.max_username_length)
				{
					username = username.substring(0, parseInt(config.max_username_length / 2))
				}
			}

			else
			{
				break
			}
		}

		return username
	}

	function remove_username(username, usernames)
	{
		for(var i=0; i<usernames.length; i++)
		{
			if(usernames[i] === username)
			{
				usernames.splice(i, 1)
			}
		}
	}

	function get_youtube_id(url)
	{
		url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)

		var id = undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]

		return id.length === 11 ? id : false
	}	
}