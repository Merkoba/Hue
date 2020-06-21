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
  // Handles whispers
  handler.public.whisper = function (socket, data) {
    if (!vars.whisper_types.includes(data.type)) {
      return handler.get_out(socket);
    }

    if (data.type === "user") {
      if (!handler.check_media_permission(socket, "chat")) {
        return false;
      }
    } else if (data.type === "ops") {
      if (!handler.check_op_permission(socket, "whisper_ops")) {
        return handler.get_out(socket);
      }
    } else if (data.type === "broadcast") {
      if (!handler.check_op_permission(socket, "broadcast")) {
        return handler.get_out(socket);
      }
    }

    if (data.type === "user") {
      if (!data.usernames || data.usernames.length === 0) {
        return handler.get_out(socket);
      }

      if (data.usernames.length > config.max_whisper_users) {
        return handler.get_out(socket);
      }

      for (let username of data.usernames) {
        if (
          !username.length ||
          username.length > config.max_max_username_length
        ) {
          return handler.get_out(socket);
        }
      }
    }

    if (data.message === undefined) {
      return handler.get_out(socket);
    }

    if (data.message.length === 0) {
      if (!data.draw_coords) {
        return handler.get_out(socket);
      }
    }

    if (data.message.length > config.max_input_length) {
      return handler.get_out(socket);
    }

    if (data.message !== utilz.clean_string10(data.message)) {
      return handler.get_out(socket);
    }

    if (data.message.split("\n").length > config.max_num_newlines) {
      return handler.get_out(socket);
    }

    if (data.draw_coords === undefined) {
      return handler.get_out(socket);
    }

    if (
      JSON.stringify(data.draw_coords).length > config.draw_coords_max_length
    ) {
      return handler.get_out(socket);
    }

    if (data.type === "user") {
      for (let username of data.usernames) {
        let sockets = handler.get_user_sockets_per_room_by_username(
          socket.hue_room_id,
          username
        );

        if (sockets.length > 0) {
          for (let socc of sockets) {
            if (socc.id === socket.id) {
              continue;
            }

            handler.user_emit(socc, "whisper", {
              room: socket.hue_room_id,
              username: socket.hue_username,
              message: data.message,
              draw_coords: data.draw_coords,
            });
          }
        } else {
          handler.user_emit(socket, "user_not_in_room", {});
        }
      }
    } else if (data.type === "ops") {
      let sockets = handler.get_room_sockets(socket.hue_room_id);

      for (let socc of sockets) {
        if (handler.is_admin_or_op(socc)) {
          handler.user_emit(socc, "whisper_ops", {
            room: socket.hue_room_id,
            username: socket.hue_username,
            message: data.message,
            draw_coords: data.draw_coords,
          });
        }
      }
    } else if (data.type === "broadcast") {
      handler.room_emit(socket, "room_broadcast", {
        message: data.message,
        username: socket.hue_username,
        draw_coords: data.draw_coords,
      });
    } else if (data.type === "system_broadcast") {
      handler.system_emit(socket, "system_broadcast", {
        message: data.message,
        draw_coords: data.draw_coords,
      });
    }
  };
};
