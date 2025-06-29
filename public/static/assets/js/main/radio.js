// Setup radios
App.setup_radio = () => {
  App.playing_radio = App.config.radios.find(
    x => x.name === App.room_state.last_radio_name,
  ) || App.config.radios[0]

  App.setup_radio_player()

  for (let radio of App.config.radios) {
    App.create_radio_station(radio)
  }

  App.apply_radio_volume()
  App.fill_radio_queue()

  let wheel_func = (e) => {
    App.change_radio_volume(e.deltaY > 0 ? `down` : `up`)
  }

  DOM.ev(DOM.el(`#radio_volume`), `wheel`, wheel_func)
  DOM.ev(DOM.el(`#footer_radio_container`), `wheel`, wheel_func)

  DOM.ev(DOM.el(`#radio_playstop`), `click`, () => {
    App.radio_playstop()
  })

  DOM.ev(DOM.el(`#radio_random`), `click`, () => {
    App.clear_radio_filter()
    App.play_random_radio()
  })

  DOM.ev(DOM.el(`#radio_capture`), `click`, () => {
    App.start_audio_capture()
  })

  DOM.ev(DOM.el(`#radio_volume`), `click`, () => {
    App.pick_radio_volume()
  })

  DOM.ev(DOM.el(`#footer_radio_container`), `mouseenter`, (e) => {
    let vstring = App.round_radio_volume(App.room_state.radio_volume)
    e.target.title = `${App.playing_radio.name}\nVolume: ${vstring}%`
  })

  DOM.ev(DOM.el(`#radio_auto`), `click`, () => {
    App.toggle_radio_auto()
  })

  App.set_radio_auto_text()
  App.check_radio_enabled()
}

// Round radio volume
App.round_radio_volume = (volume) => {
  return Math.round(volume * 100)
}

// Play or pause radio
App.check_radio_play = (radio) => {
  if (App.is_playing_radio(radio) && App.radio_is_playing()) {
    App.stop_radio()
  }
  else {
    App.play_radio(radio)
  }
}

// Play the audio player with a cache-busted url
App.play_radio = (radio) => {
  if (!App.radio_enabled()) {
    return
  }

  App.push_radio_queue(radio)
  App.playing_radio = radio
  App.radio_player.src = App.utilz.cache_bust_url(radio.url)
  App.radio_player.play()
  App.apply_radio_station_effects()
  App.check_radio_playing()
  App.room_state.last_radio_name = radio.name
  App.save_room_state()
}

// After radio play
App.after_radio_play = () => {
  App.apply_radio_station_effects()
  App.check_radio_playing()
  App.scroll_to_radio_station()
  App.show_radio_icon()

  if (App.room_state.radio_auto) {
    App.start_radio_auto_timeout()
  }
}

// Set radio player
App.setup_radio_player = () => {
  App.radio_player = new Audio()
  App.radio_player.volume = App.room_state.radio_volume

  DOM.ev(App.radio_player, `play`, (e) => {
    App.after_radio_play()
  })

  DOM.ev(App.radio_player, `pause`, (e) => {
    App.after_radio_stop()
  })
}

// Apply radio station effects
App.apply_radio_station_effects = () => {
  for (let station of DOM.els(`.radio_station`)) {
    let radio = DOM.dataset(station, `radio`)

    if (App.is_playing_radio(radio) && App.radio_is_playing()) {
      station.classList.add(`radio_station_playing`)
    }
    else {
      station.classList.remove(`radio_station_playing`)
    }
  }
}

// Check if it's playing radio
App.is_playing_radio = (radio) => {
  return App.playing_radio.name === radio.name
}

// Stops the audio player
App.stop_radio = () => {
  App.radio_player.pause()
}

// After stop radio
App.after_radio_stop = () => {
  App.stop_radio_auto_timeout()
  App.apply_radio_station_effects()
  App.check_radio_playing()
  App.hide_radio_icon()
  App.radio_player.src = ``
}

// Scroll stations list to playing station
App.scroll_to_radio_station = () => {
  if (!App.radio_is_playing()) {
    return
  }

  let station = App.get_radio_station(App.playing_radio)
  App.select_next(station)
}

// Check if radio is playing
App.radio_is_playing = () => {
  return App.radio_player && !App.radio_player.paused
}

// Check if radio is playing and perform actions
App.check_radio_playing = () => {
  if (App.radio_is_playing()) {
    DOM.el(`#radio_playstop`).textContent = `Stop`
  }
  else {
    DOM.el(`#radio_playstop`).textContent = `Play`
  }

  App.update_input_placeholder()
}

// Create a radio station
App.create_radio_station = (radio) => {
  let container = DOM.create(`div`, `radio_station nice_row modal_item pointer`)
  container.innerHTML = App.template_radio_station()

  let icon = DOM.el(`.radio_station_icon`, container)
  jdenticon.update(icon, radio.name)

  let name = DOM.el(`.radio_station_name`, container)
  name.textContent = radio.name

  DOM.ev(container, `click`, () => {
    App.check_radio_play(radio)
  })

  DOM.ev(container, `auxclick`, (e) => {
    App.show_radio_context(radio, e.clientX, e.clientY)
  })

  DOM.dataset(container, `radio`, radio)
  DOM.el(`#radio_stations`).append(container)
}

// Get radio station
App.get_radio_station = (radio) => {
  for (let el of DOM.els(`.radio_station`)) {
    if (DOM.dataset(el, `radio`).name === radio.name) {
      return el
    }
  }
}

// Get radio station 2
App.get_radio_station_2 = (el) => {
  for (let radio of App.config.radios) {
    if (DOM.dataset(el, `radio`).name === radio.name) {
      return radio
    }
  }
}

// Increase or decrease radio volume
App.change_radio_volume = (direction, amount = 0.05) => {
  let new_volume = App.room_state.radio_volume

  if (direction === `up`) {
    new_volume += amount

    if (new_volume > 1) {
      new_volume = 1
    }
  }
  else if (direction === `down`) {
    new_volume -= amount

    if (new_volume < 0) {
      new_volume = 0
    }
  }

  new_volume = App.utilz.round(new_volume, 2)

  if (App.room_state.radio_volume !== new_volume) {
    App.apply_radio_volume(new_volume)
  }
  else {
    App.flash_radio_volume()
  }
}

// Flash radio volume
App.flash_radio_volume = (volume = App.room_state.radio_volume) => {
  if (App.started && !App.msg_radio.is_open()) {
    let vstring = App.round_radio_volume(volume)
    App.flash_info(`Radio`, `Volume: ${vstring}%`)
  }
}

// Apply radio volume to all players
App.apply_radio_volume = (volume = App.room_state.radio_volume) => {
  let vstring = App.round_radio_volume(volume)
  DOM.el(`#radio_volume`).textContent = `Volume: ${vstring}%`
  App.flash_radio_volume(volume)

  if (volume >= 0.7) {
    DOM.el(`#footer_radio_icon use`).href.baseVal = `#icon_volume-full`
  }
  else if (volume > 0) {
    DOM.el(`#footer_radio_icon use`).href.baseVal = `#icon_volume-mid`
  }
  else {
    DOM.el(`#footer_radio_icon use`).href.baseVal = `#icon_volume-mute`
  }

  App.radio_player.volume = volume

  if (App.room_state.radio_volume !== volume) {
    App.room_state.radio_volume = volume
    App.save_room_state()
  }
}

// Play a random radio station
App.play_random_radio = () => {
  if (!App.radio_enabled()) {
    return
  }

  App.play_radio(App.get_random_radio())
}

// Get first random radio queue station
App.get_random_radio = () => {
  return App.radio_queue[0]
}

// Push back played station to end of radio queue
App.push_radio_queue = (radio) => {
  for (let [i, r] of App.radio_queue.entries()) {
    if (r.name === radio.name) {
      App.radio_queue.push(App.radio_queue.splice(i, 1)[0])
      break
    }
  }
}

// Fill stations for the random button
App.fill_radio_queue = () => {
  App.radio_queue = App.config.radios.slice(0)
  App.utilz.shuffle_array(App.radio_queue)
}

// Play or stop the radio
// Select random station if none is playing
App.radio_playstop = () => {
  if (!App.playing_radio || !App.radio_enabled()) {
    return
  }

  App.check_radio_play(App.playing_radio)
}

// Get radio now playing string
App.radio_now_playing_string = () => {
  if (App.radio_is_playing()) {
    return `Listening to ${App.playing_radio.name}`
  }

  return ``
}

// Show the radio
App.show_radio = (filter = ``) => {
  if (!App.radio_enabled()) {
    return
  }

  App.msg_radio.show()
  App.selected_modal_item = undefined
  App.selected_next()
  DOM.el(`#radio_filter`).value = filter
  App.do_modal_filter()
}

// Hide the radio
App.hide_radio = () => {
  App.msg_radio.close()
}

// Highlight the radio footer
App.show_radio_icon = () => {
  DOM.show(`#footer_radio_icon`)
}

// Unhighlight the radio footer
App.hide_radio_icon = () => {
  DOM.hide(`#footer_radio_icon`)
}

// Play first selected radio
App.play_first_radio = () => {
  for (let station of DOM.els(`.radio_station`)) {
    if (!DOM.is_hidden(station)) {
      App.play_radio(DOM.dataset(station, `radio`))
      return
    }
  }
}

// Clear radio filter
App.clear_radio_filter = () => {
  let filter = DOM.el(`#radio_filter`)

  if (!filter.value) {
    return
  }

  filter.value = ``
  App.do_modal_filter()
}

// Show a picker to select radio volume
App.pick_radio_volume = () => {
  let nums = App.utilz.number_range(0, 100, 10)
  nums.reverse()

  let s = nums.map(x => x + `%`)

  App.show_item_picker(`Radio Volume`, s, (item) => {
    let vol = parseInt(item) / 100
    App.apply_radio_volume(vol)
  })
}

// Set radio auto text
App.set_radio_auto_text = () => {
  let el = DOM.el(`#radio_auto`)

  if (App.room_state.radio_auto) {
    el.textContent = `Auto: On`
  }
  else {
    el.textContent = `Auto: Off`
  }
}

// Toggle radio auto
App.toggle_radio_auto = () => {
  App.room_state.radio_auto = !App.room_state.radio_auto

  if (App.room_state.radio_auto) {
    if (App.radio_is_playing()) {
      App.start_radio_auto_timeout()
    }
  }
  else {
    App.stop_radio_auto_timeout()
  }

  App.set_radio_auto_text()
  App.save_room_state()
}

// Stop radio auto timeout
App.stop_radio_auto_timeout = () => {
  clearTimeout(App.radio_auto_timeout)
}

// Start radio auto timeout
App.start_radio_auto_timeout = () => {
  App.stop_radio_auto_timeout()

  App.radio_auto_timeout = setTimeout(() => {
    if (App.radio_is_playing()) {
      App.play_random_radio()
    }
  }, App.get_setting(`radio_auto_minutes`) * 60 * 1000)
}

// Radio enter action
App.radio_enter_action = () => {
  let el = App.selected_modal_item
  let radio = App.get_radio_station_2(el)
  App.check_radio_play(radio)
}

// Check if the radio is enabled
App.radio_enabled = () => {
  return App.config.radio_enabled &&
  App.get_setting(`radio_enabled`) &&
  (App.config.radios.length > 0)
}

// Check radio enabled
App.check_radio_enabled = () => {
  let c = `#footer_radio_container`

  if (App.radio_enabled()) {
    DOM.show(c)
  }
  else {
    DOM.hide(c)
  }

  let items = DOM.el(`#footer_media_items`)
  App.horizontal_separator(items)
}

// Start capturing the audio and upload it as radio
App.start_audio_capture = async (seconds) => {
  if (!seconds) {
    return
  }

  let stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  })

  let recorded_chunks = []
  App.audio_capture_recorder = new MediaRecorder(stream)

  App.audio_capture_recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recorded_chunks.push(e.data)
    }
  }

  App.audio_capture_recorder.onstop = () => {
    for (let track of stream.getTracks()) {
      track.stop()
    }

    let blob = new Blob(recorded_chunks, {
      type: `audio/mp3`,
    })

    blob.name = `capture.mp3`
    App.upload_mode = `audio`
    App.show_tv_upload_comment(blob, `capture`)
    recorded_chunks = []
  }

  App.audio_capture_popup = App.show_action_popup({
    message: `Close this to stop capture`,
    title: `Screen Capture`,
    on_x_button_click: () => {
      App.stop_audio_capture()
    },
  })

  App.audio_capture_recorder.start(200)

  App.audio_capture_timeout = setTimeout(() => {
    App.stop_audio_capture()
  }, seconds * 1000)
}

// Stop audio capture
App.stop_audio_capture = () => {
  clearTimeout(App.audio_capture_timeout)
  App.audio_capture_popup.close()
  App.audio_capture_recorder.stop()
}

// Show audio capture options
App.audio_capture = () => {
  App.msg_audio_capture_options.show()
}

// Setup audio capture
App.setup_audio_capture = () => {
  DOM.ev(DOM.el(`#audio_capture_options_container`), `click`, (e) => {
    let el = e.target.closest(`.audio_capture_duration`)

    if (el) {
      let seconds = parseInt(el.dataset.seconds)
      App.msg_audio_capture_options.close()
      App.start_audio_capture(seconds)
    }
  })
}