'use strict';

const router = require('express').Router();

router.get('/', function (req, res) {
	res.status(200).send('Working...');
});

module.exports = router;