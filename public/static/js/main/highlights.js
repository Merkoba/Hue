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
    `(?:^|\\s|\\"|\\\`|\>)(?:\\@)?(?:${word})(?:\\'s)?(?:$|\\s|\\"|\\!|\\?|\\,|\\.|\\:|\\\`)`,
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
  let latest_highlight = Hue.get_latest_highlight()

  if (latest_highlight) {
    let date = $(latest_highlight).data("date")

    if (date > Hue.room_state.last_highlight_date) {
      Hue.room_state.last_highlight_date = date
      Hue.save_room_state()
      Hue.show_highlights()
    }
  }
}

// Gets the last highlighted message
// Either a chat content container or an announcement
Hue.get_latest_highlight = function () {
  let latest_highlight = false

  $($("#chat_area .chat_content_container").get().reverse()).each(function () {
    if ($(this).data("highlighted")) {
      latest_highlight = this
      return false
    }
  })

  if (latest_highlight) {
    $($("#chat_area > .message.announcement").get().reverse()).each(
      function () {
        if ($(this).data("highlighted")) {
          if ($(this).data("date") > $(latest_highlight).data("date")) {
            latest_highlight = this
          }

          return false
        }
      }
    )
  }

  return latest_highlight
}

// What to do when a message gets highlighted
Hue.on_highlight = function () {
  if (!Hue.started) {
    return false
  }

  if (!Hue.settings.show_highlight_notifications) {
    return false
  }

  if (!Hue.app_focused) {
    Hue.show_highlight_desktop_notification()
  }

  if (Hue.msg_highlights.is_open()) {
    Hue.show_highlights($("#highlights_filter").val())
  }

  Hue.on_activity("highlight")
}

// Resets highlights filter data
Hue.reset_highlights_filter = function () {
  $("#highlights_filter").val("")
  $("#highlights_container").html("")
}

// Show and/or filters highlights window
Hue.show_highlights = function (filter = false) {
  $("#highlights_container").html("")
  $("#highlights_filter").val(filter ? filter : "")

  let clone = $($("#chat_area").children().get().reverse()).clone(true, true)

  clone.each(function () {
    $(this).removeAttr("id")
  })

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()

    clone = clone.filter(function () {
      if (!$(this).data("highlighted")) {
        return false
      }
      
      let text = $(this).text().toLowerCase()
      let text_cmp = text.includes(lc_value)
      
      let source_cmp = false
      let media_source = $(this).data("media_source")
      
      if (media_source) {
        source_cmp = media_source.includes(lc_value)
      }

      return text_cmp || source_cmp
    })
  } else {
    clone = clone.filter(function () {
      if (!$(this).data("highlighted")) {
        return false
      }

      return true
    })
  }

  if (clone.children().length) {
    clone.appendTo("#highlights_container")
  }

  Hue.msg_highlights.show(function () {
    Hue.scroll_modal_to_top("highlights")
  })
}