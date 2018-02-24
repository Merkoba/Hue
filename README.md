![](https://i.imgur.com/egPOTus.gif)

# Installation

Requirements:
- Node 6+
- MongoDB 3+
- Linux

Put the files in the directory you want it work and call "npm install". That should install all necesary packages. 

You will also need MongoDB installed in your computer, and for everything to work correctly Hue should be running in a Linux environment as it depends on some Linux calls like rm, wget, stat and find.

There is no need create database tables, all of that is done automatically, MongoDB just needs to be installed and running.

Configuration is done in the config.json and config.secret.json files found in the root directory.

The admin email must go in superuser_emails in config.secret.json. It's used to take over control of the main room. The main room is created on first join, with no roles. To get admin on the room use /annex.

To run it locally you first have to start 'mongod' then go to the bin directory and run 'node www start'.

To run it properly in production you will have to configure Apache or some other webserver to use a reverse proxy. A sample vhost configuration for Apache (apache_vhost.conf) is included. For using https LetsEncrypt is suggested.

Using pm2 is suggested to control the Node process.

>su - node -c "pm2 start /home/node/hue/bin/www --env production"

That's an example of starting it with the user "node" in a production environment.

To have a full working system, as it is intended, getting the youtube api key is very recommended. Twitch api key is recommended to support twitch 'videos' (channels work out of the box). Mailgun api key is necessary for account creation and password recovery, so it must be provided. Setup these in config.secret.json. If you don't want any of these, disable them in the config.json

If you ever need to access the MongoDB database:

>sudo mongo

>use hue

If you want to remove it to start fresh:

>db.dropDatabase()

# Configuration

"https_enabled"
>Defaults to true for security reasons. If deployed in a non-https environment set it to false. In order for it to be really enabled the Node environment must be set to production.

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

"default_image_url"
>The public location of the default image. This image appears on new rooms or when an uploaded image fails to load.

"default_tv_source"
>Default source for the tv for new rooms. This is a video url, file, youtube, or twitch.

"default_tv_type"
>The type of the default_tv_source, either "url", "youtube", or "twitch".

"login_logo_url"
>The public location of the logo at the top of the login page.

"register_login_url"
>The public location of the logo at the top of the registration page.

"default_profile_image_url"
>The location of the default profile image.

"profile_image_loading_url"
>The location of the loading image when the profile image is changing.

"default_default_background_image_url"
>The location of the default background image.

"background_image_loading_url"
>The location of the loading image when the background image is changing.

"default_video_url"
>Image to show to video element when there's no video image loaded.

"default_radio_source"
>The default radio url used for new rooms or when "/radio default" is issued. To work properly, for now, this must be ideally a working icecasat radio url.

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

"default_topic_unclaimed"
>Topic shown when the room is unclaimed.

"default_topic_admin"
>Default topic shown to admins.

"redirect_url"
>Url used in some cases when the user needs to be disposed. For example when kicked from a room.

"check_metadata_interval_duration"
>The interval in milliseconds to check for radio metadata. This only occurs when an internet radio url is set as the radio source, for example it won't check if there's a youtube video set.

"general_opacity"
>Opacity used in various parts of the interface so the background image is partially visible when settings.background_image is enabled.

"modal_overlay_opacity"
>Opacity used in the modal window overlays.

"color_contrast_amount_x"
>Settings to control contrast between different colors in the interface.

"color_contrast_amount_4"
>Same but if settings.background_image is enabled.

"chat_crop_limit"
>After this number of chat messages on the screen, the oldest ones will start to get removed so there's always this maximum amount of messages displayed. This is to avoid having a huge amount of text in memory in case it is opened for a long time. This is also used to limit the chat_history list, which is used for chat message search.

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
>Same as max_max_nickname but for passwords.

"max_email_length"
>Maximum length for email addresses.

"max_max_email_length"
>Same as max_max_nickname but for emails.

"password_reset_limit"
>How long a user must wait to get a reset password link emailed to them, after a reset email was sent.

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

"max_room_log_messages"
>Maximum amount of messages to store in room logs. It stores chat messages and some notifications like image uploads and radio changes.

"max_visited_rooms_items"
>Maximum amount of items shown in the Visited Rooms list.

"max_title_length"
>Maximum length for the tab's title. Title consists of "room_name - topic" and is set automatically. If title is bigger it gets cropped.

"max_no_meta_count"
>If radio metadata fails to be fetched, metadata fetch is disabled and this option is set to 0. After each metadata loop this number is increased by 1. When it reaches this configured count, metadata fetch is resumed. This is to avoid continuous fetch of invalid resources to save bandwidth.

"max_image_size"
>Maximum image size allowed in KB. This is checked both in the client and server. If the image is bigger it won't be uploaded.

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
>Whether youtube features are enabled. If disabled, youtube urls and search terms will be discarded when /radio or /tv are used. There are checks both in the client and server.

"twitch_enabled"
>Whether twitch features are enabled. If disabled, twitch urls will be discarded when /tv is used. There are checks both in the client and server.

"heartbeat_interval"
>This is a heartbeat used to check whether a user is still properly connected to the system. It is a simple check that tests if socket.nickname is undefined. If it is undefined it sends a signal that refreshes the page. This is probably not necesary since Socket.IO has it's own heartbeat feature so this interval can be a lot bigger, but previous problems lead to this implementation, so it's a safety measure.

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
>The amount of time a session cookie is valid. This cookie determines if a user needs to login again when entering. Using this default, the max age will be around 4 years, to avoid annoying users as much as possible.

"encryption_cost"
>This is used for the password hashing. A cost of 12 are 4096 salt rounds. The more rounds, the more secure the hash is, but it takes longer to process.

"mail_enabled"
>Whether a mailgun account is to be used for mail delivery, for example for password resets. If this is enabled, the "Forgot Password" link will appear in the login page.

"max_url_length"
>Url lengths beyond this are ignored by the system. This is to avoid triggering actions on urls that are likely wrong or meant as an attack.

"max_stored_images"
>The amount of most recent images to have stored in a room. Each room has an array of images stored, when the array's length surpasses this number, the oldest image in it will get deleted, either locally or on the S3 bucket depending on settings.

"settings_default_background_image"
>Whether the uploaded image is shown in the background by default.

"settings_default_custom_scrollbars"
>Whether custom scrollbars are enabled by default.

"settings_default_sound_notifications"
>Whether sound notifications are enabled by default.

"settings_default_modal_effects"
>Whether modal effects are enabled by default.

"settings_default_highlight_current_username"
>Whether current username triggers a highlight by default.

"settings_default_case_sensitive_highlights"
>Whether highlights, either current nickname, or specified words matches are case sensitive by default.

"settings_default_other_words_to_highlight"
>Other words to trigger highlights apart from the current nickname, by default.

"room_settings_default_images_enabled"
>Whether images are show to the user when joining a room for the first time.

"room_settings_default_tv_enabled"
>Whether the tv is show to the user when joining a room for the first time.

"room_settings_default_radio_enabled"
>Whether the radio is show to the user when joining a room for the first time.

"jwt_expiration"
>How long jwt will be valid after login.

"max_user_id_length"
>After this length, this is clearly not a user id.

"announce_joins"
>Whether to show when a user joins the room.

"announce_parts"
>Whether to show when a user leaves the room.

"image_queue_interval"
>Minimum time for a changed image to be displayed before changing to the next one. This doesn't take into account the time the image took to load.

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

# Development

You can create a config.secret.dev.json file intended to use in development, which is ignored by git. So you can leave config.secret.json intact and use the modified dev version for testing. Put it in the root directory, where the other config files are. This is used when the node environment is set to "development".

There's a run_dev file that starts the node server with a development node environment.

# Additional Notes

To learn how to host a working internet radio refer to http://icecast.org/

For metadata fetching to work (to display the song and artist name in the played list and Now Playing), the Icecast metadata source needs to allow cross origin requests and be served through https if the system is being served through https.