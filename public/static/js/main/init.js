// Main Hue Object
// All client variables and functions go here
const Hue = {}

// Load dates are used to check initial load performance
Hue.load_date_1 = Date.now()

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
Hue.ls_global_settings = "global_settings_v1"
Hue.ls_room_settings = "room_settings_v1"
Hue.ls_room_state = "room_state_v1"
Hue.ls_input_history = "input_history_v17"
Hue.ls_first_time = "first_time_v2"
Hue.vtypes = ["voice1", "voice2", "voice3", "voice4"]
Hue.roles = ["admin", "op"].concat(Hue.vtypes)
Hue.topic = ''
Hue.topic_setter = ''
Hue.topic_date = ''
Hue.colorlib = ColorLib()
Hue.played = []
Hue.input_history = []
Hue.input_history_index = 0
Hue.userlist = []
Hue.usernames = []
Hue.all_usernames = []
Hue.role = ''
Hue.can_chat = false
Hue.can_images = false
Hue.can_radio = false
Hue.can_tv = false
Hue.tab_info = {}
Hue.create_room_open = false
Hue.open_room_open = false
Hue.radio_picker_open = false
Hue.tv_picker_open = false
Hue.image_picker_open = false
Hue.goto_room_open = false
Hue.import_settings_open = false
Hue.background_image_input_open = false
Hue.admin_list_open = false
Hue.ban_list_open = false
Hue.upload_comment_open = false
Hue.modal_image_number_open = false
Hue.change_user_username_open = false
Hue.change_user_password_open = false
Hue.change_user_email_open = false
Hue.media_menu_open = false
Hue.writing_reply = false
Hue.modal_open = false
Hue.started = false
Hue.started_safe = false
Hue.afk = false
Hue.alert_mode = 0
Hue.commands_list_sorted = {}
Hue.commands_list_sorted_2 = {}
Hue.utilz = Utilz()
Hue.change_image_when_focused = false
Hue.change_tv_when_focused = false
Hue.change_radio_when_focused = false
Hue.room_images_mode = "enabled"
Hue.room_tv_mode = "enabled"
Hue.room_radio_mode = "enabled"
Hue.radio_started = false
Hue.background_image_setter = ""
Hue.background_image_date = ""
Hue.files = {}
Hue.input_changed = false
Hue.youtube_video_play_on_queue = false
Hue.message_id = 0
Hue.chat_content_container_id = 0
Hue.popup_message_id = 0
Hue.popup_id = 0
Hue.writing_message = false
Hue.double_tap_key_pressed = 0
Hue.double_tap_key_2_pressed = 0
Hue.double_tap_key_3_pressed = 0
Hue.images_visible = true
Hue.tv_visible = true
Hue.radio_visible = true
Hue.images_changed = []
Hue.tv_changed = []
Hue.radio_changed = []
Hue.modal_image_open = false
Hue.current_image_data = {}
Hue.filter_delay = 350
Hue.resize_delay = 350
Hue.double_tap_delay = 250
Hue.wheel_delay = 100
Hue.wheel_delay_2 = 25
Hue.check_scrollers_delay = 100
Hue.requesting_roomlist = false
Hue.emit_queue = []
Hue.app_focused = true
Hue.message_unames = ""
Hue.message_type = ""
Hue.stop_radio_delay = 0
Hue.aura_timeouts = {}
Hue.reaction_types = ["like", "love", "happy", "meh", "sad", "dislike"]
Hue.mouse_over_reactions = false
Hue.reactions_hover_delay = 500
Hue.reactions_hover_delay_2 = 1000
Hue.user_functions = [1, 2, 3, 4, 5, 6, 7, 8]
Hue.speeches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Hue.mouse_is_down = false
Hue.draw_message_just_entered = false
Hue.draw_image_just_entered = false
Hue.draw_image_mode = "pencil"
Hue.draw_image_scale = 2.4
Hue.draw_image_num_strokes_save = 500
Hue.draw_image_max_levels = 200
Hue.draw_image_open = false
Hue.highlight_same_posts_timeouts = {}
Hue.highlight_same_posts_delay = 800
Hue.radio_get_metadata_ongoing = false
Hue.radio_get_metadata = false
Hue.log_messages_processed = false
Hue.command_aliases = {}
Hue.commands_queue = {}
Hue.user_leaving = false
Hue.admin_activity_filter_string = ""
Hue.access_log_filter_string = ""
Hue.keys_pressed = {}
Hue.hide_infotip_delay = 2000
Hue.active_modal = false
Hue.activity_list = []
Hue.HOUR = 3600000
Hue.DAY = 86400000
Hue.YEAR = 31536000000
Hue.editing_message = false
Hue.editing_message_container = false
Hue.editing_message_area = false
Hue.synth_timeout_delay = 800
Hue.synth_recent_users = []
Hue.synth_open = false
Hue.synth_voice_speeches = []
Hue.local_storage_to_save = {}
Hue.local_storage_save_delay = 250
Hue.sending_whisper = false
Hue.small_scroll_amount = 250
Hue.fresh_messages_list = []
Hue.max_fresh_messages = 100
Hue.fresh_messages_duration = 2000
Hue.autoscrolling = false
Hue.chat_scrolled = false
Hue.lockscreen_peek_delay = 1000
Hue.lockscreen_peek_active = false
Hue.context_menu_open = false
Hue.upload_comment_file = false
Hue.upload_comment_type = false
Hue.just_tabbed = false
Hue.update_input_placeholder_delay = 10000
Hue.update_lockscreen_clock_delay = 10000
Hue.screen_locked = false
Hue.userlist_mode = "normal"
Hue.usercount = 0
Hue.quote_max_length = 200
Hue.markdown_regexes = {}
Hue.show_media_history_type = ""
Hue.add_to_chat_searches_delay = 2000
Hue.reactions_box_open = false
Hue.first_media_change = false
Hue.calc_round_places = 10
Hue.media_icons = {image: "fa-camera", tv: "fa-tv", radio: "fa-volume-up"}
Hue.typing_delay = 100
Hue.loaded_image = {}
Hue.loaded_tv = {}
Hue.loaded_radio = {}
Hue.open_profile_username = false
Hue.send_badge_disabled = false
Hue.info_popups = []
Hue.last_media_sync = Date.now()

// Initial media-loading variables declarations
Hue.youtube_loading = false
Hue.youtube_loaded = false
Hue.youtube_player_requested = false
Hue.youtube_player_request = false
Hue.youtube_video_player_requested = false
Hue.youtube_video_player_request = false
Hue.twitch_loading = false
Hue.twitch_loaded = false
Hue.twitch_video_player_requested = false
Hue.twitch_video_player_request = false
Hue.soundcloud_loading = false
Hue.soundcloud_loaded = false
Hue.soundcloud_player_requested = false
Hue.soundcloud_video_player_requested = false
Hue.soundcloud_video_player_request = false
Hue.vimeo_loading = false
Hue.vimeo_loaded = false
Hue.vimeo_video_player_requested = false
Hue.vimeo_video_player_request = false
Hue.hls_loading = false
Hue.tone_loading = false
Hue.math_loading = false
Hue.wordz_loading = false

// This runs after the application's load event
// This is the first function that gets executed
Hue.init = function()
{
    Hue.create_debouncers()
    Hue.setup_separators()
    Hue.setup_markdown_regexes()
    Hue.activate_key_detection()
    Hue.setup_templates()
    Hue.get_global_settings()
    Hue.get_room_settings()
    Hue.get_room_state()
    Hue.start_msg()
    Hue.start_settings_widgets("global_settings")
    Hue.start_settings_widgets_listeners("global_settings")
    Hue.start_settings_widgets("room_settings")
    Hue.start_settings_widgets_listeners("room_settings")
    Hue.setup_settings_windows()
    Hue.setup_radio_widget()
    Hue.start_filters()
    Hue.start_image_events()
    Hue.start_dropzone()
    Hue.start_volume_scroll()
    Hue.generate_highlight_words_regex()
    Hue.generate_ignored_words_regex()
    Hue.activate_visibility_listener()
    Hue.copypaste_events()
    Hue.scroll_events()
    Hue.resize_events()
    Hue.setup_commands()
    Hue.start_chat_mouse_events()
    Hue.start_chat_hover_events()
    Hue.start_body_events()
    Hue.start_played_click_events()
    Hue.start_roomlist_click_events()
    Hue.start_generic_uname_click_events()
    Hue.start_user_context_menu()
    Hue.start_played_context_menu()
    Hue.start_volume_context_menu()
    Hue.start_toggle_radio_context_menu()
    Hue.start_room_menu_context_menu()
    Hue.start_tv_maxer_context_menu()
    Hue.start_chat_maxer_context_menu()
    Hue.start_footer_media_label_context_menu()
    Hue.start_chat_menu_context_menu()
    Hue.start_msg_close_buttons_context_menu()
    Hue.start_search_context_menus()
    Hue.start_titles()
    Hue.setup_show_profile()
    Hue.setup_room_menu()
    Hue.setup_input()
    Hue.setup_input_history()
    Hue.setup_modal_image()
    Hue.setup_footer()
    Hue.setup_reactions_box()
    Hue.prepare_media_settings()
    Hue.setup_message_area()
    Hue.setup_draw_image()
    Hue.setup_autocomplete()
    Hue.setup_modal_image_number()
    Hue.setup_command_aliases()
    Hue.setup_fonts()
    Hue.setup_before_unload()
    Hue.start_chat_reply_events()
    Hue.maxers_mouse_events()
    Hue.check_screen_lock()
    Hue.setup_iframe_video()
    Hue.setup_synth()
    Hue.show_console_message()
    Hue.setup_expand_image()
    Hue.setup_local_storage()
    Hue.get_ignored_usernames_list()
    Hue.get_accept_commands_from_list()
    Hue.setup_lockscreen()
    Hue.setup_upload_comment()
    Hue.setup_drag_events()
    Hue.setup_open_url()
    Hue.setup_user_functions()
    Hue.setup_header()
    Hue.setup_media_pickers()
    Hue.setup_generic_separators()
    Hue.setup_media_menu()

    if(Hue.debug_functions)
    {
        Hue.wrap_functions()
    }

    Hue.start_socket()

    Hue.load_date_2 = Date.now()
}

// What to do after the user's socket joins the room
// This handles the first signal received after a successful connection
Hue.on_join = function(data)
{
    Hue.load_date_3 = Date.now()

    console.info("Joined Room")

    Hue.init_data = data
    Hue.room_locked = data.room_locked

    if(Hue.room_locked)
    {
        Hue.start_locked_mode()
        return false
    }

    Hue.room_name = data.room_name
    Hue.set_username(data.username)
    Hue.set_email(data.email)
    Hue.set_bio(data.bio)
    Hue.user_reg_date = data.reg_date
    Hue.setup_profile_image(data.profile_image)
    Hue.userlist = data.userlist
    Hue.update_userlist()
    Hue.log_enabled = data.log
    Hue.log_messages = data.log_messages
    Hue.setup_theme_and_background(data)
    Hue.apply_background()
    Hue.apply_theme()
    Hue.setup_active_media(data)
    Hue.start_permissions(data)
    Hue.is_public = data.public
    Hue.set_role(data.role, false)
    Hue.set_topic_info(data)
    Hue.update_title()
    Hue.setup_user_menu()
    Hue.clear_chat()
    Hue.check_firstime()
    Hue.get_input_history()
    Hue.show_joined()
    Hue.check_media_maxers()
    Hue.config_room_menu()
    Hue.start_metadata_loop()
    Hue.goto_bottom()
    Hue.make_main_container_visible()
    Hue.setup_activity_bar()
    Hue.setup_input_placeholder()
    Hue.start_active_media()
    Hue.check_latest_highlight()
    Hue.setup_userlist_window()
    Hue.setup_image_picker()

    Hue.at_startup()
}

// This executes at the end of the join function
// When the client is ready for use
Hue.at_startup = function()
{
    Hue.date_joined = Date.now()
    Hue.started = true

    if(Hue.first_time)
    {
        return false
    }

    Hue.execute_commands("at_startup")

    setTimeout(function()
    {
        Hue.started_safe = true
    }, 2000)

    Hue.process_visibility()
    Hue.load_date_4 = Date.now()
    Hue.compare_load_dates()
}