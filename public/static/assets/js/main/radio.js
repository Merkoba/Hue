// Setup radios
Hue.setup_radio = function () {
  if (Hue.config.radios.length === 0) {
    return
  }

  for (let radio of Hue.config.radios) {
    Hue.start_radio(radio)
  }
  
  Hue.create_radio_item_volume()
  Hue.apply_radio_volume(Hue.room_state.radio_volume)
  
  Hue.create_radio_item_buttons()
  Hue.fill_radio_queue()

  Hue.el("#footer_radio_icon_container").addEventListener("wheel", function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  })

  Hue.el("#radio_items").addEventListener("wheel", function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  })
}

// Start a radio from a radio object
Hue.start_radio = function (radio) {
  let win = Hue.create_radio_window()
  win.hue_radio_name = radio.name
  win.hue_radio_url = radio.url
  win.hue_radio_metadata = radio.metadata
  win.hue_playing = false
  win.hue_date_started = Date.now()
  win.create()

  win.set_title(radio.name)
  win.set(Hue.template_radio())
  Hue.setup_radio_player(win)

  Hue.el(".radio_reload", win.window).addEventListener("click", function () {
    Hue.clear_radio_metadata(win)
    Hue.get_radio_metadata(win)
    Hue.start_radio_metadata_loop()
  })

  Hue.el(".radio_clipboard", win.window).addEventListener("click", function () {
    Hue.copy_string(Hue.get_radio_string(win))
    Hue.showmsg("Copied to clipboard", true)
  })  

  Hue.el(".radio_search", win.window).addEventListener("click", function () {
    let s = Hue.get_radio_string(win)
    let url = `https://www.youtube.com/results?search_query=${s}`
    Hue.goto_url(url, "tab", true)
  })
  
  Hue.horizontal_separator(Hue.el(".radio_buttons", win.content))
  Hue.create_radio_item(win)
  Hue.radio_windows.push(win)
}

// Get radio player element
Hue.get_radio_player = function (win) {
  return Hue.el(".radio_player", win.content)
}

// Setup events on radio player
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
  for (let w of Hue.radio_windows) {
    if (win && win.hue_radio_url === w.hue_radio_url) {
      continue
    }

    Hue.pause_radio(w)
  }
}

// Apply style to playing radio
Hue.check_radio_playing = function (win) {
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
  if (win.hue_playing) {
    Hue.pause_radio(win)
  } else {
    Hue.play_radio(win)
  }
}

// Play the audio player with a cache-busted url
Hue.play_radio = function (win) {
  Hue.playing_radio = win
  let player = Hue.get_radio_player(win)
  player.src = Hue.utilz.cache_bust_url(win.hue_radio_url)
  player.play()
}

// Pause the audio player
Hue.pause_radio = function (win) {
  Hue.get_radio_player(win).pause()
}

// Fetch a radio's metadata
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
    } else if (out.songs) {
      if (out.songs[0].artist) {
        artist = out.songs[0].artist
      }

      if (out.songs[0].title) {
        title = out.songs[0].title
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
  if (Hue.radio_windows.some(x => x.hue_playing)) {
    Hue.el("#footer_radio_icon").classList.add("rotate")
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_pause"
  } else {
    Hue.el("#footer_radio_icon").classList.remove("rotate")
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_play"
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

  win.hue_radio_item = container
  Hue.el("#radio_items").append(container)
}

// Create a specialized radio button
Hue.create_radio_item_buttons = function (name, on_click) {
  let container = Hue.div("radio_item radio_item_buttons")
  container.innerHTML = Hue.template_radio_item_buttons()

  Hue.el("#radio_button_random", container).addEventListener("click", function () {
    Hue.play_random_radio()
  })

  Hue.el("#radio_button_playstop", container).addEventListener("click", function () {
    if (Hue.playing_radio) {
      Hue.check_radio_play(Hue.playing_radio)
    } else {
      Hue.play_random_radio()
    }
  })
  
  Hue.el("#radio_button_info", container).addEventListener("click", function () {
    if (Hue.playing_radio) {
      Hue.playing_radio.show()
    }
  })

  Hue.el("#radio_items").append(container)
}

// Create volume widget item for radio
Hue.create_radio_item_volume = function () {
  let container = Hue.div("radio_item radio_item_volume")
  container.innerHTML = Hue.template_radio_item_volume()

  Hue.el("#radio_item_volume_icon", container).addEventListener("click", function () {
    Hue.change_radio_volume("down")
  })
  
  Hue.el("#radio_item_volume_text", container).addEventListener("click", function () {
    Hue.change_radio_volume("up")
  })

  Hue.el("#radio_items").append(container)
}

// Increase or decrease radio volume
Hue.change_radio_volume = function (direction) {
  let new_volume = Hue.room_state.radio_volume

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
  
  if (new_volume !== Hue.room_state.radio_volume) {
    Hue.apply_radio_volume(new_volume)
  }
}

// Apply radio volume to all players
Hue.apply_radio_volume = function (volume) {
  for (let win of Hue.radio_windows) {
    let player = Hue.get_radio_player(win)
    player.volume = volume
  }

  if (volume === 0) {
    Hue.el("#radio_item_volume_icon use").href.baseVal = "#icon_volume-mute"
  } else if (volume <= 0.5) {
    Hue.el("#radio_item_volume_icon use").href.baseVal = "#icon_volume-low"
  } else {
    Hue.el("#radio_item_volume_icon use").href.baseVal = "#icon_volume-high"
  }
  
  let vstring = Math.round(volume * 100)
  Hue.el("#radio_item_volume_text").textContent = `Volume: ${vstring}%`
  
  Hue.room_state.radio_volume = volume
  Hue.save_room_state()
}

// Play a random radio station
Hue.play_random_radio = function () {
  let win = Hue.radio_queue.pop()
  
  if (Hue.radio_queue.length === 0) {
    Hue.fill_radio_queue()
  }

  if (win.hue_playing) {
    Hue.play_random_radio()
    return
  }

  Hue.play_radio(win)
}

// Fill items for the random button
Hue.fill_radio_queue = function () {
  Hue.radio_queue = Hue.radio_windows.slice(0)
  Hue.utilz.shuffle_array(Hue.radio_queue)
}

// Get artist title string
Hue.get_radio_string = function (win) {
  let artist = Hue.el(".radio_metadata_artist", win.content).textContent
  let title = Hue.el(".radio_metadata_title", win.content).textContent
  return `${artist} ${title}`.trim()
}