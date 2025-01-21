module.exports = (manager, stuff) => {
  // Finds a room with the given query
  manager.get_room = async (query) => {
    try {
      return await manager.find_one(`rooms`, query)
    }
    catch (err) {
      return false
    }
  }

  // Finds rooms with the given ids
  manager.get_rooms = async (ids) => {
    try {
      return await manager.find_multiple(`rooms`, ids)
    }
    catch (err) {
      return []
    }
  }

  // Creates a room
  manager.create_room = async (data) => {
    let room = {}

    manager.fill_defaults(`rooms`, room)
    room.version = stuff.vars.rooms_version

    if (data.id !== undefined) {
      room.id = data.id
    }

    if (data.user_id !== undefined) {
      room.keys[data.user_id] = `admin`
    }

    room.name = data.name !== undefined ? data.name : `No Name`
    room.public = data.public

    try {
      return await manager.insert_one(`rooms`, room)
    }
    catch (err) {
      stuff.logger.log_error(err)
      throw err
    }
  }

  // Get room objects to form a room list
  manager.get_roomlist = async () => {
    let objs = []
    let path = manager.get_dir_path(`rooms`)
    let file_names = await stuff.i.fsp.readdir(path)

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
        let text = await stuff.i.fsp.readFile(fpath, `utf8`)
        obj = JSON.parse(text)
      }

      if (!obj.public) {
        continue
      }

      objs.push({
        id: obj.id,
        name: obj.name,
        topic: obj.topic,
        modified: obj.modified,
      })
    }

    return objs
  }

  // Delete a room file and remove object (sync)
  manager.delete_room = (id) => {
    let fpath = manager.get_file_path(`rooms`, id)
    stuff.i.fs.rmSync(fpath)
    manager.remove_from_cache(fpath)
  }
}