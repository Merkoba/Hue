// Creates all debouncers
// These are functions that get executed after not being called after a set delay
App.create_debouncers = () => {
  App.save_local_storage_debouncer = App.utilz.create_debouncer(() => {
    App.do_save_local_storage()
  }, App.local_storage_save_delay)

  App.resize_debouncer = App.utilz.create_debouncer(() => {
    App.on_resize()
  }, App.resize_delay)

  App.scroll_debouncer = App.utilz.create_debouncer(() => {
    App.check_scrollers()
  }, App.scroll_delay)

  App.modal_image_prev_wheel_debouncer = App.utilz.create_debouncer(() => {
    App.modal_image_prev_click()
  }, App.wheel_delay)

  App.modal_image_next_wheel_debouncer = App.utilz.create_debouncer(() => {
    App.modal_image_next_click()
  }, App.wheel_delay)

  App.update_userlist_debouncer = App.utilz.create_debouncer((prop) => {
    App.do_update_userlist(prop)
  }, App.update_userlist_delay)

  App.update_userlist = (prop) => {
    App.update_userlist_debouncer.call(prop)
  }

  App.flash_info_debouncer = App.utilz.create_debouncer(() => {
    App.hide_flash_info()
  }, App.flash_info_delay)

  App.process_file_added_debouncer = App.utilz.create_debouncer((file) => {
    App.do_process_file_added(file)
  }, App.file_added_delay)

  App.modal_filter_debouncer = App.utilz.create_debouncer(() => {
    App.do_modal_filter()
  }, App.filter_delay)
}