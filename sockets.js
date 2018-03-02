module.exports = function(io, db_manager, config, sconfig, utilz, logger)
{
	const fs = require('fs')
	const path = require('path')
	const {exec} = require('child_process')
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
		extension: null
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
		io: io // Bind the socket.io variable 
	})

	antiSpam.event.on('ban', function(socket, data)
	{
		socket.kickd = true
		socket.info1 = "the anti-spam system"
		do_disconnect(socket)
	})

	start_room_loop()
	start_files_loop()

	io.on("connection", function(socket)
	{
		try
		{
			connection(socket)
		}

		catch(err)
		{
			logger.log_error(err)
		}

		socket.on('join_room', function(data)
		{
			try
			{
				join_room(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('sendchat', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				sendchat(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('pasted', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				pasted(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('uploaded', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				uploaded(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('upload_profile_image', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				upload_profile_image(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('upload_default_background_image', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				upload_default_background_image(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_topic', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_topic(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_room_name', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_room_name(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('roomlist', function(data) 
		{
			try
			{
				if(!socket.joined && !socket.locked)
				{
					return get_out(socket)
				}

				roomlist(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('create_room', function(data) 
		{
			try
			{
				if(!socket.joined && !socket.locked)
				{
					return get_out(socket)
				}

				create_room(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
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
				logger.log_error(err)
			}
		})

		socket.on('change_role', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_role(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('reset_voices', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				reset_voices(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('remove_ops', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				remove_ops(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('ban', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				ban(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('unban', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				unban(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('unban_all', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				unban_all(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('get_banned_count', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				get_banned_count(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('kick', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				kick(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_upload_permission', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_upload_permission(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_chat_permission', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_chat_permission(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_radio_permission', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_radio_permission(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_tv_permission', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_tv_permission(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_log', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_log(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('clear_log', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				clear_log(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_privacy', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_privacy(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_radio_source', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_radio_source(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_tv_source', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_tv_source(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_username', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_username(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_password', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_password(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_email', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_email(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('verify_email', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				verify_email(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_images_enabled', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_images_enabled(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})	

		socket.on('change_tv_enabled', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_tv_enabled(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_radio_enabled', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_radio_enabled(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_default_theme', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_default_theme(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_default_background_image_enabled', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_default_background_image_enabled(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('change_voice_permission', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				change_voice_permission(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('slice_upload', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				slice_upload(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('typing', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				typing(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('whisper', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				whisper(socket, data)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})

		socket.on('disconnect_others', function(data) 
		{
			try
			{
				if(!socket.joined)
				{
					return get_out(socket)
				}

				disconnect_others(socket, data)
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
				if(!socket.joined)
				{
					return get_out(socket)
				}

				reason = reason.toLowerCase()

				if(reason.indexOf('timeout') !== -1)
				{
					socket.pingd = true
				}				

				disconnect(socket)
			}

			catch(err)
			{
				logger.log_error(err)
			}
		})
	})

	function connection(socket)
	{
		socket.kickd = false
		socket.bannd = false
		socket.joining = false
		socket.joined = false
		socket.superuser = false
		socket.locked = false
	}

	function join_room(socket, data)
	{
		if(data.room_id === undefined)
		{
			return do_disconnect(socket)
		}

		if(data.room_id.length > config.max_room_id_length)
		{
			return do_disconnect(socket)
		} 			

		if(data.alternative)
		{
			data.email = data.email.trim()
			data.password = data.password.trim()

			if(data.email === undefined || data.password === undefined)
			{
				return do_disconnect(socket)
			}

			if(data.email > config.max_max_email_length)
			{
				return do_disconnect(socket)
			}

			if(data.password.length > config.max_max_password_length)
			{
				return do_disconnect(socket)
			}
		}

		else
		{
			data.user_id = data.user_id.trim()

			if(data.user_id === undefined || data.token === undefined)
			{
				return do_disconnect(socket)
			}

			if(data.user_id > config.max_user_id_length)
			{
				return do_disconnect(socket)
			}

			if(data.token.length > config.max_jwt_token_length)
			{
				return do_disconnect(socket)
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
					return do_disconnect(socket)
				}

				var userinfo = ans.user

				socket.user_id = userinfo._id.toString()

				db_manager.get_room({_id:data.room_id}, {})

				.then(info =>
				{
					if(!info)
					{
						return do_disconnect(socket)
					}
	
					do_join(socket, info, userinfo)

					db_manager.save_visited_room(socket.user_id, data.room_id)

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
					return do_disconnect(socket)				
				}

				else if(decoded.data === undefined || decoded.data.id === undefined)
				{
					return do_disconnect(socket)
				}

				if(decoded.data.id !== data.user_id)
				{
					return do_disconnect(socket)
				}			

				else
				{
					socket.user_id = data.user_id

					db_manager.get_room({_id:data.room_id}, {})

					.then(info =>
					{
						if(!info)
						{
							return do_disconnect(socket)
						}

						db_manager.get_user({_id:socket.user_id}, 
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
								return do_disconnect(socket)
							}

							do_join(socket, info, userinfo)

							db_manager.save_visited_room(socket.user_id, data.room_id)

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

	function do_join(socket, info, userinfo)
	{
		socket.room_id = info._id.toString()
		socket.email = userinfo.email
		socket.joining = true
		
		socket.join(socket.room_id)		

		if(check_multipe_joins(socket))
		{
			return do_disconnect(socket)
		}

		if(sconfig.superuser_emails.indexOf(userinfo.email) !== -1)
		{
			socket.superuser = true
		}

		socket.username = userinfo.username

		socket.ip = socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress

		var banned_from_main = false

		if(!socket.superuser && info.bans.indexOf(socket.user_id) !== -1)
		{
			if(socket.room_id === config.main_room_id)
			{
				banned_from_main = true
			}

			else
			{
				return do_disconnect(socket)
			}
		}

		if(banned_from_main)
		{
			socket.leave(socket.room_id)
			socket.locked = true

			user_emit(socket, 'joined', 
			{
				room_locked: true	
			})

			return
		}

		if(userinfo.profile_image === "")
		{
			socket.profile_image = ""
		}

		else if(userinfo.profile_image.indexOf(sconfig.s3_main_url) === -1)
		{
			socket.profile_image = config.public_images_location + userinfo.profile_image
		}

		else
		{
			socket.profile_image = userinfo.profile_image
		}

		if(info.default_background_image === "")
		{
			var default_background_image = ""
		}

		else if(info.default_background_image.indexOf(sconfig.s3_main_url) === -1)
		{
			var default_background_image = config.public_images_location + info.default_background_image
		}

		else
		{
			var default_background_image = info.default_background_image
		}

		if(rooms[socket.room_id] === undefined)
		{
			rooms[socket.room_id] = create_room_object(info)
		}

		socket.role = info.keys[socket.user_id]

		if(roles.indexOf(socket.role) === -1)
		{
			socket.role = 'voice1'
		}

		if(user_rooms[socket.user_id] === undefined)
		{
			user_rooms[socket.user_id] = []
		}

		if(user_rooms[socket.user_id].indexOf(socket.room_id) === -1)
		{
			user_rooms[socket.user_id].push(socket.room_id)
		}

		if(!user_already_connected(socket))
		{
			broadcast_emit(socket, 'userjoin',
			{
				username: socket.username,
				role: socket.role,
				profile_image: socket.profile_image
			})

			if(rooms[socket.room_id].userlist === undefined)
			{
				rooms[socket.room_id].userlist = {}
			}

			rooms[socket.room_id].userlist[socket.user_id] = {}

			update_user_in_userlist(socket)
		}

		user_emit(socket, 'joined', 
		{
			room_locked: false,
			room_name: info.name,
			username: socket.username, 
			image_url: info.image_url, 
			image_uploader: info.image_uploader, 
			image_size: info.image_size, 
			image_date: info.image_date, 
			image_type: info.image_type, 
			topic: info.topic, 
			topic_setter: info.topic_setter,
			topic_date: info.topic_date,
			userlist: utilz.object_to_array(get_userlist(socket.room_id)),
			log: info.log,
			log_messages: info.log_messages.concat(rooms[socket.room_id].log_messages),
			role: socket.role, 
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
			profile_image: socket.profile_image,
			room_images_enabled: info.images_enabled,
			room_tv_enabled: info.tv_enabled,
			room_radio_enabled: info.radio_enabled,
			default_theme: info.default_theme,
			default_background_image: default_background_image,
			default_background_image_enabled: info.default_background_image_enabled,
			v1_chat_permission: info.v1_chat_permission,
			v1_images_permission: info.v1_images_permission,
			v1_tv_permission: info.v1_tv_permission,
			v1_radio_permission: info.v1_radio_permission,
			v2_chat_permission: info.v2_chat_permission,
			v2_images_permission: info.v2_images_permission,
			v2_tv_permission: info.v2_tv_permission,
			v2_radio_permission: info.v2_radio_permission,
			v3_chat_permission: info.v3_chat_permission,
			v3_images_permission: info.v3_images_permission,
			v3_tv_permission: info.v3_tv_permission,
			v3_radio_permission: info.v3_radio_permission,
			v4_chat_permission: info.v4_chat_permission,
			v4_images_permission: info.v4_images_permission,
			v4_tv_permission: info.v4_tv_permission,
			v4_radio_permission: info.v4_radio_permission,
			email: socket.email,
			reg_date: userinfo.registration_date			
		})

		socket.joining = false
		socket.joined = true			
	}

	function sendchat(socket, data)
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

		if(!check_permission(socket, "chat"))
		{
			return false
		}

		broadcast_emit(socket, 'chat_msg', 
		{ 
			username: socket.username, 
			msg: data.msg,
			profile_image: socket.profile_image
		})

		rooms[socket.room_id].activity = true

		if(rooms[socket.room_id].log)
		{
			var message = 
			{
				type: "chat",
				data: 
				{
					username: socket.username,
					content: data.msg,
					profile_image: socket.profile_image
				},
				date: Date.now()
			}

			rooms[socket.room_id].log_messages.push(message)
		}
	}

	function change_topic(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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

				room_emit(socket, 'topic_change', 
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

	function change_room_name(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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

				room_emit(socket, 'room_name_changed', 
				{
					name: info.name,
					username: socket.username
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

	function roomlist(socket, data)
	{
		if(data.type === "visited")
		{
			get_visited_roomlist(socket.user_id, function(rooms)
			{
				user_emit(socket, 'roomlist', {roomlist:rooms})
			})
		}

		else if(data.type === "public")
		{
			get_roomlist(function(rooms)
			{
				user_emit(socket, 'roomlist', {roomlist:rooms})
			})
		}
	}

	function create_room(socket, data)
	{
		if(data.name.length === 0 || data.name.length > config.max_room_name_length)
		{
			return get_out(socket)
		}

		if(data.name.length !== utilz.clean_string2(data.name).length)
		{
			return get_out(socket)
		}

		if(data.public !== true && data.public !== false)
		{
			return get_out(socket)
		}

		data.user_id = socket.user_id

		db_manager.user_create_room(data)

		.then(ans =>
		{
			if(ans === "wait")
			{
				user_emit(socket, 'create_room_wait', {})
				return
			}
			
			user_emit(socket, 'room_created', {id:ans._id.toString()})
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

	function heartbeat(socket, data)
	{
		if(!socket.joined)
		{
			user_emit(socket, 'connection_lost', {})
		}
	}

	function change_role(socket, data)
	{
		if(!socket.superuser && (socket.role !== 'admin' && socket.role !== 'op'))
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

		if(data.username.length > config.max_max_username_length)
		{
			return get_out(socket)
		}

		if(roles.indexOf(data.role) === -1)
		{
			return get_out(socket)
		}

		if(!socket.superuser && (socket.username === data.username))
		{
			return get_out(socket)
		}

		db_manager.get_room({_id:socket.room_id}, {keys:true})

		.then(info =>
		{
			db_manager.get_user({username:data.username}, {username:true})

			.then(userinfo =>
			{
				if(!userinfo)
				{
					user_emit(socket, 'user_not_found', {})
					return false						
				}

				var id = userinfo._id.toString()

				var current_role = info.keys[id]

				if(!socket.superuser)
				{
					if((current_role === 'admin' || current_role === 'op') && socket.role !== 'admin')
					{
						user_emit(socket, 'forbiddenuser', {})
						return false
					}
				}

				if(current_role === data.role || (current_role === undefined && data.role === "voice1"))
				{
					user_emit(socket, 'isalready', {what:data.role, who:data.username})
					return false
				}

				var sockets = get_user_sockets_per_room(socket.room_id, id)

				var last_socc = false
				
				for(var socc of sockets)
				{
					if(socc.superuser)
					{
						if(socket.username !== socc.username && socc.role === "admin")
						{
							user_emit(socket, 'forbiddenuser', {})
							return false		
						}
					}

					socc.role = data.role
					last_socc = socc
				}

				if(last_socc)
				{
					update_user_in_userlist(last_socc)
				}

				info.keys[id] = data.role
				
				db_manager.update_room(info._id, {keys:info.keys})

				.catch(err => 
				{
					logger.log_error(err)
				})

				room_emit(socket, 'announce_role_change', 
				{ 
					username1: socket.username, 
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

	function reset_voices(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		db_manager.get_room({_id:socket.room_id}, {keys:true})

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
				user_emit(socket, 'novoicestoreset', {})
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.role.startsWith("voice") && socc.role !== "voice1")
				{
					socc.role = 'voice1'

					update_user_in_userlist(socc)
				}
			}
			
			db_manager.update_room(info._id, {keys:info.keys})

			.catch(err =>
			{
				logger.log_error(err)
			})

			room_emit(socket, 'voices_resetted', {username:socket.username})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})	
	}

	function remove_ops(socket, data)
	{
		if(socket.role !== 'admin')
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
				user_emit(socket, 'noopstoremove', {})
				return false
			}

			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)

			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.role === 'op')
				{
					socc.role = ''

					update_user_in_userlist(socc)
				}
			}
			
			room_emit(socket, 'announce_removedops', {username:socket.username})

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

	function kick(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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

		if(data.username.length > config.max_max_username_length)
		{
			return get_out(socket)
		}

		var sockets = get_user_sockets_per_room_by_username(socket.room_id, data.username)

		if(sockets.length > 0)
		{
			if(((sockets[0].role === 'admin' || sockets[0].role === 'op') && socket.role !== 'admin') || sockets[0].superuser)
			{
				user_emit(socket, 'forbiddenuser', {})
				return false
			}

			for(var socc of sockets)
			{
				socc.role = ''
				socc.kickd = true
				socc.info1 = socket.username
				
				get_out(socc)
			}
		}

		else
		{
			user_emit(socket, 'user_not_in_room', {})
			return false
		}		
	}	

	function ban(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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

		if(data.username.length > config.max_max_username_length)
		{
			return get_out(socket)
		}			

		db_manager.get_room({_id:socket.room_id}, {bans:true, keys:true})

		.then(info =>
		{
			db_manager.get_user({username:data.username}, {username:true})

			.then(userinfo =>
			{
				if(!userinfo)
				{
					user_emit(socket, 'user_not_found', {})
					return false						
				}

				var id = userinfo._id.toString()
				
				var current_role = info.keys[id]

				if((current_role === 'admin' || current_role === 'op') && socket.role !== 'admin')
				{
					user_emit(socket, 'forbiddenuser', {})
					return false
				}

				if(info.bans.indexOf(id) !== -1)
				{
					user_emit(socket, 'user_already_banned', {})

					return false						
				}

				var sockets = get_user_sockets_per_room(socket.room_id, id)

				if(sockets.length > 0)
				{
					for(var socc of sockets)
					{
						if(socc.superuser)
						{
							user_emit(socket, 'forbiddenuser', {})							
							return false
						}

						socc.role = ''
						socc.bannd = true
						socc.info1 = socket.username
						get_out(socc)
					}
				}

				else
				{
					room_emit(socket, 'announce_ban', 
					{
						username1: socket.username, 
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

	function unban(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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

		if(data.username.length > config.max_max_username_length)
		{
			return get_out(socket)
		}			

		db_manager.get_room({_id:socket.room_id}, {bans:true, keys:true})

		.then(info =>
		{
			db_manager.get_user({username:data.username}, {username:true})

			.then(userinfo =>
			{
				if(!userinfo)
				{
					user_emit(socket, 'user_not_found', {})
					return false						
				}

				var id = userinfo._id.toString()

				if(info.bans.indexOf(id) === -1)
				{
					user_emit(socket, 'user_already_unbanned', {})

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

				room_emit(socket, 'announce_unban', 
				{ 
					username1: socket.username, 
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

	function unban_all(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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
					logger.log_error(err)
				})

				room_emit(socket, 'announce_unban_all', {username:socket.username})
			}

			else
			{
				user_emit(socket, 'nothingtounban', {})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	function get_banned_count(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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
				var count = info.bans.length
			}

			user_emit(socket, 'receive_banned_count', {count:count})
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	function change_log(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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
						logger.log_error(err)
					})						
				}

				else
				{
					db_manager.update_room(socket.room_id, {log:data.log})

					.catch(err =>
					{
						logger.log_error(err)
					})						
				}

				rooms[socket.room_id].log = data.log

				room_emit(socket, 'log_changed', {username:socket.username, log:data.log})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	function clear_log(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
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
					logger.log_error(err)
				})					

				room_emit(socket, 'log_cleared', {username:socket.username})
			}

			else
			{
				user_emit(socket, 'nothingtoclear', {})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})		
	}

	function change_privacy(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return get_out(socket)
		}

		db_manager.update_room(socket.room_id, {public:data.what})

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'privacy_change', {username:socket.username, what:data.what})
	}

	function change_radio_source(socket, data)
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

		if(!check_permission(socket, "radio"))
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
						user_emit(socket, 'songnotfound', {})
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
							do_change_radio_source(socket, data)
						}

						else
						{
							user_emit(socket, 'songnotfound', {})
						}
					})

					.catch(err =>
					{
						logger.log_error(err)
					})
				}

				else
				{
					user_emit(socket, 'songnotfound', {})
					return false						
				}
			}

			else
			{
				data.type = "radio"
				data.title = ""
				do_change_radio_source(socket, data)
			}
		}

		else if(data.src === "restart" || data.src === "reset")
		{
			db_manager.get_room({_id:socket.room_id}, 
			{
				radio_type: true,
				radio_source: true,
				radio_title: true,
				radio_setter: true,
				radio_date: true
			})

			.then(info =>
			{
				room_emit(socket, 'restarted_radio_source', 
				{ 
					radio_type: info.radio_type,
					radio_source: info.radio_source,
					radio_title: info.radio_title,
					radio_setter: info.radio_setter,
					radio_date: info.radio_date,
					username: socket.username
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
						do_change_radio_source(socket, data)
						return
					}

					user_emit(socket, 'songnotfound', {})
					return false						
				}

				else
				{
					user_emit(socket, 'songnotfound', {})
				}							
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}
	}

	function change_tv_source(socket, data)
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

		if(!check_permission(socket, "tv"))
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
						user_emit(socket, 'videonotfound', {})
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
							do_change_tv_source(socket, data)
						}

						else
						{
							user_emit(socket, 'videonotfound', {})
							return false
						}
					})

					.catch(err =>
					{
						user_emit(socket, 'videonotfound', {})
						logger.log_error(err)
					})
				}

				else
				{
					user_emit(socket, 'videonotfound', {})						
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
							do_change_tv_source(socket, data)
						})

						.catch(err =>
						{
							user_emit(socket, 'videonotfound', {})								
							logger.log_error(err)
						})
					}

					else if(id[0] === "channel")
					{
						data.type = "twitch"
						data.title = id[1]
						do_change_tv_source(socket, data)
					}

					else
					{
						user_emit(socket, 'videonotfound', {})
						return false
					}
				}

				else
				{
					user_emit(socket, 'videonotfound', {})						
				}					
			}

			else
			{
				data.type = "url"
				data.title = ""
				do_change_tv_source(socket, data)
			}
		}

		else if(data.src === "restart" || data.src === "reset")
		{
			db_manager.get_room({_id:socket.room_id}, 
			{
				tv_type: true,
				tv_source: true,
				tv_title: true,
				tv_setter: true,
				tv_date: true
			})

			.then(info =>
			{
				room_emit(socket, 'restarted_tv_source', 
				{ 
					tv_type: info.tv_type,
					tv_source: info.tv_source,
					tv_title: info.tv_title,
					tv_setter: info.tv_setter,
					tv_date: info.tv_date,
					username: socket.username
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
						do_change_tv_source(socket, data)
						return
					}

					user_emit(socket, 'videonotfound', {})
					return false						
				}

				else
				{
					user_emit(socket, 'videonotfound', {})
				}						
			})

			.catch(err =>
			{
				logger.log_error(err)
			})
		}
	}

	function do_change_radio_source(socket, data)
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

		radioinfo.radio_setter = socket.username
		radioinfo.radio_date = date

		room_emit(socket, 'changed_radio_source', 
		{ 
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
			logger.log_error(err)
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
				date: date
			}

			rooms[socket.room_id].log_messages.push(message)
		}		
	}

	function do_change_tv_source(socket, data)
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

		tvinfo.tv_setter = socket.username
		tvinfo.tv_date = date

		room_emit(socket, 'changed_tv_source', 
		{
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
			tv_date: tvinfo.tv_date
		})

		.catch(err =>
		{
			logger.log_error(err)
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
				date: date
			}

			rooms[socket.room_id].log_messages.push(message)
		}		
	}

	function change_username(socket, data)
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
				for(var room_id of user_rooms[socket.user_id])
				{
					for(var socc of get_user_sockets_per_room(room_id, socket.user_id))
					{
						socc.username = data.username
					}

					rooms[room_id].userlist[socket.user_id].username = data.username

					room_emit(room_id, 'new_username',
					{
						username: data.username, 
						old_username: old_username
					})
				}
			}

			else
			{
				user_emit(socket, 'username_already_exists', {username:data.username})
			}
		})

		.catch(err =>
		{
			logger.log_error(err)
		})
	}

	function change_password(socket, data)
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
			password: data.password,
			password_date: Date.now()
		})

		.catch(err =>
		{
			logger.log_error(err)
		})			

		user_emit(socket, 'password_changed', {password:data.password})
	}

	function change_email(socket, data)
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

		if(utilz.clean_string5(data.email).length !== data.email.length)
		{
			return get_out(socket)
		}		

		db_manager.change_email(socket.user_id, data.email)

		.then(ans =>
		{
			if(ans.msg === "error")
			{
				user_emit(socket, 'error_occurred', {})
				return
			}

			else if(ans.msg === "duplicate")
			{
				user_emit(socket, 'email_already_exists', {email:data.email})
				return
			}

			else if(ans.msg === "wait")
			{
				user_emit(socket, 'email_change_wait', {})
				return
			}

			else if(ans.msg === "sent_code")
			{
				user_emit(socket, 'email_change_code_sent', {email:data.email})
				return
			}
		})		

		.catch(err =>
		{
			logger.log_error(err)
		})	
	}

	function verify_email(socket, data)
	{
		if(utilz.clean_string5(data.code).length !== data.code.length)
		{
			return get_out(socket)
		}

		if(data.code.length === 0)
		{
			return get_out(socket)
		}
		
		if(data.code.length > config.email_change_code_max_length)
		{
			return get_out(socket)
		}

		db_manager.change_email(socket.user_id, data.email, data.code)

		.then(ans =>
		{
			if(ans.msg === "error")
			{
				user_emit(socket, 'error_occurred', {})
				return
			}

			else if(ans.msg === "duplicate")
			{
				user_emit(socket, 'email_already_exists', {email:data.email})
				return
			}

			else if(ans.msg === "not_sent")
			{
				user_emit(socket, 'email_change_code_not_sent', {email:data.email})
				return
			}

			else if(ans.msg === "wrong_code")
			{
				user_emit(socket, 'email_change_wrong_code', {email:data.email})
				return
			}

			else if(ans.msg === "expired_code")
			{
				user_emit(socket, 'email_change_expired_code', {email:data.email})
				return
			}

			else if(ans.msg === "changed")
			{
				for(var room_id of user_rooms[socket.user_id])
				{
					for(var socc of get_user_sockets_per_room(room_id, socket.user_id))
					{
						socc.email = data.email
					}

					rooms[room_id].userlist[socket.user_id].email = data.email
				}

				user_emit(socket, 'email_changed', {email:ans.email})
			}
		})		

		.catch(err =>
		{
			logger.log_error(err)
		})
	}	

	function change_images_enabled(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return get_out(socket)
		}

		db_manager.update_room(socket.room_id,
		{
			images_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'room_images_enabled_change', 
		{
			what: data.what,
			username: socket.username
		})
	}

	function change_tv_enabled(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return get_out(socket)
		}

		db_manager.update_room(socket.room_id,
		{
			tv_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'room_tv_enabled_change',
		{
			what: data.what,
			username: socket.username
		})
	}

	function change_radio_enabled(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return get_out(socket)
		}

		db_manager.update_room(socket.room_id,
		{
			radio_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'room_radio_enabled_change', 
		{
			what: data.what,
			username: socket.username
		})
	}

	function change_default_theme(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.color === undefined)
		{
			return get_out(socket)
		}

		db_manager.update_room(socket.room_id,
		{
			default_theme: data.color
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'default_theme_change', 
		{
			color: data.color,
			username: socket.username
		})
	}

	function change_default_background_image_enabled(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return get_out(socket)
		}

		db_manager.update_room(socket.room_id,
		{
			default_background_image_enabled: data.what
		})

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'default_background_image_enabled_change', 
		{
			what: data.what,
			username: socket.username
		})
	}

	function change_voice_permission(socket, data)
	{
		if(socket.role !== 'admin' && socket.role !== 'op')
		{
			return get_out(socket)
		}

		if(data.what !== true && data.what !== false)
		{
			return get_out(socket)
		}

		if(data.ptype === undefined)
		{
			return get_out(socket)
		}

		if(rooms[socket.room_id][data.ptype] === undefined)
		{
			return get_out(socket)
		}

		rooms[socket.room_id][data.ptype] = data.what			

		var obj = {}

		obj[data.ptype] = data.what

		db_manager.update_room(socket.room_id, obj)

		.catch(err =>
		{
			logger.log_error(err)
		})

		room_emit(socket, 'voice_permission_change', 
		{
			ptype: data.ptype,
			what: data.what,
			username: socket.username
		})
	}	

	function do_disconnect(socc)
	{
		socc.disconnect()
		return false
	}

	function disconnect(socket)
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

		room_emit(socket, type, 
		{
			username: socket.username,
			info1: socket.info1, 
			role: socket.role
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
			delete rooms[socket.room_id].userlist[socket.user_id]
		}

		if(user_rooms[socket.user_id] !== undefined)
		{
			for(var i=0; i<user_rooms[socket.user_id].length; i++)
			{
				var room_id = user_rooms[socket.user_id][i]

				if(socket.room_id === room_id)
				{
					user_rooms[socket.user_id].splice(i, 1)
					break
				}
			}

			if(user_rooms[socket.user_id].length === 0)
			{
				delete user_rooms[socket.user_id]
			}
		}
	}	

	function compare_roomlist(a, b)
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

	function get_userlist(room_id)
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

	function get_usercount(room_id)
	{
		return Object.keys(get_userlist(room_id)).length
	}

	function get_roomlist(callback)
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

					roomlist.push({id:room._id.toString(), name:room.name, topic:room.topic.substring(0, config.max_roomlist_topic_length), usercount:get_usercount(room._id.toString()), modified:room.modified})
				}

				roomlist.sort(compare_roomlist).splice(config.max_roomlist_items)

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

					roomlist.push({id:room._id.toString(), name:room.name, topic:room.topic.substring(0, config.max_roomlist_topic_length), usercount:get_usercount(room._id.toString()), modified:room.modified})
				}

				roomlist.sort(compare_roomlist)			

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

	function pasted(socket, data)
	{
		if(data.image_url === undefined)
		{
			return get_out(socket)
		}

		if(data.image_url.length === 0)
		{
			return get_out(socket)
		}

		if(data.image_url.length > config.max_image_source_length)
		{
			return get_out(socket)
		}

		if(!check_permission(socket, "images"))
		{
			return false
		}	

		data.image_url = data.image_url.replace(/\s/g,'').replace(/\.gifv/g,'.gif')

		change_image(socket.room_id, data.image_url, socket.username, 0, "link")
	}

	function uploaded(socket, data)
	{
		if(data.image_file === undefined)
		{
			return get_out(socket)
		}

		if(data.extension === undefined)
		{
			return get_out(socket)
		}

		if(!check_permission(socket, "images"))
		{
			return false
		}

		var size = data.image_file.toString('ascii').length / 1024

		if(size === 0 || (size > config.max_image_size))
		{
			user_emit(socket, 'upload_error', {})													
			return false
		}

		var fname = `${socket.room_id}_${Date.now()}_${utilz.get_random_int(0, 1000)}.${data.extension}`

		fs.writeFile(images_root + '/' + fname, data.image_file, function(err, data) 
		{
			if(err) 
			{
				user_emit(socket, 'upload_error', {})
			}

			else 
			{
				change_image(socket.room_id, fname, socket.username, size, "upload")
			}
		})
	}	

	function change_image(room_id, fname, uploader, size, type)
	{
		if(type === "link")
		{
			do_change_image(room_id, fname, uploader, size, type)
		}

		else if(type === "upload")
		{
			if(config.image_storage_s3_or_local === "local")
			{
				do_change_image(room_id, fname, uploader, size, type)
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
						ContentType: get_content_type(fname),
						Body: data,
						Bucket: sconfig.s3_bucket_name, 
						Key: `${sconfig.s3_images_location}${fname}`,
						CacheControl: `max-age=${sconfig.s3_cache_max_age}`
					}).promise()

					.then(ans =>
					{
						fs.unlink(`${images_root}/${fname}`, function(){})
						do_change_image(room_id, sconfig.s3_main_url + sconfig.s3_images_location + fname, uploader, size, type)
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

	function do_change_image(room_id, fname, uploader, size, type)
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

		room_emit(room_id, 'image_change',
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

	function upload_profile_image(socket, data)
	{
		if(data.image_file === undefined)
		{
			return get_out(socket)
		}

		var size = data.image_file.toString('ascii').length / 1024

		if(size === 0 || (size > config.max_profile_image_size))
		{
			user_emit(socket, 'upload_error', {})													
			return false
		}

		var fname = `profile_${socket.user_id}.jpg`

		fs.writeFile(images_root + '/' + fname, data.image_file, function(err, data) 
		{
			if(err) 
			{
				user_emit(socket, 'upload_error', {})
			}

			else 
			{
				change_profile_image(socket, fname)
			}
		})
	}	

	function change_profile_image(socket, fname)
	{
		if(config.image_storage_s3_or_local === "local")
		{
			do_change_profile_image(socket, fname)
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
					ContentType: get_content_type(fname),
					Body: data,
					Bucket: sconfig.s3_bucket_name, 
					Key: `${sconfig.s3_images_location}${fname}`,
					CacheControl: `max-age=${sconfig.s3_cache_max_age}`
				}).promise()

				.then(ans =>
				{
					fs.unlink(`${images_root}/${fname}`, function(){})
					do_change_profile_image(socket, sconfig.s3_main_url + sconfig.s3_images_location + fname)
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

	function do_change_profile_image(socket, fname)
	{
		db_manager.get_user({_id:socket.user_id}, {profile_image_version:true})		

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

			db_manager.update_user(socket.user_id,
			{
				profile_image: fver,
				profile_image_version: new_ver
			})

			.then(ans =>
			{
				for(var room_id of user_rooms[socket.user_id])
				{
					for(var socc of get_user_sockets_per_room(room_id, socket.user_id))
					{
						socc.profile_image = image_url
					}
					
					rooms[room_id].userlist[socket.user_id].profile_image = image_url

					room_emit(room_id, 'profile_image_changed',
					{
						username: socket.username,
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

	function upload_default_background_image(socket, data)
	{
		if(data.image_file === undefined)
		{
			return get_out(socket)
		}

		if(data.extension === undefined)
		{
			return get_out(socket)
		}			

		var size = data.image_file.toString('ascii').length / 1024

		if(size === 0 || (size > config.max_image_size))
		{
			user_emit(socket, 'upload_error', {})													
			return false
		}

		var fname = `bg_${socket.room_id}_${Date.now()}_${utilz.get_random_int(0, 1000)}.${data.extension}`

		fs.writeFile(images_root + '/' + fname, data.image_file, function(err, data) 
		{
			if(err) 
			{
				user_emit(socket, 'upload_error', {})
			}

			else 
			{
				change_default_background_image(socket, fname)
			}
		})
	}

	function change_default_background_image(socket, fname)
	{
		if(config.image_storage_s3_or_local === "local")
		{
			do_change_default_background_image(socket, fname)
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
					ContentType: get_content_type(fname),
					Body: data,
					Bucket: sconfig.s3_bucket_name, 
					Key: `${sconfig.s3_images_location}${fname}`,
					CacheControl: `max-age=${sconfig.s3_cache_max_age}`
				}).promise()

				.then(ans =>
				{
					fs.unlink(`${images_root}/${fname}`, function(){})
					do_change_default_background_image(socket, sconfig.s3_main_url + sconfig.s3_images_location + fname)
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

	function do_change_default_background_image(socket, fname)
	{
		db_manager.get_room({_id:socket.room_id}, {default_background_image:true})		

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
				var to_delete = info.default_background_image
			}

			else
			{
				var to_delete = false
			}

			db_manager.update_room(socket.room_id,
			{
				default_background_image: fname
			})

			.then(ans =>
			{
				room_emit(socket, 'default_background_image_change',
				{
					username: socket.username,
					default_background_image: image_url
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

	function slice_upload(socket, data)
	{
		if(data.action === "image_upload")
		{
			if(!check_permission(socket, "images"))
			{
				return false
			}
		}

		if(data.data.length > config.upload_slice_size)
		{
			return get_out(socket)
		}

		var key = `${socket.user_id}_${data.date}`

		if(!files[key]) 
		{
			if(image_types.indexOf(data.type) === -1)
			{
				return get_out(socket)
			}

			var ext = data.name.split('.').pop(-1).toLowerCase()

			if(!valid_image_extension(ext))
			{
				return get_out(socket)
			}

			data.extension = ext

			files[key] = Object.assign({}, files_struct, data)

			files[key].data = []
		}

		data.data = new Buffer(new Uint8Array(data.data))

		files[key].data.push(data.data)

		files[key].slice++

		files[key].received += data.data.length

		if((files[key].received / 1024) > config.max_image_size)
		{
			delete files[key]
			
			return get_out(socket)
		}

		files[key].updated = Date.now()
		
		if(files[key].slice * config.upload_slice_size >= files[key].size) 
		{  
			user_emit(socket, 'upload_ended', {date:data.date})

			var full_file = Buffer.concat(files[key].data)

			if(data.action === "image_upload")
			{
				uploaded(socket,
				{
					image_file: full_file,
					extension: files[key].extension
				})

			}

			else if(data.action === "profile_image_upload")
			{
				upload_profile_image(socket,
				{
					image_file: full_file
				})	
			}

			else if(data.action === "background_image_upload")
			{
				upload_default_background_image(socket,
				{
					image_file: full_file,
					extension: files[key].extension
				})	
			}

			delete files[key] 
		}

		else 
		{ 
			user_emit(socket, 'request_slice_upload', 
			{ 
				current_slice: files[key].slice,
				date: data.date 
			})
		}
	}

	function typing(socket, data)
	{
		if(!check_permission(socket, "chat"))
		{
			return false
		}

		broadcast_emit(socket, 'typing', {})
	}

	function whisper(socket, data)
	{
		if(data.username === undefined)
		{
			return get_out(socket)
		}

		if(data.username.length === 0)
		{
			return get_out(socket)
		}

		if(data.username.length > config.max_max_username_length)
		{
			return get_out(socket)
		}

		if(data.username === socket.username)
		{
			return get_out(socket)
		}

		if(data.message.length === 0)
		{
			return get_out(socket)
		}

		if(data.message.length > config.max_input_length)
		{
			return get_out(socket)
		}

		if(data.message.length !== utilz.clean_string2(data.message).length)
		{
			return get_out(socket)
		}

		if(!check_permission(socket, "chat"))
		{
			return false
		}			

		var sockets = get_user_sockets_per_room_by_username(socket.room_id, data.username)

		if(sockets.length > 0)
		{
			for(var socc of sockets)
			{
				user_emit(socc, 'whisper', 
				{
					room: socket.room_id,
					username: socket.username,
					message: data.message
				})
			}
		}

		else
		{
			user_emit(socket, 'user_not_in_room', {})
		}
	}	

	function disconnect_others(socket, data)
	{
		var amount = 0

		for(var room_id of user_rooms[socket.user_id])
		{
			for(var socc of get_user_sockets_per_room(room_id, socket.user_id))
			{
				if(socc.id !== socket.id)
				{
					socc.disconnect()
					amount += 1
				}
			}
		}

		user_emit(socket, 'othersdisconnected', {amount:amount})
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

	function check_permission(socket, permission)
	{
		if(socket.role === "admin" || socket.role === "op")
		{
			return true
		}

		if(socket.role === "voice1")
		{
			if(permission === "chat")
			{
				if(rooms[socket.room_id].v1_chat_permission)
				{
					return true
				}
			}

			else if(permission === "images")
			{
				if(rooms[socket.room_id].v1_images_permission)
				{
					return true
				}
			}

			else if(permission === "tv")
			{
				if(rooms[socket.room_id].v1_tv_permission)
				{
					return true
				}
			}

			else if(permission === "radio")
			{
				if(rooms[socket.room_id].v1_radio_permission)
				{
					return true
				}
			}
		}

		else if(socket.role === "voice2")
		{
			if(permission === "chat")
			{
				if(rooms[socket.room_id].v2_chat_permission)
				{
					return true
				}
			}

			else if(permission === "images")
			{
				if(rooms[socket.room_id].v2_images_permission)
				{
					return true
				}
			}

			else if(permission === "tv")
			{
				if(rooms[socket.room_id].v2_tv_permission)
				{
					return true
				}
			}

			else if(permission === "radio")
			{
				if(rooms[socket.room_id].v2_radio_permission)
				{
					return true
				}
			}
		}

		else if(socket.role === "voice3")
		{
			if(permission === "chat")
			{
				if(rooms[socket.room_id].v3_chat_permission)
				{
					return true
				}
			}

			else if(permission === "images")
			{
				if(rooms[socket.room_id].v3_images_permission)
				{
					return true
				}
			}

			else if(permission === "tv")
			{
				if(rooms[socket.room_id].v3_tv_permission)
				{
					return true
				}
			}

			else if(permission === "radio")
			{
				if(rooms[socket.room_id].v3_radio_permission)
				{
					return true
				}
			}
		}

		else if(socket.role === 'voice4')
		{
			if(permission === "chat")
			{
				if(rooms[socket.room_id].v4_chat_permission)
				{
					return true
				}
			}

			else if(permission === "images")
			{
				if(rooms[socket.room_id].v4_images_permission)
				{
					return true
				}
			}

			else if(permission === "tv")
			{
				if(rooms[socket.room_id].v4_tv_permission)
				{
					return true
				}
			}

			else if(permission === "radio")
			{
				if(rooms[socket.room_id].v4_radio_permission)
				{
					return true
				}
			}
		}

		return false
	}

	function create_room_object(info)
	{
		var obj = 
		{
			_id: info._id.toString(),
			activity: false,
			log: info.log,
			log_messages: [],
			v1_chat_permission: info.v1_chat_permission,
			v1_images_permission: info.v1_images_permission,
			v1_tv_permission: info.v1_tv_permission,
			v1_radio_permission: info.v1_radio_permission,
			v2_chat_permission: info.v2_chat_permission,
			v2_images_permission: info.v2_images_permission,
			v2_tv_permission: info.v2_tv_permission,
			v2_radio_permission: info.v2_radio_permission,
			v3_chat_permission: info.v3_chat_permission,
			v3_images_permission: info.v3_images_permission,
			v3_tv_permission: info.v3_tv_permission,
			v3_radio_permission: info.v3_radio_permission,
			v4_chat_permission: info.v4_chat_permission,
			v4_images_permission: info.v4_images_permission,
			v4_tv_permission: info.v4_tv_permission,
			v4_radio_permission: info.v4_radio_permission			
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

	function start_files_loop()
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

				if(socc.id !== socket.id && socc.user_id === socket.user_id)
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

	function get_user_sockets_per_room(room_id, user_id)
	{
		try
		{
			var clients = []

			var ids = Object.keys(io.sockets.adapter.rooms[room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.user_id === user_id)
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

	function get_user_sockets_per_room_by_username(room_id, username)
	{
		try
		{
			var clients = []

			var ids = Object.keys(io.sockets.adapter.rooms[room_id].sockets)

			for(var id of ids)
			{
				var socc = io.sockets.connected[id]

				if(socc.username === username)
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

	function update_user_in_userlist(socket)
	{
		try
		{
			var user = rooms[socket.room_id].userlist[socket.user_id]

			user.user_id = socket.user_id
			user.username = socket.username
			user.role = socket.role
			user.profile_image = socket.profile_image
			user.email = socket.email
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	function get_out(socket)
	{
		try
		{
			user_emit(socket, 'redirect', {location:config.redirect_url})
			do_disconnect(socket)

			return false
		}

		catch(err)
		{
			logger.log_error(err)
		}
	}

	function get_content_type(fname)
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

	function valid_image_extension(ext)
	{
		if(image_extensions.indexOf(ext) !== -1)
		{
			return true
		}

		return false
	}

	function check_multipe_joins(socket)
	{
		try
		{
			var ids = Object.keys(io.sockets.adapter.rooms[socket.room_id].sockets)
			
			for(var i=0; i<ids.length; i++)
			{
				var socc = io.sockets.connected[ids[i]]

				if(socc.user_id !== undefined)
				{
					if(socc.id !== socket.id && socc.user_id === socket.user_id)
					{
						if(socc.joining === true)
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

	function user_emit(socket, type, args={})
	{
		args.type = type
		args.room = socket.room_id

		socket.emit('update', args)
	}

	function room_emit(socket, type, args={})
	{
		if(typeof socket === "object")
		{
			var room_id = socket.room_id
		}

		else
		{
			var room_id = socket
		}

		args.type = type

		io.sockets.in(room_id).emit('update', args)
	}

	function broadcast_emit(socket, type, args={})
	{
		if(typeof socket === "object")
		{
			var room_id = socket.room_id
		}

		else
		{
			var room_id = socket
		}

		args.type = type

		socket.broadcast.in(room_id).emit('update', args)
	}
}