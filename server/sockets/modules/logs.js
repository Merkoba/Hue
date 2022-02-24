module.exports = function (Hue) {
  // Pushes an admin log message
  Hue.handler.push_admin_log_message = function (socket, content) {
    let message = {
      type: "admin_activity",
      data: {
        username: socket.hue_username,
        content: content,
      },
      date: Date.now(),
    }

    Hue.db_manager.push_room_item(socket.hue_room_id, "admin_log_messages", message)
  }
}
