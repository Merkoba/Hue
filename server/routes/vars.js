module.exports = function (c, config) {
  for (let key in config) {
    c.vars[key] = config[key]
  }
}