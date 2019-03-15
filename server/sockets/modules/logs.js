module.exports = function(handler, vars, io, db_manager, config, sconfig, utilz, logger)
{
    // Pushes a log message
    handler.push_log_message = function(socket, message)
    {
        let room_id

        if(typeof socket === "object")
        {
            room_id = socket.hue_room_id
        }

        else
        {
            room_id = socket
        }

        vars.rooms[room_id].log_messages.push(message)

        if(vars.rooms[room_id].log_messages.length > config.max_log_messages)
        {
            vars.rooms[room_id].log_messages = vars.rooms[room_id].log_messages.slice(vars.rooms[room_id].log_messages.length - config.max_log_messages)
        }

        vars.rooms[room_id].log_messages_modified = true
        vars.rooms[room_id].activity = true
    }

    // Pushes an admin log message
    handler.push_admin_log_message = function(socket, content)
    {

        let message =
        {
            type: "admin_activity",
            data:
            {
                username: socket.hue_username,
                content: content
            },
            date: Date.now()
        }

        vars.rooms[socket.hue_room_id].admin_log_messages.push(message)

        if(vars.rooms[socket.hue_room_id].admin_log_messages.length > config.max_admin_log_messages)
        {
            vars.rooms[socket.hue_room_id].admin_log_messages = vars.rooms[socket.hue_room_id].admin_log_messages.slice(vars.rooms[socket.hue_room_id].admin_log_messages.length - config.max_admin_log_messages)
        }

        vars.rooms[socket.hue_room_id].admin_log_messages_modified = true
        vars.rooms[socket.hue_room_id].activity = true
    }

    // Pushes an access log message
    handler.push_access_log_message = function(socket, action)
    {
        vars.rooms[socket.hue_room_id].activity = true

        let message =
        {
            type: "access_activity",
            data:
            {
                username: socket.hue_username,
                content: action
            },
            date: Date.now()
        }

        vars.rooms[socket.hue_room_id].access_log_messages.push(message)

        if(vars.rooms[socket.hue_room_id].access_log_messages.length > config.max_access_log_messages)
        {
            vars.rooms[socket.hue_room_id].access_log_messages = vars.rooms[socket.hue_room_id].access_log_messages.slice(vars.rooms[socket.hue_room_id].access_log_messages.length - config.max_access_log_messages)
        }

        vars.rooms[socket.hue_room_id].access_log_messages_modified = true
        vars.rooms[socket.hue_room_id].activity = true
    }
}