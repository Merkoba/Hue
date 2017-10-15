![](https://i.imgur.com/2r6vRFr.jpg)

# Installation

Requirements:
- Node 6+
- MongoDB 3+
- Linux (to run properly)

There's not much to do. 

Just put the files in the directory you want it work and call "npm install". 

That should install all necesary packages. 

Change the urls defined in public/js/base.js to your own urls.

You will also need MongoDB installed in your computer, and for everything to work correctly Hue should be running in a Linux environment as it depends on some Linux calls like rm, wget, stat and find.

There is no need create database tables, all of that is done automatically, MongoDB just needs to be installed and running.

To run it locally you first have to start 'mongod' then go to the bin directory and run 'node www start'.

To run it properly in production you will have to configure Apache or some other webserver to use a reverse proxy. A vhost configuration for Apache (apache_vhost.conf) is included in the code. Then I suggest using 'forever' to control the Node process. 

Note: To claim the main room you have to use the password in config.json i.e '/claim password'.