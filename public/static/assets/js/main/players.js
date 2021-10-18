// Loads YouTube script or creates players
Hue.load_youtube = async function () {
  if (Hue.youtube_loaded) {
    if (
      Hue.youtube_player_requested &&
      Hue.youtube_player === undefined
    ) {
      Hue.create_youtube_player()
    }

    return false
  }

  if (Hue.youtube_loading) {
    return false
  }

  Hue.youtube_loading = true

  await Hue.load_script("https://www.youtube.com/iframe_api")

  Hue.youtube_loaded = true
}

// Create tv YouTube player
Hue.create_youtube_player = function () {
  Hue.youtube_player_requested = false

  let html = "<div id='media_youtube_video' class='video_frame'></div>"
  Hue.el("#media_youtube_video_container").innerHTML = html
  Hue.add_media_info("media_youtube_video_container")

  Hue.yt_player = new YT.Player("media_youtube_video", {
    events: {
      onReady: Hue.on_youtube_player_ready,
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
onYouTubeIframeAPIReady = function () {
  if (Hue.youtube_player_requested) {
    Hue.create_youtube_player()
  }
}

// This gets executed when the tv YouTube player is ready
Hue.on_youtube_player_ready = function () {
  this.clear_activity_bar_items
  Hue.youtube_player = Hue.yt_player

  Hue.youtube_player.addEventListener("onStateChange", function (e) {
    if (e.data === 5) {
      if (Hue.youtube_video_play_on_queue) {
        Hue.youtube_player.playVideo()
      }
    }
  })

  if (Hue.youtube_player_request) {
    Hue.change(Hue.youtube_player_request)
    Hue.youtube_player_request = false
  }
}

// Loads the Soundcloud script and creates players
Hue.start_soundcloud = async function () {
  if (Hue.soundcloud_loaded) {
    if (
      Hue.soundcloud_player_requested &&
      Hue.soundcloud_player === undefined
    ) {
      Hue.create_soundcloud_player()
    }
  }

  if (Hue.soundcloud_loading) {
    return false
  }

  Hue.soundcloud_loading = true
  await Hue.load_script("https://w.soundcloud.com/player/api.js")
  Hue.soundcloud_loaded = true

  if (Hue.soundcloud_player_requested) {
    Hue.create_soundcloud_player()
  }
}

// Creates the tv Soundcloud player
Hue.create_soundcloud_player = function () {
  Hue.soundcloud_player_requested = false

  try {
    let src =
      "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/301986536"

    Hue.el("#media_soundcloud_video_container")
      .innerHTML = `<iframe width="640px" height="360px"
        id='media_soundcloud_video' class='video_frame' src='${src}'></iframe>`

    Hue.add_media_info("media_soundcloud_video_container")

    let _soundcloud_player = SC.Widget("media_soundcloud_video")

    _soundcloud_player.bind(SC.Widget.Events.READY, function () {
      Hue.soundcloud_player = _soundcloud_player

      if (Hue.soundcloud_player_request) {
        Hue.change(Hue.soundcloud_player_request)
        Hue.soundcloud_player_request = false
      }
    })
  } catch (err) {
    console.error("Soundcloud failed to load")
  }
}

// Centralized function to request media player creation
// For instance, if there's a YouTube tv change,
// if the YouTube player is not created, this function gets triggered
// Then the respective script gets loaded if it's not loaded yet,
// and the player gets created
// A change event is called after player creation
Hue.request_media = function (player, args) {
  Hue[`${player}_requested`] = true
  Hue[`${player}_request`] = args

  if (player === "youtube_player") {
    Hue.load_youtube()
  } else if (player === "twitch_player") {
    Hue.start_twitch()
  } else if (player === "soundcloud_player") {
    Hue.start_soundcloud()
  }
}

// Function to add a frame info after creating a player
Hue.add_media_info = function (container_id) {
  Hue.append_media_info(`#${container_id}`, "tv")
}

// Loads Twitch script and creates player
Hue.start_twitch = async function () {
  if (Hue.twitch_loaded) {
    if (Hue.twitch_player_requested && Hue.twitch_player === undefined) {
      Hue.create_twitch_player()
    }

    return false
  }

  if (Hue.twitch_loading) {
    return false
  }

  Hue.twitch_loading = true

  await Hue.load_script("https://player.twitch.tv/js/embed/v1.js")

  Hue.twitch_loaded = true

  if (Hue.twitch_player_requested) {
    Hue.create_twitch_player()
  }
}

// Creates the tv Twitch player
Hue.create_twitch_player = function () {
  Hue.twitch_player_requested = false

  let c = Hue.current_tv()
  let channel = "dummy"

  if (c.type === "twitch") {
    channel = Hue.utilz.get_twitch_id(c.source)[1]
  }

  try {
    let twch_player = new Twitch.Player("media_twitch_video_container", {
      width: 640,
      height: 360,
      autoplay: false,
      channel: channel
    })

    twch_player.addEventListener(Twitch.Player.READY, () => {
      Hue.twitch_player = twch_player

      let iframe = Hue.el("#media_twitch_video_container").querySelector("iframe")
      iframe.id = "media_twitch_video"
      iframe.classList.add("video_Frame")
      Hue.add_media_info("media_twitch_video_container")

      if (Hue.twitch_player_request) {
        Hue.change(Hue.twitch_player_request)
        Hue.twitch_player_request = false
      }
    })
  } catch (err) {
    console.error("Twitch failed to load")
  }
}