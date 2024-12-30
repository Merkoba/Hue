// Setup rooms
App.setup_rooms = () => {
  DOM.ev(DOM.el(`#open_room_here`), `click`, () => {
    App.goto_url(App.open_room_id, `same`)
    App.msg_open_room.close()
  })

  DOM.ev(DOM.el(`#open_room_new_tab`), `click`, () => {
    App.goto_url(App.open_room_id, `tab`)
    App.msg_open_room.close()
  })
}

// Superuser command to create a room
App.create_room = (name) => {
  App.show_confirm(`Run superuser command`, () => {
    App.socket_emit(`create_room`, {name: name})
  })
}

// Superuser command to create a room
App.delete_room = (name) => {
  App.show_confirm(`Run superuser command`, () => {
    App.socket_emit(`delete_room`)
  })
}

// Shows the Open Room window where the user selects how to open a room
App.show_open_room = (id, name) => {
  if (id === App.config.main_room_id) {
    id = `/`
  }

  App.open_room_id = id
  DOM.el(`#open_room_name`).textContent = `Go to ${name || id}`
  App.msg_open_room.show()
}

// Show feedback to the user after creating a room
App.on_room_created = (data) => {
  let f = () => {
    App.show_open_room(data.id)
  }

  let item = App.make_info_popup_item({
    message: `Room Created`,
    on_click: f,
    icon: `key`,
  })

  App.show_popup(App.make_info_popup(f), item)
  App.show_open_room(data.id)
}

// Fill roomlist with data
App.update_roomlist = (data) => {
  let container = DOM.el(`#roomlist_container`)
  container.innerHTML = ``
  data.roomlist.sort((a, b) => (a.modified < b.modified) ? 1 : -1)

  for (let room of data.roomlist) {
    let item = DOM.create(`div`, `roomlist_item modal_item flex_column_center action`)
    let topic = room.topic.substring(0, 200).trim()

    item.innerHTML = App.template_roomlist_item({
      name: room.name,
      topic: topic,
      modified: App.utilz.timeago(room.modified),
    })

    if (!topic) {
      DOM.el(`.roomlist_topic`, item).style.display = `none`
    }

    let icon = DOM.el(`.roomlist_icon`, item)
    jdenticon.update(icon, room.name)

    DOM.ev(item, `click`, () => {
      App.show_open_room(room.id, room.name)
    })

    container.append(item)
  }

  App.vertical_separator(container)
}

// Show roomlist
App.show_roomlist = (filter = ``) => {
  App.socket_emit(`get_roomlist`)
  App.roomlist_filter = filter
}

// When roomlist is fetched
App.on_roomlist_received = (data) => {
  App.update_roomlist(data)
  App.msg_roomlist.show()

  if (App.roomlist_filter.trim()) {
    DOM.el(`#roomlist_filter`).value = App.roomlist_filter
    App.do_modal_filter()
  }
}

// On roomlist filtered
App.after_roomlist_filtered = () => {
  let container = DOM.el(`#roomlist_container`)
  App.vertical_separator(container)
}