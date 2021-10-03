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
  // Handles room creation
  handler.public.create_room = async function (socket, data) {
    if (
      data.name.length === 0 ||
      data.name.length > config.max_room_name_length
    ) {
      return false
    }

    if (data.name !== utilz.clean_string2(data.name)) {
      return false
    }

    data.user_id = socket.hue_user_id

    let force = false

    if (socket.hue_superuser) {
      force = true
    }

    let ans = await db_manager.user_create_room(data, force)

    if (ans === "wait") {
      handler.user_emit(socket, "create_room_wait", {})
      return
    }

    handler.user_emit(socket, "room_created", { id: ans.id })
  }
}
