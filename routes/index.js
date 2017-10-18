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
c.general_opacity = config.general_opacity
c.color_contrast_amount = config.color_contrast_amount
c.chat_crop_limit = config.chat_crop_limit
c.max_input_length = config.max_input_length
c.max_topic_length = config.max_topic_length
c.max_username_length = config.max_username_length
c.max_roomname_length = config.max_roomname_length
c.max_radiosrc_length = config.max_radiosrc_length
c.max_title_topic_length = config.max_title_topic_length
c.max_input_history_items = config.max_input_history_items
c.max_image_size = config.max_image_size
c.topic_separator = config.topic_separator
c.title_topic_separator = config.title_topic_separator
c.default_topic = config.default_topic
c.default_topic_claimed = config.default_topic_claimed
c.afk_timeout_duration = config.afk_timeout_duration
c.heartbeat_interval = config.heartbeat_interval

router.get('/', function(req, res, next) 
{
	c.room = config.main_room
	res.render('main', c)
})

router.get('/:id', function(req, res, next) 
{
	c.room = req.params.id.substr(0, config.max_roomname_length).replace(/[^a-z0-9\-_\s]+/gi, "").replace(/\s+/g, " ").trim()
	res.render('main', c)
})

module.exports = router
