// Function to turn url text into actual links
Hue.urlize = function (el) {
  if (!el) {
    return false
  }
  
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
    Hue.el("#handle_url_input").value = text
    Hue.el("#handle_url_comment").value = ""
    Hue.handled_url_input = text
    Hue.handled_url_comment = ""
    Hue.msg_handle_url.show(function () {
      Hue.el("#handle_url_comment").focus()
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
  Hue.el("#main_container").addEventListener("drop", function (e) {
    Hue.handle_url(e.dataTransfer.getData("text/plain").trim())
  })

  Hue.el("#handle_url_chat").addEventListener("click", function () {
    Hue.handle_url_chat()
  })

  Hue.el("#handle_url_image").addEventListener("click", function () {
    Hue.change_image_source(
      Hue.handled_url_input,
      false,
      Hue.handled_url_comment
    )
    Hue.close_all_modals()
  })

  Hue.el("#handle_url_tv").addEventListener("click", function () {
    Hue.change_tv_source(Hue.handled_url_input, false, Hue.handled_url_comment)
    Hue.close_all_modals()
  })

  Hue.el("#handle_url_input").addEventListener("input blur", function () {
    Hue.handled_url_input = this.value.trim()
    Hue.el("#handle_url_input").value = Hue.handled_url_input
    Hue.check_handle_url_options(Hue.handled_url_input)
  })

  Hue.el("#handle_url_comment").addEventListener("input blur", function () {
    Hue.handled_url_comment = this.value.substring(0, Hue.config.max_media_comment_length)
    Hue.el("#handle_url_comment").value = Hue.handled_url_comment
  })
}

// Changes button visibility based on url
Hue.check_handle_url_options = function (text) {
  if (text && text.length < Hue.config.max_input_length) {
    Hue.el("#handle_url_chat").style.display = "inline-block"
  } else {
    Hue.el("#handle_url_chat").style.display = "none"
  }

  if (Hue.change_image_source(text, true)) {
    Hue.el("#handle_url_image").style.display = "inline-block"
  } else {
    Hue.el("#handle_url_image").style.display = "none"
  }

  if (Hue.change_tv_source(text, true)) {
    Hue.el("#handle_url_tv").style.display = "inline-block"
  } else {
    Hue.el("#handle_url_tv").style.display = "none"
  }

  Hue.horizontal_separator(Hue.el("#handle_url_container"))
}

// Setups the Open URL picker window
Hue.setup_open_url = function () {
  Hue.el("#open_url_menu_open").addEventListener("click", function () {
    Hue.goto_url(Hue.open_url_source, "tab")
    Hue.close_all_modals()
  })

  Hue.el("#open_url_menu_copy").addEventListener("click", function () {
    Hue.copy_string(Hue.open_url_source)
    Hue.close_all_modals()
  })

  Hue.el("#open_url_menu_copy_title").addEventListener("click", function () {
    Hue.copy_string(Hue.open_url_title)
    Hue.close_all_modals()
  })

  Hue.el("#open_url_menu_load").addEventListener("click", function () {
    Hue.load_media(Hue.open_url_media_type, Hue.open_url_data)
    Hue.close_all_modals()
  })

  Hue.el("#open_url_menu_change").addEventListener("click", function () {
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
    Hue.el("#open_url_menu_copy_title").style.display = "inline-block"
  } else {
    Hue.el("#open_url_menu_copy_title").style.display = "none"
  }

  if (args.media_type && args.data) {
    Hue.el("#open_url_menu_load").style.display = "inline-block"

    if (args.data !== Hue[`loaded_${args.media_type}`]) {
      Hue.el("#open_url_menu_load").textContent = "Load"
    } else {
      Hue.el("#open_url_menu_load").textContent = "Reload"
    }

    if (Hue[`change_${args.media_type}_source`](args.source, true)) {
      Hue.el("#open_url_menu_change").style.display = "inline-block"
    } else {
      Hue.el("#open_url_menu_change").style.display = "none"
    }
  } else {
    Hue.el("#open_url_menu_load").style.display = "none"
    Hue.el("#open_url_menu_change").style.display = "none"
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
  let hostname = ""

  for (let word of split) {
    if (Hue.utilz.is_url(word)) {
      hostname = new URL(word).hostname
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

  if (new_words.length === 1) {
    new_words.push(`(${hostname})`)
  }  

  return new_words.join(" ")
}