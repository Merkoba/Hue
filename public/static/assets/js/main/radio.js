// Setup radios
Hue.setup_radio = function () {
  for (let radio of Hue.config.radios) {
    Hue.start_radio(radio)
  }
}

// Start a radio
Hue.start_radio = function (radio) {
  if (!radio) {
    return
  }

  try {
    new URL(radio.url)
  } catch (err) {
    return
  }

  let win = Hue.create_radio_window()
  win.hue_radio_name = radio.name
  win.hue_radio_url = radio.url
  win.hue_radio_metadata = radio.metadata
  win.hue_last_open = 0
  win.hue_playing = false
  win.hue_date_started = Date.now()
  win.create()

  win.set_title(radio.name)
  win.set(Hue.template_radio({url: Hue.utilz.cache_bust_url(radio.url)}))
  Hue.setup_radio_player(win)
  
  Hue.el(".radio_reload", win.window).addEventListener("click", function () {
    Hue.clear_radio_metadata(win)
    Hue.get_radio_metadata(win)
    Hue.start_radio_metadata_loop()
  })

  Hue.el(".radio_clipboard", win.window).addEventListener("click", function () {
    let artist = Hue.el(".radio_metadata_artist", win.content).textContent
    let title = Hue.el(".radio_metadata_title", win.content).textContent
    let s = `${artist} ${title}`.trim()
    Hue.copy_string(s)
    Hue.showmsg("Copied to clipboard", true)
  })
  
  Hue.horizontal_separator(Hue.el(".radio_buttons", win.content))
  Hue.create_radio_popup(win)
}

// Check if modal instance is radio
Hue.is_radio = function (instance) {
  if (instance && instance.window) {
    return instance.window.classList.contains("radio_window")
  }
}

// Check if modal instance is radio popup
Hue.is_radio_popup = function (instance) {
  if (instance && instance.window) {
    return instance.window.classList.contains("radio_popup_window")
  }
}

// Get open radios
Hue.get_open_radios = function (sortmode = "last_open") {
  let radios = []

  for (let instance of Hue.msg_main_menu.higher_instances()) {
    if (instance.window) {
      if (Hue.is_radio(instance)) {
        radios.push(instance)
      }
    }
  }

  if (sortmode === "last_open") {
    radios.sort((a, b) => (a.hue_last_open > b.hue_last_open) ? -1 : 1)
  } else if (sortmode === " date_started") {
    radios.sort((a, b) => (a.hue_date_started > b.hue_date_started) ? -1 : 1)
  }

  return radios
}

// Get open radios
Hue.get_open_radio_popups = function () {
  let popups = []

  for (let instance of Hue.msg_main_menu.lower_instances()) {
    if (instance.window) {
      if (Hue.is_radio_popup(instance)) {
        popups.push(instance)
      }
    }
  }

  return popups
}

// Get radio player
Hue.get_radio_player = function (win) {
  return Hue.el(".radio_player", win.content)
}

// Setup radio player
Hue.setup_radio_player = function (win) {
  let player = Hue.get_radio_player(win)
    
  player.addEventListener("play", function () {
    Hue.stop_radio_players(win)
    win.hue_playing = true
    Hue.radio_playing(win)
  })
  
  player.addEventListener("pause", function () {
    win.hue_playing = false
    Hue.radio_playing(win)
  })  
}

// Stop all radio players except active one
Hue.stop_radio_players = function (win) {
  for (let w of Hue.get_open_radios()) {
    if (win && win.hue_radio_url === w.hue_radio_url) {
      continue
    }

    Hue.get_radio_player(w).pause()
  }
}

// Set an radio as playing or not playing
Hue.radio_playing = function (win) {
  if (!win.hue_radio_popup) {
    return
  }

  if (win.hue_playing) {
    win.hue_radio_popup.window.classList.add("radio_popup_playing")
    win.hue_radio_popup.window.classList.add("glowing")
  } else {
    win.hue_radio_popup.window.classList.remove("radio_popup_playing")
    win.hue_radio_popup.window.classList.remove("glowing")
  }

  Hue.check_any_radio_playing()
}

// Make radio popups visible or invisible
Hue.toggle_radio_popups = function () {
  if (Hue.radio_popups_visible) {
    Hue.radio_popups_visible = false

    for (let win of Hue.get_open_radios()) {
      win.hue_radio_popup.close()
      win.hue_radio_popup = undefined
    }

    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star"
  } else {
    Hue.radio_popups_visible = true

    for (let win of Hue.get_open_radios("date_started")) {
      Hue.create_radio_popup(win)
    }

    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star-solid"
  }
}

// Play or pause radio
Hue.check_radio_play = function (win) {
  let player = Hue.get_radio_player(win)

  if (win.hue_playing) {
    player.pause()
  } else {
    player.src = Hue.utilz.cache_bust_url(win.hue_radio_url)
    player.play()
  }
}

// Remove an radio modal instance
Hue.remove_radio = function (win) {
  win.close()
  win.destroy()
  win.hue_radio_popup = undefined
}

// Increase or decrease radio volume
Hue.change_radio_volume = function (win, direction) {
  let player = Hue.get_radio_player(win)
  let new_volume = player.volume

  if (direction === "up") {
    new_volume += 0.05  
    
    if (new_volume > 1) {
      new_volume = 1
    }
  } else if (direction === "down") {
    new_volume -= 0.05  
    
    if (new_volume < 0) {
      new_volume = 0
    }
  }

  new_volume = Hue.utilz.round(new_volume, 2)
  new_volume_p = Math.round(new_volume * 100)
  player.volume = new_volume
  Hue.flash_info(`Volume: ${new_volume_p}%`, win.hue_radio_name)
}

// Try to fetch active radio metadata
Hue.get_radio_metadata = function (win) {
  Hue.loginfo(`Checking metadata: ${win.hue_radio_url}`)

  let artist_el = Hue.el(".radio_metadata_artist", win.content)
  let title_el = Hue.el(".radio_metadata_title", win.content)
  
  if (artist_el.textContent === "" && title_el.textContent === "") {
    artist_el.style.display = "initial"
    artist_el.textContent = "Loading..."
    title_el.style.display = "none"
  }

  fetch(win.hue_radio_metadata)
  
  .then(res => res.json())
  
  .then(out => {
    let artist = ""
    let title = ""

    if (out.icestats && out.icestats.source) {
      if (Symbol.iterator in Object(out.icestats.source)) {
        let p = new URL(win.hue_radio_url).pathname.split("/").pop()
        for (let source of out.icestats.source) {
          if (source.listenurl.includes(p) && (source.artist || source.title)) {
            if (source.artist) {
              artist = source.artist
            }

            if (source.title) {
              title = source.title
            }
            
            break
          }
        }
      } else {
        artist = out.icestats.source.artist
        title = out.icestats.source.title
      }
    } else if (out.song) {
      if (out.song.artist) {
        artist = out.song.artist
      }

      if (out.song.title) {
        title = out.song.title
      }
    }

    if (artist) {
      artist_el.innerHTML = Hue.utilz.make_html_safe(artist)
      artist_el.style.display = "initial"
    } else {
      artist_el.textContent = ""
      artist_el.style.display = "none"
    }

    if (title) {
      title_el.innerHTML = Hue.utilz.make_html_safe(title)
      title_el.style.display = "initial"
    } else {
      title_el.textContent = ""
      title_el.style.display = "none"
    }
  })

  .catch(err => {})
}

// Start metadata loop while radio audio window is open
Hue.start_radio_metadata_loop = function (win) {
  Hue.stop_radio_metadata_loop()

  Hue.radio_metadata_interval = setInterval(function () {
    Hue.get_radio_metadata(win)
  }, Hue.config.radio_metadata_check_delay)
}

// Stop metadata check loop
Hue.stop_radio_metadata_loop = function () {
  clearInterval(Hue.radio_metadata_interval)
  Hue.radio_metadata_interval = undefined
}

// Check if any radio is playing
Hue.check_any_radio_playing = function () {
  let any_playing = false

  for (let w of Hue.get_open_radios()) {
    if (w.hue_playing) {
      any_playing = true
      break
    }
  }

  if (any_playing) {
    Hue.el("#footer_radio_icon_container").classList.add("rotate")
  } else {
    Hue.el("#footer_radio_icon_container").classList.remove("rotate")
  }
}

// Clear radio metadata window
Hue.clear_radio_metadata = function (win) {
  Hue.el(".radio_metadata_artist", win.content).textContent = ""
  Hue.el(".radio_metadata_title", win.content).textContent = ""
}