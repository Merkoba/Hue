// TS: 1

// All client variables and functions go here
const App = {}

// This enables information about socket calls to the server in the console
App.debug_socket = true

// This enables or disables script loading
// This should be always true unless developing without an internet connection
App.load_scripts = true

// Initial variables declarations
App.config = {}
App.ls_settings = `settings_v3`
App.ls_room_state = `room_state_v2`
App.ls_input_history = `input_history_v3`
App.roles = [`admin`, `op`, `voice`]
App.default_setting_string = `__default__`
App.topic = ``
App.colorlib = ColorLib()
App.userlist = []
App.all_usernames = []
App.role = ``
App.tab_info = {}
App.modal_open = false
App.commands_list_sorted = {}
App.commands_list_sorted_2 = {}
App.utilz = Utilz()
App.files = {}
App.message_id = 0
App.chat_content_container_id = 0
App.popup_message_id = 0
App.popup_id = 0
App.modal_id = 0
App.image_visible = true
App.tv_visible = true
App.filter_delay = 250
App.resize_delay = 350
App.scroll_delay = 200
App.wheel_delay = 100
App.wheel_delay_2 = 25
App.flash_info_delay = 3000
App.file_added_delay = 100
App.emit_queue = []
App.has_focus = false
App.mouse_is_down = false
App.user_leaving = false
App.admin_activity_filter_string = ``
App.active_modal = false
App.activity_list = []
App.local_storage_to_save = {}
App.local_storage_save_delay = 250
App.chat_scrolled = false
App.userlist_mode = `normal`
App.first_media_change = false
App.calc_round_places = 10
App.loaded_image = {}
App.loaded_tv = {}
App.open_profile_username = false
App.open_profile_user = false
App.connected = false
App.connections = 0
App.connecting = true
App.recent_scroll_time = 1000
App.num_socket_in = 0
App.num_socket_out = 0
App.image_locked = false
App.tv_locked = false
App.fresh_messages_list = []
App.max_fresh_messages = 100
App.fresh_messages_duration = 2500
App.notifications_count = 0
App.footer_expanded = false
App.alert_mode = 0
App.last_favicon_mode = 0
App.favicon_mode = 0
App.top_scroller_visible = false
App.bottom_scroller_visible = false
App.timeago_delay = 20000
App.do_update_activity_bar = true
App.chat_scroll_amount = 150
App.chat_scroll_amount_2 = 300
App.media_min_percentage = 20
App.media_max_percentage = 80
App.min_chat_font_size = 0.6
App.max_chat_font_size = 1.8
App.draw_image_just_entered = false
App.draw_image_num_strokes_save = 500
App.draw_image_max_levels = 200
App.draw_image_max_pencil_size = 40
App.draw_image_default_pencil_size = 16
App.draw_image_pencil_size_step = 4
App.draw_image_bucket_tolerance = 3
App.last_message_date = 0
App.update_userlist_delay = 2000
App.flipped = false
App.flopped = false
App.command_book_created = false
App.radio_disabled = false
App.hide_radio_delay = 1000
App.reply_active = false
App.edit_active = false
App.highlight_footer_delay = 500

// Initial media-loading variables declarations
App.youtube_loading = false
App.youtube_loaded = false
App.youtube_tv_player_requested = false
App.youtube_tv_player_request = false
App.twitch_loading = false
App.twitch_loaded = false
App.twitch_tv_player_requested = false
App.twitch_tv_player_request = false
App.soundcloud_loading = false
App.soundcloud_loaded = false
App.soundcloud_tv_player_requested = false
App.soundcloud_tv_player_request = false
App.media_info_image_data = []
App.media_info_tv_data = []

// This runs after the application's load event
// This is the first function that gets executed
App.init = () => {
  App.load_date_1 = Date.now()
  App.create_debouncers()
  App.setup_textparser_regexes()
  App.activate_key_detection()
  App.setup_templates()
  App.get_settings()
  App.get_room_state()
  App.get_element_sizes()
  App.start_msg()
  App.start_settings_widgets()
  App.start_settings_widgets_listeners()
  App.setup_settings_windows()
  App.start_image_events()
  App.start_dropzone()
  App.activate_visibility_listener()
  App.scroll_events()
  App.resize_events()
  App.start_mouse_events()
  App.start_body_events()
  App.setup_show_profile()
  App.setup_main_menu()
  App.setup_room_config()
  App.setup_input()
  App.setup_modal_image()
  App.setup_footer()
  App.setup_whispers()
  App.setup_autocomplete()
  App.show_console_message()
  App.setup_view_image()
  App.setup_local_storage()
  App.setup_image_upload_comment()
  App.setup_tv_upload_comment()
  App.setup_drag_events()
  App.setup_open_url()
  App.setup_media_pickers()
  App.setup_media_link()
  App.setup_generic_separators()
  App.setup_chat()
  App.setup_message_board()
  App.setup_profilepic_cropper()
  App.setup_userlist_window()
  App.setup_header()
  App.setup_media()
  App.setup_activity_bar()
  App.setup_reply()
  App.start_media_info()
  App.setup_confirm()
  App.start_timeago()
  App.setup_draw_image()
  App.setup_view_text()
  App.setup_radio()
  App.setup_delete_messages()
  App.setup_chat_search()
  App.setup_change_role()
  App.setup_screen_capture()
  App.setup_admin_activity()
  App.setup_item_picker()
  App.setup_edit()
  App.setup_user_profile()
  App.setup_rooms()
  App.setup_theme()
  App.setup_linksbar()

  if (App.debug_socket) {
    App.start_socket_stats()
  }

  App.start_socket()
  App.load_date_2 = Date.now()
}

// What to do after the user's socket joins the room
// This handles the first signal received after a successful connection
App.on_join = (data) => {
  App.connections += 1
  App.started = false
  App.started_safe = false
  App.image_changed = []
  App.tv_changed = []
  App.superuser = data.superuser
  App.load_date_3 = Date.now()
  App.loginfo(`Joined Room`)
  App.room_locked = data.room_locked

  if (data.room_locked) {
    App.start_locked_mode()
    return
  }

  App.init_data = data
  App.room_name = data.room_name
  App.user_reg_date = data.reg_date
  App.userlist = data.userlist
  App.alert_mode = App.last_favicon_mode

  App.set_username(data.username)
  App.set_bio(data.bio)
  App.generate_favicon(App.alert_mode)
  App.update_userlist()
  App.prepare_commands()
  App.prepare_theme(data)
  App.apply_background()
  App.apply_theme()
  App.prepare_active_media()
  App.set_role(data.role, false)
  App.set_topic_info(data)
  App.update_title()
  App.update_user_profile()
  App.clear_chat()
  App.show_log_messages(data.log_messages)
  App.config_room_config()
  App.config_main_menu()
  App.init_message_board(data)
  App.start_active_media()
  App.update_input_placeholder()
  App.fix_media_info()
  App.check_media_info()
  App.update_activity_bar()
  App.prepare_user_profile()
  App.update_linksbar()
  App.at_startup()
}

// This executes at the end of the join function
// When the client is ready for use
App.at_startup = () => {
  App.date_joined = Date.now()
  App.connected = true
  App.started = true

  setTimeout(() => {
    App.started_safe = true
  }, 2000)

  App.load_date_4 = Date.now()
  App.compare_load_dates()
  App.check_max_chat_messages()

  setTimeout(() => {
    App.goto_bottom(true)
  }, 800)

  if (App.connections === 1) {
    App.show_joined()
    App.make_main_container_visible()
  }
  else {
    let d1 = App.last_message_date
    let d2 = App.get_last_message_date()

    if (d2 > d1) {
      App.on_activity(`message`)
    }

    App.show_room_notification(
      App.username,
      `Re-connected`,
      `user`
    )
  }

  App.check_latest_highlight()
  App.process_visibility()
}