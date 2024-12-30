module.exports = (App) => {
  // Do a socket disconnect
  App.handler.do_disconnect = (socc) => {
    socc.disconnect()
  }

  // On disconnect
  App.handler.disconnect = async (socket) => {
    if (socket.hue_user_id === undefined) {
      return
    }

    if (await App.handler.user_already_connected(socket)) {
      return
    }

    if (socket.hue_room_id !== undefined) {
      if (App.vars.rooms[socket.hue_room_id] === undefined) {
        return
      }

      delete App.vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id]

      if (App.vars.user_rooms[socket.hue_user_id] !== undefined) {
        for (let i = 0; i < App.vars.user_rooms[socket.hue_user_id].length; i++) {
          let room_id = App.vars.user_rooms[socket.hue_user_id][i]

          if (socket.hue_room_id === room_id) {
            App.vars.user_rooms[socket.hue_user_id].splice(i, 1)
            break
          }
        }

        if (App.vars.user_rooms[socket.hue_user_id].length === 0) {
          delete App.vars.user_rooms[socket.hue_user_id]
        }
      }
    }

    if (socket.hue_joined) {
      let type

      if (socket.hue_pinged) {
        type = `pinged`
      }
      else if (socket.hue_kicked) {
        type = `kicked`
      }
      else if (socket.hue_banned) {
        type = `banned`
      }
      else {
        type = `disconnection`
      }

      App.handler.room_emit(socket, `user_disconnected`, {
        user_id: socket.hue_user_id,
        username: socket.hue_username,
        info1: socket.hue_info1,
        role: socket.hue_role,
        disconnection_type: type,
      })
    }
  }

  // Disconnect other sockets from user
  App.handler.public.disconnect_others = async (socket, data) => {
    let amount = 0

    for (let room_id of App.vars.user_rooms[socket.hue_user_id]) {
      for (let socc of await App.handler.get_user_sockets_per_room(
        room_id,
        socket.hue_user_id,
      )) {
        if (socc.id !== socket.id) {
          socc.disconnect()
          amount += 1
        }
      }
    }

    App.handler.user_emit(socket, `others_disconnected`, {amount})
  }

  // Disconnect a socket
  App.handler.get_out = (socket) => {
    try {
      App.handler.do_disconnect(socket)
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }
}