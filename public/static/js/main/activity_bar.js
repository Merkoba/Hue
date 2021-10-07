// Sets the initial state of the activity bar
// Setups events for the activity bar
Hue.setup_activity_bar = function () {
  setInterval(function () {
    Hue.update_activity_bar(true)
  }, Hue.config.activity_bar_interval)

  $("#activity_bar").on("click", ".activity_bar_item", function () {
    Hue.show_profile(false, false, $(this).data("user_id"))
  })
}

// Updates the activity bar
// If items are still in the list they are not removed
// This is to keep states like profile image rotation from being interrupted
Hue.update_activity_bar = function (check = false) {
  if (check && !Hue.do_update_activity_bar) {
    return
  }

  Hue.do_update_activity_bar = false
  let activity_list = Hue.userlist.slice(0)
  activity_list.sort(Hue.sort_userlist_by_activity)
  activity_list = activity_list.slice(0, Hue.config.max_activity_bar_items)
  activity_list.sort(Hue.sort_userlist_by_username)
  
  let activity_hash = ""
  activity_list.map(x => activity_hash += x.user_id + x.username)
  
  if (Hue.last_activity_hash === activity_hash) {
    return false
  }

  Hue.last_activity_hash = activity_hash
  Hue.clear_activity_bar_items()

  for (let user of activity_list) {
    if (user.profile_image) {
      pi = `${Hue.config.public_images_location}profile/${user.profile_image}`
    } else {
      pi = Hue.config.default_profile_image_url
    }

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
    text_el.text(user.username.slice(0, Hue.config.max_activity_username_length))
    h.data("user_id", user.user_id)
    h.data("uname", user.username)
    $("#activity_bar_inner").append(h)
  }

  Hue.resize_activity_bar()
}

Hue.resize_activity_bar = function () {
  let ab_inner = $("#activity_bar_inner")
  ab_inner.removeClass("no_usernames")

  if (ab_inner[0].scrollWidth > ab_inner[0].clientWidth) {
    ab_inner.addClass("no_usernames")
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