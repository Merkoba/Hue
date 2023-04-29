// Generates an array of autocompletable words on demand
App.generate_words_to_autocomplete = () => {
  let usernames = []
  let susernames = []

  for (let item of App.userlist) {
    usernames.push(item.username)
  }

  for (let username of usernames) {
    susernames.push(`${username}'s`)
  }

  let words = []

  words.push(
    ...App.commands_list_with_prefix,
    ...usernames,
    ...susernames,
    ...App.all_usernames
  )

  words.sort()
  return words
}

// Tries to find the closest item to autocomplate after a tab action
App.get_closest_autocomplete = (element, w) => {
  let info = App.tab_info[element.id]
  let l = App.generate_words_to_autocomplete()
  let wl = w.toLowerCase()
  let has = false

  for (let i=0; i<l.length; i++) {
    let pw = l[i]

    if (pw.startsWith(w)) {
      has = true

      if (!info.tabbed_list.includes(pw)) {
        info.tabbed_list.push(pw)
        return l[i]
      }
    }
  }

  for (let i=0; i<l.length; i++) {
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
    return App.get_closest_autocomplete(element, w)
  }

  return ``
}

// Attemps to autocomplete a word after a user presses tab on a textbox
App.tabbed = (element) => {
  if (!element.id) {
    return
  }

  let info = App.tab_info[element.id]

  if (info === undefined) {
    App.clear_tabbed(element)
    info = App.tab_info[element.id]
  }

  if (info.tabbed_word !== ``) {
    App.replace_tabbed(element, info.tabbed_word)
    return
  }

  let split = element.selectionStart
  let value = element.value.replace(/\n/g, ` `)
  let a = value.substring(0, split).match(/[^ ]*$/)[0]
  let b = value.substring(split).match(/^[^ ]*/)[0]
  let word = a + b

  info.tabbed_start = split - a.length
  info.tabbed_end = split + b.length

  if (word !== ``) {
    info.tabbed_word = word
    App.replace_tabbed(element, word)
  }
}

// Replaces current word next to the caret with the selected autocomplete item
App.replace_tabbed = (element, word) => {
  let info = App.tab_info[element.id]
  let result = App.get_closest_autocomplete(element, word)

  if (result) {
    if (element.value[info.tabbed_end] === ` `) {
      element.value = App.utilz.replace_between(
        element.value,
        info.tabbed_start,
        info.tabbed_end,
        result
      )
    }
    else {
      element.value = App.utilz.replace_between(
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
App.clear_tabbed = (element) => {
  if (!element.id) {
    return
  }

  App.tab_info[element.id] = {
    tabbed_list: [],
    tabbed_word: ``,
    tabbed_start: 0,
    tabbed_end: 0,
  }
}

// Setups autocomplete functionality
// This allows to have tab autocomplete on all allowed textboxes
App.setup_autocomplete = () => {
  App.ev(App.el(`body`), `keydown`, (e) => {
    if (App.utilz.is_textbox(e.target)) {
      if (e.key === `Tab`) {
        let value = e.target.value

        if (value.length > 0) {
          App.tabbed(e.target)
          return
        }
      }

      App.clear_tabbed(e.target)
    }
  })

  App.ev(App.el(`body`), `click`, (e) => {
    if (App.utilz.is_textbox(e.target)) {
      App.clear_tabbed(e.target)
    }
  })
}