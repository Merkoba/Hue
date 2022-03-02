// Generates a regex with a specified string to check for highlights
// It handles various scenarious like "word," "@word" "word..."
Hue.generate_highlights_regex = function (
  word,
  case_insensitive = false,
  escape = true
) {
  let flags = "gm"

  if (case_insensitive) {
    flags += "i"
  }

  if (escape) {
    word = Hue.utilz.escape_special_characters(word)
  }

  // Raw regex if using the word "mad"
  //(?:^|\s|\")(?:\@)?(?:mad)(?:\'s)?(?:$|\s|\"|\!|\?|\,|\.|\:)
  let regex = new RegExp(
    `(?:^|\\s|\\"|\\\`|\>|\\()(?:\\@)?(?:${word})(?:\\'s)?(?:$|\\s|\\"|\\!|\\?|\\,|\\.|\\:|\\)|\\\`)`,
    flags
  )

  return regex
}

// Checks for highlights using the mentions regex and the highlight words regex
Hue.check_highlights = function (message) {
  if (Hue.get_setting("highlight_current_username")) {
    if (message.search(Hue.mentions_regex) !== -1) {
      return true
    }
  }

  return false
}

// Checks if there are new highlights since the last load
// If so, a clickable announcement appears which opens Highlights
Hue.check_latest_highlight = function () {
  let highlight = Hue.get_latest_highlight()

  if (highlight) {
    Hue.dataset(highlight, "latest_highlight", true)
    let date = Hue.dataset(highlight, "date")

    if (date > Hue.room_state.last_highlight_date) {
      Hue.room_state.last_highlight_date = date
      Hue.save_room_state()
      Hue.show_highlights(true)
      Hue.on_activity("highlight")
    }
  }
}

// Gets the last highlighted message
// Either a chat content container or an announcement
Hue.get_latest_highlight = function () {
  let latest_highlight = false
  let items = Hue.els("#chat_area .chat_content_container")

  for (let item of items.reverse()) {
    if (Hue.dataset(item, "highlighted")) {
      latest_highlight = item
      break
    }
  }

  if (!latest_highlight) {
    let items = Hue.els("#chat_area > .message.announcement")

    for (let item of items.reverse()) {
      if (Hue.dataset(item, "highlighted")) {
        latest_highlight = item
        break
      }
    }
  }

  return latest_highlight
}

// What to do when a message gets highlighted
Hue.on_highlight = function (username) {
  if (!Hue.started) {
    return false
  }

  if (!Hue.settings.show_highlight_notifications) {
    return false
  }

  if (!Hue.has_focus) {
    Hue.show_highlight_desktop_notification(username)
  }

  Hue.on_activity("highlight")
}

// Show and/or filters highlights window
Hue.show_highlights = function (only_new = false) {
  if (only_new) {
    Hue.show_chat_search("$new_highlights")
  } else {
    Hue.show_chat_search("$highlights")
  }
}