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
  // Starts a timeout to check for stale files to be removed
  // These are files that failed to be uploaded
  handler.start_files_timeout = function () {
    setTimeout(function () {
      if (vars.exiting) {
        return false
      }

      handler.files_timeout_action()
    }, sconfig.files_loop_interval)
  }

  // What to do on each room timeout iteration
  handler.files_timeout_action = function () {
    try {
      for (let key in vars.files) {
        let file = vars.files[key]

        if (Date.now() - file.updated > sconfig.files_loop_max_diff) {
          delete vars.files[key]
        }
      }
    } catch (err) {
      logger.log_error(err)
    }

    handler.start_files_timeout()
  }
}