const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const serverPath = process.env.NODE_ENV === 'production' ? 'server-dist' : 'server';
const authentication = require(`./${serverPath}/middleware/authentication`); // eslint-disable-line

const dotenv = require('dotenv');

dotenv.config();

// Set up the express app
const app = express();

const port = parseInt(process.env.PORT, 10) || 5000;


app.set('port', port);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// require jwt token for authenticated routes
app.use('/api', authentication.verifyToken);
// app.use('/auth/api', authentication.verifyToken);


require(`./${serverPath}/routes`)(app); // eslint-disable-line

app.use(express.static(path.resolve(`${__dirname}/public`)));

// Setup a default catch-all route that sends back a
// welcome message in JSON format.

app.get('*', function (request, response) {
  response.sendFile(path.resolve(`${__dirname}/public/index.html`));
});

app.listen(port, () => {
  console.log('\nApplication is running on port ', port);
});

module.exports = app;
