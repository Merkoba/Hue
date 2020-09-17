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
  // Debounce timer for normal window filters
  Hue.do_modal_filter_timer = Hue.create_debouncer(function () {
    Hue.do_modal_filter()
  }, Hue.filter_delay)

  // Debounce timer for saving a localStorage object
  // This was done to avoid saving loops
  Hue.save_local_storage_timer = Hue.create_debouncer(function () {
    Hue.do_save_local_storage()
  }, Hue.local_storage_save_delay)

  // Debounce timer for scroll events
  Hue.scroll_timer = Hue.create_debouncer(function () {
    Hue.check_scrollers()
  }, Hue.check_scrollers_delay)

  // Debounce window resize timer
  Hue.resize_timer = Hue.create_debouncer(function () {
    Hue.on_resize()
  }, Hue.resize_delay)

  // Debounce timer for chat search filter
  Hue.chat_search_timer = Hue.create_debouncer(function () {
    Hue.show_chat_search($("#chat_search_filter").val())
  }, Hue.filter_delay)

  // Debounce timer for input history filter
  Hue.input_history_filter_timer = Hue.create_debouncer(function () {
    Hue.show_input_history($("#input_history_filter").val())
  }, Hue.filter_delay)

  // Debounce typing timer to send a typing emit
  Hue.typing_timer = Hue.create_debouncer(function () {
    Hue.socket_emit("typing", {})
  }, Hue.typing_delay)

  // Debounce timer to hide the typing actions
  Hue.typing_remove_timer = Hue.create_debouncer(function () {
    Hue.hide_typing()
  }, Hue.config.max_typing_inactivity)

  // Debounce timer for highlights filter
  Hue.highlights_filter_timer = Hue.create_debouncer(function () {
    Hue.show_highlights($("#highlights_filter").val())
  }, Hue.filter_delay)

  // Debounce timer for media history filters
  Hue.media_history_filter_timer = Hue.create_debouncer(function (type) {
    let filter = $(`#${type}_history_filter`).val()
    Hue.show_media_history(type, filter)
  }, Hue.filter_delay)

  // Debounce timer for image modal scrollwheel in the 'previous' direction
  Hue.modal_image_prev_wheel_timer = Hue.create_debouncer(function () {
    Hue.modal_image_prev_click()
  }, Hue.wheel_delay)

  // Debounce timer for image modal scrollwheel in the 'next direction
  Hue.modal_image_next_wheel_timer = Hue.create_debouncer(function () {
    Hue.modal_image_next_click()
  }, Hue.wheel_delay)

  // Debounce timer for maxers, like chat and media maxers
  Hue.maxer_wheel_timer = Hue.create_debouncer(function (func) {
    func()
  }, Hue.wheel_delay_2)

  // Debounce timer for settings filter
  Hue.settings_filter_timer = Hue.create_debouncer(function () {
    Hue.do_settings_filter($("#settings_filter").val())
  }, Hue.filter_delay)

  // Debounce timer to hide the infotip
  Hue.infotip_timer = Hue.create_debouncer(function () {
    Hue.hide_infotip()
  }, Hue.hide_infotip_delay)

  // Debounce timer to hide media image reactions
  Hue.media_image_reactions_timer = Hue.create_debouncer(function () {
    $("#media_image_reactions").html("")
    $("#media_image_reactions").css("display", "none")
  }, Hue.hide_media_reactions_delay)
  
  // Debounce timer to hide media tv reactions
  Hue.media_tv_reactions_timer = Hue.create_debouncer(function () {
    $("#media_tv_reactions").html("")
    $("#media_tv_reactions").css("display", "none")
  }, Hue.hide_media_reactions_delay)
}
