// Create all the Handlebars templates
App.setup_templates = () => {
  App.els(`.template`).forEach(it => {
    App[it.id] = Handlebars.compile(App.el(`#${it.id}`).innerHTML)
  })
}

let msgvars = {}

msgvars.common = {
  clear_editables: true,
  class: `modal`,
  show_effect: `none`,
  close_effect: `none`,
  window_x: `none`,
  after_show: (instance) => {
    App.after_modal_show(instance)
    App.after_modal_set_or_show(instance)
  },
  after_set: (instance) => {
    App.after_modal_set_or_show(instance)
  },
  after_close: (instance) => {
    App.after_modal_close(instance)
  },
}

msgvars.titlebar = {
  enable_titlebar: true,
  center_titlebar: true,
  titlebar_class: `!custom_titlebar`
}

// Starts and configures all Msg modal instances
App.start_msg = () => {
  // Start the instances

  App.msg_main_menu = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `main_menu`,
      window_width: `22rem`
    })
  )

  App.msg_room_config = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `room_config`,
      window_width: `22rem`
    })
  )

  App.msg_background_select = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `background_select`
    })
  )

  App.msg_profilepic_select = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `profilepic_select`
    })
  )

  App.msg_audioclip_select = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `audioclip_select`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.stop_audioclip()
      }
    })
  )

  App.msg_link_background = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `link_background`
    })
  )

  App.msg_admin_list = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `admin_list`
    })
  )

  App.msg_ban_list = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `ban_list`
    })
  )

  App.msg_open_room = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `open_room`
    })
  )

  App.msg_roomlist = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `roomlist`,
      window_width: `22rem`
    })
  )

  App.msg_user_profile = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `user_profile`,
      clear_editables: false,
      window_width: `22rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        if (App.user_profile_audio) {
          App.user_profile_audio.pause()
        }
      }
    })
  )

  App.msg_userlist = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `userlist`,
      window_max_width: `40rem`
    })
  )

  App.msg_modal_image = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: `modal_image`,
      preset: `window`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        App.restore_modal_image()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.clear_modal_image_info()
      },
    })
  )

  App.msg_profile = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `profile`,
      window_width: `22rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.el(`#show_profile_profilepic`).src = App.config.profilepic_loading_url
        App.open_profile_username = false
        App.open_profile_user_id = false
        App.open_profile_user = false
        App.stop_audioclip()
      },
    })
  )

  App.msg_change_role = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `change_role`
    })
  )

  App.msg_change_username = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `change_username`
    })
  )

  App.msg_change_password = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `change_password`
    })
  )

  App.msg_info = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: `info`,
      window_height: `auto`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        instance.content.innerHTML = ``
      },
    })
  )

  App.msg_image_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `image_picker`,
      content_class: `!media_picker_content`
    })
  )

  App.msg_link_image = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `link_image`,
      window_width: `28rem`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        App.el(`#link_image_input`).focus()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.el(`#link_image_input`).value = ``
        App.el(`#link_image_comment`).value = ``
      },
    })
  )

  App.msg_tv_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `tv_picker`,
      content_class: `!media_picker_content`
    })
  )

  App.msg_link_tv = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `link_tv`,
      window_width: `28rem`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        App.el(`#link_tv_input`).focus()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.el(`#link_tv_input`).value = ``
        App.el(`#link_tv_comment`).value = ``
      },
    })
  )

  App.msg_media_tweaks = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `media_tweaks`
    })
  )

  App.msg_screen_capture_options = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `screen_capture_options`
    })
  )

  App.msg_command_book = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `command_book`,
      window_width: `36rem`
    })
  )

  App.msg_radio = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `radio`,
      window_width: `30rem`,
      scroll_on_show: false
    })
  )

  App.msg_item_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `item_picker`,
      window_min_width: `20rem`,
      window_max_width: `40rem`
    })
  )

  App.msg_write_whisper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `write_whisper`,
      window_width: `30rem`
    })
  )

  App.msg_show_whisper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `show_whisper`,
      window_width: `30rem`
    })
  )

  App.msg_chat_search = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `chat_search`,
      window_width: `38rem`,
      scroll_on_show: false,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.reset_chat_search_filter()
      },
    })
  )

  App.msg_locked = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: `locked`,
      closeable: false,
      show_effect: `none`,
      close_effect: `none`,
      enable_overlay: true,
      window_class: `!no_effects`,
    })
  )

  App.msg_settings = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `settings`,
      window_width: `24rem`
    })
  )

  App.msg_admin_activity = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `admin_activity`,
    })
  )

  App.msg_view_image = Msg.factory(
    Object.assign({}, msgvars.common, {
      id: `view_image`,
      preset: `window`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        App.restore_view_image()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.clear_view_image_info()
      },
    })
  )

  App.msg_image_upload_comment = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `image_upload_comment`,
      window_width: `28rem`,
      scroll_on_show: false,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.el(`#image_upload_comment_input`).value = ``
        App.image_upload_comment_file = undefined
        App.image_upload_comment_type = undefined
        App.upload_media = undefined
      },
    })
  )

  App.msg_tv_upload_comment = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `tv_upload_comment`,
      window_width: `28rem`,
      scroll_on_show: false,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.el(`#tv_upload_comment_input`).value = ``
        App.el(`#tv_upload_comment_video_preview`).pause()
        App.el(`#tv_upload_comment_video_preview`).src = ``
        App.tv_upload_comment_file = undefined
        App.tv_upload_comment_type = undefined
        App.upload_media = undefined
      },
    })
  )

  App.msg_handle_url = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `handle_url`
    })
  )

  App.msg_delete_messages = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `delete_messages`
    })
  )

  App.msg_open_url = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `open_url`,
      window_max_width: `40rem`
    })
  )

  App.msg_view_text = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `view_text`,
      window_max_width: `40rem`
    })
  )

  App.msg_notifications = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `notifications`,
      window_width: `30rem`,
    })
  )

  App.msg_whispers = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `whispers`,
      window_width: `30rem`,
    })
  )

  App.msg_message_board = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `message_board`,
      window_width: `38rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.do_message_board_edit(false)
      }
    })
  )

  App.msg_profilepic_cropper = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `profilepic_cropper`,
      scroll_on_show: false
    })
  )

  App.msg_confirm = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `confirm`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.on_confirm_cancel()
      }
    })
  )

  App.msg_theme_picker = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `theme_picker`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.apply_selected_theme()
      }
    })
  )

  App.msg_profilepic_preview = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `profilepic_preview`
    })
  )

  App.msg_draw_image = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar,{
      id: `draw_image`
    })
  )

  App.msg_input_history = Msg.factory(
    Object.assign({}, msgvars.common, msgvars.titlebar, {
      id: `input_history`,
      window_width: `30rem`,
    })
  )

  // Set the templates

  App.msg_profile.set(
    App.template_profile({
      profilepic: App.config.profilepic_loading_url
    })
  )

  App.msg_media_tweaks.set(
    App.template_media_tweaks({
      percentages: App.create_tweaks_percentages(`tv`),
      chat_font_sizes: App.create_tweaks_chat_font_sizes()
    })
  )

  App.msg_chat_search.set(
    App.template_chat_search({
      window_controls: App.template_window_controls({
        filter_mode: `manual`,
        filter_id: `chat_search_filter`,
        filter_placeholder: `Chat Search`
      })
    })
  )

  App.msg_message_board.set(
    App.template_message_board({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `message_board_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_admin_activity.set(
    App.template_admin_activity({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `admin_activity_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_command_book.set(
    App.template_command_book({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `command_book_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_radio.set(
    App.template_radio({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `radio_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_notifications.set(
    App.template_notifications({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `notifications_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_roomlist.set(
    App.template_roomlist({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `roomlist_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_settings.set(
    App.template_settings({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `settings_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_userlist.set(
    App.template_userlist({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `userlist_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_whispers.set(
    App.template_whispers({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `whispers_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_screen_capture_options.set(
    App.template_screen_capture_options({
      durations: App.config.screen_capture_durations
    })
  )

  App.msg_input_history.set(
    App.template_input_history({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `input_history_filter`,
        filter_placeholder: `Filter`
      })
    })
  )

  App.msg_tv_upload_comment.set(
    App.template_tv_upload_comment({
      poster: App.config.video_poster
    })
  )

  App.msg_link_image.set(
    App.template_link_image({
      commands_prefix: App.config.commands_prefix
    })
  )

  App.msg_link_tv.set(
    App.template_link_tv({
      commands_prefix: App.config.commands_prefix
    })
  )

  App.msg_main_menu.set(App.template_main_menu())
  App.msg_room_config.set(App.template_room_config())
  App.msg_background_select.set(App.template_background_select())
  App.msg_profilepic_select.set(App.template_profilepic_select())
  App.msg_audioclip_select.set(App.template_audioclip_select())
  App.msg_link_background.set(App.template_link_background())
  App.msg_admin_list.set(App.template_admin_list())
  App.msg_ban_list.set(App.template_ban_list())
  App.msg_open_room.set(App.template_open_room())
  App.msg_user_profile.set(App.template_user_profile())
  App.msg_write_whisper.set(App.template_write_whisper())
  App.msg_show_whisper.set(App.template_show_whisper())
  App.msg_modal_image.set(App.template_modal_image())
  App.msg_locked.set(App.template_locked_menu())
  App.msg_view_image.set(App.template_view_image())
  App.msg_image_upload_comment.set(App.template_image_upload_comment())
  App.msg_handle_url.set(App.template_handle_url())
  App.msg_delete_messages.set(App.template_delete_messages())
  App.msg_open_url.set(App.template_open_url())
  App.msg_view_text.set(App.template_view_text())
  App.msg_profilepic_cropper.set(App.template_profilepic_cropper())
  App.msg_change_role.set(App.template_change_role())
  App.msg_change_username.set(App.template_change_username())
  App.msg_change_password.set(App.template_change_password())
  App.msg_confirm.set(App.template_confirm())
  App.msg_theme_picker.set(App.template_theme_picker())
  App.msg_profilepic_preview.set(App.template_profilepic_preview())
  App.msg_draw_image.set(App.template_draw_image())
  App.msg_image_picker.set(App.template_image_picker())
  App.msg_tv_picker.set(App.template_tv_picker())
  App.msg_item_picker.set(App.template_item_picker())

  App.msg_info.create()

  // Set the titles

  App.msg_chat_search.set_title(App.template_titlebar({
    items: [
      {id: `chat_search_highlights`, text: `Highlights`},
      {id: `chat_search_links`, text: `Links`},
      {id: `chat_search_user`, text: `User`},
      {id: `chat_search_image`, text: `Image`},
      {id: `chat_search_tv`, text: `TV`},
    ]
  }))

  App.msg_theme_picker.set_title(App.template_titlebar({
    items: [
      {id: `theme_picker_random`, text: `Random`},
      {id: `theme_picker_peek`, text: `Peek`},
    ]
  }))

  App.msg_profilepic_preview.set_title(App.template_titlebar({
    items: [
      {id: `profilepic_preview_choose`, text: `Re-Choose`},
      {id: `profilepic_preview_confirm`, text: `Confirm`},
    ]
  }))

  App.msg_view_text.set_title(App.template_titlebar({
    items: [
      {id: `view_text_copy`, text: `Copy To Clipboard`},
    ]
  }))

  App.msg_message_board.set_title(App.template_titlebar({
    items: [
      {id: `message_board_post`, text: `Submit Post`},
      {id: `message_board_links`, text: `Show Links`},
      {id: `message_board_user`, text: `Show User`},
    ]
  }))

  App.msg_link_image.set_title(App.template_titlebar({
    items: [
      {id: `link_image_submit`, text: `Link Image`},
    ]
  }))

  App.msg_link_tv.set_title(App.template_titlebar({
    items: [
      {id: `link_tv_submit`, text: `Link TV`},
    ]
  }))

  App.msg_draw_image.set_title(App.template_titlebar({
    items: [
      {id: `draw_image_undo`, text: `Undo`},
      {id: `draw_image_redo`, text: `Redo`},
      {id: `draw_image_clear`, text: `Clear`},
      {id: `draw_image_upload`, text: `Upload`},
    ]
  }))

  App.msg_change_username.set_title(App.template_titlebar({
    items: [
      {id: `change_username_submit`, text: `Change Username`},
    ]
  }))

  App.msg_change_password.set_title(App.template_titlebar({
    items: [
      {id: `change_password_submit`, text: `Change Password`},
    ]
  }))

  App.msg_write_whisper.set_title(App.template_titlebar({
    items: [
      {id: `write_whisper_add_user`, text: `Add`},
      {id: `write_whisper_send`, text: `Send`},
    ],
    container_id: `write_whisper_titlebar`
  }))

  App.msg_show_whisper.set_title(App.template_titlebar({
    items: [
      {id: `show_whisper_write`, text: ``},
    ]
  }))

  App.msg_whispers.set_title(App.template_titlebar({
    items: [
      {id: `start_write_whisper`, text: `New Whisper`},
      {id: `whispers_clear`, text: `Clear Whispers`},
    ]
  }))

  App.msg_admin_activity.set_title(App.template_titlebar({
    items: [
      {id: `admin_activity_clear`, text: `Clear Admin Activity`},
    ]
  }))

  App.msg_profilepic_cropper.set_title(App.template_titlebar({
    items: [
      {id: `profilepic_cropper_change`, text: ``},
      {id: `profilepic_cropper_crop`, text: `Crop Circle`},
    ]
  }))

  App.msg_image_upload_comment.set_title(App.template_titlebar({
    items: [
      {id: `image_upload_comment_change`, text: ``},
      {id: `image_upload_comment_submit`, text: `Upload Image`},
    ]
  }))

  App.msg_tv_upload_comment.set_title(App.template_titlebar({
    items: [
      {id: `tv_upload_comment_change`, text: ``},
      {id: `tv_upload_comment_submit`, text: `Upload TV`},
    ]
  }))

  App.msg_link_background.set_title(App.template_titlebar({
    items: [
      {id: `link_background_submit`, text: `Link Background`},
    ]
  }))

  App.msg_confirm.set_title(App.template_titlebar({
    items: [
      {id: `confirm_button_confirm`, text: `Confirm`},
    ]
  }))

  App.msg_open_room.set_title(App.template_titlebar({
    items: [
      {id: `open_room_here`, text: `Open Here`},
      {id: `open_room_new_tab`, text: `New Tab`},
    ]
  }))

  App.msg_open_url.set_title(App.template_titlebar({
    items: [
      {id: `open_url_menu_copy`, text: `Copy URL`},
      {id: `open_url_menu_load`, text: `Load`},
      {id: `open_url_menu_link`, text: `Link`},
      {id: `open_url_menu_context`, text: `Context`},
    ],
    container_id: `open_url_titlebar`
  }))

  App.msg_handle_url.set_title(App.template_titlebar({
    items: [
      {id: `handle_url_chat`, text: `Send To Chat`},
      {id: `handle_url_image`, text: `Change Image`},
      {id: `handle_url_tv`, text: `Change TV`},
    ],
    container_id: `handle_url_titlebar`
  }))

  App.msg_delete_messages.set_title(App.template_titlebar({
    items: [
      {id: `delete_messages_one`, text: `One`},
      {id: `delete_messages_group`, text: `Group`},
      {id: `delete_messages_above`, text: `Above`},
      {id: `delete_messages_below`, text: `Below`},
    ],
    container_id: `delete_messages_titlebar`
  }))

  App.msg_profilepic_select.set_title(App.template_titlebar({
    items: [
      {id: `profilepic_select_upload`, text: `Upload`},
      {id: `profilepic_select_draw`, text: `Draw`},
      {id: `profilepic_select_random`, text: `Random`},
    ]
  }))

  App.msg_image_picker.set_title(App.template_titlebar({
    items: [
      {id: `image_picker_link`, text: `Link`},
      {id: `image_picker_upload`, text: `Upload`},
      {id: `image_picker_draw`, text: `Draw`},
      {id: `image_picker_random`, text: `Random`},
      {id: `image_picker_screenshot`, text: `Screenshot`},
    ]
  }))

  App.msg_tv_picker.set_title(App.template_titlebar({
    items: [
      {id: `tv_picker_link`, text: `Link`},
      {id: `tv_picker_upload`, text: `Upload`},
      {id: `tv_picker_capture`, text: `Capture`},
    ]
  }))

  App.msg_background_select.set_title(App.template_titlebar({
    items: [
      {id: `background_select_link`, text: `Link`},
      {id: `background_select_upload`, text: `Upload`},
      {id: `background_select_draw`, text: `Draw`},
      {id: `background_select_random`, text: `Random`},
      {id: `background_select_remove`, text: `Remove`},
    ]
  }))

  App.msg_audioclip_select.set_title(App.template_titlebar({
    items: [
      {id: `play_audioclip`, text: `Play`},
      {id: `upload_audioclip`, text: `Upload`},
      {id: `remove_audioclip`, text: `Remove`},
    ]
  }))

  App.msg_media_tweaks.set_title(App.template_titlebar({
    items: [
      {id: `media_tweaks_swap`, text: `Swap`},
      {id: `media_tweaks_rotate`, text: `Rotate`},
      {id: `media_tweaks_revolve`, text: `Revolve`},
      {id: `media_tweaks_defaults`, text: `Defaults`},
    ]
  }))

  App.msg_settings.set_title(App.template_titlebar({
    items: [
      {id: `settings_notifications`, text: `Notifications`},
      {id: `settings_defaults`, text: `Defaults`},
    ]
  }))

  App.msg_radio.set_title(App.template_titlebar({
    items: [
      {id: `radio_playstop`, text: `Play`},
      {id: `radio_random`, text: `Random`},
      {id: `radio_volume`, text: `Volume: 100%`},
      {
        id: `radio_auto`, text: `Auto: Off`,
        title: `Automatically change the station every ${App.config.radio_auto_minutes} minutes`
      },
    ]
  }))

  App.msg_main_menu.set_title(`Main Menu`)
  App.msg_room_config.set_title(`Room Config`)
  App.msg_admin_list.set_title(`Admin List`)
  App.msg_ban_list.set_title(`Ban List`)
  App.msg_roomlist.set_title(`Room List`)
  App.msg_screen_capture_options.set_title(`Screen Capture`)
  App.msg_notifications.set_title(`Notifications`)
  App.msg_command_book.set_title(`Command Book`)
  App.msg_user_profile.set_title(`User Profile`)
  App.msg_change_role.set_title(`Change Role`)
  App.msg_input_history.set_title(`Input History`)
}

// This is called after a modal is shown
App.after_modal_show = (instance) => {
  App.active_modal = instance
  App.modal_open = true
  App.hide_context_menu()
  App.blur_input()
  App.focus_modal_filter(instance)
}

// This is called after a modal is set or shown
App.after_modal_set_or_show = (instance) => {
  if (instance.options.scroll_on_show) {
    setTimeout(() => {
      instance.content_container.scrollTop = 0
    }, 100)
  }
}

// This is called after a modal is closed
App.after_modal_close = (instance) => {
  if (!App.any_modal_open()) {
    App.modal_open = false
    App.focus_input()
  }
  else {
    App.active_modal = App.get_highest_modal()
  }

  App.reset_modal_filter(instance)
}

// Gets all normal Msg instances
App.get_modal_instances = () => {
  return App.msg_main_menu.higher_instances()
}

// Gets all Msg popup instances
App.get_popup_instances = () => {
  return App.msg_main_menu.lower_instances()
}

// Checks if any Msg modal instance is open
App.any_modal_open = () => {
  for (let instance of App.get_modal_instances()) {
    if (instance.is_open()) {
      return true
    }
  }

  return false
}

// Gets the highest open Msg modal
App.get_highest_modal = () => {
  return App.msg_main_menu.highest_instance()
}

// Closes all Msg modal instances
App.close_all_modals = () => {
  for (let instance of App.get_modal_instances()) {
    instance.close()
  }
}

// Closes all Msg popup instances
App.close_all_popups = (callback = false) => {
  for (let instance of App.get_popup_instances()) {
    instance.close()
  }
}

// Scrolls a modal window to the top
App.scroll_modal_to_top = (id) => {
  App.el(`#Msg-content-container-${id}`).scrollTop = 0
}

// Scrolls a modal window to the bottom
App.scroll_modal_to_bottom = (id) => {
  let container = App.el(`#Msg-content-container-${id}`)
  container.scrollTop = container.scrollHeight
}

// Creates a Msg popup
App.create_popup = (args = {}, ptype = `unset`) => {
  if (!args.id) {
    App.popup_id += 1
    args.id = `popup_${App.popup_id}`
  }

  let def_args = {
    preset: `popup`,
    class: `popup`,
    position: `top`,
    clear_editables: true,
    show_effect: `none`,
    close_effect: `none`,
    window_class: `!custom_popup`,
    enable_titlebar: true,
    center_titlebar: true,
    titlebar_class: `!custom_titlebar_popup`,
    window_inner_x_class: `!titlebar_inner_x`,
    edge_padding_y: App.panel_height * 1.5,
    edge_padding_x: 12,
    remove_after_close: true
  }

  args = Object.assign(def_args, args)
  let popup = Msg.factory(args)
  popup.hue_type = ptype
  return popup
}

// Makes action popups like for file upload progress
App.show_action_popup = (args = {}) => {
  let def_args = {
    on_x_button_click: () => {}
  }

  args = Object.assign(def_args, args)
  let on_click = () => {}

  if (args.on_click) {
    on_click = (instance) => {
      instance.close()
      args.on_click()
    }
  }

  let obj = {
    position: `top`,
    enable_titlebar: true,
    window_x: `inner_right`,
    content_class: `!action_popup`,
    window_width: `auto`,
    on_click: on_click,
    close_on_escape: false,
    on_x_button_click: args.on_x_button_click
  }

  if (!args.title) {
    args.title = `Action`
  }

  if (args.id) {
    obj.id = args.id
  }

  let popup = App.create_popup(obj)
  let classes = ``

  if (args.on_click) {
    classes = `action`
  }

  let icon = ``

  if (args.icon) {
    icon = App.get_icon(args.icon, `action_popup_icon`)
  }

  let html = App.template_action_popup({
    classes: classes,
    icon: icon,
    message: args.message
  })

  popup.show([args.title, html])
  return popup
}

// Get the first visible item in a filtered container
App.get_first_visible_modal_item = (id) => {
  let items = App.els(`#${id} .modal_item`)

  for (let item of items) {
    if (!item.classList.contains(`nodisplay`)) {
      return item
    }
  }
}

// Make windows invisible temporarily
App.hide_windows_temporarily = (delay = 2000) => {
  document.documentElement.style.setProperty(`--msg_display`, `none`)

  setTimeout(() => {
    document.documentElement.style.setProperty(`--msg_display`, `block`)
  }, delay)
}