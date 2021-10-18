// Creates a room
Hue.create_room = function (data) {
  Hue.msg_info2.close(function () {
    Hue.socket_emit("create_room", data)
  })
}

// Shows the Create Room window
Hue.show_create_room = function () {
  Hue.msg_info2.show(["Create Room", Hue.template_create_room()], function () {
    Hue.el("#create_room_done").addEventListener("click", function () {
      Hue.create_room_submit()
    })

    Hue.el("#create_room_name").focus()
    Hue.create_room_open = true
  })
}

// Submit action of Create Room window
Hue.create_room_submit = function () {
  let data = {}

  data.name = Hue.utilz.clean_string2(
    Hue.el("#create_room_name").value.substring(0, Hue.config.max_room_name_length)
  )

  if (data.name === "") {
    return false
  }

  Hue.create_room(data)
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

// Message to show when the create room cooldown is not over
Hue.create_room_cooldown_message = function () {
  let mins = Math.round(Hue.config.create_room_cooldown / 1000 / 60)
  let s
  
  if (mins === 1) {
    s = "minute"
  } else {
    s = "minutes"
  }

  Hue.checkmsg(`You must wait ${mins} ${s} between room creation`)
}