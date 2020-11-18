// TS: 1

// Main Hue Object
// All client variables and functions go here
const Hue = {}

// This enables information about socket calls to the server in the console
// Setting it to true is recommended
Hue.debug_socket = true

// This wraps all functions with a function
// It shows every triggered function name
// This is mainly to check for loops
// Should be false unless debugging
Hue.debug_functions = false

// This enables or disables script loading
// This should be always true unless developing without an internet connection
Hue.load_scripts = true

// Initial variables declarations
Hue.config = {}
Hue.ls_settings = "settings_v1"
Hue.ls_room_state = "room_state_v1"
Hue.ls_first_time = "first_time_v2"
Hue.roles = ["admin", "op", "voice"]
Hue.topic = ""
Hue.topic_setter = ""
Hue.topic_date = ""
Hue.colorlib = ColorLib()
Hue.played = []
Hue.input_history = []
Hue.input_history_index = 0
Hue.input_history_crop_limit = 20
Hue.userlist = []
Hue.usernames = []
Hue.all_usernames = []
Hue.role = ""
Hue.tab_info = {}
Hue.create_room_open = false
Hue.open_room_open = false
Hue.tv_picker_open = false
Hue.image_picker_open = false
Hue.goto_room_open = false
Hue.background_image_input_open = false
Hue.admin_list_open = false
Hue.ban_list_open = false
Hue.image_upload_comment_open = false
Hue.change_user_username_open = false
Hue.change_user_password_open = false
Hue.change_user_email_open = false
Hue.media_menu_open = false
Hue.writing_reply = false
Hue.modal_open = false
Hue.commands_list_sorted = {}
Hue.commands_list_sorted_2 = {}
Hue.utilz = Utilz()
Hue.background_image_setter = ""
Hue.background_image_date = ""
Hue.files = {}
Hue.youtube_video_play_on_queue = false
Hue.message_id = 0
Hue.chat_content_container_id = 0
Hue.popup_message_id = 0
Hue.popup_id = 0
Hue.modal_id = 0
Hue.writing_message = false
Hue.image_visible = true
Hue.tv_visible = true
Hue.modal_image_open = false
Hue.current_image_data = {}
Hue.filter_delay = 350
Hue.resize_delay = 350
Hue.wheel_delay = 100
Hue.wheel_delay_2 = 25
Hue.emit_queue = []
Hue.app_focused = false
Hue.message_unames = ""
Hue.aura_timeouts = {}
Hue.mouse_is_down = false
Hue.commands_queue = {}
Hue.user_leaving = false
Hue.admin_activity_filter_string = ""
Hue.active_modal = false
Hue.activity_list = []
Hue.last_activity_trigger = 0
Hue.HOUR = 3600000
Hue.DAY = 86400000
Hue.YEAR = 31536000000
Hue.editing_message = false
Hue.editing_message_container = false
Hue.editing_message_area = false
Hue.local_storage_to_save = {}
Hue.local_storage_save_delay = 250
Hue.sending_whisper = false
Hue.chat_scrolled = false
Hue.lockscreen_peek_delay = 500
Hue.lockscreen_peek_active = false
Hue.context_menu_open = false
Hue.image_upload_comment_file = false
Hue.image_upload_comment_type = false
Hue.just_tabbed = false
Hue.userlist_mode = "normal"
Hue.usercount = 0
Hue.markdown_regexes = {}
Hue.show_media_history_type = ""
Hue.add_to_chat_searches_delay = 2000
Hue.first_media_change = false
Hue.calc_round_places = 10
Hue.typing_delay = 100
Hue.loaded_image = {}
Hue.loaded_tv = {}
Hue.open_profile_username = false
Hue.open_profile_user = false
Hue.show_profile_audio_clip_started = false
Hue.send_badge_disabled = true
Hue.info_popups = []
Hue.connected = false
Hue.connections = 0
Hue.connecting = true
Hue.recent_scroll_time = 1000
Hue.typing = false
Hue.favicon_mode = 0
Hue.handle_url_open = false
Hue.screen_locked = false
Hue.num_socket_in = 0
Hue.num_socket_out = 0
Hue.max_displayed_url = 70
Hue.media_info_max_length = 60
Hue.image_locked = false
Hue.tv_locked = false
Hue.fresh_messages_list = []
Hue.max_fresh_messages = 100
Hue.fresh_messages_duration = 3000
Hue.notifications_close_delay = 5000
Hue.chat_crop_limit = 500
Hue.userlist_open = false
Hue.old_input_val = ""
Hue.old_reply_input_val = ""
Hue.notifications_count = 0
Hue.confirm_action = function () {}
Hue.disruptive_media_minutes = 3
Hue.confirm_open = false
Hue.footer_expanded = false
Hue.last_input_text = ""

// Initial media-loading variables declarations
Hue.youtube_loading = false
Hue.youtube_loaded = false
Hue.youtube_video_player_requested = false
Hue.youtube_video_player_request = false
Hue.twitch_loading = false
Hue.twitch_loaded = false
Hue.twitch_video_player_requested = false
Hue.twitch_video_player_request = false
Hue.soundcloud_loading = false
Hue.soundcloud_loaded = false
Hue.soundcloud_video_player_requested = false
Hue.soundcloud_video_player_request = false
Hue.media_info_image_data = []
Hue.media_info_tv_data = []

// This runs after the application's load event
// This is the first function that gets executed
Hue.init = function () {
  Hue.load_date_1 = Date.now()

  Hue.create_debouncers()
  Hue.setup_separators()
  Hue.setup_markdown_regexes()
  Hue.activate_key_detection()
  Hue.setup_templates()
  Hue.get_settings()
  Hue.get_room_state()
  Hue.start_msg()
  Hue.start_settings_widgets()
  Hue.start_settings_widgets_listeners()
  Hue.setup_settings_windows()
  Hue.start_filters()
  Hue.start_image_events()
  Hue.start_dropzone()
  Hue.activate_visibility_listener()
  Hue.copypaste_events()
  Hue.scroll_events()
  Hue.resize_events()
  Hue.start_chat_mouse_events()
  Hue.start_body_events()
  Hue.start_generic_uname_click_events()
  Hue.start_user_context_menu()
  Hue.start_chat_menu_context_menu()
  Hue.start_msg_close_buttons_context_menu()
  Hue.start_search_context_menus()
  Hue.setup_show_profile()
  Hue.setup_room_menu()
  Hue.setup_input()
  Hue.setup_modal_image()
  Hue.setup_footer()
  Hue.prepare_media_settings()
  Hue.setup_message_window()
  Hue.setup_autocomplete()
  Hue.setup_fonts()
  Hue.setup_before_unload()
  Hue.setup_iframe_video()
  Hue.show_console_message()
  Hue.setup_expand_image()
  Hue.setup_local_storage()
  Hue.setup_lockscreen()
  Hue.setup_image_upload_comment()
  Hue.setup_drag_events()
  Hue.setup_open_url()
  Hue.setup_media_pickers()
  Hue.setup_generic_separators()
  Hue.setup_media_menu()
  Hue.setup_chat()
  Hue.setup_message_board()
  Hue.change_media_layout()
  Hue.setup_profile_image_cropper()
  Hue.setup_badges()
  Hue.setup_userlist_window()
  Hue.setup_user_menu()
  Hue.setup_header()
  Hue.setup_media()
  Hue.setup_activity_bar()
  Hue.setup_reply()
  Hue.start_socket_stats()
  Hue.start_media_info()
  Hue.start_modal_filters()
  Hue.setup_confirm()

  if (Hue.debug_functions) {
    Hue.wrap_functions()
  }

  Hue.start_socket()

  Hue.load_date_2 = Date.now()
}

// What to do after the user's socket joins the room
// This handles the first signal received after a successful connection
Hue.on_join = function (data) {
  Hue.connections += 1
  Hue.started = false
  Hue.started_safe = false
  Hue.image_changed = []
  Hue.tv_changed = []
  Hue.superuser = data.superuser
  Hue.alert_mode = 0

  Hue.load_date_3 = Date.now()
  Hue.loginfo("Joined Room")

  Hue.room_locked = data.room_locked

  if (data.room_locked) {
    Hue.start_locked_mode()
    return false
  }

  Hue.init_data = data
  Hue.room_name = data.room_name
  Hue.user_reg_date = data.reg_date
  Hue.userlist = data.userlist

  Hue.setup_commands()
  Hue.set_username(data.username)
  Hue.set_email(data.email)
  Hue.set_bio(data.bio)
  Hue.setup_profile_image(data.profile_image)
  Hue.generate_favicon(0)
  Hue.update_userlist()
  Hue.setup_theme_and_background(data)
  Hue.apply_background()
  Hue.apply_theme()
  Hue.setup_active_media()
  Hue.set_role(data.role, false)
  Hue.set_topic_info(data)
  Hue.update_title()
  Hue.update_user_menu()
  Hue.clear_chat()
  Hue.show_log_messages(data.log_messages)
  Hue.check_firstime()
  Hue.show_joined()
  Hue.config_room_menu()
  Hue.check_latest_highlight()
  Hue.init_message_board(data)
  Hue.start_active_media()
  Hue.fix_current_image_data()
  Hue.update_input_placeholder()

  Hue.at_startup()
}

// This executes at the end of the join function
// When the client is ready for use
Hue.at_startup = function () {
  Hue.date_joined = Date.now()
  Hue.connected = true
  Hue.started = true

  setTimeout(function () {
    Hue.started_safe = true
  }, 2000)

  Hue.process_visibility()
  Hue.load_date_4 = Date.now()
  Hue.compare_load_dates()

  setTimeout(() => {
    Hue.goto_bottom(true)
  }, 800)

  if (Hue.connections === 1) {
    Hue.make_main_container_visible()
  }
}
