![](https://i.imgur.com/yNjjNiQ.jpg)

# What Is It

Hue is a whole new platform to have fun with other people online.

It allows real time communication while watching, or listening to media.

It provides 3 different media spots that can all be active at once, or just the ones you, as an admin of the room want, or you, as the user want.

These are Images, TV, and Radio.
Images can be any image, either uploaded, drawn (there's a built-in drawing pad to draw an image), or linked. Search queries can be enabled to search images on Imgur. When the image is clicked it opens a modal where current and previous images can be seen in full screen.

TV can be any video link. It embeds videos from YouTube, Soundcloud, Twitch, Vimeo, video files, or even websites that are embeded in an iframe. Search queries can be enabled to search videos on YouTube.

Radio can be any radio, or audio, link. It embeds YouTube, Soundcloud, audio files, or radio streams. If it detects an Icecast stream it will try to fetch metadata to show live song information. Search queries can be enabled to search audio on YouTube.

The radio is shown and controlled on the top panel.
Images and TV reside in the media area on the right.
Images and TV can change their proportion or position.

Any of these can be hidden (not visible, and inactive), or locked (it will stay the same for the user, even if the media was changed).

Media domains can be configured to use a whitelist or a blacklist. This is to control if you want, for instance, only images from a trusted source.

There's also a synthesizer which allows users to play notes or send text-to-speech messages.

Room administrators have a lot of control over how the room looks and behaves.
The room can change it's background color (called Theme), which changes the background color of the middle section and a contrast color for the panels.
The room can have a background image which is visible enough to not mess with the text readability. This background can be a normal image, a tiled image, the current Image mirrored, the current Image mirrored and tiled, or just a solid color (no image). There's also background effects available like Blur for background images.

Admins can also enable, disable, or lock (nobody can change it, not) media.

There's a user system. Admins, Operators, Voice 1, Voice 2, Voice 3, and Voice 4.
Admins and Operators have basically the same rights, except only Admins can add or remove Operators or other Admins. They have access to the room controls, which are located in the Main Menu at the top. The 4 different types of Voice users can be configured to suit what works best for your room. For instance you can say Voice 1 has all features enabled, but Voice 2 can't change the TV. Users can be kicked or banned too.

There's a real time private message system called Whispers. You can send a Whisper to another user as long as they are online. A popup message will appear in their screen, to which they can reply. Whispers are only visible to the senders and receivers. There's a drawing pad to send drawings in the Whispers. This Whisper system is also good for controlling bots (see Huebot), since orders can be sent to them to trigger an action.

There's a User Settings system that configures many features of the application for users on a personal level. This consists of two categories, Global Settings, and Room Settings. These are both the same settings except whatever is changed in Global Settings affects all rooms, whereas in Room Settings, when a setting is overriden, it affects only the current room.

There's a log system. If active, a room will remember the most recent posts and media activity, so they're visible to users entering the room. This is currently the last 250 messages. This can be disabled or cleared at any time.

There is a socket anti-spam system which kicks and bans users temporarily after they spam over a configured threshold.

Users can create their own room, where they are Admins as default. There's a cooldown after creating a room for creating another one, this is to avoid room creation spam.

There are Visited Rooms and Public Rooms lists. Visited Rooms shows the status of rooms you have visited recently, while Public Rooms show rooms that are set to public and have had activity recently.

There is a global ad system that supports either image ads or text ads.

Creating an account is email based. There is no third party auth, except an optional ReCaptcha. This is to retain some autonomy and avoid complexity. After registration, a confirmation link is sent, clicking it is required to activate the account and be able to login. There is a password recovery feature if a valid email is provided. Currently a Mailgun account is required to handle email sending. The username, password, and email can be changed. Email change requires a verification link in the new email address to be clicked.


# Installation

Requirements:
- Node 10+
- MongoDB 3+
- Redis 3+

Configuration is done in user_config.json and user_config.secret.json files placed in the config directory. You must create these files. If they are not going to be used, create empty json objects like {}, or error messages will be shown at startup.

Editing those files overrides settings in the default configuration files. The point of having separate files is so the default config files can be changed during an update while the user config files remain intact.

Example of how to use user_config.json:

```javascript
{
	"site_root": "https://mysite.com",
	"min_password_length": 3
}
```

Example of how to use user_config.secret.json:

```javascript
{
	"youtube_api_key": "Avjioa5awfFF445234fAFDvF",
	"superuser_emails": ["me@somedomain.com"]
}
```

The admin email must go in superuser_emails in user_config.secret.json. It's used to take over control of the main room. The main room is created on first join, with no roles. To get admin on the room use /annex.

To have a fully working system, as it is intended, getting all the API keys (YouTube, Twitch, Soundcloud, Imgur, Vimeo) is very recommended. If you don't need some of these, disable them in user_config.json (for example "youtube_enabled": false) Mailgun api key is necessary for account creation and password recovery, so it must be provided. A Google Recaptcha key is necessary to enable captcha verification on registration, though captcha support can be disabled ("recaptcha_enabled": false). Hosting of uploaded images through an S3 service is supported, yet optional. To enable S3 support, set "image_storage_s3_or_local" to "s3". Set API keys in user_config.secret.json.

Put the files in the directory you want it work and call "npm install". That should install all necessary packages. 

You will also need MongoDB installed in your computer, and the mongod daemon running.

>systemctl start mongod

There is no need to create database tables, all of that is done automatically.

Redis is now required, to store link metadata in database 10. Install and setup Redis.

Bundle the client files

Go to /utils and do:

>./bundle_all

To run it properly in production you will have to configure Apache or some other webserver to use a reverse proxy. A sample vhost configuration for Apache (apache_vhost.conf) is included. For using https, LetsEncrypt is suggested.

Using pm2 is suggested to control the Node process. PM2 will likely use the user's home directory as root.

>su - node -c "pm2 start hue/server/www --env production"

That's an example of starting it with the user "node" in a production environment.

If you ever need to access the MongoDB database:

>sudo mongo

>use hue

If you want to remove it to start fresh:

>db.dropDatabase()

If you're going to use text ads, create a json file called text_ads.json in /data (default name and location, this can be changed), which consists of an array of strings.
For example: ["Ad #1", "Ad #2", "Ad #3"]

# Configuration

"https_enabled"
>Defaults to true for security reasons. If deployed in a non-https environment set it to false. In order for it to be really enabled the Node environment must be set to production. If true, some non https media will be blocked. It's recommended to setup a full https site to conform to current standards. Check out Let's Encrypt.

"site_root"
>The root url where the system will work. Needs a slash at the end.

"image_storage_s3_or_local"
>Whether to serve images locally or hosted on an S3 service.

"main_room_id"
>The name of the main room. This is the room that will be joined when going to the root url. This room is created automatically when first joined. To get ownership of the room "/claim secretpass" is needed.

"default_main_room_name"
>The default name of the main room. Just like any room, this can be changed later.

"images_directory"
>The directory where uploaded images will be stored.

"public_images_location"
>The public root of images. For example a public_images_location of /img/ would send public image urls as /img/image.jpg, which would reside in public/img/. Needs a slash at the end.

"default_image_source"
>Default source for the image for new rooms or when "/image default" is issued.

"default_tv_source"
>Default source for the tv for new rooms or when "/tv default" is issued.

"default_tv_title"
>The title for the default tv.

"default_tv_type"
>The type of the default_tv_source, either "video", "youtube", "twitch", "soundcloud" or "iframe".

"default_radio_source"
>The default radio url used for new rooms or when "/radio default" is issued.

"default_radio_title"
>The title for the default radio. This is what is shown in "Now Playing" on top. If radio source is of type "audio", the title will dynamically change to current playing song if the Icecast radio source is configured correctly.

"default_radio_type"
>The type of the default_radio_source, either "audio", "youtube" or "soundcloud".

"default_profile_image_url"
>The location of the default profile image.

"profile_image_loading_url"
>The location of the loading image when the profile image is changing.

"default_background_image_url"
>The location of the default background image.

"background_image_loading_url"
>The location of the loading image when the background image is changing.

"default_video_url"
>Image to show to video element when there's no video image loaded.

"mongodb_path"
>The path to the MongoDB database. The name can be anything as long as the port is correct.

"topic_separator"
>Separator used between topic sections. Used when using /topicadd, which adds a new piece of topic at the end of the current topic. Also used when calculating the removal of these topic sections.

"title_separator"
>Separator used to separate the room name and the topic in the browser tab's title.

"default_title"
>The default tab title of a room. This appears before the room information has been gathered to set the first title.

"login_title"
>The title of the login page.

"register_title"
>The title of the registration page.

"default_topic"
>The shown topic when the room has been created or claimed and there is no topic yet.

"default_topic_admin"
>Default topic shown to admins.

"radio_metadata_interval_duration"
>The interval in milliseconds to check for radio metadata. This only occurs when an internet radio url is set as the radio source, for example it won't check if there's a youtube video set.

"radio_retry_metadata_delay":
>After fetching the radio metadata fails, it will stop trying to fetch it. It will resume after this delay.

"opacity_amount_x"
>Opacity levels used through out the interface.

"color_contrast_amount_x"
>Color contrast levels used through out the interface.

"chat_crop_limit"
>After this number of chat messages on the screen, the oldest ones will start to get removed so there's always this maximum amount of messages displayed. This is to avoid having a huge amount of text in memory in case it is opened for a long time.

"played_crop_limit"
>Same as chat_crop limit but for items displayed when "Now Playing" is clicked.

"input_history_crop_limit"
>The maximum amount of items stored in the input history. These are the commands you have issued in the input box, which can be traversed through Up and Down keyboard arrows to repeat them. They can also view viewed in the History window.

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

"max_email_length"
>Maximum length for email addresses.

"max_max_email_length"
>Same as max_max_username_length but for emails.

"password_reset_limit"
>How long a user must wait to perform another password reset.

"password_reset_expiration"
>How long a reset password link will be valid.

"max_room_name_length"
>Max length for room names.

"max_room_id_length"
>Arbitrary big number to avoid big urls from being considered as valid room ids. Mongo ids are approximately 24 chars in length as for 2017.

"room_loop_interval"
>The interval in milliseconds for the loop that saves iterates through a rooms object which is updated through chat activity and saves it to the database. This loops is to avoid saving data, like log messages, to the database on every message.

"files_loop_interval"
>Interval of the loop to check for expired files that failed to be uploaded properly and delete them from memory.

"files_loop_max_diff"
>Amount of time for file upload to be inactive for it to be considered expired.

"upload_slice_size"
>The sice of file slices to be uploaded.

"max_image_source_length"
>Maximum length of a image source url.

"max_tv_source_length"
>Maximum length of a tv source url.

"max_radio_source_length"
>Maximum length of a radio source url.

"max_roomlist_items"
>Maximum amount of items cached and shown when requesting the Public Rooms list.

"max_roomlist_topic_length"
>Maximum displayed topic of a room in room lists. If topic is bigger it gets cropped.

"max_log_messages"
>Maximum amount of messages to store in room logs. It stores chat messages and some notifications like image uploads and radio changes.

"max_admin_log_messages"
>Maximum amount of messages to store in room admin logs. It stores information about the most recent admin activity.

"max_access_log_messages"
>Maximum amount of messages to store in room access logs. It stores information about user join and quit activity.

"max_visited_rooms_items"
>Maximum amount of items shown in the Visited Rooms list.

"max_title_length"
>Maximum length for the tab's title. Title consists of "room_name - topic" and is set automatically. If title is bigger it gets cropped.

"max_image_size"
>Maximum image size allowed in KB. This is checked both in the client and server. If the image is bigger it won't be uploaded.

"max_image_size_bytes"
>Maximum image size allowed in Bytes.

"max_profile_image_size"
>Maximum image size allowed for profile images.

"small_keyboard_scroll"
>The amount scrolled in pixels for a small, normal, scroll. By using shift + up or shift + down.

"big_keyboard_scroll"
>The amount scrolled in pixels for a bigger scroll. By using pageUp or pageDown.

"afk_timeout_duration"
>When a user has had the tab unfocused (changing applications is currently not detected as being unfocused by browsers, so this means being on a different tab) for this amount of time, the user will be considered internally as afk. When afk is true it the tab won't load new changed images until the user focuses the tab again. This is to be avoid an abandoned tab from loading lots of images for no purpose, to save bandwidth.

"roomlist_cache"
>When the public rooms list is requested, it will get cached so subsequent requests won't trigger a whole analysis again, to save processing power. This controls how long that cache will be valid until it's time to generate it again with the next request.

"roomlist_max_inactivity"
>Rooms have a "modified" property updated after most operations inside the room. The public roomlist considers rooms that are a) Public b) Claimed and c) Current date - modified date is lower than this configuration.

"youtube_enabled"
>Whether Youtube features are enabled.

"twitch_enabled"
>Whether Twitch features are enabled.

"soundcloud_enabled"
>Whether Soundcloud features are enabled.

"vimeo_enabled"
>Whether Vimeo features are enabled.

"imgur_enabled"
>Whether Imgur features are enabled.

"iframes_enabled"
>Whether embedded iframes are enabled.

"antispam_banTime"
>How much time in minutes a user is banned from the system after being detected as a spammer by the automatic spam detection system.

"antispam_kickThreshold"
>User gets kicked after this many spam score

"antispam_kickTimesBeforeBan"
>User gets banned after this many kicks

"antispam_banning"
>Uses temp IP banning after kickTimesBeforeBan

"antispam_heartBeatStale"
>Removes a heartbeat after this many seconds

"antispam_heartBeatCheck"
>Checks a heartbeat per this many seconds

"session_cookie_max_age"
>The amount of time a session cookie is valid. This cookie determines if a user needs to login again when entering.

"encryption_cost"
>This is used for the password hashing. A cost of 12 are 4096 salt rounds. The more rounds, the more secure the hash is, but it takes longer to process.

"mail_enabled"
>Whether a mailgun account is to be used for mail delivery, for example for password resets. If this is enabled, the "Forgot Password" link will appear in the login page.

"max_url_length"
>Url lengths beyond this are ignored by the system. This is to avoid triggering actions on urls that are likely wrong or meant as an attack.

"max_displayed_url"
>This is used to trim long displayed urls. The href itself remains untouched.

"max_stored_images"
>The amount of most recent images to have stored in a room. Each room has an array of images stored, when the array's length surpasses this number, the oldest image in it will get deleted, either locally or on the S3 bucket depending on settings.

"global_settings_default_sound_notifications"
>Whether sound notifications are enabled by default.

"global_settings_default_highlight_current_username"
>Whether current username triggers a highlight by default.

"global_settings_default_case_insensitive_username_highlights"
>Whether highlights for current username are case insensitive by default.

"global_settings_default_case_insensitive_words_highlights"
>Whether highlights for specified words are case insensitive by default.

"global_settings_default_case_insensitive_ignored_words"
>Whether ignored words are case insensitive by default

"global_settings_default_other_words_to_highlight"
>Other words to trigger highlights apart from the current username, by default.

"global_settings_default_double_tap"
>What command or string to trigger on double tap by default.

"global_settings_default_double_tap_2"
>What command or string to trigger on double tap 2 by default.

"global_settings_default_double_tap_3"
>What command or string to trigger on double tap 3 by default.

"global_settings_default_user_function_1_name"
>What name User Function 1 will have by default.

"global_settings_default_user_function_2_name"
>What name User Function 2 will have by default.

"global_settings_default_user_function_3_name"
>What name User Function 3 will have by default.

"global_settings_default_user_function_1"
>What command or string to trigger when User Function 1 is used by default.

"global_settings_default_user_function_2"
>What command or string to trigger when User Function 2 is used by default.

"global_settings_default_user_function_3"
>What command or string to trigger when User Function 3 is used by default.

"global_settings_default_at_startup"
>What command or string to trigger at startup.

"global_settings_default_ignored_usernames"
>What usernames to be ignored by default.

"global_settings_default_ignored_words"
>What words to be ignored by default.

"global_settings_default_ignored_words_exclude_same_user"
>Whether ignored words apply to the same user by default.

"global_settings_default_show_joins"
>Whether to show user joins by default.

"global_settings_default_show_parts"
>Whether to show user parts by default.

"global_settings_default_animate_scroll"
>Whether to animate chat scroll by default.

"global_settings_default_beep_on_messages"
>Whether to beep by default on chat messages.

"global_settings_default_beep_on_highlights"
>Whether to beep by default on highlights.

"global_settings_default_beep_on_media_change"
>Whether to beep by default on media change.

"global_settings_default_beep_on_user_joins"
>Whether to beep by default on user joins.

"global_settings_default_afk_disable_messages_beep"
>Whether to disable message beeps while afk by default.

"global_settings_default_afk_disable_highlights_beep"
>Whether to disable highlight beeps while afk by default.

"global_settings_default_afk_disable_media_change_beep"
>Whether to disable media change beeps while afk by default.

"global_settings_default_afk_disable_joins_beep"
>Whether to disable join beeps while afk by default.

"global_settings_default_afk_disable_image_change"
>Whether to disable image change while afk by default.

"global_settings_default_afk_disable_tv_change"
>Whether to disable tv change while afk by default.

"global_settings_default_afk_disable_radio_change"
>Whether to disable radio change while afk by default.

"global_settings_default_open_popup_messages"
>Whether popup messages will open automatically when arrived by default.

"global_settings_default_tv_height"
>The % height the tv will take by default when the image is also displayed.

"global_settings_default_on_lockscreen"
>Default commands to execute when the screen is locked.

"global_settings_default_on_unlockscreen"
>Default commands to execute when the screen is unlocked.

"global_settings_default_afk_on_lockscreen"
>Whether the user will go afk when locking the screen by default.

"global_settings_default_aliases"
>Default command aliases.

"global_settings_default_other_words_to_autocomplete"
>Default words to autocomplete besides usernames and commands.

"global_settings_default_chat_font_size"
> Default font size for the chat. This is a term like "normal" or "small".

"global_settings_default_warn_before_closing"
> Default setting of whether it should warn before closing the application/tab.

"global_settings_default_chat_display_percentage"
>Default percentage of the width the chat area will have in new rooms.

"global_settings_default_tv_display_percentage"
>Default percentage of the height the tv will have in the split media area in new rooms.

"global_settings_default_tv_display_position"
>Default position the tv will have in the split media area in new rooms. (top or bottom)

"global_settings_default_activity_bar"
>Whether the activity bar at the top will be enabled by default in new rooms.

"global_settings_default_show_image_previews"
>Whether image links get a preview on the chat area by default. This only works with certain links, including direct Imgur links.

"global_settings_default_show_link_previews"
>Whether links get a preview on the chat area by default.

"global_settings_default_stop_radio_on_tv_play"
>Whether radio stops on TV play by default.

"global_settings_default_stop_tv_on_radio_play"
>Whether TV stops on radio play by default.

"global_settings_default_speech_x"
>Default programmed speech for each synth key to play on middle click or /speech command.

"global_settings_default_synth_enabled"
>Whether the synth is enabled by default.

"global_settings_default_afk_disable_synth"
>Whether the synth is disabled on AFK.

"global_settings_default_accept_commands_from"
>List of usernames to accept commands from that are sent by whispers.

"global_settings_default_autoscroll_amount"
>How many pixels to autoscroll the chat on each step.

"global_settings_default_autoscroll_delay"
>The delay of the interval for every autoscroll step in milliseconds.

"global_settings_default_show_input_placeholder
>Whether the input placeholder is enabled by default.

"global_settings_default_show_clock_in_input_placeholder
>Whether the clock in the input placeholder is enabled by default.

"global_settings_default_show_clock_in_lockscreen
>Whether the clock in the lockscreen is enabled by default.

"global_settings_default_autoreveal_spoilers
>Whether spoiler autoreveal is on by default.

"global_settings_default_theme_mode
>Whether it uses the room theme or a custom theme by default.

"global_settings_default_theme_color
>Default color for custom theme.

"global_settings_default_text_color
>Default text color for custom theme.

"global_settings_default_background_mode"
>Default background mode, either it uses the room's background or a custom background.

"global_settings_default_background_url"
>This is the default image url if using a custom background.

"global_settings_default_background_tile_dimensions"
>This is the default background tile dimensions if using a custom background.

"global_settings_default_message_log"
>Whether users request the message log on load by default.

"global_settings_default_chat_crop_limit"
>How many chat messages to hold in the chat area by default.

"room_state_default_images_enabled"
>Whether images will be enabled by default.

"room_state_default_tv_enabled"
>Whether tv will be enabled by default.

"room_state_default_radio_enabled"
>Whether radio will be enabled by default.

"room_state_default_images_locked"
>Whether images will be locked by default.

"room_state_default_tv_locked"
>Whether tv will be locked by default.

"room_state_default_radio_locked"
>Whether radio will be locked by default.

"room_state_default_radio_volume"
>Default volume for the radio.

"room_state_default_tv_volume"
>Default volume for the tv.

"room_state_default_screen_locked"
>Whether the screen will be locked by default.

"room_state_default_synth_muted"
>Whether the synth is muted by default.

"room_state_default_lockscreen_lights_off"
>Where the lockscreen will have the dark theme by default.

"room_state_default_chat_searches"
>Default chat searches list.

"room_state_default_last_highlight_date"
>Default date to check for new highlights to announce at startup.

"bypass_images_lock_on_own_change"
>Whether images are forced to change even if they're locked, when you change them, by default.

"bypass_tv_lock_on_own_change"
>Whether tv are forced to change even if they're locked, when you change it, by default.

"bypass_radio_lock_on_own_change"
>Whether radio are forced to change even if they're locked, when you change it, by default.

"double_tap_key"
>The key that triggers double tap.

"double_tap_key_2"
>The key that triggers double tap 2.

"double_tap_key_3"
>The key that triggers double tap 3.

"jwt_expiration"
>How long jwt will be valid after login.

"max_user_id_length"
>After this length, this is clearly not a user id.

"max_same_post_diff"
>Maximum difference in time between a message and and another from the same user to be displayed within the same post.

"max_same_post_diff"
>Maximum messages within a post. After this a new post is displayed.

"max_typing_inactivity"
>After the last typing signal has being received, it will stop showing the typing status after this amount of time.

"max_verification_time"
>How much time a verification link will be active after registration. If it's not used before this it won't work.

"delivery_email"
>Email address from where system emails are sent.

"delivery_email_name"
>Name used on system emails.

"media_changed_crop_limit"
>How many items are stored in images_changed, tv_changed and radio_changed.

"email_change_limit"
>How long a user must wait to perform another email verification.

"email_change_expiration"
>How long an email verification code will be valid.

"email_change_code_max_length"
>Arbitrary long length to consider email verification codes.

"create_room_cooldown"
>How long a user must wait to create another room.

"recaptcha_enabled"
>Whether recaptcha verification is used at registration.

"socket_emit_throttle"
>Throttle on socket emits on the client.

"safe_limit_*"
>Generic limits used to check data length.

"data_max_items"
>Maximum amount of data items allowed in socket emits.

"data_items_max_string_length"
>Used to check string data.

"data_items_max_number_length"
>Used to check number data.

"disconnect_timeout_delay"
>Some disconnection types have a buffer so cases like reloading doesn't trigger the left/joined messages. This is how long the timeout is before showing the user disconnected as well as removing it internally.

"profile_image_diameter"
>The diameter of the cropped profile image selected by the user.

"max_num_newlines"
>Maximum amount of newlines allowed per message.

"draw_coords_max_length"
>Maximum string length for the draw coordinate arrays.

"draw_coords_max_array_length"
>Maximum array length for each of the draw coordinate arrays.

"image_change_cooldown"
>How much it should wait in milliseconds before images can be changed again after last change.

"tv_change_cooldown"
>How much it should wait in milliseconds before tv can be changed again after last change.

"radio_change_cooldown"
>How much it should wait in milliseconds before radio can be changed again after last change.

"max_sockets_per_user"
>How many active sockets a user can have at the same time. After this limit all incoming socket connections are droppped.

"images_domain_white_or_black_list"
>Whether images_domain_list is a whitelist or a blacklist of domains. This should be "white" or "black".

"images_domain_list"
>If this is a white list, only image sources belonging to this domain will be accepted.
If it's a blacklist, image sources from this domain will be rejected.
This should be an array of strings of root domains.

"tv_domain_white_or_black_list"
>Whether tv_domain_list is a whitelist or a blacklist of domains. This should be "white" or "black".

"tv_domain_list"
>If this is a white list, only tv sources belonging to this domain will be accepted.
If it's a blacklist, tv sources from this domain will be rejected.
This should be an array of strings of root domains.

"radio_domain_white_or_black_list"
>Whether radio_domain_list is a whitelist or a blacklist of domains. This should be "white" or "black".

"radio_domain_list"
>If this is a white list, only radio sources belonging to this domain will be accepted.
If it's a blacklist, radio sources from this domain will be rejected.
This should be an array of strings of root domains.

"image_ads_enabled"
>Whether image ads are enabled.

"image_ads_path"
>The internal path where ad images are stored.

"image_ads_public_path"
>The public directory where ad images are stored.

"image_ads_threshold"
>On how many chat messages sent to try to provide an image ad.

"image_ads_min_image_change"
>At least this time has to pass after an image change for an ad to be displayed.

"image_ads_setter"
>The name of the ad changer.

"text_ads_enabled"
>Whether text ads are enabled.

"text_ads_json_location"
>Location of the JSON file containing the ads strings.

"text_ads_threshold"
>On how many chat messages sent to try to provide a text ad.

"max_activity_bar_delay"
>How long until an item in the top activity bar becomes obsolete after not being updated.

"activity_bar_interval"
>How often to check for obsolete items in the top activity bar to remove them.

"activity_bar_trigger_interval"
>How often to send a signal, when focused, that the user has the app focused, to trigger activity.

"max_activity_bar_items"
>Maximum amount of top activity bar items at the same time.

"old_activity_min"
>The minimum difference to show the old activity message between messages. The message is created automatically, using different wording depending if the difference is in minutes, hours, days, or years.

"redis_max_link_age"
>How old link data has to be to be fetched again.

"link_fetch_timeout"
>Maximum time to get a response when fetching link data.

"link_max_title_length"
>After this the title from fetched link metadata gets cropped.

"synth_max_recent_users"
>How many users fit in to the title of recent synth users when hovering the synth's volume icon.

"synth_max_voice_text"
>Max length for the voice synth text.

"max_chat_searches"
>Maximum number of items stored in chat search history.

"url_title_max_length"
>Maximum length for urls to be shown fully in window titles. After this they get cropped and "..." is added.

"max_bio_length"
>Character length of user bios.

"max_bio_lines"
>Maximum number of linebreaks allowed in user bios.

"send_badge_cooldown"
>How much time sending a badge is disabled after the last badge sent.


## The following reside in config.secret.json

"youtube_api_key"
>The Youtube v3 Api key used to fetch video information from urls or to search for videos by search terms using /radio.

"session_secret"
>Used for express-session security. Change it to anything you want.

"mailgun_api_key"
>An api key from mailgun.com to enable mail delivery, used for password resets.

"mailgun_domain"
>The domain registered in mailgun.com

"s3_access_key"
>The access key of an S3 service.

"s3_secret_access_key"
>The secret access key of an S3 service.

"s3_api_version"
>The api version to use when creating the s3 object.

"s3_endpoint_url"
>The location where your S3 bucket resides. It can look like https://s3-us-west-1.amazonaws.com/. Slash at the end is important.

"s3_main_url"
>The url of your S3 bucket. It can look like https://s3-us-west-1.amazonaws.com/merkoba/. Slash at the end is important.

"s3_bucket_name"
>The name of the S3 bucket.

"s3_images_location"
>The directory inside the bucket where the images will reside, with a slash at the end.

"s3_cache_max_age"
>How long before an image is considered expired and needed to be fetched again by users. A big number is advised to preserve resources.

"jwt_secret"
>Secret key for the jwt system when logging in.

"recaptcha_key"
>Public google recaptcha key.

"soundcloud_id"
>Soundcloud API ID.

"recaptcha_secret_key"
>Soundcloud API Secret.

"recaptcha_secret_key"
>Secret google recaptcha key.

"imgur_client_id"
>Imgur client id.

"twitch_client_id"
>Twitch client id.

"vimeo_client_id"
>Vimeo client id.

"vimeo_secret"
>Vimeo secret key.

"vimeo_access_token"
>Vimeo access token.


# Join Flags

>alternative
Meant to be used for bots or similar, to connect without using the normal login portal.

>no_message_log
If true, the server will not send the message log on join.


# Additional Notes

To learn how to host a working internet radio refer to http://icecast.org/

For metadata fetching to work (to display the song and artist name in the played list and Now Playing), the Icecast metadata source needs to allow cross origin requests and be served through https if the system is being served through https.