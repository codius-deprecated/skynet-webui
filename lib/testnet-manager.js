var Guid = require('guid');
var Promise = require('bluebird').Promise;

var TestnetManager = function(redis) {
  this.redis = redis;
};

TestnetManager.prototype = {
  getNetworks: function() {
    var self = this;
    return Promise.resolve([{guid: Guid.create()}]);
  }
};

module.exports = TestnetManager;
