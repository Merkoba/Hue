module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Starts a timeout to update data to the database
  // It will only update data that has changed
  handler.start_rooms_timeout = function () {
    setTimeout(function () {
      if (vars.exiting) {
        return false
      }

      handler.rooms_timeout_action()
    }, config.rooms_loop_interval)
  }

  // What to do on each room timeout iteration
  handler.rooms_timeout_action = function () {
    try {
      for (let key in vars.rooms) {
        let room = vars.rooms[key]

        if (room.activity) {
          if (room.log_messages_modified) {
            db_manager.push_log_messages(room._id, room.log_messages)
            room.log_messages_modified = false
          }

          if (room.admin_log_messages_modified) {
            db_manager.push_admin_log_messages(
              room._id,
              room.admin_log_messages
            )
            room.admin_log_messages_modified = false
          }

          if (room.access_log_messages_modified) {
            db_manager.push_access_log_messages(
              room._id,
              room.access_log_messages
            )
            room.access_log_messages_modified = false
          }

          room.activity = false
        }

        if (Object.keys(room.userlist).length === 0) {
          delete vars.rooms[key]
        }
      }
    } catch (err) {
      logger.log_error(err)
    }

    handler.start_rooms_timeout()
  }

  // Starts a timeout to check for stale files to be removed
  // These are files that failed to be uploaded
  handler.start_files_timeout = function () {
    setTimeout(function () {
      if (vars.exiting) {
        return false
      }

      handler.files_timeout_action()
    }, config.files_loop_interval)
  }

  // What to do on each room timeout iteration
  handler.files_timeout_action = function () {
    try {
      for (let key in vars.files) {
        let file = vars.files[key]

        if (Date.now() - file.updated > config.files_loop_max_diff) {
          delete vars.files[key]
        }
      }
    } catch (err) {
      logger.log_error(err)
    }

    handler.start_files_timeout()
  }
}
