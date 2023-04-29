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

App.update_snackbar = (url, title = ``) => {
  let item = {
    url: url,
    title: title,
  }

  App.snackbar_items.unshift(item)

  if (App.snackbar_items.length >= App.max_snackbar_items) {
    App.snackbar_items.pop()
  }

  App.el(`#snackbar_url`).textContent = item.url
  App.el(`#snackbar_title`).textContent = item.title
}