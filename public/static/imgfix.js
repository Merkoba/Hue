const fs = require("fs")
const path = require("path")
const img_path = path.join(__dirname, "img")
const files = fs.readdirSync("img")

let rooms = {}
let profiles = []
let backgrounds = []

for (let file of files) {
  if (fs.lstatSync(path.join(img_path, file)).isDirectory()) {
    continue
  }

  if (file.startsWith(".")) {
    continue
  }

  if (file.startsWith("profile_")) {
    profiles.push(file)
  } else if (file.startsWith("bg_")) {
    backgrounds.push(file)
  } else if (file.includes("_")) {
    let id = file.split("_")[0]
    
    if (!rooms[id]) {
      rooms[id] = []
    }

    rooms[id].push(file)
  }
}

function copy_profiles () {
  let profiles_dir = path.join(__dirname, "img/profile")

  if (!fs.existsSync(profiles_dir)) {
    fs.mkdirSync(profiles_dir)
  }

  for (let profile of profiles) {
    let name = profile.replace("profile_", "")
    fs.copyFileSync(path.join(img_path, profile), path.join(profiles_dir, name))
  }
}

function copy_backgrounds () {
  let backgrounds_dir = path.join(__dirname, "img/background")

  if (!fs.existsSync(backgrounds_dir)) {
    fs.mkdirSync(backgrounds_dir)
  }

  for (let background of backgrounds) {
    let name = background.replace("bg_", "")
    fs.copyFileSync(path.join(img_path, background), path.join(backgrounds_dir, name))
  }
}

function copy_rooms () {
  for (let id in rooms) {
    let room_dir = path.join(__dirname, `img/room/${id}`)

    if (!fs.existsSync(room_dir)) {
      fs.mkdirSync(room_dir)
    }

    for (let room_image of rooms[id]) {
      let name = room_image.split("_").slice(1).join("_")
      fs.copyFileSync(path.join(img_path, room_image), path.join(room_dir, name))
    }
  } 
}

copy_profiles()
copy_backgrounds()
copy_rooms()