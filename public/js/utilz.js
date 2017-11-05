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
		return s.replace(/[^a-z0-9\-\_\s\@\!\?\&\#\%\<\>\^\$\(\)\[\]\*\"\'\,\.\:\;\|\{\}\=\+\~]+/gi, "").replace(/\s+/g, " ").trim()
	}

	return utilz
}

try 
{
	module.exports = Utilz
}

catch(e){}