// Commands object
// Used to populate the commands list
// Actions for each command are declared here
App.commands = {
  users: {
    action: (arg, ans) => {
      if (arg) {
        App.show_userlist_window(`normal`, arg)
      }
      else {
        App.show_userlist_window()
      }
    },
    description: `Shows the user list. Accepts a filter as an argument`,
  },
  roomname: {
    aliases: [`name`],
    action: (arg, ans) => {
      if (arg) {
        App.change_room_name(arg)
      }
      else {
        App.show_room_name()
      }
    },
    description: `Changes the name of the room`,
  },
  search: {
    aliases: [`find`],
    action: (arg, ans) => {
      if (arg) {
        App.show_chat_search(arg)
      }
      else {
        App.show_chat_search()
      }
    },
    description: `Opens the search window. Accepts a query as an argument`,
  },
  voice: {
    action: (arg, ans) => {
      App.change_role(arg, `voice`)
    },
    description: `Gives voice to a user`,
  },
  op: {
    action: (arg, ans) => {
      App.change_role(arg, `op`)
    },
    description: `Gives op to a user`,
  },
  admin: {
    action: (arg, ans) => {
      App.change_role(arg, `admin`)
    },
    description: `Gives admin to a user. This gives a user the same rights as the original admin`,
  },
  ban: {
    action: (arg, ans) => {
      App.ban(arg)
    },
    description: `Bans a user from the room`,
  },
  unban: {
    action: (arg, ans) => {
      App.unban(arg)
    },
    description: `Unbans a user from the room`,
  },
  kick: {
    action: (arg, ans) => {
      App.kick(arg)
    },
    description: `Kicks a user out of the room`,
  },
  tv: {
    aliases: [`yt`, `video`, `v`],
    action: (arg, ans) => {
      if (arg) {
        App.change_tv_source(arg)
      }
      else {
        App.show_media_picker(`tv`)
      }
    },
    description: `Changes the tv using a search term or URL`,
  },
  linktv: {
    action: (arg, ans) => {
      App.show_link_tv()
    },
    description: `Show the link tv window`,
  },
  capture: {
    action: (arg, ans) => {
      App.screen_capture()
    },
    description: `Start a screen capture`,
  },
  uploadtv: {
    action: (arg, ans) => {
      App.show_upload_tv()
    },
    description: `Show the upload tv window`,
  },
  image: {
    aliases: [`img`, `i`],
    action: (arg, ans) => {
      if (arg) {
        App.change_image_source(arg)
      }
      else {
        App.show_media_picker(`image`)
      }
    },
    description: `Changes the image using a search term or URL`,
  },
  linkimage: {
    aliases: [`link`],
    action: (arg, ans) => {
      App.show_link_image()
    },
    description: `Show the link image window`,
  },
  screenshot: {
    action: (arg, ans) => {
      App.take_screenshot()
    },
    description: `Take a screenshot`,
  },
  uploadimage: {
    aliases: [`upload`, `imgupload`],
    action: (arg, ans) => {
      App.show_upload_image()
    },
    description: `Show the upload image window`,
  },
  media: {
    aliases: [`change`],
    action: (arg, ans) => {
      if (arg) {
        App.media_command(arg)
      }
    },
    description: `Generic function to use image or tv urls`,
  },
  topic: {
    action: (arg, ans) => {
      if (arg) {
        App.change_topic(arg)
      }
      else {
        App.show_topic()
      }
    },
    description: `Changes the topic of the room`,
  },
  commandbook: {
    aliases: [`commands`, `help`],
    action: (arg, ans) => {
      App.show_command_book(arg)
    },
    description: `Shows Commands`,
  },
  logout: {
    action: (arg, ans) => {
      App.logout()
    },
    description: `Ends the user session`,
  },
  shrug: {
    action: (arg, ans) => {
      App.shrug()
    },
    description: `Shows the shrug ascii`,
  },
  disconnectothers: {
    action: (arg, ans) => {
      App.disconnect_others()
    },
    description: `Disconnects other connected account clients`,
  },
  whisper: {
    action: (arg, ans) => {
      App.process_write_whisper(arg)
    },
    description: `Opens a window to write a whisper to x user. If the argument contains the &gt; character it will use the inline method where the username is whatever is to the left of the &gt; and the message whatever is to the right of it, and send the message directly without using the window`,
  },
  systemrestart: {
    action: (arg, ans) => {
      App.send_system_restart_signal()
    },
    description: `(Only for superusers) Sends a signal to every connected client to restart the application`,
  },
  systembroadcast: {
    action: (arg, ans) => {
      App.system_broadcast()
    },
    description: `(Only for superusers) Sends a whisper to every connected client`,
  },
  annex: {
    action: (arg, ans) => {
      if (arg) {
        App.annex(arg)
      }
      else {
        App.annex()
      }
    },
    description: `(Only for superusers) Used to change the user's role`,
  },
  modusername: {
    action: (arg, ans) => {
      if (arg) {
        App.modusername(arg)
      }
    },
    description: `(Only for superusers) Used to change a user's username`,
  },
  modpassword: {
    action: (arg, ans) => {
      if (arg) {
        App.modpassword(arg)
      }
    },
    description: `(Only for superusers) Used to change a user's password`,
  },
  createroom: {
    action: (arg, ans) => {
      if (arg) {
        App.create_room(arg)
      }
      else {
        App.create_room(`New Room`)
      }
    },
    description: `(Only for superusers) Used to create rooms`,
  },
  privateroom: {
    action: (arg, ans) => {
      if (arg) {
        App.create_private_room(arg)
      }
      else {
        App.create_private_room(`New Room`)
      }
    },
    description: `(Only for superusers) Used to create rooms`,
  },
  deleteroom: {
    action: (arg, ans) => {
      App.delete_room()
    },
    description: `(Only for superusers) Used to delete rooms`,
  },
  banuserid: {
    action: (arg, ans) => {
      App.ban_user_id(arg)
    },
    description: `(Only for superusers) Used to ban a user id`,
  },
  unbanuserid: {
    action: (arg, ans) => {
      App.unban_user_id(arg)
    },
    description: `(Only for superusers) Used to unban a user id`,
  },
  banusername: {
    action: (arg, ans) => {
      App.ban_username(arg)
    },
    description: `(Only for superusers) Used to ban a username`,
  },
  unbanusername: {
    action: (arg, ans) => {
      App.unban_username(arg)
    },
    description: `(Only for superusers) Used to unban a username`,
  },
  banipaddress: {
    action: (arg, ans) => {
      App.ban_ip_address(arg)
    },
    description: `(Only for superusers) Used to ban an ip address`,
  },
  unbanipaddress: {
    action: (arg, ans) => {
      App.unban_ip_address(arg)
    },
    description: `(Only for superusers) Used to unban an ip address`,
  },
  getuserid: {
    action: (arg, ans) => {
      App.get_user_id_by_username(arg)
    },
    description: `(Only for superusers) Get the user id of a username`,
  },
  getusername: {
    action: (arg, ans) => {
      App.get_username_by_user_id(arg)
    },
    description: `(Only for superusers) Get the username of a user id`,
  },
  getipaddress: {
    action: (arg, ans) => {
      App.get_ip_address_by_username(arg)
    },
    description: `(Only for superusers) Get the ip address of a user`,
  },
  disconnectuser: {
    action: (arg, ans) => {
      App.disconnect_user(arg)
    },
    description: `(Only for superusers) Disconnect all sockets of a user`,
  },
  highlights: {
    action: (arg, ans) => {
      App.show_highlights()
    },
    description: `Shows chat messages where you were highlighted`,
  },
  links: {
    action: (arg, ans) => {
      App.show_links()
    },
    description: `Shows chat messages that contain links`,
  },
  mainmenu: {
    aliases: [`menu`],
    action: (arg, ans) => {
      App.show_main_menu()
    },
    description: `Shows the main menu`,
  },
  lockimage: {
    action: (arg, ans) => {
      App.set_media_locked({type: `image`, what: true})
    },
    description: `Locks the image`,
  },
  locktv: {
    action: (arg, ans) => {
      App.set_media_locked({type: `tv`, what: true})
    },
    description: `Locks the tv`,
  },
  unlockimage: {
    action: (arg, ans) => {
      App.set_media_locked({type: `image`, what: false})
    },
    description: `Unlocks the image`,
  },
  unlocktv: {
    action: (arg, ans) => {
      App.set_media_locked({type: `tv`, what: false})
    },
    description: `Unlocks the tv`,
  },
  showimage: {
    action: (arg, ans) => {
      App.set_media_enabled({type: `image`, what: true})
    },
    description: `Makes the image visible and active`,
  },
  showtv: {
    action: (arg, ans) => {
      App.set_media_enabled({type: `tv`, what: true})
    },
    description: `Makes the tv visible and active`,
  },
  hideimage: {
    action: (arg, ans) => {
      App.set_media_enabled({type: `image`, what: false})
    },
    description: `Makes the image invisible and inactive`,
  },
  hidetv: {
    action: (arg, ans) => {
      App.set_media_enabled({type: `tv`, what: false})
    },
    description: `Makes the tv invisible and inactive`,
  },
  starttv: {
    aliases: [`start`],
    action: (arg, ans) => {
      App.play_tv()
    },
    description: `Starts the tv`,
  },
  stoptv: {
    aliases: [`stop`],
    action: (arg, ans) => {
      App.stop_tv()
    },
    description: `Stops the tv`,
  },
  openimage: {
    action: (arg, ans) => {
      App.show_modal_image()
    },
    description: `Opens the image modal`,
  },
  date: {
    aliases: [`time`],
    action: (arg, ans) => {
      App.show_current_date()
    },
    description: `Shows current date`,
  },
  activityabove: {
    aliases: [`above`],
    action: (arg, ans) => {
      App.activity_above()
    },
    description: `Scrolls chat to activity pertaining you above`,
  },
  activitybelow: {
    aliases: [`below`],
    action: (arg, ans) => {
      App.activity_below()
    },
    description: `Scrolls chat to activity pertaining you below`,
  },
  settings: {
    action: (arg, ans) => {
      App.show_settings(arg)
    },
    description: `Shows the settings window. Accepts a filter as an argument`,
  },
  goto: {
    action: (arg, ans) => {
      App.goto_url(arg, `tab`)
    },
    description: `Goes to room ID or URL`,
  },
  ping: {
    action: (arg, ans) => {
      App.ping_server()
    },
    description: `Pings the server and shows the delay from the moment it was sent to the moment it was received`,
  },
  top: {
    action: (arg, ans) => {
      App.goto_top()
    },
    description: `Scrolls the chat to the top`,
  },
  bottom: {
    action: (arg, ans) => {
      App.goto_bottom(true)
    },
    description: `Scrolls the chat to the bottom`,
  },
  background: {
    aliases: [`bg`],
    action: (arg, ans) => {
      if (arg) {
        App.change_background_source(arg)
      }
      else {
        App.background_admin()
      }
    },
    description: `Changes the background to a specified URL`,
  },
  whatis: {
    action: (arg, ans) => {
      App.inspect_command(arg)
    },
    description: `This can be used to inspect commands`,
  },
  reload: {
    action: (arg, ans) => {
      App.reload_client()
    },
    description: `Loads everything again`,
  },
  refresh: {
    action: (arg, ans) => {
      App.refresh_client()
    },
    description: `Re-connects to the server without leaving`,
  },
  feedback: {
    action: (arg, ans) => {
      App.checkmsg(arg)
    },
    description: `Displays a simple feedback information message for the user`,
  },
  backgroundcolor: {
    aliases: [`bgcolor`],
    action: (arg, ans) => {
      App.change_background_color(arg)
    },
    description: `Changes the background color to a specified hex color`,
  },
  textcolor: {
    action: (arg, ans) => {
      App.change_text_color(arg)
    },
    description: `Changes the text color to a specified hex color`,
  },
  adminactivity: {
    action: (arg, ans) => {
      if (arg) {
        App.request_admin_activity(arg)
      }
      else {
        App.request_admin_activity()
      }
    },
    description: `Shows recent activity by ops and admins. Accepts a filter as an argument`,
  },
  adminlist: {
    aliases: [`admins`],
    action: (arg, ans) => {
      App.request_admin_list()
    },
    description: `Shows the list of ops and admins of the room`,
  },
  banlist: {
    aliases: [`bans`],
    action: (arg, ans) => {
      App.request_ban_list()
    },
    description: `Displays a list of banned users`,
  },
  bio: {
    action: (arg, ans) => {
      if (arg) {
        App.change_bio(arg)
      }
    },
    description: `Changes the user's bio`,
  },
  notifications: {
    action: (arg, ans) => {
      App.show_notifications(arg)
    },
    description: `Opens the notifications window. Accepts a filter as an argument`,
  },
  whispers: {
    action: (arg, ans) => {
      App.show_whispers(arg)
    },
    description: `Opens the whispers window. Accepts a filter as an argument`,
  },
  synctv: {
    aliases: [`sync`],
    action: (arg, ans) => {
      if (arg) {
        App.sync_tv(arg)
      }
    },
    description: `Syncs a tv video with another user's video progress`,
  },
  messageboard: {
    aliases: [`board`],
    action: (arg, ans) => {
      App.show_message_board(arg)
    },
    description: `Opens the message board. Accepts a filter as an argument`,
  },
  profile: {
    aliases: [`who`, `whoami`],
    action: (arg, ans) => {
      if (arg) {
        App.show_profile(arg)
      }
      else {
        App.show_user_profile()
      }
    },
    description: `Show a user profile`,
  },
  me: {
    action: (arg, ans) => {
      if (arg) {
        App.input_to_thirdperson(arg)
      }
    },
    description: `Turns this * into this *`,
  },
  draw: {
    action: (arg, ans) => {
      App.open_draw_image(`image`)
    },
    description: `Open the drawing window`,
  },
  clear: {
    action: (arg, ans) => {
      App.add_chat_spacer()
    },
    description: `Clear the chat`,
  },
  user: {
    action: (arg, ans) => {
      if (arg) {
        App.show_user_messages(arg)
      }
      else {
        App.show_user_messages()
      }
    },
    description: `Show posts by a user`,
  },
  clearmessageboard: {
    action: (arg, ans) => {
      App.clear_message_board()
    },
    description: `Clear the message board`,
  },
  clearlog: {
    action: (arg, ans) => {
      App.clear_log()
    },
    description: `Clear the log`,
  },
  randomradio: {
    aliases: [`random`],
    action: (arg, ans) => {
      App.play_random_radio()
    },
    description: `Select a random radio station`,
  },
  radioplay: {
    aliases: [`play`],
    action: (arg, ans) => {
      App.radio_playstop()
    },
    description: `Play or stop the current radio station`,
  },
  radio: {
    action: (arg, ans) => {
      App.show_radio(arg)
    },
    description: `Open and filter the radio window`,
  },
  roomlist: {
    aliases: [`list`],
    action: (arg, ans) => {
      App.show_roomlist(arg)
    },
    description: `Show the room list`,
  },
  roomconfig: {
    aliases: [`config`],
    action: (arg, ans) => {
      App.show_room_config(arg)
    },
    description: `Show the room config window`,
  },
  imagehistory: {
    aliases: [`images`, `imgs`],
    action: (arg, ans) => {
      App.show_image_list()
    },
    description: `Show the image history`,
  },
  tvhistory: {
    aliases: [`tvs`],
    action: (arg, ans) => {
      App.show_tv_list()
    },
    description: `Show the tv history`,
  },
  repeat: {
    action: (arg, ans) => {
      App.show_input_history(arg)
    },
    description: `Show the input history. Shortcut: Shift + Up`,
  },
  react: {
    aliases: [`reactions`],
    action: (arg, ans) => {
      App.show_reactions()
    },
    description: `Show the reactions window`,
  },
  limited: {
    action: (arg, ans) => {
      App.toggle_limited()
    },
    description: `Toggle limited`,
  },
  notify: {
    aliases: [`notification`],
    action: (arg, ans) => {
      App.send_notification(arg)
    },
    description: `Send a notification to the room`,
  },
  uptime: {
    aliases: [`join`, `joined`, `when`, `duration`, `online`],
    action: (arg, ans) => {
      App.show_uptime(arg)
    },
    description: `Show how long ago a user joined the room`,
  },
  previmage: {
    aliases: [`loadprevimage`, `previmg`, `previ`],
    action: (arg, ans) => {
      App.load_prev_media(`image`)
    },
    description: `Load the previous image`,
  },
  nextimage: {
    aliases: [`loadnextimage`, `nextimg`, `nexti`],
    action: (arg, ans) => {
      App.load_next_media(`image`)
    },
    description: `Load the next image`,
  },
  prevtv: {
    aliases: [`loadprevtv`],
    action: (arg, ans) => {
      App.load_prev_media(`tv`)
    },
    description: `Load the previous tv`,
  },
  nexttv: {
    aliases: [`loadnexttv`, `nextv`],
    action: (arg, ans) => {
      App.load_next_media(`tv`)
    },
    description: `Load the next tv`,
  },
  firstimage: {
    aliases: [`loadfirstimage`, `firstimg`, `firsti`],
    action: (arg, ans) => {
      App.load_first_media(`image`)
    },
    description: `Load the first image`,
  },
  lastimage: {
    aliases: [`loadlastimage`, `lastimg`, `lasti`],
    action: (arg, ans) => {
      App.load_last_media(`image`)
    },
    description: `Load the last image`,
  },
  firsttv: {
    aliases: [`loadfirsttv`, `firstv`],
    action: (arg, ans) => {
      App.load_first_media(`tv`)
    },
    description: `Load the first tv`,
  },
  lasttv: {
    aliases: [`loadlasttv`, `lastv`],
    action: (arg, ans) => {
      App.load_last_media(`tv`)
    },
    description: `Load the last tv`,
  },
}

// Commands reserved to superusers
// Invisible to normal users
App.superuser_commands = [
  `systembroadcast`,
  `systemrestart`,
  `modusername`,
  `modpassword`,
  `annex`,
  `createroom`,
  `deleteroom`,
  `banuserid`,
  `unbanuserid`,
  `banusername`,
  `unbanusername`,
  `banipaddress`,
  `unbanipaddress`,
  `getuserid`,
  `getusername`,
  `getipaddress`,
  `disconnectuser`,
]

// Check for command collisions on commands and aliases
App.check_commands = () => {
  let style = `color:red; font-size:1.4rem`

  for (let key in App.commands) {
    let cmd1 = App.commands[key]
    let aliases = App.commands[key].aliases

    if (aliases) {
      for (let a of aliases) {
        if (App.commands[a]) {
          let msg = `%cCommand alias collision detected. ${key} and ${a}`
          App.utilz.loginfo(msg, style)
        }

        for (let key2 in App.commands) {
          if (key === key2) {
            continue
          }

          let cmd2 = App.commands[key2]

          if (cmd2.aliases && cmd2.aliases.includes(a)) {
            let msg = `%cAlias collision detected between commands ${key} and ${key2} for alias ${a}`
            App.utilz.loginfo(msg, style)
          }

          if (cmd1.description === cmd2.description) {
            let msg = `%cCommand description collision detected. ${key} and ${key2}`
            App.utilz.loginfo(msg, style)
          }
        }
      }
    }
  }
}

// Prepares commands based on the commands object
// Makes sorted variations
// Checks if anagrams collide
App.prepare_commands = () => {
  App.check_commands()
  App.commands_list = []
  App.commands_list_with_prefix = []

  for (let key in App.commands) {
    if (App.superuser_commands.includes(key)) {
      if (!App.superuser) {
        continue
      }
    }

    let cmds = [key]
    let aliases = App.commands[key].aliases

    if (aliases) {
      cmds.push(...aliases)
    }

    for (let c of cmds) {
      App.commands_list.push(c)
      App.commands_list_with_prefix.push(App.cmd_prefix() + c)
    }
  }

  App.commands_list.sort()

  for (let command of App.commands_list) {
    let sorted = command.split(``).sort().join(``)
    App.commands_list_sorted[command] = sorted
    App.commands_list_sorted_2[sorted] = command
  }

  App.check_command_anagrams()
}

// Check command anagrams
App.check_command_anagrams = () => {
  let style = `color:red; font-size:1.4rem`

  for (let key in App.commands_list_sorted) {
    let scmd1 = App.commands_list_sorted[key]

    for (let key2 in App.commands_list_sorted) {
      let scmd2 = App.commands_list_sorted[key2]

      if (key !== key2) {
        if (scmd1 === scmd2) {
          App.utilz.loginfo(`%cCommand anagrams detected. ${key} and ${key2}`, style)
        }
      }
    }
  }
}

// Checks whether some string is a command
App.is_command = (message) => {
  return (message.length >= 2) &&
    (message[0] === App.cmd_prefix()) &&
    (message[1] !== App.cmd_prefix()) &&
    (message[1] !== ` `)
}

// Responsible of executing a command
// It will check the commands object to see if a command matches
// Executes the declared action
App.execute_command = (message, ans) => {
  let split = message.split(` `)
  let cmd = split[0].toLowerCase()
  let arg = split.slice(1).join(` `)

  if (cmd.startsWith(App.cmd_prefix())) {
    cmd = cmd.substring(1)
  }

  if (cmd.length === 0) {
    App.checkmsg(`Invalid empty command`)
    return ans
  }

  if (App.superuser_commands.includes(cmd)) {
    if (!App.superuser) {
      App.not_allowed()
      return ans
    }
  }

  let cmd_sorted = cmd.split(``).sort().join(``)
  let command = App.commands_list_sorted_2[cmd_sorted]

  if (!command) {
    let closest_command = App.get_closest_command(cmd)

    if (closest_command) {
      command = closest_command
    }
    else {
      App.checkmsg(`Invalid command "${cmd}"`)
      return ans
    }
  }

  let c = App.search_command(command)

  if (c) {
    c.action(arg, ans)
  }

  return ans
}

// Search for a command
App.search_command = (cmd) => {
  for (let key in App.commands) {
    if (key === cmd) {
      return App.commands[key]
    }

    let aliases = App.commands[key].aliases

    if (aliases) {
      for (let a of aliases) {
        if (a === cmd) {
          return App.commands[key]
        }
      }
    }
  }
}

// Gives feedback on what type of command a command is
App.inspect_command = (cmd) => {
  if (cmd.startsWith(App.cmd_prefix())) {
    cmd = cmd.slice(1)
  }

  let s = App.cmd_prefix() + cmd

  if (App.commands_list.includes(cmd)) {
    s += `: ${App.commands[cmd].description}`
  }
  else {
    s += ` is not a valid command`
  }

  App.checkmsg(s)
}

// Show the command book
App.show_command_book = (filter = ``) => {
  if (!App.command_book_created) {
    let commands = {}

    for (let key in App.commands) {
      if (App.superuser_commands.includes(key)) {
        if (!App.superuser) {
          continue
        }
      }

      commands[key] = App.commands[key]
    }

    DOM.el(`#command_book_container`).innerHTML =
      App.template_command_book_commands({commands})

    DOM.ev(DOM.el(`#command_book_container`), `click`, (e) => {
      if (e.target.closest(`.command_book_item`)) {
        let key = e.target.closest(`.command_book_item`).dataset.key
        App.change_input(`${App.cmd_prefix()}${key} `)
        App.close_all_modals()
      }
    })

    App.command_book_created = true
  }

  App.msg_command_book.show()

  if (filter.trim()) {
    DOM.el(`#command_book_filter`).value = filter
    App.do_modal_filter()
  }
}

// Gets the most similar command from a string
App.get_closest_command = (cmd) => {
  let highest_num = 0
  let highest_command = false

  for (let command of App.commands_list) {
    let similarity = App.utilz.string_similarity(command, cmd)

    if ((similarity >= 0.8) && (similarity > highest_num)) {
      highest_num = similarity
      highest_command = command
    }
  }

  return highest_command
}

// Get the command prefix
App.cmd_prefix = () => {
  return App.get_setting(`command_prefix`)
}