App.setup_linksbar = () => {
  let links = App.el(`#linksbar_links`)

  App.ev(links, `click`, () => {
    App.show_links()
  })

  let click = App.el(`#linksbar_click`)

  App.ev(click, `click`, () => {
    App.linksbar_click()
  })

  App.ev(click, `auxclick`, (e) => {
    App.show_linksbar_context(e.clientX, e.clientY)
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
  App.goto_url(App.linksbar_item.url, `tab`)
}

App.update_linksbar = (url, title) => {
  let item = {
    url: url,
    title: title,
  }

  App.linksbar_item = item

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
  App.horizontal_separator(App.el(`#linksbar_click`))
}

App.linksbar_copy_url = () => {
  App.copy_string(App.linksbar_item.url, false)
}

App.linksbar_copy_title = () => {
  App.copy_string(App.linksbar_item.title, false)
}