const fs = require("fs")
const path = require("path")
const video_path = path.join(__dirname, "video")
const files = fs.readdirSync("video")

let rooms = {}

for (let file of files) {
  if (fs.lstatSync(path.join(video_path, file)).isDirectory()) {
    continue
  }

  if (file.startsWith(".")) {
    continue
  }

  let id = file.split("_")[0]
  
  if (!rooms[id]) {
    rooms[id] = []
  }

  rooms[id].push(file)
}

function copy_rooms () {
  for (let id in rooms) {
    let room_dir = path.join(__dirname, `video/${id}`)

    if (!fs.existsSync(room_dir)) {
      fs.mkdirSync(room_dir)
    }

    for (let room_video of rooms[id]) {
      let name = room_video.split("_").slice(1).join("_")
      fs.copyFileSync(path.join(video_path, room_video), path.join(room_dir, name))
    }
  } 
}

copy_rooms()