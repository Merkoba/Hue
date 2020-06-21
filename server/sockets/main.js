module.exports = function (
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger,
  sockets_api
) {
  // Main handler object
  const handler = {};
  handler.public = {};

  // Object that holds all shared variables
  const vars = {};

  // Fill the vars object
  require("./vars")(vars, handler, ...arguments);

  // Get the module file names and arguments
  const modules = vars.fs.readdirSync(vars.path.join(__dirname, "modules"));

  // Fill the handler object
  for (let module of modules) {
    require(`./modules/${module}`)(handler, vars, ...arguments);
  }

  // Start socker handler
  io.on("connection", async function (socket) {
    if (vars.exiting) {
      return false;
    }

    try {
      let spam_ans = await handler.add_spam(socket);

      if (!spam_ans) {
        return false;
      }

      handler.connection(socket);
    } catch (err) {
      logger.log_error(err);
    }

    // Goes to a public function
    // If there is no such public function the user is kicked out
    socket.on("server_method", async function (data) {
      if (vars.exiting) {
        return false;
      }

      try {
        if (!handler.check_data(data)) {
          return handler.get_out(socket);
        }

        let m = data.server_method_name;

        if (handler.public[m] === undefined) {
          return handler.get_out(socket);
        }

        if (m === undefined) {
          return handler.get_out(socket);
        }

        if (!data || typeof data !== "object") {
          return handler.get_out(socket);
        }

        if (!vars.dont_check_joined.includes(m)) {
          if (!socket.hue_joined) {
            return handler.get_out(socket);
          }
        } else {
          if (vars.check_locked.includes(m)) {
            if (!socket.hue_joined) {
              if (!socket.hue_locked) {
                return handler.get_out(socket);
              }
            }
          }
        }

        if (!vars.dont_add_spam.includes(m)) {
          let spam_ans = await handler.add_spam(socket);

          if (!spam_ans) {
            return false;
          }
        }

        handler.public[m](socket, data);
      } catch (err) {
        logger.log_error(err);
      }
    });

    // Socket disconnect handler
    socket.on("disconnect", function (reason) {
      try {
        if (!reason) {
          reason = "unknown";
        }

        reason = reason.toLowerCase();

        if (reason.includes("timeout")) {
          socket.hue_pinged = true;
        }

        handler.disconnect(socket);
      } catch (err) {
        logger.log_error(err);
      }
    });
  });

  handler.start_room_loop();
  handler.start_files_loop();

  sockets_api.handler = handler;
  sockets_api.vars = vars;
};
