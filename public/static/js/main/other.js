// Show the Help window
Hue.show_help = function()
{
	let help = Hue.template_help()
	Hue.msg_info2.show(["Help", help])
}

// Sets a variable on context menu show or hide events
// This is to know whether a context menu is open
Hue.context_menu_events =
{
	show: function()
	{
		Hue.context_menu_open = true
	},
	hide: function()
	{
		Hue.context_menu_open = false
	}
}

// Copies a string to the clipboard
Hue.copy_string = function(s, sound=true)
{
	let textareaEl = document.createElement('textarea')

	document.body.appendChild(textareaEl)

	textareaEl.value = s
	textareaEl.select()

	document.execCommand('copy')
	document.body.removeChild(textareaEl)

	if(sound)
	{
		Hue.play_audio("pup2")
	}
}

// Restarts the client
Hue.restart_client = function()
{
	Hue.user_leaving = true
	window.location = window.location
}

// Send a signal to an Electron client
Hue.electron_signal = function(func, data={})
{
	if(window["electron_api"] === undefined)
	{
		return false
	}

	if(window["electron_api"][func] !== undefined)
	{
		window["electron_api"][func](data)
	}
}

// Shows feedback with the current date in the nice date format
Hue.show_current_date = function()
{
	Hue.feedback(Hue.utilz.nice_date())
}

// Feedback that an error occurred
Hue.error_occurred = function()
{
	Hue.feedback("An error occurred")
}

// If the user is banned the client enters locked mode
// This only shows a simple menu with a few navigation options
Hue.start_locked_mode = function()
{
	$("#header").css("display", "none")
	$("#footer").css("display", "none")

	Hue.show_locked_menu()
	Hue.make_main_container_visible()
}

// Show the locked menu
Hue.show_locked_menu = function()
{
	Hue.msg_locked.show()
}

// Execute javascript locally
Hue.execute_javascript = function(arg, show_result=true)
{
	arg = arg.replace(/\s\/endjs/gi, "")

	let r

	try
	{
		r = eval(arg)

		if(typeof r === "number")
		{
			try
			{
				r = Hue.utilz.round(r, 2)
			}

			catch(err){}
		}

		try
		{
			r = JSON.stringify(r)
		}

		catch(err)
		{
			r = "Done"
		}
	}

	catch(err)
	{
		r = "Error"
	}

	if(show_result)
	{
		let s = Hue.make_safe({text:arg})

		let f = function()
		{
			Hue.msg_info2.show(["Executed Javascript", s])
		}

		Hue.feedback(`js: ${r}`, {onclick:f, save:true})
	}
}

// Wrapper to show a confirmation dialog before running a function
Hue.needs_confirm = function(func, s=false)
{
	if(!s)
	{
		s = "Are you sure?"
	}

	if(confirm(s))
	{
		Hue[func]()
	}
}

// Simple emit to check server response
Hue.ping_server = function()
{
	Hue.socket_emit("ping_server", {date:Date.now()})
}

// Calculates how much time the pong response took to arrive
Hue.pong_received = function(data)
{
	let nice_time = Hue.utilz.nice_time(Date.now(), data.date)
	Hue.feedback(`Pong: ${nice_time}`)
}

// Show the credits
Hue.show_credits = function()
{
	Hue.msg_credits.show(function()
	{
		if(!Hue.credits_audio)
		{
			Hue.credits_audio = new Audio()
			Hue.credits_audio.src = Hue.config.credits_audio_url
			Hue.credits_audio.setAttribute("loop", true)
			Hue.credits_audio.play()
		}

		else
		{
			Hue.credits_audio.currentTime = 0
			Hue.credits_audio.play()
		}
	})
}

// Only for superusers
// Sends a system restart signal that tells all clients to refresh
Hue.send_system_restart_signal = function()
{
	Hue.socket_emit("system_restart_signal", {})
}

// Shows the infotip
// This is a black box in the corner meant for quick temporary feedback
Hue.show_infotip = function(s)
{
	$("#infotip").text(s)
	$("#infotip_container").css("display", "block")
	Hue.infotip_timer()
}

// Hides the infotip
Hue.hide_infotip = function()
{
	$("#infotip_container").css("display", "none")
}

// Sends an activity signal to the server
// This is used to know which users might be active
// This is used to display users in the activity bar
Hue.trigger_activity = function()
{
	Hue.socket_emit("activity_trigger", {})
}

// Prints an informational console message
Hue.show_console_message = function()
{
	let s = "🤔 Want to work with us? It's pretty much 99.99% risks, some negligible fraction AI, a couple bureaucracies to keep people minimally pissed off, and a whole lot of creativity."
	let style = "font-size:1.4rem"

	console.info(`%c${s}`, style)
}

// Gets a 'time ago' string from a given date
Hue.get_timeago = function(date)
{
	return Hue.utilz.capitalize_words(timeago.format(date))
}

// Shows a browser notification
Hue.show_notification = function(s)
{
	if(!Hue.has_notifications_permission())
	{
		return false
	}

	let n = new Notification(s)

	n.addEventListener("click", function(e)
	{
		window.focus()
		e.target.close()
	})
}

// Loads a Javascript file from a specified URL
// Resolves a promise when the <script> is loaded
Hue.load_script = function(source)
{
	if(!Hue.load_scripts)
	{
		return false
	}

	console.info(`Loading script: ${source}`)

	return new Promise((resolve, reject) =>
	{
		const script = document.createElement('script')
		document.body.appendChild(script)
		script.onload = resolve
		script.onerror = reject
		script.async = true
		script.src = source
	})
}

// Does a math calculation using math.js
// Includes controls to make a calculation public
Hue.do_math_calculation = async function(arg)
{
	if(Hue.math === undefined)
	{
		if(Hue.math_loading)
		{
			return false
		}

		Hue.math_loading = true

		await Hue.load_script("/static/js/libs/math.min.js")

		Hue.math = math.create(
		{
			number: 'BigNumber',
			precision: 64
		})
	}

	let r

	try
	{
		r = Hue.math.round(Hue.math.eval(arg), Hue.calc_round_places).toString()
	}

	catch(err)
	{
		Hue.feedback("Error")
		return false
	}

	let s = `${arg} = **${r}**`
	let id = `calc_${Date.now()}`

	let f = function()
	{
		Hue.process_message({message:s, to_history:false, callback:function(success)
		{
			if(success)
			{
				$(`#${id}`).remove()
				Hue.goto_bottom(false, false)
			}
		}})
	}

	Hue.feedback(s,
	{
		comment: "Make Public",
		comment_icon: false,
		comment_onclick: f,
		replace_markdown: true,
		id: id
	})
}

// Loads the Wordz library
// Returns a promise
Hue.load_wordz = async function()
{
	if(Hue.wordz_loading)
	{
		return false
	}

	Hue.wordz_loading = true

	return new Promise(async (resolve, reject) =>
	{
		await Hue.load_script("/static/js/libs/wordz.js?version=1")
		Hue.wordz = Wordz()
		resolve()
	})
}