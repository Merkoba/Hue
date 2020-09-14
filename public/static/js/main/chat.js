// This generates all user chat messages inserted into the chat
Hue.update_chat = function (args = {}) {
  let def_args = {
    id: false,
    user_id: false,
    username: "",
    message: "",
    prof_image: "",
    date: false,
    third_person: false,
    brk: false,
    public: true,
    link_title: false,
    link_description: false,
    link_image: false,
    link_url: false,
    edited: false,
    just_edited: false,
  }

  args = Object.assign(def_args, args)

  if (Hue.check_ignored_words(args.message, args.username)) {
    return false
  }

  if (args.username) {
    if (Hue.user_is_ignored(args.username)) {
      return false
    }
  }

  let num_lines = args.message.split("\n").length

  if (num_lines === 1) {
    if (args.message.startsWith(Hue.config.commands_prefix + Hue.config.commands_prefix)) {
      args.message = args.message.slice(1)
    }
  }

  args.message = Hue.replace_message_vars(args.id, args.message)

  let message_classes = "message chat_message"
  let container_classes = "chat_content_container chat_menu_button_main"
  let content_classes = "chat_content dynamic_title"
  let d = args.date ? args.date : Date.now()
  let nd = Hue.utilz.nice_date(d)
  let pi

  if (args.prof_image === "" || args.prof_image === undefined) {
    pi = Hue.config.default_profile_image_url
  } else {
    pi = args.prof_image
  }

  let image_preview = false
  let image_preview_src_original = false
  let image_preview_text = false
  let starts_me =
    args.message.startsWith(`${Hue.config.commands_prefix}me `) || args.message.startsWith(`${Hue.config.commands_prefix}em `)

  if (!starts_me && Hue.get_setting("show_image_previews")) {
    let ans = Hue.make_image_preview(args.message)

    image_preview = ans.image_preview
    image_preview_src_original = ans.image_preview_src_original
    image_preview_text = ans.image_preview_text
  }

  let link_preview = false
  let link_preview_text = false

  if (
    !starts_me &&
    !image_preview &&
    (args.link_title || args.link_description) &&
    Hue.get_setting("show_link_previews")
  ) {
    let ans = Hue.make_link_preview({
      message: args.message,
      image: args.link_image,
      title: args.link_title,
      description: args.link_description,
    })

    link_preview = ans.link_preview
    link_preview_text = ans.link_preview_text
  }

  let highlighted = false
  let preview_text_classes = ""

  if (args.username !== Hue.username) {
    if (image_preview && image_preview_text) {
      if (Hue.check_highlights(image_preview_text)) {
        preview_text_classes += " highlighted4"
        highlighted = true
      }
    } else if (link_preview && link_preview_text) {
      if (Hue.check_highlights(link_preview_text)) {
        preview_text_classes += " highlighted4"
        highlighted = true
      }
    } else {
      if (Hue.check_highlights(args.message)) {
        content_classes += " highlighted4"
        highlighted = true
      }
    }
  }

  let fmessage
  let title = nd

  if (args.id) {
    title = `${args.id.slice(-3)} | ${title}`
  }

  if (starts_me || args.third_person) {
    let tpt

    if (starts_me) {
      tpt = args.message.substr(4)
    } else {
      tpt = args.message
    }

    if (!args.brk) {
      args.brk = Hue.get_chat_icon("user")
    }

    message_classes += " thirdperson"
    container_classes += " chat_content_container_third"

    let s = `
        <div class='${message_classes}'>
            <div class='chat_third_container'>
                <div class='brk chat_third_brk'>${args.brk}</div>
                <div class='${container_classes}'>
                    <div class='chat_menu_button_container'>
                      <svg class='other_icon chat_menu_button chat_menu_button_menu'>
                        <use href='#icon_ellipsis'>
                      </svg>
                    </div>

                    <div class='chat_third_content'>
                        <span class='chat_uname action'></span><span class='${content_classes}' title='${title}' data-otitle='${title}' data-date='${d}'></span>
                    </div>

                    <div class='message_edit_container'>
                        <textarea class='message_edit_area'></textarea>
                        <div class='message_edit_buttons'>
                            <div class='message_edit_button action message_edit_cancel'>Cancel</div>
                            <div class='message_edit_button action message_edit_submit'>Submit</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    fmessage = $(s)
    fmessage.find(".chat_content").eq(0).text(tpt)
    fmessage.find(".chat_content_container").eq(0).data("original_message", tpt)
  } else {
    let s = `
        <div class='${message_classes}'>
            <div class='chat_left_side'>
                <div class='chat_profile_image_container round_image_container action4'>
                    <img class='chat_profile_image profile_image' src='${pi}' loading='lazy'>
                </div>
            </div>
            <div class='chat_right_side'>
                <div class='chat_uname_container'>
                    <div class='chat_uname action'></div>
                </div>
                <div class='chat_container'>
                    <div class='${container_classes}'>

                        <div class='chat_menu_button_container'>
                            <svg class='other_icon chat_menu_button chat_menu_button_menu'>
                              <use href='#icon_ellipsis'>
                            </svg>
                        </div>

                        <div class='${content_classes}' title='${title}' data-otitle='${title}' data-date='${d}'></div>

                        <div class='message_edit_container'>
                            <textarea class='message_edit_area'></textarea>
                            <div class='message_edit_buttons'>
                                <div class='message_edit_button action message_edit_cancel'>Cancel</div>
                                <div class='message_edit_button action message_edit_submit'>Submit</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    fmessage = $(s)
    fmessage
      .find(".chat_content_container")
      .eq(0)
      .data("original_message", args.message)

    if (image_preview) {
      fmessage.find(".chat_content").eq(0).html(image_preview)
      fmessage.find(".image_preview_text").eq(0).addClass(preview_text_classes)
    } else if (link_preview) {
      fmessage.find(".chat_content").eq(0).html(link_preview)
      fmessage.find(".link_preview_text").eq(0).addClass(preview_text_classes)
    } else {
      fmessage
        .find(".chat_content")
        .eq(0)
        .html(Hue.replace_markdown(Hue.utilz.make_html_safe(args.message)))
    }
  }

  let huname = fmessage.find(".chat_uname").eq(0)

  huname.text(args.username)
  huname.attr("title", `ID: ${args.user_id}`)
  huname.data("prof_image", pi)

  fmessage
    .find(".chat_profile_image")
    .eq(0)
    .on("error", function () {
      if ($(this).attr("src") !== Hue.config.default_profile_image_url) {
        $(this).attr("src", Hue.config.default_profile_image_url)
      }
    })

  let has_embed = false

  if (image_preview || link_preview) {
    has_embed = true
  }

  let first_url = false

  if (image_preview) {
    first_url = image_preview_src_original
  } else if (link_preview) {
    first_url = args.link_url
  } else {
    first_url = Hue.utilz.get_first_url(args.message)
  }

  fmessage.data("user_id", args.user_id)
  fmessage.data("public", args.public)
  fmessage.data("date", d)
  fmessage.data("highlighted", highlighted)
  fmessage.data("uname", args.username)
  fmessage.data("mode", "chat")
  fmessage.data("has_embed", has_embed)

  let chat_content_container = fmessage.find(".chat_content_container").eq(0)
  let chat_content = fmessage.find(".chat_content").eq(0)

  chat_content_container.data("id", args.id)
  chat_content_container.data("edited", args.edited)
  chat_content_container.data("highlighted", highlighted)
  chat_content_container.data("date", d)
  chat_content_container.data("first_url", first_url)

  if (!image_preview && !link_preview) {
    chat_content.urlize()
  }

  if (image_preview) {
    Hue.setup_image_preview(fmessage, image_preview_src_original, args.user_id)
  }

  if (link_preview) {
    Hue.setup_link_preview(fmessage, args.link_url)
  }

  Hue.setup_whispers_click(fmessage, args.username)

  let message_id = Hue.add_to_chat({
    id: args.id,
    message: fmessage,
    save: true,
    just_edited: args.just_edited,
  }).message_id

  if (!args.edited) {
    if (args.username !== Hue.username) {
      if (highlighted) {
        Hue.on_highlight()
      } else {
        Hue.on_activity("message")
      }
    }
  }

  if (args.user_id) {
    Hue.replace_property_in_userlist_by_user_id(
      args.user_id,
      "last_message",
      args.message
    )
  }

  Hue.push_to_all_usernames(args.username)

  return {
    message_id: message_id
  }
}

// This generates all announcements inserted into the chat
Hue.chat_announce = function (args = {}) {
  let def_args = {
    id: false,
    brk: "",
    message: "",
    highlight: false,
    title: false,
    onclick: false,
    on_middle_click: false,
    container_id: false,
    date: false,
    type: "normal",
    info1: "",
    info2: "",
    username: false,
    open_profile: false,
    public: false,
    link_title: false,
    link_description: false,
    link_image: false,
    link_url: false,
    preview_image: false,
    comment: "",
    comment_icon: true,
    comment_onclick: false,
    user_id: false,
    replace_markdown: false,
    in_log: true,
    media_source: ""
  }

  args = Object.assign(def_args, args)

  let ignore = false

  if (Hue.check_ignored_words(args.message, args.username)) {
    ignore = true
  }

  if (args.username) {
    if (Hue.user_is_ignored(args.username)) {
      ignore = true
    }
  }

  let message_classes = "message announcement"
  let container_classes = "announcement_content_container chat_menu_button_main"
  let split_classes = "announcement_content_split dynamic_title"
  let content_classes = "announcement_content"
  let brk_classes = "brk announcement_brk"

  let container_id = " "

  if (args.container_id) {
    container_id = ` id='${args.container_id}' `
  }

  let highlighted = false

  if (args.highlight) {
    content_classes += " highlighted4"
    highlighted = true
  }

  let d = args.date ? args.date : Date.now()
  let t = args.title ? args.title : Hue.utilz.nice_date(d)
  let image_preview = false
  let image_preview_src_original = false
  let image_preview_text = false

  if (args.preview_image && Hue.get_setting("show_image_previews")) {
    let ans = Hue.make_image_preview(args.message)
    image_preview = ans.image_preview
    image_preview_src_original = ans.image_preview_src_original
    image_preview_text = ans.image_preview_text
  }

  let comment = ""

  if (args.comment) {
    let cls = "announcement_comment"

    if (args.username && args.username !== Hue.username) {
      if (!highlighted && Hue.check_highlights(args.comment)) {
        cls += " highlighted4"
        highlighted = true
      }
    }

    let c = Hue.replace_markdown(Hue.utilz.make_html_safe(args.comment))

    if (args.comment_icon) {
      comment = `<div class='${cls}'><div class='announcement_comment_inner flex_row_center'>
      <svg class='announcement_comment_icon chat_icon'><use href='#icon_comment'></svg>${c}</div></div>`
    } else {
      comment = `<div class='${cls}'><div class='announcement_comment_inner flex_row_center'>${c}</div></div>`
    }
  } else {
    comment = `<div class='announcement_comment'></div>`
  }

  let link_preview = false
  let link_preview_text = false

  if (
    !image_preview &&
    (args.link_title || args.link_description) &&
    Hue.get_setting("show_link_previews")
  ) {
    let ans = Hue.make_link_preview({
      message: args.message,
      image: args.link_image,
      title: args.link_title,
      description: args.link_description,
    })

    link_preview = ans.link_preview
    link_preview_text = ans.link_preview_text
  }

  if (
    (args.onclick ||
      args.on_middle_click ||
      (args.username && args.open_profile)) &&
    !link_preview &&
    !image_preview
  ) {
    content_classes += " pointer action"
  }

  if (args.username) {
    brk_classes += " pointer action"
  }

  let first_url = false

  if (image_preview) {
    first_url = image_preview_src_original
  } else if (link_preview) {
    first_url = args.link_url
  }

  let preview_text_classes = ""

  if (args.username !== Hue.username) {
    if (image_preview && image_preview_text) {
      if (Hue.check_highlights(image_preview_text)) {
        preview_text_classes += " highlighted4"
        highlighted = true
      }
    } else if (link_preview && link_preview_text) {
      if (Hue.check_highlights(link_preview_text)) {
        preview_text_classes += " highlighted4"
        highlighted = true
      }
    }
  }

  let s = `
    <div${container_id}class='${message_classes}'>
        <div class='${brk_classes}'>${args.brk}</div>
        <div class='${container_classes}'>
            <div class='chat_menu_button_container'>
                <svg class='other_icon chat_menu_button chat_menu_button_menu'>
                  <use href='#icon_ellipsis'>
                </svg>
            </div>
            <div class='${split_classes}'>
                <div class='${content_classes}'></div>
                ${comment}
            </div>
        </div>
    </div>`

  let fmessage = $(s)
  let content = fmessage.find(".announcement_content").eq(0)
  let comment_el = fmessage.find(".announcement_comment_inner").eq(0)
  let split = fmessage.find(".announcement_content_split").eq(0)
  let brk = fmessage.find(".brk").eq(0)

  split.attr("title", t)
  split.data("otitle", t)
  split.data("date", d)

  if (image_preview) {
    content.html(image_preview)
    content.find(".image_preview_text").eq(0).addClass(preview_text_classes)
    Hue.setup_image_preview(fmessage, image_preview_src_original, "none")
  } else if (link_preview) {
    content.html(link_preview)
    content.find(".link_preview_text").eq(0).addClass(preview_text_classes)
    Hue.setup_link_preview(fmessage, args.link_url)
  } else {
    if (args.replace_markdown) {
      content
        .html(Hue.replace_markdown(Hue.utilz.make_html_safe(args.message)))
        .urlize()
    } else {
      content.text(args.message).urlize()
    }
  }

  if (args.comment) {
    comment_el.urlize()

    if (args.username) {
      Hue.setup_whispers_click(comment_el, args.username)
    }

    if (args.comment_onclick) {
      comment_el.click(args.comment_onclick)
      comment_el.addClass("special_link")
    }
  }

  let pif = function () {
    Hue.show_profile(args.username)
  }

  if (args.onclick && !link_preview && !image_preview) {
    content.on("click", args.onclick)
  } else if (args.username && args.open_profile) {
    content.on("click", pif)
    brk.on("click", pif)
  }

  if (args.username) {
    brk.on("click", pif)
  }

  if (args.on_middle_click) {
    content.on("auxclick", function (e) {
      if (e.which === 2) {
        args.on_middle_click()
      }
    })
  }

  fmessage.data("id", args.id)
  fmessage.data("public", args.public)
  fmessage.data("date", d)
  fmessage.data("highlighted", highlighted)
  fmessage.data("type", args.type)
  fmessage.data("info1", args.info1)
  fmessage.data("info2", args.info2)
  fmessage.data("uname", args.username)
  fmessage.data("mode", "announcement")
  fmessage.data("first_url", first_url)
  fmessage.data("user_id", args.user_id)
  fmessage.data("in_log", args.in_log)
  fmessage.data("media_source", args.media_source)

  let message_id

  if (!ignore) {
    message_id = Hue.add_to_chat({
      message: fmessage
    }).message_id

    if (highlighted) {
      Hue.on_highlight()
    }
  }

  Hue.push_to_all_usernames(args.username)

  return {
    message_id: message_id
  }
}

// This is a centralized function to insert all chat or announcement messages into the chat
Hue.add_to_chat = function (args = {}) {
  let def_args = {
    id: false,
    message: false,
    notify: true,
    just_edited: false,
    fader: true,
  }

  args = Object.assign(def_args, args)

  if (!args.message) {
    return false
  }

  let chat_area = $("#chat_area")
  let last_message = $("#chat_area > .message").last()
  let appended = false
  let mode = args.message.data("mode")
  let uname = args.message.data("uname")
  let user_id = args.message.data("user_id")
  let date = args.message.data("date")
  let is_public = args.message.data("public")
  let highlighted = args.message.data("highlighted")
  let content_container, message_id

  if (mode === "chat") {
    content_container = args.message.find(".chat_content_container").eq(0)
    Hue.chat_content_container_id += 1
    content_container.data(
      "chat_content_container_id",
      Hue.chat_content_container_id
    )
    content_container.addClass(
      `chat_content_container_${Hue.chat_content_container_id}`
    )

    if (args.just_edited && args.id) {
      $(".chat_content_container").each(function () {
        if ($(this).data("id") === args.id) {
          $(this).replaceWith(content_container.clone(true, true))
          Hue.goto_bottom(false, false)
          return false
        }
      })

      return false
    }
  }

  if (
    args.message.hasClass("chat_message") &&
    !args.message.hasClass("thirdperson") &&
    last_message.hasClass("chat_message") &&
    !last_message.hasClass("thirdperson")
  ) {
    if (
      args.message.find(".chat_uname").eq(0).text() ===
      last_message.find(".chat_uname").eq(0).text()
    ) {
      if (
        last_message.find(".chat_content").length <
        Hue.config.max_same_post_messages
      ) {
        let date_diff =
          args.message.find(".chat_content").last().data("date") -
          last_message.find(".chat_content").last().data("date")

        if (date_diff < Hue.config.max_same_post_diff) {
          if (Hue.started && Hue.app_focused && args.fader) {
            content_container.addClass("fader")
          }

          content_container.data("date", date)
          content_container.data("highlighted", highlighted)

          last_message.find(".chat_container").eq(0).append(content_container)
          message_id = last_message.data("message_id")

          if (!last_message.data("highlighted")) {
            last_message.data("highlighted", highlighted)
          }

          appended = true
        }
      }
    }
  }

  if (!appended) {
    if (Hue.started && Hue.app_focused && args.fader) {
      args.message.addClass("fader")
    }

    let last = $("#chat_area > .message").last()
    let last_date = last.data("date")

    if (date && last_date) {
      if (date - last_date > Hue.config.old_activity_min) {
        chat_area.append(
          Hue.generate_vseparator(Hue.get_old_activity_message(last_date, date))
        )
      }
    }

    chat_area.append(args.message)

    let length = $("#chat_area > .message").length
    let limit = Hue.get_setting("chat_crop_limit")

    if (length > limit) {
      $("#chat_area")
        .find(`.message:lt(${length - limit})`)
        .remove()
    }

    Hue.message_id += 1
    message_id = Hue.message_id
    args.message.data("message_id", message_id)
    args.message.addClass(`message_id_${message_id}`)
  }

  if (Hue.started) {
    Hue.goto_bottom(false, false)

    if (highlighted) {
      if (Hue.room_state.last_highlight_date < date) {
        Hue.room_state.last_highlight_date = date
        Hue.save_room_state()
      }
    }
  }

  if (Hue.started && !Hue.app_focused) {
    if (content_container) {
      Hue.add_fresh_message(content_container)
    } else {
      Hue.add_fresh_message(args.message)
    }
  }

  Hue.scroll_timer()

  if (is_public && user_id && date) {
    Hue.push_to_activity_bar(user_id, date)
  }

  if (
    args.notify &&
    Hue.started &&
    highlighted
  ) {
    Hue.electron_signal("highlighted")
  }

  return {
    message_id: message_id
  }
}

// Generates a string to indicate how much time has passed between one date and another
Hue.get_old_activity_message = function (last_date, date) {
  let diff = date - last_date
  let s

  if (diff < Hue.HOUR) {
    let n = Math.floor(diff / 60 / 1000)

    if (n === 1) {
      s = `Over ${n} Minute Passed`
    } else {
      s = `Over ${n} Minutes Passed`
    }
  } else if (diff >= Hue.HOUR && diff < Hue.DAY) {
    let n = Math.floor(diff / 60 / 60 / 1000)

    if (n === 1) {
      s = `Over ${n} Hour Passed`
    } else {
      s = `Over ${n} Hours Passed`
    }
  } else if (diff >= Hue.DAY && diff < Hue.YEAR) {
    let n = Math.floor(diff / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `Over ${n} Day Passed`
    } else {
      s = `Over ${n} Days Passed`
    }
  } else if (diff >= Hue.YEAR) {
    let n = Math.floor(diff / 365 / 24 / 60 / 60 / 1000)

    if (n === 1) {
      s = `Over ${n} Year Passed`
    } else {
      s = `Over ${n} Years Passed`
    }
  }

  return s
}

// Generates a horizontal line with text in the middle
// To separate chat messages and convey information
Hue.generate_vseparator = function (message = "", classes = "") {
  let s = `
        <div class='message vseparator_container ${classes}'>
            <div class='vseparator_line'></div>
            <div class='vseparator_text'>${message}</div>
            <div class='vseparator_line'></div>
        </div>
    `

  return s
}

// Starts chat mouse events
Hue.start_chat_mouse_events = function () {
  $(".chat_area").on("click", ".chat_uname", function () {
    let m = $(this).closest(".message")
    Hue.show_profile(
      m.data("uname"),
      $(this).data("prof_image"),
      m.data("user_id")
    )
  })

  $(".chat_area").on("click", ".chat_profile_image", function () {
    let m = $(this).closest(".message")
    Hue.show_profile(
      m.data("uname"),
      $(this).attr("src"),
      m.data("user_id")
    )
  })

  $(".chat_area").on("click", ".message_edit_submit", function () {
    Hue.send_edit_messsage()
  })

  $(".chat_area").on("click", ".message_edit_cancel", function () {
    Hue.stop_edit_message()
  })

  $(".chat_area").on("mouseup", ".chat_uname", function (e) {
    if (e.button === 1) {
      e.preventDefault()
      e.stopPropagation()
      Hue.process_write_whisper($(this).closest(".message").data("uname"))
    }
  })

  $(".chat_area").on("mouseup", ".chat_profile_image", function (e) {
    if (e.button === 1) {
      e.preventDefault()
      e.stopPropagation()
      Hue.process_write_whisper($(this).closest(".message").data("uname"))
    }
  })

  $(".chat_area").on("mouseup", ".chat_content", function (e) {
    if (e.button === 1) {
      if (Hue.start_reply(e.target)) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  })
}

// Setup reply
Hue.setup_reply = function () {
  $("#reply_submit").click(function () {
    Hue.submit_reply()
  })
}

// Prepare data to show the reply window
Hue.start_reply = function (target) {
  if ($(target).is("a")) {
    return false
  }

  let uname = $(target).closest(".chat_message").data("uname")
  let text = $(target)
    .closest(".chat_content_container")
    .data("original_message")
  let selection = window.getSelection().toString()

  if (selection) {
    if (text.includes(selection)) {
      text = selection
    }
  }

  if (!uname || !text) {
    return false
  }

  text = $(`<div>${Hue.replace_markdown(text, false, true)}</div>`).text()

  if (!text || !text.match(/\w/)) {
    Hue.feedback("Can't quote that")
    return
  }

  text = Hue.utilz.clean_string2(text)
  let add_dots = text.length > Hue.config.quote_max_length
  text = text.substring(0, Hue.config.quote_max_length).trim()

  if (add_dots) {
    text += "..."
  }

  Hue.reply_text_raw = `>> $${uname}$ said: ${text}`
  Hue.show_reply(uname, text)
  return true
}

// Show the reply window
Hue.show_reply = function (username, quote) {
  $("#reply_text").html(quote)
  $("#reply_input").val("")

  Hue.msg_reply.set_title(`Re: ${username}`)

  Hue.msg_reply.show(function () {
    $("#reply_input").focus()
  })
}

// Submit the reply window
Hue.submit_reply = function () {
  let reply = $("#reply_input").val().trim()

  if (Hue.is_command(reply)) {
    reply = `/${reply}`
  }

  Hue.msg_reply.close()
  Hue.goto_bottom(true, false)
  Hue.process_message({
    message: Hue.reply_text_raw,
    to_history: false
  })

  if (reply) {
    Hue.process_message({
      message: reply
    })
  }
}

// Adds a message to the fresh message list
// This is a list of messages to temporarily highlight when a user refocus the client
// This is to give an indicator of fresh changes
Hue.add_fresh_message = function (container) {
  Hue.fresh_messages_list.push(container)

  if (Hue.fresh_messages_list.length > Hue.max_fresh_messages) {
    Hue.fresh_messages_list.shift()
  }
}

// Temporarily highlights recent messages since last focus
Hue.show_fresh_messages = function () {
  if (Hue.fresh_messages_list.length === 0) {
    return false
  }

  for (let container of Hue.fresh_messages_list) {
    container.addClass("highlighted3")

    setTimeout(function () {
      container.removeClass("highlighted3")
    }, Hue.fresh_messages_duration)
  }

  Hue.fresh_messages_list = []
}

// Focuses the message edit textbox
Hue.focus_edit_area = function () {
  if (Hue.editing_message_area !== document.activeElement) {
    Hue.editing_message_area.focus()
  }
}

// Handles direction on Up and Down keys
// Determines whether a message has to be edited
Hue.handle_edit_direction = function (reverse = false) {
  let area = Hue.editing_message_area

  if (
    (reverse && area.selectionStart === area.value.length) ||
    (!reverse && area.selectionStart === 0)
  ) {
    Hue.edit_last_message(reverse)
    return true
  }

  return false
}

// Edits the next latest chat message
// Either in normal or reverse order
Hue.edit_last_message = function (reverse = false) {
  let found = false
  let edit_found = true
  let last_container = false

  if (Hue.editing_message) {
    edit_found = false
  }

  $($("#chat_area > .message").get().reverse()).each(function () {
    if (found) {
      return false
    }

    if ($(this).data("user_id") === Hue.user_id) {
      $($(this).find(".chat_content_container").get().reverse()).each(
        function () {
          if (Hue.editing_message) {
            if (this === Hue.editing_message_container) {
              edit_found = true
              return true
            }
          }

          let cnt = this

          if (!edit_found) {
            last_container = this
            return true
          } else {
            if (reverse) {
              cnt = last_container
            }
          }

          if (!cnt) {
            Hue.stop_edit_message()
          } else {
            Hue.edit_message(cnt)
          }

          found = true
          return false
        }
      )
    }
  })
}

// Starts chat message editing
Hue.edit_message = function (container) {
  if (Hue.editing_message) {
    Hue.stop_edit_message()
  }

  let edit_container = $(container).find(".message_edit_container").get(0)
  let area = $(container).find(".message_edit_area").get(0)
  let chat_content = $(container).find(".chat_content").get(0)

  if ($(container).hasClass("chat_content_container_third")) {
    let uname = $(container).find(".chat_uname").get(0)
    $(uname).css("display", "none")
  }

  $(edit_container).css("display", "block")
  $(chat_content).css("display", "none")
  $(container).removeClass("chat_menu_button_main")
  $(container).css("display", "block")

  Hue.editing_message = true
  Hue.editing_message_container = container
  Hue.editing_message_area = area
  Hue.editing_original_message = $(container).data("original_message")

  $(area).val(Hue.editing_original_message).focus()

  setTimeout(function () {
    area.setSelectionRange(area.value.length, area.value.length)
  }, 40)

  area.scrollIntoView({
    block: "center"
  })
  Hue.check_scrollers()
}

// Stops chat message editing
Hue.stop_edit_message = function () {
  if (!Hue.editing_message || !Hue.editing_message_container) {
    return false
  }

  let edit_container = $(Hue.editing_message_container)
    .find(".message_edit_container")
    .get(0)
  let chat_content = $(Hue.editing_message_container)
    .find(".chat_content")
    .get(0)

  $(Hue.editing_message_container).removeClass("chat_menu_button_main_selected")

  $(edit_container).css("display", "none")

  if (
    $(Hue.editing_message_container).hasClass("chat_content_container_third")
  ) {
    let uname = $(Hue.editing_message_container).find(".chat_uname").get(0)
    $(uname).css("display", "inline-block")
  }

  $(Hue.editing_message_area).val("")

  $(chat_content).css("display", "inline-block")

  $(Hue.editing_message_container).addClass("chat_menu_button_main")
  $(Hue.editing_message_container).css("display", "flex")

  Hue.editing_message = false
  Hue.editing_message_container = false
  Hue.editing_message_area = false

  Hue.goto_bottom(false, false)
}

// Submits a chat message edit
Hue.send_edit_messsage = function (id) {
  if (!Hue.editing_message_container) {
    return false
  }

  let chat_content = $(Hue.editing_message_container)
    .find(".chat_content")
    .get(0)

  let new_message = Hue.editing_message_area.value
  new_message = Hue.utilz.remove_multiple_empty_lines(new_message)
  new_message = Hue.utilz.untab_string(new_message).trimEnd()

  let edit_id = $(Hue.editing_message_container).data("id")
  let third_person = false

  if (
    $(Hue.editing_message_container).hasClass("chat_content_container_third")
  ) {
    third_person = true
  }

  Hue.stop_edit_message()

  if ($(chat_content).text() === new_message) {
    return false
  }

  if (!edit_id) {
    return false
  }

  if (new_message.length === 0) {
    Hue.delete_message(edit_id)
    return false
  }

  if (third_person) {
    new_message = `/me ${new_message}`
  }

  Hue.process_message({
    message: new_message,
    edit_id: edit_id,
    to_history: false
  })

  Hue.replace_in_input_history(Hue.editing_original_message, new_message)
}

// Deletes a message
Hue.delete_message = function (id, force = false) {
  if (!id) {
    return false
  }

  if (force) {
    Hue.send_delete_message(id)
  } else {
    if (!Hue.started_safe) {
      return false
    }

    if (confirm("Are you sure you want to delete this message?")) {
      Hue.send_delete_message(id)
    }
  }
}

// Makes the delete message emit
Hue.send_delete_message = function (id) {
  Hue.socket_emit("delete_message", {
    id: id
  })
}

// Remove a message from the chat
Hue.remove_message_from_chat = function (data) {
  if (data.type === "chat" || data.type === "reaction") {
    $(".chat_content_container").each(function () {
      if ($(this).data("id") == data.id) {
        Hue.process_remove_chat_message(this)
        return false
      }
    })
  } else if (
    data.type === "announcement" ||
    data.type === "reaction" ||
    data.type === "image" ||
    data.type === "tv"
  ) {
    $(".message.announcement").each(function () {
      if ($(this).data("id") == data.id) {
        Hue.process_remove_announcement(this)
        return false
      }
    })
  }

  Hue.goto_bottom(false, false)
}

// Removes a chat message from the chat, when triggered through the context menu
Hue.remove_message_from_context_menu = function (menu) {
  let message = $(menu).closest(".message")
  let mode = message.data("mode")

  if (mode === "chat") {
    Hue.process_remove_chat_message($(menu).closest(".chat_content_container"))
  } else if (mode === "announcement") {
    Hue.process_remove_announcement(message)
  }
}

// Determines how to remove a chat message
Hue.process_remove_chat_message = function (chat_content_container) {
  let chat_content_container_id = $(chat_content_container).data(
    "chat_content_container_id"
  )

  $(".chat_content_container").each(function () {
    if (
      $(this).data("chat_content_container_id") === chat_content_container_id
    ) {
      let message2 = $(this).closest(".message")

      if (message2.hasClass("thirdperson")) {
        message2.remove()
      } else {
        if (
          $(this).closest(".chat_container").find(".chat_content_container")
          .length === 1
        ) {
          message2.remove()
        } else {
          $(this).remove()
        }
      }
    }
  })
}

// Determines how to remove an announcement
Hue.process_remove_announcement = function (message) {
  let type = $(message).data("type")
  let message_id = $(message).data("message_id")

  if (
    type === "image_change" ||
    type === "tv_change"
  ) {
    let id = $(message).data("id")
    Hue.remove_item_from_media_changed(type.replace("_change", ""), id)
  }

  $(`.message_id_${message_id}`).each(function () {
    $(this).remove()
  })

  Hue.check_media_menu_loaded_media()
}

// Checks if the user is typing a chat message to send a typing emit
// If the message appears to be a command it is ignored
Hue.check_typing = function () {
  let val = $("#input").val()

  if (val.length < Hue.old_input_val.length) {
    return false
  }

  let tval = val.trim()

  if (Hue.can_chat && tval !== "") {
    if (tval[0] === Hue.config.commands_prefix) {
      if (tval[1] !== Hue.config.commands_prefix && !tval.startsWith(`${Hue.config.commands_prefix}me `)) {
        return false
      }
    }

    Hue.typing_timer()
  }
}

// When a typing signal is received
// And animates profile images
Hue.show_typing = function (data) {
  let user = Hue.get_user_by_user_id(data.user_id)

  if (!user) {
    return false
  }

  if (Hue.user_is_ignored(user.username)) {
    return false
  }

  Hue.typing_remove_timer()
  Hue.show_aura(user.user_id)

  if (!Hue.app_focused) {
    Hue.check_favicon(1)
  }

  Hue.typing = true
}

// Stops the typing actions
Hue.hide_typing = function () {
  if (!Hue.typing) {
    return
  }

  Hue.check_favicon()
  Hue.typing = false
}

// Gets the most recent chat message by username
Hue.get_last_chat_message_by_username = function (ouname) {
  let found_message = false

  $($("#chat_area > .message.chat_message").get().reverse()).each(function () {
    let uname = $(this).data("uname")

    if (uname) {
      if (uname === ouname) {
        found_message = this
        return false
      }
    }
  })

  return found_message
}

// Gets the most recent chat message by user_id
Hue.get_last_chat_message_by_user_id = function (ouser_id) {
  let found_message = false

  $($("#chat_area > .message.chat_message").get().reverse()).each(function () {
    let user_id = $(this).data("user_id")

    if (user_id) {
      if (user_id === ouser_id) {
        found_message = this
        return false
      }
    }
  })

  return found_message
}

// Gives or maintains aura classes
// Starts timeout to remove them
Hue.show_aura = function (id) {
  if (!Hue.app_focused) {
    return false
  }

  if (Hue.aura_timeouts[id] === undefined) {
    Hue.add_aura(id)
  } else {
    clearTimeout(Hue.aura_timeouts[id])
  }

  Hue.aura_timeouts[id] = setTimeout(function () {
    Hue.remove_aura(id)
  }, Hue.config.max_typing_inactivity)
}

// Adds the aura class to the profile image of the latest chat message of a user
// This class makes the profile image glow and rotate
Hue.add_aura = function (id) {
  let message = Hue.get_last_chat_message_by_user_id(id)

  if (message) {
    $(message).find(".chat_profile_image_container").eq(0).addClass("aura")
  }

  let activity_bar_item = Hue.get_activity_bar_item_by_user_id(id)

  if (activity_bar_item) {
    $(activity_bar_item)
      .find(".activity_bar_image_container")
      .eq(0)
      .addClass("aura")
  }
}

// Removes the aura class from messages from a user
Hue.remove_aura = function (id) {
  clearTimeout(Hue.aura_timeouts[id])

  let aura = "aura"
  let cls = ".chat_profile_image_container.aura"

  $(cls).each(function () {
    let message = $(this).closest(".chat_message")

    if (message.length > 0) {
      if (message.data("user_id") === id) {
        $(this).removeClass(aura)
      }
    }
  })

  cls = ".activity_bar_image_container.aura"

  $(cls).each(function () {
    let activity_bar_item = $(this).closest(".activity_bar_item")

    if (activity_bar_item.length > 0) {
      if (activity_bar_item.data("user_id") === id) {
        $(this).removeClass(aura)
      }
    }
  })

  Hue.aura_timeouts[id] = undefined
}

// Jumps to a chat message in the chat area
// This is used when clicking the Jump button in
// windows showing chat message clones
Hue.jump_to_chat_message = function (message_id) {
  let el = $(`#chat_area > .message_id_${message_id}`).eq(0)

  if (el.length === 0) {
    return false
  }

  el[0].scrollIntoView({
    block: "center"
  })
  el.addClass("blinkattention")

  setTimeout(function () {
    el.removeClass("blinkattention")
  }, 2000)

  Hue.close_all_modals()
}

// Returns an object with clones of the announcement messages of every loaded media
Hue.get_loaded_media_messages = function () {
  let obj = {}

  for (let type of Hue.utilz.media_types) {
    obj[type] = false

    let loaded_type = Hue[`loaded_${type}`]

    if (loaded_type) {
      let message_id = loaded_type.message_id
      let message = $(`#chat_area > .message_id_${message_id}`).eq(0)

      if (message.length > 0) {
        obj[type] = message.clone(true, true)
      }
    } else {
      obj[type] = "Not Loaded Yet"
    }
  }

  return obj
}

// What to do after receiving a chat message from the server
Hue.on_chat_message = function (data) {
  Hue.update_chat({
    id: data.id,
    user_id: data.user_id,
    username: data.username,
    message: data.message,
    prof_image: data.profile_image,
    date: data.date,
    link_title: data.link_title,
    link_description: data.link_description,
    link_image: data.link_image,
    link_url: data.link_url,
    edited: data.edited,
    just_edited: data.just_edited,
  })

  Hue.hide_typing()
  Hue.remove_aura(data.user_id)
}

// Shows feedback if user doesn't have chat permission
Hue.cant_chat = function () {
  Hue.feedback("You don't have permission to chat")
}

// Find the next chat message above that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_above = function () {
  let step = false
  let activity_up_scroller_height = $("#activity_up_scroller").outerHeight()
  let scrolltop = $("#chat_area").scrollTop()

  $($("#chat_area > .message").get().reverse()).each(function () {
    let same_uname = false
    let uname = $(this).data("uname")

    if (uname && uname === Hue.username) {
      same_uname = true
    }

    if (same_uname || $(this).data("highlighted")) {
      let p = $(this).position()

      if (p.top < activity_up_scroller_height) {
        let diff = scrolltop + p.top - activity_up_scroller_height

        if (scrolltop - diff < 50) {
          return true
        }

        Hue.scroll_chat_to(diff)
        step = true
        return false
      }
    }
  })

  if (!step) {
    Hue.goto_top()
  }
}

// Find the next chat message below that involves the user
// This is a message made by the user or one that is highlighted
Hue.activity_below = function () {
  let step = false
  let activity_up_scroller_height = $("#activity_up_scroller").outerHeight()
  let activity_down_scroller_height = $("#activity_down_scroller").outerHeight()
  let chat_area_height = $("#chat_area").innerHeight()
  let scrolltop = $("#chat_area").scrollTop()

  $("#chat_area > .message").each(function () {
    let same_uname = false
    let uname = $(this).data("uname")

    if (uname && uname === Hue.username) {
      same_uname = true
    }

    if (same_uname || $(this).data("highlighted")) {
      let p = $(this).position()
      let h = $(this).outerHeight()

      if (p.top + h + activity_down_scroller_height > chat_area_height) {
        let diff = scrolltop + p.top - activity_up_scroller_height

        if (diff - scrolltop < 50) {
          return true
        }

        Hue.scroll_chat_to(diff)
        step = true
        return false
      }
    }
  })

  if (!step) {
    Hue.goto_bottom(true)
  }
}

// Clears the chat area
Hue.clear_chat = function () {
  $("#chat_area").html("")

  Hue.show_log_messages()
  Hue.goto_bottom(true)
  Hue.focus_input()
}

// Changes the chat display size
Hue.do_chat_size_change = function (size) {
  if (size === "max") {
    size = 90
  } else if (size === "min") {
    size = 10
  } else if (size === "default") {
    size = Hue.config.room_state_default_chat_display_percentage
  }

  size = Hue.utilz.nearest_ten(parseInt(size))

  if (size < 10 || size > 100) {
    return false
  }

  if (size === 100) {
    Hue.toggle_media_area()
    Hue.show_infotip("Chat Maximized")
    return
  }

  Hue.room_state.chat_display_percentage = size
  Hue.save_room_state()
  Hue.apply_media_percentages()
  Hue.notify_chat_size_change(size)
}

// Shows the chat display percentage in the infotip
Hue.notify_chat_size_change = function (size) {
  let info

  if (size === Hue.config.room_state_default_chat_display_percentage) {
    info = " (Default)"
  } else {
    info = ""
  }

  Hue.show_infotip(`Chat Size: ${size}%${info}`)
}

// Scrolls the chat to a certain vertical position
Hue.scroll_chat_to = function (scroll_top) {
  $("#chat_area").scrollTop(scroll_top)
}

// Scrolls the chat up
Hue.scroll_up = function (n) {
  let diff = $("#chat_area").scrollTop() - n
  Hue.scroll_chat_to(diff)
  return diff
}

// Scrolls the chat down
Hue.scroll_down = function (n) {
  let $ch = $("#chat_area")
  let max = $ch.prop("scrollHeight") - $ch.innerHeight()
  let diff

  if (max - $ch.scrollTop < n) {
    diff = max + 10
  } else {
    diff = $ch.scrollTop() + n
  }

  Hue.scroll_chat_to(diff)

  return diff
}

// Generates a regex with a specified string to check for highlights
// It handles various scenarious like "word," "@word" "word..."
Hue.generate_highlights_regex = function (
  word,
  case_insensitive = false,
  escape = true
) {
  let flags = "gm"

  if (case_insensitive) {
    flags += "i"
  }

  if (escape) {
    word = Hue.utilz.escape_special_characters(word)
  }

  // Raw regex if using the word "mad"
  //(?:^|\s|\")(?:\@)?(?:mad)(?:\'s)?(?:$|\s|\"|\!|\?|\,|\.|\:)
  let regex = new RegExp(
    `(?:^|\\s|\\"|\\$)(?:\\@)?(?:${word})(?:\\'s)?(?:$|\\s|\\"|\\!|\\?|\\,|\\.|\\:|\\$)`,
    flags
  )

  return regex
}

// Generates the username mention regex using the highlights regex
Hue.generate_mentions_regex = function () {
  if (Hue.get_setting("case_insensitive_username_highlights")) {
    Hue.mentions_regex = Hue.generate_highlights_regex(Hue.username, true, true)
  } else {
    Hue.mentions_regex = Hue.generate_highlights_regex(
      Hue.username,
      false,
      true
    )
  }
}

// Generates highlight words regex using the highlights regex
Hue.generate_highlight_words_regex = function () {
  let words = ""
  let lines = Hue.get_setting("other_words_to_highlight").split("\n")

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    words += Hue.utilz.escape_special_characters(line)

    if (i < lines.length - 1) {
      words += "|"
    }
  }

  if (words.length > 0) {
    if (Hue.get_setting("case_insensitive_words_highlights")) {
      Hue.highlight_words_regex = Hue.generate_highlights_regex(
        words,
        true,
        false
      )
    } else {
      Hue.highlight_words_regex = Hue.generate_highlights_regex(
        words,
        false,
        false
      )
    }
  } else {
    Hue.highlight_words_regex = false
  }
}

// Checks for highlights using the mentions regex and the highlight words regex
Hue.check_highlights = function (message) {
  if (Hue.get_setting("highlight_current_username")) {
    if (message.search(Hue.mentions_regex) !== -1) {
      return true
    }
  }

  if (Hue.highlight_words_regex) {
    if (message.search(Hue.highlight_words_regex) !== -1) {
      return true
    }
  }

  return false
}

// Generates the ignored words regex using highlights regex
Hue.generate_ignored_words_regex = function () {
  let words = ""
  let lines = Hue.get_setting("ignored_words").split("\n")

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    words += Hue.utilz.escape_special_characters(line)

    if (i < lines.length - 1) {
      words += "|"
    }
  }

  if (words.length > 0) {
    if (Hue.get_setting("case_insensitive_ignored_words")) {
      Hue.ignored_words_regex = Hue.generate_highlights_regex(
        words,
        true,
        false
      )
    } else {
      Hue.ignored_words_regex = Hue.generate_highlights_regex(
        words,
        false,
        false
      )
    }
  } else {
    Hue.ignored_words_regex = false
  }
}

// Checks for ignored words on chat messages and announcements
// Using ignored words regex
Hue.check_ignored_words = function (message = "", uname = "") {
  if (Hue.ignored_words_regex) {
    if (message.search(Hue.ignored_words_regex) !== -1) {
      if (
        uname &&
        uname === Hue.username &&
        Hue.get_setting("ignored_words_exclude_same_user")
      ) {
        return false
      } else {
        return true
      }
    }
  }

  return false
}

// Checks if there are new highlights since the last load
// If so, a clickable announcement appears which opens Highlights
Hue.check_latest_highlight = function () {
  let latest_highlight = Hue.get_latest_highlight()

  if (latest_highlight) {
    let date = $(latest_highlight).data("date")

    if (date > Hue.room_state.last_highlight_date) {
      Hue.room_state.last_highlight_date = date
      Hue.save_room_state()
      Hue.show_highlights()
    }
  }
}

// Gets the last highlighted message
// Either a chat content container or an announcement
Hue.get_latest_highlight = function () {
  let latest_highlight = false

  $($("#chat_area .chat_content_container").get().reverse()).each(function () {
    if ($(this).data("highlighted")) {
      latest_highlight = this
      return false
    }
  })

  if (latest_highlight) {
    $($("#chat_area > .message.announcement").get().reverse()).each(
      function () {
        if ($(this).data("highlighted")) {
          if ($(this).data("date") > $(latest_highlight).data("date")) {
            latest_highlight = this
          }

          return false
        }
      }
    )
  }

  return latest_highlight
}

// What to do when a message gets highlighted
Hue.on_highlight = function () {
  if (!Hue.started) {
    return false
  }

  if (!Hue.app_focused || Hue.screen_locked) {
    Hue.alert_title(2)
    Hue.show_highlight_desktop_notification()
  }
}

// What to do after general activity
Hue.on_activity = function (type) {
  if (!Hue.started) {
    return false
  }

  if (!Hue.app_focused || Hue.screen_locked) {

    if (type === "message" || type === "media_change") {
      Hue.alert_title(1)
    }
  }
}

// Resets highlights filter data
Hue.reset_highlights_filter = function () {
  $("#highlights_filter").val("")
  $("#highlights_container").html("")
  $("#highlights_no_results").css("display", "none")
}

// Show and/or filters highlights window
Hue.show_highlights = function (filter = false) {
  if (filter) {
    filter = filter.trim()
  }

  let sfilter = filter ? filter : ""

  $("#highlights_container").html("")
  $("#highlights_filter").val(sfilter)
  $("#highlights_no_results").css("display", "none")

  let clone = $($("#chat_area").children().get().reverse()).clone(true, true)

  clone.each(function () {
    $(this).removeAttr("id")
  })

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    let words = lc_value.split(" ").filter((x) => x.trim() !== "")

    clone = clone.filter(function () {
      if (!$(this).data("highlighted")) {
        return false
      }

      if ($(this).hasClass("vseparator_container")) {
        return false
      }

      let text = $(this).text().toLowerCase()
      return words.some((word) => text.includes(word))
    })
  } else {
    clone = clone.filter(function () {
      if (!$(this).data("highlighted")) {
        return false
      }

      if ($(this).hasClass("vseparator_container")) {
        return false
      }

      return true
    })
  }

  if (clone.children().length === 0 && !filter) {
    $("#highlights_no_results").css("display", "block")
  } else {
    clone.appendTo("#highlights_container")
  }

  Hue.msg_highlights.show(function () {
    Hue.scroll_modal_to_top("highlights")
  })
}

// Make link preview elements
Hue.make_link_preview = function (args = {}) {
  args.message = args.message ? args.message : ""
  args.image = args.image ? args.image : ""
  args.title = args.title ? args.title : ""
  args.description = args.description ? args.description : ""

  let ans = {}
  ans.link_preview = false

  let link_preview_classes = args.image ?
    "link_preview link_preview_with_image" :
    "link_preview link_preview_no_image"
  let link_preview_image_classes = args.image ?
    "link_preview_image" :
    "nodisplay"
  let link_preview_title_classes = args.title ?
    "link_preview_title action" :
    "nodisplay"
  let link_preview_description_classes = args.description ?
    "link_preview_description" :
    "nodisplay"

  let link_preview_text_content_classes = "link_preview_text_content"

  if (args.title && args.description) {
    link_preview_text_content_classes += " link_preview_text_content_full"
  }

  if (!args.title && !args.description) {
    link_preview_text_content_classes = "nodisplay"
  }

  let link_preview_s = `<div class='${link_preview_classes}'>
        <img class='${link_preview_image_classes}' src='${
    args.image
  }' loading='lazy'>
        <div class='${link_preview_text_content_classes}'>
            <div class='${link_preview_title_classes}'>${Hue.utilz.make_html_safe(
    args.title
  )}</div>
            <div class='${link_preview_description_classes}'>${Hue.utilz.make_html_safe(
    args.description
  )}</div>
        </div>
    </div>`

  if (link_preview_s) {
    ans.link_preview = link_preview_s

    let text = Hue.replace_markdown(Hue.utilz.make_html_safe(args.message))
    let stext = `<div class='link_preview_text'>${text}</div>`

    ans.link_preview_text = text
    ans.link_preview = stext + ans.link_preview
  }

  return ans
}

// Setups link preview elements
Hue.setup_link_preview = function (fmessage, link_url) {
  let link_preview_el = fmessage.find(".link_preview").eq(0)
  let link_preview_image = link_preview_el.find(".link_preview_image").eq(0)
  let link_preview_title = link_preview_el.find(".link_preview_title").eq(0)

  let f = function () {
    Hue.open_url_menu({
      source: link_url,
      title: link_preview_title.text()
    })
  }

  if (link_preview_title.length > 0) {
    link_preview_title.click(f)
  }

  if (link_preview_image.length > 0) {
    link_preview_image.click(function (e) {
      e.stopPropagation()
      Hue.expand_image($(this).attr("src").replace(".gifv", ".gif"))
    })

    link_preview_image.on("load", function () {
      Hue.goto_bottom(false, false)
      Hue.check_scrollers()
    })
  }

  link_preview_el.parent().find(".link_preview_text").eq(0).urlize()
}

// Makes image preview elements
Hue.make_image_preview = function (message) {
  let ans = {}

  ans.image_preview = false
  ans.image_preview_src = false
  ans.image_preview_src_original = false
  ans.image_preview_text = false

  let link = Hue.utilz.get_first_url(message)

  if (!link) {
    return ans
  }

  if (link.includes("imgur.com")) {
    let code = Hue.utilz.get_imgur_image_code(link)

    if (code) {
      let extension = Hue.utilz.get_extension(link)

      ans.image_preview_src_original = `https://i.imgur.com/${code}.${extension}`
      ans.image_preview_src = `https://i.imgur.com/${code}l.jpg`

      // This is in a single line on purpose
      ans.image_preview = `<div class='image_preview action'><img draggable="false" class="image_preview_image" src="${ans.image_preview_src}" loading="lazy"></div>`

      let text = Hue.replace_markdown(Hue.utilz.make_html_safe(message))
      let stext = `<div class='image_preview_text'>${text}</div>`

      ans.image_preview_text = message
      ans.image_preview = stext + ans.image_preview
    }
  }

  return ans
}

// Setups image preview elements
Hue.setup_image_preview = function (fmessage, image_preview_src_original) {
  let image_preview_el = fmessage.find(".image_preview").eq(0)

  image_preview_el.click(function () {
    Hue.open_url_menu({
      source: image_preview_src_original
    })
  })

  let image_preview_image = image_preview_el.find(".image_preview_image").eq(0)

  image_preview_image.on("load", function () {
    Hue.goto_bottom(false, false)
    Hue.check_scrollers()
  })

  image_preview_image.click(function (e) {
    e.stopPropagation()
    Hue.expand_image(image_preview_src_original.replace(".gifv", ".gif"))
  })

  image_preview_el.parent().find(".image_preview_text").eq(0).urlize()
}

// Sends a chat message through the say command
Hue.say_command = function (arg, ans) {
  Hue.process_message({
    message: arg,
    to_history: ans.to_history,
    clr_input: ans.clr_input,
  })
}

// Starts chat area scroll events
Hue.scroll_events = function () {
  $("#chat_area")[0].addEventListener("wheel", function (e) {
    $("#chat_area").stop()
    Hue.clear_autoscroll()
    Hue.last_scroll_date = Date.now()
  })

  $("#chat_area").scroll(function () {
    Hue.scroll_timer()
  })
}

// Shows the top scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
Hue.show_top_scroller = function () {
  $("#top_scroller_container").css("visibility", "visible")
}

// Hides the top scroller
Hue.hide_top_scroller = function () {
  $("#top_scroller_container").css("visibility", "hidden")
}

// Shows the bottom scroller
// Scrollers are the elements that appear at the top or at the bottom,
// when the chat area is scrolled
Hue.show_bottom_scroller = function () {
  $("#bottom_scroller_container").css("visibility", "visible")
  Hue.chat_scrolled = true
}

// Hides the bottom scroller
Hue.hide_bottom_scroller = function () {
  $("#bottom_scroller_container").css("visibility", "hidden")
  Hue.chat_scrolled = false
}

// Updates scrollers state based on scroll position
Hue.check_scrollers = function () {
  if (Hue.autoscrolling && Hue.autoscroll_direction === "up") {
    return
  }

  let $ch = $("#chat_area")
  let max = $ch.prop("scrollHeight") - $ch.innerHeight()
  let scrolltop = $ch.scrollTop()
  let diff = max - scrolltop

  if (scrolltop === 0) {
    Hue.hide_top_scroller()
    Hue.clear_autoscroll()
  } else {
    Hue.show_top_scroller()
  }

  if (diff > Hue.small_scroll_amount) {
    Hue.show_bottom_scroller()
  } else {
    Hue.hide_bottom_scroller()

    if (diff <= 0) {
      Hue.clear_autoscroll()
    }
  }
}

// Starts chat autoscrolling upwards
Hue.autoscroll_up = function () {
  if (Hue.autoscrolling) {
    Hue.clear_autoscroll()
    Hue.check_scrollers()
    return false
  }

  Hue.clear_autoscroll()

  Hue.autoscroll_up_interval = setInterval(function () {
    let diff = Hue.scroll_up(Hue.get_setting("autoscroll_amount"))

    if (Hue.last_autoscroll_diff === diff) {
      Hue.clear_autoscroll()
      Hue.check_scrollers()
    } else {
      Hue.last_autoscroll_diff = diff
    }
  }, Hue.get_setting("autoscroll_delay"))

  Hue.show_bottom_scroller()
  Hue.autoscrolling = true
  Hue.autoscroll_direction = "up"
}

// Starts chat autoscrolling downwards
Hue.autoscroll_down = function () {
  if (Hue.autoscrolling) {
    Hue.clear_autoscroll()
    Hue.check_scrollers()
    return false
  }

  Hue.clear_autoscroll()

  Hue.autoscroll_down_interval = setInterval(function () {
    let diff = Hue.scroll_down(Hue.get_setting("autoscroll_amount"))

    if (Hue.last_autoscroll_diff === diff) {
      Hue.clear_autoscroll()
      Hue.check_scrollers()
    } else {
      Hue.last_autoscroll_diff = diff
    }
  }, Hue.get_setting("autoscroll_delay"))

  Hue.autoscrolling = true
  Hue.autoscroll_direction = "down"
}

// Clears autoscrolling intervals
Hue.clear_autoscroll = function () {
  clearInterval(Hue.autoscroll_up_interval)
  clearInterval(Hue.autoscroll_down_interval)

  Hue.last_autoscroll_diff = 0
  Hue.autoscrolling = false
}

// Shows a system announcement
// Used for ads
Hue.show_announcement = function (data, date = Date.now()) {
  Hue.public_feedback(data.message, {
    id: data.id,
    brk: Hue.get_chat_icon("star"),
    date: date,
    preview_image: true,
    link_title: data.link_title,
    link_description: data.link_description,
    link_image: data.link_image,
    link_url: data.link_url,
  })
}

// Scrolls the chat to the top
Hue.goto_top = function () {
  Hue.clear_autoscroll()
  Hue.scroll_chat_to(0)
  Hue.hide_top_scroller()
}

// Scrolls the chat to the bottom
Hue.goto_bottom = function (force = false) {
  if (!force && Hue.started) {
    if (Date.now() - Hue.last_scroll_date < Hue.recent_scroll_time) {
      return
    }
  }

  let $ch = $("#chat_area")
  let max = $ch.prop("scrollHeight") - $ch.innerHeight()

  if (force) {
    Hue.clear_autoscroll()
    Hue.scroll_chat_to(max)
    Hue.show_top_scroller()
    Hue.hide_bottom_scroller()
  } else {
    if (!Hue.chat_scrolled) {
      Hue.clear_autoscroll()
      Hue.scroll_chat_to(max)
    }
  }
}

// Fills the chat and media changes with log messages from initial data
Hue.show_log_messages = function () {
  if (Hue.log_messages_processed) {
    return false
  }

  let num_image = 0
  let num_tv = 0

  if (Hue.log_messages && Hue.log_messages.length > 0) {
    for (let message of Hue.log_messages) {
      let type = message.type

      if (type === "image") {
        num_image += 1
      } else if (type === "tv") {
        num_tv += 1
      }
    }
  }

  // If there are no media items in the log, show the current room media

  if (num_image === 0) {
    Hue.setup_image(
      "show",
      Object.assign(Hue.get_media_object_from_init_data("image"), {
        in_log: false,
      })
    )
  }

  if (num_tv === 0) {
    Hue.setup_tv(
      "show",
      Object.assign(Hue.get_media_object_from_init_data("tv"), {
        in_log: false,
      })
    )
  }

  if (Hue.log_messages && Hue.log_messages.length > 0) {
    for (let message of Hue.log_messages) {
      let id = message.id
      let type = message.type
      let data = message.data
      let date = message.date

      if (data) {
        if (type === "chat") {
          Hue.update_chat({
            id: id,
            user_id: data.user_id,
            username: data.username,
            message: data.content,
            prof_image: data.profile_image,
            link_title: data.link_title,
            link_description: data.link_description,
            link_image: data.link_image,
            link_url: data.link_url,
            date: date,
            scroll: false,
            edited: data.edited,
          })
        } else if (type === "image") {
          data.id = id
          data.date = date
          Hue.setup_image("show", data)
        } else if (type === "tv") {
          data.id = id
          data.date = date
          Hue.setup_tv("show", data)
        } else if (type === "reaction") {
          data.id = id
          Hue.show_reaction(data, date)
        } else if (type === "announcement") {
          data.id = id
          Hue.show_announcement(data, date)
        }
      }
    }
  }

  Hue.log_messages_processed = true
}

// Sends a simple shrug chat message
Hue.shrug = function () {
  Hue.process_message({
    message: "¯\\_(ツ)_/¯",
    to_history: false,
  })
}

// Centralized function to show local feedback messages
Hue.feedback = function (message, data = false) {
  let obj = {
    brk: Hue.get_chat_icon("info"),
    message: message,
    public: false,
  }

  if (data) {
    Object.assign(obj, data)
  }

  if (!obj.brk.startsWith("<") && !obj.brk.endsWith(">")) {
    obj.brk = `<div class='inline'>${obj.brk}</div>`
  }

  return Hue.chat_announce(obj)
}

// Centralized function to show public announcement messages
Hue.public_feedback = function (message, data = false) {
  let obj = {
    brk: Hue.get_chat_icon("info"),
    message: message,
    public: true,
  }

  if (data) {
    Object.assign(obj, data)
  }

  if (!obj.brk.startsWith("<") && !obj.brk.endsWith(">")) {
    obj.brk = `<div class='inline'>${obj.brk}</div>`
  }

  return Hue.chat_announce(obj)
}

// Removes a message above or below a message with a certain ID
Hue.remove_messages_after_id = function (id, direction) {
  let index = false

  $($("#chat_area .chat_content_container").get().reverse()).each(function () {
    if ($(this).data("id") === id) {
      let container_index = $(this).index()
      let message = $(this).closest(".message")

      if (
        $(this).closest(".chat_container").find(".chat_content_container")
        .length > 1
      ) {
        if (direction === "above") {
          message
            .find(".chat_content_container")
            .slice(0, container_index)
            .remove()
        } else if (direction === "below") {
          message
            .find(".chat_content_container")
            .slice(container_index + 1)
            .remove()
        }
      }

      index = message.index()
      return false
    }
  })

  if (index === false) {
    $($("#chat_area > .announcement").get().reverse()).each(function () {
      if ($(this).data("id") === id) {
        index = $(this).index()
        return false
      }
    })
  }

  if (index === false) {
    return false
  }

  if (direction === "above") {
    $("#chat_area > .message").slice(0, index).remove()
  } else if (direction === "below") {
    $("#chat_area > .message")
      .slice(index + 1)
      .remove()
  }

  Hue.goto_bottom(true, false)
}

// Setups some chat configs
Hue.setup_chat = function () {
  $("#top_scroller").click(function () {
    Hue.goto_top()
  })

  $("#top_autoscroller").click(function () {
    Hue.autoscroll_up()
  })

  $("#activity_up_scroller").click(function () {
    Hue.activity_above()
  })

  $("#bottom_scroller").click(function () {
    Hue.goto_bottom(true)
  })

  $("#bottom_autoscroller").click(function () {
    Hue.autoscroll_down()
  })

  $("#activity_down_scroller").click(function () {
    Hue.activity_below()
  })
}

// Replace things like $id$ with the message id
Hue.replace_message_vars = function (id, message) {
  if (id) {
    message = message.replace(/\$id\$/g, id)
  }

  return message
}

// Gradually increases the chat display percentage
Hue.increase_chat_percentage = function () {
  let size = parseInt(Hue.room_state.chat_display_percentage)
  size += 10
  size = Hue.utilz.round2(size, 10)
  Hue.do_chat_size_change(size)
}

// Gradually decreases the chat display percentage
Hue.decrease_chat_percentage = function () {
  let size = parseInt(Hue.room_state.chat_display_percentage)
  size -= 10
  size = Hue.utilz.round2(size, 10)
  Hue.do_chat_size_change(size)
}

// Sets the chat display percentage to default
Hue.set_default_chat_size = function () {
  Hue.do_chat_size_change("default")
}

// Adds style to the icons of active media messages
Hue.update_chat_media_feedback = function () {
  $("#chat_area > .announcement").each(function () {
    let icon = $(this).find(".announcement_brk").eq(0).find("svg").eq(0)

    if (icon.hasClass("shady")) {
      icon.removeClass("shady")
    }

    if ($(this).data("type") === "image_change") {
      if ($(this).data("message_id") === Hue.loaded_image.message_id) {
        icon.addClass("shady")
      }
    } else if ($(this).data("type") === "tv_change") {
      if ($(this).data("message_id") === Hue.loaded_tv.message_id) {
        icon.addClass("shady")
      }
    }
  })
}