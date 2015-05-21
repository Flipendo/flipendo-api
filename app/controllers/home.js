var config = require('../../config/config'),
    uploaders = require('../models/uploaders'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    files = require('../models/files');

exports.index = function(req, res){
  res.send({status: 200, result: 'OK'})
};

exports.upload = function(req, res){
  var id = uuid.v1();
  var rstream = fs.createReadStream(req.files.file.path);
  uploaders[config.upload.uploader](config.upload, id, req.files.file.name, rstream, function(err, data) {
    if (err) {
      res.send({status: err.statusCode, error: "Could not upload file to server", code: err.code}, err.statusCode);
      return
    }
    files.addFile(req.io, id);
    res.send({status: 200, id: id});
  });
};
