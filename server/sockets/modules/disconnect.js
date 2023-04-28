module.exports = (Hue) => {
  // Do a socket disconnect
  Hue.handler.do_disconnect = (socc) => {
    socc.disconnect()
  }

  // On disconnect
  Hue.handler.disconnect = async (socket) => {
    if (socket.hue_user_id === undefined) {
      return
    }

    if (await Hue.handler.user_already_connected(socket)) {
      return
    }

    if (socket.hue_room_id !== undefined) {
      if (Hue.vars.rooms[socket.hue_room_id] === undefined) {
        return
      }

      delete Hue.vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id]

      if (Hue.vars.user_rooms[socket.hue_user_id] !== undefined) {
        for (let i = 0; i < Hue.vars.user_rooms[socket.hue_user_id].length; i++) {
          let room_id = Hue.vars.user_rooms[socket.hue_user_id][i]

          if (socket.hue_room_id === room_id) {
            Hue.vars.user_rooms[socket.hue_user_id].splice(i, 1)
            break
          }
        }

        if (Hue.vars.user_rooms[socket.hue_user_id].length === 0) {
          delete Hue.vars.user_rooms[socket.hue_user_id]
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

      Hue.handler.room_emit(socket, `user_disconnected`, {
        user_id: socket.hue_user_id,
        username: socket.hue_username,
        info1: socket.hue_info1,
        role: socket.hue_role,
        disconnection_type: type,
      })
    }
  }

  // Disconnect other sockets from user
  Hue.handler.public.disconnect_others = async (socket, data) => {
    let amount = 0

    for (let room_id of Hue.vars.user_rooms[socket.hue_user_id]) {
      for (let socc of await Hue.handler.get_user_sockets_per_room(
        room_id,
        socket.hue_user_id
      )) {
        if (socc.id !== socket.id) {
          socc.disconnect()
          amount += 1
        }
      }
    }

    Hue.handler.user_emit(socket, `others_disconnected`, { amount: amount })
  }

  // Disconnect a socket
  Hue.handler.get_out = (socket) => {
    try {
      Hue.handler.do_disconnect(socket)
    }
    catch (err) {
      Hue.logger.log_error(err)
    }
  }
}