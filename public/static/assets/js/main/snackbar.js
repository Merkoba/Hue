App.setup_snackbar = () => {
  let links = App.el(`#snackbar_links`)

  App.ev(links, `click`, () => {
    App.show_links()
  })

  let url = App.el(`#snackbar_url`)

  App.ev(url, `click`, () => {
    App.snackbar_click()
  })

  let title = App.el(`#snackbar_title`)

  App.ev(title, `click`, () => {
    App.snackbar_click()
  })
}

App.snackbar_click = () => {
  if (App.snackbar_items.length > 0) {
    App.goto_url(App.snackbar_items[0].url, `tab`)
  }
}

App.update_snackbar = (url, title) => {
  let item = {
    url: url,
    title: title,
  }

  App.snackbar_items.unshift(item)

  if (App.snackbar_items.length >= App.max_snackbar_items) {
    App.snackbar_items.pop()
  }

  let url_el = App.el(`#snackbar_url`)
  url_el.textContent = item.url || ``

  if (item.url) {
    url_el.classList.remove(`nodisplay`)
  }
  else {
    url_el.classList.add(`nodisplay`)
  }

  let title_el = App.el(`#snackbar_title`)
  title_el.textContent = item.title || ``

  if (item.title) {
    title_el.classList.remove(`nodisplay`)
  }
  else {
    title_el.classList.add(`nodisplay`)
  }

  App.horizontal_separator(App.el(`#snackbar`))
}