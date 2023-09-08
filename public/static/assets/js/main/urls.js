// Function to turn url text into actual links
App.urlize = (el, limit_width = true) => {
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
      let cls = `generic action`
      let used_urls = []

      for (let i=0; i<matches.length; i++) {
        let url = matches[i]

        if (used_urls.includes(url)) {
          continue
        }

        used_urls.push(url)

        let rep = new RegExp(
          App.utilz.escape_special_characters(matches[i]),
          `g`
        )

        let u = matches[i]

        if (limit_width) {
          let max = App.config.max_displayed_url

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
  }
  catch (err) {
    console.error(err)
  }
}

// Goes to a url
App.goto_url = (url, mode, encode = false) => {
  if (encode) {
    url = encodeURI(url)
  }
  if (mode === `tab`) {
    window.open(url, url.substring(0, 200))
  }
  else {
    App.user_leaving = true
    window.location = url
  }
}

// Handle URLS
App.handle_url = (url) => {
  if (url) {
    App.check_handle_url_options(url)
    App.handled_url = url

    let url_el = DOM.el(`#handle_url_url`)
    url_el.textContent = url
    App.urlize(url_el)

    App.msg_handle_url.show()
  }
}

// Handle url chat action
App.handle_url_chat = () => {
  App.change_input(App.handled_url)
  App.msg_handle_url.close()
}

// Setups drop listeners
// This is used to display actions when dropping a URL
// Like changing the tv when dropping a YouTube URL
App.setup_drag_events = () => {
  DOM.ev(DOM.el(`#handle_url_chat`), `click`, () => {
    App.handle_url_chat()
  })

  DOM.ev(DOM.el(`#handle_url_image`), `click`, () => {
    App.load_media_link(`image`, App.handled_url, ``)
    App.msg_handle_url.close()
  })

  DOM.ev(DOM.el(`#handle_url_tv`), `click`, () => {
    App.load_media_link(`tv`, App.handled_url, ``)
    App.msg_handle_url.close()
  })
}

// Changes button visibility based on url
App.check_handle_url_options = (text) => {
  if (text && text.length < App.config.max_input_length) {
    DOM.el(`#handle_url_chat`).style.display = `inline-block`
  }
  else {
    DOM.el(`#handle_url_chat`).style.display = `none`
  }

  if (App.change_image_source(text, true)) {
    DOM.el(`#handle_url_image`).style.display = `inline-block`
  }
  else {
    DOM.el(`#handle_url_image`).style.display = `none`
  }

  if (App.change_tv_source(text, true)) {
    DOM.el(`#handle_url_tv`).style.display = `inline-block`
  }
  else {
    DOM.el(`#handle_url_tv`).style.display = `none`
  }

  App.horizontal_separator(DOM.el(`#handle_url_titlebar`))
}

// Setups the Open URL picker window
App.setup_open_url = () => {
  DOM.ev(DOM.el(`#open_url_menu_copy`), `click`, () => {
    App.copy_string(App.open_url_data.source)
  })

  DOM.ev(DOM.el(`#open_url_menu_load`), `click`, () => {
    App.load_media(App.open_url_data)
  })

  DOM.ev(DOM.el(`#open_url_menu_link`), `click`, () => {
    App.load_media_link(App.open_url_data.media_type, App.open_url_data.source, App.open_url_data.comment)
    App.msg_open_url.close()
  })

  DOM.ev(DOM.el(`#open_url_menu_context`), `click`, () => {
    App.chat_search_by_id(App.open_url_data.id)
    App.msg_open_url.close()
  })

  DOM.ev(DOM.el(`#open_url_menu_reply`), `click`, () => {
    let ans = App.get_message_by_id(App.open_url_data.id)

    if (ans) {
      App.start_reply(ans[0])
      App.msg_open_url.close()
    }
  })
}

// Shows the Open URL menu
// This is used to show actions for links and media
App.open_url_menu = (data) => {
  if (data !== App[`loaded_${data.media_type}`] || !App.room_state[`${data.media_type}_enabled`]) {
    DOM.el(`#open_url_menu_load`).textContent = `Load`
  }
  else {
    DOM.el(`#open_url_menu_load`).textContent = `Reload`
  }

  if (App[`change_${data.media_type}_source`](data.source, true)) {
    DOM.el(`#open_url_menu_link`).style.display = `inline-block`
  }
  else {
    DOM.el(`#open_url_menu_link`).style.display = `none`
  }

  App.horizontal_separator(DOM.el(`#open_url_titlebar`))

  let el = DOM.el(`#open_url_info`)

  let size

  if (data.size) {
    size = App.utilz.size_string(data.size)
  }

  el.innerHTML = App.template_open_url_info({
    title: data.title,
    comment: data.comment,
    url: data.source,
    size: size
  })

  App.urlize(el)
  App.open_url_data = data

  App.msg_open_url.show()

  if (data.size) {
    DOM.ev(DOM.el(`#open_url_info_title_size`), `click`, () => {
      App.open_view_text(DOM.el(`#open_url_info_text_size`).textContent)
    })
  }

  if (data.title) {
    DOM.ev(DOM.el(`#open_url_info_title_title`), `click`, () => {
      App.open_view_text(DOM.el(`#open_url_info_text_title`).textContent)
    })
  }

  if (data.comment) {
    DOM.ev(DOM.el(`#open_url_info_title_comment`), `click`, () => {
      App.open_view_text(DOM.el(`#open_url_info_text_comment`).textContent)
    })
  }

  if (data.source) {
    DOM.ev(DOM.el(`#open_url_info_title_url`), `click`, () => {
      App.open_view_text(DOM.el(`#open_url_info_text_url`).textContent)
    })
  }
}

// Replace urls with dummy text
App.remove_urls = (text, show_hostname = true) => {
  let split = text.split(` `)
  let new_words = []
  let hostname = ``

  for (let word of split) {
    if (App.utilz.is_url(word)) {
      hostname = App.utilz.get_hostname(word)
      let is_image = App.utilz.is_image(word)
      let is_video = App.utilz.is_video(word)
      let is_audio = App.utilz.is_audio(word)

      if (is_video) {
        new_words.push(`(Video Link)`)
      }
      else if (is_audio) {
        new_words.push(`(Audio Link)`)
      }
      else if (is_image) {
        new_words.push(`(Image Link)`)
      }
      else {
        new_words.push(`(Link)`)
      }
    }
    else {
      new_words.push(word)
    }
  }

  if (show_hostname && hostname && new_words.length === 1) {
    new_words.push(`(${hostname})`)
  }

  let new_text = new_words.join(` `).replace(
    App.textparser_regexes[`anchor_link`].regex, ``
  )

  return new_text.trim()
}