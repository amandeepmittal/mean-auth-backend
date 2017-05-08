'use strict';

const router = require('express').Router();

router.get('/', function (req, res) {
	res.status(200);
});

module.exports = router;