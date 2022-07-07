// On context click action
Hue.on_context_click = function (e) {
  Hue.show_chat_context_menu(e, e.target.closest("#chat_area"))
}

// Show chat context menu
Hue.show_chat_context_menu = function (e, is_main) {
  e.stopPropagation()
  let unit = e.target.closest(".message_unit")

  if (!unit) {
    return
  }
  
  let items = []
  let message = e.target.closest(".message")
  let mode = Hue.dataset(message, "mode")
  let type = Hue.dataset(message, "type")
  let user_id = Hue.dataset(message, "user_id")
  let id = Hue.dataset(unit, "id")
  let likes = Hue.dataset(unit, "likes")
  let message_id = Hue.dataset(message, "message_id")
  let url = ""

  if (mode === "chat") {
    let container = e.target.closest(".chat_content_container")
    url = Hue.dataset(container, "first_url")
  }

  if (mode === "chat" || type === "image_change" || type === "tv_change") {
    items.push({
      text: "Reply",
      action: function () {
        let el = Hue.el(".reply_message", e.target.closest(".reply_message_container"))
        Hue.start_reply(el)
      }
    })
  }

  if (mode === "chat" || type === "image_change" || type === "tv_change") {
    let text = "Like"
    let type = "like"
    let included = Hue.dataset(unit, "likes").some(x => x.user_id === Hue.user_id)

    // Check if the user already like the post
    if (included) {
      text = "Unlike"
      type = "unlike"
    }

    if (type === "unlike" || (type === "like" && likes.length < Hue.config.max_likes)) {
      items.push({
        text: text,
        action: function () {
          let el = Hue.el(".reply_message", e.target.closest(".reply_message_container"))
          Hue.like_message(el, type)
        }
      })
    }
  }    

  if (user_id === Hue.user_id && (mode === "chat" || type === "image_change" || type === "tv_change")) {
    items.push({
      text: "Edit",
      action: function () {
        let el = e.target.closest(".edit_message_container")
        Hue.edit_message(el)
      }
    })
  }
  
  items.push({
    text: "Hide",
    action: function () {
      Hue.show_confirm("Hide message. This won't delete it", function () {
        Hue.remove_message_from_context_menu(e.target)
      })          
    }
  })
  
  if ((user_id === Hue.user_id || Hue.is_admin_or_op()) && 
    (mode === "chat" || type === "image_change" || type === "tv_change")) {
    items.push({
      text: "Delete",
      action: function () {
        Hue.handle_delete_messages(id, user_id)      
      }
    })
  }

  if (url) {
    items.push({
      text: "Handle",
      action: function () {
        Hue.handle_url(url)     
      }
    })
  }

  if (!is_main) {
    items.push({
      text: "Jump",
      action: function () {
        Hue.jump_to_chat_message(message_id, true)
      }
    })
  }
  
  ctxmenu.show(items, e)
  e.preventDefault()  
}