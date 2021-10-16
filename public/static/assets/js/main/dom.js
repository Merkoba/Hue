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
  let clone = el.cloneNode(true)
  clone.hue_dataset = el.hue_dataset
  return clone
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