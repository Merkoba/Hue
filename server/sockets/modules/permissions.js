module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Handles voice permission changes
    handler.public.change_voice_permission = function(socket, data)
    {
        if(!handler.is_admin_or_op(socket))
        {
            return handler.get_out(socket)
        }

        if(data.what !== true && data.what !== false)
        {
            return handler.get_out(socket)
        }

        if(data.ptype === undefined)
        {
            return handler.get_out(socket)
        }

        if(vars.rooms[socket.hue_room_id][data.ptype] === undefined)
        {
            return handler.get_out(socket)
        }

        vars.rooms[socket.hue_room_id][data.ptype] = data.what

        let obj = {}

        obj[data.ptype] = data.what

        db_manager.update_room(socket.hue_room_id, obj)

        handler.room_emit(socket, 'voice_permission_change',
        {
            ptype: data.ptype,
            what: data.what,
            username: socket.hue_username
        })

        handler.push_admin_log_message(socket, `changed ${data.ptype} to "${data.what}"`)
    }

    // Checks if a user has the required media permission
    handler.check_permission = function(socket, permission)
    {
        if(vars.media_types.includes(permission))
        {
            let pmode = vars.rooms[socket.hue_room_id][`${permission}_mode`]

            if(pmode !== "enabled")
            {
                return false
            }
        }

        if(handler.is_admin_or_op(socket))
        {
            return true
        }

        else if(vars.vtypes.includes(socket.hue_role))
        {
            if(vars.rooms[socket.hue_room_id][`${socket.hue_role}_${permission}_permission`])
            {
                return true
            }

            return false
        }

        else
        {
            return false
        }
    }
}