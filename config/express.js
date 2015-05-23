var express = require('express');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

module.exports = function(app, config) {
  app.configure(function () {
    app.use(express.compress());
    app.set('port', config.port);
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(function(req, res, next) {
      req.io = app.get('io');
      req.amqp = app.get('amqp_connection');
      next();
    });
    app.use(app.router);
    app.use(function(req, res) {
      res.status(404).send({ status: 404, results: [] }, 404);
    });
  });
};
