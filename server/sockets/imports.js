module.exports = (App) => {
  App.i = {}
  App.i.fs = require(`fs`)
  App.i.fsp = require(`fs`).promises
  App.i.path = require(`path`)
  App.i.fetch = require(`node-fetch`)
  App.i.jwt = require(`jsonwebtoken`)
  App.i.image_dimensions = require(`image-size`)
  App.i.cheerio = require(`cheerio`)
  App.i.redis = require(`redis`)
  App.i.he = require(`he`)
  App.i.exiftool = require(`exiftool-vendored`).exiftool
}