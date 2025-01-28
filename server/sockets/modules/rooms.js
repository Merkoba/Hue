module.exports = (App) => {
  // Handles room creation
  App.handler.public.create_room = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (
      (data.name.length === 0) ||
      (data.name.length > App.config.max_room_name_length)
    ) {
      return
    }

    if (data.name !== App.utilz.single_space(data.name)) {
      return
    }

    data.user_id = socket.hue.user_id
    let ans = await App.db_manager.create_room(data)
    App.handler.user_emit(socket, `room_created`, {id: ans.id})
  }

  // Get rooms data to update in client
  App.handler.public.get_roomlist = (socket, data) => {
    App.handler.user_emit(socket, `receive_roomlist`, {
      roomlist: App.roomlist,
    })
  }
}