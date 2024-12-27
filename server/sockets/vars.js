module.exports = (App) => {
  App.vars = {}
  App.vars.root_path = App.i.path.join(__dirname, `../../`)
  App.vars.media_root = App.i.path.join(App.vars.root_path, App.sconfig.media_directory)
  App.vars.roles = [`admin`, `op`, `voice`]
  App.vars.media_types = [`image`, `tv`]
  App.i.redis_client_ready = false
  App.i.redis_client = App.i.redis.createClient()

  App.i.redis_client.on(`connect`, e => {
    App.i.redis_client_ready = true
  })

  App.i.redis_client.connect().catch(console.error)

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

  App.vars.fetch = (url, args = {}) => {
    console.info(`Fetching ${url} ...`)
    args.headers = args.headers || {}
    args.headers[`user-agent`] = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.90 Safari/537.36`
    return App.i.fetch(url, args)
  }

  App.vars.tv_link_types = [`youtube`, `twitch`, `soundcloud`, `video`, `iframe`]
  App.vars.exiting = false
  App.vars.limited_spam = 20
}