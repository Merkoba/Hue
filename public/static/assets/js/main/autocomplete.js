// Generates an array of autocompletable words on demand
Hue.generate_words_to_autocomplete = function () {
  let usernames = []
  let susernames = []

  for (let item of Hue.userlist) {
    usernames.push(item.username)
  }

  for (let username of usernames) {
    susernames.push(`${username}'s`)
  }

  let words = []

  words.push(
    ...Hue.commands_list_with_prefix,
    ...usernames,
    ...susernames,
    ...Hue.all_usernames
  )

  words.sort()
  return words
}

// Tries to find the closest item to autocomplate after a tab action
Hue.get_closest_autocomplete = function (element, w) {
  let info = Hue.tab_info[element.id]
  let l = Hue.generate_words_to_autocomplete()
  let wl = w.toLowerCase()
  let has = false

  for (let i = 0; i < l.length; i++) {
    let pw = l[i]

    if (pw.startsWith(w)) {
      has = true

      if (!info.tabbed_list.includes(pw)) {
        info.tabbed_list.push(pw)
        return l[i]
      }
    }
  }

  for (let i = 0; i < l.length; i++) {
    let pw = l[i]
    let pwl = pw.toLowerCase()

    if (pwl.startsWith(wl)) {
      has = true

      if (!info.tabbed_list.includes(pw)) {
        info.tabbed_list.push(pw)
        return l[i]
      }
    }
  }

  if (has) {
    info.tabbed_list = []
    return Hue.get_closest_autocomplete(element, w)
  }

  return ""
}

// Attemps to autocomplete a word after a user presses tab on a textbox
Hue.tabbed = function (element) {
  if (!element.id) {
    return
  }

  let info = Hue.tab_info[element.id]

  if (info === undefined) {
    Hue.clear_tabbed(element)
    info = Hue.tab_info[element.id]
  }

  if (info.tabbed_word !== "") {
    Hue.replace_tabbed(element, info.tabbed_word)
    return
  }

  let split = element.selectionStart
  let value = element.value.replace(/\n/g, " ")
  let a = value.substring(0, split).match(/[^ ]*$/)[0]
  let b = value.substring(split).match(/^[^ ]*/)[0]
  let word = a + b

  info.tabbed_start = split - a.length
  info.tabbed_end = split + b.length

  if (word !== "") {
    info.tabbed_word = word
    Hue.replace_tabbed(element, word)
  }
}

// Replaces current word next to the caret with the selected autocomplete item
Hue.replace_tabbed = function (element, word) {
  let info = Hue.tab_info[element.id]
  let result = Hue.get_closest_autocomplete(element, word)

  if (result) {
    if (element.value[info.tabbed_end] === " ") {
      element.value = Hue.utilz.replace_between(
        element.value,
        info.tabbed_start,
        info.tabbed_end,
        result
      )
    } else {
      element.value = Hue.utilz.replace_between(
        element.value,
        info.tabbed_start,
        info.tabbed_end,
        `${result} `
      )
    }

    let pos = info.tabbed_start + result.length

    element.setSelectionRange(pos + 1, pos + 1)

    info.tabbed_start = pos - result.length
    info.tabbed_end = pos
  }
}

// Resets 'tabbed' state generated after autocompleting words
Hue.clear_tabbed = function (element) {
  if (!element.id) {
    return
  }

  Hue.tab_info[element.id] = {
    tabbed_list: [],
    tabbed_word: "",
    tabbed_start: 0,
    tabbed_end: 0,
  }
}

// Setups autocomplete functionality
// This allows to have tab autocomplete on all allowed textboxes
Hue.setup_autocomplete = function () {
  Hue.ev(Hue.el("body"), "keydown", function (e) {
    if (Hue.utilz.is_textbox(e.target)) {
      if (e.key === "Tab") {
        let value = e.target.value

        if (value.length > 0) {
          Hue.tabbed(e.target)
          return
        }
      }

      Hue.clear_tabbed(e.target)
    }
  })

  Hue.ev(Hue.el("body"), "click", function (e) {
    if (Hue.utilz.is_textbox(e.target)) {
      Hue.clear_tabbed(e.target)
    }
  })
}