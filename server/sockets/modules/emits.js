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
  // Does an emit to a user
  handler.user_emit = function (socket, type, args = {}) {
    let obj = {};

    obj.type = type;
    obj.data = args;

    socket.emit("update", obj);
  };

  // Does an emit to a room
  handler.room_emit = function (socket, type, args = {}) {
    let room_id;

    if (typeof socket === "object") {
      room_id = socket.hue_room_id;
    } else {
      room_id = socket;
    }

    let obj = {};

    obj.type = type;
    obj.data = args;

    io.sockets.in(room_id).emit("update", obj);
  };

  // Does an emit to all the room except for the user
  handler.broadcast_emit = function (socket, type, args = {}) {
    let room_id;

    if (typeof socket === "object") {
      room_id = socket.hue_room_id;
    } else {
      room_id = socket;
    }

    let obj = {};

    obj.type = type;
    obj.data = args;

    socket.broadcast.in(room_id).emit("update", obj);
  };

  // Does a system wide emit
  handler.system_emit = function (socket, type, args = {}) {
    let obj = {};

    obj.type = type;
    obj.data = args;

    io.emit("update", obj);
  };

  // Sends an announcement to a room
  // This is used to send ads
  handler.send_announcement_to_room = function (room_id, message) {
    handler.process_message_links(message, function (response) {
      let id = handler.generate_message_id();

      handler.room_emit(room_id, "announcement", {
        id: id,
        message: message,
        link_title: response.title,
        link_description: response.description,
        link_image: response.image,
        link_url: response.url,
      });

      if (vars.rooms[room_id].log) {
        let message_ = {
          id: id,
          type: "announcement",
          date: Date.now(),
          data: {
            message: message,
            link_title: response.title,
            link_description: response.description,
            link_image: response.image,
            link_url: response.url,
          },
        };

        handler.push_log_message(room_id, message_);
      }
    });
  };

  // Sends system restart signals
  handler.public.system_restart_signal = function (socket, data) {
    if (!socket.hue_superuser) {
      return handler.get_out(socket);
    }

    handler.system_emit(socket, "system_restart_signal", {});
  };
};
