// Select a single element
Hue.el = function (query, root = document) {
  return root.querySelector(query)
}

// Select an array of elements
Hue.els = function (query, root = document) {
  return Array.from(root.querySelectorAll(query))
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

// Create an empty div
Hue.div = function (classes = "", id = "") {
  let new_div = document.createElement("div")

  if (classes) {
    let classlist = classes.split(" ").filter(x => x != "")
  
    for (let cls of classlist) {
      new_div.classList.add(cls)
    }
  }

  if (id) {
    new_div.id = id
  }

  return new_div
}