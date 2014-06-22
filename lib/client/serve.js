
var read = require('fs').readFileSync;
var clientSource = read(require.resolve('./orbital.client.js'), 'utf-8');
var clientVersion = require('../../package.json').clientVersion;


var serve = function(req, res) {
  if (req.headers.etag && clientVersion === req.headers.etag) {
    res.writeHead(304);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('ETag', clientVersion);
  res.writeHead(200);
  res.end(clientSource);
}

module.exports = function(srv) {
  var url = '/orbital/orbital.js';
  var evs = srv.listeners('request').slice(0);

  srv.removeAllListeners('request');
  srv.on('request', function(req, res) {
    if(req.url.indexOf(url) === 0) {
      serve(req, res);
    } else {
      for (var i = 0; i < evs.length; i++) {
        evs[i].call(srv, req, res);
      }
    }
  });
};

