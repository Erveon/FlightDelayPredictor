var express = require('express');
var data = require('../lib/dataloader');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		airports: data.getAirports().sort(),
		airlines: data.getAirlines().sort()
	});
});

router.get('/delay', function(req, res, next) {
	let month = parseInt(req.query.month), day = parseInt(req.query.day);
	let from = req.query.from, to = req.query.to, airline = req.query.airline;
	let delay = (Math.round(data.getDelay(from, to, month, day, airline) * 100) / 100);
	console.log(month + ", " + day + ", " + from + ", " + to + ", " + airline);
	res.json({
		"delay": delay
	});
});

module.exports = router;
