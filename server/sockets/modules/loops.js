module.exports = (App) => {
  // Starts a timeout to check for stale files to be removed
  // These are files that failed to be uploaded
  App.handler.start_files_timeout = () => {
    setTimeout(() => {
      if (App.vars.exiting) {
        return
      }

      App.handler.files_timeout_action()
    }, App.sconfig.files_loop_delay)
  }

  // What to do on each files timeout iteration
  App.handler.files_timeout_action = () => {
    try {
      for (let key in App.vars.files) {
        let file = App.vars.files[key]

        if (Date.now() - file.updated > App.sconfig.files_loop_max_diff) {
          delete App.vars.files[key]
        }
      }
    }
    catch (err) {
      App.logger.log_error(err)
    }

    App.handler.start_files_timeout()
  }

  // Update the config with current roomlist data
  App.handler.start_roomlist_timeout = () => {
    setTimeout(() => {
      if (App.vars.exiting) {
        return
      }

      App.handler.roomlist_timeout_action()
    }, App.sconfig.roomlist_loop_delay)
  }

  // What to do on each roomlist timeout iteration
  App.handler.roomlist_timeout_action = async () => {
    try {
      App.roomlist = await App.db_manager.get_roomlist()
    }
    catch (err) {
      App.logger.log_error(err)
    }

    App.handler.start_roomlist_timeout()
  }
}