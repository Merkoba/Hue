var express = require('express')
var router = express.Router()
var config = require('../config.json')

var c = {}

c.vars = {}

c.vars.site_root = config.site_root
c.vars.main_room_id = config.main_room_id
c.vars.default_image_url = config.default_image_url
c.vars.loading_image_url = config.loading_image_url
c.vars.default_radio_source = config.default_radio_source
c.vars.check_metadata_interval_duration = config.check_metadata_interval_duration
c.vars.general_opacity = config.general_opacity
c.vars.color_contrast_amount = config.color_contrast_amount
c.vars.default_modal_color = config.default_modal_color
c.vars.chat_crop_limit = config.chat_crop_limit
c.vars.played_crop_limit = config.played_crop_limit
c.vars.history_crop_limit = config.history_crop_limit
c.vars.max_input_length = config.max_input_length
c.vars.max_topic_length = config.max_topic_length
c.vars.max_username_length = config.max_username_length
c.vars.max_room_name_length = config.max_room_name_length
c.vars.max_radio_source_length = config.max_radio_source_length
c.vars.max_title_length = config.max_title_length
c.vars.max_no_meta_count = config.max_no_meta_count
c.vars.small_keyboard_scroll = config.small_keyboard_scroll
c.vars.big_keyboard_scroll = config.big_keyboard_scroll
c.vars.max_image_size = config.max_image_size
c.vars.topic_separator = config.topic_separator
c.vars.title_separator = config.title_separator
c.vars.default_topic = config.default_topic
c.vars.default_topic_claimed = config.default_topic_claimed
c.vars.afk_timeout_duration = config.afk_timeout_duration
c.vars.heartbeat_interval = config.heartbeat_interval
c.vars.youtube_enabled = config.youtube_enabled

router.get('/', function(req, res, next) 
{
	c.vars.room_id = config.main_room_id
	res.render('main', c)
})

router.get('/:id', function(req, res, next) 
{
	c.vars.room_id = req.params.id.substr(0, config.max_room_id_length)
	res.render('main', c)
})

module.exports = router
