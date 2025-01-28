module.exports = (App) => {
  // Get ip address
  App.handler.get_ip_address = (socket) => {
    return socket.client.request.headers[`x-forwarded-for`] || socket.client.conn.remoteAddress
  }

  // Write banlist file
  App.handler.write_banlist_file = async () => {
    await App.i.fsp.writeFile(App.banlist_path, JSON.stringify(App.banlist))
  }

  // Check if user is banned
  App.handler.user_is_banned = (socket) => {
    if (socket.hue.username) {
      let username = socket.hue.username.toLowerCase()

      if (App.banlist.usernames.some(x => x.toLowerCase() === username)) {
        return true
      }
    }

    if (socket.hue.user_id && App.banlist.user_ids.includes(socket.hue.user_id)) {
      return true
    }

    if (socket.hue.ip_address && App.banlist.ip_addresses.includes(socket.hue.ip_address)) {
      return true
    }

    return false
  }

  // Bans a username globally
  App.handler.public.ban_username = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    let username = data.username.toLowerCase()

    if (App.banlist.usernames.some(x => x.toLowerCase() === username)) {
      App.handler.user_emit(socket, `item_already_included`, {})
      return
    }

    App.banlist.usernames.push(username)
    await App.handler.write_banlist_file()
    App.handler.user_emit(socket, `item_included`, {})
  }

  // Unbans a username globally
  App.handler.public.unban_username = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    let username = data.username.toLowerCase()

    if (!App.banlist.usernames.some(x => x.toLowerCase() === username)) {
      App.handler.user_emit(socket, `item_not_included`, {})
      return
    }

    for (let i = 0; i < App.banlist.usernames.length; i++) {
      if (App.banlist.usernames[i].toLowerCase() === username) {
        App.banlist.usernames.splice(i, 1)
        break
      }
    }

    await App.handler.write_banlist_file()
    App.handler.user_emit(socket, `item_removed`, {})
  }

  // Bans a user_id globally
  App.handler.public.ban_user_id = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.user_id === undefined) {
      return
    }

    if (data.user_id.length === 0) {
      return
    }

    if (App.banlist.user_ids.includes(data.user_id)) {
      App.handler.user_emit(socket, `item_already_included`, {})
      return
    }

    App.banlist.user_ids.push(data.user_id)
    await App.handler.write_banlist_file()
    App.handler.user_emit(socket, `item_included`, {})
  }

  // Unbans a user_id globally
  App.handler.public.unban_user_id = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.user_id === undefined) {
      return
    }

    if (data.user_id.length === 0) {
      return
    }

    if (!App.banlist.user_ids.includes(data.user_id)) {
      App.handler.user_emit(socket, `item_not_included`, {})
      return
    }

    for (let i = 0; i < App.banlist.user_ids.length; i++) {
      if (App.banlist.user_ids[i] === data.user_id) {
        App.banlist.user_ids.splice(i, 1)
        break
      }
    }

    await App.handler.write_banlist_file()
    App.handler.user_emit(socket, `item_removed`, {})
  }

  // Bans an ip address globally
  App.handler.public.ban_ip_address = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.ip_address === undefined) {
      return
    }

    if (data.ip_address.length === 0) {
      return
    }

    if (App.banlist.ip_addresses.includes(data.ip_address)) {
      App.handler.user_emit(socket, `item_already_included`, {})
      return
    }

    App.banlist.ip_addresses.push(data.ip_address)
    await App.handler.write_banlist_file()
    App.handler.user_emit(socket, `item_included`, {})
  }

  // Unbans an ip address globally
  App.handler.public.unban_ip_address = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.ip_address === undefined) {
      return
    }

    if (data.ip_address.length === 0) {
      return
    }

    if (!App.banlist.ip_addresses.includes(data.ip_address)) {
      App.handler.user_emit(socket, `item_not_included`, {})
      return
    }

    for (let i = 0; i < App.banlist.ip_addresses.length; i++) {
      if (App.banlist.ip_addresses[i] === data.ip_address) {
        App.banlist.ip_addresses.splice(i, 1)
        break
      }
    }

    await App.handler.write_banlist_file()
    App.handler.user_emit(socket, `item_removed`, {})
  }

  // Send the user_id of a username
  App.handler.public.get_user_id_by_username = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    let userinfo = await App.db_manager.get_user([`username`, data.username])

    if (userinfo) {
      App.handler.user_emit(socket, `user_id_received`, {
        user_id: userinfo.id,
        username: userinfo.username,
      })
    }
    else {
      App.handler.user_emit(socket, `data_not_found`, {})
    }
  }

  // Send the username of a user_id
  App.handler.public.get_username_by_user_id = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.user_id === undefined) {
      return
    }

    if (data.user_id.length === 0) {
      return
    }

    let userinfo = await App.db_manager.get_user([`id`, data.user_id])

    if (userinfo) {
      App.handler.user_emit(socket, `username_received`, {
        user_id: userinfo.id,
        username: userinfo.username,
      })
    }
    else {
      App.handler.user_emit(socket, `data_not_found`, {})
    }
  }

  // Send the ip address of a connected user
  App.handler.public.get_ip_address_by_username = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (data.username === undefined) {
      return
    }

    if (data.username.length === 0) {
      return
    }

    let ip_address = ``
    let sockets = await App.handler.get_all_sockets()

    for (let socc of sockets) {
      if (socc.hue.username === data.username) {
        ip_address = socc.hue.ip_address
        break
      }
    }

    if (ip_address) {
      App.handler.user_emit(socket, `ip_address_received`, {
        username: data.username,
        ip_address,
      })
    }
    else {
      App.handler.user_emit(socket, `data_not_found`, {})
    }
  }

  // Disconnect all sockets of a user
  App.handler.public.disconnect_user = async (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    let sockets = await App.handler.get_all_sockets()

    for (let socc of sockets) {
      if (socc.hue.username === data.username) {
        socc.disconnect()
      }
    }
  }

  // Handles room deletion
  App.handler.public.delete_room = (socket, data) => {
    if (!socket.hue.superuser) {
      App.handler.anti_spam_ban(socket)
      return
    }

    if (socket.hue.room_id === App.config.main_room_id) {
      return
    }

    App.db_manager.delete_room(socket.hue.room_id)
    let room_files = App.i.path.join(App.vars.media_root, `room`, socket.hue.room_id)
    App.i.fs.rmSync(room_files, {recursive: true, force: true})
    App.handler.disconnect_room_sockets(socket)
  }

  // Store user data incase abuse/attacks happen
  App.handler.log_user_data = (socket) => {
    let date = new Date().toISOString()
    let info = `date: ${date} | username: ${socket.hue.username} | user_id: ${socket.hue.user_id} | ip: ${socket.hue.ip_address}`
    App.logger.info(info)
  }
}