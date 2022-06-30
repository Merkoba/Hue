module.exports = function (Hue) {
  // Does an emit to a user
  Hue.handler.user_emit = function (socket, type, args = {}) {
    let obj = {}

    obj.type = type
    obj.data = args

    socket.emit("update", obj)
  }

  // Does an emit to a room
  Hue.handler.room_emit = function (socket, type, args = {}) {
    let room_id

    if (typeof socket === "object") {
      room_id = socket.hue_room_id
    } else {
      room_id = socket
    }

    let obj = {}

    obj.type = type
    obj.data = args

    Hue.io.sockets.in(room_id).emit("update", obj)
  }

  // Does an emit to all the room except for the user
  Hue.handler.broadcast_emit = function (socket, type, args = {}) {
    let room_id

    if (typeof socket === "object") {
      room_id = socket.hue_room_id
    } else {
      room_id = socket
    }

    let obj = {}

    obj.type = type
    obj.data = args

    socket.broadcast.in(room_id).emit("update", obj)
  }

  // Does a system wide emit
  Hue.handler.system_emit = function (socket, type, args = {}) {
    let obj = {}

    obj.type = type
    obj.data = args

    Hue.io.emit("update", obj)
  }

  // Sends system restart signals
  Hue.handler.public.system_restart_signal = function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    Hue.handler.system_emit(socket, "system_restart_signal", {})
  }
}