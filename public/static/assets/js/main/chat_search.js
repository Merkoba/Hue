// Resets chat search filter state
Hue.reset_chat_search_filter = function () {
  Hue.el("#chat_search_filter").value = ""
  Hue.el("#chat_search_container").innerHTML = ""
}

// Shows the chat search window
Hue.show_chat_search = function (filter = "", mode = "normal") {
  Hue.el("#chat_search_container").innerHTML = ""

  if (mode === "user_id") {
    Hue.el("#chat_search_filter").value = ""
  } else {
    Hue.el("#chat_search_filter").value = filter ? filter : ""
  }

  if (filter.trim()) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    let messages = Hue.clone_children("#chat_area").reverse()

    messages.forEach(it => {
      it.removeAttribute("id")
    })

    messages = messages.filter(it => {
      if (mode === "user_id") {
        let user_id = Hue.dataset(it, "user_id")
        return filter === user_id
      }

      let text = it.textContent.toLowerCase()

      if (!text) {
        return false
      }

      let text_cmp = text.includes(lc_value)
      
      let source_cmp = false
      let media_source = Hue.dataset(it, "media_source")
      
      if (media_source) {
        source_cmp = media_source.includes(lc_value)
      }

      return text_cmp || source_cmp
    })

    if (messages.length) {
      for (let message of messages) {
        Hue.el("#chat_search_container").append(message)
      }
    } 
  } else {
    Hue.el("#chat_search_container").innerHTML = "<div class='center'>Search recent messages</div>"
  }

  Hue.msg_chat_search.show(function () {
    Hue.scroll_modal_to_top("chat_search")
  })
}