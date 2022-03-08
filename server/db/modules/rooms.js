module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Finds a room with the given query and fields to be fetched
  manager.get_room = function (query, fields) {
    return new Promise((resolve, reject) => {
      manager.find_one("rooms", query, fields)

      .then(room => {
        resolve(room)
        return
      })

      .catch(err => {
        resolve(false)
      })
    })
  }

  // Finds rooms with the given ids and fields to be fetched
  manager.get_rooms = function (ids, fields) {
    return new Promise((resolve, reject) => {
      manager.find_multiple("rooms", ids, fields)

      .then(rooms => {
        resolve(rooms)
        return
      })

      .catch(err => {
        resolve([])
      })
    })
  }

  // Creates a room
  manager.create_room = function (data) {
    return new Promise((resolve, reject) => {
      let room = {}

      manager.fill_defaults("rooms", room)
      room.version = vars.rooms_version

      if (data.id !== undefined) {
        room.id = data.id
      }

      if (data.user_id !== undefined) {
        room.keys[data.user_id] = "admin"
      }

      room.name = data.name !== undefined ? data.name : "No Name"

      manager.insert_one("rooms", room)

      .then(ans => {
        resolve(room)
        return
      })

      .catch(err => {
        reject(err)
        logger.log_error(err)
      })
    })
  }

  // Updates a room
  manager.update_room = function (id, fields) {
    fields.modified = Date.now()

    let check = manager.validate_schema("rooms", fields)

    if (!check.passed) {
      console.error(check.message)
      return false
    }

    manager.update_one("rooms", ["id", id], fields)
    return true
  }

  // Appends an item to a list
  manager.push_room_item = function (id, list_name, item) {
    return new Promise((resolve, reject) => {
      manager
        .get_room(["id", id], { [list_name]: 1 })

        .then((room) => {
          room[list_name].push(item)

          if (room[list_name].length > config[`max_${list_name}`]) {
            room[list_name] = room[list_name].slice(
              room[list_name].length - config[`max_${list_name}`]
            )
          }

          manager.update_room(id, { [list_name]: room[list_name] })
          resolve(true)
          return
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
        })
    })
  }

  // Get room objects to form a room list (sync)
  manager.get_roomlist = function () {
    return new Promise(async (resolve, reject) => {
      try {
        let objs = []
        let path = manager.get_dir_path("rooms")
        let file_names = await vars.fsp.readdir(path)
        
        for (let name of file_names) {
          if (name.startsWith(".")) {
            continue
          }

          let fpath = manager.get_file_path("rooms", name)
          let obj
          
          if (manager.path_in_cache(fpath)) {
            obj = manager.cache[fpath].obj
          } else {
            let text = await vars.fsp.readFile(fpath, "utf8")
            obj = JSON.parse(text)
          }
          
          objs.push({id: obj.id, name: obj.name, topic: obj.topic})
        }
  
        resolve(objs)
      } catch (err) {
        reject(err)
        logger.log_error(err)
      }
    })
  }

  // Delete a room file and remove object (sync)
  manager.delete_room = function (id) {
    let fpath = manager.get_file_path("rooms", id)
    vars.fs.rmSync(fpath)
    manager.remove_from_cache(fpath)
  }
}