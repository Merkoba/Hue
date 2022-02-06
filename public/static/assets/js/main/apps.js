// Setup apps
Hue.setup_apps = function () {
  Hue.el("#app_picker_container").addEventListener("click", function (e) {
    if (!e.target) {
      return
    }   

    if (e.target.classList.contains("app_picker_item")) {
      let index = e.target.dataset.appindex
      Hue.msg_app_picker.close()
      Hue.start_app(index)
    } 
  })

  Hue.vertical_separator(Hue.el("#app_picker_container"))
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
Hue.start_app = function (index) {
  Hue.close_all_modals()
  let app = Hue.config.applist[index]
  Hue.active_app = index
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