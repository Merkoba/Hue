const ColorLib = (function () {
  function random_int (min, max, exclude = undefined, random_function) {
    let num

    if (random_function) {
      num = Math.floor(random_function() * (max - min + 1) + min)
    }
    else {
      num = Math.floor(Math.random() * (max - min + 1) + min)
    }

    if (exclude) {
      if (num === exclude) {
        if (num + 1 <= max) {
          num = num + 1
        }
        else if (num - 1 >= min) {
          num = num - 1
        }
      }
    }

    return num
  }

  let num_instances = 0

  let factory = function () {
    let instance = {}
    num_instances += 1
    instance.id = num_instances

    instance.get_dominant = function (
      image,
      palette_size = 1,
      use_limits = false
    ) {
      if (palette_size === 0 || palette_size > 100) {
        console.error("Invalid argument")
        return
      }

      let size = 64
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext("2d")
      context.imageSmoothingEnabled = false
      context.drawImage(image, 0, 0, size, size)
      const pixels = context.getImageData(0, 0, size, size).data
      const pixelArray = []
      const palette = []

      for (let i = 0; i < pixels.length / 4; i++) {
        const offset = i * 4
        const red = pixels[offset]
        const green = pixels[offset + 1]
        const blue = pixels[offset + 2]
        const alpha = pixels[offset + 3]

        if (use_limits) {
          if (red < 10 && green < 10 && blue < 10) {
            continue
          }

          if (red > 245 && green > 245 && blue > 245) {
            continue
          }
        }

        let matchIndex = undefined

        if (alpha === 0) {
          continue
        }

        for (let j = 0; j < pixelArray.length; j++) {
          if (
            red === pixelArray[j][0] &&
            green === pixelArray[j][1] &&
            blue === pixelArray[j][2]
          ) {
            matchIndex = j
            break
          }
        }

        if (matchIndex === undefined) {
          pixelArray.push([red, green, blue, 1])
        }
        else {
          pixelArray[matchIndex][3]++
        }
      }

      pixelArray.sort(function (a, b) {
        return b[3] - a[3]
      })

      for (let i = 0; i < Math.min(palette_size, pixelArray.length); i++) {
        let arr = [pixelArray[i][0], pixelArray[i][1], pixelArray[i][2]]
        palette.push(instance.check_array(arr))
      }

      let last_p

      for (let i = 0; i < palette_size; i++) {
        if (palette[i] === undefined) {
          if (last_p === undefined) {
            palette[i] = [42, 42, 42]
          }
          else {
            palette[i] = last_p
          }
        }

        last_p = palette[i]
      }

      return instance.array_to_rgb(palette)
    }

    instance.get_lighter_or_darker = function (rgb, amount = 0.2) {
			let mode = "rgb"

			if (rgb.startsWith("#")) {
				mode = "hex"
				rgb = instance.hex_to_rgb(rgb)
			}

			let new_rgb

      if (instance.is_light(rgb)) {
        new_rgb = instance.shadeBlendConvert(-amount, rgb)
      }
      else {
        new_rgb = instance.shadeBlendConvert(amount, rgb)
      }

			if (mode === "rgb") {
				return new_rgb
			}
      else {
				return instance.rgb_to_hex(new_rgb)
			}
    }

    instance.get_darker = function (rgb, amount = 0.2) {
			let mode = "rgb"

			if (rgb.startsWith("#")) {
				mode = "hex"
				rgb = instance.hex_to_rgb(rgb)
			}

			let new_rgb = instance.shadeBlendConvert(-amount, rgb)

			if (mode === "rgb") {
				return new_rgb
			}
      else {
				return instance.rgb_to_hex(new_rgb)
			}
    }

    instance.get_lighter = function (rgb, amount = 0.2) {
			let mode = "rgb"

			if (rgb.startsWith("#")) {
				mode = "hex"
				rgb = instance.hex_to_rgb(rgb)
			}

			let new_rgb = instance.shadeBlendConvert(amount, rgb)

			if (mode === "rgb") {
				return new_rgb
			}
      else {
				return instance.rgb_to_hex(new_rgb)
			}
    }

    instance.is_light = function (rgb) {
      if (rgb.startsWith("#")) {
				rgb = instance.hex_to_rgb(rgb)
			}

      rgb = instance.check_rgb(rgb)

      let r = rgb[0]
      let g = rgb[1]
      let b = rgb[2]

      let uicolors = [r / 255, g / 255, b / 255]

      let c = uicolors.map(c => {
        if (c <= 0.03928) {
          return c / 12.92
        }
        else {
          return Math.pow((c + 0.055) / 1.055, 2.4)
        }
      })

      let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

      return L > 0.179 ? true : false
    }

    instance.is_dark = function (rgb) {
      return !instance.is_light(rgb)
    }

    instance.get_proper_font = function (rgb) {
      if (instance.is_light(rgb)) {
        return "#000000"
      }
      else {
        return "#ffffff"
      }
    }

    instance.array_to_rgb = function (array) {
      let rgb

      if (Array.isArray(array[0])) {
        rgb = []

        for (let i = 0; i < array.length; i++) {
          rgb[i] = `rgb(${array[i][0]}, ${array[i][1]}, ${array[i][2]})`
        }
      }
      else {
        rgb = `rgb(${array[0]}, ${array[1]}, ${array[2]})`
      }

      return rgb
    }

    instance.rgb_to_array = function (rgb) {
      let array

      if (Array.isArray(rgb)) {
        array = []

        for (let i = 0; i < rgb.length; i++) {
          let split = rgb[i]
            .replace("rgb(", "")
            .replace(")", "")
            .split(",")
          array[i] = split.map(x => parseInt(x))
        }
      }
      else {
        let split = rgb
          .replace("rgb(", "")
          .replace(")", "")
          .split(",")
        array = split.map(x => parseInt(x))
      }

      return array
    }

    instance.rgba_to_array = function (rgba) {
      let array

      if (Array.isArray(rgba)) {
        array = []

        for (let i = 0; i < rgba.length; i++) {
          let split = rgba[i]
            .replace("rgba(", "")
            .replace(")", "")
            .split(",")
          array[i] = split.map(x => parseFloat(x))
        }
      }
      else {
        let split = rgba
          .replace("rgba(", "")
          .replace(")", "")
          .split(",")
        array = split.map(x => parseFloat(x))
      }

      return array
    }

    instance.increase_alpha = function (rgba, amount = 0.2) {
      let array

      if (rgba.startsWith("rgb(")) {
        array = instance.rgb_to_array(rgba)
        array.push(1)
      }
      else {
        array = instance.rgba_to_array(rgba)
      }

      let new_alpha = Math.max(0, (array[3] - amount))
      new_alpha = Math.min(1, new_alpha)
      return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${new_alpha})`
    }

    instance.rgb_to_rgba = function (rgb, alpha) {
      if (rgb.startsWith("rgba(")) {
        let array = instance.rgba_to_array(rgb)
        return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${alpha})`
      }

      let split = rgb
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")

      let rgba = `rgba(${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()}, ${alpha})`
      return rgba
    }

    instance.rgba_to_rgb = function (rgb) {
      let split = rgb
        .replace("rgba(", "")
        .replace(")", "")
        .split(",")

      let nrgb = `rgb(${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()})`
      return nrgb
    }

    instance.rgb_to_hex = function (rgb, hash = true) {
      if (typeof rgb === "string") {
        rgb = instance.rgb_to_array(rgb)
      }

      let code = ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
        .toString(16)
        .slice(1)

      if (hash) {
        code = "#" + code
      }

      return code
    }

    instance.hex_to_rgb_array = function (hex) {
      let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })

      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : null
    }

    instance.hex_to_rgb = function (hex) {
      return instance.array_to_rgb(instance.hex_to_rgb_array(hex))
    }

    instance.check_array = function (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] < 0) {
          array[i] = 0
        }
        else if (array[i] > 255) {
          array[i] = 255
        }
      }

      return array
    }

    instance.check_rgb = function (rgb) {
      if (!Array.isArray(rgb)) {
        rgb = instance.rgb_to_array(rgb)
      }

      return rgb
    }

    // This should be replaced with something easier to read
    instance.shadeBlendConvert = function (p, from, to) {
      if (
        typeof p != "number" ||
        p < -1 ||
        p > 1 ||
        typeof from != "string" ||
        (from[0] != "r" && from[0] != "#") ||
        (typeof to != "string" && typeof to != "undefined")
      )
        return null // ErrorCheck
      if (!this.sbcRip)
        this.sbcRip = d => {
          var l = d.length,
            RGB = new Object()
          if (l > 9) {
            d = d.split(",")
            if (d.length < 3 || d.length > 4) return null // ErrorCheck
            ;(RGB[0] = i(d[0].slice(4))),
              (RGB[1] = i(d[1])),
              (RGB[2] = i(d[2])),
              (RGB[3] = d[3] ? parseFloat(d[3]) : -1)
          }
          else {
            if (l == 8 || l == 6 || l < 4) return null // ErrorCheck
            if (l < 6)
              d =
                "#" +
                d[1] +
                d[1] +
                d[2] +
                d[2] +
                d[3] +
                d[3] +
                (l > 4 ? d[4] + "" + d[4] : "") // 3 digit
            ;(d = i(d.slice(1), 16)),
              (RGB[0] = (d >> 16) & 255),
              (RGB[1] = (d >> 8) & 255),
              (RGB[2] = d & 255),
              (RGB[3] =
                l == 9 || l == 5
                  ? r((((d >> 24) & 255) / 255) * 10000) / 10000
                  : -1)
          }
          return RGB
        }
      var i = parseInt,
        r = Math.round,
        h = from.length > 9,
        h =
          typeof to == "string"
            ? to.length > 9
              ? true
              : to == "c"
              ? !h
              : false
            : h,
        b = p < 0,
        p = b ? p * -1 : p,
        to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF",
        f = this.sbcRip(from),
        t = this.sbcRip(to)
      if (!f || !t) return null // ErrorCheck
      if (h)
        return (
          "rgb(" +
          r((t[0] - f[0]) * p + f[0]) +
          "," +
          r((t[1] - f[1]) * p + f[1]) +
          "," +
          r((t[2] - f[2]) * p + f[2]) +
          (f[3] < 0 && t[3] < 0
            ? ")"
            : "," +
              (f[3] > -1 && t[3] > -1
                ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000
                : t[3] < 0
                ? f[3]
                : t[3]) +
              ")")
        )
      else
        return (
          "#" +
          (
            0x100000000 +
            (f[3] > -1 && t[3] > -1
              ? r(((t[3] - f[3]) * p + f[3]) * 255)
              : t[3] > -1
              ? r(t[3] * 255)
              : f[3] > -1
              ? r(f[3] * 255)
              : 255) *
              0x1000000 +
            r((t[0] - f[0]) * p + f[0]) * 0x10000 +
            r((t[1] - f[1]) * p + f[1]) * 0x100 +
            r((t[2] - f[2]) * p + f[2])
          )
            .toString(16)
            .slice(f[3] > -1 || t[3] > -1 ? 1 : 3)
        )
    }

    instance.lab2rgb = function (lab) {
      let y = (lab[0] + 16) / 116,
        x = lab[1] / 500 + y,
        z = y - lab[2] / 200,
        r,
        g,
        b

      x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787)
      y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787)
      z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787)

      r = x * 3.2406 + y * -1.5372 + z * -0.4986
      g = x * -0.9689 + y * 1.8758 + z * 0.0415
      b = x * 0.0557 + y * -0.204 + z * 1.057

      r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
      g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
      b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b

      return [
        Math.max(0, Math.min(1, r)) * 255,
        Math.max(0, Math.min(1, g)) * 255,
        Math.max(0, Math.min(1, b)) * 255
      ]
    }

    instance.rgb2lab = function (rgb) {
      let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        x,
        y,
        z

      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

      x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
      y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0
      z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

      x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
      y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
      z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

      return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
    }

    instance.deltaE = function (labA, labB) {
      let deltaL = labA[0] - labB[0]
      let deltaA = labA[1] - labB[1]
      let deltaB = labA[2] - labB[2]
      let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2])
      let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2])
      let deltaC = c1 - c2
      let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC
      deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH)
      let sc = 1.0 + 0.045 * c1
      let sh = 1.0 + 0.015 * c1
      let deltaLKlsl = deltaL / 1.0
      let deltaCkcsc = deltaC / sc
      let deltaHkhsh = deltaH / sh
      let i =
        deltaLKlsl * deltaLKlsl +
        deltaCkcsc * deltaCkcsc +
        deltaHkhsh * deltaHkhsh
      return i < 0 ? 0 : Math.sqrt(i)
    }

		instance.get_random_hex = function () {
			let r = random_int(0, 255)
			let g = random_int(0, 255)
			let b = random_int(0, 255)
			return instance.rgb_to_hex([r, g, b])
		}

    instance.get_rgb_distance = function (a, b) {
      return Math.sqrt(( (a[0] - b[0]) * (a[0] - b[0]) +
                         (a[1] - b[1]) * (a[1] - b[1]) +
                         (a[2] - b[2]) * (a[2] - b[2]) ) / (256 * Math.sqrt(3)))
    }

    instance.get_rgba_distance = function (a, b) {
      return Math.sqrt(( (a[0] - b[0]) * (a[0] - b[0]) +
                         (a[1] - b[1]) * (a[1] - b[1]) +
                         (a[2] - b[2]) * (a[2] - b[2]) +
                         (a[3] - b[3]) * (a[3] - b[3]) ) / (256 * Math.sqrt(4)))
    }

    instance.get_dark_color = function (rand) {
      let n = 55

      return instance.rgb_to_hex([
        random_int(0, n, undefined, rand),
        random_int(0, n, undefined, rand),
        random_int(0, n, undefined, rand),
      ])
    }

    instance.get_light_color = function (rand) {
      let n = 55

      return instance.rgb_to_hex([
        255 - random_int(0, n, undefined, rand),
        255 - random_int(0, n, undefined, rand),
        255 - random_int(0, n, undefined, rand),
      ])
    }

    return instance
  }

  return factory
})()