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
        console.log("Message received", message);
        if (message.action == "split") {
          files.updateChunks(app.get('io'), message.id, message.chunks);
        } else if (message.action == "transcoded") {
          files.updateChunk(app.get('io'), message.id, message.chunk, message.done, message.error);
          files.checkIntegrity(connection, message.id);
        } else if (message.action == "merged") {
          files.done(connection, message.id);
        }
        message.acknowledge(false);
      });
      console.log('Subscribed to', config.amqp.api_queue);
    });
  });
  return connection;
};
