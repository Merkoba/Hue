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
}