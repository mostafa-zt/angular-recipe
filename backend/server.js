var debug = require('debug')('node-angular');
var http = require('http');
var app = require('./app.js');

const normalizePort = val => {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  };

const port = normalizePort(process.env.PORT || '4300');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function onListening() {
    const addr = server.address();
    debug('Listening on ' + port);
}