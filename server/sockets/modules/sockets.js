module.exports = function (Hue) {
  // Checks if the user is already connected through another socket
  Hue.handler.user_already_connected = async function (socket) {
    try {
      let sockets = await Hue.handler.get_room_sockets(socket.hue_room_id)

      for (let socc of sockets) {
        if (socc.id !== socket.id && socc.hue_user_id === socket.hue_user_id) {
          return true
        }
      }

      return false
    } catch (err) {
      Hue.logger.log_error(err)
    }
  }

  // Returns the list of sockets of a user in a room, by user id
  Hue.handler.get_user_sockets_per_room = async function (room_id, user_id) {
    try {
      let clients = []
      let sockets = await Hue.handler.get_room_sockets(room_id)

      for (let socc of sockets) {
        if (socc.hue_user_id === user_id) {
          clients.push(socc)
        }
      }

      return clients
    } catch (err) {
      Hue.logger.log_error(err)
    }
  }

  // Returns the list of sockets of a user in a room, by username
  Hue.handler.get_user_sockets_per_room_by_username = async function (room_id, username) {
    try {
      let clients = []
      let sockets = await Hue.handler.get_room_sockets(room_id)

      for (let socc of sockets) {
        if (socc.hue_username.toLowerCase() === username.toLowerCase()) {
          clients.push(socc)
        }
      }

      return clients
    } catch (err) {
      Hue.logger.log_error(err)
    }
  }

  // Returns the list of sockets of a user in a room, by socket id
  Hue.handler.get_room_socket_by_id = async function (room_id, id) {
    try {
      let sockets = await Hue.handler.get_room_sockets(room_id)

      for (let socc of sockets) {
        if (socc.id === id) {
          return socc
        }
      }

      return false
    } catch (err) {
      Hue.logger.log_error(err)
    }
  }

  // Gets the list of sockets of a room
  Hue.handler.get_room_sockets = async function (room_id) {
    return await Hue.io.in(room_id).fetchSockets()
  }

  // Checks if a user exceeds the maximum amounts of sockets allowed per room
  Hue.handler.check_socket_limit = async function (socket) {
    try {
      let num = 0
      let rooms = Hue.vars.user_rooms[socket.hue_user_id]

      if (!rooms) {
        return false
      }

      for (let room_id of rooms) {
        num += await Hue.handler.get_user_sockets_per_room(room_id, socket.hue_user_id)
          .length
      }

      if (num > Hue.config.max_sockets_per_user) {
        return true
      } else {
        return false
      }
    } catch (err) {
      Hue.logger.log_error(err)
      return true
    }
  }

  // Checks if a user has multiple simultaneous join attempts
  Hue.handler.check_multipe_joins = async function (socket) {
    try {
      let sockets = await Hue.handler.get_room_sockets(socket.hue_room_id)

      for (let socc of sockets) {
        if (socc.hue_user_id !== undefined) {
          if (
            socc.id !== socket.id &&
            socc.hue_user_id === socket.hue_user_id
          ) {
            if (socc.hue_joining === true) {
              return true
            }
          }
        }
      }
    } catch (err) {
      Hue.logger.log_error(err)
      return true
    }
  }

  // Sends a pong response
  Hue.handler.public.ping_server = function (socket, data) {
    Hue.handler.user_emit(socket, "pong_received", { date: data.date })
  }

  // Changes socket properties to all sockets of a user
  Hue.handler.modify_socket_properties = async function (
    user_id,
    properties = {},
    after_room = false
  ) {
    if (!Hue.vars.user_rooms[user_id]) {
      return
    }

    for (let room_id of Hue.vars.user_rooms[user_id]) {
      let first_socc = false

      for (let socc of await Hue.handler.get_user_sockets_per_room(
        room_id,
        user_id
      )) {
        for (let key in properties) {
          socc[key] = properties[key]
        }

        if (!first_socc) {
          first_socc = socc
        }
      }

      if (first_socc) {
        Hue.handler.update_user_in_userlist(first_socc)

        if (after_room) {
          Hue.handler.room_emit(room_id, after_room.method, after_room.data)
        }
      }
    }
  }

  // Disconnect room sockets
  Hue.handler.disconnect_room_sockets = function (socket) {
    Hue.io.in(socket.hue_room_id).disconnectSockets()
  }

  // Get all socket ids
  Hue.handler.get_socket_ids = async function () {
    return await Hue.io.allSockets()
  }

  // Get socket by id
  Hue.handler.get_socket_by_id = function (id) {
    return Hue.io.sockets.sockets.get(id)
  }

  // Get all sockets
  Hue.handler.get_all_sockets = async function () {
    let sockets = []
    let ids = await Hue.handler.get_socket_ids()

    for (let id of ids) {
      sockets.push(Hue.handler.get_socket_by_id(id))
    }

    return sockets
  }
}