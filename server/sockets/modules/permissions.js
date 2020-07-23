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
  // Handles voice permission changes
  handler.public.change_voice_permission = function (socket, data) {
    if (!handler.check_op_permission(socket, "voice_permissions")) {
      return handler.get_out(socket)
    }

    if (data.what !== true && data.what !== false) {
      return handler.get_out(socket)
    }

    if (data.vtype === undefined) {
      return handler.get_out(socket)
    }

    if (data.ptype === undefined) {
      return handler.get_out(socket)
    }

    let room = vars.rooms[socket.hue_room_id]
    let p = room[`${data.vtype}_permissions`]

    if (!p) {
      return handler.get_out(socket)
    }

    p[data.ptype] = data.what

    let obj = {}

    obj[`${data.vtype}_permissions`] = p

    db_manager.update_room(socket.hue_room_id, obj)

    handler.room_emit(socket, "voice_permission_change", {
      vtype: data.vtype,
      ptype: data.ptype,
      what: data.what,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed ${data.vtype}.${data.ptype} voice permission to "${data.what}"`
    )
  }

  // Handles op permission changes
  handler.public.change_op_permission = function (socket, data) {
    if (socket.hue_role !== "admin") {
      return handler.get_out(socket)
    }

    if (data.what !== true && data.what !== false) {
      return handler.get_out(socket)
    }

    if (data.optype === undefined) {
      return handler.get_out(socket)
    }

    if (data.ptype === undefined) {
      return handler.get_out(socket)
    }

    let room = vars.rooms[socket.hue_room_id]
    let p = room[`${data.optype}_permissions`]

    if (!p) {
      return handler.get_out(socket)
    }

    p[data.ptype] = data.what

    let obj = {}

    obj[`${data.optype}_permissions`] = p

    db_manager.update_room(socket.hue_room_id, obj)

    handler.room_emit(socket, "op_permission_change", {
      optype: data.optype,
      ptype: data.ptype,
      what: data.what,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed ${data.optype}.${data.ptype} op permission to "${data.what}"`
    )
  }

  // Checks if a user has the required media permission
  handler.check_media_permission = function (socket, permission) {
    let room = vars.rooms[socket.hue_room_id]

    if (vars.media_types.includes(permission)) {
      let pmode = room[`${permission}_mode`]

      if (pmode !== "enabled") {
        return false
      }
    }

    if (handler.is_admin_or_op(socket)) {
      return true
    } else if (vars.vtypes.includes(socket.hue_role)) {
      return room[`${socket.hue_role}_permissions`][permission]
    } else {
      return false
    }
  }

  // Checks if a user is allowed to perform an op action
  handler.check_op_permission = function (socket, permission) {
    if (socket.hue_role === "admin") {
      return true
    }

    if (!socket.hue_role.startsWith("op")) {
      return false
    }

    let room = vars.rooms[socket.hue_room_id]
    return room[`${socket.hue_role}_permissions`][permission]
  }

  // Fills unset properties on the objects
  handler.check_voice_permissions = function (obj) {
    if (obj.messageboard === undefined) {
      obj.messageboard = true
    }

    return obj
  }  
}
