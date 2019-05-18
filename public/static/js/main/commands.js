// Commands object
// Used to populate the commands list
// Actions for each command are declared here
Hue.commands =
{
    "/clear":
    {
        action: (arg, ans) =>
        {
            Hue.clear_chat()
        },
        description: `Clears the chat`
    },
    "/clearinput":
    {
        action: (arg, ans) =>
        {
            Hue.clear_input()
        },
        description: `Clears the text input`
    },
    "/users":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_userlist_window("normal", arg)
            }

            else
            {
                Hue.show_userlist_window()
            }
        },
        description: `Shows the user list. Accepts a filter as an argument`
    },
    "/publicrooms":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.request_roomlist(arg, "public_roomlist")
            }

            else
            {
                Hue.request_roomlist("", "public_roomlist")
            }
        },
        description: `Shows the public room list. Accepts a filter as an argument`
    },
    "/visitedrooms":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.request_roomlist(arg, "visited_roomlist")
            }

            else
            {
                Hue.request_roomlist("", "visited_roomlist")
            }
        },
        description: `Shows the visited room list. Accepts a filter as an argument`
    },
    "/roomname":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.change_room_name(arg)
            }

            else
            {
                Hue.show_room()
            }
        },
        description: `Changes the name of the room`
    },
    "/roomnameedit":
    {
        action: (arg, ans) =>
        {
            Hue.room_name_edit()
            ans.to_history = false
            ans.clr_input = false
        },
        description: `Puts the room name in the input, ready to be edited`
    },
    "/played":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_played(arg)
            }

            else
            {
                Hue.show_played()
            }
        },
        description: `Shows the list of songs played. Accepts a filter as an argument`
    },
    "/search":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_chat_search(arg)
            }

            else
            {
                Hue.show_chat_search()
            }
        },
        description: `Opens the search window. Accepts a query as an argument`
    },
    "/clearsearches":
    {
        action: (arg, ans) =>
        {
            Hue.clear_chat_searches()
        },
        description: `Clears the saved recent searches`
    },
    "/role":
    {
        action: (arg, ans) =>
        {
            Hue.show_role()
        },
        description: `Shows your role and permissions`
    },
    "/voice1":
    {
        action: (arg, ans) =>
        {
            Hue.change_role(arg, "voice1")
        },
        description: `Gives voice 1 to a user`
    },
    "/voice2":
    {
        action: (arg, ans) =>
        {
            Hue.change_role(arg, "voice2")
        },
        description: `Gives voice 2 to a user`
    },
    "/voice3":
    {
        action: (arg, ans) =>
        {
            Hue.change_role(arg, "voice3")
        },
        description: `Gives voice 3 to a user`
    },
    "/voice4":
    {
        action: (arg, ans) =>
        {
            Hue.change_role(arg, "voice4")
        },
        description: `Gives voice 4 to a user`
    },
    "/op":
    {
        action: (arg, ans) =>
        {
            Hue.change_role(arg, "op")
        },
        description: `Gives op to a user. Ops can do anything an admin can do except more high level commands`
    },
    "/admin":
    {
        action: (arg, ans) =>
        {
            Hue.change_role(arg, "admin")
        },
        description: `Gives admin to a user. This gives a user the same rights as the original admin`
    },
    "/resetvoices":
    {
        action: (arg, ans) =>
        {
            Hue.reset_voices()
        },
        description: `Turns all voices above 1 to voice 1`
    },
    "/removeops":
    {
        action: (arg, ans) =>
        {
            Hue.remove_ops()
        },
        description: `Removes all op roles`
    },
    "/ban":
    {
        action: (arg, ans) =>
        {
            Hue.ban(arg)
        },
        description: `Bans a user from the room`
    },
    "/unban":
    {
        action: (arg, ans) =>
        {
            Hue.unban(arg)
        },
        description: `Unbans a user from the room`
    },
    "/unbanall":
    {
        action: (arg, ans) =>
        {
            Hue.unban_all()
        },
        description: `Removes all bans`
    },
    "/bancount":
    {
        action: (arg, ans) =>
        {
            Hue.get_ban_count()
        },
        description: `Displays the number of banned users in the room`
    },
    "/kick":
    {
        action: (arg, ans) =>
        {
            Hue.kick(arg)
        },
        description: `Kicks a user out of the room`
    },
    "/public":
    {
        action: (arg, ans) =>
        {
            Hue.change_privacy(true)
        },
        description: `Room appears in the public room list`
    },
    "/private":
    {
        action: (arg, ans) =>
        {
            Hue.change_privacy(false)
        },
        description: `Room doesn\'t appear in the public room list`
    },
    "/privacy":
    {
        action: (arg, ans) =>
        {
            Hue.show_public()
        },
        description: `Shows if a room is public or private`
    },
    "/log":
    {
        action: (arg, ans) =>
        {
            Hue.show_log()
        },
        description: `Shows if the log is enabled or disabled`
    },
    "/enablelog":
    {
        action: (arg, ans) =>
        {
            Hue.change_log(true)
        },
        description: `Enables logging of the room. Which allows users to see previous messages before they joined`
    },
    "/disablelog":
    {
        action: (arg, ans) =>
        {
            Hue.change_log(false)
        },
        description: `Disables logging`
    },
    "/clearlog":
    {
        action: (arg, ans) =>
        {
            Hue.clear_log("all")
        },
        description: `Removes all messages from the log and resets client state for all the users in the room`
    },
    "/radio":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.change_radio_source(arg)
            }

            else
            {
                Hue.show_media_source("radio")
            }
        },
        description: `Changes the radio using a search term or URL. "/radio restart" restarts the current radio for all users, in case it gets stuck. "/radio default" sets the radio to the site's default radio. "/radio prev" changes to the previous radio source`
    },
    "/tv":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.change_tv_source(arg)
            }

            else
            {
                Hue.show_media_source("tv")
            }
        },
        description: `Changes the TV using a search term or URL. "/tv restart" restarts the current video for all users, in case it gets stuck. To link a Youtube playlist the URL must be a pure playlist URL without a video ID. "/tv default" sets the tv to the site's default tv. "/tv prev" changes to the previous tv source`
    },
    "/image":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.change_image_source(arg)
            }

            else
            {
                Hue.show_media_source("image")
            }
        },
        description: `Sends an image to be uploaded by URL. "/image default" sets the image to the site's default image. "/image prev" changes to the previous image source`
    },
    "/status":
    {
        action: (arg, ans) =>
        {
            Hue.show_status()
        },
        description: `Shows the room status window`
    },
    "/topic":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.change_topic(arg)
            }

            else
            {
                Hue.show_topic()
            }
        },
        description: `Changes the topic of the room`
    },
    "/topicadd":
    {
        action: (arg, ans) =>
        {
            Hue.topicadd(arg)
        },
        description: `Adds a section at the end of the topic`
    },
    "/topictrim":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.topictrim(arg)
            }

            else
            {
                Hue.topictrim(1)
            }
        },
        description: `Removes a section from the end of the topic, where the optional x is the number of trims you want to do`
    },
    "/topicaddstart":
    {
        action: (arg, ans) =>
        {
            Hue.topicstart(arg)
        },
        description: `Adds a section at the start of the topic`
    },
    "/topictrimstart":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.topictrimstart(arg)
            }

            else
            {
                Hue.topictrimstart(1)
            }
        },
        description: `Removes a section from the start of the topic, where the optional x is the number of trims you want to do`
    },
    "/topicedit":
    {
        action: (arg, ans) =>
        {
            Hue.topicedit()
            ans.to_history = false
            ans.clr_input = false
        },
        description: `Puts the topic in the input, ready to be edited`
    },
    "/room":
    {
        action: (arg, ans) =>
        {
            Hue.show_room()
        },
        description: `Shows the room name`
    },
    "/help":
    {
        action: (arg, ans) =>
        {
            Hue.show_help()
        },
        description: `Shows Help`
    },
    "/commands":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_commands(arg)
            }

            else
            {
                Hue.show_commands()
            }
        },
        description: `Shows Commands`
    },
    "/stopradio":
    {
        action: (arg, ans) =>
        {
            Hue.stop_radio()
        },
        description: `Stops the radio`
    },
    "/startradio":
    {
        action: (arg, ans) =>
        {
            Hue.start_radio()
        },
        description: `Starts the radio`
    },
    "/radiovolume":
    {
        action: (arg, ans) =>
        {
            Hue.change_volume_command(arg, "radio")
        },
        description: `Changes the volume of the radio`
    },
    "/tvvolume":
    {
        action: (arg, ans) =>
        {
            Hue.change_volume_command(arg, "tv")
        },
        description: `Changes the volume of the tv`
    },
    "/volume":
    {
        action: (arg, ans) =>
        {
            Hue.change_volume_all(arg)
        },
        description: `Changes the volume of the radio and the tv`
    },
    "/inputhistory":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_input_history(arg)
            }

            else
            {
                Hue.show_input_history()
            }
        },
        description: `Shows the input history. Accepts a filter as an argument`
    },
    "/clearinputhistory":
    {
        action: (arg, ans) =>
        {
            Hue.clear_input_history()
        },
        description: `Clears the input history`
    },
    "/changeusername":
    {
        action: (arg, ans) =>
        {
            Hue.change_username(arg)
        },
        description: `Changes the account username`
    },
    "/changepassword":
    {
        action: (arg, ans) =>
        {
            Hue.change_password(arg)
        },
        description: `Changes the account password`
    },
    "/changeemail":
    {
        action: (arg, ans) =>
        {
            Hue.change_email(arg)
        },
        description: `Changes the account email`
    },
    "/verifyemail":
    {
        action: (arg, ans) =>
        {
            Hue.verify_email(arg)
        },
        description: `Used to verify an email email with a received code`
    },
    "/details":
    {
        action: (arg, ans) =>
        {
            Hue.show_details()
        },
        description: `Shows the account details`
    },
    "/logout":
    {
        action: (arg, ans) =>
        {
            Hue.logout()
        },
        description: `Ends the user session`
    },
    "/fill":
    {
        action: (arg, ans) =>
        {
            Hue.fill()
        },
        description: `Used for debugging purposes`
    },
    "/shrug":
    {
        action: (arg, ans) =>
        {
            Hue.shrug()
        },
        description: `Shows the shrug ascii`
    },
    "/afk":
    {
        action: (arg, ans) =>
        {
            Hue.show_afk()
        },
        description: `Shows that the user went AFK`
    },
    "/disconnectothers":
    {
        action: (arg, ans) =>
        {
            Hue.disconnect_others()
        },
        description: `Disconnects other connected account clients`
    },
    "/whisper":
    {
        action: (arg, ans) =>
        {
            Hue.process_write_whisper(arg, true)
        },
        description: `Opens a window to write a whisper to x user. If the argument contains the &gt; character it will use the inline method where the username is whatever is to the left of the &gt; and the message whatever is to the right of it, and send the message directly without using the window`
    },
    "/whisper2":
    {
        action: (arg, ans) =>
        {
            Hue.process_write_whisper(arg, false)
        },
        description: `Same as /whisper but it doesn't show feedback when sent through the inline format, for example "/whisper2 user > message". Useful for making calls to bots without filling your own chat too much`
    },
    "/whisperops":
    {
        action: (arg, ans) =>
        {
            Hue.write_popup_message(false, "ops")
        },
        description: `Opens a window to write a whisper to ops and admins`
    },
    "/broadcast":
    {
        action: (arg, ans) =>
        {
            Hue.write_popup_message(false, "room")
        },
        description: `Opens a window to write a message to be sent to the entire room`
    },
    "/systembroadcast":
    {
        action: (arg, ans) =>
        {
            Hue.write_popup_message(false, "system")
            ans.to_history = false
        },
        description: `(Only for superusers) Opens a window to write a message to be sent to the entire system`
    },
    "/systemrestart":
    {
        action: (arg, ans) =>
        {
            Hue.send_system_restart_signal()
            ans.to_history = false
        },
        description: `(Only for superusers) Sends a signal to every connected client to restart the application`
    },
    "/annex":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.annex(arg)
            }

            else
            {
                Hue.annex()
                ans.to_history = false
            }
        },
        description: `(Only for superusers) Used to change the user's role`
    },
    "/highlights":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_highlights(arg)
            }

            else
            {
                Hue.show_highlights()
            }
        },
        description: `Shows chat messages where you were highlighted. Accepts a filter as an argument`
    },
    "/lock":
    {
        action: (arg, ans) =>
        {
            Hue.stop_and_lock(false)
        },
        description: `Locks all media`
    },
    "/unlock":
    {
        action: (arg, ans) =>
        {
            Hue.default_media_state(false)
        },
        description: `Unlocks all media`
    },
    "/stopandlock":
    {
        action: (arg, ans) =>
        {
            Hue.stop_and_lock()
        },
        description: `Stops and locks all media`
    },
    "/stop":
    {
        action: (arg, ans) =>
        {
            Hue.stop_media()
        },
        description: `Stops all media`
    },
    "/default":
    {
        action: (arg, ans) =>
        {
            Hue.default_media_state()
        },
        description: `Sets media visibility and locks to the default state`
    },
    "/roommenu":
    {
        action: (arg, ans) =>
        {
            Hue.show_room_menu()
        },
        description: `Shows the room menu`
    },
    "/usermenu":
    {
        action: (arg, ans) =>
        {
            Hue.show_user_menu()
        },
        description: `Shows the user menu`
    },
    "/mediamenu":
    {
        action: (arg, ans) =>
        {
            Hue.show_media_menu()
        },
        description: `Shows the media menu`
    },
    "/imagehistory":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_media_history("image", arg)
            }

            else
            {
                Hue.show_media_history("image")
            }
        },
        description: `Shows the image history. Accepts a filter as an argument`
    },
    "/tvhistory":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_media_history("tv", arg)
            }

            else
            {
                Hue.show_media_history("tv")
            }
        },
        description: `Shows the tv history. Accepts a filter as an argument`
    },
    "/radiohistory":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_media_history("radio", arg)
            }

            else
            {
                Hue.show_media_history("radio")
            }
        },
        description: `Shows the radio history. Accepts a filter as an argument`
    },
    "/lockimages":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_images(true)
        },
        description: `Locks images`
    },
    "/locktv":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_tv(true)
        },
        description: `Locks the tv`
    },
    "/lockradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_radio(true)
        },
        description: `Locks the radio`
    },
    "/unlockimages":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_images(false)
        },
        description: `Unlocks images`
    },
    "/unlocktv":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_tv(false)
        },
        description: `Unlocks the tv`
    },
    "/unlockradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_radio(false)
        },
        description: `Unlocks the radio`
    },
    "/togglelockimages":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_images()
        },
        description: `Toggles between lock and unlock images`
    },
    "/togglelocktv":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_tv()
        },
        description: `Toggles between lock and unlock the tv`
    },
    "/togglelockradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_lock_radio()
        },
        description: `Toggles between lock and unlock the radio`
    },
    "/showimages":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_images(true)
        },
        description: `Makes images visible and active`
    },
    "/showtv":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_tv(true)
        },
        description: `Makes the tv visible and active`
    },
    "/showradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_radio(true)
        },
        description: `Makes the radio images visible and active`
    },
    "/hideimages":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_images(false)
        },
        description: `Makes images invisible and inactive`
    },
    "/hidetv":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_tv(false)
        },
        description: `Makes the tv invisible and inactive`
    },
    "/hideradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_radio(false)
        },
        description: `Makes the radio images invisible and inactive`
    },
    "/toggleimages":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_images()
        },
        description: `Toggles between show and hide images`
    },
    "/toggletv":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_tv()
        },
        description: `Toggles between show and hide the tv`
    },
    "/toggleradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_radio()
        },
        description: `Toggles between show and hide the radio`
    },
    "/maximizeimages":
    {
        action: (arg, ans) =>
        {
            Hue.maximize_images()
        },
        description: `Maximize/Restore images`
    },
    "/maximizetv":
    {
        action: (arg, ans) =>
        {
            Hue.maximize_tv()
        },
        description: `Maximize/Restore the tv`
    },
    "/starttv":
    {
        action: (arg, ans) =>
        {
            Hue.play_tv()
        },
        description: `Starts the tv`
    },
    "/stoptv":
    {
        action: (arg, ans) =>
        {
            Hue.stop_tv()
        },
        description: `Stops the tv`
    },
    "/openimage":
    {
        action: (arg, ans) =>
        {
            Hue.show_current_image_modal()
        },
        description: `Opens the image modal with the current image`
    },
    "/openlastimage":
    {
        action: (arg, ans) =>
        {
            Hue.show_current_image_modal(false)
        },
        description: `Opens the image modal with the latest announced image`
    },
    "/date":
    {
        action: (arg, ans) =>
        {
            Hue.show_current_date()
        },
        description: `Shows current date`
    },
    "/js":
    {
        action: (arg, ans) =>
        {
            Hue.execute_javascript(arg)
        },
        description: `Executes a javascript operation`
    },
    "/js2":
    {
        action: (arg, ans) =>
        {
            Hue.execute_javascript(arg, false)
        },
        description: `Executes a javascript operation without showing the result`
    },
    "/changeimage":
    {
        action: (arg, ans) =>
        {
            Hue.show_image_picker()
        },
        description: `Opens window to change the image`
    },
    "/changetv":
    {
        action: (arg, ans) =>
        {
            Hue.show_tv_picker()
        },
        description: `Opens the window to change the tv`
    },
    "/changeradio":
    {
        action: (arg, ans) =>
        {
            Hue.show_radio_picker()
        },
        description: `Opens the window to change the radio`
    },
    "/closeall":
    {
        action: (arg, ans) =>
        {
            Hue.close_all_message()
        },
        description: `Closes all the modal windows and popups`
    },
    "/closeallmodals":
    {
        action: (arg, ans) =>
        {
            Hue.close_all_modals()
        },
        description: `Closes all the modal windows`
    },
    "/closeallpopups":
    {
        action: (arg, ans) =>
        {
            Hue.close_all_popups()
        },
        description: `Closes all the popups`
    },
    "/activityabove":
    {
        action: (arg, ans) =>
        {
            Hue.activity_above(true)
        },
        description: `Scrolls chat to activity pertaining you above`
    },
    "/activityabove2":
    {
        action: (arg, ans) =>
        {
            Hue.activity_above(false)
        },
        description: `Scrolls chat to activity pertaining you above without animating the scroll`
    },
    "/activitybelow":
    {
        action: (arg, ans) =>
        {
            Hue.activity_below(true)
        },
        description: `Scrolls chat to activity pertaining you below`
    },
    "/activitybelow2":
    {
        action: (arg, ans) =>
        {
            Hue.activity_below(false)
        },
        description: `Scrolls chat to activity pertaining you below without animating the scroll`
    },
    "/globalsettings":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_global_settings(arg)
            }

            else
            {
                Hue.show_global_settings()
            }
        },
        description: `Shows the global settings window. Accepts a filter as an argument`
    },
    "/roomsettings":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.show_room_settings(arg)
            }

            else
            {
                Hue.show_room_settings()
            }
        },
        description: `Shows the room settings window. Accepts a filter as an argument`
    },
    "/goto":
    {
        action: (arg, ans) =>
        {
            Hue.goto_url(arg, "tab")
        },
        description: `Goes to room ID or URL`
    },
    "/toggleplayradio":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_play_radio()
        },
        description: `Starts or stops the radio`
    },
    "/refreshimage":
    {
        action: (arg, ans) =>
        {
            Hue.refresh_image()
        },
        description: `Loads the image again`
    },
    "/refreshtv":
    {
        action: (arg, ans) =>
        {
            Hue.refresh_tv()
        },
        description: `Loads the tv again`
    },
    "/refreshradio":
    {
        action: (arg, ans) =>
        {
            Hue.refresh_radio()
        },
        description: `Loads the radio again`
    },
    "/stopradioin":
    {
        action: (arg, ans) =>
        {
            Hue.stop_radio_in(arg)
        },
        description: `Stops the radio automatically after the given x minutes`
    },
    "/ping":
    {
        action: (arg, ans) =>
        {
            Hue.ping_server()
        },
        description: `Pings the server and shows the delay from the moment it was sent to the moment it was received`
    },
    "/reactlike":
    {
        action: (arg, ans) =>
        {
            Hue.send_reaction("like")
        },
        description: `Sends reaction "like"`
    },
    "/reactlove":
    {
        action: (arg, ans) =>
        {
            Hue.send_reaction("love")
        },
        description: `Sends reaction "love"`
    },
    "/reacthappy":
    {
        action: (arg, ans) =>
        {
            Hue.send_reaction("happy")
        },
        description: `Sends reaction "happy"`
    },
    "/reactmeh":
    {
        action: (arg, ans) =>
        {
            Hue.send_reaction("meh")
        },
        description: `Sends reaction "meh"`
    },
    "/reactsad":
    {
        action: (arg, ans) =>
        {
            Hue.send_reaction("sad")
        },
        description: `Sends reaction "sad"`
    },
    "/reactdislike":
    {
        action: (arg, ans) =>
        {
            Hue.send_reaction("dislike")
        },
        description: `Sends reaction "dislike"`
    },
    "/f1":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(1)
            ans.to_history = false
        },
        description: `Runs User Function 1`
    },
    "/f2":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(2)
            ans.to_history = false
        },
        description: `Runs User Function 2`
    },
    "/f3":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(3)
            ans.to_history = false
        },
        description: `Runs User Function 3`
    },
    "/f4":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(4)
            ans.to_history = false
        },
        description: `Runs User Function 4`
    },
    "/f5":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(5)
            ans.to_history = false
        },
        description: `Runs User Function 5`
    },
    "/f6":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(6)
            ans.to_history = false
        },
        description: `Runs User Function 6`
    },
    "/f7":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(7)
            ans.to_history = false
        },
        description: `Runs User Function 7`
    },
    "/f8":
    {
        action: (arg, ans) =>
        {
            Hue.run_user_function(8)
            ans.to_history = false
        },
        description: `Runs User Function 8`
    },
    "/lockscreen":
    {
        action: (arg, ans) =>
        {
            Hue.lock_screen()
        },
        description: `Locks the screen`
    },
    "/unlockscreen":
    {
        action: (arg, ans) =>
        {
            Hue.unlock_screen()
        },
        description: `Unlocks the screen`
    },
    "/togglelockscreen":
    {
        action: (arg, ans) =>
        {
            if(Hue.room_state.screen_locked)
            {
                Hue.unlock_screen()
            }

            else
            {
                Hue.lock_screen()
            }
        },
        description: `Locks or unlocks the screen`
    },
    "/drawimage":
    {
        action: (arg, ans) =>
        {
            Hue.open_draw_image()
        },
        description: `Opens the window to draw an image`
    },
    "/say":
    {
        action: (arg, ans) =>
        {
            Hue.say_command(arg, ans)
        },
        description: `Sends a normal chat message. Useful if you want to make a chain of commands that starts with a message`
    },
    "/input":
    {
        action: (arg, ans) =>
        {
            Hue.input_command(arg)
            ans.to_history = false
            ans.clr_input = false
        },
        description: `Adds text to the input`
    },
    "/top":
    {
        action: (arg, ans) =>
        {
            Hue.goto_top(true)
        },
        description: `Scrolls the chat to the top`
    },
    "top2":
    {
        action: (arg, ans) =>
        {
            Hue.goto_top(false)
        },
        description: `Scrolls the chat to the top`
    },
    "/bottom":
    {
        action: (arg, ans) =>
        {
            Hue.goto_bottom(true, true)
        },
        description: `Scrolls the chat to the bottom`
    },
    "/bottom2":
    {
        action: (arg, ans) =>
        {
            Hue.goto_bottom(true, false)
        },
        description: `Scrolls the chat to the bottom without animating the scroll`
    },
    "/background":
    {
        action: (arg, ans) =>
        {
            Hue.change_background_image_source(arg)
        },
        description: `Changes the background image to a specified URL`
    },
    "/whatis":
    {
        action: (arg, ans) =>
        {
            Hue.inspect_command(arg)
        },
        description: `This can be used to inspect commands. If the command is an alias it will show what it is an alias of`
    },
    "/refresh":
    {
        action: (arg, ans) =>
        {
            Hue.restart_client()
        },
        description: `Refreshes/Restarts the client`
    },
    "/modifysetting":
    {
        action: (arg, ans) =>
        {
            Hue.modify_setting(arg)
        },
        description: `This can be used to change user settings directly. This requires the internal name of the setting and the value`
    },
    "/modifysetting2":
    {
        action: (arg, ans) =>
        {
            Hue.modify_setting(arg, false)
        },
        description: `Same as /modifysetting but it doesn't show feedback on completion`
    },
    "/feedback":
    {
        action: (arg, ans) =>
        {
            Hue.feedback(arg)
        },
        description: `Displays a simple feedback information message for the user`
    },
    "/imagesmode":
    {
        action: (arg, ans) =>
        {
            Hue.change_room_images_mode(arg)
        },
        description: `Changes the images mode. Valid modes include enabled, disabled, and locked`
    },
    "/tvmode":
    {
        action: (arg, ans) =>
        {
            Hue.change_room_tv_mode(arg)
        },
        description: `Changes the tv mode. Valid modes include enabled, disabled, and locked`
    },
    "/radiomode":
    {
        action: (arg, ans) =>
        {
            Hue.change_room_radio_mode(arg)
        },
        description: `Changes the radio mode. Valid modes include enabled, disabled, and locked`
    },
    "/theme":
    {
        action: (arg, ans) =>
        {
            Hue.change_theme(arg)
        },
        description: `Changes the theme to a specified hex color`
    },
    "/thememode":
    {
        action: (arg, ans) =>
        {
            Hue.change_theme_mode(arg)
        },
        description: `Changes the theme mode. Valid modes include automatic and custom`
    },
    "/textcolormode":
    {
        action: (arg, ans) =>
        {
            Hue.change_text_color_mode(arg)
        },
        description: `Changes the text color mode. Valid modes include automatic, and custom`
    },
    "/textcolor":
    {
        action: (arg, ans) =>
        {
            Hue.change_text_color(arg)
        },
        description: `Changes the text color to a specified hex color`
    },
    "/backgroundmode":
    {
        action: (arg, ans) =>
        {
            Hue.change_background_mode(arg)
        },
        description: `Changes the background mode. Valid modes include normal, tiled, mirror, mirror_tiled, and solid`
    },
    "/backgroundeffect":
    {
        action: (arg, ans) =>
        {
            Hue.change_background_effect(arg)
        },
        description: `Changes the background effect mode. Valid modes include none and blur`
    },
    "/tiledimensions":
    {
        action: (arg, ans) =>
        {
            Hue.change_background_tile_dimensions(arg)
        },
        description: `Changes the dimension for tiled backgrounds`
    },
    "/adminactivity":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.request_admin_activity(arg)
            }

            else
            {
                Hue.request_admin_activity()
            }
        },
        description: `Shows recent activity by ops and admins. Accepts a filter as an argument`
    },
    "/accesslog":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.request_access_log(arg)
            }

            else
            {
                Hue.request_access_log()
            }
        },
        description: `Shows the Access Log`
    },
    "/togglefontsize":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_chat_font_size()
        },
        description: `Toggles chat font size between normal, big, and very big`
    },
    "/adminlist":
    {
        action: (arg, ans) =>
        {
            Hue.request_admin_list()
        },
        description: `Shows the list of ops and admins of the room`
    },
    "/banlist":
    {
        action: (arg, ans) =>
        {
            Hue.request_ban_list()
        },
        description: `Displays a list of banned users`
    },
    "/synthkey":
    {
        action: (arg, ans) =>
        {
            Hue.send_synth_key(arg)
        },
        description: `Plays the synth key with that number`
    },
    "/synthkeylocal":
    {
        action: (arg, ans) =>
        {
            Hue.play_synth_key(arg)
        },
        description: `Plays the synth key only for the user`
    },
    "/togglemutesynth":
    {
        action: (arg, ans) =>
        {
            Hue.set_synth_muted()
        },
        description: `Mutes or unmutes the synth`
    },
    "/speak":
    {
        action: (arg, ans) =>
        {
            Hue.send_synth_voice(arg)
        },
        description: `Makes the voice synth say some text`
    },
    "/speaklocal":
    {
        action: (arg, ans) =>
        {
            Hue.play_synth_voice(arg, Hue.username, true)
        },
        description: `Makes the voice synth say some text only for that user`
    },
    "/speech":
    {
        action: (arg, ans) =>
        {
            Hue.play_speech(arg)
        },
        description: `Plays one of the configured speeches`
    },
    "/unmaximize":
    {
        action: (arg, ans) =>
        {
            Hue.unmaximize_media()
        },
        description: `Un-maximizes media`
    },
    "/maximizechat":
    {
        action: (arg, ans) =>
        {
            Hue.toggle_media()
        },
        description: `Maximize/Restore the chat`
    },
    "/autoscrollup":
    {
        action: (arg, ans) =>
        {
            Hue.autoscroll_up()
        },
        description: `Slowly scrolls chat up automatically`
    },
    "/autoscrolldown":
    {
        action: (arg, ans) =>
        {
            Hue.autoscroll_down()
        },
        description: `Slowly scrolls chat down automatically`
    },
    "/loadnextimage":
    {
        action: (arg, ans) =>
        {
            Hue.media_load_next("images")
        },
        description: `Loads the next image`
    },
    "/loadprevimage":
    {
        action: (arg, ans) =>
        {
            Hue.media_load_previous("images")
        },
        description: `Loads the previous image`
    },
    "/loadnexttv":
    {
        action: (arg, ans) =>
        {
            Hue.media_load_next("tv")
        },
        description: `Loads the next tv item`
    },
    "/loadprevtv":
    {
        action: (arg, ans) =>
        {
            Hue.media_load_previous("tv")
        },
        description: `Loads the previous tv item`
    },
    "/loadnextradio":
    {
        action: (arg, ans) =>
        {
            Hue.media_load_next("radio")
        },
        description: `Loads the next radio item`
    },
    "/loadprevradio":
    {
        action: (arg, ans) =>
        {
            Hue.media_load_previous("radio")
        },
        description: `Loads the previous radio item`
    },
    "/calc":
    {
        action: (arg, ans) =>
        {
            Hue.do_math_calculation(arg)
        },
        description: `Does a mathematical calculation`
    },
    "/bio":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.change_bio(arg)
            }
        },
        description: `Changes the user's bio`
    },
    "/badgeheart":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.send_badge(arg, "heart")
            }
        },
        description: `Sends a heart badge to a user`
    },
    "/badgeskull":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.send_badge(arg, "skull")
            }
        },
        description: `Sends a skull badge to a user`
    },
    "/notifications":
    {
        action: (arg, ans) =>
        {
            Hue.show_notifications(arg)
        },
        description: `Opens the notifications window. Accepts a filter as an argument`
    },
    "/whispers":
    {
        action: (arg, ans) =>
        {
            Hue.show_whispers(arg)
        },
        description: `Opens the whispers window. Accepts a filter as an argument`
    },
    "/synctv":
    {
        action: (arg, ans) =>
        {
            if(arg)
            {
                Hue.sync_tv(arg)
            }
        },
        description: `Syncs a TV video with another user's video progress`
    },
    "/mediainfo":
    {
        action: (arg, ans) =>
        {
            Hue.change_media_info(arg)
        },
        description: `Changes the media info mode. Either enabled or disabled`
    },
    "/links":
    {
        action: (arg, ans) =>
        {
            Hue.show_links()
        },
        description: `Custom chat search to show links`
    },
    "/messageboard":
    {
        action: (arg, ans) =>
        {
            Hue.show_message_board()
        },
        description: `Opens the message board`
    }
}

// Setups commands based on the commands object
// Makes sorted variations
// Checks if anagrams collide
Hue.setup_commands = function()
{
    Hue.commands_list = []

    for(let key in Hue.commands)
    {
        Hue.commands_list.push(key)
    }

    Hue.commands_list.sort()

    for(let command of Hue.commands_list)
    {
        let sorted = command.split('').sort().join('')
        Hue.commands_list_sorted[command] = sorted
        Hue.commands_list_sorted_2[sorted] = command
    }

    for(let key in Hue.commands_list_sorted)
    {
        let scmd1 = Hue.commands_list_sorted[key]

        for(let key2 in Hue.commands_list_sorted)
        {
            let scmd2 = Hue.commands_list_sorted[key2]

            if(key !== key2)
            {
                if(scmd1 === scmd2)
                {
                    console.error(`Command anagrams detected. ${key} and ${key2}`)
                }
            }
        }
    }
}

// Checks whether some string is a command
Hue.is_command = function(message)
{
    if(message.length >= 2
    && message[0] === "/"
    && message[1] !== "/"
    && message[1] !== " "
    && !message.startsWith("/me ")
    && !message.startsWith("/em "))
    {
        return true
    }

    return false
}

// Responsible of executing a command
// It will check the commands object to see if a command matches
// Executes the declared action
Hue.execute_command = function(message, ans)
{
    let split = message.split(' ')
    let cmd = split[0].toLowerCase()
    let arg = split.slice(1).join(" ")
    let needs_confirm = false

    if(cmd.endsWith("?"))
    {
        cmd = cmd.slice(0, -1)
        needs_confirm = true
    }

    if(cmd.length < 2)
    {
        Hue.feedback("Invalid empty command")
        return ans
    }

    let cmd_sorted = cmd.split('').sort().join('')
    let command = Hue.commands_list_sorted_2[cmd_sorted]

    if(!command)
    {
        Hue.feedback(`Invalid command "${cmd.slice(1)}". Maybe it is missing an argument. To start a message with / use //`)
        return ans
    }

    if(needs_confirm)
    {
        if(confirm(`Are you sure you want to execute ${command}?`))
        {
            Hue.commands[command].action(arg, ans)
        }

        else
        {
            return ans
        }
    }

    else
    {
        Hue.commands[command].action(arg, ans)
    }

    return ans
}

// Executes commands from a setting
Hue.execute_commands = function(setting)
{
    if(Hue.get_setting(setting))
    {
        let cmds = Hue.get_setting(setting).split('\n')

        for(let cmd of cmds)
        {
            Hue.process_message(
            {
                message: cmd,
                to_history: false,
                clr_input: false
            })
        }
    }
}

// Starts the execution of a chain of commands
// Used with chained commands like '/a && /b && /c'
Hue.run_commands_queue = function(id)
{
    let cmds = Hue.commands_queue[id]

    if(!cmds || cmds.length === 0)
    {
        delete Hue.commands_queue[id]
        return false
    }

    let cmd = cmds.shift()
    let lc_cmd = cmd.toLowerCase()

    let obj =
    {
        message: cmd,
        to_history: false,
        clr_input: false,
        callback: function()
        {
            Hue.run_commands_queue(id)
        }
    }

    if(lc_cmd.startsWith("/sleep") || lc_cmd === "/sleep")
    {
        let n = parseInt(lc_cmd.replace("/sleep ", ""))

        if(isNaN(n))
        {
            n = 1000
        }

        setTimeout(function()
        {
            Hue.run_commands_queue(id)
        }, n)
    }

    else if(lc_cmd === "/closeandwait")
    {
        Hue.close_all_modals(function()
        {
            Hue.run_commands_queue(id)
        })
    }

    else if(lc_cmd === "/inputenter")
    {
        let val = $('#input').val()

        if(val.length > 0)
        {
            obj.message = val
            obj.clr_input = true
            Hue.process_message(obj)
        }

        else
        {
            Hue.run_commands_queue(id)
        }
    }

    else
    {
        Hue.process_message(obj)
    }
}

// Gives feedback on what type of command a command is
Hue.inspect_command = function(cmd)
{
    if(!cmd.startsWith("/"))
    {
        cmd = `/${cmd}`
    }

    let s = cmd

    if(Hue.command_aliases[cmd] !== undefined)
    {
        s += ` is an alias to: "${Hue.command_aliases[cmd]}"`
    }

    else if(Hue.commands_list.includes(cmd))
    {
        s += `: ${Hue.commands[cmd].description}`
    }

    else
    {
        s += ` is not a valid command`
    }

    Hue.feedback(s)
}

// Executes a remote command received through a whisper
// This only gets executed if the sender is whitelisted,
// for remote command execution
Hue.execute_whisper_command = function(username, message)
{
    if(Hue.includes_critical_command(username, message))
    {
        return false
    }

    Hue.feedback(`${username} executed "${message}" in your client`)

    Hue.process_message(
    {
        message: message,
        to_history: false,
        clr_input: false
    })
}

// Show the Commands window
Hue.show_commands = function(filter="")
{
    let commands = Hue.template_commands()
    let s = ""

    for(let key in Hue.commands)
    {
        let setting = Hue.commands[key]
        s += `<div class='info_item modal_item'>${key}: ${setting.description}</div>`
    }

    Hue.msg_info2.show(["Commands", commands])
    $("#commands_container").html(s)

    if(filter)
    {
        $("#commands_filter").val(filter)
        Hue.do_modal_filter()
    }
}

// Creates the command aliases object
// Used in autocomplete and command execution
// Command aliases are custom commands based on normal commands
Hue.setup_command_aliases = function()
{
    let aliases = Hue.get_setting("aliases").split("\n")

    Hue.command_aliases = {}

    for(let alias of aliases)
    {
        let pieces = alias.split("=")

        if(pieces.length < 2)
        {
            continue
        }

        let name = pieces[0].trim()

        if(name.length < 2)
        {
            continue
        }

        if(name[0] === "/" && name[1] !== "/")
        {
            let body = pieces.slice(1).join("=").trim()
            Hue.command_aliases[name] = body
        }
    }
}

// Formats command alias to proper format upon save
Hue.format_command_aliases = function(cmds)
{
    let aliases = cmds.split("\n")
    let s = ""

    for(let alias of aliases)
    {
        let pieces = alias.split("=")

        if(pieces.length < 2)
        {
            continue
        }

        let name = `/${Hue.utilz.clean_string5(pieces[0]).replace(/\//g, "")}`

        if(name[0] !== "/")
        {
            name = "/" + name
        }

        let body = pieces.slice(1).join("=").trim()

        s += `${name} = ${body}\n`
    }

    return s.slice(0, -1)
}

// Checks if a remote command includes a forbidden critical command
Hue.includes_critical_command = function(username, message, announce=true)
{
    let commands =
    [
        "/js",
        "/js2",
        "/changeusername",
        "/changepassword",
        "/changeemail",
        "/systembroadcast",
        "/systemrestart",
        "/annex"
    ]

    let split = message.split(" ")

    for(let cmd of split)
    {
        let cmd2

        if(Hue.is_command(cmd))
        {
            cmd2 = cmd.toLowerCase().split('').sort().join('')
        }

        else
        {
            continue
        }

        for(let command of commands)
        {
            if(Hue.command_sorted_equals(cmd2, command))
            {
                if(announce)
                {
                    Hue.feedback(`${username} attempted to run "${command}" in your client`)
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
Hue.get_accept_commands_from_list = function()
{
    let list = Hue.get_setting("accept_commands_from").split("\n")

    if(list.length === 1 && !list[0])
    {
        list = []
    }

    Hue.accept_commands_from_list = list
}

// Checks if a string, in any alphabetical order, matches a command
Hue.command_sorted_equals = function(str, what)
{
    return str === Hue.commands_list_sorted[what]
}