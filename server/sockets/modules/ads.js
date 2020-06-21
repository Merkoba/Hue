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
  // Charges ads
  // When they reach the threshold they are fired
  handler.charge_ads = function (room_id) {
    try {
      if (config.image_ads_enabled) {
        vars.rooms[room_id].image_ad_charge += 1

        if (vars.rooms[room_id].image_ad_charge >= config.image_ads_threshold) {
          handler.attempt_show_image_ad(room_id, function (res) {
            if (res) {
              vars.rooms[room_id].image_ad_charge = 0
            } else {
              vars.rooms[room_id].image_ad_charge = config.image_ads_threshold
            }
          })
        }
      }

      if (config.text_ads_enabled) {
        vars.rooms[room_id].text_ad_charge += 1

        if (vars.rooms[room_id].text_ad_charge >= config.text_ads_threshold) {
          handler.attempt_show_text_ad(room_id, function (res) {
            if (res) {
              vars.rooms[room_id].text_ad_charge = 0
            } else {
              vars.rooms[room_id].text_ad_charge = config.text_ads_threshold
            }
          })
        }
      }
    } catch (err) {
      logger.log_error(err)
    }
  }

  // Tries to show an image ad
  handler.attempt_show_image_ad = function (room_id, callback) {
    try {
      let room = vars.rooms[room_id]

      if (room.image_mode !== "enabled") {
        return callback(false)
      }

      if (
        Date.now() - room.last_image_change <
        config.image_ads_min_image_change
      ) {
        return callback(false)
      }

      vars.fs.readdir(
        vars.path.join(vars.root_path, config.image_ads_path),
        function (err, files) {
          if (err) {
            logger.log_error(err)
            return false
          }

          if (!files) {
            return callback(true)
          }

          files = files.filter((x) => !x.startsWith("."))

          let index = utilz.get_random_int(0, files.length - 1)
          let file = files[index]
          let image_path = vars.path.join(config.image_ads_public_path, file)

          if (image_path === room.current_image_source) {
            if (files.length === 1) {
              return callback(true)
            } else {
              index = utilz.get_random_int(0, files.length - 1, index)

              file = files[index]

              image_path = vars.path.join(config.image_ads_public_path, file)

              if (image_path === room.current_image_source) {
                return callback(false)
              }
            }
          }

          let obj = {}

          obj.src = image_path
          obj.setter = config.image_ads_setter
          obj.size = 0
          obj.type = "link"

          handler.change_image(room_id, obj)

          return callback(true)
        }
      )
    } catch (err) {
      logger.log_error(err)
      return false
    }
  }

  // Tries to show a text ad
  handler.attempt_show_text_ad = function (room_id, callback) {
    try {
      vars.fs.readFile(
        vars.path.join(vars.root_path, config.text_ads_json_location),
        function (err, content) {
          if (err) {
            logger.log_error(err)
            return false
          }

          if (!content) {
            return callback(true)
          }

          let ads = JSON.parse(content)

          if (ads.length === 0) {
            return callback(true)
          }

          let index = utilz.get_random_int(0, ads.length - 1)
          let ad = ads[index]

          handler.send_announcement_to_room(room_id, ad)

          return callback(true)
        }
      )
    } catch (err) {
      logger.log_error(err)
      return false
    }
  }
}
