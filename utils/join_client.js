const fs = require("fs")
const Terser = require("terser")
const root = "../public/static/js/main/"

let files = 
[
   "init.js",
   "settings.js",
   "commands.js",
   "draw.js",
   "image.js",
   "tv.js",
   "radio.js",
   "synth.js",
   "media.js",
   "players.js",
   "main_menu.js",
   "socket.js",
   "chat.js",
   "windows.js",
   "window.js",
   "whispers.js",
   "uploads.js",
   "theme.js",
   "local_storage.js",
   "permissions.js",
   "users.js",
   "user.js",
   "roomlist.js",
   "room.js",
   "header.js",
   "footer.js",
   "lockscreen.js",
   "audio.js",
   "debouncers.js",
   "debug.js",
   "urls.js",
   "visual.js",
   "input.js",
   "desktop_notifications.js",
   "other.js"
]

let files_obj = {}

for(let file of files)
{
    files_obj[file] = fs.readFileSync(`${root}${file}`, "utf8")
}

let minified = Terser.minify(files_obj).code

fs.writeFileSync(`${root}bundle.min.js`, minified, "utf8")