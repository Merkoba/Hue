// Sends a reaction to the chat
// Like 'happy
Hue.send_reaction = function (reaction_type) {
  if (!Hue.can_chat) {
    Hue.feedback("You don't have permission to chat")
    return false
  }

  if (!Hue.reaction_types.includes(reaction_type)) {
    return false
  }

  Hue.reaction_type = reaction_type
  Hue.hide_reactions_box()
  Hue.show_reaction_target()
}

// Show the reaction target window
Hue.show_reaction_target = function () {
  if (Hue.image_visible && Hue.current_is_loaded("image")) {
    $("#reaction_target_image").css("display", "grid")
  } else {
    $("#reaction_target_image").css("display", "none")
  }

  if (Hue.tv_visible && Hue.current_is_loaded("tv")) {
    $("#reaction_target_tv").css("display", "grid")
  } else {
    $("#reaction_target_tv").css("display", "none")
  }

  Hue.horizontal_separator.separate("reaction_target_container")
  Hue.msg_reaction_target.show()
}

// Sends the reaction signal
Hue.do_send_reaction = function () {
  if (!Hue.reaction_type || !Hue.reaction_target) {
    return false
  }
  
  Hue.socket_emit("send_reaction", { reaction_type: Hue.reaction_type, reaction_target: Hue.reaction_target })
}

// Shows a message depending on the reaction type
Hue.show_reaction = function (data, date = false) {
  let d

  if (date) {
    d = date
  } else {
    d = Date.now()
  }

  let icon
  let message

  if (data.reaction_type === "like") {
    icon = Hue.get_chat_icon("thumbs-up")
    message = `likes this`
  } else if (data.reaction_type === "love") {
    icon = Hue.get_chat_icon("heart")
    message = `loves this`
  } else if (data.reaction_type === "happy") {
    icon = Hue.get_chat_icon("happy")
    message = `is feeling happy`
  } else if (data.reaction_type === "meh") {
    icon = Hue.get_chat_icon("meh")
    message = `is feeling meh`
  } else if (data.reaction_type === "sad") {
    icon = Hue.get_chat_icon("sad")
    message = `is feeling sad`
  } else if (data.reaction_type === "dislike") {
    icon = Hue.get_chat_icon("thumbs-down")
    message = `dislikes this`
  } else {
    return false
  }

  if (data.reaction_target === "chat") {
    Hue.update_chat({
      id: data.id,
      brk: icon,
      message: message,
      username: data.username,
      prof_image: data.profile_image,
      third_person: true,
      date: d,
    })
  } else {
    let html = `<div class='flex_row_center'>${icon}&nbsp;${Hue.utilz.make_html_safe(data.username)} ${message}</div>`
    if (data.reaction_target === "image") {
      if (!Hue.image_visible || !Hue.current_is_loaded("image")) {
        return false
      }

      $("#media_image_reactions").css("display", "block")
      $("#media_image_reactions").html(html)
      Hue.media_image_reactions_timer()
    } else if (data.reaction_target === "tv") {
      if (!Hue.tv_visible || !Hue.current_is_loaded("tv")) {
        return false
      }

      $("#media_tv_reactions").css("display", "block")
      $("#media_tv_reactions").html(html)
      Hue.media_tv_reactions_timer()
    }
  }
}

// Setups the reaction box's events
// This is the box that appears on user menu hover
// It includes reactions as well as user functions
Hue.setup_reactions = function () {
  $("#reactions_box_container").hover(
    function () {
      Hue.mouse_over_reactions = true
      clearTimeout(Hue.hide_reactions_timeout)
    },

    function () {
      Hue.mouse_over_reactions = false
      Hue.start_hide_reactions()
    }
  )

  $("#chat_area").click(function () {
    if (Hue.reactions_box_open) {
      Hue.hide_reactions_box()
    }
  })

  $("#input").click(function () {
    if (Hue.reactions_box_open) {
      Hue.hide_reactions_box()
    }
  })

  Hue.horizontal_separator.separate("reactions_functions")
  Hue.horizontal_separator.separate("reactions_icons")

  $("#reactions_box").on("click", ".reaction_icon", function () {
    Hue.send_reaction($(this).data("kind"))
  })

  $("#reactions_box").on("auxclick", ".reaction_icon", function (e) {
    if (e.which === 2) {
      Hue.reaction_type = $(this).data("kind")
      Hue.reaction_target = "chat"
      Hue.hide_reactions_box()
      Hue.do_send_reaction()
    }
  })

  let on_target_click = function (target) {
    Hue.reaction_target = target
    Hue.msg_reaction_target.close()
    Hue.do_send_reaction()
  }

  $("#reaction_target_chat").click(function () {
    on_target_click("chat")
  })

  $("#reaction_target_image").click(function () {
    on_target_click("image")
  })

  $("#reaction_target_tv").click(function () {
    on_target_click("tv")
  })
}

// Starts a timeout to hide the reactions box when the mouse leaves the box
Hue.start_hide_reactions = function () {
  clearTimeout(Hue.show_reactions_timeout)

  Hue.hide_reactions_timeout = setTimeout(function () {
    if (Hue.mouse_over_reactions) {
      return false
    }

    Hue.hide_reactions_box()
  }, Hue.reactions_hover_delay)
}

// Shows the reactions box
Hue.show_reactions_box = function () {
  if (!Hue.reactions_box_open) {
    $("#recent_input_box").html("")

    let max = Hue.get_setting("max_recent_input_items")

    if (max > 0) {
      let n = 0

      for (let item of Hue.input_history.slice(0).reverse()) {
        let m = item.message.trim()

        if (m.length > 100 || m.includes("\n")) {
          continue
        }

        let message = Hue.utilz.make_html_safe(m)
        let el = `<div class='recent_input_item action pointer'>${message}</div>`
        $("#recent_input_box").prepend(el)

        n += 1

        if (n >= max) {
          break
        }
      }
    }

    $("#reactions_box_container").css("display", "flex")
    Hue.reactions_box_open = true
  }
}

// Hides the reactions box
Hue.hide_reactions_box = function () {
  if (Hue.reactions_box_open) {
    clearTimeout(Hue.hide_reactions_timeout)
    $("#reactions_box_container").css("display", "none")
    Hue.reactions_box_open = false
  }
}
