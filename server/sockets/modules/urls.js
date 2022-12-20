module.exports = function (Hue) {
  // Checks if link data is available on Redis or tries to fetch metadata
  Hue.handler.process_message_links = async function (message) {
    let urls = Hue.utilz.get_urls(message)

    if (urls.length !== 1) {
      return {}
    }

    let url = urls[0]

    if (url.includes("\"") || url.includes("'") || url.includes("*")) {
      return {}
    }

    if (Hue.vars.redis_client_ready) {
      let reply = await Hue.vars.redis_client.HGETALL(`hue_link_${url}`)

      if (Object.keys(reply).length) {
        if (Date.now() - reply.date > Hue.sconfig.redis_max_link_age) {
          return await Hue.handler.get_link_metadata(url)
        } else {
          return reply
        }
      } else {
        return await Hue.handler.get_link_metadata(url)
      }
    } else {
      return await Hue.handler.get_link_metadata(url)
    }
  }

  // Tries to fetch a site's metadata
  Hue.handler.get_link_metadata = async function (url, callback) {
    let response = {
      title: "",
      description: "",
      image: "",
      url: url,
    }

    if (!Hue.utilz.is_url(url)) {
      return response
    }

    if (url === "http://localhost" || url === "https://localhost") {
      return response
    }

    let extension = Hue.utilz.get_extension(url).toLowerCase()

    if (extension) {
      if (extension !== "html" && extension !== "php") {
        return response
      }
    }

    try {
      let res = await Hue.vars.fetch_2(url, {timeout: Hue.sconfig.link_fetch_timeout})
      let body = await res.text()

      let $ = Hue.vars.cheerio.load(body)

      if ($("title").length > 0) {
        response.title = Hue.utilz.single_space($("title").eq(0).text()) || ""
      } else if ($("meta[property=\"og:title\"]").length > 0) {
        response.title =
        Hue.utilz.single_space(
            $("meta[property=\"og:title\"]").eq(0).attr("content")
          ) || ""
      }

      let title_add_dots =
        response.title.length > Hue.sconfig.link_max_title_length

      if (title_add_dots) {
        response.title =
          response.title.substring(0, Hue.sconfig.link_max_title_length).trim() +
          "..."
      }

      response.description =
        Hue.utilz.single_space(
          $("meta[property=\"og:description\"]").eq(0).attr("content")
        ) || ""

      let description_add_dots =
        response.description.length > Hue.sconfig.link_max_description_length

      if (description_add_dots) {
        response.description =
          response.description
            .substring(0, Hue.sconfig.link_max_description_length)
            .trim() + "..."
      }

      response.image =
        $("meta[property=\"og:image\"]").eq(0).attr("content") || ""

      if (response.image.length > Hue.sconfig.link_max_image_length) {
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

      if (Hue.vars.redis_client_ready) {
        let obj = {
          "title": response.title,
          "description": response.description,
          "image": response.image,
          "url": response.url,
          "date": Date.now()
        }

        Hue.vars.redis_client.HSET(`hue_link_${url}`, obj)
      }
    } catch (err) {
      if (Hue.vars.redis_client_ready) {
        let obj = {
          "title": response.title,
          "description": response.description,
          "image": response.image,
          "url": response.url,
          "date": Date.now()
        }

        Hue.vars.redis_client.HSET(`hue_link_${url}`, obj)
      }
    }

    return response
  }
}