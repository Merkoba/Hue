// Select a single element
Hue.el = function (query) {
  return document.querySelector(query)
}

// Select an array of elements
Hue.els = function (query) {
  return Array.from(document.querySelectorAll(query))
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