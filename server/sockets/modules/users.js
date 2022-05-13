module.exports = function (Hue) {

  // Superuser change role
  Hue.handler.public.annex = function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    Hue.handler.public.change_role(socket, data)
  }

  // Handles role changes
  Hue.handler.public.change_role = async function (socket, data) {
    if (!socket.hue_superuser) {
      if (!Hue.handler.is_admin_or_op(socket)) {
        return
      }
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > Hue.config.max_max_username_length) {
      return
    }

    if (!Hue.vars.roles.includes(data.role)) {
      return
    }

    if (!socket.hue_superuser && socket.hue_username === data.username) {
      return
    }

    let info = await Hue.db_manager.get_room(
      ["id", socket.hue_room_id],
      { keys: 1 }
    )

    let userinfo = await Hue.db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      Hue.handler.user_emit(socket, "user_not_found", {})
      return
    }

    let id = userinfo.id
    let current_role = info.keys[id] || Hue.vars.default_role

    if (!socket.hue_superuser) {
      if (
        (current_role === "admin" || current_role === "op") &&
        socket.hue_role !== "admin"
      ) {
        Hue.handler.user_emit(socket, "forbidden_user", {})
        return
      }
    }

    if (
      current_role === data.role ||
      (current_role === undefined && data.role === "voice")
    ) {
      Hue.handler.user_emit(socket, "is_already", {
        what: data.role,
        who: userinfo.username
      })
      return
    }

    let sockets = await Hue.handler.get_user_sockets_per_room(socket.hue_room_id, id)
    let last_socc = false

    for (let socc of sockets) {
      if (socc.hue_superuser) {
        if (
          socket.hue_username !== socc.hue_username &&
          socc.hue_role === "admin"
        ) {
          Hue.handler.user_emit(socket, "forbidden_user", {})
          return
        }
      }

      socc.hue_role = data.role
      last_socc = socc
    }

    if (last_socc) {
      Hue.handler.update_user_in_userlist(last_socc)
    }

    info.keys[id] = data.role

    Hue.db_manager.update_room(info.id, { keys: info.keys })

    Hue.handler.room_emit(socket, "user_role_changed", {
      username1: socket.hue_username,
      username2: userinfo.username,
      role: data.role,
    })

    Hue.handler.push_admin_log_message(socket, `changed the role of "${userinfo.username}" to "${data.role}"`)
  }

  // Handles user kicks
  Hue.handler.public.kick = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > Hue.config.max_max_username_length) {
      return
    }

    let sockets = await Hue.handler.get_user_sockets_per_room_by_username(
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
        Hue.handler.user_emit(socket, "forbidden_user", {})
        return
      }

      for (let socc of sockets) {
        socc.hue_role = ""
        socc.hue_kicked = true
        socc.hue_info1 = socket.hue_username
        Hue.handler.get_out(socc)
      }

      Hue.handler.push_admin_log_message(socket, `kicked "${data.username}"`)
    } else {
      Hue.handler.user_emit(socket, "user_not_in_room", {})
      return
    }
  }

  // Handles user bans
  Hue.handler.public.ban = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > Hue.config.max_max_username_length) {
      return
    }

    let info = await Hue.db_manager.get_room(
      ["id", socket.hue_room_id],
      { bans: 1, keys: 1 }
    )

    let userinfo = await Hue.db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      Hue.handler.user_emit(socket, "user_not_found", {})
      return
    }

    let id = userinfo.id
    let current_role = info.keys[id] || Hue.vars.default_role

    if (
      (current_role === "admin" || current_role === "op") &&
      socket.hue_role !== "admin"
    ) {
      Hue.handler.user_emit(socket, "forbidden_user", {})
      return
    }

    if (info.bans.includes(id)) {
      Hue.handler.user_emit(socket, "user_already_banned", {})
      return
    }

    let sockets = await Hue.handler.get_user_sockets_per_room(socket.hue_room_id, id)

    if (sockets.length > 0) {
      for (let socc of sockets) {
        if (socc.hue_superuser) {
          Hue.handler.user_emit(socket, "forbidden_user", {})
          return
        }

        socc.hue_role = ""
        socc.hue_banned = true
        socc.hue_info1 = socket.hue_username
        Hue.handler.get_out(socc)
      }

      Hue.handler.push_admin_log_message(socket, `banned "${userinfo.username}"`)
    }

    Hue.handler.room_emit(socket, "user_banned", {
      username1: socket.hue_username,
      username2: userinfo.username,
    })

    info.bans.push(id)
    delete info.keys[id]
    Hue.db_manager.update_room(info.id, { bans: info.bans, keys: info.keys })
  }

  // Handles user unbans
  Hue.handler.public.unban = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > Hue.config.max_max_username_length) {
      return
    }

    let info = await Hue.db_manager.get_room(
      ["id", socket.hue_room_id],
      { bans: 1, keys: 1 }
    )

    let userinfo = await Hue.db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      Hue.handler.user_emit(socket, "user_not_found", {})
      return
    }

    let id = userinfo.id

    if (!info.bans.includes(id)) {
      Hue.handler.user_emit(socket, "user_already_unbanned", {})

      return
    }

    for (let i = 0; i < info.bans.length; i++) {
      if (info.bans[i] === id) {
        info.bans.splice(i, 1)
        break
      }
    }

    Hue.db_manager.update_room(info.id, { bans: info.bans })

    Hue.handler.room_emit(socket, "user_unbanned", {
      username1: socket.hue_username,
      username2: userinfo.username,
    })

    Hue.handler.push_admin_log_message(socket, `unbanned "${userinfo.username}"`)
  }

  // Checks if socket is admin or op
  Hue.handler.is_admin_or_op = function (socket) {
    return socket.hue_role === "admin" || socket.hue_role === "op"
  }

  // Checks if socket is admin
  Hue.handler.is_admin = function (socket) {
    return socket.hue_role === "admin"
  }

  // Prepares the user list to be sent on room joins
  Hue.handler.prepare_userlist = function (userlist) {
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
  Hue.handler.get_userlist = function (room_id) {
    try {
      if (Hue.vars.rooms[room_id] === undefined) {
        return {}
      }

      if (Hue.vars.rooms[room_id].userlist !== undefined) {
        return Hue.vars.rooms[room_id].userlist
      } else {
        return {}
      }
    } catch (err) {
      return {}
    }
  }

  // Get's a room's user count
  Hue.handler.get_usercount = function (room_id) {
    return Object.keys(Hue.handler.get_userlist(room_id)).length
  }

  // Sends admin activity list
  Hue.handler.public.get_admin_activity = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    let info = await Hue.db_manager.get_room(["id", socket.hue_room_id], { admin_log_messages: 1 })
    Hue.handler.user_emit(socket, "receive_admin_activity", { messages: info.admin_log_messages })
  }

  // Sends admin list
  Hue.handler.public.get_admin_list = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    let info = await Hue.db_manager.get_room(
      ["id", socket.hue_room_id],
      { keys: 1 }
    )

    let roles = {}
    let ids = []

    for (let id in info.keys) {
      let role = info.keys[id] || Hue.vars.default_role

      if (role === "op" || role === "admin") {
        roles[id] = role
        ids.push(id)
      }
    }

    if (ids.length === 0) {
      Hue.handler.user_emit(socket, "receive_admin_list", { list: [] })
      return
    }

    let users = await Hue.db_manager.get_users(
      ids, { username: 1 }
    )

    if (users.length === 0) {
      Hue.handler.user_emit(socket, "receive_admin_list", { list: [] })
      return
    }

    let list = []

    for (let user of users) {
      list.push({ user_id: user.id, username: user.username, role: roles[user.id] })
    }

    Hue.handler.user_emit(socket, "receive_admin_list", { list: list })
  }

  // Sends ban list
  Hue.handler.public.get_ban_list = async function (socket, data) {
    if (!Hue.handler.is_admin_or_op(socket)) {
      return
    }

    let info = await Hue.db_manager.get_room(
      ["id", socket.hue_room_id],
      { bans: 1 }
    )
    
    let ids = []

    for (let id of info.bans) {
      ids.push(id)
    }

    if (ids.length === 0) {
      Hue.handler.user_emit(socket, "receive_ban_list", { list: [] })
      return
    }

    let users = await Hue.db_manager.get_users(
      ids, { username: 1 }
    )

    if (users.length === 0) {
      Hue.handler.user_emit(socket, "receive_ban_list", { list: [] })
      return
    }

    let list = []

    for (let user of users) {
      list.push({ user_id: user.id, username: user.username })
    }

    Hue.handler.user_emit(socket, "receive_ban_list", { list: list })
  }

  // Updates a user's data in the user list
  Hue.handler.update_user_in_userlist = function (socket, first = false) {
    try {
      let user = Hue.vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id]

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
      Hue.logger.log_error(err)
    }
  }

  // Superuser function to change a user's username
  Hue.handler.public.modusername = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    if (!data.original || !data.new) {
      return
    }

    if (data.original === data.new) {
      return
    }
  
    if (data.new.length > Hue.config.max_username_length) {
      return
    }
  
    if (Hue.utilz.clean_username(data.new) !== data.new) {
      return
    }

    let userinfo = await Hue.db_manager.get_user(
      ["username", data.original],
      { username: 1 }
    )

    if (!userinfo) {
      Hue.handler.user_emit(socket, "user_not_found", {})
      return
    }

    let done = await Hue.db_manager.change_username(
      userinfo.id,
      data.original,
      data.new
    )
  
    if (done) {
      await Hue.handler.modify_socket_properties(
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

      Hue.handler.user_emit(socket, "done", {})
    } else {
      Hue.handler.user_emit(socket, "username_already_exists", {
        username: data.new,
      })
    }
  }

  // Superuser function to change a user's password
  Hue.handler.public.modpassword = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return
    }

    let userinfo = await Hue.db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    if (!userinfo) {
      Hue.handler.user_emit(socket, "user_not_found", {})
      return
    }

    Hue.db_manager.change_user_password(userinfo.id, data.password)
    Hue.handler.user_emit(socket, "done", {})
  }
}