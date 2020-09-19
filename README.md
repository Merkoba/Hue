![](https://i.imgur.com/bSNwmRv.jpg)

[Click here to see all screenshots](screenshots.md)

# What Is It

Hue allows real time communication while watching, or listening to media.

It provides different media spots that can all be active at once, or just the ones you, as an admin of the room want, or you, as the user want.

These are Images and TV.
Images can be any image, either uploaded or linked. Search queries can be enabled to search images on Imgur. When the image is clicked it opens a modal where current and previous images can be seen in full screen.

TV can be any video link. It embeds videos from YouTube, Soundcloud, video files, or even websites that are embedded in an iframe. Search queries can be enabled to search videos on YouTube.

Images and TV reside in the media area on the right.
Images and TV can change their proportion or position.

Any of these can be hidden (not visible, and inactive), or locked (it will stay the same for the user, even if the media was changed).

Media domains can be configured to use a whitelist or a blacklist. This is to control if you want, for instance, only images from a trusted source.

Room administrators have a lot of control over how the room looks and behaves.
The room can change it's background color (called Theme), which changes the background color of the middle section and a contrast color for the panels.
The room can have a background image which is visible enough to not mess with the text readability. This background can be a normal image, a tiled image, the current Image mirrored, the current Image mirrored and tiled, or just a solid color (no image). There's also background effects available like Blur for background images.

Admins can also enable, disable, or lock (nobody can change it, not) media.

There's a user system. Admins, Operators, Voice 1, Voice 2, and Voice 3.
Admins and Operators have basically the same rights, except only Admins can add or remove Operators or other Admins. They have access to the room controls, which are located in the Room Menu at the top. The 3 different types of Voice users can be configured to suit what works best for your room. For instance you can say Voice 1 has all features enabled, but Voice 2 can't change the TV. Users can be kicked or banned too.

There's a real time private message system called Whispers. You can send a Whisper to another user as long as they are online. A popup message will appear in their screen, to which they can reply. Whispers are only visible to the senders and receivers. This Whisper system is also good for controlling bots (see Huebot), since orders can be sent to them to trigger an action.

There's a User Settings system that configures many features of the application for users on a personal level. This consists of two categories, Global Settings, and Room Settings. These are both the same settings except whatever is changed in Global Settings affects all rooms, whereas in Room Settings, when a setting is overriden, it affects only the current room.

There's a log system. If active, a room will remember the most recent posts and media activity, so they're visible to users entering the room. This is currently the last 250 messages. This can be disabled or cleared at any time.

There is a socket anti-spam system which kicks and bans users temporarily after they spam over a configured threshold.

Users can create their own room, where they are Admins as default. There's a cooldown after creating a room for creating another one, this is to avoid room creation spam.

There are Visited Rooms and Public Rooms lists. Visited Rooms shows the status of rooms you have visited recently, while Public Rooms show rooms that are set to public and have had activity recently.

There is support for non-intrusive text ads which display a custom chat message every x number of posts.

Creating an account is email based. There is no third party auth, except an optional ReCaptcha. This is to retain some autonomy and avoid complexity. After registration, a confirmation link is sent, clicking it is required to activate the account and be able to login. There is a password recovery feature if a valid email is provided. Currently a Mailgun account is required to handle email sending. The username, password, and email can be changed. Email change requires a verification link in the new email address to be clicked.

[Installation](installation.md)

[Configuration](configuration.md)

[Additional](additional.md)