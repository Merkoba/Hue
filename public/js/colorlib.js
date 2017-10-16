var CountColor = (function()
{
	var num_instances = 0

	var factory = function()
	{
		var instance = {}

		num_instances += 1

		instance.id = num_instances

		instance.get_colors = function(image, palette_size=3)
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
				palette.push([pixelArray[i][0], pixelArray[i][1], pixelArray[i][2]])
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

			return palette
		}

		return instance
	}

	return factory
}())