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

          manager.update_room(id, { log_messages: room.log_messages })
          resolve(true)
          return
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
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

          manager.update_room(id, { admin_log_messages: room.admin_log_messages })
          resolve(true)
          return
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
        })
    })
  }
}