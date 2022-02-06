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

  Hue.start_app({name: new URL(url).hostname, url: url})
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
  win.set(Hue.template_app({url: app.url}))

  win.titlebar.addEventListener("click", function () {
    win.close()
    Hue.create_app_popup(app.name, win)
  })

  win.set_title(app.name)
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