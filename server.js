'use strict';
const log = console.log
log('Express server')

const express = require('express');
const app = express();

const path = require('path');

app.use(express.static(path.join(__dirname, '/pub')))

app.get('/', (req, res) => {
	res.send('example.html');
})