const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

// Set up the express app
const app = express();
const http = require('http');

const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Setup a default catch-all route that sends back a
// welcome message in JSON format.
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the new beginning of nothingness!!',
}));

const server = http.createServer(app);
server.listen(port);

module.exports = app;
