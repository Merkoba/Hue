const fs = require("fs")
const Terser = require("terser")

let dir_path = "../public/static/js/libs/"
let minified = ""
let manual = ["jquery.min.js"]
let files = fs.readdirSync(dir_path)

for(let file of manual)
{
    let content = fs.readFileSync(`${dir_path}${file}`, "utf8")
    minified += Terser.minify(content).code
}

for(let file of files)
{
    if(manual.includes(file))
    {
        continue
    }

    let content = fs.readFileSync(`${dir_path}${file}`, "utf8")
    minified += Terser.minify(content).code
}

fs.writeFileSync(`${dir_path}bundle.min.js`, minified, "utf8")