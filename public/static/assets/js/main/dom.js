// Select a single element
App.el = (query, root = document) => {
  return root.querySelector(query)
}

// Select an array of elements
App.els = (query, root = document) => {
  return Array.from(root.querySelectorAll(query))
}

// Select a single element or self
App.el_or_self = (query, root = document) => {
  let el = root.querySelector(query)

  if (!el) {
    if (root.classList.contains(query.replace(`.`, ``))) {
      el = root
    }
  }

  return el
}

// Select an array of elements or self
App.els_or_self = (query, root = document) => {
  let els = Array.from(root.querySelectorAll(query))

  if (els.length === 0) {
    if (root.classList.contains(query.replace(`.`, ``))) {
      els = [root]
    }
  }

  return els
}

// Clone element
App.clone = (el) => {
  return el.cloneNode(true)
}

// Clone element children
App.clone_children = (query) => {
  let items = []
  let children = Array.from(App.el(query).children)

  for (let c of children) {
    items.push(App.clone(c))
  }

  return items
}

// Data set manager
App.dataset = (el, value, setvalue) => {
  if (!el) {
    return
  }

  let id = el.dataset.dataset_id

  if (!id) {
    id = App.dataset_id
    App.dataset_id += 1
    el.dataset.dataset_id = id
    App.dataset_obj[id] = {}
  }

  if (setvalue !== undefined) {
    App.dataset_obj[id][value] = setvalue
  }
  else {
    return App.dataset_obj[id][value]
  }
}

// Create an html element
App.create = (type, classes = ``, id = ``) => {
  let el = document.createElement(type)

  if (classes) {
    let classlist = classes.split(` `).filter(x => x != ``)

    for (let cls of classlist) {
      el.classList.add(cls)
    }
  }

  if (id) {
    el.id = id
  }

  return el
}

// Add an event listener
App.ev = (element, action, callback, extra) => {
  element.addEventListener(action, callback, extra)
}