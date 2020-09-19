module.exports = function (
  handler,
  vars,
  io,
  db_manager,
  config,
  sconfig,
  utilz,
  logger
) {
  // Handles sending reactions
  handler.public.send_reaction = function (socket, data) {
    if (!data.reaction_type || !data.reaction_target) {
      return false
    }
    
    if (!vars.reaction_types.includes(data.reaction_type)) {
      return false
    }
    
    if (!vars.reaction_targets.includes(data.reaction_target)) {
      return false
    }

    if (data.reaction_source) {
      if (data.reaction_source.length > config.max_media_source_length) {
        return false
      }
    }

    let id = handler.generate_message_id()

    handler.room_emit(socket, "reaction_received", {
      id: id,
      username: socket.hue_username,
      reaction_type: data.reaction_type,
      reaction_target: data.reaction_target,
      reaction_source: data.reaction_source,
      profile_image: socket.hue_profile_image,
    })

    if (data.reaction_target === "chat") {
      let message = {
        id: id,
        type: "reaction",
        date: Date.now(),
        data: {
          username: socket.hue_username,
          reaction_type: data.reaction_type,
          reaction_target: data.reaction_target,
          reaction_source: data.reaction_source,
          profile_image: socket.hue_profile_image,
        },
      }

      handler.push_log_message(socket, message)
    }
  }
}
