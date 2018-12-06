const Utilz = function()
{
	const utilz = {}

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
		return s.replace(/[^a-z0-9 \-\_\@\!\?\#\%\^\$\'\"\(\)\[\]\*\,\.\:\;\|\{\}\=\+\~\\]+/gi, "").replace(/ +/g, " ").trim()
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
		let ns = []

		let split = s.split('\n')

		for(let line of split)
		{
			let ps = line.replace(/[ \t\f\v]+/g, ' ').trim()

			if(ps !== "")
			{
				ns.push(ps)
			}
		}

		let pf = ns.join('\n')

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
		let text = ""

		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

		for(let i=0; i < n; i++)
		{
			text += possible[utilz.get_random_int(0, possible.length - 1)]
		}

		return text
	}

	utilz.get_youtube_id = function(url)
	{
		let v_id = false
		let list_id = false

		let split = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
		let id = undefined !== split[2] ? split[2].split(/[^0-9a-z_\-]/i)[0] : split[0]

		v_id = id.length === 11 ? id : false

		let list_match = url.match(/(?:\?|&)(list=[0-9A-Za-z_-]+)/)
		
		let index_match = url.match(/(?:\?|&)(index=[0-9]+)/)

		if(list_match)
		{
			list_id = list_match[1].replace("list=", "")		
		}

		if(list_id && !v_id)
		{
			let index = 0

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
		let matches = url.match(/[\?|&]t=(\d+h)?(\d+m)?(\d+s)?(\d+)?/)

		if(matches)
		{
			let first = false

			let h = false
			let m = false 
			let s = false 
			let t = false 

			for(let match of matches)
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

			let time = 0

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
		let match = url.match(/.*twitch\.tv(?:\/videos)?\/(\w+)/)

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

	utilz.round2 = function(value, place)
	{
		return Math.round(value / place) * place
	}

	utilz.humanize_seconds = function(input, separator=":")
	{
		let pad = function(input) 
		{
			return input < 10 ? "0" + input : input
		}

		let result = 
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
		if(s.startsWith("http://") || s.startsWith("https://"))
		{
			let s2 = s.split("//").slice(1).join("//")

			let matches = s2.match(/\/.*\.(\w+)(?=$|[#?])/)

			if(matches)
			{
				return matches[1]
			}
		}

		else
		{
			let matches = s.match(/\.(\w+)(?=$|[#?])/)

			if(matches)
			{
				return matches[1]
			}
		}

		return ""
	}

	utilz.get_root = function(s)
	{
		if(s.startsWith("http://") || s.startsWith("https://"))
		{
			let split = s.split("//")

			let s2 = split.slice(1).join("//")

			return [split[0], s2.split("/")[0]].join("//")
		}

		else
		{
			return s.split("/")[0]
		}

		return ""
	}

	utilz.validate_rgb = function(rgb, case_sensitive=true)
	{
		let re

		if(case_sensitive)
		{
			re = /^[r][g][b][(]([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])[)]$/
		}

		else
		{
			re = /^[R][G][B][(]([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])[)]$/i
		}

		return re.test(rgb)
	}

	utilz.get_imgur_image_code = function(src)
	{
		let matches = src.match(/https\:\/\/(?:i.)?imgur.com\/(\w{7,8})(?:\.\w+)?$/)

		if(matches)
		{
			return matches[1].substring(0, 7)
		}

		else
		{
			return false
		}
	}

	utilz.piano_notes = 
	[
		"c3", "d3", "e3", "f3",
		"g3", "a3", "b3", "c4", "d4"
	]

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