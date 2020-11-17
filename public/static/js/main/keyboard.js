// Setups most keyboard events
Hue.activate_key_detection = function () {
  document.addEventListener("keydown", (e) => {
    if (!Hue.started) {
      return
    }

    if (e.key === "Tab") {
      e.preventDefault()
    }

    if (Hue.modal_open) {
      if (e.key === "Escape") {
        if (e.shiftKey) {
          Hue.close_all_modals()
          e.preventDefault()
          return
        }
      }

      if (Hue.image_picker_open) {
        if (Hue.msg_image_picker.is_highest()) {
          if (e.key === "Enter") {
            Hue.image_picker_submit()
            e.preventDefault()
          } else if (e.key === "Tab") {
            Hue.do_media_picker_input_cycle("image")
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.tv_picker_open) {
        if (Hue.msg_tv_picker.is_highest()) {
          if (e.key === "Enter") {
            Hue.tv_picker_submit()
            e.preventDefault()
          } else if (e.key === "Tab") {
            Hue.do_media_picker_input_cycle("tv")
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.image_upload_comment_open) {
        if (Hue.msg_image_upload_comment.is_highest()) {
          if (e.key === "Enter") {
            Hue.process_image_upload_comment()
            e.preventDefault()
          }
        }
      }

      if (Hue.open_room_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter") {
            if (e.shiftKey) {
              $("#open_room_here").trigger("click")
            } else {
              $("#open_room_new_tab").trigger("click")
            }

            e.preventDefault()
          }

          return
        }
      }

      if (Hue.background_image_input_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter") {
            Hue.background_image_input_action()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.create_room_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter") {
            Hue.create_room_submit()
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

      if (Hue.modal_image_open) {
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

      if (Hue.change_user_email_open) {
        if (Hue.msg_info2.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.submit_change_email()
            e.preventDefault()
          }

          return
        }
      }

      if (Hue.handle_url_open) {
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

      if (Hue.confirm_open) {
        if (Hue.msg_confirm.is_highest()) {
          if (e.key === "Enter" && !e.shiftKey) {
            Hue.on_confirm()
            e.preventDefault()
          }

          return
        }
      }

      return
    }

    if (Hue.editing_message) {
      Hue.focus_edit_area()

      if (e.key === "Enter" && !e.shiftKey) {
        Hue.send_edit_messsage()
        e.preventDefault()
      } else if (e.key === "Escape") {
        Hue.stop_edit_message()
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
    }

    let focus = true

    if (e.key === "Control") {
      focus = false
    } else if (e.ctrlKey && window.getSelection().toString() !== "") {
      focus = false
    }

    if (focus) {
      Hue.focus_input()
    }

    if (e.key === "Enter") {
      if (e.shiftKey) {
        Hue.toggle_footer_expand()
        e.preventDefault()
        return
      }

      if (Hue.footer_expanded) {
        return false
      }

      let val = $("#input").val()

      if (val.length === 0) {
        Hue.goto_bottom(true)
      } else {
        Hue.process_message({ message: val })
      }

      e.preventDefault()
      return
    } else if (e.key === "ArrowUp") {
      if (Hue.footer_expanded) {
        return false
      }

      if (e.shiftKey) {
        Hue.input_history_change("up")
        e.preventDefault()
      } else if (e.ctrlKey) {
        Hue.scroll_up(Hue.config.small_keyboard_scroll)
        e.preventDefault()
      } else {
        Hue.edit_last_message()
      }

      return
    } else if (e.key === "ArrowDown") {
      if (Hue.footer_expanded) {
        return false
      }
      
      if (e.shiftKey) {
        Hue.input_history_change("down")
        e.preventDefault()
      } else if (e.ctrlKey) {
        Hue.scroll_down(Hue.config.small_keyboard_scroll)
        e.preventDefault()
      } else {
        Hue.goto_bottom(true)
      }

      return
    } else if (e.key === "PageUp") {
      Hue.scroll_up(Hue.config.big_keyboard_scroll)
      e.preventDefault()
      return
    } else if (e.key === "PageDown") {
      Hue.scroll_down(Hue.config.big_keyboard_scroll)
      e.preventDefault()
      return
    } else if (e.key === "Home") {
      if (e.ctrlKey) {
        Hue.goto_top(false)
        e.preventDefault()
        return
      }
    } else if (e.key === "End") {
      if (e.ctrlKey) {
        Hue.goto_bottom(true)
        e.preventDefault()
        return
      }
    } else if (e.key === "Escape") {
      if (!e.shiftKey) {
        Hue.clear_input()
        Hue.reset_input_history_index()
        
        if ($("#input").val().length > 0) {
        } else {
          Hue.goto_bottom(true)
        }

        e.preventDefault()
        return
      }
    }
  })
}