// Sets the initial state of the activity bar
// Setups events for the activity bar
Hue.setup_activity_bar = function () {
  setInterval(function () {
    Hue.check_activity_bar();
  }, Hue.config.activity_bar_interval);

  setInterval(function () {
    if (Hue.app_focused) {
      Hue.trigger_activity();
    }
  }, Hue.config.activity_bar_trigger_interval);

  $("#activity_bar_container").on("click", ".activity_bar_item", function () {
    Hue.show_profile($(this).data("username"));
  });

  $("#activity_bar_container").on("auxclick", ".activity_bar_item", function (
    e
  ) {
    if (e.which === 2) {
      Hue.process_write_whisper($(this).data("username"));
    }
  });

  $("#activity_left_room_menu_icon").on("auxclick", function (e) {
    if (e.which === 2) {
      let rotated = $("#main_container").data("hue_rotated");
      let degrees = rotated ? 0 : 180;

      $("#main_container").css("transform", `rotateY(${degrees}deg)`);
      $("#main_container").data("hue_rotated", !Boolean(rotated));
    }
  });

  $("#activity_left_users_container").on("auxclick", function (e) {
    if (e.which === 2) {
      let user =
        Hue.userlist[Hue.utilz.get_random_int(0, Hue.userlist.length - 1)];
      Hue.show_profile(user.username);
    }
  });
};

// Checks if the activity list has changed and the activity bar must be updated
Hue.check_activity_bar = function (update = true) {
  if (Hue.activity_list.length === 0) {
    return false;
  }

  let d = Date.now() - Hue.config.max_activity_bar_delay;
  let new_top = [];
  let changed = false;

  for (let item of Hue.activity_list) {
    let user = Hue.get_user_by_username(item.username);

    if (item.date > d && user && !Hue.user_is_ignored(item.username)) {
      new_top.push(item);
    } else {
      changed = true;
    }
  }

  if (changed) {
    Hue.activity_list = new_top;

    if (update) {
      Hue.update_activity_bar();
    }
  }

  return changed;
};

// Updates the activity bar
// If items are still in the list they are not removed
// This is to keep states like profile image rotation from being interrupted
Hue.update_activity_bar = function () {
  let c = $("#activity_bar_content_inner");

  if (Hue.activity_list.length === 0) {
    Hue.clear_activity_bar_items();
    $("#activity_bar_no_activity").css("display", "block");
    return false;
  }

  $("#activity_bar_no_activity").css("display", "none");

  let usernames_included = [];

  $(".activity_bar_item").each(function () {
    let username = $(this).data("username");
    let user = Hue.get_user_by_username(username);

    if (user && Hue.activity_list.some((item) => item.username === username)) {
      let t = Hue.get_user_info_title(user, true);
      $(this).attr("title", t);
      $(this).data("otitle", t);
      usernames_included.push(username);
    } else {
      $(this).remove();
    }
  });

  if (Hue.activity_list.length > usernames_included.length) {
    for (let item of Hue.activity_list) {
      let user = Hue.get_user_by_username(item.username);

      if (usernames_included.includes(user.username)) {
        continue;
      }

      if (user) {
        let pi = user.profile_image || Hue.config.default_profile_image_url;

        let h = $(`
                <div class='activity_bar_item dynamic_title'>
                    <div class='activity_bar_image_container round_image_container'>
                        <img class='activity_bar_image profile_image' src='${pi}' loading='lazy'>
                    </div>
                    <div class='activity_bar_text'></div>
                </div>`);

        let text_el = h.find(".activity_bar_text").eq(0);
        let img_el = h.find(".activity_bar_image").eq(0);

        img_el.on("error", function () {
          if ($(this).attr("src") !== Hue.config.default_profile_image_url) {
            $(this).attr("src", Hue.config.default_profile_image_url);
          }
        });

        img_el.data("username", user.username);
        text_el.text(user.username);

        let t = Hue.get_user_info_title(user, true);

        h.attr("title", t);
        h.data("otitle", t);
        h.data("date", user.date_joined);
        h.data("username", user.username);

        c.append(h);
      }
    }
  }
};

// Pushes a user to the activity list and updates the activity bar
Hue.push_to_activity_bar = function (uname, date) {
  let user = Hue.get_user_by_username(uname);

  if (!user || !Hue.check_media_permission(user.role, "chat")) {
    return false;
  }

  let d = Date.now() - Hue.config.max_activity_bar_delay;

  if (date < d) {
    return false;
  }

  if (Hue.user_is_ignored(uname)) {
    return false;
  }

  for (let i = 0; i < Hue.activity_list.length; i++) {
    if (Hue.activity_list[i].username === uname) {
      Hue.activity_list.splice(i, 1);
      break;
    }
  }

  Hue.activity_list.unshift({ username: uname, date: date });

  if (Hue.activity_list.length > Hue.config.max_activity_bar_items) {
    Hue.activity_list.pop();
  }

  Hue.check_activity_bar(false);

  if (Hue.started) {
    Hue.update_activity_bar();
  }
};

// Gets an activity bar item by username
Hue.get_activity_bar_item_by_username = function (username) {
  let item = false;

  $(".activity_bar_item").each(function () {
    if ($(this).data("username") === username) {
      item = this;
      return false;
    }
  });

  return item;
};

// Removes all items on the activity bar
Hue.clear_activity_bar_items = function () {
  $("#activity_bar_content_inner")
    .find(".activity_bar_item")
    .each(function () {
      $(this).remove();
    });
};

// Updates the profile image of an item in the activity bar
Hue.update_activity_bar_image = function (username, src) {
  $("#activity_bar_content_inner")
    .find(".activity_bar_item")
    .each(function () {
      if ($(this).data("username") === username) {
        $(this).find(".activity_bar_image").eq(0).attr("src", src);
        return false;
      }
    });
};
