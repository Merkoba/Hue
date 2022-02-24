module.exports = function (Hue) {
  // Handles whispers
  Hue.handler.public.whisper = async function (socket, data) {
    if (data.type === "system_broadcast") {
      if (!socket.hue_superuser) {
        Hue.handler.anti_spam_ban(socket)
        return false
      }
    }

    if (data.type === "user") {
      if (!data.usernames || data.usernames.length === 0) {
        return false
      }
  
      if (data.usernames.length > Hue.config.max_whisper_users) {
        return false
      }
  
      for (let username of data.usernames) {
        if (
          !username.length ||
          username.length > Hue.config.max_max_username_length
        ) {
          return false
        }
      }
    }

    if (data.message === undefined) {
      return false
    }

    if (data.message.length === 0) {
      return false
    }

    if (data.message.length > Hue.config.max_whispers_post_length) {
      return false
    }

    if (data.message.split("\n").length > Hue.config.max_num_newlines) {
      return false
    }

    if (data.type === "user") {
      for (let username of data.usernames) {
        let sockets = await Hue.handler.get_user_sockets_per_room_by_username(
          socket.hue_room_id,
          username
        )
  
        if (sockets.length > 0) {
          for (let socc of sockets) {
            if (socc.id === socket.id) {
              continue
            }
  
            Hue.handler.user_emit(socc, "whisper", {
              room: socket.hue_room_id,
              user_id: socket.hue_user_id,
              username: socket.hue_username,
              message: data.message,
              type: data.type
            })
          }
        } else {
          Hue.handler.user_emit(socket, "user_not_in_room", {})
        }
      }
    } else if (data.type === "system_broadcast") {
      Hue.handler.system_emit(socket, "system_broadcast", {
        username: Hue.sconfig.system_username,
        message: data.message,
        type: data.type
      })
    }
  }
}
