module.exports = (App) => {
  // Does an emit to a user
  App.handler.user_emit = (socket, type, args = {}) => {
    let obj = {}

    obj.type = type
    obj.data = args

    socket.emit(`update`, obj)
  }

  // Does an emit to a room
  App.handler.room_emit = (socket, type, args = {}) => {
    let room_id

    if (typeof socket === `object`) {
      room_id = socket.hue.room_id
    }
    else {
      room_id = socket
    }

    let obj = {}

    obj.type = type
    obj.data = args

    App.io.sockets.in(room_id).emit(`update`, obj)
  }

  // Does an emit to all the room except for the user
  App.handler.broadcast_emit = (socket, type, args = {}) => {
    let room_id

    if (typeof socket === `object`) {
      room_id = socket.hue.room_id
    }
    else {
      room_id = socket
    }

    let obj = {}

    obj.type = type
    obj.data = args

    socket.broadcast.in(room_id).emit(`update`, obj)
  }

  // Does a system wide emit
  App.handler.system_emit = (socket, type, args = {}) => {
    let obj = {}

    obj.type = type
    obj.data = args

    App.io.emit(`update`, obj)
  }

  // Sends system restart signals
  App.handler.public.system_restart_signal = (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    App.handler.system_emit(socket, `system_restart_signal`, {})
  }
}