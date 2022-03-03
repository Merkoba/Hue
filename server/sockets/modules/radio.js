module.exports = function (Hue) {
  // Announces other users of a radio station being played
  Hue.handler.public.announce_radio = async function (socket, data) {
    if (data.name === undefined) {
      return false
    }

    if (!Hue.config.radios.some(x => x.name === data.name)) {
      return false
    }

    Hue.handler.broadcast_emit(socket, "announce_radio", {
      user_id: socket.hue_user_id,
      username: socket.hue_username,
      name: data.name
    })
  }
}