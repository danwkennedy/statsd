
/**
 * Module dependencies.
 */

var Stats = require('statsy');

/**
 * Initialize stats middleware with `opts`
 * which are passed to statsy.
 *
 * @param {Object} [opts]
 * @return {Function}
 * @api public
 */

module.exports = function(opts){
  opts = opts || {};
  var s = new Stats(opts);

  return function *stats(next){
    // counters
    s.incr('request.count');
    s.incr('request.' + this.method + '.count');

    // size
    s.histogram('request.size', this.request.length || 0);

    // remote addr
    s.set('request.addresses', this.ip);

    // duration
    var duration = s.timer('request.duration');
    this.res.on('finish', function() {
      duration();
      s.incr('response.count');
      s.incr('response.' + this.response.status + '.count');
      s.histogram('response.size', this.response.length);
    }.bind(this));

    yield next;
  };
};
