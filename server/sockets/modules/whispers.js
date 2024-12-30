module.exports = (App) => {
  // Handles whispers
  App.handler.public.whisper = async (socket, data) => {
    if (data.type === `system_broadcast`) {
      if (!socket.hue_superuser) {
        App.handler.anti_spam_ban(socket)
        return
      }
    }

    if (data.type === `user`) {
      if (!data.usernames || data.usernames.length === 0) {
        return
      }

      if (data.usernames.length > App.config.max_whisper_users) {
        return
      }

      for (let username of data.usernames) {
        if (
          !username.length ||
          username.length > App.config.max_max_username_length
        ) {
          return
        }
      }
    }

    if (data.message === undefined) {
      return
    }

    if (data.message.length === 0) {
      return
    }

    if (data.message.length > App.config.max_whispers_post_length) {
      return
    }

    if (data.message.split(`\n`).length > App.config.max_num_newlines) {
      return
    }

    let users = []
    let usernames = [...new Set(data.usernames)]

    if (data.type === `user`) {
      for (let username of usernames) {
        let sockets = await App.handler.get_user_sockets_per_room_by_username(
          socket.hue_room_id,
          username,
        )

        if (sockets.length > 0) {
          users.push({
            user_id: sockets[0].hue_user_id,
            username: sockets[0].hue_username,
          })

          for (let socc of sockets) {
            App.handler.user_emit(socc, `whisper`, {
              room: socket.hue_room_id,
              user_id: socket.hue_user_id,
              username: socket.hue_username,
              message: data.message,
              type: data.type,
            })
          }
        }
        else {
          App.handler.user_emit(socket, `user_not_in_room`, {})
        }
      }

      data.users = users
      App.handler.user_emit(socket, `whisper_sent`, data)
    }
    else if (data.type === `system_broadcast`) {
      App.handler.system_emit(socket, `system_broadcast`, {
        username: App.sconfig.system_username,
        message: data.message,
        type: data.type,
      })
    }
  }
}