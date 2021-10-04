module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Finds a room with the given query and fields to be fetched
  manager.get_room = function (query, fields) {
    return new Promise((resolve, reject) => {
      manager.find_one("rooms", query, fields)

      .then(room => {
        manager.room_fill_defaults(room)
        room.version = vars.rooms_version
        resolve(room)
        return
      })

      .catch(err => {
        resolve(false)
        return
      })
    })
  }

  // Finds rooms with the given ids and fields to be fetched
  manager.get_rooms = function (ids, fields) {
    return new Promise((resolve, reject) => {
      manager.find_multiple("rooms", ids, fields)

      .then(rooms => {
        for (let room of rooms) {
          manager.room_fill_defaults(room)
          room.version = vars.rooms_version
        }
        
        resolve(rooms)
        return
      })   

      .catch(err => {
        resolve([])
        return
      })
    })
  }  

  // Fills undefined room properties
  // Or properties that don't meet the specified type
  manager.room_fill_defaults = function (room) {
    let schema = vars.rooms_schema()

    for (let key in schema) {
      let item = schema[key]

      if (item.skip) {
        continue
      }

      if (typeof room[key] !== item.type) {
        room[key] = item.default
      }
    }
  }

  // Creates a room
  manager.create_room = function (data) {
    return new Promise((resolve, reject) => {
      let room = {}

      manager.room_fill_defaults(room)

      if (data.id !== undefined) {
        room.id = data.id
      }

      if (data.user_id !== undefined) {
        room.keys[data.user_id] = "admin"
      }

      room.name = data.name !== undefined ? data.name : "No Name"
      room.version = vars.rooms_version

      manager.insert_one("rooms", room)
      
      .then(ans => {
        resolve(room)
        return
      })

      .catch(err => {
        reject(err)
        logger.log_error(err)
        return
      })
    })
  }

  // Room creation started by a user
  manager.user_create_room = function (data, force = false) {
    return new Promise((resolve, reject) => {
      manager
        .get_user(["id", data.user_id], { create_room_date: 1 })

        .then((user) => {
          if (!force) {
            if (
              Date.now() - user.create_room_date <
              config.create_room_cooldown
            ) {
              resolve("wait")
              return
            }
          }

          manager
            .create_room(data)

            .then((ans) => {
              manager
                .update_user(data.user_id, {
                  create_room_date: Date.now(),
                })

                .catch(err => {
                  reject(err)
                  logger.log_error(err)
                  return
                })

              resolve(ans)
              return
            })

            .catch(err => {
              reject(err)
              logger.log_error(err)
              return
            })
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates a room
  manager.update_room = function (id, fields) {
    return new Promise((resolve, reject) => {
      fields.modified = Date.now()

      let check = manager.validate_room(fields)

      if (!check.passed) {
        console.error(check.message)
        resolve(false)
        return
      }

      manager.update_one("rooms", ["id", id], fields)

      .then(ans => {
        resolve(true)
        return
      })

      .catch(err => {
        reject(err)
        logger.log_error(err)
        return
      })
    })
  }

  // Updates log messages
  manager.push_log_messages = function (id, messages) {
    return new Promise((resolve, reject) => {
      manager
        .get_room(["id", id], { log_messages: 1 })

        .then((room) => {
          room.log_messages = messages

          if (room.log_messages.length > config.max_log_messages) {
            room.log_messages = room.log_messages.slice(
              room.log_messages.length - config.max_log_messages
            )
          }

          manager
            .update_room(id, { log_messages: room.log_messages })

            .catch(err => {
              reject(err)
              logger.log_error(err)
              return
            })

          resolve(true)
          return
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates admin log messages
  manager.push_admin_log_messages = function (id, messages) {
    return new Promise((resolve, reject) => {
      manager
        .get_room(["id", id], { admin_log_messages: 1 })

        .then((room) => {
          room.admin_log_messages = messages

          if (room.admin_log_messages.length > config.max_admin_log_messages) {
            room.admin_log_messages = room.admin_log_messages.slice(
              room.admin_log_messages.length - config.max_admin_log_messages
            )
          }

          manager
            .update_room(id, { admin_log_messages: room.admin_log_messages })

            .catch(err => {
              reject(err)
              logger.log_error(err)
              return
            })

          resolve(true)
          return
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Checks fields types against the room schema types
  manager.validate_room = function (fields) {
    let schema = vars.rooms_schema()

    for (let key in fields) {
      let item = schema[key]
      let data = fields[key]

      if (item) {
        let type = typeof data

        if (type !== item.type) {
          let s = `Room validation failed on ${key}. Expected type ${item.type}, got type ${type}`
          return { passed: false, message: s }
        }
      } else {
        let s = `Room validation failed on ${key}. It does not exist in the database`
        return { passed: false, message: s }
      }
    }

    return { passed: true, message: "ok" }
  }
}
