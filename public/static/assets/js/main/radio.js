// Setup radios
Hue.setup_radio = function () {
  if (Hue.config.radios.length === 0) {
    Hue.room_state.radio_enabled = false
    return
  }

  Hue.playing_radio = {}
  Hue.set_radio_player(Hue.config.radios[0])
  
  for (let radio of Hue.config.radios) {
    Hue.create_radio_item(radio)
  }
  
  Hue.create_radio_item_volume()
  Hue.apply_radio_volume()
  Hue.create_radio_item_buttons()
  Hue.create_radio_dj_controls()
  Hue.fill_radio_queue()

  Hue.el("#footer_radio_icon_container").addEventListener("wheel", function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  })

  Hue.el("#radio_controls").addEventListener("wheel", function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  })

  Hue.el("#radio_items").addEventListener("mouseenter", function () {
    Hue.start_radio_unslide_timeout()
  })

  Hue.el("#radio_items").addEventListener("mouseleave", function () {
    Hue.start_radio_slide_timeout()
  })

  Hue.slide_radio()
  Hue.change_radio_state(Hue.room_state.radio_enabled)
  Hue.setup_radio_window()
}

// Setup the radio window
Hue.setup_radio_window = function () {
  Hue.el("#radio_history").addEventListener("click", function (e) {
    let el = e.target.closest(".radio_history_item")

    if (el) {
      Hue.handle_radio_history_item = el
      Hue.msg_handle_radio_history.show()
    }
  })

  Hue.el("#handle_radio_history_copy").addEventListener("click", function (e) {
    Hue.msg_handle_radio_history.close()
    let el = Hue.handle_radio_history_item
    let info = Hue.el(".radio_history_info", el).textContent
    Hue.copy_string(info)
    Hue.showmsg("Copied to clipboard", true)
  })

  Hue.el("#handle_radio_history_search").addEventListener("click", function (e) {
    Hue.msg_handle_radio_history.close()
    let el = Hue.handle_radio_history_item
    let info = Hue.el(".radio_history_info", el).textContent
    let url = `https://www.youtube.com/results?search_query=${info}`
    Hue.goto_url(url, "tab", true)
  })
}

// Setup radio window title
Hue.set_radio_window_title = function (title = "") {
  if (title) {
    Hue.msg_radio_window.set_title(`Radio History (${title})`)
  } else {
    Hue.msg_radio_window.set_title("Radio History")
  }
}

// Make radio items visible or invisible
Hue.toggle_radio = function () {
  Hue.room_state.radio_enabled = !Hue.room_state.radio_enabled
  Hue.change_radio_state(Hue.room_state.radio_enabled)
  Hue.fix_frames()
  Hue.save_room_state()
}

// Enable or disable radio based on radio enabled
Hue.change_radio_state = function (what) {
  if (what) {
    Hue.el("#radio_items").classList.remove("nodisplay")
    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star-solid"
  } else {
    Hue.el("#radio_items").classList.add("nodisplay")
    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star"
  }
}

// Play or pause radio
Hue.check_radio_play = function (radio) {
  if (Hue.is_playing_radio(radio) && Hue.radio_is_playing()) {
    Hue.stop_radio()
  } else {
    Hue.play_radio(radio)
  }
}

// Play the audio player with a cache-busted url
Hue.play_radio = function (radio, crossfade = true, play = true) {
  if (Hue.radio_crossfading) {
    Hue.cancel_radio_crossfade()
    crossfade = false
  }

  if (Hue.radio_dj_on) {
    Hue.start_radio_dj_timeout()
  }

  if (crossfade && !Hue.radio_just_changed() && Hue.radio_is_playing()) {
    Hue.crossfade_radio(radio)
    return
  }
  
  if (play) {
    Hue.stop_radio()
    Hue.set_radio_player(radio)
    Hue.apply_radio_item_effects()
    Hue.check_radio_playing()
    Hue.playing_radio.player.play()
  }

  Hue.announce_radio()
}

// After radio play
Hue.after_radio_play = function () {
  Hue.playing_radio.playing = true
  Hue.apply_radio_item_effects()
  Hue.check_radio_playing()
  Hue.scroll_to_radio_item()
}

// Set radio player
Hue.set_radio_player = function (radio) {
  Hue.playing_radio.radio = radio
  Hue.playing_radio_date = Date.now()
  Hue.playing_radio.player = new Audio()
  Hue.playing_radio.player.volume = Hue.room_state.radio_volume
  Hue.playing_radio.player.src = Hue.utilz.cache_bust_url(radio.url)
  Hue.playing_radio.playing = false
  
  Hue.playing_radio.player.addEventListener("play", function (e) {
    if (e.target !== Hue.playing_radio.player) {
      return
    }

    Hue.after_radio_play()
  })
  
  Hue.playing_radio.player.addEventListener("pause", function (e) {
    if (e.target !== Hue.playing_radio.player) {
      return
    }

    Hue.after_radio_stop()
  })

  Hue.playing_radio.player.addEventListener("stalled", function (e) {
    if (e.target !== Hue.playing_radio.player) {
      return
    }

    if (Hue.radio_is_playing() && Hue.radio_dj_on) {
      Hue.play_random_radio()
    } else {
      Hue.stop_radio()
    }
  })

  Hue.playing_radio.player.addEventListener("ended", function (e) {
    if (e.target !== Hue.playing_radio.player) {
      return
    }

    if (Hue.radio_is_playing() && Hue.radio_dj_on) {
      Hue.play_random_radio()
    } else {
      Hue.stop_radio()
    }
  })
}

// Apply radio item effects
Hue.apply_radio_item_effects = function () {
  for (let item of Hue.els(".radio_station_item")) {
    let radio = Hue.dataset(item, "radio")

    if (Hue.is_playing_radio(radio) && Hue.radio_is_playing()) {
      item.classList.add("radio_item_playing")
      item.classList.add("glowing")
    } else {
      item.classList.remove("radio_item_playing")
      item.classList.remove("glowing")
    }
  }
}

// Check if it's playing radio
Hue.is_playing_radio = function (radio) {
  return Hue.playing_radio.radio.name === radio.name
}

// Stops the audio player
Hue.stop_radio = function () {
  if (Hue.radio_crossfading) {
    Hue.cancel_radio_crossfade()
  }

  Hue.playing_radio.player.pause()
}

// After stop radio
Hue.after_radio_stop = function () {
  Hue.playing_radio.playing = false
  Hue.apply_radio_item_effects()
  Hue.stop_radio_dj_timeout()
  Hue.check_radio_playing()
}

// Check if radio is freshly played
Hue.radio_just_changed = function () {
  let just_changed = false

  if ( (Date.now() - Hue.playing_radio_date) < ( 10 * 1000) ) {
    just_changed = true
  }

  return just_changed
}

// Scroll stations list to playing item
Hue.scroll_to_radio_item = function () {
  let item = Hue.get_radio_item(Hue.playing_radio.radio)
  
  item.scrollIntoView({
    block: "center"
  })
}

// Fetch a radio's metadata
Hue.get_radio_metadata = function () {
  let radio = Hue.playing_radio.radio
  Hue.loginfo(`Checking metadata: ${radio.metadata}`)
  Hue.set_radio_window_title("Loading...")

  if (!radio.metadata) {
    Hue.set_radio_window_title("Metadata not available")
    return
  }

  fetch(radio.metadata)
  
  .then(res => res.json())
  
  .then(out => {
    let artist = ""
    let title = ""

    if (out.icestats && out.icestats.source) {
      if (Symbol.iterator in Object(out.icestats.source)) {
        let p = new URL(radio.url).pathname.split("/").pop()
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
      if (Array.isArray(out.song)) {
        if (out.song[0].artist) {
          artist = out.song[0].artist
        }
  
        if (out.song[0].title) {
          title = out.song[0].title
        }
      } else {
        if (out.song.artist) {
          artist = out.song.artist
        }
  
        if (out.song.title) {
          title = out.song.title
        }
      }
    } else if (out.songs) {
      if (out.songs[0].artist) {
        artist = out.songs[0].artist
      }

      if (out.songs[0].title) {
        title = out.songs[0].title
      }
    }

    if (artist || title) {
      let info = Hue.get_radio_string(artist, title)
      let exists = false
      
      for (let el of Hue.els(".radio_history_item")) {
        let station_el = Hue.el(".radio_history_station", el)
        let info_el = Hue.el(".radio_history_info", el)

        if (station_el.textContent.trim() === radio.name && 
          info_el.textContent.trim() === info) {
          exists = true
          break
        }
      }

      if (!exists) {
        let date = Date.now()
        let nice_date = Hue.utilz.nice_date(date)
        let item = Hue.div("radio_history_item nice_row dynamic_title modal_item action")
        item.innerHTML = Hue.template_radio_history_item({station: radio.name})

        // This is to deal with html unicode like &#12375;&#12375;
        Hue.el(".radio_history_info", item).innerHTML = Hue.utilz.make_html_safe(info)

        item.title = nice_date
        Hue.dataset(item, "date", date)
        Hue.dataset(item, "otitle", nice_date)
        Hue.horizontal_separator(item)
        Hue.el("#radio_history").prepend(item)

        let items = Hue.els(".radio_history_item")

        if (items.length > Hue.config.radio_history_crop_limit) {
          items.slice(-1)[0].remove()
        }
      }

      Hue.set_radio_window_title()
    } else {
      Hue.set_radio_window_title("Metadata not available")
    }
  })

  .catch(err => {
    Hue.set_radio_window_title("Metadata not available")
  })
}

// Start metadata loop while radio audio window is open
Hue.start_radio_metadata_loop = function () {
  Hue.stop_radio_metadata_loop()

  Hue.radio_metadata_interval = setInterval(function () {
    Hue.get_radio_metadata()
  }, Hue.config.radio_metadata_check_delay)
}

// Stop metadata check loop
Hue.stop_radio_metadata_loop = function () {
  clearInterval(Hue.radio_metadata_interval)
  Hue.radio_metadata_interval = undefined
}

// Check if radio is playing
Hue.radio_is_playing = function () {
  return Hue.playing_radio.playing
}

// Check if radio is playing and perform actions
Hue.check_radio_playing = function () {
  if (Hue.radio_is_playing()) {
    Hue.el("#footer_radio_icon").classList.add("rotate")
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_pause"
    Hue.update_input_placeholder(`Listening to ${Hue.playing_radio.radio.name}`)
  } else {
    Hue.el("#footer_radio_icon").classList.remove("rotate")
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_play"
    Hue.update_input_placeholder()
  }
}

// Create a radio item
Hue.create_radio_item = function (radio) {
  let container = Hue.div("radio_item radio_station_item action")
  container.innerHTML = Hue.template_radio_item()
  
  let icon = Hue.el(".radio_item_icon", container)
  jdenticon.update(icon, radio.name)
  
  let name = Hue.el(".radio_item_name", container)
  name.textContent = radio.name
  
  container.addEventListener("click", function () {
    Hue.check_radio_play(radio)
  })

  Hue.dataset(container, "radio", radio)
  Hue.el("#radio_stations").append(container)
}

// Get radio item
Hue.get_radio_item = function (radio) {
  for (let el of Hue.els(".radio_station_item")) {
    if (Hue.dataset(el, "radio").name === radio.name) {
      return el
    }
  }
}

// Create a specialized radio button
Hue.create_radio_item_buttons = function (name, on_click) {
  let container = Hue.div("radio_item")
  container.id = "radio_item_buttons"
  container.innerHTML = Hue.template_radio_item_buttons()

  Hue.el("#radio_button_random", container).addEventListener("click", function () {
    Hue.play_random_radio()
  })

  Hue.el("#radio_button_dj", container).addEventListener("click", function () {
    Hue.toggle_radio_dj()
  })

  Hue.el("#radio_button_playstop", container).addEventListener("click", function () {
    Hue.radio_playstop()
  })
  
  Hue.el("#radio_button_info", container).addEventListener("click", function () {
    Hue.show_radio_window()
  })

  Hue.el("#radio_controls").append(container)
}

// Create volume widget item for radio
Hue.create_radio_item_volume = function () {
  let container = Hue.div("radio_item")
  container.id = "radio_item_volume"
  container.innerHTML = Hue.template_radio_item_volume()

  Hue.el("#radio_item_volume_icon", container).addEventListener("click", function () {
    Hue.change_radio_volume("down", 0.25)
  })
  
  Hue.el("#radio_item_volume_text", container).addEventListener("click", function () {
    Hue.change_radio_volume("up", 0.25)
  })

  Hue.el("#radio_controls").append(container)
}

// Increase or decrease radio volume
Hue.change_radio_volume = function (direction, amount = 0.05) {
  let new_volume = Hue.room_state.radio_volume
  
  if (direction === "up") {
    new_volume += amount  

    if (new_volume > 1) {
      new_volume = 1
    }
  } else if (direction === "down") {
    new_volume -= amount

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
Hue.apply_radio_volume = function (volume = Hue.room_state.radio_volume) {
  Hue.playing_radio.player.volume = volume

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
  Hue.play_radio(Hue.get_random_radio())
}

// Get random radio station
Hue.get_random_radio = function () {
  let radio = Hue.radio_queue.pop()
  
  if (Hue.radio_queue.length === 0) {
    Hue.fill_radio_queue()
  }

  if (Hue.radio_queue.length > 1) {
    if (Hue.is_playing_radio(radio)) {
      return Hue.get_random_radio()
    }
  }

  return radio
}

// Fill items for the random button
Hue.fill_radio_queue = function () {
  Hue.radio_queue = Hue.config.radios.slice(0)
  Hue.utilz.shuffle_array(Hue.radio_queue)
}

// Get artist title string
Hue.get_radio_string = function (artist, title) {
  if (artist && title) {
    return `${artist} - ${title}`.trim()
  } else if (artist) {
    return artist
  } else if (title) {
    return title
  }
}

// Clear slide timeouts
Hue.clear_radio_slide_timeouts = function () {
  clearTimeout(Hue.radio_slide_timeout)
  clearTimeout(Hue.radio_unslide_timeout)
}

// Start slide timeout
Hue.start_radio_slide_timeout = function () {
  Hue.clear_radio_slide_timeouts()
  Hue.radio_slide_timeout = setTimeout(function () {
    Hue.slide_radio()
  }, Hue.config.radio_slide_delay)
}

// Start unslide timeout
Hue.start_radio_unslide_timeout = function () {
  Hue.clear_radio_slide_timeouts()
  Hue.radio_unslide_timeout = setTimeout(function () {
    Hue.unslide_radio()
  }, Hue.config.radio_unslide_delay)
}

// Slide the radio to the side
Hue.slide_radio = function () {
  if (Hue.radio_slided) {
    return
  }

  Hue.clear_radio_slide_timeouts()
  Hue.el("#radio_items").classList.add("radio_slide")
  Hue.scroll_to_radio_item()
  Hue.radio_slided = true
}

// Reveal the radio fully 
Hue.unslide_radio = function () {
  if (!Hue.radio_slided) {
    return
  }

  Hue.clear_radio_slide_timeouts()
  Hue.el("#radio_items").classList.remove("radio_slide")
  Hue.scroll_to_radio_item()
  Hue.radio_slided = false
}

// Play or stop the radio
// Select random item if none is playing
Hue.radio_playstop = function () {
  Hue.check_radio_play(Hue.playing_radio.radio) 
}

// Send a message to others that you started a radio
Hue.announce_radio = function () {
  Hue.socket_emit("announce_radio", {name: Hue.playing_radio.radio.name})
}

// Show when another user announces their radio
Hue.show_announce_radio = function (data) {
  if (Hue.userlist.length <= Hue.config.max_low_users) {
    Hue.show_action_notification(`${data.username} is listening to: ${data.name}`, "star", function () {
      Hue.play_radio_by_name(data.name)
    })
  }
}

// Play a radio by its name
Hue.play_radio_by_name = function (name) {
  for (let radio of Hue.config.radios) {
    if (radio.name === name) {
      Hue.play_radio(radio)
      return
    }
  }
}

// Toggle the radio auto dj
Hue.toggle_radio_dj = function (what) {
  if (what !== undefined) {
    Hue.radio_dj_on = what
  } else {
    Hue.radio_dj_on = !Hue.radio_dj_on
  }
  
  if (Hue.radio_dj_on) {
    Hue.el("#radio_button_dj").classList.add("underlined")
    
    if (!Hue.radio_is_playing()) {
      Hue.play_random_radio()
    } else {
      Hue.start_radio_dj_timeout()
    }

    Hue.radio_dj_flash_info()
    Hue.show_radio_dj_controls()
  } else {
    Hue.el("#radio_button_dj").classList.remove("underlined")
    Hue.hide_radio_dj_controls()
    Hue.stop_radio_dj_timeout()
  }
}

// Stop radio dj interval
Hue.stop_radio_dj_timeout = function () {
  clearTimeout(Hue.radio_dj_timeout)
}

// Start the radio dj interval
Hue.start_radio_dj_timeout = function () {
  Hue.stop_radio_dj_timeout()

  Hue.radio_dj_timeout = setInterval(function () {
    if (Hue.radio_dj_on && Hue.radio_is_playing()) {
      Hue.play_random_radio()
    }
  }, Hue.room_state.radio_dj_delay * 60 * 1000)
}

// Crossfade two radio stations
Hue.crossfade_radio = function (radio) {
  if (Hue.radio_crossfading) {
    return
  }

  Hue.radio_crossfading = true
  let max_volume = Hue.room_state.radio_volume

  Hue.radio_crossfade_player_1 = Hue.playing_radio.player
  Hue.set_radio_player(radio)
  Hue.radio_crossfade_player_2 = Hue.playing_radio.player
  Hue.radio_crossfade_player_2.volume = 0
  Hue.radio_crossfade_player_2.play()

  Hue.radio_crossfade_timeout = setTimeout(function () {
    Hue.radio_crossfade_interval = setInterval(function () {
      let p = max_volume * 0.01
      Hue.radio_crossfade_player_1.volume = Math.max(Hue.radio_crossfade_player_1.volume - p, 0)
      Hue.radio_crossfade_player_2.volume = Math.min(Hue.radio_crossfade_player_2.volume + p, 1)
  
      if (Hue.radio_crossfade_player_1.volume <= 0 && 
        Hue.radio_crossfade_player_2.volume >= max_volume) {
        clearInterval(Hue.radio_crossfade_interval)
        Hue.radio_crossfade_player_1.pause()
        Hue.radio_crossfade_player_1 = undefined
        Hue.radio_crossfading = false
        Hue.play_radio(radio, false, false)
      }
    }, 80)
  }, 500)
}

// Stop a radio crossfade
Hue.cancel_radio_crossfade = function () {
  clearTimeout(Hue.radio_crossfade_timeout)
  clearInterval(Hue.radio_crossfade_interval)
  Hue.radio_crossfade_player_1.pause()
  Hue.radio_crossfade_player_1 = undefined
  Hue.radio_crossfade_player_2.pause()
  Hue.radio_crossfade_player_2 = undefined
  Hue.radio_crossfading = false
}

// Show radio metadata window
Hue.show_radio_window = function () {
  Hue.set_radio_window_title()
  Hue.msg_radio_window.show(function () {
    Hue.get_radio_metadata()
    Hue.start_radio_metadata_loop()
  })
}

// Show radio dj controls
Hue.show_radio_dj_controls = function () {
  Hue.el("#radio_item_dj").style.display = "flex"
}

// Hide radio dj controls
Hue.hide_radio_dj_controls = function () {
  Hue.el("#radio_item_dj").style.display = "none"
}

// Create the dj controls
Hue.create_radio_dj_controls = function () {
  let container = Hue.div("radio_item")
  container.id = "radio_item_dj"
  container.innerHTML = Hue.template_radio_item_dj()
  let select = Hue.el("#radio_dj_delay_select", container)
  
  select.addEventListener("change", function () {
    Hue.room_state.radio_dj_delay = parseInt(select.value)
    Hue.save_room_state()

    if (Hue.radio_dj_on) {
      Hue.start_radio_dj_timeout()
      Hue.radio_dj_flash_info()
    }
  })

  Hue.els("option", select).forEach(it => {
    if (it.value == Hue.room_state.radio_dj_delay) {
      it.selected = true
    }
  })

  Hue.el("#radio_controls").append(container)
}

// Show a radio dj flash info
Hue.radio_dj_flash_info = function () {
  let m = Hue.room_state.radio_dj_delay
  Hue.flash_info("Radio DJ", `Radio stations will change automatically every ${m} minutes`)
}