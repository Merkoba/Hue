// Superuser command to create a room
Hue.create_room = function (name) {
  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("create_room", {name: name})
  })
}

// Superuser command to create a room
Hue.delete_room = function (name) {
  Hue.show_confirm("Superuser Command", "", function () {
    Hue.socket_emit("delete_room")
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

// Fill roomlist with data
Hue.update_roomlist = function (data) {
  let container = Hue.el("#roomlist_container")
  container.innerHTML = ""
  data.roomlist.sort((a, b) => (a.modified < b.modified) ? 1 : -1)

  for (let room of data.roomlist) {
    let item = Hue.div("roomlist_item modal_item flex_column_center action")
    
    item.innerHTML = Hue.template_roomlist_item({
      name: room.name, 
      topic: room.topic || "Not set",
      modified: Hue.utilz.timeago(room.modified)
    })

    let icon = Hue.el(".roomlist_icon", item)
    jdenticon.update(icon, room.name)
    
    item.addEventListener("click", function () {
      Hue.show_open_room(room.id)
    })

    container.append(item)
  }

  Hue.vertical_separator(container)
}

// Show roomlist
Hue.show_roomlist = function (filter = "") {
  Hue.socket_emit("get_roomlist")
  Hue.roomlist_filter = filter
}

// When roomlist is fetched
Hue.on_roomlist_received = function (data) {
  Hue.update_roomlist(data)

  Hue.msg_roomlist.show(function () {
    if (Hue.roomlist_filter.trim()) {
      Hue.el("#roomlist_filter").value = Hue.roomlist_filter
      Hue.do_modal_filter()
    }
  })
}

// On roomlist filtered
Hue.after_roomlist_filtered = function () {
  let container = Hue.el("#roomlist_container")
  Hue.vertical_separator(container)
}