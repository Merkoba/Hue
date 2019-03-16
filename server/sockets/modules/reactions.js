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

        let id = handler.generate_message_id()

        handler.room_emit(socket, 'reaction_received',
        {
            id: id,
            username: socket.hue_username,
            reaction_type: data.reaction_type,
            profile_image: socket.hue_profile_image
        })

        if(vars.rooms[socket.hue_room_id].log)
        {
            let message =
            {
                id: id,
                type: "reaction",
                date: Date.now(),
                data:
                {
                    username: socket.hue_username,
                    reaction_type: data.reaction_type,
                    profile_image: socket.hue_profile_image
                }
            }

            handler.push_log_message(socket, message)
        }
    }
}