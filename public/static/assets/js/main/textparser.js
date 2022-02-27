// Makes and prepares the textparser regexes
Hue.setup_textparser_regexes = function () {
  Hue.textparser_regexes = {}

  Hue.textparser_regexes["whisper_link"] = {}
  Hue.textparser_regexes["whisper_link"].regex = new RegExp(
    `\\[whisper\\s+(.*?)\\](.*?)\\[\/whisper\\]`,
    "gm"
  )
  Hue.textparser_regexes["whisper_link"].replace_function = function (
    g1,
    g2,
    g3
  ) {
    return `<span class="whisper_link special_link" data-whisper="${g2}" title="[Whisper] ${g2}">${g3.replace(/\s+/, "&nbsp;")}</span>`
  }

  Hue.textparser_regexes["anchor_link"] = {}
  Hue.textparser_regexes["anchor_link"].regex = new RegExp(
    `\\[anchor\\s+(.*?)\\](.*?)\\[\/anchor\\]`,
    "gm"
  )
  Hue.textparser_regexes["anchor_link"].replace_function = function (g1, g2, g3) {
    return `<a href="${g2}" class="anchor_link special_link" target="_blank">${g3.trim().replace(/\s+/, "&nbsp;")}</a>`
  }
}

// Passes text through all textparser regexes doing the appropiate replacements
Hue.parse_text = function (text) {
  text = text.replace(
    Hue.textparser_regexes["whisper_link"].regex,
    Hue.textparser_regexes["whisper_link"].replace_function
  )

  text = text.replace(
    Hue.textparser_regexes["anchor_link"].regex,
    Hue.textparser_regexes["anchor_link"].replace_function
  )

  text = Hue.check_arrows(text)

  return text
}

// Check for arrows at the start of a string
Hue.check_arrows = function (text) {
  if (text.startsWith("&gt;")) {
    if (text.replace(/&gt;/g, "").trim() === "") {
      return text
    }
    
    if (text.startsWith("&gt;&gt;&gt;")) {
      text = `<div class='colortext redtext'>${Hue.remove_arrows(text)}</div>`
    } else if (text.startsWith("&gt;&gt")) {
      text = `<div class='colortext bluetext'>${Hue.remove_arrows(text)}</div>`
    } else {
      text = `<div class='colortext greentext'>${Hue.remove_arrows(text)}</div>`
    }
  } else if (text.includes("\n")) {
    text = `<div class='colortext whitetext'>${text}</div>`
  }

  return text
}

// Remove arrows from the start of strings
Hue.remove_arrows = function (text) {
  text = text.replace(/(&gt;)+/, "")
  text = Hue.utilz.untab_string(text).trim()
  return text
}