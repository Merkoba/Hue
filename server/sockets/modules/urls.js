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
  // Checks if link data is available on Redis or tries to fetch metadata
  handler.process_message_links = function (message, callback) {
    let urls = utilz.get_urls(message)

    if (urls.length !== 1) {
      return callback({})
    }

    let url = urls[0]

    if (url.includes('"') || url.includes("'") || url.includes("*")) {
      return callback({})
    }

    if (vars.redis_client_ready) {
      vars.redis_client.hgetall(`hue_link_${url}`, function (err, reply) {
        if (err) {
          return callback({})
        }

        if (reply) {
          if (Date.now() - reply.date > sconfig.redis_max_link_age) {
            return handler.get_link_metadata(url, callback)
          } else {
            return callback(reply)
          }
        } else {
          return handler.get_link_metadata(url, callback)
        }
      })
    } else {
      return handler.get_link_metadata(url, callback)
    }
  }

  // Tries to fetch a site's metadata
  handler.get_link_metadata = function (url, callback) {
    let response = {
      title: "",
      description: "",
      image: "",
      url: url,
    }

    if (!utilz.is_url(url)) {
      return callback(response)
    }

    if (url === "http://localhost" || url === "https://localhost") {
      return callback(response)
    }

    let extension = utilz.get_extension(url).toLowerCase()

    if (extension) {
      if (extension !== "html" && extension !== "php") {
        return callback(response)
      }
    }

    vars
      .fetch_2(url, {
        timeout: sconfig.link_fetch_timeout,
      })

      .then((res) => {
        return res.text()
      })

      .then((body) => {
        let $ = vars.cheerio.load(body)

        if ($("title").length > 0) {
          response.title = utilz.clean_string2($("title").eq(0).text()) || ""
        } else if ($('meta[property="og:title"]').length > 0) {
          response.title =
            utilz.clean_string2(
              $('meta[property="og:title"]').eq(0).attr("content")
            ) || ""
        }

        let title_add_dots =
          response.title.length > sconfig.link_max_title_length

        if (title_add_dots) {
          response.title =
            response.title.substring(0, sconfig.link_max_title_length).trim() +
            "..."
        }

        response.description =
          utilz.clean_string2(
            $('meta[property="og:description"]').eq(0).attr("content")
          ) || ""

        let description_add_dots =
          response.description.length > sconfig.link_max_description_length

        if (description_add_dots) {
          response.description =
            response.description
              .substring(0, sconfig.link_max_description_length)
              .trim() + "..."
        }

        response.image =
          $('meta[property="og:image"]').eq(0).attr("content") || ""

        if (response.image.length > sconfig.link_max_image_length) {
          response.image = ""
        }

        if (response.image) {
          if (response.image[0] === "/") {
            let ourl = new URL(url)

            if (response.image[1] === "/") {
              response.image = `${ourl.protocol}${response.image}`
            } else {
              response.image = `${ourl.protocol}//${ourl.hostname}${response.image}`
            }
          }
        }

        if (vars.redis_client_ready) {
          vars.redis_client.hmset(
            `hue_link_${url}`,
            "title",
            response.title,
            "description",
            response.description,
            "image",
            response.image,
            "url",
            response.url,
            "date",
            Date.now()
          )
        }

        return callback(response)
      })

      .catch((err) => {
        if (vars.redis_client_ready) {
          vars.redis_client.hmset(
            `hue_link_${url}`,
            "title",
            response.title,
            "description",
            response.description,
            "image",
            response.image,
            "url",
            response.url,
            "date",
            Date.now()
          )
        }

        return callback(response)
      })
  }
}
