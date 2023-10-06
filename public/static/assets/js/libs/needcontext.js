// NeedContext v3.0

// Main object
const NeedContext = {}
NeedContext.created = false

// Overridable function to perform after show
NeedContext.after_show = () => {}

// Overridable function to perform after hide
NeedContext.after_hide = () => {}

// Minimum menu width and height
NeedContext.min_width = `25px`
NeedContext.min_height = `25px`
NeedContext.back_icon = `⬅️`
NeedContext.back_text = `Back`
NeedContext.clear_text = `Clear`
NeedContext.item_sep = `4px`
NeedContext.layers = {}
NeedContext.level = 0
NeedContext.gap = `0.45rem`
NeedContext.center_top = `50%`

// Set defaults
NeedContext.set_defaults = () => {
  NeedContext.open = false
  NeedContext.mousedown = false
  NeedContext.first_mousedown = false
  NeedContext.keydown = false
  NeedContext.filtered = false
  NeedContext.last_x = 0
  NeedContext.last_y = 0
  NeedContext.layers = {}
}

// Clear the filter
NeedContext.clear_filter = () => {
  NeedContext.filter.value = ``
  NeedContext.do_filter()
  NeedContext.filter.focus()
}

// Filter from keyboard input
NeedContext.do_filter = () => {
  let value = NeedContext.filter.value
  let cleaned = NeedContext.remove_spaces(value).toLowerCase()
  let selected = false

  for (let el of document.querySelectorAll(`.needcontext-separator`)) {
    if (cleaned) {
      el.classList.add(`needcontext-hidden`)
    }
    else {
      el.classList.remove(`needcontext-hidden`)
    }
  }

  for (let text_el of document.querySelectorAll(`.needcontext-text`)) {
    let el = text_el.closest(`.needcontext-item`)
    let text = text_el.textContent.toLowerCase()
    text = NeedContext.remove_spaces(text)

    if (text.includes(cleaned)) {
      el.classList.remove(`needcontext-hidden`)

      if (!selected) {
        NeedContext.select_item(parseInt(el.dataset.index))
        selected = true
      }
    }
    else {
      el.classList.add(`needcontext-hidden`)
    }
  }

  let back = document.querySelector(`#needcontext-back`)
  let clear = document.querySelector(`#needcontext-clear`)
  NeedContext.filtered = cleaned !== ``

  if (NeedContext.filtered) {
    let text = document.querySelector(`#needcontext-clear-text`)
    text.textContent = value
    clear.classList.remove(`needcontext-hidden`)

    if (back) {
      back.classList.add(`needcontext-hidden`)
    }
  }
  else {
    clear.classList.add(`needcontext-hidden`)

    if (back) {
      back.classList.remove(`needcontext-hidden`)
    }
  }
}

// Show based on an element
NeedContext.show_on_element = (el, items, expand = false, margin = 0) => {
  let rect = el.getBoundingClientRect()
  NeedContext.show(rect.left, rect.top + margin, items)

  if (expand) {
    document.querySelector(`#needcontext-container`).style.minWidth = `${el.clientWidth}px`
  }
}

// Show on center of window
NeedContext.show_on_center = (items) => {
  NeedContext.show(undefined, undefined, items)
}

// Show the menu
NeedContext.show = (x, y, items, root = true) => {
  if (!NeedContext.created) {
    NeedContext.create()
  }

  if (root) {
    NeedContext.level = 0
  }

  let center

  if (x === undefined && y === undefined) {
    center = true
  }
  else {
    center = false
  }

  items = items.slice(0)
  let selected_index
  let layer = NeedContext.get_layer()

  if (layer) {
    selected_index = layer.last_index
  }
  else {
    selected_index = 0
  }

  for (let [i, item] of items.entries()) {
    if (i === selected_index) {
      item.selected = true
    }
    else {
      item.selected = false
    }
  }

  let c = NeedContext.container
  c.innerHTML = ``
  let index = 0

  if (!root) {
    c.append(NeedContext.back_button())
  }

  c.append(NeedContext.clear_button())
  let normal_items = []

  for (let item of items) {
    let el = document.createElement(`div`)
    el.classList.add(`needcontext-item`)

    if (item.separator) {
      el.classList.add(`needcontext-separator`)
    }
    else {
      el.classList.add(`needcontext-normal`)

      if (item.image) {
        let image = document.createElement(`img`)
        image.loading = `lazy`

        image.addEventListener(`error`, (e) => {
          e.target.classList.add(`needcontext-hidden`)
        })

        image.classList.add(`needcontext-image`)
        image.src = item.image
        el.append(image)
      }

      if (item.icon) {
        let icon = document.createElement(`div`)
        icon.append(item.icon)
        el.append(icon)
      }

      if (item.text) {
        let text = document.createElement(`div`)
        text.classList.add(`needcontext-text`)
        text.textContent = item.text
        el.append(text)
      }

      if (item.info) {
        el.title = item.info
      }

      el.dataset.index = index
      item.index = index

      if (item.title) {
        el.title = item.title
      }

      el.addEventListener(`mousemove`, () => {
        let index = parseInt(el.dataset.index)

        if (NeedContext.index !== index) {
          NeedContext.select_item(index)
        }
      })

      index += 1
      normal_items.push(item)
    }

    item.element = el
    c.append(el)
  }

  NeedContext.layers[NeedContext.level] = {
    root: root,
    items: items,
    normal_items: normal_items,
    last_index: selected_index,
    x: x,
    y: y,
  }

  NeedContext.main.classList.remove(`needcontext-hidden`)

  if (center) {
    c.style.left = `50%`
    c.style.top = NeedContext.center_top
    c.style.transform = `translate(-50%, -50%)`
  }
  else {
    if (y < 5) {
      y = 5
    }

    if (x < 5) {
      x = 5
    }

    if ((y + c.offsetHeight) + 5 > window.innerHeight) {
      y = window.innerHeight - c.offsetHeight - 5
    }

    if ((x + c.offsetWidth) + 5 > window.innerWidth) {
      x = window.innerWidth - c.offsetWidth - 5
    }

    NeedContext.last_x = x
    NeedContext.last_y = y

    x = Math.max(x, 0)
    y = Math.max(y, 0)

    c.style.left = `${x}px`
    c.style.top = `${y}px`
    c.style.transform = `unset`
  }

  NeedContext.filter.value = ``
  NeedContext.filter.focus()
  let container = document.querySelector(`#needcontext-container`)
  container.style.minWidth = NeedContext.min_width
  container.style.minHeight = NeedContext.min_height
  NeedContext.select_item(selected_index)
  NeedContext.open = true
  NeedContext.after_show()
}

// Hide the menu
NeedContext.hide = () => {
  if (NeedContext.open) {
    NeedContext.main.classList.add(`needcontext-hidden`)
    NeedContext.set_defaults()
    NeedContext.after_hide()
  }
}

// Select an item by index
NeedContext.select_item = (index) => {
  let els = Array.from(document.querySelectorAll(`.needcontext-normal`))

  for (let [i, el] of els.entries()) {
    if (i === index) {
      el.classList.add(`needcontext-item-selected`)
    }
    else {
      el.classList.remove(`needcontext-item-selected`)
    }
  }

  NeedContext.index = index
}

// Select an item above
NeedContext.select_up = () => {
  let waypoint = false
  let first_visible
  let items = NeedContext.get_layer().normal_items.slice(0).reverse()

  for (let item of items) {
    if (!NeedContext.is_visible(item.element)) {
      continue
    }

    if (first_visible === undefined) {
      first_visible = item.index
    }

    if (waypoint) {
      NeedContext.select_item(item.index)
      return
    }

    if (item.index === NeedContext.index) {
      waypoint = true
    }
  }

  NeedContext.select_item(first_visible)
}

// Select an item below
NeedContext.select_down = () => {
  let waypoint = false
  let first_visible
  let items = NeedContext.get_layer().normal_items

  for (let item of items) {
    if (!NeedContext.is_visible(item.element)) {
      continue
    }

    if (first_visible === undefined) {
      first_visible = item.index
    }

    if (waypoint) {
      NeedContext.select_item(item.index)
      return
    }

    if (item.index === NeedContext.index) {
      waypoint = true
    }
  }

  NeedContext.select_item(first_visible)
}

// Do the selected action
NeedContext.select_action = async (e, index = NeedContext.index, mode = `mouse`) => {
  if (mode === `mouse`) {
    if (!e.target.closest(`.needcontext-normal`)) {
      return
    }
  }

  let x = NeedContext.last_x
  let y = NeedContext.last_y
  let item = NeedContext.get_layer().normal_items[index]

  function show_below (items) {
    NeedContext.get_layer().last_index = index
    NeedContext.level += 1

    if (e.clientY) {
      y = e.clientY
    }

    NeedContext.show(x, y, items, false)
  }

  function do_items (items) {
    if (items.length === 1 && item.direct) {
      NeedContext.hide()
      items[0].action(e)
    }
    else {
      show_below(items)
    }

    return
  }

  async function check_item () {
    if (item.action) {
      NeedContext.hide()
      item.action(e)
      return
    }
    else if (item.items) {
      do_items(item.items)
    }
    else if (item.get_items) {
      let items = await item.get_items()
      do_items(items)
    }
  }

  if (mode === `keyboard`) {
    check_item()
    return
  }

  if (e.button === 0) {
    check_item()
  }
  else if (e.button === 1) {
    if (item.alt_action) {
      NeedContext.hide()
      item.alt_action(e)
    }
  }
}

// Check if item is hidden
NeedContext.is_visible = (el) => {
  return !el.classList.contains(`needcontext-hidden`)
}

// Remove all spaces from text
NeedContext.remove_spaces = (text) => {
  return text.replace(/[\s-]+/g, ``)
}

// Prepare css and events
NeedContext.init = () => {
  let style = document.createElement(`style`)

  let css = `
    #needcontext-main {
      position: fixed;
      z-index: 999999999;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .needcontext-hidden {
      display: none !important;
    }

    #needcontext-container {
      z-index: 2;
      position: absolute;
      background-color: white;
      color: black;
      font-size: 16px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      user-select: none;
      border: 1px solid #2B2F39;
      border-radius: 5px;
      padding-top: 6px;
      padding-bottom: 6px;
      max-height: 80vh;
      overflow: auto;
      text-align: left;
      max-width: 98%;
    }

    #needcontext-filter {
      opacity: 0;
    }

    .needcontext-item {
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${NeedContext.gap};
    }

    .needcontext-normal {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: ${NeedContext.item_sep};
      padding-bottom: ${NeedContext.item_sep};
      cursor: pointer;
    }

    .needcontext-button {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: ${NeedContext.item_sep};
      padding-bottom: ${NeedContext.item_sep};
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${NeedContext.gap};
      cursor: pointer;
    }

    .needcontext-button:hover {
      text-shadow: 0 0 1rem currentColor;
    }

    .needcontext-separator {
      border-top: 1px solid currentColor;
      margin-left: 10px;
      margin-right: 10px;
      margin-top: ${NeedContext.item_sep};
      margin-bottom: ${NeedContext.item_sep};
      opacity: 0.7;
    }

    .needcontext-item-selected {
      background-color: rgba(0, 0, 0, 0.18);
    }

    .needcontext-image {
      width: 1.25rem;
      height: 1.25rem;
      object-fit: contain;
    }
  `

  style.innerText = css
  document.head.appendChild(style)

  document.addEventListener(`mousedown`, (e) => {
    if (!NeedContext.open || !e.target) {
      return
    }

    NeedContext.first_mousedown = true

    if (e.target.closest(`#needcontext-container`)) {
      NeedContext.mousedown = true
    }
  })

  document.addEventListener(`mouseup`, (e) => {
    if (!NeedContext.open || !e.target) {
      return
    }

    if (!e.target.closest(`#needcontext-container`)) {
      if (NeedContext.first_mousedown) {
        NeedContext.hide()
      }
    }
    else if (e.target.closest(`.needcontext-back`)) {
      if (e.button === 0) {
        NeedContext.go_back()
      }
    }
    else if (e.target.closest(`.needcontext-clear`)) {
      if (e.button === 0) {
        NeedContext.clear_filter()
      }
    }
    else if (NeedContext.mousedown) {
      NeedContext.select_action(e)
    }

    NeedContext.mousedown = false
  })

  document.addEventListener(`keydown`, (e) => {
    if (!NeedContext.open) {
      return
    }

    if (NeedContext.modkey(e)) {
      return
    }

    NeedContext.keydown = true

    if (e.key === `ArrowUp`) {
      NeedContext.select_up()
      e.preventDefault()
    }
    else if (e.key === `ArrowDown`) {
      NeedContext.select_down()
      e.preventDefault()
    }
    else if (e.key === `Backspace`) {
      if (!NeedContext.filtered) {
        NeedContext.go_back()
        e.preventDefault()
      }
    }
  })

  document.addEventListener(`keyup`, (e) => {
    if (!NeedContext.open) {
      return
    }

    if (!NeedContext.keydown) {
      return
    }

    if (NeedContext.modkey(e)) {
      return
    }

    NeedContext.keydown = false

    if (e.key === `Escape`) {
      NeedContext.hide()
      e.preventDefault()
    }
    else if (e.key === `Enter`) {
      NeedContext.select_action(e, undefined, `keyboard`)
      e.preventDefault()
    }
  })

  NeedContext.set_defaults()
}

// Create elements
NeedContext.create = () => {
  NeedContext.main = document.createElement(`div`)
  NeedContext.main.id = `needcontext-main`
  NeedContext.main.classList.add(`needcontext-hidden`)
  NeedContext.container = document.createElement(`div`)
  NeedContext.container.id = `needcontext-container`
  NeedContext.filter = document.createElement(`input`)
  NeedContext.filter.id = `needcontext-filter`
  NeedContext.filter.type = `text`
  NeedContext.filter.autocomplete = `off`
  NeedContext.filter.spellcheck = false
  NeedContext.filter.placeholder = `Filter`

  NeedContext.filter.addEventListener(`input`, (e) => {
    NeedContext.do_filter()
  })

  NeedContext.main.addEventListener(`contextmenu`, (e) => {
    e.preventDefault()
  })

  NeedContext.main.append(NeedContext.filter)
  NeedContext.main.append(NeedContext.container)
  document.body.appendChild(NeedContext.main)
  NeedContext.created = true
}

// Current layer
NeedContext.get_layer = () => {
  return NeedContext.layers[NeedContext.level]
}

// Previous layer
NeedContext.prev_layer = () => {
  return NeedContext.layers[NeedContext.level - 1]
}

// Go back to previous layer
NeedContext.go_back = () => {
  if (NeedContext.level === 0) {
    return
  }

  let layer = NeedContext.prev_layer()
  NeedContext.level -= 1
  NeedContext.show(layer.x, layer.y, layer.items, layer.root)
}

// Create back button
NeedContext.back_button = () => {
  let el = document.createElement(`div`)
  el.id = `needcontext-back`
  el.classList.add(`needcontext-back`)
  el.classList.add(`needcontext-button`)
  let icon = document.createElement(`div`)
  icon.append(NeedContext.back_icon)
  let text = document.createElement(`div`)
  text.textContent = NeedContext.back_text
  el.append(icon)
  el.append(text)
  el.title = `Shortcut: Backspace`
  return el
}

// Create clear button
NeedContext.clear_button = () => {
  let el = document.createElement(`div`)
  el.id = `needcontext-clear`
  el.classList.add(`needcontext-clear`)
  el.classList.add(`needcontext-button`)
  el.classList.add(`needcontext-hidden`)
  let icon = document.createElement(`div`)
  icon.append(NeedContext.back_icon)
  let text = document.createElement(`div`)
  text.id = `needcontext-clear-text`
  text.textContent = NeedContext.clear_text
  el.append(icon)
  el.append(text)
  el.title = `Type to filter. Click to clear`
  return el
}

// Return true if a mod key is pressed
NeedContext.modkey = (e) => {
  return e.ctrlKey || e.altKey || e.shiftKey || e.metaKey
}

// Start
NeedContext.init()