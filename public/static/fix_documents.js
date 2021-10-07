const fs = require("fs")
const path = require("path")

function fix_users () {
  let users_path = path.join(__dirname, "../../", "server/db/store/users")
  let users = fs.readdirSync(users_path)
  
  for (let user of users) {
    if (user.startsWith(".")) {
      continue
    }
  
    let upath = path.join(users_path, user)
    let text = fs.readFileSync(upath, "utf-8")
    let obj = JSON.parse(text)
    obj.profile_image = obj.profile_image.replace("profile_", "")
    obj.audio_clip = obj.audio_clip.replace("audio_clip_", "")
    fs.writeFileSync(upath, JSON.stringify(obj), "utf-8")
  }  
}

function fix_rooms () {
  let rooms_path = path.join(__dirname, "../../", "server/db/store/rooms")
  let rooms = fs.readdirSync(rooms_path)
  
  for (let room of rooms) {
    if (room.startsWith(".")) {
      continue
    }
  
    let upath = path.join(rooms_path, room)
    let text = fs.readFileSync(upath, "utf-8")
    let obj = JSON.parse(text)
    
    obj.background_image = obj.background_image.replace("bg_", "")
    
    for (let item of obj.log_messages) {
      if (item.data.profile_image) {
        item.data.profile_image = item.data.profile_image.split("_")[1]
      }
  
      if (item.data.source) {
        if (!item.data.source.startsWith("http")) {
          let new_source = item.data.source.replace("/static/img/", "")
          new_source = new_source.replace("/static/video/", "")

          if (new_source.startsWith(`${obj.id}_`)) {
            new_source = new_source.split("_").slice(1).join("_")
            item.data.source = new_source
          }
        }
      }
    }

    let images = []

    for (let image of obj.stored_images) {
      let new_source = image.replace("/static/img/", "")
      
      if (new_source.startsWith(`${obj.id}_`)) {
        new_source = new_source.split("_").slice(1).join("_")
        image = new_source
      }

      images.push(image)
    }

    obj.stored_images = images

    let videos = []

    for (let video of obj.stored_videos) {
      let new_source = video.replace("/static/video/", "")
      
      if (new_source.startsWith(`${obj.id}_`)) {
        new_source = new_source.split("_").slice(1).join("_")
        video = new_source
      }

      videos.push(video)
    }

    obj.stored_videos = videos
  
    fs.writeFileSync(upath, JSON.stringify(obj), "utf-8")
  }
}

fix_users()
fix_rooms()