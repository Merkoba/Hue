// Sets the initial state of the activity bar
// Setups events for the activity bar
Hue.setup_activity_bar = function () {
  setInterval(function () {
    Hue.check_activity_bar()
  }, Hue.config.activity_bar_interval)

  setInterval(function () {
    Hue.check_trigger_activity()
  }, Hue.config.activity_bar_trigger_interval)

  $("#activity_bar").on("click", ".activity_bar_item", function () {
    Hue.show_profile(false, false, $(this).data("user_id"))
  })
}

// Check if it's ok to trigger activity
Hue.check_trigger_activity = function () {
  if (Hue.app_focused && !Hue.screen_locked) {
    if (Date.now() - Hue.last_activity_trigger >= (Hue.config.activity_bar_trigger_interval / 2)) {
      Hue.trigger_activity()
    }
  }
}

// Sends an activity signal to the server
// This is used to know which users might be active
// This is used to display users in the activity bar
Hue.trigger_activity = function () {
  Hue.last_activity_trigger = Date.now()
  Hue.socket_emit("activity_trigger", {})
}

// Checks if the activity list has changed and the activity bar must be updated
Hue.check_activity_bar = function (update = true) {
  if (Hue.activity_list.length === 0) {
    return false
  }

  let d = Date.now() - Hue.config.max_activity_bar_delay
  let new_top = []
  let changed = false

  for (let item of Hue.activity_list) {
    let user = Hue.get_user_by_user_id(item.user_id)

    if (item.date > d && user) {
      new_top.push(item)
    } else {
      changed = true
    }
  }

  if (changed) {
    Hue.activity_list = new_top

    if (update) {
      Hue.update_activity_bar()
    }
  }

  return changed
}

// Updates the activity bar
// If items are still in the list they are not removed
// This is to keep states like profile image rotation from being interrupted
Hue.update_activity_bar = function () {
  let c = $("#activity_bar_inner")

  if (Hue.activity_list.length === 0) {
    Hue.clear_activity_bar_items()
    return false
  }

  let ids_included = []

  $(".activity_bar_item").each(function () {
    let id = $(this).data("user_id")
    let user = Hue.get_user_by_user_id(id)

    if (user && Hue.activity_list.some((item) => item.user_id === id)) {
      ids_included.push(id)
    } else {
      $(this).remove()
    }
  })

  if (Hue.activity_list.length > ids_included.length) {
    for (let item of Hue.activity_list) {
      let user = Hue.get_user_by_user_id(item.user_id)

      if (ids_included.includes(user.user_id)) {
        continue
      }

      if (user) {
        let pi = user.profile_image || Hue.config.default_profile_image_url

        let h = $(`
          <div class='activity_bar_item'>
              <div class='activity_bar_image_container round_image_container'>
                  <img class='activity_bar_image profile_image' src='${pi}' loading='lazy'>
              </div>
              <div class='activity_bar_text'></div>
          </div>`)

        let text_el = h.find(".activity_bar_text").eq(0)
        let img_el = h.find(".activity_bar_image").eq(0)

        img_el.on("error", function () {
          if ($(this).attr("src") !== Hue.config.default_profile_image_url) {
            $(this).attr("src", Hue.config.default_profile_image_url)
          }
        })

        img_el.data("user_id", user.user_id)
        text_el.text(user.username)
        h.data("user_id", user.user_id)
        h.data("uname", user.username)
        c.append(h)
      }
    }
  }
}

// Pushes a user to the activity list and updates the activity bar
Hue.push_to_activity_bar = function (id, date) {
  let user = Hue.get_user_by_user_id(id)

  if (!user) {
    return false
  }

  if (!user) {
    return false
  }

  let d = Date.now() - Hue.config.max_activity_bar_delay

  if (date < d) {
    return false
  }

  for (let i = 0; i < Hue.activity_list.length; i++) {
    if (Hue.activity_list[i].user_id === id) {
      Hue.activity_list.splice(i, 1)
      break
    }
  }

  Hue.activity_list.unshift({ user_id: id, date: date })

  if (Hue.activity_list.length > Hue.config.max_activity_bar_items) {
    Hue.activity_list.pop()
  }

  Hue.check_activity_bar(false)

  if (Hue.started) {
    Hue.update_activity_bar()
  }
}

// Gets an activity bar item by username
Hue.get_activity_bar_item_by_user_id = function (id) {
  let item = false

  $(".activity_bar_item").each(function () {
    if ($(this).data("user_id") === id) {
      item = this
      return false
    }
  })

  return item
}

// Removes all items on the activity bar
Hue.clear_activity_bar_items = function () {
  $("#activity_bar_inner")
    .find(".activity_bar_item")
    .each(function () {
      $(this).remove()
    })
}

// Updates the profile image of an item in the activity bar
Hue.update_activity_bar_image = function (id, src) {
  $("#activity_bar_inner")
    .find(".activity_bar_item")
    .each(function () {
      if ($(this).data("user_id") === id) {
        $(this).find(".activity_bar_image").eq(0).attr("src", src)
        return false
      }
    })
}

// Updates the username of an activity bar item
Hue.update_activity_bar_username = function (id, uname) {
  $("#activity_bar_inner")
  .find(".activity_bar_item")
  .each(function () {
    if ($(this).data("user_id") === id) {
      $(this).find(".activity_bar_text").eq(0).text(uname)
      return false
    }
  }) 
}