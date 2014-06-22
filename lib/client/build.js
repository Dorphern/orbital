var browserify = require('browserify');

var wstream = require('fs').createWriteStream(require.resolve('./orbital.client'));
wstream.once('open', function() {
  b.pipe(wstream);
});

var brows = browserify();
brows.add(require.resolve('./client'));
var b = brows.bundle();
b.on('error', console.error);

