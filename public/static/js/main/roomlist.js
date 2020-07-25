// Creates a room
Hue.create_room = function (data) {
  Hue.msg_info2.close(function () {
    Hue.socket_emit("create_room", data)
  })
}

// Request a room list to the server
// Either a public or a visited room list
Hue.request_roomlist = function (filter = "", type = "public_roomlist") {
  if (Hue.requesting_roomlist) {
    return false
  }

  Hue.requesting_roomlist = true
  Hue[`${type}_filter_string`] = filter
  Hue.socket_emit("roomlist", { type: type })

  setTimeout(function () {
    Hue.requesting_roomlist = false
  }, 1000)
}

// Handles a received room list
// Either a public or a visited room list
Hue.on_roomlist_received = function (data) {
  Hue.update_roomlist(data.type, data.roomlist)

  if (data.type === "public_roomlist") {
    Hue.show_public_roomlist()
  } else if (data.type === "visited_roomlist") {
    Hue.show_visited_roomlist()
  }
}

// Starts click events on room list items
Hue.start_roomlist_click_events = function () {
  $("#public_roomlist_container").on(
    "click",
    ".roomlist_item_inner",
    function () {
      Hue.show_open_room($(this).data("room_id"))
    }
  )

  $("#visited_roomlist_container").on(
    "click",
    ".roomlist_item_inner",
    function () {
      Hue.show_open_room($(this).data("room_id"))
    }
  )
}

// Builds the room list window items with received data
Hue.update_roomlist = function (type, roomlist) {
  $(`#${type}_filter`).val(Hue[`${type}_filter_string`])

  let s = $()

  s = s.add()

  for (let i = 0; i < roomlist.length; i++) {
    let c = `<div class='roomlist_item_inner pointer inline action' data-room_id='${roomlist[i].id}'>
            <div class='roomlist_name'></div><div class='roomlist_topic'></div>
            <div class='roomlist_here'></div><div class='roomlist_count'></div>
        </div>`

    let h = $(`<div class='modal_item roomlist_item'>${c}</div>`)

    h.find(".roomlist_name").eq(0).text(roomlist[i].name)
    h.find(".roomlist_count")
      .eq(0)
      .text(Hue.utilz.singular_or_plural(roomlist[i].usercount, "users"))

    if (roomlist[i].id === Hue.room_id) {
      h.find(".roomlist_here")
        .eq(0)
        .text("You are here")
        .css("display", "block")
    }

    let topic

    if (roomlist[i].topic.length > 0) {
      topic = roomlist[i].topic
    } else {
      topic = "No topic set"
    }

    h.find(".roomlist_topic").eq(0).text(topic).urlize()

    s = s.add(h)
  }

  $(`#${type}_container`).html(s)

  if (Hue[`${type}_filter_string`] !== "") {
    Hue.do_modal_filter(type)
  }
}

// Shows the Create Room window
Hue.show_create_room = function () {
  Hue.msg_info2.show(["Create Room", Hue.template_create_room()], function () {
    $("#create_room_suggest_name").click(function () {
      Hue.create_room_suggest_name()
    })

    $("#create_room_done").click(function () {
      Hue.create_room_submit()
    })

    $("#create_room_name").focus()
    Hue.create_room_open = true
  })
}

// Submit action of Create Room window
Hue.create_room_submit = function () {
  let data = {}

  data.name = Hue.utilz.clean_string2(
    $("#create_room_name").val().substring(0, Hue.config.max_room_name_length)
  )

  if (data.name === "") {
    return false
  }

  data.public = JSON.parse($("#create_room_public option:selected").val())

  Hue.create_room(data)
}

// Puts a random room name in the Create Room window's input
Hue.create_room_suggest_name = async function () {
  if (Hue.wordz === undefined) {
    await Hue.load_wordz()
  }

  let sentence = Hue.wordz.make_random_sentence(2, true)
  $("#create_room_name").val(sentence)
}

// Shows the Open Room window where the user selects how to open a room
Hue.show_open_room = function (id) {
  if (id === Hue.config.main_room_id) {
    id = "/"
  }

  Hue.msg_info2.show(
    ["Open Room", Hue.template_open_room({ id: id })],
    function () {
      $("#open_room_here").click(function () {
        Hue.goto_url(id)
        Hue.msg_info2.close()
      })

      $("#open_room_new_tab").click(function () {
        Hue.goto_url(id, "tab")
        Hue.msg_info2.close()
      })

      Hue.open_room_open = true
    }
  )
}

// Shows the public room list
Hue.show_public_roomlist = function () {
  Hue.msg_public_roomlist.show()
}

// Shows the visited room list
Hue.show_visited_roomlist = function () {
  Hue.msg_visited_roomlist.show()
}

// Show the go to room window
Hue.show_goto_room = function () {
  Hue.msg_info2.show(["Go To Room", Hue.template_goto_room()], function () {
    $("#goto_room_submit").click(function () {
      Hue.goto_room_action()
    })

    $("#goto_room_input").focus()
    Hue.goto_room_open = true
  })
}

// On go to room window submit
Hue.goto_room_action = function () {
  let id = $("#goto_room_input").val().trim()

  if (id.length === 0) {
    return false
  }

  Hue.show_open_room(id)
}

// Show feedback to the user after creating a room
Hue.on_room_created = function (data) {
  let onclick = function () {
    Hue.show_open_room(data.id)
  }

  Hue.feedback("Room Created", {
    brk: "<i class='chat_icon fa fa-key'></i>",
    onclick: onclick,
    save: true,
  })

  Hue.show_open_room(data.id)
}
