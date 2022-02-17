// Starts the context menu for chat items
// This is triggered by a normal click
Hue.start_chat_menu_context_menu = function () {
  document.addEventListener("click", function (e) {
    if (e.target.closest(".chat_menu_button_container")) {
      e.stopPropagation()
      let items = []
      let message = e.target.closest(".message")
      let mode = Hue.dataset(message, "mode")
      let type = Hue.dataset(message, "type")
      let user_id = Hue.dataset(message, "user_id")
      let message_id = Hue.dataset(message, "message_id")
      let id = Hue.dataset(e.target.closest(".message_unit"), "id")
      let url = ""

      if (mode === "chat") {
        let container = e.target.closest(".chat_content_container")
        url = Hue.dataset(container, "first_url")
      }

      if (!e.target.closest("#chat_area")) {
        items.push({
          text: "Jump",
          action: function () {
            Hue.jump_to_chat_message(message_id)
          }
        })
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
          Hue.show_confirm("Hide Message", "This won't delete it", function () {
            Hue.remove_message_from_context_menu(e.target)
          })          
        }
      })
      
      if ((user_id === Hue.user_id || Hue.is_admin_or_op()) && 
        (mode === "chat" || type === "image_change" || type === "tv_change")) {
        items.push({
          text: "Delete",
          action: function () {
            Hue.handle_delete_message(id, user_id)      
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
      
      ctxmenu.show(items, e.target)
      e.preventDefault()
    }
  })
}

// Starts the context menu on user elements
Hue.start_user_context_menu = function () {
  let container = Hue.el("#show_profile_user")

  document.addEventListener("click", function (e) {
    if (container.contains(e.target)) {
      e.stopPropagation()
      let items = []

      if (Hue.is_admin_or_op()) {
        items.push({
          text: "Voice",
          action: function () {
            Hue.show_confirm("Give Voice Role", "Can interact with users and change media but no operator abilities", function () {
              let arg = Hue.dataset(container, "username")
              Hue.change_role(arg, "voice")
            })        
          }
        })
    
        items.push({
          text: "Op",
          action: function () {
            Hue.show_confirm("Give Op Role", "Enables access to operator features and commands", function () {
              let arg = Hue.dataset(container, "username")
              Hue.change_role(arg, "op")
            })       
          }
        })
        
        items.push({
          text: "Admin",
          action: function () {
            Hue.show_confirm("Give Admin Role", "Operator abilities plus can add/remove operators ", function () {
              let arg = Hue.dataset(container, "username")
              Hue.change_role(arg, "admin")
            })      
          }
        })

        if (Hue.user_is_online_by_username(Hue.dataset(container, "username"))) {
          items.push({
            text: "Kick",
            action: function () {
              Hue.show_confirm("Kick User", "Disconnect the user from the room", function () {
                let arg = Hue.dataset(container, "username")
                Hue.kick(arg)
              })     
            }
          })      
        }
    
        items.push({
          text: "Ban",
          action: function () {
            Hue.show_confirm("Ban User", "Ban the user from joining the room", function () {
              let arg = Hue.dataset(container, "username")
              Hue.ban(arg)
            })    
          }
        })   
      }

      ctxmenu.show(items, container)
    }
  })
}

// Starts the context menu for modal and popup windows's close buttons
Hue.start_msg_close_buttons_context_menu = function () {
  document.addEventListener("contextmenu", function (e) {
    if (e.target.classList.contains("Msg-window-inner-x")) {
      ctxmenu.show([{ 
        text: "Close All",
        action: function () {
          Hue.process_msg_close_button(e.target)
        }
      }], e.target)
      e.preventDefault()
    }
  })
}