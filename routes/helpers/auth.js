'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../../config/confg');

function ensureAuthentication (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
	}

	let token = req.headers.authorization.split(' ')[1];

	let payload = null;

	try {
		payload = jwt.decode(token, config.tokenSecret);
	}
	catch (err) {
		return res.status(401).send({ message: err.message });
	}

	if (payload.exp <= moment().unix()) {
		return res.status(401).send({ message: 'Token has expired' });
	}
	req.user = payload.sub;
	next();
}

module.exports.ensureAuthentication = ensureAuthentication;