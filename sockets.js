module.exports = function(io, db_manager, config, sconfig)
{
	const fs = require('fs')
	const path = require('path')
	const {exec} = require('child_process')
	const shell = require('shelljs/global')
	const antiSpam  = require('socket-anti-spam')
	const fetch = require('node-fetch')
	const mongo = require('mongodb')
	const images_root = path.join(__dirname, config.images_directory)

	const roominfo_version = 10
	const userinfo_version = 2

	var last_roomlist
	var roomlist_lastget = 0

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

		socket.on('change_nickname', function(data) 
		{
			try
			{
				change_nickname(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_topic', function(data) 
		{
			try
			{
				change_topic(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_room_name', function(data) 
		{
			try
			{
				change_room_name(socket, data)
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

		socket.on('create_room', function(data) 
		{
			try
			{
				create_room(socket, data)
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
		if(data.nickname === undefined || data.room_id === undefined)
		{
			socket.disconnect()
			return false
		}

		if(data.nickname.length === 0 || data.room_id.length === 0)
		{
			socket.disconnect()
			return false
		}

		if(data.nickname.length > config.max_nickname_length)
		{
			socket.disconnect()
			return false
		}

		if(data.room_id.length > config.max_room_id_length)
		{
			socket.disconnect()
			return false
		}

		if(data.room_id.length !== clean_string4(data.room_id).length)
		{
			socket.disconnect()
			return false
		}

		if(data.room_id == undefined)
		{
			socket.disconnect()
			return false
		}


		socket.user_id = data.user_id

		db_manager.get_room({_id:data.room_id}, {}, function(info)
		{
			if(!info)
			{
				socket.emit('update', {type: 'redirect', location:config.redirect_url})
				return false
			}

			db_manager.get_user({_id:socket.user_id}, {}, function(userinfo)				
			{
				if(!userinfo)
				{
					socket.emit('update', {type: 'redirect', location:config.redirect_url})
					return false
				}

				socket.user_username = userinfo.username

				socket.ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress

				var bans = info.bans.split(';')

				for(var i=0; i<bans.length; i++)
				{
					if(bans[i] === socket.ip)
					{
						socket.disconnect()
						return false
					}
				}

				socket.room_id = info._id.toString()

				socket.join(socket.room_id)

				if(info.fresh)
				{
					socket.priv = "admin"
					var key = info.keys
				}

				else
				{
					socket.priv = ''

					var key = false

					if(info.keys !== '')
					{
						key = userinfo.room_keys[info._id.toString()]

						if(key !== undefined)
						{
							if(key.startsWith('_key_'))
							{
								socket.priv = 'admin'
							}

							else if(key.startsWith('_okey_'))
							{
								socket.priv = 'op'
							}

							else if(key.startsWith('_vkey_'))
							{
								socket.priv = 'voice'
							}
						}
					}
				}

				socket.nickname = make_nickname_unique(data.nickname, get_nicknames(socket.room_id))

				socket.emit('update', 
				{
					type: 'joined', 
					room_name: info.name,
					nickname: socket.nickname, 
					image_url: info.image_url, 
					image_uploader: info.image_uploader, 
					image_size: info.image_size, 
					image_date: info.image_date, 
					topic: info.topic, 
					topic_setter: info.topic_setter,
					topic_date: info.topic_date,
					userlist: get_userlist(socket.room_id), 
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
					claimed: info.claimed,
					key: key
				})

				socket.broadcast.in(socket.room_id).emit('update',
				{
					type: 'userjoin',
					usercount: get_usercount(socket.room_id),
					nickname: socket.nickname,
					priv: socket.priv
				})
			})
		})
	}

	function sendchat(socket, data)
	{
		if(socket.nickname !== undefined)
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
				return false
			}

			if(data.msg.length !== clean_string2(data.msg).length)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {chat_permission:true}, function(info)
			{
				if(!check_permission(info.chat_permission, socket.priv))
				{
					return false
				}

				socket.broadcast.in(socket.room_id).emit('update', {type:'chat_msg', nickname:socket.nickname, msg:data.msg})

				db_manager.update_room(info._id, {modified:Date.now()})
			})
		}
	}

	function pasted(socket, data)
	{
		if(socket.nickname !== undefined)
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

			db_manager.get_room({_id:socket.room_id}, {upload_permission:true}, function(info)
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
								change_image(socket.room_id, fname, socket.nickname, output)
							}

							else
							{
								exec(`rm -f ${images_root}/${fname}`)

								socket.emit('update', {room:socket.room_id, type:'upload_error'})								
							}
						})
					})
				}
			})
		}
	}

	function uploaded(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(data.image_file === undefined)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {upload_permission:true}, function(info)
			{
				if(!check_permission(info.upload_permission, socket.priv))
				{
					return false
				}

				var size = data.image_file.toString('ascii').length / 1024

				if(size === 0 || (size > config.max_image_size))
				{
					socket.emit('update', {room:socket.room_id, type:'upload_error'})													
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
							socket.emit('update', {room:socket.room_id, type:'upload_error'})
						}

						else 
						{
							change_image(socket.room_id, fname, socket.nickname, size)
						}
					})
				}
			})
		}
	}

	function change_nickname(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === socket.nickname)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length > config.max_nickname_length)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length !== clean_string4(data.nickname).length)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {chat_permission:true}, function(info)
			{
				if(!check_permission(info.chat_permission, socket.priv))
				{
					return false
				}

				if(data.nickname === socket.user_username)
				{
					var sockets = io.sockets.adapter.rooms[socket.room_id].sockets

					var keys = Object.keys(sockets)

					for(var i=0; i<keys.length; i++)
					{
						var sckt = io.sockets.connected[keys[i]]

						if(sckt.nickname === data.nickname)
						{
							sckt.nickname = make_nickname_unique('user', get_nicknames(socket.room_id))
							io.sockets.in(socket.room_id).emit('update', {type:'new_nickname', nickname:sckt.nickname, old_nickname:data.nickname})
							break
						}
					}

					var old_nickname = socket.nickname
					socket.nickname = data.nickname

					io.sockets.in(socket.room_id).emit('update', {type:'new_nickname', nickname:socket.nickname, old_nickname:old_nickname})					
				}

				else
				{
					var nicknames = get_nicknames(socket.room_id)

					for(var i=0; i<nicknames.length; i++)
					{
						if(nicknames[i] === socket.nickname)
						{
							var old_nickname = nicknames[i]
							socket.nickname = make_nickname_unique(data.nickname, nicknames)
							io.sockets.in(socket.room_id).emit('update', {type:'new_nickname', nickname:socket.nickname, old_nickname:old_nickname})
						}
					}
				}
			})
		}
	}

	function change_topic(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
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

			db_manager.get_room({_id:socket.room_id}, {topic:true}, function(info)
			{
				var new_topic = data.topic

				if(new_topic !== info.topic)
				{
					info.topic = new_topic
					info.topic_setter = socket.nickname
					info.topic_date = Date.now()

					io.sockets.in(socket.room_id).emit('update', 
					{
						type: 'topic_change',
						topic: info.topic,
						topic_setter: info.topic_setter,
						topic_date: info.topic_date
					})
					
					db_manager.update_room(info._id,
					{
						topic: info.topic,
						topic_setter: info.topic_setter,
						topic_date: info.topic_date,
						modified: Date.now()
					})
				}
			})
		}
	}

	function change_room_name(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			if(data.name.length === 0 || data.name.length > config.max_room_name_length)
			{
				socket.disconnect()
				return false
			}

			if(data.name.length !== clean_string2(data.name).length)
			{
				socket.disconnect()
				return false
			}			

			db_manager.get_room({_id:socket.room_id}, {name:true}, function(info)
			{
				if(info.name !== data.name)
				{
					info.name = data.name

					io.sockets.in(socket.room_id).emit('update', 
					{
						type: 'room_name_changed',
						name: info.name,
						nickname: socket.nickname
					})
					
					db_manager.update_room(info._id,
					{
						name: info.name,
						modified: Date.now()
					})					
				}
			})		
		}
	}

	function roomlist(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			get_roomlist(function(rooms)
			{
				socket.emit('update', {room:socket.room_id, type:'roomlist', roomlist:rooms})
			})
		}
	}

	function create_room(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(data.name.length === 0 || data.name.length > config.max_room_name_length)
			{
				socket.disconnect()
				return false
			}

			if(data.name.length !== clean_string2(data.name).length)
			{
				socket.disconnect()
				return false
			}

			if(data.public !== true && data.public !== false)
			{
				socket.disconnect()
				return false
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.chat_permission) === -1)
			{
				socket.disconnect()
				return false
			}

			if(amodes.indexOf(data.upload_permission) === -1)
			{
				socket.disconnect()
				return false
			}

			if(amodes.indexOf(data.radio_permission) === -1)
			{
				socket.disconnect()
				return false
			}

			db_manager.create_room(data, function(info)
			{
				db_manager.get_user({_id:socket.user_id}, {}, function(userinfo)				
				{
					var id = info._id.toString()

					userinfo.room_keys[id] = info.keys

					db_manager.update_user(socket.user_id,
					{
						room_keys: userinfo.room_keys
					})

					socket.emit('update', {room:socket.room_id, type:'room_created', id:id})
				})
			})
		}
	}

	function heartbeat(socket, data)
	{
		if(socket.nickname === undefined)
		{
			socket.emit('update', {room:socket.room_id, type:'connection_lost'})
		}
	}

	function claim_room(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.room_id === config.main_room_id && data.pass !== sconfig.secretpass)
			{
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {claimed:true}, function(info)
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

					var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

					for(var i=0; i<ids.length; i++)
					{
						var socc = io.sockets.connected[ids[i]]
						socc.priv = ''
					}

					socket.priv = 'admin'

					db_manager.get_user({_id:socket.user_id}, {}, function(userinfo)
					{
						var id = info._id.toString()

						userinfo.room_keys[id] = socket.key

						db_manager.update_user(socket.user_id,
						{
							room_keys: userinfo.room_keys
						})

						db_manager.update_room(info._id, {keys:socket.key, claimed:true, modified:Date.now()})

						io.sockets.in(socket.room_id).emit('update', {type:'announce_claim', nickname:socket.nickname, updated:updated})
					})				
				}
			})
		}
	}

	function unclaim_room(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {claimed:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]
					socc.priv = ''
				}

				db_manager.update_room(info._id,
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
				})

				io.sockets.in(socket.room_id).emit('update', {type:'announce_unclaim', nickname:socket.nickname})
			})
		}		
	}

	function voice(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}

			if(socket.nickname === data.nickname)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.nickname === data.nickname)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === 'voice')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'voice', who:data.nickname})
							return false
						}

						socc.priv = 'voice'

						var repkey = replace_key(socc.priv, socc.key, info.keys)

						socc.key = repkey.key
						info.keys = repkey.keys

						db_manager.get_user({_id:socc.user_id}, {}, function(userinfo)
						{
							var id = info._id.toString()

							userinfo.room_keys[id] = socc.key

							db_manager.update_user(socc.user_id,
							{
								room_keys: userinfo.room_keys
							})

							db_manager.update_room(info._id, {keys:info.keys})

							io.sockets.in(socket.room_id).emit('update', {type:'announce_voice', nickname1:socket.nickname, nickname2:data.nickname})
						})

						break
					}
				}
			})
		}		
	}

	function op(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.nickname === data.nickname)
					{
						if(socc.priv === 'op')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'op', who:data.nickname})
							return false
						}

						socc.priv = 'op'

						var repkey = replace_key(socc.priv, socc.key, info.keys)

						socc.key = repkey.key
						info.keys = repkey.keys

						db_manager.get_user({_id:socc.user_id}, {}, function(userinfo)
						{
							var id = info._id.toString()

							userinfo.room_keys[id] = socc.key

							db_manager.update_user(socc.user_id,
							{
								room_keys: userinfo.room_keys
							})

							db_manager.update_room(info._id, {keys:info.keys})

							io.sockets.in(socket.room_id).emit('update', {type:'announce_op', nickname1:socket.nickname, nickname2:data.nickname})
						})

						break
					}
				}
			})
		}
	}

	function admin(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.nickname === data.nickname)
					{
						if(socc.priv === 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'admin', who:data.nickname})
							return false
						}

						socc.priv = 'admin'

						var repkey = replace_key(socc.priv, socc.key, info.keys)

						socc.key = repkey.key
						info.keys = repkey.keys

						db_manager.get_user({_id:socc.user_id}, {}, function(userinfo)
						{
							var id = info._id.toString()

							userinfo.room_keys[id] = socc.key

							db_manager.update_user(socc.user_id,
							{
								room_keys: userinfo.room_keys
							})

							db_manager.update_room(info._id, {keys:info.keys})

							io.sockets.in(socket.room_id).emit('update', {type:'announce_admin', nickname1:socket.nickname, nickname2:data.nickname})
						})

						break
					}
				}
			})
		}		
	}

	function strip(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}
					
			if(socket.nickname === data.nickname)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.nickname === data.nickname)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === '')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'', who:data.nickname})
							return false
						}

						socc.priv = ''

						if(socc.key !== '')
						{
							info.keys = remove_key(socc.key, info.keys)
							socc.key = ''
						}

						io.sockets.in(socket.room_id).emit('update', {type:'announce_strip', nickname1:socket.nickname, nickname2:data.nickname})

						db_manager.update_room(info._id, {keys:info.keys})																

						break
					}
				}
			})
		}		
	}

	function remove_voices(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true}, function(info)
			{
				var key_array = info.keys.split(';')

				var filtered_array = key_array.filter(function(item) 
				{
					return item.indexOf('_vkey_') !== 0
				})

				if(key_array.length === filtered_array.length)
				{
					socket.emit('update', {room:socket.room_id, type:'novoicestoremove'})
					return false
				}

				info.keys = filtered_array.join(';')

				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.priv === 'voice')
					{
						socc.priv = ''
					}
				}
				
				io.sockets.in(socket.room_id).emit('update', {type:'announce_removedvoices', nickname:socket.nickname})

				db_manager.update_room(info._id, {keys:info.keys})
			})
		}		
	}

	function remove_ops(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true}, function(info)
			{
				var key_array = info.keys.split(';')

				var filtered_array = key_array.filter(function(item) 
				{
					return item.indexOf('_okey_') !== 0
				})

				if(key_array.length === filtered_array.length)
				{
					socket.emit('update', {room:socket.room_id, type:'noopstoremove'})
					return false
				}

				info.keys = filtered_array.join(';')

				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.priv === 'op')
					{
						socc.priv = ''
					}
				}
				
				io.sockets.in(socket.room_id).emit('update', {type:'announce_removedops', nickname:socket.nickname})

				db_manager.update_room(info._id, {keys:info.keys})
			})
		}
	}

	function ban(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true, keys:true}, function(info)
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.nickname === data.nickname)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
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

								if(sokk.nickname === socket.nickname)
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
								sokk.info1 = socket.nickname

								io.to(ids[j]).emit('update', {type:'redirect', location:config.redirect_url})

								setTimeout(do_disconnect, 2000, sokk)
							}
						}

						db_manager.update_room(info._id, {bans:info.bans, keys:info.keys})

						break
					}
				}
			})
		}		
	}

	function unbanall(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true}, function(info)
			{
				if(info.bans !== '')
				{
					info.bans = ''

					io.sockets.in(socket.room_id).emit('update', {type:'announce_unbanall', nickname:socket.nickname})
					
					db_manager.update_room(info._id, {bans:info.bans})
				}

				else
				{
					socket.emit('update', {room:socket.room_id, type:'nothingtounban'})
				}
			})
		}		
	}

	function unbanlast(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true}, function(info)
			{
				if(info.bans !== '')
				{
					info.bans = info.bans.split(';').slice(0,-1).join(';')

					io.sockets.in(socket.room_id).emit('update', {type:'announce_unbanlast', nickname:socket.nickname})
					
					db_manager.update_room(info._id, {bans:info.bans})
				}

				else
				{
					socket.emit('update', {room:socket.room_id, type:'nothingtounban'})
				}
			})
		}		
	}

	function bannedcount(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true}, function(info)
			{
				if(info.bans === '')
				{
					var count = 0
				}

				else
				{
					var count = info.bans.split(';').length
				}

				socket.emit('update', {room:socket.room_id, type:'get_bannedcount', count:count})
			})
		}		
	}

	function kick(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			if(data.nickname === undefined)
			{
				socket.disconnect()
				return false
			}

			if(data.nickname.length === 0)
			{
				socket.disconnect()
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.nickname === data.nickname)
				{
					if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
					{
						socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
						return false
					}

					socc.priv = ''
					socc.key = ''
					socc.kickd = true
					socc.info1 = socket.nickname
					
					io.to(ids[i]).emit('update', {type:'redirect', location:config.redirect_url})

					setTimeout(do_disconnect, 2000, socc)

					break
				}
			}
		}		
	}

	function change_chat_permission(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.chat_permission) === -1)
			{
				socket.disconnect()
				return false
			}			

			db_manager.get_room({_id:socket.room_id}, {chat_permission:true}, function(info)
			{
				if(data.chat_permission === info.chat_permission)
				{
					return false
				}				

				io.sockets.in(socket.room_id).emit('update', {type:'chat_permission_change', nickname:socket.nickname, chat_permission:data.chat_permission})
					
				info.chat_permission = data.chat_permission
					
				db_manager.update_room(info._id, {chat_permission:info.chat_permission})
			})
		}
	}	

	function change_upload_permission(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.upload_permission) === -1)
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {upload_permission:true}, function(info)
			{
				if(data.upload_permission === info.upload_permission)
				{
					return false
				}

				io.sockets.in(socket.room_id).emit('update', {type:'upload_permission_change', nickname:socket.nickname, upload_permission:data.upload_permission})
					
				info.upload_permission = data.upload_permission
					
				db_manager.update_room(info._id, {upload_permission:info.upload_permission})
			})
		}
	}

	function change_radio_permission(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.radio_permission) === -1)
			{
				socket.disconnect()
				return false
			}			

			db_manager.get_room({_id:socket.room_id}, {radio_permission:true}, function(info)
			{
				if(data.radio_permission === info.radio_permission)
				{
					return false
				}				

				io.sockets.in(socket.room_id).emit('update', {type:'radio_permission_change', nickname:socket.nickname, radio_permission:data.radio_permission})
					
				info.radio_permission = data.radio_permission
					
				db_manager.update_room(info._id, {radio_permission:info.radio_permission})
			})
		}
	}

	function make_private(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {public:true}, function(info)
			{
				if(info.public)
				{
					io.sockets.in(socket.room_id).emit('update', {type:'made_private', nickname:socket.nickname})
					info.public = false

					db_manager.update_room(info._id, {public:info.public})
				}
			})
		}
	}

	function make_public(socket, data)
	{
		if(socket.nickname !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				socket.disconnect()
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {public:true}, function(info)
			{
				if(!info.public)
				{
					io.sockets.in(socket.room_id).emit('update', {type:'made_public', nickname:socket.nickname})
					info.public = true

					db_manager.update_room(info._id, {public:info.public})
				}
			})
		}
	}

	function change_radio_source(socket, data)
	{
		if(socket.nickname !== undefined)
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

			db_manager.get_room({_id:socket.room_id}, {radio_permission:true}, function(info)
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
								if(response.items !== undefined && response.items.length > 0)
								{
									data.type = "youtube"
									data.title = response.items[0].snippet.title
									do_change_radio_source(socket, info, data)
								}

								else
								{
									socket.emit('update', {room:socket.room_id, type:'songnotfound'})
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
						if(response.items !== undefined && response.items.length > 0)
						{
							data.type = "youtube"
							data.src = `https://youtube.com/watch?v=${response.items[0].id.videoId}`
							data.title = response.items[0].snippet.title
							do_change_radio_source(socket, info, data)
						}

						else
						{
							socket.emit('update', {room:socket.room_id, type:'songnotfound'})
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

		info.radio_setter = socket.nickname
		info.radio_date = Date.now()

		io.sockets.in(socket.room_id).emit('update', 
		{
			type: 'changed_radio_source', 
			radio_type: info.radio_type,
			radio_source: info.radio_source,
			radio_title: info.radio_title,
			radio_setter: info.radio_setter,
			radio_date: info.radio_date
		})

		db_manager.update_room(info._id,
		{
			radio_type: info.radio_type,
			radio_source: info.radio_source,
			radio_title: info.radio_title,
			radio_setter: info.radio_setter,
			radio_date: info.radio_date,
			modified: Date.now()
		})
	}

	function do_disconnect(socc)
	{
		socc.disconnect()
	}

	function disconnect(socket)
	{
		if(socket.nickname !== undefined)
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

			io.sockets.in(socket.room_id).emit('update', 
			{
				type: type,
				nickname: socket.nickname, 
				usercount: get_usercount(socket.room_id), 
				info1: socket.info1, 
				priv: socket.priv
			})	
		}
	}

	// Helper Functions

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

	function compare_roomlist(a, b)
	{
		if(a[3] < b[3]) 
		{
			return 1
		}

		if(a[3] > b[3]) 
		{
			return -1
		}

		if(a[3] === b[3])
		{
			if (a[4] < b[4]) 
			{
				return 1
			}

			if(a[4] > b[4]) 
			{
				return -1
			}

			return 0
		}
	}

	function get_nicknames(room)
	{
		try
		{
			var sockets = io.sockets.adapter.rooms[room].sockets

			var nicknames = []

			var keys = Object.keys(sockets)

			for(var i=0; i<keys.length; i++)
			{
				nicknames.push(io.sockets.connected[keys[i]].nickname)
			}

			return nicknames
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
				userlist.push([socc.nickname, socc.priv])
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

			db_manager.find_rooms({claimed:true, public:true, modified:{$gt:md}}, function(results)
			{
				if(!results)
				{
					return false
				}

				for(var i=0; i<results.length; i++)
				{
					var room = results[i]

					rooms.push([room._id.toString(), room.name, room.topic.substring(0, config.max_roomlist_topic_length), get_usercount(room._id.toString()), room.modified])
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

	function get_usercount(id)
	{
		try 
		{
			return Object.keys(io.sockets.adapter.rooms[id].sockets).length
		}

		catch(err) 
		{
			return 0
		}
	}

	function change_image(room, fname, uploader, size)
	{
		db_manager.get_room({_id:room}, {image_url:true}, function(info)
		{
			if(info.image_url !== "")
			{
				exec(`find ${images_root} -maxdepth 1 -type f -name "${info._id}_*" -not -name "${fname}" -delete`)
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
				
			db_manager.update_room(info._id,
			{
				image_url: info.image_url, 
				image_uploader: info.image_uploader, 
				image_size: info.image_size, 
				image_date: info.image_date,
				modified: Date.now()
			})
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
		return s.replace(/[^a-z0-9\-\_\s\@\!\?\&\#\%\<\>\^\$\(\)\[\]\*\"\'\,\.\:\;\|\{\}\=\+\~]+/gi, "").replace(/\s+/g, " ").trim()
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

	function make_nickname_unique(nickname, nicknames)
	{
		for(var i=0; i<5; i++)
		{
			var matched = false

			for(var j=0; j<nicknames.length; j++)
			{
				if(nicknames[j] === nickname)
				{
					matched = true
					break
				}
			}

			if(matched)
			{
				if(i === 4)
				{
					return make_nickname_unique(word_generator('cvcvcv'), nicknames)
				}

				nickname = nickname + get_random_int(2, 9)

				if(nickname.length > config.max_nickname_length)
				{
					nickname = nickname.substring(0, parseInt(config.max_nickname_length / 2))
				}
			}

			else
			{
				break
			}
		}

		return nickname
	}

	function get_youtube_id(url)
	{
		url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)

		var id = undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]

		return id.length === 11 ? id : false
	}	
}