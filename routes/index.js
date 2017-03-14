var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) 
{
    var c = {};
    c.id = 'main';
	res.render('main', c);
});

router.get('/:id', function(req, res, next) 
{
    var c = {};
    c.id = req.params.id.substr(0, 35).replace(/[<>"'\\\/]/g, '').trim()
	res.render('main', c);
});

module.exports = router;
