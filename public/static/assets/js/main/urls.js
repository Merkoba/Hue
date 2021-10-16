jQuery.fn.urlize = function (stop_propagation = true) {

}

// Function to turn url text into actual links
Hue.urlize = function (el, stop_propagation = true) {
  try {
    let html = el.innerHTML

    if (!html || !Hue.utilz.includes_url(html)) {
      return false
    }

    let split = html.split(/\s+/)
    let matches = []
    let reg = /(?:^|\s|<|>)\"?(https?:\/\/(?:[^"|\s|<|>]*)+)/

    for (let s of split) {
      let result = reg.exec(s)

      if (result) {
        matches.push(result[1])
      }
    }

    if (matches.length > 0) {
      on_matches(matches, html)
    }

    function on_matches(matches, html) {
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
        let max = Hue.config.max_displayed_url

        if (u.length > max) {
          u = `${u.substring(0, max)}...`
        }

        html = html.replace(
          rep,
          `<a class="${cls}" target="_blank" href="${url}">${u}</a>`
        )
      }

      el.innerHTML = html

      el.querySelectorAll(".stop_propagation").forEach(function () {
        this.addEventListener("click", function (e) {
          e.stopPropagation()
        })
      })
    }
  } catch (err) {
    console.error(err)
  }
}

// Goes to a url
Hue.goto_url = function (url, mode) {
  if (mode === "tab") {
    window.open(url, "_blank")
  } else {
    Hue.user_leaving = true
    window.location = url
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
      $("#handle_url_comment").trigger("focus")
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

  $("#handle_url_chat").on("click", function () {
    Hue.handle_url_chat()
  })

  $("#handle_url_image").on("click", function () {
    Hue.change_image_source(
      Hue.handled_url_input,
      false,
      Hue.handled_url_comment
    )
    Hue.close_all_modals()
  })

  $("#handle_url_tv").on("click", function () {
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

  Hue.horizontal_separator(Hue.el("#handle_url_container"))
}

// Setups the Open URL picker window
Hue.setup_open_url = function () {
  $("#open_url_menu_open").on("click", function () {
    Hue.goto_url(Hue.open_url_source, "tab")
    Hue.close_all_modals()
  })

  $("#open_url_menu_copy").on("click", function () {
    Hue.copy_string(Hue.open_url_source)
    Hue.close_all_modals()
  })

  $("#open_url_menu_copy_title").on("click", function () {
    Hue.copy_string(Hue.open_url_title)
    Hue.close_all_modals()
  })

  $("#open_url_menu_load").on("click", function () {
    Hue.load_media(Hue.open_url_media_type, Hue.open_url_data)
    Hue.close_all_modals()
  })

  $("#open_url_menu_change").on("click", function () {
    Hue.show_confirm(`Change ${Hue.media_string(Hue.open_url_media_type)}`, 
    "This will change it for everyone", function () {
      Hue[`change_${Hue.open_url_media_type}_source`](Hue.open_url_data.source)
      Hue.close_all_modals()
    })
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
    $("#open_url_menu_load").css("display", "inline-block")

    if (args.data !== Hue[`loaded_${args.media_type}`]) {
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

  Hue.horizontal_separator(Hue.el("#open_url_container"))
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

// Replace urls with dummy text
Hue.remove_urls = function (text) {
  let split = text.split(" ")
  let new_words = []

  for (let word of split) {
    if (Hue.utilz.is_url(word)) {
      let ext = Hue.utilz.get_extension(word).toLowerCase()
      if (Hue.utilz.video_extensions.includes(ext)) {
        new_words.push("(Video Link)")
      } else if (Hue.utilz.audio_extensions.includes(ext)) {
        new_words.push("(Audio Link)")
      } else if (Hue.utilz.image_extensions.includes(ext)) {
        new_words.push("(Image Link)")
      } else {
        new_words.push("(Link)")
      }
    } else {
      new_words.push(word)
    }
  }

  return new_words.join(" ")
}