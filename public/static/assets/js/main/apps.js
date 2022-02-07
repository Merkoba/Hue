// Setup apps
Hue.setup_apps = function () {
  Hue.el("#app_picker_container").addEventListener("click", function (e) {
    if (!e.target) {
      return
    }

    if (e.target.closest(".app_picker_item")) {
      let index = e.target.closest(".app_picker_item").dataset.appindex
      Hue.start_app(Hue.config.applist[index])
    } 
  })

  Hue.vertical_separator(Hue.el("#app_picker_container"))

  Hue.el("#app_picker_custom").addEventListener("click", function (e) {
    Hue.msg_custom_app_picker.show(function () {
      Hue.el("#custom_app_picker_input").focus()
    })
  })

  Hue.el("#custom_app_picker_open").addEventListener("click", function () {
    Hue.open_custom_app()
  })

  for (let icon of Hue.els(".app_picker_item_icon")) {
    let index = icon.parentNode.dataset.appindex
    let app = Hue.config.applist[index]
    jdenticon.update(icon, app.name)
  }
}

// On custom app picker action
Hue.open_custom_app = function (url = "") {
  if (url === "") {
    url = Hue.el("#custom_app_picker_input").value
  }

  url = url.trim()

  if (!url) {
    return
  }

  if (!url.startsWith("https://") && !url.startsWith("http://")) {
    url = `https://${url}`
  }

  Hue.start_app({name: "Custom", url: url})
}

// Show the app picker
Hue.show_app_picker = function (filter) {
  Hue.msg_app_picker.show(function () {
    if (filter) {
      Hue.el("#app_picker_filter").value = filter
      Hue.do_modal_filter()
    }
  })
}

// Start a app
Hue.start_app = function (app) {
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
    } else if (e.target.classList.contains("app_titlebar_minimize")) {
      win.close()
    } else if (e.target.classList.contains("app_titlebar_close")) {
      win.close()
      win.destroy()
    }
  })

  win.titlebar.addEventListener("wheel", function (e) {
    Hue.app_cycle_wheel_timer(e.deltaY > 0 ? "down" : "up")
  })

  let title = `
    <div class="app_titlebar_container">
      <div class="app_titlebar_name">${app.name} (${new URL(app.url).hostname})</div>

      <div class="app_titlebar_buttons">
        <div class="pointer app_titlebar_launch">Launch</div>
        <div class="pointer app_titlebar_separator"> | </div>
        <div class="pointer app_titlebar_cycle">Cycle</div>
        <div class="pointer app_titlebar_separator"> | </div>
        <div class="pointer app_titlebar_minimize">Minimize</div>
        <div class="pointer app_titlebar_separator"> | </div>
        <div class="pointer app_titlebar_close">Close</div>
      </div>
    </div>
  `

  win.set_title(title)
  win.show()
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

  for (let instance of Hue.get_modal_instances()) {
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