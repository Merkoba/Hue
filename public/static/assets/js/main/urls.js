// Function to turn url text into actual links
Hue.urlize = function (el, limit_width = true) {
  if (!el) {
    return
  }

  try {
    let html = el.innerHTML

    if (!html) {
      return
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

    function on_matches (matches, html) {
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
Hue.goto_url = function (url, mode, encode = false) {
  if (encode) {
    url = encodeURI(url)
  }
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
    Hue.handled_url = url
    
    let url_el = Hue.el("#handle_url_url")
    url_el.textContent = url
    Hue.urlize(url_el)
    
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
  Hue.ev(Hue.el("#handle_url_chat"), "click", function () {
    Hue.handle_url_chat()
  })

  Hue.ev(Hue.el("#handle_url_image"), "click", function () {
    Hue.load_media_link("image", Hue.handled_url, "")
    Hue.msg_handle_url.close()
  })
  
  Hue.ev(Hue.el("#handle_url_tv"), "click", function () {
    Hue.load_media_link("tv", Hue.handled_url, "")
    Hue.msg_handle_url.close()
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

  Hue.horizontal_separator(Hue.el("#handle_url_titlebar"))
}

// Setups the Open URL picker window
Hue.setup_open_url = function () {  
  Hue.ev(Hue.el("#open_url_menu_load"), "click", function () {
    Hue.load_media(Hue.open_url_data)
  })

  Hue.ev(Hue.el("#open_url_menu_link"), "click", function () {
    Hue.load_media_link(Hue.open_url_data.media_type, Hue.open_url_data.source, Hue.open_url_data.comment)
    Hue.msg_open_url.close()
  })

  Hue.ev(Hue.el("#open_url_menu_context"), "click", function () {
    Hue.chat_search_by_id(Hue.open_url_data.id) 
    Hue.msg_open_url.close()
  })
}

// Shows the Open URL menu
// This is used to show actions for links and media
Hue.open_url_menu = function (data) {
  if (data !== Hue[`loaded_${data.media_type}`] || !Hue.room_state[`${data.media_type}_enabled`]) {
    Hue.el("#open_url_menu_load").textContent = "Load"
  } else {
    Hue.el("#open_url_menu_load").textContent = "Reload"
  }

  if (Hue[`change_${data.media_type}_source`](data.source, true)) {
    Hue.el("#open_url_menu_link").style.display = "inline-block"
  } else {
    Hue.el("#open_url_menu_link").style.display = "none"
  }

  Hue.horizontal_separator(Hue.el("#open_url_titlebar"))

  let el = Hue.el("#open_url_info")

  let size

  if (data.size) {
    size = Hue.utilz.size_string(data.size)
  }

  el.innerHTML = Hue.template_open_url_info({
    title: data.title,
    comment: data.comment,
    url: data.source,
    size: size
  })

  Hue.urlize(el)
  Hue.open_url_data = data

  Hue.msg_open_url.show(function () {
    if (data.title) {
      Hue.ev(Hue.el("#open_url_info_title_title"), "click", function () {
        Hue.open_view_text(Hue.el("#open_url_info_text_title").textContent)
      })
    }
    
    if (data.comment) {
      Hue.ev(Hue.el("#open_url_info_title_comment"), "click", function () {
        Hue.open_view_text(Hue.el("#open_url_info_text_comment").textContent)
      })
    }
    
    if (data.source) {
      Hue.ev(Hue.el("#open_url_info_title_url"), "click", function () {
        Hue.open_view_text(Hue.el("#open_url_info_text_url").textContent)
      })
    }
  })
}

// Replace urls with dummy text
Hue.remove_urls = function (text) {
  let split = text.split(" ")
  let new_words = []
  let hostname = ""

  for (let word of split) {
    if (Hue.utilz.is_url(word)) {
      hostname = Hue.utilz.get_hostname(word)
      let is_image = Hue.utilz.is_image(word)
      let is_video = Hue.utilz.is_video(word)
      let is_audio = Hue.utilz.is_audio(word)

      if (is_video) {
        new_words.push("(Video Link)")
      } else if (is_audio) {
        new_words.push("(Audio Link)")
      } else if (is_image) {
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