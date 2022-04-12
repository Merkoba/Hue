// Ban a user id globally
Hue.ban_user_id = function (user_id) {
  if (!user_id) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("ban_user_id", {user_id: user_id})
  })
}

// Unban a user id globally
Hue.unban_user_id = function (user_id) {
  if (!user_id) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("unban_user_id", {user_id: user_id})
  })
}

// Ban a username globally
Hue.ban_username = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("ban_username", {username: username})
  })
}

// Unban a user id globally
Hue.unban_username = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("unban_username", {username: username})
  })
}

// Ban an ip address globally
Hue.ban_ip_address = function (ip_address) {
  if (!ip_address) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("ban_ip_address", {ip_address: ip_address})
  })
}

// Unban an ip address globally
Hue.unban_ip_address = function (ip_address) {
  if (!ip_address) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("unban_ip_address", {ip_address: ip_address})
  })
}

// Get the user_id of a username
Hue.get_user_id_by_username = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("get_user_id_by_username", {username: username})
  })
}

// Get the username of a user_id
Hue.get_username_by_user_id = function (user_id) {
  if (!user_id) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("get_username_by_user_id", {user_id: user_id})
  })
}

// Get the ip address of a username
Hue.get_ip_address_by_username = function (username) {
  if (!username) {
    return
  }

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("get_ip_address_by_username", {username: username})
  })
}

// When user id is received
Hue.user_id_received = function (data) {
  Hue.checkmsg(`The user id of ${data.username} is ${data.user_id}`)
}

// When username is received
Hue.username_received = function (data) {
  Hue.checkmsg(`The username of ${data.user_id} is ${data.username}`)
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

  Hue.show_confirm("Run superuser command", function () {
    Hue.socket_emit("disconnect_user", {username: username})
  })
}