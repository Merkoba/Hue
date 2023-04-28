module.exports = (App) => {
  // Sets initial hue_* variables on connection
  App.handler.connection = (socket) => {
    socket.hue_pinged = false
    socket.hue_kicked = false
    socket.hue_banned = false
    socket.hue_joining = false
    socket.hue_joined = false
    socket.hue_superuser = false
    socket.hue_locked = false
    socket.hue_info1 = ``
  }

  // Attempts to join a room
  App.handler.public.join_room = async (socket, data) => {
    if (socket.hue_joining || socket.hue_joined) {
      return
    }

    if (data.room_id === undefined) {
      return App.handler.get_out(socket)
    }

    if (data.room_id.length > App.sconfig.max_room_id_length) {
      return App.handler.get_out(socket)
    }

    if (data.alternative) {
      socket.hue_login_method = `alternative`

      if (!data.username || !data.password) {
        return App.handler.get_out(socket)
      }

      data.username = data.username.trim()
      data.password = data.password.trim()

      if (data.username === undefined || data.password === undefined) {
        return App.handler.get_out(socket)
      }

      if (data.username > App.config.max_max_username_length) {
        return App.handler.get_out(socket)
      }

      if (data.password.length > App.config.max_max_password_length) {
        return App.handler.get_out(socket)
      }
    }
    else {
      socket.hue_login_method = `normal`
      data.user_id = data.user_id.trim()

      if (data.user_id === undefined || data.token === undefined) {
        return App.handler.get_out(socket)
      }

      if (data.user_id > App.sconfig.max_user_id_length) {
        return App.handler.get_out(socket)
      }

      if (data.token.length > App.sconfig.max_jwt_token_length) {
        return App.handler.get_out(socket)
      }
    }

    if (data.alternative) {
      let ans = await App.db_manager.check_password(
        data.username,
        data.password
      )

      if (!ans.valid) {
        App.handler.anti_spam_ban(socket, 2)
        return App.handler.get_out(socket)
      }

      let userinfo = ans.user

      socket.hue_user_id = userinfo.id

      let info = await App.db_manager.get_room([`id`, data.room_id])

      if (!info) {
        return App.handler.get_out(socket)
      }

      await App.handler.do_join(socket, info, userinfo, data)
    }
    else {
      App.vars.jwt.verify(data.token, App.sconfig.jwt_secret, async function (
        err,
        decoded
      ) {
        if (err) {
          return App.handler.get_out(socket)
        }
        else if (
          decoded.data === undefined ||
          decoded.data.id === undefined
        ) {
          return App.handler.get_out(socket)
        }

        if (decoded.data.id !== data.user_id) {
          return App.handler.get_out(socket)
        }
        else {
          socket.hue_user_id = data.user_id

          let info = await App.db_manager.get_room([`id`, data.room_id])

          if (!info) {
            return App.handler.get_out(socket)
          }

          let userinfo = await App.db_manager.get_user([`id`, socket.hue_user_id])

          if (!userinfo) {
            return App.handler.get_out(socket)
          }

          await App.handler.do_join(socket, info, userinfo, data)
        }
      })
    }
  }

  // Does a room join after successful authentication
  App.handler.do_join = async (socket, info, userinfo, data) => {
    socket.hue_username = userinfo.username

    if (App.handler.user_is_banned(socket)) {
      return App.handler.get_out(socket)
    }

    socket.hue_room_id = info.id
    socket.hue_bio = userinfo.bio
    socket.hue_joining = true
    socket.hue_last_chat_message = Date.now()
    socket.join(socket.hue_room_id)

    if (await App.handler.check_multipe_joins(socket)) {
      return App.handler.get_out(socket)
    }

    if (await App.handler.check_socket_limit(socket)) {
      return App.handler.get_out(socket)
    }

    if (App.sconfig.superuser_usernames.includes(userinfo.username)) {
      socket.hue_superuser = true
    }

    if (!socket.hue_superuser && info.bans.includes(socket.hue_user_id)) {
      socket.leave(socket.hue_room_id)
      socket.hue_locked = true

      App.handler.user_emit(socket, `joined`, {
        room_locked: true,
      })

      return
    }

    App.handler.log_user_data(socket)

    socket.hue_profilepic_version = userinfo.profilepic_version
    socket.hue_audioclip_version = userinfo.audioclip_version

    if (App.vars.rooms[socket.hue_room_id] === undefined) {
      App.vars.rooms[socket.hue_room_id] = App.handler.create_room_object(info)
    }

    socket.hue_role = info.keys[socket.hue_user_id] || App.vars.default_role

    if (!App.vars.roles.includes(socket.hue_role)) {
      socket.hue_role = `voice`
    }

    if (App.vars.user_rooms[socket.hue_user_id] === undefined) {
      App.vars.user_rooms[socket.hue_user_id] = []
    }

    if (!App.vars.user_rooms[socket.hue_user_id].includes(socket.hue_room_id)) {
      App.vars.user_rooms[socket.hue_user_id].push(socket.hue_room_id)
    }

    let already_connected = await App.handler.user_already_connected(socket)

    if (!already_connected) {
      App.vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id] = {}
      App.handler.update_user_in_userlist(socket, true)
    }

    socket.hue_joining = false
    socket.hue_joined = true

    let user_data = {
      room_locked: false,
      room_name: info.name,
      username: socket.hue_username,
      topic: info.topic,
      role: socket.hue_role,
      profilepic_version: userinfo.profilepic_version,
      background_color: info.background_color,
      background: info.background,
      background_type: info.background_type,
      background_version: info.background_version,
      text_color: info.text_color,
      bio: socket.hue_bio,
      superuser: socket.hue_superuser,
      reg_date: userinfo.registration_date,
    }

    if (data.no_log_messages) {
      user_data.log_messages = []
    }
    else {
      user_data.log_messages = info.log_messages
    }

    if (data.no_message_board_posts) {
      user_data.message_board_posts = []
    }
    else {
      user_data.message_board_posts = info.message_board_posts
    }

    if (data.no_userlist) {
      user_data.userlist = []
    }
    else {
      user_data.userlist = App.handler.prepare_userlist(App.handler.get_userlist(socket.hue_room_id))
    }

    App.handler.user_emit(socket, `joined`, user_data)

    if (!already_connected) {
      App.handler.broadcast_emit(socket, `user_joined`, {
        user_id: socket.hue_user_id,
        username: socket.hue_username,
        role: socket.hue_role,
        profilepic_version: socket.hue_profilepic_version,
        bio: socket.hue_bio,
        audioclip_version: socket.hue_audioclip_version,
        date_joined: Date.now()
      })
    }
  }
}