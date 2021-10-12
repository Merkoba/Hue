const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

function fix_rooms ()
{
  let ids = []

  for (let id of fs.readdirSync(path.join(__dirname, "../../server/db/store/rooms"))) {
    if (id.startsWith(".")) {
      continue
    }
  
    ids.push(id)
  }
  
  execSync("mkdir -p room")

  for (let id of ids) {
    if (fs.existsSync(path.join(__dirname, "image", id))) {
      execSync(`mkdir -p room/${id}`)
      execSync(`mkdir -p room/${id}/image`)
      execSync(`find image/${id} -maxdepth 1 -type f -exec cp '{}' room/${id}/image/ \\;`)
    }
    
    if (fs.existsSync(path.join(__dirname, "tv", id))) {
      execSync(`mkdir -p room/${id}`)
      execSync(`mkdir -p room/${id}/tv`)
      execSync(`find tv/${id} -maxdepth 1 -type f -exec cp '{}' room/${id}/tv/ \\;`)
    }
  }  
}

function fix_users ()
{
  let ids = []

  for (let id of fs.readdirSync(path.join(__dirname, "../../server/db/store/users"))) {
    if (id.startsWith(".")) {
      continue
    }
  
    ids.push(id)
  }

  execSync("mkdir -p user")

  for (let id of ids) {
    let p = path.join(__dirname, "audioclip", `${id}.mp3`)
    
    if (fs.existsSync(p)) {
      execSync(`mkdir -p user/${id}`)
      execSync(`cp audioclip/${id}.mp3 user/${id}/audioclip.mp3`)
    }  
    
    p = path.join(__dirname, "profilepic", `${id}.png`)
    
    if (fs.existsSync(p)) {
      execSync(`mkdir -p user/${id}`)
      execSync(`cp profilepic/${id}.png user/${id}/profilepic.png`)
    }   
  } 
}

fix_rooms()
fix_users()