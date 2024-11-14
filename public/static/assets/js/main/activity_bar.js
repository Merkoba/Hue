// Sets the initial state of the activity bar
// Setups events for the activity bar
App.setup_activity_bar = () => {
  setInterval(() => {
    App.update_activity_bar(true)
  }, App.config.activity_bar_delay)

  DOM.ev(DOM.el(`#activity_bar`), `click`, (e) => {
    if (e.target.closest(`.activity_bar_item`)) {
      let item = e.target.closest(`.activity_bar_item`)
      App.show_profile(DOM.dataset(item, `username`), DOM.dataset(item, `user_id`))
    }
  })

  DOM.ev(DOM.el(`#activity_bar`), `auxclick`, (e) => {
    if (e.button === 1) {
      let item = e.target.closest(`.activity_bar_item`)
      App.mention_user(DOM.dataset(item, `username`))
    }
  })
}

// Updates the activity bar
// If items are still in the list they are not removed
// This is to keep states like profile image rotation from being interrupted
App.update_activity_bar = (check = false) => {
  if (check && !App.do_update_activity_bar) {
    return
  }

  App.do_update_activity_bar = false
  let activity_list = App.userlist.slice(0)
  activity_list.sort(App.sort_userlist_by_activity)
  activity_list = activity_list.slice(0, App.config.max_activity_bar_items)
  activity_list.sort(App.sort_userlist_by_username)

  let activity_hash = ``
  activity_list.map(x => activity_hash += x.user_id + x.username)

  if (App.last_activity_hash === activity_hash) {
    return
  }

  App.last_activity_hash = activity_hash
  App.clear_activity_bar_items()

  for (let user of activity_list) {
    let pi = App.get_profilepic(user.user_id)

    let s = `
      <img class='activity_bar_profilepic profilepic icon_size actionbox' src='${pi}' loading='lazy'>
      <div class='activity_bar_text action'></div>`

    let el = DOM.create(`div`, `activity_bar_item flex_row_center`)
    el.innerHTML = s
    el.title = user.username

    let text_el = DOM.el(`.activity_bar_text`, el)
    let img_el = DOM.el(`.activity_bar_profilepic`, el)

    DOM.ev(img_el, `error`, () => {
      App.fallback_profilepic(img_el)
    })

    DOM.dataset(img_el, `user_id`, user.user_id)
    DOM.dataset(el, `user_id`, user.user_id)
    DOM.dataset(el, `username`, user.username)
    text_el.textContent = user.username.slice(0, App.config.max_activity_username_length)
    DOM.el(`#activity_bar_inner`).append(el)
  }
}

// Gets an activity bar item by username
App.get_activity_bar_item_by_user_id = (id) => {
  for (let item of DOM.els(`.activity_bar_item`)) {
    if (DOM.dataset(item, `user_id`) === id) {
      return item
    }
  }
}

// Removes all items on the activity bar
App.clear_activity_bar_items = () => {
  for (let el of DOM.els(`#activity_bar_inner .activity_bar_item`)) {
    el.remove()
  }
}

// Updates the profile image of an item in the activity bar
App.update_activity_bar_profilepic = (id, src) => {
  for (let item of DOM.els(`.activity_bar_item`)) {
    if (DOM.dataset(item, `user_id`) === id) {
      DOM.el(`.activity_bar_profilepic`, item).src = src
      return
    }
  }
}