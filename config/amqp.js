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
        console.log("Message received", message)
        if (message.action == "split") {
          console.log("message action split");
          files.updateChunks(app.get('io'), message.id, message.chunks);
        }
      });
      console.log('Subscribed to', config.amqp.api_queue);
    });
  });
  return connection;
};
