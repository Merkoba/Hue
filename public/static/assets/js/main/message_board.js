// Setups the message board
Hue.setup_message_board = function () {
  Hue.el("#message_board_textarea").addEventListener("input blur", function () {
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

      return
    }

    el = e.target.closest(".message_board_user_details")
    
    if (el) {
      let username = Hue.dataset(el, "username")
      let user_id = Hue.dataset(el, "user_id")
      Hue.show_profile(username, user_id)

      return
    }

    el = e.target.closest(".message_board_image")

    if (el) {
      Hue.expand_image(el.src)
      return
    }

    el = e.target.closest(".message_board_link_image")

    if (el) {
      Hue.expand_image(el.src)
      return
    }

    el = e.target.closest(".message_board_edit")

    if (el) {
      if (Hue.editing_message_board_post) {
        Hue.do_message_board_edit(false)
      }

      let item = el.closest(".message_board_item")
      let content = Hue.el(".message_board_content", item)
      let edit_area = Hue.el(".message_board_edit_area", item)
      let btns = Hue.el(".message_board_buttons", item)
      let edit_btns = Hue.el(".message_board_edit_buttons", item)
      let text = Hue.el(".message_board_text", item)

      content.style.display = "none"
      
      edit_area.style.display = "block"
      edit_area.value = text.textContent
      edit_area.focus()
      edit_area.scrollIntoView({
        block: "center"
      })

      btns.style.display = "none"
      edit_btns.style.display = "flex"
      Hue.editing_message_board_post_item = item
      Hue.editing_message_board_post = true

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
}

// Do the message board edit
Hue.do_message_board_edit = function (send = true) {
  let item = Hue.editing_message_board_post_item
  let content = Hue.el(".message_board_content", item)
  let edit_area = Hue.el(".message_board_edit_area", item)
  let btns = Hue.el(".message_board_buttons", item)
  let edit_btns = Hue.el(".message_board_edit_buttons", item)
  let text = Hue.el(".message_board_text", item)
  let id = Hue.dataset(item, "id")
  let message = edit_area.value.trim()
  
  content.style.display = "flex"
  edit_area.style.display = "none"
  btns.style.display = "flex"
  edit_btns.style.display = "none"
  Hue.editing_message_board_post = false

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

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function (post, edited) {
  let item

  if (edited) {
    for (let p of Hue.els(".message_board_item")) {
      let id = Hue.dataset(p, "id")

      if (id === post.id) {
        item = p
        break
      }
    }

    if (!item) {
      return
    }
  } else {
    item = Hue.div("message_board_item modal_item")
  }

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

  let first_url = Hue.utilz.get_first_url(post.message)

  if (Hue.settings.embed_images) {
    if (first_url && Hue.utilz.is_image(first_url)) {
      let image = Hue.el(".message_board_image", item)
      image.src = first_url
      image.style.display = "block" 
    }

    if (post.link_image) {
      let link_image = Hue.el(".message_board_link_image", item)
      link_image.src = post.link_image
      link_image.style.display = "block" 
    }
  }

  if (post.link_title) {
    let link_title = Hue.el(".message_board_link_title", item)
    link_title.textContent = post.link_title
    link_title.style.display = "block" 
  }

  if (post.link_description) {
    let link_description = Hue.el(".message_board_link_description", item)
    link_description.textContent = post.link_description
    link_description.style.display = "block"
  }

  let gets = Hue.getcode(post.id)
  let title = `${gets} | ${Hue.utilz.nice_date(post.date)}`

  let content = Hue.el(".message_board_content", item)
  content.title = title
  Hue.dataset(content, "date", post.date)
  Hue.dataset(content, "otitle", title)

  if (Hue.utilz.bingo(gets)) {
    content.classList.add("colortext")
    content.classList.add("goldtext")
  }

  let btns = Hue.el(".message_board_buttons", item)

  if (post.user_id === Hue.user_id) {
    btns.style.display = "flex"
  } else {
    Hue.el(".message_board_edit", item).style.display = "none"
  }

  if (!edited) {
    Hue.el("#message_board_container").prepend(item)
    let items = Hue.els("#message_board_container .message_board_item")
  
    if (items.length > Hue.config.max_message_board_posts) {
      items.slice(-1)[0].remove()
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
      Hue.el("#message_board_textarea").focus()
    }
  })
}

// Submits a message board post
Hue.submit_message_board_post = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  let message = Hue.utilz.remove_multiple_empty_lines(Hue.el("#message_board_textarea").value).trim()

  if (!message || message.length > Hue.config.max_message_board_post_length) {
    return false
  }

  Hue.el("#message_board_textarea").value = ""
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
  if (!Hue.is_admin()) {
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