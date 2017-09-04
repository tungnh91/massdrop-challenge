'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWorkerFrequency = exports.runWorker = undefined;

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _queue = require('./queue.js');

var _queue2 = _interopRequireDefault(_queue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * runWorker looks at the queue and process item in a FIFO fashion
 * it fetches html from source, and replace value with the html that it got back
 * if fetch fail, a <p> tag is generated to let user know.
 */
var runWorker = exports.runWorker = function runWorker() {
  var redisClient = _redis2.default.createClient();
  var jobQueue = new _queue2.default('jobs', redisClient);

  jobQueue.pop(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, job) {
      var jobId;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!err) {
                _context.next = 2;
                break;
              }

              throw new Error(err);

            case 2:
              _context.next = 4;
              return job[1];

            case 4:
              jobId = _context.sent;


              redisClient.get('jobId-' + jobId, function (err, url) {
                var options = {
                  url: url,
                  timeout: 3000
                };

                _request2.default.get(options, function (error, response, data) {
                  var content = void 0;
                  if (!error && response.statusCode == 200) {
                    console.log('html request for ' + url + ' successful');
                    content = data;
                  } else {
                    content = '<p>Failed to retrieve HTML for the requested site. Please go back and check the URL<p>';
                  }

                  redisClient.set(url, content);
                });
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
};

/**
 * clear out existing interval and set a new one for worker
 */
var setWorkerFrequency = exports.setWorkerFrequency = function setWorkerFrequency(freq) {
  console.log('Setting worker frequency to ' + freq + ' ms');

  if (workerInterval) clearInterval(workerInterval);
  var workerInterval = setInterval(runWorker, freq);
};