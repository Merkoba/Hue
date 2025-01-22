// Creates a Msg popup
App.create_popup = (args = {}, ptype = `unset`) => {
  if (!args.id) {
    App.popup_id += 1
    args.id = `popup_${App.popup_id}`
  }

  let def_args = {
    preset: `popup`,
    class: `popup`,
    position: `top`,
    clear_editables: true,
    show_effect: `none`,
    close_effect: `none`,
    window_class: `!custom_popup`,
    enable_titlebar: true,
    center_titlebar: true,
    titlebar_class: `!custom_titlebar_popup`,
    window_inner_x_class: `!titlebar_inner_x`,
    edge_padding_y: App.panel_height * 1.5,
    edge_padding_x: 12,
    remove_after_close: true,
  }

  App.utilz.def_args(def_args, args)
  let popup = Msg.factory(args)
  popup.hue_type = ptype
  return popup
}

// Makes action popups like for file upload progress
App.show_action_popup = (args = {}) => {
  let def_args = {
    on_x_button_click: () => {},
  }

  App.utilz.def_args(def_args, args)
  let on_click = () => {}

  if (args.on_click) {
    on_click = (instance) => {
      instance.close()
      args.on_click()
    }
  }

  let obj = {
    position: `top`,
    enable_titlebar: true,
    window_x: `inner_right`,
    content_class: `!action_popup`,
    window_width: `auto`,
    on_click,
    close_on_escape: false,
    on_x_button_click: args.on_x_button_click,
  }

  if (!args.title) {
    args.title = `Action`
  }

  if (args.id) {
    obj.id = args.id
  }

  let popup = App.create_popup(obj)
  let classes = ``

  if (args.on_click) {
    classes = `action`
  }

  let icon = ``

  if (args.icon) {
    icon = App.get_icon(args.icon, `action_popup_icon`)
  }

  let html = App.template_action_popup({
    classes,
    icon,
    message: args.message,
  })

  popup.show([args.title, html])
  return popup
}

// Gets all Msg popup instances
App.get_popup_instances = () => {
  return App.msg_main_menu.lower_instances()
}

// Closes all Msg popup instances
App.close_all_popups = (callback = false) => {
  for (let instance of App.get_popup_instances()) {
    instance.close()
  }
}