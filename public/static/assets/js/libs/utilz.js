const Utilz = function () {
	const utilz = {}

	// Clean string util
	utilz.single_space = function (s) {
		return s.replace(/\s+/g, ' ').trim()
	}

	// Clean string util
	utilz.clean_username = function (s) {
		return s.replace(/[^a-z0-9]+/gi, "").replace(/ +/g, " ").trim()
	}

	// Clean string util
	utilz.no_space = function (s) {
		return s.replace(/\s+/g, '').trim()
	}

	// Replace multiple empty lines with a single one
	utilz.remove_multiple_empty_lines = function (s, level = 1) {
		let ns = []
		let charge = 0
		let split = s.split('\n')

		for (let line of split) {
			if (line.trim() === "") {
				if (charge < level) {
					ns.push(line)
				}
        
				charge += 1
			} else {
				charge = 0
				ns.push(line)
			}
		}

		let pf = ns.join('\n')

		return pf
	}

	// Remove empty lines from the start
	utilz.remove_pre_empty_lines = function (s) {
		let split = s.split("\n")
		let counter = 0

		for (let line of split) {
			if (line.trim()) {
				return split.slice(counter).join("\n")
			} else {
				counter += 1
			}
		}
	}

	// Clean string util
	utilz.single_linebreak = function (s) {
		return s.replace(/[\n\r]+/g, '\n').replace(/ +/g, ' ').trim()
	}

	// Get a random int from min to max. Optional exclude a number
	utilz.get_random_int = function (min, max, exclude = undefined) {
		let num = Math.floor(Math.random() * (max - min + 1) + min)

		if (exclude !== undefined) {
			if (num === exclude) {
				if (num + 1 <= max) {
					num = num + 1
				} else if (num - 1 >= min) {
					num = num - 1
				}
			}
		}

		return num
	}

	// Shuffle an array
	utilz.shuffle_array = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1))
			let temp = array[i]
			array[i] = array[j]
			array[j] = temp
		}
	}

	// Get a random string of n length
	utilz.get_random_string = function (n) {
		let text = ""

		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

		for (let i = 0; i < n; i++) {
			text += possible[utilz.get_random_int(0, possible.length - 1)]
		}

		return text
	}

	// Ge a random sequence of numbers
	utilz.random_sequence = function (n) {
		let s = ""

		for (let i = 0; i < n; i++) {
			s += utilz.get_random_int(0, 9)
		}

		return s
	}

	// Get id of youtube video from url
	utilz.get_youtube_id = function (url) {
		let v_id = false
		let list_id = false

		let split = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/)
		let id = undefined !== split[2] ? split[2].split(/[^0-9a-z_\-]/i)[0] : split[0]

		v_id = id.length === 11 ? id : false

		let list_match = url.match(/(?:\?|&)(list=[0-9A-Za-z_-]+)/)

		let index_match = url.match(/(?:\?|&)(index=[0-9]+)/)

		if (list_match) {
			list_id = list_match[1].replace("list=", "")
		}

		if (list_id && !v_id) {
			let index = 0

			if (index_match) {
				index = parseInt(index_match[1].replace("index=", "")) - 1
			}

			return ["list", [list_id, index]]
		} else if (v_id) {
			return ["video", v_id]
		} else {
			return false
		}
	}

	// Get timestamp of a youtube video from url
	utilz.get_youtube_time = function (url) {
		let matches = url.match(/[\?|&]t=(\d+h)?(\d+m)?(\d+s)?(\d+)?/)

		if (matches) {
			let first = false

			let h = false
			let m = false
			let s = false
			let t = false

			for (let match of matches) {
				if (!first) {
					first = true
					continue
				}

				if (match === undefined) {
					continue
				}

				if (match.includes("h")) {
					h = parseInt(match.replace("h", ""))
				} else if (match.includes("m")) {
					m = parseInt(match.replace("m", ""))
				} else if (match.includes("s")) {
					s = parseInt(match.replace("s", ""))
				} else {
					t = parseInt(match)
				}

			}

			let time = 0

			if (h) {
				time += h * 60 * 60
			}

			if (m) {
				time += m * 60
			}

			if (s) {
				time += s
			}

			if (t) {
				time += t
			}

			return time
		} else {
			return 0
		}
	}

	// Get twitch id from url
	utilz.get_twitch_id = function (url) {
		let match = url.match(/.*twitch\.tv(?:\/videos)?\/(\w+)/)

		if (match) {
			if (match[0].includes('twitch.tv/videos/')) {
				return ["video", match[1]]
			} else if (match[0].includes("clips.twitch.tv")) {
				return false
			} else {
				return ["channel", match[1]]
			}
		} else {
			return false
		}
	}

	// Round to specified decimal places
	utilz.round = function (value, decimals) {
		return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
	}

	// Round to place or the place below
	utilz.round2 = function (value, place) {
		return Math.round(value / place) * place
	}

	// Get a string with nice seconds format
	utilz.humanize_seconds = function (input, separator = ":") {
		let pad = function (input) {
			return input < 10 ? "0" + input : input
		}

		let result = [
			pad(Math.floor(input / 3600)),
			pad(Math.floor(input % 3600 / 60)),
			pad(Math.floor(input % 60)),
		].join(separator)

		return result
	}

	// Replace spaces with non-brekable spaces
	utilz.nonbreak = function (s) {
		return s.trim().split(" ").join("&nbsp;")
	}

	// Extract extension from a string
	utilz.get_extension = function (s) {
		if (s.startsWith("http://") || s.startsWith("https://")) {
			let s2 = s.split("//").slice(1).join("//")

			let matches = s2.match(/\/.*\.(\w+)(?=$|[#?])/)

			if (matches) {
				return matches[1]
			}
		} else {
			let matches = s.match(/\.(\w+)(?=$|[#?])/)

			if (matches) {
				return matches[1]
			}
		}

		return ""
	}

	// Check if hex value is valid
	utilz.validate_hex = function (hex, case_sensitive = true) {
		if (case_sensitive) {
			re = /^#[0-9a-f]{6}$/
		} else {
			re = /^#[0-9A-F]{6}$/i
		}

		return re.test(hex)
	}

	// Get the code from an imgur url
	utilz.get_imgur_image_code = function (src) {
		let matches = src.match(/https?\:\/\/(?:i.)?imgur.com\/(\w{7,8})(?:\.\w+)?$/)

		if (matches) {
			return matches[1].substring(0, 7)
		} else {
			return false
		}
	}

	// Capitalize words in a sentence
	utilz.capitalize_words = function (s) {
		let ns = s.toLowerCase()
			.split(' ')
			.map((s) => s.charAt(0).toUpperCase() + s.substring(1))
			.join(' ')

		return ns
	}

	// Make a string of nicely separated items
	utilz.nice_list = function (list) {
		let s = ""

		for (let i = 0; i < list.length; i++) {
			let item = list[i]

			if (i === 0) {
				s = item
			} else if (i === list.length - 1) {
				s = `${s} and ${item}`
			} else {
				s = `${s}, ${item}`
			}
		}

		return s
	}

	// Check if string is a url
	utilz.is_url = function (s) {
		if (s.startsWith("http://") || s.startsWith("https://")) {
			if (s.endsWith("]")) {
				return false
			} else if (s.endsWith('"')) {
				return false
			} else if (s.endsWith("'")) {
				return false
			}

			return true
		}

		return false
	}

	// Get first url from a string
	utilz.get_first_url = function (s) {
		let split = s.split("\n")

		for (let line of split) {
			let split2 = line.split(" ")

			for (let word of split2) {
				if (word) {
					if (utilz.is_url(word)) {
						return word
					}
				}
			}
		}

		return ""
	}

	utilz.get_urls = function (s) {
		let urls = []
		let split = s.split("\n")

		for (let line of split) {
			let split2 = line.split(" ")

			for (let word of split2) {
				if (word) {
					if (utilz.is_url(word)) {
						urls.push(word)
					}
				}
			}
		}

		return urls
	}

	// Crop a text from the left and add ...
	utilz.slice_string_end = function (s, n = 10) {
		s = s.trim()

		let sliced = s.slice(-n).trim()

		if (s.length > sliced.length) {
			return `...${sliced}`
		} else {
			return sliced
		}
	}

	// Replace a string between point start and point end with what
	utilz.replace_between = function (str, start, end, what) {
		return str.substring(0, start) + what + str.substring(end)
	}

	// Get a nice date string
	utilz.nice_date = function (date = Date.now(), mode="normal") {
		return dateFormat(date, "dd/mmm/yy, H:MM:ss")
	}

	// Escape special characters
	utilz.escape_special_characters = function (s) {
		return s.replace(/[^A-Za-z0-9]/g, '\\$&')
	}

	// Get a string with the size in megabytes
	utilz.get_size_string = function (size, mode = 1) {
		if (mode === 1) {
			return `${parseFloat(size / 1024).toFixed(2)} MB`
		} else if (mode === 2) {
			return `${parseFloat(size / 1024 / 1024).toFixed(2)} MB`
		}
	}

	// Check if object is empty
	utilz.is_empty_object = function (obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	// Get a nice datetime string
	utilz.nice_time = function (date1, date2) {
		let d

		if (date1 > date2) {
			d = (date1 - date2)
		} else {
			d = (date2 - date1)
		}

		let nt

		if (d >= 1000) {
			let dm = utilz.round(d / 1000, 3)

			if (dm === 1) {
				nt = `${dm} second`
			} else {
				nt = `${dm} seconds`
			}
		} else {
			if (d === 1) {
				nt = `${d} millisecond`
			} else {
				nt = `${d} milliseconds`
			}
		}

		return nt
	}

	// Remove the s from a word if singular
	utilz.singular_or_plural = function (n, s) {
		let ss

		if (n === 1) {
			ss = `${n} ${s.substring(0, s.length - 1)}`
		} else {
			ss = `${n} ${s}`
		}

		return ss
	}

	// Check if it's a text element
	utilz.is_textbox = function (element) {
		let tag_name = element.tagName.toLowerCase()

		if (tag_name === 'textarea') return true
		if (tag_name !== 'input') return false

		let type = element.getAttribute('type')

		if (!type) {
			return false
		}

		type = type.toLowerCase(),

			input_types = [
				'text',
				'password',
				'number',
				'email',
				'tel',
				'url',
				'search',
				'date',
				'datetime',
				'datetime-local',
				'time',
				'month',
				'week'
			]

		return input_types.includes(type)
	}

	// Crop a string and add ... to it
	utilz.get_limited_string = function (s, n) {
		let title

		if (s.length > n) {
			title = `${s.substring(0, n)}...`
		} else {
			title = s
		}

		return title
	}

	// Turn a string into safe HTML by replacing < and > to safe versions
	utilz.make_html_safe = function (s) {
		return s.replace(/\</g, "&lt;").replace(/\>/g, "&gt;")
	}

	// Find the similarity between two strings
	utilz.string_similarity = function (s1, s2) {
		let longer = s1
		let shorter = s2

		if (s1.length < s2.length) {
			longer = s2
			shorter = s1
		}

		let longer_length = longer.length

		if (longer_length == 0) {
			return 1.0
		}

		return (longer_length - utilz.string_similarity_distance(longer, shorter)) / parseFloat(longer_length)
	}

	// Find the similarity distance between two strings
	utilz.string_similarity_distance = function (s1, s2) {
		s1 = s1.toLowerCase()
		s2 = s2.toLowerCase()

		let costs = new Array()

		for (let i = 0; i <= s1.length; i++) {
			let last_value = i

			for (let j = 0; j <= s2.length; j++) {
				if (i == 0) {
					costs[j] = j
				} else {
					if (j > 0) {
						let new_value = costs[j - 1]

						if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
							new_value = Math.min(Math.min(new_value, last_value),
								costs[j]) + 1
						}

						costs[j - 1] = last_value
						last_value = new_value
					}
				}
			}

			if (i > 0) {
				costs[s2.length] = last_value
			}
		}

		return costs[s2.length]
	}

	// Remove extra tabbing from the left side
	utilz.untab_string = function (s) {
		s = s.replace(/\t/gm, "  ")
		let lines = s.split("\n")

		if (lines.length <= 1) {
			return s
		}

		let ns = []
		let pos = -1

		for (let line of lines) {
			if (!line.trim()) {
				continue
			}

			let m = line.match(/^\s+/)
			
			if (m) {
				let n = m[0].length

				if (pos === -1 || n < pos) {
					pos = n
				}
        
				ns.push(n)
			} else {
				return s
			}
		}
    
		let new_lines = []
		let spaces = ""
      
		for (let i=0; i<pos; i++) {
			spaces += " "
		}
    
		for (let line of lines) {    
			let re = new RegExp(`(^${spaces})`)
			new_lines.push(line.replace(re, ""))
		}
    
		return new_lines.join("\n")
	}

	utilz.MINUTE = 60000
	utilz.HOUR = 3600000
	utilz.DAY = 86400000
	utilz.YEAR = 31536000000

	// Return a timeago string
	utilz.timeago = function (date) {
		let diff = Date.now() - date
		let s

		if (diff < utilz.MINUTE) {
			s = "just now"
		} else if (diff < utilz.HOUR) {
			let n = Math.floor(diff / 60 / 1000)

			if (n === 1) {
				s = `${n} minute ago`
			} else {
				s = `${n} minutes ago`
			}
		} else if (diff >= utilz.HOUR && diff < utilz.DAY) {
			let n = Math.floor(diff / 60 / 60 / 1000)

			if (n === 1) {
				s = `${n} hour ago`
			} else {
				s = `${n} hours ago`
			}
		} else if (diff >= utilz.DAY && diff < utilz.YEAR) {
			let n = Math.floor(diff / 24 / 60 / 60 / 1000)

			if (n === 1) {
				s = `${n} day ago`
			} else {
				s = `${n} days ago`
			}
		} else if (diff >= utilz.YEAR) {
			let n = Math.floor(diff / 365 / 24 / 60 / 60 / 1000)

			if (n === 1) {
				s = `${n} year ago`
			} else {
				s = `${n} years ago`
			}
		}

		return s
	}

	// Fill from the left with c character to get to n ammount
	utilz.fillpad = function (s, n, c) {
		let olen = s.length

		for (let i=0; i<(n - olen); i++) {
			s = c + s
		}

		return s
	}

	// Get a nicely formatted time
	utilz.get_time = function () {
		let today = new Date()
		let hours = utilz.fillpad(today.getHours().toString(), 2, "0")
		let minutes = utilz.fillpad(today.getMinutes().toString(), 2, "0")
		let seconds = utilz.fillpad(today.getSeconds().toString(), 2, "0")
		return `${hours}:${minutes}:${seconds}`
	}

	// Show information with date
	utilz.loginfo = function (s) {
		try {
			console.info(`[${utilz.get_time()}] ${s}`)
		} catch (err) {
			console.error(err)
		}
	}

	// Make a url with a parameter that prevents caching
	utilz.cache_bust_url = function (s) {
		let url = new URL(s)
    url.searchParams.set("cache-buster", Date.now())
		return url
	}

	// Check if file name is from an image source
	utilz.is_image = function (src) {
		let extension = Hue.utilz.get_extension(src).toLowerCase()
    return extension && utilz.image_extensions.includes(extension)
	}

	// Check if file name is from a video source
	utilz.is_video = function (src) {
		let extension = Hue.utilz.get_extension(src).toLowerCase()
    return extension && utilz.video_extensions.includes(extension)
	}

	// Check if file name is from an audio source
	utilz.is_audio = function (src) {
		let extension = Hue.utilz.get_extension(src).toLowerCase()
    return extension && utilz.audio_extensions.includes(extension)
	}

	// Check if all items in an array are equal
	utilz.bingo = function (s) {
		let split = s.split("").filter(x => x !== "")
		return new Set(split).size === 1
	}

	utilz.media_types = ["image", "tv"]
	utilz.video_extensions = ["mp4", "webm"]
	utilz.video_types = ["video/mp4", "video/webm"]
	utilz.audio_extensions = ["mp3", "ogg", "wav", "flac"]
	utilz.audio_types = ["audio/mpeg", "audio/ogg", "audio/wav", "audio/flac"]
	utilz.image_extensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"]
	utilz.image_types = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp"]

	return utilz
}

try {
	module.exports = Utilz
} catch (e) {}