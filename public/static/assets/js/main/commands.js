// Commands object
// Used to populate the commands list
// Actions for each command are declared here
Hue.commands = {
  "users": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_userlist_window("normal", arg)
      } else {
        Hue.show_userlist_window()
      }
    },
    description: `Shows the user list. Accepts a filter as an argument`,
  },
  "roomname": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_room_name(arg)
      } else {
        Hue.show_room_name()
      }
    },
    description: `Changes the name of the room`,
  },
  "search": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_chat_search(arg)
      } else {
        Hue.show_chat_search()
      }
    },
    description: `Opens the search window. Accepts a query as an argument`,
  },  
  "voice": {
    action: (arg, ans) => {
      Hue.change_role(arg, "voice")
    },
    description: `Gives voice to a user`,
  },
  "op": {
    action: (arg, ans) => {
      Hue.change_role(arg, "op")
    },
    description: `Gives op to a user`,
  },
  "admin": {
    action: (arg, ans) => {
      Hue.change_role(arg, "admin")
    },
    description: `Gives admin to a user. This gives a user the same rights as the original admin`,
  },
  "ban": {
    action: (arg, ans) => {
      Hue.ban(arg)
    },
    description: `Bans a user from the room`,
  },
  "unban": {
    action: (arg, ans) => {
      Hue.unban(arg)
    },
    description: `Unbans a user from the room`,
  },
  "kick": {
    action: (arg, ans) => {
      Hue.kick(arg)
    },
    description: `Kicks a user out of the room`,
  },
  "tv": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_tv_source(arg)
      } else {
        Hue.show_media_picker("tv")
      }
    },
    description: "Changes the tv using a search term or URL",
  },
  "image": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_image_source(arg)
      } else {
        Hue.show_media_picker("image")
      }
    },
    description: "Changes the image using a search term or URL",
  },
  "topic": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_topic(arg)
      } else {
        Hue.show_topic()
      }
    },
    description: `Changes the topic of the room`,
  },
  "commands": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_commands(arg)
      } else {
        Hue.show_commands()
      }
    },
    description: `Shows Commands`,
  },
  "logout": {
    action: (arg, ans) => {
      Hue.logout()
    },
    description: `Ends the user session`,
  },
  "shrug": {
    action: (arg, ans) => {
      Hue.shrug()
    },
    description: `Shows the shrug ascii`,
  },
  "disconnectothers": {
    action: (arg, ans) => {
      Hue.disconnect_others()
    },
    description: `Disconnects other connected account clients`,
  },
  "whisper": {
    action: (arg, ans) => {
      Hue.process_write_whisper(arg, true)
    },
    description: `Opens a window to write a whisper to x user. If the argument contains the &gt; character it will use the inline method where the username is whatever is to the left of the &gt; and the message whatever is to the right of it, and send the message directly without using the window`,
  },
  "systemrestart": {
    action: (arg, ans) => {
      Hue.send_system_restart_signal()
      ans.to_history = false
    },
    description: `(Only for superusers) Sends a signal to every connected client to restart the application`,
  },
  "systembroadcast": {
    action: (arg, ans) => {
      Hue.system_broadcast()
      ans.to_history = false
    },
    description: `(Only for superusers) Sends a whisper to every connected client`,
  },
  "annex": {
    action: (arg, ans) => {
      if (arg) {
        Hue.annex(arg)
      } else {
        Hue.annex()
        ans.to_history = false
      }
    },
    description: `(Only for superusers) Used to change the user's role`,
  },
  "modusername": {
    action: (arg, ans) => {
      if (arg) {
        Hue.modusername(arg)
      }
    },
    description: `(Only for superusers) Used to change a user's username`,
  },
  "modpassword": {
    action: (arg, ans) => {
      if (arg) {
        Hue.modpassword(arg)
      }
    },
    description: `(Only for superusers) Used to change a user's password`,
  }, 
  "createroom": {
    action: (arg, ans) => {
      if (arg) {
        Hue.create_room(arg)
      } else {
        Hue.create_room("New Room")
      }
    },
    description: `(Only for superusers) Used to create rooms`,
  },     
  "highlights": {
    action: (arg, ans) => {
      Hue.show_highlights()
    },
    description: `Shows chat messages where you were highlighted`,
  },
  "links": {
    action: (arg, ans) => {
      Hue.show_links()
    },
    description: `Shows chat messages that contain links`,
  },  
  "mainmenu": {
    action: (arg, ans) => {
      Hue.show_main_menu()
    },
    description: `Shows the main menu`,
  },
  "roommenu": {
    action: (arg, ans) => {
      Hue.show_room_menu()
    },
    description: `Shows the room menu`,
  },
  "usermenu": {
    action: (arg, ans) => {
      Hue.show_user_menu()
    },
    description: `Shows the user menu`,
  },
  "mediamenu": {
    action: (arg, ans) => {
      Hue.show_media_menu()
    },
    description: `Shows the media menu`,
  },
  "lockimage": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"image", what:true})
    },
    description: `Locks the image`,
  },
  "locktv": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"tv", what:true})
    },
    description: `Locks the tv`,
  },
  "unlockimage": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"image", what:false})
    },
    description: `Unlocks the image`,
  },
  "unlocktv": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"tv", what:false})
    },
    description: `Unlocks the tv`,
  },
  "togglelockimage": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"image"})
    },
    description: `Toggles between lock and unlock the image`,
  },
  "togglelocktv": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"tv"})
    },
    description: `Toggles between lock and unlock the tv`,
  },
  "showimage": {
    action: (arg, ans) => {
      Hue.toggle_media({type:"image", what:true})
    },
    description: `Makes the image visible and active`,
  },
  "showtv": {
    action: (arg, ans) => {
      Hue.toggle_media({type:"tv", what:true})
    },
    description: `Makes the tv visible and active`,
  },
  "hideimage": {
    action: (arg, ans) => {
      Hue.toggle_media({type:"image", what:false})
    },
    description: `Makes the image invisible and inactive`,
  },
  "hidetv": {
    action: (arg, ans) => {
      Hue.toggle_media({type:"tv", what:false})
    },
    description: `Makes the tv invisible and inactive`,
  },
  "toggleimage": {
    action: (arg, ans) => {
      Hue.toggle_media({type:"image"})
    },
    description: `Toggles between show and hide the image`,
  },
  "toggletv": {
    action: (arg, ans) => {
      Hue.toggle_media({type:"tv"})
    },
    description: `Toggles between show and hide the tv`,
  },
  "starttv": {
    action: (arg, ans) => {
      Hue.play_tv()
    },
    description: `Starts the tv`,
  },
  "stoptv": {
    action: (arg, ans) => {
      Hue.stop_tv()
    },
    description: `Stops the tv`,
  },
  "openimage": {
    action: (arg, ans) => {
      Hue.show_modal_image()
    },
    description: `Opens the image modal`,
  },
  "date": {
    action: (arg, ans) => {
      Hue.show_current_date()
    },
    description: `Shows current date`,
  },
  "activityabove": {
    action: (arg, ans) => {
      Hue.activity_above()
    },
    description: `Scrolls chat to activity pertaining you above`,
  },
  "activitybelow": {
    action: (arg, ans) => {
      Hue.activity_below()
    },
    description: `Scrolls chat to activity pertaining you below`,
  },
  "settings": {
    action: (arg, ans) => {
      Hue.show_settings(arg)
    },
    description: `Shows the settings window. Accepts a filter as an argument`,
  },
  "goto": {
    action: (arg, ans) => {
      Hue.goto_url(arg, "tab")
    },
    description: `Goes to room ID or URL`,
  },
  "ping": {
    action: (arg, ans) => {
      Hue.ping_server()
    },
    description: `Pings the server and shows the delay from the moment it was sent to the moment it was received`,
  },
  "lockscreen": {
    action: (arg, ans) => {
      Hue.lock_screen()
    },
    description: `Locks the screen`,
  },
  "top": {
    action: (arg, ans) => {
      Hue.goto_top()
    },
    description: `Scrolls the chat to the top`,
  },
  "bottom": {
    action: (arg, ans) => {
      Hue.goto_bottom(true)
    },
    description: `Scrolls the chat to the bottom`,
  },
  "background": {
    action: (arg, ans) => {
      Hue.change_background_source(arg)
    },
    description: `Changes the background to a specified URL`,
  },
  "whatis": {
    action: (arg, ans) => {
      Hue.inspect_command(arg)
    },
    description: `This can be used to inspect commands`,
  },
  "reload": {
    action: (arg, ans) => {
      Hue.reload_client()
    },
    description: `Loads everything again`,
  },
  "refresh": {
    action: (arg, ans) => {
      Hue.refresh_client()
    },
    description: `Re-connects to the server without leaving`,
  },
  "feedback": {
    action: (arg, ans) => {
      Hue.checkmsg(arg)
    },
    description: `Displays a simple feedback information message for the user`,
  },
  "backgroundcolor": {
    action: (arg, ans) => {
      Hue.change_background_color(arg)
    },
    description: `Changes the background color to a specified hex color`,
  },
  "textcolor": {
    action: (arg, ans) => {
      Hue.change_text_color(arg)
    },
    description: `Changes the text color to a specified hex color`,
  },
  "adminactivity": {
    action: (arg, ans) => {
      if (arg) {
        Hue.request_admin_activity(arg)
      } else {
        Hue.request_admin_activity()
      }
    },
    description: `Shows recent activity by ops and admins. Accepts a filter as an argument`,
  },
  "adminlist": {
    action: (arg, ans) => {
      Hue.request_admin_list()
    },
    description: `Shows the list of ops and admins of the room`,
  },
  "banlist": {
    action: (arg, ans) => {
      Hue.request_ban_list()
    },
    description: `Displays a list of banned users`,
  },
  "bio": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_bio(arg)
      }
    },
    description: `Changes the user's bio`,
  },
  "notifications": {
    action: (arg, ans) => {
      Hue.show_notifications(arg)
    },
    description: `Opens the notifications window. Accepts a filter as an argument`,
  },
  "whispers": {
    action: (arg, ans) => {
      Hue.show_whispers(arg)
    },
    description: `Opens the whispers window. Accepts a filter as an argument`,
  },
  "synctv": {
    action: (arg, ans) => {
      if (arg) {
        Hue.sync_tv(arg)
      }
    },
    description: `Syncs a tv video with another user's video progress`,
  },
  "messageboard": {
    action: (arg, ans) => {
      Hue.show_message_board(arg)
    },
    description: `Opens the message board. Accepts a filter as an argument`,
  },
  "chatsize": {
    action: (arg, ans) => {
      Hue.do_chat_size_change(arg)
    },
    description: `Change the percentage of the Chat area`,
  },
  "tvsize": {
    action: (arg, ans) => {
      Hue.do_media_tv_size_change(arg)
    },
    description: `Change the percentage of the tv area`,
  },
  "swap": {
    action: (arg, ans) => {
      Hue.swap_display_positions()
    },
    description: `Shortcut to change media positions`,
  },
  "rotate": {
    action: (arg, ans) => {
      Hue.swap_media_layout()
    },
    description: `Shortcut to change media layout`,
  },
  "revolve": {
    action: (arg, ans) => {
      Hue.change_main_layout()
    },
    description: `Shortcut to change main layout`,
  },
  "profile": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_profile(arg)
      }
    },
    description: `Show a user profile`,
  },
  "me": {
    action: (arg, ans) => {
      if (arg) {
        Hue.input_to_thirdperson(arg)
      }
    },
    description: `Turns this * into this *`,
  },
  "default": {
    action: (arg, ans) => {
      Hue.apply_media_defaults()
    },
    description: `Restore media defaults`,
  },
  "draw": {
    action: (arg, ans) => {
      Hue.open_draw_image("image")
    },
    description: `Open the drawing window`,
  },
  "clear": {
    action: (arg, ans) => {
      Hue.add_chat_spacer()
    },
    description: `Clear the chat`,
  },
  "user": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_user_posts(arg)
      }
    },
    description: `Show posts by a user`,
  },
  "clearmessageboard": {
    action: (arg, ans) => {
      Hue.clear_message_board()
    },
    description: `Clear the message board`,
  },
  "clearlog": {
    action: (arg, ans) => {
      Hue.clear_log()
    },
    description: `Clear the log`,
  },
  "dj": {
    action: (arg, ans) => {
      Hue.toggle_radio_dj(true)
    },
    description: `Start radio dj`,
  },
  "randomradio": {
    action: (arg, ans) => {
      Hue.play_random_radio()
    },
    description: `Select a random radio station`,
  },
  "playradio": {
    action: (arg, ans) => {
      Hue.play_radio()
    },
    description: `Play the current radio`,
  },
  "stopradio": {
    action: (arg, ans) => {
      Hue.pause_radio()
    },
    description: `Stop the current radio`,
  }
}

// Setups commands based on the commands object
// Makes sorted variations
// Checks if anagrams collide
Hue.setup_commands = function () {
  Hue.superuser_commands = [
    "systembroadcast",
    "systemrestart",
    "modusername",
    "modpassword",
    "annex",
    "createroom"
  ]

  Hue.commands_list = []
  Hue.commands_list_with_prefix = []

  for (let key in Hue.commands) {
    if (Hue.superuser_commands.includes(key)) {
      if (!Hue.superuser) {
        continue
      }
    }

    Hue.commands_list.push(key)
    Hue.commands_list_with_prefix.push(Hue.config.commands_prefix + key)
  }

  Hue.commands_list.sort()

  for (let command of Hue.commands_list) {
    let sorted = command.split("").sort().join("")
    Hue.commands_list_sorted[command] = sorted
    Hue.commands_list_sorted_2[sorted] = command
  }

  for (let key in Hue.commands_list_sorted) {
    let scmd1 = Hue.commands_list_sorted[key]

    for (let key2 in Hue.commands_list_sorted) {
      let scmd2 = Hue.commands_list_sorted[key2]

      if (key !== key2) {
        if (scmd1 === scmd2) {
          console.error(`Command anagrams detected. ${key} and ${key2}`)
        }
      }
    }
  }
}

// Checks whether some string is a command
Hue.is_command = function (message) {
  if (
    message.length >= 2 &&
    message[0] === Hue.config.commands_prefix &&
    message[1] !== Hue.config.commands_prefix &&
    message[1] !== " "
  ) {
    return true
  }

  return false
}

// Responsible of executing a command
// It will check the commands object to see if a command matches
// Executes the declared action
Hue.execute_command = function (message, ans) {
  let split = message.split(" ")
  let cmd = split[0].toLowerCase()
  let arg = split.slice(1).join(" ")

  if (cmd.startsWith(Hue.config.commands_prefix)) {
    cmd = cmd.substring(1)
  }

  if (Hue.superuser_commands.includes(cmd)) {
    if (!Hue.superuser) {
      Hue.not_allowed()
      return ans
    }
  }

  if (cmd.length < 2) {
    Hue.checkmsg("Invalid empty command")
    return ans
  }

  let cmd_sorted = cmd.split("").sort().join("")
  let command = Hue.commands_list_sorted_2[cmd_sorted]

  if (!command) {
    let closest_command = Hue.get_closest_command(cmd)

    if (closest_command) {
      command = closest_command
    } else {
      Hue.checkmsg(`Invalid command "${cmd}"`)
      return ans
    }
  }

  Hue.commands[command].action(arg, ans)
  return ans
}

// Gives feedback on what type of command a command is
Hue.inspect_command = function (cmd) {
  if (cmd.startsWith(Hue.config.commands_prefix)) {
    cmd = cmd.slice(1)
  }

  let s = Hue.config.commands_prefix + cmd

  if (Hue.commands_list.includes(cmd)) {
    s += `: ${Hue.commands[cmd].description}`
  } else {
    s += ` is not a valid command`
  }

  Hue.checkmsg(s)
}

// Show the commands window
Hue.show_commands = function (filter = "") {
  Hue.msg_commands.show(function () {
    if (filter.trim()) {
      Hue.el("#commands_filter").value = filter
      Hue.do_modal_filter()
    }
  })
}

// Gets the most similar command from a string
Hue.get_closest_command = function (cmd) {
  let highest_num = 0
  let highest_command = false

  for (let command of Hue.commands_list) {
    let similarity = Hue.utilz.string_similarity(command, cmd)

    if (similarity >= 0.8 && similarity > highest_num) {
      highest_num = similarity
      highest_command = command
    }
  }

  return highest_command
}