module.exports = function (manager, vars, config, sconfig, utilz, logger) {
  // Finds a user with the given query and fields to be fetched
  manager.get_user = function (query, fields, verified = true) {
    return new Promise((resolve, reject) => {
      if (Object.keys(fields).length > 0) {
        let has_zero = false

        for (let key in fields) {
          if (fields[key] === 0) {
            has_zero = true
            break
          }
        }

        if (!has_zero) {
          fields.version = 1
        }
      }

      manager.find_one("users", query, fields)

      .then(user => {
        if (user.version !== vars.users_version) {
          manager.user_fill_defaults(user)
          user.version = vars.users_version
        }
        
        resolve(user)
        return
      })   

      .catch(err => {
        reject(err)
        logger.log_error(err)
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
        { username: info.username, 
          email: info.email }, 
        { username: 1 }, false)

        .then((euser) => {
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

        .then((hash) => {
          let user = {}

          user = {
            username: info.username,
            password: hash,
            password_date: Date.now(),
            email: info.email,
            verified: false,
            verification_code: Date.now() + utilz.get_random_string(12),
            registration_date: Date.now(),
          }

          manager.user_fill_defaults(user)

          user.version = vars.users_version

          manager.insert_one("users", user)

          .then(result => {
            let link = `${config.site_root}verify?token=${result.id}_${result.verification_code}`

            let data = {
              from: `${config.delivery_email_name} <${config.delivery_email}>`,
              to: info.email,
              subject: "Account Verification",
              text: `Click the link to activate the account on ${config.site_root}. If you didn't register here, ignore this.\n\n${link}`,
            }

            vars.mailgun.messages().send(data, function (error, body) {
              if (error) {
                manager.delete_one(result.id)

                .catch(err => {
                  reject(err)
                  logger.log_error(err)
                  return
                })

                resolve("error")
                return
              } else {
                resolve("done")
                return
              }
            })
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

  // Checks if a user with a given email and password matches the stored password
  // This uses bcrypt to compare with the encrypted password version
  manager.check_password = function (email, password, fields = {}) {
    return new Promise((resolve, reject) => {
      Object.assign(fields, { password: 1 })

      manager
        .get_user({ email: email }, fields)

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

  // Changes the email
  // Sends a code verification email
  manager.change_email = function (id, email, verify_code = false) {
    return new Promise((resolve, reject) => {
      manager
        .get_user(
          { id: id },
          {
            email: 1,
            email_change_code: 1,
            email_change_date: 1,
            email_change_code_date: 1,
            email_change_email: 1,
          }
        )

        .then((user) => {
          if (!user) {
            resolve({ message: "error" })
            return
          } else {
            manager
              .get_user({ email: email }, { email: 1 })

              .then((user2) => {
                if (user2) {
                  resolve({ message: "duplicate" })
                  return
                } else {
                  if (verify_code) {
                    if (!user.email_change_code_date) {
                      resolve({ message: "not_sent" })
                      return
                    }

                    if (verify_code === user.email_change_code) {
                      if (
                        Date.now() - user.email_change_code_date <
                        config.email_change_expiration
                      ) {
                        manager
                          .update_user(id, {
                            email: user.email_change_email,
                            email_change_code_date: 0,
                          })

                          .catch(err => {
                            reject(err)
                            logger.log_error(err)
                            return
                          })

                        resolve({
                          message: "changed",
                          email: user.email_change_email,
                        })
                        return
                      } else {
                        resolve({ message: "expired_code" })
                        return false
                      }
                    } else {
                      resolve({ message: "wrong_code" })
                      return false
                    }
                  } else {
                    if (
                      Date.now() - user.email_change_date >
                      config.email_change_limit
                    ) {
                      let code = Date.now() + utilz.get_random_string(12)

                      let command = `${config.commands_prefix}verifyemail ${code}`

                      let data = {
                        from: `${config.delivery_email_name} <${config.delivery_email}>`,
                        to: email,
                        subject: "Confirm Email",
                        text: `Enter the command while connected to a room in ${config.site_root} to confirm your email.\n\n${command}`,
                      }

                      vars.mailgun
                        .messages()
                        .send(data, function (error, body) {
                          if (error) {
                            resolve({ message: "error" })
                            return
                          } else {
                            manager
                              .update_user(user.id, {
                                email_change_code: code,
                                email_change_date: Date.now(),
                                email_change_code_date: Date.now(),
                                email_change_email: email,
                              })

                              .catch(err => {
                                reject(err)
                                logger.log_error(err)
                                return
                              })

                            resolve({ message: "sent_code" })
                            return
                          }
                        })
                    } else {
                      resolve({ message: "wait" })
                      return
                    }
                  }
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

  // Initiates password reset
  // Sends a verification link email
  manager.reset_user_password = function (email) {
    return new Promise((resolve, reject) => {
      manager
        .get_user({ email: email }, { email: 1, password_reset_date: 1 })

        .then((user) => {
          if (user && user.email === email) {
            if (
              Date.now() - user.password_reset_date >
              config.password_reset_limit
            ) {
              let code = Date.now() + utilz.get_random_string(12)

              let link = `${
                config.site_root
              }change_password?token=${user.id}_${code}`

              let data = {
                from: `${config.delivery_email_name} <${config.delivery_email}>`,
                to: email,
                subject: "Password Reset",
                text: `Click the link to reset your password on ${config.site_root}.\n\n${link}`,
              }

              vars.mailgun.messages().send(data, function (error, body) {
                if (error) {
                  resolve("error")
                  return
                } else {
                  manager
                    .update_user(user.id, {
                      password_reset_code: code,
                      password_reset_date: Date.now(),
                      password_reset_link_date: Date.now(),
                    })

                    .catch(err => {
                      reject(err)
                      logger.log_error(err)
                      return
                    })

                  resolve("done")
                  return
                }
              })
            } else {
              resolve("limit")
              return
            }
          } else {
            resolve(false)
            return
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
