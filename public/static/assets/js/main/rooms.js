// Creates a room
Hue.create_room = function (name) {
  Hue.socket_emit("create_room", {name: name})
}

// Shows the Open Room window where the user selects how to open a room
Hue.show_open_room = function (id) {
  if (id === Hue.config.main_room_id) {
    id = "/"
  }

  Hue.msg_info2.show(
    ["Open Room", Hue.template_open_room({ id: id })],
    function () {
      Hue.el("#open_room_here").addEventListener("click", function () {
        Hue.goto_url(id, "same")
        Hue.msg_info2.close()
      })

      Hue.el("#open_room_new_tab").addEventListener("click", function () {
        Hue.goto_url(id, "tab")
        Hue.msg_info2.close()
      })

      Hue.open_room_open = true
    }
  )
}

// Show feedback to the user after creating a room
Hue.on_room_created = function (data) {
  let f = function () {
    Hue.show_open_room(data.id)
  }

  let item = Hue.make_info_popup_item({
    message: "Room Created",
    on_click: f,
    icon: "key"
  })

  Hue.show_popup(Hue.make_info_popup(f), item)
  Hue.show_open_room(data.id)
}