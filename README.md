# User Auth MEAN Stack Boilerplate

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This minimalistic repo is production ready!

## Technology and Modules
* Nodejs/ExpressJS
* MongoDB
* Mongoose _ODM_
* JWT Tokens

## Getting Started
To get the node server running locally:
* Clone/download this repo
* `npm install` to install all required dependencies
* `npm run dev` to start the local server

### Application Structure
* `app.js`: The entry point to our application. This file defines express server. It also requires API routes.
* `config/`: This directory contains MONGODB database configuration and connection using Mongoose. All other configuration (such as JWT tokens) should go here.
* `routes/api`: Contains all the rest API routes.
* `models/`: Must contain database schema

## Running
To test everything is running:
```shell
# from Terminal 1 window:
$ npm run dev

# from Terminal 2 window:
$ curl -X GET http://localhost:3000
# you will get status 200 for route /api/
```
