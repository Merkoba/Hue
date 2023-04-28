// Sets the initial state of the activity bar
// Setups events for the activity bar
Hue.setup_activity_bar = () => {
  setInterval(() => {
    Hue.update_activity_bar(true)
  }, Hue.config.activity_bar_delay)

  Hue.ev(Hue.el(`#activity_bar`), `click`, (e) => {
    if (e.target.closest(`.activity_bar_item`)) {
      let item = e.target.closest(`.activity_bar_item`)
      Hue.show_profile(Hue.dataset(item, `username`), Hue.dataset(item, `user_id`))
    }
  })
}

// Updates the activity bar
// If items are still in the list they are not removed
// This is to keep states like profile image rotation from being interrupted
Hue.update_activity_bar = (check = false) => {
  if (check && !Hue.do_update_activity_bar) {
    return
  }

  Hue.do_update_activity_bar = false
  let activity_list = Hue.userlist.slice(0)
  activity_list.sort(Hue.sort_userlist_by_activity)
  activity_list = activity_list.slice(0, Hue.config.max_activity_bar_items)
  activity_list.sort(Hue.sort_userlist_by_username)

  let activity_hash = ``
  activity_list.map(x => activity_hash += x.user_id + x.username)

  if (Hue.last_activity_hash === activity_hash) {
    return
  }

  Hue.last_activity_hash = activity_hash
  Hue.clear_activity_bar_items()

  for (let user of activity_list) {
    let pi = Hue.get_profilepic(user.user_id)

    let s = `
      <img class='activity_bar_profilepic profilepic icon_size actionbox' src='${pi}' loading='lazy'>
      <div class='activity_bar_text action'></div>`

    let el = Hue.create(`div`, `activity_bar_item flex_row_center`)
    el.innerHTML = s
    el.title = user.username

    let text_el = Hue.el(`.activity_bar_text`, el)
    let img_el = Hue.el(`.activity_bar_profilepic`, el)

    Hue.ev(img_el, `error`, () => {
      Hue.fallback_profilepic(img_el)
    })

    Hue.dataset(img_el, `user_id`, user.user_id)
    Hue.dataset(el, `user_id`, user.user_id)
    Hue.dataset(el, `username`, user.username)
    text_el.textContent = user.username.slice(0, Hue.config.max_activity_username_length)
    Hue.el(`#activity_bar_inner`).append(el)
  }

  Hue.resize_activity_bar()
}

Hue.resize_activity_bar = () => {
  let ab_inner = Hue.el(`#activity_bar_inner`)
  ab_inner.classList.remove(`no_usernames`)

  if (ab_inner.scrollWidth > ab_inner.clientWidth) {
    ab_inner.classList.add(`no_usernames`)
  }
}

// Gets an activity bar item by username
Hue.get_activity_bar_item_by_user_id = (id) => {
  for (let item of Hue.els(`.activity_bar_item`)) {
    if (Hue.dataset(item, `user_id`) === id) {
      return item
    }
  }
}

// Removes all items on the activity bar
Hue.clear_activity_bar_items = () => {
  Hue.els(`#activity_bar_inner .activity_bar_item`)
  .forEach(it => {
    it.remove()
  })
}

// Updates the profile image of an item in the activity bar
Hue.update_activity_bar_profilepic = (id, src) => {
  for (let item of Hue.els(`.activity_bar_item`)) {
    if (Hue.dataset(item, `user_id`) === id) {
      Hue.el(`.activity_bar_profilepic`, item).src = src
      return
    }
  }
}