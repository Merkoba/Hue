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
}

// Stops all defined tv players
Hue.stop_tv = function () {
  if (Hue.youtube_tv_player) {
    Hue.youtube_tv_player.pauseVideo()
  }

  if (Hue.twitch_tv_player) {
    Hue.twitch_tv_player.pause()
  }

  if (Hue.soundcloud_tv_player) {
    Hue.soundcloud_tv_player.pause()
  }

  if (Hue.el("#media_video_tv")) {
    Hue.el("#media_video_tv").pause()
  }
}

// Plays the active loaded tv
Hue.play_tv = function () {
  if (!Hue.tv_visible) {
    return false
  }

  if (Hue.current_tv().type === "youtube") {
    if (Hue.youtube_tv_player) {
      Hue.youtube_tv_player.playVideo()
    }
  } else if (Hue.current_tv().type === "twitch") {
    if (Hue.twitch_tv_player) {
      Hue.twitch_tv_player.play()
    }
  } else if (Hue.current_tv().type === "soundcloud") {
    if (Hue.soundcloud_tv_player) {
      Hue.soundcloud_tv_player.play()
    }
  } else if (Hue.current_tv().type === "video") {
    if (Hue.el("#media_video_tv")) {
      Hue.el("#media_video_tv").play()
    }
  } else if (Hue.current_tv().type === "iframe") {
    let iframe = Hue.el("#media_iframe_tv")
    iframe.classList.add("noborder")
    iframe.src = Hue.current_tv().source
    Hue.el("#media_iframe_poster").style.display = "none"
  }
}

// Destroys all tv players that don't match the item's type
// Makes the item's type visible
Hue.hide_tv = function (item = false) {
  Hue.els("#media_tv .media_container").forEach(it => {
    let type = it.id.replace("media_", "").replace("_tv_container", "")

    if (!item || item.type !== type) {
      let el = Hue.div("media_container")
      el.id = it.id
      el.style.display = "none"
      it.replaceWith(el)
      Hue[`${type}_tv_player`] = undefined
      Hue[`${type}_tv_player_requested`] = false
      Hue[`${type}_tv_player_request`] = false
    } else {
      it.style.display = "flex"
    }
  })
}

// Loads a YouTube video
Hue.show_youtube_tv = function (play = true) {
  let item = Hue.loaded_tv
  Hue.before_show_tv(item)
  let id = Hue.utilz.get_youtube_id(item.source)

  if (id[0] === "video") {
    let seconds = Hue.utilz.get_youtube_time(item.source)

    if (play) {
      Hue.youtube_tv_player.loadVideoById({
        videoId: id[1],
        startSeconds: seconds,
      })      
    } else {
      Hue.youtube_tv_player.cueVideoById({
        videoId: id[1],
        startSeconds: seconds,
      })
    }
  } else if (id[0] === "list") {
    if (play) {
      Hue.youtube_tv_player.loadPlaylist({
        list: id[1][0],
        index: id[1][1]
      })
    } else {
      Hue.youtube_tv_player.cuePlaylist({
        list: id[1][0],
        index: id[1][1]
      })
    }   
  } else {
    return false
  }

  Hue.after_show_tv()
}

// Loads a Twitch video
Hue.show_twitch_tv = function (play = true) {
  let item = Hue.loaded_tv
  Hue.before_show_tv(item)
  let id = Hue.utilz.get_twitch_id(item.source)

  if (id[0] === "video") {
    Hue.twitch_tv_player.setVideoSource(item.source)
  } else if (id[0] === "channel") {
    Hue.twitch_tv_player.setChannel(id[1])
  } else {
    return false
  }

  if (play) {
    Hue.twitch_tv_player.play()
  } else {
    clearTimeout(Hue.play_twitch_tv_player_timeout)
    Hue.twitch_tv_player.pause()
  }

  Hue.after_show_tv(play)
}

// Loads a Soundcloud video
Hue.show_soundcloud_tv = function (play = true) {
  let item = Hue.loaded_tv
  Hue.before_show_tv(item)

  Hue.soundcloud_tv_player.load(item.source, {
    auto_play: false,
    single_active: false,
    show_artwork: true,
    callback: function () {
      if (play) {
        Hue.soundcloud_tv_player.play()
      }
    },
  })

  Hue.after_show_tv()
}

// Loads a <video> video
Hue.show_video_tv = function (play = true) {
  let item = Hue.loaded_tv

  if (!Hue.el("#media_video_tv")) {
    let s = `<video id='media_video_tv'
        class='video_frame' width="640px" height="360px"
        preload="none" poster="${Hue.config.default_video_url}" controls></video>
        ${Hue.get_media_info_html("tv")}`

    Hue.el("#media_video_tv_container").innerHTML = s
  }


  Hue.before_show_tv(item)
  Hue.el("#media_video_tv").src = item.source

  if (play) {
    Hue.el("#media_video_tv").play()
  }

  Hue.after_show_tv()
}

// Loads an iframe as the tv
Hue.show_iframe_tv = function (play = true) {
  let item = Hue.loaded_tv

  if (!Hue.el("#media_iframe_tv")) {
    let s = `<div id='media_iframe_poster' class='action'>Click Here To Load</div>
        <iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" 
        width="640px" height="360px" id='media_iframe_tv' class='video_frame'></iframe>
        ${Hue.get_media_info_html("tv")}`

    Hue.el("#media_iframe_tv_container").innerHTML = s
    Hue.setup_iframe_tv()
  }

  Hue.before_show_tv(item)
  let iframe = Hue.el("#media_iframe_tv")

  if (play) {
    iframe.classList.add("noborder")
    iframe.src = item.source
    Hue.el("#media_iframe_poster").style.display = "none"
  } else {
    iframe.classList.remove("noborder")
    Hue.el("#media_iframe_poster").style.display = "block"
  }

  Hue.after_show_tv()
}

// This gets called before any tv video is loaded
Hue.before_show_tv = function (item) {
  Hue.stop_tv()
  Hue.hide_tv(item)
}

// This gets called after any tv video is loaded
Hue.after_show_tv = function () {
  Hue.apply_media_info("tv")
  Hue.fix_visible_tv_frame()
  Hue.focus_input()
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

  if (!comment) {
    let r = Hue.get_media_change_inline_comment("tv", src)
    src = r.source
    comment = r.comment
  }

  if (comment.length > Hue.config.max_media_comment_length) {
    if (feedback) {
      Hue.checkmsg("Comment is too long")
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
      Hue.checkmsg("TV is already set to that")
    }

    return false
  }

  if (Hue.utilz.is_url(src)) {
    if (src.includes("youtube.com") || src.includes("youtu.be")) {
      if (Hue.utilz.get_youtube_id(src) && !Hue.config.youtube_enabled) {
        if (feedback) {
          Hue.checkmsg("YouTube support is not enabled")
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
            Hue.checkmsg("That doesn't seem to be a video")
          }

          return false
        } else if (!Hue.config.iframes_enabled) {
          if (feedback) {
            Hue.checkmsg("IFrame support is not enabled")
          }

          return false
        }
      } else {
        if (!Hue.config.iframes_enabled) {
          if (feedback) {
            Hue.checkmsg("IFrame support is not enabled")
          }

          return false
        }
      }
    }
  } else {
    if (src.length > Hue.config.safe_limit_1) {
      if (feedback) {
        Hue.checkmsg("Query is too long")
      }

      return false
    }

    if (!Hue.config.youtube_enabled) {
      if (feedback) {
        Hue.checkmsg("YouTube support is not enabled")
      }

      return false
    }    
  }

  if (just_check) {
    return true
  }

  Hue.do_tv_change(src, comment)
}

// Do tv change socket emit
Hue.do_tv_change = function (src, comment) {
  Hue.socket_emit("change_tv_source", {
    src: src,
    comment: comment
  })
}

// Changes the tv visibility based on current state
Hue.change_tv_visibility = function (play = false) {
  if (Hue.room_state.tv_enabled) {
    Hue.el("#media").style.display = "flex"
    Hue.el("#media_tv").style.display = "flex"
    Hue.el("#footer_toggle_tv_icon use").href.baseVal = "#icon_toggle-on"

    if (!Hue.tv_visible) {
      Hue.tv_visible = true

      if (Hue.room_state.tv_enabled) {
        if (Hue.first_media_change && Hue.started) {
          Hue.change({
            type: "tv",
            force: true,
            play: play,
            current_source: Hue.tv_locked
          })
        }
      }
    }

    Hue.fix_visible_tv_frame()
  } else {
    Hue.stop_tv()
    Hue.hide_tv()

    Hue.el("#media_tv").style.display = "none"

    let num_visible = Hue.num_media_elements_visible()

    if (num_visible === 0) {
      Hue.hide_media()
    }

    Hue.el("#footer_toggle_tv_icon use").href.baseVal = "#icon_toggle-off"
    Hue.tv_visible = false
  }

  if (Hue.image_visible) {
    Hue.fix_image_frame()
  }

  Hue.goto_bottom()
}

// Does the change of tv display percentage
Hue.do_media_tv_size_change = function (size) {
  if (size === "max") {
    size = Hue.media_max_percentage
  } else if (size === "min") {
    size = Hue.media_min_percentage
  } else if (size === "default") {
    size = Hue.config.room_state_default_tv_display_percentage
  }

  size = Hue.limit_media_percentage(Hue.utilz.round2(size, 5))

  Hue.room_state.tv_display_percentage = size
  Hue.save_room_state()
  Hue.apply_media_percentages()
}

// Increases the tv display percentage
Hue.increase_tv_percentage = function () {
  let size = Hue.room_state.tv_display_percentage
  size += 5
  size = Hue.utilz.round2(size, 5)
  Hue.do_media_tv_size_change(size)
}

// Decreases the tv display percentage
Hue.decrease_tv_percentage = function () {
  let size = Hue.room_state.tv_display_percentage
  size -= 5
  size = Hue.utilz.round2(size, 5)
  Hue.do_media_tv_size_change(size)
}

// Gets the id of the visible tv frame
Hue.get_visible_video_frame_id = function () {
  let id = false

  for (let item of Hue.els(".video_frame")) {
    if (item.parentElement.style.display !== "none") {
      id = item.id
      break
    }
  }

  return id
}

// Sets the tv display percentage to default
Hue.set_default_tv_size = function () {
  Hue.do_media_tv_size_change("default")
}

// Setup for the tv iframe
Hue.setup_iframe_tv = function () {
  Hue.el("#media_iframe_poster").addEventListener("click", function () {
    Hue.play_tv()
  })
}

// Updates dimensions of the visible tv frame
Hue.fix_visible_tv_frame = function () {
  let id = Hue.get_visible_video_frame_id()

  if (id) {
    Hue.fix_frame(id)
  }
}

Hue.tv_picker_submit = function () {
  let val = Hue.el("#tv_source_picker_input").value.trim()

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
    if (!Hue.youtube_tv_player) {
      return false
    }
  } else if (Hue.loaded_tv.type === "video") {
    if (!Hue.el("#media_video_tv")) {
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
    username: username,
    tv_source: Hue.loaded_tv.source
  })
}

// Responds to a tv sync request to send it back to a user
Hue.report_tv_progress = function (data) {
  if (!Hue.can_sync_tv()) {
    return false
  }

  if (Hue.loaded_tv.source !== data.tv_source) {
    return false
  }

  let ttype = Hue.loaded_tv.type
  let progress

  if (ttype === "youtube") {
    progress = Math.round(Hue.youtube_tv_player.getCurrentTime())
  } else if (ttype === "video") {
    progress = Math.round(Hue.el("#media_video_tv").currentTime)
  }

  if (progress) {
    Hue.socket_emit("report_tv_progress", {
      requester: data.requester,
      progress: progress,
      type: ttype,
    })

    Hue.show_room_notification(
      data.requester_username,
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

    if (id[0] === "video") {
      Hue.youtube_tv_player.loadVideoById({
        videoId: id[1],
        startSeconds: data.progress,
      })
    }
  } else if (data.type === "video") {
    if (Hue.loaded_tv.type !== "video") {
      return false
    }

    Hue.el("#media_video_tv").currentTime = data.progress
    Hue.el("#media_video_tv").play()
  }
}

// Shows the window to add a comment to a video upload
Hue.show_tv_upload_comment = function (file, type) {
  Hue.el("#tv_upload_comment_video_feedback").style.display = "none"
  Hue.el("#tv_upload_comment_video_preview").style.display = "inline-block"

  let reader = new FileReader()

  reader.onload = function (e) {
    Hue.tv_upload_comment_file = file
    Hue.tv_upload_comment_type = type

    Hue.el("#tv_upload_comment_video_preview").src = e.target.result

    Hue.msg_tv_upload_comment.set_title(
      `${Hue.utilz.slice_string_end(
        file.name,
        20
      )} (${Hue.utilz.get_size_string(file.size, 2)})`
    )

    Hue.el("#Msg-titlebar-tv_upload_comment").title = file.name

    Hue.msg_tv_upload_comment.show(function () {
      Hue.el("#tv_upload_comment_submit").addEventListener("click", function () {
        Hue.process_tv_upload_comment()
      })

      Hue.el("#tv_upload_comment_input").focus()
      Hue.scroll_modal_to_bottom("tv_upload_comment")
    })
  }

  reader.readAsDataURL(file)
}

// Submits the upload tv comment window
// Uploads the file and the optional comment
Hue.process_tv_upload_comment = function () {
  if (!Hue.msg_tv_upload_comment.is_open()) {
    return false
  }

  let file = Hue.tv_upload_comment_file
  let type = Hue.tv_upload_comment_type
  let comment = Hue.utilz.clean_string2(Hue.el("#tv_upload_comment_input").value)

  if (comment.length > Hue.config.max_media_comment_length) {
    return false
  }

  Hue.upload_file({ file: file, action: type, comment: comment })
  Hue.msg_tv_upload_comment.close()
}

// Setups the upload tv comment window
Hue.setup_tv_upload_comment = function () {
  let video = Hue.el("#tv_upload_comment_video_preview")
  video.addEventListener("error", function () {
    this.style.display = "none"
    Hue.el("#tv_upload_comment_video_feedback").style.display = "inline"
  })
}