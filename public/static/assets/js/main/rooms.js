// Setup rooms
Hue.setup_rooms = () => {
  Hue.ev(Hue.el(`#open_room_here`), `click`, () => {
    Hue.goto_url(Hue.open_room_id, `same`)
    Hue.msg_open_room.close()
  })

  Hue.ev(Hue.el(`#open_room_new_tab`), `click`, () => {
    Hue.goto_url(Hue.open_room_id, `tab`)
    Hue.msg_open_room.close()
  })
}

// Superuser command to create a room
Hue.create_room = (name) => {
  Hue.show_confirm(`Run superuser command`, () => {
    Hue.socket_emit(`create_room`, {name: name})
  })
}

// Superuser command to create a room
Hue.delete_room = (name) => {
  Hue.show_confirm(`Run superuser command`, () => {
    Hue.socket_emit(`delete_room`)
  })
}

// Shows the Open Room window where the user selects how to open a room
Hue.show_open_room = (id, name) => {
  if (id === Hue.config.main_room_id) {
    id = `/`
  }

  Hue.open_room_id = id
  Hue.el(`#open_room_name`).textContent = `Go to ${name || id}`
  Hue.msg_open_room.show()
}

// Show feedback to the user after creating a room
Hue.on_room_created = (data) => {
  let f = () => {
    Hue.show_open_room(data.id)
  }

  let item = Hue.make_info_popup_item({
    message: `Room Created`,
    on_click: f,
    icon: `key`
  })

  Hue.show_popup(Hue.make_info_popup(f), item)
  Hue.show_open_room(data.id)
}

// Fill roomlist with data
Hue.update_roomlist = (data) => {
  let container = Hue.el(`#roomlist_container`)
  container.innerHTML = ``
  data.roomlist.sort((a, b) => (a.modified < b.modified) ? 1 : -1)

  for (let room of data.roomlist) {
    let item = Hue.create(`div`, `roomlist_item modal_item flex_column_center action`)
    let topic = room.topic.substring(0, 200).trim()

    item.innerHTML = Hue.template_roomlist_item({
      name: room.name,
      topic: topic,
      modified: Hue.utilz.timeago(room.modified)
    })

    if (!topic) {
      Hue.el(`.roomlist_topic`, item).style.display = `none`
    }

    let icon = Hue.el(`.roomlist_icon`, item)
    jdenticon.update(icon, room.name)

    Hue.ev(item, `click`, () => {
      Hue.show_open_room(room.id, room.name)
    })

    container.append(item)
  }

  Hue.vertical_separator(container)
}

// Show roomlist
Hue.show_roomlist = (filter = ``) => {
  Hue.socket_emit(`get_roomlist`)
  Hue.roomlist_filter = filter
}

// When roomlist is fetched
Hue.on_roomlist_received = (data) => {
  Hue.update_roomlist(data)

  Hue.msg_roomlist.show(() => {
    if (Hue.roomlist_filter.trim()) {
      Hue.el(`#roomlist_filter`).value = Hue.roomlist_filter
      Hue.do_modal_filter()
    }
  })
}

// On roomlist filtered
Hue.after_roomlist_filtered = () => {
  let container = Hue.el(`#roomlist_container`)
  Hue.vertical_separator(container)
}