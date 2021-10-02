module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Finds a user with the given query and fields to be fetched
  manager.get_user = function (query, fields) {
    return new Promise((resolve, reject) => {
      manager.find_one("users", query, fields)

      .then(user => {
        manager.user_fill_defaults(user)
        user.version = vars.users_version
        resolve(user)
        return
      })   

      .catch(err => {
        resolve(false)
        return
      })
    })
  }

  // Finds users with the given query and fields to be fetched
  manager.get_users = function (ids, fields) {
    return new Promise((resolve, reject) => {
      manager.find_multiple("users", ids, fields)

      .then(users => {
        for (let user of users) {
          manager.user_fill_defaults(user)
          user.version = vars.users_version
        }
        
        resolve(users)
        return
      })   

      .catch(err => {
        resolve([])
        return
      })
    })
  }  

  // Fills undefined user properties
  // Or properties that don't meet the specified type
  manager.user_fill_defaults = function (user) {
    let schema = vars.users_schema()

    for (let key in schema) {
      let item = schema[key]

      if (item.skip) {
        continue
      }

      if (typeof user[key] !== item.type) {
        user[key] = item.default
      }
    }
  }

  // Creates a user
  manager.create_user = function (info) {
    return new Promise((resolve, reject) => {
      manager.get_user(
      { username: info.username }, { username: 1 })

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
        .hash(info.password, config.encryption_cost)

        .then(hash => {
          let user = {}

          user = {
            username: info.username,
            password: hash,
            password_date: Date.now(),
            registration_date: Date.now(),
          }

          manager.user_fill_defaults(user)
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
          return
        })
    })
  }

  // Updates the user
  manager.update_user = function (id, fields) {
    return new Promise((resolve, reject) => {
      fields.modified = Date.now()

      if (fields.password !== undefined) {
        vars.bcrypt
          .hash(fields.password, config.encryption_cost)

          .then((hash) => {
            fields.password = hash

            let check = manager.validate_user(fields)

            if (!check.passed) {
              console.error(check.message)
              resolve(false)
              return
            }

            manager.update_one("users", { id: id }, fields)

            .then(ans => {
              resolve(true)
              return
            })

            .catch(err => {
              reject(err)
              logger.log_error(err)
              return
            })

            return
          })

          .catch(err => {
            reject(err)
            logger.log_error(err)
            return
          })
      } else {
        let check = manager.validate_user(fields)

        if (!check.passed) {
          console.error(check.message)
          resolve(false)
          return
        }

        manager.update_one("users", { id: id }, fields)

        .then(ans => {
          resolve(true)
          return
        })

        .catch(err => {
          reject(err)
          logger.log_error(err)
          return
        })

        return
      }
    })
  }

  // Checks if a user with a given username and password matches the stored password
  // This uses bcrypt to compare with the encrypted password version
  manager.check_password = function (username, password, fields = {}) {
    return new Promise((resolve, reject) => {
      Object.assign(fields, { password: 1 })

      manager
        .get_user({ username: username }, fields)

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
          return
        })
    })
  }

  // Changes the username
  // Checks if the username contains a reserved username
  manager.change_username = function (id, username) {
    return new Promise((resolve, reject) => {
      if (vars.reserved_usernames.includes(username.toLowerCase())) {
        resolve(false)
        return
      }

      manager
        .get_user({ id: id }, { username: 1 })

        .then((user) => {
          if (!user) {
            resolve(false)
            return
          } else {
            manager
              .get_user({ username: username }, { username: 1 })

              .then((user2) => {
                if (user2) {
                  resolve(false)
                  return
                } else {
                  manager
                    .update_user(id, {
                      username: username,
                    })

                    .catch(err => {
                      reject(err)
                      logger.log_error(err)
                      return
                    })

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
          return
        })
    })
  }

  // Checks fields types against the user schema types
  manager.validate_user = function (fields) {
    let schema = vars.users_schema()
    
    for (let key in fields) {
      let item = schema[key]
      let data = fields[key]

      if (item) {
        let type = typeof data

        if (type !== item.type) {
          let s = `User validation failed on ${key}. Expected type ${item.type}, got type ${type}`
          return { passed: false, message: s }
        }
      }
    }

    return { passed: true, message: "ok" }
  }
}