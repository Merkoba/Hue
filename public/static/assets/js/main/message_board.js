// Setups the message board
Hue.setup_message_board = function () {
  Hue.el("#message_board_post_textarea").addEventListener("input blur", function () {
    this.value = this.value.substring(0, Hue.config.max_message_board_post_length)
  })

  Hue.el("#message_board_container").addEventListener("click", function (e) {
    let el = e.target.closest(".message_board_delete")

    if (el) {
      let item = el.closest(".message_board_item")
      let id = Hue.dataset(item, "id")

      if (id) {
        Hue.show_confirm("Delete Message", "Delete message from the message board", function () {
          Hue.socket_emit("delete_message_board_post", { id: id })
        })
      }
    }

    el = e.target.closest(".message_board_user_details")
    
    if (el) {
      let username = Hue.dataset(el, "username")
      let user_id = Hue.dataset(el, "user_id")
      Hue.show_profile(username, user_id)
    }
  })

  Hue.el("#message_board_publish").addEventListener("click", function () {
    Hue.submit_message_board_post()
  })
}

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function (post) {
  let item = Hue.div("message_board_item modal_item")
  item.innerHTML = Hue.template_message_board_post()
  Hue.dataset(item, "id", post.id)
  Hue.dataset(item, "date", post.date)

  let profilepic = Hue.el(".message_board_profilepic", item)
  
  profilepic.addEventListener("error", function () {
    if (this.src !== Hue.config.default_profilepic_url) {
      this.src = Hue.config.default_profilepic_url
    }
  })

  profilepic.src = Hue.get_profilepic(post.user_id)

  let user_details = Hue.el(".message_board_user_details", item)
  Hue.dataset(user_details, "username", post.username)
  Hue.dataset(user_details, "user_id", post.user_id)

  let username = Hue.el(".message_board_username", item)
  username.textContent = post.username

  let date = Hue.el(".message_board_date", item)
  date.textContent = Hue.utilz.nice_date(post.date)

  let text = Hue.el(".message_board_text", item)
  text.innerHTML = Hue.parse_text(Hue.utilz.make_html_safe(post.message))
  Hue.urlize(text)
  let title = Hue.utilz.nice_date(post.date)

  if (post.id) {
    title = `${post.id.slice(-3)} | ${title}`
  }

  text.title = title
  Hue.dataset(text, "date", post.date)
  Hue.dataset(text, "otitle", title)

  let delet = Hue.el(".message_board_delete", item)

  if (post.user_id === Hue.user_id) {
    delet.style.display = "inline-block"
  }

  Hue.el("#message_board_container").prepend(item)

  let items = Hue.els("#message_board_container .message_board_item")

  if (items.length > Hue.config.max_message_board_posts) {
    items.slice(-1)[0].remove()
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
    Hue.show_message_board()
  }

  Hue.vertical_separator(Hue.el("#message_board_container"))
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
      Hue.el("#message_board_post_textarea").focus()
    }
  })
}

// Submits a message board post
Hue.submit_message_board_post = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  let message = Hue.utilz.remove_multiple_empty_lines(Hue.el("#message_board_post_textarea").value).trim()

  if (!message || message.length > Hue.config.max_message_board_post_length) {
    return false
  }

  Hue.el("#message_board_post_textarea").value = ""
  Hue.socket_emit("message_board_post", { message: message })
}

// When a new message board message arrives
Hue.on_message_board_received = function (data) {
  Hue.add_post_to_message_board(data)
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
  let items = Hue.els("#message_board_container .message_board_item")

  if (items.length === 0) {
    Hue.el("#header_message_board_count").textContent = "(0)"
    return false
  }

  let date = Hue.room_state.last_message_board_post

  if (Hue.dataset(items[0], "date") > date) {
    if (!Hue.msg_message_board.is_open()) {
      let count = 0

      let items = Hue.els(".message_board_item")

      for (let item of items) {
        if (Hue.dataset(item, "date") <= date) {
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
  let item = Hue.el("#message_board_container .message_board_item")
  let date = Hue.dataset(item, "date")

  if (date !== Hue.room_state.last_message_board_post) {
    Hue.room_state.last_message_board_post = date
    Hue.save_room_state()
  }
}

// Checks if the user can delete posts in the message board
Hue.check_message_board_permissions = function () {
  if (Hue.is_admin_or_op()) {
    if (Hue.role === "admin") {
      Hue.el("#message_board_container").classList.add("message_board_container_admin")
    } else {
      Hue.el("#message_board_container").classList.remove("message_board_container_admin")
    }
    
    Hue.el("#message_board_input").style.display = "block"
  } else {
    Hue.el("#message_board_container").classList.remove("message_board_container_admin")
    Hue.el("#message_board_input").style.display = "none"
  }
}

// Remove a post from the message board window
Hue.deleted_message_board_post = function (data) {
  for (let item of Hue.els(".message_board_item")) {
    if (Hue.dataset(item, "id") === data.id) {
      item.remove()
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
  if (!Hue.is_admin_or_op()) {
    return false
  }

  Hue.show_confirm("Clear Message Board", "Delete all message board posts", function () {
    Hue.socket_emit("clear_message_board", {})
  })
}

// On message board cleared
Hue.message_board_cleared = function (data) {
  Hue.el("#message_board_container").innerHTML = ""
  Hue.show_room_notification(data.username, `${data.username} cleared the message board`)
}