var utilz = Utilz()

var msg = Msg.factory(
{
	id: "info",
	class: "black"
})

function set_message(s)
{
	msg.show(s)
}

$(document).keydown(function(e)
{
	if(msg.is_open())
	{
		if(e.key === "Enter")
		{
			msg.close()
			e.preventDefault()
		}

		else if(e.key !== "Escape")
		{
			e.preventDefault()
		}
	}
})

$(function()
{
	if(message && message !== "undefined")
	{
		set_message(message)
	}
})
