// Setups the message board
Hue.setup_message_board = function () {
  Hue.el("#message_board_textarea").addEventListener("input blur", function () {
    this.value = this.value.substring(0, Hue.config.max_message_board_post_length)
  })

  Hue.el("#message_board_container").addEventListener("click", function (e) {
    let post
    let username = ""
    let user_id = ""

    let el = e.target.closest(".message_board_post")

    if (!el) {
      return
    }

    post = e.target.closest(".message_board_post")
    username = Hue.dataset(post, "username")
    user_id = Hue.dataset(post, "user_id")

    el = e.target.closest(".message_board_delete")

    if (el) {
      Hue.delete_message_board_post(post)
      return
    }

    el = e.target.closest(".message_board_user_details")
    
    if (el) {
      Hue.show_profile(username, user_id)
      return
    }

    el = e.target.closest(".message_board_image")

    if (el) {
      Hue.view_image(el.src, username, user_id)
      return
    }

    el = e.target.closest(".message_board_link_image")

    if (el) {
      Hue.view_image(el.src, username, user_id)
      return
    }

    el = e.target.closest(".message_board_edit")

    if (el) {
      Hue.edit_message_board_post(post)
      return
    }

    el = e.target.closest(".message_board_edit_cancel")

    if (el) {
      Hue.do_message_board_edit(false)
      return
    }

    el = e.target.closest(".message_board_edit_done")

    if (el) {
      Hue.do_message_board_edit()
      return
    }
  })

  Hue.el("#message_board_publish").addEventListener("click", function () {
    Hue.submit_message_board_post()
  })

  Hue.el("#message_board_user").addEventListener("click", function () {
    Hue.show_message_board(`$user ${Hue.username} `)
  })

  Hue.el("#message_board_links").addEventListener("click", function () {
    Hue.show_message_board("$links ")
  })
}

// Do the message board edit
Hue.do_message_board_edit = function (send = true) {
  if (!Hue.editing_message_board) {
    return
  }

  let post = Hue.editing_message_board_post
  let content = Hue.el(".message_board_content", post)
  let edit_area = Hue.el(".message_board_edit_area", post)
  let btns = Hue.el(".message_board_buttons", post)
  let edit_btns = Hue.el(".message_board_edit_buttons", post)
  let text = Hue.el(".message_board_text", post)
  let id = Hue.dataset(post, "id")
  let message = edit_area.value.trim()
  
  content.style.display = "flex"
  edit_area.style.display = "none"
  btns.style.display = "flex"
  edit_btns.style.display = "none"
  Hue.editing_message_board = false

  if (send) {
    if (message.length > Hue.config.max_message_board_post_length) {
      return
    }

    if (message === text.textContent) {
      return
    }
  
    Hue.socket_emit("message_board_post", {id: id, message: message})
  }
}

// Creates and adds a post to the message board
Hue.add_post_to_message_board = function (data, edited) {
  let post

  if (edited) {
    for (let p of Hue.els(".message_board_post")) {
      let id = Hue.dataset(p, "id")

      if (id === data.id) {
        post = p
        break
      }
    }

    if (!post) {
      return
    }
  } else {
    post = Hue.div("message_board_post modal_item dynamic_title")
  }

  post.innerHTML = Hue.template_message_board_post()
  Hue.dataset(post, "id", data.id)
  Hue.dataset(post, "date", data.date)
  Hue.dataset(post, "username", data.username)
  Hue.dataset(post, "user_id", data.user_id)
  Hue.dataset(post, "original_message", data.message)

  let profilepic = Hue.el(".message_board_profilepic", post)
  
  profilepic.addEventListener("error", function () {
    Hue.fallback_profilepic(this)
  })

  profilepic.src = Hue.get_profilepic(data.user_id)

  let username = Hue.el(".message_board_username", post)
  username.textContent = data.username

  let date = Hue.el(".message_board_date", post)
  date.textContent = Hue.utilz.nice_date(data.date)

  let text = Hue.el(".message_board_text", post)
  text.innerHTML = Hue.parse_text(Hue.utilz.make_html_safe(data.message))
  Hue.urlize(text)

  let first_url = Hue.utilz.get_first_url(data.message)

  if (Hue.get_setting("embed_images")) {
    if (first_url && Hue.utilz.is_image(first_url)) {
      let image = Hue.el(".message_board_image", post)
      image.src = first_url
      image.style.display = "block" 
      image.addEventListener("error", function () {
        image.remove()
      })
    }

    if (data.link_image) {
      let link_image = Hue.el(".message_board_link_image", post)
      link_image.src = data.link_image
      link_image.style.display = "block"
      link_image.addEventListener("error", function () {
        link_image.remove()
      }) 
    }
  }

  if (data.link_title) {
    let link_title = Hue.el(".message_board_link_title", post)
    link_title.textContent = data.link_title
    link_title.style.display = "block" 
  }

  if (data.link_description) {
    let link_description = Hue.el(".message_board_link_description", post)
    link_description.textContent = data.link_description
    link_description.style.display = "block"
  }

  let gets = Hue.getcode(data.id)
  let title = `${gets} | ${Hue.utilz.nice_date(data.date)}`
  post.title = title
  Hue.dataset(post, "otitle", title)
  
  let content = Hue.el(".message_board_content", post)

  if (Hue.utilz.bingo(gets)) {
    content.classList.add("colortext")
    content.classList.add("goldtext")
  }

  let btns = Hue.el(".message_board_buttons", post)

  if (data.user_id === Hue.user_id) {
    btns.style.display = "flex"
  } else {
    Hue.el(".message_board_edit", post).style.display = "none"
  }

  if (!edited) {
    Hue.el("#message_board_container").prepend(post)
    let posts = Hue.els("#message_board_container .message_board_post")
  
    if (posts.length > Hue.config.max_message_board_posts) {
      posts.slice(-1)[0].remove()
    }
  }

  if (Hue.message_board_filtered) {
    Hue.do_modal_filter("message_board")
  }
}

// Fills the message board with init data
Hue.init_message_board = function (data) {
  if (data.message_board_posts.length > 0) {
    Hue.el("#message_board_container").innerHTML = ""
  }

  for (let post of data.message_board_posts) {
    Hue.add_post_to_message_board(post)
  }

  Hue.check_last_message_board_post()
  
  if (Hue.unread_message_board_count > 0) {
    Hue.fresh_unread_message_board_posts()
    Hue.show_message_board("$fresh ")
  }

  Hue.vertical_separator(Hue.el("#message_board_container"))
}

// Highlight unread message board posts
Hue.fresh_unread_message_board_posts = function () {
  for (let [i, el] of Hue.els(".message_board_post").entries()) {
    if (i < Hue.unread_message_board_count) {
      Hue.dataset(el, "fresh", true)
    } else {
      break
    }
  }
}

// Shows the message board
Hue.show_message_board = function (filter = "") {
  Hue.msg_message_board.show(function () {
    Hue.update_last_message_post_checked()
    Hue.check_last_message_board_post()

    if (filter.trim()) {
      Hue.el("#message_board_filter").value = filter
      Hue.do_modal_filter()
    } else {
      Hue.el("#message_board_textarea").focus()
    }
  })
}

// Submits a message board post
Hue.submit_message_board_post = function () {
  let message = Hue.utilz.remove_multiple_empty_lines(Hue.el("#message_board_textarea").value).trim()

  if (!message || message.length > Hue.config.max_message_board_post_length) {
    return false
  }

  Hue.el("#message_board_textarea").value = ""
  Hue.last_message_board_message = message
  Hue.socket_emit("message_board_post", { message: message })
}

// When a new message board message arrives
Hue.on_message_board_received = function (data, edited = false) {
  Hue.add_post_to_message_board(data, edited)
  Hue.check_last_message_board_post()

  if (data.user_id !== Hue.user_id && !Hue.msg_message_board.is_open()) {
    let func = function () { Hue.show_message_board() }
    let item = Hue.make_info_popup_item({icon: "pencil", message: "New message board post", on_click:func})
    Hue.show_popup(Hue.make_info_popup(func), item)
  }

  if (Hue.msg_message_board.is_open()) {
    Hue.update_last_message_post_checked()
  }

  Hue.vertical_separator(Hue.el("#message_board_container"))
}

// Checks if there are new message board posts
Hue.check_last_message_board_post = function () {
  let posts = Hue.els("#message_board_container .message_board_post")

  if (posts.length === 0) {
    Hue.el("#header_message_board_count").textContent = "(0)"
    return false
  }

  let date = Hue.room_state.last_message_board_post

  if (Hue.dataset(posts[0], "date") > date) {
    if (!Hue.msg_message_board.is_open()) {
      let count = 0

      let posts = Hue.els(".message_board_post")

      for (let post of posts) {
        if (Hue.dataset(post, "date") <= date) {
          break
        }
  
        count += 1
      }

      Hue.unread_message_board_count = count
      Hue.el("#header_message_board_count").textContent = `(${count})`
    } else {
      Hue.update_last_message_post_checked()
    }
  } else {
    Hue.unread_message_board_count = 0
    Hue.el("#header_message_board_count").textContent = "(0)"
  }
}

// Updates the message board date local storage
Hue.update_last_message_post_checked = function () {
  let post = Hue.el("#message_board_container .message_board_post")
  let date = Hue.dataset(post, "date")

  if (date !== Hue.room_state.last_message_board_post) {
    Hue.room_state.last_message_board_post = date
    Hue.save_room_state()
  }
}

// Remove a post from the message board window
Hue.deleted_message_board_post = function (data) {
  for (let post of Hue.els(".message_board_post")) {
    if (Hue.dataset(post, "id") === data.id) {
      post.remove()
      break
    }
  }

  Hue.vertical_separator(Hue.el("#message_board_container"))
  Hue.check_last_message_board_post()
}

// After message board filter
Hue.after_message_board_filtered = function () {
  Hue.vertical_separator(Hue.el("#message_board_container"))  
}

// Remove all message board posts
Hue.clear_message_board = function () {
  if (!Hue.is_admin()) {
    Hue.not_allowed()
    return false
  }

  Hue.show_confirm("Delete all message board posts", function () {
    Hue.socket_emit("clear_message_board", {})
  })
}

// On message board cleared
Hue.message_board_cleared = function (data) {
  Hue.el("#message_board_container").innerHTML = ""
  Hue.show_room_notification(data.username, `${data.username} cleared the message board`)
}

// Delete a message board post
Hue.delete_message_board_post = function (post) {
  let id = Hue.dataset(post, "id")
  let user_id = Hue.dataset(post, "user_id")
  let user = Hue.get_user_by_user_id(user_id)

  if (Hue.user_id !== user_id && !Hue.superuser) {
    if (user && Hue.is_admin(user)) {
      Hue.forbidden_user()
      return
    }
  }

  if (id) {
    Hue.show_confirm("Delete message from the message board", function () {
      Hue.socket_emit("delete_message_board_post", { id: id })
    })
  }
}

// Edit message board post
Hue.edit_message_board_post = function (post) {
  let content = Hue.el(".message_board_content", post)
  let edit_area = Hue.el(".message_board_edit_area", post)
  let btns = Hue.el(".message_board_buttons", post)
  let edit_btns = Hue.el(".message_board_edit_buttons", post)
  let text = Hue.dataset(post, "original_message")

  content.style.display = "none"
  
  edit_area.style.display = "block"
  edit_area.value = text
  edit_area.focus()
  edit_area.scrollIntoView({
    block: "center"
  })

  btns.style.display = "none"
  edit_btns.style.display = "flex"
  Hue.editing_message_board_post = post
  Hue.editing_message_board = true
}

// Show message board wait message
Hue.show_message_board_wait_message = function (remaining) {
  let c = Hue.utilz.time_components(remaining)
  Hue.checkmsg(`Need to wait ${c.minutes} minutes and ${c.seconds} seconds`)
  Hue.el("#message_board_textarea").value = Hue.last_message_board_message
}