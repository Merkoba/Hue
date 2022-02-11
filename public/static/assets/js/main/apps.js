// Setup apps
Hue.setup_apps = function () {
  Hue.get_apps()

  Hue.el("#app_picker_open").addEventListener("click", function () {
    Hue.open_app_input()
  })

  Hue.el("#app_picker_toggle_filter").addEventListener("click", function () {
    Hue.toggle_app_picker_filter()
  })

  Hue.el("#app_picker_info").addEventListener("click", function () {
    Hue.show_app_picker_info()
  })

  Hue.horizontal_separator(Hue.el("#app_picker_header"))
  Hue.vertical_separator(Hue.el("#app_picker_main"))
  Hue.vertical_separator(Hue.el("#applist_main"))

  Hue.el("#app_picker_container").addEventListener("click", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.closest(".app_picker_item")) {
      let url = e.target.closest(".app_picker_item").dataset.url
      Hue.start_app(Hue.find_app_by_url(url))
    } 
  })

  Hue.el("#app_picker_container").addEventListener("auxclick", function (e) {
    if (e.which !== 2) {
      return
    }

    if (!e.target) {
      return
    }

    let item = e.target.closest(".app_picker_item")

    if (item) {
      let url = item.dataset.url
      Hue.forget_app(Hue.find_app_by_url(url))
      item.remove()
      Hue.vertical_separator(Hue.el("#app_picker_container"))
    } 
  })

  Hue.el("#open_app_open").addEventListener("click", function (e) {
    Hue.open_app()
  })

  Hue.el("#applist_container").addEventListener("click", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.closest(".applist_item")) {
      let winid = e.target.closest(".applist_item").dataset.id
      Hue.change_to_app(winid)
    }
  })

  Hue.el("#applist_launch").addEventListener("click", function () {
    Hue.close_all_modals()
    Hue.show_app_picker()
  })

  Hue.app_launcher_popup = Hue.create_app_utility("Launch App", function () {
    Hue.show_app_picker()
  })

  Hue.app_launcher_popup.show()

  let autostart = []

  if (Hue.settings.autostart_default_apps) {
    autostart = autostart.concat(Hue.config.autostart_apps)
  }

  autostart = autostart.concat(Hue.settings.autostart_apps.split("\n"))

  if (autostart.length > 0) {
    for (let url of new Set(autostart)) {
      Hue.open_app(url, false)
    }
  }
}

// Get an app by its url
Hue.find_app_by_url = function (url) {
  for (let app of Hue.apps) {
    if (app.url === url) {
      return app
    }
  }
}

// On open app action
Hue.open_app = function (url = "", start_maximized = true) {
  if (url === "") {
    url = Hue.el("#open_app_input").value
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

  let app = {name: name, url: url}

  Hue.start_app(app, start_maximized)
}

// Show the app picker
Hue.show_app_picker = function (filter = "") {
  let container = Hue.el("#app_picker_container")
  container.innerHTML = ""
  let appended = false

  for (let app of Hue.apps) {
    let el = Hue.div("app_picker_item action modal_item")
    el.title = app.url
    el.dataset.name = app.name
    el.dataset.url = app.url
    el.innerHTML = `
      <canvas class="app_picker_item_icon" width="40" height="40"></canvas>
      <div class="app_picker_item_name">${app.name}</div>
      <div class="app_picker_item_url">${app.url}</div>
    `

    appended = true
    container.append(el)
  }

  if (!appended) {
    let el = Hue.div()
    el.textContent = "No apps saved yet"
    container.append(el)
  }
  
  for (let icon of Hue.els(".app_picker_item_icon")) {
    jdenticon.update(icon, icon.parentNode.dataset.name)
  }

  Hue.vertical_separator(container)

  Hue.msg_app_picker.show(function () {
    if (filter) {
      Hue.el("#app_picker_filter").classList.remove("nodisplay")
      Hue.el("#app_picker_filter").value = filter
      Hue.do_modal_filter()
    } else {
      Hue.el("#app_picker_filter").classList.add("nodisplay")
    }
  })
}

// Start a app
Hue.start_app = function (app, start_maximized = true) {
  if (!app) {
    return
  }

  try {
    new URL(app.url)
  } catch (err) {
    return
  }

  let is_audio = Hue.utilz.is_audio(app.url)
  let is_video = Hue.utilz.is_video(app.url)

  let win = Hue.create_app_window()
  win.hue_app_name = app.name
  win.hue_app_url = app.url
  win.hue_content_loaded = false
  win.hue_last_open = 0
  win.hue_playing = false
  win.hue_date_started = Date.now()
  win.create()

  if (is_audio) {
    win.hue_content_type = "audio"
  } else if (is_video) {
    win.hue_content_type = "video"
  } else {
    win.hue_content_type = "iframe"
  }

  win.titlebar.addEventListener("click", function (e) {
    if (e.target.closest(".app_titlebar_icon")) {
      Hue.show_header_menu()
    } else if (e.target.closest(".app_titlebar_name")) {
      Hue.show_applist()
    }else if (e.target.classList.contains("app_titlebar_launch")) {
      Hue.show_app_picker()
    } else if (e.target.classList.contains("app_titlebar_applist")) {
      Hue.show_applist()
    } else if (e.target.classList.contains("app_titlebar_refresh")) {
      Hue.refresh_app(win)
    } else if (e.target.classList.contains("app_titlebar_minimize")) {
      Hue.minimize_all_apps()
    }
  })

  win.titlebar.addEventListener("wheel", function (e) {
    Hue.app_cycle_wheel_timer(e.deltaY > 0 ? "down" : "up")
  })

  win.set_title(Hue.template_app_titlebar())

  let name = Hue.el(".app_titlebar_name", win.titlebar)
  name.textContent = app.name
  name.title = app.url

  Hue.horizontal_separator(Hue.el(".app_titlebar_buttons", win.titlebar))
  let el = Hue.el(".app_titlebar_icon", win.titlebar)
  jdenticon.update(el, app.name)

  if (is_audio) {
    start_maximized = false
  }

  if (start_maximized) {
    win.show()
  } else {
    Hue.create_app_popup(win)
  }

  Hue.save_app(win)
  Hue.close_all_modals()
}

// After app picker is filtered
Hue.after_app_picker_filtered = function () {
  Hue.vertical_separator(Hue.el("#app_picker_container"))
}

// After applist is filtered
Hue.after_applist_filtered = function () {
  Hue.vertical_separator(Hue.el("#applist_container"))
}

// Launch the first app in the filtered list
Hue.launch_first_app = function () {
  if (Hue.app_picker_filtered) {
    let item = Hue.get_first_visible_modal_item("app_picker_container")
    if (item) {
      item.click()
    }
  }
}

// Check if modal instance is app
Hue.is_app = function (instance) {
  if (instance && instance.window) {
    return instance.window.classList.contains("app_window")
  }
}

// Check if modal instance is app popup
Hue.is_app_popup = function (instance) {
  if (instance && instance.window) {
    return instance.window.classList.contains("app_popup_window")
  }
}

// Get open apps
Hue.get_open_apps = function (sortmode = "last_open") {
  let apps = []

  for (let instance of Hue.msg_main_menu.higher_instances()) {
    if (instance.window) {
      if (Hue.is_app(instance)) {
        apps.push(instance)
      }
    }
  }

  if (sortmode === "last_open") {
    apps.sort((a, b) => (a.hue_last_open > b.hue_last_open) ? -1 : 1)
  } else if (sortmode === " date_started") {
    apps.sort((a, b) => (a.hue_date_started > b.hue_date_started) ? -1 : 1)
  }

  return apps
}

// Get open apps
Hue.get_open_app_popups = function () {
  let popups = []

  for (let instance of Hue.msg_main_menu.lower_instances()) {
    if (instance.window) {
      if (Hue.is_app_popup(instance)) {
        popups.push(instance)
      }
    }
  }

  return popups
}

// Cycle apps up or down
Hue.cycle_apps = function (direction) {
  let apps = Hue.get_open_apps()

  if (apps.length <= 1) {
    return
  }

  let index = 0

  for (let [i, app] of apps.entries()) {
    if (app === Hue.active_app) {
      index = i
      break
    }
  }

  let ii = index

  if (direction === "down") {
    if (ii + 1 < apps.length) {
      ii += 1
    } else {
      ii = 0
    }
  } else if (direction === "up") {
    if (ii - 1 >= 0) {
      ii -= 1
    } else {
      ii = apps.length - 1
    }
  }

  apps[ii].show()
}

// Refresh an app's content
Hue.refresh_app = function (win) {
  Hue.load_app_content(win)

  if (Hue.is_media_app(win)) {
    Hue.get_app_player(win).play()
  }
}

// Gets the apps localStorage object
Hue.get_apps = function () {
  Hue.apps = Hue.get_local_storage(Hue.ls_apps)

  if (Hue.apps === null) {
    Hue.apps = []
    Hue.save_apps()
  }
}

// Saves the apps localStorage object
Hue.save_apps = function (force = false) {
  Hue.save_local_storage(Hue.ls_apps, Hue.apps, force)
}

// Add item to apps
// Remove duplicate items
Hue.save_app = function (win) {
  let app = {name: win.hue_app_name, url: win.hue_app_url}

  try {
    new URL(app.url)
  } catch (err) {
    return
  }

  for (let [i, item] of Hue.apps.entries()) {
    if (item.url === app.url) {
      Hue.apps.splice(i, 1)
      break
    }
  }

  Hue.apps.unshift(app)

  if (Hue.apps.length > Hue.config.apps_crop_limit) {
    Hue.apps = Hue.apps.slice(0, Hue.config.apps_crop_limit)
  }

  Hue.save_apps()
}

// Open app input
Hue.open_app_input = function () {
  Hue.msg_open_app.show(function () {
    let input = Hue.el("#open_app_input")
    input.value = ""
    input.focus()
  })
}

// Remove app from the app list
Hue.forget_app = function (app) {
  for (let [i, item] of Hue.apps.entries()) {
    if (item.url === app.url) {
      Hue.apps.splice(i, 1)
      Hue.save_apps()
      break
    }
  }
}

// Toggle app picker filter
Hue.toggle_app_picker_filter = function () {
  let filter = Hue.el("#app_picker_filter")
  
  if (filter.classList.contains("nodisplay")) {
    filter.classList.remove("nodisplay")
    filter.focus()
  } else {
    filter.classList.add("nodisplay")
  }
}

// Show a list of open apps
Hue.show_applist = function (filter = "", exclude_active = true) {
  let container = Hue.el("#applist_container")
  container.innerHTML = ""
  let appended = false

  let windows = Hue.get_open_apps()

  for (let win of windows) {
    if (exclude_active) {
      if (win === Hue.active_app) {
        continue
      }
    }

    let el = Hue.div("applist_item action modal_item")
    el.title = win.hue_app_url
    el.dataset.name = win.hue_app_name
    el.dataset.url = win.hue_app_url
    el.dataset.id = win.options.id
    el.innerHTML = `
      <canvas class="applist_item_icon" width="40" height="40"></canvas>
      <div class="applist_item_name">${win.hue_app_name}</div>
      <div class="applist_item_url">${win.hue_app_url}</div>
    `

    appended = true
    container.append(el)
  }

  if (!appended) {
    let el = Hue.div()
    el.textContent = "No apps to switch to"
    container.append(el)
  }

  for (let icon of Hue.els(".applist_item_icon")) {
    jdenticon.update(icon, icon.parentNode.dataset.name)
  }

  Hue.vertical_separator(container)

  Hue.msg_applist.show(function () {
    if (filter) {
      filter = Hue.el("#applist_filter")
      filter.value = filter.trim()
      Hue.do_modal_filter()
    }
  })
}

// Change to a specific open app
Hue.change_to_app = function (id) {
  let winid = parseInt(id)
  
  for (let win of Hue.get_open_apps()) {
    if (win.options.id === winid) {
      win.show()
      break
    }
  }

  Hue.close_all_modals()
}

// Minimize all apps
Hue.minimize_all_apps = function () {
  for (let win of Hue.get_open_apps()) {
    win.close()
  }
}

// Get app player
Hue.get_app_player = function (win) {
  return Hue.el(".app_frame", win.content)
}

// Load app media
Hue.load_app_content = function (win) {
  let is_audio = win.hue_content_type === "audio"
  let is_video = win.hue_content_type === "video"

  if (is_audio || is_video) {
    let media_url = Hue.utilz.cache_bust_url(win.hue_app_url)
  
    if (is_audio) {
      win.set(Hue.template_app_audio({url: media_url}))
    } else if (is_video) {
      win.set(Hue.template_app_video({url: media_url}))
    }
  
    let player = Hue.get_app_player(win)
    
    player.addEventListener("play", function () {
      win.hue_playing = true
      Hue.app_playing(win)
    })
    
    player.addEventListener("pause", function () {
      win.hue_playing = false
      Hue.app_playing(win)
    })
  } else {
    win.set(Hue.template_app_iframe({url: win.hue_app_url}))
  }

  Hue.el(".Msg-content-container", win.window).style.backgroundImage = `url(${Hue.config.default_background_url}`
  win.hue_content_loaded = true
}

// Stop all app players
Hue.stop_app_players = function (win) {
  for (let w of Hue.get_open_apps()) {
    if (w.hue_content_loaded && Hue.is_media_app(w)) {
      Hue.get_app_player(w).pause()
    }
  }
}

// Set an app as playing or not playing
Hue.app_playing = function (win) {
  if (!win.hue_app_popup) {
    return
  }

  if (win.hue_playing) {
    win.hue_app_popup.window.classList.add("app_popup_playing")
    win.hue_app_popup.window.classList.add("glowing")
  } else {
    win.hue_app_popup.window.classList.remove("app_popup_playing")
    win.hue_app_popup.window.classList.remove("glowing")
  }
}

// Make app popups visible or invisible
Hue.toggle_app_popups = function () {
  Hue.app_launcher_popup.close()
  
  if (Hue.app_popups_visible) {
    Hue.app_popups_visible = false

    for (let win of Hue.get_open_apps()) {
      win.hue_app_popup.close()
      win.hue_app_popup = undefined
    }

    Hue.el("#footer_apps_icon use").href.baseVal = "#icon_star"
  } else {
    Hue.app_popups_visible = true
    Hue.app_launcher_popup.show()

    for (let win of Hue.get_open_apps("date_started")) {
      Hue.create_app_popup(win)
    }

    Hue.el("#footer_apps_icon use").href.baseVal = "#icon_star-solid"
  }
}

// Show information about the app picker
Hue.show_app_picker_info = function () {
  Hue.showmsg("Middle click items to forget apps")
}

// Pause media or show app
Hue.check_app_media = function (win) {
  if (!Hue.is_media_app(win)) {
    Hue.app_popup_action(win)
    return
  }

  Hue.stop_app_players()

  let player = Hue.get_app_player(win)
  let is_playing = win.hue_app_popup.window.classList.contains("app_popup_playing")

  if (is_playing) {
    player.pause()
  } else {
    player.src = Hue.utilz.cache_bust_url(win.hue_app_url)
    player.play()
  }
}

// Check if app content is loaded
Hue.check_app_content_loaded = function (win) {
  if (!win.hue_content_loaded) {
    Hue.load_app_content(win)
  }
}

// App popup action
Hue.app_popup_action = function (win) {
  win.show()
}

// Remove an app modal instance
Hue.remove_app = function (win) {
  win.close()
  win.destroy()
  win.hue_app_popup = undefined
}

// Increase or decrease media app volume
Hue.change_media_app_volume = function (win, direction) {
  Hue.check_app_content_loaded(win)

  if (!Hue.is_media_app(win)) {
    return
  }

  let player = Hue.get_app_player(win)
  let new_volume = player.volume

  if (direction === "up") {
    new_volume += 0.05  
    
    if (new_volume > 1) {
      new_volume = 1
    }
  } else if (direction === "down") {
    new_volume -= 0.05  
    
    if (new_volume < 0) {
      new_volume = 1
    }
  }

  new_volume = Hue.utilz.round(new_volume, 2)
  new_volume_p = Math.round(new_volume * 100)
  player.volume = new_volume
  Hue.flash_info(`Volume: ${new_volume_p}%`, win.hue_app_name)
}

// Check if it's media app
Hue.is_media_app = function (win) {
  return (win.hue_content_type === "audio" || win.hue_content_type === "video")
}