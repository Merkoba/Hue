// Ban a user id globally
Hue.ban_user_id = function (user_id) {
  if (!user_id) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("ban_user_id", {user_id: user_id})
  })
}

// Ban an ip address globally
Hue.ban_ip_address = function (ip_address) {
  if (!ip_address) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("ban_ip_address", {ip_address: ip_address})
  })
}

// Unban a user id globally
Hue.unban_user_id = function (user_id) {
  if (!user_id) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("unban_user_id", {user_id: user_id})
  })
}

// Unban an ip address globally
Hue.unban_ip_address = function (ip_address) {
  if (!ip_address) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("unban_ip_address", {ip_address: ip_address})
  })
}

// Get the user id of a user
Hue.get_user_id = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("get_user_id", {username: username})
  })
}

// When user id is received
Hue.user_id_received = function (data) {
  Hue.checkmsg(`The user id of ${data.username} is ${data.user_id}`)
}

// Get the ip address of a username
Hue.get_ip_address = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("get_ip_address", {username: username})
  })
}

// When ip address is received
Hue.ip_address_received = function (data) {
  Hue.checkmsg(`The ip address of ${data.username} is ${data.ip_address}`)
}

// Disconnect all sockets from a user
Hue.disconnect_user = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("disconnect_user", {username: username})
  })
}