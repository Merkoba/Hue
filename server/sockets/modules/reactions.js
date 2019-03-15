module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Handles sending reactions
    handler.public.send_reaction = function(socket, data)
    {
        if(data.reaction_type === undefined)
        {
            return handler.get_out(socket)
        }

        if(!vars.reaction_types.includes(data.reaction_type))
        {
            return handler.get_out(socket)
        }

        if(!handler.check_permission(socket, "chat"))
        {
            return false
        }

        handler.room_emit(socket, 'reaction_received',
        {
            username: socket.hue_username,
            reaction_type: data.reaction_type,
            profile_image: socket.hue_profile_image
        })

        if(vars.rooms[socket.hue_room_id].log)
        {
            let message =
            {
                type: "reaction",
                data:
                {
                    username: socket.hue_username,
                    reaction_type: data.reaction_type,
                    profile_image: socket.hue_profile_image
                },
                date: Date.now()
            }

            handler.push_log_message(socket, message)
        }
    }
}