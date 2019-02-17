const electron_notifier = require('node-notifier')

window.electron_api = {}

window.electron_api.highlighted = function(data)
{
	electron_notify("Hue", "You were highlighted")
}

function electron_notify(title, msg)
{
	electron_notifier.notify(
	{
		appName: "com.merkoba.hue",
		title: title,
		message: msg,
		wait: true
	},
	function(err, response) 
	{
		if(err)
		{
			console.error(err)
		}
	})
}