App.setup_linksbar = () => {
  let links = App.el(`#linksbar_links`)

  App.ev(links, `click`, () => {
    App.show_links()
  })

  let url = App.el(`#linksbar_url`)

  App.ev(url, `click`, () => {
    App.linksbar_click()
  })

  let title = App.el(`#linksbar_title`)

  App.ev(title, `click`, () => {
    App.linksbar_click()
  })

  App.check_linksbar()
}

App.check_linksbar = () => {
  let bar = App.el(`#linksbar`)

  if (App.get_setting(`show_linksbar`)) {
    bar.classList.remove(`nodisplay`)
  }
  else {
    bar.classList.add(`nodisplay`)
  }
}

App.linksbar_click = () => {
  if (App.linksbar_items.length > 0) {
    App.goto_url(App.linksbar_items[0].url, `tab`)
  }
}

App.update_linksbar = (url, title) => {
  let item = {
    url: url,
    title: title,
  }

  App.linksbar_items.unshift(item)

  if (App.linksbar_items.length >= App.max_linksbar_items) {
    App.linksbar_items.pop()
  }

  let url_el = App.el(`#linksbar_url`)
  url_el.textContent = item.url || ``

  if (item.url) {
    url_el.classList.remove(`nodisplay`)
  }
  else {
    url_el.classList.add(`nodisplay`)
  }

  let title_el = App.el(`#linksbar_title`)
  title_el.textContent = item.title || ``

  if (item.title) {
    title_el.classList.remove(`nodisplay`)
  }
  else {
    title_el.classList.add(`nodisplay`)
  }

  App.horizontal_separator(App.el(`#linksbar`))
}