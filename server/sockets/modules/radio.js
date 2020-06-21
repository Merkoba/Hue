module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Handles radio source changes
  handler.public.change_radio_source = async function (socket, data) {
    if (data.src === undefined) {
      return handler.get_out(socket)
    }

    if (data.src.length === 0) {
      return handler.get_out(socket)
    }

    if (data.src.length > config.max_media_source_length) {
      return handler.get_out(socket)
    }

    if (data.query) {
      if (data.query.length > config.safe_limit_1) {
        return handler.get_out(socket)
      }
    }

    if (data.comment) {
      if (data.comment.length > config.max_media_comment_length) {
        return handler.get_out(socket)
      }
    }

    if (data.src !== utilz.clean_string2(data.src)) {
      return handler.get_out(socket)
    }

    if (!handler.check_media_permission(socket, "radio")) {
      return false
    }

    data.src = data.src.replace(
      /youtu\.be\/(\w{11})/,
      "www.youtube.com/watch?v=$1"
    )
    data.setter = socket.hue_username

    if (
      vars.rooms[socket.hue_room_id].current_radio_source === data.src ||
      vars.rooms[socket.hue_room_id].current_radio_query === data.src
    ) {
      handler.user_emit(socket, "same_radio", {})
      return false
    }

    if (
      Date.now() - vars.rooms[socket.hue_room_id].last_radio_change <
      config.radio_change_cooldown
    ) {
      handler.user_emit(socket, "radio_cooldown_wait", {})
      return false
    }

    if (data.src === "default") {
      handler.do_change_radio_source(socket, data)
      return
    }

    if (utilz.is_url(data.src)) {
      if (handler.check_domain_list("radio", data.src)) {
        return false
      }

      if (data.src.includes("youtube.com") || data.src.includes("youtu.be")) {
        if (!config.youtube_enabled) {
          return false
        }

        let id = utilz.get_youtube_id(data.src)

        if (id) {
          let st
          let pid

          if (id[0] === "video") {
            st = "videos"
            pid = id[1]
          } else if (id[0] === "list") {
            st = "playlists"
            pid = id[1][0]
          } else {
            handler.user_emit(socket, "song_not_found", {})
            return false
          }

          vars
            .fetch_2(
              `https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title))&part=snippet&key=${sconfig.youtube_api_key}`
            )

            .then(function (res) {
              return res.json()
            })

            .then(function (response) {
              if (response.items !== undefined && response.items.length > 0) {
                data.type = "youtube"
                data.title = response.items[0].snippet.title
                handler.do_change_radio_source(socket, data)
              } else {
                handler.user_emit(socket, "song_not_found", {})
              }
            })

            .catch((err) => {
              logger.log_error(err)
            })
        } else {
          handler.user_emit(socket, "song_not_found", {})
          return false
        }
      } else if (data.src.includes("soundcloud.com")) {
        data.src = data.src.split("#t=")[0]

        if (!config.soundcloud_enabled) {
          return
        }

        vars.soundcloud.get(
          `/resolve?url=${encodeURIComponent(data.src)}`,
          function (err, track) {
            if (err) {
              handler.user_emit(socket, "song_not_found", {})
              logger.log_error(err)
              return false
            } else {
              data.type = "soundcloud"

              data.title = track.title ? track.title : track.username

              if (!data.title) {
                data.title = data.src
              }

              handler.do_change_radio_source(socket, data)
            }
          }
        )
      } else {
        let extension = utilz.get_extension(data.src).toLowerCase()

        if (extension) {
          if (!utilz.audio_extensions.includes(extension)) {
            return false
          }
        }

        data.type = "audio"
        data.title = ""
        handler.do_change_radio_source(socket, data)
      }
    } else if (data.src === "restart" || data.src === "reset") {
      handler.room_emit(socket, "restarted_radio_source", {
        setter: socket.hue_username,
        date: Date.now(),
        comment: data.comment || "",
      })
    } else {
      if (!config.youtube_enabled) {
        return
      }

      vars
        .fetch_2(
          `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(
            data.src
          )}&type=video&fields=items(id,snippet(title))&part=snippet&maxResults=10&videoEmbeddable=true&key=${
            sconfig.youtube_api_key
          }`
        )
        .then(function (res) {
          return res.json()
        })

        .then(function (response) {
          if (response.items !== undefined && response.items.length > 0) {
            for (let item of response.items) {
              if (
                item === undefined ||
                item.id === undefined ||
                item.id.videoId === undefined
              ) {
                continue
              }

              data.type = "youtube"
              data.query = data.src
              data.src = `https://www.youtube.com/watch?v=${item.id.videoId}`
              data.title = response.items[0].snippet.title
              handler.do_change_radio_source(socket, data)
              return
            }

            handler.user_emit(socket, "song_not_found", {})
            return false
          } else {
            handler.user_emit(socket, "song_not_found", {})
          }
        })

        .catch((err) => {
          logger.log_error(err)
        })
    }
  }

  // Completes radio source changes
  handler.do_change_radio_source = function (socket, data) {
    let radioinfo = {}
    let date = Date.now()
    let query = data.query || ""
    let comment = data.comment || ""

    if (data.query === undefined) {
      data.query = ""
    }

    if (data.src === "default") {
      radioinfo.radio_type = "audio"
      radioinfo.radio_source = ""
      radioinfo.radio_title = ""
      radioinfo.radio_query = "default"
    } else {
      radioinfo.radio_type = data.type
      radioinfo.radio_source = data.src
      radioinfo.radio_title = vars.he.decode(data.title)
      radioinfo.radio_query = query
    }

    radioinfo.radio_setter = data.setter
    radioinfo.radio_date = date
    radioinfo.radio_comment = comment

    let user_id = socket.hue_user_id

    if (!radioinfo.radio_setter) {
      user_id = ""
    }

    let radio_id = handler.generate_message_id()
    let room = vars.rooms[socket.hue_room_id]

    db_manager.update_room(socket.hue_room_id, {
      radio_id: radio_id,
      radio_user_id: user_id,
      radio_type: radioinfo.radio_type,
      radio_source: radioinfo.radio_source,
      radio_title: radioinfo.radio_title,
      radio_setter: radioinfo.radio_setter,
      radio_date: radioinfo.radio_date,
      radio_query: radioinfo.radio_query,
      radio_comment: radioinfo.radio_comment,
    })

    handler.room_emit(socket, "changed_radio_source", {
      id: radio_id,
      user_id: user_id,
      type: radioinfo.radio_type,
      source: radioinfo.radio_source,
      title: radioinfo.radio_title,
      setter: radioinfo.radio_setter,
      date: radioinfo.radio_date,
      query: radioinfo.radio_query,
      comment: radioinfo.radio_comment,
    })

    if (room.log) {
      let message = {
        id: radio_id,
        type: "radio",
        date: date,
        data: {
          user_id: user_id,
          type: radioinfo.radio_type,
          source: radioinfo.radio_source,
          title: radioinfo.radio_title,
          setter: radioinfo.radio_setter,
          query: radioinfo.radio_query,
          comment: radioinfo.radio_comment,
        },
      }

      handler.push_log_message(socket, message)
    }

    room.current_radio_id = radio_id
    room.current_radio_user_id = user_id
    room.current_radio_source = radioinfo.radio_source
    room.current_radio_query = radioinfo.radio_query
    room.last_radio_change = Date.now()
    room.modified = Date.now()
  }

  // Handles radio mode changes
  handler.public.change_radio_mode = function (socket, data) {
    if (!handler.check_op_permission(socket, "media")) {
      return handler.get_out(socket)
    }

    if (
      data.what !== "enabled" &&
      data.what !== "disabled" &&
      data.what !== "locked"
    ) {
      return handler.get_out(socket)
    }

    vars.rooms[socket.hue_room_id].radio_mode = data.what

    db_manager.update_room(socket.hue_room_id, {
      radio_mode: data.what,
    })

    handler.room_emit(socket, "room_radio_mode_change", {
      what: data.what,
      username: socket.hue_username,
    })

    handler.push_admin_log_message(
      socket,
      `changed the radio mode to "${data.what}"`
    )
  }
}
