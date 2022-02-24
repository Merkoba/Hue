module.exports = function (Hue) {
  // Tries to check if the data received is valid
  // This is done by checking some limits
  Hue.handler.check_data = function (data) {
    try {
      let m = data.server_method_name

      if (m === undefined) {
        return false
      }

      let keys = Object.keys(data)

      if (keys.length > Hue.sconfig.data_max_items) {
        return false
      }

      for (key of keys) {
        let d = data[key]
        let td = typeof d

        if (td === "function") {
          return false
        }

        if (m === "slice_upload") {
          if (key === "data") {
            continue
          }
        }

        let s = JSON.stringify(d)

        if (td === "number") {
          if (s.length > Hue.sconfig.data_items_max_number_length) {
            return false
          }
        } else { 
          if (s.length > Hue.sconfig.data_items_max_string_length) {
            return false
          }
        }
      }

      return true
    } catch (err) {
      return false
    }
  }
}
