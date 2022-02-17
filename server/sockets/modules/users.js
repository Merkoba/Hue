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

  // Superuser change role
  handler.public.annex = function (socket, data) {
    if (!socket.hue_superuser) {
      handler.anti_spam_ban(socket)
      return false
    }

    handler.public.change_role(socket, data)
  }

  // Handles role changes
  handler.public.change_role = async function (socket, data) {
    if (!socket.hue_superuser) {
      if (!handler.is_admin_or_op(socket)) {
        return false
      }
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (data.username.length > config.max_max_username_length) {
      return false
    }

    if (!vars.roles.includes(data.role)) {
      return false
    }

    if (!socket.hue_superuser && socket.hue_username === data.username) {
      return false
    }

    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { keys: 1 }
    )

    let userinfo = await db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      handler.user_emit(socket, "user_not_found", {})
      return false
    }

    let id = userinfo.id
    let current_role = info.keys[id] || vars.default_role

    if (!socket.hue_superuser) {
      if (
        (current_role === "admin" || current_role === "op") &&
        socket.hue_role !== "admin"
      ) {
        handler.user_emit(socket, "forbidden_user", {})
        return false
      }
    }

    if (
      current_role === data.role ||
      (current_role === undefined && data.role === "voice")
    ) {
      handler.user_emit(socket, "is_already", {
        what: data.role,
        who: userinfo.username
      })
      return false
    }

    let sockets = handler.get_user_sockets_per_room(socket.hue_room_id, id)
    let last_socc = false

    for (let socc of sockets) {
      if (socc.hue_superuser) {
        if (
          socket.hue_username !== socc.hue_username &&
          socc.hue_role === "admin"
        ) {
          handler.user_emit(socket, "forbidden_user", {})
          return false
        }
      }

      socc.hue_role = data.role
      last_socc = socc
    }

    if (last_socc) {
      handler.update_user_in_userlist(last_socc)
    }

    info.keys[id] = data.role

    db_manager.update_room(info.id, { keys: info.keys })

    handler.room_emit(socket, "user_role_changed", {
      username1: socket.hue_username,
      username2: userinfo.username,
      role: data.role,
    })

    handler.push_admin_log_message(socket, `changed the role of "${userinfo.username}" to "${data.role}"`)
  }

  // Handles user kicks
  handler.public.kick = function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (data.username.length > config.max_max_username_length) {
      return false
    }

    let sockets = handler.get_user_sockets_per_room_by_username(
      socket.hue_room_id,
      data.username
    )

    if (sockets.length > 0) {
      if (
        ((sockets[0].hue_role === "admin" ||
          sockets[0].hue_role === "op") &&
          socket.hue_role !== "admin") ||
        sockets[0].hue_superuser
      ) {
        handler.user_emit(socket, "forbidden_user", {})
        return false
      }

      for (let socc of sockets) {
        socc.hue_role = ""
        socc.hue_kicked = true
        socc.hue_info1 = socket.hue_username
        handler.get_out(socc)
      }

      handler.push_admin_log_message(socket, `kicked "${data.username}"`)
    } else {
      handler.user_emit(socket, "user_not_in_room", {})
      return false
    }
  }

  // Handles user bans
  handler.public.ban = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (data.username.length > config.max_max_username_length) {
      return false
    }

    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { bans: 1, keys: 1 }
    )

    let userinfo = await db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      handler.user_emit(socket, "user_not_found", {})
      return false
    }

    let id = userinfo.id
    let current_role = info.keys[id] || vars.default_role

    if (
      (current_role === "admin" || current_role === "op") &&
      socket.hue_role !== "admin"
    ) {
      handler.user_emit(socket, "forbidden_user", {})
      return false
    }

    if (info.bans.includes(id)) {
      handler.user_emit(socket, "user_already_banned", {})
      return false
    }

    let sockets = handler.get_user_sockets_per_room(socket.hue_room_id, id)

    if (sockets.length > 0) {
      for (let socc of sockets) {
        if (socc.hue_superuser) {
          handler.user_emit(socket, "forbidden_user", {})
          return false
        }

        socc.hue_role = ""
        socc.hue_banned = true
        socc.hue_info1 = socket.hue_username
        handler.get_out(socc)
      }

      handler.push_admin_log_message(socket, `banned "${userinfo.username}"`)
    }

    handler.room_emit(socket, "user_banned", {
      username1: socket.hue_username,
      username2: userinfo.username,
    })

    info.bans.push(id)
    delete info.keys[id]
    db_manager.update_room(info.id, { bans: info.bans, keys: info.keys })
  }

  // Handles user unbans
  handler.public.unban = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (data.username.length > config.max_max_username_length) {
      return false
    }

    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { bans: 1, keys: 1 }
    )

    let userinfo = await db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      handler.user_emit(socket, "user_not_found", {})
      return false
    }

    let id = userinfo.id

    if (!info.bans.includes(id)) {
      handler.user_emit(socket, "user_already_unbanned", {})

      return false
    }

    for (let i = 0; i < info.bans.length; i++) {
      if (info.bans[i] === id) {
        info.bans.splice(i, 1)
        break
      }
    }

    db_manager.update_room(info.id, { bans: info.bans })

    handler.room_emit(socket, "user_unbanned", {
      username1: socket.hue_username,
      username2: userinfo.username,
    })

    handler.push_admin_log_message(socket, `unbanned "${userinfo.username}"`)
  }

  // Checks if socket is admin or op
  handler.is_admin_or_op = function (socket) {
    return socket.hue_role === "admin" || socket.hue_role === "op"
  }

  // Checks if socket is admin
  handler.is_admin = function (socket) {
    return socket.hue_role === "admin"
  }

  // Prepares the user list to be sent on room joins
  handler.prepare_userlist = function (userlist) {
    let userlist2 = []

    for (let key in userlist) {
      let item = userlist[key]

      userlist2.push({
        user_id: item.user_id,
        username: item.username,
        role: item.role,
        profilepic_version: item.profilepic_version,
        last_activity: 0,
        date_joined: item.date_joined,
        bio: item.bio,
        audioclip_version: item.audioclip_version,
      })
    }

    return userlist2
  }

  // Gets a room's userlist
  handler.get_userlist = function (room_id) {
    try {
      if (vars.rooms[room_id] === undefined) {
        return {}
      }

      if (vars.rooms[room_id].userlist !== undefined) {
        return vars.rooms[room_id].userlist
      } else {
        return {}
      }
    } catch (err) {
      return {}
    }
  }

  // Get's a room's user count
  handler.get_usercount = function (room_id) {
    return Object.keys(handler.get_userlist(room_id)).length
  }

  // Sends admin activity list
  handler.public.get_admin_activity = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    let info = await db_manager.get_room(["id", socket.hue_room_id], { admin_log_messages: 1 })
    handler.user_emit(socket, "receive_admin_activity", { messages: info.admin_log_messages })
  }

  // Sends admin list
  handler.public.get_admin_list = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { keys: 1 }
    )

    let roles = {}
    let ids = []

    for (let id in info.keys) {
      let role = info.keys[id] || vars.default_role

      if (role === "op" || role === "admin") {
        roles[id] = role
        ids.push(id)
      }
    }

    if (ids.length === 0) {
      handler.user_emit(socket, "receive_admin_list", { list: [] })
      return false
    }

    let users = await db_manager.get_users(
      ids, { username: 1 }
    )

    if (users.length === 0) {
      handler.user_emit(socket, "receive_admin_list", { list: [] })
      return false
    }

    let list = []

    for (let user of users) {
      list.push({ user_id: user.id, username: user.username, role: roles[user.id] })
    }

    handler.user_emit(socket, "receive_admin_list", { list: list })
  }

  // Sends ban list
  handler.public.get_ban_list = async function (socket, data) {
    if (!handler.is_admin_or_op(socket)) {
      return false
    }

    let info = await db_manager.get_room(
      ["id", socket.hue_room_id],
      { bans: 1 }
    )
    
    let ids = []

    for (let id of info.bans) {
      ids.push(id)
    }

    if (ids.length === 0) {
      handler.user_emit(socket, "receive_ban_list", { list: [] })
      return false
    }

    let users = await db_manager.get_users(
      ids, { username: 1 }
    )

    if (users.length === 0) {
      handler.user_emit(socket, "receive_ban_list", { list: [] })
      return false
    }

    let list = []

    for (let user of users) {
      list.push({ user_id: user.id, username: user.username })
    }

    handler.user_emit(socket, "receive_ban_list", { list: list })
  }

  // Updates a user's data in the user list
  handler.update_user_in_userlist = function (socket, first = false) {
    try {
      let user = vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id]

      user.user_id = socket.hue_user_id
      user.username = socket.hue_username
      user.role = socket.hue_role
      user.profilepic_version = socket.hue_profilepic_version
      user.bio = socket.hue_bio
      user.audioclip_version = socket.hue_audioclip_version

      if (first) {
        user.date_joined = Date.now()
      }
    } catch (err) {
      logger.log_error(err)
    }
  }

  // Superuser function to change a user's username
  handler.public.modusername = async function (socket, data) {
    if (!socket.hue_superuser) {
      handler.anti_spam_ban(socket)
      return false
    }

    if (!data.original || !data.new) {
      return false
    }

    if (data.original === data.new) {
      return false
    }
  
    if (data.new.length > config.max_username_length) {
      return false
    }
  
    if (utilz.clean_username(data.new) !== data.new) {
      return false
    }

    let userinfo = await db_manager.get_user(
      ["username", data.original],
      { username: 1 }
    )

    if (!userinfo) {
      handler.user_emit(socket, "user_not_found", {})
      return false
    }

    let done = await db_manager.change_username(
      userinfo.id,
      data.new
    )
  
    if (done) {
      handler.modify_socket_properties(
        userinfo.id,
        { hue_username: data.new },
        {
          method: "new_username",
          data: {
            user_id: userinfo.id,
            username: data.new,
            old_username: data.original
          }
        }
      )

      handler.user_emit(socket, "done", {})
    } else {
      handler.user_emit(socket, "username_already_exists", {
        username: data.new,
      })
    }
  }

  // Superuser function to change a user's password
  handler.public.modpassword = async function (socket, data) {
    if (!socket.hue_superuser) {
      handler.anti_spam_ban(socket)
      return false
    }

    let userinfo = await db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      handler.user_emit(socket, "user_not_found", {})
      return false
    }

    db_manager.change_user_password(userinfo.id, data.password)
    handler.user_emit(socket, "done", {})
  }
}