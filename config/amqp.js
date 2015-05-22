var amqp = require('amqp'),
    files = require('../app/models/files');

module.exports = function(app, config) {
  console.log("Connecting to rabbitmq");
  var connection = amqp.createConnection({ host: config.amqp.host });
  app.set('amqp_connection', connection);
  connection.on('ready', function () {
    console.log("Connected to rabbitmq");
    connection.queue(config.amqp.api_queue, function (q) {
      q.subscribe(function(message) {
        console.log("received a message", message);
      });
      console.log('Subscribed to', config.amqp.api_queue);
    });
  });
  return connection;
};
