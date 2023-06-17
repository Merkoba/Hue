module.exports = (App) => {
  // Checks if link data is available on Redis or tries to fetch metadata
  App.handler.process_message_links = async (message) => {
    let urls = App.utilz.get_urls(message)

    if (urls.length !== 1) {
      return {}
    }

    let url = urls[0]

    if (url.includes(`\``) || url.includes(`'`) || url.includes(`*`)) {
      return {}
    }

    if (App.i.redis_client_ready) {
      let reply = await App.i.redis_client.HGETALL(`hue_link_${url}`)

      if (Object.keys(reply).length) {
        if (Date.now() - reply.date > App.sconfig.redis_max_link_age) {
          return await App.handler.get_link_metadata(url)
        }
        else {
          return reply
        }
      }
      else {
        return await App.handler.get_link_metadata(url)
      }
    }
    else {
      return await App.handler.get_link_metadata(url)
    }
  }

  // Tries to fetch a site's metadata
  App.handler.get_link_metadata = async (url, callback) => {
    let response = {
      title: ``,
      description: ``,
      image: ``,
      url: url,
    }

    if (!App.utilz.is_url(url)) {
      return response
    }

    if (url === `http://localhost` || url === `https://localhost`) {
      return response
    }

    let extension = App.utilz.get_extension(url).toLowerCase()

    if (extension) {
      if (extension !== `html` && extension !== `php`) {
        return response
      }
    }

    try {
      let res = await App.vars.fetch(url, {timeout: App.sconfig.link_fetch_timeout})
      let body = await res.text()

      let $ = App.i.cheerio.load(body)

      if ($(`title`).length > 0) {
        response.title = App.utilz.single_space($(`title`).eq(0).text() || ``)
      }
      else if ($(`meta[property="og:title"]`).length > 0) {
        response.title =
        App.utilz.single_space($(`meta[property="og:title"]`).eq(0).attr(`content`) || ``)
      }

      let title_add_dots =
        response.title.length > App.sconfig.link_max_title_length

      if (title_add_dots) {
        response.title =
        response.title.substring(0, App.sconfig.link_max_title_length).trim() +
        `...`
      }

      response.description =
        App.utilz.single_space($(`meta[property="og:description"]`).eq(0).attr(`content`) || ``)

      let description_add_dots =
        response.description.length > App.sconfig.link_max_description_length

      if (description_add_dots) {
        response.description =
          response.description
            .substring(0, App.sconfig.link_max_description_length)
            .trim() + `...`
      }

      response.image = $(`meta[property="og:image"]`).eq(0).attr(`content`) || ``

      if (response.image.length > App.sconfig.link_max_image_length) {
        response.image = ``
      }

      if (response.image) {
        if (response.image[0] === `/`) {
          let ourl = new URL(url)

          if (response.image[1] === `/`) {
            response.image = `${ourl.protocol}${response.image}`
          }
          else {
            response.image = `${ourl.protocol}//${ourl.hostname}${response.image}`
          }
        }
      }

      if (App.i.redis_client_ready) {
        let obj = {
          title: response.title,
          description: response.description,
          image: response.image,
          url: response.url,
          date: Date.now()
        }

        App.i.redis_client.HSET(`hue_link_${url}`, obj)
      }
    }
    catch (err) {
      if (App.i.redis_client_ready) {
        let obj = {
          title: response.title,
          description: response.description,
          image: response.image,
          url: response.url,
          date: Date.now()
        }

        App.i.redis_client.HSET(`hue_link_${url}`, obj)
      }
    }

    return response
  }
}