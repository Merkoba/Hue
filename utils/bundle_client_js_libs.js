const fs = require(`fs`)

let dir_path = `public/static/assets/js/libs/`
let dir_path_target = `public/static/assets/js/build/`
let bundle = ``
let manual = []
let files = fs.readdirSync(dir_path)

for (let file of manual) {
  bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`) + `\n`
}

for (let file of files) {
  if (manual.includes(file) || !file.endsWith(`.js`) || file === `libs.bundle.js`) {
    continue
  }

  bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`) + `\n`
}

fs.writeFileSync(`${dir_path_target}libs.bundle.js`, bundle, `utf8`)