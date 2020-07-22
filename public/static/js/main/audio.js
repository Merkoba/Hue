// Plays a sound notification depending on the type
Hue.sound_notify = function (type) {
  if (Hue.screen_locked) {
    return
  }

  if (Date.now() - Hue.last_audio_date < Hue.audio_min_delay) {
    return
  }
  
  let sound

  if (type === "message") {
    if (!Hue.get_setting("beep_on_messages")) {
      return false
    }

    sound = "pup"
  } else if (type === "media_change") {
    if (!Hue.get_setting("beep_on_media_change")) {
      return false
    }

    sound = "pup"
  } else if (type === "highlight") {
    if (!Hue.get_setting("beep_on_highlights")) {
      return false
    }

    sound = "highlight"
  } else if (type === "join") {
    if (!Hue.get_setting("beep_on_user_joins")) {
      return false
    }

    sound = "join"
  } else {
    return false
  }

  Hue.play_audio(sound)
  Hue.last_audio_date = Date.now()
}

// Plays a sound
Hue.play_audio = function (what) {
  $(`#audio_${what}`)[0].play()
}

Hue.create_audio_players = function () {
  let s = `
    <audio id='audio_pup' src='/static/_audio/pup.mp3?version=1' preload="auto"></audio>
    <audio id='audio_pup2' src='/static/_audio/pup2.mp3?version=1' preload="auto"></audio>
    <audio id='audio_join' src='/static/_audio/join.mp3?version=2' preload="auto"></audio>
    <audio id='audio_highlight' src='/static/_audio/highlight.mp3?version=1' preload="auto"></audio>`
  
  $("#audio_players").html(s)
}