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
  // Do a socket disconnect
  handler.do_disconnect = function (socc) {
    socc.disconnect()
    return false
  }

  // On disconnect
  handler.disconnect = async function (socket) {
    if (socket.hue_user_id === undefined) {
      return
    }

    if (await handler.user_already_connected(socket)) {
      return
    }

    if (socket.hue_room_id !== undefined) {
      if (vars.rooms[socket.hue_room_id] === undefined) {
        return
      }

      delete vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id]

      if (vars.user_rooms[socket.hue_user_id] !== undefined) {
        for (let i = 0; i < vars.user_rooms[socket.hue_user_id].length; i++) {
          let room_id = vars.user_rooms[socket.hue_user_id][i]

          if (socket.hue_room_id === room_id) {
            vars.user_rooms[socket.hue_user_id].splice(i, 1)
            break
          }
        }

        if (vars.user_rooms[socket.hue_user_id].length === 0) {
          delete vars.user_rooms[socket.hue_user_id]
        }
      }
    }

    if (socket.hue_joined) {
      let type

      if (socket.hue_pinged) {
        type = "pinged"
      } else if (socket.hue_kicked) {
        type = "kicked"
      } else if (socket.hue_banned) {
        type = "banned"
      } else {
        type = "disconnection"
      }

      handler.room_emit(socket, "user_disconnected", {
        user_id: socket.hue_user_id,
        username: socket.hue_username,
        info1: socket.hue_info1,
        role: socket.hue_role,
        disconnection_type: type,
      })
    }
  }

  // Disconnect other sockets from user
  handler.public.disconnect_others = async function (socket, data) {
    let amount = 0

    for (let room_id of vars.user_rooms[socket.hue_user_id]) {
      for (let socc of await handler.get_user_sockets_per_room(
        room_id,
        socket.hue_user_id
      )) {
        if (socc.id !== socket.id) {
          socc.disconnect()
          amount += 1
        }
      }
    }

    handler.user_emit(socket, "others_disconnected", { amount: amount })
  }

  // Tries to redirect the user elsewhere and disconnects the socket
  handler.get_out = function (socket) {
    try {
      handler.do_disconnect(socket)
      return false
    } catch (err) {
      logger.log_error(err)
    }
  }
}
