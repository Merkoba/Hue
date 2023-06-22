// Centralized function to get localStorage objects
App.get_local_storage = (ls_name) => {
  let obj

  if (localStorage[ls_name]) {
    try {
      obj = JSON.parse(localStorage.getItem(ls_name))
    }
    catch (err) {
      localStorage.removeItem(ls_name)
      obj = null
    }
  }
  else {
    obj = null
  }

  return obj
}

// Centralized function to save localStorage objects
App.save_local_storage = (ls_name, obj, force = false) => {
  App.local_storage_to_save[ls_name] = obj

  if (force) {
    App.do_save_local_storage()
  }
  else {
    App.save_local_storage_debouncer.call()
  }
}

// Do the actual localStorage save
App.do_save_local_storage = () => {
  for (let ls_name in App.local_storage_to_save) {
    let obj = App.local_storage_to_save[ls_name]

    obj = JSON.stringify(obj)

    localStorage.setItem(ls_name, obj)
  }

  App.local_storage_to_save = {}
}