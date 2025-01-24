module.exports = (App) => {
  // Checks if the user is already connected through another socket
  App.handler.user_already_connected = async (socket) => {
    try {
      let sockets = await App.handler.get_room_sockets(socket.hue.room_id)

      for (let socc of sockets) {
        if ((socc.id !== socket.id) && (socc.hue.user_id === socket.hue.user_id)) {
          return true
        }
      }

      return false
    }
    catch (err) {
      App.logger.log_error(err)
      return true
    }
  }

  // Returns the list of sockets of a user in a room, by user id
  App.handler.get_user_sockets_per_room = async (room_id, user_id) => {
    try {
      let clients = []
      let sockets = await App.handler.get_room_sockets(room_id)

      for (let socc of sockets) {
        if (socc.hue.user_id === user_id) {
          clients.push(socc)
        }
      }

      return clients
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }

  // Returns the list of sockets of a user in a room, by username
  App.handler.get_user_sockets_per_room_by_username = async (room_id, username) => {
    try {
      let clients = []
      let sockets = await App.handler.get_room_sockets(room_id)

      for (let socc of sockets) {
        if (socc.hue.username.toLowerCase() === username.toLowerCase()) {
          clients.push(socc)
        }
      }

      return clients
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }

  // Returns the list of sockets of a user in a room, by socket id
  App.handler.get_room_socket_by_id = async (room_id, id) => {
    try {
      let sockets = await App.handler.get_room_sockets(room_id)

      for (let socc of sockets) {
        if (socc.id === id) {
          return socc
        }
      }
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }

  // Gets the list of sockets of a room
  App.handler.get_room_sockets = async (room_id) => {
    return await App.io.in(room_id).fetchSockets()
  }

  // Checks if a user exceeds the maximum amounts of sockets allowed per room
  App.handler.check_socket_limit = async (socket) => {
    try {
      let num = 0
      let rooms = App.vars.user_rooms[socket.hue.user_id]

      if (!rooms) {
        return false
      }

      for (let room_id of rooms) {
        num += await App.handler.get_user_sockets_per_room(room_id, socket.hue.user_id)
          .length
      }

      if (num > App.sconfig.max_sockets_per_user) {
        return true
      }

      return false
    }
    catch (err) {
      App.logger.log_error(err)
      return true
    }
  }

  // Checks if a user has multiple simultaneous join attempts
  App.handler.check_multipe_joins = async (socket) => {
    try {
      let sockets = await App.handler.get_room_sockets(socket.hue.room_id)

      for (let socc of sockets) {
        if (socc.hue.user_id !== undefined) {
          if (
            (socc.id !== socket.id) &&
            (socc.hue.user_id === socket.hue.user_id)
          ) {
            if (socc.hue.joining === true) {
              return true
            }
          }
        }
      }

      return false
    }
    catch (err) {
      App.logger.log_error(err)
      return true
    }
  }

  // Sends a pong response
  App.handler.public.ping_server = (socket, data) => {
    App.handler.user_emit(socket, `pong_received`, {date: data.date})
  }

  // Changes socket properties to all sockets of a user
  App.handler.modify_socket_properties = async function(
    user_id,
    properties = {},
    after_room = false,
  ) {
    if (!App.vars.user_rooms[user_id]) {
      return
    }

    for (let room_id of App.vars.user_rooms[user_id]) {
      let first_socc = false

      for (let socc of await App.handler.get_user_sockets_per_room(
        room_id,
        user_id,
      )) {
        for (let key in properties) {
          socc.hue[key] = properties[key]
        }

        if (!first_socc) {
          first_socc = socc
        }
      }

      if (first_socc) {
        App.handler.update_user_in_userlist(first_socc)

        if (after_room) {
          App.handler.room_emit(room_id, after_room.method, after_room.data)
        }
      }
    }
  }

  // Disconnect room sockets
  App.handler.disconnect_room_sockets = (socket) => {
    App.io.in(socket.hue.room_id).disconnectSockets()
  }

  // Get all socket ids
  App.handler.get_socket_ids = async () => {
    return await App.io.allSockets()
  }

  // Get socket by id
  App.handler.get_socket_by_id = (id) => {
    return App.io.sockets.sockets.get(id)
  }

  // Get all sockets
  App.handler.get_all_sockets = async () => {
    let sockets = []
    let ids = await App.handler.get_socket_ids()

    for (let id of ids) {
      sockets.push(App.handler.get_socket_by_id(id))
    }

    return sockets
  }
}