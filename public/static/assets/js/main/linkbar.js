App.setup_linkbar = () => {
  let links = App.el(`#linkbar_links`)

  App.ev(links, `click`, () => {
    App.show_links()
  })

  let url = App.el(`#linkbar_url`)

  App.ev(url, `click`, () => {
    App.linkbar_click()
  })

  let title = App.el(`#linkbar_title`)

  App.ev(title, `click`, () => {
    App.linkbar_click()
  })

  App.check_linkbar()
}

App.check_linkbar = () => {
  let bar = App.el(`#linkbar`)

  if (App.get_setting(`show_linkbar`)) {
    bar.classList.remove(`nodisplay`)
  }
  else {
    bar.classList.add(`nodisplay`)
  }
}

App.linkbar_click = () => {
  if (App.linkbar_items.length > 0) {
    App.goto_url(App.linkbar_items[0].url, `tab`)
  }
}

App.update_linkbar = (url, title) => {
  let item = {
    url: url,
    title: title,
  }

  App.linkbar_items.unshift(item)

  if (App.linkbar_items.length >= App.max_linkbar_items) {
    App.linkbar_items.pop()
  }

  let url_el = App.el(`#linkbar_url`)
  url_el.textContent = item.url || ``

  if (item.url) {
    url_el.classList.remove(`nodisplay`)
  }
  else {
    url_el.classList.add(`nodisplay`)
  }

  let title_el = App.el(`#linkbar_title`)
  title_el.textContent = item.title || ``

  if (item.title) {
    title_el.classList.remove(`nodisplay`)
  }
  else {
    title_el.classList.add(`nodisplay`)
  }

  App.horizontal_separator(App.el(`#linkbar`))
}