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
      // Check if YouTube URL
      let yt = [`https://www.youtube.com`, `https://youtu.be`]

      if (yt.some((x) => url.startsWith(x))) {
        let id = App.utilz.get_youtube_id(url)

        if (id) {
          let st
          let pid

          if (id[0] === `video`) {
            st = `videos`
            pid = id[1]
          }
          else if (id[0] === `list`) {
            st = `playlists`
            pid = id[1][0]
          }
          else {
            App.handler.user_emit(socket, `video_not_found`, {})
            return
          }

          let res = await App.vars.fetch(
            `https://www.googleapis.com/youtube/v3/${st}?id=${pid}&fields=items(snippet(title,channelTitle,description,thumbnails))&part=snippet,statistics&key=${App.sconfig.youtube_api_key}`
          )

          res = await res.json()

          if (res.items !== undefined && res.items.length > 0) {
            let title = res.items[0].snippet.title
            let description = res.items[0].snippet.description
            let uploader = res.items[0].snippet.channelTitle
            let thumbnail = res.items[0].snippet.thumbnails.default.url

            response.title = `${title} (${uploader})`
            response.description = description
            response.image = thumbnail

            App.finish_metadata(response)
            return response
          }
        }
      }

      // Do normal URL
      let res = await App.vars.fetch(url, {timeout: App.sconfig.link_fetch_timeout})
      let body = await res.text()

      let $ = App.i.cheerio.load(body)

      if ($(`title`).length > 0) {
        response.title = App.utilz.single_space($(`title`).eq(0).text() || ``)
      }
      else if ($(`meta[property="og:title"]`).length > 0) {
        response.title = App.utilz.single_space($(`meta[property="og:title"]`).eq(0).attr(`content`) || ``)
      }

      response.description =
        App.utilz.single_space($(`meta[property="og:description"]`).eq(0).attr(`content`) || ``)

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

      App.finish_metadata(response)
    }
    catch (err) {
      App.finish_metadata(response)
    }

    return response
  }

  App.finish_metadata = (response) => {
    let title_add_dots = response.title.length > App.sconfig.link_max_title_length

    if (title_add_dots) {
      response.title = response.title.substring(0, App.sconfig.link_max_title_length)
      .trim() + `...`
    }

    let description_add_dots = response.description.length > App.sconfig.link_max_description_length

    if (description_add_dots) {
      response.description = response.description
        .substring(0, App.sconfig.link_max_description_length)
        .trim() + `...`
    }

    if (App.i.redis_client_ready) {
      let obj = {
        title: response.title,
        description: response.description,
        image: response.image,
        url: response.url,
        date: Date.now()
      }

      App.i.redis_client.HSET(`hue_link_${response.url}`, obj)
    }
  }
}