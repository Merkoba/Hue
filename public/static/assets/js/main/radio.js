// Setup radios
Hue.setup_radio = function () {
  if (Hue.config.radios.length === 0) {
    Hue.room_state.radio_enabled = false
    Hue.el("#radio_items").classList.add("nodisplay")
    return
  }

  Hue.playing_radio = Hue.config.radios.find(
    x => x.name === Hue.room_state.last_radio_name
  ) || Hue.config.radios[0]

  Hue.setup_radio_player()
  
  for (let radio of Hue.config.radios) {
    Hue.create_radio_item(radio)
  }
  
  Hue.create_radio_item_volume()
  Hue.apply_radio_volume()
  Hue.create_radio_item_buttons()
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
      let info = Hue.el(".radio_history_info", el).textContent
      Hue.el("#handle_radio_history_info").textContent = info
      Hue.msg_handle_radio_history.show()
    }
  })

  Hue.el("#handle_radio_history_copy").addEventListener("click", function (e) {
    Hue.msg_handle_radio_history.close()
    let el = Hue.handle_radio_history_item
    let info = Hue.el(".radio_history_info", el).textContent
    Hue.copy_string(info)
    Hue.show_info_autoclose("Copied to clipboard")
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
    Hue.el("#main_rows_container").classList.add("reduced_width")
    Hue.fix_frames()
    Hue.goto_bottom(true)
  } else {
    Hue.el("#radio_items").classList.add("nodisplay")
    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star"
    Hue.el("#main_rows_container").classList.remove("reduced_width")
    Hue.fix_frames()
    Hue.goto_bottom(true)
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
Hue.play_radio = function (radio) {
  Hue.push_radio_queue(radio)

  if (Hue.get_setting("stop_tv_on_radio_play")) {
    Hue.stop_tv()
  }
  
  Hue.playing_radio = radio
  Hue.radio_player.src = Hue.utilz.cache_bust_url(radio.url)
  Hue.radio_player.play()
  Hue.apply_radio_item_effects()
  Hue.check_radio_playing()
  Hue.room_state.last_radio_name = radio.name
  Hue.save_room_state()
}

// After radio play
Hue.after_radio_play = function () {
  Hue.apply_radio_item_effects()
  Hue.check_radio_playing()
  Hue.scroll_to_radio_item()
}

// Set radio player
Hue.setup_radio_player = function () {
  Hue.radio_player = new Audio()
  Hue.radio_player.volume = Hue.room_state.radio_volume
  
  Hue.radio_player.addEventListener("play", function (e) {
    Hue.after_radio_play()
  })
  
  Hue.radio_player.addEventListener("pause", function (e) {
    Hue.after_radio_stop()
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
  return Hue.playing_radio.name === radio.name
}

// Stops the audio player
Hue.stop_radio = function () {
  Hue.radio_player.pause()
}

// After stop radio
Hue.after_radio_stop = function () {
  Hue.apply_radio_item_effects()
  Hue.check_radio_playing()
}

// Scroll stations list to playing item
Hue.scroll_to_radio_item = function () {
  if (!Hue.radio_is_playing()) {
    return
  }
  
  let item = Hue.get_radio_item(Hue.playing_radio)
  
  item.scrollIntoView({
    block: "center"
  })
}

// Fetch a radio's metadata
Hue.get_radio_metadata = function () {
  let radio = Hue.playing_radio
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
    } else {
      if (out.songtitle) {
        title = out.songtitle
      }
    }

    if (artist || title) {
      let info = Hue.get_radio_string(artist, title)
      
      for (let el of Hue.els(".radio_history_item")) {
        let station_el = Hue.el(".radio_history_station", el)
        let info_el = Hue.el(".radio_history_info", el)

        if (station_el.textContent.trim() === radio.name && 
          info_el.textContent.trim() === info) {
            el.remove()
            break
        }
      }

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
}

// Check if radio is playing
Hue.radio_is_playing = function () {
  return Hue.radio_player && !Hue.radio_player.paused
}

// Check if radio is playing and perform actions
Hue.check_radio_playing = function () {
  if (Hue.radio_is_playing()) {
    Hue.el("#footer_radio_icon").classList.add("rotate")
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_pause"
  } else {
    Hue.el("#footer_radio_icon").classList.remove("rotate")
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_play"
  }

  Hue.update_input_placeholder()
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
  Hue.radio_player.volume = volume

  if (volume === 0) {
    Hue.el("#radio_item_volume_icon use").href.baseVal = "#icon_volume-mute"
  } else if (volume <= 0.5) {
    Hue.el("#radio_item_volume_icon use").href.baseVal = "#icon_volume-low"
  } else {
    Hue.el("#radio_item_volume_icon use").href.baseVal = "#icon_volume-high"
  }
  
  let vstring = Math.round(volume * 100)
  Hue.el("#radio_item_volume_text").textContent = `Volume: ${vstring}%`

  if (Hue.radio_slided) {
    Hue.flash_info("Radio", `Volume: ${vstring}%`)
  }
  
  Hue.room_state.radio_volume = volume
  Hue.save_room_state()
}

// Play a random radio station
Hue.play_random_radio = function () {
  Hue.play_radio(Hue.get_random_radio())
}

// Get first random radio queue item
Hue.get_random_radio = function () {
  return Hue.radio_queue[0]
}

// Push back played item to end of radio queue
Hue.push_radio_queue = function (radio) {
  for (let [i, r] of Hue.radio_queue.entries()) {
    if (r.name === radio.name) {
      Hue.radio_queue.push(Hue.radio_queue.splice(i, 1)[0])
      break
    }
  }
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
  if (!Hue.playing_radio) {
    return
  }

  Hue.check_radio_play(Hue.playing_radio) 
}

// Show radio metadata window
Hue.show_radio_window = function () {
  Hue.set_radio_window_title()
  Hue.msg_radio_window.show(function () {
    Hue.get_radio_metadata()
    Hue.start_radio_metadata_loop()
  })
}

// Get radio now playing string
Hue.radio_now_playing_string = function () {
  if (Hue.radio_is_playing()) {
    return `Listening to ${Hue.playing_radio.name}`
  } else {
    return ""
  }
}