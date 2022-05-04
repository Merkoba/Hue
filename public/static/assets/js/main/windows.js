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
  window_x: "none",
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
  titlebar_class: "!custom_titlebar"
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

  Hue.msg_room_config = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "room_config",
      window_width: "22rem"
    })
  )

  Hue.msg_background_select = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "background_select"
    })
  )

  Hue.msg_profilepic_select = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "profilepic_select"
    })
  )

  Hue.msg_audioclip_select = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "audioclip_select",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.stop_audioclip()
      }
    })
  )

  Hue.msg_link_background = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "link_background"
    })
  )

  Hue.msg_admin_list = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "admin_list"
    })
  )

  Hue.msg_ban_list = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "ban_list"
    })
  )

  Hue.msg_open_room = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "open_room"
    })
  )

  Hue.msg_roomlist = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "roomlist",
      window_width: "22rem"
    })
  )

  Hue.msg_user_profile = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "user_profile",
      clear_editables: false,
      window_width: "22rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        if (Hue.user_profile_audio) {
          Hue.user_profile_audio.pause()
        }
      }
    })
  )

  Hue.msg_userlist = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "userlist",
      window_max_width: "40rem"
    })
  )

  Hue.msg_modal_image = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "modal_image",
      preset: "window",
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

  Hue.msg_profile = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "profile",
      window_width: "22rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#show_profile_profilepic").src = Hue.config.profilepic_loading_url
        Hue.open_profile_username = false
        Hue.open_profile_user_id = false
        Hue.open_profile_user = false
        Hue.stop_audioclip()
      },
    })
  )

  Hue.msg_change_role = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "change_role"
    })
  )

  Hue.msg_change_username = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "change_username"
    })
  )

  Hue.msg_change_password = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "change_password"
    })
  )

  Hue.msg_info_autoclose = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "info_autoclose",
      window_height: "auto",
      enable_progressbar: true,
      bind_progressbar_to_autoclose: true,
      autoclose: true,
      autoclose_delay: 3000
    })
  )

  Hue.msg_info = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "info",
      window_height: "auto",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        instance.content.innerHTML = ""
        instance.titlebar.innerHTML = ""
      },
    })
  )

  Hue.msg_image_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "image_picker",
      content_class: "!media_picker_content"
    })
  )

  Hue.msg_link_image = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "link_image",
      after_show: function (instance) {
        msgvars.common.after_show(instance)
        Hue.el("#link_image_input").focus()
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#link_image_input").value = ""
        Hue.el("#link_image_comment").value = ""
      },
    })
  )

  Hue.msg_tv_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "tv_picker",
      content_class: "!media_picker_content"
    })
  )

  Hue.msg_link_tv = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "link_tv",
      after_show: function (instance) {
        msgvars.common.after_show(instance)
        Hue.el("#link_tv_input").focus()
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#link_tv_input").value = ""
        Hue.el("#link_tv_comment").value = ""
      },
    })
  )

  Hue.msg_media_tweaks = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "media_tweaks"
    })
  )

  Hue.msg_screen_capture_options = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "screen_capture_options"
    })
  )

  Hue.msg_command_book = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "command_book",
      window_width: "36rem"
    })
  )

  Hue.msg_write_whisper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "write_whisper",
      window_width: "30rem"
    })
  )

  Hue.msg_show_whisper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "show_whisper",
      window_width: "30rem"
    })
  )

  Hue.msg_chat_search = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "chat_search",
      window_width: "38rem",
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
      show_effect: "none",
      close_effect: "none",
      enable_overlay: true,
      window_class: "!no_effects",
    })
  )

  Hue.msg_radio_window = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      window_class: "radio !radio_window",
      window_width: "36rem",
      after_close: function (instance) {     
        Hue.after_modal_close(instance)
        Hue.stop_radio_metadata_loop()
      }
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

  Hue.msg_view_image = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: "view_image",
      preset: "window",
      after_show: function (instance) {
        msgvars.common.after_show(instance)
        Hue.restore_view_image()
      },
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.clear_view_image_info()
      },
    })
  )

  Hue.msg_image_upload_comment = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "image_upload_comment",
      scroll_on_show: false,
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#image_upload_comment_input").value = ""
        Hue.image_upload_comment_file = undefined
        Hue.image_upload_comment_type = undefined
        Hue.upload_media = undefined
      },
    })
  )

  Hue.msg_tv_upload_comment = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "tv_upload_comment",
      scroll_on_show: false,
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.el("#tv_upload_comment_input").value = ""
        Hue.el("#tv_upload_comment_video_preview").pause()
        Hue.el("#tv_upload_comment_video_preview").src = ""
        Hue.tv_upload_comment_file = undefined
        Hue.tv_upload_comment_type = undefined
        Hue.upload_media = undefined
      },
    })
  )  

  Hue.msg_reply = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "reply",
      window_width: "30rem",
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
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "handle_url"
    })
  )

  Hue.msg_handle_radio_history = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "handle_radio_history"
    })
  )

  Hue.msg_delete_messages = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "delete_messages"
    })
  )

  Hue.msg_open_url = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "open_url",
      window_max_width: "40rem"
    })
  )

  Hue.msg_view_text = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "view_text",
      window_max_width: "40rem"
    })
  )  

  Hue.msg_notifications = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "notifications",
      window_width: "30rem",
    })
  )

  Hue.msg_whispers = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "whispers",
      window_width: "30rem",
    })
  )

  Hue.msg_message_board = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "message_board",
      window_width: "38rem",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.do_message_board_edit(false)
      }
    })
  )

  Hue.msg_profilepic_cropper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "profilepic_cropper",
      scroll_on_show: false
    })
  )

  Hue.msg_confirm = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "confirm",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.on_confirm_cancel()
      }
    })
  )

  Hue.msg_theme_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "theme_picker",
      after_close: function (instance) {
        msgvars.common.after_close(instance)
        Hue.apply_selected_theme()
      }
    })
  )

  Hue.msg_profilepic_preview = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: "profilepic_preview"
    })
  )

  Hue.msg_draw_image = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar,{
      id: "draw_image"
    })
  )

  // Set the templates

  Hue.msg_profile.set(
    Hue.template_profile({
      profilepic: Hue.config.profilepic_loading_url
    })
  )
  
  Hue.msg_media_tweaks.set(
    Hue.template_media_tweaks({
      percentages: Hue.create_tweaks_percentages("tv"),
      chat_font_sizes: Hue.create_tweaks_chat_font_sizes()
    })
  )

  Hue.msg_chat_search.set(
    Hue.template_chat_search({
      window_controls: Hue.template_window_controls({
        filter_mode: "manual",
        filter_id: "chat_search_filter",
        filter_placeholder: "Chat Search"
      })
    })
  )
  
  Hue.msg_message_board.set(
    Hue.template_message_board({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "message_board_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_admin_activity.set(
    Hue.template_admin_activity({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "admin_activity_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_command_book.set(
    Hue.template_command_book({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "command_book_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_notifications.set(
    Hue.template_notifications({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "notifications_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_radio_window.set(
    Hue.template_radio_window({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "radio_history_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_roomlist.set(
    Hue.template_roomlist({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "roomlist_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_settings.set(
    Hue.template_settings({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "settings_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_userlist.set(
    Hue.template_userlist({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "userlist_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_whispers.set(
    Hue.template_whispers({
      window_controls: Hue.template_window_controls({
        filter_mode: "auto",
        filter_id: "whispers_filter",
        filter_placeholder: "Filter"
      })
    })
  )

  Hue.msg_screen_capture_options.set(
    Hue.template_screen_capture_options({
      durations: Hue.config.screen_capture_durations
    })
  )

  Hue.msg_main_menu.set(Hue.template_main_menu())
  Hue.msg_room_config.set(Hue.template_room_config())
  Hue.msg_background_select.set(Hue.template_background_select())
  Hue.msg_profilepic_select.set(Hue.template_profilepic_select())
  Hue.msg_audioclip_select.set(Hue.template_audioclip_select())
  Hue.msg_link_background.set(Hue.template_link_background())
  Hue.msg_admin_list.set(Hue.template_admin_list())
  Hue.msg_ban_list.set(Hue.template_ban_list())
  Hue.msg_open_room.set(Hue.template_open_room())
  Hue.msg_user_profile.set(Hue.template_user_profile())
  Hue.msg_link_image.set(Hue.template_link_image())
  Hue.msg_link_tv.set(Hue.template_link_tv())
  Hue.msg_write_whisper.set(Hue.template_write_whisper())
  Hue.msg_show_whisper.set(Hue.template_show_whisper())
  Hue.msg_modal_image.set(Hue.template_modal_image())
  Hue.msg_locked.set(Hue.template_locked_menu())
  Hue.msg_view_image.set(Hue.template_view_image())
  Hue.msg_image_upload_comment.set(Hue.template_image_upload_comment())
  Hue.msg_tv_upload_comment.set(Hue.template_tv_upload_comment())
  Hue.msg_reply.set(Hue.template_reply())
  Hue.msg_handle_url.set(Hue.template_handle_url())
  Hue.msg_handle_radio_history.set(Hue.template_handle_radio_history())
  Hue.msg_delete_messages.set(Hue.template_delete_messages())
  Hue.msg_open_url.set(Hue.template_open_url())
  Hue.msg_view_text.set(Hue.template_view_text())
  Hue.msg_profilepic_cropper.set(Hue.template_profilepic_cropper())
  Hue.msg_change_role.set(Hue.template_change_role())
  Hue.msg_change_username.set(Hue.template_change_username())
  Hue.msg_change_password.set(Hue.template_change_password())
  Hue.msg_confirm.set(Hue.template_confirm())
  Hue.msg_theme_picker.set(Hue.template_theme_picker())
  Hue.msg_profilepic_preview.set(Hue.template_profilepic_preview())
  Hue.msg_draw_image.set(Hue.template_draw_image())
  Hue.msg_image_picker.set(Hue.template_image_picker())
  Hue.msg_tv_picker.set(Hue.template_tv_picker())

  Hue.msg_info.create()
  Hue.msg_info_autoclose.create()

  // Set the titles

  Hue.msg_chat_search.set_title(Hue.template_titlebar({
    items: [
      {id: "chat_search_highlights", text: "Highlights"},
      {id: "chat_search_links", text: "Links"},
      {id: "chat_search_user", text: "User"},
      {id: "chat_search_image", text: "Image"},
      {id: "chat_search_tv", text: "TV"},
    ]
  }))

  Hue.msg_theme_picker.set_title(Hue.template_titlebar({
    items: [
      {id: "theme_picker_random", text: "Random"},
      {id: "theme_picker_peek", text: "Peek"},
    ]
  }))

  Hue.msg_profilepic_preview.set_title(Hue.template_titlebar({
    items: [
      {id: "profilepic_preview_choose", text: "Re-Choose"},
      {id: "profilepic_preview_confirm", text: "Confirm"},
    ]
  }))

  Hue.msg_view_text.set_title(Hue.template_titlebar({
    items: [
      {id: "view_text_copy", text: "Copy To Clipboard"},
    ]
  }))

  Hue.msg_message_board.set_title(Hue.template_titlebar({
    items: [
      {id: "message_board_publish", text: "Publish"},
      {id: "message_board_links", text: "Links"},
      {id: "message_board_user", text: "User"},
    ]
  }))

  Hue.msg_link_image.set_title(Hue.template_titlebar({
    items: [
      {id: "link_image_submit", text: "Link Image"},
    ]
  }))

  Hue.msg_link_tv.set_title(Hue.template_titlebar({
    items: [
      {id: "link_tv_submit", text: "Link TV"},
    ]
  }))

  Hue.msg_draw_image.set_title(Hue.template_titlebar({
    items: [
      {id: "draw_image_undo", text: "Undo"},
      {id: "draw_image_redo", text: "Redo"},
      {id: "draw_image_clear", text: "Clear"},
      {id: "draw_image_upload", text: "Upload"},
    ]
  }))

  Hue.msg_change_username.set_title(Hue.template_titlebar({
    items: [
      {id: "change_username_submit", text: "Change Username"},
    ]
  }))

  Hue.msg_change_password.set_title(Hue.template_titlebar({
    items: [
      {id: "change_password_submit", text: "Change Password"},
    ]
  }))

  Hue.msg_write_whisper.set_title(Hue.template_titlebar({
    items: [
      {id: "write_whisper_add_user", text: "Add"},
      {id: "write_whisper_send", text: "Send"},
    ]
  }))

  Hue.msg_show_whisper.set_title(Hue.template_titlebar({
    items: [
      {id: "show_whisper_write", text: ""},
    ]
  }))

  Hue.msg_whispers.set_title(Hue.template_titlebar({
    items: [
      {id: "start_write_whisper", text: "New Whisper"},
      {id: "whispers_clear", text: "Clear Window"},
    ]
  }))

  Hue.msg_profilepic_cropper.set_title(Hue.template_titlebar({
    items: [
      {id: "profilepic_cropper_change", text: ""},
      {id: "profilepic_cropper_crop", text: "Crop Circle"},
    ]
  }))

  Hue.msg_image_upload_comment.set_title(Hue.template_titlebar({
    items: [
      {id: "image_upload_comment_change", text: ""},
      {id: "image_upload_comment_submit", text: "Upload Image"},
    ]
  }))

  Hue.msg_tv_upload_comment.set_title(Hue.template_titlebar({
    items: [
      {id: "tv_upload_comment_change", text: ""},
      {id: "tv_upload_comment_submit", text: "Upload TV"},
    ]
  }))

  Hue.msg_link_background.set_title(Hue.template_titlebar({
    items: [
      {id: "link_background_submit", text: "Link Background"},
    ]
  }))

  Hue.msg_reply.set_title(Hue.template_titlebar({
    items: [
      {id: "reply_submit", text: "Send Reply"},
    ]
  }))

  Hue.msg_confirm.set_title(Hue.template_titlebar({
    items: [
      {id: "confirm_button_confirm", text: "Confirm"},
    ]
  }))

  Hue.msg_open_room.set_title(Hue.template_titlebar({
    items: [
      {id: "open_room_here", text: "Open Here"},
      {id: "open_room_new_tab", text: "New Tab"},
    ]
  }))

  Hue.msg_open_url.set_title(Hue.template_titlebar({
    items: [
      {id: "open_url_menu_view_url", text: "URL"},
      {id: "open_url_menu_view_title", text: "Title"},
      {id: "open_url_menu_view_comment", text: "Comment"},
      {id: "open_url_menu_load", text: "Load"},
      {id: "open_url_menu_link", text: "Link"},
      {id: "open_url_menu_jump", text: "Jump"},
    ],
    container_id: "open_url_container"
  }))

  Hue.msg_handle_url.set_title(Hue.template_titlebar({
    items: [
      {id: "handle_url_chat", text: "Send To Chat"},
      {id: "handle_url_image", text: "Change Image"},
      {id: "handle_url_tv", text: "Change TV"},
    ],
    container_id: "handle_url_container"
  }))

  Hue.msg_delete_messages.set_title(Hue.template_titlebar({
    items: [
      {id: "delete_messages_one", text: "One"},
      {id: "delete_messages_group", text: "Group"},
      {id: "delete_messages_above", text: "Above"},
      {id: "delete_messages_below", text: "Below"},
    ],
    container_id: "delete_messages_container"
  }))

  Hue.msg_profilepic_select.set_title(Hue.template_titlebar({
    items: [
      {id: "profilepic_select_upload", text: "Upload"},
      {id: "profilepic_select_draw", text: "Draw"},
      {id: "profilepic_select_random", text: "Random"},
    ]
  }))

  Hue.msg_image_picker.set_title(Hue.template_titlebar({
    items: [
      {id: "image_picker_link", text: "Link"},
      {id: "image_picker_upload", text: "Upload"},
      {id: "image_picker_draw", text: "Draw"},
      {id: "image_picker_random", text: "Random"},
      {id: "image_picker_screenshot", text: "Screenshot"},
    ]
  }))

  Hue.msg_tv_picker.set_title(Hue.template_titlebar({
    items: [
      {id: "tv_picker_link", text: "Link"},
      {id: "tv_picker_upload", text: "Upload"},
      {id: "tv_picker_capture", text: "Capture"},
    ]
  }))

  Hue.msg_background_select.set_title(Hue.template_titlebar({
    items: [
      {id: "background_select_link", text: "Link"},
      {id: "background_select_upload", text: "Upload"},
      {id: "background_select_draw", text: "Draw"},
      {id: "background_select_random", text: "Random"},
      {id: "background_select_remove", text: "Remove"},
    ]
  }))

  Hue.msg_audioclip_select.set_title(Hue.template_titlebar({
    items: [
      {id: "play_audioclip", text: "Play"},
      {id: "upload_audioclip", text: "Upload"},
      {id: "remove_audioclip", text: "Remove"},
    ]
  }))

  Hue.msg_handle_radio_history.set_title(Hue.template_titlebar({
    items: [
      {id: "handle_radio_history_copy", text: "Copy To Clipboard"},
      {id: "handle_radio_history_search", text: "Search YouTube"},
    ]
  }))

  Hue.msg_media_tweaks.set_title(Hue.template_titlebar({
    items: [
      {id: "media_tweaks_swap", text: "Swap"},
      {id: "media_tweaks_rotate", text: "Rotate"},
      {id: "media_tweaks_revolve", text: "Revolve"},
      {id: "media_tweaks_defaults", text: "Defaults"},
    ]
  }))

  Hue.msg_main_menu.set_title("Main Menu")
  Hue.msg_room_config.set_title("Room Config")
  Hue.msg_admin_list.set_title("Admin List")
  Hue.msg_ban_list.set_title("Ban List")
  Hue.msg_roomlist.set_title("Room List")
  Hue.msg_settings.set_title("User Settings")
  Hue.msg_screen_capture_options.set_title("Screen Capture")
  Hue.msg_admin_activity.set_title("Admin Activity")
  Hue.msg_notifications.set_title("Notifications")
  Hue.msg_command_book.set_title("Command Book")
  Hue.msg_user_profile.set_title("User Profile")
  Hue.msg_change_role.set_title("Change Role")
}

// Setup window controls
Hue.setup_window_controls = function () {
  Hue.els(".window_controls").forEach(it => {
    let container = it.closest(".Msg-content-container")
    let filter = Hue.el(".filter_input", it)
    let bottom = Hue.el(".window_to_bottom", it)
    let top = Hue.el(".window_to_top", it)

    if (filter.dataset.mode !== "manual") {
      filter.addEventListener("input", function () {
        Hue.do_modal_filter_timer()
      })
    }
    
    bottom.addEventListener("click", function () {
      container.scrollTop = container.scrollHeight
    })

    top.addEventListener("click", function () {
      container.scrollTop = 0
    })
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
    if (id === "info" || filter.dataset.mode === "manual") {
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
  if (instance.options.scroll_on_show) {
    setTimeout(function () {
      instance.content_container.scrollTop = 0
    }, 100)
  }
}

// This is called after a modal is closed
Hue.after_modal_close = function (instance) {
  if (!Hue.any_modal_open()) {
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
  return Hue.msg_main_menu.lower_instances()
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
}

// Filter action for normal filter windows
Hue.do_modal_filter = function (id = false) {
  if (!id) {
    if (!Hue.active_modal) {
      return false
    }

    id = Hue.active_modal.options.id
  }

  let finished = false

  function filtercheck (it) {
    if (finished) {
      return false
    }

    if (filter.startsWith("$user")) {
      let username = Hue.dataset(it, "username")
      let match = username && first_arg === username.toLowerCase()
      
      if (match) {
        if (tail) {
          match = it.textContent.toLowerCase().includes(tail)
        }
      }

      return match
    } else if (filter.startsWith("$fresh")) {
      let match = Hue.dataset(it, "fresh")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      } else {
        finished = true
      }

      return match
    } else if (filter.startsWith("$links")) {
      let s = it.textContent.toLowerCase()
      let match = s.includes("http://") || s.includes("https://")

      if (match) {
        if (args) {
          match = it.textContent.toLowerCase().includes(args)
        }
      }

      return match
    } else {
      return it.textContent.toLowerCase().includes(filter)
    }
  }  

  let win = Hue.el(`#Msg-content-${id}`)
  let filter_el = Hue.el(".filter_input", win)
  filter = Hue.utilz.single_space(filter_el.value).trim().toLowerCase()
  let items = Hue.els(".modal_item", win)
  let args, first_arg, tail

  if (filter && items.length) {
    if (filter.startsWith("$")) {
      let split = filter.split(" ").filter(x => x !== "")
      first_arg = split[1]
      args = split.slice(1).join(" ")
      tail = split.slice(2).join(" ")

      if (first_arg) {
        first_arg = first_arg.toLowerCase()
      }

      if (args) {
        args = args.toLowerCase()
      }

      if (tail) {
        tail = tail.toLowerCase()
      }
    }
    
    if (filter.startsWith("$user")) {
      if (!first_arg) {
        return
      }
    }

    items.forEach(it => {
      if (filtercheck(it)) {
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
    titlebar_class: "!custom_titlebar_popup",
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
    on_x_button_click: function () {}
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
    position: "top",
    enable_titlebar: true,
    window_x: "inner_right",
    content_class: "!action_popup",
    window_width: "auto",
    on_click: on_click,
    after_close: args.after_close,
    close_on_escape: false,
    on_x_button_click: args.on_x_button_click
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

  let html = Hue.template_action_popup({
    classes: classes,
    icon: icon,
    message: args.message
  })

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

// Make windows invisible temporarily
Hue.hide_windows_temporarily = function (delay = 2000) {
  document.documentElement.style.setProperty("--msg_display", "none");

  setTimeout(function () {
    document.documentElement.style.setProperty("--msg_display", "block");
  }, delay)
}