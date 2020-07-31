// Sets events for all context menus
Hue.context_menu_events = {
  show: function () {
    Hue.context_menu_on_show()
  },
  hide: function () {
    Hue.context_menu_on_hide()
  },
}

// What happens after opening a context menu
Hue.context_menu_on_show = function () {
  Hue.context_menu_open = true
}

// What happens after hiding a context menu
Hue.context_menu_on_hide = function () {
  Hue.context_menu_open = false
}

// Starts the context menu for chat items
// This is triggered by a normal click
Hue.start_chat_menu_context_menu = function () {
  $.contextMenu({
    selector: ".chat_menu_button_menu",
    trigger: "left",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    events: {
      show: function (options) {
        Hue.context_menu_on_show()
        $(this)
          .closest(".chat_menu_button_main")
          .addClass("chat_menu_button_main_selected")
      },
      hide: function (options) {
        Hue.context_menu_on_hide()
        $(this)
          .closest(".chat_menu_button_main")
          .removeClass("chat_menu_button_main_selected")
      },
    },
    items: {
      item0: {
        name: "Jump",
        callback: function (key, opt) {
          let message_id = $(this).closest(".message").data("message_id")
          Hue.jump_to_chat_message(message_id)
        },
        visible: function (key, opt) {
          return $(this).closest("#chat_area").length === 0
        },
      },
      item1: {
        name: "Reply",
        callback: function (key, opt) {
          let el = $(this)
            .closest(".chat_content_container")
            .eq(0)
            .find(".chat_content")
            .get(0)
          Hue.start_reply(el)
        },
        visible: function (key, opt) {
          let message = $(this).closest(".message")

          if (message.data("mode") === "chat") {
            return true
          }

          return false
        },
      },
      item2: {
        name: "Edit",
        callback: function (key, opt) {
          let el = $(this).closest(".chat_content_container").get(0)
          Hue.edit_message(el)
        },
        visible: function (key, opt) {
          let message = $(this).closest(".message")

          if (message.data("mode") === "chat") {
            if ($(this).closest(".message").data("user_id") === Hue.user_id) {
              return true
            }
          }

          return false
        },
      },
      item4: {
        name: "Change Image",
        callback: function (key, opt) {},
        visible: function (key, opt) {
          let url = $(this).closest(".chat_content_container").data("first_url")

          if (url) {
            let ok = Hue.change_image_source(url, true)

            if (ok) {
              return true
            }
          }

          return false
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let first_url = $(this)
                .closest(".chat_content_container")
                .data("first_url")
              Hue.change_image_source(first_url)
            },
          },
        },
      },
      item5: {
        name: "Change TV",
        callback: function (key, opt) {},
        visible: function (key, opt) {
          let url = $(this).closest(".chat_content_container").data("first_url")

          if (url) {
            let ok = Hue.change_tv_source(url, true)

            if (ok) {
              return true
            }
          }

          return false
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let first_url = $(this)
                .closest(".chat_content_container")
                .data("first_url")
              Hue.change_tv_source(first_url)
            },
          },
        },
      },
      item7: {
        name: "Hide",
        callback: function (key, opt) {},
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              Hue.remove_message_from_context_menu(this)
            },
          },
        },
      },
      itemdel: {
        name: "Delete",
        callback: function (key, opt) {},
        visible: function (key, opt) {
          if (!Hue.log_enabled) {
            return false
          }

          let message = $(this).closest(".message")
          let mode = message.data("mode")

          if (mode === "chat") {
            let user_id = $(this).closest(".message").data("user_id")

            if (user_id) {
              let user = Hue.get_user_by_id(user_id)

              if (user) {
                if (!Hue.user_is_controllable(user)) {
                  return false
                }
              }
            }

            if ((user_id && user_id === Hue.user_id) || Hue.is_admin_or_op()) {
              return true
            }
          } else if (mode === "announcement") {
            let id = message.data("id")

            if (id) {
              let user_id = message.data("user_id")

              if (user_id) {
                let user = Hue.get_user_by_id(user_id)

                if (user) {
                  if (!Hue.user_is_controllable(user)) {
                    return false
                  }
                }
              }

              if (
                (user_id && user_id === Hue.user_id) ||
                Hue.is_admin_or_op()
              ) {
                return true
              }
            }
          }

          return false
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let id = false
              let message = $(this).closest(".message")
              let mode = message.data("mode")

              if (mode === "chat") {
                id = $(this).closest(".chat_content_container").eq(0).data("id")
              } else if (mode === "announcement") {
                id = message.data("id")
              }

              if (id) {
                Hue.delete_message(id, true)
              }
            },
          },
        },
      },
      item8: {
        name: "Clear Log",
        callback: function (key, opt) {},
        items: {
          above: {
            name: "Above This Point",
            callback: function (key, opt) {},
            items: {
              opsure: {
                name: "I'm Sure",
                callback: function (key, opt) {
                  let id
                  let message = $(this).closest(".message")
                  let mode = message.data("mode")

                  if (mode === "chat") {
                    id = $(this).closest(".chat_content_container").data("id")
                  } else if (mode === "announcement") {
                    id = message.data("id")
                  }

                  Hue.clear_log("above", id)
                },
              },
            },
          },
          below: {
            name: "Below This Point",
            callback: function (key, opt) {},
            items: {
              opsure: {
                name: "I'm Sure",
                callback: function (key, opt) {
                  let id
                  let message = $(this).closest(".message")
                  let mode = message.data("mode")

                  if (mode === "chat") {
                    id = $(this).closest(".chat_content_container").data("id")
                  } else if (mode === "announcement") {
                    id = message.data("id")
                  }

                  Hue.clear_log("below", id)
                },
              },
            },
          },
        },
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "log")) {
            return false
          }

          if (!Hue.log_enabled) {
            return false
          }

          let message = $(this).closest(".message")
          let mode = message.data("mode")

          if (mode === "chat") {
            if ($(this).closest(".chat_content_container").data("id")) {
              return true
            }
          } else if (mode === "announcement") {
            if (!message.data("in_log")) {
              return false
            }

            if (message.data("id")) {
              return true
            }
          }

          return false
        },
      },
    },
  })
}

// Generate the items for the chat maxer context menu
Hue.generate_chat_maxer_context_items = function () {
  let items = {}
  let max = Hue.num_media_elements_visible() === 0
  let per = Hue.get_setting("chat_display_percentage")

  for (let i = 9; i >= 1; i--) {
    let n = i * 10
    let class_name = ""

    if (max) {
      if (n === 100) {
        class_name = "bold bigger"
      }
    } else {
      if (per === n) {
        class_name = "bold bigger"
      }
    }

    items[`per${n}`] = {
      name: `Chat ${n}%`,
      callback: function (key, opt) {
        Hue.do_chat_size_change(n)
      },
      className: class_name,
    }
  }

  let obj = Object.assign(
    items, {
      def: {
        name: "Default",
        callback: function (key, opt) {
          Hue.set_default_chat_size()
        }
      }
    }
  )

  return obj
}

// Starts the chat maxer context menu
Hue.start_chat_maxer_context_menu = function () {
  $.contextMenu({
    selector: "#chat_maxer",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    className: "maxer_context",
    trigger: "left",
    build: function () {
      return {
        items: Hue.generate_chat_maxer_context_items(),
      }
    },
  })
}

// Generates the items for the tv maxer context menu
Hue.generate_media_maxer_context_items = function () {
  let items = {}
  let pos = Hue.get_setting("tv_display_position")
  let nums = []

  for (let i = 1; i <= 9; i++) {
    nums.push(i * 10)
  }

  if (pos === "bottom") {
    nums = nums.reverse()
  }

  let per = Hue.get_setting("tv_display_percentage")

  for (let n of nums) {
    let class_name = ""

    if (!Hue.room_state.image_enabled && Hue.room_state.tv_enabled) {
      if (n === 100) {
        class_name = "bold bigger"
      }
    } else if (Hue.room_state.image_enabled && !Hue.room_state.tv_enabled) {
      if (n === 0) {
        class_name = "bold bigger"
      }
    } else {
      if (per === n) {
        class_name = "bold bigger"
      }
    }

    items[`per${n}`] = {
      name: `TV ${n}%`,
      callback: function (key, opt) {
        Hue.unmaximize_media()
        Hue.do_media_tv_size_change(n)
      },
      className: class_name,
    }
  }

  let obj = Object.assign(
    items, {
      def: {
        name: "Default",
        callback: function (key, opt) {
          Hue.unmaximize_media()
          Hue.set_default_tv_size()
        }
      }
    }
  )

  return obj
}

// Starts the tv maxer context menu
Hue.start_media_maxer_context_menu = function () {
  $.contextMenu({
    selector: "#media_maxer",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    className: "maxer_context",
    trigger: "left",
    build: function () {
      return {
        items: Hue.generate_media_maxer_context_items(),
      }
    },
  })
}

// Starts the room menu context menu
Hue.start_room_menu_context_menu = function () {
  $.contextMenu({
    selector: "#header_left_room_menu_icon",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    items: {
      mm0: {
        name: "About",
        callback: function (key, opt) {
          Hue.show_credits()
        },
      },
    },
  })
}

// Gets the username depending on source element to use in the username context menu
Hue.get_user_context_menu_username = function (el) {
  let username

  if ($(el).hasClass("profile_image")) {
    username = $(el).data("username")
  } else {
    username = $(el).text()
  }

  return username
}

// Starts the context menu on user elements
Hue.start_user_context_menu = function () {
  $.contextMenu({
    selector:
      ".userlist_item_username, .chat_uname, #show_profile_uname, .generic_uname, .admin_list_username, .activity_bar_text, .profile_image, .media_info_username",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    items: {
      cmwhisper: {
        name: "Whisper",
        callback: function (key, opt) {
          let username = Hue.get_user_context_menu_username(this)
          Hue.process_write_whisper(username)
        },
        visible: function (key, opt) {
          let username = Hue.get_user_context_menu_username(this)
          return Hue.user_is_online_by_username(username)
        },
      },
      cmbadge: {
        name: "Badge",
        items: {
          bheart: {
            name: "Heart",
            callback: function (key, opt) {
              let username = Hue.get_user_context_menu_username(this)
              Hue.send_badge(username, "heart")
            },
          },
          bskull: {
            name: "Skull",
            callback: function (key, opt) {
              let username = Hue.get_user_context_menu_username(this)
              Hue.send_badge(username, "skull")
            },
          },
        },
        visible: function (key, opt) {
          let username = Hue.get_user_context_menu_username(this)
          return (
            username !== Hue.username &&
            Hue.user_is_online_by_username(username)
          )
        },
      },
      cmvoice1: {
        name: "Voice 1",
        callback: function (key, opt) {
          let arg = Hue.get_user_context_menu_username(this)
          Hue.change_role(arg, "voice_1")
        },
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "voice_roles")) {
            return false
          } else {
            return true
          }
        },
      },
      cmvoice2: {
        name: "Voice 2",
        callback: function (key, opt) {
          let arg = Hue.get_user_context_menu_username(this)
          Hue.change_role(arg, "voice_2")
        },
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "voice_roles")) {
            return false
          } else {
            return true
          }
        },
      },
      cmvoice3: {
        name: "Voice 3",
        callback: function (key, opt) {
          let arg = Hue.get_user_context_menu_username(this)
          Hue.change_role(arg, "voice_3")
        },
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "voice_roles")) {
            return false
          } else {
            return true
          }
        },
      },
      cmvoice4: {
        name: "Voice 4",
        callback: function (key, opt) {
          let arg = Hue.get_user_context_menu_username(this)
          Hue.change_role(arg, "voice_4")
        },
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "voice_roles")) {
            return false
          } else {
            return true
          }
        },
      },
      cmop1: {
        name: "Op 1",
        visible: function (key, opt) {
          return Hue.role === "admin"
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.change_role(arg, "op_1")
            },
          },
        },
      },
      cmop2: {
        name: "Op 2",
        visible: function (key, opt) {
          return Hue.role === "admin"
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.change_role(arg, "op_2")
            },
          },
        },
      },
      cmop3: {
        name: "Op 3",
        visible: function (key, opt) {
          return Hue.role === "admin"
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.change_role(arg, "op_3")
            },
          },
        },
      },
      cmop4: {
        name: "Op 4",
        visible: function (key, opt) {
          return Hue.role === "admin"
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.change_role(arg, "op_4")
            },
          },
        },
      },
      cmadmin: {
        name: "Admin",
        visible: function (key, opt) {
          if (Hue.role !== "admin") {
            return false
          } else {
            return true
          }
        },
        items: {
          adminsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.change_role(arg, "admin")
            },
          },
        },
      },
      cmkick: {
        name: "Kick",
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "kick")) {
            return false
          } else {
            let username = Hue.get_user_context_menu_username(this)
            return Hue.user_is_online_by_username(username)
          }
        },
        items: {
          kicksure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.kick(arg)
            },
          },
        },
      },
      cmban: {
        name: "Ban",
        visible: function (key, opt) {
          if (!Hue.check_op_permission(Hue.role, "ban")) {
            return false
          } else {
            return true
          }
        },
        items: {
          bansure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = Hue.get_user_context_menu_username(this)
              Hue.ban(arg)
            },
          },
        },
      },
    },
  })
}

// Starts the context menu for modal and popup windows's close buttons
Hue.start_msg_close_buttons_context_menu = function () {
  $.contextMenu({
    selector: ".Msg-window-inner-x",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    items: {
      mm0: {
        name: "Close All",
        callback: function (key, opt) {
          Hue.process_msg_close_button(this)
        },
      },
    },
  })
}

// Generate the items for the chat search context menu
Hue.generate_chat_search_context_items = function () {
  let items = {}

  if (Hue.room_state.chat_searches.length === 0) {
    items.item0 = {
      name: "No searches yet",
      disabled: true,
    }
  } else {
    let n = 0

    for (let search of Hue.room_state.chat_searches) {
      items[`item_${n}`] = {
        name: search,
        callback: function (key, opt) {
          Hue.show_chat_search(search)
        },
      }

      n += 1
    }

    items["clear"] = {
      name: "- Clear Search History -",
      callback: function (key, opt) {
        Hue.clear_chat_searches()
      },
    }
  }

  return items
}

// Starts the chat search context menus
// One for the Search menu option
// One on the Search window which is triggered by a normal click
Hue.start_search_context_menus = function () {
  $.contextMenu({
    selector: "#room_menu_search",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    build: function ($trigger, e) {
      return { items: Hue.generate_chat_search_context_items() }
    },
  })

  $.contextMenu({
    selector: "#chat_search_history_icon, #footer_search_history_icon",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    trigger: "left",
    build: function ($trigger, e) {
      return { items: Hue.generate_chat_search_context_items() }
    },
  })
}
