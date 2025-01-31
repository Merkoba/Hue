// Makes and prepares the textparser regexes
App.setup_textparser_regexes = () => {
  App.textparser_regexes = {}
  App.textparser_regexes.whisper_link = {}

  App.textparser_regexes.whisper_link.regex = new RegExp(
    `\\[whisper\\s+(.*?)\\](.*?)\\[/whisper\\]`,
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
    `\\[anchor\\s+(.*?)\\](.*?)\\[/anchor\\]`,
    `gm`,
  )

  App.textparser_regexes.anchor_link.replace_function = (g1, g2, g3) => {
    return `<a href="${g2}" class="anchor_link special_link" target="_blank" rel="noreferrer">${g3.trim().replace(/\s+/, `&nbsp;`)}</a>`
  }

  App.textparser_regexes.parens = {}

  App.textparser_regexes.parens.regex = new RegExp(
    `(\\(\\(\\(.*\\)\\)\\))`,
    `gm`,
  )

  App.textparser_regexes.parens.replace_function = (
    g1,
    g2,
  ) => {
    return `<b>${g2}</b>`
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

  if (App.get_setting(`text_effects`)) {
    text = text.replace(
      App.textparser_regexes.parens.regex,
      App.textparser_regexes.parens.replace_function,
    )

    text = App.check_arrowtext(text)
    text = App.format_chars(text)
  }

  text = App.check_frame(text)
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
  let regex = new RegExp(`^\\s*(&gt;)+`, `gm`)
  let lines = text.split(`\n`)
  let new_lines = []

  if (regex.test(text)) {
    for (let line of lines) {
      line = line.replace(regex, ``)

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

App.regex_u = (c, n) => {
  return `${c}{${n}}`
}

App.regex_t = (c, n) => {
  let u = App.regex_u(c, n)
  return `(?:(?!${u}|\\s).)`
}

App.regex_t2 = (c, n) => {
  let u = App.regex_u(c, n)
  return `(?:(?!${u}).)`
}

App.char_regex_1 = (char, n = 1) => {
  let c = App.utilz.escape_regex(char)
  let u = App.regex_u(c, n)
  let t = App.regex_t(c, n)
  let t2 = App.regex_t2(c, n)
  let regex = `${u}(${t}${t2}*${t}|${t})${u}`
  return new RegExp(regex, `g`)
}

App.char_regex_2 = (char, n = 1) => {
  let c = App.utilz.escape_regex(char)
  let u = App.regex_u(c, n)
  let t = App.regex_t(c, n)
  let regex = `(?:^|\\s)${u}(${t}.*?${t}|${t})${u}(?:$|\\s)`
  return new RegExp(regex, `g`)
}

App.char_regex_3 = (char, n = 1) => {
  let c = App.utilz.escape_regex(char)
  let u = App.regex_u(c, n)
  let t2 = App.regex_t2(c, n)
  let regex = `${u}(${t2}+)${u}`
  return new RegExp(regex, `g`)
}

App.to_bold = (text) => {
  return `<b>${text}</b>`
}

App.format_chars = (text) => {
  function action(regex, func, full = false) {
    let matches = [...text.matchAll(regex)]

    for (let match of matches) {
      if (full) {
        text = text.replace(match[0], func(match[0]))
      }
      else {
        text = text.replace(match[0], func(match[1]))
      }
    }
  }

  action(App.char_regex_3(`\``), App.to_bold)

  action(App.char_regex_1(`*`, 2), App.to_bold)
  action(App.char_regex_1(`*`), App.to_bold)

  action(App.char_regex_2(`_`, 2), App.to_bold)
  action(App.char_regex_2(`_`), App.to_bold)

  return text
}