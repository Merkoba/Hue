# Installation

`git clone --depth 1 https://github.com/Merkoba/Hue`

Configuration is done in user_config.json and user_config.secret.json files placed in the config directory.

Editing those files overrides settings in the default configuration files. 

The point of having separate files is so the default config files can be changed during an update while the user config files remain intact.

Most of the defaults in user_config.json can be left as is.

Most of the necessary configuration is set in user_config.secret.json, like api keys and secret strings.

Not all configurations need to be declared in the user configs, just the ones you want to override.

Example of how to use user_config.json:

```javascript
{
    "max_topic_length": 2000,
    "min_password_length": 3
}
```

Example of how to use user_config.secret.json:

```javascript
{
    "youtube_api_key": "Avjioa5awfFF445234fAFDvF",
    "superuser_usernames": ["ack", "trok"]
}
```

The admin's username must go in superuser_usernames in user_config.secret.json

The main room is created at startup if it doesn't exist. 

To get admin rights on the room use /annex after joining it.

To have a fully working system, as it is intended, getting all the API keys (YouTube, Imgur) is very recommended. If you don't need some of these, disable them in user_config.json (for example "youtube_enabled": false) A Google Recaptcha key is necessary to enable captcha verification on registration, though captcha support can be disabled ("recaptcha_enabled": false). Set API keys in user_config.secret.json

Run "npm install" to install node dependencies.

Install Redis, which is used for sessions and some data cache.

Go to utils/ and run `bundle_all` to create the frontend files.

Try running the server with `node server/www`

To run it properly in production you will have to configure Apache or some other webserver to use a reverse proxy. A sample vhost configuration for Apache (apache_vhost.conf) is included. For using https, LetsEncrypt is suggested.

Using pm2 is suggested to control the Node process. PM2 will likely use the user's home directory as root.

>su - node -c "pm2 start hue/server/www --env production"

That's an example of starting it with the user "node" in a production environment.

### Updates

After a git pull with new changes it might be necessary to `bundle_all` again if frontend files changed.

If some ejs files or config files were changed it's not necessary to restart the server, since it checks automatically and reloads live. The terminal output will show messages when these get rebuilt.

If other backend files changed then it's necessary to restart the server.

## Join Flags

"alternative" (boolean)
>Meant to be used for bots or similar, to connect without using the normal login portal.

>Failure to authenticate will result in a temporary ban to avoid abuse.

"no_log_messages" (boolean)
>If true, the server will not send the log messages on join, which can save some bandwidth.

"no_message_board_posts" (boolean)
>If true, the server will not send the message board posts on join, which can save some bandwidth.

"no_userlist" (boolean)
>If true, the server will not send the userlist on join, which can save some bandwidth.