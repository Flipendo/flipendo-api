var app = require('express')(),
    server = require('http').createServer(app),
    config = require('./config/config'),
    io = require('socket.io')(server);

app.set('io', io);

server.listen(config.port);

require('./config/express')(app, config);
require('./config/routes')(app);
require('./config/amqp')(app, config);
