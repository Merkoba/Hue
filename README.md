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

"https_enabled": true
>Defaults to true for security reasons. If deployed in a non-https environment set it to false. In order for it to be really enabled the Node environment must be set to production.

"site_root": "https://hue.merkoba.com/"
>The root url where the system will work.

"main_room_id": "main"
>The name of the main room. This is the room that will be joined when going to the root url. This room is created automatically when first joined. To get ownership of the room "/claim secretpass" is needed.

"default_main_room_name": "Hue"
>The default name of the main room. Just like any room, this can be changed later.

"images_directory": "public/img"
>The directory where uploaded images will be stored.

"public_images_location": "/img/"
>The public root of images. For example /public/img/image.jpg can be accessed in a client with root_url/img/image.jpg.

"default_image_url": "/img/default.gif"
>The public location of the default image. This image appears on new rooms or when an uploaded image fails to load.

"loading_image_url": "/img/loading.jpg"
>The public location of the loading image. This image appears when the room is loading and hasn't finished loading the first image.

"login_logo_url": "/img/animlogo.gif"
>The public location of the logo at the top of the login page.

"default_radio_source": "https://hue.merkoba.com:8765/wok3n"
>The default radio url used for new rooms or when "/radio default" is issued.

"mongodb_path": "mongodb://localhost:27017/hue"
>The path to the MongoDB database. The name can be anything as long as the port is correct.

"topic_separator": " | "
>Separator used between topic sections. Used when using /topicadd, which adds a new piece of topic at the end of the current topic. Also used when calculating the removal of these topic sections.

"title_separator": " - "
>Separator used to separate the room name and the topic in the browser tab's title.

"default_title": "Hue | Chat room with dynamic images and internet radio"
>The default tab title of a room. This appears before the room information has been gathered to set the first title.

"login_title": "Hue | Login"
>The title of the login page.

"default_topic": "Use /claim to get admin rights to this room"
>The shown topic when the room has been created or claimed and there is no topic yet.

"default_topic_unclaimed": "Check /help3 to learn about administration commands"
>Topic shown when the room is unclaimed.

"default_modal_color": "white"
>The class name for the modals, which change the modal colors. Either "white", "red", "green", "blue", or "black".

"redirect_url": "https://en.wikipedia.org/wiki/Special:Random"
>Url used in some cases when the user needs to be disposed. For example when kicked from a room.

"check_metadata_interval_duration": 12000
>The interval in milliseconds to check for radio metadata. This only occurs when an internet radio url is set as the radio source, for example it won't check if there's a youtube video set.

"general_opacity": 0.95
>Opacity used in various parts of the interface so the background image is partially visible when settings.background_image is enabled.

"color_contrast_amount_1": 0.9
>Contrast between the background color and the font color.

"color_contrast_amount_2": 0.95
>Contrast between the background color and the font color when settings.background_image is enabled.

"color_contrast_amount_3": 0.09
>Contrast between the background color and the header and footer background colors. This is to make them look a bit lighter or darker depending on the background color. Or they can have no contrast at all if they are disabled in Settings.

"color_contrast_amount_4": 0.095
>Same but if settings.background_image is enabled.

"chat_crop_limit": 2000
>After this number of chat messages on the screen, the oldest ones will start to get removed so there's always this maximum amount of messages displayed. This is to avoid having a huge amount of text in memory in case it is opened for a long time. This is also used to limit the chat_history list, which is used for chat message search.

"played_crop_limit": 2000
>Same as chat_crop limit but for items displayed when "Now Playing" is clicked.

"history_crop_limit": 2000
>The maximum amount of items stored in the input history. These are the commands you have issued in the input box, which can be traversed through Up and Down keyboard arrows to repeat them. They can also view viewed in the History window.

"max_input_length": 1250
>Maximum amount of text for something typed in the input box. If something bigger is inputed it will get cropped to meet this limit.

"max_topic_length": 1200
>The maximum length of a room topic. If a longer topic is tried to be set with /topic it will get cropped to meet this limit. /topicadd and /topicaddstart will throw an error if there is no more room to add to the topic.

"max_nickname_length": 30
>Maximum length for nicknames. Currently this is also used for the username max length.

"min_password_length": 1
>Minimum length for passwords.

"max_password_length": 200
>Maximum length for passwords.

"max_max_nickname_length": 300
>This is a safety used when validating usernames on login. In case max or min nickname length configurations where changed when there were already users registered, this arbitrary big number is used to check something huge is not being inputed instead of checking with the nickname length configuration options, to avoid old nicknames from not being able to login. This likely shouldn't be changed.

"max_max_password_length": 2000
>Same as max_max_nickname but for passwords.

"max_room_name_length": 100
>Max length for room names.

"max_roomid_length": 100
>Arbitrary big number to avoid big urls from being considered as valid. Mongo ids are approximately 24 chars in length as for 2017.

"max_radio_source_length": 500
>Maximum length of a radio source url.

"max_roomlist_items": 100
>Maximum amount of items cached and shown when requesting the Public Rooms list.

"max_roomlist_topic_length": 140
>Maximum displayed topic of a room in room lists. If topic is bigger it gets cropped.

"max_visited_rooms_items": 100
>Maximum amount of items shown in the Visited Rooms list.

"max_title_length": 200
>Maximum length for the tab's title. Title consists of "room_name - topic" and is set automatically. If title is bigger it gets cropped.

"max_no_meta_count": 10
>If radio metadata fails to be fetched, metadata fetch is disabled and this option is set to 0. After each metadata loop this number is increased by 1. When it reaches this configured count, metadata fetch is resumed. This is to avoid continuous fetch of invalid resources to save bandwidth.

"max_image_size": 5555
>Maximum image size allowed in KB. This is checked both in the client and server. If the image is bigger it won't be uploaded.

"small_keyboard_scroll": 100
>The amount scrolled in pixels when Shift + Up or Down arrows are used.

"big_keyboard_scroll": 200
>The amount scrolled in pixels when PageUp or PageDown are used.

"afk_timeout_duration": 120000
>When a user has had the tab unfocused (changing applications is currently not detected as being unfocused by browsers, so this means being on a different tab) for this amount of time, the user will be considered internally as afk. When afk is true it the tab won't load new changed images until the user focuses the tab again. This is to be avoid an abandoned tab from loading lots of images for no purpose, to save bandwidth.

"roomlist_cache": 120000
>When the public rooms list is requested, it will get cached so subsequent requests won't trigger a whole analysis again, to save processing power. This controls how long that cache will be valid until it's time to generate it again with the next request.

"roomlist_max_inactivity": 172800000
>Rooms have a "modified" property updated after most operations inside the room. The public roomlist considers rooms that are a) Public b) Claimed and c) Current date - modified date is lower than this configuration.

"youtube_enabled": true
>Whether youtube features are enabled. If disabled, youtube urls and search terms will be discarded when /radio is used. There are checks both in the client and server.

"heartbeat_interval": 10000
>This is a heartbeat used to check whether a user is still properly connected to the system. It is a simple check that tests if socket.nickname is undefined. If it is undefined it sends a signal that refreshes the page. This is probably not necesary since Socket.IO has it's own heartbeat feature so this interval can be a lot bigger, but previous problems lead to this implementation, so it's a safety measure.

"antispam_banTime": 30
>How much time in minutes a user is banned from the system after being detected as a spammer by the automatic spam detection system.

"antispam_kickThreshold": 20
>User gets kicked after this many spam score

"antispam_kickTimesBeforeBan": 1
>User gets banned after this many kicks

"antispam_banning": true
>Uses temp IP banning after kickTimesBeforeBan

"antispam_heartBeatStale": 40
>Removes a heartbeat after this many seconds

"antispam_heartBeatCheck": 4
>Checks a heartbeat per this many seconds

"session_cookie_max_age": 123456789000
>The amount of time a session cookie is valid. This cookie determines if a user needs to login again when entering. Using this default, the max age will be around 4 years, to avoid annoying users as much as possible.

"encryption_cost": 12
>This is used for the password hashing. A cost of 12 are 4096 salt rounds. The more rounds, the more secure the hash is, but it takes longer to process.


The following reside in config.secret.json:


"secretpass": "whatever"
>Password used for claiming the main room, and force claim any room. Change it to anything you want.

"youtube_api_key": "SomeYouTubeV3ApiKey"
>The Youtube v3 Api key used to fetch video information from urls or to search for videos by search terms using /radio.

"session_secret": "secret string for express-session constructor"
>Used for express-session security. Change it to anything you want.