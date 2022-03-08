module.exports = function (Hue) {
  
  Hue.handler.start_anti_spam = function (data) {
    Hue.handler.anti_spam_users = {}
    Hue.handler.anti_spam_timeout()
  }

  // Starts a timeout to check spam on sockets
  Hue.handler.anti_spam_timeout = function () {
    setTimeout(function () {
      Hue.handler.anti_spam_timeout_action()
    }, Hue.sconfig.anti_spam_check_delay)
  }

  // What to do on each anti spam iteration
  Hue.handler.anti_spam_timeout_action = function () {
    for (let key in Hue.handler.anti_spam_users) {
      let user = Hue.handler.anti_spam_users[key]
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

    Hue.handler.anti_spam_timeout()
  }  

  // Add a spam point and check if user is banned
  Hue.handler.add_spam = async function (socket) {
    return new Promise((resolve, reject) => {
      let ip = Hue.handler.get_ip_address(socket)
      
      if (!Hue.handler.anti_spam_users[ip]) {
        Hue.handler.anti_spam_users[ip] = {
          level: 0,
          banned: false,
          banned_until: 0
        }
      }
  
      let user = Hue.handler.anti_spam_users[ip]

      if (user.banned) {
        Hue.handler.anti_spam_kick(socket)
        return resolve("already_banned")
      }

      user.level += 1
  
      if (user.level >= Hue.sconfig.anti_spam_max_limit) {
        Hue.handler.anti_spam_ban(socket)
      }

      return resolve("ok")
    })
  }

  // Kick a user
  Hue.handler.anti_spam_kick = function (socket) {
    socket.hue_kicked = true
    socket.hue_info1 = "the anti-spam system"
    Hue.handler.get_out(socket)
  }

  // Ban a user from connecting
  Hue.handler.anti_spam_ban = function (socket, minutes = Hue.sconfig.anti_spam_ban_duration) {
    let ip = Hue.handler.get_ip_address(socket)
    let user = Hue.handler.anti_spam_users[ip]
    
    if (!user) {
      return
    }

    user.banned = true
    user.banned_until = Date.now() + (minutes * 1000 * 60)
    Hue.logger.log_error(`IP banned: ${ip}`)
    Hue.handler.anti_spam_kick(socket)
  }

  // Get ip address
  Hue.handler.get_ip_address = function (socket) {
    return socket.client.request.headers['x-forwarded-for'] || socket.client.conn.remoteAddress
  }
}