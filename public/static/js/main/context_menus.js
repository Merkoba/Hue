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
          let message = $(this).closest(".message")
          let mode = message.data("mode")

          if (mode === "chat") {
            let user_id = $(this).closest(".message").data("user_id")

            if (user_id) {
              let user = Hue.get_user_by_user_id(user_id)

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
                let user = Hue.get_user_by_user_id(user_id)

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
          if (!Hue.is_admin_or_op(Hue.role)) {
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

// Starts the context menu on user elements
Hue.start_user_context_menu = function () {
  $.contextMenu({
    selector: "#show_profile_user",
    trigger: "left",
    animation: { duration: 250, hide: "fadeOut" },
    zIndex: 9000000000,
    events: Hue.context_menu_events,
    items: {
      d1: {
        name: "Voice",
        visible: function (key, opt) {
          if (!Hue.is_admin_or_op(Hue.role)) {
            return false
          } else {
            return true
          }
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = this.data("username")
              Hue.change_role(arg, "voice")
            },
          },
        },
      },
      cmop1: {
        name: "Op",
        visible: function (key, opt) {
          return Hue.role === "admin"
        },
        items: {
          opsure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = this.data("username")
              Hue.change_role(arg, "op")
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
              let arg = this.data("username")
              Hue.change_role(arg, "admin")
            },
          },
        },
      },
      cmkick: {
        name: "Kick",
        visible: function (key, opt) {
          if (!Hue.is_admin_or_op(Hue.role)) {
            return false
          } else {
            let username = this.data("username")
            return Hue.user_is_online_by_username(username)
          }
        },
        items: {
          kicksure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = this.data("username")
              Hue.kick(arg)
            },
          },
        },
      },
      cmban: {
        name: "Ban",
        visible: function (key, opt) {
          if (!Hue.is_admin_or_op(Hue.role)) {
            return false
          } else {
            return true
          }
        },
        items: {
          bansure: {
            name: "I'm Sure",
            callback: function (key, opt) {
              let arg = this.data("username")
              Hue.ban(arg)
            },
          },
        },
      },
      cmvoiced: {
        name: "---",
        visible: function (key, opt) {
          if (!Hue.is_admin_or_op(Hue.role)) {
            return true
          } else {
            return false
          }
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