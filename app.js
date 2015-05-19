var express = require('express'),
  fs = require('fs'),
  config = require('./config/config');

var app = express();

require('./config/express')(app, config);
require('./config/routes')(app);

app.listen(config.port);
