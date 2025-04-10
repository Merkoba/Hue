App.setup_linksbar = () => {
  let links = DOM.el(`#linksbar_links`)

  DOM.ev(links, `click`, () => {
    App.show_links()
  })

  let click = DOM.el(`#linksbar_click`)

  DOM.ev(click, `click`, () => {
    App.linksbar_click()
  })

  DOM.ev(click, `auxclick`, (e) => {
    App.show_linksbar_context(e.clientX, e.clientY)
  })

  let img = DOM.el(`#linksbar_image`)

  DOM.ev(img, `click`, () => {
    let item = App.linksbar_item
    App.show_profile(item.username, item.user_id)
  })

  DOM.ev(img, `error`, () => {
    App.fallback_profilepic(img)
  })

  App.check_linksbar()
}

App.check_linksbar = () => {
  let bar = DOM.el(`#linksbar_panel`)

  if (App.get_setting(`show_linksbar`)) {
    DOM.show(bar)
  }
  else {
    DOM.hide(bar)
  }
}

App.linksbar_click = () => {
  App.goto_url(App.linksbar_item.url, `tab`)
}

App.set_linksbar_item = (args) => {
  let item = {
    id: args.id,
    url: args.url,
    title: args.title,
    username: args.username,
    user_id: args.user_id,
    date: args.date,
  }

  App.linksbar_item = item

  if (App.started) {
    App.update_linksbar()
  }
}

App.update_linksbar = () => {
  let item = App.linksbar_item
  let image_el = DOM.el(`#linksbar_image`)
  let click_el = DOM.el(`#linksbar_click`)

  if (!item) {
    DOM.hide(image_el)
    DOM.hide(click_el)
    return
  }

  DOM.show(image_el)
  DOM.show(click_el)
  let nd = App.nice_date(item.date)
  image_el.src = App.get_profilepic(item.user_id)
  image_el.title = `${item.username} | ${nd}`
  DOM.dataset(image_el, `date`, item.date)

  let url_el = DOM.el(`#linksbar_url`)
  url_el.textContent = item.url || ``

  if (item.url) {
    DOM.show(url_el)
  }
  else {
    DOM.hide(url_el)
  }

  if (item.url) {
    DOM.show(url_el)
  }
  else {
    DOM.hide(url_el)
  }

  let title_el = DOM.el(`#linksbar_title`)
  title_el.textContent = item.title || ``

  if (item.title) {
    DOM.show(title_el)
  }
  else {
    DOM.hide(title_el)
  }

  url_el.title = item.url
  title_el.title = item.title

  App.horizontal_separator(DOM.el(`#linksbar`))
  App.horizontal_separator(DOM.el(`#linksbar_click`))
}

App.linksbar_copy_url = () => {
  App.copy_string(App.linksbar_item.url, false)
}

App.linksbar_copy_title = () => {
  App.copy_string(App.linksbar_item.title, false)
}

App.reply_to_link = () => {
  let ans = App.get_message_by_id(App.linksbar_item.id)

  if (ans) {
    App.start_reply(ans[0])
  }
}