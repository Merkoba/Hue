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

The main room is created automatically when entered for the first time. To get ownership to it you need to use /claim secretpass.

Config option, https_enabled, is true by default for security reasons. If you're using a non-https setup, set it to false.