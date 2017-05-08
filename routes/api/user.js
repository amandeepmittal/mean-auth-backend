'use strict';

const router = require('express').Router();
const User = require('../../models/user');
const auth = require('../helpers/auth');
const config = require('../../config/confg');
const jwt = require('jwt-simple');
const moment = require('moment');

// generate token
function generateToken (user) {
	let payload = {
		sub: user._id,
		iat: moment().unix(),
		exp: moment().add(1, 'days').unix()
	};
	return jwt.encode(payload, config.tokenSecret);
}

// login
router.post('/login', (req, res) => {
	User
		.findOne({email: req.body.email})
		.exec((err, user) => {
			if (err) res.status(500).send({message: err.message});
			if (!user) {
				return res.status(401).send({ message: 'Invalid email and/or password' });
			}
			if (user) {
				user.comparePassword(req.body.password, function (err, isMatch) {
					if (err) res.status(500).send({message: err.message});
					if (!isMatch) {
						return res.status(401).send({msg: 'Invalid email or password'});
					}
					res.send({
						token: generateToken(user),
						// TODO: on refactor remove this, only send token
						user: user.toJSON()
					});
				});
			}
		});
});

// signup
router.post('/signup', (req, res) => {

	User
		.findOne({email: req.body.email})
		.exec((err, userExists) => {
			if(userExists) return res.status(401).send('User Already Exists.');

			let user = new User();
			user.email = req.body.email;
			user.password = req.body.password;

			user.save((err, user) => {
				if(err) res.status(500).send({ message: err.message });
				res.status(200).send({
					token: generateToken(user),
					// TODO: on refactor remove this, only send token
					user: user.toJSON()
				})
			});
		});
});

router.route('/profile')
	.get(auth.ensureAuthentication, (req, res) => {
		User.findById(req.user, (err, user) => {
			if(err) res.status(500).send({ message: err.message });
			res.status(200).json({'user': user});
		})
	})
	.put(auth.ensureAuthentication, (req, res) => {
		User
			.findById(req.user)
			.exec((err, user) => {
				if('password' in req.body) {
					user.password = req.body.password
				} else {
					user.name = req.body.name;
					user.profile.website = req.body.website;
					// user.profile.image = req.body.image;
					user.location.city = req.body.city;
					user.location.country = req.body.country;

					user.save((err) => {
						if (err) res.status(500).send({message: err.message});
						res.status(200).send('Profile updated');
					});
				}
			});
	})
	.delete(auth.ensureAuthentication, (req, res) => {
		User
			.findById(req.user)
			.exec((err, user) => {
				if(err) res.status(500).send({ message: err.message });
				user.remove((err) => {
					if (err) res.status(500).send({message: err.message});
					res.status(204).send('User has been permanently removed');
				});
			});
	});

module.exports = router;