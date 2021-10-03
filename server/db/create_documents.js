// Run this in the DB directory
// which should be outside the project's root

const fs = require("fs")

function get_random_int (min, max, exclude = undefined) {
  let num = Math.floor(Math.random() * (max - min + 1) + min)

  if (exclude !== undefined) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      } else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

function get_random_string (n) {
  let text = ""

  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < n; i++) {
    text += possible[get_random_int(0, possible.length - 1)]
  }

  return text
}

function create_files (what) {
  let text_file = fs.readFileSync(`${what}.txt`, "utf8").trim()
  let lines = text_file.split("\n").filter(x => x.trim() != "")
  
  for (let line of lines) {
    let obj = JSON.parse(line)
    
    if (obj._id === "main") {
      obj.id = "main"
    } else {
      obj.id = obj._id.valueOf()["$oid"]
    }

    delete obj._id

    fs.writeFileSync(`./store/${what}/${obj.id}`, JSON.stringify(obj), "utf8")
  }  
}

create_files("users")
create_files("rooms")