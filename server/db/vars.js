module.exports = (stuff) => {
  stuff.vars = {}

  stuff.vars.reserved_usernames = [
    stuff.sconfig.system_username,
  ].map((x) => x.toLowerCase())

  // Room and User versions
  // These must be increased by 1 when the schema changes
  stuff.vars.rooms_version = 91
  stuff.vars.users_version = 58

  // Room schema definition
  // This is used to check types and fill defaults
  stuff.vars.rooms_schema = () => {
    return {
      id: {type: `string`, default: ``},
      name: {type: `string`, default: `No Name`},
      topic: {type: `string`, default: ``},
      keys: {type: `object`, default: {}},
      bans: {type: `object`, default: []},
      log_messages: {type: `object`, default: []},
      admin_log_messages: {type: `object`, default: []},
      background_color: {type: `string`, default: stuff.sconfig.default_room_background_color},
      text_color: {type: `string`, default: stuff.sconfig.default_room_text_color},
      background: {type: `string`, default: ``},
      background_type: {type: `string`, default: `hosted`},
      background_version: {type: `number`, default: 0},
      message_board_posts: {type: `object`, default: []},
      modified: {type: `number`, default: Date.now()},
      version: {type: `number`, default: 0},
      limited: {type: `boolean`, default: false},
      public: {type: `boolean`, default: true},
    }
  }

  // User schema definition
  // This is used to check types and fill defaults
  stuff.vars.users_schema = () => {
    return {
      id: {type: `string`, default: ``},
      username: {type: `string`, default: ``, skip: true},
      password: {type: `string`, default: ``, skip: true},
      password_date: {type: `number`, default: 0},
      profilepic_version: {type: `number`, default: 0},
      registration_date: {type: `number`, default: 0},
      bio: {type: `string`, default: ``},
      audioclip_version: {type: `number`, default: 0},
      modified: {type: `number`, default: Date.now()},
      kicked: {type: `number`, default: 0},
      version: {type: `number`, default: 0},
      last_message_board_post_date: {type: `number`, default: 0},
    }
  }
}