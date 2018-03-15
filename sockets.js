var handler = function(io, db_manager, config, sconfig, utilz, logger)
{
	const fs = require('fs')
	const path = require('path')
	const antiSpam  = require('socket-anti-spam')
	const fetch = require('node-fetch')
	const mongo = require('mongodb')
	const aws = require('aws-sdk')
	const jwt = require('jsonwebtoken')
	const images_root = path.join(__dirname, config.images_directory)

	var vtypes = ["voice1", "voice2", "voice3", "voice4"]
	var roles = ["admin", "op"].concat(vtypes)
	var image_types = ["image/jpeg", "image/png", "image/gif"]
	var image_extensions = ["jpg", "jpeg", "png", "gif"]

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

	const user_rooms = {}

	const files = {}

   	const files_struct = 
   	{
   		action: null,
		name: null, 
		type: null, 
		size: 0, 
		data: [], 
		slice: 0,
		date: null,
		updated: null,
		received: 0,
		extension: null,
		cancelled: false,
		spsize: 0
    }	

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
	})

	antiSpam.event.on('ban', function(socket, data)
	{
		socket.hue_kicked = true
		socket.hue_info1 = "the anti-spam system"
		handler.get_out(socket)
	})

	const dont_check_joined = ["join_room"]
	const dont_add_spam = ["slice_upload", "typing"]

	io.on("connection", function(socket)
	{
		try
		{
			handler.add_spam(socket)
			handler.connection(socket)
		}

		catch(err)
		{
			logger.log_error(err)
		}

		socket.on('server_method', function(data)
		{
			try
			{
				var m = data.server_method_name

				if(handler[m] === undefined)
				{
					return handler.get_out()
				}

				if(m === undefined)
				{
					return handler.get_out(socket)
				}

				if(dont_check_joined.indexOf(m) === -1)
				{
					if(!socket.hue_joined)
					{
						return handler.get_out(socket)
					}
				}

				if(dont_add_spam.indexOf(m) === -1)
				{
					handler.add_spam(socket)
				}

				handler[m](socket, data)
			}

			catch(err)
			{
				logger.log_error(err)				
			}
		})		

		socket.on('disconnect', function(reason)
		{
			try
			{
				reason = reason.toLowerCase()

				if(reason.indexOf('timeout') !== -1)
				{
					socket.hue_pinged = true
				}				

				handler.disconnect(socket)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})
	})

	handler.connection = function(socket)
	{
		socket.hue_pinged = false
		socket.hue_kicked = false
		socket.hue_banned = false
		socket.hue_joining = false
		socket.hue_joined = false
		socket.hue_superuser = false
		socket.hue_locked = false
		socket.hue_info1 = ""
		socket.hue_typing_counter = 0
	}

	handler.join_room = function(socket, data)
	{
		if(data.room_id === undefined)
		{
			return handler.do_disconnect(socket)
		}

		if(data.room_id.length > config.max_room_id_length)
		{
			return handler.do_disconnect(socket)
		} 			

		if(data.alternative)
		{
			data.email = data.email.trim()
			data.password = data.password.trim()

			if(data.email === undefined || data.password === undefined)
			{
				return handler.do_disconnect(socket)
			}

			if(data.email > config.max_max_email_length)
			{
				return handler.do_disconnect(socket)
			}

			if(data.password.length > config.max_max_password_length)
			{
				return handler.do_disconnect(socket)
			}
		}

		else
		{
			data.user_id = data.user_id.trim()

			if(data.user_id === undefined || data.token === undefined)
			{
				return handler.do_disconnect(socket)
			}

			if(data.user_id > config.max_user_id_length)
			{
				return handler.do_disconnect(socket)
			}

			if(data.token.length > config.max_jwt_token_length)
			{
				return handler.do_disconnect(socket)
			}
		}	

		if(data.alternative)
		{
			db_manager.check_password(data.email, data.password, 
			{
				email: true, 
				username: true, 
				profile_image: true, 
				registration_date: true
			})

			.then(ans =>
			{
				if(!ans.valid)
				{
					return handler.do_disconnect(socket)
				}

				var userinfo = ans.user

				socket.hue_user_id = userinfo._id.toString()

				db_manager.get_room({_id:data.room_id}, {})

				.then(info =>
				{
					if(!info)
					{
						return handler.do_disconnect(socket)
					}
	
					handler.do_join(socket, info, userinfo)

					db_manager.save_visited_room(socket.hue_user_id, data.room_id)

					.catch(err =>
					{
						logger.log_error(err)
					})
				})

				.catch(err =>
				{
					logger.log_error(err)
				})
			})
			
			.catch(err =>
			{
				logger.log_error(err)
			})				
		}

		else
		{
			jwt.verify(data.token, sconfig.jwt_secret, function(err, decoded) 
			{
				if(err)
				{
					return handler.do_disconnect(socket)				
				}

				else if(decoded.data === undefined || decoded.data.id === undefined)
				{
					return handler.do_disconnect(socket)
				}

				if(decoded.data.id !== data.user_id)
				{
					return handler.do_disconnect(socket)
				}			

				else
				{
					socket.hue_user_id = data.user_id

					db_manager.get_room({_id:data.room_id}, {})

					.then(info =>
					{
						if(!info)
						{
							return handler.do_disconnect(socket)
						}

						db_manager.get_user({_id:socket.hue_user_id}, 
						{
							email: true, 
							username: true, 
							profile_image: true, 
							registration_date: true
						})

						.then(userinfo =>
						{
							if(!userinfo)
							{
								return handler.do_disconnect(socket)
							}

							handler.do_join(socket, info, userinfo)

							db_manager.save_visited_room(socket.hue_user_id, data.room_id)

							.catch(err =>
							{
								logger.log_error(err)
							})
						})

						.catch(err =>
						{
							logger.log_error(err)
						})
					})

					.catch(err =>
					{
						logger.log_error(err)
					})
				}
			})
		}
	}

	handler.do_join = function(socket, info, userinfo)
	{
		socket.hue_room_id = info._id.toString()
		socket.hue_email = userinfo.email
		socket.hue_joining = true
		
		socket.join(socket.hue_room_id)		

		if(handler.check_multipe_joins(socket))
		{
			return handler.do_disconnect(socket)
		}

		if(sconfig.superuser_emails.indexOf(userinfo.email) !== -1)
		{
			socket.hue_superuser = true
		}

		socket.hue_username = userinfo.username

		socket.hue_ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress

		if(!socket.hue_superuser && info.bans.indexOf(socket.hue_user_id) !== -1)
		{
			socket.leave(socket.hue_room_id)
			socket.hue_locked = true

			handler.user_emit(socket, 'joined', 
			{
				room_locked: true	
			})

			return false
		}

		if(userinfo.profile_image === "")
		{
			socket.hue_profile_image = ""
		}

		else if(userinfo.profile_image.indexOf(sconfig.s3_main_url) === -1)
		{
			socket.hue_profile_image = config.public_images_location + userinfo.profile_image
		}

		else
		{
			socket.hue_profile_image = userinfo.profile_image
		}

		if(info.background_image === "")
		{
			var background_image = ""
		}

		else if(info.background_image.indexOf(sconfig.s3_main_url) === -1)
		{
			var background_image = config.public_images_location + info.background_image
		}

		else
		{
			var background_image = info.background_image
		}

		if(rooms[socket.hue_room_id] === undefined)
		{
			rooms[socket.hue_room_id] = handler.create_room_object(info)
		}

		socket.hue_role = info.keys[socket.hue_user_id]

		if(roles.indexOf(socket.hue_role) === -1)
		{
			socket.hue_role = 'voice1'
		}

		if(user_rooms[socket.hue_user_id] === undefined)
		{
			user_rooms[socket.hue_user_id] = []
		}

		if(user_rooms[socket.hue_user_id].indexOf(socket.hue_room_id) === -1)
		{
			user_rooms[socket.hue_user_id].push(socket.hue_room_id)
		}

		if(!handler.user_already_connected(socket))
		{
			handler.broadcast_emit(socket, 'userjoin',
			{
				username: socket.hue_username,
				role: socket.hue_role,
				profile_image: socket.hue_profile_image
			})

			if(rooms[socket.hue_room_id].userlist === undefined)
			{
				rooms[socket.hue_room_id].userlist = {}
			}

			rooms[socket.hue_room_id].userlist[socket.hue_user_id] = {}

			handler.update_user_in_userlist(socket)
		}

		handler.user_emit(socket, 'joined', 
		{
			room_locked: false,
			room_name: info.name,
			username: socket.hue_username, 
			image_url: info.image_url, 
			image_uploader: info.image_uploader, 
			image_size: info.image_size, 
			image_date: info.image_date, 
			image_type: info.image_type, 
			topic: info.topic, 
			topic_setter: info.topic_setter,
			topic_date: info.topic_date,
			userlist: utilz.object_to_array(handler.get_userlist(socket.hue_room_id)),
			log: info.log,
			log_messages: info.log_messages.concat(rooms[socket.hue_room_id].log_messages),
			role: socket.hue_role, 
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
			profile_image: socket.hue_profile_image,
			room_images_enabled: info.images_enabled,
			room_tv_enabled: info.tv_enabled,
			room_radio_enabled: info.radio_enabled,
			theme: info.theme,
			background_image: background_image,
			background_image_enabled: info.background_image_enabled,
			voice1_chat_permission: info.voice1_chat_permission,
			voice1_images_permission: info.voice1_images_permission,
			voice1_tv_permission: info.voice1_tv_permission,
			voice1_radio_permission: info.voice1_radio_permission,
			voice2_chat_permission: info.voice2_chat_permission,
			voice2_images_permission: info.voice2_images_permission,
			voice2_tv_permission: info.voice2_tv_permission,
			voice2_radio_permission: info.voice2_radio_permission,
			voice3_chat_permission: info.voice3_chat_permission,
			voice3_images_permission: info.voice3_images_permission,
			voice3_tv_permission: info.voice3_tv_permission,
			voice3_radio_permission: info.voice3_radio_permission,
			voice4_chat_permission: info.voice4_chat_permission,
			voice4_images_permission: info.voice4_images_permission,
			voice4_tv_permission: info.voice4_tv_permission,
			voice4_radio_permission: info.voice4_radio_permission,
			email: socket.hue_email,
			reg_date: userinfo.registration_date			
		})

		socket.hue_joining = false
		socket.hue_joined = true			
	}

	handler.sendchat = function(socket, data)
	{
		if(data.msg === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.msg.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.msg.length > config.max_input_length)
		{
			return handler.get_out(socket)
		}

		if(data.msg.length !== utilz.clean_string2(data.msg).length)
		{
			return handler.get_out(socket)
		}

		if(!handler.check_permission(socket, "chat"))
		{
			return false
		}

		handler.broadcast_emit(socket, 'chat_msg', 
		{ 
			username: socket.hue_username, 
			msg: data.msg,
			profile_image: socket.hue_profile_image
		})

		rooms[socket.hue_room_id].activity = true

		if(rooms[socket.hue_room_id].log)
		{
			var message = 
			{
				type: "chat",
				data: 
				{
					username: socket.hue_username,
					content: data.msg,
					profile_image: socket.hue_profile_image
				},
				date: Date.now()
			}

			rooms[socket.hue_room_id].log_messages.push(message)
		}
	}

	handler.change_topic = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.topic === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.topic.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.topic.length > config.max_topic_length)
		{
			return handler.get_out(socket)
		}

		if(data.topic.length !== utilz.clean_string2(data.topic).length)
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {topic:true})

		.then(info =>
		{
			var new_topic = data.topic

			if(new_topic !== info.topic)
			{
				info.topic = new_topic
				info.topic_setter = socket.hue_username
				info.topic_date = Date.now()

				handler.room_emit(socket, 'topic_change', 
				{
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
					logger.log_error(err)
				})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.change_room_name = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.name.length === 0 || data.name.length > config.max_room_name_length)
		{
			return handler.get_out(socket)
		}

		if(data.name.length !== utilz.clean_string2(data.name).length)
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {name:true})

		.then(info =>
		{
			if(info.name !== data.name)
			{
				info.name = data.name

				handler.room_emit(socket, 'room_name_changed', 
				{
					name: info.name,
					username: socket.hue_username
				})
				
				db_manager.update_room(info._id,
				{
					name: info.name
				})

				.catch(err =>
				{
					logger.log_error(err)
				})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.roomlist = function(socket, data)
	{
		if(data.type === "visited")
		{
			handler.get_visited_roomlist(socket.hue_user_id, function(rooms)
			{
				handler.user_emit(socket, 'roomlist', {roomlist:rooms})
			})
		}

		else if(data.type === "public")
		{
			handler.get_roomlist(function(rooms)
			{
				handler.user_emit(socket, 'roomlist', {roomlist:rooms})
			})
		}
	}

	handler.create_room = function(socket, data)
	{
		if(data.name.length === 0 || data.name.length > config.max_room_name_length)
		{
			return handler.get_out(socket)
		}

		if(data.name.length !== utilz.clean_string2(data.name).length)
		{
			return handler.get_out(socket)
		}

		if(data.public !== true && data.public !== false)
		{
			return handler.get_out(socket)
		}

		data.user_id = socket.hue_user_id

		if(socket.hue_superuser)
		{
			var force = true
		}

		else
		{
			var force = false
		}

		db_manager.user_create_room(data, force)

		.then(ans =>
		{
			if(ans === "wait")
			{
				handler.user_emit(socket, 'create_room_wait', {})
				return
			}
			
			handler.user_emit(socket, 'room_created', {id:ans._id.toString()})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.change_role = function(socket, data)
	{
		if(!socket.hue_superuser && (socket.hue_role !== 'admin' && socket.hue_role !== 'op'))
		{
			return handler.get_out(socket)
		}

		if(data.username === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.username.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.username.length > config.max_max_username_length)
		{
			return handler.get_out(socket)
		}

		if(roles.indexOf(data.role) === -1)
		{
			return handler.get_out(socket)
		}

		if(!socket.hue_superuser && (socket.hue_username === data.username))
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {keys:true})

		.then(info =>
		{
			db_manager.get_user({username:data.username}, {username:true})

			.then(userinfo =>
			{
				if(!userinfo)
				{
					handler.user_emit(socket, 'user_not_found', {})
					return false						
				}

				var id = userinfo._id.toString()

				var current_role = info.keys[id]

				if(!socket.hue_superuser)
				{
					if((current_role === 'admin' || current_role === 'op') && socket.hue_role !== 'admin')
					{
						handler.user_emit(socket, 'forbiddenuser', {})
						return false
					}
				}

				if(current_role === data.role || (current_role === undefined && data.role === "voice1"))
				{
					handler.user_emit(socket, 'isalready', {what:data.role, who:data.username})
					return false
				}

				var sockets = handler.get_user_sockets_per_room(socket.hue_room_id, id)

				var last_socc = false
				
				for(var socc of sockets)
				{
					if(socc.hue_superuser)
					{
						if(socket.hue_username !== socc.hue_username && socc.hue_role === "admin")
						{
							handler.user_emit(socket, 'forbiddenuser', {})
							return false		
						}
					}

					socc.hue_role = data.role
					last_socc = socc
				}

				if(last_socc)
				{
					handler.update_user_in_userlist(last_socc)
				}

				info.keys[id] = data.role
				
				db_manager.update_room(info._id, {keys:info.keys})

				.catch(err => 
				{
					logger.log_error(err)
				})

				handler.room_emit(socket, 'announce_role_change', 
				{ 
					username1: socket.hue_username, 
					username2: data.username, 
					role: data.role
				})
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.reset_voices = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {keys:true})

		.then(info =>
		{
			var removed = false

			for(var key in info.keys)
			{
				if(info.keys[key].startsWith("voice") && info.keys[key] !== "voice1")
				{
					delete info.keys[key]
					removed = true
				}
			}

			if(!removed)
			{
				handler.user_emit(socket, 'novoicestoreset', {})
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.hue_room_id].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.hue_role.startsWith("voice") && socc.hue_role !== "voice1")
				{
					socc.hue_role = 'voice1'

					handler.update_user_in_userlist(socc)
				}
			}
			
			db_manager.update_room(info._id, {keys:info.keys})

			.catch(err =>
			{
				logger.log_error(err)
			})

			handler.room_emit(socket, 'voices_resetted', {username:socket.hue_username})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})	
	}

	handler.remove_ops = function(socket, data)
	{
		if(socket.hue_role !== 'admin')
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {keys:true})

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
				handler.user_emit(socket, 'noopstoremove', {})
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.hue_room_id].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.hue_role === 'op')
				{
					socc.hue_role = ''

					handler.update_user_in_userlist(socc)
				}
			}
			
			handler.room_emit(socket, 'announce_removedops', {username:socket.hue_username})

			db_manager.update_room(info._id, {keys:info.keys})

			.catch(err =>
			{
				logger.log_error(err)
			})				
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.kick = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.username === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.username.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.username.length > config.max_max_username_length)
		{
			return handler.get_out(socket)
		}

		var sockets = handler.get_user_sockets_per_room_by_username(socket.hue_room_id, data.username)

		if(sockets.length > 0)
		{
			if(((sockets[0].role === 'admin' || sockets[0].role === 'op') && socket.hue_role !== 'admin') || sockets[0].superuser)
			{
				handler.user_emit(socket, 'forbiddenuser', {})
				return false
			}

			for(var socc of sockets)
			{
				socc.hue_role = ''
				socc.hue_kicked = true
				socc.hue_info1 = socket.hue_username
				
				handler.get_out(socc)
			}
		}

		else
		{
			handler.user_emit(socket, 'user_not_in_room', {})
			return false
		}		
	}	

	handler.ban = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.username === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.username.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.username.length > config.max_max_username_length)
		{
			return handler.get_out(socket)
		}			

		db_manager.get_room({_id:socket.hue_room_id}, {bans:true, keys:true})

		.then(info =>
		{
			db_manager.get_user({username:data.username}, {username:true})

			.then(userinfo =>
			{
				if(!userinfo)
				{
					handler.user_emit(socket, 'user_not_found', {})
					return false						
				}

				var id = userinfo._id.toString()
				
				var current_role = info.keys[id]

				if((current_role === 'admin' || current_role === 'op') && socket.hue_role !== 'admin')
				{
					handler.user_emit(socket, 'forbiddenuser', {})
					return false
				}

				if(info.bans.indexOf(id) !== -1)
				{
					handler.user_emit(socket, 'user_already_banned', {})

					return false						
				}

				var sockets = handler.get_user_sockets_per_room(socket.hue_room_id, id)

				if(sockets.length > 0)
				{
					for(var socc of sockets)
					{
						if(socc.hue_superuser)
						{
							handler.user_emit(socket, 'forbiddenuser', {})							
							return false
						}

						socc.hue_role = ''
						socc.hue_banned = true
						socc.hue_info1 = socket.hue_username
						handler.get_out(socc)
					}
				}

				else
				{
					handler.room_emit(socket, 'announce_ban', 
					{
						username1: socket.hue_username, 
						username2: data.username
					})						
				}
				
				info.bans.push(id)

				db_manager.update_room(info._id, {bans:info.bans})

				.catch(err =>
				{
					logger.log_error(err)
				})
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.unban = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.username === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.username.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.username.length > config.max_max_username_length)
		{
			return handler.get_out(socket)
		}			

		db_manager.get_room({_id:socket.hue_room_id}, {bans:true, keys:true})

		.then(info =>
		{
			db_manager.get_user({username:data.username}, {username:true})

			.then(userinfo =>
			{
				if(!userinfo)
				{
					handler.user_emit(socket, 'user_not_found', {})
					return false						
				}

				var id = userinfo._id.toString()

				if(info.bans.indexOf(id) === -1)
				{
					handler.user_emit(socket, 'user_already_unbanned', {})

					return false
				}

				for(var i=0; i<info.bans.length; i++)
				{
					if(info.bans[i] === id)
					{
						info.bans.splice(i, 1)
						break
					}
				}

				db_manager.update_room(info._id, {bans:info.bans})

				.catch(err =>
				{
					logger.log_error(err)
				})

				handler.room_emit(socket, 'announce_unban', 
				{ 
					username1: socket.hue_username, 
					username2: data.username
				})					
			})

			.catch(err =>
			{
				logger.log_error(err)
			})				
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.unban_all = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {bans:true})

		.then(info =>
		{
			if(info.bans.length > 0)
			{
				info.bans = []
				
				db_manager.update_room(info._id, {bans:info.bans})

				.catch(err =>
				{
					logger.log_error(err)
				})

				handler.room_emit(socket, 'announce_unban_all', {username:socket.hue_username})
			}

			else
			{
				handler.user_emit(socket, 'nothingtounban', {})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.get_banned_count = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {bans:true})

		.then(info =>
		{
			if(info.bans === '')
			{
				var count = 0
			}

			else
			{
				var count = info.bans.length
			}

			handler.user_emit(socket, 'receive_banned_count', {count:count})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.change_log = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return false
		}

		if(data.log !== true && data.log !== false)
		{
			return handler.get_out(socket)
		}

		db_manager.get_room({_id:socket.hue_room_id}, {log:true})

		.then(info =>
		{
			if(info.log !== data.log)
			{
				if(!data.log)
				{
					rooms[socket.hue_room_id].log_messages = []

					db_manager.update_room(socket.hue_room_id, {log:data.log, log_messages:[]})

					.catch(err =>
					{
						logger.log_error(err)
					})						
				}

				else
				{
					db_manager.update_room(socket.hue_room_id, {log:data.log})

					.catch(err =>
					{
						logger.log_error(err)
					})						
				}

				rooms[socket.hue_room_id].log = data.log

				handler.room_emit(socket, 'log_changed', {username:socket.hue_username, log:data.log})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.clear_log = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return false
		}

		db_manager.get_room({_id:socket.hue_room_id}, {log_messages:true})

		.then(info =>
		{
			if(info.log_messages.length > 0)
			{
				rooms[socket.hue_room_id].log_messages = []

				db_manager.update_room(socket.hue_room_id, {log_messages:[]})

				.catch(err =>
				{
					logger.log_error(err)
				})					

				handler.room_emit(socket, 'log_cleared', {username:socket.hue_username})
			}

			else
			{
				handler.user_emit(socket, 'nothingtoclear', {})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	handler.change_privacy = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return handler.get_out(socket)
		}

		db_manager.update_room(socket.hue_room_id, {public:data.what})

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'privacy_change', {username:socket.hue_username, what:data.what})
	}

	handler.change_radio_source = function(socket, data)
	{
		if(data.src === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.src.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.src.length > config.max_radio_source_length)
		{
			return handler.get_out(socket)
		}

		if(!handler.check_permission(socket, "radio"))
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

				var id = utilz.get_youtube_id(data.src)

				if(id)
				{
					if(id[0] === "video")
					{
						var st = "videos"
						var pid = id[1]
					}

					else if(id[0] === "list")
					{
						var st = "playlists"
						var pid = id[1][0]
					}

					else
					{
						handler.user_emit(socket, 'songnotfound', {})
						return false							
					}						

					fetch(`https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${sconfig.youtube_api_key}`)
					
					.then(function(res)
					{
						return res.json()
					})

					.then(function(response)
					{
						if(response.items !== undefined && response.items.length > 0)
						{
							data.type = "youtube"
							data.title = response.items[0].snippet.title
							handler.do_change_radio_source(socket, data)
						}

						else
						{
							handler.user_emit(socket, 'songnotfound', {})
						}
					})

					.catch(err =>
					{
						logger.log_error(err)
					})
				}

				else
				{
					handler.user_emit(socket, 'songnotfound', {})
					return false						
				}
			}

			else
			{
				data.type = "radio"
				data.title = ""
				handler.do_change_radio_source(socket, data)
			}
		}

		else if(data.src === "restart" || data.src === "reset")
		{
			db_manager.get_room({_id:socket.hue_room_id}, 
			{
				radio_type: true,
				radio_source: true,
				radio_title: true,
				radio_setter: true,
				radio_date: true
			})

			.then(info =>
			{
				handler.room_emit(socket, 'restarted_radio_source', 
				{ 
					radio_type: info.radio_type,
					radio_source: info.radio_source,
					radio_title: info.radio_title,
					radio_setter: info.radio_setter,
					radio_date: info.radio_date,
					username: socket.hue_username
				})
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}

		else
		{
			if(!config.youtube_enabled)
			{
				return
			}

			fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(data.src)}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&key=${sconfig.youtube_api_key}`).then(function(res)
			{
				return res.json()
			})

			.then(function(response)
			{
				if(response.items !== undefined && response.items.length > 0)
				{
					for(var item of response.items)
					{
						if(item === undefined || item.id === undefined || item.id.videoId === undefined)
						{
							continue
						}

						data.type = "youtube"
						data.src = `https://youtube.com/watch?v=${item.id.videoId}`
						data.title = response.items[0].snippet.title
						handler.do_change_radio_source(socket, data)
						return
					}

					handler.user_emit(socket, 'songnotfound', {})
					return false						
				}

				else
				{
					handler.user_emit(socket, 'songnotfound', {})
				}							
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}
	}

	handler.change_tv_source = function(socket, data)
	{
		if(data.src === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.src.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.src.length > config.max_tv_source_length)
		{
			return handler.get_out(socket)
		}

		if(!handler.check_permission(socket, "tv"))
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

				var id = utilz.get_youtube_id(data.src)

				if(id)
				{
					if(id[0] === "video")
					{
						var st = "videos"
						var pid = id[1]
					}

					else if(id[0] === "list")
					{
						var st = "playlists"
						var pid = id[1][0]
					}

					else
					{
						handler.user_emit(socket, 'videonotfound', {})
						return false							
					}

					fetch(`https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${sconfig.youtube_api_key}`)

					.then(function(res)
					{
						return res.json()
					})

					.then(function(response)
					{
						if(response.items !== undefined && response.items.length > 0)
						{
							data.type = "youtube"
							data.title = response.items[0].snippet.title
							handler.do_change_tv_source(socket, data)
						}

						else
						{
							handler.user_emit(socket, 'videonotfound', {})
							return false
						}
					})

					.catch(err =>
					{
						handler.user_emit(socket, 'videonotfound', {})
						logger.log_error(err)
					})
				}

				else
				{
					handler.user_emit(socket, 'videonotfound', {})						
				}
			}

			else if(data.src.indexOf("twitch.tv") !== -1)
			{
				if(!config.twitch_enabled)
				{
					return
				}
				
				var id = utilz.get_twitch_id(data.src)

				if(id)
				{
					if(id[0] === "video")
					{

						fetch(`https://api.twitch.tv/helix/videos?id=203574636`,
						{
							headers: 
							{
								"Client-ID": sconfig.twitch_api_key
							}	
						})

						.then(function(res)
						{
							return res.json()
						})

						.then(function(response)
						{
							data.type = "twitch"
							data.title = response.data[0].title
							handler.do_change_tv_source(socket, data)
						})

						.catch(err =>
						{
							handler.user_emit(socket, 'videonotfound', {})								
							logger.log_error(err)
						})
					}

					else if(id[0] === "channel")
					{
						data.type = "twitch"
						data.title = id[1]
						handler.do_change_tv_source(socket, data)
					}

					else
					{
						handler.user_emit(socket, 'videonotfound', {})
						return false
					}
				}

				else
				{
					handler.user_emit(socket, 'videonotfound', {})						
				}					
			}

			else
			{
				data.type = "url"
				data.title = ""
				handler.do_change_tv_source(socket, data)
			}
		}

		else if(data.src === "restart" || data.src === "reset")
		{
			db_manager.get_room({_id:socket.hue_room_id}, 
			{
				tv_type: true,
				tv_source: true,
				tv_title: true,
				tv_setter: true,
				tv_date: true
			})

			.then(info =>
			{
				handler.room_emit(socket, 'restarted_tv_source', 
				{ 
					tv_type: info.tv_type,
					tv_source: info.tv_source,
					tv_title: info.tv_title,
					tv_setter: info.tv_setter,
					tv_date: info.tv_date,
					username: socket.hue_username
				})
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}

		else
		{
			if(!config.youtube_enabled)
			{
				return
			}

			fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(data.src)}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&key=${sconfig.youtube_api_key}`)

			.then(function(res)
			{
				return res.json()
			})

			.then(function(response)
			{
				if(response.items !== undefined && response.items.length > 0)
				{
					for(var item of response.items)
					{
						if(item === undefined || item.id === undefined || item.id.videoId === undefined)
						{
							continue
						}

						data.type = "youtube"
						data.src = `https://youtube.com/watch?v=${item.id.videoId}`
						data.title = response.items[0].snippet.title
						handler.do_change_tv_source(socket, data)
						return
					}

					handler.user_emit(socket, 'videonotfound', {})
					return false						
				}

				else
				{
					handler.user_emit(socket, 'videonotfound', {})
				}						
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}
	}

	handler.do_change_radio_source = function(socket, data)
	{	
		var radioinfo = {}

		var date = Date.now()

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

		radioinfo.radio_setter = socket.hue_username
		radioinfo.radio_date = date

		handler.room_emit(socket, 'changed_radio_source', 
		{ 
			radio_type: radioinfo.radio_type,
			radio_source: radioinfo.radio_source,
			radio_title: radioinfo.radio_title,
			radio_setter: radioinfo.radio_setter,
			radio_date: radioinfo.radio_date
		})

		db_manager.update_room(socket.hue_room_id,
		{
			radio_type: radioinfo.radio_type,
			radio_source: radioinfo.radio_source,
			radio_title: radioinfo.radio_title,
			radio_setter: radioinfo.radio_setter,
			radio_date: radioinfo.radio_date
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		rooms[socket.hue_room_id].activity = true
		
		if(rooms[socket.hue_room_id].log)
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
				date: date
			}

			rooms[socket.hue_room_id].log_messages.push(message)
		}		
	}

	handler.do_change_tv_source = function(socket, data)
	{	
		var tvinfo = {}

		var date = Date.now()

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

		tvinfo.tv_setter = socket.hue_username
		tvinfo.tv_date = date

		handler.room_emit(socket, 'changed_tv_source', 
		{
			tv_type: tvinfo.tv_type,
			tv_source: tvinfo.tv_source,
			tv_title: tvinfo.tv_title,
			tv_setter: tvinfo.tv_setter,
			tv_date: tvinfo.tv_date
		})

		db_manager.update_room(socket.hue_room_id,
		{
			tv_type: tvinfo.tv_type,
			tv_source: tvinfo.tv_source,
			tv_title: tvinfo.tv_title,
			tv_setter: tvinfo.tv_setter,
			tv_date: tvinfo.tv_date
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		rooms[socket.hue_room_id].activity = true
		
		if(rooms[socket.hue_room_id].log)
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
				date: date
			}

			rooms[socket.hue_room_id].log_messages.push(message)
		}		
	}

	handler.change_username = function(socket, data)
	{
		if(data.username === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.username.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.username.length > config.max_username_length)
		{
			return handler.get_out(socket)
		}

		if(utilz.clean_string4(data.username).length !== data.username.length)
		{
			return handler.get_out(socket)
		}

		var old_username = socket.hue_username

		db_manager.change_username(socket.hue_user_id, data.username)

		.then(done =>
		{
			if(done)
			{
				for(var room_id of user_rooms[socket.hue_user_id])
				{
					for(var socc of handler.get_user_sockets_per_room(room_id, socket.hue_user_id))
					{
						socc.hue_username = data.username
					}

					handler.update_user_in_userlist(socket)

					handler.room_emit(room_id, 'new_username',
					{
						username: data.username, 
						old_username: old_username
					})
				}
			}

			else
			{
				handler.user_emit(socket, 'username_already_exists', {username:data.username})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.change_password = function(socket, data)
	{
		if(data.password === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.password.length === 0 || data.password.length < config.min_password_length)
		{
			return handler.get_out(socket)
		}

		if(data.password.length > config.max_password_length)
		{
			return handler.get_out(socket)
		}

		db_manager.update_user(socket.hue_user_id,
		{
			password: data.password,
			password_date: Date.now()
		})

		.catch(err =>
		{
			logger.log_error(err)
		})			

		handler.user_emit(socket, 'password_changed', {password:data.password})
	}

	handler.change_email = function(socket, data)
	{
		if(data.email === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.email.indexOf('@') === -1 || data.email.indexOf(' ') !== -1)
		{
			return handler.get_out(socket)
		}			

		if(data.email.length > config.max_email_length)
		{
			return handler.get_out(socket)
		}

		if(utilz.clean_string5(data.email).length !== data.email.length)
		{
			return handler.get_out(socket)
		}		

		db_manager.change_email(socket.hue_user_id, data.email)

		.then(ans =>
		{
			if(ans.msg === "error")
			{
				handler.user_emit(socket, 'error_occurred', {})
				return
			}

			else if(ans.msg === "duplicate")
			{
				handler.user_emit(socket, 'email_already_exists', {email:data.email})
				return
			}

			else if(ans.msg === "wait")
			{
				handler.user_emit(socket, 'email_change_wait', {})
				return
			}

			else if(ans.msg === "sent_code")
			{
				handler.user_emit(socket, 'email_change_code_sent', {email:data.email})
				return
			}
		})		

		.catch(err =>
		{
			logger.log_error(err)
		})	
	}

	handler.verify_email = function(socket, data)
	{
		if(utilz.clean_string5(data.code).length !== data.code.length)
		{
			return handler.get_out(socket)
		}

		if(data.code.length === 0)
		{
			return handler.get_out(socket)
		}
		
		if(data.code.length > config.email_change_code_max_length)
		{
			return handler.get_out(socket)
		}

		db_manager.change_email(socket.hue_user_id, data.email, data.code)

		.then(ans =>
		{
			if(ans.msg === "error")
			{
				handler.user_emit(socket, 'error_occurred', {})
				return
			}

			else if(ans.msg === "duplicate")
			{
				handler.user_emit(socket, 'email_already_exists', {email:data.email})
				return
			}

			else if(ans.msg === "not_sent")
			{
				handler.user_emit(socket, 'email_change_code_not_sent', {email:data.email})
				return
			}

			else if(ans.msg === "wrong_code")
			{
				handler.user_emit(socket, 'email_change_wrong_code', {email:data.email})
				return
			}

			else if(ans.msg === "expired_code")
			{
				handler.user_emit(socket, 'email_change_expired_code', {email:data.email})
				return
			}

			else if(ans.msg === "changed")
			{
				for(var room_id of user_rooms[socket.hue_user_id])
				{
					for(var socc of handler.get_user_sockets_per_room(room_id, socket.hue_user_id))
					{
						socc.hue_email = data.email
					}

					handler.update_user_in_userlist(socket)
				}

				handler.user_emit(socket, 'email_changed', {email:ans.email})
			}
		})		

		.catch(err =>
		{
			logger.log_error(err)
		})
	}	

	handler.change_images_enabled = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return handler.get_out(socket)
		}

		db_manager.update_room(socket.hue_room_id,
		{
			images_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'room_images_enabled_change', 
		{
			what: data.what,
			username: socket.hue_username
		})
	}

	handler.change_tv_enabled = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return handler.get_out(socket)
		}

		db_manager.update_room(socket.hue_room_id,
		{
			tv_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'room_tv_enabled_change',
		{
			what: data.what,
			username: socket.hue_username
		})
	}

	handler.change_radio_enabled = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return handler.get_out(socket)
		}

		db_manager.update_room(socket.hue_room_id,
		{
			radio_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'room_radio_enabled_change', 
		{
			what: data.what,
			username: socket.hue_username
		})
	}

	handler.change_theme = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.color === undefined)
		{
			return handler.get_out(socket)
		}

		db_manager.update_room(socket.hue_room_id,
		{
			theme: data.color
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'theme_change',
		{
			color: data.color,
			username: socket.hue_username
		})
	}

	handler.change_background_image_enabled = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return handler.get_out(socket)
		}

		db_manager.update_room(socket.hue_room_id,
		{
			background_image_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'background_image_enabled_change', 
		{
			what: data.what,
			username: socket.hue_username
		})
	}

	handler.change_voice_permission = function(socket, data)
	{
		if(socket.hue_role !== 'admin' && socket.hue_role !== 'op')
		{
			return handler.get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return handler.get_out(socket)
		}

		if(data.ptype === undefined)
		{
			return handler.get_out(socket)
		}

		if(rooms[socket.hue_room_id][data.ptype] === undefined)
		{
			return handler.get_out(socket)
		}

		rooms[socket.hue_room_id][data.ptype] = data.what			

		var obj = {}

		obj[data.ptype] = data.what

		db_manager.update_room(socket.hue_room_id, obj)

		.catch(err =>
		{
			logger.log_error(err)
		})

		handler.room_emit(socket, 'voice_permission_change', 
		{
			ptype: data.ptype,
			what: data.what,
			username: socket.hue_username
		})
	}	

	handler.do_disconnect = function(socc)
	{
		socc.disconnect()
		return false
	}

	handler.disconnect = function(socket)
	{
		if(handler.user_already_connected(socket))
		{
			return
		}

		if(socket.hue_pinged)
		{
			var type = 'pinged'
		}

		else if(socket.hue_kicked)
		{
			var type = 'kicked'
		}

		else if(socket.hue_banned)
		{
			var type = 'banned'
		}

		else
		{
			var type = 'disconnection'
		}

		handler.room_emit(socket, type, 
		{
			username: socket.hue_username,
			info1: socket.hue_info1, 
			role: socket.hue_role
		})

		if(socket.hue_room_id === undefined)
		{
			return
		}

		if(rooms[socket.hue_room_id] === undefined)
		{
			return
		}

		if(rooms[socket.hue_room_id].userlist !== undefined)
		{
			delete rooms[socket.hue_room_id].userlist[socket.hue_user_id]
		}

		if(user_rooms[socket.hue_user_id] !== undefined)
		{
			for(var i=0; i<user_rooms[socket.hue_user_id].length; i++)
			{
				var room_id = user_rooms[socket.hue_user_id][i]

				if(socket.hue_room_id === room_id)
				{
					user_rooms[socket.hue_user_id].splice(i, 1)
					break
				}
			}

			if(user_rooms[socket.hue_user_id].length === 0)
			{
				delete user_rooms[socket.hue_user_id]
			}
		}
	}	

	handler.compare_roomlist = function(a, b)
	{
		if(a.usercount < b.usercount) 
		{
			return 1
		}

		if(a.usercount > b.usercount) 
		{
			return -1
		}

		if(a.usercount === b.usercount)
		{
			if(a.modified < b.modified) 
			{
				return 1
			}

			if(a.modified > b.modified) 
			{
				return -1
			}

			return 0
		}
	}

	handler.get_userlist = function(room_id)
	{
		try
		{
			if(rooms[room_id] === undefined)
			{
				return {}
			}

			if(rooms[room_id].userlist !== undefined)
			{
				return rooms[room_id].userlist
			}

			else
			{
				return {}
			}
		}

		catch(err)
		{
			return {}
		}
	}

	handler.get_usercount = function(room_id)
	{
		return Object.keys(handler.get_userlist(room_id)).length
	}

	handler.get_roomlist = function(callback)
	{
		if(last_roomlist === undefined || (Date.now() - roomlist_lastget > config.roomlist_cache))
		{
			var roomlist = []

			var md = Date.now() - config.roomlist_max_inactivity

			db_manager.find_rooms({public:true, modified:{$gt:md}})

			.then(results =>
			{
				if(!results)
				{
					return false
				}

				for(var i=0; i<results.length; i++)
				{
					var room = results[i]

					roomlist.push({id:room._id.toString(), name:room.name, topic:room.topic.substring(0, config.max_roomlist_topic_length), usercount:handler.get_usercount(room._id.toString()), modified:room.modified})
				}

				roomlist.sort(handler.compare_roomlist).splice(config.max_roomlist_items)

				last_roomlist = roomlist

				roomlist_lastget = Date.now()

				callback(last_roomlist)
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}

		else
		{
			callback(last_roomlist)
		}
	}

	handler.get_visited_roomlist = function(user_id, callback)
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

					roomlist.push({id:room._id.toString(), name:room.name, topic:room.topic.substring(0, config.max_roomlist_topic_length), usercount:handler.get_usercount(room._id.toString()), modified:room.modified})
				}

				roomlist.sort(handler.compare_roomlist)			

				callback(roomlist)
			})

			.catch(err =>
			{
				logger.log_error(err)
			})		
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.linked_image = function(socket, data)
	{
		if(data.image_url === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.image_url.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.image_url.length > config.max_image_source_length)
		{
			return handler.get_out(socket)
		}

		if(!handler.check_permission(socket, "images"))
		{
			return false
		}	

		data.image_url = data.image_url.replace(/\s/g,'').replace(/\.gifv/g,'.gif')

		handler.change_image(socket.hue_room_id, data.image_url, socket.hue_username, 0, "link")
	}

	handler.upload_image = function(socket, data)
	{
		if(data.image_file === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.extension === undefined)
		{
			return handler.get_out(socket)
		}

		if(!handler.check_permission(socket, "images"))
		{
			return false
		}

		var size = data.image_file.toString('ascii').length / 1024

		if(size === 0 || (size > config.max_image_size))
		{
			handler.user_emit(socket, 'upload_error', {})													
			return false
		}

		var fname = `${socket.hue_room_id}_${Date.now()}_${utilz.get_random_int(0, 1000)}.${data.extension}`

		fs.writeFile(images_root + '/' + fname, data.image_file, function(err, data) 
		{
			if(err) 
			{
				handler.user_emit(socket, 'upload_error', {})
			}

			else 
			{
				handler.change_image(socket.hue_room_id, fname, socket.hue_username, size, "upload")
			}
		})
	}	

	handler.change_image = function(room_id, fname, uploader, size, type)
	{
		if(type === "link")
		{
			handler.do_change_image(room_id, fname, uploader, size, type)
		}

		else if(type === "upload")
		{
			if(config.image_storage_s3_or_local === "local")
			{
				handler.do_change_image(room_id, fname, uploader, size, type)
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
						ContentType: handler.get_content_type(fname),
						Body: data,
						Bucket: sconfig.s3_bucket_name, 
						Key: `${sconfig.s3_images_location}${fname}`,
						CacheControl: `max-age=${sconfig.s3_cache_max_age}`
					}).promise()

					.then(ans =>
					{
						fs.unlink(`${images_root}/${fname}`, function(){})
						handler.do_change_image(room_id, sconfig.s3_main_url + sconfig.s3_images_location + fname, uploader, size, type)
					})

					.catch(err =>
					{					
						fs.unlink(`${images_root}/${fname}`, function(){})
						logger.log_error(err)
					})
				})
			}

			else
			{
				return false
			}
		}
	}

	handler.do_change_image = function(room_id, fname, uploader, size, type)
	{
		var image_url

		var date = Date.now()

		if(type === "link")
		{
			var image_url = fname

			db_manager.update_room(room_id,
			{
				image_url: image_url, 
				image_uploader: uploader, 
				image_size: size, 
				image_date: date,
				image_type: type
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}

		else if(type === "upload")
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

			db_manager.get_room({_id:room_id}, {stored_images:true})

			.then(info =>
			{
				info.stored_images.unshift(fname)

				var spliced = false
				
				if(info.stored_images.length > config.max_stored_images)
				{
					var spliced = info.stored_images.splice(config.max_stored_images, info.stored_images.length)
				}

				db_manager.update_room(room_id,
				{
					image_url: image_url, 
					image_uploader: uploader, 
					image_size: size, 
					image_date: date,
					stored_images: info.stored_images,
					image_type: type
				})

				.catch(err =>
				{
					logger.log_error(err)
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
								logger.log_error(err)
							})
						}
					}
				}			
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}

		else
		{
			return false
		}

		if(image_url === undefined)
		{
			return false
		}

		handler.room_emit(room_id, 'image_change',
		{
			image_url: image_url,
			image_uploader: uploader,
			image_size: size,
			image_date: date,
			image_type: type
		})

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
					image_size: size,
					image_type: type
				},
				date: date
			}

			rooms[room_id].log_messages.push(message)
		}				
	}

	handler.upload_profile_image = function(socket, data)
	{
		if(data.image_file === undefined)
		{
			return handler.get_out(socket)
		}

		var size = data.image_file.toString('ascii').length / 1024

		if(size === 0 || (size > config.max_profile_image_size))
		{
			handler.user_emit(socket, 'upload_error', {})													
			return false
		}

		var fname = `profile_${socket.hue_user_id}.jpg`

		fs.writeFile(images_root + '/' + fname, data.image_file, function(err, data) 
		{
			if(err) 
			{
				handler.user_emit(socket, 'upload_error', {})
			}

			else 
			{
				handler.change_profile_image(socket, fname)
			}
		})
	}	

	handler.change_profile_image = function(socket, fname)
	{
		if(config.image_storage_s3_or_local === "local")
		{
			handler.do_change_profile_image(socket, fname)
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
					ContentType: handler.get_content_type(fname),
					Body: data,
					Bucket: sconfig.s3_bucket_name, 
					Key: `${sconfig.s3_images_location}${fname}`,
					CacheControl: `max-age=${sconfig.s3_cache_max_age}`
				}).promise()

				.then(ans =>
				{
					fs.unlink(`${images_root}/${fname}`, function(){})
					handler.do_change_profile_image(socket, sconfig.s3_main_url + sconfig.s3_images_location + fname)
				})

				.catch(err =>
				{					
					fs.unlink(`${images_root}/${fname}`, function(){})
					logger.log_error(err)
				})
			})
		}

		else
		{
			return false
		}
	}

	handler.do_change_profile_image = function(socket, fname)
	{
		db_manager.get_user({_id:socket.hue_user_id}, {profile_image_version:true})		

		.then(userinfo =>
		{
			var new_ver = userinfo.profile_image_version + 1

			var fver = `${fname}?ver=${new_ver}`

			if(config.image_storage_s3_or_local === "local")
			{
				var image_url = config.public_images_location + fver
			}

			else if(config.image_storage_s3_or_local === "s3")
			{
				var image_url = fver
			}

			db_manager.update_user(socket.hue_user_id,
			{
				profile_image: fver,
				profile_image_version: new_ver
			})

			.then(ans =>
			{
				for(var room_id of user_rooms[socket.hue_user_id])
				{
					for(var socc of handler.get_user_sockets_per_room(room_id, socket.hue_user_id))
					{
						socc.hue_profile_image = image_url
					}
					
					handler.update_user_in_userlist(socket)

					handler.room_emit(room_id, 'profile_image_changed',
					{
						username: socket.hue_username,
						profile_image: image_url
					})
				}
			})

			.catch(err =>
			{
				logger.log_error(err)
			})		
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.upload_background_image = function(socket, data)
	{
		if(data.image_file === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.extension === undefined)
		{
			return handler.get_out(socket)
		}			

		var size = data.image_file.toString('ascii').length / 1024

		if(size === 0 || (size > config.max_image_size))
		{
			handler.user_emit(socket, 'upload_error', {})													
			return false
		}

		var fname = `bg_${socket.hue_room_id}_${Date.now()}_${utilz.get_random_int(0, 1000)}.${data.extension}`

		fs.writeFile(images_root + '/' + fname, data.image_file, function(err, data) 
		{
			if(err) 
			{
				handler.user_emit(socket, 'upload_error', {})
			}

			else 
			{
				handler.change_background_image(socket, fname)
			}
		})
	}

	handler.change_background_image = function(socket, fname)
	{
		if(config.image_storage_s3_or_local === "local")
		{
			handler.do_change_background_image(socket, fname)
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
					ContentType: handler.get_content_type(fname),
					Body: data,
					Bucket: sconfig.s3_bucket_name, 
					Key: `${sconfig.s3_images_location}${fname}`,
					CacheControl: `max-age=${sconfig.s3_cache_max_age}`
				}).promise()

				.then(ans =>
				{
					fs.unlink(`${images_root}/${fname}`, function(){})
					handler.do_change_background_image(socket, sconfig.s3_main_url + sconfig.s3_images_location + fname)
				})

				.catch(err =>
				{					
					fs.unlink(`${images_root}/${fname}`, function(){})
					logger.log_error(err)
				})
			})
		}

		else
		{
			return false
		}
	}

	handler.do_change_background_image = function(socket, fname)
	{
		db_manager.get_room({_id:socket.hue_room_id}, {background_image:true})		

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

			if(info !== "")
			{
				var to_delete = info.background_image
			}

			else
			{
				var to_delete = false
			}

			db_manager.update_room(socket.hue_room_id,
			{
				background_image: fname
			})

			.then(ans =>
			{
				handler.room_emit(socket, 'background_image_change',
				{
					username: socket.hue_username,
					background_image: image_url
				})
			})

			.catch(err =>
			{
				logger.log_error(err)
			})

			if(to_delete)
			{
				if(to_delete.indexOf(sconfig.s3_main_url) === -1)
				{
					fs.unlink(`${images_root}/${to_delete}`, function(err){})
				}

				else
				{
					s3.deleteObject(
					{
						Bucket: sconfig.s3_bucket_name,
						Key: to_delete.replace(sconfig.s3_main_url, "")
					}).promise()

					.catch(err =>
					{
						logger.log_error(err)
					})
				}				
			}	
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	handler.slice_upload = function(socket, data)
	{
		if(data.action === "image_upload")
		{
			if(!handler.check_permission(socket, "images"))
			{
				return false
			}
		}

		if(data.data.length > config.upload_slice_size)
		{
			return handler.get_out(socket)
		}

		var key = `${socket.hue_user_id}_${data.date}`

		var file = files[key]

		if(!file) 
		{
			handler.add_spam(socket)

			if(image_types.indexOf(data.type) === -1)
			{
				return handler.get_out(socket)
			}

			var ext = data.name.split('.').pop(-1).toLowerCase()

			if(!handler.valid_image_extension(ext))
			{
				return handler.get_out(socket)
			}

			data.extension = ext

			files[key] = Object.assign({}, files_struct, data)

			file = files[key]
			
			file.data = []
		}

		if(file.cancelled)
		{
			delete file
			return false
		}

		data.data = new Buffer(new Uint8Array(data.data))

		file.data.push(data.data)

		file.slice++

		file.received += data.data.length

		var fsize = file.received / 1024

		if(fsize > config.max_image_size)
		{
			delete files[key]
			return handler.get_out(socket)
		}

		var spsize = Math.floor(fsize / (config.max_image_size / 20))

		if(file.spsize !== spsize)
		{
			handler.add_spam(socket)
			file.spsize = spsize
		}

		file.updated = Date.now()
		
		if(file.slice * config.upload_slice_size >= file.size) 
		{  
			handler.user_emit(socket, 'upload_ended', {date:data.date})

			var full_file = Buffer.concat(file.data)

			if(data.action === "image_upload")
			{
				handler.upload_image(socket,
				{
					image_file: full_file,
					extension: file.extension
				})
			}

			else if(data.action === "profile_image_upload")
			{
				handler.upload_profile_image(socket,
				{
					image_file: full_file
				})	
			}

			else if(data.action === "background_image_upload")
			{
				handler.upload_background_image(socket,
				{
					image_file: full_file,
					extension: file.extension
				})	
			}

			delete files[key] 
		}

		else 
		{ 
			handler.user_emit(socket, 'request_slice_upload', 
			{ 
				current_slice: file.slice,
				date: data.date
			})
		}
	}

	handler.cancel_upload = function(socket, data)
	{
		var key = `${socket.hue_user_id}_${data.date}`		
		
		var file = files[key]

		if(file)
		{
			file.cancelled = true
		}
	}

	handler.typing = function(socket, data)
	{
		if(!handler.check_permission(socket, "chat"))
		{
			return false
		}

		socket.hue_typing_counter += 1

		if(socket.hue_typing_counter >= 100)
		{
			handler.add_spam(socket)
			socket.hue_typing_counter = 0
		}		

		handler.broadcast_emit(socket, 'typing', {username:socket.hue_username})
	}

	handler.whisper = function(socket, data)
	{
		if(data.username === undefined)
		{
			return handler.get_out(socket)
		}

		if(data.username.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.username.length > config.max_max_username_length)
		{
			return handler.get_out(socket)
		}

		if(data.username === socket.hue_username)
		{
			return handler.get_out(socket)
		}

		if(data.message.length === 0)
		{
			return handler.get_out(socket)
		}

		if(data.message.length > config.max_input_length)
		{
			return handler.get_out(socket)
		}

		if(data.message.length !== utilz.clean_string2(data.message).length)
		{
			return handler.get_out(socket)
		}

		if(!handler.check_permission(socket, "chat"))
		{
			return false
		}			

		var sockets = handler.get_user_sockets_per_room_by_username(socket.hue_room_id, data.username)

		if(sockets.length > 0)
		{
			for(var socc of sockets)
			{
				handler.user_emit(socc, 'whisper', 
				{
					room: socket.hue_room_id,
					username: socket.hue_username,
					message: data.message
				})
			}
		}

		else
		{
			handler.user_emit(socket, 'user_not_in_room', {})
		}
	}	

	handler.disconnect_others = function(socket, data)
	{
		var amount = 0

		for(var room_id of user_rooms[socket.hue_user_id])
		{
			for(var socc of handler.get_user_sockets_per_room(room_id, socket.hue_user_id))
			{
				if(socc.id !== socket.id)
				{
					socc.disconnect()
					amount += 1
				}
			}
		}

		handler.user_emit(socket, 'othersdisconnected', {amount:amount})
	}

	handler.check_image_url = function(uri)
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

	handler.check_permission = function(socket, permission)
	{
		if(socket.hue_role === "admin" || socket.hue_role === "op")
		{
			return true
		}

		else if(vtypes.indexOf(socket.hue_role) !== -1)
		{
			if(rooms[socket.hue_room_id][`${socket.hue_role}_${permission}_permission`])
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

	handler.create_room_object = function(info)
	{
		var obj = 
		{
			_id: info._id.toString(),
			activity: false,
			log: info.log,
			log_messages: [],
			voice1_chat_permission: info.voice1_chat_permission,
			voice1_images_permission: info.voice1_images_permission,
			voice1_tv_permission: info.voice1_tv_permission,
			voice1_radio_permission: info.voice1_radio_permission,
			voice2_chat_permission: info.voice2_chat_permission,
			voice2_images_permission: info.voice2_images_permission,
			voice2_tv_permission: info.voice2_tv_permission,
			voice2_radio_permission: info.voice2_radio_permission,
			voice3_chat_permission: info.voice3_chat_permission,
			voice3_images_permission: info.voice3_images_permission,
			voice3_tv_permission: info.voice3_tv_permission,
			voice3_radio_permission: info.voice3_radio_permission,
			voice4_chat_permission: info.voice4_chat_permission,
			voice4_images_permission: info.voice4_images_permission,
			voice4_tv_permission: info.voice4_tv_permission,
			voice4_radio_permission: info.voice4_radio_permission			
		}

		return obj	
	}

	handler.start_room_loop = function()
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
								logger.log_error(err)
							})
						}

						else
						{
							db_manager.update_room(room._id, {})

							.catch(err =>
							{
								logger.log_error(err)
							})							
						}

						room.activity = false
						room.log_messages = []
					}
				}
			}

			catch(err)
			{
				logger.log_error(err)
			}
		}, config.room_loop_interval)
	}

	handler.start_files_loop = function()
	{
		setInterval(function()
		{
			try
			{
				for(var key in files)
				{
					var file = files[key]

					if((Date.now() - file.updated) > config.files_loop_max_diff)
					{
						delete files[key]
					}
				}
			}

			catch(err)
			{
				logger.log_error(err)
			}
		}, config.files_loop_interval)
	}

	handler.user_already_connected = function(socket)
	{
		try
		{
			if(io.sockets.adapter.rooms[socket.hue_room_id] === undefined)
			{
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.hue_room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.id !== socket.id && socc.hue_user_id === socket.hue_user_id)
				{
					return true
				}
			}

			return false
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	handler.get_user_sockets_per_room = function(room_id, user_id)
	{
		try
		{
			var clients = []

			var ids = Object.keys(io.sockets.adapter.rooms[room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.hue_user_id === user_id)
				{
					clients.push(socc)
				}
			}
			
			return clients
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	handler.get_user_sockets_per_room_by_username = function(room_id, username)
	{
		try
		{
			var clients = []

			var ids = Object.keys(io.sockets.adapter.rooms[room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.hue_username === username)
				{
					clients.push(socc)
				}
			}
			
			return clients
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	handler.update_user_in_userlist = function(socket)
	{
		try
		{
			var user = rooms[socket.hue_room_id].userlist[socket.hue_user_id]

			user.user_id = socket.hue_user_id
			user.username = socket.hue_username
			user.role = socket.hue_role
			user.profile_image = socket.hue_profile_image
			user.email = socket.hue_email
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	handler.get_out = function(socket)
	{
		try
		{
			handler.user_emit(socket, 'redirect', {location:config.redirect_url})
			handler.do_disconnect(socket)

			return false
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	handler.get_content_type = function(fname)
	{
		if(typeof fname !== "string")
		{
			return "image/jpeg"
		}

		if(fname.length === 0)
		{
			return "image/jpeg"
		}

		var split = fname.split('.')

		var ext = split[split.length - 1]

		if(ext === "jpg" || ext === "jpeg")
		{
			return "image/jpeg"
		}

		else if(ext === "png")
		{
			return "image/png"
		}

		else if(ext === "gif")
		{
			return "image/gif"
		}

		else
		{
			return "image/jpeg"
		}
	}

	handler.valid_image_extension = function(ext)
	{
		if(image_extensions.indexOf(ext) !== -1)
		{
			return true
		}

		return false
	}

	handler.check_multipe_joins = function(socket)
	{
		try
		{
			var ids = Object.keys(io.sockets.adapter.rooms[socket.hue_room_id].sockets)
			
			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.hue_user_id !== undefined)
				{
					if(socc.id !== socket.id && socc.hue_user_id === socket.hue_user_id)
					{
						if(socc.hue_joining === true)
						{
							return true
						}
					}
				}
			}
		}

		catch(err)
		{
			return true
			logger.log_error(err)
		}
	}

	handler.user_emit = function(socket, type, args={})
	{
		args.type = type
		args.room = socket.hue_room_id

		socket.emit('update', args)
	}

	handler.room_emit = function(socket, type, args={})
	{
		if(typeof socket === "object")
		{
			var room_id = socket.hue_room_id
		}

		else
		{
			var room_id = socket
		}

		args.type = type

		io.sockets.in(room_id).emit('update', args)
	}

	handler.broadcast_emit = function(socket, type, args={})
	{
		if(typeof socket === "object")
		{
			var room_id = socket.hue_room_id
		}

		else
		{
			var room_id = socket
		}

		args.type = type

		socket.broadcast.in(room_id).emit('update', args)
	}

	handler.add_spam = function(socket)
	{
		antiSpam.addSpam(socket)		
	}

	handler.start_room_loop()
	handler.start_files_loop()	
}

module.exports = handler
