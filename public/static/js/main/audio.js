// Plays a sound notification depending on the type
Hue.sound_notify = function (type) {
  let sound

  if (type === "message") {
    if (!Hue.get_setting("beep_on_messages")) {
      return false
    }

    if (Hue.afk) {
      if (Hue.get_setting("afk_disable_messages_beep")) {
        return false
      }
    }

    sound = "pup"
  } else if (type === "media_change") {
    if (!Hue.get_setting("beep_on_media_change")) {
      return false
    }

    if (Hue.afk) {
      if (Hue.get_setting("afk_disable_media_change_beep")) {
        return false
      }
    }

    sound = "pup"
  } else if (type === "highlight") {
    if (!Hue.get_setting("beep_on_highlights")) {
      return false
    }

    if (Hue.afk) {
      if (Hue.get_setting("afk_disable_highlights_beep")) {
        return false
      }
    }

    sound = "highlight"
  } else if (type === "join") {
    if (!Hue.get_setting("beep_on_user_joins")) {
      return false
    }

    if (Hue.afk) {
      if (Hue.get_setting("afk_disable_joins_beep")) {
        return false
      }
    }

    sound = "join"
  } else {
    return false
  }

  Hue.play_audio(sound)
}

// Plays the <audio> radio player
Hue.play_audio = function (what) {
  $(`#audio_${what}`)[0].play()
}
