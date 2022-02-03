// Setups more footer elements
Hue.setup_footer = function () {
  let media = ["image", "tv"]

  for (let type of media) {
    Hue.el(`#footer_${type}_label`).addEventListener("click", function () {
      Hue.show_media_picker(type)
    })

    Hue.el(`#footer_${type}_toggler`).addEventListener("click", function () {
      Hue.toggle_media({type:type, feedback:true})
    })

    Hue.el(`#footer_${type}_lock`).addEventListener("click", function () {
      Hue.change_media_lock({type:type, feedback:true})
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

  Hue.el("#footer_game").addEventListener("click", function () {
    Hue.show_game_picker()
  })  

  Hue.el("#footer_items").addEventListener("click", function(e) {
    if (e.target === this) {
      Hue.el("#input").focus()
    }
  })
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