'use strict';

const readline = require('readline')
const mongoose = require('mongoose');
const uri = require('./confg').localUri;

const options = {
	server: { poolSize: 5 },
}

mongoose.connect(uri, options);

// Only development mode
if (process.env.NODE_ENV === 'development') {
	mongoose.connection.on('connected', function () {
		console.log('DB Connection established ' + uri);
	});

	mongoose.connection.on('error',function (err) {
		console.error('Mongoose default connection error: ' + err);
	});

	// Reusable function to close Mongoose connection
	let gracefulShutdown = function (msg, callback) {
		mongoose.connection.close(() => {
			console.log('Mongoose disconnected through ' + msg);
			callback();
		});
	};

	process.on('SIGTERM', () => {
		gracefulShutdown('App Termination', () => {
			process.exit(0);
		});
	});

	process.once('SIGUSR2', () => {
		gracefulShutdown('Nodemon Restarts', () => {
			process.kill(process.pid, 'SIGUSR2');
		});
	});

	// Listening to SIGINT in Windows
	if(process.platform === 'win32') {
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdin
		});
		rl.on('SIGINT', () => {
			process.emit('SIGINT');
		});
	}
} else if (process.env.NODE_ENV === 'production') {
	// Only production mode
	mongoose.connection.on('connected', function () {
		console.log('DB Connection established');
	});

	mongoose.connection.on('error',function (err) {
		console.error('Mongoose default connection error: ' + err);
	});

	// Reusable function to close Mongoose connection
	let gracefulShutdown = function (msg, callback) {
		mongoose.connection.close(() => {
			console.log('Mongoose disconnected through ' + msg);
			callback();
		});
	};

	// Server termination
	process.on('SIGTERM', () => {
		gracefulShutdown('Server process either crashed OR shutdown', () => {
			process.exit(0);
		});
	});
}