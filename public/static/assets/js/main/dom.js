// Select a single element
Hue.el = function (query, root = document) {
  return root.querySelector(query)
}

// Select an array of elements
Hue.els = function (query, root = document) {
  return Array.from(root.querySelectorAll(query))
}

// Select a single element or self
Hue.el_or_self = function (query, root = document) {
  let el = root.querySelector(query)

  if (!el) {
    if (root.classList.contains(query.replace(".", ""))) {
      el = root
    }
  }

  return el
}

// Select an array of elements or self
Hue.els_or_self = function (query, root = document) {
  let els = Array.from(root.querySelectorAll(query))

  if (els.length === 0) {
    if (root.classList.contains(query.replace(".", ""))) {
      els = [root]
    }
  }

  return els
}

// Clone element
Hue.clone = function (el) {
  return el.cloneNode(true)
}

// Clone element children
Hue.clone_children = function (query) {
  let items = []
  let children = Array.from(Hue.el(query).children)

  for (let c of children) {
    items.push(Hue.clone(c))
  }

  return items
}

// Data set manager
Hue.dataset = function (el, value, setvalue) {
  if (!el) {
    return
  }

  let id = el.dataset.dataset_id

  if (!id) {
    id = Hue.dataset_id
    Hue.dataset_id += 1
    el.dataset.dataset_id = id
    Hue.dataset_obj[id] = {}
  }

  if (setvalue !== undefined) {
    Hue.dataset_obj[id][value] = setvalue
  } else {
    return Hue.dataset_obj[id][value]
  }
}

// Create an html element
Hue.create = function (type, classes = "", id = "") {
  let el = document.createElement(type)

  if (classes) {
    let classlist = classes.split(" ").filter(x => x != "")

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
Hue.ev = function (element, action, callback, extra) {
  element.addEventListener(action, callback, extra)
}