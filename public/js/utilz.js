var Utilz = function()
{
	var utilz = {}

	utilz.clean_string = function(s)
	{
		return s.replace(/</g, '').replace(/\s+/g, ' ').trim()
	}

	utilz.clean_string2 = function(s)
	{
		return s.replace(/\s+/g, ' ').trim()
	}

	utilz.clean_string3 = function(s)
	{
		return s.replace(/[\\"']/g, '')
	}

	utilz.clean_string4 = function(s)
	{
		return s.replace(/[^a-z0-9\-\_\s\@\!\?\&\#\%\<\>\^\$\(\)\[\]\*\"\'\,\.\:\;\|\{\}\=\+\~\/\\]+/gi, "").replace(/\s+/g, " ").trim()
	}

	utilz.get_random_int =function(min, max)
	{
		return Math.floor(Math.random() * (max  -min + 1) + min)
	}	

	utilz.get_random_string =function(n)
	{
		var text = ""

		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

		for(var i=0; i < n; i++)
		{
			text += possible[utilz.get_random_int(0, possible.length - 1)]
		}

		return text
	}		

	return utilz
}

try 
{
	module.exports = Utilz
}

catch(e){}