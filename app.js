'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// Require Database Configurations
require('./config/database.config');

const app = express();

const api = require('./routes/api/index');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Import API
app.use('/api', api);

if (process.env.NODE_ENV === 'development') {
	console.log('==> Dev mode <== enabled!')
}

// Error Handling
app.use(function(err, req, res, next){
	if (process.env.NODE_ENV === 'development') {
		res.sendStatus(500).json({error: err.stack});
	} else if (process.env.NODE_ENV === 'production') {
		res.status(500).json({error: 'Internal Server Error.'});
	}
});

module.exports = app;