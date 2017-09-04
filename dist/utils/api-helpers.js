'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeWorkerFrequency = exports.goToSite = exports.getJobStatus = exports.createJob = undefined;

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _queue = require('./queue.js');

var _queue2 = _interopRequireDefault(_queue);

var _jobRunner = require('./job-runner.js');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * jobId is generated based on the current epoch time and a random number for extra uniqueness
 */
var getJobId = function getJobId() {
  var current_date = new Date().valueOf().toString();
  var random = Math.random().toString();
  var jobId = _crypto2.default.createHash('sha256').update(current_date + random).digest('hex');
  return jobId;
};

var redisClient = _redis2.default.createClient();
var jobQueue = new _queue2.default('jobs', redisClient);

/**
 * createJob calls getJobId.
 * After jobId is generated, it's enqueued and is added to Redis instance with 
 * key is the id and value is the url.
 * The response object is sent back to user along with status update
 */
var createJob = exports.createJob = function createJob(req, res) {
  var jobId = getJobId();
  var formattedUrl = _url2.default.parse(req.body.url).protocol ? reqUrl : 'http://' + req.body.url;

  jobQueue.push(jobId);
  redisClient.set('jobId-' + jobId, formattedUrl);

  res.send(JSON.stringify({
    jobId: jobId,
    url: formattedUrl,
    html: '',
    completed: false
  }));
};

/**
 * Collect id from user as an argument, and perform check against the DB
 * Response is a boolean indicating whether the job exists
 */
var getJobStatus = exports.getJobStatus = function getJobStatus(req, res) {
  var id = req.params.id;
  redisClient.get('jobId-' + id, function (err, reqUrl) {
    if (err) {
      res.status(400);
    } else {
      redisClient.exists(reqUrl, function (error, result) {
        res.send(!!result);
      });
    };
  });
};

/**
 * Collect id from user as an argument, and perform check against the DB
 * Response is the collected html if worker ran
 */
var goToSite = exports.goToSite = function goToSite(req, res) {
  var id = req.params.id;
  redisClient.get('jobId-' + id, function (err, reqUrl) {
    if (err) {
      res.status(400);
    } else {
      redisClient.get(reqUrl, function (error, html) {
        if (error) {
          res.status(400);
        } else {
          res.send(html);
        }
      });
    };
  });
};

/**
 * handle requests to change frequency of worker in miliseconds
 */
var changeWorkerFrequency = exports.changeWorkerFrequency = function changeWorkerFrequency(req, res) {
  if (req.body.freq) {
    (0, _jobRunner.setWorkerFrequency)(req.body.freq);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
};