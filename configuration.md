# Configuration

Refer to [config.json](config/config.json) and [config.secret.json](config/config.secret.json) to check defaults.

"main_room_id"
>The name of the main room. This is the room that will be joined when going to the root url. This room is created automatically when first joined.

"public_media_directory"
>Public location to access the media files.

"default_profilepic_url"
>The location of the default profile image.

"profilepic_loading_url"
>The location of the loading image when the profile image is changing.

"background_loading_url"
>The location of the loading image when the background image is changing.

"video_poster"
>Image to show to video element when there's no video image loaded.

"title_separator"
>Separator used to separate the room name and the topic in the browser tab's title.

"default_title"
>The default tab title of a room. This appears before the room information has been gathered to set the first title.

"default_topic"
>The shown topic when the room is created.

"max_input_length"
>Maximum amount of text for something typed in the input box. If something bigger is inputed it will get cropped to meet this limit.

"max_topic_length"
>The maximum length of a room topic. If a longer topic is tried to be set with /topic it will get cropped to meet this limit. /topicadd and /topicaddstart will throw an error if there is no more room to add to the topic.

"max_username_length"
>Maximum length for usernames.

"max_max_username_length"
>This is a safety used when validating usernames on login. In case max or min username length configurations where changed when there were already users registered, this arbitrary big number is used to check something huge is not being inputed instead of checking with the username length configuration options, to avoid old username from not being able to login. This likely shouldn't be changed.

"min_password_length"
>Minimum length for passwords. It must be at least 1.

"max_password_length"
>Maximum length for passwords.

"max_max_password_length"
>Same as max_max_username_length but for passwords.

"max_room_name_length"
>Max length for room names.

"upload_slice_size"
>The size of file slices to be uploaded.

"max_media_source_length"
>Maximum length of a media source urls.

"max_log_messages"
>Maximum amount of messages to store in room logs. It stores chat messages and some notifications like image uploads and tv changes.

"max_admin_log_messages"
>Maximum amount of messages to store in room admin logs. It stores information about the most recent admin activity.

"max_title_length"
>Maximum length for the tab's title. Title consists of "room_name - topic" and is set automatically. If title is bigger it gets cropped.

"max_image_size"
>Maximum image size allowed in KB. This is checked both in the client and server. If the image is bigger it won't be uploaded.

"max_profilepic_size"
>Maximum image size allowed for profile images.

"max_video_size"
>Maximum video size allowed in KB. This is checked both in the client and server. If the video is bigger it won't be uploaded.

"youtube_enabled"
>Whether Youtube features are enabled.

"imgur_enabled"
>Whether Imgur features are enabled.

"iframes_enabled"
>Whether embedded iframes are enabled.

"max_url_length"
>Url lengths beyond this are ignored by the system. This is to avoid triggering actions on urls that are likely wrong or meant as an attack.

"max_stored_image"
>The amount of most recent images to have stored in a room.

"max_stored_tv"
>The amount of most recent videos to have stored in a room.

"settings_default_highlight_current_username"
>Whether current username triggers a highlight by default.

"settings_default_case_insensitive_username_highlights"
>Whether highlights for current username are case insensitive by default.

"settings_default_open_whispers_automatically"
>Whether popup messages will open automatically when arrived by default.

"settings_default_embed_images"
>Whether to embed other images by default.

"settings_default_show_link_previews"
>Whether links get a preview on the chat area by default.

"settings_default_show_highlight_notifications"
>Whether to show desktop notifications on highlights, by default.

"settings_default_show_activity_notifications"
>Whether to show activity notifications on highlights, by default.

"settings_default_show_user_join_notifications"
>Whether to show notifications when users join by default.

"settings_default_show_user_leave_notifications"
>Whether to show notifications when users leave by default.

"settings_default_stop_radio_on_tv_play"
>Whether to stop the radio when the tv starts playing.

"settings_default_stop_tv_on_radio_play"
>Whether to stop the tv when the radio starts playing.

"room_state_default_image_enabled"
>Whether images will be enabled by default.

"room_state_default_tv_enabled"
>Whether tv will be enabled by default.

"room_state_default_last_highlight_date"
>Default date to check for new highlights to announce at startup.

"room_state_default_chat_display_percentage"
>Default percentage of the width the chat area will have in new rooms.

"room_state_default_tv_display_percentage"
>Default percentage of the height the tv will have in the split media area in new rooms.

"room_state_default_tv_display_position"
>Default position the tv will have in the split media area in new rooms. (top or bottom)

"room_state_default_media_layout"
>Default media area (image, tv) layout, either column or row.

"room_state_default_chat_font_size"
>Default chat font size

"room_state_default_radio_volume"
>Default volume for radio players.

"room_state_default_radio_enabled"
>Whether the radio is enabled by default.

"room_state_default_main_layout"
>Default main layout, column or row.

"room_state_default_last_message_board_post"
>Default last message board post.

"room_state_default_chat_enabled"
>Whether chat is enabled by default.

"room_state_default_radio_dj_delay"
>Change radio station automatically after x minutes if radio dj is on.

"room_state_default_radio_dj_delay"
>Whether the radio dj is enabled by default.

"room_state_default_media_info_enabled"
>Whether to show media info below image and tv.

"room_state_default_notifications_enabled"
>Whether notification popups get shown by default.

"max_same_post_diff"
>Maximum difference in time between a message and and another from the same user to be displayed within the same post.

"max_same_post_diff"
>Maximum messages within a post. After this a new post is displayed.

"typing_delay"
>Send a typing emit if at least this ms passed after the last typing emit.

"max_typing_inactivity"
>After the last typing signal has being received, it will stop showing the typing status after this amount of time.

"media_changed_crop_limit"
>How many items are stored in images_changed and tv_changed.

"chat_crop_limit"
>Max number of messages to keep on the client.

"input_history_crop_limit"
>Max number of recent input history items saved.

"whispers_crop_limit"
>Max number of whisper items to show.

"notifications_crop_limit"
>How many notifications after the notifications items get cropped in the notifications window.

"radio_history_crop_limit"
>How many radio history items can exist at the same time.

"socket_emit_throttle"
>Throttle on socket emits on the client.

"safe_limit_*"
>Generic limits used to check data length.

"profilepic_diameter"
>The diameter of the cropped profile image selected by the user.

"max_num_newlines"
>Maximum amount of newlines allowed per message.

"image_change_cooldown"
>How much it should wait in milliseconds before images can be changed again after last change.

"tv_change_cooldown"
>How much it should wait in milliseconds before tv can be changed again after last change.

"max_sockets_per_user"
>How many active sockets a user can have at the same time. After this limit all incoming socket connections are dropped.

"activity_bar_delay"
>How often to check for obsolete items in the top activity bar to remove them.

"max_activity_bar_items"
>Maximum amount of top activity bar items at the same time.

"url_title_max_length"
>Maximum length for urls to be shown fully in window titles. After this they get cropped and "..." is added.

"max_bio_length"
>Character length of user bios.

"max_bio_lines"
>Maximum number of linebreaks allowed in user bios.

"max_info_popups"
>How many info popups (bottom right) can be displayed at once. After this, the older ones get closed.

"max_media_comment_length"
>Maximum length of comments on media change.

"max_message_board_posts"
>How big the message board is. How many posts it stores.

"max_message_board_post_length"
>How long message board posts can be.

"max_displayed_url"
>Max length of urls in chat.

"commands_prefix"
>The character before commands.

>For example "/" in "/somecommand"

"max_activity_username_length"
>How wide usernames on the activity bar can be.

"radios"
>Radios to autostart [ {"name": somename, "url": someurl, "metadata": someurl} ]

"radio_metadata_check_delay"
>How often make a metadata check while app radio window is open.

"radio_slide_delay"
>Slide the radio items to the edge x ms after mouseleave.

"radio_unslide_delay"
>Show the radio items fully x ms after mouseenter.

"chat_display_percentage_column"
>Chat display percentage when revolving to column mode.

"chat_display_percentage_row"
>Chat display percentage when revolving to row mode.

"max_media_info_length"
>Max length for info under media.

"screen_capture_durations"
>How long in seconds tv screen capture videos can be.

"image_blob_quality"
>Quality for rendered image blobs.


## config.secret.json

"youtube_api_key"
>The Youtube v3 Api key used to fetch video information from urls or to search for videos by search terms using /tv.

"session_secret"
>Used for express-session security. Change it to anything you want.

"jwt_secret"
>Secret key for the jwt system when logging in.

"recaptcha_key"
>Public google recaptcha key.

"recaptcha_secret_key"
>Secret google recaptcha key.

"imgur_client_id"
>Imgur client id.

"db_store_path"
>Where the database of users and rooms reside.

"media_directory"
>Internal path to were media files (user & rooms images etc) are stored.

"files_loop_delay"
>Interval of the loop (in minutes) to check for expired files that failed to be uploaded properly and delete them from memory.

"files_loop_max_diff"
>Amount of time for file upload to be inactive for it to be considered expired.

"max_room_id_length"
>Arbitrary big number to avoid big urls from being considered as valid room ids.

"anti_spam_max_limit"
>The bigger the number the more the anti-spam system tolerates.

"anti_spam_ban_duration"
>How much time in minutes a user is banned from the system after being detected as a spammer by the automatic spam detection system.

"anti_spam_check_delay"
>Checks connections every x ms to unban and reduce levels.

"upload_spam_charge"
>The higher this number is, the slower it adds spam on file upload.

"session_cookie_max_age"
>The amount of time a session cookie is valid. This cookie determines if a user needs to login again when entering.

"encryption_cost"
>This is used for the password hashing. A cost of 12 are 4096 salt rounds. The more rounds, the more secure the hash is, but it takes longer to process.

"jwt_expiration"
>How long jwt will be valid after login.

"max_jwt_token_length"
>Max length of the jwt token.

"max_message_id_length"
>Maximum length for message ids (like chat message or media change ids)

"max_user_id_length"
>After this length, this is clearly not a user id.

"recaptcha_enabled"
>Whether recaptcha verification is used at registration.

"data_max_items"
>Maximum amount of data items allowed in socket emits.

"data_items_max_string_length"
>Used to check string data.

"data_items_max_number_length"
>Used to check number data.

"redis_max_link_age"
>How old link data has to be to be fetched again.

"link_fetch_timeout"
>Maximum time to get a response when fetching link data.

"link_max_title_length"
>After this the title from fetched link metadata gets cropped.

"link_max_description_length"
>After this the description from fetched link metadata gets cropped.

"link_max_image_length"
>After this the title from fetched link metadata gets ignored.

"db_write_file_timeout"
>Timeout for DB write file cache.

"db_write_file_timeout_limit"
>Max time without saving a file after a write call.

"https_enabled"
>Defaults to true for security reasons. If deployed in a non-https environment set it to false. In order for it to be really enabled the Node environment must be set to production. If true, some non https media will be blocked. It's recommended to setup a full https site to conform to current standards. Check out Let's Encrypt.

"site_root"
>The root url where the system will work. Needs a slash at the end.

"default_main_room_name"
>The default name of the main room. Just like any room, this can be changed later.

"login_title"
>The title of the login page.

"register_title"
>The title of the registration page.

"default_room_background_color"
>The initial background color for new rooms.

"default_room_text_color"
>The initial text color for new rooms.

"system_username"
>Reserved username for system messages.

"roomlist_check_delay"
>Update the rooms list every x ms.

"message_board_wait_delay"
>The amount of minutes to wait between message board posts for non admin users.


## Join Flags

"alternative" (boolean)
>Meant to be used for bots or similar, to connect without using the normal login portal.

>Failure to authenticate will result in a temporary ban to avoid abuse.

"no_message_log" (boolean)
>If true, the server will not send the message log on join, which can save some bandwidth.