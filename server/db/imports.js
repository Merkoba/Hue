module.exports = (stuff) => {
  stuff.i = {}
  stuff.i.fs = require(`fs`)
  stuff.i.fsp = require(`fs`).promises
  stuff.i.path = require(`path`)
  stuff.i.bcrypt = require(`bcrypt`)
}