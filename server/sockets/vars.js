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
  vars.SocketAntiSpam = require("socket-anti-spam")
  vars.fetch = require("node-fetch")
  vars.mongo = require("mongodb")
  vars.jwt = require("jsonwebtoken")
  vars.soundcloud = require("node-soundcloud")
  vars.image_dimensions = require("image-size")
  vars.cheerio = require("cheerio")
  vars.redis = require("redis")
  vars.he = require("he")

  vars.soundcloud.init({
    id: `${sconfig.soundcloud_id}`,
    secret: `${sconfig.soundcloud_secret}`,
  })

  vars.root_path = vars.path.join(__dirname, "../../")
  vars.images_root = vars.path.join(vars.root_path, config.images_directory)
  vars.audio_root = vars.path.join(vars.root_path, config.audio_directory)
  vars.roles = ["admin", "op", "voice"]
  vars.reaction_types = ["like", "love", "happy", "meh", "sad", "dislike"]
  vars.reaction_targets = ["chat", "image", "tv"]
  vars.media_types = ["image", "tv"]
  vars.filtered_fields = {
    log_messages: 0,
    admin_log_messages: 0,
    stored_images: 0,
  }
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

  // Configure the anti-spam system
  vars.anti_spam = new vars.SocketAntiSpam({
    banTime: config.antispam_banTime, // Ban time in minutes
    kickThreshold: config.antispam_kickThreshold, // User gets kicked after this many spam score
    kickTimesBeforeBan: config.antispam_kickTimesBeforeBan, // User gets banned after this many kicks
    banning: config.antispam_banning, // Uses temp IP banning after kickTimesBeforeBan
    heartBeatStale: config.antispam_heartBeatStale, // Removes a heartbeat after this many seconds
    heartBeatCheck: config.antispam_heartBeatCheck, // Checks a heartbeat per this many seconds
  })

  vars.anti_spam.event.on("ban", function (socket, data) {
    socket.hue_kicked = true
    socket.hue_info1 = "the anti-spam system"
    handler.get_out(socket)
  })

  // Dont check if user has joined with these functions
  vars.dont_check_joined = ["join_room"]

  // Don't add spam on these functions
  // They add spam manually
  vars.dont_add_spam = [
    "slice_upload",
    "typing",
    "activity_trigger"
  ]

  // Check if user is locked from room with these functions
  vars.check_locked = ["create_room"]

  vars.fetch_2 = function (url, args = {}) {
    args.headers = args.headers || {}
    args.headers["user-agent"] = "Mozilla/5.0"
    return vars.fetch(url, args)
  }

  vars.exiting = false
}
