// Creates a Separator instance
// This is used to apply horizontal separations between items
// It takes into account un-displayed items to separate properly
Hue.setup_separators = function () {
  Hue.horizontal_separator = Separator.factory({
    mode: "horizontal",
    class: "separator horizontal_separator",
  })

  Hue.horizontal_separator_no_margin = Separator.factory({
    mode: "horizontal",
    class: "separator horizontal_separator",
    margin_left: 0,
    margin_right: 0
  })

  Hue.vertical_separator = Separator.factory({
    mode: "vertical",
    class: "separator vertical_separator",
    html: "",
    width: "100%",
    margin_top: "1.6rem",
    margin_bottom: "1.6rem",
  })
}

// Applies separation to generic horizontal separator classes
Hue.setup_generic_separators = function () {
  $(".generic_horizontal_separator").each(function () {
    Hue.horizontal_separator.separate(this)
  })

  $(".generic_vertical_separator").each(function () {
    Hue.vertical_separator.separate(this)
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
      c_text_classes += " pointer action"
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
  $("#confirm_button_confirm").click(function () {
    Hue.on_confirm()
  })

  $("#confirm_button_cancel").click(function () {
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

Hue.showmsg = function (s) {
  Hue.msg_info.show(s)
}