const fs = require("fs")

let dir_path = "../public/static/css/libs/"
let dir_path_target = "../public/static/css/build/"
let files = fs.readdirSync(dir_path)
let bundle = ""

for (let file of files) {
    if (!file.endsWith(".css") || file === "libs.bundle.min.css") {
        continue
    }

    bundle += fs.readFileSync(`${dir_path}${file}`, "utf8") + "\n"
}

fs.writeFileSync(`${dir_path_target}libs.bundle.min.css`, bundle, "utf8")