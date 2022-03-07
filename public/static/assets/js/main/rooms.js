// Superuser command to create a room
Hue.create_room = function (name) {
  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("create_room", {name: name})
  })
}

// Shows the Open Room window where the user selects how to open a room
Hue.show_open_room = function (id) {
  if (id === Hue.config.main_room_id) {
    id = "/"
  }

  Hue.msg_info.show(
    ["Open Room", Hue.template_open_room({ id: id })],
    function () {
      Hue.el("#open_room_here").addEventListener("click", function () {
        Hue.goto_url(id, "same")
        Hue.msg_info.close()
      })

      Hue.el("#open_room_new_tab").addEventListener("click", function () {
        Hue.goto_url(id, "tab")
        Hue.msg_info.close()
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

// Setup room list
Hue.setup_rooms = function () {
  let container = Hue.el("#rooms_container")

  for (let room of Hue.config.rooms) {
    let item = Hue.div("rooms_item modal_item flex_column_center action")
    
    item.innerHTML = Hue.template_rooms_item({
      name: room.name, 
      topic: room.topic || "Not set"
    })
    
    let icon = Hue.el(".rooms_icon", item)
    jdenticon.update(icon, room.name)
    
    item.addEventListener("click", function () {
      Hue.show_open_room(room.id)
    })

    container.append(item)
  }

  Hue.vertical_separator(container)
}

// Show room list
Hue.show_rooms = function (filter = "") {
  Hue.msg_rooms.show(function () {
    if (filter.trim()) {
      Hue.el("#rooms_filter").value = filter
      Hue.do_modal_filter()
    }
  })
}

// On rooms filtered
Hue.after_rooms_filtered = function () {
  let container = Hue.el("#rooms_container")
  Hue.vertical_separator(container)
}