// Setup radios
Hue.setup_radio = function () {
  for (let radio of Hue.config.radios) {
    Hue.start_radio(radio)
  }

  Hue.el("#footer_radio_icon_container").addEventListener("wheel", function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  })

  Hue.el("#radio_items").addEventListener("wheel", function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  })
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
  Hue.create_radio_item(win)
}

// Check if modal instance is radio
Hue.is_radio = function (instance) {
  if (instance && instance.window) {
    return instance.window.classList.contains("radio_window")
  }
}

// Check if modal instance is radio item
Hue.is_radio_item = function (instance) {
  if (instance && instance.window) {
    return instance.window.classList.contains("radio_item_window")
  }
}

// Get open radios
Hue.get_open_radios = function () {
  let radios = []

  for (let instance of Hue.msg_main_menu.higher_instances()) {
    if (instance.window) {
      if (Hue.is_radio(instance)) {
        radios.push(instance)
      }
    }
  }

  return radios
}

// Get open radios
Hue.get_open_radio_items = function () {
  let items = []

  for (let instance of Hue.msg_main_menu.lower_instances()) {
    if (instance.window) {
      if (Hue.is_radio_item(instance)) {
        items.push(instance)
      }
    }
  }

  return items
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
    Hue.check_radio_playing(win)
    Hue.check_any_radio_playing()
  })
  
  player.addEventListener("pause", function () {
    win.hue_playing = false
    Hue.check_radio_playing(win)
    Hue.check_any_radio_playing()
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

// Apply style to playing radio
Hue.check_radio_playing = function (win) {
  if (!win.hue_radio_item) {
    return
  }

  if (win.hue_playing) {
    win.hue_radio_item.classList.add("radio_item_playing")
    win.hue_radio_item.classList.add("glowing")
  } else {
    win.hue_radio_item.classList.remove("radio_item_playing")
    win.hue_radio_item.classList.remove("glowing")
  }
}

// Make radio items visible or invisible
Hue.toggle_radio_items = function () {
  if (Hue.radio_items_visible) {
    Hue.el("#radio_items").classList.add("nodisplay")
    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star"
  } else {
    Hue.el("#radio_items").classList.remove("nodisplay")
    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star-solid"
  }

  Hue.radio_items_visible = !Hue.radio_items_visible
}

// Play or pause radio
Hue.check_radio_play = function (win) {
  let player = Hue.get_radio_player(win)

  if (win.hue_playing) {
    player.pause()
  } else {
    Hue.active_radio = win
    player.src = Hue.utilz.cache_bust_url(win.hue_radio_url)
    player.play()
  }
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
    Hue.el("#footer_radio_icon").classList.add("rotate")
  } else {
    Hue.el("#footer_radio_icon").classList.remove("rotate")
  }
}

// Clear radio metadata window
Hue.clear_radio_metadata = function (win) {
  Hue.el(".radio_metadata_artist", win.content).textContent = ""
  Hue.el(".radio_metadata_title", win.content).textContent = ""
}

// Create radio item
Hue.create_radio_item = function (win) {
  let container = Hue.div("radio_item action")
  container.innerHTML = Hue.template_radio_item()
  container.title = win.hue_radio_url
  
  let icon = Hue.el(".radio_item_icon", container)
  jdenticon.update(icon, win.hue_radio_name)
  
  let name = Hue.el(".radio_item_name", container)
  name.textContent = win.hue_radio_name
  
  container.addEventListener("click", function (e) {
    if (e.target.closest(".radio_item_icon_container")) {
      win.show()
    } else {
      Hue.check_radio_play(win)
    }
  })

  Hue.check_radio_playing(win)
  Hue.check_any_radio_playing()
  Hue.el("#radio_items").append(container)
  win.hue_radio_item = container
}

// Increase or decrease radio volume
Hue.change_radio_volume = function (direction) {
  let new_volume = Hue.radio_volume

  if (direction === "up") {
    new_volume += 0.1  

    if (new_volume > 1) {
      new_volume = 1
    }
  } else if (direction === "down") {
    new_volume -= 0.1

    if (new_volume < 0) {
      new_volume = 0
    }
  }

  new_volume = Hue.utilz.round(new_volume, 2)
  new_volume_p = Math.round(new_volume * 100)
  Hue.radio_volume = new_volume

  for (let win of Hue.get_open_radios()) {
    let player = Hue.get_radio_player(win)
    player.volume = new_volume
  }

  Hue.flash_info(`Volume: ${new_volume_p}%`, "Radio")
}