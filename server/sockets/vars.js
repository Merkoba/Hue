module.exports = function (Hue) {
  // Initial declarations
  Hue.vars.fs = require("fs")
  Hue.vars.fsp = require("fs").promises
  Hue.vars.path = require("path")
  Hue.vars.fetch = require("node-fetch")
  Hue.vars.jwt = require("jsonwebtoken")
  Hue.vars.image_dimensions = require("image-size")
  Hue.vars.cheerio = require("cheerio")
  Hue.vars.redis = require("redis")
  Hue.vars.he = require("he")

  Hue.vars.root_path = Hue.vars.path.join(__dirname, "../../")
  Hue.vars.media_root = Hue.vars.path.join(Hue.vars.root_path, Hue.sconfig.media_directory)
  Hue.vars.roles = ["admin", "op", "voice"]
  Hue.vars.media_types = ["image", "tv"]
  Hue.vars.redis_client_ready = false
  Hue.vars.redis_client = Hue.vars.redis.createClient()

  Hue.vars.redis_client.on("connect", e => {
    Hue.vars.redis_client_ready = true
  })
  
  Hue.vars.redis_client.connect().catch(console.error)

  Hue.vars.rooms = {}
  Hue.vars.user_rooms = {}
  Hue.vars.files = {}

  // Struct for file uploads
  Hue.vars.files_struct = {
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
    comment: "",
  }

  Hue.vars.default_role = "voice"

  // Dont check if user has joined with these functions
  Hue.vars.dont_check_joined = ["join_room"]

  // Don't add spam on these functions
  // They add spam manually
  Hue.vars.dont_add_spam = [
    "slice_upload",
    "typing"
  ]

  Hue.vars.fetch_2 = function (url, args = {}) {
    console.info(`Fetching ${url} ...`)
    args.headers = args.headers || {}
    args.headers["user-agent"] = "Mozilla/5.0"
    return Hue.vars.fetch(url, args)
  }

  Hue.vars.tv_link_types = ["youtube", "twitch", "soundcloud", "video", "iframe"]
  Hue.vars.exiting = false
}