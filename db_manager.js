module.exports = function(db, config, sconfig, utilz, logger)
{
	const mongo = require('mongodb')
	const bcrypt = require('bcrypt')
	const mailgun = require('mailgun-js')({apiKey: sconfig.mailgun_api_key, domain: sconfig.mailgun_domain})

	const rooms_version = 35
	const users_version = 28

	function get_random_key()
	{
		return `_key_${Date.now()}_${utilz.get_random_string(12)}`
	}

	var manager = {}

	manager.get_room = function(query, fields)
	{
		return new Promise((resolve, reject) => 
		{
			if(Object.keys(fields).length > 0)
			{
				fields.version = true
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

			db.collection("rooms").findOne(query, fields)

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
						if(typeof room.name !== "string")
						{
							room.name = "No Name"
						}
						
						if(typeof room.image_url !== "string")
						{
							room.image_url = ""
						}
						
						if(typeof room.image_uploader !== "string")
						{
							room.image_uploader = ""
						}
						
						if(typeof room.image_size !== "number")
						{
							room.image_size = 0
						}
						
						if(typeof room.image_date !== "number")
						{
							room.image_date = 0
						}

						if(typeof room.image_type !== "string")
						{
							room.image_type = "upload"
						}

						if(typeof room.stored_images !== "object")
						{
							room.stored_images = []
						}
						
						if(typeof room.topic !== "string")
						{
							room.topic = ""
						}
						
						if(typeof room.topic_setter !== "string")
						{
							room.topic_setter = ""
						}
						
						if(typeof room.topic_date !== "number")
						{
							room.topic_date = 0
						}
						
						if(typeof room.keys !== "object")
						{
							room.keys = {}
						}

						if(typeof room.radio_type !== "string")
						{
							room.radio_type = "radio"
						}					
						
						if(typeof room.radio_source !== "string")
						{
							room.radio_source = ""
						}

						if(typeof room.radio_title !== "string")
						{
							room.radio_title = ""
						}
						
						if(typeof room.radio_setter !== "string")
						{
							room.radio_setter = ""
						}
						
						if(typeof room.radio_date !== "number")
						{
							room.radio_date = 0
						}

						if(typeof room.tv_type !== "string")
						{
							room.tv_type = "tv"
						}					
						
						if(typeof room.tv_source !== "string")
						{
							room.tv_source = ""
						}

						if(typeof room.tv_title !== "string")
						{
							room.tv_title = ""
						}
						
						if(typeof room.tv_setter !== "string")
						{
							room.tv_setter = ""
						}
						
						if(typeof room.tv_date !== "number")
						{
							room.tv_date = 0
						}	

						if(typeof room.images_enabled !== "boolean")
						{
							room.images_enabled = true
						}	

						if(typeof room.radio_enabled !== "boolean")
						{
							room.radio_enabled = true
						}	

						if(typeof room.tv_enabled !== "boolean")
						{
							room.tv_enabled = true
						}
						
						if(typeof room.bans !== "object")
						{
							room.bans = []
						}

						if(typeof room.log !== "object")
						{
							room.log = true
						}

						if(typeof room.log_messages !== "object")
						{
							room.log_messages = []
						}

						if(typeof room.default_theme !== "string")
						{
							room.default_theme = "rgb(92, 75, 93)"
						}

						if(typeof room.default_background_image !== "string")
						{
							room.default_background_image = ""
						}

						if(typeof room.default_background_image_enabled !== "boolean")
						{
							room.default_background_image_enabled = true
						}
						
						if(typeof room.modified !== "number")
						{
							room.modified = Date.now()
						}
						
						if(typeof room.public !== "boolean")
						{
							room.public = true
						}

						if(typeof room.voice1_chat_permission !== "boolean")
						{
							room.voice1_chat_permission = true
						}	

						if(typeof room.voice1_images_permission !== "boolean")
						{
							room.voice1_images_permission = true
						}	

						if(typeof room.voice1_tv_permission !== "boolean")
						{
							room.voice1_tv_permission = true
						}	

						if(typeof room.voice1_radio_permission !== "boolean")
						{
							room.voice1_radio_permission = true
						}

						if(typeof room.voice2_chat_permission !== "boolean")
						{
							room.voice2_chat_permission = true
						}	

						if(typeof room.voice2_images_permission !== "boolean")
						{
							room.voice2_images_permission = true
						}	

						if(typeof room.voice2_tv_permission !== "boolean")
						{
							room.voice2_tv_permission = true
						}	

						if(typeof room.voice2_radio_permission !== "boolean")
						{
							room.voice2_radio_permission = true
						}

						if(typeof room.voice3_chat_permission !== "boolean")
						{
							room.voice3_chat_permission = true
						}	

						if(typeof room.voice3_images_permission !== "boolean")
						{
							room.voice3_images_permission = true
						}	

						if(typeof room.voice3_tv_permission !== "boolean")
						{
							room.voice3_tv_permission = true
						}	

						if(typeof room.voice3_radio_permission !== "boolean")
						{
							room.voice3_radio_permission = true
						}

						if(typeof room.voice4_chat_permission !== "boolean")
						{
							room.voice4_chat_permission = true
						}	

						if(typeof room.voice4_images_permission !== "boolean")
						{
							room.voice4_images_permission = true
						}	

						if(typeof room.voice4_tv_permission !== "boolean")
						{
							room.voice4_tv_permission = true
						}	

						if(typeof room.voice4_radio_permission !== "boolean")
						{
							room.voice4_radio_permission = true
						}

						room.version = rooms_version

						db.collection('rooms').update({_id:room._id}, {$set:room})

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

	manager.create_room = function(data)
	{
		return new Promise((resolve, reject) => 
		{
			room = 
			{
				version: rooms_version,
				image_url: '',
				image_uploader: '',
				image_size: 0,
				image_date: 0,
				image_type: "upload",
				stored_images: [],
				topic: '',
				topic_setter: '',
				topic_date: 0,
				keys: {},
				radio_type: 'radio',
				radio_source: '',
				radio_title: '',
				radio_setter: '',
				radio_date: 0,
				tv_type: '',
				tv_source: '',
				tv_title: '',
				tv_setter: '',
				tv_date: 0,
				log_messages: [],
				bans: [],
				images_enabled: true,
				radio_enabled: true,
				tv_enabled: true,
				default_theme: "rgb(92, 75, 93)",
				default_background_image: "",
				default_background_image_enabled: true,
				log: true,
				voice1_chat_permission: true,
				voice1_images_permission: true,
				voice1_tv_permission: true,
				voice1_radio_permission: true,
				voice2_chat_permission: true,
				voice2_images_permission: true,
				voice2_tv_permission: true,
				voice2_radio_permission: true,
				voice3_chat_permission: true,
				voice3_images_permission: true,
				voice3_tv_permission: true,
				voice3_radio_permission: true,
				voice4_chat_permission: true,
				voice4_images_permission: true,
				voice4_tv_permission: true,
				voice4_radio_permission: true,
				modified: Date.now()
			}

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

	manager.user_create_room = function(data)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({_id:data.user_id}, {create_room_date:true})

			.then(user =>
			{
				if(Date.now() - user.create_room_date < config.create_room_cooldown)
				{
					resolve('wait')
					return
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

			db.collection('rooms').update({_id:_id}, {$set:fields})

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

	manager.push_room_messages = function(_id, messages)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_room({_id:_id}, {log_messages:true})

			.then(room =>
			{
				room.log_messages = room.log_messages.concat(messages)

				if(room.log_messages.length > config.max_room_log_messages)
				{
					room.log_messages = room.log_messages.slice(room.log_messages.length - config.max_room_log_messages)
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
	
	manager.get_user = function(query, fields, verified=true)
	{
		return new Promise((resolve, reject) => 
		{
			if(Object.keys(fields).length > 0)
			{
				fields.version = true
			}

			if(query._id !== undefined)
			{
				if(typeof query._id === "string")
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

			db.collection('users').findOne(query, fields)

			.then(user =>
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

						if(typeof user.password_date !== "number")
						{
							user.password_date = 0
						}

						if(typeof user.email !== "string")
						{
							user.email = ""
						}

						if(typeof user.password_reset_code !== "string")
						{
							user.password_reset_code = ""
						}

						if(typeof user.password_reset_date !== "number")
						{
							user.password_reset_date = 0
						}

						if(typeof user.password_reset_link_date !== "number")
						{
							user.password_reset_link_date = 0
						}

						if(typeof user.visited_rooms !== "object")
						{
							user.visited_rooms = []
						}

						if(typeof user.profile_image !== "string")
						{
							user.profile_image = ""
						}

						if(typeof user.profile_image_version !== "number")
						{
							user.profile_image_version = 0
						}

						if(typeof user.verified !== "boolean")
						{
							user.verified = false
						}

						if(typeof user.verification_code !== "string")
						{
							user.verification_code = ""
						}

						if(typeof user.registration_date !== "number")
						{
							user.registration_date = 0
						}

						if(typeof user.email_change_code !== "string")
						{
							user.email_change_code = ""
						}

						if(typeof user.email_change_date !== "number")
						{
							user.email_change_date = 0
						}

						if(typeof user.email_change_code_date !== "number")
						{
							user.email_change_code_date = 0
						}

						if(typeof user.create_room_date !== "number")
						{
							user.create_room_date = 0
						}						

						if(typeof user.modified !== "number")
						{
							user.modified = Date.now()
						}						

						user.version = users_version

						db.collection('users').update({_id:user._id}, {$set:user})

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

	manager.create_user = function(info)
	{
		return new Promise((resolve, reject) => 
		{
			bcrypt.hash(info.password, config.encryption_cost)

			.then(hash =>
			{
				var user = {}

				user =
				{
					version: users_version,
					username: info.username,
					password: hash,
					password_date: Date.now(),
					email: info.email, 
					password_reset_link_date: 0,
					password_reset_date: 0,
					visited_rooms: [],
					profile_image: "",
					profile_image_version: 0,
					verified: false,
					verification_code: Date.now() + utilz.get_random_string(12),
					registration_date: Date.now(),
					modified: Date.now()
				}

				db.collection('users').insertOne(user)

				.then(result =>
				{
					var code = Date.now() + utilz.get_random_string(12)

					var link = `${config.site_root}verify?token=${result.ops[0]._id}_${result.ops[0].verification_code}`					

					var data = 
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

					db.collection('users').update({_id:_id}, {$set:fields})

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
				db.collection('users').update({_id:_id}, {$set:fields})

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
			Object.assign(fields, {password:true})

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
			manager.get_user({_id:_id}, {username:true})

			.then(user =>
			{
				if(!user)
				{
					resolve(false)
					return
				}

				else
				{
					manager.get_user({username:username}, {username:true})

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
				email: true,
				email_change_code: true,
				email_change_date: true,
				email_change_code_date: true,
				email_change_email: true
			})

			.then(user =>
			{
				if(!user)
				{
					resolve({msg:"error"})
					return
				}

				else
				{					
					manager.get_user({email:email}, {email:true})

					.then(user2 =>
					{
						if(user2)
						{
							resolve({msg:"duplicate"})
							return
						}

						else
						{
							if(verify_code)
							{
								if(!user.email_change_code_date)
								{
									resolve({msg:"not_sent"})
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

										resolve({msg:"changed", email:user.email_change_email})
										return
									}

									else
									{
										resolve({msg:"expired_code"})
										return false
									}
								}

								else
								{
									resolve({msg:"wrong_code"})
									return false
								}
							}

							else
							{
								if((Date.now() - user.email_change_date) > config.email_change_limit)
								{
									var code = Date.now() + utilz.get_random_string(12)

									var command = `/verifyemail ${code}`

									var data = 
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
											resolve({msg:"error"})
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

											resolve({msg:"sent_code"})
											return
										}
									})
								}

								else
								{
									resolve({msg:"wait"})
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
			manager.get_user({email:email}, {email:true, password_reset_date:true})

			.then(user =>
			{
				if(user && user.email === email)
				{
					if((Date.now() - user.password_reset_date) > config.password_reset_limit)
					{
						var code = Date.now() + utilz.get_random_string(12)

						var link = `${config.site_root}change_password?token=${user._id.toString()}_${code}`

						var data = 
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
			manager.get_user({_id:user_id}, {visited_rooms:true})

			.then(user =>
			{
				var visited = user.visited_rooms

				for(var i=0; i<visited.length; i++)
				{
					var v = visited[i]

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

	return manager
}

