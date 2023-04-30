// Setups the message board
App.setup_message_board = () => {
  let textarea = App.el(`#message_board_textarea`)

  App.ev(textarea, `input blur`, () => {
    textarea.value = textarea.value.substring(0, App.config.max_message_board_post_length)
  })

  App.ev(App.el(`#message_board_container`), `click`, (e) => {
    let post
    let username = ``
    let user_id = ``

    let el = e.target.closest(`.message_board_post`)

    if (!el) {
      return
    }

    post = e.target.closest(`.message_board_post`)
    username = App.dataset(post, `username`)
    user_id = App.dataset(post, `user_id`)

    el = e.target.closest(`.message_board_delete`)

    if (el) {
      App.delete_message_board_post(post)
      return
    }

    el = e.target.closest(`.message_board_user_details`)

    if (el) {
      App.show_profile(username, user_id)
      return
    }

    el = e.target.closest(`.message_board_image`)

    if (el) {
      App.view_image(el.src, username, user_id)
      return
    }

    el = e.target.closest(`.message_board_link_image`)

    if (el) {
      App.view_image(el.src, username, user_id)
      return
    }

    el = e.target.closest(`.message_board_edit`)

    if (el) {
      App.edit_message_board_post(post)
      return
    }

    el = e.target.closest(`.message_board_edit_cancel`)

    if (el) {
      App.do_message_board_edit(false)
      return
    }

    el = e.target.closest(`.message_board_edit_done`)

    if (el) {
      App.do_message_board_edit()
      return
    }
  })

  App.ev(App.el(`#message_board_post`), `click`, () => {
    App.submit_message_board_post()
  })

  App.ev(App.el(`#message_board_user`), `click`, () => {
    App.show_message_board(`$user ${App.username} `)
  })

  App.ev(App.el(`#message_board_links`), `click`, () => {
    App.show_message_board(`$links `)
  })
}

// Do the message board edit
App.do_message_board_edit = (send = true) => {
  if (!App.editing_message_board) {
    return
  }

  let post = App.editing_message_board_post
  let content = App.el(`.message_board_content`, post)
  let edit_area = App.el(`.message_board_edit_area`, post)
  let btns = App.el(`.message_board_buttons`, post)
  let edit_btns = App.el(`.message_board_edit_buttons`, post)
  let text = App.el(`.message_board_text`, post)
  let id = App.dataset(post, `id`)
  let message = edit_area.value.trim()

  content.style.display = `flex`
  edit_area.style.display = `none`
  btns.style.display = `flex`
  edit_btns.style.display = `none`
  App.editing_message_board = false

  if (send) {
    if (message.length > App.config.max_message_board_post_length) {
      return
    }

    if (message === text.textContent) {
      return
    }

    App.socket_emit(`message_board_post`, {id: id, message: message})
  }
}

// Creates and adds a post to the message board
App.add_post_to_message_board = (data, edited) => {
  let post

  if (edited) {
    for (let p of App.els(`.message_board_post`)) {
      let id = App.dataset(p, `id`)

      if (id === data.id) {
        post = p
        break
      }
    }

    if (!post) {
      return
    }
  }
  else {
    post = App.create(`div`, `message_board_post modal_item dynamic_title`)
  }

  post.innerHTML = App.template_message_board_post()
  App.dataset(post, `id`, data.id)
  App.dataset(post, `date`, data.date)
  App.dataset(post, `username`, data.username)
  App.dataset(post, `user_id`, data.user_id)
  App.dataset(post, `original_message`, data.message)

  let profilepic = App.el(`.message_board_profilepic`, post)

  App.ev(profilepic, `error`, () => {
    App.fallback_profilepic(profilepic)
  })

  profilepic.src = App.get_profilepic(data.user_id)

  let username = App.el(`.message_board_username`, post)
  username.textContent = data.username

  let date = App.el(`.message_board_date`, post)
  date.textContent = App.utilz.nice_date(data.date)

  let text = App.el(`.message_board_text`, post)
  text.innerHTML = App.parse_text(App.utilz.make_html_safe(data.message))
  App.urlize(text)

  let first_url = App.utilz.get_first_url(data.message)

  if (App.get_setting(`embed_images`)) {
    if (first_url && App.utilz.is_image(first_url)) {
      let image = App.el(`.message_board_image`, post)
      image.src = first_url
      image.style.display = `block`
      App.ev(image, `error`, () => {
        image.remove()
      })
    }

    if (data.link_image) {
      let link_image = App.el(`.message_board_link_image`, post)
      link_image.src = data.link_image
      link_image.style.display = `block`
      App.ev(link_image, `error`, () => {
        link_image.remove()
      })
    }
  }

  if (data.link_title) {
    let link_title = App.el(`.message_board_link_title`, post)
    link_title.textContent = data.link_title
    link_title.style.display = `block`
  }

  if (data.link_description) {
    let link_description = App.el(`.message_board_link_description`, post)
    link_description.textContent = data.link_description
    link_description.style.display = `block`
  }

  let gets = App.getcode(data.id)
  let title = `${gets} | ${App.utilz.nice_date(data.date)}`
  post.title = title
  App.dataset(post, `otitle`, title)

  let content = App.el(`.message_board_content`, post)

  if (App.utilz.bingo(gets)) {
    content.classList.add(`colortext`)
    content.classList.add(`goldtext`)
  }

  let btns = App.el(`.message_board_btns`, post)

  if (data.user_id === App.user_id) {
    btns.style.display = `flex`
  }
  else {
    App.el(`.message_board_edit`, btns).style.display = `none`
  }

  if (!edited) {
    App.el(`#message_board_container`).prepend(post)
    let posts = App.els(`#message_board_container .message_board_post`)

    if (posts.length > App.config.max_message_board_posts) {
      posts.slice(-1)[0].remove()
    }
  }

  if (App.message_board_filtered) {
    App.do_modal_filter(`message_board`)
  }
}

// Fills the message board with init data
App.init_message_board = (data) => {
  if (data.message_board_posts.length > 0) {
    App.el(`#message_board_container`).innerHTML = ``
  }

  for (let post of data.message_board_posts) {
    App.add_post_to_message_board(post)
  }

  App.check_last_message_board_post()

  if (App.unread_message_board_count > 0) {
    App.fresh_unread_message_board_posts()
    App.show_message_board(`$fresh `)
  }

  App.vertical_separator(App.el(`#message_board_container`))
}

// Highlight unread message board posts
App.fresh_unread_message_board_posts = () => {
  for (let [i, el] of App.els(`.message_board_post`).entries()) {
    if (i < App.unread_message_board_count) {
      App.dataset(el, `fresh`, true)
    }
    else {
      break
    }
  }
}

// Shows the message board
App.show_message_board = (filter = ``) => {
  App.msg_message_board.show()
  App.update_last_message_post_checked()
  App.check_last_message_board_post()

  if (filter.trim()) {
    App.el(`#message_board_filter`).value = filter
    App.do_modal_filter()
  }
  else {
    App.el(`#message_board_textarea`).focus()
  }
}

// Hide message board
App.hide_message_board = () => {
  App.msg_message_board.close()
}

// Submits a message board post
App.submit_message_board_post = () => {
  let message = App.utilz.remove_multiple_empty_lines(App.el(`#message_board_textarea`).value).trim()

  if (!message || message.length > App.config.max_message_board_post_length) {
    return
  }

  App.el(`#message_board_textarea`).value = ``
  App.last_message_board_message = message
  App.socket_emit(`message_board_post`, { message: message })
  App.el(`#message_board_filter`).value = ``
  App.do_modal_filter()
}

// When a new message board message arrives
App.on_message_board_received = (data, edited = false) => {
  App.add_post_to_message_board(data, edited)

  if (edited) {
    return
  }

  App.check_last_message_board_post()

  if (data.user_id !== App.user_id && !App.msg_message_board.is_open()) {
    let func = () => {
      App.show_message_board()
    }

    let item = App.make_info_popup_item({icon: `pencil`, message: `New message board post`, on_click: func})
    App.show_popup(App.make_info_popup(func), item)
  }

  if (App.msg_message_board.is_open()) {
    App.update_last_message_post_checked()
  }

  App.vertical_separator(App.el(`#message_board_container`))
}

// Checks if there are new message board posts
App.check_last_message_board_post = () => {
  let posts = App.els(`#message_board_container .message_board_post`)

  if (posts.length === 0) {
    App.el(`#header_message_board_count`).textContent = `(0)`
    return
  }

  let date = App.room_state.last_message_board_post

  if (App.dataset(posts[0], `date`) > date) {
    if (!App.msg_message_board.is_open()) {
      let count = 0

      let posts = App.els(`.message_board_post`)

      for (let post of posts) {
        if (App.dataset(post, `date`) <= date) {
          break
        }

        count += 1
      }

      App.unread_message_board_count = count
      App.el(`#header_message_board_count`).textContent = `(${count})`
    }
    else {
      App.update_last_message_post_checked()
    }
  }
  else {
    App.unread_message_board_count = 0
    App.el(`#header_message_board_count`).textContent = `(0)`
  }
}

// Updates the message board date local storage
App.update_last_message_post_checked = () => {
  let post = App.el(`#message_board_container .message_board_post`)
  let date = App.dataset(post, `date`)

  if (date !== App.room_state.last_message_board_post) {
    App.room_state.last_message_board_post = date
    App.save_room_state()
  }
}

// Remove a post from the message board window
App.deleted_message_board_post = (data) => {
  for (let post of App.els(`.message_board_post`)) {
    if (App.dataset(post, `id`) === data.id) {
      post.remove()
      break
    }
  }

  App.vertical_separator(App.el(`#message_board_container`))
  App.check_last_message_board_post()
}

// After message board filter
App.after_message_board_filtered = () => {
  App.vertical_separator(App.el(`#message_board_container`))
}

// Remove all message board posts
App.clear_message_board = () => {
  if (!App.is_admin()) {
    App.not_allowed()
    return
  }

  App.show_confirm(`Delete all message board posts`, () => {
    App.socket_emit(`clear_message_board`, {})
  })
}

// On message board cleared
App.message_board_cleared = (data) => {
  App.el(`#message_board_container`).innerHTML = ``
  App.show_room_notification(data.username, `${data.username} cleared the message board`)
}

// Delete a message board post
App.delete_message_board_post = (post) => {
  let id = App.dataset(post, `id`)
  let user_id = App.dataset(post, `user_id`)
  let user = App.get_user_by_user_id(user_id)

  if (App.user_id !== user_id && !App.superuser) {
    if (user && App.is_admin(user)) {
      App.forbidden_user()
      return
    }
  }

  if (id) {
    App.show_confirm(`Delete message from the message board`, () => {
      App.socket_emit(`delete_message_board_post`, { id: id })
    })
  }
}

// Edit message board post
App.edit_message_board_post = (post) => {
  let content = App.el(`.message_board_content`, post)
  let edit_area = App.el(`.message_board_edit_area`, post)
  let btns = App.el(`.message_board_buttons`, post)
  let edit_btns = App.el(`.message_board_edit_buttons`, post)
  let text = App.dataset(post, `original_message`)

  content.style.display = `none`

  edit_area.style.display = `block`
  edit_area.value = text
  edit_area.focus()
  edit_area.scrollIntoView({
    block: `center`
  })

  btns.style.display = `none`
  edit_btns.style.display = `flex`
  App.editing_message_board_post = post
  App.editing_message_board = true
}

// Show message board wait message
App.show_message_board_wait_message = (remaining) => {
  let c = App.utilz.time_components(remaining)
  App.checkmsg(`Need to wait ${c.minutes} minutes and ${c.seconds} seconds`)
  App.el(`#message_board_textarea`).value = App.last_message_board_message
}

// Setup message board permissions
App.setup_message_board_permissions = () => {
  let container = App.el(`#message_board_container`)

  if (App.is_admin_or_op()) {
    container.classList.add(`message_board_admin`)
  }
  else {
    container.classList.remove(`message_board_admin`)
  }
}