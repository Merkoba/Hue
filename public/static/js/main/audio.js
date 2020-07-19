// Plays a sound notification depending on the type
Hue.sound_notify = function (type) {
  if (Hue.screen_locked) {
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
}

// Plays a sound
Hue.play_audio = function (what) {
  $(`#audio_${what}`)[0].play()
}
