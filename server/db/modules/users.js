module.exports = function (manager, vars, db, config, sconfig, utilz, logger) {
  // Finds a user with the given query and fields to be fetched
  manager.get_user = function (query, fields, verified = true) {
    return new Promise((resolve, reject) => {
      let num_fields = Object.keys(fields).length

      let multiple = false

      if (num_fields > 0) {
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

      if (query._id !== undefined) {
        if (typeof query._id === "object") {
          if (query._id.$in !== undefined) {
            let ids = []

            for (let id of query._id.$in) {
              ids.push(new vars.mongo.ObjectId(id))
            }

            query._id.$in = ids

            multiple = true
          }
        } else if (typeof query._id === "string") {
          try {
            query._id = new vars.mongo.ObjectId(query._id)
          } catch (err) {
            resolve(false)
            return
          }
        }
      }

      let pfields = {}

      if (num_fields > 0) {
        pfields = { projection: fields }
      }

      if (query.verified === undefined) {
        if (verified) {
          query = { $and: [query, { verified: true }] }
        } else {
          query = {
            $and: [
              query,
              {
                $or: [
                  { verified: true },
                  {
                    registration_date: {
                      $gt: Date.now() - config.max_verification_time,
                    },
                  },
                ],
              },
            ],
          }
        }
      }

      if (multiple) {
        db.collection("users")
          .find(query, pfields)
          .toArray()

          .then((users) => {
            if (users.length === 0) {
              resolve([])
              return
            }

            let i = 0

            for (let user of users) {
              manager
                .on_user_found(user)

                .then(() => {
                  i += 1

                  if (i === users.length) {
                    resolve(users)
                    return
                  }
                })

                .catch((err) => {
                  reject(err)
                  logger.log_error(err)
                  return
                })
            }
          })

          .catch((err) => {
            reject(err)
            logger.log_error(err)
            return
          })
      } else {
        db.collection("users")
          .findOne(query, pfields)

          .then((user) => {
            manager
              .on_user_found(user)

              .then(() => {
                resolve(user)
                return
              })
          })

          .catch((err) => {
            reject(err)
            logger.log_error(err)
            return
          })
      }
    })
  }

  // Function to handle found users
  manager.on_user_found = function (user) {
    return new Promise((resolve, reject) => {
      if (user && user.version !== vars.users_version) {
        db.collection("users")
          .findOne({ _id: user._id }, {})

          .then((user) => {
            if (typeof user.username !== "string") {
              resolve(false)
              return
            }

            if (typeof user.password !== "string") {
              resolve(false)
              return
            }

            manager.user_fill_defaults(user)

            user.version = vars.users_version

            db.collection("users")
              .updateOne({ _id: user._id }, { $set: user })

              .then((ans) => {
                resolve(user)
                return
              })

              .catch((err) => {
                reject(err)
                logger.log_error(err)
                return
              })
          })

          .catch((err) => {
            reject(err)
            logger.log_error(err)
            return
          })
      } else {
        resolve(user)
      }
    })
  }

  // Fills undefined user properties
  // Or properties that don't meet the specified type
  manager.user_fill_defaults = function (user) {
    for (let key in vars.users_schema) {
      let item = vars.users_schema[key]

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
      manager
        .get_user(
          { $or: [{ username: info.username }, { email: info.email }] },
          { username: 1 },
          false
        )

        .then((euser) => {
          if (euser) {
            resolve("error")
            return
          }
        })

        .catch((err) => {
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

          db.collection("users")
            .insertOne(user)

            .then((result) => {
              let link = `${config.site_root}verify?token=${result.ops[0]._id}_${result.ops[0].verification_code}`

              let data = {
                from: `${config.delivery_email_name} <${config.delivery_email}>`,
                to: info.email,
                subject: "Account Verification",
                text: `Click the link to activate the account on ${config.site_root}. If you didn't register here, ignore this.\n\n${link}`,
              }

              vars.mailgun.messages().send(data, function (error, body) {
                if (error) {
                  db.collection("users")
                    .deleteOne({ _id: result.insertedId })

                    .catch((err) => {
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

            .catch((err) => {
              reject(err)
              logger.log_error(err)
              return
            })
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Updates the user
  manager.update_user = function (_id, fields) {
    return new Promise((resolve, reject) => {
      if (_id !== undefined) {
        if (typeof _id === "string") {
          try {
            _id = new vars.mongo.ObjectId(_id)
          } catch (err) {
            resolve(false)
            return
          }
        }
      }

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

            db.collection("users")
              .updateOne({ _id: _id }, { $set: fields })

              .then((ans) => {
                resolve(true)
                return
              })

              .catch((err) => {
                reject(err)
                logger.log_error(err)
                return
              })

            return
          })

          .catch((err) => {
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

        db.collection("users")
          .updateOne({ _id: _id }, { $set: fields })

          .then((ans) => {
            resolve(true)
            return
          })

          .catch((err) => {
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

              .catch((err) => {
                reject(err)
                logger.log_error(err)
                return
              })
          }
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Changes the username
  // Checks if the username contains a reserved username
  manager.change_username = function (_id, username) {
    return new Promise((resolve, reject) => {
      if (vars.reserved_usernames.includes(username.toLowerCase())) {
        resolve(false)
        return
      }

      manager
        .get_user({ _id: _id }, { username: 1 })

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
                    .update_user(_id, {
                      username: username,
                    })

                    .catch((err) => {
                      reject(err)
                      logger.log_error(err)
                      return
                    })

                  resolve(true)
                  return
                }
              })

              .catch((err) => {
                reject(err)
                logger.log_error(err)
                return
              })
          }
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Changes the email
  // Sends a code verification email
  manager.change_email = function (_id, email, verify_code = false) {
    return new Promise((resolve, reject) => {
      manager
        .get_user(
          { _id: _id },
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
                          .update_user(_id, {
                            email: user.email_change_email,
                            email_change_code_date: 0,
                          })

                          .catch((err) => {
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

                      let command = `/verifyemail ${code}`

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
                              .update_user(user._id, {
                                email_change_code: code,
                                email_change_date: Date.now(),
                                email_change_code_date: Date.now(),
                                email_change_email: email,
                              })

                              .catch((err) => {
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

              .catch((err) => {
                reject(err)
                logger.log_error(err)
                return
              })
          }
        })

        .catch((err) => {
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
              }change_password?token=${user._id.toString()}_${code}`

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
                    .update_user(user._id, {
                      password_reset_code: code,
                      password_reset_date: Date.now(),
                      password_reset_link_date: Date.now(),
                    })

                    .catch((err) => {
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

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Saves room to visited rooms
  manager.save_visited_room = function (user_id, room_id) {
    return new Promise((resolve, reject) => {
      manager
        .get_user({ _id: user_id }, { visited_rooms: 1 })

        .then((user) => {
          let visited = user.visited_rooms

          for (let i = 0; i < visited.length; i++) {
            let v = visited[i]

            if (v === room_id) {
              visited.splice(i, 1)
              break
            }
          }

          visited.unshift(room_id)

          if (visited.length > config.max_visited_rooms_items) {
            visited = visited.slice(0, config.max_visited_rooms_items)
          }

          manager
            .update_user(user_id, { visited_rooms: visited })

            .then((ans) => {
              resolve(ans)
              return
            })

            .catch((err) => {
              reject(err)
              logger.log_error(err)
              return
            })
        })

        .catch((err) => {
          reject(err)
          logger.log_error(err)
          return
        })
    })
  }

  // Checks fields types against the user schema types
  manager.validate_user = function (fields) {
    for (let key in fields) {
      let item = vars.users_schema[key]
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
