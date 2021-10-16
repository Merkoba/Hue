// Starts the context menu for chat items
// This is triggered by a normal click
Hue.start_chat_menu_context_menu = function () {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("chat_menu_button_menu")) {
      e.stopPropagation()
      let items = []
      let message = e.target.closest(".message")
      let mode = message.dataset.mode
      let type = message.dataset.type
      let user_id = message.dataset.user_id
      let chat_container = e.target.closest(".chat_content_container")
      let url = ""
      
      if (chat_container) {
        url = chat_container.dataset.first_url
      }

      if (!e.target.closest("#chat_area")) {
        items.push({
          text: "Jump",
          action: function () {
            let message_id = e.target.closest(".message").dataset.message_id
            Hue.jump_to_chat_message(message_id)
          }
        })
      }

      if (mode === "chat" || type === "image_change" || type === "tv_change") {
        items.push({
          text: "Reply",
          action: function () {
            let el = e.target
            .closest(".reply_message_container")
            .querySelector(".reply_message")
            Hue.start_reply(el)
          }
        })
      }

      if (mode === "chat" && user_id === Hue.user_id) {
        items.push({
          text: "Edit",
          action: function () {
            let el = e.target.closest(".chat_content_container")
            Hue.edit_message(el)
          }
        })
      }
      
      if (url && Hue.change_image_source(url, true)) {
        items.push({
          text: "Change Image",
          action: function () {
            Hue.show_confirm("Change Image", "This will change it for everyone", function () {
              let first_url = e.target.closest(".chat_content_container").dataset.first_url
              Hue.change_image_source(first_url)
            })
          }
        })
      }

      if (url && Hue.change_tv_source(url, true)) {
        items.push({
          text: "Change TV",
          action: function () {
            Hue.show_confirm("Change TV", "This will change it for everyone", function () {
              let first_url = e.target.closest(".chat_content_container").dataset.first_url
              Hue.change_tv_source(first_url)
            })
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
      
      if (Hue.is_admin_or_op(Hue.role) && (mode === "chat" || type === "image_change" || type === "tv_change")) {
        items.push({
          text: "Delete",
          action: function () {
            Hue.show_confirm("Delete Message", "Remove message from the chat log", function () {
              let id = false
              let message = e.target.closest(".message")
              let mode = message.dataset.mode
  
              if (mode === "chat") {
                id = e.target.closest(".chat_content_container").dataset.id
              } else if (mode === "announcement") {
                id = message.dataset.id
              }
  
              if (id) {
                Hue.delete_message(id, true)
              }
            })       
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
  let container = document.querySelector("#show_profile_user")

  document.addEventListener("click", function (e) {
    if (container.contains(e.target)) {
      e.stopPropagation()
      let items = []

      if (Hue.is_admin_or_op(Hue.role)) {
        items.push({
          text: "Voice",
          action: function () {
            Hue.show_confirm("Give Voice Role", "Can interact with users and change media but no operator abilities", function () {
              let arg = container.dataset.username
              Hue.change_role(arg, "voice")
            })        
          }
        })
    
        items.push({
          text: "Op",
          action: function () {
            Hue.show_confirm("Give Op Role", "Enables access to operator features and commands", function () {
              let arg = container.dataset.username
              Hue.change_role(arg, "op")
            })       
          }
        })
        
        items.push({
          text: "Admin",
          action: function () {
            Hue.show_confirm("Give Admin Role", "Operator abilities plus can add/remove operators ", function () {
              let arg = container.dataset.username
              Hue.change_role(arg, "admin")
            })      
          }
        })

        if (Hue.user_is_online_by_username(container.dataset.username)) {
          items.push({
            text: "Kick",
            action: function () {
              Hue.show_confirm("Kick User", "Disconnect the user from the room", function () {
                let arg = container.dataset.username
                Hue.kick(arg)
              })     
            }
          })      
        }
    
        items.push({
          text: "Ban",
          action: function () {
            Hue.show_confirm("Ban User", "Ban the user from joining the room", function () {
              let arg = container.dataset.username
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