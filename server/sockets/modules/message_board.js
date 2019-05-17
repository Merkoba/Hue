module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Handles message board posting
    handler.public.message_board_post = async function(socket, data)
    {
        if(!data.message)
        {
            return handler.get_out(socket)
        }

        if(data.message !== utilz.clean_string2(data.message))
        {
            return handler.get_out(socket)
        }

        if(data.message.length > config.max_message_board_post_length)
        {
            return handler.get_out(socket)
        }

        for(let item of socket.hue_message_board_dates)
        {
            if(item.room_id === socket.hue_room_id)
            {
                if(Date.now() - item.date < config.message_board_post_delay)
                {
                    return false
                }

                break
            }
        }

        let message_board_dates = await db_manager.save_message_board_date(socket.hue_user_id, socket.hue_room_id)
        handler.modify_socket_properties(socket, {hue_message_board_dates:message_board_dates})
        
        let item = handler.push_message_board_post(socket, data.message)
        handler.room_emit(socket, 'new_message_board_post', item)

        for(let room_id of vars.user_rooms[socket.hue_user_id])
        {
            for(let socc of handler.get_user_sockets_per_room(room_id, socket.hue_user_id))
            {
                handler.user_emit(socc, "last_message_board_post_date_update", {date:item.date})
            }
        }
    }

    // Pushes pushing room message board posts
    handler.push_message_board_post = function(socket, message)
    {
        let room = vars.rooms[socket.hue_room_id]
        let item = {message:message, date:Date.now()}

        room.message_board_posts.push(item)

        if(room.message_board_posts.length > config.max_message_board_posts)
        {
            room.message_board_posts = room.message_board_posts.slice(room.message_board_posts.length - config.max_message_board_posts)
        }

        db_manager.update_room(socket.hue_room_id, {message_board_posts:room.message_board_posts})

        return item
    }
}