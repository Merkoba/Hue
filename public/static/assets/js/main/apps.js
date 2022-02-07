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

  Hue.update_app_picker()
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
Hue.open_app = function (url = "") {
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

  Hue.start_app(app)
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
Hue.start_app = function (app) {
  if (!app) {
    return
  }

  let hostname = ""

  try {
    hostname = new URL(app.url).hostname
  } catch (err) {
    return
  }
  
  Hue.close_all_modals()
  let win = Hue.create_app_window()
  win.hue_app_name = app.name
  win.hue_app_url = app.url

  win.set(Hue.template_app({url: app.url}))

  win.titlebar.addEventListener("click", function (e) {
    if (e.target.classList.contains("app_titlebar_launch")) {
      Hue.show_app_picker()
    } else if (e.target.classList.contains("app_titlebar_cycle")) {
      Hue.cycle_apps("down")
    } else if (e.target.classList.contains("app_titlebar_refresh")) {
      Hue.refresh_app(win)
    } else if (e.target.classList.contains("app_titlebar_minimize")) {
      win.close()
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

  let name = app.name

  if (name !== hostname) {
    name += ` (${hostname})`
  }

  let title = `
    <div class="app_titlebar_container">
      <div class="app_titlebar_info">
        <canvas class="app_titlebar_icon" width="20" height="20"></canvas>
        <div class="app_titlebar_name">${name}</div>
      </div>

      <div class="app_titlebar_buttons">
        <div class="action app_titlebar_launch">Launch</div>
        <div class="action app_titlebar_cycle">Cycle</div>
        <div class="action app_titlebar_refresh">Refresh</div>
        <div class="action app_titlebar_minimize">Minimize</div>
      </div>
    </div>
  `

  win.set_title(title)
  Hue.horizontal_separator(Hue.el(".app_titlebar_buttons", win.titlebar))
  let el = Hue.el(".app_titlebar_icon", win.titlebar)
  jdenticon.update(el, app.name)

  win.show()
  Hue.save_app(app)
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

  Hue.active_app.close(function () {
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
  })
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
      break
    }
  }

  Hue.apps.unshift(app)
  Hue.save_apps()
  Hue.update_app_picker()
}

// Open app input
Hue.open_app_input = function () {
  Hue.msg_open_app.show(function () {
    Hue.el("#open_app_input").focus()
  })
}

// Remove app from the app list
Hue.forget_app = function (app) {
  for (let [i, item] of Hue.apps.entries()) {
    if (item.url === app.url) {
      Hue.apps.splice(i, 1)
      break
    }
  }

  Hue.update_app_picker()
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