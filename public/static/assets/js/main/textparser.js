// Makes and prepares the textparser regexes
App.setup_textparser_regexes = () => {
  App.textparser_regexes = {}
  App.textparser_regexes.whisper_link = {}
  App.textparser_regexes.whisper_link.regex = new RegExp(
    `\\[whisper\\s+(.*?)\\](.*?)\\[\/whisper\\]`,
    `gm`,
  )

  App.textparser_regexes.whisper_link.replace_function = (
    g1,
    g2,
    g3,
  ) => {
    return `<span class="whisper_link special_link" data-whisper="${g2}" title="[Whisper] ${g2}">${g3.replace(/\s+/, `&nbsp;`)}</span>`
  }

  App.textparser_regexes.anchor_link = {}
  App.textparser_regexes.anchor_link.regex = new RegExp(
    `\\[anchor\\s+(.*?)\\](.*?)\\[\/anchor\\]`,
    `gm`,
  )

  App.textparser_regexes.anchor_link.replace_function = (g1, g2, g3) => {
    return `<a href="${g2}" class="anchor_link special_link" target="_blank">${g3.trim().replace(/\s+/, `&nbsp;`)}</a>`
  }
}

// Passes text through all textparser regexes doing the appropiate replacements
App.parse_text = (text) => {
  text = text.replace(
    App.textparser_regexes.whisper_link.regex,
    App.textparser_regexes.whisper_link.replace_function,
  )

  text = text.replace(
    App.textparser_regexes.anchor_link.regex,
    App.textparser_regexes.anchor_link.replace_function,
  )

  if (App.get_setting(`arrowtext`)) {
    text = App.check_arrowtext(text)
    text = App.check_frame(text)
  }

  return text
}

// Check frame
App.check_frame = (text) => {
  if (text.includes(`\n`)) {
    text = `<div class="framed">${text}</div>`
  }

  return text
}

// Check for arrows at the start of lines
App.check_arrowtext = (text) => {
  text = text.trim()
  let lines = text.split(`\n`).map(x => x.trim())
  let new_lines = []

  if (text.startsWith(`&gt;&gt;&gt;`)) {
    let regex = new RegExp(`^(&gt;)+`, `gm`)

    for (let line of lines) {
      line = line.replace(regex, ``).trim()

      if (line) {
        line = `<div class="arrowtext">&gt;${line}</div>`
      }

      new_lines.push(line)
    }
  }
  else {
    for (let line of lines) {
      if (line.startsWith(`&gt;`)) {
        line = `<div class="arrowtext">${line}</div>`
      }

      new_lines.push(line)
    }
  }

  return new_lines.join(`\n`)
}