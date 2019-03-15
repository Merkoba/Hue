module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Handles synth mode changes
    handler.public.change_synth_mode = function(socket, data)
    {
        if(!handler.is_admin_or_op(socket))
        {
            return handler.get_out(socket)
        }

        if(data.what !== "enabled" && data.what !== "disabled")
        {
            return handler.get_out(socket)
        }

        vars.rooms[socket.hue_room_id].synth_mode = data.what

        db_manager.update_room(socket.hue_room_id,
        {
            synth_mode: data.what
        })

        handler.room_emit(socket, 'room_synth_mode_change',
        {
            what: data.what,
            username: socket.hue_username
        })

        handler.push_admin_log_message(socket, `changed the synth mode to "${data.what}"`)
    }

    // Handles synth keys
    handler.public.send_synth_key = async function(socket, data)
    {
        if(data.key === undefined)
        {
            return handler.get_out(socket)
        }

        if(typeof data.key !== "number")
        {
            return handler.get_out(socket)
        }

        if(isNaN(data.key))
        {
            return handler.get_out(socket)
        }

        if(data.key < 1 || data.key > utilz.synth_notes.length)
        {
            return handler.get_out(socket)
        }

        if(!handler.check_permission(socket, "synth"))
        {
            return false
        }

        socket.hue_synth_counter += 1

        if(socket.hue_synth_counter >= 20)
        {
            let spam_ans = await handler.add_spam(socket)

            if(!spam_ans)
            {
                return false
            }

            socket.hue_synth_counter = 0
        }

        handler.room_emit(socket, 'receive_synth_key',
        {
            key: data.key,
            username: socket.hue_username,
            user_id: socket.hue_user_id
        })
    }

    // Handles synth voices
    handler.public.send_synth_voice = async function(socket, data)
    {
        if(data.text === undefined)
        {
            return handler.get_out(socket)
        }

        if(data.text.length === 0)
        {
            return handler.get_out(socket)
        }

        if(data.text.length > config.synth_max_voice_text)
        {
            return handler.get_out(socket)
        }

        if(data.text !== utilz.clean_string2(data.text))
        {
            return handler.get_out(socket)
        }

        if(!handler.check_permission(socket, "synth"))
        {
            return false
        }

        handler.room_emit(socket, 'receive_synth_voice',
        {
            text: data.text,
            username: socket.hue_username,
            user_id: socket.hue_user_id
        })
    }
}