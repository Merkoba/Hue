const fs = require(`fs`)
const path = require(`path`)
let root_path = path.join(__dirname, `../../../`)

module.exports = (manager, stuff) => {
  // Write to a file
  function write_file(path) {
    clearTimeout(manager.cache[path].timeout)

    if (Date.now() - manager.cache[path].last_write > stuff.sconfig.db_write_file_timeout_limit) {
      do_write_file(path)
    }
    else {
      manager.cache[path].timeout = setTimeout(() => {
        do_write_file(path)
      }, stuff.sconfig.db_write_file_timeout)
    }
  }

  // Check object schema version
  function check_version(type, path, obj) {
    if (obj.version !== stuff.vars[`${type}_version`]) {
      manager.fill_defaults(type, obj)
      obj.version = stuff.vars[`${type}_version`]
      write_file(path, obj)
    }
  }

  // Do the write file operation
  function do_write_file(path) {
    stuff.utilz.loginfo(`Writing: ${path.split(`/`).slice(-2).join(`/`)}`)
    manager.cache[path].last_write = Date.now()

    try {
      fs.writeFileSync(path, JSON.stringify(manager.cache[path].obj), `utf8`)
    }
    catch (err) {
      stuff.logger.log_error(err)
    }
  }

  // Get a new id
  function get_id(type) {
    let ms = Date.now()
    let sec = parseInt(ms / 1000)
    let id = stuff.sconfig[`id_format_${type}`]

    id = id.replace(`[ms]`, ms)
    id = id.replace(`[sec]`, sec)
    id = id.replace(/\[n\]/g, () => stuff.utilz.get_random_int(0, 9))
    return id.replace(/\[c\]/g, () => stuff.utilz.get_random_string(1, false, true))
  }

  manager.cache = {}

  // Add to memory cache
  manager.add_to_cache = (path, obj, proxy) => {
    if (manager.cache[path] === undefined) {
      manager.cache[path] = {timeout: undefined, last_write: 0, obj, proxy}
    }
  }

  // Remove from memory cache
  manager.remove_from_cache = (path, obj) => {
    manager.cache[path] = undefined
  }

  // Check if path is in cache
  manager.path_in_cache = (path) => {
    return manager.cache[path] && manager.cache[path].obj
  }

  // Get the full dir path
  manager.get_dir_path = (type) => {
    return path.join(root_path, `${stuff.sconfig.db_store_path}/${type}`)
  }

  // Get the full file path
  manager.get_file_path = (type, file_name) => {
    return path.join(root_path, `${stuff.sconfig.db_store_path}/${type}/${file_name}`)
  }

  // Make proxy object to handle property updates
  manager.make_proxy_object = (obj, path, type) => {
    let schema = stuff.vars[`${type}_schema`]()

    let handler = {
      get(target, property) {
        return target[property]
      },

      set(target, property, value) {
        if (property in schema) {
          if (typeof value === schema[property].type) {
            target[property] = value
            target.modified = Date.now()
            write_file(path)
          }
          else {
            stuff.logger.log_error(`DB Engine: '${property}' is the wrong type`)
          }
        }
        else {
          stuff.logger.log_error(`DB Engine: '${property}' is not in the schema`)
        }
      },
    }

    return new Proxy(obj, handler)
  }

  // Find one result
  manager.find_one = async (type, query) => {
    try {
      if (query[0] === `id`) {
        let path = manager.get_file_path(type, query[1])
        let obj = await check_file(type, path, query)

        if (obj) {
          return obj
        }

        throw new Error(`Nothing found`)
      }
      else {
        let files = await stuff.i.fsp.readdir(manager.get_dir_path(type))

        for (let file of files) {
          if (file.startsWith(`.`)) {
            continue
          }

          let path = manager.get_file_path(type, file)

          try {
            let obj = await check_file(type, path, query)

            if (obj) {
              return obj
            }
          }
          catch (err) {
            // Don't do anything
          }
        }
      }
    }
    catch (err) {
      stuff.logger.log_error(err)
      throw err
    }
  }

  // Find multiple results based on a list of ids
  manager.find_multiple = async (type, ids) => {
    let objs = []

    for (let id of ids) {
      try {
        let obj = await manager.find_one(type, [`id`, id])
        objs.push(obj)
      }
      catch (err) {
        // Handle error if needed
      }
    }

    return objs
  }

  // Check if the file matches
  async function check_file(type, path, query) {
    if (manager.path_in_cache(path)) {
      let proxy = manager.cache[path].proxy

      if (check_file_query(type, proxy, query)) {
        return proxy
      }

      throw new Error(`Nothing found`)
    }
    else {
      let text = await stuff.i.fsp.readFile(path, `utf8`)
      let original = JSON.parse(text)
      let proxy = manager.make_proxy_object(original, path, type)
      manager.add_to_cache(path, original, proxy)
      check_version(type, path, proxy)

      if (check_file_query(type, proxy, query)) {
        return proxy
      }

      throw new Error(`Nothing found`)
    }
  }

  // Check file using the query
  function check_file_query(type, original, query) {
    if (!query || (query.length !== 2) || !query[0] || (query[1] === undefined)) {
      return
    }

    let prop_1 = original[query[0]]
    let prop_2 = query[1]

    if ((type === `users`) && (query[0] === `username`)) {
      prop_1 = prop_1.toLowerCase()
      prop_2 = prop_2.toLowerCase()
    }

    return prop_1 === prop_2
  }

  // Insert a new file in the proper directory
  manager.insert_one = (type, original) => {
    if (!original.id) {
      original.id = get_id(type)
    }

    let path = manager.get_file_path(type, original.id)
    let proxy = manager.make_proxy_object(original, path, type)
    manager.add_to_cache(path, original, proxy)
    write_file(path)
    return proxy
  }

  // Fill unexisting keys with defaults
  // Also remove obsolete keys
  manager.fill_defaults = (type, obj) => {
    let schema = stuff.vars[`${type}_schema`]()

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

  // Push an item to a list and keep at a proper size
  manager.push_item = async (type, id, list_name, item) => {
    let obj = await manager.find_one(type, [`id`, id])

    if (obj) {
      obj[list_name].push(item)

      if (obj[list_name].length > stuff.config[`max_${list_name}`]) {
        obj[list_name] = obj[list_name].slice(
          obj[list_name].length - stuff.config[`max_${list_name}`],
        )
      }

      // This is to trigger file write
      obj.modified = Date.now()
    }
  }
}