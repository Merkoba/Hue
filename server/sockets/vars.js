module.exports = (App) => {
  // Initial declarations
  App.vars.fs = require(`fs`)
  App.vars.fsp = require(`fs`).promises
  App.vars.path = require(`path`)
  App.vars.fetch = require(`node-fetch`)
  App.vars.jwt = require(`jsonwebtoken`)
  App.vars.image_dimensions = require(`image-size`)
  App.vars.cheerio = require(`cheerio`)
  App.vars.redis = require(`redis`)
  App.vars.he = require(`he`)

  App.vars.root_path = App.vars.path.join(__dirname, `../../`)
  App.vars.media_root = App.vars.path.join(App.vars.root_path, App.sconfig.media_directory)
  App.vars.roles = [`admin`, `op`, `voice`]
  App.vars.media_types = [`image`, `tv`]
  App.vars.redis_client_ready = false
  App.vars.redis_client = App.vars.redis.createClient()

  App.vars.redis_client.on(`connect`, e => {
    App.vars.redis_client_ready = true
  })

  App.vars.redis_client.connect().catch(console.error)

  App.vars.rooms = {}
  App.vars.user_rooms = {}
  App.vars.files = {}

  // Struct for file uploads
  App.vars.files_struct = {
    action: null,
    name: null,
    type: null,
    size: 0,
    data: [],
    slice: 0,
    date: null,
    updated: null,
    received: 0,
    extension: null,
    cancelled: false,
    spsize: 0,
    comment: ``,
  }

  App.vars.default_role = `voice`

  // Dont check if user has joined with these functions
  App.vars.dont_check_joined = [`join_room`]

  // Don't add spam on these functions
  // They add spam manually
  App.vars.dont_add_spam = [
    `slice_upload`
  ]

  App.vars.fetch_2 = (url, args = {}) => {
    console.info(`Fetching ${url} ...`)
    args.headers = args.headers || {}
    args.headers[`user-agent`] = `Mozilla/5.0`
    return App.vars.fetch(url, args)
  }

  App.vars.tv_link_types = [`youtube`, `twitch`, `soundcloud`, `video`, `iframe`]
  App.vars.exiting = false
}