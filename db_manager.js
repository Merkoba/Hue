module.exports = function(db, config, sconfig, utilz)
{
	const mongo = require('mongodb')
	const bcrypt = require('bcrypt')
	const mailgun = require('mailgun-js')({apiKey: sconfig.mailgun_api_key, domain: sconfig.mailgun_domain})

	const rooms_version = 33
	const users_version = 25

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
						
						if(typeof room.claimed !== "boolean")
						{
							room.claimed = false
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
							room.default_theme = "rgb(44,44,44)"
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

						if(typeof room.v1_chat_permission !== "boolean")
						{
							room.v1_chat_permission = true
						}	

						if(typeof room.v1_images_permission !== "boolean")
						{
							room.v1_images_permission = true
						}	

						if(typeof room.v1_tv_permission !== "boolean")
						{
							room.v1_tv_permission = true
						}	

						if(typeof room.v1_radio_permission !== "boolean")
						{
							room.v1_radio_permission = true
						}

						if(typeof room.v2_chat_permission !== "boolean")
						{
							room.v2_chat_permission = true
						}	

						if(typeof room.v2_images_permission !== "boolean")
						{
							room.v2_images_permission = true
						}	

						if(typeof room.v2_tv_permission !== "boolean")
						{
							room.v2_tv_permission = true
						}	

						if(typeof room.v2_radio_permission !== "boolean")
						{
							room.v2_radio_permission = true
						}

						if(typeof room.v3_chat_permission !== "boolean")
						{
							room.v3_chat_permission = true
						}	

						if(typeof room.v3_images_permission !== "boolean")
						{
							room.v3_images_permission = true
						}	

						if(typeof room.v3_tv_permission !== "boolean")
						{
							room.v3_tv_permission = true
						}	

						if(typeof room.v3_radio_permission !== "boolean")
						{
							room.v3_radio_permission = true
						}

						if(typeof room.v4_chat_permission !== "boolean")
						{
							room.v4_chat_permission = true
						}	

						if(typeof room.v4_images_permission !== "boolean")
						{
							room.v4_images_permission = true
						}	

						if(typeof room.v4_tv_permission !== "boolean")
						{
							room.v4_tv_permission = true
						}	

						if(typeof room.v4_radio_permission !== "boolean")
						{
							room.v4_radio_permission = true
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
							return
						})
					})

					.catch(err =>
					{
						reject(err)
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
				claimed: true,
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
				default_theme: "rgb(44, 44, 44)",
				default_background_image: "",
				default_background_image_enabled: true,
				log: true,
				v1_chat_permission: true,
				v1_images_permission: true,
				v1_tv_permission: true,
				v1_radio_permission: true,
				v2_chat_permission: true,
				v2_images_permission: true,
				v2_tv_permission: true,
				v2_radio_permission: true,
				v3_chat_permission: true,
				v3_images_permission: true,
				v3_tv_permission: true,
				v3_radio_permission: true,
				v4_chat_permission: true,
				v4_images_permission: true,
				v4_tv_permission: true,
				v4_radio_permission: true,
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
				room.fresh = true
				resolve(room)
				return
			})

			.catch(err =>
			{
				reject(err)
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
					return
				})

				resolve(true)
				return
			})

			.catch(err =>
			{
				reject(err)
				return
			})
		})
	}
	
	manager.get_user = function(query, fields)
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
							return
						})
					})

					.catch(err =>
					{
						reject(err)
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
					email: info.email, 
					password_reset_link_date: 0,
					password_reset_date: 0,
					visited_rooms: [],
					profile_image: "",
					profile_image_version: 0,
					modified: Date.now()
				}

				db.collection('users').insertOne(user)

				.then(result =>
				{	
					user.fresh = true
					resolve(result)
					return
				})

				.catch(err =>
				{
					reject(err)
					return
				})
			})

			.catch(err =>
			{
				reject(err)
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
						return
					})
					
					return
				})

				.catch(err =>
				{
					reject(err)
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
					return
				})

				return
			}
		})	
	}

	manager.check_password = function(username, password, fields={})
	{
		return new Promise((resolve, reject) => 
		{	
			Object.assign(fields, {password:true})

			manager.get_user({username:username}, fields)

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
						return
					})
				}
			})

			.catch(err =>
			{
				reject(err)
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

							resolve(true)
							return
						}
					})

					.catch(err =>
					{
						reject(err)
						return
					})
				}
			})

			.catch(err =>
			{
				reject(err)
				return
			})
		})	
	}

	manager.reset_user_password = function(username, email)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({username:username}, {email:true, password_reset_date:true})

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
							from: 'Hue <hue@merkoba.com>',
							to: email,
							subject: 'Password Reset',
							text: link
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
					return
				})
			})

			.catch(err =>
			{
				reject(err)
				return
			})
		})
	}

	return manager
}

