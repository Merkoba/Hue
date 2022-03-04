// Resets chat search filter state
Hue.reset_chat_search_filter = function () {
  Hue.el("#chat_search_filter").value = ""
  Hue.el("#chat_search_container").innerHTML = ""
}

// Shows the chat search window
Hue.show_chat_search = function (filter = "") {
  let finished = false

  function filtercheck (it) {
    if (finished) {
      return false
    }

    if (filter.startsWith("$user ")) {
      return f_username === Hue.dataset(it, "username")
    } else if (filter === "$highlights") {
      return Hue.dataset(it, "highlighted")
    } else if (filter === "$fresh_highlights") {
      if (!Hue.latest_highlight) {
        finished = true
        return false
      }

      let highlighted = Hue.dataset(it, "highlighted")

      if (highlighted) {
        let id1 = Hue.dataset(it, "id")
        let id2 = Hue.dataset(Hue.latest_highlight, "id")
        if (id1 === id2) {
          finished = true
        }
      }

      return highlighted
    } else if (filter === "$links") {
      let s = it.textContent.toLowerCase()
      return s.includes("http://") || s.includes("https://")
    } else {
      return it.textContent.toLowerCase().includes(filter)
    }
  }

  Hue.el("#chat_search_container").innerHTML = ""
  Hue.el("#chat_search_filter").value = filter

  filter = filter.trim().toLowerCase()
  let f_username = ""

  if (filter) {
    if (filter.startsWith("$user")) {
      if (filter.split(" ").length === 1) {
        return
      }

      f_username = filter.replace("$user ", "").trim()
    }

    let messages = Hue.clone_children("#chat_area").reverse()

    messages.forEach(it => {
      it.removeAttribute("id")
    })

    messages = messages.filter(it => {
      let mode = Hue.dataset(it, "mode")
      let message_matched = false

      if (mode === "chat") {
        let containers = Hue.els(".chat_content_container", it)
  
        for (let container of containers) {
          if (filtercheck(container)) {
            message_matched = true
            container.x_search_matched = true
          }
        }
  
        if (message_matched) {
          for (let container of containers) {
            if (!container.x_search_matched) {
              container.remove()
            }
          }
        }
      } else if (mode === "announcement") {
        if (filtercheck(it)) {
          message_matched = true
        }
      }

      return message_matched
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

// Show links in chat search
Hue.show_links = function () {
  Hue.show_chat_search("$links")
}