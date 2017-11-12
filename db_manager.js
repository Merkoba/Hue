module.exports = function(db, config, sconfig, utilz)
{
	const mongo = require('mongodb')
	const bcrypt = require('bcrypt')
	const mailgun = require('mailgun-js')({apiKey: sconfig.mailgun_api_key, domain: sconfig.mailgun_domain})

	const rooms_version = 18
	const users_version = 17

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
						})

						.catch(err =>
						{
							reject(err)
						})
					}
				}

				if(room && room.version !== rooms_version)
				{
					if(room.name === undefined || typeof room.name !== "string")
					{
						room.name = "No Name"
					}
					
					if(room.image_url === undefined || typeof room.image_url !== "string")
					{
						room.image_url = ""
					}

					if(room.stored_images === undefined || typeof room.stored_images !== "object")
					{
						room.stored_images = []
					}
					
					if(room.image_uploader === undefined || typeof room.image_uploader !== "string")
					{
						room.image_uploader = ""
					}
					
					if(room.image_size === undefined || typeof room.image_size !== "number")
					{
						room.image_size = 0
					}
					
					if(room.image_date === undefined || typeof room.image_date !== "number")
					{
						room.image_date = 0
					}
					
					if(room.topic === undefined || typeof room.topic !== "string")
					{
						room.topic = ""
					}
					
					if(room.topic_setter === undefined || typeof room.topic_setter !== "string")
					{
						room.topic_setter = ""
					}
					
					if(room.topic_date === undefined || typeof room.topic_date !== "number")
					{
						room.topic_date = 0
					}
					
					if(room.claimed === undefined || typeof room.claimed !== "boolean")
					{
						room.claimed = false
					}
					
					if(room.keys === undefined || typeof room.keys !== "string")
					{
						room.keys = ""
					}
					
					if(room.upload_permission === undefined || typeof room.upload_permission !== "number")
					{
						room.upload_permission = 1
					}
					
					if(room.chat_permission === undefined || typeof room.chat_permission !== "number")
					{
						room.chat_permission = 1
					}
					
					if(room.radio_permission === undefined || typeof room.radio_permission !== "number")
					{
						room.radio_permission = 1
					}

					if(room.radio_type === undefined || typeof room.radio_type !== "string")
					{
						room.radio_type = "radio"
					}					
					
					if(room.radio_source === undefined || typeof room.radio_source !== "string")
					{
						room.radio_source = ""
					}

					if(room.radio_title === undefined || typeof room.radio_title !== "string")
					{
						room.radio_title = ""
					}
					
					if(room.radio_setter === undefined || typeof room.radio_setter !== "string")
					{
						room.radio_setter = ""
					}
					
					if(room.radio_date === undefined || typeof room.radio_date !== "number")
					{
						room.radio_date = 0
					}
					
					if(room.bans === undefined || typeof room.bans !== "string")
					{
						room.bans = ""
					}

					if(room.log === undefined || typeof room.log !== "object")
					{
						room.log = true
					}

					if(room.log_messages === undefined || typeof room.log_messages !== "object")
					{
						room.log_messages = []
					}
					
					if(room.modified === undefined || typeof room.modified !== "number")
					{
						room.modified = Date.now()
					}
					
					if(room.public === undefined || typeof room.public !== "boolean")
					{
						room.public = true
					}

					room.version = rooms_version

					db.collection('rooms').update({_id:room._id}, {$set:room})
				}

				resolve(room)
			})

			.catch(err =>
			{
				reject(err)
			})
		})
	}

	manager.create_room = function(data, callback)
	{
		return new Promise((resolve, reject) => 
		{
			room = 
			{
				version: rooms_version,
				image_url: '',
				stored_images: [],
				image_uploader: '',
				image_size: 0,
				image_date: 0,
				topic: '',
				topic_setter: '',
				topic_date: 0,
				claimed: true,
				keys: get_random_key(),
				radio_type: 'radio',
				radio_source: '',
				radio_title: '',
				radio_setter: '',
				radio_date: 0,
				log: true,
				log_messages: [],
				bans: '',
				modified: Date.now()
			}

			if(data.id !== undefined)
			{
				room._id = data.id
			}

			room.name = data.name !== undefined ? data.name : "No Name"
			room.chat_permission = data.chat_permission !== undefined ? data.chat_permission : 1
			room.upload_permission = data.upload_permission !== undefined ? data.upload_permission : 1
			room.radio_permission = data.radio_permission !== undefined ? data.radio_permission : 1
			room.public = data.public !== undefined ? data.public : true

			db.collection('rooms').insertOne(room)

			.then(result =>
			{
				room.fresh = true
				resolve(room)
			})

			.catch(err =>
			{
				reject(err)
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
					}
				}
			}

			fields.modified = Date.now()

			db.collection('rooms').update({_id:_id}, {$set:fields})

			.then(result =>
			{
				resolve(true)
			})

			.catch(err =>
			{
				reject(err)
			})
		})
	}

	manager.find_rooms = function(query, callback)
	{
		return new Promise((resolve, reject) => 
		{
			db.collection('rooms').find(query).toArray()

			.then(results =>
			{
				resolve(results)
			})

			.catch(err =>
			{
				reject(err)
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

				resolve(true)
			})

			.catch(err =>
			{
				reject(err)
			})
		})
	}
	
	manager.get_user = function(query, fields, callback)
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
					}
				}
			}

			db.collection('users').findOne(query, fields)

			.then(user =>
			{
				if(user && user.version !== users_version)
				{
					if(user.username === undefined || typeof user.username !== "string")
					{
						db.users.deleteOne({_id: user._id})
					}

					if(user.password === undefined || typeof user.password !== "string")
					{
						db.users.deleteOne({_id: user._id})
					}

					if(user.email === undefined || typeof user.email !== "string")
					{
						user.email = ""
					}

					if(user.room_keys === undefined || typeof user.room_keys !== "object")
					{
						user.room_keys = {}
					}

					if(user.password_reset_code === undefined || typeof user.password_reset_code !== "string")
					{
						user.password_reset_code = ""
					}

					if(user.password_reset_date === undefined || typeof user.password_reset_date !== "number")
					{
						user.password_reset_date = 0
					}

					if(user.password_reset_link_date === undefined || typeof user.password_reset_link_date !== "number")
					{
						user.password_reset_link_date = 0
					}

					if(user.modified === undefined || typeof user.modified !== "number")
					{
						user.modified = Date.now()
					}

					user.version = users_version

					db.collection('users').update({_id:user._id}, {$set:user})					
				}

				resolve(user)
			})

			.catch(err =>
			{
				reject(err)
			})
		})	
	}

	manager.create_user = function(info, callback)
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
					room_keys: {},
					password_reset_link_date: 0,
					password_reset_date: 0,
					modified: Date.now()
				}

				db.collection('users').insertOne(user)

				.then(result =>
				{	
					user.fresh = true
					resolve(result)
				})

				.catch(err =>
				{
					reject(err)
				})
			})

			.catch(err =>
			{
				reject(err)
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
					
					resolve(true)
				})

				.catch(err =>
				{
					reject(err)
				})
			}

			else
			{
				db.collection('users').update({_id:_id}, {$set:fields})

				resolve(true)
			}
		})	
	}

	manager.check_password = function(username, password, callback)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({username:username}, {})

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
					})

					.catch(err =>
					{
						console.error(err)
					})
				}
			})

			.catch(err =>
			{
				reject(err)
			})
		})	
	}

	manager.change_username = function(_id, username, callback)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({_id:_id}, {})

			.then(user =>
			{
				if(!user)
				{
					resolve(false)
				}

				else
				{
					manager.get_user({username:username}, {})

					.then(user2 =>
					{
						if(user2)
						{
							resolve(false)
						}

						else
						{
							manager.update_user(_id,
							{
								username: username
							})

							resolve(true)					
						}
					})

					.catch(err =>
					{
						reject(err)
					})
				}
			})

			.catch(err =>
			{
				reject(err)
			})
		})	
	}

	manager.reset_user_password = function(username, email, callback)
	{
		return new Promise((resolve, reject) => 
		{
			manager.get_user({username:username}, {})

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
								})								

								resolve("done")
							}
						})
					}

					else
					{
						resolve("limit")
					}
				}

				else
				{
					resolve(false)
				}
			})

			.catch(err =>
			{
				reject(err)
			})
		})		
	}

	return manager
}

