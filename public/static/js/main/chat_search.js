// Resets chat search filter state
Hue.reset_chat_search_filter = function () {
  $("#chat_search_filter").val("");
  $("#chat_search_container").html("");
  $("#chat_search_no_results").css("display", "none");
};

// Shows the chat search window
Hue.show_chat_search = function (filter = false) {
  if (filter) {
    filter = filter.trim();
  }

  let sfilter = filter ? filter : "";

  $("#chat_search_container").html("");
  $("#chat_search_no_results").css("display", "none");
  $("#chat_search_filter").val(sfilter);

  if (filter) {
    let lc_value = Hue.utilz.clean_string2(filter).toLowerCase();
    let words = lc_value.split(" ").filter((x) => x.trim() !== "");
    let clone = $($("#chat_area").children().get().reverse()).clone(true, true);

    clone.each(function () {
      $(this).removeAttr("id");
    });

    clone = clone.filter(function () {
      if ($(this).hasClass("vseparator_container")) {
        return false;
      }

      let text = $(this).text().toLowerCase();
      return words.some((word) => text.includes(word));
    });

    if (clone.children().length === 0) {
      $("#chat_search_no_results").css("display", "block");
    } else {
      clone.appendTo("#chat_search_container");
    }

    Hue.add_to_chat_searches(filter);
  }

  Hue.msg_chat_search.show(function () {
    Hue.scroll_modal_to_top("chat_search");
  });
};

// Adds an item to the recently searched list for chat searches
Hue.add_to_chat_searches = function (filter) {
  clearTimeout(Hue.add_to_chat_searches_timeout);

  Hue.add_to_chat_searches_timeout = setTimeout(function () {
    Hue.do_add_to_chat_searches(filter);
  }, Hue.add_to_chat_searches_delay);
};

// Does the actual addition to the chat searches list
Hue.do_add_to_chat_searches = function (filter) {
  for (let i = 0; i < Hue.room_state.chat_searches.length; i++) {
    if (Hue.room_state.chat_searches[i] === filter) {
      Hue.room_state.chat_searches.splice(i, 1);
      break;
    }
  }

  Hue.room_state.chat_searches.unshift(filter);

  if (Hue.room_state.chat_searches.length > Hue.config.max_chat_searches) {
    Hue.room_state.chat_searches = Hue.room_state.chat_searches.slice(
      0,
      Hue.config.max_chat_searches
    );
  }

  Hue.save_room_state();
};

// Clears the chat searches list
Hue.clear_chat_searches = function () {
  Hue.room_state.chat_searches = [];
  Hue.save_room_state();
};
