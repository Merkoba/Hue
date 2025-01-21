module.exports = (manager, stuff) => {
  // Finds a user with the given query
  manager.get_user = async (query) => {
    try {
      return await manager.find_one(`users`, query)
    }
    catch (err) {
      return false
    }
  }

  // Finds users with the given ids
  manager.get_users = async (ids) => {
    try {
      return await manager.find_multiple(`users`, ids)
    }
    catch (err) {
      return []
    }
  }

  // Creates a user
  manager.create_user = async (info) => {
    try {
      let euser = await manager.get_user([`username`, info.username])

      if (euser) {
        throw new Error(`Username already exists`)
      }

      let hash = await stuff.i.bcrypt.hash(info.password, stuff.sconfig.encryption_cost)

      let user = {
        username: info.username,
        password: hash,
        password_date: Date.now(),
        registration_date: Date.now(),
      }

      manager.fill_defaults(`users`, user)
      user.version = stuff.vars.users_version
      return await manager.insert_one(`users`, user)
    }
    catch (err) {
      stuff.logger.log_error(err)
      throw err
    }
  }

  // Changes the username
  manager.change_username = async (id, current_username, new_username) => {
    if (stuff.vars.reserved_usernames.includes(new_username.toLowerCase())) {
      return false
    }

    if (current_username === new_username) {
      return false
    }

    try {
      let user = await manager.get_user([`id`, id], {username: 1})

      if (!user) {
        return false
      }

      let dup = await manager.get_user([`username`, new_username])

      if (dup) {
        return false
      }

      user.username = new_username
      return true
    }
    catch (err) {
      stuff.logger.log_error(err)
      throw err
    }
  }

  // Dedicated function to change user password
  manager.change_user_password = async (id, password) => {
    try {
      let hash = await stuff.i.bcrypt.hash(password, stuff.sconfig.encryption_cost)
      let user = await manager.get_user([`id`, id])
      user.password = hash
      user.password_date = Date.now()
      return `ok`
    }
    catch (err) {
      stuff.logger.log_error(err)
      throw err
    }
  }

  // Checks if a user with a given username and password matches the stored password
  // This uses bcrypt to compare with the encrypted password version
  manager.check_password = async (username, password) => {
    try {
      let user = await manager.get_user([`username`, username])

      if (!user) {
        return {user: null, valid: false}
      }

      let valid = await stuff.i.bcrypt.compare(password, user.password)
      return {user, valid}
    }
    catch (err) {
      stuff.logger.log_error(err)
      throw err
    }
  }
}