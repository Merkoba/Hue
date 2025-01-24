// Setups most keyboard events
App.activate_key_detection = () => {
  DOM.ev(document, `keydown`, (e) => {
    if (!App.started) {
      return
    }

    if (NeedContext.open) {
      return
    }

    if (e.key === `Tab`) {
      if (
        App.modal_open && (
          App.msg_change_password.is_open() ||
          App.msg_message_board.is_open() ||
          App.msg_link_image.is_open() ||
          App.msg_link_tv.is_open()
        )
      ) {
        // Continue
      }
      else {
        if (e.ctrlKey) {
          return
        }

        e.preventDefault()
      }
    }

    if (App.editing_message_board) {
      if (e.key === `Enter`) {
        App.do_message_board_edit()
        e.preventDefault()
        return
      }
    }

    if (App.modal_open) {
      if (e.key === `Escape`) {
        if (e.shiftKey) {
          App.close_all_modals()
          e.preventDefault()
          return
        }
      }

      if (!App.modal_selectable) {
        if (e.target.closest(`.filter_input`)) {
          let c = e.target.closest(`.Msg-content-container`)

          if (e.key === `PageUp`) {
            c.scrollTop = 0
            e.preventDefault()
          }
          else if (e.key === `PageDown`) {
            c.scrollTop = c.scrollHeight
            e.preventDefault()
          }
          else if (e.key === `ArrowUp`) {
            c.scrollTop -= App.chat_scroll_amount
            e.preventDefault()
          }
          else if (e.key === `ArrowDown`) {
            c.scrollTop += App.chat_scroll_amount
            e.preventDefault()
          }

          return
        }
      }
      else if (e.key === `Enter`) {
        App.selectable_enter()
        e.preventDefault()
      }
      else if (e.key === `ArrowUp`) {
        App.selected_next(true)
        e.preventDefault()
        return
      }
      else if (e.key === `ArrowDown`) {
        App.selected_next()
        e.preventDefault()
        return
      }

      if (App.msg_link_image.is_open()) {
        if (App.msg_link_image.is_highest()) {
          if (e.key === `Enter`) {
            App.link_image_submit()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_link_tv.is_open()) {
        if (App.msg_link_tv.is_highest()) {
          if (e.key === `Enter`) {
            App.link_tv_submit()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_image_upload_comment.is_open()) {
        if (App.msg_image_upload_comment.is_highest()) {
          if (e.key === `Enter`) {
            App.process_image_upload_comment()
            e.preventDefault()
          }
        }
      }

      if (App.msg_tv_upload_comment.is_open()) {
        if (App.msg_tv_upload_comment.is_highest()) {
          if (e.key === `Enter`) {
            App.process_tv_upload_comment()
            e.preventDefault()
          }
        }
      }

      if (App.msg_open_room.is_open()) {
        if (App.msg_open_room.is_highest()) {
          if (e.key === `Enter`) {
            if (e.shiftKey) {
              DOM.el(`#open_room_here`).click()
            }
            else {
              DOM.el(`#open_room_new_tab`).click()
            }

            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_link_background.is_open()) {
        if (App.msg_link_background.is_highest()) {
          if (e.key === `Enter`) {
            App.link_background_action()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_modal_image.is_open()) {
        if (App.msg_modal_image.is_highest()) {
          if (e.key === `ArrowLeft`) {
            App.modal_image_prev_click()
            e.preventDefault()
          }
          else if (e.key === `ArrowRight`) {
            App.modal_image_next_click()
            e.preventDefault()
          }
          else if (e.key === `ArrowUp`) {
            App.modal_image_next_click()
            e.preventDefault()
          }
          else if (e.key === `ArrowDown`) {
            App.modal_image_prev_click()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_change_username.is_open()) {
        if (App.msg_change_username.is_highest()) {
          if ((e.key === `Enter`) && !e.shiftKey) {
            App.submit_change_username()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_change_password.is_open()) {
        if (App.msg_change_password.is_highest()) {
          if ((e.key === `Enter`) && !e.shiftKey) {
            App.submit_change_password()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_handle_url.is_open()) {
        if (App.msg_handle_url.is_highest()) {
          if (e.key === `Enter`) {
            App.handle_url_chat()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_confirm.is_open()) {
        if (App.msg_confirm.is_highest()) {
          if ((e.key === `Enter`) && !e.shiftKey) {
            App.on_confirm()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_message_board.is_open()) {
        if (App.msg_message_board.is_highest()) {
          if ((e.key === `Enter`) && !e.shiftKey) {
            App.submit_message_board_post()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_write_whisper.is_open()) {
        if (App.msg_write_whisper.is_highest()) {
          if ((e.key === `Enter`) && !e.shiftKey) {
            App.submit_write_whisper()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_delete_messages.is_open()) {
        if (App.msg_delete_messages.is_highest()) {
          if ((e.key === `Enter`) && !e.shiftKey) {
            App.delete_message_action()
            e.preventDefault()
          }

          return
        }
      }

      if (App.msg_automedia.is_open()) {
        if (App.msg_automedia.is_highest()) {
          if (e.key === `Enter`) {
            if (e.shiftKey) {
              App.automedia_change()
            }
            else {
              App.automedia_chat()
            }

            e.preventDefault()
          }

          return
        }
      }

      return
    }

    if ((e.key === `Control`) || e.ctrlKey) {
      if (e.key !== `v`) {
        return
      }
    }

    if (!App.text_selected()) {
      App.focus_input()
    }

    let has_value = App.input_has_value()

    if (e.key === `Enter`) {
      if (App.selected_message) {
        App.selected_message_action()
        e.preventDefault()
        return
      }

      if (e.shiftKey) {
        if (!App.footer_expanded) {
          App.enable_footer_expand()
          App.add_input_new_line()
          e.preventDefault()
        }

        return
      }

      if (App.reply_active || App.edit_active || has_value) {
        App.submit_input()
      }
      else {
        App.goto_bottom(true)
      }

      e.preventDefault()
      return
    }
    else if (e.key === `PageUp`) {
      App.scroll_up()
    }
    else if (e.key === `PageDown`) {
      App.scroll_down()
    }
    else if (e.key === `ArrowUp`) {
      if (App.footer_expanded) {
        return
      }

      if (e.shiftKey) {
        App.show_input_history()
      }
      else {
        App.select_message(`up`)
      }

      e.preventDefault()
      return
    }
    else if (e.key === `ArrowDown`) {
      if (e.shiftKey || App.footer_expanded) {
        return
      }

      App.select_message(`down`)
      e.preventDefault()
      return
    }
    else if (e.key === `Escape`) {
      if (!e.shiftKey) {
        if (App.selected_message) {
          App.unselect_message()
        }
        else if (App.reply_active) {
          App.cancel_reply()
        }
        else if (App.edit_active) {
          App.cancel_edit()
        }
        else if (App.chat_scrolled) {
          App.goto_bottom(true)
        }
        else if (has_value) {
          App.clear_input()
        }
        else if (App.footer_expanded) {
          App.disable_footer_expand()
        }

        e.preventDefault()
        return
      }
    }
    else if (e.key === `Backspace`) {
      if (App.footer_expanded) {
        if (!has_value) {
          App.disable_footer_expand()
          e.preventDefault()
        }

        return
      }
    }

    if (!has_value) {
      App.unselect_message()
    }
  })

  DOM.ev(document, `input`, (e) => {
    if (!App.started) {
      return false
    }

    if (e.target.closest(`.filter_input`)) {
      App.modal_filter_debouncer.call()
    }
  })
}