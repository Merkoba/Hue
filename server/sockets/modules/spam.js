module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  
  handler.start_anti_spam = function (data) {
    handler.anti_spam_users = {}
    handler.anti_spam_timeout()
  }

  // Starts a timeout to check spam on sockets
  handler.anti_spam_timeout = function () {
    setTimeout(function () {
      handler.files_timeout_action()
    }, sconfig.anti_spam_check_delay)
  }

  // What to do on each anti spam iteration
  handler.files_timeout_action = function () {
    for (let key in handler.anti_spam_users) {
      let user = handler.anti_spam_users[key]
      if (user.banned) {
        if (Date.now() > user.banned_until) {
          user.banned = false
          user.banned_until = 0
          user.level = 0
        }
      } else {
        if (user.level > 0) {
          user.level -= 1
        }
      }
    }

    handler.anti_spam_timeout()
  }  

  // Add a spam point and check if user is banned
  handler.add_spam = async function (socket) {
    return new Promise((resolve, reject) => {
      let ip = handler.get_ip_address(socket)
      
      if (!handler.anti_spam_users[ip]) {
        handler.anti_spam_users[ip] = {
          level: 0,
          banned: false,
          banned_until: 0
        }
      }
  
      let user = handler.anti_spam_users[ip]

      if (user.banned) {
        handler.anti_spam_kick(socket)
        return resolve("already_banned")
      }

      user.level += 1
  
      if (user.level >= sconfig.anti_spam_max_limit) {
        handler.anti_spam_ban(socket)
      }

      return resolve("ok")
    })
  }

  // Kick a user
  handler.anti_spam_kick = function (socket) {
    socket.hue_kicked = true
    socket.hue_info1 = "the anti-spam system"
    handler.get_out(socket)
  }

  // Ban a user from connecting
  handler.anti_spam_ban = function (socket, minutes = sconfig.anti_spam_ban_duration) {
    let ip = handler.get_ip_address(socket)
    let user = handler.anti_spam_users[ip]
    
    if (!user) {
      return
    }

    user.banned = true
    user.banned_until = Date.now() + (minutes * 1000 * 60)
    logger.log_error(`IP banned: ${ip}`)
    handler.anti_spam_kick(socket)
  }

  // Get ip address
  handler.get_ip_address = function (socket) {
    return socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress
  }
}