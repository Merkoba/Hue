var express = require('express')
var router = express.Router()
var config = require('../config.json')

var c = {}

c.site_root = config.site_root
c.main_room = config.main_room
c.default_image_url = config.default_image_url
c.default_radiosrc = config.default_radiosrc
c.default_radioinfo = config.default_radioinfo
c.check_metadata_interval_duration = config.check_metadata_interval_duration
c.chat_crop_limit = config.chat_crop_limit
c.max_input_length = config.max_input_length
c.max_topic_length = config.max_topic_length
c.afk_timeout_duration = config.afk_timeout_duration
c.heartbeat_interval = config.heartbeat_interval

router.get('/', function(req, res, next) 
{
    c.room = config.main_room
	res.render('main', c)
})

router.get('/:id', function(req, res, next) 
{
    c.room = req.params.id.substr(0, 35).replace(/[<>"'\\\/]/g, '').trim()
	res.render('main', c)
})

module.exports = router
