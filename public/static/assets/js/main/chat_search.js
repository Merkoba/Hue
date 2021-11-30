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

  let filters = []

  if (filter.trim()) {
    filters = filter.split(" || ").map(x => x.trim().toLowerCase())
  }

  if (filters.length) {
    let messages = Hue.clone_children("#chat_area").reverse()

    messages.forEach(it => {
      it.removeAttribute("id")
    })

    messages = messages.filter(it => {
      if (mode === "user_id") {
        let user_id = Hue.dataset(it, "user_id")

        for (let f of filters) {
          if (f === user_id) {
            return true
          }
        }

        return false
      }

      let text = it.textContent.toLowerCase()

      if (!text) {
        return false
      }

      let text_cmp = false

      for (let f of filters) {
        if (text.includes(f)) {
          text_cmp = true
          break
        }
      }

      return text_cmp
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