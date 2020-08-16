// Commands object
// Used to populate the commands list
// Actions for each command are declared here
Hue.commands = {
  "clear": {
    action: (arg, ans) => {
      Hue.clear_chat()
    },
    description: `Clears the chat`,
  },
  "clearinput": {
    action: (arg, ans) => {
      Hue.clear_input()
    },
    description: `Clears the text input`,
  },
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
  "publicrooms": {
    action: (arg, ans) => {
      if (arg) {
        Hue.request_roomlist(arg, "public_roomlist")
      } else {
        Hue.request_roomlist("", "public_roomlist")
      }
    },
    description: `Shows the public room list. Accepts a filter as an argument`,
  },
  "visitedrooms": {
    action: (arg, ans) => {
      if (arg) {
        Hue.request_roomlist(arg, "visited_roomlist")
      } else {
        Hue.request_roomlist("", "visited_roomlist")
      }
    },
    description: `Shows the visited room list. Accepts a filter as an argument`,
  },
  "roomname": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_room_name(arg)
      } else {
        Hue.show_room()
      }
    },
    description: `Changes the name of the room`,
  },
  "roomnameedit": {
    action: (arg, ans) => {
      Hue.room_name_edit()
      ans.to_history = false
      ans.clr_input = false
    },
    description: `Puts the room name in the input, ready to be edited`,
  },
  "played": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_played(arg)
      } else {
        Hue.show_played()
      }
    },
    description: `Shows the list of songs played. Accepts a filter as an argument`,
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
  "clearsearches": {
    action: (arg, ans) => {
      Hue.clear_chat_searches()
    },
    description: `Clears the saved recent searches`,
  },
  "role": {
    action: (arg, ans) => {
      Hue.show_role()
    },
    description: `Shows your role and permissions`,
  },
  "voice1": {
    action: (arg, ans) => {
      Hue.change_role(arg, "voice_1")
    },
    description: `Gives voice_1 to a user`,
  },
  "voice2": {
    action: (arg, ans) => {
      Hue.change_role(arg, "voice_2")
    },
    description: `Gives voice_2 to a user`,
  },
  "voice3": {
    action: (arg, ans) => {
      Hue.change_role(arg, "voice_3")
    },
    description: `Gives voice_3 to a user`,
  },
  "voice4": {
    action: (arg, ans) => {
      Hue.change_role(arg, "voice_4")
    },
    description: `Gives voice_4 to a user`,
  },
  "op1": {
    action: (arg, ans) => {
      Hue.change_role(arg, "op_1")
    },
    description: `Gives op_1 to a user`,
  },
  "op2": {
    action: (arg, ans) => {
      Hue.change_role(arg, "op_2")
    },
    description: `Gives op_2 to a user`,
  },
  "op3": {
    action: (arg, ans) => {
      Hue.change_role(arg, "op_3")
    },
    description: `Gives op_3 to a user`,
  },
  "op4": {
    action: (arg, ans) => {
      Hue.change_role(arg, "op_4")
    },
    description: `Gives op_4 to a user`,
  },
  "admin": {
    action: (arg, ans) => {
      Hue.change_role(arg, "admin")
    },
    description: `Gives admin to a user. This gives a user the same rights as the original admin`,
  },
  "resetvoices": {
    action: (arg, ans) => {
      Hue.reset_voices()
    },
    description: `Turns all voices above 1 to voice_1`,
  },
  "resetops": {
    action: (arg, ans) => {
      Hue.reset_ops()
    },
    description: `Turns all ops above 1 to op_1`,
  },
  "removeops": {
    action: (arg, ans) => {
      Hue.remove_ops()
    },
    description: `Removes all op roles`,
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
  "unbanall": {
    action: (arg, ans) => {
      Hue.unban_all()
    },
    description: `Removes all bans`,
  },
  "bancount": {
    action: (arg, ans) => {
      Hue.get_ban_count()
    },
    description: `Displays the number of banned users in the room`,
  },
  "kick": {
    action: (arg, ans) => {
      Hue.kick(arg)
    },
    description: `Kicks a user out of the room`,
  },
  "public": {
    action: (arg, ans) => {
      Hue.change_privacy(true)
    },
    description: `Room appears in the public room list`,
  },
  "private": {
    action: (arg, ans) => {
      Hue.change_privacy(false)
    },
    description: `Room doesn\'t appear in the public room list`,
  },
  "privacy": {
    action: (arg, ans) => {
      Hue.show_public()
    },
    description: `Shows if a room is public or private`,
  },
  "log": {
    action: (arg, ans) => {
      Hue.show_log()
    },
    description: `Shows if the log is enabled or disabled`,
  },
  "enablelog": {
    action: (arg, ans) => {
      Hue.change_log(true)
    },
    description: `Enables logging of the room. Which allows users to see previous messages before they joined`,
  },
  "disablelog": {
    action: (arg, ans) => {
      Hue.change_log(false)
    },
    description: `Disables logging`,
  },
  "clearlog": {
    action: (arg, ans) => {
      Hue.clear_log("all")
    },
    description: `Removes all messages from the log and resets client state for all the users in the room`,
  },
  "tv": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_tv_source(arg)
      } else {
        Hue.show_media_source("tv")
      }
    },
    description: `Changes the TV using a search term or URL. "${Hue.config.commands_prefix}tv restart" restarts the current video for all users, in case it gets stuck. To link a Youtube playlist the URL must be a pure playlist URL without a video ID. "${Hue.config.commands_prefix}tv default" sets the tv to the site's default tv. "${Hue.config.commands_prefix}tv prev" changes to the previous tv source`,
  },
  "image": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_image_source(arg)
      } else {
        Hue.show_media_source("image")
      }
    },
    description: `Sends an image to be uploaded by URL. "${Hue.config.commands_prefix}image default" sets the image to the site's default image. "${Hue.config.commands_prefix}image prev" changes to the previous image source`,
  },
  "status": {
    action: (arg, ans) => {
      Hue.show_status()
    },
    description: `Shows the room status window`,
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
  "topicadd": {
    action: (arg, ans) => {
      Hue.topicadd(arg)
    },
    description: `Adds a section at the end of the topic`,
  },
  "topictrim": {
    action: (arg, ans) => {
      if (arg) {
        Hue.topictrim(arg)
      } else {
        Hue.topictrim(1)
      }
    },
    description: `Removes a section from the end of the topic, where the optional x is the number of trims you want to do`,
  },
  "topicaddstart": {
    action: (arg, ans) => {
      Hue.topicstart(arg)
    },
    description: `Adds a section at the start of the topic`,
  },
  "topictrimstart": {
    action: (arg, ans) => {
      if (arg) {
        Hue.topictrimstart(arg)
      } else {
        Hue.topictrimstart(1)
      }
    },
    description: `Removes a section from the start of the topic, where the optional x is the number of trims you want to do`,
  },
  "topicedit": {
    action: (arg, ans) => {
      Hue.topicedit()
      ans.to_history = false
      ans.clr_input = false
    },
    description: `Puts the topic in the input, ready to be edited`,
  },
  "room": {
    action: (arg, ans) => {
      Hue.show_room()
    },
    description: `Shows the room name`,
  },
  "help": {
    action: (arg, ans) => {
      Hue.show_help()
    },
    description: `Shows Help`,
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
  "tvvolume": {
    action: (arg, ans) => {
      Hue.change_tv_volume(arg)
    },
    description: `Changes the volume of the tv`,
  },
  "inputhistory": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_input_history(arg)
      } else {
        Hue.show_input_history()
      }
    },
    description: `Shows the input history. Accepts a filter as an argument`,
  },
  "clearinputhistory": {
    action: (arg, ans) => {
      Hue.clear_input_history()
    },
    description: `Clears the input history`,
  },
  "changeusername": {
    action: (arg, ans) => {
      Hue.change_username(arg)
    },
    description: `Changes the account username`,
  },
  "changepassword": {
    action: (arg, ans) => {
      Hue.change_password(arg)
    },
    description: `Changes the account password`,
  },
  "changeemail": {
    action: (arg, ans) => {
      Hue.change_email(arg)
    },
    description: `Changes the account email`,
  },
  "verifyemail": {
    action: (arg, ans) => {
      Hue.verify_email(arg)
    },
    description: `Used to verify an email email with a received code`,
  },
  "details": {
    action: (arg, ans) => {
      Hue.show_details()
    },
    description: `Shows the account details`,
  },
  "logout": {
    action: (arg, ans) => {
      Hue.logout()
    },
    description: `Ends the user session`,
  },
  "fill": {
    action: (arg, ans) => {
      Hue.fill()
    },
    description: `Used for debugging purposes`,
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
  "whisper2": {
    action: (arg, ans) => {
      Hue.process_write_whisper(arg, false)
    },
    description: `Same as ${Hue.config.commands_prefix}whisper but it doesn't show feedback when sent through the inline format, for example "${Hue.config.commands_prefix}whisper2 user > message". Useful for making calls to bots without filling your own chat too much`,
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
  "highlights": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_highlights(arg)
      } else {
        Hue.show_highlights()
      }
    },
    description: `Shows chat messages where you were highlighted. Accepts a filter as an argument`,
  },
  "lock": {
    action: (arg, ans) => {
      Hue.stop_and_lock(false)
    },
    description: `Locks all media`,
  },
  "unlock": {
    action: (arg, ans) => {
      Hue.unlock()
    },
    description: `Unlocks all media`,
  },
  "stopandlock": {
    action: (arg, ans) => {
      Hue.stop_and_lock()
    },
    description: `Stops and locks all media`,
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
  "imagehistory": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_media_history("image", arg)
      } else {
        Hue.show_media_history("image")
      }
    },
    description: `Shows the image history. Accepts a filter as an argument`,
  },
  "tvhistory": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_media_history("tv", arg)
      } else {
        Hue.show_media_history("tv")
      }
    },
    description: `Shows the tv history. Accepts a filter as an argument`,
  },
  "lockimage": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"image", what:true, feedback:true})
    },
    description: `Locks the image`,
  },
  "locktv": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"tv", what:true, feedback:true})
    },
    description: `Locks the tv`,
  },
  "unlockimage": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"image", what:false, feedback:true})
    },
    description: `Unlocks the image`,
  },
  "unlocktv": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"tv", what:false, feedback:true})
    },
    description: `Unlocks the tv`,
  },
  "togglelockimage": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"image", feedback:true})
    },
    description: `Toggles between lock and unlock the image`,
  },
  "togglelocktv": {
    action: (arg, ans) => {
      Hue.change_media_lock({type:"tv", feedback:true})
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
  "maximizeimage": {
    action: (arg, ans) => {
      Hue.maximize_image()
    },
    description: `Maximize/Restore the image`,
  },
  "maximizetv": {
    action: (arg, ans) => {
      Hue.maximize_tv()
    },
    description: `Maximize/Restore the tv`,
  },
  "starttv": {
    action: (arg, ans) => {
      Hue.play_tv()
    },
    description: `Starts the tv`,
  },
  "stoptv": {
    action: (arg, ans) => {
      Hue.stop_tv(false)
    },
    description: `Stops the tv`,
  },
  "openimage": {
    action: (arg, ans) => {
      Hue.show_current_image_modal()
    },
    description: `Opens the image modal with the current image`,
  },
  "openlastimage": {
    action: (arg, ans) => {
      Hue.show_current_image_modal(false)
    },
    description: `Opens the image modal with the latest announced image`,
  },
  "date": {
    action: (arg, ans) => {
      Hue.show_current_date()
    },
    description: `Shows current date`,
  },
  "js": {
    action: (arg, ans) => {
      Hue.execute_javascript(arg)
    },
    description: `Executes a javascript operation`,
  },
  "js2": {
    action: (arg, ans) => {
      Hue.execute_javascript(arg, false)
    },
    description: `Executes a javascript operation without showing the result`,
  },
  "changeimage": {
    action: (arg, ans) => {
      Hue.show_image_picker()
    },
    description: `Opens window to change the image`,
  },
  "changetv": {
    action: (arg, ans) => {
      Hue.show_tv_picker()
    },
    description: `Opens the window to change the tv`,
  },
  "closeall": {
    action: (arg, ans) => {
      Hue.close_all_message()
    },
    description: `Closes all the modal windows and popups`,
  },
  "closeallmodals": {
    action: (arg, ans) => {
      Hue.close_all_modals()
    },
    description: `Closes all the modal windows`,
  },
  "closeallpopups": {
    action: (arg, ans) => {
      Hue.close_all_popups()
    },
    description: `Closes all the popups`,
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
  "globalsettings": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_global_settings(arg)
      } else {
        Hue.show_global_settings()
      }
    },
    description: `Shows the global settings window. Accepts a filter as an argument`,
  },
  "roomsettings": {
    action: (arg, ans) => {
      if (arg) {
        Hue.show_room_settings(arg)
      } else {
        Hue.show_room_settings()
      }
    },
    description: `Shows the room settings window. Accepts a filter as an argument`,
  },
  "goto": {
    action: (arg, ans) => {
      Hue.goto_url(arg, "tab")
    },
    description: `Goes to room ID or URL`,
  },
  "refreshimage": {
    action: (arg, ans) => {
      Hue.refresh_image()
    },
    description: `Loads the image again`,
  },
  "refreshtv": {
    action: (arg, ans) => {
      Hue.refresh_tv()
    },
    description: `Loads the tv again`,
  },
  "ping": {
    action: (arg, ans) => {
      Hue.ping_server()
    },
    description: `Pings the server and shows the delay from the moment it was sent to the moment it was received`,
  },
  "reactlike": {
    action: (arg, ans) => {
      Hue.send_reaction("like")
    },
    description: `Sends reaction "like"`,
  },
  "reactlove": {
    action: (arg, ans) => {
      Hue.send_reaction("love")
    },
    description: `Sends reaction "love"`,
  },
  "reacthappy": {
    action: (arg, ans) => {
      Hue.send_reaction("happy")
    },
    description: `Sends reaction "happy"`,
  },
  "reactmeh": {
    action: (arg, ans) => {
      Hue.send_reaction("meh")
    },
    description: `Sends reaction "meh"`,
  },
  "reactsad": {
    action: (arg, ans) => {
      Hue.send_reaction("sad")
    },
    description: `Sends reaction "sad"`,
  },
  "reactdislike": {
    action: (arg, ans) => {
      Hue.send_reaction("dislike")
    },
    description: `Sends reaction "dislike"`,
  },
  "f1": {
    action: (arg, ans) => {
      Hue.run_user_function(1)
      ans.to_history = false
    },
    description: `Runs User Function 1`,
  },
  "f2": {
    action: (arg, ans) => {
      Hue.run_user_function(2)
      ans.to_history = false
    },
    description: `Runs User Function 2`,
  },
  "f3": {
    action: (arg, ans) => {
      Hue.run_user_function(3)
      ans.to_history = false
    },
    description: `Runs User Function 3`,
  },
  "f4": {
    action: (arg, ans) => {
      Hue.run_user_function(4)
      ans.to_history = false
    },
    description: `Runs User Function 4`,
  },
  "f5": {
    action: (arg, ans) => {
      Hue.run_user_function(5)
      ans.to_history = false
    },
    description: `Runs User Function 5`,
  },
  "f6": {
    action: (arg, ans) => {
      Hue.run_user_function(6)
      ans.to_history = false
    },
    description: `Runs User Function 6`,
  },
  "f7": {
    action: (arg, ans) => {
      Hue.run_user_function(7)
      ans.to_history = false
    },
    description: `Runs User Function 7`,
  },
  "f8": {
    action: (arg, ans) => {
      Hue.run_user_function(8)
      ans.to_history = false
    },
    description: `Runs User Function 8`,
  },
  "lockscreen": {
    action: (arg, ans) => {
      Hue.lock_screen()
    },
    description: `Locks the screen`,
  },
  "unlockscreen": {
    action: (arg, ans) => {
      Hue.unlock_screen()
    },
    description: `Unlocks the screen`,
  },
  "togglelockscreen": {
    action: (arg, ans) => {
      if (Hue.screen_locked) {
        Hue.unlock_screen()
      } else {
        Hue.lock_screen()
      }
    },
    description: `Locks or unlocks the screen`,
  },
  "drawimage": {
    action: (arg, ans) => {
      Hue.open_draw_image()
    },
    description: `Opens the window to draw an image`,
  },
  "say": {
    action: (arg, ans) => {
      Hue.say_command(arg, ans)
    },
    description: `Sends a normal chat message. Useful if you want to make a chain of commands that starts with a message`,
  },
  "input": {
    action: (arg, ans) => {
      Hue.input_command(arg)
      ans.to_history = false
      ans.clr_input = false
    },
    description: `Adds text to the input`,
  },
  "top": {
    action: (arg, ans) => {
      Hue.goto_top(true)
    },
    description: `Scrolls the chat to the top`,
  },
  "top2": {
    action: (arg, ans) => {
      Hue.goto_top(false)
    },
    description: `Scrolls the chat to the top`,
  },
  "bottom": {
    action: (arg, ans) => {
      Hue.goto_bottom(true, true)
    },
    description: `Scrolls the chat to the bottom`,
  },
  "bottom2": {
    action: (arg, ans) => {
      Hue.goto_bottom(true, false)
    },
    description: `Scrolls the chat to the bottom without animating the scroll`,
  },
  "background": {
    action: (arg, ans) => {
      Hue.change_background_image_source(arg)
    },
    description: `Changes the background image to a specified URL`,
  },
  "whatis": {
    action: (arg, ans) => {
      Hue.inspect_command(arg)
    },
    description: `This can be used to inspect commands. If the command is an alias it will show what it is an alias of`,
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
  "modifysetting": {
    action: (arg, ans) => {
      Hue.modify_setting(arg)
    },
    description: `This can be used to change user settings directly. This requires the internal name of the setting and the value`,
  },
  "modifysetting2": {
    action: (arg, ans) => {
      Hue.modify_setting(arg, false)
    },
    description: `Same as ${Hue.config.commands_prefix}modifysetting but it doesn't show feedback on completion`,
  },
  "feedback": {
    action: (arg, ans) => {
      Hue.feedback(arg)
    },
    description: `Displays a simple feedback information message for the user`,
  },
  "imagemode": {
    action: (arg, ans) => {
      Hue.change_room_image_mode(arg)
    },
    description: `Changes the image mode. Valid modes include enabled, disabled, and locked`,
  },
  "tvmode": {
    action: (arg, ans) => {
      Hue.change_room_tv_mode(arg)
    },
    description: `Changes the tv mode. Valid modes include enabled, disabled, and locked`,
  },
  "theme": {
    action: (arg, ans) => {
      Hue.change_theme(arg)
    },
    description: `Changes the theme to a specified hex color`,
  },
  "thememode": {
    action: (arg, ans) => {
      Hue.change_theme_mode(arg)
    },
    description: `Changes the theme mode. Valid modes include automatic and custom`,
  },
  "textcolormode": {
    action: (arg, ans) => {
      Hue.change_text_color_mode(arg)
    },
    description: `Changes the text color mode. Valid modes include automatic, and custom`,
  },
  "textcolor": {
    action: (arg, ans) => {
      Hue.change_text_color(arg)
    },
    description: `Changes the text color to a specified hex color`,
  },
  "backgroundmode": {
    action: (arg, ans) => {
      Hue.change_background_mode(arg)
    },
    description: `Changes the background mode. Valid modes include normal, tiled, mirror, mirror_tiled, and solid`,
  },
  "backgroundeffect": {
    action: (arg, ans) => {
      Hue.change_background_effect(arg)
    },
    description: `Changes the background effect mode. Valid modes include none and blur`,
  },
  "tiledimensions": {
    action: (arg, ans) => {
      Hue.change_background_tile_dimensions(arg)
    },
    description: `Changes the dimension for tiled backgrounds`,
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
  "accesslog": {
    action: (arg, ans) => {
      if (arg) {
        Hue.request_access_log(arg)
      } else {
        Hue.request_access_log()
      }
    },
    description: `Shows the Access Log`,
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
  "unmaximize": {
    action: (arg, ans) => {
      Hue.unmaximize_media()
    },
    description: `Un-maximizes media`,
  },
  "maximizechat": {
    action: (arg, ans) => {
      Hue.toggle_media_area()
    },
    description: `Maximize/Restore the chat`,
  },
  "autoscrollup": {
    action: (arg, ans) => {
      Hue.autoscroll_up()
    },
    description: `Slowly scrolls chat up automatically`,
  },
  "autoscrolldown": {
    action: (arg, ans) => {
      Hue.autoscroll_down()
    },
    description: `Slowly scrolls chat down automatically`,
  },
  "loadnextimage": {
    action: (arg, ans) => {
      Hue.media_load_next("image")
    },
    description: `Loads the next image`,
  },
  "loadprevimage": {
    action: (arg, ans) => {
      Hue.media_load_previous("image")
    },
    description: `Loads the previous image`,
  },
  "loadnexttv": {
    action: (arg, ans) => {
      Hue.media_load_next("tv")
    },
    description: `Loads the next tv item`,
  },
  "loadprevtv": {
    action: (arg, ans) => {
      Hue.media_load_previous("tv")
    },
    description: `Loads the previous tv item`,
  },
  "bio": {
    action: (arg, ans) => {
      if (arg) {
        Hue.change_bio(arg)
      }
    },
    description: `Changes the user's bio`,
  },
  "badgeheart": {
    action: (arg, ans) => {
      if (arg) {
        Hue.send_badge(arg, "heart")
      }
    },
    description: `Sends a heart badge to a user`,
  },
  "badgeskull": {
    action: (arg, ans) => {
      if (arg) {
        Hue.send_badge(arg, "skull")
      }
    },
    description: `Sends a skull badge to a user`,
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
    description: `Syncs a TV video with another user's video progress`,
  },
  "mediainfo": {
    action: (arg, ans) => {
      Hue.change_media_info(arg)
    },
    description: `Changes the media info mode. Either enabled or disabled`,
  },
  "links": {
    action: (arg, ans) => {
      Hue.show_links()
    },
    description: `Custom chat search to show links`,
  },
  "messageboard": {
    action: (arg, ans) => {
      Hue.show_message_board(arg)
    },
    description: `Opens the message board. Accepts a filter as an argument`,
  },
  "clearmessageboard": {
    action: (arg, ans) => {
      Hue.clear_message_board()
    },
    description: `Deletes all message board posts`,
  },
  "swap": {
    action: (arg, ans) => {
      Hue.swap_display_positions_2()
    },
    description: `Shortcut to change media positions`,
  },
  "rotate": {
    action: (arg, ans) => {
      Hue.swap_media_layout_2()
    },
    description: `Shortcut to change media layout`,
  },
  "notebook": {
    action: (arg, ans) => {
      Hue.show_notebook()
    },
    description: `Opens the notebook`,
  },
  "note": {
    action: (arg, ans) => {
      if (arg) {
        Hue.add_to_notebook(arg)
      }
    },
    description: `Adds a note at the start of the notebook`,
  },
  "ignore": {
    action: (arg, ans) => {
      if (arg) {
        Hue.ignore_user(arg)
      }
    },
    description: `Adds a user to the ignored list`,
  },
  "unignore": {
    action: (arg, ans) => {
      if (arg) {
        Hue.unignore_user(arg)
      }
    },
    description: `Removes a user from the ignored list`,
  },
  "ignored": {
    action: (arg, ans) => {
      Hue.show_ignored()
    },
    description: `Shows the ignored list`,
  },
}

// Setups commands based on the commands object
// Makes sorted variations
// Checks if anagrams collide
Hue.setup_commands = function () {
  Hue.superuser_commands = [
    "systembroadcast",
    "systemrestart",
    "modusername",
    "annex"
  ]

  Hue.critical_commands = [
    "js",
    "js2",
    "changeusername",
    "changepassword",
    "changeemail",
    "logout"
  ]

  Hue.critical_commands.push(...Hue.superuser_commands)

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
    message[1] !== " " &&
    !message.startsWith(`${Hue.config.commands_prefix}me `) &&
    !message.startsWith(`${Hue.config.commands_prefix}em `)
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
  let needs_confirm = false

  if (cmd.startsWith(Hue.config.commands_prefix)) {
    cmd = cmd.substring(1)
  }

  if (Hue.superuser_commands.includes(cmd)) {
    if (!Hue.superuser) {
      Hue.feedback("You don't have permission to run that command")
      return ans
    } else {
      needs_confirm = true
    }
  }

  if (cmd.endsWith("?")) {
    cmd = cmd.slice(0, -1)
    needs_confirm = true
  }

  if (cmd.length < 2) {
    Hue.feedback("Invalid empty command")
    return ans
  }

  let cmd_sorted = cmd.split("").sort().join("")
  let command = Hue.commands_list_sorted_2[cmd_sorted]

  if (!command) {
    let closest_command = Hue.get_closest_command(cmd)

    if (closest_command) {
      command = closest_command
    } else {
      Hue.feedback(`Invalid command "${cmd}"`)
      return ans
    }
  }

  if (needs_confirm) {
    if (confirm(`Are you sure you want to execute ${command}?`)) {
      Hue.commands[command].action(arg, ans)
    } else {
      return ans
    }
  } else {
    Hue.commands[command].action(arg, ans)
  }

  return ans
}

// Executes commands from a setting
Hue.execute_commands = function (setting) {
  if (Hue.get_setting(setting)) {
    let cmds = Hue.get_setting(setting).split("\n")

    for (let cmd of cmds) {
      Hue.process_message({
        message: cmd,
        to_history: false,
        clr_input: false,
      })
    }
  }
}

// Starts the execution of a chain of commands
// Used with chained commands like '/a && /b && /c'
Hue.run_commands_queue = function (id) {
  let cmds = Hue.commands_queue[id]

  if (!cmds || cmds.length === 0) {
    delete Hue.commands_queue[id]
    return false
  }

  let cmd = cmds.shift()
  let lc_cmd = cmd.toLowerCase()

  let obj = {
    message: cmd,
    to_history: false,
    clr_input: false,
    callback: function () {
      Hue.run_commands_queue(id)
    },
  }

  if (lc_cmd.startsWith(`${Hue.config.commands_prefix}sleep`) || 
  lc_cmd === `${Hue.config.commands_prefix}sleep`) {
    let n = parseInt(lc_cmd.replace(`${Hue.config.commands_prefix}sleep `, ""))

    if (isNaN(n)) {
      n = 1000
    }

    setTimeout(function () {
      Hue.run_commands_queue(id)
    }, n)
  } else if (lc_cmd === `${Hue.config.commands_prefix}closeandwait`) {
    Hue.close_all_modals(function () {
      Hue.run_commands_queue(id)
    })
  } else if (lc_cmd === `${Hue.config.commands_prefix}inputenter`) {
    let val = $("#input").val()

    if (val.length > 0) {
      obj.message = val
      obj.clr_input = true
      Hue.process_message(obj)
    } else {
      Hue.run_commands_queue(id)
    }
  } else {
    Hue.process_message(obj)
  }
}

// Gives feedback on what type of command a command is
Hue.inspect_command = function (cmd) {
  if (!cmd.startsWith(Hue.config.commands_prefix)) {
    cmd = `${Hue.config.commands_prefix}${cmd}`
  }

  let s = cmd

  if (Hue.command_aliases[cmd] !== undefined) {
    s += ` is an alias to: "${Hue.command_aliases[cmd]}"`
  } else if (Hue.commands_list.includes(cmd)) {
    s += `: ${Hue.commands[cmd].description}`
  } else {
    s += ` is not a valid command`
  }

  Hue.feedback(s)
}

// Executes a remote command received through a whisper
// This only gets executed if the sender is whitelisted,
// for remote command execution
Hue.execute_whisper_command = function (data) {
  if (Hue.includes_critical_command(data.username, data.message)) {
    return false
  }

  Hue.feedback(`${data.username} executed "${data.message}" in your client`)

  Hue.process_message({
    message: data.message,
    to_history: false,
    clr_input: false,
  })
}

// Show the Commands window
Hue.show_commands = function (filter = "") {
  let commands = Hue.template_commands()
  let s = ""

  for (let key in Hue.commands) {
    let setting = Hue.commands[key]
    s += `<div class='info_item modal_item'>${key}: ${setting.description}</div>`
  }

  Hue.msg_info2.show(["Commands", commands])
  $("#commands_container").html(s)

  if (filter) {
    $("#commands_filter").val(filter)
    Hue.do_modal_filter()
  }
}

// Creates the command aliases object
// Used in autocomplete and command execution
// Command aliases are custom commands based on normal commands
Hue.setup_command_aliases = function () {
  let aliases = Hue.get_setting("aliases").split("\n")

  Hue.command_aliases = {}

  for (let alias of aliases) {
    let pieces = alias.split("=")

    if (pieces.length < 2) {
      continue
    }

    let name = pieces[0].trim()

    if (name.length < 2) {
      continue
    }

    if (name[0] === Hue.config.commands_prefix && 
    name[1] !== Hue.config.commands_prefix) {
      let body = pieces.slice(1).join("=").trim()
      Hue.command_aliases[name] = body
    }
  }
}

// Formats command alias to proper format upon save
Hue.format_command_aliases = function (cmds) {
  let aliases = cmds.split("\n")
  let s = ""

  for (let alias of aliases) {
    let pieces = alias.split("=")

    if (pieces.length < 2) {
      continue
    }

    let name = `${Hue.config.commands_prefix}${Hue.utilz.clean_string5(pieces[0]).replace(/\//g, "")}`

    if (name[0] !== Hue.config.commands_prefix) {
      name = `${Hue.config.commands_prefix}name`
    }

    let body = pieces.slice(1).join("=").trim()

    s += `${name} = ${body}\n`
  }

  return s.slice(0, -1)
}

// Checks if a remote command includes a forbidden critical command
Hue.includes_critical_command = function (username, message, announce = true) {
  let split = message.split(" ")

  for (let cmd of split) {
    let cmd2

    if (Hue.is_command(cmd)) {
      cmd2 = cmd.toLowerCase().split("").sort().join("").substring(1)
    } else {
      continue
    }

    for (let command of Hue.critical_commands) {
      if (Hue.command_sorted_equals(cmd2, command)) {
        if (announce) {
          Hue.feedback(
            `${username} attempted to run "${command}" in your client`
          )
        }

        return true
      }
    }
  }

  return false
}

// Gets the list of users from whom the user accepts remote command execution
// This allows a user to whitelist other users so they can execute commands for them through whispers
// This is dangerous and care should be taken to ensure this list is not exploited
Hue.get_accept_commands_from_list = function () {
  let list = Hue.get_setting("accept_commands_from").split("\n")

  if (list.length === 1 && !list[0]) {
    list = []
  }

  Hue.accept_commands_from_list = list
}

// Checks if a string, in any alphabetical order, matches a command
Hue.command_sorted_equals = function (str, what) {
  return str === Hue.commands_list_sorted[what]
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

  if (Hue.critical_commands.includes(highest_command)) {
    highest_command = false
  }

  return highest_command
}

// Process user's input messages
// Checks if it is a command and executes it
// Or sends a chat message to the server
Hue.process_message = function (args = {}) {
  let def_args = {
    message: "",
    to_history: true,
    clr_input: true,
    callback: false,
    edit_id: false,
    handle_url: true
  }

  args = Object.assign(def_args, args)

  let message_split = args.message.split("\n")
  let num_lines = message_split.length

  args.message = Hue.utilz.remove_multiple_empty_lines(args.message)
  args.message = Hue.utilz.untab_string(args.message).trimEnd()

  if (num_lines === 1 && Hue.is_command(args.message) && !args.edit_id) {
    let and_split = args.message.split(" && ")
    let lc_message = args.message.toLowerCase()
    let more_stuff

    if (lc_message.startsWith(`${Hue.config.commands_prefix}js `) || lc_message.startsWith(`${Hue.config.commands_prefix}js2 `)) {
      more_stuff = lc_message.includes(`${Hue.config.commands_prefix}endjs`)
    } else if (lc_message.startsWith(`${Hue.config.commands_prefix}input `)) {
      more_stuff = args.message.includes(`${Hue.config.commands_prefix}endinput`)
    } else if (
      lc_message.startsWith(`${Hue.config.commands_prefix}whisper `) ||
      lc_message.startsWith(`${Hue.config.commands_prefix}whisper2 `)
    ) {
      more_stuff = args.message.includes(`${Hue.config.commands_prefix}endwhisper`)
    } else {
      more_stuff = true
    }

    if (and_split.length > 1 && more_stuff) {
      if (args.to_history) {
        Hue.add_to_input_history(args.message)
      }

      Hue.clear_input()

      let ssplit = args.message.split(" ")
      let cmds = []
      let cmd = ""
      let cmd_mode = "normal"

      for (let p = 0; p < ssplit.length; p++) {
        let sp = ssplit[p]
        let lc_sp = sp.toLowerCase()

        if (cmd_mode === "js") {
          if (lc_sp === `${Hue.config.commands_prefix}endjs`) {
            cmds.push(cmd)
            cmd = ""
            cmd_mode = "normal"
          } else {
            cmd += ` ${sp}`
          }
        } else if (cmd_mode === "input") {
          if (lc_sp === `${Hue.config.commands_prefix}endinput`) {
            cmds.push(cmd)
            cmd = ""
            cmd_mode = "normal"
          } else {
            cmd += ` ${sp}`
          }
        } else if (cmd_mode === "whisper") {
          if (lc_sp === `${Hue.config.commands_prefix}endwhisper`) {
            cmds.push(cmd)
            cmd = ""
            cmd_mode = "normal"
          } else {
            cmd += ` ${sp}`
          }
        } else {
          if (Hue.command_aliases[sp] !== undefined) {
            ssplit.splice(p, 1, ...Hue.command_aliases[sp].split(" "))
            p -= 1
            continue
          }

          if (cmd === "") {
            if (sp !== "&&") {
              cmd = sp

              if (lc_sp === `${Hue.config.commands_prefix}js` || lc_sp === `${Hue.config.commands_prefix}js2`) {
                cmd_mode = "js"
              } else if (lc_sp === `${Hue.config.commands_prefix}input`) {
                cmd_mode = "input"
              } else if (lc_sp === `${Hue.config.commands_prefix}whisper` || lc_sp === `${Hue.config.commands_prefix}whisper2`) {
                cmd_mode = "whisper"
              }
            }
          } else {
            if (sp === "&&") {
              cmds.push(cmd)
              cmd = ""
            } else {
              cmd += ` ${sp}`
            }
          }
        }
      }

      if (cmd) {
        cmds.push(cmd)
      }

      let qcmax = 0
      let cqid

      while (true) {
        cqid = Hue.utilz.get_random_string(5) + Date.now()

        if (Hue.commands_queue[cqid] === undefined) {
          break
        }

        qcmax += 1

        if (qcmax >= 100) {
          if (args.callback) {
            return args.callback(false)
          } else {
            return false
          }
        }
      }

      Hue.commands_queue[cqid] = cmds
      Hue.run_commands_queue(cqid)

      if (args.callback) {
        return args.callback(true)
      } else {
        return true
      }
    }

    let msplit = args.message.split(" ")
    let alias_cmd = msplit[0].trim()
    let alias_cmd_2, needs_confirm

    if (alias_cmd.endsWith("?")) {
      alias_cmd_2 = alias_cmd.slice(0, -1)
      needs_confirm = true
    } else {
      alias_cmd_2 = alias_cmd
      needs_confirm = false
    }

    let alias = Hue.command_aliases[alias_cmd_2]

    if (alias !== undefined) {
      let alias_arg = msplit.slice(1).join(" ").trim()
      let full_alias = `${alias} ${alias_arg}`.trim()

      if (alias_cmd_2.startsWith(`${Hue.config.commands_prefix}X`)) {
        args.to_history = false
      }

      if (args.to_history) {
        Hue.add_to_input_history(args.message)
      }

      if (needs_confirm) {
        if (confirm(`Are you sure you want to execute ${alias_cmd_2}?`)) {
          Hue.process_message({
            message: full_alias,
            to_history: false,
            clr_input: args.clr_input,
          })
        } else {
          if (args.callback) {
            return args.callback(false)
          } else {
            return false
          }
        }
      } else {
        Hue.process_message({
          message: full_alias,
          to_history: false,
          clr_input: args.clr_input,
        })
      }
    } else {
      let ans = Hue.execute_command(args.message, {
        to_history: args.to_history,
        clr_input: args.clr_input,
      })

      args.to_history = ans.to_history
      args.clr_input = ans.clr_input
    }
  } else {
    if (Hue.can_chat) {
      if (args.message.length === 0) {
        Hue.clear_input()

        if (args.callback) {
          return args.callback(false)
        } else {
          return false
        }
      }

      if (num_lines > Hue.config.max_num_newlines) {
        if (args.callback) {
          return args.callback(false)
        } else {
          return false
        }
      }

      if (args.message.length > Hue.config.max_input_length) {
        args.message = args.message.substring(0, Hue.config.max_input_length)
      }

      if (Hue.get_setting("confirm_chat")) {
        if (!confirm("Are you sure you want to send a chat message here?")) {
          return
        }
      }

      Hue.socket_emit("sendchat", {
        message: args.message,
        edit_id: args.edit_id,
      })
    } else {
      Hue.cant_chat()
    }
  }

  if (args.to_history) {
    Hue.add_to_input_history(args.message)
  }

  if (args.clr_input) {
    Hue.clear_input()
  }

  if (args.callback) {
    return args.callback(true)
  } else {
    return true
  }
}