module.exports = function (Hue) {
  // Starts a timeout to check for stale files to be removed
  // These are files that failed to be uploaded
  Hue.handler.start_files_timeout = function () {
    setTimeout(function () {
      if (Hue.vars.exiting) {
        return false
      }

      Hue.handler.files_timeout_action()
    }, Hue.sconfig.files_loop_interval)
  }

  // What to do on each room timeout iteration
  Hue.handler.files_timeout_action = function () {
    try {
      for (let key in Hue.vars.files) {
        let file = Hue.vars.files[key]

        if (Date.now() - file.updated > Hue.sconfig.files_loop_max_diff) {
          delete Hue.vars.files[key]
        }
      }
    } catch (err) {
      Hue.logger.log_error(err)
    }

    Hue.handler.start_files_timeout()
  }
}