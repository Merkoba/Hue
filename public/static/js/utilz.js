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
		return s.replace(/[^a-z0-9 \-\_\@\!\?\#\%\^\$\(\)\[\]\*\"\'\,\.\:\;\|\{\}\=\+\~\/\\]+/gi, "").replace(/ +/g, " ").trim()
	}

	utilz.clean_string5 = function(s)
	{
		return s.replace(/\s+/g, '').trim()
	}	

	utilz.clean_string6 = function(s)
	{
		return s.replace(/\s+/g, ' ')
	}

	utilz.clean_string7 = function(s)
	{
		var ns = []

		var split = s.split('\n')

		for(var line of split)
		{
			var ps = line.replace(/[ \t\f\v]+/g, ' ').trim()

			if(ps !== "")
			{
				ns.push(ps)
			}
		}

		var pf = ns.join('\n')

		return pf
	}

	utilz.clean_string8 = function(s)
	{
		return s.replace(/[\n\r]+/g, '\n').trim()
	}

	utilz.clean_string9 = function(s)
	{
		return s.replace(/[\n\r]+/g, '\n')
	}

	utilz.clean_string10 = function(s)
	{
		return s.replace(/[\n\r]+/g, '\n').replace(/\s+$/g, '')
	}

	utilz.clean_string11 = function(s)
	{
		return s.replace(/^\/\s+/g, '/')
	}

	utilz.get_random_int = function(min, max)
	{
		return Math.floor(Math.random() * (max  -min + 1) + min)
	}	

	utilz.get_random_string = function(n)
	{
		var text = ""

		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

		for(var i=0; i < n; i++)
		{
			text += possible[utilz.get_random_int(0, possible.length - 1)]
		}

		return text
	}

	utilz.get_youtube_id = function(url)
	{
		var v_id = false
		var list_id = false

		var split = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
		var id = undefined !== split[2] ? split[2].split(/[^0-9a-z_\-]/i)[0] : split[0]

		v_id = id.length === 11 ? id : false

		var list_match = url.match(/(?:\?|&)(list=[0-9A-Za-z_-]+)/)
		
		var index_match = url.match(/(?:\?|&)(index=[0-9]+)/)

		if(list_match)
		{
			list_id = list_match[1].replace("list=", "")		
		}

		if(list_id && !v_id)
		{
			var index = 0

			if(index_match)
			{
				index = parseInt(index_match[1].replace("index=", "")) - 1
			}

			return ["list", [list_id, index]]
		}

		else if(v_id)
		{
			return ["video", v_id]
		}

		else
		{
			return false
		}
	}

	utilz.get_youtube_time = function(url)
	{
		var matches = url.match(/[\?|&]t=(\d+h)?(\d+m)?(\d+s)?(\d+)?/)

		if(matches)
		{
			var first = false

			var h = false
			var m = false 
			var s = false 
			var t = false 

			for(var match of matches)
			{
				if(!first)
				{
					first = true
					continue
				}

				if(match === undefined)
				{
					continue
				}

				if(match.includes("h"))
				{
					h = parseInt(match.replace("h", ""))
				}

				else if(match.includes("m"))
				{
					m = parseInt(match.replace("m", ""))
				}

				else if(match.includes("s"))
				{
					s = parseInt(match.replace("s", ""))
				}

				else
				{
					t = parseInt(match)
				}

			}

			var time = 0

			if(h)
			{
				time += h * 60 * 60
			}

			if(m)
			{
				time += m * 60
			}

			if(s)
			{
				time += s
			}

			if(t)
			{
				time += t
			}

			return time
		}

		else
		{
			return 0
		}
	}

	utilz.get_twitch_id = function(url)
	{
		var match = url.match(/.*twitch\.tv(?:\/videos)?\/(\w+)/)

		if(match)
		{
			if(match[0].includes('twitch.tv/videos/'))
			{
				return ["video", match[1]]
			}

			else if(match[0].includes("clips.twitch.tv"))
			{
				return false
			}

			else
			{
				return ["channel", match[1]]
			}
		}

		else
		{
			return false
		}
	}

	utilz.object_to_array = function(obj)
	{
		return Object.keys(obj).map(function(key) 
		{
			return obj[key]
		})
	}

	utilz.round = function(value, decimals)
	{
  		return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
	}

	utilz.humanize_seconds = function(input, separator=":")
	{
		var pad = function(input) 
		{
			return input < 10 ? "0" + input : input
		}

		var result =  
		[
			pad(Math.floor(input / 3600)),
			pad(Math.floor(input % 3600 / 60)),
			pad(Math.floor(input % 60)),
		].join(separator)

		return result
	}

	utilz.nonbreak = function(s)
	{
		return s.trim().split(" ").join("&nbsp;")
	}

	utilz.get_extension = function(s)
	{
		var matches = s.match(/\.(\w+)(?=$|[#?])/)

		if(matches)
		{
			return matches[1]
		}

		else
		{
			return ""
		}
	}

	utilz.video_extensions = ["mp4", "webm", "m3u8"]
	utilz.audio_extensions = ["mp3", "ogg", "wav", "flac"]
	utilz.image_extensions = ["jpg", "jpeg", "png", "gif"]

	return utilz
}

try 
{
	module.exports = Utilz
}

catch(e){}