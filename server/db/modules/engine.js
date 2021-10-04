const fs = require("fs")
const path = require("path")
const root_path = path.join(__dirname, "../../../")
const cache = {}

module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Get the full file path
  function get_file_path (type, fname) {
    return path.join(root_path, `${config.db_store_path}/${type}/${fname}`)
  }

  // Get the full dir path
  function get_dir_path (type) {
    return path.join(root_path, `${config.db_store_path}/${type}`)
  }

  // Write to a file considering the cache
  function write_file (path, json) {
    if (cache[path] === undefined) {
      cache[path] = {timeout: undefined, json: {}, last_write: 0}
    }

    clearTimeout(cache[path].timeout)
    cache[path].json = json

    if (Date.now() - cache[path].last_write > config.db_write_file_timeout_limit) {
      do_write_file(path)
    } else {
      cache[path].timeout = setTimeout(() => {
        do_write_file(path)
      }, config.db_write_file_timeout)
    }
  }

  // Do the write file operation
  function do_write_file (path) {
    console.info(`Writing: ${path.split("/").slice(-2).join("/")}`)
    cache[path].last_write = Date.now()
    fs.writeFile(path, JSON.stringify(cache[path].json), "utf8", err => {
      if (err) {
        logger.log_error(err)
      }
    })
  }

  // Find one result
  manager.find_one = function (type, query, fields) {
    return new Promise((resolve, reject) => {
      if (query[0] === "id") {
        let path = get_file_path(type, query[1])
        
        check_file(path, query, fields)

        .then(obj => {
          if (obj) {
            resolve(obj)
          } else {
            reject("Nothing found")
          }
        })

        .catch(err => {
          reject("Nothing found")
        })
      }

      fs.readdir(get_dir_path(type), async (err, fnames) => {
        if (err) {
          logger.log_error(err)
          reject("Nothing found")
          return
        }

        for (let fname of fnames) {
          let path = get_file_path(type, fname)

          try {
            let obj = await check_file(path, query, fields)
            if (obj) {
              resolve(obj)
              return
            }
          } catch (err) {}
        }

        reject("Nothing found")
        return
      })
    })
  }

  // Find multiple results based on a list of ids
  manager.find_multiple = function (type, ids, fields) {
    return new Promise(async (resolve, reject) => {
      let objs = []

      for (let id of ids) {
        try {
          let obj = await manager.find_one(type, ["id", id], fields)
          objs.push(obj)
        } catch (err) {}
      }

      resolve(objs)
    })
  }

  // Check if the file matches
  function check_file (path, query, fields) {
    return new Promise((resolve, reject) => {
      if (cache[path] && cache[path].json) {
        let obj = check_file_query(cache[path].json, query, fields)
        if (obj) {
          resolve(obj)
          return
        } else {
          reject("Nothing found")
          return
        }
      }

      fs.readFile(path, "utf8", (err, text) => {
        if (err) {
          reject("Nothing found")
          return
        }

        let jsn = {}

        try {
          jsn = JSON.parse(text)
        } catch (err) {
          reject("Nothing found")
          return
        }

        let obj = check_file_query(jsn, query, fields)

        if (obj) {
          resolve(obj)
        } else {
          reject("Nothing found")
        }
      })
    })
  }

  // Check file using the query and fields
  function check_file_query (original, query, fields) {
    if (!query || query.length !== 2 || !query[0] || query[1] === undefined) {
      return false
    }

    if (original[query[0]] !== query[1]) {
      return false
    }

    let obj = Object.assign({}, original)
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

  // Insert a new file in the proper directory
  manager.insert_one = function (type, obj) {
    return new Promise((resolve, reject) => {
      if (obj.id === undefined) {
        obj.id = `${Math.round(new Date() / 1000)}_${utilz.get_random_string(4)}`
      }

      write_file(get_file_path(type, obj.id), obj)
      resolve(obj)
    })
  }

  // Update properties of one file
  manager.update_one = function (type, query, fields) {
    return new Promise((resolve, reject) => {
      manager.find_one(type, query, {})

      .then(obj => {
        for (let key in fields) {
          obj[key] = fields[key]
        }

        write_file(get_file_path(type, obj.id), obj)
        resolve("Ok")
      })
    })
  }
}