const fs = require("fs")

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