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
  // Pushes an admin log message
  handler.push_admin_log_message = function (socket, content) {
    let message = {
      type: "admin_activity",
      data: {
        username: socket.hue_username,
        content: content,
      },
      date: Date.now(),
    }

    db_manager.push_room_item(socket.hue_room_id, "admin_log_messages", message)
  }
}
