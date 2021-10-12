const fs = require("fs")
const path = require("path")

for (let room of fs.readdirSync(path.join(__dirname, "rooms"))) {
  if (room.startsWith(".")) {
    continue
  }

  let file = fs.readFileSync(path.join(__dirname, "rooms", room))
  let obj = JSON.parse(file)
  console.log(obj.background)
}