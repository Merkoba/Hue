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

  App.check_linksbar()
}

App.check_linksbar = () => {
  let bar = DOM.el(`#linksbar`)

  if (App.get_setting(`show_linksbar`)) {
    bar.classList.remove(`nodisplay`)
  }
  else {
    bar.classList.add(`nodisplay`)
  }
}

App.linksbar_click = () => {
  App.goto_url(App.linksbar_item.url, `tab`)
}

App.set_linksbar_item = (url, title, username, date) => {
  let item = {
    url: url,
    title: title,
    username: username,
    date: date
  }

  App.linksbar_item = item

  if (App.started) {
    App.update_linksbar()
  }
}

App.update_linksbar = () => {
  let item = App.linksbar_item

  if (!item) {
    return
  }

  let url_el = DOM.el(`#linksbar_url`)
  url_el.textContent = item.url || ``

  if (item.url) {
    url_el.classList.remove(`nodisplay`)
  }
  else {
    url_el.classList.add(`nodisplay`)
  }

  let title_el = DOM.el(`#linksbar_title`)
  title_el.textContent = item.title || ``

  if (item.title) {
    title_el.classList.remove(`nodisplay`)
  }
  else {
    title_el.classList.add(`nodisplay`)
  }

  let click = DOM.el(`#linksbar_click`)
  DOM.dataset(click, `date`, item.date)
  DOM.dataset(click, `otitle`, `Linked by ${item.username}`)
  App.horizontal_separator(DOM.el(`#linksbar`))
  App.horizontal_separator(DOM.el(`#linksbar_click`))
}

App.linksbar_copy_url = () => {
  App.copy_string(App.linksbar_item.url, false)
}

App.linksbar_copy_title = () => {
  App.copy_string(App.linksbar_item.title, false)
}