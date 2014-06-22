var http = require('http');
var orbital = require('../');

var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<script src="/orbital/orbital.js"></script>\n');
}).listen(1337, '127.0.0.1');

console.log("started server");

orbital.serveToClient(server);
