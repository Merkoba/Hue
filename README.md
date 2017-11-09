![](https://i.imgur.com/ZrP56hg.jpg)

# Installation

Requirements:
- Node 6+
- MongoDB 3+
- Linux (to run properly)

There's not much to do. 

Just put the files in the directory you want it work and call "npm install". That should install all necesary packages. 

You will also need MongoDB installed in your computer, and for everything to work correctly Hue should be running in a Linux environment as it depends on some Linux calls like rm, wget, stat and find.

There is no need create database tables, all of that is done automatically, MongoDB just needs to be installed and running.

Most configuration is done in the config.json and config.secret.json files found in the root directory.

To run it locally you first have to start 'mongod' then go to the bin directory and run 'node www start'.

To run it properly in production you will have to configure Apache or some other webserver to use a reverse proxy. A sample vhost configuration for Apache (apache_vhost.conf) is included. For using https LetsEncrypt is suggested.

Using 'forever' is suggested to control the Node process.

# Configuration

"https_enabled"
>Defaults to true for security reasons. If deployed in a non-https environment set it to false. In order for it to be really enabled the Node environment must be set to production.

"site_root"
>The root url where the system will work. End it with a slash (/).

"main_room_id"
>The name of the main room. This is the room that will be joined when going to the root url. This room is created automatically when first joined. To get ownership of the room "/claim secretpass" is needed.

"default_main_room_name"
>The default name of the main room. Just like any room, this can be changed later.

"images_directory"
>The directory where uploaded images will be stored.

"public_images_location"
>The public root of images. For example /public/img/image.jpg can be accessed in a client with root_url/img/image.jpg.

"default_image_url"
>The public location of the default image. This image appears on new rooms or when an uploaded image fails to load.

"loading_image_url"
>The public location of the loading image. This image appears when the room is loading and hasn't finished loading the first image.

"login_logo_url"
>The public location of the logo at the top of the login page.

"default_radio_source"
>The default radio url used for new rooms or when "/radio default" is issued.

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

"default_topic"
>The shown topic when the room has been created or claimed and there is no topic yet.

"default_topic_unclaimed"
>Topic shown when the room is unclaimed.

"default_modal_color"
>The class name for the modals, which change the modal colors. Either "white", "red", "green", "blue", or "black".

"redirect_url"
>Url used in some cases when the user needs to be disposed. For example when kicked from a room.

"check_metadata_interval_duration"
>The interval in milliseconds to check for radio metadata. This only occurs when an internet radio url is set as the radio source, for example it won't check if there's a youtube video set.

"general_opacity"
>Opacity used in various parts of the interface so the background image is partially visible when settings.background_image is enabled.

"color_contrast_amount_1"
>Contrast between the background color and the font color.

"color_contrast_amount_2"
>Contrast between the background color and the font color when settings.background_image is enabled.

"color_contrast_amount_3"
>Contrast between the background color and the header and footer background colors. This is to make them look a bit lighter or darker depending on the background color. Or they can have no contrast at all if they are disabled in Settings.

"color_contrast_amount_4"
>Same but if settings.background_image is enabled.

"chat_crop_limit"
>After this number of chat messages on the screen, the oldest ones will start to get removed so there's always this maximum amount of messages displayed. This is to avoid having a huge amount of text in memory in case it is opened for a long time. This is also used to limit the chat_history list, which is used for chat message search.

"played_crop_limit"
>Same as chat_crop limit but for items displayed when "Now Playing" is clicked.

"history_crop_limit"
>The maximum amount of items stored in the input history. These are the commands you have issued in the input box, which can be traversed through Up and Down keyboard arrows to repeat them. They can also view viewed in the History window.

"max_input_length"
>Maximum amount of text for something typed in the input box. If something bigger is inputed it will get cropped to meet this limit.

"max_topic_length"
>The maximum length of a room topic. If a longer topic is tried to be set with /topic it will get cropped to meet this limit. /topicadd and /topicaddstart will throw an error if there is no more room to add to the topic.

"max_nickname_length"
>Maximum length for nicknames. Currently this is also used for the username max length.

"max_max_nickname_length"
>This is a safety used when validating usernames on login. In case max or min nickname length configurations where changed when there were already users registered, this arbitrary big number is used to check something huge is not being inputed instead of checking with the nickname length configuration options, to avoid old nicknames from not being able to login. This likely shouldn't be changed.

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

"max_roomid_length"
>Arbitrary big number to avoid big urls from being considered as valid. Mongo ids are approximately 24 chars in length as for 2017.

"max_radio_source_length"
>Maximum length of a radio source url.

"max_roomlist_items"
>Maximum amount of items cached and shown when requesting the Public Rooms list.

"max_roomlist_topic_length"
>Maximum displayed topic of a room in room lists. If topic is bigger it gets cropped.

"max_visited_rooms_items"
>Maximum amount of items shown in the Visited Rooms list.

"max_title_length"
>Maximum length for the tab's title. Title consists of "room_name - topic" and is set automatically. If title is bigger it gets cropped.

"max_no_meta_count"
>If radio metadata fails to be fetched, metadata fetch is disabled and this option is set to 0. After each metadata loop this number is increased by 1. When it reaches this configured count, metadata fetch is resumed. This is to avoid continuous fetch of invalid resources to save bandwidth.

"max_image_size"
>Maximum image size allowed in KB. This is checked both in the client and server. If the image is bigger it won't be uploaded.

"small_keyboard_scroll"
>The amount scrolled in pixels when Shift + Up or Down arrows are used.

"big_keyboard_scroll"
>The amount scrolled in pixels when PageUp or PageDown are used.

"afk_timeout_duration"
>When a user has had the tab unfocused (changing applications is currently not detected as being unfocused by browsers, so this means being on a different tab) for this amount of time, the user will be considered internally as afk. When afk is true it the tab won't load new changed images until the user focuses the tab again. This is to be avoid an abandoned tab from loading lots of images for no purpose, to save bandwidth.

"roomlist_cache"
>When the public rooms list is requested, it will get cached so subsequent requests won't trigger a whole analysis again, to save processing power. This controls how long that cache will be valid until it's time to generate it again with the next request.

"roomlist_max_inactivity"
>Rooms have a "modified" property updated after most operations inside the room. The public roomlist considers rooms that are a) Public b) Claimed and c) Current date - modified date is lower than this configuration.

"youtube_enabled"
>Whether youtube features are enabled. If disabled, youtube urls and search terms will be discarded when /radio is used. There are checks both in the client and server.

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


## The following reside in config.secret.json


"secretpass"
>Password used for claiming the main room, and force claim any room. Change it to anything you want.

"youtube_api_key"
>The Youtube v3 Api key used to fetch video information from urls or to search for videos by search terms using /radio.

"session_secret"
>Used for express-session security. Change it to anything you want.

"mailgun_api_key"
>An api key from mailgun.com to enable mail delivery, used for password resets.

"mailgun_domain"
>The domain registered in mailgun.com