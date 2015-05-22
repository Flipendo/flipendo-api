var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'flipendo-api'
    },
    upload: {
      uploader: 's3',
      bucket: 'flipendo',
      baseDir: 'files',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    amqp: {
      host: 'localhost',
      port: 5672,
      worker_queue: 'flipendo-worker',
      api_queue: 'flipendo-api'
    },
    port: 3000,
  },
  production: {
    root: rootPath,
    app: {
      name: 'flipendo-api'
    },
    upload: {
      uploader: 's3',
      bucket: 'flipendo',
      baseDir: 'files',
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    amqp: {
      host: '',
      port: 5672,
      worker_queue: 'flipendo-worker',
      api_queue: 'flipendo-api',
    },
    port: 3000,
  },
  docker: {
    root: rootPath,
    app: {
      name: 'flipendo-api'
    },
    upload: {
      uploader: 's3',
      bucket: 'flipendo',
      baseDir: 'files',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    amqp: {
      host: process.env.RABBITMQ_PORT_5672_TCP_ADDR,
      port: process.env.RABBITMQ_PORT_5672_TCP_PORT,
      worker_queue: 'flipendo-worker',
      api_queue: 'flipendo-api'
    },
    port: 3000,
  },
};

module.exports = config[env];
