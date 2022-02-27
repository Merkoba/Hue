// Setups more footer elements
Hue.setup_footer = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    Hue.el(`#footer_${type}_label`).addEventListener("click", function () {
      Hue.show_media_picker(type)
    })

    Hue.el(`#footer_${type}_toggler`).addEventListener("click", function () {
      Hue.toggle_media({type:type})
    })

    Hue.el(`#footer_${type}_lock`).addEventListener("click", function () {
      Hue.change_media_lock({type:type})
    })
  }

  Hue.el("#footer_search").addEventListener("click", function () {
    Hue.show_chat_search()
  })
  
  Hue.el("#footer_links").addEventListener("click", function () {
    Hue.show_links()
  })

  Hue.el("#footer_highlights").addEventListener("click", function () {
    Hue.show_highlights()
  })

  if (Hue.config.radios.length > 0) {
    Hue.el("#footer_radio_icon_container").addEventListener("click", function () {
      Hue.toggle_radio_items()
    }) 
  } else {
    Hue.el("#footer_radio_icon_container").remove()
  }

  Hue.el("#footer_items").addEventListener("click", function(e) {
    if (e.target === this) {
      Hue.el("#input").focus()
    }
  })

  Hue.horizontal_separator(Hue.el("#footer_actions"))
  Hue.horizontal_separator(Hue.el("#footer_media_items"))
}

// Enabled footer expand
Hue.enable_footer_expand = function () {
  if (Hue.footer_expanded) {
    return
  }

  Hue.el("#footer").classList.add("footer_expanded")
  Hue.after_footer_expand_change()
}

// Disable footer expand
Hue.disable_footer_expand = function () {
  if (!Hue.footer_expanded) {
    return
  }

  Hue.el("#footer").classList.remove("footer_expanded")
  Hue.after_footer_expand_change()
}

// After footer expand change
Hue.after_footer_expand_change = function () {
  Hue.footer_expanded = !Hue.footer_expanded
  Hue.goto_bottom()
  Hue.fix_frames()

  if (!Hue.get_input().trim()) {
    Hue.clear_input()
  }
}