var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'flipendo-api'
    },
    port: 3000,
    db: 'mongodb://localhost/flipendo-api-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'flipendo-api'
    },
    port: 3000,
    db: 'mongodb://localhost/flipendo-api-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'flipendo-api'
    },
    port: 3000,
    db: 'mongodb://localhost/flipendo-api-production'
  }
};

module.exports = config[env];
