const fs = require("fs")
const path = require("path")
const root_path = path.join(__dirname, "../../../")
const cache = {}
const update_calls = []
let update_calling = false

module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Get the full file path
  function get_file_path (type, file_name) {
    return path.join(root_path, `${config.db_store_path}/${type}/${file_name}`)
  }

  // Get the full dir path
  function get_dir_path (type) {
    return path.join(root_path, `${config.db_store_path}/${type}`)
  }

  // Write to a file
  function write_file (path) {
    clearTimeout(cache[path].timeout)

    if (Date.now() - cache[path].last_write > config.db_write_file_timeout_limit) {
      do_write_file(path)
    } else {
      cache[path].timeout = setTimeout(() => {
        do_write_file(path)
      }, config.db_write_file_timeout)
    }
  }

  // Add to memory cache
  function add_to_cache (path, obj) {
    if (cache[path] === undefined) {
      cache[path] = {timeout: undefined, obj: {}, last_write: 0, obj: obj}
    }
  }

  // Check object schema version
  function check_version (type, path, obj) {
    if (obj.version !== vars[`${type}_version`]) {
      manager.fill_defaults(type, obj)
      obj.version = vars[`${type}_version`]
      write_file (path, obj)
    }
  }

  // Do the write file operation
  function do_write_file (path) {
    utilz.loginfo(`Writing: ${path.split("/").slice(-2).join("/")}`)
    cache[path].last_write = Date.now()
    fs.writeFile(path, JSON.stringify(cache[path].obj), "utf8", err => {
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

        check_file(type, path, query, fields)

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
      } else {
        fs.readdir(get_dir_path(type), async (err, file_names) => {
          if (err) {
            logger.log_error(err)
            reject("Nothing found")
            return
          }

          for (let file_name of file_names) {
            if (file_name.startsWith(".")) {
              continue
            }

            let path = get_file_path(type, file_name)

            try {
              let obj = await check_file(type, path, query, fields)
              if (obj) {
                resolve(obj)
                return
              }
            } catch (err) {}
          }

          reject("Nothing found")
          return
        })
      }
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
  function check_file (type, path, query, fields) {
    return new Promise((resolve, reject) => {
      if (cache[path] && cache[path].obj) {
        let obj = check_file_query(cache[path].obj, query, fields)

        if (obj) {
          resolve(obj)
        } else {
          reject("Nothing found")
        }
      } else {
        fs.readFile(path, "utf8", (err, text) => {
          if (err) {
            reject("Nothing found")
            return
          }

          let original = {}

          try {
            original = JSON.parse(text)
          } catch (err) {
            reject("Nothing found")
            return
          }

          add_to_cache(path, original)
          check_version(type, path, original)

          let obj = check_file_query(original, query, fields)

          if (obj) {
            resolve(obj)
          } else {
            reject("Nothing found")
          }
        })
      }
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

    // Don't delete from the original
    // As it should remain complete
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
      if (!obj.id) {
        obj.id = `${Math.round(new Date() / 1000)}_${utilz.get_random_string(4)}`
      }

      let path = get_file_path(type, obj.id)
      add_to_cache(path, obj)
      write_file(path)
      resolve(obj)
    })
  }

  // Add call to the update queue
  manager.update_one = function (type, query, fields) {
    let call = {type: type, query: query, fields: fields}

    update_calls.push(call)

    if (!update_calling) {
      do_update_call()
    }
  }

  // Fill unexisting keys with defaults
  // Also remove obsolete keys
  manager.fill_defaults = function (type, obj) {
    let schema = vars[`${type}_schema`]()

    // Fill defaults
    for (let key in schema) {
      let item = schema[key]

      if (item.skip) {
        continue
      }

      if (typeof obj[key] !== item.type) {
        obj[key] = item.default
      }
    }

    // Remove unused keys (careful)
    for (let key in obj) {
      if (schema[key] === undefined) {
        delete obj[key]
      }
    }
  }

  // Process next update queue item
  function do_update_call () {
    if (update_calls.length > 0) {
      let call = update_calls.shift()

      update_calling = true
      do_update_one(call)

      .then(ans => {
        update_calling = false
        do_update_call()
      })

      .catch(err => {
        update_calling = false
        logger.log_error(err)
        do_update_call()
      })
    }
  }

  // Update properties of one file
  function do_update_one (call) {
    return new Promise((resolve, reject) => {
      manager.find_one(call.type, call.query, {})

      .then(obj => {
        for (let key in call.fields) {
          obj[key] = call.fields[key]
        }

        let path = get_file_path(call.type, obj.id)
        cache[path].obj = obj
        write_file(path)
        resolve("Ok")
      })

      .catch(err => {
        resolve("Not updated")
      })
    })
  }

  // Check field types against a schema
  manager.validate_schema = function (type, fields) {
    let schema = vars[`${type}_schema`]()

    for (let key in fields) {
      if (key === "id" || key === "password") {
        let s = `[${type}] Validation failed on '${key}'. Property is read-only`
        return { passed: false, message: s }
      }

      let item = schema[key]
      let data = fields[key]

      if (item) {
        let type = typeof data

        if (type !== item.type) {
          let s = `[${type}] Validation failed on '${key}'. Expected type '${item.type}', got type '${type}'`
          return { passed: false, message: s }
        }
      } else {
        let s = `[${type}] Validation failed on '${key}'. It does not exist in the database`
        return { passed: false, message: s }
      }
    }

    return { passed: true, message: "ok" }
  }
}