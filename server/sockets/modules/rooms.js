module.exports = (Hue) => {
  // Handles room creation
  Hue.handler.public.create_room = async (socket, data) => {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    if (
      data.name.length === 0 ||
      data.name.length > Hue.config.max_room_name_length
    ) {
      return
    }

    if (data.name !== Hue.utilz.single_space(data.name)) {
      return
    }

    data.user_id = socket.hue_user_id
    let ans = await Hue.db_manager.create_room(data)
    Hue.handler.user_emit(socket, `room_created`, { id: ans.id })
  }

  // Handles room deletion
  Hue.handler.public.delete_room = (socket, data) => {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    if (socket.hue_room_id === Hue.config.main_room_id) {
      return
    }

    Hue.db_manager.delete_room(socket.hue_room_id)
    let room_files = Hue.vars.path.join(Hue.vars.media_root, `room`, socket.hue_room_id)
    Hue.vars.fs.rmSync(room_files, {recursive: true, force: true})
    Hue.handler.disconnect_room_sockets(socket)
  }

  // Get rooms data to update in client
  Hue.handler.public.get_roomlist = (socket, data) => {
    Hue.handler.user_emit(socket, `receive_roomlist`, {
      roomlist: Hue.roomlist
    })
  }
}