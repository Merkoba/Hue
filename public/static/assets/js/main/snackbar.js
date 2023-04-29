App.setup_snackbar = () => {
  let c = App.el(`#snackbar_content`)

  App.ev(c, `click`, (e) => {
    if (App.snackbar_items.length > 0) {
      App.goto_url(App.snackbar_items[0].url, `tab`)
      e.stopPropagation()
    }
  })

  App.ev(c, `wheel`, (e) => {
    let direction = e.deltaY > 0 ? `down` : `up`

    if (direction === `down`) {
      App.next_snackbar()
    }
    else if (direction === `up`) {
      App.prev_snackbar()
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

  App.set_snackbar(item)
}

App.set_snackbar = (item) => {
  App.el(`#snackbar_content`).textContent = item.url
  App.el(`#snackbar_content`).title = item.title
}

App.prev_snackbar = () => {
  App.utilz.rotate_array(App.snackbar_items, 1)
  App.set_snackbar(App.snackbar_items[0])
}

App.next_snackbar = () => {
  App.utilz.rotate_array(App.snackbar_items, - 1)
  App.set_snackbar(App.snackbar_items[0])
}