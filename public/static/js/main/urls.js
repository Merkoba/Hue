// JQuery function to turn url text into actual links
jQuery.fn.urlize = function (stop_propagation = true) {
  try {
    let html = this.html()

    if (!html || !Hue.utilz.includes_url(html)) {
      return false
    }

    let split = html.split(/\s+/)
    let matches = []
    let reg = /(?:^|\s)\"?(https?:\/\/(?:[^"|\s]*)+)/

    for (let s of split) {
      let result = reg.exec(s)

      if (result) {
        matches.push(result[1])
      }
    }

    if (matches.length > 0) {
      on_matches(matches, html, this)
    }

    function on_matches(matches, html, obj) {
      let cls = "generic action"

      if (stop_propagation) {
        cls += " stop_propagation"
      }

      let used_urls = []

      for (let i = 0; i < matches.length; i++) {
        let url = matches[i]

        if (used_urls.includes(url)) {
          continue
        }

        used_urls.push(url)

        let rep = new RegExp(
          Hue.utilz.escape_special_characters(matches[i]),
          "g"
        )
        let u = matches[i]
        let max = Hue.max_displayed_url

        if (u.length > max) {
          u = `${u.substring(0, max)}...`
        }

        html = html.replace(
          rep,
          `<a class="${cls}" target="_blank" href="${url}">${u}</a>`
        )
      }

      $(obj).html(html)

      $(obj)
        .find(".stop_propagation")
        .each(function () {
          $(this).click(function (e) {
            e.stopPropagation()
          })
        })
    }
  } catch (err) {}
}

// Goes to a url
Hue.goto_url = function (u, mode = "same", encode = false) {
  if (encode) {
    u = encodeURIComponent(u)
  }

  if (mode === "tab") {
    window.open(u, "_blank")
  } else {
    Hue.user_leaving = true
    window.location = u
  }
}

// Opens a new tab with a search query on a specified search engine
Hue.search_on = function (site, q) {
  q = encodeURIComponent(q)

  if (site === "google") {
    Hue.goto_url(`https://www.google.com/search?q=${q}`, "tab")
  } else if (site === "soundcloud") {
    Hue.goto_url(`https://soundcloud.com/search?q=${q}`, "tab")
  } else if (site === "youtube") {
    Hue.goto_url(`https://www.youtube.com/results?search_query=${q}`, "tab")
  }
}

// Handle URLS
Hue.handle_url = function (text) {
  if (text) {
    Hue.check_handle_url_options(text)
    $("#handle_url_input").val(text)
    $("#handle_url_comment").val("")
    Hue.handled_url_input = text
    Hue.handled_url_comment = ""
    Hue.msg_handle_url.show(function () {
      $("#handle_url_comment").focus()
    })
  }
}

// Handle url chat action
Hue.handle_url_chat = function () {
  let message = Hue.handled_url_input

  if (Hue.handled_url_comment) {
    message = `${Hue.handled_url_comment.trim()} ${message.trim()}`
  }
    
  Hue.process_message({ message: message, handle_url: false })
  Hue.close_all_modals()
}

// Setups drop listeners
// This is used to display actions when dropping a URL
// Like changing the tv when dropping a YouTube URL
Hue.setup_drag_events = function () {
  $("#main_container")[0].addEventListener("drop", function (e) {
    Hue.handle_url(e.dataTransfer.getData("text/plain").trim())
  })

  $("#handle_url_chat").click(function () {
    Hue.handle_url_chat()
  })

  $("#handle_url_image").click(function () {
    Hue.change_image_source(
      Hue.handled_url_input,
      false,
      Hue.handled_url_comment
    )
    Hue.close_all_modals()
  })

  $("#handle_url_tv").click(function () {
    Hue.change_tv_source(Hue.handled_url_input, false, Hue.handled_url_comment)
    Hue.close_all_modals()
  })

  $("#handle_url_input").on("input blur", function () {
    Hue.handled_url_input = $(this).val().trim()
    $("#handle_url_input").val(Hue.handled_url_input)
    Hue.check_handle_url_options(Hue.handled_url_input)
  })

  $("#handle_url_comment").on("input blur", function () {
    Hue.handled_url_comment = $(this)
      .val()
      .substring(0, Hue.config.max_media_comment_length)
    $("#handle_url_comment").val(Hue.handled_url_comment)
  })
}

// Changes button visibility based on url
Hue.check_handle_url_options = function (text) {
  if (text && text.length < Hue.config.max_input_length) {
    $("#handle_url_chat").css("display", "inline-block")
  } else {
    $("#handle_url_chat").css("display", "none")
  }

  if (Hue.change_image_source(text, true)) {
    $("#handle_url_image").css("display", "inline-block")
  } else {
    $("#handle_url_image").css("display", "none")
  }

  if (Hue.change_tv_source(text, true)) {
    $("#handle_url_tv").css("display", "inline-block")
  } else {
    $("#handle_url_tv").css("display", "none")
  }

  Hue.horizontal_separator.separate("handle_url_container")
}

// Setups the Open URL picker window
Hue.setup_open_url = function () {
  $("#open_url_menu_open").click(function () {
    Hue.goto_url(Hue.open_url_source, "tab")
    Hue.close_all_modals()
  })

  $("#open_url_menu_copy").click(function () {
    Hue.copy_string(Hue.open_url_source)
    Hue.close_all_modals()
  })

  $("#open_url_menu_copy_title").click(function () {
    Hue.copy_string(Hue.open_url_title)
    Hue.close_all_modals()
  })

  $("#open_url_menu_load").click(function () {
    Hue.load_media(Hue.open_url_media_type, Hue.open_url_data)
    Hue.close_all_modals()
  })

  $("#open_url_menu_change").click(function () {
    if (confirm("This will change it for everyone. Are you sure?")) {
      Hue[`change_${Hue.open_url_media_type}_source`](Hue.open_url_data.source)
      Hue.close_all_modals()
    }
  })
}

// Shows the Open URL menu
// This is used to show actions for links and media
Hue.open_url_menu = function (args = {}) {
  let def_args = {
    source: false,
    type: 1,
    data: {},
    media_type: false,
    title: false,
  }

  args = Object.assign(def_args, args)

  Hue.open_url_title = args.title || args.data.title

  if (Hue.open_url_title && Hue.open_url_title !== args.source) {
    $("#open_url_menu_copy_title").css("display", "inline-block")
  } else {
    $("#open_url_menu_copy_title").css("display", "none")
  }

  if (args.media_type && args.data) {
    let mode = Hue[`room_${args.media_type}_mode`]
    $("#open_url_menu_load").css("display", "inline-block")

    if (
      (mode === "enabled" || mode === "locked") &&
      args.data !== Hue[`loaded_${args.media_type}`]
    ) {
      $("#open_url_menu_load").text("Load")
    } else {
      $("#open_url_menu_load").text("Reload")
    }

    if (Hue[`change_${args.media_type}_source`](args.source, true)) {
      $("#open_url_menu_change").css("display", "inline-block")
    } else {
      $("#open_url_menu_change").css("display", "none")
    }
  } else {
    $("#open_url_menu_load").css("display", "none")
    $("#open_url_menu_change").css("display", "none")
  }

  Hue.horizontal_separator.separate("open_url_container")

  Hue.open_url_source = args.source
  Hue.open_url_data = args.data
  Hue.open_url_media_type = args.media_type

  let title = Hue.utilz.get_limited_string(
    args.source,
    Hue.config.url_title_max_length
  )

  Hue.msg_open_url.set_title(title)
  Hue.msg_open_url.show()
}

// Checks if a URL of a media type is from a blacklisted or whitelisted domain
Hue.check_domain_list = function (media_type, src) {
  let list_type = Hue.config[`${media_type}_domain_allow_or_deny_list`]

  if (list_type !== "allow" && list_type !== "deny") {
    return false
  }

  let list = Hue.config[`${media_type}_domain_list`]

  if (list.length === 0) {
    return false
  }

  let domain = Hue.utilz.get_root(src)
  let includes = list.includes(domain) || list.includes(`${domain}/`)

  if (list_type === "allow") {
    if (!includes) {
      return true
    }
  } else if (list_type === "deny") {
    if (includes) {
      return true
    }
  }

  return false
}

// Custom chat search to show links
Hue.show_links = function () {
  Hue.show_chat_search("http:// https://")
}