// Show the Help window
Hue.show_help = function()
{
	let help = Hue.template_help()
	Hue.msg_info2.show(["Help", help])
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

// Feedback that an error occurred
Hue.error_occurred = function()
{
	Hue.feedback("An error occurred")
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

// Prints an informational console message
Hue.show_console_message = function()
{
	let s = "🤔 Want to work with us? It's pretty much 99.99% risks, some negligible fraction AI, a couple bureaucracies to keep people minimally pissed off, and a whole lot of creativity."
	let style = "font-size:1.4rem"

	console.info(`%c${s}`, style)
}