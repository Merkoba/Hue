// Setups the message board
Hue.setup_message_board = function () {
  $("#message_board_post_icon").click(function () {
    Hue.create_message_board_post()
  })

  $("#message_board_post_button").click(function () {
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

  $("#message_board_publish").click(function () {
    Hue.submit_message_board_post()
  })
}

// Creates and adds an item to the message board
Hue.add_post_to_message_board = function (post) {
  let item = $(`
    <div class='message_board_item modal_item'>
        <div class='message_board_username'></div>
        <div class='message_board_text dynamic_title'></div>
        <div><div class='message_board_delete action inline underlined'>Delete</div></div>
    </div>`)

  item.data("id", post.id)
  item.data("date", post.date)

  let uname = Hue.utilz.make_html_safe(post.username || "")
  let username = item.find(".message_board_username").eq(0)
  username.html(`posted by ${uname}`)
  username.data("uname", uname)

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
}

// Shows the message board
Hue.show_message_board = function (filter = false) {
  Hue.msg_message_board.show(function () {
    Hue.update_last_message_post_checked()
    Hue.check_last_message_board_post()

    if (filter) {
      $("#message_board_filter").val(filter)
      Hue.do_modal_filter()
    } else {
      $("#message_board_post_textarea").focus()
    }
  })
}

// Submits a message board post
Hue.submit_message_board_post = function () {  
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

  let func = function () { Hue.show_message_board() }
  let item = Hue.make_info_popup_item({icon: "pencil", message: "New message board post", on_click:func})

  if (!Hue.message_board_open) {
    Hue.show_popup(Hue.make_info_popup(func), item)
  }
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
    $("#message_board_container").addClass("message_board_container_admin")
  } else {
    $("#message_board_container").removeClass("message_board_container_admin")
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

// Deletes all message board posts
Hue.clear_message_board = function () {
  if (!Hue.is_admin_or_op(Hue.role)) {
    return false
  }

  Hue.socket_emit("clear_message_board", {})
}

// After the message board gets clearedmmmmm
Hue.on_message_board_cleared = function (data) {
  $("#message_board_container").html("")
  Hue.show_room_notification(
    data.username,
    `${data.username} cleared the message board`
  )
}
