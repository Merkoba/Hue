module.exports = (manager, stuff) => {
  // Finds a user with the given query
  manager.get_user = (query) => {
    return new Promise((resolve, reject) => {
      manager.find_one(`users`, query)
        .then(user => {
          resolve(user)
        })
        .catch(err => {
          resolve(false)
        })
    })
  }

  // Finds users with the given ids
  manager.get_users = (ids) => {
    return new Promise((resolve, reject) => {
      manager.find_multiple(`users`, ids)
        .then(users => {
          resolve(users)
        })
        .catch(err => {
          resolve([])
        })
    })
  }

  // Creates a user
  manager.create_user = (info) => {
    return new Promise((resolve, reject) => {
      manager.get_user([`username`, info.username])
        .then(euser => {
          if (euser) {
            resolve(`error`)
            return
          }
        })
        .catch(err => {
          reject(err)
          stuff.logger.log_error(err)
          return
        })

      stuff.i.bcrypt
        .hash(info.password, stuff.sconfig.encryption_cost)
        .then(hash => {
          let user = {}

          user = {
            username: info.username,
            password: hash,
            password_date: Date.now(),
            registration_date: Date.now(),
          }

          manager.fill_defaults(`users`, user)
          user.version = stuff.vars.users_version
          manager.insert_one(`users`, user)
            .then(result => {
              resolve(result)
              return
            })
            .catch(err => {
              reject(err)
              stuff.logger.log_error(err)
              return
            })
        })
        .catch(err => {
          reject(err)
          stuff.logger.log_error(err)
        })
    })
  }

  // Changes the username
  manager.change_username = (id, current_username, new_username) => {
    return new Promise((resolve, reject) => {
      if (stuff.vars.reserved_usernames.includes(new_username.toLowerCase())) {
        resolve(false)
        return
      }

      if (current_username === new_username) {
        resolve(false)
        return
      }

      if (current_username.toLowerCase() === new_username.toLowerCase()) {
        manager.get_user([`username`, current_username])
          .then(the_user => {
            the_user.username = new_username
            resolve(true)
          })
          .catch(err => {
            reject(err)
            stuff.logger.log_error(err)
          })
      }

      manager
        .get_user([`id`, id], {username: 1})
        .then((user) => {
          if (!user) {
            resolve(false)
            return
          }
          
          manager
            .get_user([`username`, new_username])
            .then((user2) => {
              if (user2) {
                resolve(false)
                return
              }
                
              manager.get_user([`username`, current_username])
                .then(the_user => {
                  the_user.username = new_username
                  resolve(true)
                })
                .catch(err => {
                  reject(err)
                  stuff.logger.log_error(err)
                })
            })
            .catch(err => {
              reject(err)
              stuff.logger.log_error(err)
              return
            })
        })
        .catch(err => {
          reject(err)
          stuff.logger.log_error(err)
        })
    })
  }

  // Dedicated function to change user password
  manager.change_user_password = (id, password) => {
    return new Promise((resolve, reject) => {
      stuff.i.bcrypt.hash(password, stuff.sconfig.encryption_cost)
        .then(hash => {
          manager.get_user([`id`, id])
            .then(user => {
              user.password = hash
              user.password_date = Date.now()
              resolve(`ok`)
            })
            .catch(err => {
              reject(err)
              stuff.logger.log_error(err)
              return
            })
        })
        .catch(err => {
          reject(err)
          stuff.logger.log_error(err)
          return
        })
    })
  }

  // Checks if a user with a given username and password matches the stored password
  // This uses bcrypt to compare with the encrypted password version
  manager.check_password = (username, password) => {
    return new Promise((resolve, reject) => {
      manager
        .get_user([`username`, username])
        .then((user) => {
          if (!user) {
            resolve({user: null, valid: false})
          }
          else {
            stuff.i.bcrypt
              .compare(password, user.password)
              .then((valid) => {
                resolve({user, valid})
                return
              })
              .catch(err => {
                reject(err)
                stuff.logger.log_error(err)
                return
              })
          }
        })
        .catch(err => {
          reject(err)
          stuff.logger.log_error(err)
        })
    })
  }
}