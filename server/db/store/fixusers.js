const fs = require("fs")
const path = require("path")

function fix_users () {
  let users_path = path.join(__dirname, "users")
  let users = fs.readdirSync(users_path)
  
  for (let user of users) {
    if (user.startsWith(".")) {
      continue
    }
  
    let upath = path.join(users_path, user)
    let text = fs.readFileSync(upath, "utf-8")
    let obj = JSON.parse(text)

    obj["profilepic"] = obj["profile_image"]
    delete obj["profile_image"]

    obj["profilepic_version"] = obj["profile_image_version"]
    delete obj["profile_image_version"]    

    obj["audioclip"] = obj["audio_clip"]
    delete obj["audio_clip"]

    obj["audioclip_version"] = obj["audio_clip_version"]
    delete obj["audio_clip_version"] 
    
    fs.writeFileSync(upath, JSON.stringify(obj), "utf-8")
  }  
}

fix_users()