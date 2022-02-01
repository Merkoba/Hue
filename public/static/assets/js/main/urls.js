// Function to turn url text into actual links
Hue.urlize = function (el, limit_width = true) {
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

        if (limit_width) {
          let max = Hue.config.max_displayed_url
  
          if (u.length > max) {
            u = `${u.substring(0, max)}...`
          }
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
Hue.handle_url = function (url) {
  if (url) {
    Hue.check_handle_url_options(url)
    let url_el = Hue.el("#handle_url_url")
    url_el.textContent = url
    Hue.urlize(url_el, false)
    Hue.handled_url = url
    Hue.msg_handle_url.show()
  }
}

// Handle url chat action
Hue.handle_url_chat = function () {
  Hue.change_input(Hue.handled_url)
  Hue.msg_handle_url.close()
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
    Hue.load_media_picker("image", Hue.handled_url, "")
    Hue.msg_handle_url.close()
  })
  
  Hue.el("#handle_url_tv").addEventListener("click", function () {
    Hue.load_media_picker("tv", Hue.handled_url, "")
    Hue.msg_handle_url.close()
  })

  Hue.el("#handle_url_url").addEventListener("input blur", function () {
    Hue.handled_url = this.value.trim()
    Hue.el("#handle_url_url").value = Hue.handled_url
    Hue.check_handle_url_options(Hue.handled_url)
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
  Hue.el("#open_url_menu_view_url").addEventListener("click", function () {
    Hue.open_view_text(Hue.open_url_data.source)
  })
  
  Hue.el("#open_url_menu_view_title").addEventListener("click", function () {
    Hue.open_view_text(Hue.open_url_data.title)
  })

  Hue.el("#open_url_menu_view_comment").addEventListener("click", function () {
    Hue.open_view_text(Hue.open_url_data.comment)
  })

  Hue.el("#open_url_menu_load").addEventListener("click", function () {
    Hue.load_media(Hue.open_url_data)
  })

  Hue.el("#open_url_menu_change").addEventListener("click", function () {
    Hue.load_media_picker(Hue.open_url_data.media_type, Hue.open_url_data.source, Hue.open_url_data.comment)
    Hue.msg_open_url.close()
  })

  Hue.el("#open_url_menu_jump").addEventListener("click", function () {
    Hue.jump_to_chat_message(Hue.open_url_data.message_id) 
    Hue.msg_open_url.close()
  })  
}

// Shows the Open URL menu
// This is used to show actions for links and media
Hue.open_url_menu = function (data) {
  if (data.title) {
    Hue.el("#open_url_menu_view_title").style.display = "inline-block"
  } else {
    Hue.el("#open_url_menu_view_title").style.display = "none"
  }

  if (data.comment) {
    Hue.el("#open_url_menu_view_comment").style.display = "inline-block"
  } else {
    Hue.el("#open_url_menu_view_comment").style.display = "none"
  }

  if (data !== Hue[`loaded_${data.media_type}`]) {
    Hue.el("#open_url_menu_load").textContent = "Load"
  } else {
    Hue.el("#open_url_menu_load").textContent = "Reload"
  }

  if (Hue[`change_${data.media_type}_source`](data.source, true)) {
    Hue.el("#open_url_menu_change").style.display = "inline-block"
  } else {
    Hue.el("#open_url_menu_change").style.display = "none"
  }

  Hue.horizontal_separator(Hue.el("#open_url_container"))
  
  let title = Hue.utilz.get_limited_string(
    data.source,
    Hue.config.url_title_max_length
  )
    
  Hue.open_url_data = data
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

  if (hostname && new_words.length === 1) {
    new_words.push(`(${hostname})`)
  }  

  return new_words.join(" ")
}