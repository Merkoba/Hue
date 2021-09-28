// Applies separation to generic horizontal separator classes
Hue.setup_generic_separators = function () {
  $(".generic_horizontal_separator").each(function () {
    Hue.horizontal_separator(this)
  })/

  $(".generic_vertical_separator").each(function () {
    Hue.vertical_separator(this)
  })
}

// Remove & add vertical or horizontal separators
Hue.apply_separator = function (el, cls, start, end) {
  $(el).find("> .separator").each(function () {
    $(this).remove()
  })

  let elems = $(el).find(">").filter(function(){
    if($(this).css("display") !== "none")
      return $(this)
  })

  if (!start && !end) {
    elems.not(":last").after(`<div class='separator ${cls}'></div>`)
  } else if (start && !end) {
    elems.before(`<div class='separator ${cls}'></div>`)
  } else if (!start && end) {
    elems.after(`<div class='separator ${cls}'></div>`)
  } else if (start && end) {
    elems.after(`<div class='separator ${cls}'></div>`)
    elems.eq(0).before(`<div class='separator ${cls}'></div>`)
  }
}

// Add horizontal separators
Hue.horizontal_separator = function (el, start = false, end = false) {
  Hue.apply_separator(el, "horizontal_separator", start, end)
}

// Add vertical separators
Hue.vertical_separator = function (el, start = false, end = false) {
  Hue.apply_separator(el, "vertical_separator", start, end)
}

// Applies separation to generic horizontal separator classes
Hue.setup_generic_separators = function () {
  $(".generic_horizontal_separator").each(function () {
    Hue.horizontal_separator(this)
  })

  $(".generic_vertical_separator").each(function () {
    Hue.vertical_separator(this)
  })
}

// This hides the loading animation and makes the main container visible
Hue.make_main_container_visible = function () {
  $("#loading").css("opacity", 0)
  $("#main_container").css("opacity", 1).css("pointer-events", "initial")

  setTimeout(function () {
    $("#loading").css("display", "none")
  }, 1600)
}

// Setup font loading events
Hue.setup_fonts = function () {
  document.fonts.ready.then(function () {
    Hue.on_fonts_loaded()
  })
}

// After the font finished loading
Hue.on_fonts_loaded = function () {
  Hue.goto_bottom(true)
}

// Utility function to create safe html elements with certain options
Hue.make_safe = function (args = {}) {
  let def_args = {
    text: "",
    text_as_html: false,
    text_classes: false,
    html: false,
    urlize: true,
    onclick: false,
    title: false,
    remove_text_if_empty: false,
    date: false,
    no_spacing: false
  }

  args = Object.assign(def_args, args)

  let c = $("<div></div>")

  if (args.text || !args.remove_text_if_empty) {
    let c_text_classes = "message_info_text inline"

    if (args.onclick) {
      c_text_classes += " action"
    }

    if (args.text_classes) {
      c_text_classes += ` ${args.text_classes}`
    }

    c.append(`<div class='${c_text_classes}'></div>`)

    let c_text = c.find(".message_info_text").eq(0)

    if (args.text_as_html) {
      let h = Hue.utilz.make_html_safe(args.text)
      h = Hue.parse_text(h)

      if (args.urlize) {
        c_text.html(h).urlize()
      } else {
        c_text.html(h)
      }
    } else {
      if (args.urlize) {
        c_text.text(args.text).urlize()
      } else {
        c_text.text(args.text)
      }
    }

    if (args.onclick) {
      c_text.on("click", args.onclick)
    }

    if (args.date) {
      let nd = Hue.utilz.nice_date(args.date)

      c_text.data("date", args.date)
      c_text.data("otitle", nd)
      c_text.attr("title", nd)
      c_text.addClass("dynamic_title")
    } else {
      if (args.title) {
        c_text.attr("title", args.title)
      }
    }
  }

  if (args.html) {
    let sp

    if (!args.no_spacing && (args.text || !args.remove_text_if_empty)) {
      sp = "message_info_html_spaced"
    } else {
      sp = ""
    }

    c.append(`<div class='message_info_html ${sp}'>${args.html}</div>`)
  }

  return c[0]
}

// Setups the confirm window
Hue.setup_confirm = function () {
  $("#confirm_button_confirm").on("click", function () {
    Hue.on_confirm()
  })

  $("#confirm_button_cancel").on("click", function () {
    Hue.msg_confirm.close()
  })
}

// Shows the confirm window
Hue.show_confirm = function (title, message, action) {
  if (message) {
    $("#confirm_message").text(message)
    $("#confirm_message").css("display", "block")
  } else {
    $("#confirm_message").text("")
    $("#confirm_message").css("display", "none")
  }

  Hue.confirm_action = action
  Hue.msg_confirm.set_title(title)
  Hue.msg_confirm.show()
}

// On confirm action
Hue.on_confirm = function () {
  Hue.msg_confirm.close()
  Hue.confirm_action()
}

// Simple window for messages
Hue.showmsg = function (s) {
  Hue.msg_info.show(s)
}

// Simple window for messages
Hue.checkmsg = function (s) {
  if (Hue.modal_open) {
    Hue.showmsg(s)
  } else {
    Hue.feedback(s)
  }
}

// Shows feedback with the current date in the nice date format
Hue.show_current_date = function () {
  Hue.checkmsg(Hue.utilz.nice_date())
}

// Start timeago checks
Hue.start_timeago = function () {
  setInterval(() => {
    $(".chat_area").each(function () {
      $(this).find(".chat_timeago").each(function () {
        let message = $(this).closest(".message")
        $(this).text(Hue.utilz.timeago(message.data("date")))
      })
    })

    $("#media .media_info_container").each(function () {
      $(this).find(".media_info_timeago").eq(0)
        .text(Hue.utilz.timeago($(this).data("date")))
    })

    if (Hue.msg_modal_image.is_open()) {
      $("#modal_image_header_info").find(".modal_image_timeago")
        .eq(0).text(Hue.utilz.timeago(Hue.loaded_modal_image.date))
    }
  }, Hue.timeago_delay)
}