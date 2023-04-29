App.setup_snackbar = () => {
  let content = App.el(`#snackbar_content`)

  App.ev(content, `click`, (e) => {
    if (App.snackbar_items.length > 0) {
      App.goto_url(App.snackbar_items[0].url, `tab`)
      e.stopPropagation()
    }
  })

  let main = App.el(`#snackbar`)

  App.ev(main, `click`, () => {
    App.show_links()
  })

  main.title = `Show Links`
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

  App.el(`#snackbar_content`).textContent = item.url
  App.el(`#snackbar_content`).title = item.title
}