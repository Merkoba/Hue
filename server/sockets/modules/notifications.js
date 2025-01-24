module.exports = (App) => {
  // Emit a notification sent by an OP
  App.handler.public.send_notification = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.message === undefined) {
      return
    }

    if (data.message.length > App.config.max_notification_length) {
      return
    }

    App.handler.room_emit(socket, `notification`, {
      message: data.message,
      user_id: socket.hue.user_id,
      username: socket.hue.username,
    })
  }
}