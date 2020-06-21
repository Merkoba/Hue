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
  // Pushes a log message
  handler.push_log_message = function (socket, message) {
    let room_id;

    if (typeof socket === "object") {
      room_id = socket.hue_room_id;
    } else {
      room_id = socket;
    }

    let room = vars.rooms[room_id];

    room.log_messages.push(message);

    if (room.log_messages.length > config.max_log_messages) {
      room.log_messages = room.log_messages.slice(
        room.log_messages.length - config.max_log_messages
      );
    }

    room.log_messages_modified = true;
    room.activity = true;
  };

  // Pushes an admin log message
  handler.push_admin_log_message = function (socket, content) {
    let message = {
      type: "admin_activity",
      data: {
        username: socket.hue_username,
        content: content,
      },
      date: Date.now(),
    };

    let room = vars.rooms[socket.hue_room_id];

    room.admin_log_messages.push(message);

    if (room.admin_log_messages.length > config.max_admin_log_messages) {
      room.admin_log_messages = room.admin_log_messages.slice(
        room.admin_log_messages.length - config.max_admin_log_messages
      );
    }

    room.admin_log_messages_modified = true;
    room.activity = true;
  };

  // Pushes an access log message
  handler.push_access_log_message = function (socket, action) {
    let message = {
      type: "access_activity",
      data: {
        username: socket.hue_username,
        content: action,
      },
      date: Date.now(),
    };

    let room = vars.rooms[socket.hue_room_id];

    room.access_log_messages.push(message);

    if (room.access_log_messages.length > config.max_access_log_messages) {
      room.access_log_messages = room.access_log_messages.slice(
        room.access_log_messages.length - config.max_access_log_messages
      );
    }

    room.access_log_messages_modified = true;
    room.activity = true;
  };
};
