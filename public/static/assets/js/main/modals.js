// Create all the Handlebars templates
App.setup_templates = () => {
  for (let template of DOM.els(`.template`)) {
    App[template.id] = Handlebars.compile(DOM.el(`#${template.id}`).innerHTML)
  }
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
  titlebar_class: `!custom_titlebar`,
}

// Starts and configures all Msg modal instances
App.start_msg = () => {
  // Start the instances

  App.msg_main_menu = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `main_menu`,
      window_width: `22rem`},
  )

  App.msg_room_config = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `room_config`,
      window_width: `22rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.check_color_pickers()
      }},
  )

  App.msg_background_select = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `background_select`},
  )

  App.msg_profilepic_select = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `profilepic_select`},
  )

  App.msg_audioclip_select = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `audioclip_select`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.stop_audioclip()
      }},
  )

  App.msg_link_background = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `link_background`},
  )

  App.msg_admin_list = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `admin_list`},
  )

  App.msg_ban_list = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `ban_list`},
  )

  App.msg_open_room = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `open_room`},
  )

  App.msg_roomlist = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `roomlist`,
      window_width: `22rem`},
  )

  App.msg_reactions = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `reactions`,
      window_width: `22rem`},
  )

  App.msg_user_profile = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `user_profile`,
      clear_editables: false,
      window_width: `22rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        if (App.user_profile_audio) {
          App.user_profile_audio.pause()
        }
      }},
  )

  App.msg_userlist = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `userlist`,
      window_max_width: `40rem`},
  )

  App.msg_modal_image = Msg.factory(
    {...msgvars.common, id: `modal_image`,
      preset: `window`,
      class: `full`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        App.restore_modal_image()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.clear_modal_image_info()
      }},
  )

  App.msg_profile = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `profile`,
      window_width: `22rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        DOM.el(`#show_profile_profilepic`).src = App.config.profilepic_loading_url
        App.open_profile_username = false
        App.open_profile_user_id = false
        App.open_profile_user = false
        App.stop_audioclip()
      }},
  )

  App.msg_change_role = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `change_role`},
  )

  App.msg_change_username = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `change_username`},
  )

  App.msg_change_password = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `change_password`},
  )

  App.msg_info = Msg.factory(
    {...msgvars.common, id: `info`,
      window_height: `auto`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        instance.content.innerHTML = ``
      }},
  )

  App.msg_image_picker = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `image_picker`,
      content_class: `!media_picker_content`},
  )

  App.msg_link_image = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `link_image`,
      window_width: `28rem`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        DOM.el(`#link_image_input`).focus()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        DOM.el(`#link_image_input`).value = ``
        DOM.el(`#link_image_comment`).value = ``
      }},
  )

  App.msg_tv_picker = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `tv_picker`,
      content_class: `!media_picker_content`},
  )

  App.msg_link_tv = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `link_tv`,
      window_width: `28rem`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        DOM.el(`#link_tv_input`).focus()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        DOM.el(`#link_tv_input`).value = ``
        DOM.el(`#link_tv_comment`).value = ``
      }},
  )

  App.msg_automedia = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `automedia`,
      window_max_width: `40rem`},
  )

  App.msg_screen_capture_options = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `screen_capture_options`},
  )

  App.msg_command_book = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `command_book`,
      window_width: `36rem`},
  )

  App.msg_radio = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `radio`,
      window_width: `30rem`,
      scroll_on_show: false,
      class: `!modal_selectable`},
  )

  App.msg_item_picker = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `item_picker`,
      window_min_width: `20rem`,
      window_max_width: `40rem`},
  )

  App.msg_write_whisper = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `write_whisper`,
      window_width: `30rem`},
  )

  App.msg_show_whisper = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `show_whisper`,
      window_width: `30rem`},
  )

  App.msg_chat_search = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `chat_search`,
      window_width: `38rem`,
      scroll_on_show: false,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.reset_chat_search_filter()
      }},
  )

  App.msg_locked = Msg.factory(
    {...msgvars.common, id: `locked`,
      closeable: false,
      show_effect: `none`,
      close_effect: `none`,
      enable_overlay: true,
      window_class: `!no_effects`},
  )

  App.msg_settings = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `settings`,
      window_width: `24rem`},
  )

  App.msg_admin_activity = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `admin_activity`},
  )

  App.msg_view_image = Msg.factory(
    {...msgvars.common, id: `view_image`,
      preset: `window`,
      class: `full`,
      after_show: (instance) => {
        msgvars.common.after_show(instance)
        App.restore_view_image()
      },
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.clear_view_image_info()
      }},
  )

  App.msg_image_upload_comment = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `image_upload_comment`,
      window_width: `28rem`,
      scroll_on_show: false,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        DOM.el(`#image_upload_comment_input`).value = ``
        App.image_upload_comment_file = undefined
        App.image_upload_comment_type = undefined
        App.upload_media = undefined
      }},
  )

  App.msg_tv_upload_comment = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `tv_upload_comment`,
      window_width: `28rem`,
      scroll_on_show: false,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        DOM.el(`#tv_upload_comment_input`).value = ``
        DOM.el(`#tv_upload_comment_preview`).pause()
        DOM.el(`#tv_upload_comment_preview`).src = ``
        App.tv_upload_comment_file = undefined
        App.tv_upload_comment_type = undefined
        App.upload_media = undefined
      }},
  )

  App.msg_handle_url = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `handle_url`},
  )

  App.msg_delete_messages = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `delete_messages`},
  )

  App.msg_open_url = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `open_url`,
      window_max_width: `40rem`},
  )

  App.msg_view_text = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `view_text`,
      window_max_width: `40rem`},
  )

  App.msg_notifications = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `notifications`,
      window_width: `30rem`},
  )

  App.msg_whispers = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `whispers`,
      window_width: `30rem`},
  )

  App.msg_message_board = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `message_board`,
      window_width: `38rem`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.do_message_board_edit(false)
      }},
  )

  App.msg_profilepic_cropper = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `profilepic_cropper`,
      scroll_on_show: false},
  )

  App.msg_confirm = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `confirm`,
      after_close: (instance) => {
        msgvars.common.after_close(instance)
        App.on_confirm_cancel()
      }},
  )

  App.msg_profilepic_preview = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `profilepic_preview`},
  )

  App.msg_draw_image = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `draw_image`},
  )

  App.msg_input_history = Msg.factory(
    {...msgvars.common, ...msgvars.titlebar, id: `input_history`,
      window_width: `30rem`,
      class: `!modal_selectable`},
  )

  // Set the templates

  App.msg_profile.set(
    App.template_profile({
      profilepic: App.config.profilepic_loading_url,
    }),
  )

  App.msg_chat_search.set(
    App.template_chat_search({
      window_controls: App.template_window_controls({
        filter_mode: `manual`,
        filter_id: `chat_search_filter`,
        filter_placeholder: `Chat Search`,
      }),
    }),
  )

  App.msg_message_board.set(
    App.template_message_board({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `message_board_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_room_config.set(
    App.template_room_config({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `room_config_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_admin_activity.set(
    App.template_admin_activity({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `admin_activity_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_command_book.set(
    App.template_command_book({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `command_book_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_radio.set(
    App.template_radio({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `radio_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_notifications.set(
    App.template_notifications({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `notifications_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_roomlist.set(
    App.template_roomlist({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `roomlist_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_reactions.set(
    App.template_reactions(),
  )

  App.msg_settings.set(
    App.template_settings({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `settings_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_userlist.set(
    App.template_userlist({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `userlist_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_whispers.set(
    App.template_whispers({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `whispers_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_screen_capture_options.set(
    App.template_screen_capture_options({
      durations: App.config.screen_capture_durations,
    }),
  )

  App.msg_input_history.set(
    App.template_input_history({
      window_controls: App.template_window_controls({
        filter_mode: `auto`,
        filter_id: `input_history_filter`,
        filter_placeholder: `Filter`,
      }),
    }),
  )

  App.msg_tv_upload_comment.set(
    App.template_tv_upload_comment({
      poster: App.config.video_poster,
    }),
  )

  App.msg_link_image.set(
    App.template_link_image(),
  )

  App.msg_link_tv.set(
    App.template_link_tv(),
  )

  App.msg_main_menu.set(App.template_main_menu())
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
  App.msg_automedia.set(App.template_automedia())
  App.msg_view_text.set(App.template_view_text())
  App.msg_profilepic_cropper.set(App.template_profilepic_cropper())
  App.msg_change_role.set(App.template_change_role())
  App.msg_change_username.set(App.template_change_username())
  App.msg_change_password.set(App.template_change_password())
  App.msg_confirm.set(App.template_confirm())
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
    ],
  }))

  App.msg_profilepic_preview.set_title(App.template_titlebar({
    items: [
      {id: `profilepic_preview_choose`, text: `Re-Choose`},
      {id: `profilepic_preview_confirm`, text: `Confirm`},
    ],
  }))

  App.msg_view_text.set_title(App.template_titlebar({
    items: [
      {id: `view_text_copy`, text: `Copy`},
    ],
  }))

  App.msg_message_board.set_title(App.template_titlebar({
    items: [
      {id: `message_board_post`, text: `Submit Post`},
      {id: `message_board_links`, text: `Show Links`},
      {id: `message_board_user`, text: `Show User`},
    ],
  }))

  App.msg_link_image.set_title(App.template_titlebar({
    items: [
      {id: `link_image_submit`, text: `Link`},
    ],
  }))

  App.msg_link_tv.set_title(App.template_titlebar({
    items: [
      {id: `link_tv_submit`, text: `Link`},
    ],
  }))

  App.msg_draw_image.set_title(App.template_titlebar({
    items: [
      {id: `draw_image_undo`, text: `Undo`},
      {id: `draw_image_redo`, text: `Redo`},
      {id: `draw_image_suggest`, text: `Suggest`},
      {id: `draw_image_clear`, text: `Clear`},
      {id: `draw_image_upload`, text: `Upload`},
    ],
  }))

  App.msg_change_username.set_title(App.template_titlebar({
    items: [
      {id: `change_username_submit`, text: `Change Username`},
    ],
  }))

  App.msg_change_password.set_title(App.template_titlebar({
    items: [
      {id: `change_password_submit`, text: `Change Password`},
    ],
  }))

  App.msg_write_whisper.set_title(App.template_titlebar({
    items: [
      {id: `write_whisper_add_user`, text: `Add`},
      {id: `write_whisper_send`, text: `Send`},
    ],
    container_id: `write_whisper_titlebar`,
  }))

  App.msg_show_whisper.set_title(App.template_titlebar({
    items: [
      {id: `show_whisper_write`, text: ``},
    ],
  }))

  App.msg_whispers.set_title(App.template_titlebar({
    items: [
      {id: `start_write_whisper`, text: `New`},
      {id: `whispers_clear`, text: `Clear`},
    ],
  }))

  App.msg_admin_activity.set_title(App.template_titlebar({
    items: [
      {id: `admin_activity_clear`, text: `Clear`},
    ],
  }))

  App.msg_profilepic_cropper.set_title(App.template_titlebar({
    items: [
      {id: `profilepic_cropper_change`, text: ``},
      {id: `profilepic_cropper_crop`, text: `Crop`},
    ],
  }))

  App.msg_image_upload_comment.set_title(App.template_titlebar({
    items: [
      {id: `image_upload_comment_change`, text: ``},
      {id: `image_upload_comment_submit`, text: `Upload`},
    ],
  }))

  App.msg_tv_upload_comment.set_title(App.template_titlebar({
    items: [
      {id: `tv_upload_comment_change`, text: ``},
      {id: `tv_upload_comment_submit`, text: `Upload`},
    ],
  }))

  App.msg_link_background.set_title(App.template_titlebar({
    items: [
      {id: `link_background_submit`, text: `Link`},
    ],
  }))

  App.msg_confirm.set_title(App.template_titlebar({
    items: [
      {id: `confirm_button_confirm`, text: `Confirm`},
    ],
  }))

  App.msg_open_room.set_title(App.template_titlebar({
    items: [
      {id: `open_room_here`, text: `Open Here`},
      {id: `open_room_new_tab`, text: `New Tab`},
    ],
  }))

  App.msg_open_url.set_title(App.template_titlebar({
    items: [
      {id: `open_url_menu_copy`, text: `Copy URL`},
      {id: `open_url_menu_load`, text: `Load`},
      {id: `open_url_menu_link`, text: `Link`},
      {id: `open_url_menu_context`, text: `Context`},
      {id: `open_url_menu_reply`, text: `Reply`},
    ],
    container_id: `open_url_titlebar`,
  }))

  App.msg_automedia.set_title(App.template_titlebar({
    items: [
      {id: `automedia_chat`, text: `Send To Chat`},
      {id: `automedia_change`, text: `Change Media`},
    ],
    container_id: `open_url_titlebar`,
  }))

  App.msg_handle_url.set_title(App.template_titlebar({
    items: [
      {id: `handle_url_chat`, text: `Send To Chat`},
      {id: `handle_url_image`, text: `Change Image`},
      {id: `handle_url_tv`, text: `Change TV`},
    ],
    container_id: `handle_url_titlebar`,
  }))

  App.msg_delete_messages.set_title(App.template_titlebar({
    items: [
      {id: `delete_messages_one`, text: `One`},
      {id: `delete_messages_group`, text: `Group`},
      {id: `delete_messages_above`, text: `Above`},
      {id: `delete_messages_below`, text: `Below`},
    ],
    container_id: `delete_messages_titlebar`,
  }))

  App.msg_profilepic_select.set_title(App.template_titlebar({
    items: [
      {id: `profilepic_select_upload`, text: `Upload`},
      {id: `profilepic_select_draw`, text: `Draw`},
      {id: `profilepic_select_random`, text: `Random`},
    ],
  }))

  App.msg_image_picker.set_title(App.template_titlebar({
    items: [
      {id: `image_picker_link`, text: `Link`},
      {id: `image_picker_upload`, text: `Upload`},
      {id: `image_picker_draw`, text: `Draw`},
      {id: `image_picker_random`, text: `Random`},
      {id: `image_picker_screenshot`, text: `Screenshot`},
    ],
  }))

  App.msg_tv_picker.set_title(App.template_titlebar({
    items: [
      {id: `tv_picker_link`, text: `Link`},
      {id: `tv_picker_upload`, text: `Upload`},
      {id: `tv_picker_capture`, text: `Capture`},
    ],
  }))

  App.msg_background_select.set_title(App.template_titlebar({
    items: [
      {id: `background_select_link`, text: `Link`},
      {id: `background_select_upload`, text: `Upload`},
      {id: `background_select_draw`, text: `Draw`},
      {id: `background_select_random`, text: `Random`},
      {id: `background_select_remove`, text: `Remove`},
    ],
  }))

  App.msg_audioclip_select.set_title(App.template_titlebar({
    items: [
      {id: `play_audioclip`, text: `Play`},
      {id: `upload_audioclip`, text: `Upload`},
      {id: `remove_audioclip`, text: `Remove`},
    ],
  }))

  App.msg_settings.set_title(App.template_titlebar({
    items: [
      {id: `settings_notifications`, text: `Notifications`},
      {id: `settings_defaults`, text: `Defaults`},
    ],
  }))

  App.msg_radio.set_title(App.template_titlebar({
    items: [
      {id: `radio_playstop`, text: `Play`},
      {id: `radio_random`, text: `Random`},
      {id: `radio_volume`, text: `Volume: 100%`},
      {
        id: `radio_auto`, text: `Auto: Off`,
        title: `Automatically change the station after some minutes. This is configurable in Settings`,
      },
    ],
  }))

  App.msg_main_menu.set_title(`Main Menu`)
  App.msg_room_config.set_title(`Room Config`)
  App.msg_admin_list.set_title(`Admin List`)
  App.msg_ban_list.set_title(`Ban List`)
  App.msg_roomlist.set_title(`Room List`)
  App.msg_reactions.set_title(`Reactions`)
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
  App.modal_selectable = instance.options.class === `!modal_selectable`
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

// Scrolls a modal window to the top
App.scroll_modal_to_top = (id) => {
  DOM.el(`#Msg-content-container-${id}`).scrollTop = 0
}

// Scrolls a modal window to the bottom
App.scroll_modal_to_bottom = (id = false) => {
  id = App.fill_modal_id(id)
  let container = DOM.el(`#Msg-content-container-${id}`)
  container.scrollTop = container.scrollHeight
}

// Scroll to the bottom or to the top
App.scroll_modal_toggle = (id = false) => {
  id = App.fill_modal_id(id)
  let c = DOM.el(`#Msg-content-container-${id}`)

  if (Math.abs(c.scrollTop - (c.scrollHeight - c.clientHeight)) > 10) {
    App.scroll_modal_to_bottom(id)
  }
  else {
    c.scrollTop = 0
  }
}

// Get the first visible item in a filtered container
App.get_first_visible_modal_item = (id) => {
  let items = DOM.els(`#${id} .modal_item`)

  for (let item of items) {
    if (!DOM.is_hidden(item)) {
      return item
    }
  }
}

// Make windows invisible temporarily
App.hide_windows_temporarily = (delay = 2000) => {
  App.set_style_prop(`--msg_display`, `none`)

  setTimeout(() => {
    App.set_style_prop(`--msg_display`, `block`)
  }, delay)
}