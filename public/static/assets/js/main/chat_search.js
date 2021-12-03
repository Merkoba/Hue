// Resets chat search filter state
Hue.reset_chat_search_filter = function () {
  Hue.el("#chat_search_filter").value = ""
  Hue.el("#chat_search_container").innerHTML = ""
}

// Shows the chat search window
Hue.show_chat_search = function (filter = "") {
  function filtercheck (f, it) {
    if (f.startsWith("$user:")) {
      let username = f.replace("$user:", "")
      return username === Hue.dataset(it, "username")
    } else if (f === "$highlights") {
      return Hue.dataset(it, "highlighted")
    } else if (f === "$links") {
      let s = it.textContent.toLowerCase()
      return s.includes("http://") || s.includes("https://")
    } else {
      return it.textContent.toLowerCase().includes(f)
    }
  }

  Hue.el("#chat_search_container").innerHTML = ""
  Hue.el("#chat_search_filter").value = filter
  

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
      let mode = Hue.dataset(it, "mode")
      let message_matched = false

      if (mode === "chat") {
        let containers = it.querySelectorAll(".chat_content_container")
  
        for (let container of containers) {
          for (let f of filters) {
            if (filtercheck(f, container)) {
              message_matched = true
              container.x_search_matched = true
              break
            }
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
        for (let f of filters) {
          if (filtercheck(f, it)) {
            message_matched = true
            break
          }
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