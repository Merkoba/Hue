module.exports = (App) => {
  // Handles room creation
  App.handler.public.create_room = async (socket, data) => {
    if (!socket.hue_superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (
      data.name.length === 0 ||
      data.name.length > App.config.max_room_name_length
    ) {
      return
    }

    if (data.name !== App.utilz.single_space(data.name)) {
      return
    }

    data.user_id = socket.hue_user_id
    let ans = await App.db_manager.create_room(data)
    App.handler.user_emit(socket, `room_created`, { id: ans.id })
  }

  // Handles room deletion
  App.handler.public.delete_room = (socket, data) => {
    if (!socket.hue_superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (socket.hue_room_id === App.config.main_room_id) {
      return
    }

    App.db_manager.delete_room(socket.hue_room_id)
    let room_files = App.vars.path.join(App.vars.media_root, `room`, socket.hue_room_id)
    App.vars.fs.rmSync(room_files, {recursive: true, force: true})
    App.handler.disconnect_room_sockets(socket)
  }

  // Get rooms data to update in client
  App.handler.public.get_roomlist = (socket, data) => {
    App.handler.user_emit(socket, `receive_roomlist`, {
      roomlist: App.roomlist
    })
  }
}