// Setups most keyboard events
Hue.activate_key_detection = function () {
  document.addEventListener("keydown", (e) => {
    if (!Hue.started) {
      return
    }

    if (e.key === "Tab") {
      if (
        Hue.modal_open &&
        Hue.change_user_password_open ||
        Hue.msg_tv_picker.is_open() ||
        Hue.msg_image_picker.is_open() ||
        Hue.msg_message_board.is_open()
      ) {
        // Continue
      } else {
        if (e.ctrlKey) {
          return
        }

        e.preventDefault()
      }
    }

    if (Hue.editing_message) {
      Hue.focus_edit_area()

      if (e.key === "Enter" && !e.shiftKey) {
        Hue.send_edit_messsage()
        e.preventDefault()
      } else if (e.key === "Escape") {
        Hue.stop_edit_message()
        Hue.check_scrollers()
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        let res = Hue.handle_edit_direction()

        if (res) {
          e.preventDefault()
        }
      } else if (e.key === "ArrowDown") {
        let res = Hue.handle_edit_direction(true)

        if (res) {
          e.preventDefault()
        }
      }

      return
    } else if (Hue.editing_message_board_post) {
      if (e.key === "Enter") {
        Hue.do_message_board_edit()
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

      if (Hue.msg_image_picker.is_open()) {
        if (Hue.msg_image_picker.is_highest()) {
          if (e.key === "Enter") {
            Hue.image_picker_submit()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.msg_tv_picker.is_open()) {
        if (Hue.msg_tv_picker.is_highest()) {
          if (e.key === "Enter") {
            Hue.tv_picker_submit()
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

      if (Hue.open_room_open) {
        if (Hue.msg_info2.is_highest()) {
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

      if (Hue.background_input_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter") {
            Hue.background_input_action()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.goto_room_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter") {
            Hue.goto_room_action()
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

          if (e.key === "Enter") {
            Hue.show_media_history("image")
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.writing_reply) {
        if (Hue.msg_reply.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_reply()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.change_user_username_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_change_username()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.change_user_password_open) {
        if (Hue.msg_info2.is_highest()) {
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

      if (Hue.screen_locked) {
        if (e.key === "Enter" || e.key === "Escape") {
          Hue.unlock_screen()
          e.preventDefault()
        }

        return
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
      let val = Hue.get_input()

      if (e.shiftKey) {
        if (!Hue.footer_expanded) {
          Hue.enable_footer_expand()

          if (!val.trim()) {
            e.preventDefault()
          }
        }

        return
      }

      if (val) {
        Hue.submit_input()
      } else {
        Hue.goto_bottom(true)
        Hue.check_scrollers()
      }

      e.preventDefault()
      return
    } else if (e.key === "PageUp") {
      Hue.scroll_up()
    } else if (e.key === "PageDown") {
      Hue.scroll_down()
    } else if (e.key === "ArrowUp") {
      if (!e.shiftKey && Hue.footer_expanded) {
        return false
      }

      if (e.shiftKey) {
        Hue.input_history_change("up")
        e.preventDefault()
      } else if (Hue.chat_scrolled) {
        Hue.scroll_up()
      } else {
        Hue.edit_last_message()
      }

      return
    } else if (e.key === "ArrowDown") {
      if (!e.shiftKey && Hue.footer_expanded) {
        return false
      }
      
      if (e.shiftKey) {
        Hue.input_history_change("down")
        e.preventDefault()
      } else {
        Hue.scroll_down()
      }

      e.preventDefault()
      return
    } else if (e.key === "Escape") {
      if (!e.shiftKey) {
        if (Hue.chat_scrolled) {
          Hue.goto_bottom(true)
        } else {
          Hue.check_clear_input()
        }
      }
    }
  })
}