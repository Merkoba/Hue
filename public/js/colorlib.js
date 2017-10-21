var ColorLib = (function()
{
	var num_instances = 0

	var factory = function()
	{
		var instance = {}

		num_instances += 1

		instance.id = num_instances

		instance.get_dominant = function(image, palette_size=1)
		{
			if(palette_size === 0 || palette_size > 100)
			{
				console.error("Invalid argument") 
				return
			}

			var size = 32

			const canvas = document.createElement('canvas')

			canvas.width = size
			canvas.height = size

			const context = canvas.getContext('2d')
			context.imageSmoothingEnabled = false			

			context.drawImage(image, 0, 0, size, size)

			const pixels = context.getImageData(0, 0, size, size).data

			const pixelArray = []
  			const palette = []

			for(let i=0; i<pixels.length/4; i++) 
			{
				const offset = i * 4
				const red = pixels[offset]
				const green = pixels[offset + 1]
				const blue = pixels[offset + 2]
				const alpha = pixels[offset + 3]
				let matchIndex = undefined

				// Skip this pixel if transparent or too close to white
				if(alpha === 0) 
				{
					continue
				}

				// See if the color is already stored
				for(let j=0; j<pixelArray.length; j++) 
				{
					if(red === pixelArray[j][0] && green === pixelArray[j][1] && blue === pixelArray[j][2]) 
					{
						matchIndex = j
						break
					}
				}

				// Add the color if it doesn't exist, otherwise increment frequency
				if(matchIndex === undefined) 
				{
					pixelArray.push([red, green, blue, 1]);
				} 

				else 
				{
					pixelArray[matchIndex][3]++
				}
			}

			// Sort pixelArray by color frequency
			pixelArray.sort(function(a, b) 
			{
				return b[3] - a[3]
			})

			// Fill array with [red, green, blue] values until palette_size or
			// until there are no more colors, whichever happens first
			for(let i=0; i<Math.min(palette_size, pixelArray.length); i++) 
			{
				var arr = [pixelArray[i][0], pixelArray[i][1], pixelArray[i][2]]

				palette.push(instance.check_array(arr))
			}

			var last_p

			for(let i=0; i<palette_size; i++)
			{
				if(palette[i] === undefined)
				{
					if(last_p === undefined)
					{
						palette[i] = [0, 0, 0]
					}

					else
					{
						palette[i] = last_p
					}
				}

				last_p = palette[i]
			}

			return instance.array_to_rgb(palette)
		}

		instance.get_lighter_or_darker = function(rgb, amount=20)
		{
			var new_rgb = []

			if(instance.is_light(rgb))
			{
				return instance.get_darker(rgb, amount)
			}

			else
			{
				return instance.get_lighter(rgb, amount)				
			}
		}

		instance.get_lighter = function(rgb, amount=20)
		{
			rgb = instance.check_rgb(rgb)

			var new_rgb = []

			new_rgb[0] = rgb[0] + amount
			new_rgb[1] = rgb[1] + amount
			new_rgb[2] = rgb[2] + amount

			for(let i=0; i<new_rgb.length; i++)
			{
				if(new_rgb[i] > 255)
				{
					new_rgb[i] = 255
				}
			}

			return instance.array_to_rgb(instance.check_array(new_rgb))
		}

		instance.get_darker = function(rgb, amount=20)
		{
			rgb = instance.check_rgb(rgb)

			var new_rgb = []

			new_rgb[0] = rgb[0] - amount
			new_rgb[1] = rgb[1] - amount
			new_rgb[2] = rgb[2] - amount

			return instance.array_to_rgb(instance.check_array(new_rgb))
		}

		instance.is_light = function(rgb)
		{
			rgb = instance.check_rgb(rgb)

			var r = rgb[0]
			var g = rgb[1]
			var b = rgb[2]

			var uicolors = [r / 255, g / 255, b / 255]

			var c = uicolors.map((c) => 
			{
				if (c <= 0.03928) 
				{
					return c / 12.92
				} 

				else 
				{
					return Math.pow((c + 0.055) / 1.055,2.4)
				}
			})

			var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

			return (L > 0.179) ? true : false		
		}

		instance.is_dark = function(rgb)
		{
			if(instance.is_light(rgb))
			{
				return false
			}

			return true
		}

		instance.get_proper_font = function(rgb)
		{
			if(instance.is_light(rgb))
			{
				return "#000000"
			}

			else
			{
				return "#ffffff"
			}
		}

		instance.array_to_rgb = function(array)
		{
			if(Array.isArray(array[0]))
			{
				var rgb = []

				for(let i=0; i<array.length; i++)
				{
					rgb[i] = `rgb(${array[i][0]}, ${array[i][1]}, ${array[i][2]})`
				}
			}

			else
			{
				var rgb = `rgb(${array[0]}, ${array[1]}, ${array[2]})`
			}

			return rgb
		}

		instance.rgb_to_array = function(rgb)
		{
			if(Array.isArray(rgb))
			{
				var array = []

				for(let i=0; i<rgb.length; i++)
				{
					var split = rgb[i].replace("rgb(", "").replace(")", "").split(",")
					array[i] = split.map(x => parseInt(x))
				}
			}

			else
			{
				var split = rgb.replace("rgb(", "").replace(")", "").split(",")
				var array = split.map(x => parseInt(x))
			}

			return array					
		}

		instance.check_array = function(array)
		{
			for(let i=0; i<array.length; i++)
			{
				if(array[i] < 0)
				{
					array[i] = 0
				}

				else if(array[i] > 255)
				{
					array[i] = 255
				}
			}

			return array
		}

		instance.check_rgb = function(rgb)
		{
			if(!Array.isArray(rgb))
			{
				rgb = instance.rgb_to_array(rgb)
			}

			return rgb		
		}

		return instance
	}

	return factory
}())