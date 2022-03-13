module.exports = function (Hue) {
  // Main handler object
  Hue.handler = {}
  Hue.handler.public = {}

  // Object that holds all shared variables
  Hue.vars = {}

  // Fill the vars object
  require("./vars")(Hue)

  // Get the module file names and arguments
  const modules = Hue.vars.fs.readdirSync(Hue.vars.path.join(__dirname, "modules"))

  // Fill the handler object
  for (let module of modules) {
    if (!module.endsWith(".js")) {
      continue
    }

    require(`./modules/${module}`)(Hue)
  }

  // Start the anti-spam system
  Hue.vars.anti_spam = Hue.handler.start_anti_spam()  

  // Start socker handler
  Hue.io.on("connection", async function (socket) {
    if (!socket) {
      return false
    }
    
    if (Hue.vars.exiting) {
      return false
    }

    try {
      socket.hue_ip_address = Hue.handler.get_ip_address(socket)
      let spam_ans = await Hue.handler.add_spam(socket)

      if (!spam_ans) {
        return false
      }

      Hue.handler.connection(socket)

      if (Hue.handler.user_is_banned(socket)) {
        return Hue.handler.get_out(socket)
      }
    } catch (err) {
      Hue.logger.log_error(err)
    }

    // Goes to a public function
    // If there is no such public function the user is kicked out
    socket.on("server_method", async function (data) {
      if (Hue.vars.exiting) {
        return false
      }

      try {
        let m = data.server_method_name

        if (!Hue.vars.dont_add_spam.includes(m)) {
          let spam_ans = await Hue.handler.add_spam(socket)

          if (!spam_ans) {
            return false
          }
        }

        if (!Hue.handler.check_data(data)) {
          return false
        }

        if (Hue.handler.public[m] === undefined) {
          return false
        }

        if (m === undefined) {
          return false
        }

        if (!data || typeof data !== "object") {
          return false
        }

        if (!Hue.vars.dont_check_joined.includes(m)) {
          if (!socket.hue_joined) {
            return false
          }
        }

        await Hue.handler.public[m](socket, data)
      } catch (err) {
        Hue.logger.log_error(err)
      }
    })

    // Socket disconnect handler
    socket.on("disconnect", async function (reason) {
      try {
        if (!reason) {
          reason = "unknown"
        }

        reason = reason.toLowerCase()

        if (reason.includes("timeout")) {
          socket.hue_pinged = true
        }

        await Hue.handler.disconnect(socket)
      } catch (err) {
        Hue.logger.log_error(err)
      }
    })
  })

  Hue.handler.start_files_timeout()
  Hue.handler.roomlist_timeout_action()
}
