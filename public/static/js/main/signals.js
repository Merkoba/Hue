// Reloads the client
Hue.reload_client = function () {
  Hue.user_leaving = true
  window.location = window.location
}

// Reloads the client with a delay
Hue.delay_reload_client = function (delay) {
  setTimeout(function () {
    Hue.reload_client()
  }, delay)
}

// Reconnect asynchronously
Hue.refresh_client = function () {
  if (Hue.connecting || Hue.room_locked || Hue.socket.connected) {
    return false
  }

  Hue.connecting = true
  Hue.start_socket()
}

// Simple emit to check server response
Hue.ping_server = function () {
  Hue.socket_emit("ping_server", { date: Date.now() })
}

// Calculates how much time the pong response took to arrive
Hue.pong_received = function (data) {
  let nice_time = Hue.utilz.nice_time(Date.now(), data.date)
  Hue.feedback(`Pong: ${nice_time}`)
}

// Only for superusers
// Sends a system restart signal that tells all clients to refresh
Hue.send_system_restart_signal = function () {
  Hue.socket_emit("system_restart_signal", {})
}

// When the system suggests a refresh
Hue.system_restart_signal = function () {
  let item = Hue.make_info_popup_item({icon: "info", message: "Refresh is recommended"})
  Hue.show_popup(Hue.make_info_popup(), item)
}