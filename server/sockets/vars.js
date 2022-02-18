module.exports = function (
  vars,
  handler,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Initial declarations
  vars.fs = require("fs")
  vars.path = require("path")
  vars.fetch = require("node-fetch")
  vars.jwt = require("jsonwebtoken")
  vars.image_dimensions = require("image-size")
  vars.cheerio = require("cheerio")
  vars.redis = require("redis")
  vars.he = require("he")

  vars.root_path = vars.path.join(__dirname, "../../")
  vars.media_root = vars.path.join(vars.root_path, sconfig.media_directory)
  vars.roles = ["admin", "op", "voice"]
  vars.media_types = ["image", "tv"]
  vars.redis_client_ready = false
  vars.redis_client = vars.redis.createClient()

  vars.redis_client.select(10, function () {
    vars.redis_client_ready = true
  })

  vars.rooms = {}
  vars.user_rooms = {}
  vars.files = {}

  // Struct for file uploads
  vars.files_struct = {
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

  vars.default_role = "voice"

  // Dont check if user has joined with these functions
  vars.dont_check_joined = ["join_room"]

  // Don't add spam on these functions
  // They add spam manually
  vars.dont_add_spam = [
    "slice_upload",
    "typing"
  ]

  vars.fetch_2 = function (url, args = {}) {
    console.info(`Fetching ${url} ...`)
    args.headers = args.headers || {}
    args.headers["user-agent"] = "Mozilla/5.0"
    return vars.fetch(url, args)
  }

  vars.tv_link_types = ["youtube", "twitch", "soundcloud", "video", "iframe"]
  vars.exiting = false
}
