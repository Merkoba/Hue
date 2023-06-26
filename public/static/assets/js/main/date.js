// Shows feedback with the current date in the nice date format
App.show_current_date = () => {
  App.checkmsg(App.nice_date())
}

// Update date periodically
App.start_update_date = () => {
  setInterval(() => {
    App.update_date()
  }, App.update_date_delay)
}

// The update date action
App.update_date = () => {
  App.update_date_chat()
  App.update_date_media()
  App.update_date_message_board()
  App.update_date_notifications()
  App.update_date_whispers()
}

App.update_date_chat = () => {
  for (let el of DOM.els(`.chat_area`)) {
    for (let ct of DOM.els(`.chat_date`, el)) {
      let message = ct.closest(`.message`)
      let date = DOM.dataset(message, `date`)
      ct.textContent = App.format_date(date)
    }
  }
}

App.update_date_media = () => {
  for (let el of DOM.els(`#media .media_info_container`)) {
    DOM.el(`.media_info_date`, el).textContent = App.format_date(DOM.dataset(el, `date`))
  }
}

App.update_date_message_board = () => {
  if (App.msg_message_board.is_open()) {
    let container = DOM.el(`#message_board_container`)

    for (let post of DOM.els(`.message_board_post`, container)) {
      let el = DOM.el(`.message_board_date`, post)
      let date = DOM.dataset(post, `date`)
      el.textContent = App.format_date(date)
    }
  }
}

App.update_date_notifications = () => {
  if (App.msg_notifications.is_open()) {
    let container = DOM.el(`#notifications_container`)

    for (let item of DOM.els(`.notification_item`, container)) {
      let el = DOM.el(`.notification_date`, item)
      let date = DOM.dataset(item, `date`)
      el.textContent = App.format_date(date)
    }
  }
}

App.update_date_whispers = () => {
  if (App.msg_whispers.is_open()) {
    let container = DOM.el(`#whispers_container`)

    for (let item of DOM.els(`.whisper_item`, container)) {
      let el = DOM.el(`.whisper_date`, item)
      let date = DOM.dataset(item, `date`)
      el.textContent = App.format_date(date)
    }
  }
}

// Format date
App.format_date = (date) => {
  let df = App.get_setting(`date_format`)

  if (df === `relative`) {
    return App.utilz.timeago(date)
  }
  else if (df === `absolute_12`) {
    return App.utilz.timestamp(date, 12)
  }
  else if (df === `absolute_24`) {
    return App.utilz.timestamp(date, 24)
  }
}

// Get nice date
App.nice_date = (date = Date.now()) => {
  let mode

  if (App.get_setting(`date_format`) === `absolute_24`) {
    mode = 24
  }
  else {
    mode = 12
  }

  return App.utilz.nice_date(date, mode)
}