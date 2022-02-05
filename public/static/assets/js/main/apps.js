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

  Hue.el("#Msg-titlebar-app").addEventListener("click", function () {
    if (Hue.app_height_mode === "full") {
      Hue.app_height_mode = "titlebar"
      Hue.remove_alert_title()
      Hue.app_peek_active = true
      Hue.app_counter = 0
    } else if (Hue.app_height_mode === "titlebar") {
      Hue.app_height_mode = "full"
      Hue.app_peek_active = false
    }

    Hue.update_app_title()
    Hue.change_modal_window_height("app", Hue.app_height_mode)
  })
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
  Hue.msg_app.set_title(app.name)
  Hue.app_peek_active = false
  Hue.app_counter = 0
  Hue.app_height_mode = "full"
  Hue.change_modal_window_height("app", "full")
  Hue.el("#Msg-content-container-app").classList.remove("nodisplay")

  Hue.msg_app.show(function () {
    Hue.el("#app_frame").src = app.url
  })
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

// Update the app title using the activity counter
Hue.update_app_title = function () {
  let app = Hue.config.applist[Hue.active_app]
  let title = app.name
  
  if (Hue.app_counter > 0) {
    title += ` (${Hue.app_counter})`
  }

  Hue.msg_app.set_title(title)
}