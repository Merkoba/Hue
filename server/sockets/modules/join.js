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
  // Sets initial hue_* variables on connection
  handler.connection = async function (socket) {
    socket.hue_pinged = false
    socket.hue_kicked = false
    socket.hue_banned = false
    socket.hue_joining = false
    socket.hue_joined = false
    socket.hue_superuser = false
    socket.hue_locked = false
    socket.hue_info1 = ""
    socket.hue_typing_counter = 0
    await handler.add_spam(socket)
  }

  // Attempts to join a room
  handler.public.join_room = async function (socket, data) {
    if (socket.hue_joining || socket.hue_joined) {
      return false
    }

    if (data.room_id === undefined) {
      return handler.do_disconnect(socket)
    }

    if (data.room_id.length > sconfig.max_room_id_length) {
      return handler.do_disconnect(socket)
    }

    if (data.alternative) {
      socket.hue_login_method = "alternative"
      
      if (!data.username || !data.password) {
        return handler.do_disconnect(socket)
      }

      data.username = data.username.trim()
      data.password = data.password.trim()

      if (data.username === undefined || data.password === undefined) {
        return handler.do_disconnect(socket)
      }

      if (data.username > config.max_max_username_length) {
        return handler.do_disconnect(socket)
      }

      if (data.password.length > config.max_max_password_length) {
        return handler.do_disconnect(socket)
      }
    } else {
      socket.hue_login_method = "normal"
      data.user_id = data.user_id.trim()

      if (data.user_id === undefined || data.token === undefined) {
        return handler.do_disconnect(socket)
      }

      if (data.user_id > sconfig.max_user_id_length) {
        return handler.do_disconnect(socket)
      }

      if (data.token.length > sconfig.max_jwt_token_length) {
        return handler.do_disconnect(socket)
      }
    }

    let user_fields = {
      username: 1,
      profilepic_version: 1,
      registration_date: 1,
      bio: 1,
      audioclip_version: 1
    }

    if (data.alternative) {
      let ans = await db_manager.check_password(
        data.username,
        data.password,
        user_fields
      )

      if (!ans.valid) {
        handler.anti_spam_ban(socket, 2)
        return handler.do_disconnect(socket)
      }

      let userinfo = ans.user

      socket.hue_user_id = userinfo.id

      let info = await db_manager.get_room(["id", data.room_id], {})

      if (!info) {
        return handler.do_disconnect(socket)
      }

      handler.do_join(socket, info, userinfo, data)
    } else {
      vars.jwt.verify(data.token, sconfig.jwt_secret, async function (
        err,
        decoded
      ) {
        if (err) {
          return handler.do_disconnect(socket)
        } else if (
          decoded.data === undefined ||
          decoded.data.id === undefined
        ) {
          return handler.do_disconnect(socket)
        }

        if (decoded.data.id !== data.user_id) {
          return handler.do_disconnect(socket)
        } else {
          socket.hue_user_id = data.user_id

          let info = await db_manager.get_room(["id", data.room_id], {})

          if (!info) {
            return handler.do_disconnect(socket)
          }

          let userinfo = await db_manager.get_user(
            ["id", socket.hue_user_id],
            user_fields
          )

          if (!userinfo) {
            return handler.do_disconnect(socket)
          }

          handler.do_join(socket, info, userinfo, data)
        }
      })
    }
  }

  // Does a room join after successful authentication
  handler.do_join = async function (socket, info, userinfo, data) {
    socket.hue_room_id = info.id
    socket.hue_bio = userinfo.bio
    socket.hue_joining = true

    socket.join(socket.hue_room_id)

    if (handler.check_multipe_joins(socket)) {
      return handler.do_disconnect(socket)
    }

    if (handler.check_socket_limit(socket)) {
      return handler.do_disconnect(socket)
    }

    if (sconfig.superuser_usernames.includes(userinfo.username)) {
      socket.hue_superuser = true
    }

    socket.hue_username = userinfo.username

    socket.hue_ip =
      socket.client.request.headers["x-forwarded-for"] ||
      socket.client.conn.remoteAddress

    if (!socket.hue_superuser && info.bans.includes(socket.hue_user_id)) {
      socket.leave(socket.hue_room_id)
      socket.hue_locked = true

      handler.user_emit(socket, "joined", {
        room_locked: true,
      })

      return false
    }

    socket.hue_profilepic_version = userinfo.profilepic_version
    socket.hue_audioclip_version = userinfo.audioclip_version

    if (vars.rooms[socket.hue_room_id] === undefined) {
      vars.rooms[socket.hue_room_id] = handler.create_room_object(info)
    }

    socket.hue_role = info.keys[socket.hue_user_id] || vars.default_role

    if (!vars.roles.includes(socket.hue_role)) {
      socket.hue_role = "voice"
    }

    if (vars.user_rooms[socket.hue_user_id] === undefined) {
      vars.user_rooms[socket.hue_user_id] = []
    }

    if (!vars.user_rooms[socket.hue_user_id].includes(socket.hue_room_id)) {
      vars.user_rooms[socket.hue_user_id].push(socket.hue_room_id)
    }

    let already_connected = handler.user_already_connected(socket)

    if (!already_connected) {
      vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id] = {}
      handler.update_user_in_userlist(socket, true)
    }

    socket.hue_joining = false
    socket.hue_joined = true

    let userlist = handler.prepare_userlist(handler.get_userlist(socket.hue_room_id))

    let user_data = {
      room_locked: false,
      room_name: info.name,
      username: socket.hue_username,
      topic: info.topic,
      userlist: userlist,
      role: socket.hue_role,
      image_id: info.image_id,
      image_user_id: info.image_user_id,
      image_comment: info.image_comment,
      image_type: info.image_type,
      image_source: info.image_source,
      image_setter: info.image_setter,
      image_size: info.image_size,
      image_date: info.image_date,
      image_query: info.image_query,
      tv_id: info.tv_id,
      tv_user_id: info.tv_user_id,
      tv_comment: info.tv_comment,
      tv_type: info.tv_type,
      tv_source: info.tv_source,
      tv_title: info.tv_title,
      tv_setter: info.tv_setter,
      tv_date: info.tv_date,
      tv_query: info.tv_query,
      profilepic_version: userinfo.profilepic_version,
      background_color: info.background_color,
      background: info.background,
      background_type: info.background_type,
      background_version: info.background_version,
      text_color: info.text_color,
      bio: socket.hue_bio,
      superuser:socket.hue_superuser,
      reg_date: userinfo.registration_date,
    }

    if (data.no_message_log) {
      user_data.log_messages = []
      user_data.message_board_posts = []
    } else {
      user_data.log_messages = info.log_messages
      user_data.message_board_posts = info.message_board_posts
    }

    handler.user_emit(socket, "joined", user_data)

    if (!already_connected) {
      handler.broadcast_emit(socket, "user_joined", {
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