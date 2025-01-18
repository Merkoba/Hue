const fs = require(`fs`)

let dir_path = `public/static/assets/css/libs/`
let dir_path_target = `public/static/assets/css/build/`
let files = fs.readdirSync(dir_path)
let bundle = ``

for (let file of files) {
  if (!file.endsWith(`.css`) || file === `libs.bundle.css`) {
    continue
  }

  bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`) + `\n`
}

fs.writeFileSync(`${dir_path_target}libs.bundle.css`, bundle, `utf8`)