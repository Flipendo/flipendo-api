var express = require('express'),
    config = require('./config/config');

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

var server = app.listen(3000);

io = require('socket.io').listen(server, { log: false });
require('./app/io')(io);
