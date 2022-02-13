// Setup radios
Hue.setup_radio = function () {
  Hue.get_radios()

  Hue.el("#radio_picker_open").addEventListener("click", function () {
    Hue.open_radio_input()
  })

  Hue.el("#radio_picker_toggle_filter").addEventListener("click", function () {
    Hue.toggle_radio_picker_filter()
  })

  Hue.el("#radio_picker_info").addEventListener("click", function () {
    Hue.show_radio_picker_info()
  })

  Hue.horizontal_separator(Hue.el("#radio_picker_header"))
  Hue.vertical_separator(Hue.el("#radio_picker_main"))

  Hue.el("#radio_picker_container").addEventListener("click", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.closest(".radio_picker_item")) {
      let url = e.target.closest(".radio_picker_item").dataset.url
      Hue.start_radio(Hue.find_radio_by_url(url))
    } 
  })

  Hue.el("#radio_picker_container").addEventListener("auxclick", function (e) {
    if (e.which !== 2) {
      return
    }

    if (!e.target) {
      return
    }

    let item = e.target.closest(".radio_picker_item")

    if (item) {
      let url = item.dataset.url
      Hue.forget_radio(Hue.find_radio_by_url(url))
      item.remove()
      Hue.vertical_separator(Hue.el("#radio_picker_container"))
    } 
  })

  Hue.el("#open_radio_open").addEventListener("click", function (e) {
    Hue.open_radio()
  })

  Hue.radio_launcher_popup = Hue.create_radio_utility("Launch Radio", function () {
    Hue.show_radio_picker()
  })

  Hue.radio_launcher_popup.show()

  let autostart = []

  if (Hue.settings.autostart_default_radios) {
    autostart = autostart.concat(Hue.config.autostart_radios)
  }

  autostart = autostart.concat(Hue.settings.autostart_radios.split("\n"))

  if (autostart.length > 0) {
    for (let url of new Set(autostart)) {
      Hue.open_radio(url)
    }
  }
}

// Get an radio by its url
Hue.find_radio_by_url = function (url) {
  for (let radio of Hue.radios) {
    if (radio.url === url) {
      return radio
    }
  }
}

// On open radio action
Hue.open_radio = function (url = "") {
  if (url === "") {
    url = Hue.el("#open_radio_input").value
  }

  url = url.trim()

  if (!url) {
    return
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = `https://${url}`
  }

  let name = ""

  try {
    name = new URL(url).hostname
  } catch (err) {
    return
  }

  Hue.start_radio({name: name, url: url})
}

// Show the radio picker
Hue.show_radio_picker = function (filter = "") {
  let container = Hue.el("#radio_picker_container")
  container.innerHTML = ""
  let appended = false

  for (let radio of Hue.radios) {
    let el = Hue.div("radio_picker_item action modal_item")
    el.title = radio.url
    el.dataset.name = radio.name
    el.dataset.url = radio.url
    el.innerHTML = `
      <canvas class="radio_picker_item_icon" width="40" height="40"></canvas>
      <div class="radio_picker_item_name">${radio.name}</div>
      <div class="radio_picker_item_url">${radio.url}</div>
    `

    appended = true
    container.append(el)
  }

  if (!appended) {
    let el = Hue.div()
    el.textContent = "No radios saved yet"
    container.append(el)
  }
  
  for (let icon of Hue.els(".radio_picker_item_icon")) {
    jdenticon.update(icon, icon.parentNode.dataset.name)
  }

  Hue.vertical_separator(container)

  Hue.msg_radio_picker.show(function () {
    if (filter) {
      Hue.el("#radio_picker_filter").classList.remove("nodisplay")
      Hue.el("#radio_picker_filter").value = filter
      Hue.do_modal_filter()
    } else {
      Hue.el("#radio_picker_filter").classList.add("nodisplay")
    }
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
  win.hue_last_open = 0
  win.hue_playing = false
  win.hue_date_started = Date.now()
  win.hue_radio_metadata_url = ""
  win.hue_radio_metadata_url = Hue.get_radio_metadata_url(radio.url)
  win.create()

  win.set_title(radio.name)
  win.set(Hue.template_radio_audio({url: radio.url}))
  Hue.el(".Msg-content-container", win.window).style.backgroundImage = `url(${Hue.config.default_background_url}`
  Hue.setup_radio_player(win)
  
  Hue.el(".radio_audio_metadata", win.window).addEventListener("click", function () {
    Hue.check_radio_metadata(win)
  })
  
  Hue.create_radio_popup(win)
  Hue.save_radio(win)
  Hue.close_all_modals()
}

// After radio picker is filtered
Hue.after_radio_picker_filtered = function () {
  Hue.vertical_separator(Hue.el("#radio_picker_container"))
}

// Launch the first radio in the filtered list
Hue.launch_first_radio = function () {
  if (Hue.radio_picker_filtered) {
    let item = Hue.get_first_visible_modal_item("radio_picker_container")
    if (item) {
      item.click()
    }
  }
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

// Cycle radios up or down
Hue.cycle_radios = function (direction) {
  let radios = Hue.get_open_radios()

  if (radios.length <= 1) {
    return
  }

  let index = 0

  for (let [i, radio] of radios.entries()) {
    if (radio === Hue.active_radio) {
      index = i
      break
    }
  }

  let ii = index

  if (direction === "down") {
    if (ii + 1 < radios.length) {
      ii += 1
    } else {
      ii = 0
    }
  } else if (direction === "up") {
    if (ii - 1 >= 0) {
      ii -= 1
    } else {
      ii = radios.length - 1
    }
  }

  radios[ii].show()
}

// Gets the radios localStorage object
Hue.get_radios = function () {
  Hue.radios = Hue.get_local_storage(Hue.ls_radio)

  if (Hue.radios === null) {
    Hue.radios = []
    Hue.save_radios()
  }
}

// Saves the radios localStorage object
Hue.save_radios = function (force = false) {
  Hue.save_local_storage(Hue.ls_radio, Hue.radios, force)
}

// Add item to radios
// Remove duplicate items
Hue.save_radio = function (win) {
  let radio = {name: win.hue_radio_name, url: win.hue_radio_url}

  try {
    new URL(radio.url)
  } catch (err) {
    return
  }

  for (let [i, item] of Hue.radios.entries()) {
    if (item.url === radio.url) {
      Hue.radios.splice(i, 1)
      break
    }
  }

  Hue.radios.unshift(radio)

  if (Hue.radios.length > Hue.config.radios_crop_limit) {
    Hue.radios = Hue.radios.slice(0, Hue.config.radios_crop_limit)
  }

  Hue.save_radios()
}

// Open radio input
Hue.open_radio_input = function () {
  Hue.msg_open_radio.show(function () {
    let input = Hue.el("#open_radio_input")
    input.value = ""
    input.focus()
  })
}

// Remove radio from the radio list
Hue.forget_radio = function (radio) {
  for (let [i, item] of Hue.radios.entries()) {
    if (item.url === radio.url) {
      Hue.radios.splice(i, 1)
      Hue.save_radios()
      break
    }
  }
}

// Toggle radio picker filter
Hue.toggle_radio_picker_filter = function () {
  let filter = Hue.el("#radio_picker_filter")
  
  if (filter.classList.contains("nodisplay")) {
    filter.classList.remove("nodisplay")
    filter.focus()
  } else {
    filter.classList.add("nodisplay")
  }
}

// Change to a specific open radio
Hue.change_to_radio = function (id) {
  let winid = parseInt(id)
  
  for (let win of Hue.get_open_radios()) {
    if (win.options.id === winid) {
      win.show()
      break
    }
  }

  Hue.close_all_modals()
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
    if (win && w === win) {
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

// Make radio popups visible or invisible
Hue.toggle_radio_popups = function () {
  Hue.radio_launcher_popup.close()
  
  if (Hue.radio_popups_visible) {
    Hue.radio_popups_visible = false

    for (let win of Hue.get_open_radios()) {
      win.hue_radio_popup.close()
      win.hue_radio_popup = undefined
    }

    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star"
  } else {
    Hue.radio_popups_visible = true
    Hue.radio_launcher_popup.show()

    for (let win of Hue.get_open_radios("date_started")) {
      Hue.create_radio_popup(win)
    }

    Hue.el("#footer_radio_icon use").href.baseVal = "#icon_star-solid"
  }
}

// Show information about the radio picker
Hue.show_radio_picker_info = function () {
  Hue.showmsg("Middle click items to forget radios")
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
Hue.check_radio_metadata = function (win) {
  Hue.loginfo(`Checking metadata: ${win.hue_radio_url}`)

  let artist_el = Hue.el(".radio_audio_metadata_artist", win.content)
  let title_el = Hue.el(".radio_audio_metadata_title", win.content)
  artist_el.style.display = "initial"
  title_el.style.display = "none"
  artist_el.textContent = "Loading..."

  fetch(win.hue_radio_metadata_url)
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
    }

    if (artist) {
      artist_el.innerHTML = Hue.utilz.make_html_safe(artist)
      artist_el.style.display = "initial"
    } else {
      artist_el.style.display = "none"
    }

    if (title) {
      title_el.innerHTML = Hue.utilz.make_html_safe(title)
      title_el.style.display = "initial"
    } else {
      title_el.style.display = "none"
    }
  })
  .catch(err => {})
}

// Try to guess the metadata URL of a radio source
Hue.get_radio_metadata_url = function (url) {
  return url.slice(0, url.lastIndexOf("/")) + "/status-json.xsl"
}

// Start metadata loop while radio audio window is open
Hue.start_radio_metadata_loop = function () {
  Hue.stop_radio_metadata_loop()
  Hue.check_radio_metadata(Hue.active_radio)

  Hue.radio_metadata_loop = setInterval(function () {
    Hue.check_radio_metadata(Hue.active_radio)
  }, Hue.config.radio_metadata_check_delay)
}

// Stop metadata check loop
Hue.stop_radio_metadata_loop = function () {
  clearInterval(Hue.radio_metadata_loop)
}