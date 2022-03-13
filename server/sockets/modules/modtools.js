module.exports = function (Hue) {
  // Get ip address
  Hue.handler.get_ip_address = function (socket) {
    return socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress
  }

  // Store IP in case blacklisting is necessary
  Hue.handler.log_user_ip_address = function (socket) {
    let date = new Date().toISOString()
    let info = `date: ${date} | username: ${socket.hue_username} | user_id: ${socket.hue_user_id} | ip: ${socket.hue_ip_address}`
    Hue.logger.info(info)
  }

  // Write banlist file
  Hue.handler.write_banlist_file = async function () {
    await Hue.vars.fsp.writeFile(Hue.banlist_path, JSON.stringify(Hue.banlist))
  }

  // Check if user is banned
  Hue.handler.user_is_banned = function (socket) {
    if (socket.hue_username && Hue.banlist.usernames.includes(socket.hue_username)) {
      return true
    }

    if (socket.hue_user_id && Hue.banlist.user_ids.includes(socket.hue_user_id)) {
      return true
    }

    if (socket.hue_ip_address && Hue.banlist.ip_addresses.includes(socket.hue_ip_address)) {
      return true
    }

    return false
  }  

  // Bans a user_id globally
  Hue.handler.public.ban_user_id = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.user_id === undefined) {
      return false
    }

    if (data.user_id.length === 0) {
      return false
    }

    if (Hue.banlist.user_ids.includes(data.user_id)) {
      Hue.handler.user_emit(socket, "item_already_included", {})
      return false
    }

    Hue.banlist.user_ids.push(data.user_id)
    await Hue.handler.write_banlist_file()
    Hue.handler.user_emit(socket, "item_included", {})
  }

  // Unbans a user_id globally
  Hue.handler.public.unban_user_id = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.user_id === undefined) {
      return false
    }

    if (data.user_id.length === 0) {
      return false
    }

    if (!Hue.banlist.user_ids.includes(data.user_id)) {
      Hue.handler.user_emit(socket, "item_not_included", {})
      return false
    }

    for (let i=0; i<Hue.banlist.user_ids.length; i++) {
      if (Hue.banlist.user_ids[i] === data.user_id) {
        Hue.banlist.user_ids.splice(i, 1)
        break
      }
    }
    
    await Hue.handler.write_banlist_file()
    Hue.handler.user_emit(socket, "item_removed", {})
  }

  // Bans an ip address globally
  Hue.handler.public.ban_ip_address = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.ip_address === undefined) {
      return false
    }

    if (data.ip_address.length === 0) {
      return false
    }

    if (Hue.banlist.ip_addresses.includes(data.ip_address)) {
      Hue.handler.user_emit(socket, "item_already_included", {})
      return false
    }

    Hue.banlist.ip_addresses.push(data.ip_address)
    await Hue.handler.write_banlist_file()
    Hue.handler.user_emit(socket, "item_included", {})
  }
  
  // Unbans an ip address globally
  Hue.handler.public.unban_ip_address = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.ip_address === undefined) {
      return false
    }

    if (data.ip_address.length === 0) {
      return false
    }

    if (!Hue.banlist.ip_addresses.includes(data.ip_address)) {
      Hue.handler.user_emit(socket, "item_not_included", {})
      return false
    }

    for (let i=0; i<Hue.banlist.ip_addresses.length; i++) {
      if (Hue.banlist.ip_addresses[i] === data.ip_address) {
        Hue.banlist.ip_addresses.splice(i, 1)
        break
      }
    }
    
    await Hue.handler.write_banlist_file()
    Hue.handler.user_emit(socket, "item_removed", {})
  }

  // Bans a username globally
  Hue.handler.public.ban_username = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (Hue.banlist.usernames.includes(data.username)) {
      Hue.handler.user_emit(socket, "item_already_included", {})
      return false
    }

    Hue.banlist.usernames.push(data.username)
    await Hue.handler.write_banlist_file()
    Hue.handler.user_emit(socket, "item_included", {})
  }

  // Unbans a username globally
  Hue.handler.public.unban_username = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    if (!Hue.banlist.usernames.includes(data.username)) {
      Hue.handler.user_emit(socket, "item_not_included", {})
      return false
    }

    for (let i=0; i<Hue.banlist.usernames.length; i++) {
      if (Hue.banlist.usernames[i] === data.username) {
        Hue.banlist.usernames.splice(i, 1)
        break
      }
    }
    
    await Hue.handler.write_banlist_file()
    Hue.handler.user_emit(socket, "item_removed", {})
  }

  // Send the user_id of a username
  Hue.handler.public.get_user_id = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    let userinfo = await Hue.db_manager.get_user(
      ["username", data.username],
      { username: 1 }
    )

    Hue.handler.user_emit(socket, "user_id_received", {
      user_id: userinfo.id,
      username: userinfo.username
    })
  }

  // Send the username of a user_id
  Hue.handler.public.get_username = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }
    
    if (data.user_id === undefined) {
      return false
    }

    if (data.user_id.length === 0) {
      return false
    }

    let userinfo = await Hue.db_manager.get_user(
      ["id", data.user_id],
      { username: 1 }
    )

    Hue.handler.user_emit(socket, "username_received", {
      user_id: userinfo.id,
      username: userinfo.username
    })
  }

  // Send the ip address of a connected user
  Hue.handler.public.get_ip_address = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    if (data.username === undefined) {
      return false
    }

    if (data.username.length === 0) {
      return false
    }

    let ip_address = ""
    let sockets = await Hue.handler.get_all_sockets()

    for (let socc of sockets) {
      if (socc.hue_username === data.username) {
        ip_address = socc.hue_ip_address
        break
      }
    }

    if (ip_address) {
      Hue.handler.user_emit(socket, "ip_address_received", {
        username: data.username,
        ip_address: ip_address
      })
    } else {
      Hue.handler.user_emit(socket, "data_not_found", {})
    }
  }

  // Disconnect all sockets of a user
  Hue.handler.public.disconnect_user = async function (socket, data) {
    if (!socket.hue_superuser) {
      Hue.handler.anti_spam_ban(socket)
      return false
    }

    let sockets = await Hue.handler.get_all_sockets()

    for (let socc of sockets) {
      if (socc.hue_username === data.username) {
        socc.disconnect()
      }
    }
  } 
}