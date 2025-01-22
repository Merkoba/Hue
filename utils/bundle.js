#!/usr/bin/env node
const fs = require(`fs`)

function clean(content) {
  content = content.replace(/^\s*\/\/.*$/gm, ``)
  return content.replace(/\n\s*\n/g, `\n\n`).trim()
}

function bundle(ext, what, manual = []) {
  let dir_path = `public/static/assets/${ext}/${what}/`
  let dir_path_target = `public/static/assets/${ext}/build/`
  let bundle = ``
  let files = fs.readdirSync(dir_path)

  for (let file of manual) {
    bundle += `\n`
    bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`)
  }

  for (let file of files) {
    if (manual.includes(file) || !file.endsWith(`.${ext}`) || file.includes(`.bundle.`)) {
      continue
    }

    bundle += `\n`
    bundle += fs.readFileSync(`${dir_path}${file}`, `utf8`)
  }

  fs.writeFileSync(`${dir_path_target}${what}.bundle.${ext}`, clean(bundle), `utf8`)
}

bundle(`js`, `main`, [`init.js`])
bundle(`js`, `libs`)
bundle(`css`, `libs`)