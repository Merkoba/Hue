// App show superuser confirm
App.sudo = (func) => {
  App.show_confirm(`Run superuser command`, func)
}

// Ban a user id globally
App.ban_user_id = (user_id) => {
  if (!user_id) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`ban_user_id`, {user_id})
  })
}

// Unban a user id globally
App.unban_user_id = (user_id) => {
  if (!user_id) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`unban_user_id`, {user_id})
  })
}

// Ban a username globally
App.ban_username = (username) => {
  if (!username) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`ban_username`, {username})
  })
}

// Unban a user id globally
App.unban_username = (username) => {
  if (!username) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`unban_username`, {username})
  })
}

// Ban an ip address globally
App.ban_ip_address = (ip_address) => {
  if (!ip_address) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`ban_ip_address`, {ip_address})
  })
}

// Unban an ip address globally
App.unban_ip_address = (ip_address) => {
  if (!ip_address) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`unban_ip_address`, {ip_address})
  })
}

// Get the user_id of a username
App.get_user_id_by_username = (username) => {
  if (!username) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`get_user_id_by_username`, {username})
  })
}

// Get the username of a user_id
App.get_username_by_user_id = (user_id) => {
  if (!user_id) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`get_username_by_user_id`, {user_id})
  })
}

// Get the ip address of a username
App.get_ip_address_by_username = (username) => {
  if (!username) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`get_ip_address_by_username`, {username})
  })
}

// When user id is received
App.user_id_received = (data) => {
  App.checkmsg(`The user id of ${data.username} is ${data.user_id}`)
}

// When username is received
App.username_received = (data) => {
  App.checkmsg(`The username of ${data.user_id} is ${data.username}`)
}

// When ip address is received
App.ip_address_received = (data) => {
  App.checkmsg(`The ip address of ${data.username} is ${data.ip_address}`)
}

// Disconnect all sockets from a user
App.disconnect_user = (username) => {
  if (!username) {
    return
  }

  App.sudo(() => {
    App.socket_emit(`disconnect_user`, {username})
  })
}

// Enable the registration code
// So new users will need the code to register
App.enable_registration_code = (username) => {
  App.sudo(() => {
    App.socket_emit(`enable_registration_code`, {})
  })
}

// Disable the registration code
// So new users won't need the code to register
App.disable_registration_code = (username) => {
  App.sudo(() => {
    App.socket_emit(`disable_registration_code`, {})
  })
}

// When the registration code is enabled
App.register_code_enabled = () => {
  App.checkmsg(`Registration code enabled`)
}

// When the registration code is disabled
App.register_code_disabled = () => {
  App.checkmsg(`Registration code disabled`)
}