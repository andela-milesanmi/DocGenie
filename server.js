require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
// Set up the express app
const app = express();
const http = require('http');

const port = parseInt(process.env.PORT, 10) || 8000;
const authentication = require('./server/middleware/authentication');

app.set('port', port);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', authentication.verifyToken);

require('./server/routes')(app);
// Setup a default catch-all route that sends back a
// welcome message in JSON format.

// require jwt token for authenticated routes

app.get('*', (request, response) => response.status(200).send({
  message: 'Welcome to DocGenie API',
}));

const server = http.createServer(app);
server.listen(port);

module.exports = app;
