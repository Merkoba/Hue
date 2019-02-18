module.exports = function(db, config, sconfig, utilz, logger)
{
	const mongo = require('mongodb')
	const bcrypt = require('bcrypt')
	const mailgun = require('mailgun-js')({apiKey: sconfig.mailgun_api_key, domain: sconfig.mailgun_domain})
	const reserved_usernames = ["The system", config.image_ads_setter].map(x => x.toLowerCase())

	const rooms_version = 71
	const users_version = 41

	const rooms_schema =
	{
		name:{type:"string", default:"No Name"},
		image_source:{type:"string", default:""},
		image_setter:{type:"string", default:""},
		image_size:{type:"number", default:0},
		image_date:{type:"number", default:0},
		image_query:{type:"string", default:""},
		image_type:{type:"string", default:"link"},
		stored_images:{type:"object", default:[]},
		topic:{type:"string", default:""},
		topic_setter:{type:"string", default:""},
		topic_date:{type:"number", default:0},
		keys:{type:"object", default:{}},
		radio_type:{type:"string", default:"radio"},
		radio_source:{type:"string", default:""},
		radio_title:{type:"string", default:""},
		radio_setter:{type:"string", default:""},
		radio_date:{type:"number", default:0},
		radio_query:{type:"string", default:""},
		tv_type:{type:"string", default:"tv"},
		tv_source:{type:"string", default:""},
		tv_title:{type:"string", default:""},
		tv_setter:{type:"string", default:""},
		tv_date:{type:"number", default:0},
		tv_query:{type:"string", default:""},
		images_mode:{type:"string", default:"enabled"},
		tv_mode:{type:"string", default:"enabled"},
		radio_mode:{type:"string", default:"enabled"},
		synth_mode:{type:"string", default:"enabled"},
		bans:{type:"object", default:[]},
		log:{type:"boolean", default:true},
		log_messages:{type:"object", default:[]},
		admin_log_messages:{type:"object", default:[]},
		access_log_messages:{type:"object", default:[]},
		theme_mode:{type:"string", default:"custom"},
		theme:{type:"string", default:"rgb(77,69,140)"},
		background_image:{type:"string", default:""},
		background_image_setter:{type:"string", default:""},
		background_image_date:{type:"number", default:0},
		background_image_type:{type:"string", default:"hosted"},
		background_mode:{type:"string", default:"normal"},
		background_effect:{type:"string", default:"none"},
		background_tile_dimensions:{type:"string", default:"100px auto"},
		text_color_mode:{type:"string", default:"automatic"},
		text_color:{type:"string", default:"rgb(205,202,223)"},
		modified:{type:"number", default:Date.now()},
		public:{type:"boolean", default:true},
		voice1_chat_permission:{type:"boolean", default:true},
		voice1_images_permission:{type:"boolean", default:true},
		voice1_tv_permission:{type:"boolean", default:true},
		voice1_radio_permission:{type:"boolean", default:true},
		voice1_synth_permission:{type:"boolean", default:true},
		voice2_chat_permission:{type:"boolean", default:true},
		voice2_images_permission:{type:"boolean", default:true},
		voice2_tv_permission:{type:"boolean", default:true},
		voice2_radio_permission:{type:"boolean", default:true},
		voice2_synth_permission:{type:"boolean", default:true},
		voice3_chat_permission:{type:"boolean", default:true},
		voice3_images_permission:{type:"boolean", default:true},
		voice3_tv_permission:{type:"boolean", default:true},
		voice3_radio_permission:{type:"boolean", default:true},
		voice3_synth_permission:{type:"boolean", default:true},
		voice4_chat_permission:{type:"boolean", default:true},
		voice4_images_permission:{type:"boolean", default:true},
		voice4_tv_permission:{type:"boolean", default:true},
		voice4_radio_permission:{type:"boolean", default:true},
		voice4_synth_permission:{type:"boolean", default:true}
	}

	const users_schema = 
	{
		username:{type:"string", default:"", skip:true},
		password:{type:"string", default:"", skip:true},
		email:{type:"string", default:"", skip:true},
		password_date:{type:"number", default:0},
		password_reset_code:{type:"string", default:""},
		password_reset_date:{type:"number", default:0},
		password_reset_link_date:{type:"number", default:0},
		visited_rooms:{type:"object", default:[]},
		profile_image:{type:"string", default:""},
		profile_image_version:{type:"number", default:0},
		verified:{type:"boolean", default:false},
		verification_code:{type:"string", default:""},
		registration_date:{type:"number", default:0},
		email_change_code:{type:"string", default:""},
		email_change_date:{type:"number", default:0},
		email_change_code_date:{type:"number", default:0},
		create_room_date:{type:"number", default:0},
		modified:{type:"number", default:Date.now()}
	}

	function get_random_key()
	{
		return `_key_${Date.now()}_${utilz.get_random_string(12)}`
	}

	const manager = {}

	manager.get_room = function(query, fields)
	{
		return new Promise((resolve, reject) => 
		{
			let num_fields = Object.keys(fields).length

			if(num_fields > 0)
			{
				let has_zero = false

				for(let key in fields)
				{
					if(fields[key] === 0)
					{
						has_zero = true
						break
					}
				}

				if(!has_zero)
				{
					fields.version = 1
				}
			}

			if(query._id !== undefined)
			{
				if(typeof query._id === "string" && query._id !== config.main_room_id)
				{
					try
					{
						query._id = new mongo.ObjectId(query._id)
					}

					catch(err)
					{
						resolve(false)
						return
					}
				}
			}

			let pfields = {}

			if(num_fields > 0)
			{
				pfields = {projection:fields}
			}

			db.collection("rooms").findOne(query, pfields)

			.then(room =>
			{
				if(!room)
				{
					if(query._id === config.main_room_id)
					{
						manager.create_room({name:config.default_main_room_name, id:config.main_room_id})

						.then(room =>
						{
							resolve(room)
							return
						})

						.catch(err =>
						{
							reject(err)
							logger.log_error(err)
							return
						})

						return
					}

					else
					{
						resolve(false)
						return
					}
				}

				if(room && room.version !== rooms_version)
				{
					db.collection('rooms').findOne({_id:room._id}, {})

					.then(room =>
					{
						manager.room_fill_defaults(room)

						room.version = rooms_version

						db.collection('rooms').updateOne({_id:room._id}, {$set:room})

						.then(ans =>
						{
							resolve(room)
							return
						})

						.catch(err =>
						{
							reject(err)
							logger.log_error(err)
							return
						})
					})

					.catch(err =>
					{
						reject(err)
						logger.log_error(err)
						return
					})
				}

				else
				{
					resolve(room)
					return
				}
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}

	manager.room_fill_defaults = function(room)
	{
		for(let key in rooms_schema)
		{
			let item = rooms_schema[key]

			if(item.skip)
			{
				continue
			}

			if(typeof room[key] !== item.type)
			{
				room[key] = item.default
			}
		}
	}

	manager.create_room = function(data)
	{
		return new Promise((resolve, reject) => 
		{
			room = {}

			manager.room_fill_defaults(room)
			
			if(data.id !== undefined)
			{
				room._id = data.id
			}

			if(data.user_id !== undefined)
			{
				room.keys[data.user_id] = "admin"
			}

			room.name = data.name !== undefined ? data.name : "No Name"
			room.public = data.public !== undefined ? data.public : true

			room.version = rooms_version

			db.collection('rooms').insertOne(room)

			.then(result =>
			{
				resolve(room)
				return
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}	

	manager.user_create_room = function(data, force=false)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({_id:data.user_id}, {create_room_date:1})

			.then(user =>
			{
				if(!force)
				{
					if(Date.now() - user.create_room_date < config.create_room_cooldown)
					{
						resolve('wait')
						return
					}
				}

				manager.create_room(data)

				.then(ans =>
				{
					manager.update_user(data.user_id,
					{
						create_room_date: Date.now()
					})

					.catch(err =>
					{
						reject(err)
						logger.log_error(err)
						return
					})

					resolve(ans)
					return
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})				
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})			
		})
	}

	manager.update_room = function(_id, fields)
	{
		return new Promise((resolve, reject) =>
		{
			if(_id !== undefined)
			{
				if(typeof _id === "string" && _id !== config.main_room_id)
				{
					try
					{
						_id = new mongo.ObjectId(_id)
					}

					catch(err)
					{
						resolve(false)
						return
					}
				}
			}

			fields.modified = Date.now()

			let check = manager.validate_room(fields)

			if(!check.passed)
			{
				console.error(check.message)
				resolve(false)
				return
			}

			db.collection('rooms').updateOne({_id:_id}, {$set:fields})

			.then(result =>
			{
				resolve(true)
				return
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}

	manager.find_rooms = function(query)
	{
		return new Promise((resolve, reject) => 
		{
			db.collection('rooms').find(query).toArray()

			.then(results =>
			{
				resolve(results)
				return
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}

	manager.push_log_messages = function(_id, messages)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_room({_id:_id}, {log_messages:1})

			.then(room =>
			{
				room.log_messages = room.log_messages.concat(messages)

				if(room.log_messages.length > config.max_log_messages)
				{
					room.log_messages = room.log_messages.slice(room.log_messages.length - config.max_log_messages)
				}

				manager.update_room(_id, {log_messages:room.log_messages})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})

				resolve(true)
				return
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}

	manager.push_admin_log_messages = function(_id, messages)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_room({_id:_id}, {admin_log_messages:1})

			.then(room =>
			{
				room.admin_log_messages = room.admin_log_messages.concat(messages)

				if(room.admin_log_messages.length > config.max_admin_log_messages)
				{
					room.admin_log_messages = room.admin_log_messages.slice(room.admin_log_messages.length - config.max_admin_log_messages)
				}

				manager.update_room(_id, {admin_log_messages:room.admin_log_messages})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})

				resolve(true)
				return
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}

	manager.push_access_log_messages = function(_id, messages)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_room({_id:_id}, {access_log_messages:1})

			.then(room =>
			{
				room.access_log_messages = room.access_log_messages.concat(messages)

				if(room.access_log_messages.length > config.max_access_log_messages)
				{
					room.access_log_messages = room.access_log_messages.slice(room.access_log_messages.length - config.max_access_log_messages)
				}

				manager.update_room(_id, {access_log_messages:room.access_log_messages})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})

				resolve(true)
				return
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}
	
	manager.get_user = function(query, fields, verified=true)
	{
		return new Promise((resolve, reject) => 
		{
			let num_fields = Object.keys(fields).length

			let multiple = false

			if(num_fields > 0)
			{
				let has_zero = false

				for(let key in fields)
				{
					if(fields[key] === 0)
					{
						has_zero = true
						break
					}
				}

				if(!has_zero)
				{
					fields.version = 1
				}
			}

			if(query._id !== undefined)
			{
				if(typeof query._id === "object")
				{
					if(query._id.$in !== undefined)
					{
						let ids = []

						for(let id of query._id.$in)
						{
							ids.push(new mongo.ObjectId(id))
						}

						query._id.$in = ids

						multiple = true
					}
				}

				else if(typeof query._id === "string")
				{
					try
					{
						query._id = new mongo.ObjectId(query._id)
					}

					catch(err)
					{
						resolve(false)
						return
					}
				}
			}

			let pfields = {}

			if(num_fields > 0)
			{
				pfields = {projection:fields}
			}

			if(query.verified === undefined)
			{
				if(verified)
				{
					query = {$and:[query, {verified:true}]}
				}

				else
				{
					query = {$and:[query, {$or:[{verified:true}, {registration_date:{$gt: Date.now() - config.max_verification_time}}]}]}
				}
			}

			if(multiple)
			{
				db.collection('users').find(query, pfields).toArray()

				.then(users =>
				{
					if(users.length === 0)
					{
						resolve([])
						return
					}

					let i = 0;

					for(let user of users)
					{
						manager.on_user_found(user)

						.then(() =>
						{
							i += 1

							if(i === users.length)
							{
								resolve(users)
								return
							}
						})

						.catch(err =>
						{
							reject(err)
							logger.log_error(err)
							return
						})

					}
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})
			}

			else
			{
				db.collection('users').findOne(query, pfields)

				.then(user =>
				{
					manager.on_user_found(user)

					.then(()=>
					{
						resolve(user)
						return
					})
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})
			}
		})	
	}

	manager.on_user_found = function(user)
	{
		return new Promise((resolve, reject) => 
		{
			if(user && user.version !== users_version)
			{
				db.collection('users').findOne({_id:user._id}, {})

				.then(user =>
				{
					if(typeof user.username !== "string")
					{
						resolve(false)
						return
					}

					if(typeof user.password !== "string")
					{
						resolve(false)
						return
					}

					manager.user_fill_defaults(user)

					user.version = users_version

					db.collection('users').updateOne({_id:user._id}, {$set:user})

					.then(ans =>
					{
						resolve(user)
						return
					})

					.catch(err => 
					{
						reject(err)
						logger.log_error(err)
						return
					})
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})
			}

			else
			{
				resolve(user)
			}
		})
	}

	manager.user_fill_defaults = function(user)
	{
		for(let key in users_schema)
		{
			let item = users_schema[key]

			if(item.skip)
			{
				continue
			}

			if(typeof user[key] !== item.type)
			{
				user[key] = item.default
			}
		}
	}

	manager.create_user = function(info)
	{
		return new Promise((resolve, reject) => 
		{
			bcrypt.hash(info.password, config.encryption_cost)

			.then(hash =>
			{
				let user = {}

				user =
				{
					username: info.username,
					password: hash,
					password_date: Date.now(),
					email: info.email, 
					verified: false,
					verification_code: Date.now() + utilz.get_random_string(12),
					registration_date: Date.now()
				}

				manager.user_fill_defaults(user)

				user.version = users_version

				db.collection('users').insertOne(user)

				.then(result =>
				{
					let link = `${config.site_root}verify?token=${result.ops[0]._id}_${result.ops[0].verification_code}`					

					let data = 
					{
						from: `${config.delivery_email_name} <${config.delivery_email}>`,
						to: info.email,
						subject: 'Account Verification',
						text: `Click the link to activate the account on ${config.site_root}. If you didn't register here, ignore this.\n\n${link}`
					}

					mailgun.messages().send(data, function(error, body) 
					{
						if(error)
						{				
							resolve("error")
							return
						}

						else
						{
							resolve("done")
							return
						}
					})
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})	
	}

	manager.update_user = function(_id, fields)
	{
		return new Promise((resolve, reject) => 
		{
			if(_id !== undefined)
			{
				if(typeof _id === "string")
				{
					try
					{
						_id = new mongo.ObjectId(_id)
					}

					catch(err)
					{
						resolve(false)
						return
					}
				}
			}

			fields.modified = Date.now()

			if(fields.password !== undefined)
			{
				bcrypt.hash(fields.password, config.encryption_cost)

				.then(hash =>
				{
					fields.password = hash

					let check = manager.validate_user(fields)

					if(!check.passed)
					{
						console.error(check.message)
						resolve(false)
						return
					}

					db.collection('users').updateOne({_id:_id}, {$set:fields})

					.then(ans =>
					{
						resolve(true)
						return
					})

					.catch(err =>
					{
						reject(err)
						logger.log_error(err)
						return
					})
					
					return
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})
			}

			else
			{
				let check = manager.validate_user(fields)

				if(!check.passed)
				{
					console.error(check.message)
					resolve(false)
					return
				}
				
				db.collection('users').updateOne({_id:_id}, {$set:fields})

				.then(ans =>
				{
					resolve(true)
					return
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})

				return
			}
		})	
	}

	manager.check_password = function(email, password, fields={})
	{
		return new Promise((resolve, reject) => 
		{	
			Object.assign(fields, {password:1})

			manager.get_user({email:email}, fields)

			.then(user =>
			{
				if(!user)
				{
					resolve({user:null, valid:false})
				}

				else 
				{
					bcrypt.compare(password, user.password)

					.then(valid =>
					{
						resolve({user:user, valid:valid})
						return
					})

					.catch(err =>
					{
						reject(err)
						logger.log_error(err)
						return
					})
				}
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})	
	}

	manager.change_username = function(_id, username)
	{
		return new Promise((resolve, reject) => 
		{
			if(reserved_usernames.includes(username.toLowerCase()))
			{
				resolve(false)
				return
			}

			manager.get_user({_id:_id}, {username:1})

			.then(user =>
			{
				if(!user)
				{
					resolve(false)
					return
				}

				else
				{
					manager.get_user({username:username}, {username:1})

					.then(user2 =>
					{
						if(user2)
						{
							resolve(false)
							return
						}

						else
						{
							manager.update_user(_id,
							{
								username: username
							})

							.catch(err =>
							{
								reject(err)
								logger.log_error(err)
								return
							})							

							resolve(true)
							return
						}
					})

					.catch(err =>
					{
						reject(err)
						logger.log_error(err)
						return
					})
				}
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})	
	}

	manager.change_email = function(_id, email, verify_code=false)
	{
		return new Promise((resolve, reject) => 
		{	
			manager.get_user({_id:_id}, 
			{
				email: 1,
				email_change_code: 1,
				email_change_date: 1,
				email_change_code_date: 1,
				email_change_email: 1
			})

			.then(user =>
			{
				if(!user)
				{
					resolve({message:"error"})
					return
				}

				else
				{					
					manager.get_user({email:email}, {email:1})

					.then(user2 =>
					{
						if(user2)
						{
							resolve({message:"duplicate"})
							return
						}

						else
						{
							if(verify_code)
							{
								if(!user.email_change_code_date)
								{
									resolve({message:"not_sent"})
									return
								}

								if(verify_code === user.email_change_code)
								{
									if(Date.now() - user.email_change_code_date < config.email_change_expiration)
									{
										manager.update_user(_id,
										{
											email: user.email_change_email,
											email_change_code_date: 0
										})

										.catch(err =>
										{
											reject(err)
											logger.log_error(err)
											return
										})

										resolve({message:"changed", email:user.email_change_email})
										return
									}

									else
									{
										resolve({message:"expired_code"})
										return false
									}
								}

								else
								{
									resolve({message:"wrong_code"})
									return false
								}
							}

							else
							{
								if((Date.now() - user.email_change_date) > config.email_change_limit)
								{
									let code = Date.now() + utilz.get_random_string(12)

									let command = `/verifyemail ${code}`

									let data = 
									{
										from: `${config.delivery_email_name} <${config.delivery_email}>`,
										to: email,
										subject: 'Confirm Email',
										text: `Enter the command while connected to a room in ${config.site_root} to confirm your email.\n\n${command}`
									}

									mailgun.messages().send(data, function(error, body) 
									{
										if(error)
										{
											resolve({message:"error"})
											return
										}

										else
										{
											manager.update_user(user._id, 
											{
												email_change_code: code,
												email_change_date: Date.now(),
												email_change_code_date: Date.now(),
												email_change_email: email
											})

											.catch(err =>
											{
												reject(err)
												logger.log_error(err)
												return
											})

											resolve({message:"sent_code"})
											return
										}
									})
								}

								else
								{
									resolve({message:"wait"})
									return									
								}
							}
						}
					})

					.catch(err =>
					{
						reject(err)
						logger.log_error(err)
						return
					})
				}
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})	
	}

	manager.reset_user_password = function(email)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({email:email}, {email:1, password_reset_date:1})

			.then(user =>
			{
				if(user && user.email === email)
				{
					if((Date.now() - user.password_reset_date) > config.password_reset_limit)
					{
						let code = Date.now() + utilz.get_random_string(12)

						let link = `${config.site_root}change_password?token=${user._id.toString()}_${code}`

						let data = 
						{
							from: `${config.delivery_email_name} <${config.delivery_email}>`,
							to: email,
							subject: 'Password Reset',
							text: `Click the link to reset your password on ${config.site_root}.\n\n${link}`
						}

						mailgun.messages().send(data, function(error, body) 
						{
							if(error)
							{
								resolve("error")
								return
							}

							else
							{
								manager.update_user(user._id, 
								{
									password_reset_code: code,
									password_reset_date: Date.now(),
									password_reset_link_date: Date.now()
								})

								.catch(err =>
								{
									reject(err)
									logger.log_error(err)
									return
								})								

								resolve("done")
								return
							}
						})
					}

					else
					{
						resolve("limit")
						return
					}
				}

				else
				{
					resolve(false)
					return
				}
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})		
	}

	manager.save_visited_room = function(user_id, room_id)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({_id:user_id}, {visited_rooms:1})

			.then(user =>
			{
				let visited = user.visited_rooms

				for(let i=0; i<visited.length; i++)
				{
					let v = visited[i]

					if(v === room_id)
					{
						visited.splice(i, 1)
						break
					}
				}

				visited.unshift(room_id)

				if(visited.length > config.max_visited_rooms_items)
				{
					visited = visited.slice(0, config.max_visited_rooms_items)
				}

				manager.update_user(user_id, {visited_rooms:visited})

				.then(ans =>
				{
					resolve(ans)
					return
				})

				.catch(err =>
				{
					reject(err)
					logger.log_error(err)
					return
				})
			})

			.catch(err =>
			{
				reject(err)
				logger.log_error(err)
				return
			})
		})
	}

	manager.validate_room = function(fields)
	{
		for(let key in fields)
		{
			let item = rooms_schema[key]
			let data = fields[key]

			if(item)
			{
				let type = typeof data

				if(type !== item.type)
				{
					let s = `Room validation failed on ${key}. Expected type ${item.type}, got type ${type}`
					return {passed:false, message:s}
				}
			}

			else
			{
				let s = `Room validation failed on ${key}. It does not exist in the database`
				return {passed:false, message:s}
			}
		}

		return {passed:true, message:"ok"}
	}

	manager.validate_user = function(fields)
	{
		for(let key in fields)
		{
			let item = users_schema[key]
			let data = fields[key]

			if(item)
			{
				let type = typeof data

				if(type !== item.type)
				{
					let s = `User validation failed on ${key}. Expected type ${item.type}, got type ${type}`
					return {passed:false, message:s}
				}
			}
		}

		return {passed:true, message:"ok"}
	}

	return manager
}