// Setup apps
Hue.setup_apps = function () {
  Hue.get_apps()

  Hue.el("#app_picker_open").addEventListener("click", function () {
    Hue.open_app_input()
  })

  Hue.el("#app_picker_toggle_filter").addEventListener("click", function () {
    Hue.toggle_app_picker_filter()
  })

  Hue.horizontal_separator(Hue.el("#app_picker_header"))
  Hue.vertical_separator(Hue.el("#app_picker_main"))


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

    if (e.target.closest(".app_picker_item")) {
      let url = e.target.closest(".app_picker_item").dataset.url
      Hue.forget_app(Hue.find_app_by_url(url))
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

  Hue.update_app_picker()

  if (Hue.settings.autostart_apps) {
    for (let url of Hue.settings.autostart_apps.split("\n")) {
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

// Update the app picker
Hue.update_app_picker = function () {
  let container = Hue.el("#app_picker_container")
  container.innerHTML = ""

  for (let app of Hue.apps) {
    let el = Hue.div("app_picker_item action modal_item")
    el.title = app.url
    el.dataset.url = app.url
    el.innerHTML = `
      <canvas class="app_picker_item_icon" width="40" height="40"></canvas>
      <div class="app_picker_item_name">${app.name}</div>
    `

    container.append(el)
  }

  for (let icon of Hue.els(".app_picker_item_icon")) {
    let url = icon.parentNode.dataset.url

    if (url) {
      let app = Hue.find_app_by_url(url)
      jdenticon.update(icon, app.name)
    }
  }

  Hue.vertical_separator(container)
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
Hue.show_app_picker = function (filter) {
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
  
  let win = Hue.create_app_window()
  win.hue_app_name = app.name
  win.hue_app_url = app.url
  win.hue_iframe_loaded = false
  win.create()

  win.titlebar.addEventListener("click", function (e) {
    if (e.target.classList.contains("app_titlebar_launch")) {
      Hue.show_app_picker()
    } else if (e.target.classList.contains("app_titlebar_applist")) {
      Hue.show_applist()
    } else if (e.target.classList.contains("app_titlebar_refresh")) {
      Hue.refresh_app(win)
    } else if (e.target.classList.contains("app_titlebar_minimize")) {
      Hue.minimize_all_apps()
    }
  })

  win.titlebar.addEventListener("auxclick", function (e) {
    if (e.which !== 2) {
      return
    }

    if (e.target.classList.contains("app_titlebar_minimize")) {
      win.close()
      win.destroy()
    }
  })

  win.titlebar.addEventListener("wheel", function (e) {
    Hue.app_cycle_wheel_timer(e.deltaY > 0 ? "down" : "up")
  })

  let title = `
    <div class="app_titlebar_container">
      <div class="app_titlebar_info">
        <canvas class="app_titlebar_icon" width="20" height="20"></canvas>
        <div class="app_titlebar_name">${app.name}</div>
      </div>

      <div class="app_titlebar_buttons">
        <div class="action app_titlebar_launch">Launch</div>
        <div class="action app_titlebar_applist">Apps</div>
        <div class="action app_titlebar_refresh">Refresh</div>
        <div class="action app_titlebar_minimize">Minimize</div>
      </div>
    </div>
  `

  win.set_title(title)
  Hue.horizontal_separator(Hue.el(".app_titlebar_buttons", win.titlebar))
  let el = Hue.el(".app_titlebar_icon", win.titlebar)
  jdenticon.update(el, app.name)

  if (start_maximized) {
    win.show()
  } else {
    Hue.create_app_popup(win)
  }

  Hue.save_app(app)
  Hue.close_all_modals()
}

// After app picker is filtered
Hue.after_app_picker_filtered = function () {
  Hue.vertical_separator(Hue.el("#app_picker_container"))
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

// Get open apps
Hue.get_open_apps = function () {
  let apps = []

  for (let instance of Hue.msg_main_menu.higher_instances()) {
    if (instance.window) {
      if (instance.window.classList.contains("app")) {
        apps.push(instance)
      }
    }
  }

  return apps
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

// Refresh an app's iframe
Hue.refresh_app = function (win) {
  win.set(Hue.template_app({url: win.hue_app_url}))
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
Hue.save_app = function (app) {
  try {
    new URL(app.url)
  } catch (err) {
    return
  }

  for (let [i, item] of Hue.apps.entries()) {
    if (item.url === app.url) {
      Hue.apps.splice(i, 1)
      Hue.apps.unshift(app)
      Hue.update_app_picker()
      Hue.save_apps()
      break
    }
  }
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
      Hue.update_app_picker()
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
Hue.show_applist = function (filter = "") {
  let container = Hue.el("#applist_container")
  container.innerHTML = ""

  let windows = Hue.get_open_apps()
  windows.sort((a, b) => (a.hue_last_open > b.hue_last_open) ? -1 : 1)

  for (let win of windows) {
    let el = Hue.div("applist_item action modal_item")
    el.title = win.hue_app_url
    el.dataset.url = win.hue_app_url
    el.dataset.id = win.options.id
    el.innerHTML = `
      <canvas class="applist_item_icon" width="40" height="40"></canvas>
      <div class="applist_item_name">${win.hue_app_name}</div>
    `

    container.append(el)
  }

  for (let icon of Hue.els(".applist_item_icon")) {
    let url = icon.parentNode.dataset.url

    if (url) {
      let app = Hue.find_app_by_url(url)
      jdenticon.update(icon, app.name)
    }
  }

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