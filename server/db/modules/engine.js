const fs = require("fs")
const path = require("path")
const cache = {}
const root_path = path.join(__dirname, "../../../")

module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  manager.get_file_path = function (type, fname) {
    return path.join(root_path, `${config.db_store_path}/${type}/${fname}`)
  }

  manager.get_dir_path = function (type, fname) {
    return path.join(root_path, `${config.db_store_path}/${type}`)
  }  

  manager.write_file = function (path, content) {
    if (cache[path] === undefined) {
      cache[path] = {timeout: undefined, content: undefined, last_write: 0}
    }

    clearTimeout(cache[path].timeout)
    cache[path].content = content

    let delay = 3000

    if (Date.now() - cache[path].last_write > 10000) {
      delay = 0
    }
     
    cache[path].timeout = setTimeout(() => {
      console.info(`Writing: ${path}`)
      cache[path].last_write = Date.now()
      fs.writeFile(path, cache[path].content, "utf8", function () {})
    }, delay)
  } 

  manager.find_one = function (type, query, fields) {
    return new Promise((resolve, reject) => {
      if (query.id !== undefined) {
        let path = manager.get_file_path(type, query.id)

        manager.check_file(path, query, fields)
        
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
      
      fs.readdir(manager.get_dir_path(type), function (err, fnames) {
        let keep_going = true

        for (let fname of fnames) {
          if (!keep_going) {
            return
          }

          let path = manager.get_file_path(type, fname)

          manager.check_file(path, query, fields)
        
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

  manager.check_file = function (path, query, fields) {
    return new Promise((resolve, reject) => {
      if (cache[path] && cache[path].content) {
        let obj = manager.check_file_query(cache[path].content, query, fields)
        if (obj) {
          resolve(obj)
          return
        } else {
          reject("Nothing found")
          return
        }
      }

      fs.readFile(path, "utf8", function (err, text) {
        let obj = manager.check_file_query(text, query, fields)
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

  manager.check_file_query = function (text, query, fields) {
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

      manager.write_file(manager.get_file_path(type, obj.id), JSON.stringify(obj))
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

        manager.write_file(manager.get_file_path(type, obj.id), JSON.stringify(obj))
        resolve("Ok")
      })
    })
  }

  manager.delete_one = function (type, id) {
    return new Promise((resolve, reject) => {
      if (id) {
        fs.unlink(manager.get_file_path(type, id))
        resolve("Ok")
        return
      } else {
        reject("Invalid ID")
        return
      }
    })
  }
}