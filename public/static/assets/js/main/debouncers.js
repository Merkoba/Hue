// Centralized function to create debouncers
Hue.create_debouncer = (func, delay) => {
  return (() => {
    let timer

    return (...args) => {
      clearTimeout(timer)

      timer = setTimeout(() => {
        func(...args)
      }, delay)
    }
  })()
}

// Creates all debouncers
// These are functions that get executed after not being called after a set delay
Hue.create_debouncers = () => {
  // Debounce timer for saving a localStorage object
  // This was done to avoid saving loops
  Hue.save_local_storage_timer = Hue.create_debouncer(() => {
    Hue.do_save_local_storage()
  }, Hue.local_storage_save_delay)

  // Debounce window resize timer
  Hue.resize_timer = Hue.create_debouncer(() => {
    Hue.on_resize()
  }, Hue.resize_delay)

  // Starts chat area scroll events
  Hue.scroll_timer = Hue.create_debouncer(() => {
    Hue.check_scrollers()
  }, Hue.scroll_delay)

  // Debounce timer for image modal scrollwheel in the 'previous' direction
  Hue.modal_image_prev_wheel_timer = Hue.create_debouncer(() => {
    Hue.modal_image_prev_click()
  }, Hue.wheel_delay)

  // Debounce timer for image modal scrollwheel in the 'next direction
  Hue.modal_image_next_wheel_timer = Hue.create_debouncer(() => {
    Hue.modal_image_next_click()
  }, Hue.wheel_delay)

  // Debounce timer for userlist update
  Hue.update_userlist = Hue.create_debouncer((prop) => {
    Hue.do_update_userlist(prop)
  }, Hue.update_userlist_delay)

  // Debounce timer to hide the flash info window
  Hue.flash_info_timer = Hue.create_debouncer(() => {
    Hue.hide_flash_info()
  }, Hue.flash_info_delay)

  // Debounce timer to process files added
  Hue.process_file_added = Hue.create_debouncer((file) => {
    Hue.do_process_file_added(file)
  }, Hue.file_added_delay)

  // Modal filter debouncer
  Hue.modal_filter = Hue.create_debouncer(() => {
    Hue.do_modal_filter()
  }, Hue.filter_delay)
}