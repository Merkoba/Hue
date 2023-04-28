// Reloads the client
Hue.reload_client = () => {
  Hue.user_leaving = true
  window.location = window.location
}

// Reconnect asynchronously
Hue.refresh_client = () => {
  if (Hue.connecting || Hue.room_locked || Hue.socket.connected) {
    return
  }

  Hue.connecting = true
  Hue.start_socket()
}

// Simple emit to check server response
Hue.ping_server = () => {
  Hue.socket_emit(`ping_server`, { date: Date.now() })
}

// Calculates how much time the pong response took to arrive
Hue.pong_received = (data) => {
  let nice_time = Hue.utilz.nice_time(Date.now(), data.date)
  Hue.checkmsg(`Pong: ${nice_time}`)
}

// Superuser signal that tells all clients to refresh
Hue.send_system_restart_signal = () => {
  Hue.show_confirm(`Run superuser command`, () => {
    Hue.socket_emit(`system_restart_signal`, {})
  })
}

// When the system suggests a refresh
Hue.system_restart_signal = () => {
  let item = Hue.make_info_popup_item({icon: `info`, message: `Refresh is recommended`})
  Hue.show_popup(Hue.make_info_popup(), item)
}