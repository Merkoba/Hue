module.exports = function (Hue) {
  // Handles room creation
  Hue.handler.public.create_room = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (
      data.name.length === 0 ||
      data.name.length > Hue.config.max_room_name_length
    ) {
      return false
    }

    if (data.name !== Hue.utilz.clean_string2(data.name)) {
      return false
    }

    data.user_id = socket.hue_user_id
    let ans = await Hue.db_manager.create_room(data)
    Hue.handler.user_emit(socket, "room_created", { id: ans.id })
  }
}
