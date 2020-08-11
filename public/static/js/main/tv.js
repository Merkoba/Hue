// Setups an tv object
// This handles tv objects received live from the server or from logged messages
// This is the entry function for tv objects to get registered, announced, and be ready for use
Hue.setup_tv = function (mode, odata = {}) {
  let data

  if (mode === "restart") {
    data = Hue.current_tv()
    data.date = odata.date
    data.info += ` | ${Hue.utilz.nice_date(data.date)}`
    data.message = `${odata.setter} restarted the tv`
    data.comment = odata.comment
    data.in_log = odata.in_log === undefined ? true : odata.in_log
  } else {
    data = {}

    data.id = odata.id
    data.user_id = odata.user_id
    data.type = odata.type
    data.source = odata.source
    data.title = odata.title
    data.setter = odata.setter
    data.date = odata.date
    data.query = odata.query
    data.comment = odata.comment
    data.nice_date = data.date ?
      Hue.utilz.nice_date(data.date) :
      Hue.utilz.nice_date()
    data.in_log = odata.in_log === undefined ? true : odata.in_log

    if (!data.setter) {
      data.setter = Hue.config.system_username
    }

    if (!data.source) {
      data.source = Hue.config.default_tv_source
      data.type = Hue.config.default_tv_type
      data.title = Hue.config.default_tv_title
    }

    if (!data.title) {
      data.title = data.source
    }

    data.message = `${
      data.setter
    } changed the tv to: ${Hue.utilz.conditional_quotes(data.title)}`

    if (data.type === "youtube") {
      let time = Hue.utilz.get_youtube_time(data.source)

      if (time !== 0) {
        data.message += ` (At ${Hue.utilz.humanize_seconds(time)})`
      }
    }

    let gets = data.id ? `${data.id.slice(-3)} | ` : ""

    data.info = `${gets}Setter: ${data.setter} | ${data.nice_date}`

    if (data.query) {
      data.info += ` | Search Term: "${data.query}"`
    }

    data.onclick = function () {
      Hue.open_url_menu({
        source: data.source,
        data: data,
        media_type: "tv"
      })
    }
  }

  if (!data.date) {
    data.date = Date.now()
  }

  if (data.message) {
    data.message_id = Hue.announce_tv(data).message_id
  }

  if (mode === "change" || mode === "show") {
    Hue.push_tv_changed(data)
  }

  if (mode === "change" || mode === "restart") {
    if (mode === "change") {
      if (Hue.room_state.tv_locked) {
        $("#footer_lock_tv_icon").addClass("blinking")
      }

      Hue.change({
        type: "tv",
        force: true
      })
    } else if (mode === "restart") {
      Hue.change({
        type: "tv",
        force: true,
        play: true
      })
    }
  }
}

// Announce a tv change to the chat
Hue.announce_tv = function (data) {
  return Hue.public_feedback(data.message, {
    id: data.id,
    save: true,
    brk: Hue.get_chat_icon("tv"),
    title: data.info,
    onclick: data.onclick,
    date: data.date,
    type: data.type,
    username: data.setter,
    comment: data.comment,
    type: "tv_change",
    user_id: data.user_id,
    in_log: data.in_log,
    media_source: data.source
  })
}

// Returns the current room tv
// The last tv in the tv changed array
// This is not necesarily the user's loaded tv
Hue.current_tv = function () {
  if (Hue.tv_changed.length > 0) {
    return Hue.tv_changed[Hue.tv_changed.length - 1]
  } else {
    return {}
  }
}

// Pushes a changed tv into the tv changed array
Hue.push_tv_changed = function (data) {
  Hue.tv_changed.push(data)

  if (Hue.tv_changed.length > Hue.config.media_changed_crop_limit) {
    Hue.tv_changed = Hue.tv_changed.slice(
      Hue.tv_changed.length - Hue.config.media_changed_crop_limit
    )
  }

  Hue.after_push_media_change("tv", data)
}

// Stops all defined tv players
Hue.stop_tv = function (hard_stop = true) {
  if (Hue.youtube_video_player) {
    Hue.youtube_video_player.pauseVideo()
  }

  if (Hue.twitch_video_player) {
    Hue.twitch_video_player.pause()
  }

  if (Hue.soundcloud_video_player) {
    Hue.soundcloud_video_player.pause()
  }

  if ($("#media_video").length > 0) {
    $("#media_video")[0].pause()

    if (hard_stop) {
      $("#media_video")[0].src = ""
    }
  }

  if (hard_stop) {
    $("#media_iframe_video").attr("src", "")
    $("#media_iframe_poster").css("display", "block")
  }
}

// Plays the active loaded tv
Hue.play_tv = function () {
  if (!Hue.tv_visible) {
    return false
  }

  if (Hue.current_tv().type === "youtube") {
    if (Hue.youtube_video_player) {
      Hue.youtube_video_player.playVideo()
    }
  } else if (Hue.current_tv().type === "twitch") {
    if (Hue.twitch_video_player) {
      Hue.twitch_video_player.play()
    }
  } else if (Hue.current_tv().type === "soundcloud") {
    if (Hue.soundcloud_video_player) {
      Hue.soundcloud_video_player.play()
    }
  } else if (Hue.current_tv().type === "video") {
    if ($("#media_video").length > 0) {
      $("#media_video")[0].play()
    }
  } else if (Hue.current_tv().type === "iframe") {
    $("#media_iframe_video").attr("src", Hue.current_tv().source)
    $("#media_iframe_poster").css("display", "none")
  } else {
    played = false
  }
}

// Destroys all tv players that don't match the item's type
// Makes the item's type visible
Hue.hide_tv = function (item = false) {
  $("#media_tv .media_container").each(function () {
    let id = $(this).attr("id")
    let type = id.replace("media_", "").replace("_video_container", "")

    if (!item || item.type !== type) {
      let new_el = $(`<div id='${id}' class='media_container'></div>`)
      new_el.css("display", "none")
      $(this).replaceWith(new_el)
      Hue[`${type}_video_player`] = undefined
      Hue[`${type}_video_player_requested`] = false
      Hue[`${type}_video_player_request`] = false
    } else {
      $(this).css("display", "flex")
    }
  })
}

// Loads a YouTube video
Hue.show_youtube_video = function (play = true) {
  let item = Hue.loaded_tv
  Hue.before_show_tv(item)
  let id = Hue.utilz.get_youtube_id(item.source)
  Hue.youtube_video_play_on_queue = play

  if (id[0] === "video") {
    Hue.youtube_video_player.cueVideoById({
      videoId: id[1],
      startSeconds: Hue.utilz.get_youtube_time(item.source),
    })
  } else if (id[0] === "list") {
    Hue.youtube_video_player.cuePlaylist({
      list: id[1][0],
      index: id[1][1]
    })
  } else {
    return false
  }

  Hue.after_show_tv()
}

// Loads a Twitch video
Hue.show_twitch_video = function (play = true) {
  let item = Hue.loaded_tv
  Hue.before_show_tv(item)
  let id = Hue.utilz.get_twitch_id(item.source)

  if (id[0] === "video") {
    Hue.twitch_video_player.setVideoSource(item.source)
  } else if (id[0] === "channel") {
    Hue.twitch_video_player.setChannel(id[1])
  } else {
    return false
  }

  if (play) {
    Hue.twitch_video_player.play()
  } else {
    clearTimeout(Hue.play_twitch_video_player_timeout)
    Hue.twitch_video_player.pause()
  }

  Hue.after_show_tv(play)
}

// Loads a Soundcloud video
Hue.show_soundcloud_video = function (play = true) {
  let item = Hue.loaded_tv
  Hue.before_show_tv(item)

  Hue.soundcloud_video_player.load(item.source, {
    auto_play: false,
    single_active: false,
    show_artwork: true,
    callback: function () {
      if (play) {
        Hue.soundcloud_video_player.play()
      }
    },
  })

  Hue.after_show_tv()
}

// Loads a <video> video
Hue.show_video_video = async function (play = true) {
  let item = Hue.loaded_tv

  if ($("#media_video").length === 0) {
    let s = `<video id='media_video'
        class='video_frame' width="640px" height="360px"
        preload="none" poster="${Hue.config.default_video_url}" controls></video>
        <div class='media_info dynamic_title'></div>`

    $("#media_video_video_container").html(s)
  }

  Hue.before_show_tv(item)

  let split = item.source.split(".")

  if (split[split.length - 1] === "m3u8") {
    await Hue.start_hls()
    Hue.hls.loadSource(item.source)
    Hue.hls.attachMedia($("#media_video")[0])
  } else {
    $("#media_video").prop("src", item.source)
  }

  if (play) {
    $("#media_video")[0].play()
  }

  Hue.after_show_tv()
}

// Loads an iframe as the tv
Hue.show_iframe_video = function (play = true) {
  let item = Hue.loaded_tv

  if ($("#media_iframe_video").length === 0) {
    let s = `<div id='media_iframe_poster' class='pointer action'>Click Here To Load</div>
        <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" 
        width="640px" height="360px" id='media_iframe_video' class='video_frame'></iframe>
        <div class='media_info dynamic_title'></div>`

    $("#media_iframe_video_container").html(s)

    Hue.setup_iframe_video()
  }

  Hue.before_show_tv(item)

  if (play) {
    $("#media_iframe_video").attr("src", item.source)
    $("#media_iframe_poster").css("display", "none")
  } else {
    $("#media_iframe_poster").css("display", "block")
  }

  Hue.after_show_tv()
}

// This gets called before any tv video is loaded
Hue.before_show_tv = function (item) {
  Hue.stop_tv()
  Hue.hide_tv(item)
  Hue.hls = undefined
}

// Apply tv media info
Hue.apply_tv_media_info = function () {
  let tv_media_info = $(`#media_${Hue.loaded_tv.type}_video_container`)
    .find(".media_info")
    .get(0)

  Hue.apply_media_info(tv_media_info, Hue.loaded_tv, "tv")
}

// This gets called after any tv video is loaded
Hue.after_show_tv = function () {
  Hue.apply_tv_media_info()
  Hue.fix_visible_video_frame()
  Hue.focus_input()
  Hue.set_tv_volume(false, false)
}

// Attempts to change the tv source
// It considers room state and permissions
// It considers text or url to determine if it's valid
// It includes a 'just check' flag to only return true or false
Hue.change_tv_source = function (src, just_check = false, comment = "") {
  let feedback = true

  if (just_check) {
    feedback = false
  }

  if (!Hue.can_tv) {
    if (feedback) {
      Hue.feedback("You don't have permission to change the tv")
    }

    return false
  }

  if (!comment) {
    let r = Hue.get_media_change_inline_comment("tv", src)
    src = r.source
    comment = r.comment
  }

  if (comment.length > Hue.config.max_media_comment_length) {
    if (feedback) {
      Hue.feedback("Comment is too long")
    }

    return false
  }

  if (src.length === 0) {
    return false
  }

  src = Hue.utilz.clean_string2(src)

  if (src.length > Hue.config.max_media_source_length) {
    return false
  }

  if (src.startsWith("/")) {
    return false
  }

  if (src === Hue.current_tv().source || src === Hue.current_tv().query) {
    if (feedback) {
      Hue.feedback("TV is already set to that")
    }

    return false
  } else if (src === "default") {
    // OK
  } else if (src === "prev" || src === "previous") {
    if (Hue.tv_changed.length > 1) {
      src = Hue.tv_changed[Hue.tv_changed.length - 2].source
    } else {
      if (feedback) {
        Hue.feedback("No tv source before current one")
      }

      return false
    }
  }

  if (Hue.utilz.is_url(src)) {
    if (Hue.check_domain_list("tv", src)) {
      if (feedback) {
        Hue.feedback("TV sources from that domain are not allowed")
      }

      return false
    }

    if (src.includes("youtube.com") || src.includes("youtu.be")) {
      if (Hue.utilz.get_youtube_id(src) && !Hue.config.youtube_enabled) {
        if (feedback) {
          Hue.feedback("YouTube support is not enabled")
        }

        return false
      }
    } else if (src.includes("twitch.tv")) {
      if (Hue.utilz.get_twitch_id(src) && !Hue.config.twitch_enabled) {
        if (feedback) {
          Hue.feedback("Twitch support is not enabled")
        }

        return false
      }
    } else if (src.includes("soundcloud.com")) {
      if (!Hue.config.soundcloud_enabled) {
        if (feedback) {
          Hue.feedback("Soundcloud support is not enabled")
        }

        return false
      }
    } else {
      let extension = Hue.utilz.get_extension(src).toLowerCase()

      if (extension) {
        if (
          Hue.utilz.video_extensions.includes(extension) ||
          Hue.utilz.audio_extensions.includes(extension)
        ) {
          // OK
        } else if (Hue.utilz.image_extensions.includes(extension)) {
          if (feedback) {
            Hue.feedback("That doesn't seem to be a video")
          }

          return false
        } else if (!Hue.config.iframes_enabled) {
          if (feedback) {
            Hue.feedback("IFrame support is not enabled")
          }

          return false
        }
      } else {
        if (!Hue.config.iframes_enabled) {
          if (feedback) {
            Hue.feedback("IFrame support is not enabled")
          }

          return false
        }
      }
    }
  } else if (src !== "restart" && src !== "reset") {
    if (src.length > Hue.config.safe_limit_1) {
      if (feedback) {
        Hue.feedback("Query is too long")
      }

      return false
    }

    if (!Hue.config.youtube_enabled) {
      if (feedback) {
        Hue.feedback("YouTube support is not enabled")
      }

      return false
    }
  }

  if (just_check) {
    return true
  }

  if (Hue.get_setting("confirm_tv")) {
    if (!confirm("Are you sure you want to change the tv here?")) {
      return
    }
  }

  Hue.socket_emit("change_tv_source", {
    src: src,
    comment: comment
  })
}

// Changes the tv visibility based on current state
Hue.change_tv_visibility = function (play = false) {
  if (Hue.room_tv_mode !== "disabled" && Hue.room_state.tv_enabled) {
    $("#media").css("display", "flex")
    $("#media_tv").css("display", "flex")
    $("#footer_toggle_tv_icon").find("use").eq(0).attr("href", "#icon_toggle-on")

    if (!Hue.tv_visible) {
      Hue.tv_visible = true

      if (Hue.room_tv_mode === "enabled") {
        if (Hue.first_media_change && Hue.started) {
          Hue.change({
            type: "tv",
            force: true,
            play: play,
            current_source: Hue.room_state.tv_locked,
          })
        }
      }
    }

    Hue.fix_visible_video_frame()
  } else {
    Hue.stop_tv()
    Hue.hide_tv()

    $("#media_tv").css("display", "none")

    let num_visible = Hue.num_media_elements_visible()

    if (num_visible === 0) {
      Hue.hide_media()
    }

    $("#footer_toggle_tv_icon").find("use").eq(0).attr("href", "#icon_toggle-off")

    Hue.tv_visible = false
  }

  if (Hue.image_visible) {
    Hue.fix_image_frame()
  }

  Hue.check_footer_media_rotate()
  Hue.goto_bottom(false, false)
}

// Checks if tv is maximized
Hue.tv_is_maximized = function () {
  return Hue.tv_visible && !Hue.image_visible
}

// Maximizes the tv, hiding the image
Hue.maximize_tv = function () {
  if (Hue.tv_visible) {
    if (Hue.image_visible) {
      Hue.toggle_media({type:"image", what:false, save:false})
    } else {
      Hue.toggle_media({type:"image", what:true, save:false})
    }
  } else {
    Hue.toggle_media({type:"tv", what:true, save:false})

    if (Hue.image_visible) {
      Hue.toggle_media({type:"image", what:false, save:false})
    }
  }

  Hue.save_room_state()
}

// Increases the tv volume
Hue.tv_volume_increase = function (step = 0.1) {
  if (Hue.room_state.tv_volume === 1) {
    return false
  }

  let nv = Hue.room_state.tv_volume + step

  Hue.set_tv_volume(nv)
}

// Decreases the tv volume
Hue.tv_volume_decrease = function (step = 0.1) {
  if (Hue.room_state.tv_volume === 0) {
    return false
  }

  let nv = Hue.room_state.tv_volume - step

  Hue.set_tv_volume(nv)
}

// Sends an emit to change the tv to the previous one
Hue.tv_prev = function () {
  Hue.change_tv_source("prev")
  Hue.msg_tv_picker.close()
}

// Used to change the tv
// Shows the tv picker window to input a URL
Hue.show_tv_picker = function () {
  if (!Hue.can_tv) {
    Hue.feedback("You don't have tv permission")
    return false
  }

  Hue.msg_tv_picker.show(function () {
    $("#tv_source_picker_input").focus()
    Hue.show_media_history("tv")
    Hue.scroll_modal_to_top("tv_picker")
  })
}

// Sets the tv volume
Hue.set_tv_volume = function (
  nv = false,
  changed = true,
  update_slider = true
) {
  if (typeof nv !== "number") {
    nv = Hue.room_state.tv_volume
  }

  nv = Hue.utilz.round(nv, 1)

  if (nv > 1) {
    nv = 1
  } else if (nv < 0) {
    nv = 0
  }

  Hue.room_state.tv_volume = nv

  let vt = Hue.utilz.to_hundred(nv)

  if ($("#media_video").length > 0) {
    $("#media_video")[0].volume = nv
  }

  if (Hue.youtube_video_player) {
    Hue.youtube_video_player.setVolume(vt)
  }

  if (Hue.twitch_video_player) {
    Hue.twitch_video_player.setVolume(nv)
  }

  if (Hue.soundcloud_video_player) {
    Hue.soundcloud_video_player.setVolume(vt)
  }

  if (changed) {
    if (update_slider) {
      Hue.set_media_menu_tv_volume(nv)
    }

    Hue.save_room_state()
  }
}

// Reloads the tv with the same source
Hue.refresh_tv = function () {
  Hue.change({
    type: "tv",
    force: true,
    play: true,
    current_source: true
  })
}

// Sends a restart signal to reload the tv for everyone
Hue.restart_tv = function () {
  Hue.change_tv_source("restart")
  Hue.msg_tv_picker.close()
}

// Room tv mode setter
Hue.set_room_tv_mode = function (what) {
  Hue.room_tv_mode = what
  Hue.config_admin_room_tv_mode()
}

// Does the change of tv display percentage
Hue.do_media_tv_size_change = function (size, notify = true) {
  if (size === "max") {
    size = 90
  } else if (size === "min") {
    size = 10
  }

  size = parseInt(size)

  if (size < 0 || size > 100) {
    return false
  }

  if (size !== Hue.get_setting("tv_display_percentage")) {
    Hue.modify_setting(`tv_display_percentage ${size}`, false)
  }

  if (notify) {
    Hue.notify_media_tv_size_change(size)
  }

  if (size === 0) {
    if (!Hue.image_is_maximized()) {
      Hue.maximize_image()
      Hue.show_infotip("Image Maximized")
      Hue.modify_setting(`tv_display_percentage ${Hue.config.global_settings_default_tv_display_percentage}`, false)
    }
  } else if (size === 100) {
    if (!Hue.tv_is_maximized()) {
      Hue.maximize_tv()
      Hue.show_infotip("TV Maximized")
      Hue.modify_setting(`tv_display_percentage ${Hue.config.global_settings_default_tv_display_percentage}`, false)
    }
  }
}

// Increases the tv display percentage
Hue.increase_tv_percentage = function (override = true) {
  let size = Hue.get_setting("tv_display_percentage")

  size += 10
  size = Hue.utilz.round2(size, 10)

  if (override) {
    Hue.enable_setting_override("tv_display_percentage")
  }

  Hue.do_media_tv_size_change(size)
}

// Decreases the tv display percentage
Hue.decrease_tv_percentage = function (override = true) {
  let size = Hue.get_setting("tv_display_percentage")

  size -= 10
  size = Hue.utilz.round2(size, 10)

  if (override) {
    Hue.enable_setting_override("tv_display_percentage")
  }

  Hue.do_media_tv_size_change(size)
}

// Gets the id of the visible tv frame
Hue.get_visible_video_frame_id = function () {
  let id = false

  $(".video_frame").each(function () {
    if ($(this).parent().css("display") !== "none") {
      id = this.id
      return false
    }
  })

  return id
}

// Sets the tv display percentage to default
Hue.set_default_tv_size = function () {
  Hue.do_media_tv_size_change(
    Hue.config.global_settings_default_tv_display_percentage
  )
}

// Announces room tv mode changes
Hue.announce_room_tv_mode_change = function (data) {
  Hue.show_room_notification(
    data.username,
    `${data.username} changed the tv mode to ${data.what}`
  )
  Hue.set_room_tv_mode(data.what)
  Hue.change_tv_visibility(false)
  Hue.check_media_permissions()
  Hue.check_media_maxers()
  Hue.update_footer_separators()
  Hue.change_media_lock_icon("tv")
}

// Sets the media menu tv slider
Hue.set_media_menu_tv_volume = function (n = false) {
  if (n === false) {
    n = Hue.room_state.tv_volume
  } else if (n === "increase") {
    n = Hue.room_state.tv_volume + 0.2

    if (n > 1) {
      n = 1
    }
  } else if (n === "decrease") {
    n = Hue.room_state.tv_volume - 0.2

    if (n < 0) {
      n = 0
    }
  } else if (n === "max") {
    n = 1
  } else if (n === "min") {
    n = 0
  } else if (n === "default") {
    n = Hue.config.room_state_default_tv_volume
  }

  $("#media_menu_tv_volume").val(n)

  Hue.set_tv_volume(n, true, false)
}

// Shows the new tv display percentage in the infotip
Hue.notify_media_tv_size_change = function (size) {
  let info

  if (size === Hue.config.global_settings_default_tv_display_percentage) {
    info = " (Default)"
  } else {
    info = ""
  }

  Hue.show_infotip(`TV Size: ${size}%${info}`)
}

// Setup for the tv iframe
Hue.setup_iframe_video = function () {
  $("#media_iframe_poster").click(function () {
    Hue.play_tv()
  })
}

// Updates dimensions of the visible tv frame
Hue.fix_visible_video_frame = function () {
  let id = Hue.get_visible_video_frame_id()

  if (id) {
    Hue.fix_frame(id)
  }
}

// Changes the room tv mode
Hue.change_room_tv_mode = function (what) {
  if (!Hue.check_op_permission(Hue.role, "media")) {
    return false
  }

  let modes = ["enabled", "disabled", "locked"]

  if (!modes.includes(what)) {
    Hue.feedback(`Valid tv modes: ${modes.join(" ")}`)
    return false
  }

  if (what === Hue.room_tv_mode) {
    Hue.feedback(`TV mode is already set to that`)
    return false
  }

  Hue.socket_emit("change_tv_mode", {
    what: what
  })
}

Hue.tv_picker_submit = function () {
  let val = $("#tv_source_picker_input").val().trim()

  if (val !== "") {
    Hue.change_tv_source(val)
    Hue.msg_tv_picker.close()
  }
}

// Checks if tv is abled to be synced with another user
Hue.can_sync_tv = function () {
  if (!Hue.room_state.tv_enabled) {
    return false
  }

  if (Hue.loaded_tv.type === "youtube") {
    if (!Hue.youtube_video_player) {
      return false
    }
  } else if (Hue.loaded_tv.type === "video") {
    if ($("#media_video").length === 0) {
      return false
    }
  } else {
    return false
  }

  return true
}

// Sends a request to the server to send a request to the user to report video progress
Hue.sync_tv = function (username) {
  if (!Hue.can_sync_tv()) {
    return false
  }

  if (!Hue.user_is_online_by_username(username)) {
    return false
  }

  Hue.socket_emit("sync_tv", {
    username: username
  })
}

// Responds to a tv sync request to send it back to a user
Hue.report_tv_progress = function (data) {
  if (Hue.user_is_ignored(data.requester_username)) {
    return false
  }

  if (!Hue.can_sync_tv()) {
    return false
  }

  let ttype = Hue.loaded_tv.type
  let progress

  if (ttype === "youtube") {
    progress = Math.round(Hue.youtube_video_player.getCurrentTime())
  } else if (ttype === "video") {
    progress = Math.round($("#media_video")[0].currentTime)
  }

  if (progress) {
    Hue.socket_emit("report_tv_progress", {
      requester: data.requester,
      progress: progress,
      type: ttype,
    })

    Hue.show_room_notification(
      data.request_username,
      `${data.requester_username} synced their tv with yours`
    )
  }
}

// After the server sends a user's tv progress response
Hue.receive_tv_progress = function (data) {
  if (!Hue.can_sync_tv()) {
    return false
  }

  if (data.type === "youtube") {
    if (Hue.loaded_tv.type !== "youtube") {
      return false
    }

    let id = Hue.utilz.get_youtube_id(Hue.loaded_tv.source)

    Hue.youtube_video_play_on_queue = true

    if (id[0] === "video") {
      Hue.youtube_video_player.cueVideoById({
        videoId: id[1],
        startSeconds: data.progress,
      })
    }
  } else if (data.type === "video") {
    if (Hue.loaded_tv.type !== "video") {
      return false
    }

    $("#media_video")[0].currentTime = data.progress
    $("#media_video")[0].play()
  }
}

// Handles volume change command for the tv
Hue.change_tv_volume = function (arg) {
  if (isNaN(arg)) {
    Hue.feedback("Argument must be a number")
    return false
  } else {
    let nv = arg / 100
    Hue.set_tv_volume(nv)
  }
}