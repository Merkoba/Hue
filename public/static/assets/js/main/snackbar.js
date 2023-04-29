App.setup_snackbar = () => {
  let left = App.el(`#snackbar_links`)

  App.ev(left, `click`, () => {
    App.show_links()
  })

  let center = App.el(`#snackbar_url`)

  App.ev(center, `click`, (e) => {
    if (App.snackbar_items.length > 0) {
      App.goto_url(App.snackbar_items[0].url, `tab`)
      e.stopPropagation()
    }
  })
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
  App.el(`#snackbar_url`).title = item.title
}