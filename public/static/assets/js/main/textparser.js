// Makes and prepares the textparser regexes
App.setup_textparser_regexes = () => {
  App.textparser_regexes = {}
  App.textparser_regexes[`whisper_link`] = {}
  App.textparser_regexes[`whisper_link`].regex = new RegExp(
    `\\[whisper\\s+(.*?)\\](.*?)\\[\/whisper\\]`,
    `gm`
  )

  App.textparser_regexes[`whisper_link`].replace_function = (
    g1,
    g2,
    g3
  ) => {
    return `<span class="whisper_link special_link" data-whisper="${g2}" title="[Whisper] ${g2}">${g3.replace(/\s+/, `&nbsp;`)}</span>`
  }

  App.textparser_regexes[`anchor_link`] = {}
  App.textparser_regexes[`anchor_link`].regex = new RegExp(
    `\\[anchor\\s+(.*?)\\](.*?)\\[\/anchor\\]`,
    `gm`
  )

  App.textparser_regexes["anchor_link"].replace_function = (g1, g2, g3) => {
    return `<a href="${g2}" class="anchor_link special_link" target="_blank">${g3.trim().replace(/\s+/, `&nbsp;`)}</a>`
  }
}

// Passes text through all textparser regexes doing the appropiate replacements
App.parse_text = (text) => {
  text = text.replace(
    App.textparser_regexes[`whisper_link`].regex,
    App.textparser_regexes[`whisper_link`].replace_function
  )

  text = text.replace(
    App.textparser_regexes[`anchor_link`].regex,
    App.textparser_regexes[`anchor_link`].replace_function
  )

  if (App.get_setting(`color_text`)) {
    text = App.check_arrows(text)
  }

  return text
}

// Check for arrows at the start of a string
App.check_arrows = (text) => {
  if (text.startsWith(`&gt;`)) {
    if (text.replace(/&gt;/g, ``).trim() === ``) {
      return text
    }

    if (text.startsWith(`&gt;&gt;&gt;`)) {
      text = `<div class="colortext redtext">${App.remove_arrows(text, 3)}</div>`
    }
    else if (text.startsWith(`&gt;&gt`)) {
      text = `<div class="colortext bluetext">${App.remove_arrows(text, 2)}</div>`
    }
    else {
      text = `<div class="colortext greentext">${App.remove_arrows(text, 1)}</div>`
    }
  }
  else if (text.includes(`\n`)) {
    text = `<div class="framed">${text}</div>`
  }

  return text
}

// Remove arrows from the start of strings
App.remove_arrows = (text, num_arrows) => {
  let regex = new RegExp(`^(&gt;){1,${num_arrows}}`, `gm`)
  let lines = text.split(`\n`)
  let new_lines = []

  for (let line of lines) {
    new_lines.push(line.replace(regex, ``))
  }

  let new_text = new_lines.join(`\n`)
  return App.utilz.untab_string(new_text).trim()
}