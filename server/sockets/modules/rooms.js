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

    if (data.name !== Hue.utilz.single_space(data.name)) {
      return false
    }

    data.user_id = socket.hue_user_id
    let ans = await Hue.db_manager.create_room(data)
    Hue.handler.user_emit(socket, "room_created", { id: ans.id })
  }

  // Handles room deletion
  Hue.handler.public.delete_room = function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (socket.hue_room_id === Hue.config.main_room_id) {
      return false
    }
    
    Hue.db_manager.delete_room(socket.hue_room_id)
    let room_files = Hue.vars.path.join(Hue.vars.media_root, "room", socket.hue_room_id)
    Hue.vars.fs.rmSync(room_files, {recursive: true, force: true})
    Hue.handler.disconnect_room_sockets(socket)
  }
}