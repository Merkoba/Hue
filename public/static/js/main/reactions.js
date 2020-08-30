// Setup reactions
Hue.setup_reactions = function () {
  $("#reaction_picker").on("click", ".reaction_icon", function () {
    Hue.send_reaction($(this).data("kind"), Hue.reaction_target)
    Hue.msg_reaction_picker.close()
  })
}

// Sends a reaction to the chat
Hue.send_reaction = function (reaction_type, reaction_target) {
  if (!reaction_type || !reaction_target) {
    return false
  }

  if (!Hue.can_chat) {
    Hue.feedback("You don't have permission to chat")
    return false
  }

  if (!Hue.reaction_types.includes(reaction_type)) {
    return false
  }

  let reaction_source = ""

  if (reaction_target !== "chat") {
    reaction_source = Hue[`loaded_${reaction_target}`].source
  }

  Hue.socket_emit("send_reaction", { 
    reaction_type: reaction_type, 
    reaction_target: reaction_target,
    reaction_source: reaction_source
  })
}

// Shows a message depending on the reaction type
Hue.show_reaction = function (data, date = false) {
  if (Hue.user_is_ignored(data.username)) {
    return false
  }
  
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
      if (!Hue.image_visible) {
        return false
      }

      if (Hue.loaded_image.source !== data.reaction_source) {
        return false
      }      

      $("#media_image_reactions").css("display", "block")
      $("#media_image_reactions").append(html)
      Hue.media_image_reactions_timer()
    } else if (data.reaction_target === "tv") {
      if (!Hue.tv_visible) {
        return false
      }

      if (Hue.loaded_tv.source !== data.reaction_source) {
        return false
      }

      $("#media_tv_reactions").css("display", "block")
      $("#media_tv_reactions").append(html)
      Hue.media_tv_reactions_timer()
    }
  }
}

// Show the reaction picker
Hue.show_reaction_picker = function (target) {
  Hue.reaction_target = target
  Hue.msg_reaction_picker.set_title(`React to ${Hue.media_string(target)}`)
  Hue.msg_reaction_picker.show()
}