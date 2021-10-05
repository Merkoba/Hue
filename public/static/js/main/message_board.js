// Setups the message board
Hue.setup_message_board = function () {
  $("#message_board_post_icon").on("click", function () {
    Hue.create_message_board_post()
  })

  $("#message_board_post_button").on("click", function () {
    Hue.submit_message_board_post()
  })

  $("#message_board_post_textarea").on("input blur", function () {
    let val = $(this)
      .val()
      .substring(0, Hue.config.max_message_board_post_length)
    $(this).val(val)
  })

  $("#message_board_container").on(
    "click",
    ".message_board_delete",
    function () {
      let item = $(this).closest(".message_board_item")
      let id = item.data("id")

      if (id) {
        Hue.show_confirm("Delete Message", "", function () {
          Hue.socket_emit("delete_message_board_post", { id: id })
        })
      }
    }
  )

  $("#message_board_container").on(
    "click",
    ".message_board_username",
    function () {
      Hue.show_profile($(this).data("uname"))
    }
  )

  $("#message_board_publish").on("click", function () {
    Hue.submit_message_board_post()
  })
}

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function (post) {
  let item = $(`
    <div class='message_board_item modal_item'>
        <div class='message_board_top'>
          <div class='message_board_username action'></div>
          <div class='message_board_date'></div>
        </div>
        <div class='message_board_text dynamic_title'></div>
        <div><div class='message_board_delete action inline underlined'>Delete</div></div>
    </div>`)

  item.data("id", post.id)
  item.data("date", post.date)

  let username = item.find(".message_board_username").eq(0)
  username.text(post.username)
  username.data("uname", post.username)

  let date = item.find(".message_board_date").eq(0)
  date.text(Hue.utilz.nice_date(post.date))

  let text = item.find(".message_board_text").eq(0)
  text.html(Hue.parse_text(Hue.utilz.make_html_safe(post.message))).urlize()
  let title = Hue.utilz.nice_date(post.date)

  if (post.id) {
    title = `${post.id.slice(-3)} | ${title}`
  }

  text.attr("title", title)
  text.data("date", post.date)
  text.data("otitle", title)

  let delet = item.find(".message_board_delete").eq(0)

  if (post.user_id === Hue.user_id) {
    delet.css("display", "inline-block")
  }

  let items = $("#message_board_container .message_board_item")
  let num_items = items.length

  if (num_items === 0) {
    $("#message_board_container").html(item)
  } else {
    $("#message_board_container").prepend(item)
  }

  if (
    $("#message_board_container").find(".message_board_item").length >
    Hue.config.max_message_board_posts
  ) {
    $("#message_board_container").find(".message_board_item").last().remove()
  }

  if (Hue.message_board_filtered) {
    Hue.do_modal_filter("message_board")
  }
}

// Fills the message board with init data
Hue.init_message_board = function (data) {
  if (data.message_board_posts.length > 0) {
    $("#message_board_container").html("")
  }

  for (let post of data.message_board_posts) {
    Hue.add_post_to_message_board(post)
  }

  Hue.check_last_message_board_post()
  Hue.vertical_separator($("#message_board_container")[0])
}

// Shows the message board
Hue.show_message_board = function (filter = "") {
  Hue.msg_message_board.show(function () {
    Hue.update_last_message_post_checked()
    Hue.check_last_message_board_post()

    if (filter.trim()) {
      $("#message_board_filter").val(filter)
      Hue.do_modal_filter()
    } else {
      $("#message_board_post_textarea").trigger("focus")
    }
  })
}

// Submits a message board post
Hue.submit_message_board_post = function () {
  if (!Hue.is_admin_or_op()) {
    return false
  }

  let message = Hue.utilz.remove_multiple_empty_lines($("#message_board_post_textarea").val()).trim()

  if (!message || message.length > Hue.config.max_message_board_post_length) {
    return false
  }

  $("#message_board_post_textarea").val("")
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

  Hue.vertical_separator($("#message_board_container")[0])
}

// Checks if there are new message board posts
Hue.check_last_message_board_post = function () {
  let items = $("#message_board_container").find(".message_board_item")

  if (items.length === 0) {
    $("#header_message_board_count").text("(0)")
    return false
  }

  let date = Hue.room_state.last_message_board_post

  if (items.first().data("date") > date) {
    if (!Hue.msg_message_board.is_open()) {
      let count = 0

      $("#message_board_container")
        .find(".message_board_item")
        .each(function () {
          if ($(this).data("date") <= date) {
            return false
          }

          count += 1
        })

      $("#header_message_board_count").text(`(${count})`)
    } else {
      Hue.update_last_message_post_checked()
    }
  } else {
    $("#header_message_board_count").text("(0)")
  }
}

// Updates the message board date local storage
Hue.update_last_message_post_checked = function () {
  let item = $("#message_board_container").find(".message_board_item").first()
  let date = item.data("date")

  if (date !== Hue.room_state.last_message_board_post) {
    Hue.room_state.last_message_board_post = date
    Hue.save_room_state()
  }
}

// Checks if the user can delete posts in the message board
Hue.check_message_board_permissions = function () {
  if (Hue.is_admin_or_op(Hue.role)) {
    if (Hue.role === "admin") {
      $("#message_board_container").addClass("message_board_container_admin")
    } else {
      $("#message_board_container").removeClass("message_board_container_admin")
    }
    
    $("#message_board_input").css("display", "block")
  } else {
    $("#message_board_container").removeClass("message_board_container_admin")
    $("#message_board_input").css("display", "none")
  }
}

// Remove a post from the message board window
Hue.remove_message_board_post = function (data) {
  $("#message_board_container")
    .find(".message_board_item")
    .each(function () {
      if ($(this).data("id") === data.id) {
        $(this).remove()
        return false
      }
    })

  Hue.check_last_message_board_post()
}