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
    App.save_local_storage_timer()
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

// Setups localStorage events
App.setup_local_storage = () => {
  DOM.ev(window, `storage`, (e) => {
    if (e.key !== App.ls_settings) {
      return
    }

    let obj

    try {
      obj = JSON.parse(e.newValue)
    }
    catch (err) {
      return
    }

    if (App.utilz.is_empty_object(obj)) {
      return
    }

    if (e.key === App.ls_settings) {
      App.reset_settings(false)
    }
  }, false)
}