module.exports = function (Hue) {
  // Pushes an admin log message
  Hue.handler.push_admin_log_message = function (socket, content) {
    let message = {
      date: Date.now(),
      username: socket.hue_username,
      content: content,
    }

    Hue.db_manager.push_room_item(socket.hue_room_id, "admin_log_messages", message)
  }
}