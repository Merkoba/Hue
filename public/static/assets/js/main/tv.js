// Get current tv
App.current_tv = () => {
  return App.get_current_media_change(`tv`)
}

// Pushes a changed tv into the tv changed array
App.push_tv_changed = (data) => {
  App.tv_changed.push(data)

  if (App.tv_changed.length > App.config.media_changed_crop_limit) {
    App.tv_changed = App.tv_changed.slice(
      App.tv_changed.length - App.config.media_changed_crop_limit,
    )
  }
}

// Stops all defined tv players
App.stop_tv = () => {
  if (App.youtube_tv_player) {
    App.youtube_tv_player.pauseVideo()
  }

  if (App.twitch_tv_player) {
    App.twitch_tv_player.pause()
  }

  if (DOM.el(`#media_video_tv`)) {
    DOM.el(`#media_video_tv`).pause()
  }
}

// Plays the active loaded tv
App.play_tv = () => {
  if (!App.tv_visible) {
    return
  }

  if (App.current_tv().type === `youtube`) {
    if (App.youtube_tv_player) {
      App.youtube_tv_player.playVideo()
    }
  }
  else if (App.current_tv().type === `twitch`) {
    if (App.twitch_tv_player) {
      App.twitch_tv_player.play()
    }
  }
  else if (App.current_tv().type === `video`) {
    if (DOM.el(`#media_video_tv`)) {
      DOM.el(`#media_video_tv`).play()
    }
  }
}

// Destroys all tv players that don't match the item's type
// Makes the item's type visible
App.hide_tv = (item = false) => {
  for (let el of DOM.els(`#media_tv .media_container`)) {
    let type = el.id.replace(`media_`, ``).replace(`_tv_container`, ``)

    if (!item || (item.type !== type)) {
      let new_el = DOM.create(`div`, `media_container`)
      new_el.id = el.id
      DOM.hide(new_el)
      el.replaceWith(new_el)
      App[`${type}_tv_player`] = undefined
      App[`${type}_tv_player_requested`] = false
      App[`${type}_tv_player_request`] = false
    }
    else {
      DOM.show(el)
    }
  }
}

// Loads a YouTube video
App.show_youtube_tv = (play = true) => {
  let item = App.loaded_tv
  App.before_show_tv(item)
  let id = App.utilz.get_youtube_id(item.source)

  if (id[0] === `video`) {
    let seconds = App.utilz.get_youtube_time(item.source)

    if (play) {
      App.youtube_tv_player.loadVideoById({
        videoId: id[1],
        startSeconds: seconds,
      })
    }
    else {
      App.youtube_tv_player.cueVideoById({
        videoId: id[1],
        startSeconds: seconds,
      })
    }
  }
  else if (id[0] === `list`) {
    if (play) {
      App.youtube_tv_player.loadPlaylist({
        list: id[1][0],
        index: id[1][1],
      })
    }
    else {
      App.youtube_tv_player.cuePlaylist({
        list: id[1][0],
        index: id[1][1],
      })
    }
  }
  else {
    return
  }

  App.after_show_tv()
}

// Loads a Twitch video
App.show_twitch_tv = (play = true) => {
  let item = App.loaded_tv
  App.before_show_tv(item)
  let id = App.utilz.get_twitch_id(item.source)

  if (id[0] === `video`) {
    App.twitch_tv_player.setVideoSource(item.source)
  }
  else if (id[0] === `channel`) {
    App.twitch_tv_player.setChannel(id[1])
  }
  else {
    return
  }

  if (play) {
    App.twitch_tv_player.play()
  }
  else {
    clearTimeout(App.play_twitch_tv_player_timeout)
    App.twitch_tv_player.pause()
  }

  App.after_show_tv(play)
}

// Loads a <video> video
App.show_video_tv = (play = true) => {
  let item = App.loaded_tv

  if (!DOM.el(`#media_video_tv`)) {
    let s = App.template_media_video_tv({
      info: App.get_media_info_html(`tv`),
      poster: App.config.video_poster,
    })

    DOM.el(`#media_video_tv_container`).innerHTML = s
  }

  App.before_show_tv(item)
  DOM.el(`#media_video_tv`).src = item.source

  if (play) {
    DOM.el(`#media_video_tv`).play()
  }

  App.after_show_tv()
}

// This gets called before any tv video is loaded
App.before_show_tv = (item) => {
  App.stop_tv()
  App.hide_tv(item)
}

// This gets called after any tv video is loaded
App.after_show_tv = () => {
  App.apply_media_info(`tv`)
  App.fix_tv_frame()
  App.focus_input()
  App.show_tv_loaded()
}

// Changes the tv source
App.change_tv_source = (src, check, comment) => {
  App.change_media_source({what: `tv`, src, check, comment})
}

// Do tv change socket emit
App.do_tv_change = (src, comment) => {
  App.socket_emit(`change_tv_source`, {
    src,
    comment,
  })
}

// Gets the id of the visible tv frame
App.get_visible_video_frame_id = () => {
  let id = false

  for (let item of DOM.els(`.video_frame`)) {
    if (!DOM.is_hidden(item.parentElement)) {
      id = item.id
      break
    }
  }

  return id
}

// Updates dimensions of the visible tv frame
App.fix_tv_frame = () => {
  let id = App.get_visible_video_frame_id()

  if (id) {
    App.fix_frame(id)
  }
}

// Show link tv
App.show_link_tv = () => {
  App.msg_link_tv.show()
}

// Submit link tv
App.link_tv_submit = () => {
  App.link_media_submit(`tv`)
}

// Checks if tv is abled to be synced with another user
App.can_sync_tv = () => {
  if (!App.room_state.tv_enabled) {
    return false
  }

  if (App.loaded_tv.type === `youtube`) {
    if (!App.youtube_tv_player) {
      return false
    }
  }
  else if (App.loaded_tv.type === `video`) {
    if (!DOM.el(`#media_video_tv`)) {
      return false
    }
  }
  else {
    return false
  }

  return true
}

// Sends a request to the server to send a request to the user to report video progress
App.sync_tv = (username) => {
  if (!App.can_sync_tv()) {
    return
  }

  if (!App.user_is_online_by_username(username)) {
    return
  }

  App.socket_emit(`sync_tv`, {
    username,
    tv_source: App.loaded_tv.source,
  })
}

// Responds to a tv sync request to send it back to a user
App.report_tv_progress = (data) => {
  if (!App.can_sync_tv()) {
    return
  }

  if (App.loaded_tv.source !== data.tv_source) {
    return
  }

  let ttype = App.loaded_tv.type
  let progress

  if (ttype === `youtube`) {
    progress = Math.round(App.youtube_tv_player.getCurrentTime())
  }
  else if (ttype === `video`) {
    progress = Math.round(DOM.el(`#media_video_tv`).currentTime)
  }

  if (progress) {
    App.socket_emit(`report_tv_progress`, {
      requester: data.requester,
      progress,
      type: ttype,
    })

    App.show_room_notification(
      data.requester_username,
      `${data.requester_username} synced their tv with yours`,
    )
  }
}

// After the server sends a user's tv progress response
App.receive_tv_progress = (data) => {
  if (!App.can_sync_tv()) {
    return
  }

  if (data.type === `youtube`) {
    if (App.loaded_tv.type !== `youtube`) {
      return
    }

    let id = App.utilz.get_youtube_id(App.loaded_tv.source)

    if (id[0] === `video`) {
      App.youtube_tv_player.loadVideoById({
        videoId: id[1],
        startSeconds: data.progress,
      })
    }
  }
  else if (data.type === `video`) {
    if (App.loaded_tv.type !== `video`) {
      return
    }

    DOM.el(`#media_video_tv`).currentTime = data.progress
    DOM.el(`#media_video_tv`).play()
  }
}

// Shows the window to add a comment to a video upload
App.show_tv_upload_comment = (file, type) => {
  App.show_upload_comment(`tv`, file, type)
}

// Processes tv upload comment
App.process_tv_upload_comment = () => {
  App.process_media_upload_comment(`tv`)
}

// Setups the upload tv comment window
App.setup_tv_upload_comment = () => {
  let video = DOM.el(`#tv_upload_comment_preview`)

  DOM.ev(video, `loadedmetadata`, () => {
    video.currentTime = 0
    video.play()
    video.pause()
  })

  DOM.ev(video, `error`, () => {
    DOM.hide(video)
    DOM.show(`#tv_upload_comment_feedback`)
  })

  DOM.ev(DOM.el(`#tv_upload_comment_change`), `click`, () => {
    if (App.tv_upload_comment_type === `upload`) {
      App.msg_tv_upload_comment.close()
      App.show_upload_tv()
    }
    else if (App.tv_upload_comment_type === `capture`) {
      App.msg_tv_upload_comment.close()
      App.screen_capture()
    }
  })

  DOM.ev(DOM.el(`#tv_upload_comment_submit`), `click`, () => {
    App.process_tv_upload_comment()
  })
}

// Trigger upload tv picker
App.show_upload_tv = () => {
  App.upload_media = `tv`
  App.trigger_dropzone()
}

// Setup screen capture
App.setup_screen_capture = () => {
  DOM.ev(DOM.el(`#screen_capture_options_container`), `click`, (e) => {
    let el = e.target.closest(`.screen_capture_duration`)

    if (el) {
      let seconds = parseInt(el.dataset.seconds)
      App.msg_screen_capture_options.close()
      App.start_screen_capture(seconds)
    }
  })
}

// Show screen capture options
App.screen_capture = () => {
  App.msg_screen_capture_options.show()
}

// Start capturing the screen and upload it as tv
App.start_screen_capture = async (seconds) => {
  if (!seconds) {
    return
  }

  let stream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: {mediaSource: `screen`},
  })

  let recorded_chunks = []
  App.screen_capture_recorder = new MediaRecorder(stream)

  App.screen_capture_recorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recorded_chunks.push(e.data)
    }
  }

  App.screen_capture_recorder.onstop = () => {
    for (let track of stream.getTracks()) {
      track.stop()
    }

    let blob = new Blob(recorded_chunks, {
      type: `video/mp4`,
    })

    blob.name = `capture.mp4`
    App.show_tv_upload_comment(blob, `capture`)
    recorded_chunks = []
  }

  App.screen_capture_popup = App.show_action_popup({
    message: `Close this to stop capture`,
    title: `Screen Capture`,
    on_x_button_click: () => {
      App.stop_screen_capture()
    },
  })

  App.screen_capture_recorder.start(200)

  App.screen_capture_timeout = setTimeout(() => {
    App.stop_screen_capture()
  }, seconds * 1000)
}

// Stop screen capture
App.stop_screen_capture = () => {
  clearTimeout(App.screen_capture_timeout)
  App.screen_capture_popup.close()
  App.screen_capture_recorder.stop()
}

// Show tv loaded
App.show_tv_loaded = () => {
  App.show_media_loaded(App.loaded_tv.id)
}