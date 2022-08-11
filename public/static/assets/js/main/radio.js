// Setup radios
Hue.setup_radio = function () {
  if (Hue.config.radios.length === 0) {
    Hue.radio_disabled = true
    return
  }

  Hue.playing_radio = Hue.config.radios.find(
    x => x.name === Hue.room_state.last_radio_name
  ) || Hue.config.radios[0]

  Hue.setup_radio_player()
  
  for (let radio of Hue.config.radios) {
    Hue.create_radio_station(radio)
  }
  
  Hue.apply_radio_volume()
  Hue.fill_radio_queue()

  let wheel_func = function (e) {
    Hue.change_radio_volume(e.deltaY > 0 ? "down" : "up")
  }

  Hue.ev(Hue.el("#radio_volume"), "wheel", wheel_func)
  Hue.ev(Hue.el("#footer_radio_icon"), "wheel", wheel_func)

  Hue.ev(Hue.el("#radio_playstop"), "click", function () {
    Hue.radio_playstop()
  })

  Hue.ev(Hue.el("#radio_random"), "click", function () {
    Hue.play_random_radio()
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
  Hue.apply_radio_station_effects()
  Hue.check_radio_playing()
  Hue.room_state.last_radio_name = radio.name
  Hue.save_room_state()
}

// After radio play
Hue.after_radio_play = function () {
  Hue.apply_radio_station_effects()
  Hue.check_radio_playing()
  Hue.scroll_to_radio_station()
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

// Apply radio station effects
Hue.apply_radio_station_effects = function () {
  for (let station of Hue.els(".radio_station")) {
    let radio = Hue.dataset(station, "radio")

    if (Hue.is_playing_radio(radio) && Hue.radio_is_playing()) {
      station.classList.add("radio_station_playing")
    } else {
      station.classList.remove("radio_station_playing")
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
  Hue.apply_radio_station_effects()
  Hue.check_radio_playing()
  Hue.unhighlight_radio_footer()
  Hue.radio_player.src = ""
}

// Scroll stations list to playing station
Hue.scroll_to_radio_station = function () {
  if (!Hue.radio_is_playing()) {
    return
  }
  
  let station = Hue.get_radio_station(Hue.playing_radio)
  
  station.scrollIntoView({
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
    Hue.el("#radio_playstop").textContent = "Pause"
  } else {
    Hue.el("#radio_playstop").textContent = "Play"
  }

  Hue.update_input_placeholder()
}

// Create a radio station
Hue.create_radio_station = function (radio) {
  let container = Hue.div("radio_station nice_row modal_item action")
  container.innerHTML = Hue.template_radio_station()
  
  let icon = Hue.el(".radio_station_icon", container)
  jdenticon.update(icon, radio.name)
  
  let name = Hue.el(".radio_station_name", container)
  name.textContent = radio.name
  
  Hue.ev(container, "click", function () {
    Hue.check_radio_play(radio)
  })

  Hue.dataset(container, "radio", radio)
  Hue.el("#radio_stations").append(container)
}

// Get radio station
Hue.get_radio_station = function (radio) {
  for (let el of Hue.els(".radio_station")) {
    if (Hue.dataset(el, "radio").name === radio.name) {
      return el
    }
  }
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
  Hue.el("#radio_volume").textContent = `Volume: ${fp}%` 
  
  if (Hue.started && !Hue.msg_radio.is_open()) {
    Hue.flash_info("Radio", `Volume: ${vstring}%`)
  }

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

// Get first random radio queue station
Hue.get_random_radio = function () {
  return Hue.radio_queue[0]
}

// Push back played station to end of radio queue
Hue.push_radio_queue = function (radio) {
  for (let [i, r] of Hue.radio_queue.entries()) {
    if (r.name === radio.name) {
      Hue.radio_queue.push(Hue.radio_queue.splice(i, 1)[0])
      break
    }
  }
}

// Fill stations for the random button
Hue.fill_radio_queue = function () {
  Hue.radio_queue = Hue.config.radios.slice(0)
  Hue.utilz.shuffle_array(Hue.radio_queue)
}

// Play or stop the radio
// Select random station if none is playing
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

// Show radio 
Hue.show_radio = function () {
  Hue.msg_radio.show(function () {
    Hue.scroll_to_radio_station()
  })
}

Hue.hide_radio = function () {
  Hue.msg_radio.close()
}

// Highlight radio footer
Hue.highlight_radio_footer = function () {
  Hue.el("#footer_radio_icon").classList.add("icon_highlight")
}

Hue.unhighlight_radio_footer = function () {
  Hue.el("#footer_radio_icon").classList.remove("icon_highlight")
}