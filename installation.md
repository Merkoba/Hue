# Installation

Requirements:
- Node 10+
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

To have a fully working system, as it is intended, getting all the API keys (YouTube, Imgur) is very recommended. If you don't need some of these, disable them in user_config.json (for example "youtube_enabled": false) Mailgun api key is necessary for account creation and password recovery, so it must be provided. A Google Recaptcha key is necessary to enable captcha verification on registration, though captcha support can be disabled ("recaptcha_enabled": false). Set API keys in user_config.secret.json.

Put the files in the directory you want it work and call "npm install". That should install all necessary packages. 

There is no need to create database tables, all of that is done automatically.

Redis is now required, to store link metadata in database 10. Install and setup Redis.

To run it properly in production you will have to configure Apache or some other webserver to use a reverse proxy. A sample vhost configuration for Apache (apache_vhost.conf) is included. For using https, LetsEncrypt is suggested.

Using pm2 is suggested to control the Node process. PM2 will likely use the user's home directory as root.

>su - node -c "pm2 start hue/server/www --env production"

That's an example of starting it with the user "node" in a production environment.

Build the client js and css files:

>cd utils

>./bundle_all