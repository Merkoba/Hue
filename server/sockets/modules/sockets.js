module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Checks if the user is already connected through another socket
    handler.user_already_connected = function(socket)
    {
        try
        {
            if(io.sockets.adapter.rooms[socket.hue_room_id] === undefined)
            {
                return false
            }

            let sockets = handler.get_room_sockets(socket.hue_room_id)

            for(let socc of sockets)
            {
                if(socc.id !== socket.id && socc.hue_user_id === socket.hue_user_id)
                {
                    return true
                }
            }

            return false
        }

        catch(err)
        {
            logger.log_error(err)
        }
    }

    // Returns the list of sockets of a user in a room, by user id
    handler.get_user_sockets_per_room = function(room_id, user_id)
    {
        try
        {
            let clients = []
            let sockets = handler.get_room_sockets(room_id)

            for(let socc of sockets)
            {
                if(socc.hue_user_id === user_id)
                {
                    clients.push(socc)
                }
            }

            return clients
        }

        catch(err)
        {
            logger.log_error(err)
        }
    }

    // Returns the list of sockets of a user in a room, by username
    handler.get_user_sockets_per_room_by_username = function(room_id, username)
    {
        try
        {
            let clients = []
            let sockets = handler.get_room_sockets(room_id)

            for(let socc of sockets)
            {
                if(socc.hue_username === username)
                {
                    clients.push(socc)
                }
            }

            return clients
        }

        catch(err)
        {
            logger.log_error(err)
        }
    }

    // Gets the list of sockets of a room
    handler.get_room_sockets = function(room_id)
    {
        try
        {
            let sockets = []
            let ids = Object.keys(io.sockets.adapter.rooms[room_id].sockets)

            for(let id of ids)
            {
                let socc = io.sockets.connected[id]

                if(socc)
                {
                    sockets.push(socc)
                }
            }

            return sockets
        }

        catch(err)
        {
            logger.log_error(err)
        }
    }

    // Checks if a user exceeds the maximum amounts of sockets allowed per room
    handler.check_socket_limit = function(socket)
    {
        try
        {
            let num = 0
            let rooms = vars.user_rooms[socket.hue_user_id]

            if(!rooms)
            {
                return false
            }

            for(let room_id of rooms)
            {
                num += handler.get_user_sockets_per_room(room_id, socket.hue_user_id).length
            }

            if(num > config.max_sockets_per_user)
            {
                return true
            }

            else
            {
                return false
            }
        }

        catch(err)
        {
            logger.log_error(err)
            return true
        }
    }

    // Checks if a user has multiple simultaneous join attempts
    handler.check_multipe_joins = function(socket)
    {
        try
        {
            let sockets = handler.get_room_sockets(socket.hue_room_id)

            for(let socc of sockets)
            {
                if(socc.hue_user_id !== undefined)
                {
                    if(socc.id !== socket.id && socc.hue_user_id === socket.hue_user_id)
                    {
                        if(socc.hue_joining === true)
                        {
                            return true
                        }
                    }
                }
            }
        }

        catch(err)
        {
            logger.log_error(err)
            return true
        }
    }

    // Sends a pong response
    handler.public.ping_server = function(socket, data)
    {
        handler.user_emit(socket, 'pong_received', {date:data.date})
    }

    // Handles activity signals
    handler.public.activity_trigger = async function(socket, data)
    {
        if(!handler.check_permission(socket, "chat"))
        {
            return false
        }

        socket.hue_activity_counter += 1

        if(socket.hue_activity_counter >= 2)
        {
            let spam_ans = await handler.add_spam(socket)

            if(!spam_ans)
            {
                return false
            }

            socket.hue_activity_counter = 0
        }

        socket.hue_last_activity_trigger = Date.now()

        handler.update_user_in_userlist(socket)

        handler.room_emit(socket, 'activity_trigger',
        {
            username: socket.hue_username
        })
    }
}