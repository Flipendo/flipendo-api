var app = require('express')(),
    server = require('http').createServer(app),
    config = require('./config/config'),
    io = require('socket.io')(server);

app.set('io', io);

server.listen(3000);

require('./config/express')(app, config);
require('./config/routes')(app);
