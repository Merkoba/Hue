module.exports = function(io, db_manager, config, sconfig, utilz)
{
	const fs = require('fs')
	const path = require('path')
	const {exec} = require('child_process')
	const shell = require('shelljs/global')
	const antiSpam  = require('socket-anti-spam')
	const fetch = require('node-fetch')
	const mongo = require('mongodb')
	const aws = require('aws-sdk');
	const jwt = require('jsonwebtoken');
	const images_root = path.join(__dirname, config.images_directory)

	const s3 = new aws.S3(
	{
		apiVersion: sconfig.s3_api_version,
		endpoint: sconfig.s3_endpoint_url,
		credentials:
		{
			accessKeyId: sconfig.s3_access_key,
			secretAccessKey: sconfig.s3_secret_access_key
		}
	})

	const rooms = {}

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
		do_disconnect(socket)
	})

	start_room_loop()

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

		socket.on('change_tv_permission', function(data) 
		{
			try
			{
				change_tv_permission(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_log', function(data) 
		{
			try
			{
				change_log(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('clear_log', function(data) 
		{
			try
			{
				clear_log(socket, data)
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

		socket.on('change_tv_source', function(data) 
		{
			try
			{
				change_tv_source(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_username', function(data) 
		{
			try
			{
				change_username(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_password', function(data) 
		{
			try
			{
				change_password(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('change_email', function(data) 
		{
			try
			{
				change_email(socket, data)
			}

			catch(err)
			{
				console.error(err)
			}
		})

		socket.on('get_details', function(data) 
		{
			try
			{
				get_details(socket, data)
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
		socket.kickd = false
		socket.bannd = false		
	}

	function join_room(socket, data)
	{
		if(data.room_id === undefined || data.user_id === undefined || data.token === undefined)
		{
			return get_out(socket)
		}

		if(data.room_id.length === 0 || data.user_id.length === 0 || data.token.length === 0)
		{
			return get_out(socket)
		}

		if(data.room_id.length > config.max_room_id_length)
		{
			return get_out(socket)
		}

		if(data.user_id > config.max_user_id_length)
		{
			return get_out(socket)
		}

		if(data.token.length > config.max_jwt_token_length)
		{
			return get_out(socket)
		}

		jwt.verify(data.token, sconfig.jwt_secret, function(err, decoded) 
		{
			if(err)
			{
				return get_out(socket)				
			}

			else if(decoded.data === undefined || decoded.data.id === undefined)
			{
				return get_out(socket)
			}

			if(decoded.data.id !== data.user_id)
			{
				return get_out(socket)
			}			

			else
			{
				socket.user_id = data.user_id

				db_manager.get_room({_id:data.room_id}, {})

				.then(info =>
				{
					if(!info)
					{
						return get_out(socket)
					}

					db_manager.get_user({_id:socket.user_id}, {username:true})

					.then(userinfo =>
					{
						if(!userinfo)
						{
							return get_out(socket)
						}

						socket.username = userinfo.username

						socket.ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress
						
						if(info.bans.indexOf(socket.ip) !== -1)
						{
							return get_out(socket)
						}

						var room_id = info._id.toString()

						socket.room_id = room_id		

						if(rooms[room_id] === undefined)
						{
							rooms[room_id] = create_room_object(info)
						}

						socket.priv = info.keys[socket.user_id]

						if(socket.priv === undefined)
						{
							socket.priv = ''
						}

						socket.join(room_id)

						if(!user_already_connected(socket))
						{
							socket.broadcast.in(room_id).emit('update',
							{
								type: 'userjoin',
								username: socket.username,
								priv: socket.priv
							})

							if(rooms[room_id].userlist === undefined)
							{
								rooms[room_id].userlist = []
							}

							rooms[room_id].userlist.push([socket.username, socket.priv])				
						}

						socket.emit('update', 
						{
							type: 'joined', 
							room_name: info.name,
							username: socket.username, 
							image_url: info.image_url, 
							image_uploader: info.image_uploader, 
							image_size: info.image_size, 
							image_date: info.image_date, 
							topic: info.topic, 
							topic_setter: info.topic_setter,
							topic_date: info.topic_date,
							userlist: get_userlist(socket.room_id), 
							log: info.log,
							log_messages: info.log_messages,
							priv: socket.priv, 
							chat_permission: info.chat_permission, 
							upload_permission: info.upload_permission, 
							radio_permission: info.radio_permission, 
							tv_permission: info.tv_permission,
							public: info.public,
							radio_type: info.radio_type,
							radio_source: info.radio_source,
							radio_title: info.radio_title,
							radio_setter: info.radio_setter, 
							radio_date: info.radio_date, 
							tv_type: info.tv_type,
							tv_source: info.tv_source,
							tv_title: info.tv_title,
							tv_setter: info.tv_setter, 
							tv_date: info.tv_date, 
							active_media: info.active_media,
							claimed: info.claimed
						})				

						db_manager.save_visited_room(socket.user_id, socket.room_id)

						.catch(err =>
						{
							console.error(err)
						})
					})

					.catch(err =>
					{
						console.error(err)
					})
				})

				.catch(err =>
				{
					console.error(err)
				})
			}
		})

	}

	function sendchat(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.msg === undefined)
			{
				return get_out(socket)
			}

			if(data.msg.length === 0)
			{
				return get_out(socket)
			}

			if(data.msg.length > config.max_input_length)
			{
				return get_out(socket)
			}

			if(data.msg.length !== utilz.clean_string2(data.msg).length)
			{
				return get_out(socket)
			}

			if(!check_permission(rooms[socket.room_id].chat_permission, socket.priv))
			{
				return false
			}

			socket.broadcast.in(socket.room_id).emit('update', {type:'chat_msg', username:socket.username, msg:data.msg})

			rooms[socket.room_id].activity = true

			if(rooms[socket.room_id].log)
			{
				var message = 
				{
					type: "chat",
					data: 
					{
						username: socket.username,
						content: data.msg
					},
					date: Date.now()
				}

				rooms[socket.room_id].log_messages.push(message)
			}
		}
	}

	function pasted(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.image_url === undefined)
			{
				return get_out(socket)
			}

			if(data.image_url.length === 0)
			{
				return get_out(socket)
			}

			if(data.image_url.length > config.max_input_length)
			{
				return get_out(socket)
			}		    

			if(!check_permission(rooms[socket.room_id].upload_permission, socket.priv))
			{
				return false
			}	

			data.image_url = data.image_url.replace(/\s/g,'').replace(/\.gifv/g,'.gif')

			var clean = check_image_url(data.image_url)

			if(clean)
			{
				var fname = `${socket.room_id}_${Date.now()}_${get_random_int(0, 1000)}.${data.image_url.split('.').pop(-1)}`
				
				exec(`wget -O ${images_root}/${fname} -q "${data.image_url}"`, function(status, output)
				{
					exec(`stat -c '%s' ${images_root}/${fname}`, function(status, output) 
					{
						output = parseInt(output) / 1024

						if(output > 0 && (output <= config.max_image_size))
						{
							change_image(socket.room_id, fname, socket.username, output)
						}

						else
						{
							fs.unlink(`${images_root}/${fname}`, function(){})

							socket.emit('update', {room:socket.room_id, type:'upload_error'})								
						}
					})
				})
			}
		}
	}

	function uploaded(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.image_file === undefined)
			{
				return get_out(socket)
			}

			if(!check_permission(rooms[socket.room_id].upload_permission, socket.priv))
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
				var fname = `${socket.room_id}_${Date.now()}_${get_random_int(0, 1000)}.${data.name.split('.').pop(-1)}`

				fs.writeFile(images_root + '/' + fname, data.image_file, function(err,data) 
				{
					if(err) 
					{
						socket.emit('update', {room:socket.room_id, type:'upload_error'})
					}

					else 
					{
						change_image(socket.room_id, fname, socket.username, size)
					}
				})
			}
		}
	}

	function change_topic(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			if(data.topic === undefined)
			{
				return get_out(socket)
			}

			if(data.topic.length === 0)
			{
				return get_out(socket)
			}

			if(data.topic.length > config.max_topic_length)
			{
				return get_out(socket)
			}

			if(data.topic.length !== utilz.clean_string2(data.topic).length)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {topic:true})

			.then(info =>
			{
				var new_topic = data.topic

				if(new_topic !== info.topic)
				{
					info.topic = new_topic
					info.topic_setter = socket.username
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
						topic_date: info.topic_date
					})

					.catch(err =>
					{
						console.error(err)
					})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function change_room_name(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			if(data.name.length === 0 || data.name.length > config.max_room_name_length)
			{
				return get_out(socket)
			}

			if(data.name.length !== utilz.clean_string2(data.name).length)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {name:true})

			.then(info =>
			{
				if(info.name !== data.name)
				{
					info.name = data.name

					io.sockets.in(socket.room_id).emit('update', 
					{
						type: 'room_name_changed',
						name: info.name,
						username: socket.username
					})
					
					db_manager.update_room(info._id,
					{
						name: info.name
					})

					.catch(err =>
					{
						console.error(err)
					})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})	
		}
	}

	function roomlist(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.type === "visited")
			{
				get_visited_roomlist(socket.user_id, function(rooms)
				{
					socket.emit('update', {room:socket.room_id, type:'roomlist', roomlist:rooms})
				})
			}

			else if(data.type === "public")
			{
				get_roomlist(function(rooms)
				{
					socket.emit('update', {room:socket.room_id, type:'roomlist', roomlist:rooms})
				})
			}
		}
	}

	function create_room(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.name.length === 0 || data.name.length > config.max_room_name_length)
			{
				return get_out(socket)
			}

			if(data.name.length !== utilz.clean_string2(data.name).length)
			{
				return get_out(socket)
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.chat_permission) === -1)
			{
				return get_out(socket)
			}

			if(amodes.indexOf(data.upload_permission) === -1)
			{
				return get_out(socket)
			}

			if(amodes.indexOf(data.radio_permission) === -1)
			{
				return get_out(socket)
			}

			if(data.public !== true && data.public !== false)
			{
				return get_out(socket)
			}
			
			if(data.log !== true && data.log !== false)
			{
				return get_out(socket)
			}

			data.user_id = socket.user_id

			db_manager.create_room(data)

			.then(info =>
			{
				socket.emit('update', {room:socket.room_id, type:'room_created', id:info._id.toString()})
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function heartbeat(socket, data)
	{
		if(socket.username === undefined)
		{
			socket.emit('update', {room:socket.room_id, type:'connection_lost'})
		}
	}

	function claim_room(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.room_id === config.main_room_id && data.pass !== sconfig.secretpass)
			{
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {claimed:true})

			.then(info =>
			{
				if(!info.claimed || socket.priv === 'admin' || data.pass === sconfig.secretpass)
				{
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
						
						replace_in_userlist(socc, socc.username)
					}

					socket.priv = "admin"

					info.keys = {}

					info.keys[socket.user_id] = "admin"

					replace_in_userlist(socc, socc.username)					

					db_manager.update_room(info._id, {keys:info.keys, claimed:true})

					.catch(err =>
					{
						console.error(err)
					})

					io.sockets.in(socket.room_id).emit('update', {type:'announce_claim', username:socket.username, updated:updated})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function unclaim_room(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {claimed:true})

			.then(info =>
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]
					
					socc.priv = ''

					replace_in_userlist(socc, socc.username)					
				}

				db_manager.update_room(info._id,
				{
					keys: {}, 
					claimed: false, 
					topic: '',
					topic_setter: '',
					topic_date: 0,
					upload_permission: 1,
					chat_permission: 1,
					radio_source: '',
					radio_setter: '',
					radio_date: '',
					bans: '',
					public: true
				})

				.catch(err =>
				{
					console.error(err)
				})

				io.sockets.in(socket.room_id).emit('update', {type:'announce_unclaim', username:socket.username})
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function voice(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}

			if(socket.username === data.username)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true})

			.then(info =>
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === 'voice')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'voice', who:data.username})
							return false
						}

						socc.priv = 'voice'

						info.keys[socc.user_id] = "voice"

						replace_in_userlist(socc, socc.username)

						db_manager.update_room(info._id, {keys:info.keys})

						.catch(err => 
						{
							console.error(err)
						})

						io.sockets.in(socket.room_id).emit('update', {type:'announce_voice', username1:socket.username, username2:data.username})

						break
					}
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function op(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return get_out(socket)
			}

			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true})

			.then(info =>
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === 'op')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'op', who:data.username})
							return false
						}

						socc.priv = 'op'

						info.keys[socc.user_id] = "op"

						replace_in_userlist(socc, socc.username)

						db_manager.update_room(info._id, {keys:info.keys})

						.catch(err => 
						{
							console.error(err)
						})

						io.sockets.in(socket.room_id).emit('update', {type:'announce_op', username1:socket.username, username2:data.username})

						break
					}
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function admin(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return get_out(socket)
			}

			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true})

			.then(info =>
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'admin', who:data.username})
							return false
						}

						socc.priv = 'admin'

						info.keys[socc.user_id] = "admin"

						replace_in_userlist(socc, socc.username)

						db_manager.update_room(info._id, {keys:info.keys})

						.catch(err => 
						{
							console.error(err)
						})

						io.sockets.in(socket.room_id).emit('update', {type:'announce_admin', username1:socket.username, username2:data.username})

						break
					}
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function strip(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}
					
			if(socket.username === data.username)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true})

			.then(info =>
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
					{
						if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
						{
							socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
							return false
						}

						if(socc.priv === '')
						{
							socket.emit('update', {room:socket.room_id, type:'isalready', what:'', who:data.username})
							return false
						}

						socc.priv = ''

						delete info.keys[socc.user_id]

						replace_in_userlist(socc, socc.username)

						db_manager.update_room(info._id, {keys:info.keys})

						.catch(err => 
						{
							console.error(err)
						})

						io.sockets.in(socket.room_id).emit('update', {type:'announce_strip', username1:socket.username, username2:data.username})

						break
					}
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function remove_voices(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true})

			.then(info =>
			{
				var removed = false

				for(var key in info.keys)
				{
					if(info.keys[key] === "voice")
					{
						delete info.keys[key]
						removed = true
					}
				}

				if(!removed)
				{
					socket.emit('update', {room:socket.room_id, type:'novoicestoremove'})
					return false
				}

				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.priv === 'voice')
					{
						socc.priv = ''

						replace_in_userlist(socc, socc.username)
					}
				}
				
				db_manager.update_room(info._id, {keys:info.keys})

				.catch(err =>
				{
					console.error(err)
				})

				io.sockets.in(socket.room_id).emit('update', {type:'announce_removedvoices', username:socket.username})
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function remove_ops(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {keys:true})

			.then(info =>
			{
				var removed = false

				for(var key in info.keys)
				{
					if(info.keys[key] === "op")
					{
						delete info.keys[key]
						removed = true
					}
				}

				if(!removed)
				{
					socket.emit('update', {room:socket.room_id, type:'noopstoremove'})
					return false
				}

				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.priv === 'op')
					{
						socc.priv = ''

						replace_in_userlist(socc, socc.username)
					}
				}
				
				io.sockets.in(socket.room_id).emit('update', {type:'announce_removedops', username:socket.username})

				db_manager.update_room(info._id, {keys:info.keys})

				.catch(err =>
				{
					console.error(err)
				})				
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function kick(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.username === data.username)
				{
					if((socc.priv === 'admin' || socc.priv === 'op') && socket.priv !== 'admin')
					{
						socket.emit('update', {room:socket.room_id, type:'forbiddenuser'})
						return false
					}

					socc.priv = ''
					socc.kickd = true
					socc.info1 = socket.username
					
					get_out(socc)
				}
			}
		}		
	}	

	function ban(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true, keys:true})

			.then(info =>
			{
				var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

				for(var i=0; i<ids.length; i++)
				{
					var socc = io.sockets.connected[ids[i]]

					if(socc.username === data.username)
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

						if(info.bans.indexOf(socc.ip) === -1)
						{
							info.bans.push(socc.ip)
						}

						else
						{
							return false
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

								sokk.bannd = true

								sokk.info1 = socket.username

								get_out(sokk)
							}
						}

						db_manager.update_room(info._id, {bans:info.bans})

						.catch(err =>
						{
							console.error(err)
						})						

						break
					}
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function unbanall(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true})

			.then(info =>
			{
				if(info.bans.length > 0)
				{
					info.bans = []
					
					db_manager.update_room(info._id, {bans:info.bans})

					.catch(err =>
					{
						console.error(err)
					})

					io.sockets.in(socket.room_id).emit('update', {type:'announce_unbanall', username:socket.username})
				}

				else
				{
					socket.emit('update', {room:socket.room_id, type:'nothingtounban'})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function unbanlast(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true})

			.then(info =>
			{
				if(info.bans.length > 0)
				{
					info.bans.pop()

					db_manager.update_room(info._id, {bans:info.bans})

					.catch(err =>
					{
						console.error(err)
					})

					io.sockets.in(socket.room_id).emit('update', {type:'announce_unbanlast', username:socket.username})
				}

				else
				{
					socket.emit('update', {room:socket.room_id, type:'nothingtounban'})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function bannedcount(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {bans:true})

			.then(info =>
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

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function change_upload_permission(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.upload_permission) === -1)
			{
				return get_out(socket)
			}

			io.sockets.in(socket.room_id).emit('update', {type:'upload_permission_change', username:socket.username, upload_permission:data.upload_permission})

			rooms[socket.room_id].upload_permission = data.upload_permission				
				
			db_manager.update_room(socket.room_id, {upload_permission:data.upload_permission})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function change_chat_permission(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.chat_permission) === -1)
			{
				return get_out(socket)
			}							

			io.sockets.in(socket.room_id).emit('update', {type:'chat_permission_change', username:socket.username, chat_permission:data.chat_permission})

			rooms[socket.room_id].chat_permission = data.chat_permission				
				
			db_manager.update_room(socket.room_id, {chat_permission:data.chat_permission})

			.catch(err =>
			{
				console.error(err)
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

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.radio_permission) === -1)
			{
				return get_out(socket)
			}

			io.sockets.in(socket.room_id).emit('update', {type:'radio_permission_change', username:socket.username, radio_permission:data.radio_permission})

			rooms[socket.room_id].radio_permission = data.radio_permission
				
			db_manager.update_room(socket.room_id, {radio_permission:data.radio_permission})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function change_tv_permission(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			var amodes = [1, 2, 3]

			if(amodes.indexOf(data.tv_permission) === -1)
			{
				return get_out(socket)
			}

			io.sockets.in(socket.room_id).emit('update', {type:'tv_permission_change', username:socket.username, tv_permission:data.tv_permission})

			rooms[socket.room_id].tv_permission = data.tv_permission
				
			db_manager.update_room(socket.room_id, {tv_permission:data.tv_permission})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function change_log(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			if(data.log !== true && data.log !== false)
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {log:true})

			.then(info =>
			{
				if(info.log !== data.log)
				{
					if(!data.log)
					{
						rooms[socket.room_id].log_messages = []

						db_manager.update_room(socket.room_id, {log:data.log, log_messages:[]})

						.catch(err =>
						{
							console.error(err)
						})						
					}

					else
					{
						db_manager.update_room(socket.room_id, {log:data.log})

						.catch(err =>
						{
							console.error(err)
						})						
					}

					rooms[socket.room_id].log = data.log

					io.sockets.in(socket.room_id).emit('update', {type:'log_changed', username:socket.username, log:data.log})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}		
	}

	function clear_log(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return false
			}

			db_manager.get_room({_id:socket.room_id}, {log_messages:true})

			.then(info =>
			{
				if(info.log_messages.length > 0)
				{
					rooms[socket.room_id].log_messages = []

					db_manager.update_room(socket.room_id, {log_messages:[]})

					.catch(err =>
					{
						console.error(err)
					})					

					io.sockets.in(socket.room_id).emit('update', {type:'log_cleared', username:socket.username})
				}

				else
				{
					socket.emit('update', {room:socket.room_id, type:'nothingtoclear'})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})

		}		
	}

	function make_private(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {public:true})

			.then(info =>
			{
				if(info.public)
				{
					io.sockets.in(socket.room_id).emit('update', {type:'made_private', username:socket.username})
					
					info.public = false

					db_manager.update_room(info._id, {public:info.public})

					.catch(err =>
					{
						console.error(err)
					})					
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function make_public(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(socket.priv !== 'admin' && socket.priv !== 'op')
			{
				return get_out(socket)
			}

			db_manager.get_room({_id:socket.room_id}, {public:true})

			.then(info =>
			{
				if(!info.public)
				{
					io.sockets.in(socket.room_id).emit('update', {type:'made_public', username:socket.username})
					
					info.public = true

					db_manager.update_room(info._id, {public:info.public})

					.catch(err =>
					{
						console.error(err)
					})					
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function change_radio_source(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.src === undefined)
			{
				return get_out(socket)
			}

			if(data.src.length === 0)
			{
				return get_out(socket)
			}

			if(data.src.length > config.max_radio_source_length)
			{
				return get_out(socket)
			}

			if(!check_permission(rooms[socket.room_id].radio_permission, socket.priv))
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
						})

						.then(function(response)
						{
							if(response.items !== undefined && response.items.length > 0)
							{
								data.type = "youtube"
								data.title = response.items[0].snippet.title
								do_change_radio_source(socket, data)
							}

							else
							{
								socket.emit('update', {room:socket.room_id, type:'songnotfound'})
							}
						})

						.catch(err =>
						{
							console.error(err)
						})
					}
				}

				else
				{
					data.type = "radio"
					data.title = ""
					do_change_radio_source(socket, data)
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
				})

				.then(function(response)
				{
					if(response.items !== undefined && response.items.length > 0)
					{
						data.type = "youtube"
						data.src = `https://youtube.com/watch?v=${response.items[0].id.videoId}`
						data.title = response.items[0].snippet.title
						do_change_radio_source(socket, data)
					}

					else
					{
						socket.emit('update', {room:socket.room_id, type:'songnotfound'})
					}						
				})

				.catch(err =>
				{
					console.error(err)
				})						
			}
		}
	}

	function change_tv_source(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.src === undefined)
			{
				return get_out(socket)
			}

			if(data.src.length === 0)
			{
				return get_out(socket)
			}

			if(data.src.length > config.max_tv_source_length)
			{
				return get_out(socket)
			}

			if(!check_permission(rooms[socket.room_id].tv_permission, socket.priv))
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
						})

						.then(function(response)
						{
							if(response.items !== undefined && response.items.length > 0)
							{
								data.type = "youtube"
								data.title = response.items[0].snippet.title
								do_change_tv_source(socket, data)
							}

							else
							{
								socket.emit('update', {room:socket.room_id, type:'videonotfound'})
							}
						})

						.catch(err =>
						{
							console.error(err)
						})
					}
				}

				else
				{
					data.type = "url"
					data.title = ""
					do_change_tv_source(socket, data)
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
				})

				.then(function(response)
				{
					if(response.items !== undefined && response.items.length > 0)
					{
						data.type = "youtube"
						data.src = `https://youtube.com/watch?v=${response.items[0].id.videoId}`
						data.title = response.items[0].snippet.title
						do_change_tv_source(socket, data)
					}

					else
					{
						socket.emit('update', {room:socket.room_id, type:'songnotfound'})
					}						
				})

				.catch(err =>
				{
					console.error(err)
				})						
			}
		}
	}

	function do_change_radio_source(socket, data)
	{	
		var radioinfo = {}

		if(data.src === 'default')
		{
			radioinfo.radio_type = "radio"
			radioinfo.radio_source = ''
			radioinfo.radio_title = ''
		}

		else
		{
			radioinfo.radio_type = data.type
			radioinfo.radio_source = data.src
			radioinfo.radio_title = data.title
		}

		radioinfo.radio_setter = socket.username
		radioinfo.radio_date = Date.now()

		io.sockets.in(socket.room_id).emit('update', 
		{
			type: 'changed_radio_source', 
			radio_type: radioinfo.radio_type,
			radio_source: radioinfo.radio_source,
			radio_title: radioinfo.radio_title,
			radio_setter: radioinfo.radio_setter,
			radio_date: radioinfo.radio_date
		})

		db_manager.update_room(socket.room_id,
		{
			radio_type: radioinfo.radio_type,
			radio_source: radioinfo.radio_source,
			radio_title: radioinfo.radio_title,
			radio_setter: radioinfo.radio_setter,
			radio_date: radioinfo.radio_date
		})

		.catch(err =>
		{
			console.error(err)
		})

		rooms[socket.room_id].activity = true
		
		if(rooms[socket.room_id].log)
		{
			var message = 
			{
				type: "radio", 
				data:
				{
					radio_type: radioinfo.radio_type,
					radio_source: radioinfo.radio_source,
					radio_title: radioinfo.radio_title,
					radio_setter: radioinfo.radio_setter
				}, 
				date: Date.now()
			}

			rooms[socket.room_id].log_messages.push(message)
		}		
	}

	function do_change_tv_source(socket, data)
	{	
		var tvinfo = {}

		if(data.src === 'default')
		{
			tvinfo.tv_type = "tv"
			tvinfo.tv_source = ''
			tvinfo.tv_title = ''
		}

		else
		{
			tvinfo.tv_type = data.type
			tvinfo.tv_source = data.src
			tvinfo.tv_title = data.title
		}

		tvinfo.tv_setter = socket.username
		tvinfo.tv_date = Date.now()

		io.sockets.in(socket.room_id).emit('update', 
		{
			type: 'changed_tv_source', 
			tv_type: tvinfo.tv_type,
			tv_source: tvinfo.tv_source,
			tv_title: tvinfo.tv_title,
			tv_setter: tvinfo.tv_setter,
			tv_date: tvinfo.tv_date
		})

		db_manager.update_room(socket.room_id,
		{
			tv_type: tvinfo.tv_type,
			tv_source: tvinfo.tv_source,
			tv_title: tvinfo.tv_title,
			tv_setter: tvinfo.tv_setter,
			tv_date: tvinfo.tv_date,
			active_media: "tv"
		})

		.catch(err =>
		{
			console.error(err)
		})

		rooms[socket.room_id].activity = true
		
		if(rooms[socket.room_id].log)
		{
			var message = 
			{
				type: "tv", 
				data:
				{
					tv_type: tvinfo.tv_type,
					tv_source: tvinfo.tv_source,
					tv_title: tvinfo.tv_title,
					tv_setter: tvinfo.tv_setter
				}, 
				date: Date.now()
			}

			rooms[socket.room_id].log_messages.push(message)
		}		
	}

	function change_username(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.username === undefined)
			{
				return get_out(socket)
			}

			if(data.username.length === 0)
			{
				return get_out(socket)
			}

			if(data.username.length > config.max_username_length)
			{
				return get_out(socket)
			}

			if(utilz.clean_string4(data.username).length !== data.username.length)
			{
				return get_out(socket)
			}

			var old_username = socket.username

			db_manager.change_username(socket.user_id, data.username)

			.then(done =>
			{
				if(done)
				{
					for(var socc of get_all_user_clients(socket))
					{
						socc.username = data.username
					}

					replace_in_userlist(socket, old_username)

					io.sockets.in(socket.room_id).emit('update', {type:'new_username', username:socket.username, old_username:old_username})
				}

				else
				{
					socket.emit('update', {room:socket.room, type:'username_already_exists', username:data.username})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}

	function change_password(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.password === undefined)
			{
				return get_out(socket)
			}

			if(data.password.length === 0 || data.password.length < config.min_password_length)
			{
				return get_out(socket)
			}

			if(data.password.length > config.max_password_length)
			{
				return get_out(socket)
			}

			db_manager.update_user(socket.user_id,
			{
				password: data.password
			})

			.catch(err =>
			{
				console.error(err)
			})			

			socket.emit('update', {room:socket.room, type:'password_changed', password:data.password})
		}
	}

	function change_email(socket, data)
	{
		if(socket.username !== undefined)
		{
			if(data.email === undefined)
			{
				return get_out(socket)
			}

			if(data.email.indexOf('@') === -1 || data.email.indexOf(' ') !== -1)
			{
				return get_out(socket)
			}			

			if(data.email.length > config.max_email_length)
			{
				return get_out(socket)
			}

			db_manager.update_user(socket.user_id,
			{
				email: data.email
			})

			.catch(err =>
			{
				console.error(err)
			})			

			socket.emit('update', {room:socket.room, type:'email_changed', email:data.email})
		}
	}

	function get_details(socket, data)
	{
		if(socket.username !== undefined)
		{
			db_manager.get_user({_id:socket.user_id}, {username:true, email:true})

			.then(userinfo =>
			{
				if(userinfo)
				{
					socket.emit('update', {room:socket.room, type:'show_details', username:userinfo.username, email:userinfo.email})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})			
		}
	}

	function do_disconnect(socc)
	{
		socc.disconnect()
	}

	function disconnect(socket)
	{
		if(socket.username !== undefined)
		{
			if(user_already_connected(socket))
			{
				return
			}

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
				username: socket.username,
				info1: socket.info1, 
				priv: socket.priv
			})

			if(socket.room_id === undefined)
			{
				return
			}

			if(rooms[socket.room_id] === undefined)
			{
				return
			}

			if(rooms[socket.room_id].userlist !== undefined)
			{
				for(var i=0; i<rooms[socket.room_id].userlist.length; i++)
				{
					var item = rooms[socket.room_id].userlist[i]

					if(item[0] === socket.username)
					{
						rooms[socket.room_id].userlist.splice(i, 1)
						break
					}
				}
			}
		}
	}

	// Helper Functions

	function get_random_int(min, max)
	{
		return Math.floor(Math.random() * (max  -min + 1) + min)
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

	function get_userlist(room_id)
	{
		try
		{
			if(rooms[room_id] === undefined)
			{
				return []
			}

			if(rooms[room_id].userlist !== undefined)
			{
				return rooms[room_id].userlist
			}

			else
			{
				return []
			}
		}

		catch(err)
		{
			return []
		}
	}

	function get_usercount(room_id)
	{
		return get_userlist(room_id).length
	}

	function get_roomlist(callback)
	{
		if(last_roomlist === undefined || (Date.now() - roomlist_lastget > config.roomlist_cache))
		{
			var roomlist = []

			var md = Date.now() - config.roomlist_max_inactivity

			db_manager.find_rooms({claimed:true, public:true, modified:{$gt:md}})

			.then(results =>
			{
				if(!results)
				{
					return false
				}

				for(var i=0; i<results.length; i++)
				{
					var room = results[i]

					roomlist.push([room._id.toString(), room.name, room.topic.substring(0, config.max_roomlist_topic_length), get_usercount(room._id.toString()), room.modified])
				}

				roomlist.sort(compare_roomlist).splice(config.max_roomlist_items)

				last_roomlist = roomlist

				roomlist_lastget = Date.now()

				callback(last_roomlist)
			})

			.catch(err =>
			{
				console.error(err)
			})
		}

		else
		{
			callback(last_roomlist)
		}
	}

	function get_visited_roomlist(user_id, callback)
	{
		var roomlist = []

		db_manager.get_user({_id:user_id}, {visited_rooms:true})

		.then(userinfo =>
		{
			var mids = []

			for(var id of userinfo.visited_rooms)
			{
				if(typeof id === "string" && id !== config.main_room_id)
				{
					mids.push(new mongo.ObjectId(id))
				}

				else
				{
					mids.push(id)
				}
			}

			db_manager.find_rooms({_id:{"$in":mids}})

			.then(results =>
			{
				if(!results)
				{
					return false
				}

				for(var i=0; i<results.length; i++)
				{
					var room = results[i]

					roomlist.push([room._id.toString(), room.name, room.topic.substring(0, config.max_roomlist_topic_length), get_usercount(room._id.toString()), room.modified])
				}

				roomlist.sort(compare_roomlist)

				callback(roomlist)
			})

			.catch(err =>
			{
				console.error(err)
			})		
		})

		.catch(err =>
		{
			console.error(err)
		})
	}

	function change_image(room_id, fname, uploader, size)
	{
		if(config.image_storage_s3_or_local === "local")
		{
			do_change_image(room_id, fname, uploader, size)
		}

		else if(config.image_storage_s3_or_local === "s3")
		{
			fs.readFile(`${images_root}/${fname}`, (err, data) => 
			{
				if(err)
				{
					fs.unlink(`${images_root}/${fname}`, function(){})
					return
				}

				s3.putObject(
				{
					ACL: "public-read",
					Body: data,
					Bucket: sconfig.s3_bucket_name, 
					Key: `${sconfig.s3_images_location}${fname}`
				}).promise()

				.then(ans =>
				{
					fs.unlink(`${images_root}/${fname}`, function(){})
					do_change_image(room_id, sconfig.s3_main_url + sconfig.s3_images_location + fname, uploader, size)
				})

				.catch(err =>
				{					
					fs.unlink(`${images_root}/${fname}`, function(){})
					console.error(err)
				})
			})
		}

		else
		{
			return false
		}
	}

	function do_change_image(room_id, fname, uploader, size)
	{
		db_manager.get_room({_id:room_id}, {stored_images:true})

		.then(info =>
		{
			if(config.image_storage_s3_or_local === "local")
			{
				var image_url = config.public_images_location + fname
			}

			else if(config.image_storage_s3_or_local === "s3")
			{
				var image_url = fname
			}

			else
			{
				return false
			}

			info.stored_images.unshift(fname)

			var spliced = false
			
			if(info.stored_images.length > config.max_stored_images)
			{
				var spliced = info.stored_images.splice(config.max_stored_images, info.stored_images.length)
			}

			io.sockets.in(room_id).emit('update',
			{
				type: 'image_change',
				image_url: image_url,
				image_uploader: uploader,
				image_size: size,
				image_date: Date.now()
			})
				
			db_manager.update_room(room_id,
			{
				image_url: image_url, 
				image_uploader: uploader, 
				image_size: size, 
				image_date: Date.now(),
				stored_images: info.stored_images,
				active_media: "image"
			})

			.catch(err =>
			{
				console.error(err)
			})			

			if(spliced)
			{
				for(var file_name of spliced)
				{
					if(file_name.indexOf(sconfig.s3_main_url) === -1)
					{
						fs.unlink(`${images_root}/${file_name}`, function(err){})
					}

					else
					{
						s3.deleteObject(
						{
							Bucket: sconfig.s3_bucket_name,
							Key: file_name.replace(sconfig.s3_main_url, "")
						}).promise()

						.catch(err =>
						{
							console.error(err)
						})
					}
				}
			}

			rooms[room_id].activity = true
			
			if(rooms[room_id].log)
			{
				var message = 
				{
					type: "image", 
					data: 
					{
						image_url: image_url,
						image_uploader: uploader,
						image_size: size
					},
					date: Date.now()
				}

				rooms[room_id].log_messages.push(message)
			}			
		})

		.catch(err =>
		{
			console.error(err)
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

	function get_youtube_id(url)
	{
		url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)

		var id = undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0]

		return id.length === 11 ? id : false
	}

	function create_room_object(info)
	{
		var obj = 
		{
			_id: info._id.toString(),
			activity: false,
			log: info.log,
			log_messages: [],
			chat_permission: info.chat_permission,
			upload_permission: info.upload_permission,
			radio_permission: info.radio_permission,
			tv_permission: info.tv_permission
		}

		return obj	
	}

	function start_room_loop()
	{
		setInterval(function()
		{
			try
			{
				for(var key in rooms)
				{
					var room = rooms[key]

					if(room.activity)
					{
						if(room.log_messages.length > 0)
						{
							db_manager.push_room_messages(room._id, room.log_messages)

							.catch(err =>
							{
								console.error(err)
							})							
						}

						else
						{
							db_manager.update_room(room._id, {})

							.catch(err =>
							{
								console.error(err)
							})							
						}

						room.activity = false
						room.log_messages = []
					}
				}
			}

			catch(err)
			{
				console.error(err)
			}
		}, config.room_loop_interval)
	}

	function user_already_connected(socket)
	{
		try
		{
			if(io.sockets.adapter.rooms[socket.room_id] === undefined)
			{
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.id !== socket.id && socc.username === socket.username)
				{
					return true
				}
			}

			return false
		}

		catch(err)
		{
			console.error(err)
		}
	}

	function get_all_user_clients(socket)
	{
		try
		{
			var clients = []

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.username === socket.username)
				{
					clients.push(socc)
				}
			}
			
			return clients
		}

		catch(err)
		{
			console.error(err)
		}
	}

	function replace_in_userlist(socket, old_username)
	{
		try
		{
			var clients = []

			for(var i=0; i<rooms[socket.room_id].userlist.length; i++)
			{
				var item = rooms[socket.room_id].userlist[i]

				if(item[0] === old_username)
				{
					rooms[socket.room_id].userlist.splice(i, 1)
					rooms[socket.room_id].userlist.push([socket.username, socket.priv])
					return
				}
			}
			
			return clients
		}

		catch(err)
		{
			console.error(err)
		}
	}

	function get_out(socket)
	{
		try
		{
			socket.emit('update', {type:'redirect', location:config.redirect_url})

			setTimeout(do_disconnect, 2000, socket)

			return false
		}

		catch(err)
		{
			console.error(err)
		}
	}
}