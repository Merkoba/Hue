module.exports = function (c, config) {
  // Automatically includes all global settings and room state config options
  for (let key in config) {
    if (
      key.startsWith("settings_default") ||
      key.startsWith("room_state_default")
    ) {
      c.vars[key] = config[key]
    }
  }

  // Fills the config object with relevant config options
  c.vars.main_room_id = config.main_room_id
  c.vars.default_image_source = config.default_image_source
  c.vars.default_tv_source = config.default_tv_source
  c.vars.default_tv_title = config.default_tv_title
  c.vars.default_tv_type = config.default_tv_type
  c.vars.max_input_length = config.max_input_length
  c.vars.max_topic_length = config.max_topic_length
  c.vars.max_username_length = config.max_username_length
  c.vars.max_max_username_length = config.max_max_username_length
  c.vars.max_room_name_length = config.max_room_name_length
  c.vars.max_media_source_length = config.max_media_source_length
  c.vars.max_title_length = config.max_title_length
  c.vars.max_image_size = config.max_image_size
  c.vars.max_tv_size = config.max_tv_size
  c.vars.topic_separator = config.topic_separator
  c.vars.title_separator = config.title_separator
  c.vars.default_title = config.default_title
  c.vars.default_topic = config.default_topic
  c.vars.youtube_enabled = config.youtube_enabled
  c.vars.imgur_enabled = config.imgur_enabled
  c.vars.iframes_enabled = config.iframes_enabled
  c.vars.min_password_length = config.min_password_length
  c.vars.max_password_length = config.max_password_length
  c.vars.default_profilepic_url = config.default_profilepic_url
  c.vars.profilepic_loading_url = config.profilepic_loading_url
  c.vars.default_background_url = config.default_background_url
  c.vars.background_loading_url = config.background_loading_url
  c.vars.upload_slice_size = config.upload_slice_size
  c.vars.max_same_post_diff = config.max_same_post_diff
  c.vars.max_same_post_messages = config.max_same_post_messages
  c.vars.typing_delay = config.typing_delay
  c.vars.max_typing_inactivity = config.max_typing_inactivity
  c.vars.default_video_url = config.default_video_url
  c.vars.media_changed_crop_limit = config.media_changed_crop_limit
  c.vars.apps_crop_limit = config.apps_crop_limit
  c.vars.socket_emit_throttle = config.socket_emit_throttle
  c.vars.safe_limit_1 = config.safe_limit_1
  c.vars.safe_limit_2 = config.safe_limit_2
  c.vars.safe_limit_3 = config.safe_limit_3
  c.vars.safe_limit_4 = config.safe_limit_4
  c.vars.profilepic_diameter = config.profilepic_diameter
  c.vars.max_num_newlines = config.max_num_newlines
  c.vars.activity_bar_interval = config.activity_bar_interval
  c.vars.max_activity_bar_items = config.max_activity_bar_items
  c.vars.url_title_max_length = config.url_title_max_length
  c.vars.max_bio_length = config.max_bio_length
  c.vars.max_bio_length = config.max_bio_length
  c.vars.max_bio_lines = config.max_bio_lines
  c.vars.max_info_popups = config.max_info_popups
  c.vars.notifications_crop_limit = config.notifications_crop_limit
  c.vars.notifications_close_delay = config.notifications_close_delay
  c.vars.whispers_crop_limit = config.whispers_crop_limit
  c.vars.max_whispers_post_length = config.max_whispers_post_length
  c.vars.max_media_comment_length = config.max_media_comment_length
  c.vars.max_message_board_post_length = config.max_message_board_post_length
  c.vars.max_message_board_posts = config.max_message_board_posts
  c.vars.max_audioclip_size = config.max_audioclip_size
  c.vars.system_username = config.system_username
  c.vars.commands_prefix = config.commands_prefix
  c.vars.quote_max_length = config.quote_max_length
  c.vars.max_log_messages = config.max_log_messages
  c.vars.max_displayed_url = config.max_displayed_url
  c.vars.max_activity_username_length = config.max_activity_username_length
  c.vars.public_media_directory = config.public_media_directory
  c.vars.chat_crop_limit = config.chat_crop_limit
  c.vars.autostart_apps = config.autostart_apps
  c.vars.max_low_users = config.max_low_users
  c.vars.app_metadata_check_delay = config.app_metadata_check_delay
}