require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
require('dotenv-safe').config();


app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.all('/', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());


// global error handler
app.use(errorHandler);

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('components/users/users.controller'));
app.use('/attributes', require('components/attributes/attributes.controller'));
app.use('/issues', require('components/issues/issues.controller'));
app.use('/performances', require('components/performances/performances.controller'));
app.use('/studies', require('components/studies/studies.controller'));
app.use('/concentrators', require('components/concentrators/concentrators.controller'));
app.use('/packages', require('components/packages/packages.controller'));



// start server
const server = app.listen(process.env.PORT, function () {
  console.log('Server listening on ' + process.env.ENV + ' mode');
  console.log('Server listening on port ' + process.env.PORT);
});

