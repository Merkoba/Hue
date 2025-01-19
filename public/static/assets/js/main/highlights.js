// Generates a regex with a specified string to check for highlights
// It handles various scenarious like `word,` `@word` `word...`
App.generate_highlights_regex = (
  word,
  case_insensitive = false,
  escape = true,
) => {
  let flags = `gm`

  if (case_insensitive) {
    flags += `i`
  }

  if (escape) {
    word = App.utilz.escape_regex(word)
  }

  let regex = new RegExp(
    `(?:^|\\s|"|\\\`|>|\\()?@?(?:${word})(?:'s)?(?:$|\\s|"|\\!|\\?|\\,|\\.|\\:|\\)|\\\`)`,
    flags,
  )

  return regex
}

// Checks for highlights using the mentions regex and the highlight words regex
App.check_highlights = (message) => {
  if (App.get_setting(`highlight_current_username`)) {
    if (message.search(App.mentions_regex) !== -1) {
      return true
    }

    return false
  }
}

// Checks if there are new highlights since the last load
// If so, a clickable announcement appears which opens Highlights
App.check_latest_highlight = () => {
  let highlight = App.get_latest_highlight()

  if (highlight) {
    App.latest_highlight = highlight
    let date = DOM.dataset(highlight, `date`)

    if (date > App.room_state.last_highlight_date) {
      App.room_state.last_highlight_date = date
      App.save_room_state()
      App.show_highlights(true)
      App.on_activity(`highlight`)
    }
  }
}

// Gets the last highlighted message
// Either a chat content container or an announcement
App.get_latest_highlight = () => {
  let latest_highlight = false
  let items = DOM.els(`#chat_area .chat_content_container`)

  for (let item of items.reverse()) {
    if (DOM.dataset(item, `highlighted`)) {
      latest_highlight = item
      break
    }
  }

  if (!latest_highlight) {
    let items = App.get_all_announcements()

    for (let item of items.reverse()) {
      if (DOM.dataset(item, `highlighted`)) {
        latest_highlight = item
        break
      }
    }
  }

  return latest_highlight
}

// What to do when a message gets highlighted
App.on_highlight = (username) => {
  if (!App.started) {
    return
  }

  if (!App.get_setting(`show_highlight_notifications`)) {
    return
  }

  if (!App.has_focus) {
    App.show_highlight_desktop_notification(username)
  }

  App.on_activity(`highlight`)
}

// Show and/or filters highlights window
App.show_highlights = (only_new = false) => {
  if (only_new) {
    App.show_chat_search(`$fresh_highlights `)
  }
  else {
    App.show_chat_search(`$highlights `)
  }
}