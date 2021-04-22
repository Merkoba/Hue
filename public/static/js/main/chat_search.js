// Resets chat search filter state
Hue.reset_chat_search_filter = function () {
  $("#chat_search_filter").val("")
  $("#chat_search_container").html("")
}

// Shows the chat search window
Hue.show_chat_search = function (filter = false) {
  $("#chat_search_container").html("")
  $("#chat_search_filter").val(filter ? filter : "")

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    let clone = $($("#chat_area").children().get().reverse()).clone(true, true)

    clone.each(function () {
      $(this).removeAttr("id")
    })

    clone = clone.filter(function () {
      let text = $(this).text().toLowerCase()
      let text_cmp = text.includes(lc_value)
      
      let source_cmp = false
      let media_source = $(this).data("media_source")
      
      if (media_source) {
        source_cmp = media_source.includes(lc_value)
      }

      return text_cmp || source_cmp
    })

    if (clone.children().length) {
      clone.appendTo("#chat_search_container")
    } 
  } else {
    $("#chat_search_container").html("<div class='center'>Search recent messages</div>")
  }

  Hue.msg_chat_search.show(function () {
    Hue.scroll_modal_to_top("chat_search")
  })
}