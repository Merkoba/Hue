// Sets the initial state of the activity bar
// Setups events for the activity bar
Hue.setup_activity_bar = function () {
  setInterval(function () {
    Hue.update_activity_bar(true)
  }, Hue.config.activity_bar_interval)

  document.querySelector("#activity_bar").addEventListener("click", function (e) {
    if (e.target.closest(".activity_bar_item")) {
      Hue.show_profile("", e.target.closest(".activity_bar_item").dataset.user_id)
    }
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
    let pi = Hue.get_profilepic(user.user_id)

    let s = `
      <div class='activity_bar_item'>
          <div class='activity_bar_image_container round_image_container'>
              <img class='activity_bar_image profilepic' src='${pi}' loading='lazy'>
          </div>
          <div class='activity_bar_text'></div>
      </div>`

    let el0 = document.createElement("div")
    el0.innerHTML = s
    let el = el0.firstElementChild
    let text_el = el.querySelector(".activity_bar_text")
    let img_el = el.querySelector(".activity_bar_image")

    img_el.addEventListener("error", function () {
      if (this.src !== Hue.config.default_profilepic_url) {
        this.src = Hue.config.default_profilepic_url
      }
    })

    img_el.dataset.user_id = user.user_id
    text_el.textContent = user.username.slice(0, Hue.config.max_activity_username_length)
    el.dataset.user_id = user.user_id
    el.dataset.uname =user.username
    document.querySelector("#activity_bar_inner").append(el)
  }

  Hue.resize_activity_bar()
}

Hue.resize_activity_bar = function () {
  let ab_inner = document.querySelector("#activity_bar_inner")
  ab_inner.classList.remove("no_usernames")

  if (ab_inner.scrollWidth > ab_inner.clientWidth) {
    ab_inner.classList.add("no_usernames")
  }
}

// Gets an activity bar item by username
Hue.get_activity_bar_item_by_user_id = function (id) {
  let item = false

  document.querySelectorAll(".activity_bar_item").forEach(function (it) {
    if (it.dataset.user_id === id) {
      item = it
      return false
    }
  })

  return item
}

// Removes all items on the activity bar
Hue.clear_activity_bar_items = function () {
  document.querySelector("#activity_bar_inner")
  .querySelectorAll(".activity_bar_item")
  .forEach(function (it) {
    it.remove()
  })
}

// Updates the profile image of an item in the activity bar
Hue.update_activity_bar_image = function (id, src) {
  document.querySelector("#activity_bar_inner")
  .querySelectorAll(".activity_bar_item")
  .forEach(function (it) {
    if (it.dataset.user_id === id) {
      it.querySelector(".activity_bar_image").src = src
      return false
    }
  })
}