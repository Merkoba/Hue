module.exports = function(db_manager, config, sconfig, utilz)
{
	const jwt = require('jsonwebtoken')
	const express = require('express')
	const fetch = require('node-fetch')
	const router = express.Router()

	var c = {}

	c.vars = {}

	c.vars.site_root = config.site_root
	c.vars.main_room_id = config.main_room_id
	c.vars.default_image_source = config.default_image_source
	c.vars.default_tv_source = config.default_tv_source
	c.vars.default_tv_type = config.default_tv_type
	c.vars.default_radio_source = config.default_radio_source
	c.vars.default_radio_title = config.default_radio_title
	c.vars.default_radio_type = config.default_radio_type
	c.vars.check_metadata_interval_duration = config.check_metadata_interval_duration
	c.vars.opacity_amount_1 = config.opacity_amount_1
	c.vars.opacity_amount_2 = config.opacity_amount_2
	c.vars.color_contrast_amount_1 = config.color_contrast_amount_1
	c.vars.color_contrast_amount_2 = config.color_contrast_amount_2
	c.vars.color_contrast_amount_3 = config.color_contrast_amount_3
	c.vars.chat_crop_limit = config.chat_crop_limit
	c.vars.chat_history_crop_limit = config.chat_history_crop_limit
	c.vars.played_crop_limit = config.played_crop_limit
	c.vars.input_history_crop_limit = config.input_history_crop_limit
	c.vars.max_input_length = config.max_input_length
	c.vars.max_topic_length = config.max_topic_length
	c.vars.max_username_length = config.max_username_length
	c.vars.max_max_username_length = config.max_max_username_length
	c.vars.max_room_name_length = config.max_room_name_length
	c.vars.max_image_source_length = config.max_image_source_length
	c.vars.max_tv_source_length = config.max_tv_source_length
	c.vars.max_radio_source_length = config.max_radio_source_length
	c.vars.max_title_length = config.max_title_length
	c.vars.small_keyboard_scroll = config.small_keyboard_scroll
	c.vars.big_keyboard_scroll = config.big_keyboard_scroll
	c.vars.max_image_size = config.max_image_size
	c.vars.topic_separator = config.topic_separator
	c.vars.title_separator = config.title_separator
	c.vars.default_title = config.default_title
	c.vars.default_topic = config.default_topic
	c.vars.default_topic_admin = config.default_topic_admin
	c.vars.default_topic_unclaimed = config.default_topic_unclaimed
	c.vars.youtube_enabled = config.youtube_enabled
	c.vars.twitch_enabled = config.twitch_enabled
	c.vars.soundcloud_enabled = config.soundcloud_enabled
	c.vars.min_password_length = config.min_password_length
	c.vars.max_password_length = config.max_password_length
	c.vars.max_email_length = config.max_email_length
	c.vars.global_settings_default_background_image = config.global_settings_default_background_image
	c.vars.global_settings_default_custom_scrollbars = config.global_settings_default_custom_scrollbars
	c.vars.global_settings_default_modal_effects = config.global_settings_default_modal_effects
	c.vars.global_settings_default_highlight_current_username = config.global_settings_default_highlight_current_username
	c.vars.global_settings_default_case_insensitive_highlights = config.global_settings_default_case_insensitive_highlights
	c.vars.global_settings_default_other_words_to_highlight = config.global_settings_default_other_words_to_highlight
	c.vars.global_settings_default_double_tap = config.global_settings_default_double_tap
	c.vars.global_settings_default_double_tap_2 = config.global_settings_default_double_tap_2
	c.vars.global_settings_default_double_tap_3 = config.global_settings_default_double_tap_3
	c.vars.global_settings_default_afk_delay = config.global_settings_default_afk_delay
	c.vars.global_settings_default_beep_on_messages = config.global_settings_default_beep_on_messages
	c.vars.global_settings_default_beep_on_highlights = config.global_settings_default_beep_on_highlights
	c.vars.global_settings_default_beep_on_media_change = config.global_settings_default_beep_on_media_change
	c.vars.global_settings_default_beep_on_user_joins = config.global_settings_default_beep_on_user_joins
	c.vars.global_settings_default_at_startup = config.global_settings_default_at_startup
	c.vars.global_settings_default_ignored_usernames = config.global_settings_default_ignored_usernames
	c.vars.global_settings_default_show_joins = config.global_settings_default_show_joins
	c.vars.global_settings_default_show_parts = config.global_settings_default_show_parts
	c.vars.global_settings_default_animate_scroll = config.global_settings_default_animate_scroll
	c.vars.global_settings_default_new_messages_separator = config.global_settings_default_new_messages_separator
	c.vars.global_settings_default_afk_disable_messages_beep = config.global_settings_default_afk_disable_messages_beep
	c.vars.global_settings_default_afk_disable_highlights_beep = config.global_settings_default_afk_disable_highlights_beep
	c.vars.global_settings_default_afk_disable_media_change_beep = config.global_settings_default_afk_disable_media_change_beep
	c.vars.global_settings_default_afk_disable_joins_beep = config.global_settings_default_afk_disable_joins_beep
	c.vars.global_settings_default_afk_disable_image_change = config.global_settings_default_afk_disable_image_change
	c.vars.global_settings_default_afk_disable_tv_change = config.global_settings_default_afk_disable_tv_change
	c.vars.global_settings_default_afk_disable_radio_change	 = config.global_settings_default_afk_disable_radio_change	
	c.vars.global_settings_default_open_popup_messages	 = config.global_settings_default_open_popup_messages	
	c.vars.room_settings_default_images_enabled = config.room_settings_default_images_enabled
	c.vars.room_settings_default_tv_enabled = config.room_settings_default_tv_enabled
	c.vars.room_settings_default_radio_enabled = config.room_settings_default_radio_enabled
	c.vars.room_settings_default_images_locked = config.room_settings_default_images_locked
	c.vars.room_settings_default_tv_locked = config.room_settings_default_tv_locked
	c.vars.room_settings_default_radio_locked = config.room_settings_default_radio_locked
	c.vars.double_tap_key = config.double_tap_key
	c.vars.double_tap_key_2 = config.double_tap_key_2
	c.vars.double_tap_key_3 = config.double_tap_key_3
	c.vars.default_profile_image_url = config.default_profile_image_url
	c.vars.profile_image_loading_url = config.profile_image_loading_url
	c.vars.image_queue_interval = config.image_queue_interval
	c.vars.default_background_image_url = config.default_background_image_url
	c.vars.background_image_loading_url = config.background_image_loading_url
	c.vars.upload_slice_size = config.upload_slice_size
	c.vars.max_same_post_diff = config.max_same_post_diff
	c.vars.max_same_post_messages = config.max_same_post_messages
	c.vars.max_typing_inactivity = config.max_typing_inactivity
	c.vars.default_video_url = config.default_video_url
	c.vars.media_history_max_items = config.media_history_max_items
	c.vars.images_changed_crop_limit = config.images_changed_crop_limit
	c.vars.email_change_code_max_length = config.email_change_code_max_length
	c.vars.socket_emit_throttle = config.socket_emit_throttle
	c.vars.safe_limit_1 = config.safe_limit_1
	c.vars.safe_limit_2 = config.safe_limit_2
	c.vars.safe_limit_3 = config.safe_limit_3
	c.vars.disconnect_timeout_delay = config.disconnect_timeout_delay

	function check_url(req, res, next)
	{
		if(req.originalUrl.length > config.max_url_length)
		{
			return false
		}
		
		if(req.params.id !== undefined)
		{
			var id = req.params.id.substr(0, config.max_room_id_length)

			if(id === config.main_room_id)
			{
				res.redirect(`/`)
				return
			}
		}

		next()
	}

	function require_login(req, res, next)
	{
		var fromurl = encodeURIComponent(req.originalUrl)

		if(req.session.user_id === undefined)
		{
			res.redirect(`/login?fromurl=${fromurl}`)
		}

		else
		{
			db_manager.get_user({_id:req.session.user_id}, {password_date:true})

			.then(user =>
			{
				if(!user || (req.session.password_date !== user.password_date))
				{
					req.session.destroy(function(){})
					res.redirect(`/login?fromurl=${fromurl}`)
				}

				else 
				{
					jwt.sign(
					{
						exp: Math.floor(Date.now() + config.jwt_expiration),
						data: {id:req.session.user_id}
					}, sconfig.jwt_secret, function(err, token)
					{
						if(!err)
						{
							req.jwt_token = token
							next()
						}
					})
				}
			})

			.catch(err =>
			{
				console.error(err)
			})
		}
	}	

	router.get('/login', check_url, function(req, res, next) 
	{
		let c = {}

		c.vars = {}

		c.vars.login_logo_url = config.login_logo_url
		c.vars.fromurl = req.query.fromurl
		c.vars.message = decodeURIComponent(req.query.message)
		c.vars.min_password_length = config.min_password_length
		c.vars.max_max_password_length = config.max_max_password_length
		c.vars.max_max_email_length = config.max_max_email_length
		c.vars.login_title = config.login_title
		c.vars.form_email = decodeURIComponent(req.query.form_email)

		res.render('login', c)
	})

	router.post('/login', function(req, res, next) 
	{
		var email = req.body.email
		var password = req.body.password
		var fromurl = decodeURIComponent(req.body.fromurl)

		if(email.length === 0 || email.length > config.max_max_email_length)
		{
			return false
		}

		if(password.length === 0 || password.length > config.max_max_password_length)
		{
			return false
		}

		db_manager.check_password(email, password, {password_date:true})

		.then(ans =>
		{
			if(ans.valid)
			{
				req.session.user_id = ans.user._id.toString()
				req.session.password_date = ans.user.password_date

				if(fromurl === undefined || fromurl === "" || fromurl === "/login")
				{
					res.redirect("/")
				}

				else
				{
					res.redirect(fromurl)
				}				
			}

			else
			{
				req.session.destroy(function(){})

				var m = encodeURIComponent("Wrong email or password")
				var form_email = encodeURIComponent(email)

				res.redirect(`/login?message=${m}&form_email=${form_email}`)
			}
		})

		.catch(err =>
		{
			console.error(err)
		})
	})

	router.get('/register', check_url, function(req, res, next) 
	{
		let c = {}

		c.vars = {}

		c.vars.register_logo_url = config.register_logo_url
		c.vars.message = decodeURIComponent(req.query.message)
		c.vars.max_username_length = config.max_username_length
		c.vars.min_password_length = config.min_password_length
		c.vars.max_password_length = config.max_password_length
		c.vars.max_email_length = config.max_email_length
		c.vars.register_title = config.register_title
		c.vars.recaptcha_enabled = config.recaptcha_enabled
		c.vars.form_username = decodeURIComponent(req.query.form_username)
		c.vars.form_email = decodeURIComponent(req.query.form_email)

		if(config.recaptcha_enabled)
		{
			c.vars.recaptcha_key = sconfig.recaptcha_key
		}

		res.render('register', c)
	})

	router.post('/register', function(req, res, next) 
	{
		var username = req.body.username
		var password = req.body.password 
		var email = req.body.email

		if(username.length === 0 || username.length > config.max_username_length)
		{
			return false
		}

		if(username !== utilz.clean_string4(username))
		{
			return false
		}

		if(password.length === 0 || password.length < config.min_password_length || password.length > config.max_password_length)
		{
			return false
		}

		if(email.length === 0 || email.length > config.max_email_length)
		{
			return false
		}

		if(email.indexOf('@') === -1 || email.indexOf(' ') !== -1)
		{
			return false
		}

		if(email !== utilz.clean_string5(email))
		{
			return false
		}

		if(config.recaptcha_enabled)
		{
			var recaptcha_response = req.body["g-recaptcha-response"]
			var remote_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

			if(recaptcha_response === undefined || recaptcha_response === '' || recaptcha_response === null)
			{
				return false
			}

			fetch('https://www.google.com/recaptcha/api/siteverify', 
			{
				method: 'POST',
				body: `secret=${sconfig.recaptcha_secret_key}&response=${recaptcha_response}&remoteip=${remote_ip}`,
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
			})

			.then(res => res.json())

			.then(json => 
			{
				if(json.success)
				{
					do_register(req, res, next)
				}

				else
				{
					var m = encodeURIComponent(`There was a problem verifying you're not a robot`)
					res.redirect(`/message?message=${m}`)
				}
			})

			.catch(err =>
			{
				var m = encodeURIComponent(`There was a problem verifying you're not a robot`)
				res.redirect(`/message?message=${m}`)
				console.error(err)
			})
		}

		else
		{
			do_register(req, res, next)
		}
	})

	function do_register(req, res, next)
	{
		var username = req.body.username
		var password = req.body.password 
		var email = req.body.email

		db_manager.get_user({$or:[{username:username}, {email:email}]}, {username:true}, false)

		.then(user =>
		{
			if(!user)
			{
				db_manager.create_user({username:username, password:password, email:email})

				.then(ans =>
				{
					if(ans === "done")
					{
						var m = encodeURIComponent(`Account verification link sent to ${email}\nYou must verify the email to be able to login\nEmail might take a couple of minutes to arrive`)
						res.redirect(`/message?message=${m}`)
					}

					else
					{
						var m = encodeURIComponent("An error occurred")
						res.redirect(`/message?message=${m}`)
					}
				})

				.catch(err =>
				{
					console.error(err)
				})
			}

			else
			{
				var m = encodeURIComponent("Username or email already exist")
				var form_username = encodeURIComponent(username)
				var form_email = encodeURIComponent(email)

				res.redirect(`/register?message=${m}&form_username=${form_username}&form_email=${form_email}`)
			}
		})

		.catch(err =>
		{
			console.error(err)
		})		
	}

	router.get('/verify', check_url, function(req, res, next)
	{
		var token = req.query.token

		if(token.length === 0)
		{
			return false
		}

		if(token.indexOf('_') === -1)
		{
			return false
		}		

		var split = token.split('_')

		var id = split[0]

		var code = split[1]

		db_manager.get_user({_id:id, verification_code:code, verified:false}, {registration_date:true})

		.then(user =>
		{
			if(user)
			{
				if(Date.now() - user.registration_date < config.max_verification_time)
				{
					db_manager.update_user(user._id, {verified: true})

					.then(ans =>
					{
						var m = encodeURIComponent("Account successfully verified")
						res.redirect(`/message?message=${m}`)						
					})

					.catch(err =>
					{
						console.error(err)
					})					
				}

				else
				{
					var m = encodeURIComponent("The link has expired")
					res.redirect(`/message?message=${m}`)
				}
			}

			else
			{
				var m = encodeURIComponent("The link has expired")
				res.redirect(`/message?message=${m}`)
			}
		})

		.catch(err =>
		{
			console.error(err)
		})
	})	

	router.post('/check_username', function(req, res, next)	
	{
		var username = req.body.username

		if(username.length === 0 || username.length > config.max_max_username_length)
		{
			return false
		}

		db_manager.get_user({username:username}, {username:true}, false)

		.then(user =>
		{
			if(user)
			{
				var taken = true
			}

			else
			{
				var taken = false
			}

			res.json({taken:taken})
		})

		.catch(err =>
		{
			console.error(err)
		})
	})

	router.post('/check_email', function(req, res, next)	
	{
		var email = req.body.email

		if(email.length === 0 || email.length > config.max_max_email_length)
		{
			return false
		}

		db_manager.get_user({email:email}, {email:true}, false)

		.then(user =>
		{
			if(user)
			{
				var taken = true
			}

			else
			{
				var taken = false
			}

			res.json({taken:taken})
		})

		.catch(err =>
		{
			console.error(err)
		})
	})

	router.get('/recover', check_url, function(req, res, next) 
	{
		let c = {}

		c.vars = {}

		c.vars.message = decodeURIComponent(req.query.message)
		c.vars.max_max_email_length = config.max_max_email_length

		res.render('recover', c)
	})

	router.post('/recover', function(req, res, next) 
	{
		var email = req.body.email

		if(email.length === 0 || email.length > config.max_max_email_length)
		{
			return false
		}

		if(email.indexOf('@') === -1 || email.indexOf(' ') !== -1)
		{
			return false
		}

		db_manager.reset_user_password(email)

		.then(result =>
		{
			if(result)
			{
				if(result === "done")
				{
					var m = encodeURIComponent(`If an email matched we will send a password reset link to ${email}\nEmail might take a couple of minutes to arrive`)
					res.redirect(`/message?message=${m}`)
				}

				else if(result === "limit")
				{
					var m = encodeURIComponent("You must wait a while before resetting the password again")
					res.redirect(`/message?message=${m}`)
				}

				else if(result === "error")
				{
					var m = encodeURIComponent("There was an error. Please try again later")
					res.redirect(`/message?message=${m}`)					
				}

				else
				{
					return false
				}
			}

			else
			{
				var m = encodeURIComponent(`If an email matched we will send a password reset link to ${email}\nEmail might take a couple of minutes to arrive`)
				res.redirect(`/message?message=${m}`)
			}
		})

		.catch(err =>
		{
			console.error(err)
		})
	})

	router.get('/change_password', check_url, function(req, res, next)
	{
		var token = req.query.token

		if(token.length === 0)
		{
			return false
		}

		if(token.indexOf('_') === -1)
		{
			return false
		}

		var split = token.split('_')

		var id = split[0]

		var code = split[1]

		db_manager.get_user({_id:id, password_reset_code:code}, {password_reset_link_date:true})

		.then(user =>
		{
			if(user)
			{
				if(Date.now() - user.password_reset_link_date < config.password_reset_expiration)
				{
					var c = {}

					c.vars = {}

					c.vars.min_password_length = config.min_password_length
					c.vars.max_password_length = config.max_password_length
					c.vars.message = decodeURIComponent(req.query.message)
					c.vars.token = token

					res.render('change_password', c)
				}

				else
				{
					var m = encodeURIComponent("The link has expired")
					res.redirect(`/message?message=${m}`)
				}
			}

			else
			{
				var m = encodeURIComponent("The link has expired")
				res.redirect(`/message?message=${m}`)
			}
		})

		.catch(err =>
		{
			console.error(err)
		})
	})

	router.post('/change_password', function(req, res, next)
	{
		var token = req.body.token

		var split = token.split('_')

		var id = split[0]

		var code = split[1]

		db_manager.get_user({_id:id, password_reset_code:code}, {password_reset_link_date:true})

		.then(user =>
		{
			if(user)
			{
				if(Date.now() - user.password_reset_link_date < config.password_reset_expiration)
				{
					var password = req.body.password 

					if(password.length === 0 || password.length < config.min_password_length || password.length > config.max_password_length)
					{
						return false
					}

					db_manager.update_user(user._id, {password:password, password_reset_link_date:0, password_date:Date.now()})

					.catch(err =>
					{
						console.error(err)
					})

					var m = encodeURIComponent("Password successfully changed")
					res.redirect(`/message?message=${m}`)					
				}

				else
				{
					var m = encodeURIComponent("The link has expired")
					res.redirect(`/message?message=${m}`)
				}
			}

			else
			{
				var m = encodeURIComponent("The link has expired")
				res.redirect(`/message?message=${m}`)
			}
		})

		.catch(err =>
		{
			console.error(err)
		})
	})

	router.get('/message', check_url, function(req, res, next) 
	{
		let c = {}

		c.vars = {}

		c.vars.message2 = decodeURIComponent(req.query.message).replace(/\n/g, "<br>")

		res.render('message', c)
	})		

	router.get('/logout', function(req, res, next) 
	{
		req.session.destroy(function(){})
		res.redirect('/login')
	})	

	router.get('/', [check_url, require_login], function(req, res, next) 
	{
		c.vars.room_id = config.main_room_id
		c.vars.user_id = req.session.user_id
		c.vars.jwt_token = req.jwt_token
		res.render('main', c)
	})
	
	router.get('/:id(\\w+)', [check_url, require_login], function(req, res, next) 
	{
		c.vars.room_id = req.params.id.substr(0, config.max_room_id_length)
		c.vars.user_id = req.session.user_id
		c.vars.jwt_token = req.jwt_token
		res.render('main', c)
	})

	return router
}