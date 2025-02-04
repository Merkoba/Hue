module.exports = (App) => {
  // Set initial hue variables on connection
  App.handler.connection = (socket) => {
    socket.hue.pinged = false
    socket.hue.kicked = false
    socket.hue.banned = false
    socket.hue.joining = false
    socket.hue.joined = false
    socket.hue.superuser = false
    socket.hue.locked = false
    socket.hue.info1 = ``
  }

  // Attempt to join a room
  App.handler.public.join_room = async (socket, data) => {
    if (socket.hue.joining || socket.hue.joined) {
      return
    }

    if (data.room_id === undefined) {
      return App.handler.get_out(socket)
    }

    if (data.room_id.length > App.sconfig.max_room_id_length) {
      return App.handler.get_out(socket)
    }

    if (data.alternative) {
      socket.hue.login_method = `alternative`

      if (!data.username || !data.password) {
        return App.handler.get_out(socket)
      }

      data.username = data.username.trim()
      data.password = data.password.trim()

      if ((data.username === undefined) || (data.password === undefined)) {
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
      socket.hue.login_method = `normal`
      data.user_id = data.user_id.trim()

      if ((data.user_id === undefined) || (data.token === undefined)) {
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
        data.password,
      )

      if (!ans.valid) {
        App.handler.anti_spam_ban(socket, 2)
        return App.handler.get_out(socket)
      }

      let userinfo = ans.user

      socket.hue.user_id = userinfo.id

      let info = await App.db_manager.get_room([`id`, data.room_id])

      if (!info) {
        return App.handler.get_out(socket)
      }

      await App.handler.do_join(socket, info, userinfo, data)
    }
    else {
      App.i.jwt.verify(data.token, App.sconfig.jwt_secret, async function(
        err,
        decoded,
      ) {
        if (err) {
          return App.handler.get_out(socket)
        }
        else if (
          (decoded.data === undefined) ||
          (decoded.data.id === undefined)
        ) {
          return App.handler.get_out(socket)
        }

        if (decoded.data.id !== data.user_id) {
          return App.handler.get_out(socket)
        }

        socket.hue.user_id = data.user_id

        let info = await App.db_manager.get_room([`id`, data.room_id])

        if (!info) {
          return App.handler.get_out(socket)
        }

        let userinfo = await App.db_manager.get_user([`id`, socket.hue.user_id])

        if (!userinfo) {
          return App.handler.get_out(socket)
        }

        await App.handler.do_join(socket, info, userinfo, data)
      })
    }
  }

  // Does a room join after successful authentication
  App.handler.do_join = async (socket, info, userinfo, data) => {
    socket.hue.username = userinfo.username

    // If the user was kicked recently disallow join
    let kd = parseInt((Date.now() - userinfo.kicked) / 1000)

    if (kd <= App.sconfig.kick_penalty) {
      return App.handler.get_out(socket)
    }

    if (App.handler.user_is_banned(socket)) {
      return App.handler.get_out(socket)
    }

    if (!App.handler.user_is_invited(info, userinfo)) {
      return App.handler.get_out(socket)
    }

    socket.hue.room_id = info.id
    socket.hue.bio = userinfo.bio
    socket.hue.joining = true
    socket.hue.last_chat_message = Date.now()
    socket.join(socket.hue.room_id)

    if (await App.handler.check_multipe_joins(socket)) {
      return App.handler.get_out(socket)
    }

    if (await App.handler.check_socket_limit(socket)) {
      return App.handler.get_out(socket)
    }

    if (App.sconfig.superuser_usernames.includes(userinfo.username)) {
      socket.hue.superuser = true
    }

    if (!socket.hue.superuser && info.bans.includes(socket.hue.user_id)) {
      socket.leave(socket.hue.room_id)
      socket.hue.locked = true

      App.handler.user_emit(socket, `joined`, {
        room_locked: true,
      })

      return
    }

    App.handler.log_user_data(socket)

    socket.hue.profilepic_version = userinfo.profilepic_version
    socket.hue.audioclip_version = userinfo.audioclip_version

    if (App.vars.rooms[socket.hue.room_id] === undefined) {
      App.vars.rooms[socket.hue.room_id] = App.handler.create_room_object(info)
    }

    socket.hue.role = info.keys[socket.hue.user_id] || App.vars.default_role

    if (!App.vars.roles.includes(socket.hue.role)) {
      socket.hue.role = App.vars.default_role
    }

    if (App.vars.user_rooms[socket.hue.user_id] === undefined) {
      App.vars.user_rooms[socket.hue.user_id] = []
    }

    if (!App.vars.user_rooms[socket.hue.user_id].includes(socket.hue.room_id)) {
      App.vars.user_rooms[socket.hue.user_id].push(socket.hue.room_id)
    }

    let already_connected = await App.handler.user_already_connected(socket)

    if (!already_connected) {
      App.vars.rooms[socket.hue.room_id].userlist[socket.hue.user_id] = {}
      App.handler.update_user_in_userlist(socket, true)
    }

    socket.hue.joining = false
    socket.hue.joined = true

    let user_data = {
      room_locked: false,
      room_name: info.name,
      username: socket.hue.username,
      topic: info.topic,
      role: socket.hue.role,
      profilepic_version: userinfo.profilepic_version,
      background_color: info.background_color,
      background: info.background,
      background_type: info.background_type,
      background_version: info.background_version,
      text_color: info.text_color,
      limited: info.limited,
      bio: socket.hue.bio,
      superuser: socket.hue.superuser,
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
      user_data.userlist = App.handler.prepare_userlist(App.handler.get_userlist(socket.hue.room_id))
    }

    App.handler.user_emit(socket, `joined`, user_data)

    if (!already_connected) {
      App.handler.broadcast_emit(socket, `user_joined`, {
        user_id: socket.hue.user_id,
        username: socket.hue.username,
        role: socket.hue.role,
        profilepic_version: socket.hue.profilepic_version,
        bio: socket.hue.bio,
        audioclip_version: socket.hue.audioclip_version,
        date_joined: Date.now(),
      })
    }
  }
}