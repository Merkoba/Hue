const fs = require("fs")
const path = require("path")
const audio_path = path.join(__dirname, "audio")
const files = fs.readdirSync(audio_path)

let audios = []

for (let file of files) {
  if (fs.lstatSync(path.join(audio_path, file)).isDirectory()) {
    continue
  }

  if (file.startsWith(".")) {
    continue
  }

  audios.push(file)
}

function copy_audio () {
  for (let audio of audios) {
    let name = audio.replace("audio_clip_", "")
    fs.renameSync(path.join(audio_path, audio), path.join(audio_path, name))
  }
}

copy_audio()