module.exports = (App) => {
  // Main handler object
  App.handler = {}
  App.handler.public = {}

  // Fill the imports
  require(`./imports`)(App)

  // Fill the vars
  require(`./vars`)(App)

  // Get the module file names and arguments
  const modules = App.i.fs.readdirSync(App.i.path.join(__dirname, `modules`))

  // Fill the handler object
  for (let module of modules) {
    if (!module.endsWith(`.js`)) {
      continue
    }

    require(`./modules/${module}`)(App)
  }

  // Start the anti-spam system
  App.vars.anti_spam = App.handler.start_anti_spam()

  // Start socker handler
  App.io.on(`connection`, (socket) => {
    if (!socket) {
      return
    }

    if (App.vars.exiting) {
      return
    }

    try {
      socket.hue_ip_address = App.handler.get_ip_address(socket)
      let spam_ans = App.handler.add_spam(socket)

      if (!spam_ans) {
        return
      }

      App.handler.connection(socket)

      if (App.handler.user_is_banned(socket)) {
        return App.handler.get_out(socket)
      }
    }
    catch (err) {
      App.logger.log_error(err)
    }

    // Goes to a public function
    // If there is no such public function the user is kicked out
    socket.on(`server_method`, async (data) => {
      if (App.vars.exiting) {
        return
      }

      try {
        let m = data.server_method_name

        if (!App.vars.dont_add_spam.includes(m)) {
          let spam_ans = App.handler.add_spam(socket)

          if (!spam_ans) {
            return
          }
        }

        if (!App.handler.check_data(data)) {
          return
        }

        if (App.handler.public[m] === undefined) {
          return
        }

        if (m === undefined) {
          return
        }

        if (!data || typeof data !== `object`) {
          return
        }

        if (!App.vars.dont_check_joined.includes(m)) {
          if (!socket.hue_joined) {
            return
          }
        }

        await App.handler.public[m](socket, data)
      }
      catch (err) {
        App.logger.log_error(err)
      }
    })

    // Socket disconnect handler
    socket.on(`disconnect`, async (reason) => {
      try {
        if (!reason) {
          reason = `unknown`
        }

        reason = reason.toLowerCase()

        if (reason.includes(`timeout`)) {
          socket.hue_pinged = true
        }

        await App.handler.disconnect(socket)
      }
      catch (err) {
        App.logger.log_error(err)
      }
    })
  })

  App.handler.start_files_timeout()
  App.handler.roomlist_timeout_action()
}