// Setup radios
Hue.setup_radio = function () {
  if (Hue.config.radios.length === 0) {
    Hue.radio_disabled = true
    Hue.el("#radio_items").classList.add("nodisplay")
    return
  }

  Hue.radio_visible = false

  Hue.playing_radio = Hue.config.radios.find(
    x => x.name === Hue.room_state.last_radio_name
  ) || Hue.config.radios[0]

  Hue.setup_radio_player()
  
  for (let radio of Hue.config.radios) {
    Hue.create_radio_item(radio)
  }
  
  Hue.create_radio_item_buttons()
  Hue.apply_radio_volume()
  Hue.fill_radio_queue()

  let wheel_func = function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  }

  Hue.ev(Hue.el("#radio_button_volume"), "wheel", wheel_func)

  Hue.ev(Hue.el("#radio_items"), "mouseleave", function () {
    Hue.start_hide_radio()
  })

  Hue.ev(Hue.el("#radio_items"), "mouseenter", function () {
    Hue.stop_hide_radio()
  })
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
  Hue.highlight_radio_footer()
}

// Set radio player
Hue.setup_radio_player = function () {
  Hue.radio_player = new Audio()
  Hue.radio_player.volume = Hue.room_state.radio_volume
  
  Hue.ev(Hue.radio_player, "play", function (e) {
    Hue.after_radio_play()
  })
  
  Hue.ev(Hue.radio_player, "pause", function (e) {
    Hue.after_radio_stop()
  })
}

// Apply radio item effects
Hue.apply_radio_item_effects = function () {
  for (let item of Hue.els(".radio_station_item")) {
    let radio = Hue.dataset(item, "radio")

    if (Hue.is_playing_radio(radio) && Hue.radio_is_playing()) {
      item.classList.add("radio_item_playing")
    } else {
      item.classList.remove("radio_item_playing")
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
  Hue.unhighlight_radio_footer()
  Hue.radio_player.src = ""
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

// Check if radio is playing
Hue.radio_is_playing = function () {
  return Hue.radio_player && !Hue.radio_player.paused
}

// Check if radio is playing and perform actions
Hue.check_radio_playing = function () {
  if (Hue.radio_is_playing()) {
    Hue.el("#radio_button_playstop use").href.baseVal = "#icon_pause"
  } else {
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
  
  Hue.ev(container, "click", function () {
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
Hue.create_radio_item_buttons = function () {
  let container = Hue.div("radio_item")
  container.id = "radio_item_buttons"
  
  if (Hue.config.radios.length > 1) {
    container.innerHTML = Hue.template_radio_item_buttons()

    Hue.ev(Hue.el("#radio_button_random", container), "click", function () {
      Hue.play_random_radio()
    })
  } else {
    container.innerHTML = Hue.template_radio_item_buttons_2()
  }

  Hue.ev(Hue.el("#radio_button_playstop", container), "click", function () {
    Hue.radio_playstop()
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
  
  let vstring = Math.round(volume * 100)
  let fp = Hue.utilz.fillpad(vstring.toString(), 3, "0")
  Hue.el("#radio_button_volume").textContent = `${fp}%`  
  Hue.room_state.radio_volume = volume
  Hue.save_room_state()
}

// Play a random radio station
Hue.play_random_radio = function () {
  if (Hue.radio_disabled) {
    return
  }

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

// Play or stop the radio
// Select random item if none is playing
Hue.radio_playstop = function () {
  if (!Hue.playing_radio || Hue.radio_disabled) {
    return
  }

  Hue.check_radio_play(Hue.playing_radio) 
}

// Get radio now playing string
Hue.radio_now_playing_string = function () {
  if (Hue.radio_is_playing()) {
    return `Listening to ${Hue.playing_radio.name}`
  } else {
    return ""
  }
}

// Toggle radio visibility
Hue.toggle_radio = function () {
  if (Hue.radio_visible) {
    Hue.hide_radio()
  } else {
    Hue.show_radio()
  }
}

// Show radio 
Hue.show_radio = function () {
  Hue.el("#radio_items").classList.remove("nodisplay")
  Hue.radio_visible = true
}

Hue.hide_radio = function () {
  Hue.el("#radio_items").classList.add("nodisplay")
  Hue.radio_visible = false
}

// Start hide radio timeout
Hue.start_hide_radio = function () {
  Hue.hide_radio_timeout = setTimeout(function () {
    Hue.hide_radio()
  }, Hue.hide_radio_delay)
}

// Stop hide radio timeout
Hue.stop_hide_radio = function () {
  clearTimeout(Hue.hide_radio_timeout)
}

// Highlight radio footer
Hue.highlight_radio_footer = function () {
  Hue.el("#footer_radio_icon").classList.add("icon_highlight")
}

Hue.unhighlight_radio_footer = function () {
  Hue.el("#footer_radio_icon").classList.remove("icon_highlight")
}