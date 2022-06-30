module.exports = function (vars, manager, config, sconfig, utilz, logger) {
  // Initial declarations
  vars.fs = require("fs")
  vars.fsp = require("fs").promises
  vars.path = require("path")
  vars.bcrypt = require("bcrypt")
  vars.reserved_usernames = [
    sconfig.system_username
  ].map((x) => x.toLowerCase())

  // Room and User versions
  // These must be increased by 1 when the schema changes
  vars.rooms_version = 89
  vars.users_version = 57

  // Room schema definition
  // This is used to check types and fill defaults
  vars.rooms_schema = function () {
    return {
      id: { type: "string", default: "" },
      name: { type: "string", default: "No Name" },
      topic: { type: "string", default: "" },
      keys: { type: "object", default: {} },
      bans: { type: "object", default: [] },
      log_messages: { type: "object", default: [] },
      admin_log_messages: { type: "object", default: [] },
      background_color: { type: "string", default: sconfig.default_room_background_color },
      text_color: { type: "string", default: sconfig.default_room_text_color },
      background: { type: "string", default: "" },
      background_type: { type: "string", default: "hosted" },
      background_version: { type: "number", default: 0 },
      message_board_posts: { type: "object", default: [] },
      modified: { type: "number", default: Date.now() },
      version: { type: "number", default: 0 }
    }
  }

  // User schema definition
  // This is used to check types and fill defaults
  vars.users_schema = function () {
    return {
      id: { type: "string", default: "" },
      username: { type: "string", default: "", skip: true },
      password: { type: "string", default: "", skip: true },
      password_date: { type: "number", default: 0 },
      profilepic_version: { type: "number", default: 0 },
      registration_date: { type: "number", default: 0 },
      bio: { type: "string", default: "" },
      audioclip_version: { type: "number", default: 0 },
      modified: { type: "number", default: Date.now() },
      version: { type: "number", default: 0 },
      last_message_board_post_date: {type: "number", default: 0}
    }
  } 
}