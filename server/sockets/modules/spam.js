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
  // Adds a spam point to the socket in the anti-spam system
  handler.add_spam = async function (socket) {
    try {
      await vars.anti_spam.addSpam(socket)
      return true
    } catch (err) {
      return false
    }
  }
}
