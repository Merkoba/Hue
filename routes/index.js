module.exports = function(db_manager, config, utilz)
{
	const express = require('express')
	const router = express.Router()

	var c = {}

	c.vars = {}

	c.vars.site_root = config.site_root
	c.vars.main_room_id = config.main_room_id
	c.vars.default_image_url = config.default_image_url
	c.vars.loading_image_url = config.loading_image_url
	c.vars.default_radio_source = config.default_radio_source
	c.vars.check_metadata_interval_duration = config.check_metadata_interval_duration
	c.vars.general_opacity = config.general_opacity
	c.vars.color_contrast_amount_1 = config.color_contrast_amount_1
	c.vars.color_contrast_amount_2 = config.color_contrast_amount_2
	c.vars.color_contrast_amount_3 = config.color_contrast_amount_3
	c.vars.color_contrast_amount_4 = config.color_contrast_amount_4
	c.vars.default_modal_color = config.default_modal_color
	c.vars.chat_crop_limit = config.chat_crop_limit
	c.vars.played_crop_limit = config.played_crop_limit
	c.vars.history_crop_limit = config.history_crop_limit
	c.vars.max_input_length = config.max_input_length
	c.vars.max_topic_length = config.max_topic_length
	c.vars.max_nickname_length = config.max_nickname_length
	c.vars.max_room_name_length = config.max_room_name_length
	c.vars.max_radio_source_length = config.max_radio_source_length
	c.vars.max_title_length = config.max_title_length
	c.vars.max_no_meta_count = config.max_no_meta_count
	c.vars.small_keyboard_scroll = config.small_keyboard_scroll
	c.vars.big_keyboard_scroll = config.big_keyboard_scroll
	c.vars.max_image_size = config.max_image_size
	c.vars.topic_separator = config.topic_separator
	c.vars.title_separator = config.title_separator
	c.vars.default_title = config.default_title
	c.vars.default_topic = config.default_topic
	c.vars.default_topic_unclaimed = config.default_topic_unclaimed
	c.vars.afk_timeout_duration = config.afk_timeout_duration
	c.vars.heartbeat_interval = config.heartbeat_interval
	c.vars.youtube_enabled = config.youtube_enabled	
	c.vars.max_visited_rooms_items = config.max_visited_rooms_items
	c.vars.min_password_length = config.min_password_length
	c.vars.max_password_length = config.max_password_length	

	function require_login(req, res, next)
	{
		var fromurl = encodeURIComponent(req.originalUrl)

		if(req.session.user_id === undefined)
		{
			let c = {}

			c.vars = {}

			c.vars.fromurl = req.originalUrl

			res.redirect(`/login?fromurl=${fromurl}`)
		}

		else
		{
			db_manager.get_user({_id:req.session.user_id}, {}, function(user)
			{
				if(!user)
				{
					req.session.destroy(function(){})
					res.redirect(`/login?fromurl=${fromurl}`)
				}

				else 
				{
					req.session.user_username = user.username
					next()
				}
			})
		}
	}	

	router.get('/login', function(req, res, next) 
	{
		let c = {}

		c.vars = {}

		c.vars.login_logo_url = config.login_logo_url
		c.vars.fromurl = req.query.fromurl
		c.vars.message = req.query.message
		c.vars.max_nickname_length = config.max_nickname_length
		c.vars.min_password_length = config.min_password_length
		c.vars.max_password_length = config.max_password_length
		c.vars.max_max_nickname_length = config.max_max_nickname_length
		c.vars.max_max_password_length = config.max_max_password_length
		c.vars.login_title = config.login_title

		res.render('login', c)
	})

	router.post('/login', function(req, res, next) 
	{
		var username = req.body.username
		var password = req.body.password
		var fromurl = decodeURIComponent(req.body.fromurl)

		if(username.length === 0 || username.length > 300)
		{
			return false
		}

		if(password.length === 0 || password.length > 2000)
		{
			return false
		}

		db_manager.check_password(username, password, function(user, valid)
		{
			if(valid)
			{
				req.session.user_id = user._id.toString()

				if(fromurl === undefined || fromurl === "" || fromurl === "/login" || fromurl === "/register")
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
				res.redirect("/login?message=Wrong%20username%20or%20password")
			}
		})
	})

	router.post('/register', function(req, res, next) 
	{
		var username = req.body.username
		var password = req.body.password 
		var fromurl = req.body.fromurl

		if(username.length === 0 || username.length > config.max_nickname_length)
		{
			return false
		}

		if(username.length !== utilz.clean_string4(username).length)
		{
			return false
		}

		if(password.length < config.min_password_length || password.length > config.max_password_length)
		{
			return false
		}

		db_manager.get_user({username:username}, {}, function(user)
		{
			if(!user)
			{
				db_manager.create_user(username, password, function(user)
				{
					req.session.user_id = user.ops[0]._id

					req.session.save(function()
					{
						if(fromurl === undefined || fromurl === "" || fromurl === "/login" || fromurl === "/register")
						{
							res.redirect("/")
						}

						else
						{
							res.redirect(fromurl)
						}
					})
				})
			}

			else
			{
				res.redirect("/login?message=Username%20already%20exists")
			}
		})
	})

	router.get('/logout', function(req, res, next) 
	{
		req.session.destroy(function(){})
		res.redirect('/login')
	})	

	router.get('/', require_login, function(req, res, next) 
	{
		c.vars.room_id = config.main_room_id
		c.vars.user_id = req.session.user_id
		c.vars.user_username = req.session.user_username
		res.render('main', c)
	})
	
	router.get('/:id', require_login, function(req, res, next) 
	{
		c.vars.room_id = req.params.id.substr(0, config.max_room_id_length)
		c.vars.user_id = req.session.user_id
		c.vars.user_username = req.session.user_username
		res.render('main', c)
	})

	return router
}