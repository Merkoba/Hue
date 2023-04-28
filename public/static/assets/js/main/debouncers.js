// Centralized function to create debouncers
App.create_debouncer = (func, delay) => {
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
App.create_debouncers = () => {
  // Debounce timer for saving a localStorage object
  // This was done to avoid saving loops
  App.save_local_storage_timer = App.create_debouncer(() => {
    App.do_save_local_storage()
  }, App.local_storage_save_delay)

  // Debounce window resize timer
  App.resize_timer = App.create_debouncer(() => {
    App.on_resize()
  }, App.resize_delay)

  // Starts chat area scroll events
  App.scroll_timer = App.create_debouncer(() => {
    App.check_scrollers()
  }, App.scroll_delay)

  // Debounce timer for image modal scrollwheel in the 'previous' direction
  App.modal_image_prev_wheel_timer = App.create_debouncer(() => {
    App.modal_image_prev_click()
  }, App.wheel_delay)

  // Debounce timer for image modal scrollwheel in the 'next direction
  App.modal_image_next_wheel_timer = App.create_debouncer(() => {
    App.modal_image_next_click()
  }, App.wheel_delay)

  // Debounce timer for userlist update
  App.update_userlist = App.create_debouncer((prop) => {
    App.do_update_userlist(prop)
  }, App.update_userlist_delay)

  // Debounce timer to hide the flash info window
  App.flash_info_timer = App.create_debouncer(() => {
    App.hide_flash_info()
  }, App.flash_info_delay)

  // Debounce timer to process files added
  App.process_file_added = App.create_debouncer((file) => {
    App.do_process_file_added(file)
  }, App.file_added_delay)

  // Modal filter debouncer
  App.modal_filter = App.create_debouncer(() => {
    App.do_modal_filter()
  }, App.filter_delay)
}