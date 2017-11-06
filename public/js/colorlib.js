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

		instance.get_lighter_or_darker = function(rgb, amount=0.2)
		{
			var new_rgb = []

			if(instance.is_light(rgb))
			{
				return instance.shadeBlendConvert(-amount, rgb)
			}

			else
			{
				return instance.shadeBlendConvert(amount, rgb)
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

		instance.shadeBlendConvert = function(p, from, to) 
		{
			if(typeof(p)!="number"||p<-1||p>1||typeof(from)!="string"||(from[0]!='r'&&from[0]!='#')||(typeof(to)!="string"&&typeof(to)!="undefined"))return null; //ErrorCheck
			if(!this.sbcRip)this.sbcRip=(d)=>{
				let l=d.length,RGB=new Object();
				if(l>9){
					d=d.split(",");
					if(d.length<3||d.length>4)return null;//ErrorCheck
					RGB[0]=i(d[0].slice(4)),RGB[1]=i(d[1]),RGB[2]=i(d[2]),RGB[3]=d[3]?parseFloat(d[3]):-1;
				}else{
					if(l==8||l==6||l<4)return null; //ErrorCheck
					if(l<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(l>4?d[4]+""+d[4]:""); //3 digit
					d=i(d.slice(1),16),RGB[0]=d>>16&255,RGB[1]=d>>8&255,RGB[2]=d&255,RGB[3]=l==9||l==5?r(((d>>24&255)/255)*10000)/10000:-1;
				}
				return RGB;}
			var i=parseInt,r=Math.round,h=from.length>9,h=typeof(to)=="string"?to.length>9?true:to=="c"?!h:false:h,b=p<0,p=b?p*-1:p,to=to&&to!="c"?to:b?"#000000":"#FFFFFF",f=this.sbcRip(from),t=this.sbcRip(to);
			if(!f||!t)return null; //ErrorCheck
			if(h)return "rgb("+r((t[0]-f[0])*p+f[0])+","+r((t[1]-f[1])*p+f[1])+","+r((t[2]-f[2])*p+f[2])+(f[3]<0&&t[3]<0?")":","+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*10000)/10000:t[3]<0?f[3]:t[3])+")");
			else return "#"+(0x100000000+(f[3]>-1&&t[3]>-1?r(((t[3]-f[3])*p+f[3])*255):t[3]>-1?r(t[3]*255):f[3]>-1?r(f[3]*255):255)*0x1000000+r((t[0]-f[0])*p+f[0])*0x10000+r((t[1]-f[1])*p+f[1])*0x100+r((t[2]-f[2])*p+f[2])).toString(16).slice(f[3]>-1||t[3]>-1?1:3);
		}	

		return instance
	}

	return factory
}())