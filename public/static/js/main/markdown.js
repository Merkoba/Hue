// Regex generator for character based markdown
// For example **this** or _this_
Hue.make_markdown_char_regex = function (char) {
  // Raw regex if "=" was the char
  // (^|\s|\[dummy\-space\])(\=+)(?!\s)(.*[^\=\s])\2($|\s|\[dummy\-space\])
  let regex = `(^|\\s|\\[dummy\\-space\\])(${Hue.utilz.escape_special_characters(
    char
  )}+)(?!\\s)(.*[^${Hue.utilz.escape_special_characters(
    char
  )}\\s])\\2($|\\s|\\[dummy\\-space\\]|\:)`
  return new RegExp(regex, "gm")
}

// Regex generator for character based markdown but with whitespace and multiline support
Hue.make_markdown_char_regex_2 = function (char) {
  // Raw regex if "`" was the char
  // (^|\s|\[dummy\-space\])(\`+)([\s\S]+[^\`])\2($|\s|\[dummy\-space\])
  let regex = `(^|\\s|\\[dummy\\-space\\])(${Hue.utilz.escape_special_characters(
    char
  )}+)([\\s\\S]+[^${Hue.utilz.escape_special_characters(
    char
  )}])\\2($|\\s|\\[dummy\\-space\\])`
  return new RegExp(regex, "gm")
}

// Makes and prepares the markdown regexes
Hue.setup_markdown_regexes = function () {
  Hue.markdown_regexes["*"] = {}
  Hue.markdown_regexes["*"].regex = Hue.make_markdown_char_regex("*")
  Hue.markdown_regexes["*"].replace_function = function (g1, g2, g3, g4, g5) {
    let n = g3.length

    if (n === 1) {
      return `${g2}<span class='italic'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    } else if (n === 2) {
      return `${g2}<span class='bold'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    } else if (n === 3) {
      return `${g2}<span class='italic bold'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    }

    return g1
  }

  Hue.markdown_regexes["_"] = {}
  Hue.markdown_regexes["_"].regex = Hue.make_markdown_char_regex("_")
  Hue.markdown_regexes["_"].replace_function = function (g1, g2, g3, g4, g5) {
    let n = g3.length

    if (n === 1) {
      return `${g2}<span class='italic'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    } else if (n === 2) {
      return `${g2}<span class='underlined'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    }

    return g1
  }

  Hue.markdown_regexes["="] = {}
  Hue.markdown_regexes["="].regex = Hue.make_markdown_char_regex("=")
  Hue.markdown_regexes["="].replace_function = function (g1, g2, g3, g4, g5) {
    let n = g3.length

    if (n === 1) {
      return `${g2}<span class='backgrounded'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    }

    return g1
  }

  Hue.markdown_regexes["|"] = {}
  Hue.markdown_regexes["|"].regex = Hue.make_markdown_char_regex("|")
  Hue.markdown_regexes["|"].replace_function = function (g1, g2, g3, g4, g5) {
    let n = g3.length

    if (n === 2) {
      return `${g2}<span class='spoiler' title='Click To Reveal'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    }

    return g1
  }

  Hue.markdown_regexes["!"] = {}
  Hue.markdown_regexes["!"].regex = Hue.make_markdown_char_regex("!")
  Hue.markdown_regexes["!"].replace_function = function (g1, g2, g3, g4, g5) {
    let n = g3.length

    if (n === 2) {
      return `${g2}<span class='yuge'>[dummy-space]${g4}[dummy-space]</span>${g5}`
    }

    return g1
  }

  Hue.markdown_regexes[">"] = {}
  Hue.markdown_regexes[">"].regex = new RegExp("^&gt;\\s*(?:(?!&gt;).)+", "gm")
  Hue.markdown_regexes[">"].replace_function = function (g1) {
    if (g1.trim() === "&gt;") {
      return g1
    }

    if (g1.trim() === "&gt;_") {
      return g1
    }

    return `<span class='greentext'>&gt; ${g1.replace("&gt;", "").trim()}</span>`
  }

  Hue.markdown_regexes["whisper_link"] = {}
  Hue.markdown_regexes["whisper_link"].regex = new RegExp(
    `\\[whisper\\s+(.*?)\\](.*?)\\[\/whisper\\]`,
    "gm"
  )
  Hue.markdown_regexes["whisper_link"].replace_function = function (
    g1,
    g2,
    g3
  ) {
    return `<span class="whisper_link special_link" data-whisper="${g2}" title="[Whisper] ${g2}">[dummy-space]${g3.replace(
      /\s+/,
      "&nbsp;"
    )}[dummy-space]</span>`
  }

  Hue.markdown_regexes["horizontal_line"] = {}
  Hue.markdown_regexes["horizontal_line"].regex = new RegExp(
    `\\[line\\]`, "gm"
  )
  Hue.markdown_regexes["horizontal_line"].replace_function = function () {
    return "<hr class='chat_hr'>"
  }

  Hue.markdown_regexes["anchor_link"] = {}
  Hue.markdown_regexes["anchor_link"].regex = new RegExp(
    `\\[anchor\\s+(.*?)\\](.*?)\\[\/anchor\\]`,
    "gm"
  )
  Hue.markdown_regexes["anchor_link"].replace_function = function (g1, g2, g3) {
    return `<a href="${g2}" class="stop_propagation anchor_link special_link" target="_blank">[dummy-space]${g3
      .trim()
      .replace(/\s+/, "&nbsp;")}[dummy-space]</a>`
  }

  Hue.markdown_regexes["dummy_space"] = {}
  Hue.markdown_regexes["dummy_space"].regex = new RegExp(
    `\\[dummy\\-space\\]`,
    "gm"
  )
  Hue.markdown_regexes["dummy_space"].replace_function = function () {
    return ""
  }
}

// Passes text through all markdown regexes doing the appropiate replacements
// It runs in recursion until no more replacements are found
// This is to allow replacements in any order
Hue.replace_markdown = function (text, multilines = true, filter = false) {
  let original_length = text.length

  if (filter) {
    text = text.replace(Hue.markdown_regexes["whisper_link"].regex, "")
    text = text.replace(Hue.markdown_regexes["anchor_link"].regex, "")
    text = text.replace(Hue.markdown_regexes["horizontal_line"].regex, "")
    text = text.replace(Hue.markdown_regexes["|"].regex, " (spoiler) ")
  } else {
    text = text.replace(
      Hue.markdown_regexes["whisper_link"].regex,
      Hue.markdown_regexes["whisper_link"].replace_function
    )
    text = text.replace(
      Hue.markdown_regexes["anchor_link"].regex,
      Hue.markdown_regexes["anchor_link"].replace_function
    )
    text = text.replace(
      Hue.markdown_regexes["horizontal_line"].regex,
      Hue.markdown_regexes["horizontal_line"].replace_function
    )
    if (!Hue.get_setting("autoreveal_spoilers")) {
      text = text.replace(
        Hue.markdown_regexes["|"].regex,
        Hue.markdown_regexes["|"].replace_function
      )
    }
  }

  text = text.replace(
    Hue.markdown_regexes["*"].regex,
    Hue.markdown_regexes["*"].replace_function
  )
  text = text.replace(
    Hue.markdown_regexes["_"].regex,
    Hue.markdown_regexes["_"].replace_function
  )
  text = text.replace(
    Hue.markdown_regexes["="].regex,
    Hue.markdown_regexes["="].replace_function
  )
  text = text.replace(
    Hue.markdown_regexes["!"].regex,
    Hue.markdown_regexes["!"].replace_function
  )
  text = text.replace(
    Hue.markdown_regexes[">"].regex,
    Hue.markdown_regexes[">"].replace_function
  )

  if (text.length !== original_length) {
    return Hue.replace_markdown(text)
  }

  text = text.replace(
    Hue.markdown_regexes["dummy_space"].regex,
    Hue.markdown_regexes["dummy_space"].replace_function
  )

  if (multilines) {
    let num_lines = 0
    
    for (let line of text.split("\n")) {
      if (line.trim()) {
        num_lines += 1
  
        if (num_lines > 1) {
          text = `<pre class='precode'><code>${text}</code></pre>`
          break
        }
      }
    }
  }

  return text
}

// Removes unwanted formatting from Hue chat messages
Hue.remove_markdown_from_message = function (message) {
  message = message.replace(/\=?\[dummy\-space\]\=?/gm, "")

  message = message.replace(/\[.*?\](.+?)\[\/.*?\]/gm, function (a, b) {
    return b
  })

  return message
}