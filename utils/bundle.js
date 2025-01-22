#!/usr/bin/env node
const fs = require(`fs`)

function bundle(ext, what, manual = []) {
  let dir_path = `public/static/assets/${ext}/${what}/`
  let dir_path_target = `public/static/assets/${ext}/build/`
  let bundle = ``
  let files = fs.readdirSync(dir_path)

  for (let file of manual) {
    bundle += `\n\n`
    bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`)
  }

  bundle = bundle.trim()

  for (let file of files) {
    if (manual.includes(file) || !file.endsWith(`.${ext}`) || file.includes(`.bundle.`)) {
      continue
    }

    bundle += `\n\n`
    bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`)
  }

  bundle = bundle.trim()
  fs.writeFileSync(`${dir_path_target}${what}.bundle.${ext}`, bundle, `utf8`)
}

bundle(`js`, `main`, [`init.js`])
bundle(`js`, `libs`)
bundle(`css`, `libs`)