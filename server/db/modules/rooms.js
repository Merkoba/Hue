module.exports = function (manager, vars, db, config, sconfig, utilz, logger) {
  // Finds a room with the given query and fields to be fetched
  manager.get_room = function (query, fields) {
    return new Promise((resolve, reject) => {
      let num_fields = Object.keys(fields).length

      if (num_fields > 0) {
        let has_zero = false

        for (let key in fields) {
          if (fields[key] === 0) {
            has_zero = true
            break
          }
        }

        if (!has_zero) {
          fields.version = 1
        }
      }

      if (query._id !== undefined) {
        if (
          typeof query._id === "string" &&
          query._id !== config.main_room_id
        ) {
          try {
            query._id = new vars.mongo.ObjectId(query._id)
          } catch (err) {
            resolve(false)
            return
          }
        }
      }

      let pfields = {}

      if (num_fields > 0) {
        pfields = { projection: fields }
      }

      db.collection("rooms")
        .findOne(query, pfields)

        .then((room) => {
          if (!room) {
            if (query._id === config.main_room_id) {
              manager
                .create_room({
                  name: config.default_main_room_name,
                  id: config.main_room_id,
                })

                .then((room) => {
                  resolve(room)
                  return
                })

                .catch((err) => {
                  reject(err)
                  logger.log_error(err)
                  return
                })

              return
            } else {
              resolve(false)
              return
            }
          }

          if (room && room.version !== vars.rooms_version) {
            db.collection("rooms")
              .findOne({ _id: room._id }, {})

              .then((room) => {
                manager.room_fill_defaults(room)

                room.version = vars.rooms_version

                db.collection("rooms")
                  .updateOne({ _id: room._id }, { $set: room })

                  .then((ans) => {
                    resolve(room)
                    return
                  })

                  .catch((err) => {
                    reject(err)
                    logger.log_error(err)
                    return
                  })
              })

              .catch((err) => {
                reject(err)
                logger.log_error(err)
                return
              })
          } else {
            resolve(room)
            return
          }
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
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
      room = {}

      manager.room_fill_defaults(room)

      if (data.id !== undefined) {
        room._id = data.id
      }

      if (data.user_id !== undefined) {
        room.keys[data.user_id] = "admin"
      }

      room.name = data.name !== undefined ? data.name : "No Name"
      room.public = data.public !== undefined ? data.public : true

      room.version = vars.rooms_version

      db.collection("rooms")
        .insertOne(room)

        .then((result) => {
          resolve(room)
          return
        })

        .catch((err) => {
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
        .get_user({ _id: data.user_id }, { create_room_date: 1 })

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

                .catch((err) => {
                  reject(err)
                  logger.log_error(err)
                  return
                })

              resolve(ans)
              return
            })

            .catch((err) => {
              reject(err)
              logger.log_error(err)
              return
            })
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates a room
  manager.update_room = function (_id, fields) {
    return new Promise((resolve, reject) => {
      if (_id !== undefined) {
        if (typeof _id === "string" && _id !== config.main_room_id) {
          try {
            _id = new vars.mongo.ObjectId(_id)
          } catch (err) {
            resolve(false)
            return
          }
        }
      }

      fields.modified = Date.now()

      let check = manager.validate_room(fields)

      if (!check.passed) {
        console.error(check.message)
        resolve(false)
        return
      }

      db.collection("rooms")
        .updateOne({ _id: _id }, { $set: fields })

        .then((result) => {
          resolve(true)
          return
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Finds rooms
  manager.find_rooms = function (query) {
    return new Promise((resolve, reject) => {
      db.collection("rooms")
        .find(query)
        .toArray()

        .then((results) => {
          resolve(results)
          return
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates log messages
  manager.push_log_messages = function (_id, messages) {
    return new Promise((resolve, reject) => {
      manager
        .get_room({ _id: _id }, { log_messages: 1 })

        .then((room) => {
          room.log_messages = messages

          if (room.log_messages.length > config.max_log_messages) {
            room.log_messages = room.log_messages.slice(
              room.log_messages.length - config.max_log_messages
            )
          }

          manager
            .update_room(_id, { log_messages: room.log_messages })

            .catch((err) => {
              reject(err)
              logger.log_error(err)
              return
            })

          resolve(true)
          return
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates admin log messages
  manager.push_admin_log_messages = function (_id, messages) {
    return new Promise((resolve, reject) => {
      manager
        .get_room({ _id: _id }, { admin_log_messages: 1 })

        .then((room) => {
          room.admin_log_messages = messages

          if (room.admin_log_messages.length > config.max_admin_log_messages) {
            room.admin_log_messages = room.admin_log_messages.slice(
              room.admin_log_messages.length - config.max_admin_log_messages
            )
          }

          manager
            .update_room(_id, { admin_log_messages: room.admin_log_messages })

            .catch((err) => {
              reject(err)
              logger.log_error(err)
              return
            })

          resolve(true)
          return
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates access log messages
  manager.push_access_log_messages = function (_id, messages) {
    return new Promise((resolve, reject) => {
      manager
        .get_room({ _id: _id }, { access_log_messages: 1 })

        .then((room) => {
          room.access_log_messages = messages

          if (
            room.access_log_messages.length > config.max_access_log_messages
          ) {
            room.access_log_messages = room.access_log_messages.slice(
              room.access_log_messages.length - config.max_access_log_messages
            )
          }

          manager
            .update_room(_id, { access_log_messages: room.access_log_messages })

            .catch((err) => {
              reject(err)
              logger.log_error(err)
              return
            })

          resolve(true)
          return
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Checks fields types against the room schema types
  manager.validate_room = function (fields) {
    for (let key in fields) {
      let schema = vars.rooms_schema()
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
