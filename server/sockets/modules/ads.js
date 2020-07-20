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
      if (config.text_ads_enabled && !vars.rooms[room_id].attempting_text_ad) {
        vars.rooms[room_id].text_ad_charge += 1

        if (vars.rooms[room_id].text_ad_charge >= config.text_ads_threshold) {
          vars.rooms[room_id].attempting_text_ad = true

          handler.attempt_show_text_ad(room_id, function (res) {
            if (res) {
              vars.rooms[room_id].text_ad_charge = 0
            } else {
              vars.rooms[room_id].text_ad_charge = config.text_ads_threshold
            }

            vars.rooms[room_id].attempting_text_ad = false
          })
        }
      }
    } catch (err) {
      logger.log_error(err)
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

          let ads

          try {
            ads = JSON.parse(content)
          } catch (err) {
            logger.log_error(err)
            return false
          }

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
