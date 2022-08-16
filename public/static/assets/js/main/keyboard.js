// Setups most keyboard events
Hue.activate_key_detection = function () {
  Hue.ev(document, "keydown", (e) => {
    if (!Hue.started) {
      return
    }

    if (e.key === "Tab") {
      if (
        Hue.modal_open &&
        Hue.msg_change_password.is_open() ||
        Hue.msg_message_board.is_open() ||
        Hue.msg_link_image.is_open() ||
        Hue.msg_link_tv.is_open()
      ) {
        // Continue
      } else {
        if (e.ctrlKey) {
          return
        }

        e.preventDefault()
      }
    }

    if (Hue.editing_message_board) {
      if (e.key === "Enter") {
        Hue.do_message_board_edit()
        e.preventDefault()
        return
      }
    }

    if (e.key === "Enter") {
      if (e.ctrlKey) {
        Hue.toggle_modal_image()
        e.preventDefault()
        return
      }
    }

    if (e.key === "Backspace") {
      if (e.ctrlKey) {
        Hue.toggle_message_board()
        e.preventDefault()
        return
      }
    }

    if (Hue.modal_open) {
      if (e.key === "Escape") {
        if (e.shiftKey) {
          Hue.close_all_modals()
          e.preventDefault()
          return
        }
      }

      if (e.target.closest(".filter_input")) {
        let c = e.target.closest(".Msg-content-container")

        if (e.key === "PageUp") {
          c.scrollTop = 0
          e.preventDefault()
        } else if (e.key === "PageDown") {
          c.scrollTop = c.scrollHeight
          e.preventDefault()
        } else if (e.key === "ArrowUp") {
          c.scrollTop -= Hue.chat_scroll_amount
          e.preventDefault()
        } else if (e.key === "ArrowDown") {
          c.scrollTop += Hue.chat_scroll_amount
          e.preventDefault()
        }

        return
      }

      if (Hue.msg_link_image.is_open()) {
        if (Hue.msg_link_image.is_highest()) {
          if (e.key === "Enter") {
            Hue.link_image_submit()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_link_tv.is_open()) {
        if (Hue.msg_link_tv.is_highest()) {
          if (e.key === "Enter") {
            Hue.link_tv_submit()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_image_upload_comment.is_open()) {
        if (Hue.msg_image_upload_comment.is_highest()) {
          if (e.key === "Enter") {
            Hue.process_image_upload_comment()
            e.preventDefault()
          }
        }
      }

      if (Hue.msg_tv_upload_comment.is_open()) {
        if (Hue.msg_tv_upload_comment.is_highest()) {
          if (e.key === "Enter") {
            Hue.process_tv_upload_comment()
            e.preventDefault()
          }
        }
      }      

      if (Hue.msg_open_room.is_open()) {
        if (Hue.msg_open_room.is_highest()) {
          if (e.key === "Enter") {
            if (e.shiftKey) {
              Hue.el("#open_room_here").click()
            } else {
              Hue.el("#open_room_new_tab").click()
            }

            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_link_background.is_open()) {
        if (Hue.msg_link_background.is_highest()) {
          if (e.key === "Enter") {
            Hue.link_background_action()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_modal_image.is_open()) {
        if (Hue.msg_modal_image.is_highest()) {
          if (e.key === "ArrowLeft") {
            Hue.modal_image_prev_click()
            e.preventDefault()
          } else if (e.key === "ArrowRight") {
            Hue.modal_image_next_click()
            e.preventDefault()
          } else if (e.key === "ArrowUp") {
            Hue.modal_image_next_click()
            e.preventDefault()
          } else if (e.key === "ArrowDown") {
            Hue.modal_image_prev_click()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_change_username.is_open()) {
        if (Hue.msg_change_username.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_change_username()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_change_password.is_open()) {
        if (Hue.msg_change_password.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_change_password()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_handle_url.is_open()) {
        if (Hue.msg_handle_url.is_highest()) {
          if (e.key === "Enter") {
            Hue.handle_url_chat()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_confirm.is_open()) {
        if (Hue.msg_confirm.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.on_confirm()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_message_board.is_open()) {
        if (Hue.msg_message_board.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_message_board_post()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_write_whisper.is_open()) {
        if (Hue.msg_write_whisper.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_write_whisper()
            e.preventDefault()
          }

          return
        }
      }

      return
    }

    if (e.key === "Control" || e.ctrlKey) {
      if (e.key !== "v") {
        return
      }
    }

    Hue.focus_input()

    if (e.key === "Enter") {
      if (Hue.selected_message) {
        Hue.selected_message_action()
        e.preventDefault()
        return
      }

      if (e.shiftKey) {
        if (!Hue.footer_expanded) {
          Hue.enable_footer_expand()
          e.preventDefault()
        }

        return
      }
      
      if (Hue.reply_active || Hue.edit_active || Hue.input_has_value()) {
        Hue.submit_input()
      } else {
        Hue.goto_bottom(true)
      }

      e.preventDefault()
      return
    } else if (e.key === "PageUp") {
      Hue.scroll_up()
    } else if (e.key === "PageDown") {
      Hue.scroll_down()
    } else if (e.key === "ArrowUp") {
      if (e.shiftKey || Hue.footer_expanded) {
        return
      }
      
      Hue.select_message("up")
      e.preventDefault()
      return
    } else if (e.key === "ArrowDown") {
      if (e.shiftKey || Hue.footer_expanded) {
        return
      }
      
      Hue.select_message("down")
      e.preventDefault()
      return
    } else if (e.key === "Escape") {
      if (!e.shiftKey) {
        if (Hue.selected_message) {
          Hue.do_unselect_message()
        } else if (Hue.chat_scrolled) {
          Hue.goto_bottom(true)
        } else if (Hue.reply_active) {
          Hue.cancel_reply()
        } else if (Hue.edit_active) {
          Hue.cancel_edit()
        } else {
          if (Hue.input_has_value()) {
            Hue.clear_input()
          } else {
            Hue.restore_input()
          }
        }

        e.preventDefault()
        return
      }        
    } else if (e.key === "Backspace") {
      if (Hue.footer_expanded) {
        if (!Hue.input_has_value()) {
          Hue.disable_footer_expand()
          e.preventDefault()
        }
        
        return
      }
    }    
  })

  Hue.ev(document, "input", function (e) {
    if (!Hue.started) {
      return false
    }

    if (e.target.closest(".filter_input")) {
      Hue.modal_filter()
    }
  })
}