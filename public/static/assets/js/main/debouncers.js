// Centralized function to create debouncers
Hue.create_debouncer = function (func, delay) {
  return (function () {
    let timer

    return function (...args) {
      clearTimeout(timer)

      timer = setTimeout(function () {
        func(...args)
      }, delay)
    }
  })()
}

// Creates all debouncers
// These are functions that get executed after not being called after a set delay
Hue.create_debouncers = function () {
  // Debounce timer for saving a localStorage object
  // This was done to avoid saving loops
  Hue.save_local_storage_timer = Hue.create_debouncer(function () {
    Hue.do_save_local_storage()
  }, Hue.local_storage_save_delay)

  // Debounce window resize timer
  Hue.resize_timer = Hue.create_debouncer(function () {
    Hue.on_resize()
  }, Hue.resize_delay)

  // Starts chat area scroll events
  Hue.scroll_timer = Hue.create_debouncer(function () {
    Hue.check_scrollers()
  }, Hue.scroll_delay)

  // Debounce timer for image modal scrollwheel in the 'previous' direction
  Hue.modal_image_prev_wheel_timer = Hue.create_debouncer(function () {
    Hue.modal_image_prev_click()
  }, Hue.wheel_delay)

  // Debounce timer for image modal scrollwheel in the 'next direction
  Hue.modal_image_next_wheel_timer = Hue.create_debouncer(function () {
    Hue.modal_image_next_click()
  }, Hue.wheel_delay)

  // Debounce timer for userlist update
  Hue.update_userlist = Hue.create_debouncer(function (prop) {
    Hue.do_update_userlist(prop)
  }, Hue.update_userlist_delay)  

  // Debounce timer to hide the flash info window
  Hue.flash_info_timer = Hue.create_debouncer(function (direction) {
    Hue.hide_flash_info()
  }, Hue.flash_info_delay)

  // Debounce timer to process files added
  Hue.process_file_added = Hue.create_debouncer(function (file) {
    Hue.do_process_file_added(file)
  }, Hue.file_added_delay)

  // Modal filter debouncer
  Hue.modal_filter = Hue.create_debouncer(function (file) {
    Hue.do_modal_filter()
  }, Hue.filter_delay)
}