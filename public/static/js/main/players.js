// Loads YouTube script or creates players
Hue.load_youtube = async function(what="")
{
    if(Hue.youtube_loaded)
    {
        if(Hue.youtube_player_requested && Hue.youtube_player === undefined)
        {
            Hue.create_youtube_player()
        }

        if(Hue.youtube_video_player_requested && Hue.youtube_video_player === undefined)
        {
            Hue.create_youtube_video_player()
        }

        return false
    }

    if(Hue.youtube_loading)
    {
        return false
    }

    Hue.youtube_loading = true

    await Hue.load_script("https://www.youtube.com/iframe_api")

    Hue.youtube_loaded = true
}

// Create radio YouTube player
Hue.create_youtube_player = function()
{
    Hue.youtube_player_requested = false

    let el = $("<div id='youtube_player'></div>")
    $("#media_youtube_audio_container").html(el)

    Hue.yt_player = new YT.Player('youtube_player',
    {
        events:
        {
            onReady: Hue.on_youtube_player_ready
        },
        playerVars:
        {
            iv_load_policy: 3,
            rel: 0,
            width: 640,
            height: 360
        }
    })
}

// Create tv YouTube player
Hue.create_youtube_video_player = function()
{
    Hue.youtube_video_player_requested = false

    let html = "<div id='media_youtube_video' class='video_frame'></div>"
    $("#media_youtube_video_container").html(html)
    Hue.add_media_info("media_youtube_video_container")

    Hue.yt_video_player = new YT.Player('media_youtube_video',
    {
        events:
        {
            onReady: Hue.on_youtube_video_player_ready
        },
        playerVars:
        {
            iv_load_policy: 3,
            rel: 0,
            width: 640,
            height: 360,
            autoplay: 0
        }
    })
}

// This gets executed when the YouTube iframe API is ready
onYouTubeIframeAPIReady = function()
{
    if(Hue.youtube_player_requested)
    {
        Hue.create_youtube_player()
    }

    if(Hue.youtube_video_player_requested)
    {
        Hue.create_youtube_video_player()
    }
}

// This gets executed when the radio YouTube player is ready
Hue.on_youtube_player_ready = function()
{
    Hue.youtube_player = Hue.yt_player

    if(Hue.youtube_player_request)
    {
        Hue.change(Hue.youtube_player_request)
        Hue.youtube_player_request = false
    }
}

// This gets executed when the tv YouTube player is ready
Hue.on_youtube_video_player_ready = function()
{
    Hue.youtube_video_player = Hue.yt_video_player

    Hue.youtube_video_player.addEventListener("onStateChange", function(e)
    {
        if(e.data === 5)
        {
            if(Hue.youtube_video_play_on_queue)
            {
                Hue.youtube_video_player.playVideo()
            }
        }
    })

    if(Hue.youtube_video_player_request)
    {
        Hue.change(Hue.youtube_video_player_request)
        Hue.youtube_video_player_request = false
    }
}

// Loads Twitch script and creates player
Hue.start_twitch = async function()
{
    if(Hue.twitch_loaded)
    {
        if(Hue.twitch_video_player_requested && Hue.twitch_video_player === undefined)
        {
            Hue.create_twitch_video_player()
        }

        return false
    }

    if(Hue.twitch_loading)
    {
        return false
    }

    Hue.twitch_loading = true

    await Hue.load_script("https://player.twitch.tv/js/embed/v1.js")

    Hue.twitch_loaded = true

    if(Hue.twitch_video_player_requested)
    {
        Hue.create_twitch_video_player()
    }
}

// Creates the tv Twitch player
Hue.create_twitch_video_player = function()
{
    Hue.twitch_video_player_requested = false

    try
    {
        let twch_video_player = new Twitch.Player("media_twitch_video_container",
        {
            width: 640,
            height: 360,
            autoplay: false
        })

        twch_video_player.addEventListener(Twitch.Player.READY, () =>
        {
            Hue.twitch_video_player = twch_video_player

            let iframe = $("#media_twitch_video_container").find("iframe").eq(0)
            iframe.attr("id", "media_twitch_video").addClass("video_frame")
            Hue.add_media_info("media_twitch_video_container")

            if(Hue.twitch_video_player_request)
            {
                Hue.change(Hue.twitch_video_player_request)
                Hue.twitch_video_player_request = false
            }
        })
    }

    catch(err)
    {
        console.error("Twitch failed to load")
    }
}

// Loads the Soundcloud script and creates players
Hue.start_soundcloud = async function()
{
    if(Hue.soundcloud_loaded)
    {
        if(Hue.soundcloud_player_requested && Hue.soundcloud_player === undefined)
        {
            Hue.create_soundcloud_player()
        }

        if(Hue.soundcloud_video_player_requested && Hue.soundcloud_video_player === undefined)
        {
            Hue.create_soundcloud_video_player()
        }
    }

    if(Hue.soundcloud_loading)
    {
        return false
    }

    Hue.soundcloud_loading = true

    await Hue.load_script("https://w.soundcloud.com/player/api.js")

    Hue.soundcloud_loaded = true

    if(Hue.soundcloud_player_requested)
    {
        Hue.create_soundcloud_player()
    }

    if(Hue.soundcloud_video_player_requested)
    {
        Hue.create_soundcloud_video_player()
    }
}

// Creates the radio Soundcloud player
Hue.create_soundcloud_player = function()
{
    Hue.soundcloud_player_requested = false

    try
    {
        let src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/301986536'

        $("#media_soundcloud_audio_container").html(`<iframe id='soundcloud_player' src='${src}'></iframe>`)

        let _soundcloud_player = SC.Widget("soundcloud_player")

        _soundcloud_player.bind(SC.Widget.Events.READY, function()
        {
            Hue.soundcloud_player = _soundcloud_player

            if(Hue.soundcloud_player_request)
            {
                Hue.change(Hue.soundcloud_player_request)
                Hue.soundcloud_player_request = false
            }
        })
    }

    catch(err)
    {
        console.error("Soundcloud failed to load")
    }
}

// Creates the tv Soundcloud player
Hue.create_soundcloud_video_player = function()
{
    Hue.soundcloud_video_player_requested = false

    try
    {
        let src = 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/301986536'

        $("#media_soundcloud_video_container").html(`<iframe width="640px" height="360px"
        id='media_soundcloud_video' class='video_frame' src='${src}'></iframe>`)

        Hue.add_media_info("media_soundcloud_video_container")

        let _soundcloud_video_player = SC.Widget("media_soundcloud_video")

        _soundcloud_video_player.bind(SC.Widget.Events.READY, function()
        {
            Hue.soundcloud_video_player = _soundcloud_video_player

            if(Hue.soundcloud_video_player_request)
            {
                Hue.change(Hue.soundcloud_video_player_request)
                Hue.soundcloud_video_player_request = false
            }
        })
    }

    catch(err)
    {
        console.error("Soundcloud failed to load")
    }
}

// Loads Vimeo script and creates player
Hue.start_vimeo = async function()
{
    if(Hue.vimeo_loaded)
    {
        if(Hue.vimeo_video_player_requested && Hue.vimeo_video_player === undefined)
        {
            Hue.create_vimeo_video_player()
        }

        return false
    }
    if(Hue.vimeo_loading)
    {
        return false
    }

    Hue.vimeo_loading = true

    await Hue.load_script("/static/js/libs2/vimeo.player.min.js")

    Hue.vimeo_loaded = true

    if(Hue.vimeo_video_player_requested)
    {
        Hue.create_vimeo_video_player()
    }
}

// Create tv Vimeo player
Hue.create_vimeo_video_player = function()
{
    Hue.vimeo_video_player_requested = false

    let options =
    {
        id: 59777392,
        width: 640,
        loop: false
    }

    let video_player = new Vimeo.Player("media_vimeo_video_container", options)

    video_player.ready()

    .then(()=>
    {
        Hue.vimeo_video_player = video_player

        let iframe = $("#media_vimeo_video_container").find("iframe").eq(0)
        iframe.attr("id", "media_vimeo_video").addClass("video_frame")
        Hue.add_media_info("media_vimeo_video_container")

        if(Hue.vimeo_video_player_request)
        {
            Hue.change(Hue.vimeo_video_player_request)
            Hue.vimeo_video_player_request = false
        }
    })
}

// Centralized function to request media player creation
// For instance, if there's a YouTube tv change,
// if the YouTube player is not created, this function gets triggered
// Then the respective script gets loaded if it's not loaded yet,
// and the player gets created
// A change event is called after player creation
Hue.request_media = function(player, args)
{
    Hue[`${player}_requested`] = true
    Hue[`${player}_request`] = args

    if(player === "youtube_player" || player === "youtube_video_player")
    {
        Hue.load_youtube()
    }

    else if(player === "soundcloud_player" || player === "soundcloud_video_player")
    {
        Hue.start_soundcloud()
    }

    else if(player === "twitch_video_player")
    {
        Hue.start_twitch()
    }

    else if(player === "vimeo_video_player")
    {
        Hue.start_vimeo()
    }
}

// Loads the HLS player for the <video> player
// Returns a promise
Hue.load_hls = async function()
{
    if(Hue.hls_loading)
    {
        return false
    }

    Hue.hls_loading = true

    return new Promise(async (resolve, reject) =>
    {
        await Hue.load_script("/static/js/libs2/hls.js")
        resolve()
    })
}

// Starts the HLS player for the <video> player
Hue.start_hls = async function()
{
    if(!Hue.hls_loading)
    {
        await Hue.load_hls()
    }

    Hue.hls = new Hls(
    {
        maxBufferSize: 5*1000*1000,
        maxBufferLength: 10
    })
}

// Function to add a frame info after creating a player
Hue.add_media_info = function(container_id)
{
    let html = "<div class='media_info dynamic_title'></div>"
    $(`#${container_id}`).append(html)
}