// Create all the Handlebars templates
Hue.setup_templates = function () {
  Hue.els(".template").forEach(it => {
    Hue[it.id] = Handlebars.compile(Hue.el(`#${it.id}`).innerHTML)
  })
}

let msgvars = {}

msgvars.common = {
  clear_editables: true,
  class: "modal",
  show_effect: "none",
  close_effect: "none",
  before_show: function (instance) {
    if (Hue.screen_locked) {
      if (instance.options.id !== "lockscreen") {
        return false
      }
    }
  },
  after_show: function (instance) {
    Hue.after_modal_show(instance)
    Hue.after_modal_set_or_show(instance)
  },
  after_set: function (instance) {
    Hue.after_modal_set_or_show(instance)
  },
  after_close: function (instance) {
    Hue.after_modal_close(instance)
  },
}

msgvars.titlebar = {
  enable_titlebar: true,
  center_titlebar: true,
  titlebar_class: "!custom_titlebar",
  window_inner_x_class: "!titlebar_inner_x",
}

// Starts and configures all Msg modal instances
Hue.start_msg = function () {
  // Start the instances

  Hue.msg_main_menu = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "main_menu",
      window_width: "22rem"
    })
  )

  Hue.msg_room_menu = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "room_menu",
      window_width: "22rem"
    })
  )

  Hue.msg_user_menu = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "user_menu",
      clear_editables: false,
      window_width: "22rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        if (Hue.user_menu_audio) {
          Hue.user_menu_audio.pause()
        }
      }
    })
  )

  Hue.msg_userlist = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "userlist",
      window_min_width: "22rem",
      window_max_width: "45rem"
    })
  )

  Hue.msg_modal_image = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "modal_image",
      preset: "window",
      overlay_class: "!msg_background_color",
      after_show: function (instance) {
        msgvars.common.after_show(instance)
        Hue.restore_modal_image()
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.clear_modal_image_info()
      },
    })
  )

  Hue.msg_radio_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "radio_picker",
      window_width: "24rem"
    })
  )

  Hue.msg_open_radio = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "open_radio",
      window_width: "24rem"
    })
  )

  Hue.msg_lockscreen = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "lockscreen",
      preset: "window",
      close_on_escape: false,
      overlay_class: "!msg_background_color"
    })
  )

  Hue.msg_profile = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "profile",
      window_width: "22rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#show_profile_username").textContent = "Loading"
        Hue.el("#show_profilepic").src = Hue.config.profilepic_loading_url
        Hue.open_profile_username = false
        Hue.open_profile_user = false
        Hue.stop_audioclip()
      },
    })
  )

  Hue.msg_info = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "info",
      window_height: "auto",
      before_show: function (instance) {
        msgvars.common.before_show(instance)
        Hue.info_vars_to_false()
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        instance.content.innerHTML = ""
        Hue.info_vars_to_false()
      },
    })
  )

  Hue.msg_info2 = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "info2",
      window_height: "auto",
      before_show: function (instance) {
        msgvars.common.before_show(instance)
        Hue.info2_vars_to_false()
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        instance.content.innerHTML = ""
        instance.titlebar.innerHTML = ""
        Hue.info2_vars_to_false()
      },
    })
  )

  Hue.msg_image_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "image_picker",
      window_width: "24rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#image_source_picker_input").value = ""
        Hue.el("#image_source_picker_input_comment").value = ""
        Hue.reset_media_history_filter("image")
      },
    })
  )

  Hue.msg_tv_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "tv_picker",
      window_width: "24rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#tv_source_picker_input").value = ""
        Hue.el("#tv_source_picker_input_comment").value = ""
        Hue.reset_media_history_filter("tv")
      },
    })
  )

  Hue.msg_media_menu = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "media_menu",
      window_width: "22rem"
    })
  )

  Hue.msg_message = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "message",
      window_width: "28rem",
      after_show: function (instance) {
        msgvars.common.after_show(instance)
        Hue.writing_message = true
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.writing_message = false
      },
    })
  )

  Hue.msg_chat_search = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "chat_search",
      window_width: "30rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.reset_chat_search_filter()
      },
    })
  )

  Hue.msg_locked = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "locked",
      closeable: false,
      window_x: "none",
      show_effect: "none",
      close_effect: "none",
      enable_overlay: true,
      window_class: "!no_effects",
    })
  )

  Hue.msg_settings = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "settings",
      window_width: "24rem"
    })
  )

  Hue.msg_admin_activity = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "admin_activity",
    })
  )

  Hue.msg_expand_image = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "expand_image",
      preset: "window",
      overlay_class: "!msg_background_color"
    })
  )

  Hue.msg_image_upload_comment = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "image_upload_comment",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#image_upload_comment_input").value = ""
        Hue.image_upload_comment_file = false
        Hue.image_upload_comment_type = false
      },
    })
  )

  Hue.msg_tv_upload_comment = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "tv_upload_comment",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#tv_upload_comment_input").value = ""
        Hue.tv_upload_comment_file = false
        Hue.tv_upload_comment_type = false
      },
    })
  )  

  Hue.msg_reply = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "reply",
      window_width: "26rem",
      after_show: function (instance) {
        msgvars.common.after_show(instance)
        Hue.writing_reply = true
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.writing_reply = false
      },
    })
  )

  Hue.msg_handle_url = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "handle_url"
    })
  )

  Hue.msg_open_url = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "open_url",
      window_max_width: "50rem"
    })
  )

  Hue.msg_view_text = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "view_text",
      window_max_width: "40rem"
    })
  )  

  Hue.msg_notifications = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "notifications",
      window_width: "26rem",
    })
  )

  Hue.msg_whispers = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "whispers",
      window_width: "26rem",
    })
  )

  Hue.msg_message_board = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "message_board",
      window_width: "30rem"
    })
  )

  Hue.msg_profilepic_cropper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "profilepic_cropper",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
      }
    })
  )

  Hue.msg_confirm = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "confirm"
    })
  )

  Hue.msg_draw_image = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar,{
      id: "draw_image",
      after_show: function(instance){
        msgvars.common.after_show(instance)
        Hue.draw_image_open = true
      },
      after_close: function(instance){
        msgvars.common.after_close(instance)
        Hue.draw_image_open = false
      }
    })
  )

  // Set the templates

  Hue.msg_profile.set(
    Hue.template_profile({
      profilepic: Hue.config.profilepic_loading_url
    })
  )
  
  Hue.msg_media_menu.set(
    Hue.template_media_menu({
      percentages: Hue.create_media_percentages()
    })
  )

  Hue.msg_main_menu.set(Hue.template_main_menu())
  Hue.msg_room_menu.set(Hue.template_room_menu())
  Hue.msg_user_menu.set(Hue.template_user_menu())
  Hue.msg_userlist.set(Hue.template_userlist())
  Hue.msg_image_picker.set(Hue.template_image_picker())
  Hue.msg_tv_picker.set(Hue.template_tv_picker())
  Hue.msg_message.set(Hue.template_message())
  Hue.msg_chat_search.set(Hue.template_chat_search())
  Hue.msg_modal_image.set(Hue.template_modal_image())
  Hue.msg_lockscreen.set(Hue.template_lockscreen())
  Hue.msg_locked.set(Hue.template_locked_menu())
  Hue.msg_notifications.set(Hue.template_notifications())
  Hue.msg_whispers.set(Hue.template_whispers())
  Hue.msg_admin_activity.set(Hue.template_admin_activity())
  Hue.msg_expand_image.set(Hue.template_expand_image())
  Hue.msg_image_upload_comment.set(Hue.template_image_upload_comment())
  Hue.msg_tv_upload_comment.set(Hue.template_tv_upload_comment())
  Hue.msg_reply.set(Hue.template_reply())
  Hue.msg_handle_url.set(Hue.template_handle_url())
  Hue.msg_open_url.set(Hue.template_open_url())
  Hue.msg_view_text.set(Hue.template_view_text())
  Hue.msg_message_board.set(Hue.template_message_board())
  Hue.msg_profilepic_cropper.set(Hue.template_profilepic_cropper())
  Hue.msg_settings.set(Hue.template_settings())
  Hue.msg_confirm.set(Hue.template_confirm())
  Hue.msg_draw_image.set(Hue.template_draw_image())
  Hue.msg_open_radio.set(Hue.template_open_radio())
  Hue.msg_radio_picker.set(Hue.template_radio_picker())

  Hue.msg_info.create()
  Hue.msg_info2.create()

  // Set the titles

  Hue.msg_chat_search.set_title("Chat Search")
  Hue.msg_main_menu.set_title("Main Menu")
  Hue.msg_room_menu.set_title("Room Menu")
  Hue.msg_user_menu.set_title("User Menu")
  Hue.msg_settings.set_title("Settings")
  Hue.msg_media_menu.set_title("Media Menu")
  Hue.msg_admin_activity.set_title("Admin Activity")
  Hue.msg_image_upload_comment.set_title("Add a Comment")
  Hue.msg_tv_upload_comment.set_title("Add a Comment")
  Hue.msg_reply.set_title("Write a Reply")
  Hue.msg_notifications.set_title("Notifications")
  Hue.msg_whispers.set_title("Whispers")
  Hue.msg_message_board.set_title("Message Board")
  Hue.msg_profilepic_cropper.set_title("Crop A Circle")
  Hue.msg_confirm.set_title("Confirm Action")
  Hue.msg_draw_image.set_title("Draw an Image")
  Hue.msg_image_picker.set_title("Image")
  Hue.msg_tv_picker.set_title("TV")
  Hue.msg_radio_picker.set_title("Radio")
  Hue.msg_open_radio.set_title("Open Radio")
}

// Sets all info window variables to false
Hue.info_vars_to_false = function () {}

// Sets all info window 2 variables to false
Hue.info2_vars_to_false = function () {
  Hue.goto_room_open = false
  Hue.open_room_open = false
  Hue.background_input_open = false
  Hue.admin_list_open = false
  Hue.ban_list_open = false
  Hue.change_user_username_open = false
  Hue.change_user_password_open = false
}

// Starts automatic modal filters
Hue.start_modal_filters = function () {
  Hue.els(".filter_input").forEach(it => {
    if (it.dataset.mode !== "manual") {
      it.addEventListener("input", function () {
        Hue.do_modal_filter_timer()
      })
    }
  })
}

// Focuses the filter widget of a modal
Hue.focus_modal_filter = function (instance) {
  let filter = Hue.el(`#Msg-content-${instance.options.id} .filter_input`)

  if (filter) {
    filter.focus()
  }
}

// Empties the filter of a modal and updates it
Hue.reset_modal_filter = function (instance) {
  let id = instance.options.id
  let filter = Hue.el(`#Msg-content-${id} .filter_input`)

  if (filter) {
    if (id === "info" || id === "info2" || filter.dataset.mode === "manual") {
      return false
    }

    if (filter.value) {
      filter.value = ""
      Hue.do_modal_filter(id)
    }
  }
}

// This is called after a modal is shown
Hue.after_modal_show = function (instance) {
  Hue.active_modal = instance
  Hue.modal_open = true
  Hue.blur_input()
  Hue.focus_modal_filter(instance)

  if (Hue.editing_message) {
    Hue.stop_edit_message()
  }
}

// This is called after a modal is set or shown
Hue.after_modal_set_or_show = function (instance) {
  setTimeout(function () {
    instance.content_container.scrollTop = 0
  }, 100)
}

// This is called after a modal is closed
Hue.after_modal_close = function (instance) {
  if (!Hue.any_modal_open()) {
    Hue.active_modal = false
    Hue.modal_open = false
    Hue.focus_input()
  } else {
    Hue.active_modal = Hue.get_highest_modal()
  }

  Hue.reset_modal_filter(instance)

  if (Hue.editing_message) {
    Hue.stop_edit_message()
  }
}

// Gets all normal Msg instances
Hue.get_modal_instances = function () {
  return Hue.msg_main_menu.higher_instances()
}

// Gets all Msg popup instances excluding radio popups
Hue.get_popup_instances = function () {
  let popups = []

  for (let instance of Hue.msg_main_menu.lower_instances()) {
    if (!Hue.is_radio_popup(instance)) {
      popups.push(instance)
    }
  }

  return popups
}

// Checks if any Msg modal instance is open
Hue.any_modal_open = function () {
  for (let instance of Hue.get_modal_instances()) {
    if (instance.is_open()) {
      return true
    }
  }

  return false
}

// Gets the highest open Msg modal
Hue.get_highest_modal = function () {
  return Hue.msg_main_menu.highest_instance()
}

// Closes all Msg modal instances
Hue.close_all_modals = function () {
  for (let instance of Hue.get_modal_instances()) {
    instance.close()
  }
}

// Closes all Msg popup instances
Hue.close_all_popups = function (callback = false) {
  for (let instance of Hue.get_popup_instances()) {
    instance.close()
  }
}

// Starts custom filters events
Hue.start_filters = function () {
  Hue.el("#chat_search_filter").addEventListener("input", function () {
    Hue.chat_search_timer()
  })

  Hue.el("#image_history_filter").addEventListener("input", function () {
    Hue.media_history_filter_timer("image")
  })

  Hue.el("#tv_history_filter").addEventListener("input", function () {
    Hue.media_history_filter_timer("tv")
  })
}

// Filter action for normal filter windows
Hue.do_modal_filter = function (id = false) {
  if (!id) {
    if (!Hue.active_modal) {
      return false
    }

    id = Hue.active_modal.options.id
  }

  let win = Hue.el(`#Msg-content-${id}`)
  let filter = Hue.el(".filter_input", win)
  let value = filter.value.trim()
  let lc_value = Hue.utilz.clean_string2(value).toLowerCase()
  let items = Hue.els(".modal_item", win)

  if (lc_value && items.length) {
    items.forEach(it => {
      let item_value = it.textContent.toLowerCase()

      if (item_value.includes(lc_value)) {
        it.classList.remove("nodisplay")
      } else {
        it.classList.add("nodisplay")
      }
    })

    Hue[`${id}_filtered`] = true
  } else {
    items.forEach(it => {
      it.classList.remove("nodisplay")
    })

    Hue[`${id}_filtered`] = false
  }

  Hue.scroll_modal_to_top(id)

  if (Hue[`after_${id}_filtered`]) {
    Hue[`after_${id}_filtered`]()
  }
}

// Scrolls a modal window to the top
Hue.scroll_modal_to_top = function (id) {
  Hue.el(`#Msg-content-container-${id}`).scrollTop = 0
}

// Scrolls a modal window to the bottom
Hue.scroll_modal_to_bottom = function (id) {
  let container = Hue.el(`#Msg-content-container-${id}`)
  container.scrollTop = container.scrollHeight
}

// Creates a Msg popup
Hue.create_popup = function (args = {}, ptype = "unset") {
  if (!args.id) {
    Hue.popup_id += 1
    args.id = `popup_${Hue.popup_id}`
  }

  let def_args = {
    preset: "popup",
    class: "popup",
    position: "top",
    clear_editables: true,
    show_effect: "none",
    close_effect: "none",
    window_class: "!custom_popup",
    enable_titlebar: true,
    center_titlebar: true,
    titlebar_class: "!custom_titlebar",
    window_inner_x_class: "!titlebar_inner_x",
    edge_padding_y: Hue.panel_height * 1.5,
    edge_padding_x: 12,
    remove_after_close: true
  }

  args = Object.assign(def_args, args)
  let popup = Msg.factory(args)
  popup.hue_type = ptype
  return popup
}

// Creates a Msg modal
Hue.create_modal = function (args = {}, ptype = "unset") {
  if (!args.id) {
    Hue.modal_id += 1
    args.id = `modal_${Hue.modal_id}`
  }

  let def_args = {
    class: "modal",
    clear_editables: true,
    show_effect: "none",
    close_effect: "none",
    enable_titlebar: true,
    center_titlebar: true,
    titlebar_class: "!custom_titlebar",
    window_inner_x_class: "!titlebar_inner_x",
    remove_after_close: true
  }

  args = Object.assign(def_args, args)
  let modal = Msg.factory(args)
  modal.hue_type = ptype
  return modal
}

// Determines what to do after a 'close all modals' trigger
// If it comes from a modal it closes all modals
// If it comes from a popup it closes all popups
Hue.process_msg_close_button = function (button) {
  let container = button.closest(".Msg-container")

  if (container.classList.contains("Msg-container-modal")) {
    Hue.close_all_modals()
  } else if (container.classList.contains("Msg-container-popup")) {
    Hue.close_all_popups()
  }
}

// Makes action popups like for file upload progress
Hue.show_action_popup = function (args = {}) {
  let def_args = {
    id: false,
    message: "",
    icon: "",
    title: "",
    on_click: false,
    after_close: function () {},
    autoclose: true,
  }

  args = Object.assign(def_args, args)

  let on_click = function () {}

  if (args.on_click) {
    on_click = function (instance) {
      instance.close()
      args.on_click()
    }
  }

  let obj = {
    position: "bottomright",
    enable_titlebar: true,
    window_x: "inner_right",
    content_class: "!action_popup",
    window_width: "auto",
    on_click: on_click,
    after_close: args.after_close,
    close_on_escape: false,
    autoclose: args.autoclose,
    autoclose_delay: 5000,
  }

  if (!args.title) {
    args.title = "Action"
  }

  if (args.id) {
    obj.id = args.id
  }

  let popup = Hue.create_popup(obj)

  let classes = ""

  if (args.on_click) {
    classes = "action"
  }

  let icon = ""

  if (args.icon) {
    icon = Hue.get_icon(args.icon, "action_popup_icon")
  }

  let html = `<div class='action_popup_item ${classes}'>${icon}<div class='action_popup_message'>${Hue.utilz.make_html_safe(
    args.message
  )}</div></div>`

  popup.show([args.title, html])
  return popup
}

// Get the first visible item in a filtered container
Hue.get_first_visible_modal_item = function (id) {
  let items = Hue.els(`#${id} .modal_item`)
  
  for (let item of items) {
    if (!item.classList.contains("nodisplay")) {
      return item
    }
  }
}

// Create radio window
Hue.create_radio_window = function () {
  return Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      preset: "window",
      enable_overlay: false,
      class: "radio",
      window_class: "radio !radio_window !transparent_background",
      content_container_class: "radio !msg_background_color",
      titlebar_class: "radio !radio_titlebar",
      after_show: function (instance) {
        Hue.after_modal_show(instance)
        Hue.after_modal_set_or_show(instance)
        Hue.active_radio = instance
        Hue.create_radio_popup(instance)
        Hue.start_radio_metadata_loop()
        instance.hue_last_open = Date.now()
      },
      after_close: function (instance) {     
        Hue.after_modal_close(instance)
        Hue.remove_alert_title()
        Hue.stop_radio_metadata_loop()
      },
      after_destroy: function (instance) {
        if (instance.hue_radio_popup) {
          instance.hue_radio_popup.close()
        }

        instance.remove()
      }
    })
  )
}

// Small popup for a minimized radio
Hue.create_radio_popup = function (win) {
  if (!Hue.radio_popups_visible) {
    return
  }

  if (win.hue_radio_popup) {
    return
  }

  let obj = {}
  obj.class = "radio_popup"
  obj.window_class = "radio_popup !radio_popup_window"
  obj.enable_titlebar = false
  obj.window_x = "floating_right"
  obj.position = "bottomright"
  obj.window_width = "12rem"
  obj.disable_content_padding = true
  obj.close_on_escape = false

  obj.on_x_button_click = function () {
    Hue.remove_radio(win)
  }

  obj.on_wheel_down = function () {
    Hue.change_media_radio_volume(win, "down")
  }

  obj.on_wheel_up = function () {
    Hue.change_media_radio_volume(win, "up")
  }

  p = Hue.create_popup(obj)
  p.set(Hue.template_radio_popup())
  win.hue_radio_popup = p

  let container = Hue.el(".radio_popup_container", p.content)
  container.title = win.hue_radio_url

  let icon = Hue.el(".radio_popup_icon", p.content)
  jdenticon.update(icon, win.hue_radio_name)
  
  let name = Hue.el(".radio_popup_name", p.content)
  name.textContent = win.hue_radio_name
  
  p.window.addEventListener("click", function (e) {
    if (e.target.closest(".radio_popup_icon_container")) {
      win.show()
    } else {
      Hue.check_radio_media(win)
    }
  })

  Hue.radio_playing(win)
  p.show()
}

// Small an radio with a certain purpose
Hue.create_radio_utility = function (name, on_click) {
  if (!Hue.radio_popups_visible) {
    return
  }

  let obj = {}
  obj.class = "radio_popup"
  obj.window_class = "radio_popup !radio_popup_window"
  obj.enable_titlebar = false
  obj.window_x = "none"
  obj.position = "bottomright"
  obj.window_width = "12rem"
  obj.disable_content_padding = true
  obj.close_on_escape = false
  obj.remove_after_close = false

  obj.on_click = function () {
    on_click()
  }

  p = Hue.create_popup(obj)
  p.set(Hue.template_radio_popup())
  jdenticon.update(Hue.el(".radio_popup_icon", p.content), name)
  Hue.el(".radio_popup_name", p.content).textContent = name

  return p
}