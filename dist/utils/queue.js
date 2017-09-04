"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
  function Queue(name, client) {
    _classCallCheck(this, Queue);

    this.name = name;
    this.client = client;
    this.timeout = 0;
  }

  /**
   * Insert all the specified values at the tail of the list stored at key
   */


  _createClass(Queue, [{
    key: "push",
    value: function push(data) {
      this.client.rpush(this.name, data);
    }

    /**
     * An element is popped from the head of the list and returned to the caller together with the key it was popped from.
     */

  }, {
    key: "pop",
    value: function pop(callback) {
      this.client.blpop(this.name, this.timeout, callback);
    }
  }]);

  return Queue;
}();

exports.default = Queue;