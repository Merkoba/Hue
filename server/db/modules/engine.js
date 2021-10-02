const fs = require("fs")
const path = require("path")
const root_path = path.join(__dirname, "../../../")
const cache = {}

module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  function get_file_path (type, fname) {
    return path.join(root_path, `${config.db_store_path}/${type}/${fname}`)
  }

  function get_dir_path (type, fname) {
    return path.join(root_path, `${config.db_store_path}/${type}`)
  }

  function write_file (path, content) {
    if (cache[path] === undefined) {
      cache[path] = {timeout: undefined, content: undefined, last_write: 0}
    }

    clearTimeout(cache[path].timeout)
    cache[path].content = content

    if (Date.now() - cache[path].last_write > 10000) {
      do_write_file(path)
    } else {
      cache[path].timeout = setTimeout(() => {
        do_write_file(path)
      }, 2000)
    }
  } 

  function do_write_file (path) {
    console.info(`Writing: ${path.split("/").slice(-2).join("/")}`)
    cache[path].last_write = Date.now()
    fs.writeFile(path, cache[path].content, "utf8", function () {})
  }  

  manager.find_one = function (type, query, fields) {
    return new Promise((resolve, reject) => {
      if (query.id !== undefined) {
        let path = get_file_path(type, query.id)

        check_file(path, query, fields)
        
        .then(obj => {
          resolve(obj)
          keep_going = false
          return
        })

        .catch(err => {
          // 
        })    
        
        return
      }
      
      fs.readdir(get_dir_path(type), function (err, fnames) {
        let keep_going = true

        for (let fname of fnames) {
          if (!keep_going) {
            return
          }

          let path = get_file_path(type, fname)

          check_file(path, query, fields)
        
          .then(obj => {
            resolve(obj)
            keep_going = false
            return
          })

          .catch(err => {
            // 
          })            
        }
      })
    })
  }

  function check_file (path, query, fields) {
    return new Promise((resolve, reject) => {
      if (cache[path] && cache[path].content) {
        let obj = check_file_query(cache[path].content, query, fields)
        if (obj) {
          resolve(obj)
          return
        } else {
          reject("Nothing found")
          return
        }
      }

      fs.readFile(path, "utf8", function (err, text) {
        let obj = check_file_query(text, query, fields)
        if (obj) {
          resolve(obj)
          return
        } else {
          reject("Nothing found")
          return
        }
      })
    })
  }  

  function check_file_query (text, query, fields) {
    let obj = {}

    try {
      obj = JSON.parse(text)
    } catch (err) {
      return false
    }

    for (let key in query) {
      if (obj[key] === query[key]) {
        let fieldkeys = Object.keys(fields)
        if (fieldkeys.length > 0) {
          let mode = ""
          let first_field = fields[fieldkeys[0]]
          
          if (first_field === 1) {
            mode = "include"
          } else if (first_field === 0) {
            mode = "exclude"
          }

          for (let key in obj) {
            if (key === "id") {
              continue
            }

            if (mode === "include") {
              if (!fieldkeys.includes(key)) {
                delete obj[key]
              }
            } else if (mode === "exclude") {
              if (fieldkeys.includes(key)) {
                delete obj[key]
              }
            }
          }
        } 

        return obj
      } 
    }

    return false
  }

  manager.insert_one = function (type, obj) {
    return new Promise((resolve, reject) => {
      if (obj.id === undefined) {
        obj.id = `${Math.round(new Date() / 1000)}_${utilz.get_random_string(4)}`
      }

      write_file(get_file_path(type, obj.id), JSON.stringify(obj))
      resolve(obj)
    })
  }

  manager.update_one = function (type, query, fields) {
    return new Promise((resolve, reject) => {
      manager.find_one(type, query, {})

      .then(obj => {
        for (let key in fields) {
          obj[key] = fields[key]
        }

        write_file(get_file_path(type, obj.id), JSON.stringify(obj))
        resolve("Ok")
      })
    })
  }

  manager.delete_one = function (type, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        fs.unlink(get_file_path(type, id))
        resolve("Ok")
        return
      } else {
        reject("Invalid ID")
        return
      }
    })
  }
}