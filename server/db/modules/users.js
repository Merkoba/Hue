module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Finds a user with the given query and fields to be fetched
  manager.get_user = function (query, fields) {
    return new Promise((resolve, reject) => {
      manager.find_one("users", query, fields)

      .then(user => {
        resolve(user)
      })

      .catch(err => {
        resolve(false)
      })
    })
  }

  // Finds users with the given ids and fields to be fetched
  manager.get_users = function (ids, fields) {
    return new Promise((resolve, reject) => {
      manager.find_multiple("users", ids, fields)

      .then(users => {
        resolve(users)
      })

      .catch(err => {
        resolve([])
      })
    })
  }

  // Creates a user
  manager.create_user = function (info) {
    return new Promise((resolve, reject) => {
      manager.get_user(
        ["username", info.username], { username: 1 })

      .then(euser => {
        if (euser) {
          resolve("error")
          return
        }
      })

      .catch(err => {
        reject(err)
        logger.log_error(err)
        return
      })

      vars.bcrypt
        .hash(info.password, sconfig.encryption_cost)

        .then(hash => {
          let user = {}

          user = {
            username: info.username,
            password: hash,
            password_date: Date.now(),
            registration_date: Date.now(),
          }

          manager.fill_defaults("users", user)
          user.version = vars.users_version
          manager.insert_one("users", user)

          .then(result => {
            resolve(result)
            return
          })

          .catch(err => {
            reject(err)
            logger.log_error(err)
            return
          })
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
        })
    })
  }

  // Updates the user
  manager.update_user = function (id, fields) {
    fields.modified = Date.now()

    let check = manager.validate_schema("users", fields)

    if (!check.passed) {
      console.error(check.message)
      return
    }

    manager.update_one("users", ["id", id], fields)
  }

  // Dedicated function to change user password
  manager.change_user_password = function (id, password) {
    return new Promise((resolve, reject) => {
      vars.bcrypt.hash(password, sconfig.encryption_cost)
      
      .then(hash => {
        manager.update_one("users", ["id", id], { password: hash, password_date: Date.now() })
        resolve("ok")
        return
      })

      .catch(err => {
        reject(err)
        logger.log_error(err)
        return
      })
    })
  }

  // Checks if a user with a given username and password matches the stored password
  // This uses bcrypt to compare with the encrypted password version
  manager.check_password = function (username, password, fields = {}) {
    return new Promise((resolve, reject) => {
      Object.assign(fields, { password: 1 })

      manager
        .get_user(["username", username], fields)

        .then((user) => {
          if (!user) {
            resolve({ user: null, valid: false })
          } else {
            vars.bcrypt
              .compare(password, user.password)

              .then((valid) => {
                resolve({ user: user, valid: valid })
                return
              })

              .catch(err => {
                reject(err)
                logger.log_error(err)
                return
              })
          }
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
        })
    })
  }

  // Changes the username
  manager.change_username = function (id, current_username, new_username) {
    return new Promise((resolve, reject) => {
      if (vars.reserved_usernames.includes(new_username.toLowerCase())) {
        resolve(false)
        return
      }
      
      if (current_username === new_username) {
        resolve(false)
        return
      }

      if (current_username.toLowerCase() === new_username.toLowerCase()) {
        manager.update_user(id, { username: new_username })
        resolve(true)
        return
      }

      manager
        .get_user(["id", id], { username: 1 })

        .then((user) => {
          if (!user) {
            resolve(false)
            return
          } else {
            manager
              .get_user(["username", new_username], { username: 1 })

              .then((user2) => {
                if (user2) {
                  resolve(false)
                  return
                } else {
                  manager.update_user(id, { username: new_username })
                  resolve(true)
                  return
                }
              })

              .catch(err => {
                reject(err)
                logger.log_error(err)
                return
              })
          }
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
        })
    })
  }
}