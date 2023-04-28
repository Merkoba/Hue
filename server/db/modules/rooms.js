module.exports = (manager, vars, config, sconfig, utilz, logger) => {
  // Finds a room with the given query
  manager.get_room = (query) => {
    return new Promise((resolve, reject) => {
      manager.find_one(`rooms`, query)

      .then(room => {
        resolve(room)
        return
      })

      .catch(err => {
        resolve(false)
      })
    })
  }

  // Finds rooms with the given ids
  manager.get_rooms = (ids) => {
    return new Promise((resolve, reject) => {
      manager.find_multiple(`rooms`, ids)

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
  manager.create_room = (data) => {
    return new Promise((resolve, reject) => {
      let room = {}

      manager.fill_defaults(`rooms`, room)
      room.version = vars.rooms_version

      if (data.id !== undefined) {
        room.id = data.id
      }

      if (data.user_id !== undefined) {
        room.keys[data.user_id] = `admin`
      }

      room.name = data.name !== undefined ? data.name : `No Name`

      manager.insert_one(`rooms`, room)

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

  // Get room objects to form a room list (sync)
  manager.get_roomlist = () => {
    return new Promise(async (resolve, reject) => {
      try {
        let objs = []
        let path = manager.get_dir_path(`rooms`)
        let file_names = await vars.fsp.readdir(path)

        for (let name of file_names) {
          if (name.startsWith(`.`)) {
            continue
          }

          let fpath = manager.get_file_path(`rooms`, name)
          let obj

          if (manager.path_in_cache(fpath)) {
            obj = manager.cache[fpath].obj
          }
          else {
            let text = await vars.fsp.readFile(fpath, `utf8`)
            obj = JSON.parse(text)
          }

          objs.push({id: obj.id, name: obj.name, topic: obj.topic, modified: obj.modified})
        }

        resolve(objs)
      }
      catch (err) {
        reject(err)
        logger.log_error(err)
      }
    })
  }

  // Delete a room file and remove object (sync)
  manager.delete_room = (id) => {
    let fpath = manager.get_file_path(`rooms`, id)
    vars.fs.rmSync(fpath)
    manager.remove_from_cache(fpath)
  }
}