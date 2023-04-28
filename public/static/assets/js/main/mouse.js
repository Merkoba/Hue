// Handle mouse events
App.start_mouse_events = () => {
  App.ev(document, `click`, (e) => {
    if (!e.target) {
      return
    }

    if (e.target.tagName === `A`) {
      return
    }

    if (!e.target.closest) {
      return
    }

    if (e.target.closest(`.chat_area`)) {
      let message = e.target.closest(`.message`)

      if (message) {
        let id = App.dataset(message, `id`)
        let username = App.dataset(message, `username`)
        let user_id = App.dataset(message, `user_id`)
        let type = App.dataset(message, `type`)

        if (e.target.classList.contains(`chat_username`)) {
          App.show_profile(username, user_id)
        }
        else if (e.target.classList.contains(`chat_profilepic`)) {
          App.show_profile(username, user_id)
        }
        else if (e.target.classList.contains(`chat_quote_text`)) {
          let quote = e.target.closest(`.chat_quote`)
          let id = App.dataset(quote, `quote_id`)
          let ans = App.get_message_by_id(id)

          if (ans) {
            let og = ans[0]
            let type = App.dataset(og, `type`)
            let id = App.dataset(og, `id`)

            if (type === `image_change`) {
              App.show_modal_image(id)
            }
            else if (type === `tv_change`) {
              App.open_url_menu_by_media_id(`tv`, id)
            }
            else {
              App.chat_search_by_id(id)
            }
          }
          else {
            App.chat_search_by_id(id)
          }
        }
        else if (e.target.classList.contains(`chat_quote_username`) ||
          e.target.classList.contains(`chat_quote_profilepic`)) {
          let quote = e.target.closest(`.chat_quote`)
          let username = App.dataset(quote, `quote_username`)
          let user_id = App.dataset(quote, `quote_user_id`)
          App.show_profile(username, user_id)
        }
        else if (e.target.classList.contains(`link_preview_image`)) {
          e.stopPropagation()
          App.view_image(e.target.src, username, user_id)
        }
        else if (e.target.classList.contains(`image_preview_image`)) {
          e.stopPropagation()
          let src = App.dataset(e.target, `image_preview_src_original`)
          App.view_image(src, username, user_id)
        }
        else if (e.target.classList.contains(`announcement_content`) ||
          e.target.closest(`.brk`)) {
          if (type === `image_change`) {
            App.show_modal_image(id)
          }
          else if (type === `tv_change`) {
            App.open_url_menu_by_media_id(`tv`, id)
          }
        }
        else if (e.target.closest(`.brk_profilepic`)) {
          App.show_profile(username, user_id)
        }
        else if (e.target.closest(`.like_container`)) {
          let el = e.target.closest(`.like_container`)
          let user_id = App.dataset(el, `user_id`)
          let username = App.dataset(el, `username`)
          App.show_profile(username, user_id)
        }
        else if (e.target.closest(`.chat_menu_button_container`)) {
          App.show_chat_context_menu(e.target.closest(`.chat_menu_button_container`))
        }
      }
    }
    else if (e.target.closest(`.window_controls`)) {
      let el = e.target.closest(`.window_controls`)
      let filter = App.el(`.filter_input`, el)

      if (e.target.closest(`.window_filter_clear`)) {
        filter.value = ``
        App.do_modal_filter()
        filter.focus()
      }
    }

    if (e.target.classList.contains(`whisper_link`)) {
      let container = e.target.closest(`.user_details`)
      let username = App.dataset(container, `username`)
      App.process_write_whisper(`${username} > ${e.target.dataset.whisper}`)
    }
  })

  App.ev(document, `auxclick`, (e) => {
    if (e.button !== 1) {
      return
    }

    if (!e.target) {
      return
    }

    if (e.target.tagName === `A`) {
      return
    }

    if (!e.target.closest) {
      return
    }

    if (e.target.closest(`.chat_menu_button_main`)) {
      let container = e.target.closest(`.chat_menu_button_main`)

      if (container) {
        let button = App.el(`.chat_menu_button_container`, container)
        App.show_chat_context_menu(button, e.clientX, e.clientY)
      }
    }
  })
}