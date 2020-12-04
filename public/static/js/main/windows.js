// Create all the Handlebars templates
Hue.setup_templates = function () {
  $(".template").each(function () {
    let id = $(this).attr("id")
    Hue[id] = Handlebars.compile($(`#${id}`).html())
  })
}

// Starts and configures all Msg modal instances
Hue.start_msg = function () {
  let common = {
    clear_editables: true,
    class: "modal",
    show_effect: "none",
    close_effect: "none",
    after_create: function (instance) {
      Hue.after_modal_create(instance)
    },
    before_show: function (instance) {
      if (Hue.screen_locked) {
        if (instance.options.id !== "lockscreen") return false
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

  let titlebar = {
    enable_titlebar: true,
    center_titlebar: true,
    titlebar_class: "!custom_titlebar",
    window_inner_x_class: "!titlebar_inner_x",
  }

  // Start the instances

  Hue.msg_main_menu = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "main_menu",
      window_width: "22rem"
    })
  )

  Hue.msg_room_menu = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "room_menu",
      window_width: "22rem",
      after_close: function (instance) {
        common.after_close(instance)
        Hue.close_togglers("room_menu")
        Hue.close_togglers("room_menu_permissions")
      },
    })
  )

  Hue.msg_user_menu = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "user_menu",
      clear_editables: false,
      window_width: "22rem",
      after_close: function (instance) {
        common.after_close(instance)
        Hue.close_togglers("user_menu")
      },
    })
  )

  Hue.msg_userlist = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "userlist",
      window_min_width: "22rem",
      window_max_width: "45rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.userlist_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.userlist_open = false
      },
    })
  )

  Hue.msg_played = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "played",
      window_width: "26rem",
    })
  )

  Hue.msg_modal_image = Msg.factory(
    Object.assign({}, common, {
      id: "modal_image",
      preset: "window",
      overlay_class: "!overlay_same_color",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.restore_modal_image()
        Hue.modal_image_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.clear_modal_image_info()
        Hue.msg_image_picker.close()
        Hue.modal_image_open = false
      },
    })
  )

  Hue.msg_lockscreen = Msg.factory(
    Object.assign({}, common, {
      id: "lockscreen",
      preset: "window",
      close_on_escape: false,
      overlay_class: "!overlay_same_color"
    })
  )

  Hue.msg_profile = Msg.factory(
    Object.assign({}, common, {
      id: "profile",
      window_width: "22rem",
      after_close: function (instance) {
        common.after_close(instance)
        $("#show_profile_username").text("Loading")
        $("#show_profile_image").attr(
          "src",
          Hue.config.profile_image_loading_url
        )
        Hue.open_profile_username = false
        Hue.open_profile_user = false
        Hue.stop_profile_audio()
      },
    })
  )

  Hue.msg_info = Msg.factory(
    Object.assign({}, common, {
      id: "info",
      window_height: "auto",
      before_show: function (instance) {
        common.before_show(instance)
        Hue.info_vars_to_false()
      },
      after_close: function (instance) {
        common.after_close(instance)
        instance.content.innerHTML = ""
        Hue.info_vars_to_false()
      },
    })
  )

  Hue.msg_info2 = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "info2",
      window_height: "auto",
      before_show: function (instance) {
        common.before_show(instance)
        Hue.info2_vars_to_false()
      },
      after_close: function (instance) {
        common.after_close(instance)
        instance.content.innerHTML = ""
        instance.titlebar.innerHTML = ""
        Hue.info2_vars_to_false()
      },
    })
  )

  Hue.msg_image_picker = Msg.factory(
    Object.assign({}, common, {
      id: "image_picker",
      window_width: "24rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.image_picker_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        $("#image_source_picker_input").val("")
        $("#image_source_picker_input_comment").val("")
        Hue.reset_media_history_filter("image")
        Hue.image_picker_open = false
      },
    })
  )

  Hue.msg_tv_picker = Msg.factory(
    Object.assign({}, common, {
      id: "tv_picker",
      window_width: "24rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.tv_picker_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        $("#tv_source_picker_input").val("")
        $("#tv_source_picker_input_comment").val("")
        Hue.reset_media_history_filter("tv")
        Hue.tv_picker_open = false
      },
    })
  )

  Hue.msg_media_menu = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "media_menu",
      window_width: "22rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.media_menu_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.media_menu_open = false
      },
    })
  )

  Hue.msg_message = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "message",
      window_width: "28rem",
      close_on_overlay_click: false,
      after_show: function (instance) {
        common.after_show(instance)
        Hue.writing_message = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        $("#write_message_area").val("")
        $("#write_message_feedback").text("")
        $("#write_message_feedback").css("display", "none")
        Hue.writing_message = false
      },
    })
  )

  Hue.msg_chat_search = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "chat_search",
      window_width: "30rem",
      after_close: function (instance) {
        common.after_close(instance)
        Hue.reset_chat_search_filter()
      },
    })
  )

  Hue.msg_highlights = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "highlights",
      window_width: "30rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.highlights_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.reset_highlights_filter()
        Hue.highlights_open = false
      },
    })
  )

  Hue.msg_locked = Msg.factory(
    Object.assign({}, common, {
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
    Object.assign({}, common, titlebar, {
      id: "settings",
      window_width: "24rem",
      after_close: function (instance) {
        common.after_close(instance)
        Hue.close_togglers("settings")
      },
    })
  )

  Hue.msg_room_status = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "room_status",
      window_width: "22rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.room_status_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.room_status_open = false
      },
    })
  )

  Hue.msg_admin_activity = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "admin_activity",
    })
  )

  Hue.msg_expand_image = Msg.factory(
    Object.assign({}, common, {
      id: "expand_image",
      preset: "window",
      overlay_class: "!overlay_same_color"
    })
  )

  Hue.msg_image_upload_comment = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "image_upload_comment",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.image_upload_comment_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        $("#image_upload_comment_input").val("")
        Hue.image_upload_comment_file = false
        Hue.image_upload_comment_type = false
        Hue.image_upload_comment_open = false
      },
    })
  )

  Hue.msg_reply = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "reply",
      window_width: "26rem",
      close_on_escape: false,
      after_show: function (instance) {
        common.after_show(instance)
        Hue.writing_reply = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.writing_reply = false
      },
    })
  )

  Hue.msg_handle_url = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "handle_url",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.handle_url_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.handle_url_open = false
      },
    })
  )

  Hue.msg_open_url = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "open_url",
      window_max_width: "40rem"
    })
  )

  Hue.msg_details = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "details",
      window_width: "22rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.details_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.details_open = false
      },
    })
  )

  Hue.msg_notifications = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "notifications",
      window_width: "26rem",
    })
  )

  Hue.msg_whispers = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "whispers",
      window_width: "26rem",
    })
  )

  Hue.msg_message_board = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "message_board",
      window_width: "30rem",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.message_board_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.message_board_open = false
      },
    })
  )

  Hue.msg_profile_image_cropper = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "profile_image_cropper",
      after_close: function (instance) {
        common.after_close(instance)
        Hue.reset_profile_image_cropper()
      },
    })
  )

  Hue.msg_confirm = Msg.factory(
    Object.assign({}, common, titlebar, {
      id: "confirm",
      after_show: function (instance) {
        common.after_show(instance)
        Hue.confirm_open = true
      },
      after_close: function (instance) {
        common.after_close(instance)
        Hue.confirm_open = false
      },
    })
  )

  // Set the templates

  Hue.msg_profile.set(
    Hue.template_profile({
      profile_image: Hue.config.profile_image_loading_url
    })
  )
  
  Hue.msg_media_menu.set(
    Hue.template_media_menu({
      percentages: Hue.template_media_percentages()
    })
  )

  Hue.msg_main_menu.set(Hue.template_main_menu())
  Hue.msg_room_menu.set(Hue.template_room_menu())
  Hue.msg_user_menu.set(Hue.template_user_menu())
  Hue.msg_userlist.set(Hue.template_userlist())
  Hue.msg_played.set(Hue.template_played())
  Hue.msg_image_picker.set(Hue.template_image_picker())
  Hue.msg_tv_picker.set(Hue.template_tv_picker())
  Hue.msg_message.set(Hue.template_message())
  Hue.msg_highlights.set(Hue.template_highlights())
  Hue.msg_chat_search.set(Hue.template_chat_search())
  Hue.msg_modal_image.set(Hue.template_modal_image())
  Hue.msg_lockscreen.set(Hue.template_lockscreen())
  Hue.msg_locked.set(Hue.template_locked_menu())
  Hue.msg_notifications.set(Hue.template_notifications())
  Hue.msg_whispers.set(Hue.template_whispers())
  Hue.msg_room_status.set(Hue.template_room_status())
  Hue.msg_admin_activity.set(Hue.template_admin_activity())
  Hue.msg_expand_image.set(Hue.template_expand_image())
  Hue.msg_image_upload_comment.set(Hue.template_image_upload_comment())
  Hue.msg_reply.set(Hue.template_reply())
  Hue.msg_handle_url.set(Hue.template_handle_url())
  Hue.msg_open_url.set(Hue.template_open_url())
  Hue.msg_details.set(Hue.template_details())
  Hue.msg_message_board.set(Hue.template_message_board())
  Hue.msg_profile_image_cropper.set(Hue.template_profile_image_cropper())
  Hue.msg_settings.set(Hue.template_settings())
  Hue.msg_confirm.set(Hue.template_confirm())

  Hue.msg_info.create()
  Hue.msg_info2.create()

  // Set the titles

  Hue.msg_highlights.set_title("Highlights")
  Hue.msg_chat_search.set_title("Chat Search")
  Hue.msg_played.set_title("Recently Played")
  Hue.msg_main_menu.set_title("Main Menu")
  Hue.msg_room_menu.set_title("Room Menu")
  Hue.msg_user_menu.set_title("User Menu")
  Hue.msg_settings.set_title("Settings")
  Hue.msg_media_menu.set_title("Media Menu")
  Hue.msg_room_status.set_title("Room Status")
  Hue.msg_admin_activity.set_title("Admin Activity")
  Hue.msg_image_upload_comment.set_title("Add a Comment")
  Hue.msg_reply.set_title("Write a Reply")
  Hue.msg_details.set_title("User Details")
  Hue.msg_notifications.set_title("Notifications")
  Hue.msg_whispers.set_title("Whispers")
  Hue.msg_handle_url.set_title("Drag n' Drop")
  Hue.msg_message_board.set_title("Message Board")
  Hue.msg_profile_image_cropper.set_title("Crop A Circle")
  Hue.msg_confirm.set_title("Confirm Action")
}

// Sets all info window variables to false
Hue.info_vars_to_false = function () {}

// Sets all info window 2 variables to false
Hue.info2_vars_to_false = function () {
  Hue.create_room_open = false
  Hue.goto_room_open = false
  Hue.open_room_open = false
  Hue.background_image_input_open = false
  Hue.admin_list_open = false
  Hue.ban_list_open = false
  Hue.change_user_username_open = false
  Hue.change_user_password_open = false
  Hue.change_user_email_open = false
}

// Starts automatic modal filters
Hue.start_modal_filters = function () {
  $(".filter_input").each(function () {
    if ($(this).data("mode") !== "manual") {
      $(this).on("input", function () {
        Hue.do_modal_filter_timer()
      })
    }
  })
}

// Focuses the filter widget of a modal
Hue.focus_modal_filter = function (instance) {
  let filter = $(`#Msg-content-${instance.options.id}`)
    .find(".filter_input")
    .eq(0)

  if (filter.length) {
    filter.focus()
  }
}

// Empties the filter of a modal and updates it
Hue.reset_modal_filter = function (instance) {
  let id = instance.options.id
  let filter = $(`#Msg-content-${id}`)
    .find(".filter_input")
    .eq(0)

  if (id === "info" || id === "info2" || filter.data("mode") === "manual") {
    return false
  }

  if (filter.length) {
    if (filter.val()) {
      filter.val("")
      Hue.do_modal_filter(id)
    }
  }
}

// This is called after a modal is created
Hue.after_modal_create = function (instance) {}

// This is called after a modal is shown
Hue.after_modal_show = function (instance) {
  Hue.active_modal = instance
  Hue.modal_open = true
  Hue.blur_input()
  Hue.focus_modal_filter(instance)
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
}

// Gets all Msg modal instances
Hue.get_modal_instances = function () {
  return Hue.msg_main_menu.higher_instances()
}

// Gets all Msg popup instances
Hue.get_popup_instances = function () {
  return Hue.msg_main_menu.lower_instances()
}

// Gets all Msg instances
Hue.get_all_msg_instances = function () {
  return Hue.msg_main_menu.instances()
}

// Checks if any Msg instance is open
Hue.any_msg_open = function () {
  return Hue.msg_main_menu.any_open()
}

// Checks if any Msg modal instance is open
Hue.any_modal_open = function () {
  return Hue.msg_main_menu.any_higher_open()
}

// Checks if any Msg popup instance is open
Hue.any_popup_open = function () {
  return Hue.msg_main_menu.any_lower_open()
}

// Gets the highest open Msg modal
Hue.get_highest_modal = function () {
  return Hue.msg_main_menu.highest_instance()
}

// Closes all Msg instances
Hue.close_all_msg = function (callback = false) {
  if (callback) {
    Hue.msg_main_menu.close_all(callback)
  } else {
    Hue.msg_main_menu.close_all()
  }
}

// Closes all Msg modal instances
Hue.close_all_modals = function (callback = false) {
  if (callback) {
    Hue.msg_main_menu.close_all_higher(callback)
  } else {
    Hue.msg_main_menu.close_all_higher()
  }
}

// Closes all Msg popup instances
Hue.close_all_popups = function (callback = false) {
  if (callback) {
    Hue.msg_main_menu.close_all_lower(callback)
  } else {
    Hue.msg_main_menu.close_all_lower()
  }
}

// Starts custom filters events
Hue.start_filters = function () {
  $("#chat_search_filter").on("input", function () {
    Hue.chat_search_timer()
  })

  $("#highlights_filter").on("input", function () {
    Hue.highlights_filter_timer()
  })

  $("#image_history_filter").on("input", function () {
    Hue.media_history_filter_timer("image")
  })

  $("#tv_history_filter").on("input", function () {
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

  let win = $(`#Msg-content-${id}`)
  let filter = win.find(".filter_input").eq(0)

  if (!filter.length) {
    return false
  }

  let value = filter.val().trim()
  let lc_value = Hue.utilz.clean_string2(value).toLowerCase()
  let items = win.find(".modal_item")
  let display

  if (!win.data("filter_display")) {
    display = items.first().css("display")
    win.data("filter_display", display)
  } else {
    display = win.data("filter_display")
  }

  if (lc_value) {
    items.each(function () {
      let item_value = $(this).text().toLowerCase()

      if (item_value.includes(lc_value)) {
        $(this).css("display", display)
      } else {
        $(this).css("display", "none")
      }
    })

    Hue[`${id}_filtered`] = true
  } else {
    items.each(function () {
      $(this).css("display", display)
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
  $(`#Msg-content-container-${id}`).scrollTop(0)
}

// Scrolls a modal window to the bottom
Hue.scroll_modal_to_bottom = function (id) {
  let container = $(`#Msg-content-container-${id}`)[0]
  container.scrollTop = container.scrollHeight
}

// Creates a Msg popup
Hue.create_popup = function (args = {}, ptype = "unset") {
  if (!args.id) {
    Hue.popup_id += 1
    args.id = `popup_${Hue.popup_id}`
  }

  let panel_size = $("#footer").height()
  let edge_padding_y = panel_size * 1.5

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
    edge_padding_y: edge_padding_y,
    edge_padding_x: 12,
    persistent: false
  }

  args = Object.assign(def_args, args)
  let popup = Msg.factory(args)
  popup.hue_type = ptype
  return popup
}

// Creates a Msg popup
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
    persistent: false
  }

  args = Object.assign(def_args, args)
  let modal = Msg.factory(args)
  modal.hue_type = ptype
  return modal
}

// Changes the state of a toggler
// If enabled, it will show the container and show a -
// If disabled it will hide the container and show a +
Hue.set_toggler = function (type, el, action = false) {
  let container = $(el).next(`.${type}_toggle_container`)
  let display = container.css("display")

  if (display === "none") {
    if (action && action !== "open") {
      return false
    }

    Hue.close_togglers(type)
    container.css("display", "block")
    $(el).html(`- ${$(el).html().trim().substring(2)}`)
    container
      .closest(".toggler_main_container")[0]
      .scrollIntoView({ block: "center" })
  } else {
    if (action && action !== "close") {
      return false
    }

    container.css("display", "none")
    $(el).html(`+ ${$(el).html().trim().substring(2)}`)
  }
}

// Setups toggler events
// Togglers are elements that when clicked reveal more elements
// They can be toggled
Hue.setup_togglers = function (type) {
  $(`.${type}_toggle`).each(function () {
    $(this).click(function () {
      Hue.set_toggler(type, this)
    })
  })
}

// Opens a toggler
Hue.open_togglers = function (type) {
  $(`.${type}_toggle`).each(function () {
    Hue.set_toggler(type, this, "open")
  })
}

// Closes a toggler
Hue.close_togglers = function (type) {
  $(`.${type}_toggle`).each(function () {
    Hue.set_toggler(type, this, "close")
  })
}

// Determines what to do after a 'close all modals' trigger
// If it comes from a modal it closes all modals
// If it comes from a popup it closes all popups
Hue.process_msg_close_button = function (button) {
  let container = $(button).closest(".Msg-container")

  if (container.hasClass("Msg-container-modal")) {
    Hue.close_all_modals()
  } else if (container.hasClass("Msg-container-popup")) {
    Hue.close_all_popups()
  }
}

// Function to apply the defined toggles between windows
Hue.process_window_toggle = function (data) {
  let highest = Hue.msg_main_menu.highest_instance()
  let current = highest.options.id
  let next_func = data[current]

  if (!current || !next_func) {
    return false
  }

  Hue[`msg_${current}`].close(function () {
    next_func()
  })
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
