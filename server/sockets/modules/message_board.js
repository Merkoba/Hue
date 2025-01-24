module.exports = (App) => {
  // Handles message board posting
  App.handler.public.message_board_post = async (socket, data) => {
    if (!data.message) {
      return
    }

    if (data.message.length > App.config.max_message_board_post_length) {
      return
    }

    if (data.message.split(`\n`).length > App.config.max_num_newlines) {
      return
    }

    let linkdata

    // If it's an edit
    if (data.id) {
      let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

      for (let post of info.message_board_posts) {
        if (post.id === data.id) {
          if (post.user_id !== socket.hue.user_id) {
            return
          }

          if (!linkdata) {
            linkdata = await App.handler.process_message_links(data.message)
          }

          post.message = data.message
          post.link_title = linkdata.title
          post.link_description = linkdata.description
          post.link_image = linkdata.image
          post.link_url = linkdata.url
          info.modified = Date.now()
          App.handler.room_emit(socket, `edited_message_board_post`, post)
          return
        }
      }
    }

    if (!App.handler.is_admin_or_op(socket)) {
      let userinfo = await App.db_manager.get_user([`id`, socket.hue.user_id])

      let diff = Date.now() - userinfo.last_message_board_post_date
      let wait = App.sconfig.message_board_wait_delay * 60 * 1000

      if (diff < wait) {
        let remaining = wait - diff
        App.handler.user_emit(socket, `message_board_wait`, {remaining})
        return
      }
    }

    if (!linkdata) {
      linkdata = await App.handler.process_message_links(data.message)
    }

    data.link_title = linkdata.title,
    data.link_description = linkdata.description
    data.link_image = linkdata.image
    data.link_url = linkdata.url

    let item = App.handler.push_message_board_post(socket, data)
    App.handler.room_emit(socket, `new_message_board_post`, item)

    let userinfo = await App.db_manager.get_user([`id`, socket.hue.user_id])
    userinfo.last_message_board_post_date = Date.now()
  }

  // Pushes pushing room message board posts
  App.handler.push_message_board_post = (socket, data) => {
    let item = {
      user_id: socket.hue.user_id,
      username: socket.hue.username,
      message: data.message,
      link_title: data.link_title,
      link_description: data.link_description,
      link_image: data.link_image,
      link_url: data.link_url,
      date: Date.now(),
      id: App.handler.generate_message_board_post_id(),
    }

    App.db_manager.push_item(`rooms`, socket.hue.room_id, `message_board_posts`, item)
    return item
  }

  // Generates IDs for message board posts
  App.handler.generate_message_board_post_id = () => {
    return `${Date.now()}_${App.utilz.random_sequence(3)}`
  }

  // Check if a user can modify a message board post
  App.handler.check_message_board_modify = (socket, item, info) => {
    let current_role = info.keys[item.user_id] || App.vars.default_role

    if (item.user_id !== socket.hue.user_id) {
      if (!socket.hue.superuser) {
        if (current_role === `admin`) {
          return false
        }
        else if (current_role === `op`) {
          if (socket.hue.role !== `admin`) {
            return false
          }
        }
        else if (!App.handler.is_admin_or_op(socket)) {
          return false
        }
      }
    }

    return true
  }

  // Deletes a message board post
  App.handler.public.delete_message_board_post = async (socket, data) => {
    if (!data.id) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    for (let i = 0; i < info.message_board_posts.length; i++) {
      let item = info.message_board_posts[i]

      if (item.id === data.id) {
        if (!App.handler.check_message_board_modify(socket, item, info)) {
          App.handler.user_emit(socket, `forbidden_user`, {})
          return
        }

        info.message_board_posts.splice(i, 1)
        info.modified = Date.now()

        App.handler.room_emit(socket, `deleted_message_board_post`, {
          id: data.id,
        })

        if (item.user_id !== socket.hue.user_id) {
          App.handler.push_admin_log_message(socket, `deleted a message from the message board`)
        }

        return
      }
    }
  }

  // Bump a message board post
  App.handler.public.bump_message_board_post = async (socket, data) => {
    if (!data.id) {
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])

    for (let i = 0; i < info.message_board_posts.length; i++) {
      let item = info.message_board_posts[i]

      if (item.id === data.id) {
        if (!App.handler.check_message_board_modify(socket, item, info)) {
          App.handler.user_emit(socket, `forbidden_user`, {})
          return
        }

        let now = Date.now()
        item.date = now
        info.message_board_posts.splice(i, 1)
        info.message_board_posts.push(item)
        info.modified = now

        App.handler.room_emit(socket, `bumped_message_board_post`, {
          id: data.id,
        })

        if (item.user_id !== socket.hue.user_id) {
          App.handler.push_admin_log_message(socket, `bumped a message from the message board`)
        }

        return
      }
    }
  }

  // Remove all message board posts
  App.handler.public.clear_message_board = async (socket, data) => {
    if (!App.handler.is_admin(socket)) {
      App.handler.anti_spam_ban(socket)
      return
    }

    let info = await App.db_manager.get_room([`id`, socket.hue.room_id])
    info.message_board_posts = []

    App.handler.room_emit(socket, `message_board_cleared`, {
      username: socket.hue.username, user_id: socket.hue.user_id,
    })

    App.handler.push_admin_log_message(socket, `cleared the message board`)
  }
}