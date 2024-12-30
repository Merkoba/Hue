// Reloads the client
App.reload_client = () => {
  App.user_leaving = true
  window.location = window.location
}

// Reconnect asynchronously
App.refresh_client = () => {
  if (App.connecting || App.room_locked || App.socket.connected) {
    return
  }

  App.connecting = true
  App.start_socket()
}

// Simple emit to check server response
App.ping_server = () => {
  App.socket_emit(`ping_server`, {date: Date.now()})
}

// Calculates how much time the pong response took to arrive
App.pong_received = (data) => {
  let nice_time = App.utilz.nice_time(Date.now(), data.date)
  App.checkmsg(`Pong: ${nice_time}`)
}

// Superuser signal that tells all clients to refresh
App.send_system_restart_signal = () => {
  App.show_confirm(`Run superuser command`, () => {
    App.socket_emit(`system_restart_signal`, {})
  })
}

// When the system suggests a refresh
App.system_restart_signal = () => {
  let item = App.make_info_popup_item({icon: `info`, message: `Refresh is recommended`})
  App.show_popup(App.make_info_popup(), item)
}