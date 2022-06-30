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

  Hue.el("#chat_search_image").addEventListener("click", function () {
    Hue.show_image_list()
  })

  Hue.el("#chat_search_tv").addEventListener("click", function () {
    Hue.show_tv_list()
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
  let highlight_id

  function filtercheck (it) {
    if (finished) {
      return
    }

    if (filter.startsWith("$user")) {
      let username = Hue.dataset(it, "username")
      let match = username && first_arg === username.toLowerCase()
      
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
        return
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
    } else if (filter.startsWith("$image")) {
      let match = (Hue.dataset(it, "mode") === "announcement" && 
                  Hue.dataset(it, "type") === "image_change")
      
      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    } else if (filter.startsWith("$tv")) {
      let match = (Hue.dataset(it, "mode") === "announcement" && 
                  Hue.dataset(it, "type") === "tv_change")
      
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

  function on_messages (messages) {
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
  }

  Hue.el("#chat_search_container").innerHTML = ""
  Hue.el("#chat_search_filter").value = filter
  let filter0 = Hue.utilz.single_space(filter).trim()
  filter = filter0.toLowerCase()
  let args, first_arg, tail

  if (filter) {
    if (filter.startsWith("$")) {
      let split = filter.split(" ").filter(x => x !== "")
      first_arg = split[1]
      args = split.slice(1).join(" ")
      tail = split.slice(2).join(" ")

      if (first_arg) {
        first_arg = first_arg.toLowerCase()
      }

      if (args) {
        args = args.toLowerCase()
      }

      if (tail) {
        tail = tail.toLowerCase()
      }
    }

    if (filter.startsWith("$user")) {
      if (!first_arg) {
        return
      }
    }

    if (filter.startsWith("$id")) {
      let item = Hue.get_message_container_by_id(first_arg)

      if (item) {
        let messages = []
        let prev = item.previousElementSibling
        let next = item.nextElementSibling
        
        if (prev) {
          messages.push(Hue.clone(prev))
        }
        
        messages.push(Hue.clone(item))

        if (next) {
          messages.push(Hue.clone(next))
        }

        highlight_id = Hue.dataset(item, "message_id")
        on_messages(messages)
      }
    } else {
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

      on_messages(messages)
    }

  } else {
    Hue.el("#chat_search_container").innerHTML = "<div class='center'>Search recent messages</div>"
  }

  Hue.msg_chat_search.show(function () {
    if (highlight_id) {
      Hue.jump_to_chat_message(highlight_id, true, "#chat_search_container")
    } else {
      Hue.scroll_modal_to_top("chat_search")
    }
  })
}

// Show links in chat search
Hue.show_links = function () {
  Hue.show_chat_search("$links ")
}

// Show image messages
Hue.show_image_list = function () {
  Hue.show_chat_search("$image ")
}

// Show tv messages
Hue.show_tv_list = function () {
  Hue.show_chat_search("$tv ")
}

// Do a chat search by id
Hue.chat_search_by_id = function (id) {
  Hue.show_chat_search(`$id ${id}`)
}