module.exports = function(db, db_manager, config, sconfig, utilz)
{
	const express = require('express')
	const session = require('express-session')
	const favicon = require('serve-favicon')
	const MongoStore = require('connect-mongo')(session);
	const path = require('path')
	const bodyParser = require('body-parser')
	const routes = require('./routes/index')(db_manager, config, sconfig, utilz)

	var app = express()

	app.set('views', path.join(__dirname, 'views'))
	app.set('view engine', 'ejs')
	app.set('trust proxy', 1)	

	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({extended: false}))
	app.use(express.static(path.join(__dirname, 'public')))

	var sess =
	{
		secret: sconfig.session_secret,
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false, maxAge: config.session_cookie_max_age},
		store: new MongoStore({db:db})
	}

	console.log(`ENV: ${app.get('env')}`)

	if(app.get('env') === 'production' && config.https_enabled) 
	{
		app.set('trust proxy', 1)
		sess.cookie.secure = true
	}

	app.use(session(sess))

	app.use('/', routes)

	app.use(function(req, res, next) 
	{
		var err = new Error('Not Found')
		err.status = 404
		next(err)
	})

	if(app.get('env') === 'development') 
	{
		app.use(function(err, req, res, next) 
		{
			res.status(err.status || 500)

			res.render('error', 
			{
				message: err.message,
				error: err
			})
		})
	}

	app.use(function(err, req, res, next) 
	{
		res.status(err.status || 500)

		res.render('error', 
		{
			message: err.message,
			error: {}
		})
	})

	app.use(favicon(path.join(__dirname,'public', 'favicon.ico')))

	return app
}

