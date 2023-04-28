module.exports = (Hue) => {
  // Starts a timeout to check for stale files to be removed
  // These are files that failed to be uploaded
  Hue.handler.start_files_timeout = () => {
    setTimeout(() => {
      if (Hue.vars.exiting) {
        return
      }

      Hue.handler.files_timeout_action()
    }, Hue.sconfig.files_loop_delay)
  }

  // What to do on each files timeout iteration
  Hue.handler.files_timeout_action = () => {
    try {
      for (let key in Hue.vars.files) {
        let file = Hue.vars.files[key]

        if (Date.now() - file.updated > Hue.sconfig.files_loop_max_diff) {
          delete Hue.vars.files[key]
        }
      }
    }
    catch (err) {
      Hue.logger.log_error(err)
    }

    Hue.handler.start_files_timeout()
  }

  // Update the config with current roomlist data
  Hue.handler.start_roomlist_timeout = () => {
    setTimeout(() => {
      if (Hue.vars.exiting) {
        return
      }

      Hue.handler.roomlist_timeout_action()
    }, Hue.sconfig.roomlist_loop_delay)
  }

  // What to do on each roomlist timeout iteration
  Hue.handler.roomlist_timeout_action = async () => {
    try {
      Hue.roomlist = await Hue.db_manager.get_roomlist()
    }
    catch (err) {
      Hue.logger.log_error(err)
    }

    Hue.handler.start_roomlist_timeout()
  }
}