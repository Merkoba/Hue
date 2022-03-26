// Setup chat search
Hue.setup_chat_search = function () {
  Hue.el("#chat_search_highlights").addEventListener("click", function () {
    Hue.show_highlights()
  })

  Hue.el("#chat_search_links").addEventListener("click", function () {
    Hue.show_links()
  })

  Hue.el("#chat_search_user").addEventListener("click", function () {
    Hue.show_user_messages()
  })
}

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

    if (filter.startsWith("$user")) {
      let match = first_arg === Hue.dataset(it, "username")
      
      if (match) {
        if (tail) {
          match = it.textContent.toLowerCase().includes(tail)
        }
      }

      return match
    } else if (filter.startsWith("$highlights")) {
      let match = Hue.dataset(it, "highlighted")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    } else if (filter.startsWith("$fresh_highlights")) {
      if (!Hue.latest_highlight) {
        finished = true
        return false
      }

      let match = Hue.dataset(it, "highlighted")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      if (match) {
        let id1 = Hue.dataset(it, "id")
        let id2 = Hue.dataset(Hue.latest_highlight, "id")
        if (id1 === id2) {
          finished = true
        }
      }

      return match
    } else if (filter.startsWith("$links")) {
      let s = it.textContent.toLowerCase()
      let match = s.includes("http://") || s.includes("https://")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    } else {
      return it.textContent.toLowerCase().includes(filter)
    }
  }

  Hue.el("#chat_search_container").innerHTML = ""
  Hue.el("#chat_search_filter").value = filter
  filter = Hue.utilz.single_space(filter).trim().toLowerCase()
  let args, first_arg, tail

  if (filter) {
    if (filter.startsWith("$")) {
      let split = filter.split(" ").filter(x => x !== "")
      first_arg = split[1]
      args = split.slice(1).join(" ")
      tail = split.slice(2).join(" ")
    }

    if (filter.startsWith("$user")) {
      if (!first_arg) {
        return
      }
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
        let profilepics = Hue.els(".profilepic", message)

        for (let pic of profilepics) {
          pic.addEventListener("error", function (e) {
            Hue.fallback_profilepic(this)
          })
        }

        Hue.el("#chat_search_container").append(message)
      }
    } else {
      Hue.el("#chat_search_container").innerHTML = "<div class='center'>Nothing found</div>"
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
  Hue.show_chat_search("$links ")
}