const remote = require('electron').remote
const electron_notifier = require('node-notifier')

window.electron_api = {}

window.electron_api.highlighted = function(data)
{
	if(remote.getCurrentWindow().isFocused())
	{
		return false
	}

	electron_notify("Hue", "You were highlighted")
}

window.electron_api.close_window = function(data)
{
	remote.getCurrentWindow().close()
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