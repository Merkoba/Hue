module.exports = (Hue) => {
  // Pushes an admin log message
  Hue.handler.push_admin_log_message = (socket, content) => {
    let message = {
      date: Date.now(),
      username: socket.hue_username,
      content: content,
    }

    Hue.db_manager.push_item(`rooms`, socket.hue_room_id, `admin_log_messages`, message)
  }
}