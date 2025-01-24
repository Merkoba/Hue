module.exports = (App) => {
  // Superuser change role
  App.handler.public.annex = (socket, data) => {
    if (!socket.hue_superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    App.handler.public.change_role(socket, data)
  }

  // Handles role changes
  App.handler.public.change_role = async (socket, data) => {
    if (!socket.hue_superuser) {
      if (!App.handler.is_admin_or_op(socket)) {
        return
      }
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > App.config.max_max_username_length) {
      return
    }

    if (!App.vars.roles.includes(data.role)) {
      return
    }

    if (!socket.hue_superuser && (socket.hue_username === data.username)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])

    let userinfo = await App.db_manager.get_user([`username`, data.username])

    if (!userinfo) {
      App.handler.user_emit(socket, `user_not_found`, {})
      return
    }

    let id = userinfo.id
    let current_role = info.keys[id] || App.vars.default_role

    if (!socket.hue_superuser) {
      if (
        ((current_role === `admin`) || (current_role === `op`)) &&
        (socket.hue_role !== `admin`)
      ) {
        App.handler.user_emit(socket, `forbidden_user`, {})
        return
      }
    }

    if (
      (current_role === data.role) ||
      ((current_role === undefined) && (data.role === `voice`))
    ) {
      App.handler.user_emit(socket, `is_already`, {
        what: data.role,
        who: userinfo.username,
      })
      return
    }

    let sockets = await App.handler.get_user_sockets_per_room(socket.hue_room_id, id)
    let last_socc = false

    for (let socc of sockets) {
      if (socc.hue_superuser) {
        if (
          (socket.hue_username !== socc.hue_username) &&
          (socc.hue_role === `admin`)
        ) {
          App.handler.user_emit(socket, `forbidden_user`, {})
          return
        }
      }

      socc.hue_role = data.role
      last_socc = socc
    }

    if (last_socc) {
      App.handler.update_user_in_userlist(last_socc)
    }

    info.keys[id] = data.role

    App.handler.room_emit(socket, `user_role_changed`, {
      username1: socket.hue_username,
      username2: userinfo.username,
      role: data.role,
    })

    App.handler.push_admin_log_message(socket, `changed the role of "${userinfo.username}" to "${data.role}"`)
  }

  // Handles user kicks
  App.handler.public.kick = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > App.config.max_max_username_length) {
      return
    }

    let sockets = await App.handler.get_user_sockets_per_room_by_username(
      socket.hue_room_id,
      data.username,
    )

    if (sockets.length > 0) {
      if (
        (((sockets[0].hue_role === `admin`) ||
          (sockets[0].hue_role === `op`)) &&
          (socket.hue_role !== `admin`)) ||
        sockets[0].hue_superuser
      ) {
        App.handler.user_emit(socket, `forbidden_user`, {})
        return
      }

      let userinfo = await App.db_manager.get_user([`username`, data.username])

      if (userinfo) {
        userinfo.kicked = Date.now()
      }

      for (let socc of sockets) {
        socc.hue_role = ``
        socc.hue_kicked = true
        socc.hue_info1 = socket.hue_username
        App.handler.get_out(socc)
      }

      App.handler.push_admin_log_message(socket, `kicked "${data.username}"`)
    }
    else {
      App.handler.user_emit(socket, `user_not_in_room`, {})
      return
    }
  }

  // Handles user bans
  App.handler.public.ban = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > App.config.max_max_username_length) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])
    let userinfo = await App.db_manager.get_user([`username`, data.username])

    if (!userinfo) {
      App.handler.user_emit(socket, `user_not_found`, {})
      return
    }

    let id = userinfo.id
    let current_role = info.keys[id] || App.vars.default_role

    if (
      ((current_role === `admin`) || (current_role === `op`)) &&
      (socket.hue_role !== `admin`)
    ) {
      App.handler.user_emit(socket, `forbidden_user`, {})
      return
    }

    if (info.bans.includes(id)) {
      App.handler.user_emit(socket, `user_already_banned`, {})
      return
    }

    let sockets = await App.handler.get_user_sockets_per_room(socket.hue_room_id, id)

    if (sockets.length > 0) {
      for (let socc of sockets) {
        if (socc.hue_superuser) {
          App.handler.user_emit(socket, `forbidden_user`, {})
          return
        }

        socc.hue_role = ``
        socc.hue_banned = true
        socc.hue_info1 = socket.hue_username
        App.handler.get_out(socc)
      }

      App.handler.push_admin_log_message(socket, `banned "${userinfo.username}"`)
    }

    App.handler.room_emit(socket, `user_banned`, {
      username1: socket.hue_username,
      username2: userinfo.username,
    })

    info.bans.push(id)
    delete info.keys[id]
  }

  // Handles user unbans
  App.handler.public.unban = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    if (data.username.length > App.config.max_max_username_length) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])
    let userinfo = await App.db_manager.get_user([`username`, data.username])

    if (!userinfo) {
      App.handler.user_emit(socket, `user_not_found`, {})
      return
    }

    let id = userinfo.id

    if (!info.bans.includes(id)) {
      App.handler.user_emit(socket, `user_already_unbanned`, {})

      return
    }

    for (let i = 0; i < info.bans.length; i++) {
      if (info.bans[i] === id) {
        info.bans.splice(i, 1)
        break
      }
    }

    App.handler.room_emit(socket, `user_unbanned`, {
      username1: socket.hue_username,
      username2: userinfo.username,
    })

    App.handler.push_admin_log_message(socket, `unbanned "${userinfo.username}"`)
  }

  // Checks if socket is admin or op
  App.handler.is_admin_or_op = (socket) => {
    return (socket.hue_role === `admin`) || (socket.hue_role === `op`)
  }

  // Checks if socket is admin
  App.handler.is_admin = (socket) => {
    return socket.hue_role === `admin`
  }

  // Prepares the user list to be sent on room joins
  App.handler.prepare_userlist = (userlist) => {
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
  App.handler.get_userlist = (room_id) => {
    try {
      if (App.vars.rooms[room_id] === undefined) {
        return {}
      }

      if (App.vars.rooms[room_id].userlist !== undefined) {
        return App.vars.rooms[room_id].userlist
      }

      return {}
    }
    catch (err) {
      return {}
    }
  }

  // Get's a room's user count
  App.handler.get_usercount = (room_id) => {
    return Object.keys(App.handler.get_userlist(room_id)).length
  }

  // Sends admin activity list
  App.handler.public.get_admin_activity = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])
    App.handler.user_emit(socket, `receive_admin_activity`, {messages: info.admin_log_messages})
  }

  // Sends admin list
  App.handler.public.get_admin_list = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])

    let roles = {}
    let ids = []

    for (let id in info.keys) {
      let role = info.keys[id] || App.vars.default_role

      if ((role === `op`) || (role === `admin`)) {
        roles[id] = role
        ids.push(id)
      }
    }

    if (ids.length === 0) {
      App.handler.user_emit(socket, `receive_admin_list`, {list: []})
      return
    }

    let users = await App.db_manager.get_users(
      ids, {username: 1},
    )

    if (users.length === 0) {
      App.handler.user_emit(socket, `receive_admin_list`, {list: []})
      return
    }

    let list = []

    for (let user of users) {
      list.push({user_id: user.id, username: user.username, role: roles[user.id]})
    }

    App.handler.user_emit(socket, `receive_admin_list`, {list})
  }

  // Clear admin activity
  App.handler.public.clear_admin_activity = async (socket, data) => {
    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])
    info.admin_log_messages = []
    App.handler.room_emit(socket, `admin_activity_cleared`, {})
  }

  // Sends ban list
  App.handler.public.get_ban_list = async (socket, data) => {
    if (!App.handler.is_admin_or_op(socket)) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue_room_id])

    let ids = []

    for (let id of info.bans) {
      ids.push(id)
    }

    if (ids.length === 0) {
      App.handler.user_emit(socket, `receive_ban_list`, {list: []})
      return
    }

    let users = await App.db_manager.get_users(
      ids, {username: 1},
    )

    if (users.length === 0) {
      App.handler.user_emit(socket, `receive_ban_list`, {list: []})
      return
    }

    let list = []

    for (let user of users) {
      list.push({user_id: user.id, username: user.username})
    }

    App.handler.user_emit(socket, `receive_ban_list`, {list})
  }

  // Updates a user's data in the user list
  App.handler.update_user_in_userlist = (socket, first = false) => {
    try {
      let user = App.vars.rooms[socket.hue_room_id].userlist[socket.hue_user_id]

      user.user_id = socket.hue_user_id
      user.username = socket.hue_username
      user.role = socket.hue_role
      user.profilepic_version = socket.hue_profilepic_version
      user.bio = socket.hue_bio
      user.audioclip_version = socket.hue_audioclip_version

      if (first) {
        user.date_joined = Date.now()
      }
    }
    catch (err) {
      App.logger.log_error(err)
    }
  }

  // Superuser function to change a user's username
  App.handler.public.modusername = async (socket, data) => {
    if (!socket.hue_superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (!data.original || !data.new) {
      return
    }

    if (data.original === data.new) {
      return
    }

    if (data.new.length > App.config.max_username_length) {
      return
    }

    if (App.utilz.clean_username(data.new) !== data.new) {
      return
    }

    let userinfo = await App.db_manager.get_user([`username`, data.original])

    if (!userinfo) {
      App.handler.user_emit(socket, `user_not_found`, {})
      return
    }

    let ans = await App.db_manager.change_username(userinfo.id, data.original, data.new)

    if (!ans) {
      App.handler.user_emit(socket, `username_already_exists`, {
        username: data.new,
      })

      return
    }

    await App.handler.modify_socket_properties(
      userinfo.id,
      {hue_username: data.new},
      {
        method: `new_username`,
        data: {
          user_id: userinfo.id,
          username: data.new,
          old_username: data.original,
        },
      },
    )

    App.handler.user_emit(socket, `done`, {})
  }

  // Superuser function to change a user's password
  App.handler.public.modpassword = async (socket, data) => {
    if (!socket.hue_superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    let userinfo = await App.db_manager.get_user([`username`, data.username])

    if (!userinfo) {
      App.handler.user_emit(socket, `user_not_found`, {})
      return
    }

    App.db_manager.change_user_password(userinfo.id, data.password)
    App.handler.user_emit(socket, `done`, {})
  }
}