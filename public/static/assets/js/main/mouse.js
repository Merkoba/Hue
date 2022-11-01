// Handle mouse events
Hue.start_mouse_events = function () {
  Hue.ev(document, "click", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.tagName === "A") {
      return
    }    

    if (!e.target.closest) {
      return
    }
    
    if (e.target.closest(".chat_area")) {
      let message = e.target.closest(".message")
      
      if (message) {
        let id = Hue.dataset(message, "id")
        let username = Hue.dataset(message, "username")
        let user_id = Hue.dataset(message, "user_id")
        let type = Hue.dataset(message, "type")

        if (e.target.classList.contains("chat_username")) {
          Hue.show_profile(username, user_id)
        } else if (e.target.classList.contains("chat_profilepic")) {
          Hue.show_profile(username, user_id)
        } else if (e.target.classList.contains("chat_quote_text")) {
          let quote = e.target.closest(".chat_quote")
          let id = Hue.dataset(quote, "quote_id")
          Hue.chat_search_by_id(id)
        } else if (e.target.classList.contains("chat_quote_username") ||
          e.target.classList.contains("chat_quote_profilepic")) {
          let quote = e.target.closest(".chat_quote")
          let username = Hue.dataset(quote, "quote_username")
          let user_id = Hue.dataset(quote, "quote_user_id")
          Hue.show_profile(username, user_id)
        } else if (e.target.classList.contains("link_preview_image")) {
          e.stopPropagation()
          Hue.view_image(e.target.src, username, user_id)
        } else if (e.target.classList.contains("image_preview_image")) {
          e.stopPropagation()
          let src = Hue.dataset(e.target, "image_preview_src_original")
          Hue.view_image(src, username, user_id)
        } else if (e.target.classList.contains("announcement_content") ||
          e.target.closest(".brk")) {
          if (type === "image_change") {
            Hue.show_modal_image(id)
          } else if (type === "tv_change") {
            Hue.open_url_menu_by_media_id("tv", id)
          }
        } else if (e.target.closest(".brk_profilepic")) {
          Hue.show_profile(username, user_id)
        } else if (e.target.closest(".like_container")) {
          let el = e.target.closest(".like_container")
          let user_id = Hue.dataset(el, "user_id")
          let username = Hue.dataset(el, "username")
          Hue.show_profile(username, user_id)
        } else if (e.target.closest(".chat_menu_button_container")) {
          Hue.show_chat_context_menu(e.target.closest(".chat_menu_button_container"))
        } 
      }
    } else if (e.target.closest(".window_controls")) {
      let el = e.target.closest(".window_controls")
      let filter = Hue.el(".filter_input", el)

      if (e.target.closest(".window_filter_clear")) {
        filter.value = ""
        Hue.do_modal_filter()
        filter.focus()
      }
    }

    if (e.target.classList.contains("whisper_link")) {
      let container = e.target.closest(".user_details")
      let username = Hue.dataset(container, "username")
      Hue.process_write_whisper(`${username} > ${e.target.dataset.whisper}`)
    }
  })

  Hue.ev(document, "auxclick", function (e) {
    if (e.button !== 1) {
      return
    }

    if (!e.target) {
      return
    }

    if (e.target.tagName === "A") {
      return
    }    

    if (!e.target.closest) {
      return
    }
    
    if (e.target.closest(".chat_menu_button_main")) {
      let container = e.target.closest(".chat_menu_button_main")

      if (container) {
        let button = Hue.el(".chat_menu_button_container", container)
        Hue.show_chat_context_menu(button, e.clientX, e.clientY)
      }
    }    
  })
}