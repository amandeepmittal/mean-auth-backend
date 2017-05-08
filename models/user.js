'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const saltWorkFactor = 10;

const userSchema = new Schema({
	email: {type: String, required: true, index: {unique: true}, trim: true},
	password: {type: String, required: true},
	name: {type: String, default: ''},
	profile: {
		image: {type: String, default: ''},
		website: {type: String, default: ''}
	},
	location: {
		city: {type: String, default: ''},
		country: {type: String, default: ''}
	}
}, {
	timestamps: true
});

// hash password before saving in DB
userSchema.pre('save', function (next) {
	let user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(saltWorkFactor, function (err, salt) {
		if(err) return next(err);

		// hash password along with generated salt
		bcrypt.hash(user.password, salt, function (err, hash) {
			if(err) return next(err);
			// override entered password with hashed
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(password, done) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		done(err, isMatch);
	});
};

module.exports = mongoose.model('User', userSchema);