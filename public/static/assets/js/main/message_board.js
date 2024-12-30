// Setups the message board
App.setup_message_board = () => {
  let textarea = DOM.el(`#message_board_textarea`)

  DOM.ev(textarea, `input blur`, () => {
    textarea.value = textarea.value.substring(0, App.config.max_message_board_post_length)
  })

  DOM.ev(DOM.el(`#message_board_container`), `click`, (e) => {
    let post
    let username = ``
    let user_id = ``

    let el = e.target.closest(`.message_board_post`)

    if (!el) {
      return
    }

    post = e.target.closest(`.message_board_post`)
    username = DOM.dataset(post, `username`)
    user_id = DOM.dataset(post, `user_id`)

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

    el = e.target.closest(`.message_board_bump`)

    if (el) {
      App.show_confirm(`Bump post to the top?`, () => {
        App.bump_message_board_post(post)
      })
    }
  })

  DOM.ev(DOM.el(`#message_board_post`), `click`, () => {
    App.submit_message_board_post()
  })

  DOM.ev(DOM.el(`#message_board_user`), `click`, () => {
    App.show_message_board(`$user ${App.username} `)
  })

  DOM.ev(DOM.el(`#message_board_links`), `click`, () => {
    App.show_message_board(`$links `)
  })
}

// Do the message board edit
App.do_message_board_edit = (send = true) => {
  if (!App.editing_message_board) {
    return
  }

  let post = App.editing_message_board_post
  let content = DOM.el(`.message_board_content`, post)
  let edit_area = DOM.el(`.message_board_edit_area`, post)
  let btns = DOM.el(`.message_board_buttons`, post)
  let edit_btns = DOM.el(`.message_board_edit_buttons`, post)
  let text = DOM.el(`.message_board_text`, post)
  let id = DOM.dataset(post, `id`)
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

    App.socket_emit(`message_board_post`, {id, message})
  }
}

// Creates and adds a post to the message board
App.add_post_to_message_board = (data, edited) => {
  let post

  if (edited) {
    for (let p of DOM.els(`.message_board_post`)) {
      let id = DOM.dataset(p, `id`)

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
    post = DOM.create(`div`, `message_board_post modal_item`)
  }

  post.innerHTML = App.template_message_board_post()
  DOM.dataset(post, `id`, data.id)
  DOM.dataset(post, `date`, data.date)
  DOM.dataset(post, `username`, data.username)
  DOM.dataset(post, `user_id`, data.user_id)
  DOM.dataset(post, `original_message`, data.message)

  let profilepic = DOM.el(`.message_board_profilepic`, post)

  DOM.ev(profilepic, `error`, () => {
    App.fallback_profilepic(profilepic)
  })

  profilepic.src = App.get_profilepic(data.user_id)

  let username = DOM.el(`.message_board_username`, post)
  username.textContent = data.username

  let date = DOM.el(`.message_board_date`, post)
  date.textContent = App.format_date(data.date)

  let text = DOM.el(`.message_board_text`, post)
  text.innerHTML = App.parse_text(App.utilz.make_html_safe(data.message))
  App.urlize(text)

  let first_url = App.utilz.get_first_url(data.message)

  if (App.get_setting(`embed_images`)) {
    if (first_url && App.utilz.is_image(first_url)) {
      let image = DOM.el(`.message_board_image`, post)
      image.src = first_url
      image.style.display = `block`
      DOM.ev(image, `error`, () => {
        image.remove()
      })
    }

    if (data.link_image) {
      let link_image = DOM.el(`.message_board_link_image`, post)
      link_image.src = data.link_image
      link_image.style.display = `block`
      DOM.ev(link_image, `error`, () => {
        link_image.remove()
      })
    }
  }

  if (data.link_title) {
    let link_title = DOM.el(`.message_board_link_title`, post)
    link_title.textContent = data.link_title
    link_title.style.display = `block`
  }

  if (data.link_description) {
    let link_description = DOM.el(`.message_board_link_description`, post)
    link_description.textContent = data.link_description
    link_description.style.display = `block`
  }

  let gets = App.getcode(data.id)
  post.title = `${gets} | ${App.utilz.nice_date(data.date)}`
  let content = DOM.el(`.message_board_content`, post)

  if (App.utilz.bingo(gets)) {
    content.classList.add(`colortext`)
    content.classList.add(`goldtext`)
  }

  let btns = DOM.el(`.message_board_btns`, post)

  if (data.user_id === App.user_id) {
    btns.style.display = `flex`
  }
  else {
    DOM.el(`.message_board_edit`, btns).style.display = `none`
  }

  if (!edited) {
    DOM.el(`#message_board_container`).prepend(post)
    let posts = DOM.els(`#message_board_container .message_board_post`)

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
    DOM.el(`#message_board_container`).innerHTML = ``
  }

  for (let post of data.message_board_posts) {
    App.add_post_to_message_board(post)
  }

  App.check_last_message_board_post()

  if (App.unread_message_board_count > 0) {
    if (!App.is_first_time) {
      App.fresh_unread_message_board_posts()
      App.show_message_board(`$fresh `)
    }
  }

  App.message_board_separate()
}

// Highlight unread message board posts
App.fresh_unread_message_board_posts = () => {
  for (let [i, el] of DOM.els(`.message_board_post`).entries()) {
    if (i < App.unread_message_board_count) {
      DOM.dataset(el, `fresh`, true)
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
  App.update_date_message_board()
  App.message_board_separate()

  if (filter.trim()) {
    DOM.el(`#message_board_filter`).value = filter
    App.do_modal_filter()
  }
  else {
    DOM.el(`#message_board_textarea`).focus()
  }
}

// Hide message board
App.hide_message_board = () => {
  App.msg_message_board.close()
}

// Submits a message board post
App.submit_message_board_post = () => {
  let message = App.utilz.remove_multiple_empty_lines(DOM.el(`#message_board_textarea`).value).trim()

  if (!message || message.length > App.config.max_message_board_post_length) {
    return
  }

  DOM.el(`#message_board_textarea`).value = ``
  App.last_message_board_message = message
  App.socket_emit(`message_board_post`, {message})
  DOM.el(`#message_board_filter`).value = ``
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

  App.message_board_separate()
}

// Separate message board posts
App.message_board_separate = () => {
  if (App.msg_message_board.is_open()) {
    App.vertical_separator(DOM.el(`#message_board_container`))
  }
}

// Checks if there are new message board posts
App.check_last_message_board_post = () => {
  let posts = DOM.els(`#message_board_container .message_board_post`)

  if (posts.length === 0) {
    DOM.el(`#header_message_board_count`).textContent = `(0)`
    return
  }

  let date = App.room_state.last_message_board_post

  if (DOM.dataset(posts[0], `date`) > date) {
    if (!App.msg_message_board.is_open()) {
      let count = 0

      let posts = DOM.els(`.message_board_post`)

      for (let post of posts) {
        if (DOM.dataset(post, `date`) <= date) {
          break
        }

        count += 1
      }

      App.unread_message_board_count = count
      DOM.el(`#header_message_board_count`).textContent = `(${count})`
    }
    else {
      App.update_last_message_post_checked()
    }
  }
  else {
    App.unread_message_board_count = 0
    DOM.el(`#header_message_board_count`).textContent = `(0)`
  }
}

// Updates the message board date local storage
App.update_last_message_post_checked = () => {
  let post = DOM.el(`#message_board_container .message_board_post`)
  let date = DOM.dataset(post, `date`)

  if (date !== App.room_state.last_message_board_post) {
    App.room_state.last_message_board_post = date
    App.save_room_state()
  }
}

// Remove a post from the message board window
App.deleted_message_board_post = (data) => {
  for (let post of DOM.els(`.message_board_post`)) {
    if (DOM.dataset(post, `id`) === data.id) {
      post.remove()
      break
    }
  }

  App.message_board_separate()
  App.check_last_message_board_post()
}

// Put the bumped post at the top
App.bumped_message_board_post = (data) => {
  for (let post of DOM.els(`.message_board_post`)) {
    if (DOM.dataset(post, `id`) === data.id) {
      post.remove()
      DOM.el(`#message_board_container`).prepend(post)

      let now = Date.now()
      let date = DOM.el(`.message_board_date`, post)
      date.textContent = App.format_date(now)
      DOM.dataset(post, `date`, now)
      break
    }
  }

  App.message_board_separate()
  App.check_last_message_board_post()
  App.message_board_top()
}

// Scroll to the top of the message board
App.message_board_top = () => {
  App.msg_message_board.content_container.scrollTop = 0
}

// After message board filter
App.after_message_board_filtered = () => {
  App.message_board_separate()
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
  DOM.el(`#message_board_container`).innerHTML = ``
  App.show_room_notification(data.username, `${data.username} cleared the message board`)
}

// Delete a message board post
App.delete_message_board_post = (post) => {
  let id = DOM.dataset(post, `id`)
  let user_id = DOM.dataset(post, `user_id`)
  let user = App.get_user_by_user_id(user_id)

  if ((App.user_id !== user_id) && !App.superuser) {
    if (user && App.is_admin(user)) {
      App.forbidden_user()
      return
    }
  }

  if (id) {
    App.show_confirm(`Delete message from the message board`, () => {
      App.socket_emit(`delete_message_board_post`, {id})
    })
  }
}

// Edit message board post
App.edit_message_board_post = (post) => {
  let content = DOM.el(`.message_board_content`, post)
  let edit_area = DOM.el(`.message_board_edit_area`, post)
  let btns = DOM.el(`.message_board_buttons`, post)
  let edit_btns = DOM.el(`.message_board_edit_buttons`, post)
  let text = DOM.dataset(post, `original_message`)

  content.style.display = `none`

  edit_area.style.display = `block`
  edit_area.value = text
  edit_area.focus()

  edit_area.scrollIntoView({
    block: `center`,
  })

  btns.style.display = `none`
  edit_btns.style.display = `flex`
  App.editing_message_board_post = post
  App.editing_message_board = true
}

// Bump message board post to make it the first post again
App.bump_message_board_post = (post) => {
  let id = DOM.dataset(post, `id`)
  let user_id = DOM.dataset(post, `user_id`)
  let user = App.get_user_by_user_id(user_id)

  if ((App.user_id !== user_id) && !App.superuser) {
    if (user && App.is_admin(user)) {
      App.forbidden_user()
      return
    }
  }

  if (id) {
    App.socket_emit(`bump_message_board_post`, {id})
  }
}

// Show message board wait message
App.show_message_board_wait_message = (remaining) => {
  let c = App.utilz.time_components(remaining)
  App.checkmsg(`Need to wait ${c.minutes} minutes and ${c.seconds} seconds`)
  DOM.el(`#message_board_textarea`).value = App.last_message_board_message
}

// Setup message board permissions
App.setup_message_board_permissions = () => {
  let container = DOM.el(`#message_board_container`)

  if (App.is_admin_or_op()) {
    container.classList.add(`message_board_admin`)
  }
  else {
    container.classList.remove(`message_board_admin`)
  }
}