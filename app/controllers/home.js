var config = require('../../config/config'),
    uploaders = require('../models/uploaders'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    files = require('../models/files'),
    path = require('path');

exports.index = function(req, res){
  res.send({status: 200, result: 'OK'});
};

exports.upload = function(req, res){
  var id = uuid.v1();
  var rstream = fs.createReadStream(req.files.file.path);
  console.log("Using", config.upload.uploader, "to upload file");
  uploaders[config.upload.uploader](config.upload, id, req.files.file.name, rstream, function(err, data) {
    if (err) {
      console.log("Error when uploading", err);
      res.status(err.statusCode).send({status: err.statusCode, error: "Could not upload file to server", code: err.code});
      return
    }
    files.addFile(req.io, id);
    req.amqp.sendToQueue(config.amqp.worker_queue, new Buffer(JSON.stringify({
      action: 'split',
      id: id,
      extension: path.extname(req.files.file.name),
      source: config.upload.uploader
    })), {}, function(confirm) {
      console.log("Received answer from split", confirm);
    });
    console.log("Tried to publish message");
    res.send({status: 200, id: id});
  });
};
