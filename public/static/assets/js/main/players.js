// Loads YouTube script or creates players
App.load_youtube = async (what = ``) => {
  if (App.youtube_loaded) {
    if (
      App.youtube_tv_player_requested &&
      App.youtube_tv_player === undefined
    ) {
      App.create_youtube_tv_player()
    }

    return
  }

  if (App.youtube_loading) {
    return
  }

  App.youtube_loading = true
  await App.load_script(`https://www.youtube.com/iframe_api`)
  App.youtube_loaded = true
}

// Create tv YouTube player
App.create_youtube_tv_player = () => {
  App.youtube_tv_player_requested = false

  let html = `<div id='media_youtube_tv' class='video_frame'></div>`
  DOM.el(`#media_youtube_tv_container`).innerHTML = html
  App.add_media_info(`media_youtube_tv_container`)

  App.yt_tv_player = new YT.Player(`media_youtube_tv`, {
    events: {
      onReady: App.on_youtube_tv_player_ready,
    },
    playerVars: {
      iv_load_policy: 3,
      rel: 0,
      width: 640,
      height: 360,
      autoplay: 0,
    },
  })
}

// This gets executed when the YouTube iframe API is ready
onYouTubeIframeAPIReady = () => {
  if (App.youtube_tv_player_requested) {
    App.create_youtube_tv_player()
  }
}

// This gets executed when the tv YouTube player is ready
App.on_youtube_tv_player_ready = () => {
  App.youtube_tv_player = App.yt_tv_player

  if (App.youtube_tv_player_request) {
    App.change_media(App.youtube_tv_player_request)
    App.youtube_tv_player_request = false
  }
}

// Loads the Soundcloud script and creates players
App.start_soundcloud = async () => {
  if (App.soundcloud_loaded) {
    if (
      App.soundcloud_tv_player_requested &&
      App.soundcloud_tv_player === undefined
    ) {
      App.create_soundcloud_tv_player()
    }
  }

  if (App.soundcloud_loading) {
    return
  }

  App.soundcloud_loading = true
  await App.load_script(`https://w.soundcloud.com/player/api.js`)
  App.soundcloud_loaded = true

  if (App.soundcloud_tv_player_requested) {
    App.create_soundcloud_tv_player()
  }
}

// Creates the tv Soundcloud player
App.create_soundcloud_tv_player = () => {
  App.soundcloud_tv_player_requested = false

  try {
    let src =
      `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/301986536`

    DOM.el(`#media_soundcloud_tv_container`)
      .innerHTML = `<iframe width="640px" height="360px"
        id='media_soundcloud_tv' class='video_frame' src='${src}'></iframe>`

    App.add_media_info(`media_soundcloud_tv_container`)

    let _soundcloud_tv_player = SC.Widget(`media_soundcloud_tv`)

    _soundcloud_tv_player.bind(SC.Widget.Events.READY, () => {
      App.soundcloud_tv_player = _soundcloud_tv_player

      if (App.soundcloud_tv_player_request) {
        App.change_media(App.soundcloud_tv_player_request)
        App.soundcloud_tv_player_request = false
      }
    })
  }
  catch (err) {
    console.error(`Soundcloud failed to load`)
  }
}

// Centralized function to request media player creation
// For instance, if there's a YouTube tv change,
// if the YouTube player is not created, this function gets triggered
// Then the respective script gets loaded if it's not loaded yet,
// and the player gets created
// A change event is called after player creation
App.request_media = (player, args) => {
  App[`${player}_requested`] = true
  App[`${player}_request`] = args

  if (player === `youtube_tv_player`) {
    App.load_youtube()
  }
  else if (player === `twitch_tv_player`) {
    App.start_twitch()
  }
  else if (player === `soundcloud_tv_player`) {
    App.start_soundcloud()
  }
}

// Function to add a frame info after creating a player
App.add_media_info = (container_id) => {
  App.append_media_info(`#${container_id}`, `tv`)
}

// Loads Twitch script and creates player
App.start_twitch = async () => {
  if (App.twitch_loaded) {
    if (App.twitch_tv_player_requested && App.twitch_tv_player === undefined) {
      App.create_twitch_tv_player()
    }

    return
  }

  if (App.twitch_loading) {
    return
  }

  App.twitch_loading = true

  await App.load_script(`https://player.twitch.tv/js/embed/v1.js`)

  App.twitch_loaded = true

  if (App.twitch_tv_player_requested) {
    App.create_twitch_tv_player()
  }
}

// Creates the tv Twitch player
App.create_twitch_tv_player = () => {
  App.twitch_tv_player_requested = false

  let c = App.current_tv()
  let channel = `dummy`

  if (c.type === `twitch`) {
    channel = App.utilz.get_twitch_id(c.source)[1]
  }

  try {
    let twch_tv_player = new Twitch.Player(`media_twitch_tv_container`, {
      width: 640,
      height: 360,
      autoplay: false,
      channel,
    })

    DOM.ev(twch_tv_player, Twitch.Player.READY, () => {
      App.twitch_tv_player = twch_tv_player

      let iframe = DOM.el(`#media_twitch_tv_container iframe`)
      iframe.id = `media_twitch_tv`
      iframe.classList.add(`video_frame`)
      App.add_media_info(`media_twitch_tv_container`)

      if (App.twitch_tv_player_request) {
        App.change_media(App.twitch_tv_player_request)
        App.twitch_tv_player_request = false
      }
    })
  }
  catch (err) {
    console.error(`Twitch failed to load`)
  }
}