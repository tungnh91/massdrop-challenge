'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _apiHelpers = require('./utils/api-helpers.js');

var _jobRunner = require('./utils/job-runner.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var router = _express2.default.Router();

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_express2.default.static(_path2.default.resolve(__dirname + '/../client')));

/**
 * Routes options
 * Root dir is default to index.html
 */
app.get('/', function (req, res) {
  res.render('index.html');
});
app.get('/jobs/:id', _apiHelpers.getJobStatus);
app.get('/redirect/:id', _apiHelpers.goToSite);
app.get('/*', function (req, res) {
  res.redirect('/');
});
/**
 * POST request handlers
 * Go to function definition (./utils/api-helpers.js) for usage
 */
app.post('/jobs', _apiHelpers.createJob);
app.post('/worker', _apiHelpers.changeWorkerFrequency);
app.listen(8000, function () {
  console.log('listening on port 8000');
});

/**
 * Worker will wake up every 10 seconds by default.
 */
(0, _jobRunner.setWorkerFrequency)(10000);