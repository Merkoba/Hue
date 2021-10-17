// Resets chat search filter state
Hue.reset_chat_search_filter = function () {
  Hue.el("#chat_search_filter").value = ""
  Hue.el("#chat_search_container").innerHTML = ""
}

// Shows the chat search window
Hue.show_chat_search = function (filter = "") {
  Hue.el("#chat_search_container").innerHTML = ""
  Hue.el("#chat_search_filter").value = filter ? filter : ""

  if (filter.trim()) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase()
    let clone = Hue.clone_children("#chat_area").reverse()

    clone.forEach(function (it) {
      it.removeAttribute("id")
    })

    clone = clone.filter(it => {
      let text = it.textContent.toLowerCase()

      if (!text) {
        return false
      }

      let text_cmp = text.includes(lc_value)
      
      let source_cmp = false
      let media_source = Hue.dataset(it, "media_source")
      
      if (media_source) {
        source_cmp = media_source.includes(lc_value)
      }

      return text_cmp || source_cmp
    })

    if (clone.length) {
      for (let el of clone) {
        Hue.el("#chat_search_container").append(el)
      }
    } 
  } else {
    Hue.el("#chat_search_container").innerHTML = "<div class='center'>Search recent messages</div>"
  }

  Hue.msg_chat_search.show(function () {
    Hue.scroll_modal_to_top("chat_search")
  })
}