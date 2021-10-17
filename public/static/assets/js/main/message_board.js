// Setups the message board
Hue.setup_message_board = function () {
  Hue.el("#message_board_post_textarea").addEventListener("input blur", function () {
    this.value = this.value.substring(0, Hue.config.max_message_board_post_length)
  })

  Hue.el("#message_board_container").addEventListener("click",
    function (e) {
      let el = e.target.closest(".message_board_delete")

      if (el) {
        let item = el.closest(".message_board_item")
        let id = Hue.dataset(item, "id")
  
        if (id) {
          Hue.show_confirm("Delete Message", "", function () {
            Hue.socket_emit("delete_message_board_post", { id: id })
          })
        }
      }
    }
  )

  Hue.el("#message_board_container").addEventListener("click",
    function (e) {
      let el = e.target.closest(".message_board_username")
      
      if (el) {
        Hue.show_profile(Hue.dataset(el, "username"))
      }
    }
  )

  Hue.el("#message_board_publish").addEventListener("click", function () {
    Hue.submit_message_board_post()
  })
}

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function (post) {
  let s = `
    <div class='message_board_top'>
      <div class='message_board_username action'></div>
      <div class='message_board_date'></div>
    </div>
    <div class='message_board_text dynamic_title'></div>
    <div><div class='message_board_delete action inline underlined'>Delete</div></div>`

  let item = Hue.div()
  item.classList.add("message_board_item")
  item.classList.add("modal_item")
  item.innerHTML = s
  Hue.dataset(item, "id", post.id)
  Hue.dataset(item, "date", post.date)

  let username = item.querySelector(".message_board_username")
  username.textContent = post.username
  Hue.dataset(username, "username", post.username)

  let date = item.querySelector(".message_board_date")
  date.textContent = Hue.utilz.nice_date(post.date)

  let text = item.querySelector(".message_board_text")
  text.innerHTML = Hue.parse_text(Hue.utilz.make_html_safe(post.message))
  Hue.urlize(text)
  let title = Hue.utilz.nice_date(post.date)

  if (post.id) {
    title = `${post.id.slice(-3)} | ${title}`
  }

  text.title = title
  Hue.dataset(text, "date", post.date)
  Hue.dataset(text, "otitle", title)

  let delet = item.querySelector(".message_board_delete")

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
  let items = Hue.el("#message_board_container").querySelectorAll(".message_board_item")

  if (items.length === 0) {
    Hue.el("#header_message_board_count").textContent = "(0)"
    return false
  }

  let date = Hue.room_state.last_message_board_post

  if (Hue.dataset(items[0], "date") > date) {
    if (!Hue.msg_message_board.is_open()) {
      let count = 0

      Hue.el("#message_board_container").querySelectorAll(".message_board_item").forEach(it => {
        if (Hue.dataset(it, "date") <= date) {
          return false
        }

        count += 1
      })

      Hue.el("#header_message_board_count").textContent = `(${count})`
    } else {
      Hue.update_last_message_post_checked()
    }
  } else {
    Hue.el("#header_message_board_count").textContent = "(0)"
  }
}

// Updates the message board date local storage
Hue.update_last_message_post_checked = function () {
  let item = Hue.el("#message_board_container").querySelector(".message_board_item")
  let date = Hue.dataset(item, "date")

  if (date !== Hue.room_state.last_message_board_post) {
    Hue.room_state.last_message_board_post = date
    Hue.save_room_state()
  }
}

// Checks if the user can delete posts in the message board
Hue.check_message_board_permissions = function () {
  if (Hue.is_admin_or_op(Hue.role)) {
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
Hue.remove_message_board_post = function (data) {
  Hue.el("#message_board_container").querySelectorAll(".message_board_item")
    .forEach(it => {
      if (Hue.dataset(it, "id") === data.id) {
        it.remove()
        return false
      }
    })

  Hue.check_last_message_board_post()
}