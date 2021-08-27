// Loads YouTube script or creates players
Hue.load_youtube = async function (what = "") {
  if (Hue.youtube_loaded) {
    if (
      Hue.youtube_video_player_requested &&
      Hue.youtube_video_player === undefined
    ) {
      Hue.create_youtube_video_player()
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
Hue.create_youtube_video_player = function () {
  Hue.youtube_video_player_requested = false

  let html = "<div id='media_youtube_video' class='video_frame'></div>"
  $("#media_youtube_video_container").html(html)
  Hue.add_media_info("media_youtube_video_container")

  Hue.yt_video_player = new YT.Player("media_youtube_video", {
    events: {
      onReady: Hue.on_youtube_video_player_ready,
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
  if (Hue.youtube_video_player_requested) {
    Hue.create_youtube_video_player()
  }
}

// This gets executed when the tv YouTube player is ready
Hue.on_youtube_video_player_ready = function () {
  this.clear_activity_bar_items
  Hue.youtube_video_player = Hue.yt_video_player

  Hue.youtube_video_player.addEventListener("onStateChange", function (e) {
    if (e.data === 5) {
      if (Hue.youtube_video_play_on_queue) {
        Hue.youtube_video_player.playVideo()
      }
    }
  })

  if (Hue.youtube_video_player_request) {
    Hue.change(Hue.youtube_video_player_request)
    Hue.youtube_video_player_request = false
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

  if (player === "youtube_video_player") {
    Hue.load_youtube()
  } else if (player === "twitch_video_player") {
    Hue.start_twitch()
  }
}

// Function to add a frame info after creating a player
Hue.add_media_info = function (container_id) {
  $(`#${container_id}`).append(Hue.get_media_info_html("tv"))
}

// Loads Twitch script and creates player
Hue.start_twitch = async function () {
  if (Hue.twitch_loaded) {
    if (Hue.twitch_video_player_requested && Hue.twitch_video_player === undefined) {
      Hue.create_twitch_video_player()
    }

    return false
  }

  if (Hue.twitch_loading) {
    return false
  }

  Hue.twitch_loading = true

  await Hue.load_script("https://player.twitch.tv/js/embed/v1.js")

  Hue.twitch_loaded = true

  if (Hue.twitch_video_player_requested) {
    Hue.create_twitch_video_player()
  }
}

// Creates the tv Twitch player
Hue.create_twitch_video_player = function () {
  Hue.twitch_video_player_requested = false

  let c = Hue.current_tv()
  let channel = "dummy"

  if (c.type === "twitch") {
    channel = Hue.utilz.get_twitch_id(c.source)[1]
  }

  try {
    let twch_video_player = new Twitch.Player("media_twitch_video_container", {
      width: 640,
      height: 360,
      autoplay: false,
      channel: channel
    })

    twch_video_player.addEventListener(Twitch.Player.READY, () => {
      Hue.twitch_video_player = twch_video_player

      let iframe = $("#media_twitch_video_container").find("iframe").eq(0)
      iframe.attr("id", "media_twitch_video").addClass("video_frame")
      Hue.add_media_info("media_twitch_video_container")

      if (Hue.twitch_video_player_request) {
        Hue.change(Hue.twitch_video_player_request)
        Hue.twitch_video_player_request = false
      }
    })
  } catch (err) {
    console.error("Twitch failed to load")
  }
}