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
      if (Hue.dataset(it, "mode") !== "chat") {
        return false
      }

      if (mode === "user_id") {
        let user_id = Hue.dataset(it, "user_id")

        for (let f of filters) {
          if (f === user_id) {
            return true
          }
        }

        return false
      }

      let message_matched = false
      let containers = it.querySelectorAll(".chat_content_container")

      for (let container of containers) {
        for (let f of filters) {
          if (container.textContent.toLowerCase().includes(f)) {
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